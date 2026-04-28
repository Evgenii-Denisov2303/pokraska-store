(function() {
    const query = new URLSearchParams(window.location.search);
    const INLINE_EDITOR_MIN_WIDTH = 641;
    const INLINE_EDITOR_MIN_HEIGHT = 560;
    const supportsInlineEditorViewport = window.innerWidth >= INLINE_EDITOR_MIN_WIDTH
        && window.innerHeight >= INLINE_EDITOR_MIN_HEIGHT;
    const wantsInlineEditor = supportsInlineEditorViewport && (Boolean(window.POKRASKA_INLINE_EDITOR_ENABLED)
        || query.get('edit') === '1'
        || ['localhost', '127.0.0.1'].includes(window.location.hostname)
        || window.location.port === '4173');

    if (!wantsInlineEditor || window.POKRASKA_INLINE_SITE_BOOTSTRAP_READY) {
        return;
    }

    window.POKRASKA_INLINE_SITE_BOOTSTRAP_READY = true;

    const INLINE_THEME_ID = 'pokraska-inline-editor-theme';
    const INLINE_CONTENT_FILE = 'inline-pages';
    const INLINE_UPLOAD_DIR = 'assets/images/editor';
    const GENERIC_TEXT_SELECTOR = 'h1, h2, h3, p, li, blockquote, figcaption, dt, dd, summary, .faq-card__question';
    const GENERIC_IMAGE_SELECTOR = 'img';
    const GENERIC_ACTION_SELECTOR = [
        'a[class*="btn"]',
        'button[class*="btn"]',
        'a[class*="button"]',
        'button[class*="button"]',
        '.home-tail__contact-link',
        '.hero-link',
        '.mini-action'
    ].join(', ');
    const TEXT_TAG_LABELS = {
        H1: 'Главный заголовок',
        H2: 'Заголовок блока',
        H3: 'Подзаголовок',
        P: 'Текст',
        LI: 'Пункт списка',
        BLOCKQUOTE: 'Цитата',
        FIGCAPTION: 'Подпись',
        DT: 'Термин',
        DD: 'Описание',
        SUMMARY: 'Вопрос',
        BUTTON: 'Вопрос'
    };
    const REPETITIVE_CARD_SELECTORS = [
        '.catalog-card',
        '.catalog-panel',
        '.catalog-info-card',
        '.catalog-palette-card',
        '.price-card',
        '.service-card',
        '.service-detail-card',
        '.process-card',
        '.automation-product-card',
        '.automation-product__card',
        '.gallery-card',
        '.gallery-item',
        '.faq-item',
        '.faq-card',
        '.preview-footer__column',
        '.palette-card',
        '.before-after-section'
    ];
    const LEAD_TEXT_SELECTORS = [
        '.services-header__subtitle',
        '.page-hero__subtitle',
        '.page-header__subtitle',
        '.catalog-nav-intro__copy',
        '.order-sheet__lead',
        '.payment-docs-overview__lead p',
        '.price-summary__lead p',
        '.price-summary__intro p',
        '.service-card__lead',
        '.process-card__lead',
        '.faq-section__intro p'
    ];
    const PROMINENT_IMAGE_SELECTORS = [
        '.service-media',
        '.price-cta',
        '.compare-card',
        '.gallery-stage',
        '.automation-product__hero',
        '.catalog-panel__media',
        '.catalog-panel__visual',
        '.order-sheet',
        '.payment-docs-overview'
    ];
    const SECONDARY_IMAGE_SELECTORS = [
        '.gallery-card',
        '.catalog-card',
        '.catalog-panel__thumb',
        '.catalog-panel__gallery',
        '.faq-card'
    ];
    const COMPOSED_MODULE_SELECTORS = [
        '.order-cta',
        '.catalog-assistant',
        '.gallery-filter-shell',
        '.gallery-item',
        '.hero-copy',
        '.statement-scene',
        '.panel-scene__card',
        '.route-scene',
        '.reviews-scene',
        '.home-tail__section--brands',
        '.home-tail__request',
        '.catalog-hero',
        '.catalog-sidebar',
        '.catalog-panel__header',
        '.automation-product-card',
        '.pricing-playbook',
        '.pricing-estimate-card',
        '.pricing-clarity',
        '.payment-order-sheet',
        '.payment-docs-kit',
        '.payment-route',
        '.contacts-panel--direct',
        '.contacts-panel--route-copy',
        '.catalog-panel',
        '.catalog-palette-card',
        '.service-detail-card',
        '.palette-card--standalone',
        '.before-after-section--sandblast'
    ];
    const inlineBindingCounters = window.POKRASKA_INLINE_BOOTSTRAP_COUNTERS || (window.POKRASKA_INLINE_BOOTSTRAP_COUNTERS = {
        text: 0,
        image: 0,
        action: 0,
        faq: 0
    });

    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
            return;
        }
        callback();
    }

    function toArray(value) {
        return Array.isArray(value) ? value : [value];
    }

    function uniqueElements(elements) {
        return Array.from(new Set(elements.filter((element) => element instanceof HTMLElement)));
    }

    function sortElementsByVisibility(elements) {
        return [...elements].sort((left, right) => {
            const leftVisible = isElementVisible(left) ? 1 : 0;
            const rightVisible = isElementVisible(right) ? 1 : 0;
            return rightVisible - leftVisible;
        });
    }

    function selectMany(selectors) {
        return sortElementsByVisibility(uniqueElements(
            selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)))
        ));
    }

    function registerInlineSection(section) {
        const nextSection = {
            ...section,
            bindings: toArray(section?.bindings || []).filter(Boolean)
        };

        if (!nextSection.bindings.length) return;

        if (window.PokraskaInlineEditor?.register) {
            window.PokraskaInlineEditor.register(nextSection);
            return;
        }

        window.PokraskaInlineEditorQueue = window.PokraskaInlineEditorQueue || [];
        window.PokraskaInlineEditorQueue.push(nextSection);
    }

    function normalizeText(value) {
        return String(value ?? '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function truncate(value, maxLength) {
        const normalized = normalizeText(value);
        if (normalized.length <= maxLength) return normalized;
        return `${normalized.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
    }

    function prettifyPageKey(value) {
        return String(value || '')
            .split('-')
            .filter(Boolean)
            .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
            .join(' ');
    }

    function resolvePageMeta() {
        const rawPath = String(window.location.pathname || '/').replace(/\\/g, '/');
        const normalizedPath = rawPath === '/' ? '/index.html' : rawPath;
        const fileName = normalizedPath.split('/').pop() || 'index.html';
        const baseName = fileName.replace(/\.html$/i, '') || 'index';
        const key = baseName === 'index' ? 'home' : baseName.toLowerCase();
        const titlePart = normalizeText((document.title || '').split('|')[0]);

        return {
            key,
            label: titlePart || prettifyPageKey(key),
            path: normalizedPath
        };
    }

    function injectInlineTheme() {
        if (document.getElementById(INLINE_THEME_ID)) return;

        const style = document.createElement('style');
        style.id = INLINE_THEME_ID;
        style.textContent = `
            :root {
                --p-inline-accent: #67849b;
                --p-inline-accent-strong: #4f687c;
                --p-inline-accent-rgb: 103, 132, 155;
                --p-inline-surface: rgba(252, 248, 241, 0.98);
                --p-inline-surface-soft: #f5eee4;
                --p-inline-line: rgba(79, 104, 124, 0.16);
                --p-inline-text: #21303a;
                --p-inline-muted: #6b746e;
                --p-inline-shadow: 0 24px 54px rgba(27, 34, 40, 0.12);
                --p-inline-shadow-soft: 0 18px 38px rgba(27, 34, 40, 0.08);
            }

            body.p-inline-mode [data-inline-edit-id] {
                border-radius: 16px;
                outline-color: rgba(var(--p-inline-accent-rgb), 0.32);
                outline-offset: 5px;
                background-color: rgba(var(--p-inline-accent-rgb), 0.032);
                box-shadow: 0 0 0 1px rgba(var(--p-inline-accent-rgb), 0.14) inset;
            }

            body.p-inline-mode [data-inline-edit-id]:hover,
            body.p-inline-mode [data-inline-edit-id].p-inline-active,
            body.p-inline-mode .p-inline-hover-target,
            body.p-inline-mode .p-inline-active-target {
                outline-color: rgba(var(--p-inline-accent-rgb), 0.78);
                background-color: rgba(var(--p-inline-accent-rgb), 0.05);
                box-shadow:
                    0 0 0 1px rgba(var(--p-inline-accent-rgb), 0.2) inset,
                    0 0 0 8px rgba(var(--p-inline-accent-rgb), 0.12);
            }

            body.p-inline-mode [data-inline-edit-id].p-inline-active,
            body.p-inline-mode .p-inline-active-target {
                outline-color: rgba(var(--p-inline-accent-rgb), 0.92);
                background-color: rgba(var(--p-inline-accent-rgb), 0.08);
                box-shadow:
                    0 0 0 1px rgba(var(--p-inline-accent-rgb), 0.28) inset,
                    0 0 0 10px rgba(var(--p-inline-accent-rgb), 0.15);
            }

            [data-inline-action-style="primary"] {
                border-color: rgba(var(--p-inline-accent-rgb), 0.28) !important;
                background: linear-gradient(135deg, var(--p-inline-accent) 0%, var(--p-inline-accent-strong) 100%) !important;
                color: #fff !important;
                box-shadow: 0 16px 30px rgba(var(--p-inline-accent-rgb), 0.2) !important;
            }

            [data-inline-action-style="secondary"] {
                border-color: rgba(var(--p-inline-accent-rgb), 0.16) !important;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(246, 240, 232, 0.9)) !important;
                color: var(--p-inline-text) !important;
                box-shadow: 0 12px 24px rgba(27, 34, 40, 0.08) !important;
            }

            [data-inline-action-style="outline"] {
                border-color: rgba(var(--p-inline-accent-rgb), 0.34) !important;
                background: rgba(255, 255, 255, 0.54) !important;
                color: var(--p-inline-accent-strong) !important;
                box-shadow: inset 0 0 0 1px rgba(var(--p-inline-accent-rgb), 0.08) !important;
            }

            .p-inline-launcher {
                border: 1px solid rgba(255, 255, 255, 0.72);
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 238, 228, 0.96));
                color: var(--p-inline-text);
                box-shadow: var(--p-inline-shadow-soft);
            }

            .p-inline-launcher:hover:not(:disabled) {
                border-color: rgba(var(--p-inline-accent-rgb), 0.22);
                box-shadow: 0 20px 42px rgba(27, 34, 40, 0.12);
                transform: translateY(-1px);
            }

            .p-inline-toolbar {
                background:
                    linear-gradient(135deg, rgba(41, 58, 72, 0.97), rgba(63, 90, 112, 0.95));
                border: 1px solid rgba(255, 255, 255, 0.12);
                box-shadow: 0 22px 44px rgba(23, 30, 36, 0.22);
            }

            .p-inline-toolbar__eyebrow,
            .p-inline-panel__kicker {
                color: rgba(244, 238, 229, 0.78);
                letter-spacing: 0.12em;
            }

            .p-inline-toolbar__title {
                color: #fcfaf5;
                font-size: 18px;
                letter-spacing: -0.02em;
            }

            .p-inline-toolbar__meta {
                color: rgba(241, 235, 226, 0.8);
            }

            .p-inline-toolbar__btn,
            .p-inline-panel__btn {
                border-radius: 16px;
                border-color: var(--p-inline-line);
                transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;
            }

            .p-inline-toolbar__btn {
                background: rgba(255, 255, 255, 0.08);
                color: #f8f5ef;
                border-color: rgba(255, 255, 255, 0.14);
            }

            .p-inline-toolbar__btn:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.14);
                border-color: rgba(255, 255, 255, 0.24);
            }

            .p-inline-toolbar__btn--primary,
            .p-inline-panel__btn--primary,
            .p-inline-panel__btn--primary.is-idle,
            .p-inline-panel__btn--primary.is-active {
                color: #fbf8f2;
                border-color: rgba(255, 255, 255, 0.08);
                background: linear-gradient(135deg, var(--p-inline-accent) 0%, var(--p-inline-accent-strong) 100%);
                box-shadow: 0 14px 28px rgba(var(--p-inline-accent-rgb), 0.2);
            }

            .p-inline-panel__btn,
            .p-inline-panel__back,
            .p-inline-panel__close,
            .p-inline-overview__close,
            .p-inline-auth-modal__close {
                color: var(--p-inline-text);
            }

            .p-inline-panel__btn:hover:not(:disabled),
            .p-inline-panel__back:hover:not(:disabled),
            .p-inline-panel__close:hover:not(:disabled),
            .p-inline-overview__close:hover:not(:disabled),
            .p-inline-auth-modal__close:hover:not(:disabled) {
                transform: translateY(-1px);
            }

            .p-inline-panel,
            .p-inline-overview,
            .p-inline-auth-modal__dialog {
                background:
                    radial-gradient(circle at top right, rgba(var(--p-inline-accent-rgb), 0.08), transparent 24%),
                    linear-gradient(180deg, rgba(255, 255, 255, 0.985), rgba(247, 241, 232, 0.985));
                border: 1px solid rgba(255, 255, 255, 0.74);
                box-shadow: var(--p-inline-shadow);
            }

            .p-inline-panel__title,
            .p-inline-overview__title,
            .p-inline-auth-modal__title {
                color: var(--p-inline-text);
                letter-spacing: -0.02em;
            }

            .p-inline-toolbar__notice {
                display: block;
                padding: 12px 14px;
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.12);
                color: rgba(248, 245, 239, 0.9);
                line-height: 1.45;
            }

            .p-inline-panel__meta,
            .p-inline-overview__meta,
            .p-inline-auth-modal__meta,
            .p-inline-panel__status-meta,
            .p-inline-panel__section-meta,
            .p-inline-panel__accordion-meta,
            .p-inline-panel__hint,
            .p-inline-panel__upload-meta,
            .p-inline-overview__summary-hint,
            .p-inline-overview__item-meta {
                color: var(--p-inline-muted);
            }

            .p-inline-panel__status,
            .p-inline-panel__section,
            .p-inline-panel__group,
            .p-inline-panel__accordion,
            .p-inline-overview__summary,
            .p-inline-overview__filter,
            .p-inline-overview__item,
            .p-inline-panel__collection-item,
            .p-inline-panel__upload-zone,
            .p-inline-panel__style-option,
            .p-inline-panel__example-chip,
            .p-inline-panel__object-preview-card,
            .p-inline-panel__action-preview {
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(246, 238, 229, 0.94));
                border-color: var(--p-inline-line);
            }

            .p-inline-overview__filter--active,
            .p-inline-overview__item--active,
            .p-inline-panel__collection-item.is-active,
            .p-inline-panel__style-option.is-active,
            .p-inline-panel__example-chip.is-active {
                border-color: rgba(var(--p-inline-accent-rgb), 0.34);
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(230, 238, 244, 0.94));
                box-shadow: 0 12px 24px rgba(27, 34, 40, 0.08);
            }

            .p-inline-panel__control,
            .p-inline-panel__textarea,
            .p-inline-overview__search,
            .p-inline-panel__icon-search,
            .p-inline-auth-modal__input {
                background: rgba(255, 255, 255, 0.86);
                border-color: rgba(79, 104, 124, 0.18);
                color: var(--p-inline-text);
            }

            .p-inline-panel__control:focus,
            .p-inline-panel__textarea:focus,
            .p-inline-overview__search:focus,
            .p-inline-panel__icon-search:focus,
            .p-inline-auth-modal__input:focus {
                border-color: rgba(var(--p-inline-accent-rgb), 0.36);
                box-shadow: 0 0 0 4px rgba(var(--p-inline-accent-rgb), 0.12);
            }

            .p-inline-overview__search-clear,
            .p-inline-panel__preview-nav,
            .p-inline-panel__icon-option-symbol,
            .p-inline-panel__icon-preview-badge,
            .p-inline-panel__object-preview-icon,
            .p-inline-panel__style-badge--primary,
            .p-inline-panel__action-preview-button--primary {
                background: rgba(var(--p-inline-accent-rgb), 0.12);
                color: var(--p-inline-accent-strong);
            }

            .p-inline-panel__style-badge--secondary,
            .p-inline-panel__action-preview-button--secondary,
            .p-inline-panel__object-preview-card--secondary {
                background: rgba(255, 255, 255, 0.82);
                color: #567089;
                border-color: rgba(79, 104, 124, 0.18);
            }

            .p-inline-panel__style-badge--outline,
            .p-inline-panel__action-preview-button--outline,
            .p-inline-panel__object-preview-card--outline {
                background: rgba(249, 243, 235, 0.72);
                color: var(--p-inline-text);
                border-color: rgba(79, 104, 124, 0.16);
            }

            .p-inline-toast {
                border-radius: 16px;
                background:
                    linear-gradient(135deg, rgba(41, 58, 72, 0.96), rgba(63, 90, 112, 0.94));
                border: 1px solid rgba(255, 255, 255, 0.12);
                color: #fbf8f2;
                box-shadow: 0 18px 34px rgba(20, 28, 34, 0.22);
            }

            .p-inline-hover {
                border-radius: 12px;
                background: rgba(34, 48, 58, 0.94);
                color: #faf7f1;
                border: 1px solid rgba(255, 255, 255, 0.12);
                box-shadow: 0 14px 28px rgba(20, 28, 34, 0.2);
            }
        `;

        document.head.appendChild(style);
    }

    function refreshInlineChrome() {
        const launcherLabel = document.querySelector('.p-inline-launcher span');
        if (launcherLabel) {
            launcherLabel.textContent = 'Редактировать сайт';
        }

        const toolbarEyebrow = document.querySelector('.p-inline-toolbar__eyebrow');
        if (toolbarEyebrow) {
            toolbarEyebrow.textContent = 'Визуальный редактор';
        }

        const toolbarTitle = document.querySelector('.p-inline-toolbar__title');
        if (toolbarTitle) {
            toolbarTitle.textContent = 'Выберите текст или фото';
        }

        const toolbarMeta = document.querySelector('.p-inline-toolbar__meta');
        if (toolbarMeta) {
            toolbarMeta.textContent = 'Наведите на контент страницы и правьте его сразу на месте.';
        }
    }

    function isElementVisible(element) {
        if (!(element instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    function isIgnoredElement(element) {
        if (!(element instanceof HTMLElement)) return true;

        return Boolean(element.closest([
            'header',
            '.header',
            '.nav',
            '.hero-scene__nav',
            '.hero-header-stack',
            '.hero-scene__topbar',
            '.hero-brand',
            '.header-contact-stack',
            '.internal-legacy-header',
            '.mobile-menu-btn',
            '.order-cta',
            '.catalog-assistant',
            '.preview-footer',
            'footer',
            '.p-inline-root',
            '.p-inline-panel',
            '.p-inline-overview',
            '.p-inline-auth-modal',
            '.p-inline-icon-modal',
            '.p-inline-launcher',
            'script',
            'style',
            'noscript'
        ].join(', ')));
    }

    function nextBindingPath(element, pageKey, bucket) {
        const datasetKey = `inlineBootstrap${bucket.charAt(0).toUpperCase()}${bucket.slice(1)}Path`;
        const existing = String(element.dataset[datasetKey] || '').trim();
        if (existing) {
            return existing;
        }

        inlineBindingCounters[bucket] = (inlineBindingCounters[bucket] || 0) + 1;
        const path = `pages.${pageKey}.${bucket}.${String(inlineBindingCounters[bucket]).padStart(3, '0')}`;
        element.dataset[datasetKey] = path;
        return path;
    }

    function toListValue(value) {
        if (Array.isArray(value)) return value.map((item) => normalizeText(item)).filter(Boolean);
        return String(value || '')
            .split('\n')
            .map((item) => normalizeText(item))
            .filter(Boolean);
    }

    function setInlineDefaultValue(target, path, nextValue) {
        const segments = String(path || '').split('.').filter(Boolean);
        if (!segments.length) return;

        let pointer = target;
        for (let index = 0; index < segments.length - 1; index += 1) {
            const segment = segments[index];
            const nextSegment = segments[index + 1];
            if (pointer[segment] == null || typeof pointer[segment] !== 'object') {
                pointer[segment] = /^\d+$/.test(nextSegment) ? [] : {};
            }
            pointer = pointer[segment];
        }

        pointer[segments[segments.length - 1]] = nextValue;
    }

    function ensureInlineDefaultsRoot(fileName = INLINE_CONTENT_FILE) {
        window.PokraskaInlineContentDefaults = window.PokraskaInlineContentDefaults || {};
        if (!window.PokraskaInlineContentDefaults[fileName] || typeof window.PokraskaInlineContentDefaults[fileName] !== 'object') {
            window.PokraskaInlineContentDefaults[fileName] = {};
        }
        return window.PokraskaInlineContentDefaults[fileName];
    }

    function assignInlineDefault(path, nextValue, fileName = INLINE_CONTENT_FILE) {
        const root = ensureInlineDefaultsRoot(fileName);
        setInlineDefaultValue(root, path, nextValue);
    }

    function isInsideRepeatedCard(element) {
        return Boolean(element?.closest?.(REPETITIVE_CARD_SELECTORS.join(', ')));
    }

    function isInsideComposedModule(element) {
        return Boolean(element?.closest?.(COMPOSED_MODULE_SELECTORS.join(', ')));
    }

    function isLeadTextElement(element) {
        if (!(element instanceof HTMLElement)) return false;
        if (element.matches(LEAD_TEXT_SELECTORS.join(', '))) return true;
        return Boolean(element.closest([
            '.services-header',
            '.page-hero',
            '.page-header',
            '.catalog-nav-intro',
            '.payment-docs-overview__lead',
            '.price-summary__lead',
            '.price-summary__intro',
            '.faq-section__intro'
        ].join(', ')));
    }

    function getTextOverviewPriority(element) {
        if (!(element instanceof HTMLElement)) return 50;

        const tagName = element.tagName.toUpperCase();
        const repeated = isInsideRepeatedCard(element);
        const composed = isInsideComposedModule(element);
        const leadText = isLeadTextElement(element);

        if (tagName === 'H1') return 1;
        if (composed) {
            if (tagName === 'H2' || tagName === 'H3') return 7;
            if (tagName === 'P') return 8;
        }
        if (tagName === 'H2') return repeated ? 5 : 2;
        if (tagName === 'H3') return repeated ? 6 : 3;
        if (tagName === 'P' && leadText) return repeated ? 6 : 4;
        if (tagName === 'SUMMARY' || element.matches('.faq-card__question')) return 6;
        if (tagName === 'DT' || tagName === 'DD') return 8;
        if (tagName === 'LI') return 9;
        return repeated ? 9 : 8;
    }

    function getImageOverviewPriority(element) {
        if (!(element instanceof HTMLImageElement)) return 50;
        if (isInsideComposedModule(element)) return 7;
        if (element.closest(PROMINENT_IMAGE_SELECTORS.join(', '))) return 3;
        if (element.closest(SECONDARY_IMAGE_SELECTORS.join(', '))) return 7;
        return 5;
    }

    function getActionOverviewPriority(element) {
        if (!(element instanceof HTMLElement)) return 50;
        if (isInsideComposedModule(element)) return 7;
        if (element.closest('.order-cta, .catalog-assistant, .price-cta, .payment-docs-overview, .services-header, .page-hero, .page-header')) {
            return 3;
        }
        return 4;
    }

    function isMeaningfulTextElement(element) {
        if (!(element instanceof HTMLElement)) return false;
        if (isIgnoredElement(element) || !isElementVisible(element)) return false;
        if (element.closest('.faq-item, .faq-card, .faq-list')) return false;
        if (element.closest('.gallery-item, .catalog-panel, .catalog-palette-card')) return false;
        if (element.closest('.faq-section__intro') && element.closest('.automation-product-page, .automation-faq-wrap')) return false;
        if (isInsideComposedModule(element)) return false;

        const tagName = element.tagName.toUpperCase();
        const text = normalizeText(element.textContent || '');

        if (!text || text.length < 2) return false;
        if (tagName !== 'H1' && tagName !== 'H2' && tagName !== 'H3' && text.length < 5) return false;
        if (element.querySelector('img')) return false;
        if (element.matches('.hero-header-main, .hero-header-sub, .phone-number, .phone-label')) return false;
        if (element.closest('a, button') && !element.matches('.faq-card__question, summary')) return false;

        return true;
    }

    function isEditableImage(element) {
        if (!(element instanceof HTMLImageElement)) return false;
        if (isIgnoredElement(element) || !isElementVisible(element)) return false;
        if (element.closest('.gallery-item, .catalog-panel, .catalog-palette-card')) return false;
        if (element.closest('.automation-product-card, .catalog-sidebar, .catalog-hero, .catalog-panel__header')) return false;

        const src = String(element.getAttribute('src') || '');
        if (!src || /logo|favicon|icon/i.test(src)) return false;

        const width = Number(element.getAttribute('width') || 0) || element.naturalWidth || element.width;
        const height = Number(element.getAttribute('height') || 0) || element.naturalHeight || element.height;
        if (width && height && width < 72 && height < 72) return false;

        return true;
    }

    function resolveNearestHeadingLabel(element) {
        const section = element.closest('section, article, .scene, .service-card, .process-card, .catalog-panel, .faq-section, .contact-card, .price-card, .order-sheet, .automation-product');
        if (!(section instanceof HTMLElement)) return '';

        const heading = Array.from(section.querySelectorAll('h1, h2, h3'))
            .find((node) => node instanceof HTMLElement && node !== element && !isIgnoredElement(node));

        if (!heading) {
            return normalizeText(section.getAttribute('aria-label') || '');
        }

        return normalizeText(heading.textContent || '');
    }

    function buildTextLabel(element, index) {
        const tagName = element.tagName.toUpperCase();
        const typeLabel = TEXT_TAG_LABELS[tagName] || 'Текст';
        const context = resolveNearestHeadingLabel(element);
        const snippet = truncate(element.textContent || '', 54);
        const detail = context && context !== snippet ? context : snippet || `Блок ${index + 1}`;
        return `${typeLabel}: ${detail}`;
    }

    function buildTextHint(element) {
        const tagName = element.tagName.toUpperCase();
        if (tagName === 'H1') return 'Главный заголовок страницы.';
        if (tagName === 'H2' || tagName === 'H3') return 'Заголовок блока на странице.';
        if (tagName === 'LI') return 'Пункт списка или набора преимуществ.';
        if (tagName === 'SUMMARY' || element.matches('.faq-card__question')) return 'Вопрос, который видит клиент в FAQ.';
        return 'Текст на странице, который можно переписать прямо здесь.';
    }

    function buildImageLabel(element, index) {
        const alt = truncate(element.getAttribute('alt') || '', 54);
        const context = resolveNearestHeadingLabel(element);
        return `Фото: ${alt || context || `Изображение ${index + 1}`}`;
    }

    function isEditableAction(element) {
        if (!(element instanceof HTMLElement)) return false;
        if (isIgnoredElement(element) || !isElementVisible(element)) return false;
        if (!(element.matches('a, button'))) return false;
        if (element.closest('.gallery-item, .catalog-panel, .catalog-palette-card')) return false;
        if (element.closest('.automation-product-card, .catalog-sidebar, .catalog-hero, .catalog-panel__header')) return false;

        const href = element instanceof HTMLAnchorElement ? String(element.getAttribute('href') || '') : '';
        if (/^(tel:|mailto:|javascript:|#top$)/i.test(href)) return false;
        if (element.closest('.nav, .hero-scene__nav, .preview-footer, footer, .header-actions, .header-contact-stack, .hero-header-stack')) return false;

        const text = normalizeText(element.textContent || '');
        return text.length >= 2;
    }

    function getActionLabelNode(element) {
        if (!(element instanceof HTMLElement)) return null;
        return element.querySelector('.btn__label, .button__label, .nav-link__text, .apple-button__label, span:not([aria-hidden="true"])');
    }

    function clearDirectTextNodes(element) {
        if (!(element instanceof HTMLElement)) return;
        Array.from(element.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .forEach((node) => {
                node.textContent = '';
            });
    }

    function getInlineIconTextPrefix(element) {
        return element?.querySelector?.('i[class]') ? ' ' : '';
    }

    function applyActionText(element, text) {
        if (!(element instanceof HTMLElement)) return;
        const normalizedText = normalizeText(text);

        const labelNode = getActionLabelNode(element);
        if (labelNode instanceof HTMLElement) {
            labelNode.textContent = normalizedText;
            clearDirectTextNodes(element);
            return;
        }

        if (element instanceof HTMLAnchorElement) {
            applyLinkText(element, normalizedText);
            return;
        }

        const directTextNodes = Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE);
        if (directTextNodes.length) {
            let used = false;
            const textPrefix = getInlineIconTextPrefix(element);
            directTextNodes.forEach((node) => {
                if (used) {
                    node.textContent = '';
                    return;
                }
                node.textContent = `${textPrefix}${normalizedText}`;
                used = true;
            });
            return;
        }

        if (element.childNodes.length) {
            element.append(document.createTextNode(`${getInlineIconTextPrefix(element)}${normalizedText}`));
            return;
        }

        element.textContent = normalizedText;
    }

    function getActionIconClass(element) {
        if (!(element instanceof HTMLElement)) return '';
        const icon = element.querySelector('i[class]');
        return icon instanceof HTMLElement ? normalizeText(icon.getAttribute('class') || '') : '';
    }

    function applyActionIcon(element, iconClass) {
        if (!(element instanceof HTMLElement)) return;

        const normalizedIcon = normalizeText(iconClass || '');
        let icon = element.querySelector('i[data-inline-action-icon], i[class]');

        if (!normalizedIcon) {
            if (icon instanceof HTMLElement) icon.remove();
            element.removeAttribute('data-inline-action-icon');
            return;
        }

        if (!(icon instanceof HTMLElement)) {
            icon = document.createElement('i');
            element.insertBefore(icon, element.firstChild);
        }

        icon.className = normalizedIcon;
        icon.dataset.inlineActionIcon = '1';
        icon.setAttribute('aria-hidden', 'true');
        element.dataset.inlineActionIcon = normalizedIcon;
    }

    function inferActionStyle(element) {
        if (!(element instanceof HTMLElement)) return 'secondary';
        const explicit = normalizeText(element.dataset.inlineActionStyle || '');
        if (explicit) return explicit;

        const classText = normalizeText(element.className || '').toLowerCase();
        if (/primary|главн|accent/.test(classText)) return 'primary';
        if (/outline|border|контур/.test(classText)) return 'outline';
        if (/ghost|secondary|light|quiet|спокой/.test(classText)) return 'secondary';
        return 'secondary';
    }

    function applyActionStyle(element, style) {
        if (!(element instanceof HTMLElement)) return;
        const normalizedStyle = ['primary', 'secondary', 'outline'].includes(normalizeText(style))
            ? normalizeText(style)
            : 'secondary';

        element.dataset.inlineActionStyle = normalizedStyle;
        element.classList.remove(
            'p-inline-action-style--primary',
            'p-inline-action-style--secondary',
            'p-inline-action-style--outline'
        );
        element.classList.add(`p-inline-action-style--${normalizedStyle}`);

        if (element.classList.contains('apple-button')) {
            element.classList.toggle('apple-button--primary', normalizedStyle === 'primary');
            element.classList.toggle('apple-button--ghost', normalizedStyle !== 'primary');
        }

        if (element.classList.contains('panel-scene__action')) {
            element.classList.toggle('panel-scene__action--primary', normalizedStyle === 'primary');
            element.classList.toggle('panel-scene__action--ghost', normalizedStyle !== 'primary');
        }

        if (element.classList.contains('order-cta__button')) {
            element.classList.toggle('order-cta__button--primary', normalizedStyle === 'primary');
            element.classList.toggle('order-cta__button--secondary', normalizedStyle !== 'primary');
        }

        if (element.classList.contains('btn')) {
            element.classList.toggle('btn--primary', normalizedStyle === 'primary');
        }
    }

    function readActionValue(element) {
        return {
            label: normalizeText(element?.textContent || ''),
            href: element instanceof HTMLAnchorElement ? normalizeText(element.getAttribute('href')) : '',
            icon: getActionIconClass(element),
            style: inferActionStyle(element)
        };
    }

    function appendActionFields(fields, prefix, labelPrefix) {
        fields.push({ key: `${prefix}.label`, label: `${labelPrefix} — текст` });
        fields.push({ key: `${prefix}.href`, label: `${labelPrefix} — ссылка` });
        fields.push({ key: `${prefix}.icon`, label: `${labelPrefix} — иконка` });
        fields.push({
            key: `${prefix}.style`,
            label: `${labelPrefix} — стиль кнопки`,
            hint: 'primary/secondary/outline'
        });
    }

    function applyActionValue(element, value) {
        if (!(element instanceof HTMLElement)) return;
        const nextValue = value && typeof value === 'object' ? value : {};
        applyActionText(element, nextValue.label || '');
        applyActionIcon(element, nextValue.icon || '');
        applyActionStyle(element, nextValue.style || inferActionStyle(element));
        if (element instanceof HTMLAnchorElement && nextValue.href) {
            element.setAttribute('href', normalizeText(nextValue.href));
        }
    }

    function buildActionLabel(element, index) {
        const text = truncate(element.textContent || '', 48);
        const context = resolveNearestHeadingLabel(element);
        return `Действие: ${text || context || `Кнопка ${index + 1}`}`;
    }

    function buildFaqLabel(question, index) {
        return `FAQ: ${truncate(question || `Вопрос ${index + 1}`, 64)}`;
    }

    function applyTextToNode(node, text) {
        if (!(node instanceof HTMLElement)) return;
        node.textContent = String(text ?? '');
    }

    function applyLinkText(anchor, text) {
        if (!(anchor instanceof HTMLAnchorElement)) return;
        const normalizedText = normalizeText(text);

        const labelNode = getActionLabelNode(anchor);
        if (labelNode instanceof HTMLElement) {
            labelNode.textContent = normalizedText;
            clearDirectTextNodes(anchor);
            return;
        }

        const textNodes = Array.from(anchor.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE);
        if (textNodes.length) {
            let used = false;
            const textPrefix = getInlineIconTextPrefix(anchor);
            textNodes.forEach((node) => {
                if (used) {
                    node.textContent = '';
                    return;
                }
                node.textContent = `${textPrefix}${normalizedText}`;
                used = true;
            });
            return;
        }

        if (anchor.childNodes.length) {
            anchor.append(document.createTextNode(`${getInlineIconTextPrefix(anchor)}${normalizedText}`));
            return;
        }

        anchor.textContent = normalizedText;
    }

    function applyPhoneBlock(anchor, value) {
        if (!(anchor instanceof HTMLAnchorElement)) return;

        const label = normalizeText(value?.label);
        const href = normalizeText(value?.href);
        const note = normalizeText(value?.note);

        if (href) {
            anchor.setAttribute('href', href);
        }

        const mainNode = anchor.querySelector('.hero-header-main, .phone-number, strong');
        const noteNode = anchor.querySelector('.hero-header-sub, .phone-label, small');

        if (mainNode) {
            applyTextToNode(mainNode, label);
        } else {
            applyLinkText(anchor, label);
        }

        if (noteNode) {
            applyTextToNode(noteNode, note);
        }
    }

    function applyAnchorValue(anchor, value) {
        if (!(anchor instanceof HTMLAnchorElement)) return;

        const label = normalizeText(value?.label);
        const href = normalizeText(value?.href);

        if (href) {
            anchor.setAttribute('href', href);
        }

        applyLinkText(anchor, label);
    }

    function replaceIconLineText(line, iconSelector, text) {
        if (!(line instanceof HTMLElement)) return;
        const icon = line.querySelector(iconSelector);
        if (!icon) return;

        const clonedIcon = icon.cloneNode(true);
        line.textContent = '';
        line.appendChild(clonedIcon);
        line.append(document.createTextNode(` ${normalizeText(text)}`));
    }

    function renderFooterCompanyParagraphs(columns, value) {
        const paragraphs = toListValue(value);
        columns.forEach((column) => {
            if (!(column instanceof HTMLElement)) return;
            Array.from(column.querySelectorAll('.preview-footer__legal-text')).forEach((node) => node.remove());

            paragraphs.forEach((text) => {
                const paragraph = document.createElement('p');
                paragraph.className = 'preview-footer__legal-text';
                paragraph.textContent = text;
                column.appendChild(paragraph);
            });
        });
    }

    function resolveFooterYearRange(node) {
        const fallbackStartYear = 2014;
        const currentYear = new Date().getFullYear();
        const text = normalizeText(node?.textContent);
        const match = text.match(/©\s*([0-9]{4})(?:-([0-9]{4}))?/);
        const startYear = Number(match?.[1]) || fallbackStartYear;
        const endYear = Number(match?.[2]) || currentYear;
        return endYear > startYear ? `${startYear}-${endYear}` : `${startYear}`;
    }

    function applyFooterCaption(nodes, value) {
        nodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            const yearRange = resolveFooterYearRange(node);
            node.textContent = `© ${yearRange} ${normalizeText(value)}`;
        });
    }

    function applyFooterDomain(nodes, value) {
        nodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            const link = node.querySelector('a') || document.createElement('a');
            if (!link.isConnected) {
                link.href = 'politika.html';
                link.textContent = 'Политика конфиденциальности';
                node.textContent = '';
                node.appendChild(link);
            }

            Array.from(node.childNodes).forEach((child) => {
                if (child !== link) child.remove();
            });
            node.append(document.createTextNode(` | Домен: ${normalizeText(value)}`));
        });
    }

    function applyIconClass(iconNode, iconClass, fallbackClass = 'fas fa-star') {
        if (!(iconNode instanceof HTMLElement)) return;
        const nextClass = normalizeText(iconClass) || fallbackClass;
        iconNode.className = nextClass;
    }

    function rebuildAdvantageItems(container, items, iconClasses = []) {
        if (!(container instanceof HTMLElement)) return;
        const nextItems = toListValue(items);
        const fallbackIcons = Array.isArray(iconClasses) && iconClasses.length
            ? iconClasses.filter(Boolean)
            : ['fas fa-check-circle'];

        container.replaceChildren(...nextItems.map((text, index) => {
            const item = document.createElement('div');
            item.className = 'advantage-item';

            const icon = document.createElement('i');
            icon.className = fallbackIcons[index] || fallbackIcons[fallbackIcons.length - 1] || 'fas fa-check-circle';

            const span = document.createElement('span');
            span.textContent = text;

            item.append(icon, span);
            return item;
        }));
    }

    function rebuildListItems(listNode, items) {
        if (!(listNode instanceof HTMLElement)) return;
        listNode.replaceChildren(...toListValue(items).map((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            return li;
        }));
    }

    function rebuildSpanItems(container, items) {
        if (!(container instanceof HTMLElement)) return;
        container.replaceChildren(...toListValue(items).map((item) => {
            const span = document.createElement('span');
            span.textContent = item;
            return span;
        }));
    }

    function applyIconTextCollection(nodes, items) {
        const nextItems = toListValue(items);
        nodes.forEach((node, index) => {
            if (!(node instanceof HTMLElement)) return;
            const icon = node.querySelector('i')?.cloneNode(true);
            const text = nextItems[index] || '';
            node.textContent = '';
            if (icon) node.appendChild(icon);
            node.append(document.createTextNode(icon ? ` ${text}` : text));
        });
    }

    function getDirectChildren(container, selector) {
        if (!(container instanceof HTMLElement)) return [];
        return Array.from(container.children).filter((child) => child.matches(selector));
    }

    function rebuildDirectParagraphs(container, items, beforeNode = null) {
        if (!(container instanceof HTMLElement)) return;
        getDirectChildren(container, 'p').forEach((node) => node.remove());

        const fragment = document.createDocumentFragment();
        toListValue(items).forEach((item) => {
            const paragraph = document.createElement('p');
            paragraph.textContent = item;
            fragment.appendChild(paragraph);
        });

        container.insertBefore(fragment, beforeNode instanceof Node ? beforeNode : null);
    }

    function getGalleryWorkDisplayTitle(value) {
        const rawTitle = normalizeText(value || '');
        if (!rawTitle) return '';
        return /^(работа|фото)\s+\d+$/i.test(rawTitle) ? '' : rawTitle;
    }

    function syncGalleryWorkCard(card, nextValue) {
        if (!(card instanceof HTMLElement)) return;

        const img = card.querySelector('.gallery-image img');
        const zoomButton = card.querySelector('.zoom-btn');
        const workInfo = card.querySelector('.work-info');
        const labelNode = card.querySelector('.work-category');
        const noteNode = card.querySelector('.work-note');
        const titleText = getGalleryWorkDisplayTitle(nextValue?.title || '');

        if (img instanceof HTMLImageElement) {
            const preview = normalizeText(nextValue?.preview);
            const alt = normalizeText(nextValue?.alt);
            if (preview) {
                img.setAttribute('src', preview);
            }
            img.removeAttribute('srcset');
            img.setAttribute('alt', alt);
        }

        if (zoomButton instanceof HTMLAnchorElement) {
            const full = normalizeText(nextValue?.full);
            const title = normalizeText(nextValue?.title);
            const alt = normalizeText(nextValue?.alt);
            if (full) {
                zoomButton.setAttribute('href', full);
            }
            zoomButton.setAttribute('aria-label', alt || title || normalizeText(nextValue?.label) || 'Открыть фото');
        }

        if (labelNode instanceof HTMLElement) {
            applyTextToNode(labelNode, nextValue?.label || '');
        }

        if (workInfo instanceof HTMLElement) {
            let titleNode = workInfo.querySelector('.work-title');
            if (titleText) {
                if (!(titleNode instanceof HTMLElement)) {
                    titleNode = document.createElement('h3');
                    titleNode.className = 'work-title';
                    workInfo.insertBefore(titleNode, noteNode instanceof HTMLElement ? noteNode : null);
                }
                applyTextToNode(titleNode, titleText);
                workInfo.classList.remove('work-info--compact');
            } else {
                if (titleNode instanceof HTMLElement) {
                    titleNode.remove();
                }
                workInfo.classList.add('work-info--compact');
            }
        }
    }

    function createServiceCardModuleBinding(pageMeta, card, index) {
        if (!(card instanceof HTMLElement) || card.dataset.inlineEditId) return null;

        const iconNode = card.querySelector('.service-header > i');
        const titleNode = card.querySelector('.service-header h2');
        const serviceIdNode = card.querySelector('.service-header .service-id');
        const descriptionNode = card.querySelector('.service-description');
        const advantagesTitleNode = card.querySelector('.service-advantages h3');
        const advantagesGrid = card.querySelector('.advantages-grid');

        if (!(iconNode instanceof HTMLElement) || !(titleNode instanceof HTMLElement) || !(serviceIdNode instanceof HTMLElement) || !(descriptionNode instanceof HTMLElement)) {
            return null;
        }

        const advantageItems = Array.from(card.querySelectorAll('.advantages-grid .advantage-item'));
        const advantageIconClasses = advantageItems.map((item) => String(item.querySelector('i')?.className || '').trim()).filter(Boolean);
        const cardKey = String(card.id || `card-${index + 1}`).trim();
        const labelTitle = normalizeText(titleNode.textContent || '') || `Карточка ${index + 1}`;

        return {
            id: `inline-module-${pageMeta.key}-service-card-${cardKey}`,
            element: card,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Карточка услуги',
            path: `pages.${pageMeta.key}.modules.serviceCards.${cardKey}`,
            label: `Карточка "${labelTitle}"`,
            hint: 'Главная сервисная карточка: иконка, заголовок, короткая подстрока и основной смысловой блок.',
            overviewPriority: card.classList.contains('service-detail-card--featured') ? 1 : 2,
            fields: [
                { key: 'icon', label: 'Иконка' },
                { key: 'title', label: 'Заголовок' },
                { key: 'serviceId', label: 'Подстрока "Для..."' },
                { key: 'description', label: 'Описание', type: 'textarea' },
                ...(advantagesTitleNode ? [{ key: 'advantagesTitle', label: 'Заголовок преимуществ' }] : []),
                ...(advantagesGrid ? [{ key: 'advantages', label: 'Пункты преимуществ', type: 'list', hint: 'Каждый пункт с новой строки.' }] : [])
            ],
            defaultValue: {
                icon: String(iconNode.className || '').trim(),
                title: normalizeText(titleNode.textContent),
                serviceId: normalizeText(serviceIdNode.textContent),
                description: normalizeText(descriptionNode.textContent),
                advantagesTitle: normalizeText(advantagesTitleNode?.textContent || ''),
                advantages: advantageItems.map((item) => normalizeText(item.textContent))
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                applyIconClass(iconNode, next.icon, String(iconNode.className || 'fas fa-star').trim() || 'fas fa-star');
                applyTextToNode(titleNode, next.title || '');
                applyTextToNode(serviceIdNode, next.serviceId || '');
                applyTextToNode(descriptionNode, next.description || '');
                if (advantagesTitleNode) {
                    replaceIconLineText(advantagesTitleNode, 'i', next.advantagesTitle || '');
                }
                if (advantagesGrid) {
                    rebuildAdvantageItems(advantagesGrid, next.advantages || [], advantageIconClasses);
                }
            }
        };
    }

    function createGalleryFilterModuleBindings(pageMeta) {
        if (pageMeta.key !== 'gallery') return [];

        const bindings = [];
        const shell = document.querySelector('.gallery-filter-shell');

        if (shell instanceof HTMLElement && !shell.dataset.inlineEditId) {
            const titleNode = shell.querySelector('[data-gallery-toolbar-title]');
            const copyNode = shell.querySelector('[data-gallery-toolbar-copy]');

            if (titleNode && copyNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-filters-shell`,
                    element: shell,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Фильтры',
                    path: `pages.${pageMeta.key}.modules.filterShell`,
                    label: 'Блок фильтров галереи',
                    hint: 'Главный ввод над фильтрами: заголовок и короткое пояснение.',
                    overviewPriority: 1,
                    fields: [
                        { key: 'title', label: 'Заголовок' },
                        { key: 'copy', label: 'Описание', type: 'textarea' }
                    ],
                    defaultValue: {
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent)
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                    }
                });
            }
        }

        Array.from(document.querySelectorAll('.gallery-filter-list .filter-btn'))
            .filter((button) => button instanceof HTMLElement && !button.dataset.inlineEditId)
            .forEach((button) => {
                const filterValue = normalizeText(button.getAttribute('data-filter')) || 'all';
                bindings.push({
                    id: `inline-module-${pageMeta.key}-filter-${filterValue}`,
                    element: button,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Фильтр',
                    path: `pages.${pageMeta.key}.modules.filters.${filterValue}`,
                    label: `Фильтр "${normalizeText(button.textContent) || filterValue}"`,
                    hint: 'Название фильтра и подписи, которые меняют ввод галереи.',
                    overviewPriority: 4,
                    fields: [
                        { key: 'label', label: 'Текст фильтра' },
                        { key: 'introTitle', label: 'Заголовок блока' },
                        { key: 'introCopy', label: 'Описание блока', type: 'textarea' }
                    ],
                    defaultValue: {
                        label: normalizeText(button.textContent),
                        introTitle: normalizeText(button.getAttribute('data-intro-title')),
                        introCopy: normalizeText(button.getAttribute('data-intro-copy'))
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyActionText(button, next.label || '');
                        if (next.introTitle) button.setAttribute('data-intro-title', normalizeText(next.introTitle));
                        if (next.introCopy) button.setAttribute('data-intro-copy', normalizeText(next.introCopy));
                    }
                });
            });

        return bindings;
    }

    function createGalleryWorkDataBindings(pageMeta) {
        if (pageMeta.key !== 'gallery') return [];

        return Array.from(document.querySelectorAll('.gallery-grid .gallery-item:not(.gallery-item--skeleton)'))
            .filter((card) => card instanceof HTMLElement && !card.dataset.inlineEditId)
            .map((card, index) => {
                const img = card.querySelector('.gallery-image img');
                const labelNode = card.querySelector('.work-category');
                const zoomButton = card.querySelector('.zoom-btn');
                if (!(img instanceof HTMLImageElement) || !(labelNode instanceof HTMLElement) || !(zoomButton instanceof HTMLAnchorElement)) {
                    return null;
                }

                const label = normalizeText(labelNode.textContent);
                const titleNode = card.querySelector('.work-title');
                const title = normalizeText(titleNode?.textContent || '');
                const alt = normalizeText(img.getAttribute('alt') || '');
                const preview = normalizeText(img.getAttribute('src') || '');
                const full = normalizeText(zoomButton.getAttribute('href') || '');

                return {
                    id: `inline-gallery-item-${index + 1}`,
                    element: card,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Работа',
                    path: `${index}`,
                    label: `Работа ${index + 1}: ${label || alt || 'Без названия'}`,
                    hint: 'Карточка работы из реального источника галереи.',
                    overviewPriority: 8,
                    fields: [
                        { key: 'label', label: 'Категория' },
                        { key: 'title', label: 'Заголовок карточки' },
                        { key: 'alt', label: 'Описание фото', type: 'textarea' },
                        { key: 'preview', label: 'Путь к превью' },
                        { key: 'full', label: 'Путь к полному фото' }
                    ],
                    defaultValue: {
                        label,
                        title,
                        alt,
                        preview,
                        full
                    },
                    render: function(value) {
                        syncGalleryWorkCard(card, value);
                    }
                };
            })
            .filter(Boolean);
    }

    function createCatalogPanelModuleBinding(pageMeta, panel, index) {
        if (!(panel instanceof HTMLElement) || panel.dataset.inlineEditId) return null;

        const panelKey = normalizeText(panel.id) || `catalog-panel-${index + 1}`;
        const panelTitle = normalizeText(panel.getAttribute('data-catalog-title')) || `Панель ${index + 1}`;
        const textBlock = panel.querySelector('.catalog-panel__text');
        const badgesNode = textBlock?.querySelector('.catalog-panel__badges');
        const eyebrowNode = textBlock?.querySelector('.catalog-panel__eyebrow');
        const headingNode = textBlock?.querySelector('h2, h3');
        const paragraphNodes = getDirectChildren(textBlock, 'p');
        const infoCards = Array.from(panel.querySelectorAll('.catalog-info-grid .catalog-info-card'));

        if (!(textBlock instanceof HTMLElement)) return null;

        const fields = [];
        if (eyebrowNode) fields.push({ key: 'eyebrow', label: 'Подпись сверху' });
        if (headingNode) fields.push({ key: 'heading', label: 'Внутренний заголовок', type: 'textarea' });
        fields.push({ key: 'paragraphs', label: 'Основной текст', type: 'list', hint: 'Каждый абзац с новой строки.' });
        if (badgesNode) fields.push({ key: 'badges', label: 'Бейджи', type: 'list', hint: 'Каждый бейдж с новой строки.' });

        infoCards.forEach((card, cardIndex) => {
            fields.push({ key: `cards.${cardIndex}.title`, label: `Карточка ${cardIndex + 1} — заголовок` });
            fields.push({ key: `cards.${cardIndex}.items`, label: `Карточка ${cardIndex + 1} — пункты`, type: 'list', hint: 'Каждый пункт с новой строки.' });
        });

        return {
            id: `inline-module-${pageMeta.key}-${panelKey}`,
            element: panel,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Панель каталога',
            path: `pages.${pageMeta.key}.modules.catalogPanels.${panelKey}`,
            label: `Панель "${panelTitle}"`,
            hint: 'Большая панель каталога: смысловой блок, бейджи и карточки с фактами.',
            overviewPriority: 3,
            fields,
            defaultValue: {
                eyebrow: normalizeText(eyebrowNode?.textContent || ''),
                heading: normalizeText(headingNode?.textContent || ''),
                paragraphs: paragraphNodes.map((node) => normalizeText(node.textContent)),
                badges: Array.from(badgesNode?.querySelectorAll('span') || []).map((node) => normalizeText(node.textContent)),
                cards: infoCards.map((card) => ({
                    title: normalizeText(card.querySelector('h3')?.textContent || ''),
                    items: Array.from(card.querySelectorAll('li')).map((node) => normalizeText(node.textContent))
                }))
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                if (eyebrowNode) applyTextToNode(eyebrowNode, next.eyebrow || '');
                if (headingNode) applyTextToNode(headingNode, next.heading || '');
                rebuildDirectParagraphs(textBlock, next.paragraphs || [], badgesNode || null);
                if (badgesNode) rebuildSpanItems(badgesNode, next.badges || []);
                infoCards.forEach((card, cardIndex) => {
                    const cardValue = next.cards?.[cardIndex] || {};
                    const titleNode = card.querySelector('h3');
                    const listNode = card.querySelector('ul');
                    if (titleNode) applyTextToNode(titleNode, cardValue.title || '');
                    if (listNode) rebuildListItems(listNode, cardValue.items || []);
                });
            }
        };
    }

    function createCatalogPanelGalleryBindings(pageMeta, panel, index) {
        if (!(panel instanceof HTMLElement)) return [];

        const panelKey = normalizeText(panel.id) || `catalog-panel-${index + 1}`;
        const panelTitle = normalizeText(panel.getAttribute('data-catalog-title')) || `Панель ${index + 1}`;
        const gallery = panel.querySelector('[data-catalog-gallery]');
        const mainLink = gallery?.querySelector('[data-gallery-main-link]');
        const mainImage = gallery?.querySelector('[data-gallery-main-image]');
        const thumbButtons = Array.from(gallery?.querySelectorAll('.catalog-panel__media-thumb') || [])
            .filter((button) => button instanceof HTMLElement && !button.dataset.inlineEditId);

        if (!(gallery instanceof HTMLElement) || !(mainLink instanceof HTMLAnchorElement) || !(mainImage instanceof HTMLImageElement) || !thumbButtons.length) {
            return [];
        }

        const collectionPath = `pages.${pageMeta.key}.media.catalogPanels.${panelKey}`;
        const defaults = thumbButtons.map((button) => {
            const thumbImage = button.querySelector('img');
            return {
                src: normalizeText(button.getAttribute('data-gallery-src') || thumbImage?.getAttribute('src') || ''),
                alt: normalizeText(button.getAttribute('data-gallery-alt') || thumbImage?.getAttribute('alt') || ''),
                title: normalizeText(button.getAttribute('data-gallery-title') || '')
            };
        });

        assignInlineDefault(collectionPath, defaults);

        return thumbButtons.map((button, imageIndex) => ({
            id: `inline-media-${pageMeta.key}-${panelKey}-${imageIndex + 1}`,
            element: imageIndex === 0 ? [mainImage, button] : button,
            type: 'image',
            path: `${collectionPath}.${imageIndex}`,
            collectionPath,
            collectionAllowAdd: false,
            collectionAllowDuplicate: false,
            collectionAllowRemove: false,
            collectionAllowReorder: thumbButtons.length > 1,
            label: imageIndex === 0 ? `Фотоблок "${panelTitle}"` : `Фотоблок "${panelTitle}" · кадр ${imageIndex + 1}`,
            hint: imageIndex === 0
                ? 'Медиа-блок большой панели каталога. Можно менять кадры и их порядок.'
                : `Кадр ${imageIndex + 1} внутри панели «${panelTitle}».`,
            overviewPriority: imageIndex === 0 ? 5 : 9,
            fields: [
                { key: 'alt', label: 'Описание фото', type: 'textarea', hint: 'Коротко опишите изображение.' },
                { key: 'title', label: 'Подпись кадра' }
            ],
            directory: INLINE_UPLOAD_DIR,
            defaultValue: defaults[imageIndex],
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                const thumbImage = button.querySelector('img');
                const src = normalizeText(next.src) || defaults[imageIndex]?.src || '';
                const alt = normalizeText(next.alt);
                const title = normalizeText(next.title);

                if (src) {
                    button.setAttribute('data-gallery-src', src);
                    if (thumbImage instanceof HTMLImageElement) {
                        thumbImage.setAttribute('src', src);
                        thumbImage.removeAttribute('srcset');
                    }
                }

                button.setAttribute('data-gallery-alt', alt);
                button.setAttribute('data-gallery-title', title);

                if (thumbImage instanceof HTMLImageElement) {
                    thumbImage.setAttribute('alt', alt);
                }

                if (button.classList.contains('is-active') || (!gallery.querySelector('.catalog-panel__media-thumb.is-active') && imageIndex === 0)) {
                    if (src) {
                        mainImage.setAttribute('src', src);
                        mainImage.removeAttribute('srcset');
                        mainLink.setAttribute('href', src);
                    }
                    mainImage.setAttribute('alt', alt);
                    if (title) {
                        mainLink.setAttribute('title', title);
                    }
                }
            }
        }));
    }

    function createCatalogPaletteModuleBinding(pageMeta, panel, index) {
        if (!(panel instanceof HTMLElement)) return null;

        const paletteCard = panel.querySelector('.catalog-palette-card');
        if (!(paletteCard instanceof HTMLElement) || paletteCard.dataset.inlineEditId) return null;

        const panelTitle = normalizeText(panel.getAttribute('data-catalog-title')) || `Панель ${index + 1}`;
        const titleNode = paletteCard.querySelector('.catalog-palette-card__info h3');
        const copyNode = paletteCard.querySelector('.catalog-palette-card__info p');
        const listNode = paletteCard.querySelector('.catalog-palette-card__info ul');
        const actionNode = paletteCard.querySelector('.catalog-palette-card__info a');
        const noteNode = panel.querySelector('.catalog-panel__palette-note');

        if (!(titleNode instanceof HTMLElement) || !(copyNode instanceof HTMLElement) || !(listNode instanceof HTMLElement) || !(actionNode instanceof HTMLAnchorElement)) {
            return null;
        }

        return {
            id: `inline-module-${pageMeta.key}-${normalizeText(panel.id) || `catalog-panel-${index + 1}`}-palette`,
            element: paletteCard,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Палитра',
            path: `pages.${pageMeta.key}.modules.catalogPalettes.${normalizeText(panel.id) || `catalog-panel-${index + 1}`}`,
            label: `Палитра "${panelTitle}"`,
            hint: 'Блок подбора цвета и фактуры внутри длинной панели каталога.',
            overviewPriority: 4,
            fields: [
                { key: 'title', label: 'Заголовок' },
                { key: 'copy', label: 'Описание', type: 'textarea' },
                { key: 'items', label: 'Пункты', type: 'list', hint: 'Каждый пункт с новой строки.' },
                { key: 'action.label', label: 'Кнопка — текст' },
                { key: 'action.href', label: 'Кнопка — ссылка' },
                { key: 'action.icon', label: 'Кнопка — иконка' },
                { key: 'action.style', label: 'Кнопка — стиль кнопки', hint: 'primary/secondary/outline' },
                { key: 'note', label: 'Нижняя заметка', type: 'textarea' }
            ],
            defaultValue: {
                title: normalizeText(titleNode.textContent),
                copy: normalizeText(copyNode.textContent),
                items: Array.from(listNode.querySelectorAll('li')).map((item) => normalizeText(item.textContent)),
                action: readActionValue(actionNode),
                note: normalizeText(noteNode?.textContent || '')
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                applyTextToNode(titleNode, next.title || '');
                applyTextToNode(copyNode, next.copy || '');
                rebuildListItems(listNode, next.items || []);
                applyActionValue(actionNode, next.action || {});
                if (noteNode) applyTextToNode(noteNode, next.note || '');
            }
        };
    }

    function createHomeHeroModuleBinding(pageMeta) {
        if (pageMeta.key !== 'home') return null;

        const heroCopy = document.querySelector('.hero-copy');
        if (!(heroCopy instanceof HTMLElement) || heroCopy.dataset.inlineEditId) return null;

        const eyebrowNode = heroCopy.querySelector('.hero-copy__eyebrow');
        const titleNodes = Array.from(heroCopy.querySelectorAll('.hero-copy__title-main'));
        const subtitleNode = heroCopy.querySelector('.hero-copy__title-sub');
        const leadNode = heroCopy.querySelector('.hero-copy__lead');
        const featureNodes = Array.from(heroCopy.querySelectorAll('.hero-copy__features span'));
        const actionNodes = Array.from(heroCopy.querySelectorAll('.hero-copy__actions a'));

        if (!(eyebrowNode instanceof HTMLElement) || titleNodes.length < 3 || !(subtitleNode instanceof HTMLElement) || !(leadNode instanceof HTMLElement)) {
            return null;
        }

        return {
            id: `inline-module-${pageMeta.key}-hero-copy`,
            element: heroCopy,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Главный экран',
            path: `pages.${pageMeta.key}.modules.heroCopy`,
            label: 'Главный экран',
            hint: 'Главный оффер на первом экране с двумя кнопками и преимуществами.',
            overviewPriority: 1,
            fields: [
                { key: 'eyebrow', label: 'Подпись сверху' },
                { key: 'titleLines.0', label: 'Заголовок — строка 1' },
                { key: 'titleLines.1', label: 'Заголовок — строка 2' },
                { key: 'titleLines.2', label: 'Заголовок — строка 3' },
                { key: 'subtitle', label: 'Подстрока под заголовком' },
                { key: 'lead', label: 'Основное описание', type: 'textarea' },
                { key: 'features', label: 'Преимущества', type: 'list', hint: 'Каждый пункт с новой строки.' }
            ].concat(actionNodes.slice(0, 2).flatMap((_, actionIndex) => [
                { key: `actions.${actionIndex}.label`, label: `Кнопка ${actionIndex + 1} — текст` },
                { key: `actions.${actionIndex}.href`, label: `Кнопка ${actionIndex + 1} — ссылка` },
                { key: `actions.${actionIndex}.icon`, label: `Кнопка ${actionIndex + 1} — иконка` },
                { key: `actions.${actionIndex}.style`, label: `Кнопка ${actionIndex + 1} — стиль кнопки`, hint: 'primary/secondary/outline' }
            ])),
            defaultValue: {
                eyebrow: normalizeText(eyebrowNode.textContent),
                titleLines: titleNodes.map((node) => normalizeText(node.textContent)),
                subtitle: normalizeText(subtitleNode.textContent),
                lead: normalizeText(leadNode.textContent),
                features: featureNodes.map((node) => normalizeText(node.textContent)),
                actions: actionNodes.slice(0, 2).map(readActionValue)
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                replaceIconLineText(eyebrowNode, 'i', next.eyebrow || '');
                titleNodes.forEach((node, index) => applyTextToNode(node, next.titleLines?.[index] || ''));
                applyTextToNode(subtitleNode, next.subtitle || '');
                applyTextToNode(leadNode, next.lead || '');
                applyIconTextCollection(featureNodes, next.features || []);
                actionNodes.slice(0, 2).forEach((node, index) => {
                    applyActionValue(node, next.actions?.[index] || {});
                });
            }
        };
    }

    function createHomePanelSceneModuleBinding(pageMeta, card, index) {
        if (pageMeta.key !== 'home' || !(card instanceof HTMLElement) || card.dataset.inlineEditId) return null;

        const chipNode = card.querySelector('.scene-chip');
        const eyebrowNode = card.querySelector('.panel-scene__eyebrow');
        const titleNode = card.querySelector('.panel-scene__copy-block h3');
        const copyNode = card.querySelector('.panel-scene__copy-block p');
        const factNodes = Array.from(card.querySelectorAll('.panel-scene__fact'));
        const itemNodes = Array.from(card.querySelectorAll('.panel-scene__item'));
        const trustNode = card.querySelector('.panel-scene__trust');
        const actionNodes = Array.from(card.querySelectorAll('.panel-scene__actions a'));
        const label = normalizeText(titleNode?.textContent || '') || `Сцена ${index + 1}`;

        if (!(chipNode instanceof HTMLElement) || !(eyebrowNode instanceof HTMLElement) || !(titleNode instanceof HTMLElement) || !(copyNode instanceof HTMLElement)) {
            return null;
        }

        const fields = [
            { key: 'chip', label: 'Плашка' },
            { key: 'eyebrow', label: 'Подпись с иконкой' },
            { key: 'title', label: 'Заголовок', type: 'textarea' },
            { key: 'copy', label: 'Описание', type: 'textarea' }
        ];

        factNodes.forEach((_, factIndex) => {
            fields.push({ key: `facts.${factIndex}.title`, label: `Факт ${factIndex + 1} — заголовок` });
            fields.push({ key: `facts.${factIndex}.copy`, label: `Факт ${factIndex + 1} — текст` });
        });

        itemNodes.forEach((_, itemIndex) => {
            fields.push({ key: `items.${itemIndex}.title`, label: `Пункт ${itemIndex + 1} — заголовок` });
            fields.push({ key: `items.${itemIndex}.copy`, label: `Пункт ${itemIndex + 1} — текст`, type: 'textarea' });
        });

        const trustStrongNode = trustNode?.querySelector('strong');
        const trustCopyText = trustStrongNode
            ? normalizeText(trustNode.textContent.replace(trustStrongNode.textContent, ''))
            : normalizeText(trustNode?.textContent || '');

        if (trustStrongNode instanceof HTMLElement) {
            fields.push({ key: 'trust.title', label: 'Подпись доверия — акцент' });
            fields.push({ key: 'trust.copy', label: 'Подпись доверия — текст', type: 'textarea' });
        } else if (trustNode instanceof HTMLElement) {
            fields.push({ key: 'trust.copy', label: 'Подпись доверия', type: 'textarea' });
        }

        actionNodes.slice(0, 2).forEach((_, actionIndex) => {
            appendActionFields(fields, `actions.${actionIndex}`, `Кнопка ${actionIndex + 1}`);
        });

        return {
            id: `inline-module-${pageMeta.key}-panel-scene-${index + 1}`,
            element: card,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Сцена',
            path: `pages.${pageMeta.key}.modules.panelScenes.${index}`,
            label: `Сцена "${label}"`,
            hint: 'Большая карточка-сцена на главной: смысл, факты, пункты и действия.',
            overviewPriority: 2,
            fields,
            defaultValue: {
                chip: normalizeText(chipNode.textContent),
                eyebrow: normalizeText(eyebrowNode.textContent),
                title: normalizeText(titleNode.textContent),
                copy: normalizeText(copyNode.textContent),
                facts: factNodes.map((node) => ({
                    title: normalizeText(node.querySelector('strong')?.textContent || ''),
                    copy: normalizeText(node.querySelector('span')?.textContent || '')
                })),
                items: itemNodes.map((node) => ({
                    title: normalizeText(node.querySelector('strong')?.textContent || ''),
                    copy: normalizeText(node.querySelector('span')?.textContent || '')
                })),
                trust: {
                    title: normalizeText(trustStrongNode?.textContent || ''),
                    copy: trustCopyText
                },
                actions: actionNodes.slice(0, 2).map(readActionValue)
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                applyTextToNode(chipNode, next.chip || '');
                replaceIconLineText(eyebrowNode, 'i', next.eyebrow || '');
                applyTextToNode(titleNode, next.title || '');
                applyTextToNode(copyNode, next.copy || '');
                factNodes.forEach((node, factIndex) => {
                    const fact = next.facts?.[factIndex] || {};
                    const factTitle = node.querySelector('strong');
                    const factCopy = node.querySelector('span');
                    if (factTitle) applyTextToNode(factTitle, fact.title || '');
                    if (factCopy) applyTextToNode(factCopy, fact.copy || '');
                });
                itemNodes.forEach((node, itemIndex) => {
                    const item = next.items?.[itemIndex] || {};
                    const itemTitle = node.querySelector('strong');
                    const itemCopy = node.querySelector('span');
                    if (itemTitle) applyTextToNode(itemTitle, item.title || '');
                    if (itemCopy) applyTextToNode(itemCopy, item.copy || '');
                });
                if (trustNode instanceof HTMLElement) {
                    if (trustStrongNode instanceof HTMLElement) {
                        applyTextToNode(trustStrongNode, next.trust?.title || '');
                        const directTextNodes = Array.from(trustNode.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE);
                        if (directTextNodes.length) {
                            directTextNodes[0].textContent = ` ${normalizeText(next.trust?.copy || '')}`;
                            directTextNodes.slice(1).forEach((node) => { node.textContent = ''; });
                        } else {
                            trustNode.append(document.createTextNode(` ${normalizeText(next.trust?.copy || '')}`));
                        }
                    } else {
                        applyTextToNode(trustNode, next.trust?.copy || '');
                    }
                }
                actionNodes.slice(0, 2).forEach((node, actionIndex) => {
                    applyActionValue(node, next.actions?.[actionIndex] || {});
                });
            }
        };
    }

    function createHomeStatementModuleBinding(pageMeta) {
        if (pageMeta.key !== 'home') return null;

        const statementScene = document.querySelector('.statement-scene');
        if (!(statementScene instanceof HTMLElement) || statementScene.dataset.inlineEditId) return null;

        const leadNode = statementScene.querySelector('.statement-scene__lead h2');
        const lineNodes = Array.from(leadNode?.querySelectorAll('span') || []);

        if (!(leadNode instanceof HTMLElement) || !lineNodes.length) return null;

        return {
            id: `inline-module-${pageMeta.key}-statement-scene`,
            element: statementScene,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Большой тезис',
            path: `pages.${pageMeta.key}.modules.statementScene`,
            label: 'Блок "Большой тезис"',
            hint: 'Крупный промежуточный тезис между главным экраном и сценами на главной.',
            overviewPriority: 2,
            fields: [
                { key: 'lines', label: 'Строки тезиса', type: 'list', hint: 'Каждая строка с новой строки.' }
            ],
            defaultValue: {
                lines: lineNodes.map((node) => normalizeText(node.textContent))
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                rebuildSpanItems(leadNode, next.lines || []);
            }
        };
    }

    function createHomeRouteSceneModuleBinding(pageMeta) {
        if (pageMeta.key !== 'home') return null;

        const routeScene = document.querySelector('.route-scene');
        if (!(routeScene instanceof HTMLElement) || routeScene.dataset.inlineEditId) return null;

        const eyebrowNode = routeScene.querySelector('.route-scene__intro .route-scene__eyebrow');
        const titleNode = routeScene.querySelector('.route-scene__intro h3');
        const copyNode = routeScene.querySelector('.route-scene__intro p');
        const factNodes = Array.from(routeScene.querySelectorAll('.route-scene__fact'));
        const stepNodes = Array.from(routeScene.querySelectorAll('.route-step'));

        if (!(eyebrowNode instanceof HTMLElement) || !(titleNode instanceof HTMLElement) || !(copyNode instanceof HTMLElement)) return null;

        const fields = [
            { key: 'eyebrow', label: 'Подпись сверху' },
            { key: 'title', label: 'Заголовок' },
            { key: 'copy', label: 'Описание', type: 'textarea' }
        ];
        factNodes.forEach((_, factIndex) => {
            fields.push({ key: `facts.${factIndex}.title`, label: `Факт ${factIndex + 1} — заголовок` });
            fields.push({ key: `facts.${factIndex}.copy`, label: `Факт ${factIndex + 1} — текст` });
        });
        stepNodes.forEach((_, stepIndex) => {
            fields.push({ key: `steps.${stepIndex}.title`, label: `Шаг ${stepIndex + 1} — заголовок` });
            fields.push({ key: `steps.${stepIndex}.copy`, label: `Шаг ${stepIndex + 1} — текст`, type: 'textarea' });
        });

        return {
            id: `inline-module-${pageMeta.key}-route-scene`,
            element: routeScene,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Сценарий работы',
            path: `pages.${pageMeta.key}.modules.routeScene`,
            label: 'Блок "Как строим работу"',
            hint: 'Верхний ввод, факты и шаги процесса на главной.',
            overviewPriority: 2,
            fields,
            defaultValue: {
                eyebrow: normalizeText(eyebrowNode.textContent),
                title: normalizeText(titleNode.textContent),
                copy: normalizeText(copyNode.textContent),
                facts: factNodes.map((node) => ({
                    title: normalizeText(node.querySelector('strong')?.textContent || ''),
                    copy: normalizeText(node.querySelector('span')?.textContent || '')
                })),
                steps: stepNodes.map((node) => ({
                    title: normalizeText(node.querySelector('h4')?.textContent || ''),
                    copy: normalizeText(node.querySelector('p')?.textContent || '')
                }))
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                replaceIconLineText(eyebrowNode, 'i', next.eyebrow || '');
                applyTextToNode(titleNode, next.title || '');
                applyTextToNode(copyNode, next.copy || '');
                factNodes.forEach((node, factIndex) => {
                    const fact = next.facts?.[factIndex] || {};
                    const factTitle = node.querySelector('strong');
                    const factCopy = node.querySelector('span');
                    if (factTitle) applyTextToNode(factTitle, fact.title || '');
                    if (factCopy) applyTextToNode(factCopy, fact.copy || '');
                });
                stepNodes.forEach((node, stepIndex) => {
                    const step = next.steps?.[stepIndex] || {};
                    const stepTitle = node.querySelector('h4');
                    const stepCopy = node.querySelector('p');
                    if (stepTitle) applyTextToNode(stepTitle, step.title || '');
                    if (stepCopy) applyTextToNode(stepCopy, step.copy || '');
                });
            }
        };
    }

    function createHomeReviewsModuleBinding(pageMeta) {
        if (pageMeta.key !== 'home') return null;

        const reviewsScene = document.querySelector('.reviews-scene');
        if (!(reviewsScene instanceof HTMLElement) || reviewsScene.dataset.inlineEditId) return null;

        const eyebrowNode = reviewsScene.querySelector('.reviews-scene__intro .route-scene__eyebrow');
        const titleNode = reviewsScene.querySelector('.reviews-scene__intro h3');
        const copyNode = reviewsScene.querySelector('.reviews-scene__intro p');
        const reviewCards = Array.from(reviewsScene.querySelectorAll('.reviews-scene__card'));

        if (!(eyebrowNode instanceof HTMLElement) || !(titleNode instanceof HTMLElement) || !(copyNode instanceof HTMLElement)) return null;

        const fields = [
            { key: 'eyebrow', label: 'Подпись сверху' },
            { key: 'title', label: 'Заголовок' },
            { key: 'copy', label: 'Описание', type: 'textarea' }
        ];
        reviewCards.forEach((_, reviewIndex) => {
            fields.push({ key: `reviews.${reviewIndex}.quote`, label: `Отзыв ${reviewIndex + 1} — текст`, type: 'textarea' });
            fields.push({ key: `reviews.${reviewIndex}.author`, label: `Отзыв ${reviewIndex + 1} — автор` });
            fields.push({ key: `reviews.${reviewIndex}.meta`, label: `Отзыв ${reviewIndex + 1} — подпись` });
        });

        return {
            id: `inline-module-${pageMeta.key}-reviews-scene`,
            element: reviewsScene,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Отзывы',
            path: `pages.${pageMeta.key}.modules.reviewsScene`,
            label: 'Блок "Отзывы"',
            hint: 'Ввод и карточки отзывов на главной странице.',
            overviewPriority: 3,
            fields,
            defaultValue: {
                eyebrow: normalizeText(eyebrowNode.textContent),
                title: normalizeText(titleNode.textContent),
                copy: normalizeText(copyNode.textContent),
                reviews: reviewCards.map((card) => ({
                    quote: normalizeText(card.querySelector('p')?.textContent || ''),
                    author: normalizeText(card.querySelector('.reviews-scene__author strong')?.textContent || ''),
                    meta: normalizeText(card.querySelector('.reviews-scene__author span')?.textContent || '')
                }))
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                replaceIconLineText(eyebrowNode, 'i', next.eyebrow || '');
                applyTextToNode(titleNode, next.title || '');
                applyTextToNode(copyNode, next.copy || '');
                reviewCards.forEach((card, reviewIndex) => {
                    const review = next.reviews?.[reviewIndex] || {};
                    const quoteNode = card.querySelector('p');
                    const authorNode = card.querySelector('.reviews-scene__author strong');
                    const metaNode = card.querySelector('.reviews-scene__author span');
                    if (quoteNode) applyTextToNode(quoteNode, review.quote || '');
                    if (authorNode) applyTextToNode(authorNode, review.author || '');
                    if (metaNode) applyTextToNode(metaNode, review.meta || '');
                });
            }
        };
    }

    function createHomeBrandsModuleBinding(pageMeta) {
        if (pageMeta.key !== 'home') return null;

        const brandsSection = document.querySelector('.home-tail__section--brands');
        if (!(brandsSection instanceof HTMLElement) || brandsSection.dataset.inlineEditId) return null;

        const eyebrowNode = brandsSection.querySelector('.home-tail__intro .route-scene__eyebrow');
        const titleNode = brandsSection.querySelector('.home-tail__intro h3');
        const copyNode = brandsSection.querySelector('.home-tail__intro p');

        if (!(eyebrowNode instanceof HTMLElement) || !(titleNode instanceof HTMLElement) || !(copyNode instanceof HTMLElement)) return null;

        return {
            id: `inline-module-${pageMeta.key}-brands-scene`,
            element: brandsSection,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Бренды',
            path: `pages.${pageMeta.key}.modules.brandsScene`,
            label: 'Блок "Бренды"',
            hint: 'Короткий ввод над логотипами брендов.',
            overviewPriority: 3,
            fields: [
                { key: 'eyebrow', label: 'Подпись сверху' },
                { key: 'title', label: 'Заголовок' },
                { key: 'copy', label: 'Описание', type: 'textarea' }
            ],
            defaultValue: {
                eyebrow: normalizeText(eyebrowNode.textContent),
                title: normalizeText(titleNode.textContent),
                copy: normalizeText(copyNode.textContent)
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                replaceIconLineText(eyebrowNode, 'i', next.eyebrow || '');
                applyTextToNode(titleNode, next.title || '');
                applyTextToNode(copyNode, next.copy || '');
            }
        };
    }

    function createHomeRequestModuleBinding(pageMeta) {
        if (pageMeta.key !== 'home') return null;

        const requestSection = document.querySelector('.home-tail__request');
        if (!(requestSection instanceof HTMLElement) || requestSection.dataset.inlineEditId) return null;

        const requestCopy = requestSection.querySelector('.home-tail__request-copy');
        const requestIntro = requestSection.querySelector('.home-tail__request-intro') || requestCopy;
        const sourceItemsNode = requestSection.querySelector('.home-tail__request-source-items');
        const contactNode = requestSection.querySelector('.home-tail__contact');
        const kickerNode = requestSection.querySelector('.home-tail__request-kicker, .route-scene__eyebrow');
        const titleNode = requestIntro?.querySelector('h3') || requestSection.querySelector('.home-tail__request-copy h3');
        const copyNode = requestIntro?.querySelector('p') || Array.from(requestCopy?.children || [])
            .find((node) => node instanceof HTMLElement && node.tagName === 'P');
        const sourceLabelNode = requestSection.querySelector('.home-tail__group-label, .home-tail__request-source-label');
        const sourceItemNodes = Array.from(requestSection.querySelectorAll('.home-tail__request-source-items span'));
        const advantageNodes = Array.from(requestSection.querySelectorAll('.home-tail__advantages span'));
        const noteNode = requestSection.querySelector('.home-tail__request-note');
        const contactEyebrowNode = contactNode?.querySelector('.home-tail__contact-eyebrow');
        const contactCopyNode = Array.from(contactNode?.children || [])
            .find((node) => node instanceof HTMLElement && node.tagName === 'P');
        const phoneNodes = Array.from(requestSection.querySelectorAll('.home-tail__contact-link'));
        const footerNode = requestSection.querySelector('.home-tail__contact-footer');
        const actionNodes = Array.from(requestSection.querySelectorAll('.home-tail__contact-actions a'));
        const formTitleNode = requestSection.querySelector('.home-tail__form-card h4');
        const formCopyNode = requestSection.querySelector('.home-tail__form-card > p');

        if (!(kickerNode instanceof HTMLElement) || !(titleNode instanceof HTMLElement) || !(copyNode instanceof HTMLElement) || !(sourceLabelNode instanceof HTMLElement) || !(formTitleNode instanceof HTMLElement)) {
            return null;
        }

        const readTextLines = (node) => {
            if (!(node instanceof HTMLElement)) return [];
            const spans = Array.from(node.querySelectorAll('span'))
                .map((item) => normalizeText(item.textContent))
                .filter(Boolean);
            return spans.length ? spans : [normalizeText(node.textContent)].filter(Boolean);
        };

        const applyIconAwareText = (node, text) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.querySelector('i')) {
                replaceIconLineText(node, 'i', text || '');
                return;
            }
            applyTextToNode(node, text || '');
        };

        const getPhoneLabelNode = (node) => node?.querySelector?.('strong, .hero-header-main, .phone-number, span');
        const getPhoneNoteNode = (node) => node?.querySelector?.('small, .hero-header-sub, .phone-label');

        return {
            id: `inline-module-${pageMeta.key}-request-section`,
            element: requestSection,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Заявка',
            path: `pages.${pageMeta.key}.modules.requestSection`,
            label: 'Блок "Заявка и контакты"',
            hint: 'Большой блок заявки с преимуществами, телефонами, мессенджерами и подписью формы.',
            overviewPriority: 2,
            fields: [
                { key: 'kicker', label: 'Подпись сверху' },
                { key: 'titleLines', label: 'Заголовок', type: 'list', hint: 'Каждая строка с новой строки.' },
                { key: 'copyLines', label: 'Описание', type: 'list', hint: 'Каждая строка с новой строки.' },
                { key: 'sourceLabel', label: 'Подпись группы' },
                { key: 'advantages', label: 'Преимущества', type: 'list', hint: 'Каждый пункт с новой строки.' },
                { key: 'sourceItems', label: 'Что подготовить для расчёта', type: 'list', hint: 'Каждый пункт с новой строки.' },
                { key: 'note', label: 'Заметка под преимуществами', type: 'textarea' },
                { key: 'contactEyebrow', label: 'Подпись контактов' },
                { key: 'contactCopy', label: 'Текст перед быстрым контактом', type: 'textarea' },
                { key: 'phones.0.label', label: 'Телефон 1 — номер' },
                { key: 'phones.0.note', label: 'Телефон 1 — подпись' },
                { key: 'phones.0.href', label: 'Телефон 1 — ссылка' },
                { key: 'phones.1.label', label: 'Телефон 2 — номер' },
                { key: 'phones.1.note', label: 'Телефон 2 — подпись' },
                { key: 'phones.1.href', label: 'Телефон 2 — ссылка' },
                { key: 'footerFacts', label: 'Факты под телефонами', type: 'list', hint: 'Каждый факт с новой строки.' },
                ...actionNodes.slice(0, 2).flatMap((_, actionIndex) => [
                    { key: `actions.${actionIndex}.label`, label: `Кнопка ${actionIndex + 1} — текст` },
                    { key: `actions.${actionIndex}.href`, label: `Кнопка ${actionIndex + 1} — ссылка` },
                    { key: `actions.${actionIndex}.icon`, label: `Кнопка ${actionIndex + 1} — иконка` },
                    { key: `actions.${actionIndex}.style`, label: `Кнопка ${actionIndex + 1} — стиль кнопки`, hint: 'primary/secondary/outline' }
                ]),
                { key: 'formTitleLines', label: 'Заголовок формы', type: 'list', hint: 'Каждая строка с новой строки.' },
                { key: 'formCopy', label: 'Описание формы', type: 'textarea' }
            ],
            defaultValue: {
                kicker: normalizeText(kickerNode.textContent),
                titleLines: readTextLines(titleNode),
                copyLines: readTextLines(copyNode),
                sourceLabel: normalizeText(sourceLabelNode.textContent),
                advantages: advantageNodes.map((node) => normalizeText(node.textContent)),
                sourceItems: sourceItemNodes.map((node) => normalizeText(node.textContent)),
                note: normalizeText(noteNode?.textContent || ''),
                contactEyebrow: normalizeText(contactEyebrowNode?.textContent || ''),
                contactCopy: normalizeText(contactCopyNode?.textContent || ''),
                phones: phoneNodes.slice(0, 2).map((node) => ({
                    label: normalizeText(getPhoneLabelNode(node)?.textContent || node.textContent || ''),
                    note: normalizeText(getPhoneNoteNode(node)?.textContent || ''),
                    href: normalizeText(node.getAttribute('href'))
                })),
                footerFacts: Array.from(footerNode?.querySelectorAll('span') || []).map((node) => normalizeText(node.textContent)),
                actions: actionNodes.slice(0, 2).map(readActionValue),
                formTitleLines: readTextLines(formTitleNode),
                formCopy: normalizeText(formCopyNode?.textContent || '')
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                applyIconAwareText(kickerNode, next.kicker || '');
                rebuildSpanItems(titleNode, next.titleLines || []);
                rebuildSpanItems(copyNode, next.copyLines || []);
                applyTextToNode(sourceLabelNode, next.sourceLabel || '');
                applyIconTextCollection(advantageNodes, next.advantages || []);
                if (sourceItemsNode instanceof HTMLElement) {
                    rebuildSpanItems(sourceItemsNode, next.sourceItems || []);
                }
                if (noteNode instanceof HTMLElement) {
                    applyIconAwareText(noteNode, next.note || '');
                }
                if (contactEyebrowNode instanceof HTMLElement) {
                    applyTextToNode(contactEyebrowNode, next.contactEyebrow || '');
                }
                if (contactCopyNode instanceof HTMLElement) {
                    applyTextToNode(contactCopyNode, next.contactCopy || '');
                }
                phoneNodes.slice(0, 2).forEach((node, phoneIndex) => {
                    const phone = next.phones?.[phoneIndex] || {};
                    const labelNode = getPhoneLabelNode(node);
                    const noteNode = getPhoneNoteNode(node);
                    if (labelNode) {
                        applyTextToNode(labelNode, phone.label || '');
                    } else {
                        applyLinkText(node, phone.label || '');
                    }
                    if (noteNode) applyTextToNode(noteNode, phone.note || '');
                    if (phone.href) node.setAttribute('href', normalizeText(phone.href));
                });
                if (footerNode instanceof HTMLElement) {
                    rebuildSpanItems(footerNode, next.footerFacts || []);
                }
                actionNodes.slice(0, 2).forEach((node, actionIndex) => {
                    applyActionValue(node, next.actions?.[actionIndex] || {});
                });
                rebuildSpanItems(formTitleNode, next.formTitleLines || []);
                if (formCopyNode instanceof HTMLElement) {
                    applyTextToNode(formCopyNode, next.formCopy || '');
                }
            }
        };
    }

    function isAutomationPage(pageMeta) {
        return Boolean(pageMeta?.key && String(pageMeta.key).startsWith('automation-'));
    }

    function createAutomationBackLinkModuleBinding(pageMeta) {
        if (!isAutomationPage(pageMeta)) return null;

        const backLink = document.querySelector('.automation-product-back');
        if (!(backLink instanceof HTMLAnchorElement) || backLink.dataset.inlineEditId) return null;

        return {
            id: `inline-module-${pageMeta.key}-automation-back-link`,
            element: backLink,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Навигация',
            path: `pages.${pageMeta.key}.modules.backLink`,
            label: 'Кнопка "Назад"',
            hint: 'Ссылка возврата в каталог или в предыдущий раздел автоматики.',
            overviewPriority: 2,
            fields: [
                { key: 'label', label: 'Текст ссылки' },
                { key: 'href', label: 'Ссылка' }
            ],
            defaultValue: {
                label: normalizeText(backLink.textContent),
                href: normalizeText(backLink.getAttribute('href'))
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                replaceIconLineText(backLink, 'i', next.label || '');
                if (next.href) backLink.setAttribute('href', normalizeText(next.href));
            }
        };
    }

    function createAutomationCatalogHeroModuleBinding(pageMeta) {
        if (!isAutomationPage(pageMeta)) return null;

        const hero = document.querySelector('.catalog-hero');
        if (!(hero instanceof HTMLElement) || hero.dataset.inlineEditId) return null;

        const breadcrumbsNode = hero.querySelector('.catalog-breadcrumbs');
        const titleNode = hero.querySelector('h1');
        const copyNode = hero.querySelector('p');

        if (!(breadcrumbsNode instanceof HTMLElement) || !(titleNode instanceof HTMLElement) || !(copyNode instanceof HTMLElement)) return null;

        return {
            id: `inline-module-${pageMeta.key}-automation-catalog-hero`,
            element: hero,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Ввод каталога',
            path: `pages.${pageMeta.key}.modules.catalogHero`,
            label: 'Блок "Ввод каталога автоматики"',
            hint: 'Верхний ввод страницы автоматики с хлебными крошками, заголовком и описанием.',
            overviewPriority: 1,
            fields: [
                { key: 'breadcrumbs', label: 'Хлебные крошки' },
                { key: 'title', label: 'Заголовок' },
                { key: 'copy', label: 'Описание', type: 'textarea' }
            ],
            defaultValue: {
                breadcrumbs: normalizeText(breadcrumbsNode.textContent),
                title: normalizeText(titleNode.textContent),
                copy: normalizeText(copyNode.textContent)
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                applyTextToNode(breadcrumbsNode, next.breadcrumbs || '');
                applyTextToNode(titleNode, next.title || '');
                applyTextToNode(copyNode, next.copy || '');
            }
        };
    }

    function createAutomationSidebarModuleBinding(pageMeta) {
        if (!isAutomationPage(pageMeta)) return null;

        const sidebar = document.querySelector('.catalog-sidebar');
        if (!(sidebar instanceof HTMLElement) || sidebar.dataset.inlineEditId) return null;

        const tabs = Array.from(sidebar.querySelectorAll('.catalog-group-tab'));
        const links = Array.from(sidebar.querySelectorAll('.catalog-link'));

        if (!tabs.length && !links.length) return null;

        const fields = [];
        tabs.forEach((_, index) => {
            fields.push({ key: `tabs.${index}.label`, label: `Верхняя вкладка ${index + 1} — текст` });
            fields.push({ key: `tabs.${index}.href`, label: `Верхняя вкладка ${index + 1} — ссылка` });
        });
        links.forEach((_, index) => {
            fields.push({ key: `links.${index}.label`, label: `Ссылка раздела ${index + 1} — текст` });
            fields.push({ key: `links.${index}.href`, label: `Ссылка раздела ${index + 1} — ссылка` });
        });

        return {
            id: `inline-module-${pageMeta.key}-automation-sidebar`,
            element: sidebar,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Навигация',
            path: `pages.${pageMeta.key}.modules.sidebar`,
            label: 'Блок "Навигация автоматики"',
            hint: 'Боковая навигация по разделам автоматики и группам каталога.',
            overviewPriority: 1,
            fields,
            defaultValue: {
                tabs: tabs.map((tab) => ({
                    label: normalizeText(tab.textContent),
                    href: normalizeText(tab.getAttribute('href'))
                })),
                links: links.map((link) => ({
                    label: normalizeText(link.textContent),
                    href: normalizeText(link.getAttribute('href'))
                }))
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                tabs.forEach((tab, index) => {
                    const item = next.tabs?.[index] || {};
                    applyActionText(tab, item.label || '');
                    if (item.href) tab.setAttribute('href', normalizeText(item.href));
                });
                links.forEach((link, index) => {
                    const item = next.links?.[index] || {};
                    applyActionText(link, item.label || '');
                    if (item.href) link.setAttribute('href', normalizeText(item.href));
                });
            }
        };
    }

    function createAutomationPanelHeaderModuleBinding(pageMeta) {
        if (!isAutomationPage(pageMeta)) return null;

        const header = document.querySelector('.catalog-panel__header');
        if (!(header instanceof HTMLElement) || header.dataset.inlineEditId) return null;

        const breadcrumbsNode = header.querySelector('.catalog-breadcrumbs');
        const titleNode = header.querySelector('h2');

        if (!(titleNode instanceof HTMLElement)) return null;

        return {
            id: `inline-module-${pageMeta.key}-automation-panel-header`,
            element: header,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Раздел',
            path: `pages.${pageMeta.key}.modules.panelHeader`,
            label: 'Блок "Заголовок раздела"',
            hint: 'Заголовок каталожного раздела автоматики над карточками.',
            overviewPriority: 2,
            fields: [
                { key: 'breadcrumbs', label: 'Хлебные крошки' },
                { key: 'title', label: 'Заголовок' }
            ],
            defaultValue: {
                breadcrumbs: normalizeText(breadcrumbsNode?.textContent || ''),
                title: normalizeText(titleNode.textContent)
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                if (breadcrumbsNode) applyTextToNode(breadcrumbsNode, next.breadcrumbs || '');
                applyTextToNode(titleNode, next.title || '');
            }
        };
    }

    function createAutomationFaqIntroModuleBinding(pageMeta) {
        if (!isAutomationPage(pageMeta)) return null;

        const intro = document.querySelector('.faq-section__intro');
        if (!(intro instanceof HTMLElement) || intro.dataset.inlineEditId) return null;

        const titleNode = intro.querySelector('.section-title');
        const copyNode = intro.querySelector('.section-subtitle');

        if (!(titleNode instanceof HTMLElement) || !(copyNode instanceof HTMLElement)) return null;

        return {
            id: `inline-module-${pageMeta.key}-automation-faq-intro`,
            element: intro,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'FAQ',
            path: `pages.${pageMeta.key}.modules.faqIntro`,
            label: `Блок "${normalizeText(titleNode.textContent) || 'Ввод FAQ'}"`,
            hint: 'Вводный блок над вопросами и ответами на странице автоматики.',
            overviewPriority: 2,
            fields: [
                { key: 'title', label: 'Заголовок' },
                { key: 'copy', label: 'Подзаголовок', type: 'textarea' }
            ],
            defaultValue: {
                title: normalizeText(titleNode.textContent),
                copy: normalizeText(copyNode.textContent)
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                applyTextToNode(titleNode, next.title || '');
                applyTextToNode(copyNode, next.copy || '');
            }
        };
    }

    function createAutomationProductCardModuleBinding(pageMeta, card, index) {
        if (!isAutomationPage(pageMeta) || !(card instanceof HTMLElement) || card.dataset.inlineEditId) return null;

        const info = card.querySelector('.automation-product-info');
        const metaNode = card.querySelector('.automation-product-meta');
        const titleNode = card.querySelector('.automation-product-title');
        const descriptionNode = card.querySelector('.automation-product-description');
        const mainSpecsNode = info instanceof HTMLElement
            ? Array.from(info.children).find((child) => child.classList?.contains('automation-product-specs'))
            : null;
        const sectionNodes = Array.from(card.querySelectorAll('.automation-product-section'));
        const actionNodes = Array.from(card.querySelectorAll('.automation-product-cta a'));
        const label = normalizeText(titleNode?.textContent || '') || `Карточка ${index + 1}`;

        if (!(titleNode instanceof HTMLElement) || !(descriptionNode instanceof HTMLElement)) return null;

        const fields = [
            { key: 'meta', label: 'Верхняя подпись' },
            { key: 'title', label: 'Заголовок', type: 'textarea' },
            { key: 'description', label: 'Описание', type: 'textarea' }
        ];

        if (mainSpecsNode instanceof HTMLElement) {
            fields.push({
                key: 'mainSpecs',
                label: 'Основные характеристики',
                type: 'list',
                hint: 'Каждый пункт с новой строки.'
            });
        }

        sectionNodes.forEach((section, sectionIndex) => {
            const sectionTitle = section.querySelector('.automation-product-section__title');
            if (sectionTitle) {
                fields.push({ key: `sections.${sectionIndex}.title`, label: `Секция ${sectionIndex + 1} — заголовок` });
            }
            fields.push({
                key: `sections.${sectionIndex}.items`,
                label: `Секция ${sectionIndex + 1} — пункты`,
                type: 'list',
                hint: 'Каждый пункт с новой строки.'
            });
        });

        actionNodes.slice(0, 2).forEach((_, actionIndex) => {
            appendActionFields(fields, `actions.${actionIndex}`, `Кнопка ${actionIndex + 1}`);
        });

        return {
            id: `inline-module-${pageMeta.key}-automation-product-${index + 1}`,
            element: card,
            type: 'object',
            editorMode: 'module',
            editorKindLabel: 'Карточка товара',
            path: `pages.${pageMeta.key}.modules.products.${index}`,
            label: `Карточка "${label}"`,
            hint: 'Основная карточка товара или комплекта автоматики: описание, характеристики и действия.',
            overviewPriority: 1,
            fields,
            defaultValue: {
                meta: normalizeText(metaNode?.textContent || ''),
                title: normalizeText(titleNode.textContent),
                description: normalizeText(descriptionNode.textContent),
                mainSpecs: mainSpecsNode instanceof HTMLElement
                    ? Array.from(mainSpecsNode.querySelectorAll('li')).map((item) => normalizeText(item.textContent))
                    : [],
                sections: sectionNodes.map((section) => ({
                    title: normalizeText(section.querySelector('.automation-product-section__title')?.textContent || ''),
                    items: Array.from(section.querySelectorAll('.automation-product-specs li')).map((item) => normalizeText(item.textContent))
                })),
                actions: actionNodes.slice(0, 2).map(readActionValue)
            },
            render: function(value) {
                const next = value && typeof value === 'object' ? value : {};
                if (metaNode) applyTextToNode(metaNode, next.meta || '');
                applyTextToNode(titleNode, next.title || '');
                applyTextToNode(descriptionNode, next.description || '');
                if (mainSpecsNode instanceof HTMLElement) {
                    rebuildListItems(mainSpecsNode, next.mainSpecs || []);
                }
                sectionNodes.forEach((section, sectionIndex) => {
                    const sectionValue = next.sections?.[sectionIndex] || {};
                    const sectionTitle = section.querySelector('.automation-product-section__title');
                    const sectionList = section.querySelector('.automation-product-specs');
                    if (sectionTitle) applyTextToNode(sectionTitle, sectionValue.title || '');
                    if (sectionList) rebuildListItems(sectionList, sectionValue.items || []);
                });
                actionNodes.slice(0, 2).forEach((action, actionIndex) => {
                    applyActionValue(action, next.actions?.[actionIndex] || {});
                });
            }
        };
    }

    function createAutomationGalleryBindings(pageMeta, card, index) {
        if (!isAutomationPage(pageMeta) || !(card instanceof HTMLElement)) return [];

        const title = normalizeText(card.querySelector('.automation-product-title')?.textContent || '') || `Товар ${index + 1}`;
        const mainImage = card.querySelector('.automation-product-main [data-main-image], .automation-product-main img');
        const mainLink = card.querySelector('.automation-product-main[data-main-link], .automation-product-main');
        const thumbButtons = Array.from(card.querySelectorAll('.automation-product-thumb'))
            .filter((button) => button instanceof HTMLElement && !button.dataset.inlineAutomationGalleryBound);

        if (!thumbButtons.length) return [];

        const collectionKey = `automationGallery-${pageMeta.key}-${index + 1}`;
        const collectionPath = `pages.${pageMeta.key}.media.${collectionKey}`;
        const defaults = thumbButtons.map((button) => {
            const img = button.querySelector('img');
            return {
                src: normalizeText(button.dataset.thumbSrc || img?.getAttribute('src') || ''),
                alt: normalizeText(button.dataset.thumbAlt || img?.getAttribute('alt') || '')
            };
        });
        assignInlineDefault(collectionPath, defaults);

        return thumbButtons.map((button, imageIndex) => {
            const thumbImage = button.querySelector('img');
            if (!(thumbImage instanceof HTMLImageElement)) return null;
            button.dataset.inlineAutomationGalleryBound = '1';

            return {
                id: `inline-media-${pageMeta.key}-${collectionKey}-${imageIndex + 1}`,
                element: imageIndex === 0 && mainImage instanceof HTMLImageElement ? mainImage : thumbImage,
                type: 'image',
                path: `${collectionPath}.${imageIndex}`,
                collectionPath,
                collectionAllowAdd: false,
                collectionAllowDuplicate: false,
                collectionAllowRemove: false,
                collectionAllowReorder: thumbButtons.length > 1,
                label: imageIndex === 0 ? `Фотоблок "${title}"` : `Фотоблок "${title}" · кадр ${imageIndex + 1}`,
                hint: imageIndex === 0
                    ? 'Галерея карточки автоматики. Можно менять кадры и их порядок.'
                    : `Кадр ${imageIndex + 1} внутри галереи "${title}".`,
                overviewPriority: imageIndex === 0 ? 3 : 8,
                fields: [
                    { key: 'alt', label: 'Описание фото', type: 'textarea', hint: 'Коротко опишите, что изображено на фото.' }
                ],
                directory: INLINE_UPLOAD_DIR,
                defaultValue: defaults[imageIndex],
                render: function(value) {
                    const next = value && typeof value === 'object' ? value : {};
                    const src = normalizeText(next.src || '');
                    const alt = normalizeText(next.alt || '');

                    if (src) {
                        button.dataset.thumbSrc = src;
                        thumbImage.setAttribute('src', src);
                    }
                    thumbImage.removeAttribute('srcset');
                    thumbImage.setAttribute('alt', alt);
                    button.dataset.thumbAlt = alt;

                    if (button.classList.contains('is-active') || (thumbButtons.length === 1 && imageIndex === 0)) {
                        if (mainImage instanceof HTMLImageElement) {
                            if (src) mainImage.setAttribute('src', src);
                            mainImage.removeAttribute('srcset');
                            mainImage.setAttribute('alt', alt);
                        }
                        if (mainLink instanceof HTMLAnchorElement && src) {
                            mainLink.setAttribute('href', src);
                        }
                    }
                }
            };
        }).filter(Boolean);
    }

    function createFixedImageCollectionBindings(pageMeta, config) {
        const images = Array.isArray(config?.images)
            ? config.images.filter((image) => image instanceof HTMLImageElement && !image.dataset.inlineEditId)
            : [];
        if (!images.length) return [];

        const collectionKey = String(config.collectionKey || '').trim();
        const label = String(config.label || '').trim() || 'Фотоблок';
        const hint = String(config.hint || '').trim() || 'Откройте фотоблок и переключайтесь между кадрами внутри одной панели.';
        const collectionPath = `pages.${pageMeta.key}.media.${collectionKey}`;
        const defaults = images.map((image) => ({
            src: String(image.getAttribute('src') || '').trim(),
            alt: String(image.getAttribute('alt') || '').trim()
        }));

        assignInlineDefault(collectionPath, defaults);

        return images.map((image, index) => ({
            id: `inline-media-${pageMeta.key}-${collectionKey}-${index + 1}`,
            element: image,
            type: 'image',
            path: `${collectionPath}.${index}`,
            collectionPath,
            collectionAllowAdd: false,
            collectionAllowDuplicate: false,
            collectionAllowRemove: false,
            collectionAllowReorder: images.length > 1,
            label: index === 0 ? label : `${label} · кадр ${index + 1}`,
            hint: index === 0 ? hint : `Кадр ${index + 1} внутри фотоблока «${label}».`,
            overviewPriority: index === 0 ? Number(config.overviewPriority || 3) : 8,
            fields: [
                {
                    key: 'alt',
                    label: 'Описание фото',
                    type: 'textarea',
                    hint: 'Коротко опишите, что изображено на фото.'
                }
            ],
            directory: INLINE_UPLOAD_DIR,
            defaultValue: defaults[index],
            render: function(value) {
                applyImageValue(image, value);
            }
        }));
    }

    function applyImageValue(image, value) {
        if (!(image instanceof HTMLImageElement)) return;

        const nextValue = value && typeof value === 'object' ? value : {};
        const src = String(nextValue.src || '').trim();
        const alt = String(nextValue.alt || '').trim();

        if (src) {
            image.setAttribute('src', src);
            const picture = image.closest('picture');
            if (picture instanceof HTMLPictureElement) {
                picture.querySelectorAll('source').forEach((source) => {
                    source.setAttribute('srcset', src);
                });
            }
            const imageLink = image.closest('a[href]');
            if (imageLink instanceof HTMLAnchorElement) {
                imageLink.setAttribute('href', src);
            }
        }
        image.removeAttribute('srcset');
        image.setAttribute('alt', alt);
    }

    function collectPageTextBindings(pageMeta) {
        return Array.from(document.querySelectorAll(GENERIC_TEXT_SELECTOR))
            .filter(isMeaningfulTextElement)
            .filter((element) => !element.dataset.inlineEditId)
            .map((element, index) => ({
                element,
                type: 'text',
                path: `${nextBindingPath(element, pageMeta.key, 'text')}.value`,
                label: buildTextLabel(element, index),
                hint: buildTextHint(element),
                overviewPriority: getTextOverviewPriority(element),
                defaultValue: String(element.textContent || '').trim(),
                render: function(value) {
                    applyTextToNode(element, value);
                }
            }));
    }

    function collectPageImageBindings(pageMeta) {
        return Array.from(document.querySelectorAll(GENERIC_IMAGE_SELECTOR))
            .filter(isEditableImage)
            .filter((element) => !element.dataset.inlineEditId)
            .map((element, index) => ({
                element,
                type: 'image',
                path: nextBindingPath(element, pageMeta.key, 'image'),
                label: buildImageLabel(element, index),
                hint: 'Фото на странице. Можно заменить файл и поправить описание.',
                overviewPriority: getImageOverviewPriority(element),
                fields: [
                    {
                        key: 'alt',
                        label: 'Описание фото',
                        type: 'textarea',
                        hint: 'Коротко опишите, что изображено на фото.'
                    }
                ],
                directory: INLINE_UPLOAD_DIR,
                defaultValue: {
                    src: String(element.getAttribute('src') || '').trim(),
                    alt: String(element.getAttribute('alt') || '').trim()
                },
                render: function(value) {
                    applyImageValue(element, value);
                }
            }));
    }

    function collectPageActionBindings(pageMeta) {
        return Array.from(document.querySelectorAll(GENERIC_ACTION_SELECTOR))
            .filter(isEditableAction)
            .filter((element) => !element.dataset.inlineEditId)
            .map((element, index) => ({
                element,
                type: 'object',
                path: nextBindingPath(element, pageMeta.key, 'action'),
                label: buildActionLabel(element, index),
                hint: 'Текст и ссылка у кнопки или действия внутри страницы.',
                overviewPriority: getActionOverviewPriority(element),
                fields: [
                    { key: 'label', label: 'Текст кнопки' },
                    { key: 'href', label: 'Ссылка', hint: 'Можно оставить пустым для кнопки без ссылки.' },
                    { key: 'icon', label: 'Иконка кнопки' },
                    { key: 'style', label: 'Стиль кнопки', hint: 'primary/secondary/outline' }
                ],
                defaultValue: readActionValue(element),
                render: function(value) {
                    applyActionValue(element, value);
                }
            }));
    }

    function collectPageFaqBindings(pageMeta) {
        return Array.from(document.querySelectorAll('.faq-item, .faq-card'))
            .map((item, index) => {
                if (!(item instanceof HTMLElement) || !isElementVisible(item) || isIgnoredElement(item)) {
                    return null;
                }
                if (item.dataset.inlineEditId) {
                    return null;
                }

                const questionNode = item.querySelector('.faq-question, summary');
                const answerNode = item.querySelector('.faq-answer p, .faq-answer, .faq-card__answer p, .faq-card__answer');

                if (!(questionNode instanceof HTMLElement) || !(answerNode instanceof HTMLElement)) {
                    return null;
                }

                const question = normalizeText(questionNode.textContent || '');
                const answer = normalizeText(answerNode.textContent || '');

                if (!question || !answer) {
                    return null;
                }

                return {
                    element: [questionNode, answerNode],
                    type: 'object',
                    path: nextBindingPath(item, pageMeta.key, 'faq'),
                    label: buildFaqLabel(question, index),
                    hint: 'Пара вопрос и ответ в блоке FAQ.',
                    overviewPriority: 6,
                    fields: [
                        { key: 'question', label: 'Вопрос', type: 'textarea' },
                        { key: 'answer', label: 'Ответ', type: 'textarea' }
                    ],
                    defaultValue: {
                        question,
                        answer
                    },
                    render: function(value) {
                        const nextValue = value && typeof value === 'object' ? value : {};
                        applyTextToNode(questionNode, nextValue.question || '');
                        applyTextToNode(answerNode, nextValue.answer || '');
                    }
                };
            })
            .filter(Boolean);
    }

    function collectSpecialModuleBindings(pageMeta) {
        const bindings = [];

        if (pageMeta.key === 'home') {
            const heroBinding = createHomeHeroModuleBinding(pageMeta);
            if (heroBinding) bindings.push(heroBinding);

            const statementBinding = createHomeStatementModuleBinding(pageMeta);
            if (statementBinding) bindings.push(statementBinding);

            const panelCards = Array.from(document.querySelectorAll('.panel-scene__card'));
            panelCards.forEach((card, index) => {
                const panelBinding = createHomePanelSceneModuleBinding(pageMeta, card, index);
                if (panelBinding) bindings.push(panelBinding);
            });

            const routeBinding = createHomeRouteSceneModuleBinding(pageMeta);
            if (routeBinding) bindings.push(routeBinding);

            const reviewsBinding = createHomeReviewsModuleBinding(pageMeta);
            if (reviewsBinding) bindings.push(reviewsBinding);

            const brandsBinding = createHomeBrandsModuleBinding(pageMeta);
            if (brandsBinding) bindings.push(brandsBinding);

            const requestBinding = createHomeRequestModuleBinding(pageMeta);
            if (requestBinding) bindings.push(requestBinding);

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'homeCatalogScene',
                label: 'Фотоблок "Каталог конструкций"',
                hint: 'Слайды первой большой сцены на главной. Можно менять кадры и их порядок.',
                overviewPriority: 3,
                images: Array.from(document.querySelectorAll('.panel-scene__card--dark .panel-scene__image'))
            }));

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'homePowderScene',
                label: 'Фотоблок "Порошковая покраска"',
                hint: 'Слайды второй большой сцены на главной. Можно менять кадры и их порядок.',
                overviewPriority: 3,
                images: Array.from(document.querySelectorAll('.panel-scene__card--powder .panel-scene__image, .panel-scene__card--light .panel-scene__image'))
            }));

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'homeBrands',
                label: 'Фотоблок "Логотипы брендов"',
                hint: 'Логотипы брендов в нижнем блоке главной. Можно менять порядок и картинки.',
                overviewPriority: 4,
                images: Array.from(document.querySelectorAll('.home-tail__brand img'))
            }));
        }

        if (isAutomationPage(pageMeta)) {
            const backLinkBinding = createAutomationBackLinkModuleBinding(pageMeta);
            if (backLinkBinding) bindings.push(backLinkBinding);

            const catalogHeroBinding = createAutomationCatalogHeroModuleBinding(pageMeta);
            if (catalogHeroBinding) bindings.push(catalogHeroBinding);

            const sidebarBinding = createAutomationSidebarModuleBinding(pageMeta);
            if (sidebarBinding) bindings.push(sidebarBinding);

            const panelHeaderBinding = createAutomationPanelHeaderModuleBinding(pageMeta);
            if (panelHeaderBinding) bindings.push(panelHeaderBinding);

            const faqIntroBinding = createAutomationFaqIntroModuleBinding(pageMeta);
            if (faqIntroBinding) bindings.push(faqIntroBinding);

            const automationCards = Array.from(document.querySelectorAll('.automation-product-card'));
            automationCards.forEach((card, index) => {
                const productBinding = createAutomationProductCardModuleBinding(pageMeta, card, index);
                if (productBinding) bindings.push(productBinding);
                bindings.push(...createAutomationGalleryBindings(pageMeta, card, index));
            });

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'automationGuide',
                label: 'Фотоблок "Инструкция по автоматике"',
                hint: 'Фото в нижнем пояснительном блоке автоматики. Можно заменить кадры и подписи к изображениям.',
                overviewPriority: 5,
                images: Array.from(document.querySelectorAll('.automation-guide__gallery img'))
            }));
        }

        if (pageMeta.key === 'gallery') {
            bindings.push(...createGalleryFilterModuleBindings(pageMeta));
        }

        const galleryCta = document.querySelector('.order-cta');
        if (pageMeta.key === 'gallery' && galleryCta instanceof HTMLElement && !galleryCta.dataset.inlineEditId) {
            const eyebrowNode = galleryCta.querySelector('.order-cta__eyebrow');
            const titleNode = galleryCta.querySelector('.order-cta__copy h2');
            const copyNode = galleryCta.querySelector('.order-cta__copy > p:not(.order-cta__eyebrow)');
            const primaryNode = galleryCta.querySelector('.order-cta__button--primary');
            const secondaryNode = galleryCta.querySelector('.order-cta__button--secondary');
            const proofLabelNode = galleryCta.querySelector('.order-cta__proof-label');
            const proofValueNode = galleryCta.querySelector('.order-cta__proof-number');
            const proofNoteNode = galleryCta.querySelector('.order-cta__proof-note');
            const proofMetaNode = galleryCta.querySelector('.order-cta__proof-meta');

            if (eyebrowNode && titleNode && copyNode && primaryNode && secondaryNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-final-cta`,
                    element: galleryCta,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'CTA-блок',
                    path: `pages.${pageMeta.key}.modules.finalCta`,
                    label: 'Финальный блок галереи',
                    hint: 'Главный завершающий блок с двумя действиями и proof-частью справа.',
                    overviewPriority: 1,
                    fields: [
                        { key: 'eyebrow', label: 'Подпись сверху' },
                        { key: 'title', label: 'Заголовок', type: 'textarea' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'primary.label', label: 'Главная кнопка' },
                        { key: 'primary.href', label: 'Ссылка главной кнопки' },
                        { key: 'primary.icon', label: 'Главная кнопка — иконка' },
                        { key: 'primary.style', label: 'Главная кнопка — стиль кнопки', hint: 'primary/secondary/outline' },
                        { key: 'secondary.label', label: 'Вторая кнопка' },
                        { key: 'secondary.href', label: 'Ссылка второй кнопки' },
                        { key: 'secondary.icon', label: 'Вторая кнопка — иконка' },
                        { key: 'secondary.style', label: 'Вторая кнопка — стиль кнопки', hint: 'primary/secondary/outline' },
                        { key: 'proof.label', label: 'Подпись proof' },
                        { key: 'proof.value', label: 'Большое значение' },
                        { key: 'proof.note', label: 'Нижняя подпись' },
                        { key: 'proof.meta', label: 'Мета-строка', type: 'textarea' }
                    ],
                    defaultValue: {
                        eyebrow: normalizeText(eyebrowNode.textContent),
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        primary: readActionValue(primaryNode),
                        secondary: readActionValue(secondaryNode),
                        proof: {
                            label: normalizeText(proofLabelNode?.textContent || ''),
                            value: normalizeText(proofValueNode?.textContent || ''),
                            note: normalizeText(proofNoteNode?.textContent || ''),
                            meta: normalizeText(proofMetaNode?.textContent || '')
                        }
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(eyebrowNode, next.eyebrow || '');
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        applyActionValue(primaryNode, next.primary || {});
                        applyActionValue(secondaryNode, next.secondary || {});
                        if (proofLabelNode) applyTextToNode(proofLabelNode, next.proof?.label || '');
                        if (proofValueNode) applyTextToNode(proofValueNode, next.proof?.value || '');
                        if (proofNoteNode) applyTextToNode(proofNoteNode, next.proof?.note || '');
                        if (proofMetaNode) applyTextToNode(proofMetaNode, next.proof?.meta || '');
                    }
                });
            }
        }

        const catalogAssistant = document.querySelector('.catalog-assistant');
        if (pageMeta.key === 'services' && catalogAssistant instanceof HTMLElement && !catalogAssistant.dataset.inlineEditId) {
            const eyebrowNode = catalogAssistant.querySelector('[data-catalog-assistant-eyebrow]');
            const titleNode = catalogAssistant.querySelector('[data-catalog-assistant-title]');
            const copyNode = catalogAssistant.querySelector('[data-catalog-assistant-copy]');
            const pointsNode = catalogAssistant.querySelector('[data-catalog-assistant-points]');
            const statusNode = catalogAssistant.querySelector('.catalog-assistant__status');
            const primaryNode = catalogAssistant.querySelector('[data-catalog-assistant-primary]');
            const secondaryNode = catalogAssistant.querySelector('[data-catalog-assistant-secondary]');
            const metaLinks = Array.from(catalogAssistant.querySelectorAll('.catalog-assistant__meta a'));

            if (eyebrowNode && titleNode && copyNode && pointsNode && primaryNode && secondaryNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-catalog-assistant`,
                    element: catalogAssistant,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Помощник каталога',
                    path: `pages.${pageMeta.key}.modules.catalogAssistant`,
                    label: 'Блок-помощник каталога',
                    hint: 'Нижний блок с советом, короткими пунктами и двумя действиями.',
                    overviewPriority: 1,
                    fields: [
                        { key: 'eyebrow', label: 'Подпись сверху' },
                        { key: 'title', label: 'Заголовок', type: 'textarea' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'points', label: 'Пункты', type: 'list', hint: 'Каждый пункт с новой строки.' },
                        { key: 'status', label: 'Статус справа' },
                        { key: 'primary.label', label: 'Главное действие' },
                        { key: 'primary.href', label: 'Ссылка главного действия' },
                        { key: 'primary.icon', label: 'Главное действие — иконка' },
                        { key: 'primary.style', label: 'Главное действие — стиль кнопки', hint: 'primary/secondary/outline' },
                        { key: 'secondary.label', label: 'Второе действие' },
                        { key: 'secondary.href', label: 'Ссылка второго действия' },
                        { key: 'secondary.icon', label: 'Второе действие — иконка' },
                        { key: 'secondary.style', label: 'Второе действие — стиль кнопки', hint: 'primary/secondary/outline' },
                        { key: 'contactPhone.label', label: 'Телефон' },
                        { key: 'contactPhone.href', label: 'Ссылка телефона' },
                        { key: 'contactEmail.label', label: 'Почта' },
                        { key: 'contactEmail.href', label: 'Ссылка почты' }
                    ],
                    defaultValue: {
                        eyebrow: normalizeText(eyebrowNode.textContent),
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        points: Array.from(pointsNode.querySelectorAll('span')).map((item) => normalizeText(item.textContent)),
                        status: normalizeText(statusNode?.textContent || ''),
                        primary: readActionValue(primaryNode),
                        secondary: readActionValue(secondaryNode),
                        contactPhone: {
                            label: normalizeText(metaLinks[0]?.textContent || ''),
                            href: String(metaLinks[0]?.getAttribute('href') || '').trim()
                        },
                        contactEmail: {
                            label: normalizeText(metaLinks[1]?.textContent || ''),
                            href: String(metaLinks[1]?.getAttribute('href') || '').trim()
                        }
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(eyebrowNode, next.eyebrow || '');
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        pointsNode.replaceChildren(...toListValue(next.points).map((point) => {
                            const span = document.createElement('span');
                            span.textContent = point;
                            return span;
                        }));
                        if (statusNode) applyTextToNode(statusNode, next.status || '');
                        applyActionValue(primaryNode, next.primary || {});
                        applyActionValue(secondaryNode, next.secondary || {});
                        if (metaLinks[0]) {
                            applyActionText(metaLinks[0], next.contactPhone?.label || '');
                            if (next.contactPhone?.href) metaLinks[0].setAttribute('href', String(next.contactPhone.href).trim());
                        }
                        if (metaLinks[1]) {
                            applyActionText(metaLinks[1], next.contactEmail?.label || '');
                            if (next.contactEmail?.href) metaLinks[1].setAttribute('href', String(next.contactEmail.href).trim());
                        }
                    }
                });
            }
        }

        const pricingPlaybook = document.querySelector('.pricing-playbook');
        if (pageMeta.key === 'prices' && pricingPlaybook instanceof HTMLElement && !pricingPlaybook.dataset.inlineEditId) {
            const eyebrowNode = pricingPlaybook.querySelector('.pricing-playbook__eyebrow');
            const titleNode = pricingPlaybook.querySelector('.pricing-playbook__title');
            const copyNode = pricingPlaybook.querySelector('.pricing-playbook__copy');
            const chipsNode = pricingPlaybook.querySelector('.pricing-playbook__chips');

            if (eyebrowNode && titleNode && copyNode && chipsNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-pricing-playbook`,
                    element: pricingPlaybook,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Сценарий расчёта',
                    path: `pages.${pageMeta.key}.modules.pricingPlaybook`,
                    label: 'Блок "Как считаем"',
                    hint: 'Главный блок о том, как складывается стоимость и что можно прислать для расчёта.',
                    overviewPriority: 1,
                    fields: [
                        { key: 'eyebrow', label: 'Подпись сверху' },
                        { key: 'title', label: 'Заголовок', type: 'textarea' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'chips', label: 'Короткие опоры', type: 'list', hint: 'Каждый пункт с новой строки.' }
                    ],
                    defaultValue: {
                        eyebrow: normalizeText(eyebrowNode.textContent),
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        chips: Array.from(chipsNode.querySelectorAll('span')).map((item) => normalizeText(item.textContent))
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(eyebrowNode, next.eyebrow || '');
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        chipsNode.replaceChildren(...toListValue(next.chips).map((chip) => {
                            const span = document.createElement('span');
                            span.textContent = chip;
                            return span;
                        }));
                    }
                });
            }
        }

        const pricingEstimateCard = document.querySelector('.pricing-estimate-card');
        if (pageMeta.key === 'prices' && pricingEstimateCard instanceof HTMLElement && !pricingEstimateCard.dataset.inlineEditId) {
            const kickerNode = pricingEstimateCard.querySelector('.price-card-kicker');
            const titleNode = pricingEstimateCard.querySelector('h2');
            const copyNode = pricingEstimateCard.querySelector('.pricing-estimate-card__intro > p:last-of-type');
            const pointsNode = pricingEstimateCard.querySelector('.calculator-points');
            const actionNode = pricingEstimateCard.querySelector('.pricing-estimate-card__action');
            const contactLabelNode = pricingEstimateCard.querySelector('.calculator-contact__label');
            const contactLinks = Array.from(pricingEstimateCard.querySelectorAll('.calculator-contact__links a'));

            if (kickerNode && titleNode && copyNode && pointsNode && actionNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-estimate-card`,
                    element: pricingEstimateCard,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'CTA-блок',
                    path: `pages.${pageMeta.key}.modules.estimateCard`,
                    label: 'Блок "Быстрый расчёт"',
                    hint: 'Правая карточка с быстрым расчётом, пунктами и кнопкой.',
                    overviewPriority: 1,
                    fields: [
                        { key: 'kicker', label: 'Подпись сверху' },
                        { key: 'title', label: 'Заголовок', type: 'textarea' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'points', label: 'Пункты', type: 'list', hint: 'Каждый пункт с новой строки.' },
                        { key: 'action.label', label: 'Текст кнопки' },
                        { key: 'action.href', label: 'Ссылка кнопки' },
                        { key: 'action.icon', label: 'Иконка кнопки' },
                        { key: 'action.style', label: 'Стиль кнопки', hint: 'primary/secondary/outline' },
                        { key: 'contactLabel', label: 'Подпись под кнопкой' },
                        { key: 'phones.primary.label', label: 'Первый телефон' },
                        { key: 'phones.primary.href', label: 'Ссылка первого телефона' },
                        { key: 'phones.secondary.label', label: 'Второй телефон' },
                        { key: 'phones.secondary.href', label: 'Ссылка второго телефона' }
                    ],
                    defaultValue: {
                        kicker: normalizeText(kickerNode.textContent),
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        points: Array.from(pointsNode.querySelectorAll('li')).map((item) => normalizeText(item.textContent)),
                        action: readActionValue(actionNode),
                        contactLabel: normalizeText(contactLabelNode?.textContent || ''),
                        phones: {
                            primary: {
                                label: normalizeText(contactLinks[0]?.textContent || ''),
                                href: String(contactLinks[0]?.getAttribute('href') || '').trim()
                            },
                            secondary: {
                                label: normalizeText(contactLinks[1]?.textContent || ''),
                                href: String(contactLinks[1]?.getAttribute('href') || '').trim()
                            }
                        }
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(kickerNode, next.kicker || '');
                        replaceIconLineText(titleNode, '.fa-calculator', next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        pointsNode.replaceChildren(...toListValue(next.points).map((point) => {
                            const li = document.createElement('li');
                            li.textContent = point;
                            return li;
                        }));
                        applyActionValue(actionNode, next.action || {});
                        if (contactLabelNode) applyTextToNode(contactLabelNode, next.contactLabel || '');
                        if (contactLinks[0]) {
                            applyActionText(contactLinks[0], next.phones?.primary?.label || '');
                            if (next.phones?.primary?.href) contactLinks[0].setAttribute('href', String(next.phones.primary.href).trim());
                        }
                        if (contactLinks[1]) {
                            applyActionText(contactLinks[1], next.phones?.secondary?.label || '');
                            if (next.phones?.secondary?.href) contactLinks[1].setAttribute('href', String(next.phones.secondary.href).trim());
                        }
                    }
                });
            }
        }

        const pricingClarity = document.querySelector('.pricing-clarity');
        if (pageMeta.key === 'prices' && pricingClarity instanceof HTMLElement && !pricingClarity.dataset.inlineEditId) {
            const badgeNode = pricingClarity.querySelector('.guarantee-badge span');
            const titleNode = pricingClarity.querySelector('.pricing-clarity__lead h3');
            const copyNode = pricingClarity.querySelector('.pricing-clarity__lead p');
            const itemNodes = Array.from(pricingClarity.querySelectorAll('.pricing-clarity__item'));

            if (titleNode && copyNode && itemNodes.length >= 3) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-clarity`,
                    element: pricingClarity,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Составной блок',
                    path: `pages.${pageMeta.key}.modules.pricingClarity`,
                    label: 'Блок "Что фиксируем заранее"',
                    hint: 'Блок о том, что согласуется до старта работ.',
                    overviewPriority: 2,
                    fields: [
                        { key: 'badge', label: 'Плашка слева' },
                        { key: 'title', label: 'Заголовок', type: 'textarea' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'items.0.title', label: 'Карточка 1 — заголовок' },
                        { key: 'items.0.copy', label: 'Карточка 1 — текст', type: 'textarea' },
                        { key: 'items.1.title', label: 'Карточка 2 — заголовок' },
                        { key: 'items.1.copy', label: 'Карточка 2 — текст', type: 'textarea' },
                        { key: 'items.2.title', label: 'Карточка 3 — заголовок' },
                        { key: 'items.2.copy', label: 'Карточка 3 — текст', type: 'textarea' }
                    ],
                    defaultValue: {
                        badge: normalizeText(badgeNode?.textContent || ''),
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        items: itemNodes.slice(0, 3).map((item) => ({
                            title: normalizeText(item.querySelector('h4')?.textContent || ''),
                            copy: normalizeText(item.querySelector('p')?.textContent || '')
                        }))
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        if (badgeNode) applyTextToNode(badgeNode, next.badge || '');
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        itemNodes.slice(0, 3).forEach((item, index) => {
                            const itemValue = next.items?.[index] || {};
                            const itemTitle = item.querySelector('h4');
                            const itemCopy = item.querySelector('p');
                            if (itemTitle) applyTextToNode(itemTitle, itemValue.title || '');
                            if (itemCopy) applyTextToNode(itemCopy, itemValue.copy || '');
                        });
                    }
                });
            }
        }

        const paymentOrderSheet = document.querySelector('.payment-order-sheet');
        if (pageMeta.key === 'payment-documents' && paymentOrderSheet instanceof HTMLElement && !paymentOrderSheet.dataset.inlineEditId) {
            const eyebrowNode = paymentOrderSheet.querySelector('.payment-order-sheet__eyebrow');
            const titleNode = paymentOrderSheet.querySelector('.payment-order-sheet__title');
            const copyNode = paymentOrderSheet.querySelector('.payment-order-sheet__copy');
            const factsNode = paymentOrderSheet.querySelector('.payment-order-sheet__facts');
            const cardNodes = Array.from(paymentOrderSheet.querySelectorAll('.payment-doc-card'));

            if (eyebrowNode && titleNode && copyNode && factsNode && cardNodes.length >= 3) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-order-sheet`,
                    element: paymentOrderSheet,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Сценарий оформления',
                    path: `pages.${pageMeta.key}.modules.orderSheet`,
                    label: 'Главный блок оплаты',
                    hint: 'Главный сценарий страницы с опорами и тремя карточками.',
                    overviewPriority: 1,
                    fields: [
                        { key: 'eyebrow', label: 'Подпись сверху' },
                        { key: 'title', label: 'Заголовок', type: 'textarea' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'facts', label: 'Короткие условия', type: 'list', hint: 'Каждый пункт с новой строки.' },
                        { key: 'cards.0.label', label: 'Карточка 1 — ярлык' },
                        { key: 'cards.0.title', label: 'Карточка 1 — заголовок' },
                        { key: 'cards.0.copy', label: 'Карточка 1 — текст', type: 'textarea' },
                        { key: 'cards.1.label', label: 'Карточка 2 — ярлык' },
                        { key: 'cards.1.title', label: 'Карточка 2 — заголовок' },
                        { key: 'cards.1.copy', label: 'Карточка 2 — текст', type: 'textarea' },
                        { key: 'cards.2.label', label: 'Карточка 3 — ярлык' },
                        { key: 'cards.2.title', label: 'Карточка 3 — заголовок' },
                        { key: 'cards.2.copy', label: 'Карточка 3 — текст', type: 'textarea' }
                    ],
                    defaultValue: {
                        eyebrow: normalizeText(eyebrowNode.textContent),
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        facts: Array.from(factsNode.querySelectorAll('span')).map((item) => normalizeText(item.textContent)),
                        cards: cardNodes.slice(0, 3).map((card) => ({
                            label: normalizeText(card.querySelector('.payment-doc-card__label')?.textContent || ''),
                            title: normalizeText(card.querySelector('h3')?.textContent || ''),
                            copy: normalizeText(card.querySelector('p')?.textContent || '')
                        }))
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(eyebrowNode, next.eyebrow || '');
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        factsNode.replaceChildren(...toListValue(next.facts).map((fact) => {
                            const span = document.createElement('span');
                            span.textContent = fact;
                            return span;
                        }));
                        cardNodes.slice(0, 3).forEach((card, index) => {
                            const item = next.cards?.[index] || {};
                            const labelNode = card.querySelector('.payment-doc-card__label');
                            const cardTitle = card.querySelector('h3');
                            const cardCopy = card.querySelector('p');
                            if (labelNode) applyTextToNode(labelNode, item.label || '');
                            if (cardTitle) applyTextToNode(cardTitle, item.title || '');
                            if (cardCopy) applyTextToNode(cardCopy, item.copy || '');
                        });
                    }
                });
            }
        }

        const paymentDocsKit = document.querySelector('.payment-docs-kit');
        if (pageMeta.key === 'payment-documents' && paymentDocsKit instanceof HTMLElement && !paymentDocsKit.dataset.inlineEditId) {
            const labelNode = paymentDocsKit.querySelector('.payment-docs-kit__label');
            const itemsNode = paymentDocsKit.querySelector('.payment-docs-kit__items');
            const noteNode = paymentDocsKit.querySelector('.payment-docs-kit__note');

            if (labelNode && itemsNode && noteNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-docs-kit`,
                    element: paymentDocsKit,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Документы',
                    path: `pages.${pageMeta.key}.modules.docsKit`,
                    label: 'Блок "Что можем подготовить"',
                    hint: 'Небольшой блок с документами и заметкой для организаций.',
                    overviewPriority: 2,
                    fields: [
                        { key: 'label', label: 'Подпись' },
                        { key: 'items', label: 'Документы', type: 'list', hint: 'Каждый документ с новой строки.' },
                        { key: 'note', label: 'Примечание', type: 'textarea' }
                    ],
                    defaultValue: {
                        label: normalizeText(labelNode.textContent),
                        items: Array.from(itemsNode.querySelectorAll('span')).map((item) => normalizeText(item.textContent)),
                        note: normalizeText(noteNode.textContent)
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(labelNode, next.label || '');
                        itemsNode.replaceChildren(...toListValue(next.items).map((item) => {
                            const span = document.createElement('span');
                            span.textContent = item;
                            return span;
                        }));
                        applyTextToNode(noteNode, next.note || '');
                    }
                });
            }
        }

        const paymentRoute = document.querySelector('.payment-route');
        if (pageMeta.key === 'payment-documents' && paymentRoute instanceof HTMLElement && !paymentRoute.dataset.inlineEditId) {
            const titleNode = paymentRoute.querySelector('.payment-route__heading h2');
            const copyNode = paymentRoute.querySelector('.payment-route__heading p');
            const stepNodes = Array.from(paymentRoute.querySelectorAll('.payment-route__step'));

            if (titleNode && copyNode && stepNodes.length >= 3) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-payment-route`,
                    element: paymentRoute,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Маршрут',
                    path: `pages.${pageMeta.key}.modules.paymentRoute`,
                    label: 'Блок "Как проходит оформление"',
                    hint: 'Маршрут оформления заказа с тремя шагами.',
                    overviewPriority: 2,
                    fields: [
                        { key: 'title', label: 'Заголовок', type: 'textarea' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'steps.0.title', label: 'Шаг 1 — заголовок' },
                        { key: 'steps.0.copy', label: 'Шаг 1 — текст', type: 'textarea' },
                        { key: 'steps.1.title', label: 'Шаг 2 — заголовок' },
                        { key: 'steps.1.copy', label: 'Шаг 2 — текст', type: 'textarea' },
                        { key: 'steps.2.title', label: 'Шаг 3 — заголовок' },
                        { key: 'steps.2.copy', label: 'Шаг 3 — текст', type: 'textarea' }
                    ],
                    defaultValue: {
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        steps: stepNodes.slice(0, 3).map((step) => ({
                            title: normalizeText(step.querySelector('h3')?.textContent || ''),
                            copy: normalizeText(step.querySelector('p')?.textContent || '')
                        }))
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        stepNodes.slice(0, 3).forEach((step, index) => {
                            const stepValue = next.steps?.[index] || {};
                            const stepTitle = step.querySelector('h3');
                            const stepCopy = step.querySelector('p');
                            if (stepTitle) applyTextToNode(stepTitle, stepValue.title || '');
                            if (stepCopy) applyTextToNode(stepCopy, stepValue.copy || '');
                        });
                    }
                });
            }
        }

        const contactsDirectPanel = document.querySelector('.contacts-panel--direct');
        if (pageMeta.key === 'contacts' && contactsDirectPanel instanceof HTMLElement && !contactsDirectPanel.dataset.inlineEditId) {
            const kickerNode = contactsDirectPanel.querySelector('.contacts-panel__kicker');
            const titleNode = contactsDirectPanel.querySelector('.contacts-panel__header h2');
            const copyNode = contactsDirectPanel.querySelector('.contacts-panel__header p');
            const primaryLink = contactsDirectPanel.querySelector('.contacts-primary-link');
            const primaryLabelNode = primaryLink?.querySelector('.contacts-primary-label');
            const primaryStrongNode = primaryLink?.querySelector('strong');
            const primaryNoteNode = primaryLink?.querySelector('.contacts-primary-copy span:last-child');
            const actionNodes = Array.from(contactsDirectPanel.querySelectorAll('.contacts-direct-actions a'));
            const metaNodes = Array.from(contactsDirectPanel.querySelectorAll('.contacts-meta-chip'));

            if (kickerNode && titleNode && copyNode && primaryLink && primaryLabelNode && primaryStrongNode && primaryNoteNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-direct-panel`,
                    element: contactsDirectPanel,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Контактный блок',
                    path: `pages.${pageMeta.key}.modules.directPanel`,
                    label: 'Блок "Связаться напрямую"',
                    hint: 'Левая контактная панель с главным номером и быстрыми действиями.',
                    overviewPriority: 1,
                    fields: [
                        { key: 'kicker', label: 'Подпись сверху' },
                        { key: 'title', label: 'Заголовок', type: 'textarea' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'primary.label', label: 'Подпись у главного номера' },
                        { key: 'primary.number', label: 'Главный номер' },
                        { key: 'primary.note', label: 'Подпись под номером' },
                        { key: 'primary.href', label: 'Ссылка главного номера' },
                        ...actionNodes.slice(0, 2).flatMap((_, actionIndex) => [
                            { key: `actions.${actionIndex}.label`, label: `Кнопка ${actionIndex + 1} — текст` },
                            { key: `actions.${actionIndex}.href`, label: `Кнопка ${actionIndex + 1} — ссылка` },
                            { key: `actions.${actionIndex}.icon`, label: `Кнопка ${actionIndex + 1} — иконка` },
                            { key: `actions.${actionIndex}.style`, label: `Кнопка ${actionIndex + 1} — стиль кнопки`, hint: 'primary/secondary/outline' }
                        ]),
                        { key: 'meta.0.label', label: 'Мета 1 — подпись' },
                        { key: 'meta.0.value', label: 'Мета 1 — значение' },
                        { key: 'meta.1.label', label: 'Мета 2 — подпись' },
                        { key: 'meta.1.value', label: 'Мета 2 — значение' }
                    ],
                    defaultValue: {
                        kicker: normalizeText(kickerNode.textContent),
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        primary: {
                            label: normalizeText(primaryLabelNode.textContent),
                            number: normalizeText(primaryStrongNode.textContent),
                            note: normalizeText(primaryNoteNode.textContent),
                            href: String(primaryLink.getAttribute('href') || '').trim()
                        },
                        actions: actionNodes.slice(0, 2).map(readActionValue),
                        meta: metaNodes.slice(0, 2).map((meta) => ({
                            label: normalizeText(meta.querySelector('.contacts-meta-label')?.textContent || ''),
                            value: normalizeText(meta.querySelector('strong')?.textContent || '')
                        }))
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(kickerNode, next.kicker || '');
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        applyTextToNode(primaryLabelNode, next.primary?.label || '');
                        applyTextToNode(primaryStrongNode, next.primary?.number || '');
                        applyTextToNode(primaryNoteNode, next.primary?.note || '');
                        if (next.primary?.href) primaryLink.setAttribute('href', String(next.primary.href).trim());
                        actionNodes.slice(0, 2).forEach((action, index) => {
                            applyActionValue(action, next.actions?.[index] || {});
                        });
                        metaNodes.slice(0, 2).forEach((meta, index) => {
                            const metaValue = next.meta?.[index] || {};
                            const metaLabel = meta.querySelector('.contacts-meta-label');
                            const metaStrong = meta.querySelector('strong');
                            if (metaLabel) applyTextToNode(metaLabel, metaValue.label || '');
                            if (metaStrong) applyTextToNode(metaStrong, metaValue.value || '');
                        });
                    }
                });
            }
        }

        const contactsRoutePanel = document.querySelector('.contacts-panel--route-copy');
        if (pageMeta.key === 'contacts' && contactsRoutePanel instanceof HTMLElement && !contactsRoutePanel.dataset.inlineEditId) {
            const kickerNode = contactsRoutePanel.querySelector('.contacts-panel__kicker');
            const titleNode = contactsRoutePanel.querySelector('.contacts-panel__header h2');
            const copyNode = contactsRoutePanel.querySelector('.contacts-panel__header p');
            const badgeNodes = Array.from(contactsRoutePanel.querySelectorAll('.contacts-route-badge'));
            const stepNodes = Array.from(contactsRoutePanel.querySelectorAll('.contacts-route-steps li'));
            const actionNodes = Array.from(contactsRoutePanel.querySelectorAll('.contacts-route-actions a'));

            if (kickerNode && titleNode && copyNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-route-panel`,
                    element: contactsRoutePanel,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Маршрут',
                    path: `pages.${pageMeta.key}.modules.routePanel`,
                    label: 'Блок "Как нас найти"',
                    hint: 'Блок проезда с бейджами, шагами и двумя действиями.',
                    overviewPriority: 2,
                    fields: [
                        { key: 'kicker', label: 'Подпись сверху' },
                        { key: 'title', label: 'Заголовок', type: 'textarea' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'badges', label: 'Короткие бейджи', type: 'list', hint: 'Каждый бейдж с новой строки.' },
                        { key: 'steps.0.title', label: 'Шаг 1 — заголовок' },
                        { key: 'steps.0.copy', label: 'Шаг 1 — текст', type: 'textarea' },
                        { key: 'steps.1.title', label: 'Шаг 2 — заголовок' },
                        { key: 'steps.1.copy', label: 'Шаг 2 — текст', type: 'textarea' },
                        { key: 'steps.2.title', label: 'Шаг 3 — заголовок' },
                        { key: 'steps.2.copy', label: 'Шаг 3 — текст', type: 'textarea' },
                        ...actionNodes.slice(0, 2).flatMap((_, actionIndex) => [
                            { key: `actions.${actionIndex}.label`, label: `Кнопка ${actionIndex + 1} — текст` },
                            { key: `actions.${actionIndex}.href`, label: `Кнопка ${actionIndex + 1} — ссылка` },
                            { key: `actions.${actionIndex}.icon`, label: `Кнопка ${actionIndex + 1} — иконка` },
                            { key: `actions.${actionIndex}.style`, label: `Кнопка ${actionIndex + 1} — стиль кнопки`, hint: 'primary/secondary/outline' }
                        ])
                    ],
                    defaultValue: {
                        kicker: normalizeText(kickerNode.textContent),
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        badges: badgeNodes.map((badge) => normalizeText(badge.textContent)),
                        steps: stepNodes.slice(0, 3).map((step) => ({
                            title: normalizeText(step.querySelector('strong')?.textContent || ''),
                            copy: normalizeText(step.querySelector('span')?.textContent || '')
                        })),
                        actions: actionNodes.slice(0, 2).map(readActionValue)
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(kickerNode, next.kicker || '');
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        badgeNodes.forEach((badge, index) => {
                            const icon = badge.querySelector('i')?.cloneNode(true);
                            const nextText = toListValue(next.badges)[index] || '';
                            badge.textContent = '';
                            if (icon) badge.appendChild(icon);
                            badge.append(document.createTextNode(` ${nextText}`));
                        });
                        stepNodes.slice(0, 3).forEach((step, index) => {
                            const stepValue = next.steps?.[index] || {};
                            const stepTitle = step.querySelector('strong');
                            const stepCopy = step.querySelector('span');
                            if (stepTitle) applyTextToNode(stepTitle, stepValue.title || '');
                            if (stepCopy) applyTextToNode(stepCopy, stepValue.copy || '');
                        });
                        actionNodes.slice(0, 2).forEach((action, index) => {
                            applyActionValue(action, next.actions?.[index] || {});
                        });
                    }
                });
            }
        }

        if ((pageMeta.key === 'powder-coating' || pageMeta.key === 'sandblasting')) {
            const serviceCards = Array.from(document.querySelectorAll('.service-detail-card'));
            serviceCards.forEach((card, index) => {
                const binding = createServiceCardModuleBinding(pageMeta, card, index);
                if (binding) bindings.push(binding);
            });
        }

        if (pageMeta.key === 'services') {
            const catalogPanels = Array.from(document.querySelectorAll('.catalog-panel[data-catalog-panel]'));
            catalogPanels.forEach((panel, index) => {
                const panelBinding = createCatalogPanelModuleBinding(pageMeta, panel, index);
                if (panelBinding) bindings.push(panelBinding);

                const paletteBinding = createCatalogPaletteModuleBinding(pageMeta, panel, index);
                if (paletteBinding) bindings.push(paletteBinding);

                bindings.push(...createCatalogPanelGalleryBindings(pageMeta, panel, index));

                const paletteImages = Array.from(panel.querySelectorAll('.catalog-palette-card__gallery img'));
                if (paletteImages.length) {
                    bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                        collectionKey: `catalogPalette-${normalizeText(panel.id) || `catalog-panel-${index + 1}`}`,
                        label: `Палитра "${normalizeText(panel.getAttribute('data-catalog-title')) || `Панель ${index + 1}`}"`,
                        hint: 'Фотоблок палитры и примеров фактуры внутри панели каталога.',
                        overviewPriority: 6,
                        images: paletteImages
                    }));
                }
            });
        }

        const paletteCard = document.querySelector('.palette-card--standalone');
        if (pageMeta.key === 'powder-coating' && paletteCard instanceof HTMLElement && !paletteCard.dataset.inlineEditId) {
            const titleNode = paletteCard.querySelector('.palette-card__info h3');
            const copyNode = paletteCard.querySelector('.palette-card__info p:not(.palette-card__action)');
            const listNode = paletteCard.querySelector('.palette-card__info ul');
            const actionNode = paletteCard.querySelector('.palette-card__link');

            if (titleNode && copyNode && listNode && actionNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-palette-card`,
                    element: paletteCard,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Подбор цвета',
                    path: `pages.${pageMeta.key}.modules.paletteCard`,
                    label: 'Блок "Подобрать цвет и фактуру"',
                    hint: 'Самостоятельный блок с подбором цвета, фактуры и ссылкой в форму.',
                    overviewPriority: 2,
                    fields: [
                        { key: 'title', label: 'Заголовок' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'items', label: 'Пункты', type: 'list', hint: 'Каждый пункт с новой строки.' },
                        { key: 'action.label', label: 'Текст действия' },
                        { key: 'action.href', label: 'Ссылка действия' },
                        { key: 'action.icon', label: 'Иконка действия' },
                        { key: 'action.style', label: 'Стиль действия', hint: 'primary/secondary/outline' }
                    ],
                    defaultValue: {
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        items: Array.from(listNode.querySelectorAll('li')).map((item) => normalizeText(item.textContent)),
                        action: readActionValue(actionNode)
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        replaceIconLineText(titleNode, 'i', next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        listNode.replaceChildren(...toListValue(next.items).map((item) => {
                            const li = document.createElement('li');
                            li.textContent = item;
                            return li;
                        }));
                        applyActionValue(actionNode, next.action || {});
                    }
                });
            }
        }

        const beforeAfterSection = document.querySelector('.before-after-section--sandblast');
        if (pageMeta.key === 'sandblasting' && beforeAfterSection instanceof HTMLElement && !beforeAfterSection.dataset.inlineEditId) {
            const titleNode = beforeAfterSection.querySelector('.before-after-section__header h2');
            const copyNode = beforeAfterSection.querySelector('.before-after-section__header p');
            const beforeLabelNode = beforeAfterSection.querySelector('.before-after__label--before');
            const afterLabelNode = beforeAfterSection.querySelector('.before-after__label--after');
            const noteNode = beforeAfterSection.querySelector('.before-after__note');

            if (titleNode && copyNode && beforeLabelNode && afterLabelNode && noteNode) {
                bindings.push({
                    id: `inline-module-${pageMeta.key}-before-after`,
                    element: beforeAfterSection,
                    type: 'object',
                    editorMode: 'module',
                    editorKindLabel: 'Сравнение',
                    path: `pages.${pageMeta.key}.modules.beforeAfter`,
                    label: 'Блок "До и после очистки"',
                    hint: 'Заголовок, подпись и нижняя заметка compare-блока.',
                    overviewPriority: 2,
                    fields: [
                        { key: 'title', label: 'Заголовок' },
                        { key: 'copy', label: 'Описание', type: 'textarea' },
                        { key: 'beforeLabel', label: 'Подпись "До"' },
                        { key: 'afterLabel', label: 'Подпись "После"' },
                        { key: 'note', label: 'Подпись снизу', type: 'textarea' }
                    ],
                    defaultValue: {
                        title: normalizeText(titleNode.textContent),
                        copy: normalizeText(copyNode.textContent),
                        beforeLabel: normalizeText(beforeLabelNode.textContent),
                        afterLabel: normalizeText(afterLabelNode.textContent),
                        note: normalizeText(noteNode.textContent)
                    },
                    render: function(value) {
                        const next = value && typeof value === 'object' ? value : {};
                        applyTextToNode(titleNode, next.title || '');
                        applyTextToNode(copyNode, next.copy || '');
                        applyTextToNode(beforeLabelNode, next.beforeLabel || '');
                        applyTextToNode(afterLabelNode, next.afterLabel || '');
                        applyTextToNode(noteNode, next.note || '');
                    }
                });
            }
        }

        if (pageMeta.key === 'powder-coating') {
            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'wheelsGallery',
                label: 'Фотоблок "Штампованные диски"',
                hint: 'Один вход для всех кадров в карточке дисков. Внутри панели можно переключаться между фото.',
                overviewPriority: 3,
                images: Array.from(document.querySelectorAll('#wheels .service-image img'))
            }));

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'metalGallery',
                label: 'Фотоблок "Металлоконструкции"',
                hint: 'Главное фото карточки металлоконструкций.',
                overviewPriority: 4,
                images: Array.from(document.querySelectorAll('#metal .service-image img'))
            }));

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'equipmentGallery',
                label: 'Фотоблок "Крупные изделия"',
                hint: 'Слайдер с примерами крупногабаритных изделий внутри одной панели.',
                overviewPriority: 3,
                images: Array.from(document.querySelectorAll('#equipment .equipment-slider__slide'))
            }));

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'paletteGallery',
                label: 'Фотоблок "Подобрать цвет и фактуру"',
                hint: 'Изображение палитры и фактур как отдельный фотоблок.',
                overviewPriority: 4,
                images: Array.from(document.querySelectorAll('.palette-card--standalone .palette-main img'))
            }));
        }

        if (pageMeta.key === 'sandblasting') {
            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'decorGallery',
                label: 'Фотоблок "Штампованные диски"',
                hint: 'Слайдер с примерами пескоструйной очистки дисков.',
                overviewPriority: 3,
                images: Array.from(document.querySelectorAll('#decor .equipment-slider__slide'))
            }));

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'metalGallery',
                label: 'Фотоблок "Металлоконструкции"',
                hint: 'Примеры пескоструйной очистки металлоконструкций.',
                overviewPriority: 4,
                images: Array.from(document.querySelectorAll('#metal .equipment-slider__slide'))
            }));

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'rustGallery',
                label: 'Фотоблок "Очистка от ржавчины"',
                hint: 'Пара кадров в блоке глубокой очистки металла.',
                overviewPriority: 4,
                images: Array.from(document.querySelectorAll('#rust .equipment-slider__slide'))
            }));

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'prepGallery',
                label: 'Фотоблок "Подготовка под покраску"',
                hint: 'Слайдер подготовки поверхности под покрытие.',
                overviewPriority: 3,
                images: Array.from(document.querySelectorAll('#prep .equipment-slider__slide'))
            }));

            bindings.push(...createFixedImageCollectionBindings(pageMeta, {
                collectionKey: 'beforeAfterGallery',
                label: 'Фотоблок "До и после очистки"',
                hint: 'Пара изображений в compare-блоке. Можно менять каждое фото отдельно и переключаться между ними.',
                overviewPriority: 3,
                images: Array.from(document.querySelectorAll('.before-after-section--sandblast .before-after__image'))
            }));
        }

        return bindings;
    }

    function registerDiscoveredBindings(pageMeta) {
        const moduleBindings = collectSpecialModuleBindings(pageMeta);
        const galleryDataBindings = createGalleryWorkDataBindings(pageMeta);
        const pageTextBindings = collectPageTextBindings(pageMeta);
        const pageImageBindings = collectPageImageBindings(pageMeta);
        const pageActionBindings = collectPageActionBindings(pageMeta);
        const pageFaqBindings = collectPageFaqBindings(pageMeta);

        registerInlineSection({
            fileName: INLINE_CONTENT_FILE,
            sectionKey: `page-${pageMeta.key}-text`,
            sectionLabel: `${pageMeta.label} · заголовки и тексты`,
            bindings: pageTextBindings
        });

        registerInlineSection({
            fileName: INLINE_CONTENT_FILE,
            sectionKey: `page-${pageMeta.key}-image`,
            sectionLabel: `${pageMeta.label} · фото`,
            bindings: pageImageBindings
        });

        registerInlineSection({
            fileName: INLINE_CONTENT_FILE,
            sectionKey: `page-${pageMeta.key}-actions`,
            sectionLabel: `${pageMeta.label} · кнопки и действия`,
            bindings: pageActionBindings
        });

        registerInlineSection({
            fileName: INLINE_CONTENT_FILE,
            sectionKey: `page-${pageMeta.key}-faq`,
            sectionLabel: `${pageMeta.label} · вопросы и ответы`,
            bindings: pageFaqBindings
        });

        registerInlineSection({
            fileName: INLINE_CONTENT_FILE,
            sectionKey: `page-${pageMeta.key}-modules`,
            sectionLabel: `${pageMeta.label} · составные блоки`,
            overviewPriority: 1,
            bindings: moduleBindings
        });

        if (galleryDataBindings.length) {
            registerInlineSection({
                fileName: 'gallery-items',
                sectionKey: `page-${pageMeta.key}-works`,
                sectionLabel: `${pageMeta.label} · карточки работ`,
                overviewPriority: 7,
                bindings: galleryDataBindings
            });
        }
    }

    function startDynamicBindingRefresh(pageMeta) {
        let refreshTimer = 0;

        const schedule = () => {
            window.clearTimeout(refreshTimer);
            refreshTimer = window.setTimeout(() => {
                registerDiscoveredBindings(pageMeta);
            }, 220);
        };

        [450, 1400, 2800, 5200].forEach((delay) => {
            window.setTimeout(() => registerDiscoveredBindings(pageMeta), delay);
        });

        const observer = new MutationObserver((mutations) => {
            const hasRelevantMutation = mutations.some((mutation) => {
                return Array.from(mutation.addedNodes || []).some((node) => node instanceof HTMLElement);
            });

            if (hasRelevantMutation) {
                schedule();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.setTimeout(() => observer.disconnect(), 12000);
    }

    onReady(function() {
        injectInlineTheme();

        window.setTimeout(refreshInlineChrome, 120);
        window.setTimeout(refreshInlineChrome, 520);

        const pageMeta = resolvePageMeta();
        registerDiscoveredBindings(pageMeta);
        startDynamicBindingRefresh(pageMeta);

        const brandTaglineNodes = selectMany([
            '.hero-brand__eyebrow',
            '.logo-tagline'
        ]);

        const brandNameNodes = selectMany([
            '.hero-brand__name'
        ]);

        const primaryPhoneNodes = selectMany([
            'a.hero-header-link--primary',
            'a.contact-phone[href*="+79376154629"]',
            'a.contact-phone[href*="79376154629"]',
            'a.home-tail__contact-link--primary',
            '.preview-footer__list--contacts a[href*="+79376154629"]',
            '.preview-footer__list--contacts a[href*="79376154629"]'
        ]);

        const secondaryPhoneNodes = selectMany([
            'a.hero-header-link--secondary',
            'a.contact-phone[href*="+79625542260"]',
            'a.contact-phone[href*="79625542260"]',
            'a.home-tail__contact-link--secondary',
            '.preview-footer__list--contacts a[href*="+79625542260"]',
            '.preview-footer__list--contacts a[href*="79625542260"]'
        ]);

        const addressNodes = selectMany([
            '.hero-header-address span',
            '.contact-address span'
        ]);

        const addressLineNodes = uniqueElements(
            Array.from(document.querySelectorAll('.preview-footer__list--contacts li')).filter((item) => item.querySelector('.fa-map-marker-alt'))
        );

        const emailNodes = selectMany([
            '.preview-footer__list--contacts a[href^="mailto:"]'
        ]);

        const hoursLineNodes = uniqueElements(
            Array.from(document.querySelectorAll('.preview-footer__list--contacts li')).filter((item) => item.querySelector('.fa-clock'))
        );

        const footerCompanyTitleNodes = selectMany([
            '.preview-footer__company'
        ]);

        const footerCompanyColumnNodes = selectMany([
            '.preview-footer__column--company'
        ]);

        const footerCompanyParagraphNodes = selectMany([
            '.preview-footer__column--company .preview-footer__legal-text'
        ]);

        const footerUsefulTitleNodes = selectMany([
            '.preview-footer__column--useful > .preview-footer__label'
        ]);

        const footerUsefulLinkNodes = selectMany([
            '.preview-footer__column--useful .preview-footer__list a'
        ]);

        const telegramNodes = selectMany([
            '.preview-footer__list--contacts a[href*="t.me"]',
            '.preview-footer__list--contacts a[href*="telegram"]'
        ]);

        const maxNodes = selectMany([
            '.preview-footer__list--contacts a[href*="max.ru"]',
            '.preview-footer__list--contacts a[href*="max."]'
        ]);

        const footerBottomNodes = selectMany([
            '.preview-footer__bottom p:first-child'
        ]);

        const footerMetaNodes = selectMany([
            '.preview-footer__bottom p:last-child'
        ]);

        const footerPolicyNodes = selectMany([
            '.preview-footer__bottom p:last-child a'
        ]);

        const footerCompanyParagraphDefault = footerCompanyParagraphNodes.map((node) => normalizeText(node.textContent));
        const footerUsefulLinkBindings = footerUsefulLinkNodes.map((node, index) => ({
            element: node,
            type: 'object',
            path: `footer.usefulLinks.${index}`,
            label: `Полезная ссылка ${index + 1}`,
            hint: 'Текст и переход ссылки в правой колонке футера.',
            fields: [
                { key: 'label', label: 'Текст ссылки' },
                { key: 'href', label: 'Адрес перехода' }
            ],
            defaultValue: {
                label: normalizeText(node.textContent),
                href: node.getAttribute('href') || ''
            },
            render: function(value) {
                applyAnchorValue(node, value || {});
            }
        }));

        registerInlineSection({
            fileName: 'site',
            sectionKey: 'site-shell',
            sectionLabel: 'Шапка и подвал',
            overviewPriority: 2,
            bindings: [
                brandTaglineNodes.length ? {
                    element: brandTaglineNodes,
                    type: 'text',
                    path: 'brand.tagline',
                    label: 'Подпись бренда',
                    hint: 'Короткая строка возле логотипа в шапке.'
                } : null,
                brandNameNodes.length ? {
                    element: brandNameNodes,
                    type: 'text',
                    path: 'brand.name',
                    label: 'Название бренда',
                    hint: 'Основное название компании рядом с логотипом.'
                } : null,
                primaryPhoneNodes.length ? {
                    element: primaryPhoneNodes,
                    type: 'object',
                    path: 'contact.primaryPhone',
                    label: 'Основной телефон',
                    hint: 'Главный номер в шапке, футере и контактных карточках.',
                    fields: [
                        { key: 'label', label: 'Номер' },
                        { key: 'href', label: 'Телефон для кнопки' },
                        { key: 'note', label: 'Подпись', type: 'textarea' }
                    ],
                    render: function(value) {
                        primaryPhoneNodes.forEach((node) => applyPhoneBlock(node, value || {}));
                    }
                } : null,
                secondaryPhoneNodes.length ? {
                    element: secondaryPhoneNodes,
                    type: 'object',
                    path: 'contact.secondaryPhone',
                    label: 'Дополнительный телефон',
                    hint: 'Второй номер в шапке, футере и контактных карточках.',
                    fields: [
                        { key: 'label', label: 'Номер' },
                        { key: 'href', label: 'Телефон для кнопки' },
                        { key: 'note', label: 'Подпись', type: 'textarea' }
                    ],
                    render: function(value) {
                        secondaryPhoneNodes.forEach((node) => applyPhoneBlock(node, value || {}));
                    }
                } : null,
                (addressNodes.length || addressLineNodes.length) ? {
                    element: uniqueElements(addressNodes.concat(addressLineNodes)),
                    type: 'text',
                    path: 'contact.address',
                    label: 'Адрес',
                    hint: 'Адрес производства и точки визита.',
                    render: function(value) {
                        addressNodes.forEach((node) => applyTextToNode(node, value));
                        addressLineNodes.forEach((node) => replaceIconLineText(node, '.fa-map-marker-alt', value));
                    }
                } : null,
                emailNodes.length ? {
                    element: emailNodes,
                    type: 'text',
                    path: 'contact.email',
                    label: 'Электронная почта',
                    hint: 'Почта в футере и контактных блоках.',
                    render: function(value) {
                        const email = normalizeText(value);
                        emailNodes.forEach((node) => applyAnchorValue(node, {
                            label: email,
                            href: email ? `mailto:${email}` : ''
                        }));
                    }
                } : null,
                hoursLineNodes.length ? {
                    element: hoursLineNodes,
                    type: 'text',
                    path: 'contact.hours',
                    label: 'Режим работы',
                    hint: 'Строка с рабочим временем в футере.',
                    render: function(value) {
                        hoursLineNodes.forEach((node) => replaceIconLineText(node, '.fa-clock', value));
                    }
                } : null,
                footerCompanyTitleNodes.length ? {
                    element: footerCompanyTitleNodes,
                    type: 'text',
                    path: 'footer.companyTitle',
                    label: 'Название компании в футере',
                    hint: 'Юридическое имя или краткая подпись компании внизу сайта.'
                } : null,
                (footerCompanyColumnNodes.length || footerCompanyParagraphNodes.length) ? {
                    element: footerCompanyParagraphNodes.length ? footerCompanyParagraphNodes : footerCompanyColumnNodes,
                    type: 'list',
                    path: 'footer.companyParagraphs',
                    label: 'Описание компании в футере',
                    hint: 'Каждый абзац с новой строки. Эти строки идут под логотипом в первой колонке футера.',
                    defaultValue: footerCompanyParagraphDefault,
                    render: function(value) {
                        renderFooterCompanyParagraphs(footerCompanyColumnNodes, value);
                    }
                } : null,
                footerUsefulTitleNodes.length ? {
                    element: footerUsefulTitleNodes,
                    type: 'text',
                    path: 'footer.usefulTitle',
                    label: 'Заголовок полезных ссылок',
                    hint: 'Подпись над правой колонкой ссылок в футере.'
                } : null,
                ...footerUsefulLinkBindings,
                telegramNodes.length ? {
                    element: telegramNodes,
                    type: 'object',
                    path: 'contact.telegram',
                    label: 'Telegram в футере',
                    hint: 'Текст и ссылка Telegram в контактной колонке футера.',
                    fields: [
                        { key: 'label', label: 'Текст ссылки' },
                        { key: 'href', label: 'Адрес перехода' }
                    ],
                    render: function(value) {
                        telegramNodes.forEach((node) => applyAnchorValue(node, value || {}));
                    }
                } : null,
                maxNodes.length ? {
                    element: maxNodes,
                    type: 'object',
                    path: 'contact.max',
                    label: 'Max в футере',
                    hint: 'Текст и ссылка Max в контактной колонке футера.',
                    fields: [
                        { key: 'label', label: 'Текст ссылки' },
                        { key: 'href', label: 'Адрес перехода' }
                    ],
                    render: function(value) {
                        maxNodes.forEach((node) => applyAnchorValue(node, value || {}));
                    }
                } : null,
                footerBottomNodes.length ? {
                    element: footerBottomNodes,
                    type: 'text',
                    path: 'brand.footerCaption',
                    label: 'Подпись копирайта',
                    hint: 'Текст после года в нижней строке футера.',
                    render: function(value) {
                        applyFooterCaption(footerBottomNodes, value);
                    }
                } : null,
                footerPolicyNodes.length ? {
                    element: footerPolicyNodes,
                    type: 'text',
                    path: 'footer.policyLabel',
                    label: 'Текст ссылки политики',
                    hint: 'Название ссылки в самой нижней строке футера.'
                } : null,
                footerPolicyNodes.length ? {
                    element: footerPolicyNodes,
                    type: 'text',
                    path: 'footer.policyHref',
                    label: 'Ссылка политики',
                    hint: 'Адрес страницы политики конфиденциальности.',
                    render: function(value) {
                        footerPolicyNodes.forEach((node) => {
                            if (node instanceof HTMLAnchorElement && normalizeText(value)) {
                                node.setAttribute('href', normalizeText(value));
                            }
                        });
                    }
                } : null,
                footerMetaNodes.length ? {
                    element: footerMetaNodes,
                    type: 'text',
                    path: 'brand.domain',
                    label: 'Домен в футере',
                    hint: 'Домен в нижней строке футера.',
                    render: function(value) {
                        applyFooterDomain(footerMetaNodes, value);
                    }
                } : null
            ]
        });

    });
})();
