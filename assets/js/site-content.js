(function() {
    const query = new URLSearchParams(window.location.search);
    const INLINE_EDITOR_VERSION = '20260329-inline-split-actions';

    function shouldLoadInlineEditor() {
        return query.get('edit') === '1'
            || ['localhost', '127.0.0.1'].includes(window.location.hostname)
            || window.location.port === '4173';
    }

    function ensureInlineEditor() {
        if (!shouldLoadInlineEditor()) return;
        if (document.querySelector('script[data-pokraska-inline-editor]')) return;

        const base = (window.PokraskaContent?.baseUrl || '').replace(/\/+$/, '');
        const freshToken = (query.get('fresh') || query.get('v') || '').trim();
        const version = freshToken
            ? `${INLINE_EDITOR_VERSION}-${freshToken}`
            : INLINE_EDITOR_VERSION;
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
        element.textContent = value || '';
    }

    function syncTextCollection(container, itemSelector, items) {
        if (!container) return;
        syncCollection(container, itemSelector, Array.isArray(items) ? items : [], (element, value) => {
            applyTextItem(element, value);
        });
    }

    function renderPhoneLink(anchor, phone) {
        if (!anchor || !phone) return;
        anchor.setAttribute('href', phone.href || '#');
        const number = anchor.querySelector('.phone-number');
        const note = anchor.querySelector('.phone-label');

        if (number) number.textContent = phone.label || '';
        if (note) {
            note.textContent = phone.note || '';
            note.hidden = !phone.note;
        }
    }

    function updateAnchorWithIcon(anchor, item) {
        if (!anchor || !item) return;
        const icon = anchor.querySelector('i');
        anchor.setAttribute('href', item.href || '#');

        if (icon) {
            if (item.icon) {
                icon.className = item.icon;
            }
            anchor.textContent = '';
            anchor.appendChild(icon);
            anchor.append(` ${item.label || ''}`);
        } else {
            anchor.textContent = item.label || '';
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
            link.setAttribute('href', site.navigation?.[0]?.href || '/index.html');
        });

        document.querySelectorAll('.logo-tagline').forEach((node) => {
            node.textContent = site.brand?.tagline || '';
        });

        document.querySelectorAll('.logo-image').forEach((image) => {
            image.alt = site.brand?.logoAlt || image.alt;
        });

        const headerPhoneBlocks = document.querySelectorAll('.header-contact-stack .contact-phone');
        const primaryPhone = site.contact?.primaryPhone;
        const secondaryPhone = site.contact?.secondaryPhone;

        if (headerPhoneBlocks[0] && primaryPhone) {
            headerPhoneBlocks[0].setAttribute('href', primaryPhone.href || '#');
            const number = headerPhoneBlocks[0].querySelector('.phone-number');
            const note = headerPhoneBlocks[0].querySelector('.phone-label');
            if (number) number.textContent = primaryPhone.label || '';
            if (note) note.textContent = primaryPhone.note || '';
        }

        if (headerPhoneBlocks[1] && secondaryPhone) {
            headerPhoneBlocks[1].setAttribute('href', secondaryPhone.href || '#');
            const number = headerPhoneBlocks[1].querySelector('.phone-number');
            const note = headerPhoneBlocks[1].querySelector('.phone-label');
            if (number) number.textContent = secondaryPhone.label || '';
            if (note) note.textContent = secondaryPhone.note || '';
        }

        const addressNode = document.querySelector('.header-contact-stack .contact-address span');
        if (addressNode) {
            addressNode.textContent = site.contact?.address || '';
        }

        const currentPath = normalizePath(window.location.pathname);
        document.querySelectorAll('.nav-list').forEach((navList) => {
            syncNavigationList(navList, site.navigation || [], currentPath);
        });
    }

    function applyFooter(site) {
        const footerCompany = document.querySelector('.footer-column--company');
        if (footerCompany) {
            const title = footerCompany.querySelector('h4');
            const paragraphs = footerCompany;

            if (title) {
                title.textContent = site.footer?.companyTitle || '';
            }

            if (paragraphs) {
                syncTextCollection(paragraphs, ':scope > p', site.footer?.companyParagraphs || []);
            }
        }

        const contactList = document.querySelector('.footer .contact-list');
        if (contactList) {
            contactList.innerHTML = `
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

        const footerBottom = document.querySelector('.footer-bottom');
        if (footerBottom) {
            const paragraphs = footerBottom.querySelectorAll('p');
            if (paragraphs[0]) {
                paragraphs[0].innerHTML = `&copy; ${escapeHtml(site.brand?.copyrightStartYear || 2014)}-<span id="currentYear"></span> ${escapeHtml(site.brand?.footerCaption || '')}`;
            }

            if (paragraphs[1]) {
                paragraphs[1].innerHTML = `<a href="${escapeHtml(site.footer?.policyHref || '/politika.html')}">${escapeHtml(site.footer?.policyLabel || 'Политика конфиденциальности')}</a> | Домен: ${escapeHtml(site.brand?.domain || '')}`;
            }
        }

        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
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

        const footerCompanyTitle = document.querySelector('.footer-column--company h4');
        if (footerCompanyTitle) {
            bindings.push({
                path: 'footer.companyTitle',
                type: 'text',
                label: 'Название компании в подвале',
                element: footerCompanyTitle
            });
        }

        const footerCompany = document.querySelector('.footer-column--company');
        if (footerCompany) {
            const paragraphContainer = footerCompany;
            bindings.push({
                path: 'footer.companyParagraphs',
                type: 'list',
                label: 'Описание компании в подвале',
                hint: 'Каждый абзац с новой строки.',
                element: footerCompany,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        syncTextCollection(element, ':scope > p', Array.isArray(value) ? value : []);
                    });
                }
            });
            if (paragraphContainer) {
                paragraphContainer.querySelectorAll(':scope > p').forEach((paragraph, index) => {
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
                            const nextParagraph = paragraphContainer.querySelectorAll(':scope > p')[nextIndex];
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
                            syncTextCollection(paragraphContainer, ':scope > p', Array.isArray(items) ? items : []);
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

        const footerEmail = document.querySelector('.footer .contact-list a[href^="mailto:"]');
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

        const footerHoursItem = Array.from(document.querySelectorAll('.footer .contact-list li')).find((item) => item.querySelector('.fa-clock'));
        if (footerHoursItem) {
            bindings.push({
                path: 'contact.hours',
                type: 'text',
                label: 'Режим работы в подвале',
                element: footerHoursItem,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        element.innerHTML = `<i class="fas fa-clock" aria-hidden="true"></i> ${escapeHtml(value || '')}`;
                    });
                }
            });
        }

        const footerTelegram = Array.from(document.querySelectorAll('.footer .contact-list a')).find((anchor) => /telegram/i.test(anchor.textContent));
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
                        element.innerHTML = `<i class="fab fa-telegram-plane" aria-hidden="true"></i> ${escapeHtml(value?.label || 'Telegram')}`;
                    });
                }
            });
        }

        const footerMax = Array.from(document.querySelectorAll('.footer .contact-list a')).find((anchor) => /max/i.test(anchor.textContent));
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
                        element.innerHTML = `<i class="fas fa-comment-dots" aria-hidden="true"></i> ${escapeHtml(value?.label || 'Max')}`;
                    });
                }
            });
        }

        const footerPolicy = document.querySelector('.footer-bottom p:last-child a');
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
