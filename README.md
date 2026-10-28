# Eloquent Astro Boilerplate

A static-first, white-label Astro starter for Spanish marketing sites. It combines strict TypeScript, local Markdown/MDX content, authored BEM CSS, semantic CSS custom-property tokens, accessible client-side enhancements, and a no-index design-system preview.

## What is included

- Astro static output with strict TypeScript and local Content Collections.
- Typed client configuration in `src/config/client-config.ts`.
- Figma is the source of truth for design tokens; a checked-in, typed variable snapshot emits CSS custom properties at build time.
- Generic Figma primitive names and semantic color, typography, spacing, radius, and size variables remain stable across client rebrands.
- A no-index design-system preview lists every exported Figma variable, its mode values, and CSS property.
- Reusable Astro page patterns with typed MDX props, starting with a token-driven marketing hero linked to the Figma design reference.
- Spanish starter content and a configurable legal-page layout with a table of contents, optional status notice, and optional summary facts.
- A pre-optimised asset workflow: native responsive image markup with agency-prepared files copied unchanged from `public/images/`.
- Configurable sticky-header and back-to-top controls with semantic, no-JavaScript fallbacks.
- Optional integrations are disabled by default: enable approved feature flags and provide environment variables before consent-gated analytics or the provider-agnostic native contact form can run.
- GSAP and ScrollTrigger available for isolated, reduced-motion-aware component animations.
- ESLint, Prettier, Vitest, Playwright, axe accessibility checks, and GitHub Actions CI.

## Requirements

- Node.js 24 or later, as declared in `package.json`.
- pnpm 10.34.3 or later. The project pins pnpm through `packageManager`.

Enable Corepack once if needed:

```sh
corepack enable
```

## Quick start

```sh
pnpm install
pnpm run dev
```

Then complete [the client setup checklist](docs/client-setup.md). Copy `.env.example` to `.env` only when an approved integration needs configuration.

## Commands

| Command                 | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `pnpm run dev`          | Start the local development server                             |
| `pnpm run check`        | Validate Astro, TypeScript, and content                        |
| `pnpm run lint`         | Run ESLint                                                     |
| `pnpm run format:check` | Check formatting                                               |
| `pnpm run test`         | Run unit tests                                                 |
| `pnpm run build`        | Create the static production build                             |
| `pnpm run preview`      | Serve the built output locally                                 |
| `pnpm run test:e2e`     | Run Chromium smoke and accessibility tests                     |
| `pnpm run verify`       | Run formatting, lint, checks, unit tests, and production build |
| `Ctrl+C`                | Stop the local development server                              |

## Documentation

- [Architecture](docs/architecture.md)
- [Client setup](docs/client-setup.md)
- [Client project workflow](docs/client-project-workflow.md)
- [Client technical brief template](docs/templates/client-technical-brief.md)
- [Content authoring](docs/content.md)
- [Design system](docs/design-system.md)
- [Reusable component patterns and Figma references](docs/component-library.md)
- [Semantic DOM, SEO, AEO, and GEO](docs/DOM_ARCHITECTURE.md)
- [Integrations and privacy](docs/integrations.md)
- [Animation](docs/animation.md)
- [Testing and contribution](docs/testing.md)

## Package-manager policy

Use pnpm only. Do not add `package-lock.json` or install dependencies with npm alongside `pnpm-lock.yaml`; a single lockfile keeps local and CI dependency resolution reproducible.
