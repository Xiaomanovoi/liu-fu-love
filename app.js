const storageKey = "love-tool-liu-fu-v2";
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
  questionBank[category] = [...new Set([...questionBank[category], ...questions])];
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
  { name: "刚刚发芽", min: 200, scene: "sprout", copy: "第一片嫩叶，记住了你们的认真。", reward: "解锁心意木牌与新叶" },
  { name: "双生幼苗", min: 500, scene: "seedling", copy: "两株花藤，正在向彼此靠近。", reward: "双枝幼苗与暖光灯串" },
  { name: "心意花苞", min: 900, scene: "bud", copy: "花苞已经出现，离第一次盛开不远了。", reward: "花苞、长椅与新的叶片" },
  { name: "初次盛开", min: 1400, scene: "bloom", copy: "你们共同照顾的花，已经认真盛开。", reward: "双花盛开与玻璃风铃" },
  { name: "秘密花园", min: 2000, scene: "garden", copy: "花房已经打开，回忆正在长成风景。", reward: "心形藤蔓与星光路灯" },
  { name: "花间小径", min: 2800, scene: "path", copy: "花与路延伸开来，每一步都有共同生活的痕迹。", reward: "秋千、小池塘与花间小径" },
  { name: "星光庭院", min: 3400, scene: "courtyard", copy: "夜晚也有温柔的光，庭院开始拥有自己的四季。", reward: "星幕、花架与月光拱门" },
  { name: "四季秘境", min: 4300, scene: "sanctuary", copy: "被认真照顾的爱，终于长成了一座四季都盛开的花园。", reward: "双人亭与完整四季花境" }
];
const gardenColorNames = { coral: "珊瑚粉", lavender: "淡紫色", mint: "薄荷绿", gold: "晨光金" };
const gardenColorHex = { coral: "#df7e8d", lavender: "#9d92c5", mint: "#79a58e", gold: "#d4a45f" };
const gardenShapeNames = { round: "圆润", star: "星形", heart: "心形", soft: "轻盈" };
const gardenDecorations = [
  { id: "plaque", name: "心意木牌", threshold: 80, slot: "foreground", icon: "signpost" },
  { id: "mushrooms", name: "蘑菇小灯", threshold: 120, slot: "left", icon: "lamp-desk" },
  { id: "stones", name: "月白石径", threshold: 160, slot: "path", icon: "footprints" },
  { id: "planters", name: "彩釉花盆", threshold: 220, slot: "right", icon: "flower-2" },
  { id: "lights", name: "暖光灯串", threshold: 300, slot: "overhead", icon: "lightbulb" },
  { id: "picnic", name: "双人野餐毯", threshold: 380, slot: "foreground", icon: "sandwich" },
  { id: "ribbon", name: "心意飘带", threshold: 460, slot: "atmosphere", icon: "ribbon" },
  { id: "bench", name: "双人长椅", threshold: 560, slot: "left", icon: "armchair" },
  { id: "mailbox", name: "花园信箱", threshold: 680, slot: "right", icon: "mailbox" },
  { id: "birdhouse", name: "林间鸟屋", threshold: 800, slot: "hanging", icon: "house" },
  { id: "windchime", name: "玻璃风铃", threshold: 920, slot: "hanging", icon: "music-2" },
  { id: "arch", name: "蔷薇拱门", threshold: 1080, slot: "structure", icon: "landmark" },
  { id: "lanterns", name: "星光路灯", threshold: 1250, slot: "path", icon: "lamp-wall-up" },
  { id: "butterflyhouse", name: "蝴蝶小屋", threshold: 1400, slot: "right", icon: "origami" },
  { id: "swing", name: "花藤秋千", threshold: 1600, slot: "left", icon: "panel-top" },
  { id: "fountain", name: "晨露喷泉", threshold: 1800, slot: "right", icon: "waves" },
  { id: "pond", name: "月影小池", threshold: 2000, slot: "right", icon: "circle-dot-dashed" },
  { id: "bridge", name: "白木小桥", threshold: 2200, slot: "path", icon: "route" },
  { id: "shelf", name: "四季花架", threshold: 2400, slot: "structure", icon: "library-big" },
  { id: "flowercart", name: "流动花车", threshold: 2600, slot: "left", icon: "shopping-basket" },
  { id: "starlight", name: "庭院星幕", threshold: 2800, slot: "atmosphere", icon: "sparkles" },
  { id: "moonlamp", name: "月亮吊灯", threshold: 3000, slot: "overhead", icon: "moon-star" },
  { id: "moongate", name: "月光花门", threshold: 3300, slot: "structure", icon: "circle-arch" },
  { id: "pavilion", name: "双人花亭", threshold: 3600, slot: "structure", icon: "building" },
  { id: "wishbottles", name: "心愿瓶灯", threshold: 3900, slot: "foreground", icon: "flask-conical" },
  { id: "seasongate", name: "四季秘境门", threshold: 4300, slot: "structure", icon: "door-open" }
];
const gardenPointCategories = {
  baseline: { name: "历史成长", icon: "heart" }, watering: { name: "共同浇水", icon: "droplets" },
  question: { name: "每日问答", icon: "messages-square" }, message: { name: "共同留言", icon: "message-circle-heart" },
  voice: { name: "声音信箱", icon: "mic-2" }, photo: { name: "公共相册", icon: "image" },
  task: { name: "双人任务", icon: "list-checks" }, game: { name: "游戏记录", icon: "gamepad-2" },
  seed: { name: "心意种子", icon: "sprout" }, bloom: { name: "双生花", icon: "flower-2" },
  achievement: { name: "情侣成就", icon: "badge-check" }, meeting: { name: "见面记录", icon: "map-pin-heart" },
  wish: { name: "共同愿望", icon: "sparkles" }, coPlant: { name: "共育植物", icon: "leaf" },
  gardenQuest: { name: "花园任务", icon: "calendar-heart" }, flowerLetter: { name: "花期信箱", icon: "mail-heart" }
};
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
    anniversaries: []
  },
  private: {
    liu: { goals: [], traits: [{ id: uid(), type: "优点", text: "她会认真记住我随口说过的小事" }], diaries: [], health: { water: 0, movement: 0, weights: [], cycles: [] } },
    fu: { goals: [], traits: [{ id: uid(), type: "习惯", text: "他会在忙完后第一时间分享今天" }], diaries: [], health: { water: 0, movement: 0, weights: [], cycles: [] } }
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
let gardenNeedsResync = false;
let gardenSeedPhotoOptionsKey = "";
let gardenSeedVoiceOptionsKey = "";
let gardenSeedOptionsPending = false;

const els = {
  daysTogether: q("#daysTogether"), editStartDate: q("#editStartDate"), settingsDialog: q("#settingsDialog"), startDateInput: q("#startDateInput"), saveStartDate: q("#saveStartDate"),
  presenceText: q("#presenceText"), openMood: q("#openMood"), moodDialog: q("#moodDialog"), moodDialogTitle: q("#moodDialogTitle"), moodPicker: q("#moodPicker"), moodNote: q("#moodNote"), saveMood: q("#saveMood"), pairingNotice: q("#pairingNotice"), openPairing: q("#openPairing"),
  tabs: qa(".tab"), screens: qa(".screen"), capsuleType: q("#capsuleType"), capsuleDate: q("#capsuleDate"), capsuleText: q("#capsuleText"), moodCards: q("#moodCards"), nextMeetingTitle: q("#nextMeetingTitle"), nextMeetingMeta: q("#nextMeetingMeta"), nextMeetingDays: q("#nextMeetingDays"),
  sendMiss: q("#sendMiss"), missHint: q("#missHint"), missSentLabel: q("#missSentLabel"), missSentTotal: q("#missSentTotal"), missSentToday: q("#missSentToday"), missReceivedLabel: q("#missReceivedLabel"), missReceivedTotal: q("#missReceivedTotal"), missReceivedToday: q("#missReceivedToday"),
  writerName: q("#writerName"), switchWriter: q("#switchWriter"), messageForm: q("#messageForm"), messageText: q("#messageText"), messageList: q("#messageList"), questionText: q("#questionText"), questionCategory: q("#questionCategory"), questionCategorySelect: q("#questionCategorySelect"), newQuestion: q("#newQuestion"), questionAnswerForm: q("#questionAnswerForm"), questionAnswer: q("#questionAnswer"), questionWriterName: q("#questionWriterName"), questionAnswers: q("#questionAnswers"),
  recordVoice: q("#recordVoice"), voiceRecordStatus: q("#voiceRecordStatus"), voiceRecordTimer: q("#voiceRecordTimer"), voiceDraft: q("#voiceDraft"), voicePreview: q("#voicePreview"), discardVoice: q("#discardVoice"), sendVoice: q("#sendVoice"), voiceNotice: q("#voiceNotice"), voiceList: q("#voiceList"), voiceCount: q("#voiceCount"),
  openGardenHome: q("#openGardenHome"), openGardenTogether: q("#openGardenTogether"), closeGarden: q("#closeGarden"), gardenPreviewStatus: q("#gardenPreviewStatus"), gardenShortcutStage: q("#gardenShortcutStage"), gardenShortcutWater: q("#gardenShortcutWater"), gardenWeatherChip: q("#gardenWeatherChip"), gardenStage: q("#gardenStage"), gardenPlant: q("#gardenPlant"), gardenGateSign: q("#gardenGateSign"), gardenStageName: q("#gardenStageName"), gardenPoints: q("#gardenPoints"), gardenProgressBar: q("#gardenProgressBar"), gardenNextStage: q("#gardenNextStage"), gardenWateringStatus: q("#gardenWateringStatus"), waterGarden: q("#waterGarden"), gardenNotice: q("#gardenNotice"), gardenTools: q(".garden-tools"), gardenPanels: qa("[data-garden-content]"), gardenButterfly: q("#gardenButterfly"), gardenMemoryReveal: q("#gardenMemoryReveal"), closeGardenMemory: q("#closeGardenMemory"), gardenMemoryTitle: q("#gardenMemoryTitle"), gardenMemoryText: q("#gardenMemoryText"), gardenFestivalScene: q("#gardenFestivalScene"), gardenCompanionScene: q("#gardenCompanionScene"),
  gardenSeedForm: q("#gardenSeedForm"), gardenSeedText: q("#gardenSeedText"), gardenSeedUnlockDate: q("#gardenSeedUnlockDate"), gardenSeedPhoto: q("#gardenSeedPhoto"), gardenSeedVoice: q("#gardenSeedVoice"), gardenSeedCount: q("#gardenSeedCount"), gardenSeedList: q("#gardenSeedList"), gardenWishForm: q("#gardenWishForm"), gardenWishText: q("#gardenWishText"), gardenWishDate: q("#gardenWishDate"), gardenWishCount: q("#gardenWishCount"), gardenWishList: q("#gardenWishList"),
  gardenHybridForm: q("#gardenHybridForm"), gardenHybridColor: q("#gardenHybridColor"), gardenHybridShape: q("#gardenHybridShape"), gardenHybridStatus: q("#gardenHybridStatus"), gardenBloomCount: q("#gardenBloomCount"), gardenBloomGallery: q("#gardenBloomGallery"), gardenMemoryFlowers: q("#gardenMemoryFlowers"), gardenSnapshotCount: q("#gardenSnapshotCount"), gardenStageProgressText: q("#gardenStageProgressText"), gardenStageRemaining: q("#gardenStageRemaining"), gardenRoadmap: q("#gardenRoadmap"), gardenPointBreakdown: q("#gardenPointBreakdown"), gardenPointLedger: q("#gardenPointLedger"), gardenAreaProgress: q("#gardenAreaProgress"), gardenTimeline: q("#gardenTimeline"),
  gardenSceneDecoration: q("#gardenSceneDecoration"), gardenDecorationList: q("#gardenDecorationList"),
  gardenTogetherSeason: q("#gardenTogetherSeason"), gardenCompanionDisplay: q("#gardenCompanionDisplay"), gardenCompanionForm: q("#gardenCompanionForm"), gardenCompanionName: q("#gardenCompanionName"), gardenCompanionSpecies: q("#gardenCompanionSpecies"), gardenCompanionStatus: q("#gardenCompanionStatus"), gardenCompanionPlantName: q("#gardenCompanionPlantName"), gardenCompanionMeta: q("#gardenCompanionMeta"), gardenCompanionProgress: q("#gardenCompanionProgress"), gardenCompanionCareStatus: q("#gardenCompanionCareStatus"), gardenCompanionCare: q("#gardenCompanionCare"), gardenQuestWeek: q("#gardenQuestWeek"), gardenQuestProgress: q("#gardenQuestProgress"), gardenQuestList: q("#gardenQuestList"), gardenLetterForm: q("#gardenLetterForm"), gardenLetterText: q("#gardenLetterText"), gardenLetterDate: q("#gardenLetterDate"), gardenLetterCount: q("#gardenLetterCount"), gardenLetterList: q("#gardenLetterList"), gardenAnniversaryForm: q("#gardenAnniversaryForm"), gardenAnniversaryTitle: q("#gardenAnniversaryTitle"), gardenAnniversaryDate: q("#gardenAnniversaryDate"), gardenAnniversaryStyle: q("#gardenAnniversaryStyle"), gardenAnniversaryList: q("#gardenAnniversaryList"),
  gardenMemoryDialog: q("#gardenMemoryDialog"), closeGardenMemoryDialog: q("#closeGardenMemoryDialog"), gardenMemoryImage: q("#gardenMemoryImage"), gardenMemoryType: q("#gardenMemoryType"), gardenMemoryDialogTitle: q("#gardenMemoryDialogTitle"), gardenMemoryMeta: q("#gardenMemoryMeta"), gardenMemoryDialogText: q("#gardenMemoryDialogText"),
  taskForm: q("#taskForm"), taskText: q("#taskText"), taskList: q("#taskList"), taskStats: q("#taskStats"),
  achievementStats: q("#achievementStats"), achievementPercent: q("#achievementPercent"), achievementProgressBar: q("#achievementProgressBar"), achievementFilter: q("#achievementFilter"), achievementVisibleCount: q("#achievementVisibleCount"), achievementList: q("#achievementList"), achievementMore: q("#achievementMore"), achievementForm: q("#achievementForm"), achievementText: q("#achievementText"), achievementEditDialog: q("#achievementEditDialog"), achievementEditId: q("#achievementEditId"), achievementEditText: q("#achievementEditText"), saveAchievementEdit: q("#saveAchievementEdit"),
  noteForm: q("#noteForm"), noteReceiver: q("#noteReceiver"), noteUnlockDate: q("#noteUnlockDate"), noteText: q("#noteText"), noteList: q("#noteList"), noteStats: q("#noteStats"),
  studyForm: q("#studyForm"), studyContent: q("#studyContent"), studyDate: q("#studyDate"), studyMinutes: q("#studyMinutes"), studyNote: q("#studyNote"), studyList: q("#studyList"), studyStats: q("#studyStats"),
  gameForm: q("#gameForm"), gameDate: q("#gameDate"), gameName: q("#gameName"), gameAchievement: q("#gameAchievement"), gamePhotoInput: q("#gamePhotoInput"), gamePhotoPreview: q("#gamePhotoPreview"), gamePhotoPreviewImage: q("#gamePhotoPreviewImage"), clearGamePhoto: q("#clearGamePhoto"), gameList: q("#gameList"), gameStats: q("#gameStats"),
  meetingForm: q("#meetingForm"), meetingTitle: q("#meetingTitle"), meetingDate: q("#meetingDate"), meetingPlace: q("#meetingPlace"), meetingNote: q("#meetingNote"), meetingList: q("#meetingList"),
  albumForm: q("#albumForm"), photoInput: q("#photoInput"), photoPreview: q("#photoPreview"), photoPreviewImage: q("#photoPreviewImage"), clearPhotoSelection: q("#clearPhotoSelection"), photoCaption: q("#photoCaption"), albumGrid: q("#albumGrid"),
  personOptions: qa(".person-option"), goalForm: q("#goalForm"), goalText: q("#goalText"), goalList: q("#goalList"), goalStats: q("#goalStats"), traitForm: q("#traitForm"), traitType: q("#traitType"), traitText: q("#traitText"), traitList: q("#traitList"), diaryForm: q("#diaryForm"), diaryEditId: q("#diaryEditId"), diaryDate: q("#diaryDate"), diaryMood: q("#diaryMood"), diaryTitle: q("#diaryTitle"), diaryText: q("#diaryText"), diaryList: q("#diaryList"), saveDiary: q("#saveDiary"), cancelDiaryEdit: q("#cancelDiaryEdit"), healthPanel: q("#healthPanel"), waterCount: q("#waterCount"), moveCount: q("#moveCount"), weightValue: q("#weightValue"), weightForm: q("#weightForm"), weightDate: q("#weightDate"), weightInput: q("#weightInput"), weightHistory: q("#weightHistory"), encourageLine: q("#encourageLine"), cycleForm: q("#cycleForm"), cycleStart: q("#cycleStart"), cycleEnd: q("#cycleEnd"), cycleLength: q("#cycleLength"), cycleNextDate: q("#cycleNextDate"), cycleDaysLeft: q("#cycleDaysLeft"), cycleHistory: q("#cycleHistory")
};

init();

function init() {
  bindNavigation();
  bindActions();
  bindGardenActions();
  bindSyncEvents();
  setFormDates();
  if (refreshGardenProgress("花园开始生长")) localStorage.setItem(storageKey, JSON.stringify(state));
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
  const navigationTarget = target === "garden" ? "together" : target;
  document.body.classList.toggle("garden-mode", target === "garden");
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
  els.saveMood.addEventListener("click", () => {
    const person = state.writer;
    state.moods[person] = { feeling: selectedMood, note: els.moodNote.value.trim() || "今天也在想你" };
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
    state.tasks.unshift({ id: uid(), text, doneBy: [] });
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
    state.achievements.custom.unshift({ id: `custom-${uid()}`, text, createdAt: todayString() });
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
    if (custom) custom.text = text;
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
      state.gameRecords.unshift({ id: uid(), date, game, achievement, image });
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
  els.goalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.goalText.value.trim();
    if (!text) return;
    privateSpace().goals.unshift({ id: uid(), text, completed: false, completedAt: "", createdAt: todayString() });
    els.goalForm.reset();
    persistAndRender();
  });
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
    garden.hybrid.choices[person] = { round: garden.hybrid.round, color: els.gardenHybridColor.value, shape: els.gardenHybridShape.value, date: todayString(), updatedAt: new Date().toISOString() };
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

function bindSyncEvents() {
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
    const { shared, privateData, role, initializeEmptySpace } = event.detail;
    const mergedShared = shared ? { ...shared, garden: mergeGardenConcurrent(state.garden, shared.garden) } : shared;
    const next = {
      ...state,
      ...(mergedShared || {}),
      writer: role || state.writer,
      privatePerson: role || state.privatePerson,
      private: { ...state.private }
    };
    if (privateData && role) next.private[role] = privateData;
    state = mergeDefaults(next);
    if (shared?.garden && Number(shared.garden.version || 1) < 2) {
      state.garden.baselinePoints = Math.max(Number(state.garden.baselinePoints || 0), Number(shared.garden.points || 0));
      state.garden.migrationComplete = false;
    }
    saveLocalAndRender();
    if (initializeEmptySpace || (shared && !shared.garden) || Number(shared?.garden?.version || 1) < 2 || gardenNeedsResync) {
      gardenNeedsResync = false;
      window.LoveSync?.scheduleSave(state);
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
  if (!voiceMessages.length) return renderEmpty(els.voiceList, "第一封心声，等一句熟悉的声音。");
  els.voiceList.replaceChildren(...voiceMessages.map((message) => {
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
  localStorage.setItem(storageKey, JSON.stringify(state));
  window.LoveSync?.scheduleSave(state);
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

function renderGardenPanels() {
  els.gardenTools.querySelectorAll("[data-garden-panel]").forEach((button) => button.classList.toggle("is-active", button.dataset.gardenPanel === activeGardenPanel));
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

  const letters = garden.flowerLetters || [];
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

function renderGardenSeeds() {
  const seeds = gardenState().seeds || [];
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
  els.gardenBloomCount.textContent = `${garden.hybrid.blooms.length} 朵`;
  if (!garden.hybrid.blooms.length) {
    renderEmpty(els.gardenBloomGallery, "第一朵双色花，等待两个人各自选一片花瓣。");
  } else {
    els.gardenBloomGallery.replaceChildren(...garden.hybrid.blooms.slice(0, 12).map((bloom) => {
      const node = document.createElement("article");
      node.className = "hybrid-bloom";
      node.style.setProperty("--bloom-left", gardenColorHex[bloom.left.color] || gardenColorHex.coral);
      node.style.setProperty("--bloom-right", gardenColorHex[bloom.right.color] || gardenColorHex.lavender);
      node.innerHTML = `<span class="hybrid-flower" aria-hidden="true"><i></i><i></i></span><div><strong>${escapeHTML(bloom.name)}</strong><small>${gardenShapeNames[bloom.left.shape]} × ${gardenShapeNames[bloom.right.shape]} · ${formatDate(parseDate(bloom.date))}</small></div>`;
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

function renderGardenGrowth() {
  const garden = gardenState();
  const points = Math.max(Number(garden.points || 0), calculateGardenPoints());
  const stageIndex = gardenStageIndex(points);
  const nextStage = gardenStages[stageIndex + 1];
  const events = effectiveGardenPointEvents();
  renderGardenDecorations(points);
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

  const areas = [
    { name: "主花园", threshold: 0, copy: "浇水、种子与双生花" },
    { name: "回忆角落", threshold: 900, copy: "记忆花朵与蝴蝶来访" },
    { name: "晨光花房", threshold: 2000, copy: "心形藤蔓与花房入口" },
    { name: "花间小径", threshold: 2800, copy: "小池与花路延伸" },
    { name: "星光庭院", threshold: 3400, copy: "夜色中的庭院风景" }
  ];
  els.gardenAreaProgress.replaceChildren(...areas.map((area) => {
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
  const enabled = gardenDecorations.filter((item) => garden.decorationStates[item.id]?.enabled && gardenDecorationUnlocked(item, garden, points));
  els.gardenSceneDecoration.dataset.decorationCount = String(enabled.length);
  els.gardenSceneDecoration.innerHTML = enabled.map((item) => gardenDecorationMarkup(item.id)).join("");
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
  const markup = {
    plaque: `<span class="garden-decor decor-plaque"><b>LIU ♥ FU</b></span>`,
    mushrooms: `<span class="garden-decor decor-mushrooms"><i></i><i></i><i></i></span>`,
    stones: `<span class="garden-decor decor-stones"><i></i><i></i><i></i><i></i></span>`,
    planters: `<span class="garden-decor decor-planters"><i></i><i></i><i></i></span>`,
    lights: `<span class="garden-decor garden-string-lights"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>`,
    picnic: `<span class="garden-decor decor-picnic"><i></i><b></b></span>`,
    ribbon: `<span class="garden-decor decor-ribbon"><i></i><i></i><i></i></span>`,
    bench: `<span class="garden-decor decor-bench"><i></i></span>`,
    mailbox: `<span class="garden-decor decor-mailbox"><i>♥</i></span>`,
    birdhouse: `<span class="garden-decor decor-birdhouse"><i></i></span>`,
    windchime: `<span class="garden-decor garden-windchime"><i></i><i></i><i></i></span>`,
    arch: `<span class="garden-decor decor-arch"><i></i><i></i><i></i><i></i><i></i></span>`,
    lanterns: `<span class="garden-decor decor-lanterns"><i></i><i></i></span>`,
    butterflyhouse: `<span class="garden-decor decor-butterflyhouse"><i></i><b></b></span>`,
    swing: `<span class="garden-decor decor-swing"><i></i></span>`,
    fountain: `<span class="garden-decor decor-fountain"><i></i><b></b></span>`,
    pond: `<span class="garden-decor decor-pond"><i></i><b></b></span>`,
    bridge: `<span class="garden-decor decor-bridge"><i></i><i></i><i></i></span>`,
    shelf: `<span class="garden-decor decor-shelf"><i></i><i></i><i></i></span>`,
    flowercart: `<span class="garden-decor decor-flowercart"><i></i><i></i><b></b></span>`,
    starlight: `<span class="garden-decor decor-starlight"><i></i><i></i><i></i><i></i><i></i></span>`,
    moonlamp: `<span class="garden-decor decor-moonlamp"><i></i></span>`,
    moongate: `<span class="garden-decor decor-moongate"><i></i></span>`,
    pavilion: `<span class="garden-decor decor-pavilion"><i></i><b></b></span>`,
    wishbottles: `<span class="garden-decor decor-wishbottles"><i></i><i></i><i></i></span>`,
    seasongate: `<span class="garden-decor decor-seasongate"><i></i><b></b></span>`
  };
  return markup[id] || "";
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

function renderAchievements() {
  const achievementState = state.achievements;
  const edits = achievementState.edits || {};
  const custom = (achievementState.custom || []).map((item) => ({ ...item, isCustom: true }));
  const preset = achievementDefinitions.map((item) => ({ ...item, text: edits[item.id] || item.text, isCustom: false }));
  const all = [...custom, ...preset];
  const completed = achievementState.completed || {};
  const completedCount = all.filter((item) => completed[item.id]).length;
  const percent = all.length ? Math.round((completedCount / all.length) * 100) : 0;
  els.achievementStats.textContent = `${completedCount}/${all.length}`;
  els.achievementPercent.textContent = `${percent}%`;
  els.achievementProgressBar.style.width = `${percent}%`;

  let items = all;
  if (activeAchievementFilter === "done") items = items.filter((item) => completed[item.id]);
  if (activeAchievementFilter === "todo") items = items.filter((item) => !completed[item.id]);
  const visibleItems = achievementsExpanded ? items : items.slice(0, 6);
  els.achievementVisibleCount.textContent = `显示 ${visibleItems.length}/${items.length} 项`;
  els.achievementMore.hidden = items.length <= 6;
  els.achievementMore.textContent = achievementsExpanded ? "收起成就" : `展开更多（${items.length - visibleItems.length}）`;
  if (!items.length) {
    renderEmpty(els.achievementList, "这个筛选条件下还没有成就。");
  } else {
    els.achievementList.replaceChildren(...visibleItems.map((item) => {
      const record = completed[item.id];
      const isDone = Boolean(record);
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
    if (input.checked) state.achievements.completed[input.dataset.achievementId] = { date: "" };
    else delete state.achievements.completed[input.dataset.achievementId];
    persistAndRender();
  }));
  els.achievementList.querySelectorAll("[data-achievement-date]").forEach((input) => input.addEventListener("change", () => {
    state.achievements.completed[input.dataset.achievementDate] = { date: input.value };
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
    state.achievements.custom = state.achievements.custom.filter((item) => item.id !== id);
    delete state.achievements.completed[id];
    delete state.achievements.edits[id];
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

function renderGameRecords() {
  const records = sortByDateDesc(state.gameRecords || []);
  els.gameStats.textContent = `${records.length} 局`;
  if (!records.length) return renderEmpty(els.gameList, "把下一次并肩作战的高光时刻存下来。");
  els.gameList.replaceChildren(...records.map((item) => {
    const node = document.createElement("article");
    node.className = "game-record";
    const image = item.image ? `<img src="${item.image}" alt="${escapeHTML(item.game)}的游戏截图">` : "";
    node.innerHTML = `${image}<div class="game-record-copy"><header><span>共同战绩</span><time>${formatDate(parseDate(item.date))}</time></header><h3>${escapeHTML(item.game)}</h3><p>${escapeHTML(item.achievement)}</p></div><button class="delete-button" data-delete-game="${item.id}" type="button" aria-label="删除游戏记录">×</button>`;
    return node;
  }));
  els.gameList.querySelectorAll("[data-delete-game]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("确定删除这条游戏记录吗？")) return;
    state.gameRecords = state.gameRecords.filter((item) => item.id !== button.dataset.deleteGame);
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
    persistAndRender();
  }));
  els.goalList.querySelectorAll("[data-delete-goal]").forEach((button) => button.addEventListener("click", () => {
    if (!window.confirm("确定删除这个个人目标吗？")) return;
    const currentSpace = privateSpace();
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
  state.dailyQuestion = { id: uid(), category: chosenCategory, text, date: todayString(), answers: { liu: "", fu: "" } };
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
function persistAndRender(gardenReason = "共同生活") {
  refreshGardenProgress(gardenReason);
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();
  window.LoveSync?.scheduleSave(state);
}
function saveLocalAndRender() { refreshGardenProgress("同步新的共同回忆"); localStorage.setItem(storageKey, JSON.stringify(state)); render(); }
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
    questionHistory: Array.isArray(saved.questionHistory) ? saved.questionHistory.slice(0, 30) : [],
    loveNotes: Array.isArray(saved.loveNotes) ? saved.loveNotes : [],
    studyLogs: Array.isArray(saved.studyLogs) ? saved.studyLogs : [],
    gameRecords: Array.isArray(saved.gameRecords) ? saved.gameRecords : [],
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
    decorationStates,
    featuredDecoration: "none",
    decorationUpdatedAt: savedGarden?.decorationUpdatedAt || "",
    companionPlant: {
      ...base.companionPlant,
      ...(savedGarden?.companionPlant || {}),
      care: { ...base.companionPlant.care, ...(savedGarden?.companionPlant?.care || {}) }
    },
    flowerLetters: Array.isArray(savedGarden?.flowerLetters) ? savedGarden.flowerLetters : [],
    weeklyQuests: savedGarden?.weeklyQuests && typeof savedGarden.weeklyQuests === "object" ? savedGarden.weeklyQuests : {},
    anniversaries: Array.isArray(savedGarden?.anniversaries) ? savedGarden.anniversaries : []
  };
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
    decorationStates,
    featuredDecoration: "none",
    decorationUpdatedAt: Object.values(decorationStates).reduce((latest, item) => item.updatedAt > latest ? item.updatedAt : latest, ""),
    companionPlant: { ...localPlant, ...remotePlant, ...plantIdentity, care: plantCare },
    flowerLetters: mergeRecords(local.flowerLetters, remote.flowerLetters),
    weeklyQuests,
    anniversaries: mergeRecords(local.anniversaries, remote.anniversaries)
  };
}
function mergePrivateSpace(savedSpace, person) {
  const base = structuredClone(defaults).private[person];
  return {
    ...base,
    ...(savedSpace || {}),
    goals: Array.isArray(savedSpace?.goals) ? savedSpace.goals : [],
    traits: Array.isArray(savedSpace?.traits) ? savedSpace.traits : base.traits,
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
function sortByDateDesc(items, key = "date") { return [...items].sort((a, b) => (b[key] || "").localeCompare(a[key] || "")); }
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
