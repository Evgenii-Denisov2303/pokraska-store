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
                <i class="${escapeHtml(action.icon || '')}"></i> ${escapeHtml(action.label || '')}
            </a>
        `;
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;
        if (!document.querySelector('.prices-page')) return;

        try {
            const content = await window.PokraskaContent.loadContentFile('prices');

            const header = document.querySelector('.price-header');
            if (header) {
                const title = header.querySelector('h1');
                const subtitle = header.querySelector('.subtitle');
                if (title) {
                    title.innerHTML = `<i class="fas fa-tags"></i> ${escapeHtml(content.header?.title || '')}`;
                }
                if (subtitle) {
                    subtitle.textContent = content.header?.subtitle || '';
                }
            }

            const factors = document.querySelector('.price-factors');
            if (factors) {
                const title = factors.querySelector('h2');
                const grid = factors.querySelector('.factors-grid');
                if (title) {
                    title.innerHTML = `<i class="fas fa-chart-line"></i> ${escapeHtml(content.factors?.title || '')}`;
                }
                if (grid) {
                    grid.innerHTML = (content.factors?.items || []).map((item) => `
                        <div class="factor-card">
                            <i class="${escapeHtml(item.icon || '')}"></i>
                            <h3>${escapeHtml(item.title || '')}</h3>
                            <p>${escapeHtml(item.text || '')}</p>
                        </div>
                    `).join('');
                }
            }

            const calculator = document.querySelector('.calculator-section');
            if (calculator) {
                const title = calculator.querySelector('h2');
                const text = calculator.querySelector('p');
                const contact = calculator.querySelector('.calculator-contact');
                const actionWrap = calculator.querySelector('.btn.btn-primary');

                if (title) {
                    title.innerHTML = `<i class="fas fa-calculator"></i> ${escapeHtml(content.calculator?.title || '')}`;
                }
                if (text) {
                    text.textContent = content.calculator?.text || '';
                }
                if (actionWrap && content.calculator?.action) {
                    actionWrap.outerHTML = renderButton(content.calculator.action, 'btn btn-primary');
                }
                if (contact) {
                    const phones = (content.calculator?.phones || []).map((item) => `
                        <a href="${escapeHtml(item.href || '#')}">${escapeHtml(item.label || '')}</a>
                    `).join(', ');
                    contact.innerHTML = `<i class="fas fa-phone"></i> ${escapeHtml(content.calculator?.contactLabel || '')} ${phones}`;
                }
            }

            const guarantee = document.querySelector('.guarantee-section');
            if (guarantee) {
                const badge = guarantee.querySelector('.guarantee-badge span');
                const title = guarantee.querySelector('.guarantee-title');
                const text = guarantee.querySelector('.guarantee-text');
                if (badge) badge.textContent = content.guarantee?.badge || '';
                if (title) title.textContent = content.guarantee?.title || '';
                if (text) text.textContent = content.guarantee?.text || '';
            }

            const cta = document.querySelector('.price-cta');
            if (cta) {
                cta.innerHTML = [
                    renderButton(content.cta?.primary || {}, 'btn btn-primary'),
                    renderButton(content.cta?.secondary || {}, 'btn btn-secondary')
                ].join('');
            }

            const faqSection = document.querySelector('#prices-faq-title')?.closest('section');
            if (faqSection) {
                const title = faqSection.querySelector('.section-title');
                const subtitle = faqSection.querySelector('.section-subtitle');
                const list = faqSection.querySelector('.faq-list');
                if (title) title.textContent = content.faq?.title || '';
                if (subtitle) subtitle.textContent = content.faq?.subtitle || '';
                if (list) {
                    list.innerHTML = (content.faq?.items || []).map((item) => `
                        <details class="faq-item">
                            <summary class="faq-question">${escapeHtml(item.question || '')}</summary>
                            <div class="faq-answer">
                                <p>${escapeHtml(item.answer || '')}</p>
                            </div>
                        </details>
                    `).join('');
                }
            }
        } catch (error) {
            console.warn('Failed to apply prices content', error);
        }
    });
})();
