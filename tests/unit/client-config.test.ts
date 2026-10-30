import { describe, expect, it } from 'vitest';
import { siteConfig } from '../../src/config/client-config';

describe('site configuration', () => {
  it('uses the configured default locale and a valid canonical URL', () => {
    expect(siteConfig.defaultLocale).toBe('es');
    expect(new URL(siteConfig.url).protocol).toMatch(/^https?:$/);
  });

  it('defines supported paths for the configurable brand assets', () => {
    expect(siteConfig.brand.logo).toMatch(/\.(svg|png|jpe?g)$/);
    expect(siteConfig.brand.icon).toMatch(/\.(svg|png|jpe?g)$/);
    expect(siteConfig.brand.logoWidth).toBeGreaterThan(0);
    expect(siteConfig.brand.logoHeight).toBeGreaterThan(0);
    expect(siteConfig.brand.iconWidth).toBeGreaterThan(0);
    expect(siteConfig.brand.iconHeight).toBeGreaterThan(0);
  });

  it('defines a configurable wireframe mode', () => {
    expect(typeof siteConfig.features.wireframe).toBe('boolean');
  });

  it('keeps optional integrations disabled until a client approves them', () => {
    expect(siteConfig.features.analytics).toBe(false);
    expect(siteConfig.features.contactForm).toBe(false);
    expect(siteConfig.features.consentBanner).toBe(false);
    expect(siteConfig.features.stickyHeader).toBe(true);
    expect(siteConfig.features.backToTop).toBe(true);
  });

  it('configures the shared legal navigation in one place', () => {
    expect(siteConfig.legal.pages).toHaveLength(3);
    expect(siteConfig.legal.pages.every((page) => page.href.startsWith('/'))).toBe(true);
    expect(siteConfig.legal.tableOfContentsLabel).toBe('En esta página');
  });
});
