export const supportedLocales = ['es'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

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
    stickyHeader: boolean;
    backToTop: boolean;
    designSystemHomepage: boolean;
    wireframe: boolean;
  };
  navigation: Array<{ label: string; href: string }>;
  legal: {
    navigationLabel: string;
    tableOfContentsLabel: string;
    pages: Array<{ label: string; href: string }>;
  };
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
    analytics: false,
    contactForm: false,
    consentBanner: false,
    stickyHeader: true,
    backToTop: true,
    designSystemHomepage: true,
    wireframe: true,
  },
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Contacto', href: '/#contacto' },
  ],
  legal: {
    navigationLabel: 'Legal',
    tableOfContentsLabel: 'En esta página',
    pages: [
      { label: 'Aviso legal', href: '/aviso-legal/' },
      { label: 'Política de privacidad', href: '/politica-de-privacidad/' },
      { label: 'Política de cookies', href: '/politica-de-cookies/' },
    ],
  },
};
