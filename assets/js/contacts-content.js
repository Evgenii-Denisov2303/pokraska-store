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

    function renderAction(action) {
        const className = action.style === 'primary' ? 'btn btn-primary' : 'btn btn-outline';
        const external = action.href?.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `
            <a class="${className}" href="${escapeHtml(action.href || '#')}"${external}>
                <i class="${escapeHtml(action.icon || '')}" aria-hidden="true"></i> ${escapeHtml(action.label || '')}
            </a>
        `;
    }

    function renderActionNode(anchor, action) {
        if (!anchor) return;
        const className = action.style === 'primary' ? 'btn btn-primary' : 'btn btn-outline';
        const external = action.href?.startsWith('http');

        anchor.className = className;
        anchor.setAttribute('href', action.href || '#');
        if (external) {
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
        } else {
            anchor.removeAttribute('target');
            anchor.removeAttribute('rel');
        }

        anchor.innerHTML = `<i class="${escapeHtml(action.icon || '')}" aria-hidden="true"></i> ${escapeHtml(action.label || '')}`;
    }

    function applyActionButton(node, item) {
        if (!node || !item) return;
        renderActionNode(node, item);
    }

    function resetInlineMarkers(root) {
        if (!root) return;
        root.removeAttribute('data-inline-edit-id');
        root.removeAttribute('data-inline-edit-label');
        root.classList.remove('p-inline-active', 'p-inline-dirty');
        root.querySelectorAll('[data-inline-edit-id]').forEach((element) => {
            element.removeAttribute('data-inline-edit-id');
            element.removeAttribute('data-inline-edit-label');
            element.classList.remove('p-inline-active', 'p-inline-dirty');
        });
    }

    function syncCollection(container, itemSelector, items, applyItem) {
        const nodes = container ? Array.from(container.querySelectorAll(itemSelector)) : [];
        if (!container || !nodes.length) return;

        const safeItems = Array.isArray(items) ? items : [];
        const template = nodes[0];
        while (container.querySelectorAll(itemSelector).length < safeItems.length) {
            const clone = template.cloneNode(true);
            resetInlineMarkers(clone);
            clone.hidden = false;
            container.appendChild(clone);
        }

        const nextNodes = Array.from(container.querySelectorAll(itemSelector));
        nextNodes.forEach((node, index) => {
            const item = safeItems[index];
            node.hidden = !item;
            if (item) {
                applyItem(node, item, index);
            }
        });
    }

    function applyHeroFact(node, item) {
        if (!node || !item) return;
        const label = node.querySelector('.contacts-fact__label');
        const title = node.querySelector('strong');
        const text = node.querySelector('p');
        if (label) label.textContent = item.label || '';
        if (title) title.textContent = item.title || '';
        if (text) text.textContent = item.text || '';
    }

    function applyOverviewItem(node, item) {
        if (!node || !item) return;
        const icon = node.querySelector('.contact-icon i');
        const title = node.querySelector('.contact-details h3');
        const value = node.querySelector('.contact-details p');
        const noteIcon = node.querySelector('.contact-note i');
        const noteText = node.querySelector('.contact-note span');
        if (icon) icon.className = item.icon || '';
        if (title) title.textContent = item.title || '';
        if (value) value.innerHTML = item.valueHtml || '';
        if (noteIcon) noteIcon.className = item.noteIcon || '';
        if (noteText) noteText.textContent = item.note || '';
    }

    function applyHoursItem(node, item) {
        if (!node || !item) return;
        const day = node.querySelector('.day');
        const time = node.querySelector('.time');
        node.classList.toggle('special-note', Boolean(item.icon));
        if (day) {
            day.innerHTML = `${item.icon ? `<i class="${escapeHtml(item.icon)}"></i> ` : ''}${escapeHtml(item.day || '')}`;
        }
        if (time) time.textContent = item.time || '';
    }

    function applyTrustItem(node, item) {
        if (!node || !item) return;
        const icon = node.querySelector('i');
        const text = node.querySelector('span');
        if (icon) icon.className = item.icon || '';
        if (text) text.textContent = item.text || '';
    }

    function applyLocationBadge(node, item) {
        if (!node || !item) return;
        const icon = node.querySelector('i');
        if (icon) icon.className = item.icon || '';
        node.innerHTML = `<i class="${escapeHtml(item.icon || '')}" aria-hidden="true"></i> ${escapeHtml(item.text || '')}`;
    }

    function applyLocationPoint(node, item) {
        if (!node || !item) return;
        const title = node.querySelector('strong');
        const text = node.querySelector('span');
        if (title) title.textContent = item.title || '';
        if (text) text.textContent = item.text || '';
    }

    function registerInlineBindings() {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const heroTitle = document.querySelector('.contacts-title');
        const heroSubtitle = document.querySelector('.contacts-subtitle');
        const heroEyebrow = document.querySelector('.contacts-eyebrow');
        const connectTitle = document.querySelector('.contact-form-card .contacts-card-header h2');
        const connectNotice = document.querySelector('.contact-form-card .form-notice');
        const overviewTitle = document.querySelector('.contact-info-card .contacts-card-header h2');
        const overviewText = document.querySelector('.contact-info-card .contacts-card-header p:last-of-type');
        const locationTitle = document.querySelector('.contacts-location-card .contacts-location-copy h2');
        const locationText = document.querySelector('.contacts-location-card .contacts-location-copy > p:last-of-type');

        if (heroTitle) bindings.push({ path: 'hero.title', type: 'text', label: 'Заголовок страницы контактов', element: heroTitle });
        if (heroSubtitle) bindings.push({ path: 'hero.subtitle', type: 'textarea', label: 'Подзаголовок страницы контактов', element: heroSubtitle });
        if (heroEyebrow) bindings.push({ path: 'hero.eyebrow', type: 'text', label: 'Надзаголовок контактов', element: heroEyebrow });
        if (overviewTitle) bindings.push({ path: 'overview.title', type: 'text', label: 'Заголовок основного блока контактов', element: overviewTitle });
        if (overviewText) bindings.push({ path: 'overview.text', type: 'textarea', label: 'Описание в основном блоке контактов', element: overviewText });
        if (connectTitle) bindings.push({ path: 'connect.title', type: 'text', label: 'Заголовок блока быстрой связи', element: connectTitle });
        if (connectNotice) bindings.push({ path: 'connect.notice', type: 'textarea', label: 'Пояснение над формой', element: connectNotice });
        if (locationTitle) bindings.push({ path: 'location.title', type: 'text', label: 'Заголовок блока схемы проезда', element: locationTitle });
        if (locationText) bindings.push({ path: 'location.text', type: 'textarea', label: 'Описание блока схемы проезда', element: locationText });

        const buildHeroFactBinding = (targetItem, index) => ({
            path: `hero.facts.${index}`,
            type: 'object',
            editorKindLabel: 'Факт на странице',
            label: `Факт в первом экране контактов ${index + 1}`,
            element: targetItem,
            collectionPath: 'hero.facts',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.contacts-facts .contacts-fact')[nextIndex];
                if (!nextItem) return null;
                return buildHeroFactBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    label: 'Новая метка',
                    title: 'Новый факт',
                    text: 'Короткое описание факта.'
                };
            },
            fields: [
                { key: 'label', label: 'Метка', type: 'text' },
                { key: 'title', label: 'Заголовок', type: 'text' },
                { key: 'text', label: 'Описание', type: 'textarea' }
            ],
            collectionRender(items) {
                const container = document.querySelector('.contacts-facts');
                if (!container) return;
                syncCollection(container, '.contacts-fact', Array.isArray(items) ? items : [], applyHeroFact);
            },
            render(value, binding) {
                binding.elements.forEach((element) => applyHeroFact(element, value || {}));
            }
        });

        document.querySelectorAll('.contacts-facts .contacts-fact').forEach((factElement, index) => {
            const label = factElement.querySelector('.contacts-fact__label');
            const title = factElement.querySelector('strong');
            const text = factElement.querySelector('p');
            bindings.push(buildHeroFactBinding(factElement, index));
            if (label) bindings.push({ path: `hero.facts.${index}.label`, type: 'text', label: `Факт контактов ${index + 1}: метка`, element: label });
            if (title) bindings.push({ path: `hero.facts.${index}.title`, type: 'text', label: `Факт контактов ${index + 1}: заголовок`, element: title });
            if (text) bindings.push({ path: `hero.facts.${index}.text`, type: 'textarea', label: `Факт контактов ${index + 1}: описание`, element: text });
        });

        const buildOverviewItemBinding = (targetItem, index) => ({
            path: `overview.items.${index}`,
            type: 'object',
            editorKindLabel: 'Контакт на странице',
            label: `Карточка контакта ${index + 1}`,
            element: targetItem,
            collectionPath: 'overview.items',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.contacts-overview-list .contact-item')[nextIndex];
                if (!nextItem) return null;
                return buildOverviewItemBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    icon: 'fas fa-phone',
                    title: 'Новый контакт',
                    valueHtml: 'Новая контактная информация',
                    noteIcon: 'fas fa-info-circle',
                    note: 'Короткая подсказка'
                };
            },
            fields: [
                { key: 'icon', label: 'Иконка', type: 'text' },
                { key: 'title', label: 'Заголовок', type: 'text' },
                { key: 'valueHtml', label: 'Основной текст / HTML', type: 'html' },
                { key: 'noteIcon', label: 'Иконка примечания', type: 'text' },
                { key: 'note', label: 'Примечание', type: 'textarea' }
            ],
            collectionRender(items) {
                const container = document.querySelector('.contacts-overview-list');
                if (!container) return;
                syncCollection(container, '.contact-item', Array.isArray(items) ? items : [], applyOverviewItem);
            },
            render(value, binding) {
                binding.elements.forEach((element) => applyOverviewItem(element, value || {}));
            }
        });

        document.querySelectorAll('.contacts-overview-list .contact-item').forEach((itemElement, index) => {
            const title = itemElement.querySelector('.contact-details h3');
            const note = itemElement.querySelector('.contact-note span');
            bindings.push(buildOverviewItemBinding(itemElement, index));
            if (title) bindings.push({ path: `overview.items.${index}.title`, type: 'text', label: `Карточка контакта ${index + 1}: заголовок`, element: title });
            if (note) bindings.push({ path: `overview.items.${index}.note`, type: 'textarea', label: `Карточка контакта ${index + 1}: примечание`, element: note });
        });

        const managerKicker = document.querySelector('.contact-manager-card .contacts-card-kicker');
        const managerTitle = document.querySelector('.contact-manager-card h3');
        const managerText = document.querySelector('.contact-manager-card p:last-of-type');
        if (managerKicker) bindings.push({ path: 'overview.manager.kicker', type: 'text', label: 'Подпись блока менеджера', element: managerKicker });
        if (managerTitle) bindings.push({ path: 'overview.manager.title', type: 'text', label: 'Имя менеджера', element: managerTitle });
        if (managerText) bindings.push({ path: 'overview.manager.text', type: 'textarea', label: 'Описание менеджера', element: managerText });

        const hoursTitle = document.querySelector('.working-hours h3');
        if (hoursTitle) bindings.push({ path: 'overview.hours.title', type: 'text', label: 'Заголовок режима работы', element: hoursTitle });
        const buildHoursItemBinding = (targetItem, index) => ({
            path: `overview.hours.items.${index}`,
            type: 'object',
            editorKindLabel: 'Пункт на странице',
            label: `Пункт режима работы ${index + 1}`,
            element: targetItem,
            collectionPath: 'overview.hours.items',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.hours-list li')[nextIndex];
                if (!nextItem) return null;
                return buildHoursItemBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    day: 'Новый день',
                    time: '09:00 - 18:00',
                    icon: 'fas fa-clock'
                };
            },
            fields: [
                { key: 'day', label: 'День / подпись', type: 'text' },
                { key: 'time', label: 'Время / текст', type: 'text' },
                { key: 'icon', label: 'Иконка', type: 'text' }
            ],
            collectionRender(items) {
                const container = document.querySelector('.hours-list');
                if (!container) return;
                syncCollection(container, 'li', Array.isArray(items) ? items : [], applyHoursItem);
            },
            render(value, binding) {
                binding.elements.forEach((element) => applyHoursItem(element, value || {}));
            }
        });

        document.querySelectorAll('.hours-list li').forEach((itemElement, index) => {
            const day = itemElement.querySelector('.day');
            const time = itemElement.querySelector('.time');
            bindings.push(buildHoursItemBinding(itemElement, index));
            if (day) bindings.push({ path: `overview.hours.items.${index}.day`, type: 'text', label: `Режим работы ${index + 1}: день`, element: day });
            if (time) bindings.push({ path: `overview.hours.items.${index}.time`, type: 'text', label: `Режим работы ${index + 1}: время`, element: time });
        });

        const buildConnectActionBinding = (targetItem, index) => ({
            path: `connect.actions.${index}`,
            type: 'object',
            editorKindLabel: 'Кнопка на странице',
            label: `Кнопка быстрой связи ${index + 1}`,
            element: targetItem,
            collectionPath: 'connect.actions',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.contact-form-card .quick-actions a')[nextIndex];
                if (!nextItem) return null;
                return buildConnectActionBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    label: 'Новая кнопка',
                    href: '#',
                    icon: 'fas fa-link',
                    style: 'outline'
                };
            },
            fields: [
                { key: 'label', label: 'Текст', type: 'text' },
                { key: 'href', label: 'Ссылка', type: 'text' },
                { key: 'icon', label: 'Иконка', type: 'text' },
                { key: 'style', label: 'Стиль (primary/outline)', type: 'text' }
            ],
            collectionRender(items) {
                const container = document.querySelector('.contact-form-card .quick-actions');
                if (!container) return;
                syncCollection(container, 'a', Array.isArray(items) ? items : [], applyActionButton);
            },
            render(value, binding) {
                binding.elements.forEach((element) => renderActionNode(element, value || {}));
            }
        });

        document.querySelectorAll('.contact-form-card .quick-actions a').forEach((anchor, index) => {
            bindings.push(buildConnectActionBinding(anchor, index));
        });

        const buildTrustItemBinding = (targetItem, index) => ({
            path: `connect.trustItems.${index}`,
            type: 'object',
            editorKindLabel: 'Пункт на странице',
            label: `Пункт доверия ${index + 1}`,
            element: targetItem,
            collectionPath: 'connect.trustItems',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.contact-trust .contact-trust__item')[nextIndex];
                if (!nextItem) return null;
                return buildTrustItemBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    icon: 'fas fa-check-circle',
                    text: 'Новый пункт доверия'
                };
            },
            fields: [
                { key: 'icon', label: 'Иконка', type: 'text' },
                { key: 'text', label: 'Текст', type: 'textarea' }
            ],
            collectionRender(items) {
                const container = document.querySelector('.contact-trust');
                if (!container) return;
                syncCollection(container, '.contact-trust__item', Array.isArray(items) ? items : [], applyTrustItem);
            },
            render(value, binding) {
                binding.elements.forEach((element) => applyTrustItem(element, value || {}));
            }
        });

        document.querySelectorAll('.contact-trust .contact-trust__item').forEach((itemElement, index) => {
            const text = itemElement.querySelector('span');
            bindings.push(buildTrustItemBinding(itemElement, index));
            if (text) bindings.push({ path: `connect.trustItems.${index}.text`, type: 'textarea', label: `Пункт доверия ${index + 1}: текст`, element: text });
        });

        const locationKicker = document.querySelector('.contacts-location-copy .contacts-card-kicker');
        if (locationKicker) bindings.push({ path: 'location.kicker', type: 'text', label: 'Надзаголовок блока схемы проезда', element: locationKicker });
        const buildLocationBadgeBinding = (targetItem, index) => ({
            path: `location.badges.${index}`,
            type: 'object',
            editorKindLabel: 'Плашка на странице',
            label: `Плашка локации ${index + 1}`,
            element: targetItem,
            collectionPath: 'location.badges',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.location-badges .location-badge')[nextIndex];
                if (!nextItem) return null;
                return buildLocationBadgeBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    icon: 'fas fa-location-dot',
                    text: 'Новая плашка'
                };
            },
            fields: [
                { key: 'icon', label: 'Иконка', type: 'text' },
                { key: 'text', label: 'Текст', type: 'text' }
            ],
            collectionRender(items) {
                const container = document.querySelector('.location-badges');
                if (!container) return;
                syncCollection(container, '.location-badge', Array.isArray(items) ? items : [], applyLocationBadge);
            },
            render(value, binding) {
                binding.elements.forEach((element) => applyLocationBadge(element, value || {}));
            }
        });

        document.querySelectorAll('.location-badges .location-badge').forEach((badgeElement, index) => {
            bindings.push(buildLocationBadgeBinding(badgeElement, index));
        });

        const buildLocationPointBinding = (targetItem, index) => ({
            path: `location.points.${index}`,
            type: 'object',
            editorKindLabel: 'Точка на странице',
            label: `Точка маршрута ${index + 1}`,
            element: targetItem,
            collectionPath: 'location.points',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.location-points li')[nextIndex];
                if (!nextItem) return null;
                return buildLocationPointBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    title: 'Новая точка',
                    text: 'Короткое описание маршрута'
                };
            },
            fields: [
                { key: 'title', label: 'Заголовок', type: 'text' },
                { key: 'text', label: 'Описание', type: 'textarea' }
            ],
            collectionRender(items) {
                const container = document.querySelector('.location-points');
                if (!container) return;
                syncCollection(container, 'li', Array.isArray(items) ? items : [], applyLocationPoint);
            },
            render(value, binding) {
                binding.elements.forEach((element) => applyLocationPoint(element, value || {}));
            }
        });

        document.querySelectorAll('.location-points li').forEach((pointElement, index) => {
            const title = pointElement.querySelector('strong');
            const text = pointElement.querySelector('span');
            bindings.push(buildLocationPointBinding(pointElement, index));
            if (title) bindings.push({ path: `location.points.${index}.title`, type: 'text', label: `Точка маршрута ${index + 1}: заголовок`, element: title });
            if (text) bindings.push({ path: `location.points.${index}.text`, type: 'textarea', label: `Точка маршрута ${index + 1}: описание`, element: text });
        });

        const buildLocationActionBinding = (targetItem, index) => ({
            path: `location.actions.${index}`,
            type: 'object',
            editorKindLabel: 'Кнопка на странице',
            label: `Кнопка маршрута ${index + 1}`,
            element: targetItem,
            collectionPath: 'location.actions',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.location-actions a')[nextIndex];
                if (!nextItem) return null;
                return buildLocationActionBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    label: 'Новая кнопка',
                    href: '#',
                    icon: 'fas fa-route',
                    style: 'outline'
                };
            },
            fields: [
                { key: 'label', label: 'Текст', type: 'text' },
                { key: 'href', label: 'Ссылка', type: 'text' },
                { key: 'icon', label: 'Иконка', type: 'text' },
                { key: 'style', label: 'Стиль (primary/outline)', type: 'text' }
            ],
            collectionRender(items) {
                const container = document.querySelector('.location-actions');
                if (!container) return;
                syncCollection(container, 'a', Array.isArray(items) ? items : [], applyActionButton);
            },
            render(value, binding) {
                binding.elements.forEach((element) => renderActionNode(element, value || {}));
            }
        });

        document.querySelectorAll('.location-actions a').forEach((anchor, index) => {
            bindings.push(buildLocationActionBinding(anchor, index));
        });

        if (!bindings.length) return;

        queueInlineBindings({
            fileName: 'contacts',
            sectionKey: 'contacts',
            sectionLabel: 'Страница контактов',
            bindings
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;
        if (!document.querySelector('.contacts-page')) return;

        try {
            const content = await window.PokraskaContent.loadContentFile('contacts');

            const heroTitle = document.querySelector('.contacts-title');
            const heroSubtitle = document.querySelector('.contacts-subtitle');
            const heroEyebrow = document.querySelector('.contacts-eyebrow');
            const heroFacts = document.querySelector('.contacts-facts');
            if (heroTitle) heroTitle.textContent = content.hero?.title || '';
            if (heroSubtitle) heroSubtitle.textContent = content.hero?.subtitle || '';
            if (heroEyebrow) heroEyebrow.textContent = content.hero?.eyebrow || '';
            if (heroFacts) {
                heroFacts.innerHTML = (content.hero?.facts || []).map((item) => `
                    <article class="contacts-fact">
                        <span class="contacts-fact__label">${escapeHtml(item.label || '')}</span>
                        <strong>${escapeHtml(item.title || '')}</strong>
                        <p>${escapeHtml(item.text || '')}</p>
                    </article>
                `).join('');
            }

            const overviewCard = document.querySelector('.contact-info-card');
            if (overviewCard) {
                const kicker = overviewCard.querySelector('.contacts-card-header .contacts-card-kicker');
                const title = overviewCard.querySelector('.contacts-card-header h2');
                const text = overviewCard.querySelector('.contacts-card-header p:last-of-type');
                const list = overviewCard.querySelector('.contacts-overview-list');
                const manager = overviewCard.querySelector('.contact-manager-card');
                const hours = overviewCard.querySelector('.working-hours');

                if (kicker) kicker.textContent = content.overview?.kicker || '';
                if (title) title.textContent = content.overview?.title || '';
                if (text) text.textContent = content.overview?.text || '';

                if (list) {
                    list.innerHTML = (content.overview?.items || []).map((item) => `
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="${escapeHtml(item.icon || '')}"></i>
                            </div>
                            <div class="contact-details">
                                <h3>${escapeHtml(item.title || '')}</h3>
                                <p>${item.valueHtml || ''}</p>
                                <div class="contact-note">
                                    <i class="${escapeHtml(item.noteIcon || '')}"></i>
                                    <span>${escapeHtml(item.note || '')}</span>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }

                if (manager) {
                    const managerKicker = manager.querySelector('.contacts-card-kicker');
                    const managerTitle = manager.querySelector('h3');
                    const managerText = manager.querySelector('p:last-of-type');
                    if (managerKicker) managerKicker.textContent = content.overview?.manager?.kicker || '';
                    if (managerTitle) managerTitle.textContent = content.overview?.manager?.title || '';
                    if (managerText) managerText.textContent = content.overview?.manager?.text || '';
                }

                if (hours) {
                    const hoursTitle = hours.querySelector('h3');
                    const hoursList = hours.querySelector('.hours-list');
                    if (hoursTitle) {
                        hoursTitle.innerHTML = `<i class="fas fa-clock"></i> ${escapeHtml(content.overview?.hours?.title || '')}`;
                    }
                    if (hoursList) {
                        hoursList.innerHTML = (content.overview?.hours?.items || []).map((item) => `
                            <li${item.icon ? ' class="special-note"' : ''}>
                                <span class="day">${item.icon ? `<i class="${escapeHtml(item.icon)}"></i> ` : ''}${escapeHtml(item.day || '')}</span>
                                <span class="time">${escapeHtml(item.time || '')}</span>
                            </li>
                        `).join('');
                    }
                }
            }

            const connectCard = document.querySelector('.contact-form-card');
            if (connectCard) {
                const kicker = connectCard.querySelector('.contacts-card-header .contacts-card-kicker');
                const title = connectCard.querySelector('.contacts-card-header h2');
                const notice = connectCard.querySelector('.form-notice');
                const actions = connectCard.querySelector('.quick-actions');
                const trust = connectCard.querySelector('.contact-trust');
                const iframe = connectCard.querySelector('.yandex-form-embed');

                if (kicker) kicker.textContent = content.connect?.kicker || '';
                if (title) title.textContent = content.connect?.title || '';
                if (notice) notice.textContent = content.connect?.notice || '';
                if (actions) {
                    actions.innerHTML = (content.connect?.actions || []).map(renderAction).join('');
                }
                if (trust) {
                    trust.innerHTML = (content.connect?.trustItems || []).map((item) => `
                        <div class="contact-trust__item">
                            <i class="${escapeHtml(item.icon || '')}"></i>
                            <span>${escapeHtml(item.text || '')}</span>
                        </div>
                    `).join('');
                }
                if (iframe && content.connect?.iframeSrc) {
                    iframe.setAttribute('src', content.connect.iframeSrc);
                }
            }

            const locationCard = document.querySelector('.contacts-location-card');
            if (locationCard) {
                const kicker = locationCard.querySelector('.contacts-location-copy .contacts-card-kicker');
                const title = locationCard.querySelector('.contacts-location-copy h2');
                const text = locationCard.querySelector('.contacts-location-copy > p:last-of-type');
                const badges = locationCard.querySelector('.location-badges');
                const points = locationCard.querySelector('.location-points');
                const actions = locationCard.querySelector('.location-actions');
                const map = locationCard.querySelector('.map-container iframe');

                if (kicker) kicker.textContent = content.location?.kicker || '';
                if (title) title.textContent = content.location?.title || '';
                if (text) text.textContent = content.location?.text || '';
                if (badges) {
                    badges.innerHTML = (content.location?.badges || []).map((item) => `
                        <span class="location-badge"><i class="${escapeHtml(item.icon || '')}" aria-hidden="true"></i> ${escapeHtml(item.text || '')}</span>
                    `).join('');
                }
                if (points) {
                    points.innerHTML = (content.location?.points || []).map((item) => `
                        <li class="location-point">
                            <strong>${escapeHtml(item.title || '')}</strong>
                            <span>${escapeHtml(item.text || '')}</span>
                        </li>
                    `).join('');
                }
                if (actions) {
                    actions.innerHTML = (content.location?.actions || []).map(renderAction).join('');
                }
                if (map && content.location?.mapSrc) {
                    map.setAttribute('src', content.location.mapSrc);
                }
            }

            registerInlineBindings();
        } catch (error) {
            console.warn('Failed to apply contacts content', error);
        }
    });
})();
