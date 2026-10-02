# Content authoring

Before authoring or editing rendered page content, read [DOM architecture](DOM_ARCHITECTURE.md). In particular, do not add a second `h1` to a content entry rendered by a route that already supplies the page title. Use sequential headings and keep question headings immediately followed by their concise answers when writing answer-oriented content.

All starter content is local and validated through Astro Content Collections. Source code and schemas are English; starter content and current routes are Spanish.

## Where content lives

Place page content under `src/content/pages/{locale}/`:

```text
src/content/pages/es/home.mdx
src/content/pages/es/legal-notice.md
src/content/pages/es/privacy.md
src/content/pages/es/cookies.md
```

The collection loader accepts Markdown (`.md`) and MDX (`.mdx`). The current schema is defined in `src/content.config.ts`.

## Required frontmatter

Every entry must include:

```yaml
title: 'Page title'
description: 'Concise page description for metadata'
locale: es
```

Optional fields:

```yaml
slug: public-route-segment
draft: false
```

`slug` creates a public route through `[...slug].astro`. Set `draft: true` to keep an entry out of generated routes. The `es/home` entry is reserved for homepage content and is not routed through the catch-all page.

## Markdown or MDX

Use Markdown for ordinary editorial and legal content. Use MDX only when a page needs intentionally selected Astro markup or components. Do not use MDX to hide site-wide configuration inside content.

Keep client identity, URLs, contact details, navigation, colours, and feature flags in `site.config.ts`, not in frontmatter. Keep reusable layout and UI in components, not copied across MDX files.

## New content types

Before adding a new collection or content field:

1. Update `src/content.config.ts` with the Zod schema.
2. Add representative content entries.
3. Add or update the consuming route/component.
4. Add tests when the change affects public routes or behavior.
5. Run `pnpm run check` to validate the collection.

## Legal content

The three legal pages are placeholders, not legal advice. Replace them with client-approved copy before launch and verify the page descriptions, navigation links, and actual cookies/services match the approved text.
