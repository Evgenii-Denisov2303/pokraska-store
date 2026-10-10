const { test, expect } = require('@playwright/test');

test('hero editor preserves the responsive title break through repeated renders', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-wide');
    await page.goto('/?noedit=1', { waitUntil: 'domcontentloaded' });

    // Capture the real binding without starting the editor UI, restoring drafts,
    // or writing to the site's content API.
    await page.evaluate(() => {
        window.POKRASKA_INLINE_EDITOR_ENABLED = true;
        window.PokraskaInlineEditor = {
            register(section) {
                const hero = section.bindings.find((binding) => binding.path === 'pages.home.modules.heroCopy');
                if (hero && !window.heroTitleTestBinding) window.heroTitleTestBinding = hero;
            }
        };
    });
    await page.addScriptTag({ url: '/assets/js/inline-editor-bootstrap.js' });
    await expect.poll(() => page.evaluate(() => Boolean(window.heroTitleTestBinding))).toBe(true);

    const title = page.locator('.hero-copy__title-main--offset');
    const defaults = await page.evaluate(() => window.heroTitleTestBinding.defaultValue.titleLines);
    expect(defaults).toEqual(['Автоматические', 'ворота в', 'Казани']);

    for (let render = 0; render < 3; render += 1) {
        await page.evaluate(() => {
            const binding = window.heroTitleTestBinding;
            binding.render(structuredClone(binding.defaultValue));
        });
        await expect(title.locator('.hero-copy__desktop-break')).toHaveCount(1);
        await expect(title.locator('.hero-copy__title-separator')).toHaveCount(1);
        expect(await title.textContent()).toBe('ворота\u00a0в');
    }

    const editedTitle = '  распашные   ворота  в  ';
    await page.evaluate((value) => {
        const binding = window.heroTitleTestBinding;
        const next = structuredClone(binding.defaultValue);
        next.titleLines[1] = value;
        binding.render(next);
    }, editedTitle);
    expect(await title.textContent()).toBe('распашные ворота\u00a0в');
    await expect(title.locator('br')).toHaveCount(1);
    expect(await title.evaluate((node) => getComputedStyle(node.querySelector('br')).display)).not.toBe('none');

    await page.setViewportSize({ width: 375, height: 812 });
    expect(await title.evaluate((node) => getComputedStyle(node.querySelector('br')).display)).toBe('none');
    expect(await title.textContent()).toBe('распашные ворота\u00a0в');

    // Unsplit or markup-like user input stays literal text, never executable HTML.
    for (const value of ['', 'Ворота', '<img> в']) {
        await page.evaluate((text) => {
            const binding = window.heroTitleTestBinding;
            const next = structuredClone(binding.defaultValue);
            next.titleLines[1] = text;
            binding.render(next);
        }, value);
        expect((await title.textContent()).replace(/\s+/g, ' ')).toBe(value);
        await expect(title.locator('img')).toHaveCount(0);
        await expect(title.locator('br')).toHaveCount(value.includes(' ') ? 1 : 0);
    }
});
