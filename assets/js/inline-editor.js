(function() {
    if (window.PokraskaInlineEditor) return;

    const STYLE_ID = 'pokraska-inline-editor-style';
    const ACTIVE_CLASS = 'p-inline-active';
    const DIRTY_CLASS = 'p-inline-dirty';
    const REVEAL_CLASS = 'p-inline-reveal';
    const MODE_CLASS = 'p-inline-mode';
    const RECENT_PAGES_STORAGE_KEY = 'pokraska:inline-recent-pages:v1';
    const DRAFT_FILES_STORAGE_KEY = 'pokraska:inline-draft-files:v1';
    const MAX_RECENT_PAGES = 6;
    const INLINE_ICON_OPTIONS = [
        { value: '', label: 'Без иконки', preview: '—' },
        { value: 'fas fa-phone', label: 'Телефон' },
        { value: 'fab fa-telegram-plane', label: 'Telegram' },
        { value: 'fas fa-envelope', label: 'Почта' },
        { value: 'fas fa-comment-dots', label: 'Сообщение' },
        { value: 'fas fa-location-dot', label: 'Адрес' },
        { value: 'fas fa-clock', label: 'Часы' },
        { value: 'fas fa-arrow-right', label: 'Стрелка' },
        { value: 'fas fa-link', label: 'Ссылка' },
        { value: 'fas fa-check', label: 'Галочка' },
        { value: 'fas fa-circle-check', label: 'Подтверждение' },
        { value: 'fas fa-camera', label: 'Фото' },
        { value: 'fas fa-image', label: 'Картинка' },
        { value: 'fas fa-hammer', label: 'Монтаж' },
        { value: 'fas fa-wrench', label: 'Инструмент' },
        { value: 'fas fa-shield-alt', label: 'Защита' },
        { value: 'fas fa-lock', label: 'Замок' },
        { value: 'fas fa-palette', label: 'Палитра' },
        { value: 'fas fa-paint-roller', label: 'Покраска' },
        { value: 'fas fa-bolt', label: 'Автоматика' },
        { value: 'fas fa-house', label: 'Дом' },
        { value: 'fas fa-truck', label: 'Доставка' }
    ];
    const query = new URLSearchParams(window.location.search);
    const autoEnable = query.get('edit') === '1';
    const requestedFocus = (query.get('focus') || '').trim().toLowerCase();
    const requestedResumeFile = (query.get('resumeFile') || '').trim();
    const requestedResumePath = (query.get('resumePath') || '').trim();
    const wantsInlineEditor = query.get('edit') === '1'
        || ['localhost', '127.0.0.1'].includes(window.location.hostname)
        || window.location.port === '4173';

    if (!wantsInlineEditor) return;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            body.${MODE_CLASS} [data-inline-edit-id] {
                cursor: pointer;
                outline: 2px solid transparent;
                outline-offset: 4px;
                border-radius: 14px;
                scroll-margin-top: 80px;
                transition: outline-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
            }

            body.${MODE_CLASS} [data-inline-edit-id]:hover,
            body.${MODE_CLASS} [data-inline-edit-id].${ACTIVE_CLASS} {
                outline-color: rgba(37, 99, 235, 0.75);
                background-color: rgba(37, 99, 235, 0.05);
                box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18) inset, 0 0 0 8px rgba(37, 99, 235, 0.12);
            }

            body.${MODE_CLASS} [data-inline-edit-id].${ACTIVE_CLASS} {
                outline-color: rgba(37, 99, 235, 0.9);
                background-color: rgba(37, 99, 235, 0.08);
                box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.26) inset, 0 0 0 10px rgba(37, 99, 235, 0.15);
            }

            body.${MODE_CLASS} [data-inline-edit-id].${DIRTY_CLASS} {
                outline-color: rgba(5, 150, 105, 0.82);
                background-color: rgba(5, 150, 105, 0.07);
                box-shadow: 0 0 0 1px rgba(5, 150, 105, 0.22) inset, 0 0 0 10px rgba(5, 150, 105, 0.15);
            }

            body.${MODE_CLASS} [data-inline-edit-id].${REVEAL_CLASS} {
                animation: p-inline-reveal-pulse 0.9s ease;
            }

            @keyframes p-inline-reveal-pulse {
                0% {
                    outline-color: rgba(37, 99, 235, 0.18);
                    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
                }
                35% {
                    outline-color: rgba(37, 99, 235, 0.98);
                    box-shadow: 0 0 0 14px rgba(37, 99, 235, 0.2);
                }
                100% {
                    outline-color: rgba(37, 99, 235, 0.75);
                    box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.12);
                }
            }

            .p-inline-root {
                position: fixed;
                right: 20px;
                bottom: 20px;
                z-index: 5000;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 12px;
                pointer-events: none;
            }

            .p-inline-root > * {
                pointer-events: auto;
            }

            .p-inline-launcher,
            .p-inline-toolbar__btn,
            .p-inline-panel__btn {
                border: 0;
                border-radius: 999px;
                font: inherit;
                cursor: pointer;
            }

            .p-inline-launcher {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 14px 18px;
                background: linear-gradient(135deg, #1e3a8a, #2563eb);
                color: #fff;
                font-weight: 700;
                box-shadow: 0 18px 44px rgba(37, 99, 235, 0.28);
            }

            .p-inline-launcher[hidden],
            .p-inline-toolbar[hidden],
            .p-inline-panel[hidden],
            .p-inline-toast[hidden] {
                display: none;
            }

            .p-inline-toolbar {
                width: min(500px, calc(100vw - 32px));
                background: rgba(15, 23, 42, 0.96);
                color: #e2e8f0;
                border-radius: 20px;
                padding: 14px;
                box-shadow: 0 20px 46px rgba(15, 23, 42, 0.24);
                backdrop-filter: blur(18px);
            }

            .p-inline-toolbar.p-inline-toolbar--compact {
                width: auto;
                max-width: min(520px, calc(100vw - 32px));
                padding: 12px 14px;
                border-radius: 22px;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__top {
                align-items: center;
                gap: 14px;
                flex-wrap: wrap;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__eyebrow {
                margin-bottom: 2px;
                font-size: 12px;
                color: #94a3b8;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__title {
                font-size: 16px;
                white-space: normal;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__meta {
                display: none;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__actions {
                margin-top: 0;
                margin-left: 0;
                justify-content: flex-end;
                flex-wrap: wrap;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__btn {
                padding: 11px 14px;
                font-size: 14px;
            }

            .p-inline-toolbar__top {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
            }

            .p-inline-toolbar__eyebrow,
            .p-inline-panel__kicker {
                display: block;
                margin-bottom: 4px;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.04em;
                text-transform: none;
            }

            .p-inline-toolbar__eyebrow { color: #93c5fd; }
            .p-inline-panel__kicker { color: #64748b; }

            .p-inline-toolbar__title,
            .p-inline-panel__title {
                margin: 0;
                line-height: 1.15;
                overflow-wrap: anywhere;
                text-wrap: balance;
            }

            .p-inline-toolbar__title { font-size: 17px; color: #f8fafc; }
            .p-inline-panel__title { font-size: 22px; color: #0f172a; }

            .p-inline-toolbar__meta,
            .p-inline-panel__meta {
                margin: 6px 0 0;
                font-size: 14px;
                line-height: 1.5;
                overflow-wrap: anywhere;
                text-wrap: pretty;
            }

            .p-inline-toolbar__meta { color: #cbd5e1; }
            .p-inline-panel__meta { color: #64748b; }

            .p-inline-toolbar__actions,
            .p-inline-panel__actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 14px;
            }

            .p-inline-panel__actions {
                position: sticky;
                bottom: -14px;
                z-index: 2;
                margin: 18px -18px -14px;
                padding: 14px 18px;
                border-top: 1px solid rgba(148, 163, 184, 0.16);
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.995));
                backdrop-filter: blur(12px);
            }

            .p-inline-toolbar__btn,
            .p-inline-panel__btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                gap: 8px;
                min-height: 42px;
                padding: 11px 14px;
                background: rgba(255, 255, 255, 0.08);
                color: #f8fafc;
                font-weight: 700;
                text-align: center;
                line-height: 1.2;
            }

            .p-inline-toolbar__btn {
                white-space: nowrap;
                text-wrap: nowrap;
                overflow-wrap: normal;
            }

            .p-inline-panel__btn {
                white-space: nowrap;
                text-wrap: nowrap;
                overflow-wrap: normal;
            }

            .p-inline-panel__btn {
                background: #eef2ff;
                color: #1e3a8a;
                border: 1px solid rgba(148, 163, 184, 0.24);
            }

            .p-inline-panel__btn--danger {
                background: #fff1f2;
                color: #be123c;
                border-color: rgba(244, 63, 94, 0.18);
            }

            .p-inline-panel__btn--danger:hover:not(:disabled) {
                background: #ffe4e6;
            }

            .p-inline-panel__btn:hover:not(:disabled) {
                background: #e0e7ff;
                transform: translateY(-1px);
            }

            .p-inline-toolbar__btn--primary,
            .p-inline-panel__btn--primary {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: #fff;
            }

            .p-inline-panel__btn--primary:hover:not(:disabled) {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: #fff;
            }

            .p-inline-toolbar__btn--soft {
                background: rgba(255, 255, 255, 0.12);
                color: #e2e8f0;
                border: 1px solid rgba(148, 163, 184, 0.24);
            }

            .p-inline-toolbar__btn--soft.is-active {
                background: rgba(96, 165, 250, 0.24);
                color: #eff6ff;
                border-color: rgba(147, 197, 253, 0.5);
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.16);
            }

            .p-inline-toolbar__btn:disabled,
            .p-inline-panel__btn:disabled {
                opacity: 0.55;
                cursor: not-allowed;
            }

            .p-inline-panel__icon-preview {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 10px;
                padding: 12px 14px;
                border-radius: 16px;
                background: #f8fafc;
                border: 1px solid rgba(148, 163, 184, 0.18);
                color: #334155;
                font-size: 14px;
                line-height: 1.35;
            }

            .p-inline-panel__icon-preview-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 38px;
                height: 38px;
                border-radius: 12px;
                background: #e0e7ff;
                color: #1d4ed8;
                font-size: 18px;
                flex: 0 0 auto;
            }

            .p-inline-panel__icon-preview-text {
                display: flex;
                flex-direction: column;
                gap: 2px;
                min-width: 0;
            }

            .p-inline-panel__icon-preview-title {
                font-weight: 700;
                color: #0f172a;
            }

            .p-inline-panel__icon-picker {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
                gap: 8px;
                margin-top: 10px;
            }

            .p-inline-panel__icon-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                min-height: 84px;
                padding: 10px 8px;
                border-radius: 16px;
                border: 1px solid rgba(148, 163, 184, 0.2);
                background: #fff;
                color: #334155;
                cursor: pointer;
                text-align: center;
                font: inherit;
                transition: border-color 0.18s ease, background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
            }

            .p-inline-panel__icon-option:hover {
                border-color: rgba(37, 99, 235, 0.35);
                background: #f8fbff;
                transform: translateY(-1px);
            }

            .p-inline-panel__icon-option.is-active {
                border-color: rgba(37, 99, 235, 0.5);
                background: #eef4ff;
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
                color: #1d4ed8;
            }

            .p-inline-panel__icon-option-symbol {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 34px;
                height: 34px;
                border-radius: 10px;
                background: rgba(37, 99, 235, 0.08);
                font-size: 18px;
            }

            .p-inline-panel__icon-option-label {
                font-size: 12px;
                line-height: 1.25;
                color: inherit;
                overflow-wrap: anywhere;
            }

            .p-inline-toolbar__notice {
                margin-top: 12px;
                padding: 12px 14px;
                border-radius: 14px;
                background: rgba(148, 163, 184, 0.14);
                font-size: 14px;
                line-height: 1.5;
                color: #dbeafe;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__notice {
                display: none;
            }

            .p-inline-panel {
                position: fixed;
                top: 24px;
                right: 24px;
                width: min(420px, calc(100vw - 32px));
                max-height: calc(100vh - 48px);
                overflow: auto;
                overscroll-behavior: contain;
                scrollbar-gutter: stable;
                background: #ffffff;
                border-radius: 24px;
                border: 1px solid rgba(148, 163, 184, 0.24);
                box-shadow: 0 30px 70px rgba(15, 23, 42, 0.18);
                padding: 18px 18px 14px;
                z-index: 5001;
            }

            .p-inline-panel__head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
                position: sticky;
                top: -18px;
                z-index: 2;
                margin: -18px -18px 16px;
                padding: 18px 18px 14px;
                border-radius: 24px 24px 18px 18px;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.995), rgba(255, 255, 255, 0.96));
                border-bottom: 1px solid rgba(148, 163, 184, 0.16);
                backdrop-filter: blur(12px);
            }

            .p-inline-panel__head-actions {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                flex: 0 0 auto;
            }

            .p-inline-panel__back {
                min-height: 40px;
                padding: 0 14px;
                border-radius: 999px;
                border: 1px solid rgba(148, 163, 184, 0.26);
                background: #f8fafc;
                color: #334155;
                font: inherit;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
            }

            .p-inline-panel__close {
                width: 40px;
                height: 40px;
                border-radius: 999px;
                border: 0;
                background: #eef2ff;
                color: #1e3a8a;
                font-size: 18px;
                cursor: pointer;
                flex: 0 0 auto;
            }

            .p-inline-panel__group {
                display: grid;
                gap: 8px;
                margin-bottom: 14px;
            }

            .p-inline-panel__label {
                font-size: 14px;
                font-weight: 700;
                color: #334155;
            }

            .p-inline-panel__control,
            .p-inline-panel__textarea {
                width: 100%;
                border: 1px solid rgba(148, 163, 184, 0.35);
                border-radius: 14px;
                background: #f8fafc;
                color: #0f172a;
                font: inherit;
                font-size: 15px;
                line-height: 1.45;
                padding: 13px 15px;
            }

            .p-inline-panel__textarea {
                min-height: 124px;
                resize: vertical;
            }

            .p-inline-panel__textarea--autosize {
                resize: none;
                overflow-y: hidden;
            }

            .p-inline-panel__hint {
                margin: -2px 0 0;
                font-size: 13px;
                line-height: 1.45;
                color: #64748b;
            }

            .p-inline-panel__collection {
                display: grid;
                gap: 10px;
                margin-bottom: 14px;
                padding: 13px;
                border-radius: 18px;
                background: #f8fafc;
                border: 1px solid rgba(148, 163, 184, 0.2);
            }

            .p-inline-panel__collection-meta {
                margin: 0;
                font-size: 14px;
                line-height: 1.45;
                color: #475569;
            }

            .p-inline-panel__collection-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .p-inline-panel__preview {
                display: grid;
                gap: 10px;
                padding: 13px;
                border-radius: 18px;
                background: #f8fafc;
                border: 1px solid rgba(148, 163, 184, 0.2);
            }

            .p-inline-panel__preview-frame {
                position: relative;
            }

            .p-inline-panel__preview img {
                width: 100%;
                max-height: 240px;
                object-fit: contain;
                border-radius: 14px;
                background: #fff;
            }

            .p-inline-panel__preview-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 42px;
                height: 42px;
                border: 0;
                border-radius: 999px;
                background: rgba(15, 23, 42, 0.82);
                color: #fff;
                font-size: 20px;
                line-height: 1;
                cursor: pointer;
                box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
            }

            .p-inline-panel__preview-nav:disabled {
                opacity: 0.38;
                cursor: not-allowed;
            }

            .p-inline-panel__preview-nav--prev {
                left: 10px;
            }

            .p-inline-panel__preview-nav--next {
                right: 10px;
            }

            .p-inline-panel__preview-index {
                position: absolute;
                left: 50%;
                bottom: 10px;
                transform: translateX(-50%);
                display: inline-flex;
                align-items: center;
                min-height: 28px;
                padding: 0 10px;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.92);
                color: #334155;
                font-size: 13px;
                font-weight: 800;
                box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
            }

            .p-inline-panel__upload-zone {
                display: grid;
                gap: 8px;
                padding: 14px;
                border: 1px dashed rgba(59, 130, 246, 0.34);
                border-radius: 14px;
                background: linear-gradient(180deg, rgba(239, 246, 255, 0.95), rgba(248, 250, 252, 0.98));
                transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
            }

            .p-inline-panel__upload-zone.is-dragover {
                border-color: rgba(37, 99, 235, 0.72);
                background: linear-gradient(180deg, rgba(219, 234, 254, 0.96), rgba(239, 246, 255, 0.98));
                box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
            }

            .p-inline-panel__upload-title {
                font-size: 14px;
                font-weight: 800;
                color: #1e3a8a;
            }

            .p-inline-panel__upload-meta {
                font-size: 13px;
                line-height: 1.45;
                color: #64748b;
            }

            .p-inline-panel__upload-file {
                display: inline-flex;
                align-items: center;
                width: fit-content;
                max-width: 100%;
                padding: 6px 10px;
                border-radius: 999px;
                background: rgba(37, 99, 235, 0.1);
                color: #1d4ed8;
                font-size: 13px;
                font-weight: 800;
                overflow-wrap: anywhere;
            }

            .p-inline-overview {
                position: fixed;
                top: 24px;
                right: 24px;
                width: min(400px, calc(100vw - 32px));
                max-height: calc(100vh - 48px);
                overflow: auto;
                overscroll-behavior: contain;
                scrollbar-gutter: stable;
                background: rgba(255, 255, 255, 0.98);
                border-radius: 24px;
                border: 1px solid rgba(148, 163, 184, 0.24);
                box-shadow: 0 30px 70px rgba(15, 23, 42, 0.18);
                padding: 18px;
                z-index: 5001;
            }

            .p-inline-overview__sticky {
                position: sticky;
                top: -18px;
                z-index: 2;
                margin: -18px -18px 14px;
                padding: 18px 18px 14px;
                border-radius: 24px 24px 18px 18px;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.995), rgba(255, 255, 255, 0.96));
                border-bottom: 1px solid rgba(148, 163, 184, 0.16);
                backdrop-filter: blur(12px);
            }

            .p-inline-overview__head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 12px;
            }

            .p-inline-overview__title {
                margin: 0;
                font-size: 20px;
                line-height: 1.15;
                color: #0f172a;
                text-wrap: balance;
            }

            .p-inline-overview__meta {
                margin: 6px 0 0;
                font-size: 13px;
                line-height: 1.5;
                color: #64748b;
                overflow-wrap: anywhere;
                text-wrap: pretty;
            }

            .p-inline-overview__close {
                width: 40px;
                height: 40px;
                border: 0;
                border-radius: 999px;
                background: #eef2ff;
                color: #1e3a8a;
                font-size: 18px;
                cursor: pointer;
                flex: 0 0 auto;
            }

            .p-inline-overview__search {
                width: 100%;
                padding: 11px 14px;
                border: 1px solid rgba(148, 163, 184, 0.32);
                border-radius: 14px;
                background: #f8fafc;
                color: #0f172a;
                font: inherit;
            }

            .p-inline-overview__search-row {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .p-inline-overview__search-clear {
                flex: 0 0 auto;
                min-width: 38px;
                height: 38px;
                border: 1px solid rgba(148, 163, 184, 0.24);
                border-radius: 12px;
                background: #fff;
                color: #475569;
                font: inherit;
                font-size: 14px;
                font-weight: 800;
                cursor: pointer;
                transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease;
            }

            .p-inline-overview__search-clear:hover {
                border-color: rgba(59, 130, 246, 0.34);
                background: #eff6ff;
                color: #1d4ed8;
            }

            .p-inline-overview__search-clear[hidden] {
                display: none;
            }

            .p-inline-overview__summary {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 12px;
                padding: 10px 12px;
                border-radius: 14px;
                background: #f8fafc;
                border: 1px solid rgba(148, 163, 184, 0.16);
            }

            .p-inline-overview__summary-count {
                font-size: 14px;
                font-weight: 800;
                color: #0f172a;
                overflow-wrap: anywhere;
            }

            .p-inline-overview__summary-hint {
                font-size: 13px;
                line-height: 1.4;
                color: #64748b;
                text-align: right;
            }

            .p-inline-overview__filters {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 12px;
            }

            .p-inline-overview__filter {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 11px;
                border: 1px solid rgba(148, 163, 184, 0.24);
                border-radius: 999px;
                background: #fff;
                color: #334155;
                font: inherit;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
            }

            .p-inline-overview__filter:hover {
                transform: translateY(-1px);
                border-color: rgba(59, 130, 246, 0.34);
                background: #eff6ff;
                color: #1d4ed8;
            }

            .p-inline-overview__filter--active {
                border-color: rgba(59, 130, 246, 0.45);
                background: #dbeafe;
                color: #1d4ed8;
            }

            .p-inline-overview__filter-count {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 20px;
                height: 20px;
                padding: 0 6px;
                border-radius: 999px;
                background: rgba(15, 23, 42, 0.06);
                color: inherit;
                font-size: 12px;
                font-weight: 800;
            }

            .p-inline-overview__body {
                display: grid;
                gap: 14px;
            }

            .p-inline-overview__section {
                display: grid;
                gap: 8px;
            }

            .p-inline-overview__section-title {
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                font-size: 13px;
                font-weight: 800;
                letter-spacing: 0.04em;
                text-transform: none;
                color: #64748b;
            }

            .p-inline-overview__section-stats {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            }

            .p-inline-overview__section-count {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 22px;
                height: 22px;
                padding: 0 8px;
                border-radius: 999px;
                background: #eff6ff;
                color: #1d4ed8;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: normal;
                text-transform: none;
            }

            .p-inline-overview__section-dirty {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 22px;
                height: 22px;
                padding: 0 8px;
                border-radius: 999px;
                background: rgba(5, 150, 105, 0.12);
                color: #047857;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: normal;
                text-transform: none;
            }

            .p-inline-overview__item {
                width: 100%;
                display: grid;
                gap: 10px;
                padding: 13px 14px;
                border: 1px solid rgba(148, 163, 184, 0.2);
                border-radius: 16px;
                background: #fff;
                color: #0f172a;
                overflow: hidden;
                transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
            }

            .p-inline-overview__item:hover {
                transform: translateY(-1px);
                border-color: rgba(96, 165, 250, 0.4);
                box-shadow: 0 12px 28px rgba(37, 99, 235, 0.1);
            }

            .p-inline-overview__item--active {
                border-color: rgba(59, 130, 246, 0.5);
                background: #eff6ff;
                box-shadow: 0 12px 28px rgba(37, 99, 235, 0.14);
            }

            .p-inline-overview__item--dirty {
                border-color: rgba(16, 185, 129, 0.3);
                background: rgba(236, 253, 245, 0.8);
            }

            .p-inline-overview__item-top {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
            }

            .p-inline-overview__item-main {
                flex: 1 1 auto;
                display: grid;
                gap: 5px;
                padding: 0;
                border: 0;
                background: transparent;
                color: inherit;
                text-align: left;
                font: inherit;
                cursor: pointer;
            }

            .p-inline-overview__item-title {
                font-size: 14px;
                font-weight: 800;
                line-height: 1.35;
                color: #0f172a;
                overflow-wrap: anywhere;
            }

            .p-inline-overview__item-actions {
                flex-shrink: 0;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
                justify-content: flex-end;
            }

            .p-inline-overview__item-state {
                flex-shrink: 0;
                display: inline-flex;
                align-items: center;
                min-height: 22px;
                padding: 0 9px;
                border-radius: 999px;
                background: rgba(5, 150, 105, 0.12);
                color: #047857;
                font-size: 12px;
                font-weight: 800;
            }

            .p-inline-overview__item-revert {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 24px;
                padding: 0 10px;
                border: 0;
                border-radius: 999px;
                background: rgba(5, 150, 105, 0.12);
                color: #047857;
                font: inherit;
                font-size: 12px;
                font-weight: 800;
                cursor: pointer;
                transition: background-color 0.18s ease, transform 0.18s ease;
            }

            .p-inline-overview__item-revert:hover {
                background: rgba(5, 150, 105, 0.2);
                transform: translateY(-1px);
            }

            .p-inline-overview__item-meta {
                font-size: 13px;
                line-height: 1.45;
                color: #64748b;
                overflow-wrap: anywhere;
            }

            .p-inline-panel__actions {
                position: sticky;
                bottom: -14px;
                z-index: 2;
                margin: 18px -18px -14px;
                padding: 14px 18px 16px;
                border-top: 1px solid rgba(148, 163, 184, 0.14);
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.995));
                backdrop-filter: blur(12px);
            }

            .p-inline-overview__empty {
                padding: 18px 14px;
                border-radius: 16px;
                background: #f8fafc;
                color: #64748b;
                font-size: 14px;
                line-height: 1.5;
            }

            .p-inline-toast {
                position: fixed;
                left: 50%;
                bottom: 26px;
                transform: translateX(-50%);
                z-index: 5002;
                padding: 12px 16px;
                border-radius: 999px;
                background: rgba(15, 23, 42, 0.94);
                color: #fff;
                font-size: 14px;
                font-weight: 700;
                box-shadow: 0 16px 38px rgba(15, 23, 42, 0.28);
            }

            .p-inline-hover {
                position: fixed;
                z-index: 5003;
                max-width: min(320px, calc(100vw - 24px));
                padding: 8px 12px;
                border-radius: 999px;
                background: rgba(15, 23, 42, 0.94);
                color: #fff;
                font-size: 13px;
                font-weight: 700;
                line-height: 1.3;
                white-space: normal;
                overflow-wrap: anywhere;
                pointer-events: none;
                box-shadow: 0 12px 28px rgba(15, 23, 42, 0.22);
                transform: translateY(-8px);
            }

            .p-inline-hover[hidden] {
                display: none;
            }

            @media (max-width: 900px) {
                .p-inline-root {
                    right: 12px;
                    bottom: 12px;
                    left: 12px;
                    align-items: stretch;
                }

                .p-inline-launcher {
                    width: 100%;
                    justify-content: center;
                }

                .p-inline-toolbar {
                    width: 100%;
                    max-width: none;
                }

                .p-inline-toolbar.p-inline-toolbar--compact {
                    width: 100%;
                    border-radius: 20px;
                    padding: 14px;
                }

                .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__eyebrow {
                    display: block;
                }

                .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__title {
                    font-size: 17px;
                    white-space: normal;
                }

                .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__meta {
                    display: block;
                }

                .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__actions {
                    margin-top: 14px;
                    margin-left: 0;
                    flex-wrap: wrap;
                }

                .p-inline-panel {
                    top: auto;
                    left: 12px;
                    right: 12px;
                    bottom: 88px;
                    width: auto;
                    max-height: calc(100vh - 120px);
                }

                .p-inline-overview {
                    top: auto;
                    left: 12px;
                    right: 12px;
                    bottom: 88px;
                    width: auto;
                    max-height: calc(100vh - 120px);
                }
            }

            @media (max-width: 640px) {
                .p-inline-toolbar {
                    border-radius: 18px;
                }

                .p-inline-toolbar__actions {
                    justify-content: stretch;
                }

                .p-inline-toolbar__btn {
                    flex: 1 1 calc(50% - 6px);
                    white-space: normal;
                    text-wrap: balance;
                }

                .p-inline-toolbar__btn--primary {
                    flex-basis: 100%;
                }

                .p-inline-panel,
                .p-inline-overview {
                    left: 8px;
                    right: 8px;
                    bottom: 80px;
                    max-height: calc(100vh - 96px);
                    border-radius: 20px;
                    padding: 16px 16px 12px;
                }

                .p-inline-panel__head,
                .p-inline-overview__sticky {
                    top: -16px;
                    margin: -16px -16px 14px;
                    padding: 16px 16px 12px;
                    border-radius: 20px 20px 16px 16px;
                }

                .p-inline-panel__actions {
                    margin: 16px -16px -12px;
                    padding: 12px 16px;
                }

                .p-inline-overview__search-row {
                    align-items: stretch;
                }

                .p-inline-overview__search-clear {
                    min-width: 42px;
                    height: auto;
                }
            }

            @media (hover: none), (pointer: coarse) {
                .p-inline-hover {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function cloneData(value) {
        return value == null ? value : JSON.parse(JSON.stringify(value));
    }

    function mergeMissingData(target, source) {
        if (source == null) return target;

        if (Array.isArray(source)) {
            if (!Array.isArray(target) || !target.length) {
                return cloneData(source);
            }

            const nextArray = target.slice();
            source.forEach((item, index) => {
                if (nextArray[index] === undefined || nextArray[index] === null) {
                    nextArray[index] = cloneData(item);
                    return;
                }

                if (item && typeof item === 'object') {
                    nextArray[index] = mergeMissingData(nextArray[index], item);
                }
            });
            return nextArray;
        }

        if (source && typeof source === 'object') {
            const nextObject = target && typeof target === 'object' ? { ...target } : {};
            Object.entries(source).forEach(([key, value]) => {
                if (nextObject[key] === undefined || nextObject[key] === null) {
                    nextObject[key] = cloneData(value);
                    return;
                }

                if (value && typeof value === 'object') {
                    nextObject[key] = mergeMissingData(nextObject[key], value);
                }
            });
            return nextObject;
        }

        return target ?? source;
    }

    function applyPageDefaults(fileName, data) {
        const defaults = window.PokraskaInlineContentDefaults?.[fileName];
        if (!defaults) return data;
        return mergeMissingData(data, defaults);
    }

    function getByPath(source, path) {
        return String(path || '')
            .split('.')
            .filter(Boolean)
            .reduce((value, segment) => (value == null ? value : value[segment]), source);
    }

    function setByPath(target, path, nextValue) {
        const segments = String(path || '').split('.').filter(Boolean);
        if (!segments.length) return;

        let pointer = target;
        for (let index = 0; index < segments.length - 1; index += 1) {
            const segment = segments[index];
            if (pointer[segment] == null || typeof pointer[segment] !== 'object') {
                const nextSegment = segments[index + 1];
                pointer[segment] = /^\d+$/.test(nextSegment) ? [] : {};
            }
            pointer = pointer[segment];
        }

        pointer[segments[segments.length - 1]] = nextValue;
    }

    function escapeRegExp(value) {
        return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function parseIndexedPath(path) {
        const segments = String(path || '').split('.').filter(Boolean);
        const last = segments[segments.length - 1];
        if (!segments.length || !/^\d+$/.test(last)) return null;
        return {
            parentPath: segments.slice(0, -1).join('.'),
            index: Number(last)
        };
    }

    function buildContentUrl(fileName, options = {}) {
        const suffix = options.fresh ? `?t=${Date.now()}` : '';
        return state.apiAvailable
            ? `/api/content/${fileName}${suffix}`
            : `/content/${fileName}.json${suffix}`;
    }

    function readStoredJson(key, fallback) {
        try {
            const raw = window.localStorage?.getItem(key);
            if (!raw) return fallback;
            const parsed = JSON.parse(raw);
            return parsed ?? fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeStoredJson(key, value) {
        try {
            window.localStorage?.setItem(key, JSON.stringify(value));
        } catch (error) {
            // ignore storage failures
        }
    }

    function getCurrentEditHref() {
        const url = new URL(window.location.href);
        url.searchParams.set('edit', '1');
        url.searchParams.delete('focus');
        url.searchParams.delete('resumeFile');
        url.searchParams.delete('resumePath');
        return `${url.pathname}${url.search}`;
    }

    function getCurrentPageTitle() {
        return String(document.title || 'Страница')
            .replace(/\s*\|\s*POKRASKA\.STORE\s*$/i, '')
            .trim() || 'Страница';
    }

    function rememberEditingContext(binding = null) {
        const href = getCurrentEditHref();
        const pageTitle = getCurrentPageTitle();
        const focus = binding ? getBindingPrimaryFocus(binding) : '';
        const nextEntry = {
            href,
            title: pageTitle,
            sectionLabel: binding?.sectionLabel || '',
            bindingLabel: binding?.label || '',
            fileName: binding?.fileName || '',
            path: binding?.path || '',
            focus,
            updatedAt: Date.now()
        };

        const nextPages = [nextEntry]
            .concat(readStoredJson(RECENT_PAGES_STORAGE_KEY, []).filter((item) => item && item.href && item.href !== href))
            .slice(0, MAX_RECENT_PAGES);

        writeStoredJson(RECENT_PAGES_STORAGE_KEY, nextPages);
    }

    function readStoredDraftFiles() {
        const value = readStoredJson(DRAFT_FILES_STORAGE_KEY, {});
        return value && typeof value === 'object' ? value : {};
    }

    function writeStoredDraftFiles(payload) {
        if (!payload || !Object.keys(payload).length) {
            try {
                window.localStorage?.removeItem(DRAFT_FILES_STORAGE_KEY);
            } catch (error) {
                // ignore storage failures
            }
            return;
        }
        writeStoredJson(DRAFT_FILES_STORAGE_KEY, payload);
    }

    const state = {
        enabled: false,
        apiAvailable: false,
        authEnabled: false,
        authenticated: false,
        username: '',
        lastSavedAt: 0,
        restoredDrafts: 0,
        panelReturnToOverview: false,
        requestedFocus,
        overviewOpen: false,
        overviewQuery: '',
        overviewFocus: 'all',
        bindings: [],
        bindingMap: new Map(),
        files: new Map(),
        activeBindingId: '',
        toastTimer: 0
    };

    const ui = {};

    async function checkApiAvailability() {
        try {
            const response = await fetch('/api/health', { cache: 'no-store' });
            if (!response.ok) return false;
            const payload = await response.json();
            return Boolean(payload.ok);
        } catch (error) {
            return false;
        }
    }

    async function checkAuthSession() {
        if (!state.apiAvailable) {
            return { authEnabled: false, authenticated: false, username: '' };
        }

        try {
            const response = await fetch('/api/auth/session', { cache: 'no-store' });
            if (!response.ok) throw new Error('Не удалось проверить вход');
            const payload = await response.json();
            return {
                authEnabled: Boolean(payload.authEnabled),
                authenticated: Boolean(payload.authenticated),
                username: payload.username || ''
            };
        } catch (error) {
            return { authEnabled: false, authenticated: false, username: '' };
        }
    }

    function canSaveInline() {
        if (!state.apiAvailable) return false;
        if (!state.authEnabled) return true;
        return state.authenticated;
    }

    function hasDirtyFiles() {
        return Array.from(state.files.values()).some((entry) => entry.dirty);
    }

    function getDirtyBindings() {
        return getVisibleBindings().filter((binding) => bindingIsDirty(binding));
    }

    function hasDirtyBindings() {
        return getDirtyBindings().length > 0;
    }

    function isSameData(left, right) {
        try {
            return JSON.stringify(left) === JSON.stringify(right);
        } catch (error) {
            return false;
        }
    }

    function showToast(message) {
        if (!ui.toast) return;
        clearTimeout(state.toastTimer);
        ui.toast.textContent = message;
        ui.toast.hidden = false;
        state.toastTimer = window.setTimeout(() => {
            ui.toast.hidden = true;
        }, 2400);
    }

    function createUi() {
        const root = document.createElement('div');
        root.className = 'p-inline-root';
        root.innerHTML = `
            <button class="p-inline-launcher" type="button">
                <i class="fas fa-pen-to-square" aria-hidden="true"></i>
                <span>Редактировать на странице</span>
            </button>
            <div class="p-inline-toolbar" hidden>
                <div class="p-inline-toolbar__top">
                    <div>
                        <span class="p-inline-toolbar__eyebrow">Правка</span>
                        <h2 class="p-inline-toolbar__title">Выберите блок</h2>
                        <p class="p-inline-toolbar__meta">Текст, фото, ссылки и блоки.</p>
                    </div>
                </div>
                <div class="p-inline-toolbar__actions">
                    <button class="p-inline-toolbar__btn" type="button" data-inline-action="admin" hidden>Вход</button>
                    <button class="p-inline-toolbar__btn" type="button" data-inline-action="overview">Обзор</button>
                    <button class="p-inline-toolbar__btn p-inline-toolbar__btn--primary" type="button" data-inline-action="save">Сохранить</button>
                    <button class="p-inline-toolbar__btn p-inline-toolbar__btn--soft" type="button" data-inline-action="revert" hidden>Отменить блок</button>
                    <button class="p-inline-toolbar__btn" type="button" data-inline-action="close">Закрыть</button>
                </div>
                <div class="p-inline-toolbar__notice" hidden></div>
            </div>
        `;

        const panel = document.createElement('aside');
        panel.className = 'p-inline-panel';
        panel.hidden = true;
        panel.innerHTML = `
            <div class="p-inline-panel__head">
                <div>
                    <span class="p-inline-panel__kicker">Редактор</span>
                    <h2 class="p-inline-panel__title">Правка блока</h2>
                    <p class="p-inline-panel__meta"></p>
                </div>
                <div class="p-inline-panel__head-actions">
                    <button class="p-inline-panel__back" type="button" data-inline-panel-action="back" hidden>К обзору</button>
                    <button class="p-inline-panel__close" type="button" aria-label="Закрыть">&times;</button>
                </div>
            </div>
            <form class="p-inline-panel__form"></form>
            <div class="p-inline-panel__actions">
                <button class="p-inline-panel__btn p-inline-panel__btn--danger" type="button" data-inline-panel-action="remove" hidden>Удалить</button>
                <button class="p-inline-panel__btn p-inline-panel__btn--primary" type="button" data-inline-panel-action="apply">Применить</button>
            </div>
        `;

        const overview = document.createElement('aside');
        overview.className = 'p-inline-overview';
        overview.hidden = true;
        overview.innerHTML = `
            <div class="p-inline-overview__sticky">
                <div class="p-inline-overview__head">
                    <div>
                        <span class="p-inline-panel__kicker">Поиск</span>
                        <h2 class="p-inline-overview__title">Обзор страницы</h2>
                        <p class="p-inline-overview__meta">Найдите нужный блок и откройте его.</p>
                    </div>
                    <button class="p-inline-overview__close" type="button" aria-label="Закрыть">&times;</button>
                </div>
                <div class="p-inline-overview__summary">
                    <span class="p-inline-overview__summary-count"></span>
                    <span class="p-inline-overview__summary-hint"></span>
                </div>
                <div class="p-inline-overview__filters"></div>
                <div class="p-inline-overview__search-row">
                    <input class="p-inline-overview__search" type="search" placeholder="Найти секцию, текст, фото или связь">
                    <button class="p-inline-overview__search-clear" type="button" hidden>Очистить</button>
                </div>
            </div>
            <div class="p-inline-overview__body"></div>
        `;

        const toast = document.createElement('div');
        toast.className = 'p-inline-toast';
        toast.hidden = true;

        const hover = document.createElement('div');
        hover.className = 'p-inline-hover';
        hover.hidden = true;

        document.body.appendChild(root);
        document.body.appendChild(panel);
        document.body.appendChild(overview);
        document.body.appendChild(toast);
        document.body.appendChild(hover);

        ui.root = root;
        ui.launcher = root.querySelector('.p-inline-launcher');
        ui.toolbar = root.querySelector('.p-inline-toolbar');
        ui.toolbarTitle = root.querySelector('.p-inline-toolbar__title');
        ui.toolbarMeta = root.querySelector('.p-inline-toolbar__meta');
        ui.toolbarNotice = root.querySelector('.p-inline-toolbar__notice');
        ui.toolbarRevertBtn = root.querySelector('[data-inline-action="revert"]');
        ui.saveBtn = root.querySelector('[data-inline-action="save"]');
        ui.adminBtn = root.querySelector('[data-inline-action="admin"]');
        ui.panel = panel;
        ui.panelKicker = panel.querySelector('.p-inline-panel__kicker');
        ui.panelTitle = panel.querySelector('.p-inline-panel__title');
        ui.panelMeta = panel.querySelector('.p-inline-panel__meta');
        ui.panelForm = panel.querySelector('.p-inline-panel__form');
        ui.panelBackBtn = panel.querySelector('[data-inline-panel-action="back"]');
        ui.panelRemoveBtn = panel.querySelector('[data-inline-panel-action="remove"]');
        ui.panelApplyBtn = panel.querySelector('[data-inline-panel-action="apply"]');
        ui.overview = overview;
        ui.overviewSearch = overview.querySelector('.p-inline-overview__search');
        ui.overviewSearchClear = overview.querySelector('.p-inline-overview__search-clear');
        ui.overviewSummaryCount = overview.querySelector('.p-inline-overview__summary-count');
        ui.overviewSummaryHint = overview.querySelector('.p-inline-overview__summary-hint');
        ui.overviewFilters = overview.querySelector('.p-inline-overview__filters');
        ui.overviewBody = overview.querySelector('.p-inline-overview__body');
        ui.toast = toast;
        ui.hover = hover;
    }

    function getBindingKindLabel(binding) {
        if (!binding) return 'Правка на странице';
        if (binding.editorKindLabel) return binding.editorKindLabel;
        if (binding.type === 'image') return 'Фото';
        if (binding.type === 'list') return 'Список';
        if (binding.type === 'object') return 'Кнопка и ссылка';
        if (binding.type === 'html') return 'Текстовый блок';
        return 'Текст';
    }

    function truncateInlineLabel(value, maxLength = 68) {
        const normalized = String(value || '').replace(/\s+/g, ' ').trim();
        if (normalized.length <= maxLength) return normalized;
        return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
    }

    function getCurrentPageLabel() {
        const rawTitle = String(document.title || '').replace(/\s+/g, ' ').trim();
        if (!rawTitle) return 'Текущая страница';
        const [mainTitle] = rawTitle.split('|').map((part) => part.trim()).filter(Boolean);
        return mainTitle || rawTitle;
    }

    function autosizeTextarea(control) {
        if (!control || control.tagName !== 'TEXTAREA') return;
        control.style.height = 'auto';
        control.style.height = `${Math.max(control.scrollHeight, 124)}px`;
    }

    function matchesRequestedFocus(binding, focus) {
        if (!binding || !focus) return false;

        const label = `${binding.label || ''} ${binding.path || ''} ${binding.hint || ''}`.toLowerCase();
        const hasCollection = Boolean(binding.collectionPath);

        if (focus === 'image') {
            return binding.type === 'image';
        }

        if (focus === 'text') {
            return binding.type === 'text' || binding.type === 'html' || binding.type === 'list';
        }

        if (focus === 'contacts') {
            return /phone|address|email|contact|hours|manager|connect|quickactions|quick_actions|actions/.test(label);
        }

        if (focus === 'collection') {
            return hasCollection || binding.type === 'object' || binding.type === 'list';
        }

        return false;
    }

    function bindingHasLiveElements(binding) {
        return Boolean(binding?.elements?.some((element) => element?.isConnected));
    }

    function getVisibleBindings() {
        return state.bindings.filter((binding) => bindingHasLiveElements(binding));
    }

    function bindingIsDirty(binding) {
        return Boolean(binding?.elements?.some((element) => element?.classList?.contains(DIRTY_CLASS)));
    }

    function collectDirtyPathsForFile(fileName) {
        const paths = state.bindings
            .filter((binding) => binding.fileName === fileName && bindingIsDirty(binding))
            .map((binding) => binding.path);
        return Array.from(new Set(paths));
    }

    function persistDraftFiles() {
        const payload = readStoredDraftFiles();
        state.files.forEach((entry, fileName) => {
            if (payload[fileName]) {
                delete payload[fileName];
            }
        });
        state.files.forEach((entry, fileName) => {
            if (!entry?.dirty) return;
            payload[fileName] = {
                data: cloneData(entry.data),
                sectionLabel: entry.sectionLabel || fileName,
                updatedAt: Date.now(),
                dirtyPaths: collectDirtyPathsForFile(fileName)
            };
        });
        writeStoredDraftFiles(payload);
    }

    function applyStoredDirtyMarks(fileName) {
        const entry = state.files.get(fileName);
        if (!entry?.dirty || !Array.isArray(entry.draftPaths) || !entry.draftPaths.length) return;
        state.bindings.forEach((binding) => {
            if (binding.fileName === fileName && entry.draftPaths.includes(binding.path)) {
                markBindingDirty(binding);
            }
        });
    }

    function getBindingsForFocus(focus) {
        if (!focus) return [];
        if (focus === 'dirty') {
            return getVisibleBindings().filter((binding) => bindingIsDirty(binding));
        }
        return getVisibleBindings().filter((binding) => matchesRequestedFocus(binding, focus));
    }

    function findBindingByRequestedFocus(focus) {
        if (!focus) return null;
        return getBindingsForFocus(focus)[0] || null;
    }

    function findBindingByResumeTarget(fileName, path) {
        if (!fileName || !path) return null;
        return getVisibleBindings().find((binding) => binding.fileName === fileName && binding.path === path) || null;
    }

    function getBindingPrimaryFocus(binding) {
        if (!binding) return '';
        const focusOrder = ['contacts', 'image', 'collection', 'text'];
        return focusOrder.find((focus) => matchesRequestedFocus(binding, focus)) || '';
    }

    function getToolbarJumpDefinitions() {
        const definitions = [
            { focus: 'text', label: 'Текст' },
            { focus: 'image', label: 'Фото' },
            { focus: 'contacts', label: 'Связь' },
            { focus: 'collection', label: 'Секции' }
        ];
        if (getBindingsForFocus('dirty').length) {
            definitions.unshift({ focus: 'dirty', label: 'Правки' });
        }
        return definitions;
    }

    function formatCompactCount(count) {
        const value = Number(count) || 0;
        if (value > 99) return '99+';
        return String(value);
    }

    function encodeHeaderValue(value) {
        return encodeURIComponent(String(value ?? ''));
    }

    function getOverviewFilterDefinitions() {
        const dirtyBindings = getDirtyBindings();
        return [
            { focus: 'all', label: 'Все', bindings: getVisibleBindings() },
            ...(dirtyBindings.length ? [{ focus: 'dirty', label: 'Правки', bindings: dirtyBindings }] : []),
            ...getToolbarJumpDefinitions().map((item) => ({
                ...item,
                bindings: getBindingsForFocus(item.focus)
            }))
        ].filter((item) => item.bindings.length || item.focus === 'all');
    }

    async function jumpToBindingFocus(focus) {
        const matches = getBindingsForFocus(focus);
        if (!matches.length) {
            showToast('На этой странице нет такого типа блоков');
            return;
        }

        const activeIndex = matches.findIndex((binding) => binding.id === state.activeBindingId);
        const nextIndex = activeIndex >= 0
            ? (activeIndex + 1) % matches.length
            : 0;

        const binding = matches[nextIndex];
        await openBinding(binding.id);

        const labels = {
            dirty: 'Правки',
            text: 'Текст',
            image: 'Фото',
            contacts: 'Связь',
            collection: 'Секции'
        };

        showToast(`${labels[focus] || 'Блок'}: ${nextIndex + 1} из ${matches.length}`);
    }

    function getBindingOverviewLabel(binding) {
        const indexed = parseIndexedPath(binding?.path);
        if (indexed && binding?.collectionPath) {
            const noun = binding.type === 'image'
                ? 'Фото'
                : (binding.type === 'object' ? 'Карточка' : 'Элемент');
            return `${binding.label} · ${noun} ${indexed.index + 1}`;
        }

        return binding?.label || 'Блок';
    }

    function getBindingOverviewMeta(binding) {
        const parts = [];
        const kindLabel = getBindingKindLabel(binding);
        if (kindLabel) parts.push(kindLabel);
        return parts.join(' · ');
    }

    function getOverviewBindingPriority(binding) {
        if (!binding) return 999;
        if (state.activeBindingId === binding.id) return 0;
        if (bindingIsDirty(binding)) return 1;
        if (binding.type === 'image') return 2;
        if (binding.type === 'object') return 3;
        if (binding.type === 'list') return 4;
        return 5;
    }

    function getBindingOverviewGroups(queryValue = '', focus = 'all') {
        const queryText = String(queryValue || '').trim().toLowerCase();
        const groups = [];
        const groupMap = new Map();

        getVisibleBindings().forEach((binding) => {
            if (focus === 'dirty' && !bindingIsDirty(binding)) {
                return;
            }

            if (focus && focus !== 'all' && focus !== 'dirty' && !matchesRequestedFocus(binding, focus)) {
                return;
            }

            const searchText = [
                binding.sectionLabel,
                binding.label,
                binding.path,
                binding.hint,
                getBindingKindLabel(binding)
            ].join(' ').toLowerCase();

            if (queryText && !searchText.includes(queryText)) {
                return;
            }

            const key = binding.sectionLabel || binding.fileName || 'Страница';
            if (!groupMap.has(key)) {
                const group = { key, title: key, items: [], dirtyCount: 0 };
                groupMap.set(key, group);
                groups.push(group);
            }

            const group = groupMap.get(key);
            group.items.push(binding);
            if (bindingIsDirty(binding)) {
                group.dirtyCount += 1;
            }
        });

        groups.forEach((group) => {
            group.items.sort((left, right) => {
                const priorityDiff = getOverviewBindingPriority(left) - getOverviewBindingPriority(right);
                if (priorityDiff !== 0) return priorityDiff;
                return getBindingOverviewLabel(left).localeCompare(getBindingOverviewLabel(right), 'ru');
            });
        });

        groups.sort((left, right) => {
            const leftScore = (left.items.some((binding) => state.activeBindingId === binding.id) ? -10 : 0) - left.dirtyCount;
            const rightScore = (right.items.some((binding) => state.activeBindingId === binding.id) ? -10 : 0) - right.dirtyCount;
            if (leftScore !== rightScore) return leftScore - rightScore;
            return left.title.localeCompare(right.title, 'ru');
        });

        return groups;
    }

    function renderOverviewFilters() {
        if (!ui.overviewFilters) return;

        const definitions = getOverviewFilterDefinitions();
        ui.overviewFilters.innerHTML = definitions.map((item) => `
            <button
                class="p-inline-overview__filter${state.overviewFocus === item.focus ? ' p-inline-overview__filter--active' : ''}"
                type="button"
                data-inline-overview-focus="${item.focus}"
            >
                <span>${item.label}</span>
                <span class="p-inline-overview__filter-count">${formatCompactCount(item.bindings.length)}</span>
            </button>
        `).join('');
    }

    function getCountLabel(count, one, few, many) {
        const absolute = Math.abs(Number(count) || 0);
        const remainder10 = absolute % 10;
        const remainder100 = absolute % 100;

        if (remainder10 === 1 && remainder100 !== 11) return one;
        if (remainder10 >= 2 && remainder10 <= 4 && !(remainder100 >= 12 && remainder100 <= 14)) return few;
        return many;
    }

    function updateOverviewSummary(groups) {
        if (!ui.overviewSummaryCount || !ui.overviewSummaryHint) return;

        const totalItems = groups.reduce((sum, group) => sum + group.items.length, 0);
        const totalGroups = groups.length;
        const filterLabels = {
            all: 'все блоки',
            dirty: 'изменённые блоки',
            text: 'текст',
            image: 'фото',
            contacts: 'контакты',
            collection: 'составные блоки'
        };

        ui.overviewSummaryCount.textContent = totalItems
            ? `${totalItems} ${getCountLabel(totalItems, 'блок', 'блока', 'блоков')}`
            : '0 блоков';

        if (!totalItems) {
            ui.overviewSummaryHint.textContent = 'Попробуйте другое слово';
            return;
        }

        const groupPart = `${totalGroups} ${getCountLabel(totalGroups, 'разделе', 'разделах', 'разделах')}`;
        const focusPart = filterLabels[state.overviewFocus] || 'блоки';
        ui.overviewSummaryHint.textContent = state.overviewQuery
            ? `Найдено: ${focusPart} в ${groupPart}`
            : `${getCurrentPageLabel()} · ${focusPart} в ${groupPart}`;
    }

    function renderOverviewPanel() {
        if (!ui.overview) return;

        const shouldShow = state.enabled && state.overviewOpen;
        ui.overview.hidden = !shouldShow;
        if (!shouldShow) return;

        if (ui.overviewSearch) {
            ui.overviewSearch.value = state.overviewQuery;
        }
        if (ui.overviewSearchClear) {
            ui.overviewSearchClear.hidden = !state.overviewQuery;
        }

        renderOverviewFilters();

        const groups = getBindingOverviewGroups(state.overviewQuery, state.overviewFocus);
        if (!ui.overviewBody) return;
        updateOverviewSummary(groups);

        if (!groups.length) {
            ui.overviewBody.innerHTML = '<div class="p-inline-overview__empty">Ничего не найдено. Попробуйте другое слово или очистите поиск.</div>';
            return;
        }

        ui.overviewBody.innerHTML = groups.map((group) => `
            <section class="p-inline-overview__section">
                <h3 class="p-inline-overview__section-title">
                    <span>${escapeHtml(group.title)}</span>
                    <span class="p-inline-overview__section-stats">
                        ${group.dirtyCount ? `<span class="p-inline-overview__section-dirty">Правки ${group.dirtyCount}</span>` : ''}
                        <span class="p-inline-overview__section-count">${group.items.length}</span>
                    </span>
                </h3>
                ${group.items.map((binding) => `
                    <div class="p-inline-overview__item${state.activeBindingId === binding.id ? ' p-inline-overview__item--active' : ''}${bindingIsDirty(binding) ? ' p-inline-overview__item--dirty' : ''}">
                        <div class="p-inline-overview__item-top">
                            <button
                                class="p-inline-overview__item-main"
                                type="button"
                                data-inline-binding-id="${binding.id}"
                            >
                                <span class="p-inline-overview__item-title">${escapeHtml(getBindingOverviewLabel(binding))}</span>
                                <span class="p-inline-overview__item-meta">${escapeHtml(getBindingOverviewMeta(binding))}</span>
                            </button>
                            ${bindingIsDirty(binding) ? `
                                <span class="p-inline-overview__item-actions">
                                    <span class="p-inline-overview__item-state">Изменён</span>
                                    ${isNewUnsavedCollectionBinding(binding)
                                        ? `<button class="p-inline-overview__item-revert" type="button" data-inline-overview-remove="${binding.id}">Удалить</button>`
                                        : `<button class="p-inline-overview__item-revert" type="button" data-inline-overview-revert="${binding.id}">Вернуть</button>`}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </section>
        `).join('');

        const activeItem = ui.overviewBody.querySelector('.p-inline-overview__item--active');
        if (activeItem) {
            window.requestAnimationFrame(() => {
                activeItem.scrollIntoView({ block: 'nearest' });
            });
        }
    }

    function toggleOverview(forceState) {
        state.overviewOpen = typeof forceState === 'boolean'
            ? forceState
            : !state.overviewOpen;

        renderOverviewPanel();

        if (state.overviewOpen && ui.overviewSearch) {
            window.setTimeout(() => {
                ui.overviewSearch.focus();
                ui.overviewSearch.select?.();
            }, 0);
        }
    }

    function getLauncherHref() {
        const currentHref = getCurrentEditHref();
        const params = new URLSearchParams();
        params.set('return', currentHref);
        return `/admin/?${params.toString()}`;
    }

    function renderToolbar() {
        if (!ui.launcher) return;

        const dirtyFilesCount = Array.from(state.files.values()).filter((entry) => entry.dirty).length;
        const dirtyCount = getDirtyBindings().length;
        const pendingPanel = hasPendingPanelChanges();
        const canSave = canSaveInline();
        const hasIssue = !state.apiAvailable || (state.authEnabled && !state.authenticated);
        const activeBinding = state.bindingMap.get(state.activeBindingId) || null;
        const activeSummary = activeBinding
            ? `${getBindingKindLabel(activeBinding)} · ${truncateInlineLabel(activeBinding.label, 62)}`
            : '';
        const canShowToolbarRevert = Boolean(activeBinding && canRevertBinding(activeBinding));
        const canUseToolbarRevert = Boolean(activeBinding && (bindingIsDirty(activeBinding) || hasPendingPanelChanges()));

        ui.launcher.hidden = state.enabled;
        ui.toolbar.hidden = !state.enabled;
        ui.toolbar.classList.toggle('p-inline-toolbar--compact', !hasIssue);
        if (ui.toolbarRevertBtn) {
            ui.toolbarRevertBtn.hidden = !canShowToolbarRevert;
            ui.toolbarRevertBtn.disabled = !canUseToolbarRevert;
            ui.toolbarRevertBtn.classList.toggle('is-active', canUseToolbarRevert);
        }
        ui.saveBtn.disabled = !canSave || (!dirtyFilesCount && !pendingPanel);
        ui.saveBtn.textContent = pendingPanel
            ? 'Сохранить всё'
            : (dirtyCount
                ? `Сохранить ${formatCompactCount(dirtyCount)}`
                : ((dirtyFilesCount || hasIssue) ? 'Сохранить' : 'Готово'));
        if (ui.adminBtn) {
            ui.adminBtn.hidden = !(state.apiAvailable && state.authEnabled && !state.authenticated);
        }

        if (!state.enabled) {
            renderOverviewPanel();
            return;
        }

        if (!state.apiAvailable) {
            ui.toolbarTitle.textContent = 'Нужен сервер сохранения';
            ui.toolbarMeta.textContent = `${getCurrentPageLabel()} · откройте страницу через сервер сохранения, чтобы правки можно было сохранить.`;
            ui.toolbarNotice.hidden = false;
            ui.toolbarNotice.textContent = 'Подсказка: запустите `node scripts/admin-server.js` и откройте адрес, который покажет сервер.';
            renderOverviewPanel();
            return;
        }

        if (state.authEnabled && !state.authenticated) {
            ui.toolbarTitle.textContent = 'Нужен вход';
            ui.toolbarMeta.textContent = `${getCurrentPageLabel()} · откройте панель входа, войдите и вернитесь на страницу.`;
            ui.toolbarNotice.hidden = false;
            ui.toolbarNotice.textContent = 'Кнопка входа откроется справа только в этом состоянии.';
            if (ui.adminBtn) {
                ui.adminBtn.textContent = 'Вход';
            }
            renderOverviewPanel();
            return;
        }

        ui.toolbarTitle.textContent = dirtyCount
            ? `Изменения: ${dirtyCount}`
            : 'Выберите блок';
        ui.toolbarMeta.textContent = activeSummary
            ? (dirtyCount
                ? `Сейчас: ${activeSummary}. Сохраните изменения, когда закончите.`
                : `Сейчас: ${activeSummary}.`)
            : (dirtyCount
                ? 'Сохраните изменения, когда закончите.'
                : (state.lastSavedAt
                    ? `Последнее сохранение: ${new Date(state.lastSavedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
                    : `${getCurrentPageLabel()} · выберите нужное место.`));
        if (ui.adminBtn) {
            ui.adminBtn.textContent = 'Вход';
        }
        ui.toolbarNotice.hidden = true;
        ui.toolbarNotice.textContent = '';
        renderOverviewPanel();
    }

    async function refreshEnvironment() {
        state.apiAvailable = await checkApiAvailability();
        const session = await checkAuthSession();
        state.authEnabled = session.authEnabled;
        state.authenticated = session.authenticated;
        state.username = session.username || '';
        renderToolbar();
    }

    async function restoreDraftsForVisibleBindings() {
        const draftFiles = readStoredDraftFiles();
        const fileNames = Object.keys(draftFiles);
        if (!fileNames.length) return 0;

        const visibleFileNames = Array.from(new Set(
            getVisibleBindings()
                .map((binding) => binding.fileName)
                .filter(Boolean)
        ));

        let restored = 0;
        for (const fileName of visibleFileNames) {
            if (!draftFiles[fileName]) continue;
            const entry = await ensureFileState(fileName, draftFiles[fileName].sectionLabel || fileName);
            state.bindings.forEach((binding) => {
                if (binding.fileName === fileName) {
                    renderBinding(binding);
                }
            });
            applyStoredDirtyMarks(fileName);
            if (entry.dirty) restored += 1;
        }

        return restored;
    }

    function closePanel(options = {}) {
        if (!ui.panel) return true;
        if (!options.skipConfirm && !confirmDiscardPanelChanges()) {
            return false;
        }
        ui.panel.hidden = true;
        state.activeBindingId = '';
        state.panelReturnToOverview = false;
        state.bindings.forEach((binding) => {
            binding.elements.forEach((element) => element.classList.remove(ACTIVE_CLASS));
        });
        renderToolbar();
        return true;
    }

    function clearActiveMarks() {
        state.bindings.forEach((binding) => {
            binding.elements.forEach((element) => element.classList.remove(ACTIVE_CLASS));
        });
    }

    function markBindingDirty(binding) {
        binding.elements.forEach((element) => element.classList.add(DIRTY_CLASS));
    }

    function clearDirtyMarks() {
        state.bindings.forEach((binding) => {
            binding.elements.forEach((element) => element.classList.remove(DIRTY_CLASS));
        });
    }

    function exitEditMode() {
        const dirtyBeforeExit = hasDirtyFiles();
        state.overviewOpen = false;
        state.overviewQuery = '';
        state.enabled = false;
        if (!closePanel()) {
            state.enabled = true;
            return;
        }
        document.body.classList.remove(MODE_CLASS);
        renderToolbar();
        if (dirtyBeforeExit) {
            showToast('Правки не пропадут, пока вкладка открыта. Сохраните их перед выходом.');
        }
    }

    async function enterEditMode() {
        await refreshEnvironment();
        state.enabled = true;
        document.body.classList.add(MODE_CLASS);
        rememberEditingContext();
        state.restoredDrafts = await restoreDraftsForVisibleBindings();
        renderToolbar();

        if (!state.apiAvailable) {
            showToast('Сейчас открыт обычный сервер. Для сохранения нужен сервер сохранения.');
        } else if (state.authEnabled && !state.authenticated) {
            showToast('Сначала откройте панель входа и авторизуйтесь.');
        } else {
            const openedFromFocus = await openRequestedFocusBinding();
            const openedFromResume = !openedFromFocus && await openRequestedResumeBinding();
            if (!openedFromResume) {
                if (state.restoredDrafts) {
                    showToast(`Восстановлены черновики: ${state.restoredDrafts}`);
                } else {
                    showToast('Режим редактирования включён');
                }
            }
        }
    }

    async function ensureFileState(fileName, sectionLabel = '') {
        if (state.files.has(fileName)) {
            return state.files.get(fileName);
        }

        const response = await fetch(buildContentUrl(fileName), { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Не удалось загрузить ${fileName}.json`);
        }

        const rawData = await response.json();
        const originalData = applyPageDefaults(fileName, rawData);
        const draftFiles = readStoredDraftFiles();
        const draftEntry = draftFiles[fileName];
        const data = draftEntry?.data ? cloneData(draftEntry.data) : cloneData(originalData);
        const entry = {
            fileName,
            sectionKey: fileName,
            sectionLabel: sectionLabel || fileName,
            data,
            originalData: cloneData(originalData),
            dirty: Boolean(draftEntry?.data),
            draftPaths: Array.isArray(draftEntry?.dirtyPaths) ? draftEntry.dirtyPaths : []
        };

        state.files.set(fileName, entry);
        return entry;
    }

    function defaultTextRender(value, binding) {
        binding.elements.forEach((element) => {
            element.textContent = value ?? '';
        });
    }

    function defaultListRender(value, binding) {
        const list = Array.isArray(value) ? value : [];
        binding.elements.forEach((element) => {
            element.innerHTML = list.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
        });
    }

    function resolveBindingDefault(binding) {
        if (binding.defaultValue === undefined) {
            return undefined;
        }

        const value = typeof binding.defaultValue === 'function'
            ? binding.defaultValue(binding)
            : binding.defaultValue;

        return cloneData(value);
    }

    function renderBinding(binding) {
        const fileState = state.files.get(binding.fileName);
        if (!fileState) return;

        const storedValue = getByPath(fileState.data, binding.path);
        const nextValue = storedValue === undefined
            ? resolveBindingDefault(binding)
            : cloneData(storedValue);

        if (typeof binding.render === 'function') {
            binding.render(nextValue, binding);
            return;
        }

        if (binding.type === 'list') {
            defaultListRender(nextValue, binding);
            return;
        }

        defaultTextRender(nextValue, binding);
    }

    function rerenderBindingsForPath(fileName, path) {
        state.bindings.forEach((binding) => {
            if (binding.fileName === fileName && binding.path === path) {
                renderBinding(binding);
            }
        });
    }

    function rerenderBindingsForCollection(fileName, collectionPath) {
        const pattern = new RegExp(`^${escapeRegExp(collectionPath)}\\.\\d+$`);
        state.bindings.forEach((binding) => {
            if (binding.fileName === fileName && pattern.test(binding.path)) {
                renderBinding(binding);
            }
        });
    }

    function normalizeBinding(config, sectionConfig, index) {
        const elements = (Array.isArray(config.element) ? config.element : [config.element]).filter(Boolean);
        if (!elements.length || !config.path) return null;

        const id = config.id || `${sectionConfig.fileName}:${config.path}:${index}`;
        const binding = {
            id,
            type: config.type || 'text',
            label: config.label || config.path,
            hint: config.hint || '',
            editorKindLabel: config.editorKindLabel || '',
            fileName: sectionConfig.fileName,
            sectionKey: sectionConfig.sectionKey || sectionConfig.fileName,
            sectionLabel: sectionConfig.sectionLabel || sectionConfig.fileName,
            path: config.path,
            fields: config.fields || [],
            elements,
            render: config.render || null,
            defaultValue: config.defaultValue,
            directory: config.directory || 'assets/images/catalog',
            collectionPath: config.collectionPath || '',
            collectionRender: config.collectionRender || null,
            collectionItemFactory: config.collectionItemFactory || null,
            collectionCreateValue: config.collectionCreateValue
        };

        elements.forEach((element) => {
            if (!(element instanceof HTMLElement)) return;
            element.dataset.inlineEditId = id;
            element.dataset.inlineEditLabel = binding.label;
        });

        return binding;
    }

    function register(sectionConfig) {
        const bindings = (sectionConfig.bindings || [])
            .map((binding, index) => normalizeBinding(binding, sectionConfig, index))
            .filter(Boolean);

        bindings.forEach((binding) => {
            state.bindingMap.set(binding.id, binding);
            state.bindings.push(binding);
            applyStoredDirtyMarks(binding.fileName);
        });

        if (state.enabled) {
            renderToolbar();
        }
    }

    function consumeQueue() {
        const queue = window.PokraskaInlineEditorQueue || [];
        if (!queue.length) return;
        while (queue.length) {
            const entry = queue.shift();
            if (entry) register(entry);
        }
    }

    function createFieldGroup(field, value) {
        const wrapper = document.createElement('div');
        wrapper.className = 'p-inline-panel__group';

        const label = document.createElement('label');
        label.className = 'p-inline-panel__label';
        label.textContent = field.label || field.key;
        wrapper.appendChild(label);

        let control;
        if (field.type === 'textarea' || field.type === 'html' || field.type === 'list') {
            control = document.createElement('textarea');
            control.className = 'p-inline-panel__textarea p-inline-panel__textarea--autosize';
            control.value = field.type === 'list'
                ? (Array.isArray(value) ? value.join('\n') : '')
                : (value ?? '');
            control.addEventListener('input', () => autosizeTextarea(control));
            window.requestAnimationFrame(() => autosizeTextarea(control));
        } else {
            control = document.createElement('input');
            control.className = 'p-inline-panel__control';
            control.type = field.type === 'number' ? 'number' : 'text';
            control.value = value ?? '';
        }

        control.name = field.key || 'value';
        wrapper.appendChild(control);

        if (isIconField(field)) {
            wrapper.appendChild(createIconPreview(control));
            wrapper.appendChild(createIconPicker(control));
        }

        if (field.hint) {
            const hint = document.createElement('p');
            hint.className = 'p-inline-panel__hint';
            hint.textContent = field.hint;
            wrapper.appendChild(hint);
        } else if (isIconField(field)) {
            const hint = document.createElement('p');
            hint.className = 'p-inline-panel__hint';
            hint.textContent = 'Можно выбрать иконку из набора ниже или оставить свой класс вручную.';
            wrapper.appendChild(hint);
        }

        return wrapper;
    }

    function isIconField(field) {
        const key = String(field?.key || '').toLowerCase();
        const label = String(field?.label || '').toLowerCase();
        return key === 'icon' || /иконк/.test(label);
    }

    function createIconPreview(control) {
        const preview = document.createElement('div');
        preview.className = 'p-inline-panel__icon-preview';

        const badge = document.createElement('span');
        badge.className = 'p-inline-panel__icon-preview-badge';
        preview.appendChild(badge);

        const text = document.createElement('div');
        text.className = 'p-inline-panel__icon-preview-text';
        text.innerHTML = `
            <span class="p-inline-panel__icon-preview-title">Текущая иконка</span>
            <span class="p-inline-panel__icon-preview-value"></span>
        `;
        preview.appendChild(text);

        const valueNode = text.querySelector('.p-inline-panel__icon-preview-value');

        const render = () => {
            const nextValue = String(control.value || '').trim();
            badge.innerHTML = '';
            if (nextValue) {
                const icon = document.createElement('i');
                icon.className = nextValue;
                icon.setAttribute('aria-hidden', 'true');
                badge.appendChild(icon);
                valueNode.textContent = nextValue;
            } else {
                badge.textContent = '—';
                valueNode.textContent = 'Без иконки';
            }
        };

        control.addEventListener('input', render);
        render();
        return preview;
    }

    function createIconPicker(control) {
        const picker = document.createElement('div');
        picker.className = 'p-inline-panel__icon-picker';

        const updateActiveState = () => {
            const currentValue = String(control.value || '').trim();
            picker.querySelectorAll('.p-inline-panel__icon-option').forEach((button) => {
                button.classList.toggle('is-active', button.dataset.iconValue === currentValue);
            });
        };

        INLINE_ICON_OPTIONS.forEach((option) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'p-inline-panel__icon-option';
            button.dataset.iconValue = option.value;
            button.innerHTML = `
                <span class="p-inline-panel__icon-option-symbol">${option.preview || `<i class="${option.value}" aria-hidden="true"></i>`}</span>
                <span class="p-inline-panel__icon-option-label">${option.label}</span>
            `;
            button.addEventListener('click', () => {
                control.value = option.value;
                control.dispatchEvent(new Event('input', { bubbles: true }));
                control.dispatchEvent(new Event('change', { bubbles: true }));
                updateActiveState();
            });
            picker.appendChild(button);
        });

        control.addEventListener('input', updateActiveState);
        updateActiveState();
        return picker;
    }

    function getBindingEditorFields(binding) {
        if (binding.fields.length) return binding.fields;

        if (binding.type === 'image') {
            return [];
        }

        if (binding.type === 'list') {
            return [{
                key: '__value',
                label: binding.label,
                type: 'list',
                hint: binding.hint || 'Каждый пункт с новой строки.'
            }];
        }

        return [{
            key: '__value',
            label: binding.label,
            type: binding.type === 'html' ? 'html' : 'textarea',
            hint: binding.hint || ''
        }];
    }

    function findBinding(fileName, path) {
        return state.bindings.find((binding) => binding.fileName === fileName && binding.path === path) || null;
    }

    function resolveBindingValue(fileState, binding) {
        const storedValue = getByPath(fileState.data, binding.path);
        return storedValue === undefined
            ? resolveBindingDefault(binding)
            : cloneData(storedValue);
    }

    function getBindingCollectionState(binding, fileState = state.files.get(binding.fileName)) {
        if (!fileState) return null;

        const indexed = parseIndexedPath(binding.path);
        const collectionPath = binding.collectionPath || indexed?.parentPath;
        if (!collectionPath || !indexed) return null;

        const items = getByPath(fileState.data, collectionPath);
        if (!Array.isArray(items)) return null;

        return {
            collectionPath,
            index: indexed.index,
            total: items.length,
            items
        };
    }

    function getOriginalBindingValue(binding, fileState = state.files.get(binding.fileName)) {
        if (!fileState || !binding?.path) return undefined;
        return getByPath(fileState.originalData, binding.path);
    }

    function isNewUnsavedCollectionBinding(binding, fileState = state.files.get(binding.fileName)) {
        const collectionState = getBindingCollectionState(binding, fileState);
        if (!collectionState) return false;
        return getOriginalBindingValue(binding, fileState) === undefined;
    }

    function canRevertBinding(binding) {
        return Boolean(binding?.path) && !isNewUnsavedCollectionBinding(binding);
    }

    function markBindingsDirtyForCollection(fileName, collectionPath) {
        const pattern = new RegExp(`^${escapeRegExp(collectionPath)}\\.\\d+$`);
        state.bindings.forEach((binding) => {
            if (binding.fileName === fileName && pattern.test(binding.path)) {
                markBindingDirty(binding);
            }
        });
    }

    function refreshCollectionBindings(binding, fileState) {
        const collectionState = getBindingCollectionState(binding, fileState);
        if (!collectionState) return;

        if (typeof binding.collectionRender === 'function') {
            binding.collectionRender(cloneData(collectionState.items), binding);
            return;
        }

        rerenderBindingsForCollection(binding.fileName, collectionState.collectionPath);
    }

    function registerMissingCollectionBindings(binding, total) {
        if (typeof binding.collectionItemFactory !== 'function') {
            return;
        }

        const sectionConfig = {
            fileName: binding.fileName,
            sectionKey: binding.sectionKey,
            sectionLabel: binding.sectionLabel
        };

        for (let index = 0; index < total; index += 1) {
            const path = `${binding.collectionPath}.${index}`;
            if (findBinding(binding.fileName, path)) continue;

            const config = binding.collectionItemFactory(index);
            if (!config) continue;

            const nextBinding = normalizeBinding(config, sectionConfig, state.bindings.length);
            if (!nextBinding) continue;

            state.bindingMap.set(nextBinding.id, nextBinding);
            state.bindings.push(nextBinding);
        }
    }

    function getCollectionItemNouns(binding) {
        if (binding?.type === 'image') {
            return {
                singular: 'фото',
                plural: 'фото',
                duplicate: 'Дублировать фото',
                add: 'Добавить фото после текущего',
                remove: 'Удалить фото',
                movePrev: 'Сдвинуть левее',
                moveNext: 'Сдвинуть правее',
                makeFirst: 'Сделать первым'
            };
        }

        if (binding?.type === 'object') {
            const label = (binding.editorKindLabel || '').toLowerCase();
            if (/ссылк|кнопк/.test(label)) {
                return {
                    singular: 'ссылка',
                    plural: 'ссылок',
                    duplicate: 'Дублировать ссылку',
                    add: 'Добавить ссылку после текущей',
                    remove: 'Удалить ссылку',
                    movePrev: 'Сдвинуть выше',
                    moveNext: 'Сдвинуть ниже',
                    makeFirst: 'Сделать первой'
                };
            }

            return {
                singular: 'карточка',
                plural: 'карточек',
                duplicate: 'Дублировать карточку',
                add: 'Добавить карточку после текущей',
                remove: 'Удалить карточку',
                movePrev: 'Сдвинуть выше',
                moveNext: 'Сдвинуть ниже',
                makeFirst: 'Сделать первой'
            };
        }

        const itemLabel = String(binding?.collectionItemLabel || '').trim().toLowerCase();
        const singular = itemLabel || 'пункт';
        const plural = binding?.collectionItemLabelPlural || 'пунктов';
        return {
            singular,
            plural,
            duplicate: `Дублировать ${singular}`,
            add: `Добавить ${singular} после текущего`,
            remove: `Удалить ${singular}`,
            movePrev: 'Сдвинуть выше',
            moveNext: 'Сдвинуть ниже',
            makeFirst: singular.endsWith('а') ? 'Сделать первой' : 'Сделать первым'
        };
    }

    function getCollectionToastLabels(binding) {
        const nouns = getCollectionItemNouns(binding);
        if (binding?.type === 'image') {
            return {
                onlyOne: 'В этом блоке только одно фото',
                removeLast: 'Нельзя удалить последнее фото',
                added: 'Фото добавлено в галерею',
                duplicated: 'Фото дублировано',
                removed: 'Фото удалено из галереи',
                moved: 'Порядок фото обновлён',
                movedFirst: 'Фото стало первым в галерее',
                moveError: 'Не удалось переставить фото',
                duplicateError: 'Не удалось дублировать фото',
                removeError: 'Не удалось удалить фото',
                addError: 'Не удалось добавить фото'
            };
        }

        return {
            onlyOne: `В этом блоке только ${nouns.singular}`,
            removeLast: `Нельзя удалить последний ${nouns.singular}`,
            added: 'Элемент добавлен',
            duplicated: 'Элемент дублирован',
            removed: 'Элемент удалён',
            moved: `Порядок ${nouns.plural} обновлён`,
            movedFirst: 'Элемент перенесён в начало',
            moveError: `Не удалось переставить ${nouns.singular}`,
            duplicateError: `Не удалось дублировать ${nouns.singular}`,
            removeError: `Не удалось удалить ${nouns.singular}`,
            addError: `Не удалось добавить ${nouns.singular}`
        };
    }

    function appendCollectionControls(binding, collectionState) {
        const nouns = getCollectionItemNouns(binding);
        const collectionBox = document.createElement('div');
        collectionBox.className = 'p-inline-panel__collection';

        const collectionMeta = document.createElement('p');
        collectionMeta.className = 'p-inline-panel__collection-meta';
        collectionMeta.textContent = binding.type === 'image'
            ? (collectionState.index === 0
                ? `Сейчас это главное фото в наборе. Всего изображений: ${collectionState.total}.`
                : `Позиция в наборе: ${collectionState.index + 1} из ${collectionState.total}.`)
            : (collectionState.index === 0
                ? `Сейчас это первый ${nouns.singular} в блоке. Всего ${nouns.plural}: ${collectionState.total}.`
                : `Позиция: ${collectionState.index + 1} из ${collectionState.total}.`);
        collectionBox.appendChild(collectionMeta);

        const collectionActions = document.createElement('div');
        collectionActions.className = 'p-inline-panel__collection-actions';

        const actionSet = [
            { action: 'first', label: nouns.makeFirst, disabled: collectionState.index === 0 },
            { action: 'prev', label: nouns.movePrev, disabled: collectionState.index === 0 },
            { action: 'next', label: nouns.moveNext, disabled: collectionState.index >= collectionState.total - 1 },
            { action: 'duplicate', label: nouns.duplicate, disabled: false },
            { action: 'add', label: nouns.add, disabled: false }
        ];

        actionSet.forEach((item) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'p-inline-panel__btn';
            button.dataset.inlinePanelMove = item.action;
            button.textContent = item.label;
            button.disabled = item.disabled;
            collectionActions.appendChild(button);
        });

        collectionBox.appendChild(collectionActions);
        ui.panelForm.appendChild(collectionBox);
    }

    function fillPanel(binding, value) {
        ui.panelKicker.textContent = getBindingKindLabel(binding);
        ui.panelTitle.textContent = binding.label;
        ui.panelForm.innerHTML = '';
        if (ui.panelBackBtn) {
            ui.panelBackBtn.hidden = !state.panelReturnToOverview;
        }

        const editorFields = getBindingEditorFields(binding);

        if (binding.type === 'image') {
            const preview = document.createElement('div');
            preview.className = 'p-inline-panel__preview';
            const previewFrame = document.createElement('div');
            previewFrame.className = 'p-inline-panel__preview-frame';
            const image = document.createElement('img');
            image.alt = value?.alt || binding.label;
            image.src = value?.src || '';
            previewFrame.appendChild(image);

            const imageNavigation = getImageBindingsNavigation(binding);
            if (imageNavigation && imageNavigation.total > 1) {
                const prevButton = document.createElement('button');
                prevButton.type = 'button';
                prevButton.className = 'p-inline-panel__preview-nav p-inline-panel__preview-nav--prev';
                prevButton.dataset.inlinePanelNav = 'prev-image';
                prevButton.textContent = '‹';
                prevButton.disabled = !imageNavigation.prev;
                prevButton.title = imageNavigation.prev ? `Предыдущее фото: ${imageNavigation.prev.label}` : 'Предыдущего фото нет';
                prevButton.setAttribute('aria-label', prevButton.title);
                previewFrame.appendChild(prevButton);

                const nextButton = document.createElement('button');
                nextButton.type = 'button';
                nextButton.className = 'p-inline-panel__preview-nav p-inline-panel__preview-nav--next';
                nextButton.dataset.inlinePanelNav = 'next-image';
                nextButton.textContent = '›';
                nextButton.disabled = !imageNavigation.next;
                nextButton.title = imageNavigation.next ? `Следующее фото: ${imageNavigation.next.label}` : 'Следующего фото нет';
                nextButton.setAttribute('aria-label', nextButton.title);
                previewFrame.appendChild(nextButton);

                const indexBadge = document.createElement('div');
                indexBadge.className = 'p-inline-panel__preview-index';
                indexBadge.textContent = `${imageNavigation.index + 1} из ${imageNavigation.total}`;
                previewFrame.appendChild(indexBadge);
            }

            preview.appendChild(previewFrame);

            const uploadZone = document.createElement('div');
            uploadZone.className = 'p-inline-panel__upload-zone';

            const uploadTitle = document.createElement('div');
            uploadTitle.className = 'p-inline-panel__upload-title';
            uploadTitle.textContent = 'Выбрать или перетащить фото';
            uploadZone.appendChild(uploadTitle);

            const uploadMeta = document.createElement('div');
            uploadMeta.className = 'p-inline-panel__upload-meta';
            uploadMeta.textContent = 'Файл можно выбрать, перетащить сюда или вставить из буфера.';
            uploadZone.appendChild(uploadMeta);

            const uploadFile = document.createElement('div');
            uploadFile.className = 'p-inline-panel__upload-file';
            uploadFile.hidden = true;
            uploadZone.appendChild(uploadFile);

            const fileInput = document.createElement('input');
            fileInput.className = 'p-inline-panel__control';
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.name = '__imageUpload';

            fileInput.addEventListener('change', () => {
                const nextFile = fileInput.files?.[0];
                updateImagePreviewFromFile(nextFile, image, uploadFile);
            });

            const preventTransferDefaults = (event) => {
                event.preventDefault();
                event.stopPropagation();
            };

            ['dragenter', 'dragover'].forEach((eventName) => {
                uploadZone.addEventListener(eventName, (event) => {
                    preventTransferDefaults(event);
                    uploadZone.classList.add('is-dragover');
                });
            });

            ['dragleave', 'dragend', 'drop'].forEach((eventName) => {
                uploadZone.addEventListener(eventName, (event) => {
                    preventTransferDefaults(event);
                    if (eventName !== 'drop') {
                        uploadZone.classList.remove('is-dragover');
                    }
                });
            });

            uploadZone.addEventListener('drop', (event) => {
                uploadZone.classList.remove('is-dragover');
                const nextFile = extractImageFileFromTransfer(event.dataTransfer);
                if (!nextFile) {
                    showToast('Перетащите файл изображения');
                    return;
                }
                if (!assignUploadFile(fileInput, nextFile)) {
                    showToast('Не удалось подставить файл');
                    return;
                }
                updateImagePreviewFromFile(nextFile, image, uploadFile);
            });
            uploadZone.appendChild(fileInput);
            preview.appendChild(uploadZone);
            ui.panelForm.appendChild(preview);

            const imageHint = document.createElement('p');
            imageHint.className = 'p-inline-panel__hint';
            imageHint.textContent = imageNavigation && imageNavigation.total > 1
                ? 'После замены можно поправить alt или подпись ниже. Клавиши ← и → листают соседние фото.'
                : 'После замены можно сразу поправить alt или подпись ниже.';
            ui.panelForm.appendChild(imageHint);

        }

        editorFields.forEach((field) => {
            const fieldValue = field.key === '__value'
                ? value
                : getByPath(value, field.key);
            ui.panelForm.appendChild(createFieldGroup(field, fieldValue));
        });

        const collectionState = getBindingCollectionState(binding);
        if (collectionState && (binding.type === 'image' || binding.type === 'object' || binding.type === 'text')) {
            appendCollectionControls(binding, collectionState);
        }

        const firstControl = ui.panelForm.querySelector('input, textarea');
        if (firstControl) {
            window.setTimeout(() => {
                firstControl.focus();
                if (firstControl instanceof HTMLInputElement || firstControl instanceof HTMLTextAreaElement) {
                    firstControl.setSelectionRange?.(firstControl.value.length, firstControl.value.length);
                }
            }, 0);
        }

        updatePanelMeta(binding);
    }

    function revealBindingElement(element) {
        if (!element?.getBoundingClientRect) return;

        const rect = element.getBoundingClientRect();
        const viewportTop = 96;
        const viewportBottom = window.innerHeight - 96;
        const isMostlyVisible = rect.top >= viewportTop && rect.bottom <= viewportBottom;

        if (isMostlyVisible) return;

        element.scrollIntoView({
            behavior: 'smooth',
            block: rect.top < viewportTop ? 'start' : 'center'
        });
    }

    function pulseBindingElements(binding) {
        binding?.elements?.forEach((element) => {
            if (!element?.classList) return;
            element.classList.remove(REVEAL_CLASS);
            void element.offsetWidth;
            element.classList.add(REVEAL_CLASS);
            window.setTimeout(() => {
                element.classList.remove(REVEAL_CLASS);
            }, 950);
        });
    }

    function returnToOverview() {
        if (!state.panelReturnToOverview) return;
        if (!confirmDiscardPanelChanges()) return;
        ui.panel.hidden = true;
        state.panelReturnToOverview = false;
        state.overviewOpen = true;
        renderToolbar();
        window.setTimeout(() => {
            ui.overviewSearch?.focus();
        }, 0);
    }

    function navigateAdjacentImageBinding(direction) {
        const binding = state.bindingMap.get(state.activeBindingId);
        const navigation = getImageBindingsNavigation(binding);
        if (!navigation) return false;
        const nextBinding = direction === 'prev' ? navigation.prev : navigation.next;
        if (!nextBinding) return false;
        openBinding(nextBinding.id, { fromOverview: state.panelReturnToOverview });
        return true;
    }

    async function openBinding(bindingId, options = {}) {
        try {
            const binding = state.bindingMap.get(bindingId);
            if (!binding) return;

            if (!state.apiAvailable) {
                showToast('Для редактирования с сохранением откройте сайт через сервер сохранения.');
                return;
            }

            if (state.authEnabled && !state.authenticated) {
                showToast('Сначала откройте панель входа и авторизуйтесь.');
                return;
            }

            if (!ui.panel.hidden && state.activeBindingId && state.activeBindingId !== binding.id) {
                if (!confirmDiscardPanelChanges()) {
                    return;
                }
            }

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const storedValue = getByPath(fileState.data, binding.path);
            const value = storedValue === undefined
                ? resolveBindingDefault(binding)
                : cloneData(storedValue);

            const shouldReturnToOverview = typeof options.fromOverview === 'boolean'
                ? options.fromOverview
                : (ui.panel.hidden ? state.overviewOpen : state.panelReturnToOverview);

            state.panelReturnToOverview = shouldReturnToOverview;
            state.overviewOpen = false;
            state.activeBindingId = binding.id;
            clearActiveMarks();
            binding.elements.forEach((element) => element.classList.add(ACTIVE_CLASS));
            revealBindingElement(binding.elements[0]);
            pulseBindingElements(binding);

            fillPanel(binding, value);
            rememberEditingContext(binding);
            renderToolbar();
            ui.panel.hidden = false;
        } catch (error) {
            showToast(error.message || 'Не удалось открыть редактор');
        }
    }

    async function openRequestedFocusBinding() {
        if (!state.requestedFocus) return false;

        const binding = findBindingByRequestedFocus(state.requestedFocus);
        if (!binding) {
            return false;
        }

        await openBinding(binding.id);

        const focusMessages = {
            image: 'Открыта первая доступная правка фото.',
            text: 'Открыта первая доступная правка текста.',
            contacts: 'Открыт первый доступный контактный блок.',
            collection: 'Открыт первый доступный составной блок.'
        };

        if (focusMessages[state.requestedFocus]) {
            showToast(focusMessages[state.requestedFocus]);
        }

        state.requestedFocus = '';
        return true;
    }

    async function openRequestedResumeBinding() {
        if (!requestedResumeFile || !requestedResumePath) return false;

        const binding = findBindingByResumeTarget(requestedResumeFile, requestedResumePath);
        if (!binding) return false;

        await openBinding(binding.id);
        showToast(`Продолжили с блока: ${binding.label}`);
        return true;
    }

    async function uploadImage(file, directory) {
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
            reader.readAsDataURL(file);
        });

        const response = await fetch('/api/media/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName: file.name,
                directory,
                dataUrl
            })
        });

        if (!response.ok) {
            throw new Error('Не удалось загрузить изображение');
        }

        const payload = await response.json();
        return payload.path;
    }

    function extractImageFileFromTransfer(source) {
        if (!source) return null;

        const fileList = Array.from(source.files || []);
        const directMatch = fileList.find((file) => /^image\//i.test(file.type));
        if (directMatch) return directMatch;

        const items = Array.from(source.items || []);
        for (const item of items) {
            if (item?.kind === 'file' && /^image\//i.test(item.type || '')) {
                const file = item.getAsFile?.();
                if (file) return file;
            }
        }

        return null;
    }

    function assignUploadFile(input, file) {
        if (!input || !file) return false;
        try {
            const transfer = new DataTransfer();
            transfer.items.add(file);
            input.files = transfer.files;
            return true;
        } catch (error) {
            return false;
        }
    }

    function updateImagePreviewFromFile(file, previewImage, fileBadge) {
        if (!file) return;
        if (previewImage) {
            previewImage.src = URL.createObjectURL(file);
        }
        if (fileBadge) {
            const sizeKb = Math.max(1, Math.round((file.size || 0) / 1024));
            fileBadge.textContent = `${file.name} · ${sizeKb} KB`;
            fileBadge.hidden = false;
        }
    }

    async function collectPanelValue(binding) {
        const currentFile = state.files.get(binding.fileName);
        const currentValue = resolveBindingValue(currentFile, binding);
        const nextValue = binding.fields.length || binding.type === 'image'
            ? (cloneData(currentValue) && typeof currentValue === 'object' ? cloneData(currentValue) : {})
            : currentValue;
        const fields = getBindingEditorFields(binding);

        for (const field of fields) {
            const control = ui.panelForm.querySelector(`[name="${field.key}"]`);
            if (!control) continue;

            let value = control.value;
            if (field.type === 'number') {
                value = value === '' ? null : Number(value);
            } else if (field.type === 'list') {
                value = value
                    .split(/\r?\n/)
                    .map((item) => item.trim())
                    .filter(Boolean);
            }

            if (field.key === '__value') {
                return value;
            }

            setByPath(nextValue, field.key, value);
        }

        const uploadControl = ui.panelForm.querySelector('[name="__imageUpload"]');
        if (uploadControl?.files?.[0]) {
            nextValue.src = await uploadImage(uploadControl.files[0], binding.directory);
            if (Object.prototype.hasOwnProperty.call(nextValue, 'previewSrc')) {
                nextValue.previewSrc = nextValue.src;
            }
            if (Object.prototype.hasOwnProperty.call(nextValue, 'zoomSrc')) {
                nextValue.zoomSrc = nextValue.src;
            }
        }

        return nextValue;
    }

    function getComparablePanelFieldValue(field, control) {
        if (!control) return undefined;

        let value = control.value;
        if (field.type === 'number') {
            return value === '' ? null : Number(value);
        }

        if (field.type === 'list') {
            return value
                .split(/\r?\n/)
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return String(value ?? '');
    }

    function getComparableStoredFieldValue(field, currentValue) {
        const storedValue = field.key === '__value'
            ? currentValue
            : getByPath(currentValue, field.key);

        if (field.type === 'number') {
            return storedValue == null || storedValue === ''
                ? null
                : Number(storedValue);
        }

        if (field.type === 'list') {
            return Array.isArray(storedValue) ? storedValue : [];
        }

        return String(storedValue ?? '');
    }

    function hasPendingPanelChanges() {
        if (ui.panel?.hidden) return false;

        const binding = state.bindingMap.get(state.activeBindingId);
        if (!binding) return false;

        const currentFile = state.files.get(binding.fileName);
        if (!currentFile) return false;

        const uploadControl = ui.panelForm.querySelector('[name="__imageUpload"]');
        if (binding.type === 'image' && uploadControl?.files?.[0]) {
            return true;
        }

        const currentValue = resolveBindingValue(currentFile, binding);
        const fields = getBindingEditorFields(binding);

        return fields.some((field) => {
            const control = ui.panelForm.querySelector(`[name="${field.key}"]`);
            if (!control) return false;

            const nextValue = getComparablePanelFieldValue(field, control);
            const storedValue = getComparableStoredFieldValue(field, currentValue);
            return !isSameData(nextValue, storedValue);
        });
    }

    function confirmDiscardPanelChanges() {
        if (!hasPendingPanelChanges()) return true;
        return window.confirm('Есть неприменённые изменения в открытой панели. Закрыть их без применения?');
    }

    function updatePanelMeta(binding) {
        if (!ui.panelMeta || !binding) return;
        ui.panelMeta.textContent = hasPendingPanelChanges()
            ? `${binding.sectionLabel} · Есть неприменённые правки · Ctrl+Enter — применить`
            : `${binding.sectionLabel} · Ctrl+Enter — применить`;
        if (ui.panelRemoveBtn) {
            const collectionState = getBindingCollectionState(binding);
            const nouns = getCollectionItemNouns(binding);
            const canRemove = Boolean(collectionState && collectionState.total > 1);
            ui.panelRemoveBtn.hidden = !canRemove;
            ui.panelRemoveBtn.disabled = !canRemove;
            ui.panelRemoveBtn.textContent = canRemove ? nouns.remove : 'Удалить';
        }
    }

    function getImageBindingsNavigation(binding) {
        if (!binding || binding.type !== 'image') return null;
        const items = getVisibleBindings().filter((item) => item.type === 'image');
        const index = items.findIndex((item) => item.id === binding.id);
        if (index < 0) return null;
        return {
            items,
            index,
            total: items.length,
            prev: items[index - 1] || null,
            next: items[index + 1] || null
        };
    }

    async function addItemToActiveCollection() {
        try {
            const binding = state.bindingMap.get(state.activeBindingId);
            if (!binding) return;
            const toastLabels = getCollectionToastLabels(binding);

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const collectionState = getBindingCollectionState(binding, fileState);
            if (!collectionState) {
                showToast('Этот элемент не относится к коллекции');
                return;
            }

            let nextValue;
            if (binding.type === 'image') {
                const uploadControl = ui.panelForm.querySelector('[name="__imageUpload"]');
                if (!uploadControl?.files?.[0]) {
                    showToast('Сначала выберите новый файл изображения');
                    return;
                }
                nextValue = await collectPanelValue(binding);
            } else if (typeof binding.collectionCreateValue === 'function') {
                nextValue = cloneData(binding.collectionCreateValue(resolveBindingValue(fileState, binding), binding));
            } else {
                nextValue = cloneData(resolveBindingValue(fileState, binding));
            }
            const nextIndex = Math.min(collectionState.index + 1, collectionState.items.length);
            collectionState.items.splice(nextIndex, 0, nextValue);

            fileState.dirty = true;
            refreshCollectionBindings(binding, fileState);
            registerMissingCollectionBindings(binding, collectionState.items.length);
            markBindingsDirtyForCollection(binding.fileName, collectionState.collectionPath);
            persistDraftFiles();
            renderToolbar();

            const nextBinding = findBinding(binding.fileName, `${collectionState.collectionPath}.${nextIndex}`);
            if (nextBinding) {
                state.activeBindingId = nextBinding.id;
                clearActiveMarks();
                nextBinding.elements.forEach((element) => element.classList.add(ACTIVE_CLASS));
                fillPanel(nextBinding, resolveBindingValue(fileState, nextBinding));
            }

            showToast(toastLabels.added);
        } catch (error) {
            const binding = state.bindingMap.get(state.activeBindingId);
            showToast(error.message || getCollectionToastLabels(binding).addError);
        }
    }

    async function duplicateActiveBindingInCollection() {
        try {
            const binding = state.bindingMap.get(state.activeBindingId);
            if (!binding) return;
            const toastLabels = getCollectionToastLabels(binding);

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const collectionState = getBindingCollectionState(binding, fileState);
            if (!collectionState) {
                showToast('Этот элемент не относится к коллекции');
                return;
            }

            const nextValue = cloneData(resolveBindingValue(fileState, binding));
            const nextIndex = Math.min(collectionState.index + 1, collectionState.items.length);
            collectionState.items.splice(nextIndex, 0, nextValue);

            fileState.dirty = true;
            refreshCollectionBindings(binding, fileState);
            registerMissingCollectionBindings(binding, collectionState.items.length);
            markBindingsDirtyForCollection(binding.fileName, collectionState.collectionPath);
            persistDraftFiles();
            renderToolbar();

            const nextBinding = findBinding(binding.fileName, `${collectionState.collectionPath}.${nextIndex}`);
            if (nextBinding) {
                state.activeBindingId = nextBinding.id;
                clearActiveMarks();
                nextBinding.elements.forEach((element) => element.classList.add(ACTIVE_CLASS));
                fillPanel(nextBinding, resolveBindingValue(fileState, nextBinding));
            }

            showToast(toastLabels.duplicated);
        } catch (error) {
            const binding = state.bindingMap.get(state.activeBindingId);
            showToast(error.message || getCollectionToastLabels(binding).duplicateError);
        }
    }

    async function removeBindingFromCollection(bindingTarget = state.activeBindingId) {
        try {
            const binding = typeof bindingTarget === 'string'
                ? state.bindingMap.get(bindingTarget)
                : bindingTarget;
            if (!binding) return;
            const toastLabels = getCollectionToastLabels(binding);
            const nouns = getCollectionItemNouns(binding);

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const collectionState = getBindingCollectionState(binding, fileState);
            if (!collectionState || collectionState.total <= 1) {
                showToast(toastLabels.removeLast);
                return;
            }

            if (!window.confirm(`${nouns.remove} с этой страницы?`)) {
                return;
            }

            collectionState.items.splice(collectionState.index, 1);

            fileState.dirty = true;
            markBindingsDirtyForCollection(binding.fileName, collectionState.collectionPath);
            refreshCollectionBindings(binding, fileState);
            persistDraftFiles();
            renderToolbar();

            const nextIndex = Math.min(collectionState.index, collectionState.items.length - 1);
            const nextBinding = findBinding(binding.fileName, `${collectionState.collectionPath}.${nextIndex}`);
            if (nextBinding) {
                state.activeBindingId = nextBinding.id;
                clearActiveMarks();
                nextBinding.elements.forEach((element) => element.classList.add(ACTIVE_CLASS));
                fillPanel(nextBinding, resolveBindingValue(fileState, nextBinding));
            } else {
                closePanel({ skipConfirm: true });
            }

            showToast(`${toastLabels.removed}. Нажмите «Сохранить», чтобы закрепить.`);
        } catch (error) {
            const binding = typeof bindingTarget === 'string'
                ? state.bindingMap.get(bindingTarget)
                : bindingTarget;
            showToast(error.message || getCollectionToastLabels(binding).removeError);
        }
    }

    async function removeActiveBindingFromCollection() {
        return removeBindingFromCollection(state.activeBindingId);
    }

    async function moveActiveBindingInCollection(direction) {
        try {
            const binding = state.bindingMap.get(state.activeBindingId);
            if (!binding) return;
            const toastLabels = getCollectionToastLabels(binding);

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const collectionState = getBindingCollectionState(binding, fileState);
            if (!collectionState || collectionState.total < 2) {
                showToast(toastLabels.onlyOne);
                return;
            }

            let nextIndex = collectionState.index;
            if (direction === 'first') {
                nextIndex = 0;
            } else if (direction === 'prev') {
                nextIndex = Math.max(0, collectionState.index - 1);
            } else if (direction === 'next') {
                nextIndex = Math.min(collectionState.total - 1, collectionState.index + 1);
            }

            if (nextIndex === collectionState.index) {
                return;
            }

            const [movedItem] = collectionState.items.splice(collectionState.index, 1);
            collectionState.items.splice(nextIndex, 0, movedItem);

            fileState.dirty = true;
            markBindingsDirtyForCollection(binding.fileName, collectionState.collectionPath);
            refreshCollectionBindings(binding, fileState);
            persistDraftFiles();
            renderToolbar();

            const nextBinding = findBinding(binding.fileName, `${collectionState.collectionPath}.${nextIndex}`) || binding;
            state.activeBindingId = nextBinding.id;
            clearActiveMarks();
            nextBinding.elements.forEach((element) => element.classList.add(ACTIVE_CLASS));
            fillPanel(nextBinding, resolveBindingValue(fileState, nextBinding));

            showToast(nextIndex === 0 ? toastLabels.movedFirst : toastLabels.moved);
        } catch (error) {
            const activeBinding = state.bindingMap.get(state.activeBindingId);
            showToast(error.message || getCollectionToastLabels(activeBinding).moveError);
        }
    }

    async function applyActiveBinding(options = {}) {
        try {
            const binding = state.bindingMap.get(state.activeBindingId);
            if (!binding) return false;

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const nextValue = await collectPanelValue(binding);
            setByPath(fileState.data, binding.path, nextValue);
            fileState.dirty = true;
            markBindingDirty(binding);
            rerenderBindingsForPath(binding.fileName, binding.path);
            persistDraftFiles();
            renderToolbar();
            closePanel({ skipConfirm: true });
            if (!options.silent) {
                showToast(`Изменено: ${truncateInlineLabel(binding.label, 44)}`);
            }
            return true;
        } catch (error) {
            showToast(error.message || 'Не удалось применить правку');
            return false;
        }
    }

    async function revertBindingToSaved(bindingTarget = state.activeBindingId) {
        try {
            const binding = typeof bindingTarget === 'string'
                ? state.bindingMap.get(bindingTarget)
                : bindingTarget;
            if (!binding || !canRevertBinding(binding)) return;

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const originalValue = getByPath(fileState.originalData, binding.path);
            const nextValue = originalValue === undefined
                ? resolveBindingDefault(binding)
                : cloneData(originalValue);

            setByPath(fileState.data, binding.path, cloneData(nextValue));
            rerenderBindingsForPath(binding.fileName, binding.path);

            binding.elements.forEach((element) => element.classList.remove(DIRTY_CLASS));
            fileState.dirty = !isSameData(fileState.data, fileState.originalData);
            if (!fileState.dirty) {
                state.lastSavedAt = 0;
            }
            persistDraftFiles();
            if (state.activeBindingId === binding.id && !ui.panel.hidden) {
                fillPanel(binding, nextValue);
            }
            renderToolbar();
            renderOverviewPanel();
            showToast(`Возвращено: ${truncateInlineLabel(binding.label, 44)}`);
        } catch (error) {
            showToast(error.message || 'Не удалось вернуть сохранённую версию');
        }
    }

    async function revertActiveBindingToSaved() {
        return revertBindingToSaved(state.activeBindingId);
    }

    async function saveDirtyFiles() {
        if (!canSaveInline()) {
            showToast('Сохранение недоступно');
            return;
        }

        if (!ui.panel.hidden && hasPendingPanelChanges()) {
            const applied = await applyActiveBinding({ silent: true });
            if (!applied) {
                return;
            }
        }

        const dirtyEntries = Array.from(state.files.values()).filter((entry) => entry.dirty);
        if (!dirtyEntries.length) {
            showToast('Нечего сохранять');
            return;
        }
        const dirtyFilesCount = dirtyEntries.length;

        ui.saveBtn.disabled = true;
        ui.saveBtn.textContent = 'Сохраняю...';

        try {
            for (const entry of dirtyEntries) {
                const response = await fetch(`/api/content/${entry.fileName}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Admin-Section-Key': entry.sectionKey || entry.fileName,
                        'X-Admin-Section-Label': encodeHeaderValue(entry.sectionLabel || entry.fileName)
                    },
                    body: JSON.stringify(entry.data)
                });

                if (!response.ok) {
                    throw new Error(`Не удалось сохранить ${entry.fileName}.json`);
                }

                entry.dirty = false;
                entry.originalData = cloneData(entry.data);
                entry.draftPaths = [];
            }

            clearDirtyMarks();
            rememberEditingContext(state.bindingMap.get(state.activeBindingId) || null);
            state.lastSavedAt = Date.now();
            persistDraftFiles();
            renderToolbar();
            showToast(`Сохранено: ${dirtyFilesCount} ${getCountLabel(dirtyFilesCount, 'файл', 'файла', 'файлов')}`);
        } catch (error) {
            showToast(error.message || 'Ошибка сохранения');
        } finally {
            renderToolbar();
        }
    }

    function handleBeforeUnload(event) {
        if (!hasDirtyFiles()) return;
        event.preventDefault();
        event.returnValue = '';
    }

    function discardDraftChanges() {
        if (!hasDirtyFiles()) return;
        const confirmed = window.confirm('Сбросить все несохранённые правки на этой странице?');
        if (!confirmed) return;

        const payload = readStoredDraftFiles();
        state.files.forEach((entry, fileName) => {
            if (payload[fileName]) {
                delete payload[fileName];
            }
        });
        writeStoredDraftFiles(payload);
        const cleanHref = getCurrentEditHref();
        window.location.href = cleanHref;
    }

    function handleDocumentClick(event) {
        if (!state.enabled) return;
        if (ui.panel?.contains(event.target) || ui.root?.contains(event.target) || ui.overview?.contains(event.target)) return;

        const target = event.target.closest('[data-inline-edit-id]');
        if (!target) {
            if (state.overviewOpen) {
                toggleOverview(false);
            }
            return;
        }

        const bindingId = target.dataset.inlineEditId;
        if (!bindingId) return;

        event.preventDefault();
        event.stopPropagation();
        openBinding(bindingId);
    }

    function showHoverLabel(target) {
        if (!ui.hover || !state.enabled || !target) return;
        const rect = target.getBoundingClientRect();
        const binding = state.bindingMap.get(target.dataset.inlineEditId || '');
        const kind = getBindingKindLabel(binding).replace(/ на странице$/i, '');
        const label = target.dataset.inlineEditLabel || 'Редактировать';
        ui.hover.textContent = `${kind} · ${label}`;
        ui.hover.hidden = false;
        const hoverWidth = ui.hover.offsetWidth || 240;
        const top = rect.top < 52
            ? Math.min(window.innerHeight - 48, rect.bottom + 12)
            : Math.max(12, rect.top - 14);
        const left = Math.min(
            Math.max(12, window.innerWidth - hoverWidth - 12),
            Math.max(12, rect.left)
        );
        ui.hover.style.top = `${top}px`;
        ui.hover.style.left = `${left}px`;
    }

    function hideHoverLabel() {
        if (!ui.hover) return;
        ui.hover.hidden = true;
    }

    function handlePointerMove(event) {
        if (!state.enabled) {
            hideHoverLabel();
            return;
        }

        if (ui.panel?.contains(event.target) || ui.root?.contains(event.target) || ui.overview?.contains(event.target)) {
            hideHoverLabel();
            return;
        }

        const target = event.target.closest?.('[data-inline-edit-id]');
        if (!target) {
            hideHoverLabel();
            return;
        }

        showHoverLabel(target);
    }

    function handleKeydown(event) {
        if (!state.enabled) return;
        const target = event.target;
        const isTypingTarget = target instanceof HTMLInputElement
            || target instanceof HTMLTextAreaElement
            || target instanceof HTMLSelectElement
            || Boolean(target?.closest?.('[contenteditable="true"]'));

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            if (!state.overviewOpen) {
                state.overviewFocus = hasDirtyBindings() ? 'dirty' : 'all';
            }
            toggleOverview(true);
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            saveDirtyFiles();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !ui.panel.hidden) {
            event.preventDefault();
            applyActiveBinding();
            return;
        }

        if (!ui.panel.hidden && !event.ctrlKey && !event.metaKey && !event.altKey && !isTypingTarget) {
            if (event.key === 'ArrowLeft') {
                if (navigateAdjacentImageBinding('prev')) {
                    event.preventDefault();
                    return;
                }
            }

            if (event.key === 'ArrowRight') {
                if (navigateAdjacentImageBinding('next')) {
                    event.preventDefault();
                    return;
                }
            }
        }

        if (event.key !== 'Escape') return;

        if (!ui.panel.hidden) {
            if (state.panelReturnToOverview) {
                returnToOverview();
                return;
            }
            closePanel();
            return;
        }

        if (ui.overview && !ui.overview.hidden) {
            toggleOverview(false);
            return;
        }

        exitEditMode();
    }

    function handlePaste(event) {
        if (!state.enabled || ui.panel?.hidden) return;

        const binding = state.bindingMap.get(state.activeBindingId);
        if (!binding || binding.type !== 'image') return;

        const nextFile = extractImageFileFromTransfer(event.clipboardData);
        if (!nextFile) return;

        const uploadControl = ui.panelForm.querySelector('[name="__imageUpload"]');
        const previewImage = ui.panelForm.querySelector('.p-inline-panel__preview img');
        const fileBadge = ui.panelForm.querySelector('.p-inline-panel__upload-file');
        if (!uploadControl) return;

        event.preventDefault();
        if (!assignUploadFile(uploadControl, nextFile)) {
            showToast('Не удалось вставить изображение');
            return;
        }

        updateImagePreviewFromFile(nextFile, previewImage, fileBadge);
        showToast('Изображение вставлено из буфера');
    }

    function handlePanelClick(event) {
        const navButton = event.target.closest?.('[data-inline-panel-nav]');
        if (navButton) {
            event.preventDefault();
            const binding = state.bindingMap.get(state.activeBindingId);
            const navigation = getImageBindingsNavigation(binding);
            if (!navigation) return;
            const nextBinding = navButton.dataset.inlinePanelNav === 'prev-image'
                ? navigation.prev
                : navigation.next;
            if (nextBinding) {
                openBinding(nextBinding.id, { fromOverview: state.panelReturnToOverview });
            }
            return;
        }

        const moveButton = event.target.closest?.('[data-inline-panel-move]');
        if (!moveButton) return;
        event.preventDefault();
        if (moveButton.dataset.inlinePanelMove === 'add') {
            addItemToActiveCollection();
            return;
        }
        if (moveButton.dataset.inlinePanelMove === 'duplicate') {
            duplicateActiveBindingInCollection();
            return;
        }
        if (moveButton.dataset.inlinePanelMove === 'remove') {
            removeActiveBindingFromCollection();
            return;
        }
        moveActiveBindingInCollection(moveButton.dataset.inlinePanelMove);
    }

    function init() {
        injectStyles();
        createUi();
        consumeQueue();

        ui.launcher.addEventListener('click', async () => {
            if (!state.enabled) {
                await enterEditMode();
            } else {
                exitEditMode();
            }
        });

        ui.root.querySelector('[data-inline-action="close"]').addEventListener('click', () => {
            exitEditMode();
        });

        ui.saveBtn.addEventListener('click', () => {
            saveDirtyFiles();
        });

        ui.toolbarRevertBtn?.addEventListener('click', () => {
            revertActiveBindingToSaved();
        });

        ui.adminBtn?.addEventListener('click', () => {
            window.open(getLauncherHref(), '_blank', 'noopener');
        });

        ui.root.querySelector('[data-inline-action="overview"]').addEventListener('click', () => {
            if (!state.overviewOpen && hasDirtyBindings() && state.overviewFocus === 'all') {
                state.overviewFocus = 'dirty';
            }
            toggleOverview();
        });

        ui.toolbar.addEventListener('click', (event) => {
            const jumpButton = event.target.closest('[data-inline-focus]');
            if (!jumpButton) return;
            event.preventDefault();
            jumpToBindingFocus(jumpButton.dataset.inlineFocus || '');
        });

        ui.panel.querySelector('.p-inline-panel__close').addEventListener('click', closePanel);
        ui.panelBackBtn?.addEventListener('click', returnToOverview);
        ui.panelRemoveBtn?.addEventListener('click', () => {
            removeActiveBindingFromCollection();
        });
        ui.panelApplyBtn.addEventListener('click', () => {
            applyActiveBinding();
        });
        ui.panel.addEventListener('click', handlePanelClick);
        ui.panelForm.addEventListener('input', () => {
            const binding = state.bindingMap.get(state.activeBindingId);
            if (binding) {
                updatePanelMeta(binding);
            }
        });
        ui.panelForm.addEventListener('change', () => {
            const binding = state.bindingMap.get(state.activeBindingId);
            if (binding) {
                updatePanelMeta(binding);
            }
        });
        ui.overview.querySelector('.p-inline-overview__close').addEventListener('click', () => {
            toggleOverview(false);
        });
        ui.overviewSearch.addEventListener('input', (event) => {
            state.overviewQuery = event.target.value || '';
            renderOverviewPanel();
        });
        ui.overviewSearchClear?.addEventListener('click', () => {
            state.overviewQuery = '';
            renderOverviewPanel();
            ui.overviewSearch?.focus();
        });
        ui.overviewSearch.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                if (state.overviewQuery) {
                    state.overviewQuery = '';
                    renderOverviewPanel();
                    return;
                }
                toggleOverview(false);
                return;
            }
            if (event.key !== 'Enter') return;
            const firstItem = ui.overviewBody.querySelector('[data-inline-binding-id]');
            if (!firstItem) return;
            event.preventDefault();
            openBinding(firstItem.dataset.inlineBindingId || '', { fromOverview: true });
        });
        ui.overviewFilters.addEventListener('click', (event) => {
            const button = event.target.closest('[data-inline-overview-focus]');
            if (!button) return;
            event.preventDefault();
            state.overviewFocus = button.dataset.inlineOverviewFocus || 'all';
            renderOverviewPanel();
        });
        ui.overviewBody.addEventListener('click', (event) => {
            const revertButton = event.target.closest('[data-inline-overview-revert]');
            if (revertButton) {
                event.preventDefault();
                event.stopPropagation();
                revertBindingToSaved(revertButton.dataset.inlineOverviewRevert || '');
                return;
            }

            const removeButton = event.target.closest('[data-inline-overview-remove]');
            if (removeButton) {
                event.preventDefault();
                event.stopPropagation();
                removeBindingFromCollection(removeButton.dataset.inlineOverviewRemove || '');
                return;
            }

            const button = event.target.closest('[data-inline-binding-id]');
            if (!button) return;
            event.preventDefault();
            openBinding(button.dataset.inlineBindingId || '', { fromOverview: true });
        });

        document.addEventListener('click', handleDocumentClick, true);
        document.addEventListener('pointermove', handlePointerMove, true);
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('paste', handlePaste, true);
        window.addEventListener('scroll', hideHoverLabel, true);
        window.addEventListener('resize', hideHoverLabel);
        window.addEventListener('beforeunload', handleBeforeUnload);
        refreshEnvironment();

        if (autoEnable) {
            window.setTimeout(() => {
                if (!state.enabled) {
                    enterEditMode();
                }
            }, 80);
        }
    }

    window.PokraskaInlineEditor = {
        register,
        consumeQueue
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
