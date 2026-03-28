(function() {
    function shouldLoadInlineEditor() {
        const query = new URLSearchParams(window.location.search);
        return query.get('edit') === '1'
            || ['localhost', '127.0.0.1'].includes(window.location.hostname)
            || window.location.port === '4173';
    }

    function ensureInlineEditor() {
        if (!shouldLoadInlineEditor()) return;
        if (document.querySelector('script[data-pokraska-inline-editor]')) return;

        const base = (window.PokraskaContent?.baseUrl || '').replace(/\/+$/, '');
        const script = document.createElement('script');
        script.defer = true;
        script.dataset.pokraskaInlineEditor = '1';
        script.src = `${base || ''}/assets/js/inline-editor.js?v=20260328-inline-mvp`;
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
            const links = navList.querySelectorAll('a');
            links.forEach((anchor, index) => {
                const item = site.navigation?.[index];
                if (!item) return;

                updateAnchorWithIcon(anchor, item);

                const isActive = normalizePath(item.href || '/index.html') === currentPath;
                anchor.classList.toggle('active', isActive);
                if (isActive) {
                    anchor.setAttribute('aria-current', 'page');
                } else {
                    anchor.removeAttribute('aria-current');
                }
            });
        });
    }

    function applyFooter(site) {
        const footerCompany = document.querySelector('.footer-column--company');
        if (footerCompany) {
            const title = footerCompany.querySelector('h4');
            const paragraphs = footerCompany.querySelectorAll('p');

            if (title) {
                title.textContent = site.footer?.companyTitle || '';
            }

            paragraphs.forEach((paragraph, index) => {
                paragraph.textContent = site.footer?.companyParagraphs?.[index] || '';
            });
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
                list.innerHTML = (site.footer?.usefulLinks || []).map((item) => `
                    <li><a href="${escapeHtml(item.href || '#')}">${escapeHtml(item.label || '')}</a></li>
                `).join('');
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

    function registerInlineBindings() {
        if (!window.PokraskaQueueInlineBindings) return;

        const bindings = [];
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
            bindings.push({
                path: 'footer.companyParagraphs',
                type: 'list',
                label: 'Описание компании в подвале',
                hint: 'Каждый абзац с новой строки.',
                element: footerCompany,
                render(value, binding) {
                    const paragraphs = Array.isArray(value) ? value : [];
                    binding.elements.forEach((element) => {
                        const nodes = Array.from(element.querySelectorAll('p'));
                        nodes.forEach((node, index) => {
                            node.textContent = paragraphs[index] || '';
                        });
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
            registerInlineBindings();
        } catch (error) {
            console.warn('Failed to apply site content', error);
        }
    });
})();
