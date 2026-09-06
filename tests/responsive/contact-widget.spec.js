const { test, expect } = require('@playwright/test');

const selectors = {
    root: '.contact-widget',
    toggle: '.contact-widget__toggle',
    links: '.contact-widget__links',
    link: '.contact-widget__link[data-messenger]'
};

const viewports = [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 412, height: 915 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
    { width: 1280, height: 800 },
    { width: 1400, height: 1200 }
];

// Test-only destinations: these must never be copied into business configuration.
const testContact = {
    telegram: { label: 'Telegram', href: 'https://t.me/+79625542260' },
    max: { label: 'MAX', href: 'https://max.ru/u/test-profile' },
    whatsapp: { label: 'WhatsApp', href: 'https://wa.me/79625542260' }
};

async function openPage(page, path = '/index.html', { expectAvailable = true } = {}) {
    await page.goto(`${path}?noedit=1`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
    await expect(page.locator(selectors.root)).toHaveCount(1);
    if (expectAvailable) await expect(page.locator(selectors.toggle)).toBeVisible();
    await expect(page.locator(selectors.toggle)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(selectors.links)).toBeHidden();
}

async function expectClosed(page) {
    await expect(page.locator(selectors.toggle)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(selectors.links)).toBeHidden();
}

async function expectOpen(page) {
    await expect(page.locator(selectors.toggle)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(selectors.links)).toBeVisible();
}

async function expectSuppressed(page, suppressed) {
    await expect.poll(() => page.locator(selectors.root).evaluate((root) => {
        const style = getComputedStyle(root);
        return {
            hidden: root.hidden || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0,
            inert: root.inert
        };
    })).toEqual({ hidden: suppressed, inert: suppressed });
}

async function addOutsideButton(page) {
    await page.evaluate(() => {
        const outside = document.createElement('button');
        outside.type = 'button';
        outside.dataset.contactTestOutside = '';
        outside.textContent = 'Test outside target';
        outside.style.cssText = 'position:fixed;left:4px;top:4px;z-index:2147483647';
        document.body.append(outside);
    });
    return page.locator('[data-contact-test-outside]');
}

test('contact widget only exposes configured Telegram on public page shells', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');

    for (const path of ['/index.html', '/pages/contacts.html', '/politika.html']) {
        // The contacts form may already intersect a tall initial viewport.
        await openPage(page, path, { expectAvailable: path !== '/pages/contacts.html' });
        await expect(page.locator('body > .contact-widget')).toHaveCount(1);
        await expect(page.locator(selectors.link)).toHaveCount(1);
        const telegram = page.locator(`${selectors.link}[data-messenger="telegram"]`);
        await expect(telegram).toHaveAttribute('href', testContact.telegram.href);
        await expect(telegram).toHaveAttribute('target', '_blank');
        await expect(telegram).toHaveAttribute('rel', /\bnoopener\b/);
        await expect(telegram).toHaveAttribute('rel', /\bnoreferrer\b/);
        // A correctly hidden link is excluded from the accessibility tree until opened.
        await expect(telegram).toHaveAttribute('aria-label', /Telegram/i);
        await expect(page.locator(`${selectors.link}[data-messenger="max"]`)).toHaveCount(0);
        await expect(page.locator(`${selectors.link}[data-messenger="whatsapp"]`)).toHaveCount(0);
    }
});

