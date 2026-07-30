const storageKey = "love-tool-liu-fu-v1";

const defaults = {
  startDate: "2025-02-14",
  mood: "想你",
  events: [
    { id: uid(), title: "恋爱纪念日", date: "2025-02-14" },
    { id: uid(), title: "嘉颖生日", date: "" }
  ],
  wishes: [
    { id: uid(), text: "一起拍一组好看的日常照片", done: false },
    { id: uid(), text: "去一家只属于我们的宝藏小店", done: false },
    { id: uid(), text: "完成一次说走就走的小旅行", done: true }
  ],
  notes: [
    {
      id: uid(),
      text: "初版上线啦。以后这里可以慢慢装下我们的碎碎念。",
      date: todayString()
    }
  ],
  memories: [
    {
      id: uid(),
      title: "我们的第一页",
      date: todayString(),
      text: "从这里开始，把平凡的一天也认真收藏。"
    }
  ]
};

const lines = [
  "喜欢是藏不住的，就像手机总会想打开这个页面。",
  "今天也要偏爱彼此一点点。",
  "世界很大，但这个小页面只为我们亮着。",
  "把想念记下来，它就有了回家的地方。",
  "慢慢来，我们还有很多很多天。"
];

const dateIdeas = [
  "夜晚散步，顺路买一杯热饮。",
  "去便利店互相挑一个没吃过的小零食。",
  "找一家安静的店，给对方写十分钟小纸条。",
  "一起拍九张今天的生活照片。",
  "点一首歌，然后认真听完再抱一下。",
  "选一部老电影，准备一点水果和毯子。",
  "去公园坐一会儿，只聊开心的事。"
];

const moods = ["开心", "想你", "累了", "贴贴"];
let state = loadState();

const els = {
  daysTogether: document.querySelector("#daysTogether"),
  editStartDate: document.querySelector("#editStartDate"),
  settingsDialog: document.querySelector("#settingsDialog"),
  startDateInput: document.querySelector("#startDateInput"),
  saveStartDate: document.querySelector("#saveStartDate"),
  tabs: document.querySelectorAll(".tab"),
  screens: document.querySelectorAll(".screen"),
  moodRow: document.querySelector("#moodRow"),
  dailyLine: document.querySelector("#dailyLine"),
  newLine: document.querySelector("#newLine"),
  dateIdea: document.querySelector("#dateIdea"),
  rollDate: document.querySelector("#rollDate"),
  nextEventTitle: document.querySelector("#nextEventTitle"),
  nextEventMeta: document.querySelector("#nextEventMeta"),
  eventForm: document.querySelector("#eventForm"),
  eventTitle: document.querySelector("#eventTitle"),
  eventDate: document.querySelector("#eventDate"),
  eventList: document.querySelector("#eventList"),
  wishForm: document.querySelector("#wishForm"),
  wishText: document.querySelector("#wishText"),
  wishList: document.querySelector("#wishList"),
  wishStats: document.querySelector("#wishStats"),
  noteForm: document.querySelector("#noteForm"),
  noteText: document.querySelector("#noteText"),
  noteList: document.querySelector("#noteList"),
  memoryForm: document.querySelector("#memoryForm"),
  memoryTitle: document.querySelector("#memoryTitle"),
  memoryDate: document.querySelector("#memoryDate"),
  memoryText: document.querySelector("#memoryText"),
  memoryList: document.querySelector("#memoryList")
};

init();

function init() {
  render();
  bindTabs();
  bindForms();
  bindActions();
}

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return cloneDefaults();
  }

  try {
    return { ...cloneDefaults(), ...JSON.parse(raw) };
  } catch {
    return cloneDefaults();
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function bindTabs() {
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      els.tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      els.screens.forEach((screen) => {
        screen.classList.toggle("is-active", screen.id === target);
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function bindForms() {
  els.eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = els.eventTitle.value.trim();
    const date = els.eventDate.value;
    if (!title || !date) return;
    state.events.push({ id: uid(), title, date });
    els.eventForm.reset();
    persistAndRender();
  });

  els.wishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.wishText.value.trim();
    if (!text) return;
    state.wishes.unshift({ id: uid(), text, done: false });
    els.wishForm.reset();
    persistAndRender();
  });

  els.noteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.noteText.value.trim();
    if (!text) return;
    state.notes.unshift({ id: uid(), text, date: todayString() });
    els.noteForm.reset();
    persistAndRender();
  });

  els.memoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = els.memoryTitle.value.trim();
    const date = els.memoryDate.value || todayString();
    const text = els.memoryText.value.trim();
    if (!title || !text) return;
    state.memories.unshift({ id: uid(), title, date, text });
    els.memoryForm.reset();
    persistAndRender();
  });
}

function bindActions() {
  els.editStartDate.addEventListener("click", () => {
    els.startDateInput.value = state.startDate || todayString();
    els.settingsDialog.showModal();
  });

  els.saveStartDate.addEventListener("click", () => {
    if (els.startDateInput.value) {
      state.startDate = els.startDateInput.value;
      persistAndRender();
    }
    els.settingsDialog.close();
  });

  els.newLine.addEventListener("click", () => {
    els.dailyLine.textContent = pickDifferent(lines, els.dailyLine.textContent);
  });

  els.rollDate.addEventListener("click", () => {
    els.dateIdea.textContent = pickDifferent(dateIdeas, els.dateIdea.textContent);
  });
}

function render() {
  renderDays();
  renderNextEvent();
  renderMoods();
  renderEvents();
  renderWishes();
  renderNotes();
  renderMemories();
}

function persistAndRender() {
  saveState();
  render();
}

