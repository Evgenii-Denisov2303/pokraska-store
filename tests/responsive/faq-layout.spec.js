const { test, expect } = require('@playwright/test');
const { checkFaqMarkers } = require('./helpers/faq-contract');

test('FAQ markers stay centered on both sides of responsive breakpoints', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide', 'Explicit viewport matrix runs once');
    await page.goto('/pages/services.html?noedit=1', { waitUntil: 'networkidle' });
    for (const width of [375, 640, 641, 760, 761, 960, 961, 1180, 1181, 1220, 1221, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await checkFaqMarkers(page), `FAQ is present at ${width}px`).toBeGreaterThan(0);
        const question = page.locator('.faq-system .faq-question').first();
        await question.click({ position: { x: 10, y: 10 } });
        await expect(question.locator('..')).toHaveAttribute('open', '');
        await checkFaqMarkers(page);
        if (width === 375 || width === 1440) {
            await question.locator('..').screenshot({ path: testInfo.outputPath(`faq-open-${width}.png`) });
        }
        await question.press('Enter');
        await expect(question.locator('..')).not.toHaveAttribute('open');
        await checkFaqMarkers(page);
    }
});
