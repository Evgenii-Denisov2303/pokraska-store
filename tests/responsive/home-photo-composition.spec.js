const { test, expect } = require('@playwright/test');

const widths = [320, 390, 640, 641, 768, 960, 1101, 1102, 1280, 1400, 1920];

async function photoMetrics(card) {
    return card.evaluate((element) => {
        const rect = (selector) => {
            const box = element.querySelector(selector).getBoundingClientRect();
            return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
        };
        return {
            frame: rect('.panel-scene__visual'),
            media: rect('.panel-scene__media'),
            overlay: rect('.panel-scene__overlay'),
            overlayVisible: getComputedStyle(element.querySelector('.panel-scene__overlay')).display !== 'none',
            viewer: rect('.panel-scene__viewer'),
            captionColor: getComputedStyle(element.querySelector('[data-panel-caption]')).color,
            copy: rect('.panel-scene__content'),
            imageFit: getComputedStyle(element.querySelector('.panel-scene__image.is-active')).objectFit,
            overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
            titleFamily: getComputedStyle(element.querySelector('h3')).fontFamily,
            bodyFamily: getComputedStyle(document.body).fontFamily,
            copyBackground: getComputedStyle(element.querySelector('.panel-scene__content'), '::before').backgroundColor
        };
    });
}

test('home photo frames stay landscape, bounded and aligned across neighboring widths', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    test.setTimeout(90_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const breakpointHeights = new Map();

    for (const width of widths) {
        await page.setViewportSize({ width, height: width <= 640 ? 844 : 900 });
        await page.goto('/?noedit=1', { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => document.fonts.ready);
        const cards = page.locator('.panel-scene__card');
        await expect(cards).toHaveCount(2);
        for (let index = 0; index < 2; index++) {
            const card = cards.nth(index);
            await card.scrollIntoViewIfNeeded();
            await expect(card).toHaveClass(/is-visible/);
            const m = await photoMetrics(card);
            const label = `${width}px card ${index}`;
            expect(m.overflow, `${label}: no horizontal page overflow`).toBeLessThanOrEqual(2);
            expect(m.frame.width / m.frame.height, `${label}: stable landscape frame`).toBeCloseTo(1.5, 2);
            expect(m.frame.width, `${label}: bounded photo size`).toBeLessThanOrEqual(width <= 1101 ? 561 : 781);
            for (const layer of ['media', 'overlay']) {
                if (layer === 'overlay' && !m.overlayVisible) continue;
                for (const key of ['x', 'y', 'width', 'height']) {
                    expect(Math.abs(m[layer][key] - m.frame[key]), `${label}: ${layer} matches frame ${key}`).toBeLessThanOrEqual(1);
                }
            }
            expect(m.viewer.x, `${label}: caption stays inside photo left`).toBeGreaterThanOrEqual(m.frame.x);
            expect(m.viewer.right, `${label}: caption stays inside photo right`).toBeLessThanOrEqual(m.frame.right + 1);
            expect(m.viewer.y, `${label}: caption stays inside photo top`).toBeGreaterThanOrEqual(m.frame.y);
            expect(m.viewer.bottom, `${label}: caption stays inside photo bottom`).toBeLessThanOrEqual(m.frame.bottom + 1);
            expect(m.captionColor, `${label}: captions stay legible over dark photos`).toBe('rgb(255, 253, 249)');
            expect(m.titleFamily, `${label}: preserve serif headings`).toContain('Cormorant Garamond');
            expect(m.bodyFamily, `${label}: preserve body family`).toContain('Manrope');
            expect(m.copyBackground, `${label}: preserve light surface`).toBe('rgb(251, 250, 247)');
            if ([1101, 1102].includes(width)) breakpointHeights.set(`${width}-${index}`, m.frame.height);
        }
    }
    for (let index = 0; index < 2; index++) {
        const before = breakpointHeights.get(`1101-${index}`);
        const after = breakpointHeights.get(`1102-${index}`);
        expect(Math.abs(after - before) / before, `card ${index}: no large photo-size jump at column breakpoint`).toBeLessThan(0.2);
    }
});

test('home photo selectors keep captions, image proportions and frame height stable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    test.setTimeout(90_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [320, 960, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/?noedit=1', { waitUntil: 'domcontentloaded' });
        const cards = page.locator('.panel-scene__card');
        for (let cardIndex = 0; cardIndex < 2; cardIndex++) {
            const card = cards.nth(cardIndex);
            await card.scrollIntoViewIfNeeded();
            await expect(card).toHaveClass(/is-visible/);
            const initial = await card.locator('.panel-scene__visual').boundingBox();
            const buttons = card.locator('.panel-scene__dot');
            for (let index = 0; index < await buttons.count(); index++) {
                const button = buttons.nth(index);
                const caption = await button.getAttribute('aria-label');
                await button.click();
                await expect(card.locator('[data-panel-caption]')).toHaveText(caption);
                await expect(card.locator('.panel-scene__dot.is-active')).toHaveCount(1);
                await expect(card.locator('.panel-scene__dot.is-active')).toHaveCSS('background-color', 'rgb(255, 253, 249)');
                await expect(card.locator('.panel-scene__dot:not(.is-active)').first()).toHaveCSS('background-color', 'rgba(255, 253, 249, 0.45)');
                const image = card.locator('.panel-scene__image.is-active');
                await expect.poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
                const imageMetrics = await image.evaluate((el) => ({
                    uncropped: el.classList.contains('panel-scene__image--uncropped'),
                    fit: getComputedStyle(el).objectFit,
                    width: el.naturalWidth,
                    height: el.naturalHeight
                }));
                expect(['cover', 'contain']).toContain(imageMetrics.fit);
                if (imageMetrics.width / imageMetrics.height <= 1) {
                    expect(imageMetrics.uncropped, `${caption}: square and portrait products must not be clipped`).toBe(true);
                    expect(imageMetrics.fit).toBe('contain');
                }
                const current = await card.locator('.panel-scene__visual').boundingBox();
                expect(Math.abs(current.height - initial.height), `${width}px ${caption}: no layout shift when selecting photos`).toBeLessThanOrEqual(1);
            }
        }
    }
});
