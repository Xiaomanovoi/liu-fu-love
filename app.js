const storageKey = "love-tool-liu-fu-v2";
const recoveryBackupKey = "love-tool-liu-fu-shared-backup-v1";
const syncFeatureCacheKey = "love-sync-feature-cache-v1";
const people = {
  liu: { name: "刘向强", short: "向强", color: "rose" },
  fu: { name: "付嘉颖", short: "嘉颖", color: "fu" }
};
const moodGroups = [
  {
    label: "此刻心情",
    items: ["想你", "超级想你", "开心", "平静", "期待", "心动", "被治愈", "有安全感", "感恩", "兴奋", "满足", "想撒娇", "想聊天", "需要抱抱", "委屈", "焦虑", "失落", "孤单", "吃醋了", "烦躁", "紧张", "有点烦", "有点累", "情绪低落", "需要鼓励", "想安静一下"]
  },
  {
    label: "正在做什么",
    items: ["在学习", "在工作", "在上课", "在忙", "在路上", "在通勤", "在吃饭", "在做饭", "在运动", "在健身", "在散步", "在打游戏", "在追剧", "在听歌", "在休息", "准备睡觉", "刚刚睡醒", "和朋友一起", "陪家人中", "等待见面"]
  },
  {
    label: "身体状态",
    items: ["元气满满", "有点困", "饿了", "身体不舒服", "姨妈期", "头有点痛", "需要休息", "慢慢恢复中"]
  }
];
const moods = moodGroups.flatMap((group) => group.items);
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
Object.entries(window.EXTRA_LOVE_QUESTIONS || {}).forEach(([category, questions]) => {
  if (!questionBank[category] || !Array.isArray(questions)) return;
  const refreshedQuestions = [...new Set(questions.map((question) => String(question || "").trim()).filter(Boolean))];
  if (refreshedQuestions.length) questionBank[category] = refreshedQuestions;
});
const questionCategoryNames = { daily: "日常", romance: "浪漫", memory: "回忆", future: "未来", deep: "深入", private: "私密", flirty: "情趣" };
const dailyCapsules = [
  { type: "一句情话", text: "隔着不同的城市，也要把喜欢认真放进每一天。" },
  { type: "今日鼓励", text: "不用一下子变得很厉害，今天比昨天前进一点就很好。" },
  { type: "温柔提醒", text: "忙碌的时候也别忘了吃饭、喝水，还有告诉对方你平安。" },
  { type: "一起成长", text: "最好的陪伴，是我们都在成为更喜欢的自己。" },
  { type: "一句情话", text: "距离只负责考验时间，想念会替我们拥抱彼此。" },
  { type: "学习勉励", text: "认真学过的每一分钟，都在悄悄靠近想要的未来。" },
  { type: "今日鼓励", text: "允许今天不完美，但别忘了肯定已经努力的自己。" },
  { type: "温柔提醒", text: "有情绪并不可怕，说出来就是在给爱一次靠近的机会。" },
  { type: "一句情话", text: "日子普通没关系，因为分享给你以后就有了意义。" },
  { type: "一起成长", text: "两个人最好的默契，是各自努力，也彼此托底。" },
  { type: "学习勉励", text: "先完成，再完善；今天坐下来开始，就已经赢了一半。" },
  { type: "今日鼓励", text: "慢一点也没关系，稳定地向前就是很了不起的速度。" },
  { type: "一句情话", text: "想见面不是一句抱怨，是我对下一次重逢的期待。" },
  { type: "温柔提醒", text: "真正的关心不一定是解决问题，也可以只是安静听完。" },
  { type: "一起成长", text: "我们不用步伐完全相同，只要方向里一直有彼此。" },
  { type: "今日鼓励", text: "别因为一次失误否定自己，你依然值得被坚定喜欢。" },
  { type: "一句情话", text: "今天看到好看的云，第一反应还是想发给你。" },
  { type: "学习勉励", text: "把目标拆成很小的一步，然后认真完成眼前这一步。" },
  { type: "温柔提醒", text: "累了就休息，不必把疲惫解释成不够努力。" },
  { type: "一句情话", text: "你不用每时每刻有趣，我喜欢的也包括你安静的样子。" },
  { type: "今日鼓励", text: "你已经走过很多曾经以为走不过去的路。" },
  { type: "一起成长", text: "爱不是互相消耗，而是让彼此更有勇气面对生活。" },
  { type: "一句情话", text: "下一次见面，我想先好好看看你，再抱紧一点。" },
  { type: "学习勉励", text: "专注当下的四十分钟，未来会感谢现在没有放弃的你。" },
  { type: "温柔提醒", text: "及时表达需要不是麻烦对方，而是在练习信任。" },
  { type: "今日鼓励", text: "今天也请把自己放在重要的位置，好好照顾。" },
  { type: "一句情话", text: "世界很大，但我最想抵达的坐标一直是你身边。" },
  { type: "一起成长", text: "好的关系不是没有分歧，而是愿意一起寻找答案。" },
  { type: "学习勉励", text: "看似重复的练习，会在某一天突然变成你的底气。" },
  { type: "一句情话", text: "我喜欢的不只是见面，也喜欢等待见面时认真的我们。" },
  { type: "今日鼓励", text: "别急着和别人比较，属于你的进度同样值得尊重。" },
  { type: "温柔提醒", text: "一句早安和一句晚安，都可以成为小小的安全感。" },
  { type: "一句情话", text: "有你可以分享，开心就变成双份，难过也会轻一点。" },
  { type: "一起成长", text: "我们可以互相依靠，也要保留独立生长的力量。" },
  { type: "今日鼓励", text: "不开心的时候先抱抱自己，答案可以晚一点再找。" },
  { type: "学习勉励", text: "每一次克制分心、回到目标，都是一种进步。" },
  { type: "一句情话", text: "希望所有绕远的路，最后都通向我们认真规划的未来。" },
  { type: "温柔提醒", text: "不要让猜测代替沟通，真实的话会让距离变短。" },
  { type: "今日鼓励", text: "你不需要证明自己值得爱，你本来就值得。" },
  { type: "一句情话", text: "如果今天有一点疲惫，就把我的想念当作靠枕。" },
  { type: "一起成长", text: "共同的未来，是由许多个认真生活的今天组成的。" },
  { type: "学习勉励", text: "开始得晚没有关系，重要的是现在愿意开始。" },
  { type: "一句情话", text: "我想参与的不只是你的快乐，还有那些不太顺利的日子。" },
  { type: "温柔提醒", text: "先确认对方的感受，再讨论事情本身，会温柔很多。" },
  { type: "今日鼓励", text: "今天完成一件小事，也值得认真为自己开心。" },
  { type: "一句情话", text: "平淡生活里反复选择你，就是我最认真的浪漫。" },
  { type: "一起成长", text: "愿我们既能共享好消息，也能接住彼此的低谷。" },
  { type: "学习勉励", text: "放下对完美的要求，专心把这一页读完。" }
];

const achievementCategories = {
  daily: {
    label: "日常陪伴", copy: "普通的小事，认真一起做就会变成共同生活。", items: [
      "一起完整看完一部电影", "连续七天互道早安和晚安", "一起做一次饭", "一起逛一次超市", "一起散步超过一小时",
      "一起听完一张专辑", "分享彼此一天中的三件小事", "一起整理房间或书桌", "一起吃一次夜宵", "共同完成一周生活打卡"
    ]
  },
  distance: {
    label: "异地默契", copy: "隔着距离，也能参与彼此真实而具体的生活。", items: [
      "视频通话超过三小时", "一起远程看一部电影", "同步点一次相同的食物", "在不同城市拍下同一轮月亮", "寄出一封手写信",
      "给对方寄一次家乡特产", "一起完成一次远程学习", "连续三十天保持联系", "为下一次见面共同做计划", "在对方最需要时认真陪伴一次"
    ]
  },
  meeting: {
    label: "见面回忆", copy: "把每一次重逢，都变成可以反复想起的画面。", items: [
      "第一次正式见面", "第一次牵手散步", "第一次一起拍大头贴", "一起看一场电影", "一起去一次动物园或植物园",
      "一起逛一次夜市", "一起看日出或日落", "一起淋过一场雨", "留下十次见面记录", "见面时完成一张愿望清单"
    ]
  },
  travel: {
    label: "一起出发", copy: "去看没有看过的风景，也认识旅途里的彼此。", items: [
      "第一次一起旅行", "一起坐一次高铁", "一起坐一次飞机", "一起去海边", "一起爬一座山",
      "一起住一次民宿", "一起去一座陌生城市", "一起看一次城市夜景", "共同规划并完成三天行程", "收集五座城市的合照"
    ]
  },
  romance: {
    label: "浪漫时刻", copy: "浪漫不必昂贵，重要的是那一刻认真想到了对方。", items: [
      "互相写一封情书", "准备一次不提前透露的惊喜", "送给对方一束花", "拍一组正式的情侣照", "一起庆祝恋爱纪念日",
      "亲手制作一份礼物", "为对方准备一次早餐", "一起穿情侣装出门", "互相说出十个喜欢对方的理由", "完成一次只有两个人的烛光晚餐"
    ]
  },
  growth: {
    label: "共同成长", copy: "爱不是停在原地，而是陪彼此走向更宽阔的地方。", items: [
      "一起读完一本书", "共同坚持学习七天", "共同坚持学习三十天", "一起完成一个运动目标", "互相教会对方一项技能",
      "认真完成一次关系复盘", "一起存下第一笔共同旅行基金", "共同改掉一个坏习惯", "支持对方完成一件重要的事", "一起制定下一年的成长计划"
    ]
  },
  fun: {
    label: "有趣挑战", copy: "保留一点幼稚和好奇，生活就不会只有标准答案。", items: [
      "一起唱完一首歌", "一起玩通一个双人游戏", "互相模仿对方说话", "一起挑战一道从没做过的菜", "拍一次同款姿势照片",
      "一起完成你画我猜", "让对方决定自己一天的穿搭", "一起去游乐园", "交换手机壁纸一周", "完成一次随机约会挑战"
    ]
  },
  milestone: {
    label: "时间里程碑", copy: "时间会经过，而认真保存的日子会留下来。", items: [
      "在一起100天", "在一起365天", "在一起500天", "在一起1000天", "一起度过第一个生日",
      "一起度过第一个跨年", "一起度过第一个情人节", "共同相册达到50张照片", "共同留言达到100条", "一起完成全部八类中的第一项成就"
    ]
  }
};
const achievementDefinitions = Object.entries(achievementCategories).flatMap(([category, group]) =>
  group.items.map((text, index) => ({ id: `${category}-${index + 1}`, category, text }))
);
const encouragements = [
  "慢慢来，今天照顾好自己就已经很好。",
  "健康是和身体做朋友，不是和它较劲。",
  "一杯水、一次散步，都是认真爱自己的证据。",
  "不必完美，稳定地对自己好一点就很棒。"
];

const gardenStages = [
  { name: "心意种子", min: 0, scene: "seed", copy: "一颗属于你们的种子，正在安静等待。", reward: "泥土里会出现第一点嫩绿" },
  { name: "刚刚发芽", min: 200, scene: "sprout", copy: "第一片嫩叶，记住了你们的认真。", reward: "解锁蘑菇小灯与新叶" },
  { name: "双生幼苗", min: 500, scene: "seedling", copy: "两株花藤，正在向彼此靠近。", reward: "双枝幼苗与暖光灯串" },
  { name: "心意花苞", min: 900, scene: "bud", copy: "花苞已经出现，离第一次盛开不远了。", reward: "花苞、长椅与新的叶片" },
  { name: "初次盛开", min: 1400, scene: "bloom", copy: "你们共同照顾的花，已经认真盛开。", reward: "双花盛开与玻璃风铃" },
  { name: "秘密花园", min: 2000, scene: "garden", copy: "花房已经打开，回忆正在长成风景。", reward: "心形藤蔓与星光路灯" },
  { name: "花间小径", min: 2800, scene: "path", copy: "花与路延伸开来，每一步都有共同生活的痕迹。", reward: "秋千、小池塘与花间小径" },
  { name: "星光庭院", min: 3400, scene: "courtyard", copy: "夜晚也有温柔的光，庭院开始拥有自己的四季。", reward: "星幕、花架与月光拱门" },
  { name: "四季秘境", min: 4300, scene: "sanctuary", copy: "被认真照顾的爱，终于长成了一座四季都盛开的花园。", reward: "双人亭与完整四季花境" }
];
const gardenColorNames = {
  coral: "珊瑚粉", lavender: "淡紫色", mint: "薄荷绿", gold: "晨光金", peach: "蜜桃橙", sky: "晴空蓝", berry: "莓果红", ivory: "月光白",
  rose: "蔷薇雾", lilac: "丁香紫", aqua: "湖水青", butter: "奶油黄", dusk: "暮霞蓝", jade: "新叶青", wine: "晚樱红", champagne: "香槟杏"
};
const gardenColorHex = {
  coral: "#df7e8d", lavender: "#9d92c5", mint: "#79a58e", gold: "#d4a45f", peach: "#eaa17e", sky: "#78a8c5", berry: "#b85f79", ivory: "#f3eee6",
  rose: "#d995a6", lilac: "#b19acb", aqua: "#72aaa8", butter: "#e7c978", dusk: "#7f91b5", jade: "#6f9a78", wine: "#a9576e", champagne: "#dfb78f"
};
const gardenShapeNames = { round: "圆润", star: "星形", heart: "心形", soft: "轻盈", pointed: "纤长", ruffled: "褶边", spoon: "匙形", bell: "铃兰形", lotus: "莲瓣", wave: "波浪边", teardrop: "露滴形", butterfly: "蝶翼形" };
const gardenPatternNames = { solid: "柔和纯色", edge: "细线描边", dew: "晨露光点", blush: "柔雾渐染", silk: "丝绒花脉", speckle: "星点洒金", moonwash: "月晕留白", tipped: "瓣尖染色" };
const gardenCenterNames = { sun: "暖阳", pearl: "珍珠", berry: "莓果", starlight: "星光", honey: "蜜糖", moon: "弯月", jade: "青玉", heart: "心印" };
const gardenLayerNames = { airy: "清透单层", classic: "经典饱满", double: "双层花冠", lush: "绒簇盛放" };
const gardenAuraNames = { none: "不加点缀", stardust: "星屑", pearl: "珍珠露", hearts: "小爱心", butterfly: "蝶光", halo: "月辉环" };
const gardenAreaDefinitions = [
  { id: "nursery", name: "心意苗圃", threshold: 0, copy: "种子与浇水", panel: "seeds", icon: "sprout" },
  { id: "memory", name: "回忆角落", threshold: 900, copy: "花朵图鉴", panel: "flowers", icon: "images" },
  { id: "glasshouse", name: "晨光花房", threshold: 2000, copy: "共同培育", panel: "together", icon: "heart-handshake" },
  { id: "path", name: "花间小径", threshold: 2800, copy: "愿望花苞", panel: "wishes", icon: "flower-2" },
  { id: "courtyard", name: "星光庭院", threshold: 3400, copy: "成长年鉴", panel: "growth", icon: "moon-star" }
];
const gardenDecorations = [
  { id: "mushrooms", name: "蘑菇小灯", threshold: 120, slot: "left", icon: "lamp-desk" },
  { id: "stones", name: "月白石径", threshold: 160, slot: "path", icon: "footprints" },
  { id: "planters", name: "彩釉花盆", threshold: 220, slot: "right", icon: "flower-2" },
  { id: "lights", name: "暖光灯串", threshold: 300, slot: "overhead", icon: "lightbulb" },
  { id: "picnic", name: "双人野餐毯", threshold: 380, slot: "left", icon: "sandwich" },
  { id: "ribbon", name: "心意飘带", threshold: 460, slot: "atmosphere", icon: "ribbon" },
  { id: "bench", name: "双人长椅", threshold: 560, slot: "left", icon: "armchair" },
  { id: "mailbox", name: "花园信箱", threshold: 680, slot: "right", icon: "mailbox" },
  { id: "birdhouse", name: "林间鸟屋", threshold: 800, slot: "right", icon: "house" },
  { id: "windchime", name: "玻璃风铃", threshold: 920, slot: "overhead", icon: "music-2" },
  { id: "arch", name: "蔷薇拱门", threshold: 1080, slot: "structure", icon: "landmark" },
  { id: "lanterns", name: "星光路灯", threshold: 1250, slot: "path", icon: "lamp-wall-up" },
  { id: "butterflyhouse", name: "蝴蝶小屋", threshold: 1400, slot: "right", icon: "origami" },
  { id: "swing", name: "花藤秋千", threshold: 1600, slot: "left", icon: "panel-top" },
  { id: "fountain", name: "晨露喷泉", threshold: 1800, slot: "right", icon: "waves" },
  { id: "pond", name: "月影小池", threshold: 2000, slot: "right", icon: "circle-dot-dashed" },
  { id: "bridge", name: "白木小桥", threshold: 2200, slot: "structure", icon: "route" },
  { id: "shelf", name: "四季花架", threshold: 2400, slot: "structure", icon: "library-big" },
  { id: "flowercart", name: "流动花车", threshold: 2600, slot: "left", icon: "shopping-basket" },
  { id: "starlight", name: "庭院星幕", threshold: 2800, slot: "atmosphere", icon: "sparkles" },
  { id: "moonlamp", name: "月亮吊灯", threshold: 3000, slot: "overhead", icon: "moon-star" },
  { id: "moongate", name: "月光花门", threshold: 3300, slot: "structure", icon: "circle-arch" },
  { id: "pavilion", name: "双人花亭", threshold: 3600, slot: "structure", icon: "building" },
  { id: "wishbottles", name: "心愿瓶灯", threshold: 3900, slot: "hanging", icon: "flask-conical" },
  { id: "seasongate", name: "四季秘境门", threshold: 4300, slot: "structure", icon: "door-open" }
];
const gardenPointCategories = {
  baseline: { name: "历史成长", icon: "heart" }, watering: { name: "共同浇水", icon: "droplets" },
  question: { name: "每日问答", icon: "messages-square" }, message: { name: "共同留言", icon: "message-circle-heart" },
  study: { name: "学习打卡", icon: "book-open-check" },
  voice: { name: "声音信箱", icon: "mic-2" }, photo: { name: "公共相册", icon: "image" },
  task: { name: "双人任务", icon: "list-checks" }, game: { name: "游戏记录", icon: "gamepad-2" },
  seed: { name: "心意种子", icon: "sprout" }, bloom: { name: "双生花", icon: "flower-2" },
  achievement: { name: "情侣成就", icon: "badge-check" }, meeting: { name: "见面记录", icon: "map-pin-heart" },
  wish: { name: "共同愿望", icon: "sparkles" }, coPlant: { name: "共育植物", icon: "leaf" },
  gardenQuest: { name: "花园任务", icon: "calendar-heart" }, flowerLetter: { name: "花期信箱", icon: "mail-heart" }
};
const sharedRecordFields = ["messages", "tasks", "loveNotes", "studyLogs", "gameRecords", "meetings", "photos", "wheels", "wheelOptions", "wheelHistory"];
const defaultFoodChoices = [
  "火锅", "烤肉", "烧烤", "川菜", "湘菜", "粤菜", "东北菜", "面馆", "米线", "螺蛳粉",
  "麻辣烫", "冒菜", "炸鸡", "汉堡", "披萨", "寿司", "饺子", "炒饭", "小龙虾", "甜品"
];
const defaultWheel = { id: "wheel-food", name: "今天吃什么", isDefault: true, createdAt: "2026-08-05T00:00:00.000Z", updatedAt: "2026-08-05T00:00:00.000Z" };
const defaultWheelOptions = defaultFoodChoices.map((text, index) => ({
  id: `wheel-food-${index + 1}`, wheelId: defaultWheel.id, text, order: index,
  createdAt: defaultWheel.createdAt, updatedAt: defaultWheel.updatedAt
}));
const historyLimits = { messages: 5, voices: 5, tasks: 5, notes: 5, study: 5, games: 5, wheelHistory: 5 };
const gardenQuestPool = [
  "交换一张今天随手拍的照片", "认真听对方分享一件小事", "一起通话至少二十分钟", "互相说一个最近发现的优点",
  "约好一起看一集剧或一部电影", "各自分享一首最近喜欢的歌", "一起决定下一次见面想吃什么", "互相说一句具体的鼓励",
  "分享今天最好笑的一件事", "一起完成一次学习或运动打卡", "各自发一段十秒以上的声音", "聊聊最近最想实现的小目标",
  "找出一张以前没发过的照片", "一起玩一局喜欢的游戏", "睡前认真说一次晚安", "共同写下一件未来想做的事",
  "互相推荐一个好用的小东西", "分享今天窗外或路上的景色", "一起回忆第一次见面的一个细节", "约定本周的一段专属相处时间"
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
  questionHistory: [],
  loveNotes: [],
  studyLogs: [],
  gameRecords: [],
  achievements: { completed: {}, custom: [], edits: {} },
  meetings: [
    { id: uid(), title: "下一次见面", date: "", place: "", note: "把想见面的日子先约下来。", planned: true }
  ],
  photos: [],
  wheels: [defaultWheel],
  wheelOptions: defaultWheelOptions,
  wheelHistory: [],
  deletedRecords: {},
  garden: {
    version: 3,
    points: 0,
    baselinePoints: 0,
    migrationComplete: false,
    creditedKeys: [],
    pointEvents: [],
    lastStage: 0,
    waterings: {},
    seeds: [],
    wishes: [],
    hybrid: { round: 1, choices: { liu: null, fu: null }, blooms: [] },
    snapshots: [],
    unlockedAreas: [],
    deletedIds: [],
    decorationStates: {},
    featuredDecoration: "none",
    decorationUpdatedAt: "",
    companionPlant: { name: "", species: "rose", createdAt: "", care: {} },
    flowerLetters: [],
    weeklyQuests: {},
    anniversaries: [],
    sign: { name: "向强与嘉颖的花园", motto: "异地也在一起生长", style: "rose", updatedAt: "" },
    yearbookHighlights: {}
  },
  private: {
    liu: { goals: [], traits: [{ id: uid(), type: "优点", text: "她会认真记住我随口说过的小事" }], diaries: [], deletedRecords: {}, health: { water: 0, movement: 0, weights: [], cycles: [] } },
    fu: { goals: [], traits: [{ id: uid(), type: "习惯", text: "他会在忙完后第一时间分享今天" }], diaries: [], deletedRecords: {}, health: { water: 0, movement: 0, weights: [], cycles: [] } }
  }
};

let state = loadState();
let selectedMood = state.moods[state.writer].feeling;
let photoPreviewUrl = "";
let gamePhotoPreviewUrl = "";
let pairingRedirected = false;
let activeAchievementFilter = "all";
let achievementsExpanded = false;
let lastCapsuleDate = "";
let missStats = emptyMissStats();
let voiceMessages = [];
let voiceRecorder = null;
let voiceStream = null;
let voiceChunks = [];
let voiceStartedAt = 0;
let voiceTimer = null;
let voiceStopTimer = null;
let voiceDraft = null;
let voiceDraftUrl = "";
let gardenReturnTab = "home";
let gardenReturnScroll = 0;
let activeGardenPanel = "seeds";
let gardenBloomsExpanded = false;
let activeYearbookKey = "";
let gardenNeedsResync = false;
let gardenSeedPhotoOptionsKey = "";
let gardenSeedVoiceOptionsKey = "";
let gardenSeedOptionsPending = false;
let sharedNeedsResync = false;
const historyExpanded = { messages: false, voices: false, tasks: false, notes: false, study: false, games: false, wheelHistory: false };
let activeWheelId = "wheel-food";
let wheelRotation = 0;
let wheelSpinning = false;
let lastWheelResultId = "";

const els = {
  daysTogether: q("#daysTogether"), editStartDate: q("#editStartDate"), settingsDialog: q("#settingsDialog"), startDateInput: q("#startDateInput"), saveStartDate: q("#saveStartDate"),
  presenceText: q("#presenceText"), openMood: q("#openMood"), moodDialog: q("#moodDialog"), moodDialogTitle: q("#moodDialogTitle"), moodPicker: q("#moodPicker"), moodNote: q("#moodNote"), saveMood: q("#saveMood"), pairingNotice: q("#pairingNotice"), openPairing: q("#openPairing"),
  tabs: qa(".tab"), screens: qa(".screen"), capsuleType: q("#capsuleType"), capsuleDate: q("#capsuleDate"), capsuleText: q("#capsuleText"), moodCards: q("#moodCards"), nextMeetingTitle: q("#nextMeetingTitle"), nextMeetingMeta: q("#nextMeetingMeta"), nextMeetingDays: q("#nextMeetingDays"),
  sendMiss: q("#sendMiss"), missHint: q("#missHint"), missSentLabel: q("#missSentLabel"), missSentTotal: q("#missSentTotal"), missSentToday: q("#missSentToday"), missReceivedLabel: q("#missReceivedLabel"), missReceivedTotal: q("#missReceivedTotal"), missReceivedToday: q("#missReceivedToday"),
  writerName: q("#writerName"), switchWriter: q("#switchWriter"), messageForm: q("#messageForm"), messageText: q("#messageText"), messageList: q("#messageList"), questionText: q("#questionText"), questionCategory: q("#questionCategory"), questionCategorySelect: q("#questionCategorySelect"), newQuestion: q("#newQuestion"), questionAnswerForm: q("#questionAnswerForm"), questionAnswer: q("#questionAnswer"), questionWriterName: q("#questionWriterName"), questionAnswers: q("#questionAnswers"),
  recordVoice: q("#recordVoice"), voiceRecordStatus: q("#voiceRecordStatus"), voiceRecordTimer: q("#voiceRecordTimer"), voiceDraft: q("#voiceDraft"), voicePreview: q("#voicePreview"), discardVoice: q("#discardVoice"), sendVoice: q("#sendVoice"), voiceNotice: q("#voiceNotice"), voiceList: q("#voiceList"), voiceCount: q("#voiceCount"),
  openStarBottle: q("#openStarBottle"), closeStarBottle: q("#closeStarBottle"), openGardenHome: q("#openGardenHome"), openGardenTogether: q("#openGardenTogether"), closeGarden: q("#closeGarden"), gardenPreviewStatus: q("#gardenPreviewStatus"), gardenShortcutStage: q("#gardenShortcutStage"), gardenShortcutWater: q("#gardenShortcutWater"), gardenWeatherChip: q("#gardenWeatherChip"), gardenStage: q("#gardenStage"), gardenPlant: q("#gardenPlant"), gardenGateSign: q("#gardenGateSign"), gardenStageName: q("#gardenStageName"), gardenPoints: q("#gardenPoints"), gardenProgressBar: q("#gardenProgressBar"), gardenNextStage: q("#gardenNextStage"), gardenWateringStatus: q("#gardenWateringStatus"), waterGarden: q("#waterGarden"), gardenNotice: q("#gardenNotice"), gardenTools: q(".garden-tools"), gardenPanels: qa("[data-garden-content]"), gardenButterfly: q("#gardenButterfly"), gardenMemoryReveal: q("#gardenMemoryReveal"), closeGardenMemory: q("#closeGardenMemory"), gardenMemoryTitle: q("#gardenMemoryTitle"), gardenMemoryText: q("#gardenMemoryText"), gardenFestivalScene: q("#gardenFestivalScene"), gardenCompanionScene: q("#gardenCompanionScene"),
  gardenSeedForm: q("#gardenSeedForm"), gardenSeedText: q("#gardenSeedText"), gardenSeedUnlockDate: q("#gardenSeedUnlockDate"), gardenSeedPhoto: q("#gardenSeedPhoto"), gardenSeedVoice: q("#gardenSeedVoice"), gardenSeedCount: q("#gardenSeedCount"), gardenSeedList: q("#gardenSeedList"), gardenWishForm: q("#gardenWishForm"), gardenWishText: q("#gardenWishText"), gardenWishDate: q("#gardenWishDate"), gardenWishCount: q("#gardenWishCount"), gardenWishList: q("#gardenWishList"),
  gardenHybridForm: q("#gardenHybridForm"), gardenHybridColor: q("#gardenHybridColor"), gardenHybridShape: q("#gardenHybridShape"), gardenHybridPattern: q("#gardenHybridPattern"), gardenHybridCenter: q("#gardenHybridCenter"), gardenHybridLayer: q("#gardenHybridLayer"), gardenHybridAura: q("#gardenHybridAura"), gardenHybridPreview: q("#gardenHybridPreview"), gardenHybridStatus: q("#gardenHybridStatus"), gardenBloomCount: q("#gardenBloomCount"), gardenBloomGallery: q("#gardenBloomGallery"), toggleGardenBlooms: q("#toggleGardenBlooms"), gardenMemoryFlowers: q("#gardenMemoryFlowers"), gardenSnapshotCount: q("#gardenSnapshotCount"), gardenStageProgressText: q("#gardenStageProgressText"), gardenStageRemaining: q("#gardenStageRemaining"), gardenRoadmap: q("#gardenRoadmap"), gardenLedgerSummary: q("#gardenLedgerSummary"), gardenPointBreakdown: q("#gardenPointBreakdown"), gardenPointLedger: q("#gardenPointLedger"), gardenAreaProgress: q("#gardenAreaProgress"), gardenTimeline: q("#gardenTimeline"),
  gardenAreaMap: q("#gardenAreaMap"), gardenYearbookSeason: q("#gardenYearbookSeason"), gardenYearbookHighlight: q("#gardenYearbookHighlight"), gardenYearbookPreview: q("#gardenYearbookPreview"), gardenYearbookRange: q("#gardenYearbookRange"), gardenYearbookTitle: q("#gardenYearbookTitle"), gardenYearbookMemory: q("#gardenYearbookMemory"), gardenYearbookStats: q("#gardenYearbookStats"), saveGardenYearbook: q("#saveGardenYearbook"), gardenYearbookArchive: q("#gardenYearbookArchive"),
  gardenSceneDecoration: q("#gardenSceneDecoration"), gardenDecorationList: q("#gardenDecorationList"),
  gardenTogetherSeason: q("#gardenTogetherSeason"), gardenCompanionDisplay: q("#gardenCompanionDisplay"), gardenCompanionForm: q("#gardenCompanionForm"), gardenCompanionName: q("#gardenCompanionName"), gardenCompanionSpecies: q("#gardenCompanionSpecies"), gardenCompanionStatus: q("#gardenCompanionStatus"), gardenCompanionPlantName: q("#gardenCompanionPlantName"), gardenCompanionMeta: q("#gardenCompanionMeta"), gardenCompanionProgress: q("#gardenCompanionProgress"), gardenCompanionCareStatus: q("#gardenCompanionCareStatus"), gardenCompanionCare: q("#gardenCompanionCare"), gardenQuestWeek: q("#gardenQuestWeek"), gardenQuestProgress: q("#gardenQuestProgress"), gardenQuestList: q("#gardenQuestList"), gardenPostcardWeek: q("#gardenPostcardWeek"), gardenPostcardStage: q("#gardenPostcardStage"), gardenPostcardBotanical: q("#gardenPostcardBotanical"), gardenPostcardTitle: q("#gardenPostcardTitle"), gardenPostcardCopy: q("#gardenPostcardCopy"), gardenPostcardStats: q("#gardenPostcardStats"), saveGardenPostcard: q("#saveGardenPostcard"), gardenPostcardNotice: q("#gardenPostcardNotice"), gardenLetterForm: q("#gardenLetterForm"), gardenLetterText: q("#gardenLetterText"), gardenLetterDate: q("#gardenLetterDate"), gardenLetterCount: q("#gardenLetterCount"), gardenLetterList: q("#gardenLetterList"), gardenAnniversaryForm: q("#gardenAnniversaryForm"), gardenAnniversaryTitle: q("#gardenAnniversaryTitle"), gardenAnniversaryDate: q("#gardenAnniversaryDate"), gardenAnniversaryStyle: q("#gardenAnniversaryStyle"), gardenAnniversaryList: q("#gardenAnniversaryList"),
  gardenMemoryDialog: q("#gardenMemoryDialog"), closeGardenMemoryDialog: q("#closeGardenMemoryDialog"), gardenMemoryImage: q("#gardenMemoryImage"), gardenMemoryType: q("#gardenMemoryType"), gardenMemoryDialogTitle: q("#gardenMemoryDialogTitle"), gardenMemoryMeta: q("#gardenMemoryMeta"), gardenMemoryDialogText: q("#gardenMemoryDialogText"),
  taskForm: q("#taskForm"), taskText: q("#taskText"), taskList: q("#taskList"), taskStats: q("#taskStats"),
  openWheel: q("#openWheel"), closeWheel: q("#closeWheel"), wheelShortcutName: q("#wheelShortcutName"), wheelShortcutMeta: q("#wheelShortcutMeta"), wheelSelect: q("#wheelSelect"), wheelCanvas: q("#wheelCanvas"), spinWheel: q("#spinWheel"), wheelResult: q("#wheelResult"), wheelResultText: q("#wheelResultText"), wheelEditorName: q("#wheelEditorName"), wheelOptionCount: q("#wheelOptionCount"), wheelOptionList: q("#wheelOptionList"), wheelOptionForm: q("#wheelOptionForm"), wheelOptionText: q("#wheelOptionText"), renameWheel: q("#renameWheel"), duplicateWheel: q("#duplicateWheel"), deleteWheel: q("#deleteWheel"), restoreWheel: q("#restoreWheel"), createWheel: q("#createWheel"), wheelHistoryList: q("#wheelHistoryList"), wheelHistoryCount: q("#wheelHistoryCount"), wheelCreateDialog: q("#wheelCreateDialog"), wheelCreateForm: q("#wheelCreateForm"), wheelCreateName: q("#wheelCreateName"), wheelCreateOptions: q("#wheelCreateOptions"),
  achievementStats: q("#achievementStats"), achievementPercent: q("#achievementPercent"), achievementProgressBar: q("#achievementProgressBar"), achievementFilter: q("#achievementFilter"), achievementVisibleCount: q("#achievementVisibleCount"), achievementList: q("#achievementList"), achievementMore: q("#achievementMore"), achievementForm: q("#achievementForm"), achievementText: q("#achievementText"), achievementEditDialog: q("#achievementEditDialog"), achievementEditId: q("#achievementEditId"), achievementEditText: q("#achievementEditText"), saveAchievementEdit: q("#saveAchievementEdit"),
  noteForm: q("#noteForm"), noteReceiver: q("#noteReceiver"), noteUnlockDate: q("#noteUnlockDate"), noteText: q("#noteText"), noteList: q("#noteList"), noteStats: q("#noteStats"),
  studyForm: q("#studyForm"), studyContent: q("#studyContent"), studyDate: q("#studyDate"), studyMinutes: q("#studyMinutes"), studyNote: q("#studyNote"), studyList: q("#studyList"), studyStats: q("#studyStats"),
  gameForm: q("#gameForm"), gameDate: q("#gameDate"), gameName: q("#gameName"), gameAchievement: q("#gameAchievement"), gamePhotoInput: q("#gamePhotoInput"), gamePhotoPreview: q("#gamePhotoPreview"), gamePhotoPreviewImage: q("#gamePhotoPreviewImage"), clearGamePhoto: q("#clearGamePhoto"), gameList: q("#gameList"), gameStats: q("#gameStats"),
  meetingForm: q("#meetingForm"), meetingTitle: q("#meetingTitle"), meetingDate: q("#meetingDate"), meetingPlace: q("#meetingPlace"), meetingNote: q("#meetingNote"), meetingList: q("#meetingList"),
  albumForm: q("#albumForm"), photoInput: q("#photoInput"), photoPreview: q("#photoPreview"), photoPreviewImage: q("#photoPreviewImage"), clearPhotoSelection: q("#clearPhotoSelection"), photoCaption: q("#photoCaption"), albumGrid: q("#albumGrid"),
  personOptions: qa(".person-option"), goalForm: q("#goalForm"), goalText: q("#goalText"), goalList: q("#goalList"), goalStats: q("#goalStats"), traitForm: q("#traitForm"), traitType: q("#traitType"), traitText: q("#traitText"), traitList: q("#traitList"), diaryForm: q("#diaryForm"), diaryEditId: q("#diaryEditId"), diaryDate: q("#diaryDate"), diaryMood: q("#diaryMood"), diaryTitle: q("#diaryTitle"), diaryText: q("#diaryText"), diaryList: q("#diaryList"), saveDiary: q("#saveDiary"), cancelDiaryEdit: q("#cancelDiaryEdit"), healthPanel: q("#healthPanel"), waterCount: q("#waterCount"), moveCount: q("#moveCount"), weightValue: q("#weightValue"), weightForm: q("#weightForm"), weightDate: q("#weightDate"), weightInput: q("#weightInput"), weightHistory: q("#weightHistory"), encourageLine: q("#encourageLine"), cycleForm: q("#cycleForm"), cycleStart: q("#cycleStart"), cycleEnd: q("#cycleEnd"), cycleLength: q("#cycleLength"), cycleNextDate: q("#cycleNextDate"), cycleDaysLeft: q("#cycleDaysLeft"), cycleHistory: q("#cycleHistory")
};

