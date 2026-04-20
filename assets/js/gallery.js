document.addEventListener('DOMContentLoaded', function () {
    const pageSize = 12;
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
    const galleryGrid = document.querySelector('[data-gallery-grid]');
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromUrl = urlParams.get('filter');

    let visibleCount = pageSize;
    let activeFilter = 'all';
    let galleryItemsData = [];
    let galleryItemsLoaded = false;
    let galleryItemsLoadError = false;
    const hideTimeouts = new WeakMap();

    function getFilterButtons() {
        return Array.from(document.querySelectorAll('.gallery-filters .filter-btn'));
    }

    function getGalleryItems() {
        return Array.from(document.querySelectorAll('.gallery-grid .gallery-item:not(.gallery-item--skeleton)'));
    }

    function getShowMoreButton() {
        return document.querySelector('.gallery-show-more');
    }

    function getShowMoreMeta() {
        return document.querySelector('.gallery-more__meta');
    }

    function getGalleryEmptyState() {
        return document.querySelector('.gallery-empty');
    }

    function normalizeFilterValue(filterValue) {
        const normalized = filterValue || 'all';
        const buttons = getFilterButtons();
        return buttons.some((button) => button.getAttribute('data-filter') === normalized)
            ? normalized
            : 'all';
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getCategoryNote(category) {
        return categoryNotes[category] || 'Реальный объект из практики компании.';
    }

    function getFilterLabel(filterValue) {
        const button = getFilterButtons().find((node) => node.getAttribute('data-filter') === filterValue);
        if (!button) return 'выбранной категории';
        return button.textContent.replace(/\s+/g, ' ').trim();
    }

    function setActiveFilterButton(filterValue) {
        getFilterButtons().forEach((button) => {
            button.classList.toggle('active', button.getAttribute('data-filter') === filterValue);
        });
    }

    function setGridBusy(isBusy) {
        if (!galleryGrid) return;
        galleryGrid.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }

    function renderGalleryItems(items, filterValue = 'all', initialVisibleCount = pageSize) {
        if (!galleryGrid) return;

        const normalizedFilter = normalizeFilterValue(filterValue);
        let shownInFilter = 0;

        galleryGrid.innerHTML = items.map((item) => {
            const matchesFilter = normalizedFilter === 'all' || item.category === normalizedFilter;
            const isVisible = matchesFilter && shownInFilter < initialVisibleCount;

            if (matchesFilter) {
                shownInFilter += 1;
            }

            return `
            <div class="gallery-item" data-category="${escapeHtml(item.category)}" aria-hidden="${isVisible ? 'false' : 'true'}"${isVisible ? '' : ' style="display:none;opacity:0;transform:translateY(20px) scale(0.95)"'}>
                <div class="gallery-image">
                    <img src="${escapeHtml(item.preview)}" width="${Number(item.width) || 1}" height="${Number(item.height) || 1}" alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async">
                    <a href="${escapeHtml(item.full)}" class="zoom-btn" data-lightbox="gallery" aria-label="${escapeHtml(item.alt || item.title || item.label || 'Открыть фото')}">
                        <i class="fas fa-expand-alt"></i>
                    </a>
                </div>
                <div class="work-info">
                    <span class="work-category">${escapeHtml(item.label)}</span>
                    <h3 class="work-title">${escapeHtml(item.title)}</h3>
                    <p class="work-note">${escapeHtml(getCategoryNote(item.category))}</p>
                </div>
            </div>
        `;
        }).join('');
    }

    async function ensureGalleryItems() {
        if (!galleryGrid || galleryItemsLoaded || galleryItemsLoadError) {
            return galleryItemsData;
        }

        const source = galleryGrid.getAttribute('data-gallery-source');
        if (!source) {
            galleryItemsLoadError = true;
            return [];
        }

        setGridBusy(true);

        try {
            const response = await fetch(source, { cache: 'default' });
            if (!response.ok) {
                throw new Error(`Failed to load gallery items: ${response.status}`);
            }

            const payload = await response.json();
            galleryItemsData = Array.isArray(payload) ? payload : [];
            renderGalleryItems(galleryItemsData, normalizeFilterValue(filterFromUrl), visibleCount);
            galleryItemsLoaded = true;
            return galleryItemsData;
        } catch (error) {
            console.error(error);
            galleryItemsLoadError = true;
            const emptyState = getGalleryEmptyState();
            const meta = getShowMoreMeta();

            if (emptyState) {
                const title = emptyState.querySelector('h3');
                const copy = emptyState.querySelector('p');
                if (title) title.textContent = 'Не удалось загрузить работы';
                if (copy) copy.textContent = 'Попробуйте обновить страницу ещё раз. Если нужно, можно сразу перейти к контактам и обсудить задачу напрямую.';
                emptyState.hidden = false;
            }

            if (meta) {
                meta.textContent = 'Галерея временно недоступна';
            }

            return [];
        } finally {
            setGridBusy(false);
        }
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
        const showMoreMeta = getShowMoreMeta();
        if (!showMoreButton) return;
        if (!showMoreButton.dataset.defaultLabel) {
            showMoreButton.dataset.defaultLabel = showMoreButton.textContent.trim();
        }

        if (showMoreMeta) {
            const shownItems = totalItems > 0 ? Math.min(visibleCount, totalItems) : 0;
            showMoreMeta.textContent = totalItems > 0
                ? `Показано ${shownItems} из ${totalItems} работ`
                : 'Сейчас в этой выборке ничего не показано';
        }

        const remaining = Math.max(totalItems - visibleCount, 0);
        if (remaining > 0) {
            const batchSize = Math.min(pageSize, remaining);
            showMoreButton.style.display = 'inline-flex';
            showMoreButton.textContent = `${showMoreButton.dataset.defaultLabel} (${batchSize})`;
            return;
        }

        showMoreButton.style.display = 'none';
        showMoreButton.textContent = showMoreButton.dataset.defaultLabel;
    }

    function updateEmptyState(totalItems, filterValue) {
        const emptyState = getGalleryEmptyState();
        const showMoreMeta = getShowMoreMeta();
        if (!emptyState) return;

        if (totalItems > 0) {
            emptyState.hidden = true;
            return;
        }

        const title = emptyState.querySelector('h3');
        const copy = emptyState.querySelector('p');
        const filterLabel = getFilterLabel(filterValue);

        if (title) {
            title.textContent = filterValue === 'all'
                ? 'Пока нет карточек для показа'
                : `По фильтру «${filterLabel}» пока нет карточек`;
        }

        if (copy) {
            copy.textContent = filterValue === 'all'
                ? 'Попробуйте обновить страницу чуть позже или открыть галерею снова.'
                : 'Вернитесь ко всем работам или переключитесь на соседнюю категорию, чтобы быстро найти похожие объекты.';
        }

        if (showMoreMeta) {
            showMoreMeta.textContent = filterValue === 'all'
                ? 'Галерея временно пуста'
                : `Фильтр «${filterLabel}» сейчас пуст`;
        }

        emptyState.hidden = false;
    }

    function applyFilter(filterValue, resetCount) {
        const filterButtons = getFilterButtons();
        const galleryItems = getGalleryItems();
        if (!filterButtons.length || !galleryItems.length) return;

        if (!filterButtons.some((button) => button.getAttribute('data-filter') === filterValue)) {
            filterValue = 'all';
        }

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
            if (index < visibleCount) {
                showItem(item, index);
            } else {
                hideItem(item);
            }
        });

        updateEmptyState(filteredItems.length, filterValue);
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

    document.addEventListener('click', async (event) => {
        const filterButton = event.target.closest('.gallery-filters .filter-btn');
        if (filterButton) {
            await ensureGalleryItems();
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
            await ensureGalleryItems();
            const filterValue = filterLink.getAttribute('data-filter') || 'all';
            applyFilter(filterValue, true);
            const filters = document.querySelector('.gallery-filters');
            if (filters) {
                filters.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        const externalFilterTrigger = event.target.closest('[data-gallery-filter-trigger]');
        if (externalFilterTrigger) {
            await ensureGalleryItems();
            const filterValue = externalFilterTrigger.getAttribute('data-filter') || 'all';
            applyFilter(filterValue, true);
            window.history.pushState(null, '', filterValue === 'all' ? 'gallery.html' : `gallery.html?filter=${encodeURIComponent(filterValue)}`);
        }
    });

    window.addEventListener('popstate', async () => {
        await ensureGalleryItems();
        const params = new URLSearchParams(window.location.search);
        applyFilter(params.get('filter') || 'all', true);
    });

    async function initializeGallery() {
        if (!galleryGrid || !getFilterButtons().length) {
            animateCounter();
            return;
        }

        const items = await ensureGalleryItems();
        if (items.length) {
            applyFilter(normalizeFilterValue(filterFromUrl), true);
        }

        animateCounter();
    }

    initializeGallery();
});
