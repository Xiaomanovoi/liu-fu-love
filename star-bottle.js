(function () {
  const people = {
    liu: { name: "刘向强", short: "向强" },
    fu: { name: "付嘉颖", short: "嘉颖" }
  };
  const draftKey = "love-star-bottle-draft-v1";
  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => [...document.querySelectorAll(selector)];
  const emptySnapshot = () => ({
    role: null,
    counts: { liu: 0, fu: 0 },
    openedToday: false,
    pending: [],
    pendingTotal: 0,
    history: [],
    historyTotal: 0,
    historyRecipient: null
  });

  const els = {
    shortcutMeta: q("#starBottleShortcutMeta"), shortcutBadge: q("#starBottleShortcutBadge"),
    directions: qa("[data-star-recipient]"), stage: q("#starBottleStage"), canvasShell: q("#starBottleCanvasShell"), canvas: q("#starBottleCanvas"), flight: q("#starBottleFlight"), paperTag: q("#starBottlePaperTag"),
    dayChip: q("#starBottleDayChip"), relation: q("#starBottleRelation"), count: q("#starBottleCount"), stageStatus: q("#starBottleStageStatus"),
    compose: q("#starBottleCompose"), composeTitle: q("#starBottleComposeTitle"), form: q("#starBottleForm"), text: q("#starBottleText"), characterCount: q("#starBottleCharacterCount"),
    open: q("#starBottleOpen"), openTitle: q("#starBottleOpenTitle"), openMeta: q("#starBottleOpenMeta"), openButton: q("#openTodayStar"), notice: q("#starBottleNotice"),
    pending: q("#starBottlePending"), pendingCount: q("#starBottlePendingCount"), pendingList: q("#starBottlePendingList"), pendingMore: q("#starBottlePendingMore"),
    history: q("#starBottleHistory"), historyCount: q("#starBottleHistoryCount"), historyList: q("#starBottleHistoryList"), historyMore: q("#starBottleHistoryMore"), historyFilters: qa("[data-star-history-filter]"),
    openDialog: q("#starBottleOpenDialog"), cancelOpen: q("#cancelOpenTodayStar"), confirmOpen: q("#confirmOpenTodayStar"),
    revealDialog: q("#starBottleRevealDialog"), closeReveal: q("#closeStarBottleReveal"), revealDirection: q("#starBottleRevealDirection"), revealText: q("#starBottleRevealText"), revealMeta: q("#starBottleRevealMeta"),
    editDialog: q("#starBottleEditDialog"), editForm: q("#starBottleEditForm"), editId: q("#starBottleEditId"), editText: q("#starBottleEditText"), cancelEdit: q("#cancelStarBottleEdit")
  };

  if (!els.canvas || !els.form) return;

  let role = window.LoveSync?.getRole?.() || null;
  let connected = Boolean(window.LoveSync?.isConnected?.());
  let recipient = role || "fu";
  let historyFilter = "all";
  let historyLimit = 5;
  let pendingLimit = 5;
  let snapshot = emptySnapshot();
  let loadSequence = 0;

  bind();
  restoreDraft();
  render();

  function bind() {
    els.directions.forEach((button) => button.addEventListener("click", () => {
      recipient = button.dataset.starRecipient;
      render();
      drawBottle();
    }));
    els.text.addEventListener("input", () => {
      updateCharacterCount();
      saveDraft();
    });
    els.form.addEventListener("submit", createStar);
    els.openButton.addEventListener("click", () => {
      if (!canOpenToday()) return;
      els.openDialog.showModal();
    });
    els.cancelOpen.addEventListener("click", () => els.openDialog.close());
    els.confirmOpen.addEventListener("click", openTodayStar);
    els.closeReveal.addEventListener("click", () => els.revealDialog.close());
    els.cancelEdit.addEventListener("click", () => els.editDialog.close());
    els.editForm.addEventListener("submit", updateStar);
    els.pendingList.addEventListener("click", handleRecordAction);
    els.historyList.addEventListener("click", handleRecordAction);
    els.pendingMore.addEventListener("click", () => {
      pendingLimit += 20;
      loadSnapshot();
    });
    els.historyMore.addEventListener("click", () => {
      historyLimit += 20;
      loadSnapshot();
    });
    els.historyFilters.forEach((button) => button.addEventListener("click", () => {
      historyFilter = button.dataset.starHistoryFilter;
      historyLimit = 5;
      renderHistoryFilters();
      loadSnapshot();
    }));
    window.addEventListener("love-star-bottle-open", () => {
      if (role) recipient = role;
      render();
      drawBottle();
      loadSnapshot();
    });
    window.addEventListener("love-star-bottle-snapshot", (event) => applySnapshot(event.detail));
    window.addEventListener("love-star-bottle-changed", () => loadSnapshot(true));
    window.addEventListener("love-sync-status", (event) => {
      const detail = event.detail || {};
      connected = Boolean(detail.connected);
      if (detail.role) {
        const roleChanged = role !== detail.role;
        role = detail.role;
        if (roleChanged) {
          recipient = role;
          restoreDraft();
        }
      }
      if (!connected) snapshot = emptySnapshot();
      render();
      drawBottle();
    });
    window.addEventListener("love-sync-feature-error", (event) => {
      if (event.detail?.feature !== "stars") return;
      setNotice(event.detail.message, true);
    });
    let resizeTimer;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(drawBottle, 120);
    });
  }

  function normalizeSnapshot(value) {
    const counts = value?.counts || {};
    return {
      role: value?.role || role,
      counts: { liu: Number(counts.liu || 0), fu: Number(counts.fu || 0) },
      openedToday: Boolean(value?.opened_today ?? value?.openedToday),
      pending: Array.isArray(value?.pending) ? value.pending : [],
      pendingTotal: Number(value?.pending_total ?? value?.pendingTotal ?? 0),
      history: Array.isArray(value?.history) ? value.history : [],
      historyTotal: Number(value?.history_total ?? value?.historyTotal ?? 0),
      historyRecipient: value?.history_recipient ?? value?.historyRecipient ?? null
    };
  }

  function applySnapshot(value) {
    const next = normalizeSnapshot(value);
    if (next.role) role = next.role;
    snapshot.counts = next.counts;
    snapshot.openedToday = next.openedToday;
    snapshot.pending = next.pending;
    snapshot.pendingTotal = next.pendingTotal;
    const expectedFilter = historyFilter === "all" ? null : historyFilter;
    if ((next.historyRecipient || null) === expectedFilter) {
      snapshot.history = next.history;
      snapshot.historyTotal = next.historyTotal;
      snapshot.historyRecipient = next.historyRecipient;
    }
    render();
    drawBottle();
  }

  async function loadSnapshot(silent = false) {
    if (!connected || !window.LoveSync?.refreshStarBottle) {
      if (!silent) setNotice("登录并进入双人空间后才能使用星语瓶。", true);
      return;
    }
    const sequence = ++loadSequence;
    if (!silent) setNotice("正在读取瓶中的星星……");
    try {
      const data = await window.LoveSync.refreshStarBottle({
        historyRecipient: historyFilter === "all" ? null : historyFilter,
        historyLimit,
        pendingLimit
      });
      if (sequence !== loadSequence || !data) return;
      applySnapshot(data);
      if (!silent) setNotice("");
    } catch (error) {
      if (sequence !== loadSequence) return;
      setNotice(errorMessage(error), true);
    }
  }

  function isIncoming() {
    return Boolean(role && recipient === role);
  }

  function outgoingRecipient() {
    return role === "liu" ? "fu" : "liu";
  }

  function render() {
    const selectedCount = snapshot.counts[recipient] || 0;
    const incomingCount = role ? snapshot.counts[role] || 0 : 0;
    const outgoingCount = role ? snapshot.counts[outgoingRecipient()] || 0 : 0;
    els.directions.forEach((button) => button.classList.toggle("is-active", button.dataset.starRecipient === recipient));
    els.stage.dataset.tone = recipient === "fu" ? "coral" : "mint";
    els.paperTag.textContent = `给${people[recipient].short}`;
    els.relation.textContent = recipient === "fu" ? "向强写给嘉颖" : "嘉颖写给向强";
    els.count.textContent = selectedCount;
    els.stageStatus.textContent = selectedCount ? "星星正在瓶中安静等待" : "瓶子里还没有星星";
    els.compose.hidden = !role || isIncoming();
    els.open.hidden = !role || !isIncoming();
    els.pending.hidden = !role || isIncoming();
    els.composeTitle.textContent = `藏一颗星给${people[recipient].short}`;
    els.text.placeholder = `写下想对${people[recipient].short}说的一段话……`;
    els.pendingCount.textContent = `${snapshot.pendingTotal} 颗`;
    els.historyCount.textContent = `${snapshot.historyTotal} 条`;
    els.shortcutMeta.textContent = role
      ? `你的瓶里 ${incomingCount} 颗 · 等待对方开启 ${outgoingCount} 颗`
      : "登录后查看属于你们的两只瓶子";
    els.shortcutBadge.hidden = incomingCount <= 0;
    els.shortcutBadge.textContent = incomingCount > 99 ? "99+" : String(incomingCount);
    if (!connected) {
      els.dayChip.textContent = "等待连接";
    } else if (!isIncoming()) {
      els.dayChip.textContent = "等待对方开启";
    }
    renderOpenState(selectedCount);
    renderPending();
    renderHistoryFilters();
    renderHistory();
    updateCharacterCount();
  }

  function renderOpenState(selectedCount) {
    if (!role || !isIncoming()) return;
    if (snapshot.openedToday) {
      els.dayChip.textContent = "今日已开启";
      els.openTitle.textContent = "今天的星星已经打开";
      els.openMeta.textContent = "明天零点会有新的机会";
      els.openButton.disabled = true;
      els.openButton.querySelector("span").textContent = "明天再来";
      return;
    }
    els.dayChip.textContent = "今日可开启";
    els.openTitle.textContent = selectedCount ? "今天还可以开启一颗" : "等待对方藏入星星";
    els.openMeta.textContent = selectedCount ? "从瓶中随机抽取" : "有星星后即可开启";
    els.openButton.disabled = selectedCount <= 0 || !connected;
    els.openButton.querySelector("span").textContent = "开启今日星星";
  }

  function renderPending() {
    els.pendingList.replaceChildren();
    if (!snapshot.pending.length) {
      els.pendingList.append(emptyElement("还没有等待开启的星星。"));
    } else {
      snapshot.pending.forEach((note) => els.pendingList.append(recordElement(note, "pending")));
    }
    els.pendingMore.hidden = snapshot.pending.length >= snapshot.pendingTotal;
    els.pendingMore.textContent = `查看更多（还有 ${Math.max(0, snapshot.pendingTotal - snapshot.pending.length)} 颗）`;
  }

  function renderHistoryFilters() {
    els.historyFilters.forEach((button) => button.classList.toggle("is-active", button.dataset.starHistoryFilter === historyFilter));
  }

  function renderHistory() {
    els.historyList.replaceChildren();
    if (!snapshot.history.length) {
      els.historyList.append(emptyElement("还没有开启过的星光。"));
    } else {
      snapshot.history.forEach((note) => els.historyList.append(recordElement(note, "history")));
    }
    els.historyMore.hidden = snapshot.history.length >= snapshot.historyTotal;
    els.historyMore.textContent = `查看更多（还有 ${Math.max(0, snapshot.historyTotal - snapshot.history.length)} 条）`;
    refreshIcons();
  }

  function recordElement(note, type) {
    const article = document.createElement("article");
    article.className = "star-bottle-record";
    article.dataset.recipient = note.recipient_role;
    const content = document.createElement("p");
    content.textContent = note.content || "";
    article.append(content);
    const meta = document.createElement("div");
    meta.className = "star-bottle-record-meta";
    const direction = document.createElement("strong");
    direction.textContent = `${people[note.sender_role]?.short || "对方"} → ${people[note.recipient_role]?.short || "对方"}`;
    meta.append(direction);
    const created = document.createElement("span");
    created.textContent = `写于 ${formatDateTime(note.created_at)}`;
    meta.append(created);
    if (type === "history") {
      const opened = document.createElement("span");
      opened.textContent = `开启于 ${formatDateTime(note.opened_at)}`;
      meta.append(opened);
    } else if (wasEdited(note)) {
      const edited = document.createElement("span");
      edited.textContent = "已修改";
      meta.append(edited);
    }
    article.append(meta);
    const actions = document.createElement("div");
    actions.className = "star-bottle-record-actions";
    if (type === "pending") actions.append(actionButton("edit", note.id, "pencil", "编辑这颗星"));
    if (type === "pending" || note.can_delete) actions.append(actionButton("delete", note.id, "trash-2", "删除这颗星", true));
    if (actions.childElementCount) article.append(actions);
    return article;
  }

  function actionButton(action, id, icon, label, danger = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.starAction = action;
    button.dataset.starId = id;
    button.classList.toggle("danger", danger);
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
    return button;
  }

  function emptyElement(text) {
    const element = document.createElement("div");
    element.className = "star-bottle-empty";
    element.textContent = text;
    return element;
  }

  async function createStar(event) {
    event.preventDefault();
    const content = els.text.value.trim();
    if (!content) {
      setNotice("先写下一段想说的话。", true);
      els.text.focus();
      return;
    }
    const button = els.form.querySelector("button[type=submit]");
    setButtonBusy(button, true, "正在折成星星……");
    try {
      await window.LoveSync.createStarNote(content);
      els.text.value = "";
      clearDraft();
      updateCharacterCount();
      playDropAnimation();
      setNotice("这段话已经变成一颗星，安静地落进瓶子里。 ");
      await loadSnapshot(true);
    } catch (error) {
      setNotice(errorMessage(error), true);
    } finally {
      setButtonBusy(button, false, "藏入一颗星");
    }
  }

  function canOpenToday() {
    return connected && isIncoming() && !snapshot.openedToday && (snapshot.counts[recipient] || 0) > 0;
  }

  async function openTodayStar() {
    if (!canOpenToday()) {
      els.openDialog.close();
      return;
    }
    setButtonBusy(els.confirmOpen, true, "正在抽取……");
    try {
      const result = await window.LoveSync.openStarNote();
      els.openDialog.close();
      const note = result?.note || result;
      if (!note?.content) throw new Error("星星内容读取失败，请刷新后重试");
      playOpenAnimation();
      window.setTimeout(() => showReveal(note), reducedMotion() ? 0 : 420);
      await loadSnapshot(true);
    } catch (error) {
      els.openDialog.close();
      setNotice(errorMessage(error), true);
      await loadSnapshot(true);
    } finally {
      setButtonBusy(els.confirmOpen, false, "确定开启");
    }
  }

  function showReveal(note) {
    els.revealDirection.textContent = `${people[note.sender_role]?.short || "对方"} 写给 ${people[note.recipient_role]?.short || "你"}`;
    els.revealText.textContent = note.content;
    els.revealMeta.textContent = `写于 ${formatDateTime(note.created_at)} · 开启于 ${formatDateTime(note.opened_at)}`;
    els.revealDialog.showModal();
  }

  function handleRecordAction(event) {
    const button = event.target.closest("[data-star-action]");
    if (!button) return;
    const note = [...snapshot.pending, ...snapshot.history].find((item) => item.id === button.dataset.starId);
    if (!note) return;
    if (button.dataset.starAction === "edit") {
      els.editId.value = note.id;
      els.editText.value = note.content || "";
      els.editDialog.showModal();
      els.editText.focus();
      return;
    }
    const opened = Boolean(note.opened_at);
    const confirmed = window.confirm(opened
      ? "确定删除这条已开启记录吗？删除后双方都无法再看到。"
      : "确定删除这颗尚未开启的星星吗？对方瓶中的数量会同时减少。");
    if (confirmed) deleteStar(note.id);
  }

  async function updateStar(event) {
    event.preventDefault();
    const content = els.editText.value.trim();
    if (!content) return;
    const button = els.editForm.querySelector("button[type=submit]");
    setButtonBusy(button, true, "保存中……");
    try {
      await window.LoveSync.updateStarNote(els.editId.value, content);
      els.editDialog.close();
      setNotice("这颗尚未开启的星星已经修改。 ");
      await loadSnapshot(true);
    } catch (error) {
      setNotice(errorMessage(error), true);
    } finally {
      setButtonBusy(button, false, "保存修改");
    }
  }

  async function deleteStar(id) {
    setNotice("正在移走这颗星……");
    try {
      await window.LoveSync.deleteStarNote(id);
      setNotice("这颗星已经删除。 ");
      await loadSnapshot(true);
    } catch (error) {
      setNotice(errorMessage(error), true);
    }
  }

  function saveDraft() {
    if (!role) return;
    try {
      const drafts = JSON.parse(localStorage.getItem(draftKey)) || {};
      drafts[role] = els.text.value;
      localStorage.setItem(draftKey, JSON.stringify(drafts));
    } catch { }
  }

  function restoreDraft() {
    if (!role) return;
    try {
      const drafts = JSON.parse(localStorage.getItem(draftKey)) || {};
      els.text.value = drafts[role] || "";
    } catch { els.text.value = ""; }
    updateCharacterCount();
  }

  function clearDraft() {
    if (!role) return;
    try {
      const drafts = JSON.parse(localStorage.getItem(draftKey)) || {};
      delete drafts[role];
      localStorage.setItem(draftKey, JSON.stringify(drafts));
    } catch { }
  }

  function updateCharacterCount() {
    els.characterCount.textContent = `${els.text.value.length}/500`;
  }

  function setNotice(message, isError = false) {
    els.notice.textContent = message || "";
    els.notice.dataset.mode = isError ? "error" : "normal";
  }

  function setButtonBusy(button, busy, label) {
    button.disabled = busy;
    const span = button.querySelector("span");
    if (span) span.textContent = label;
    else button.textContent = label;
  }

  function errorMessage(error) {
    const detail = [error?.message, error?.details, error?.hint].filter(Boolean).join(" ");
    if (/STAR_ALREADY_OPENED_TODAY/i.test(detail)) return "今天已经开启过一颗星，明天再来。";
    if (/STAR_BOTTLE_EMPTY/i.test(detail)) return "瓶子里暂时没有可以开启的星星。";
    if (/STAR_NOTE_NOT_EDITABLE/i.test(detail)) return "这颗星已经开启，不能再修改。";
    if (/STAR_NOTE_NOT_FOUND/i.test(detail)) return "这颗星已经发生变化，请刷新后重试。";
    if (/PGRST202|42883|does not exist|love_star_notes|schema cache/i.test(detail)) return "星语瓶的数据库功能尚未启用，请先执行 supabase-star-bottle.sql。";
    return detail || "操作失败，请检查网络后重试。";
  }

  function wasEdited(note) {
    if (!note.updated_at || !note.created_at) return false;
    return Math.abs(new Date(note.updated_at) - new Date(note.created_at)) > 1500;
  }

  function formatDateTime(value) {
    if (!value) return "时间未知";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "时间未知";
    return new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false
    }).format(date);
  }

  function refreshIcons() {
    window.setTimeout(() => window.lucide?.createIcons(), 0);
  }

  function reducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }

  function playDropAnimation() {
    els.canvasShell.classList.remove("is-dropping");
    void els.canvasShell.offsetWidth;
    els.canvasShell.classList.add("is-dropping");
    window.setTimeout(() => els.canvasShell.classList.remove("is-dropping"), 900);
  }

  function playOpenAnimation() {
    els.canvasShell.classList.remove("is-opening");
    void els.canvasShell.offsetWidth;
    els.canvasShell.classList.add("is-opening");
    window.setTimeout(() => els.canvasShell.classList.remove("is-opening"), 700);
  }

  function drawBottle() {
    const canvas = els.canvas;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, rect.width || 320);
    const height = width * 19 / 16;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr * width / 320, 0, 0, dpr * height / 380, 0, 0);
    ctx.clearRect(0, 0, 320, 380);
    const tone = recipient === "fu" ? "coral" : "mint";
    const count = snapshot.counts[recipient] || 0;

    ctx.save();
    ctx.filter = "blur(7px)";
    ctx.fillStyle = "rgba(79,57,48,.16)";
    ctx.beginPath();
    ctx.ellipse(160, 340, 92, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const body = bottlePath(ctx);
    const glass = ctx.createLinearGradient(55, 0, 270, 0);
    glass.addColorStop(0, "rgba(218,236,231,.48)");
    glass.addColorStop(.2, "rgba(255,255,255,.2)");
    glass.addColorStop(.72, tone === "coral" ? "rgba(246,218,218,.2)" : "rgba(208,232,218,.22)");
    glass.addColorStop(1, "rgba(176,207,201,.38)");
    ctx.fillStyle = glass;
    ctx.fill(body);

    ctx.save();
    ctx.clip(body);
    drawStars(ctx, count, tone);
    ctx.restore();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(112,153,145,.48)";
    ctx.stroke(body);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,.84)";
    ctx.stroke(body);

    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255,255,255,.72)";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(91, 130);
    ctx.bezierCurveTo(68, 174, 75, 255, 94, 301);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.38)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(221, 142);
    ctx.bezierCurveTo(242, 198, 239, 265, 222, 304);
    ctx.stroke();
    ctx.restore();

    const neckGlass = ctx.createLinearGradient(110, 0, 210, 0);
    neckGlass.addColorStop(0, "rgba(204,226,222,.42)");
    neckGlass.addColorStop(.5, "rgba(255,255,255,.28)");
    neckGlass.addColorStop(1, "rgba(166,201,194,.4)");
    ctx.fillStyle = neckGlass;
    ctx.strokeStyle = "rgba(108,151,142,.5)";
    ctx.lineWidth = 2.5;
    roundRect(ctx, 117, 50, 86, 75, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.62)";
    roundRect(ctx, 129, 58, 13, 55, 6);
    ctx.fill();

    const cork = ctx.createLinearGradient(0, 24, 0, 59);
    cork.addColorStop(0, "#c99b6b");
    cork.addColorStop(1, "#a97750");
    ctx.fillStyle = cork;
    roundRect(ctx, 112, 24, 96, 37, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(99,61,39,.28)";
    ctx.lineWidth = 1.5;
    for (let y = 32; y <= 52; y += 7) {
      ctx.beginPath();
      ctx.moveTo(121, y);
      ctx.quadraticCurveTo(160, y + 3, 199, y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,.18)";
    roundRect(ctx, 119, 28, 10, 27, 4);
    ctx.fill();
  }

  function bottlePath(ctx) {
    const path = new Path2D();
    path.moveTo(117, 105);
    path.bezierCurveTo(112, 121, 91, 127, 79, 145);
    path.bezierCurveTo(59, 175, 58, 282, 77, 314);
    path.bezierCurveTo(93, 341, 227, 341, 243, 314);
    path.bezierCurveTo(262, 282, 261, 175, 241, 145);
    path.bezierCurveTo(229, 127, 208, 121, 203, 105);
    path.closePath();
    return path;
  }

  function drawStars(ctx, count, tone) {
    if (!count) return;
    const visible = Math.min(count, 140);
    const columns = visible <= 7 ? 5 : visible <= 28 ? 7 : visible <= 72 ? 9 : 11;
    const spacingX = visible <= 7 ? 31 : visible <= 28 ? 24 : visible <= 72 ? 19 : 15;
    const spacingY = visible <= 7 ? 27 : visible <= 28 ? 20 : visible <= 72 ? 15 : 12;
    const size = visible <= 7 ? 15 : visible <= 28 ? 11 : visible <= 72 ? 8 : 6.5;
    const colors = tone === "coral"
      ? ["#df7b8b", "#e9b2aa", "#e6bd68", "#a69ac7", "#88ad9a"]
      : ["#79a88f", "#9ab9ad", "#e2b766", "#d98b91", "#a99bc7"];
    for (let i = 0; i < visible; i += 1) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const random = pseudoRandom(i + (recipient === "fu" ? 41 : 97));
      const rowCount = Math.min(columns, visible - row * columns);
      const rowWidth = (rowCount - 1) * spacingX;
      const x = 160 - rowWidth / 2 + col * spacingX + (random - .5) * 5;
      const y = 300 - row * spacingY + (pseudoRandom(i * 3 + 11) - .5) * 5;
      drawStar(ctx, x, y, size * (.86 + pseudoRandom(i * 7 + 3) * .24), random * Math.PI, colors[i % colors.length]);
    }
  }

  function drawStar(ctx, x, y, radius, rotation, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.shadowColor = "rgba(86,61,53,.18)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      const length = i % 2 === 0 ? radius : radius * .48;
      const px = Math.cos(angle) * length;
      const py = Math.sin(angle) * length;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255,255,255,.5)";
    ctx.lineWidth = .8;
    ctx.beginPath();
    ctx.moveTo(0, -radius * .76);
    ctx.lineTo(0, radius * .35);
    ctx.stroke();
    ctx.restore();
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, width, height, radius);
      return;
    }
    const r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function pseudoRandom(seed) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }
}());
