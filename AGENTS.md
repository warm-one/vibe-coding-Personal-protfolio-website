# AGENTS.md

> 面向 AI 代理的项目工作手册。**开工前先读这份**。
> 需求（做什么）看 `docs/PRD.md`；架构与技术（怎么做）看 `docs/TECH_DESIGN.md`；来龙去脉看 `docs/RESEARCH.md`。
> 本文件**只写"照着什么规矩做"**，不重复需求与技术选型。

---

## 1. 项目概述

- **这是什么**：个人作品集 + 博客站，**中英双语、明暗主题**。展示做过的项目、写文章、关于我、联系方式。
- **技术栈一句话**：**Astro 7 + MDX + Tailwind CSS 4 + TypeScript**（React 19 island 能力保留）；内容用 Markdown/MDX；纯静态；部署 Vercel。
- **核心原则**：**全站零外部 JS**、极致快；轻交互用内联小脚本，复杂交互才作为 island；**界面文案双语、颜色只走语义 token**。

---

## 2. 开发规范

**语言**
- TypeScript（strict），不用 `any` 兜底。

**组件写法**
- 纯展示用 `.astro`（默认零 JS）。
- **轻交互**（主题切换、复制邮箱这类几十行的事）用组件内 `<script is:inline>`，**不加载框架运行时**。
- 只有复杂交互才用 React `.tsx`，放 `src/components/islands/`；加之前先确认“值不值得约 200KB 运行时”。当前 `astro.config` **未启用 `react()` 集成**（避免产出未被引用的 220KB client 包），需要 island 时先加回。
- island 默认 `client:visible`；**绝不无脑 `client:load`**。当前全站页面应为 0 个外部 JS。

**样式方案**
- Tailwind CSS 4。颜色**只用语义 token**（`background` / `surface` / `foreground` / `muted` / `accent` / `border`），**不写死色值**。
- 明暗两套值都在 `src/styles/global.css`（`@theme` + `.dark` 覆盖）。组件**只管消费 token**，加/改主题不动组件。

**主题**
- 三态：`light` / `dark` / `system`，**默认跟随系统**。
- 由 `<head>` 里一段**内联、阻塞、极小**的脚本在首屏前定好 `<html>` 的 class——**这是"不闪烁"的唯一可靠做法，不要改成外链脚本**。
- 切换只改 `<html>` 的 class 与 `localStorage`，**不触发整页重渲染**。

**国际化**
- 所有界面文字集中在 `src/i18n/ui.ts`，组件里用 `t("key")` 取；**绝不写死中文或英文**。
- 语言：`zh`（无前缀）/ `en`（`/en`）。页面放 `src/pages/[...lang]/`，**一个模板管两种语言**。
- 语言切换要**保留当前页**（用互补路径算出目标地址），不要跳回首页。
- 内容按语言分目录：`src/content/<集合>/<语言>/`。

**数据存储**
- 用 Content Collections：**一个文件 = 一个作品 / 一篇文章的一种语言**，frontmatter 由 `src/content.config.ts` 的 Zod schema 校验。
- 站点个人信息集中在 `src/consts.ts`，**不散落硬编码**。
- 页面**不直接读 collection**，统一走 `src/lib/*`。

---

## 3. 代码风格

- **命名约定**
  - 组件：`PascalCase`（如 `ProjectCard.astro`）
  - 函数 / 变量：`camelCase`
  - 常量：`UPPER_SNAKE_CASE`
  - 文件与目录：`kebab-case`（内容文件用 slug）
  - i18n key：`camelCase`（如 `navHome`）
- **格式化**：Prettier + ESLint，改动后跑一次。
- 不写无意义注释，只在逻辑不直观处注释。
- 保持简洁，避免过度抽象；三行能说清就别造抽象。

---

## 4. 测试要求

每完成一个功能，按顺序自检：

1. `npm run dev` 本地预览，肉眼过一遍（**桌面 + 手机宽度**各看一次）。
2. `npx astro check`——类型检查必须**零错误**。
3. `npm run build`——必须能成功产出。
4. **交互 island 专项**：加载策略正确、切页 / 卸载无报错、**无内存泄漏**（清理事件监听与 `requestAnimationFrame`）。
5. **主题专项**：首屏**不闪**、刷新后记住选择、明暗两套配色对比度都达标。
6. **多语言专项**：中英各点一遍；语言切换**停在当前页**；内容缺翻译时**走回退、不 404**。
7. **移动端**：320 / 360 / 390 三档不横向溢出、导航不折行、字号可读。
8. **可访问性**：首 Tab 是 skip link；键盘焦点有 2px accent 描边；指针目标 ≥ 24×24；`prefers-reduced-motion` 下无平滑滚动/过渡。
9. **性能回归**：构建后扫描 `dist/**/*.html`，确认没有新增外链 JS。

> 若之后接 CI，以上命令按顺序进 pipeline。

---

## 5. 注意事项

- **优先 MVP**，不擅自加功能；PRD 里「后续可以做」的不要提前做。
- **博客实现尚未启动**：结构已设计好，但在用户确认前**不要开写**。
- **不引入新依赖**（TECH_DESIGN 已定"零新增依赖"）；确需引入先问用户。
- **性能是底线**：首屏 JS 越少越好，图片懒加载 + 显式 `width/height`，动效克制。
- **移动端优先**：先写窄屏，再适配宽屏。
- **SEO**：每页有 `title` / `description` / OG；**中英两版各自可索引并互相标注**（hreflang）。
- **加作品 / 加文章只加 content 文件**，不动页面结构。
- **改了就同步文档**：动了功能范围 → 更新 `docs/PRD.md`；动了结构或技术 → 更新 `docs/TECH_DESIGN.md`。

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
