export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  summary?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  headline: { lead: string; accent: string };
  bio: string;
  years: string;
  avatar: string;
  email: string;
  location?: string;
  nav: NavItem[];
  socials: SocialLink[];
  skills: string[];
  experience: ExperienceItem[];
}

export const SITE: SiteConfig = {
  name: "你的名字",
  role: "全栈开发者 / Vibe Coder",
  headline: { lead: "把想法变成", accent: "能用的产品" },
  bio: "平时用 AI 辅助学习和做东西，这里放我练手做过的项目。",
  years: "",
  avatar: "/avatar.svg",
  email: "hello@example.com",
  location: "中国",
  nav: [
    { label: "首页", href: "/" },
    { label: "作品", href: "/projects" },
    { label: "关于", href: "/about" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/warm-one", icon: "github" },
    { label: "邮箱", href: "mailto:hello@example.com", icon: "mail" },
  ],
  skills: [],
  experience: [],
};
