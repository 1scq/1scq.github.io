const siteData = {
  profile: {
    name: "Chengqi Shi",
    initials: "CS",
    avatarImage: "./asserts/avatar.jpg",
    title: "Undergraduate Student",
    affiliation: "Xi'an Jiaotong University",
    email: "cqshi@stu.xjtu.edu.cn",
    scholarUrl: "#",
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
      "Chengqi Shi is an undergraduate student in computer science at <a href=\"#\">Xi'an Jiaotong University</a>. His research interests span <strong>AIGC</strong>, <strong>multimodal large models</strong>, and <strong>embodied intelligence</strong>.",
      "Before joining the School of Computer Science at Xi'an Jiaotong University, he worked as a research assistant at the Institute of Artificial Intelligence and Robotics, Xi'an Jiaotong University, where he studied test-time fine-tuning of flow matching models with online reinforcement learning. He graduated from the Young Gifted Class of the Qian Xuesen Honors Program at Xi'an Jiaotong University with honors.",
      "His research has received multiple recognitions, and he has co-authored work reviewed by leading venues such as CVPR and ECCV. He has also been invited to serve as a reviewer for CVPR. He is currently a research assistant at the School of Computer Science, Shanghai Jiao Tong University, advised by <a href=\"https://yaomarkmu.github.io/\" target=\"_blank\" rel=\"noreferrer\"><strong>Prof. Mu Yao<strong></a>, where he works on applying online reinforcement learning to post-training for vision-language-action (VLA) models.",
    ],
    notice:
      "Feel free to contact me～",
  },
  news: [
    {
      date: "2026/04",
      text: "Updated my academic homepage and released a new project page.",
    },
    {
      date: "2026/02",
      text: "One paper rejected to <strong>CVPR 2026</strong>.",
    },
    {
      date: "2025/12",
      text: "Started a new research internship on multimodal embodied AI.",
    },
  ],
  publications: [
    {
      title: "Project Title Goes Here",
      pageUrl: "#",
      image: "./images/pub-vision.svg",
      imageAlt: "Project Title Goes Here thumbnail",
      venue: "Conference / Journal 2026",
      authors: "Your Name, Collaborator A, Collaborator B, Advisor Name",
      summary:
        "A one-sentence summary of the problem, the method, and the main contribution.",
      paperUrl: "#",
      projectUrl: "#",
      codeUrl: "#",
      bibtex: `@inproceedings{your2026paper,
  title={Project Title Goes Here},
  author={Your Name and Collaborator A and Collaborator B},
  booktitle={Conference Name},
  year={2026}
}`,
    },
    {
      title: "Another Representative Research Project",
      pageUrl: "#",
      image: "./images/pub-robotics.svg",
      imageAlt: "Another Representative Research Project thumbnail",
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
      image: "./images/pub-learning.svg",
      imageAlt: "Earlier Work With Strong Practical Impact thumbnail",
      venue: "RA-L / ICRA / ECCV 2024",
      authors: "Your Name, Collaborator D, Collaborator E",
      summary:
        "Keep each entry compact. If you have many papers, show selected papers here and move the full list to a CV.",
      paperUrl: "#",
      slidesUrl: "#",
      codeUrl: "#",
    },
  ],
  honors: [
    "RoboCup Vision Challenge, Team Captain (3D Object Recognition), February 2026",
    "China Undergraduate Physics Experiment Competition, National First Prize, November 2025",
    "Lanqiao Cup National Software Competition, Third Prize (C/C++ Group), April 2025",
  ],
};
