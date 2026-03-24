(function() {
    const runtimeConfig = window.POKRASKA_RUNTIME || {};
    const metaContentBase = document.querySelector('meta[name="pokraska-content-base"]')?.content?.trim();

    if (!window.POKRASKA_CONTENT_BASE) {
        window.POKRASKA_CONTENT_BASE = String(runtimeConfig.contentBase || metaContentBase || '').trim();
    }
})();
