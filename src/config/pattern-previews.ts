import type { FooterLink } from '../components/site/Footer-01.astro';
import type { Footer02Link } from '../components/site/Footer-02.astro';

export type PatternPreview =
  | {
      slug: 'footer-01';
      name: string;
      description: string;
      props: {
        title: string;
        description: string;
        pages: FooterLink[];
        socialLinks: FooterLink[];
        phone: string;
        address: string;
        legalEntity: string;
      };
    }
  | {
      slug: 'footer-02';
      name: string;
      description: string;
      props: {
        pages: Footer02Link[];
        socialLinks: Footer02Link[];
        legalEntity: string;
      };
    };

export const patternPreviews: PatternPreview[] = [
  {
    slug: 'footer-01',
    name: 'Footer 01',
    description: 'Responsive brand, navigation, contact, and legal footer.',
    props: {
      title: 'Diseñamos marcas y productos digitales con claridad.',
      description: 'Estrategia, diseño y desarrollo para proyectos con ambición.',
      pages: [
        { label: 'Inicio', href: '/' },
        { label: 'Servicios', href: '/servicios/' },
        { label: 'Proyectos', href: '/proyectos/' },
        { label: 'Sobre nosotros', href: '/sobre-nosotros/' },
      ],
      socialLinks: [
        { label: 'Instagram', href: 'https://www.instagram.com/' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        { label: 'Behance', href: 'https://www.behance.net/' },
      ],
      phone: '+34 600 000 000',
      address: 'Calle de ejemplo, 123 · Madrid',
      legalEntity: 'Nombre del cliente S.L.',
    },
  },
  {
    slug: 'footer-02',
    name: 'Footer 02',
    description: 'Responsive compact footer with navigation, social links, and legal links.',
    props: {
      pages: [
        { label: 'Inicio', href: '/' },
        { label: 'Servicios', href: '/servicios/' },
        { label: 'Proyectos', href: '/proyectos/' },
        { label: 'Sobre nosotros', href: '/sobre-nosotros/' },
        { label: 'Contacto', href: '/contacto/' },
      ],
      socialLinks: [
        { label: 'Facebook', href: 'https://www.facebook.com/' },
        { label: 'Instagram', href: 'https://www.instagram.com/' },
        { label: 'X', href: 'https://x.com/' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        { label: 'YouTube', href: 'https://www.youtube.com/' },
      ],
      legalEntity: 'Nombre del cliente S.L.',
    },
  },
];
