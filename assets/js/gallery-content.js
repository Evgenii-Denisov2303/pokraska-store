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

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;
        if (!document.querySelector('.gallery-page')) return;

        try {
            const content = await window.PokraskaContent.loadContentFile('gallery');

            const header = document.querySelector('.gallery-header');
            if (header) {
                const title = header.querySelector('h1');
                const subtitle = header.querySelector('.subtitle');
                if (title) {
                    title.innerHTML = `<i class="fas fa-images"></i> ${escapeHtml(content.header?.title || '')}`;
                }
                if (subtitle) {
                    subtitle.textContent = content.header?.subtitle || '';
                }
            }

            const filters = document.querySelector('.gallery-filters');
            if (filters) {
                filters.innerHTML = (content.filters || []).map((filter) => `
                    <button class="filter-btn${filter.value === 'all' ? ' active' : ''}" data-filter="${escapeHtml(filter.value || 'all')}">
                        <i class="${escapeHtml(filter.icon || '')}" aria-hidden="true"></i> ${escapeHtml(filter.label || '')}
                    </button>
                `).join('');
            }

            const showMoreButton = document.querySelector('.gallery-show-more');
            if (showMoreButton) {
                showMoreButton.textContent = content.showMoreLabel || '';
            }

            const counterNumber = document.querySelector('.counter-number');
            const counterText = document.querySelector('.counter-text');
            if (counterNumber) counterNumber.textContent = content.counter?.value || '';
            if (counterText) counterText.textContent = content.counter?.text || '';

            const cta = document.querySelector('.order-cta');
            if (cta) {
                cta.innerHTML = [
                    renderButton(content.cta?.primary || {}, 'btn btn-primary'),
                    renderButton(content.cta?.secondary || {}, 'btn btn-secondary')
                ].join('');
            }
        } catch (error) {
            console.warn('Failed to apply gallery content', error);
        }
    });
})();
