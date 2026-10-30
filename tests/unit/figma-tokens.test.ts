import { describe, expect, it } from 'vitest';
import {
  createGoogleFontsStylesheetUrl,
  getFigmaTokenCollections,
  getFigmaTokenCssName,
  getFigmaTokenSource,
  getFigmaTokenStyles,
  validateFigmaTokenSnapshot,
} from '../../src/config/figma-tokens-adapter';

describe('Figma design tokens', () => {
  it('uses the approved Figma file as the token source', () => {
    expect(getFigmaTokenSource()).toBe(
      'https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System',
    );
  });

  it('contains the five Figma collections and all 137 variables', () => {
    const collections = getFigmaTokenCollections();

    expect(collections.map(({ name }) => name)).toEqual([
      'Font tokens',
      'Primitives',
      'Color tokens',
      'Spacing tokens',
      'Global size tokens',
    ]);
    expect(collections.reduce((count, collection) => count + collection.variables.length, 0)).toBe(
      137,
    );
  });

  it('uses exported token names directly and preserves mode values', () => {
    const collections = getFigmaTokenCollections();
    const fontTokens = collections.find(({ name }) => name === 'Font tokens')!;
    const colors = collections.find(({ name }) => name === 'Color tokens')!;
    const spacing = collections.find(({ name }) => name === 'Spacing tokens')!;

    expect(getFigmaTokenCssName('font-family-title')).toBe('--font-family-title');
    expect(fontTokens.variables.find(({ name }) => name === 'font-size-md')).toMatchObject({
      type: 'FLOAT',
      modes: { desktop: 18 },
    });

    expect(colors.variables.find(({ name }) => name === 'color-text-default')).toMatchObject({
      type: 'COLOR',
      modes: { 'light-mode': '#222222', 'dark-mode': '#e5e5e5' },
    });
    expect(spacing.variables.find(({ name }) => name === 'spacing-wrapper-default')).toMatchObject({
      modes: { desktop: 64, mobile: 18, tablet: 32 },
    });
  });

  it('emits the Figma border-size tokens for non-wire borders', () => {
    const globalSizes = getFigmaTokenCollections().find(
      ({ name }) => name === 'Global size tokens',
    )!;

    expect(
      globalSizes.variables
        .filter(({ name }) => name.startsWith('border-size-'))
        .map(({ name, modes }) => [name, modes.desktop]),
    ).toEqual([
      ['border-size-sm', 1],
      ['border-size-md', 2],
      ['border-size-lg', 4],
      ['border-size-xl', 8],
    ]);

    const styles = getFigmaTokenStyles();
    expect(styles).toContain('--border-size-sm: 1px;');
    expect(styles).toContain('--border-size-md: 2px;');
    expect(styles).toContain('--border-size-lg: 4px;');
    expect(styles).toContain('--border-size-xl: 8px;');
  });

  it('orders primitive color palettes by palette and shade', () => {
    const primitives = getFigmaTokenCollections().find(({ name }) => name === 'Primitives')!;
    const paletteNames = primitives.variables
      .map(({ name }) => name)
      .filter((name) => name.startsWith('color-palette-'));

    expect(paletteNames).toEqual(
      [1, 2, 3].flatMap((palette) =>
        [100, 200, 300, 400, 500, 600, 700, 800, 900].map(
          (shade) => `color-palette-${palette}-${shade}`,
        ),
      ),
    );
    expect(
      primitives.variables
        .filter(({ name }) => name.startsWith('spacing-'))
        .map(({ name }) => name),
    ).toEqual([
      'spacing-0-5',
      'spacing-1',
      'spacing-2',
      'spacing-2-25',
      'spacing-3',
      'spacing-4',
      'spacing-5',
      'spacing-6',
      'spacing-7',
      'spacing-8',
      'spacing-9',
      'spacing-10',
      'spacing-11',
      'spacing-12',
      'spacing-13',
      'spacing-14',
      'spacing-15',
      'spacing-20',
      'spacing-30',
      'spacing-40',
    ]);
  });

  it('validates tokens and emits mobile base spacing with tablet and desktop values without activating dark mode', () => {
    expect(() => validateFigmaTokenSnapshot()).not.toThrow();

    const styles = getFigmaTokenStyles();
    expect(styles).toContain('--color-text-default: #222222;');
    expect(styles).not.toContain('data-theme');
    expect(styles).not.toContain('prefers-color-scheme');
    expect(styles).not.toContain('--color-text-default: #e5e5e5;');
    expect(styles).not.toContain('@media');
    expect(styles).toContain('--spacing-wrapper-default: 18px;');
    expect(styles).toContain('--spacing-wrapper-default-tablet: 32px;');
    expect(styles).toContain('--spacing-wrapper-default-desktop: 64px;');
    const bodyFamily = getFigmaTokenCollections()
      .find(({ name }) => name === 'Font tokens')!
      .variables.find(({ name }) => name === 'font-family-body')!.modes.desktop;
    expect(typeof bodyFamily).toBe('string');
    expect(styles).toContain(`--font-family-body: "${bodyFamily}";`);
    expect(styles).toContain('--font-weight-bold: 700;');
  });

  it('builds a deduplicated Google Fonts request from Figma font weights', () => {
    const sameFamilyUrl = new URL(
      createGoogleFontsStylesheetUrl(
        { title: 'IBM Plex Mono', body: 'IBM Plex Mono' },
        [700, 400, 700, 100, 900],
      ),
    );
    expect(sameFamilyUrl.searchParams.getAll('family')).toEqual([
      'IBM Plex Mono:wght@100;400;700;900',
    ]);
    expect(sameFamilyUrl.searchParams.get('display')).toBe('swap');

    const distinctFamiliesUrl = new URL(
      createGoogleFontsStylesheetUrl({ title: 'DM Sans', body: 'IBM Plex Mono' }, [400, 700]),
    );
    expect(distinctFamiliesUrl.searchParams.getAll('family')).toEqual([
      'DM Sans:wght@400;700',
      'IBM Plex Mono:wght@400;700',
    ]);
  });
});
