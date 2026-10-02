import { describe, expect, it } from 'vitest';
import {
  resolveColorReference,
  resolveSemanticColors,
  siteConfig,
} from '../../src/config/site.config';

describe('site configuration', () => {
  it('uses the configured default locale and a valid canonical URL', () => {
    expect(siteConfig.defaultLocale).toBe('es');
    expect(new URL(siteConfig.url).protocol).toMatch(/^https?:$/);
  });

  it('defines SVG paths for the configurable brand assets', () => {
    expect(siteConfig.brand.logo).toMatch(/\.svg$/);
    expect(siteConfig.brand.icon).toMatch(/\.svg$/);
    expect(siteConfig.brand.logoWidth).toBeGreaterThan(0);
    expect(siteConfig.brand.logoHeight).toBeGreaterThan(0);
    expect(siteConfig.brand.iconWidth).toBeGreaterThan(0);
    expect(siteConfig.brand.iconHeight).toBeGreaterThan(0);
  });

  it('defines every required semantic theme token', () => {
    expect(Object.values(siteConfig.theme).every(Boolean)).toBe(true);
  });

  it('resolves semantic roles from the configured manual palettes', () => {
    const colors = resolveSemanticColors(siteConfig.colors);

    expect(colors.primary).toBe('#1f4d3d');
    expect(colors.background).toBe('#fcfbf7');
    expect(colors.error).toBe('#b42318');
  });

  it('does not require optional tertiary or quaternary colours', () => {
    const colors = resolveSemanticColors(siteConfig.colors);

    expect(siteConfig.colors.palettes.tertiary).toBeUndefined();
    expect(siteConfig.colors.palettes.quaternary).toBeUndefined();
    expect(colors.tertiary).toBeUndefined();
    expect(colors.quaternary).toBeUndefined();
  });

  it('rejects references to a missing palette shade', () => {
    expect(() =>
      resolveColorReference(siteConfig.colors, { palette: 'primary', shade: '999' }),
    ).toThrow('Missing color token: primary.999');
  });

  it('defines a configurable wireframe mode', () => {
    expect(typeof siteConfig.features.wireframe).toBe('boolean');
  });
});
