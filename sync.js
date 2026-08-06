(function () {
  const config = window.LOVE_SYNC_CONFIG || {};
  const hasConfig = Boolean(config.url && config.publishableKey);
  const featureCacheKey = "love-sync-feature-cache-v1";
  const sync = {
    client: null, user: null, coupleId: null, role: null, channel: null,
    timer: null, voiceRefreshTimer: null, refreshPromise: null, forceRefreshQueued: false,
    remoteReloadTimer: null, remotePhotosQueued: false, photosPromise: null,
    pendingState: null, saveInFlight: false, lastForegroundRefresh: 0,
    hydrated: false, photosHydrated: false, applyingRemote: false,
    lastSharedState: null, lastPhotosState: null, lastPrivateState: null
  };

  function emit(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function q(selector) {
    return document.querySelector(selector);
  }

  function withTimeout(promise, timeoutMs, label) {
    let timer;
    return Promise.race([
      Promise.resolve(promise),
      new Promise((_, reject) => {
        timer = window.setTimeout(() => reject(new Error(`${label}超时，请检查网络后重试`)), timeoutMs);
      })
    ]).finally(() => window.clearTimeout(timer));
  }

  function runQuery(query, label) {
    return withTimeout(query, 10000, label);
  }

  function runPhotoQuery(query, label) {
    return withTimeout(query, 30000, label);
  }

  function isMissingRpcError(error) {
    const detail = [error?.code, error?.message, error?.details, error?.hint].filter(Boolean).join(" ");
    return /PGRST202|42883|does not exist|schema cache/i.test(detail);
  }

  function sharedCore(value) {
    if (!value || typeof value !== "object") return {};
    const { photos, ...core } = value;
    return core;
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
    clearTimeout(sync.remoteReloadTimer);
    clearInterval(sync.voiceRefreshTimer);
    sync.timer = null;
    sync.remoteReloadTimer = null;
    sync.remotePhotosQueued = false;
    sync.photosPromise = null;
    sync.pendingState = null;
    sync.hydrated = false;
    sync.photosHydrated = false;
    sync.applyingRemote = false;
    sync.user = null;
    sync.coupleId = null;
    sync.role = null;
    sync.channel = null;
    sync.voiceRefreshTimer = null;
    sync.lastSharedState = null;
    sync.lastPhotosState = null;
    sync.lastPrivateState = null;
    q("#connectedInvite").hidden = true;
  }

  function refreshSession(force = false) {
    if (sync.refreshPromise) {
      sync.forceRefreshQueued ||= force;
      return sync.refreshPromise;
    }
    sync.refreshPromise = performSessionRefresh(force).catch((error) => {
      const detail = syncErrorMessage(error);
      console.error("Love sync session refresh failed", error);
      updateUi(sync.coupleId ? "connected" : (sync.user ? "pairing" : "signed-out"), detail ? `连接失败${detail}` : "连接失败，请稍后重试");
      return null;
    }).finally(() => {
      sync.refreshPromise = null;
      if (sync.forceRefreshQueued) {
        sync.forceRefreshQueued = false;
        window.setTimeout(() => refreshSession(true), 0);
      }
    });
    return sync.refreshPromise;
  }

  async function performSessionRefresh(force) {
    const { data: { session } } = await withTimeout(sync.client.auth.getSession(), 8000, "读取登录状态");
    if (!session) {
      resetConnection();
      updateUi("signed-out", "请登录");
      emit("love-sync-status", { connected: false, authenticated: false, needsPairing: false, role: null });
      return;
    }
    if (!force && sync.user?.id === session.user.id && sync.coupleId) return;
    sync.user = session.user;
    emitCachedFeatures(sync.user.id);
    const { data: member, error } = await runQuery(sync.client
      .from("love_members")
      .select("couple_id, role")
      .eq("user_id", sync.user.id)
      .maybeSingle(), "读取双人空间");
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
    try {
      await loadRemoteState();
      updateUi("connected", "已实时同步");
    } catch (loadError) {
      const detail = syncErrorMessage(loadError);
      updateUi("connected", detail ? `刷新失败${detail}` : "刷新失败，请稍后重试");
    }
    Promise.allSettled([loadInviteCode(), refreshMissStats(), refreshVoiceMessages()]);
    clearInterval(sync.voiceRefreshTimer);
    sync.voiceRefreshTimer = setInterval(refreshVoiceMessages, 45 * 60 * 1000);
  }

  async function loadInviteCode() {
    const { data: couple, error } = await runQuery(sync.client
      .from("love_couples")
      .select("invite_code")
      .eq("id", sync.coupleId)
      .maybeSingle(), "读取邀请码");
    if (error) throw error;
    if (!couple?.invite_code) return;
    q("#syncInviteCode").textContent = couple.invite_code;
    q("#connectedInvite").hidden = false;
  }

  async function readSharedCore(label = "读取共同记录") {
    const rpcResult = await runQuery(sync.client.rpc("get_love_shared_core"), label);
    if (!rpcResult.error) {
      const payload = rpcResult.data || {};
      return {
        exists: payload.exists !== false,
        data: payload.data || {},
        updated_at: payload.updated_at || null,
        photos: null
      };
    }
    if (!isMissingRpcError(rpcResult.error)) throw rpcResult.error;

    const { data: row, error } = await runQuery(
      sync.client.from("love_shared_state").select("data, updated_at").eq("couple_id", sync.coupleId).maybeSingle(),
      label
    );
    if (error) throw error;
    return {
      exists: Boolean(row),
      data: sharedCore(row?.data || {}),
      updated_at: row?.updated_at || null,
      photos: Array.isArray(row?.data?.photos) ? row.data.photos : []
    };
  }

  function applyRemotePhotos(photos) {
    const safePhotos = Array.isArray(photos) ? photos : [];
    sync.lastPhotosState = structuredClone(safePhotos);
    sync.photosHydrated = true;
    sync.applyingRemote = true;
    try {
      emit("love-sync-remote", { shared: { photos: safePhotos }, privateData: null, role: sync.role, partialShared: true });
    } finally {
      sync.applyingRemote = false;
    }
    return safePhotos;
  }

  function loadRemotePhotos(force = false) {
    if (sync.photosHydrated && !force) return Promise.resolve(sync.lastPhotosState || []);
    if (sync.photosPromise) return sync.photosPromise;
    sync.photosPromise = (async () => {
      const rpcResult = await runPhotoQuery(sync.client.rpc("get_love_shared_photos"), "读取公共相册");
      if (!rpcResult.error) return applyRemotePhotos(rpcResult.data);
      if (!isMissingRpcError(rpcResult.error)) throw rpcResult.error;
      const { data: row, error } = await runPhotoQuery(
        sync.client.from("love_shared_state").select("data").eq("couple_id", sync.coupleId).maybeSingle(),
        "读取公共相册"
      );
      if (error) throw error;
      return applyRemotePhotos(row?.data?.photos || []);
    })().finally(() => {
      sync.photosPromise = null;
    });
    return sync.photosPromise;
  }

  async function loadRemoteState({ refreshPhotos = false } = {}) {
    const privatePromise = runQuery(
      sync.client.from("love_private_state").select("data, updated_at").eq("couple_id", sync.coupleId).eq("user_id", sync.user.id).maybeSingle(),
      "读取私人记录"
    ).then((result) => ({ result })).catch((error) => ({ error }));
    const shared = await readSharedCore();
    const sharedData = shared.data || {};
    sync.lastSharedState = structuredClone(sharedData);
    const firstHydration = !sync.hydrated;
    if (firstHydration) sync.pendingState = null;
    sync.applyingRemote = true;
    try {
      emit("love-sync-remote", {
        shared: sharedData,
        privateData: null,
        role: sync.role,
        partialShared: true,
        initializeEmptySpace: Object.keys(sharedData).length === 0
      });
    } finally {
      sync.applyingRemote = false;
      sync.hydrated = true;
    }
    privatePromise.then(({ result, error: requestError }) => {
      if (requestError) throw requestError;
      const { data: privateRow, error: privateError } = result;
      if (privateError) throw privateError;
      sync.lastPrivateState = structuredClone(privateRow?.data || {});
      emit("love-sync-remote", { shared: null, privateData: privateRow?.data || {}, role: sync.role });
    }).catch((error) => console.warn("Private state refresh failed", error));
    if (shared.photos) applyRemotePhotos(shared.photos);
    else loadRemotePhotos(refreshPhotos).catch((error) => console.warn("Photo refresh failed", error));
    if (sync.pendingState && !sync.timer) sync.timer = setTimeout(flushSave, 0);
  }

  function queueRemoteReload(refreshPhotos = false) {
    sync.remotePhotosQueued ||= refreshPhotos;
    clearTimeout(sync.remoteReloadTimer);
    sync.remoteReloadTimer = window.setTimeout(() => {
      const shouldRefreshPhotos = sync.remotePhotosQueued;
      sync.remotePhotosQueued = false;
      loadRemoteState({ refreshPhotos: shouldRefreshPhotos }).catch((error) => {
        console.warn("Shared state refresh failed", error);
      });
    }, 120);
  }

  function broadcastSharedChange(photosChanged = false) {
    if (!sync.channel || !sync.user) return;
    sync.channel.send({
      type: "broadcast",
      event: "shared-changed",
      payload: { updatedBy: sync.user.id, photosChanged }
    }).catch((error) => console.warn("Shared change broadcast failed", error));
  }

  function subscribe() {
    if (sync.channel) sync.client.removeChannel(sync.channel);
    sync.channel = sync.client
      .channel(`love-space-${sync.coupleId}`)
      .on("broadcast", { event: "shared-changed" }, ({ payload }) => {
        if (!sync.hydrated || payload?.updatedBy === sync.user?.id) return;
        if (payload?.photosChanged) sync.photosHydrated = false;
        queueRemoteReload(Boolean(payload?.photosChanged));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "love_private_state", filter: `user_id=eq.${sync.user.id}` }, (payload) => {
        if (!sync.hydrated) return;
        sync.lastPrivateState = structuredClone(payload.new.data || {});
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

  async function deleteSharedRecord(field, id) {
    if (!sync.client || !sync.coupleId || !sync.user || !field || !id) return null;
    const { data, error } = await runQuery(sync.client.rpc("delete_love_shared_record", {
      p_field: field,
      p_record_id: id
    }), "删除共同记录");
    if (error) {
      const detail = [error.message, error.details, error.hint].filter(Boolean).join(" ");
      if (/PGRST202|42883|does not exist|schema cache/i.test(detail)) return null;
      throw error;
    }
    if (data && typeof data === "object") {
      sync.lastSharedState = structuredClone(sharedCore(data));
      emit("love-sync-remote", { shared: sharedCore(data), privateData: null, role: sync.role, partialShared: true });
    }
    if (field === "photos") {
      sync.photosHydrated = false;
      loadRemotePhotos(true).catch((refreshError) => console.warn("Photo refresh failed", refreshError));
    }
    broadcastSharedChange(field === "photos");
    return data || null;
  }

  function splitState(state) {
    const { private: privateSpaces, writer, privatePerson, ...shared } = state;
    return { shared, privateData: privateSpaces[sync.role] || {} };
  }

  function scheduleSave(state) {
    if (!sync.client || !sync.user) {
      updateUi(hasConfig ? "signed-out" : "local", hasConfig ? "未登录，本次记录仅保存在当前浏览器" : "本机模式");
      return;
    }
    if (!sync.coupleId) {
      updateUi("pairing", "尚未进入双人空间，本次记录仅保存在当前浏览器");
      return;
    }
    if (!sync.hydrated && !sync.applyingRemote) {
      updateUi("connected", "正在加载原有数据");
      return;
    }
    sync.pendingState = state;
    clearTimeout(sync.timer);
    if (sync.hydrated) sync.timer = setTimeout(flushSave, 80);
  }

  function comparableState(value) {
    if (Array.isArray(value)) {
      const items = value.map(comparableState);
      if (items.every((item) => item && typeof item === "object" && !Array.isArray(item) && item.id)) {
        items.sort((left, right) => String(left.id).localeCompare(String(right.id)));
      }
      return items;
    }
    if (!value || typeof value !== "object") return value;
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = comparableState(value[key]);
      return result;
    }, {});
  }

  function sameState(left, right) {
    const leftState = left || {};
    const rightState = right || {};
    const leftJson = JSON.stringify(leftState);
    const rightJson = JSON.stringify(rightState);
    if (leftJson === rightJson) return true;
    return JSON.stringify(comparableState(leftState)) === JSON.stringify(comparableState(rightState));
  }

  function mergeSharedForSave(localState, serverState) {
    return window.LoveStateMerge?.shared
      ? window.LoveStateMerge.shared(localState || {}, serverState || {})
      : { ...(serverState || {}), ...(localState || {}) };
  }

  function mergePrivateForSave(localState, serverState) {
    return window.LoveStateMerge?.private
      ? window.LoveStateMerge.private(localState || {}, serverState || {}, sync.role)
      : { ...(serverState || {}), ...(localState || {}) };
  }

  function syncErrorMessage(error) {
    const code = error?.code ? ` ${error.code}` : "";
    const detail = [error?.message, error?.details, error?.hint].filter(Boolean).join(" ");
    return `${code}${detail ? `：${detail}` : ""}`.trim();
  }

  async function saveSharedWithRetry(localState, changedPhotos = null) {
    const photosChanged = Array.isArray(changedPhotos);
    const runWrite = photosChanged ? runPhotoQuery : runQuery;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const current = await readSharedCore("读取最新共同记录");
      const serverState = current.data || {};
      const merged = mergeSharedForSave(localState, serverState);
      const writeState = photosChanged ? { ...merged, photos: changedPhotos } : merged;
      if (current.exists && sameState(merged, serverState) && !photosChanged) return serverState;
      if (!current.exists) {
        const { data: inserted, error: insertError } = await runWrite(sync.client
          .from("love_shared_state")
          .insert({ couple_id: sync.coupleId, data: writeState, updated_by: sync.user.id })
          .select("updated_at")
          .maybeSingle(), "创建共同记录");
        if (!insertError && inserted) return merged;
        if (insertError && insertError.code !== "23505") throw insertError;
      } else {
        const { data: updated, error: updateError } = await runWrite(sync.client
          .from("love_shared_state")
          .update({ data: writeState, updated_by: sync.user.id })
          .eq("couple_id", sync.coupleId)
          .eq("updated_at", current.updated_at)
          .select("updated_at")
          .maybeSingle(), "保存共同记录");
        if (updateError) throw updateError;
        if (updated) return merged;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 25 * (attempt + 1)));
    }
    const latest = await readSharedCore("最终读取共同记录");
    const merged = mergeSharedForSave(localState, latest.data || {});
    const writeState = photosChanged ? { ...merged, photos: changedPhotos } : merged;
    const { data: updated, error: finalUpdateError } = await runWrite(sync.client
      .from("love_shared_state")
      .update({ data: writeState, updated_by: sync.user.id })
      .eq("couple_id", sync.coupleId)
      .select("updated_at")
      .maybeSingle(), "最终保存共同记录");
    if (finalUpdateError) throw finalUpdateError;
    if (!updated) throw new Error("数据库未允许更新共同空间，请检查登录状态和 RLS 权限");
    return merged;
  }

  async function savePrivateWithRetry(localState) {
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const { data: current, error: readError } = await runQuery(sync.client
        .from("love_private_state")
        .select("data, updated_at")
        .eq("couple_id", sync.coupleId)
        .eq("user_id", sync.user.id)
        .maybeSingle(), "读取最新私人记录");
      if (readError) throw readError;
      const serverState = current?.data || {};
      const merged = mergePrivateForSave(localState, serverState);
      if (current && sameState(merged, serverState)) return serverState;
      if (!current) {
        const { data: inserted, error: insertError } = await runQuery(sync.client
          .from("love_private_state")
          .insert({ couple_id: sync.coupleId, user_id: sync.user.id, data: merged })
          .select("data, updated_at")
          .maybeSingle(), "创建私人记录");
        if (!insertError && inserted) return inserted.data || merged;
        if (insertError && insertError.code !== "23505") throw insertError;
      } else {
        const { data: updated, error: updateError } = await runQuery(sync.client
          .from("love_private_state")
          .update({ data: merged })
          .eq("couple_id", sync.coupleId)
          .eq("user_id", sync.user.id)
          .eq("updated_at", current.updated_at)
          .select("data, updated_at")
          .maybeSingle(), "保存私人记录");
        if (updateError) throw updateError;
        if (updated) return updated.data || merged;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 25 * (attempt + 1)));
    }
    const { data: latest, error: finalReadError } = await runQuery(sync.client
      .from("love_private_state")
      .select("data")
      .eq("couple_id", sync.coupleId)
      .eq("user_id", sync.user.id)
      .maybeSingle(), "最终读取私人记录");
    if (finalReadError) throw finalReadError;
    const merged = mergePrivateForSave(localState, latest?.data || {});
    const { data: updated, error: finalUpdateError } = await runQuery(sync.client
      .from("love_private_state")
      .update({ data: merged })
      .eq("couple_id", sync.coupleId)
      .eq("user_id", sync.user.id)
      .select("data")
      .maybeSingle(), "最终保存私人记录");
    if (finalUpdateError) throw finalUpdateError;
    if (!updated) throw new Error("数据库未允许更新私人空间，请检查登录状态和 RLS 权限");
    return updated.data || merged;
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
      const core = sharedCore(shared);
      const photos = Array.isArray(shared.photos) ? shared.photos : [];
      const sharedDirty = !sameState(core, sync.lastSharedState);
      const photosDirty = sync.photosHydrated && !sameState(photos, sync.lastPhotosState);
      const privateDirty = !sameState(privateData, sync.lastPrivateState);
      const [savedShared, savedPrivate] = await Promise.all([
        sharedDirty || photosDirty ? saveSharedWithRetry(core, photosDirty ? photos : null) : Promise.resolve(null),
        privateDirty ? savePrivateWithRetry(privateData) : Promise.resolve(null)
      ]);
      if (savedShared) sync.lastSharedState = structuredClone(savedShared);
      if (photosDirty) sync.lastPhotosState = structuredClone(photos);
      if (savedPrivate) sync.lastPrivateState = structuredClone(savedPrivate);
      if (savedShared || savedPrivate) {
        sync.applyingRemote = true;
        try {
          emit("love-sync-remote", {
            shared: savedShared ? (photosDirty ? { ...savedShared, photos } : savedShared) : null,
            privateData: savedPrivate,
            role: sync.role,
            partialShared: Boolean(savedShared && !photosDirty)
          });
        } finally {
          sync.applyingRemote = false;
        }
      }
      if (savedShared) broadcastSharedChange(photosDirty);
      updateUi("connected", "已实时同步");
    } catch (error) {
      sync.pendingState ||= snapshot;
      const detail = syncErrorMessage(error);
      console.error("Love sync save failed", error);
      updateUi("connected", detail ? `同步失败${detail}，正在重试` : "同步失败，正在重试");
      emit("love-sync-error", { message: detail || "未知错误" });
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
    try {
      await loadRemoteState();
      updateUi("connected", "已实时同步");
    } catch (error) {
      const detail = syncErrorMessage(error);
      updateUi("connected", detail ? `刷新失败${detail}` : "刷新失败，请稍后重试");
    }
    Promise.allSettled([refreshMissStats(), refreshVoiceMessages()]);
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
    deleteSharedRecord,
    refreshVoiceMessages,
    refreshVisibleData,
    isConnected: () => Boolean(sync.coupleId),
    isAuthenticated: () => Boolean(sync.user),
    isReady: () => Boolean(sync.coupleId && sync.hydrated),
    getRole: () => sync.role
  };
}());
