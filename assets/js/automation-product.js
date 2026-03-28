document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-product-gallery]').forEach((gallery) => {
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

        if (getThumbs().length === 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';

            if (thumbsWrap) {
                thumbsWrap.style.display = 'none';
            }
        }

        const normalizeIndex = (index) => {
            const thumbs = getThumbs();
            if (!thumbs.length) {
                return 0;
            }
            return (index + thumbs.length) % thumbs.length;
        };

        let currentIndex = Math.max(getThumbs().findIndex((button) => button.classList.contains('is-active')), 0);

        const setActive = (button, index) => {
            const src = button.getAttribute('data-thumb-src');
            const alt = button.getAttribute('data-thumb-alt') || '';
            if (!src) return;

            mainImage.src = src;
            if (alt) {
                mainImage.alt = alt;
            }
            mainLink.href = src;

            const thumbs = getThumbs();
            thumbs.forEach((item) => item.classList.remove('is-active'));
            button.classList.add('is-active');
            currentIndex = normalizeIndex(index);
        };

        const setActiveByIndex = (index) => {
            const thumbs = getThumbs();
            const normalizedIndex = normalizeIndex(index);
            const button = thumbs[normalizedIndex];
            if (!button) {
                return;
            }
            setActive(button, normalizedIndex);
        };

        gallery.addEventListener('click', (event) => {
            const button = event.target.closest('[data-thumb-src]');
            if (!button || !gallery.contains(button) || button.hidden) {
                return;
            }

            const thumbs = getThumbs();
            setActive(button, thumbs.indexOf(button));
        });

        prevButton.addEventListener('click', () => {
            setActiveByIndex(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            setActiveByIndex(currentIndex + 1);
        });

        setActiveByIndex(currentIndex);
    });
});
