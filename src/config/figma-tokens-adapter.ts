import tokenSnapshot from './figma-tokens.json';
import { z } from 'zod';

const tokenValueSchema = z.union([z.string(), z.number()]);
const tokenSnapshotSchema = z.record(
  z.string(),
  z.record(z.string(), z.record(z.string(), tokenValueSchema)),
);
type TokenValue = z.infer<typeof tokenValueSchema>;
type TokenCollection = Record<string, Record<string, TokenValue>>;
type TokenSnapshot = Record<string, TokenCollection>;
type FontRole = 'title' | 'body';
type GoogleFontFamilies = Record<FontRole, string | readonly string[]>;

const tokens = tokenSnapshotSchema.parse(tokenSnapshot);

function cssName(name: string): string {
  return `--${name}`;
}

function collectionModes(collection: TokenCollection): string[] {
  return [...new Set(Object.values(collection).flatMap((values) => Object.keys(values)))];
}

function sortPrimitiveTokens(
  entries: [string, Record<string, TokenValue>][],
): [string, Record<string, TokenValue>][] {
  const paletteOrder = (name: string): number[] | undefined => {
    const neutral = name.match(/^color-neutral-(\d+)$/);
    if (neutral) return [0, 0, Number(neutral[1])];

    const palette = name.match(/^color-palette-(\d+)-(\d+)$/);
    if (palette) return [0, Number(palette[1]), Number(palette[2])];

    const accent = name.match(/^color-accent-(\d+)$/);
    if (accent) return [0, 4, Number(accent[1])];

    const size = name.match(/^size-(\d+(?:-\d+)?)$/);
    if (size) return [1, Number(size[1]!.replace('-', '.'))];

    const radius = name.match(/^radius-(sm|md|lg|xl|2xl|3xl)$/);
    if (radius) return [2, ['sm', 'md', 'lg', 'xl', '2xl', '3xl'].indexOf(radius[1]!)];

    return undefined;
  };

  return [...entries].sort(([left], [right]) => {
    const leftOrder = paletteOrder(left);
    const rightOrder = paletteOrder(right);
    if (!leftOrder || !rightOrder) return left.localeCompare(right, undefined, { numeric: true });

    for (let index = 0; index < Math.max(leftOrder.length, rightOrder.length); index += 1) {
      const difference = (leftOrder[index] ?? -1) - (rightOrder[index] ?? -1);
      if (difference) return difference;
    }
    return 0;
  });
}

function collectionName(name: string): string {
  const displayNames: Record<string, string> = {
    'font-tokens': 'Font tokens',
    primitives: 'Primitives',
    'color-tokens': 'Color tokens',
    'spacing-tokens': 'Spacing tokens',
    'global-size-tokens': 'Global size tokens',
  };
  return displayNames[name] ?? name;
}

function tokenType(name: string, value: TokenValue): 'COLOR' | 'FLOAT' | 'STRING' {
  if (typeof value === 'number') return 'FLOAT';
  if (name.startsWith('color-')) return 'COLOR';
  return 'STRING';
}

function cssValue(name: string, value: TokenValue): string {
  if (typeof value === 'number') {
    return name.startsWith('font-weight-') ? String(value) : `${value}px`;
  }
  if (name.startsWith('color-')) return value;
  return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
}

function declarationsForMode(collection: TokenCollection, mode: string): string[] {
  const entries =
    collection === tokens.primitives
      ? sortPrimitiveTokens(Object.entries(collection))
      : Object.entries(collection);
  return entries.map(([name, values]) => {
    const value = values[mode] ?? values[Object.keys(values)[0]!];
    if (value === undefined) throw new Error(`Missing value for Figma token: ${name} (${mode})`);
    return `${cssName(name)}: ${cssValue(name, value)};`;
  });
}

function declarationsForCollections(): string[] {
  return Object.entries(tokens).flatMap(([name, collection]) => {
    const mode =
      name === 'spacing-tokens' || name === 'font-tokens'
        ? 'mobile'
        : collectionModes(collection)[0];
    if (!mode) throw new Error('Figma token collection must contain at least one mode');
    return declarationsForMode(collection, mode);
  });
}

function spacingDeclarationsForMode(mode: 'tablet' | 'desktop'): string[] {
  const spacingCollection = tokens['spacing-tokens'];
  if (!spacingCollection) return [];

  return Object.entries(spacingCollection).map(([name, values]) => {
    const value = values[mode];
    if (value === undefined)
      throw new Error(`Missing ${mode} value for Figma spacing token: ${name}`);
    return `${cssName(`${name}-${mode}`)}: ${cssValue(name, value)};`;
  });
}

function fontDeclarationsForMode(mode: 'desktop'): string[] {
  const fontCollection = tokens['font-tokens'];
  if (!fontCollection) return [];

  return Object.entries(fontCollection).map(([name, values]) => {
    const value = values[mode];
    if (value === undefined) throw new Error(`Missing ${mode} value for Figma font token: ${name}`);
    return `${cssName(`${name}-${mode}`)}: ${cssValue(name, value)};`;
  });
}