function renderDays() {
  const start = parseDate(state.startDate);
  if (!start) {
    els.daysTogether.textContent = "0";
    return;
  }
  els.daysTogether.textContent = Math.max(0, daysBetween(start, new Date()) + 1).toString();
}

function renderNextEvent() {
  const candidates = state.events
    .filter((event) => event.date)
    .map((event) => {
      const next = nextOccurrence(event.date);
      return { ...event, next, days: daysBetween(startOfDay(new Date()), next) };
    })
    .sort((a, b) => a.days - b.days);

  if (!candidates.length) {
    els.nextEventTitle.textContent = "等待设置";
    els.nextEventMeta.textContent = "添加一个日期，让我帮你倒计时。";
    return;
  }

  const next = candidates[0];
  els.nextEventTitle.textContent = next.title;
  els.nextEventMeta.textContent = next.days === 0
    ? "就是今天，好好庆祝一下。"
    : `还有 ${next.days} 天，日期是 ${formatDate(next.next)}。`;
}

function renderMoods() {
  els.moodRow.replaceChildren(...moods.map((mood) => {
    const button = document.createElement("button");
    button.className = `mood-chip${state.mood === mood ? " is-active" : ""}`;
    button.type = "button";
    button.textContent = mood;
    button.addEventListener("click", () => {
      state.mood = mood;
      persistAndRender();
    });
    return button;
  }));
}

function renderEvents() {
  const events = [...state.events].sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
  renderList(els.eventList, events, {
    empty: "还没有纪念日，先添加一个你们的重要日期。",
    title: (item) => item.title,
    meta: (item) => item.date ? formatDate(parseDate(item.date)) : "待补充日期",
    onDelete: (id) => {
      state.events = state.events.filter((item) => item.id !== id);
      persistAndRender();
    }
  });
}

function renderWishes() {
  const done = state.wishes.filter((wish) => wish.done).length;
  els.wishStats.textContent = `${done}/${state.wishes.length}`;
  renderList(els.wishList, state.wishes, {
    empty: "还没有愿望。写下第一件想一起完成的小事吧。",
    title: (item) => item.text,
    meta: (item) => item.done ? "已经一起完成" : "等待一起实现",
    isDone: (item) => item.done,
    onToggle: (id) => {
      state.wishes = state.wishes.map((item) => (
        item.id === id ? { ...item, done: !item.done } : item
      ));
      persistAndRender();
    },
    onDelete: (id) => {
      state.wishes = state.wishes.filter((item) => item.id !== id);
      persistAndRender();
    }
  });
}

function renderNotes() {
  if (!state.notes.length) {
    els.noteList.innerHTML = `<li class="empty">还没有留言。第一句可以简单一点，真实就很好。</li>`;
    return;
  }

  els.noteList.replaceChildren(...state.notes.map((note) => {
    const li = document.createElement("li");
    li.className = "note-card";
    li.innerHTML = `
      <time class="note-date">${escapeHTML(formatDate(parseDate(note.date)))}</time>
      <p>${escapeHTML(note.text)}</p>
    `;
    return li;
  }));
}

function renderMemories() {
  if (!state.memories.length) {
    els.memoryList.innerHTML = `<div class="empty">回忆时间线还空着，适合从最近一次开心开始。</div>`;
    return;
  }

  const memories = [...state.memories].sort((a, b) => b.date.localeCompare(a.date));
  els.memoryList.replaceChildren(...memories.map((memory) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <article class="timeline-card">
        <time class="note-date">${escapeHTML(formatDate(parseDate(memory.date)))}</time>
        <h3>${escapeHTML(memory.title)}</h3>
        <p>${escapeHTML(memory.text)}</p>
      </article>
    `;
    return item;
  }));
}

function renderList(root, items, options) {
  if (!items.length) {
    root.innerHTML = `<li class="empty">${options.empty}</li>`;
    return;
  }

  root.replaceChildren(...items.map((item) => {
    const li = document.createElement("li");
    li.className = `list-item${options.isDone?.(item) ? " done" : ""}`;

    const check = document.createElement("button");
    check.className = `check-button${options.isDone?.(item) ? " is-active" : ""}`;
    check.type = "button";
    check.textContent = options.onToggle ? "✓" : "•";
    check.disabled = !options.onToggle;
    check.addEventListener("click", () => options.onToggle?.(item.id));

    const body = document.createElement("div");
    body.innerHTML = `
      <div class="item-title">${escapeHTML(options.title(item))}</div>
      <p class="item-meta">${escapeHTML(options.meta(item))}</p>
    `;

    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "删除");
    remove.addEventListener("click", () => options.onDelete(item.id));

    li.append(check, body, remove);
    return li;
  }));
}

function parseDate(value) {
  if (!value) return null;
  const [year, month, date] = value.split("-").map(Number);
  if (!year || !month || !date) return null;
  return new Date(year, month - 1, date);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(a, b) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(b) - startOfDay(a)) / oneDay);
}

function nextOccurrence(value) {
  const source = parseDate(value);
  const today = startOfDay(new Date());
  let next = new Date(today.getFullYear(), source.getMonth(), source.getDate());
  if (next < today) {
    next = new Date(today.getFullYear() + 1, source.getMonth(), source.getDate());
  }
  return next;
}

function formatDate(date) {
  if (!date) return "";
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function uid() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneDefaults() {
  if (window.structuredClone) {
    return window.structuredClone(defaults);
  }
  return JSON.parse(JSON.stringify(defaults));
}

function pickDifferent(items, current) {
  const pool = items.filter((item) => item !== current);
  return pool[Math.floor(Math.random() * pool.length)] || items[0];
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
