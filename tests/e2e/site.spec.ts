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
  await expect(page.locator('body > header nav')).toHaveCount(0);
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
  await expect(page.locator('.brand-mark')).toHaveCount(4);
  await expect(page.locator('.brand-mark').first()).toHaveCSS('mask-image', /url\(/);
  await expect(page.locator('.brand-preview-light').first()).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
  await expect(page.locator('.brand-preview-dark').first()).toHaveCSS(
    'background-color',
    'rgb(0, 0, 0)',
  );
  await expect(page.getByText('#1f4d3d', { exact: true })).toBeVisible();
  await expect(page.getByText('--palette-primary-500', { exact: true })).toBeVisible();
  await expect(page.getByText('primary.500 → #1f4d3d', { exact: true })).toBeVisible();
  await expect(page.getByText('--space-24 · 6rem', { exact: true })).toBeVisible();
  await expect(page.getByText('--size-control · 2.75rem', { exact: true })).toBeVisible();
  await expect(page.getByText('text-9xl · 8rem / 128px', { exact: true })).toBeVisible();
  await expect(page.getByText('--radius-full', { exact: true })).toBeVisible();
  await expect(page.getByText('9999px', { exact: true })).toBeVisible();
  await expect(page.getByText('--breakpoint-xl · 100rem', { exact: true })).toBeVisible();
  await expect(page.getByText('Elevation 24dp', { exact: true })).toBeVisible();
  await expect(page.getByText('--shadow-24', { exact: true })).toBeVisible();
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
  });

test('consent preference can be managed', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Rechazar' })).toBeVisible();
  await page.getByRole('button', { name: 'Rechazar' }).click();
  await expect(page.getByRole('button', { name: 'Rechazar' })).toBeHidden();
  await page.getByRole('button', { name: 'Gestionar cookies' }).click();
  await expect(page.getByRole('button', { name: 'Aceptar' })).toBeVisible();
});

test('homepage has no critical accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
