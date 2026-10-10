const { test, expect } = require('@playwright/test');

const baseURL = process.env.SITE_TEST_BASE_URL || `http://127.0.0.1:${process.env.SITE_TEST_PORT || '4173'}`;
const modes = [
    { name: 'phone-375', viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true },
    { name: 'phone-320', viewport: { width: 320, height: 740 }, hasTouch: true, isMobile: true },
    { name: 'tablet-768', viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: false },
    { name: 'desktop-site-980', viewport: { width: 980, height: 1800 }, hasTouch: true, isMobile: false },
    { name: 'desktop-1280', viewport: { width: 1280, height: 800 }, hasTouch: false, isMobile: false },
    { name: 'desktop-1400', viewport: { width: 1400, height: 1200 }, hasTouch: false, isMobile: false }
];

async function withMode(browser, mode, callback) {
    const { name, ...options } = mode;
    const context = await browser.newContext({ baseURL, ...options, deviceScaleFactor: 1 });
    try {
        await callback(await context.newPage());
    } finally {
        await context.close();
    }
}

async function settleDocument(page) {
    await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const animations = document.getAnimations().filter((animation) => {
            const target = animation.effect?.target;
            // Offscreen content-visibility sections can suspend their finite
            // reveal animations indefinitely. Only await the relevant shell
            // and request scene; never reveal or scroll them in the test.
            return animation.playState === 'running' && target instanceof Element
                && (target === document.body || target.matches('.header, .header-top, .home-tail-scene'))
                && target.checkVisibility({ contentVisibilityAuto: true })
                && Number.isFinite(animation.effect.getComputedTiming().endTime);
        });
        await Promise.all(animations.map((animation) => animation.finished.catch(() => {})));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
}

async function measureRequest(page) {
    return page.evaluate(() => {
        const rect = (element) => {
            const box = element.getBoundingClientRect();
            return { top: box.top, bottom: box.bottom, height: box.height };
        };
        const title = document.querySelector('#home-request-title');
        const section = document.querySelector('#request-form');
        const scene = section.closest('.home-tail-scene');
        const copyTitle = scene.querySelector('.home-tail__request-copy h3');
        const iframe = section.querySelector('iframe');
        const titleBox = rect(title);
        const header = [...document.querySelectorAll('body > .header')].find((element) => {
            const box = element.getBoundingClientRect();
            return element.checkVisibility() && box.top < innerHeight && box.bottom > 0;
        });
        const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
        let opacity = 1;
        for (let element = title; element; element = element.parentElement) {
            opacity *= Number(getComputedStyle(element).opacity);
        }
        return {
            scrollY, viewportHeight: innerHeight, headerBottom,
            headerHeightVariable: getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
            headerTopHeightVariable: getComputedStyle(document.documentElement).getPropertyValue('--header-top-height'),
            requestScrollMarginTop: getComputedStyle(section).scrollMarginTop,
            bodyPaddingTop: getComputedStyle(document.body).paddingTop,
            bodyClasses: document.body.className,
            section: rect(section), copyTitle: rect(copyTitle), title: titleBox, iframe: rect(iframe),
            sceneOpacity: getComputedStyle(scene).opacity, opacity,
            sceneClasses: scene.className,
            titleVisible: title.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
                && opacity > 0.95 && titleBox.top >= headerBottom - 1 && titleBox.bottom <= innerHeight,
            overflow: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth
        };
    });
}

async function expectRequestInView(page, testInfo, name) {
    await settleDocument(page);
    let previous;
    let stable = 0;
    let last;
    try {
        await expect.poll(async () => {
            last = await measureRequest(page);
            const signature = `${Math.round(last.scrollY)}:${Math.round(last.title.top)}:${last.opacity}`;
            stable = signature === previous ? stable + 1 : 0;
            previous = signature;
            return stable >= 3 && last.titleVisible;
        }, { timeout: 8000, intervals: [100, 200, 300], message: `${name}: actual form heading must remain readable after layout settles` }).toBe(true);
        expect(last.overflow, `${name}: no horizontal overflow`).toBeLessThanOrEqual(2);
    } catch (error) {
        error.message += `\nMeasured geometry: ${JSON.stringify(last)}`;
        throw error;
    } finally {
        await testInfo.attach(`${name}-geometry`, { body: JSON.stringify(last, null, 2), contentType: 'application/json' });
        const path = testInfo.outputPath(`${name}.png`);
        await page.screenshot({ path });
        await testInfo.attach(name, { path, contentType: 'image/png' });
    }
}

