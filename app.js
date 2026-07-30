const storageKey = "love-tool-liu-fu-v2";
const people = {
  liu: { name: "刘向强", short: "向强", color: "rose" },
  fu: { name: "付嘉颖", short: "嘉颖", color: "fu" }
};
const moods = ["想你", "开心", "平静", "期待", "被治愈", "有安全感", "想撒娇", "想聊天", "需要抱抱", "想安静", "有点累", "有点烦", "委屈", "焦虑", "失落", "孤单", "吃醋了", "烦躁", "紧张", "心动", "感恩", "在努力", "需要鼓励", "想见你"];
const questions = [
  "你最害怕我误解你的哪一部分？", "你最近最不想承认的一种情绪是什么？", "什么事会让你觉得自己不够好？", "你最希望我怎么安慰你？",
  "当你沉默时，通常最希望我做什么？", "你觉得自己最难被看见的一面是什么？", "你最怕在关系里失去什么？", "你最需要被确认的一句话是什么？",
  "有没有一件小事，你一直想让我知道却没说？", "你最希望我改掉的一个相处习惯是什么？", "什么样的争吵方式最让你受伤？", "你觉得我们最容易误会彼此的地方是什么？",
  "你在哪个时刻最有被我偏爱的感觉？", "你希望我们以后怎样处理冷战？", "你最想和我建立的一条默契是什么？", "如果只能保留我们的一段回忆，你会选哪一段？",
  "你最希望我在别人面前怎样介绍你？", "你什么时候会觉得特别没有安全感？", "你最希望我主动问你的一个问题是什么？", "有没有一句我的话，你一直记得？",
  "你现在最想被理解的压力来自哪里？", "你害怕自己会变成什么样的大人？", "哪一种承诺对你最重要？", "你觉得爱和陪伴最大的区别是什么？",
  "你最希望我们五年后保留的习惯是什么？", "你会因为什么觉得被冷落？", "你愿意让我更靠近你的哪一个秘密？", "你最不擅长向我表达的需求是什么？",
  "你需要独处时，希望我怎样做才刚刚好？", "你最羡慕别人的哪一种关系状态？", "如果我们意见完全相反，你最希望我先做什么？", "你希望我怎样参与到你的低谷里？",
  "你最需要我为你守住的边界是什么？", "哪件关于未来的事最让你焦虑？", "你觉得自己在爱里最像小孩子的时候是什么样？", "你最喜欢我依赖你的哪一种方式？",
  "你想从我这里获得、却不太敢开口要的是什么？", "你最担心我会离开的理由是什么？", "你最希望我记住的一个脆弱瞬间是什么？", "你觉得我们最需要练习的一项能力是什么？",
  "什么事情会让你立刻想找我？", "你最想和我一起面对的一件难事是什么？", "你觉得被尊重具体是什么感觉？", "你希望我们的钱和生活怎样安排才安心？",
  "你在成长过程中最缺少的是什么？", "你最希望从原生家庭里带走什么，又放下什么？", "你希望我怎样对待你的家人和朋友？", "你觉得两个人需要保留多少各自的空间？",
  "你觉得我最不了解你的哪个优点？", "你最希望我们一起养成的健康习惯是什么？", "你觉得异地最难熬的时刻是什么？", "当我们见面时，你最想先做的事是什么？",
  "你最想让我替你分担的烦恼是什么？", "你会怎样判断自己是否真正快乐？", "你最希望收到什么样的惊喜？", "你最不能接受的玩笑是什么？",
  "有没有一件过去的事，现在想起来仍然会难过？", "你最担心别人怎样评价你？", "你觉得自己最需要被原谅的一件事是什么？", "你想让我更懂你的哪种疲惫？",
  "什么时候你会觉得爱变得很具体？", "你希望我们多久认真聊一次彼此的感受？", "你喜欢被夸奖，还是更喜欢被认真倾听？", "你最想和我一起完成的一件长期计划是什么？",
  "你希望我在你生病时怎样照顾你？", "什么样的拥抱会让你最安心？", "你觉得我们相爱后自己有什么变化？", "你最想回到我们相处的哪一天？",
  "如果今天只能对我说一句真心话，会是什么？", "你觉得我什么时候最可爱？", "你最希望我为你勇敢一次的事情是什么？", "你觉得信任被消耗时，怎样才能慢慢修复？",
  "你有没有过想逃开所有人的时候？那时希望我怎样陪你？", "你最想从我这里听到的一句肯定是什么？", "你觉得自己最值得被爱的地方是什么？", "我们之间哪件小事最让你感到踏实？",
  "你害怕失去自由吗？在关系里自由对你意味着什么？", "你最想和我共同守护的一个原则是什么？", "如果我们将来很忙，怎样才不会弄丢彼此？", "你现在最想谢谢自己的哪一点？",
  "你最希望我在纪念日记住什么，而不是只记住日期？", "你愿意和我分享的一件不体面的经历是什么？", "你觉得自己什么时候最有魅力？", "你最希望我理解你的哪个决定？",
  "你对家的想象里，最重要的画面是什么？", "你最希望我们学会怎样表达不满？", "什么会让你觉得我真的站在你这边？", "你最希望我保护你什么？",
  "当你对自己失望时，希望我怎样回应？", "你最喜欢我们聊天里的哪一种氛围？", "你最怕我忽略的一个细节是什么？", "你觉得我们在一起后最珍贵的改变是什么？",
  "你希望我们把哪一种仪式感坚持很多年？", "你最想让我陪你去的一个地方是哪里？", "你对未来最具体的一次期待是什么？", "你希望我们如何庆祝彼此的小进步？",
  "你最希望我理解你的身体和情绪的哪种变化？", "你最想向我坦白却一直犹豫的一件事是什么？", "你觉得自己真正放松时是什么样子？", "你最希望我怎样成为你的队友？",
  "你想让我们以后遇到矛盾时先说的暗号是什么？", "你最想一起克服的一种恐惧是什么？", "如果关系需要一次重新开始，你最想先改变什么？", "你最想和我交换体验的一天会怎么安排？"
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
let photoPreviewUrl = "";

const els = {
  daysTogether: q("#daysTogether"), editStartDate: q("#editStartDate"), settingsDialog: q("#settingsDialog"), startDateInput: q("#startDateInput"), saveStartDate: q("#saveStartDate"),
  presenceText: q("#presenceText"), openMood: q("#openMood"), moodDialog: q("#moodDialog"), moodDialogTitle: q("#moodDialogTitle"), moodPicker: q("#moodPicker"), moodNote: q("#moodNote"), saveMood: q("#saveMood"),
  tabs: qa(".tab"), screens: qa(".screen"), moodCards: q("#moodCards"), nextMeetingTitle: q("#nextMeetingTitle"), nextMeetingMeta: q("#nextMeetingMeta"), nextMeetingDays: q("#nextMeetingDays"),
  writerName: q("#writerName"), switchWriter: q("#switchWriter"), messageForm: q("#messageForm"), messageText: q("#messageText"), messageList: q("#messageList"), questionText: q("#questionText"), newQuestion: q("#newQuestion"),
  taskForm: q("#taskForm"), taskText: q("#taskText"), taskList: q("#taskList"), taskStats: q("#taskStats"),
  meetingForm: q("#meetingForm"), meetingTitle: q("#meetingTitle"), meetingDate: q("#meetingDate"), meetingPlace: q("#meetingPlace"), meetingNote: q("#meetingNote"), meetingList: q("#meetingList"),
  albumForm: q("#albumForm"), photoInput: q("#photoInput"), photoPreview: q("#photoPreview"), photoPreviewImage: q("#photoPreviewImage"), clearPhotoSelection: q("#clearPhotoSelection"), photoCaption: q("#photoCaption"), albumGrid: q("#albumGrid"),
  personOptions: qa(".person-option"), traitForm: q("#traitForm"), traitType: q("#traitType"), traitText: q("#traitText"), traitList: q("#traitList"), healthPanel: q("#healthPanel"), waterCount: q("#waterCount"), moveCount: q("#moveCount"), weightValue: q("#weightValue"), weightForm: q("#weightForm"), weightDate: q("#weightDate"), weightInput: q("#weightInput"), weightHistory: q("#weightHistory"), encourageLine: q("#encourageLine"), cycleForm: q("#cycleForm"), cycleStart: q("#cycleStart"), cycleEnd: q("#cycleEnd"), cycleLength: q("#cycleLength"), cycleNextDate: q("#cycleNextDate"), cycleDaysLeft: q("#cycleDaysLeft"), cycleHistory: q("#cycleHistory")
};

init();

function init() {
  bindNavigation();
  bindActions();
  bindSyncEvents();
  render();
  window.lucide?.createIcons();
  window.LoveSync?.initialize();
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
    if (window.LoveSync?.isConnected()) return;
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
    els.questionText.textContent = pickRandom(questions);
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
    clearPhotoPreview();
    persistAndRender();
  });
  els.photoInput.addEventListener("change", () => showPhotoPreview(els.photoInput.files[0]));
  els.clearPhotoSelection.addEventListener("click", () => {
    els.photoInput.value = "";
    clearPhotoPreview();
  });
  els.personOptions.forEach((button) => button.addEventListener("click", () => {
    if (window.LoveSync?.isConnected() && button.dataset.person !== window.LoveSync.getRole()) return;
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
    privateSpace().health.weights.unshift({ id: uid(), value, date: els.weightDate.value || todayString() });
    els.weightForm.reset();
    els.weightDate.value = todayString();
    persistAndRender();
  });
  els.cycleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const start = els.cycleStart.value;
    const end = els.cycleEnd.value;
    const length = Number(els.cycleLength.value);
    if (!start || (end && end < start) || !length || length < 20 || length > 45) return;
    const cycles = privateSpace().health.cycles;
    cycles.unshift({ id: uid(), start, end, length });
    els.cycleForm.reset();
    els.cycleLength.value = "28";
    persistAndRender();
  });
}

