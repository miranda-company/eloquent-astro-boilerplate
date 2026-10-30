# Pattern previews

`/patterns/` is the internal visual-testing index for reusable patterns. Each registered pattern has an isolated static route at `/patterns/<slug>/` that renders only its demo component with generated Figma tokens and global CSS.

Pattern previews are always `noindex, nofollow` and excluded from the sitemap. They intentionally omit the public header, default footer, consent manager, scroll controls, analytics, and preview-page chrome so the pattern can be inspected without shell interference.

## Adding a pattern

1. Complete the approved reusable pattern: typed props, semantic HTML, BEM styles, Figma-derived tokens, responsive behavior, deterministic coverage, and its document under `docs/component-library/`.
2. Add one typed entry to `src/config/pattern-previews.ts` with a lowercase kebab-case slug, concise name and description, and realistic Spanish demo props.
3. Use the entry's existing component branch in `src/pages/patterns/[pattern].astro`; add a branch only when a new component type is introduced.
4. Verify the index and route at compact, medium, large, and extra-large widths. Run `pnpm run verify` and `pnpm run test:e2e`.

Do not add preview-only variants, styles, controls, dependencies, or client JavaScript. A preview demonstrates the public component contract; it does not become another component API.
