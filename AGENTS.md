# Working agreement

## Project boundaries

- Keep source code, schemas, configuration, and documentation in English. Keep starter-facing content and routes in Spanish unless internationalization is deliberately introduced.
- Preserve static output. Add server rendering only after hosting, data, privacy, and caching requirements are explicit.
- Prefer local content, static assets, and isolated client JavaScript. Do not add a client framework, global state store, scroll library, or transition library without a documented need.
- Use pnpm only. Preserve `pnpm-lock.yaml`; do not add an npm lockfile or install dependencies with npm.

## Configuration and design system

- Read `src/config/site.config.ts` before introducing client-wide identity, URLs, contacts, feature flags, palettes, or theme values.
- Keep configured public SVG brand paths and their intrinsic dimensions together in `siteConfig.brand`. Put an approved default social image in `siteConfig.seo.defaultOgImage`, not in component markup.
- Use semantic Tailwind roles and shared CSS tokens. Do not hard-code client colour, spacing, radius, or elevation values in components when a token fits.
- Keep raw palettes out of ordinary component markup. Components consume semantic roles; raw values are for design inventory and approved exceptions.
- Keep build-time breakpoints in `src/styles/global.css`, not `site.config.ts`.
- Update `docs/design-system.md` and the design-system preview when changing the token model, component conventions, or visual reference.
- Follow the mandatory semantic, metadata, AEO/GEO, media, and JSON-LD rules in [`docs/DOM_ARCHITECTURE.md`](docs/DOM_ARCHITECTURE.md). Read it before changing a page, layout, or rendered-content component.
- Keep canonical, social metadata, and optional JSON-LD in `BaseLayout.astro`; do not duplicate document-head metadata in routes or components.

## Content and integrations

- Update Content Collection schemas before creating a new content type or frontmatter field.
- Keep client configuration out of Markdown and MDX frontmatter.
- Optional integrations must emit no external request when unconfigured. Optional tracking must never load before consent.
- Preserve a usable non-JavaScript form submission path when changing the contact-form integration.

## Quality and documentation

- Keep README and relevant `docs/` guides in sync with implementation changes; remove stale behavior descriptions instead of leaving historical notes.
- Follow [`docs/client-project-workflow.md`](docs/client-project-workflow.md) when starting a client implementation; do not start production-page work before the client configuration and design-system milestone is complete.
- Add or update deterministic tests for public routes, shared interactions, schemas, integrations, and token behavior.
- Run `pnpm run verify` and relevant Playwright coverage before handing off changes.
- Set `siteConfig.features.wireframe` to `false` before a production release.
