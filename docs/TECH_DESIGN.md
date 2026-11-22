# TECH_DESIGN · 个人作品集网站（重塑版）

> 阶段三产物。输入来自 `docs/PRD.md`。
> 已定决策：框架 **Astro + 内联脚本**（React island 能力保留）；多语言 **默认中文、英文加 `/en` 前缀**；主题**默认跟随系统**；翻译**先搭架子**（内容后补）；博客结构一并设计，但**实现不急**。
> 结构：⓪ 视觉方向 ① 技术栈 ② 依赖与库 ③ 项目结构 ④ 数据模型 ⑤ 模块 / 函数 / 变量定义 ⑥ 关键技术点。

---

## ⓪ 视觉方向（界面类项目先定）

**基调不变**：编辑感、暗色优先、大留白、克制的字距、单一强调色。新增的部分也必须服从这个基调。

**本次要新增的是「浅色主题」**——之前只有暗色。两套共用同一组**语义 token**，只换值：

| 语义 token | 暗色（现状） | 浅色（新增） |
| --- | --- | --- |
| background | `#0b0f14` | `#f8f9fb` |
| surface | `#121821` | `#ffffff` |
| foreground | `#e6edf3` | `#10151c` |
| muted | `#9aa7b2` | `#566173` |
| accent | `#58a6ff` | `#1558d6` |
| border | `#1f2933` | `#e4e7ec` |

- 浅色的强调色要**更深**（白底上才够对比）；两套都必须过对比度检查。
- **明确不做**：明暗之外的"花哨主题"（海洋 / 森林…）。主题切换**不加花哨动效**。

**本次前端优化（视觉）**：Hero 右栏从空装饰面板改为「真实作品展示卡」（浏览器窗口 + 封面 + 类型/日期），背景保留网格/柔光；首页顺序改为 Hero → 精选 → 分类 → 关于/联系；作品卡补类型、日期、标签折叠；About 改两栏；Footer 加联系与回到顶部。只改布局与组件，不新增颜色 token。

---

## 1. 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 构建框架 | **Astro 7.x** | 沿用现状：静态优先，内容页零 JS、秒开、SEO 好。 |
| 交互零件 | **原生内联脚本**（React 19 依赖保留，`react()` 集成当前不启用） | 轻交互用约 1KB 内联脚本；当前全站 **0 外部 JS**。需要复杂交互时在 `astro.config` 加回 `react()` 即可。 |
| 内容格式 | **MDX**（`@astrojs/mdx`） | 作品正文可内嵌交互组件。 |
| 内容管理 | **Content Collections**（Content Layer + Zod） | 一个文件 = 一个作品 / 一篇文章，frontmatter 由 schema 校验。 |
| 样式 | **Tailwind CSS 4** | CSS-first 的 `@theme` 定义语义 token；明暗两套值。 |
| **国际化** | **Astro 内置 i18n 路由**（`astro:i18n`） | **不需要额外依赖**；默认中文无前缀，英文走 `/en`。 |
| 图片 | **astro:assets** | AVIF/WebP + 响应式 + 懒加载；显式尺寸防 CLS。 |
| 语言 | **TypeScript（strict）** | 全栈 TS；`astro check` 把关。 |
| 质量 | **ESLint + Prettier** | 统一风格。 |
| SEO | **`@astrojs/sitemap`** | 按语言分别输出；配合 hreflang。 |
| 部署 | **Vercel**（静态输出） | 连 GitHub 自动部署。 |
| 包管理 | **npm** | 沿用现状。 |

**为什么 i18n 不引第三方库**：Astro 内置了 i18n 路由与工具，社区常见做法就是用它；本站两语言、无复杂复数规则，引入 i18next 之类只会变重。

---

## 2. 依赖与库

**已有（不动）**：`astro`、`@astrojs/react`、`react` / `react-dom`、`@astrojs/mdx`、`@astrojs/sitemap`、`tailwindcss` + `@tailwindcss/vite`、`@tailwindcss/typography`、`zod`、`typescript`、`@astrojs/check`。

**本次新增：无。**

- 多语言 → Astro 内置 i18n，无需包。
- 主题切换 → 一个小组件 + CSS 变量，无需包。
- 博客 → 复用 Content Collections，无需包。
- 翻译 → **先搭架子**，暂不引入翻译脚本（将来要自动翻译再加）。

> 结论：这次是**零新增依赖**的改造，风险低。

---

## 3. 项目结构

