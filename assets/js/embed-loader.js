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

        let fallbackTimer = 0;
        let didStartLoading = false;

        const setTriggerDisabled = (disabled) => {
            if (trigger instanceof HTMLButtonElement) {
                trigger.disabled = disabled;
            }
        };

        setTriggerDisabled(false);

        const revealFrame = () => {
            if (fallbackTimer) {
                window.clearTimeout(fallbackTimer);
                fallbackTimer = 0;
            }

            frame.hidden = false;
            container.classList.add('is-loaded');
            container.classList.remove('is-loading');
            container.classList.remove('is-timeout');
            container.removeAttribute('aria-busy');
            setTriggerDisabled(false);
        };

        const keepFallbackVisible = () => {
            fallbackTimer = 0;
            container.classList.add('is-timeout');
            container.classList.remove('is-loading');
            container.removeAttribute('aria-busy');
        };

        const startLoading = () => {
            if (didStartLoading) {
                return;
            }

            didStartLoading = true;
            container.classList.add('is-loading');
            container.classList.remove('is-timeout');
            container.setAttribute('aria-busy', 'true');
            setTriggerDisabled(true);
            frame.hidden = false;
            frame.addEventListener('load', revealFrame, { once: true });
            frame.loading = container.hasAttribute('data-embed-lazy') ? 'lazy' : 'eager';

            if (frame.src !== src) {
                frame.src = src;
            }

            fallbackTimer = window.setTimeout(keepFallbackVisible, 8000);
        };

        if (trigger instanceof HTMLButtonElement) {
            trigger.addEventListener('click', startLoading);
        }

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
