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

    function renderButton(action, className) {
        return `
            <a href="${escapeHtml(action.href || '#')}" class="${escapeHtml(className)}">
                <i class="${escapeHtml(action.icon || '')}"></i> ${escapeHtml(action.label || '')}
            </a>
        `;
    }

    function renderButtonNode(anchor, action, className) {
        if (!anchor) return;

        anchor.className = className;
        anchor.setAttribute('href', action?.href || '#');
        anchor.innerHTML = `<i class="${escapeHtml(action?.icon || '')}"></i> ${escapeHtml(action?.label || '')}`;
    }

    function renderHeadingWithIcon(element, iconClass, text) {
        if (!element) return;
        element.innerHTML = `<i class="${escapeHtml(iconClass || '')}"></i> ${escapeHtml(text || '')}`;
    }

    function registerInlineBindings(content) {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const headerTitle = document.querySelector('.price-header h1');
        const headerSubtitle = document.querySelector('.price-header .subtitle');
        const factorsTitle = document.querySelector('.price-factors h2');
        const calculatorTitle = document.querySelector('.calculator-section h2');
        const calculatorText = document.querySelector('.calculator-section p');
        const calculatorAction = document.querySelector('.calculator-section .btn.btn-primary');
        const calculatorPhones = document.querySelectorAll('.calculator-contact a');
        const guaranteeBadge = document.querySelector('.guarantee-badge span');
        const guaranteeTitle = document.querySelector('.guarantee-title');
        const guaranteeText = document.querySelector('.guarantee-text');
        const ctaButtons = document.querySelectorAll('.price-cta a');
        const faqTitle = document.querySelector('#prices-faq-title');
        const faqSubtitle = faqTitle?.parentElement?.querySelector('.section-subtitle');

        if (headerTitle) {
            bindings.push({
                path: 'header.title',
                type: 'text',
                label: 'Заголовок страницы цен',
                element: headerTitle,
                render(value, binding) {
                    binding.elements.forEach((element) => renderHeadingWithIcon(element, 'fas fa-tags', value));
                }
            });
        }
        if (headerSubtitle) {
            bindings.push({ path: 'header.subtitle', type: 'textarea', label: 'Подзаголовок страницы цен', element: headerSubtitle });
        }
        if (factorsTitle) {
            bindings.push({
                path: 'factors.title',
                type: 'text',
                label: 'Заголовок блока факторов стоимости',
                element: factorsTitle,
                render(value, binding) {
                    binding.elements.forEach((element) => renderHeadingWithIcon(element, 'fas fa-chart-line', value));
                }
            });
        }

        document.querySelectorAll('.factors-grid .factor-card').forEach((card, index) => {
            const title = card.querySelector('h3');
            const text = card.querySelector('p');
            if (title) bindings.push({ path: `factors.items.${index}.title`, type: 'text', label: `Карточка фактора ${index + 1}: заголовок`, element: title });
            if (text) bindings.push({ path: `factors.items.${index}.text`, type: 'textarea', label: `Карточка фактора ${index + 1}: описание`, element: text });
        });

        if (calculatorTitle) {
            bindings.push({
                path: 'calculator.title',
                type: 'text',
                label: 'Заголовок блока расчета',
                element: calculatorTitle,
                render(value, binding) {
                    binding.elements.forEach((element) => renderHeadingWithIcon(element, 'fas fa-calculator', value));
                }
            });
        }
        if (calculatorText) bindings.push({ path: 'calculator.text', type: 'textarea', label: 'Описание блока расчета', element: calculatorText });
        if (calculatorAction) {
            bindings.push({
                path: 'calculator.action',
                type: 'object',
                label: 'Кнопка в блоке расчета',
                element: calculatorAction,
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'btn btn-primary'));
                }
            });
        }
        calculatorPhones.forEach((phone, index) => {
            bindings.push({
                path: `calculator.phones.${index}`,
                type: 'object',
                label: `Телефон в блоке расчета ${index + 1}`,
                element: phone,
                fields: [
                    { key: 'label', label: 'Текст телефона', type: 'text' },
                    { key: 'href', label: 'Ссылка tel:', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.textContent = value?.label || '';
                        element.setAttribute('href', value?.href || '#');
                    });
                }
            });
        });

        if (guaranteeBadge) bindings.push({ path: 'guarantee.badge', type: 'text', label: 'Плашка гарантии', element: guaranteeBadge });
        if (guaranteeTitle) bindings.push({ path: 'guarantee.title', type: 'text', label: 'Заголовок гарантии', element: guaranteeTitle });
        if (guaranteeText) bindings.push({ path: 'guarantee.text', type: 'textarea', label: 'Описание гарантии', element: guaranteeText });

        if (ctaButtons[0]) {
            bindings.push({
                path: 'cta.primary',
                type: 'object',
                label: 'Главная кнопка CTA на странице цен',
                element: ctaButtons[0],
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'btn btn-primary'));
                }
            });
        }
        if (ctaButtons[1]) {
            bindings.push({
                path: 'cta.secondary',
                type: 'object',
                label: 'Вторая кнопка CTA на странице цен',
                element: ctaButtons[1],
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'btn btn-secondary'));
                }
            });
        }

        if (faqTitle) bindings.push({ path: 'faq.title', type: 'text', label: 'Заголовок FAQ по ценам', element: faqTitle });
        if (faqSubtitle) bindings.push({ path: 'faq.subtitle', type: 'textarea', label: 'Подзаголовок FAQ по ценам', element: faqSubtitle });
        document.querySelectorAll('.faq-list .faq-item').forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer p');
            if (question) bindings.push({ path: `faq.items.${index}.question`, type: 'text', label: `Вопрос FAQ ${index + 1}`, element: question });
            if (answer) bindings.push({ path: `faq.items.${index}.answer`, type: 'textarea', label: `Ответ FAQ ${index + 1}`, element: answer });
        });

        if (!bindings.length) return;

        queueInlineBindings({
            fileName: 'prices',
            sectionKey: 'prices',
            sectionLabel: 'Страница цен',
            bindings
        });
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

            registerInlineBindings(content);
        } catch (error) {
            console.warn('Failed to apply prices content', error);
        }
    });
})();
