export const supportedLocales = ['es'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

type ThemeToken =
  | 'font-sans'
  | 'radius-none'
  | 'radius-xs'
  | 'radius-sm'
  | 'radius-md'
  | 'radius-lg'
  | 'radius-xl'
  | 'radius-full'
  | 'space-1'
  | 'space-2'
  | 'space-3'
  | 'space-4'
  | 'space-6'
  | 'space-8'
  | 'space-12'
  | 'space-16'
  | 'space-24'
  | 'space-section'
  | 'size-icon'
  | 'size-control'
  | 'container-max'
  | 'shadow-0'
  | 'shadow-1'
  | 'shadow-2'
  | 'shadow-3'
  | 'shadow-4'
  | 'shadow-6'
  | 'shadow-8'
  | 'shadow-12'
  | 'shadow-16'
  | 'shadow-24';

export const requiredSemanticColorTokens = [
  'background',
  'foreground',
  'muted',
  'surface',
  'border',
  'primary',
  'on-primary',
  'primary-hover',
  'secondary',
  'on-secondary',
  'accent',
  'error',
  'on-error',
] as const;
export const optionalSemanticColorTokens = ['tertiary', 'quaternary'] as const;
export const semanticColorTokens = [
  ...requiredSemanticColorTokens,
  ...optionalSemanticColorTokens,
] as const;
export type RequiredSemanticColorToken = (typeof requiredSemanticColorTokens)[number];
export type OptionalSemanticColorToken = (typeof optionalSemanticColorTokens)[number];
export type SemanticColorToken = (typeof semanticColorTokens)[number];
export type ColorPalette = Record<string, string>;
export type ColorReference = { palette: string; shade: string };
export type SemanticColorMap = Record<RequiredSemanticColorToken, ColorReference> &
  Partial<Record<OptionalSemanticColorToken, ColorReference>>;
export type ResolvedSemanticColors = Record<RequiredSemanticColorToken, string> &
  Partial<Record<OptionalSemanticColorToken, string>>;

export interface ColorSystem {
  palettes: Record<string, ColorPalette>;
  semantic: SemanticColorMap;
}

export interface SiteConfig {
  name: string;
  url: string;
  brand: {
    logo: string;
    logoWidth: number;
    logoHeight: number;
    icon: string;
    iconWidth: number;
    iconHeight: number;
  };
  defaultLocale: SupportedLocale;
  contact: { email: string; phone?: string };
  social: Record<string, string>;
  seo: { defaultTitle: string; defaultDescription: string; defaultOgImage?: string };
  features: {
    analytics: boolean;
    contactForm: boolean;
    consentBanner: boolean;
    designSystemHomepage: boolean;
    wireframe: boolean;
  };
  navigation: Array<{ label: string; href: string }>;
  colors: ColorSystem;
  theme: Record<ThemeToken, string>;
}

export function resolveColorReference(colors: ColorSystem, reference: ColorReference): string {
  const palette = colors.palettes[reference.palette];
  const value = palette?.[reference.shade];
  if (!value) throw new Error(`Missing color token: ${reference.palette}.${reference.shade}`);
  return value;
}

export function resolveSemanticColors(colors: ColorSystem): ResolvedSemanticColors {
  return Object.fromEntries(
    Object.entries(colors.semantic).map(([token, reference]) => [
      token,
      resolveColorReference(colors, reference),
    ]),
  ) as ResolvedSemanticColors;
}

export const siteConfig: SiteConfig = {
  name: 'Nombre del cliente',
  url: 'https://example.com',
  brand: {
    logo: '/brand/brand-logo.svg',
    logoWidth: 1620,
    logoHeight: 359,
    icon: '/brand/brand-icon.svg',
    iconWidth: 480,
    iconHeight: 480,
  },
  defaultLocale: 'es',
  contact: { email: 'hola@example.com' },
  social: {},
  seo: {
    defaultTitle: 'Nombre del cliente',
    defaultDescription: 'Una descripción breve y clara del sitio web.',
  },
  features: {
    analytics: true,
    contactForm: true,
    consentBanner: true,
    designSystemHomepage: true,
    wireframe: true,
  },
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Contacto', href: '/#contacto' },
  ],
  colors: {
    palettes: {
      primary: {
        '100': '#d1eee5',
        '200': '#a4dccc',
        '300': '#76c9b1',
        '400': '#48a894',
        '500': '#1f4d3d',
        '600': '#173c31',
        '700': '#0f2b23',
        '800': '#091c17',
        '900': '#04110e',
      },
      secondary: {
        '100': '#fff3d6',
        '200': '#ffe4a8',
        '300': '#ffd276',
        '400': '#f9c45b',
        '500': '#f2b544',
        '600': '#c98e20',
        '700': '#9b6a11',
        '800': '#6c4808',
        '900': '#3d2600',
      },
      accent: {
        '100': '#eeeefe',
        '200': '#d9dafa',
        '300': '#bdc0f4',
        '400': '#999dec',
        '500': '#7579df',
        '600': '#5659c7',
        '700': '#41449e',
        '800': '#2d2f75',
        '900': '#1c1d4b',
      },
      neutral: {
        '100': '#fcfbf7',
        '200': '#e9e7e0',
        '300': '#d4d1c9',
        '400': '#aaa79f',
        '500': '#817e77',
        '600': '#605e59',
        '700': '#44423f',
        '800': '#2d2b29',
        '900': '#1c1c1a',
      },
      black: { base: '#000000' },
      white: { base: '#ffffff' },
      danger: {
        '100': '#fee4e2',
        '200': '#fecdca',
        '300': '#fda29b',
        '400': '#f97066',
        '500': '#f04438',
        '600': '#b42318',
        '700': '#912018',
        '800': '#7a271a',
        '900': '#55160c',
      },
    },
    semantic: {
      background: { palette: 'neutral', shade: '100' },
      foreground: { palette: 'neutral', shade: '900' },
      muted: { palette: 'neutral', shade: '200' },
      surface: { palette: 'white', shade: 'base' },
      border: { palette: 'neutral', shade: '300' },
      primary: { palette: 'primary', shade: '500' },
      'on-primary': { palette: 'white', shade: 'base' },
      'primary-hover': { palette: 'primary', shade: '600' },
      secondary: { palette: 'secondary', shade: '500' },
      'on-secondary': { palette: 'neutral', shade: '900' },
      accent: { palette: 'accent', shade: '500' },
      error: { palette: 'danger', shade: '600' },
      'on-error': { palette: 'white', shade: 'base' },
    },
  },
  theme: {
    'font-sans': 'ui-sans-serif, system-ui, sans-serif',
    'radius-none': '0',
    'radius-xs': '0.25rem',
    'radius-sm': '0.5rem',
    'radius-md': '0.75rem',
    'radius-lg': '1rem',
    'radius-xl': '1.5rem',
    'radius-full': '9999px',
    'space-1': '0.25rem',
    'space-2': '0.5rem',
    'space-3': '0.75rem',
    'space-4': '1rem',
    'space-6': '1.5rem',
    'space-8': '2rem',
    'space-12': '3rem',
    'space-16': '4rem',
    'space-24': '6rem',
    'space-section': 'clamp(4rem, 9vw, 8rem)',
    'size-icon': '1.5rem',
    'size-control': '2.75rem',
    'container-max': '1440px',
    'shadow-0': 'none',
    'shadow-1': '0 1px 2px rgb(0 0 0 / 8%), 0 1px 3px rgb(0 0 0 / 6%)',
    'shadow-2': '0 1px 3px rgb(0 0 0 / 10%), 0 2px 4px rgb(0 0 0 / 8%)',
    'shadow-3': '0 2px 4px rgb(0 0 0 / 10%), 0 3px 6px rgb(0 0 0 / 8%)',
    'shadow-4': '0 2px 6px rgb(0 0 0 / 12%), 0 4px 8px rgb(0 0 0 / 9%)',
    'shadow-6': '0 3px 8px rgb(0 0 0 / 14%), 0 6px 12px rgb(0 0 0 / 10%)',
    'shadow-8': '0 4px 10px rgb(0 0 0 / 14%), 0 8px 16px rgb(0 0 0 / 10%)',
    'shadow-12': '0 6px 16px rgb(0 0 0 / 16%), 0 12px 24px rgb(0 0 0 / 12%)',
    'shadow-16': '0 8px 20px rgb(0 0 0 / 18%), 0 16px 32px rgb(0 0 0 / 14%)',
    'shadow-24': '0 12px 28px rgb(0 0 0 / 20%), 0 24px 48px rgb(0 0 0 / 16%)',
  },
};
