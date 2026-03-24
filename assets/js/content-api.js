(function() {
    const contentCache = new Map();

    function cloneData(value) {
        return value == null ? value : JSON.parse(JSON.stringify(value));
    }

    async function loadContentFile(name, options = {}) {
        const fresh = Boolean(options.fresh);

        if (!fresh && contentCache.has(name)) {
            return cloneData(contentCache.get(name));
        }

        const suffix = fresh ? `?t=${Date.now()}` : '';
        const response = await fetch(`/content/${name}.json${suffix}`, {
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
        loadContentFile
    };
})();
