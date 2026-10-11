const { test, expect } = require('@playwright/test');

const baseURL = `http://127.0.0.1:${process.env.SITE_TEST_PORT || '4173'}`;
const diagnosticsOnly = process.env.CONTACT_LAYOUT_DIAGNOSTICS === '1';
const touchPortraitSizes = [
    [980, 2000], [1089, 2300], [1100, 2350], [1102, 2350],
    [1300, 2750], [1307, 2750], [1463, 3100], [1960, 4200]
];
// These are logical CSS canvases, not a claim that Chrome zoom percentages
// always map to a particular width on every Android phone.
const contactsCases = [
    ...touchPortraitSizes.map(([width, height]) => ({ width, height, hasTouch: true })),
    { width: 320, height: 740, hasTouch: true, isMobile: true },
    { width: 390, height: 844, hasTouch: true, isMobile: true },
    { width: 640, height: 900, hasTouch: true },
    { width: 641, height: 900, hasTouch: true },
    { width: 768, height: 1024, hasTouch: true },
    { width: 1023, height: 900, hasTouch: true },
    { width: 1024, height: 900, hasTouch: true },
    { width: 980, height: 1469, hasTouch: true },
    { width: 980, height: 1470, hasTouch: true },
    { width: 1280, height: 800, hasTouch: false },
    { width: 1440, height: 900, hasTouch: false }
];
const innerPaths = [
    '/pages/services.html', '/pages/powder-coating.html', '/pages/sandblasting.html',
    '/pages/gallery.html', '/pages/prices.html', '/pages/contacts.html',
    '/pages/payment-documents.html', '/politika.html', '/pages/automation-ati3000a.html'
];

async function withCanvas(browser, canvas, callback) {
    const { width, height, hasTouch = true, isMobile = false } = canvas;
    const context = await browser.newContext({ baseURL, viewport: { width, height }, hasTouch, isMobile });
    // Verify the local layout without analytics, real maps, or a real form submission.
    // A same-sized blank iframe exercises the loaded embed layout, including its wrapper.
    await context.route('**/*', (route) => {
        const request = route.request();
        if (new URL(request.url()).origin === baseURL) return route.continue();
        if (request.resourceType() === 'document') {
            return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><html><body>Test embed</body></html>' });
        }
        return route.abort();
    });
    try {
        await callback(await context.newPage());
    } finally {
        await context.close();
    }
}

