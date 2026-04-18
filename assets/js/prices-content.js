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

    const fallbackSiteContact = {
        primaryPhone: {
            label: '+7 (937) 615-46-29',
            href: 'tel:+79376154629'
        },
        secondaryPhone: {
            label: '+7 (962) 554-22-60',
            href: 'tel:+79625542260'
        },
        email: 'vorota404@mail.ru'
    };

    async function loadSiteShellData() {
        if (window.POKRASKA_SITE_CONTENT) {
            return window.POKRASKA_SITE_CONTENT;
        }

        if (!window.PokraskaContent?.loadContentFile) {
            return null;
        }

        try {
            const site = await window.PokraskaContent.loadContentFile('site');
            window.POKRASKA_SITE_CONTENT = window.POKRASKA_SITE_CONTENT || site;
            return site;
        } catch (error) {
            return null;
        }
    }

    function getSiteContact(site) {
        return site?.contact || fallbackSiteContact;
    }

    function isPhoneLikeLabel(value) {
        return /^[+\d\s()\-]+$/.test(String(value || '').trim());
    }

    function isEmailLikeLabel(value) {
        return /@/.test(String(value || '').trim());
    }

    function buildResolvedActions(actions, site) {
        const contact = getSiteContact(site);
        const primaryPhone = contact.primaryPhone || fallbackSiteContact.primaryPhone;
        const email = contact.email || fallbackSiteContact.email;
        const nextActions = {
            primary: { ...(actions?.primary || {}) },
            secondary: { ...(actions?.secondary || {}) }
        };

        ['primary', 'secondary'].forEach((key) => {
            const action = nextActions[key];
            const href = String(action.href || '').trim();
            if (href.startsWith('tel:')) {
                action.href = primaryPhone.href || href;
                if (!action.label || isPhoneLikeLabel(action.label)) {
                    action.label = primaryPhone.label || action.label || '';
                }
                action.icon = action.icon || 'fas fa-phone';
            } else if (href.startsWith('mailto:')) {
                action.href = email ? `mailto:${email}` : href;
                if (!action.label || isEmailLikeLabel(action.label)) {
                    action.label = email || action.label || '';
                }
                action.icon = action.icon || 'fas fa-envelope';
            }
        });

        return nextActions;
    }

    function buildResolvedPhoneList(items, site) {
        const contact = getSiteContact(site);
        const primaryPhone = contact.primaryPhone || fallbackSiteContact.primaryPhone;
        const secondaryPhone = contact.secondaryPhone || fallbackSiteContact.secondaryPhone;
        let phoneIndex = 0;

        return (Array.isArray(items) ? items : []).map((item) => {
            const nextItem = { ...(item || {}) };
            const href = String(nextItem.href || '').trim();
            if (!href.startsWith('tel:')) {
                return nextItem;
            }

            const phone = phoneIndex === 0 ? primaryPhone : (secondaryPhone || primaryPhone);
            phoneIndex += 1;
            nextItem.href = phone?.href || href;
            if (!nextItem.label || isPhoneLikeLabel(nextItem.label)) {
                nextItem.label = phone?.label || nextItem.label || '';
            }
            return nextItem;
        });
    }

    function buildResolvedPricesContent(content, site) {
        return {
            ...content,
            calculator: {
                ...(content?.calculator || {}),
                phones: buildResolvedPhoneList(content?.calculator?.phones || [], site)
            },
            cta: buildResolvedActions(content?.cta || {}, site)
        };
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

    function applyFactorCard(card, item) {
        if (!card || !item) return;
        const icon = card.querySelector('i');
        const title = card.querySelector('h3');
        const text = card.querySelector('p');
        if (icon) icon.className = item.icon || '';
        if (title) title.textContent = item.title || '';
        if (text) text.textContent = item.text || '';
    }

    function syncFactorCards(section, items) {
        const grid = section?.querySelector('.factors-grid');
        if (!grid) return;
        syncCollection(grid, '.factor-card', items, applyFactorCard);
    }

    function applyFaqItem(itemElement, item) {
        if (!itemElement || !item) return;
        const question = itemElement.querySelector('.faq-question');
        const answer = itemElement.querySelector('.faq-answer p');
        if (question) question.textContent = item.question || '';
        if (answer) answer.textContent = item.answer || '';
    }

    function syncFaqItems(section, items) {
        const list = section?.querySelector('.faq-list');
        if (!list) return;
        syncCollection(list, '.faq-item', items, applyFaqItem);
    }

    function renderCalculatorContactLine(container, label, phones) {
        if (!container) return;
        container.dataset.inlineContactLabel = label || '';
        const links = (Array.isArray(phones) ? phones : []).map((item) => `
            <a href="${escapeHtml(item.href || '#')}">${escapeHtml(item.label || '')}</a>
        `).join(', ');
        container.innerHTML = `<i class="fas fa-phone"></i> ${escapeHtml(label || '')} ${links}`.trim();
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
        const calculatorContact = document.querySelector('.calculator-contact');
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

        const buildFactorBinding = (targetCard, index) => ({
            path: `factors.items.${index}`,
            type: 'object',
            editorKindLabel: 'Карточка на странице',
            label: `Карточка фактора ${index + 1} целиком`,
            element: targetCard,
            collectionPath: 'factors.items',
            collectionItemFactory(nextIndex) {
                const nextCard = document.querySelectorAll('.factors-grid .factor-card')[nextIndex];
                if (!nextCard) return null;
                return buildFactorBinding(nextCard, nextIndex);
            },
            collectionCreateValue() {
                return {
                    icon: 'fas fa-star',
                    title: 'Новый фактор',
                    text: 'Короткое описание фактора.'
                };
            },
            fields: [
                { key: 'icon', label: 'Класс иконки', type: 'text' },
                { key: 'title', label: 'Заголовок', type: 'text' },
                { key: 'text', label: 'Описание', type: 'textarea' }
            ],
            collectionRender(items) {
                syncFactorCards(document.querySelector('.price-factors'), Array.isArray(items) ? items : []);
            },
            render(value) {
                applyFactorCard(targetCard, value || {});
            }
        });

        document.querySelectorAll('.factors-grid .factor-card').forEach((card, index) => {
            const title = card.querySelector('h3');
            const text = card.querySelector('p');
            bindings.push(buildFactorBinding(card, index));
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
        if (calculatorContact) bindings.push({ path: 'calculator.contactLabel', type: 'text', label: 'Подпись перед телефонами в блоке расчета', element: calculatorContact, render(value) { renderCalculatorContactLine(calculatorContact, value, content.calculator?.phones || []); } });
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
        const buildCalculatorPhoneBinding = (targetPhone, index) => ({
            path: `calculator.phones.${index}`,
            type: 'object',
            editorKindLabel: 'Контакт на странице',
            label: `Телефон в блоке расчета ${index + 1}`,
            element: targetPhone,
            collectionPath: 'calculator.phones',
            collectionItemFactory(nextIndex) {
                const nextPhone = document.querySelectorAll('.calculator-contact a')[nextIndex];
                if (!nextPhone) return null;
                return buildCalculatorPhoneBinding(nextPhone, nextIndex);
            },
            collectionCreateValue() {
                return {
                    label: 'Новый телефон',
                    href: 'tel:+70000000000'
                };
            },
            fields: [
                { key: 'label', label: 'Текст телефона', type: 'text' },
                { key: 'href', label: 'Ссылка tel:', type: 'text' }
            ],
            collectionRender(items) {
                renderCalculatorContactLine(
                    calculatorContact,
                    calculatorContact?.dataset.inlineContactLabel || content.calculator?.contactLabel || '',
                    Array.isArray(items) ? items : []
                );
            },
            render(value, binding) {
                binding.elements.forEach((element) => {
                    element.textContent = value?.label || '';
                    element.setAttribute('href', value?.href || '#');
                });
            }
        });

        calculatorPhones.forEach((phone, index) => {
            bindings.push(buildCalculatorPhoneBinding(phone, index));
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
        const buildFaqBinding = (targetItem, index) => ({
            path: `faq.items.${index}`,
            type: 'object',
            editorKindLabel: 'FAQ на странице',
            label: `Вопрос FAQ ${index + 1} целиком`,
            element: targetItem,
            collectionPath: 'faq.items',
            collectionItemFactory(nextIndex) {
                const nextItem = document.querySelectorAll('.faq-list .faq-item')[nextIndex];
                if (!nextItem) return null;
                return buildFaqBinding(nextItem, nextIndex);
            },
            collectionCreateValue() {
                return {
                    question: 'Новый вопрос',
                    answer: 'Новый ответ'
                };
            },
            fields: [
                { key: 'question', label: 'Вопрос', type: 'text' },
                { key: 'answer', label: 'Ответ', type: 'textarea' }
            ],
            collectionRender(items) {
                syncFaqItems(document.querySelector('#prices-faq-title')?.closest('section'), Array.isArray(items) ? items : []);
            },
            render(value) {
                applyFaqItem(targetItem, value || {});
            }
        });
        document.querySelectorAll('.faq-list .faq-item').forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer p');
            bindings.push(buildFaqBinding(item, index));
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
            const [content, site] = await Promise.all([
                window.PokraskaContent.loadContentFile('prices'),
                loadSiteShellData()
            ]);
            const resolvedContent = buildResolvedPricesContent(content || {}, site);

            const header = document.querySelector('.price-header');
            if (header) {
                const title = header.querySelector('h1');
                const subtitle = header.querySelector('.subtitle');
                if (title) {
                    title.innerHTML = `<i class="fas fa-tags"></i> ${escapeHtml(resolvedContent.header?.title || '')}`;
                }
                if (subtitle) {
                    subtitle.textContent = resolvedContent.header?.subtitle || '';
                }
            }

            const factors = document.querySelector('.price-factors');
            if (factors) {
                const title = factors.querySelector('h2');
                if (title) {
                    title.innerHTML = `<i class="fas fa-chart-line"></i> ${escapeHtml(resolvedContent.factors?.title || '')}`;
                }
                syncFactorCards(factors, resolvedContent.factors?.items || []);
            }

            const calculator = document.querySelector('.calculator-section');
            if (calculator) {
                const title = calculator.querySelector('h2');
                const text = calculator.querySelector('p');
                const contact = calculator.querySelector('.calculator-contact');
                const actionWrap = calculator.querySelector('.btn.btn-primary');

                if (title) {
                    title.innerHTML = `<i class="fas fa-calculator"></i> ${escapeHtml(resolvedContent.calculator?.title || '')}`;
                }
                if (text) {
                    text.textContent = resolvedContent.calculator?.text || '';
                }
                if (actionWrap && resolvedContent.calculator?.action) {
                    actionWrap.outerHTML = renderButton(resolvedContent.calculator.action, 'btn btn-primary');
                }
                if (contact) {
                    renderCalculatorContactLine(contact, resolvedContent.calculator?.contactLabel || '', resolvedContent.calculator?.phones || []);
                }
            }

            const guarantee = document.querySelector('.guarantee-section');
            if (guarantee) {
                const badge = guarantee.querySelector('.guarantee-badge span');
                const title = guarantee.querySelector('.guarantee-title');
                const text = guarantee.querySelector('.guarantee-text');
                if (badge) badge.textContent = resolvedContent.guarantee?.badge || '';
                if (title) title.textContent = resolvedContent.guarantee?.title || '';
                if (text) text.textContent = resolvedContent.guarantee?.text || '';
            }

            const cta = document.querySelector('.price-cta');
            if (cta) {
                cta.innerHTML = [
                    renderButton(resolvedContent.cta?.primary || {}, 'btn btn-primary'),
                    renderButton(resolvedContent.cta?.secondary || {}, 'btn btn-secondary')
                ].join('');
            }

            const faqSection = document.querySelector('#prices-faq-title')?.closest('section');
            if (faqSection) {
                const title = faqSection.querySelector('.section-title');
                const subtitle = faqSection.querySelector('.section-subtitle');
                if (title) title.textContent = resolvedContent.faq?.title || '';
                if (subtitle) subtitle.textContent = resolvedContent.faq?.subtitle || '';
                syncFaqItems(faqSection, resolvedContent.faq?.items || []);
            }

            registerInlineBindings(resolvedContent);
        } catch (error) {
            console.warn('Failed to apply prices content', error);
        }
    });
})();
