import type { APIRoute } from 'astro';
import { siteConfig } from '../config/client-config';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nSitemap: ${siteConfig.url}/sitemap-index.xml\n`);
