import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const legalRoutes = ['/aviso-legal/', '/politica-de-privacidad/', '/politica-de-cookies/'];

test('design-system homepage is noindex, keyboard-accessible, and has no default third-party requests', async ({
  page,
}) => {
  const thirdPartyRequests: string[] = [];
  page.on('request', (request) => {
    if (/googletagmanager|google-analytics/.test(request.url()))
      thirdPartyRequests.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Design System' })).toBeVisible();
  await expect(page.getByText('This is the design system of eloquent.')).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Tokens' })).toBeVisible();
  await expect(
    page.getByText(
      'This are the variables from the figma file and their corresponding css classes.',
    ),
  ).toBeVisible();
  await expect(page.locator('.ds-tokens__grid > .ds-tokens__card')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 3, name: 'font-size-xs' })).toBeVisible();
  await expect(page.getByText('CSS custom property:')).toBeVisible();
  await expect(page.locator('.ds-tokens__css-name code')).toHaveText('--font-size-xs');
  await expect(page.locator('.ds-tokens__value')).toHaveText('desktop: 8px');
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('body > header')).toHaveCount(1);
  await expect(page.locator('body > main#contenido')).toHaveCount(1);
  await expect(page.locator('body > footer')).toHaveCount(1);
  await expect(page.locator('.site-header > .site-header__wrapper.wrapper')).toHaveCount(1);
  await expect(page.locator('.site-footer > .wrapper > .site-footer__inner')).toHaveCount(1);
  await expect(page.locator('main > section > .wrapper')).toHaveCount(2);
  await expect(
    page.locator(
      'main > section.design-system-preview__intro > .design-system-preview__wrapper.wrapper',
    ),
  ).toHaveCount(1);
  await expect(page.locator('main > section.ds-tokens > .ds-tokens__wrapper.wrapper')).toHaveCount(
    1,
  );
  const wireBorder = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.border = 'var(--wire-size) solid var(--color-wire)';
    document.body.append(probe);
    const computed = getComputedStyle(probe);
    const result = { width: computed.borderTopWidth, color: computed.borderTopColor };
    probe.remove();
    return result;
  });
  await expect(page.locator('.site-header')).toHaveCSS('padding-top', '16px');
  await expect(page.locator('.site-footer')).toHaveCSS('padding-top', '40px');
  await expect(page.locator('main > section').first()).toHaveCSS('padding-top', '80px');
  await expect(page.locator('html')).toHaveClass(/(?:^|\s)site(?:\s|$)/);
  await expect(page.locator('html')).toHaveClass(/site--sticky-header/);
  await expect(page.locator('html')).toHaveClass(/site--wireframe/);
  await expect(page.locator('body')).toHaveAttribute('id', 'top');
  await expect(page.locator('.back-to-top')).toHaveAttribute('href', '#top');
  await expect(page.locator('body > header nav')).toHaveCount(0);
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '64px');
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-top', '0px');
  await expect(page.locator('.wrapper').first()).toHaveCSS('border-width', wireBorder.width);
  await expect(page.locator('.wrapper').first()).toHaveCSS('border-color', wireBorder.color);
  await expect(page.locator('.design-system-preview__intro')).toHaveCSS(
    'border-width',
    wireBorder.width,
  );
  await expect(page.locator('.design-system-preview__intro')).toHaveCSS(
    'border-color',
    wireBorder.color,
  );
  await expect(page.locator('.wrapper').first()).toHaveCSS('outline-style', 'none');
  await expect(page.locator('.site-footer__inner')).toHaveCSS('display', 'grid');
  await expect(page.locator('.back-to-top')).toHaveCSS('position', 'fixed');
  await expect(page.locator('.container')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Nombre del cliente' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('img', { name: 'Nombre del cliente' })).toHaveAttribute(
    'src',
    '/brand/brand-logo.svg',
  );
  await expect(page.getByRole('img', { name: 'Nombre del cliente' })).toHaveAttribute(
    'width',
    '1620',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://example.com/',
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://example.com/',
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    'Nombre del cliente',
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  await page.getByText('Saltar al contenido').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#contenido')).toBeFocused();
  await expect(page.locator('html')).toHaveCSS('--font-family-body', '"Helvetica Neue"');
  await page.setViewportSize({ width: 768, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '64px');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '32px');
  await page.setViewportSize({ width: 1600, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('max-width', '1440px');
  expect(
    await page
      .locator('.site-footer__inner')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(2);
  expect(thirdPartyRequests).toEqual([]);
});

for (const route of legalRoutes)
  test(`legal page renders: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('article')).toHaveCount(1);
    const layoutRegionsHaveWrappers = await page
      .locator('.legal-page > header, .legal-page > section')
      .evaluateAll((regions) =>
        regions.every((region) => region.querySelector(':scope > .wrapper')),
      );
    expect(layoutRegionsHaveWrappers).toBe(true);
    await expect(page.locator('body > footer address')).toHaveCount(1);
    await expect(page.locator('body > footer nav ul > li')).toHaveCount(3);
    await expect(page.locator('.legal-page__toc nav')).toHaveCount(1);
    await expect(page.locator('.legal-page__toc a')).toHaveCount(4);
    await expect(page.locator('.legal-page__article > section')).toHaveCount(4);
    const targets = await page
      .locator('.legal-page__toc a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    for (const target of targets) await expect(page.locator(target ?? '')).toHaveCount(1);
  });

test('default optional integrations stay inactive', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#consent-banner')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Gestionar cookies' })).toHaveCount(0);
  await expect(page.locator('[data-analytics-loader]')).toHaveCount(0);
});

test('homepage has no critical accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
