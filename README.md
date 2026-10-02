# Eloquent Astro Boilerplate

A static-first, white-label Astro starter for Spanish marketing sites. It combines strict TypeScript, local Markdown/MDX content, Tailwind CSS, semantic CSS custom-property tokens, accessible client-side enhancements, and a no-index design-system preview.

## What is included

- Astro static output with strict TypeScript and local Content Collections.
- Typed client configuration in `src/config/site.config.ts`.
- Manual raw palettes mapped to stable semantic colour roles.
- Configurable type, spacing, sizing, radius, elevation, and container tokens.
- A no-index design-system preview for tokens, components, brand assets, elevation, shape, and breakpoints.
- Spanish starter content and legal-page placeholders.
- Optional consent-gated analytics and provider-agnostic native contact form support.
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
- [Semantic DOM, SEO, AEO, and GEO](docs/DOM_ARCHITECTURE.md)
- [Integrations and privacy](docs/integrations.md)
- [Testing and contribution](docs/testing.md)

## Package-manager policy

Use pnpm only. Do not add `package-lock.json` or install dependencies with npm alongside `pnpm-lock.yaml`; a single lockfile keeps local and CI dependency resolution reproducible.
