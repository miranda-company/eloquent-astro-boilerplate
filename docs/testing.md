# Testing and contribution

The project uses formatting, linting, Astro validation, unit tests, production build checks, and Playwright browser tests. Run the smallest relevant command while working, then run the full suite before handoff.

## Commands

| Command                 | What it verifies                                                         |
| ----------------------- | ------------------------------------------------------------------------ |
| `pnpm run format:check` | Prettier formatting across code and documentation                        |
| `pnpm run lint`         | ESLint rules for source and tests                                        |
| `pnpm run check`        | Astro, TypeScript, and Content Collection validation                     |
| `pnpm run test`         | Unit behavior for configuration and token resolution                     |
| `pnpm run build`        | Static production output, sitemap, and route generation                  |
| `pnpm run verify`       | All non-browser checks above plus a production build                     |
| `pnpm run test:e2e`     | Chromium smoke, interaction, network-default, and accessibility coverage |
| `Ctrl+C`                | Stop a local development or preview server                               |

Playwright builds the site and serves `dist/`, so browser tests exercise the static production artifact rather than the development server.

## Existing coverage

Browser coverage verifies the current design-system homepage, legal routes and their table-of-contents targets, skip link, header brand link, configured logo dimensions, Google Fonts document-head links, shell landmarks, single-page `h1` structure, canonical/social metadata, noindex JSON-LD suppression, token previews, BEM brand classes, responsive wrapper and stack gaps, inactive optional integrations, absence of default analytics requests, and baseline accessibility through axe. Unit coverage renders Footer-01 through Astro’s container API to verify its enabled and disabled consent-control contract, confirms the removed starter marketing sample remains absent, and verifies Google Fonts URL generation.

Unit coverage verifies site identity and brand configuration, the Figma token export and values, emitted CSS names and modes, wireframe feature configurability, and the GSAP/ScrollTrigger animation foundation.

## Contribution rules

Add or update tests when changing public routes, shared interactions, content schemas, integrations, semantic token behavior, client-visible feature flags, document landmarks, headings, metadata, structured-data behavior, or motion. Keep tests deterministic: do not call live analytics, future form providers, or third-party APIs. Motion tests must cover the final static state and reduced-motion behavior where a motion component is added.

For visual changes, inspect the design-system preview at the relevant responsive widths. For any breakpoint change, review compact, medium, expanded, large, and extra-large layouts.

## CI

GitHub Actions installs the pinned pnpm version with the frozen lockfile, installs Chromium, then runs `verify` and `test:e2e` on pushes and pull requests. Do not introduce an npm lockfile alongside `pnpm-lock.yaml`.

Dependency updates are reviewed manually. During routine maintenance and before release, run `pnpm audit --prod` when network access is available and address applicable findings before shipping.
