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

        const thumbs = Array.from(gallery.querySelectorAll('.catalog-panel__media-thumb'));
        const hiddenLinks = Array.from(gallery.querySelectorAll('[data-gallery-lightbox-link]'));
        const prevBtn = gallery.querySelector('.catalog-panel__media-nav--prev');
        const nextBtn = gallery.querySelector('.catalog-panel__media-nav--next');
        const thumbsWrap = gallery.querySelector('.catalog-panel__media-thumbs');

        thumbs.forEach((thumb, index) => {
            const item = items[index];
            thumb.hidden = !item;
            thumb.classList.toggle('is-active', index === 0 && Boolean(item));
            if (item) {
                applyCatalogGalleryItem(thumb, item);
            }
        });

        hiddenLinks.forEach((link, index) => {
            const item = items[index];
            link.hidden = !item;
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
        const iconHtml = icon ? icon.outerHTML : '';
        anchor.innerHTML = `${iconHtml} ${escapeHtml(contact?.label || '')}`.trim();
        anchor.setAttribute('href', contact?.href || '#');
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

        infoGrid.innerHTML = renderInfoCards(panelContent.cards, 'h3');
    }

    function applyFaq(panelElement, panelContent) {
        const faqSection = panelElement.querySelector('.faq-section');
        const faq = panelContent.faq;
        if (!faqSection || !faq || !faq.title) return;

        faqSection.innerHTML = `
            <h3 class="section-title">${escapeHtml(faq.title)}</h3>
            ${faq.subtitle ? `<p class="section-subtitle">${escapeHtml(faq.subtitle)}</p>` : ''}
            <div class="faq-list">
                ${(faq.items || []).map((item) => `
                    <details class="faq-item">
                        <summary class="faq-question">${escapeHtml(item.question || '')}</summary>
                        <div class="faq-answer">
                            <p>${escapeHtml(item.answer || '')}</p>
                        </div>
                    </details>
                `).join('')}
            </div>
        `;
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

        steps.innerHTML = panelContent.steps.map((step) => `
            <article class="automation-step">
                <span class="automation-step__number">${escapeHtml(step.number || '')}</span>
                <h3>${escapeHtml(step.title || '')}</h3>
                <p>${escapeHtml(step.text || '')}</p>
            </article>
        `).join('');
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

    function applyProducts(panelElement, panelContent) {
        const cards = Array.from(panelElement.querySelectorAll('.automation-products .automation-card'));
        if (!cards.length || !Array.isArray(panelContent.products) || !panelContent.products.length) return;

        panelContent.products.forEach((product, index) => {
            applyProductCard(cards[index], product);
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
            contacts.innerHTML = ctaData.contacts.map(renderContact).join('');
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

            panel?.querySelectorAll('.catalog-group-panel__links [data-catalog-tab]').forEach((button, linkIndex) => {
                catalogBindings.push({
                    path: `groups.${groupIndex}.links.${linkIndex}.label`,
                    type: 'text',
                    label: `Группа каталога ${groupIndex + 1}: кнопка ${linkIndex + 1}`,
                    element: button
                });
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
            contacts.forEach((contact, index) => {
                catalogBindings.push({
                    path: `cta.contacts.${index}`,
                    type: 'object',
                    label: `Нижний CTA каталога: контакт ${index + 1}`,
                    element: contact,
                    fields: [
                        { key: 'label', label: 'Текст', type: 'text' },
                        { key: 'href', label: 'Ссылка', type: 'text' }
                    ],
                    render(value, binding) {
                        binding.elements.forEach((element) => renderContactNode(element, value || {}));
                    }
                });
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
                Array.from(gallery.querySelectorAll('.catalog-panel__media-thumb')).forEach((thumb, index) => {
                    const thumbImage = thumb.querySelector('img');
                    const hiddenLink = gallery.querySelector(`[data-gallery-lightbox-link="${index}"]`);
                    if (!thumbImage) return;

                    panelBindings.push({
                        path: `${panelKey}.gallery.${index}`,
                        type: 'image',
                        label: `${panel.title || panelKey}: фото ${index + 1}`,
                        element: index === 0 && mainImage ? [mainImage, thumbImage] : thumbImage,
                        defaultValue: () => extractCatalogGalleryItem(thumb),
                        directory: extractDirectoryFromSrc(thumb.dataset.gallerySrc || thumbImage.getAttribute('src') || ''),
                        fields: [
                            { key: 'alt', label: 'Alt', type: 'text' },
                            { key: 'title', label: 'Подпись/название', type: 'text' }
                        ],
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
                    });
                });
            }

            panelElement.querySelectorAll('.catalog-info-grid .catalog-info-card').forEach((card, cardIndex) => {
                const cardTitle = card.querySelector('h3');
                const items = card.querySelector('ul');
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
                    if (stepTitle) panelBindings.push({ path: `${panelKey}.steps.${stepIndex}.title`, type: 'text', label: `${panel.title || panelKey}: шаг ${stepIndex + 1}`, element: stepTitle });
                    if (stepText) panelBindings.push({ path: `${panelKey}.steps.${stepIndex}.text`, type: 'textarea', label: `${panel.title || panelKey}: описание шага ${stepIndex + 1}`, element: stepText });
                });
            }

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
                contacts.forEach((contact, contactIndex) => {
                    panelBindings.push({
                        path: `${panelKey}.cta.contacts.${contactIndex}`,
                        type: 'object',
                        label: `${panel.title || panelKey}: CTA — контакт ${contactIndex + 1}`,
                        element: contact,
                        fields: [
                            { key: 'label', label: 'Текст', type: 'text' },
                            { key: 'href', label: 'Ссылка', type: 'text' }
                        ],
                        render(value, binding) {
                            binding.elements.forEach((element) => renderContactNode(element, value || {}));
                        }
                    });
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
                        (group.links || []).forEach((link) => {
                            const button = links.querySelector(`[data-catalog-tab="${link.panelId}"]`);
                            if (button) {
                                button.textContent = link.label || '';
                            }
                        });
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
                    contacts.innerHTML = (content.cta?.contacts || []).map(renderContact).join('');
                }
            }

            registerInlineBindings(content, panelContent);
        } catch (error) {
            console.warn('Failed to apply catalog content', error);
        }
    });
})();
