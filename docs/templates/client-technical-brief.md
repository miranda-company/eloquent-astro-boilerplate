# Client setup brief

> Duplicate this file into a private client repository as `docs/client-brief.md`. Complete the fields before asking a coding agent to configure the boilerplate. Use `TBD` for an unresolved decision; do not guess or invent client requirements.

## Project

| Field                | Answer                  |
| -------------------- | ----------------------- |
| Client name          | `[Name]`                |
| Project / website    | `[Name]`                |
| Brief status         | `Draft / Approved`      |
| Decision owner       | `[Name and role]`       |
| Figma / brand source | `[URL]`                 |
| Production domain    | `[https://example.com]` |
| Default language     | `es / other`            |

## Goal and audience

**What should this website achieve?**

`[One or two sentences.]`

**Who is it for?**

`[Primary audience, market, and language.]`

**Primary action we want visitors to take**

`[Contact, book, buy, subscribe, visit, etc.]`

## Site structure

| Route         | Page purpose | Navigation label        | Indexable? | Content ready? |
| ------------- | ------------ | ----------------------- | ---------- | -------------- |
| `/`           | `[Purpose]`  | `Inicio`                | `Yes`      | `Yes / No`     |
| `[Add route]` | `[Purpose]`  | `[Label / footer only]` | `Yes / No` | `Yes / No`     |

**Required legal pages:** `Aviso legal / Política de privacidad / Política de cookies`

**Redirects or existing URLs to preserve:**

`[None / list old URL → new URL]`

## Brand and design system

| Item                                | Answer                                                   |
| ----------------------------------- | -------------------------------------------------------- |
| Logo SVG path/source                | `[Path or URL]`                                          |
| Icon SVG path/source                | `[Path or URL]`                                          |
| Logo intrinsic dimensions           | `[width × height]`                                       |
| Icon intrinsic dimensions           | `[width × height]`                                       |
| Font family and source/licence      | `[System font / details]`                                |
| Colour palette source               | `[Figma URL / file path]`                                |
| Optional tertiary/quaternary roles? | `No / list roles and purpose`                            |
| Token exceptions                    | `[None / spacing, radius, elevation, container changes]` |

**Design-system approval status:** `Not started / In review / Approved`

## SEO and search visibility

| Item                            | Answer                                                               |
| ------------------------------- | -------------------------------------------------------------------- |
| Default site title              | `[Title]`                                                            |
| Default meta description        | `[Description]`                                                      |
| Default social image            | `[Public path / TBD]`                                                |
| Routes that must not be indexed | `[/design-system/ and any others]`                                   |
| Page-specific SEO requirements  | `[None / details]`                                                   |
| Schema candidates               | `[None / Organization, Article, FAQPage, BreadcrumbList with route]` |

Only list schema for visible, indexable content that truthfully exists on the page.

## Features and integrations

| Feature                   | Required?             | Approved provider / decision     | Configuration owner |
| ------------------------- | --------------------- | -------------------------------- | ------------------- |
| Contact form              | `Yes / No`            | `[Endpoint provider / TBD]`      | `[Name]`            |
| Analytics                 | `Yes / No`            | `[GA / GTM / none]`              | `[Name]`            |
| Cookie consent            | `Yes / No`            | `[Built-in / approved platform]` | `[Name]`            |
| CMS                       | `No / TBD / provider` | `[Decision]`                     | `[Name]`            |
| Other third-party service | `No / details`        | `[Decision]`                     | `[Name]`            |

**Privacy or legal requirements:**

`[Consent rules, regions, required wording, data restrictions, or TBD.]`

Never place private API keys, credentials, or secrets in the repository or a `PUBLIC_` environment variable.

## Technical constraints

- Hosting / deployment owner: `[Provider and owner]`
- Required browser, accessibility, or performance requirement: `[None / details]`
- Approved additions beyond the boilerplate: `[None / list and reason]`
- Explicit exclusions: `[For example: no CMS, no animation library, no client framework]`

## Agent instructions

Use this prompt after completing the brief:

```text
Read AGENTS.md, docs/client-project-workflow.md, docs/client-setup.md,
docs/DOM_ARCHITECTURE.md, and docs/client-brief.md.

Configure the Astro boilerplate from the approved client brief. Update
site.config.ts, brand assets, tokens, environment placeholders, and relevant
Spanish content only where the brief supplies an approved decision. Keep static
output and do not add dependencies or integrations not approved in the brief.

Report unresolved TBD items instead of guessing. Update tests and documentation
when implementation behavior changes. Run pnpm run verify and relevant
pnpm run test:e2e coverage before handoff.
```

## Approval checklist

- [ ] Domain, language, navigation, and primary action are confirmed.
- [ ] Brand assets, font, and palette source are available.
- [ ] SEO defaults and no-index routes are confirmed.
- [ ] Form, analytics, consent, and privacy decisions are approved or explicitly deferred.
- [ ] Unresolved items are marked `TBD` with an owner.