async function openLocal(page, path) {
    await page.goto(`${path}?noedit=1`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(async () => {
        await document.fonts.ready;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
}

async function contactMetrics(page) {
    return page.evaluate(() => {
        const box = (element) => {
            const rect = element.getBoundingClientRect();
            return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height, bottom: rect.bottom + scrollY };
        };
        const rect = (selector) => box(document.querySelector(selector));
        const contacts = [...document.querySelectorAll('.contact-directory a[href^="tel:"], .contact-directory a[href^="mailto:"]')].map((value) => {
            const range = document.createRange();
            range.selectNodeContents(value);
            const lines = [...range.getClientRects()].filter((line) => line.width > 0 && line.height > 0);
            return { box: box(value.closest('.contact-directory__row')), lines: new Set(lines.map((line) => Math.round(line.y))).size };
        });
        const direct = rect('.contacts-panel--direct');
        const request = rect('.contacts-panel--request');
        const route = rect('.contacts-panel--route-copy');
        const map = rect('.contacts-panel--route-map');
        const steps = rect('.contact-arrival');
        const items = [...document.querySelectorAll('.contact-arrival > li')].map(box);
        const actions = rect('.contacts-route-actions');
        const paddingBottom = parseFloat(getComputedStyle(document.querySelector('.contacts-panel--route-copy')).paddingBottom);
        const header = rect('.contacts-panel--route-copy .contacts-panel__header');
        const directStyle = getComputedStyle(document.querySelector('.contacts-panel--direct'));
        return {
            width: innerWidth, height: innerHeight,
            overflow: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth,
            contacts, direct, request, route, map, items,
            stepsBottomBlank: steps.bottom - Math.max(...items.map((item) => item.bottom)),
            gapBeforeActions: actions.y - steps.bottom,
            gapAfterActions: route.bottom - actions.bottom - paddingBottom,
            gapHeaderSteps: steps.y - header.bottom,
            sameCoreRow: Math.abs(direct.y - request.y) <= 1,
            sameRouteRow: Math.abs(route.y - map.y) <= 1,
            directSurface: { background: directStyle.backgroundColor, paddingLeft: parseFloat(directStyle.paddingLeft) },
            mapLoaded: !document.querySelector('.contacts-panel--route-map iframe').hidden
        };
    });
}

function expectContacts(metrics, label) {
    expect.soft(metrics.overflow, `${label}: page width`).toBeLessThanOrEqual(2);
    if (metrics.width <= 640) {
        expect.soft(metrics.directSurface.paddingLeft, `${label}: mobile directory stays open`).toBe(0);
        expect.soft(metrics.directSurface.background, `${label}: no zero-padding painted panel`).toBe('rgba(0, 0, 0, 0)');
    }
    expect.soft(metrics.contacts, `${label}: additional phone and email exist`).toHaveLength(2);
    for (const [index, contact] of metrics.contacts.entries()) {
        expect.soft(contact.lines, `${label}: contact ${index + 1} must remain a complete readable value`).toBe(1);
    }
    expect.soft(metrics.contacts[1].box.y, `${label}: contact directory rows must stack`)
        .toBeGreaterThanOrEqual(metrics.contacts[0].box.bottom - 1);
    for (let index = 1; index < metrics.items.length; index += 1) {
        expect.soft(metrics.items[index].y, `${label}: arrival directions remain a vertical list`)
            .toBeGreaterThanOrEqual(metrics.items[index - 1].bottom - 1);
    }
    // Below 1024px, the two-card row is intentional only in tall desktop-site mode.
    if (metrics.width >= 1024 || (metrics.width >= 900 && metrics.height >= metrics.width * 1.5)) {
        expect.soft(metrics.sameCoreRow, `${label}: desktop-site contact/form panels keep their shared row`).toBe(true);
        expect.soft(metrics.sameRouteRow, `${label}: desktop-site route panels keep their shared row`).toBe(true);
    }
    if (metrics.sameCoreRow) {
        expect.soft(Math.abs(metrics.direct.bottom - metrics.request.bottom), `${label}: contact/form bottom edges`).toBeLessThanOrEqual(2);
        expect.soft(Math.abs(metrics.direct.height - metrics.request.height), `${label}: equal contact/form height`).toBeLessThanOrEqual(2);
    }
    if (metrics.sameRouteRow) {
        expect.soft(Math.abs(metrics.route.bottom - metrics.map.bottom), `${label}: route/map bottom edges`).toBeLessThanOrEqual(2);
        expect.soft(Math.abs(metrics.route.height - metrics.map.height), `${label}: equal route/map height`).toBeLessThanOrEqual(2);
    }
    for (const key of ['stepsBottomBlank', 'gapHeaderSteps', 'gapBeforeActions', 'gapAfterActions']) {
        expect.soft(metrics[key], `${label}: ${key} must not become an empty stretched region`).toBeLessThanOrEqual(40);
        expect.soft(metrics[key], `${label}: ${key} must not overlap`).toBeGreaterThanOrEqual(-2);
    }
}

test('contact directory stays readable and paired panels stay aligned', async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    test.setTimeout(240_000);
    for (const canvas of contactsCases) {
        await withCanvas(browser, canvas, async (page) => {
            await openLocal(page, '/pages/contacts.html');
            await expect(page.locator('.contact-arrival > li')).toHaveCount(2);
            await expect(page.locator('.contact-directory__messengers a')).toHaveCount(3);
            const label = `${canvas.width}x${canvas.height} ${canvas.hasTouch ? 'touch' : 'mouse'}`;
            const before = await contactMetrics(page);
            if (diagnosticsOnly) console.log('CONTACT_LAYOUT', label, JSON.stringify(before));
            else expectContacts(before, `${label} map ${before.mapLoaded ? 'loaded' : 'placeholder'}`);

            if (canvas.width === 390) {
                await page.locator('.contacts-panel--direct').screenshot({ path: testInfo.outputPath('contacts-directory-mobile.png') });
                await page.locator('.contacts-panel--route-copy').screenshot({ path: testInfo.outputPath('contacts-arrival-mobile.png') });
            }

            // Tall desktop-site canvases and a normal desktop cover loaded map geometry too.
            if (([980, 1307].includes(canvas.width) && canvas.height > 1200) || canvas.width === 1280) {
                const mapTrigger = page.locator('.contacts-map-placeholder [data-embed-trigger]');
                if (await mapTrigger.isVisible()) await mapTrigger.click();
                await expect(page.locator('.contacts-panel--route-map iframe')).toBeVisible();
                const loaded = await contactMetrics(page);
                if (diagnosticsOnly) console.log('CONTACT_LAYOUT_LOADED', label, JSON.stringify(loaded));
                else expectContacts(loaded, `${label} map loaded`);

                await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
                await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
                const coreBox = await page.locator('.contacts-core').boundingBox();
                await page.screenshot({
                    path: testInfo.outputPath(`contacts-header-core-${canvas.width}.png`),
                    clip: { x: 0, y: 0, width: canvas.width, height: Math.ceil(coreBox.y + coreBox.height + 24) }
                });
                await page.locator('.contacts-route').screenshot({ path: testInfo.outputPath(`contacts-route-${canvas.width}.png`) });
            }
        });
    }
});

test('compact inner pages begin just below the actual header across page families', async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    test.setTimeout(150_000);
    for (const width of [899, 900, 980, 1089, 1100, 1101, 1102]) {
        await withCanvas(browser, { width, height: 2300, hasTouch: true }, async (page) => {
            const paths = width === 980 ? innerPaths : ['/pages/powder-coating.html', '/pages/contacts.html', '/pages/automation-ati3000a.html'];
            for (const path of paths) {
                await openLocal(page, path);
                const metrics = await page.evaluate(() => {
                    const header = document.querySelector('.internal-legacy-header .header-top');
                    const scene = document.querySelector('.internal-hero-scene');
                    const section = scene?.nextElementSibling;
                    const content = section?.querySelector(':scope > .container') || section;
                    const headerBox = header.getBoundingClientRect();
                    const contentBox = content.getBoundingClientRect();
                    return {
                        headerVisible: header.checkVisibility(), sceneVisible: scene.checkVisibility(),
                        headerBottom: headerBox.bottom, contentTop: contentBox.top,
                        gap: contentBox.top - headerBox.bottom,
                        heightVariable: getComputedStyle(document.documentElement).getPropertyValue('--header-top-height')
                    };
                });
                const label = `${width}x2300 ${path}`;
                if (diagnosticsOnly) console.log('INNER_START', label, JSON.stringify(metrics));
                else {
                    if (width <= 1100) {
                        expect.soft(metrics.headerVisible, `${label}: compact header must remain visible`).toBe(true);
                        expect.soft(metrics.sceneVisible, `${label}: duplicate desktop scene must remain hidden`).toBe(false);
                    }
                    if (metrics.headerVisible && !metrics.sceneVisible) {
                        expect.soft(metrics.gap, `${label}: first content clears the compact header`).toBeGreaterThanOrEqual(8);
                        expect.soft(metrics.gap, `${label}: no stale fixed-height empty belt`).toBeLessThanOrEqual(40);
                    }
                }
            }
        });
    }
});
