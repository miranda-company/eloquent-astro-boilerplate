# Footer 02

## Purpose and status

Footer 02 is a reusable, mobile-first marketing-site footer. It places brand identity, primary navigation, social destinations, configured legal links, and copyright in a compact two-row desktop composition that becomes one centered column on compact widths. It is available for internal pattern validation; client use still requires visual approval with final content.

## Design and implementation

- Reference: human-approved supplied image, “Captura de pantalla 2026-10-30 a las 8.52.47.png”
- Astro component: `src/components/site/Footer-02.astro`
- Social icons: decorative Lucide `Link` placeholders using `size-icon-md` (24px), approved only for this validation pattern

## Interface and defaults

`Footer-02.astro` accepts optional `pages`, `socialLinks`, `legalEntity`, and `showConsentPreferences` props. Page and social entries use `{ label, href }`. Empty page and social groups are omitted. The logo, legal navigation, legal entity, default footer pages, and default social links come from `siteConfig`.

```astro
---
import Footer02 from '../components/site/Footer-02.astro';
---

<Footer02
  pages={[{ label: 'Inicio', href: '/' }]}
  socialLinks={[{ label: 'Instagram', href: 'https://www.instagram.com/' }]}
  legalEntity="Nombre del cliente S.L."
  showConsentPreferences={siteConfig.features.consentBanner}
/>
```

## Implementation rules

Keep the semantic `<footer>`, logo link, labelled navigation lists, configured legal navigation, and copyright paragraph. Social links use their visible-to-assistive-technology `aria-label`; the placeholder SVG is decorative. Replace those placeholders with approved local brand assets before a client uses icon-only social links in production.

At compact widths, center and stack the logo, page links, social icons, legal links, and copyright. From `--lg`, use the horizontal desktop composition: logo, centered page navigation, social icons, then a bordered legal row. Use scoped BEM CSS and existing Figma tokens only. The optional Spanish `Gestionar cookies` control is a button outside legal navigation and retains `data-open-consent` for `ConsentManager.astro`.

## Verification

Review compact and `--lg` layouts with final client content. Confirm keyboard focus, readable link labels, logo dimensions, and legal/consent behavior. Update deterministic coverage for public behavior, then run `pnpm run verify` and `pnpm run test:e2e`.
