import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const footerPath = fileURLToPath(
  new URL('../../src/components/site/Footer-01.astro', import.meta.url),
);
const layoutPath = fileURLToPath(new URL('../../src/layouts/BaseLayout.astro', import.meta.url));
const routePath = fileURLToPath(new URL('../../src/pages/[...slug].astro', import.meta.url));
const pageContentPath = fileURLToPath(new URL('../../src/content/pages/es/', import.meta.url));

describe('Footer-01 consent preferences', () => {
  it('renders the action only when explicitly enabled', async () => {
    const footer = await readFile(footerPath, 'utf8');

    expect(footer).toContain('showConsentPreferences?: boolean;');
    expect(footer).toContain('showConsentPreferences = false');
    expect(footer).toMatch(
      /showConsentPreferences && \(\s*<button class="footer-01__consent-button" type="button" data-open-consent>/,
    );
    expect(footer).toContain('Gestionar cookies');
  });

  it('connects the action to the consent feature flag in the document shell', async () => {
    const layout = await readFile(layoutPath, 'utf8');

    expect(layout).toContain('showConsentPreferences={siteConfig.features.consentBanner}');
  });
});

describe('removed starter marketing sample', () => {
  it('does not retain an excluded homepage-content route or source file', async () => {
    const route = await readFile(routePath, 'utf8');
    const pageContent = await readdir(pageContentPath);

    expect(route).not.toContain('id !==');
    expect(pageContent.sort()).toEqual(['cookies.mdx', 'legal-notice.mdx', 'privacy.mdx']);
  });
});
