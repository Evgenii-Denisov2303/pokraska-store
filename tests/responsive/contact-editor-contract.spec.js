const { test, expect } = require('@playwright/test');
const path = require('node:path');

test('contact editor round-trips the directory without changing embeds or legacy messenger indexes', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    const writes = [];
    // The actual editor/storage is never loaded. Only its registration contract
    // is stubbed, and every non-read network request is blocked as a safeguard.
    await page.route('**/*', (route) => {
        const request = route.request();
        if (!['GET', 'HEAD'].includes(request.method())) {
            writes.push(request.url());
            return route.abort();
        }
        if (new URL(request.url()).hostname !== '127.0.0.1') return route.abort();
        return route.continue();
    });
    await page.goto('/pages/contacts.html?noedit=1', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
        window.contactEditorTestBindings = [];
        window.PokraskaInlineEditor = {
            register(section) {
                window.contactEditorTestBindings.push(...section.bindings);
            }
        };
    });
    await page.addScriptTag({ path: path.resolve(__dirname, '../../assets/js/inline-editor-bootstrap.js') });
    const result = await page.evaluate(() => {
        const find = (suffix) => window.contactEditorTestBindings.find((binding) => binding.path === `pages.contacts.modules.${suffix}`);
        const direct = find('directPanel');
        const route = find('routePanel');
        if (!direct || !route) return { found: false };
        const jsonCopy = (value) => JSON.parse(JSON.stringify(value));
        const defaults = jsonCopy(direct.defaultValue);
        const routeDefaults = jsonCopy(route.defaultValue);
        const frameBefore = document.querySelector('.contacts-form-embed').outerHTML;
        const mapClassBefore = document.querySelector('.contact-directory__map-link').className;
        const originalWhatsApp = document.querySelector('.contact-directory__messengers a:has(.fa-whatsapp)').getAttribute('href');
        const originalCopy = document.querySelector('.contacts-panel--directory .contacts-panel__header p:not(.contacts-panel__kicker)').textContent;
        direct.render(defaults);
        route.render(routeDefaults);
        const defaultsPreserved = document.querySelector('.contacts-panel--directory .contacts-panel__header p:not(.contacts-panel__kicker)').textContent === originalCopy;
        direct.render({ actions: [{ label: 'Telegram test', href: 'https://t.me/test' }, { label: 'MAX test', href: 'https://max.ru/test' }] });
        const legacyActionsPreserved = document.querySelector('.contact-directory__messengers a:has(.fa-whatsapp)').getAttribute('href') === originalWhatsApp;
        defaults.copy = 'Описание для проверки';
        defaults.primary.number = '+7 (000) 000-00-00';
        defaults.primary.href = 'tel:+70000000000';
        defaults.directory.email.value = 'test@example.com';
        defaults.directory.email.href = 'mailto:test@example.com';
        defaults.meta[0].value = 'Тестовые часы';
        defaults.actions[2].label = 'WhatsApp test';
        direct.render(jsonCopy(defaults));
        routeDefaults.steps[1].copy = 'Проверка описания входа';
        routeDefaults.badges[1] = 'Проверка парковки';
        route.render(jsonCopy(routeDefaults));
        return {
            found: true, defaultsPreserved, legacyActionsPreserved,
            actionDefaults: direct.defaultValue.actions.map((action) => action.href),
            copy: document.querySelector('.contacts-panel--directory .contacts-panel__header p:not(.contacts-panel__kicker)').textContent,
            kicker: document.querySelector('.contacts-panel--directory .contacts-panel__kicker').textContent,
            primary: document.querySelector('.contact-directory__primary').getAttribute('href'),
            email: document.querySelector('.contact-directory a[href^="mailto:"]').textContent,
            emailLabel: document.querySelector('.contact-directory a[href^="mailto:"]').getAttribute('aria-label'),
            hours: document.querySelectorAll('.contact-directory dd')[2].textContent,
            whatsapp: document.querySelector('.contact-directory__messengers a:has(.fa-whatsapp)').textContent.trim(),
            entrance: document.querySelector('.contact-arrival li p').textContent,
            parking: document.querySelectorAll('.contact-arrival li strong')[1].textContent,
            mapClassUnchanged: document.querySelector('.contact-directory__map-link').className === mapClassBefore,
            frameUnchanged: document.querySelector('.contacts-form-embed').outerHTML === frameBefore
        };
    });
    expect(result.found).toBe(true);
    expect(result.defaultsPreserved).toBe(true);
    expect(result.legacyActionsPreserved).toBe(true);
    expect(result.actionDefaults[0]).toContain('t.me');
    expect(result.actionDefaults[1]).toContain('max.ru');
    expect(result.actionDefaults[2]).toContain('wa.me');
    expect(result.copy).toBe('Описание для проверки');
    expect(result.kicker).toBe('Связаться напрямую');
    expect(result.primary).toBe('tel:+70000000000');
    expect(result.email).toBe('test@example.com');
    expect(result.emailLabel).toContain('test@example.com');
    expect(result.hours).toBe('Тестовые часы');
    expect(result.whatsapp).toBe('WhatsApp test');
    expect(result.entrance).toBe('Проверка описания входа');
    expect(result.parking).toBe('Проверка парковки');
    expect(result.mapClassUnchanged).toBe(true);
    expect(result.frameUnchanged).toBe(true);
    expect(writes).toEqual([]);
});
