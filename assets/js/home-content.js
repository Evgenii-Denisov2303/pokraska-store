(function() {
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

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;

        try {
            const home = await window.PokraskaContent.loadContentFile('home');
            applyHero(home.hero || {});
            applyDirections(home.directions || {});
            applyProcess(home.process || {});
            applyTrust(home.trust || {});
            applyRequest(home.request || {});
        } catch (error) {
            console.warn('Failed to apply home content', error);
        }
    });
})();
