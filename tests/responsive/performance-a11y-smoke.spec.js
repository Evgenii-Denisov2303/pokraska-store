const { test, expect } = require('@playwright/test');

test('mobile performance and accessibility contracts stay intact', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone-iphone-13');

    await page.goto('/?noedit=1', { waitUntil: 'domcontentloaded' });

    const heroImage = page.locator('.hero-stage__picture img');
    await expect.poll(async () => heroImage.evaluate((image) => image.complete && image.naturalWidth)).toBe(1080);
    await expect(heroImage).toHaveJSProperty('naturalHeight', 1620);
    await expect(heroImage).not.toHaveAttribute('decoding', 'async');
    expect(await heroImage.evaluate((image) => image.currentSrc.endsWith('/assets/images/hero/home-hero-main-mobile.webp'))).toBe(true);

    const logosAreSized = await page.locator('.logo-image').evaluateAll((images) => images.every((image) => (
        image.getAttribute('width') === '320'
        && image.getAttribute('height') === '320'
        && image.naturalWidth === 320
        && image.naturalHeight === 320
    )));
    expect(logosAreSized).toBe(true);

    const nav = page.locator('#site-mobile-nav');
    const menuButton = page.locator('.mobile-menu-btn');
    await expect(nav).toHaveAttribute('aria-hidden', 'true');
    await expect(nav).toHaveAttribute('inert', '');

    const exposedFocusableCount = await page.evaluate(() => [...document.querySelectorAll('[aria-hidden="true"]')]
        .flatMap((container) => [...container.querySelectorAll('button, a[href], input, select, textarea, [tabindex]')])
        .filter((element) => !element.disabled
            && element.getAttribute('tabindex') !== '-1'
            && !element.closest('[inert]')).length);
    expect(exposedFocusableCount).toBe(0);

    await menuButton.click();
    await expect(nav).toHaveAttribute('aria-hidden', 'false');
    await expect(nav).not.toHaveAttribute('inert', '');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    await menuButton.click();
    await expect(nav).toHaveAttribute('aria-hidden', 'true');
    await expect(nav).toHaveAttribute('inert', '');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await expect(page.locator('.panel-scene__viewer[aria-hidden="true"]')).toHaveCount(0);
    const gatesGallery = page.locator('.panel-scene__card--dark');
    await gatesGallery.getByRole('button', { name: 'Заборы' }).click();
    await expect(gatesGallery.locator('[data-panel-caption]')).toHaveText('Заборы');
});
