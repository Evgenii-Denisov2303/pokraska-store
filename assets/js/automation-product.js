document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-product-gallery]').forEach((gallery) => {
        const mainImage = gallery.querySelector('[data-main-image]');
        const mainLink = gallery.querySelector('[data-main-link]');
        const thumbs = Array.from(gallery.querySelectorAll('[data-thumb-src]'));

        if (!mainImage || !mainLink || !thumbs.length) {
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

        if (thumbs.length === 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }

        const normalizeIndex = (index) => {
            if (!thumbs.length) {
                return 0;
            }
            return (index + thumbs.length) % thumbs.length;
        };

        let currentIndex = Math.max(thumbs.findIndex((button) => button.classList.contains('is-active')), 0);

        const setActive = (button, index) => {
            const src = button.getAttribute('data-thumb-src');
            const alt = button.getAttribute('data-thumb-alt') || '';
            if (!src) return;

            mainImage.src = src;
            if (alt) {
                mainImage.alt = alt;
            }
            mainLink.href = src;

            thumbs.forEach((item) => item.classList.remove('is-active'));
            button.classList.add('is-active');
            currentIndex = normalizeIndex(index);
        };

        const setActiveByIndex = (index) => {
            const normalizedIndex = normalizeIndex(index);
            const button = thumbs[normalizedIndex];
            if (!button) {
                return;
            }
            setActive(button, normalizedIndex);
        };

        thumbs.forEach((button, index) => {
            button.addEventListener('click', () => setActive(button, index));
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
