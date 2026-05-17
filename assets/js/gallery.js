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

    const proofCounterElement = document.querySelector('[data-gallery-proof-counter]');
    const proofSectionElement = document.querySelector('[data-gallery-proof-section]');
    const galleryGrid = document.querySelector('[data-gallery-grid]');
    const galleryToolbarTitle = document.querySelector('[data-gallery-toolbar-title]');
    const galleryToolbarCopy = document.querySelector('[data-gallery-toolbar-copy]');
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromUrl = urlParams.get('filter');

    let visibleCount = pageSize;
    let activeFilter = 'all';
    let galleryItemsData = [];
    let galleryItemsLoaded = false;
    let galleryItemsLoadError = false;
    const hideTimeouts = new WeakMap();

    function getFilterButtons() {
        return Array.from(document.querySelectorAll('[data-gallery-filters] .filter-btn'));
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

    function getShowMoreHelper() {
        return document.querySelector('.gallery-more__helper');
    }

    function getFiltersShell() {
        return document.getElementById('gallery-filters');
    }

    function getFilterList() {
        return document.querySelector('[data-gallery-filters]');
    }

    function getGalleryEmptyState() {
        return document.querySelector('.gallery-empty');
    }

    function updateFilterSwipeState() {
        const filterList = getFilterList();
        const filterBody = filterList?.closest('.gallery-filter-body');
        if (!filterList || !filterBody) return;

        const maxScroll = Math.max(0, filterList.scrollWidth - filterList.clientWidth);
        const edgeThreshold = 4;
        const hasOverflow = maxScroll > edgeThreshold;
        const isAtStart = !hasOverflow || filterList.scrollLeft <= edgeThreshold;
        const isAtEnd = !hasOverflow || filterList.scrollLeft >= maxScroll - edgeThreshold;

        filterBody.classList.toggle('has-overflow', hasOverflow);
        filterBody.classList.toggle('is-at-start', isAtStart);
        filterBody.classList.toggle('is-at-end', isAtEnd);
    }

    function bindFilterSwipeState() {
        const filterList = getFilterList();
        const filterBody = filterList?.closest('.gallery-filter-body');
        if (!filterList || !filterBody) return;

        if (filterBody.dataset.swipeStateBound === 'true') {
            updateFilterSwipeState();
            return;
        }

        const syncSwipeState = () => {
            window.requestAnimationFrame(updateFilterSwipeState);
        };

        filterList.addEventListener('scroll', syncSwipeState, { passive: true });
        filterList.addEventListener('touchstart', syncSwipeState, { passive: true });
        filterList.addEventListener('touchmove', syncSwipeState, { passive: true });
        filterList.addEventListener('touchend', syncSwipeState, { passive: true });
        filterList.addEventListener('pointerdown', syncSwipeState, { passive: true });
        filterList.addEventListener('pointerup', syncSwipeState, { passive: true });
        window.addEventListener('resize', syncSwipeState);
        window.addEventListener('load', syncSwipeState, { once: true });

        if (document.fonts && typeof document.fonts.ready?.then === 'function') {
            document.fonts.ready.then(syncSwipeState).catch(() => {});
        }

        filterBody.dataset.swipeStateBound = 'true';
        updateFilterSwipeState();
        window.setTimeout(updateFilterSwipeState, 120);
        window.setTimeout(updateFilterSwipeState, 480);
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

    function getDisplayTitle(item) {
        const rawTitle = String(item?.title || '').trim();
        if (!rawTitle) return '';
        return /^(Работа|Фото)\s+\d+$/i.test(rawTitle) ? '' : rawTitle;
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

    function updateToolbarIntro(filterValue) {
        const button = getFilterButtons().find((node) => node.getAttribute('data-filter') === filterValue)
            || getFilterButtons().find((node) => node.getAttribute('data-filter') === 'all');

        if (!button) return;

        if (galleryToolbarTitle) {
            galleryToolbarTitle.textContent = button.getAttribute('data-intro-title') || 'Ворота, заборы и покраска';
        }

        if (galleryToolbarCopy) {
            galleryToolbarCopy.textContent = button.getAttribute('data-intro-copy')
                || 'Для въезда, участка, фасада и производственных задач.';
        }
    }

    function setGridBusy(isBusy) {
        if (!galleryGrid) return;
        galleryGrid.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }

    function withGalleryImageVersion(url) {
        const version = galleryGrid?.getAttribute('data-gallery-image-version');
        if (!version || !url || url.includes('?') || url.startsWith('data:')) {
            return url;
        }

        return `${url}?v=${encodeURIComponent(version)}`;
    }

    function renderGalleryItems(items, filterValue = 'all', initialVisibleCount = pageSize) {
        if (!galleryGrid) return;

        const normalizedFilter = normalizeFilterValue(filterValue);
        let shownInFilter = 0;

        galleryGrid.innerHTML = items.map((item) => {
            const matchesFilter = normalizedFilter === 'all' || item.category === normalizedFilter;
            const visibleIndex = matchesFilter ? shownInFilter : -1;
            const isVisible = matchesFilter && visibleIndex < initialVisibleCount;
            const isPriorityImage = isVisible && visibleIndex < 2;
            const displayTitle = getDisplayTitle(item);
            const workInfoClass = displayTitle ? 'work-info' : 'work-info work-info--compact';
            const previewSrc = withGalleryImageVersion(item.preview);

            if (matchesFilter) {
                shownInFilter += 1;
            }

            return `
            <div class="gallery-item" data-category="${escapeHtml(item.category)}" aria-hidden="${isVisible ? 'false' : 'true'}"${isVisible ? '' : ' style="display:none;opacity:0;transform:translateY(20px) scale(0.95)"'}>
                <div class="gallery-image">
                    <img src="${escapeHtml(previewSrc)}" width="${Number(item.width) || 1}" height="${Number(item.height) || 1}" alt="${escapeHtml(item.alt)}" loading="${isPriorityImage ? 'eager' : 'lazy'}" fetchpriority="${isPriorityImage ? 'high' : 'low'}" decoding="async">
                    <a href="${escapeHtml(item.full)}" class="zoom-btn" data-lightbox="gallery" aria-label="${escapeHtml(item.alt || item.title || item.label || 'Открыть фото')}">
                        <i class="fas fa-expand-alt"></i>
                    </a>
                </div>
                <div class="${workInfoClass}">
                    <span class="work-category">${escapeHtml(item.label)}</span>
                    ${displayTitle ? `<h3 class="work-title">${escapeHtml(displayTitle)}</h3>` : ''}
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
        const showMoreHelper = getShowMoreHelper();
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
            if (showMoreHelper) {
                showMoreHelper.hidden = visibleCount <= pageSize;
            }
            return;
        }

        showMoreButton.style.display = 'none';
        showMoreButton.textContent = showMoreButton.dataset.defaultLabel;
        if (showMoreHelper) {
            showMoreHelper.hidden = !(totalItems > pageSize && visibleCount > pageSize);
        }
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
        updateToolbarIntro(filterValue);

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
        updateFilterSwipeState();
    }

    async function resetGalleryToFirstPage() {
        if (!galleryGrid || !getFilterButtons().length) return;

        visibleCount = pageSize;
        await ensureGalleryItems();
        applyFilter(activeFilter || normalizeFilterValue(filterFromUrl), true);
    }

    function animateProofCounter() {
        if (!proofCounterElement) return;
        if (proofCounterElement.dataset.counterAnimated === 'true') return;
        proofCounterElement.dataset.counterAnimated = 'true';

        const rawValue = proofCounterElement.textContent || '200+';
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
            proofCounterElement.textContent = Math.floor(currentNumber) + suffix;
        }, interval);
    }

    function revealProofSection() {
        if (proofSectionElement) {
            proofSectionElement.classList.add('is-proof-visible');
        }
        window.setTimeout(() => {
            animateProofCounter();
        }, 180);
    }

    function setupProofCounter() {
        if (!proofCounterElement) return;

        if (!proofSectionElement || typeof IntersectionObserver !== 'function') {
            revealProofSection();
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                revealProofSection();
                observer.disconnect();
            });
        }, {
            threshold: 0.35
        });

        observer.observe(proofSectionElement);
    }

    document.addEventListener('click', async (event) => {
        const filterButton = event.target.closest('[data-gallery-filters] .filter-btn');
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

        const backToFiltersButton = event.target.closest('[data-gallery-back-to-filters]');
        if (backToFiltersButton) {
            const filtersShell = getFiltersShell();
            if (filtersShell) {
                filtersShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        const collapseButton = event.target.closest('[data-gallery-collapse]');
        if (collapseButton) {
            visibleCount = pageSize;
            applyFilter(activeFilter, false);
            const filtersShell = getFiltersShell() || galleryGrid;
            if (filtersShell) {
                window.setTimeout(() => {
                    filtersShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 40);
            }
            return;
        }

        const filterLink = event.target.closest('a[data-filter]');
        if (filterLink) {
            event.preventDefault();
            await ensureGalleryItems();
            const filterValue = filterLink.getAttribute('data-filter') || 'all';
            applyFilter(filterValue, true);
            const filters = document.querySelector('[data-gallery-filters]');
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
            setupProofCounter();
            return;
        }

        visibleCount = pageSize;
        const items = await ensureGalleryItems();
        if (items.length) {
            applyFilter(normalizeFilterValue(filterFromUrl), true);
        }

        bindFilterSwipeState();
        setupProofCounter();
    }

    window.addEventListener('pageshow', (event) => {
        if (!event.persisted) return;
        resetGalleryToFirstPage();
    });

    initializeGallery();
});
