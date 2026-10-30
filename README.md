# Eloquent Astro Boilerplate

A lightweight, static-first Astro starting point for Spanish marketing sites. It combines strict TypeScript, local Markdown/MDX content, authored BEM CSS, semantic CSS custom-property tokens, accessible client-side enhancements, and a no-index design-system preview.

Its purpose is to make client-site delivery more consistent and easier to maintain. The boilerplate grows through a deliberately maintained library of reusable components and design patterns, letting the team assemble approved marketing sites faster without sacrificing semantic HTML, accessibility, or client-specific design decisions.

## What is included

- Astro static output with strict TypeScript and local Content Collections.
- Typed client configuration in `src/config/client-config.ts`.
- Figma is the source of truth for design tokens; a checked-in, typed variable snapshot emits CSS custom properties at build time.
- Generic Figma primitive names and semantic color, typography, spacing, radius, and size variables remain stable across client rebrands.
- Google Fonts generated from the approved Figma font-family and normal font-weight tokens, with `display=swap` and a system fallback.
- A no-index design-system preview shows font-size, semantic-color, primitive-color, spacing, and global-size token grids with their mode values and CSS properties.
- Static, isolated no-index pattern previews at `/patterns/` support responsive visual checks of registered reusable components.
- Shared responsive styles use the mobile-first custom-media aliases in `src/styles/breakpoints.css`; their thresholds are documented in `docs/design-system.md`.
- Reusable Astro patterns with explicit typed interfaces, including Figma-backed Footer-01 and image-reference-backed Footer-02.
- Spanish starter content and a configurable legal-page layout with a table of contents, optional status notice, and optional summary facts.
- A pre-optimised asset workflow: native responsive image markup with agency-prepared files copied unchanged from `public/images/`.
- Configurable sticky-header and back-to-top controls with semantic, no-JavaScript fallbacks.
- Optional integrations are disabled by default: enable approved feature flags and environment variables before consent-gated analytics can run. Form configuration remains a placeholder until an approved client-specific form pattern is added.
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
- [Content authoring](docs/content.md)
- [Design system](docs/design-system.md)
- [Pattern preview workflow](docs/pattern-previews.md)
- [Footer-01 reusable pattern](docs/component-library/footer-01.md)
- [Footer-02 reusable pattern](docs/component-library/footer-02.md)
- [Semantic DOM, SEO, AEO, and GEO](docs/DOM_ARCHITECTURE.md)
- [Integrations and privacy](docs/integrations.md)
- [Animation](docs/animation.md)
- [Testing and contribution](docs/testing.md)

## Package-manager policy

Use pnpm only. Do not add `package-lock.json` or install dependencies with npm alongside `pnpm-lock.yaml`; a single lockfile keeps local and CI dependency resolution reproducible.

During routine maintenance and before release, run `pnpm audit --prod` when network access is available. Review and resolve applicable findings manually; dependency updates are not automated by this starter.
