export const languages = { zh: "中文", en: "English" } as const;

export const locales = ["zh", "en"] as const;
export const defaultLang = "zh" as const;

/** hreflang / sitemap 用的 BCP 47 代码（页面 <html lang> 也保持一致） */
export const hreflang: Record<(typeof locales)[number], string> = {
  zh: "zh-CN",
  en: "en",
};

export type Lang = (typeof locales)[number];

const zh = {
  homeTitle: "AI 辅助产品实践",
  homeMeta:
    "warm 的个人作品集，记录如何从具体需求出发，借助 AI 构建可运行的网页工具与产品。",
  aboutMeta:
    "关于 warm：从真实需求出发，借助 AI 辅助开发并构建可运行网页工具。",
  projectsMeta:
    "作品集 · 共 {count} 个项目：{names}。用 Astro、React 与 TypeScript 构建，持续更新。",
  projectMetaSuffix: "项目详情：背景、我做了什么与结果。",
  navHome: "首页",
  navProjects: "作品",
  navAbout: "关于",
  navLabel: "主导航",

  ctaViewWork: "查看作品",
  ctaContact: "联系我",
  processNeed: "发现具体需求",
  processBuild: "AI 辅助实现",
  processTry: "交付可运行作品",
  aboutHomeBlurb: "我关注工具是否真正减少使用中的麻烦，也会把关键取舍和可体验的结果放进项目记录。",

  browseTitle: "按分类浏览",
  browseAll: "全部作品",

  catWeb: "网页应用",
  catWebBlurb: "网站与 Web 应用",
  catGame: "小游戏",
  catGameBlurb: "可玩的小游戏与交互演示",
  catTool: "工具",
  catToolBlurb: "自用的在线小工具",

  featuredTitle: "精选作品",
  viewAll: "全部",

  projectsTitle: "作品",
  statProjects: "作品",
  statYears: "年经验",
  statSkills: "技能",
  projectsCount: "共 {count} 个项目",
  filterAll: "全部",
  categoryNav: "作品分类",
  emptyProjects: "这个分类下还没有作品。",

  backToProjects: "返回作品",
  tryIt: "在线体验",
  loadDemo: "加载在线体验",
  openInNewTab: "在新标签打开",
  tryItNote: "这是个独立的小应用，数据只保存在你自己的浏览器里，不会上传。",
  linkGithub: "GitHub",
  linkDemo: "在线 Demo",
  projectNav: "项目导航",

  aboutTitle: "关于我",
  aboutSkills: "技能",
  aboutExperience: "经历",
  aboutMore: "了解更多",

  contactTitle: "联系我",
  contactBlurb: "有合作或想法，欢迎直接找我。",

  notFoundTitle: "页面走丢了",
  notFoundBlurb: "你要找的页面不存在，或者已经被移动。",
  backHome: "回到首页",

  langSwitch: "语言",
  skipToContent: "跳到主要内容",
  copyEmail: "复制邮箱",
  copied: "已复制",
  themeGroup: "主题",
  themeLight: "浅色",
  themeDark: "暗色",
  themeSystem: "跟随系统",

  fallbackNotice: "此内容暂时只有中文版。",

  statCategories: "分类",
  statTech: "技术",
  aboutStack: "技术栈",
  backToTop: "回到顶部",
  breadcrumbLabel: "面包屑",
  prevProject: "上一件",
  nextProject: "下一件",
  catOther: "其他",
  projectsIntro:
    "用 Astro、React 和 TypeScript 做过的网页应用与小工具，每个项目都记录了背景、做法和结果。",
};

const en: Record<keyof typeof zh, string> = {
  homeTitle: "AI-assisted Product Work",
  homeMeta:
    "warm's portfolio of useful web tools built from real needs with AI-assisted development.",
  aboutMeta:
    "About warm, who starts from practical needs and uses AI-assisted development to build useful web tools.",
  projectsMeta:
    "Selected work · {count} projects: {names}. Built with Astro, React and TypeScript.",
  projectMetaSuffix: "Project details: background, what I built and the result.",
  navHome: "Home",
  navProjects: "Work",
  navAbout: "About",
  navLabel: "Main navigation",

  ctaViewWork: "View work",
  ctaContact: "Contact",
  processNeed: "Find a real need",
  processBuild: "Build with AI",
  processTry: "Ship a working demo",
  aboutHomeBlurb: "I care about whether a tool removes real friction. Each case records the key decisions and a working result.",

  browseTitle: "Browse by type",
  browseAll: "All work",

  catWeb: "Web apps",
  catWebBlurb: "Websites and web apps",
  catGame: "Games",
  catGameBlurb: "Playable games and interactive demos",
  catTool: "Tools",
  catToolBlurb: "Small tools I use myself",

  featuredTitle: "Selected work",
  viewAll: "All",

  projectsTitle: "Work",
  statProjects: "Projects",
  statYears: "Years",
  statSkills: "Skills",
  projectsCount: "{count} projects",
  filterAll: "All",
  categoryNav: "Work categories",
  emptyProjects: "Nothing in this category yet.",

  backToProjects: "Back to work",
  tryIt: "Try it live",
  loadDemo: "Load live demo",
  openInNewTab: "Open in a new tab",
  tryItNote:
    "This is a standalone app. Your data stays in your own browser and is never uploaded.",
  linkGithub: "GitHub",
  linkDemo: "Live demo",
  projectNav: "Project navigation",

  aboutTitle: "About",
  aboutSkills: "Skills",
  aboutExperience: "Experience",
  aboutMore: "Learn more",

  contactTitle: "Contact",
  contactBlurb: "Got a project or an idea? Just reach out.",

  notFoundTitle: "Page not found",
  notFoundBlurb: "The page you're looking for doesn't exist or has moved.",
  backHome: "Back home",

  langSwitch: "Language",
  skipToContent: "Skip to content",
  copyEmail: "Copy email",
  copied: "Copied",
  themeGroup: "Theme",
  themeLight: "Light",
  themeDark: "Dark",
  themeSystem: "System",

  fallbackNotice: "This content is currently only available in Chinese.",

  statCategories: "Categories",
  statTech: "Tech",
  aboutStack: "Stack",
  backToTop: "Back to top",
  breadcrumbLabel: "Breadcrumb",
  prevProject: "Previous",
  nextProject: "Next",
  catOther: "Other",
  projectsIntro:
    "Web apps and small tools built with Astro, React and TypeScript — each with the background, approach, and outcome.",
};

export const ui = { zh, en } as const;

export type UIKey = keyof typeof zh;
