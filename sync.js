(function () {
  const config = window.LOVE_SYNC_CONFIG || {};
  const hasConfig = Boolean(config.url && config.publishableKey);
  const sync = { client: null, user: null, coupleId: null, role: null, channel: null, timer: null };

  function emit(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function q(selector) {
    return document.querySelector(selector);
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
        result.textContent = error ? loginLinkError(error) : "登录链接已发送，请在邮箱中打开并回到这里。";
      } catch (error) {
        result.textContent = "发送失败：网络连接异常，请检查网络后重试。";
      } finally {
        button.disabled = false;
        button.textContent = "发送登录链接";
      }
    });
    q("#syncRolePicker").addEventListener("click", (event) => {
      const button = event.target.closest("[data-role]");
      if (!button) return;
      q("#syncRolePicker").querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
    });
    q("#createPair").addEventListener("click", createPair);
    q("#joinPairForm").addEventListener("submit", joinPair);
    q("#syncSignOut").addEventListener("click", async () => {
      await sync.client.auth.signOut();
      resetConnection();
      updateUi("signed-out", "请登录");
      emit("love-sync-status", { connected: false, role: null });
    });
  }

  function chosenRole() {
    return q("#syncRolePicker .is-active")?.dataset.role || "liu";
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
    const detail = [error?.message, error?.details, error?.hint].filter(Boolean).join(" ");
    if (/create_love_space|join_love_space|function.*does not exist|schema cache/i.test(detail)) {
      return `${action}失败：数据库同步功能还没有生效。请在 Supabase 的 SQL Editor 中重新执行最新版 supabase-schema.sql，执行成功后刷新网页再试。`;
    }
    if (/already belongs to a couple space/i.test(detail)) {
      return `${action}失败：这个邮箱已经属于一个两人空间。请刷新网页确认是否已连接，或改用另一个邮箱。`;
    }
    if (/Please sign in first|JWT|unauthorized|permission denied/i.test(detail)) {
      return `${action}失败：登录状态已失效。请退出后重新通过邮箱链接登录。`;
    }
    return detail ? `${action}失败：${detail}` : `${action}失败，请稍后刷新网页再试。`;
  }

  async function createPair() {
    const role = chosenRole();
    const { data, error } = await sync.client.rpc("create_love_space", { p_role: role });
    if (error) {
      q("#inviteResult").textContent = pairingError("创建", error);
      return;
    }
    q("#inviteResult").textContent = `邀请码：${data.invite_code}，请发给对方。`;
    await refreshSession();
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
    await refreshSession();
  }

  function resetConnection() {
    if (sync.channel) sync.client.removeChannel(sync.channel);
    sync.user = null;
    sync.coupleId = null;
    sync.role = null;
    sync.channel = null;
  }

  async function refreshSession() {
    const { data: { session } } = await sync.client.auth.getSession();
    if (!session) {
      resetConnection();
      updateUi("signed-out", "请登录");
      emit("love-sync-status", { connected: false, role: null });
      return;
    }
    sync.user = session.user;
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
      emit("love-sync-status", { connected: false, role: null });
      return;
    }
    sync.coupleId = member.couple_id;
    sync.role = member.role;
    updateUi("connected", "已实时同步");
    q("#syncConnectedText").textContent = `已作为${sync.role === "liu" ? "刘向强" : "付嘉颖"}连接到两人空间。`;
    emit("love-sync-status", { connected: true, role: sync.role });
    await loadRemoteState();
    subscribe();
  }

  async function loadRemoteState() {
    const [{ data: shared }, { data: privateRow }] = await Promise.all([
      sync.client.from("love_shared_state").select("data").eq("couple_id", sync.coupleId).maybeSingle(),
      sync.client.from("love_private_state").select("data").eq("couple_id", sync.coupleId).eq("user_id", sync.user.id).maybeSingle()
    ]);
    const sharedData = shared?.data || {};
    emit("love-sync-remote", {
      shared: sharedData,
      privateData: privateRow?.data || null,
      role: sync.role,
      initializeEmptySpace: Object.keys(sharedData).length === 0
    });
  }

  function subscribe() {
    if (sync.channel) sync.client.removeChannel(sync.channel);
    sync.channel = sync.client
      .channel(`love-space-${sync.coupleId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "love_shared_state", filter: `couple_id=eq.${sync.coupleId}` }, (payload) => {
        emit("love-sync-remote", { shared: payload.new.data || {}, privateData: null, role: sync.role });
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "love_private_state", filter: `user_id=eq.${sync.user.id}` }, (payload) => {
        emit("love-sync-remote", { shared: null, privateData: payload.new.data || {}, role: sync.role });
      })
      .subscribe();
  }

  function splitState(state) {
    const { private: privateSpaces, writer, privatePerson, ...shared } = state;
    return { shared, privateData: privateSpaces[sync.role] || {} };
  }

  function scheduleSave(state) {
    if (!sync.client || !sync.coupleId || !sync.user) return;
    clearTimeout(sync.timer);
    sync.timer = setTimeout(async () => {
      const { shared, privateData } = splitState(state);
      const [sharedResult, privateResult] = await Promise.all([
        sync.client.from("love_shared_state").upsert({ couple_id: sync.coupleId, data: shared, updated_by: sync.user.id }),
        sync.client.from("love_private_state").upsert({ couple_id: sync.coupleId, user_id: sync.user.id, data: privateData })
      ]);
      if (sharedResult.error || privateResult.error) updateUi("connected", "同步重试中");
    }, 500);
  }

  window.LoveSync = {
    async initialize() {
      bindUi();
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
    isConnected: () => Boolean(sync.coupleId),
    getRole: () => sync.role
  };
}());
