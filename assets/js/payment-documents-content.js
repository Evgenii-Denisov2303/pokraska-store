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
        return `
            <a href="${escapeHtml(action.href || '#')}" class="${escapeHtml(className)}">
                <i class="${escapeHtml(action.icon || '')}"></i> ${escapeHtml(action.label || '')}
            </a>
        `;
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;
        if (!document.querySelector('.payment-docs-page')) return;

        try {
            const content = await window.PokraskaContent.loadContentFile('payment-documents');

            const hero = document.querySelector('.payment-docs-hero');
            if (hero) {
                const eyebrow = hero.querySelector('.payment-docs-hero__eyebrow');
                const title = hero.querySelector('h1');
                const lead = hero.querySelector('.payment-docs-hero__lead');
                const text = hero.querySelector('.payment-docs-hero__text');
                const chips = hero.querySelector('.payment-docs-hero__chips');
                const accent = hero.querySelector('.payment-docs-panel--accent');
                const side = hero.querySelector('.payment-docs-panel:not(.payment-docs-panel--accent)');

                if (eyebrow) eyebrow.textContent = content.hero?.eyebrow || '';
                if (title) title.textContent = content.hero?.title || '';
                if (lead) lead.textContent = content.hero?.lead || '';
                if (text) text.textContent = content.hero?.text || '';
                if (chips) {
                    chips.innerHTML = (content.hero?.chips || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('');
                }
                if (accent) {
                    const icon = accent.querySelector('.payment-docs-panel__icon i');
                    const accentTitle = accent.querySelector('h2');
                    const accentText = accent.querySelector('p');
                    if (icon) icon.className = content.hero?.accentCard?.icon || '';
                    if (accentTitle) accentTitle.textContent = content.hero?.accentCard?.title || '';
                    if (accentText) accentText.textContent = content.hero?.accentCard?.text || '';
                }
                if (side) {
                    const meta = side.querySelector('.payment-docs-panel__meta');
                    const list = side.querySelector('.payment-docs-panel__list');
                    if (meta) meta.textContent = content.hero?.sideCard?.meta || '';
                    if (list) {
                        list.innerHTML = (content.hero?.sideCard?.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
                    }
                }
            }

            const benefitsSection = document.querySelector('#payment-benefits-title')?.closest('.payment-docs-section');
            if (benefitsSection) {
                const title = benefitsSection.querySelector('.payment-docs-section__heading h2');
                const subtitle = benefitsSection.querySelector('.payment-docs-section__heading p');
                const grid = benefitsSection.querySelector('.payment-docs-grid');
                if (title) title.textContent = content.benefits?.title || '';
                if (subtitle) subtitle.textContent = content.benefits?.subtitle || '';
                if (grid) {
                    grid.innerHTML = (content.benefits?.items || []).map((item) => `
                        <article class="payment-docs-card">
                            <div class="payment-docs-card__icon" aria-hidden="true">
                                <i class="${escapeHtml(item.icon || '')}"></i>
                            </div>
                            <h3>${escapeHtml(item.title || '')}</h3>
                            <p>${escapeHtml(item.text || '')}</p>
                        </article>
                    `).join('');
                }
            }

            const workflowSection = document.querySelector('#payment-flow-title')?.closest('.payment-docs-section');
            if (workflowSection) {
                const title = workflowSection.querySelector('.payment-docs-section__heading h2');
                const subtitle = workflowSection.querySelector('.payment-docs-section__heading p');
                const steps = workflowSection.querySelector('.payment-docs-steps');
                if (title) title.textContent = content.workflow?.title || '';
                if (subtitle) subtitle.textContent = content.workflow?.subtitle || '';
                if (steps) {
                    steps.innerHTML = (content.workflow?.steps || []).map((item) => `
                        <article class="payment-docs-step">
                            <span class="payment-docs-step__number">${escapeHtml(item.number || '')}</span>
                            <h3>${escapeHtml(item.title || '')}</h3>
                            <p>${escapeHtml(item.text || '')}</p>
                        </article>
                    `).join('');
                }
            }

            const cta = document.querySelector('.payment-docs-cta');
            if (cta) {
                const title = cta.querySelector('h2');
                const text = cta.querySelector('p');
                const actions = cta.querySelector('.payment-docs-cta__actions');
                if (title) title.textContent = content.cta?.title || '';
                if (text) text.textContent = content.cta?.text || '';
                if (actions) {
                    actions.innerHTML = [
                        renderAction(content.cta?.primary || {}, 'btn btn-primary'),
                        renderAction(content.cta?.secondary || {}, 'btn btn-secondary')
                    ].join('');
                }
            }
        } catch (error) {
            console.warn('Failed to apply payment documents content', error);
        }
    });
})();
