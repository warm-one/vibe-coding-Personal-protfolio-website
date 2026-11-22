// @ts-check
import { defineConfig } from 'astro/config';

// React island 能力保留在依赖里；当前页面零外部 JS，故不启用 react() 集成。
// 需要复杂 island 时，在这里加回 import react from '@astrojs/react' 与 react()。
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * dev server 不会为 public/ 下的目录解析 index.html，而 /demos/<name>/ 这种目录
 * 地址在生产（Vercel / 静态托管）是可用的。这里只在 dev 里补上 index.html，
 * 让两边行为一致，否则本地预览时嵌入的 demo 会是 404。
 */
/** @returns {import('vite').Plugin} */
function demoDirectoryIndex() {
  return {
    name: 'demo-directory-index',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && req.url.startsWith('/demos/') && req.url.endsWith('/')) {
          req.url += 'index.html';
        }
        next();
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://vibe-coding-personal-protfolio-webs.vercel.app',
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "zh",
        locales: {
          zh: "zh-CN",
          en: "en",
        },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss(), demoDirectoryIndex()],
  }
});