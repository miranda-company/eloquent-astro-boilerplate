# Integrations and privacy

All integrations are opt-in and provider-agnostic by default. Public environment values are validated by Astro in `astro.config.ts`; feature flags in `site.config.ts` determine whether the related component can run.

## Environment variables

Copy `.env.example` to `.env` only when an approved integration needs it.

| Variable                   | Purpose                                 | Required condition                                    |
| -------------------------- | --------------------------------------- | ----------------------------------------------------- |
| `PUBLIC_FORM_ENDPOINT`     | Native HTML form `POST` destination     | Contact form feature enabled                          |
| `PUBLIC_GA_MEASUREMENT_ID` | Google Analytics identifier             | Analytics feature enabled and visitor accepts consent |
| `PUBLIC_GTM_CONTAINER_ID`  | Google Tag Manager container identifier | Analytics feature enabled and visitor accepts consent |

These values are public by design. Never place API keys, secrets, provider private keys, or credentials in a `PUBLIC_` variable.

## Consent and analytics

`ConsentManager.astro` stores the visitor choice in `localStorage` under `site-cookie-consent`. Optional analytics is loaded only when all of the following are true:

1. `siteConfig.features.analytics` is enabled.
2. `siteConfig.features.consentBanner` is enabled.
3. A GA or GTM identifier is configured.
4. The visitor accepts, or previously accepted, optional cookies.

When identifiers are absent, the generated page includes no analytics request. Configure either GA or GTM unless a reviewed implementation explicitly requires both. The footer control lets visitors reopen the consent choices.

## Contact form

The contact form renders only when `siteConfig.features.contactForm` and `PUBLIC_FORM_ENDPOINT` are both present. It works as a normal HTML `POST` without JavaScript.

With JavaScript enabled, the form uses `fetch()` to show a semantic pending, success, or error status and exposes `aria-busy` while a submission is in progress. The provider endpoint must allow CORS and return a successful response for this enhancement to work. If enhancement fails, the user sees a message directing them to the configured email fallback; verify the endpoint and fallback manually before launch.

## Provider replacement

To use another analytics, consent, or form provider, replace the related component rather than adding an unscoped global script. Preserve these guarantees:

- Optional tracking never loads before consent.
- Disabled or unconfigured integrations emit no unnecessary request.
- Form submission has a meaningful fallback.
- Legal pages accurately disclose the services in production.

## Launch review

Before launch, inspect the production build and browser network panel with integrations unset and configured. Confirm the legal copy, consent language, actual cookies, analytics requests, and form provider behavior with the client’s privacy and legal owners.
