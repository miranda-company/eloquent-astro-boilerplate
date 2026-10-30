import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Footer02 from '../../src/components/site/Footer-02.astro?container';

function footerMarkup(html: string): string {
  return html.slice(html.indexOf('<footer'));
}

describe('Footer-02', () => {
  it('renders supplied navigation and decorative social placeholders', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer02, {
      props: {
        pages: [{ label: 'Servicios', href: '/servicios/' }],
        socialLinks: [{ label: 'Instagram', href: 'https://www.instagram.com/' }],
        legalEntity: 'Cliente S.L.',
      },
    });
    const footer = footerMarkup(html);

    expect(footer).toContain('aria-label="Páginas"');
    expect(footer).toContain('loading="lazy"');
    expect(footer).toContain('href="/servicios/"');
    expect(footer).toContain('aria-label="Síguenos"');
    expect(footer).toContain('aria-label="Instagram"');
    expect(footer).toContain('footer-02__social-icon');
    expect(footer).toContain('aria-hidden="true"');
    expect(footer).toContain('Cliente S.L.');
  });

  it('omits optional navigation and consent control by default', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer02);
    const footer = footerMarkup(html);

    expect(footer).not.toContain('footer-02__pages');
    expect(footer).not.toContain('footer-02__social');
    expect(footer).not.toContain('footer-02__consent-button');
  });

  it('renders the consent-preferences action when enabled', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer02, {
      props: { showConsentPreferences: true },
    });
    const footer = footerMarkup(html);

    expect(footer).toContain('class="footer-02__consent-button"');
    expect(footer).toContain('type="button"');
    expect(footer).toContain('data-open-consent');
  });
});
