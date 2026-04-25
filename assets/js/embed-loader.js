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

        const trigger = container.querySelector('[data-embed-trigger]');

        if (trigger instanceof HTMLButtonElement) {
            trigger.disabled = true;
        }

        let revealTimer = 0;
        let didStartLoading = false;

        const revealFrame = () => {
            if (revealTimer) {
                window.clearTimeout(revealTimer);
                revealTimer = 0;
            }

            frame.hidden = false;
            container.classList.add('is-loaded');
            container.classList.remove('is-loading');
        };

        const startLoading = () => {
            if (didStartLoading) {
                return;
            }

            didStartLoading = true;
            container.classList.add('is-loading');
            frame.addEventListener('load', revealFrame, { once: true });
            frame.loading = container.hasAttribute('data-embed-lazy') ? 'lazy' : 'eager';

            if (frame.src !== src) {
                frame.src = src;
            }

            revealTimer = window.setTimeout(revealFrame, 1200);
        };

        if (container.hasAttribute('data-embed-lazy') && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) {
                    return;
                }

                observer.disconnect();
                startLoading();
            }, {
                rootMargin: '220px 0px'
            });

            observer.observe(container);
            return;
        }

        startLoading();
    });
});
