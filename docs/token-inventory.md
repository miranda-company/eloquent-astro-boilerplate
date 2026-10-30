# Token inventory

This is a Figma-ready inventory of reusable token roles. Approved entries are exported from Figma and consumed through the checked-in snapshot; deferred entries remain proposals until a real pattern needs them.

## Approved additions

### Interactive colors

These roles belong in `color-tokens` with `light-mode` and `dark-mode` values. Review every final foreground/background pair for contrast in its actual state.

| Token                                   | Proposed light-mode value | Role                             |
| --------------------------------------- | ------------------------- | -------------------------------- |
| `color-text-link-default`               | `color-palette-1-800`     | Standard text link               |
| `color-text-link-hover`                 | `color-palette-1-900`     | Hovered text link                |
| `color-text-link-active`                | `color-palette-1-900`     | Pressed text link                |
| `color-surface-action-primary-default`  | `color-palette-1-600`     | Primary action surface           |
| `color-surface-action-primary-hover`    | `color-palette-1-500`     | Hovered primary action           |
| `color-surface-action-primary-active`   | `color-palette-1-700`     | Pressed primary action           |
| `color-surface-action-primary-disabled` | `color-neutral-300`       | Disabled primary action          |
| `color-text-action-primary`             | `color-neutral-black`     | Text or icon on a primary action |
| `color-border-focus`                    | `color-wire`              | Keyboard focus indicator         |
| `color-text-disabled`                   | `color-neutral-500`       | Disabled text                    |
| `color-icon-disabled`                   | `color-neutral-500`       | Disabled functional icon         |
| `color-surface-disabled`                | `color-neutral-150`       | Disabled surface                 |
| `color-border-disabled`                 | `color-neutral-300`       | Disabled border                  |

Do not add a visited-link color unless an approved design requires one.

### Reusable sizes

These roles belong in `global-size-tokens`. They describe reusable UI dimensions, not a specific component.

| Token             | Proposed value | Role                      |
| ----------------- | -------------: | ------------------------- |
| `size-icon-sm`    |           16px | Compact functional icon   |
| `size-icon-md`    |           24px | Standard functional icon  |
| `size-icon-lg`    |           32px | Prominent functional icon |
| `size-control-sm` |           32px | Compact square control    |
| `size-control-md` |           40px | Standard square control   |
| `size-control-lg` |           48px | Large square control      |

After approval, use `size-icon-md` for Footer-01 contact icons and the back-to-top icon, and `size-control-md` for the back-to-top control. Keep interactive hit-area requirements under review when a visible control is smaller than 44px.

### Opacity and motion

These remain intended variables. Do not export them to the checked-in snapshot or consume them in CSS until the token adapter supports non-pixel values.

| Token              |               Proposed value | Role                                   |
| ------------------ | ---------------------------: | -------------------------------------- |
| `opacity-disabled` |                          0.5 | Disabled control or content            |
| `opacity-overlay`  |                          0.5 | Backdrop or scrim                      |
| `duration-fast`    |                        160ms | Hover and short visibility transitions |
| `duration-normal`  |                        240ms | Standard UI transition                 |
| `duration-slow`    |                        320ms | Deliberate UI transition               |
| `easing-standard`  | `cubic-bezier(0.2, 0, 0, 1)` | Standard UI timing curve               |

When these roles are approved for implementation, extend the adapter so opacity emits a unitless number, durations emit milliseconds, and easing values emit valid unquoted CSS values.

## Defer until a real pattern needs them

- Status roles: success, warning, error, and informational text, surface, and border colors.
- Form-field roles: default, hover, focus, invalid, disabled, and support-message states.
- Elevation and overlay roles for cards, dialogs, popovers, or drawers.
- Secondary and outline action states.
- Additional typography weights. These change Google Fonts loading, so add them only when approved typography uses them.

## Rules

- Keep names semantic and reusable; never name a token after a footer, button, or other individual component. Use `size-*` for primitive dimensions and reserve `spacing-*` for semantic responsive layout roles.
- Breakpoints remain build-time aliases in `src/styles/breakpoints.css`, not Figma variables.
- Keep existing typography, spacing, radius, border, width, and base color tokens unchanged unless an approved Figma decision changes them.
- After a Figma approval, export the snapshot, update the preview and documentation, replace matching primitive call sites, add deterministic coverage, and run `pnpm run verify` plus `pnpm run test:e2e`.
