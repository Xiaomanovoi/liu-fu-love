(function () {
  const people = {
    liu: { name: "刘向强", short: "向强" },
    fu: { name: "付嘉颖", short: "嘉颖" }
  };
  const draftKey = "love-star-bottle-draft-v1";
  const outboxKey = "love-star-bottle-outbox-v2";
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
  let historyExpanded = false;
  let pendingLimit = 5;
  let snapshot = emptySnapshot();
  let loadSequence = 0;
  let summarySequence = 0;
  let pendingLoaded = false;
  let historyLoaded = false;
  let remoteRefreshTimer = null;
  let deferredRefresh = false;
  let outboxFlushPromise = null;
  let lastDrawKey = "";

  bind();
  restoreDraft();
  hydrateOutbox();
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
    [els.openDialog, els.revealDialog, els.editDialog].forEach((dialog) => {
      dialog.addEventListener("close", flushDeferredRefresh);
    });
    els.text.addEventListener("blur", flushDeferredRefresh);
    els.editText.addEventListener("blur", flushDeferredRefresh);
    els.editForm.addEventListener("submit", updateStar);
    els.pendingList.addEventListener("click", handleRecordAction);
    els.historyList.addEventListener("click", handleRecordAction);
    els.pendingMore.addEventListener("click", () => {
      pendingLimit += 20;
      loadSnapshot();
    });
    els.historyMore.addEventListener("click", () => {
      historyExpanded = !historyExpanded;
      if (!historyExpanded) {
        renderHistory();
        return;
      }
      historyLimit = Math.max(5, Math.min(5000, snapshot.historyTotal || snapshot.history.length || 5));
      if (snapshot.history.length < snapshot.historyTotal) loadSnapshot();
      else renderHistory();
    });
    els.historyFilters.forEach((button) => button.addEventListener("click", () => {
      historyFilter = button.dataset.starHistoryFilter;
      historyLimit = 5;
      historyExpanded = false;
      renderHistoryFilters();
      loadSnapshot();
    }));
    els.pending.addEventListener("toggle", () => {
      if (!els.pending.open) return;
      renderPending();
      if (!pendingLoaded) loadSnapshot();
    });
    els.history.addEventListener("toggle", () => {
      if (!els.history.open) return;
      renderHistoryFilters();
      renderHistory();
      if (!historyLoaded) loadSnapshot();
    });
    window.addEventListener("love-star-bottle-open", () => {
      if (role) recipient = role;
      render();
      drawBottle();
      loadSummary();
      if (els.pending.open || els.history.open) loadSnapshot(true);
      flushOutbox();
    });
    window.addEventListener("love-star-bottle-summary", (event) => applySummary(event.detail));
    window.addEventListener("love-star-bottle-snapshot", (event) => applySnapshot(event.detail));
    window.addEventListener("love-star-bottle-changed", queueRemoteRefresh);
    window.addEventListener("love-sync-status", (event) => {
      const detail = event.detail || {};
      connected = Boolean(detail.connected);
      if (!connected) snapshot = emptySnapshot();
      if (detail.role) {
        const roleChanged = role !== detail.role;
        role = detail.role;
        if (roleChanged) {
          recipient = role;
          restoreDraft();
          hydrateOutbox();
        }
      }
      render();
      drawBottle();
      if (connected) flushOutbox();
    });
    window.addEventListener("love-sync-feature-error", (event) => {
      if (event.detail?.feature !== "stars") return;
      setNotice(event.detail.message, true);
    });
    let resizeTimer;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        lastDrawKey = "";
        drawBottle();
      }, 140);
    });
    window.addEventListener("online", () => {
      flushOutbox();
      queueRemoteRefresh();
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
      history: sortHistoryRecords(Array.isArray(value?.history) ? value.history : []),
      historyTotal: Number(value?.history_total ?? value?.historyTotal ?? 0),
      historyRecipient: value?.history_recipient ?? value?.historyRecipient ?? null
    };
  }

  function sortHistoryRecords(records) {
    const unique = new Map();
    (records || []).forEach((note) => {
      const key = note?.id || `${note?.sender_role || ""}-${note?.recipient_role || ""}-${note?.opened_at || note?.created_at || ""}`;
      if (!unique.has(key)) unique.set(key, note);
    });
    return [...unique.values()].sort((a, b) => {
      const right = Date.parse(b?.opened_at || b?.updated_at || b?.created_at || 0) || 0;
      const left = Date.parse(a?.opened_at || a?.updated_at || a?.created_at || 0) || 0;
      return right - left || String(b?.id || "").localeCompare(String(a?.id || ""));
    });
  }

  function applySnapshot(value) {
    const next = normalizeSnapshot(value);
    if (next.role) role = next.role;
    snapshot.counts = next.counts;
    snapshot.openedToday = next.openedToday;
    const pendingMerge = mergeOutboxNotes(next.pending);
    snapshot.pending = pendingMerge.notes;
    snapshot.pendingTotal = next.pendingTotal + pendingMerge.unmatched;
    pendingLoaded = true;
    const expectedFilter = historyFilter === "all" ? null : historyFilter;
    if ((next.historyRecipient || null) === expectedFilter) {
      snapshot.history = next.history;
      snapshot.historyTotal = next.historyTotal;
      snapshot.historyRecipient = next.historyRecipient;
      historyLoaded = true;
    }
    render();
    drawBottle();
  }

  function applySummary(value) {
    if (!value || typeof value !== "object") return;
    const counts = value.counts || {};
    const queued = readOutbox().filter((item) => item.role === role && item.status !== "cancelled");
    const outgoing = outgoingRecipient();
    const serverCounts = { liu: Number(counts.liu || 0), fu: Number(counts.fu || 0) };
    if (queued.length && outgoing) serverCounts[outgoing] = Math.max(serverCounts[outgoing], snapshot.counts[outgoing] || 0);
    snapshot.counts = serverCounts;
    snapshot.openedToday = Boolean(value.opened_today ?? value.openedToday);
    snapshot.pendingTotal = Math.max(Number(value.pending_total ?? value.pendingTotal ?? 0), queued.length);
    snapshot.historyTotal = Number(value.history_total ?? value.historyTotal ?? 0);
    if (value.role) role = value.role;
    render();
    drawBottle();
  }

  async function loadSummary(silent = false) {
    if (!connected || !window.LoveSync?.refreshStarBottleSummary) return;
    const sequence = ++summarySequence;
    if (!silent) setNotice("正在核对瓶中的星星……");
    try {
      const data = await window.LoveSync.refreshStarBottleSummary();
      if (sequence !== summarySequence || !data) return;
      applySummary(data);
      if (!silent) setNotice("");
    } catch (error) {
      if (sequence === summarySequence && !silent) setNotice(errorMessage(error), true);
    }
  }

  async function loadSnapshot(silent = false) {
    if (!connected || !window.LoveSync?.refreshStarBottle) {
      if (!silent) setNotice("登录并进入双人空间后才能使用星语瓶。", true);
      return;
    }
    const sequence = ++loadSequence;
    if (!silent) setNotice("正在读取瓶中的星星……");
    try {
      const historyRequestLimit = historyExpanded
        ? Math.max(historyLimit, Math.min(5000, snapshot.historyTotal || historyLimit))
        : Math.max(50, Math.min(5000, snapshot.historyTotal || 50));
      const data = await window.LoveSync.refreshStarBottle({
        historyRecipient: historyFilter === "all" ? null : historyFilter,
        historyLimit: historyRequestLimit,
        pendingLimit,
        force: silent
      });
      if (sequence !== loadSequence || !data) return;
      applySnapshot(data);
      if (!silent) setNotice("");
    } catch (error) {
      if (sequence !== loadSequence) return;
      setNotice(errorMessage(error), true);
    }
  }

  function queueRemoteRefresh() {
    window.clearTimeout(remoteRefreshTimer);
    remoteRefreshTimer = window.setTimeout(() => {
      if (interactionLocked()) {
        deferredRefresh = true;
        return;
      }
      loadSummary(true);
      if (els.pending.open || els.history.open) loadSnapshot(true);
    }, 500);
  }

  function flushDeferredRefresh() {
    if (!deferredRefresh || interactionLocked()) return;
    deferredRefresh = false;
    queueRemoteRefresh();
  }

  function interactionLocked() {
    const active = document.activeElement;
    return active === els.text || active === els.editText || els.openDialog.open || els.revealDialog.open || els.editDialog.open;
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
    const queuedCount = readOutbox().filter((item) => item.role === role && item.recipient === recipient && item.status !== "cancelled").length;
    els.stageStatus.textContent = queuedCount
      ? `${queuedCount} 颗正在等待送达`
      : selectedCount ? "星星正在瓶中安静等待" : "瓶子里还没有星星";
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
    if (els.pending.open) renderPending();
    if (els.history.open) {
      renderHistoryFilters();
      renderHistory();
    }
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
    if (!pendingLoaded && !readOutbox().some((item) => item.role === role)) {
      els.pendingList.append(emptyElement("展开后读取等待中的星星。"));
    } else if (!snapshot.pending.length) {
      els.pendingList.append(emptyElement("还没有等待开启的星星。"));
    } else {
      snapshot.pending.forEach((note) => els.pendingList.append(recordElement(note, "pending")));
    }
    els.pendingMore.hidden = !pendingLoaded || snapshot.pending.length >= snapshot.pendingTotal;
    els.pendingMore.textContent = `查看更多（还有 ${Math.max(0, snapshot.pendingTotal - snapshot.pending.length)} 颗）`;
  }

  function renderHistoryFilters() {
    els.historyFilters.forEach((button) => button.classList.toggle("is-active", button.dataset.starHistoryFilter === historyFilter));
  }

  function renderHistory() {
    els.historyList.replaceChildren();
    const sortedHistory = sortHistoryRecords(snapshot.history);
    const visibleHistory = historyExpanded ? sortedHistory : sortedHistory.slice(0, 5);
    if (!historyLoaded) {
      els.historyList.append(emptyElement("展开后读取已经开启的星光。"));
    } else if (!sortedHistory.length) {
      els.historyList.append(emptyElement("还没有开启过的星光。"));
    } else {
      visibleHistory.forEach((note) => els.historyList.append(recordElement(note, "history")));
    }
    els.historyMore.hidden = !historyLoaded || snapshot.historyTotal <= 5;
    els.historyMore.setAttribute("aria-expanded", String(historyExpanded));
    els.historyMore.textContent = historyExpanded
      ? "收起到最新 5 条"
      : `展开全部（共 ${snapshot.historyTotal} 条）`;
    refreshIcons();
  }

  function recordElement(note, type) {
    const article = document.createElement("article");
    article.className = "star-bottle-record";
    if (note.delivery_status) article.classList.add("is-delivering");
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
    if (note.delivery_status) {
      const delivery = document.createElement("span");
      delivery.className = "star-bottle-delivery-state";
      delivery.textContent = note.delivery_status === "sending" ? "正在送达" : "等待网络自动送达";
      meta.append(delivery);
    }
    article.append(meta);
    const actions = document.createElement("div");
    actions.className = "star-bottle-record-actions";
    if (type === "pending" && note.delivery_status !== "sending") actions.append(actionButton("edit", note.id, "pencil", "编辑这颗星"));
    if ((type === "pending" && note.delivery_status !== "sending") || note.can_delete) actions.append(actionButton("delete", note.id, "trash-2", "删除这颗星", true));
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
    if (!role) {
      setNotice("登录并进入双人空间后才能存入星星。", true);
      return;
    }
    const canSendNow = connected && navigator.onLine;
    const entry = {
      token: createClientToken(),
      content,
      role,
      recipient: outgoingRecipient(),
      createdAt: new Date().toISOString(),
      status: canSendNow ? "sending" : "queued",
      attempts: 0
    };
    if (!saveOutboxEntry(entry)) return;
    addOptimisticStar(entry);
    els.text.value = "";
    clearDraft();
    updateCharacterCount();
    playDropAnimation();
    navigator.vibrate?.(28);
    setNotice(canSendNow ? "星星已经落进瓶子，正在送达对方。" : "星星已安全保存在本机，联网后会自动送达。 ");
    if (canSendNow) sendQueuedStar(entry);
  }

  function canOpenToday() {
    return connected && isIncoming() && !snapshot.openedToday && (snapshot.counts[recipient] || 0) > 0;
  }

  async function openTodayStar() {
    if (!canOpenToday()) {
      els.openDialog.close();
      return;
    }
    ++loadSequence;
    ++summarySequence;
    setButtonBusy(els.confirmOpen, true, "正在抽取……");
    try {
      const result = await window.LoveSync.openStarNote();
      els.openDialog.close();
      const note = result?.note || result;
      if (!note?.content) throw new Error("星星内容读取失败，请刷新后重试");
      snapshot.counts[recipient] = Math.max(0, (snapshot.counts[recipient] || 0) - 1);
      snapshot.openedToday = true;
      snapshot.historyTotal += 1;
      const matchesHistoryFilter = historyFilter === "all" || historyFilter === note.recipient_role;
      if (historyLoaded && matchesHistoryFilter) {
        snapshot.history = sortHistoryRecords([{ ...note, can_delete: false }, ...snapshot.history]).slice(0, historyLimit);
      }
      render();
      drawBottle();
      playOpenAnimation();
      navigator.vibrate?.([22, 35, 22]);
      window.setTimeout(() => showReveal(note), reducedMotion() ? 0 : 420);
      if (els.history.open) loadSnapshot(true);
    } catch (error) {
      els.openDialog.close();
      setNotice(errorMessage(error), true);
      queueRemoteRefresh();
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
      const localEntry = readOutbox().find((item) => `local-${item.token}` === els.editId.value);
      if (localEntry) {
        localEntry.content = content;
        localEntry.status = "queued";
        replaceOutboxEntry(localEntry);
        const localNote = snapshot.pending.find((item) => item.id === els.editId.value);
        if (localNote) {
          localNote.content = content;
          localNote.updated_at = new Date().toISOString();
          localNote.delivery_status = "queued";
        }
        els.editDialog.close();
        render();
        setNotice("待送达的星星已经修改，网络恢复后会自动送出。 ");
        flushOutbox();
        return;
      }
      await window.LoveSync.updateStarNote(els.editId.value, content);
      const note = snapshot.pending.find((item) => item.id === els.editId.value);
      if (note) {
        note.content = content;
        note.updated_at = new Date().toISOString();
      }
      els.editDialog.close();
      setNotice("这颗尚未开启的星星已经修改。 ");
      render();
    } catch (error) {
      setNotice(errorMessage(error), true);
    } finally {
      setButtonBusy(button, false, "保存修改");
    }
  }

  async function deleteStar(id) {
    const localEntry = readOutbox().find((item) => `local-${item.token}` === id);
    if (localEntry) {
      if (Number(localEntry.attempts || 0) > 0) {
        localEntry.status = "cancelled";
        replaceOutboxEntry(localEntry);
      } else {
        removeOutboxEntry(localEntry.token);
      }
      removeLocalNote(id, false);
      setNotice(Number(localEntry.attempts || 0) > 0 ? "星星已从本机移走，正在确认云端撤销。 " : "这颗尚未送达的星星已经删除。 ");
      flushOutbox();
      return;
    }
    setNotice("正在移走这颗星……");
    try {
      await window.LoveSync.deleteStarNote(id);
      const opened = snapshot.history.some((item) => item.id === id);
      removeLocalNote(id, opened);
      setNotice("这颗星已经删除。 ");
    } catch (error) {
      setNotice(errorMessage(error), true);
    }
  }

  function createClientToken() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }

  function readOutbox() {
    try {
      const entries = JSON.parse(localStorage.getItem(outboxKey));
      return Array.isArray(entries) ? entries.filter((item) => item?.token && item?.content && item?.role) : [];
    } catch { return []; }
  }

  function writeOutbox(entries) {
    try {
      localStorage.setItem(outboxKey, JSON.stringify(entries));
      return true;
    } catch {
      setNotice("本机存储空间不足，星星尚未存入，请保留当前文字后重试。", true);
      return false;
    }
  }

  function saveOutboxEntry(entry) {
    const entries = readOutbox().filter((item) => item.token !== entry.token);
    entries.push(entry);
    return writeOutbox(entries);
  }

  function replaceOutboxEntry(entry) {
    saveOutboxEntry(entry);
  }

  function removeOutboxEntry(token) {
    writeOutbox(readOutbox().filter((item) => item.token !== token));
  }

  function outboxNote(entry) {
    return {
      id: `local-${entry.token}`,
      client_token: entry.token,
      sender_role: entry.role,
      recipient_role: entry.recipient,
      content: entry.content,
      created_at: entry.createdAt,
      updated_at: entry.createdAt,
      delivery_status: entry.status || "queued"
    };
  }

  function mergeOutboxNotes(remoteNotes) {
    const notes = Array.isArray(remoteNotes) ? [...remoteNotes] : [];
    const tokens = new Set(notes.map((item) => item.client_token).filter(Boolean));
    const queued = readOutbox().filter((item) => item.role === role && item.status !== "cancelled" && !tokens.has(item.token));
    const queuedNotes = queued.map(outboxNote);
    return {
      notes: [...queuedNotes, ...notes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      unmatched: queued.length
    };
  }

  function addOptimisticStar(entry) {
    const note = outboxNote(entry);
    snapshot.pending = [note, ...snapshot.pending.filter((item) => item.client_token !== entry.token)];
    snapshot.pendingTotal += 1;
    snapshot.counts[entry.recipient] = (snapshot.counts[entry.recipient] || 0) + 1;
    pendingLoaded = true;
    render();
    drawBottle();
  }

  function hydrateOutbox() {
    if (!role) return;
    const queued = readOutbox().filter((item) => item.role === role && item.status !== "cancelled");
    if (!queued.length) return;
    const merged = mergeOutboxNotes(snapshot.pending);
    snapshot.pending = merged.notes;
    snapshot.pendingTotal = Math.max(snapshot.pendingTotal, queued.length);
    for (const entry of queued) {
      snapshot.counts[entry.recipient] = Math.max(snapshot.counts[entry.recipient] || 0, queued.filter((item) => item.recipient === entry.recipient).length);
    }
    pendingLoaded = true;
  }

  async function sendQueuedStar(entry, quiet = false) {
    if (!connected || !navigator.onLine || !window.LoveSync?.createStarNote) return false;
    const latest = readOutbox().find((item) => item.token === entry.token);
    if (!latest) return true;
    latest.status = "sending";
    latest.attempts = Number(latest.attempts || 0) + 1;
    replaceOutboxEntry(latest);
    const localNote = snapshot.pending.find((item) => item.client_token === latest.token);
    if (localNote) localNote.delivery_status = "sending";
    if (els.pending.open) renderPending();
    try {
      const result = await window.LoveSync.createStarNote(latest.content, latest.token);
      const saved = result?.note || result;
      if (!saved?.id) throw new Error("星星送达后没有返回记录，请稍后重试");
      removeOutboxEntry(latest.token);
      const index = snapshot.pending.findIndex((item) => item.client_token === latest.token || item.id === `local-${latest.token}`);
      if (saved.deleted_at || saved.opened_at) {
        if (index >= 0) snapshot.pending.splice(index, 1);
        snapshot.pendingTotal = Math.max(0, snapshot.pendingTotal - 1);
        if (saved.opened_at) {
          snapshot.historyTotal += 1;
          if (historyLoaded) snapshot.history = [{ ...saved, can_delete: true }, ...snapshot.history];
        }
      } else if (index >= 0) {
        snapshot.pending.splice(index, 1, { ...saved, delivery_status: null });
      }
      if (result?.counts) {
        snapshot.counts = {
          liu: Number(result.counts.liu || 0),
          fu: Number(result.counts.fu || 0)
        };
      }
      render();
      drawBottle();
      if (!quiet) setNotice("星星已经送达，正在瓶中等待对方开启。 ");
      return true;
    } catch (error) {
      const queued = readOutbox().find((item) => item.token === latest.token);
      if (!queued) return false;
      queued.status = "queued";
      replaceOutboxEntry(queued);
      const pending = snapshot.pending.find((item) => item.client_token === queued.token);
      if (pending) pending.delivery_status = "queued";
      render();
      if (!quiet) setNotice("网络暂时较慢，星星已保存在本机，将自动重试送达。 ");
      const delay = Math.min(60000, 4000 * Math.max(1, queued.attempts || 1));
      window.setTimeout(flushOutbox, delay);
      return false;
    }
  }

  function flushOutbox() {
    if (outboxFlushPromise || !connected || !navigator.onLine || !role) return outboxFlushPromise;
    const entries = readOutbox().filter((item) => item.role === role);
    if (!entries.length) return null;
    outboxFlushPromise = (async () => {
      for (const entry of entries) {
        const delivered = entry.status === "cancelled"
          ? await cancelQueuedStar(entry)
          : await sendQueuedStar(entry, true);
        if (!delivered) break;
      }
    })().finally(() => { outboxFlushPromise = null; });
    return outboxFlushPromise;
  }

  async function cancelQueuedStar(entry) {
    if (!connected || !navigator.onLine || !window.LoveSync?.deleteStarNoteByToken) return false;
    try {
      await window.LoveSync.deleteStarNoteByToken(entry.token);
      removeOutboxEntry(entry.token);
      return true;
    } catch {
      window.setTimeout(flushOutbox, 15000);
      return false;
    }
  }

  function removeLocalNote(id, opened) {
    if (opened) {
      const note = snapshot.history.find((item) => item.id === id);
      snapshot.history = snapshot.history.filter((item) => item.id !== id);
      snapshot.historyTotal = Math.max(0, snapshot.historyTotal - 1);
      if (note?.recipient_role && !note.opened_at) snapshot.counts[note.recipient_role] = Math.max(0, (snapshot.counts[note.recipient_role] || 0) - 1);
    } else {
      const note = snapshot.pending.find((item) => item.id === id);
      snapshot.pending = snapshot.pending.filter((item) => item.id !== id);
      snapshot.pendingTotal = Math.max(0, snapshot.pendingTotal - 1);
      if (note?.recipient_role) snapshot.counts[note.recipient_role] = Math.max(0, (snapshot.counts[note.recipient_role] || 0) - 1);
    }
    render();
    drawBottle();
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

  function drawBottle(force = false) {
    const canvas = els.canvas;
    if (!canvas.closest(".screen")?.classList.contains("is-active")) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, rect.width || 320);
    const height = width * 19 / 16;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const tone = recipient === "fu" ? "coral" : "mint";
    const count = snapshot.counts[recipient] || 0;
    const drawKey = `${tone}:${count}:${Math.round(width)}:${dpr}`;
    if (!force && drawKey === lastDrawKey) return;
    lastDrawKey = drawKey;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr * width / 320, 0, 0, dpr * height / 380, 0, 0);
    ctx.clearRect(0, 0, 320, 380);

    const shadow = ctx.createRadialGradient(160, 339, 18, 160, 339, 102);
    shadow.addColorStop(0, "rgba(76,57,50,.2)");
    shadow.addColorStop(.58, "rgba(76,57,50,.08)");
    shadow.addColorStop(1, "rgba(76,57,50,0)");
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(160, 339, 105, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    const body = bottlePath(ctx);
    const glass = ctx.createLinearGradient(66, 0, 254, 0);
    glass.addColorStop(0, "rgba(190,220,214,.34)");
    glass.addColorStop(.13, "rgba(255,255,255,.22)");
    glass.addColorStop(.52, tone === "coral" ? "rgba(255,231,229,.13)" : "rgba(224,243,233,.14)");
    glass.addColorStop(.86, "rgba(255,255,255,.19)");
    glass.addColorStop(1, "rgba(164,202,195,.36)");
    ctx.fillStyle = glass;
    ctx.fill(body);

    ctx.save();
    ctx.clip(body);
    const bottomGlow = ctx.createLinearGradient(0, 246, 0, 337);
    bottomGlow.addColorStop(0, "rgba(255,255,255,0)");
    bottomGlow.addColorStop(1, tone === "coral" ? "rgba(238,171,174,.11)" : "rgba(136,189,163,.11)");
    ctx.fillStyle = bottomGlow;
    ctx.fillRect(54, 235, 212, 110);
    drawStars(ctx, count, tone);
    ctx.strokeStyle = "rgba(255,255,255,.42)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(86, 317);
    ctx.quadraticCurveTo(160, 338, 234, 317);
    ctx.stroke();
    ctx.restore();

    ctx.lineWidth = 3.2;
    ctx.strokeStyle = "rgba(103,151,143,.46)";
    ctx.stroke(body);
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.stroke(body);

    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255,255,255,.76)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(98, 133);
    ctx.bezierCurveTo(73, 170, 78, 250, 96, 290);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.42)";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(222, 145);
    ctx.bezierCurveTo(242, 195, 237, 258, 224, 291);
    ctx.stroke();
    ctx.restore();

    const neckGlass = ctx.createLinearGradient(116, 0, 204, 0);
    neckGlass.addColorStop(0, "rgba(190,220,215,.42)");
    neckGlass.addColorStop(.48, "rgba(255,255,255,.24)");
    neckGlass.addColorStop(1, "rgba(157,199,191,.4)");
    ctx.fillStyle = neckGlass;
    ctx.strokeStyle = "rgba(108,151,142,.5)";
    ctx.lineWidth = 2.7;
    roundRect(ctx, 119, 50, 82, 76, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.62)";
    roundRect(ctx, 130, 57, 12, 57, 6);
    ctx.fill();

    const ribbon = tone === "coral" ? "#d8838e" : "#78a88f";
    ctx.fillStyle = ribbon;
    roundRect(ctx, 116, 107, 88, 11, 4);
    ctx.fill();
    ctx.fillStyle = tone === "coral" ? "#bf6675" : "#5f8f78";
    ctx.beginPath();
    ctx.moveTo(194, 115);
    ctx.lineTo(207, 132);
    ctx.lineTo(190, 124);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.24)";
    roundRect(ctx, 122, 109, 58, 3, 1.5);
    ctx.fill();

    const cork = ctx.createLinearGradient(0, 24, 0, 59);
    cork.addColorStop(0, "#d4a777");
    cork.addColorStop(.5, "#bd895c");
    cork.addColorStop(1, "#9f6f4c");
    ctx.fillStyle = cork;
    roundRect(ctx, 113, 24, 94, 38, 8);
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
    path.moveTo(119, 108);
    path.bezierCurveTo(115, 123, 96, 129, 83, 145);
    path.bezierCurveTo(62, 171, 60, 280, 76, 311);
    path.bezierCurveTo(88, 337, 104, 343, 160, 343);
    path.bezierCurveTo(216, 343, 232, 337, 244, 311);
    path.bezierCurveTo(260, 280, 258, 171, 237, 145);
    path.bezierCurveTo(224, 129, 205, 123, 201, 108);
    path.closePath();
    return path;
  }

  function drawStars(ctx, count, tone) {
    if (!count) return;
    const visible = Math.min(count, 60);
    const size = visible <= 6 ? 15 : visible <= 20 ? 11.5 : visible <= 40 ? 9.5 : 8.2;
    const colors = tone === "coral"
      ? ["#dc7485", "#e6a49f", "#e6bb65", "#9f92c2", "#7da58e"]
      : ["#6f9f86", "#91b4a4", "#dfb35a", "#d68189", "#9d90be"];
    let index = 0;
    let row = 0;
    while (index < visible) {
      const halfWidth = Math.max(45, 72 - row * 3.2);
      const capacity = Math.max(1, Math.floor((halfWidth * 2) / (size * 1.6)));
      const rowCount = Math.min(capacity, visible - index);
      const spacing = rowCount === 1 ? 0 : Math.min(size * 1.7, (halfWidth * 2) / (rowCount - 1));
      const rowWidth = (rowCount - 1) * spacing;
      for (let column = 0; column < rowCount; column += 1) {
        const i = index + column;
        const random = pseudoRandom(i + (recipient === "fu" ? 41 : 97));
        const x = 160 - rowWidth / 2 + column * spacing + (random - .5) * size * .42;
        const y = 303 - row * size * 1.32 + (pseudoRandom(i * 3 + 11) - .5) * size * .32;
        const radius = size * (.9 + pseudoRandom(i * 7 + 3) * .18);
        drawFoldedStar(ctx, x, y, radius, (random - .5) * .9, colors[i % colors.length]);
      }
      index += rowCount;
      row += 1;
    }
  }

  function drawFoldedStar(ctx, x, y, radius, rotation, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.shadowColor = "rgba(75,52,48,.2)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2.5;
    const points = [];
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      const length = i % 2 === 0 ? radius : radius * .5;
      const px = Math.cos(angle) * length;
      const py = Math.sin(angle) * length;
      points.push({ x: px, y: py });
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowColor = "transparent";
    for (let i = 0; i < 5; i += 1) {
      const outer = points[i * 2];
      const nextInner = points[(i * 2 + 1) % 10];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(outer.x, outer.y);
      ctx.lineTo(nextInner.x, nextInner.y);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,.24)" : "rgba(72,48,55,.11)";
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(255,255,255,.48)";
    ctx.lineWidth = .7;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.2)";
    ctx.beginPath();
    ctx.arc(-radius * .12, -radius * .15, Math.max(1.1, radius * .1), 0, Math.PI * 2);
    ctx.fill();
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
