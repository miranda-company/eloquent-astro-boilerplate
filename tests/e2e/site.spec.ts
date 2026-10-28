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
  await expect(page.locator('.ds-tokens__font-sizes-grid > .ds-tokens__card')).toHaveCount(11);
  await expect(page.locator('.ds-tokens__font-sizes-grid > div.ds-tokens__card')).toHaveCount(11);
  await expect(page.locator('.ds-tokens__font-sizes-grid > article.ds-tokens__card')).toHaveCount(
    0,
  );
  await expect(page.locator('.ds-tokens__font-sizes-grid')).toHaveCSS('display', 'grid');
  const desktopGridColumns = await page
    .locator('.ds-tokens__font-sizes-grid')
    .evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
  expect(desktopGridColumns).toBeGreaterThan(1);
  await expect(page.locator('.ds-tokens__font-sizes-grid .ds-tokens__css-name code')).toHaveText([
    '--font-size-xs',
    '--font-size-sm',
    '--font-size-md',
    '--font-size-lg',
    '--font-size-xl',
    '--font-size-2xl',
    '--font-size-3xl',
    '--font-size-4xl',
    '--font-size-5xl',
    '--font-size-6xl',
    '--font-size-7xl',
  ]);
  await expect(page.locator('.ds-tokens__font-sizes-grid .ds-tokens__figma-name code')).toHaveText([
    'font-size-xs',
    'font-size-sm',
    'font-size-md',
    'font-size-lg',
    'font-size-xl',
    'font-size-2xl',
    'font-size-3xl',
    'font-size-4xl',
    'font-size-5xl',
    'font-size-6xl',
    'font-size-7xl',
  ]);
  await expect(page.locator('.ds-tokens__font-sizes-grid .ds-tokens__value').first()).toHaveText(
    'desktop: 8px',
  );
  await expect(
    page
      .locator('.ds-tokens__font-sizes-grid > .ds-tokens__card')
      .nth(3)
      .locator('.ds-tokens__value')
      .first(),
  ).toHaveText('desktop: 24px');
  await expect(
    page.locator('.ds-tokens__font-sizes-grid .ds-tokens__details > .ds-tokens__figma-name'),
  ).toHaveCount(11);
  await expect(
    page.locator('.ds-tokens__font-sizes-grid .ds-tokens__details > .ds-tokens__values'),
  ).toHaveCount(11);
  await expect(page.getByRole('heading', { level: 3, name: 'Semantic colors' })).toBeVisible();
  await expect(page.locator('.ds-tokens__semantic-colors-grid')).toHaveCSS('display', 'grid');
  await expect(page.locator('.ds-tokens__semantic-colors-grid > .ds-tokens__card')).toHaveCount(17);
  await expect(
    page.locator('.ds-tokens__semantic-colors-grid .ds-tokens__css-name code'),
  ).toHaveText([
    '--color-text-default',
    '--color-text-secondary',
    '--color-text-brand',
    '--color-surface-default',
    '--color-surface-secondary',
    '--color-surface-brand',
    '--color-border-default',
    '--color-border-secondary',
    '--color-wire',
    '--color-text-inverse',
    '--color-surface-inverse',
    '--color-border-inverse',
    '--color-border-brand',
    '--color-icon-brand',
    '--color-icon-secondary',
    '--color-icon-inverse',
    '--color-icon-default',
  ]);
  await expect(page.locator('.ds-tokens__semantic-colors-grid .ds-tokens__values')).toHaveCount(17);
  await expect(
    page.locator('.ds-tokens__semantic-colors-grid .ds-tokens__color-sample'),
  ).toHaveCount(34);
  await expect(
    page.locator('.ds-tokens__semantic-colors-grid .ds-tokens__color-mode').first(),
  ).toHaveText('light-mode');
  await expect(
    page.locator('.ds-tokens__semantic-colors-grid .ds-tokens__color-mode').nth(1),
  ).toHaveText('dark-mode');
  await expect(
    page.locator('.ds-tokens__semantic-colors-grid .ds-tokens__color-sample').first(),
  ).toHaveCSS('background-color', 'rgb(34, 34, 34)');
  await expect(
    page.locator('.ds-tokens__semantic-colors-grid .ds-tokens__color-sample').nth(1),
  ).toHaveCSS('background-color', 'rgb(229, 229, 229)');
  await expect(page.getByRole('heading', { level: 3, name: 'Primitive colors' })).toBeVisible();
  await expect(page.locator('.ds-tokens__primitive-colors-grid')).toHaveCSS('display', 'grid');
  await expect(page.locator('.ds-tokens__primitive-colors-grid > .ds-tokens__card')).toHaveCount(
    36,
  );
  await expect(
    page.locator('.ds-tokens__primitive-colors-grid .ds-tokens__css-name code'),
  ).toHaveText([
    '--color-neutral-100',
    '--color-neutral-200',
    '--color-neutral-300',
    '--color-neutral-400',
    '--color-neutral-500',
    '--color-neutral-600',
    '--color-neutral-700',
    '--color-neutral-800',
    '--color-neutral-900',
    '--color-palette-1-100',
    '--color-palette-1-200',
    '--color-palette-1-300',
    '--color-palette-1-400',
    '--color-palette-1-500',
    '--color-palette-1-600',
    '--color-palette-1-700',
    '--color-palette-1-800',
    '--color-palette-1-900',
    '--color-palette-2-100',
    '--color-palette-2-200',
    '--color-palette-2-300',
    '--color-palette-2-400',
    '--color-palette-2-500',
    '--color-palette-2-600',
    '--color-palette-2-700',
    '--color-palette-2-800',
    '--color-palette-2-900',
    '--color-palette-3-100',
    '--color-palette-3-200',
    '--color-palette-3-300',
    '--color-palette-3-400',
    '--color-palette-3-500',
    '--color-palette-3-600',
    '--color-palette-3-700',
    '--color-palette-3-800',
    '--color-palette-3-900',
  ]);
  await expect(
    page.locator('.ds-tokens__primitive-colors-grid .ds-tokens__primitive-color-swatch'),
  ).toHaveCount(36);
  await expect(
    page.locator('.ds-tokens__primitive-colors-grid .ds-tokens__primitive-color-swatch').first(),
  ).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(
    page.locator('.ds-tokens__primitive-colors-grid .ds-tokens__primitive-color-swatch').nth(9),
  ).toHaveCSS('background-color', 'rgb(255, 250, 235)');
  await expect(
    page.locator('.ds-tokens__primitive-colors-grid .ds-tokens__primitive-color-swatch').last(),
  ).toHaveCSS('background-color', 'rgb(52, 60, 0)');
  await expect(page.getByRole('heading', { level: 3, name: 'Spacing' })).toBeVisible();
  await expect(page.locator('.ds-tokens__spacing-grid')).toHaveCSS('display', 'grid');
  await expect(page.locator('.ds-tokens__spacing-grid > .ds-tokens__card')).toHaveCount(13);
  await expect(page.locator('.ds-tokens__spacing-grid .ds-tokens__css-name code')).toHaveText([
    '--spacing-none',
    '--spacing-xs',
    '--spacing-sm',
    '--spacing-md',
    '--spacing-lg',
    '--spacing-xl',
    '--spacing-2xl',
    '--spacing-3xl',
    '--spacing-4xl',
    '--spacing-5xl',
    '--spacing-wrapper-default',
    '--spacing-gutter-default',
    '--spacing-section-default',
  ]);
  await expect(page.locator('.ds-tokens__spacing-grid .ds-tokens__values')).toHaveCount(13);
  await expect(page.locator('.ds-tokens__spacing-grid .ds-tokens__spacing-sample')).toHaveCount(26);
  const spacingSamplesByMode = await page
    .locator('.ds-tokens__spacing-grid > .ds-tokens__card')
    .evaluateAll((cards) =>
      cards.map((card) =>
        [...card.querySelectorAll('.ds-tokens__spacing-example')].map((example) => ({
          mode: example.querySelector('.ds-tokens__spacing-mode')?.textContent?.trim(),
          width: getComputedStyle(example.querySelector('.ds-tokens__spacing-sample')!).width,
        })),
      ),
    );
  expect(spacingSamplesByMode).toEqual([
    [
      { mode: 'desktop', width: '0px' },
      { mode: 'mobile', width: '0px' },
    ],
    [
      { mode: 'desktop', width: '8px' },
      { mode: 'mobile', width: '4px' },
    ],
    [
      { mode: 'desktop', width: '16px' },
      { mode: 'mobile', width: '8px' },
    ],
    [
      { mode: 'desktop', width: '24px' },
      { mode: 'mobile', width: '16px' },
    ],
    [
      { mode: 'desktop', width: '32px' },
      { mode: 'mobile', width: '24px' },
    ],
    [
      { mode: 'desktop', width: '40px' },
      { mode: 'mobile', width: '32px' },
    ],
    [
      { mode: 'desktop', width: '56px' },
      { mode: 'mobile', width: '40px' },
    ],
    [
      { mode: 'desktop', width: '80px' },
      { mode: 'mobile', width: '56px' },
    ],
    [
      { mode: 'desktop', width: '120px' },
      { mode: 'mobile', width: '80px' },
    ],
    [
      { mode: 'desktop', width: '240px' },
      { mode: 'mobile', width: '120px' },
    ],
    [
      { mode: 'desktop', width: '64px' },
      { mode: 'mobile', width: '18px' },
    ],
    [
      { mode: 'desktop', width: '32px' },
      { mode: 'mobile', width: '16px' },
    ],
    [
      { mode: 'desktop', width: '80px' },
      { mode: 'mobile', width: '40px' },
    ],
  ]);
  await expect(page.getByRole('heading', { level: 3, name: 'Global size tokens' })).toBeVisible();
  await expect(page.locator('.ds-tokens__global-size-grid')).toHaveCSS('display', 'grid');
  await expect(page.locator('.ds-tokens__global-size-grid > .ds-tokens__card')).toHaveCount(6);
  await expect(page.locator('.ds-tokens__global-size-grid .ds-tokens__css-name code')).toHaveText([
    '--max-width-2xl',
    '--max-width-xl',
    '--max-width-lg',
    '--max-width-md',
    '--max-width-sm',
    '--wire-size',
  ]);
  await expect(
    page.locator('.ds-tokens__global-size-grid .ds-tokens__global-size-sample'),
  ).toHaveCount(6);
  const globalSizeSamples = await page
    .locator('.ds-tokens__global-size-grid > .ds-tokens__card')
    .evaluateAll((cards) =>
      cards.map((card) => {
        const example = card.querySelector('.ds-tokens__global-size-example')!;
        const sample = example.querySelector('.ds-tokens__global-size-sample')!;
        return {
          mode: example.querySelector('.ds-tokens__global-size-mode')?.textContent?.trim(),
          width: (sample as HTMLElement).style.width,
          height: getComputedStyle(sample).height,
        };
      }),
    );
  expect(globalSizeSamples).toEqual([
    { mode: 'desktop', width: '100%', height: '8px' },
    { mode: 'desktop', width: '71.11%', height: '8px' },
    { mode: 'desktop', width: '63.89%', height: '8px' },
    { mode: 'desktop', width: '53.33%', height: '8px' },
    { mode: 'desktop', width: '33.33%', height: '8px' },
    { mode: 'desktop', width: '100%', height: '1px' },
  ]);
  const desktopSampleFontSizes = await page
    .locator('.ds-tokens__font-sizes-grid .ds-tokens__sample:first-child')
    .evaluateAll((samples) =>
      samples.map(
        (sample) => getComputedStyle(sample.querySelector('.ds-tokens__sample-text')!).fontSize,
      ),
    );
  expect(desktopSampleFontSizes).toEqual([
    '8px',
    '12px',
    '18px',
    '24px',
    '32px',
    '40px',
    '48px',
    '56px',
    '64px',
    '72px',
    '80px',
  ]);
  const fontSizeSamplesByMode = await page.locator('.ds-tokens__card').evaluateAll((cards) =>
    cards.slice(0, 11).map((card) =>
      [...card.querySelectorAll('.ds-tokens__sample')].map((sample) => ({
        mode: sample.querySelector('.ds-tokens__sample-mode')?.textContent?.trim(),
        fontSize: getComputedStyle(sample.querySelector('.ds-tokens__sample-text')!).fontSize,
      })),
    ),
  );
  expect(fontSizeSamplesByMode).toEqual([
    [
      { mode: 'desktop', fontSize: '8px' },
      { mode: 'mobile', fontSize: '12px' },
    ],
    [
      { mode: 'desktop', fontSize: '12px' },
      { mode: 'mobile', fontSize: '16px' },
    ],
    [
      { mode: 'desktop', fontSize: '18px' },
      { mode: 'mobile', fontSize: '18px' },
    ],
    [
      { mode: 'desktop', fontSize: '24px' },
      { mode: 'mobile', fontSize: '24px' },
    ],
    [
      { mode: 'desktop', fontSize: '32px' },
      { mode: 'mobile', fontSize: '32px' },
    ],
    [
      { mode: 'desktop', fontSize: '40px' },
      { mode: 'mobile', fontSize: '40px' },
    ],
    [
      { mode: 'desktop', fontSize: '48px' },
      { mode: 'mobile', fontSize: '48px' },
    ],
    [
      { mode: 'desktop', fontSize: '56px' },
      { mode: 'mobile', fontSize: '56px' },
    ],
    [
      { mode: 'desktop', fontSize: '64px' },
      { mode: 'mobile', fontSize: '64px' },
    ],
    [
      { mode: 'desktop', fontSize: '72px' },
      { mode: 'mobile', fontSize: '72px' },
    ],
    [
      { mode: 'desktop', fontSize: '80px' },
      { mode: 'mobile', fontSize: '80px' },
    ],
  ]);
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
  await expect(page.locator('.site-header')).toHaveCSS('border-bottom-width', wireBorder.width);
  await expect(page.locator('.site-header__logo')).toHaveCSS('height', '32px');
  await expect(page.locator('.site-footer')).toHaveCSS('padding-top', '40px');
  await expect(page.locator('main > section').first()).toHaveCSS('padding-top', '80px');
  await expect(page.locator('html')).toHaveClass(/(?:^|\s)site(?:\s|$)/);
  await expect(page.locator('html')).toHaveClass(/site--sticky-header/);
  await expect(page.locator('html')).toHaveClass(/site--wireframe/);
  await expect(page.locator('.site-header')).toHaveCSS('border-bottom-color', wireBorder.color);
  await page.locator('html').evaluate((element) => element.classList.remove('site--wireframe'));
  await expect(page.locator('.site-header')).toHaveCSS('border-bottom-color', 'rgb(163, 163, 163)');
  await expect(page.locator('.site-header')).toHaveCSS('border-top-width', '0px');
  await expect(page.locator('.site-header__wrapper')).toHaveCSS('border-width', '0px');
  await page.locator('html').evaluate((element) => element.classList.add('site--wireframe'));
  await expect(page.locator('body')).toHaveAttribute('id', 'top');
  await expect(page.locator('.back-to-top')).toHaveAttribute('href', '#top');
  await expect(page.locator('body > header nav')).toHaveCount(0);
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '64px');
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-top', '0px');
  await expect(page.locator('.wrapper').first()).toHaveCSS('border-width', wireBorder.width);
  await expect(page.locator('.wrapper').first()).toHaveCSS('border-color', wireBorder.color);
  await expect(page.locator('.site-header')).toHaveCSS('border-top-width', wireBorder.width);
  await expect(page.locator('.site-header')).toHaveCSS('border-top-color', wireBorder.color);
  await expect(page.locator('.site-header__wrapper')).toHaveCSS('border-width', wireBorder.width);
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
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect(page.locator('.site-header')).toHaveClass(/site-header--sticky/);
  await expect(page.locator('.site-header')).toHaveCSS('position', 'sticky');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('.site-header')).not.toHaveClass(/site-header--sticky/);
  await expect(page.locator('.site-header')).toHaveCSS('position', 'relative');
  await page.setViewportSize({ width: 767, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '64px');
  expect(
    await page
      .locator('.site-footer__inner')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(1);
  await page.setViewportSize({ width: 768, height: 900 });
  expect(
    await page
      .locator('.site-footer__inner')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(2);
  await page.setViewportSize({ width: 991, height: 900 });
  expect(
    await page
      .locator('.site-footer__inner')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(2);
  await page.setViewportSize({ width: 576, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '64px');
  await page.setViewportSize({ width: 575, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '18px');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '18px');
  const mobileGridColumns = await page
    .locator('.ds-tokens__font-sizes-grid')
    .evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
  expect(mobileGridColumns).toBe(1);
  await page.setViewportSize({ width: 1600, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('max-width', '1440px');
  expect(
    await page
      .locator('.site-footer__inner')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(2);
  expect(thirdPartyRequests).toEqual([]);
  await page.goto('/aviso-legal/');
  await page.setViewportSize({ width: 991, height: 900 });
  expect(
    await page
      .locator('.legal-page__grid')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(1);
  await page.setViewportSize({ width: 992, height: 900 });
  expect(
    await page
      .locator('.legal-page__grid')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(2);
});

test('site header remains usable without JavaScript', async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto('/');

  const header = page.locator('body > header');
  await expect(header).toBeVisible();
  await expect(header.locator('.site-header__logo-link')).toHaveAttribute('href', '/');
  await expect(header.locator('.site-header__logo')).toBeVisible();
  await expect(header).toHaveCSS('position', 'relative');

  await page.close();
});

for (const route of legalRoutes)
  test(`legal page renders: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.setViewportSize({ width: 1400, height: 900 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('body > header nav')).toHaveCount(0);
    await expect(page.locator('body > header .site-header__logo-link')).toHaveAttribute(
      'href',
      '/',
    );
    await expect(page.locator('body > header .site-header__logo')).toHaveAttribute(
      'src',
      '/brand/brand-logo.svg',
    );
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
    await expect(page.locator('div.legal-page__toc')).toHaveCount(1);
    await expect(page.locator('.legal-page__toc a')).toHaveCount(4);
    const headerHeight = await page
      .locator('body > header')
      .evaluate((header) => header.getBoundingClientRect().height);
    const tocTop = await page
      .locator('.legal-page__toc')
      .evaluate((toc) => Number.parseFloat(getComputedStyle(toc).top));
    expect(tocTop).toBeGreaterThanOrEqual(headerHeight);
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(page.locator('body > header')).toHaveClass(/site-header--sticky/);
    await expect
      .poll(() =>
        page.locator('.legal-page__toc').evaluate((toc) => toc.getBoundingClientRect().top),
      )
      .toBeGreaterThanOrEqual(headerHeight);
    await expect(
      page.getByRole('heading', { level: 2, name: 'Información importante' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Contenido' })).toBeVisible();
    await expect(page.locator('.legal-page__article > section')).toHaveCount(4);
    const sectionsHaveHeadings = await page
      .locator('.legal-page > section, .legal-page__article > section')
      .evaluateAll((sections) =>
        sections.every((section) => section.querySelector(':scope > .wrapper > h2, :scope > h2')),
      );
    expect(sectionsHaveHeadings).toBe(true);
    const targets = await page
      .locator('.legal-page__toc a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    for (const target of targets) await expect(page.locator(target ?? '')).toHaveCount(1);
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
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
