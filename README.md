# 个人作品集网站

一个加载快、看着干净、手机上也好用的个人作品集站点：展示项目作品、关于我与联系方式。**中英双语**，**明暗主题**（默认跟随系统）。部分项目带**站内可直接运行的 demo**。

技术栈：**Astro + MDX + Tailwind CSS 4 + TypeScript**；轻交互用极小内联脚本，React 依赖保留但 `react()` 集成当前不启用（页面零外部 JS）；内容用 Markdown/MDX；纯静态；部署 Vercel。

## 精选项目

- [DesktopTidy 桌面整理助手](src/content/projects/zh/desktop-tidy.mdx) · Windows 工具，支持逐项预览文件去向、确认移动和按日志撤销。[项目源码](https://github.com/warm-one/DesktopTidy)
- [Markdown 笔记](src/content/projects/zh/project-markdown.mdx) · 在浏览器里写作、实时预览，并把笔记保存在本地。
- [个人作品集网站](src/content/projects/zh/project-web.mdx) · 中英双语静态站点及站内项目演示。

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

> 若 dev 里看到的作品数量 / 文案对不上，先**重启 `npm run dev`**：Astro 开发服务器偶尔不会热更新内容集合。

## 加一个作品

内容按语言分目录：`src/content/projects/zh/` 与 `src/content/projects/en/`，**一个文件 = 一个作品的一种语言**。文件名（如 `project-web.mdx`）就是 URL 里的 slug。

```mdx
---
title: "项目名"
summary: "一句话简介"
cover: ../../../assets/projects/cover.svg
date: 2026-09-01
lang: zh            # zh | en
tags: ["TypeScript", "React"]
type: web           # web | game | tool | other
featured: true
embed: /demos/xxx/  # 可选：站内可运行 demo 的路径
links:
  github: https://github.com/you/repo
  demo: https://example.com
---

正文（背景 / 我做了什么 / 结果）。
```

填了 `embed`，项目详情页会多出「在线体验」区块；点击「加载在线体验」后才插入 iframe，避免首屏加载 demo 的脚本，并给一个「在新标签打开」。

英文版缺失时会**自动回退到中文**并在页面上提示，不会 404。

## 站内可运行的 demo

大型 / 独立技术栈的应用**不拆成组件**（React 版本和 Tailwind 版本都会打架），而是**整站作为静态资源挂在子路径**，用 iframe 嵌入。当前这个：

- 源码在仓库外：`D:\vibecoding-shizhan\markdown`
- 构建产物同步到：`public/demos/markdown/`，线上地址 `/demos/markdown/`
- 改完演示源码后，跑一次同步脚本（会自动带上 `base=/demos/markdown/` 重新构建）：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/sync-demo.ps1
# 源码在别处时： -AppDir "D:\别的路径\markdown"
```

小的交互（主题切换、复制邮箱）用组件内的 `<script is:inline>`，**不加载框架 JS**；确实需要复杂交互时，先在 `astro.config.mjs` 加回 `react()`，再把组件放进 `src/components/islands/` 按 island 加载（`client:visible`，不要 `client:load`）。

## 多语言

- 界面文案集中在 `src/i18n/ui.ts`，组件里用 `t("key")` 取，**不要写死中文或英文**。
- 中文无前缀，英文在 `/en`；页面放在 `src/pages/[...lang]/`，一个模板管两种语言。
- 语言切换按钮用互补路径算出目标地址，**停在当前页**，不跳回首页。

## 主题

- `light` / `dark` / `system` 三态，默认跟随系统，选择存在 `localStorage`。
- 首屏由 `<head>` 里一段内联脚本在绘制前定好 `<html>` 的 class、`data-theme` 与 `theme-color`，**不要改成外链脚本**。
- 切换按钮是 `src/components/ThemeToggle.astro`（内联脚本，无 React）；切换只改 class 与 `localStorage`，不重渲染页面。
- 颜色只走语义 token（`background` / `surface` / `foreground` / `muted` / `accent` / `border`），两套值在 `src/styles/global.css`；MDX 正文也通过 `--tw-prose-*` 跟随 token。

## 性能约定

- **站点主页面不加载外部 JS**（`/demos/*` 是独立 demo，iframe 内自带脚本）：交互只有主题切换、复制邮箱、404 语言判断，均为内联小脚本。新增 React island 前先问一句“这点交互值不值得 200KB 运行时”。
- 项目封面走 `astro:assets` 的响应式 `srcset`（卡片 400/800，Hero 展示卡 400/800/1200）；Hero 首图 eager，其余懒加载。当前首页 HTML 约 **5.3KB gzip** + 全站共用 CSS 约 **8.4KB gzip**，无外链 JS。
- 社交分享图是 `public/og/default.png`（1200×630 PNG）。改完视觉后可重新生成：

```powershell
python scripts/make-og.py   # 需要 Pillow；仅本地生成图片，不是站点依赖
```

## 站点信息

姓名、简介、社交、技能、经历统一放在 `src/consts.ts`（可翻译的字段按语言存），改这里即可，不要散落硬编码。
