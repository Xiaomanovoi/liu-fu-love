const storageKey = "love-tool-liu-fu-v2";
const people = {
  liu: { name: "刘向强", short: "向强", color: "rose" },
  fu: { name: "付嘉颖", short: "嘉颖", color: "fu" }
};
const moods = ["想你", "开心", "需要抱抱", "在努力"];
const questions = [
  "今天最想和对方分享的一件小事是什么？",
  "最近哪一刻让你觉得被爱着？",
  "下次见面，你最想一起做什么？",
  "想谢谢对方的一件事是什么？"
];
const encouragements = [
  "慢慢来，今天照顾好自己就已经很好。",
  "健康是和身体做朋友，不是和它较劲。",
  "一杯水、一次散步，都是认真爱自己的证据。",
  "不必完美，稳定地对自己好一点就很棒。"
];

const defaults = {
  startDate: "2025-02-14",
  writer: "liu",
  privatePerson: "liu",
  moods: {
    liu: { feeling: "想你", note: "今天也在想你" },
    fu: { feeling: "开心", note: "把小日子过得亮亮的" }
  },
  messages: [
    { id: uid(), person: "fu", text: "初版升级啦。异地也要好好分享每天的小事。", date: todayString() },
    { id: uid(), person: "liu", text: "我们慢慢把这里装满，只属于我们的回忆。", date: todayString() }
  ],
  tasks: [
    { id: uid(), text: "本周一起看完一部电影", doneBy: [] },
    { id: uid(), text: "睡前分享今天的一件开心事", doneBy: ["liu"] }
  ],
  meetings: [
    { id: uid(), title: "下一次见面", date: "", place: "", note: "把想见面的日子先约下来。", planned: true }
  ],
  photos: [],
  private: {
    liu: { traits: [{ id: uid(), type: "优点", text: "她会认真记住我随口说过的小事" }], health: { water: 0, movement: 0, weights: [], cycles: [] } },
    fu: { traits: [{ id: uid(), type: "习惯", text: "他会在忙完后第一时间分享今天" }], health: { water: 0, movement: 0, weights: [], cycles: [] } }
  }
};

let state = loadState();
let selectedMood = state.moods[state.writer].feeling;

const els = {
  daysTogether: q("#daysTogether"), editStartDate: q("#editStartDate"), settingsDialog: q("#settingsDialog"), startDateInput: q("#startDateInput"), saveStartDate: q("#saveStartDate"),
  presenceText: q("#presenceText"), openMood: q("#openMood"), moodDialog: q("#moodDialog"), moodDialogTitle: q("#moodDialogTitle"), moodPicker: q("#moodPicker"), moodNote: q("#moodNote"), saveMood: q("#saveMood"),
  tabs: qa(".tab"), screens: qa(".screen"), moodCards: q("#moodCards"), nextMeetingTitle: q("#nextMeetingTitle"), nextMeetingMeta: q("#nextMeetingMeta"), nextMeetingDays: q("#nextMeetingDays"),
  writerName: q("#writerName"), switchWriter: q("#switchWriter"), messageForm: q("#messageForm"), messageText: q("#messageText"), messageList: q("#messageList"), questionText: q("#questionText"), newQuestion: q("#newQuestion"),
  taskForm: q("#taskForm"), taskText: q("#taskText"), taskList: q("#taskList"), taskStats: q("#taskStats"),
  meetingForm: q("#meetingForm"), meetingTitle: q("#meetingTitle"), meetingDate: q("#meetingDate"), meetingPlace: q("#meetingPlace"), meetingNote: q("#meetingNote"), meetingList: q("#meetingList"),
  albumForm: q("#albumForm"), photoInput: q("#photoInput"), photoCaption: q("#photoCaption"), albumGrid: q("#albumGrid"),
  personOptions: qa(".person-option"), traitForm: q("#traitForm"), traitType: q("#traitType"), traitText: q("#traitText"), traitList: q("#traitList"), healthPanel: q("#healthPanel"), waterCount: q("#waterCount"), moveCount: q("#moveCount"), weightValue: q("#weightValue"), weightForm: q("#weightForm"), weightInput: q("#weightInput"), encourageLine: q("#encourageLine"), cycleForm: q("#cycleForm"), cycleStart: q("#cycleStart"), cycleLength: q("#cycleLength"), cycleNextDate: q("#cycleNextDate"), cycleDaysLeft: q("#cycleDaysLeft"), cycleHistory: q("#cycleHistory")
};

init();

