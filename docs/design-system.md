# Design system

The design system is deliberately small, semantic, and client-configurable. Its job is to let a client rebrand the site by editing a few well-defined values, without changing component markup.

The internal design-system preview is the root page while this boilerplate is being prepared. It is `noindex, nofollow` and excluded from the sitemap. Move it to `/design-system` when the client homepage is ready; the exact procedure is in [client setup](client-setup.md).

Reusable page patterns are catalogued in [component-library.md](component-library.md), which maps each Astro implementation to its approved Figma reference, content interface, and verification. The current [Figma Design System project](https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System?node-id=0-1&t=OgKJWWi7p2SpP6WS-1) is the visual reference; implementation and approval remain human-reviewed.

## Source of truth

| Concern                                                                                                                   | Source                                          | Why it belongs there                                           |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| Client identity, raw palettes, semantic colour mappings, typography, spacing, size, wrapper, radius, and elevation values | `src/config/site.config.ts`                     | Typed, client-specific runtime configuration                   |
| Token fallbacks, reset/base rules, global focus, wrapper/section layout, and shared motion timing                         | `src/styles/global.css`                         | Rules apply across the document and define shared layout       |
| Shared button variants                                                                                                    | `src/styles/button.css`                         | One imported stylesheet keeps common button treatments aligned |
| Component markup and component-specific styles                                                                            | `src/components/` and owning page modules       | Changes stay local to the markup and interface they affect     |
| Visual reference                                                                                                          | `src/components/site/DesignSystemPreview.astro` | Renders the configured system for review                       |
| Motion behavior and GSAP/ScrollTrigger usage                                                                              | `docs/animation.md`                             | Motion remains optional, local, and accessible                 |

`BaseLayout.astro` resolves semantic colour references and emits the configured CSS custom properties on the document root. `global.css` provides fallback values; shared and component styles consume semantic variables directly.

## Colour system

Colours have two layers in `siteConfig.colors`.

1. `palettes` is the raw inventory. Add, remove, or rename client palette families and shades manually. The preview renders every supplied value as `--palette-{family}-{shade}`.
2. `semantic` maps palette references such as `primary.500` to UI roles. Components use only these roles.

The required roles are `background`, `foreground`, `muted`, `surface`, `border`, `primary`, `on-primary`, `primary-hover`, `secondary`, `on-secondary`, `accent`, `error`, and `on-error`. `tertiary` and `quaternary` are optional: add them only when the approved system has a meaningful use for them.

Use semantic CSS custom properties in authored component styles. Keep structural class names in BEM and avoid embedding client-specific raw colours in component markup.

```css
.button--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.card {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}
```

Do not use raw palette variables in production component markup. They exist for design inspection and deliberate exceptions only. Do not invent 100–900 ramps when a client provides a small palette; enter the supplied colours and map the available semantic roles.

The monochrome brand preview relies on `black.base` and `white.base`. Keep those two primitives when editing the palette inventory, or update the brand-preview CSS at the same time.

## Typography, spacing, and layout

The `theme` object contains the client-editable non-colour tokens:

- `font-sans` is the system-font stack. Replace it and load an approved webfont locally or through the approved provider when a client needs one.
- `space-1` through `space-24` form the shared spacing scale. `space-section` controls responsive vertical section rhythm.
- `size-icon`, `size-control`, and `size-header` define common icon, control, and header dimensions.
- `wrapper-max` is the maximum inner content width, currently `1440px`.
- `wrapper-gutter-mobile`, `wrapper-gutter-tablet`, and `wrapper-gutter-desktop` are the shared horizontal padding values. They default to `1rem` (`16px`), `2rem` (`32px`), and `3rem` (`48px`) respectively, independently from the maximum content width.

Use `.wrapper` and `.section` for page structure. A wrapper keeps its inner content within `wrapper-max` while applying the mobile gutter below `600px`, tablet gutter from `600px` to `1199px`, and desktop gutter from `1200px` upward. Changing a gutter token does not change the maximum content width. Use the shared spacing values before introducing a one-off gap, margin, or width. The preview displays each configured value so designers and developers can verify the scale together.

## Shape

The radius scale is `radius-none`, `radius-xs`, `radius-sm`, `radius-md`, `radius-lg`, `radius-xl`, and `radius-full`. It follows the Material 3 vocabulary from square to fully rounded, but the values are client-configurable.

Use the shared radius custom properties in authored styles, for example `border-radius: var(--radius-md)`. The preview records the intended use and exact value for every shape token.

## Elevation

The two-layer shadow scale contains `shadow-0`, `shadow-1`, `shadow-2`, `shadow-3`, `shadow-4`, `shadow-6`, `shadow-8`, `shadow-12`, `shadow-16`, and `shadow-24`.

