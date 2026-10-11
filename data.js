const siteData = {
  profile: {
    name: "Chengqi Shi",
    initials: "CS",
    avatarImage: "./asserts/avatar.jpg",
    title: "Undergraduate Student",
    affiliation: "Xi'an Jiaotong University",
    email: "cqshi@stu.xjtu.edu.cn",
    scholarUrl: "https://scholar.google.com/citations?user=kj8WqooAAAAJ&hl=zh-CN",
    githubUrl: "https://github.com/lnscq",
    cvUrl: "./asserts/CV.pdf",
    contacts: [
      {
        icon: "fa-building-columns",
        text: "Department of Computer Science, Xi'an Jiaotong University",
      },
      {
        icon: "fa-location-dot",
        text: "Xi'an / Shanghai, China",
      },
      {
        icon: "fa-envelope",
        text: "cqshi@stu.xjtu.edu.cn",
        href: "mailto:cqshi@stu.xjtu.edu.cn",
      },
    ],
  },
  about: {
    title: "About Me",
    paragraphs: [
      "Hi! I'm an undergraduate student in Computer Science and Technology at <strong>Xi'an Jiaotong University (XJTU)</strong>, where I am part of the <strong>Young Gifted Class</strong>. My research interests lie in <strong>embodied intelligence and humanoid robotics</strong>, particularly Vision-Language-Action (VLA) models, world models, and reinforcement learning.",
      "This fall, I have been working as a research intern at <a href=\"https://scalelab-sjtu.github.io/index.html\" target=\"_blank\" rel=\"noreferrer\"><strong>Shanghai Jiao Tong University's ScaleLab</strong></a>, advised by <a href=\"https://yaomarkmu.github.io/\" target=\"_blank\" rel=\"noreferrer\"><strong>Prof. Yao Mu</strong></a>, on humanoid whole-body mobile manipulation and world models. I am also an Embodied Intelligence Algorithm Intern at <a href=\"https://www.limxdynamics.com/\" target=\"_blank\" rel=\"noreferrer\"><strong>LimX Dynamics</strong></a>. Previously, I explored reinforcement learning and its applications to adapting generative models at XJTU's Institute of Artificial Intelligence and Robotics (IAIR).",
      "Outside of research, I enjoy rock climbing, playing frisbee, and playing the guitar. I also enjoy connecting with fellow robotics enthusiasts and currently lead the <strong>vision group of XJTU's RoboCup robotics team</strong>.",
      "My long-term goal is to build <strong>general-purpose embodied agents</strong> that understand the physical world, coordinate perception and action, and continually learn through interaction, enabling robots to perform complex tasks in real-world environments. I'd love to connect with people who share these interests, so feel free to reach out to chat about robotics, research, and life!"
    ],
    notice:
      "I am currently seeking Fall 2029 Ph.D. opportunities. If my research interests align with yours, please feel free to contact me."
  },
  researchInterests: [
    "Humanoid Robotics",
    "World Models",
    "Video Generation Models",
    "Reinforcement Learning",
    "Representation Learning",
  ],
  news: [
    {
      date: "2026/09",
      text: "Our <a href=\"https://arxiv.org/abs/2609.17210\" target=\"_blank\" rel=\"noreferrer\">FluxVLA Engine</a> technical report is out!",
    },
    {
      date: "2026/08",
      text: "Our team won National First Prize in the RoboCup Special Competition.",
    },
    {
      date: "2026/07",
      text: "Started a research internship at Shanghai Jiao Tong University.",
    },
    {
      date: "2026/04",
      text: "Updated my academic homepage and released a new project page.",
    },
  ],
  workExperience: [
    {
      institution: "LimX Dynamics",
      role: "Embodied Intelligence Algorithm Intern",
      period: "August 2026 - Present",
      logo: "./asserts/limx-dynamics.png",
      logoAlt: "LimX Dynamics logo",
      url: "https://www.limxdynamics.com/",
    },
    {
      institution: "Shanghai Jiao Tong University",
      role: "ScaleLab Research Intern",
      period: "February 2026 - Present",
      logo: "./asserts/sjtu.png",
      logoAlt: "Shanghai Jiao Tong University logo",
      url: "https://scalelab-sjtu.github.io/index.html",
    },
  ],
  education: [
    {
      institution: "Xi'an Jiaotong University",
      role: "School of Computer Science and Technology",
      period: "September 2025 - Present",
      logo: "./asserts/xjtu.png",
      logoAlt: "Xi'an Jiaotong University logo",
      url: "http://www.cs.xjtu.edu.cn/",
    },
    {
      institution: "Xi'an Jiaotong University",
      role: "Young Gifted Class",
      period: "September 2023 - July 2025",
      logo: "./asserts/xjtu.png",
      logoAlt: "Xi'an Jiaotong University logo",
      url: "https://bjb.xjtu.edu.cn/info/1071/1237.htm",
    },
  ],
  publications: [
    {
      title: "FluxVLA Engine: A One-Stop VLA Engineering Platform for Embodied Intelligence",
      pageUrl: "https://arxiv.org/abs/2609.17210",
      image: "./assets/fluxvla-system-overview.png",
      imageAlt: "FluxVLA platform overview: data processing, policy training, simulation evaluation, and robot deployment",
      venue: "arXiv preprint, 2026.09",
      authors: [
        { name: "Yinhao Li" },
        { name: "Weixin Mao" },
        { name: "Zihan Lan" },
        { name: "Jikun Rong" },
        { name: "Qirui Hu" },
        { name: "Yiming Zhang" },
        { name: "Weipeng Deng" },
        { name: "Bowen Shen" },
        { name: "Minzhao Zhu" },
        { name: "Yiming Mao" },
        { name: "Yan Yang" },
        { name: "Chenguang Cui" },
        { name: "Hongyuan Chen" },
        { name: "Xu Huang" },
        { name: "Zheyi Zhao" },
        { name: "Pinxi Shen" },
        { name: "Bozhen He" },
        { name: "Zhen Fu" },
        { name: "Yifan Wang" },
        { name: "Zexin Zhang" },
        { name: "Ang Gao" },
        { name: "Haoyu Chen" },
        { name: "Chengqi Shi", highlight: true },
        { name: "Hua Chen" },
      ],
      summary:
        "An open, configuration-driven platform unifying embodied-policy training, simulation evaluation, human-in-the-loop correction, and real-robot deployment in a reproducible data-to-deployment workflow.",
      paperUrl: "https://arxiv.org/pdf/2609.17210",
      projectUrl: "https://fluxvla.limxdynamics.com/",
      codeUrl: "https://github.com/FluxVLA/FluxVLA",
      bibtex: `@article{li2026fluxvla,
  title={{FluxVLA Engine}: A One-Stop {VLA} Engineering Platform for Embodied Intelligence},
  author={Li, Yinhao and Mao, Weixin and Lan, Zihan and Rong, Jikun and Hu, Qirui and Zhang, Yiming and Deng, Weipeng and Shen, Bowen and Zhu, Minzhao and Mao, Yiming and Yang, Yan and Cui, Chenguang and Chen, Hongyuan and Huang, Xu and Zhao, Zheyi and Shen, Pinxi and He, Bozhen and Fu, Zhen and Wang, Yifan and Zhang, Zexin and Gao, Ang and Chen, Haoyu and Shi, Chengqi and Chen, Hua},
  journal={arXiv preprint arXiv:2609.17210},
  year={2026},
  doi={10.48550/arXiv.2609.17210},
  url={https://arxiv.org/abs/2609.17210}
}`,
    },
    /* Temporarily hidden publication placeholders.
    {
      title: "Test Time Fine-Tuning for Flow Matching Model via Online-RL",
      pageUrl: "#",
      venue: "Under Review, 2025.11",
      authors: [
        { name: "Chengqi Shi", highlight: true },
        { name: "Longjun Liu", corresponding: true },
      ],
      summary:
        "Online reinforcement learning for test-time fine-tuning of flow matching models.",
    },
    {
      title: "Another Representative Research Project",
      pageUrl: "#",
      venue: "NeurIPS / ICML / ICLR 2025",
      authors: "Collaborator A*, Your Name*, Collaborator C",
      summary:
        "Replace this with a concise abstract-style summary that highlights what changed over prior work.",
      paperUrl: "#",
      projectUrl: "#",
      datasetUrl: "#",
      bibtex: `@article{your2025project,
  title={Another Representative Research Project},
  author={Collaborator A and Your Name and Collaborator C},
  journal={arXiv preprint arXiv:xxxx.xxxxx},
  year={2025}
}`,
    },
    {
      title: "Earlier Work With Strong Practical Impact",
      pageUrl: "#",
      venue: "Robotics and Learning, 2024",
      authors: "Your Name, Collaborator D, Collaborator E",
      summary:
        "Keep each entry compact. If you have many papers, show selected papers here and move the full list to a CV.",
      paperUrl: "#",
      slidesUrl: "#",
      codeUrl: "#",
    },
    */
  ],
  honors: [
    {
      date: "2026/08",
      competition: "RoboCup Special Competition — 3D Object Recognition",
      award: "National First Prize",
      role: "Team Captain",
    },
    {
      date: "2026/05",
      competition: "Mathematical Contest in Modeling (MCM)",
      award: "Honorable Mention",
    },
    {
      date: "2025/11",
      competition: "China Undergraduate Physics Experiment Competition (CUPET)",
      award: "National First Prize",
    },
    {
      date: "2025/05",
      competition: "Lanqiao Cup",
      award: "Provincial Third Prize",
    },
  ],
};
