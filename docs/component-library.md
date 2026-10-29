# Reusable component patterns

The component library is a small set of semantic Astro modules that make approved, repeated page patterns faster to assemble without hiding their content or design decisions. Components use authored BEM CSS and the semantic custom properties documented in [design-system.md](design-system.md).

## Figma relationship

The current visual source is the [Figma Design System project](https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System?node-id=0-1&t=OgKJWWi7p2SpP6WS-1). Figma is the human-reviewed design reference; implementation is maintained in Astro and CSS. This workflow does not generate production code from Figma or automatically sync tokens.

For every approved pattern, record a direct Figma frame/component URL, its design approval status, the owning design contact, and the implementation below. The supplied link currently points to the general design-system page, not a specific hero frame. Add the approved frame link when the designer identifies it; do not claim pixel-level parity until it has been reviewed at the target viewports.

| Pattern           | Figma reference                                                                                                                                             | Astro implementation                          | Content interface                                                                                                       | Status                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Marketing hero    | [Design-system file](https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System?node-id=0-1&t=OgKJWWi7p2SpP6WS-1); specific approved hero frame: TBD | `src/components/site/MarketingHero.astro`     | Required title; optional eyebrow, description, action, and heading level                                                | Initial implementation; visual approval pending   |
| Homepage features | Figma frame: TBD                                                                                                                                            | `src/components/site/MarketingFeatures.astro` | Required section title and feature title/description pairs                                                              | Existing starter pattern; visual approval pending |
| Footer 01         | [Footer-01](https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System?node-id=99-47&m=dev)                                                          | `src/components/site/Footer-01.astro`         | Configured brand, contact and legal details; optional title, description, page, social, address, and legal-entity props | Initial implementation; visual approval pending   |

## First pattern: marketing hero

Import the Astro module in MDX and provide content as props:

```mdx
import MarketingHero from '../../../components/site/MarketingHero.astro';

<MarketingHero
  eyebrow="Estudio independiente"
  title="Una propuesta clara, pensada para las personas."
  description="Describe the offer in a short, useful sentence."
  action={{ label: 'Cuéntanos tu idea', href: '#contacto' }}
/>
```

The title is required. Use `headingLevel={1}` (the default) for the page's one `h1`; use `headingLevel={2}` only when the page already has its `h1` and the hero is a subordinate section. The eyebrow, description, and action are optional. The action is a link, so its `href` must be a valid route or in-page destination. Keep public site copy in Spanish unless the approved locale strategy changes.

The module owns its section markup and BEM styles. It consumes Figma semantic color roles and shared spacing variables, and uses the existing shared primary button treatment. Do not add client-specific palette values, layout classes, or page copy to the implementation.

## Homepage feature grid

The starter homepage uses `MarketingFeatures.astro` for a three-card feature section. Its interface accepts a section `title` and an array of feature `title`/`description` pairs. The module owns its section layout and card styles; keep the actual copy in the MDX page. Its current presentation is a starter example and still needs a direct approved Figma frame before claiming design parity.

## Footer 01

`Footer-01.astro` is a reusable footer pattern, distinct from the starter's existing shared footer. It uses configured brand, contact, and legal data by default. Supply its optional props for client-specific marketing copy, primary-page links, social links, a phone number, an address, or a legal-entity name. It intentionally omits empty navigation groups rather than rendering placeholder links.

The three contact icons are final Figma assets in `public/images/footer-01/`. Keep them local and retain their intrinsic SVG dimensions. The component uses native navigation, list, and address semantics; its visual labels are Spanish to match the starter locale.

## Adding or changing a pattern

1. Identify the real repeated content/design need; do not add variants speculatively.
2. Link the approved Figma frame/component and record its design owner and review status in the table above.
3. Define the smallest typed content interface that covers the intended use. Keep page copy and client identity in content/configuration, not in the reusable module.
4. Use semantic HTML and an explicit content contract. A caller should not need to know internal layout or styling details.
5. Use BEM classes, Figma-derived CSS custom properties, and the available spacing/shape variables. Use the shared `.stack` primitive for vertical flex groups that need the default gutter gap; keep other layout and spacing choices component-specific. Keep component-specific CSS with the Astro module and import genuinely shared styles such as buttons from their dedicated stylesheet; reserve `src/styles/global.css` for document-wide foundations and shared layout.
6. Review the implementation with design at compact, medium, expanded, large, and extra-large widths. Verify keyboard, focus, heading hierarchy, contrast, and reduced-motion requirements where relevant.
7. Add deterministic tests for externally visible behavior and styles. Update this catalog and [design-system.md](design-system.md) when the token model or conventions change.

The design-system preview is the local visual reference for tokens and patterns. Keep it no-index and excluded from the sitemap. Use [client setup](client-setup.md) to move it when the public homepage is ready.
