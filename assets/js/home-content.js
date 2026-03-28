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

    function renderAction(action, className) {
        const targetAttrs = action.href?.startsWith('http')
            ? ' target="_blank" rel="noopener noreferrer"'
            : '';

        return `
            <a href="${escapeHtml(action.href || '#')}" class="${escapeHtml(className)}"${targetAttrs}>
                <i class="${escapeHtml(action.icon || '')}" aria-hidden="true"></i> ${escapeHtml(action.label || '')}
            </a>
        `;
    }

    function renderActionNode(anchor, action, className) {
        if (!anchor) return;
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
        anchor.innerHTML = `<i class="${escapeHtml(action.icon || '')}"></i> ${escapeHtml(action.label || '')}`;
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

    function applyDirectionFact(node, fact) {
        if (!node || !fact) return;
        const value = node.querySelector('strong');
        const text = node.querySelector('span');
        if (value) value.textContent = fact.value || '';
        if (text) text.textContent = fact.text || '';
    }

    function syncDirectionFacts(featureElement, items) {
        const container = featureElement?.querySelector('.direction-feature__facts');
        if (!container) return;
        syncCollection(container, '.direction-fact', items, applyDirectionFact);
    }

    function applyDirectionItem(node, item) {
        if (!node || !item) return;
        const title = node.querySelector('strong');
        const text = node.querySelector('span:not(.direction-item__arrow)');
        const arrow = node.querySelector('.direction-item__arrow');
        node.setAttribute('href', item.href || '#');
        if (title) title.textContent = item.title || '';
        if (text) text.textContent = item.text || '';
        if (arrow) arrow.textContent = item.arrowLabel || '';
    }

    function syncDirectionItems(featureElement, items) {
        const container = featureElement?.querySelector('.direction-feature__items');
        if (!container) return;
        syncCollection(container, '.direction-item', items, applyDirectionItem);
    }

    function applyHeroFeature(node, feature) {
        if (!node || !feature) return;
        const icon = node.querySelector('i');
        const text = node.querySelector('span');
        if (icon) icon.className = feature.icon || '';
        if (text) text.textContent = feature.text || '';
    }

    function syncHeroFeatures(items) {
        const container = document.querySelector('.hero-features');
        if (!container) return;
        syncCollection(container, '.feature', items, applyHeroFeature);
    }

    function applyProcessFact(node, fact) {
        if (!node || !fact) return;
        const value = node.querySelector('strong');
        const text = node.querySelector('span');
        if (value) value.textContent = fact.value || '';
        if (text) text.textContent = fact.text || '';
    }

    function syncProcessFacts(items) {
        const container = document.querySelector('.process-facts');
        if (!container) return;
        syncCollection(container, '.process-fact', items, applyProcessFact);
    }

    function applyTimelineStep(node, step) {
        if (!node || !step) return;
        const number = node.querySelector('.process-step__number');
        const icon = node.querySelector('.process-icon i');
        const title = node.querySelector('h3');
        const text = node.querySelector('p');
        if (number) number.textContent = step.number || '';
        if (icon) icon.className = step.icon || '';
        if (title) title.textContent = step.title || '';
        if (text) text.textContent = step.text || '';
    }

    function syncTimelineSteps(items) {
        const container = document.querySelector('.process-timeline');
        if (!container) return;
        syncCollection(container, '.process-step', items, applyTimelineStep);
    }

    function applyTrustHighlight(node, item) {
        if (!node || !item) return;
        const value = node.querySelector('strong');
        const text = node.querySelector('span');
        if (value) value.textContent = item.value || '';
        if (text) text.textContent = item.text || '';
    }

    function syncTrustHighlights(items) {
        const container = document.querySelector('.trust-highlights');
        if (!container) return;
        syncCollection(container, '.trust-highlight', items, applyTrustHighlight);
    }

    function applyTrustCard(node, item) {
        if (!node || !item) return;
        const icon = node.querySelector('i');
        const title = node.querySelector('h3');
        const text = node.querySelector('p');
        if (icon) icon.className = item.icon || '';
        if (title) title.textContent = item.title || '';
        if (text) text.textContent = item.text || '';
    }

    function syncTrustCards(items) {
        const container = document.querySelector('.trust-grid');
        if (!container) return;
        syncCollection(container, '.trust-card', items, applyTrustCard);
    }

    function applyRequestFact(node, fact) {
        if (!node || !fact) return;
        const value = node.querySelector('strong');
        const text = node.querySelector('span');
        if (value) value.textContent = fact.value || '';
        if (text) text.textContent = fact.text || '';
    }

    function syncRequestFacts(items) {
        const container = document.querySelector('.request-facts');
        if (!container) return;
        syncCollection(container, '.request-fact', items, applyRequestFact);
    }

    function applyRequestQuickAction(node, action) {
        if (!node || !action) return;
        const external = action.href?.startsWith('http');
        node.className = 'btn btn-outline';
        node.setAttribute('href', action.href || '#');
        if (external) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
        } else {
            node.removeAttribute('target');
            node.removeAttribute('rel');
        }
        node.innerHTML = `<i class="${escapeHtml(action.icon || '')}" aria-hidden="true"></i> ${escapeHtml(action.label || '')}`;
    }

    function syncRequestQuickActions(items) {
        const container = document.querySelector('.request-form--compact .quick-actions');
        if (!container) return;
        syncCollection(container, 'a', items, applyRequestQuickAction);
    }

    function applyRequestContactLine(node, item) {
        if (!node || !item) return;
        const note = item.note ? ` <span class="contact-note">${escapeHtml(item.note)}</span>` : '';
        node.innerHTML = `
            <i class="${escapeHtml(item.icon || '')}" aria-hidden="true"></i>
            <a href="${escapeHtml(item.href || '#')}">${escapeHtml(item.label || '')}</a>${note}
        `.trim();
    }

    function syncRequestContactLines(items) {
        const container = document.querySelector('.contact-info');
        if (!container) return;
        const lineNodes = Array.from(container.querySelectorAll('p:not(.contact-info__intro)'));
        if (!lineNodes.length) return;

        const template = lineNodes[0];
        while (container.querySelectorAll('p:not(.contact-info__intro)').length < (Array.isArray(items) ? items.length : 0)) {
            const clone = template.cloneNode(true);
            resetInlineMarkers(clone);
            container.appendChild(clone);
        }

        const nextNodes = Array.from(container.querySelectorAll('p:not(.contact-info__intro)'));
        const safeItems = Array.isArray(items) ? items : [];
        nextNodes.forEach((node, index) => {
            const item = safeItems[index];
            node.hidden = !item;
            if (item) {
                applyRequestContactLine(node, item);
            }
        });
    }

    function applyHero(hero) {
        const titleMain = document.querySelector('.hero-title-main');
        const titleSub = document.querySelector('.hero-title-sub');
        const subtitleStrong = document.querySelector('.hero-subtitle-strong');
        const heroList = document.querySelector('.hero-list');
        const heroFeatures = document.querySelector('.hero-features');
        const primaryAction = document.querySelector('.hero-actions .btn-primary');

        if (titleMain) titleMain.textContent = hero.titleMain || '';
        if (titleSub) titleSub.textContent = hero.titleSub || '';
        if (subtitleStrong) subtitleStrong.textContent = hero.subtitleStrong || '';

        if (heroList) {
            heroList.innerHTML = (hero.bulletPoints || []).map((item) => `
                <li>${escapeHtml(item)}</li>
            `).join('');
        }

        if (heroFeatures) {
            heroFeatures.innerHTML = (hero.features || []).map((feature) => `
                <div class="feature">
                    <i class="${escapeHtml(feature.icon || '')}" aria-hidden="true"></i>
                    <span>${escapeHtml(feature.text || '')}</span>
                </div>
            `).join('');
        }

        if (primaryAction && hero.primaryAction) {
            primaryAction.setAttribute('href', hero.primaryAction.href || '#');
            primaryAction.innerHTML = `<i class="${escapeHtml(hero.primaryAction.icon || '')}"></i> ${escapeHtml(hero.primaryAction.label || '')}`;
        }
    }

    function applyDirectionFeature(article, data) {
        if (!article || !data) return;

        const mediaTags = article.querySelector('.direction-feature__media-tags');
        const viewport = article.querySelector('.direction-showcase__viewport');
        const nav = article.querySelector('.direction-showcase__nav');
        const eyebrow = article.querySelector('.direction-feature__eyebrow');
        const title = article.querySelector('.direction-feature__content h3');
        const lead = article.querySelector('.direction-feature__lead');
        const facts = article.querySelector('.direction-feature__facts');
        const items = article.querySelector('.direction-feature__items');
        const trust = article.querySelector('.direction-feature__trust');
        const actions = article.querySelector('.direction-feature__actions');
        const showcase = article.querySelector('[data-direction-showcase]');

        if (mediaTags) {
            mediaTags.innerHTML = (data.mediaTags || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('');
        }

        if (viewport) {
            viewport.innerHTML = (data.slides || []).map((slide, index) => `
                <figure class="direction-showcase__slide${index === 0 ? ' is-active' : ''}" data-direction-showcase-slide aria-hidden="${index === 0 ? 'false' : 'true'}">
                    <img src="${escapeHtml(slide.src || '')}" width="${Number(slide.width) || 1600}" height="${Number(slide.height) || 1200}" alt="${escapeHtml(slide.alt || '')}" loading="lazy" decoding="async">
                    <figcaption>${escapeHtml(slide.caption || '')}</figcaption>
                </figure>
            `).join('');
        }

        if (nav) {
            nav.innerHTML = (data.slides || []).map((slide, index) => `
                <button class="direction-showcase__bar${index === 0 ? ' is-active' : ''}" type="button" data-direction-showcase-dot aria-label="Показать ${escapeHtml((slide.caption || '').toLowerCase())}" aria-pressed="${index === 0 ? 'true' : 'false'}"></button>
            `).join('');
        }

        if (showcase) {
            delete showcase.dataset.directionShowcaseBound;
        }

        if (eyebrow) eyebrow.textContent = data.eyebrow || '';
        if (title) title.textContent = data.title || '';
        if (lead) lead.textContent = data.lead || '';

        if (facts) {
            facts.innerHTML = (data.facts || []).map((fact) => `
                <div class="direction-fact">
                    <strong>${escapeHtml(fact.value || '')}</strong>
                    <span>${escapeHtml(fact.text || '')}</span>
                </div>
            `).join('');
        }

        if (items) {
            items.innerHTML = (data.items || []).map((item) => `
                <a class="direction-item" href="${escapeHtml(item.href || '#')}">
                    <strong>${escapeHtml(item.title || '')}</strong>
                    <span>${escapeHtml(item.text || '')}</span>
                    <span class="direction-item__arrow">${escapeHtml(item.arrowLabel || '')}</span>
                </a>
            `).join('');
        }

        if (trust) {
            trust.textContent = data.trust || '';
        }

        if (actions) {
            actions.innerHTML = (data.actions || []).map((action) => {
                const style = action.style === 'secondary' ? 'secondary' : 'primary';
                return renderAction(action, `direction-action direction-action--${style}`);
            }).join('');
        }
    }

    function applyDirections(directions) {
        const title = document.querySelector('.directions-section .section-title');
        const subtitle = document.querySelector('.directions-section .section-subtitle');
        const gatesFeature = document.querySelector('.direction-feature--gates');
        const coatingFeature = document.querySelector('.direction-feature--coating');

        if (title) title.textContent = directions.sectionTitle || '';
        if (subtitle) subtitle.textContent = directions.sectionSubtitle || '';

        applyDirectionFeature(gatesFeature, directions.gates);
        applyDirectionFeature(coatingFeature, directions.coating);

        document.dispatchEvent(new CustomEvent('pokraska:direction-showcases-updated', {
            detail: {
                root: document.querySelector('.directions-section') || document
            }
        }));
    }

    function applyProcess(process) {
        const section = document.querySelector('.process-section');
        if (!section || !process) return;

        const eyebrow = section.querySelector('.process-eyebrow');
        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');
        const facts = section.querySelector('.process-facts');
        const timeline = section.querySelector('.process-timeline');
        const actions = section.querySelector('.process-section .btn-group');

        if (eyebrow) eyebrow.textContent = process.eyebrow || '';
        if (title) title.textContent = process.title || '';
        if (subtitle) subtitle.textContent = process.subtitle || '';

        if (facts) {
            facts.innerHTML = (process.facts || []).map((fact) => `
                <div class="process-fact">
                    <strong>${escapeHtml(fact.value || '')}</strong>
                    <span>${escapeHtml(fact.text || '')}</span>
                </div>
            `).join('');
        }

        if (timeline) {
            timeline.innerHTML = (process.steps || []).map((step) => `
                <div class="process-step">
                    <span class="process-step__number">${escapeHtml(step.number || '')}</span>
                    <div class="process-icon"><i class="${escapeHtml(step.icon || '')}" aria-hidden="true"></i></div>
                    <h3>${escapeHtml(step.title || '')}</h3>
                    <p>${escapeHtml(step.text || '')}</p>
                </div>
            `).join('');
        }

        if (actions) {
            actions.innerHTML = (process.actions || []).map((action) => {
                const className = action.style === 'secondary' ? 'btn btn-outline' : 'btn btn-primary';
                return renderAction(action, className);
            }).join('');
        }
    }

    function applyTrust(trust) {
        const section = document.querySelector('.trust-section');
        if (!section || !trust) return;

        const eyebrow = section.querySelector('.trust-eyebrow');
        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');
        const highlights = section.querySelector('.trust-highlights');
        const grid = section.querySelector('.trust-grid');

        if (eyebrow) eyebrow.textContent = trust.eyebrow || '';
        if (title) title.textContent = trust.title || '';
        if (subtitle) subtitle.textContent = trust.subtitle || '';

        if (highlights) {
            highlights.innerHTML = (trust.highlights || []).map((item) => `
                <div class="trust-highlight">
                    <strong>${escapeHtml(item.value || '')}</strong>
                    <span>${escapeHtml(item.text || '')}</span>
                </div>
            `).join('');
        }

        if (grid) {
            grid.innerHTML = (trust.cards || []).map((card) => `
                <div class="trust-card">
                    <i class="${escapeHtml(card.icon || '')}" aria-hidden="true"></i>
                    <h3>${escapeHtml(card.title || '')}</h3>
                    <p>${escapeHtml(card.text || '')}</p>
                </div>
            `).join('');
        }
    }

    function applyRequest(request) {
        const section = document.querySelector('.request-section');
        if (!section || !request) return;

        const info = section.querySelector('.request-info');
        const form = section.querySelector('.request-form--compact');

        if (info) {
            const eyebrow = info.querySelector('.request-eyebrow');
            const title = info.querySelector('#request-title');
            const lead = info.querySelector('.request-lead');
            const facts = info.querySelector('.request-facts');
            const advantages = info.querySelector('.advantages');
            const contactTitle = info.querySelector('.contact-info h3');
            const contactIntro = info.querySelector('.contact-info__intro');
            const contactInfo = info.querySelector('.contact-info');

            if (eyebrow) eyebrow.textContent = request.eyebrow || '';
            if (title) title.innerHTML = request.titleHtml || '';
            if (lead) lead.textContent = request.lead || '';

            if (facts) {
                facts.innerHTML = (request.facts || []).map((fact) => `
                    <div class="request-fact">
                        <strong>${escapeHtml(fact.value || '')}</strong>
                        <span>${escapeHtml(fact.text || '')}</span>
                    </div>
                `).join('');
            }

            if (advantages) {
                advantages.innerHTML = (request.advantages || []).map((item) => `
                    <div class="advantage">
                        <i class="fas fa-check-circle" aria-hidden="true"></i>
                        <span>${escapeHtml(item)}</span>
                    </div>
                `).join('');
            }

            if (contactTitle) contactTitle.textContent = request.contactTitle || '';
            if (contactIntro) contactIntro.textContent = request.contactIntro || '';

            if (contactInfo) {
                const lines = (request.contactLines || []).map((item) => {
                    const targetAttrs = item.href?.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
                    const note = item.note ? ` <span class="contact-note">${escapeHtml(item.note)}</span>` : '';
                    return `
                        <p>
                            <i class="${escapeHtml(item.icon || '')}" aria-hidden="true"></i>
                            <a href="${escapeHtml(item.href || '#')}"${targetAttrs}>${escapeHtml(item.label || '')}</a>${note}
                        </p>
                    `;
                }).join('');

                const staticHeader = `
                    <h3>${escapeHtml(request.contactTitle || '')}</h3>
                    <p class="contact-info__intro">${escapeHtml(request.contactIntro || '')}</p>
                `;

                contactInfo.innerHTML = `${staticHeader}${lines}`;
            }
        }

        if (form) {
            const eyebrow = form.querySelector('.request-form__eyebrow');
            const title = form.querySelector('h3');
            const notice = form.querySelector('.form-notice');
            const quickActions = form.querySelector('.quick-actions');
            const iframe = form.querySelector('.yandex-form-embed');

            if (eyebrow) eyebrow.textContent = request.formEyebrow || '';
            if (title) title.textContent = request.formTitle || '';
            if (notice) notice.textContent = request.formNotice || '';

            if (quickActions) {
                quickActions.innerHTML = (request.quickActions || []).map((action) => {
                    const targetAttrs = action.href?.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
                    return `
                        <a class="btn btn-outline" href="${escapeHtml(action.href || '#')}"${targetAttrs}>
                            <i class="${escapeHtml(action.icon || '')}" aria-hidden="true"></i> ${escapeHtml(action.label || '')}
                        </a>
                    `;
                }).join('');
            }

            if (iframe && request.iframeSrc) {
                iframe.setAttribute('src', request.iframeSrc);
            }
        }
    }

    function registerInlineBindings() {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const heroTitleMain = document.querySelector('.hero-title-main');
        const heroTitleSub = document.querySelector('.hero-title-sub');
        const heroSubtitleStrong = document.querySelector('.hero-subtitle-strong');
        const heroList = document.querySelector('.hero-list');
        const heroAction = document.querySelector('.hero-actions .btn-primary');

        if (heroTitleMain) {
            bindings.push({ path: 'hero.titleMain', type: 'text', label: 'Главный заголовок', element: heroTitleMain });
        }

        if (heroTitleSub) {
            bindings.push({ path: 'hero.titleSub', type: 'text', label: 'Вторая строка заголовка', element: heroTitleSub });
        }

        if (heroSubtitleStrong) {
            bindings.push({ path: 'hero.subtitleStrong', type: 'text', label: 'Акцент под заголовком', element: heroSubtitleStrong });
        }

        if (heroList) {
            bindings.push({
                path: 'hero.bulletPoints',
                type: 'list',
                label: 'Короткий список под заголовком',
                hint: 'Каждый пункт с новой строки.',
                element: heroList,
                render(value, binding) {
                    const items = Array.isArray(value) ? value : [];
                    binding.elements.forEach((element) => {
                        element.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
                    });
                }
            });
        }

        if (heroAction) {
            bindings.push({
                path: 'hero.primaryAction',
                type: 'object',
                label: 'Главная кнопка в первом экране',
                element: heroAction,
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderActionNode(element, value || {}, 'btn btn-primary'));
                }
            });
        }

        document.querySelectorAll('.hero-features .feature').forEach((featureElement, index) => {
            const text = featureElement.querySelector('span');
            bindings.push({
                path: `hero.features.${index}`,
                type: 'object',
                editorKindLabel: 'Преимущество на странице',
                label: `Преимущество в первом экране ${index + 1}`,
                element: featureElement,
                collectionPath: 'hero.features',
                collectionItemFactory(nextIndex) {
                    const nextElement = document.querySelectorAll('.hero-features .feature')[nextIndex];
                    if (!nextElement) return null;
                    return {
                        path: `hero.features.${nextIndex}`,
                        type: 'object',
                        editorKindLabel: 'Преимущество на странице',
                        label: `Преимущество в первом экране ${nextIndex + 1}`,
                        element: nextElement,
                        collectionPath: 'hero.features',
                        fields: [
                            { key: 'icon', label: 'Иконка', type: 'text' },
                            { key: 'text', label: 'Текст', type: 'text' }
                        ],
                        collectionCreateValue() {
                            return { icon: 'fas fa-check-circle', text: 'Новое преимущество' };
                        },
                        collectionRender(items) {
                            syncHeroFeatures(items);
                        },
                        render(value) {
                            applyHeroFeature(nextElement, value || {});
                        }
                    };
                },
                collectionCreateValue() {
                    return { icon: 'fas fa-check-circle', text: 'Новое преимущество' };
                },
                fields: [
                    { key: 'icon', label: 'Иконка', type: 'text' },
                    { key: 'text', label: 'Текст', type: 'text' }
                ],
                collectionRender(items) {
                    syncHeroFeatures(items);
                },
                render(value) {
                    applyHeroFeature(featureElement, value || {});
                }
            });
            if (text) {
                bindings.push({ path: `hero.features.${index}.text`, type: 'text', label: `Преимущество ${index + 1}: текст`, element: text });
            }
        });

        const directionsTitle = document.querySelector('.directions-section .section-title');
        const directionsSubtitle = document.querySelector('.directions-section .section-subtitle');
        if (directionsTitle) {
            bindings.push({ path: 'directions.sectionTitle', type: 'text', label: 'Заголовок блока направлений', element: directionsTitle });
        }
        if (directionsSubtitle) {
            bindings.push({ path: 'directions.sectionSubtitle', type: 'text', label: 'Подзаголовок блока направлений', element: directionsSubtitle });
        }

        ['gates', 'coating'].forEach((key) => {
            const feature = document.querySelector(`.direction-feature--${key === 'gates' ? 'gates' : 'coating'}`);
            const mediaTags = feature?.querySelector('.direction-feature__media-tags');
            const eyebrow = feature?.querySelector('.direction-feature__eyebrow');
            const title = feature?.querySelector('.direction-feature__content h3');
            const lead = feature?.querySelector('.direction-feature__lead');
            const trust = feature?.querySelector('.direction-feature__trust');

            if (mediaTags) {
                bindings.push({
                    path: `directions.${key}.mediaTags`,
                    type: 'list',
                    label: `${key === 'gates' ? 'Плашки ворот' : 'Плашки покраски'}`,
                    element: mediaTags,
                    render(value, binding) {
                        const items = Array.isArray(value) ? value : [];
                        binding.elements.forEach((element) => {
                            element.innerHTML = items.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
                        });
                    }
                });
            }
            if (eyebrow) bindings.push({ path: `directions.${key}.eyebrow`, type: 'text', label: `${key === 'gates' ? 'Надзаголовок ворот' : 'Надзаголовок покраски'}`, element: eyebrow });
            if (title) bindings.push({ path: `directions.${key}.title`, type: 'text', label: `${key === 'gates' ? 'Заголовок карточки ворот' : 'Заголовок карточки покраски'}`, element: title });
            if (lead) bindings.push({ path: `directions.${key}.lead`, type: 'textarea', label: `${key === 'gates' ? 'Описание карточки ворот' : 'Описание карточки покраски'}`, element: lead });
            if (trust) bindings.push({ path: `directions.${key}.trust`, type: 'textarea', label: `${key === 'gates' ? 'Подсказка под воротами' : 'Подсказка под покраской'}`, element: trust });

            feature?.querySelectorAll('.direction-feature__actions a').forEach((action, index) => {
                bindings.push({
                    path: `directions.${key}.actions.${index}`,
                    type: 'object',
                    label: `${key === 'gates' ? 'Кнопка ворот' : 'Кнопка покраски'} ${index + 1}`,
                    element: action,
                    fields: [
                        { key: 'label', label: 'Текст кнопки', type: 'text' },
                        { key: 'href', label: 'Ссылка', type: 'text' },
                        { key: 'icon', label: 'Иконка', type: 'text' },
                        { key: 'style', label: 'Стиль (primary/secondary)', type: 'text' }
                    ],
                    render(value, binding) {
                        const className = value?.style === 'secondary'
                            ? 'direction-action direction-action--secondary'
                            : 'direction-action direction-action--primary';
                        binding.elements.forEach((element) => renderActionNode(element, value || {}, className));
                    }
                });
            });

            const selector = `.direction-feature--${key === 'gates' ? 'gates' : 'coating'} [data-direction-showcase-slide]`;
            document.querySelectorAll(selector).forEach((slide, index) => {
                const image = slide.querySelector('img');
                if (!image) return;

                bindings.push({
                    path: `directions.${key}.slides.${index}`,
                    type: 'image',
                    label: `${key === 'gates' ? 'Фото ворот' : 'Фото покраски'} ${index + 1}`,
                    hint: 'Можно заменить фото, alt и подпись кадра.',
                    directory: 'assets/images/catalog',
                    element: image,
                    fields: [
                        { key: 'alt', label: 'Alt', type: 'text' },
                        { key: 'caption', label: 'Подпись кадра', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            const figure = element.closest('figure');
                            element.src = value?.src || '';
                            element.alt = value?.alt || '';
                            if (value?.width) element.width = Number(value.width) || element.width;
                            if (value?.height) element.height = Number(value.height) || element.height;
                            const caption = figure?.querySelector('figcaption');
                            if (caption) caption.textContent = value?.caption || '';
                        });
                    }
                });
            });
        });

        const processEyebrow = document.querySelector('.process-eyebrow');
        const processTitle = document.querySelector('.process-section .section-title');
        const processSubtitle = document.querySelector('.process-section .section-subtitle');
        if (processEyebrow) bindings.push({ path: 'process.eyebrow', type: 'text', label: 'Надзаголовок блока процесса', element: processEyebrow });
        if (processTitle) bindings.push({ path: 'process.title', type: 'text', label: 'Заголовок блока процесса', element: processTitle });
        if (processSubtitle) bindings.push({ path: 'process.subtitle', type: 'textarea', label: 'Подзаголовок блока процесса', element: processSubtitle });

        document.querySelectorAll('.process-section .btn-group a').forEach((action, index) => {
            bindings.push({
                path: `process.actions.${index}`,
                type: 'object',
                label: `Кнопка блока процесса ${index + 1}`,
                element: action,
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' },
                    { key: 'style', label: 'Стиль (primary/secondary)', type: 'text' }
                ],
                render(value, binding) {
                    const className = value?.style === 'secondary' ? 'btn btn-outline' : 'btn btn-primary';
                    binding.elements.forEach((element) => renderActionNode(element, value || {}, className));
                }
            });
        });

        const trustEyebrow = document.querySelector('.trust-eyebrow');
        const trustTitle = document.querySelector('.trust-section .section-title');
        const trustSubtitle = document.querySelector('.trust-section .section-subtitle');
        if (trustEyebrow) bindings.push({ path: 'trust.eyebrow', type: 'text', label: 'Надзаголовок блока доверия', element: trustEyebrow });
        if (trustTitle) bindings.push({ path: 'trust.title', type: 'text', label: 'Заголовок блока доверия', element: trustTitle });
        if (trustSubtitle) bindings.push({ path: 'trust.subtitle', type: 'textarea', label: 'Подзаголовок блока доверия', element: trustSubtitle });

        const requestTitle = document.querySelector('#request-title');
        const requestLead = document.querySelector('.request-lead');
        const requestEyebrow = document.querySelector('.request-eyebrow');
        const requestContactTitle = document.querySelector('.contact-info h3');
        const requestContactIntro = document.querySelector('.contact-info__intro');
        const requestFormTitle = document.querySelector('.request-form--compact h3');
        const requestFormEyebrow = document.querySelector('.request-form__eyebrow');
        const requestFormNotice = document.querySelector('.request-form--compact .form-notice');

        if (requestTitle) {
            bindings.push({
                path: 'request.titleHtml',
                type: 'html',
                label: 'Главный заголовок блока заявки',
                hint: 'Можно использовать перенос строки через <br>.',
                element: requestTitle,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.innerHTML = value || '';
                    });
                }
            });
        }

        if (requestLead) {
            bindings.push({ path: 'request.lead', type: 'textarea', label: 'Описание блока заявки', element: requestLead });
        }

        if (requestEyebrow) {
            bindings.push({ path: 'request.eyebrow', type: 'text', label: 'Надзаголовок блока заявки', element: requestEyebrow });
        }

        if (requestContactTitle) {
            bindings.push({ path: 'request.contactTitle', type: 'text', label: 'Заголовок блока быстрого контакта', element: requestContactTitle });
        }

        if (requestContactIntro) {
            bindings.push({ path: 'request.contactIntro', type: 'textarea', label: 'Описание блока быстрого контакта', element: requestContactIntro });
        }

        if (requestFormTitle) {
            bindings.push({ path: 'request.formTitle', type: 'text', label: 'Заголовок формы заявки', element: requestFormTitle });
        }

        if (requestFormEyebrow) {
            bindings.push({ path: 'request.formEyebrow', type: 'text', label: 'Надзаголовок формы заявки', element: requestFormEyebrow });
        }

        if (requestFormNotice) {
            bindings.push({ path: 'request.formNotice', type: 'textarea', label: 'Пояснение над формой', element: requestFormNotice });
        }

        const requestAdvantages = document.querySelector('.advantages');
        if (requestAdvantages) {
            bindings.push({
                path: 'request.advantages',
                type: 'list',
                label: 'Список направлений в блоке заявки',
                hint: 'Каждый пункт с новой строки.',
                element: requestAdvantages,
                render(value, binding) {
                    const items = Array.isArray(value) ? value : [];
                    binding.elements.forEach((element) => {
                        element.innerHTML = items.map((item) => `
                            <div class="advantage">
                                <i class="fas fa-check-circle" aria-hidden="true"></i>
                                <span>${escapeHtml(item)}</span>
                            </div>
                        `).join('');
                    });
                }
            });
        }

        document.querySelectorAll('.contact-info p:not(.contact-info__intro)').forEach((lineElement, index) => {
            bindings.push({
                path: `request.contactLines.${index}`,
                type: 'object',
                editorKindLabel: 'Контакт на странице',
                label: `Контакт в блоке заявки ${index + 1}`,
                element: lineElement,
                fields: [
                    { key: 'icon', label: 'Иконка', type: 'text' },
                    { key: 'label', label: 'Текст', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'note', label: 'Подпись', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => applyRequestContactLine(element, value || {}));
                }
            });
        });

        document.querySelectorAll('.request-form--compact .quick-actions a').forEach((actionElement, index) => {
            bindings.push({
                path: `request.quickActions.${index}`,
                type: 'object',
                label: `Быстрая кнопка в форме заявки ${index + 1}`,
                element: actionElement,
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => applyRequestQuickAction(element, value || {}));
                }
            });
        });

        if (!bindings.length) return;

        queueInlineBindings({
            fileName: 'home',
            sectionKey: 'home',
            sectionLabel: 'Главная страница',
            bindings
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;

        try {
            const home = await window.PokraskaContent.loadContentFile('home');
            applyHero(home.hero || {});
            applyDirections(home.directions || {});
            applyProcess(home.process || {});
            applyTrust(home.trust || {});
            applyRequest(home.request || {});
            registerInlineBindings();
        } catch (error) {
            console.warn('Failed to apply home content', error);
        }
    });
})();