function init() {
  bindNavigation();
  bindActions();
  render();
}

function bindNavigation() {
  els.tabs.forEach((tab) => tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    els.tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    els.screens.forEach((screen) => screen.classList.toggle("is-active", screen.id === target));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
}

function bindActions() {
  els.editStartDate.addEventListener("click", () => {
    els.startDateInput.value = state.startDate;
    els.settingsDialog.showModal();
  });
  els.saveStartDate.addEventListener("click", () => {
    if (els.startDateInput.value) state.startDate = els.startDateInput.value;
    els.settingsDialog.close();
    persistAndRender();
  });
  els.openMood.addEventListener("click", openMoodDialog);
  els.saveMood.addEventListener("click", () => {
    const person = state.writer;
    state.moods[person] = { feeling: selectedMood, note: els.moodNote.value.trim() || "今天也在想你" };
    els.moodDialog.close();
    persistAndRender();
  });
  els.switchWriter.addEventListener("click", () => {
    state.writer = state.writer === "liu" ? "fu" : "liu";
    persistAndRender();
  });
  els.messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.messageText.value.trim();
    if (!text) return;
    state.messages.unshift({ id: uid(), person: state.writer, text, date: todayString() });
    els.messageForm.reset();
    persistAndRender();
  });
  els.newQuestion.addEventListener("click", () => {
    els.questionText.textContent = pickDifferent(questions, els.questionText.textContent);
  });
  els.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.taskText.value.trim();
    if (!text) return;
    state.tasks.unshift({ id: uid(), text, doneBy: [] });
    els.taskForm.reset();
    persistAndRender();
  });
  els.meetingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = els.meetingTitle.value.trim();
    const date = els.meetingDate.value;
    if (!title || !date) return;
    state.meetings.unshift({ id: uid(), title, date, place: els.meetingPlace.value.trim(), note: els.meetingNote.value.trim(), planned: date >= todayString() });
    els.meetingForm.reset();
    persistAndRender();
  });
  els.albumForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = els.photoInput.files[0];
    if (!file) return;
    const src = await shrinkImage(file);
    state.photos.unshift({ id: uid(), src, caption: els.photoCaption.value.trim() || "我们的一个瞬间", date: todayString(), person: state.writer });
    els.albumForm.reset();
    persistAndRender();
  });
  els.personOptions.forEach((button) => button.addEventListener("click", () => {
    state.privatePerson = button.dataset.person;
    persistAndRender();
  }));
  els.traitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.traitText.value.trim();
    if (!text) return;
    privateSpace().traits.unshift({ id: uid(), type: els.traitType.value, text });
    els.traitForm.reset();
    persistAndRender();
  });
  els.healthPanel.addEventListener("click", (event) => {
    const action = event.target.closest("[data-health-action]")?.dataset.healthAction;
    if (!action) return;
    const health = privateSpace().health;
    health[action === "water" ? "water" : "movement"] += 1;
    persistAndRender();
  });
  els.weightForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = Number(els.weightInput.value);
    if (!value || value < 20 || value > 300) return;
    privateSpace().health.weights.unshift({ id: uid(), value, date: todayString() });
    els.weightForm.reset();
    persistAndRender();
  });
  els.cycleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const start = els.cycleStart.value;
    const length = Number(els.cycleLength.value);
    if (!start || !length || length < 20 || length > 45) return;
    const cycles = privateSpace().health.cycles;
    cycles.unshift({ id: uid(), start, length });
    els.cycleForm.reset();
    els.cycleLength.value = "28";
    persistAndRender();
  });
}

function render() {
  renderDays();
  renderPresence();
  renderMoods();
  renderMeetingCountdown();
  renderMessages();
  renderTasks();
  renderMeetings();
  renderAlbum();
  renderPrivate();
}

function renderDays() {
  const start = parseDate(state.startDate);
  els.daysTogether.textContent = start ? Math.max(0, daysBetween(start, new Date()) + 1) : "0";
}

function renderPresence() {
  const liu = state.moods.liu;
  const fu = state.moods.fu;
  els.presenceText.textContent = `${people.liu.short}${liu.feeling}，${people.fu.short}${fu.feeling}`;
  els.writerName.textContent = people[state.writer].name;
}

function renderMoods() {
  els.moodCards.replaceChildren(...Object.keys(people).map((id) => {
    const mood = state.moods[id];
    const card = document.createElement("article");
    card.className = `mood-card ${people[id].color}`;
    card.innerHTML = `<p>${people[id].name}</p><h3>${escapeHTML(mood.feeling)}</h3><small>${escapeHTML(mood.note || "今天也在想你")}</small>`;
    return card;
  }));
}

