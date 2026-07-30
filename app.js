const storageKey = "love-tool-liu-fu-v2";
const people = {
  liu: { name: "刘向强", short: "向强", color: "rose" },
  fu: { name: "付嘉颖", short: "嘉颖", color: "fu" }
};
const moods = ["想你", "开心", "平静", "期待", "被治愈", "有安全感", "想撒娇", "想聊天", "需要抱抱", "想安静", "有点累", "有点烦", "委屈", "焦虑", "失落", "孤单", "吃醋了", "烦躁", "紧张", "心动", "感恩", "在努力", "需要鼓励", "想见你"];
const deepQuestions = [
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
const questionBank = {
  daily: [
    "今天发生了哪件最想第一时间告诉对方的小事？", "今天哪一刻最想念对方？", "最近有什么新鲜事让你眼前一亮？", "今天给自己的状态打几分，为什么？", "最近最想吃的一样东西是什么？",
    "今天有没有一句话让你印象很深？", "最近循环播放最多的一首歌是什么？", "今天最值得表扬自己的一件事是什么？", "最近有什么小烦恼想让对方听听？", "如果现在能一起吃夜宵，你会点什么？",
    "今天见到的最好看的景色是什么？", "最近有什么东西很想买但还在犹豫？", "明天最重要的一件事是什么？", "最近睡得好吗，最想怎样改善？", "今天有没有被陌生人的善意温暖到？",
    "你最近最喜欢哪一种天气？", "今天最想给对方一个怎样的拥抱？", "最近学会了什么小技能？", "周末最想怎么放松？", "此刻你身边有什么值得分享的小细节？"
  ],
  romance: [
    "你是什么时候确定自己真的喜欢上我的？", "我做过的哪件小事最让你心动？", "你最喜欢我怎样叫你？", "我们哪一张合照最像爱情的样子？", "你最喜欢我们哪一种相处状态？",
    "你最想和我重复一百次的约会是什么？", "如果为我们的爱情选一种味道，会是什么？", "你最喜欢我身上的哪个反差？", "什么时刻会让你觉得被我坚定选择？", "你最想收到我怎样的一封情书？",
    "如果明天突然见面，你最先想做什么？", "你觉得我们最般配的地方是什么？", "哪一句来自我的话曾让你偷偷开心很久？", "你最想和我拥有怎样的普通一天？", "如果把我们的故事写成书，书名叫什么？",
    "你最喜欢我认真做什么事情时的样子？", "你最珍惜我们之间哪个只有彼此懂的暗号？", "什么样的仪式感最能让你感受到爱？", "你希望多年后的我们还保留哪种幼稚？", "此刻最想对我说的一句情话是什么？"
  ],
  memory: [
    "第一次聊天时，你对我的第一印象是什么？", "第一次见面前你最紧张什么？", "我们哪一次告别最舍不得？", "你最常想起的共同瞬间是什么？", "哪次见面中有一个细节我可能已经忘了？",
    "我们一起吃过最好吃的一顿是什么？", "你第一次因为我吃醋是什么时候？", "我们经历过哪件事之后变得更亲近？", "哪一次争执让你后来更理解我？", "你收藏过哪些和我有关的小东西？",
    "哪条聊天记录你最舍不得删除？", "我们最搞笑的一次经历是什么？", "第一次牵手时你在想什么？", "你最怀念哪一次长时间通话？", "过去的我做过什么让现在的你依然感动？",
    "如果回到刚认识那天，你想提醒自己什么？", "哪次惊喜最出乎你的意料？", "你最喜欢我们去过的哪个地方？", "哪一段异地时光最考验我们？", "有什么回忆一想起来就会让你笑？"
  ],
  future: [
    "下一次见面最想安排哪三件事？", "最想一起旅行的三个地方是哪里？", "你希望我们一年后处于怎样的生活状态？", "未来的家里一定要有的东西是什么？", "你理想中的周末生活是什么样？",
    "我们最值得一起存钱完成的目标是什么？", "如果一起养成一个习惯，你会选什么？", "你希望我们多久安排一次只属于彼此的约会？", "你最期待和我一起庆祝哪个人生节点？", "未来遇到工作变动时，希望我们怎样商量？",
    "如果住在同一个城市，第一件想改变的事是什么？", "你想和我一起学会什么新技能？", "五年后的普通工作日会是什么样？", "你希望未来怎样分配家务？", "我们老了以后最适合在哪里散步？",
    "你想建立怎样的共同储蓄计划？", "未来最想和我一起完成的挑战是什么？", "你希望我们的纪念日怎样度过？", "如果能提前看到未来一天，你想看哪一天？", "今年结束前最想和我实现什么？"
  ],
  deep: deepQuestions,
  private: [
    "你在亲密关系里最害羞表达的需求是什么？", "你最希望我主动理解你的哪一种敏感？", "什么行为会让你觉得自己的边界被尊重？", "你有没有担心说出来会被评价的幻想或期待？", "你更喜欢被耐心询问，还是被温柔地带领？",
    "你希望亲密之后得到怎样的陪伴和回应？", "哪一种拒绝方式会让你依然感到安全？", "你最在意亲密相处中的哪种氛围？", "有什么身体上的不自信希望被温柔接纳？", "你希望我们用什么暗号表达暂停或不舒服？",
    "你最喜欢的身体接触是什么，最不喜欢的又是什么？", "在亲密话题上，你最希望我们保持哪条原则？", "什么样的夸奖会让你既害羞又开心？", "你希望我在你没有安全感时怎样确认爱意？", "有没有只想告诉伴侣、没有告诉过别人的一面？",
    "你觉得信任达到什么程度才愿意分享更深的秘密？", "你希望怎样谈论彼此的过去才不会受伤？", "什么情形下你最需要私人空间？", "你愿意让我知道的一个脆弱瞬间是什么？", "你最希望我认真倾听却一直没有聊过的话题是什么？"
  ],
  flirty: [
    "哪一种约会穿搭最容易让你心动？", "如果今晚能见面，你想把灯光和音乐布置成什么样？", "你最喜欢被我怎样靠近？", "哪一种眼神最容易让你害羞？", "你更喜欢直接的情话，还是若有若无的暗示？",
    "你觉得我们之间最有暧昧感的瞬间是哪一次？", "如果安排一场只属于两个人的夜晚，你会从什么开始？", "你最喜欢我身上的哪一种气味？", "什么样的拥抱会让你舍不得松手？", "你最想听我贴近你说什么？",
    "你喜欢惊喜式的亲近，还是提前商量好的浪漫？", "哪一种亲吻最能表达想念？", "如果用三个词形容我们之间的吸引力，会是哪三个？", "你希望下次见面时我主动做的一件浪漫小事是什么？", "你更喜欢慢慢升温，还是直白表达心动？",
    "有什么只适合我们两个人玩的约会小游戏？", "你最喜欢我什么时候表现出占有欲，但仍尊重你？", "哪一首歌最适合做我们独处时的背景音乐？", "你愿意和我交换一个从没说出口的心动幻想吗？", "下一次见面，你想给我一个怎样的惊喜？"
  ]
};
const questionCategoryNames = { daily: "日常", romance: "浪漫", memory: "回忆", future: "未来", deep: "深入", private: "私密", flirty: "情趣" };
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
  dailyQuestion: {
    id: uid(), category: "daily", text: questionBank.daily[0], date: todayString(), answers: { liu: "", fu: "" }
  },
  loveNotes: [],
  studyLogs: [],
  meetings: [
    { id: uid(), title: "下一次见面", date: "", place: "", note: "把想见面的日子先约下来。", planned: true }
  ],
  photos: [],
  private: {
    liu: { traits: [{ id: uid(), type: "优点", text: "她会认真记住我随口说过的小事" }], diaries: [], health: { water: 0, movement: 0, weights: [], cycles: [] } },
    fu: { traits: [{ id: uid(), type: "习惯", text: "他会在忙完后第一时间分享今天" }], diaries: [], health: { water: 0, movement: 0, weights: [], cycles: [] } }
  }
};

