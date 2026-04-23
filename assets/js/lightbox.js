document.addEventListener('DOMContentLoaded', function () {
    const EMPTY_IMAGE_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const paletteModal = document.querySelector('.palette-modal');
    const paletteModalImage = paletteModal ? paletteModal.querySelector('.palette-modal__image') : null;
    const paletteModalClose = paletteModal ? paletteModal.querySelector('.palette-modal__close') : null;
    let paletteLastFocus = null;

    if (paletteModalImage && !paletteModalImage.getAttribute('src')) {
        paletteModalImage.src = EMPTY_IMAGE_SRC;
    }

    function openPaletteModal(src, alt) {
        if (!paletteModal || !paletteModalImage || !src) return;
        paletteModalImage.hidden = false;
        paletteModalImage.src = src;
        paletteModalImage.alt = alt || 'Просмотр палитры';
        paletteLastFocus = document.activeElement;
        paletteModal.setAttribute('aria-hidden', 'false');
        paletteModal.classList.add('is-open');
        document.body.classList.add('modal-open');
        paletteModalClose?.focus();
    }

    function closePaletteModal() {
        if (!paletteModal) return;
        paletteModal.classList.remove('is-open');
        paletteModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        if (paletteModalImage) {
            paletteModalImage.hidden = true;
            paletteModalImage.src = EMPTY_IMAGE_SRC;
            paletteModalImage.alt = '';
        }

        if (paletteLastFocus && typeof paletteLastFocus.focus === 'function') {
            paletteLastFocus.focus();
        }

        paletteLastFocus = null;
    }

    if (paletteModal) {
        paletteModal.addEventListener('click', (event) => {
            if (event.target === paletteModal) {
                closePaletteModal();
            }
        });
    }

    paletteModalClose?.addEventListener('click', closePaletteModal);

    document.addEventListener('keydown', (event) => {
        if (paletteModal?.classList.contains('is-open')) {
            if (event.key === 'Escape') {
                closePaletteModal();
            } else if (event.key === 'Tab') {
                event.preventDefault();
                paletteModalClose?.focus();
            }
        }
    });

    document.querySelectorAll('[data-palette]').forEach((slider) => {
        const mainImg = slider.querySelector('.palette-main img');
        const zoomLink = slider.querySelector('.palette-zoom');
        const thumbs = slider.querySelectorAll('.palette-thumb');
        if (!mainImg) return;

        thumbs.forEach((btn) => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                const alt = btn.getAttribute('data-alt') || '';
                if (!src) return;
                mainImg.src = src;
                if (alt) mainImg.alt = alt;
                if (zoomLink) zoomLink.href = src;
                thumbs.forEach((item) => item.classList.remove('is-active'));
                btn.classList.add('is-active');
            });
        });

        zoomLink?.addEventListener('click', (event) => {
            event.preventDefault();
            openPaletteModal(mainImg.src, mainImg.alt);
        });
    });

    let lightboxModal = document.querySelector('.lightbox-modal');
    if (!lightboxModal) {
        lightboxModal = document.createElement('div');
        lightboxModal.className = 'lightbox-modal';
        lightboxModal.setAttribute('role', 'dialog');
        lightboxModal.setAttribute('aria-modal', 'true');
        lightboxModal.setAttribute('aria-label', 'Просмотр изображения');
        lightboxModal.setAttribute('aria-hidden', 'true');
        lightboxModal.innerHTML = `
            <div class="lightbox-modal__content">
                <button class="lightbox-modal__close" type="button" aria-label="Закрыть просмотр">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
                <button class="lightbox-modal__nav lightbox-modal__nav--prev" type="button" aria-label="Предыдущее изображение">
                    <i class="fas fa-chevron-left" aria-hidden="true"></i>
                </button>
                <button class="lightbox-modal__nav lightbox-modal__nav--next" type="button" aria-label="Следующее изображение">
                    <i class="fas fa-chevron-right" aria-hidden="true"></i>
                </button>
                <figure class="lightbox-modal__figure">
                    <img class="lightbox-modal__image" src="${EMPTY_IMAGE_SRC}" alt="Просмотр изображения" hidden>
                    <figcaption class="lightbox-modal__caption"></figcaption>
                </figure>
            </div>
        `;
        document.body.appendChild(lightboxModal);
    }

    const lightboxImage = lightboxModal.querySelector('.lightbox-modal__image');
    const lightboxCaption = lightboxModal.querySelector('.lightbox-modal__caption');
    const lightboxClose = lightboxModal.querySelector('.lightbox-modal__close');
    const lightboxPrev = lightboxModal.querySelector('.lightbox-modal__nav--prev');
    const lightboxNext = lightboxModal.querySelector('.lightbox-modal__nav--next');

    let lightboxGroup = [];
    let lightboxIndex = 0;
    let lightboxLastFocus = null;

    function getLightboxLinks() {
        return Array.from(document.querySelectorAll('a[data-lightbox]'));
    }

    function getLinkedImageAlt(link) {
        const img = link.closest('.work-image-container, .gallery-image, .work-item, .gallery-item, .automation-product-main, .catalog-panel, .automation-card')
            ?.querySelector('img');
        return img ? img.alt : '';
    }

    function getLinkCaption(link) {
        return link.getAttribute('title') || link.getAttribute('aria-label') || getLinkedImageAlt(link) || '';
    }

    function normalizeLightboxEntry(entry) {
        if (!entry) {
            return null;
        }

        if (entry instanceof Element) {
            const href = entry.getAttribute('href');
            if (!href) {
                return null;
            }

            return {
                href,
                caption: getLinkCaption(entry),
                alt: getLinkedImageAlt(entry) || getLinkCaption(entry) || 'Изображение'
            };
        }

        if (typeof entry === 'object' && entry.href) {
            return {
                href: entry.href,
                caption: entry.caption || entry.title || '',
                alt: entry.alt || entry.caption || entry.title || 'Изображение'
            };
        }

        return null;
    }

    function updateLightbox(index) {
        const entry = normalizeLightboxEntry(lightboxGroup[index]);
        if (!entry || !lightboxImage) return;
        const href = entry.href;
        if (!href) return;

        const caption = entry.caption || '';
        const altText = entry.alt || caption || 'Изображение';
        lightboxImage.hidden = false;
        lightboxImage.src = href;
        lightboxImage.alt = altText;

        if (lightboxCaption) {
            lightboxCaption.textContent = caption;
            lightboxCaption.style.display = caption ? 'block' : 'none';
        }

        const isMulti = lightboxGroup.length > 1;
        if (lightboxPrev && lightboxNext) {
            lightboxPrev.style.display = isMulti ? 'inline-flex' : 'none';
            lightboxNext.style.display = isMulti ? 'inline-flex' : 'none';
            lightboxPrev.disabled = !isMulti;
            lightboxNext.disabled = !isMulti;
        }
    }

    function openLightbox(link) {
        const groupName = link.getAttribute('data-lightbox') || '';
        const lightboxLinks = getLightboxLinks();
        lightboxGroup = lightboxLinks.filter((item) => (item.getAttribute('data-lightbox') || '') === groupName);
        if (!lightboxGroup.length) {
            lightboxGroup = [link];
        }

        lightboxIndex = Math.max(0, lightboxGroup.indexOf(link));
        lightboxLastFocus = document.activeElement;
        updateLightbox(lightboxIndex);
        lightboxModal.classList.add('is-open');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        lightboxClose?.focus();
    }

    function openLightboxGroup(items, startIndex = 0, focusTarget = null) {
        const normalizedItems = Array.isArray(items)
            ? items.map((item) => normalizeLightboxEntry(item)).filter(Boolean)
            : [];

        if (!normalizedItems.length) {
            return;
        }

        lightboxGroup = normalizedItems;
        lightboxIndex = Math.max(0, Math.min(startIndex, normalizedItems.length - 1));
        lightboxLastFocus = focusTarget || document.activeElement;
        updateLightbox(lightboxIndex);
        lightboxModal.classList.add('is-open');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        lightboxClose?.focus();
    }

    function closeLightbox() {
        lightboxModal.classList.remove('is-open');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        if (lightboxImage) {
            lightboxImage.hidden = true;
            lightboxImage.src = EMPTY_IMAGE_SRC;
            lightboxImage.alt = '';
        }

        if (lightboxLastFocus && typeof lightboxLastFocus.focus === 'function') {
            lightboxLastFocus.focus();
        }

        lightboxLastFocus = null;
    }

    function navigateLightbox(step) {
        if (lightboxGroup.length <= 1) return;
        lightboxIndex = (lightboxIndex + step + lightboxGroup.length) % lightboxGroup.length;
        updateLightbox(lightboxIndex);
    }

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[data-lightbox]');
        if (!link) return;
        event.preventDefault();
        openLightbox(link);
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (event) => {
        if (event.target === lightboxModal) {
            closeLightbox();
        }
    });
    lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext?.addEventListener('click', () => navigateLightbox(1));

    document.addEventListener('keydown', (event) => {
        if (!lightboxModal.classList.contains('is-open')) return;

        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (event.key === 'ArrowRight') {
            navigateLightbox(1);
        } else if (event.key === 'Tab') {
            const focusable = [lightboxClose, lightboxPrev, lightboxNext].filter(
                (element) => element && !element.disabled
            );
            if (!focusable.length) return;
            const currentIndex = focusable.indexOf(document.activeElement);
            const direction = event.shiftKey ? -1 : 1;
            const nextIndex = currentIndex === -1
                ? 0
                : (currentIndex + direction + focusable.length) % focusable.length;
            event.preventDefault();
            focusable[nextIndex].focus();
        }
    });

    window.PokraskaLightbox = {
        openGroup: openLightboxGroup,
        close: closeLightbox
    };
});