window.LoveStateMerge = {
  shared: (localShared, serverShared) => sharedOnly(mergeSharedConcurrent(localShared || {}, serverShared || {}, true)),
  private: (localPrivate, serverPrivate, person) => mergePrivateConcurrent(localPrivate || {}, serverPrivate || {}, person || currentPerson(), true)
};

init();

function init() {
  bindNavigation();
  bindActions();
  bindGardenActions();
  bindSyncEvents();
  setFormDates();
  backupSharedState(state, "页面启动");
  if (refreshGardenProgress("花园开始生长")) writeActiveStateToLocalStorage(state);
  render();
  window.lucide?.createIcons();
  window.LoveSync?.initialize();
  window.setInterval(() => {
    if (lastCapsuleDate !== todayString()) renderDailyCapsule();
  }, 60000);
}

function bindNavigation() {
  els.tabs.forEach((tab) => tab.addEventListener("click", () => {
    activateTab(tab.dataset.tab);
  }));
}

function activateTab(target, scrollTarget) {
  const isTogetherFeature = target === "garden" || target === "wheel" || target === "starBottle";
  const navigationTarget = isTogetherFeature ? "together" : target;
  document.body.classList.toggle("garden-mode", isTogetherFeature);
  els.tabs.forEach((item) => item.classList.toggle("is-active", item.dataset.tab === navigationTarget));
  els.screens.forEach((screen) => screen.classList.toggle("is-active", screen.id === target));
  if (scrollTarget) {
    window.setTimeout(() => scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openGarden(from) {
  gardenReturnTab = from;
  gardenReturnScroll = window.scrollY;
  activateTab("garden");
}

function closeGarden() {
  const returnTo = gardenReturnTab === "together" ? "together" : "home";
  activateTab(returnTo);
  window.setTimeout(() => window.scrollTo({ top: gardenReturnScroll, behavior: "auto" }), 90);
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
  els.openWheel.addEventListener("click", () => {
    activateTab("wheel");
    renderWheel();
  });
  els.closeWheel.addEventListener("click", () => activateTab("together", els.openWheel));
  els.openStarBottle.addEventListener("click", () => {
    activateTab("starBottle");
    window.dispatchEvent(new CustomEvent("love-star-bottle-open"));
  });
  els.closeStarBottle.addEventListener("click", () => activateTab("together", els.openStarBottle));
  qa("[data-history-toggle]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.historyToggle;
    historyExpanded[key] = !historyExpanded[key];
    renderHistorySection(key);
  }));
  els.saveMood.addEventListener("click", () => {
    const person = state.writer;
    state.moods[person] = { feeling: selectedMood, note: els.moodNote.value.trim() || "今天也在想你", updatedAt: new Date().toISOString() };
    els.moodDialog.close();
    persistAndRender();
  });
  els.sendMiss.addEventListener("click", async () => {
    if (!window.LoveSync?.isConnected()) {
      els.missHint.textContent = "登录并进入两人空间后，想念才能抵达对方。";
      return;
    }
    els.sendMiss.disabled = true;
    els.sendMiss.classList.remove("is-sent");
    try {
      const stats = await window.LoveSync.sendMiss();
      if (stats) missStats = normalizeMissStats(stats);
      renderMissStats();
      els.sendMiss.classList.add("is-sent");
      els.missHint.textContent = `这一次想念已经送给${people[otherPerson(currentPerson())].short}。`;
      navigator.vibrate?.(35);
      window.setTimeout(() => els.sendMiss.classList.remove("is-sent"), 650);
    } catch (error) {
      els.missHint.textContent = syncFeatureError(error, "想你信号");
    } finally {
      els.sendMiss.disabled = false;
    }
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
    const createdAt = new Date().toISOString();
    state.messages.unshift({ id: uid(), person: state.writer, text, date: todayString(), createdAt, updatedAt: createdAt });
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
    const person = currentPerson();
    state.dailyQuestion.answers[person] = answer;
    state.dailyQuestion.answerUpdatedAt = { ...(state.dailyQuestion.answerUpdatedAt || {}), [person]: new Date().toISOString() };
    els.questionAnswer.value = "";
    persistAndRender();
  });
  els.recordVoice.addEventListener("click", () => {
    if (voiceRecorder?.state === "recording") stopVoiceRecording();
    else startVoiceRecording();
  });
  els.discardVoice.addEventListener("click", clearVoiceDraft);
  els.sendVoice.addEventListener("click", sendVoiceDraft);
  els.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.taskText.value.trim();
    if (!text) return;
    state.tasks.unshift({ id: uid(), text, doneBy: [], doneState: {}, updatedAt: new Date().toISOString() });
    els.taskForm.reset();
    persistAndRender();
  });
  els.achievementFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-achievement-filter]");
    if (!button) return;
    activeAchievementFilter = button.dataset.achievementFilter;
    achievementsExpanded = false;
    els.achievementFilter.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
    renderAchievements();
  });
  els.achievementMore.addEventListener("click", () => {
    achievementsExpanded = !achievementsExpanded;
    renderAchievements();
  });
  els.achievementForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.achievementText.value.trim();
    if (!text) return;
    state.achievements.custom.unshift({ id: `custom-${uid()}`, text, createdAt: todayString(), updatedAt: new Date().toISOString() });
    els.achievementForm.reset();
    activeAchievementFilter = "all";
    achievementsExpanded = false;
    els.achievementFilter.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item.dataset.achievementFilter === "all"));
    persistAndRender();
  });
  els.saveAchievementEdit.addEventListener("click", () => {
    const id = els.achievementEditId.value;
    const text = els.achievementEditText.value.trim();
    if (!id || !text) return;
    const custom = state.achievements.custom.find((item) => item.id === id);
    if (custom) {
      custom.text = text;
      custom.updatedAt = new Date().toISOString();
    }
    else {
      const original = achievementDefinitions.find((item) => item.id === id)?.text;
      if (text === original) delete state.achievements.edits[id];
      else state.achievements.edits[id] = text;
    }
    els.achievementEditDialog.close();
    persistAndRender();
  });
  els.noteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.noteText.value.trim();
    if (!text) return;
    const createdAtTime = new Date().toISOString();
    state.loveNotes.unshift({
      id: uid(), from: currentPerson(), to: els.noteReceiver.value,
      text, unlockDate: els.noteUnlockDate.value || todayString(), createdAt: todayString(), createdAtTime, opened: false, updatedAt: createdAtTime
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
    const createdAt = new Date().toISOString();
    state.studyLogs.unshift({
      id: uid(), person: currentPerson(), content, minutes,
      date: els.studyDate.value || todayString(), note: els.studyNote.value.trim(), createdAt, updatedAt: createdAt
    });
    els.studyForm.reset();
    setFormDates();
    persistAndRender();
  });
  els.gameForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const game = els.gameName.value.trim();
    const achievement = els.gameAchievement.value.trim();
    const date = els.gameDate.value;
    if (!game || !achievement || !date) return;
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "保存中...";
    try {
      const file = els.gamePhotoInput.files[0];
      const image = file ? await shrinkImage(file) : "";
      const createdAt = new Date().toISOString();
      state.gameRecords.unshift({ id: uid(), date, game, achievement, image, createdAt, updatedAt: createdAt });
      els.gameForm.reset();
      clearGamePhotoPreview();
      setFormDates();
      persistAndRender();
    } catch {
      window.alert("这张图片暂时无法读取，请换一张图片后再试。");
    } finally {
      button.disabled = false;
      button.textContent = "保存游戏记录";
    }
  });
  els.gamePhotoInput.addEventListener("change", () => showGamePhotoPreview(els.gamePhotoInput.files[0]));
  els.clearGamePhoto.addEventListener("click", () => {
    els.gamePhotoInput.value = "";
    clearGamePhotoPreview();
  });
  els.meetingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = els.meetingTitle.value.trim();
    const date = els.meetingDate.value;
    if (!title || !date) return;
    const createdAt = new Date().toISOString();
    state.meetings.unshift({ id: uid(), title, date, place: els.meetingPlace.value.trim(), note: els.meetingNote.value.trim(), planned: date >= todayString(), createdAt, updatedAt: createdAt });
    els.meetingForm.reset();
    persistAndRender();
  });
  els.albumForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = els.photoInput.files[0];
    if (!file) return;
    const src = await shrinkImage(file);
    const createdAt = new Date().toISOString();
    state.photos.unshift({ id: uid(), src, caption: els.photoCaption.value.trim() || "我们的一个瞬间", date: todayString(), person: state.writer, createdAt, updatedAt: createdAt });
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
  els.goalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.goalText.value.trim();
    if (!text) return;
    privateSpace().goals.unshift({ id: uid(), text, completed: false, completedAt: "", createdAt: todayString(), updatedAt: new Date().toISOString() });
    els.goalForm.reset();
    persistAndRender();
  });
  els.traitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.traitText.value.trim();
    if (!text) return;
    privateSpace().traits.unshift({ id: uid(), type: els.traitType.value, text, updatedAt: new Date().toISOString() });
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
    const next = { title, text, mood: els.diaryMood.value.trim(), date: els.diaryDate.value || todayString(), updatedAt: new Date().toISOString() };
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
    const createdAt = new Date().toISOString();
    privateSpace().health.weights.unshift({ id: uid(), value, date: els.weightDate.value || todayString(), createdAt, updatedAt: createdAt });
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
    const createdAt = new Date().toISOString();
    cycles.unshift({ id: uid(), start, end, length, createdAt, updatedAt: createdAt });
    els.cycleForm.reset();
    els.cycleLength.value = "28";
    persistAndRender();
  });
  bindWheelActions();
}

function bindGardenActions() {
  els.openGardenHome.addEventListener("click", () => openGarden("home"));
  els.openGardenTogether.addEventListener("click", () => openGarden("together"));
  els.closeGarden.addEventListener("click", closeGarden);
  els.gardenTools.addEventListener("click", (event) => {
    const button = event.target.closest("[data-garden-panel]");
    if (!button) return;
    activeGardenPanel = button.dataset.gardenPanel;
    renderGardenPanels();
  });
  els.gardenAreaMap.addEventListener("click", (event) => {
    const button = event.target.closest("[data-garden-area]");
    if (!button || button.disabled) return;
    const area = gardenAreaDefinitions.find((item) => item.id === button.dataset.gardenArea);
    if (!area) return;
    activeGardenPanel = area.panel;
    renderGardenPanels();
    els.gardenTools.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  els.gardenDecorationList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-garden-decoration]");
    if (!button || button.disabled) return;
    const garden = gardenState();
    const item = gardenDecorations.find((entry) => entry.id === button.dataset.gardenDecoration);
    if (!item) return;
    const now = new Date().toISOString();
    const enabled = !garden.decorationStates[item.id]?.enabled;
    if (enabled) {
      gardenDecorations.filter((entry) => entry.slot === item.slot && entry.id !== item.id).forEach((entry) => {
        garden.decorationStates[entry.id] = { enabled: false, updatedAt: now };
      });
    }
    garden.decorationStates[item.id] = { enabled, updatedAt: now };
    garden.decorationUpdatedAt = now;
    persistAndRender(enabled ? `布置${item.name}` : `收起${item.name}`);
  });
  els.waterGarden.addEventListener("click", () => {
    const person = currentPerson();
    const garden = gardenState();
    const date = todayString();
    const watered = new Set(garden.waterings[date] || []);
    if (watered.has(person)) {
      els.gardenNotice.textContent = "今天已经浇过水啦，等对方来一起照顾它。";
      return;
    }
    watered.add(person);
    garden.waterings[date] = [...watered];
    Object.keys(garden.waterings).sort().slice(0, -120).forEach((key) => delete garden.waterings[key]);
    els.gardenNotice.textContent = watered.size === 2 ? "两份心意都到了，花园今天会更明亮。" : "这份心意已经留在土壤里。";
    els.gardenStage.classList.add("is-watering");
    window.setTimeout(() => els.gardenStage.classList.remove("is-watering"), 900);
    navigator.vibrate?.(30);
    persistAndRender("双人浇水");
  });
  els.gardenCompanionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = els.gardenCompanionName.value.trim();
    if (!name) return;
    const plant = gardenState().companionPlant;
    plant.name = name;
    plant.species = els.gardenCompanionSpecies.value;
    plant.createdAt = plant.createdAt || new Date().toISOString();
    plant.updatedAt = new Date().toISOString();
    persistAndRender(plant.care && Object.keys(plant.care).length ? "为共育植物换了新名字" : "种下双人共育植物");
  });
  els.gardenCompanionCare.addEventListener("click", () => {
    const plant = gardenState().companionPlant;
    if (!plant.name) {
      els.gardenNotice.textContent = "先给你们的共育植物取一个名字吧。";
      activeGardenPanel = "together";
      renderGardenPanels();
      els.gardenCompanionName.focus();
      return;
    }
    const date = todayString();
    const cared = new Set(plant.care?.[date] || []);
    cared.add(currentPerson());
    plant.care = { ...(plant.care || {}), [date]: [...cared] };
    Object.keys(plant.care).sort().slice(0, -180).forEach((key) => delete plant.care[key]);
    plant.updatedAt = new Date().toISOString();
    navigator.vibrate?.(25);
    persistAndRender(cared.size === 2 ? "共同照顾共育植物" : "照顾共育植物");
  });
  els.gardenQuestList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-garden-quest]");
    if (!button) return;
    const week = gardenState().weeklyQuests[gardenWeekKey()];
    const quest = week?.items.find((item) => item.id === button.dataset.gardenQuest);
    if (!quest) return;
    const doneBy = new Set(gardenQuestDonePeople(quest));
    const person = currentPerson();
    const done = !doneBy.has(person);
    if (done) doneBy.add(person); else doneBy.delete(person);
    quest.doneBy = [...doneBy];
    quest.doneState = { ...(quest.doneState || {}), [person]: { done, updatedAt: new Date().toISOString() } };
    quest.updatedAt = quest.doneState[person].updatedAt;
    persistAndRender(doneBy.size === 2 ? "共同完成本周花园任务" : "更新本周花园任务");
  });
  els.saveGardenPostcard.addEventListener("click", saveWeeklyGardenPostcard);
  els.gardenSeedForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.gardenSeedText.value.trim();
    const photoId = els.gardenSeedPhoto.value;
    const voiceId = els.gardenSeedVoice.value;
    if (!text && !photoId && !voiceId) return;
    gardenState().seeds.unshift({
      id: uid(), person: currentPerson(), text,
      unlockDate: els.gardenSeedUnlockDate.value || todayString(),
      photoId, voiceId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    });
    els.gardenSeedForm.reset();
    setFormDates();
    els.gardenNotice.textContent = "种子已经埋好，到约定的日子再一起打开。";
    persistAndRender("种下一颗心意");
  });
  els.gardenLetterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.gardenLetterText.value.trim();
    if (!text || !els.gardenLetterDate.value) return;
    gardenState().flowerLetters.unshift({
      id: uid(), person: currentPerson(), text, unlockDate: els.gardenLetterDate.value,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    });
    els.gardenLetterForm.reset();
    setFormDates();
    persistAndRender("寄出一封花期信");
  });
  els.gardenLetterList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-garden-letter]");
    if (!button || !window.confirm("确定移除这封花期信吗？")) return;
    const garden = gardenState();
    garden.deletedIds.push(button.dataset.deleteGardenLetter);
    garden.deletedIds = [...new Set(garden.deletedIds)].slice(-300);
    garden.flowerLetters = garden.flowerLetters.filter((item) => item.id !== button.dataset.deleteGardenLetter);
    persistAndRender("整理花期信箱");
  });
  els.gardenAnniversaryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = els.gardenAnniversaryTitle.value.trim();
    const date = els.gardenAnniversaryDate.value;
    if (!title || !date) return;
    gardenState().anniversaries.unshift({
      id: uid(), title, date, style: els.gardenAnniversaryStyle.value,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    });
    els.gardenAnniversaryForm.reset();
    setFormDates();
    persistAndRender("记下一枚花园纪念日");
  });
  els.gardenAnniversaryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-garden-anniversary]");
    if (!button || !window.confirm("确定移除这个纪念日吗？")) return;
    const garden = gardenState();
    garden.deletedIds.push(button.dataset.deleteGardenAnniversary);
    garden.deletedIds = [...new Set(garden.deletedIds)].slice(-300);
    garden.anniversaries = garden.anniversaries.filter((item) => item.id !== button.dataset.deleteGardenAnniversary);
    persistAndRender("整理花园纪念日");
  });
  els.gardenWishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.gardenWishText.value.trim();
    if (!text) return;
    gardenState().wishes.unshift({
      id: uid(), text, targetDate: els.gardenWishDate.value,
      done: false, completedAt: "", createdAt: todayString(), createdBy: currentPerson(), updatedAt: new Date().toISOString()
    });
    els.gardenWishForm.reset();
    setFormDates();
    els.gardenNotice.textContent = "愿望已经变成花苞，等你们一起让它盛开。";
    persistAndRender("种下愿望花苞");
  });
  els.gardenHybridForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const garden = gardenState();
    const person = currentPerson();
    garden.hybrid.choices[person] = {
      round: garden.hybrid.round,
      color: els.gardenHybridColor.value,
      shape: els.gardenHybridShape.value,
      pattern: els.gardenHybridPattern.value,
      center: els.gardenHybridCenter.value,
      layer: els.gardenHybridLayer.value,
      aura: els.gardenHybridAura.value,
      date: todayString(),
      updatedAt: new Date().toISOString()
    };
    const left = garden.hybrid.choices.liu;
    const right = garden.hybrid.choices.fu;
    if (left && right) {
      garden.hybrid.blooms.unshift({
        id: `garden-bloom-${garden.hybrid.round}`, round: garden.hybrid.round, date: todayString(), updatedAt: new Date().toISOString(), left, right,
        name: `${gardenColorNames[left.color]}与${gardenColorNames[right.color]}的第${garden.hybrid.round}朵花`
      });
      garden.hybrid.round += 1;
      garden.hybrid.choices = { liu: null, fu: null };
      els.gardenNotice.textContent = "两个人的选择相遇了，一朵新的双色花已经盛开。";
    } else {
      els.gardenNotice.textContent = "你的花瓣已经选好，正在等待对方完成这一朵花。";
    }
    persistAndRender("培育双色花");
  });
  [els.gardenHybridColor, els.gardenHybridShape, els.gardenHybridPattern, els.gardenHybridCenter, els.gardenHybridLayer, els.gardenHybridAura].forEach((select) => select.addEventListener("change", renderGardenHybridPreview));
  els.toggleGardenBlooms.addEventListener("click", () => {
    gardenBloomsExpanded = !gardenBloomsExpanded;
    renderGardenFlowers();
  });
  els.gardenYearbookSeason.addEventListener("change", () => {
    activeYearbookKey = els.gardenYearbookSeason.value;
    renderGardenYearbook();
  });
  els.gardenYearbookHighlight.addEventListener("change", () => {
    const key = els.gardenYearbookSeason.value;
    if (!key) return;
    gardenState().yearbookHighlights[key] = { memoryId: els.gardenYearbookHighlight.value, updatedAt: new Date().toISOString() };
    persistAndRender("保存四季年鉴回忆");
  });
  els.saveGardenYearbook.addEventListener("click", saveGardenYearbook);
  els.gardenButterfly.addEventListener("click", () => {
    const memory = gardenDailyMemory();
    els.gardenMemoryTitle.textContent = memory?.title || "今天还没有找到回忆";
    els.gardenMemoryText.textContent = memory?.copy || "再多存下一些照片、留言和见面记录，蝴蝶就会带着它们回来。";
    els.gardenMemoryReveal.hidden = false;
  });
  els.closeGardenMemory.addEventListener("click", () => { els.gardenMemoryReveal.hidden = true; });
  els.gardenMemoryFlowers.addEventListener("click", (event) => {
    const button = event.target.closest("[data-garden-memory]");
    if (button) openGardenMemory(button.dataset.gardenMemory);
  });
  els.closeGardenMemoryDialog.addEventListener("click", () => els.gardenMemoryDialog.close());
  els.gardenMemoryDialog.addEventListener("click", (event) => { if (event.target === els.gardenMemoryDialog) els.gardenMemoryDialog.close(); });
  [els.gardenSeedPhoto, els.gardenSeedVoice].forEach((select) => select.addEventListener("blur", () => {
    if (!gardenSeedOptionsPending) return;
    gardenSeedOptionsPending = false;
    renderGardenSeedOptions();
  }));
}

function focusedDraftContext(element) {
  if (!element) return "";
  if (element === els.questionAnswer) return `question:${state.dailyQuestion?.id || ""}:${currentPerson()}`;
  if (element.dataset?.wheelOption) return `wheel-option:${element.dataset.wheelOption}`;
  return element.id ? `field:${element.id}` : "";
}

function captureFocusedDraft() {
  const element = document.activeElement;
  if (!element?.matches?.("input, textarea, select") || element.type === "file" || element.type === "checkbox" || element.type === "radio") return null;
  const selector = element.id
    ? `#${window.CSS?.escape ? window.CSS.escape(element.id) : element.id}`
    : (element.dataset?.wheelOption ? `[data-wheel-option="${element.dataset.wheelOption}"]` : "");
  const context = focusedDraftContext(element);
  if (!selector || !context) return null;
  return {
    selector, context, value: element.value,
    selectionStart: typeof element.selectionStart === "number" ? element.selectionStart : null,
    selectionEnd: typeof element.selectionEnd === "number" ? element.selectionEnd : null
  };
}

function restoreFocusedDraft(draft) {
  if (!draft) return;
  const element = q(draft.selector);
  if (!element || focusedDraftContext(element) !== draft.context) return;
  element.value = draft.value;
  element.focus({ preventScroll: true });
  if (draft.selectionStart !== null && element.setSelectionRange) element.setSelectionRange(draft.selectionStart, draft.selectionEnd);
}

function bindSyncEvents() {
  window.addEventListener("love-local-storage-error", () => {
    const status = q("#syncStatus");
    const connectedText = q("#syncConnectedText");
    if (status) status.textContent = "本机缓存空间不足，本次记录仍会继续同步到云端";
    if (connectedText) connectedText.textContent = "已自动清理可重建缓存；请保持页面打开，等待显示已同步。";
  });
  window.addEventListener("love-sync-status", (event) => {
    const { connected, role, needsPairing } = event.detail;
    els.pairingNotice.hidden = !needsPairing;
    if (!connected) {
      missStats = emptyMissStats();
      voiceMessages = [];
      renderMissStats();
      renderVoiceMessages();
    }
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
  window.addEventListener("love-miss-stats", (event) => {
    missStats = normalizeMissStats(event.detail);
    renderMissStats();
    commitExternalGardenGrowth("想你信号");
  });
  window.addEventListener("love-voice-messages", (event) => {
    voiceMessages = Array.isArray(event.detail) ? event.detail : [];
    renderVoiceMessages();
    commitExternalGardenGrowth("声音信箱");
  });
  window.addEventListener("love-sync-feature-error", (event) => {
    const { feature, message } = event.detail || {};
    if (feature === "voice") els.voiceNotice.textContent = message;
    if (feature === "miss") els.missHint.textContent = message;
  });
  window.addEventListener("love-sync-remote", (event) => {
    const focusedDraft = captureFocusedDraft();
    const { shared, privateData, role, initializeEmptySpace, partialShared, suppressResync } = event.detail;
    if (shared) backupSharedState(state, "接收云端数据前");
    const recoveryNeeded = Boolean(shared && !partialShared && !initializeEmptySpace && shouldRecoverSharedState(state, shared));
    const safeShared = recoveryNeeded ? mergeRecoverySharedState(state, shared) : shared;
    const mergedShared = safeShared ? mergeSharedConcurrent(state, safeShared, false, Boolean(partialShared)) : safeShared;
    const next = {
      ...state,
      ...(mergedShared || {}),
      writer: role || state.writer,
      privatePerson: role || state.privatePerson,
      private: { ...state.private }
    };
    if (privateData && role) next.private[role] = mergePrivateConcurrent(state.private?.[role], privateData, role);
    state = mergeDefaults(next);
    if (shared?.garden && Number(shared.garden.version || 1) < 2) {
      state.garden.baselinePoints = Math.max(Number(state.garden.baselinePoints || 0), Number(shared.garden.points || 0));
      state.garden.migrationComplete = false;
    }
    saveLocalAndRender();
    restoreFocusedDraft(focusedDraft);
    if (suppressResync) {
      gardenNeedsResync = false;
      sharedNeedsResync = false;
    } else if (initializeEmptySpace || recoveryNeeded || (!partialShared && shared && !shared.garden) || (!partialShared && shared?.garden && Number(shared.garden.version || 1) < 2) || gardenNeedsResync || sharedNeedsResync) {
      gardenNeedsResync = false;
      sharedNeedsResync = false;
      window.LoveSync?.scheduleSave(state);
    }
    if (recoveryNeeded) {
      window.setTimeout(() => {
        const connectedText = q("#syncConnectedText");
        if (connectedText) connectedText.textContent = "检测到云端公共数据异常，已使用本机旧数据自动恢复并重新同步。";
      }, 50);
    }
  });
}

function render() {
  renderDays();
  renderPresence();
  renderDailyCapsule();
  renderMoods();
  renderMissStats();
  renderMeetingCountdown();
  renderGarden();
  renderMessages();
  renderQuestion();
  renderVoiceMessages();
  renderTasks();
  renderWheel();
  renderLoveNotes();
  renderStudyLogs();
  renderGameRecords();
  renderMeetings();
  renderAchievements();
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

function renderDailyCapsule() {
  const date = todayString();
  let hash = 0;
  for (const char of date) hash = ((hash * 31) + char.charCodeAt(0)) >>> 0;
  const capsule = dailyCapsules[hash % dailyCapsules.length];
  lastCapsuleDate = date;
  els.capsuleType.textContent = capsule.type;
  els.capsuleDate.textContent = `${parseDate(date).getMonth() + 1}月${parseDate(date).getDate()}日`;
  els.capsuleDate.dateTime = date;
  els.capsuleText.textContent = capsule.text;
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

function emptyMissStats() {
  return { liu: { total: 0, today: 0 }, fu: { total: 0, today: 0 } };
}

function normalizeMissStats(value) {
  const empty = emptyMissStats();
  return {
    ...empty,
    liu: { total: Number(value?.liu?.total) || 0, today: Number(value?.liu?.today) || 0 },
    fu: { total: Number(value?.fu?.total) || 0, today: Number(value?.fu?.today) || 0 }
  };
}

function otherPerson(person) { return person === "liu" ? "fu" : "liu"; }

function renderMissStats() {
  const person = currentPerson();
  const other = otherPerson(person);
  const sent = missStats[person] || { total: 0, today: 0 };
  const received = missStats[other] || { total: 0, today: 0 };
  els.missSentLabel.textContent = `我想${people[other].short}`;
  els.missReceivedLabel.textContent = `${people[other].short}想我`;
  els.missSentTotal.textContent = sent.total;
  els.missSentToday.textContent = sent.today;
  els.missReceivedTotal.textContent = received.total;
  els.missReceivedToday.textContent = received.today;
}

function renderVoiceMessages() {
  els.voiceCount.textContent = `${voiceMessages.length} 封`;
  const visibleMessages = visibleHistoryItems("voices", voiceMessages);
  if (!voiceMessages.length) return renderEmpty(els.voiceList, "第一封心声，等一句熟悉的声音。");
  els.voiceList.replaceChildren(...visibleMessages.map((message) => {
    const node = document.createElement("article");
    node.className = `voice-message ${message.role === "fu" ? "fu" : "liu"}`;
    const own = message.role === currentPerson();
    const date = new Date(message.created_at);
    const player = message.signedUrl
      ? `<audio controls preload="none" src="${escapeHTML(message.signedUrl)}"></audio>`
      : `<span class="voice-refreshing">正在更新播放链接...</span>`;
    node.innerHTML = `<header><span>${people[message.role]?.name || "我们"}</span><time>${formatDateTime(date)}</time>${own ? `<button class="delete-button" data-delete-voice="${message.id}" data-storage-path="${escapeHTML(message.storage_path)}" type="button" aria-label="删除语音">×</button>` : ""}</header><div class="voice-message-body"><span class="voice-duration">${formatDuration(Number(message.duration_seconds) || 0)}</span>${player}</div>`;
    return node;
  }));
  els.voiceList.querySelectorAll("[data-delete-voice]").forEach((button) => button.addEventListener("click", async () => {
    if (!window.confirm("确定删除这封心声吗？")) return;
    button.disabled = true;
    els.voiceNotice.textContent = "正在删除...";
    try {
      await window.LoveSync.deleteVoice(button.dataset.deleteVoice, button.dataset.storagePath);
      els.voiceNotice.textContent = "这封心声已经删除。";
    } catch (error) {
      els.voiceNotice.textContent = syncFeatureError(error, "心声信箱");
      button.disabled = false;
    }
  }));
}

async function startVoiceRecording() {
  if (!window.LoveSync?.isConnected()) {
    els.voiceNotice.textContent = "登录并进入两人空间后才能保存语音。";
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    els.voiceNotice.textContent = "当前浏览器不支持网页录音，请使用手机系统浏览器打开。";
    return;
  }
  clearVoiceDraft();
  try {
    voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const preferredTypes = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"];
    const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported?.(type));
    voiceRecorder = new MediaRecorder(voiceStream, mimeType ? { mimeType, audioBitsPerSecond: 64000 } : undefined);
    voiceChunks = [];
    voiceStartedAt = Date.now();
    voiceRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size) voiceChunks.push(event.data);
    });
    voiceRecorder.addEventListener("stop", finishVoiceRecording, { once: true });
    voiceRecorder.start(250);
    els.voiceNotice.textContent = "";
    setVoiceRecordingUi(true);
    updateVoiceTimer();
    voiceTimer = window.setInterval(updateVoiceTimer, 250);
    voiceStopTimer = window.setTimeout(stopVoiceRecording, 90000);
  } catch (error) {
    cleanupVoiceStream();
    els.voiceNotice.textContent = error?.name === "NotAllowedError"
      ? "没有获得麦克风权限，请在浏览器设置中允许后重试。"
      : "暂时无法启动录音，请检查麦克风是否被其他应用占用。";
  }
}

