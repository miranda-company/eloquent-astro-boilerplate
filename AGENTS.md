# Working agreement

## Project boundaries

- Keep source code, schemas, configuration, and documentation in English. Keep starter-facing content and routes in Spanish unless internationalization is deliberately introduced.
- Preserve static output. Add server rendering only after hosting, data, privacy, and caching requirements are explicit.
- Prefer local content, static assets, and isolated client JavaScript. GSAP and ScrollTrigger are supported only as component-scoped enhancements; read [`docs/animation.md`](docs/animation.md) before using them. Keep client frameworks, global state stores, scroll-jacking, and transition runtimes out of the starter unless a documented need changes the architecture.
- Use pnpm only. Preserve `pnpm-lock.yaml`; do not add an npm lockfile or install dependencies with npm.

## Configuration and design system

- Read `src/config/client-config.ts` before introducing client identity, URLs, contacts, feature flags, brand assets, or site metadata. Read `docs/design-system.md` before changing the Figma token snapshot or token usage.
- Keep configured public SVG brand paths and their intrinsic dimensions together in `siteConfig.brand`. Put an approved default social image in `siteConfig.seo.defaultOgImage`, not in component markup.
- Use final, manually optimised assets from `public/images/` with native responsive image markup. Keep source files in the agency asset library; do not use Astro image transformations in this starter.
- Use CSS custom properties derived from the approved Figma variables. Do not invent code-only design tokens or hard-code client colour, spacing, or radius values when a Figma token fits.
- When building from supplied images, videos, or URLs, use approved Figma tokens, existing patterns, layout primitives, icons, and assets. Surface any needed token, style, animation, component variant, dependency, or asset treatment outside that system for human approval before proceeding.
- Prefer semantic Figma tokens when selecting values, especially spacing roles such as `--spacing-xs`, `--spacing-sm`, `--spacing-md`, and `--spacing-lg`. Use numbered primitive spacing tokens only when no semantic token expresses the required value or role. Preserve generic primitive names so clients replace values rather than rename them.
- Components consume semantic color roles; use semantic tokens first in other categories where available, and primitives when no suitable semantic token exists.
- Use Figma-approved Lucide icons through direct `@lucide/astro` imports for functional UI icons. Keep brand marks and bespoke artwork as approved local assets.
- Use Google Fonts through Figma font tokens: `font-family-title`, `font-family-body`, and the normal `font-weight-*` scale. Keep only approved available Google Font weights in Figma; add italic loading only after its Figma token contract is defined.
- Keep build-time breakpoint aliases in `src/styles/breakpoints.css`, not client configuration. Use its named mobile-first custom-media aliases in authored responsive CSS; see `docs/design-system.md` for their values and usage.
- Use `.wrapper` for shared horizontal layout. Keep the Figma `max-width-2xl` size separate from `spacing-wrapper-default`; defaults are `1440px` maximum width, `64px` desktop padding, and `18px` mobile padding. Keep responsive mode activation in authored CSS.
- Structure top-level content as section/header/footer for vertical spacing, then a `.wrapper` for horizontal padding and centering, then the content. Give both the outer region and inner wrapper a BEM class alongside shared `.section` and `.wrapper` layout classes. Keep vertical padding off `.wrapper`.
- Choose HTML elements for the content's meaning, not for visual styling. Use `<article>` only for self-contained content that makes sense independently and could be shared as a standalone item; use `<div>` for cards or containers that are only visual groupings. Do not use semantic elements as generic styling wrappers.
- Name authored CSS classes with BEM: `block`, `block__element`, and `block--modifier`. Pair them only with the shared layout primitives `.wrapper`, `.section`, `.stack`, `.stack-xs`, and `.grid`; add another primitive only after the same token-based behavior appears in two real patterns. Keep all other layout rules component-scoped.
- Update `docs/design-system.md` and the design-system preview when changing the token model, component conventions, or visual reference.
- Follow the mandatory semantic, metadata, AEO/GEO, media, and JSON-LD rules in [`docs/DOM_ARCHITECTURE.md`](docs/DOM_ARCHITECTURE.md). Read it before changing a page, layout, or rendered-content component.
- Keep canonical, social metadata, and optional JSON-LD in `BaseLayout.astro`; do not duplicate document-head metadata in routes or components.
- Add reusable components only for a proven, repeatable need. Each pattern requires an approved Figma reference, a clear typed content interface, semantic HTML, BEM classes, Figma-derived tokens, scoped styles, and deterministic coverage for public behavior.
- Document every reusable pattern in its own lowercase kebab-case file at `docs/component-library/<pattern-name>.md`. Keep its Figma reference, implementation path, interface, semantic/accessibility rules, token and responsive behavior, assets, usage example, and verification expectations current.

## Content and integrations

- Update Content Collection schemas before creating a new content type or frontmatter field.
- Keep client configuration out of Markdown and MDX frontmatter.
- Read `docs/client-brief.md` when it exists in a client project; treat approved decisions there as the source of truth and report `TBD` items instead of guessing.
- Optional integrations must emit no external request when unconfigured. Optional tracking must never load before consent.
- Preserve a usable non-JavaScript form submission path when changing the contact-form integration.
- Keep the configured sticky header and back-to-top link as progressive enhancements: the header remains usable without JavaScript and the link must retain its `#top` destination.

## Quality and documentation

- Keep README and relevant `docs/` guides in sync with implementation changes; remove stale behavior descriptions instead of leaving historical notes.
- Follow [`docs/client-project-workflow.md`](docs/client-project-workflow.md) when starting a client implementation; do not start production-page work before the client configuration and design-system milestone is complete.
- Add or update deterministic tests for public routes, shared interactions, schemas, integrations, and token behavior.
- Run `pnpm run verify` and relevant Playwright coverage before handing off changes.
- Set `siteConfig.features.wireframe` to `false` before a production release.
