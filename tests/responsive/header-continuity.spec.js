const { test, expect } = require('@playwright/test');

const baseURL = 'http://127.0.0.1:4173';
const tolerance = 0.6;
const headerSelector = '.hero-header--desktop-home, .internal-scene-header';
const innerPages = [
    '/pages/services.html',
    '/pages/sandblasting.html',
    '/pages/powder-coating.html',
    '/pages/gallery.html',
    '/pages/contacts.html',
    '/pages/prices.html',
    '/pages/automation-ati3000a.html',
    '/pages/payment-documents.html',
    '/politika.html'
];

async function withViewport(browser, viewport, hasTouch, callback) {
    const context = await browser.newContext({ baseURL, viewport, hasTouch, isMobile: false });
    try {
        await callback(await context.newPage());
    } finally {
        await context.close();
    }
}

async function waitForHeader(page) {
    await expect(page.locator(headerSelector).first()).toBeVisible();
    await page.evaluate(async () => {
        await document.fonts.ready;
        const image = document.querySelector('.hero-stage__picture img');
        if (image) await image.decode();
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
}

async function openPage(page, path) {
    await page.mouse.move(0, 0);
    await page.goto(`${path}?noedit=1`, { waitUntil: 'domcontentloaded' });
    await waitForHeader(page);
}

async function collectHeader(page) {
    return page.evaluate((selector) => {
        const rect = (element) => {
            const box = element.getBoundingClientRect();
            // Reload/back navigation may restore scroll. Compare document geometry,
            // not the viewport translation caused by the browser's scroll position.
            return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
        };
        const header = [...document.querySelectorAll(selector)].find((element) => element.checkVisibility());
        const elements = {
            header,
            mark: header.querySelector('.hero-brand__mark'),
            name: header.querySelector('.hero-brand__name'),
            eyebrow: header.querySelector('.hero-brand__eyebrow'),
            phone: header.querySelector('.hero-header-link--primary'),
            phoneText: header.querySelector('.hero-header-link--primary .hero-header-main'),
            nav: header.querySelector('.hero-scene__nav')
        };
        const stage = document.querySelector('.hero-stage');
        const picture = stage.querySelector('.hero-stage__picture');
        const image = picture?.querySelector('img');
        const imageStyle = image && getComputedStyle(image);
        const scene = document.querySelector('.hero-scene, .internal-hero-scene');
        return {
            visible: Object.fromEntries(Object.entries(elements).map(([key, element]) => [key,
                Boolean(element && element.checkVisibility() && Number(getComputedStyle(element).opacity) > 0)
            ])),
            boxes: Object.fromEntries(Object.entries(elements).map(([key, element]) => [key, rect(element)])),
            links: [...elements.nav.querySelectorAll('.hero-nav__link')].map((link) => ({
                text: link.textContent.trim(),
                box: rect(link)
            })),
            scene: rect(scene),
            stage: rect(stage),
            picture: picture ? rect(picture) : null,
            image: image ? {
                box: rect(image),
                cssWidth: parseFloat(imageStyle.width),
                cssHeight: parseFloat(imageStyle.height),
                source: new URL(image.currentSrc).pathname,
                objectFit: imageStyle.objectFit,
                objectPosition: imageStyle.objectPosition,
                transform: imageStyle.transform
            } : null,
            imagePreloads: [...document.querySelectorAll('link[rel="preload"][as="image"]')]
                .filter((link) => matchMedia(link.media).matches && link.href.includes('/hero/home-hero-'))
                .map((link) => new URL(link.href).pathname),
            horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
        };
    }, headerSelector);
}

function expectBox(actual, expected, label, dimensions = ['x', 'y', 'width', 'height']) {
    for (const dimension of dimensions) {
        expect(Math.abs(actual[dimension] - expected[dimension]), `${label}: ${dimension} moved`).toBeLessThanOrEqual(tolerance);
    }
}

function expectSameHeader(actual, expected, label) {
    for (const key of Object.keys(expected.boxes)) {
        expect(expected.visible[key], `${label}: homepage ${key} is hidden`).toBe(true);
        expect(actual.visible[key], `${label}: destination ${key} is hidden`).toBe(true);
        expectBox(actual.boxes[key], expected.boxes[key], `${label}: ${key}`);
    }
    expect(actual.links.map((link) => link.text), `${label}: navigation order differs`).toEqual(expected.links.map((link) => link.text));
    actual.links.forEach((link, index) => expectBox(link.box, expected.links[index].box, `${label}: ${link.text}`));

    // Inner pages intentionally expose only the top of the same virtual hero canvas.
    expectBox(actual.scene, expected.scene, `${label}: scene`, ['x', 'y', 'width']);
    expect(actual.image, `${label}: hero image is missing`).not.toBeNull();
    expect(expected.image, `${label}: homepage hero image is missing`).not.toBeNull();
    expectBox(actual.stage, expected.stage, `${label}: virtual hero stage`);
    expectBox(actual.picture, expected.picture, `${label}: picture`);
    expectBox(actual.image.box, expected.image.box, `${label}: image`);
    for (const dimension of ['cssWidth', 'cssHeight']) {
        expect(Math.abs(actual.image[dimension] - expected.image[dimension]), `${label}: image ${dimension}`).toBeLessThanOrEqual(tolerance);
    }
    for (const property of ['source', 'objectFit', 'objectPosition', 'transform']) {
        expect(actual.image[property], `${label}: image ${property} differs`).toBe(expected.image[property]);
    }
    expect(actual.imagePreloads, `${label}: preload must match the selected hero without an extra image`).toEqual([actual.image.source]);
    expect(expected.horizontalOverflow, `${label}: homepage horizontal overflow`).toBeLessThanOrEqual(2);
    expect(actual.horizontalOverflow, `${label}: horizontal overflow`).toBeLessThanOrEqual(2);
}

async function expectStationaryHover(page, label) {
    const link = page.locator(headerSelector).locator('.hero-nav__link:not([aria-current="page"])').first();
    const before = await link.boundingBox();
    await link.hover();
    // Sample after the existing hover transition, not its unchanged first frame.
    await page.waitForTimeout(350);
    expectBox(await link.boundingBox(), before, `${label}: inactive navigation hover`);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(350);
}

for (const hasTouch of [false, true]) {
    const mode = hasTouch ? 'touch desktop-site' : 'mouse desktop';

    test(`header and hero do not jump across page transitions (${mode})`, async ({ browser }, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-wide');
        test.setTimeout(150_000);

        for (const viewport of [{ width: 1280, height: 800 }, { width: 1400, height: 1200 }]) {
            await withViewport(browser, viewport, hasTouch, async (page) => {
                const label = `${viewport.width}x${viewport.height} ${mode}`;
                await openPage(page, '/index.html');
                const home = await collectHeader(page);
                await expectStationaryHover(page, `${label}: home`);

                const targets = viewport.width === 1400 ? innerPages : innerPages.slice(0, 1);
                for (const path of targets) {
                    await openPage(page, path);
                    expectSameHeader(await collectHeader(page), home, `${label}: ${path}`);
                }

                // A real navigation click must not leave the hovered/active link in a different position.
                await openPage(page, '/index.html');
                await page.locator('.hero-header--desktop-home .hero-nav__link').filter({ hasText: /^Каталог$/ }).click();
                await page.waitForURL('**/pages/services.html');
                await waitForHeader(page);
                expectSameHeader(await collectHeader(page), home, `${label}: catalog after click`);
                await page.mouse.move(0, 0);
                await expectStationaryHover(page, `${label}: catalog`);

                // Reload at a different wall-clock time: paused animation must not choose a new frame.
                await page.waitForTimeout(150);
                await page.reload({ waitUntil: 'domcontentloaded' });
                await waitForHeader(page);
                expectSameHeader(await collectHeader(page), home, `${label}: catalog after reload`);
            });
        }
    });

    test(`shared header geometry survives neighboring desktop breakpoints (${mode})`, async ({ browser }, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-wide');
        test.setTimeout(150_000);

        const viewports = [
            ...[1102, 1221, 1222, 1399, 1401, 1440, 1441, 1600, 1601].map((width) => ({ width, height: 1200 })),
            { width: 1920, height: 1080 },
            { width: 1600, height: 2400 },
            { width: 2200, height: 2200 }
        ];
        for (const viewport of viewports) {
            await withViewport(browser, viewport, hasTouch, async (page) => {
                await openPage(page, '/index.html');
                const home = await collectHeader(page);
                await openPage(page, '/pages/services.html');
                expectSameHeader(await collectHeader(page), home, `${viewport.width}x${viewport.height} ${mode}`);
            });
        }
    });
}
