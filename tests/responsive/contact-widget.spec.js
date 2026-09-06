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

async function expectDisabledPlaceholders(page, { visible = false } = {}) {
    for (const [messenger, name] of [['max', 'MAX'], ['whatsapp', 'WhatsApp']]) {
        const placeholder = page.locator(`${selectors.link}[data-messenger="${messenger}"]`);
        await expect(placeholder).toHaveCount(1);
        await expect(placeholder).toHaveAttribute('type', 'button');
        await expect(placeholder).toHaveAttribute('aria-disabled', 'true');
        await expect(placeholder).toHaveAttribute('aria-label', `${name} — скоро будет доступен`);
        await expect(placeholder).toHaveAttribute('title', /.+/);
        await expect(placeholder).toBeDisabled();
        expect(await placeholder.getAttribute('href')).toBeNull();
        expect(await placeholder.evaluate((element) => element instanceof HTMLButtonElement && element.disabled)).toBe(true);

        if (visible) {
            await expect(placeholder).toBeVisible();
            const metrics = await placeholder.evaluate((element) => {
                const box = element.getBoundingClientRect();
                return { width: box.width, height: box.height, radius: getComputedStyle(element).borderTopLeftRadius, text: element.innerText.trim() };
            });
            expect(Math.abs(metrics.width - metrics.height), `${name}: disabled circle geometry`).toBeLessThanOrEqual(1);
            expect(metrics.width, `${name}: visible touch target`).toBeGreaterThanOrEqual(44);
            expect(metrics.width, `${name}: compact target`).toBeLessThanOrEqual(64);
            expect(Number.parseFloat(metrics.radius)).toBeGreaterThanOrEqual(metrics.radius.includes('%') ? 50 : metrics.width / 2 - 1);
            expect(metrics.text, `${name}: icon-only placeholder`).toBe('');
        }
    }
}

test('contact widget keeps three controls with only Telegram enabled on public page shells', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');

    for (const path of ['/index.html', '/pages/contacts.html', '/politika.html']) {
        await openPage(page, path);
        await expect(page.locator('body > .contact-widget')).toHaveCount(1);
        await expect(page.locator(selectors.link)).toHaveCount(3);
        const telegram = page.locator(`${selectors.link}[data-messenger="telegram"]`);
        expect(await telegram.evaluate((element) => element instanceof HTMLAnchorElement)).toBe(true);
        await expect(telegram).toBeEnabled();
        await expect(telegram).toHaveAttribute('href', testContact.telegram.href);
        await expect(telegram).toHaveAttribute('target', '_blank');
        await expect(telegram).toHaveAttribute('rel', /\bnoopener\b/);
        await expect(telegram).toHaveAttribute('rel', /\bnoreferrer\b/);
        // A correctly hidden link is excluded from the accessibility tree until opened.
        await expect(telegram).toHaveAttribute('aria-label', /Telegram/i);
        await expectDisabledPlaceholders(page);
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
                await expect(link).toBeEnabled();
                expect(await link.evaluate((element) => element instanceof HTMLAnchorElement)).toBe(true);
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

test('contact widget skips disabled placeholders and closed links during keyboard navigation', async ({ page }) => {
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
    await expect(page.locator(selectors.link)).toHaveCount(3);
    await expectDisabledPlaceholders(page, { visible: true });

    // Native disabled buttons must be inert even for HTMLElement.click(); never force-click them.
    const originalURL = page.url();
    const originalPageCount = page.context().pages().length;
    for (const messenger of ['max', 'whatsapp']) {
        const clickEvents = await page.locator(`${selectors.link}[data-messenger="${messenger}"]`).evaluate((button) => {
            let events = 0;
            const countClick = () => { events += 1; };
            button.addEventListener('click', countClick);
            button.click();
            button.removeEventListener('click', countClick);
            return events;
        });
        expect(clickEvents, `${messenger}: disabled DOM click must not dispatch an action`).toBe(0);
        expect(page.url()).toBe(originalURL);
        expect(page.context().pages()).toHaveLength(originalPageCount);
    }

    await page.keyboard.press('Tab');
    // MAX precedes Telegram in the DOM but is disabled; WhatsApp follows and is also skipped.
    await expect(telegram).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(outside).toBeFocused();
    await expectClosed(page);

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

test('contact widget stays visible while scrolling past forms and yields only to form interaction', async ({ page }) => {
    // Use a deterministic cross-origin form without submitting anything to Yandex.
    await page.route('https://forms.yandex.ru/**', (route) => {
        if (route.request().resourceType() !== 'document') return route.continue();
        return route.fulfill({
            contentType: 'text/html',
            body: '<!doctype html><html><body><input aria-label="Test form field"></body></html>'
        });
    });
    for (const path of ['/index.html', '/pages/contacts.html']) {
        await openPage(page, path);
        await page.locator(selectors.toggle).click();
        const formContainer = path === '/index.html' ? '#request-form' : '.contacts-form-frame';
        await page.locator(formContainer).scrollIntoViewIfNeeded();
        const frameSelector = 'iframe[src*="forms.yandex.ru"], iframe[data-src*="forms.yandex.ru"]';
        const frame = page.locator(frameSelector);
        await expect(frame).toBeVisible();
        await frame.scrollIntoViewIfNeeded();
        await expectSuppressed(page, false);
        await expectOpen(page);

        await page.frameLocator(frameSelector).getByRole('textbox', { name: 'Test form field' }).focus();
        await expectSuppressed(page, true);
        await expectClosed(page);

        // A focused iframe must not keep hiding the widget once it is scrolled offscreen.
        await page.evaluate((homePage) => window.scrollTo({
            top: homePage ? 0 : document.documentElement.scrollHeight, behavior: 'instant'
        }), path === '/index.html');
        await expect.poll(() => frame.evaluate((element) => {
            const box = element.getBoundingClientRect();
            return box.bottom < 0 || box.top > innerHeight;
        })).toBe(true);
        await expectSuppressed(page, false);
        await expect(page.locator(selectors.toggle)).toBeVisible();
        await expectClosed(page);
    }
});
