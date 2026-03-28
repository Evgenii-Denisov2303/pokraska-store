(function() {
    function queueInlineBindings(config) {
        window.PokraskaQueueInlineBindings?.(config);
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderButton(action, className) {
        return `
            <a href="${escapeHtml(action.href || '#')}" class="${escapeHtml(className)}">
                <i class="${escapeHtml(action.icon || '')}" aria-hidden="true"></i> ${escapeHtml(action.label || '')}
            </a>
        `;
    }

    function renderActionNode(anchor, action, className) {
        if (!anchor) return;

        anchor.className = className;
        anchor.setAttribute('href', action?.href || '#');
        anchor.innerHTML = `<i class="${escapeHtml(action?.icon || '')}" aria-hidden="true"></i> ${escapeHtml(action?.label || '')}`;
    }

    function renderHeadingWithIcon(element, iconClass, text) {
        if (!element) return;
        element.innerHTML = `<i class="${escapeHtml(iconClass || '')}" aria-hidden="true"></i> ${escapeHtml(text || '')}`;
    }

    function setTextWithIcon(element, text) {
        if (!element) return;
        const icon = element.querySelector('i');
        const iconHtml = icon ? icon.outerHTML : '';
        element.innerHTML = `${iconHtml} ${escapeHtml(text || '')}`.trim();
    }

    function extractGalleryImageData(itemElement) {
        const image = itemElement?.querySelector('.gallery-image img');
        const zoomLink = itemElement?.querySelector('.zoom-btn');
        return {
            src: zoomLink?.getAttribute('href') || image?.getAttribute('src') || '',
            previewSrc: image?.getAttribute('src') || zoomLink?.getAttribute('href') || '',
            zoomSrc: zoomLink?.getAttribute('href') || image?.getAttribute('src') || '',
            alt: image?.getAttribute('alt') || '',
            zoomTitle: zoomLink?.getAttribute('title') || image?.getAttribute('alt') || '',
            width: Number(image?.getAttribute('width')) || null,
            height: Number(image?.getAttribute('height')) || null
        };
    }

    function extractGalleryItemData(itemElement) {
        return {
            category: itemElement?.dataset.category || '',
            categoryLabel: itemElement?.querySelector('.overlay-title')?.textContent?.trim() || '',
            title: itemElement?.querySelector('.work-title')?.textContent?.trim()
                || itemElement?.querySelector('.overlay-tag')?.textContent?.trim()
                || '',
            image: extractGalleryImageData(itemElement)
        };
    }

    function applyGalleryImage(itemElement, imageData) {
        if (!itemElement || !imageData) return;

        const image = itemElement.querySelector('.gallery-image img');
        const zoomLink = itemElement.querySelector('.zoom-btn');
        const nextPreviewSrc = imageData.previewSrc || imageData.src || '';
        const nextZoomSrc = imageData.zoomSrc || imageData.src || '';
        const nextAlt = imageData.alt || '';
        const nextTitle = imageData.zoomTitle || nextAlt || '';

        if (image) {
            image.setAttribute('src', nextPreviewSrc);
            image.setAttribute('alt', nextAlt);
            if (imageData.width) image.setAttribute('width', Number(imageData.width));
            if (imageData.height) image.setAttribute('height', Number(imageData.height));
        }

        if (zoomLink) {
            zoomLink.setAttribute('href', nextZoomSrc);
            zoomLink.setAttribute('title', nextTitle);
        }
    }

    function applyGalleryItem(itemElement, itemData) {
        if (!itemElement || !itemData) return;

        if (itemData.category) {
            itemElement.dataset.category = itemData.category;
        }

        const categoryLabel = itemData.categoryLabel || '';
        const title = itemData.title || '';
        const overlayTitle = itemElement.querySelector('.overlay-title');
        const overlayTag = itemElement.querySelector('.overlay-tag');
        const workCategory = itemElement.querySelector('.work-category');
        const workTitle = itemElement.querySelector('.work-title');

        if (overlayTitle) overlayTitle.textContent = categoryLabel;
        if (overlayTag) overlayTag.textContent = title;
        if (workCategory) setTextWithIcon(workCategory, categoryLabel);
        if (workTitle) workTitle.textContent = title;

        applyGalleryImage(itemElement, itemData.image);
    }

    function syncGalleryItems(items) {
        if (!Array.isArray(items) || !items.length) return;
        document.querySelectorAll('.gallery-grid .gallery-item').forEach((itemElement, index) => {
            const itemData = items[index];
            if (!itemData) return;
            applyGalleryItem(itemElement, itemData);
        });
    }

    function registerInlineBindings(content) {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const headerTitle = document.querySelector('.gallery-header h1');
        const headerSubtitle = document.querySelector('.gallery-header .subtitle');
        const showMoreButton = document.querySelector('.gallery-show-more');
        const counterNumber = document.querySelector('.counter-number');
        const counterText = document.querySelector('.counter-text');
        const ctaButtons = document.querySelectorAll('.order-cta a');

        if (headerTitle) {
            bindings.push({
                path: 'header.title',
                type: 'text',
                label: 'Заголовок галереи',
                element: headerTitle,
                render(value, binding) {
                    binding.elements.forEach((element) => renderHeadingWithIcon(element, 'fas fa-images', value));
                }
            });
        }

        if (headerSubtitle) {
            bindings.push({ path: 'header.subtitle', type: 'textarea', label: 'Подзаголовок галереи', element: headerSubtitle });
        }

        document.querySelectorAll('.gallery-filters .filter-btn').forEach((button, index) => {
            bindings.push({
                path: `filters.${index}.label`,
                type: 'text',
                label: `Название фильтра ${index + 1}`,
                element: button,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        const icon = element.querySelector('i');
                        const iconHtml = icon ? icon.outerHTML : '';
                        element.innerHTML = `${iconHtml} ${escapeHtml(value || '')}`.trim();
                    });
                }
            });
        });

        if (showMoreButton) {
            bindings.push({ path: 'showMoreLabel', type: 'text', label: 'Текст кнопки "Показать еще"', element: showMoreButton });
        }

        if (counterNumber) {
            bindings.push({ path: 'counter.value', type: 'text', label: 'Число в счетчике галереи', element: counterNumber });
        }

        if (counterText) {
            bindings.push({ path: 'counter.text', type: 'textarea', label: 'Описание под счетчиком галереи', element: counterText });
        }

        if (ctaButtons[0]) {
            bindings.push({
                path: 'cta.primary',
                type: 'object',
                label: 'Главная кнопка под галереей',
                element: ctaButtons[0],
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderActionNode(element, value || {}, 'btn btn-primary'));
                }
            });
        }

        if (ctaButtons[1]) {
            bindings.push({
                path: 'cta.secondary',
                type: 'object',
                label: 'Вторая кнопка под галереей',
                element: ctaButtons[1],
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderActionNode(element, value || {}, 'btn btn-secondary'));
                }
            });
        }

        const galleryItems = Array.from(document.querySelectorAll('.gallery-grid .gallery-item'));
        const extractedItems = galleryItems.map((itemElement) => extractGalleryItemData(itemElement));

        window.PokraskaInlineContentDefaults = window.PokraskaInlineContentDefaults || {};
        window.PokraskaInlineContentDefaults.gallery = {
            ...(window.PokraskaInlineContentDefaults.gallery || {}),
            items: extractedItems
        };

        galleryItems.forEach((itemElement, index) => {
            const imageElement = itemElement.querySelector('.gallery-image img');
            const defaultItem = extractedItems[index];
            if (!defaultItem) return;

            bindings.push({
                path: `items.${index}`,
                type: 'object',
                label: `Карточка галереи ${index + 1}`,
                hint: `${defaultItem.categoryLabel || 'Работа'} · ${defaultItem.title || 'Без названия'}`,
                editorKindLabel: 'Карточка на странице',
                element: itemElement,
                defaultValue: defaultItem,
                fields: [
                    { key: 'categoryLabel', label: 'Название категории', type: 'text' },
                    { key: 'title', label: 'Название работы', type: 'text' },
                    { key: 'image.alt', label: 'Alt изображения', type: 'text' },
                    { key: 'image.zoomTitle', label: 'Подпись при открытии', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => applyGalleryItem(element, value || defaultItem));
                }
            });

            if (imageElement) {
                bindings.push({
                    path: `items.${index}.image`,
                    type: 'image',
                    label: `Фото галереи ${index + 1}`,
                    hint: `${defaultItem.categoryLabel || 'Работа'} · ${defaultItem.title || 'Фото'}`,
                    editorKindLabel: 'Фото на странице',
                    element: imageElement,
                    defaultValue: defaultItem.image,
                    directory: 'assets/images/gallery',
                    fields: [
                        { key: 'alt', label: 'Alt изображения', type: 'text' },
                        { key: 'zoomTitle', label: 'Подпись при открытии', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            const card = element.closest('.gallery-item');
                            applyGalleryImage(card, value || defaultItem.image);
                        });
                    }
                });
            }
        });

        if (!bindings.length) return;

        queueInlineBindings({
            fileName: 'gallery',
            sectionKey: 'gallery',
            sectionLabel: 'Галерея работ',
            bindings
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;
        if (!document.querySelector('.gallery-page')) return;

        try {
            const content = await window.PokraskaContent.loadContentFile('gallery');

            const header = document.querySelector('.gallery-header');
            if (header) {
                const title = header.querySelector('h1');
                const subtitle = header.querySelector('.subtitle');
                if (title) {
                    title.innerHTML = `<i class="fas fa-images"></i> ${escapeHtml(content.header?.title || '')}`;
                }
                if (subtitle) {
                    subtitle.textContent = content.header?.subtitle || '';
                }
            }

            const filters = document.querySelector('.gallery-filters');
            if (filters) {
                filters.innerHTML = (content.filters || []).map((filter) => `
                    <button class="filter-btn${filter.value === 'all' ? ' active' : ''}" data-filter="${escapeHtml(filter.value || 'all')}">
                        <i class="${escapeHtml(filter.icon || '')}" aria-hidden="true"></i> ${escapeHtml(filter.label || '')}
                    </button>
                `).join('');
            }

            const showMoreButton = document.querySelector('.gallery-show-more');
            if (showMoreButton) {
                showMoreButton.textContent = content.showMoreLabel || '';
            }

            const counterNumber = document.querySelector('.counter-number');
            const counterText = document.querySelector('.counter-text');
            if (counterNumber) counterNumber.textContent = content.counter?.value || '';
            if (counterText) counterText.textContent = content.counter?.text || '';

            const cta = document.querySelector('.order-cta');
            if (cta) {
                cta.innerHTML = [
                    renderButton(content.cta?.primary || {}, 'btn btn-primary'),
                    renderButton(content.cta?.secondary || {}, 'btn btn-secondary')
                ].join('');
            }

            if (Array.isArray(content.items) && content.items.length) {
                syncGalleryItems(content.items);
            }

            registerInlineBindings(content);
        } catch (error) {
            console.warn('Failed to apply gallery content', error);
        }
    });
})();