let state = loadState();
let selectedMood = state.moods[state.writer].feeling;
let photoPreviewUrl = "";
let pairingRedirected = false;

const els = {
  daysTogether: q("#daysTogether"), editStartDate: q("#editStartDate"), settingsDialog: q("#settingsDialog"), startDateInput: q("#startDateInput"), saveStartDate: q("#saveStartDate"),
  presenceText: q("#presenceText"), openMood: q("#openMood"), moodDialog: q("#moodDialog"), moodDialogTitle: q("#moodDialogTitle"), moodPicker: q("#moodPicker"), moodNote: q("#moodNote"), saveMood: q("#saveMood"), pairingNotice: q("#pairingNotice"), openPairing: q("#openPairing"),
  tabs: qa(".tab"), screens: qa(".screen"), moodCards: q("#moodCards"), nextMeetingTitle: q("#nextMeetingTitle"), nextMeetingMeta: q("#nextMeetingMeta"), nextMeetingDays: q("#nextMeetingDays"),
  writerName: q("#writerName"), switchWriter: q("#switchWriter"), messageForm: q("#messageForm"), messageText: q("#messageText"), messageList: q("#messageList"), questionText: q("#questionText"), questionCategory: q("#questionCategory"), questionCategorySelect: q("#questionCategorySelect"), newQuestion: q("#newQuestion"), questionAnswerForm: q("#questionAnswerForm"), questionAnswer: q("#questionAnswer"), questionWriterName: q("#questionWriterName"), questionAnswers: q("#questionAnswers"),
  taskForm: q("#taskForm"), taskText: q("#taskText"), taskList: q("#taskList"), taskStats: q("#taskStats"),
  noteForm: q("#noteForm"), noteReceiver: q("#noteReceiver"), noteUnlockDate: q("#noteUnlockDate"), noteText: q("#noteText"), noteList: q("#noteList"), noteStats: q("#noteStats"),
  studyForm: q("#studyForm"), studyContent: q("#studyContent"), studyDate: q("#studyDate"), studyMinutes: q("#studyMinutes"), studyNote: q("#studyNote"), studyList: q("#studyList"), studyStats: q("#studyStats"),
  meetingForm: q("#meetingForm"), meetingTitle: q("#meetingTitle"), meetingDate: q("#meetingDate"), meetingPlace: q("#meetingPlace"), meetingNote: q("#meetingNote"), meetingList: q("#meetingList"),
  albumForm: q("#albumForm"), photoInput: q("#photoInput"), photoPreview: q("#photoPreview"), photoPreviewImage: q("#photoPreviewImage"), clearPhotoSelection: q("#clearPhotoSelection"), photoCaption: q("#photoCaption"), albumGrid: q("#albumGrid"),
  personOptions: qa(".person-option"), traitForm: q("#traitForm"), traitType: q("#traitType"), traitText: q("#traitText"), traitList: q("#traitList"), diaryForm: q("#diaryForm"), diaryEditId: q("#diaryEditId"), diaryDate: q("#diaryDate"), diaryMood: q("#diaryMood"), diaryTitle: q("#diaryTitle"), diaryText: q("#diaryText"), diaryList: q("#diaryList"), saveDiary: q("#saveDiary"), cancelDiaryEdit: q("#cancelDiaryEdit"), healthPanel: q("#healthPanel"), waterCount: q("#waterCount"), moveCount: q("#moveCount"), weightValue: q("#weightValue"), weightForm: q("#weightForm"), weightDate: q("#weightDate"), weightInput: q("#weightInput"), weightHistory: q("#weightHistory"), encourageLine: q("#encourageLine"), cycleForm: q("#cycleForm"), cycleStart: q("#cycleStart"), cycleEnd: q("#cycleEnd"), cycleLength: q("#cycleLength"), cycleNextDate: q("#cycleNextDate"), cycleDaysLeft: q("#cycleDaysLeft"), cycleHistory: q("#cycleHistory")
};

