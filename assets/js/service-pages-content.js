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

    function extractDirectoryFromSrc(src, fallback = 'assets/images/works') {
        const cleanSrc = String(src || '').split('?')[0];
        const withoutDots = cleanSrc.replace(/^(\.\.\/)+/, '');
        const lastSlashIndex = withoutDots.lastIndexOf('/');
        return lastSlashIndex >= 0 ? withoutDots.slice(0, lastSlashIndex) : fallback;
    }

    function extractImageValue(image, link) {
        if (!image) return { src: '', alt: '', title: '', width: null, height: null };
        return {
            src: image.getAttribute('src') || '',
            alt: image.getAttribute('alt') || '',
            title: link?.getAttribute('title') || image.getAttribute('alt') || '',
            width: Number(image.getAttribute('width')) || null,
            height: Number(image.getAttribute('height')) || null
        };
    }

    function applyImageValue(image, value) {
        if (!image || !value) return;
        image.src = value.src || '';
        image.alt = value.alt || '';
        if (value.width) image.setAttribute('width', Number(value.width));
        if (value.height) image.setAttribute('height', Number(value.height));
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

    function applyTextListItem(element, value) {
        if (!element) return;
        element.textContent = value || '';
    }

    function syncTextList(container, itemSelector, items) {
        if (!container) return;
        syncCollection(container, itemSelector, Array.isArray(items) ? items : [], (element, value) => {
            applyTextListItem(element, value);
        });
    }

    function applyAdvantageItem(itemElement, item) {
        if (!itemElement || !item) return;
        const icon = itemElement.querySelector('i');
        const text = itemElement.querySelector('span');
        if (icon) icon.className = item.icon || '';
        if (text) text.textContent = item.text || '';
    }

    function syncAdvantages(card, items) {
        const grid = card?.querySelector('.advantages-grid');
        if (!grid) return;
        syncCollection(grid, '.advantage-item', items, applyAdvantageItem);
    }

    function applyProcessStep(stepElement, step) {
        if (!stepElement || !step) return;
        const title = stepElement.querySelector('h4');
        const text = stepElement.querySelector('p');
        if (title) title.textContent = step.title || '';
        if (text) text.textContent = step.text || '';
    }

    function syncProcessSteps(card, items) {
        const list = card?.querySelector('.process-steps');
        if (!list) return;
        syncCollection(list, '.process-step', items, applyProcessStep);
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

    function applyQuickNavItem(link, item) {
        if (!link || !item) return;
        link.setAttribute('href', `#${item.id || ''}`);
        link.innerHTML = `<i class="${escapeHtml(item.icon || '')}" aria-hidden="true"></i> ${escapeHtml(item.label || '')}`;
    }

    function applyOverviewCard(card, item) {
        if (!card || !item) return;
        const label = card.querySelector('.service-overview-card__label');
        const text = card.querySelector('p');
        if (label) label.textContent = item.label || '';
        if (text) text.textContent = item.text || '';
    }

    function syncOverviewCards(overview, items) {
        const grid = overview?.querySelector('.service-overview__cards');
        if (!grid) return;
        syncCollection(grid, '.service-overview-card', items, applyOverviewCard);
    }

    function syncQuickNavItems(items) {
        const nav = document.getElementById('service-nav');
        if (!nav) return;
        syncCollection(nav, '.service-nav-link', Array.isArray(items) ? items : [], applyQuickNavItem);
    }

    function applyOverview(pageContent) {
        const overview = document.querySelector('.service-overview');
        if (!overview || !pageContent.overview) return;

        const eyebrow = overview.querySelector('.service-overview__eyebrow');
        const title = overview.querySelector('.service-overview__title');
        const text = overview.querySelector('.service-overview__text');
        const bridgeLabel = overview.querySelector('.service-overview__bridge-label');
        const bridgeText = overview.querySelector('.service-overview__bridge-text');
        const bridgeAction = overview.querySelector('.service-overview__bridge-link');

        if (eyebrow) eyebrow.textContent = pageContent.overview.eyebrow || '';
        if (title) title.textContent = pageContent.overview.title || '';
        if (text) text.textContent = pageContent.overview.text || '';
        syncOverviewCards(overview, pageContent.overview.cards || []);
        if (bridgeLabel) bridgeLabel.textContent = pageContent.overview.bridge?.label || '';
        if (bridgeText) bridgeText.textContent = pageContent.overview.bridge?.text || '';
        if (bridgeAction && pageContent.overview.bridge?.action) {
            renderButtonNode(bridgeAction, pageContent.overview.bridge.action, 'service-overview__bridge-link');
        }
    }

    function renderCtaPhoneLine(container, phones) {
        if (!container) return;
        const links = (Array.isArray(phones) ? phones : []).map((phone) => `
            <a href="${escapeHtml(phone.href || '#')}">${escapeHtml(phone.label || '')}</a>
        `).join(' и ');
        container.innerHTML = `<i class="fas fa-phone"></i> Или позвоните: ${links}`;
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
        syncQuickNavItems(pageContent.quickNav || []);
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

        const afterImage = section.querySelector('.before-after__image--after');
        const beforeImage = section.querySelector('.before-after__image--before');
        if (afterImage && pageContent.beforeAfter.images?.after) {
            applyImageValue(afterImage, pageContent.beforeAfter.images.after);
        }
        if (beforeImage && pageContent.beforeAfter.images?.before) {
            applyImageValue(beforeImage, pageContent.beforeAfter.images.before);
        }
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
                    syncAdvantages(card, sectionContent.advantages);
                }
            }

            const processSteps = card.querySelector('.process-steps');
            if (processSteps && Array.isArray(sectionContent.processSteps)) {
                syncProcessSteps(card, sectionContent.processSteps);
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
                        syncTextList(paletteList, 'li', sectionContent.paletteCard.points || []);
                    }
                    if (paletteAction && sectionContent.paletteCard.action) {
                        paletteAction.outerHTML = renderButton(sectionContent.paletteCard.action, 'btn btn-secondary');
                    }
                }

                const paletteImageLink = paletteCard.querySelector('.palette-main a, .palette-card__media a');
                const paletteImage = paletteImageLink?.querySelector('img');
                if (paletteImage && sectionContent.paletteCard.image) {
                    paletteImageLink.href = sectionContent.paletteCard.image.src || '';
                    paletteImageLink.title = sectionContent.paletteCard.image.title || sectionContent.paletteCard.image.alt || '';
                    applyImageValue(paletteImage, sectionContent.paletteCard.image);
                }
            }

            const sectionImages = Array.from(card.querySelectorAll('.service-image img'));
            if (sectionImages.length && Array.isArray(sectionContent.images) && sectionContent.images.length) {
                sectionImages.forEach((image, imageIndex) => {
                    const nextImage = sectionContent.images[imageIndex];
                    if (nextImage) {
                        applyImageValue(image, nextImage);
                    }
                });
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
            renderCtaPhoneLine(phoneLine, pageContent.cta.phones || []);
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
        if (list) syncFaqItems(faqSection, pageContent.faq.items || []);
    }

    function registerInlineBindings(pageKey, pageContent) {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const headerTitle = document.querySelector('.services-header h1');
        const headerSubtitle = document.querySelector('.services-header .subtitle');
        const overview = document.querySelector('.service-overview');
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

        const buildQuickNavBinding = (targetLink, index) => ({
            path: `${pageKey}.quickNav.${index}`,
            type: 'object',
            editorKindLabel: 'Кнопка на странице',
            label: `Пункт навигации ${index + 1}`,
            element: targetLink,
            collectionPath: `${pageKey}.quickNav`,
            collectionItemFactory(nextIndex) {
                const nextLink = document.querySelectorAll('#service-nav .service-nav-link')[nextIndex];
                if (!nextLink) return null;
                return buildQuickNavBinding(nextLink, nextIndex);
            },
            collectionCreateValue() {
                return {
                    id: 'new-section',
                    icon: 'fas fa-circle',
                    label: 'Новый пункт'
                };
            },
            fields: [
                { key: 'label', label: 'Название', type: 'text' },
                { key: 'id', label: 'Якорь секции', type: 'text' },
                { key: 'icon', label: 'Иконка', type: 'text' }
            ],
            collectionRender(items) {
                syncQuickNavItems(Array.isArray(items) ? items : []);
            },
            render(value) {
                applyQuickNavItem(targetLink, value || {});
            }
        });

        document.querySelectorAll('#service-nav .service-nav-link').forEach((link, index) => {
            bindings.push(buildQuickNavBinding(link, index));
        });

        if (overview && pageContent.overview) {
            const overviewEyebrow = overview.querySelector('.service-overview__eyebrow');
            const overviewTitle = overview.querySelector('.service-overview__title');
            const overviewText = overview.querySelector('.service-overview__text');
            const overviewBridgeLabel = overview.querySelector('.service-overview__bridge-label');
            const overviewBridgeText = overview.querySelector('.service-overview__bridge-text');
            const overviewBridgeAction = overview.querySelector('.service-overview__bridge-link');

            if (overviewEyebrow) bindings.push({ path: `${pageKey}.overview.eyebrow`, type: 'text', label: 'Обзор услуги: надзаголовок', element: overviewEyebrow });
            if (overviewTitle) bindings.push({ path: `${pageKey}.overview.title`, type: 'text', label: 'Обзор услуги: заголовок', element: overviewTitle });
            if (overviewText) bindings.push({ path: `${pageKey}.overview.text`, type: 'textarea', label: 'Обзор услуги: описание', element: overviewText });
            if (overviewBridgeLabel) bindings.push({ path: `${pageKey}.overview.bridge.label`, type: 'text', label: 'Обзор услуги: метка связки', element: overviewBridgeLabel });
            if (overviewBridgeText) bindings.push({ path: `${pageKey}.overview.bridge.text`, type: 'textarea', label: 'Обзор услуги: текст связки', element: overviewBridgeText });
            if (overviewBridgeAction) {
                bindings.push({
                    path: `${pageKey}.overview.bridge.action`,
                    type: 'object',
                    label: 'Обзор услуги: кнопка связки',
                    element: overviewBridgeAction,
                    fields: [
                        { key: 'label', label: 'Текст кнопки', type: 'text' },
                        { key: 'href', label: 'Ссылка', type: 'text' },
                        { key: 'icon', label: 'Иконка', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'service-overview__bridge-link'));
                    }
                });
            }

            overview.querySelectorAll('.service-overview-card').forEach((card, index) => {
                const label = card.querySelector('.service-overview-card__label');
                const text = card.querySelector('p');
                if (label) bindings.push({ path: `${pageKey}.overview.cards.${index}.label`, type: 'text', label: `Обзор услуги: карточка ${index + 1} — заголовок`, element: label });
                if (text) bindings.push({ path: `${pageKey}.overview.cards.${index}.text`, type: 'textarea', label: `Обзор услуги: карточка ${index + 1} — текст`, element: text });
            });
        }

        if (pageKey === 'sandblasting' && pageContent.beforeAfter) {
            const beforeAfterTitle = document.querySelector('.before-after-section .section-title');
            const beforeAfterSubtitle = document.querySelector('.before-after-section .section-subtitle');
            const beforeAfterNote = document.querySelector('.before-after__note');
            const afterImage = document.querySelector('.before-after__image--after');
            const beforeImage = document.querySelector('.before-after__image--before');
            if (beforeAfterTitle) bindings.push({ path: `${pageKey}.beforeAfter.title`, type: 'text', label: 'Заголовок блока до/после', element: beforeAfterTitle });
            if (beforeAfterSubtitle) bindings.push({ path: `${pageKey}.beforeAfter.subtitle`, type: 'textarea', label: 'Подзаголовок блока до/после', element: beforeAfterSubtitle });
            if (beforeAfterNote) bindings.push({ path: `${pageKey}.beforeAfter.note`, type: 'textarea', label: 'Подпись под блоком до/после', element: beforeAfterNote });
            if (afterImage) {
                bindings.push({
                    path: `${pageKey}.beforeAfter.images.after`,
                    type: 'image',
                    label: 'Изображение после пескоструйной обработки',
                    element: afterImage,
                    defaultValue: () => extractImageValue(afterImage),
                    directory: extractDirectoryFromSrc(afterImage.getAttribute('src')),
                    render(value, binding) {
                        binding.elements.forEach((element) => applyImageValue(element, value));
                    }
                });
            }
            if (beforeImage) {
                bindings.push({
                    path: `${pageKey}.beforeAfter.images.before`,
                    type: 'image',
                    label: 'Изображение до пескоструйной обработки',
                    element: beforeImage,
                    defaultValue: () => extractImageValue(beforeImage),
                    directory: extractDirectoryFromSrc(beforeImage.getAttribute('src')),
                    render(value, binding) {
                        binding.elements.forEach((element) => applyImageValue(element, value));
                    }
                });
            }
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
            const sectionImages = Array.from(card.querySelectorAll('.service-image img'));
            const paletteImageLink = card.querySelector('.palette-main a, .palette-card__media a');
            const paletteImage = paletteImageLink?.querySelector('img');

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
                const buildAdvantageBinding = (targetItem, targetItemIndex) => ({
                    path: `${pageKey}.sections.${index}.advantages.${targetItemIndex}`,
                    type: 'object',
                    editorKindLabel: 'Пункт на странице',
                    label: `${sectionContent.title || `Услуга ${index + 1}`}: преимущество ${targetItemIndex + 1}`,
                    element: targetItem,
                    collectionPath: `${pageKey}.sections.${index}.advantages`,
                    collectionItemFactory(nextIndex) {
                        const nextItem = card.querySelectorAll('.advantages-grid .advantage-item')[nextIndex];
                        if (!nextItem) return null;
                        return buildAdvantageBinding(nextItem, nextIndex);
                    },
                    collectionCreateValue() {
                        return {
                            icon: 'fas fa-check',
                            text: 'Новый пункт'
                        };
                    },
                    fields: [
                        { key: 'icon', label: 'Класс иконки', type: 'text' },
                        { key: 'text', label: 'Текст пункта', type: 'text' }
                    ],
                    collectionRender(items) {
                        syncAdvantages(card, Array.isArray(items) ? items : []);
                    },
                    render(value) {
                        applyAdvantageItem(targetItem, value || {});
                    }
                });
                bindings.push(buildAdvantageBinding(item, itemIndex));
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
                const buildProcessStepBinding = (targetStep, targetStepIndex) => ({
                    path: `${pageKey}.sections.${index}.processSteps.${targetStepIndex}`,
                    type: 'object',
                    editorKindLabel: 'Шаг на странице',
                    label: `${sectionContent.title || `Услуга ${index + 1}`}: шаг ${targetStepIndex + 1} целиком`,
                    element: targetStep,
                    collectionPath: `${pageKey}.sections.${index}.processSteps`,
                    collectionItemFactory(nextIndex) {
                        const nextStep = card.querySelectorAll('.process-steps .process-step')[nextIndex];
                        if (!nextStep) return null;
                        return buildProcessStepBinding(nextStep, nextIndex);
                    },
                    collectionCreateValue() {
                        return {
                            title: 'Новый шаг',
                            text: 'Короткое описание шага.'
                        };
                    },
                    fields: [
                        { key: 'title', label: 'Заголовок шага', type: 'text' },
                        { key: 'text', label: 'Описание шага', type: 'textarea' }
                    ],
                    collectionRender(items) {
                        syncProcessSteps(card, Array.isArray(items) ? items : []);
                    },
                    render(value) {
                        applyProcessStep(targetStep, value || {});
                    }
                });
                bindings.push(buildProcessStepBinding(step, stepIndex));
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
            if (paletteList) {
                bindings.push({
                    path: `${pageKey}.sections.${index}.paletteCard.points`,
                    type: 'list',
                    label: `${sectionContent.title || `Услуга ${index + 1}`}: список палитры`,
                    element: paletteList,
                    render(value, binding) {
                        binding.elements.forEach((element) => syncTextList(element, 'li', Array.isArray(value) ? value : []));
                    }
                });

                const buildPalettePointBinding = (targetItem, itemIndex) => ({
                    path: `${pageKey}.sections.${index}.paletteCard.points.${itemIndex}`,
                    type: 'text',
                    editorKindLabel: 'Пункт на странице',
                    collectionItemLabel: 'пункт',
                    collectionItemLabelPlural: 'пунктов',
                    label: `${sectionContent.title || `Услуга ${index + 1}`}: палитра — пункт ${itemIndex + 1}`,
                    element: targetItem,
                    collectionPath: `${pageKey}.sections.${index}.paletteCard.points`,
                    collectionItemFactory(nextIndex) {
                        const nextItem = paletteList.querySelectorAll('li')[nextIndex];
                        if (!nextItem) return null;
                        return buildPalettePointBinding(nextItem, nextIndex);
                    },
                    collectionCreateValue() {
                        return 'Новый пункт';
                    },
                    collectionRender(items) {
                        syncTextList(paletteList, 'li', Array.isArray(items) ? items : []);
                    },
                    render(value, binding) {
                        binding.elements.forEach((element) => applyTextListItem(element, value || ''));
                    }
                });

                paletteList.querySelectorAll('li').forEach((item, itemIndex) => {
                    bindings.push(buildPalettePointBinding(item, itemIndex));
                });
            }
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

            sectionImages.forEach((image, imageIndex) => {
                bindings.push({
                    path: `${pageKey}.sections.${index}.images.${imageIndex}`,
                    type: 'image',
                    label: `${sectionContent.title || `Услуга ${index + 1}`}: изображение ${imageIndex + 1}`,
                    element: image,
                    defaultValue: () => extractImageValue(image),
                    directory: extractDirectoryFromSrc(image.getAttribute('src')),
                    render(value, binding) {
                        binding.elements.forEach((element) => applyImageValue(element, value));
                    }
                });
            });

            if (paletteImage && paletteImageLink) {
                bindings.push({
                    path: `${pageKey}.sections.${index}.paletteCard.image`,
                    type: 'image',
                    label: `${sectionContent.title || `Услуга ${index + 1}`}: изображение палитры`,
                    element: paletteImage,
                    defaultValue: () => extractImageValue(paletteImage, paletteImageLink),
                    directory: extractDirectoryFromSrc(paletteImage.getAttribute('src')),
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            applyImageValue(element, value);
                            const link = element.closest('a');
                            if (link) {
                                link.href = value?.src || '';
                                link.title = value?.title || value?.alt || '';
                            }
                        });
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
                const buildCtaPhoneBinding = (targetPhone, phoneIndex) => ({
                    path: `${pageKey}.cta.phones.${phoneIndex}`,
                    type: 'object',
                    editorKindLabel: 'Контакт на странице',
                    label: `Телефон в нижнем блоке услуг ${phoneIndex + 1}`,
                    element: targetPhone,
                    collectionPath: `${pageKey}.cta.phones`,
                    collectionItemFactory(nextIndex) {
                        const nextPhone = finalCta.querySelectorAll('.cta-phone a')[nextIndex];
                        if (!nextPhone) return null;
                        return buildCtaPhoneBinding(nextPhone, nextIndex);
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
                        renderCtaPhoneLine(finalCta.querySelector('.cta-phone'), Array.isArray(items) ? items : []);
                    },
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            element.textContent = value?.label || '';
                            element.setAttribute('href', value?.href || '#');
                        });
                    }
                });
                bindings.push(buildCtaPhoneBinding(phone, index));
            });
        }

        if (faqSection) {
            const faqTitle = faqSection.querySelector('.section-title');
            const faqSubtitle = faqSection.querySelector('.section-subtitle');
            if (faqTitle) bindings.push({ path: `${pageKey}.faq.title`, type: 'text', label: 'Заголовок FAQ услуг', element: faqTitle });
            if (faqSubtitle) bindings.push({ path: `${pageKey}.faq.subtitle`, type: 'textarea', label: 'Подзаголовок FAQ услуг', element: faqSubtitle });
            const buildFaqBinding = (targetItem, index) => ({
                path: `${pageKey}.faq.items.${index}`,
                type: 'object',
                editorKindLabel: 'FAQ на странице',
                label: `Вопрос FAQ ${index + 1} целиком`,
                element: targetItem,
                collectionPath: `${pageKey}.faq.items`,
                collectionItemFactory(nextIndex) {
                    const nextItem = faqSection.querySelectorAll('.faq-list .faq-item')[nextIndex];
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
                    syncFaqItems(faqSection, Array.isArray(items) ? items : []);
                },
                render(value) {
                    applyFaqItem(targetItem, value || {});
                }
            });
            faqSection.querySelectorAll('.faq-list .faq-item').forEach((item, index) => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer p');
                bindings.push(buildFaqBinding(item, index));
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
            applyOverview(pageContent);
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
