# Client setup checklist

Use this checklist when duplicating the boilerplate for a client. The project defaults to Spanish routes and content; source code, configuration, schemas, and documentation stay in English.

## 1. Configure the client

Edit `src/config/site.config.ts` first.

- Set `name`, canonical `url`, contact details, social links, navigation, and SEO defaults. Add `seo.defaultOgImage` only when an approved default social image is available.
- Set `brand.logo` and `brand.icon` to the public asset paths, and record each SVG's intrinsic `logoWidth`, `logoHeight`, `iconWidth`, and `iconHeight`.
- Review feature flags. `analytics`, `contactForm`, and `consentBanner` control optional behavior; `designSystemHomepage` keeps the temporary root preview out of the sitemap; `wireframe` is for temporary layout review only.
- Keep feature flags explicit. A flag is not a substitute for required environment configuration.

## 2. Add assets and fonts

1. Replace `public/brand/brand-logo.svg` and `public/brand/brand-icon.svg` with single-colour vector SVGs. Update `siteConfig.brand` if the names, paths, or intrinsic dimensions change.
2. Put local raster images in `src/assets/` and render them with Astro image components where appropriate.
3. Update `theme.font-sans` and add the approved font-loading implementation if the client uses a custom font.
4. Confirm the header logo, monochrome brand preview, and fallback typography render correctly.

## 3. Configure colours and tokens

1. Enter the complete supplied palette manually in `siteConfig.colors.palettes`.
2. Map the required UI roles in `siteConfig.colors.semantic`.
3. Add `tertiary` or `quaternary` only when the approved system needs those roles; do not create filler palettes.
4. Review typography, spacing, size, radius, elevation, and container values in `theme`.
5. Use the internal preview to validate token values and semantic colour mappings. See [design-system.md](design-system.md) for the complete rules.

## 4. Add content and legal copy

1. Replace the Spanish sample entries in `src/content/pages/es/`.
2. Keep every frontmatter field valid. The build validates collection entries.
3. Replace `Aviso legal`, `Política de privacidad`, and `Política de cookies` with client-approved legal copy before launch.
4. Keep unfinished pages as `draft: true` so they do not generate public routes.

## 5. Configure optional integrations

Copy `.env.example` to `.env` only when an integration is approved. Leave unrelated values empty.

- `PUBLIC_FORM_ENDPOINT` enables the provider-agnostic contact form.
- `PUBLIC_GA_MEASUREMENT_ID` enables Google Analytics after consent.
- `PUBLIC_GTM_CONTAINER_ID` enables Google Tag Manager after consent.

Read [integrations.md](integrations.md) before configuring a provider. In particular, enhanced form submission needs CORS support; the HTML form POST is the non-JavaScript fallback.

## 6. Review responsive behavior

Breakpoints are build-time Tailwind tokens in `src/styles/global.css`, not values in `site.config.ts`. Do not duplicate them in client configuration. If the scale changes, review every responsive layout at compact, medium, expanded, large, and extra-large widths.

## 7. Verify before handoff

1. Set `siteConfig.features.wireframe` to `false`.
2. Run `pnpm run verify`.
3. Run `pnpm run test:e2e`.
4. Inspect the production output locally with `pnpm run preview`.
5. Confirm the public homepage, legal routes, consent behavior, form fallback, metadata, sitemap, and `robots.txt`.

## Move the design-system preview at project kickoff

The boilerplate uses `/` as an internal, no-index preview. Once the public homepage is ready:

1. Create `src/pages/design-system.astro` from the current `src/pages/index.astro` and keep `noindex` enabled.
2. Replace `src/pages/index.astro` with the public homepage, usually by importing `MarketingHomepage.astro` or client-specific page components.
3. Set `siteConfig.features.designSystemHomepage` to `false`. The sitemap then includes `/` and continues to exclude `/design-system/`.
4. Update or add route tests, then run the full verification commands again.

## Adding another language

Add the locale to `supportedLocales`, extend the content schema deliberately, create matching collection content, and introduce localized routing as a separate implementation change. Do not add a locale code without adding its content and routing strategy.