init();

function init() {
  bindNavigation();
  bindActions();
  bindSyncEvents();
  setFormDates();
  render();
  window.lucide?.createIcons();
  window.LoveSync?.initialize();
}

function bindNavigation() {
  els.tabs.forEach((tab) => tab.addEventListener("click", () => {
    activateTab(tab.dataset.tab);
  }));
}

function activateTab(target, scrollTarget) {
  els.tabs.forEach((item) => item.classList.toggle("is-active", item.dataset.tab === target));
  els.screens.forEach((screen) => screen.classList.toggle("is-active", screen.id === target));
  if (scrollTarget) {
    window.setTimeout(() => scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function bindActions() {
  els.openPairing.addEventListener("click", () => activateTab("me", q("#syncPanel")));
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
    setNewQuestion(els.questionCategorySelect.value);
  });
  els.questionAnswerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = els.questionAnswer.value.trim();
    if (!answer) return;
    state.dailyQuestion.answers[currentPerson()] = answer;
    els.questionAnswer.value = "";
    persistAndRender();
  });
  els.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.taskText.value.trim();
    if (!text) return;
    state.tasks.unshift({ id: uid(), text, doneBy: [] });
    els.taskForm.reset();
    persistAndRender();
  });
  els.noteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.noteText.value.trim();
    if (!text) return;
    state.loveNotes.unshift({
      id: uid(), from: currentPerson(), to: els.noteReceiver.value,
      text, unlockDate: els.noteUnlockDate.value || todayString(), createdAt: todayString(), opened: false
    });
    els.noteForm.reset();
    setFormDates();
    persistAndRender();
  });
  els.studyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = els.studyContent.value.trim();
    const minutes = Number(els.studyMinutes.value);
    if (!content || !minutes || minutes < 1 || minutes > 1440) return;
    state.studyLogs.unshift({
      id: uid(), person: currentPerson(), content, minutes,
      date: els.studyDate.value || todayString(), note: els.studyNote.value.trim()
    });
    els.studyForm.reset();
    setFormDates();
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
    resetDiaryForm();
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
  els.diaryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.diaryText.value.trim();
    const title = els.diaryTitle.value.trim();
    if (!text || !title) return;
    const diaries = privateSpace().diaries;
    const editId = els.diaryEditId.value;
    const record = editId ? diaries.find((item) => item.id === editId) : null;
    const next = { title, text, mood: els.diaryMood.value.trim(), date: els.diaryDate.value || todayString() };
    if (record) Object.assign(record, next);
    else diaries.unshift({ id: uid(), ...next });
    resetDiaryForm();
    persistAndRender();
  });
  els.cancelDiaryEdit.addEventListener("click", resetDiaryForm);
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
    const { role, needsPairing } = event.detail;
    els.pairingNotice.hidden = !needsPairing;
    if (needsPairing && !pairingRedirected) {
      pairingRedirected = true;
      activateTab("me", q("#syncPanel"));
    }
    if (role) {
      pairingRedirected = false;
      state.writer = role;
      state.privatePerson = role;
      setFormDates();
      saveLocalAndRender();
    }
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
  renderQuestion();
  renderTasks();
  renderLoveNotes();
  renderStudyLogs();
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

