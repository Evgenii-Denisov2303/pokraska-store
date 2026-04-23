document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-embed-loader]').forEach((container) => {
        const trigger = container.querySelector('[data-embed-trigger]');
        const frame = container.querySelector('iframe[data-src]');

        if (!(trigger instanceof HTMLButtonElement) || !(frame instanceof HTMLIFrameElement)) {
            return;
        }

        const activate = () => {
            const src = (frame.dataset.src || '').trim();
            if (!src) {
                return;
            }

            if (frame.src !== src) {
                frame.src = src;
            }

            frame.hidden = false;
            container.classList.add('is-loaded');
            trigger.disabled = true;
        };

        trigger.addEventListener('click', activate, { once: true });
    });
});
