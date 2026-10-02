# Design system

The design system is deliberately small, semantic, and client-configurable. Its job is to let a client rebrand the site by editing a few well-defined values, without changing component markup.

The internal design-system preview is the root page while this boilerplate is being prepared. It is `noindex, nofollow` and excluded from the sitemap. Move it to `/design-system` when the client homepage is ready; the exact procedure is in [client setup](client-setup.md).

## Source of truth

| Concern                                                                                                          | Source                                          | Why it belongs there                                        |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| Client identity, raw palettes, semantic colour mappings, typography, spacing, size, radius, and elevation values | `src/config/site.config.ts`                     | Typed, client-specific runtime configuration                |
| Responsive breakpoints and global CSS fallback values                                                            | `src/styles/global.css`                         | Tailwind generates media queries at build time              |
| Reusable markup and component composition                                                                        | `src/components/`                               | Components consume semantic roles rather than client values |
| Visual reference                                                                                                 | `src/components/site/DesignSystemPreview.astro` | Renders the configured system for review                    |

`BaseLayout.astro` resolves semantic colour references and emits the configured CSS custom properties on the document root. `global.css` provides the fallback values and connects semantic variables to Tailwind utilities.

## Colour system

Colours have two layers in `siteConfig.colors`.

1. `palettes` is the raw inventory. Add, remove, or rename client palette families and shades manually. The preview renders every supplied value as `--palette-{family}-{shade}`.
2. `semantic` maps palette references such as `primary.500` to UI roles. Components use only these roles.

The required roles are `background`, `foreground`, `muted`, `surface`, `border`, `primary`, `on-primary`, `primary-hover`, `secondary`, `on-secondary`, `accent`, `error`, and `on-error`. `tertiary` and `quaternary` are optional: add them only when the approved system has a meaningful use for them.

Use semantic Tailwind utilities in components, for example:

```html
<button class="bg-role-primary text-role-on-primary">Save</button>
<div class="border border-role-border bg-role-surface">...</div>
```

Do not use raw palette variables in production component markup. They exist for design inspection and deliberate exceptions only. Do not invent 100–900 ramps when a client provides a small palette; enter the supplied colours and map the available semantic roles.

The monochrome brand preview relies on `black.base` and `white.base`. Keep those two primitives when editing the palette inventory, or update the brand-preview CSS at the same time.

## Typography, spacing, and layout

The `theme` object contains the client-editable non-colour tokens:

- `font-sans` is the system-font stack. Replace it and load an approved webfont locally or through the approved provider when a client needs one.
- `space-1` through `space-24` form the shared spacing scale. `space-section` controls responsive vertical section rhythm.
- `size-icon` and `size-control` define common control dimensions.
- `container-max` is the maximum content width, currently `1440px`.

Prefer `.container` and `.section` for page structure. Use the shared spacing values before introducing a one-off gap, margin, or width. The preview displays each configured value so designers and developers can verify the scale together.

## Shape

The radius scale is `radius-none`, `radius-xs`, `radius-sm`, `radius-md`, `radius-lg`, `radius-xl`, and `radius-full`. It follows the Material 3 vocabulary from square to fully rounded, but the values are client-configurable.

Use Tailwind radius utilities such as `rounded-md` for normal component work. Use `border-radius: var(--radius-lg)` only when a dynamic CSS value is genuinely needed. The preview records the intended use and exact value for every shape token.

## Elevation

The two-layer shadow scale contains `shadow-0`, `shadow-1`, `shadow-2`, `shadow-3`, `shadow-4`, `shadow-6`, `shadow-8`, `shadow-12`, `shadow-16`, and `shadow-24`.

The labels are Material-inspired visual hierarchy labels, not physical distances. Use low levels for resting surfaces and interactive lift; reserve `shadow-8` and above for temporary, high-priority UI such as menus, drawers, and dialogs. The preview shows the full CSS value and intended use for every elevation level.

## Breakpoints

Breakpoints are build-time CSS/Tailwind tokens in `src/styles/global.css`, not values in `site.config.ts`. Runtime CSS variables cannot control media queries, so duplicating the values in client configuration would create a misleading second source of truth.

The starter is mobile-first:

| Layout class | Range              | Tailwind usage       |
| ------------ | ------------------ | -------------------- |
| Compact      | Under `600px`      | Unprefixed utilities |
| Medium       | `600px`–`839px`    | `sm:`                |
| Expanded     | `840px`–`1199px`   | `md:`                |
| Large        | `1200px`–`1599px`  | `lg:`                |
| Extra large  | `1600px` and above | `xl:`                |

Change this scale only as a deliberate layout-system decision. Any breakpoint change requires responsive regression testing because it affects every prefixed Tailwind utility.

## Brand assets

Set `siteConfig.brand.logo` and `siteConfig.brand.icon` to public SVG paths, and keep their `logoWidth`, `logoHeight`, `iconWidth`, and `iconHeight` values aligned with each file's intrinsic dimensions. The preview applies the assets as CSS masks and shows the standard monochrome treatments: black on white and white on black.

Provide single-colour SVGs with an opaque vector shape and no embedded raster image. Replace the placeholders in `public/brand/`, update the paths and dimensions, and confirm the header logo still has meaningful alternative text through `siteConfig.name`.

## Component conventions

The component set is intentionally small: layout, header, footer, consent manager, contact form, marketing homepage, and design-system preview. Compose existing primitives before adding a generic component.

- Keep interactive controls keyboard-accessible and preserve visible focus styles.
- Use semantic colours, shared radius, spacing, and elevation tokens.
- Avoid a Material component library; Material principles inform hierarchy and interaction, not the visual identity.
- Keep optional client JavaScript scoped to the component that needs it.

## Wireframe mode

Set `siteConfig.features.wireframe` to `true` to outline every `.container` and `section` with a dashed red line. It is a local layout-review aid. Set it to `false` before a production release.

## Review checklist

Before approving a client theme:

1. Check semantic mappings and text/background contrast combinations.
2. Confirm all brand assets, radius, spacing, and elevation values in the preview.
3. Review the compact, medium, expanded, large, and extra-large layouts.
4. Turn wireframe mode off and run `pnpm run verify` plus `pnpm run test:e2e`.
