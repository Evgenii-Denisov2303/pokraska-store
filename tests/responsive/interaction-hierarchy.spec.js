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
    test.setTimeout(120_000);

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

test('service navigation stays compact and sticky, moves one active pill, and preserves the artwork', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    test.setTimeout(150_000);

    const servicePages = [
        {
            name: 'powder-coating',
            path: '/pages/powder-coating.html?noedit=1',
            target: '#equipment'
        },
        {
            name: 'sandblasting',
            path: '/pages/sandblasting.html?noedit=1',
            target: '#rust'
        }
    ];

    for (const target of servicePages) {
        for (const width of [340, 375, 640]) {
            await page.setViewportSize({ width, height: 900 });
            await page.goto(target.path, { waitUntil: 'domcontentloaded' });

            const nav = page.locator('.service-quick-nav');
            const targetLink = page.locator(`.service-nav-link[href="${target.target}"]`);

            await expect(nav).toBeVisible();
            await expect(page.locator('.service-nav-link.active')).toHaveCount(1);

            const mobileVisual = await page.evaluate(() => {
                const navElement = document.querySelector('.service-quick-nav');
                const activeLink = navElement.querySelector('.service-nav-link.active');
                const activeIcon = activeLink.querySelector('.service-nav-link__icon');
                const navStyle = getComputedStyle(navElement);
                const activeStyle = getComputedStyle(activeLink);
                const activeIconAfter = getComputedStyle(activeIcon, '::after');

                return {
                    horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
                    navHeight: navElement.getBoundingClientRect().height,
                    navBackground: navStyle.backgroundImage,
                    navBackgroundColor: navStyle.backgroundColor,
                    activeHeight: activeLink.getBoundingClientRect().height,
                    activeBackground: activeStyle.backgroundImage,
                    activeRadius: Number.parseFloat(activeStyle.borderRadius),
                    iconUnderlineContent: activeIconAfter.content,
                    iconUnderlineDisplay: activeIconAfter.display
                };
            });

            expect(mobileVisual.horizontalOverflow, `${target.name}: overflow at ${width}px`).toBeLessThanOrEqual(2);
            expect(mobileVisual.navHeight, `${target.name}: mobile navigation is not compact at ${width}px`).toBeLessThanOrEqual(44);
            expect(mobileVisual.navHeight, `${target.name}: mobile navigation collapsed at ${width}px`).toBeGreaterThanOrEqual(38);
            expect(mobileVisual.navBackground, `${target.name}: mobile artwork is missing at ${width}px`).not.toBe('none');
            expect(mobileVisual.navBackgroundColor, `${target.name}: mobile surface is too transparent at ${width}px`).toContain('0.35');
            expect(mobileVisual.activeHeight, `${target.name}: mobile navigation target collapsed at ${width}px`).toBeGreaterThanOrEqual(34);
            expect(mobileVisual.activeBackground, `${target.name}: active mobile accent is missing at ${width}px`).not.toBe('none');
            expect(mobileVisual.activeRadius, `${target.name}: active mobile accent is square at ${width}px`).toBeGreaterThan(20);
            expect(
                mobileVisual.iconUnderlineContent === 'none' || mobileVisual.iconUnderlineDisplay === 'none',
                `${target.name}: obsolete mobile underline is still visible at ${width}px`
            ).toBe(true);

            await targetLink.hover();
            const mobileHoverVisual = await targetLink.evaluate((link) => {
                const style = getComputedStyle(link);
                return {
                    backgroundColor: style.backgroundColor,
                    radius: Number.parseFloat(style.borderRadius)
                };
            });
            expect(mobileHoverVisual.radius, `${target.name}: mobile hover becomes square at ${width}px`).toBeGreaterThan(20);
            expect(
                mobileHoverVisual.backgroundColor,
                `${target.name}: inactive mobile hover looks like a second active pill at ${width}px`
            ).toBe('rgba(0, 0, 0, 0)');

            await targetLink.click();
            await page.waitForTimeout(1700);

            await expect(page.locator('.service-nav-link.active')).toHaveCount(1);
            await expect(targetLink).toHaveClass(/active/);
            await expect(targetLink).toHaveAttribute('aria-current', 'page');

            const stickyMetrics = await page.evaluate((selector) => {
                const navElement = document.querySelector('.service-quick-nav');
                const section = document.querySelector(selector);
                const navRect = navElement.getBoundingClientRect();
                const sectionRect = section.getBoundingClientRect();
                const navStyle = getComputedStyle(navElement);

                return {
                    position: navStyle.position,
                    cssTop: Number.parseFloat(navStyle.top),
                    navTop: navRect.top,
                    navBottom: navRect.bottom,
                    sectionTop: sectionRect.top,
                    viewportHeight: window.innerHeight
                };
            }, target.target);

            expect(stickyMetrics.position, `${target.name}: navigation is not sticky at ${width}px`).toBe('sticky');
            expect(Math.abs(stickyMetrics.navTop - stickyMetrics.cssTop), `${target.name}: navigation left its sticky position at ${width}px`).toBeLessThanOrEqual(3);
            expect(stickyMetrics.navTop, `${target.name}: navigation left the viewport at ${width}px`).toBeGreaterThanOrEqual(0);
            expect(stickyMetrics.navBottom, `${target.name}: navigation covers the whole viewport at ${width}px`).toBeLessThan(stickyMetrics.viewportHeight);
            expect(stickyMetrics.sectionTop, `${target.name}: section heading is hidden below the navigation at ${width}px`).toBeGreaterThanOrEqual(stickyMetrics.navBottom + 6);
        }

        for (const width of [768, 844, 1024, 1101, 1102, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            await page.goto(target.path, { waitUntil: 'domcontentloaded' });

            const tabletDesktopVisual = await page.evaluate(() => {
                const navElement = document.querySelector('.service-quick-nav');
                const label = navElement.querySelector('.service-nav-link__label');
                const activeLink = navElement.querySelector('.service-nav-link.active');
                const activeIcon = navElement.querySelector('.service-nav-link.active .service-nav-link__icon');
                const beforeStyle = getComputedStyle(navElement, '::before');
                const activeStyle = getComputedStyle(activeLink);
                const activeIconAfter = getComputedStyle(activeIcon, '::after');

                return {
                    horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
                    navHeight: navElement.getBoundingClientRect().height,
                    navBackgroundColor: getComputedStyle(navElement).backgroundColor,
                    activeHeight: activeLink.getBoundingClientRect().height,
                    artworkDisplay: beforeStyle.display,
                    artworkContent: beforeStyle.content,
                    labelDisplay: getComputedStyle(label).display,
                    activeBackground: activeStyle.backgroundImage,
                    activeRadius: Number.parseFloat(activeStyle.borderRadius),
                    iconUnderlineContent: activeIconAfter.content,
                    iconUnderlineDisplay: activeIconAfter.display
                };
            });

            expect(tabletDesktopVisual.horizontalOverflow, `${target.name}: overflow at ${width}px`).toBeLessThanOrEqual(2);
            expect(tabletDesktopVisual.navHeight, `${target.name}: tablet/desktop navigation is not compact at ${width}px`).toBeLessThanOrEqual(46);
            expect(tabletDesktopVisual.navHeight, `${target.name}: tablet/desktop navigation collapsed at ${width}px`).toBeGreaterThanOrEqual(40);
            expect(tabletDesktopVisual.navBackgroundColor, `${target.name}: tablet/desktop surface is too transparent at ${width}px`).toContain('0.35');
            expect(tabletDesktopVisual.activeHeight, `${target.name}: tablet/desktop navigation target collapsed at ${width}px`).toBeGreaterThanOrEqual(34);
            expect(tabletDesktopVisual.artworkDisplay, `${target.name}: tablet artwork is hidden at ${width}px`).not.toBe('none');
            expect(tabletDesktopVisual.artworkContent, `${target.name}: tablet artwork is missing at ${width}px`).not.toBe('none');
            expect(tabletDesktopVisual.labelDisplay, `${target.name}: tablet label is hidden at ${width}px`).not.toBe('none');
            expect(tabletDesktopVisual.activeBackground, `${target.name}: active tablet pill is missing at ${width}px`).not.toBe('none');
            expect(tabletDesktopVisual.activeRadius, `${target.name}: active tablet state is square at ${width}px`).toBeGreaterThan(20);
            expect(
                tabletDesktopVisual.iconUnderlineContent === 'none' || tabletDesktopVisual.iconUnderlineDisplay === 'none',
                `${target.name}: obsolete underline is still visible at ${width}px`
            ).toBe(true);

            const targetLink = page.locator(`.service-nav-link[href="${target.target}"]`);
            await targetLink.click();
            await page.waitForTimeout(1700);
            await expect(page.locator('.service-nav-link.active')).toHaveCount(1);
            await expect(targetLink).toHaveClass(/active/);
            await expect(targetLink).toHaveAttribute('aria-current', 'page');

            const inactiveLink = page.locator('.service-nav-link:not(.active)').first();
            await inactiveLink.hover();
            await expect.poll(
                () => inactiveLink.evaluate((link) => getComputedStyle(link).backgroundColor),
                { message: `${target.name}: hover looks like a second active pill at ${width}px` }
            ).toBe('rgba(0, 0, 0, 0)');
            await expect(page.locator('.service-nav-link.active')).toHaveCount(1);
            await expect(targetLink).toHaveClass(/active/);

            const stickyMetrics = await page.evaluate((selector) => {
                const navElement = document.querySelector('.service-quick-nav');
                const section = document.querySelector(selector);
                const navRect = navElement.getBoundingClientRect();
                const sectionRect = section.getBoundingClientRect();
                const navStyle = getComputedStyle(navElement);

                return {
                    position: navStyle.position,
                    cssTop: Number.parseFloat(navStyle.top),
                    navTop: navRect.top,
                    navBottom: navRect.bottom,
                    sectionTop: sectionRect.top,
                    viewportHeight: window.innerHeight
                };
            }, target.target);

            expect(stickyMetrics.position, `${target.name}: navigation is not sticky at ${width}px`).toBe('sticky');
            expect(Math.abs(stickyMetrics.navTop - stickyMetrics.cssTop), `${target.name}: navigation left its sticky position at ${width}px`).toBeLessThanOrEqual(3);
            expect(stickyMetrics.navTop, `${target.name}: navigation left the viewport at ${width}px`).toBeGreaterThanOrEqual(0);
            expect(stickyMetrics.navBottom, `${target.name}: navigation covers the whole viewport at ${width}px`).toBeLessThan(stickyMetrics.viewportHeight);
            expect(stickyMetrics.sectionTop, `${target.name}: section heading is hidden below the navigation at ${width}px`).toBeGreaterThanOrEqual(stickyMetrics.navBottom + 6);
        }

        await page.setViewportSize({ width: 375, height: 900 });
        await page.goto(target.path, { waitUntil: 'domcontentloaded' });
        await page.evaluate((selector) => {
            document.querySelector(selector).scrollIntoView();
        }, target.target);
        await page.waitForTimeout(300);

        const scrolledTargetLink = page.locator(`.service-nav-link[href="${target.target}"]`);
        await expect(page.locator('.service-nav-link.active')).toHaveCount(1);
        await expect(scrolledTargetLink).toHaveClass(/active/);
        await expect(scrolledTargetLink).toHaveAttribute('aria-current', 'page');
    }
});
