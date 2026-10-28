import { describe, expect, it } from 'vitest';
import {
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

  it('contains the five Figma collections and all 128 variables', () => {
    const collections = getFigmaTokenCollections();

    expect(collections.map(({ name }) => name)).toEqual([
      'Font tokens',
      'Primitives',
      'Color tokens',
      'Spacing tokens',
      'Global size tokens',
    ]);
    expect(collections.reduce((count, collection) => count + collection.variables.length, 0)).toBe(
      128,
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
      modes: { desktop: 64, mobile: 32 },
    });
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
  });

  it('validates tokens and emits default and mobile CSS without activating dark mode', () => {
    expect(() => validateFigmaTokenSnapshot()).not.toThrow();

    const styles = getFigmaTokenStyles();
    expect(styles).toContain('--color-text-default: #222222;');
    expect(styles).not.toContain('data-theme');
    expect(styles).not.toContain('prefers-color-scheme');
    expect(styles).not.toContain('--color-text-default: #e5e5e5;');
    expect(styles).toContain('@media (max-width: 37.5rem)');
    expect(styles).toContain('--spacing-wrapper-default: 32px;');
    expect(styles).toContain('--font-family-body: "Helvetica Neue";');
    expect(styles).toContain('--font-weight-bold: 700;');
  });
});
