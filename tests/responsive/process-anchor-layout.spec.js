const { test, expect } = require('@playwright/test');

const baseURL = process.env.SITE_TEST_BASE_URL || `http://127.0.0.1:${process.env.SITE_TEST_PORT || '4173'}`;
const modes = [
    { width: 390, height: 844, hasTouch: true },
    ...[640, 641, 767, 768, 769, 959, 960, 961, 1280].map(width => ({ width, height: 900, hasTouch: false })),
    { width: 980, height: 1800, hasTouch: true },
    { width: 1400, height: 1200, hasTouch: false }
];

async function withMode(browser, mode, callback) {
    const { width, height, hasTouch, reducedMotion = 'no-preference' } = mode;
    const context = await browser.newContext({ baseURL, viewport: { width, height }, hasTouch, isMobile: false, reducedMotion });
    try {
        await context.route('**/*', route => new URL(route.request().url()).origin === baseURL
            ? route.continue() : route.abort());
        await callback(await context.newPage());
    } finally {
        await context.close();
    }
}

async function openPage(page, path = '/pages/powder-coating.html?noedit=1') {
    await page.goto(path, { waitUntil: 'load' });
    await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
}

async function anchorMetrics(page, id) {
    return page.evaluate(id => {
        const nav = document.querySelector('.service-quick-nav');
        const target = document.getElementById(id);
        return {
            scrollY,
            targetTop: target.getBoundingClientRect().top,
            navTop: nav.getBoundingClientRect().top,
            navBottom: nav.getBoundingClientRect().bottom,
            stickyTop: Number.parseFloat(getComputedStyle(nav).top) || 0,
            firstTarget: nav.querySelector('.service-nav-link')?.hash === `#${id}`,
            active: [...nav.querySelectorAll('.active')].map(link => link.hash),
            ariaCurrent: [...nav.querySelectorAll('[aria-current="page"]')].map(link => link.hash),
            estimated: [...document.querySelectorAll('.service-detail-card')].filter(card => getComputedStyle(card).contentVisibility === 'auto').map(card => card.id),
            overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
        };
    }, id);
}

async function expectAligned(page, id) {
    let previous = '';
    let stable = 0;
    let metrics;
    await expect.poll(async () => {
        metrics = await anchorMetrics(page, id);
        const signature = `${Math.round(metrics.scrollY)}:${Math.round(metrics.targetTop)}:${Math.round(metrics.navBottom)}`;
        stable = signature === previous ? stable + 1 : 0;
        previous = signature;
        const clearance = metrics.targetTop - metrics.navBottom;
        // The first section immediately follows the navigation in normal flow.
        // After an upward jump the navigation may not yet be stuck, so that
        // section legitimately touches its lower edge. Later sections must
        // still land at the explicit 14px sticky-navigation clearance.
        const firstInNormalFlow = metrics.firstTarget && metrics.navTop > metrics.stickyTop + 2;
        const aligned = clearance >= 10 && clearance <= 19
            || firstInNormalFlow && clearance >= -1 && clearance <= 2;
        return stable >= 2 && aligned
            && metrics.active.length === 1 && metrics.active[0] === `#${id}`;
    }, { timeout: 6500, intervals: [100, 150, 250], message: `#${id}: settled target and scrollspy agree` }).toBe(true);
    expect(metrics.ariaCurrent).toEqual([`#${id}`]);
    expect(metrics.estimated, 'anchor positions must not depend on skipped card height estimates').toEqual([]);
    expect(metrics.overflow).toBeLessThanOrEqual(2);
}

test.describe('service anchors use resolved content rather than skipped-height estimates', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-wide', 'Explicit contexts cover neighboring breakpoints without duplicating every project.');
    });

    for (const mode of modes) {
        test(`cold long jump, repeated selection and upward click at ${mode.width}x${mode.height}`, async ({ browser }) => {
            await withMode(browser, mode, async page => {
                await openPage(page);
                // Do not visit/materialize the preceding cards before this click.
                await page.locator('.service-nav-link[href="#interior"]').click();
                await expectAligned(page, 'interior');
                await page.locator('.service-nav-link[href="#interior"]').click();
                await expectAligned(page, 'interior');
                await page.locator('.service-nav-link[href="#wheels"]').click();
                await expectAligned(page, 'wheels');
            });
        });
    }

    for (const width of [641, 768, 960]) {
        test(`reduced motion uses an immediate, correctly aligned jump at ${width}px`, async ({ browser }) => {
            await withMode(browser, { width, height: 900, hasTouch: false, reducedMotion: 'reduce' }, async page => {
                await page.addInitScript(() => {
                    const original = window.scrollTo.bind(window);
                    window.serviceScrollBehaviors = [];
                    window.scrollTo = (...args) => {
                        window.serviceScrollBehaviors.push(args[0]?.behavior);
                        return original(...args);
                    };
                });
                await openPage(page);
                await page.locator('.service-nav-link[href="#interior"]').click();
                await expectAligned(page, 'interior');
                expect(await page.evaluate(() => window.serviceScrollBehaviors)).toEqual(['instant']);
            });
        });
    }

    for (const width of [641, 960]) {
        test(`incoming hash settles and wheel scrolling releases the selected topic at ${width}px`, async ({ browser }) => {
            await withMode(browser, { width, height: 900, hasTouch: false }, async page => {
                await openPage(page, '/pages/powder-coating.html?noedit=1#interior');
                await expectAligned(page, 'interior');
                await page.mouse.move(width / 2, 450);
                await page.mouse.wheel(0, -500);
                await expect.poll(() => page.locator('.service-nav-link.active').getAttribute('href'), { timeout: 4000 }).toBe('#equipment');
                await page.waitForTimeout(500);
                await expect(page.locator('.service-nav-link.active')).toHaveCount(1);
                await expect(page.locator('.service-nav-link[href="#equipment"]')).toHaveAttribute('aria-current', 'page');
            });
        });
    }

    for (const width of [390, 768, 960]) {
        test(`sandblasting uses the same resolved-anchor contract at ${width}px`, async ({ browser }) => {
            await withMode(browser, { width, height: 900, hasTouch: width === 390 }, async page => {
                await openPage(page, '/pages/sandblasting.html?noedit=1');
                const ids = await page.locator('.service-quick-nav a').evaluateAll(links => links.map(link => link.hash.slice(1)));
                const target = ids.at(-1);
                await page.locator(`.service-nav-link[href="#${target}"]`).click();
                await expectAligned(page, target);
                await page.locator(`.service-nav-link[href="#${ids[0]}"]`).click();
                await expectAligned(page, ids[0]);
            });
        });
    }
});
