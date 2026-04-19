// ========== GALLERY.JS ==========
document.addEventListener('DOMContentLoaded', function () {
    const pageSize = 12;
    let visibleCount = pageSize;
    let activeFilter = 'all';
    const hideTimeouts = new WeakMap();
    const categoryNotes = {
        sliding: 'Надёжная откатная система для въезда, участка и фасада.',
        swing: 'Распашные створки под частный дом, двор и въездную группу.',
        wicket: 'Калитка в едином стиле с воротами и забором.',
        fence: 'Решение под фасад, улицу и границу участка.',
        automation: 'Автоматика и комплектующие для уверенной работы ворот.',
        install: 'Монтаж, каркас и точная геометрия на объекте.',
        sandblast: 'Подготовка металла перед грунтом и покраской.',
        powder: 'Цвет, фактура и стойкое покрытие для металла.'
    };
    const counterElement = document.querySelector('.counter-number');
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromUrl = urlParams.get('filter');
    const paletteModal = document.querySelector('.palette-modal');
    const paletteModalImage = paletteModal ? paletteModal.querySelector('.palette-modal__image') : null;
    const paletteModalClose = paletteModal ? paletteModal.querySelector('.palette-modal__close') : null;
    let paletteLastFocus = null;

    function getFilterButtons() {
        return Array.from(document.querySelectorAll('.gallery-filters .filter-btn'));
    }

    function getGalleryItems() {
        return Array.from(document.querySelectorAll('.gallery-grid .gallery-item'));
    }

    function getShowMoreButton() {
        return document.querySelector('.gallery-show-more');
    }

    function setActiveFilterButton(filterValue) {
        getFilterButtons().forEach((button) => {
            button.classList.toggle('active', button.getAttribute('data-filter') === filterValue);
        });
    }

    function hideItem(item) {
        if (!item) return;
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.95)';
        item.setAttribute('aria-hidden', 'true');
        if (hideTimeouts.has(item)) {
            clearTimeout(hideTimeouts.get(item));
        }
        const timeoutId = setTimeout(() => {
            item.style.display = 'none';
        }, 260);
        hideTimeouts.set(item, timeoutId);
    }

    function showItem(item, index) {
        if (!item) return;
        if (hideTimeouts.has(item)) {
            clearTimeout(hideTimeouts.get(item));
            hideTimeouts.delete(item);
        }
        if (item.style.display === 'none') {
            item.style.display = 'block';
        }
        item.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, Math.min(index, 10) * 36);
    }

    function updateShowMore(totalItems) {
        const showMoreButton = getShowMoreButton();
        if (!showMoreButton) return;
        showMoreButton.style.display = totalItems > visibleCount ? 'inline-flex' : 'none';
    }

    function syncGalleryCardMeta(item) {
        if (!item) return;
        const workInfo = item.querySelector('.work-info');
        if (!workInfo) return;

        let note = workInfo.querySelector('.work-note');
        if (!note) {
            note = document.createElement('p');
            note.className = 'work-note';
            workInfo.appendChild(note);
        }

        note.textContent = categoryNotes[item.getAttribute('data-category')] || 'Реальный объект из практики компании.';
    }

    function applyFilter(filterValue, resetCount) {
        const filterButtons = getFilterButtons();
        const galleryItems = getGalleryItems();
        if (!filterButtons.length || !galleryItems.length) return;

        activeFilter = filterValue;
        if (resetCount) {
            visibleCount = pageSize;
        }

        setActiveFilterButton(filterValue);

        const filteredItems = galleryItems.filter((item) => {
            const itemCategory = item.getAttribute('data-category');
            return filterValue === 'all' || itemCategory === filterValue;
        });

        const filteredSet = new Set(filteredItems);
        galleryItems.forEach((item) => {
            if (!filteredSet.has(item)) {
                hideItem(item);
            }
        });

        filteredItems.forEach((item, index) => {
            syncGalleryCardMeta(item);
            if (index < visibleCount) {
                showItem(item, index);
            } else {
                hideItem(item);
            }
        });

        updateShowMore(filteredItems.length);
    }

    function animateCounter() {
        if (!counterElement) return;
        if (counterElement.dataset.counterAnimated === 'true') return;
        counterElement.dataset.counterAnimated = 'true';

        const rawValue = counterElement.textContent || '200+';
        const match = rawValue.match(/\d+/);
        const finalNumber = match ? Number(match[0]) : 200;
        const suffix = rawValue.includes('+') ? '+' : '';
        let currentNumber = 0;
        const increment = finalNumber / 80;
        const duration = 1800;
        const interval = duration / 80;

        const counterInterval = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(counterInterval);
            }
            counterElement.textContent = Math.floor(currentNumber) + suffix;
        }, interval);
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
        if (paletteModalClose) {
            paletteModalClose.focus();
        }
    }

    function closePaletteModal() {
        if (!paletteModal) return;
        paletteModal.classList.remove('is-open');
        paletteModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (paletteModalImage) {
            paletteModalImage.hidden = true;
            paletteModalImage.removeAttribute('src');
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

    if (paletteModalClose) {
        paletteModalClose.addEventListener('click', closePaletteModal);
    }

    document.addEventListener('keydown', (event) => {
        if (!paletteModal || !paletteModal.classList.contains('is-open')) return;
        if (event.key === 'Escape') {
            closePaletteModal();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            if (paletteModalClose) {
                paletteModalClose.focus();
            }
        }
    });

    document.querySelectorAll('[data-palette]').forEach((slider) => {
        const mainImg = slider.querySelector('.palette-main img');
        const zoomLink = slider.querySelector('.palette-zoom');
        const thumbs = slider.querySelectorAll('.palette-thumb');
        if (!mainImg) return;

        if (thumbs.length) {
            thumbs.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const src = btn.getAttribute('data-src');
                    const alt = btn.getAttribute('data-alt') || '';
                    if (!src) return;
                    mainImg.src = src;
                    if (alt) mainImg.alt = alt;
                    if (zoomLink) zoomLink.href = src;
                    thumbs.forEach((b) => b.classList.remove('is-active'));
                    btn.classList.add('is-active');
                });
            });
        }

        if (zoomLink) {
            zoomLink.addEventListener('click', (event) => {
                event.preventDefault();
                openPaletteModal(mainImg.src, mainImg.alt);
            });
        }
    });

    document.addEventListener('click', (event) => {
        const filterButton = event.target.closest('.gallery-filters .filter-btn');
        if (filterButton) {
            const filterValue = filterButton.getAttribute('data-filter') || 'all';
            applyFilter(filterValue, true);

            const nextUrl = filterValue === 'all'
                ? 'gallery.html'
                : `gallery.html?filter=${encodeURIComponent(filterValue)}`;
            window.history.pushState(null, '', nextUrl);
            return;
        }

        const showMoreButton = event.target.closest('.gallery-show-more');
        if (showMoreButton) {
            visibleCount += pageSize;
            applyFilter(activeFilter, false);
            return;
        }

        const filterLink = event.target.closest('a[data-filter]');
        if (filterLink) {
            event.preventDefault();
            const filterValue = filterLink.getAttribute('data-filter') || 'all';
            applyFilter(filterValue, true);
            const filters = document.querySelector('.gallery-filters');
            if (filters) {
                filters.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    const lightboxLinks = Array.from(document.querySelectorAll('a[data-lightbox]'));
    if (lightboxLinks.length) {
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
                        <img class="lightbox-modal__image" alt="Просмотр изображения" hidden>
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

        const getLinkedImageAlt = (link) => {
            const img = link.closest('.work-image-container, .gallery-image, .work-item, .gallery-item')?.querySelector('img');
            return img ? img.alt : '';
        };

        const getLinkCaption = (link) => {
            return link.getAttribute('title') || link.getAttribute('aria-label') || getLinkedImageAlt(link) || '';
        };

        const updateLightbox = (index) => {
            const link = lightboxGroup[index];
            if (!link || !lightboxImage) return;
            const href = link.getAttribute('href');
            if (!href) return;
            const caption = getLinkCaption(link);
            const altText = getLinkedImageAlt(link) || caption || 'Изображение';
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
        };

        const openLightbox = (link) => {
            const groupName = link.getAttribute('data-lightbox') || '';
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
            if (lightboxClose) {
                lightboxClose.focus();
            }
        };

        const closeLightbox = () => {
            lightboxModal.classList.remove('is-open');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            if (lightboxImage) {
                lightboxImage.hidden = true;
                lightboxImage.removeAttribute('src');
                lightboxImage.alt = '';
            }
            if (lightboxLastFocus && typeof lightboxLastFocus.focus === 'function') {
                lightboxLastFocus.focus();
            }
            lightboxLastFocus = null;
        };

        const navigateLightbox = (step) => {
            if (lightboxGroup.length <= 1) return;
            lightboxIndex = (lightboxIndex + step + lightboxGroup.length) % lightboxGroup.length;
            updateLightbox(lightboxIndex);
        };

        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[data-lightbox]');
            if (!link) return;
            event.preventDefault();
            openLightbox(link);
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxModal) {
            lightboxModal.addEventListener('click', (event) => {
                if (event.target === lightboxModal) {
                    closeLightbox();
                }
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => navigateLightbox(1));
        }

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
    }

    document.addEventListener('pokraska:gallery-updated', () => {
        getGalleryItems().forEach(syncGalleryCardMeta);
        const availableValues = new Set(getFilterButtons().map((button) => button.getAttribute('data-filter')));
        if (!availableValues.has(activeFilter)) {
            activeFilter = 'all';
        }
        applyFilter(activeFilter, true);
    });

    if (getFilterButtons().length && getGalleryItems().length) {
        getGalleryItems().forEach(syncGalleryCardMeta);
        applyFilter(filterFromUrl || 'all', true);
    }

    animateCounter();
});
