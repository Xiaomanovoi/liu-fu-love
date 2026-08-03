(function () {
  const config = window.LOVE_SYNC_CONFIG || {};
  const hasConfig = Boolean(config.url && config.publishableKey);
  const featureCacheKey = "love-sync-feature-cache-v1";
  const sync = {
    client: null, user: null, coupleId: null, role: null, channel: null,
    timer: null, voiceRefreshTimer: null, refreshPromise: null, forceRefreshQueued: false,
    pendingState: null, saveInFlight: false, lastForegroundRefresh: 0,
    hydrated: false, applyingRemote: false
  };

  function emit(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function q(selector) {
    return document.querySelector(selector);
  }

  function readFeatureCache() {
    try { return JSON.parse(localStorage.getItem(featureCacheKey)) || {}; }
    catch { return {}; }
  }

  function writeFeatureCache(userId, patch) {
    if (!userId) return;
    const cache = readFeatureCache();
    cache[userId] = { ...(cache[userId] || {}), ...patch };
    localStorage.setItem(featureCacheKey, JSON.stringify(cache));
  }

  function emitCachedFeatures(userId) {
    const cached = readFeatureCache()[userId];
    if (!cached) return;
    if (cached.missStats) emit("love-miss-stats", cached.missStats);
    if (Array.isArray(cached.voiceMessages)) {
      const signedUrlsFresh = Date.now() - Number(cached.voicesCachedAt || 0) < 50 * 60 * 1000;
      const messages = signedUrlsFresh
        ? cached.voiceMessages
        : cached.voiceMessages.map((message) => ({ ...message, signedUrl: "" }));
      emit("love-voice-messages", messages);
    }
  }

  function clearFeatureCache(userId) {
    if (!userId) return;
    const cache = readFeatureCache();
    delete cache[userId];
    localStorage.setItem(featureCacheKey, JSON.stringify(cache));
  }

  function updateUi(mode, message) {
    const status = q("#syncStatus");
    const signedOut = q("#syncSignedOut");
    const pairing = q("#syncPairing");
    const connected = q("#syncConnected");
    status.textContent = message;
    status.dataset.mode = mode;
    signedOut.hidden = mode !== "signed-out";
    pairing.hidden = mode !== "pairing";
    connected.hidden = mode !== "connected";
    if (mode === "local") {
      signedOut.hidden = false;
      pairing.hidden = true;
      connected.hidden = true;
    }
  }

  function bindUi() {
    q("#syncEmailForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = q("#syncEmail").value.trim();
      const result = q("#inviteResult");
      if (!email) {
        result.textContent = "请先输入邮箱地址。";
        return;
      }
      if (!sync.client) {
        result.textContent = "同步服务还在加载，请稍等片刻后刷新网页再试。";
        return;
      }
      const button = event.currentTarget.querySelector("button");
      button.disabled = true;
      button.textContent = "发送中...";
      result.textContent = "正在发送登录链接...";
      try {
        const { error } = await sync.client.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin + window.location.pathname }
        });
        result.textContent = error ? loginLinkError(error) : "登录链接已发送。要在系统浏览器登录，请长按复制邮件链接，再粘贴到下方入口。";
      } catch (error) {
        result.textContent = "发送失败：网络连接异常，请检查网络后重试。";
      } finally {
        button.disabled = false;
        button.textContent = "发送登录链接";
      }
    });
    q("#magicLinkForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const value = q("#magicLinkInput").value.trim();
      try {
        const link = new URL(value);
        if (link.protocol !== "https:" || !link.hostname.endsWith("supabase.co")) throw new Error("invalid link");
        window.location.assign(link.href);
      } catch {
        q("#inviteResult").textContent = "登录链接格式不正确，请从邮件中复制完整链接。";
      }
    });
    q("#syncRolePicker").addEventListener("click", (event) => {
      const button = event.target.closest("[data-role]");
      if (!button) return;
      q("#syncRolePicker").querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
    });
    q("#createPair").addEventListener("click", createPair);
    q("#joinPairForm").addEventListener("submit", joinPair);
    q("#copyInviteCode").addEventListener("click", copyInviteCode);
    q("#syncSignOut").addEventListener("click", async () => {
      const userId = sync.user?.id;
      await flushSave();
      await sync.client.auth.signOut();
      clearFeatureCache(userId);
      resetConnection();
      updateUi("signed-out", "请登录");
      emit("love-sync-status", { connected: false, authenticated: false, needsPairing: false, role: null });
    });
  }

  function chosenRole() {
    return q("#syncRolePicker .is-active")?.dataset.role || "liu";
  }

  async function copyInviteCode() {
    const code = q("#syncInviteCode").textContent.trim();
    const button = q("#copyInviteCode");
    if (!code || code === "--------") return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const input = document.createElement("input");
      input.value = code;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    button.textContent = "已复制";
    window.setTimeout(() => { button.textContent = "复制"; }, 1600);
  }

  function loginLinkError(error) {
    const detail = [error?.message, error?.details].filter(Boolean).join(" ");
    if (/email address not authorized/i.test(detail)) {
      return "此邮箱未获 Supabase 默认邮件服务授权。请将该邮箱添加为 Supabase 组织成员，或配置自定义 SMTP。";
    }
    if (/rate limit|security purposes|60 seconds|too many/i.test(detail)) {
      return "刚发送过登录链接，请等 60 秒后再试，并检查邮箱垃圾邮件箱。";
    }
    if (/redirect|url/i.test(detail)) {
      return "发送失败：登录回跳地址未配置正确。请检查 Supabase 的 URL Configuration。";
    }
    return detail ? `发送失败：${detail}` : "发送失败，请检查网络和 Supabase 邮箱登录设置。";
  }

  function pairingError(action, error) {
    const code = error?.code || "UNKNOWN";
    const detail = [error?.message, error?.details, error?.hint].filter(Boolean).join(" ");
    if (code === "PGRST202" || /could not find.*public\.(create_love_space|join_love_space).*schema cache/i.test(detail)) {
      return `${action}失败（${code}）：数据库接口缓存尚未识别同步函数，请在 SQL Editor 执行 NOTIFY pgrst, 'reload schema'; 后刷新网页。`;
    }
    if (/already belongs to a couple space/i.test(detail)) {
      return `${action}失败：这个邮箱已经属于一个两人空间。请刷新网页确认是否已连接，或改用另一个邮箱。`;
    }
    if (/permission denied for function/i.test(detail)) {
      return `${action}失败（${code}）：数据库函数尚未授权给登录用户，请重新执行最新版数据库脚本中的 GRANT 语句。`;
    }
    if (/Please sign in first|JWT|unauthorized/i.test(detail)) {
      return `${action}失败：登录状态已失效。请退出后重新通过邮箱链接登录。`;
    }
    return detail ? `${action}失败（${code}）：${detail}` : `${action}失败（${code}），请稍后刷新网页再试。`;
  }

  async function createPair() {
    const role = chosenRole();
    const { data, error } = await sync.client.rpc("create_love_space", { p_role: role });
    if (error) {
      q("#inviteResult").textContent = pairingError("创建", error);
      return;
    }
    q("#inviteResult").textContent = `邀请码：${data.invite_code}，请发给对方。`;
    await refreshSession(true);
  }

  async function joinPair(event) {
    event.preventDefault();
    const code = q("#pairCode").value.trim().toUpperCase();
    if (!code) return;
    const { error } = await sync.client.rpc("join_love_space", { p_invite_code: code, p_role: chosenRole() });
    if (error) {
      q("#inviteResult").textContent = pairingError("加入", error);
      return;
    }
    await refreshSession(true);
  }

  function resetConnection() {
    if (sync.channel) sync.client.removeChannel(sync.channel);
    clearTimeout(sync.timer);
    clearInterval(sync.voiceRefreshTimer);
    sync.timer = null;
    sync.pendingState = null;
    sync.hydrated = false;
    sync.applyingRemote = false;
    sync.user = null;
    sync.coupleId = null;
    sync.role = null;
    sync.channel = null;
    sync.voiceRefreshTimer = null;
    q("#connectedInvite").hidden = true;
  }

  function refreshSession(force = false) {
    if (sync.refreshPromise) {
      sync.forceRefreshQueued ||= force;
      return sync.refreshPromise;
    }
    sync.refreshPromise = performSessionRefresh(force).finally(() => {
      sync.refreshPromise = null;
      if (sync.forceRefreshQueued) {
        sync.forceRefreshQueued = false;
        window.setTimeout(() => refreshSession(true), 0);
      }
    });
    return sync.refreshPromise;
  }

  async function performSessionRefresh(force) {
    const { data: { session } } = await sync.client.auth.getSession();
    if (!session) {
      resetConnection();
      updateUi("signed-out", "请登录");
      emit("love-sync-status", { connected: false, authenticated: false, needsPairing: false, role: null });
      return;
    }
    if (!force && sync.user?.id === session.user.id && sync.coupleId) return;
    sync.user = session.user;
    emitCachedFeatures(sync.user.id);
    const { data: member, error } = await sync.client
      .from("love_members")
      .select("couple_id, role")
      .eq("user_id", sync.user.id)
      .maybeSingle();
    if (error) {
      updateUi("signed-out", "配置异常");
      return;
    }
    if (!member) {
      updateUi("pairing", "等待配对");
      q("#inviteResult").textContent = "登录成功。请选择自己是谁，再输入对方的邀请码加入空间。";
      emit("love-sync-status", { connected: false, authenticated: true, needsPairing: true, role: null });
      return;
    }
    sync.coupleId = member.couple_id;
    sync.role = member.role;
    sync.hydrated = false;
    updateUi("connected", "正在刷新");
    q("#syncConnectedText").textContent = `已作为${sync.role === "liu" ? "刘向强" : "付嘉颖"}连接到两人空间。`;
    q("#connectedInvite").hidden = true;
    subscribe();
    emit("love-sync-status", { connected: true, authenticated: true, needsPairing: false, role: sync.role });
    const results = await Promise.allSettled([loadInviteCode(), loadRemoteState(), refreshMissStats(), refreshVoiceMessages()]);
    const coreFailed = results.slice(0, 2).some((result) => result.status === "rejected");
    updateUi("connected", coreFailed ? "部分数据重试中" : "已实时同步");
    clearInterval(sync.voiceRefreshTimer);
    sync.voiceRefreshTimer = setInterval(refreshVoiceMessages, 45 * 60 * 1000);
  }

  async function loadInviteCode() {
    const { data: couple, error } = await sync.client
      .from("love_couples")
      .select("invite_code")
      .eq("id", sync.coupleId)
      .maybeSingle();
    if (error) throw error;
    if (!couple?.invite_code) return;
    q("#syncInviteCode").textContent = couple.invite_code;
    q("#connectedInvite").hidden = false;
  }

  async function loadRemoteState() {
    const [{ data: shared, error: sharedError }, { data: privateRow, error: privateError }] = await Promise.all([
      sync.client.from("love_shared_state").select("data").eq("couple_id", sync.coupleId).maybeSingle(),
      sync.client.from("love_private_state").select("data").eq("couple_id", sync.coupleId).eq("user_id", sync.user.id).maybeSingle()
    ]);
    if (sharedError || privateError) throw sharedError || privateError;
    const sharedData = shared?.data || {};
    const firstHydration = !sync.hydrated;
    if (firstHydration) sync.pendingState = null;
    sync.applyingRemote = true;
    try {
      emit("love-sync-remote", {
        shared: sharedData,
        privateData: privateRow?.data || null,
        role: sync.role,
        initializeEmptySpace: Object.keys(sharedData).length === 0
      });
    } finally {
      sync.applyingRemote = false;
      sync.hydrated = true;
    }
    if (sync.pendingState && !sync.timer) sync.timer = setTimeout(flushSave, 0);
  }

  function subscribe() {
    if (sync.channel) sync.client.removeChannel(sync.channel);
    sync.channel = sync.client
      .channel(`love-space-${sync.coupleId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "love_shared_state", filter: `couple_id=eq.${sync.coupleId}` }, (payload) => {
        if (!sync.hydrated) return;
        emit("love-sync-remote", { shared: payload.new.data || {}, privateData: null, role: sync.role });
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "love_private_state", filter: `user_id=eq.${sync.user.id}` }, (payload) => {
        if (!sync.hydrated) return;
        emit("love-sync-remote", { shared: null, privateData: payload.new.data || {}, role: sync.role });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "love_miss_events", filter: `couple_id=eq.${sync.coupleId}` }, () => {
        refreshMissStats();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "love_voice_messages", filter: `couple_id=eq.${sync.coupleId}` }, () => {
        refreshVoiceMessages();
      })
      .subscribe();
  }

  function featureError(feature, error) {
    const detail = [error?.message, error?.details, error?.hint].filter(Boolean).join(" ");
    const missing = /PGRST202|42883|does not exist|schema cache|love_voice_messages|love_miss/i.test(detail);
    const message = missing
      ? `${feature === "voice" ? "心声信箱" : "想你信号"}尚未完成数据库升级，请执行 supabase-upgrade-2026-08.sql。`
      : (detail || `${feature === "voice" ? "心声信箱" : "想你信号"}暂时无法同步。`);
    emit("love-sync-feature-error", { feature, message });
  }

  async function refreshMissStats() {
    if (!sync.client || !sync.coupleId) return null;
    const { data, error } = await sync.client.rpc("get_love_miss_stats");
    if (error) {
      featureError("miss", error);
      return null;
    }
    writeFeatureCache(sync.user?.id, { missStats: data || {} });
    emit("love-miss-stats", data || {});
    return data;
  }

  async function sendMiss() {
    if (!sync.client || !sync.coupleId) throw new Error("not connected");
    const { data, error } = await sync.client.rpc("send_love_miss");
    if (error) throw error;
    writeFeatureCache(sync.user?.id, { missStats: data || {} });
    emit("love-miss-stats", data || {});
    return data;
  }

  async function refreshVoiceMessages() {
    if (!sync.client || !sync.coupleId) return [];
    const { data, error } = await sync.client
      .from("love_voice_messages")
      .select("id, user_id, role, storage_path, duration_seconds, mime_type, created_at")
      .eq("couple_id", sync.coupleId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      featureError("voice", error);
      return [];
    }
    const rows = data || [];
    let messages = [];
    if (rows.length) {
      const paths = rows.map((message) => message.storage_path);
      const { data: signedRows, error: signedError } = await sync.client.storage.from("love-voices").createSignedUrls(paths, 3600);
      if (signedError) featureError("voice", signedError);
      const signedByPath = new Map((signedRows || []).map((item, index) => [item.path || paths[index], item.signedUrl || ""]));
      messages = rows.map((message, index) => ({
        ...message,
        signedUrl: signedByPath.get(message.storage_path) || signedRows?.[index]?.signedUrl || ""
      }));
    }
    writeFeatureCache(sync.user?.id, { voiceMessages: messages, voicesCachedAt: Date.now() });
    emit("love-voice-messages", messages);
    return messages;
  }

  function audioExtension(mimeType) {
    if (/mp4|m4a/i.test(mimeType)) return "m4a";
    if (/ogg/i.test(mimeType)) return "ogg";
    return "webm";
  }

  async function uploadVoice(blob, duration, mimeType) {
    if (!sync.client || !sync.coupleId || !sync.user) throw new Error("not connected");
    if (!(blob instanceof Blob) || !blob.size) throw new Error("empty voice recording");
    if (blob.size > 12 * 1024 * 1024) throw new Error("voice recording is too large");
    const id = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const path = `${sync.coupleId}/${sync.user.id}/${id}.${audioExtension(mimeType)}`;
    const upload = await sync.client.storage.from("love-voices").upload(path, blob, {
      contentType: mimeType || blob.type || "audio/webm",
      cacheControl: "3600",
      upsert: false
    });
    if (upload.error) throw upload.error;
    const insert = await sync.client.from("love_voice_messages").insert({
      id,
      couple_id: sync.coupleId,
      user_id: sync.user.id,
      role: sync.role,
      storage_path: path,
      duration_seconds: Math.max(1, Math.min(90, Math.round(duration))),
      mime_type: mimeType || blob.type || "audio/webm"
    });
    if (insert.error) {
      await sync.client.storage.from("love-voices").remove([path]);
      throw insert.error;
    }
    await refreshVoiceMessages();
  }

  async function deleteVoice(id, path) {
    if (!sync.client || !sync.coupleId || !sync.user) throw new Error("not connected");
    const storageResult = await sync.client.storage.from("love-voices").remove([path]);
    if (storageResult.error) throw storageResult.error;
    const { error } = await sync.client
      .from("love_voice_messages")
      .delete()
      .eq("id", id)
      .eq("user_id", sync.user.id);
    if (error) throw error;
    await refreshVoiceMessages();
  }

  function splitState(state) {
    const { private: privateSpaces, writer, privatePerson, ...shared } = state;
    return { shared, privateData: privateSpaces[sync.role] || {} };
  }

  function scheduleSave(state) {
    if (!sync.client || !sync.coupleId || !sync.user) return;
    if (!sync.hydrated && !sync.applyingRemote) {
      updateUi("connected", "正在加载原有数据");
      return;
    }
    sync.pendingState = state;
    clearTimeout(sync.timer);
    if (sync.hydrated) sync.timer = setTimeout(flushSave, 80);
  }

  async function flushSave() {
    clearTimeout(sync.timer);
    sync.timer = null;
    if (!sync.client || !sync.coupleId || !sync.user || !sync.hydrated || !sync.pendingState || sync.saveInFlight) return;
    const snapshot = structuredClone(sync.pendingState);
    sync.pendingState = null;
    sync.saveInFlight = true;
    updateUi("connected", "正在保存");
    try {
      const { shared, privateData } = splitState(snapshot);
      const [sharedResult, privateResult] = await Promise.all([
        sync.client.from("love_shared_state").upsert({ couple_id: sync.coupleId, data: shared, updated_by: sync.user.id }),
        sync.client.from("love_private_state").upsert({ couple_id: sync.coupleId, user_id: sync.user.id, data: privateData })
      ]);
      if (sharedResult.error || privateResult.error) {
        sync.pendingState ||= snapshot;
        updateUi("connected", "同步重试中");
        sync.timer = setTimeout(flushSave, 1500);
      } else {
        updateUi("connected", "已实时同步");
      }
    } catch {
      sync.pendingState ||= snapshot;
      updateUi("connected", "同步重试中");
      sync.timer = setTimeout(flushSave, 1500);
    } finally {
      sync.saveInFlight = false;
      if (sync.pendingState && !sync.timer) sync.timer = setTimeout(flushSave, 0);
    }
  }

  async function refreshVisibleData() {
    if (!sync.client || !sync.coupleId || !sync.user) return;
    if (sync.pendingState || sync.saveInFlight) {
      window.setTimeout(refreshVisibleData, 500);
      return;
    }
    if (Date.now() - sync.lastForegroundRefresh < 3000) return;
    sync.lastForegroundRefresh = Date.now();
    updateUi("connected", "正在刷新");
    const results = await Promise.allSettled([loadRemoteState(), refreshMissStats(), refreshVoiceMessages()]);
    updateUi("connected", results[0].status === "rejected" ? "部分数据重试中" : "已实时同步");
  }

  function bindLifecycleFlush() {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushSave();
      else refreshVisibleData();
    });
    window.addEventListener("pagehide", flushSave);
    window.addEventListener("online", () => {
      flushSave();
      refreshVisibleData();
    });
  }

  window.LoveSync = {
    async initialize() {
      bindUi();
      bindLifecycleFlush();
      if (!hasConfig || !window.supabase) {
        updateUi("local", "本机模式");
        return;
      }
      sync.client = window.supabase.createClient(config.url, config.publishableKey, {
        auth: { persistSession: true, detectSessionInUrl: true, autoRefreshToken: true }
      });
      sync.client.auth.onAuthStateChange(() => window.setTimeout(refreshSession, 0));
      await refreshSession();
    },
    scheduleSave,
    flushSave,
    sendMiss,
    refreshMissStats,
    uploadVoice,
    deleteVoice,
    refreshVoiceMessages,
    refreshVisibleData,
    isConnected: () => Boolean(sync.coupleId),
    getRole: () => sync.role
  };
}());
