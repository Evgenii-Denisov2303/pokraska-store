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
        return `
            <a href="${escapeHtml(action.href || '#')}" class="${escapeHtml(className)}">
                <i class="${escapeHtml(action.icon || '')}"></i> ${escapeHtml(action.label || '')}
            </a>
        `;
    }

    function renderActionNode(anchor, action, className) {
        if (!anchor) return;
        anchor.className = className;
        anchor.setAttribute('href', action?.href || '#');
        anchor.innerHTML = `<i class="${escapeHtml(action?.icon || '')}"></i> ${escapeHtml(action?.label || '')}`;
    }

    function registerInlineBindings(content) {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const hero = document.querySelector('.payment-docs-hero');
        const benefitsSection = document.querySelector('#payment-benefits-title')?.closest('.payment-docs-section');
        const workflowSection = document.querySelector('#payment-flow-title')?.closest('.payment-docs-section');
        const cta = document.querySelector('.payment-docs-cta');

        if (hero) {
            const eyebrow = hero.querySelector('.payment-docs-hero__eyebrow');
            const title = hero.querySelector('h1');
            const lead = hero.querySelector('.payment-docs-hero__lead');
            const text = hero.querySelector('.payment-docs-hero__text');
            const chips = hero.querySelector('.payment-docs-hero__chips');
            const accentTitle = hero.querySelector('.payment-docs-panel--accent h2');
            const accentText = hero.querySelector('.payment-docs-panel--accent p');
            const sideMeta = hero.querySelector('.payment-docs-panel:not(.payment-docs-panel--accent) .payment-docs-panel__meta');
            const sideList = hero.querySelector('.payment-docs-panel:not(.payment-docs-panel--accent) .payment-docs-panel__list');

            if (eyebrow) bindings.push({ path: 'hero.eyebrow', type: 'text', label: 'Надзаголовок страницы оплаты', element: eyebrow });
            if (title) bindings.push({ path: 'hero.title', type: 'text', label: 'Главный заголовок страницы оплаты', element: title });
            if (lead) bindings.push({ path: 'hero.lead', type: 'textarea', label: 'Лид страницы оплаты', element: lead });
            if (text) bindings.push({ path: 'hero.text', type: 'textarea', label: 'Описание в первом экране оплаты', element: text });
            if (chips) {
                bindings.push({
                    path: 'hero.chips',
                    type: 'list',
                    label: 'Короткие плашки в первом экране оплаты',
                    element: chips,
                    render(value, binding) {
                        const items = Array.isArray(value) ? value : [];
                        binding.elements.forEach((element) => {
                            element.innerHTML = items.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
                        });
                    }
                });
            }
            if (accentTitle) bindings.push({ path: 'hero.accentCard.title', type: 'text', label: 'Заголовок акцентной карточки оплаты', element: accentTitle });
            if (accentText) bindings.push({ path: 'hero.accentCard.text', type: 'textarea', label: 'Текст акцентной карточки оплаты', element: accentText });
            if (sideMeta) bindings.push({ path: 'hero.sideCard.meta', type: 'text', label: 'Подпись боковой карточки оплаты', element: sideMeta });
            if (sideList) bindings.push({ path: 'hero.sideCard.items', type: 'list', label: 'Список в боковой карточке оплаты', element: sideList });
        }

        if (benefitsSection) {
            const title = benefitsSection.querySelector('.payment-docs-section__heading h2');
            const subtitle = benefitsSection.querySelector('.payment-docs-section__heading p');
            if (title) bindings.push({ path: 'benefits.title', type: 'text', label: 'Заголовок блока преимуществ оплаты', element: title });
            if (subtitle) bindings.push({ path: 'benefits.subtitle', type: 'textarea', label: 'Подзаголовок блока преимуществ оплаты', element: subtitle });

            benefitsSection.querySelectorAll('.payment-docs-grid .payment-docs-card').forEach((card, index) => {
                const cardTitle = card.querySelector('h3');
                const cardText = card.querySelector('p');
                if (cardTitle) bindings.push({ path: `benefits.items.${index}.title`, type: 'text', label: `Преимущество ${index + 1}: заголовок`, element: cardTitle });
                if (cardText) bindings.push({ path: `benefits.items.${index}.text`, type: 'textarea', label: `Преимущество ${index + 1}: описание`, element: cardText });
            });
        }

        if (workflowSection) {
            const title = workflowSection.querySelector('.payment-docs-section__heading h2');
            const subtitle = workflowSection.querySelector('.payment-docs-section__heading p');
            if (title) bindings.push({ path: 'workflow.title', type: 'text', label: 'Заголовок блока этапов оплаты', element: title });
            if (subtitle) bindings.push({ path: 'workflow.subtitle', type: 'textarea', label: 'Подзаголовок блока этапов оплаты', element: subtitle });

            workflowSection.querySelectorAll('.payment-docs-steps .payment-docs-step').forEach((step, index) => {
                const stepTitle = step.querySelector('h3');
                const stepText = step.querySelector('p');
                if (stepTitle) bindings.push({ path: `workflow.steps.${index}.title`, type: 'text', label: `Этап оплаты ${index + 1}: заголовок`, element: stepTitle });
                if (stepText) bindings.push({ path: `workflow.steps.${index}.text`, type: 'textarea', label: `Этап оплаты ${index + 1}: описание`, element: stepText });
            });
        }

        if (cta) {
            const title = cta.querySelector('h2');
            const text = cta.querySelector('p');
            const buttons = cta.querySelectorAll('.payment-docs-cta__actions a');

            if (title) bindings.push({ path: 'cta.title', type: 'text', label: 'Заголовок нижнего блока оплаты', element: title });
            if (text) bindings.push({ path: 'cta.text', type: 'textarea', label: 'Текст нижнего блока оплаты', element: text });
            if (buttons[0]) {
                bindings.push({
                    path: 'cta.primary',
                    type: 'object',
                    label: 'Главная кнопка нижнего блока оплаты',
                    element: buttons[0],
                    fields: [
                        { key: 'label', label: 'Текст кнопки', type: 'text' },
                        { key: 'href', label: 'Ссылка', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => renderActionNode(element, value || {}, 'btn btn-primary'));
                    }
                });
            }
            if (buttons[1]) {
                bindings.push({
                    path: 'cta.secondary',
                    type: 'object',
                    label: 'Вторая кнопка нижнего блока оплаты',
                    element: buttons[1],
                    fields: [
                        { key: 'label', label: 'Текст кнопки', type: 'text' },
                        { key: 'href', label: 'Ссылка', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => renderActionNode(element, value || {}, 'btn btn-secondary'));
                    }
                });
            }
        }

        if (!bindings.length) return;

        queueInlineBindings({
            fileName: 'payment-documents',
            sectionKey: 'payment-documents',
            sectionLabel: 'Оплата и документы',
            bindings
        });
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

            registerInlineBindings(content);
        } catch (error) {
            console.warn('Failed to apply payment documents content', error);
        }
    });
})();
