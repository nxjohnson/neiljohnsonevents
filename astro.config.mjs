// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.neiljohnsonevents.com',

  // Preserve the original Squarespace home-page slug → redirect it to the root.
  redirects: {
    '/neil-johnson-events-los-angeles-county-wedding-and-event-photographer': '/',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare(),
  integrations: [sitemap(), react()]
});