function stopVoiceRecording() {
  if (voiceRecorder?.state === "recording") voiceRecorder.stop();
  window.clearInterval(voiceTimer);
  window.clearTimeout(voiceStopTimer);
  voiceTimer = null;
  voiceStopTimer = null;
  setVoiceRecordingUi(false);
  cleanupVoiceStream();
}

function finishVoiceRecording() {
  const duration = Math.min(90, Math.max(1, Math.round((Date.now() - voiceStartedAt) / 1000)));
  const mimeType = voiceRecorder?.mimeType || voiceChunks[0]?.type || "audio/webm";
  const blob = new Blob(voiceChunks, { type: mimeType });
  voiceRecorder = null;
  voiceChunks = [];
  if (!blob.size) {
    els.voiceNotice.textContent = "没有录到声音，请重新录制。";
    return;
  }
  voiceDraft = { blob, duration, mimeType };
  voiceDraftUrl = URL.createObjectURL(blob);
  els.voicePreview.src = voiceDraftUrl;
  els.voiceDraft.hidden = false;
  els.voiceRecordStatus.textContent = "录音完成，可以先试听";
  els.voiceRecordTimer.textContent = `${formatDuration(duration)} · 待发送`;
}

function setVoiceRecordingUi(recording) {
  els.recordVoice.classList.toggle("is-recording", recording);
  els.recordVoice.setAttribute("aria-label", recording ? "停止录音" : "开始录音");
  els.recordVoice.title = recording ? "停止录音" : "开始录音";
  els.recordVoice.innerHTML = `<i data-lucide="${recording ? "square" : "mic"}" aria-hidden="true"></i>`;
  els.voiceRecordStatus.textContent = recording ? "正在录音" : "按下麦克风，留一段声音";
  if (!recording && !voiceDraft) els.voiceRecordTimer.textContent = "最长 01:30";
  window.lucide?.createIcons();
}

function updateVoiceTimer() {
  const seconds = Math.min(90, Math.floor((Date.now() - voiceStartedAt) / 1000));
  els.voiceRecordTimer.textContent = `${formatDuration(seconds)} / 01:30`;
}

function cleanupVoiceStream() {
  voiceStream?.getTracks().forEach((track) => track.stop());
  voiceStream = null;
}

function clearVoiceDraft() {
  if (voiceDraftUrl) URL.revokeObjectURL(voiceDraftUrl);
  voiceDraftUrl = "";
  voiceDraft = null;
  els.voicePreview.pause();
  els.voicePreview.removeAttribute("src");
  els.voiceDraft.hidden = true;
  els.voiceRecordStatus.textContent = "按下麦克风，留一段声音";
  els.voiceRecordTimer.textContent = "最长 01:30";
}

async function sendVoiceDraft() {
  if (!voiceDraft) return;
  els.sendVoice.disabled = true;
  els.discardVoice.disabled = true;
  els.sendVoice.textContent = "存入中...";
  els.voiceNotice.textContent = "正在把声音安全地存入信箱...";
  try {
    await window.LoveSync.uploadVoice(voiceDraft.blob, voiceDraft.duration, voiceDraft.mimeType);
    clearVoiceDraft();
    els.voiceNotice.textContent = "心声已经送达。";
  } catch (error) {
    els.voiceNotice.textContent = syncFeatureError(error, "心声信箱");
  } finally {
    els.sendVoice.disabled = false;
    els.discardVoice.disabled = false;
    els.sendVoice.textContent = "存入信箱";
  }
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

function gardenState() { return state.garden; }

function gardenStageIndex(points) {
  let index = 0;
  gardenStages.forEach((stage, stageIndex) => { if (points >= stage.min) index = stageIndex; });
  return index;
}

function gardenPointCandidates() {
  const garden = gardenState();
  const events = [];
  const add = (key, category, points, label, date = todayString(), options = {}) => events.push({ key, category, points, label, date, ...options });

  Object.entries(garden.waterings || {}).forEach(([date, peopleWhoWatered]) => {
    const watered = [...new Set(peopleWhoWatered || [])].filter((person) => people[person]);
    watered.forEach((person) => add(`watering-${date}-${person}`, "watering", 1, `${people[person].short}完成今日浇水`, date));
    if (watered.length === 2) add(`watering-${date}-pair`, "watering", 4, "两个人共同完成今日浇水", date);
  });

  const question = state.dailyQuestion || {};
  const answered = Object.keys(people).filter((person) => question.answers?.[person]?.trim());
  answered.forEach((person) => add(`question-${question.id}-${person}`, "question", 3, `${people[person].short}回答每日问题`, question.date || todayString()));
  if (question.id && answered.length === 2) add(`question-${question.id}-pair`, "question", 2, "两个人完成同一道每日问题", question.date || todayString());

  const studyPeopleByDate = new Map();
  (state.studyLogs || []).forEach((item) => {
    const person = people[item.person] ? item.person : "shared";
    const date = item.date || todayString();
    add(`study-${item.id}`, "study", 3, `${people[item.person]?.short || "我们"}完成学习打卡`, date, { dailyCap: 1, capScope: person });
    if (people[item.person]) studyPeopleByDate.set(date, new Set([...(studyPeopleByDate.get(date) || []), item.person]));
  });
  studyPeopleByDate.forEach((persons, date) => {
    if (persons.size === 2) add(`study-pair-${date}`, "study", 2, "两个人都完成了今日学习", date);
  });

  (state.messages || []).forEach((item) => add(`message-${item.id}`, "message", 1, `${people[item.person]?.short || "我们"}留下一句共同留言`, item.date || todayString(), { dailyCap: 4, capScope: "shared" }));
  (voiceMessages || []).forEach((item) => {
    const date = localDateString(item.created_at);
    add(`voice-${item.id}`, "voice", 5, `${people[item.role]?.short || "我们"}存入一段声音`, date, { dailyCap: 2, capScope: item.role || "shared" });
  });
  (state.photos || []).forEach((item) => add(`photo-${item.id}`, "photo", 8, `保存照片：${shortGardenLabel(item.caption || "共同回忆")}`, item.date || todayString(), { dailyCap: 3, capScope: "shared" }));
  (state.tasks || []).filter((item) => new Set(item.doneBy || []).size === 2).forEach((item) => add(`task-${item.id}`, "task", 10, `完成双人任务：${shortGardenLabel(item.text)}`, item.completedAt || todayString(), { dailyCap: 3, capScope: "shared" }));
  (state.gameRecords || []).forEach((item) => add(`game-${item.id}`, "game", 12, `记录游戏：${shortGardenLabel(item.game)}`, item.date || todayString(), { dailyCap: 2, capScope: "shared" }));
  (garden.seeds || []).filter((item) => item.unlockDate <= todayString()).forEach((item) => add(`seed-${item.id}`, "seed", 15, "一颗心意种子如约开花", item.unlockDate, { dailyCap: 2, capScope: "shared" }));
  (garden.hybrid?.blooms || []).forEach((item) => add(`bloom-${item.id}`, "bloom", 20, `培育双生花：${shortGardenLabel(item.name)}`, item.date || todayString(), { dailyCap: 1, capScope: "shared" }));

  const customAchievements = new Map((state.achievements?.custom || []).map((item) => [item.id, item.text]));
  Object.entries(state.achievements?.completed || {}).forEach(([id, record]) => {
    if (!achievementIsDone(record)) return;
    const definition = achievementDefinitions.find((item) => item.id === id);
    const title = state.achievements?.edits?.[id] || customAchievements.get(id) || definition?.text || "共同成就";
    const date = typeof record === "string" ? record : record?.date || todayString();
    add(`achievement-${id}`, "achievement", 20, `完成情侣成就：${shortGardenLabel(title)}`, date, { dailyCap: 3, capScope: "shared" });
  });
  (state.meetings || []).filter((item) => item.date && item.date <= todayString()).forEach((item) => add(`meeting-${item.id}`, "meeting", 30, `收藏见面：${shortGardenLabel(item.title)}`, item.date));
  (garden.wishes || []).filter((item) => item.done).forEach((item) => add(`wish-${item.id}`, "wish", 35, `共同愿望盛开：${shortGardenLabel(item.text)}`, item.completedAt || todayString(), { dailyCap: 1, capScope: "shared" }));
  Object.entries(garden.companionPlant?.care || {}).forEach(([date, peopleWhoCared]) => {
    const cared = [...new Set(peopleWhoCared || [])].filter((person) => people[person]);
    cared.forEach((person) => add(`co-plant-${date}-${person}`, "coPlant", 2, `${people[person].short}照顾共育植物`, date));
    if (cared.length === 2) add(`co-plant-${date}-pair`, "coPlant", 4, "两个人共同照顾共育植物", date);
  });
  Object.values(garden.weeklyQuests || {}).flatMap((week) => week?.items || []).filter((item) => gardenQuestDonePeople(item).length === 2).forEach((item) => {
    add(`garden-quest-${item.id}`, "gardenQuest", 12, `完成花园任务：${shortGardenLabel(item.text)}`, item.updatedAt ? localDateString(item.updatedAt) : todayString(), { dailyCap: 3, capScope: "shared" });
  });
  (garden.flowerLetters || []).filter((item) => item.unlockDate <= todayString()).forEach((item) => {
    add(`flower-letter-${item.id}`, "flowerLetter", 10, "一封花期信如约盛开", item.unlockDate, { dailyCap: 2, capScope: "shared" });
  });
  return events.filter((event) => event.key && event.date);
}

function effectiveGardenPointEvents(events = gardenState().pointEvents || []) {
  const counts = new Map();
  return [...events].sort((a, b) => `${a.createdAt || a.date}-${a.id}`.localeCompare(`${b.createdAt || b.date}-${b.id}`)).filter((event) => {
    if (!event.dailyCap) return true;
    const scope = `${event.category}-${event.date}-${event.capScope || "shared"}`;
    const count = counts.get(scope) || 0;
    if (count >= event.dailyCap) return false;
    counts.set(scope, count + 1);
    return true;
  });
}

function creditGardenPointEvents() {
  const garden = gardenState();
  const candidates = gardenPointCandidates();
  if (!garden.migrationComplete) {
    garden.version = 3;
    garden.pointEvents = Array.isArray(garden.pointEvents) ? garden.pointEvents : [];
    garden.baselinePoints = Math.max(0, Number(garden.baselinePoints || (garden.pointEvents.length ? 0 : garden.points) || 0));
    garden.creditedKeys = [...new Set([...(garden.creditedKeys || []), ...garden.pointEvents.map((item) => item.key), ...candidates.map((item) => item.key)])];
    garden.migrationComplete = true;
    garden.lastStage = gardenStageIndex(garden.baselinePoints);
    if (!garden.snapshots.some((item) => item.reason === "成长规则升级，已有心意值完整保留")) {
      garden.snapshots.unshift({ id: "garden-v2-migration", stage: garden.lastStage, points: garden.baselinePoints, date: todayString(), reason: "成长规则升级，已有心意值完整保留", updatedAt: new Date().toISOString() });
    }
    return true;
  }

  const credited = new Set(garden.creditedKeys || []);
  let changed = false;
  candidates.forEach((candidate) => {
    if (credited.has(candidate.key)) return;
    credited.add(candidate.key);
    const event = { id: candidate.key, ...candidate, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const accepted = effectiveGardenPointEvents([...(garden.pointEvents || []), event]).some((item) => item.id === event.id);
    if (accepted) garden.pointEvents.push(event);
    changed = true;
  });
  garden.creditedKeys = [...credited];
  return changed;
}

function calculateGardenPoints() {
  const garden = gardenState();
  const earned = effectiveGardenPointEvents().reduce((sum, event) => sum + Number(event.points || 0), 0);
  return Math.max(0, Math.round(Number(garden.baselinePoints || 0) + earned));
}

function refreshGardenProgress(reason) {
  const garden = gardenState();
  let changed = ensureGardenWeek();
  changed = creditGardenPointEvents() || changed;
  const calculated = calculateGardenPoints();
  const points = Math.max(Number(garden.points || 0), calculated);
  const previousStage = Math.min(gardenStages.length - 1, Number(garden.lastStage || 0));
  const nextStage = gardenStageIndex(points);
  changed = changed || points !== garden.points;
  garden.points = points;
  if (!garden.snapshots.length) {
    garden.snapshots.push({ id: uid(), stage: 0, points, date: todayString(), reason: "属于你们的花园被轻轻种下" });
    changed = true;
  }
  if (nextStage > previousStage) {
    for (let index = previousStage + 1; index <= nextStage; index += 1) {
      garden.snapshots.unshift({ id: uid(), stage: index, points, date: todayString(), reason: reason || gardenStages[index].copy });
    }
    garden.lastStage = nextStage;
    changed = true;
  }
  const areas = ["main"];
  if (points >= 900) areas.push("memory-corner");
  if (points >= 2000) areas.push("glasshouse");
  if (points >= 2800) areas.push("flower-path");
  if (points >= 3400) areas.push("starlight-yard");
  if (areas.join("|") !== (garden.unlockedAreas || []).join("|")) {
    garden.unlockedAreas = areas;
    changed = true;
  }
  return changed;
}

function commitExternalGardenGrowth(reason) {
  const changed = refreshGardenProgress(reason);
  renderGarden();
  if (!changed) return;
  window.LoveSync?.scheduleSave(state);
  writeActiveStateToLocalStorage(state);
}

function gardenWeekKey(date = new Date()) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = monday.getDay() || 7;
  monday.setDate(monday.getDate() - weekday + 1);
  return localDateString(monday);
}

function ensureGardenWeek() {
  const garden = gardenState();
  garden.weeklyQuests = garden.weeklyQuests && typeof garden.weeklyQuests === "object" ? garden.weeklyQuests : {};
  const key = gardenWeekKey();
  if (garden.weeklyQuests[key]?.items?.length === 3) return false;
  const seed = [...key].reduce((sum, character) => (sum * 31 + character.charCodeAt(0)) % 100000, 17);
  const indexes = [];
  for (let offset = 0; indexes.length < 3; offset += 1) {
    const index = (seed + offset * 7 + offset * offset) % gardenQuestPool.length;
    if (!indexes.includes(index)) indexes.push(index);
  }
  garden.weeklyQuests[key] = {
    id: `garden-week-${key}`, weekKey: key, createdAt: new Date().toISOString(),
    items: indexes.map((index, order) => ({ id: `garden-quest-${key}-${order + 1}`, text: gardenQuestPool[index], doneBy: [], updatedAt: "" }))
  };
  Object.keys(garden.weeklyQuests).sort().slice(0, -26).forEach((oldKey) => delete garden.weeklyQuests[oldKey]);
  return true;
}

function gardenQuestDonePeople(item) {
  if (!item?.doneState || typeof item.doneState !== "object") return [...new Set(item?.doneBy || [])];
  return Object.keys(people).filter((person) => item.doneState[person]?.done);
}

function gardenSeasonInfo(date = new Date()) {
  const month = date.getMonth() + 1;
  const hour = date.getHours();
  const season = month >= 3 && month <= 5 ? "spring" : month >= 6 && month <= 8 ? "summer" : month >= 9 && month <= 11 ? "autumn" : "winter";
  const seasonName = { spring: "春日", summer: "盛夏", autumn: "金秋", winter: "冬日" }[season];
  const time = hour < 6 || hour >= 19 ? "night" : hour < 10 ? "morning" : hour < 17 ? "day" : "sunset";
  const timeName = { night: "星夜", morning: "晨光", day: "晴昼", sunset: "晚霞" }[time];
  return { season, seasonName, time, timeName };
}

function gardenAnniversaryToday() {
  const today = todayString().slice(5);
  const custom = (gardenState().anniversaries || []).find((item) => item.date?.slice(5) === today);
  if (custom) return custom;
  if (state.startDate?.slice(5) === today) return { id: "love-anniversary", title: "我们的恋爱纪念日", date: state.startDate, style: "petals" };
  return null;
}

function gardenWeather() {
  const feelings = Object.values(state.moods || {}).map((item) => item?.feeling || "").join(" ");
  const hour = new Date().getHours();
  if (hour >= 19 || hour < 6) return { id: "night", label: "星光花园" };
  if (/难过|失落|委屈|低落|孤单|焦虑/.test(feelings)) return { id: "rain", label: "温柔细雨" };
  if (/累|困|休息|安静/.test(feelings)) return { id: "breeze", label: "轻柔微风" };
  if (/心动|期待|撒娇|想你/.test(feelings)) return { id: "sunset", label: "玫瑰晚霞" };
  return { id: "morning", label: "晴朗晨光" };
}

function gardenLeafSvg(x, y, rotation, scale = 1, color = "#75a77e", stemIndex = 0) {
  return `<g class="garden-svg-leaf" data-stem-index="${stemIndex}" transform="translate(${x} ${y}) rotate(${rotation})"><g transform="scale(${scale})"><path class="garden-leaf-petiole" d="M0 0C4-.5 8-1 12-1.5" fill="none" stroke="#4f805d" stroke-width="4" stroke-linecap="round"/><g class="garden-leaf-blade" transform="translate(10 -1.5)"><path d="M0 0C10-21 33-22 45-4C33 13 11 14 0 0Z" fill="${color}"/><path d="M2 0C15-2 27-5 37-9" fill="none" stroke="rgba(255,255,255,.46)" stroke-width="1.9" stroke-linecap="round"/><path d="M17-3L14-9M26-5L23-12" fill="none" stroke="rgba(54,101,67,.2)" stroke-width="1.2" stroke-linecap="round"/></g></g></g>`;
}

function gardenFlowerSvg(x, y, scale, color, accent = "#f4d68d", petals = 8) {
  const light = lightenGardenColor(color);
  const petalMarkup = Array.from({ length: petals }, (_, index) => `<ellipse cx="0" cy="-19" rx="9.8" ry="19.5" fill="${index % 2 ? color : light}" stroke="rgba(92,66,75,.13)" stroke-width=".8" transform="rotate(${index * (360 / petals)})"/>`).join("");
  const innerCount = Math.max(5, petals - 2);
  const innerMarkup = Array.from({ length: innerCount }, (_, index) => `<ellipse cx="0" cy="-10.5" rx="5.6" ry="11" fill="${index % 2 ? light : color}" opacity=".82" transform="rotate(${(index + .5) * (360 / innerCount)})"/>`).join("");
  return `<g transform="translate(${x} ${y}) scale(${scale})" class="garden-svg-flower">${petalMarkup}${innerMarkup}<circle r="10" fill="${accent}"/><circle r="6.5" fill="rgba(255,247,207,.42)"/><circle r="3.6" fill="#9b6e42" opacity=".58"/><path d="M-15-8Q0-22 15-8" fill="none" stroke="rgba(255,255,255,.46)" stroke-width="2" stroke-linecap="round"/><g fill="#fff4c9" opacity=".9"><circle cx="0" cy="-6" r="1.2"/><circle cx="5" cy="-2" r="1.2"/><circle cx="-5" cy="-2" r="1.2"/></g></g>`;
}

function lightenGardenColor(color) {
  const variants = { "#dd8496": "#efa6b2", "#9c91c7": "#bbb2dc", "#e1a85d": "#efc47f", "#78a889": "#9bc3a7" };
  return variants[color] || color;
}

function gardenBudSvg(x, y, scale, color) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" class="garden-svg-bud"><path d="M0 8C-17-1-16-24 0-34C16-24 17-1 0 8Z" fill="${color}" stroke="rgba(90,62,72,.15)" stroke-width="1"/><path d="M0-29C-5-19-5-7 0 4C5-7 5-19 0-29Z" fill="rgba(255,255,255,.26)"/><path d="M-16 6Q0 20 16 6Q8 1 0-5Q-8 1-16 6Z" fill="#598866"/><path d="M0 9V21" stroke="#497759" stroke-width="4" stroke-linecap="round"/></g>`;
}

function mainGardenPlantSvg(stageIndex, growthStep = 0) {
  const stage = Math.max(0, Math.min(gardenStages.length - 1, stageIndex));
  const leftColor = "#dd8496";
  const rightColor = "#9c91c7";
  const foliage = [];
  const flowers = [];
  const stems = [];
  const stemSpecs = [];
  const details = [];
  const bonus = Math.min(10, Math.max(0, growthStep) * 3);
  const addStem = (stem, width = 7) => {
    const index = stemSpecs.length;
    stemSpecs.push(stem);
    stems.push(`<path data-stem-index="${index}" d="${companionStemPath(stem)}" stroke-width="${width}"/>`);
    return index;
  };
  const addLeaf = (stemIndex, progress, rotation, scale, color) => {
    const [x, y] = companionStemPoint(stemSpecs[stemIndex], progress);
    foliage.push(gardenLeafSvg(x, y, rotation, scale, color, stemIndex));
  };

  if (stage === 0) {
    details.push(`<ellipse cx="150" cy="234" rx="34" ry="10" fill="#6b4d3d" opacity=".72"/><path d="M150 229C136 217 138 199 150 192C162 199 164 217 150 229Z" fill="#8b5d49"/><path d="M150 208C145 204 143 199 145 193" fill="none" stroke="#f1d3c2" stroke-width="2.4" stroke-linecap="round"/><circle cx="143" cy="215" r="2" fill="#f5d9c8" opacity=".65"/>`);
  } else if (stage === 1) {
    const leftStem = addStem([145,241,143,216,137,190,136,174 - bonus]);
    const rightStem = addStem([155,241,158,213,164,187,166,166 - bonus]);
    addLeaf(leftStem, .42, 202, .7, "#75a77e");
    addLeaf(leftStem, .68, -24, .62, "#91bd98");
    addLeaf(rightStem, .42, -18, .72, "#82b089");
    addLeaf(rightStem, .68, 204, .61, "#9bc39d");
    details.push(`<path d="M136 ${174 - bonus}C129 ${166 - bonus} 130 ${157 - bonus} 139 ${152 - bonus}C145 ${162 - bonus} 143 ${170 - bonus} 136 ${174 - bonus}Z" fill="#acd0ae"/><path d="M166 ${166 - bonus}C159 ${157 - bonus} 161 ${148 - bonus} 171 ${143 - bonus}C177 ${153 - bonus} 174 ${162 - bonus} 166 ${166 - bonus}Z" fill="#94c099"/><path d="M132 231Q150 222 168 231" fill="none" stroke="#b78a67" stroke-width="3" opacity=".65"/>`);
  } else {
    const top = [0, 0, 130, 94, 70, 56, 46, 38, 30][stage] - bonus;
    const leftStem = addStem([143,243,139,202,128,160,105,top + 24]);
    const rightStem = addStem([157,243,162,201,174,159,195,top + 24]);
    const centerStem = stage >= 3 ? addStem([150,229,150,181,151,127,150,top + 27], 6.4) : -1;
    addLeaf(leftStem, .22, 198, .72, "#75a77e");
    addLeaf(rightStem, .22, -17, .74, "#8bb491");
    addLeaf(leftStem, .48, 210, .66, "#6f9c76");
    addLeaf(rightStem, .48, -31, .67, "#88b18b");
    addLeaf(leftStem, .72, 201, .58, "#82aa82");
    addLeaf(rightStem, .72, -22, .58, "#9ac19a");
    if (centerStem >= 0) {
      addLeaf(centerStem, .42, 205, .61, "#75a77e");
      addLeaf(centerStem, .62, -24, .6, "#75a37c");
    }
    if (stage >= 5) {
      addLeaf(leftStem, .86, 202, .52, "#75a77e");
      addLeaf(rightStem, .86, -23, .52, "#94bb95");
      addLeaf(centerStem, .76, 208, .48, "#75a77e");
      addLeaf(centerStem, .89, -28, .46, "#83ad88");
    }
    if (stage === 2) {
      details.push(`<path d="M105 ${top + 24}C97 ${top + 12} 100 ${top + 1} 113 ${top - 4}" fill="none" stroke="#82ad83" stroke-width="5" stroke-linecap="round"/><path d="M195 ${top + 24}C203 ${top + 12} 200 ${top + 1} 187 ${top - 4}" fill="none" stroke="#82ad83" stroke-width="5" stroke-linecap="round"/>`);
      addLeaf(leftStem, .92, 205, .45, "#75a77e");
      addLeaf(rightStem, .92, -24, .45, "#a0c5a1");
    }
    if (stage === 3) flowers.push(gardenBudSvg(104, top + 22, .78, leftColor), gardenBudSvg(196, top + 22, .78, rightColor), gardenBudSvg(150, top + 28, .62, "#e1a85d"));
    if (stage >= 4) {
      const bloomScale = stage === 4 ? .78 : stage === 5 ? .9 : 1;
      flowers.push(gardenFlowerSvg(103, top + 20, bloomScale, leftColor, "#f5d693", 8), gardenFlowerSvg(197, top + 20, bloomScale, rightColor, "#f3d58e", 8));
      flowers.push(gardenFlowerSvg(150, top + 27, stage === 4 ? .74 : stage >= 7 ? .88 : .78, "#e1a85d", "#f7e2a7", 9));
    }
    if (stage >= 5) {
      const outerLeftStem = addStem([121,178,98,158,82,135,76,111], 6.2);
      const outerRightStem = addStem([179,178,202,157,218,134,224,111], 6.2);
      addLeaf(outerLeftStem, .52, 207, .55, "#75a77e");
      addLeaf(outerRightStem, .52, -27, .55, "#8cb592");
      flowers.push(gardenFlowerSvg(75, 105, .5, rightColor, "#f2d58a", 7), gardenFlowerSvg(225, 105, .5, leftColor, "#f2d58a", 7));
    }
    if (stage >= 6) {
      details.push(`<path d="M61 230C55 178 70 122 111 82C130 64 142 54 150 47C158 54 170 64 189 82C230 122 245 178 239 230" fill="none" stroke="#5b8965" stroke-width="5.5" stroke-linecap="round" opacity=".78"/>`);
      [72, 105, 195, 228].forEach((x, index) => flowers.push(gardenFlowerSvg(x, 218 - (index % 2) * 12, .34, index % 2 ? leftColor : rightColor, "#f5da93", 7)));
    }
    if (stage >= 7) {
      details.push(`<path d="M79 226C62 153 72 74 150 37C228 74 238 153 221 226" fill="none" stroke="#719a73" stroke-width="7" stroke-linecap="round" opacity=".68"/>`);
      [88, 119, 150, 181, 212].forEach((x, index) => flowers.push(gardenFlowerSvg(x, 78 + Math.abs(150 - x) * .5, .36, index % 2 ? rightColor : leftColor, "#f5d98c", 8)));
    }
    if (stage >= 8) {
      [61, 103, 150, 197, 239].forEach((x, index) => flowers.push(gardenFlowerSvg(x, 224 - (index % 3) * 15, .38 + (index % 2) * .06, [leftColor, rightColor, "#e1a85d", "#78a889"][index % 4], "#f6dc96", 8)));
      details.push(`<g fill="#ffe9a9" opacity=".92"><circle cx="55" cy="74" r="2.5"/><circle cx="245" cy="70" r="3"/><circle cx="44" cy="130" r="2"/><circle cx="258" cy="136" r="2.3"/><path d="M150 17l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/></g>`);
    }
  }

  return `<svg class="garden-plant-svg" viewBox="0 0 300 310" role="presentation"><defs><linearGradient id="main-pot-${stage}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dda088"/><stop offset=".5" stop-color="#bd7869"/><stop offset="1" stop-color="#8f5a53"/></linearGradient><linearGradient id="main-soil-${stage}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#705044"/><stop offset="1" stop-color="#48332d"/></linearGradient><filter id="main-shadow-${stage}" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#31483a" flood-opacity=".22"/></filter></defs><ellipse cx="150" cy="303" rx="78" ry="8" fill="#304a39" opacity=".17"/><g class="garden-svg-botanical"><g class="garden-svg-stems" fill="none" stroke="#4f805d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${stems.join("")}</g>${details.join("")}${foliage.join("")}${flowers.join("")}</g><g filter="url(#main-shadow-${stage})"><ellipse cx="150" cy="244" rx="72" ry="16" fill="url(#main-soil-${stage})"/><path d="M78 246H222L209 296Q205 305 195 305H105Q95 305 91 296Z" fill="url(#main-pot-${stage})"/><path d="M72 242Q72 232 83 232H217Q228 232 228 242V253H72Z" fill="#ca826f"/><path d="M91 266Q150 279 209 266" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="4" stroke-linecap="round"/><path d="M101 286Q150 296 199 286" fill="none" stroke="rgba(88,46,43,.12)" stroke-width="2"/><text x="150" y="288" text-anchor="middle" fill="#fff8ef" font-family="Georgia,serif" font-size="13" font-weight="700" letter-spacing="1">LIU ♥ FU</text></g></svg>`;
}

function companionLeafSvg(species, x, y, rotation, scale = 1, tone = 0, stemIndex = 0) {
  const colors = tone ? ["#8fba91", "#a5c9a4"] : ["#5f936c", "#7eaa7f"];
  const paths = {
    rose: "M0 0C8-16 27-17 37-6C29 9 12 12 0 0Z",
    daisy: "M0 0C7-13 23-15 31-5C24 7 10 9 0 0Z",
    lavender: "M0 0C5-10 17-13 23-6C18 4 8 6 0 0Z",
    sunflower: "M0 0C4-17 22-25 37-15C41-1 29 13 12 11C5 9 1 5 0 0Z"
  };
  const stemWidth = species === "lavender" ? 3.2 : 3.8;
  return `<g class="companion-leaf companion-leaf-${species}" data-stem-index="${stemIndex}" transform="translate(${x} ${y}) rotate(${rotation})"><g transform="scale(${scale})"><path class="companion-petiole" d="M0 0C3-.4 6-.8 10-1" fill="none" stroke="#4e805d" stroke-width="${stemWidth}" stroke-linecap="round"/><g class="companion-leaf-blade" transform="translate(8 -1)"><path d="${paths[species] || paths.rose}" fill="${colors[0]}"/><path d="M2 0Q14-2 27-6" fill="none" stroke="${colors[1]}" stroke-width="1.7" stroke-linecap="round"/><path d="M13-3l5-6M20-5l5 3" fill="none" stroke="rgba(238,248,232,.5)" stroke-width="1.1" stroke-linecap="round"/></g></g></g>`;
}

function companionStemPath(stem) {
  return `M${stem[0]} ${stem[1]}C${stem[2]} ${stem[3]} ${stem[4]} ${stem[5]} ${stem[6]} ${stem[7]}`;
}

function companionStemPoint(stem, progress) {
  const t = Math.max(0, Math.min(1, progress));
  const u = 1 - t;
  return [
    Number((u ** 3 * stem[0] + 3 * u ** 2 * t * stem[2] + 3 * u * t ** 2 * stem[4] + t ** 3 * stem[6]).toFixed(2)),
    Number((u ** 3 * stem[1] + 3 * u ** 2 * t * stem[3] + 3 * u * t ** 2 * stem[5] + t ** 3 * stem[7]).toFixed(2))
  ];
}

function companionBudSvg(species, x, y, scale = 1) {
  if (species === "lavender") return `<g class="companion-bud" transform="translate(${x} ${y}) scale(${scale})"><path d="M0 4V-29" stroke="#557d62" stroke-width="4" stroke-linecap="round"/>${[-26, -21, -16, -11, -6].map((offset, index) => `<ellipse cx="${index % 2 ? 4.5 : -4.5}" cy="${offset}" rx="4.8" ry="6.5" fill="${index % 2 ? "#aa94cc" : "#8d79bb"}" transform="rotate(${index % 2 ? 27 : -27})"/>`).join("")}<ellipse cy="-30" rx="4" ry="6" fill="#bdafe0"/></g>`;
  if (species === "sunflower") return `<g class="companion-bud" transform="translate(${x} ${y}) scale(${scale}) rotate(-8)"><path d="M0 7V-2" stroke="#557d62" stroke-width="5"/><path d="M0 0C-14-3-18-18-7-26C6-32 18-21 14-8C11-1 5 2 0 0Z" fill="#70996a"/><path d="M-5-24C4-21 10-14 11-6" fill="none" stroke="#a8c193" stroke-width="2"/></g>`;
  const petal = species === "daisy" ? "#fffaf0" : "#dc8296";
  const center = species === "daisy" ? `<ellipse cy="-22" rx="4" ry="6" fill="#e8bc5b"/>` : "";
  return `<g class="companion-bud" transform="translate(${x} ${y}) scale(${scale})"><path d="M0 6V-1" stroke="#557d62" stroke-width="4.5"/><path d="M0 1C-12-5-12-20 0-29C12-20 12-5 0 1Z" fill="${petal}"/>${center}<path d="M0 1C-8-2-12-8-11-15C-5-13-1-8 0 1ZM0 1C8-2 12-8 11-15C5-13 1-8 0 1Z" fill="#719d74"/><path d="M0-25C-3-16-2-8 0-2" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="2"/></g>`;
}

