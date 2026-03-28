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

    function renderBackLink(anchor, href, label) {
        if (!anchor) return;
        anchor.setAttribute('href', href || '#');
        anchor.innerHTML = `<i class="fas fa-arrow-left" aria-hidden="true"></i> ${escapeHtml(label || '')}`;
    }

    function extractDirectoryFromSrc(src, fallback = 'assets/images/catalog/automation') {
        const cleanSrc = String(src || '').split('?')[0];
        const withoutDots = cleanSrc.replace(/^(\.\.\/)+/, '');
        const lastSlashIndex = withoutDots.lastIndexOf('/');
        return lastSlashIndex >= 0 ? withoutDots.slice(0, lastSlashIndex) : fallback;
    }

    function extractLinkedImageValue(image, link) {
        if (!image) return { src: '', alt: '', title: '', width: null, height: null };
        return {
            src: link?.getAttribute('href') || image.getAttribute('src') || '',
            alt: image.getAttribute('alt') || '',
            title: link?.getAttribute('title') || image.getAttribute('alt') || '',
            width: Number(image.getAttribute('width')) || null,
            height: Number(image.getAttribute('height')) || null
        };
    }

    function applyLinkedImageValue(image, link, value) {
        if (!image || !value) return;
        if (link) {
            link.href = value.src || '';
            link.title = value.title || value.alt || '';
        }
        image.src = value.src || '';
        image.alt = value.alt || '';
        if (value.width) image.setAttribute('width', Number(value.width));
        if (value.height) image.setAttribute('height', Number(value.height));
    }

    function extractAutomationGalleryItem(button) {
        if (!button) return { src: '', alt: '', title: '', width: null, height: null };
        const image = button.querySelector('img');
        return {
            src: button.dataset.thumbSrc || image?.getAttribute('src') || '',
            alt: button.dataset.thumbAlt || image?.getAttribute('alt') || '',
            title: button.dataset.thumbAlt || image?.getAttribute('alt') || '',
            width: Number(image?.getAttribute('width')) || null,
            height: Number(image?.getAttribute('height')) || null
        };
    }

    function applyAutomationGalleryItem(button, item) {
        if (!button || !item) return;
        const image = button.querySelector('img');
        button.dataset.thumbSrc = item.src || '';
        button.dataset.thumbAlt = item.alt || '';
        if (image) {
            image.src = item.src || '';
            image.alt = item.alt || '';
            if (item.width) image.setAttribute('width', Number(item.width));
            if (item.height) image.setAttribute('height', Number(item.height));
        }
    }

    function syncAutomationGallery(gallery, items) {
        if (!gallery || !Array.isArray(items) || !items.length) return;

        const mainLink = gallery.querySelector('[data-main-link]');
        const mainImage = gallery.querySelector('[data-main-image]');
        const thumbsWrap = gallery.querySelector('.automation-product-thumbs');
        const thumbs = Array.from(gallery.querySelectorAll('.automation-product-thumb'));

        thumbs.forEach((thumb, index) => {
            const item = items[index];
            thumb.hidden = !item;
            thumb.classList.toggle('is-active', index === 0 && Boolean(item));
            if (item) {
                applyAutomationGalleryItem(thumb, item);
            }
        });

        applyLinkedImageValue(mainImage, mainLink, items[0]);

        if (thumbsWrap) {
            thumbsWrap.style.display = items.length > 1 ? '' : 'none';
        }
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

            const gallery = card.querySelector('.automation-product-gallery');
            if (gallery && Array.isArray(product.gallery) && product.gallery.length) {
                syncAutomationGallery(gallery, product.gallery);
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

            const figures = guide.querySelectorAll('.automation-guide__figure');
            if (Array.isArray(content.guide?.gallery) && content.guide.gallery.length) {
                figures.forEach((figure, index) => {
                    const item = content.guide.gallery[index];
                    if (!item) return;
                    const link = figure.querySelector('a');
                    const image = figure.querySelector('img');
                    applyLinkedImageValue(image, link, item);
                });
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
        const gallery = document.querySelector('.automation-product-gallery');
        if (gallery && Array.isArray(content.gallery) && content.gallery.length) {
            syncAutomationGallery(gallery, content.gallery);
        }

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
        const gallery = document.querySelector('.automation-product-gallery');
        if (gallery && Array.isArray(content.gallery) && content.gallery.length) {
            syncAutomationGallery(gallery, content.gallery);
        }
        if (cta) {
            cta.innerHTML = [
                renderButton(sharedActions.primary || {}, 'btn btn-primary'),
                renderButton(sharedActions.secondary || {}, 'btn btn-secondary')
            ].join('');
        }
    }

    function registerInlineBindings(pageKey, content, sharedActions) {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];

        if (pageKey === 'automation-swing') {
            const hero = document.querySelector('.catalog-hero');
            const listingHeader = document.querySelector('#catalog-panel-automation-swing .catalog-panel__header');
            const guide = document.querySelector('.automation-guide');
            const cta = document.querySelector('#catalog-panel-automation-swing .catalog-panel__cta');

            if (hero) {
                const breadcrumbs = hero.querySelector('.catalog-breadcrumbs');
                const title = hero.querySelector('h1');
                const subtitle = hero.querySelector('p');
                if (breadcrumbs) bindings.push({ path: 'swingLanding.hero.breadcrumbs', type: 'text', label: 'Хлебные крошки автоматики распашных ворот', element: breadcrumbs });
                if (title) bindings.push({ path: 'swingLanding.hero.title', type: 'text', label: 'Заголовок автоматики распашных ворот', element: title });
                if (subtitle) bindings.push({ path: 'swingLanding.hero.subtitle', type: 'textarea', label: 'Описание автоматики распашных ворот', element: subtitle });
            }

            if (listingHeader) {
                const breadcrumbs = listingHeader.querySelector('.catalog-breadcrumbs');
                const title = listingHeader.querySelector('h2');
                if (breadcrumbs) bindings.push({ path: 'swingLanding.listingHeader.breadcrumbs', type: 'text', label: 'Хлебные крошки блока комплектов', element: breadcrumbs });
                if (title) bindings.push({ path: 'swingLanding.listingHeader.title', type: 'text', label: 'Заголовок блока комплектов', element: title });
            }

            document.querySelectorAll('.automation-products .automation-product-card').forEach((card, index) => {
                const meta = card.querySelector('.automation-product-meta');
                const title = card.querySelector('.automation-product-title');
                const description = card.querySelector('.automation-product-description');
                const specs = card.querySelector('.automation-product-specs');
                const action = card.querySelector('.automation-product-cta .btn');
                const gallery = card.querySelector('.automation-product-gallery');

                bindings.push({
                    path: `swingLanding.products.${index}`,
                    type: 'object',
                    label: `Карточка автоматики ${index + 1} целиком`,
                    element: card,
                    fields: [
                        { key: 'meta', label: 'Артикул / метка', type: 'text' },
                        { key: 'title', label: 'Заголовок', type: 'text' },
                        { key: 'description', label: 'Описание', type: 'textarea' },
                        { key: 'specs', label: 'Характеристики', type: 'list', hint: 'Каждый пункт с новой строки.' },
                        { key: 'cta.label', label: 'Текст кнопки', type: 'text' },
                        { key: 'cta.href', label: 'Ссылка кнопки', type: 'text' }
                    ],
                    render(value) {
                        const nextValue = value || {};
                        if (meta) meta.textContent = nextValue.meta || '';
                        if (title) title.textContent = nextValue.title || '';
                        if (description) description.textContent = nextValue.description || '';
                        if (specs) specs.innerHTML = (nextValue.specs || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
                        if (action) {
                            renderButtonNode(action, nextValue.cta || {}, 'btn btn-primary');
                        }
                    }
                });

                if (meta) bindings.push({ path: `swingLanding.products.${index}.meta`, type: 'text', label: `Карточка автоматики ${index + 1}: артикул`, element: meta });
                if (title) bindings.push({ path: `swingLanding.products.${index}.title`, type: 'text', label: `Карточка автоматики ${index + 1}: заголовок`, element: title });
                if (description) bindings.push({ path: `swingLanding.products.${index}.description`, type: 'textarea', label: `Карточка автоматики ${index + 1}: описание`, element: description });
                if (specs) bindings.push({ path: `swingLanding.products.${index}.specs`, type: 'list', label: `Карточка автоматики ${index + 1}: характеристики`, element: specs });
                if (action) {
                    bindings.push({
                        path: `swingLanding.products.${index}.cta`,
                        type: 'object',
                        label: `Карточка автоматики ${index + 1}: кнопка`,
                        element: action,
                        fields: [
                            { key: 'label', label: 'Текст кнопки', type: 'text' },
                            { key: 'href', label: 'Ссылка', type: 'text' }
                        ],
                        render(value, binding) {
                            binding.elements.forEach((element) => renderButtonNode(element, value || {}, 'btn btn-primary'));
                        }
                    });
                }

                if (gallery) {
                    gallery.querySelectorAll('.automation-product-thumb').forEach((thumb, thumbIndex) => {
                        bindings.push({
                            path: `swingLanding.products.${index}.gallery.${thumbIndex}`,
                            type: 'image',
                            label: `Карточка автоматики ${index + 1}: фото ${thumbIndex + 1}`,
                            element: thumb,
                            collectionPath: `swingLanding.products.${index}.gallery`,
                            defaultValue: () => extractAutomationGalleryItem(thumb),
                            directory: extractDirectoryFromSrc(thumb.dataset.thumbSrc || thumb.querySelector('img')?.getAttribute('src')),
                            collectionRender(items) {
                                syncAutomationGallery(gallery, Array.isArray(items) ? items : []);
                            },
                            render(value, binding) {
                                binding.elements.forEach((element) => applyAutomationGalleryItem(element, value));
                                const items = Array.from(gallery.querySelectorAll('.automation-product-thumb'))
                                    .filter((button) => !button.hidden)
                                    .map((button) => extractAutomationGalleryItem(button));
                                syncAutomationGallery(gallery, items);
                            }
                        });
                    });
                }
            });

            if (guide) {
                const title = guide.querySelector('h3');
                const intro = guide.querySelector('p');
                const list = guide.querySelector('.automation-guide__list');
                const subheading = guide.querySelector('h4');
                const text = guide.querySelector('.automation-guide__text');
                if (title) bindings.push({ path: 'swingLanding.guide.title', type: 'text', label: 'Заголовок блока подбора автоматики', element: title });
                if (intro) bindings.push({ path: 'swingLanding.guide.intro', type: 'textarea', label: 'Вводный текст блока подбора автоматики', element: intro });
                if (list) bindings.push({ path: 'swingLanding.guide.list', type: 'list', label: 'Список в блоке подбора автоматики', element: list });
                if (subheading) bindings.push({ path: 'swingLanding.guide.subheading', type: 'text', label: 'Подзаголовок в блоке подбора автоматики', element: subheading });
                if (text) {
                    bindings.push({
                        path: 'swingLanding.guide.paragraphs',
                        type: 'list',
                        label: 'Абзацы в блоке подбора автоматики',
                        hint: 'Каждый абзац с новой строки.',
                        element: text,
                        render(value, binding) {
                            const paragraphs = Array.isArray(value) ? value : [];
                            binding.elements.forEach((element) => {
                                element.innerHTML = paragraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join('');
                            });
                        }
                    });
                }

                guide.querySelectorAll('.automation-guide__figure').forEach((figure, figureIndex) => {
                    const link = figure.querySelector('a');
                    const image = figure.querySelector('img');
                    if (!link || !image) return;
                    bindings.push({
                        path: `swingLanding.guide.gallery.${figureIndex}`,
                        type: 'image',
                        label: `Блок подбора автоматики: фото ${figureIndex + 1}`,
                        element: image,
                        defaultValue: () => extractLinkedImageValue(image, link),
                        directory: extractDirectoryFromSrc(link.getAttribute('href') || image.getAttribute('src')),
                        render(value, binding) {
                            binding.elements.forEach((element) => {
                                const currentLink = element.closest('a');
                                applyLinkedImageValue(element, currentLink, value);
                            });
                        }
                    });
                });
            }

            if (cta) {
                const title = cta.querySelector('h3');
                const text = cta.querySelector('p');
                const contacts = cta.querySelectorAll('.catalog-contact-list a');
                if (title) bindings.push({ path: 'swingLanding.cta.title', type: 'text', label: 'Заголовок CTA автоматики распашных ворот', element: title });
                if (text) bindings.push({ path: 'swingLanding.cta.text', type: 'textarea', label: 'Текст CTA автоматики распашных ворот', element: text });
                contacts.forEach((contact, index) => {
                    bindings.push({
                        path: `swingLanding.cta.contacts.${index}`,
                        type: 'object',
                        label: `Контакт CTA автоматики ${index + 1}`,
                        element: contact,
                        fields: [
                            { key: 'label', label: 'Текст', type: 'text' },
                            { key: 'href', label: 'Ссылка', type: 'text' }
                        ],
                        render(value, binding) {
                            binding.elements.forEach((element) => {
                                const icon = element.querySelector('i');
                                const iconHtml = icon ? icon.outerHTML : '';
                                element.innerHTML = `${iconHtml} ${escapeHtml(value?.label || '')}`.trim();
                                element.setAttribute('href', value?.href || '#');
                            });
                        }
                    });
                });
            }

            queueInlineBindings({
                fileName: 'automation',
                sectionKey: 'swingLanding',
                sectionLabel: 'Автоматика для распашных ворот',
                bindings
            });
            return;
        }

        if (pageKey === 'automation-sliding-components') {
            const backLink = document.querySelector('.automation-product-back');
            const meta = document.querySelector('.automation-product-meta');
            const title = document.querySelector('.automation-product-title');
            const description = document.querySelector('.automation-product-description');
            const sections = document.querySelectorAll('.automation-product-section');
            const ctaButtons = document.querySelectorAll('.automation-product-cta a');
            const gallery = document.querySelector('.automation-product-gallery');
            const productInfo = document.querySelector('.automation-product-info');

            if (productInfo) {
                const fields = [
                    { key: 'meta', label: 'Подпись раздела', type: 'text' },
                    { key: 'title', label: 'Заголовок', type: 'text' },
                    { key: 'description', label: 'Описание', type: 'textarea' }
                ];

                (content.slidingComponentsPage?.sections || []).forEach((sectionContent, index) => {
                    fields.push(
                        { key: `sections.${index}.title`, label: `Раздел ${index + 1}: заголовок`, type: 'text' },
                        { key: `sections.${index}.items`, label: `Раздел ${index + 1}: список`, type: 'list', hint: 'Каждый пункт с новой строки.' }
                    );
                });

                bindings.push({
                    path: 'slidingComponentsPage',
                    type: 'object',
                    label: 'Карточка комплектующих целиком',
                    element: productInfo,
                    fields,
                    render(value) {
                        applySlidingComponents(value || {}, content.sharedActions || {});
                    }
                });
            }

            if (backLink) {
                bindings.push({
                    path: 'slidingComponentsPage.backLabel',
                    type: 'text',
                    label: 'Подпись ссылки назад для комплектующих',
                    element: backLink,
                    render(value, binding) {
                        binding.elements.forEach((element) => renderBackLink(element, content.slidingComponentsPage?.backHref, value));
                    }
                });
            }
            if (meta) bindings.push({ path: 'slidingComponentsPage.meta', type: 'text', label: 'Подпись раздела комплектующих', element: meta });
            if (title) bindings.push({ path: 'slidingComponentsPage.title', type: 'text', label: 'Заголовок комплектующих', element: title });
            if (description) bindings.push({ path: 'slidingComponentsPage.description', type: 'textarea', label: 'Описание комплектующих', element: description });
            sections.forEach((section, index) => {
                const sectionTitle = section.querySelector('.automation-product-section__title');
                const list = section.querySelector('.automation-product-specs');
                if (sectionTitle) bindings.push({ path: `slidingComponentsPage.sections.${index}.title`, type: 'text', label: `Раздел комплектующих ${index + 1}: заголовок`, element: sectionTitle });
                if (list) bindings.push({ path: `slidingComponentsPage.sections.${index}.items`, type: 'list', label: `Раздел комплектующих ${index + 1}: список`, element: list });
            });

            if (gallery) {
                gallery.querySelectorAll('.automation-product-thumb').forEach((thumb, thumbIndex) => {
                    bindings.push({
                        path: `slidingComponentsPage.gallery.${thumbIndex}`,
                        type: 'image',
                        label: `Комплектующие: фото ${thumbIndex + 1}`,
                        element: thumb,
                        collectionPath: 'slidingComponentsPage.gallery',
                        defaultValue: () => extractAutomationGalleryItem(thumb),
                        directory: extractDirectoryFromSrc(thumb.dataset.thumbSrc || thumb.querySelector('img')?.getAttribute('src'), 'assets/images/catalog'),
                        collectionRender(items) {
                            syncAutomationGallery(gallery, Array.isArray(items) ? items : []);
                        },
                        render(value, binding) {
                            binding.elements.forEach((element) => applyAutomationGalleryItem(element, value));
                            const items = Array.from(gallery.querySelectorAll('.automation-product-thumb'))
                                .filter((button) => !button.hidden)
                                .map((button) => extractAutomationGalleryItem(button));
                            syncAutomationGallery(gallery, items);
                        }
                    });
                });
            }

            if (ctaButtons[0]) {
                bindings.push({
                    path: 'sharedActions.primary',
                    type: 'object',
                    label: 'Главная кнопка внизу карточки комплектующих',
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
                    path: 'sharedActions.secondary',
                    type: 'object',
                    label: 'Вторая кнопка внизу карточки комплектующих',
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

            queueInlineBindings({
                fileName: 'automation',
                sectionKey: 'slidingComponentsPage',
                sectionLabel: 'Комплектующие для откатных ворот',
                bindings
            });
            return;
        }

        const backLink = document.querySelector('.automation-product-back');
        const meta = document.querySelector('.automation-product-meta');
        const title = document.querySelector('.automation-product-title');
        const description = document.querySelector('.automation-product-description');
        const specs = document.querySelector('.automation-product-specs');
        const ctaButtons = document.querySelectorAll('.automation-product-cta a');
        const gallery = document.querySelector('.automation-product-gallery');
        const productInfo = document.querySelector('.automation-product-info');
        const productIndex = (content.productPages || []).findIndex((item) => item.pageKey === pageKey);
        if (productIndex === -1) return;

        if (productInfo) {
            bindings.push({
                path: `productPages.${productIndex}`,
                type: 'object',
                label: 'Карточка автоматики целиком',
                element: productInfo,
                fields: [
                    { key: 'meta', label: 'Подпись / артикул', type: 'text' },
                    { key: 'title', label: 'Заголовок', type: 'text' },
                    { key: 'description', label: 'Описание', type: 'textarea' },
                    { key: 'specs', label: 'Характеристики', type: 'list', hint: 'Каждый пункт с новой строки.' }
                ],
                render(value) {
                    applyProductPage(value || {}, content.sharedActions || {});
                }
            });
        }

        if (backLink) {
            bindings.push({
                path: `productPages.${productIndex}.backLabel`,
                type: 'text',
                label: 'Подпись ссылки назад на карточке автоматики',
                element: backLink,
                render(value, binding) {
                    binding.elements.forEach((element) => renderBackLink(element, content.productPages[productIndex]?.backHref, value));
                }
            });
        }
        if (meta) bindings.push({ path: `productPages.${productIndex}.meta`, type: 'text', label: 'Подпись на карточке автоматики', element: meta });
        if (title) bindings.push({ path: `productPages.${productIndex}.title`, type: 'text', label: 'Заголовок карточки автоматики', element: title });
        if (description) bindings.push({ path: `productPages.${productIndex}.description`, type: 'textarea', label: 'Описание карточки автоматики', element: description });
        if (specs) bindings.push({ path: `productPages.${productIndex}.specs`, type: 'list', label: 'Характеристики карточки автоматики', element: specs });
        if (gallery) {
            gallery.querySelectorAll('.automation-product-thumb').forEach((thumb, thumbIndex) => {
                bindings.push({
                    path: `productPages.${productIndex}.gallery.${thumbIndex}`,
                    type: 'image',
                    label: `Карточка автоматики: фото ${thumbIndex + 1}`,
                    element: thumb,
                    collectionPath: `productPages.${productIndex}.gallery`,
                    defaultValue: () => extractAutomationGalleryItem(thumb),
                    directory: extractDirectoryFromSrc(thumb.dataset.thumbSrc || thumb.querySelector('img')?.getAttribute('src')),
                    collectionRender(items) {
                        syncAutomationGallery(gallery, Array.isArray(items) ? items : []);
                    },
                    render(value, binding) {
                        binding.elements.forEach((element) => applyAutomationGalleryItem(element, value));
                        const items = Array.from(gallery.querySelectorAll('.automation-product-thumb'))
                            .filter((button) => !button.hidden)
                            .map((button) => extractAutomationGalleryItem(button));
                        syncAutomationGallery(gallery, items);
                    }
                });
            });
        }
        if (ctaButtons[0]) {
            bindings.push({
                path: 'sharedActions.primary',
                type: 'object',
                label: 'Главная кнопка на карточке автоматики',
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
                path: 'sharedActions.secondary',
                type: 'object',
                label: 'Вторая кнопка на карточке автоматики',
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

        queueInlineBindings({
            fileName: 'automation',
            sectionKey: `productPages.${productIndex}`,
            sectionLabel: content.productPages[productIndex]?.title || 'Карточка автоматики',
            bindings
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;

        const pageKey = getPageKey();
        if (!pageKey.startsWith('automation-')) return;

        try {
            const content = await window.PokraskaContent.loadContentFile('automation');

            if (pageKey === 'automation-swing') {
                applySwingLanding(content.swingLanding || {});
                registerInlineBindings(pageKey, content, content.sharedActions || {});
                return;
            }

            if (pageKey === 'automation-sliding-components') {
                applySlidingComponents(content.slidingComponentsPage || {}, content.sharedActions || {});
                registerInlineBindings(pageKey, content, content.sharedActions || {});
                return;
            }

            const product = (content.productPages || []).find((item) => item.pageKey === pageKey);
            if (product) {
                applyProductPage(product, content.sharedActions || {});
                registerInlineBindings(pageKey, content, content.sharedActions || {});
            }
        } catch (error) {
            console.warn('Failed to apply automation content', error);
        }
    });
})();
