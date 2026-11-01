const refs=[
  [
    "《毛泽东的读书生活》",
    "龚育之、逄先知、石仲泉等｜生活·读书·新知三联书店，1986年初版",
    "https://books.google.com/books?id=8lJNAAAAMAAJ"
  ],
  [
    "《博览群书的革命家》",
    "逄先知｜《人民日报》1986年9月6日，第5版（公开转录）",
    "https://cn.govopendata.com/renminribao/1986/09/06/5/"
  ],
  [
    "《从毛泽东同志的读书生活谈起》",
    "陈晋｜共产党员网，2024年5月1日",
    "https://www.12371.cn/2024/05/01/ARTI1714530279647220.shtml"
  ],
  [
    "《博览而勤思 毛泽东是如何读书的？》",
    "薛方宜｜新华网转载《北京晚报》，2021年3月8日",
    "https://www.xinhuanet.com/book/20210702/C96E4301DBA000016D4B15001BB06FF0/c.html"
  ],
  [
    "《毛泽东阅读史略（1—4）》",
    "陈晋｜中共中央党史和文献研究院网站",
    "https://www.dswxyjy.org.cn/n1/2019/0625/c427555-31187786.html"
  ],
  [
    "《反对本本主义》",
    "毛泽东，1930年｜共产党员网原文",
    "https://www.12371.cn/2012/08/10/ARTI1344592797863461.shtml"
  ],
  [
    "《改造我们的学习》",
    "毛泽东，1941年｜共产党员网原文",
    "https://www.12371.cn/2012/11/19/ARTI1353322284898760.shtml"
  ],
  [
    "《关于党的百年奋斗重大成就和历史经验的决议》",
    "2021年｜共产党员网刊载",
    "https://djyj.12371.cn/2021/12/07/ARTI1638840709196964.shtml"
  ]
];
const excerpts={
  "purpose": {
    "quote": "树信仰、求真知、促实践、达情意",
    "by": "陈晋《毛泽东阅读史略（1—4）》",
    "url": "https://www.dswxyjy.org.cn/n1/2019/0625/c427555-31187786.html",
    "loc": "开篇：各时期阅读的目的",
    "kind": "研究文章原文"
  },
  "books": {
    "quote": "特别是他加了批注的那些",
    "by": "逄先知《博览群书的革命家》",
    "url": "https://cn.govopendata.com/renminribao/1986/09/06/5/",
    "loc": "“酷爱读书，广收博览”中1947年撤离延安一段",
    "kind": "亲历回忆原文"
  },
  "philosophy": {
    "quote": "我的工具不够，今年还只能作工具的研究",
    "by": "毛泽东1939年致何干之信，陈晋文章援引",
    "url": "https://www.12371.cn/2024/05/01/ARTI1714530279647220.shtml",
    "loc": "“博览群书”中读哲学书籍一段",
    "kind": "文中援引书信"
  },
  "luxun": {
    "quote": "都要一一改正过来",
    "by": "薛方宜《博览而勤思 毛泽东是如何读书的？》",
    "url": "https://www.xinhuanet.com/book/20210702/C96E4301DBA000016D4B15001BB06FF0/c.html",
    "loc": "“尤爱读鲁迅和《红楼梦》”中订正错漏一段",
    "kind": "书评原文"
  },
  "novel": {
    "quote": "很细致的、很精细的社会历史",
    "by": "毛泽东谈《红楼梦》，陈晋文章援引",
    "url": "https://www.12371.cn/2024/05/01/ARTI1714530279647220.shtml",
    "loc": "“善于读书”中经典反复读一段",
    "kind": "文中援引谈话"
  },
  "investigate": {
    "quote": "一是向人做调查；一是向书本做调查",
    "by": "逄先知《博览群书的革命家》",
    "url": "https://cn.govopendata.com/renminribao/1986/09/06/5/",
    "loc": "“酷爱读书，广收博览”中两方面调查一段",
    "kind": "两个原文短句并列",
    "parts": [
      "一是向人做调查",
      "一是向书本做调查"
    ]
  },
  "material": {
    "quote": "详细地占有材料，加以科学的分析和综合的研究",
    "by": "毛泽东《改造我们的学习》",
    "url": "https://www.12371.cn/2012/11/19/ARTI1353322284898760.shtml",
    "loc": "第三部分：对主观主义学习态度的分析",
    "kind": "著作原文"
  },
  "conclusion": {
    "quote": "一切结论产生于调查情况的末尾",
    "by": "毛泽东《反对本本主义》",
    "url": "https://www.12371.cn/2012/08/10/ARTI1344592797863461.shtml",
    "loc": "第二节“调查就是解决问题”",
    "kind": "著作原文"
  },
  "limits": {
    "quote": "有所侧重，有所偏爱",
    "by": "逄先知《博览群书的革命家》",
    "url": "https://cn.govopendata.com/renminribao/1986/09/06/5/",
    "loc": "“酷爱读书，广收博览”末段",
    "kind": "亲历回忆原文"
  }
};
const readingDesks={
  "methods": [
    {
      "label": "留下批注",
      "excerpt": "books",
      "kicker": "藏书里保存的思考",
      "facts": [
        "1947年撤离延安时，一部分书籍被埋藏，大部分后来辗转保存。",
        "逄先知在叙述中，专门强调带有批注的书。"
      ],
      "analysis": "批注把理解、疑问与评论留在原文旁边，使学习过程可以回看，也成为后人研究思想发展的材料。"
    },
    {
      "label": "研究工具",
      "excerpt": "philosophy",
      "kicker": "哲学用于分析具体问题",
      "facts": [
        "1939年书信把哲学研读放在研究方法的层面。",
        "延安哲学批注中，讨论矛盾时会联系抗日战争的力量变化。"
      ],
      "analysis": "理论联系实际有具体对象：把概念放进战争条件中，分析力量变化的可能性与条件。"
    },
    {
      "label": "两种调查",
      "excerpt": "investigate",
      "kicker": "把历史材料与现实情况对照",
      "facts": [
        "到成都阅读地方志，了解四川历史与地方沿革。",
        "向当地人了解政治、经济、文化和人民生活。"
      ],
      "analysis": "史志与访谈回答不同的问题。把两类材料互相参照，有助于检查仅凭书面材料形成的认识。"
    },
    {
      "label": "分析材料",
      "excerpt": "material",
      "kicker": "从事实到结论的研究步骤",
      "facts": [
        "《改造我们的学习》讨论研究现状、研究历史与理论的运用。",
        "材料收集之后，还需要分析关系、比较条件。"
      ],
      "analysis": "实事求是要求用理论指导研究，在事实中寻找联系；材料罗列还需要经过分析才能支持结论。"
    }
  ],
  "theory": [
    {
      "label": "先了解情况",
      "excerpt": "conclusion",
      "kicker": "调查先于结论",
      "facts": [
        "地方志故事提供历史材料；向人调查补充现实信息。",
        "《反对本本主义》把了解情况放在作出判断之前。"
      ],
      "analysis": "实事求是的起点是客观实际。面对一个具体问题，先说明材料从哪里来、掌握到什么程度。"
    },
    {
      "label": "再分析关系",
      "excerpt": "material",
      "kicker": "占有材料后还要研究联系",
      "facts": [
        "《改造我们的学习》要求研究现状和历史。",
        "对材料作分析、比较与综合，才能提出有根据的认识。"
      ],
      "analysis": "从材料走向规律，需要说明条件和内部联系。不能把几个事例直接当作普遍结论。"
    },
    {
      "label": "用于中国问题",
      "excerpt": "philosophy",
      "kicker": "学习基本原理，研究具体条件",
      "facts": [
        "延安时期研读哲学，并在批注中联系中国革命。",
        "抗日战争中的力量对比，被放进矛盾分析的具体讨论。"
      ],
      "analysis": "这帮助理解马克思主义中国化：运用基本原理研究中国实际，在长期实践和集体探索中发展理论。"
    }
  ]
};
const slides=[
  {
    "title": "书香伴随一生",
    "section": "序 · 开卷",
    "time": "0:40",
    "cls": "cover-slide",
    "source": "图：共产党员网 / 陈晋文章配图",
    "html": "<div class=\"hero-photo\"><img src=\"assets/desk.jpg\" alt=\"1961年毛泽东在广州伏案工作，桌旁摆有《资治通鉴》\"></div><div class=\"hero-copy\"><h1>书香伴随<em>一生</em></h1><p class=\"subtitle\">从《毛泽东的读书生活》<br>理解理论学习与马克思主义中国化</p><p class=\"course\">毛泽东思想和中国特色社会主义理论体系概论 · 小组读书报告</p><button class=\"start\" data-next>翻开这本书 <span>↗</span></button></div>",
    "notes": "各位老师、同学，大家好。今天我们小组汇报的题目是“书香伴随一生”。\n毛泽东同志一生勤奋好学。青年时代，他在读书中寻求救国救民的道路；革命战争年代，他在艰苦环境中坚持研读马列著作；新中国成立后，他又围绕社会主义建设，学习经济、历史和科学等方面的知识。读书伴随着他的革命生涯，也成为他生活中长久的习惯。\n《毛泽东的读书生活》记述了这段经历。下面，我们从这本书的出版和作者讲起，介绍几段读书故事，学习其中勤学善思、联系实际的读书方法。",
    "imageNotes": []
  },
  {
    "title": "1986年，一本特别的书",
    "section": "壹 · 走近这本书",
    "time": "0:55",
    "source": "书目信息、新华网书评｜图为后出版本封面",
    "html": "<h2>1986年，一本特别的书</h2><div class=\"slide-body two-col wide\"><div><div class=\"giant\">1986<span style=\"font-size:27px;letter-spacing:0\"> 年</span></div><p class=\"lead\">毛泽东逝世十周年之际，<br>这部文集从读书生活出发，<br>呈现理论学习与革命实践的联系。</p><div class=\"meta-row\"><div><strong>14 篇</strong><span>从不同主题进入阅读生活</span></div><div><strong>邓小平</strong><span>题写书名</span></div></div></div><div class=\"book\"><img src=\"assets/cover.jpg\" alt=\"《毛泽东的读书生活》后出版本封面，非1986年初版\"></div></div>",
    "notes": "1986年，毛泽东逝世十周年之际，生活·读书·新知三联书店出版了《毛泽东的读书生活》，邓小平为这本书题写书名。\n全书收录十四篇专题文章，内容涉及马列著作、哲学、政治经济学、历史、文学、自然科学等，也记述了他阅读报刊和学习英语的经历。作者从工作中的见闻和保存下来的文献出发，写出了许多具体而生动的细节。\n翻阅这部文集，可以看到毛泽东读书的广泛兴趣，也可以看到他下在书本上的工夫：找书、借书、反复研读，遇到重要问题便作批注、找人讨论，并把读书所得用于革命和建设工作。",
    "imageNotes": []
  },
  {
    "title": "记录读书生活的三位作者",
    "section": "壹 · 走近这本书",
    "time": "0:55",
    "source": "新华网书评；逄先知《博览群书的革命家》",
    "html": "<h2>记录读书生活的三位作者</h2><div class=\"slide-body\"><div class=\"people-row\"><h3><span class=\"num\">01</span>龚育之</h3><p>理论研究与文献工作者<br>曾与毛泽东讨论哲学问题</p><div class=\"meaning\">观察哲学阅读与理论思考</div></div><div class=\"people-row\"><h3><span class=\"num\">02</span>逄先知</h3><p>1950—1966年<br>为毛泽东管理图书报刊</p><div class=\"meaning\">记录借书、藏书与读书习惯</div></div><div class=\"people-row\"><h3><span class=\"num\">03</span>石仲泉</h3><p>从事党史与文献研究<br>研究毛泽东及其思想</p><div class=\"meaning\">梳理阅读与思想发展的关系</div></div><p class=\"bottom-note\">亲历回忆与文献研究相结合，为理解毛泽东的学习与思想发展提供材料。</p></div>",
    "notes": "这部书的三位主要作者是龚育之、逄先知和石仲泉。\n龚育之从事理论研究和文献工作，曾多次同毛泽东讨论哲学问题。逄先知从1950年至1966年为毛泽东管理图书报刊，对他的藏书、借阅和日常读书习惯有直接了解。石仲泉长期从事党史和文献研究，对毛泽东的理论与实践开展了研究。\n他们各有工作经历，所写的内容也各有侧重。既有管理图书时的日常见闻，也有对读书批注和有关文献的整理。几方面材料汇集起来，使毛泽东的读书生活得到了较为丰富的呈现。",
    "imageNotes": []
  },
  {
    "title": "在救国与建设的实践中读书",
    "section": "贰 · 一生的阅读",
    "time": "1:05",
    "source": "据用户大纲及陈晋《毛泽东阅读史略》重新分期",
    "html": "<h2>在救国与建设的实践中读书</h2><blockquote class=\"text-excerpt inline-excerpt\"><p>“树信仰、求真知、促实践、达情意”</p></blockquote><div class=\"slide-body timeline\"><div class=\"era\"><div class=\"date\">1910—1921</div><h3>青年求学</h3><p>广泛接触新思潮，逐步选择马克思主义。</p><div class=\"books\">经史典籍 · 新文化报刊<br>《共产党宣言》</div></div><div class=\"era\"><div class=\"date\">1921—1935</div><h3>革命探索</h3><p>学习马列著作，探索适合中国国情的革命道路。</p><div class=\"books\">马列著作<br>中国社会与革命问题</div></div><div class=\"era\"><div class=\"date\">1935—1949</div><h3>延安及解放战争</h3><p>总结革命经验，深化理论研究，反对主观主义。</p><div class=\"books\">哲学 · 政治经济学<br>文学与历史</div></div><div class=\"era\"><div class=\"date\">1949—1976</div><h3>建设时期</h3><p>研究社会主义建设，学习经济、文史与科学知识。</p><div class=\"books\">政治经济学 · 历史<br>自然科学 · 英语</div></div></div>",
    "notes": "毛泽东在不同时期所读的书，同他当时的经历和工作有密切联系。\n青年求学时，他广泛阅读中国典籍，也接触近代新思想、新文化，在探索中逐步接受马克思主义。革命战争年代，获得马列著作很不容易，他仍尽力寻找和学习，并研究中国社会和革命道路。\n到了延安，他集中研读哲学，总结革命经验，思考中国革命中的实际问题。新中国成立后，随着工作任务转向大规模建设，政治经济学以及科学技术等方面的书籍，也进入他的阅读之中。\n从青年求学到晚年生活，读书的环境变了，学习的任务不断增加，他对知识的追求始终没有停下来。",
    "excerpts": [
      "purpose"
    ],
    "imageNotes": []
  },
  {
    "title": "博览群书中的学习重点",
    "section": "贰 · 一生的阅读",
    "time": "0:50",
    "source": "原书篇章主题，据大纲与新华网书评整理",
    "html": "<h2>博览群书中的学习重点</h2><div class=\"slide-body library\"><div class=\"shelf\"><span>01</span><h3>马列著作</h3><p>掌握改造社会的理论武器<br><span style=\"font:22px var(--sans);color:var(--muted)\">《毛泽东读马列著作》</span></p></div><div class=\"shelf\"><span>02</span><h3>哲学</h3><p>研究认识世界与改造世界的方法<br><span style=\"font:22px var(--sans);color:var(--muted)\">《对几本哲学书籍的批注》</span></p></div><div class=\"shelf\"><span>03</span><h3>政治经济学</h3><p>探索社会主义建设的规律<br><span style=\"font:22px var(--sans);color:var(--muted)\">读苏联教科书的谈话</span></p></div><div class=\"shelf\"><span>04</span><h3>历史与文学</h3><p>了解中国历史与社会生活<br><span style=\"font:22px var(--sans);color:var(--muted)\">鲁迅 ·《红楼梦》· 中国古籍</span></p></div><div class=\"shelf\"><span>05</span><h3>科学与逻辑</h3><p>拓宽知识与分析能力<br><span style=\"font:22px var(--sans);color:var(--muted)\">自然科学 · 逻辑学</span></p></div><div class=\"shelf\"><span>06</span><h3>报刊与英语</h3><p>了解现实，持续学习<br><span style=\"font:22px var(--sans);color:var(--muted)\">报章杂志 · 英语学习</span></p></div></div><p class=\"bottom-note\">以马列著作为理论基础，广泛学习文史与科学知识，服务革命和建设的需要。</p>",
    "notes": "毛泽东的读书范围很广，哲学、经济、政治、军事、历史、文学、地理和自然科学，都有所涉猎。其中，马列著作、哲学和中国文史，是他用功较多的领域。\n读马列著作，是为了学习基本理论，研究革命和建设问题；读哲学，重在认识和分析问题的方法；读历史，留意历代政治、军事、经济以及社会治乱的经验；文学作品中的社会生活和语言表达，也使他保持着浓厚兴趣。\n在本书的记述中，还能看到他读科学技术书籍、看报刊和学习英语的经历。知识面不断拓宽，遇到新的工作和新的问题，也就继续找书学习。",
    "imageNotes": []
  },
  {
    "title": "理论学习与实践探索的重要节点",
    "section": "贰 · 一生的阅读",
    "time": "0:50",
    "source": "陈晋《毛泽东阅读史略》《从毛泽东同志的读书生活谈起》及原书回忆",
    "html": "<h2>理论学习与实践探索的重要节点</h2><div class=\"slide-body events\"><div class=\"event\"><strong>1920</strong><h3>阅读《共产党宣言》</h3><p>在寻求救国道路中学习马克思主义。</p></div><div class=\"event\"><strong>1937 前后</strong><h3>研读、批注哲学书</h3><p>为分析中国革命问题深化哲学研究。</p></div><div class=\"event\"><strong>1947</strong><h3>撤离延安，保存藏书</h3><p>留下批注的书得到特别保护。</p></div><div class=\"event\"><strong>1952</strong><h3>购得《二十四史》</h3><p>持续阅读中国历史。</p></div><div class=\"event\"><strong>1958</strong><h3>成都阅读地方志</h3><p>结合当地历史与现实情况。</p></div><div class=\"event\"><strong>1959—1960</strong><h3>研读政治经济学教科书</h3><p>结合中国实际思考社会主义建设。</p></div></div>",
    "notes": "这张时间线列出几件代表性的阅读往事。1920年，毛泽东阅读《共产党宣言》，开始深入学习马克思主义。延安时期，他集中研读哲学，在书页上写下大量批注。\n1947年撤离延安时，一批珍贵藏书得到保存。1952年，工作人员为他购得一套清乾隆武英殿版《二十四史》，此后成为他经常阅读的史书。1958年到成都，他借阅四川地方志和有关都江堰的资料。1959年至1960年间，他又组织研读苏联政治经济学教科书。\n这些阅读经历，分布在革命和建设的不同时期。下面，我们从战火中的藏书讲起。",
    "imageNotes": []
  },
  {
    "title": "战火中保存的珍贵藏书",
    "section": "叁 · 书页中的故事",
    "time": "1:10",
    "source": "对应篇章：《博览群书的革命家》｜图：1938年延安工作照，非1947年撤离现场",
    "html": "<h2>战火中保存的珍贵藏书</h2><div class=\"slide-body two-col\"><figure class=\"photo \"><div class=\"frame\"><img src=\"assets/yanan.jpg\" alt=\"1938年毛泽东在延安窑洞撰写《论持久战》\"></div><figcaption>1938年，延安工作照。</figcaption></figure><div class=\"story-copy\"><div class=\"story-number\">1947</div><blockquote class=\"text-excerpt \"><p>“特别是他加了批注的那些”</p></blockquote><p>1947年撤离延安，部分书籍就地埋藏，<br>大部分后来辗转运到北京。</p></div></div>",
    "notes": "到陕北以后，毛泽东通过多种渠道寻找书报。到了延安，书渐渐多起来，由专人管理。起初，书放在住处附近的平房里，后来为躲避日机轰炸，又移到较深的窑洞中保存。\n1947年撤离延安时，许多物品被留下，藏书则尽力保护。一部分在当地埋藏，大部分经过长途辗转，后来运到北京。逄先知在回忆中，特别提到了那些留下批注的书。\n这些批注有对原文的理解，有读到某处产生的疑问，也有联系革命实际写下的意见。经过战火保存下来的书籍，因而成为研究毛泽东思想的珍贵材料。今天读到这些书页，仍能看到他当年认真研读、勤于思考的痕迹。",
    "excerpts": [
      "books"
    ],
    "imageNotes": [
      "1938年，延安窑洞工作照。新华网刊载 / TAKEFOTO供图"
    ]
  },
  {
    "title": "写满批注的哲学书",
    "section": "叁 · 书页中的故事",
    "time": "1:30",
    "source": "引文：陈晋文章援引1939年书信｜批注案例：新华网书评｜点击文献图可放大",
    "html": "<h2>写满批注的哲学书</h2><div class=\"slide-body two-col wide\"><div class=\"story-copy\"><blockquote class=\"text-excerpt \"><p>“我的工具不够，今年还只能作工具的研究”</p></blockquote><div class=\"close-reading\"><span>边读哲学，边研究抗战问题</span><p>读到矛盾的论述时，毛泽东在批注中谈到：<br>扩大并巩固抗日民族统一战线，争取国际支持，<br>可以改变中日双方的力量对比。</p></div></div><figure class=\"photo annotation\"><div class=\"frame\"><img src=\"assets/reading.jpg\" alt=\"毛泽东对哲学书与《新唐书》的真实批注图片\"></div><figcaption>哲学书批注（左）与史书批注（右）。</figcaption></figure></div>",
    "notes": "毛泽东很重视哲学学习。延安时期，他阅读了《辩证法唯物论教程》《社会学大纲》《哲学选辑》等著作，在页边和行间留下许多批注。1939年给何干之的信，也谈到当时加强哲学研究的打算。\n读到有关矛盾的论述时，他联系抗日战争写下自己的意见：如果抗日民族统一战线能够扩大、巩固，再加上有利的国际条件，中国就有可能逐步形成有利的力量对比。\n他在哲学书的批注中研究战争问题，把理论学习同当时的抗战实际联系起来。后来，在《论持久战》中，这些有关战争条件和力量变化的认识又得到进一步阐述。",
    "excerpts": [
      "philosophy"
    ],
    "imageNotes": [
      "左：《辩证法唯物论教程》批注；右：《新唐书》批注。"
    ]
  },
  {
    "title": "窑洞里的《鲁迅全集》",
    "section": "叁 · 书页中的故事",
    "time": "1:05",
    "source": "对应篇章：《读鲁迅著作》｜据新华网书评；肖像：中国作家网，1930年鲁迅照片",
    "html": "<h2>窑洞里的《鲁迅全集》</h2><div class=\"slide-body two-col\"><div class=\"portrait\"><figure class=\"photo \"><div class=\"frame\"><img src=\"assets/luxun.jpg\" alt=\"鲁迅1930年肖像\"></div><figcaption>鲁迅，1930年。</figcaption></figure><div class=\"volume\">鲁迅全集</div></div><div class=\"story-copy\"><div class=\"story-number\">58<span style=\"font-size:22px;margin-left:15px\">号纪念本</span></div><blockquote class=\"text-excerpt \"><p>“都要一一改正过来”</p></blockquote><p>书评记述：他会订正《鲁迅全集》中的<br>文字颠倒、错字与漏字。</p><p class=\"detail\">读到字句层面：关注文章怎样表达，也检查文字本身是否准确。</p></div></div>",
    "notes": "在中国现代作家中，毛泽东十分喜欢鲁迅的作品。1938年，二十卷本《鲁迅全集》出版，一套编号58的纪念本经过地下组织辗转送到延安。毛泽东收到以后，把它放在办公桌旁，经常阅读。\n他读得很细，发现排印中的文字颠倒、错字和漏字，也一一订正。鲁迅作品对社会问题的揭示、鲜明的思想性和战斗性，受到他的重视；鲁迅文章生动、通俗而有力量的语言，也使他十分欣赏。\n延安窑洞中的这套《鲁迅全集》，伴随着他的工作和生活。读文学、读历史、读理论，在毛泽东的阅读中各有位置，也都下过认真钻研的工夫。",
    "excerpts": [
      "luxun"
    ],
    "imageNotes": [
      "鲁迅肖像，1930年。中国作家网刊载。"
    ]
  },
  {
    "title": "反复阅读《红楼梦》",
    "section": "叁 · 书页中的故事",
    "time": "1:10",
    "cls": "novel-slide",
    "source": "阅读经历与引文：陈晋文章；阅读视角：新华网书评｜图：孙温绘本，三联生活周刊刊载",
    "html": "<h2>反复阅读《红楼梦》</h2><div class=\"slide-body two-col wide\"><figure class=\"photo\"><div class=\"frame\"><img src=\"assets/red-chamber.jpg\" alt=\"清代孙温绘《红楼梦》中的家族生活场景\"></div><figcaption>孙温《红楼梦》绘本。</figcaption></figure><div class=\"novel-copy\"><span class=\"tag\">反复读 · 联系历史读</span><p class=\"novel-fact\">20世纪50年代，他曾说自己已读过五遍；<br>此后又多次向工作人员要这部书。</p><blockquote class=\"text-excerpt\"><p>“很细致的、很精细的社会历史”</p></blockquote><p class=\"novel-reading\">他关注贾、史、王、薛四大家族的衰败，<br>借此了解封建统治阶级的衰败。</p></div></div>",
    "notes": "《红楼梦》是毛泽东反复阅读的一部古典小说。陈晋文章记载，20世纪50年代，他曾说自己已经读过五遍，此后又多次向工作人员要这部书。\n毛泽东阅读《红楼梦》，特别注意书中丰富的社会生活。他把贾、史、王、薛四大家族的衰败，同封建统治阶级的衰败联系起来，看重小说记述社会历史的价值。\n人物怎样生活，家族怎样维系，又怎样走向衰落，小说都写得十分细致。毛泽东熟悉中国历史，也喜欢古典文学，阅读时常把文史联系起来。同一部书多次研读，也伴随着他在不同时期的工作和思考。",
    "excerpts": [
      "novel"
    ],
    "imageNotes": [
      "清代孙温《红楼梦》绘本，文学主题配图。"
    ]
  },
  {
    "title": "阅读地方志与坚持调查研究",
    "section": "叁 · 书页中的故事",
    "time": "1:10",
    "source": "原书相关篇章、逄先知回忆｜课程联系：《反对本本主义》",
    "html": "<h2>阅读地方志与坚持调查研究</h2><p class=\"lead\">1958年成都的阅读经历，体现了研究历史与了解现实相结合的学习习惯。</p><div class=\"slide-body columns\"><div><div class=\"lined-block\"><span class=\"tag\">向书本了解历史</span><h3>《四川省志》<br>《蜀本纪》《华阳国志》</h3><p>了解地理沿革、文物掌故与地方文化。</p></div><div class=\"lined-block\"><h3>都江堰相关志书</h3><p>阅读《都江堰水利述要》《灌县志》等资料。</p></div></div><div style=\"position:relative\"><blockquote class=\"text-excerpt \"><p>“一是向人做调查” / “一是向书本做调查”</p></blockquote><div class=\"close-reading\"><span>两种材料各有用途</span><p>地方志：历史、地理沿革、风土人情。<br>向人调查：当地经济与人民生活。<br>比较历史记载与现实情况，再形成判断。</p></div></div></div>",
    "notes": "毛泽东到一个地方，常常既向当地人了解情况，也借阅有关这个地方的书籍。\n1958年3月，他到成都主持会议，先后要来《四川省志》《蜀本纪》《华阳国志》，以及《都江堰水利述要》《灌县志》等资料阅读，还在书上作了批画。会议期间，他挑选有关四川的古典诗词，同相关史料一起印发给与会人员。\n地方志记述了历史沿革、地理和风俗；向当地人调查，则能了解现实中的政治、经济、文化和人民生活。读书和调查相结合，使学习同当地的实际情况联系起来。逄先知的这段回忆，具体记下了毛泽东读书与工作相结合的习惯。",
    "excerpts": [
      "investigate"
    ],
    "imageNotes": []
  },
  {
    "title": "从原文看读书与思考的方法",
    "section": "肆 · 从读书到思想",
    "time": "1:00",
    "source": "摘抄均附作者、篇名及段落位置｜原文摘录、事实转述与本组分析分别标识",
    "html": "<h2>从原文看读书与思考的方法</h2><div class=\"slide-body\" data-reading-desk=\"methods\"></div>",
    "notes": "毛泽东读书，重视动笔，也重视研究和讨论。\n读到重要的地方，他常常圈画、作批注，把自己的理解和意见写在书旁。延安时期留下批注的哲学书，后来成为研究他哲学思想的重要材料。\n对需要深入了解的问题，他会继续找书，也会向人请教。到地方阅读史志，同时了解当地生活，就是读书与调查相结合的例子。\n在《改造我们的学习》中，毛泽东要求研究现实情况，研究中国历史，并重视马克思列宁主义的运用。材料要认真收集，问题要深入研究，所学要用于实际工作。这些要求，也贯穿在他的读书生活之中。",
    "cls": "interactive-slide",
    "excerpts": [
      "books",
      "philosophy",
      "investigate",
      "material"
    ],
    "imageNotes": []
  },
  {
    "title": "从调查材料到实事求是的判断",
    "section": "肆 · 从读书到思想",
    "time": "1:20",
    "source": "理论参照：《反对本本主义》《改造我们的学习》｜联系原书中的哲学批注与地方志故事",
    "html": "<h2>从调查材料到实事求是的判断</h2><div class=\"slide-body\" data-reading-desk=\"theory\"></div>",
    "notes": "重视调查研究，是毛泽东学习和工作中的一贯要求。1930年，他在《反对本本主义》中，强调调查对于了解情况、解决问题的重要作用，反对脱离实际、照搬书本。\n1941年的《改造我们的学习》，又要求把理论学习同研究中国的现状和历史结合起来，认真掌握材料，开展分析，找出事物的联系。\n在读书生活中，他研读哲学，联系中国革命；阅读地方志，同时了解当地情况。书本上的学习，同实际中的研究相互结合。\n中国革命和建设提出了许多新的课题。以毛泽东同志为主要代表的中国共产党人，在学习马克思主义、总结实践经验的过程中，探索符合中国实际的道路，推进了马克思主义中国化。",
    "cls": "interactive-slide",
    "excerpts": [
      "conclusion",
      "material",
      "philosophy"
    ],
    "imageNotes": []
  },
  {
    "title": "阅读的广度与知识结构的局限",
    "section": "伍 · 合上书之后",
    "time": "1:05",
    "source": "逄先知《博览群书的革命家》“酷爱读书，广收博览”｜历史分析不由阅读偏好单独推导",
    "html": "<h2>阅读的广度与知识结构的局限</h2><div class=\"slide-body two-col wide\"><div><blockquote class=\"text-excerpt \"><p>“有所侧重，有所偏爱”</p></blockquote><p class=\"lead\">逄先知在介绍广泛阅读之后，<br>又专门交代了阅读分布的不均衡。</p></div><div><div class=\"lined-block\"><h3>重点投入</h3><p>马列著作、哲学、中国历史与古代文学。</p></div><div class=\"lined-block\"><h3>相对少读</h3><p>外国文学、部分中国现代文学，<br>尤其是经济管理方面的书。</p></div><p class=\"bottom-note\">本组理解：评价知识结构，要同时看广度和侧重；解释历史决策还需更多史料。</p></div></div>",
    "notes": "逄先知在文章中写到，毛泽东广泛阅读，同时也有自己的重点和偏爱。马列著作、哲学、中国历史和古代文学，是他最重视、最喜欢阅读的方面。\n文章也如实指出，他对外国文学、中国现代文学以及经济管理方面的书，读得相对少。这使他的知识结构存在一定的局限。介绍这些情况，使我们对他的阅读生活有更完整的了解。\n毛泽东的读书经历，有勤奋求知的日常，有深入研读的工夫，也有个人的兴趣与侧重。把这些内容放在一起，书中所记录的读书生活便更加具体。读这部文集，也应认真了解它所记述的各个方面。",
    "excerpts": [
      "limits"
    ],
    "imageNotes": []
  },
  {
    "title": "读有字之书，又读无字之书",
    "section": "伍 · 合上书之后",
    "time": "0:55",
    "cls": "end-slide",
    "source": "以原书篇名收束｜本页学习建议为小组整理",
    "html": "<div class=\"slide-body\"><h2 class=\"end-title\">读<em>有字</em>之书，<br>又读<em>无字</em>之书。</h2><div class=\"end-steps\"><p>读一组材料<br><span style=\"font-size:22px\">带着实际问题学习原文</span></p><p>做一次调查<br><span style=\"font-size:22px\">记录不同人的经历与意见</span></p><p>写一份分析<br><span style=\"font-size:22px\">用事实说明结论与适用条件</span></p></div><p class=\"thanks\">感谢聆听 · 欢迎交流</p></div>",
    "notes": "毛泽东的读书生活，同中国革命和建设的实践紧密相连。他长期坚持学习，广泛阅读，认真思考，也重视调查研究和知识的运用。\n今天，青年学生的学习条件有了很大改善。理论著作、历史文献和专业资料，更容易查找和阅读。把书读懂、把问题弄清楚，仍然需要下扎实的工夫。学习理论，也要关心现实，了解国情和人民生活，在专业学习与社会实践中增长知识、提高本领。\n我们以原书的篇名“读有字之书，又读无字之书”结束这次报告。感谢老师和同学们的聆听。",
    "imageNotes": []
  },
  {
    "title": "参考资料与图片来源",
    "section": "附 · 资料索引",
    "time": "按需查阅",
    "source": "原书页码依实际使用版本补充｜资料面板保留图片、照片年代及版本说明",
    "html": "<h2>参考资料与图片来源</h2><div class=\"slide-body bibliography\"><div class=\"ref\"><small>01 / 主要阅读</small><h3><a href=\"https://books.google.com/books?id=8lJNAAAAMAAJ\" target=\"_blank\" rel=\"noopener\">《毛泽东的读书生活》 ↗</a></h3><p>龚育之、逄先知、石仲泉等｜生活·读书·新知三联书店，1986年初版</p></div><div class=\"ref\"><small>02 / 亲历回忆</small><h3><a href=\"https://cn.govopendata.com/renminribao/1986/09/06/5/\" target=\"_blank\" rel=\"noopener\">《博览群书的革命家》 ↗</a></h3><p>逄先知｜《人民日报》1986年9月6日，第5版（公开转录）</p></div><div class=\"ref\"><small>03 / 理论原文</small><h3><a href=\"https://www.12371.cn/2012/08/10/ARTI1344592797863461.shtml\" target=\"_blank\" rel=\"noopener\">《反对本本主义》 ↗</a></h3><p>毛泽东，1930年｜共产党员网原文</p></div><div class=\"ref\"><small>04 / 理论原文</small><h3><a href=\"https://www.12371.cn/2012/11/19/ARTI1353322284898760.shtml\" target=\"_blank\" rel=\"noopener\">《改造我们的学习》 ↗</a></h3><p>毛泽东，1941年｜共产党员网原文</p></div><div class=\"ref\"><small>05 / 理论参照</small><h3><a href=\"https://djyj.12371.cn/2021/12/07/ARTI1638840709196964.shtml\" target=\"_blank\" rel=\"noopener\">《关于党的百年奋斗重大成就和历史经验的决议》 ↗</a></h3><p>2021年｜共产党员网刊载</p></div><div class=\"ref\"><small>06 / 完整资料</small><h3><button data-sources style=\"padding:0;font:inherit\">辅助文章与图片来源 ↗</button></h3><p>陈晋相关文章、新华网书评及图片出处<br>均可在资料面板中查阅。</p></div></div>",
    "notes": "以上是本次报告使用的主要资料。《毛泽东的读书生活》是报告的主要阅读对象，逄先知的回忆和陈晋等人的相关文章用于补充有关读书经历。《反对本本主义》《改造我们的学习》等著作，用于联系理论学习与调查研究的内容。谢谢大家。",
    "imageNotes": []
  },
  {
    "title": "小组成员与分工",
    "section": "附 · 成员分工",
    "time": "按需展示",
    "cls": "team-slide",
    "source": "小组成员名单由用户提供；分工按本次展示内容安排。",
    "html": "<h2>小组成员与分工</h2><div class=\"slide-body team-body\"><div class=\"team-leader\"><h3>石澄錡 <span>队长</span></h3></div><div class=\"team-grid\"><div class=\"team-member\"><h3>吴东昊</h3><p>书籍与作者背景整理</p></div><div class=\"team-member\"><h3>张乘博</h3><p>阅读经历与时间线梳理</p></div><div class=\"team-member\"><h3>蒋月文</h3><p>战火藏书故事整理</p></div><div class=\"team-member\"><h3>王闯</h3><p>哲学阅读与批注材料整理</p></div><div class=\"team-member\"><h3>国家宝</h3><p>鲁迅阅读案例整理</p></div><div class=\"team-member\"><h3>李雪雅</h3><p>《红楼梦》阅读案例整理</p></div><div class=\"team-member\"><h3>谭丽丽</h3><p>地方志与调查研究材料整理</p></div><div class=\"team-member\"><h3>王家睿</h3><p>资料出处核对与文字校对</p></div><div class=\"team-member\"><h3>盛明伟</h3><p>展示排练与现场翻页</p></div></div></div>",
    "notes": "我们小组共有十位成员。石澄錡担任队长。\n吴东昊：书籍与作者背景整理。\n张乘博：阅读经历与时间线梳理。\n蒋月文：战火藏书故事整理。\n王闯：哲学阅读与批注材料整理。\n国家宝：鲁迅阅读案例整理。\n李雪雅：《红楼梦》阅读案例整理。\n谭丽丽：地方志与调查研究材料整理。\n王家睿：资料出处核对与文字校对。\n盛明伟：展示排练与现场翻页。",
    "imageNotes": []
  }
];