```
personal-portfolio/
├─ public/
│  ├─ favicon.svg  robots.txt  og/
├─ src/
│  ├─ i18n/
│  │  ├─ ui.ts                  # 界面文案字典（zh / en）
│  │  └─ utils.ts               # 语言识别、翻译函数、路径工具
│  ├─ components/
│  │  ├─ Nav.astro              # 页头（含语言切换 + 主题切换入口）
│  │  ├─ Footer.astro
│  │  ├─ Hero.astro  HeroVisual.astro  HeroShowcase.astro  SectionHeader.astro
│  │  ├─ ProjectCard.astro  Tag.astro  FilterChips.astro  CategoryBrowse.astro
│  │  ├─ Seo.astro              # 标题/描述/OG/canonical + hreflang + JSON-LD
│  │  ├─ LangSwitch.astro       # 语言切换（保留当前页）
│  │  ├─ ThemeToggle.astro      # 三态主题切换（内联脚本，零外部 JS）
│  │  ├─ CopyEmail.astro        # 复制邮箱（内联脚本 + mailto 降级）
│  │  ├─ PostCard.astro         # 博客卡片（新增）
│  │  └─ islands/               # 仅复杂交互使用；当前为空，React 能力保留
│  ├─ content/
│  │  ├─ projects/
│  │  │  ├─ zh/project-web.mdx  # 一个文件 = 一个作品的一种语言
│  │  │  └─ en/project-web.mdx
│  │  └─ blog/                  # （新增）
│  │     ├─ zh/*.mdx
│  │     └─ en/*.mdx
│  ├─ content.config.ts         # projects / blog 的 Zod schema
│  ├─ layouts/
│  │  ├─ BaseLayout.astro       # <html> 壳、明暗初始化、SEO、导航/页脚
│  │  └─ ProjectLayout.astro
│  ├─ lib/
│  │  ├─ projects.ts            # 取作品、按语言、回退
│  │  ├─ posts.ts               # 取文章（新增，同 projects）
│  │  ├─ categories.ts          # 分类元数据
│  │  └─ format.ts               # 日期格式化（UTC）
│  ├─ pages/
│  │  ├─ [...lang]/
│  │  │  ├─ index.astro
│  │  │  ├─ about.astro
│  │  │  ├─ projects/index.astro
│  │  │  ├─ projects/[slug].astro
│  │  │  ├─ projects/category/[category].astro
│  │  │  ├─ blog/index.astro    # （新增）
│  │  │  └─ blog/[slug].astro   # （新增）
│  │  └─ 404.astro
│  ├─ styles/global.css         # Tailwind + 明暗 token；@source 排除 public/demos
│  └─ consts.ts                 # 站点配置（姓名/社交/技能/经历）
├─ astro.config.mjs             # integrations + i18n 配置
├─ tsconfig.json
└─ package.json
```

**每层职责**
- `i18n/`：**所有界面文案与语言逻辑的唯一出处**，组件不写死文字。
- `components/*.astro`：静态展示层（零 JS）。
- `components/islands/**`：复杂 React island 的预留位置；轻交互（主题/复制）用组件内 `<script is:inline>` 完成，**不引入框架运行时**。
- `content/<集合>/<语言>/`：内容数据源，**加内容只在这一层动**。
- `pages/[...lang]/**`：路由与组装；一个模板同时产出两种语言。
- `lib/`：取数与纯逻辑，页面不直接读 collection。

---

## 4. 数据模型

### 4.1 Project（Content Collection，frontmatter）

在现有字段上**新增 `lang`**；语言由所在目录决定（见结构）。其余不变。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | ✅ | 标题 |
| `summary` | `string` | ✅ | 一句话简介 |
| `cover` | `image` | ✅ | 封面 |
| `date` | `Date` | ✅ | 排序用 |
| `lang` | `'zh' \| 'en'` | ✅ | 语种（新增） |
| `tags` | `string[]` | ⬜ | 默认 `[]` |
| `type` | `'web' \| 'game' \| 'tool' \| 'other'` | ⬜ | 默认 `web` |
| `featured` | `boolean` | ⬜ | 默认 `false` |
| `links` | `{ github?: string; demo?: string }` | ⬜ | 默认 `{}` |
| `embed` | `string` | ⬜ | 站内可运行 demo 的路径（如 `/demos/markdown/`）；有则详情页出「在线体验」 |
| `gallery` | `image[]` | ⬜ | 默认 `[]` |
| 正文 | MDX | ⬜ | 背景 / 我做了什么 / 结果 |

### 4.2 BlogPost（新增集合）

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | ✅ | 文章标题 |
| `summary` | `string` | ✅ | 摘要（列表页显示） |
| `date` | `Date` | ✅ | 发布时间，列表倒序 |
| `lang` | `'zh' \| 'en'` | ✅ | 语种 |
| `cover` | `image` | ⬜ | 可选封面 |
| `tags` | `string[]` | ⬜ | 默认 `[]` |
| `draft` | `boolean` | ⬜ | 默认 `false`；为真则不出现在列表 |
| 正文 | MDX | ⬜ | 长文 |

