const { test, expect } = require('@playwright/test');

const baseURL = `http://127.0.0.1:${process.env.SITE_TEST_PORT || '4173'}`;

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

for (const javaScriptEnabled of [true, false]) {
    test(`home light typography is static and compact hero is preserved (${javaScriptEnabled ? 'JS enabled' : 'no JS'})`, async ({ browser }, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-wide');
        test.setTimeout(90_000);

        for (const viewport of [
            { width: 375, height: 812, hasTouch: true },
            { width: 844, height: 390, hasTouch: true },
            { width: 1280, height: 800, hasTouch: false },
            { width: 1400, height: 1200, hasTouch: false }
        ]) {
            const context = await browser.newContext({
                baseURL,
                viewport: { width: viewport.width, height: viewport.height },
                hasTouch: viewport.hasTouch,
                isMobile: false,
                javaScriptEnabled,
                reducedMotion: 'reduce'
            });
            try {
                await context.route('**/*', (route) => new URL(route.request().url()).origin === baseURL
                    ? route.continue()
                    : route.abort());
                const page = await context.newPage();
                await page.goto('/index.html?noedit=1', { waitUntil: 'load' });
                await page.evaluate(async () => {
                    await document.fonts.ready;
                    await document.querySelector('.hero-stage__picture img').decode();
                });

                const label = `${viewport.width}x${viewport.height} ${javaScriptEnabled ? 'JS' : 'no JS'}`;
                const metrics = await page.evaluate(() => {
                    const title = document.querySelector('.hero-copy h1');
                    const css = getComputedStyle(title);
                    const stage = document.querySelector('.hero-stage').getBoundingClientRect();
                    const copy = document.querySelector('.hero-copy').getBoundingClientRect();
                    const subtitle = document.querySelector('.hero-copy__title-sub');
                    const compact = document.querySelector('.hero-mobile-cta');
                    const compactTitle = compact.querySelector('.hero-mobile-cta__title');
                    const compactSubtitle = compact.querySelector('.hero-mobile-cta__subtitle');
                    const actionsSelector = compact.checkVisibility() ? '.hero-mobile-cta__actions a' : '.hero-copy__actions a';
                    const range = document.createRange();
                    range.selectNodeContents(title);
                    return {
                        text: title.innerText.replace(/\s+/g, ' ').trim(),
                        family: css.fontFamily,
                        weight: css.fontWeight,
                        color: css.color,
                        shadow: css.textShadow,
                        lineRatio: parseFloat(css.lineHeight) / parseFloat(css.fontSize),
                        subtitleVisible: Boolean(subtitle?.checkVisibility()),
                        titleFits: [...range.getClientRects()].every((r) => r.left >= copy.left - 1 && r.right <= copy.right + 1),
                        compactVisible: compact.checkVisibility(),
                        compactTitle: compactTitle.textContent.trim(),
                        compactSubtitle: compactSubtitle.textContent.trim(),
                        compactTitleFamily: getComputedStyle(compactTitle).fontFamily,
                        compactSubtitleFamily: getComputedStyle(compactSubtitle).fontFamily,
                        overlay: getComputedStyle(document.querySelector('.hero-stage'), '::after').backgroundImage,
                        actionCount: document.querySelectorAll(actionsSelector).length,
                        actionsFit: [...document.querySelectorAll(actionsSelector)].every((el) => {
                            const r = el.getBoundingClientRect();
                            return r.left >= stage.left - 1 && r.right <= stage.right + 1
                                && r.top >= stage.top - 1 && r.bottom <= stage.bottom + 1
                                && el.scrollWidth <= el.clientWidth + 1;
                        }),
                        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
                    };
                });

                expect(metrics.overflow, `${label}: horizontal overflow`).toBeLessThanOrEqual(2);
                expect(metrics.actionCount, `${label}: two visible hero actions`).toBe(2);
                expect(metrics.actionsFit, `${label}: hero actions must remain inside the photo`).toBe(true);
                if (viewport.width >= 1102) {
                    expect(metrics.text, `${label}: title is available without JS rewriting`).toBe('Автоматические ворота в Казани');
                    expect(metrics.family, `${label}: original serif family`).toContain('Cormorant Garamond');
                    expect(metrics.weight, `${label}: lighter agreed heading weight`).toBe('600');
                    expect(metrics.color, `${label}: dark heading on the light background`).toBe('rgb(33, 56, 69)');
                    expect(metrics.shadow, `${label}: no heavy text outline`).toBe('none');
                    expect(metrics.lineRatio).toBeCloseTo(1.06, 2);
                    expect(metrics.subtitleVisible, `${label}: removed promotional subtitle stays hidden`).toBe(false);
                    expect(metrics.titleFits, `${label}: title does not overflow its copy block`).toBe(true);
                    expect(metrics.compactVisible).toBe(false);
                } else if (viewport.width <= 640) {
                    expect(metrics.compactVisible, `${label}: preserve the existing compact hero`).toBe(true);
                    expect(metrics.compactTitle).toBe('Ворота под ключ');
                    expect(metrics.compactSubtitle).toBe('Изготовление и монтаж в Казани');
                    expect(metrics.compactTitleFamily).toContain('Cormorant Garamond');
                    expect(metrics.compactSubtitleFamily).toContain('Manrope');
                    expect(metrics.overlay, `${label}: desktop warm veil must not leak into mobile`).not.toContain('255, 249, 237');
                } else {
                    // Landscape/tablet already uses hero-copy, not the narrow-phone CTA.
                    expect(metrics.compactVisible, `${label}: preserve the existing landscape hero`).toBe(false);
                    expect(metrics.family).toContain('Cormorant Garamond');
                    expect(metrics.subtitleVisible, `${label}: desktop-only subtitle removal must not affect landscape`).toBe(true);
                    expect(metrics.overlay, `${label}: desktop warm veil must not leak into touch landscape`).not.toContain('255, 249, 237');
                }
            } finally {
                await context.close();
            }
        }
    });
}
