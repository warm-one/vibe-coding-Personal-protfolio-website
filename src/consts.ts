import type { Lang } from "./i18n/ui";

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

export interface SiteConfig {
  name: string;
  role: Record<Lang, string>;
  headline: Record<Lang, { lead: string; accent: string }>;
  bio: Record<Lang, string>;
  years: string;
  avatar: string;
  email: string;
  socials: SocialLink[];
  skills: string[];
  experience: ExperienceItem[];
}

export const SITE: SiteConfig = {
  name: "warm",
  role: {
    zh: "AI 辅助开发 / 产品实践",
    en: "AI-assisted Product Builder",
  },
  headline: {
    zh: { lead: "从真实问题出发", accent: "做出能用的工具" },
    en: { lead: "Start with real problems", accent: "build useful tools" },
  },
  bio: {
    zh: "我从日常的不便里找需求，用 AI 辅助梳理和实现，再把方案做成可以实际体验的产品。",
    en: "I look for everyday friction, use AI to shape and build a solution, then turn it into something people can try.",
  },
  years: "",
  avatar: "/avatar.svg",
  email: "1757285503@qq.com",
  socials: [
    { label: "GitHub", href: "https://github.com/warm-one", icon: "github" },
    { label: "Email", href: "mailto:1757285503@qq.com", icon: "mail" },
  ],
  skills: [],
  experience: [],
};
