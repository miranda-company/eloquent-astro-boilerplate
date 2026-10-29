# Footer 01

## Purpose and status

Footer 01 is a reusable responsive footer pattern for marketing sites. It groups brand context, optional primary navigation and social links, contact details, and configured legal links. Its initial implementation is available for use; visual approval against client-specific content and target viewports remains required.

## Design and implementation

- Figma: [Footer-01](https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System?node-id=99-47&m=dev)
- Astro component: `src/components/site/Footer-01.astro`
- Local assets: `public/images/footer-01/contact-email.svg`, `contact-phone.svg`, and `contact-location.svg`

## Interface and defaults

`Footer-01.astro` accepts optional `title`, `description`, `pages`, `socialLinks`, `phone`, `address`, and `legalEntity` props. `pages` and `socialLinks` use `{ label, href }` entries.

The component reads the logo, email, legal navigation, and default legal entity from `siteConfig`. Social links default to `siteConfig.social`, and the phone defaults to `siteConfig.contact.phone`. Empty page and social-link groups are omitted rather than rendered as placeholders.

```astro
---
import Footer01 from '../components/site/Footer-01.astro';
---

<Footer01
  title="Un pie de página claro y útil."
  description="Una breve introducción para orientar a las personas visitantes."
  pages={[{ label: 'Inicio', href: '/' }]}
  socialLinks={[{ label: 'LinkedIn', href: 'https://www.linkedin.com/' }]}
  phone="+34 600 000 000"
  address="Calle de ejemplo, 123 · Madrid"
  legalEntity="Nombre del cliente S.L."
/>
```

## Implementation rules

Keep the semantic `<footer>`, navigation lists, and contact `<address>` intact. The logo and contact icons are meaningful asset slots; retain their configured or intrinsic dimensions and use the local public assets. Keep visual labels in the configured site locale.

Use the component's scoped BEM styles and Figma-derived tokens. The outer footer uses `spacing-xl` and stacks through the shared `--xl` alias. Through the mobile and `--sm` ranges, the page, social, and contact groups form one column. From `--md` upward, they stay in three columns. At `--xl` and above, the wrapper becomes a 35% identity column and a 65% content column while retaining those three groups.

Below `--xl`, the information area has a top standard border with `spacing-lg` vertical padding; the legal row has its own standard top border and `spacing-md` vertical padding. At `--xl` and above, the information-area border and top padding are removed, and the identity/content bottom padding clears. Contact values must retain their safe wrapping behavior for long email addresses and physical addresses. Keep responsive breakpoint aliases in authored CSS, not client configuration.

## Verification

Review the footer at compact, medium, expanded, large, and extra-large widths. Confirm keyboard focus, link destinations, readable contact details, legal navigation, and correct logo/icon geometry. Update deterministic browser coverage when its rendered structure or responsive behavior changes, then run `pnpm run verify` and `pnpm run test:e2e`.
