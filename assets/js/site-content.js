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

    function shouldHydrateShell() {
        return query.get('edit') === '1' || document.documentElement.dataset.pokraskaHydrateShell === '1';
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

    function buildCurrentLinkHref(href, currentPath) {
        try {
            const url = new URL(href || '/index.html', window.location.origin);
            const normalizedHref = normalizePath(url.pathname || '/index.html');

            if (currentPath === '/index.html' && normalizedHref === '/index.html') {
                return url.hash || '#top';
            }

            return `${url.pathname}${url.search}${url.hash}` || href || '#';
        } catch (error) {
            return href || '#';
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

    function normalizePhoneHref(href) {
        return String(href || '')
            .replace(/^tel:/i, '')
            .replace(/[^\d+]/g, '');
    }

    function isShellManagedElement(element) {
        return Boolean(
            element?.closest('.header-contact-stack, .hero-header-stack, .footer, .preview-footer, .nav-list, .hero-scene__nav')
        );
    }

    function uniqueElements(elements) {
        return Array.from(new Set((Array.isArray(elements) ? elements : []).filter(Boolean)));
    }

    function setAnchorLabelPreserveIcon(anchor, label) {
        if (!anchor) return;
        const icon = anchor.querySelector('i');
        if (!icon) {
            if (anchor.textContent !== label) {
                anchor.textContent = label;
            }
            return;
        }

        const nextLabel = label || '';
        const currentLabel = anchor.textContent.replace(/\s+/g, ' ').trim();
        if (currentLabel === nextLabel) {
            return;
        }

        anchor.textContent = '';
        anchor.appendChild(icon);
        if (nextLabel) {
            anchor.append(` ${nextLabel}`);
        }
    }

    function renderContentPhoneAnchor(anchor, phone) {
        if (!anchor || !phone) return;
        const nextHref = phone.href || '#';
        if (anchor.getAttribute('href') !== nextHref) {
            anchor.setAttribute('href', nextHref);
        }

        const text = anchor.textContent.replace(/\s+/g, ' ').trim();
        if (/позвонить|связаться/i.test(text)) {
            return;
        }

        const looksLikePhone = /^\+?[\d\s()\-]{10,}$/.test(text) || text === (phone.label || '');
        if (looksLikePhone) {
            setAnchorLabelPreserveIcon(anchor, phone.label || '');
        }
    }

    function renderPhoneElement(element, phone) {
        if (!element || !phone) return;
        if (element.classList.contains('hero-header-link')) {
            renderHeroPhoneLink(element, phone);
            return;
        }

        if (element.classList.contains('contact-phone')) {
            renderPhoneLink(element, phone);
            return;
        }

        renderContentPhoneAnchor(element, phone);
    }

    function renderContentEmailAnchor(anchor, email) {
        if (!anchor || !email) return;
        const nextHref = `mailto:${email}`;
        if (anchor.getAttribute('href') !== nextHref) {
            anchor.setAttribute('href', nextHref);
        }

        const text = anchor.textContent.replace(/\s+/g, ' ').trim();
        if (!text || text.includes('@')) {
            setAnchorLabelPreserveIcon(anchor, email);
        }
    }

    function collectContentPhoneAnchors(phone, allPhones = []) {
        if (!phone?.href) return [];

        const expectedHref = normalizePhoneHref(phone.href);
        const isSecondaryPhone = phone === allPhones[1];

        return Array.from(document.querySelectorAll('a[href^="tel:"]')).filter((anchor) => {
            if (isShellManagedElement(anchor)) return false;

            const href = normalizePhoneHref(anchor.getAttribute('href'));
            const text = anchor.textContent.replace(/\s+/g, ' ').trim();
            const hrefMatches = href === expectedHref;
            const textMatches = text === (phone.label || '');
            const actionMatches = isSecondaryPhone
                && /позвонить|связаться/i.test(text)
                && anchor.closest('.automation-product-cta, .service-cta, .payment-docs-cta__actions, .order-cta__actions');

            return hrefMatches || textMatches || actionMatches;
        });
    }

    function collectContentEmailAnchors() {
        return Array.from(document.querySelectorAll('a[href^="mailto:"]')).filter((anchor) => !isShellManagedElement(anchor));
    }

    function replaceExactContentText(needle, replacement) {
        if (!needle || !replacement || needle === replacement || !document.body) return;

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const value = node.nodeValue || '';
                    const trimmed = value.trim();
                    const parent = node.parentElement;

                    if (!trimmed || trimmed !== needle || !parent) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (parent.closest('script, style, noscript, a, .header-contact-stack, .hero-header-stack, .footer, .nav-list, .hero-scene__nav')) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const matches = [];
        while (walker.nextNode()) {
            matches.push(walker.currentNode);
        }

        matches.forEach((node) => {
            const currentValue = node.nodeValue || '';
            const trimmed = currentValue.trim();
            node.nodeValue = currentValue.replace(trimmed, replacement);
        });
    }

    function applyContentContactText(site) {
        const baseAddress = site.contact?.address || '';
        const cityAddress = baseAddress ? `Казань, ${baseAddress}` : '';
        const footerHours = site.contact?.hours || '';
        const heroHours = site.contact?.primaryPhone?.note || '';

        if (baseAddress) {
            replaceExactContentText('Старое Победилово, ул. Садовая, 72', baseAddress);
        }

        if (cityAddress) {
            replaceExactContentText('Казань, Старое Победилово, ул. Садовая, 72', cityAddress);
        }

        if (footerHours) {
            replaceExactContentText('Пн-Пт: 8:00-18:00, Сб: 9:00-14:00', footerHours);
        }

        if (heroHours) {
            replaceExactContentText('Пн-Пт 8:00-18:00, Сб 9:00-14:00', heroHours);
        }
    }

    function applyContentContacts(site) {
        const primaryPhone = site.contact?.primaryPhone;
        const secondaryPhone = site.contact?.secondaryPhone;
        const phones = [primaryPhone, secondaryPhone].filter(Boolean);

        if (primaryPhone) {
            collectContentPhoneAnchors(primaryPhone, phones).forEach((anchor) => {
                renderContentPhoneAnchor(anchor, primaryPhone);
            });
        }

        if (secondaryPhone) {
            collectContentPhoneAnchors(secondaryPhone, phones).forEach((anchor) => {
                renderContentPhoneAnchor(anchor, secondaryPhone);
            });
        }

        const email = site.contact?.email || '';
        if (email) {
            collectContentEmailAnchors().forEach((anchor) => {
                renderContentEmailAnchor(anchor, email);
            });
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

    function applyHeroNavigationItem(anchor, item, currentPath) {
        if (!anchor || !item) return;

        const nextHref = buildCurrentLinkHref(item.href || '/index.html', currentPath);
        const nextLabel = item.label || '';
        if (anchor.getAttribute('href') !== nextHref) {
            anchor.setAttribute('href', nextHref);
        }
        if (anchor.textContent !== nextLabel) {
            anchor.textContent = nextLabel;
        }

        anchor.className = 'hero-nav__link';
        const isActive = normalizePath(item.href || '/index.html') === currentPath;
        anchor.classList.toggle('hero-nav__link--active', isActive);
        if (isActive) {
            anchor.setAttribute('aria-current', 'page');
        } else {
            anchor.removeAttribute('aria-current');
        }
    }

    function syncHeroNavigation(navList, items, currentPath) {
        if (!navList) return;
        syncCollection(navList, '.hero-nav__link', Array.isArray(items) ? items : [], (anchor, item) => {
            applyHeroNavigationItem(anchor, item, currentPath);
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
        const currentPath = normalizePath(window.location.pathname);
        const homeHref = buildCurrentLinkHref(site.navigation?.[0]?.href || '/index.html', currentPath);

        document.querySelectorAll('.logo-link').forEach((link) => {
            const nextHref = homeHref;
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

        document.querySelectorAll('.hero-brand__link').forEach((link) => {
            if (link.getAttribute('href') !== homeHref) {
                link.setAttribute('href', homeHref);
            }
            const nextLabel = site.brand?.name || link.getAttribute('aria-label') || '';
            if (nextLabel && link.getAttribute('aria-label') !== nextLabel) {
                link.setAttribute('aria-label', nextLabel);
            }
        });

        document.querySelectorAll('.hero-brand__eyebrow').forEach((node) => {
            const nextTagline = site.brand?.tagline || '';
            if (node.textContent !== nextTagline) {
                node.textContent = nextTagline;
            }
        });

        document.querySelectorAll('.hero-brand__name').forEach((node) => {
            const nextBrandName = site.brand?.name || '';
            if (node.textContent !== nextBrandName) {
                node.textContent = nextBrandName;
            }
        });

        document.querySelectorAll('.hero-brand__logo').forEach((image) => {
            if (site.brand?.logo?.src && image.getAttribute('src') !== site.brand.logo.src) {
                image.setAttribute('src', site.brand.logo.src);
            }
            const nextAlt = site.brand?.logo?.alt || site.brand?.logoAlt || site.brand?.name || image.alt;
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

        const heroPhoneBlocks = document.querySelectorAll('.hero-header-stack .hero-header-link');
        if (heroPhoneBlocks[0] && primaryPhone) {
            renderHeroPhoneLink(heroPhoneBlocks[0], primaryPhone);
        }

        if (heroPhoneBlocks[1] && secondaryPhone) {
            renderHeroPhoneLink(heroPhoneBlocks[1], secondaryPhone);
        }

        document.querySelectorAll('.hero-header-address span').forEach((node) => {
            const nextAddress = site.contact?.address || '';
            if (node.textContent !== nextAddress) {
                node.textContent = nextAddress;
            }
        });

        document.querySelectorAll('.nav-list').forEach((navList) => {
            syncNavigationList(navList, site.navigation || [], currentPath);
        });
        document.querySelectorAll('.hero-scene__nav').forEach((navList) => {
            syncHeroNavigation(navList, site.navigation || [], currentPath);
        });
    }

    function applyFooter(site) {
        const legacyContactList = document.querySelector('.footer .contact-list');
        if (legacyContactList) {
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

        const previewContactList = document.querySelector('.preview-footer__list--contacts');
        if (previewContactList) {
            const fullAddress = String(site.contact?.address || '').trim().toLowerCase().startsWith('казань')
                ? site.contact?.address || ''
                : `Казань, ${site.contact?.address || ''}`;

            previewContactList.innerHTML = `
                <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${escapeHtml(fullAddress)}</li>
                <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.secondaryPhone?.href || '#')}">${escapeHtml(site.contact?.secondaryPhone?.label || '')}</a></li>
                <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.primaryPhone?.href || '#')}">${escapeHtml(site.contact?.primaryPhone?.label || '')}</a></li>
                <li><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:${escapeHtml(site.contact?.email || '')}">${escapeHtml(site.contact?.email || '')}</a></li>
                <li><i class="fas fa-clock" aria-hidden="true"></i> ${escapeHtml(site.contact?.hours || '')}</li>
                <li><i class="fab fa-telegram-plane" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.telegram?.href || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contact?.telegram?.label || 'Telegram')}</a></li>
                <li><i class="fas fa-comment-dots" aria-hidden="true"></i> <a href="${escapeHtml(site.contact?.max?.href || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contact?.max?.label || 'Max')}</a></li>
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

        const previewUsefulColumn = document.querySelector('.preview-footer__column--useful');
        if (previewUsefulColumn) {
            const title = previewUsefulColumn.querySelector('.preview-footer__label');
            const list = previewUsefulColumn.querySelector('.preview-footer__list');

            if (title) {
                title.textContent = site.footer?.usefulTitle || 'Полезное';
            }

            if (list) {
                syncCollection(list, 'li', site.footer?.usefulLinks || [], applyUsefulLinkItem);
            }
        }

        const previewCompany = document.querySelector('.preview-footer__company');
        if (previewCompany) {
            previewCompany.textContent = site.footer?.companyTitle || 'ООО «Комфорт Плюс»';
        }

        const previewCompanyColumn = document.querySelector('.preview-footer__column--company');
        if (previewCompanyColumn) {
            syncTextCollection(
                previewCompanyColumn,
                '.preview-footer__legal-text',
                Array.isArray(site.footer?.companyParagraphs) ? site.footer.companyParagraphs : []
            );
        }

        const footerBottom = document.querySelector('.footer-bottom');
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

        const previewFooterBottom = document.querySelector('.preview-footer__bottom');
        if (previewFooterBottom) {
            const paragraphs = previewFooterBottom.querySelectorAll('p');
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
        const taglineNodes = Array.from(document.querySelectorAll('.logo-tagline, .hero-brand__eyebrow'));
        if (taglineNodes.length) {
            bindings.push({
                path: 'brand.tagline',
                type: 'text',
                label: 'Слоган рядом с логотипом',
                hint: 'Короткая строка рядом с логотипом в шапке.',
                element: taglineNodes
            });
        }

        const brandNameNodes = Array.from(document.querySelectorAll('.hero-brand__name'));
        if (brandNameNodes.length) {
            bindings.push({
                path: 'brand.name',
                type: 'text',
                label: 'Название бренда в hero-шапке',
                hint: 'Большое название рядом с логотипом во внутренней шапке.',
                element: brandNameNodes
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
        const heroPhoneLinks = Array.from(document.querySelectorAll('.hero-header-stack .hero-header-link'));
        const contentPhoneElements = [
            collectContentPhoneAnchors(site.contact?.primaryPhone, [site.contact?.primaryPhone, site.contact?.secondaryPhone]),
            collectContentPhoneAnchors(site.contact?.secondaryPhone, [site.contact?.primaryPhone, site.contact?.secondaryPhone])
        ];

        const primaryPhoneElements = uniqueElements([phoneLinks[0], heroPhoneLinks[0], ...contentPhoneElements[0]]);
        if (primaryPhoneElements.length) {
            bindings.push({
                path: 'contact.primaryPhone',
                type: 'object',
                label: 'Первый телефон в шапке',
                hint: 'Номер, ссылка и подпись.',
                element: primaryPhoneElements,
                fields: [
                    { key: 'label', label: 'Номер', type: 'text' },
                    { key: 'href', label: 'Ссылка tel:', type: 'text' },
                    { key: 'note', label: 'Подпись', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        renderPhoneElement(element, value || {});
                    });
                }
            });
        }

        const secondaryPhoneElements = uniqueElements([phoneLinks[1], heroPhoneLinks[1], ...contentPhoneElements[1]]);
        if (secondaryPhoneElements.length) {
            bindings.push({
                path: 'contact.secondaryPhone',
                type: 'object',
                label: 'Второй телефон в шапке',
                hint: 'Меняет второй номер в шапке сайта.',
                element: secondaryPhoneElements,
                fields: [
                    { key: 'label', label: 'Номер', type: 'text' },
                    { key: 'href', label: 'Ссылка tel:', type: 'text' },
                    { key: 'note', label: 'Подпись', type: 'text' }
                ],
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        renderPhoneElement(element, value || {});
                    });
                }
            });
        }

        const addressNodes = Array.from(document.querySelectorAll('.header-contact-stack .contact-address span, .hero-header-address span'));
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

        const footerUsefulTitle =
            Array.from(document.querySelectorAll('.footer-column h4')).find((node) => /Полезное/i.test(node.textContent))
            || document.querySelector('.preview-footer__column--useful .preview-footer__label');
        if (footerUsefulTitle) {
            bindings.push({
                path: 'footer.usefulTitle',
                type: 'text',
                label: 'Заголовок полезных ссылок в подвале',
                element: footerUsefulTitle
            });
        }

        const usefulList =
            Array.from(document.querySelectorAll('.footer-column')).find((column) => {
                const heading = column.querySelector('h4');
                return heading && /Полезное/i.test(heading.textContent);
            })?.querySelector('ul')
            || document.querySelector('.preview-footer__column--useful .preview-footer__list');

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

        const footerEmail =
            document.querySelector('.footer .contact-list a[href^="mailto:"]')
            || document.querySelector('.preview-footer__list--contacts a[href^="mailto:"]');
        const contentEmails = collectContentEmailAnchors();
        const emailElements = uniqueElements([footerEmail, ...contentEmails]);
        if (emailElements.length) {
            bindings.push({
                path: 'contact.email',
                type: 'text',
                label: 'Почта в подвале',
                element: emailElements,
                render(value, binding) {
                    binding.elements.forEach((element) => {
                        renderContentEmailAnchor(element, value || '');
                    });
                }
            });
        }

        const footerHoursItem =
            Array.from(document.querySelectorAll('.footer .contact-list li')).find((item) => item.querySelector('.fa-clock'))
            || Array.from(document.querySelectorAll('.preview-footer__list--contacts li')).find((item) => item.querySelector('.fa-clock'));
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

        const footerTelegram =
            Array.from(document.querySelectorAll('.footer .contact-list a')).find((anchor) => /telegram/i.test(anchor.textContent))
            || Array.from(document.querySelectorAll('.preview-footer__list--contacts a')).find((anchor) => /telegram/i.test(anchor.textContent));
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

        const footerMax =
            Array.from(document.querySelectorAll('.footer .contact-list a')).find((anchor) => /max/i.test(anchor.textContent))
            || Array.from(document.querySelectorAll('.preview-footer__list--contacts a')).find((anchor) => /max/i.test(anchor.textContent));
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

        const footerPolicy =
            document.querySelector('.footer-bottom p:last-child a')
            || document.querySelector('.preview-footer__bottom p:last-child a');
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

        const footerCompanyTitle = document.querySelector('.preview-footer__company');
        if (footerCompanyTitle) {
            bindings.push({
                path: 'footer.companyTitle',
                type: 'text',
                label: 'Название компании в подвале',
                element: footerCompanyTitle
            });
        }

        const footerCompanyTexts = Array.from(document.querySelectorAll('.preview-footer__legal-text'));
        footerCompanyTexts.forEach((element, index) => {
            bindings.push({
                path: `footer.companyParagraphs.${index}`,
                type: 'text',
                label: `Текст компании в подвале ${index + 1}`,
                element
            });
        });

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
            window.POKRASKA_SITE_CONTENT = site;
            if (shouldHydrateShell()) {
                applyHeader(site);
                applyFooter(site);
            }
            applyContentContacts(site);
            applyContentContactText(site);
            registerInlineBindings(site);
            window.addEventListener('load', () => {
                applyContentContacts(site);
                applyContentContactText(site);
            }, { once: true });
        } catch (error) {
            console.warn('Failed to apply site content', error);
        }
    });
})();
