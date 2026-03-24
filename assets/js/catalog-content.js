(function() {
    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderContact(contact) {
        return `
            <a href="${escapeHtml(contact.href || '#')}">
                <i class="${escapeHtml(contact.icon || '')}" aria-hidden="true"></i> ${escapeHtml(contact.label || '')}
            </a>
        `;
    }

    function renderParagraphs(paragraphs) {
        return (paragraphs || [])
            .filter(Boolean)
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join('');
    }

    function renderBadges(badges) {
        if (!Array.isArray(badges) || !badges.length) return '';

        return `
            <div class="catalog-panel__badges">
                ${badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join('')}
            </div>
        `;
    }

    function renderListItems(items) {
        return (items || [])
            .filter(Boolean)
            .map((item) => `<li>${String(item)}</li>`)
            .join('');
    }

    function renderInfoCards(cards, headingTag = 'h3') {
        return (cards || [])
            .map((card) => `
                <div class="catalog-info-card">
                    <${headingTag}>${escapeHtml(card.title || '')}</${headingTag}>
                    <ul>
                        ${renderListItems(card.items)}
                    </ul>
                </div>
            `)
            .join('');
    }

    function applyTextBlock(panelElement, panelContent) {
        const textBlock = panelElement.querySelector('.catalog-panel__grid .catalog-panel__text');
        if (!textBlock) return;

        const hasContent = panelContent.introTitle
            || (panelContent.paragraphs || []).length
            || (panelContent.badges || []).length
            || (panelContent.tailParagraphs || []).length;

        if (!hasContent) return;

        const parts = [];
        if (panelContent.introTitle) {
            parts.push(`<h3>${escapeHtml(panelContent.introTitle)}</h3>`);
        }
        parts.push(renderParagraphs(panelContent.paragraphs));
        parts.push(renderBadges(panelContent.badges));
        parts.push(renderParagraphs(panelContent.tailParagraphs));
        textBlock.innerHTML = parts.filter(Boolean).join('');
    }

    function applyInfoGrid(panelElement, panelContent) {
        const infoGrid = panelElement.querySelector('.catalog-info-grid');
        if (!infoGrid || !Array.isArray(panelContent.cards)) return;

        infoGrid.innerHTML = renderInfoCards(panelContent.cards, 'h3');
    }

    function applyFaq(panelElement, panelContent) {
        const faqSection = panelElement.querySelector('.faq-section');
        const faq = panelContent.faq;
        if (!faqSection || !faq || !faq.title) return;

        faqSection.innerHTML = `
            <h3 class="section-title">${escapeHtml(faq.title)}</h3>
            ${faq.subtitle ? `<p class="section-subtitle">${escapeHtml(faq.subtitle)}</p>` : ''}
            <div class="faq-list">
                ${(faq.items || []).map((item) => `
                    <details class="faq-item">
                        <summary class="faq-question">${escapeHtml(item.question || '')}</summary>
                        <div class="faq-answer">
                            <p>${escapeHtml(item.answer || '')}</p>
                        </div>
                    </details>
                `).join('')}
            </div>
        `;
    }

    function applyPalette(panelElement, panelContent) {
        const paletteInfo = panelElement.querySelector('.catalog-palette-card__info');
        const palette = panelContent.palette;
        if (!paletteInfo || !palette || !palette.title) return;

        paletteInfo.innerHTML = `
            <h3>${escapeHtml(palette.title)}</h3>
            ${palette.text ? `<p>${escapeHtml(palette.text)}</p>` : ''}
            ${(palette.items || []).length ? `<ul>${renderListItems(palette.items)}</ul>` : ''}
            ${palette.actionLabel ? `
                <a href="${escapeHtml(palette.actionHref || '#')}" class="btn btn-primary">
                    <i class="fas fa-palette"></i> ${escapeHtml(palette.actionLabel)}
                </a>
            ` : ''}
        `;

        const note = panelElement.querySelector('.catalog-panel__palette-note');
        if (note && palette.note) {
            note.innerHTML = `<em>${escapeHtml(palette.note)}</em>`;
        }
    }

    function applySpecGroups(panelElement, panelContent) {
        const specGroups = Array.from(panelElement.querySelectorAll('.catalog-spec-group'));
        if (!specGroups.length || !Array.isArray(panelContent.specGroups) || !panelContent.specGroups.length) return;

        panelContent.specGroups.forEach((group, index) => {
            const section = specGroups[index];
            if (!section) return;

            const title = section.querySelector(':scope > h3');
            const cards = section.querySelector('.catalog-panel__spec-cards');

            if (title) {
                title.textContent = group.title || '';
            }

            if (cards && Array.isArray(group.cards)) {
                cards.innerHTML = renderInfoCards(group.cards, 'h4');
            }
        });
    }

    function applySteps(panelElement, panelContent) {
        const steps = panelElement.querySelector('.automation-steps');
        if (!steps || !Array.isArray(panelContent.steps) || !panelContent.steps.length) return;

        steps.innerHTML = panelContent.steps.map((step) => `
            <article class="automation-step">
                <span class="automation-step__number">${escapeHtml(step.number || '')}</span>
                <h3>${escapeHtml(step.title || '')}</h3>
                <p>${escapeHtml(step.text || '')}</p>
            </article>
        `).join('');
    }

    function applySectionHeading(panelElement, panelContent) {
        const sectionHeading = panelElement.querySelector('.catalog-panel__section-heading');
        const heading = panelContent.sectionHeading;
        if (!sectionHeading || !heading || !heading.title) return;

        sectionHeading.innerHTML = `
            <h3>${escapeHtml(heading.title)}</h3>
            ${heading.text ? `<p>${escapeHtml(heading.text)}</p>` : ''}
        `;
    }

    function applyProductCard(cardElement, product) {
        if (!cardElement || !product) return;

        const linkWrapper = cardElement.querySelector('.automation-card__link');
        const cta = cardElement.querySelector('.automation-card__cta');
        const meta = cardElement.querySelector('.automation-card__meta');
        const title = cardElement.querySelector('.automation-card__title');
        const description = cardElement.querySelector('.automation-card__description');
        const specs = cardElement.querySelector('.automation-card__specs');

        if (linkWrapper && product.href) {
            linkWrapper.href = product.href;
            linkWrapper.title = `Открыть карточку ${product.meta || product.title || ''}`;
        }

        if (meta) meta.textContent = product.meta || '';
        if (title) title.textContent = product.title || '';
        if (description) description.textContent = product.description || '';
        if (specs) specs.innerHTML = renderListItems(product.specs);

        if (cta) {
            cta.textContent = product.cta || '';
            if (cta.tagName === 'A' && product.href) {
                cta.href = product.href;
            }
        }
    }

    function applyProducts(panelElement, panelContent) {
        const cards = Array.from(panelElement.querySelectorAll('.automation-products .automation-card'));
        if (!cards.length || !Array.isArray(panelContent.products) || !panelContent.products.length) return;

        panelContent.products.forEach((product, index) => {
            applyProductCard(cards[index], product);
        });
    }

    function applyPanelCta(panelElement, panelContent) {
        const cta = panelElement.querySelector('.catalog-panel__cta');
        const ctaData = panelContent.cta;
        if (!cta || !ctaData) return;

        const title = cta.querySelector('h3');
        const text = cta.querySelector('p');
        const contacts = cta.querySelector('.catalog-contact-list');

        if (title) title.textContent = ctaData.title || '';
        if (text) text.textContent = ctaData.text || '';
        if (contacts && Array.isArray(ctaData.contacts) && ctaData.contacts.length) {
            contacts.innerHTML = ctaData.contacts.map(renderContact).join('');
        }
    }

    function applyPanel(panelContent) {
        if (!panelContent?.panelId) return;

        const panelElement = document.getElementById(panelContent.panelId);
        if (!panelElement) return;

        const breadcrumbs = panelElement.querySelector('.catalog-breadcrumbs');
        const title = panelElement.querySelector('.catalog-panel__header h2');

        if (breadcrumbs) breadcrumbs.textContent = panelContent.breadcrumb || '';
        if (title) title.textContent = panelContent.title || '';

        applyTextBlock(panelElement, panelContent);
        applyInfoGrid(panelElement, panelContent);
        applyFaq(panelElement, panelContent);
        applyPalette(panelElement, panelContent);
        applySpecGroups(panelElement, panelContent);
        applySteps(panelElement, panelContent);
        applySectionHeading(panelElement, panelContent);
        applyProducts(panelElement, panelContent);
        applyPanelCta(panelElement, panelContent);
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;
        if (!document.querySelector('[data-catalog-layout]')) return;

        try {
            const [content, panelContent] = await Promise.all([
                window.PokraskaContent.loadContentFile('catalog'),
                window.PokraskaContent.loadContentFile('catalog-panels').catch(() => ({}))
            ]);

            const hiddenTitle = document.querySelector('.catalog-page .visually-hidden');
            if (hiddenTitle) {
                hiddenTitle.textContent = content.pageTitle || '';
            }

            (content.groups || []).forEach((group) => {
                const tab = document.querySelector(`[data-catalog-group="${group.key}"]`);
                const panel = document.querySelector(`[data-catalog-group-panel="${group.key}"]`);

                if (tab) {
                    const title = tab.querySelector('.catalog-group-tab__title');
                    const icon = tab.querySelector('.catalog-group-tab__icon i');
                    if (title) title.textContent = group.title || '';
                    if (icon && group.icon) icon.className = group.icon;
                }

                if (panel) {
                    const eyebrow = panel.querySelector('.catalog-group-panel__eyebrow');
                    const title = panel.querySelector('.catalog-group-panel__intro h3');
                    const text = panel.querySelector('.catalog-group-panel__intro p');
                    const links = panel.querySelector('.catalog-group-panel__links');

                    if (eyebrow) eyebrow.textContent = group.eyebrow || '';
                    if (title) title.textContent = group.title || '';
                    if (text) text.textContent = group.text || '';

                    if (links) {
                        (group.links || []).forEach((link) => {
                            const button = links.querySelector(`[data-catalog-tab="${link.panelId}"]`);
                            if (button) {
                                button.textContent = link.label || '';
                            }
                        });
                    }
                }
            });

            Object.values(panelContent || {})
                .filter((panel) => panel && typeof panel === 'object')
                .forEach(applyPanel);

            const partnersTitle = document.querySelector('.catalog-partners h3');
            if (partnersTitle) {
                partnersTitle.innerHTML = `<i class="fas fa-handshake"></i> ${escapeHtml(content.partners?.title || '')}`;
            }

            const cta = document.querySelector('.catalog-cta');
            if (cta) {
                const title = cta.querySelector('h3');
                const text = cta.querySelector('p');
                const contacts = cta.querySelector('.catalog-contact-list');
                if (title) title.textContent = content.cta?.title || '';
                if (text) text.textContent = content.cta?.text || '';
                if (contacts) {
                    contacts.innerHTML = (content.cta?.contacts || []).map(renderContact).join('');
                }
            }
        } catch (error) {
            console.warn('Failed to apply catalog content', error);
        }
    });
})();
