# Content authoring

Before authoring or editing rendered page content, read [DOM architecture](DOM_ARCHITECTURE.md). In particular, do not add a second `h1` to a content entry rendered by a route that already supplies the page title. Use sequential headings and keep question headings immediately followed by their concise answers when writing answer-oriented content.

All starter content is local and validated through Astro Content Collections. Source code and schemas are English; starter content and current routes are Spanish.

## Where content lives

Place page content under `src/content/pages/{locale}/`:

```text
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
template: standard
```

`slug` creates a public route through `[...slug].astro`. Set `draft: true` to keep an entry out of generated routes.

## Markdown or MDX

Use Markdown for ordinary editorial and legal content. Use MDX only when a page needs intentionally selected Astro markup or components. Do not use MDX to hide site-wide configuration inside content.

Keep client identity, URLs, contact details, navigation, and feature flags in `client-config.ts`, not in frontmatter. Keep design tokens in the Figma export. Keep reusable layout and UI in components, not copied across MDX files.

## New content types

Before adding a new collection or content field:

1. Update `src/content.config.ts` with the Zod schema.
2. Add representative content entries.
3. Add or update the consuming route/component.
4. Add tests when the change affects public routes or behavior.
5. Run `pnpm run check` to validate the collection.

## Legal content

The three legal pages are placeholders, not legal advice. Replace them with client-approved copy before launch and verify the page descriptions, navigation links, and actual cookies/services match the approved text.

Legal pages use `template: legal` and require a `legal` object in their frontmatter:

```yaml
template: legal
legal:
  intro: 'A concise, visible description of the document.'
  updated: '10 de octubre de 2026' # Optional; publish only an approved date.
  notice: # Optional; remove after approval.
    title: 'Pendiente de validación jurídica'
    text: 'Explain what remains to be approved.'
  summary: # Optional; use only verified facts.
    - label: 'Responsable'
      value: 'Approved legal entity name'
  navigation:
    - id: responsable
      label: 'Responsable del tratamiento'
```

Each `navigation.id` must match a stable section ID in the MDX body. Use the following semantic pattern, with one `h2` per legal section:

```mdx
<section id="responsable" aria-labelledby="responsable-title">
  <h2 id="responsable-title">Responsable del tratamiento</h2>
  <p>Start with a concise, factual answer or explanation.</p>
</section>
```

The layout renders the document `h1`; never add an `h1` to a legal entry. Keep the table-of-contents list and section IDs aligned. Use a semantic `<table>` with a `<caption>` and column scopes for a cookie inventory. Keep `summary` facts and `updated` dates empty until they are verified rather than publishing placeholders as facts.
