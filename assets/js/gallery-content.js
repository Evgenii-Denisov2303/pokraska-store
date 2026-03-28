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

            registerInlineBindings(content);
        } catch (error) {
            console.warn('Failed to apply gallery content', error);
        }
    });
})();
