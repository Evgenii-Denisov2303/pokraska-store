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

    const fallbackSiteContact = {
        primaryPhone: {
            label: '+7 (937) 615-46-29',
            href: 'tel:+79376154629'
        },
        secondaryPhone: {
            label: '+7 (962) 554-22-60',
            href: 'tel:+79625542260'
        },
        email: 'vorota404@mail.ru',
        address: 'Старое Победилово, ул. Садовая, 72'
    };

    async function loadSiteShellData() {
        if (window.POKRASKA_SITE_CONTENT) {
            return window.POKRASKA_SITE_CONTENT;
        }

        if (!window.PokraskaContent?.loadContentFile) {
            return null;
        }

        try {
            const site = await window.PokraskaContent.loadContentFile('site');
            window.POKRASKA_SITE_CONTENT = window.POKRASKA_SITE_CONTENT || site;
            return site;
        } catch (error) {
            return null;
        }
    }

    function getSiteContact(site) {
        return site?.contact || fallbackSiteContact;
    }

    function isPhoneLikeLabel(value) {
        return /^[+\d\s()\-]+$/.test(String(value || '').trim());
    }

    function isEmailLikeLabel(value) {
        return /@/.test(String(value || '').trim());
    }

    function applyContactReplacements(html, site) {
        const contact = getSiteContact(site);
        const primaryPhone = contact.primaryPhone || fallbackSiteContact.primaryPhone;
        const secondaryPhone = contact.secondaryPhone || fallbackSiteContact.secondaryPhone;
        const email = contact.email || fallbackSiteContact.email;
        const address = contact.address || fallbackSiteContact.address;
        const cityAddress = `Казань, ${address}`;

        return String(html || '')
            .replace(/tel:\+79376154629/gi, primaryPhone.href || 'tel:+79376154629')
            .replace(/tel:\+79625542260/gi, secondaryPhone.href || 'tel:+79625542260')
            .replace(/\+7\s*\(937\)\s*615-46-29/g, primaryPhone.label || '+7 (937) 615-46-29')
            .replace(/\+7\s*\(962\)\s*554-22-60/g, secondaryPhone.label || '+7 (962) 554-22-60')
            .replace(/mailto:vorota404@mail\.ru/gi, email ? `mailto:${email}` : 'mailto:vorota404@mail.ru')
            .replace(/vorota404@mail\.ru/gi, email || 'vorota404@mail.ru')
            .replace(/Казань,\s*Старое Победилово,\s*ул\.\s*Садовая,\s*72/gi, cityAddress)
            .replace(/Старое Победилово,\s*ул\.\s*Садовая,\s*72/gi, address);
    }

    function buildResolvedActions(actions, site) {
        const contact = getSiteContact(site);
        const primaryPhone = contact.primaryPhone || fallbackSiteContact.primaryPhone;
        const email = contact.email || fallbackSiteContact.email;

        return (Array.isArray(actions) ? actions : []).map((action) => {
            const nextAction = { ...(action || {}) };
            const href = String(nextAction.href || '').trim();
            if (href.startsWith('tel:')) {
                nextAction.href = primaryPhone.href || href;
                if (!nextAction.label || isPhoneLikeLabel(nextAction.label)) {
                    nextAction.label = primaryPhone.label || nextAction.label || '';
                }
                nextAction.icon = nextAction.icon || 'fas fa-phone';
            } else if (href.startsWith('mailto:')) {
                nextAction.href = email ? `mailto:${email}` : href;
                if (!nextAction.label || isEmailLikeLabel(nextAction.label)) {
                    nextAction.label = email || nextAction.label || '';
                }
                nextAction.icon = nextAction.icon || 'fas fa-envelope';
            }
            return nextAction;
        });
    }

    function buildResolvedContactsContent(content, site) {
        return {
            ...content,
            overview: {
                ...(content?.overview || {}),
                items: (content?.overview?.items || []).map((item) => ({
                    ...(item || {}),
                    valueHtml: applyContactReplacements(item?.valueHtml || '', site)
                }))
            },
            connect: {
                ...(content?.connect || {}),
                actions: buildResolvedActions(content?.connect?.actions || [], site)
            },
            location: {
                ...(content?.location || {}),
                actions: buildResolvedActions(content?.location?.actions || [], site)
            }
        };
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
        const heroTitle = document.querySelector('.contacts-hero-copy h2');
        const heroSubtitle = document.querySelector('.contacts-hero-copy p:last-of-type');
        const heroEyebrow = document.querySelector('.contacts-eyebrow');
        const overviewKicker = document.querySelector('.contact-info-card .contacts-card-header .contacts-card-kicker');
        const connectTitle = document.querySelector('.contact-form-card .contacts-card-header h2');
        const connectKicker = document.querySelector('.contact-form-card .contacts-card-header .contacts-card-kicker');
        const connectNotice = document.querySelector('.contact-form-card .form-notice');
        const overviewTitle = document.querySelector('.contact-info-card .contacts-card-header h2');
        const overviewText = document.querySelector('.contact-info-card .contacts-card-header p:last-of-type');
        const locationKicker = document.querySelector('.contacts-location-copy .contacts-card-kicker');
        const locationTitle = document.querySelector('.contacts-location-card .contacts-location-copy h2');
        const locationText = document.querySelector('.contacts-location-card .contacts-location-copy > p:last-of-type');

        if (heroTitle) bindings.push({ path: 'hero.title', type: 'text', label: 'Заголовок страницы контактов', element: heroTitle });
        if (heroSubtitle) bindings.push({ path: 'hero.subtitle', type: 'textarea', label: 'Подзаголовок страницы контактов', element: heroSubtitle });
        if (heroEyebrow) bindings.push({ path: 'hero.eyebrow', type: 'text', label: 'Надзаголовок контактов', element: heroEyebrow });
        if (overviewKicker) bindings.push({ path: 'overview.kicker', type: 'text', label: 'Надзаголовок основного блока контактов', element: overviewKicker });
        if (overviewTitle) bindings.push({ path: 'overview.title', type: 'text', label: 'Заголовок основного блока контактов', element: overviewTitle });
        if (overviewText) bindings.push({ path: 'overview.text', type: 'textarea', label: 'Описание в основном блоке контактов', element: overviewText });
        if (connectKicker) bindings.push({ path: 'connect.kicker', type: 'text', label: 'Надзаголовок блока заявки', element: connectKicker });
        if (connectTitle) bindings.push({ path: 'connect.title', type: 'text', label: 'Заголовок блока быстрой связи', element: connectTitle });
        if (connectNotice) bindings.push({ path: 'connect.notice', type: 'textarea', label: 'Пояснение над формой', element: connectNotice });
        if (locationKicker) bindings.push({ path: 'location.kicker', type: 'text', label: 'Надзаголовок блока схемы проезда', element: locationKicker });
        if (locationTitle) bindings.push({ path: 'location.title', type: 'text', label: 'Заголовок блока схемы проезда', element: locationTitle });
        if (locationText) bindings.push({ path: 'location.text', type: 'textarea', label: 'Описание блока схемы проезда', element: locationText });

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

        const buildConnectActionBinding = (targetItem, index) => ({
            path: `connect.actions.${index}`,
            type: 'object',
            editorKindLabel: 'Кнопка на странице',
            label: `Кнопка быстрой связи ${index + 1}`,
            element: targetItem,
            collectionPath: 'connect.actions',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.quick-actions--contacts a')[nextIndex];
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
                const container = document.querySelector('.quick-actions--contacts');
                if (!container) return;
                syncCollection(container, 'a', Array.isArray(items) ? items : [], applyActionButton);
            },
            render(value, binding) {
                binding.elements.forEach((element) => renderActionNode(element, value || {}));
            }
        });

        document.querySelectorAll('.quick-actions--contacts a').forEach((anchor, index) => {
            bindings.push(buildConnectActionBinding(anchor, index));
        });
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
            const [content, site] = await Promise.all([
                window.PokraskaContent.loadContentFile('contacts'),
                loadSiteShellData()
            ]);
            const resolvedContent = buildResolvedContactsContent(content || {}, site);

            const heroEyebrow = document.querySelector('.contacts-eyebrow');
            document.querySelectorAll('.contacts-title, .contacts-hero-copy h2').forEach((element) => {
                element.textContent = resolvedContent.hero?.title || '';
            });
            document.querySelectorAll('.contacts-subtitle, .contacts-hero-copy p:last-of-type').forEach((element) => {
                element.textContent = resolvedContent.hero?.subtitle || '';
            });
            if (heroEyebrow) heroEyebrow.textContent = resolvedContent.hero?.eyebrow || '';

            const overviewCard = document.querySelector('.contact-info-card');
            if (overviewCard) {
                const kicker = overviewCard.querySelector('.contacts-card-header .contacts-card-kicker');
                const title = overviewCard.querySelector('.contacts-card-header h2');
                const text = overviewCard.querySelector('.contacts-card-header p:last-of-type');
                const list = overviewCard.querySelector('.contacts-overview-list');

                if (kicker) kicker.textContent = resolvedContent.overview?.kicker || '';
                if (title) title.textContent = resolvedContent.overview?.title || '';
                if (text) text.textContent = resolvedContent.overview?.text || '';

                if (list && Array.isArray(resolvedContent.overview?.items) && resolvedContent.overview.items.length) {
                    list.innerHTML = (resolvedContent.overview?.items || []).map((item) => `
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
            }

            const connectCard = document.querySelector('.contact-form-card');
            if (connectCard) {
                const kicker = connectCard.querySelector('.contacts-card-header .contacts-card-kicker');
                const title = connectCard.querySelector('.contacts-card-header h2');
                const notice = connectCard.querySelector('.form-notice');
                const actions = document.querySelector('.quick-actions--contacts');
                const iframe = connectCard.querySelector('.yandex-form-embed');

                if (kicker) kicker.textContent = resolvedContent.connect?.kicker || '';
                if (title) title.textContent = resolvedContent.connect?.title || '';
                if (notice) notice.textContent = resolvedContent.connect?.notice || '';
                if (actions) {
                    actions.innerHTML = (resolvedContent.connect?.actions || []).map(renderAction).join('');
                }
                if (iframe && resolvedContent.connect?.iframeSrc) {
                    iframe.setAttribute('src', resolvedContent.connect.iframeSrc);
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

                if (kicker) kicker.textContent = resolvedContent.location?.kicker || '';
                if (title) title.textContent = resolvedContent.location?.title || '';
                if (text) text.textContent = resolvedContent.location?.text || '';
                if (badges) {
                    badges.innerHTML = (resolvedContent.location?.badges || []).map((item) => `
                        <span class="location-badge"><i class="${escapeHtml(item.icon || '')}" aria-hidden="true"></i> ${escapeHtml(item.text || '')}</span>
                    `).join('');
                }
                if (points) {
                    points.innerHTML = (resolvedContent.location?.points || []).map((item) => `
                        <li class="location-point">
                            <strong>${escapeHtml(item.title || '')}</strong>
                            <span>${escapeHtml(item.text || '')}</span>
                        </li>
                    `).join('');
                }
                if (actions) {
                    actions.innerHTML = (resolvedContent.location?.actions || []).map(renderAction).join('');
                }
                if (map && resolvedContent.location?.mapSrc) {
                    map.setAttribute('src', resolvedContent.location.mapSrc);
                }
            }

            registerInlineBindings();
        } catch (error) {
            console.warn('Failed to apply contacts content', error);
        }
    });
})();
