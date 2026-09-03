const { test, expect } = require('@playwright/test');

const viewports = [
    { width: 360, height: 800 },
    { width: 375, height: 812 },
    { width: 412, height: 915 },
    { width: 768, height: 1024 },
    { width: 844, height: 900 },
    { width: 1440, height: 900 }
];

const pages = [
    {
        name: 'contacts',
        path: '/pages/contacts.html?noedit=1',
        primary: '.contacts-route-actions__primary',
        secondary: '.contacts-route-actions .ui-secondary',
        staticSurface: '.contacts-meta-chip'
    },
    {
        name: 'prices',
        path: '/pages/prices.html?noedit=1',
        primary: '.decision-cta__primary',
        secondary: '.decision-cta__secondary',
        staticSurface: '.factor-card'
    },
    {
        name: 'payment-documents',
        path: '/pages/payment-documents.html?noedit=1',
        primary: '.decision-cta__primary',
        secondary: '.decision-cta__secondary',
        staticSurface: '.payment-doc-card'
    },
    {
        name: 'sandblasting',
        path: '/pages/sandblasting.html?noedit=1',
        primary: '.decision-cta__primary',
        secondary: '.decision-cta__secondary',
        staticSurface: '.advantage-item'
    },
    {
        name: 'powder-coating',
        path: '/pages/powder-coating.html?noedit=1',
        primary: '.decision-cta__primary',
        secondary: '.decision-cta__secondary',
        staticSurface: '.advantage-item'
    },
    {
        name: 'gallery',
        path: '/pages/gallery.html?noedit=1',
        primary: '.order-cta__button--primary',
        secondary: '.order-cta__button--secondary',
        staticSurface: '.gallery-more__meta'
    },
    {
        name: 'services',
        path: '/pages/services.html?noedit=1',
        primary: '.catalog-assistant__primary',
        secondary: '.catalog-assistant__action',
        staticSurface: '.catalog-info-card'
    },
    {
        name: 'automation',
        path: '/pages/automation-ati3000a.html?noedit=1',
        primary: '.automation-product-cta .btn-primary',
        secondary: '.automation-product-cta .btn-secondary',
        staticSurface: '.automation-product-specs li'
    }
];

test('interaction hierarchy stays clear at exact production widths', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    test.setTimeout(90_000);

    for (const viewport of viewports) {
        await page.setViewportSize(viewport);

        for (const target of pages) {
            await page.goto(target.path, { waitUntil: 'domcontentloaded' });

            const primary = page.locator(target.primary).first();
            const secondary = page.locator(target.secondary).first();

            await expect(primary, `${target.name}: primary action is missing at ${viewport.width}px`).toBeVisible();
            await expect(secondary, `${target.name}: secondary action is missing at ${viewport.width}px`).toBeVisible();

            const metrics = await page.evaluate(({ primarySelector, secondarySelector, staticSelector }) => {
                const html = document.documentElement;
                const body = document.body;
                const primaryElement = document.querySelector(primarySelector);
                const secondaryElement = document.querySelector(secondarySelector);
                const staticElement = document.querySelector(staticSelector);
                const primaryStyle = getComputedStyle(primaryElement);
                const secondaryStyle = getComputedStyle(secondaryElement);
                const staticStyle = getComputedStyle(staticElement);
                const primaryRect = primaryElement.getBoundingClientRect();
                const secondaryRect = secondaryElement.getBoundingClientRect();

                return {
                    interactionStylesheetLoaded: [...document.styleSheets].some((sheet) => sheet.href?.includes('interaction-system.css')),
                    horizontalOverflow: Math.max(html.scrollWidth, body.scrollWidth) - window.innerWidth,
                    primaryHeight: primaryRect.height,
                    secondaryHeight: secondaryRect.height,
                    primaryRight: primaryRect.right,
                    secondaryRight: secondaryRect.right,
                    primaryBackground: primaryStyle.backgroundImage,
                    secondaryBackground: secondaryStyle.backgroundImage,
                    primaryColor: primaryStyle.color,
                    secondaryColor: secondaryStyle.color,
                    staticCursor: staticStyle.cursor,
                    viewportWidth: window.innerWidth
                };
            }, {
                primarySelector: target.primary,
                secondarySelector: target.secondary,
                staticSelector: target.staticSurface
            });

            expect(metrics.interactionStylesheetLoaded, `${target.name}: interaction stylesheet is missing`).toBe(true);
            expect(metrics.horizontalOverflow, `${target.name}: horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(2);
            expect(metrics.primaryHeight, `${target.name}: primary action is too short`).toBeGreaterThanOrEqual(38);
            expect(metrics.secondaryHeight, `${target.name}: secondary action is too short`).toBeGreaterThanOrEqual(38);
            expect(metrics.primaryRight, `${target.name}: primary action leaves the viewport`).toBeLessThanOrEqual(metrics.viewportWidth + 1);
            expect(metrics.secondaryRight, `${target.name}: secondary action leaves the viewport`).toBeLessThanOrEqual(metrics.viewportWidth + 1);
            expect(
                `${metrics.primaryBackground}|${metrics.primaryColor}`,
                `${target.name}: primary and secondary actions lost their visual distinction`
            ).not.toBe(`${metrics.secondaryBackground}|${metrics.secondaryColor}`);
            expect(metrics.staticCursor, `${target.name}: static information looks interactive`).not.toBe('pointer');
        }
    }
});
