# 个人作品集网站

一个加载快、看着干净、手机上也好用的个人作品集站点。展示项目作品（含**站内内嵌**的交互 demo / 小游戏 / 个人工具）、关于我与联系方式。

技术栈：**Astro + React islands + MDX + Tailwind CSS 4 + TypeScript**；内容用 Markdown/MDX；纯静态；部署 Vercel。

## 文档

- `docs/RESEARCH.md` — 需求研究
- `docs/PRD.md` — 产品需求
- `docs/TECH_DESIGN.md` — 技术设计
- `AGENTS.md` — 面向 AI 的工作手册

## 常用命令

```powershell
npm install          # 安装依赖
npm run dev          # 本地预览 http://localhost:4321
npm run build        # 生产构建到 dist/
npm run preview      # 预览构建产物
npm run check        # 类型检查
```

## 加一个作品

在 `src/content/projects/` 新建一个 `.mdx` 文件即可（frontmatter 由 `src/content.config.ts` 的 schema 校验）：

```mdx
---
title: "项目名"
summary: "一句话简介"
cover: ../../assets/projects/cover.svg
date: 2026-09-01
tags: ["TypeScript", "React"]
type: web          # web | game | tool | other
featured: true
links:
  github: https://github.com/you/repo
  demo: https://example.com
---

正文（背景 / 我做了什么 / 结果）。
```

需要内嵌交互零件时，在正文里 `import` 一个 `src/components/islands/` 下的 React 组件并挂上 `client:visible`：

```mdx
import Demo from "../../components/islands/demos/Demo.tsx";

<Demo client:visible />
```

## 站点信息

姓名、简介、社交、技能、经历统一放在 `src/consts.ts`，改这里即可，不要散落硬编码。
