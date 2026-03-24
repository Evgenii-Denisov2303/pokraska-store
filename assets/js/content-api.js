(function() {
    const contentCache = new Map();
    const metaContentBase = document.querySelector('meta[name="pokraska-content-base"]')?.content?.trim();
    const configuredBase = (window.POKRASKA_CONTENT_BASE || metaContentBase || '').trim().replace(/\/+$/, '');

    function cloneData(value) {
        return value == null ? value : JSON.parse(JSON.stringify(value));
    }

    function buildContentUrl(name, fresh) {
        const suffix = fresh ? `?t=${Date.now()}` : '';
        const basePath = `${configuredBase}/content/${name}.json${suffix}`;
        return configuredBase ? basePath : `/content/${name}.json${suffix}`;
    }

    async function loadContentFile(name, options = {}) {
        const fresh = Boolean(options.fresh);

        if (!fresh && contentCache.has(name)) {
            return cloneData(contentCache.get(name));
        }

        const response = await fetch(buildContentUrl(name, fresh), {
            cache: fresh ? 'no-store' : 'default'
        });

        if (!response.ok) {
            throw new Error(`Failed to load content file "${name}"`);
        }

        const data = await response.json();
        contentCache.set(name, data);
        return cloneData(data);
    }

    window.PokraskaContent = {
        loadContentFile,
        baseUrl: configuredBase
    };
})();
