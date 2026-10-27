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
  await expect(page.getByRole('heading', { level: 1, name: 'Design system' })).toBeVisible();
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('body > header')).toHaveCount(1);
  await expect(page.locator('body > main#contenido')).toHaveCount(1);
  await expect(page.locator('body > footer')).toHaveCount(1);
  await expect(page.locator('html')).toHaveClass(/site--sticky-header/);
  await expect(page.locator('body')).toHaveAttribute('id', 'top');
  await expect(page.locator('.back-to-top')).toHaveAttribute('href', '#top');
  await expect(page.locator('body > header nav')).toHaveCount(0);
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '48px');
  await expect(page.locator('.site-header__inner')).toHaveCSS('display', 'flex');
  await expect(page.locator('.site-footer__inner')).toHaveCSS('display', 'grid');
  await expect(page.locator('.back-to-top')).toHaveCSS('position', 'fixed');
  await expect(page.locator('.design-system-preview__title')).toHaveCSS('font-size', '72px');
  await expect(
    page.getByRole('heading', { level: 2, name: 'A hero built from the design system' }),
  ).toBeVisible();
  await expect(page.locator('.marketing-hero')).toHaveCount(2);
  await expect(page.locator('.marketing-hero__eyebrow').first()).toHaveText('Reusable pattern');
  await expect(page.getByRole('link', { name: 'Explore components' }).first()).toHaveAttribute(
    'href',
    '#components',
  );
  await expect(page.locator('.marketing-hero__title').first()).toHaveCSS('font-size', '72px');
  await expect(page.locator('.marketing-hero__content').first()).toHaveCSS('max-width', '768px');
  await expect(page.locator('.button--primary').first()).toHaveCSS(
    'background-color',
    'rgb(31, 77, 61)',
  );
  const columnCount = (selector: string) =>
    page
      .locator(selector)
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  expect(await columnCount('.design-system-preview__grid--brand')).toBe(2);
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
  for (const section of [
    'Typography',
    'Brand elements',
    'Colors',
    'Spacing and size tokens',
    'Shape and border radius',
    'Buttons',
    'Cards and other components',
    'Elevation',
    'Breakpoints',
  ]) {
    await expect(page.getByRole('heading', { level: 2, name: section })).toBeVisible();
  }
  await expect(page.getByText('--font-sans:', { exact: false })).toBeVisible();
  await expect(page.getByText('/brand/brand-logo.svg', { exact: true })).toBeVisible();
  await expect(page.getByText('/brand/brand-icon.svg', { exact: true })).toBeVisible();
  await expect(page.locator('.brand__mark')).toHaveCount(4);
  await expect(page.locator('.brand__mark').first()).toHaveCSS('mask-image', /url\(/);
  await expect(page.locator('.brand__preview--light').first()).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
  await expect(page.locator('.brand__preview--dark').first()).toHaveCSS(
    'background-color',
    'rgb(0, 0, 0)',
  );
  await expect(page.getByText('#1f4d3d', { exact: true })).toBeVisible();
  await expect(page.getByText('--palette-primary-500', { exact: true })).toBeVisible();
  await expect(page.getByText('primary.500 → #1f4d3d', { exact: true })).toBeVisible();
  await expect(page.getByText('--space-24 · 6rem', { exact: true })).toBeVisible();
  await expect(page.getByText('--size-control · 2.75rem', { exact: true })).toBeVisible();
  await expect(page.getByText('--size-header · 4rem', { exact: true })).toBeVisible();
  await expect(page.getByText('--wrapper-max · 1440px', { exact: true })).toBeVisible();
  await expect(page.getByText('--wrapper-gutter-mobile · 1rem', { exact: true })).toBeVisible();
  await expect(page.getByText('--wrapper-gutter-tablet · 2rem', { exact: true })).toBeVisible();
  await expect(page.getByText('--wrapper-gutter-desktop · 3rem', { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 768, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '32px');
  await expect(page.locator('.design-system-preview__title')).toHaveCSS('font-size', '72px');
  await expect(page.locator('.marketing-hero__title').first()).toHaveCSS('font-size', '72px');
  expect(await columnCount('.design-system-preview__grid--brand')).toBe(1);
  expect(await columnCount('.design-system-preview__grid--semantic')).toBe(2);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '16px');
  await expect(page.locator('.design-system-preview__title')).toHaveCSS('font-size', '48px');
  await expect(page.locator('.marketing-hero__title').first()).toHaveCSS('font-size', '48px');
  expect(await columnCount('.design-system-preview__grid--semantic')).toBe(1);
  await expect(page.getByText('9X large · 8rem / 128px', { exact: true })).toBeVisible();
  await expect(page.getByText('--radius-full', { exact: true })).toBeVisible();
  await expect(page.getByText('9999px', { exact: true })).toBeVisible();
  await expect(page.getByText('@media (min-width: 100rem)', { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1600, height: 900 });
  expect(await columnCount('.design-system-preview__grid--semantic')).toBe(3);
  expect(await columnCount('.design-system-preview__grid--breakpoints')).toBe(3);
  expect(await columnCount('.site-footer__inner')).toBe(2);
  await expect(page.getByText('Elevation 24dp', { exact: true })).toBeVisible();
  await expect(page.getByText('--shadow-24', { exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(page.locator('.site-header')).toHaveClass(/site-header--sticky/);
  await expect(page.locator('.back-to-top')).toHaveClass(/back-to-top--visible/);
  expect(thirdPartyRequests).toEqual([]);
});

for (const route of legalRoutes)
  test(`legal page renders: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('article')).toHaveCount(1);
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
