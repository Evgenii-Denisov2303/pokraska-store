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

        document.querySelectorAll('.contact-form-card .quick-actions a').forEach((anchor, index) => {
            bindings.push({
                path: `connect.actions.${index}`,
                type: 'object',
                label: `Кнопка быстрой связи ${index + 1}`,
                element: anchor,
                fields: [
                    { key: 'label', label: 'Текст', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' },
                    { key: 'style', label: 'Стиль (primary/outline)', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderActionNode(element, value || {}));
                }
            });
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
                        <li>
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
