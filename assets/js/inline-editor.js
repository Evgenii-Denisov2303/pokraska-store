(function() {
    if (window.PokraskaInlineEditor) return;

    const STYLE_ID = 'pokraska-inline-editor-style';
    const ACTIVE_CLASS = 'p-inline-active';
    const DIRTY_CLASS = 'p-inline-dirty';
    const MODE_CLASS = 'p-inline-mode';
    const query = new URLSearchParams(window.location.search);
    const autoEnable = query.get('edit') === '1';
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
                transition: outline-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
            }

            body.${MODE_CLASS} [data-inline-edit-id]:hover,
            body.${MODE_CLASS} [data-inline-edit-id].${ACTIVE_CLASS} {
                outline-color: rgba(37, 99, 235, 0.75);
                box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.08);
            }

            body.${MODE_CLASS} [data-inline-edit-id].${DIRTY_CLASS} {
                outline-color: rgba(5, 150, 105, 0.82);
                box-shadow: 0 0 0 8px rgba(5, 150, 105, 0.1);
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
                width: min(360px, calc(100vw - 32px));
                background: rgba(15, 23, 42, 0.96);
                color: #e2e8f0;
                border-radius: 20px;
                padding: 14px;
                box-shadow: 0 20px 46px rgba(15, 23, 42, 0.24);
                backdrop-filter: blur(18px);
            }

            .p-inline-toolbar.p-inline-toolbar--compact {
                width: auto;
                max-width: min(560px, calc(100vw - 32px));
                padding: 10px 12px;
                border-radius: 999px;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__top {
                align-items: center;
                gap: 14px;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__eyebrow {
                display: none;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__title {
                font-size: 14px;
                white-space: nowrap;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__meta {
                display: none;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__actions {
                margin-top: 0;
                margin-left: auto;
                flex-wrap: nowrap;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__btn {
                padding: 10px 12px;
                font-size: 13px;
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
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.08em;
                text-transform: uppercase;
            }

            .p-inline-toolbar__eyebrow { color: #93c5fd; }
            .p-inline-panel__kicker { color: #64748b; }

            .p-inline-toolbar__title,
            .p-inline-panel__title {
                margin: 0;
                line-height: 1.15;
            }

            .p-inline-toolbar__title { font-size: 17px; color: #f8fafc; }
            .p-inline-panel__title { font-size: 22px; color: #0f172a; }

            .p-inline-toolbar__meta,
            .p-inline-panel__meta {
                margin: 6px 0 0;
                font-size: 13px;
                line-height: 1.5;
            }

            .p-inline-toolbar__meta { color: #cbd5e1; }
            .p-inline-panel__meta { color: #64748b; }

            .p-inline-toolbar__actions,
            .p-inline-panel__actions {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 14px;
            }

            .p-inline-toolbar__btn,
            .p-inline-panel__btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 11px 14px;
                background: rgba(255, 255, 255, 0.08);
                color: #f8fafc;
                font-weight: 700;
            }

            .p-inline-toolbar__btn--primary,
            .p-inline-panel__btn--primary {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: #fff;
            }

            .p-inline-toolbar__btn:disabled,
            .p-inline-panel__btn:disabled {
                opacity: 0.55;
                cursor: not-allowed;
            }

            .p-inline-toolbar__notice {
                margin-top: 12px;
                padding: 12px 14px;
                border-radius: 14px;
                background: rgba(148, 163, 184, 0.14);
                font-size: 13px;
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
                background: #ffffff;
                border-radius: 24px;
                border: 1px solid rgba(148, 163, 184, 0.24);
                box-shadow: 0 30px 70px rgba(15, 23, 42, 0.18);
                padding: 18px;
                z-index: 5001;
            }

            .p-inline-panel__head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 16px;
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
                font-size: 13px;
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
                padding: 12px 14px;
            }

            .p-inline-panel__textarea {
                min-height: 112px;
                resize: vertical;
            }

            .p-inline-panel__hint {
                margin: -2px 0 0;
                font-size: 12px;
                line-height: 1.45;
                color: #64748b;
            }

            .p-inline-panel__preview {
                display: grid;
                gap: 10px;
                padding: 12px;
                border-radius: 18px;
                background: #f8fafc;
                border: 1px solid rgba(148, 163, 184, 0.2);
            }

            .p-inline-panel__preview img {
                width: 100%;
                max-height: 240px;
                object-fit: contain;
                border-radius: 14px;
                background: #fff;
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
                padding: 8px 12px;
                border-radius: 999px;
                background: rgba(15, 23, 42, 0.94);
                color: #fff;
                font-size: 12px;
                font-weight: 700;
                line-height: 1;
                pointer-events: none;
                box-shadow: 0 12px 28px rgba(15, 23, 42, 0.22);
                transform: translateY(-8px);
            }

            .p-inline-hover[hidden] {
                display: none;
            }

            @media (max-width: 900px) {
                .p-inline-toolbar.p-inline-toolbar--compact {
                    width: min(360px, calc(100vw - 32px));
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
                    right: 12px;
                    bottom: 88px;
                    width: calc(100vw - 24px);
                    max-height: calc(100vh - 120px);
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

    function buildContentUrl(fileName, options = {}) {
        const suffix = options.fresh ? `?t=${Date.now()}` : '';
        return state.apiAvailable
            ? `/api/content/${fileName}${suffix}`
            : `/content/${fileName}.json${suffix}`;
    }

    const state = {
        enabled: false,
        apiAvailable: false,
        authEnabled: false,
        authenticated: false,
        username: '',
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
                        <span class="p-inline-toolbar__eyebrow">Визуальный редактор</span>
                        <h2 class="p-inline-toolbar__title">Можно править прямо на сайте</h2>
                        <p class="p-inline-toolbar__meta">Нажмите на текст, кнопку или фото, чтобы изменить их на месте.</p>
                    </div>
                </div>
                <div class="p-inline-toolbar__actions">
                    <button class="p-inline-toolbar__btn" type="button" data-inline-action="close">Выйти</button>
                    <button class="p-inline-toolbar__btn p-inline-toolbar__btn--primary" type="button" data-inline-action="save">Сохранить</button>
                    <button class="p-inline-toolbar__btn" type="button" data-inline-action="admin">Полный редактор</button>
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
                    <span class="p-inline-panel__kicker">Правка на странице</span>
                    <h2 class="p-inline-panel__title">Редактирование</h2>
                    <p class="p-inline-panel__meta"></p>
                </div>
                <button class="p-inline-panel__close" type="button" aria-label="Закрыть">&times;</button>
            </div>
            <form class="p-inline-panel__form"></form>
            <div class="p-inline-panel__actions">
                <button class="p-inline-panel__btn" type="button" data-inline-panel-action="cancel">Закрыть</button>
                <button class="p-inline-panel__btn p-inline-panel__btn--primary" type="button" data-inline-panel-action="apply">Применить</button>
            </div>
        `;

        const toast = document.createElement('div');
        toast.className = 'p-inline-toast';
        toast.hidden = true;

        const hover = document.createElement('div');
        hover.className = 'p-inline-hover';
        hover.hidden = true;

        document.body.appendChild(root);
        document.body.appendChild(panel);
        document.body.appendChild(toast);
        document.body.appendChild(hover);

        ui.root = root;
        ui.launcher = root.querySelector('.p-inline-launcher');
        ui.toolbar = root.querySelector('.p-inline-toolbar');
        ui.toolbarTitle = root.querySelector('.p-inline-toolbar__title');
        ui.toolbarMeta = root.querySelector('.p-inline-toolbar__meta');
        ui.toolbarNotice = root.querySelector('.p-inline-toolbar__notice');
        ui.saveBtn = root.querySelector('[data-inline-action="save"]');
        ui.panel = panel;
        ui.panelKicker = panel.querySelector('.p-inline-panel__kicker');
        ui.panelTitle = panel.querySelector('.p-inline-panel__title');
        ui.panelMeta = panel.querySelector('.p-inline-panel__meta');
        ui.panelForm = panel.querySelector('.p-inline-panel__form');
        ui.panelApplyBtn = panel.querySelector('[data-inline-panel-action="apply"]');
        ui.toast = toast;
        ui.hover = hover;
    }

    function getBindingKindLabel(binding) {
        if (!binding) return 'Правка на странице';
        if (binding.type === 'image') return 'Фото на странице';
        if (binding.type === 'list') return 'Список на странице';
        if (binding.type === 'object') return 'Кнопка и ссылка';
        if (binding.type === 'html') return 'Текстовый блок';
        return 'Текст на странице';
    }

    function renderToolbar() {
        if (!ui.launcher) return;

        const dirtyCount = Array.from(state.files.values()).filter((entry) => entry.dirty).length;
        const canSave = canSaveInline();
        const hasIssue = !state.apiAvailable || (state.authEnabled && !state.authenticated);

        ui.launcher.hidden = state.enabled;
        ui.toolbar.hidden = !state.enabled;
        ui.toolbar.classList.toggle('p-inline-toolbar--compact', !hasIssue);
        ui.saveBtn.disabled = !canSave || !dirtyCount;

        if (!state.enabled) return;

        if (!state.apiAvailable) {
            ui.toolbarTitle.textContent = 'Редактор доступен только через admin-server';
            ui.toolbarMeta.textContent = 'Откройте сайт через локальный сервер админки, чтобы сохранять изменения прямо на странице.';
            ui.toolbarNotice.hidden = false;
            ui.toolbarNotice.textContent = 'Подсказка: запустите `node scripts/admin-server.js` и откройте адрес, который покажет сервер.';
            return;
        }

        if (state.authEnabled && !state.authenticated) {
            ui.toolbarTitle.textContent = 'Нужен вход в админку';
            ui.toolbarMeta.textContent = 'Откройте полный редактор, войдите и вернитесь на сайт — после этого визуальное редактирование сохранит правки.';
            ui.toolbarNotice.hidden = false;
            ui.toolbarNotice.textContent = 'Полный редактор откроется в новой вкладке по кнопке справа.';
            return;
        }

        ui.toolbarTitle.textContent = dirtyCount
            ? `Есть несохранённые правки: ${dirtyCount}`
            : 'Можно править прямо на сайте';
        ui.toolbarMeta.textContent = dirtyCount
            ? 'Нажмите «Сохранить», когда закончите. Можно быстро сохранить сочетанием Ctrl+S.'
            : 'Нажмите на текст, кнопку или фото. Для сложных блоков всегда можно открыть полный редактор.';
        ui.toolbarNotice.hidden = true;
        ui.toolbarNotice.textContent = '';
    }

    async function refreshEnvironment() {
        state.apiAvailable = await checkApiAvailability();
        const session = await checkAuthSession();
        state.authEnabled = session.authEnabled;
        state.authenticated = session.authenticated;
        state.username = session.username || '';
        renderToolbar();
    }

    function closePanel() {
        if (!ui.panel) return;
        ui.panel.hidden = true;
        state.activeBindingId = '';
        state.bindings.forEach((binding) => {
            binding.elements.forEach((element) => element.classList.remove(ACTIVE_CLASS));
        });
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
        state.enabled = false;
        closePanel();
        document.body.classList.remove(MODE_CLASS);
        renderToolbar();
    }

    async function enterEditMode() {
        await refreshEnvironment();
        state.enabled = true;
        document.body.classList.add(MODE_CLASS);
        renderToolbar();

        if (!state.apiAvailable) {
            showToast('Сейчас открыт обычный сервер. Для сохранения нужен admin-server.');
        } else if (state.authEnabled && !state.authenticated) {
            showToast('Сначала войдите в полную админку.');
        } else {
            showToast('Режим редактирования включён');
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

        const data = await response.json();
        const entry = {
            fileName,
            sectionKey: fileName,
            sectionLabel: sectionLabel || fileName,
            data,
            dirty: false
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

    function normalizeBinding(config, sectionConfig, index) {
        const elements = (Array.isArray(config.element) ? config.element : [config.element]).filter(Boolean);
        if (!elements.length || !config.path) return null;

        const id = config.id || `${sectionConfig.fileName}:${config.path}:${index}`;
        const binding = {
            id,
            type: config.type || 'text',
            label: config.label || config.path,
            hint: config.hint || '',
            fileName: sectionConfig.fileName,
            sectionKey: sectionConfig.sectionKey || sectionConfig.fileName,
            sectionLabel: sectionConfig.sectionLabel || sectionConfig.fileName,
            path: config.path,
            fields: config.fields || [],
            elements,
            render: config.render || null,
            defaultValue: config.defaultValue,
            directory: config.directory || 'assets/images/catalog'
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
        });
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
            control.className = 'p-inline-panel__textarea';
            control.value = field.type === 'list'
                ? (Array.isArray(value) ? value.join('\n') : '')
                : (value ?? '');
        } else {
            control = document.createElement('input');
            control.className = 'p-inline-panel__control';
            control.type = field.type === 'number' ? 'number' : 'text';
            control.value = value ?? '';
        }

        control.name = field.key || 'value';
        wrapper.appendChild(control);

        if (field.hint) {
            const hint = document.createElement('p');
            hint.className = 'p-inline-panel__hint';
            hint.textContent = field.hint;
            wrapper.appendChild(hint);
        }

        return wrapper;
    }

    function getBindingEditorFields(binding) {
        if (binding.fields.length) return binding.fields;

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

    function fillPanel(binding, value) {
        ui.panelKicker.textContent = getBindingKindLabel(binding);
        ui.panelTitle.textContent = binding.label;
        ui.panelMeta.textContent = `${binding.sectionLabel} · ${binding.fileName}.json · Ctrl+Enter — применить`;
        ui.panelForm.innerHTML = '';

        const editorFields = getBindingEditorFields(binding);

        if (binding.type === 'image') {
            const preview = document.createElement('div');
            preview.className = 'p-inline-panel__preview';
            const image = document.createElement('img');
            image.alt = value?.alt || binding.label;
            image.src = value?.src || '';
            preview.appendChild(image);

            const fileInput = document.createElement('input');
            fileInput.className = 'p-inline-panel__control';
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.name = '__imageUpload';
            fileInput.addEventListener('change', () => {
                const nextFile = fileInput.files?.[0];
                if (!nextFile) return;
                image.src = URL.createObjectURL(nextFile);
            });
            preview.appendChild(fileInput);
            ui.panelForm.appendChild(preview);

            const imageHint = document.createElement('p');
            imageHint.className = 'p-inline-panel__hint';
            imageHint.textContent = 'Загрузи новое изображение и при необходимости поправь alt или подпись ниже.';
            ui.panelForm.appendChild(imageHint);
        }

        editorFields.forEach((field) => {
            const fieldValue = field.key === '__value'
                ? value
                : value?.[field.key];
            ui.panelForm.appendChild(createFieldGroup(field, fieldValue));
        });

        const firstControl = ui.panelForm.querySelector('input, textarea');
        if (firstControl) {
            window.setTimeout(() => {
                firstControl.focus();
                if (firstControl instanceof HTMLInputElement || firstControl instanceof HTMLTextAreaElement) {
                    firstControl.setSelectionRange?.(firstControl.value.length, firstControl.value.length);
                }
            }, 0);
        }
    }

    async function openBinding(bindingId) {
        try {
            const binding = state.bindingMap.get(bindingId);
            if (!binding) return;

            if (!state.apiAvailable) {
                showToast('Для редактирования с сохранением откройте сайт через admin-server.');
                return;
            }

            if (state.authEnabled && !state.authenticated) {
                showToast('Сначала войдите в полную админку.');
                return;
            }

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const storedValue = getByPath(fileState.data, binding.path);
            const value = storedValue === undefined
                ? resolveBindingDefault(binding)
                : cloneData(storedValue);

            state.activeBindingId = binding.id;
            clearActiveMarks();
            binding.elements.forEach((element) => element.classList.add(ACTIVE_CLASS));

            fillPanel(binding, value);
            ui.panel.hidden = false;
        } catch (error) {
            showToast(error.message || 'Не удалось открыть редактор');
        }
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

    async function collectPanelValue(binding) {
        const currentFile = state.files.get(binding.fileName);
        const storedValue = getByPath(currentFile.data, binding.path);
        const currentValue = storedValue === undefined
            ? resolveBindingDefault(binding)
            : cloneData(storedValue);
        const nextValue = binding.fields.length || binding.type === 'image' ? { ...(currentValue || {}) } : currentValue;
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

            nextValue[field.key] = value;
        }

        const uploadControl = ui.panelForm.querySelector('[name="__imageUpload"]');
        if (uploadControl?.files?.[0]) {
            nextValue.src = await uploadImage(uploadControl.files[0], binding.directory);
        }

        return nextValue;
    }

    async function applyActiveBinding() {
        try {
            const binding = state.bindingMap.get(state.activeBindingId);
            if (!binding) return;

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const nextValue = await collectPanelValue(binding);
            setByPath(fileState.data, binding.path, nextValue);
            fileState.dirty = true;
            markBindingDirty(binding);
            rerenderBindingsForPath(binding.fileName, binding.path);
            renderToolbar();
            closePanel();
            showToast('Правка применена');
        } catch (error) {
            showToast(error.message || 'Не удалось применить правку');
        }
    }

    async function saveDirtyFiles() {
        if (!canSaveInline()) {
            showToast('Сохранение недоступно');
            return;
        }

        const dirtyEntries = Array.from(state.files.values()).filter((entry) => entry.dirty);
        if (!dirtyEntries.length) {
            showToast('Нечего сохранять');
            return;
        }

        ui.saveBtn.disabled = true;
        ui.saveBtn.textContent = 'Сохраняю...';

        try {
            for (const entry of dirtyEntries) {
                const response = await fetch(`/api/content/${entry.fileName}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Admin-Section-Key': entry.sectionKey || entry.fileName,
                        'X-Admin-Section-Label': entry.sectionLabel || entry.fileName
                    },
                    body: JSON.stringify(entry.data)
                });

                if (!response.ok) {
                    throw new Error(`Не удалось сохранить ${entry.fileName}.json`);
                }

                entry.dirty = false;
            }

            clearDirtyMarks();
            renderToolbar();
            showToast('Изменения сохранены');
        } catch (error) {
            showToast(error.message || 'Ошибка сохранения');
        } finally {
            ui.saveBtn.textContent = 'Сохранить';
            ui.saveBtn.disabled = !hasDirtyFiles();
        }
    }

    function handleDocumentClick(event) {
        if (!state.enabled) return;
        if (ui.panel?.contains(event.target) || ui.root?.contains(event.target)) return;

        const target = event.target.closest('[data-inline-edit-id]');
        if (!target) return;

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
        ui.hover.style.top = `${Math.max(12, rect.top - 14)}px`;
        ui.hover.style.left = `${Math.min(window.innerWidth - 240, Math.max(12, rect.left))}px`;
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

        if (ui.panel?.contains(event.target) || ui.root?.contains(event.target)) {
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

        if (event.key !== 'Escape') return;

        if (!ui.panel.hidden) {
            closePanel();
            return;
        }

        exitEditMode();
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

        ui.root.querySelector('[data-inline-action="admin"]').addEventListener('click', () => {
            window.open('/admin/', '_blank', 'noopener');
        });

        ui.panel.querySelector('.p-inline-panel__close').addEventListener('click', closePanel);
        ui.panel.querySelector('[data-inline-panel-action="cancel"]').addEventListener('click', closePanel);
        ui.panelApplyBtn.addEventListener('click', () => {
            applyActiveBinding();
        });

        document.addEventListener('click', handleDocumentClick, true);
        document.addEventListener('pointermove', handlePointerMove, true);
        document.addEventListener('keydown', handleKeydown);
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
