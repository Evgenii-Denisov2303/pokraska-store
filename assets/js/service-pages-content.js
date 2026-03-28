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
                <i class="${escapeHtml(action.icon || '')}" aria-hidden="true"></i> ${escapeHtml(action.label || '')}
            </a>
        `;
    }

    function renderButtonNode(anchor, action, className) {
        if (!anchor) return;
        anchor.className = className;
        anchor.setAttribute('href', action?.href || '#');
        anchor.innerHTML = `<i class="${escapeHtml(action?.icon || '')}" aria-hidden="true"></i> ${escapeHtml(action?.label || '')}`;
    }

    function renderHeadingWithIcon(element, iconClass, text) {
        if (!element) return;
        element.innerHTML = `<i class="${escapeHtml(iconClass || '')}"></i> ${escapeHtml(text || '')}`;
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

    function registerInlineBindings(pageKey, pageContent) {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const headerTitle = document.querySelector('.services-header h1');
        const headerSubtitle = document.querySelector('.services-header .subtitle');
        const finalCta = document.querySelector('.services-cta');
        const faqSection = document.querySelector('#services-faq-title')?.closest('section');
        const fileSectionLabel = pageKey === 'powderCoating' ? 'Порошковая покраска' : 'Пескоструйная обработка';
        const headerIcon = pageContent.header?.icon || '';

        if (headerTitle) {
            bindings.push({
                path: `${pageKey}.header.title`,
                type: 'text',
                label: 'Заголовок страницы услуг',
                element: headerTitle,
                render(value, binding) {
                    binding.elements.forEach((element) => renderHeadingWithIcon(element, headerIcon, value));
                }
            });
        }
        if (headerSubtitle) bindings.push({ path: `${pageKey}.header.subtitle`, type: 'textarea', label: 'Подзаголовок страницы услуг', element: headerSubtitle });

        document.querySelectorAll('#service-nav .service-nav-link').forEach((link, index) => {
            bindings.push({
                path: `${pageKey}.quickNav.${index}.label`,
                type: 'text',
                label: `Пункт навигации ${index + 1}`,
                element: link,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        const icon = element.querySelector('i');
                        const iconHtml = icon ? icon.outerHTML : '';
                        const href = element.getAttribute('href') || '#';
                        element.innerHTML = `${iconHtml} ${escapeHtml(value || '')}`.trim();
                        element.setAttribute('href', href);
                    });
                }
            });
        });

        if (pageKey === 'sandblasting' && pageContent.beforeAfter) {
            const beforeAfterTitle = document.querySelector('.before-after-section .section-title');
            const beforeAfterSubtitle = document.querySelector('.before-after-section .section-subtitle');
            const beforeAfterNote = document.querySelector('.before-after__note');
            if (beforeAfterTitle) bindings.push({ path: `${pageKey}.beforeAfter.title`, type: 'text', label: 'Заголовок блока до/после', element: beforeAfterTitle });
            if (beforeAfterSubtitle) bindings.push({ path: `${pageKey}.beforeAfter.subtitle`, type: 'textarea', label: 'Подзаголовок блока до/после', element: beforeAfterSubtitle });
            if (beforeAfterNote) bindings.push({ path: `${pageKey}.beforeAfter.note`, type: 'textarea', label: 'Подпись под блоком до/после', element: beforeAfterNote });
        }

        (pageContent.sections || []).forEach((sectionContent, index) => {
            const card = document.getElementById(sectionContent.id);
            if (!card) return;

            const title = card.querySelector('.service-header h2');
            const badge = card.querySelector('.service-id');
            const description = card.querySelector('.service-description');
            const advantagesTitle = card.querySelector('.service-advantages h3');
            const processSteps = card.querySelectorAll('.process-step');
            const paletteTitle = card.querySelector('.palette-card__info h3');
            const paletteText = card.querySelector('.palette-card__info p');
            const paletteList = card.querySelector('.palette-card__info ul');
            const paletteAction = card.querySelector('.palette-card__info .btn');

            if (title) bindings.push({ path: `${pageKey}.sections.${index}.title`, type: 'text', label: `${sectionContent.title || `Услуга ${index + 1}`}: заголовок`, element: title });
            if (badge) bindings.push({ path: `${pageKey}.sections.${index}.badge`, type: 'text', label: `${sectionContent.title || `Услуга ${index + 1}`}: бейдж`, element: badge });
            if (description) bindings.push({ path: `${pageKey}.sections.${index}.description`, type: 'textarea', label: `${sectionContent.title || `Услуга ${index + 1}`}: описание`, element: description });

            if (advantagesTitle && sectionContent.advantagesTitle) {
                bindings.push({
                    path: `${pageKey}.sections.${index}.advantagesTitle`,
                    type: 'text',
                    label: `${sectionContent.title || `Услуга ${index + 1}`}: заголовок преимуществ`,
                    element: advantagesTitle,
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            element.innerHTML = `<i class="${escapeHtml(sectionContent.advantagesIcon || '')}"></i> ${escapeHtml(value || '')}`;
                        });
                    }
                });
            }

            card.querySelectorAll('.advantages-grid .advantage-item').forEach((item, itemIndex) => {
                const span = item.querySelector('span');
                if (span) {
                    bindings.push({
                        path: `${pageKey}.sections.${index}.advantages.${itemIndex}.text`,
                        type: 'text',
                        label: `${sectionContent.title || `Услуга ${index + 1}`}: пункт ${itemIndex + 1}`,
                        element: span
                    });
                }
            });

            processSteps.forEach((step, stepIndex) => {
                const stepTitle = step.querySelector('h4');
                const stepText = step.querySelector('p');
                if (stepTitle) bindings.push({ path: `${pageKey}.sections.${index}.processSteps.${stepIndex}.title`, type: 'text', label: `${sectionContent.title || `Услуга ${index + 1}`}: шаг ${stepIndex + 1}`, element: stepTitle });
                if (stepText) bindings.push({ path: `${pageKey}.sections.${index}.processSteps.${stepIndex}.text`, type: 'textarea', label: `${sectionContent.title || `Услуга ${index + 1}`}: описание шага ${stepIndex + 1}`, element: stepText });
            });

            if (paletteTitle) {
                bindings.push({
                    path: `${pageKey}.sections.${index}.paletteCard.title`,
                    type: 'text',
                    label: `${sectionContent.title || `Услуга ${index + 1}`}: заголовок палитры`,
                    element: paletteTitle,
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            element.innerHTML = `<i class="${escapeHtml(sectionContent.paletteCard?.icon || '')}"></i> ${escapeHtml(value || '')}`;
                        });
                    }
                });
            }
            if (paletteText) bindings.push({ path: `${pageKey}.sections.${index}.paletteCard.text`, type: 'textarea', label: `${sectionContent.title || `Услуга ${index + 1}`}: текст палитры`, element: paletteText });
            if (paletteList) bindings.push({ path: `${pageKey}.sections.${index}.paletteCard.points`, type: 'list', label: `${sectionContent.title || `Услуга ${index + 1}`}: список палитры`, element: paletteList });
            if (paletteAction) {
                bindings.push({
                    path: `${pageKey}.sections.${index}.paletteCard.action`,
                    type: 'object',
                    label: `${sectionContent.title || `Услуга ${index + 1}`}: кнопка палитры`,
                    element: paletteAction,
                    fields: [
                        { key: 'label', label: 'Текст кнопки', type: 'text' },
                        { key: 'href', label: 'Ссылка', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'btn btn-secondary'));
                    }
                });
            }
        });

        const sharedPrimaryButtons = Array.from(document.querySelectorAll('.service-cta .btn-primary'));
        const sharedSecondaryButtons = Array.from(document.querySelectorAll('.service-cta .btn-secondary'));
        if (sharedPrimaryButtons.length) {
            bindings.push({
                path: 'sharedCta.primary',
                type: 'object',
                label: 'Основная кнопка внутри карточек услуг',
                element: sharedPrimaryButtons,
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'btn btn-primary'));
                }
            });
        }
        if (sharedSecondaryButtons.length) {
            bindings.push({
                path: 'sharedCta.secondary',
                type: 'object',
                label: 'Вторая кнопка внутри карточек услуг',
                element: sharedSecondaryButtons,
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'btn btn-secondary'));
                }
            });
        }

        if (finalCta) {
            const ctaTitle = finalCta.querySelector('h2');
            const ctaText = finalCta.querySelector('.cta-text');
            const ctaAction = finalCta.querySelector('.btn.btn-primary');
            const phones = finalCta.querySelectorAll('.cta-phone a');

            if (ctaTitle) bindings.push({ path: `${pageKey}.cta.title`, type: 'text', label: 'Заголовок нижнего блока услуг', element: ctaTitle });
            if (ctaText) bindings.push({ path: `${pageKey}.cta.text`, type: 'textarea', label: 'Описание нижнего блока услуг', element: ctaText });
            if (ctaAction) {
                bindings.push({
                    path: `${pageKey}.cta.action`,
                    type: 'object',
                    label: 'Кнопка нижнего блока услуг',
                    element: ctaAction,
                    fields: [
                        { key: 'label', label: 'Текст кнопки', type: 'text' },
                        { key: 'href', label: 'Ссылка', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'btn btn-primary'));
                    }
                });
            }
            phones.forEach((phone, index) => {
                bindings.push({
                    path: `${pageKey}.cta.phones.${index}`,
                    type: 'object',
                    label: `Телефон в нижнем блоке услуг ${index + 1}`,
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
        }

        if (faqSection) {
            const faqTitle = faqSection.querySelector('.section-title');
            const faqSubtitle = faqSection.querySelector('.section-subtitle');
            if (faqTitle) bindings.push({ path: `${pageKey}.faq.title`, type: 'text', label: 'Заголовок FAQ услуг', element: faqTitle });
            if (faqSubtitle) bindings.push({ path: `${pageKey}.faq.subtitle`, type: 'textarea', label: 'Подзаголовок FAQ услуг', element: faqSubtitle });
            faqSection.querySelectorAll('.faq-list .faq-item').forEach((item, index) => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer p');
                if (question) bindings.push({ path: `${pageKey}.faq.items.${index}.question`, type: 'text', label: `Вопрос FAQ ${index + 1}`, element: question });
                if (answer) bindings.push({ path: `${pageKey}.faq.items.${index}.answer`, type: 'textarea', label: `Ответ FAQ ${index + 1}`, element: answer });
            });
        }

        if (!bindings.length) return;

        queueInlineBindings({
            fileName: 'service-pages',
            sectionKey: pageKey,
            sectionLabel: fileSectionLabel,
            bindings
        });
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
            registerInlineBindings(pageKey, pageContent);
        } catch (error) {
            console.warn('Failed to apply service page content', error);
        }
    });
})();
