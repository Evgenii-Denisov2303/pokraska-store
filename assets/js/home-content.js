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

    function extractImageBindingValue(image) {
        const link = image?.closest('a');
        return {
            src: image?.getAttribute('src') || '',
            alt: image?.getAttribute('alt') || '',
            title: link?.getAttribute('title') || image?.getAttribute('title') || image?.getAttribute('alt') || '',
            width: Number(image?.getAttribute('width')) || null,
            height: Number(image?.getAttribute('height')) || null
        };
    }

    function applyImageBindingValue(image, value) {
        if (!image || !value) return;

        if (typeof value.src === 'string') {
            image.setAttribute('src', value.src);
        }

        if (typeof value.alt === 'string') {
            image.setAttribute('alt', value.alt);
        }

        if (value.width) {
            image.setAttribute('width', String(Number(value.width)));
        }

        if (value.height) {
            image.setAttribute('height', String(Number(value.height)));
        }

        const link = image.closest('a');
        if (link) {
            if (typeof value.src === 'string' && value.src) {
                link.setAttribute('href', value.src);
            }

            const title = value.title || value.alt || '';
            if (title) {
                link.setAttribute('title', title);
            } else {
                link.removeAttribute('title');
            }
        }
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

    function renderReviewRating(rating) {
        const safeRating = Math.max(1, Math.min(5, Number(rating) || 5));
        return Array.from({ length: safeRating }, () => '<i class="fas fa-star"></i>').join('');
    }

    function applyReviewCard(node, item) {
        if (!node || !item) return;
        const rating = node.querySelector('.review-rating');
        const text = node.querySelector('p');
        const name = node.querySelector('.review-name');
        const meta = node.querySelector('.review-meta');
        const value = Math.max(1, Math.min(5, Number(item.rating) || 5));

        if (rating) {
            rating.setAttribute('aria-label', `Оценка ${value} из 5`);
            rating.innerHTML = renderReviewRating(value);
        }
        if (text) text.textContent = item.text || '';
        if (name) name.textContent = item.name || '';
        if (meta) meta.textContent = item.meta || '';
    }

    function syncReviewCards(items) {
        const container = document.querySelector('.reviews-grid');
        if (!container) return;
        syncCollection(container, '.review-card', items, applyReviewCard);
    }

    function applyReviewAction(node, action) {
        if (!node || !action) return;
        const className = action.style === 'secondary' ? 'btn btn-outline' : 'btn btn-primary';
        renderActionNode(node, action, className);
    }

    function syncReviewActions(items) {
        const container = document.querySelector('.reviews-section .btn-group');
        if (!container) return;
        syncCollection(container, 'a', items, applyReviewAction);
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

    function applyReviews(reviews) {
        const section = document.querySelector('.reviews-section');
        if (!section || !reviews) return;

        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');

        if (title) title.textContent = reviews.title || '';
        if (subtitle) subtitle.textContent = reviews.subtitle || '';
        syncReviewCards(reviews.items || []);
        syncReviewActions(reviews.actions || []);
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

        const reviewsTitle = document.querySelector('.reviews-section .section-title');
        const reviewsSubtitle = document.querySelector('.reviews-section .section-subtitle');
        if (reviewsTitle) bindings.push({ path: 'reviews.title', type: 'text', label: 'Заголовок блока отзывов', element: reviewsTitle });
        if (reviewsSubtitle) bindings.push({ path: 'reviews.subtitle', type: 'textarea', label: 'Подзаголовок блока отзывов', element: reviewsSubtitle });

        const buildReviewCardBinding = (targetItem, index) => ({
            path: `reviews.items.${index}`,
            type: 'object',
            editorKindLabel: 'Отзыв на странице',
            label: `Отзыв ${index + 1}`,
            element: targetItem,
            collectionPath: 'reviews.items',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.reviews-grid .review-card')[nextIndex];
                if (!nextItem) return null;
                return buildReviewCardBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    rating: 5,
                    text: 'Новый отзыв',
                    name: 'Новый клиент',
                    meta: 'Услуга'
                };
            },
            fields: [
                { key: 'rating', label: 'Оценка', type: 'text' },
                { key: 'text', label: 'Текст отзыва', type: 'textarea' },
                { key: 'name', label: 'Имя или компания', type: 'text' },
                { key: 'meta', label: 'Подпись', type: 'text' }
            ],
            collectionRender(items) {
                syncReviewCards(items);
            },
            render(value) {
                applyReviewCard(targetItem, value || {});
            }
        });

        document.querySelectorAll('.reviews-grid .review-card').forEach((cardElement, index) => {
            const textElement = cardElement.querySelector('p');
            const nameElement = cardElement.querySelector('.review-name');
            const metaElement = cardElement.querySelector('.review-meta');
            bindings.push(buildReviewCardBinding(cardElement, index));
            if (textElement) bindings.push({ path: `reviews.items.${index}.text`, type: 'textarea', label: `Отзыв ${index + 1}: текст`, element: textElement });
            if (nameElement) bindings.push({ path: `reviews.items.${index}.name`, type: 'text', label: `Отзыв ${index + 1}: имя`, element: nameElement });
            if (metaElement) bindings.push({ path: `reviews.items.${index}.meta`, type: 'text', label: `Отзыв ${index + 1}: подпись`, element: metaElement });
        });

        const buildReviewActionBinding = (targetItem, index) => ({
            path: `reviews.actions.${index}`,
            type: 'object',
            editorKindLabel: 'Кнопка на странице',
            label: `Кнопка блока отзывов ${index + 1}`,
            element: targetItem,
            collectionPath: 'reviews.actions',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.reviews-section .btn-group a')[nextIndex];
                if (!nextItem) return null;
                return buildReviewActionBinding(nextItem, nextIndex);
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
                syncReviewActions(items);
            },
            render(value) {
                applyReviewAction(targetItem, value || {});
            }
        });

        document.querySelectorAll('.reviews-section .btn-group a').forEach((actionElement, index) => {
            bindings.push(buildReviewActionBinding(actionElement, index));
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

    function normalizePath(input) {
        try {
            const url = new URL(input, window.location.origin);
            const path = url.pathname.replace(/\/+$/, '');
            return path === '' || path === '/' ? '/index.html' : path;
        } catch (error) {
            return '/index.html';
        }
    }

    function setTextContent(element, value) {
        if (!element) return;
        const nextValue = value || '';
        if (element.textContent !== nextValue) {
            element.textContent = nextValue;
        }
    }

    function setHtmlContent(element, html) {
        if (!element) return;
        const nextValue = html || '';
        if (element.innerHTML !== nextValue) {
            element.innerHTML = nextValue;
        }
    }

    function buildAbsoluteUrl(input) {
        try {
            return new URL(input || '/', window.location.origin).toString();
        } catch (error) {
            return window.location.origin;
        }
    }

    function buildCurrentLinkHref(href, currentPath) {
        try {
            const url = new URL(href || '/index.html', window.location.origin);
            const normalizedHref = normalizePath(url.pathname || '/index.html');

            if (currentPath === '/index.html' && normalizedHref === '/index.html') {
                return url.hash || '#top';
            }

            return `${url.pathname}${url.search}${url.hash}` || href || '#';
        } catch (error) {
            return href || '#';
        }
    }

    function resolveComparableHref(href) {
        try {
            const url = new URL(href || '/index.html', window.location.origin);
            const normalizedPath = normalizePath(url.pathname || '/index.html');
            const hash = url.hash || '';
            const search = url.search || '';
            return `${normalizedPath}${search}${hash}`;
        } catch (error) {
            return href || '';
        }
    }

    function currentHeroContactBlockMatches(site) {
        const addressNode = document.querySelector('.hero-header-address span');
        const phoneLinks = Array.from(document.querySelectorAll('.hero-header-link'));
        if (!addressNode || phoneLinks.length < 2) {
            return false;
        }

        const matchesPhone = (anchor, phone, fallbackNote = '') => {
            if (!anchor || !phone) return true;

            const main = anchor.querySelector('.hero-header-main');
            const sub = anchor.querySelector('.hero-header-sub');
            const expectedHref = phone.href || '#';
            const expectedLabel = phone.label || '';
            const expectedNote = phone.note || fallbackNote;

            return (anchor.getAttribute('href') || '') === expectedHref
                && (main?.textContent || '') === expectedLabel
                && (!sub || (
                    (sub.textContent || '') === expectedNote
                    && sub.hidden === !expectedNote
                ));
        };

        return matchesPhone(phoneLinks[0], site.contact?.primaryPhone)
            && matchesPhone(phoneLinks[1], site.contact?.secondaryPhone, 'Дополнительный номер')
            && (addressNode.textContent || '') === (site.contact?.address || '');
    }

    function currentHeroNavigationMatches(site) {
        const nav = document.querySelector('.hero-scene__nav');
        if (!nav) return true;

        const items = Array.isArray(site?.navigation) ? site.navigation : [];
        const anchors = Array.from(nav.querySelectorAll('.hero-nav__link'));
        if (anchors.length !== items.length) {
            return false;
        }

        const currentPath = normalizePath(window.location.pathname);
        return anchors.every((anchor, index) => {
            const item = items[index] || {};
            const expectedLabel = item.label || '';
            const expectedHref = buildCurrentLinkHref(item.href, currentPath);
            const expectedActive = normalizePath(item.href || '/index.html') === currentPath;
            const actualHref = resolveComparableHref(anchor.getAttribute('href') || '');
            const comparableExpectedHref = resolveComparableHref(expectedHref);

            return (anchor.textContent || '') === expectedLabel
                && actualHref === comparableExpectedHref
                && anchor.classList.contains('hero-nav__link--active') === expectedActive
                && (anchor.getAttribute('aria-current') === 'page') === expectedActive;
        });
    }

    function renderEyebrow(element, text) {
        if (!element) return;
        const icon = element.querySelector('i');
        const iconMarkup = icon
            ? `<i class="${escapeHtml(icon.className || '')}" aria-hidden="true"></i> `
            : '';
        setHtmlContent(element, `${iconMarkup}${escapeHtml(text || '')}`);
    }

    function renderCurrentHeroPhone(anchor, phone, fallbackNote = '') {
        if (!anchor || !phone) return;
        const nextHref = phone.href || '#';
        if (anchor.getAttribute('href') !== nextHref) {
            anchor.setAttribute('href', nextHref);
        }

        const main = anchor.querySelector('.hero-header-main');
        const sub = anchor.querySelector('.hero-header-sub');
        setTextContent(main, phone.label || '');

        if (sub) {
            const note = phone.note || fallbackNote;
            sub.hidden = !note;
            setTextContent(sub, note);
        }
    }

    function renderCurrentPanelAction(anchor, action, isLightCard) {
        if (!anchor || !action) return;
        const className = action.style === 'secondary'
            ? `panel-scene__action panel-scene__action--ghost${isLightCard ? ' panel-scene__action--ghost-light' : ''}`
            : 'panel-scene__action panel-scene__action--primary';
        renderActionNode(anchor, action, className);
    }

    function renderReviewStars(count) {
        const rating = Math.max(1, Math.min(5, Number(count) || 5));
        return Array.from({ length: rating }, () => '<i class="fas fa-star"></i>').join('');
    }

    function buildOpeningHours(hoursText) {
        const hours = String(hoursText || '').replace(/\s+/g, ' ').trim();
        const weekdays = hours.match(/Пн-Пт:\s*(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/i);
        const saturday = hours.match(/Сб:\s*(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/i);
        const values = [];

        if (weekdays) {
            values.push(`Mo-Fr ${weekdays[1]}-${weekdays[2]}`);
        }

        if (saturday) {
            values.push(`Sa ${saturday[1]}-${saturday[2]}`);
        }

        return values.length ? values : ['Mo-Fr 08:00-18:00', 'Sa 09:00-14:00'];
    }

    function isCurrentHomeTemplate() {
        return Boolean(
            document.querySelector('.hero-scene__nav') &&
            document.querySelector('.panel-scene__card') &&
            document.querySelector('.preview-footer')
        );
    }

    function applyCurrentNavigation(site) {
        const nav = document.querySelector('.hero-scene__nav');
        if (!nav) return;

        if (currentHeroNavigationMatches(site)) {
            return;
        }

        const currentPath = normalizePath(window.location.pathname);
        syncCollection(nav, '.hero-nav__link', site.navigation || [], (anchor, item) => {
            anchor.hidden = false;
            anchor.className = 'hero-nav__link';
            anchor.textContent = item.label || '';
            anchor.setAttribute('href', buildCurrentLinkHref(item.href, currentPath));

            const isActive = normalizePath(item.href || '/index.html') === currentPath;
            anchor.classList.toggle('hero-nav__link--active', isActive);
            if (isActive) {
                anchor.setAttribute('aria-current', 'page');
            } else {
                anchor.removeAttribute('aria-current');
            }
        });
    }

    function applyCurrentHero(site, hero) {
        const brandLink = document.querySelector('.hero-brand__link');
        const brandEyebrow = document.querySelector('.hero-brand__eyebrow');
        const brandName = document.querySelector('.hero-brand__name');
        const brandLogo = document.querySelector('.hero-brand__logo');
        const heroEyebrow = document.querySelector('.hero-copy__eyebrow');
        const titleMain = document.querySelector('.hero-copy__title-main');
        const titleSub = document.querySelector('.hero-copy__title-sub');
        const lead = document.querySelector('.hero-copy__lead');
        const features = document.querySelector('.hero-copy__features');
        const primaryAction = document.querySelector('.hero-copy__actions .apple-button--primary');
        const secondaryAction = document.querySelector('.hero-copy__actions .apple-button--ghost');
        const address = document.querySelector('.hero-header-address span');
        const phoneLinks = document.querySelectorAll('.hero-header-link');

        if (brandLink) {
            brandLink.setAttribute('href', '#top');
        }
        setTextContent(brandEyebrow, site.brand?.tagline || '');
        setTextContent(brandName, site.brand?.name || '');

        if (brandLogo && site.brand?.logo?.src) {
            brandLogo.setAttribute('src', site.brand.logo.src);
            brandLogo.setAttribute('alt', site.brand.logo.alt || site.brand.logoAlt || site.brand?.name || '');
        }

        renderEyebrow(heroEyebrow, hero.eyebrow || '');
        setTextContent(titleMain, hero.titleMain || '');
        setTextContent(titleSub, hero.titleSub || '');
        setTextContent(lead, hero.lead || '');

        if (features) {
            syncCollection(features, 'span', hero.features || [], (node, feature) => {
                setHtmlContent(node, `<i class="${escapeHtml(feature.icon || '')}" aria-hidden="true"></i> ${escapeHtml(feature.text || '')}`);
            });
        }

        if (primaryAction && hero.primaryAction) {
            renderActionNode(primaryAction, hero.primaryAction, 'apple-button apple-button--primary');
        }

        if (secondaryAction && hero.secondaryAction) {
            renderActionNode(secondaryAction, hero.secondaryAction, 'apple-button apple-button--ghost');
        }

        if (!currentHeroContactBlockMatches(site)) {
            if (phoneLinks[0] && site.contact?.primaryPhone) {
                renderCurrentHeroPhone(phoneLinks[0], site.contact.primaryPhone);
            }

            if (phoneLinks[1] && site.contact?.secondaryPhone) {
                renderCurrentHeroPhone(phoneLinks[1], site.contact.secondaryPhone, 'Дополнительный номер');
            }

            setTextContent(address, site.contact?.address || '');
        }

        applyCurrentNavigation(site);
    }

    function applyCurrentStatement(statement) {
        const heading = document.querySelector('.statement-scene h2');
        if (!heading || !statement) return;

        syncCollection(heading, 'span', statement.lines || [], (node, line) => {
            setTextContent(node, line || '');
        });
    }

    function applyCurrentPanel(card, data) {
        if (!card || !data) return;

        const isLightCard = card.classList.contains('panel-scene__card--light');
        const stamp = card.querySelector('.panel-scene__stamp');
        const viewerCaption = card.querySelector('[data-panel-caption]');
        const media = card.querySelector('.panel-scene__media');
        const dotsContainer = card.querySelector('[data-panel-dots]');
        const chip = card.querySelector('.scene-chip');
        const eyebrow = card.querySelector('.panel-scene__eyebrow');
        const title = card.querySelector('.panel-scene__copy-block h3');
        const lead = card.querySelector('.panel-scene__copy-block p');
        const facts = card.querySelector('.panel-scene__facts');
        const items = card.querySelector('.panel-scene__items');
        const trust = card.querySelector('.panel-scene__trust');
        const actions = card.querySelector('.panel-scene__actions');
        const slides = Array.isArray(data.slides) ? data.slides : [];

        if (stamp) {
            syncCollection(stamp, 'span', data.mediaTags || [], (node, value) => {
                setTextContent(node, value || '');
            });
        }

        if (media) {
            syncCollection(media, '.panel-scene__image', slides, (image, slide, index) => {
                image.hidden = false;
                image.classList.toggle('is-active', index === 0);
                image.setAttribute('src', slide.src || '');
                image.setAttribute('alt', slide.alt || '');
                image.dataset.caption = slide.caption || '';
                if (slide.width) image.setAttribute('width', String(slide.width));
                if (slide.height) image.setAttribute('height', String(slide.height));
            });
        }

        if (dotsContainer) {
            syncCollection(dotsContainer, '.panel-scene__dot', slides, (dot, slide, index) => {
                dot.hidden = false;
                dot.classList.toggle('is-active', index === 0);
                dot.setAttribute('aria-label', slide.caption || `Слайд ${index + 1}`);
            });
        }

        setTextContent(viewerCaption, slides[0]?.caption || '');
        setTextContent(chip, data.chipLabel || '');
        renderEyebrow(eyebrow, data.eyebrow || '');
        setTextContent(title, data.title || '');
        setTextContent(lead, data.lead || '');

        if (facts) {
            syncCollection(facts, '.panel-scene__fact', data.facts || [], (node, fact) => {
                setTextContent(node.querySelector('strong'), fact.value || '');
                setTextContent(node.querySelector('span'), fact.text || '');
            });
        }

        if (items) {
            syncCollection(items, '.panel-scene__item', data.items || [], (node, item) => {
                node.hidden = false;
                node.setAttribute('href', item.href || '#');
                setTextContent(node.querySelector('strong'), item.title || '');
                setTextContent(node.querySelector('span'), item.text || '');
            });
        }

        setTextContent(trust, data.trust || '');

        if (actions) {
            syncCollection(actions, 'a', data.actions || [], (anchor, action) => {
                renderCurrentPanelAction(anchor, action, isLightCard);
            });
        }
    }

    function applyCurrentDirections(directions) {
        if (!directions) return;
        const cards = document.querySelectorAll('.panel-scene__card');
        applyCurrentPanel(cards[0], directions.gates);
        applyCurrentPanel(cards[1], directions.coating);

        document.dispatchEvent(new CustomEvent('pokraska:panel-galleries-updated', {
            detail: {
                root: document.querySelector('.panel-scene') || document
            }
        }));
    }

    function applyCurrentProcess(process) {
        if (!process) return;
        const intro = document.querySelector('.route-scene__intro');
        const facts = document.querySelector('.route-scene__facts');
        const steps = document.querySelector('.route-scene__steps');

        renderEyebrow(intro?.querySelector('.route-scene__eyebrow'), process.eyebrow || '');
        setTextContent(intro?.querySelector('h3'), process.title || '');
        setTextContent(intro?.querySelector('p'), process.subtitle || '');

        if (facts) {
            syncCollection(facts, '.route-scene__fact', process.facts || [], (node, fact) => {
                setTextContent(node.querySelector('strong'), fact.value || '');
                setTextContent(node.querySelector('span'), fact.text || '');
            });
        }

        if (steps) {
            syncCollection(steps, '.route-step', process.steps || [], (node, step) => {
                const icon = node.querySelector('i');
                if (icon && step.icon) {
                    icon.className = step.icon;
                    icon.setAttribute('aria-hidden', 'true');
                }
                setTextContent(node.querySelector('h4'), step.title || '');
                setTextContent(node.querySelector('p'), step.text || '');
            });
        }
    }

    function applyCurrentReviews(reviews) {
        if (!reviews) return;
        const intro = document.querySelector('.reviews-scene__intro');
        const grid = document.querySelector('.reviews-scene__grid');

        renderEyebrow(intro?.querySelector('.route-scene__eyebrow'), reviews.eyebrow || reviews.title || '');
        setTextContent(intro?.querySelector('h3'), reviews.subtitle || reviews.title || '');
        setTextContent(intro?.querySelector('p'), reviews.lead || '');

        if (grid) {
            syncCollection(grid, '.reviews-scene__card', reviews.items || [], (node, item) => {
                const rating = node.querySelector('.reviews-scene__rating');
                if (rating) {
                    setHtmlContent(rating, renderReviewStars(item.rating));
                }
                setTextContent(node.querySelector('p'), item.text || '');
                setTextContent(node.querySelector('.reviews-scene__author strong'), item.name || '');
                setTextContent(node.querySelector('.reviews-scene__author span'), item.meta || '');
            });
        }
    }

    function applyCurrentPartners(partners) {
        if (!partners) return;
        const section = document.querySelector('.home-tail__section--brands');
        const grid = section?.querySelector('.home-tail__brands');

        renderEyebrow(section?.querySelector('.route-scene__eyebrow'), partners.eyebrow || '');
        setTextContent(section?.querySelector('h3'), partners.title || '');
        setTextContent(section?.querySelector('p'), partners.subtitle || '');

        if (grid) {
            syncCollection(grid, '.home-tail__brand', partners.items || [], (node, item) => {
                const brandSlug = String(item.slug || item.alt || item.title || '')
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');

                if (brandSlug) {
                    node.setAttribute('data-brand', brandSlug);
                } else {
                    node.removeAttribute('data-brand');
                }

                const image = node.querySelector('img');
                if (!image) return;
                image.setAttribute('src', item.src || '');
                image.setAttribute('alt', item.alt || '');
                if (item.title) {
                    image.setAttribute('title', item.title);
                } else {
                    image.removeAttribute('title');
                }
            });
        }
    }

    function syncCurrentPhoneLinks(contactBlock, items) {
        if (!contactBlock) return;

        const actionContainer = contactBlock.querySelector('.home-tail__contact-actions');
        const existingLinks = Array.from(contactBlock.querySelectorAll('.home-tail__contact-link'));
        const template = existingLinks[0];
        if (!template) return;

        while (contactBlock.querySelectorAll('.home-tail__contact-link').length < items.length) {
            const clone = template.cloneNode(true);
            resetInlineMarkers(clone);
            contactBlock.insertBefore(clone, actionContainer || null);
        }

        const links = Array.from(contactBlock.querySelectorAll('.home-tail__contact-link'));
        links.forEach((anchor, index) => {
            const item = items[index];
            anchor.hidden = !item;
            if (!item) return;
            anchor.setAttribute('href', item.href || '#');
            const icon = anchor.querySelector('i');
            if (icon && item.icon) {
                icon.className = item.icon;
                icon.setAttribute('aria-hidden', 'true');
            }
            setTextContent(anchor.querySelector('span'), item.label || '');
        });
    }

    function applyCurrentRequest(request) {
        if (!request) return;
        const section = document.querySelector('.home-tail__section--request');
        const requestCopy = section?.querySelector('.home-tail__request-copy');
        const formCard = section?.querySelector('.home-tail__form-card');
        const contactBlock = section?.querySelector('.home-tail__contact');
        const actionContainer = section?.querySelector('.home-tail__contact-actions');
        const phoneItems = (request.contactLines || []).filter((item) => String(item.href || '').startsWith('tel:'));
        const actionItems = (request.contactLines || []).filter((item) => !String(item.href || '').startsWith('tel:'));

        renderEyebrow(requestCopy?.querySelector('.route-scene__eyebrow'), request.eyebrow || '');
        setTextContent(requestCopy?.querySelector('h3'), request.title || '');
        setTextContent(requestCopy?.querySelector('p'), request.lead || '');

        const advantages = requestCopy?.querySelector('.home-tail__advantages');
        if (advantages) {
            syncCollection(advantages, 'span', request.advantages || [], (node, value) => {
                setHtmlContent(node, `<i class="fas fa-check-circle" aria-hidden="true"></i> ${escapeHtml(value || '')}`);
            });
        }

        setTextContent(contactBlock?.querySelector('.home-tail__contact-eyebrow'), request.contactTitle || '');
        setTextContent(contactBlock?.querySelector('p'), request.contactIntro || '');
        syncCurrentPhoneLinks(contactBlock, phoneItems);

        if (actionContainer) {
            syncCollection(actionContainer, 'a', actionItems, (anchor, action) => {
                renderActionNode(anchor, action, 'panel-scene__action panel-scene__action--ghost panel-scene__action--ghost-light');
            });
        }

        setTextContent(formCard?.querySelector('.home-tail__form-eyebrow'), request.formEyebrow || '');
        setTextContent(formCard?.querySelector('h4'), request.formTitle || '');
        setTextContent(formCard?.querySelector('p'), request.formNotice || '');

        const iframe = formCard?.querySelector('.home-tail__iframe');
        if (iframe && request.iframeSrc) {
            iframe.setAttribute('src', request.iframeSrc);
        }
    }

    function applyCurrentFooter(site) {
        if (!site) return;

        const footerBrand = document.querySelector('.preview-footer__brand');
        const footerLogo = document.querySelector('.preview-footer__logo');
        const companyTitle = document.querySelector('.preview-footer__company');
        const companyText = document.querySelectorAll('.preview-footer__legal-text');
        const usefulLabel = document.querySelector('.preview-footer__column--useful .preview-footer__label');
        const contactList = document.querySelector('.preview-footer__list--contacts');
        const usefulList = document.querySelector('.preview-footer__column--useful .preview-footer__list');
        const bottom = document.querySelector('.preview-footer__bottom');
        const currentYear = new Date().getFullYear();
        const startYear = Number(site.brand?.copyrightStartYear) || currentYear;
        const yearRange = startYear >= currentYear ? `${currentYear}` : `${startYear}-${currentYear}`;

        if (footerBrand) {
            footerBrand.setAttribute('href', '#top');
        }

        if (footerLogo && site.brand?.logo?.src) {
            footerLogo.setAttribute('src', site.brand.logo.src);
            footerLogo.setAttribute('alt', site.brand.logo.alt || site.brand.logoAlt || site.brand?.name || '');
        }

        setTextContent(companyTitle, site.footer?.companyTitle || '');
        companyText.forEach((paragraph, index) => {
            setTextContent(paragraph, site.footer?.companyParagraphs?.[index] || '');
        });
        setTextContent(usefulLabel, site.footer?.usefulTitle || 'Полезное');

        if (contactList) {
            setHtmlContent(contactList, `
                <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${escapeHtml(site.contact?.address || '')}</li>
                <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.primaryPhone?.href || '#')}">${escapeHtml(site.contact?.primaryPhone?.label || '')}</a></li>
                <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.secondaryPhone?.href || '#')}">${escapeHtml(site.contact?.secondaryPhone?.label || '')}</a></li>
                <li><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:${escapeHtml(site.contact?.email || '')}">${escapeHtml(site.contact?.email || '')}</a></li>
                <li><i class="fas fa-clock" aria-hidden="true"></i> ${escapeHtml(site.contact?.hours || '')}</li>
                <li><i class="fab fa-telegram-plane" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.telegram?.href || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contact?.telegram?.label || 'Telegram')}</a></li>
                <li><i class="fas fa-comment-dots" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.max?.href || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contact?.max?.label || 'Max')}</a></li>
            `);
        }

        if (usefulList) {
            setHtmlContent(usefulList, (site.footer?.usefulLinks || []).map((item) => `
                <li><a href="${escapeHtml(buildCurrentLinkHref(item.href, normalizePath(window.location.pathname)))}">${escapeHtml(item.label || '')}</a></li>
            `).join(''));
        }

        if (bottom) {
            const paragraphs = bottom.querySelectorAll('p');
            setHtmlContent(paragraphs[0], `&copy; ${escapeHtml(yearRange)} ${escapeHtml(site.brand?.footerCaption || site.brand?.name || '')}`);
            setHtmlContent(paragraphs[1], `<a href="${escapeHtml(site.footer?.policyHref || '#')}">${escapeHtml(site.footer?.policyLabel || '')}</a> | Домен: ${escapeHtml(site.brand?.domain || '')}`);
        }
    }

    function applyCurrentStructuredData(site) {
        const script = document.getElementById('home-structured-data');
        if (!script || !site) return;

        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${buildAbsoluteUrl('/')}#business`,
            name: site.brand?.name || '',
            image: ogImage || buildAbsoluteUrl('/assets/images/hero/home-hero-main.jpg'),
            url: buildAbsoluteUrl('/'),
            telephone: [site.contact?.primaryPhone?.label, site.contact?.secondaryPhone?.label].filter(Boolean),
            email: site.contact?.email || '',
            address: {
                '@type': 'PostalAddress',
                streetAddress: site.contact?.address || '',
                addressLocality: 'Казань',
                addressCountry: 'RU'
            },
            openingHours: buildOpeningHours(site.contact?.hours),
            priceRange: '₽₽',
            areaServed: 'Казань',
            sameAs: [site.contact?.telegram?.href, site.contact?.max?.href].filter(Boolean)
        };

        script.textContent = JSON.stringify(jsonLd, null, 4);
    }

    function applyCurrentHomeTemplate(site, home) {
        applyCurrentHero(site, home.hero || {});
        applyCurrentStatement(home.statement || {});
        applyCurrentDirections(home.directions || {});
        applyCurrentProcess(home.process || {});
        applyCurrentReviews(home.reviews || {});
        applyCurrentPartners(home.partners || {});
        applyCurrentRequest(home.request || {});
        applyCurrentFooter(site);
        applyCurrentStructuredData(site);
    }

    function registerCurrentInlineBindings(home) {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const requestContactLines = Array.isArray(home?.request?.contactLines) ? home.request.contactLines : [];
        const requestPhoneLineRefs = requestContactLines
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => String(item.href || '').startsWith('tel:'));
        const requestActionLineRefs = requestContactLines
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => !String(item.href || '').startsWith('tel:'));

        const heroEyebrow = document.querySelector('.hero-copy__eyebrow');
        const heroTitleMain = document.querySelector('.hero-copy__title-main');
        const heroTitleSub = document.querySelector('.hero-copy__title-sub');
        const heroLead = document.querySelector('.hero-copy__lead');
        const heroPrimaryAction = document.querySelector('.hero-copy__actions .apple-button--primary');
        const heroSecondaryAction = document.querySelector('.hero-copy__actions .apple-button--ghost');

        if (heroEyebrow) {
            bindings.push({
                path: 'hero.eyebrow',
                type: 'text',
                label: 'Надзаголовок первого экрана',
                element: heroEyebrow,
                render(value, binding) {
                    binding.elements.forEach((element) => renderEyebrow(element, value || ''));
                }
            });
        }
        if (heroTitleMain) bindings.push({ path: 'hero.titleMain', type: 'text', label: 'Главный заголовок', element: heroTitleMain });
        if (heroTitleSub) bindings.push({ path: 'hero.titleSub', type: 'text', label: 'Вторая строка заголовка', element: heroTitleSub });
        if (heroLead) bindings.push({ path: 'hero.lead', type: 'textarea', label: 'Подзаголовок первого экрана', element: heroLead });

        document.querySelectorAll('.hero-copy__features span').forEach((featureElement, index) => {
            bindings.push({
                path: `hero.features.${index}`,
                type: 'object',
                label: `Преимущество первого экрана ${index + 1}`,
                element: featureElement,
                fields: [
                    { key: 'icon', label: 'Иконка', type: 'text' },
                    { key: 'text', label: 'Текст', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        setHtmlContent(element, `<i class="${escapeHtml(value?.icon || '')}" aria-hidden="true"></i> ${escapeHtml(value?.text || '')}`);
                    });
                }
            });
        });

        if (heroPrimaryAction) {
            bindings.push({
                path: 'hero.primaryAction',
                type: 'object',
                label: 'Главная кнопка первого экрана',
                element: heroPrimaryAction,
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderActionNode(element, value || {}, 'apple-button apple-button--primary'));
                }
            });
        }

        if (heroSecondaryAction) {
            bindings.push({
                path: 'hero.secondaryAction',
                type: 'object',
                label: 'Вторая кнопка первого экрана',
                element: heroSecondaryAction,
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderActionNode(element, value || {}, 'apple-button apple-button--ghost'));
                }
            });
        }

        document.querySelectorAll('.statement-scene h2 span').forEach((lineElement, index) => {
            bindings.push({
                path: `statement.lines.${index}`,
                type: 'text',
                label: `Тезис в большом блоке ${index + 1}`,
                element: lineElement
            });
        });

        [
            { key: 'gates', label: 'карточки ворот', card: document.querySelector('.panel-scene__card--dark') },
            { key: 'coating', label: 'карточки покраски', card: document.querySelector('.panel-scene__card--light') }
        ].forEach(({ key, label, card }) => {
            if (!card) return;

            const chip = card.querySelector('.scene-chip');
            const eyebrow = card.querySelector('.panel-scene__eyebrow');
            const title = card.querySelector('.panel-scene__copy-block h3');
            const lead = card.querySelector('.panel-scene__copy-block p');
            const trust = card.querySelector('.panel-scene__trust');
            const isLightCard = card.classList.contains('panel-scene__card--light');

            if (chip) bindings.push({ path: `directions.${key}.chipLabel`, type: 'text', label: `Плашка ${label}`, element: chip });
            if (eyebrow) {
                bindings.push({
                    path: `directions.${key}.eyebrow`,
                    type: 'text',
                    label: `Надзаголовок ${label}`,
                    element: eyebrow,
                    render(value, binding) {
                        binding.elements.forEach((element) => renderEyebrow(element, value || ''));
                    }
                });
            }
            if (title) bindings.push({ path: `directions.${key}.title`, type: 'text', label: `Заголовок ${label}`, element: title });
            if (lead) bindings.push({ path: `directions.${key}.lead`, type: 'textarea', label: `Описание ${label}`, element: lead });
            if (trust) bindings.push({ path: `directions.${key}.trust`, type: 'textarea', label: `Подсказка ${label}`, element: trust });

            card.querySelectorAll('.panel-scene__fact').forEach((factElement, index) => {
                const valueElement = factElement.querySelector('strong');
                const textElement = factElement.querySelector('span');
                if (valueElement) {
                    bindings.push({
                        path: `directions.${key}.facts.${index}.value`,
                        type: 'text',
                        label: `Факт ${label} ${index + 1}: значение`,
                        element: valueElement
                    });
                }
                if (textElement) {
                    bindings.push({
                        path: `directions.${key}.facts.${index}.text`,
                        type: 'textarea',
                        label: `Факт ${label} ${index + 1}: описание`,
                        element: textElement
                    });
                }
            });

            card.querySelectorAll('.panel-scene__item').forEach((itemElement, index) => {
                const titleElement = itemElement.querySelector('strong');
                const textElement = itemElement.querySelector('span');
                if (titleElement) {
                    bindings.push({
                        path: `directions.${key}.items.${index}.title`,
                        type: 'text',
                        label: `Пункт ${label} ${index + 1}: заголовок`,
                        element: titleElement
                    });
                }
                if (textElement) {
                    bindings.push({
                        path: `directions.${key}.items.${index}.text`,
                        type: 'textarea',
                        label: `Пункт ${label} ${index + 1}: описание`,
                        element: textElement
                    });
                }
            });

            card.querySelectorAll('.panel-scene__actions a').forEach((actionElement, index) => {
                bindings.push({
                    path: `directions.${key}.actions.${index}`,
                    type: 'object',
                    label: `Кнопка ${label} ${index + 1}`,
                    element: actionElement,
                    fields: [
                        { key: 'label', label: 'Текст кнопки', type: 'text' },
                        { key: 'href', label: 'Ссылка', type: 'text' },
                        { key: 'icon', label: 'Иконка', type: 'text' },
                        { key: 'style', label: 'Стиль (primary/secondary)', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => renderCurrentPanelAction(element, value || {}, isLightCard));
                    }
                });
            });
        });

        const processEyebrow = document.querySelector('.route-scene__intro .route-scene__eyebrow');
        const processTitle = document.querySelector('.route-scene__intro h3');
        const processSubtitle = document.querySelector('.route-scene__intro p');
        if (processEyebrow) {
            bindings.push({
                path: 'process.eyebrow',
                type: 'text',
                label: 'Надзаголовок блока процесса',
                element: processEyebrow,
                render(value, binding) {
                    binding.elements.forEach((element) => renderEyebrow(element, value || ''));
                }
            });
        }
        if (processTitle) bindings.push({ path: 'process.title', type: 'text', label: 'Заголовок блока процесса', element: processTitle });
        if (processSubtitle) bindings.push({ path: 'process.subtitle', type: 'textarea', label: 'Описание блока процесса', element: processSubtitle });

        document.querySelectorAll('.route-scene__fact').forEach((factElement, index) => {
            const valueElement = factElement.querySelector('strong');
            const textElement = factElement.querySelector('span');
            if (valueElement) {
                bindings.push({
                    path: `process.facts.${index}.value`,
                    type: 'text',
                    label: `Факт процесса ${index + 1}: значение`,
                    element: valueElement
                });
            }
            if (textElement) {
                bindings.push({
                    path: `process.facts.${index}.text`,
                    type: 'textarea',
                    label: `Факт процесса ${index + 1}: описание`,
                    element: textElement
                });
            }
        });

        document.querySelectorAll('.route-step').forEach((stepElement, index) => {
            const iconElement = stepElement.querySelector('i');
            const titleElement = stepElement.querySelector('h4');
            const textElement = stepElement.querySelector('p');
            if (iconElement) {
                bindings.push({
                    path: `process.steps.${index}.icon`,
                    type: 'text',
                    label: `Шаг процесса ${index + 1}: иконка`,
                    element: iconElement,
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            element.className = value || 'fas fa-circle';
                            element.setAttribute('aria-hidden', 'true');
                        });
                    }
                });
            }
            if (titleElement) {
                bindings.push({
                    path: `process.steps.${index}.title`,
                    type: 'text',
                    label: `Шаг процесса ${index + 1}: заголовок`,
                    element: titleElement
                });
            }
            if (textElement) {
                bindings.push({
                    path: `process.steps.${index}.text`,
                    type: 'textarea',
                    label: `Шаг процесса ${index + 1}: описание`,
                    element: textElement
                });
            }
        });

        const reviewsEyebrow = document.querySelector('.reviews-scene__intro .route-scene__eyebrow');
        const reviewsTitle = document.querySelector('.reviews-scene__intro h3');
        const reviewsLead = document.querySelector('.reviews-scene__intro p');
        if (reviewsEyebrow) {
            bindings.push({
                path: 'reviews.eyebrow',
                type: 'text',
                label: 'Надзаголовок блока отзывов',
                element: reviewsEyebrow,
                render(value, binding) {
                    binding.elements.forEach((element) => renderEyebrow(element, value || ''));
                }
            });
        }
        if (reviewsTitle) bindings.push({ path: 'reviews.subtitle', type: 'text', label: 'Заголовок блока отзывов', element: reviewsTitle });
        if (reviewsLead) bindings.push({ path: 'reviews.lead', type: 'textarea', label: 'Описание блока отзывов', element: reviewsLead });

        document.querySelectorAll('.reviews-scene__card').forEach((cardElement, index) => {
            const ratingElement = cardElement.querySelector('.reviews-scene__rating');
            const textElement = cardElement.querySelector('p');
            const nameElement = cardElement.querySelector('.reviews-scene__author strong');
            const metaElement = cardElement.querySelector('.reviews-scene__author span');
            if (ratingElement) {
                bindings.push({
                    path: `reviews.items.${index}.rating`,
                    type: 'text',
                    label: `Отзыв ${index + 1}: рейтинг`,
                    element: ratingElement,
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            setHtmlContent(element, renderReviewStars(value));
                        });
                    }
                });
            }
            if (textElement) {
                bindings.push({
                    path: `reviews.items.${index}.text`,
                    type: 'textarea',
                    label: `Отзыв ${index + 1}: текст`,
                    element: textElement
                });
            }
            if (nameElement) {
                bindings.push({
                    path: `reviews.items.${index}.name`,
                    type: 'text',
                    label: `Отзыв ${index + 1}: автор`,
                    element: nameElement
                });
            }
            if (metaElement) {
                bindings.push({
                    path: `reviews.items.${index}.meta`,
                    type: 'text',
                    label: `Отзыв ${index + 1}: подпись`,
                    element: metaElement
                });
            }
        });

        const partnersSection = document.querySelector('.home-tail__section--brands');
        const partnersEyebrow = partnersSection?.querySelector('.route-scene__eyebrow');
        const partnersTitle = partnersSection?.querySelector('h3');
        const partnersSubtitle = partnersSection?.querySelector('p');
        if (partnersEyebrow) {
            bindings.push({
                path: 'partners.eyebrow',
                type: 'text',
                label: 'Надзаголовок блока брендов',
                element: partnersEyebrow,
                render(value, binding) {
                    binding.elements.forEach((element) => renderEyebrow(element, value || ''));
                }
            });
        }
        if (partnersTitle) bindings.push({ path: 'partners.title', type: 'text', label: 'Заголовок блока брендов', element: partnersTitle });
        if (partnersSubtitle) bindings.push({ path: 'partners.subtitle', type: 'textarea', label: 'Описание блока брендов', element: partnersSubtitle });

        partnersSection?.querySelectorAll('.home-tail__brand img').forEach((imageElement, index) => {
            bindings.push({
                path: `partners.items.${index}`,
                type: 'image',
                label: `Логотип бренда ${index + 1}`,
                element: imageElement,
                defaultValue: () => extractImageBindingValue(imageElement),
                directory: extractDirectoryFromSrc(imageElement.getAttribute('src') || '', 'assets/images/catalog'),
                fields: [
                    { key: 'alt', label: 'Alt', type: 'text' },
                    { key: 'title', label: 'Title', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => applyImageBindingValue(element, value || {}));
                }
            });
        });

        const requestSection = document.querySelector('.home-tail__section--request');
        const requestEyebrow = requestSection?.querySelector('.home-tail__request-copy .route-scene__eyebrow');
        const requestTitle = requestSection?.querySelector('.home-tail__request-copy h3');
        const requestLead = requestSection?.querySelector('.home-tail__request-copy > p');
        const requestContactTitle = requestSection?.querySelector('.home-tail__contact-eyebrow');
        const requestContactIntro = requestSection?.querySelector('.home-tail__contact > p');
        const requestFormEyebrow = requestSection?.querySelector('.home-tail__form-eyebrow');
        const requestFormTitle = requestSection?.querySelector('.home-tail__form-card h4');
        const requestFormNotice = requestSection?.querySelector('.home-tail__form-card p');

        if (requestEyebrow) {
            bindings.push({
                path: 'request.eyebrow',
                type: 'text',
                label: 'Надзаголовок блока заявки',
                element: requestEyebrow,
                render(value, binding) {
                    binding.elements.forEach((element) => renderEyebrow(element, value || ''));
                }
            });
        }
        if (requestTitle) bindings.push({ path: 'request.title', type: 'text', label: 'Заголовок блока заявки', element: requestTitle });
        if (requestLead) bindings.push({ path: 'request.lead', type: 'textarea', label: 'Описание блока заявки', element: requestLead });
        if (requestContactTitle) bindings.push({ path: 'request.contactTitle', type: 'text', label: 'Заголовок быстрого контакта', element: requestContactTitle });
        if (requestContactIntro) bindings.push({ path: 'request.contactIntro', type: 'textarea', label: 'Описание быстрого контакта', element: requestContactIntro });
        if (requestFormEyebrow) bindings.push({ path: 'request.formEyebrow', type: 'text', label: 'Надзаголовок формы', element: requestFormEyebrow });
        if (requestFormTitle) bindings.push({ path: 'request.formTitle', type: 'text', label: 'Заголовок формы', element: requestFormTitle });
        if (requestFormNotice) bindings.push({ path: 'request.formNotice', type: 'textarea', label: 'Текст над формой', element: requestFormNotice });

        requestSection?.querySelectorAll('.home-tail__advantages span').forEach((advantageElement, index) => {
            bindings.push({
                path: `request.advantages.${index}`,
                type: 'text',
                label: `Преимущество в блоке заявки ${index + 1}`,
                element: advantageElement,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        setHtmlContent(element, `<i class="fas fa-check-circle" aria-hidden="true"></i> ${escapeHtml(value || '')}`);
                    });
                }
            });
        });

        requestSection?.querySelectorAll('.home-tail__contact-link').forEach((linkElement, index) => {
            const ref = requestPhoneLineRefs[index];
            if (!ref) return;

            bindings.push({
                path: `request.contactLines.${ref.index}`,
                type: 'object',
                label: `Телефон в быстром контакте ${index + 1}`,
                element: linkElement,
                fields: [
                    { key: 'label', label: 'Подпись', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.setAttribute('href', value?.href || '#');
                        const icon = element.querySelector('i');
                        if (icon) {
                            icon.className = value?.icon || icon.className;
                            icon.setAttribute('aria-hidden', 'true');
                        }
                        setTextContent(element.querySelector('span'), value?.label || '');
                    });
                }
            });
        });

        requestSection?.querySelectorAll('.home-tail__contact-actions a').forEach((actionElement, index) => {
            const ref = requestActionLineRefs[index];
            if (!ref) return;

            bindings.push({
                path: `request.contactLines.${ref.index}`,
                type: 'object',
                label: `Мессенджер в быстром контакте ${index + 1}`,
                element: actionElement,
                fields: [
                    { key: 'label', label: 'Подпись', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        renderActionNode(element, value || {}, 'panel-scene__action panel-scene__action--ghost panel-scene__action--ghost-light');
                    });
                }
            });
        });

        const requestIframe = requestSection?.querySelector('.home-tail__iframe');
        if (requestIframe) {
            bindings.push({
                path: 'request.iframeSrc',
                type: 'text',
                label: 'Ссылка на форму заявки',
                element: requestIframe,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.setAttribute('src', value || '');
                    });
                }
            });
        }

        if (!bindings.length) return;

        queueInlineBindings({
            fileName: 'home',
            sectionKey: 'home',
            sectionLabel: 'Главная страница',
            bindings
        });
    }

    function registerCurrentSiteInlineBindings(site) {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const currentPath = normalizePath(window.location.pathname);
        const heroBrandEyebrow = document.querySelector('.hero-brand__eyebrow');
        const heroBrandName = document.querySelector('.hero-brand__name');
        const logoImages = Array.from(document.querySelectorAll('.hero-brand__logo, .preview-footer__logo'));
        const heroPrimaryPhone = document.querySelector('.hero-header-link--primary');
        const heroSecondaryPhone = document.querySelector('.hero-header-link--secondary');
        const footerContactAnchors = Array.from(document.querySelectorAll('.preview-footer__list--contacts a'));
        const footerPrimaryPhone = footerContactAnchors.find((anchor) => String(anchor.getAttribute('href') || '').startsWith('tel:+79376154629') || /937/.test(anchor.textContent));
        const footerSecondaryPhone = footerContactAnchors.find((anchor) => String(anchor.getAttribute('href') || '').startsWith('tel:+79625542260') || /962/.test(anchor.textContent));
        const footerEmail = footerContactAnchors.find((anchor) => String(anchor.getAttribute('href') || '').startsWith('mailto:'));
        const footerTelegram = footerContactAnchors.find((anchor) => /telegram/i.test(anchor.textContent));
        const footerMax = footerContactAnchors.find((anchor) => /max/i.test(anchor.textContent));
        const footerAddressItem = document.querySelector('.preview-footer__list--contacts li:first-child');
        const footerHoursItem = Array.from(document.querySelectorAll('.preview-footer__list--contacts li')).find((item) => item.querySelector('.fa-clock'));
        const heroAddress = document.querySelector('.hero-header-address span');
        const footerCompanyTitle = document.querySelector('.preview-footer__company');
        const footerCompanyParagraphs = document.querySelectorAll('.preview-footer__legal-text');
        const footerUsefulTitle = document.querySelector('.preview-footer__column--useful .preview-footer__label');
        const footerUsefulItems = document.querySelectorAll('.preview-footer__column--useful .preview-footer__list li');
        const footerPolicy = document.querySelector('.preview-footer__bottom p:last-child a');

        if (heroBrandEyebrow) bindings.push({ path: 'brand.tagline', type: 'text', label: 'Слоган бренда в hero-шапке', element: heroBrandEyebrow });
        if (heroBrandName) bindings.push({ path: 'brand.name', type: 'text', label: 'Название бренда в hero-шапке', element: heroBrandName });

        if (logoImages.length) {
            bindings.push({
                path: 'brand.logo',
                type: 'image',
                label: 'Логотип сайта на главной',
                element: logoImages,
                defaultValue: () => extractImageBindingValue(logoImages[0]),
                directory: extractDirectoryFromSrc(logoImages[0]?.getAttribute('src') || '', 'assets/images'),
                fields: [
                    { key: 'alt', label: 'Alt', type: 'text' },
                    { key: 'title', label: 'Title', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => applyImageBindingValue(element, value || {}));
                }
            });
        }

        if (heroPrimaryPhone || footerPrimaryPhone) {
            bindings.push({
                path: 'contact.primaryPhone',
                type: 'object',
                label: 'Основной телефон на главной',
                element: [heroPrimaryPhone, footerPrimaryPhone].filter(Boolean),
                fields: [
                    { key: 'label', label: 'Номер', type: 'text' },
                    { key: 'href', label: 'Ссылка tel:', type: 'text' },
                    { key: 'note', label: 'Подпись', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        if (element.classList.contains('hero-header-link')) {
                            renderCurrentHeroPhone(element, value || {});
                            return;
                        }

                        element.setAttribute('href', value?.href || '#');
                        setTextContent(element, value?.label || '');
                    });
                }
            });
        }

        if (heroSecondaryPhone || footerSecondaryPhone) {
            bindings.push({
                path: 'contact.secondaryPhone',
                type: 'object',
                label: 'Второй телефон на главной',
                element: [heroSecondaryPhone, footerSecondaryPhone].filter(Boolean),
                fields: [
                    { key: 'label', label: 'Номер', type: 'text' },
                    { key: 'href', label: 'Ссылка tel:', type: 'text' },
                    { key: 'note', label: 'Подпись', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        if (element.classList.contains('hero-header-link')) {
                            renderCurrentHeroPhone(element, value || {}, 'Дополнительный номер');
                            return;
                        }

                        element.setAttribute('href', value?.href || '#');
                        setTextContent(element, value?.label || '');
                    });
                }
            });
        }

        if (heroAddress || footerAddressItem) {
            bindings.push({
                path: 'contact.address',
                type: 'text',
                label: 'Адрес на главной',
                element: [heroAddress, footerAddressItem].filter(Boolean),
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        if (element.tagName === 'LI') {
                            element.innerHTML = `<i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${escapeHtml(value || '')}`;
                            return;
                        }

                        setTextContent(element, value || '');
                    });
                }
            });
        }

        document.querySelectorAll('.hero-scene__nav .hero-nav__link').forEach((linkElement, index) => {
            bindings.push({
                path: `navigation.${index}`,
                type: 'object',
                label: `Пункт hero-навигации ${index + 1}`,
                element: linkElement,
                fields: [
                    { key: 'label', label: 'Название', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.hidden = false;
                        element.className = 'hero-nav__link';
                        setTextContent(element, value?.label || '');
                        element.setAttribute('href', buildCurrentLinkHref(value?.href || '/index.html', currentPath));
                        const isActive = normalizePath(value?.href || '/index.html') === currentPath;
                        element.classList.toggle('hero-nav__link--active', isActive);
                        if (isActive) {
                            element.setAttribute('aria-current', 'page');
                        } else {
                            element.removeAttribute('aria-current');
                        }
                    });
                }
            });
        });

        if (footerTelegram) {
            bindings.push({
                path: 'contact.telegram',
                type: 'object',
                label: 'Telegram в footer-блоке главной',
                element: footerTelegram,
                fields: [
                    { key: 'label', label: 'Подпись', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.setAttribute('href', value?.href || '#');
                        setTextContent(element, value?.label || 'Telegram');
                    });
                }
            });
        }

        if (footerMax) {
            bindings.push({
                path: 'contact.max',
                type: 'object',
                label: 'Max в footer-блоке главной',
                element: footerMax,
                fields: [
                    { key: 'label', label: 'Подпись', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.setAttribute('href', value?.href || '#');
                        setTextContent(element, value?.label || 'Max');
                    });
                }
            });
        }

        if (footerCompanyTitle) bindings.push({ path: 'footer.companyTitle', type: 'text', label: 'Название компании в preview-footer', element: footerCompanyTitle });

        footerCompanyParagraphs.forEach((paragraph, index) => {
            bindings.push({
                path: `footer.companyParagraphs.${index}`,
                type: 'textarea',
                label: `Описание компании ${index + 1} в preview-footer`,
                element: paragraph
            });
        });

        if (footerUsefulTitle) bindings.push({ path: 'footer.usefulTitle', type: 'text', label: 'Заголовок полезных ссылок в preview-footer', element: footerUsefulTitle });

        footerUsefulItems.forEach((itemElement, index) => {
            bindings.push({
                path: `footer.usefulLinks.${index}`,
                type: 'object',
                label: `Полезная ссылка ${index + 1} в preview-footer`,
                element: itemElement,
                fields: [
                    { key: 'label', label: 'Название', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        const anchor = element.querySelector('a');
                        if (!anchor) return;
                        setTextContent(anchor, value?.label || '');
                        anchor.setAttribute('href', buildCurrentLinkHref(value?.href || '/index.html', currentPath));
                    });
                }
            });
        });

        if (footerEmail) {
            bindings.push({
                path: 'contact.email',
                type: 'text',
                label: 'Почта в preview-footer',
                element: footerEmail,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        setTextContent(element, value || '');
                        element.setAttribute('href', `mailto:${value || ''}`);
                    });
                }
            });
        }

        if (footerHoursItem) {
            bindings.push({
                path: 'contact.hours',
                type: 'text',
                label: 'Режим работы в preview-footer',
                element: footerHoursItem,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.innerHTML = `<i class="fas fa-clock" aria-hidden="true"></i> ${escapeHtml(value || '')}`;
                    });
                }
            });
        }

        if (footerPolicy) {
            bindings.push({ path: 'footer.policyLabel', type: 'text', label: 'Текст ссылки на политику в preview-footer', element: footerPolicy });
            bindings.push({
                path: 'footer.policyHref',
                type: 'text',
                label: 'Ссылка на политику в preview-footer',
                element: footerPolicy,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.setAttribute('href', value || '#');
                    });
                }
            });
        }

        if (!bindings.length) return;

        queueInlineBindings({
            fileName: 'site',
            sectionKey: 'site',
            sectionLabel: 'Шапка и футер главной',
            bindings
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;

        try {
            const [home, site] = await Promise.all([
                window.PokraskaContent.loadContentFile('home'),
                window.PokraskaContent.loadContentFile('site')
            ]);

            if (isCurrentHomeTemplate()) {
                applyCurrentHomeTemplate(site || {}, home || {});
                registerCurrentInlineBindings(home || {});
                registerCurrentSiteInlineBindings(site || {});
                return;
            }

            applyHero(home.hero || {});
            applyDirections(home.directions || {});
            applyProcess(home.process || {});
            applyReviews(home.reviews || {});
            applyTrust(home.trust || {});
            applyPartners(home.partners || {});
            applyRequest(home.request || {});
            registerInlineBindings();
        } catch (error) {
            console.warn('Failed to apply home content', error);
        }
    });
})();
