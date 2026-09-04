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

test('home intro statement and photo panels reveal immediately on phones and stay delayed elsewhere', async ({ page }) => {
    const revealTargets = [
        { selector: '.statement-scene__lead', delay: 200 },
        { selector: '.panel-scene__card--dark', delay: 200 },
        { selector: '.panel-scene__card--light', delay: 200 }
    ];

    for (const target of revealTargets) {
        await page.goto('/?noedit=1', { waitUntil: 'domcontentloaded' });

        const scene = page.locator(target.selector);
        await expect(scene).toHaveAttribute('data-scene-delay', String(target.delay));

        const mobileRevealDisabled = await page.evaluate(() => window.matchMedia(
            '(max-width: 640px), (max-height: 640px) and (pointer: coarse)'
        ).matches);

        if (mobileRevealDisabled) {
            await expect(scene).toHaveClass(/is-visible/);
            await expect(scene).toHaveAttribute('data-scene-reveal-state', 'visible');
            await expect(scene.locator(':scope > .scene-reveal__curtain')).toHaveCount(0);
            expect(await scene.evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
            continue;
        }

        await expect(scene).not.toHaveClass(/is-visible/);

        const startedAt = await scene.evaluate((element) => {
            window.__homeRevealVisibleAt = 0;
            const observer = new MutationObserver(() => {
                if (!element.classList.contains('is-visible')) return;
                window.__homeRevealVisibleAt = performance.now();
                observer.disconnect();
            });
            observer.observe(element, { attributes: true, attributeFilter: ['class'] });

            document.documentElement.style.scrollBehavior = 'auto';
            const top = element.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.55;
            const started = performance.now();
            window.scrollTo(0, Math.max(0, top));
            window.scrollBy(0, 12);
            return started;
        });

        await expect(scene).toHaveAttribute('data-scene-reveal-state', 'pending');
        await expect(scene).toHaveClass(/is-visible/, { timeout: target.delay + 1600 });
        await expect(scene).toHaveAttribute('data-scene-reveal-state', 'visible');

        const visibleAt = await page.evaluate(() => window.__homeRevealVisibleAt);
        expect(visibleAt - startedAt).toBeGreaterThanOrEqual(target.delay - 50);
        expect(await scene.evaluate((element) => getComputedStyle(element).animationName))
            .toBe('home-scroll-scene-reveal');
    }
});
