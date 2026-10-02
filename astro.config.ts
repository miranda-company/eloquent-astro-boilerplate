import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';
import { siteConfig } from './src/config/site.config';

export default defineConfig({
  output: 'static',
  site: siteConfig.url,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return (
          pathname !== '/design-system/' &&
          !(siteConfig.features.designSystemHomepage && pathname === '/')
        );
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_FORM_ENDPOINT: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_GA_MEASUREMENT_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_GTM_CONTAINER_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },
});