export function getFigmaTokenStyles(): string {
  validateFigmaTokenSnapshot();

  return `:root {\n${[
    ...declarationsForCollections(),
    ...spacingDeclarationsForMode('tablet'),
    ...spacingDeclarationsForMode('desktop'),
    ...fontDeclarationsForMode('desktop'),
  ].join('\n')}\n}`;
}

export function getFigmaTokenCssVariableNames(): Set<string> {
  validateFigmaTokenSnapshot();

  const names = new Set<string>();
  for (const collection of Object.values(tokens)) {
    for (const name of Object.keys(collection)) names.add(cssName(name));
  }
  for (const name of Object.keys(tokens['spacing-tokens'] ?? {})) {
    names.add(cssName(`${name}-tablet`));
    names.add(cssName(`${name}-desktop`));
  }
  for (const name of Object.keys(tokens['font-tokens'] ?? {}))
    names.add(cssName(`${name}-desktop`));

  return names;
}

export function getFigmaTokenCollections() {
  return Object.entries(tokens).map(([name, collection]) => ({
    name: collectionName(name),
    modes: collectionModes(collection),
    variables: (name === 'primitives'
      ? sortPrimitiveTokens(Object.entries(collection))
      : Object.entries(collection)
    ).map(([tokenName, values]) => ({
      name: tokenName,
      type: tokenType(tokenName, Object.values(values)[0]!),
      modes: values,
    })),
  }));
}

export function getFigmaTokenSource(): string {
  return 'https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System';
}

export function getFigmaTokenCssName(name: string): string {
  return cssName(name);
}

function getFigmaFontFamilies(): GoogleFontFamilies {
  const fontTokens = tokens['font-tokens'];
  if (!fontTokens) throw new Error('Missing Figma font tokens');

  const familiesForRole = (role: FontRole): string[] => {
    const families = ['mobile', 'desktop'].map((mode) => fontTokens[`font-family-${role}`]?.[mode]);
    if (families.some((family) => typeof family !== 'string' || !family)) {
      throw new Error(`Missing Figma font family token: font-family-${role}`);
    }
    return families as string[];
  };

  return { title: familiesForRole('title'), body: familiesForRole('body') };
}

function getFigmaFontWeights(): number[] {
  const fontTokens = tokens['font-tokens'];
  if (!fontTokens) throw new Error('Missing Figma font tokens');

  const weights = Object.entries(fontTokens)
    .filter(([name]) => name.startsWith('font-weight-'))
    .flatMap(([, modes]) => [modes.mobile, modes.desktop])
    .filter((value): value is number => typeof value === 'number');
  if (weights.length === 0) throw new Error('Missing Figma font weight tokens');

  return [...new Set(weights)].sort((left, right) => left - right);
}

export function createGoogleFontsStylesheetUrl(
  families: GoogleFontFamilies,
  weights: number[],
): string {
  const uniqueFamilies = [...new Set(Object.values(families).flatMap((family) => family))];
  const uniqueWeights = [...new Set(weights)].sort((left, right) => left - right);

  if (uniqueWeights.length === 0) throw new Error('Google Fonts requires at least one weight');

  const params = new URLSearchParams({ display: 'swap' });
  for (const family of uniqueFamilies) {
    params.append('family', `${family}:wght@${uniqueWeights.join(';')}`);
  }
  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}

export function getGoogleFontsStylesheetUrl(): string {
  return createGoogleFontsStylesheetUrl(getFigmaFontFamilies(), getFigmaFontWeights());
}

export function validateFigmaTokenSnapshot(tokenSnapshot: TokenSnapshot = tokens): void {
  const cssNames = new Set<string>();

  for (const [collectionName, collection] of Object.entries(tokenSnapshot)) {
    if (Object.keys(collection).length === 0) {
      throw new Error(`Figma token collection is empty: ${collectionName}`);
    }

    for (const [name, values] of Object.entries(collection)) {
      if (!/^[a-z][a-z0-9-]*$/.test(name)) {
        throw new Error(`Invalid Figma token name: ${name}`);
      }
      if (cssNames.has(cssName(name))) {
        throw new Error(`Duplicate Figma token CSS name: ${cssName(name)}`);
      }
      cssNames.add(cssName(name));

      if (Object.keys(values).length === 0) {
        throw new Error(`Figma token has no mode values: ${name}`);
      }

      if (collectionName === 'spacing-tokens') {
        for (const mode of ['mobile', 'tablet', 'desktop']) {
          if (values[mode] === undefined) {
            throw new Error(`Missing ${mode} value for Figma spacing token: ${name}`);
          }
        }
      }

      if (collectionName === 'font-tokens') {
        for (const mode of ['mobile', 'desktop']) {
          if (values[mode] === undefined) {
            throw new Error(`Missing ${mode} value for Figma font token: ${name}`);
          }
        }
      }
    }
  }
}
