const { test, expect } = require('@playwright/test');

const baseURL = 'http://127.0.0.1:4173';

async function withViewport(browser, viewport, callback) {
    const context = await browser.newContext({
        baseURL,
        viewport: { width: viewport.width, height: viewport.height },
        hasTouch: viewport.hasTouch,
        isMobile: false
    });

    try {
        const page = await context.newPage();
        await callback(page);
    } finally {
        await context.close();
    }
}

test('home hero keeps both actions inside the photo at exact tall and touch boundaries', async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    test.setTimeout(120_000);

    const viewports = [
        { width: 1280, height: 800, hasTouch: true },
        { width: 1101, height: 1200, hasTouch: false },
        { width: 1102, height: 1200, hasTouch: false },
        { width: 1221, height: 1200, hasTouch: false },
        { width: 1222, height: 1200, hasTouch: false },
        { width: 1222, height: 1200, hasTouch: true },
        { width: 1400, height: 1200, hasTouch: false },
        { width: 1400, height: 1200, hasTouch: true },
        { width: 1499, height: 1200, hasTouch: false },
        { width: 1600, height: 1200, hasTouch: true }
    ];

    for (const viewport of viewports) {
        await withViewport(browser, viewport, async (page) => {
            await page.goto('/?noedit=1', { waitUntil: 'domcontentloaded' });

            const metrics = await page.evaluate(() => {
                const stage = document.querySelector('.hero-stage');
                const copy = document.querySelector('.hero-copy');
                const actions = [...document.querySelectorAll('.hero-copy__actions .apple-button')];
                const stageRect = stage.getBoundingClientRect();
                const copyRect = copy.getBoundingClientRect();

                return {
                    horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
                    stageBottom: stageRect.bottom,
                    stageHeight: stageRect.height,
                    copyBottom: copyRect.bottom,
                    actionBottoms: actions.map((action) => action.getBoundingClientRect().bottom),
                    viewportHeight: window.innerHeight
                };
            });

            const label = `${viewport.width}x${viewport.height}${viewport.hasTouch ? ' touch' : ''}`;
            expect(metrics.horizontalOverflow, `${label}: horizontal overflow`).toBeLessThanOrEqual(2);
            expect(metrics.actionBottoms, `${label}: both hero actions must be present`).toHaveLength(2);
            expect(metrics.copyBottom, `${label}: hero copy leaves the photo`).toBeLessThanOrEqual(metrics.stageBottom + 1);
            expect(Math.max(...metrics.actionBottoms), `${label}: hero action is clipped`).toBeLessThanOrEqual(metrics.stageBottom + 1);
            expect(metrics.stageHeight, `${label}: hero is taller than the viewport`).toBeLessThanOrEqual(metrics.viewportHeight);

            if (viewport.width >= 1102) {
                const header = page.locator('.hero-header--desktop-home');
                await expect(header.locator('a[href="tel:+79376154629"]'), `${label}: desktop phone is missing`).toBeVisible();

                const brand = await header.evaluate((element) => ({
                    markWidth: element.querySelector('.hero-brand__mark').getBoundingClientRect().width,
                    nameSize: parseFloat(getComputedStyle(element.querySelector('.hero-brand__name')).fontSize)
                }));
                expect(brand.markWidth, `${label}: desktop logo shrank to mobile size`).toBeGreaterThanOrEqual(54);
                expect(brand.nameSize, `${label}: desktop brand text shrank to mobile size`).toBeGreaterThanOrEqual(24);
            }
        });
    }
});

test('internal header keeps navigation and phone in separate tracks around 1102px', async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    test.setTimeout(120_000);

    const viewports = [
        { width: 1101, height: 1200, hasTouch: false },
        { width: 1102, height: 1200, hasTouch: false },
        { width: 1102, height: 1200, hasTouch: true },
        { width: 1221, height: 1200, hasTouch: false },
        { width: 1221, height: 1200, hasTouch: true },
        { width: 1222, height: 1200, hasTouch: false }
    ];

    for (const viewport of viewports) {
        await withViewport(browser, viewport, async (page) => {
            await page.goto('/pages/services.html?noedit=1', { waitUntil: 'domcontentloaded' });

            const metrics = await page.evaluate(() => {
                const isVisible = (element) => {
                    if (!element) return false;
                    const rect = element.getBoundingClientRect();
                    const style = getComputedStyle(element);
                    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
                };
                const outerHeader = document.querySelector('body > .header.internal-legacy-header');
                const innerHeader = document.querySelector('.internal-scene-header');
                const visibleHeaders = [outerHeader, innerHeader].filter(isVisible);
                const nav = isVisible(innerHeader) ? innerHeader.querySelector('.hero-scene__nav') : null;
                const phone = isVisible(innerHeader) ? innerHeader.querySelector('.hero-header-stack') : null;

                let overlapArea = 0;
                let navWithinViewport = true;
                if (nav && phone) {
                    const navRect = nav.getBoundingClientRect();
                    const phoneRect = phone.getBoundingClientRect();
                    const overlapWidth = Math.max(0, Math.min(navRect.right, phoneRect.right) - Math.max(navRect.left, phoneRect.left));
                    const overlapHeight = Math.max(0, Math.min(navRect.bottom, phoneRect.bottom) - Math.max(navRect.top, phoneRect.top));
                    overlapArea = overlapWidth * overlapHeight;
                    navWithinViewport = navRect.left >= -1 && navRect.right <= window.innerWidth + 1;
                }

                return {
                    horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
                    visibleHeaderCount: visibleHeaders.length,
                    innerHeaderVisible: isVisible(innerHeader),
                    overlapArea,
                    navWithinViewport
                };
            });

            const label = `${viewport.width}x${viewport.height}${viewport.hasTouch ? ' touch' : ''}`;
            expect(metrics.horizontalOverflow, `${label}: horizontal overflow`).toBeLessThanOrEqual(2);
            expect(metrics.visibleHeaderCount, `${label}: exactly one header system must be visible`).toBe(1);
            expect(metrics.overlapArea, `${label}: phone overlaps navigation`).toBeLessThanOrEqual(1);
            expect(metrics.navWithinViewport, `${label}: navigation leaves the viewport`).toBe(true);
        });
    }
});
