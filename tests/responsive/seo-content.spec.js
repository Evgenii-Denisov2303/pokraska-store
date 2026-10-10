const fs = require('node:fs');
const path = require('node:path');
const { test, expect } = require('@playwright/test');
const { inspectStructuredData } = require('../../scripts/lib/structured-data');
const { checkFaqMarkers } = require('./helpers/faq-contract');

const rootDir = path.resolve(__dirname, '../..');
const siteOrigin = 'https://komfortplus116.ru';
const gatePages = [
    { file: 'pages/gates-sliding.html', filter: 'sliding' },
    { file: 'pages/gates-swing.html', filter: 'swing' }
];
const servicePages = [
    { file: 'pages/sandblasting.html', filter: 'sandblast' },
    { file: 'pages/powder-coating.html', filter: 'powder' }
];
const viewports = [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 980, height: 740 },
    { width: 1280, height: 800 },
    { width: 1400, height: 1200 }
];

function readPage(file) {
    return fs.readFileSync(path.join(rootDir, file), 'utf8');
}

function attr(tag, name) {
    return tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2];
}

function links(html, file) {
    return [...html.matchAll(/<a\b[^>]*>/gi)]
        .map(([tag]) => attr(tag, 'href'))
        .filter(Boolean)
        .map((href) => new URL(href, `${siteOrigin}/${file}`));
}

async function checkFaqSchema(page) {
    const faq = await page.evaluate(() => {
        const normalize = (value) => {
            const element = document.createElement('div');
            element.innerHTML = value || '';
            return element.textContent.replace(/\s+/g, ' ').trim();
        };
        const nodes = [];
        const visit = (value) => {
            if (!value || typeof value !== 'object') return;
            if (Array.isArray(value)) return value.forEach(visit);
            if ([value['@type']].flat().includes('FAQPage')) nodes.push(value);
            Object.values(value).forEach(visit);
        };
        document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => visit(JSON.parse(script.textContent)));
        const markup = nodes.flatMap((node) => node.mainEntity || []).map((question) => ({
            question: normalize(question.name),
            answer: normalize(question.acceptedAnswer?.text)
        }));
        const content = [...document.querySelectorAll('.faq-system details')].map((details) => ({
            question: normalize(details.querySelector('.faq-question')?.innerHTML),
            answer: normalize(details.querySelector('.faq-answer')?.innerHTML)
        }));
        const sort = (items) => items.sort((a, b) => a.question.localeCompare(b.question));
        return { markup: sort(markup), content: sort(content) };
    });
    expect(faq.content.length, 'The page must retain readable FAQ content').toBeGreaterThan(0);
    expect(faq.markup, 'FAQ metadata must describe exactly the questions and answers on the page').toEqual(faq.content);
}

