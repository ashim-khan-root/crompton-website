import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cromptonqatar.com',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      // `/` is a redirect to `/en/`, not content. A sitemap entry that 301s is a
      // crawl signal pointing at nothing. The 404 is excluded for the same reason.
      filter: (page) => {
        const { pathname } = new URL(page);
        return pathname !== '/' && pathname !== '/404/';
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    ssr: {
      noExternal: ['lucide-react'],
    },
  },
});
