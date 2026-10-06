# TECH_DESIGN · 个人作品集网站

> 阶段三产物。输入来自 `docs/PRD.md`。
> 已定决策：框架 **Astro + React islands**；交互内容**站内实时运行（内嵌 island）**；主题**暗色优先**。
> 结构：① 技术栈 ② 项目结构 ③ 数据模型 ④ 关键技术点。

---

## 1. 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 构建框架 | **Astro 5.x** | 静态优先，内容页默认零 JS、秒开、SEO 好。 |
| 交互零件 | **React 19**（`@astrojs/react`） | 每个 demo / 游戏 / 工具作为独立 island，用 React 写，按需水合。 |
| 内容格式 | **MDX**（`@astrojs/mdx`） | 项目正文里可直接 `import` 并挂载 React 交互组件，内嵌 demo 靠它落地。 |
| 内容管理 | **Astro Content Collections**（Content Layer + Zod） | 一个 `.mdx` / `.md` 文件 = 一个项目，frontmatter 由 schema 校验。 |
| 样式 | **Tailwind CSS 4** | 用 CSS-first 的 `@theme` 定义暗色 token；`<html class="dark">` 作默认。 |
| 图片 | **astro:assets** | 输出 AVIF/WebP、响应式尺寸、懒加载；封面设尺寸防 CLS。 |
| 语言 | **TypeScript（strict）** | Astro / React 全栈 TS，配合 `astro check`。 |
| 质量工具 | **ESLint + Prettier** | 统一风格；CI 里跑 lint + `astro check`。 |
| SEO | **`@astrojs/sitemap`** | 生成 sitemap，配 `robots.txt` 与 OG meta。 |
| 部署 | **Vercel**（静态输出） | 连 GitHub 自动部署、自带 HTTPS 与预览环境。备选 Netlify。 |
| 包管理 | **npm** | 保持简单；想更快可换 pnpm。 |

**为什么是 Astro 而不是整站 React**：你的作品集外壳（首页/作品/关于）是内容型、要快；而 demo/游戏/工具是重交互。islands 架构让外壳保持静态零 JS，交互件**按需、按页、各自独立**加载——正好避开「打开首页连游戏引擎一起加载」的陷阱。

---

## 2. 项目结构

```
personal-portfolio/
├─ public/                     # 原样拷贝的静态资源
│  ├─ favicon.svg
│  ├─ robots.txt
│  ├─ og/                      # OG 分享图
│  └─ resume.pdf               # （后续）简历下载
├─ src/
│  ├─ assets/                  # 参与构建优化的图（头像、封面图）
│  ├─ components/              # 可复用 UI
│  │  ├─ Nav.astro             # 顶部导航
│  │  ├─ Footer.astro          # 页脚（社交 + 版权）
│  │  ├─ Hero.astro            # 首页主视觉
│  │  ├─ ProjectCard.astro     # 项目卡片
│  │  ├─ Tag.astro             # 技术栈标签
│  │  ├─ Seo.astro             # title/description/OG/canonical
│  │  └─ islands/              # ← React 交互零件（island）
│  │     ├─ CopyEmail.tsx      # 一键复制邮箱（轻交互）
│  │     ├─ demos/             # 复杂交互 demo
│  │     ├─ games/             # 小游戏（canvas / Phaser / PixiJS）
│  │     └─ tools/             # 个人工具
│  ├─ content/
│  │  └─ projects/             # 一个文件 = 一个项目
│  │     ├─ project-a.mdx
│  │     └─ project-b.mdx
│  ├─ content.config.ts        # Content Collections 的 Zod schema
│  ├─ layouts/
│  │  ├─ BaseLayout.astro      # <html> 壳、全局样式、SEO、导航/页脚
│  │  └─ ProjectLayout.astro   # 项目详情页壳
│  ├─ pages/
│  │  ├─ index.astro           # 首页（Hero + 精选项目 + 关于摘要 + 联系）
│  │  ├─ projects/
│  │  │  ├─ index.astro        # 作品列表
│  │  │  └─ [slug].astro       # 项目详情（getStaticPaths 生成）
│  │  ├─ about.astro           # 关于我
│  │  └─ 404.astro
│  ├─ styles/
│  │  └─ global.css            # Tailwind 入口 + @theme 暗色 token
│  └─ consts.ts                # 站点配置（姓名/社交/导航/技能/经历）
├─ astro.config.mjs            # integrations: react / mdx / sitemap
├─ tsconfig.json
└─ package.json
```

**每层职责**
- `components/*.astro`：静态、无 JS 的展示层（默认零成本）。
- `components/islands/**`：需要交互的零件，**唯一允许出 JS 的地方**，用 React 写。
- `content/projects/**`：作品数据源，加作品只在这一层动。
- `pages/**`：路由与页面组装，从 collection 取数据。
- `consts.ts`：站点的唯一"个人信息源"，改名字/社交只改这里。