async function expectOrdinaryBackRestoration(page, label) {
    const onwardLink = page.locator('.preview-footer__list a[href="pages/prices.html"]');
    await onwardLink.scrollIntoViewIfNeeded();
    await settleDocument(page);
    let previous;
    let stable = 0;
    let savedScroll;
    await expect.poll(async () => {
        savedScroll = await page.evaluate(() => scrollY);
        stable = savedScroll === previous ? stable + 1 : 0;
        previous = savedScroll;
        return stable;
    }, { intervals: [100, 200, 300] }).toBeGreaterThanOrEqual(3);
    const savedURL = page.url();
    const beforeBox = await onwardLink.boundingBox();
    expect(savedScroll, `${label}: test leaves from a genuinely scrolled position`).toBeGreaterThan(1000);
    await onwardLink.click();
    await expect(page).toHaveURL(/\/pages\/prices\.html$/);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(savedURL);
    await settleDocument(page);
    stable = 0;
    let restoredScroll;
    let afterBox;
    try {
        await expect.poll(async () => {
            restoredScroll = await page.evaluate(() => scrollY);
            afterBox = await onwardLink.boundingBox();
            // Browser restoration must preserve the user's visible place, not
            // an absolute document coordinate that can change as skipped
            // content before it is materialized.
            stable = afterBox && Math.abs(afterBox.y - beforeBox.y) <= 3 ? stable + 1 : 0;
            return stable;
        }, { intervals: [100, 200, 300], message: `${label}: browser Back preserves the user's footer position instead of snapping back to the request anchor` }).toBeGreaterThanOrEqual(3);
    } catch (error) {
        error.message += `\nHistory geometry: ${JSON.stringify({ savedScroll, restoredScroll, beforeBox, afterBox, bodyClasses: await page.locator('body').getAttribute('class') })}`;
        throw error;
    }
}

test.describe('Homepage request anchor navigation', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-wide', 'Explicit device matrix runs once');
    });

    for (const mode of modes) {
        test(`${mode.name}: footer cross-page request link opens the actual form`, async ({ browser }, testInfo) => {
            await withMode(browser, mode, async (page) => {
                await page.goto('/pages/services.html?noedit=1', { waitUntil: 'domcontentloaded' });
                const link = page.locator('.preview-footer__list a[href="../index.html#request-form"]');
                await link.click();
                await expect(page).toHaveURL(/\/index\.html#request-form$/);
                await expectRequestInView(page, testInfo, `${mode.name}-cross-page`);
            });
        });

        test(`${mode.name}: cold anchor, reload and repeated home link stay usable`, async ({ browser }, testInfo) => {
            test.setTimeout(90_000);
            await withMode(browser, mode, async (page) => {
                await page.goto('/index.html?noedit=1#request-form', { waitUntil: 'domcontentloaded' });
                await expectRequestInView(page, testInfo, `${mode.name}-cold`);
                await page.reload({ waitUntil: 'domcontentloaded' });
                await expectRequestInView(page, testInfo, `${mode.name}-reload`);
                await page.locator('.preview-footer__list a[href="#request-form"]').click();
                await expectRequestInView(page, testInfo, `${mode.name}-repeat-footer`);
            });
        });

        test(`${mode.name}: same-page request link works and Back preserves ordinary scroll`, async ({ browser }, testInfo) => {
            test.setTimeout(90_000);
            await withMode(browser, mode, async (page) => {
                await page.goto('/index.html?noedit=1', { waitUntil: 'domcontentloaded' });
                const footerRequest = page.locator('.preview-footer__list a[href="#request-form"]');
                await footerRequest.click();
                await expectRequestInView(page, testInfo, `${mode.name}-same-page`);
                await footerRequest.click();
                await expectRequestInView(page, testInfo, `${mode.name}-same-page-repeat`);
                await expectOrdinaryBackRestoration(page, `${mode.name} without an incoming anchor`);

                await page.goto('/index.html?noedit=1#request-form', { waitUntil: 'domcontentloaded' });
                await expectRequestInView(page, testInfo, `${mode.name}-before-history`);
                await expectOrdinaryBackRestoration(page, `${mode.name} with an incoming anchor`);
            });
        });
    }

    for (const mode of modes.filter(({ name }) => name === 'phone-375' || name === 'desktop-1280')) {
        test(`${mode.name}: untouched first-screen calculate action reaches the form`, async ({ browser }, testInfo) => {
            await withMode(browser, mode, async (page) => {
                await page.goto('/index.html?noedit=1', { waitUntil: 'domcontentloaded' });
                const calculate = page.locator('.hero-scene a[href="#request-form"]:visible').first();
                await expect(calculate).toBeInViewport();
                expect(await page.evaluate(() => scrollY), 'No preliminary scrolling may materialize the deferred sections').toBe(0);
                await calculate.click();
                await expectRequestInView(page, testInfo, `${mode.name}-first-screen-calculate`);
            });
        });
    }

    test('mouse-375: narrow browser cold anchor and reload open the form', async ({ browser }, testInfo) => {
        await withMode(browser, { ...modes[0], hasTouch: false, isMobile: false }, async (page) => {
            await page.goto('/index.html?noedit=1#request-form', { waitUntil: 'domcontentloaded' });
            await expectRequestInView(page, testInfo, 'mouse-375-cold');
            await page.reload({ waitUntil: 'domcontentloaded' });
            await expectRequestInView(page, testInfo, 'mouse-375-reload');
        });
    });

    test('request anchor survives neighboring mobile reveal breakpoints', async ({ browser }, testInfo) => {
        test.setTimeout(60_000);
        for (const width of [639, 640, 641]) {
            await withMode(browser, { viewport: { width, height: 900 }, hasTouch: true, isMobile: false }, async (page) => {
                await page.goto('/index.html?noedit=1#request-form', { waitUntil: 'domcontentloaded' });
                await expectRequestInView(page, testInfo, `boundary-${width}-cold`);
            });
        }
    });

});
