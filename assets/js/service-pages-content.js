(function() {
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

    function getPageKey() {
        const fileName = window.location.pathname.split('/').pop() || '';
        if (fileName === 'powder-coating.html') return 'powderCoating';
        if (fileName === 'sandblasting.html') return 'sandblasting';
        return null;
    }

    function applyHeader(pageContent) {
        const header = document.querySelector('.services-header');
        if (!header) return;

        const title = header.querySelector('h1');
        const subtitle = header.querySelector('.subtitle');

        if (title) {
            title.innerHTML = `<i class="${escapeHtml(pageContent.header?.icon || '')}"></i> ${escapeHtml(pageContent.header?.title || '')}`;
        }

        if (subtitle) {
            subtitle.textContent = pageContent.header?.subtitle || '';
        }
    }

    function applyQuickNav(pageContent) {
        const nav = document.getElementById('service-nav');
        if (!nav) return;

        nav.innerHTML = (pageContent.quickNav || []).map((item) => `
            <a href="#${escapeHtml(item.id || '')}" class="service-nav-link">
                <i class="${escapeHtml(item.icon || '')}" aria-hidden="true"></i> ${escapeHtml(item.label || '')}
            </a>
        `).join('');
    }

    function applyBeforeAfter(pageContent) {
        const section = document.querySelector('.before-after-section');
        if (!section || !pageContent.beforeAfter) return;

        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');
        const note = section.querySelector('.before-after__note');

        if (title) title.textContent = pageContent.beforeAfter.title || '';
        if (subtitle) subtitle.textContent = pageContent.beforeAfter.subtitle || '';
        if (note) note.textContent = pageContent.beforeAfter.note || '';
    }

    function applySharedCardCta(card, sharedCta) {
        const cta = card.querySelector('.service-cta');
        if (!cta || !sharedCta) return;

        cta.innerHTML = [
            renderButton(sharedCta.primary || {}, 'btn btn-primary'),
            renderButton(sharedCta.secondary || {}, 'btn btn-secondary')
        ].join('');
    }

    function applyServiceSections(pageContent, sharedCta) {
        (pageContent.sections || []).forEach((sectionContent) => {
            const card = document.getElementById(sectionContent.id);
            if (!card) return;

            const headerIcon = card.querySelector('.service-header > i');
            const title = card.querySelector('.service-header h2');
            const badge = card.querySelector('.service-id');
            const description = card.querySelector('.service-description');

            if (headerIcon) headerIcon.className = sectionContent.icon || '';
            if (title) title.textContent = sectionContent.title || '';
            if (badge) badge.textContent = sectionContent.badge || '';
            if (description) description.textContent = sectionContent.description || '';

            const advantagesBlock = card.querySelector('.service-advantages');
            if (advantagesBlock && sectionContent.advantagesTitle) {
                const advantagesTitle = advantagesBlock.querySelector('h3');
                const advantagesGrid = advantagesBlock.querySelector('.advantages-grid');

                if (advantagesTitle) {
                    advantagesTitle.innerHTML = `<i class="${escapeHtml(sectionContent.advantagesIcon || '')}"></i> ${escapeHtml(sectionContent.advantagesTitle || '')}`;
                }

                if (advantagesGrid && Array.isArray(sectionContent.advantages)) {
                    advantagesGrid.innerHTML = sectionContent.advantages.map((item) => `
                        <div class="advantage-item">
                            <i class="${escapeHtml(item.icon || '')}" aria-hidden="true"></i>
                            <span>${escapeHtml(item.text || '')}</span>
                        </div>
                    `).join('');
                }
            }

            const processSteps = card.querySelector('.process-steps');
            if (processSteps && Array.isArray(sectionContent.processSteps)) {
                processSteps.innerHTML = sectionContent.processSteps.map((step) => `
                    <div class="process-step">
                        <h4>${escapeHtml(step.title || '')}</h4>
                        <p>${escapeHtml(step.text || '')}</p>
                    </div>
                `).join('');
            }

            const paletteCard = card.querySelector('.palette-card');
            if (paletteCard && sectionContent.paletteCard) {
                const info = paletteCard.querySelector('.palette-card__info');
                if (info) {
                    const paletteTitle = info.querySelector('h3');
                    const paletteText = info.querySelector('p');
                    const paletteList = info.querySelector('ul');
                    const paletteAction = info.querySelector('.btn');

                    if (paletteTitle) {
                        paletteTitle.innerHTML = `<i class="${escapeHtml(sectionContent.paletteCard.icon || '')}"></i> ${escapeHtml(sectionContent.paletteCard.title || '')}`;
                    }
                    if (paletteText) {
                        paletteText.textContent = sectionContent.paletteCard.text || '';
                    }
                    if (paletteList) {
                        paletteList.innerHTML = (sectionContent.paletteCard.points || []).map((item) => `
                            <li>${escapeHtml(item)}</li>
                        `).join('');
                    }
                    if (paletteAction && sectionContent.paletteCard.action) {
                        paletteAction.outerHTML = renderButton(sectionContent.paletteCard.action, 'btn btn-secondary');
                    }
                }
            }

            applySharedCardCta(card, sharedCta);
        });
    }

    function applyFinalCta(pageContent) {
        const cta = document.querySelector('.services-cta');
        if (!cta || !pageContent.cta) return;

        const title = cta.querySelector('h2');
        const text = cta.querySelector('.cta-text');
        const action = cta.querySelector('.btn.btn-primary');
        const phoneLine = cta.querySelector('.cta-phone');

        if (title) title.textContent = pageContent.cta.title || '';
        if (text) text.textContent = pageContent.cta.text || '';
        if (action) {
            action.outerHTML = renderButton(pageContent.cta.action || {}, 'btn btn-primary');
        }

        if (phoneLine) {
            const phones = (pageContent.cta.phones || []).map((phone) => `
                <a href="${escapeHtml(phone.href || '#')}">${escapeHtml(phone.label || '')}</a>
            `);
            phoneLine.innerHTML = `<i class="fas fa-phone"></i> Или позвоните: ${phones.join(' и ')}`;
        }
    }

    function applyFaq(pageContent) {
        const faqSection = document.querySelector('#services-faq-title')?.closest('section');
        if (!faqSection || !pageContent.faq) return;

        const title = faqSection.querySelector('.section-title');
        const subtitle = faqSection.querySelector('.section-subtitle');
        const list = faqSection.querySelector('.faq-list');

        if (title) title.textContent = pageContent.faq.title || '';
        if (subtitle) subtitle.textContent = pageContent.faq.subtitle || '';
        if (list) {
            list.innerHTML = (pageContent.faq.items || []).map((item) => `
                <details class="faq-item">
                    <summary class="faq-question">${escapeHtml(item.question || '')}</summary>
                    <div class="faq-answer">
                        <p>${escapeHtml(item.answer || '')}</p>
                    </div>
                </details>
            `).join('');
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;
        if (!document.querySelector('.services-page')) return;

        const pageKey = getPageKey();
        if (!pageKey) return;

        try {
            const content = await window.PokraskaContent.loadContentFile('service-pages');
            const pageContent = content[pageKey];
            if (!pageContent) return;

            applyHeader(pageContent);
            applyQuickNav(pageContent);
            applyBeforeAfter(pageContent);
            applyServiceSections(pageContent, content.sharedCta || {});
            applyFinalCta(pageContent);
            applyFaq(pageContent);
        } catch (error) {
            console.warn('Failed to apply service page content', error);
        }
    });
})();
