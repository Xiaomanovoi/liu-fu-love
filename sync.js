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
      if (!email || !sync.client) return;
      const button = event.currentTarget.querySelector("button");
      button.disabled = true;
      const { error } = await sync.client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + window.location.pathname }
      });
      button.disabled = false;
      q("#inviteResult").textContent = error ? "登录链接发送失败，请检查项目配置。" : "登录链接已发送，请在邮箱中打开。";
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

  async function createPair() {
    const role = chosenRole();
    const { data, error } = await sync.client.rpc("create_love_space", { p_role: role });
    if (error) {
      q("#inviteResult").textContent = "创建失败，请确认数据库脚本已执行。";
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
      q("#inviteResult").textContent = "加入失败，请检查邀请码和身份选择。";
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
