document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-embed-loader]').forEach((container) => {
        const frame = container.querySelector('iframe[data-src]');

        if (!(frame instanceof HTMLIFrameElement)) {
            return;
        }

        const src = (frame.dataset.src || '').trim();

        if (!src) {
            return;
        }

        if (frame.src !== src) {
            frame.src = src;
        }

        frame.hidden = false;
        container.classList.add('is-loaded');

        const trigger = container.querySelector('[data-embed-trigger]');
        if (trigger instanceof HTMLButtonElement) {
            trigger.disabled = true;
        }
    });
});
