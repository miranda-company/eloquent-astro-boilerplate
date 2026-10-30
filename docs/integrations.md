# Integrations and privacy

All integrations are opt-in and provider-agnostic by default. Public environment values are validated by Astro in `astro.config.ts`; feature flags in `client-config.ts` determine whether the related component can run.

## Environment variables

Copy `.env.example` to `.env` only when an approved integration needs it.

| Variable                   | Purpose                                 | Required condition                                    |
| -------------------------- | --------------------------------------- | ----------------------------------------------------- |
| `PUBLIC_FORM_ENDPOINT`     | Reserved future form-provider endpoint  | Approved client-specific form pattern                 |
| `PUBLIC_GA_MEASUREMENT_ID` | Google Analytics identifier             | Analytics feature enabled and visitor accepts consent |
| `PUBLIC_GTM_CONTAINER_ID`  | Google Tag Manager container identifier | Analytics feature enabled and visitor accepts consent |

These values are public by design. Never place API keys, secrets, provider private keys, or credentials in a `PUBLIC_` variable.

## Consent and analytics

`ConsentManager.astro` stores the visitor choice in `localStorage` under `site-cookie-consent`. Optional analytics is loaded only when all of the following are true:

1. `siteConfig.features.analytics` is enabled.
2. `siteConfig.features.consentBanner` is enabled.
3. A GA or GTM identifier is configured.
4. The visitor accepts, or previously accepted, optional cookies.

When identifiers are absent, the generated page includes no analytics request. Configure either GA or GTM unless a reviewed implementation explicitly requires both. The untouched starter keeps analytics and consent disabled. When consent is enabled, the footer exposes “Gestionar cookies” beside the legal navigation as a button; it lets visitors reopen the consent choices without pretending to navigate to another document.

## Future contact form

The starter does not currently ship a contact-form component, HTML form, client-side `fetch()` enhancement, CORS integration, or email fallback. `siteConfig.features.contactForm` and `PUBLIC_FORM_ENDPOINT` remain disabled placeholders so an approved client-specific form pattern has a defined configuration seam.

Before adding that pattern, approve the provider, privacy and legal disclosures, data handling, email destination, and a usable non-JavaScript submission path. Add deterministic coverage for the configured and unconfigured states; introduce browser enhancement only when the provider contract requires it.

## Provider replacement

To use another analytics or consent provider, replace the related component rather than adding an unscoped global script. A future form pattern must use the same scoped approach. Preserve these guarantees:

- Optional tracking never loads before consent.
- Disabled or unconfigured integrations emit no unnecessary request.
- Any approved form submission has a meaningful fallback.
- Legal pages accurately disclose the services in production.

## Launch review

Before launch, inspect the production build and browser network panel with integrations unset and configured. Confirm the legal copy, consent language, actual cookies, analytics requests, and any approved form-provider behavior with the client’s privacy and legal owners.
