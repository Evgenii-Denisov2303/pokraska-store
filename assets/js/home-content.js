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

    function extractDirectoryFromSrc(src, fallback = 'assets/images/catalog') {
        const cleanSrc = String(src || '').split('?')[0];
        const withoutDots = cleanSrc.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
        const lastSlashIndex = withoutDots.lastIndexOf('/');
        return lastSlashIndex >= 0 ? withoutDots.slice(0, lastSlashIndex) : fallback;
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

    function applyDirectionAction(node, action) {
        if (!node || !action) return;
        const className = action.style === 'secondary'
            ? 'direction-action direction-action--secondary'
            : 'direction-action direction-action--primary';
        renderActionNode(node, action, className);
    }

    function syncDirectionActions(featureElement, items) {
        const container = featureElement?.querySelector('.direction-feature__actions');
        if (!container) return;
        syncCollection(container, 'a', items, applyDirectionAction);
    }

    function applyPartnerCard(node, item) {
        if (!node || !item) return;
        const image = node.querySelector('img');
        if (!image) return;
        image.src = item.src || '';
        image.alt = item.alt || '';
        if (item.title) {
            image.title = item.title;
        } else {
            image.removeAttribute('title');
        }
        if (item.width) image.width = Number(item.width) || image.width;
        if (item.height) image.height = Number(item.height) || image.height;
    }

    function syncPartnersGrid(items) {
        const container = document.querySelector('.partners-grid');
        if (!container) return;
        syncCollection(container, '.partner-card', items, applyPartnerCard);
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

    function applyHeroBullet(node, item) {
        if (!node) return;
        node.textContent = item || '';
    }

    function syncHeroBullets(items) {
        const container = document.querySelector('.hero-list');
        if (!container) return;
        syncCollection(container, 'li', items, applyHeroBullet);
    }

    function applyDirectionMediaTag(node, item) {
        if (!node) return;
        node.textContent = item || '';
    }

    function syncDirectionMediaTags(featureElement, items) {
        const container = featureElement?.querySelector('.direction-feature__media-tags');
        if (!container) return;
        syncCollection(container, 'span', items, applyDirectionMediaTag);
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

    function applyProcessAction(node, action) {
        if (!node || !action) return;
        const className = action.style === 'secondary' ? 'btn btn-outline' : 'btn btn-primary';
        renderActionNode(node, action, className);
    }

    function syncProcessActions(items) {
        const container = document.querySelector('.process-section .btn-group');
        if (!container) return;
        syncCollection(container, 'a', items, applyProcessAction);
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

    function applyRequestAdvantage(node, item) {
        if (!node) return;
        const text = node.querySelector('span');
        if (text) text.textContent = item || '';
    }

    function syncRequestAdvantages(items) {
        const container = document.querySelector('.advantages');
        if (!container) return;
        syncCollection(container, '.advantage', items, applyRequestAdvantage);
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
            syncHeroBullets(hero.bulletPoints || []);
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
            syncDirectionMediaTags(article, data.mediaTags || []);
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

    function applyPartners(partners) {
        const section = document.querySelector('.partners-section');
        if (!section || !partners) return;

        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');

        if (title) title.textContent = partners.title || '';
        if (subtitle) subtitle.textContent = partners.subtitle || '';
        syncPartnersGrid(partners.items || []);
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
                syncRequestAdvantages(request.advantages || []);
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
            const buildHeroBulletBinding = (targetItem, index) => ({
                path: `hero.bulletPoints.${index}`,
                type: 'text',
                editorKindLabel: 'Пункт на странице',
                collectionItemLabel: 'пункт',
                collectionItemLabelPlural: 'пунктов',
                label: `Пункт под заголовком ${index + 1}`,
                element: targetItem,
                collectionPath: 'hero.bulletPoints',
                collectionItemFactory(nextIndex) {
                    const nextItem = document.querySelectorAll('.hero-list li')[nextIndex];
                    if (!nextItem) return null;
                    return buildHeroBulletBinding(nextItem, nextIndex);
                },
                collectionCreateValue() {
                    return 'Новый пункт';
                },
                collectionRender(items) {
                    syncHeroBullets(Array.isArray(items) ? items : []);
                },
                render(value, binding) {
                    binding.elements.forEach((element) => applyHeroBullet(element, value || ''));
                }
            });

            heroList.querySelectorAll('li').forEach((item, index) => {
                bindings.push(buildHeroBulletBinding(item, index));
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
                const buildMediaTagBinding = (targetItem, index) => ({
                    path: `directions.${key}.mediaTags.${index}`,
                    type: 'text',
                    editorKindLabel: 'Плашка на странице',
                    collectionItemLabel: 'плашка',
                    collectionItemLabelPlural: 'плашек',
                    label: `${key === 'gates' ? 'Плашка ворот' : 'Плашка покраски'} ${index + 1}`,
                    element: targetItem,
                    collectionPath: `directions.${key}.mediaTags`,
                    collectionItemFactory(nextIndex) {
                        const nextItem = feature?.querySelectorAll('.direction-feature__media-tags span')[nextIndex];
                        if (!nextItem) return null;
                        return buildMediaTagBinding(nextItem, nextIndex);
                    },
                    collectionCreateValue() {
                        return 'Новая плашка';
                    },
                    collectionRender(items) {
                        syncDirectionMediaTags(feature, Array.isArray(items) ? items : []);
                    },
                    render(value, binding) {
                        binding.elements.forEach((element) => applyDirectionMediaTag(element, value || ''));
                    }
                });

                mediaTags.querySelectorAll('span').forEach((item, index) => {
                    bindings.push(buildMediaTagBinding(item, index));
                });
            }
            if (eyebrow) bindings.push({ path: `directions.${key}.eyebrow`, type: 'text', label: `${key === 'gates' ? 'Надзаголовок ворот' : 'Надзаголовок покраски'}`, element: eyebrow });
            if (title) bindings.push({ path: `directions.${key}.title`, type: 'text', label: `${key === 'gates' ? 'Заголовок карточки ворот' : 'Заголовок карточки покраски'}`, element: title });
            if (lead) bindings.push({ path: `directions.${key}.lead`, type: 'textarea', label: `${key === 'gates' ? 'Описание карточки ворот' : 'Описание карточки покраски'}`, element: lead });
            if (trust) bindings.push({ path: `directions.${key}.trust`, type: 'textarea', label: `${key === 'gates' ? 'Подсказка под воротами' : 'Подсказка под покраской'}`, element: trust });

            const buildDirectionFactBinding = (targetItem, index) => ({
                path: `directions.${key}.facts.${index}`,
                type: 'object',
                editorKindLabel: 'Факт на странице',
                label: `${key === 'gates' ? 'Факт ворот' : 'Факт покраски'} ${index + 1}`,
                element: targetItem,
                collectionPath: `directions.${key}.facts`,
                collectionItemFactory(nextIndex) {
                    const nextItem = feature?.querySelectorAll('.direction-feature__facts .direction-fact')[nextIndex];
                    if (!nextItem) return null;
                    return buildDirectionFactBinding(nextItem, nextIndex);
                },
                collectionCreateValue() {
                    return {
                        value: 'Новый факт',
                        text: 'Короткое описание'
                    };
                },
                fields: [
                    { key: 'value', label: 'Значение', type: 'text' },
                    { key: 'text', label: 'Текст', type: 'text' }
                ],
                collectionRender(items) {
                    syncDirectionFacts(feature, items);
                },
                render(value) {
                    applyDirectionFact(targetItem, value || {});
                }
            });

            feature?.querySelectorAll('.direction-feature__facts .direction-fact').forEach((factElement, index) => {
                const valueElement = factElement.querySelector('strong');
                const textElement = factElement.querySelector('span');
                bindings.push(buildDirectionFactBinding(factElement, index));
                if (valueElement) {
                    bindings.push({
                        path: `directions.${key}.facts.${index}.value`,
                        type: 'text',
                        label: `${key === 'gates' ? 'Факт ворот' : 'Факт покраски'} ${index + 1}: значение`,
                        element: valueElement
                    });
                }
                if (textElement) {
                    bindings.push({
                        path: `directions.${key}.facts.${index}.text`,
                        type: 'text',
                        label: `${key === 'gates' ? 'Факт ворот' : 'Факт покраски'} ${index + 1}: описание`,
                        element: textElement
                    });
                }
            });

            const buildDirectionItemBinding = (targetItem, index) => ({
                path: `directions.${key}.items.${index}`,
                type: 'object',
                editorKindLabel: 'Карточка на странице',
                label: `${key === 'gates' ? 'Пункт ворот' : 'Пункт покраски'} ${index + 1}`,
                element: targetItem,
                collectionPath: `directions.${key}.items`,
                collectionItemFactory(nextIndex) {
                    const nextItem = feature?.querySelectorAll('.direction-feature__items .direction-item')[nextIndex];
                    if (!nextItem) return null;
                    return buildDirectionItemBinding(nextItem, nextIndex);
                },
                collectionCreateValue() {
                    return {
                        title: 'Новый пункт',
                        text: 'Короткое описание пункта',
                        href: '#',
                        arrowLabel: 'Подробнее'
                    };
                },
                fields: [
                    { key: 'title', label: 'Заголовок', type: 'text' },
                    { key: 'text', label: 'Описание', type: 'textarea' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'arrowLabel', label: 'Подпись стрелки', type: 'text' }
                ],
                collectionRender(items) {
                    syncDirectionItems(feature, items);
                },
                render(value) {
                    applyDirectionItem(targetItem, value || {});
                }
            });

            feature?.querySelectorAll('.direction-feature__items .direction-item').forEach((itemElement, index) => {
                bindings.push(buildDirectionItemBinding(itemElement, index));

                const titleElement = itemElement.querySelector('strong');
                const textElement = itemElement.querySelector('span:not(.direction-item__arrow)');
                const arrowElement = itemElement.querySelector('.direction-item__arrow');
                const itemLabel = `${key === 'gates' ? 'Пункт ворот' : 'Пункт покраски'} ${index + 1}`;

                if (titleElement) {
                    bindings.push({
                        path: `directions.${key}.items.${index}.title`,
                        type: 'text',
                        label: `${itemLabel}: заголовок`,
                        element: titleElement
                    });
                }

                if (textElement) {
                    bindings.push({
                        path: `directions.${key}.items.${index}.text`,
                        type: 'textarea',
                        label: `${itemLabel}: описание`,
                        element: textElement
                    });
                }

                if (arrowElement) {
                    bindings.push({
                        path: `directions.${key}.items.${index}.arrowLabel`,
                        type: 'text',
                        label: `${itemLabel}: подпись ссылки`,
                        element: arrowElement
                    });
                }
            });

            const buildDirectionActionBinding = (targetItem, index) => ({
                path: `directions.${key}.actions.${index}`,
                type: 'object',
                editorKindLabel: 'Кнопка на странице',
                label: `${key === 'gates' ? 'Кнопка ворот' : 'Кнопка покраски'} ${index + 1}`,
                element: targetItem,
                collectionPath: `directions.${key}.actions`,
                collectionItemFactory(nextIndex) {
                    const nextItem = feature?.querySelectorAll('.direction-feature__actions a')[nextIndex];
                    if (!nextItem) return null;
                    return buildDirectionActionBinding(nextItem, nextIndex);
                },
                collectionCreateValue() {
                    return {
                        label: 'Новая кнопка',
                        href: '#',
                        icon: 'fas fa-link',
                        style: 'primary'
                    };
                },
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' },
                    { key: 'style', label: 'Стиль (primary/secondary)', type: 'text' }
                ],
                collectionRender(items) {
                    syncDirectionActions(feature, items);
                },
                render(value) {
                    applyDirectionAction(targetItem, value || {});
                }
            });

            feature?.querySelectorAll('.direction-feature__actions a').forEach((actionElement, index) => {
                bindings.push(buildDirectionActionBinding(actionElement, index));
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
                    element: slide,
                    fields: [
                        { key: 'alt', label: 'Alt', type: 'text' },
                        { key: 'caption', label: 'Подпись кадра', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            const figure = element.matches('figure') ? element : element.closest('figure');
                            const targetImage = figure?.querySelector('img');
                            if (targetImage) {
                                targetImage.src = value?.src || '';
                                targetImage.alt = value?.alt || '';
                                if (value?.width) targetImage.width = Number(value.width) || targetImage.width;
                                if (value?.height) targetImage.height = Number(value.height) || targetImage.height;
                            }
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

        const buildProcessFactBinding = (targetItem, index) => ({
            path: `process.facts.${index}`,
            type: 'object',
            editorKindLabel: 'Факт на странице',
            label: `Факт процесса ${index + 1}`,
            element: targetItem,
            collectionPath: 'process.facts',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.process-facts .process-fact')[nextIndex];
                if (!nextItem) return null;
                return buildProcessFactBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    value: '+1',
                    text: 'Новый факт'
                };
            },
            fields: [
                { key: 'value', label: 'Значение', type: 'text' },
                { key: 'text', label: 'Текст', type: 'text' }
            ],
            collectionRender(items) {
                syncProcessFacts(items);
            },
            render(value) {
                applyProcessFact(targetItem, value || {});
            }
        });

        document.querySelectorAll('.process-facts .process-fact').forEach((factElement, index) => {
            const valueElement = factElement.querySelector('strong');
            const textElement = factElement.querySelector('span');
            bindings.push(buildProcessFactBinding(factElement, index));
            if (valueElement) {
                bindings.push({ path: `process.facts.${index}.value`, type: 'text', label: `Факт процесса ${index + 1}: значение`, element: valueElement });
            }
            if (textElement) {
                bindings.push({ path: `process.facts.${index}.text`, type: 'text', label: `Факт процесса ${index + 1}: описание`, element: textElement });
            }
        });

        const buildTimelineStepBinding = (targetItem, index) => ({
            path: `process.steps.${index}`,
            type: 'object',
            editorKindLabel: 'Шаг на странице',
            label: `Шаг процесса ${index + 1}`,
            element: targetItem,
            collectionPath: 'process.steps',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.process-timeline .process-step')[nextIndex];
                if (!nextItem) return null;
                return buildTimelineStepBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    number: String(index + 2),
                    icon: 'fas fa-star',
                    title: 'Новый шаг',
                    text: 'Короткое описание шага.'
                };
            },
            fields: [
                { key: 'number', label: 'Номер', type: 'text' },
                { key: 'icon', label: 'Иконка', type: 'text' },
                { key: 'title', label: 'Заголовок', type: 'text' },
                { key: 'text', label: 'Описание', type: 'textarea' }
            ],
            collectionRender(items) {
                syncTimelineSteps(items);
            },
            render(value) {
                applyTimelineStep(targetItem, value || {});
            }
        });

        document.querySelectorAll('.process-timeline .process-step').forEach((stepElement, index) => {
            const stepNumber = stepElement.querySelector('.process-step__number');
            const stepTitle = stepElement.querySelector('h3');
            const stepText = stepElement.querySelector('p');
            bindings.push(buildTimelineStepBinding(stepElement, index));
            if (stepNumber) bindings.push({ path: `process.steps.${index}.number`, type: 'text', label: `Шаг процесса ${index + 1}: номер`, element: stepNumber });
            if (stepTitle) bindings.push({ path: `process.steps.${index}.title`, type: 'text', label: `Шаг процесса ${index + 1}: заголовок`, element: stepTitle });
            if (stepText) bindings.push({ path: `process.steps.${index}.text`, type: 'textarea', label: `Шаг процесса ${index + 1}: описание`, element: stepText });
        });

        const buildProcessActionBinding = (targetItem, index) => ({
            path: `process.actions.${index}`,
            type: 'object',
            editorKindLabel: 'Кнопка на странице',
            label: `Кнопка блока процесса ${index + 1}`,
            element: targetItem,
            collectionPath: 'process.actions',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.process-section .btn-group a')[nextIndex];
                if (!nextItem) return null;
                return buildProcessActionBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    label: 'Новая кнопка',
                    href: '#',
                    icon: 'fas fa-link',
                    style: 'primary'
                };
            },
            fields: [
                { key: 'label', label: 'Текст кнопки', type: 'text' },
                { key: 'href', label: 'Ссылка', type: 'text' },
                { key: 'icon', label: 'Иконка', type: 'text' },
                { key: 'style', label: 'Стиль (primary/secondary)', type: 'text' }
            ],
            collectionRender(items) {
                syncProcessActions(items);
            },
            render(value) {
                applyProcessAction(targetItem, value || {});
            }
        });

        document.querySelectorAll('.process-section .btn-group a').forEach((actionElement, index) => {
            bindings.push(buildProcessActionBinding(actionElement, index));
        });

        const trustEyebrow = document.querySelector('.trust-eyebrow');
        const trustTitle = document.querySelector('.trust-section .section-title');
        const trustSubtitle = document.querySelector('.trust-section .section-subtitle');
        if (trustEyebrow) bindings.push({ path: 'trust.eyebrow', type: 'text', label: 'Надзаголовок блока доверия', element: trustEyebrow });
        if (trustTitle) bindings.push({ path: 'trust.title', type: 'text', label: 'Заголовок блока доверия', element: trustTitle });
        if (trustSubtitle) bindings.push({ path: 'trust.subtitle', type: 'textarea', label: 'Подзаголовок блока доверия', element: trustSubtitle });

        const buildTrustHighlightBinding = (targetItem, index) => ({
            path: `trust.highlights.${index}`,
            type: 'object',
            editorKindLabel: 'Показатель на странице',
            label: `Показатель доверия ${index + 1}`,
            element: targetItem,
            collectionPath: 'trust.highlights',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.trust-highlights .trust-highlight')[nextIndex];
                if (!nextItem) return null;
                return buildTrustHighlightBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    value: '+1',
                    text: 'Новый показатель'
                };
            },
            fields: [
                { key: 'value', label: 'Значение', type: 'text' },
                { key: 'text', label: 'Текст', type: 'text' }
            ],
            collectionRender(items) {
                syncTrustHighlights(items);
            },
            render(value) {
                applyTrustHighlight(targetItem, value || {});
            }
        });

        document.querySelectorAll('.trust-highlights .trust-highlight').forEach((itemElement, index) => {
            const valueElement = itemElement.querySelector('strong');
            const textElement = itemElement.querySelector('span');
            bindings.push(buildTrustHighlightBinding(itemElement, index));
            if (valueElement) bindings.push({ path: `trust.highlights.${index}.value`, type: 'text', label: `Показатель доверия ${index + 1}: значение`, element: valueElement });
            if (textElement) bindings.push({ path: `trust.highlights.${index}.text`, type: 'text', label: `Показатель доверия ${index + 1}: описание`, element: textElement });
        });

        const buildTrustCardBinding = (targetItem, index) => ({
            path: `trust.cards.${index}`,
            type: 'object',
            editorKindLabel: 'Карточка на странице',
            label: `Карточка доверия ${index + 1}`,
            element: targetItem,
            collectionPath: 'trust.cards',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.trust-grid .trust-card')[nextIndex];
                if (!nextItem) return null;
                return buildTrustCardBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    icon: 'fas fa-shield-alt',
                    title: 'Новая карточка',
                    text: 'Короткое описание карточки.'
                };
            },
            fields: [
                { key: 'icon', label: 'Иконка', type: 'text' },
                { key: 'title', label: 'Заголовок', type: 'text' },
                { key: 'text', label: 'Описание', type: 'textarea' }
            ],
            collectionRender(items) {
                syncTrustCards(items);
            },
            render(value) {
                applyTrustCard(targetItem, value || {});
            }
        });

        document.querySelectorAll('.trust-grid .trust-card').forEach((cardElement, index) => {
            const cardTitle = cardElement.querySelector('h3');
            const cardText = cardElement.querySelector('p');
            bindings.push(buildTrustCardBinding(cardElement, index));
            if (cardTitle) bindings.push({ path: `trust.cards.${index}.title`, type: 'text', label: `Карточка доверия ${index + 1}: заголовок`, element: cardTitle });
            if (cardText) bindings.push({ path: `trust.cards.${index}.text`, type: 'textarea', label: `Карточка доверия ${index + 1}: описание`, element: cardText });
        });

        const partnersTitle = document.querySelector('.partners-section .section-title');
        const partnersSubtitle = document.querySelector('.partners-section .section-subtitle');
        if (partnersTitle) {
            bindings.push({ path: 'partners.title', type: 'text', label: 'Заголовок блока брендов', element: partnersTitle });
        }
        if (partnersSubtitle) {
            bindings.push({ path: 'partners.subtitle', type: 'textarea', label: 'Подзаголовок блока брендов', element: partnersSubtitle });
        }

        const buildPartnerBinding = (targetItem, index) => {
            const image = targetItem?.querySelector('img');
            if (!image) return null;
            return {
                path: `partners.items.${index}`,
                type: 'image',
                label: `Логотип бренда ${index + 1}`,
                hint: 'Можно заменить логотип и описание для поисковиков.',
                editorKindLabel: 'Логотип на странице',
                element: targetItem,
                collectionPath: 'partners.items',
                collectionItemFactory(nextIndex) {
                    const nextItem = document.querySelectorAll('.partners-grid .partner-card')[nextIndex];
                    if (!nextItem) return null;
                    return buildPartnerBinding(nextItem, nextIndex);
                },
                collectionCreateValue() {
                    return {
                        src: image.getAttribute('src') || '',
                        alt: 'Новый бренд',
                        title: 'Новый бренд',
                        width: Number(image.getAttribute('width')) || null,
                        height: Number(image.getAttribute('height')) || null
                    };
                },
                directory: extractDirectoryFromSrc(image.getAttribute('src') || ''),
                fields: [
                    { key: 'alt', label: 'Alt', type: 'text' },
                    { key: 'title', label: 'Название бренда', type: 'text' }
                ],
                collectionRender(items) {
                    syncPartnersGrid(Array.isArray(items) ? items : []);
                },
                render(value) {
                    applyPartnerCard(targetItem, value || {});
                }
            };
        };

        document.querySelectorAll('.partners-grid .partner-card').forEach((cardElement, index) => {
            const binding = buildPartnerBinding(cardElement, index);
            if (binding) {
                bindings.push(binding);
            }
        });

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
            const buildRequestAdvantageBinding = (targetItem, index) => ({
                path: `request.advantages.${index}`,
                type: 'text',
                editorKindLabel: 'Пункт на странице',
                collectionItemLabel: 'пункт',
                collectionItemLabelPlural: 'пунктов',
                label: `Пункт в блоке заявки ${index + 1}`,
                element: targetItem,
                collectionPath: 'request.advantages',
                collectionItemFactory(nextIndex) {
                    const nextItem = document.querySelectorAll('.advantages .advantage')[nextIndex];
                    if (!nextItem) return null;
                    return buildRequestAdvantageBinding(nextItem, nextIndex);
                },
                collectionCreateValue() {
                    return 'Новый пункт';
                },
                collectionRender(items) {
                    syncRequestAdvantages(Array.isArray(items) ? items : []);
                },
                render(value, binding) {
                    binding.elements.forEach((element) => applyRequestAdvantage(element, value || ''));
                }
            });

            requestAdvantages.querySelectorAll('.advantage').forEach((item, index) => {
                bindings.push(buildRequestAdvantageBinding(item, index));
            });
        }

        const buildRequestFactBinding = (targetItem, index) => ({
            path: `request.facts.${index}`,
            type: 'object',
            editorKindLabel: 'Факт на странице',
            label: `Факт в блоке заявки ${index + 1}`,
            element: targetItem,
            collectionPath: 'request.facts',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.request-facts .request-fact')[nextIndex];
                if (!nextItem) return null;
                return buildRequestFactBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    value: '+1',
                    text: 'Новый факт'
                };
            },
            fields: [
                { key: 'value', label: 'Значение', type: 'text' },
                { key: 'text', label: 'Текст', type: 'text' }
            ],
            collectionRender(items) {
                syncRequestFacts(items);
            },
            render(value) {
                applyRequestFact(targetItem, value || {});
            }
        });

        document.querySelectorAll('.request-facts .request-fact').forEach((factElement, index) => {
            const valueElement = factElement.querySelector('strong');
            const textElement = factElement.querySelector('span');
            bindings.push(buildRequestFactBinding(factElement, index));
            if (valueElement) bindings.push({ path: `request.facts.${index}.value`, type: 'text', label: `Факт в блоке заявки ${index + 1}: значение`, element: valueElement });
            if (textElement) bindings.push({ path: `request.facts.${index}.text`, type: 'text', label: `Факт в блоке заявки ${index + 1}: описание`, element: textElement });
        });

        const buildRequestContactLineBinding = (targetItem, index) => ({
            path: `request.contactLines.${index}`,
            type: 'object',
            editorKindLabel: 'Контакт на странице',
            label: `Контакт в блоке заявки ${index + 1}`,
            element: targetItem,
            collectionPath: 'request.contactLines',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.contact-info p:not(.contact-info__intro)')[nextIndex];
                if (!nextItem) return null;
                return buildRequestContactLineBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    icon: 'fas fa-phone',
                    label: 'Новый контакт',
                    href: '#',
                    note: ''
                };
            },
            fields: [
                { key: 'icon', label: 'Иконка', type: 'text' },
                { key: 'label', label: 'Текст', type: 'text' },
                { key: 'href', label: 'Ссылка', type: 'text' },
                { key: 'note', label: 'Подпись', type: 'text' }
            ],
            collectionRender(items) {
                syncRequestContactLines(items);
            },
            render(value) {
                applyRequestContactLine(targetItem, value || {});
            }
        });

        document.querySelectorAll('.contact-info p:not(.contact-info__intro)').forEach((lineElement, index) => {
            const linkElement = lineElement.querySelector('a');
            const noteElement = lineElement.querySelector('.contact-note');
            bindings.push(buildRequestContactLineBinding(lineElement, index));
            if (linkElement) bindings.push({ path: `request.contactLines.${index}.label`, type: 'text', label: `Контакт в блоке заявки ${index + 1}: текст`, element: linkElement });
            if (noteElement) bindings.push({ path: `request.contactLines.${index}.note`, type: 'text', label: `Контакт в блоке заявки ${index + 1}: подпись`, element: noteElement });
        });

        const buildRequestQuickActionBinding = (targetItem, index) => ({
            path: `request.quickActions.${index}`,
            type: 'object',
            editorKindLabel: 'Кнопка на странице',
            label: `Быстрая кнопка в форме заявки ${index + 1}`,
            element: targetItem,
            collectionPath: 'request.quickActions',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.request-form--compact .quick-actions a')[nextIndex];
                if (!nextItem) return null;
                return buildRequestQuickActionBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    label: 'Новая кнопка',
                    href: '#',
                    icon: 'fas fa-link'
                };
            },
            fields: [
                { key: 'label', label: 'Текст кнопки', type: 'text' },
                { key: 'href', label: 'Ссылка', type: 'text' },
                { key: 'icon', label: 'Иконка', type: 'text' }
            ],
            collectionRender(items) {
                syncRequestQuickActions(items);
            },
            render(value) {
                applyRequestQuickAction(targetItem, value || {});
            }
        });

        document.querySelectorAll('.request-form--compact .quick-actions a').forEach((actionElement, index) => {
            bindings.push(buildRequestQuickActionBinding(actionElement, index));
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
            applyPartners(home.partners || {});
            applyRequest(home.request || {});
            registerInlineBindings();
        } catch (error) {
            console.warn('Failed to apply home content', error);
        }
    });
})();
