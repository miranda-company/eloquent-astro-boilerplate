# Design system

The approved [Figma Design System](https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System?node-id=0-1&t=OgKJWWi7p2SpP6WS-1) is the source of truth for design tokens. Keep its variable names, values, and modes aligned with the Astro implementation; do not create a second hand-maintained palette or theme-token system in code.

The internal design-system preview is the root page while the boilerplate is being prepared. It is `noindex, nofollow` and excluded from the sitemap. Move it to `/design-system` when the client homepage is ready; the procedure is in [client setup](client-setup.md).

## Token source and implementation

| Concern                                                           | Source                                          | Responsibility                                                    |
| ----------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| Approved tokens, names, values, and modes                         | Figma Design System file                        | Authoritative design decisions                                    |
| Checked-in snapshot                                               | `src/config/figma-tokens.json`                  | Figma variable export grouped by collection, with values per mode |
| Token validation, CSS names, and mode output                      | `src/config/figma-tokens-adapter.ts`            | Converts the export to static CSS custom properties               |
| CSS reset, base rules, responsive wrapper layout, and breakpoints | `src/styles/global.css`                         | Structural site-wide CSS; not a duplicate token source            |
| Site identity, URLs, brand assets, feature flags, and navigation  | `src/config/client-config.ts`                   | Non-design-token site configuration                               |
| Rendered token reference                                          | `src/components/site/DesignSystemPreview.astro` | Displays variable names, CSS names, values, and modes             |

`BaseLayout.astro` emits the generated token CSS in the document head. A site build does not call Figma or require credentials, so output remains static, repeatable, and buildable offline. `global.css` must not define fallback values for tokens already in the Figma export.

Each exported token name becomes its CSS custom property name by adding `--`. For example:

```text
font-size-md             →  --font-size-md
color-text-default       →  --color-text-default
spacing-wrapper-default  →  --spacing-wrapper-default
```

Keep token names stable across client projects. A client rebrand changes primitive values and semantic mode values in Figma, not component CSS names.

## Current Figma collections

The current minimum system contains 128 variables in five collections:

- **Font tokens:** family, size, weight, line-height, and letter-spacing scales.
- **Primitives:** generic color ramps, neutral colors, spacing values, and radii.
- **Color tokens:** semantic text, surface, icon, and border roles with light and dark modes.
- **Spacing tokens:** semantic spacing roles with desktop and mobile modes.
- **Global size tokens:** wrapper and content maximum widths plus wire size.

The preview displays every variable in these collections and its exported value for each mode. The export contains resolved values, not alias references.

## Modes and numeric values

- Color tokens use the first exported mode (`light-mode`) as the generated CSS value. The `dark-mode` values remain visible in the preview and export but are not activated by the adapter.
- Spacing tokens use `desktop` by default. The token adapter emits Figma mobile values as companion variables (for example, `--spacing-xs-mobile`), and `src/styles/global.css` activates them below the `sm` breakpoint of `576px`. Responsive styles use these mobile-first minimum-width breakpoints as needed:

  | Name  | Starts at |
  | ----- | --------: |
  | `sm`  |   `576px` |
  | `md`  |   `768px` |
  | `lg`  |   `992px` |
  | `xl`  |  `1200px` |
  | `xxl` |  `1400px` |

  Base styles apply below `sm`; use `min-width` queries at the named thresholds for larger layouts. When a rule must target only the range below `sm`, use `max-width: 575.98px` so it does not overlap the `576px` threshold. These names describe viewport-width breakpoints, not specific device types. The `.wrapper` uses `spacing-wrapper-default` and `max-width-2xl`; top-level sections use `spacing-section-default`.

- Figma numeric values do not encode CSS units. The adapter treats dimensional `FLOAT` tokens as CSS pixels. Font weights remain unitless. String font-family values are emitted as quoted CSS strings.
- Use the shared fixed-pixel breakpoints documented in `src/styles/global.css` for media queries in global and component styles. The token adapter provides mode values but does not choose when a mode becomes active. Breakpoints are implementation layout rules, not variables in the current Figma file.

Do not silently invent tokens for properties absent from this minimal system. For example, it currently has no shadow, error-state, hover, or dedicated on-brand text variables. If a design needs one, add and approve it in Figma first; then update the checked-in export and code together.

## Consuming tokens

Prefer semantic tokens when choosing design values. For spacing, use semantic roles such as `--spacing-xs`, `--spacing-sm`, `--spacing-md`, and `--spacing-lg` when they express the intended spacing. Use a numeric primitive such as `--spacing-3` only when no semantic spacing token represents the required value or role; do not choose a primitive just because its number is familiar. Apply the same principle to other token categories: prefer semantic roles where available, and use primitives when a semantic role does not fit.

Use the Figma semantic roles for colors. Examples:

```css
.button--primary {
  background: var(--color-surface-brand);
  color: var(--color-text-default);
  border-radius: var(--radius-md);
}

.card {
  border: 1px solid var(--color-border-secondary);
  background: var(--color-surface-default);
  padding: var(--spacing-md);
}
```

Do not reintroduce the removed `--color-primary`, `--space-*`, `--shadow-*`, or `--wrapper-gutter-*` tokens as compatibility aliases. Change call sites to the approved exported token names. Keep component styles authored and scoped as before; the token migration does not imply a component-sync workflow.

## Updating the snapshot

When an approved Figma variable changes:

1. Export the variables from the approved Figma file using the agreed collection → variable name → mode/value JSON structure.
2. Replace `src/config/figma-tokens.json` with the approved export. Keep the token names and mode values intact; this format contains resolved values and does not preserve Figma alias relationships.
3. Run the token tests and review the snapshot diff against the Figma file and the preview.
4. Update CSS consumers only when token names or intended usage change. If a required design role is missing, add it to Figma rather than creating a code-only token.
5. Run `pnpm run verify` and relevant Playwright coverage.

The JSON snapshot is generated input, not a second authority. Do not edit token values directly in the snapshot or `client-config.ts`.

## Breakpoints and motion

The starter is mobile-first. Shared wrapper rules use fixed CSS breakpoints, and component-specific responsive rules stay with their owning stylesheets. Runtime variables cannot control media queries; do not duplicate breakpoints in client configuration.

GSAP and ScrollTrigger are available for approved component-level motion, but they are not part of the Figma token set or the default site bundle. Read [animation](animation.md) before using them. Respect reduced-motion preferences and preserve usable static content.

## Brand assets

Set `siteConfig.brand.logo` and `siteConfig.brand.icon` to public SVG paths, and keep their dimensions aligned with the SVG viewBox. Provide approved assets in `public/brand/` and confirm the header has meaningful alternative text through `siteConfig.name`.

## Review checklist

Before approving a token update:

1. Compare every collection, variable name, value, and mode with Figma.
2. Confirm CSS names match exported Figma variable names and no duplicate token definitions remain.
3. Check color contrast for actual combinations used in components, especially branded surfaces.
4. Review the design-system preview at compact, medium, expanded, large, and extra-large widths.
5. Run `pnpm run verify` and `pnpm run test:e2e`.

Set `siteConfig.features.wireframe` to `false` before a production release.