function renderMeetingCountdown() {
  const upcoming = state.meetings.filter((item) => item.date && item.date >= todayString()).sort((a, b) => a.date.localeCompare(b.date))[0];
  if (!upcoming) {
    els.nextMeetingTitle.textContent = "还没有约定";
    els.nextMeetingMeta.textContent = "先把下一次想见面的日子写下来。";
    els.nextMeetingDays.textContent = "--";
    return;
  }
  const days = daysBetween(new Date(), parseDate(upcoming.date));
  els.nextMeetingTitle.textContent = upcoming.title;
  els.nextMeetingMeta.textContent = `${upcoming.place || "见面地点待定"} · ${formatDate(parseDate(upcoming.date))}`;
  els.nextMeetingDays.textContent = days === 0 ? "今" : days;
}

function renderMessages() {
  if (!state.messages.length) return renderEmpty(els.messageList, "第一条留言，留给此刻最想说的话。");
  els.messageList.replaceChildren(...state.messages.slice(0, 6).map((item) => {
    const node = document.createElement("article");
    node.className = `message-item ${people[item.person].color}`;
    node.innerHTML = `<div class="message-meta"><span>${people[item.person].name}</span><time>${formatDate(parseDate(item.date))}</time></div><p>${escapeHTML(item.text)}</p>`;
    return node;
  }));
}

function renderTasks() {
  const done = state.tasks.filter((task) => task.doneBy.length === 2).length;
  els.taskStats.textContent = `${done}/${state.tasks.length}`;
  if (!state.tasks.length) return renderEmpty(els.taskList, "写下一件想一起完成的小事。");
  els.taskList.replaceChildren(...state.tasks.map((task) => {
    const node = document.createElement("article");
    node.className = "task-item";
    const buttons = Object.keys(people).map((person) => `<button class="task-person ${task.doneBy.includes(person) ? "done" : ""}" data-task-id="${task.id}" data-person="${person}" type="button">${people[person].short}${task.doneBy.includes(person) ? " 已打卡" : " 打卡"}</button>`).join("");
    node.innerHTML = `<div><strong>${escapeHTML(task.text)}</strong><div class="task-progress">${buttons}</div></div><button class="delete-button" data-delete-task="${task.id}" type="button" aria-label="删除任务">×</button>`;
    return node;
  }));
  els.taskList.querySelectorAll("[data-task-id]").forEach((button) => button.addEventListener("click", () => {
    const task = state.tasks.find((item) => item.id === button.dataset.taskId);
    const person = button.dataset.person;
    task.doneBy = task.doneBy.includes(person) ? task.doneBy.filter((id) => id !== person) : [...task.doneBy, person];
    persistAndRender();
  }));
  els.taskList.querySelectorAll("[data-delete-task]").forEach((button) => button.addEventListener("click", () => {
    state.tasks = state.tasks.filter((item) => item.id !== button.dataset.deleteTask);
    persistAndRender();
  }));
}

function renderMeetings() {
  if (!state.meetings.length) return renderEmpty(els.meetingList, "第一次见面，值得从这里开始收藏。");
  const meetings = [...state.meetings].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  els.meetingList.replaceChildren(...meetings.map((item) => {
    const node = document.createElement("article");
    node.className = "meeting-card";
    node.innerHTML = `<h3>${escapeHTML(item.title)}</h3><time>${item.date ? formatDate(parseDate(item.date)) : "等待约定"}${item.place ? ` · ${escapeHTML(item.place)}` : ""}</time>${item.note ? `<p>${escapeHTML(item.note)}</p>` : ""}`;
    return node;
  }));
}

function renderAlbum() {
  if (!state.photos.length) return renderEmpty(els.albumGrid, "第一张合照，留给你们最喜欢的那个瞬间。");
  els.albumGrid.replaceChildren(...state.photos.map((photo) => {
    const node = document.createElement("article");
    node.className = "photo-card";
    node.innerHTML = `<img src="${photo.src}" alt="共同相册照片"><div class="photo-copy"><p>${escapeHTML(photo.caption)}</p><small>${formatDate(parseDate(photo.date))} · ${people[photo.person].name}</small></div>`;
    return node;
  }));
}

