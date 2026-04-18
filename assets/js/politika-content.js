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

    function applyContactReplacements(html, site) {
        const contact = getSiteContact(site);
        const primaryPhone = contact.primaryPhone || fallbackSiteContact.primaryPhone;
        const secondaryPhone = contact.secondaryPhone || fallbackSiteContact.secondaryPhone;
        const email = contact.email || fallbackSiteContact.email;

        return String(html || '')
            .replace(/tel:\+79376154629/gi, primaryPhone.href || 'tel:+79376154629')
            .replace(/tel:\+79625542260/gi, secondaryPhone.href || 'tel:+79625542260')
            .replace(/\+7\s*\(937\)\s*615-46-29/g, primaryPhone.label || '+7 (937) 615-46-29')
            .replace(/\+7\s*\(962\)\s*554-22-60/g, secondaryPhone.label || '+7 (962) 554-22-60')
            .replace(/mailto:vorota404@mail\.ru/gi, email ? `mailto:${email}` : 'mailto:vorota404@mail.ru')
            .replace(/vorota404@mail\.ru/gi, email || 'vorota404@mail.ru');
    }

    function buildResolvedContactItems(items, site) {
        const contact = getSiteContact(site);
        const primaryPhone = contact.primaryPhone || fallbackSiteContact.primaryPhone;
        const secondaryPhone = contact.secondaryPhone || fallbackSiteContact.secondaryPhone;
        const email = contact.email || fallbackSiteContact.email;
        let phoneIndex = 0;

        return (Array.isArray(items) ? items : []).map((item) => {
            const nextItem = { ...(item || {}) };
            const href = String(nextItem.href || '').trim();

            if (href.startsWith('tel:')) {
                const phone = phoneIndex === 0 ? primaryPhone : (secondaryPhone || primaryPhone);
                phoneIndex += 1;
                nextItem.href = phone?.href || href;
                if (!nextItem.label || isPhoneLikeLabel(nextItem.label)) {
                    nextItem.label = phone?.label || nextItem.label || '';
                }
            } else if (href.startsWith('mailto:')) {
                nextItem.href = email ? `mailto:${email}` : href;
                if (!nextItem.label || isEmailLikeLabel(nextItem.label)) {
                    nextItem.label = email || nextItem.label || '';
                }
            }

            return nextItem;
        });
    }

    function buildResolvedPolitikaContent(content, site) {
        return {
            ...content,
            sections: (content?.sections || []).map((section) => ({
                ...(section || {}),
                bodyHtml: applyContactReplacements(section?.bodyHtml || '', site)
            })),
            contact: {
                ...(content?.contact || {}),
                items: buildResolvedContactItems(content?.contact?.items || [], site)
            }
        };
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

    function renderHeadingWithIcon(element, iconClass, text, tagName) {
        if (!element) return;
        const tag = tagName || element.tagName.toLowerCase();
        const wrapper = document.createElement(tag);
        const icon = document.createElement('i');
        icon.className = iconClass || '';
        wrapper.appendChild(icon);
        wrapper.append(` ${text || ''}`);
        element.innerHTML = wrapper.innerHTML;
    }

    function applyPrivacySection(section, item) {
        if (!section || !item) return;
        section.innerHTML = `
            <h2><i class="${escapeHtml(item.icon || 'fas fa-file-alt')}"></i> ${escapeHtml(item.title || '')}</h2>
            ${item.bodyHtml || ''}
        `.trim();
    }

    function syncPrivacySections(items) {
        const container = document.querySelector('.privacy-content');
        if (!container) return;
        const nodes = Array.from(container.querySelectorAll('.section'));
        if (!nodes.length) return;

        const safeItems = Array.isArray(items) ? items : [];
        const template = nodes[0];
        const anchor = container.querySelector('.contact-block') || container.querySelector('.privacy-back');

        while (container.querySelectorAll('.section').length < safeItems.length) {
            const clone = template.cloneNode(true);
            resetInlineMarkers(clone);
            clone.hidden = false;
            container.insertBefore(clone, anchor || null);
        }

        const nextNodes = Array.from(container.querySelectorAll('.section'));
        nextNodes.forEach((node, index) => {
            const item = safeItems[index];
            node.hidden = !item;
            if (item) {
                applyPrivacySection(node, item, index);
            }
        });
    }

    function applyContactItem(node, item) {
        if (!node || !item) return;
        const isLink = item.mode !== 'text' && Boolean(item.href);
        node.innerHTML = isLink
            ? `<i class="${escapeHtml(item.icon || '')}"></i><a href="${escapeHtml(item.href || '#')}">${escapeHtml(item.label || '')}</a>`
            : `<i class="${escapeHtml(item.icon || '')}"></i><span>${escapeHtml(item.label || '')}</span>`;
    }

    function syncContactItems(items) {
        const container = document.querySelector('.contact-block .contact-info');
        if (!container) return;
        syncCollection(container, '.contact-item', items, applyContactItem);
    }

    function applyBackButton(anchor, item) {
        if (!anchor || !item) return;
        anchor.setAttribute('href', item.href || '#');
        anchor.innerHTML = `<i class="${escapeHtml(item.icon || 'fas fa-arrow-left')}"></i> ${escapeHtml(item.label || '')}`;
    }

    function applyPolicyContent(content) {
        const header = document.querySelector('.privacy-header');
        if (header) {
            const title = header.querySelector('h1');
            const date = header.querySelector('.date');
            const intro = Array.from(header.querySelectorAll('p')).find((node) => !node.classList.contains('date'));

            if (title) {
                title.innerHTML = `<i class="${escapeHtml(content.header?.icon || 'fas fa-shield-alt')}"></i> ${escapeHtml(content.header?.title || '')}`;
            }

            if (date) {
                date.innerHTML = `${escapeHtml(content.header?.dateLabel || 'Дата последнего обновления:')} <strong>${escapeHtml(content.header?.dateValue || '')}</strong>`;
            }

            if (intro) {
                intro.innerHTML = content.header?.introHtml || '';
            }
        }

        syncPrivacySections(content.sections || []);

        const contactBlock = document.querySelector('.contact-block');
        if (contactBlock) {
            const title = contactBlock.querySelector('h3');
            const lead = Array.from(contactBlock.querySelectorAll('p')).find((node) => !node.classList.contains('contact-response-note'));
            const response = contactBlock.querySelector('.contact-response-note');

            if (title) {
                title.innerHTML = `<i class="${escapeHtml(content.contact?.icon || 'fas fa-headset')}"></i> ${escapeHtml(content.contact?.title || '')}`;
            }
            if (lead) {
                lead.textContent = content.contact?.lead || '';
            }
            syncContactItems(content.contact?.items || []);
            if (response) {
                response.innerHTML = `<i class="${escapeHtml(content.contact?.responseNoteIcon || 'fas fa-clock')}"></i> ${escapeHtml(content.contact?.responseNote || '')}`;
            }
        }

        const backButton = document.querySelector('.privacy-back .back-btn');
        if (backButton) {
            applyBackButton(backButton, content.back || {});
        }
    }

    function registerInlineBindings() {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
        const header = document.querySelector('.privacy-header');
        if (header) {
            const title = header.querySelector('h1');
            const dateStrong = header.querySelector('.date strong');
            const intro = Array.from(header.querySelectorAll('p')).find((node) => !node.classList.contains('date'));

            if (title) {
                bindings.push({
                    path: 'header.title',
                    type: 'text',
                    label: 'Заголовок страницы политики',
                    element: title,
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            element.innerHTML = `<i class="fas fa-shield-alt"></i> ${escapeHtml(value || '')}`;
                        });
                    }
                });
            }

            if (dateStrong) {
                bindings.push({
                    path: 'header.dateValue',
                    type: 'text',
                    label: 'Дата обновления политики',
                    element: dateStrong
                });
            }

            if (intro) {
                bindings.push({
                    path: 'header.introHtml',
                    type: 'html',
                    label: 'Вступительный текст политики',
                    hint: 'Можно использовать <strong> и другие простые HTML-теги.',
                    element: intro,
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            element.innerHTML = value || '';
                        });
                    }
                });
            }
        }

        const buildSectionBinding = (targetSection, index) => ({
            path: `sections.${index}`,
            type: 'object',
            editorKindLabel: 'Раздел на странице',
            label: `Раздел политики ${index + 1}`,
            element: targetSection,
            collectionPath: 'sections',
            collectionItemFactory(nextIndex) {
                const nextSection = document.querySelectorAll('.privacy-content .section')[nextIndex];
                if (!nextSection) return null;
                return buildSectionBinding(nextSection, nextIndex);
            },
            collectionCreateValue() {
                return {
                    icon: 'fas fa-file-alt',
                    title: 'Новый раздел',
                    bodyHtml: '<p>Новый текст раздела.</p>'
                };
            },
            fields: [
                { key: 'title', label: 'Заголовок раздела', type: 'text' },
                { key: 'bodyHtml', label: 'Основной текст / HTML', type: 'html' }
            ],
            collectionRender(items) {
                syncPrivacySections(Array.isArray(items) ? items : []);
            },
            render(value) {
                applyPrivacySection(targetSection, value || {});
            }
        });

        document.querySelectorAll('.privacy-content .section').forEach((sectionElement, index) => {
            bindings.push(buildSectionBinding(sectionElement, index));
        });

        const contactBlock = document.querySelector('.contact-block');
        if (contactBlock) {
            const title = contactBlock.querySelector('h3');
            const lead = Array.from(contactBlock.querySelectorAll('p')).find((node) => !node.classList.contains('contact-response-note'));
            const response = contactBlock.querySelector('.contact-response-note');

            if (title) {
                bindings.push({
                    path: 'contact.title',
                    type: 'text',
                    label: 'Заголовок контактного блока политики',
                    element: title,
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            element.innerHTML = `<i class="fas fa-headset"></i> ${escapeHtml(value || '')}`;
                        });
                    }
                });
            }

            if (lead) {
                bindings.push({
                    path: 'contact.lead',
                    type: 'textarea',
                    label: 'Описание контактного блока политики',
                    element: lead
                });
            }

            if (response) {
                bindings.push({
                    path: 'contact.responseNote',
                    type: 'text',
                    label: 'Примечание о сроке ответа',
                    element: response,
                    render(value, binding) {
                        binding.elements.forEach((element) => {
                            element.innerHTML = `<i class="fas fa-clock"></i> ${escapeHtml(value || '')}`;
                        });
                    }
                });
            }

            const buildContactItemBinding = (targetItem, index) => ({
                path: `contact.items.${index}`,
                type: 'object',
                editorKindLabel: 'Контакт на странице',
                label: `Контакт в политике ${index + 1}`,
                element: targetItem,
                collectionPath: 'contact.items',
                collectionItemFactory(nextIndex) {
                    const nextItem = document.querySelectorAll('.contact-block .contact-item')[nextIndex];
                    if (!nextItem) return null;
                    return buildContactItemBinding(nextItem, nextIndex);
                },
                collectionCreateValue() {
                    return {
                        icon: 'fas fa-phone',
                        label: 'Новый контакт',
                        href: ''
                    };
                },
                fields: [
                    { key: 'icon', label: 'Иконка', type: 'text' },
                    { key: 'label', label: 'Текст', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' }
                ],
                collectionRender(items) {
                    syncContactItems(Array.isArray(items) ? items : []);
                },
                render(value) {
                    applyContactItem(targetItem, value || {});
                }
            });

            document.querySelectorAll('.contact-block .contact-item').forEach((itemElement, index) => {
                bindings.push(buildContactItemBinding(itemElement, index));
            });
        }

        const backButton = document.querySelector('.privacy-back .back-btn');
        if (backButton) {
            bindings.push({
                path: 'back',
                type: 'object',
                label: 'Кнопка назад на странице политики',
                editorKindLabel: 'Кнопка на странице',
                element: backButton,
                fields: [
                    { key: 'label', label: 'Текст кнопки', type: 'text' },
                    { key: 'href', label: 'Ссылка', type: 'text' },
                    { key: 'icon', label: 'Иконка', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => applyBackButton(element, value || {}));
                }
            });
        }

        if (!bindings.length) return;

        queueInlineBindings({
            fileName: 'politika',
            sectionKey: 'politika',
            sectionLabel: 'Политика конфиденциальности',
            bindings
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!window.PokraskaContent?.loadContentFile) return;
        if (!document.querySelector('.privacy-page')) return;

        try {
            const [content, site] = await Promise.all([
                window.PokraskaContent.loadContentFile('politika'),
                loadSiteShellData()
            ]);
            const resolvedContent = buildResolvedPolitikaContent(content || {}, site);
            applyPolicyContent(resolvedContent);
            registerInlineBindings();
        } catch (error) {
            console.warn('Failed to apply privacy policy content', error);
        }
    });
})();
