import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Footer01 from '../../src/components/site/Footer-01.astro?container';

const routePath = fileURLToPath(new URL('../../src/pages/[...slug].astro', import.meta.url));
const pageContentPath = fileURLToPath(new URL('../../src/content/pages/es/', import.meta.url));

function footerMarkup(html: string): string {
  return html.slice(html.indexOf('<footer'));
}

describe('Footer-01 consent preferences', () => {
  it('renders the action when enabled', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer01, {
      props: { showConsentPreferences: true },
    });

    expect(footerMarkup(html)).toContain('class="footer-01__consent-button"');
    expect(footerMarkup(html)).toContain('type="button"');
    expect(footerMarkup(html)).toContain('data-open-consent');
    expect(footerMarkup(html)).toContain('Gestionar cookies');
  });

  it('omits the action by default', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer01);

    expect(footerMarkup(html)).not.toContain('footer-01__consent-button');
    expect(footerMarkup(html)).not.toContain('data-open-consent');
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
