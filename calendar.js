(function () {
  const q = (id) => document.getElementById(id);
  const chinaDate = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit"
  });
  const dayLabel = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "UTC", month: "long", day: "numeric", weekday: "long"
  });
  const timeLabel = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"
  });
  const lunarDate = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
    timeZone: "Asia/Shanghai", month: "long", day: "numeric"
  });
  const hasLunarCalendar = lunarDate.resolvedOptions().calendar === "chinese";
  const solarFestivals = {
    "01-01": "元旦", "02-14": "情人节", "05-01": "劳动节", "05-20": "520",
    "06-01": "儿童节", "10-01": "国庆节", "12-24": "平安夜", "12-25": "圣诞节"
  };
  const lunarFestivals = {
    "正月1": "春节", "正月15": "元宵节", "五月5": "端午节", "七月7": "七夕",
    "八月15": "中秋节", "九月9": "重阳节"
  };
  const lunarDayNames = [
    "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
  ];
  const names = { liu: "向强", fu: "嘉颖" };
  const dialog = q("calendarDialog");
  const days = q("calendarDays");
  const entries = q("calendarEntries");
  const input = q("calendarBody");
  const repeat = q("calendarRepeat");
  const firstMonth = "1900-01";
  const lastMonth = "2100-12";
  let today = dateInChina();
  let selected = today;
  let scope = null;
  let visible = false;
  let poll = null;
  let pending = null;
  let snapshot = null;
  let snapshotDay = "";
  let snapshotKey = "";
  let status = "";
  let canRetry = false;
  let expanded = new Set();
  let draft = null;
  let saving = false;
  const deleting = new Set();
  const dateDetails = new Map();
  let detailsMonth = "";

  function dateInChina(date = new Date()) {
    const parts = chinaDate.formatToParts(date);
    return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type).value).join("-");
  }

  function utcDate(iso) {
    return new Date(`${iso}T00:00:00Z`);
  }

  function lunarParts(date) {
    if (!hasLunarCalendar) return null;
    const parts = lunarDate.formatToParts(date);
    const month = parts.find((part) => part.type === "month")?.value;
    const day = Number(parts.find((part) => part.type === "day")?.value);
    return month && lunarDayNames[day - 1] ? { month, day } : null;
  }

  function getDateDetails(iso) {
    const month = iso.slice(0, 7);
    if (month !== detailsMonth) {
      dateDetails.clear();
      detailsMonth = month;
    }
    if (dateDetails.has(iso)) return dateDetails.get(iso);
    const date = utcDate(iso);
    const lunar = lunarParts(date);
    const festivals = [solarFestivals[iso.slice(5)], lunar && lunarFestivals[lunar.month + lunar.day]];
    if (lunar?.day >= 29) {
      date.setUTCDate(date.getUTCDate() + 1);
      const next = lunarParts(date);
      if (next?.month === "正月" && next.day === 1) festivals.push("除夕");
    }
    const lunarDay = lunarDayNames[lunar?.day - 1];
    const details = {
      festivals: festivals.filter(Boolean),
      lunarShort: lunar?.day === 1 ? lunar.month : lunarDay,
      lunarFull: lunar ? lunar.month + lunarDay : ""
    };
    dateDetails.set(iso, details);
    return details;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function action(text, click, className = "calendar-small", icon) {
    const button = element("button", className, icon ? "" : text);
    button.type = "button";
    if (icon) {
      const mark = element("i");
      mark.dataset.lucide = icon;
      mark.setAttribute("aria-hidden", "true");
      button.append(mark);
      button.setAttribute("aria-label", text);
      button.title = text;
    }
    button.addEventListener("click", click);
    return button;
  }

  function renderMonth() {
    const month = selected.slice(0, 7);
    const first = utcDate(`${month}-01`);
    const count = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    const offset = (first.getUTCDay() + 6) % 7;
    const marks = snapshotDay.slice(0, 7) === month ? snapshot?.marks || [] : [];
    const byDay = new Map(marks.map((mark) => [mark.day_number, mark]));
    const focusedDay = days.contains(document.activeElement) ? document.activeElement.dataset.day : null;
    const cells = document.createDocumentFragment();
    q("calendarTodayLabel").textContent = `今天 · ${dayLabel.format(utcDate(today))}`;
    q("calendarMonthLabel").textContent = `${first.getUTCFullYear()} 年 ${first.getUTCMonth() + 1} 月`;
    q("calendarPrev").disabled = month === firstMonth;
    q("calendarNext").disabled = month === lastMonth;
    for (let i = 0; i < offset; i++) cells.append(element("span"));

    for (let day = 1; day <= count; day++) {
      const iso = `${month}-${String(day).padStart(2, "0")}`;
      const { festivals, lunarShort, lunarFull } = getDateDetails(iso);
      const mark = byDay.get(day);
      const button = action("", () => selectDay(iso), "calendar-date");
      button.dataset.day = iso;
      button.setAttribute("aria-pressed", String(iso === selected));
      if (iso === today) button.setAttribute("aria-current", "date");
      button.setAttribute("aria-label", [
        dayLabel.format(utcDate(iso)), lunarFull && `农历${lunarFull}`, ...festivals, mark?.event && "重要日子",
        mark?.liu && "向强有记录", mark?.fu && "嘉颖有记录"
      ].filter(Boolean).join("，"));
      button.append(element("span", "calendar-number", String(day)));
      const dateNote = element("span", festivals.length ? "calendar-date-note is-festival" : "calendar-date-note",
        festivals[0] || lunarShort);
      dateNote.setAttribute("aria-hidden", "true");
      button.append(dateNote);
      const signals = element("span", "calendar-signals");
      signals.setAttribute("aria-hidden", "true");
      if (mark?.liu) signals.append(element("b", "calendar-dot liu"));
      if (mark?.fu) signals.append(element("b", "calendar-dot fu"));
      if (mark?.event) signals.append(element("b", "calendar-star", "★"));
      button.append(signals);
      cells.append(button);
    }
    days.replaceChildren(cells);
    if (focusedDay) days.querySelector(`[data-day="${focusedDay}"]`)?.focus({ preventScroll: true });
  }

  function renderStatus() {
    q("calendarStatus").textContent = status;
    q("calendarRetry").hidden = !canRetry;
    q("calendarSignIn").hidden = Boolean(scope);
    const ready = Boolean(scope && snapshotDay === selected && snapshot);
    q("calendarAddNote").disabled = !ready;
    q("calendarAddEvent").disabled = !ready;
  }

  function renderDay() {
    q("calendarDayLabel").textContent = dayLabel.format(utcDate(selected));
    const { lunarFull, festivals: labels } = getDateDetails(selected);
    const lunar = q("calendarDayLunar");
    lunar.hidden = !lunarFull;
    lunar.textContent = lunarFull ? `农历 ${lunarFull}` : "";
    const festivals = q("calendarFestivals");
    festivals.hidden = !labels.length;
    festivals.replaceChildren(...labels.map((label) => element("span", "", label)));
    entries.replaceChildren();
    renderStatus();
    if (snapshotDay !== selected || !snapshot) return;
    const rows = snapshot.entries;
    const notes = rows.filter((row) => row.kind === "note").reverse();
    const events = rows.filter((row) => row.kind === "event").reverse();
    const replies = new Map();
    for (const row of rows.filter((row) => row.kind === "reply")) {
      if (!replies.has(row.parent_id)) replies.set(row.parent_id, []);
      replies.get(row.parent_id).push(row);
    }
    if (!rows.length) entries.append(element("p", "calendar-empty", "这一天还没有记录"));
    appendFolded(entries, "events", events, (row) => renderEntry(row));
    appendFolded(entries, "notes", notes, (row) => {
      const note = renderEntry(row);
      const children = replies.get(row.id) || [];
      if (children.length) {
        const thread = element("div", "calendar-thread");
        appendFolded(thread, row.id, children, (child) => renderEntry(child), true);
        note.append(thread);
      }
      return note;
    });
    window.lucide?.createIcons();
  }

  function appendFolded(container, key, rows, render, keepNewest = false) {
    const open = expanded.has(key);
    const shown = open ? rows : keepNewest ? rows.slice(-5) : rows.slice(0, 5);
    container.append(...shown.map(render));
    if (rows.length > 5) {
      container.append(action(open ? "收起" : `展开其余 ${rows.length - 5} 条`, (event) => {
        if (open) expanded.delete(key);
        else expanded.add(key);
        renderDay();
        entries.querySelectorAll("[data-fold]").forEach((button) => {
          if (button.dataset.fold === key) button.focus({ preventScroll: true });
        });
      }, "calendar-small calendar-fold"));
      container.lastElementChild.dataset.fold = key;
      container.lastElementChild.setAttribute("aria-expanded", String(open));
    }
  }

  function renderEntry(row) {
    const node = element("article", `calendar-entry calendar-${row.kind}`);
    node.dataset.entry = row.id;
    const header = element("header", "calendar-entry-meta");
    if (!row.deleted) {
      const author = element("strong", `calendar-author ${row.role}`, names[row.role]);
      header.append(author, element("time", "", timeLabel.format(new Date(row.created_at))));
      header.lastElementChild.dateTime = row.created_at;
    }
    if (row.kind === "event") header.append(element("span", "calendar-event-type", row.yearly ? "★ 每年重复" : "★ 重要日子"));
    if (row.mine && !row.deleted) {
      const controls = element("div", "calendar-entry-actions");
      controls.append(
        action("编辑", () => openEditor(row.kind, row), "calendar-icon", "pencil"),
        action("删除", () => deleteEntry(row), "calendar-icon", "trash-2")
      );
      header.append(controls);
    }
    if (header.childElementCount) node.append(header);
    node.append(element("p", row.deleted ? "calendar-removed" : "calendar-entry-body", row.deleted ? "原记录已删除" : row.body));
    if (row.kind === "note" && !row.deleted) {
      node.append(action("接一句", () => openEditor("reply", null, row.id)));
    }
    return node;
  }

  function selectDay(day) {
    if (day !== selected) expanded.clear();
    selected = day;
    status = snapshotDay === selected ? "" : "正在读取日历…";
    canRetry = false;
    renderMonth();
    renderDay();
    refresh();
  }

  function changeMonth(delta) {
    const date = utcDate(`${selected.slice(0, 7)}-01`);
    date.setUTCMonth(date.getUTCMonth() + delta);
    const month = date.toISOString().slice(0, 7);
    if (month < firstMonth || month > lastMonth) return;
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    selectDay(`${month}-${String(Math.min(last, Number(selected.slice(-2)))).padStart(2, "0")}`);
  }

  function checkScope() {
    const next = window.LoveSync?.getCalendarScope?.() || null;
    if (next === scope) return;
    scope = next;
    pending = null;
    snapshot = null;
    snapshotKey = "";
    snapshotDay = "";
    expanded.clear();
    if (dialog.open) dialog.close();
    draft = null;
    input.value = "";
    deleting.clear();
    saving = false;
    if (visible) {
      renderMonth();
      renderDay();
    } else {
      entries.replaceChildren();
      days.replaceChildren();
    }
  }

  async function refresh(invalidate = false) {
    checkScope();
    if (!visible) return;
    if (!scope) {
      status = "连接双人空间后可以共同记录";
      canRetry = false;
      renderStatus();
      return;
    }
    if (pending?.day === selected) {
      pending.again ||= invalidate;
      return;
    }
    const request = { day: selected, again: false };
    pending = request;
    if (snapshotDay !== selected) status = "正在读取日历…";
    renderStatus();
    try {
      const data = await window.LoveSync.readCalendarDay(request.day);
      if (pending !== request || !visible || request.again) return;
      if (!Array.isArray(data?.entries) || !Array.isArray(data?.marks)) throw new Error("暂时无法读取日历，请重试");
      const key = JSON.stringify(data);
      status = "";
      canRetry = false;
      if (snapshotDay !== selected || snapshotKey !== key) {
        snapshot = data;
        snapshotDay = selected;
        snapshotKey = key;
        renderMonth();
        renderDay();
      } else {
        renderStatus();
      }
    } catch (error) {
      if (pending !== request || !visible || request.again) return;
      status = error.message || "暂时无法读取日历，请重试";
      canRetry = true;
      renderStatus();
    } finally {
      if (pending === request) {
        pending = null;
        if (request.again) refresh();
      }
    }
  }

  function entryId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
  }

  function openEditor(kind, row = null, parent = null) {
    if (!scope || snapshotDay !== selected || saving) return;
    draft = {
      p_id: row?.id || entryId(), p_day: row?.day || selected, p_kind: kind,
      p_parent_id: row?.parent_id || parent, p_expected_version: row?.version ?? null
    };
    const isEvent = kind === "event";
    q("calendarDialogTitle").textContent = row ? "编辑记录" : { note: "写一条", event: "标记重要日子", reply: "接一句" }[kind];
    q("calendarDialogDate").textContent = dayLabel.format(utcDate(selected));
    q("calendarInputLabel").textContent = isEvent ? "日子名称" : "内容";
    q("calendarRepeatLabel").hidden = !isEvent;
    repeat.checked = Boolean(row?.yearly);
    input.value = row?.body || "";
    input.rows = isEvent ? 2 : 4;
    input.maxLength = isEvent ? 80 : 2000;
    input.setCustomValidity("");
    q("calendarFormStatus").textContent = "";
    setEditorBusy(false);
    dialog.showModal();
    input.focus();
  }

  function setEditorBusy(busy) {
    saving = busy;
    const locked = busy || Boolean(draft?.retry);
    input.readOnly = locked;
    repeat.disabled = locked;
    q("calendarCancel").disabled = busy;
    q("calendarSave").disabled = busy || Boolean(draft?.conflict);
    q("calendarSave").textContent = busy ? "正在保存…" : draft?.retry ? "重试保存" : "保存";
  }

  async function saveEntry(event) {
    event.preventDefault();
    if (!draft || saving) return;
    const body = input.value.trim();
    if (!body) {
      input.setCustomValidity("请先输入内容");
      input.reportValidity();
      return;
    }
    const editor = draft;
    const { retry, conflict, ...base } = editor;
    const payload = retry || { ...base, p_body: body, p_yearly: editor.p_kind === "event" && repeat.checked };
    setEditorBusy(true);
    q("calendarFormStatus").textContent = "";
    try {
      await window.LoveSync.saveCalendarEntry(payload);
      if (draft !== editor) return;
      dialog.close();
      draft = null;
      refresh(true);
    } catch (error) {
      if (draft !== editor) return;
      const rejected = ["CALENDAR_SETUP", "22023", "42501", "40001"].includes(error.code);
      editor.retry = rejected ? null : payload;
      editor.conflict = error.code === "40001";
      q("calendarFormStatus").textContent = error.message || "保存失败，请重试";
      if (editor.conflict) refresh(true);
    } finally {
      if (!draft || draft === editor) setEditorBusy(false);
    }
  }

  async function deleteEntry(row) {
    if (!row.mine || !scope || deleting.has(row.id) || !window.confirm("删除这条记录？")) return;
    const currentScope = scope;
    deleting.add(row.id);
    try {
      await window.LoveSync.deleteCalendarEntry(row.id, row.version);
      if (currentScope === scope) refresh(true);
    } catch (error) {
      if (currentScope !== scope) return;
      status = error.message || "删除失败，请重试";
      canRetry = true;
      renderStatus();
    } finally {
      if (scope === currentScope) deleting.delete(row.id);
    }
  }

  function onForeground() {
    if (!visible || document.hidden) return;
    const next = dateInChina();
    if (today !== next) {
      const onToday = selected === today;
      today = next;
      if (onToday) {
        selectDay(today);
        return;
      }
      renderMonth();
    }
    refresh();
  }

  window.addEventListener("love-calendar-view", ({ detail }) => {
    visible = detail;
    window.clearInterval(poll);
    if (!visible) {
      pending = null;
      return;
    }
    checkScope();
    today = dateInChina();
    selectDay(today);
    poll = window.setInterval(onForeground, 25000);
  });
  window.addEventListener("love-sync-status", () => { checkScope(); if (visible) refresh(); });
  window.addEventListener("love-calendar-session", checkScope);
  window.addEventListener("love-calendar-changed", () => { if (!document.hidden) refresh(true); });
  window.addEventListener("online", onForeground);
  document.addEventListener("visibilitychange", onForeground);
  q("calendarPrev").addEventListener("click", () => changeMonth(-1));
  q("calendarNext").addEventListener("click", () => changeMonth(1));
  q("calendarGoToday").addEventListener("click", () => { today = dateInChina(); selectDay(today); });
  q("calendarRetry").addEventListener("click", () => refresh(true));
  q("calendarAddNote").addEventListener("click", () => openEditor("note"));
  q("calendarAddEvent").addEventListener("click", () => openEditor("event"));
  q("calendarForm").addEventListener("submit", saveEntry);
  q("calendarCancel").addEventListener("click", () => dialog.close());
  dialog.addEventListener("cancel", (event) => { if (saving) event.preventDefault(); });
  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    draft = null;
    input.value = "";
  });
  input.addEventListener("input", () => input.setCustomValidity(""));
}());
