const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { inspectStructuredData } = require('../../scripts/lib/structured-data');

const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`;

test('accepts ordinary page metadata without commercial claims', () => {
    const result = inspectStructuredData(jsonLd({ '@type': 'WebPage', name: 'Описание привода' }));
    assert.deepEqual(result.errors, []);
    assert.equal(result.nodes[0]['@type'], 'WebPage');
});

test('rejects the original incomplete Product markup', () => {
    for (const offers of [undefined, null, {}, [], '', { '@type': 'Offer' }]) {
        const result = inspectStructuredData(jsonLd({ '@type': 'Product', name: 'RTO-500', offers }));
        assert.equal(result.errors.length, 1);
        assert.match(result.errors[0], /offers, review or aggregateRating/);
    }
});

test('checks nested graphs, arrays, and multiple JSON-LD scripts', () => {
    const html = jsonLd({ '@graph': [{ '@type': 'BreadcrumbList' }, { '@type': ['Thing', 'Product'] }] })
        + jsonLd([{ '@type': 'WebPage' }, { '@type': 'https://schema.org/Product' }]);
    assert.equal(inspectStructuredData(html).errors.length, 2);
});

test('permits a Product with populated snippet data without claiming full validation', () => {
    for (const [key, value] of Object.entries({
        offers: { '@type': 'Offer', price: '100', priceCurrency: 'RUB' },
        review: [{ '@type': 'Review', reviewBody: 'Example test review' }],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: 4, reviewCount: 2 }
    })) {
        assert.deepEqual(inspectStructuredData(jsonLd({ '@type': 'Product', [key]: value })).errors, []);
    }
});

test('reports malformed JSON-LD but ignores ordinary JavaScript', () => {
    assert.equal(inspectStructuredData("<script id='x' type='application/ld+json'>{broken}</script>").errors.length, 1);
    assert.equal(inspectStructuredData(jsonLd(null)).errors.length, 1);
    assert.deepEqual(inspectStructuredData('<script>not JSON</script>').errors, []);
});

test('automation detail pages retain truthful metadata and canonical URLs', () => {
    const pagesDir = path.resolve(__dirname, '../../pages');
    const detailPages = [
        'automation-alutech-am5000kit.html', 'automation-alutech-at-4n.html',
        'automation-alutech-lm-l.html', 'automation-alutech-rto1000.html',
        'automation-alutech-rto500.html', 'automation-alutech-sl-u.html',
        'automation-ati3000a.html', 'automation-ati5000a.html'
    ];
    for (const file of detailPages) {
        const html = fs.readFileSync(path.join(pagesDir, file), 'utf8');
        const { errors, nodes } = inspectStructuredData(html);
        assert.deepEqual(errors, [], file);
        const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
        const page = nodes.find((node) => node['@type'] === 'WebPage' && node.url === canonical);
        assert.ok(page, `${file}: description-only product needs matching WebPage metadata`);
        assert.ok(page.name && page.description && page.image, file);
        assert.equal(page.inLanguage, 'ru-RU', file);
        for (const field of ['brand', 'model', 'category', 'offers', 'review', 'aggregateRating']) {
            assert.equal(page[field], undefined, `${file}: unsupported WebPage field ${field}`);
        }
    }
});
