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

    function renderContact(contact) {
        return `
            <a href="${escapeHtml(contact.href || '#')}">
                <i class="${escapeHtml(contact.icon || '')}" aria-hidden="true"></i> ${escapeHtml(contact.label || '')}
            </a>
        `;
    }

    function renderParagraphs(paragraphs) {
        return (paragraphs || [])
            .filter(Boolean)
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join('');
    }

    function renderParagraphBlock(paragraphs, dataAttr) {
        const items = renderParagraphs(paragraphs);
        if (!items) return '';
        return `<div class="catalog-panel__paragraph-stack" data-catalog-inline="${dataAttr}">${items}</div>`;
    }

    function renderBadges(badges) {
        if (!Array.isArray(badges) || !badges.length) return '';

        return `
            <div class="catalog-panel__badges">
                ${badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join('')}
            </div>
        `;
    }

    function renderListItems(items) {
        return (items || [])
            .filter(Boolean)
            .map((item) => `<li>${String(item)}</li>`)
            .join('');
    }

    function extractDirectoryFromSrc(src, fallback = 'assets/images/catalog') {
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

    function extractCatalogGalleryItem(button) {
        if (!button) return { src: '', alt: '', title: '', width: null, height: null };
        const image = button.querySelector('img');
        return {
            src: button.dataset.gallerySrc || image?.getAttribute('src') || '',
            alt: button.dataset.galleryAlt || image?.getAttribute('alt') || '',
            title: button.dataset.galleryTitle || image?.getAttribute('alt') || '',
            width: Number(image?.getAttribute('width')) || null,
            height: Number(image?.getAttribute('height')) || null
        };
    }

    function applyCatalogGalleryItem(button, item) {
        if (!button || !item) return;
        const image = button.querySelector('img');
        button.dataset.gallerySrc = item.src || '';
        button.dataset.galleryAlt = item.alt || '';
        button.dataset.galleryTitle = item.title || item.alt || '';
        if (image) {
            image.src = item.src || '';
            image.alt = item.alt || '';
            if (item.width) image.setAttribute('width', Number(item.width));
            if (item.height) image.setAttribute('height', Number(item.height));
        }
    }

    function updateCatalogMainMedia(gallery, item) {
        if (!gallery || !item) return;
        const mainLink = gallery.querySelector('[data-gallery-main-link]');
        const mainImage = gallery.querySelector('[data-gallery-main-image]');
        if (mainLink) {
            mainLink.href = item.src || '';
            mainLink.title = item.title || item.alt || '';
        }
        if (mainImage) {
            mainImage.src = item.src || '';
            mainImage.alt = item.alt || '';
            if (item.width) mainImage.setAttribute('width', Number(item.width));
            if (item.height) mainImage.setAttribute('height', Number(item.height));
        }
    }

    function syncCatalogGalleryState(gallery, items) {
        if (!gallery || !Array.isArray(items) || !items.length) return;

        const thumbsWrap = gallery.querySelector('.catalog-panel__media-thumbs');
        const hiddenLinksWrap = gallery.querySelector('.catalog-panel__media-lightbox-links') || gallery;
        const thumbTemplate = gallery.querySelector('.catalog-panel__media-thumb');
        const hiddenLinkTemplate = gallery.querySelector('[data-gallery-lightbox-link]');
        while (thumbsWrap && thumbTemplate && gallery.querySelectorAll('.catalog-panel__media-thumb').length < items.length) {
            const thumbClone = thumbTemplate.cloneNode(true);
            thumbClone.classList.remove('is-active');
            thumbClone.hidden = false;
            thumbsWrap.appendChild(thumbClone);
        }
        while (hiddenLinkTemplate && gallery.querySelectorAll('[data-gallery-lightbox-link]').length < items.length) {
            const hiddenLinkClone = hiddenLinkTemplate.cloneNode(true);
            hiddenLinkClone.hidden = false;
            hiddenLinksWrap.appendChild(hiddenLinkClone);
        }

        const thumbs = Array.from(gallery.querySelectorAll('.catalog-panel__media-thumb'));
        const hiddenLinks = Array.from(gallery.querySelectorAll('[data-gallery-lightbox-link]'));
        const prevBtn = gallery.querySelector('.catalog-panel__media-nav--prev');
        const nextBtn = gallery.querySelector('.catalog-panel__media-nav--next');

        thumbs.forEach((thumb, index) => {
            const item = items[index];
            thumb.hidden = !item;
            thumb.classList.toggle('is-active', index === 0 && Boolean(item));
            thumb.dataset.galleryIndex = String(index);
            if (item) {
                applyCatalogGalleryItem(thumb, item);
            }
        });

        hiddenLinks.forEach((link, index) => {
            const item = items[index];
            link.hidden = !item;
            link.dataset.galleryLightboxLink = String(index);
            if (item) {
                link.href = item.src || '';
                link.title = item.title || item.alt || '';
            }
        });

        updateCatalogMainMedia(gallery, items[0]);

        if (prevBtn) prevBtn.style.display = items.length > 1 ? '' : 'none';
        if (nextBtn) nextBtn.style.display = items.length > 1 ? '' : 'none';
        if (thumbsWrap) thumbsWrap.style.display = items.length > 1 ? '' : 'none';
    }

    function renderContactNode(anchor, contact) {
        if (!anchor) return;
        const icon = anchor.querySelector('i');
        if (icon && contact?.icon) {
            icon.className = contact.icon;
        }
        const iconHtml = icon ? icon.outerHTML : (contact?.icon ? `<i class="${escapeHtml(contact.icon)}" aria-hidden="true"></i>` : '');
        anchor.innerHTML = `${iconHtml} ${escapeHtml(contact?.label || '')}`.trim();
        anchor.setAttribute('href', contact?.href || '#');
    }

    function syncContactLinks(container, contacts) {
        if (!container) return;
        syncCollection(container, 'a', Array.isArray(contacts) ? contacts : [], (anchor, contact) => {
            renderContactNode(anchor, contact);
        });
    }

    function applyCatalogGroupLink(button, link) {
        if (!button || !link) return;
        button.dataset.catalogTab = link.panelId || '';
        button.textContent = link.label || '';
    }

    function syncCatalogGroupLinks(panel, links) {
        const container = panel?.querySelector('.catalog-group-panel__links');
        if (!container) return;
        syncCollection(container, '[data-catalog-tab]', Array.isArray(links) ? links : [], applyCatalogGroupLink);
    }

    function renderButtonNode(anchor, action, className) {
        if (!anchor) return;
        anchor.className = className;
        anchor.setAttribute('href', action?.href || '#');
        anchor.innerHTML = `<i class="fas fa-palette"></i> ${escapeHtml(action?.actionLabel || action?.label || '')}`;
    }

    function renderInfoCards(cards, headingTag = 'h3') {
        return (cards || [])
            .map((card) => `
                <div class="catalog-info-card">
                    <${headingTag}>${escapeHtml(card.title || '')}</${headingTag}>
                    <ul>
                        ${renderListItems(card.items)}
                    </ul>
                </div>
            `)
            .join('');
    }

    function applyInfoCard(cardElement, card, headingTag = 'h3') {
        if (!cardElement || !card) return;
        const title = cardElement.querySelector(headingTag);
        const list = cardElement.querySelector('ul');
        if (title) title.textContent = card.title || '';
        if (list) list.innerHTML = renderListItems(card.items);
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

    function applyTextBlock(panelElement, panelContent) {
        const textBlock = panelElement.querySelector('.catalog-panel__grid .catalog-panel__text');
        if (!textBlock) return;

        const hasContent = panelContent.introTitle
            || (panelContent.paragraphs || []).length
            || (panelContent.badges || []).length
            || (panelContent.tailParagraphs || []).length;

        if (!hasContent) return;

        const parts = [];
        if (panelContent.introTitle) {
            parts.push(`<h3 data-catalog-inline="intro">${escapeHtml(panelContent.introTitle)}</h3>`);
        }
        parts.push(renderParagraphBlock(panelContent.paragraphs, 'paragraphs'));
        parts.push(renderBadges(panelContent.badges));
        parts.push(renderParagraphBlock(panelContent.tailParagraphs, 'tail-paragraphs'));
        textBlock.innerHTML = parts.filter(Boolean).join('');
    }

    function applyInfoGrid(panelElement, panelContent) {
        const infoGrid = panelElement.querySelector('.catalog-info-grid');
        if (!infoGrid || !Array.isArray(panelContent.cards)) return;
        syncCollection(infoGrid, '.catalog-info-card', panelContent.cards, (cardElement, card) => {
            applyInfoCard(cardElement, card, 'h3');
        });
    }

    function applyFaqItem(itemElement, item) {
        if (!itemElement || !item) return;
        const question = itemElement.querySelector('.faq-question');
        const answer = itemElement.querySelector('.faq-answer p');
        if (question) question.textContent = item.question || '';
        if (answer) answer.textContent = item.answer || '';
    }

    function syncFaqItems(panelElement, items) {
        const list = panelElement?.querySelector('.faq-list');
        if (!list) return;
        syncCollection(list, '.faq-item', items, applyFaqItem);
    }

    function applyFaq(panelElement, panelContent) {
        const faqSection = panelElement.querySelector('.faq-section');
        const faq = panelContent.faq;
        if (!faqSection || !faq || !faq.title) return;

        const title = faqSection.querySelector('.section-title');
        const subtitle = faqSection.querySelector('.section-subtitle');
        if (title) title.textContent = faq.title || '';
        if (subtitle) subtitle.textContent = faq.subtitle || '';
        syncFaqItems(panelElement, faq.items || []);
    }

    function applyPalette(panelElement, panelContent) {
        const paletteInfo = panelElement.querySelector('.catalog-palette-card__info');
        const palette = panelContent.palette;
        if (!paletteInfo || !palette || !palette.title) return;

        paletteInfo.innerHTML = `
            <h3>${escapeHtml(palette.title)}</h3>
            ${palette.text ? `<p>${escapeHtml(palette.text)}</p>` : ''}
            ${(palette.items || []).length ? `<ul>${renderListItems(palette.items)}</ul>` : ''}
            ${palette.actionLabel ? `
                <a href="${escapeHtml(palette.actionHref || '#')}" class="btn btn-primary">
                    <i class="fas fa-palette"></i> ${escapeHtml(palette.actionLabel)}
                </a>
            ` : ''}
        `;

        const note = panelElement.querySelector('.catalog-panel__palette-note');
        if (note && palette.note) {
            note.innerHTML = `<em>${escapeHtml(palette.note)}</em>`;
        }

        const paletteImageLink = panelElement.querySelector('.catalog-palette-card__gallery .catalog-palette-card__item');
        const paletteImage = paletteImageLink?.querySelector('img');
        if (palette.image && paletteImageLink && paletteImage) {
            paletteImageLink.href = palette.image.src || '';
            paletteImageLink.title = palette.image.title || palette.image.alt || '';
            paletteImage.src = palette.image.src || '';
            paletteImage.alt = palette.image.alt || '';
            if (palette.image.width) paletteImage.setAttribute('width', Number(palette.image.width));
            if (palette.image.height) paletteImage.setAttribute('height', Number(palette.image.height));
        }
    }

    function applySpecGroups(panelElement, panelContent) {
        const specGroups = Array.from(panelElement.querySelectorAll('.catalog-spec-group'));
        if (!specGroups.length || !Array.isArray(panelContent.specGroups) || !panelContent.specGroups.length) return;

        panelContent.specGroups.forEach((group, index) => {
            const section = specGroups[index];
            if (!section) return;

            const title = section.querySelector(':scope > h3');
            const cards = section.querySelector('.catalog-panel__spec-cards');

            if (title) {
                title.textContent = group.title || '';
            }

            if (cards && Array.isArray(group.cards)) {
                cards.innerHTML = renderInfoCards(group.cards, 'h4');
            }
        });
    }

    function applySteps(panelElement, panelContent) {
        const steps = panelElement.querySelector('.automation-steps');
        if (!steps || !Array.isArray(panelContent.steps) || !panelContent.steps.length) return;
        syncCollection(steps, '.automation-step', panelContent.steps, (stepElement, step) => {
            const number = stepElement.querySelector('.automation-step__number');
            const title = stepElement.querySelector('h3');
            const text = stepElement.querySelector('p');
            if (number) number.textContent = step.number || '';
            if (title) title.textContent = step.title || '';
            if (text) text.textContent = step.text || '';
        });
    }

    function applySectionHeading(panelElement, panelContent) {
        const sectionHeading = panelElement.querySelector('.catalog-panel__section-heading');
        const heading = panelContent.sectionHeading;
        if (!sectionHeading || !heading || !heading.title) return;

        sectionHeading.innerHTML = `
            <h3>${escapeHtml(heading.title)}</h3>
            ${heading.text ? `<p>${escapeHtml(heading.text)}</p>` : ''}
        `;
    }

    function applyProductCard(cardElement, product) {
        if (!cardElement || !product) return;

        const linkWrapper = cardElement.querySelector('.automation-card__link');
        const cta = cardElement.querySelector('.automation-card__cta');
        const meta = cardElement.querySelector('.automation-card__meta');
        const title = cardElement.querySelector('.automation-card__title');
        const description = cardElement.querySelector('.automation-card__description');
        const specs = cardElement.querySelector('.automation-card__specs');

        if (linkWrapper && product.href) {
            linkWrapper.href = product.href;
            linkWrapper.title = `Открыть карточку ${product.meta || product.title || ''}`;
        }

        if (meta) meta.textContent = product.meta || '';
        if (title) title.textContent = product.title || '';
        if (description) description.textContent = product.description || '';
        if (specs) specs.innerHTML = renderListItems(product.specs);

        if (cta) {
            cta.textContent = product.cta || '';
            if (cta.tagName === 'A' && product.href) {
                cta.href = product.href;
            }
        }

        const zoom = cardElement.querySelector('.automation-card__zoom');
        const image = zoom?.querySelector('img');
        if (zoom && image && product.image) {
            zoom.href = product.image.src || '';
            zoom.title = product.image.title || product.image.alt || '';
            image.src = product.image.src || '';
            image.alt = product.image.alt || '';
            if (product.image.width) image.setAttribute('width', Number(product.image.width));
            if (product.image.height) image.setAttribute('height', Number(product.image.height));
        }
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

    function applyProducts(panelElement, panelContent) {
        const wrapper = panelElement.querySelector('.automation-products');
        const cards = wrapper ? Array.from(wrapper.querySelectorAll('.automation-card')) : [];
        if (!wrapper || !cards.length || !Array.isArray(panelContent.products) || !panelContent.products.length) return;

        const template = cards[0];
        while (wrapper.querySelectorAll('.automation-card').length < panelContent.products.length) {
            const clone = template.cloneNode(true);
            resetInlineMarkers(clone);
            clone.hidden = false;
            wrapper.appendChild(clone);
        }

        const nextCards = Array.from(wrapper.querySelectorAll('.automation-card'));
        nextCards.forEach((card, index) => {
            const product = panelContent.products[index];
            card.hidden = !product;
            if (product) {
                applyProductCard(card, product);
            }
        });
    }

    function applyPanelCta(panelElement, panelContent) {
        const cta = panelElement.querySelector('.catalog-panel__cta');
        const ctaData = panelContent.cta;
        if (!cta || !ctaData) return;

        const title = cta.querySelector('h3');
        const text = cta.querySelector('p');
        const contacts = cta.querySelector('.catalog-contact-list');

        if (title) title.textContent = ctaData.title || '';
        if (text) text.textContent = ctaData.text || '';
        if (contacts && Array.isArray(ctaData.contacts) && ctaData.contacts.length) {
            syncContactLinks(contacts, ctaData.contacts);
        }
    }

    function applyPanel(panelContent) {
        if (!panelContent?.panelId) return;

        const panelElement = document.getElementById(panelContent.panelId);
        if (!panelElement) return;

        const breadcrumbs = panelElement.querySelector('.catalog-breadcrumbs');
        const title = panelElement.querySelector('.catalog-panel__header h2');

        if (breadcrumbs) breadcrumbs.textContent = panelContent.breadcrumb || '';
        if (title) title.textContent = panelContent.title || '';

        applyTextBlock(panelElement, panelContent);
        applyInfoGrid(panelElement, panelContent);
        applyFaq(panelElement, panelContent);
        applyPalette(panelElement, panelContent);
        applySpecGroups(panelElement, panelContent);
        applySteps(panelElement, panelContent);
        applySectionHeading(panelElement, panelContent);
        applyProducts(panelElement, panelContent);
        applyPanelCta(panelElement, panelContent);

        const gallery = panelElement.querySelector('[data-catalog-gallery]');
        if (gallery && Array.isArray(panelContent.gallery) && panelContent.gallery.length) {
            syncCatalogGalleryState(gallery, panelContent.gallery);
        }
    }

    function registerInlineBindings(content, panelContent) {
        if (!window.PokraskaQueueInlineBindings) return;

        const catalogBindings = [];
        const partnersTitle = document.querySelector('.catalog-partners h3');
        const cta = document.querySelector('.catalog-cta');

        (content.groups || []).forEach((group, groupIndex) => {
            const tab = document.querySelector(`[data-catalog-group="${group.key}"]`);
            const panel = document.querySelector(`[data-catalog-group-panel="${group.key}"]`);

            const tabTitle = tab?.querySelector('.catalog-group-tab__title');
            const eyebrow = panel?.querySelector('.catalog-group-panel__eyebrow');
            const title = panel?.querySelector('.catalog-group-panel__intro h3');
            const text = panel?.querySelector('.catalog-group-panel__intro p');

            if (tabTitle) catalogBindings.push({ path: `groups.${groupIndex}.title`, type: 'text', label: `Группа каталога ${groupIndex + 1}: название`, element: tabTitle });
            if (eyebrow) catalogBindings.push({ path: `groups.${groupIndex}.eyebrow`, type: 'text', label: `Группа каталога ${groupIndex + 1}: надзаголовок`, element: eyebrow });
            if (title) catalogBindings.push({ path: `groups.${groupIndex}.title`, type: 'text', label: `Группа каталога ${groupIndex + 1}: заголовок панели`, element: title });
            if (text) catalogBindings.push({ path: `groups.${groupIndex}.text`, type: 'textarea', label: `Группа каталога ${groupIndex + 1}: описание`, element: text });

            const buildGroupLinkBinding = (targetButton, linkIndex) => ({
                path: `groups.${groupIndex}.links.${linkIndex}`,
                type: 'object',
                editorKindLabel: 'Кнопка на странице',
                label: `Группа каталога ${groupIndex + 1}: кнопка ${linkIndex + 1}`,
                element: targetButton,
                collectionPath: `groups.${groupIndex}.links`,
                collectionItemFactory(nextIndex) {
                    const nextButton = panel?.querySelectorAll('.catalog-group-panel__links [data-catalog-tab]')[nextIndex];
                    if (!nextButton) return null;
                    return buildGroupLinkBinding(nextButton, nextIndex);
                },
                collectionCreateValue(currentValue) {
                    return {
                        panelId: currentValue?.panelId || group.links?.[0]?.panelId || '',
                        label: 'Новая ссылка'
                    };
                },
                fields: [
                    { key: 'label', label: 'Текст', type: 'text' },
                    { key: 'panelId', label: 'ID панели', type: 'text' }
                ],
                collectionRender(values) {
                    syncCatalogGroupLinks(panel, Array.isArray(values) ? values : []);
                },
                render(value) {
                    applyCatalogGroupLink(targetButton, value || {});
                }
            });

            panel?.querySelectorAll('.catalog-group-panel__links [data-catalog-tab]').forEach((button, linkIndex) => {
                catalogBindings.push(buildGroupLinkBinding(button, linkIndex));
            });
        });

        if (partnersTitle) {
            catalogBindings.push({
                path: 'partners.title',
                type: 'text',
                label: 'Заголовок блока брендов',
                element: partnersTitle,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.innerHTML = `<i class="fas fa-handshake"></i> ${escapeHtml(value || '')}`;
                    });
                }
            });
        }

        if (cta) {
            const title = cta.querySelector('h3');
            const text = cta.querySelector('p');
            const contacts = cta.querySelectorAll('.catalog-contact-list a');
            if (title) catalogBindings.push({ path: 'cta.title', type: 'text', label: 'Нижний CTA каталога: заголовок', element: title });
            if (text) catalogBindings.push({ path: 'cta.text', type: 'textarea', label: 'Нижний CTA каталога: текст', element: text });
            const buildCatalogCtaContactBinding = (targetContact, index) => ({
                path: `cta.contacts.${index}`,
                type: 'object',
                editorKindLabel: 'Контакт на странице',
                label: `Нижний CTA каталога: контакт ${index + 1}`,
                element: targetContact,
                collectionPath: 'cta.contacts',
                collectionItemFactory(nextIndex) {
                    const nextContact = cta.querySelectorAll('.catalog-contact-list a')[nextIndex];
                    if (!nextContact) return null;
                    return buildCatalogCtaContactBinding(nextContact, nextIndex);
                },
                collectionCreateValue() {
                    return {
                        icon: 'fas fa-phone',
                        label: 'Новый контакт',
                        href: '#'
                    };
                },
                fields: [
                    { key: 'icon', label: 'Иконка', type: 'text' },
                    { key: 'label', label: 'Текст', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                collectionRender(values) {
                    syncContactLinks(cta.querySelector('.catalog-contact-list'), Array.isArray(values) ? values : []);
                },
                render(value, binding) {
                    binding.elements.forEach((element) => renderContactNode(element, value || {}));
                }
            });

            contacts.forEach((contact, index) => {
                catalogBindings.push(buildCatalogCtaContactBinding(contact, index));
            });
        }

        if (catalogBindings.length) {
            queueInlineBindings({
                fileName: 'catalog',
                sectionKey: 'catalog',
                sectionLabel: 'Каталог',
                bindings: catalogBindings
            });
        }

        const panelBindings = [];
        Object.entries(panelContent || {}).forEach(([panelKey, panel]) => {
            if (!panel || typeof panel !== 'object' || !panel.panelId) return;

            const panelElement = document.getElementById(panel.panelId);
            if (!panelElement) return;

            const breadcrumbs = panelElement.querySelector('.catalog-breadcrumbs');
            const title = panelElement.querySelector('.catalog-panel__header h2');
            const intro = panelElement.querySelector('[data-catalog-inline="intro"]');
            const paragraphs = panelElement.querySelector('[data-catalog-inline="paragraphs"]');
            const badges = panelElement.querySelector('.catalog-panel__badges');
            const tailParagraphs = panelElement.querySelector('[data-catalog-inline="tail-paragraphs"]');

            if (breadcrumbs) panelBindings.push({ path: `${panelKey}.breadcrumb`, type: 'text', label: `${panel.title || panelKey}: хлебные крошки`, element: breadcrumbs });
            if (title) panelBindings.push({ path: `${panelKey}.title`, type: 'text', label: `${panel.title || panelKey}: заголовок`, element: title });
            if (intro) panelBindings.push({ path: `${panelKey}.introTitle`, type: 'text', label: `${panel.title || panelKey}: подзаголовок`, element: intro });
            if (paragraphs) {
                panelBindings.push({
                    path: `${panelKey}.paragraphs`,
                    type: 'list',
                    label: `${panel.title || panelKey}: основной текст`,
                    hint: 'Каждый абзац с новой строки.',
                    element: paragraphs,
                    render(value, binding) {
                        const items = Array.isArray(value) ? value : [];
                        binding.elements.forEach((element) => {
                            element.innerHTML = items.map((item) => `<p>${escapeHtml(item)}</p>`).join('');
                        });
                    }
                });
            }
            if (badges) {
                panelBindings.push({
                    path: `${panelKey}.badges`,
                    type: 'list',
                    label: `${panel.title || panelKey}: плашки`,
                    element: badges,
                    render(value, binding) {
                        const items = Array.isArray(value) ? value : [];
                        binding.elements.forEach((element) => {
                            element.innerHTML = items.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
                        });
                    }
                });
            }
            if (tailParagraphs) {
                panelBindings.push({
                    path: `${panelKey}.tailParagraphs`,
                    type: 'list',
                    label: `${panel.title || panelKey}: дополнительный текст`,
                    hint: 'Каждый абзац с новой строки.',
                    element: tailParagraphs,
                    render(value, binding) {
                        const items = Array.isArray(value) ? value : [];
                        binding.elements.forEach((element) => {
                            element.innerHTML = items.map((item) => `<p>${escapeHtml(item)}</p>`).join('');
                        });
                    }
                });
            }

            const gallery = panelElement.querySelector('[data-catalog-gallery]');
            if (gallery) {
                const mainImage = gallery.querySelector('[data-gallery-main-image]');
                const buildGalleryBinding = (index) => {
                    const thumb = gallery.querySelectorAll('.catalog-panel__media-thumb')[index];
                    const thumbImage = thumb?.querySelector('img');
                    const hiddenLink = gallery.querySelector(`[data-gallery-lightbox-link="${index}"]`);
                    if (!thumb || !thumbImage) return null;

                    return {
                        path: `${panelKey}.gallery.${index}`,
                        type: 'image',
                        label: `${panel.title || panelKey}: фото ${index + 1}`,
                        element: index === 0 && mainImage ? [mainImage, thumbImage] : thumbImage,
                        collectionPath: `${panelKey}.gallery`,
                        collectionItemFactory: buildGalleryBinding,
                        collectionCreateValue(currentValue) {
                            return {
                                ...(currentValue || {}),
                                alt: currentValue?.alt || 'Новое фото',
                                title: currentValue?.title || currentValue?.alt || 'Новое фото'
                            };
                        },
                        defaultValue: () => extractCatalogGalleryItem(thumb),
                        directory: extractDirectoryFromSrc(thumb.dataset.gallerySrc || thumbImage.getAttribute('src') || ''),
                        fields: [
                            { key: 'alt', label: 'Alt', type: 'text' },
                            { key: 'title', label: 'Подпись/название', type: 'text' }
                        ],
                        collectionRender(items) {
                            syncCatalogGalleryState(gallery, Array.isArray(items) ? items : []);
                        },
                        render(value) {
                            applyCatalogGalleryItem(thumb, value || {});
                            if (hiddenLink) {
                                hiddenLink.href = value?.src || '';
                                hiddenLink.title = value?.title || value?.alt || '';
                            }
                            if (thumb.classList.contains('is-active') || index === 0) {
                                updateCatalogMainMedia(gallery, value || {});
                            }
                        }
                    };
                };

                Array.from(gallery.querySelectorAll('.catalog-panel__media-thumb')).forEach((thumb, index) => {
                    const binding = buildGalleryBinding(index);
                    if (binding) {
                        panelBindings.push(binding);
                    }
                });
            }

            panelElement.querySelectorAll('.catalog-info-grid .catalog-info-card').forEach((card, cardIndex) => {
                const cardTitle = card.querySelector('h3');
                const items = card.querySelector('ul');
                panelBindings.push({
                    path: `${panelKey}.cards.${cardIndex}`,
                    type: 'object',
                    editorKindLabel: 'Карточка на странице',
                    label: `${panel.title || panelKey}: карточка ${cardIndex + 1} целиком`,
                    element: card,
                    collectionPath: `${panelKey}.cards`,
                    collectionItemFactory(nextIndex) {
                        const nextCard = panelElement.querySelectorAll('.catalog-info-grid .catalog-info-card')[nextIndex];
                        if (!nextCard) return null;
                        return {
                            path: `${panelKey}.cards.${nextIndex}`,
                            type: 'object',
                            editorKindLabel: 'Карточка на странице',
                            label: `${panel.title || panelKey}: карточка ${nextIndex + 1} целиком`,
                            element: nextCard,
                            collectionPath: `${panelKey}.cards`,
                            collectionItemFactory: this.collectionItemFactory,
                            collectionCreateValue() {
                                return { title: 'Новая карточка', items: ['Новый пункт'] };
                            },
                            fields: [
                                { key: 'title', label: 'Заголовок', type: 'text' },
                                { key: 'items', label: 'Список', type: 'list', hint: 'Каждый пункт с новой строки.' }
                            ],
                            collectionRender(values) {
                                applyInfoGrid(panelElement, { cards: Array.isArray(values) ? values : [] });
                            },
                            render(value) {
                                applyInfoCard(nextCard, value || {}, 'h3');
                            }
                        };
                    },
                    collectionCreateValue() {
                        return { title: 'Новая карточка', items: ['Новый пункт'] };
                    },
                    fields: [
                        { key: 'title', label: 'Заголовок', type: 'text' },
                        { key: 'items', label: 'Список', type: 'list', hint: 'Каждый пункт с новой строки.' }
                    ],
                    collectionRender(values) {
                        applyInfoGrid(panelElement, { cards: Array.isArray(values) ? values : [] });
                    },
                    render(value) {
                        applyInfoCard(card, value || {}, 'h3');
                    }
                });
                if (cardTitle) panelBindings.push({ path: `${panelKey}.cards.${cardIndex}.title`, type: 'text', label: `${panel.title || panelKey}: карточка ${cardIndex + 1} — заголовок`, element: cardTitle });
                if (items) panelBindings.push({ path: `${panelKey}.cards.${cardIndex}.items`, type: 'list', label: `${panel.title || panelKey}: карточка ${cardIndex + 1} — список`, element: items });
            });

            const faqSection = panelElement.querySelector('.faq-section');
            if (faqSection) {
                const faqTitle = faqSection.querySelector('.section-title');
                const faqSubtitle = faqSection.querySelector('.section-subtitle');
                if (faqTitle) panelBindings.push({ path: `${panelKey}.faq.title`, type: 'text', label: `${panel.title || panelKey}: FAQ — заголовок`, element: faqTitle });
                if (faqSubtitle) panelBindings.push({ path: `${panelKey}.faq.subtitle`, type: 'textarea', label: `${panel.title || panelKey}: FAQ — подзаголовок`, element: faqSubtitle });
                faqSection.querySelectorAll('.faq-list .faq-item').forEach((item, faqIndex) => {
                    const question = item.querySelector('.faq-question');
                    const answer = item.querySelector('.faq-answer p');
                    panelBindings.push({
                        path: `${panelKey}.faq.items.${faqIndex}`,
                        type: 'object',
                        editorKindLabel: 'FAQ на странице',
                        label: `${panel.title || panelKey}: FAQ ${faqIndex + 1} целиком`,
                        element: item,
                        collectionPath: `${panelKey}.faq.items`,
                        collectionItemFactory(nextIndex) {
                            const nextItem = faqSection.querySelectorAll('.faq-list .faq-item')[nextIndex];
                            if (!nextItem) return null;
                            return {
                                path: `${panelKey}.faq.items.${nextIndex}`,
                                type: 'object',
                                editorKindLabel: 'FAQ на странице',
                                label: `${panel.title || panelKey}: FAQ ${nextIndex + 1} целиком`,
                                element: nextItem,
                                collectionPath: `${panelKey}.faq.items`,
                                collectionItemFactory: this.collectionItemFactory,
                                collectionCreateValue() {
                                    return { question: 'Новый вопрос', answer: 'Новый ответ' };
                                },
                                fields: [
                                    { key: 'question', label: 'Вопрос', type: 'text' },
                                    { key: 'answer', label: 'Ответ', type: 'textarea' }
                                ],
                                collectionRender(values) {
                                    syncFaqItems(panelElement, Array.isArray(values) ? values : []);
                                },
                                render(value) {
                                    applyFaqItem(nextItem, value || {});
                                }
                            };
                        },
                        collectionCreateValue() {
                            return { question: 'Новый вопрос', answer: 'Новый ответ' };
                        },
                        fields: [
                            { key: 'question', label: 'Вопрос', type: 'text' },
                            { key: 'answer', label: 'Ответ', type: 'textarea' }
                        ],
                        collectionRender(values) {
                            syncFaqItems(panelElement, Array.isArray(values) ? values : []);
                        },
                        render(value) {
                            applyFaqItem(item, value || {});
                        }
                    });
                    if (question) panelBindings.push({ path: `${panelKey}.faq.items.${faqIndex}.question`, type: 'text', label: `${panel.title || panelKey}: FAQ ${faqIndex + 1} — вопрос`, element: question });
                    if (answer) panelBindings.push({ path: `${panelKey}.faq.items.${faqIndex}.answer`, type: 'textarea', label: `${panel.title || panelKey}: FAQ ${faqIndex + 1} — ответ`, element: answer });
                });
            }

            const paletteInfo = panelElement.querySelector('.catalog-palette-card__info');
            if (paletteInfo) {
                const paletteTitle = paletteInfo.querySelector('h3');
                const paletteText = paletteInfo.querySelector('p');
                const paletteItems = paletteInfo.querySelector('ul');
                const paletteAction = paletteInfo.querySelector('.btn');
                const paletteImageLink = panelElement.querySelector('.catalog-palette-card__gallery .catalog-palette-card__item');
                const paletteImage = paletteImageLink?.querySelector('img');
                const paletteNote = panelElement.querySelector('.catalog-panel__palette-note');
                if (paletteTitle) panelBindings.push({ path: `${panelKey}.palette.title`, type: 'text', label: `${panel.title || panelKey}: палитра — заголовок`, element: paletteTitle });
                if (paletteText) panelBindings.push({ path: `${panelKey}.palette.text`, type: 'textarea', label: `${panel.title || panelKey}: палитра — текст`, element: paletteText });
                if (paletteItems) panelBindings.push({ path: `${panelKey}.palette.items`, type: 'list', label: `${panel.title || panelKey}: палитра — список`, element: paletteItems });
                if (paletteAction) {
                    panelBindings.push({
                        path: `${panelKey}.palette`,
                        type: 'object',
                        label: `${panel.title || panelKey}: палитра — кнопка`,
                        element: paletteAction,
                        fields: [
                            { key: 'actionLabel', label: 'Текст кнопки', type: 'text' },
                            { key: 'actionHref', label: 'Ссылка', type: 'text' }
                        ],
                        render(value, binding) {
                            binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'btn btn-primary'));
                        }
                    });
                }
                if (paletteImage && paletteImageLink) {
                    panelBindings.push({
                        path: `${panelKey}.palette.image`,
                        type: 'image',
                        label: `${panel.title || panelKey}: палитра — картинка`,
                        element: paletteImage,
                        defaultValue: () => extractImageValue(paletteImage, paletteImageLink),
                        directory: extractDirectoryFromSrc(paletteImage.getAttribute('src') || ''),
                        fields: [
                            { key: 'alt', label: 'Alt', type: 'text' },
                            { key: 'title', label: 'Подпись/название', type: 'text' }
                        ],
                        render(value) {
                            paletteImageLink.href = value?.src || '';
                            paletteImageLink.title = value?.title || value?.alt || '';
                            paletteImage.src = value?.src || '';
                            paletteImage.alt = value?.alt || '';
                            if (value?.width) paletteImage.setAttribute('width', Number(value.width));
                            if (value?.height) paletteImage.setAttribute('height', Number(value.height));
                        }
                    });
                }
                if (paletteNote) panelBindings.push({ path: `${panelKey}.palette.note`, type: 'textarea', label: `${panel.title || panelKey}: палитра — примечание`, element: paletteNote });
            }

            panelElement.querySelectorAll('.catalog-spec-group').forEach((groupSection, groupIndex) => {
                const groupTitle = groupSection.querySelector(':scope > h3');
                if (groupTitle) panelBindings.push({ path: `${panelKey}.specGroups.${groupIndex}.title`, type: 'text', label: `${panel.title || panelKey}: блок характеристик ${groupIndex + 1}`, element: groupTitle });

                groupSection.querySelectorAll('.catalog-panel__spec-cards .catalog-info-card').forEach((card, cardIndex) => {
                    const cardTitle = card.querySelector('h4');
                    const list = card.querySelector('ul');
                    if (cardTitle) panelBindings.push({ path: `${panelKey}.specGroups.${groupIndex}.cards.${cardIndex}.title`, type: 'text', label: `${panel.title || panelKey}: карточка спецификаций ${groupIndex + 1}.${cardIndex + 1}`, element: cardTitle });
                    if (list) panelBindings.push({ path: `${panelKey}.specGroups.${groupIndex}.cards.${cardIndex}.items`, type: 'list', label: `${panel.title || panelKey}: список спецификаций ${groupIndex + 1}.${cardIndex + 1}`, element: list });
                });
            });

            const sectionHeading = panelElement.querySelector('.catalog-panel__section-heading');
            if (sectionHeading) {
                const headingTitle = sectionHeading.querySelector('h3');
                const headingText = sectionHeading.querySelector('p');
                if (headingTitle) panelBindings.push({ path: `${panelKey}.sectionHeading.title`, type: 'text', label: `${panel.title || panelKey}: заголовок секции`, element: headingTitle });
                if (headingText) panelBindings.push({ path: `${panelKey}.sectionHeading.text`, type: 'textarea', label: `${panel.title || panelKey}: описание секции`, element: headingText });
            }

            const steps = panelElement.querySelector('.automation-steps');
            if (steps) {
                steps.querySelectorAll('.automation-step').forEach((step, stepIndex) => {
                    const stepTitle = step.querySelector('h3');
                    const stepText = step.querySelector('p');
                    panelBindings.push({
                        path: `${panelKey}.steps.${stepIndex}`,
                        type: 'object',
                        editorKindLabel: 'Шаг на странице',
                        label: `${panel.title || panelKey}: шаг ${stepIndex + 1} целиком`,
                        element: step,
                        collectionPath: `${panelKey}.steps`,
                        collectionItemFactory(nextIndex) {
                            const nextStep = steps.querySelectorAll('.automation-step')[nextIndex];
                            if (!nextStep) return null;
                            return {
                                path: `${panelKey}.steps.${nextIndex}`,
                                type: 'object',
                                editorKindLabel: 'Шаг на странице',
                                label: `${panel.title || panelKey}: шаг ${nextIndex + 1} целиком`,
                                element: nextStep,
                                collectionPath: `${panelKey}.steps`,
                                collectionItemFactory: this.collectionItemFactory,
                                collectionCreateValue() {
                                    return { number: String(nextIndex + 1), title: 'Новый шаг', text: 'Короткое описание шага.' };
                                },
                                fields: [
                                    { key: 'number', label: 'Номер', type: 'text' },
                                    { key: 'title', label: 'Заголовок', type: 'text' },
                                    { key: 'text', label: 'Описание', type: 'textarea' }
                                ],
                                collectionRender(values) {
                                    applySteps(panelElement, { steps: Array.isArray(values) ? values : [] });
                                },
                                render(value) {
                                    const number = nextStep.querySelector('.automation-step__number');
                                    const title = nextStep.querySelector('h3');
                                    const text = nextStep.querySelector('p');
                                    if (number) number.textContent = value?.number || '';
                                    if (title) title.textContent = value?.title || '';
                                    if (text) text.textContent = value?.text || '';
                                }
                            };
                        },
                        collectionCreateValue() {
                            return { number: String(stepIndex + 2), title: 'Новый шаг', text: 'Короткое описание шага.' };
                        },
                        fields: [
                            { key: 'number', label: 'Номер', type: 'text' },
                            { key: 'title', label: 'Заголовок', type: 'text' },
                            { key: 'text', label: 'Описание', type: 'textarea' }
                        ],
                        collectionRender(values) {
                            applySteps(panelElement, { steps: Array.isArray(values) ? values : [] });
                        },
                        render(value) {
                            const number = step.querySelector('.automation-step__number');
                            if (number) number.textContent = value?.number || '';
                            if (stepTitle) stepTitle.textContent = value?.title || '';
                            if (stepText) stepText.textContent = value?.text || '';
                        }
                    });
                    if (stepTitle) panelBindings.push({ path: `${panelKey}.steps.${stepIndex}.title`, type: 'text', label: `${panel.title || panelKey}: шаг ${stepIndex + 1}`, element: stepTitle });
                    if (stepText) panelBindings.push({ path: `${panelKey}.steps.${stepIndex}.text`, type: 'textarea', label: `${panel.title || panelKey}: описание шага ${stepIndex + 1}`, element: stepText });
                });
            }

            const buildProductCardBinding = (targetCard, targetIndex) => ({
                path: `${panelKey}.products.${targetIndex}`,
                type: 'object',
                editorKindLabel: 'Карточка на странице',
                label: `${panel.title || panelKey}: товар ${targetIndex + 1} — карточка целиком`,
                element: targetCard,
                collectionPath: `${panelKey}.products`,
                collectionItemFactory(nextIndex) {
                    const nextCard = panelElement.querySelectorAll('.automation-products .automation-card')[nextIndex];
                    if (!nextCard) return null;
                    return buildProductCardBinding(nextCard, nextIndex);
                },
                collectionCreateValue(currentValue) {
                    return {
                        ...(currentValue || {}),
                        meta: currentValue?.meta || 'Новый комплект',
                        title: currentValue?.title || 'Новый товар',
                        description: currentValue?.description || 'Короткое описание товара.',
                        specs: Array.isArray(currentValue?.specs) && currentValue.specs.length ? currentValue.specs : ['Новая характеристика'],
                        cta: currentValue?.cta || 'Открыть комплект',
                        href: currentValue?.href || '#'
                    };
                },
                fields: [
                    { key: 'meta', label: 'Артикул / метка', type: 'text' },
                    { key: 'title', label: 'Заголовок', type: 'text' },
                    { key: 'description', label: 'Описание', type: 'textarea' },
                    { key: 'specs', label: 'Характеристики', type: 'list', hint: 'Каждый пункт с новой строки.' },
                    { key: 'cta', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка кнопки', type: 'text' }
                ],
                collectionRender(values) {
                    applyProducts(panelElement, { products: Array.isArray(values) ? values : [] });
                },
                render(value) {
                    applyProductCard(targetCard, value || {});
                }
            });

            panelElement.querySelectorAll('.automation-products .automation-card').forEach((card, cardIndex) => {
                const meta = card.querySelector('.automation-card__meta');
                const cardTitle = card.querySelector('.automation-card__title');
                const description = card.querySelector('.automation-card__description');
                const specs = card.querySelector('.automation-card__specs');
                const mediaLink = card.querySelector('.automation-card__zoom');
                const mediaImage = mediaLink?.querySelector('img');
                const action = card.querySelector('.automation-card__cta');
                if (meta) panelBindings.push({ path: `${panelKey}.products.${cardIndex}.meta`, type: 'text', label: `${panel.title || panelKey}: товар ${cardIndex + 1} — артикул`, element: meta });
                if (cardTitle) panelBindings.push({ path: `${panelKey}.products.${cardIndex}.title`, type: 'text', label: `${panel.title || panelKey}: товар ${cardIndex + 1} — заголовок`, element: cardTitle });
                if (description) panelBindings.push({ path: `${panelKey}.products.${cardIndex}.description`, type: 'textarea', label: `${panel.title || panelKey}: товар ${cardIndex + 1} — описание`, element: description });
                if (specs) panelBindings.push({ path: `${panelKey}.products.${cardIndex}.specs`, type: 'list', label: `${panel.title || panelKey}: товар ${cardIndex + 1} — характеристики`, element: specs });
                if (mediaImage && mediaLink) {
                    panelBindings.push({
                        path: `${panelKey}.products.${cardIndex}.image`,
                        type: 'image',
                        label: `${panel.title || panelKey}: товар ${cardIndex + 1} — фото`,
                        element: mediaImage,
                        defaultValue: () => extractImageValue(mediaImage, mediaLink),
                        directory: extractDirectoryFromSrc(mediaImage.getAttribute('src') || ''),
                        fields: [
                            { key: 'alt', label: 'Alt', type: 'text' },
                            { key: 'title', label: 'Подпись/название', type: 'text' }
                        ],
                        render(value) {
                            mediaLink.href = value?.src || '';
                            mediaLink.title = value?.title || value?.alt || '';
                            mediaImage.src = value?.src || '';
                            mediaImage.alt = value?.alt || '';
                            if (value?.width) mediaImage.setAttribute('width', Number(value.width));
                            if (value?.height) mediaImage.setAttribute('height', Number(value.height));
                        }
                    });
                }
                panelBindings.push(buildProductCardBinding(card, cardIndex));
                if (action) {
                    panelBindings.push({
                        path: `${panelKey}.products.${cardIndex}`,
                        type: 'object',
                        label: `${panel.title || panelKey}: товар ${cardIndex + 1} — кнопка`,
                        element: action,
                        fields: [
                            { key: 'cta', label: 'Текст кнопки', type: 'text' },
                            { key: 'href', label: 'Ссылка', type: 'text' }
                        ],
                        render(value, binding) {
                            binding.elements.forEach((element) => {
                                element.textContent = value?.cta || '';
                                if (element.tagName === 'A') {
                                    element.setAttribute('href', value?.href || '#');
                                }
                            });
                        }
                    });
                }
            });

            const panelCta = panelElement.querySelector('.catalog-panel__cta');
            if (panelCta) {
                const ctaTitle = panelCta.querySelector('h3');
                const ctaText = panelCta.querySelector('p');
                const contacts = panelCta.querySelectorAll('.catalog-contact-list a');
                if (ctaTitle) panelBindings.push({ path: `${panelKey}.cta.title`, type: 'text', label: `${panel.title || panelKey}: CTA — заголовок`, element: ctaTitle });
                if (ctaText) panelBindings.push({ path: `${panelKey}.cta.text`, type: 'textarea', label: `${panel.title || panelKey}: CTA — текст`, element: ctaText });
                const buildPanelCtaContactBinding = (targetContact, contactIndex) => ({
                    path: `${panelKey}.cta.contacts.${contactIndex}`,
                    type: 'object',
                    editorKindLabel: 'Контакт на странице',
                    label: `${panel.title || panelKey}: CTA — контакт ${contactIndex + 1}`,
                    element: targetContact,
                    collectionPath: `${panelKey}.cta.contacts`,
                    collectionItemFactory(nextIndex) {
                        const nextContact = panelCta.querySelectorAll('.catalog-contact-list a')[nextIndex];
                        if (!nextContact) return null;
                        return buildPanelCtaContactBinding(nextContact, nextIndex);
                    },
                    collectionCreateValue() {
                        return {
                            icon: 'fas fa-phone',
                            label: 'Новый контакт',
                            href: '#'
                        };
                    },
                    fields: [
                        { key: 'icon', label: 'Иконка', type: 'text' },
                        { key: 'label', label: 'Текст', type: 'text' },
                        { key: 'href', label: 'Ссылка', type: 'text' }
                    ],
                    collectionRender(values) {
                        syncContactLinks(panelCta.querySelector('.catalog-contact-list'), Array.isArray(values) ? values : []);
                    },
                    render(value, binding) {
                        binding.elements.forEach((element) => renderContactNode(element, value || {}));
                    }
                });

                contacts.forEach((contact, contactIndex) => {
                    panelBindings.push(buildPanelCtaContactBinding(contact, contactIndex));
                });
            }
        });

        if (panelBindings.length) {
            queueInlineBindings({
                fileName: 'catalog-panels',
                sectionKey: 'catalog-panels',
                sectionLabel: 'Карточки каталога',
                bindings: panelBindings
            });
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;
        if (!document.querySelector('[data-catalog-layout]')) return;

        try {
            const [content, panelContent] = await Promise.all([
                window.PokraskaContent.loadContentFile('catalog'),
                window.PokraskaContent.loadContentFile('catalog-panels').catch(() => ({}))
            ]);

            const hiddenTitle = document.querySelector('.catalog-page .visually-hidden');
            if (hiddenTitle) {
                hiddenTitle.textContent = content.pageTitle || '';
            }

            (content.groups || []).forEach((group) => {
                const tab = document.querySelector(`[data-catalog-group="${group.key}"]`);
                const panel = document.querySelector(`[data-catalog-group-panel="${group.key}"]`);

                if (tab) {
                    const title = tab.querySelector('.catalog-group-tab__title');
                    const icon = tab.querySelector('.catalog-group-tab__icon i');
                    if (title) title.textContent = group.title || '';
                    if (icon && group.icon) icon.className = group.icon;
                }

                if (panel) {
                    const eyebrow = panel.querySelector('.catalog-group-panel__eyebrow');
                    const title = panel.querySelector('.catalog-group-panel__intro h3');
                    const text = panel.querySelector('.catalog-group-panel__intro p');
                    const links = panel.querySelector('.catalog-group-panel__links');

                    if (eyebrow) eyebrow.textContent = group.eyebrow || '';
                    if (title) title.textContent = group.title || '';
                    if (text) text.textContent = group.text || '';

                    if (links) {
                        syncCatalogGroupLinks(panel, group.links || []);
                    }
                }
            });

            Object.values(panelContent || {})
                .filter((panel) => panel && typeof panel === 'object')
                .forEach(applyPanel);

            const partnersTitle = document.querySelector('.catalog-partners h3');
            if (partnersTitle) {
                partnersTitle.innerHTML = `<i class="fas fa-handshake"></i> ${escapeHtml(content.partners?.title || '')}`;
            }

            const cta = document.querySelector('.catalog-cta');
            if (cta) {
                const title = cta.querySelector('h3');
                const text = cta.querySelector('p');
                const contacts = cta.querySelector('.catalog-contact-list');
                if (title) title.textContent = content.cta?.title || '';
                if (text) text.textContent = content.cta?.text || '';
                if (contacts) {
                    syncContactLinks(contacts, content.cta?.contacts || []);
                }
            }

            registerInlineBindings(content, panelContent);
        } catch (error) {
            console.warn('Failed to apply catalog content', error);
        }
    });
})();