function bindSyncEvents() {
  window.addEventListener("love-sync-status", (event) => {
    const role = event.detail.role;
    if (!role) return;
    state.writer = role;
    state.privatePerson = role;
    saveLocalAndRender();
  });
  window.addEventListener("love-sync-remote", (event) => {
    const { shared, privateData, role, initializeEmptySpace } = event.detail;
    const next = {
      ...state,
      ...(shared || {}),
      writer: role || state.writer,
      privatePerson: role || state.privatePerson,
      private: { ...state.private }
    };
    if (privateData && role) next.private[role] = privateData;
    state = mergeDefaults(next);
    saveLocalAndRender();
    if (initializeEmptySpace) window.LoveSync?.scheduleSave(state);
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
  els.messageList.replaceChildren(...state.messages.map((item) => {
    const node = document.createElement("article");
    node.className = `message-item ${people[item.person].color}`;
    node.innerHTML = `<div class="message-meta"><span>${people[item.person].name}</span><time>${formatDate(parseDate(item.date))}</time><button class="delete-button" data-delete-message="${item.id}" type="button" aria-label="删除留言">×</button></div><p>${escapeHTML(item.text)}</p>`;
    return node;
  }));
  els.messageList.querySelectorAll("[data-delete-message]").forEach((button) => button.addEventListener("click", () => {
    state.messages = state.messages.filter((item) => item.id !== button.dataset.deleteMessage);
    persistAndRender();
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
    node.innerHTML = `<img src="${photo.src}" alt="共同相册照片"><button class="delete-button photo-delete" data-delete-photo="${photo.id}" type="button" aria-label="删除这张照片">×</button><div class="photo-copy"><p>${escapeHTML(photo.caption)}</p><small>${formatDate(parseDate(photo.date))} · ${people[photo.person].name}</small></div>`;
    return node;
  }));
  els.albumGrid.querySelectorAll("[data-delete-photo]").forEach((button) => button.addEventListener("click", () => {
    state.photos = state.photos.filter((item) => item.id !== button.dataset.deletePhoto);
    persistAndRender();
  }));
}

function renderPrivate() {
  const syncedRole = window.LoveSync?.getRole();
  const person = syncedRole || state.privatePerson;
  state.privatePerson = person;
  els.personOptions.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.person === person);
    button.disabled = Boolean(syncedRole && button.dataset.person !== person);
  });
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
  const weights = sortByDateDesc(health.weights || []);
  const latest = weights[0];
  els.waterCount.textContent = health.water;
  els.moveCount.textContent = health.movement;
  els.weightValue.textContent = latest ? latest.value : "--";
  els.encourageLine.textContent = encouragements[(health.water + health.movement + weights.length) % encouragements.length];
  els.weightDate.value = els.weightDate.value || todayString();
  renderWeights(weights, health);
  renderCycles(health.cycles || []);
  els.healthPanel.hidden = person !== "fu";
}

