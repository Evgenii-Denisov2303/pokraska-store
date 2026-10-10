const { test, expect } = require('@playwright/test');

const gateTypes = ['sliding', 'swing'];
const visualViewports = [
    { width: 320, height: 740 },
    { width: 375, height: 812 },
    { width: 639, height: 900 },
    { width: 640, height: 900 },
    { width: 641, height: 900 },
    { width: 767, height: 1024 },
    { width: 768, height: 1024 },
    { width: 769, height: 1024 },
    { width: 819, height: 1024 },
    { width: 820, height: 1024 },
    { width: 821, height: 1024 },
    { width: 844, height: 390 },
    { width: 979, height: 740 },
    { width: 980, height: 740 },
    { width: 980, height: 1800 },
    { width: 981, height: 740 },
    { width: 1280, height: 800 },
    { width: 1400, height: 1200 }
];
const screenshotWidths = new Set([320, 375, 768, 1280, 1400]);

async function openGate(page, type) {
    const response = await page.goto(`/pages/gates-${type}.html?noedit=1`, { waitUntil: 'domcontentloaded' });
    expect(response.status()).toBe(200);
    await expect(page.locator('.gate-detail__title')).toBeVisible();
    await page.evaluate(async () => {
        await document.fonts.ready;
        await document.querySelector('[data-main-image]').decode();
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
}

async function saveViewport(page, testInfo, name) {
    const path = testInfo.outputPath(`${name}.png`);
    await page.screenshot({ path });
    await testInfo.attach(name, { path, contentType: 'image/png' });
}

async function gateMetrics(page) {
    return page.evaluate(() => {
        const rect = (element) => {
            const box = element.getBoundingClientRect();
            return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
        };
        const frame = document.querySelector('.gate-gallery__main');
        const image = frame.querySelector('img');
        const frameBox = rect(frame);
        const imageBox = rect(image);
        const style = getComputedStyle(image);
        const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        const imageWidth = image.clientWidth - paddingX;
        const imageHeight = image.clientHeight - paddingY;
        const intrinsicWidth = image.naturalWidth;
        const intrinsicHeight = image.naturalHeight;
        const scale = style.objectFit === 'cover'
            ? Math.max(imageWidth / intrinsicWidth, imageHeight / intrinsicHeight)
            : Math.min(imageWidth / intrinsicWidth, imageHeight / intrinsicHeight);
        // The img element can fill its frame while a contained portrait photo
        // leaves enormous blank sides. Measure the rendered image, not just img.
        const paintedWidth = style.objectFit === 'fill' ? imageWidth : Math.min(imageWidth, intrinsicWidth * scale);
        const paintedHeight = style.objectFit === 'fill' ? imageHeight : Math.min(imageHeight, intrinsicHeight * scale);
        return {
            overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
            title: rect(document.querySelector('.gate-detail__title')),
            primaryAction: rect(document.querySelector('.gate-detail__actions a')),
            intro: rect(document.querySelector('.gate-detail__intro')),
            frame: frameBox,
            photo: { intrinsicWidth, intrinsicHeight, widthFill: paintedWidth / frame.clientWidth, heightFill: paintedHeight / frame.clientHeight, imageBox },
            thumbs: [...document.querySelectorAll('[data-thumb-src]')].map(rect),
            thumbStrip: rect(document.querySelector('.automation-product-thumbs')),
            guideColumns: [...document.querySelector('.gate-detail__columns').children].map(rect),
            oldGuideCardCount: document.querySelectorAll('.gate-detail .automation-product-guide__card').length,
            faqTop: document.querySelector('.faq-system').getBoundingClientRect().top + scrollY,
            clippedText: [...document.querySelectorAll('.gate-detail__intro a, .gate-detail__title, .gate-detail__columns h2')]
                .filter((element) => {
                    const css = getComputedStyle(element);
                    return element.scrollWidth > element.clientWidth + 2 && css.overflowX !== 'visible';
                }).map((element) => element.textContent.trim())
        };
    });
}

async function headerMetrics(page) {
    await page.evaluate(async () => {
        await document.fonts.ready;
        window.scrollTo(0, 0);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    return page.evaluate(() => {
        const desktop = document.querySelector('.internal-scene-header');
        const compact = document.querySelector('.internal-legacy-header .header-top');
        const header = desktop.checkVisibility() ? desktop : compact;
        const rect = (element) => {
            if (!element || !element.checkVisibility()) return null;
            const box = element.getBoundingClientRect();
            return { x: box.x, y: box.y, width: box.width, height: box.height };
        };
        const logo = header.querySelector('.hero-brand__mark');
        const name = header.querySelector('.hero-brand__name');
        return {
            compact: header === compact,
            boxes: {
                header: rect(header), logo: rect(logo), name: rect(name),
                phone: rect(header.querySelector('.hero-header-link--primary, .contact-phone')),
                menu: rect(header.querySelector('.hero-menu-toggle')),
                nav: rect(header.querySelector('.hero-scene__nav'))
            }
        };
    });
}

test.describe('SEO additions remain part of the existing visual design', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-wide', 'Explicit viewport matrix runs once');
    });

    for (const type of gateTypes) {
        test(`${type}: first screen, full-width photos and compact explanations`, async ({ page }, testInfo) => {
            test.setTimeout(150_000);
            for (const viewport of visualViewports) {
                await page.setViewportSize(viewport);
                await openGate(page, type);
                const label = `${type} ${viewport.width}x${viewport.height}`;
                const metrics = await gateMetrics(page);
                expect(metrics.overflow, `${label}: horizontal overflow`).toBeLessThanOrEqual(2);
                expect(metrics.clippedText, `${label}: text clipped inside a fixed box`).toEqual([]);
                expect(metrics.primaryAction.height, `${label}: main action keeps an adequate tap target`).toBeGreaterThanOrEqual(42);
                expect(metrics.photo.intrinsicWidth, `${label}: photo loaded`).toBeGreaterThan(0);
                expect(metrics.photo.widthFill, `${label}: visible photo fills the frame width`).toBeGreaterThanOrEqual(0.85);
                expect(metrics.photo.heightFill, `${label}: visible photo fills the frame height`).toBeGreaterThanOrEqual(0.85);
                expect(metrics.frame.width, `${label}: photo not collapsed`).toBeGreaterThan(200);
                expect(metrics.thumbStrip.height, `${label}: thumbnails must not become a second large gallery`).toBeLessThanOrEqual(96);
                for (const thumb of metrics.thumbs) {
                    expect(thumb.width, `${label}: thumbnail width`).toBeLessThanOrEqual(100);
                    expect(thumb.height, `${label}: thumbnail height`).toBeLessThanOrEqual(80);
                }
                expect(metrics.oldGuideCardCount, `${label}: do not restore nine repeated product cards`).toBe(0);
                expect(metrics.guideColumns, `${label}: two concise subject sections`).toHaveLength(2);

                if (viewport.width <= 375) {
                    expect(metrics.title.y, `${label}: heading not hidden above the viewport`).toBeGreaterThanOrEqual(0);
                    expect(metrics.title.bottom, `${label}: heading visible without scrolling`).toBeLessThan(viewport.height);
                    expect(metrics.primaryAction.bottom, `${label}: primary action visible without scrolling`).toBeLessThanOrEqual(viewport.height - 8);
                    expect(metrics.intro.bottom, `${label}: mobile text appears before gallery`).toBeLessThanOrEqual(metrics.frame.y + 1);
                    expect(metrics.faqTop, `${label}: avoid an excessively long repeated guide stack`).toBeLessThan(4000);
                }

                if (screenshotWidths.has(viewport.width)) {
                    await saveViewport(page, testInfo, `${type}-${viewport.width}-intro`);
                    await page.locator('.gate-gallery').scrollIntoViewIfNeeded();
                    await saveViewport(page, testInfo, `${type}-${viewport.width}-gallery`);
                    await page.locator('#calculation').scrollIntoViewIfNeeded();
                    await saveViewport(page, testInfo, `${type}-${viewport.width}-calculation`);
                }
            }
        });
    }

    test('gate pages retain the catalog header geometry across navigation', async ({ page }) => {
        test.setTimeout(120_000);
        for (const viewport of [
            { width: 320, height: 740 }, { width: 375, height: 812 },
            { width: 768, height: 1024 }, { width: 980, height: 740 },
            { width: 980, height: 1800 }, { width: 844, height: 390 },
            { width: 1280, height: 800 }, { width: 1400, height: 1200 }
        ]) {
            await page.setViewportSize(viewport);
            await page.goto('/pages/services.html?noedit=1', { waitUntil: 'domcontentloaded' });
            const baseline = await headerMetrics(page);
            for (const type of gateTypes) {
                await openGate(page, type);
                const actual = await headerMetrics(page);
                const label = `${type} ${viewport.width}x${viewport.height}`;
                expect(actual.compact, `${label}: same header breakpoint`).toBe(baseline.compact);
                for (const [name, box] of Object.entries(baseline.boxes)) {
                    if (!box) {
                        expect(actual.boxes[name], `${label}: ${name} visibility`).toBeNull();
                        continue;
                    }
                    expect(actual.boxes[name], `${label}: ${name} remains visible`).not.toBeNull();
                    for (const dimension of ['x', 'y', 'width', 'height']) {
                        expect(Math.abs(actual.boxes[name][dimension] - box[dimension]), `${label}: ${name} ${dimension}`).toBeLessThanOrEqual(1);
                    }
                }
            }
        }
    });

    test('catalog detail links follow the selected gate type and never leak into fences', async ({ page }) => {
        test.setTimeout(90_000);
        for (const viewport of [{ width: 375, height: 812 }, { width: 1280, height: 800 }]) {
            await page.setViewportSize(viewport);
            await page.goto('/pages/services.html?noedit=1', { waitUntil: 'domcontentloaded' });
            for (const type of gateTypes) {
                const panel = `catalog-panel-${type}`;
                await page.locator(`[data-catalog-tab="${panel}"]`).click();
                await expect(page.locator(`#${panel}`)).toBeVisible();
                const detailsLink = page.locator('[data-gate-details]:visible');
                await expect(detailsLink).toHaveCount(1);
                await expect(detailsLink).toHaveAttribute('href', `gates-${type}.html`);
                await detailsLink.click();
                await expect(page).toHaveURL(new RegExp(`/pages/gates-${type}\\.html$`));
                await expect(page.locator('.gate-detail__title')).toBeVisible();
                await page.goBack({ waitUntil: 'domcontentloaded' });
                await expect(page.locator(`#${panel}`)).toBeVisible();
                await expect(page.locator(`[data-catalog-tab="${panel}"]`)).toHaveClass(/is-active/);
            }
            await page.locator('[data-catalog-group="fences"]').click();
            await expect(page.locator('[data-catalog-group="fences"]')).toHaveClass(/is-active/);
            await expect(page.locator('[data-gate-details]:visible')).toHaveCount(0);
        }
    });

    test('gate primary action reaches the existing contact form', async ({ page }) => {
        for (const type of gateTypes) {
            await page.setViewportSize({ width: 375, height: 812 });
            await openGate(page, type);
            const action = page.locator('.gate-detail__actions a').first();
            await expect(action).toHaveAttribute('href', 'contacts.html#contact-form');
            await action.click();
            await expect(page).toHaveURL(/\/pages\/contacts\.html#contact-form$/);
            await expect(page.locator('#contact-form')).toBeVisible();
            await page.evaluate(() => document.fonts.ready);
            // Scrolling to a deep cross-page anchor collapses the mobile header
            // and removes body padding. A visible DOM node alone misses a title
            // shifted above the screen during that transition.
            await expect(page.locator('body')).toHaveClass(/header-hidden/);
            await page.evaluate(async () => {
                const finiteShellAnimations = document.getAnimations().filter((animation) => {
                    const element = animation.effect?.target;
                    return element instanceof Element
                        && (element === document.body || element.matches('.header, .header-top'))
                        && Number.isFinite(animation.effect.getComputedTiming().endTime);
                });
                await Promise.all(finiteShellAnimations.map((animation) => animation.finished.catch(() => {})));
            });
            await expect.poll(() => page.evaluate(() => {
                const title = document.querySelector('#contact-connect-title').getBoundingClientRect();
                const header = document.querySelector('.internal-legacy-header').getBoundingClientRect();
                const visibleHeaderBottom = Math.max(0, header.bottom);
                return title.top >= visibleHeaderBottom && title.bottom <= innerHeight;
            }), { message: `${type}: form heading is readable after the compact header collapses` }).toBe(true);
        }
    });

    test('touch mobile layout keeps the heading and primary action on the first screen', async ({ browser }, testInfo) => {
        const context = await browser.newContext({
            baseURL: `http://127.0.0.1:${process.env.SITE_TEST_PORT || '4173'}`,
            viewport: { width: 375, height: 812 },
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 1
        });
        try {
            const page = await context.newPage();
            for (const type of gateTypes) {
                await openGate(page, type);
                const metrics = await gateMetrics(page);
                expect(metrics.title.bottom, `${type}: mobile title on first screen`).toBeLessThan(812);
                expect(metrics.primaryAction.bottom, `${type}: mobile CTA on first screen`).toBeLessThanOrEqual(804);
                expect(metrics.overflow, `${type}: touch mobile overflow`).toBeLessThanOrEqual(2);
                await saveViewport(page, testInfo, `${type}-375-touch-intro`);
                const menu = page.locator('button[aria-controls="site-mobile-nav"]:visible').first();
                await menu.tap();
                await expect(menu).toHaveAttribute('aria-expanded', 'true');
                await expect(page.locator('#site-mobile-nav')).toBeVisible();
                await menu.tap();
                await expect(menu).toHaveAttribute('aria-expanded', 'false');
            }
        } finally {
            await context.close();
        }
    });
});