test('three configured messenger circles remain compact and inside exact viewports', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    test.setTimeout(120_000);
    await page.route('**/content/site.json*', async (route) => {
        const response = await route.fetch();
        const site = await response.json();
        await route.fulfill({ response, json: { ...site, contact: { ...site.contact, ...testContact } } });
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        for (const path of ['/index.html', '/pages/services.html']) {
            const label = `${path} ${viewport.width}x${viewport.height}`;
            await openPage(page, path);
            await expect(page.locator(selectors.link), label).toHaveCount(3);
            await page.locator(selectors.toggle).click();
            await expectOpen(page);
            for (const [messenger, contact] of Object.entries(testContact)) {
                const link = page.locator(`${selectors.link}[data-messenger="${messenger}"]`);
                await expect(link, label).toBeVisible();
                await expect(link).toHaveAttribute('href', contact.href);
                await expect(link).toHaveAttribute('target', '_blank');
                await expect(link).toHaveAttribute('rel', /\bnoopener\b/);
                await expect(link).toHaveAttribute('rel', /\bnoreferrer\b/);
                await expect(link).toHaveAccessibleName(new RegExp(messenger, 'i'));
            }

            const metrics = await page.locator(selectors.root).evaluate((root) => {
                const toggle = root.querySelector('.contact-widget__toggle');
                const links = root.querySelector('.contact-widget__links');
                const controls = [toggle, ...root.querySelectorAll('.contact-widget__link')];
                return {
                    directBodyChild: root.parentElement === document.body,
                    position: getComputedStyle(root).position,
                    toggleBeforeLinks: Boolean(toggle.compareDocumentPosition(links) & Node.DOCUMENT_POSITION_FOLLOWING),
                    linksAboveToggle: links.getBoundingClientRect().bottom <= toggle.getBoundingClientRect().top + 1,
                    horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
                    viewport: { width: innerWidth, height: innerHeight },
                    controls: controls.map((control) => {
                        const box = control.getBoundingClientRect();
                        const style = getComputedStyle(control);
                        return {
                            width: box.width,
                            height: box.height,
                            top: box.top,
                            bottom: box.bottom,
                            left: box.left,
                            right: box.right,
                            radius: style.borderTopLeftRadius,
                            visibleText: control.innerText.trim()
                        };
                    })
                };
            });

            expect(metrics.directBodyChild, label).toBe(true);
            expect(metrics.position, label).toBe('fixed');
            expect(metrics.toggleBeforeLinks, `${label}: keyboard order`).toBe(true);
            expect(metrics.linksAboveToggle, `${label}: links should open upwards`).toBe(true);
            expect(metrics.horizontalOverflow, label).toBeLessThanOrEqual(2);
            for (const control of metrics.controls) {
                expect(Math.abs(control.width - control.height), `${label}: circular geometry`).toBeLessThanOrEqual(1);
                expect(control.width, `${label}: touch target`).toBeGreaterThanOrEqual(44);
                expect(control.width, `${label}: compact target`).toBeLessThanOrEqual(64);
                const radius = Number.parseFloat(control.radius);
                expect(radius, `${label}: round corners`).toBeGreaterThanOrEqual(control.radius.includes('%') ? 50 : control.width / 2 - 1);
                expect(control.visibleText, `${label}: icon-only controls`).toBe('');
                expect(control.top, label).toBeGreaterThanOrEqual(0);
                expect(control.left, label).toBeGreaterThanOrEqual(0);
                expect(control.right, label).toBeLessThanOrEqual(metrics.viewport.width + 1);
                expect(control.bottom, label).toBeLessThanOrEqual(metrics.viewport.height + 1);
            }
        }
    }
});

test('contact widget closes by its button, outside click and Escape', async ({ page }) => {
    await openPage(page);
    const toggle = page.locator(selectors.toggle);
    const outside = await addOutsideButton(page);

    await toggle.click();
    await expectOpen(page);
    await toggle.click();
    await expectClosed(page);

    await toggle.click();
    await expectOpen(page);
    await outside.click();
    await expectClosed(page);

    await toggle.click();
    await expectOpen(page);
    await page.keyboard.press('Escape');
    await expectClosed(page);
    await expect(toggle).toBeFocused();
});