function renderPrivate() {
  const person = state.privatePerson;
  els.personOptions.forEach((button) => button.classList.toggle("is-active", button.dataset.person === person));
  const space = privateSpace();
  if (!space.traits.length) {
    renderEmpty(els.traitList, "把你发现的一个小优点记下来。");
  } else {
    els.traitList.replaceChildren(...space.traits.map((item) => {
      const node = document.createElement("article");
      node.className = "trait-item";
      node.innerHTML = `<p><span class="trait-tag">${escapeHTML(item.type)}</span>${escapeHTML(item.text)}</p><button class="delete-button" data-delete-trait="${item.id}" type="button" aria-label="删除记录">×</button>`;
      return node;
    }));
    els.traitList.querySelectorAll("[data-delete-trait]").forEach((button) => button.addEventListener("click", () => {
      space.traits = space.traits.filter((item) => item.id !== button.dataset.deleteTrait);
      persistAndRender();
    }));
  }
  const health = space.health;
  const latest = health.weights[0];
  els.waterCount.textContent = health.water;
  els.moveCount.textContent = health.movement;
  els.weightValue.textContent = latest ? latest.value : "--";
  els.encourageLine.textContent = encouragements[(health.water + health.movement + health.weights.length) % encouragements.length];
  renderCycles(health.cycles || []);
  els.healthPanel.hidden = person !== "fu";
}

function renderCycles(cycles) {
  const latest = cycles[0];
  if (!latest) {
    els.cycleNextDate.textContent = "待记录";
    els.cycleDaysLeft.textContent = "--";
    renderEmpty(els.cycleHistory, "记录开始日期后，会在这里显示下一次预计时间。");
    return;
  }
  const next = new Date(parseDate(latest.start));
  next.setDate(next.getDate() + latest.length);
  const days = daysBetween(new Date(), next);
  els.cycleNextDate.textContent = formatDate(next);
  els.cycleDaysLeft.textContent = days >= 0 ? days : "已过";
  els.cycleHistory.replaceChildren(...cycles.slice(0, 4).map((item) => {
    const record = document.createElement("div");
    record.className = "cycle-record";
    record.innerHTML = `<span>开始于 ${formatDate(parseDate(item.start))}</span><strong>${item.length} 天周期</strong>`;
    return record;
  }));
}

function openMoodDialog() {
  const person = state.writer;
  const current = state.moods[person];
  selectedMood = current.feeling;
  els.moodDialogTitle.textContent = `${people[person].name}想说`;
  els.moodNote.value = current.note || "";
  els.moodPicker.replaceChildren(...moods.map((mood) => {
    const button = document.createElement("button");
    button.className = `mood-option${mood === selectedMood ? " is-selected" : ""}`;
    button.type = "button";
    button.textContent = mood;
    button.addEventListener("click", () => {
      selectedMood = mood;
      els.moodPicker.querySelectorAll("button").forEach((item) => item.classList.toggle("is-selected", item.textContent === mood));
    });
    return button;
  }));
  els.moodDialog.showModal();
}

function privateSpace() { return state.private[state.privatePerson]; }
function persistAndRender() { localStorage.setItem(storageKey, JSON.stringify(state)); render(); }
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved) return mergeDefaults(saved);
  } catch { /* Start fresh when stored data is invalid. */ }
  return structuredClone(defaults);
}
function mergeDefaults(saved) {
  return {
    ...structuredClone(defaults), ...saved,
    moods: { ...structuredClone(defaults).moods, ...(saved.moods || {}) },
    private: {
      liu: mergePrivateSpace(saved.private?.liu, "liu"),
      fu: mergePrivateSpace(saved.private?.fu, "fu")
    }
  };
}
function mergePrivateSpace(savedSpace, person) {
  const base = structuredClone(defaults).private[person];
  return { ...base, ...(savedSpace || {}), health: { ...base.health, ...(savedSpace?.health || {}) } };
}
function renderEmpty(root, text) { root.innerHTML = `<p class="empty">${text}</p>`; }
function q(selector) { return document.querySelector(selector); }
function qa(selector) { return [...document.querySelectorAll(selector)]; }
function parseDate(value) { if (!value) return null; const [year, month, date] = value.split("-").map(Number); return new Date(year, month - 1, date); }
function startOfDay(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }
function formatDate(date) { return date ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日` : ""; }
function todayString() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; }
function uid() { return window.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function pickDifferent(items, current) { const options = items.filter((item) => item !== current); return options[Math.floor(Math.random() * options.length)] || items[0]; }
function escapeHTML(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSide = 1200;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = () => reject(new Error("图片无法读取"));
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
