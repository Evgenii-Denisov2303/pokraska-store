const { test, expect } = require('@playwright/test');

const pages = [
    { name: 'home', path: '/' },
    { name: 'services', path: '/pages/services.html' },
    { name: 'powder-coating', path: '/pages/powder-coating.html' },
    { name: 'sandblasting', path: '/pages/sandblasting.html' },
    { name: 'gallery', path: '/pages/gallery.html' },
    { name: 'contacts', path: '/pages/contacts.html' },
    { name: 'automation-ati3000a', path: '/pages/automation-ati3000a.html' },
    { name: 'automation-alutech-am5000kit', path: '/pages/automation-alutech-am5000kit.html' },
    { name: 'automation-alutech-lm-l', path: '/pages/automation-alutech-lm-l.html' },
    { name: 'automation-alutech-sl-u', path: '/pages/automation-alutech-sl-u.html' },
    { name: 'automation-sliding-components', path: '/pages/automation-sliding-components.html' }
];

function slugifyProjectName(name) {
    return String(name || 'project')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function collectLayoutMetrics(page) {
    return page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;

        const horizontalOverflow = Math.max(
            0,
            Math.max(html.scrollWidth, body ? body.scrollWidth : 0) - window.innerWidth
        );

        const fixedSelectors = [
            '.hero-copy h1',
            '.hero-copy__actions',
            '.hero-copy__features',
            '.hero-scene__nav',
            '.panel-scene__items',
            '.internal-hero-copy h1',
            '.internal-hero-copy__lead'
        ];

        const overflowingSelectors = fixedSelectors.reduce((accumulator, selector) => {
            const element = document.querySelector(selector);
            if (!element) return accumulator;

            const style = window.getComputedStyle(element);
            const horizontalDiff = element.scrollWidth - element.clientWidth;
            const verticalDiff = element.scrollHeight - element.clientHeight;

            if (
                horizontalDiff > 2
                && style.overflowX !== 'visible'
                && style.whiteSpace !== 'normal'
            ) {
                accumulator.push({
                    selector,
                    axis: 'x',
                    diff: horizontalDiff
                });
            }

            if (
                verticalDiff > 6
                && style.overflowY !== 'visible'
                && element.clientHeight > 0
            ) {
                accumulator.push({
                    selector,
                    axis: 'y',
                    diff: verticalDiff
                });
            }

            return accumulator;
        }, []);

        const heroStage = document.querySelector('.hero-stage');
        const heroPicture = document.querySelector('.hero-stage__picture');

        let heroBottomGap = null;
        if (heroStage && heroPicture) {
            const stageRect = heroStage.getBoundingClientRect();
            const pictureRect = heroPicture.getBoundingClientRect();
            heroBottomGap = Math.round(stageRect.bottom - pictureRect.bottom);
        }

        const panelCards = [...document.querySelectorAll('.panel-scene__card')].map((card) => {
            const media = card.querySelector('.panel-scene__media');
            const content = card.querySelector('.panel-scene__content');
            const copy = card.querySelector('.panel-scene__copy-block');

            return {
                cardWidth: card.getBoundingClientRect().width,
                mediaWidth: media ? media.getBoundingClientRect().width : 0,
                contentWidth: content ? content.getBoundingClientRect().width : 0,
                copyWidth: copy ? copy.getBoundingClientRect().width : 0
            };
        });

        return {
            horizontalOverflow,
            overflowingSelectors,
            heroBottomGap,
            panelCards,
            viewportWidth: window.innerWidth
        };
    });
}

test.describe('Responsive layout smoke', () => {
    for (const targetPage of pages) {
        test(`${targetPage.name} stays stable across key breakpoints`, async ({ page }, testInfo) => {
            await page.goto(targetPage.path, { waitUntil: 'networkidle' });

            await expect(page.locator('body')).toBeVisible();
            await page.screenshot({
                path: testInfo.outputPath(`${slugifyProjectName(testInfo.project.name)}-${targetPage.name}.png`),
                fullPage: true
            });

            const metrics = await collectLayoutMetrics(page);

            expect(metrics.horizontalOverflow, `Horizontal overflow detected on ${targetPage.name}`).toBeLessThanOrEqual(2);
            expect(metrics.overflowingSelectors, `Hidden overflow detected on ${targetPage.name}`).toEqual([]);

            if (targetPage.name === 'home' && metrics.heroBottomGap != null) {
                expect(Math.abs(metrics.heroBottomGap), 'Hero picture no longer aligns with hero stage bottom').toBeLessThanOrEqual(4);
            }

            if (targetPage.name === 'home' && metrics.viewportWidth <= 1101) {
                expect(metrics.panelCards, 'Both homepage preview cards must be present').toHaveLength(2);

                for (const panelCard of metrics.panelCards) {
                    expect(
                        Math.abs(panelCard.cardWidth - panelCard.mediaWidth),
                        'Homepage preview media must fill its card in the single-column layout'
                    ).toBeLessThanOrEqual(2);
                    expect(
                        panelCard.copyWidth,
                        'Homepage preview copy must stay inside the readable content column'
                    ).toBeLessThanOrEqual(panelCard.contentWidth + 2);
                }
            }
        });
    }
});
