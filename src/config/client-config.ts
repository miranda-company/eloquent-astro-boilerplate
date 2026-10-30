export const supportedLocales = ['es'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export interface SiteLink {
  label: string;
  href: string;
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
  contact: { email: string; phone?: string; address?: string };
  navigation: { header: SiteLink[]; footer: SiteLink[] };
  social: SiteLink[];
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
  legal: {
    entityName: string;
    navigationLabel: string;
    tableOfContentsLabel: string;
    pages: SiteLink[];
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
  contact: {
    email: 'hola@example.com',
    phone: '+34 600 000 000',
    address: 'Calle de ejemplo, 123 · Madrid',
  },
  navigation: {
    header: [
      { label: 'Inicio', href: '/' },
      { label: 'Servicios', href: '/servicios/' },
      { label: 'Proyectos', href: '/proyectos/' },
      { label: 'Sobre nosotros', href: '/sobre-nosotros/' },
      { label: 'Contacto', href: '#contacto' },
    ],
    footer: [
      { label: 'Inicio', href: '/' },
      { label: 'Servicios', href: '/servicios/' },
      { label: 'Proyectos', href: '/proyectos/' },
      { label: 'Sobre nosotros', href: '/sobre-nosotros/' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'X', href: 'https://x.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'YouTube', href: 'https://www.youtube.com/' },
  ],
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
  legal: {
    entityName: 'Nombre del cliente S.L.',
    navigationLabel: 'Legal',
    tableOfContentsLabel: 'En esta página',
    pages: [
      { label: 'Aviso legal', href: '/aviso-legal/' },
      { label: 'Política de privacidad', href: '/politica-de-privacidad/' },
      { label: 'Política de cookies', href: '/politica-de-cookies/' },
    ],
  },
};