---

## 3. 数据模型

### 3.1 Project（Content Collection，来自 frontmatter）

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | ✅ | 项目标题 |
| `summary` | `string` | ✅ | 一句话简介 |
| `cover` | `image` | ✅ | 封面图（构建时优化） |
| `date` | `Date` | ✅ | 日期，用于倒序排序 |
| `tags` | `string[]` | ⬜ | 技术栈标签，默认 `[]` |
| `type` | `'web' \| 'game' \| 'tool' \| 'other'` | ⬜ | 分类，默认 `web`（新增，用于区分游戏/工具） |
| `featured` | `boolean` | ⬜ | 是否精选（首页置顶），默认 `false` |
| `links` | `{ github?: string; demo?: string }` | ⬜ | 外链，默认 `{}` |
| `gallery` | `image[]` | ⬜ | 详情页多图，默认 `[]` |
| 正文 | MDX | ⬜ | 背景 / 我做了什么 / 结果；**内嵌 demo 就写在这里** |

Zod schema 示例（`src/content.config.ts`）：

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      cover: image(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      type: z.enum(['web', 'game', 'tool', 'other']).default('web'),
      featured: z.boolean().default(false),
      links: z
        .object({ github: z.string().url().optional(), demo: z.string().url().optional() })
        .default({}),
      gallery: z.array(image()).default([]),
    }),
});

export const collections = { projects };
```

### 3.2 SiteConfig（`src/consts.ts`）

```ts
export interface SocialLink { label: string; href: string; icon: string }

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;   // 如 "2024.03 - 至今"
  summary?: string;
}

export interface NavItem { label: string; href: string }

export interface SiteConfig {
  name: string;              // 姓名
  role: string;              // 一句话定位 / tagline
  bio: string;               // 自我介绍（短）
  avatar: string;            // 头像路径
  email: string;             // 联系邮箱
  location?: string;
  nav: NavItem[];            // 顶部导航
  socials: SocialLink[];     // 社交链接
  skills: string[];          // 技能标签
  experience: ExperienceItem[];
}
```

---

## 4. 关键技术点

**难点 1 · 内容驱动：一个文件 = 一个项目**
- **解法**：Content Collections + Zod schema。frontmatter 缺字段会在**构建时报错**，保证每个项目字段一致。
- 列表页 `getCollection('projects')` 排序（`date` 倒序，`featured` 置顶）；详情页用 `getStaticPaths()` + `[slug].astro` 静态生成。

**难点 2 · 岛屿加载策略（性能核心）**
- **解法**：React island 一律用 **`client:visible`**（滚到视口才加载），而不是 `client:load`。轻交互（复制邮箱）用 `client:idle` 或纯 Astro `<script>`。
- 效果：每个 demo/游戏/工具**独立打包、按页按需加载**，首页永远不会背上游戏引擎的包袱。

**难点 3 · 内嵌 demo / 游戏怎么落地**
- **解法**：用 **MDX**。项目正文里直接：
  ```mdx
  import Snake from '../../components/islands/games/Snake.tsx'
  <Snake client:visible />
  ```
- 游戏/渲染用 canvas（Phaser / PixiJS / 原生），外层用 React 包一层；在 React 的 `useEffect` 里做挂载/卸载，**务必清理事件与 RAF**，避免内存泄漏。
- 想更省事也可以把整块用 iframe 指向独立路径，但已定「站内内嵌」，优先走 island。

**难点 4 · 暗色优先的主题系统**
- **解法**：Tailwind 4 用 `@theme` 定义**语义化颜色 token**（`--color-bg` / `surface` / `text` / `muted` / `accent`），暗色值作默认，`<html class="dark">`。
- 后续加浅色 + 切换按钮时，只补一套 token 即可，不用改组件。

**难点 5 · 图片优化与首屏稳定**
- **解法**：`astro:assets` 的 `<Image>` 输出 AVIF/WebP + 响应式尺寸 + `loading="lazy"`；封面**显式给 width/height** 防布局抖动（CLS）。首屏 Hero 图用 `priority` 不加 lazy。

**难点 6 · SEO 与可访问性**
- **解法**：`BaseLayout` 统一注入 `title` / `description` / OG / canonical；`@astrojs/sitemap` + `robots.txt`。语义化标签、图片 `alt`、键盘可导航、对比度达标。

**难点 7 · 类型与代码质量**
- **解法**：TypeScript strict；每次改动跑 `astro check` 类型检查，配合 ESLint + Prettier；部署前跑一次 `astro build` 确认可产出。

---

## 附：搭建时需要的依赖（供实现阶段参考）

```
astro  @astrojs/react  @astrojs/mdx  @astrojs/sitemap  tailwindcss  @tailwindcss/vite
react  react-dom  typescript  astro-icon（可选）
```
