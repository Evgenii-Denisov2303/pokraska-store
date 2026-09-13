// A regression guard for JSON-LD syntax and the incomplete Product markup
// reported by Search Console. This is not a complete schema.org validator.
function inspectStructuredData(html) {
    const errors = [];
    const nodes = [];
    const scripts = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;

    function visit(value) {
        if (!value || typeof value !== 'object') return;
        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }

        nodes.push(value);
        const types = [value['@type']].flat();
        if (types.some((type) => /^(?:https?:\/\/schema\.org\/)?Product$/.test(type))) {
            const hasSnippetData = ['offers', 'review', 'aggregateRating'].some((key) =>
                [value[key]].flat().some((entry) => entry && typeof entry === 'object'
                    && Object.keys(entry).some((property) => !property.startsWith('@')))
            );
            if (!hasSnippetData) {
                errors.push(`Product "${value.name || '(unnamed)'}" needs real offers, review or aggregateRating data; use WebPage for description-only pages.`);
            }
        }

        Object.values(value).forEach(visit);
    }

    let block = 0;
    for (const match of html.matchAll(scripts)) {
        if (!/\btype\s*=\s*(["'])application\/ld\+json\1/i.test(match[1])) continue;
        block += 1;
        let data;
        try {
            data = JSON.parse(match[2]);
        } catch {
            errors.push(`JSON-LD block ${block} contains invalid JSON.`);
            continue;
        }
        if (!data || typeof data !== 'object') {
            errors.push(`JSON-LD block ${block} must contain an object or array.`);
            continue;
        }
        visit(data);
    }

    return { errors, nodes };
}

module.exports = { inspectStructuredData };
