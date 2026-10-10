const fs = require('node:fs');
const path = require('node:path');
const { test, expect } = require('@playwright/test');

const baseURL = `http://127.0.0.1:${process.env.SITE_TEST_PORT || '4173'}`;
const site = JSON.parse(fs.readFileSync(path.join(__dirname, '../../content/site.json'), 'utf8'));
const configuredWhatsApp = new URL(site.contact.whatsapp.href);
const servicePages = [
    { file: 'powder-coating', names: ['Диски', 'Конструкции', 'Крупные изделия', 'Интерьер'] },
    { file: 'sandblasting', names: ['Диски', 'Конструкции', 'Очистка', 'Под покраску'] }
];
const serviceLabels = {
    'powder-coating': 'Порошковая покраска',
    sandblasting: 'Пескоструйная обработка',
    'gates-sliding': 'Откатные ворота',
    'gates-swing': 'Распашные ворота',
    gates: 'Ворота и калитки',
    fences: 'Заборы',
    automation: 'Автоматика',
    garage: 'Гараж и защита'
};
const requestField = 'answer_long_text_71488';

async function withLocalPage(browser, viewport, callback) {
    const context = await browser.newContext({
        baseURL,
        viewport,
        deviceScaleFactor: 1,
        hasTouch: viewport.width <= 768,
        isMobile: viewport.width <= 640
    });
    // These tests check local UI contracts only. Never load a real form,
    // navigate to a messenger or send a request.
    await context.route('**/*', (route) => {
        if (new URL(route.request().url()).origin === baseURL) return route.continue();
        if (route.request().resourceType() === 'document') {
            return route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: '<!doctype html><html><body>Local test embed</body></html>'
            });
        }
        return route.abort();
    });
    try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await callback(page);
        expect(errors, 'Local request flow must not throw browser errors').toEqual([]);
    } finally {
        await context.close();
    }
}

async function settle(page) {
    await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
}

async function openLocal(page, pathname, params = {}, hash = '') {
    const url = new URL(pathname, baseURL);
    url.searchParams.set('noedit', '1');
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    url.hash = hash;
    const response = await page.goto(url.href, { waitUntil: 'domcontentloaded' });
    expect(response.status(), pathname).toBe(200);
    await settle(page);
}

async function expectNoOverflow(page, label) {
    const overflow = await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth);
    expect(overflow, `${label}: no horizontal page overflow`).toBeLessThanOrEqual(2);
}

async function saveViewport(page, testInfo, name) {
    const screenshotPath = testInfo.outputPath(`${name}.png`);
    await page.screenshot({ path: screenshotPath });
    await testInfo.attach(name, { path: screenshotPath, contentType: 'image/png' });
}

function expectRequestURL(href, service) {
    const url = new URL(href, `${baseURL}/pages/`);
    expect(url.pathname).toBe('/pages/contacts.html');
    expect(url.searchParams.get('service')).toBe(service);
    expect(url.hash).toBe('#contact-form');
}

async function expectWhatsAppDraft(page, service) {
    const links = page.locator('a[data-request-whatsapp]');
    expect(await links.count(), 'A direct photo contact must be available by the form').toBeGreaterThan(0);
    for (const link of await links.all()) {
        await expect(link).toHaveAccessibleName(/WhatsApp/i);
        const url = new URL(await link.getAttribute('href'), page.url());
        expect(url.origin).toBe(configuredWhatsApp.origin);
        expect(url.pathname).toBe(configuredWhatsApp.pathname);
        const message = url.searchParams.get('text') || '';
        expect(message, `The WhatsApp draft retains only the chosen topic ${service || '(none)'}`)
            .toBe(service ? `Нужен расчёт: ${serviceLabels[service]}.` : '');
        expect(message, 'Do not add unconfirmed price or timing promises').not.toMatch(/бесплатн|гаранти|\d+\s*(?:руб|₽|дн|час)/i);
    }
}

async function expectFormPrefill(page, service) {
    const frame = page.locator('iframe[data-request-embed]');
    await expect(frame).toHaveCount(1);
    await expect(frame).toHaveAttribute('data-request-field', requestField);
    const draft = service ? `Нужен расчёт: ${serviceLabels[service]}.` : null;
    const checkURL = (href) => {
        const url = new URL(href, page.url());
        expect(url.origin).toBe('https://forms.yandex.ru');
        expect(url.pathname).toBe('/u/696e3c3ee010db8992425918');
        expect(url.searchParams.get('iframe')).toBe('1');
        expect(url.searchParams.get(requestField)).toBe(draft);
        return url;
    };
    const source = checkURL(await frame.getAttribute('data-src'));
    const fallback = page.locator('a[data-request-form-link]');
    await expect(fallback).toHaveCount(1);
    expect(checkURL(await fallback.getAttribute('href')).href).toBe(source.href);
    // The local document stub isolates Yandex while exercising the real loader.
    // Both the prepared URL and the loaded iframe must retain the same topic.
    await frame.scrollIntoViewIfNeeded();
    await expect.poll(() => frame.getAttribute('src')).toBe(source.href);
    checkURL(await frame.getAttribute('src'));
}

