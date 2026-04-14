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

    function applyBenefitCard(card, item) {
        if (!card || !item) return;
        const icon = card.querySelector('.payment-docs-card__icon i');
        const title = card.querySelector('h3');
        const text = card.querySelector('p');
        if (icon) icon.className = item.icon || '';
        if (title) title.textContent = item.title || '';
        if (text) text.textContent = item.text || '';
    }

    function syncBenefitsGrid(section, items) {
        const grid = section?.querySelector('.payment-docs-grid');
        if (!grid) return;
        syncCollection(grid, '.payment-docs-card', items, applyBenefitCard);
    }

    function applyWorkflowStep(step, item) {
        if (!step || !item) return;
        const number = step.querySelector('.payment-docs-step__number');
        const title = step.querySelector('h3');
        const text = step.querySelector('p');
        if (number) number.textContent = item.number || '';
        if (title) title.textContent = item.title || '';
        if (text) text.textContent = item.text || '';
    }

    function syncWorkflowSteps(section, items) {
        const steps = section?.querySelector('.payment-docs-steps');
        if (!steps) return;
        syncCollection(steps, '.payment-docs-step', items, applyWorkflowStep);
    }

    function applyHeroChip(node, item) {
        if (!node) return;
        node.textContent = item || '';
    }

    function syncHeroChips(hero, items) {
        const container = hero?.querySelector('.payment-docs-hero__chips');
        if (!container) return;
        syncCollection(container, 'span', items, applyHeroChip);
    }

    function applySideCardItem(node, item) {
        if (!node) return;
        node.textContent = item || '';
    }

    function syncSideCardItems(hero, items) {
        const container = hero?.querySelector('.payment-docs-panel:not(.payment-docs-panel--accent) .payment-docs-panel__list');
        if (!container) return;
        syncCollection(container, 'li', items, applySideCardItem);
    }

    function registerInlineBindings() {
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
                const buildChipBinding = (targetItem, index) => ({
                    path: `hero.chips.${index}`,
                    type: 'text',
                    editorKindLabel: 'Плашка на странице',
                    collectionItemLabel: 'элемент',
                    collectionItemLabelPlural: 'элементов',
                    label: `Плашка в первом экране оплаты ${index + 1}`,
                    element: targetItem,
                    collectionPath: 'hero.chips',
                    collectionItemFactory(nextIndex) {
                        const nextItem = hero.querySelectorAll('.payment-docs-hero__chips span')[nextIndex];
                        if (!nextItem) return null;
                        return buildChipBinding(nextItem, nextIndex);
                    },
                    collectionCreateValue() {
                        return 'Новая плашка';
                    },
                    collectionRender(items) {
                        syncHeroChips(hero, Array.isArray(items) ? items : []);
                    },
                    render(value, binding) {
                        binding.elements.forEach((element) => applyHeroChip(element, value || ''));
                    }
                });

                chips.querySelectorAll('span').forEach((item, index) => {
                    bindings.push(buildChipBinding(item, index));
                });
            }
            if (accentTitle) bindings.push({ path: 'hero.accentCard.title', type: 'text', label: 'Заголовок акцентной карточки оплаты', element: accentTitle });
            if (accentText) bindings.push({ path: 'hero.accentCard.text', type: 'textarea', label: 'Текст акцентной карточки оплаты', element: accentText });
            if (sideMeta) bindings.push({ path: 'hero.sideCard.meta', type: 'text', label: 'Подпись боковой карточки оплаты', element: sideMeta });
            if (sideList) {
                const buildSideItemBinding = (targetItem, index) => ({
                    path: `hero.sideCard.items.${index}`,
                    type: 'text',
                    editorKindLabel: 'Пункт на странице',
                    collectionItemLabel: 'пункт',
                    collectionItemLabelPlural: 'пунктов',
                    label: `Пункт в боковой карточке оплаты ${index + 1}`,
                    element: targetItem,
                    collectionPath: 'hero.sideCard.items',
                    collectionItemFactory(nextIndex) {
                        const nextItem = hero.querySelectorAll('.payment-docs-panel:not(.payment-docs-panel--accent) .payment-docs-panel__list li')[nextIndex];
                        if (!nextItem) return null;
                        return buildSideItemBinding(nextItem, nextIndex);
                    },
                    collectionCreateValue() {
                        return 'Новый пункт';
                    },
                    collectionRender(items) {
                        syncSideCardItems(hero, Array.isArray(items) ? items : []);
                    },
                    render(value, binding) {
                        binding.elements.forEach((element) => applySideCardItem(element, value || ''));
                    }
                });

                sideList.querySelectorAll('li').forEach((item, index) => {
                    bindings.push(buildSideItemBinding(item, index));
                });
            }
        }

        if (benefitsSection) {
            const title = benefitsSection.querySelector('.payment-docs-section__heading h2');
            const subtitle = benefitsSection.querySelector('.payment-docs-section__heading p');
            if (title) bindings.push({ path: 'benefits.title', type: 'text', label: 'Заголовок блока преимуществ оплаты', element: title });
            if (subtitle) bindings.push({ path: 'benefits.subtitle', type: 'textarea', label: 'Подзаголовок блока преимуществ оплаты', element: subtitle });

            const buildBenefitBinding = (targetCard, index) => ({
                path: `benefits.items.${index}`,
                type: 'object',
                editorKindLabel: 'Карточка на странице',
                label: `Преимущество ${index + 1} целиком`,
                element: targetCard,
                collectionPath: 'benefits.items',
                collectionItemFactory(nextIndex) {
                    const nextCard = document.querySelectorAll('.payment-docs-grid .payment-docs-card')[nextIndex];
                    if (!nextCard) return null;
                    return buildBenefitBinding(nextCard, nextIndex);
                },
                collectionCreateValue() {
                    return {
                        icon: 'fas fa-check-circle',
                        title: 'Новое преимущество',
                        text: 'Короткое описание преимущества.'
                    };
                },
                fields: [
                    { key: 'icon', label: 'Класс иконки', type: 'text' },
                    { key: 'title', label: 'Заголовок', type: 'text' },
                    { key: 'text', label: 'Описание', type: 'textarea' }
                ],
                collectionRender(items) {
                    syncBenefitsGrid(document.querySelector('#payment-benefits-title')?.closest('.payment-docs-section'), Array.isArray(items) ? items : []);
                },
                render(value) {
                    applyBenefitCard(targetCard, value || {});
                }
            });

            benefitsSection.querySelectorAll('.payment-docs-grid .payment-docs-card').forEach((card, index) => {
                const cardTitle = card.querySelector('h3');
                const cardText = card.querySelector('p');
                bindings.push(buildBenefitBinding(card, index));
                if (cardTitle) bindings.push({ path: `benefits.items.${index}.title`, type: 'text', label: `Преимущество ${index + 1}: заголовок`, element: cardTitle });
                if (cardText) bindings.push({ path: `benefits.items.${index}.text`, type: 'textarea', label: `Преимущество ${index + 1}: описание`, element: cardText });
            });
        }

        if (workflowSection) {
            const title = workflowSection.querySelector('.payment-docs-section__heading h2');
            const subtitle = workflowSection.querySelector('.payment-docs-section__heading p');
            if (title) bindings.push({ path: 'workflow.title', type: 'text', label: 'Заголовок блока этапов оплаты', element: title });
            if (subtitle) bindings.push({ path: 'workflow.subtitle', type: 'textarea', label: 'Подзаголовок блока этапов оплаты', element: subtitle });

            const buildWorkflowBinding = (targetStep, index) => ({
                path: `workflow.steps.${index}`,
                type: 'object',
                editorKindLabel: 'Шаг на странице',
                label: `Этап оплаты ${index + 1} целиком`,
                element: targetStep,
                collectionPath: 'workflow.steps',
                collectionItemFactory(nextIndex) {
                    const nextStep = document.querySelectorAll('.payment-docs-steps .payment-docs-step')[nextIndex];
                    if (!nextStep) return null;
                    return buildWorkflowBinding(nextStep, nextIndex);
                },
                collectionCreateValue() {
                    return {
                        number: String(index + 2),
                        title: 'Новый этап',
                        text: 'Короткое описание этапа.'
                    };
                },
                fields: [
                    { key: 'number', label: 'Номер шага', type: 'text' },
                    { key: 'title', label: 'Заголовок', type: 'text' },
                    { key: 'text', label: 'Описание', type: 'textarea' }
                ],
                collectionRender(items) {
                    syncWorkflowSteps(document.querySelector('#payment-flow-title')?.closest('.payment-docs-section'), Array.isArray(items) ? items : []);
                },
                render(value) {
                    applyWorkflowStep(targetStep, value || {});
                }
            });

            workflowSection.querySelectorAll('.payment-docs-steps .payment-docs-step').forEach((step, index) => {
                const stepNumber = step.querySelector('.payment-docs-step__number');
                const stepTitle = step.querySelector('h3');
                const stepText = step.querySelector('p');
                bindings.push(buildWorkflowBinding(step, index));
                if (stepNumber) bindings.push({ path: `workflow.steps.${index}.number`, type: 'text', label: `Этап оплаты ${index + 1}: номер`, element: stepNumber });
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
                    syncHeroChips(hero, content.hero?.chips || []);
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
                    if (list) syncSideCardItems(hero, content.hero?.sideCard?.items || []);
                }
            }

            const benefitsSection = document.querySelector('#payment-benefits-title')?.closest('.payment-docs-section');
            if (benefitsSection) {
                const title = benefitsSection.querySelector('.payment-docs-section__heading h2');
                const subtitle = benefitsSection.querySelector('.payment-docs-section__heading p');
                if (title) title.textContent = content.benefits?.title || '';
                if (subtitle) subtitle.textContent = content.benefits?.subtitle || '';
                syncBenefitsGrid(benefitsSection, content.benefits?.items || []);
            }

            const workflowSection = document.querySelector('#payment-flow-title')?.closest('.payment-docs-section');
            if (workflowSection) {
                const title = workflowSection.querySelector('.payment-docs-section__heading h2');
                const subtitle = workflowSection.querySelector('.payment-docs-section__heading p');
                if (title) title.textContent = content.workflow?.title || '';
                if (subtitle) subtitle.textContent = content.workflow?.subtitle || '';
                syncWorkflowSteps(workflowSection, content.workflow?.steps || []);
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

            registerInlineBindings();
        } catch (error) {
            console.warn('Failed to apply payment documents content', error);
        }
    });
})();
