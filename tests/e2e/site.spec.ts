import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const legalRoutes = ['/aviso-legal/', '/politica-de-privacidad/', '/politica-de-cookies/'];
const figmaTokens = JSON.parse(
  readFileSync(resolve(process.cwd(), 'src/config/figma-tokens.json'), 'utf8'),
) as {
  'font-tokens': {
    'font-family-body': { desktop: string };
    'font-size-sm': { mobile: number; desktop: number };
  };
};
const bodyFontFamily = figmaTokens['font-tokens']['font-family-body'].desktop;
const fontSizeSm = figmaTokens['font-tokens']['font-size-sm'] as {
  mobile: number;
  desktop: number;
};

test('production wireframe aid stays off until the root modifier is applied', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/site--wireframe/);
  const wireBorder = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.border = 'var(--wire-size) solid var(--color-wire)';
    document.body.append(probe);
    const computed = getComputedStyle(probe);
    const result = { width: computed.borderTopWidth, color: computed.borderTopColor };
    probe.remove();
    return result;
  });
  const standardBorderWidth = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.border = 'var(--border-size-sm) solid transparent';
    document.body.append(probe);
    const width = getComputedStyle(probe).borderTopWidth;
    probe.remove();
    return width;
  });
  const header = page.locator('.site-header');
  const wrapper = page.locator('.site-header__wrapper');
  await expect(header).toHaveCSS('border-bottom-width', standardBorderWidth);
  await expect(header).toHaveCSS('border-bottom-color', 'rgb(163, 163, 163)');
  await expect(wrapper).toHaveCSS('border-width', '0px');
  await page.locator('html').evaluate((element) => element.classList.add('site--wireframe'));
  await expect(header).toHaveCSS('border-bottom-width', wireBorder.width);
  await expect(header).toHaveCSS('border-bottom-color', wireBorder.color);
  await expect(wrapper).toHaveCSS('border-width', wireBorder.width);
  await page.locator('html').evaluate((element) => element.classList.remove('site--wireframe'));
  await expect(header).toHaveCSS('border-bottom-width', standardBorderWidth);
  await expect(header).toHaveCSS('border-bottom-color', 'rgb(163, 163, 163)');
  await expect(header).toHaveCSS('border-top-width', '0px');
  await expect(wrapper).toHaveCSS('border-width', '0px');
});

test('stack layout uses the default responsive gutter token', async ({ page }) => {
  await page.goto('/');
  const getStackStyles = () =>
    page.evaluate(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      const stacks = [
        document.querySelector('.design-system-preview__wrapper'),
        ...document.querySelectorAll('.ds-tokens__card'),
      ];
      return {
        gapToken: rootStyles.getPropertyValue('--spacing-gutter-default').trim(),
        stacks: stacks.map((stack) => {
          if (!stack) throw new Error('Missing design-system preview stack');
          const styles = getComputedStyle(stack);
          return {
            hasStackClass: stack.classList.contains('stack'),
            display: styles.display,
            direction: styles.flexDirection,
            gap: styles.rowGap,
          };
        }),
      };
    });
  const desktopStackStyles = await getStackStyles();
  await page.setViewportSize({ width: 375, height: 812 });
  const mobileStackStyles = await getStackStyles();
  for (const viewportStyles of [desktopStackStyles, mobileStackStyles]) {
    expect(viewportStyles.stacks.length).toBeGreaterThan(1);
    expect(
      viewportStyles.stacks.every(
        (stack) =>
          stack.hasStackClass &&
          stack.display === 'flex' &&
          stack.direction === 'column' &&
          stack.gap === viewportStyles.gapToken,
      ),
    ).toBe(true);
  }
});

