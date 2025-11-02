import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { siteConfig } from './src/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: siteConfig.site,
  integrations: [tailwind(), sitemap()],
  markdown: {
    remarkPlugins: [
      remarkMath,
    ],
    rehypePlugins: [
      [rehypePrettyCode, {
        theme: {
          light: 'github-light',
          dark: 'github-dark',
        },
        onVisitLine(node) {
          if (node.children.length === 0) {
            node.children = [{type: 'text', value: ' '}];
          }
        },
      }],
      rehypeKatex,
    ],
  },
});