function companionBlossomSvg(species, x, y, scale = 1, turn = 0) {
  if (species === "sunflower") return `<g class="companion-bloom" transform="translate(${x} ${y}) rotate(${turn}) scale(${scale})"><g>${Array.from({ length: 16 }, (_, index) => `<ellipse cx="0" cy="-20" rx="6.4" ry="16" fill="${index % 2 ? "#efb94f" : "#f6cc64"}" transform="rotate(${index * 22.5})"/>`).join("")}</g><circle r="14" fill="#6f513d"/><circle r="10" fill="#8c6743"/><g fill="#d4a957">${Array.from({ length: 12 }, (_, index) => `<circle cx="0" cy="-7" r="1.5" transform="rotate(${index * 30})"/>`).join("")}</g><circle r="3.5" fill="#5e4437"/></g>`;
  if (species === "daisy") return `<g class="companion-bloom" transform="translate(${x} ${y}) rotate(${turn}) scale(${scale})">${Array.from({ length: 12 }, (_, index) => `<ellipse cx="0" cy="-16" rx="5.3" ry="15" fill="${index % 2 ? "#fffdf4" : "#f4f0e8"}" stroke="#e4ded2" stroke-width=".7" transform="rotate(${index * 30})"/>`).join("")}<circle r="10" fill="#e4ad44"/><circle r="6.5" fill="#f1c961"/><g fill="#fff0a8">${Array.from({ length: 8 }, (_, index) => `<circle cx="0" cy="-5" r="1.2" transform="rotate(${index * 45})"/>`).join("")}</g></g>`;
  if (species === "lavender") return `<g class="companion-bloom" transform="translate(${x} ${y}) rotate(${turn}) scale(${scale})"><path d="M0 5V-44" stroke="#557d62" stroke-width="4" stroke-linecap="round"/>${[-40, -33, -26, -19, -12, -5].map((offset, index) => `<g transform="translate(0 ${offset})"><ellipse cx="${index % 2 ? 6 : -6}" rx="7" ry="9" fill="${index % 3 ? "#9f89c8" : "#b2a0d7"}" transform="rotate(${index % 2 ? 31 : -31})"/><ellipse cx="${index % 2 ? -3 : 3}" cy="3" rx="5" ry="7" fill="#8975b6" transform="rotate(${index % 2 ? -24 : 24})"/></g>`).join("")}<path d="M-2-43C2-49 7-48 8-42C5-38 1-38-2-43Z" fill="#c0b2df"/></g>`;
  return `<g class="companion-bloom" transform="translate(${x} ${y}) rotate(${turn}) scale(${scale})"><circle r="25" fill="#f4c2c9" opacity=".35"/>${Array.from({ length: 10 }, (_, index) => `<ellipse cx="0" cy="-13" rx="10" ry="17" fill="${index % 2 ? "#dc8296" : "#ed9bab"}" stroke="rgba(255,255,255,.28)" stroke-width=".8" transform="rotate(${index * 36}) scale(${index % 2 ? .82 : 1})"/>`).join("")}<circle r="12" fill="#d8778d"/><path d="M-8 2C-6-8 8-10 10-1C11 6 2 10-4 6C-9 3-7-3-2-5C3-7 6-3 4 1" fill="none" stroke="#f7c1c9" stroke-width="3" stroke-linecap="round"/></g>`;
}

function companionPlantSvg(species = "rose", level = 0, compact = false) {
  const currentSpecies = ["rose", "daisy", "lavender", "sunflower"].includes(species) ? species : "rose";
  const currentLevel = Math.max(0, Math.min(6, Number(level) || 0));
  const profiles = {
    rose: {
      stems: [[130,162,127,134,128,104,126,72], [128,146,111,128,98,103,95,80], [134,142,153,123,167,99,172,76], [112,127,91,117,76,102,68,86], [151,126,175,116,192,99,202,81]],
      heads: [[126, 69, 0], [94, 78, -8], [173, 74, 8], [67, 84, -12], [203, 79, 12]],
      leaves: [[0,.22,205,.58,0,1],[0,.42,-25,.55,1,1],[1,.3,205,.5,1,2],[1,.58,-24,.46,0,2],[2,.3,-25,.52,0,3],[2,.58,205,.46,1,3],[3,.48,205,.39,1,5],[4,.48,-22,.4,0,6]]
    },
    daisy: {
      stems: [[130,162,129,127,124,91,115,59], [132,160,140,124,150,96,164,70], [126,160,113,132,99,108,84,87], [137,160,157,139,178,118,194,94], [120,160,101,145,82,129,65,109]],
      heads: [[114, 57, -6], [165, 67, 7], [83, 85, -9], [195, 91, 9], [64, 107, -12]],
      leaves: [[0,.2,202,.52,0,1],[0,.39,-24,.5,1,1],[1,.28,-25,.45,0,2],[1,.56,204,.4,1,2],[2,.3,204,.45,1,3],[2,.58,-25,.4,0,3],[3,.5,-22,.35,0,5],[4,.5,203,.35,1,6]]
    },
    lavender: {
      stems: [[130,163,129,126,127,88,122,48], [137,163,146,128,153,92,155,58], [122,163,108,132,101,101,98,70], [143,163,164,134,174,106,178,77], [115,163,94,143,78,118,73,92]],
      heads: [[122, 61, -4], [155, 70, 5], [98, 82, -7], [178, 89, 8], [73, 104, -10]],
      leaves: [[0,.18,198,.52,0,1],[0,.37,-20,.5,1,1],[1,.27,-20,.45,0,2],[1,.54,198,.4,1,2],[2,.28,198,.45,1,3],[2,.56,-20,.4,0,3],[3,.48,-20,.34,0,5],[4,.48,198,.34,1,6]]
    },
    sunflower: {
      stems: [[130,163,127,124,124,89,120,58], [136,162,150,126,161,98,174,76], [123,162,106,135,91,113,78,92], [142,162,166,143,188,124,203,103], [115,162,93,151,72,137,58,121]],
      heads: [[120, 56, -5], [175, 74, 8], [77, 90, -10], [204, 101, 11], [57, 119, -12]],
      leaves: [[0,.18,196,.5,0,1],[0,.37,-17,.5,1,1],[1,.27,-18,.45,0,2],[1,.55,195,.4,1,2],[2,.28,195,.45,1,3],[2,.56,-18,.4,0,3],[3,.48,-17,.34,0,5],[4,.48,195,.34,1,6]]
    }
  };
  const profile = profiles[currentSpecies];
  const stemCount = [0, 1, 2, 3, 3, 4, 5][currentLevel];
  const growthScale = [1, .42, .62, .82, 1, 1, 1][currentLevel];
  const stems = profile.stems.slice(0, stemCount).map((stem, index) => `<path data-stem-index="${index}" d="${companionStemPath(stem)}" stroke-width="${currentSpecies === "sunflower" ? 6.4 - index * .25 : currentSpecies === "lavender" ? 3.7 : 5.2 - index * .15}"/>`).join("");
  const leaves = profile.leaves
    .filter(([stemIndex, , , , , minimumLevel]) => currentLevel >= minimumLevel && stemIndex < stemCount)
    .map(([stemIndex, progress, rotation, scale, tone]) => {
      const [x, y] = companionStemPoint(profile.stems[stemIndex], progress);
      return companionLeafSvg(currentSpecies, x, y, rotation, scale, tone, stemIndex);
    }).join("");
  let heads = "";
  if (currentLevel === 4) heads = profile.heads.slice(0, 3).map(([x, y, turn], index) => companionBudSvg(currentSpecies, x, y + (index === 2 ? 3 : 0), index === 0 ? .82 : .7)).join("");
  if (currentLevel === 5) heads = profile.heads.slice(0, 4).map(([x, y, turn], index) => index === 3 ? companionBudSvg(currentSpecies, x, y, .58) : companionBlossomSvg(currentSpecies, x, y, index === 0 ? .72 : .61, turn)).join("");
  if (currentLevel >= 6) heads = profile.heads.map(([x, y, turn], index) => companionBlossomSvg(currentSpecies, x, y, index === 0 ? .74 : index < 3 ? .62 : .5, turn)).join("");
  const seed = currentLevel === 0 ? `<g><ellipse cx="130" cy="159" rx="31" ry="8" fill="#60473c"/><path d="M130 154C118 146 119 132 130 125C141 132 142 146 130 154Z" fill="#9a6c4e"/><path d="M130 140C126 136 126 132 129 128" fill="none" stroke="#efd2ba" stroke-width="2.2" stroke-linecap="round"/></g>` : "";
  const shoots = currentLevel > 0 && currentLevel < 4 ? profile.heads.slice(0, stemCount).map(([x, y], index) => `<path d="M${x - 5} ${y + 7}Q${x} ${y - 1} ${x + 5} ${y + 7}" fill="none" stroke="${index % 2 ? "#8db28b" : "#6f9a72"}" stroke-width="3" stroke-linecap="round"/>`).join("") : "";
  const potId = `companion-pot-${currentSpecies}-${currentLevel}-${compact ? "c" : "f"}`;
  const botanical = `<g transform="translate(0 ${164 * (1 - growthScale)}) scale(1 ${growthScale})"><g class="companion-stems" fill="none" stroke="#4e805d" stroke-linecap="round" stroke-linejoin="round">${stems}</g>${leaves}${shoots}${heads}</g>`;
  return `<svg class="companion-plant-svg is-${currentSpecies}${compact ? " is-compact" : ""}" viewBox="0 0 260 220" role="presentation" aria-hidden="true"><defs><linearGradient id="${potId}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e3aa92"/><stop offset=".52" stop-color="#c68070"/><stop offset="1" stop-color="#985d58"/></linearGradient><filter id="${potId}-shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#334b3b" flood-opacity=".17"/></filter></defs><ellipse cx="130" cy="211" rx="65" ry="7" fill="#395341" opacity=".14"/>${botanical}${seed}<g filter="url(#${potId}-shadow)"><ellipse cx="130" cy="164" rx="61" ry="14" fill="#4f3a31"/><path d="M73 164H187L178 204Q176 212 166 212H94Q84 212 82 204Z" fill="url(#${potId})"/><path d="M68 160Q68 151 78 151H182Q192 151 192 160V170H68Z" fill="#c77d6c"/><path d="M89 180Q130 191 171 180M99 197Q130 204 161 197" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="3" stroke-linecap="round"/></g></svg>`;
}

function hybridPetalPath(shape) {
  if (shape === "heart") return "M50 49C42 39 31 31 33 19C35 8 47 8 50 18C53 8 65 8 67 19C69 31 58 39 50 49Z";
  if (shape === "star") return "M50 49L39 31L44 8L50 20L56 8L61 31Z";
  if (shape === "soft") return "M50 49C35 41 35 19 50 7C65 19 65 41 50 49Z";
  if (shape === "pointed") return "M50 49C41 39 42 20 50 3C58 20 59 39 50 49Z";
  if (shape === "ruffled") return "M50 49C39 44 35 34 39 27C33 17 41 7 50 11C59 7 67 17 61 27C65 34 61 44 50 49Z";
  if (shape === "spoon") return "M50 49C46 37 35 32 37 19C39 7 48 5 50 15C52 5 61 7 63 19C65 32 54 37 50 49Z";
  if (shape === "bell") return "M50 49C41 42 35 29 39 13C43 6 57 6 61 13C65 29 59 42 50 49Z";
  if (shape === "lotus") return "M50 49C38 42 34 26 41 12L50 3L59 12C66 26 62 42 50 49Z";
  if (shape === "wave") return "M50 49C40 44 34 35 38 27C32 20 37 10 45 12C49 4 57 7 58 15C67 14 70 24 63 30C67 39 60 46 50 49Z";
  if (shape === "teardrop") return "M50 49C38 41 39 22 50 3C61 22 62 41 50 49Z";
  if (shape === "butterfly") return "M50 49C45 38 32 37 32 24C32 14 42 12 49 23C50 10 59 8 65 16C72 26 62 39 50 49Z";
  return "M50 49C37 43 36 18 50 7C64 18 63 43 50 49Z";
}

function hybridPatternMarkup(pattern, detail = true) {
  if (!detail) return "";
  if (pattern === "dew") return `<circle cx="46" cy="20" r="2.2" fill="#fff" opacity=".86"/><circle cx="53" cy="28" r="1.3" fill="#fff" opacity=".68"/>`;
  if (pattern === "blush") return `<path d="M50 46C47 35 44 24 50 12C56 24 53 35 50 46Z" fill="#fff" opacity=".24"/>`;
  if (pattern === "silk") return `<path d="M50 45C47 34 47 22 50 9M50 29l-6-8M50 35l7-9" fill="none" stroke="#fff" stroke-width="1.25" stroke-linecap="round" opacity=".48"/>`;
  if (pattern === "speckle") return `<g fill="#ffe6a0" opacity=".84"><circle cx="46" cy="18" r="1.7"/><circle cx="54" cy="23" r="1.2"/><circle cx="48" cy="30" r="1.1"/><circle cx="55" cy="35" r=".9"/></g>`;
  if (pattern === "moonwash") return `<ellipse cx="50" cy="25" rx="8" ry="15" fill="#fff" opacity=".22"/><path d="M45 13C52 18 55 28 52 38" fill="none" stroke="#fff" stroke-width="1.2" opacity=".48"/>`;
  if (pattern === "tipped") return `<path d="M50 4C44 11 44 18 50 24C56 18 56 11 50 4Z" fill="#fff4d1" opacity=".4"/>`;
  return "";
}

function hybridAuraMarkup(aura, side) {
  const mirror = side === "left" ? 1 : -1;
  const x = side === "left" ? 18 : 82;
  if (aura === "stardust") return `<g fill="#ffe8a6" opacity=".9"><path d="M${x} 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><circle cx="${x + mirror * 8}" cy="45" r="1.7"/><circle cx="${x - mirror * 7}" cy="12" r="1.2"/></g>`;
  if (aura === "pearl") return `<g fill="#fffaf1" stroke="#d9d4e3" stroke-width=".8"><circle cx="${x}" cy="20" r="3.2"/><circle cx="${x + mirror * 8}" cy="39" r="2.2"/><circle cx="${x - mirror * 5}" cy="52" r="1.7"/></g>`;
  if (aura === "hearts") return `<g transform="translate(${x - 5} 20) scale(.34)" fill="#e79aaa"><path d="M15 28C-3 15 3 0 15 9C27 0 33 15 15 28Z"/></g><g transform="translate(${x + mirror * 6} 45) scale(.22)" fill="#f0bdc5"><path d="M15 28C-3 15 3 0 15 9C27 0 33 15 15 28Z"/></g>`;
  if (aura === "butterfly") return `<g transform="translate(${x} 27) rotate(${side === "left" ? -18 : 18})"><ellipse cx="-4" cy="-2" rx="6" ry="9" fill="#d7c8ed"/><ellipse cx="5" cy="-2" rx="6" ry="9" fill="#f0b6c2"/><path d="M0-5v13" stroke="#786a79" stroke-width="1.5"/><path d="M-1-5l-4-5M1-5l4-5" stroke="#786a79" stroke-width="1"/></g>`;
  if (aura === "halo") return `<path d="M${side === "left" ? 8 : 50} 50A42 42 0 0 ${side === "left" ? 1 : 0} ${side === "left" ? 50 : 92} 8" fill="none" stroke="#f8df9d" stroke-width="2" stroke-dasharray="3 5" opacity=".66"/>`;
  return "";
}

function hybridFlowerSvg(bloom) {
  const baseChoice = { color: "coral", shape: "round", pattern: "solid", center: "sun", layer: "classic", aura: "none" };
  const leftChoice = { ...baseChoice, ...(bloom.left || {}) };
  const rightChoice = { ...baseChoice, color: "lavender", ...(bloom.right || {}) };
  const left = gardenColorHex[leftChoice.color] || gardenColorHex.coral;
  const right = gardenColorHex[rightChoice.color] || gardenColorHex.lavender;
  const layerWeight = { airy: 0, classic: 1, double: 2, lush: 3 };
  const dominantLayer = layerWeight[leftChoice.layer] >= layerWeight[rightChoice.layer] ? leftChoice.layer : rightChoice.layer;
  const petalCount = ({ airy: 8, classic: 10, double: 12, lush: 14 })[dominantLayer] || 10;
  const offset = (Number(bloom.round || 1) * 7) % (360 / petalCount);
  const petalRing = (count, scale, turn, detail) => Array.from({ length: count }, (_, index) => {
    const side = index % 2 ? rightChoice : leftChoice;
    const color = index % 2 ? right : left;
    const pattern = side.pattern || "solid";
    const stroke = pattern === "edge" ? "rgba(92,69,78,.48)" : "rgba(255,255,255,.2)";
    const opacity = pattern === "blush" ? .84 : 1;
    const angle = turn + index * (360 / count);
    return `<g class="hybrid-petal" transform="rotate(${angle} 50 50) translate(50 50) scale(${scale}) translate(-50 -50)"><path d="${hybridPetalPath(side.shape)}" fill="${color}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="${pattern === "edge" ? 1.7 : .7}"/>${hybridPatternMarkup(pattern, detail)}</g>`;
  }).join("");
  const outerPetals = petalRing(petalCount, dominantLayer === "airy" ? .92 : 1, offset, true);
  const innerPetals = dominantLayer === "double" ? petalRing(7, .64, offset + 12, false) : dominantLayer === "lush" ? petalRing(9, .68, offset + 9, false) : "";
  const centers = [leftChoice.center, rightChoice.center];
  const centerKey = centers.find((value) => value && value !== "sun") || "sun";
  const center = ({ berry: "#a75a70", starlight: "#756b9d", pearl: "#eee5dc", honey: "#d89d4d", moon: "#d9cfae", jade: "#78a188", heart: "#d47d8d", sun: "#f2ce79" })[centerKey];
  const centerMark = centerKey === "starlight" ? `<path d="M50 39l3.3 7.2 7.7 3.1-7.7 3.2-3.3 7.5-3.3-7.5-7.7-3.2 7.7-3.1Z" fill="#fff1be"/>`
    : centerKey === "moon" ? `<path d="M55 40C47 42 45 53 51 58C45 57 40 52 40 47C41 39 49 36 55 40Z" fill="#fff8dc"/>`
      : centerKey === "heart" ? `<path d="M50 58C37 49 42 39 50 45C58 39 63 49 50 58Z" fill="#fff3ea"/>`
        : centerKey === "jade" ? `<path d="M42 54C43 43 52 39 59 41C59 50 53 57 42 54ZM44 53l12-10" fill="#e9f2dd" stroke="#fff" stroke-width="1"/>`
          : centerKey === "pearl" ? `<circle cx="50" cy="50" r="6" fill="#fffdf8" stroke="#d9d2df" stroke-width="1.5"/>`
            : `<g fill="#fff6d0" opacity=".86"><circle cx="50" cy="43" r="1.5"/><circle cx="56" cy="48" r="1.5"/><circle cx="53" cy="55" r="1.5"/><circle cx="45" cy="54" r="1.5"/><circle cx="43" cy="47" r="1.5"/></g>`;
  const aura = `${hybridAuraMarkup(leftChoice.aura, "left")}${hybridAuraMarkup(rightChoice.aura, "right")}`;
  return `<svg class="hybrid-flower-svg" viewBox="0 0 100 112" role="presentation" aria-hidden="true"><ellipse cx="49" cy="108" rx="27" ry="4" fill="#3c5b47" opacity=".13"/>${aura}<g>${outerPetals}${innerPetals}<circle cx="50" cy="50" r="13.5" fill="${center}"/><circle cx="50" cy="50" r="10" fill="none" stroke="rgba(255,255,255,.32)" stroke-width="1.5"/>${centerMark}</g><path class="hybrid-stem" d="M50 63C50 79 49 92 47 108" fill="none" stroke="#5b8967" stroke-width="5" stroke-linecap="round"/></svg>`;
}

function renderGardenHybridPreview() {
  if (!els.gardenHybridPreview) return;
  const choice = {
    color: els.gardenHybridColor.value,
    shape: els.gardenHybridShape.value,
    pattern: els.gardenHybridPattern.value,
    center: els.gardenHybridCenter.value,
    layer: els.gardenHybridLayer.value,
    aura: els.gardenHybridAura.value
  };
  const partner = gardenState().hybrid.choices?.[otherPerson(currentPerson())] || { color: "lavender", shape: "soft", pattern: "blush", center: "pearl", layer: "classic", aura: "none" };
  els.gardenHybridPreview.innerHTML = `<span>${hybridFlowerSvg({ round: gardenState().hybrid.round, left: currentPerson() === "liu" ? choice : partner, right: currentPerson() === "liu" ? partner : choice })}</span><div><small>你的花瓣预览</small><strong>${gardenColorNames[choice.color]} · ${gardenShapeNames[choice.shape]} · ${gardenPatternNames[choice.pattern]}</strong><em>${gardenLayerNames[choice.layer]} · ${gardenAuraNames[choice.aura]}</em></div>`;
}

function setGardenArtwork(element, key, markup) {
  if (!element || element.dataset.artKey === key) return;
  element.dataset.artKey = key;
  element.innerHTML = markup;
}

function renderGarden() {
  const garden = gardenState();
  const points = Math.max(Number(garden.points || 0), calculateGardenPoints());
  const stageIndex = gardenStageIndex(points);
  const stage = gardenStages[stageIndex];
  const next = gardenStages[stageIndex + 1];
  const progress = next ? Math.round(((points - stage.min) / (next.min - stage.min)) * 100) : 100;
  const growthStep = next ? Math.min(3, Math.floor(Math.max(0, progress) / 25)) : 3;
  const weather = gardenWeather();
  const season = gardenSeasonInfo();
  const anniversary = gardenAnniversaryToday();
  const watered = new Set(garden.waterings[todayString()] || []);
  const current = currentPerson();
  const waiting = Object.keys(people).filter((person) => !watered.has(person)).map((person) => people[person].short);

  els.gardenPreviewStatus.textContent = watered.size === 2 ? `${stage.name} · 今天的花已被共同照顾` : `${stage.name} · ${waiting.join("、")}今天还没浇水`;
  els.gardenShortcutStage.textContent = `${stage.name} · ${progress}%`;
  els.gardenShortcutWater.textContent = watered.size === 2 ? "今日已共同浇水" : `等待${waiting.join("、")}浇水`;
  els.gardenWeatherChip.textContent = weather.label;
  els.gardenStageName.textContent = stage.name;
  els.gardenPoints.textContent = `${points} 心意值`;
  els.gardenNextStage.textContent = next ? `距离「${next.name}」还差 ${Math.max(0, next.min - points)} 心意值 · ${next.reward}` : "四季已经在这里盛开，接下来的每一分都是新的共同回忆";
  els.gardenProgressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  els.openGardenHome.dataset.stage = stage.scene;
  els.openGardenHome.dataset.step = growthStep;
  els.gardenStage.dataset.stage = stage.scene;
  els.gardenStage.dataset.step = growthStep;
  els.gardenStage.dataset.weather = weather.id;
  els.gardenStage.dataset.season = season.season;
  els.gardenStage.dataset.time = season.time;
  els.gardenTogetherSeason.textContent = `${season.seasonName} · ${season.timeName}`;
  els.gardenPlant.dataset.stage = stage.scene;
  els.gardenPlant.dataset.step = growthStep;
  setGardenArtwork(els.gardenPlant, `main-${stageIndex}-${growthStep}`, mainGardenPlantSvg(stageIndex, growthStep));
  els.gardenGateSign.classList.toggle("is-unlocked", garden.unlockedAreas.includes("glasshouse"));
  const gateMode = garden.unlockedAreas.includes("glasshouse") ? "open" : "locked";
  if (els.gardenGateSign.dataset.mode !== gateMode) {
    els.gardenGateSign.dataset.mode = gateMode;
    els.gardenGateSign.innerHTML = gateMode === "open"
      ? `<i data-lucide="door-open" aria-hidden="true"></i><span></span>`
      : `<i data-lucide="lock-keyhole" aria-hidden="true"></i><span></span>`;
    window.lucide?.createIcons();
  }
  els.gardenGateSign.querySelector("span").textContent = gateMode === "open" ? "晨光花房已经打开" : `秘密花房 · 还差 ${Math.max(0, 2000 - points)} 心意值`;
  renderGardenAreaMap(points);
  els.gardenWateringStatus.innerHTML = Object.keys(people).map((person) => `<span class="${watered.has(person) ? "is-done" : ""}"><i aria-hidden="true">${watered.has(person) ? "✓" : "○"}</i>${people[person].short}</span>`).join("");
  els.waterGarden.disabled = watered.has(current);
  els.waterGarden.querySelector("span").textContent = watered.has(current) ? "今天已经浇水" : "浇一点心意";
  els.gardenFestivalScene.dataset.style = anniversary?.style || "none";
  els.gardenFestivalScene.innerHTML = anniversary
    ? `<strong>${escapeHTML(anniversary.title)}</strong><span>${Array.from({ length: 14 }, () => "<i></i>").join("")}</span>`
    : "";
  renderGardenSeedOptions();
  renderGardenSeeds();
  renderGardenTogether();
  renderGardenWishes();
  renderGardenFlowers();
  renderGardenGrowth();
  renderGardenPanels();
}

function renderGardenAreaMap(points) {
  els.gardenAreaMap.replaceChildren(...gardenAreaDefinitions.map((area) => {
    const unlocked = points >= area.threshold;
    const node = document.createElement("button");
    node.type = "button";
    node.dataset.gardenArea = area.id;
    node.disabled = !unlocked;
    node.className = `${unlocked ? "is-unlocked" : "is-locked"}${activeGardenPanel === area.panel ? " is-current" : ""}`;
    node.innerHTML = `<span><i data-lucide="${unlocked ? area.icon : "lock-keyhole"}" aria-hidden="true"></i></span><strong>${area.name}</strong><small>${unlocked ? area.copy : `还差 ${area.threshold - points}`}</small>`;
    return node;
  }));
  window.lucide?.createIcons();
}