The labels are Material-inspired visual hierarchy labels, not physical distances. Use low levels for resting surfaces and interactive lift; reserve `shadow-8` and above for temporary, high-priority UI such as menus, drawers, and dialogs. The preview shows the full CSS value and intended use for every elevation level.

## Breakpoints

Breakpoints are authored CSS media queries, not values in `site.config.ts`. The responsive wrapper rules live in `src/styles/global.css`; module-specific responsive rules stay with their owning styles and use the same fixed thresholds. Runtime CSS variables cannot control media queries, so duplicating the values in client configuration would create a misleading second source of truth.

The starter is mobile-first:

| Layout range | Viewport width     | CSS media query      |
| ------------ | ------------------ | -------------------- |
| Compact      | Under `600px`      | Base styles          |
| Medium       | `600px`–`839px`    | `min-width: 37.5rem` |
| Expanded     | `840px`–`1199px`   | `min-width: 52.5rem` |
| Large        | `1200px`–`1599px`  | `min-width: 75rem`   |
| Extra large  | `1600px` and above | `min-width: 100rem`  |

Change this scale only as a deliberate layout-system decision. Any breakpoint change requires responsive regression testing of all authored media-query layouts.

## Motion

`--motion-fast` currently lives in `src/styles/global.css` and provides the shared `160ms` timing used by lightweight CSS state changes. It is a global implementation token, not a client-editable `siteConfig.theme` value. Change it only as a deliberate system-wide decision and update this guide and affected interaction tests at the same time.

GSAP and ScrollTrigger are available for approved component-level motion, but they are not part of the default bundle or the design-system preview. Read [animation](animation.md) before using them. Motion must preserve the static readable state, respect reduced-motion preferences, and avoid changing the document’s meaning or interaction semantics.

## Brand assets

Set `siteConfig.brand.logo` and `siteConfig.brand.icon` to public SVG paths, and keep their `logoWidth`, `logoHeight`, `iconWidth`, and `iconHeight` values aligned with each file's intrinsic dimensions. The preview applies the assets as CSS masks and shows the standard monochrome treatments: black on white and white on black.

Provide single-colour SVGs with an opaque vector shape and no embedded raster image. Replace the placeholders in `public/brand/`, update the paths and dimensions, and confirm the header logo still has meaningful alternative text through `siteConfig.name`.

## Component conventions

The component set is intentionally small: base and legal layouts, header, footer, scroll controls, consent manager, contact form, marketing homepage, design-system preview, and the component-scoped animation helper. Compose existing primitives before adding a generic component.

- Keep interactive controls keyboard-accessible and preserve visible focus styles.
- Use semantic colours, shared radius, spacing, and elevation tokens.
- Avoid a Material component library; Material principles inform hierarchy and interaction, not the visual identity.
- Keep optional client JavaScript scoped to the component that needs it.

### Scroll controls

`ScrollControls.astro` provides the default scroll behavior: `stickyHeader` and `backToTop` are enabled in `siteConfig.features`, while each can be disabled per client. The header becomes sticky after scrolling `240px`; the semantic back-to-top link appears after `640px`. Without JavaScript, the header remains static and the visible `#top` link remains usable. The control uses `size-control`, `size-icon`, `radius-full`, and `shadow-6`; it sits below the consent banner when one is active.

### Class naming

Authored CSS classes follow BEM (Block, Element, Modifier):

```html
<div class="brand">
  <span class="brand__mark brand__mark--black"></span>
</div>
```

- A **block** is an independent component or layout primitive: `.wrapper`, `.section`, `.brand`.
- An **element** belongs to its block: `.brand__mark`.
- A **modifier** changes a block or element variant: `.brand__mark--black`, `.site--wireframe`.

All authored classes follow BEM. Keep component-specific styles scoped to their Astro module or owning page, and reserve `src/styles/global.css` for tokens, reset/base behavior, focus defaults, and shared layout foundations. Import shared treatments such as buttons from a dedicated stylesheet instead of expanding the global foundation. Name component state with a BEM modifier rather than an unscoped state class.

## Wireframe mode

Set `siteConfig.features.wireframe` to `true` to add the `.site--wireframe` modifier and outline every `.wrapper` and `section` with a dashed red line. It is a local layout-review aid. Set it to `false` before a production release.

## Review checklist

Before approving a client theme:

1. Check semantic mappings and text/background contrast combinations.
2. Confirm all brand assets, radius, spacing, and elevation values in the preview.
3. Review the compact, medium, expanded, large, and extra-large layouts.
4. If approved motion is present, verify normal and reduced-motion behavior without hiding meaningful static content.
5. Turn wireframe mode off and run `pnpm run verify` plus `pnpm run test:e2e`.
