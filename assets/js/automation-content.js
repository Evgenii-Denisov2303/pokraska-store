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
        return (window.location.pathname.split('/').pop() || '').replace('.html', '');
    }

    function applySwingLanding(content) {
        const hero = document.querySelector('.catalog-hero');
        if (hero) {
            const breadcrumbs = hero.querySelector('.catalog-breadcrumbs');
            const title = hero.querySelector('h1');
            const text = hero.querySelector('p');
            if (breadcrumbs) breadcrumbs.textContent = content.hero?.breadcrumbs || '';
            if (title) title.textContent = content.hero?.title || '';
            if (text) text.textContent = content.hero?.subtitle || '';
        }

        const listingHeader = document.querySelector('#catalog-panel-automation-swing .catalog-panel__header');
        if (listingHeader) {
            const breadcrumbs = listingHeader.querySelector('.catalog-breadcrumbs');
            const title = listingHeader.querySelector('h2');
            if (breadcrumbs) breadcrumbs.textContent = content.listingHeader?.breadcrumbs || '';
            if (title) title.textContent = content.listingHeader?.title || '';
        }

        const cards = document.querySelectorAll('.automation-products .automation-product-card');
        (content.products || []).forEach((product, index) => {
            const card = cards[index];
            if (!card) return;

            const meta = card.querySelector('.automation-product-meta');
            const title = card.querySelector('.automation-product-title');
            const description = card.querySelector('.automation-product-description');
            const specs = card.querySelector('.automation-product-specs');
            const action = card.querySelector('.automation-product-cta .btn');

            if (meta) meta.textContent = product.meta || '';
            if (title) title.textContent = product.title || '';
            if (description) description.textContent = product.description || '';
            if (specs) {
                specs.innerHTML = (product.specs || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
            }
            if (action) {
                action.innerHTML = `<i class="fas fa-external-link-alt" aria-hidden="true"></i> ${escapeHtml(product.cta?.label || '')}`;
                action.setAttribute('href', product.cta?.href || '#');
            }
        });

        const guide = document.querySelector('.automation-guide');
        if (guide) {
            const title = guide.querySelector('h3');
            const intro = guide.querySelector('p');
            const list = guide.querySelector('.automation-guide__list');
            const subheading = guide.querySelector('h4');
            const text = guide.querySelector('.automation-guide__text');

            if (title) title.textContent = content.guide?.title || '';
            if (intro) intro.textContent = content.guide?.intro || '';
            if (list) {
                list.innerHTML = (content.guide?.list || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
            }
            if (subheading) subheading.textContent = content.guide?.subheading || '';
            if (text) {
                text.innerHTML = (content.guide?.paragraphs || []).map((item) => `<p>${escapeHtml(item)}</p>`).join('');
            }
        }

        const cta = document.querySelector('#catalog-panel-automation-swing .catalog-panel__cta');
        if (cta) {
            const title = cta.querySelector('h3');
            const text = cta.querySelector('p');
            const contacts = cta.querySelector('.catalog-contact-list');

            if (title) title.textContent = content.cta?.title || '';
            if (text) text.textContent = content.cta?.text || '';
            if (contacts) {
                contacts.innerHTML = (content.cta?.contacts || []).map((item) => `
                    <a href="${escapeHtml(item.href || '#')}">
                        <i class="${escapeHtml(item.icon || '')}" aria-hidden="true"></i> ${escapeHtml(item.label || '')}
                    </a>
                `).join('');
            }
        }
    }

    function applySlidingComponents(content, sharedActions) {
        const backLink = document.querySelector('.automation-product-back');
        const meta = document.querySelector('.automation-product-meta');
        const title = document.querySelector('.automation-product-title');
        const description = document.querySelector('.automation-product-description');
        const sections = document.querySelectorAll('.automation-product-section');
        const cta = document.querySelector('.automation-product-cta');

        if (backLink) {
            backLink.setAttribute('href', content.backHref || '#');
            backLink.innerHTML = `<i class="fas fa-arrow-left" aria-hidden="true"></i> ${escapeHtml(content.backLabel || '')}`;
        }
        if (meta) meta.textContent = content.meta || '';
        if (title) title.textContent = content.title || '';
        if (description) description.textContent = content.description || '';

        (content.sections || []).forEach((sectionContent, index) => {
            const section = sections[index];
            if (!section) return;
            const sectionTitle = section.querySelector('.automation-product-section__title');
            const list = section.querySelector('.automation-product-specs');
            if (sectionTitle) sectionTitle.textContent = sectionContent.title || '';
            if (list) {
                list.innerHTML = (sectionContent.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
            }
        });

        if (cta) {
            cta.innerHTML = [
                renderButton(sharedActions.primary || {}, 'btn btn-primary'),
                renderButton(sharedActions.secondary || {}, 'btn btn-secondary')
            ].join('');
        }
    }

    function applyProductPage(content, sharedActions) {
        const backLink = document.querySelector('.automation-product-back');
        const meta = document.querySelector('.automation-product-meta');
        const title = document.querySelector('.automation-product-title');
        const description = document.querySelector('.automation-product-description');
        const specs = document.querySelector('.automation-product-specs');
        const cta = document.querySelector('.automation-product-cta');

        if (backLink) {
            backLink.setAttribute('href', content.backHref || '#');
            backLink.innerHTML = `<i class="fas fa-arrow-left" aria-hidden="true"></i> ${escapeHtml(content.backLabel || '')}`;
        }
        if (meta) meta.textContent = content.meta || '';
        if (title) title.textContent = content.title || '';
        if (description) description.textContent = content.description || '';
        if (specs) {
            specs.innerHTML = (content.specs || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
        }
        if (cta) {
            cta.innerHTML = [
                renderButton(sharedActions.primary || {}, 'btn btn-primary'),
                renderButton(sharedActions.secondary || {}, 'btn btn-secondary')
            ].join('');
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;

        const pageKey = getPageKey();
        if (!pageKey.startsWith('automation-')) return;

        try {
            const content = await window.PokraskaContent.loadContentFile('automation');

            if (pageKey === 'automation-swing') {
                applySwingLanding(content.swingLanding || {});
                return;
            }

            if (pageKey === 'automation-sliding-components') {
                applySlidingComponents(content.slidingComponentsPage || {}, content.sharedActions || {});
                return;
            }

            const product = (content.productPages || []).find((item) => item.pageKey === pageKey);
            if (product) {
                applyProductPage(product, content.sharedActions || {});
            }
        } catch (error) {
            console.warn('Failed to apply automation content', error);
        }
    });
})();