function renderCycles(cycles) {
  const orderedCycles = sortByDateDesc(cycles, "start");
  const latest = orderedCycles[0];
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
  els.cycleHistory.replaceChildren(...orderedCycles.map((item) => {
    const record = document.createElement("div");
    record.className = "cycle-record";
    const endControl = item.end
      ? `<small>结束：${formatDate(parseDate(item.end))} · 预计间隔 ${item.length} 天</small>`
      : `<div class="cycle-end-form"><input data-cycle-end type="date" min="${item.start}" aria-label="补录结束日期"><button class="record-save" data-save-cycle-end="${item.id}" type="button">保存</button></div>`;
    record.innerHTML = `<div class="cycle-copy"><b>开始：${formatDate(parseDate(item.start))}</b>${endControl}</div><button class="delete-button" data-delete-cycle="${item.id}" type="button" aria-label="删除本次月经记录">×</button>`;
    return record;
  }));
  els.cycleHistory.querySelectorAll("[data-delete-cycle]").forEach((button) => button.addEventListener("click", () => {
    const health = privateSpace().health;
    health.cycles = health.cycles.filter((item) => item.id !== button.dataset.deleteCycle);
    persistAndRender();
  }));
  els.cycleHistory.querySelectorAll("[data-save-cycle-end]").forEach((button) => button.addEventListener("click", () => {
    const input = button.closest(".cycle-record").querySelector("[data-cycle-end]");
    const end = input.value;
    const health = privateSpace().health;
    const record = health.cycles.find((item) => item.id === button.dataset.saveCycleEnd);
    if (!record || !end || end < record.start) return;
    record.end = end;
    persistAndRender();
  }));
}