test('contact widget keeps closed links out of keyboard navigation', async ({ page }) => {
    await openPage(page);
    const toggle = page.locator(selectors.toggle);
    const telegram = page.locator(`${selectors.link}[data-messenger="telegram"]`);
    const outside = await addOutsideButton(page);

    await toggle.focus();
    await page.keyboard.press('Tab');
    await expect(outside).toBeFocused();
    await expect(telegram).not.toBeFocused();

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expectOpen(page);
    await page.keyboard.press('Tab');
    await expect(telegram).toBeFocused();
    await page.keyboard.press('Escape');
    await expectClosed(page);
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Space');
    await expectOpen(page);
    await page.keyboard.press('Space');
    await expectClosed(page);
});

test('contact widget yields to the site menu and image modal', async ({ page }) => {
    await openPage(page, '/pages/gallery.html');
    const toggle = page.locator(selectors.toggle);

    for (const bodyClass of ['menu-open', 'modal-open']) {
        await toggle.click();
        await expectOpen(page);
        await page.evaluate((className) => document.body.classList.add(className), bodyClass);
        await expectSuppressed(page, true);
        await expectClosed(page);
        await page.evaluate((className) => document.body.classList.remove(className), bodyClass);
        await expectSuppressed(page, false);
        await expect(toggle).toBeVisible();
        await expectClosed(page);
    }
});

test('contact widget yields while text fields and an embedded form have focus', async ({ page }) => {
    // Isolate keyboard-focus behavior from the separately tested visible Yandex form.
    await openPage(page, '/pages/services.html');
    const outside = await addOutsideButton(page);
    await page.evaluate(() => {
        const fields = document.createElement('div');
        fields.dataset.contactTestFields = '';
        fields.style.cssText = 'position:fixed;left:4px;top:50px;z-index:2147483647;width:180px';
        fields.innerHTML = '<input aria-label="Test input"><textarea aria-label="Test textarea"></textarea><iframe title="Test embedded form" srcdoc="<input aria-label=embedded>"></iframe>';
        document.body.append(fields);
    });
    const fields = page.locator('[data-contact-test-fields]');
    for (const tag of ['input', 'textarea']) {
        await page.locator(selectors.toggle).click();
        await expectOpen(page);
        await fields.locator(tag).focus();
        await expectSuppressed(page, true);
        await expectClosed(page);
        await outside.focus();
        await expectSuppressed(page, false);
    }

    await page.locator(selectors.toggle).click();
    await expectOpen(page);
    await page.frameLocator('iframe[title="Test embedded form"]').locator('input').focus();
    await expectSuppressed(page, true);
    await expectClosed(page);
    await outside.focus();
    await expectSuppressed(page, false);
});

test('contact widget yields to the visible contacts form and returns away from it', async ({ page }) => {
    // Keep this visibility test independent of the remote form server and its scripts.
    await page.route('https://forms.yandex.ru/**', (route) => route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html><body>Test form content</body></html>'
    }));
    await openPage(page, '/pages/contacts.html', { expectAvailable: false });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    // At the top, desktop/tablet can already show part of the form, unlike narrow phones.
    await expect.poll(() => page.evaluate(() => {
        const frame = document.querySelector('.contacts-form-embed');
        const root = document.querySelector('.contact-widget');
        const box = frame.getBoundingClientRect();
        const intersects = box.width > 0 && box.height > 0
            && box.bottom >= 0 && box.top <= innerHeight && box.right >= 0 && box.left <= innerWidth;
        return root.hidden === intersects && root.inert === intersects;
    })).toBe(true);

    await page.locator('.contacts-form-frame').scrollIntoViewIfNeeded();
    const frame = page.locator('.contacts-form-embed');
    await expect(frame).toBeVisible();
    await frame.scrollIntoViewIfNeeded();
    await expectSuppressed(page, true);
    await expectClosed(page);

    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expect.poll(() => frame.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return box.bottom < 0 || box.top > innerHeight;
    })).toBe(true);
    await expectSuppressed(page, false);
    await expect(page.locator(selectors.toggle)).toBeVisible();
    await expectClosed(page);
});
