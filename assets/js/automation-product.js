(() => {
    function initProductGallery(gallery) {
        if (!gallery || gallery.dataset.productGalleryBound === '1') {
            return;
        }
        gallery.dataset.productGalleryBound = '1';

        const mainImage = gallery.querySelector('[data-main-image]');
        const mainLink = gallery.querySelector('[data-main-link]');
        const thumbsWrap = gallery.querySelector('.automation-product-thumbs');
        const getThumbs = () => Array.from(gallery.querySelectorAll('[data-thumb-src]')).filter((button) => !button.hidden);

        if (!mainImage || !mainLink || !getThumbs().length) {
            return;
        }

        const createNavButton = (direction, label, iconClass) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `automation-product-nav automation-product-nav--${direction}`;
            button.setAttribute(`data-gallery-${direction}`, '');
            button.setAttribute('aria-label', label);
            button.innerHTML = `<i class="fas ${iconClass}" aria-hidden="true"></i>`;
            gallery.appendChild(button);
            return button;
        };

        const prevButton = gallery.querySelector('[data-gallery-prev]') || createNavButton('prev', 'Предыдущее фото', 'fa-chevron-left');
        const nextButton = gallery.querySelector('[data-gallery-next]') || createNavButton('next', 'Следующее фото', 'fa-chevron-right');

        const preloadImage = (src) => {
            if (!src) {
                return Promise.resolve(null);
            }

            return new Promise((resolve) => {
                const image = new Image();
                image.decoding = 'async';
                image.src = src;

                const finish = () => resolve(image);

                if (typeof image.decode === 'function') {
                    image.decode().then(finish).catch(finish);
                    return;
                }

                image.onload = finish;
                image.onerror = finish;
            });
        };

        const sameImageSource = (candidate, current) => {
            if (!candidate || !current) {
                return false;
            }

            try {
                return new URL(candidate, window.location.href).href === new URL(current, window.location.href).href;
            } catch (error) {
                return candidate === current;
            }
        };

        const syncNavVisibility = () => {
            const thumbs = getThumbs();
            if (thumbs.length <= 1) {
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
                if (thumbsWrap) thumbsWrap.style.display = 'none';
                return;
            }

            prevButton.style.display = '';
            nextButton.style.display = '';
            if (thumbsWrap) thumbsWrap.style.display = '';
        };

        const normalizeIndex = (index) => {
            const thumbs = getThumbs();
            if (!thumbs.length) {
                return 0;
            }
            return (index + thumbs.length) % thumbs.length;
        };

        let currentIndex = Math.max(getThumbs().findIndex((button) => button.classList.contains('is-active')), 0);
        let galleryRequestId = 0;

        const setActive = async (button, index) => {
            const src = button.getAttribute('data-thumb-src');
            const alt = button.getAttribute('data-thumb-alt') || '';
            const title = button.getAttribute('data-thumb-title') || alt;
            const thumbImage = button.querySelector('img');
            const width = Number(button.dataset.thumbWidth || thumbImage?.getAttribute('width') || mainImage.getAttribute('width') || 0);
            const height = Number(button.dataset.thumbHeight || thumbImage?.getAttribute('height') || mainImage.getAttribute('height') || 0);
            if (!src) return;

            const thumbs = getThumbs();
            const normalizedIndex = normalizeIndex(index);
            const requestId = ++galleryRequestId;

            thumbs.forEach((item) => item.classList.toggle('is-active', item === button));
            currentIndex = normalizedIndex;
            syncNavVisibility();

            if (!sameImageSource(src, mainImage.currentSrc || mainImage.getAttribute('src'))) {
                await preloadImage(src);
                if (requestId !== galleryRequestId) {
                    return;
                }
            }

            mainLink.href = src;
            mainLink.title = title;

            if (!sameImageSource(src, mainImage.currentSrc || mainImage.getAttribute('src'))) {
                mainImage.src = src;
            }

            mainImage.alt = alt;

            if (width) {
                mainImage.setAttribute('width', String(width));
            }

            if (height) {
                mainImage.setAttribute('height', String(height));
            }
        };

        const setActiveByIndex = (index) => {
            const thumbs = getThumbs();
            const normalizedIndex = normalizeIndex(index);
            const button = thumbs[normalizedIndex];
            if (!button) {
                return;
            }
            void setActive(button, normalizedIndex);
        };

        gallery.addEventListener('click', (event) => {
            const button = event.target.closest('[data-thumb-src]');
            if (!button || !gallery.contains(button) || button.hidden) {
                return;
            }

            const thumbs = getThumbs();
            void setActive(button, thumbs.indexOf(button));
        });

        prevButton.addEventListener('click', () => {
            setActiveByIndex(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            setActiveByIndex(currentIndex + 1);
        });

        syncNavVisibility();
        setActiveByIndex(currentIndex);
    }

    window.PokraskaAutomationProductGallery = {
        init: initProductGallery
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-product-gallery]').forEach((gallery) => {
            initProductGallery(gallery);
        });
    });
})();
