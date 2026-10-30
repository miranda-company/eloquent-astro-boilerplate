# Design system

The approved [Figma Design System](https://www.figma.com/design/56g1RP9hV1uVFigLSQKHsC/Design-System?node-id=0-1&t=OgKJWWi7p2SpP6WS-1) is the source of truth for design tokens. Keep its variable names, values, and modes aligned with the Astro implementation; do not create a second hand-maintained palette or theme-token system in code.

The internal design-system preview is the root page while the boilerplate is being prepared. It is `noindex, nofollow` and excluded from the sitemap. Move it to `/design-system` when the client homepage is ready; the procedure is in [client setup](client-setup.md).

Use the separate [pattern preview system](pattern-previews.md) for isolated visual testing of reusable components. Keep token inspection in the design-system preview.

## Token source and implementation

| Concern                                                          | Source                                          | Responsibility                                                    |
| ---------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| Approved tokens, names, values, and modes                        | Figma Design System file                        | Authoritative design decisions                                    |
| Checked-in snapshot                                              | `src/config/figma-tokens.json`                  | Figma variable export grouped by collection, with values per mode |
| Token validation, CSS names, and mode output                     | `src/config/figma-tokens-adapter.ts`            | Converts the export to static CSS custom properties               |
| CSS reset, base rules, and responsive wrapper layout             | `src/styles/global.css`                         | Structural site-wide CSS; not a duplicate token source            |
| Responsive breakpoint aliases                                    | `src/styles/breakpoints.css`                    | Build-time custom-media source for authored responsive CSS        |
| Site identity, URLs, brand assets, feature flags, and navigation | `src/config/client-config.ts`                   | Non-design-token site configuration                               |
| Rendered token reference                                         | `src/components/site/DesignSystemPreview.astro` | Displays variable names, CSS names, values, and modes             |

`BaseLayout.astro` emits the generated token CSS in the document head. A site build does not call Figma or require credentials, so output remains static, repeatable, and buildable offline. `global.css` must not define fallback values for tokens already in the Figma export.

Each exported token name becomes its CSS custom property name by adding `--`. For example:

```text
font-size-md             →  --font-size-md
color-text-default       →  --color-text-default
spacing-wrapper-default  →  --spacing-wrapper-default
```

Keep token names stable across client projects. A client rebrand changes primitive values and semantic mode values in Figma, not component CSS names.

## Current Figma collections

The current system has five collections:

- **Font tokens:** family, size, weight, line-height, and letter-spacing scales.
- **Primitives:** generic color ramps, neutral colors, dimensions, and radii.
- **Color tokens:** semantic text, surface, icon, border, and interactive roles with light and dark modes.
- **Spacing tokens:** semantic spacing roles with mobile, tablet, and desktop modes.
- **Global size tokens:** wrapper and content maximum widths, wire size, and non-wire border sizes.

The preview displays font-size, semantic-color, primitive-color, primitive-dimension, spacing, and global-size tokens with their exported values and modes. Other font and primitive variables remain available in the snapshot and generated CSS but are not currently given dedicated preview grids. The export contains resolved values, not alias references.

## Modes and numeric values

- Color tokens use the first exported mode (`light-mode`) as the generated CSS value. The `dark-mode` values remain visible in the preview and export but are not activated by the adapter.
- Spacing tokens use `mobile` as the base value. The token adapter emits tablet and desktop companion variables (for example, `--spacing-xs-tablet` and `--spacing-xs-desktop`), while `src/styles/global.css` activates tablet values at `--md` and desktop values at `--xl`. Responsive styles use these mobile-first aliases as needed:

  | Name  | Starts at |
  | ----- | --------: |
  | `sm`  |   `576px` |
  | `md`  |   `768px` |
  | `lg`  |   `992px` |
  | `xl`  |  `1200px` |
  | `xxl` |  `1400px` |

  Base styles apply below `--sm`; use the matching positive aliases for larger layouts. When a rule must target the range below a threshold, use its `--below-*` counterpart so ranges do not overlap. These names describe viewport-width breakpoints, not specific device types. The `.wrapper` uses `spacing-wrapper-default` and `max-width-2xl`; top-level sections use `spacing-section-default`.

- Figma numeric values do not encode CSS units. The adapter treats dimensional `FLOAT` tokens as CSS pixels. Font weights remain unitless. String font-family values are emitted as quoted CSS strings.
- Typography tokens use `mobile` as the base value and switch to `desktop` at `--lg`. Every `font-tokens` value requires both modes: family, weight, size, line-height, and tracking. The adapter emits desktop companion variables while `global.css` activates them; components always consume the canonical names.
- Google Font family names come from `font-family-title` and `font-family-body`; normal weights come from every `font-weight-*` token across both typography modes in the Figma snapshot. The generated stylesheet uses `display=swap` and retains the system `sans-serif` fallback. Keep only approved available Google Font weights in Figma. Italic loading requires a future explicit Figma token contract.
- Use the shared aliases in `src/styles/breakpoints.css` for media queries in global and component styles. The token adapter provides mode values but does not choose when a mode becomes active. These aliases compile to the documented fixed-pixel thresholds; they are implementation layout rules, not runtime CSS custom properties or variables in the current Figma file.

Do not silently invent tokens for properties absent from the approved system. It currently has no shadow or error-state roles. If a design needs one, add and approve it in Figma first; then update the checked-in export and code together.

The [token inventory](token-inventory.md) records proposed reusable interaction, size, opacity, and motion roles. It is a Figma-ready decision aid, not an approved token source or a substitute for the exported snapshot.

## Consuming tokens

Prefer semantic tokens when choosing design values. For spacing, use semantic roles such as `--spacing-xs`, `--spacing-sm`, `--spacing-md`, and `--spacing-lg` when they express the intended spacing. Use a numeric primitive dimension such as `--size-3` only when no semantic role represents the required value or role; do not choose a primitive just because its number is familiar. Apply the same principle to other token categories: prefer semantic roles where available, and use primitives when a semantic role does not fit.

Use `color-text-link-default`, `color-text-link-hover`, and `color-text-link-active` for standard text links. Use `color-surface-action-primary`, its hover and active companions, and `color-text-action-primary` for primary actions. Use `color-border-focus` for visible keyboard focus. Do not apply a text-link role to an icon-only link when an approved icon interaction role exists; the current system has no such state role, so icon-only links inherit the standard link treatment.

## Layout primitives

The shared primitives are `.wrapper`, `.section`, `.stack`, `.stack-xs`, and `.grid`. Pair them with the owning BEM class:

```html
<div class="pattern__items grid">
  <!-- peer items -->
</div>
```

`.stack` uses the default gutter; `.stack-xs` uses the extra-small gap; `.grid` uses grid display and the default gutter. Keep columns, item sizing, margins, and responsive rules in the component. Add a global primitive only when the same token-based behavior appears in two real patterns. `--wire-size` remains exclusive to the development wireframe modifier.

Use the Figma semantic roles for colors and border sizes. Use `--border-size-sm` for standard borders, and choose a larger border-size token only when the design calls for a heavier border. Reserve `--wire-size` for the shared wireframe modifier. Examples:

```css
.button--primary {
  background: var(--color-surface-brand);
  color: var(--color-text-default);
  border-radius: var(--radius-md);
}

.card {
  border: var(--border-size-sm) solid var(--color-border-secondary);
  background: var(--color-surface-default);
  padding: var(--spacing-md);
}
```

Do not use `--wire-size` for component borders outside wireframe mode. The Figma `border-size-*` tokens provide the thickness scale for ordinary borders.

Do not reintroduce the removed `--color-primary`, `--space-*`, `--shadow-*`, or `--wrapper-gutter-*` tokens as compatibility aliases. Change call sites to the approved exported token names. Keep component styles authored and scoped as before; the token migration does not imply a component-sync workflow.

## Icons

[Lucide](https://lucide.dev/) is the icon library for functional interface icons. Select the approved icon in the Lucide Figma plugin, then use the matching named component from `@lucide/astro` in the implementation. Direct imports keep the static build tree-shaken and render the selected icon as inline SVG.

Use the Figma-approved size and stroke settings, and let icons inherit their semantic `currentColor` from the owning component. Mark an icon decorative with `aria-hidden="true"` when adjacent text or an accessible parent control already conveys its meaning. For an icon-only action, give the interactive control an accessible name. Keep client logos, partner marks, and bespoke illustrations as approved local assets; Lucide does not replace them.

## Updating the snapshot

When an approved Figma variable changes:

1. Export the variables from the approved Figma file using the agreed collection → variable name → mode/value JSON structure.
2. Replace `src/config/figma-tokens.json` with the approved export. Keep the token names and mode values intact; this format contains resolved values and does not preserve Figma alias relationships.
3. Run the token tests and review the snapshot diff against the Figma file and the preview.
4. Update CSS consumers only when token names or intended usage change. If a required design role is missing, add it to Figma rather than creating a code-only token.
5. Run `pnpm run verify` and relevant Playwright coverage.

`pnpm run verify` includes a token-consumer contract that compares every production `var(--...)` reference with the adapter's emitted variables. If an import renamed or removed a consumed token, migrate the source deliberately; do not add a compatibility alias.

The JSON snapshot is generated input, not a second authority. Do not edit token values directly in the snapshot or `client-config.ts`.

## Breakpoints and motion

The starter is mobile-first. `src/styles/breakpoints.css` defines the shared `--sm`, `--md`, `--lg`, `--xl`, and `--xxl` custom-media aliases; use them in both shared and component-specific responsive rules. The aliases compile at build time, so runtime CSS custom properties cannot control media queries. Do not duplicate breakpoints in client configuration.

### Using breakpoint aliases

1. Start with the compact layout as the unqualified base style.
2. Use the positive alias when a layout starts at a named threshold:

   ```css
   .feature-grid {
     grid-template-columns: 1fr;
   }

   @media (--lg) {
     .feature-grid {
       grid-template-columns: repeat(3, minmax(0, 1fr));
     }
   }
   ```

3. Use `--below-sm`, `--below-md`, `--below-lg`, `--below-xl`, or `--below-xxl` only when a rule must apply strictly below that threshold. Do not write raw viewport values in a component or shared stylesheet.
4. Keep a component's responsive rules in its scoped stylesheet. The alias definition belongs only in `src/styles/breakpoints.css`; components consume aliases but never redeclare them.
5. Keep feature or preference queries independent, for example `@media (prefers-reduced-motion: reduce)`. They are not viewport breakpoint aliases.

When a client-approved breakpoint scale changes, update `src/styles/breakpoints.css` once, then review all responsive layouts at compact, medium, expanded, large, and extra-large widths. Run `pnpm run verify` and `pnpm run test:e2e`; the production build must contain expanded media queries, not `@media (--...)` aliases.

GSAP and ScrollTrigger are available for approved component-level motion, but they are not part of the Figma token set or the default site bundle. Read [animation](animation.md) before using them. Respect reduced-motion preferences and preserve usable static content.

## Brand assets

Set `siteConfig.brand.logo` and `siteConfig.brand.icon` to public SVG paths, and keep their dimensions aligned with the SVG viewBox. Provide approved assets in `public/brand/` and confirm the header has meaningful alternative text through `siteConfig.name`. Brand assets are distinct from functional Lucide icons.

## Review checklist

Before approving a token update:

1. Compare every collection, variable name, value, and mode with Figma.
2. Confirm CSS names match exported Figma variable names and no duplicate token definitions remain.
3. Check color contrast for actual combinations used in components, especially branded surfaces.
4. Review the design-system preview at compact, medium, expanded, large, and extra-large widths.
5. Run `pnpm run verify` and `pnpm run test:e2e`.

The wireframe aid is active only during development; production builds omit its root class even if `siteConfig.features.wireframe` is enabled. Set the flag to `false` after layout inspection and before a production release.