function renderGardenPanels() {
  els.gardenTools.querySelectorAll("[data-garden-panel]").forEach((button) => button.classList.toggle("is-active", button.dataset.gardenPanel === activeGardenPanel));
  els.gardenAreaMap.querySelectorAll("[data-garden-area]").forEach((button) => {
    const area = gardenAreaDefinitions.find((item) => item.id === button.dataset.gardenArea);
    button.classList.toggle("is-current", area?.panel === activeGardenPanel);
  });
  els.gardenPanels.forEach((panel) => {
    const active = panel.dataset.gardenContent === activeGardenPanel;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  if (activeGardenPanel === "growth") positionGardenRoadmap();
}

function renderGardenSeedOptions() {
  const selectedPhoto = els.gardenSeedPhoto.value;
  const selectedVoice = els.gardenSeedVoice.value;
  const photos = state.photos.slice(0, 40);
  const voices = voiceMessages.slice(0, 40);
  const photoKey = photos.map((photo) => `${photo.id}:${photo.caption}:${photo.date}`).join("|");
  const voiceKey = voices.map((voice) => `${voice.id}:${voice.role}:${voice.created_at}:${voice.duration_seconds}`).join("|");

  if (photoKey !== gardenSeedPhotoOptionsKey) {
    if (document.activeElement === els.gardenSeedPhoto) gardenSeedOptionsPending = true;
    else {
      els.gardenSeedPhoto.innerHTML = `<option value="">不关联照片</option>${photos.map((photo) => `<option value="${photo.id}">${escapeHTML(formatDate(parseDate(photo.date)))} · ${escapeHTML(photo.caption || "未命名照片")}</option>`).join("")}`;
      gardenSeedPhotoOptionsKey = photoKey;
      if ([...els.gardenSeedPhoto.options].some((option) => option.value === selectedPhoto)) els.gardenSeedPhoto.value = selectedPhoto;
    }
  }
  if (voiceKey !== gardenSeedVoiceOptionsKey) {
    if (document.activeElement === els.gardenSeedVoice) gardenSeedOptionsPending = true;
    else {
      els.gardenSeedVoice.innerHTML = `<option value="">不关联声音</option>${voices.map((voice) => `<option value="${voice.id}">${escapeHTML(formatDateTime(new Date(voice.created_at)))} · ${escapeHTML(people[voice.role]?.short || "我们")} · ${formatDuration(voice.duration_seconds)}</option>`).join("")}`;
      gardenSeedVoiceOptionsKey = voiceKey;
      if ([...els.gardenSeedVoice.options].some((option) => option.value === selectedVoice)) els.gardenSeedVoice.value = selectedVoice;
    }
  }
}

function renderGardenTogether() {
  ensureGardenWeek();
  const garden = gardenState();
  const plant = garden.companionPlant;
  const careEntries = Object.values(plant.care || {}).flatMap((entry) => [...new Set(entry || [])]);
  const careCount = careEntries.length;
  const levels = [0, 2, 6, 12, 20, 32, 48];
  let level = 0;
  levels.forEach((minimum, index) => { if (careCount >= minimum) level = index; });
  const nextMinimum = levels[level + 1];
  const levelNames = ["等待种下", "冒出嫩芽", "舒展幼叶", "长成青苗", "孕育花苞", "第一次开花", "共同盛放"];
  const progress = nextMinimum ? Math.round(((careCount - levels[level]) / (nextMinimum - levels[level])) * 100) : 100;
  const caredToday = new Set(plant.care?.[todayString()] || []);
  els.gardenCompanionDisplay.dataset.species = plant.species || "rose";
  els.gardenCompanionDisplay.dataset.level = String(level);
  els.gardenCompanionScene.dataset.species = plant.species || "rose";
  els.gardenCompanionScene.dataset.level = String(level);
  els.gardenCompanionScene.hidden = !plant.name;
  setGardenArtwork(els.gardenCompanionDisplay, `companion-${plant.species || "rose"}-${level}`, companionPlantSvg(plant.species || "rose", level));
  setGardenArtwork(els.gardenCompanionScene, `companion-scene-${plant.species || "rose"}-${level}`, companionPlantSvg(plant.species || "rose", level, true));
  els.gardenCompanionPlantName.textContent = plant.name || "还没有取名字";
  els.gardenCompanionMeta.textContent = plant.name
    ? `${levelNames[level]} · 已收到 ${careCount} 份照顾${nextMinimum ? ` · 再 ${nextMinimum - careCount} 份进入下一阶段` : ""}`
    : "一起选择第一株共同照顾的植物";
  els.gardenCompanionProgress.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  els.gardenCompanionCareStatus.innerHTML = Object.keys(people).map((person) => `<span class="${caredToday.has(person) ? "is-done" : ""}"><i>${caredToday.has(person) ? "✓" : "○"}</i>${people[person].short}今日${caredToday.has(person) ? "已照顾" : "待照顾"}</span>`).join("");
  els.gardenCompanionCare.disabled = caredToday.has(currentPerson());
  els.gardenCompanionCare.querySelector("span").textContent = caredToday.has(currentPerson()) ? "今天已经照顾" : "今天照顾它";
  if (document.activeElement !== els.gardenCompanionName) els.gardenCompanionName.value = plant.name || "";
  if (document.activeElement !== els.gardenCompanionSpecies) els.gardenCompanionSpecies.value = plant.species || "rose";

  const week = garden.weeklyQuests[gardenWeekKey()];
  const completed = week.items.filter((item) => gardenQuestDonePeople(item).length === 2).length;
  const weekEnd = parseDate(week.weekKey);
  weekEnd.setDate(weekEnd.getDate() + 6);
  els.gardenQuestWeek.textContent = `${formatDate(parseDate(week.weekKey))} 至 ${formatDate(weekEnd)}`;
  els.gardenQuestProgress.textContent = `${completed}/3`;
  els.gardenQuestProgress.classList.toggle("is-complete", completed === 3);
  els.gardenQuestList.replaceChildren(...week.items.map((item, index) => {
    const doneBy = new Set(gardenQuestDonePeople(item));
    const node = document.createElement("article");
    node.className = doneBy.size === 2 ? "is-complete" : "";
    node.innerHTML = `<span class="quest-number">${doneBy.size === 2 ? "✓" : index + 1}</span><div><strong>${escapeHTML(item.text)}</strong><small>${Object.keys(people).map((person) => `<i class="${doneBy.has(person) ? "is-done" : ""}">${people[person].short}</i>`).join("")}</small></div><button data-garden-quest="${item.id}" type="button">${doneBy.has(currentPerson()) ? "取消" : "我完成了"}</button>`;
    return node;
  }));
  renderWeeklyGardenPostcard(week, completed);

  const letters = sortGardenByBloomDate(garden.flowerLetters || []);
  const openedCount = letters.filter((item) => item.unlockDate <= todayString()).length;
  els.gardenLetterCount.textContent = `${openedCount}/${letters.length} 盛开`;
  if (!letters.length) {
    renderEmpty(els.gardenLetterList, "第一封花期信，可以写给下一次见面的你们。");
  } else {
    els.gardenLetterList.replaceChildren(...letters.map((letter) => {
      const opened = letter.unlockDate <= todayString();
      const node = document.createElement("article");
      node.className = `garden-letter-item${opened ? " is-open" : ""}`;
      node.innerHTML = `<span class="garden-letter-bloom" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></span><div><small>${opened ? "花已盛开" : `等待 ${formatDate(parseDate(letter.unlockDate))}`}</small><p>${opened ? escapeHTML(letter.text) : "这朵花正在替你们守住一封信。"}</p><time>${people[letter.person]?.short || "我们"}写下 · ${formatDate(parseDate(letter.unlockDate))}</time></div><button class="delete-button" data-delete-garden-letter="${letter.id}" type="button" aria-label="删除花期信">×</button>`;
      return node;
    }));
  }

  const anniversaries = [
    ...(state.startDate ? [{ id: "love-anniversary", title: "我们的恋爱纪念日", date: state.startDate, style: "petals", builtIn: true }] : []),
    ...(garden.anniversaries || [])
  ].sort((a, b) => a.date.slice(5).localeCompare(b.date.slice(5)));
  if (!anniversaries.length) {
    renderEmpty(els.gardenAnniversaryList, "记下一个重要日子，到那天花园会悄悄换上限定景色。");
  } else {
    const styleNames = { petals: "花瓣雨", starlight: "星光夜", lantern: "暖灯庭院", celebration: "庆祝彩带" };
    els.gardenAnniversaryList.replaceChildren(...anniversaries.map((item) => {
      const active = item.date.slice(5) === todayString().slice(5);
      const node = document.createElement("article");
      node.className = active ? "is-today" : "";
      node.innerHTML = `<span><i data-lucide="${active ? "party-popper" : "calendar-heart"}" aria-hidden="true"></i></span><div><strong>${escapeHTML(item.title)}</strong><small>每年 ${Number(item.date.slice(5, 7))}月${Number(item.date.slice(8, 10))}日 · ${styleNames[item.style] || "限定花园"}</small></div>${item.builtIn ? `<i class="garden-built-in">恋爱日期</i>` : `<button class="delete-button" data-delete-garden-anniversary="${item.id}" type="button" aria-label="删除纪念日">×</button>`}`;
      return node;
    }));
  }
  window.lucide?.createIcons();
}

function weeklyPostcardData() {
  const weekKey = gardenWeekKey();
  const weekEndDate = parseDate(weekKey);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  const weekEnd = localDateString(weekEndDate);
  const events = effectiveGardenPointEvents().filter((event) => event.date >= weekKey && event.date <= weekEnd);
  const studyCount = (state.studyLogs || []).filter((item) => item.date >= weekKey && item.date <= weekEnd).length;
  const memoryCount = [state.messages, state.photos, state.gameRecords, state.meetings]
    .flatMap((items) => items || [])
    .filter((item) => (item.date || item.createdAt || "") >= weekKey && (item.date || item.createdAt || "") <= weekEnd).length;
  const points = events.reduce((sum, event) => sum + Number(event.points || 0), 0);
  const stageIndex = gardenStageIndex(Math.max(Number(gardenState().points || 0), calculateGardenPoints()));
  const quest = gardenState().weeklyQuests?.[weekKey];
  const questsCompleted = (quest?.items || []).filter((item) => gardenQuestDonePeople(item).length === 2).length;
  const title = questsCompleted === 3
    ? "这一周，我们让花房亮了起来"
    : (studyCount >= 2 ? "认真生活，也认真陪彼此长大" : "这一周，我们也在一起生长");
  const copy = points > 0
    ? `你们共同收下了 ${points} 点心意。那些认真回应、努力学习和分享生活的时刻，都已经变成花园里新的枝叶。`
    : "有些成长安静得看不见，但每一次惦记和认真生活，都在替下一次盛开积蓄力量。";
  return { weekKey, weekEnd, events, studyCount, memoryCount, points, stageIndex, questsCompleted, title, copy };
}

function renderWeeklyGardenPostcard() {
  const data = weeklyPostcardData();
  els.gardenPostcardWeek.textContent = `${formatDate(parseDate(data.weekKey))} - ${formatDate(parseDate(data.weekEnd))}`;
  els.gardenPostcardStage.textContent = gardenStages[data.stageIndex].name;
  els.gardenPostcardTitle.textContent = data.title;
  els.gardenPostcardCopy.textContent = data.copy;
  els.gardenPostcardStats.innerHTML = `<span><b>${data.points}</b>本周心意</span><span><b>${data.studyCount}</b>学习打卡</span><span><b>${data.questsCompleted}/3</b>花园任务</span><span><b>${data.memoryCount}</b>共同记录</span>`;
  setGardenArtwork(els.gardenPostcardBotanical, `postcard-${data.stageIndex}`, mainGardenPlantSvg(data.stageIndex, 3));
}

function drawPostcardPlant(context, stageIndex) {
  const growth = Math.max(1, Math.min(8, stageIndex));
  const baseX = 540;
  const baseY = 920;
  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = "#547d61";
  context.lineWidth = 18;
  if (stageIndex === 0) {
    context.fillStyle = "#805944";
    context.beginPath();
    context.ellipse(baseX, baseY - 35, 32, 45, 0, 0, Math.PI * 2);
    context.fill();
  } else {
    const height = 140 + growth * 35;
    context.beginPath();
    context.moveTo(baseX - 12, baseY);
    context.bezierCurveTo(baseX - 24, baseY - height * .42, baseX - 95, baseY - height * .72, baseX - 145, baseY - height);
    context.moveTo(baseX + 12, baseY);
    context.bezierCurveTo(baseX + 24, baseY - height * .42, baseX + 95, baseY - height * .72, baseX + 145, baseY - height);
    context.stroke();
    const leafPositions = [[-55,-145,-.5], [58,-155,.5], [-92,-230,-.65], [95,-238,.65], [-120,-310,-.7], [123,-318,.7]];
    leafPositions.slice(0, Math.min(leafPositions.length, 2 + growth)).forEach(([x, y, angle], index) => {
      context.save();
      context.translate(baseX + x, baseY + y);
      context.rotate(angle);
      context.fillStyle = index % 2 ? "#8cb292" : "#6f9c7b";
      context.beginPath();
      context.ellipse(0, 0, 42, 19, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });
    if (stageIndex >= 3) {
      [[baseX - 145, baseY - height, "#df8497"], [baseX + 145, baseY - height, "#9f94c9"]].forEach(([x, y, color]) => {
        if (stageIndex === 3) {
          context.fillStyle = color;
          context.beginPath();
          context.ellipse(x, y, 27, 39, 0, 0, Math.PI * 2);
          context.fill();
          return;
        }
        for (let petal = 0; petal < 8; petal += 1) {
          context.save();
          context.translate(x, y);
          context.rotate((petal * Math.PI) / 4);
          context.fillStyle = color;
          context.beginPath();
          context.ellipse(0, -32, 19, 36, 0, 0, Math.PI * 2);
          context.fill();
          context.restore();
        }
        context.fillStyle = "#f0cf79";
        context.beginPath();
        context.arc(x, y, 23, 0, Math.PI * 2);
        context.fill();
      });
    }
  }
  const potGradient = context.createLinearGradient(400, 900, 680, 1100);
  potGradient.addColorStop(0, "#d6957f");
  potGradient.addColorStop(1, "#9d6358");
  context.fillStyle = "#5a4034";
  context.beginPath();
  context.ellipse(baseX, baseY, 185, 38, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = potGradient;
  context.beginPath();
  context.moveTo(365, baseY + 5);
  context.lineTo(715, baseY + 5);
  context.lineTo(680, 1110);
  context.quadraticCurveTo(670, 1150, 625, 1150);
  context.lineTo(455, 1150);
  context.quadraticCurveTo(410, 1150, 400, 1110);
  context.closePath();
  context.fill();
  context.fillStyle = "#c57f6d";
  roundCanvasRect(context, 345, baseY - 18, 390, 58, 24);
  context.fill();
  context.fillStyle = "#fff8ef";
  context.font = "700 36px Georgia, serif";
  context.textAlign = "center";
  context.fillText("LIU ♥ FU", baseX, 1085);
  context.restore();
}

function roundCanvasRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function canvasWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const characters = [...text];
  const lines = [];
  let line = "";
  characters.forEach((character) => {
    const next = line + character;
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = character;
    } else line = next;
  });
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((item, index) => context.fillText(item, x, y + index * lineHeight));
}

function saveWeeklyGardenPostcard() {
  const data = weeklyPostcardData();
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  const context = canvas.getContext("2d");
  if (!context) return;
  const background = context.createLinearGradient(0, 0, 1080, 1440);
  background.addColorStop(0, "#f8eee8");
  background.addColorStop(.5, "#edf5ee");
  background.addColorStop(1, "#f3edf6");
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1440);
  context.fillStyle = "rgba(255,255,255,.72)";
  roundCanvasRect(context, 62, 58, 956, 1324, 38);
  context.fill();
  context.strokeStyle = "rgba(85,120,94,.18)";
  context.lineWidth = 3;
  context.stroke();
  context.fillStyle = "#a45d6d";
  context.font = "700 28px system-ui, sans-serif";
  context.textAlign = "left";
  context.fillText("OUR WEEK IN BLOOM", 118, 132);
  context.fillStyle = "#647b6b";
  context.font = "600 25px system-ui, sans-serif";
  context.textAlign = "right";
  context.fillText(`${data.weekKey} - ${data.weekEnd}`, 962, 132);
  context.textAlign = "center";
  context.fillStyle = "#342f2d";
  context.font = "700 58px 'Noto Serif SC','Microsoft YaHei',serif";
  canvasWrappedText(context, data.title, 540, 226, 790, 76, 2);
  drawPostcardPlant(context, data.stageIndex);
  context.fillStyle = "#597564";
  context.font = "700 32px 'Microsoft YaHei',sans-serif";
  context.fillText(gardenStages[data.stageIndex].name, 540, 1225);
  context.fillStyle = "#706966";
  context.font = "400 27px 'Microsoft YaHei',sans-serif";
  canvasWrappedText(context, data.copy, 540, 1278, 780, 42, 2);
  context.fillStyle = "#a45d6d";
  context.font = "700 24px Georgia,serif";
  context.fillText(`+${data.points} HEART POINTS  ·  ${data.studyCount} STUDY  ·  ${data.questsCompleted}/3 QUESTS`, 540, 1370);
  const url = canvas.toDataURL("image/png", .94);
  const link = document.createElement("a");
  link.href = url;
  link.download = `刘向强-付嘉颖-花园明信片-${data.weekKey}.png`;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  link.remove();
  els.gardenPostcardNotice.textContent = "明信片已经生成；手机若没有自动保存，可在打开的图片上长按保存。";
}

function renderGardenSeeds() {
  const seeds = sortGardenByBloomDate(gardenState().seeds || []);
  els.gardenSeedCount.textContent = `${seeds.length} 颗`;
  if (!seeds.length) return renderEmpty(els.gardenSeedList, "第一颗种子，可以藏下一句话或一段回忆。");
  els.gardenSeedList.replaceChildren(...seeds.map((seed) => {
    const opened = seed.unlockDate <= todayString();
    const photo = state.photos.find((item) => item.id === seed.photoId);
    const voice = voiceMessages.find((item) => item.id === seed.voiceId);
    const node = document.createElement("article");
    node.className = `garden-seed-item${opened ? " is-open" : ""}`;
    const attachment = opened
      ? `${photo ? `<img src="${photo.src}" alt="心意种子关联照片">` : ""}${voice?.signedUrl ? `<audio controls preload="none" src="${voice.signedUrl}"></audio>` : ""}`
      : "";
    const copy = opened ? (seed.text ? escapeHTML(seed.text) : "这颗种子藏着一份共同回忆。") : `正在土壤里保守秘密，${formatDate(parseDate(seed.unlockDate))} 开花。`;
    node.innerHTML = `<header><span>${opened ? "已经开花" : "等待发芽"}</span><time>${formatDate(parseDate(seed.unlockDate))}</time></header><p>${copy}</p>${attachment}<small>${people[seed.person]?.short || "我们"}种下</small><button class="delete-button" data-delete-garden-seed="${seed.id}" type="button" aria-label="删除心意种子">×</button>`;
    return node;
  }));
  els.gardenSeedList.querySelectorAll("[data-delete-garden-seed]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("确定移除这颗心意种子吗？")) return;
    gardenState().deletedIds.push(button.dataset.deleteGardenSeed);
    gardenState().deletedIds = [...new Set(gardenState().deletedIds)].slice(-200);
    gardenState().seeds = gardenState().seeds.filter((seed) => seed.id !== button.dataset.deleteGardenSeed);
    persistAndRender("整理心意种子");
  }));
}

function sortGardenByBloomDate(items) {
  return [...items].sort((a, b) => {
    const dateOrder = String(b.unlockDate || b.date || "").localeCompare(String(a.unlockDate || a.date || ""));
    if (dateOrder) return dateOrder;
    return String(b.createdAt || b.updatedAt || "").localeCompare(String(a.createdAt || a.updatedAt || ""));
  });
}

function renderGardenWishes() {
  const wishes = gardenState().wishes || [];
  const completed = wishes.filter((wish) => wish.done).length;
  els.gardenWishCount.textContent = `${completed}/${wishes.length} 盛开`;
  if (!wishes.length) return renderEmpty(els.gardenWishList, "写下一件想一起完成的事，让它先成为花苞。");
  els.gardenWishList.replaceChildren(...wishes.map((wish) => {
    const node = document.createElement("article");
    node.className = `garden-wish-item${wish.done ? " is-done" : ""}`;
    const date = wish.done ? wish.completedAt : wish.targetDate;
    node.innerHTML = `<label><input type="checkbox" data-garden-wish="${wish.id}" ${wish.done ? "checked" : ""}><span aria-hidden="true">${wish.done ? "✿" : "○"}</span><strong>${escapeHTML(wish.text)}</strong></label><small>${wish.done ? "盛开于" : "期待于"} ${date ? formatDate(parseDate(date)) : "未来某天"}</small>${wish.done ? `<input class="garden-complete-date" data-garden-wish-date="${wish.id}" type="date" value="${wish.completedAt || ""}" aria-label="愿望完成日期">` : ""}<button class="delete-button" data-delete-garden-wish="${wish.id}" type="button" aria-label="删除愿望花苞">×</button>`;
    return node;
  }));
  els.gardenWishList.querySelectorAll("[data-garden-wish]").forEach((input) => input.addEventListener("change", () => {
    const wish = gardenState().wishes.find((item) => item.id === input.dataset.gardenWish);
    if (!wish) return;
    wish.done = input.checked;
    wish.completedAt = input.checked ? (wish.completedAt || todayString()) : "";
    wish.updatedAt = new Date().toISOString();
    persistAndRender(input.checked ? "一个愿望开花了" : "愿望重新变成花苞");
  }));
  els.gardenWishList.querySelectorAll("[data-garden-wish-date]").forEach((input) => input.addEventListener("change", () => {
    const wish = gardenState().wishes.find((item) => item.id === input.dataset.gardenWishDate);
    if (wish) {
      wish.completedAt = input.value;
      wish.updatedAt = new Date().toISOString();
    }
    persistAndRender("记录愿望盛开的日期");
  }));
  els.gardenWishList.querySelectorAll("[data-delete-garden-wish]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("确定移除这个愿望花苞吗？")) return;
    gardenState().deletedIds.push(button.dataset.deleteGardenWish);
    gardenState().deletedIds = [...new Set(gardenState().deletedIds)].slice(-200);
    gardenState().wishes = gardenState().wishes.filter((wish) => wish.id !== button.dataset.deleteGardenWish);
    persistAndRender("整理愿望花苞");
  }));
}

function renderGardenFlowers() {
  const garden = gardenState();
  const choices = garden.hybrid.choices;
  const person = currentPerson();
  const other = otherPerson(person);
  const own = choices[person];
  const partner = choices[other];
  els.gardenHybridStatus.textContent = own
    ? `你的${gardenColorNames[own.color]}花瓣已经放好，${partner ? "正在生成新花" : `等待${people[other].short}选择`}`
    : `${partner ? `${people[other].short}已经选好花瓣，轮到你了` : "两个人各选一次，才会生成一朵双色花"}`;
  renderGardenHybridPreview();
  const blooms = [...garden.hybrid.blooms].sort((a, b) => String(b.updatedAt || b.date || "").localeCompare(String(a.updatedAt || a.date || "")));
  els.gardenBloomCount.textContent = `${blooms.length} 朵`;
  els.toggleGardenBlooms.hidden = blooms.length <= 5;
  els.toggleGardenBlooms.textContent = gardenBloomsExpanded ? "收起双色花" : `展开其余 ${Math.max(0, blooms.length - 5)} 朵`;
  if (!blooms.length) {
    renderEmpty(els.gardenBloomGallery, "第一朵双色花，等待两个人各自选一片花瓣。");
  } else {
    els.gardenBloomGallery.replaceChildren(...blooms.slice(0, gardenBloomsExpanded ? blooms.length : 5).map((bloom) => {
      const node = document.createElement("article");
      node.className = "hybrid-bloom";
      const left = { shape: "round", pattern: "solid", center: "sun", layer: "classic", aura: "none", ...(bloom.left || {}) };
      const right = { shape: "round", pattern: "solid", center: "sun", layer: "classic", aura: "none", ...(bloom.right || {}) };
      node.innerHTML = `<span class="hybrid-flower" aria-hidden="true">${hybridFlowerSvg(bloom)}</span><div><strong>${escapeHTML(bloom.name)}</strong><small>${gardenShapeNames[left.shape] || "圆润"} × ${gardenShapeNames[right.shape] || "圆润"} · ${gardenPatternNames[left.pattern] || "纯色"}/${gardenPatternNames[right.pattern] || "纯色"}</small><time>${formatDate(parseDate(bloom.date))} · ${gardenLayerNames[left.layer] || "经典饱满"}/${gardenLayerNames[right.layer] || "经典饱满"} · ${gardenAuraNames[left.aura] || "不加点缀"}/${gardenAuraNames[right.aura] || "不加点缀"}</time></div>`;
      return node;
    }));
  }
  const memories = gardenMemories().slice(0, 16);
  if (!memories.length) return renderEmpty(els.gardenMemoryFlowers, "照片、见面和共同成就会慢慢长成记忆花朵。");
  els.gardenMemoryFlowers.replaceChildren(...memories.map((memory, index) => {
    const node = document.createElement("button");
    node.type = "button";
    node.dataset.gardenMemory = memory.id;
    node.className = `memory-flower memory-flower-${index % 4}`;
    node.innerHTML = `${memory.image ? `<img src="${memory.image}" alt="${escapeHTML(memory.title)}" loading="lazy">` : `<span class="memory-flower-mark" aria-hidden="true">✿</span>`}<div><strong>${escapeHTML(memory.title)}</strong><p>${escapeHTML(memory.copy || memory.title)}</p><small>${memory.date ? formatDate(parseDate(memory.date)) : "共同回忆"} · ${escapeHTML(memory.type)}</small></div><i class="memory-flower-arrow" aria-hidden="true">›</i>`;
    return node;
  }));
}