function renderWeights(weights, health) {
  if (!weights.length) {
    renderEmpty(els.weightHistory, "还没有体重记录。");
    return;
  }
  els.weightHistory.replaceChildren(...weights.map((item) => {
    const record = document.createElement("div");
    record.className = "weight-record";
    record.innerHTML = `<span><b>${item.value} kg</b><small>${formatDate(parseDate(item.date))}</small></span><button class="delete-button" data-delete-weight="${item.id}" type="button" aria-label="删除本次体重记录">×</button>`;
    return record;
  }));
  els.weightHistory.querySelectorAll("[data-delete-weight]").forEach((button) => button.addEventListener("click", () => {
    health.weights = health.weights.filter((item) => item.id !== button.dataset.deleteWeight);
    persistAndRender();
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
function persistAndRender() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();
  window.LoveSync?.scheduleSave(state);
}
function saveLocalAndRender() { localStorage.setItem(storageKey, JSON.stringify(state)); render(); }
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
function pickRandom(items) { return items[Math.floor(Math.random() * items.length)] || ""; }
function sortByDateDesc(items, key = "date") { return [...items].sort((a, b) => (b[key] || "").localeCompare(a[key] || "")); }
function escapeHTML(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function showPhotoPreview(file) {
  clearPhotoPreview();
  if (!file) return;
  photoPreviewUrl = URL.createObjectURL(file);
  els.photoPreviewImage.src = photoPreviewUrl;
  els.photoPreview.hidden = false;
}
function clearPhotoPreview() {
  if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
  photoPreviewUrl = "";
  els.photoPreviewImage.removeAttribute("src");
  els.photoPreview.hidden = true;
}
function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSide = 720;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.onerror = () => reject(new Error("图片无法读取"));
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
