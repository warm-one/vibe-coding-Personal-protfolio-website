# AGENTS.md

> 面向 AI 代理的项目工作手册。开工前先读这份；需求细节看 `docs/PRD.md`，架构与目录看 `docs/TECH_DESIGN.md`，来龙去脉看 `docs/RESEARCH.md`。

---

## 1. 项目概述

- **这是什么**：个人作品集网站。展示项目作品（含**站内内嵌**的复杂交互 demo、小游戏、个人工具）、关于我、联系方式。
- **技术栈一句话**：**Astro 5 + React 19 islands + MDX + Tailwind CSS 4 + TypeScript**；Markdown/MDX 存内容；纯静态；部署 Vercel。
- **核心原则**：内容页零 JS、极致快；重交互零件作为 island 按需加载，互不拖累。

---

## 2. 开发规范

- **语言**：TypeScript（strict），不用 `any` 兜底。
- **组件写法**
  - 纯展示用 `.astro`（默认零 JS）。
  - 只有需要交互才用 React `.tsx`，放 `src/components/islands/`。
  - React island 默认 `client:visible`；轻交互用 `client:idle`；**绝不无脑 `client:load`**。
- **样式方案**：Tailwind CSS 4。颜色用 `@theme` 的**语义 token**（`bg` / `surface` / `text` / `muted` / `accent`），不写死色值；暗色为默认，`<html class="dark">`。
- **数据存储**
  - 内容用 Content Collections：**一个 `.mdx` / `.md` = 一个项目**，放 `src/content/projects/`，frontmatter 由 `src/content.config.ts` 的 Zod schema 校验。
  - 站点个人信息集中在 `src/consts.ts`，**不散落硬编码**。

---

## 3. 代码风格

- **命名约定**
  - 组件：`PascalCase`（如 `ProjectCard.astro`）
  - 函数 / 变量：`camelCase`
  - 常量：`UPPER_SNAKE_CASE`
  - 文件与目录：`kebab-case`（内容文件可用 slug）
- **格式化**：Prettier + ESLint，改动后跑一次。
- 不写无意义注释，只在逻辑不直观处注释。
- 保持简洁，避免过度抽象；三行能说清就别造抽象。

---

## 4. 测试要求

每完成一个功能，按顺序自检：

1. `npm run dev` 本地预览，肉眼过一遍（**桌面 + 手机宽度**各看一次）。
2. `npx astro check`——类型检查必须**零错误**。
3. `npm run build`——必须能成功产出。
4. 交互 island 专项：加载策略正确、切页/卸载无报错、**无内存泄漏**（清理事件监听与 `requestAnimationFrame`）。
5. 视觉改动核对移动端：窄屏不横向溢出、字号可读、对比度达标。

> 若之后接 CI，以上命令按顺序进 pipeline。

---

## 5. 注意事项

- **优先 MVP**，不擅自加功能；PRD 里「后续可以做」的不要提前做。
- **性能是底线**：首屏 JS 越少越好，图片懒加载 + 显式 `width/height`，动效克制。
- **移动端优先**：先写窄屏，再适配宽屏。
- **SEO**：每页都有 `title` / `description` / OG。
- **加作品只加 content 文件**，不动页面结构。
- **不要**把游戏/工具的重依赖（Phaser / PixiJS 等）提到首页或全局加载。

---

## 6. 开发环境

- **操作系统**：Windows；**终端**：PowerShell。所有命令给 **Windows 兼容**写法。
- **常用命令**
  - 安装依赖：`npm install`
  - 开发预览：`npm run dev`
  - 生产构建：`npm run build`
  - 预览产物：`npm run preview`
  - 类型检查：`npx astro check`
- **PowerShell 注意事项**
  - 顺序执行用 `;`，**不要**用 `&&`（除非确认是 PowerShell 7+）。
  - 路径含空格要加引号：`cd "D:\vibecoding-shizhan\Personal protfolio website"`。
  - 别用 Linux 专有写法：删目录用 `Remove-Item -Recurse -Force`，查文件用 `Get-ChildItem`。
