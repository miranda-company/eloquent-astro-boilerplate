import tokenSnapshot from './figma-tokens.json';
import { z } from 'zod';

const tokenValueSchema = z.union([z.string(), z.number()]);
const tokenSnapshotSchema = z.record(
  z.string(),
  z.record(z.string(), z.record(z.string(), tokenValueSchema)),
);
type TokenValue = z.infer<typeof tokenValueSchema>;
type TokenCollection = Record<string, Record<string, TokenValue>>;

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

    const spacing = name.match(/^spacing-(\d+)$/);
    if (spacing) return [1, Number(spacing[1] === '05' ? '0.5' : spacing[1])];

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
  return Object.values(tokens).flatMap((collection) => {
    const mode = collectionModes(collection)[0];
    if (!mode) throw new Error('Figma token collection must contain at least one mode');
    return declarationsForMode(collection, mode);
  });
}

export function getFigmaTokenStyles(): string {
  validateFigmaTokenSnapshot();

  const spacingCollection = tokens['spacing-tokens'];
  const mobileDeclarations = spacingCollection
    ? declarationsForMode(spacingCollection, 'mobile').join('\n')
    : '';

  return [
    `:root {\n${declarationsForCollections().join('\n')}\n}`,
    mobileDeclarations &&
      `@media (max-width: 37.5rem) {\n  :root {\n${mobileDeclarations
        .split('\n')
        .map((declaration) => `    ${declaration}`)
        .join('\n')}\n  }\n}`,
  ]
    .filter(Boolean)
    .join('\n');
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

export function validateFigmaTokenSnapshot(): void {
  const cssNames = new Set<string>();

  for (const [collectionName, collection] of Object.entries(tokens)) {
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
    }
  }
}