function renderQuestion() {
  const question = state.dailyQuestion;
  const person = currentPerson();
  const answered = Object.values(question.answers || {}).filter(Boolean).length;
  const unlocked = answered === 2;
  els.questionText.textContent = question.text;
  els.questionCategory.textContent = questionCategoryNames[question.category] || "随机";
  els.questionWriterName.textContent = people[person].name;
  els.questionAnswer.value = question.answers?.[person] || "";
  els.questionAnswer.placeholder = question.answers?.[person] ? "可以修改自己的答案" : "写下你的答案，双方回答后解锁...";
  els.questionAnswers.replaceChildren(...Object.keys(people).map((id) => {
    const card = document.createElement("article");
    const hasAnswer = Boolean(question.answers?.[id]);
    card.className = `answer-card${unlocked || id === person ? "" : " is-locked"}`;
    const text = hasAnswer
      ? (unlocked || id === person ? escapeHTML(question.answers[id]) : "已回答，等你写完后一起解锁。")
      : "还没有回答";
    card.innerHTML = `<header><span>${people[id].name}</span><small>${hasAnswer ? "已回答" : "等待回答"}</small></header><p>${text}</p>`;
    return card;
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

function renderLoveNotes() {
  const notes = state.loveNotes || [];
  const person = currentPerson();
  els.noteStats.textContent = `${notes.length} 张`;
  els.noteReceiver.value = person === "liu" ? "fu" : "liu";
  if (!notes.length) return renderEmpty(els.noteList, "折一张小纸条，留给对方在某天打开。");
  els.noteList.replaceChildren(...notes.map((item) => {
    const available = item.unlockDate <= todayString();
    const canRead = item.from === person || (item.to === person && available && item.opened);
    const canOpen = item.to === person && available && !item.opened;
    const node = document.createElement("article");
    node.className = `love-note${canRead ? "" : " is-locked"}`;
    const body = canRead ? escapeHTML(item.text) : (available ? "这张纸条已经可以打开了。" : `${formatDate(parseDate(item.unlockDate))} 才能打开`);
    node.innerHTML = `<header><span>${people[item.from].short} 写给 ${people[item.to].short}</span><time>${formatDate(parseDate(item.createdAt))}</time></header><p>${body}</p>${canOpen ? `<button class="note-open" data-open-note="${item.id}" type="button">打开纸条</button>` : ""}${item.from === person ? `<button class="delete-button" data-delete-note="${item.id}" type="button" aria-label="删除纸条">×</button>` : ""}`;
    return node;
  }));
  els.noteList.querySelectorAll("[data-open-note]").forEach((button) => button.addEventListener("click", () => {
    const note = state.loveNotes.find((item) => item.id === button.dataset.openNote);
    if (note && note.to === currentPerson() && note.unlockDate <= todayString()) note.opened = true;
    persistAndRender();
  }));
  els.noteList.querySelectorAll("[data-delete-note]").forEach((button) => button.addEventListener("click", () => {
    state.loveNotes = state.loveNotes.filter((item) => item.id !== button.dataset.deleteNote || item.from !== currentPerson());
    persistAndRender();
  }));
}

function renderStudyLogs() {
  const logs = sortByDateDesc(state.studyLogs || []);
  const total = logs.reduce((sum, item) => sum + Number(item.minutes || 0), 0);
  els.studyStats.textContent = total >= 60 ? `${(total / 60).toFixed(total % 60 ? 1 : 0)} 小时` : `${total} 分钟`;
  if (!logs.length) return renderEmpty(els.studyList, "第一次学习打卡，从今天的一点进步开始。");
  els.studyList.replaceChildren(...logs.map((item) => {
    const node = document.createElement("article");
    node.className = "study-record";
    node.innerHTML = `<header><span>${people[item.person].name}</span><time>${formatDate(parseDate(item.date))}</time></header><h3>${escapeHTML(item.content)}</h3><p><span class="study-minutes">${item.minutes} 分钟</span>${item.note ? ` · ${escapeHTML(item.note)}` : ""}</p>${item.person === currentPerson() ? `<button class="delete-button" data-delete-study="${item.id}" type="button" aria-label="删除学习记录">×</button>` : ""}`;
    return node;
  }));
  els.studyList.querySelectorAll("[data-delete-study]").forEach((button) => button.addEventListener("click", () => {
    state.studyLogs = state.studyLogs.filter((item) => item.id !== button.dataset.deleteStudy || item.person !== currentPerson());
    persistAndRender();
  }));
}

function renderMeetings() {
  if (!state.meetings.length) return renderEmpty(els.meetingList, "第一次见面，值得从这里开始收藏。");
  const meetings = [...state.meetings].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  els.meetingList.replaceChildren(...meetings.map((item) => {
    const node = document.createElement("article");
    node.className = "meeting-card";
    node.innerHTML = `<h3>${escapeHTML(item.title)}</h3><time>${item.date ? formatDate(parseDate(item.date)) : "等待约定"}${item.place ? ` · ${escapeHTML(item.place)}` : ""}</time>${item.note ? `<p>${escapeHTML(item.note)}</p>` : ""}<button class="delete-button" data-delete-meeting="${item.id}" type="button" aria-label="删除见面记录">×</button>`;
    return node;
  }));
  els.meetingList.querySelectorAll("[data-delete-meeting]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("确定删除这条见面记录吗？")) return;
    state.meetings = state.meetings.filter((item) => item.id !== button.dataset.deleteMeeting);
    persistAndRender();
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
  renderDiaries(space.diaries || []);
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

function renderDiaries(diaries) {
  const ordered = sortByDateDesc(diaries);
  if (!ordered.length) return renderEmpty(els.diaryList, "这里是只属于你的安静角落。");
  els.diaryList.replaceChildren(...ordered.map((item) => {
    const node = document.createElement("article");
    node.className = "diary-record";
    node.innerHTML = `<header><span>${item.mood ? escapeHTML(item.mood) : "今日记录"}</span><time>${formatDate(parseDate(item.date))}</time></header><h3>${escapeHTML(item.title)}</h3><p class="diary-body">${escapeHTML(item.text)}</p><button class="delete-button" data-delete-diary="${item.id}" type="button" aria-label="删除日记">×</button><button class="diary-edit" data-edit-diary="${item.id}" type="button">修改</button>`;
    return node;
  }));
  els.diaryList.querySelectorAll("[data-delete-diary]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("确定删除这篇私人日记吗？")) return;
    const space = privateSpace();
    space.diaries = space.diaries.filter((item) => item.id !== button.dataset.deleteDiary);
    resetDiaryForm();
    persistAndRender();
  }));
  els.diaryList.querySelectorAll("[data-edit-diary]").forEach((button) => button.addEventListener("click", () => {
    const item = privateSpace().diaries.find((entry) => entry.id === button.dataset.editDiary);
    if (!item) return;
    els.diaryEditId.value = item.id;
    els.diaryDate.value = item.date;
    els.diaryMood.value = item.mood || "";
    els.diaryTitle.value = item.title;
    els.diaryText.value = item.text;
    els.saveDiary.textContent = "保存修改";
    els.cancelDiaryEdit.hidden = false;
    els.diaryForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
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

function setNewQuestion(category) {
  const categories = Object.keys(questionBank);
  const chosenCategory = category === "all" ? pickRandom(categories) : category;
  const pool = questionBank[chosenCategory] || questionBank.daily;
  let text = pickRandom(pool);
  for (let attempt = 0; attempt < 8 && text === state.dailyQuestion.text; attempt += 1) text = pickRandom(pool);
  state.dailyQuestion = { id: uid(), category: chosenCategory, text, date: todayString(), answers: { liu: "", fu: "" } };
  persistAndRender();
}

function currentPerson() { return window.LoveSync?.getRole() || state.writer; }
function setFormDates() {
  const today = todayString();
  els.noteUnlockDate.value = els.noteUnlockDate.value || today;
  els.studyDate.value = els.studyDate.value || today;
  els.diaryDate.value = els.diaryDate.value || today;
  els.weightDate.value = els.weightDate.value || today;
}
function resetDiaryForm() {
  els.diaryForm.reset();
  els.diaryEditId.value = "";
  els.diaryDate.value = todayString();
  els.saveDiary.textContent = "保存日记";
  els.cancelDiaryEdit.hidden = true;
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
  const base = structuredClone(defaults);
  return {
    ...base, ...saved,
    moods: { ...base.moods, ...(saved.moods || {}) },
    dailyQuestion: {
      ...base.dailyQuestion,
      ...(saved.dailyQuestion || {}),
      answers: { ...base.dailyQuestion.answers, ...(saved.dailyQuestion?.answers || {}) }
    },
    loveNotes: Array.isArray(saved.loveNotes) ? saved.loveNotes : [],
    studyLogs: Array.isArray(saved.studyLogs) ? saved.studyLogs : [],
    private: {
      liu: mergePrivateSpace(saved.private?.liu, "liu"),
      fu: mergePrivateSpace(saved.private?.fu, "fu")
    }
  };
}
function mergePrivateSpace(savedSpace, person) {
  const base = structuredClone(defaults).private[person];
  return {
    ...base,
    ...(savedSpace || {}),
    diaries: Array.isArray(savedSpace?.diaries) ? savedSpace.diaries : [],
    health: { ...base.health, ...(savedSpace?.health || {}) }
  };
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