### 4.3 其它类型

```ts
export type Lang = "zh" | "en";
export type Theme = "light" | "dark" | "system";

// 内容在另一语言缺失时的标记
export interface Localized<T> {
  data: T;
  lang: Lang;
  fallback: boolean; // true = 当前语言没有，回退显示了另一种
}
```

---

## 5. 模块 / 函数 / 变量定义

### `src/i18n/ui.ts`
```ts
export const ui = {
  zh: { navHome: "首页", navProjects: "作品", navAbout: "关于", navBlog: "博客",
        themeLight: "浅色", themeDark: "暗色", themeSystem: "跟随系统" /* … */ },
  en: { navHome: "Home", navProjects: "Work", navAbout: "About", navBlog: "Writing",
        themeLight: "Light", themeDark: "Dark", themeSystem: "System" /* … */ },
} as const;

export const defaultLang: Lang = "zh";
export const locales: Lang[] = ["zh", "en"];
export type UIKey = keyof (typeof ui)[typeof defaultLang];
```

### `src/i18n/utils.ts`
```ts
getLangFromUrl(url: URL): Lang                       // /en/... → "en"，否则 "zh"
useTranslations(lang: Lang): (key: UIKey) => string  // t("navHome")
localizePath(path: string, lang: Lang): string       // "/about" + "en" → "/en/about"
getAlternatePath(url: URL, target: Lang): string     // 当前页在目标语言下的地址
getLangStaticPaths(): { params: { lang: string | undefined } }[]  // 供各页 getStaticPaths 用
```

### `src/lib/format.ts`
```ts
formatMonth(date: Date): string              // 2026.10（UTC）
formatLongDate(date: Date, lang: Lang): string
```

### `src/lib/projects.ts` / `posts.ts`
```ts
getProjects(lang: Lang): Localized<Project>[]     // 排序：date 倒序、featured 置顶；缺英则回退中文
getProject(lang: Lang, slug: string): Localized<Project> | undefined
getPosts(lang: Lang): Localized<BlogPost>[]       // 过滤 draft
```

### `src/components/ThemeToggle.astro` / `CopyEmail.astro`
- `ThemeToggle`：props 只有 `lang`（文案走 i18n）。读 / 写 `localStorage["theme"]`，只改 `<html>` 的 class、`data-theme` 与 `<meta name="theme-color">`，**不触发整页重渲染**；系统偏好变化时自动跟随。
- `CopyEmail`：props 为 `email / copyLabel / copiedLabel`。默认是 `mailto:` 链接（无 JS 也可用），JS 只负责“点击复制 + 状态提示”。
- 两者都用 `<script is:inline>`（各约 1KB），**不加载 React**。

### `src/components/LangSwitch.astro`
- props：`lang: Lang`。
- 链接由 `getAlternatePath(Astro.url, other)` 算出，**保持当前页**。

---

## 6. 关键技术点

**难点 1 · i18n 路由：默认语言不带前缀**
- **解法**：`astro.config` 配 `i18n: { locales: ['zh','en'], defaultLocale: 'zh', routing: { prefixDefaultLocale: false } }`。
- 所有页面放 `src/pages/[...lang]/`，用 `getLangStaticPaths()` 同时产出「无前缀」与 `/en` 两版。**一个模板管两种语言**，不复制页面。

**难点 2 · 主题切换不闪烁（本次核心）**
- **解法**：在 `BaseLayout` 的 `<head>` 里放一段**极小、内联、阻塞**的脚本，在首屏绘制前读 `localStorage`；没有存过就按 `prefers-color-scheme`（跟随系统）决定，然后给 `<html>` 加上 `light` / `dark` class，同时写入 `data-theme`、`data-locale` 与 `theme-color`。
- 关键：**脚本必须在 CSS 之前、且是内联的**（外链脚本会晚一拍 → 闪一下）。这是"不闪烁"的唯一可靠做法。

**难点 3 · 明暗两套 token**
- **解法**：Tailwind 4 里 `@theme` 定义浅色值；`.dark` 选择器覆盖为暗色值；再加 `@custom-variant dark (&:where(.dark, .dark *))` 以支持 `dark:` 工具类。
- 组件**只消费语义 token**（`bg-background` / `text-muted` …），永远不写死颜色 → 加主题不用改组件。

