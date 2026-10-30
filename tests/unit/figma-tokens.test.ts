import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createGoogleFontsStylesheetUrl,
  getFigmaTokenCssVariableNames,
  getFigmaTokenCollections,
  getFigmaTokenCssName,
  getFigmaTokenSource,
  getFigmaTokenStyles,
  validateFigmaTokenSnapshot,
} from '../../src/config/figma-tokens-adapter';

function getProductionCssVariableSources(directory: string): Map<string, string[]> {
  const sources = new Map<string, string[]>();

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      for (const [variable, files] of getProductionCssVariableSources(path))
        sources.set(variable, [...(sources.get(variable) ?? []), ...files]);
      continue;
    }
    if (!entry.isFile() || !/\.(astro|css|ts)$/.test(entry.name)) continue;

    const sourcePath = relative(process.cwd(), path);
    for (const match of readFileSync(path, 'utf8').matchAll(/var\((--[a-z0-9-]+)/g)) {
      const variable = match[1]!;
      sources.set(variable, [...(sources.get(variable) ?? []), sourcePath]);
    }
  }

  return sources;
}

describe('Figma design tokens', () => {
  it('uses the approved Figma file as the token source', () => {
    expect(getFigmaTokenSource()).toBe(
      'https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System',
    );
  });

  it('contains the required Figma collections', () => {
    const collections = getFigmaTokenCollections();

    expect(collections.map(({ name }) => name)).toEqual([
      'Font tokens',
      'Primitives',
      'Color tokens',
      'Spacing tokens',
      'Global size tokens',
    ]);
    expect(collections.every(({ variables }) => variables.length > 0)).toBe(true);
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

  it('orders primitive color palettes and dimensions by shade and size', () => {
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
      primitives.variables.filter(({ name }) => name.startsWith('size-')).map(({ name }) => name),
    ).toEqual([
      'size-0-5',
      'size-1',
      'size-2',
      'size-2-25',
      'size-3',
      'size-4',
      'size-5',
      'size-6',
      'size-7',
      'size-8',
      'size-9',
      'size-10',
      'size-11',
      'size-12',
      'size-13',
      'size-14',
      'size-15',
      'size-20',
      'size-30',
      'size-40',
    ]);
  });

  it('exports the approved accent, icon, and control token roles', () => {
    const collections = getFigmaTokenCollections();
    const colors = collections.find(({ name }) => name === 'Color tokens')!;
    const primitives = collections.find(({ name }) => name === 'Primitives')!;
    const globalSizes = collections.find(({ name }) => name === 'Global size tokens')!;
    const styles = getFigmaTokenStyles();

    expect(
      primitives.variables
        .filter(({ name }) => name.startsWith('color-accent-'))
        .map(({ name }) => name),
    ).toEqual([
      'color-accent-100',
      'color-accent-200',
      'color-accent-300',
      'color-accent-400',
      'color-accent-500',
      'color-accent-600',
      'color-accent-700',
      'color-accent-800',
      'color-accent-900',
    ]);
    expect(
      colors.variables
        .filter(({ name }) => name.startsWith('color-text-link-'))
        .map(({ name }) => name),
    ).toEqual(['color-text-link-default', 'color-text-link-hover', 'color-text-link-active']);
    expect(
      globalSizes.variables
        .filter(({ name }) => name.startsWith('size-icon-') || name.startsWith('size-control-'))
        .map(({ name, modes }) => [name, modes.desktop]),
    ).toEqual([
      ['size-icon-sm', 16],
      ['size-icon-md', 24],
      ['size-icon-lg', 32],
      ['size-control-sm', 32],
      ['size-control-md', 40],
      ['size-control-lg', 48],
    ]);
    expect(styles).toContain('--size-3: 24px;');
    expect(styles).toContain('--size-icon-md: 24px;');
    expect(styles).toContain('--size-control-md: 40px;');
  });

  it('ensures every production CSS variable reference is emitted by the Figma adapter', () => {
    const references = getProductionCssVariableSources(resolve(process.cwd(), 'src'));
    const emittedVariables = getFigmaTokenCssVariableNames();
    const missing = [...references]
      .filter(([variable]) => !emittedVariables.has(variable))
      .map(([variable, files]) => `${variable} (${[...new Set(files)].join(', ')})`);

    expect(missing).toEqual([]);
  });

  it('validates tokens and emits mobile base responsive values without activating dark mode', () => {
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
    expect(styles).toContain('--font-size-sm: 16px;');
    expect(styles).toContain('--font-size-sm-desktop: 12px;');
    expect(styles).toContain('--font-leading-lg: 24px;');
    expect(styles).toContain('--font-leading-lg-desktop: 24px;');
    const bodyFamily = getFigmaTokenCollections()
      .find(({ name }) => name === 'Font tokens')!
      .variables.find(({ name }) => name === 'font-family-body')!.modes.desktop;
    expect(typeof bodyFamily).toBe('string');
    expect(styles).toContain(`--font-family-body: "${bodyFamily}";`);
    expect(styles).toContain('--font-weight-bold: 700;');
    expect(styles).toContain('--font-weight-bold-desktop: 700;');
  });

  it('rejects incomplete responsive typography modes', () => {
    expect(() =>
      validateFigmaTokenSnapshot({
        'font-tokens': {
          'font-size-test': { mobile: 16 },
        },
      }),
    ).toThrow('Missing desktop value for Figma font token: font-size-test');
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
      createGoogleFontsStylesheetUrl(
        { title: ['DM Sans', 'Google Sans Flex'], body: 'IBM Plex Mono' },
        [400, 700],
      ),
    );
    expect(distinctFamiliesUrl.searchParams.getAll('family')).toEqual([
      'DM Sans:wght@400;700',
      'Google Sans Flex:wght@400;700',
      'IBM Plex Mono:wght@400;700',
    ]);
  });
});