function gardenMemories() {
  const memories = [];
  state.photos.forEach((photo) => memories.push({ id: `photo-${photo.id}`, type: "照片", title: photo.caption || "一张共同照片", copy: `你们在${formatDate(parseDate(photo.date))}留下的一张照片。`, date: photo.date, image: photo.src }));
  state.meetings.filter((item) => item.date).forEach((item) => memories.push({ id: `meeting-${item.id}`, type: "见面", title: item.title, copy: [item.place, item.note].filter(Boolean).join(" · ") || "一次值得收藏的见面。", date: item.date }));
  state.gameRecords.forEach((item) => memories.push({ id: `game-${item.id}`, type: "游戏", title: item.game, copy: item.achievement || "一起玩过的一段开心时光。", date: item.date, image: item.image }));
  state.messages.slice(0, 24).forEach((item) => memories.push({ id: `message-${item.id}`, type: "留言", title: shortGardenLabel(item.text, 24), copy: item.text, date: item.date, person: item.person }));
  const customAchievements = new Map((state.achievements.custom || []).map((item) => [item.id, item.text]));
  Object.entries(state.achievements.completed || {}).forEach(([id, record]) => {
    if (!achievementIsDone(record)) return;
    const definition = achievementDefinitions.find((item) => item.id === id);
    const title = state.achievements.edits?.[id] || customAchievements.get(id) || definition?.text;
    if (title) memories.push({ id: `achievement-${id}`, type: "成就", title, copy: "一件由你们共同完成的小事。", date: typeof record === "string" ? record : record?.date || "" });
  });
  return memories.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

function openGardenMemory(memoryId) {
  const memory = gardenMemories().find((item) => item.id === memoryId);
  if (!memory) return;
  els.gardenMemoryType.textContent = `${memory.type} · MEMORIES IN BLOOM`;
  els.gardenMemoryDialogTitle.textContent = memory.title;
  els.gardenMemoryMeta.textContent = [memory.person ? `${people[memory.person]?.name || "我们"}留下` : "共同收藏", memory.date ? formatDate(parseDate(memory.date)) : "某个值得记住的日子"].join(" · ");
  els.gardenMemoryDialogText.textContent = memory.copy || memory.title;
  if (memory.image) {
    els.gardenMemoryImage.src = memory.image;
    els.gardenMemoryImage.alt = memory.title;
    els.gardenMemoryImage.hidden = false;
  } else {
    els.gardenMemoryImage.removeAttribute("src");
    els.gardenMemoryImage.hidden = true;
  }
  if (!els.gardenMemoryDialog.open) els.gardenMemoryDialog.showModal();
}

function gardenDailyMemory() {
  const memories = gardenMemories();
  if (!memories.length) return null;
  const seed = [...todayString()].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return memories[seed % memories.length];
}

function gardenSeasonKey(date = new Date()) {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return `${date.getFullYear()}-spring`;
  if (month >= 5 && month <= 7) return `${date.getFullYear()}-summer`;
  if (month >= 8 && month <= 10) return `${date.getFullYear()}-autumn`;
  return `${month === 11 ? date.getFullYear() : date.getFullYear() - 1}-winter`;
}

function gardenSeasonDescriptor(key) {
  const [yearText, season] = String(key || "").split("-");
  const year = Number(yearText) || new Date().getFullYear();
  const names = { spring: "春季", summer: "夏季", autumn: "秋季", winter: "冬季" };
  const starts = { spring: [year, 2, 1], summer: [year, 5, 1], autumn: [year, 8, 1], winter: [year, 11, 1] };
  const ends = { spring: [year, 5, 0], summer: [year, 8, 0], autumn: [year, 11, 0], winter: [year + 1, 2, 0] };
  const start = localDateString(new Date(...(starts[season] || starts.spring)));
  const end = localDateString(new Date(...(ends[season] || ends.spring)));
  return { key: `${year}-${season || "spring"}`, year, season: season || "spring", name: names[season] || "春季", label: `${year} · ${names[season] || "春季"}`, start, end };
}

function gardenSeasonKeys() {
  const dated = [state.startDate, ...gardenMemories().map((item) => item.date), ...(state.studyLogs || []).map((item) => item.date), ...effectiveGardenPointEvents().map((item) => item.date)].filter(Boolean).sort();
  const earliest = dated[0] || todayString();
  const current = gardenSeasonDescriptor(gardenSeasonKey());
  const cursor = parseDate(current.start);
  const result = [];
  for (let index = 0; index < 20; index += 1) {
    const key = gardenSeasonKey(cursor);
    const descriptor = gardenSeasonDescriptor(key);
    result.push(descriptor);
    if (result.length >= 4 && descriptor.start <= earliest) break;
    cursor.setMonth(cursor.getMonth() - 3);
  }
  return result;
}

function gardenYearbookData(key) {
  const descriptor = gardenSeasonDescriptor(key);
  const inSeason = (date) => Boolean(date && date >= descriptor.start && date <= descriptor.end);
  const memories = gardenMemories().filter((item) => inSeason(item.date));
  const events = effectiveGardenPointEvents().filter((item) => inSeason(item.date));
  const studies = (state.studyLogs || []).filter((item) => inSeason(item.date));
  const blooms = (gardenState().hybrid.blooms || []).filter((item) => inSeason(item.date));
  const wateredDays = Object.keys(gardenState().waterings || {}).filter(inSeason).length;
  const selectedId = gardenState().yearbookHighlights?.[descriptor.key]?.memoryId || "";
  const highlight = memories.find((item) => item.id === selectedId) || memories[0] || null;
  return {
    ...descriptor,
    memories,
    events,
    studies,
    blooms,
    wateredDays,
    highlight,
    points: events.reduce((total, item) => total + Number(item.points || 0), 0)
  };
}

function renderGardenYearbook() {
  const seasons = gardenSeasonKeys();
  if (!activeYearbookKey || !seasons.some((item) => item.key === activeYearbookKey)) activeYearbookKey = seasons[0]?.key || gardenSeasonKey();
  els.gardenYearbookSeason.innerHTML = seasons.map((item) => `<option value="${item.key}">${item.label}</option>`).join("");
  els.gardenYearbookSeason.value = activeYearbookKey;
  const data = gardenYearbookData(activeYearbookKey);
  const selectedId = gardenState().yearbookHighlights?.[data.key]?.memoryId || "";
  els.gardenYearbookHighlight.innerHTML = `<option value="">自动选择</option>${data.memories.map((item) => `<option value="${item.id}">${escapeHTML(formatDate(parseDate(item.date)))} · ${escapeHTML(shortGardenLabel(item.title, 22))}</option>`).join("")}`;
  els.gardenYearbookHighlight.value = data.memories.some((item) => item.id === selectedId) ? selectedId : "";
  els.gardenYearbookPreview.dataset.season = data.season;
  els.gardenYearbookRange.textContent = `${formatDate(parseDate(data.start))} - ${formatDate(parseDate(data.end))}`;
  els.gardenYearbookTitle.textContent = `${data.label}，我们一起留下的花园`;
  els.gardenYearbookMemory.textContent = data.highlight ? `${data.highlight.title}：${data.highlight.copy || data.highlight.title}` : "这一季还没有共同回忆，下一条记录会成为这里的第一朵花。";
  els.gardenYearbookStats.innerHTML = `<span><b>${data.points}</b>心意值</span><span><b>${data.memories.length}</b>共同回忆</span><span><b>${data.studies.length}</b>学习打卡</span><span><b>${data.wateredDays}</b>浇水日</span>`;
  els.gardenYearbookArchive.replaceChildren(...seasons.map((season) => {
    const item = gardenYearbookData(season.key);
    const node = document.createElement("button");
    node.type = "button";
    node.dataset.yearbookKey = item.key;
    node.className = item.key === data.key ? "is-active" : "";
    node.innerHTML = `<span data-season="${item.season}">${item.name.slice(0, 1)}</span><div><strong>${item.label}</strong><small>${item.memories.length} 段回忆 · ${item.points} 心意值</small></div><i aria-hidden="true">›</i>`;
    node.addEventListener("click", () => {
      activeYearbookKey = item.key;
      renderGardenYearbook();
      els.gardenYearbookPreview.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return node;
  }));
}

function saveGardenYearbook() {
  const data = gardenYearbookData(els.gardenYearbookSeason.value || activeYearbookKey || gardenSeasonKey());
  const palette = {
    spring: ["#edf5ed", "#d87f91", "#5d8067"], summer: ["#e7f2e9", "#5f9272", "#e1ac57"],
    autumn: ["#f5eee2", "#b57756", "#7c7651"], winter: ["#edf1f3", "#8093a7", "#a798bd"]
  }[data.season] || ["#edf5ed", "#d87f91", "#5d8067"];
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  const context = canvas.getContext("2d");
  const background = context.createLinearGradient(0, 0, 1080, 1440);
  background.addColorStop(0, palette[0]);
  background.addColorStop(1, "#fffaf6");
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1440);
  context.fillStyle = palette[2];
  context.beginPath();
  context.arc(860, 220, 125, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "rgba(255,255,255,.72)";
  context.beginPath();
  context.arc(820, 180, 125, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = palette[1];
  context.font = "700 34px Georgia,serif";
  context.fillText("LIU & FU · FOUR SEASONS", 90, 115);
  context.fillStyle = "#35312f";
  context.font = '700 66px "Microsoft YaHei",sans-serif';
  context.fillText(`${data.label}花园年鉴`, 90, 225);
  context.fillStyle = "#77716e";
  context.font = '400 30px "Microsoft YaHei",sans-serif';
  context.fillText(`${formatDate(parseDate(data.start))} - ${formatDate(parseDate(data.end))}`, 90, 285);
  context.fillStyle = "rgba(255,255,255,.76)";
  context.fillRect(70, 355, 940, 620);
  context.fillStyle = palette[2];
  context.font = '700 34px "Microsoft YaHei",sans-serif';
  context.fillText("这一季的代表回忆", 120, 440);
  context.fillStyle = "#34312f";
  context.font = '700 46px "Microsoft YaHei",sans-serif';
  canvasWrappedText(context, data.highlight?.title || "我们的四季正在生长", 120, 530, 820, 62, 2);
  context.fillStyle = "#706b68";
  context.font = '400 31px "Microsoft YaHei",sans-serif';
  canvasWrappedText(context, data.highlight?.copy || "这一季的第一段共同回忆，还在等待你们写下。", 120, 680, 820, 49, 4);
  const stats = [[data.points, "心意值"], [data.memories.length, "共同回忆"], [data.studies.length, "学习打卡"], [data.wateredDays, "浇水日"]];
  stats.forEach(([value, label], index) => {
    const x = 95 + index * 235;
    context.fillStyle = palette[0];
    context.fillRect(x, 1030, 205, 150);
    context.fillStyle = palette[2];
    context.font = "700 46px Georgia,serif";
    context.fillText(String(value), x + 25, 1095);
    context.fillStyle = "#6d6865";
    context.font = '400 27px "Microsoft YaHei",sans-serif';
    context.fillText(label, x + 25, 1145);
  });
  context.fillStyle = palette[1];
  context.font = "700 26px Georgia,serif";
  context.fillText("刘向强 ♥ 付嘉颖 · 一起生长的第一个又一个四季", 90, 1325);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png", .94);
  link.download = `刘向强-付嘉颖-花园年鉴-${data.key}.png`;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function renderGardenGrowth() {
  const garden = gardenState();
  const points = Math.max(Number(garden.points || 0), calculateGardenPoints());
  const stageIndex = gardenStageIndex(points);
  const nextStage = gardenStages[stageIndex + 1];
  const events = effectiveGardenPointEvents();
  renderGardenDecorations(points);
  renderGardenYearbook();
  els.gardenSnapshotCount.textContent = `${garden.snapshots.length} 次`;
  els.gardenStageProgressText.textContent = nextStage ? `${points} / ${nextStage.min}` : `${points} · 已抵达最高阶段`;
  els.gardenStageRemaining.textContent = nextStage ? `距离「${nextStage.name}」还差 ${Math.max(0, nextStage.min - points)} 心意值` : "四季秘境会继续收藏此后的每一份心意";
  els.gardenRoadmap.replaceChildren(...gardenStages.map((stage, index) => {
    const node = document.createElement("article");
    node.className = index < stageIndex ? "is-complete" : (index === stageIndex ? "is-current" : "is-locked");
    node.innerHTML = `<span>${index < stageIndex ? "✓" : index + 1}</span><div><strong>${stage.name}</strong><small>${stage.min} 心意值 · ${stage.reward}</small></div>`;
    return node;
  }));

  const totals = new Map();
  if (Number(garden.baselinePoints || 0) > 0) totals.set("baseline", Number(garden.baselinePoints));
  events.forEach((event) => totals.set(event.category, (totals.get(event.category) || 0) + Number(event.points || 0)));
  if (!totals.size) {
    renderEmpty(els.gardenPointBreakdown, "第一次共同浇水后，这里会出现清楚的心意值来源。");
  } else {
    els.gardenPointBreakdown.replaceChildren(...[...totals.entries()].sort((a, b) => b[1] - a[1]).map(([category, total]) => {
      const item = gardenPointCategories[category] || { name: "共同生活", icon: "heart" };
      const node = document.createElement("article");
      node.innerHTML = `<span><i data-lucide="${item.icon}" aria-hidden="true"></i></span><div><strong>${item.name}</strong><small>${category === "baseline" ? "升级前已经积累" : `${events.filter((event) => event.category === category).length} 次记录`}</small></div><b>+${total}</b>`;
      return node;
    }));
  }

  const recentEvents = [...events].sort((a, b) => `${b.createdAt || b.date}-${b.id}`.localeCompare(`${a.createdAt || a.date}-${a.id}`)).slice(0, 24);
  els.gardenLedgerSummary.textContent = `${events.length} 笔 · ${points} 心意值`;
  if (!recentEvents.length) {
    els.gardenPointLedger.innerHTML = Number(garden.baselinePoints || 0) > 0
      ? `<article data-category="baseline"><span class="garden-ledger-icon"><i data-lucide="heart" aria-hidden="true"></i></span><div><strong>旧版花园成长值</strong><small>升级时完整保留</small></div><b>+${garden.baselinePoints}</b></article>`
      : `<p class="empty">新的心意值明细会从升级后的第一次互动开始记录。</p>`;
  } else {
    els.gardenPointLedger.replaceChildren(...recentEvents.map((event) => {
      const node = document.createElement("article");
      const category = gardenPointCategories[event.category] || { name: "共同生活", icon: "heart" };
      node.dataset.category = event.category || "shared";
      node.innerHTML = `<span class="garden-ledger-icon"><i data-lucide="${category.icon}" aria-hidden="true"></i></span><div><strong>${escapeHTML(event.label)}</strong><small>${formatDate(parseDate(event.date))} · ${category.name}</small></div><b>+${event.points}</b>`;
      return node;
    }));
  }

  els.gardenAreaProgress.replaceChildren(...gardenAreaDefinitions.map((area) => {
    const unlocked = points >= area.threshold;
    const node = document.createElement("article");
    node.className = `garden-area${unlocked ? " is-unlocked" : ""}`;
    node.innerHTML = `<span aria-hidden="true">${unlocked ? "✓" : "◇"}</span><div><strong>${area.name}</strong><small>${unlocked ? area.copy : `还差 ${area.threshold - points} 心意值`}</small></div>`;
    return node;
  }));
  window.lucide?.createIcons();
  if (!garden.snapshots.length) return renderEmpty(els.gardenTimeline, "花园第一次发芽时，会从这里开始记录。");
  els.gardenTimeline.replaceChildren(...garden.snapshots.slice(0, 24).map((snapshot) => {
    const stage = gardenStages[gardenStageIndex(Number(snapshot.points || 0))];
    const node = document.createElement("article");
    node.className = "garden-timeline-item";
    node.innerHTML = `<span aria-hidden="true"></span><div><header><strong>${stage.name}</strong><time>${formatDate(parseDate(snapshot.date))}</time></header><p>${escapeHTML(snapshot.reason || stage.copy)}</p><small>${snapshot.points} 心意值</small></div>`;
    return node;
  }));
}

function positionGardenRoadmap() {
  const stageIndex = gardenStageIndex(Math.max(Number(gardenState().points || 0), calculateGardenPoints()));
  if (els.gardenRoadmap.dataset.positionedStage === String(stageIndex)) return;
  window.requestAnimationFrame(() => {
    const current = els.gardenRoadmap.children[stageIndex];
    if (!current || !current.offsetWidth) return;
    els.gardenRoadmap.scrollLeft = Math.max(0, current.offsetLeft - 3);
    els.gardenRoadmap.dataset.positionedStage = String(stageIndex);
  });
}

function renderGardenDecorations(points) {
  const garden = gardenState();
  const layerOrder = { atmosphere: 0, structure: 1, overhead: 2, hanging: 2, path: 3, left: 4, right: 4, foreground: 5 };
  const enabled = gardenDecorations
    .filter((item) => garden.decorationStates[item.id]?.enabled && gardenDecorationUnlocked(item, garden, points))
    .sort((a, b) => (layerOrder[a.slot] || 0) - (layerOrder[b.slot] || 0));
  ["left", "right", "path", "structure", "overhead", "hanging", "atmosphere"].forEach((slot) => {
    els.gardenStage.classList.toggle(`has-${slot}-decoration`, enabled.some((item) => item.slot === slot));
  });
  ["stones", "bridge", "starlight", "pavilion"].forEach((id) => {
    els.gardenStage.classList.toggle(`has-decor-${id}`, enabled.some((item) => item.id === id));
  });
  els.gardenSceneDecoration.dataset.decorationCount = String(enabled.length);
  els.gardenSceneDecoration.innerHTML = enabled.map((item) => `<span class="garden-decoration-layer" data-decoration-slot="${item.slot}" data-decoration-id="${item.id}">${gardenDecorationMarkup(item.id)}</span>`).join("");
  els.gardenDecorationList.replaceChildren(...gardenDecorations.map((item) => {
    const unlocked = gardenDecorationUnlocked(item, garden, points);
    const active = Boolean(garden.decorationStates[item.id]?.enabled && unlocked);
    const node = document.createElement("button");
    node.type = "button";
    node.dataset.gardenDecoration = item.id;
    node.disabled = !unlocked;
    node.className = active ? "is-active" : "";
    node.innerHTML = `<span aria-hidden="true"><i data-lucide="${unlocked ? item.icon : "lock-keyhole"}"></i></span><strong>${item.name}</strong><small>${unlocked ? (active ? "已布置 · 点击收起" : `布置在${gardenSlotName(item.slot)}`) : `${item.threshold} 心意值解锁 · 还差 ${Math.max(0, item.threshold - points)}`}</small><i aria-hidden="true">${active ? "✓" : ""}</i>`;
    return node;
  }));
  window.lucide?.createIcons();
}

function gardenDecorationUnlocked(item, garden, points) {
  return points >= item.threshold || Boolean(garden.decorationStates[item.id]?.legacy);
}

function gardenSlotName(slot) {
  return ({ foreground: "前景", path: "小径", overhead: "花房上方", atmosphere: "氛围层", left: "左侧", right: "右侧", hanging: "檐下", structure: "远景" })[slot] || "花园";
}

function gardenDecorationMarkup(id) {
  const art = (viewBox, content) => `<svg class="garden-decoration-art" viewBox="${viewBox}" role="presentation" aria-hidden="true">${content}</svg>`;
  const leaf = (x, y, rotation = 0, fill = "#739a75") => `<ellipse cx="${x}" cy="${y}" rx="10" ry="5" fill="${fill}" transform="rotate(${rotation} ${x} ${y})"/><path d="M${x - 7} ${y + 1}l14-2" stroke="#b9cfaa" stroke-width="1" transform="rotate(${rotation} ${x} ${y})"/>`;
  const flower = (x, y, fill = "#db8796") => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((turn) => `<ellipse cy="-7" rx="4.3" ry="8" fill="${fill}" transform="rotate(${turn})"/>`).join("")}<circle r="3.2" fill="#f2cf75"/></g>`;
  const markup = {
    mushrooms: art("0 0 130 88", `<ellipse cx="65" cy="80" rx="58" ry="7" fill="#42654d" opacity=".18"/><g stroke="#8e7166" stroke-width="1.5"><path d="M27 72V44M67 75V31M102 72V51" stroke="#f5e8d1" stroke-width="10" stroke-linecap="round"/><path d="M9 47C13 29 42 25 49 47Z" fill="#d98291"/><path d="M43 35C48 14 85 12 91 36Z" fill="#c96f83"/><path d="M84 54C88 38 113 36 120 54Z" fill="#e5a0a9"/></g><g fill="#f7d8d5"><circle cx="27" cy="37" r="3"/><circle cx="62" cy="25" r="4"/><circle cx="77" cy="28" r="2.5"/><circle cx="102" cy="47" r="2.5"/></g>`),
    stones: art("0 0 320 58", `<path d="M18 44Q160 18 302 44" fill="none" stroke="#709177" stroke-width="7" opacity=".25"/>${[[14,26,50,20],[62,18,43,19],[110,24,48,20],[166,17,43,18],[210,24,45,19],[258,18,48,21]].map(([x,y,w,h], index) => `<g><ellipse cx="${x + w / 2}" cy="${y + h + 4}" rx="${w / 2}" ry="5" fill="#42634e" opacity=".14"/><path d="M${x} ${y + h}Q${x + 4} ${y + 3} ${x + w / 2} ${y}Q${x + w - 4} ${y + 4} ${x + w} ${y + h}Z" fill="${index % 2 ? "#d5d9cc" : "#ece9dc"}" stroke="#b8c4b5" stroke-width="1.4"/><path d="M${x + 9} ${y + 10}Q${x + w / 2} ${y + 4} ${x + w - 8} ${y + 9}" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/></g>`).join("")}`),
    planters: art("0 0 145 118", `<ellipse cx="73" cy="108" rx="61" ry="7" fill="#385641" opacity=".16"/><g>${[[26,55,37],[72,45,42],[113,59,34]].map(([x,y,w], index) => `<g><path d="M${x - w / 2} ${y + 14}H${x + w / 2}L${x + w * .34} 104H${x - w * .34}Z" fill="${index === 1 ? "#c67d6b" : "#d29279"}"/><path d="M${x - w / 2 - 3} ${y + 9}H${x + w / 2 + 3}V${y + 18}H${x - w / 2 - 3}Z" rx="4" fill="#b86f62"/><path d="M${x} ${y + 9}C${x - 3} ${y - 10} ${x - 10} ${y - 18} ${x - 5} ${y - 33}M${x} ${y + 8}C${x + 2} ${y - 8} ${x + 11} ${y - 18} ${x + 8} ${y - 30}" fill="none" stroke="#5b8966" stroke-width="4" stroke-linecap="round"/>${leaf(x - 7,y - 19,-25)}${leaf(x + 8,y - 14,25,"#8bb08a")}${flower(x + (index - 1) * 2,y - 31,index === 1 ? "#e0a654" : "#d98594")}</g>`).join("")}</g>`),
    lights: art("0 0 320 70", `<path d="M8 13Q160 53 312 13" fill="none" stroke="#566b59" stroke-width="2.6"/>${[35,76,118,160,202,244,285].map((x,index) => { const y = 13 + 32 * (1 - Math.abs(160 - x) / 152); return `<g><path d="M${x} ${y - 2}v9" stroke="#566b59" stroke-width="2"/><rect x="${x - 6}" y="${y + 6}" width="12" height="16" rx="5" fill="${index % 3 === 1 ? "#f5c9cb" : index % 3 === 2 ? "#d8d1ef" : "#ffe39a"}" stroke="#fff7df" stroke-width="2"/><circle cx="${x}" cy="${y + 14}" r="10" fill="#ffe6a1" opacity=".17"/></g>`;}).join("")}`),
    picnic: art("0 0 150 105", `<ellipse cx="75" cy="91" rx="68" ry="9" fill="#3e6048" opacity=".14"/><path d="M13 39Q73 25 135 47L124 93Q67 103 17 82Z" fill="#f5e5d9" stroke="#d39aa0" stroke-width="2"/><path d="M19 46L119 91M45 34l83 43M17 68l55 29M49 34L18 78M80 34L42 96M111 40L77 98" stroke="#d98792" stroke-width="7" opacity=".72"/><g transform="translate(68 47)"><path d="M-15 3Q0-9 15 3V27H-15Z" fill="#a86f4e"/><path d="M-13 3Q0 10 13 3" fill="none" stroke="#e2ac75" stroke-width="2"/><circle cx="-18" cy="28" r="8" fill="#f0cd68"/><circle cx="23" cy="25" r="7" fill="#dd8b98"/></g>`),
    ribbon: art("0 0 320 58", `<path d="M10 13Q160 29 310 13" fill="none" stroke="#5f775f" stroke-width="2.5"/>${[[48,"#d97f91"],[120,"#e7b65e"],[198,"#9e91c5"],[270,"#75a488"]].map(([x,color], index) => `<g><path d="M${x} ${18 + index % 2 * 4}v28l10-7 10 7V20" fill="${color}" stroke="rgba(92,76,73,.16)" stroke-width="1.2"/><circle cx="${x + 10}" cy="${18 + index % 2 * 4}" r="4" fill="#f8eee5"/></g>`).join("")}`),
    bench: art("0 0 165 112", `<ellipse cx="82" cy="103" rx="70" ry="7" fill="#3f6148" opacity=".15"/><g stroke="#6f5045" stroke-width="4" stroke-linejoin="round"><path d="M25 31H140V62H25Z" fill="#b98261"/><path d="M19 67H146V80H19Z" fill="#c8906b"/><path d="M31 80l-8 23M134 80l8 23M37 62v5M128 62v5" fill="none" stroke-linecap="round"/></g><path d="M34 41H131M34 52H131M30 73H135" stroke="#e5b28b" stroke-width="2" opacity=".55"/>${flower(43,27,"#dc8796")}${flower(124,27,"#f0bd61")}`),
    mailbox: art("0 0 115 155", `<ellipse cx="57" cy="147" rx="38" ry="6" fill="#405e48" opacity=".14"/><path d="M57 78V145" stroke="#735447" stroke-width="8"/><path d="M20 34Q22 13 46 13H77Q95 15 96 34V76H20Z" fill="#c87968" stroke="#865b54" stroke-width="3"/><path d="M58 16V76" stroke="#985f58" stroke-width="2" opacity=".5"/><path d="M68 33h27v10H68Z" fill="#e7b25f"/><path d="M77 33V15" stroke="#84624d" stroke-width="4"/><path d="M77 15h20v13H77Z" fill="#df8695"/><path d="M40 43C40 35 50 33 54 40C58 33 68 35 68 43C68 51 54 59 54 59S40 51 40 43Z" fill="#f8d4d4"/>`),
    birdhouse: art("0 0 110 160", `<ellipse cx="55" cy="151" rx="37" ry="6" fill="#3e5f47" opacity=".14"/><path d="M55 93V151" stroke="#6b5146" stroke-width="7"/><path d="M19 53L55 17L91 53V105H19Z" fill="#b87061" stroke="#78544d" stroke-width="3"/><path d="M12 55L55 10L98 55" fill="none" stroke="#79554d" stroke-width="9" stroke-linecap="round"/><circle cx="55" cy="66" r="12" fill="#4f423c"/><path d="M43 93h24" stroke="#e8b76e" stroke-width="5" stroke-linecap="round"/>${leaf(27,111,-35)}${leaf(82,119,28,"#8fb08b")}`),
    windchime: art("0 0 110 165", `<path d="M55 4V24" stroke="#6a6f65" stroke-width="3"/><path d="M26 30Q55 12 84 30L76 43H34Z" fill="#d9d9cf" stroke="#8e978e" stroke-width="2"/><circle cx="55" cy="23" r="5" fill="#e6b65f"/><g fill="#eef0ea" stroke="#9ca59e" stroke-width="1.5">${[34,48,62,76].map((x,index) => `<rect x="${x - 5}" y="48" width="10" height="${45 + index % 2 * 12}" rx="5"/><path d="M${x} 43V48M${x} ${93 + index % 2 * 12}v13" fill="none"/>`).join("")}</g><path d="M55 43V127" stroke="#999e95" stroke-width="2"/><path d="M55 119C39 126 39 145 55 157C71 145 71 126 55 119Z" fill="#d98796"/><circle cx="55" cy="109" r="6" fill="#e8bd69"/>`),
    arch: art("0 0 320 300", `<path d="M49 291V139C49 37 271 37 271 139V291M70 291V142C70 62 250 62 250 142V291" fill="none" stroke="#58775f" stroke-width="12"/><path d="M58 266Q160 233 261 266" fill="none" stroke="#71966f" stroke-width="7"/>${[[58,100],[83,63],[126,48],[171,48],[216,66],[258,102],[69,181],[250,186]].map(([x,y],index) => `${leaf(x,y,index % 2 ? 25 : -25,index % 3 ? "#789f78" : "#91b18c")}${index % 2 ? flower(x + 4,y - 7,index % 3 ? "#dc8797" : "#a99bcd") : ""}`).join("")}`),
    lanterns: art("0 0 320 126", `<path d="M35 21Q160 45 285 21" fill="none" stroke="#637663" stroke-width="3"/>${[[78,32],[242,32]].map(([x,y],index) => `<g><path d="M${x} ${y - 5}v14" stroke="#665c50" stroke-width="3"/><path d="M${x - 17} ${y + 10}Q${x} ${y - 1} ${x + 17} ${y + 10}L${x + 13} ${y + 54}Q${x} ${y + 65} ${x - 13} ${y + 54}Z" fill="${index ? "#efc967" : "#dc8a96"}" stroke="#8a6559" stroke-width="2"/><path d="M${x - 16} ${y + 20}H${x + 16}M${x - 14} ${y + 45}H${x + 14}M${x} ${y + 8}V${y + 61}" stroke="#fff0c5" stroke-width="2" opacity=".55"/><path d="M${x} ${y + 65}v22" stroke="#9d6b5d" stroke-width="2"/><circle cx="${x}" cy="${y + 91}" r="3" fill="#eab965"/></g>`).join("")}`),
    butterflyhouse: art("0 0 125 155", `<ellipse cx="62" cy="147" rx="45" ry="6" fill="#3d5e47" opacity=".15"/><path d="M62 99V149" stroke="#76584b" stroke-width="7"/><path d="M20 50L62 16L104 50V112H20Z" fill="#e0b271" stroke="#8d6e57" stroke-width="3"/><path d="M13 52L62 10L111 52" fill="none" stroke="#887062" stroke-width="8" stroke-linecap="round"/><path d="M52 59h20M52 70h20M52 81h20" stroke="#6d665b" stroke-width="4" stroke-linecap="round"/><g fill="#d98091"><path d="M39 92C26 82 25 68 38 70C46 72 48 80 48 85C48 80 50 72 58 70C71 68 70 82 57 92C50 97 46 97 39 92Z"/><circle cx="48" cy="85" r="2" fill="#674f4a"/></g>`),
    swing: art("0 0 170 275", `<path d="M26 18H144" stroke="#6c5147" stroke-width="9" stroke-linecap="round"/><path d="M46 22V205M124 22V205" stroke="#dfc8a5" stroke-width="3"/><path d="M39 198Q85 211 131 198L125 225Q85 236 45 225Z" fill="#b77b5e" stroke="#755249" stroke-width="3"/><path d="M51 211Q85 219 119 211" stroke="#e7ae83" stroke-width="2"/><path d="M30 19C35 66 20 112 14 145M140 18C132 61 147 106 157 140" fill="none" stroke="#64866a" stroke-width="5"/>${leaf(24,66,-35)}${leaf(145,75,35,"#91b18c")}${flower(18,108,"#da8494")}${flower(152,119,"#b0a0cf")}`),
    fountain: art("0 0 160 185", `<ellipse cx="80" cy="174" rx="68" ry="8" fill="#3d6047" opacity=".15"/><path d="M80 31C56 54 62 74 80 82C98 74 104 54 80 31Z" fill="#a9d4cf" opacity=".75"/><path d="M80 71V105" stroke="#b4b6aa" stroke-width="9"/><path d="M38 97Q80 80 122 97L113 120Q80 134 47 120Z" fill="#d8d5c7" stroke="#929d91" stroke-width="3"/><path d="M23 120Q80 99 137 120V151Q80 174 23 151Z" fill="#c7ccbf" stroke="#87968a" stroke-width="4"/><path d="M31 126Q80 144 129 126" fill="none" stroke="#8fc6c1" stroke-width="8" opacity=".8"/><path d="M80 31C77 52 54 61 47 78M80 31C83 52 106 61 113 78" fill="none" stroke="#8fc9c3" stroke-width="3" stroke-linecap="round"/>`),
    pond: art("0 0 190 105", `<ellipse cx="95" cy="75" rx="84" ry="26" fill="#82b2ab" stroke="#5f8978" stroke-width="4"/><ellipse cx="95" cy="69" rx="68" ry="17" fill="#a8d1c8" opacity=".7"/><path d="M35 70Q62 58 84 70M106 72Q132 57 155 69" fill="none" stroke="#e9f5e9" stroke-width="2" opacity=".6"/><g fill="#6e9b72">${[[55,62],[118,63],[143,73]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="7"/><path d="M${x} ${y}l10-7" stroke="#a8c89f" stroke-width="2"/>`).join("")}</g>${flower(126,47,"#e5a3ad")}<g fill="#d6d6c8"><ellipse cx="22" cy="82" rx="18" ry="9"/><ellipse cx="168" cy="88" rx="17" ry="8"/></g>`),
    bridge: art("0 0 320 135", `<path d="M24 97Q160 8 296 97L282 123Q160 64 38 123Z" fill="#b47d60" stroke="#78544a" stroke-width="4"/><path d="M51 91Q160 29 269 91" fill="none" stroke="#e1ad80" stroke-width="5"/>${[56,91,126,161,196,231,266].map((x,index) => `<path d="M${x} ${76 - Math.abs(161 - x) * .18}L${x - 2} ${108 - Math.abs(161 - x) * .08}" stroke="#835d4e" stroke-width="3"/>`).join("")}<path d="M35 75Q160-9 285 75M35 75v35M285 75v35" fill="none" stroke="#647b61" stroke-width="5"/>`),
    shelf: art("0 0 270 190", `<path d="M20 52H250M20 128H250" stroke="#8b654e" stroke-width="12" stroke-linecap="round"/><path d="M42 58V177M228 58V177" stroke="#725044" stroke-width="7"/><g>${[[62,92],[132,89],[202,94]].map(([x,y],index) => `<g><path d="M${x - 22} ${y}H${x + 22}L${x + 16} ${y + 35}H${x - 16}Z" fill="${index === 1 ? "#c37c6c" : "#d49a77"}"/><path d="M${x} ${y}C${x - 2} ${y - 15} ${x - 10} ${y - 26} ${x - 4} ${y - 40}M${x} ${y}C${x + 2} ${y - 13} ${x + 9} ${y - 24} ${x + 7} ${y - 36}" fill="none" stroke="#638d6b" stroke-width="4"/>${flower(x - 4,y - 39,index === 1 ? "#aaa0cc" : "#d98291")}</g>`).join("")}</g><rect x="85" y="136" width="102" height="34" rx="4" fill="#eee2ce"/><path d="M96 147h80M96 158h55" stroke="#b49578" stroke-width="3" stroke-linecap="round"/>`),
    flowercart: art("0 0 185 145", `<ellipse cx="93" cy="134" rx="79" ry="7" fill="#3f6048" opacity=".15"/><path d="M29 59H151L140 111H40Z" fill="#b8795f" stroke="#755049" stroke-width="4"/><path d="M35 70h110M38 87h104" stroke="#e1a57b" stroke-width="3"/><circle cx="55" cy="118" r="18" fill="#6e574b"/><circle cx="55" cy="118" r="8" fill="#d8b27c"/><circle cx="133" cy="118" r="18" fill="#6e574b"/><circle cx="133" cy="118" r="8" fill="#d8b27c"/><path d="M151 65h23v37" fill="none" stroke="#765248" stroke-width="6" stroke-linecap="round"/><g>${flower(52,49,"#d98292")}${flower(78,40,"#efbc62")}${flower(105,47,"#aba0cc")}${flower(130,38,"#e49aa5")}${leaf(62,54,-25)}${leaf(118,53,25,"#8fb08a")}</g>`),
    starlight: art("0 0 320 230", `<path d="M22 202Q160 12 298 202" fill="none" stroke="#f7e4a3" stroke-width="1.5" stroke-dasharray="4 9" opacity=".42"/><g fill="#ffeaa1">${[[34,72,3],[75,132,2],[121,54,2.8],[159,105,2],[203,46,3],[244,116,2.4],[286,77,2.7],[271,174,2]].map(([x,y,r],index) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r * 3.5}" fill="${index % 2 ? "#d9d2ef" : "#ffe6a5"}" opacity=".12"/>`).join("")}</g><g fill="#fff3c3" opacity=".9"><path d="M92 84l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/><path d="M224 151l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></g>`),
    moonlamp: art("0 0 110 115", `<circle cx="55" cy="56" r="42" fill="#fff4c9" opacity=".17"/><circle cx="55" cy="52" r="31" fill="#f9e8ac" stroke="#fff7dc" stroke-width="5"/><path d="M66 23C47 27 41 49 51 64C58 75 72 78 82 71C73 87 49 92 34 77C17 60 23 31 45 22C52 19 59 20 66 23Z" fill="#fffdf1" opacity=".85"/><path d="M55 87v17" stroke="#8b7259" stroke-width="4"/><path d="M39 105h32" stroke="#8b7259" stroke-width="7" stroke-linecap="round"/>`),
    moongate: art("0 0 320 310", `<path d="M35 300H285M64 300V158C64 29 256 29 256 158V300M91 300V160C91 70 229 70 229 160V300" fill="none" stroke="#c8c7b9" stroke-width="18"/><path d="M67 292H253" stroke="#8f9f8e" stroke-width="8"/><path d="M72 102Q160 45 248 102" fill="none" stroke="#e8e5d5" stroke-width="4"/>${flower(83,118,"#db8797")}${flower(238,132,"#b0a3cf")}${leaf(73,149,-35)}${leaf(246,165,35,"#8fb08a")}`),
    pavilion: art("0 0 330 320", `<path d="M44 102Q165 14 286 102L269 125H61Z" fill="#8f6258" stroke="#694d48" stroke-width="5"/><path d="M25 109Q165 53 305 109" fill="none" stroke="#c68a70" stroke-width="13" stroke-linecap="round"/><path d="M72 123V294M258 123V294M101 123V276M229 123V276" stroke="#78564d" stroke-width="10"/><path d="M60 294H270" stroke="#9b765f" stroke-width="18" stroke-linecap="round"/><path d="M87 145H243M87 145V230M243 145V230" fill="none" stroke="#c7a077" stroke-width="5"/><path d="M95 227Q165 197 235 227" fill="none" stroke="#7da080" stroke-width="5"/>${flower(108,216,"#dd8796")}${flower(220,216,"#e9b75c")}`),
    wishbottles: art("0 0 230 165", `<path d="M10 15Q115 42 220 15" fill="none" stroke="#657566" stroke-width="3"/>${[[54,48,"#e2a0aa"],[115,60,"#a99bc9"],[178,43,"#ebc56d"]].map(([x,y,color],index) => `<g><path d="M${x} ${y - 25}V${y}" stroke="#8d806d" stroke-width="2"/><rect x="${x - 6}" y="${y - 3}" width="12" height="8" rx="2" fill="#a57b59"/><path d="M${x - 17} ${y + 5}Q${x - 21} ${y + 50} ${x} ${y + 58}Q${x + 21} ${y + 50} ${x + 17} ${y + 5}Z" fill="#edf3ec" fill-opacity=".72" stroke="#a9b7ac" stroke-width="2"/><circle cx="${x - 5}" cy="${y + 30}" r="5" fill="${color}"/><circle cx="${x + 8}" cy="${y + 42}" r="3" fill="#ffe59a"/><path d="M${x - 12} ${y + 48}Q${x} ${y + 37} ${x + 12} ${y + 48}" fill="none" stroke="#8caf8b" stroke-width="3"/></g>`).join("")}`),
    seasongate: art("0 0 330 315", `<path d="M25 300H305M53 300V94M277 300V94M39 94H291" stroke="#85624f" stroke-width="14" stroke-linecap="round"/><path d="M31 95L74 47H256L299 95" fill="#c98670" stroke="#78564d" stroke-width="7"/><path d="M77 48Q165 17 253 48" fill="none" stroke="#e3b17e" stroke-width="5"/><g>${[[72,133,"#dc8796"],[260,145,"#e9b85e"],[81,224,"#a99ccc"],[248,239,"#d98a75"]].map(([x,y,color],index) => `${flower(x,y,color)}${leaf(x + (index % 2 ? -9 : 9),y + 14,index % 2 ? 35 : -35)}`).join("")}</g><path d="M82 299Q165 245 248 299" fill="none" stroke="#719371" stroke-width="7"/>`)
  };
  return markup[id] || "";
}

function visibleHistoryItems(key, items, options = {}) {
  const values = Array.isArray(items) ? items : [];
  const limit = historyLimits[key] || 5;
  const button = q(`[data-history-toggle="${key}"]`);
  const alwaysVisible = typeof options.alwaysVisible === "function"
    ? values.filter(options.alwaysVisible)
    : [];
  const regularItems = alwaysVisible.length
    ? values.filter((item) => !options.alwaysVisible(item))
    : values;
  const collapsedItems = alwaysVisible.length
    ? [...alwaysVisible, ...regularItems.slice(0, Math.max(0, limit - alwaysVisible.length))]
    : values.slice(0, limit);
  const hasMore = values.length > collapsedItems.length;
  if (!hasMore) historyExpanded[key] = false;
  if (button) {
    button.hidden = !hasMore;
    button.setAttribute("aria-expanded", String(Boolean(historyExpanded[key])));
    button.textContent = historyExpanded[key]
      ? (alwaysVisible.length && options.alwaysVisibleLabel
        ? `收起（保留${options.alwaysVisibleLabel}）`
        : `收起到最近 ${limit} 条`)
      : `展开全部（共 ${values.length} 条）`;
  }
  return historyExpanded[key] ? values : collapsedItems;
}

function renderHistorySection(key) {
  const renderers = {
    messages: renderMessages, voices: renderVoiceMessages, tasks: renderTasks,
    notes: renderLoveNotes, study: renderStudyLogs, games: renderGameRecords,
    wheelHistory: renderWheelHistory
  };
  renderers[key]?.();
}

function wheelOptionsFor(wheelId) {
  return (state.wheelOptions || [])
    .filter((item) => item.wheelId === wheelId)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0) || (a.createdAt || "").localeCompare(b.createdAt || ""));
}

function currentWheel() {
  const wheels = state.wheels || [];
  if (!wheels.some((item) => item.id === activeWheelId)) activeWheelId = wheels[0]?.id || defaultWheel.id;
  return wheels.find((item) => item.id === activeWheelId) || wheels[0] || defaultWheel;
}

function bindWheelActions() {
  els.wheelSelect.addEventListener("change", () => {
    activeWheelId = els.wheelSelect.value;
    resetWheelMotion();
    renderWheel();
  });
  els.spinWheel.addEventListener("click", spinCurrentWheel);
  els.wheelOptionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.wheelOptionText.value.trim();
    if (!text) return;
    const wheel = currentWheel();
    const options = wheelOptionsFor(wheel.id);
    const now = new Date().toISOString();
    state.wheelOptions.push({ id: uid(), wheelId: wheel.id, text, order: options.length, createdAt: now, updatedAt: now });
    wheel.updatedAt = now;
    els.wheelOptionForm.reset();
    persistAndRender("添加转盘选项");
  });
  els.renameWheel.addEventListener("click", () => {
    const wheel = currentWheel();
    const name = window.prompt("给这个转盘换个名字", wheel.name)?.trim();
    if (!name || name === wheel.name) return;
    wheel.name = name.slice(0, 24);
    wheel.updatedAt = new Date().toISOString();
    persistAndRender("修改转盘名称");
  });
  els.duplicateWheel.addEventListener("click", () => {
    const source = currentWheel();
    const sourceOptions = wheelOptionsFor(source.id);
    const now = new Date().toISOString();
    const wheelId = uid();
    state.wheels.unshift({ id: wheelId, name: `${source.name}副本`.slice(0, 24), isDefault: false, createdAt: now, updatedAt: now });
    state.wheelOptions.push(...sourceOptions.map((item, index) => ({ id: uid(), wheelId, text: item.text, order: index, createdAt: now, updatedAt: now })));
    activeWheelId = wheelId;
    resetWheelMotion();
    persistAndRender("复制幸运转盘");
  });
  els.deleteWheel.addEventListener("click", () => {
    const wheel = currentWheel();
    if (wheel.isDefault || !window.confirm(`确定删除“${wheel.name}”吗？`)) return;
    const optionIds = wheelOptionsFor(wheel.id).map((item) => item.id);
    const historyIds = (state.wheelHistory || []).filter((item) => item.wheelId === wheel.id).map((item) => item.id);
    markSharedRecordDeleted("wheels", wheel.id);
    [...optionIds, ...historyIds].forEach((id) => markSharedRecordDeleted(optionIds.includes(id) ? "wheelOptions" : "wheelHistory", id));
    state.wheels = state.wheels.filter((item) => item.id !== wheel.id);
    state.wheelOptions = state.wheelOptions.filter((item) => item.wheelId !== wheel.id);
    state.wheelHistory = state.wheelHistory.filter((item) => item.wheelId !== wheel.id);
    activeWheelId = state.wheels[0]?.id || defaultWheel.id;
    resetWheelMotion();
    persistAndRender("删除幸运转盘");
  });
  els.restoreWheel.addEventListener("click", () => {
    const wheel = currentWheel();
    if (!wheel.isDefault || !window.confirm("恢复默认食物列表？当前食物选项会被替换。")) return;
    const oldOptions = wheelOptionsFor(wheel.id);
    oldOptions.forEach((item) => markSharedRecordDeleted("wheelOptions", item.id));
    state.wheelOptions = state.wheelOptions.filter((item) => item.wheelId !== wheel.id);
    const now = new Date().toISOString();
    state.wheelOptions.push(...defaultFoodChoices.map((text, index) => ({ id: uid(), wheelId: wheel.id, text, order: index, createdAt: now, updatedAt: now })));
    wheel.updatedAt = now;
    resetWheelMotion();
    persistAndRender("恢复食物转盘");
  });
  els.createWheel.addEventListener("click", () => {
    els.wheelCreateForm.reset();
    els.wheelCreateOptions.value = "一起看电影\n一起打游戏\n视频聊天";
    els.wheelCreateDialog.showModal();
  });
  els.wheelCreateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.submitter?.value === "cancel") {
      els.wheelCreateDialog.close();
      return;
    }
    const name = els.wheelCreateName.value.trim();
    const choices = [...new Set(els.wheelCreateOptions.value.split(/[\n,，]+/).map((item) => item.trim()).filter(Boolean))].slice(0, 40);
    if (!name || choices.length < 2) {
      window.alert("请填写转盘名称，并至少准备两个不同选项。");
      return;
    }
    const now = new Date().toISOString();
    const wheelId = uid();
    state.wheels.unshift({ id: wheelId, name: name.slice(0, 24), isDefault: false, createdAt: now, updatedAt: now });
    state.wheelOptions.push(...choices.map((text, index) => ({ id: uid(), wheelId, text: text.slice(0, 20), order: index, createdAt: now, updatedAt: now })));
    activeWheelId = wheelId;
    els.wheelCreateDialog.close();
    resetWheelMotion();
    persistAndRender("新建幸运转盘");
  });
}

function resetWheelMotion() {
  wheelRotation = 0;
  wheelSpinning = false;
  lastWheelResultId = "";
  els.wheelCanvas.style.transition = "none";
  els.wheelCanvas.style.transform = "rotate(0deg)";
  els.wheelResult.hidden = true;
  els.spinWheel.disabled = false;
}

function renderWheel() {
  const wheel = currentWheel();
  const wheels = state.wheels || [];
  const options = wheelOptionsFor(wheel.id);
  els.wheelSelect.replaceChildren(...wheels.map((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    option.selected = item.id === wheel.id;
    return option;
  }));
  els.wheelShortcutName.textContent = wheel.name;
  els.wheelShortcutMeta.textContent = `${options.length} 个选择，转一下就知道`;
  els.wheelEditorName.textContent = `编辑${wheel.name}`;
  els.wheelOptionCount.textContent = `${options.length} 项`;
  els.deleteWheel.hidden = Boolean(wheel.isDefault);
  els.restoreWheel.hidden = !wheel.isDefault;
  els.spinWheel.disabled = wheelSpinning || options.length < 2;
  els.spinWheel.querySelector("span").textContent = options.length < 2 ? "先加选项" : (wheelSpinning ? "转动中" : "转一下");
  els.wheelOptionList.replaceChildren(...options.map((item, index) => {
    const row = document.createElement("div");
    row.className = "wheel-option-row";
    row.innerHTML = `<span style="--wheel-color:${wheelColor(index)}"></span><input data-wheel-option="${item.id}" maxlength="20" value="${escapeHTML(item.text)}" aria-label="修改选项"><button class="icon-button danger" data-delete-wheel-option="${item.id}" type="button" aria-label="删除${escapeHTML(item.text)}" title="删除选项" ${options.length <= 2 ? "disabled" : ""}><span aria-hidden="true">×</span></button>`;
    return row;
  }));
  els.wheelOptionList.querySelectorAll("[data-wheel-option]").forEach((input) => input.addEventListener("change", () => {
    const item = state.wheelOptions.find((entry) => entry.id === input.dataset.wheelOption);
    const text = input.value.trim();
    if (!item || !text || text === item.text) {
      if (item) input.value = item.text;
      return;
    }
    item.text = text.slice(0, 20);
    item.updatedAt = new Date().toISOString();
    wheel.updatedAt = item.updatedAt;
    persistAndRender("修改转盘选项");
  }));
  els.wheelOptionList.querySelectorAll("[data-delete-wheel-option]").forEach((button) => button.addEventListener("click", () => {
    if (options.length <= 2) return;
    const id = button.dataset.deleteWheelOption;
    markSharedRecordDeleted("wheelOptions", id);
    state.wheelOptions = state.wheelOptions.filter((item) => item.id !== id);
    wheel.updatedAt = new Date().toISOString();
    resetWheelMotion();
    persistAndRender("删除转盘选项");
  }));
  if (!wheelSpinning && q("#wheel").classList.contains("is-active")) drawWheel(options);
  renderWheelHistory();
}

function wheelColor(index) {
  const colors = ["#d96f7d", "#779d86", "#a394c8", "#e6b85f", "#dc8c72", "#6f9da8", "#c97b9e", "#8eaa6d", "#b9826f", "#7588ae"];
  return colors[index % colors.length];
}

function drawWheel(options) {
  const canvas = els.wheelCanvas;
  const context = canvas.getContext("2d");
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 18;
  context.clearRect(0, 0, size, size);
  if (!options.length) return;
  const arc = (Math.PI * 2) / options.length;
  options.forEach((item, index) => {
    const start = -Math.PI / 2 + index * arc;
    const end = start + arc;
    context.beginPath();
    context.moveTo(center, center);
    context.arc(center, center, radius, start, end);
    context.closePath();
    context.fillStyle = wheelColor(index);
    context.fill();
    context.strokeStyle = "rgba(255,255,255,.72)";
    context.lineWidth = 4;
    context.stroke();
    const middle = start + arc / 2;
    context.fillStyle = "#fff";
    context.font = `800 ${options.length > 18 ? 22 : options.length > 12 ? 25 : 29}px system-ui, sans-serif`;
    context.textBaseline = "middle";
    context.shadowColor = "rgba(58,43,45,.2)";
    context.shadowBlur = 3;
    const label = item.text.length > 6 ? `${item.text.slice(0, 6)}…` : item.text;
    if (options.length > 14) {
      const normalized = (middle + Math.PI * 2) % (Math.PI * 2);
      const turnUpright = normalized > Math.PI / 2 && normalized < Math.PI * 1.5;
      context.save();
      context.translate(center, center);
      context.rotate(middle + (turnUpright ? Math.PI : 0));
      context.textAlign = turnUpright ? "left" : "right";
      context.fillText(label, (turnUpright ? -1 : 1) * radius * .88, 0, radius * .52);
      context.restore();
    } else {
      const textRadius = radius * .66;
      context.textAlign = "center";
      context.fillText(label, center + Math.cos(middle) * textRadius, center + Math.sin(middle) * textRadius, Math.max(78, radius * arc * .72));
    }
    context.shadowBlur = 0;
  });
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.strokeStyle = "rgba(255,255,255,.92)";
  context.lineWidth = 10;
  context.stroke();
}

function spinCurrentWheel() {
  const wheel = currentWheel();
  const options = wheelOptionsFor(wheel.id);
  if (wheelSpinning || options.length < 2) return;
  const pool = options.filter((item) => item.id !== lastWheelResultId);
  const chosen = pickRandom(pool.length ? pool : options);
  const chosenIndex = options.findIndex((item) => item.id === chosen.id);
  const sector = 360 / options.length;
  const desired = ((-(chosenIndex + .5) * sector) % 360 + 360) % 360;
  const current = ((wheelRotation % 360) + 360) % 360;
  wheelRotation += 5 * 360 + ((desired - current + 360) % 360);
  wheelSpinning = true;
  els.wheelResult.hidden = true;
  els.spinWheel.disabled = true;
  els.spinWheel.querySelector("span").textContent = "转动中";
  els.wheelCanvas.style.transition = "transform 4.2s cubic-bezier(.12,.68,.08,1)";
  window.requestAnimationFrame(() => { els.wheelCanvas.style.transform = `rotate(${wheelRotation}deg)`; });
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    wheelSpinning = false;
    lastWheelResultId = chosen.id;
    const createdAt = new Date().toISOString();
    state.wheelHistory.unshift({ id: uid(), wheelId: wheel.id, wheelName: wheel.name, optionId: chosen.id, result: chosen.text, person: currentPerson(), createdAt, updatedAt: createdAt });
    state.wheelHistory = state.wheelHistory.slice(0, 100);
    els.wheelResultText.textContent = chosen.text;
    els.wheelResult.hidden = false;
    navigator.vibrate?.([30, 45, 30]);
    persistAndRender("转动幸运转盘");
  };
  els.wheelCanvas.addEventListener("transitionend", finish, { once: true });
  window.setTimeout(finish, 4600);
}

function renderWheelHistory() {
  const wheel = currentWheel();
  const history = (state.wheelHistory || []).filter((item) => item.wheelId === wheel.id).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const visible = visibleHistoryItems("wheelHistory", history);
  els.wheelHistoryCount.textContent = `${history.length} 次`;
  if (!history.length) return renderEmpty(els.wheelHistoryList, "第一次选择，交给转盘来决定。");
  els.wheelHistoryList.replaceChildren(...visible.map((item) => {
    const row = document.createElement("article");
    row.innerHTML = `<span><b aria-hidden="true">✦</b></span><div><strong>${escapeHTML(item.result)}</strong><small>${people[item.person]?.name || "我们"} · ${formatDateTime(new Date(item.createdAt))}</small></div>`;
    return row;
  }));
}

function renderMessages() {
  const orderedMessages = sortByDateDesc(state.messages || []);
  const messages = visibleHistoryItems("messages", orderedMessages);
  if (!state.messages.length) return renderEmpty(els.messageList, "第一条留言，留给此刻最想说的话。");
  els.messageList.replaceChildren(...messages.map((item) => {
    const node = document.createElement("article");
    node.className = `message-item ${people[item.person].color}`;
    node.innerHTML = `<div class="message-meta"><span>${people[item.person].name}</span><time>${formatDate(parseDate(item.date))}</time><button class="delete-button" data-delete-message="${item.id}" type="button" aria-label="删除留言">×</button></div><p>${escapeHTML(item.text)}</p>`;
    return node;
  }));
  els.messageList.querySelectorAll("[data-delete-message]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.deleteMessage;
    commitSharedRecordDeletion("messages", id, () => { state.messages = state.messages.filter((item) => item.id !== id); }, "删除共同留言");
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
  const sameFocusedQuestion = document.activeElement === els.questionAnswer
    && els.questionAnswer.dataset.questionId === question.id
    && els.questionAnswer.dataset.person === person;
  if (!sameFocusedQuestion) els.questionAnswer.value = question.answers?.[person] || "";
  els.questionAnswer.dataset.questionId = question.id;
  els.questionAnswer.dataset.person = person;
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
  state.tasks = (state.tasks || []).map(normalizeTaskRecord);
  const done = state.tasks.filter((task) => task.doneBy.length === 2).length;
  els.taskStats.textContent = `${done}/${state.tasks.length}`;
  const tasks = visibleHistoryItems("tasks", state.tasks);
  if (!state.tasks.length) return renderEmpty(els.taskList, "写下一件想一起完成的小事。");
  els.taskList.replaceChildren(...tasks.map((task) => {
    const node = document.createElement("article");
    node.className = "task-item";
    const buttons = Object.keys(people).map((person) => `<button class="task-person ${task.doneBy.includes(person) ? "done" : ""}" data-task-id="${task.id}" data-person="${person}" type="button">${people[person].short}${task.doneBy.includes(person) ? " 已打卡" : " 打卡"}</button>`).join("");
    node.innerHTML = `<div><strong>${escapeHTML(task.text)}</strong><div class="task-progress">${buttons}</div></div><button class="delete-button" data-delete-task="${task.id}" type="button" aria-label="删除任务">×</button>`;
    return node;
  }));
  els.taskList.querySelectorAll("[data-task-id]").forEach((button) => button.addEventListener("click", () => {
    const task = state.tasks.find((item) => item.id === button.dataset.taskId);
    const person = button.dataset.person;
    const done = !task.doneBy.includes(person);
    const updatedAt = new Date().toISOString();
    task.doneState = { ...(task.doneState || {}), [person]: { done, updatedAt } };
    task.doneBy = Object.keys(people).filter((id) => Boolean(task.doneState[id]?.done));
    task.updatedAt = updatedAt;
    persistAndRender();
  }));
  els.taskList.querySelectorAll("[data-delete-task]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.deleteTask;
    commitSharedRecordDeletion("tasks", id, () => { state.tasks = state.tasks.filter((item) => item.id !== id); }, "删除双人任务");
  }));
}

function renderAchievements() {
  const achievementState = state.achievements;
  const edits = achievementState.edits || {};
  const custom = (achievementState.custom || []).map((item) => ({ ...item, isCustom: true }));
  const preset = achievementDefinitions.map((item) => ({ ...item, text: edits[item.id] || item.text, isCustom: false }));
  const all = [...custom, ...preset];
  const completed = achievementState.completed || {};
  const completedCount = all.filter((item) => achievementIsDone(completed[item.id])).length;
  const percent = all.length ? Math.round((completedCount / all.length) * 100) : 0;
  els.achievementStats.textContent = `${completedCount}/${all.length}`;
  els.achievementPercent.textContent = `${percent}%`;
  els.achievementProgressBar.style.width = `${percent}%`;

  let items = all;
  if (activeAchievementFilter === "done") items = items.filter((item) => achievementIsDone(completed[item.id]));
  if (activeAchievementFilter === "todo") items = items.filter((item) => !achievementIsDone(completed[item.id]));
  const visibleItems = achievementsExpanded ? items : items.slice(0, 6);
  els.achievementVisibleCount.textContent = `显示 ${visibleItems.length}/${items.length} 项`;
  els.achievementMore.hidden = items.length <= 6;
  els.achievementMore.textContent = achievementsExpanded ? "收起成就" : `展开更多（${items.length - visibleItems.length}）`;
  if (!items.length) {
    renderEmpty(els.achievementList, "这个筛选条件下还没有成就。");
  } else {
    els.achievementList.replaceChildren(...visibleItems.map((item) => {
      const record = completed[item.id];
      const isDone = achievementIsDone(record);
      const completionDate = typeof record === "string" ? record : record?.date || "";
      const node = document.createElement("article");
      node.className = `achievement-item${isDone ? " is-done" : ""}`;
      const dateControl = isDone
        ? `<label class="achievement-date">完成日期<input data-achievement-date="${item.id}" type="date" value="${completionDate}"></label>`
        : `<small class="achievement-waiting">等待一起完成</small>`;
      node.innerHTML = `<div class="achievement-main"><label class="achievement-toggle"><input type="checkbox" data-achievement-id="${item.id}" ${isDone ? "checked" : ""}><span class="achievement-check" aria-hidden="true">✓</span><span class="achievement-copy"><strong>${escapeHTML(item.text)}</strong></span></label><div class="achievement-actions"><button class="achievement-edit" data-edit-achievement="${item.id}" type="button">修改</button>${item.isCustom ? `<button class="delete-button" data-delete-achievement="${item.id}" type="button" aria-label="删除自定义成就">×</button>` : ""}</div></div>${dateControl}`;
      return node;
    }));
  }
  els.achievementList.querySelectorAll("[data-achievement-id]").forEach((input) => input.addEventListener("change", () => {
    const id = input.dataset.achievementId;
    const previous = state.achievements.completed[id];
    state.achievements.completed[id] = {
      done: input.checked,
      date: input.checked ? (typeof previous === "string" ? previous : previous?.date || "") : "",
      updatedAt: new Date().toISOString()
    };
    persistAndRender();
  }));
  els.achievementList.querySelectorAll("[data-achievement-date]").forEach((input) => input.addEventListener("change", () => {
    state.achievements.completed[input.dataset.achievementDate] = { done: true, date: input.value, updatedAt: new Date().toISOString() };
    persistAndRender();
  }));
  els.achievementList.querySelectorAll("[data-edit-achievement]").forEach((button) => button.addEventListener("click", () => {
    const item = all.find((entry) => entry.id === button.dataset.editAchievement);
    if (!item) return;
    els.achievementEditId.value = item.id;
    els.achievementEditText.value = item.text;
    els.achievementEditDialog.showModal();
  }));
  els.achievementList.querySelectorAll("[data-delete-achievement]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.deleteAchievement;
    commitSharedRecordDeletion("achievementCustom", id, () => {
      state.achievements.custom = state.achievements.custom.filter((item) => item.id !== id);
      delete state.achievements.completed[id];
      delete state.achievements.edits[id];
    }, "删除自定义成就");
  }));
}

function renderLoveNotes() {
  const notes = sortByDateDesc(state.loveNotes || [], "createdAt");
  const person = currentPerson();
  const visibleNotes = visibleHistoryItems("notes", notes, {
    alwaysVisible: (item) => item.to === person && item.unlockDate <= todayString() && !item.opened,
    alwaysVisibleLabel: "待打开纸条"
  });
  els.noteStats.textContent = `${notes.length} 张`;
  els.noteReceiver.value = person === "liu" ? "fu" : "liu";
  if (!notes.length) return renderEmpty(els.noteList, "折一张小纸条，留给对方在某天打开。");
  els.noteList.replaceChildren(...visibleNotes.map((item) => {
    const available = item.unlockDate <= todayString();
    const canRead = item.from === person || (item.to === person && available && item.opened);
    const canOpen = item.to === person && available && !item.opened;
    const unlockLabel = formatDate(parseDate(item.unlockDate));
    const status = item.from === person
      ? (item.opened ? `对方已打开 · 解锁日期 ${unlockLabel}` : (available ? `对方自 ${unlockLabel} 起可以打开` : `对方可于 ${unlockLabel} 打开`))
      : (item.opened ? `你已打开 · 解锁日期 ${unlockLabel}` : (available ? `已于 ${unlockLabel} 解锁` : `${unlockLabel} 才能打开`));
    const node = document.createElement("article");
    node.className = `love-note${canRead ? "" : " is-locked"}`;
    const body = canRead ? escapeHTML(item.text) : (available ? "这张纸条已经可以打开了。" : "内容正在好好保密中。");
    node.innerHTML = `<header><span>${people[item.from].short} 写给 ${people[item.to].short}</span><time>${formatDate(parseDate(item.createdAt))}</time></header><div class="note-unlock-status">${status}</div><p>${body}</p>${canOpen ? `<button class="note-open" data-open-note="${item.id}" type="button">打开纸条</button>` : ""}${item.from === person ? `<button class="delete-button" data-delete-note="${item.id}" type="button" aria-label="删除纸条">×</button>` : ""}`;
    return node;
  }));
  els.noteList.querySelectorAll("[data-open-note]").forEach((button) => button.addEventListener("click", () => {
    const note = state.loveNotes.find((item) => item.id === button.dataset.openNote);
    if (note && note.to === currentPerson() && note.unlockDate <= todayString()) {
      note.opened = true;
      note.updatedAt = new Date().toISOString();
    }
    persistAndRender();
  }));
  els.noteList.querySelectorAll("[data-delete-note]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.deleteNote;
    commitSharedRecordDeletion("loveNotes", id, () => { state.loveNotes = state.loveNotes.filter((item) => item.id !== id || item.from !== currentPerson()); }, "删除情侣纸条");
  }));
}

function renderStudyLogs() {
  const logs = sortByDateDesc(state.studyLogs || []);
  const visibleLogs = visibleHistoryItems("study", logs);
  const total = logs.reduce((sum, item) => sum + Number(item.minutes || 0), 0);
  els.studyStats.textContent = total >= 60 ? `${(total / 60).toFixed(total % 60 ? 1 : 0)} 小时` : `${total} 分钟`;
  if (!logs.length) return renderEmpty(els.studyList, "第一次学习打卡，从今天的一点进步开始。");
  els.studyList.replaceChildren(...visibleLogs.map((item) => {
    const node = document.createElement("article");
    node.className = "study-record";
    node.innerHTML = `<header><span>${people[item.person].name}</span><time>${formatDate(parseDate(item.date))}</time></header><h3>${escapeHTML(item.content)}</h3><p><span class="study-minutes">${item.minutes} 分钟</span>${item.note ? ` · ${escapeHTML(item.note)}` : ""}</p>${item.person === currentPerson() ? `<button class="delete-button" data-delete-study="${item.id}" type="button" aria-label="删除学习记录">×</button>` : ""}`;
    return node;
  }));
  els.studyList.querySelectorAll("[data-delete-study]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.deleteStudy;
    commitSharedRecordDeletion("studyLogs", id, () => { state.studyLogs = state.studyLogs.filter((item) => item.id !== id || item.person !== currentPerson()); }, "删除学习打卡");
  }));
}

function renderGameRecords() {
  const records = sortByDateDesc(state.gameRecords || []);
  const visibleRecords = visibleHistoryItems("games", records);
  els.gameStats.textContent = `${records.length} 局`;
  if (!records.length) return renderEmpty(els.gameList, "把下一次并肩作战的高光时刻存下来。");
  els.gameList.replaceChildren(...visibleRecords.map((item) => {
    const node = document.createElement("article");
    node.className = "game-record";
    const image = item.image ? `<img src="${item.image}" alt="${escapeHTML(item.game)}的游戏截图">` : "";
    node.innerHTML = `${image}<div class="game-record-copy"><header><span>共同战绩</span><time>${formatDate(parseDate(item.date))}</time></header><h3>${escapeHTML(item.game)}</h3><p>${escapeHTML(item.achievement)}</p></div><button class="delete-button" data-delete-game="${item.id}" type="button" aria-label="删除游戏记录">×</button>`;
    return node;
  }));
  els.gameList.querySelectorAll("[data-delete-game]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("确定删除这条游戏记录吗？")) return;
    const id = button.dataset.deleteGame;
    commitSharedRecordDeletion("gameRecords", id, () => { state.gameRecords = state.gameRecords.filter((item) => item.id !== id); }, "删除游戏记录");
  }));
}

function renderMeetings() {
  if (!state.meetings.length) return renderEmpty(els.meetingList, "第一次见面，值得从这里开始收藏。");
  const meetings = sortByDateDesc(state.meetings || []);
  els.meetingList.replaceChildren(...meetings.map((item) => {
    const node = document.createElement("article");
    node.className = "meeting-card";
    node.innerHTML = `<h3>${escapeHTML(item.title)}</h3><time>${item.date ? formatDate(parseDate(item.date)) : "等待约定"}${item.place ? ` · ${escapeHTML(item.place)}` : ""}</time>${item.note ? `<p>${escapeHTML(item.note)}</p>` : ""}<button class="delete-button" data-delete-meeting="${item.id}" type="button" aria-label="删除见面记录">×</button>`;
    return node;
  }));
  els.meetingList.querySelectorAll("[data-delete-meeting]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("确定删除这条见面记录吗？")) return;
    const id = button.dataset.deleteMeeting;
    commitSharedRecordDeletion("meetings", id, () => { state.meetings = state.meetings.filter((item) => item.id !== id); }, "删除见面记录");
  }));
}

function renderAlbum() {
  if (!state.photos.length) return renderEmpty(els.albumGrid, "第一张合照，留给你们最喜欢的那个瞬间。");
  els.albumGrid.replaceChildren(...sortByDateDesc(state.photos || []).map((photo) => {
    const node = document.createElement("article");
    node.className = "photo-card";
    node.innerHTML = `<img src="${photo.src}" alt="共同相册照片"><button class="delete-button photo-delete" data-delete-photo="${photo.id}" type="button" aria-label="删除这张照片">×</button><div class="photo-copy"><p>${escapeHTML(photo.caption)}</p><small>${formatDate(parseDate(photo.date))} · ${people[photo.person].name}</small></div>`;
    return node;
  }));
  els.albumGrid.querySelectorAll("[data-delete-photo]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.deletePhoto;
    commitSharedRecordDeletion("photos", id, () => { state.photos = state.photos.filter((item) => item.id !== id); }, "删除公共照片");
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
  renderGoals(space);
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
      markPrivateRecordDeleted("traits", button.dataset.deleteTrait);
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

function renderGoals(space) {
  const goals = space.goals || [];
  const completed = goals.filter((goal) => goal.completed).length;
  els.goalStats.textContent = `${completed}/${goals.length}`;
  if (!goals.length) return renderEmpty(els.goalList, "写下一个只为自己认真完成的目标。");
  els.goalList.replaceChildren(...goals.map((goal) => {
    const node = document.createElement("article");
    node.className = `goal-item${goal.completed ? " is-done" : ""}`;
    const meta = goal.completed && goal.completedAt
      ? `<small>${formatDate(parseDate(goal.completedAt))}完成</small>`
      : `<small>${formatDate(parseDate(goal.createdAt))}加入</small>`;
    node.innerHTML = `<label class="goal-toggle"><input data-goal-id="${goal.id}" type="checkbox" ${goal.completed ? "checked" : ""}><span class="goal-check" aria-hidden="true">✓</span><span><strong>${escapeHTML(goal.text)}</strong>${meta}</span></label><button class="delete-button" data-delete-goal="${goal.id}" type="button" aria-label="删除个人目标">×</button>`;
    return node;
  }));
  els.goalList.querySelectorAll("[data-goal-id]").forEach((input) => input.addEventListener("change", () => {
    const goal = privateSpace().goals.find((item) => item.id === input.dataset.goalId);
    if (!goal) return;
    goal.completed = input.checked;
    goal.completedAt = input.checked ? todayString() : "";
    goal.updatedAt = new Date().toISOString();
    persistAndRender();
  }));
  els.goalList.querySelectorAll("[data-delete-goal]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("确定删除这个个人目标吗？")) return;
    const currentSpace = privateSpace();
    markPrivateRecordDeleted("goals", button.dataset.deleteGoal, currentSpace);
    currentSpace.goals = currentSpace.goals.filter((item) => item.id !== button.dataset.deleteGoal);
    persistAndRender();
  }));
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
    markPrivateRecordDeleted("diaries", button.dataset.deleteDiary, space);
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
    markPrivateRecordDeleted("cycles", button.dataset.deleteCycle);
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
    record.updatedAt = new Date().toISOString();
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
    markPrivateRecordDeleted("weights", button.dataset.deleteWeight);
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
  els.moodPicker.replaceChildren(...moodGroups.map((group) => {
    const section = document.createElement("section");
    section.className = "mood-group";
    section.innerHTML = `<h3>${group.label}</h3><div class="mood-group-options"></div>`;
    const root = section.querySelector(".mood-group-options");
    root.replaceChildren(...group.items.map((mood) => {
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
    return section;
  }));
  els.moodDialog.showModal();
}

function setNewQuestion(category) {
  const categories = Object.keys(questionBank);
  const chosenCategory = category === "all" ? pickRandom(categories) : category;
  const pool = questionBank[chosenCategory] || questionBank.daily;
  const recent = new Set([state.dailyQuestion.text, ...(state.questionHistory || []).slice(0, 30)]);
  const available = pool.filter((text) => !recent.has(text));
  const text = pickRandom(available.length ? available : pool);
  state.questionHistory = [state.dailyQuestion.text, ...(state.questionHistory || [])].filter(Boolean).slice(0, 30);
  const changedAt = new Date().toISOString();
  state.dailyQuestion = { id: uid(), category: chosenCategory, text, date: todayString(), changedAt, answers: { liu: "", fu: "" }, answerUpdatedAt: { liu: "", fu: "" } };
  persistAndRender();
}

function currentPerson() { return window.LoveSync?.getRole() || state.writer; }
function setFormDates() {
  const today = todayString();
  els.noteUnlockDate.value = els.noteUnlockDate.value || today;
  els.studyDate.value = els.studyDate.value || today;
  els.gameDate.value = els.gameDate.value || today;
  els.diaryDate.value = els.diaryDate.value || today;
  els.weightDate.value = els.weightDate.value || today;
  els.gardenSeedUnlockDate.min = today;
  els.gardenSeedUnlockDate.value = els.gardenSeedUnlockDate.value || today;
  els.gardenWishDate.min = today;
  els.gardenLetterDate.min = today;
  els.gardenLetterDate.value = els.gardenLetterDate.value || today;
  els.gardenAnniversaryDate.value = els.gardenAnniversaryDate.value || today;
}
function resetDiaryForm() {
  els.diaryForm.reset();
  els.diaryEditId.value = "";
  els.diaryDate.value = todayString();
  els.saveDiary.textContent = "保存日记";
  els.cancelDiaryEdit.hidden = true;
}

function privateSpace() { return state.private[state.privatePerson]; }

function normalizeDeletedRecords(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id]) => Boolean(id)).map(([id, record]) => [id, {
    field: record?.field || "shared",
    deletedAt: record?.deletedAt || "",
    deletedBy: record?.deletedBy || ""
  }]));
}

function mergeDeletedRecords(left, right) {
  const merged = { ...normalizeDeletedRecords(left), ...normalizeDeletedRecords(right) };
  Object.keys(merged).forEach((id) => {
    const leftRecord = left?.[id];
    const rightRecord = right?.[id];
    if (leftRecord && rightRecord && (leftRecord.deletedAt || "") > (rightRecord.deletedAt || "")) merged[id] = leftRecord;
  });
  return merged;
}

function questionChangedTime(question) {
  const exact = Date.parse(question?.changedAt || "");
  if (Number.isFinite(exact)) return exact;
  const day = Date.parse(`${question?.date || "1970-01-01"}T00:00:00`);
  return Number.isFinite(day) ? day : 0;
}

function mergeDailyQuestion(localQuestion, remoteQuestion) {
  if (!localQuestion) return remoteQuestion;
  if (!remoteQuestion) return localQuestion;
  const localNewer = questionChangedTime(localQuestion) > questionChangedTime(remoteQuestion);
  if (localQuestion.id !== remoteQuestion.id) return localNewer ? localQuestion : remoteQuestion;
  const base = localNewer ? localQuestion : remoteQuestion;
  const answers = {};
  const answerUpdatedAt = {};
  Object.keys(people).forEach((person) => {
    const localTime = localQuestion.answerUpdatedAt?.[person] || "";
    const remoteTime = remoteQuestion.answerUpdatedAt?.[person] || "";
    const useLocal = localTime && (!remoteTime || localTime > remoteTime);
    answers[person] = useLocal
      ? (localQuestion.answers?.[person] || "")
      : (remoteQuestion.answers?.[person] || localQuestion.answers?.[person] || "");
    answerUpdatedAt[person] = useLocal ? localTime : (remoteTime || localTime);
  });
  return { ...base, answers, answerUpdatedAt };
}

function recordUpdatedAt(record) {
  if (!record || typeof record !== "object") return "";
  return record.updatedAt || record.createdAt || record.date || "";
}

function chooseTimestampedRecord(localRecord, remoteRecord, preferLocal = false) {
  if (!localRecord) return remoteRecord;
  if (!remoteRecord) return localRecord;
  const localTime = recordUpdatedAt(localRecord);
  const remoteTime = recordUpdatedAt(remoteRecord);
  if (localTime === remoteTime) return preferLocal ? localRecord : remoteRecord;
  return localTime > remoteTime ? localRecord : remoteRecord;
}

function normalizeTaskRecord(task) {
  const doneState = { ...(task?.doneState || {}) };
  (task?.doneBy || []).forEach((person) => {
    if (!doneState[person]) doneState[person] = { done: true, updatedAt: task?.updatedAt || "" };
  });
  return {
    ...(task || {}),
    doneState,
    doneBy: Object.keys(people).filter((person) => Boolean(doneState[person]?.done))
  };
}

function mergeTaskRecords(localItems, remoteItems, deleted, preferLocal = false) {
  const records = new Map();
  const sides = preferLocal ? [remoteItems || [], localItems || []] : [localItems || [], remoteItems || []];
  sides.flat().forEach((rawTask) => {
    if (!rawTask?.id || deleted.has(rawTask.id)) return;
    const task = normalizeTaskRecord(rawTask);
    const previous = records.get(task.id);
    if (!previous) {
      records.set(task.id, task);
      return;
    }
    const base = chooseTimestampedRecord(previous, task, true);
    const doneState = {};
    Object.keys(people).forEach((person) => {
      doneState[person] = chooseTimestampedRecord(previous.doneState?.[person], task.doneState?.[person], true) || undefined;
      if (!doneState[person]) delete doneState[person];
    });
    records.set(task.id, normalizeTaskRecord({ ...base, doneState }));
  });
  return [...records.values()];
}

function mergeTimestampedMap(localMap, remoteMap, preferLocal = false) {
  const merged = {};
  const keys = new Set([...Object.keys(localMap || {}), ...Object.keys(remoteMap || {})]);
  keys.forEach((key) => {
    const rawLocalValue = localMap?.[key];
    const rawRemoteValue = remoteMap?.[key];
    const localValue = typeof rawLocalValue === "string" ? { done: true, date: rawLocalValue, updatedAt: "" } : rawLocalValue;
    const remoteValue = typeof rawRemoteValue === "string" ? { done: true, date: rawRemoteValue, updatedAt: "" } : rawRemoteValue;
    merged[key] = chooseTimestampedRecord(localValue, remoteValue, preferLocal);
  });
  return merged;
}

function achievementIsDone(record) {
  return Boolean(record) && (typeof record === "string" || record.done !== false);
}

function applySharedDeletionTombstones(value) {
  const deletedRecords = normalizeDeletedRecords(value?.deletedRecords);
  const deleted = new Set(Object.keys(deletedRecords));
  const next = { ...value, deletedRecords };
  sharedRecordFields.forEach((field) => {
    next[field] = (Array.isArray(value?.[field]) ? value[field] : []).filter((item) => item?.id && !deleted.has(item.id));
  });
  next.achievements = {
    ...(value?.achievements || {}),
    completed: { ...(value?.achievements?.completed || {}) },
    edits: { ...(value?.achievements?.edits || {}) },
    custom: (value?.achievements?.custom || []).filter((item) => item?.id && !deleted.has(item.id))
  };
  Object.entries(deletedRecords).forEach(([id, record]) => {
    if (record.field !== "achievementCustom") return;
    delete next.achievements.completed[id];
    delete next.achievements.edits[id];
  });
  return next;
}

function markSharedRecordDeleted(field, id) {
  if (!id) return;
  state.deletedRecords = mergeDeletedRecords(state.deletedRecords, {
    [id]: { field, deletedAt: new Date().toISOString(), deletedBy: currentPerson() }
  });
}

function markPrivateRecordDeleted(field, id, space = privateSpace()) {
  if (!id || !space) return;
  space.deletedRecords = {
    ...(space.deletedRecords || {}),
    [id]: { field, deletedAt: new Date().toISOString() }
  };
}

function commitSharedRecordDeletion(field, id, removeRecord, reason = "删除共同记录") {
  if (!id) return;
  markSharedRecordDeleted(field, id);
  removeRecord();
  persistAndRender(reason);
  window.LoveSync?.deleteSharedRecord?.(field, id).catch(() => {
    // The regular state save already contains the tombstone; the RPC adds server-side hardening after SQL upgrade.
  });
}

function persistAndRender(gardenReason = "共同生活") {
  refreshGardenProgress(gardenReason);
  try {
    window.LoveSync?.scheduleSave(state);
  } catch (error) {
    console.error("Unable to queue cloud save", error);
  }
  const locallySaved = writeActiveStateToLocalStorage(state);
  try {
    render();
  } finally {
    if (locallySaved) backupSharedState(state, "本机记录更新");
  }
}

function saveLocalAndRender() {
  refreshGardenProgress("同步新的共同回忆");
  const locallySaved = writeActiveStateToLocalStorage(state);
  try {
    render();
  } finally {
    if (locallySaved) backupSharedState(state, "同步前快照");
  }
}

function reportLocalStorageFailure(error) {
  console.warn("Local state cache could not be updated", error);
  window.dispatchEvent(new CustomEvent("love-local-storage-error", {
    detail: { message: error?.message || String(error || "unknown error") }
  }));
}

function writeActiveStateToLocalStorage(value) {
  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch (error) {
    reportLocalStorageFailure(error);
    return false;
  }

  try {
    localStorage.setItem(storageKey, serialized);
    return true;
  } catch (firstError) {
    // These two caches can be rebuilt from the active state or the cloud.
    [recoveryBackupKey, syncFeatureCacheKey].forEach((key) => {
      try { localStorage.removeItem(key); } catch { /* Storage may be disabled entirely. */ }
    });
    try {
      localStorage.setItem(storageKey, serialized);
      return true;
    } catch (retryError) {
      reportLocalStorageFailure(retryError || firstError);
      return false;
    }
  }
}

function sharedStateScore(value) {
  if (!value || typeof value !== "object") return 0;
  const listFields = ["messages", "tasks", "questionHistory", "loveNotes", "studyLogs", "gameRecords", "photos"];
  let score = listFields.reduce((sum, field) => sum + (Array.isArray(value[field]) ? value[field].length : 0), 0);
  score += (value.meetings || []).filter((item) => item?.date || item?.place || (item?.title && item.title !== "下一次见面")).length;
  score += Object.values(value.dailyQuestion?.answers || {}).filter((answer) => String(answer || "").trim()).length;
  score += Object.values(value.achievements?.completed || {}).filter(achievementIsDone).length + (value.achievements?.custom || []).length;
  const customWheelIds = new Set((value.wheels || []).filter((item) => !item?.isDefault).map((item) => item.id));
  score += customWheelIds.size + (value.wheelOptions || []).filter((item) => customWheelIds.has(item?.wheelId)).length + (value.wheelHistory || []).length;
  const garden = value.garden || {};
  score += (garden.seeds || []).length + (garden.wishes || []).length + (garden.hybrid?.blooms || []).length;
  score += (garden.pointEvents || []).length + (garden.snapshots || []).length + Object.keys(garden.waterings || {}).length;
  score += (garden.flowerLetters || []).length + (garden.anniversaries || []).length;
  if (Number(garden.points || 0) > 0) score += 2;
  if (garden.companionPlant?.name) score += 1;
  return score;
}

function sharedOnly(value) {
  const { private: privateSpaces, writer, privatePerson, ...shared } = value || {};
  return structuredClone(shared);
}

function compactSharedBackup(value) {
  const data = sharedOnly(value);
  delete data.photos;
  if (Array.isArray(data.gameRecords)) {
    data.gameRecords = data.gameRecords.map(({ image, ...record }) => record);
  }
  return data;
}

function readSharedBackup() {
  try { return JSON.parse(localStorage.getItem(recoveryBackupKey))?.data || null; }
  catch { return null; }
}

function backupSharedState(value, reason) {
  const data = compactSharedBackup(value);
  const score = sharedStateScore(data);
  if (score < 7) return;
  const storedBackup = readSharedBackup();
  const existing = storedBackup ? compactSharedBackup(storedBackup) : null;
  if (existing && sharedStateScore(existing) > score) {
    const protectedBackup = applySharedDeletionTombstones({
      ...existing,
      deletedRecords: mergeDeletedRecords(existing.deletedRecords, data.deletedRecords)
    });
    try {
      localStorage.setItem(recoveryBackupKey, JSON.stringify({ savedAt: new Date().toISOString(), reason: `${reason} · 保留删除记录`, score: sharedStateScore(protectedBackup), data: protectedBackup }));
    } catch { /* Keep the earlier backup when browser storage is full. */ }
    return;
  }
  try {
    localStorage.setItem(recoveryBackupKey, JSON.stringify({ savedAt: new Date().toISOString(), reason, score, data }));
  } catch { /* The active state remains available even when browser backup storage is full. */ }
}

function bestRecoverySharedState(localState) {
  const localShared = sharedOnly(localState);
  const backup = readSharedBackup();
  return backup && sharedStateScore(backup) > sharedStateScore(localShared) ? backup : localShared;
}

function shouldRecoverSharedState(localState, remoteShared) {
  const candidateScore = sharedStateScore(bestRecoverySharedState(localState));
  const remoteScore = sharedStateScore(remoteShared);
  return remoteScore <= 6 && candidateScore >= 7 && candidateScore >= remoteScore + 4;
}

function mergeRecoverySharedState(localState, remoteShared) {
  const localShared = bestRecoverySharedState(localState);
  const deletedRecords = mergeDeletedRecords(remoteShared?.deletedRecords, localShared.deletedRecords);
  const deleted = new Set(Object.keys(deletedRecords));
  const mergeRecords = (remoteItems, localItems) => {
    const records = new Map();
    [...(remoteItems || []), ...(localItems || [])].forEach((item) => {
      if (!item?.id || deleted.has(item.id)) return;
      const existing = records.get(item.id) || {};
      records.set(item.id, {
        ...existing,
        ...item,
        ...(existing.image && !item.image ? { image: existing.image } : {})
      });
    });
    return [...records.values()];
  };
  const merged = { ...remoteShared, ...localShared, deletedRecords };
  sharedRecordFields.forEach((field) => {
    merged[field] = mergeRecords(remoteShared?.[field], localShared?.[field]);
  });
  merged.tasks = mergeTaskRecords(localShared.tasks, remoteShared?.tasks, deleted, true);
  merged.moods = {};
  Object.keys(people).forEach((person) => {
    merged.moods[person] = chooseTimestampedRecord(localShared.moods?.[person], remoteShared?.moods?.[person], true) || {};
  });
  merged.dailyQuestion = mergeDailyQuestion(localShared.dailyQuestion, remoteShared?.dailyQuestion);
  merged.questionHistory = [...new Set([...(localShared.questionHistory || []), ...(remoteShared?.questionHistory || [])])].slice(0, 30);
  merged.achievements = {
    ...(remoteShared?.achievements || {}), ...(localShared.achievements || {}),
    completed: mergeTimestampedMap(localShared.achievements?.completed, remoteShared?.achievements?.completed, true),
    edits: { ...(remoteShared?.achievements?.edits || {}), ...(localShared.achievements?.edits || {}) },
    custom: mergeRecords(remoteShared?.achievements?.custom, localShared.achievements?.custom)
  };
  merged.garden = mergeGardenConcurrent(localShared.garden, remoteShared?.garden);
  return applySharedDeletionTombstones(merged);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved) {
      const backup = readSharedBackup();
      if (backup && sharedStateScore(saved) <= 6 && sharedStateScore(backup) >= sharedStateScore(saved) + 4) {
        return mergeDefaults({ ...saved, ...backup, private: saved.private, writer: saved.writer, privatePerson: saved.privatePerson });
      }
      return mergeDefaults(saved);
    }
  } catch { /* Start fresh when stored data is invalid. */ }
  return structuredClone(defaults);
}
function mergeDefaults(saved) {
  const base = structuredClone(defaults);
  const merged = {
    ...base, ...saved,
    deletedRecords: normalizeDeletedRecords(saved.deletedRecords),
    moods: { ...base.moods, ...(saved.moods || {}) },
    dailyQuestion: {
      ...base.dailyQuestion,
      ...(saved.dailyQuestion || {}),
      answers: { ...base.dailyQuestion.answers, ...(saved.dailyQuestion?.answers || {}) },
      answerUpdatedAt: { liu: "", fu: "", ...(saved.dailyQuestion?.answerUpdatedAt || {}) }
    },
    questionHistory: Array.isArray(saved.questionHistory) ? saved.questionHistory.slice(0, 30) : [],
    tasks: (Array.isArray(saved.tasks) ? saved.tasks : base.tasks).map(normalizeTaskRecord),
    loveNotes: Array.isArray(saved.loveNotes) ? saved.loveNotes : [],
    studyLogs: Array.isArray(saved.studyLogs) ? saved.studyLogs : [],
    gameRecords: Array.isArray(saved.gameRecords) ? saved.gameRecords : [],
    wheels: Array.isArray(saved.wheels) && saved.wheels.length ? saved.wheels : base.wheels,
    wheelOptions: Array.isArray(saved.wheelOptions) ? saved.wheelOptions : base.wheelOptions,
    wheelHistory: Array.isArray(saved.wheelHistory) ? saved.wheelHistory : [],
    achievements: {
      completed: { ...base.achievements.completed, ...(saved.achievements?.completed || {}) },
      custom: Array.isArray(saved.achievements?.custom) ? saved.achievements.custom : [],
      edits: { ...base.achievements.edits, ...(saved.achievements?.edits || {}) }
    },
    garden: mergeGarden(saved.garden),
    private: {
      liu: mergePrivateSpace(saved.private?.liu, "liu"),
      fu: mergePrivateSpace(saved.private?.fu, "fu")
    }
  };
  if (!merged.wheels.some((item) => item.id === defaultWheel.id)) merged.wheels.unshift(structuredClone(defaultWheel));
  if (!merged.wheelOptions.some((item) => item.wheelId === defaultWheel.id) && !saved.wheelOptions) merged.wheelOptions.push(...structuredClone(defaultWheelOptions));
  return applySharedDeletionTombstones(merged);
}
function normalizeGardenDecorationStates(states = {}) {
  const normalized = Object.fromEntries(Object.entries(states).map(([id, value]) => [id, {
    ...value,
    enabled: Boolean(value?.enabled)
  }]));
  const enabledBySlot = new Map();
  gardenDecorations.forEach((item, index) => {
    const state = normalized[item.id];
    if (!state?.enabled) return;
    if (!enabledBySlot.has(item.slot)) enabledBySlot.set(item.slot, []);
    enabledBySlot.get(item.slot).push({ item, state, index });
  });
  enabledBySlot.forEach((entries) => {
    entries.sort((left, right) => {
      const byTime = String(right.state.updatedAt || "").localeCompare(String(left.state.updatedAt || ""));
      return byTime || right.index - left.index;
    });
    const winnerTime = entries[0]?.state.updatedAt || "";
    entries.slice(1).forEach(({ item, state }) => {
      normalized[item.id] = { ...state, enabled: false, updatedAt: winnerTime || state.updatedAt || "" };
    });
  });
  return normalized;
}

function mergeGarden(savedGarden) {
  const base = structuredClone(defaults).garden;
  const legacy = Number(savedGarden?.version || 1) < 2;
  const baselinePoints = legacy ? Math.max(0, Number(savedGarden?.points || 0)) : Math.max(0, Number(savedGarden?.baselinePoints || 0));
  const legacyDecorationMap = { lights: "lights", ribbon: "ribbon", windchime: "windchime", lantern: "lanterns" };
  const decorationStates = {};
  Object.entries(savedGarden?.decorationStates || {}).forEach(([id, value]) => {
    if (!gardenDecorations.some((item) => item.id === id)) return;
    decorationStates[id] = { enabled: Boolean(value?.enabled), updatedAt: value?.updatedAt || "", legacy: Boolean(value?.legacy) };
  });
  const legacyDecoration = legacyDecorationMap[savedGarden?.featuredDecoration];
  if (legacyDecoration && !decorationStates[legacyDecoration]) {
    decorationStates[legacyDecoration] = { enabled: true, updatedAt: savedGarden?.decorationUpdatedAt || new Date().toISOString(), legacy: true };
  }
  return {
    ...base,
    ...(savedGarden || {}),
    version: 3,
    points: Math.max(0, Number(savedGarden?.points || 0)),
    baselinePoints,
    migrationComplete: legacy ? false : Boolean(savedGarden?.migrationComplete),
    creditedKeys: Array.isArray(savedGarden?.creditedKeys) ? [...new Set(savedGarden.creditedKeys)] : [],
    pointEvents: Array.isArray(savedGarden?.pointEvents) ? savedGarden.pointEvents.filter((item) => item?.id && item?.key) : [],
    lastStage: legacy ? gardenStageIndex(baselinePoints) : Math.max(0, Number(savedGarden?.lastStage || 0)),
    waterings: { ...base.waterings, ...(savedGarden?.waterings || {}) },
    seeds: Array.isArray(savedGarden?.seeds) ? savedGarden.seeds : [],
    wishes: Array.isArray(savedGarden?.wishes) ? savedGarden.wishes : [],
    hybrid: {
      ...base.hybrid,
      ...(savedGarden?.hybrid || {}),
      choices: { ...base.hybrid.choices, ...(savedGarden?.hybrid?.choices || {}) },
      blooms: Array.isArray(savedGarden?.hybrid?.blooms) ? savedGarden.hybrid.blooms : []
    },
    snapshots: Array.isArray(savedGarden?.snapshots) ? savedGarden.snapshots : [],
    unlockedAreas: Array.isArray(savedGarden?.unlockedAreas) ? savedGarden.unlockedAreas : [],
    deletedIds: Array.isArray(savedGarden?.deletedIds) ? savedGarden.deletedIds.slice(-200) : [],
    decorationStates: normalizeGardenDecorationStates(decorationStates),
    featuredDecoration: "none",
    decorationUpdatedAt: savedGarden?.decorationUpdatedAt || "",
    companionPlant: {
      ...base.companionPlant,
      ...(savedGarden?.companionPlant || {}),
      care: { ...base.companionPlant.care, ...(savedGarden?.companionPlant?.care || {}) }
    },
    flowerLetters: Array.isArray(savedGarden?.flowerLetters) ? savedGarden.flowerLetters : [],
    weeklyQuests: savedGarden?.weeklyQuests && typeof savedGarden.weeklyQuests === "object" ? savedGarden.weeklyQuests : {},
    anniversaries: Array.isArray(savedGarden?.anniversaries) ? savedGarden.anniversaries : [],
    sign: { ...base.sign, ...(savedGarden?.sign || {}) },
    yearbookHighlights: savedGarden?.yearbookHighlights && typeof savedGarden.yearbookHighlights === "object" ? savedGarden.yearbookHighlights : {}
  };
}

function mergeSharedConcurrent(localState, remoteShared, preferLocal = false, partial = false) {
  const remote = remoteShared || {};
  const deletedRecords = mergeDeletedRecords(localState?.deletedRecords, remote.deletedRecords);
  const deleted = new Set(Object.keys(deletedRecords));
  const mergeRecords = (localItems, remoteItems) => {
    const records = new Map();
    const sides = preferLocal ? [remoteItems || [], localItems || []] : [localItems || [], remoteItems || []];
    sides.flat().forEach((item) => {
      if (!item?.id || deleted.has(item.id)) return;
      const previous = records.get(item.id);
      const previousTime = previous?.updatedAt || previous?.createdAt || previous?.date || "";
      const nextTime = item.updatedAt || item.createdAt || item.date || "";
      if (!previous || nextTime >= previousTime) records.set(item.id, item);
    });
    return [...records.values()];
  };
  const merged = preferLocal ? { ...remote, ...(localState || {}), deletedRecords } : { ...(localState || {}), ...remote, deletedRecords };
  sharedRecordFields.forEach((field) => {
    if (partial && !Object.prototype.hasOwnProperty.call(remote, field)) {
      merged[field] = localState?.[field] || [];
      return;
    }
    merged[field] = mergeRecords(localState?.[field], remote[field]);
    if (field === "gameRecords") {
      const localImages = new Map((localState?.gameRecords || []).filter((item) => item?.image).map((item) => [item.id, item.image]));
      merged[field] = merged[field].map((item) => item.image ? item : { ...item, image: localImages.get(item.id) || "" });
    }
    if (!preferLocal && merged[field].length > (remote[field] || []).filter((item) => item?.id && !deleted.has(item.id)).length) sharedNeedsResync = true;
  });
  if (!partial || Object.prototype.hasOwnProperty.call(remote, "tasks")) {
    merged.tasks = mergeTaskRecords(localState?.tasks, remote.tasks, deleted, preferLocal);
  }
  if (!partial || Object.prototype.hasOwnProperty.call(remote, "moods")) {
    merged.moods = {};
    Object.keys(people).forEach((person) => {
      merged.moods[person] = chooseTimestampedRecord(localState?.moods?.[person], remote.moods?.[person], preferLocal) || {};
    });
  }
  if (!partial || Object.prototype.hasOwnProperty.call(remote, "dailyQuestion") || Object.prototype.hasOwnProperty.call(remote, "questionHistory")) {
    merged.dailyQuestion = mergeDailyQuestion(localState?.dailyQuestion, remote.dailyQuestion);
    const questionHistorySides = preferLocal
      ? [localState?.questionHistory || [], remote.questionHistory || []]
      : [remote.questionHistory || [], localState?.questionHistory || []];
    merged.questionHistory = [...new Set(questionHistorySides.flat())].slice(0, 30);
    if (!preferLocal && (JSON.stringify(merged.dailyQuestion) !== JSON.stringify(remote.dailyQuestion) || merged.questionHistory.length > (remote.questionHistory || []).length)) sharedNeedsResync = true;
  }
  if (!partial || Object.prototype.hasOwnProperty.call(remote, "achievements")) {
    const custom = mergeRecords(localState?.achievements?.custom, remote.achievements?.custom);
    merged.achievements = {
      ...(preferLocal ? (remote.achievements || {}) : (localState?.achievements || {})),
      ...(preferLocal ? (localState?.achievements || {}) : (remote.achievements || {})),
      completed: mergeTimestampedMap(localState?.achievements?.completed, remote.achievements?.completed, preferLocal),
      edits: preferLocal
        ? { ...(remote.achievements?.edits || {}), ...(localState?.achievements?.edits || {}) }
        : { ...(localState?.achievements?.edits || {}), ...(remote.achievements?.edits || {}) },
      custom
    };
    if (!preferLocal && (Object.keys(deletedRecords).length > Object.keys(normalizeDeletedRecords(remote.deletedRecords)).length || custom.length > (remote.achievements?.custom || []).filter((item) => !deleted.has(item?.id)).length)) sharedNeedsResync = true;
  }
  if (!partial || Object.prototype.hasOwnProperty.call(remote, "garden")) {
    merged.garden = mergeGardenConcurrent(localState?.garden, remote.garden);
  }
  return applySharedDeletionTombstones(merged);
}

function mergeGardenConcurrent(localGarden, remoteGarden) {
  const local = mergeGarden(localGarden);
  const remote = mergeGarden(remoteGarden);
  const deletedIds = [...new Set([...(local.deletedIds || []), ...(remote.deletedIds || [])])].slice(-200);
  const deleted = new Set(deletedIds);
  const waterings = { ...local.waterings, ...remote.waterings };
  [...new Set([...Object.keys(local.waterings), ...Object.keys(remote.waterings)])].forEach((date) => {
    waterings[date] = [...new Set([...(local.waterings[date] || []), ...(remote.waterings[date] || [])])];
  });
  const mergeRecords = (left, right) => {
    const records = new Map();
    [...left, ...right].forEach((item) => {
      if (!item?.id || deleted.has(item.id)) return;
      const previous = records.get(item.id);
      const previousTime = previous?.updatedAt || previous?.createdAt || previous?.date || "";
      const nextTime = item.updatedAt || item.createdAt || item.date || "";
      if (!previous || nextTime >= previousTime) records.set(item.id, item);
    });
    return [...records.values()];
  };
  const choices = {};
  Object.keys(people).forEach((person) => {
    const localChoice = local.hybrid.choices?.[person];
    const remoteChoice = remote.hybrid.choices?.[person];
    choices[person] = !localChoice ? remoteChoice : (!remoteChoice ? localChoice : ((remoteChoice.updatedAt || remoteChoice.date || "") >= (localChoice.updatedAt || localChoice.date || "") ? remoteChoice : localChoice));
  });
  let round = Math.max(local.hybrid.round, remote.hybrid.round);
  Object.keys(choices).forEach((person) => {
    if (choices[person] && Number(choices[person].round || round) !== round) choices[person] = null;
  });
  const blooms = mergeRecords(local.hybrid.blooms, remote.hybrid.blooms);
  const snapshotMap = new Map();
  mergeRecords(local.snapshots, remote.snapshots).forEach((snapshot) => {
    const key = snapshot.id === "garden-v2-migration" ? snapshot.id : `${gardenStageIndex(Number(snapshot.points || 0))}-${snapshot.date}`;
    const previous = snapshotMap.get(key);
    if (!previous || (snapshot.updatedAt || "") >= (previous.updatedAt || "")) snapshotMap.set(key, snapshot);
  });
  const snapshots = [...snapshotMap.values()].sort((a, b) => `${b.date || ""}-${b.updatedAt || ""}`.localeCompare(`${a.date || ""}-${a.updatedAt || ""}`));
  const pointEvents = mergeRecords(local.pointEvents, remote.pointEvents);
  const creditedKeys = [...new Set([...(local.creditedKeys || []), ...(remote.creditedKeys || [])])];
  const decorationStates = {};
  gardenDecorations.forEach((item) => {
    const localState = local.decorationStates?.[item.id];
    const remoteState = remote.decorationStates?.[item.id];
    if (!localState && !remoteState) return;
    const selected = !localState ? remoteState : (!remoteState ? localState : ((remoteState.updatedAt || "") >= (localState.updatedAt || "") ? remoteState : localState));
    decorationStates[item.id] = { enabled: Boolean(selected.enabled), updatedAt: selected.updatedAt || "", legacy: Boolean(localState?.legacy || remoteState?.legacy) };
  });
  const normalizedDecorationStates = normalizeGardenDecorationStates(decorationStates);
  if (JSON.stringify(normalizedDecorationStates) !== JSON.stringify(decorationStates)) gardenNeedsResync = true;
  const localPlant = local.companionPlant || {};
  const remotePlant = remote.companionPlant || {};
  const plantIdentity = (remotePlant.updatedAt || "") >= (localPlant.updatedAt || "") ? remotePlant : localPlant;
  const plantCare = { ...(localPlant.care || {}), ...(remotePlant.care || {}) };
  [...new Set([...Object.keys(localPlant.care || {}), ...Object.keys(remotePlant.care || {})])].forEach((date) => {
    plantCare[date] = [...new Set([...(localPlant.care?.[date] || []), ...(remotePlant.care?.[date] || [])])];
  });
  const weeklyQuests = {};
  [...new Set([...Object.keys(local.weeklyQuests || {}), ...Object.keys(remote.weeklyQuests || {})])].forEach((weekKey) => {
    const left = local.weeklyQuests?.[weekKey];
    const right = remote.weeklyQuests?.[weekKey];
    const items = new Map();
    [...(left?.items || []), ...(right?.items || [])].forEach((item) => {
      const previous = items.get(item.id);
      if (!previous) {
        const doneState = { ...(item.doneState || {}) };
        (item.doneBy || []).forEach((person) => { if (!doneState[person]) doneState[person] = { done: true, updatedAt: item.updatedAt || "" }; });
        items.set(item.id, { ...item, doneState, doneBy: Object.keys(people).filter((person) => doneState[person]?.done) });
        return;
      }
      const doneState = {};
      Object.keys(people).forEach((person) => {
        const leftState = previous.doneState?.[person] || ((previous.doneBy || []).includes(person) ? { done: true, updatedAt: previous.updatedAt || "" } : null);
        const rightState = item.doneState?.[person] || ((item.doneBy || []).includes(person) ? { done: true, updatedAt: item.updatedAt || "" } : null);
        if (!leftState && !rightState) return;
        doneState[person] = !leftState ? rightState : (!rightState ? leftState : ((rightState.updatedAt || "") >= (leftState.updatedAt || "") ? rightState : leftState));
      });
      items.set(item.id, {
        ...((item.updatedAt || "") >= (previous.updatedAt || "") ? item : previous),
        doneState,
        doneBy: Object.keys(people).filter((person) => doneState[person]?.done)
      });
    });
    weeklyQuests[weekKey] = { ...(left || {}), ...(right || {}), weekKey, items: [...items.values()] };
  });
  const localSign = local.sign || defaults.garden.sign;
  const remoteSign = remote.sign || defaults.garden.sign;
  const sign = (remoteSign.updatedAt || "") >= (localSign.updatedAt || "") ? remoteSign : localSign;
  const yearbookHighlights = {};
  [...new Set([...Object.keys(local.yearbookHighlights || {}), ...Object.keys(remote.yearbookHighlights || {})])].forEach((key) => {
    const left = local.yearbookHighlights?.[key];
    const right = remote.yearbookHighlights?.[key];
    yearbookHighlights[key] = !left ? right : (!right ? left : ((right.updatedAt || "") >= (left.updatedAt || "") ? right : left));
  });
  if (choices.liu && choices.fu) {
    const bloomId = `garden-bloom-${round}`;
    if (!blooms.some((bloom) => bloom.id === bloomId)) {
      blooms.unshift({
        id: bloomId, round, date: todayString(), updatedAt: new Date().toISOString(),
        left: choices.liu, right: choices.fu,
        name: `${gardenColorNames[choices.liu.color]}与${gardenColorNames[choices.fu.color]}的第${round}朵花`
      });
      round += 1;
      choices.liu = null;
      choices.fu = null;
      gardenNeedsResync = true;
    }
  }
  if (pointEvents.length > Math.max(local.pointEvents.length, remote.pointEvents.length) || creditedKeys.length > Math.max(local.creditedKeys.length, remote.creditedKeys.length)) gardenNeedsResync = true;
  return {
    ...local,
    ...remote,
    version: 3,
    points: Math.max(local.points, remote.points),
    baselinePoints: Math.max(local.baselinePoints, remote.baselinePoints),
    migrationComplete: local.migrationComplete || remote.migrationComplete,
    creditedKeys,
    pointEvents,
    lastStage: Math.max(local.lastStage, remote.lastStage),
    waterings,
    seeds: mergeRecords(local.seeds, remote.seeds),
    wishes: mergeRecords(local.wishes, remote.wishes),
    snapshots,
    hybrid: {
      round,
      choices,
      blooms
    },
    unlockedAreas: [...new Set([...local.unlockedAreas, ...remote.unlockedAreas])],
    deletedIds,
    decorationStates: normalizedDecorationStates,
    featuredDecoration: "none",
    decorationUpdatedAt: Object.values(normalizedDecorationStates).reduce((latest, item) => item.updatedAt > latest ? item.updatedAt : latest, ""),
    companionPlant: { ...localPlant, ...remotePlant, ...plantIdentity, care: plantCare },
    flowerLetters: mergeRecords(local.flowerLetters, remote.flowerLetters),
    weeklyQuests,
    anniversaries: mergeRecords(local.anniversaries, remote.anniversaries),
    sign: { ...defaults.garden.sign, ...sign },
    yearbookHighlights
  };
}
function mergePrivateConcurrent(localSpace, remoteSpace, person, preferLocal = false) {
  const local = mergePrivateSpace(localSpace, person);
  const remote = mergePrivateSpace(remoteSpace, person);
  const deletedRecords = mergeDeletedRecords(local.deletedRecords, remote.deletedRecords);
  const deleted = new Set(Object.keys(deletedRecords));
  const mergeRecords = (localItems, remoteItems) => {
    const records = new Map();
    const sides = preferLocal ? [remoteItems || [], localItems || []] : [localItems || [], remoteItems || []];
    sides.flat().forEach((item) => {
      if (!item?.id || deleted.has(item.id)) return;
      const previous = records.get(item.id);
      if (!previous) records.set(item.id, item);
      else records.set(item.id, chooseTimestampedRecord(previous, item, true));
    });
    return [...records.values()];
  };
  return {
    ...(preferLocal ? remote : local),
    ...(preferLocal ? local : remote),
    deletedRecords,
    goals: mergeRecords(local.goals, remote.goals),
    traits: mergeRecords(local.traits, remote.traits),
    diaries: mergeRecords(local.diaries, remote.diaries),
    health: {
      ...(preferLocal ? remote.health : local.health),
      ...(preferLocal ? local.health : remote.health),
      water: Math.max(Number(local.health.water || 0), Number(remote.health.water || 0)),
      movement: Math.max(Number(local.health.movement || 0), Number(remote.health.movement || 0)),
      weights: mergeRecords(local.health.weights, remote.health.weights),
      cycles: mergeRecords(local.health.cycles, remote.health.cycles)
    }
  };
}

function mergePrivateSpace(savedSpace, person) {
  const base = structuredClone(defaults).private[person];
  const deletedRecords = normalizeDeletedRecords(savedSpace?.deletedRecords);
  const deleted = new Set(Object.keys(deletedRecords));
  const keepRecords = (items, fallback = []) => (Array.isArray(items) ? items : fallback).filter((item) => item?.id && !deleted.has(item.id));
  return {
    ...base,
    ...(savedSpace || {}),
    deletedRecords,
    goals: keepRecords(savedSpace?.goals),
    traits: keepRecords(savedSpace?.traits, base.traits),
    diaries: keepRecords(savedSpace?.diaries),
    health: {
      ...base.health,
      ...(savedSpace?.health || {}),
      weights: keepRecords(savedSpace?.health?.weights),
      cycles: keepRecords(savedSpace?.health?.cycles)
    }
  };
}
function renderEmpty(root, text) { root.innerHTML = `<p class="empty">${text}</p>`; }
function q(selector) { return document.querySelector(selector); }
function qa(selector) { return [...document.querySelectorAll(selector)]; }
function parseDate(value) { if (!value) return null; const [year, month, date] = value.split("-").map(Number); return new Date(year, month - 1, date); }
function startOfDay(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }
function formatDate(date) { return date ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日` : ""; }
function formatDateTime(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "刚刚";
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return `${date.getMonth() + 1}月${date.getDate()}日 ${time}`;
}
function formatDuration(seconds) {
  const value = Math.max(0, Math.round(Number(seconds) || 0));
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}
function localDateString(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return todayString();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function shortGardenLabel(value, max = 18) {
  const text = String(value || "共同回忆").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
function todayString() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; }
function uid() { return window.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function pickRandom(items) { return items[Math.floor(Math.random() * items.length)] || ""; }
function sortByDateDesc(items, key = "date") {
  const timestamp = (item) => {
    const fullCreatedAt = String(item?.createdAt || "").includes("T") ? item.createdAt : "";
    const value = item?.createdAtTime || fullCreatedAt || item?.updatedAt || "";
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  return [...items].sort((a, b) => {
    const dateOrder = String(b?.[key] || "").slice(0, 10).localeCompare(String(a?.[key] || "").slice(0, 10));
    return dateOrder || timestamp(b) - timestamp(a);
  });
}
function escapeHTML(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function syncFeatureError(error, feature) {
  const detail = [error?.message, error?.details, error?.hint].filter(Boolean).join(" ");
  if (/PGRST202|42883|does not exist|schema cache|love_voice_messages|love_miss/i.test(detail)) {
    return `${feature}尚未完成数据库升级，请在 Supabase SQL Editor 执行 supabase-upgrade-2026-08.sql。`;
  }
  if (/bucket not found|love-voices|storage/i.test(detail)) {
    return `${feature}的私有存储尚未生效，请重新执行本次数据库升级脚本。`;
  }
  if (/JWT|unauthorized|sign in|not connected/i.test(detail)) return `登录状态已失效，请重新登录后使用${feature}。`;
  return detail ? `${feature}暂时没有成功：${detail}` : `${feature}暂时没有成功，请稍后重试。`;
}
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
function showGamePhotoPreview(file) {
  clearGamePhotoPreview();
  if (!file) return;
  gamePhotoPreviewUrl = URL.createObjectURL(file);
  els.gamePhotoPreviewImage.src = gamePhotoPreviewUrl;
  els.gamePhotoPreview.hidden = false;
}
function clearGamePhotoPreview() {
  if (gamePhotoPreviewUrl) URL.revokeObjectURL(gamePhotoPreviewUrl);
  gamePhotoPreviewUrl = "";
  els.gamePhotoPreviewImage.removeAttribute("src");
  els.gamePhotoPreview.hidden = true;
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
