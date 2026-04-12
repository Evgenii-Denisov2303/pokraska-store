document.addEventListener('DOMContentLoaded', function() {
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
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');
    const counterElement = document.querySelector('.counter-number');
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromUrl = urlParams.get('filter');

    function getFilterButtons() {
        return Array.from(document.querySelectorAll('.gallery-filters .filter-btn'));
    }

    function getGalleryItems() {
        return Array.from(document.querySelectorAll('.gallery-grid .gallery-item'));
    }

    function getShowMoreBtn() {
        return document.querySelector('.gallery-show-more');
    }

    function setActiveFilterButton(filterValue) {
        getFilterButtons().forEach((button) => {
            button.classList.toggle('active', button.getAttribute('data-filter') === filterValue);
        });
    }

    function hideItem(item) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.95)';
        if (hideTimeouts.has(item)) {
            clearTimeout(hideTimeouts.get(item));
        }
        const timeoutId = setTimeout(() => {
            item.style.display = 'none';
        }, 300);
        hideTimeouts.set(item, timeoutId);
    }

    function showItem(item, index) {
        if (hideTimeouts.has(item)) {
            clearTimeout(hideTimeouts.get(item));
            hideTimeouts.delete(item);
        }
        if (item.style.display === 'none') {
            item.style.display = 'block';
        }
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, index * 50);
    }

    function updateShowMore(totalItems) {
        const showMoreBtn = getShowMoreBtn();
        if (!showMoreBtn) return;
        showMoreBtn.style.display = totalItems > visibleCount ? 'inline-flex' : 'none';
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
        const buttons = getFilterButtons();
        const galleryItems = getGalleryItems();
        if (!buttons.length || !galleryItems.length) return;

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

    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
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
        const increment = finalNumber / 100;
        const duration = 2000;
        const interval = duration / 100;

        const counterInterval = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(counterInterval);
            }
            counterElement.textContent = Math.floor(currentNumber) + suffix;
        }, interval);
    }

    document.addEventListener('click', function(event) {
        const filterButton = event.target.closest('.gallery-filters .filter-btn');
        if (filterButton) {
            const filterValue = filterButton.getAttribute('data-filter') || 'all';
            applyFilter(filterValue, true);

            const newUrl = filterValue === 'all'
                ? 'gallery.html'
                : `gallery.html?filter=${filterValue}`;
            history.pushState(null, '', newUrl);
            return;
        }

        const showMoreBtn = event.target.closest('.gallery-show-more');
        if (showMoreBtn) {
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
                filters.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            return;
        }

        const zoomButton = event.target.closest('.zoom-btn');
        if (zoomButton) {
            event.preventDefault();
            if (!modal || !modalImg) return;
            const imgSrc = zoomButton.getAttribute('href');
            modalImg.src = imgSrc;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            return;
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeModal();
        }
    });

    document.addEventListener('pokraska:gallery-updated', function() {
        getGalleryItems().forEach(syncGalleryCardMeta);
        const buttons = getFilterButtons();
        const availableValues = new Set(buttons.map((button) => button.getAttribute('data-filter')));
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
