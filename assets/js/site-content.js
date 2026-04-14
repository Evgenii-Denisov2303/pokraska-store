(function() {
    const query = new URLSearchParams(window.location.search);
    const INLINE_EDITOR_VERSION = '20260401-inline-cache-bust-21';
    let inlineEditorAvailabilityPromise = null;

    function getInlineEditorBase() {
        return (window.PokraskaContent?.baseUrl || '').replace(/\/+$/, '');
    }

    async function readInlineEditorSession() {
        if (inlineEditorAvailabilityPromise) {
            return inlineEditorAvailabilityPromise;
        }

        inlineEditorAvailabilityPromise = (async () => {
            const base = getInlineEditorBase();

            try {
                const response = await fetch(`${base || ''}/api/auth/session`, {
                    cache: 'no-store',
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    return null;
                }

                const payload = await response.json();
                return {
                    authEnabled: Boolean(payload.authEnabled),
                    authenticated: Boolean(payload.authenticated),
                    username: payload.username || ''
                };
            } catch (error) {
                return null;
            }
        })();

        return inlineEditorAvailabilityPromise;
    }

    async function shouldLoadInlineEditor() {
        const requestedEditor = query.get('edit') === '1';
        const session = await readInlineEditorSession();

        if (session) {
            window.POKRASKA_INLINE_SESSION = session;
            if (session.authenticated) {
                return true;
            }
        }

        return requestedEditor;
    }

    async function ensureInlineEditor() {
        if (!await shouldLoadInlineEditor()) return;
        if (document.querySelector('script[data-pokraska-inline-editor]')) return;

        const base = getInlineEditorBase();
        const freshToken = (query.get('fresh') || query.get('v') || '').trim();
        const version = freshToken
            ? `${INLINE_EDITOR_VERSION}-${freshToken}`
            : INLINE_EDITOR_VERSION;
        window.POKRASKA_INLINE_EDITOR_ENABLED = true;
        const script = document.createElement('script');
        script.defer = true;
        script.dataset.pokraskaInlineEditor = '1';
        script.src = `${base || ''}/assets/js/inline-editor.js?v=${encodeURIComponent(version)}`;
        document.head.appendChild(script);
    }

    function queueInlineBindings(config) {
        window.PokraskaInlineEditorQueue = window.PokraskaInlineEditorQueue || [];
        window.PokraskaInlineEditorQueue.push(config);
        window.PokraskaInlineEditor?.consumeQueue?.();
    }

    ensureInlineEditor();
    window.PokraskaQueueInlineBindings = queueInlineBindings;

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function extractDirectoryFromSrc(src, fallback = 'assets/images') {
        const cleanSrc = String(src || '').split('?')[0];
        const withoutDots = cleanSrc.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
        const lastSlashIndex = withoutDots.lastIndexOf('/');
        return lastSlashIndex >= 0 ? withoutDots.slice(0, lastSlashIndex) : fallback;
    }

    function normalizePath(input) {
        try {
            const url = new URL(input, window.location.origin);
            const path = url.pathname.replace(/\/+$/, '');
            return path === '' || path === '/' ? '/index.html' : path;
        } catch (error) {
            return '/index.html';
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

    function applyTextItem(element, value) {
        if (!element) return;
        const nextValue = value || '';
        if (element.textContent !== nextValue) {
            element.textContent = nextValue;
        }
    }

    function syncTextCollection(container, itemSelector, items) {
        if (!container) return;
        syncCollection(container, itemSelector, Array.isArray(items) ? items : [], (element, value) => {
            applyTextItem(element, value);
        });
    }

    function renderPhoneLink(anchor, phone) {
        if (!anchor || !phone) return;
        const nextHref = phone.href || '#';
        if (anchor.getAttribute('href') !== nextHref) {
            anchor.setAttribute('href', nextHref);
        }
        const number = anchor.querySelector('.phone-number');
        const note = anchor.querySelector('.phone-label');

        if (number && number.textContent !== (phone.label || '')) {
            number.textContent = phone.label || '';
        }
        if (note) {
            const nextNote = phone.note || '';
            if (note.textContent !== nextNote) {
                note.textContent = nextNote;
            }
            note.hidden = !phone.note;
        }
    }

    function renderHeroPhoneLink(anchor, phone) {
        if (!anchor || !phone) return;
        const nextHref = phone.href || '#';
        if (anchor.getAttribute('href') !== nextHref) {
            anchor.setAttribute('href', nextHref);
        }

        const number = anchor.querySelector('.hero-header-main');
        const note = anchor.querySelector('.hero-header-sub');

        if (number && number.textContent !== (phone.label || '')) {
            number.textContent = phone.label || '';
        }

        if (note) {
            const nextNote = phone.note || '';
            if (note.textContent !== nextNote) {
                note.textContent = nextNote;
            }
            note.hidden = !phone.note;
        }
    }

    function updateAnchorWithIcon(anchor, item) {
        if (!anchor || !item) return;
        const icon = anchor.querySelector('i');
        const nextHref = item.href || '#';
        if (anchor.getAttribute('href') !== nextHref) {
            anchor.setAttribute('href', nextHref);
        }

        if (icon) {
            const currentLabel = anchor.textContent.replace(/\s+/g, ' ').trim();
            const nextLabel = item.label || '';
            const iconClass = item.icon || icon.className;
            const needsRebuild = currentLabel !== nextLabel || icon.className !== iconClass;

            if (!needsRebuild) {
                return;
            }

            if (item.icon) {
                icon.className = item.icon;
            }
            anchor.textContent = '';
            anchor.appendChild(icon);
            anchor.append(` ${nextLabel}`);
        } else {
            const nextLabel = item.label || '';
            if (anchor.textContent !== nextLabel) {
                anchor.textContent = nextLabel;
            }
        }
    }

    function applyNavigationItem(anchor, item, currentPath) {
        if (!anchor || !item) return;
        updateAnchorWithIcon(anchor, item);
        const isActive = normalizePath(item.href || '/index.html') === currentPath;
        anchor.classList.toggle('active', isActive);
        if (isActive) {
            anchor.setAttribute('aria-current', 'page');
        } else {
            anchor.removeAttribute('aria-current');
        }
    }

    function syncNavigationList(navList, items, currentPath) {
        if (!navList) return;
        syncCollection(navList, 'a', Array.isArray(items) ? items : [], (anchor, item) => {
            applyNavigationItem(anchor, item, currentPath);
        });
    }

    function applyUsefulLinkItem(itemElement, item) {
        if (!itemElement || !item) return;
        const anchor = itemElement.querySelector('a');
        if (!anchor) return;
        anchor.textContent = item.label || '';
        anchor.setAttribute('href', item.href || '#');
    }

    function applyHeader(site) {
        document.querySelectorAll('.logo-link').forEach((link) => {
            const nextHref = site.navigation?.[0]?.href || '/index.html';
            if (link.getAttribute('href') !== nextHref) {
                link.setAttribute('href', nextHref);
            }
        });

        document.querySelectorAll('.logo-tagline').forEach((node) => {
            const nextTagline = site.brand?.tagline || '';
            if (node.textContent !== nextTagline) {
                node.textContent = nextTagline;
            }
        });

        document.querySelectorAll('.logo-image').forEach((image) => {
            if (site.brand?.logo?.src) {
                if (image.getAttribute('src') !== site.brand.logo.src) {
                    image.src = site.brand.logo.src;
                }
            }
            const nextAlt = site.brand?.logo?.alt || site.brand?.logoAlt || image.alt;
            if (image.alt !== nextAlt) {
                image.alt = nextAlt;
            }
        });

        const headerPhoneBlocks = document.querySelectorAll('.header-contact-stack .contact-phone');
        const primaryPhone = site.contact?.primaryPhone;
        const secondaryPhone = site.contact?.secondaryPhone;

        if (headerPhoneBlocks[0] && primaryPhone) {
            renderPhoneLink(headerPhoneBlocks[0], primaryPhone);
        }

        if (headerPhoneBlocks[1] && secondaryPhone) {
            renderPhoneLink(headerPhoneBlocks[1], secondaryPhone);
        }

        const addressNode = document.querySelector('.header-contact-stack .contact-address span');
        if (addressNode) {
            const nextAddress = site.contact?.address || '';
            if (addressNode.textContent !== nextAddress) {
                addressNode.textContent = nextAddress;
            }
        }

        const currentPath = normalizePath(window.location.pathname);
        document.querySelectorAll('.nav-list').forEach((navList) => {
            syncNavigationList(navList, site.navigation || [], currentPath);
        });

        // Десктопная hero-шапка теперь является статичным шаблоном и не должна
        // пересобираться после загрузки. Иначе появляются заметные рывки:
        // перезагрузка логотипа, переустановка телефонов и вставка иконок в меню.
    }

    function ensureLegacyFooterBrandMeta() {
        const footerLogo = document.querySelector('.footer-column--logo .footer-logo');
        if (!footerLogo) {
            return null;
        }

        let brandMeta = footerLogo.querySelector('.footer-brand-meta');
        if (!brandMeta) {
            brandMeta = document.createElement('div');
            brandMeta.className = 'footer-brand-meta';
            brandMeta.innerHTML = `
                <div class="footer-brand-meta__heading">
                    <div class="footer-brand-meta__eyebrow">Компания</div>
                    <h4 class="footer-brand-meta__company"></h4>
                </div>
                <div class="footer-brand-meta__description">
                    <p class="footer-brand-meta__text"></p>
                    <p class="footer-brand-meta__text"></p>
                </div>
            `;
            footerLogo.appendChild(brandMeta);
            return brandMeta;
        }

        let heading = brandMeta.querySelector('.footer-brand-meta__heading');
        let description = brandMeta.querySelector('.footer-brand-meta__description');

        if (!heading) {
            const eyebrow = brandMeta.querySelector('.footer-brand-meta__eyebrow') || document.createElement('div');
            eyebrow.className = 'footer-brand-meta__eyebrow';
            if (!eyebrow.textContent) {
                eyebrow.textContent = 'Компания';
            }

            const company = brandMeta.querySelector('.footer-brand-meta__company') || document.createElement('h4');
            company.className = 'footer-brand-meta__company';

            heading = document.createElement('div');
            heading.className = 'footer-brand-meta__heading';
            heading.append(eyebrow, company);
        }

        if (!description) {
            description = document.createElement('div');
            description.className = 'footer-brand-meta__description';
        }

        while (description.querySelectorAll('.footer-brand-meta__text').length < 2) {
            const paragraph = document.createElement('p');
            paragraph.className = 'footer-brand-meta__text';
            description.appendChild(paragraph);
        }

        if (brandMeta.firstElementChild !== heading || brandMeta.lastElementChild !== description) {
            brandMeta.replaceChildren(heading, description);
        }

        return brandMeta;
    }

    function applyFooter(site) {
        const premiumFooterCompany = document.querySelector('.footer-premium__column--company');
        const legacyFooterCompany = document.querySelector('.footer-column--company');
        const legacyFooterBrandMeta = ensureLegacyFooterBrandMeta();
        const footerCompanyTitle = premiumFooterCompany?.querySelector('.footer-premium__company')
            || legacyFooterCompany?.querySelector('h4')
            || legacyFooterBrandMeta?.querySelector('.footer-brand-meta__company');

        if (footerCompanyTitle) {
            footerCompanyTitle.textContent = site.footer?.companyTitle || '';
        }

        if (premiumFooterCompany) {
            syncTextCollection(premiumFooterCompany, '.footer-premium__legal-text', site.footer?.companyParagraphs || []);
        } else if (legacyFooterCompany) {
            syncTextCollection(legacyFooterCompany, ':scope > p', site.footer?.companyParagraphs || []);
        } else if (legacyFooterBrandMeta) {
            const legacyFooterBrandDescription = legacyFooterBrandMeta.querySelector('.footer-brand-meta__description');
            if (legacyFooterBrandDescription) {
                syncTextCollection(legacyFooterBrandDescription, '.footer-brand-meta__text', site.footer?.companyParagraphs || []);
            }
        }

        const premiumContactList = document.querySelector('.footer-premium__list--contacts');
        const legacyContactList = document.querySelector('.footer .contact-list');
        if (premiumContactList) {
            premiumContactList.innerHTML = `
                <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i><span>${escapeHtml(site.contact?.address || '')}</span></li>
                <li><i class="fas fa-phone" aria-hidden="true"></i><a href="${escapeHtml(site.contact?.primaryPhone?.href || '#')}">${escapeHtml(site.contact?.primaryPhone?.label || '')}</a></li>
                <li><i class="fas fa-phone" aria-hidden="true"></i><a href="${escapeHtml(site.contact?.secondaryPhone?.href || '#')}">${escapeHtml(site.contact?.secondaryPhone?.label || '')}</a></li>
                <li><i class="fas fa-envelope" aria-hidden="true"></i><a href="mailto:${escapeHtml(site.contact?.email || '')}">${escapeHtml(site.contact?.email || '')}</a></li>
                <li><i class="fas fa-clock" aria-hidden="true"></i><span>${escapeHtml(site.contact?.hours || '')}</span></li>
                <li><i class="fab fa-telegram-plane" aria-hidden="true"></i><a href="${escapeHtml(site.contact?.telegram?.href || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contact?.telegram?.label || 'Telegram')}</a></li>
                <li><i class="fas fa-comment-dots" aria-hidden="true"></i><a href="${escapeHtml(site.contact?.max?.href || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contact?.max?.label || 'Max')}</a></li>
            `;
        } else if (legacyContactList) {
            legacyContactList.innerHTML = `
                <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${escapeHtml(site.contact?.address || '')}</li>
                <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.primaryPhone?.href || '#')}">${escapeHtml(site.contact?.primaryPhone?.label || '')}</a></li>
                <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.secondaryPhone?.href || '#')}">${escapeHtml(site.contact?.secondaryPhone?.label || '')}</a></li>
                <li><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:${escapeHtml(site.contact?.email || '')}">${escapeHtml(site.contact?.email || '')}</a></li>
                <li><i class="fas fa-clock" aria-hidden="true"></i> ${escapeHtml(site.contact?.hours || '')}</li>
                <li><a href="${escapeHtml(site.contact?.telegram?.href || '#')}" target="_blank" rel="noopener noreferrer"><i class="fab fa-telegram-plane" aria-hidden="true"></i> ${escapeHtml(site.contact?.telegram?.label || 'Telegram')}</a></li>
                <li><a href="${escapeHtml(site.contact?.max?.href || '#')}" target="_blank" rel="noopener noreferrer"><i class="fas fa-comment-dots" aria-hidden="true"></i> ${escapeHtml(site.contact?.max?.label || 'Max')}</a></li>
            `;
        }

        const footerColumns = Array.from(document.querySelectorAll('.footer-column'));
        const usefulColumn = footerColumns.find((column) => {
            const heading = column.querySelector('h4');
            return heading && /Полезное/i.test(heading.textContent);
        });

        if (usefulColumn) {
            const title = usefulColumn.querySelector('h4');
            const list = usefulColumn.querySelector('ul');

            if (title) {
                title.textContent = site.footer?.usefulTitle || 'Полезное';
            }

            if (list) {
                syncCollection(list, 'li', site.footer?.usefulLinks || [], applyUsefulLinkItem);
            }
        }

        const footerBottom = document.querySelector('.footer-premium__bottom') || document.querySelector('.footer-bottom');
        if (footerBottom) {
            const paragraphs = footerBottom.querySelectorAll('p');
            const currentYear = new Date().getFullYear();
            const startYear = Number(site.brand?.copyrightStartYear) || currentYear;
            const yearRange = startYear >= currentYear ? `${currentYear}` : `${startYear}-${currentYear}`;

            if (paragraphs[0]) {
                paragraphs[0].innerHTML = `&copy; ${escapeHtml(yearRange)} ${escapeHtml(site.brand?.footerCaption || '')}`;
            }

            if (paragraphs[1]) {
                paragraphs[1].innerHTML = `<a href="${escapeHtml(site.footer?.policyHref || '/politika.html')}">${escapeHtml(site.footer?.policyLabel || 'Политика конфиденциальности')}</a> | Домен: ${escapeHtml(site.brand?.domain || '')}`;
            }
        }
    }

    function registerInlineBindings(site) {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const currentPath = normalizePath(window.location.pathname);
        const taglineNodes = Array.from(document.querySelectorAll('.logo-tagline'));
        if (taglineNodes.length) {
            bindings.push({
                path: 'brand.tagline',
                type: 'text',
                label: 'Слоган рядом с логотипом',
                hint: 'Короткая строка рядом с логотипом в шапке.',
                element: taglineNodes
            });
        }

        const logoImages = Array.from(document.querySelectorAll('.logo-image'));
        if (logoImages.length) {
            bindings.push({
                path: 'brand.logo',
                type: 'image',
                label: 'Логотип сайта',
                hint: 'Меняет логотип в шапке и подвале по всему сайту.',
                editorKindLabel: 'Логотип на странице',
                element: logoImages,
                directory: extractDirectoryFromSrc(logoImages[0]?.getAttribute('src') || '', 'assets/images'),
                fields: [
                    { key: 'alt', label: 'Alt', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        if (value?.src) {
                            element.src = value.src;
                        }
                        element.alt = value?.alt || site.brand?.logoAlt || element.alt;
                    });
                }
            });
        }

        const phoneLinks = Array.from(document.querySelectorAll('.header-contact-stack .contact-phone'));
        if (phoneLinks[0]) {
            bindings.push({
                path: 'contact.primaryPhone',
                type: 'object',
                label: 'Первый телефон в шапке',
                hint: 'Номер, ссылка и подпись.',
                element: phoneLinks[0],
                fields: [
                    { key: 'label', label: 'Номер', type: 'text' },
                    { key: 'href', label: 'Ссылка tel:', type: 'text' },
                    { key: 'note', label: 'Подпись', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderPhoneLink(element, value || {}));
                }
            });
        }

        if (phoneLinks[1]) {
            bindings.push({
                path: 'contact.secondaryPhone',
                type: 'object',
                label: 'Второй телефон в шапке',
                hint: 'Меняет второй номер в шапке сайта.',
                element: phoneLinks[1],
                fields: [
                    { key: 'label', label: 'Номер', type: 'text' },
                    { key: 'href', label: 'Ссылка tel:', type: 'text' },
                    { key: 'note', label: 'Подпись', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => renderPhoneLink(element, value || {}));
                }
            });
        }

        const addressNodes = Array.from(document.querySelectorAll('.header-contact-stack .contact-address span'));
        if (addressNodes.length) {
            bindings.push({
                path: 'contact.address',
                type: 'text',
                label: 'Адрес в шапке',
                hint: 'Отображается рядом с телефонами.',
                element: addressNodes
            });
        }

        const buildNavigationBinding = (index) => {
            const elements = Array.from(document.querySelectorAll('.nav-list')).map((list) => list.querySelectorAll('a')[index]).filter(Boolean);
            if (!elements.length) return null;

            return {
                path: `navigation.${index}`,
                type: 'object',
                editorKindLabel: 'Ссылка в меню',
                label: `Пункт меню ${index + 1}`,
                element: elements,
                collectionPath: 'navigation',
                collectionItemFactory(nextIndex) {
                    return buildNavigationBinding(nextIndex);
                },
                collectionCreateValue() {
                    return {
                        label: 'Новый пункт',
                        href: '/index.html',
                        icon: 'fas fa-circle'
                    };
                },
                fields: [
                    { key: 'label', label: 'Название пункта', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' }
                ],
                collectionRender(items) {
                    document.querySelectorAll('.nav-list').forEach((navList) => {
                        syncNavigationList(navList, Array.isArray(items) ? items : [], currentPath);
                    });
                },
                render(value, binding) {
                    binding.elements.forEach((element) => applyNavigationItem(element, value || {}, currentPath));
                }
            };
        };

        const navigationLength = Array.isArray(site?.navigation)
            ? site.navigation.length
            : Array.from(document.querySelectorAll('.nav-list a')).length;
        for (let index = 0; index < navigationLength; index += 1) {
            const binding = buildNavigationBinding(index);
            if (binding) bindings.push(binding);
        }

        const footerCompanyTitle = document.querySelector('.footer-premium__company')
            || document.querySelector('.footer-column--company h4')
            || document.querySelector('.footer-brand-meta__company');
        if (footerCompanyTitle) {
            bindings.push({
                path: 'footer.companyTitle',
                type: 'text',
                label: 'Название компании в подвале',
                element: footerCompanyTitle
            });
        }

        const footerCompany = document.querySelector('.footer-premium__column--company')
            || document.querySelector('.footer-column--company')
            || document.querySelector('.footer-brand-meta__description');
        if (footerCompany) {
            const paragraphContainer = footerCompany;
            const paragraphSelector = footerCompany.classList.contains('footer-premium__column--company')
                ? '.footer-premium__legal-text'
                : footerCompany.classList.contains('footer-brand-meta__description')
                    ? '.footer-brand-meta__text'
                : ':scope > p';

            bindings.push({
                path: 'footer.companyParagraphs',
                type: 'list',
                label: 'Описание компании в подвале',
                hint: 'Каждый абзац с новой строки.',
                element: footerCompany,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        syncTextCollection(element, paragraphSelector, Array.isArray(value) ? value : []);
                    });
                }
            });
            if (paragraphContainer) {
                Array.from(paragraphContainer.querySelectorAll(paragraphSelector)).forEach((paragraph, index) => {
                    bindings.push({
                        path: `footer.companyParagraphs.${index}`,
                        type: 'text',
                        editorKindLabel: 'Абзац на странице',
                        collectionPath: 'footer.companyParagraphs',
                        collectionItemLabel: 'абзац',
                        collectionItemLabelPlural: 'абзацев',
                        label: `Описание компании в подвале — абзац ${index + 1}`,
                        element: paragraph,
                        collectionItemFactory(nextIndex) {
                            const nextParagraph = paragraphContainer.querySelectorAll(paragraphSelector)[nextIndex];
                            if (!nextParagraph) return null;
                            return {
                                ...this,
                                path: `footer.companyParagraphs.${nextIndex}`,
                                label: `Описание компании в подвале — абзац ${nextIndex + 1}`,
                                element: nextParagraph
                            };
                        },
                        collectionCreateValue() {
                            return 'Новый абзац';
                        },
                        collectionRender(items) {
                            syncTextCollection(paragraphContainer, paragraphSelector, Array.isArray(items) ? items : []);
                        },
                        render(value, binding) {
                            binding.elements.forEach((element) => applyTextItem(element, value || ''));
                        }
                    });
                });
            }
        }

        const footerUsefulTitle = Array.from(document.querySelectorAll('.footer-column h4')).find((node) => /Полезное/i.test(node.textContent));
        if (footerUsefulTitle) {
            bindings.push({
                path: 'footer.usefulTitle',
                type: 'text',
                label: 'Заголовок полезных ссылок в подвале',
                element: footerUsefulTitle
            });
        }

        const usefulList = Array.from(document.querySelectorAll('.footer-column')).find((column) => {
            const heading = column.querySelector('h4');
            return heading && /Полезное/i.test(heading.textContent);
        })?.querySelector('ul');

        const buildUsefulLinkBinding = (index) => {
            const element = usefulList?.querySelectorAll('li')[index];
            if (!element) return null;

            return {
                path: `footer.usefulLinks.${index}`,
                type: 'object',
                editorKindLabel: 'Ссылка в подвале',
                label: `Полезная ссылка ${index + 1}`,
                element,
                collectionPath: 'footer.usefulLinks',
                collectionItemFactory(nextIndex) {
                    return buildUsefulLinkBinding(nextIndex);
                },
                collectionCreateValue() {
                    return {
                        label: 'Новая ссылка',
                        href: '/index.html'
                    };
                },
                fields: [
                    { key: 'label', label: 'Название ссылки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                collectionRender(items) {
                    if (usefulList) {
                        syncCollection(usefulList, 'li', Array.isArray(items) ? items : [], applyUsefulLinkItem);
                    }
                },
                render(value, binding) {
                    binding.elements.forEach((element) => applyUsefulLinkItem(element, value || {}));
                }
            };
        };

        const usefulLinksLength = Array.isArray(site?.footer?.usefulLinks)
            ? site.footer.usefulLinks.length
            : usefulList?.querySelectorAll('li').length || 0;
        for (let index = 0; index < usefulLinksLength; index += 1) {
            const binding = buildUsefulLinkBinding(index);
            if (binding) bindings.push(binding);
        }

        const footerEmail = document.querySelector('.footer-premium__list--contacts a[href^="mailto:"]') || document.querySelector('.footer .contact-list a[href^="mailto:"]');
        if (footerEmail) {
            bindings.push({
                path: 'contact.email',
                type: 'text',
                label: 'Почта в подвале',
                element: footerEmail,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.textContent = value || '';
                        element.setAttribute('href', `mailto:${value || ''}`);
                    });
                }
            });
        }

        const footerHoursItem = Array.from(document.querySelectorAll('.footer-premium__list--contacts li, .footer .contact-list li')).find((item) => item.querySelector('.fa-clock'));
        if (footerHoursItem) {
            bindings.push({
                path: 'contact.hours',
                type: 'text',
                label: 'Режим работы в подвале',
                element: footerHoursItem,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        if (element.closest('.footer-premium__list--contacts')) {
                            element.innerHTML = `<i class="fas fa-clock" aria-hidden="true"></i><span>${escapeHtml(value || '')}</span>`;
                            return;
                        }

                        element.innerHTML = `<i class="fas fa-clock" aria-hidden="true"></i> ${escapeHtml(value || '')}`;
                    });
                }
            });
        }

        const footerTelegram = Array.from(document.querySelectorAll('.footer-premium__list--contacts a, .footer .contact-list a')).find((anchor) => /telegram/i.test(anchor.textContent));
        if (footerTelegram) {
            bindings.push({
                path: 'contact.telegram',
                type: 'object',
                label: 'Telegram в подвале',
                element: footerTelegram,
                fields: [
                    { key: 'label', label: 'Подпись', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.setAttribute('href', value?.href || '#');
                        if (element.closest('.footer-premium__list--contacts')) {
                            element.textContent = value?.label || 'Telegram';
                            return;
                        }

                        element.innerHTML = `<i class="fab fa-telegram-plane" aria-hidden="true"></i> ${escapeHtml(value?.label || 'Telegram')}`;
                    });
                }
            });
        }

        const footerMax = Array.from(document.querySelectorAll('.footer-premium__list--contacts a, .footer .contact-list a')).find((anchor) => /max/i.test(anchor.textContent));
        if (footerMax) {
            bindings.push({
                path: 'contact.max',
                type: 'object',
                label: 'Max в подвале',
                element: footerMax,
                fields: [
                    { key: 'label', label: 'Подпись', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.setAttribute('href', value?.href || '#');
                        if (element.closest('.footer-premium__list--contacts')) {
                            element.textContent = value?.label || 'Max';
                            return;
                        }

                        element.innerHTML = `<i class="fas fa-comment-dots" aria-hidden="true"></i> ${escapeHtml(value?.label || 'Max')}`;
                    });
                }
            });
        }

        const footerPolicy = document.querySelector('.footer-premium__bottom p:last-child a') || document.querySelector('.footer-bottom p:last-child a');
        if (footerPolicy) {
            bindings.push({
                path: 'footer.policyLabel',
                type: 'text',
                label: 'Текст ссылки на политику',
                element: footerPolicy
            });
            bindings.push({
                path: 'footer.policyHref',
                type: 'text',
                label: 'Ссылка на политику',
                element: footerPolicy,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.setAttribute('href', value || '#');
                    });
                }
            });
        }

        if (!bindings.length) return;

        window.PokraskaQueueInlineBindings({
            fileName: 'site',
            sectionKey: 'site',
            sectionLabel: 'Шапка и контакты сайта',
            bindings
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;

        try {
            const site = await window.PokraskaContent.loadContentFile('site');
            applyHeader(site);
            applyFooter(site);
            registerInlineBindings(site);
        } catch (error) {
            console.warn('Failed to apply site content', error);
        }
    });
})();
