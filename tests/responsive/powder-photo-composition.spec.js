const { test, expect } = require('@playwright/test');

const baseURL = `http://127.0.0.1:${process.env.SITE_TEST_PORT || '4173'}`;
const modes = [
    { width: 320, height: 740, hasTouch: true },
    { width: 390, height: 844, hasTouch: true },
    ...[640, 641, 767, 768, 769, 959, 960, 961].map(width => ({ width, height: 900 })),
    { width: 1280, height: 800 },
    { width: 1400, height: 1200 },
    { width: 1920, height: 1080 },
    { width: 980, height: 1800, hasTouch: true }
];

async function openPage(browser, mode, path = '/pages/powder-coating.html?noedit=1') {
    const context = await browser.newContext({
        baseURL, viewport: { width: mode.width, height: mode.height },
        hasTouch: Boolean(mode.hasTouch), isMobile: false, reducedMotion: 'reduce'
    });
    await context.route('**/*', route => new URL(route.request().url()).origin === baseURL
        ? route.continue() : route.abort());
    const page = await context.newPage();
    await page.goto(path, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    return { context, page };
}

async function cardMetrics(page, id) {
    const card = page.locator(`#${id}`);
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('.service-image')).toBeVisible();
    return card.evaluate(element => {
        const box = node => {
            const rect = node.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        };
        const image = element.querySelector('.service-image');
        return {
            card: box(element), image: box(image),
            photo: image.querySelector('img') ? box(image.querySelector('img')) : null,
            gap: parseFloat(getComputedStyle(element).columnGap),
            display: getComputedStyle(image).display,
            ribbon: getComputedStyle(element.querySelector('.service-header')).backgroundImage,
            headingFont: getComputedStyle(element.querySelector('h2')).fontFamily,
            copyFont: getComputedStyle(element.querySelector('.service-description')).fontFamily,
            overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
        };
    });
}

test.describe('powder photographs have a balanced responsive composition', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-wide', 'Explicit contexts cover the neighboring widths.');
    });

    for (const mode of modes) {
        test(`proportional photos and reserved interior slot at ${mode.width}x${mode.height}`, async ({ browser }, testInfo) => {
            const { context, page } = await openPage(browser, mode);
            try {
                const measurements = {};
                for (const id of ['wheels', 'metal', 'equipment']) {
                    const metrics = await cardMetrics(page, id);
                    measurements[id] = metrics;
                    const expectedWidth = mode.width <= 960
                        ? Math.min(metrics.card.width, 480)
                        : (metrics.card.width - metrics.gap) * .47;
                    expect(metrics.image.width, `${id}: photograph has a measured width contract`).toBeCloseTo(expectedWidth, 0);
                    expect(metrics.overflow).toBeLessThanOrEqual(2);
                    if (mode.width <= 960) {
                        expect(metrics.image.x + metrics.image.width / 2).toBeCloseTo(metrics.card.x + metrics.card.width / 2, 0);
                        expect(metrics.image.width).toBeLessThanOrEqual(480);
                    }
                    if (id !== 'equipment') {
                        expect(metrics.photo.width / metrics.photo.height).toBeCloseTo(1.5, 2);
                    }
                    expect(metrics.ribbon).toContain('rgb(229, 212, 186)');
                    expect(metrics.headingFont).toContain('Cormorant');
                    expect(metrics.copyFont).toContain('Manrope');
                }
                const reserved = await cardMetrics(page, 'interior');
                measurements.interior = reserved;
                expect(reserved.display).toBe('grid');
                expect(reserved.image.height).toBeGreaterThanOrEqual(220);
                expect(reserved.image.height).toBeLessThanOrEqual(389);
                const reservedWidth = mode.width <= 960 ? reserved.card.width : (reserved.card.width - reserved.gap) * .57;
                expect(reserved.image.width, 'the requested future-photo slot is not shrunk or removed').toBeCloseTo(reservedWidth, 0);
                await testInfo.attach('photo-geometry', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' });
            } finally {
                await context.close();
            }
        });
    }

    for (const mode of [modes[1], modes[5], modes[9], modes[11]]) {
        test(`all five complete products, stable slider and controls at ${mode.width}px`, async ({ browser }, testInfo) => {
            const { context, page } = await openPage(browser, mode);
            try {
                const slider = page.locator('#equipment [data-image-slider]');
                await slider.scrollIntoViewIfNeeded();
                await expect(slider).toHaveAttribute('data-slide-count', '5');
                const viewport = slider.locator('.equipment-slider__viewport');
                const before = await viewport.boundingBox();
                expect(before.width / before.height).toBeCloseTo(4 / 3, 2);
                for (let i = 0; i < 5; i++) {
                    await slider.locator('.equipment-slider__thumb').nth(i).click();
                    await expect(slider).toHaveAttribute('data-slide-index', String(i + 1));
                    const active = slider.locator('.equipment-slider__slide.is-active');
                    await expect.poll(() => active.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
                    const image = await active.evaluate(img => ({
                        width: img.naturalWidth, height: img.naturalHeight,
                        widthAttr: Number(img.getAttribute('width')), heightAttr: Number(img.getAttribute('height')),
                        fit: getComputedStyle(img).objectFit
                    }));
                    expect(image.fit, 'contain shows the whole product rather than trimming top and bottom').toBe('contain');
                    expect(image.widthAttr).toBe(image.width);
                    expect(image.heightAttr).toBe(image.height);
                    const after = await viewport.boundingBox();
                    expect(after.width).toBeCloseTo(before.width, 1);
                    expect(after.height).toBeCloseTo(before.height, 1);
                    // Four 4:3 originals fill the frame. The wider fifth needs only
                    // small top/bottom breathing room, never huge letterboxing.
                    const filledHeight = Math.min(after.height, after.width * image.height / image.width);
                    expect(filledHeight / after.height).toBeGreaterThan(.88);
                    expect(await slider.locator('.equipment-slider__thumb[aria-pressed="true"]').count()).toBe(1);
                    if (mode.width === 1400) await active.screenshot({ path: testInfo.outputPath(`equipment-${i + 1}.png`) });
                }
                await slider.locator('.equipment-slider__btn--next').click();
                await expect(slider).toHaveAttribute('data-slide-index', '1');
                await slider.locator('.equipment-slider__btn--prev').click();
                await expect(slider).toHaveAttribute('data-slide-index', '5');
            } finally {
                await context.close();
            }
        });
    }

    test('photo sizes no longer double across the tablet to desktop boundary', async ({ browser }) => {
        const widths = [];
        for (const width of [959, 960, 961]) {
            const { context, page } = await openPage(browser, { width, height: 900 });
            try {
                widths.push((await cardMetrics(page, 'wheels')).image.width);
            } finally {
                await context.close();
            }
        }
        expect(Math.max(...widths) / Math.min(...widths)).toBeLessThan(1.22);
    });

    test('shared stylesheet leaves sandblasting media proportions unchanged', async ({ browser }) => {
        for (const width of [390, 768, 960, 961, 1400]) {
            const { context, page } = await openPage(browser, { width, height: 900 }, '/pages/sandblasting.html?noedit=1');
            try {
                const id = await page.locator('.service-detail-card').first().getAttribute('id');
                const metrics = await cardMetrics(page, id);
                const expectedWidth = width <= 960 ? metrics.card.width : (metrics.card.width - metrics.gap) * .57;
                expect(metrics.image.width).toBeCloseTo(expectedWidth, 0);
            } finally {
                await context.close();
            }
        }
    });
});