test.describe('SEO content and existing design contract', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-wide', 'Explicit viewport matrix and static checks run once');
    });

    test('gate pages are crawlable static documents without invented commercial claims', async () => {
        const sitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
        const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
        const titles = [];

        for (const { file } of gatePages) {
            const html = readPage(file);
            const url = `${siteOrigin}/${file}`;
            const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
            const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
            const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)]
                .map(([tag]) => tag).find((tag) => attr(tag, 'rel') === 'canonical');
            const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)]
                .map(([tag]) => tag).find((tag) => attr(tag, 'name') === 'description');
            expect(title, `${file}: meaningful static title`).toMatch(/ворота.*Казан/i);
            expect(h1s, `${file}: one static H1`).toHaveLength(1);
            expect(h1s[0][1].replace(/<[^>]+>/g, ''), file).toMatch(/ворота.*Казан/i);
            expect(attr(canonicalTag || '', 'href'), file).toBe(url);
            expect(attr(descriptionTag || '', 'content')?.length, file).toBeGreaterThan(50);
            expect(urls.filter((entry) => entry === url), `${file}: one sitemap entry`).toHaveLength(1);
            expect(html, `${file}: must not prohibit indexing`).not.toMatch(/<meta\b[^>]*content=["'][^"']*noindex/i);

            const { errors, nodes } = inspectStructuredData(html);
            expect(errors, file).toEqual([]);
            expect(nodes.some((node) => node['@type'] === 'WebPage' && node.url === url), `${file}: self-referencing page metadata`).toBe(true);
            expect(nodes.some((node) => ['offers', 'review', 'aggregateRating', 'price'].some((key) => key in node)), `${file}: no unconfirmed price or review data`).toBe(false);
            titles.push(title);
        }
        expect(new Set(titles).size, 'Gate landing pages must not duplicate their titles').toBe(gatePages.length);

        for (const { file } of [...gatePages, ...servicePages]) {
            const html = readPage(file);
            expect(inspectStructuredData(html).errors, file).toEqual([]);
            expect(html, `${file}: no fabricated monetary amounts`).not.toMatch(/\d[\d\s.,]*\s*(?:₽|руб(?:лей|ля|ль|\.)?)(?=\s|<|["']|$)/i);
            expect(html, `${file}: no unsupported five-year warranty`).not.toMatch(/гаранти[яию][^<>\n.!?]{0,70}(?:5|пят[ьи])\s*(?:лет|год)/i);
        }

        for (const source of ['index.html', 'pages/services.html']) {
            const pageLinks = links(readPage(source), source);
            for (const { file } of gatePages) {
                expect(pageLinks.some((link) => link.origin === siteOrigin && link.pathname === `/${file}`), `${source}: crawlable link to ${file}`).toBe(true);
            }
        }
        for (const { file, filter } of [...gatePages, ...servicePages]) {
            expect(links(readPage(file), file).some((link) => link.pathname === '/pages/gallery.html' && link.searchParams.get('filter') === filter), `${file}: relevant gallery link`).toBe(true);
        }
    });

    for (const target of gatePages) {
        test(`${target.filter} gate page preserves layout and interactions`, async ({ page }, testInfo) => {
            test.setTimeout(120_000);
            for (const viewport of viewports) {
                await page.setViewportSize(viewport);
                const response = await page.goto(`/${target.file}?noedit=1`, { waitUntil: 'domcontentloaded' });
                expect(response.status()).toBe(200);
                await expect(page.locator('h1')).toBeVisible();
                await page.evaluate(() => document.fonts.ready);
                const geometry = await page.evaluate(() => {
                    const selectors = ['h1', '.automation-product-card', '.automation-product-info', '.automation-product-cta', '.automation-product-guide', '.faq-system'];
                    return {
                        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
                        boxes: selectors.flatMap((selector) => [...document.querySelectorAll(selector)].map((element) => {
                            const box = element.getBoundingClientRect();
                            return { selector, left: box.left, right: box.right, width: box.width };
                        }))
                    };
                });
                expect(geometry.overflow, `${target.file} at ${viewport.width}px`).toBeLessThanOrEqual(2);
                for (const box of geometry.boxes) {
                    expect(box.left, `${box.selector} left edge at ${viewport.width}px`).toBeGreaterThanOrEqual(-1);
                    expect(box.right, `${box.selector} right edge at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width + 1);
                    expect(box.width, `${box.selector} collapsed at ${viewport.width}px`).toBeGreaterThan(0);
                }
                await expect(page.locator('.preview-footer__bottom > p')).toHaveCount(2);
                await expect(page.locator('.preview-footer__bottom a')).toHaveAttribute('href', /(?:^|\/)politika\.html$/);
                await expect(page.locator('.automation-product-cta a').first()).toBeVisible();
                await checkFaqMarkers(page);
                if (viewport.width === 375 || viewport.width === 1280) {
                    await page.screenshot({ path: testInfo.outputPath(`${target.filter}-${viewport.width}.png`), fullPage: true });
                }
                if (viewport.width === 375) {
                    const menu = page.locator('button[aria-controls="site-mobile-nav"]:visible').first();
                    await menu.click();
                    await expect(menu).toHaveAttribute('aria-expanded', 'true');
                    await expect(page.locator('#site-mobile-nav')).toBeVisible();
                    await menu.click();
                    await expect(menu).toHaveAttribute('aria-expanded', 'false');
                }
            }
            await checkFaqSchema(page);
            const gallery = page.locator('[data-product-gallery]');
            const mainImage = gallery.locator('[data-main-image]');
            const initialSource = await mainImage.getAttribute('src');
            await gallery.locator('[data-gallery-next]').click();
            await expect(mainImage).not.toHaveAttribute('src', initialSource);
            await gallery.locator('[data-gallery-prev]').click();
            await expect(mainImage).toHaveAttribute('src', initialSource);
        });
    }

    test('service calculation content and FAQ metadata stay consistent', async ({ page }) => {
        for (const { file } of servicePages) {
            await page.goto(`/${file}?noedit=1`, { waitUntil: 'domcontentloaded' });
            await expect(page.locator('#calculation')).toBeVisible();
            await checkFaqSchema(page);
        }
        await page.goto('/pages/prices.html?noedit=1', { waitUntil: 'domcontentloaded' });
        await checkFaqSchema(page);
    });

    test('contextual gallery links select only the requested work category', async ({ page }) => {
        test.setTimeout(90_000);
        for (const { file, filter } of [...gatePages, ...servicePages]) {
            await page.goto(`/${file}?noedit=1`, { waitUntil: 'domcontentloaded' });
            await page.locator(`a[href="gallery.html?filter=${filter}"]`).first().click();
            await expect(page).toHaveURL(new RegExp(`gallery\\.html\\?filter=${filter}$`));
            await expect(page.locator(`[data-gallery-filters] .filter-btn[data-filter="${filter}"]`)).toHaveClass(/active/);
            const visibleItems = page.locator('.gallery-grid .gallery-item:not(.gallery-item--skeleton):visible');
            await expect(visibleItems.first()).toBeVisible();
            await expect.poll(() => visibleItems.evaluateAll((items) => [...new Set(items.map((item) => item.dataset.category))])).toEqual([filter]);
        }
    });
});
