# Client setup checklist

Use this checklist when duplicating the boilerplate for a client. The project defaults to Spanish routes and content; source code, configuration, schemas, and documentation stay in English.

## 1. Configure the client

Edit `src/config/client-config.ts` first.

- Set `name`, canonical `url`, contact details, social links, navigation, and SEO defaults. Add `seo.defaultOgImage` only when an approved default social image is available.
- Set `brand.logo` and `brand.icon` to the public asset paths, and record each SVG's intrinsic `logoWidth`, `logoHeight`, `iconWidth`, and `iconHeight`.
- Review feature flags. `analytics`, `contactForm`, and `consentBanner` are disabled in the untouched starter and control optional behavior only after approval. `stickyHeader` and `backToTop` are enabled by default; turn either off when the approved client design does not need it. `designSystemHomepage` keeps the temporary root preview out of the sitemap; `wireframe` is for temporary layout review only.
- Keep feature flags explicit. A flag is not a substitute for required environment configuration.

## 2. Add assets and fonts

1. Replace `public/brand/brand-logo.svg` and `public/brand/brand-icon.svg` with single-colour vector SVGs. Update `siteConfig.brand` if the names, paths, or intrinsic dimensions change.
2. Prepare final web-ready raster derivatives before adding them to the project: choose format, dimensions, crop, and compression. Store them in `public/images/`; Astro copies these assets unchanged.
3. Keep original source assets in the agency asset library, not in the public build. When you prepare responsive variants, add deliberate `srcset` and `sizes` values in the native `<img>` or `<picture>` markup.
4. Confirm every typography token has `mobile` and `desktop` values in the approved Figma file. Mobile is the base scale; desktop activates at `--lg`. Keep only approved available normal Google Font weights in that snapshot; italic loading requires a separate Figma token contract.
5. Confirm the header logo, monochrome brand preview, loaded Google Fonts, and fallback typography render correctly.
6. Confirm the sticky header, back-to-top link, and in-page hash links work at the approved breakpoints. The back-to-top control must remain behind the cookie banner while consent is pending.

## 3. Configure tokens from Figma

1. Confirm the approved Figma file, token collections, modes, and any client-specific variable changes with the design owner.
2. Replace `src/config/figma-tokens.json` with the approved Figma variable export. Preserve variable names and mode values; do not hand-edit token values in `client-config.ts`.
3. Use the internal preview to review the resulting CSS names, values, and modes. See [design-system.md](design-system.md) for the export and validation rules.
4. Add missing token roles to Figma and get design approval before adding their values to code. Do not invent code-only tokens.
5. Verify the Figma font-family and weight tokens against the selected Google Font before export.
6. Keep the approved Figma project link and direct component/frame links in the relevant pattern document under `docs/component-library/`. Component synchronization is a separate workflow.

## 4. Add content and legal copy

1. Replace the Spanish sample entries in `src/content/pages/es/`.
2. Keep every frontmatter field valid. The build validates collection entries.
3. Configure `siteConfig.legal.pages` for the required legal routes and labels. The footer uses this configuration; do not duplicate those links in the component. When consent is enabled, its adjacent “Gestionar cookies” control is an action button that reopens preferences, not a configured legal route.
4. Replace `Aviso legal`, `Política de privacidad`, and `Política de cookies` with client-approved legal copy before launch. Keep the `legal.navigation` entries and MDX section IDs aligned, add only verified summary facts, and remove the approval notice once the text is signed off.
5. Keep unfinished pages as `draft: true` so they do not generate public routes.

## 5. Configure optional integrations

Copy `.env.example` to `.env` only when an integration is approved. Leave unrelated values empty.

- `PUBLIC_FORM_ENDPOINT` is reserved for a future approved client-specific form pattern; it does not enable a built-in form.
- `PUBLIC_GA_MEASUREMENT_ID` enables Google Analytics after consent.
- `PUBLIC_GTM_CONTAINER_ID` enables Google Tag Manager after consent.

Enable both `analytics` and `consentBanner` only after the provider and privacy requirements are approved and a GA or GTM identifier is configured. Keep `contactForm` and `PUBLIC_FORM_ENDPOINT` disabled and empty until an approved client-specific form pattern exists.

Read [integrations.md](integrations.md) before configuring a provider. A future form pattern requires approval of its provider, privacy treatment, and non-JavaScript submission path before it is implemented.

## 6. Configure approved motion

Use GSAP or ScrollTrigger only when the client brief defines the motion intent, affected routes, reduced-motion behavior, and performance budget.

1. Read [animation.md](animation.md) before implementation.
2. Import `src/scripts/animation/gsap.ts` only from the owning component or page script; do not add it to a global layout or site-wide script.
3. Use `createMotionContext()` so animations respect reduced-motion preferences and clean up correctly.
4. Keep meaningful content in its final readable state without JavaScript. Test normal, reduced-motion, keyboard, and no-JavaScript behavior.

## 7. Review responsive behavior

Breakpoints are build-time custom-media aliases in `src/styles/breakpoints.css`, not values in `client-config.ts`. The shared wrapper rules live in `src/styles/global.css`; component-specific responsive rules stay beside their modules and use the same aliases. Start with compact base styles and add positive aliases such as `@media (--lg)` as the layout expands; use `--below-*` aliases only for rules that must apply strictly below a threshold. Do not duplicate breakpoints in client configuration. If the scale changes, update the aliases once and review every responsive layout at compact, medium, expanded, large, and extra-large widths.

## 8. Verify before handoff

1. Set `siteConfig.features.wireframe` to `false`.
2. Run `pnpm run verify`.
3. Run `pnpm run test:e2e`.
4. Inspect the production output locally with `pnpm run preview`.
5. Confirm the public homepage, legal routes, consent behavior, metadata, sitemap, and `robots.txt`.
6. Verify integrations in both states: with features disabled, confirm there is no consent UI, analytics loader, or third-party request; with an approved feature enabled, confirm its provider behavior and legal disclosures. Test a future form pattern against its separately approved submission and fallback contract.
7. For any GSAP or ScrollTrigger component, verify normal, reduced-motion, keyboard, and no-JavaScript states.

## Move the design-system preview at project kickoff

The boilerplate uses `/` as an internal, no-index preview. Once the public homepage is ready:

1. Create `src/pages/design-system.astro` from the current `src/pages/index.astro` and keep `noindex` enabled.
2. Replace `src/pages/index.astro` with the public homepage using client-specific page components.
3. Set `siteConfig.features.designSystemHomepage` to `false`. The sitemap then includes `/` and continues to exclude `/design-system/`.
4. Update or add route tests, then run the full verification commands again.

The internal `/patterns/` routes remain available after this move. They are independently `noindex` and excluded from the sitemap; see [pattern previews](pattern-previews.md).

## Adding another language

Add the locale to `supportedLocales`, extend the content schema deliberately, create matching collection content, and introduce localized routing as a separate implementation change. Do not add a locale code without adding its content and routing strategy.