test('Figma typography uses mobile values until the lg breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveCSS('--font-size-sm', `${fontSizeSm.mobile}px`);

  await page.setViewportSize({ width: 991, height: 812 });
  await expect(page.locator('html')).toHaveCSS('--font-size-sm', `${fontSizeSm.mobile}px`);

  await page.setViewportSize({ width: 992, height: 812 });
  await expect(page.locator('html')).toHaveCSS('--font-size-sm', `${fontSizeSm.desktop}px`);
});

test('design-system homepage is noindex, keyboard-accessible, and has no default analytics requests', async ({
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
  const cardTokens = await page
    .locator('.ds-tokens__card')
    .first()
    .evaluate((card) => {
      const styles = getComputedStyle(card);
      const rootStyles = getComputedStyle(document.documentElement);
      return {
        borderWidth: styles.borderTopWidth,
        borderWidthToken: rootStyles.getPropertyValue('--border-size-sm').trim(),
        borderRadius: styles.borderTopLeftRadius,
        borderRadiusToken: rootStyles.getPropertyValue('--radius-md').trim(),
      };
    });
  expect(cardTokens.borderWidth).toBe(cardTokens.borderWidthToken);
  expect(cardTokens.borderRadius).toBe(cardTokens.borderRadiusToken);
  const swatchTokens = await page
    .locator('.ds-tokens__color-sample')
    .first()
    .evaluate((swatch) => {
      const styles = getComputedStyle(swatch);
      const rootStyles = getComputedStyle(document.documentElement);
      return {
        borderWidth: styles.borderTopWidth,
        borderWidthToken: rootStyles.getPropertyValue('--border-size-sm').trim(),
        borderRadius: styles.borderTopLeftRadius,
        borderRadiusToken: rootStyles.getPropertyValue('--radius-sm').trim(),
      };
    });
  expect(swatchTokens.borderWidth).toBe(swatchTokens.borderWidthToken);
  expect(swatchTokens.borderRadius).toBe(swatchTokens.borderRadiusToken);
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
  expect(
    await page.locator('.ds-tokens__semantic-colors-grid > .ds-tokens__card').count(),
  ).toBeGreaterThanOrEqual(17);
  await expect(page.locator('.ds-tokens__semantic-colors-grid')).toContainText(
    '--color-border-focus',
  );
  await expect(page.locator('.ds-tokens__semantic-colors-grid')).toContainText(
    '--color-surface-action-primary-hover',
  );
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
  expect(
    await page.locator('.ds-tokens__primitive-colors-grid > .ds-tokens__card').count(),
  ).toBeGreaterThanOrEqual(39);
  await expect(page.locator('.ds-tokens__primitive-colors-grid')).toContainText(
    '--color-accent-100',
  );
  await expect(page.locator('.ds-tokens__primitive-colors-grid')).toContainText(
    '--color-accent-900',
  );
  await expect(
    page.locator('.ds-tokens__primitive-colors-grid .ds-tokens__primitive-color-swatch').first(),
  ).toHaveCSS('background-color', 'rgb(250, 250, 250)');
  await expect(
    page
      .locator('.ds-tokens__primitive-colors-grid > .ds-tokens__card')
      .filter({ hasText: '--color-accent-500' })
      .locator('.ds-tokens__primitive-color-swatch'),
  ).toHaveCSS('background-color', 'rgb(26, 86, 252)');
  await expect(page.getByRole('heading', { level: 3, name: 'Primitive dimensions' })).toBeVisible();
  await expect(page.locator('.ds-tokens__primitive-dimensions-grid')).toHaveCSS('display', 'grid');
  await expect(page.locator('.ds-tokens__primitive-dimensions-grid')).toContainText('--size-0-5');
  await expect(page.locator('.ds-tokens__primitive-dimensions-grid')).toContainText('--size-40');
  await expect(
    page
      .locator('.ds-tokens__primitive-dimensions-grid > .ds-tokens__card')
      .filter({ has: page.getByText('--size-3', { exact: true }) })
      .locator('.ds-tokens__dimension-sample'),
  ).toHaveCSS('width', '24px');
  await expect(page.getByRole('heading', { level: 3, name: 'Spacing' })).toBeVisible();
  await expect(page.locator('.ds-tokens__spacing-grid')).toHaveCSS('display', 'grid');
  await expect(page.locator('.ds-tokens__spacing-grid > .ds-tokens__card')).toHaveCount(14);
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
    '--spacing-xxs',
  ]);
  await expect(page.locator('.ds-tokens__spacing-grid .ds-tokens__values')).toHaveCount(14);
  await expect(page.locator('.ds-tokens__spacing-grid .ds-tokens__spacing-sample')).toHaveCount(42);
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
      { mode: 'tablet', width: '0px' },
    ],
    [
      { mode: 'desktop', width: '8px' },
      { mode: 'mobile', width: '4px' },
      { mode: 'tablet', width: '4px' },
    ],
    [
      { mode: 'desktop', width: '16px' },
      { mode: 'mobile', width: '8px' },
      { mode: 'tablet', width: '8px' },
    ],
    [
      { mode: 'desktop', width: '24px' },
      { mode: 'mobile', width: '16px' },
      { mode: 'tablet', width: '16px' },
    ],
    [
      { mode: 'desktop', width: '32px' },
      { mode: 'mobile', width: '24px' },
      { mode: 'tablet', width: '24px' },
    ],
    [
      { mode: 'desktop', width: '40px' },
      { mode: 'mobile', width: '32px' },
      { mode: 'tablet', width: '32px' },
    ],
    [
      { mode: 'desktop', width: '56px' },
      { mode: 'mobile', width: '40px' },
      { mode: 'tablet', width: '40px' },
    ],
    [
      { mode: 'desktop', width: '80px' },
      { mode: 'mobile', width: '56px' },
      { mode: 'tablet', width: '56px' },
    ],
    [
      { mode: 'desktop', width: '120px' },
      { mode: 'mobile', width: '80px' },
      { mode: 'tablet', width: '80px' },
    ],
    [
      { mode: 'desktop', width: '240px' },
      { mode: 'mobile', width: '120px' },
      { mode: 'tablet', width: '120px' },
    ],
    [
      { mode: 'desktop', width: '64px' },
      { mode: 'mobile', width: '18px' },
      { mode: 'tablet', width: '32px' },
    ],
    [
      { mode: 'desktop', width: '24px' },
      { mode: 'mobile', width: '16px' },
      { mode: 'tablet', width: '16px' },
    ],
    [
      { mode: 'desktop', width: '80px' },
      { mode: 'mobile', width: '40px' },
      { mode: 'tablet', width: '56px' },
    ],
    [
      { mode: 'desktop', width: '4px' },
      { mode: 'mobile', width: '4px' },
      { mode: 'tablet', width: '4px' },
    ],
  ]);
  await expect(page.getByRole('heading', { level: 3, name: 'Global size tokens' })).toBeVisible();
  await expect(page.locator('.ds-tokens__global-size-grid')).toHaveCSS('display', 'grid');
  expect(
    await page.locator('.ds-tokens__global-size-grid > .ds-tokens__card').count(),
  ).toBeGreaterThanOrEqual(10);
  await expect(page.locator('.ds-tokens__global-size-grid')).toContainText('--size-icon-md');
  await expect(page.locator('.ds-tokens__global-size-grid')).toContainText('--size-control-md');
  await expect(
    page
      .locator('.ds-tokens__global-size-grid > .ds-tokens__card')
      .filter({ has: page.getByText('--size-icon-md', { exact: true }) })
      .locator('.ds-tokens__global-size-sample'),
  ).toHaveCSS('height', '24px');
  await expect(
    page
      .locator('.ds-tokens__global-size-grid > .ds-tokens__card')
      .filter({ has: page.getByText('--size-control-md', { exact: true }) })
      .locator('.ds-tokens__global-size-sample'),
  ).toHaveCSS('width', '40px');
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
  await expect(page.locator('.footer-02 > .footer-02__wrapper.wrapper')).toHaveCount(1);
  await expect(page.locator('main > section > .wrapper')).toHaveCount(2);
  await expect(
    page.locator(
      'main > section.design-system-preview__intro > .design-system-preview__wrapper.wrapper',
    ),
  ).toHaveCount(1);
  await expect(page.locator('main > section.ds-tokens > .ds-tokens__wrapper.wrapper')).toHaveCount(
    1,
  );
  await expect(page.locator('.site-header')).toHaveCSS('padding-top', '16px');
  await expect(page.locator('.site-header__logo')).toHaveCSS('height', '32px');
  await expect(page.locator('.footer-02')).toHaveCSS('padding-top', '80px');
  await expect(page.locator('main > section').first()).toHaveCSS('padding-top', '80px');
  await expect(page.locator('html')).toHaveClass(/(?:^|\s)site(?:\s|$)/);
  await expect(page.locator('html')).toHaveClass(/site--sticky-header/);
  await expect(page.locator('html')).not.toHaveClass(/site--wireframe/);
  await expect(page.locator('body')).toHaveAttribute('id', 'top');
  await expect(page.locator('.back-to-top')).toHaveAttribute('href', '#top');
  await expect(page.locator('a.back-to-top')).toHaveAttribute('aria-label', 'Volver arriba');
  await expect(page.locator('button.back-to-top')).toHaveCount(0);
  const scrollControlsContainer = page.locator('.scroll-controls__container.wrapper');
  await expect(scrollControlsContainer).toHaveCount(1);
  await expect(scrollControlsContainer).toHaveCSS('position', 'fixed');
  await expect(scrollControlsContainer).toHaveCSS('max-width', '1440px');
  await expect(scrollControlsContainer).toHaveCSS('padding-left', '64px');
  const backToTopTokens = await page.locator('.back-to-top').evaluate((link) => {
    const styles = getComputedStyle(link);
    const rootStyles = getComputedStyle(document.documentElement);
    const icon = link.querySelector('.back-to-top__icon');
    if (!icon) throw new Error('Missing back-to-top icon');
    const iconStyles = getComputedStyle(icon);
    const colorProbe = document.createElement('div');
    colorProbe.style.backgroundColor = 'var(--color-surface-action-primary)';
    document.body.append(colorProbe);
    const backgroundToken = getComputedStyle(colorProbe).backgroundColor;
    colorProbe.remove();
    return {
      borderWidth: styles.borderTopWidth,
      borderWidthToken: rootStyles.getPropertyValue('--border-size-sm').trim(),
      borderRadius: styles.borderTopLeftRadius,
      borderRadiusToken: rootStyles.getPropertyValue('--radius-3xl').trim(),
      background: styles.backgroundColor,
      backgroundToken,
      width: styles.width,
      widthToken: rootStyles.getPropertyValue('--size-control-md').trim(),
      iconWidth: iconStyles.width,
      iconHeight: iconStyles.height,
      iconSizeToken: rootStyles.getPropertyValue('--size-icon-md').trim(),
    };
  });
  expect(backToTopTokens.borderWidth).toBe(backToTopTokens.borderWidthToken);
  expect(backToTopTokens.borderRadius).toBe(backToTopTokens.borderRadiusToken);
  expect(backToTopTokens.background).toBe(backToTopTokens.backgroundToken);
  expect(backToTopTokens.width).toBe(backToTopTokens.widthToken);
  expect(backToTopTokens.iconWidth).toBe(backToTopTokens.iconSizeToken);
  expect(backToTopTokens.iconHeight).toBe(backToTopTokens.iconSizeToken);
  await expect(page.locator('body > header nav')).toHaveCount(0);
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '64px');
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-top', '0px');
  await expect(page.locator('.wrapper').first()).toHaveCSS('border-width', '0px');
  await expect(page.locator('.site-header')).toHaveCSS('border-top-width', '0px');
  await expect(page.locator('.site-header__wrapper')).toHaveCSS('border-width', '0px');
  await expect(page.locator('.design-system-preview__intro')).toHaveCSS('border-width', '0px');
  await expect(page.locator('.wrapper').first()).toHaveCSS('outline-style', 'none');
  await expect(page.locator('.footer-02__wrapper')).toHaveCSS('display', 'flex');
  const footerSocialIcons = await page.locator('.footer-02__social-icon').evaluateAll((icons) => {
    const rootStyles = getComputedStyle(document.documentElement);
    return icons.map((icon) => ({
      ariaHidden: icon.getAttribute('aria-hidden'),
      height: getComputedStyle(icon).height,
      sizeToken: rootStyles.getPropertyValue('--size-icon-md').trim(),
      tagName: icon.tagName,
      width: getComputedStyle(icon).width,
    }));
  });
  expect(
    footerSocialIcons.every(
      ({ ariaHidden, height, sizeToken, tagName, width }) =>
        ariaHidden === 'true' && height === sizeToken && tagName === 'svg' && width === sizeToken,
    ),
  ).toBe(true);
  const footerPageLink = page.locator('.footer-02__page-list a').first();
  const interactionColors = await page.evaluate(() => {
    const resolveColor = (token: string) => {
      const probe = document.createElement('div');
      probe.style.color = `var(${token})`;
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    };
    return {
      focus: resolveColor('--color-border-focus'),
      link: resolveColor('--color-text-link-default'),
      linkHover: resolveColor('--color-text-link-hover'),
    };
  });
  await expect(footerPageLink).toHaveCSS('color', interactionColors.link);
  await footerPageLink.hover();
  await expect(footerPageLink).toHaveCSS('color', interactionColors.linkHover);
  await footerPageLink.focus();
  await expect(footerPageLink).toHaveCSS('outline-color', interactionColors.focus);
  await expect(page.locator('.back-to-top')).toHaveCSS('position', 'static');
  await expect(page.locator('.container')).toHaveCount(0);
  await expect(
    page.locator('body > header').getByRole('link', { name: 'Nombre del cliente' }),
  ).toHaveAttribute('href', '/');
  await expect(
    page.locator('body > header').getByRole('img', { name: 'Nombre del cliente' }),
  ).toHaveAttribute('src', '/brand/brand-logo.svg');
  await expect(
    page.locator('body > header').getByRole('img', { name: 'Nombre del cliente' }),
  ).toHaveAttribute('width', '1620');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://example.com/',
  );
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/brand/brand-icon.svg');
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
  await expect(
    page.locator('link[rel="preconnect"][href="https://fonts.googleapis.com"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('link[rel="preconnect"][href="https://fonts.gstatic.com"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com/css2"]'),
  ).toHaveCount(1);
  await page.getByText('Saltar al contenido').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#contenido')).toBeFocused();
  await expect(page.locator('html')).toHaveCSS('--font-family-body', `"${bodyFontFamily}"`);
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect(page.locator('.site-header')).toHaveClass(/site-header--sticky/);
  await expect(page.locator('.site-header')).toHaveCSS('position', 'sticky');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('.site-header')).not.toHaveClass(/site-header--sticky/);
  await expect(page.locator('.site-header')).toHaveCSS('position', 'relative');
  await page.setViewportSize({ width: 767, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '18px');
  await expect(scrollControlsContainer).toHaveCSS('padding-left', '18px');
  await expect(page.locator('.footer-02__main')).toHaveCSS('flex-direction', 'column');
  await expect(page.locator('.footer-02__page-list')).toHaveCSS('flex-direction', 'column');
  await expect(page.locator('.footer-02__copyright')).toHaveCSS('order', '0');
  await page.setViewportSize({ width: 768, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '32px');
  await expect(page.locator('.footer-02__main')).toHaveCSS('flex-direction', 'column');
  await page.setViewportSize({ width: 991, height: 900 });
  await expect(page.locator('.footer-02__main')).toHaveCSS('flex-direction', 'column');
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '32px');
  await page.setViewportSize({ width: 992, height: 900 });
  await expect(page.locator('.footer-02__main')).toHaveCSS('display', 'grid');
  await expect(page.locator('.footer-02__main')).toHaveCSS('grid-template-columns', /.+ .+ .+/);
  await expect(page.locator('.footer-02__page-list')).toHaveCSS('flex-direction', 'row');
  await expect(page.locator('.footer-02__copyright')).toHaveCSS('order', '-1');
  await page.setViewportSize({ width: 576, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '18px');
  await page.setViewportSize({ width: 575, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '18px');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '18px');
  const mobileGridColumns = await page
    .locator('.ds-tokens__font-sizes-grid')
    .evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
  expect(mobileGridColumns).toBe(1);
  await page.setViewportSize({ width: 1200, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '64px');
  await page.setViewportSize({ width: 1600, height: 900 });
  await expect(page.locator('.wrapper').first()).toHaveCSS('max-width', '1440px');
  await expect(page.locator('.wrapper').first()).toHaveCSS('padding-left', '64px');
  await expect(page.locator('.footer-02__main')).toHaveCSS('grid-template-columns', /.+ .+ .+/);
  const footerColumnWidths = await page
    .locator('.footer-02__main')
    .evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(' ').map(Number.parseFloat),
    );
  expect(footerColumnWidths[0]).toBeCloseTo(footerColumnWidths[2], 1);
  await expect(page.locator('.footer-02__legal')).toHaveCSS('flex-direction', 'row');
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
  const backToTop = page.locator('a.back-to-top');
  await expect(backToTop).toBeVisible();
  await expect(backToTop).toHaveAttribute('href', '#top');

  await page.close();
});

test('back-to-top control is hidden until needed and honors reduced motion', async ({ page }) => {
  await page.goto('/');
  const backToTop = page.locator('a.back-to-top');
  await expect(backToTop).toHaveClass(/back-to-top--enhanced/);
  await expect(backToTop).toHaveCSS('visibility', 'hidden');

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(backToTop).toHaveClass(/back-to-top--visible/);
  await expect(backToTop).toHaveCSS('visibility', 'visible');
  await expect(backToTop).toHaveAccessibleName('Volver arriba');
  await expect(backToTop).toHaveCSS('transition-duration', '0.16s, 0.16s, 0.16s');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(backToTop).toHaveCSS('transition-duration', '0s');
});

test('site header has balanced vertical logo spacing across viewport sizes', async ({ page }) => {
  await page.goto('/');

  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const spacing = await page.locator('.site-header').evaluate((header) => {
      const logo = header.querySelector('.site-header__logo')!;
      const headerRect = header.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
      const styles = getComputedStyle(header);
      return {
        top: logoRect.top - headerRect.top - Number.parseFloat(styles.borderTopWidth),
        bottom: headerRect.bottom - logoRect.bottom - Number.parseFloat(styles.borderBottomWidth),
      };
    });

    expect(Math.abs(spacing.top - spacing.bottom)).toBeLessThanOrEqual(1);
  }
});

test('mobile sticky header enters with the back-to-top motion and respects reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect(page.locator('.site-header')).toHaveClass(/site-header--sticky/);
  await expect(page.locator('.site-header')).toHaveCSS('animation-duration', '0.16s');
  await expect(page.locator('.site-header')).toHaveCSS('animation-timing-function', 'ease');
  await expect(page.locator('.site-header')).toHaveCSS('animation-name', 'site-header-enter');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.site-header')).toHaveCSS('animation-name', 'none');
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
    await expect(page.locator('body > footer address')).toHaveCount(0);
    await expect(page.locator('body > footer .footer-02__legal nav ul > li')).toHaveCount(3);
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