test.describe('Focused service readability and request handoff', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-wide', 'Explicit touch and desktop matrix runs once');
    });

    test('process explanations and advantages remain readable on mobile and neighboring widths', async ({ browser }) => {
        test.setTimeout(120_000);
        for (const width of [320, 375, 640, 641, 768, 960, 961]) {
            await withLocalPage(browser, { width, height: width <= 640 ? 812 : 1024 }, async (page) => {
                for (const { file } of servicePages) {
                    await openLocal(page, `/pages/${file}.html`);
                    const metrics = await page.locator('.process-step p, .process-step h4, .advantage-item span').evaluateAll((elements) => elements
                        .filter((element) => element.checkVisibility())
                        .map((element) => ({
                            text: element.textContent.trim(),
                            fontSize: parseFloat(getComputedStyle(element).fontSize),
                            clipped: element.scrollWidth > element.clientWidth + 2 && getComputedStyle(element).overflowX !== 'visible'
                        })));
                    expect(metrics.length, `${file} ${width}: inspect actual service text`).toBeGreaterThanOrEqual(8);
                    for (const item of metrics) {
                        expect(item.fontSize, `${file} ${width}: ${item.text}`).toBeGreaterThanOrEqual(13);
                        expect(item.clipped, `${file} ${width}: ${item.text}`).toBe(false);
                    }
                    await expectNoOverflow(page, `${file} ${width}`);
                }
            });
        }
    });

    test('catalog and services offer an early calculation action before the long content', async ({ browser }, testInfo) => {
        test.setTimeout(120_000);
        const entries = [
            { file: 'services', selector: '.catalog-top-actions > [data-catalog-estimate-link]', content: '.catalog-layout', service: 'gates-sliding' },
            ...servicePages.map(({ file }) => ({ file, selector: '.services-header__actions > .ui-primary', content: '.service-detail-card', service: file }))
        ];
        for (const viewport of [
            { width: 320, height: 740 }, { width: 375, height: 812 },
            { width: 640, height: 900 }, { width: 641, height: 900 },
            { width: 768, height: 1024 }, { width: 1280, height: 800 }
        ]) {
            await withLocalPage(browser, viewport, async (page) => {
                for (const entry of entries) {
                    await openLocal(page, `/pages/${entry.file}.html`);
                    const action = page.locator(entry.selector);
                    await expect(action).toBeVisible();
                    await expect(action).toHaveAccessibleName(/расч[её]т|рассчитать/i);
                    expectRequestURL(await action.getAttribute('href'), entry.service);
                    const box = await action.boundingBox();
                    const contentBox = await page.locator(entry.content).first().boundingBox();
                    const label = `${entry.file} ${viewport.width}`;
                    expect(box.height, `${label}: touch target`).toBeGreaterThanOrEqual(44);
                    expect(box.y, `${label}: early action starts on screen`).toBeGreaterThanOrEqual(0);
                    expect(box.y + box.height, `${label}: early action visible without scrolling`).toBeLessThanOrEqual(viewport.height);
                    expect(box.y + box.height, `${label}: action precedes detailed content`).toBeLessThanOrEqual(contentBox.y + 1);
                    expect(await action.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)), `${label}: readable CTA`).toBeGreaterThanOrEqual(13);
                    await expectNoOverflow(page, label);
                    if ([375, 1280].includes(viewport.width)) await saveViewport(page, testInfo, `${entry.file}-${viewport.width}-early-action`);
                }
            });
        }
    });

    test('service navigation retains descriptive accessible names when mobile labels are hidden', async ({ browser }) => {
        for (const width of [375, 1280]) {
            await withLocalPage(browser, { width, height: 900 }, async (page) => {
                for (const { file, names } of servicePages) {
                    await openLocal(page, `/pages/${file}.html`);
                    const links = page.locator('.service-nav-link');
                    await expect(links).toHaveCount(names.length);
                    for (let index = 0; index < names.length; index += 1) {
                        await expect(links.nth(index)).toHaveAccessibleName(names[index]);
                        const hash = await links.nth(index).getAttribute('href');
                        expect(hash).toMatch(/^#[a-z-]+$/);
                        await expect(page.locator(hash)).toHaveCount(1);
                    }
                }
            });
        }
    });

    test('catalog request links retain the selected category rather than the initial gate type', async ({ browser }) => {
        test.setTimeout(90_000);
        const selections = [
            { group: 'gates', panel: 'sliding', service: 'gates-sliding' },
            { group: 'gates', panel: 'sliding-frame', service: 'gates-sliding' },
            { group: 'gates', panel: 'swing', service: 'gates-swing' },
            { group: 'gates', panel: 'swing-frame', service: 'gates-swing' },
            { group: 'gates', panel: 'wicket', service: 'gates' },
            { group: 'fences', panel: 'fence-profnastil', service: 'fences' },
            { group: 'garage', panel: 'sectional', service: 'garage' },
            { group: 'automation', panel: 'automation-swing', service: 'automation' }
        ];
        for (const width of [375, 1280]) {
            await withLocalPage(browser, { width, height: 900 }, async (page) => {
                await openLocal(page, '/pages/services.html');
                for (const selection of selections) {
                    await page.locator(`[data-catalog-group="${selection.group}"]`).click();
                    await page.locator(`[data-catalog-tab="catalog-panel-${selection.panel}"]`).click();
                    await expect(page.locator(`#catalog-panel-${selection.panel}`)).toBeVisible();
                    const links = page.locator('[data-catalog-estimate-link]');
                    expect(await links.count()).toBeGreaterThanOrEqual(2);
                    for (const link of await links.all()) {
                        await expect(link).toHaveAttribute('href', `contacts.html?service=${selection.service}#contact-form`);
                    }
                }
            });
        }
    });

    test('real local CTA clicks carry service context into the form and WhatsApp draft', async ({ browser }, testInfo) => {
        test.setTimeout(90_000);
        const entries = [
            ...servicePages.map(({ file }) => ({ file, service: file, selector: '.services-header__actions > .ui-primary' })),
            ...['sliding', 'swing'].map((type) => ({ file: `gates-${type}`, service: `gates-${type}`, selector: '.gate-detail__hero .gate-detail__actions .ui-primary' }))
        ];
        await withLocalPage(browser, { width: 375, height: 812 }, async (page) => {
            for (const entry of entries) {
                await openLocal(page, `/pages/${entry.file}.html`);
                await page.locator(entry.selector).click();
                await expect(page).toHaveURL(new RegExp(`/pages/contacts\\.html\\?service=${entry.service}#contact-form$`));
                await expect(page.locator('[data-request-context]')).toBeVisible();
                await expect(page.locator('[data-request-service]')).toHaveText(serviceLabels[entry.service]);
                await expectWhatsAppDraft(page, entry.service);
                await expectFormPrefill(page, entry.service);
                await expectNoOverflow(page, `contacts ${entry.service}`);
            }
            await saveViewport(page, testInfo, 'contacts-375-service-context');
        });
    });

    test('all allowed request topics are readable and prefilled in the form and prepared message', async ({ browser }) => {
        test.setTimeout(90_000);
        await withLocalPage(browser, { width: 375, height: 812 }, async (page) => {
            for (const [service, label] of Object.entries(serviceLabels)) {
                await openLocal(page, '/pages/contacts.html', { service }, 'contact-form');
                const context = page.locator('[data-request-context]');
                await expect(context).toBeVisible();
                await expect(context.locator('[data-request-service]')).toHaveText(label);
                await expectWhatsAppDraft(page, service);
                await expectFormPrefill(page, service);
                await expectNoOverflow(page, `request topic ${service}`);
            }
        });
    });

    test('missing or unknown topics do not leak stale context into a generic request', async ({ browser }) => {
        await withLocalPage(browser, { width: 375, height: 812 }, async (page) => {
            await openLocal(page, '/pages/contacts.html', { service: 'powder-coating' }, 'contact-form');
            await expect(page.locator('[data-request-context]')).toBeVisible();
            for (const params of [{}, { service: 'unknown-service' }, { service: '<unexpected-topic>' }]) {
                await openLocal(page, '/pages/contacts.html', params, 'contact-form');
                await expect(page.locator('[data-request-context]')).toBeHidden();
                await expectWhatsAppDraft(page);
                await expectFormPrefill(page);
                for (const link of await page.locator('a[data-request-whatsapp]').all()) {
                    const message = new URL(await link.getAttribute('href'), page.url()).searchParams.get('text') || '';
                    expect(message).not.toMatch(/порошков|unknown-service|unexpected-topic/i);
                }
            }
        });
    });
});