**难点 4 · 语言切换保留当前页**
- **解法**：`LangSwitch` 不写死首页链接，而是用 `getAlternatePath(Astro.url, target)` 算出**当前页**在另一语言下的地址。比如在 `/projects/project-web` 切英文 → `/en/projects/project-web`。

**难点 5 · 内容双语与回退**
- **解法**：内容按语言分目录存放；`lib/projects.ts` 先找当前语言的条目，找不到就回退中文，并把 `fallback: true` 传给页面，页面上给一句轻提示（而不是 404）。
- 本次**只搭架子**：英文目录先放占位，翻译后续补（可用机器翻译贴入）。

**难点 6 · SEO：两语言各自可索引**
- **解法**：`Seo.astro` 输出 canonical / hreflang / x-default / OG / Twitter 标签；首页额外输出 `WebSite + Person` JSON-LD，404 输出 `noindex`。
- `og:image` 用 **1200×630 PNG**（`public/og/default.png`，由 `scripts/make-og.py` 生成）；作品封面是 SVG 时自动回退到这张默认图（社交平台普遍不解析 SVG）。作品页输出 `og:type=article`、`article:published_time`，光栅封面带上真实的 `og:image:width/height/type`。
- `@astrojs/sitemap` 配 `i18n` 选项，让 sitemap 带 `xhtml:link` 语言关系；中文为主线（x-default）。

**难点 7 · 404 的多语言**
- **解法**：静态托管只认一个 `404.html`，无法在构建期知道访客语言。`<head>` 内联脚本先按 `location.pathname` 前缀（`/en/…`）写 `data-locale`、`<html lang>`；CSS 用 `html[data-locale="en"] [data-404-lang="zh"]` 在首屏前隐藏另一种语言，页尾脚本再补 `document.title` / description。页头用最小版（品牌 + 语言入口 + 主题），不渲染错误语言的导航。

**难点 8 · 博客复用同一套机制（结构先就位）**
- **解法**：`blog` 集合与 `projects` 同构（同 `lang`、同目录约定、同样的列表/详情/排序），页面复用 `ProjectCard` 的思路做 `PostCard`。**实现放后**，但结构、路由、schema 现在定好，之后直接加文件即可。

**难点 9 · 站内可运行 demo（独立技术栈的应用）**
- **问题**：要放进来的应用可能是另一种技术栈（例如 React 18 + Tailwind 3），而本站是 React 19 + Tailwind 4；拆成组件会版本打架。
- **解法**：**不拆组件**，把它当**独立静态应用**——用 `base=/demos/<name>/` 重新构建，产物放 `public/demos/<name>/`，同一个部署下经 `/demos/<name>/` 访问；项目详情页先显示「加载在线体验」按钮，点击后再插入 `<iframe loading="lazy">`，另给「在新标签打开」。
- **为什么用 iframe**：两个独立文档，React / Tailwind 版本互不干扰；点击后才创建 iframe，避免首屏加载 demo 的 ~140KB JS。
- **维护**：演示源码留在原仓库，用 `scripts/sync-demo.ps1` 重新构建并同步产物；另外 `tsconfig.json` 的 `exclude` 必须含 `public`，否则类型检查会去扫压缩后的第三方 JS。

**难点 10 · 主页面零外部 JS（`/demos/*` 独立 demo 除外）**
- **解法**：不再为轻交互加载框架运行时。主题切换、复制邮箱各用一个 `<script is:inline>`（约 1KB）实现；首屏初始化脚本 + JSON-LD 之外，站点主页面没有外链 JS。
- **验证**：构建后逐页扫描 `dist/**/*.html`，`<script src>` 数量为 0；React 依赖仍在，但 `astro.config` 当前不启用 `react()` 集成（避免产出 220KB 未被引用的 client 包）。需要复杂交互时加回 `react()` 即可。
- **样式体积**：`global.css` 用 `@source not "../../public";` 排除 `public/demos` 的 class 扫描，避免 demo 的 Tailwind class 撑大站点 CSS。

**难点 11 · 可访问性细节**
- **解法**：`<head>` 后第一个可聚焦元素是「跳到主要内容」skip link；全局 `:focus-visible` 用 2px accent 描边；导航用 `aria-current="page"`；文字链接补垂直 padding，保证指针目标 ≥ 24×24（WCAG 2.2 AA）；`prefers-reduced-motion` 下关闭平滑滚动与过渡。
- 正文（MDX）通过 `--tw-prose-*` 映射到语义 token，明暗两套都过对比度检查。

---

## 附：本次不做（属 PRD 的「后续」）

- 访问统计、简历下载、标签筛选/搜索、联系表单、页面过渡动画、文章评论。
- 自动翻译脚本（先搭架子，要自动化时再引依赖，需联网与 API key）。