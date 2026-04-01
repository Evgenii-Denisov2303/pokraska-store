(function() {
    if (window.PokraskaInlineEditor) return;

    const STYLE_ID = 'pokraska-inline-editor-style';
    const ACTIVE_CLASS = 'p-inline-active';
    const ACTIVE_TARGET_CLASS = 'p-inline-active-target';
    const DIRTY_CLASS = 'p-inline-dirty';
    const HOVER_TARGET_CLASS = 'p-inline-hover-target';
    const REVEAL_CLASS = 'p-inline-reveal';
    const MODE_CLASS = 'p-inline-mode';
    const SUPPRESS_HOVER_CLASS = 'p-inline-suppress-hover';
    const RECENT_PAGES_STORAGE_KEY = 'pokraska:inline-recent-pages:v1';
    const DRAFT_FILES_STORAGE_KEY = 'pokraska:inline-draft-files:v1';
    const MAX_RECENT_PAGES = 6;
    const OVERVIEW_ENABLED = true;
    const HOVER_LABEL_ENABLED = false;
    const INLINE_ICON_OPTIONS = [
        { value: '', label: 'Без иконки', preview: '—', group: 'common', keywords: ['пусто', 'убрать', 'без'], featured: true },
        { value: 'fas fa-phone', label: 'Телефон', group: 'contact', keywords: ['звонок', 'трубка', 'call'], featured: true },
        { value: 'fas fa-phone-alt', label: 'Звонок', group: 'contact', keywords: ['контакт', 'связь'], featured: false },
        { value: 'fas fa-mobile-alt', label: 'Мобильный', group: 'contact', keywords: ['смартфон', 'номер'], featured: false },
        { value: 'fab fa-telegram-plane', label: 'Telegram', group: 'contact', keywords: ['телеграм', 'мессенджер'], featured: true },
        { value: 'fab fa-whatsapp', label: 'WhatsApp', group: 'contact', keywords: ['ватсап', 'мессенджер'], featured: false },
        { value: 'fas fa-envelope', label: 'Почта', group: 'contact', keywords: ['email', 'письмо'], featured: true },
        { value: 'fas fa-comment-dots', label: 'Сообщение', group: 'contact', keywords: ['чат', 'ответ'], featured: true },
        { value: 'fas fa-comments', label: 'Диалог', group: 'contact', keywords: ['чат', 'обсуждение'], featured: false },
        { value: 'fas fa-map-marker-alt', label: 'Адрес', group: 'contact', keywords: ['карта', 'точка', 'локация'], featured: true },
        { value: 'fas fa-map-signs', label: 'Маршрут', group: 'contact', keywords: ['навигация', 'проезд'], featured: false },
        { value: 'fas fa-clock', label: 'Часы', group: 'contact', keywords: ['время', 'режим'], featured: true },
        { value: 'fas fa-calendar-alt', label: 'Дата', group: 'contact', keywords: ['календарь', 'срок'], featured: false },
        { value: 'fas fa-phone-volume', label: 'Горячая линия', group: 'contact', keywords: ['звонок', 'связь', 'контакт'], featured: false },
        { value: 'fas fa-envelope-open-text', label: 'Письмо', group: 'contact', keywords: ['почта', 'сообщение', 'email'], featured: false },
        { value: 'fas fa-arrow-right', label: 'Стрелка', group: 'action', keywords: ['вперед', 'далее'], featured: true },
        { value: 'fas fa-long-arrow-alt-right', label: 'Длинная стрелка', group: 'action', keywords: ['направление', 'переход'], featured: false },
        { value: 'fas fa-external-link-alt', label: 'Внешняя ссылка', group: 'action', keywords: ['открыть', 'переход'], featured: false },
        { value: 'fas fa-link', label: 'Ссылка', group: 'action', keywords: ['url', 'переход'], featured: true },
        { value: 'fas fa-th-large', label: 'Плитки', group: 'action', keywords: ['каталог', 'карточки'], featured: false },
        { value: 'fas fa-th-list', label: 'Список', group: 'action', keywords: ['пункты', 'список'], featured: false },
        { value: 'fas fa-layer-group', label: 'Слои', group: 'action', keywords: ['группы', 'разделы'], featured: false },
        { value: 'fas fa-grip-lines-vertical', label: 'Штакетник', group: 'action', keywords: ['планки', 'заполнение', 'забор'], featured: false },
        { value: 'fas fa-border-all', label: 'Секции', group: 'action', keywords: ['панели', 'пролеты', 'забор'], featured: false },
        { value: 'fas fa-check', label: 'Галочка', group: 'status', keywords: ['ок', 'готово'], featured: true },
        { value: 'fas fa-check-circle', label: 'Подтверждение', group: 'status', keywords: ['успех', 'принято'], featured: true },
        { value: 'fas fa-shield-alt', label: 'Защита', group: 'status', keywords: ['гарантия', 'надежно'], featured: true },
        { value: 'fas fa-lock', label: 'Замок', group: 'status', keywords: ['закрыто', 'безопасность'], featured: false },
        { value: 'fas fa-unlock-alt', label: 'Открытый замок', group: 'status', keywords: ['доступ', 'открыто'], featured: false },
        { value: 'fas fa-star', label: 'Звезда', group: 'status', keywords: ['важно', 'лучшее'], featured: false },
        { value: 'fas fa-medal', label: 'Медаль', group: 'status', keywords: ['награда', 'качество'], featured: false },
        { value: 'fas fa-thumbs-up', label: 'Одобрение', group: 'status', keywords: ['нравится', 'рекомендация'], featured: false },
        { value: 'fas fa-info-circle', label: 'Информация', group: 'status', keywords: ['подсказка', 'важно'], featured: false },
        { value: 'fas fa-question-circle', label: 'Вопрос', group: 'status', keywords: ['faq', 'справка'], featured: false },
        { value: 'fas fa-exclamation-circle', label: 'Внимание', group: 'status', keywords: ['предупреждение', 'акцент'], featured: false },
        { value: 'fas fa-file-contract', label: 'Договор', group: 'status', keywords: ['документы', 'официально', 'соглашение'], featured: true },
        { value: 'fas fa-receipt', label: 'Документы', group: 'status', keywords: ['чек', 'отчетность', 'закрывающие'], featured: false },
        { value: 'fas fa-stamp', label: 'Печать', group: 'status', keywords: ['официально', 'документы', 'юрлица'], featured: false },
        { value: 'fas fa-percent', label: 'НДС и оплата', group: 'status', keywords: ['ндс', 'скидка', 'проценты', 'оплата'], featured: false },
        { value: 'fas fa-building-shield', label: 'Надежная компания', group: 'status', keywords: ['защита', 'организация', 'доверие'], featured: false },
        { value: 'fas fa-hammer', label: 'Монтаж', group: 'work', keywords: ['установка', 'работа'], featured: true },
        { value: 'fas fa-tools', label: 'Инструменты', group: 'work', keywords: ['сервис', 'ремонт'], featured: false },
        { value: 'fas fa-wrench', label: 'Инструмент', group: 'work', keywords: ['настройка', 'ремонт'], featured: false },
        { value: 'fas fa-cog', label: 'Шестеренка', group: 'work', keywords: ['настройка', 'параметры'], featured: false },
        { value: 'fas fa-cogs', label: 'Механизм', group: 'work', keywords: ['оборудование', 'автоматика'], featured: true },
        { value: 'fas fa-bolt', label: 'Автоматика', group: 'work', keywords: ['электрика', 'привод'], featured: true },
        { value: 'fas fa-plug', label: 'Подключение', group: 'work', keywords: ['кабель', 'электрика', 'автоматика'], featured: false },
        { value: 'fas fa-sliders-h', label: 'Настройка', group: 'work', keywords: ['регулировка', 'параметры', 'автоматика'], featured: false },
        { value: 'fas fa-microchip', label: 'Блок управления', group: 'work', keywords: ['контроллер', 'плата', 'автоматика'], featured: false },
        { value: 'fas fa-palette', label: 'Палитра', group: 'work', keywords: ['цвет', 'дизайн'], featured: true },
        { value: 'fas fa-paint-roller', label: 'Покраска', group: 'work', keywords: ['порошковая', 'покрытие'], featured: true },
        { value: 'fas fa-spray-can', label: 'Напыление', group: 'work', keywords: ['распыление', 'краска'], featured: false },
        { value: 'fas fa-spray-can-sparkles', label: 'Финишное покрытие', group: 'work', keywords: ['краска', 'порошковая', 'покрытие'], featured: false },
        { value: 'fas fa-fill-drip', label: 'Покрытие', group: 'work', keywords: ['материал', 'слой', 'краска'], featured: false },
        { value: 'fas fa-brush', label: 'Фактура', group: 'work', keywords: ['текстура', 'декор', 'покрытие'], featured: false },
        { value: 'fas fa-wind', label: 'Пескоструй', group: 'work', keywords: ['очистка', 'подготовка', 'абразив'], featured: false },
        { value: 'fas fa-ruler-combined', label: 'Размеры', group: 'work', keywords: ['замер', 'габариты'], featured: false },
        { value: 'fas fa-bolt-lightning', label: 'Электропривод', group: 'work', keywords: ['автоматика', 'привод', 'электрика'], featured: false },
        { value: 'fas fa-home', label: 'Дом', group: 'place', keywords: ['участок', 'коттедж'], featured: true },
        { value: 'fas fa-store', label: 'Магазин', group: 'place', keywords: ['витрина', 'объект'], featured: false },
        { value: 'fas fa-building', label: 'Здание', group: 'place', keywords: ['офис', 'объект'], featured: false },
        { value: 'fas fa-city', label: 'Город', group: 'place', keywords: ['коммерция', 'район'], featured: false },
        { value: 'fas fa-industry', label: 'Производство', group: 'place', keywords: ['цех', 'завод'], featured: false },
        { value: 'fas fa-warehouse', label: 'Склад', group: 'place', keywords: ['ангар', 'объект'], featured: false },
        { value: 'fas fa-truck', label: 'Доставка', group: 'place', keywords: ['логистика', 'выезд'], featured: true },
        { value: 'fas fa-truck-fast', label: 'Быстрый выезд', group: 'place', keywords: ['доставка', 'оперативно', 'логистика'], featured: false },
        { value: 'fas fa-truck-moving', label: 'Монтажная бригада', group: 'place', keywords: ['доставка', 'монтаж', 'выезд'], featured: false },
        { value: 'fas fa-archway', label: 'Ворота', group: 'place', keywords: ['въезд', 'арка'], featured: false },
        { value: 'fas fa-door-open', label: 'Дверь', group: 'place', keywords: ['калитка', 'вход'], featured: false },
        { value: 'fas fa-columns', label: 'Столбы', group: 'place', keywords: ['опоры', 'колонны', 'забор'], featured: false },
        { value: 'fas fa-window-maximize', label: 'Панель', group: 'place', keywords: ['секция', 'лист', 'заполнение'], featured: false },
        { value: 'fas fa-camera', label: 'Фото', group: 'media', keywords: ['снимок', 'галерея'], featured: false },
        { value: 'fas fa-image', label: 'Картинка', group: 'media', keywords: ['изображение', 'баннер'], featured: false },
        { value: 'fas fa-images', label: 'Галерея', group: 'media', keywords: ['фото', 'примеры'], featured: false },
        { value: 'fas fa-tag', label: 'Цена', group: 'media', keywords: ['стоимость', 'ярлык'], featured: false },
        { value: 'fas fa-calculator', label: 'Расчет', group: 'media', keywords: ['калькулятор', 'стоимость'], featured: false },
        { value: 'fas fa-ruble-sign', label: 'Рубль', group: 'media', keywords: ['деньги', 'оплата'], featured: false },
        { value: 'fas fa-image-portrait', label: 'Вертикальное фото', group: 'media', keywords: ['портрет', 'фото', 'изображение'], featured: false },
        { value: 'fas fa-tags', label: 'Прайс и варианты', group: 'media', keywords: ['цены', 'варианты', 'стоимость'], featured: false }
    ];
    const INLINE_ICON_GROUP_LABELS = {
        common: 'Часто используют',
        contact: 'Связь и контакты',
        action: 'Переходы и действия',
        status: 'Статус и доверие',
        work: 'Работы и услуги',
        place: 'Объекты и локации',
        media: 'Медиа и акценты'
    };
    const INLINE_ICON_GROUP_ORDER = ['contact', 'action', 'status', 'work', 'place', 'media'];
    const INLINE_LINK_TYPE_OPTIONS = [
        { value: 'page', label: 'Страница сайта' },
        { value: 'section', label: 'Блок на этой странице' },
        { value: 'phone', label: 'Телефон' },
        { value: 'telegram', label: 'Telegram' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'email', label: 'Почта' },
        { value: 'external', label: 'Внешний сайт' },
        { value: 'custom', label: 'Свой адрес' }
    ];
    const INLINE_SITE_PAGE_TARGETS = [
        { value: 'index.html', label: 'Главная' },
        { value: 'index.html#request-form', label: 'Главная → Форма заявки' },
        { value: 'pages/services.html', label: 'Каталог' },
        { value: 'pages/services.html#catalog-panel-sliding', label: 'Каталог → Откатные ворота' },
        { value: 'pages/services.html#catalog-panel-swing', label: 'Каталог → Распашные ворота' },
        { value: 'pages/services.html#catalog-panel-wicket', label: 'Каталог → Калитки' },
        { value: 'pages/services.html#catalog-panel-fence-profnastil', label: 'Каталог → Заборы из профнастила' },
        { value: 'pages/powder-coating.html', label: 'Порошковая покраска' },
        { value: 'pages/sandblasting.html', label: 'Пескоструйная обработка' },
        { value: 'pages/prices.html', label: 'Цены' },
        { value: 'pages/payment-documents.html', label: 'Оплата и документы' },
        { value: 'pages/gallery.html', label: 'Работы' },
        { value: 'pages/contacts.html', label: 'Контакты' }
    ];
    const INLINE_BUTTON_STYLE_LIBRARY = {
        primary: {
            value: 'primary',
            label: 'Главная',
            meta: 'Яркая кнопка для главного действия.',
            previewClass: 'primary'
        },
        secondary: {
            value: 'secondary',
            label: 'Спокойная',
            meta: 'Более мягкий вариант рядом с главной кнопкой.',
            previewClass: 'secondary'
        },
        outline: {
            value: 'outline',
            label: 'Контурная',
            meta: 'Кнопка с обводкой, без плотной заливки.',
            previewClass: 'outline'
        }
    };
    const query = new URLSearchParams(window.location.search);
    const autoEnable = query.get('edit') === '1';
    const requestedFocus = (query.get('focus') || '').trim().toLowerCase();
    const requestedResumeFile = (query.get('resumeFile') || '').trim();
    const requestedResumePath = (query.get('resumePath') || '').trim();
    const inlineBootstrapSession = window.POKRASKA_INLINE_SESSION && typeof window.POKRASKA_INLINE_SESSION === 'object'
        ? {
            authEnabled: Boolean(window.POKRASKA_INLINE_SESSION.authEnabled),
            authenticated: Boolean(window.POKRASKA_INLINE_SESSION.authenticated),
            username: window.POKRASKA_INLINE_SESSION.username || ''
        }
        : null;
    let inlineSessionCache = inlineBootstrapSession;
    const wantsInlineEditor = Boolean(window.POKRASKA_INLINE_EDITOR_ENABLED)
        || query.get('edit') === '1'
        || ['localhost', '127.0.0.1'].includes(window.location.hostname)
        || window.location.port === '4173';

    if (!wantsInlineEditor) return;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            :root {
                --p-inline-dock-offset: 124px;
            }

            body.${MODE_CLASS} [data-inline-edit-id] {
                cursor: pointer;
                outline: 2px solid transparent;
                outline-offset: 4px;
                border-radius: 14px;
                scroll-margin-top: 80px;
                transition: outline-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
            }

            body.${MODE_CLASS} [data-inline-edit-id]:hover,
            body.${MODE_CLASS} [data-inline-edit-id].${ACTIVE_CLASS},
            body.${MODE_CLASS} .${HOVER_TARGET_CLASS},
            body.${MODE_CLASS} .${ACTIVE_TARGET_CLASS} {
                outline-color: rgba(37, 99, 235, 0.75);
                background-color: rgba(37, 99, 235, 0.05);
                box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18) inset, 0 0 0 8px rgba(37, 99, 235, 0.12);
            }

            body.${MODE_CLASS} [data-inline-edit-id].${ACTIVE_CLASS} {
                outline-color: rgba(37, 99, 235, 0.9);
                background-color: rgba(37, 99, 235, 0.08);
                box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.26) inset, 0 0 0 10px rgba(37, 99, 235, 0.15);
            }

            body.${MODE_CLASS} .${ACTIVE_TARGET_CLASS} {
                cursor: pointer;
                outline: 2px solid rgba(37, 99, 235, 0.9);
                outline-offset: 4px;
                border-radius: 14px;
                background-color: rgba(37, 99, 235, 0.08);
                box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.26) inset, 0 0 0 10px rgba(37, 99, 235, 0.15);
                scroll-margin-top: 80px;
                transition: outline-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
            }

            body.${MODE_CLASS} .${HOVER_TARGET_CLASS} {
                cursor: pointer;
                outline: 2px solid rgba(37, 99, 235, 0.75);
                outline-offset: 4px;
                border-radius: 14px;
                background-color: rgba(37, 99, 235, 0.05);
                box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18) inset, 0 0 0 8px rgba(37, 99, 235, 0.12);
                scroll-margin-top: 80px;
                transition: outline-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
            }

            body.${MODE_CLASS} [data-inline-edit-id].${SUPPRESS_HOVER_CLASS}:hover {
                outline-color: transparent;
                background-color: transparent;
                box-shadow: none;
            }

            body.${MODE_CLASS} [data-inline-edit-id].${DIRTY_CLASS} {
                outline-color: rgba(5, 150, 105, 0.82);
                background-color: rgba(5, 150, 105, 0.07);
                box-shadow: 0 0 0 1px rgba(5, 150, 105, 0.22) inset, 0 0 0 10px rgba(5, 150, 105, 0.15);
            }

            body.${MODE_CLASS} [data-inline-edit-id].${REVEAL_CLASS},
            body.${MODE_CLASS} .${ACTIVE_TARGET_CLASS}.${REVEAL_CLASS} {
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
                gap: 8px;
                pointer-events: none;
            }

            .p-inline-root > * {
                pointer-events: auto;
            }

            body.${MODE_CLASS} .gallery-page .gallery-item .image-overlay,
            body.${MODE_CLASS} .gallery-page .gallery-item .image-overlay *,
            body.${MODE_CLASS} .gallery-page .gallery-item .zoom-btn,
            body.${MODE_CLASS} .gallery-page .gallery-item .zoom-btn * {
                pointer-events: none !important;
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
                display: none !important;
            }

            .p-inline-toolbar__btn[hidden],
            .p-inline-panel__btn[hidden],
            .p-inline-panel__back[hidden],
            .p-inline-overview__search-clear[hidden] {
                display: none !important;
            }

            .p-inline-toolbar {
                width: fit-content;
                min-width: min(456px, calc(100vw - 32px));
                max-width: min(456px, calc(100vw - 32px));
                background: linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(30, 41, 59, 0.92));
                color: #e2e8f0;
                border: 1px solid rgba(96, 165, 250, 0.18);
                border-radius: 22px;
                padding: 14px 16px;
                box-shadow: 0 20px 42px rgba(15, 23, 42, 0.22);
                backdrop-filter: blur(18px);
            }

            .p-inline-toolbar.p-inline-toolbar--compact {
                width: fit-content;
                min-width: min(456px, calc(100vw - 32px));
                max-width: min(456px, calc(100vw - 32px));
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto;
                align-items: center;
                gap: 10px 12px;
                padding: 10px 12px;
                border-radius: 22px;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__top {
                align-items: center;
                gap: 8px;
                flex-wrap: nowrap;
                min-width: 0;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__top > div {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__eyebrow {
                margin: 0;
                flex: 0 0 auto;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__title {
                font-size: 15px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__meta {
                display: none;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__actions {
                margin-top: 0;
                margin-left: auto;
                justify-content: flex-end;
                flex-wrap: nowrap;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__btn {
                min-height: 38px;
                padding: 9px 12px;
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
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.04em;
                text-transform: none;
            }

            .p-inline-toolbar__eyebrow {
                width: fit-content;
                padding: 0 10px;
                min-height: 24px;
                border-radius: 999px;
                background: rgba(96, 165, 250, 0.14);
                color: #bfdbfe;
            }
            .p-inline-panel__kicker {
                width: fit-content;
                padding: 0 10px;
                min-height: 24px;
                border-radius: 999px;
                background: rgba(37, 99, 235, 0.08);
                color: #1d4ed8;
            }

            .p-inline-toolbar__title,
            .p-inline-panel__title {
                margin: 0;
                line-height: 1.15;
                overflow-wrap: anywhere;
                text-wrap: balance;
            }

            .p-inline-toolbar__title { font-size: 17px; color: #f8fafc; }
            .p-inline-panel__title { font-size: 21px; font-weight: 800; color: #0f172a; }

            .p-inline-toolbar__meta,
            .p-inline-panel__meta {
                margin: 6px 0 0;
                font-size: 15px;
                line-height: 1.5;
                overflow-wrap: anywhere;
                text-wrap: pretty;
            }

            .p-inline-toolbar__meta { color: rgba(226, 232, 240, 0.84); }
            .p-inline-panel__meta {
                color: #64748b;
                font-size: 13px;
                line-height: 1.35;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .p-inline-toolbar__actions,
            .p-inline-panel__actions {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: flex-start;
                gap: 8px;
                margin-top: 14px;
            }

            .p-inline-toolbar__actions {
                display: flex;
                overflow-x: auto;
                scrollbar-width: none;
                padding-bottom: 2px;
                justify-content: flex-end;
            }

            .p-inline-toolbar__actions::-webkit-scrollbar {
                display: none;
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
                background: #eef2ff;
                color: #1e3a8a;
                font-weight: 700;
                font-size: 15px;
                text-align: center;
                line-height: 1.2;
                border: 1px solid rgba(148, 163, 184, 0.2);
            }

            .p-inline-toolbar__btn {
                white-space: nowrap;
                text-wrap: nowrap;
                overflow-wrap: normal;
                background: rgba(255, 255, 255, 0.08);
                color: #e2e8f0;
                border-color: rgba(148, 163, 184, 0.22);
            }

            .p-inline-panel__btn {
                white-space: nowrap;
                text-wrap: nowrap;
                overflow-wrap: normal;
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

            .p-inline-toolbar__btn--primary.is-idle {
                background: rgba(255, 255, 255, 0.08);
                color: rgba(226, 232, 240, 0.74);
                border: 1px solid rgba(148, 163, 184, 0.22);
                box-shadow: none;
            }

            .p-inline-panel__btn--primary.is-idle {
                background: linear-gradient(135deg, #94a3b8, #64748b);
                color: #f8fafc;
                box-shadow: none;
            }

            .p-inline-panel__btn--primary.is-active {
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
            }

            .p-inline-toolbar__btn:disabled,
            .p-inline-panel__btn:disabled {
                opacity: 0.55;
                cursor: not-allowed;
            }

            .p-inline-toolbar__btn:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.14);
                transform: translateY(-1px);
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

            .p-inline-panel__icon-preview[hidden] {
                display: none !important;
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
                gap: 10px;
                margin-top: 0;
            }

            .p-inline-panel__icon-picker-open {
                min-height: 44px;
                justify-content: center;
            }

            .p-inline-panel__icon-picker-note {
                margin: 0;
                font-size: 13px;
                line-height: 1.5;
                color: #64748b;
            }

            .p-inline-panel__icon-library {
                display: grid;
                gap: 10px;
                margin-top: 10px;
            }

            .p-inline-panel__icon-library-title {
                font-size: 13px;
                font-weight: 800;
                color: #475569;
            }

            .p-inline-panel__icon-library-details {
                border: 1px solid rgba(148, 163, 184, 0.2);
                border-radius: 18px;
                background: linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 0.96));
                overflow: hidden;
            }

            .p-inline-panel__icon-library-summary {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                padding: 14px 16px;
                cursor: pointer;
                list-style: none;
                user-select: none;
                color: #0f172a;
                font-size: 14px;
                font-weight: 800;
            }

            .p-inline-panel__icon-library-summary::-webkit-details-marker {
                display: none;
            }

            .p-inline-panel__icon-library-summary::after {
                content: '▾';
                color: #64748b;
                font-size: 14px;
                transition: transform 0.18s ease;
            }

            .p-inline-panel__icon-library-details[open] .p-inline-panel__icon-library-summary::after {
                transform: rotate(180deg);
            }

            .p-inline-panel__icon-library-count {
                display: inline-flex;
                align-items: center;
                padding: 6px 10px;
                border-radius: 999px;
                background: rgba(37, 99, 235, 0.08);
                color: #1d4ed8;
                font-size: 12px;
                font-weight: 800;
                white-space: nowrap;
            }

            .p-inline-panel__icon-library-body {
                display: grid;
                gap: 12px;
                padding: 0 16px 16px;
            }

            .p-inline-panel__icon-search {
                width: 100%;
                min-height: 42px;
                padding: 0 14px;
                border-radius: 14px;
                border: 1px solid rgba(148, 163, 184, 0.22);
                background: #fff;
                color: #0f172a;
                font: inherit;
            }

            .p-inline-panel__icon-search:focus {
                outline: none;
                border-color: rgba(37, 99, 235, 0.46);
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
            }

            .p-inline-panel__icon-library-meta {
                font-size: 12px;
                line-height: 1.5;
                color: #64748b;
            }

            .p-inline-panel__icon-groups {
                display: grid;
                gap: 14px;
                max-height: 380px;
                overflow: auto;
                padding-right: 4px;
            }

            .p-inline-panel__icon-group {
                display: grid;
                gap: 8px;
            }

            .p-inline-panel__icon-group-title {
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.02em;
                color: #475569;
            }

            .p-inline-panel__icon-group-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
                gap: 8px;
            }

            .p-inline-panel__icon-empty {
                padding: 14px;
                border-radius: 14px;
                border: 1px dashed rgba(148, 163, 184, 0.28);
                background: rgba(255, 255, 255, 0.8);
                color: #64748b;
                font-size: 13px;
                line-height: 1.5;
            }

            .p-inline-icon-modal[hidden] {
                display: none !important;
            }

            .p-inline-icon-modal {
                position: fixed;
                inset: 0;
                z-index: 5004;
                display: grid;
                place-items: center;
                padding: 20px;
            }

            .p-inline-icon-modal__backdrop {
                position: absolute;
                inset: 0;
                background: rgba(15, 23, 42, 0.56);
                backdrop-filter: blur(10px);
            }

            .p-inline-icon-modal__dialog {
                position: relative;
                z-index: 1;
                width: min(920px, calc(100vw - 24px));
                max-height: min(86vh, 880px);
                display: grid;
                gap: 16px;
                overflow: hidden;
                border-radius: 28px;
                border: 1px solid rgba(148, 163, 184, 0.22);
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.995), rgba(247, 250, 255, 0.98));
                box-shadow: 0 34px 80px rgba(15, 23, 42, 0.24);
                padding: 22px 22px 20px;
            }

            .p-inline-icon-modal__head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 14px;
            }

            .p-inline-icon-modal__head-copy {
                display: grid;
                gap: 4px;
                min-width: 0;
            }

            .p-inline-icon-modal__title {
                margin: 0;
                font-size: 24px;
                line-height: 1.1;
                color: #0f172a;
                text-wrap: balance;
            }

            .p-inline-icon-modal__meta {
                margin: 0;
                font-size: 14px;
                line-height: 1.6;
                color: #64748b;
                text-wrap: pretty;
            }

            .p-inline-icon-modal__close {
                width: 42px;
                height: 42px;
                border: 0;
                border-radius: 999px;
                background: #eef2ff;
                color: #1e3a8a;
                font-size: 20px;
                cursor: pointer;
                flex: 0 0 auto;
            }

            .p-inline-icon-modal__topbar {
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto;
                gap: 14px;
                align-items: center;
            }

            .p-inline-icon-modal__selected {
                margin: 0;
            }

            .p-inline-icon-modal__search {
                width: 100%;
                min-height: 46px;
                padding: 0 16px;
                border-radius: 16px;
                border: 1px solid rgba(148, 163, 184, 0.24);
                background: #fff;
                color: #0f172a;
                font: inherit;
            }

            .p-inline-icon-modal__search:focus {
                outline: none;
                border-color: rgba(37, 99, 235, 0.46);
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
            }

            .p-inline-icon-modal__meta-row {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 10px;
                font-size: 13px;
                color: #64748b;
            }

            .p-inline-icon-modal__scroll {
                max-height: min(58vh, 560px);
                overflow: auto;
                padding-right: 6px;
            }

            .p-inline-auth-modal[hidden] {
                display: none !important;
            }

            .p-inline-auth-modal {
                position: fixed;
                inset: 0;
                z-index: 5005;
                display: grid;
                place-items: center;
                padding: 20px;
            }

            .p-inline-auth-modal__backdrop {
                position: absolute;
                inset: 0;
                background: rgba(15, 23, 42, 0.56);
                backdrop-filter: blur(10px);
            }

            .p-inline-auth-modal__dialog {
                position: relative;
                z-index: 1;
                width: min(460px, calc(100vw - 24px));
                display: grid;
                gap: 16px;
                border-radius: 28px;
                border: 1px solid rgba(148, 163, 184, 0.22);
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.995), rgba(247, 250, 255, 0.98));
                box-shadow: 0 34px 80px rgba(15, 23, 42, 0.24);
                padding: 22px 22px 20px;
            }

            .p-inline-auth-modal__head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 14px;
            }

            .p-inline-auth-modal__head-copy {
                display: grid;
                gap: 4px;
                min-width: 0;
            }

            .p-inline-auth-modal__title {
                margin: 0;
                font-size: 24px;
                line-height: 1.1;
                color: #0f172a;
                text-wrap: balance;
            }

            .p-inline-auth-modal__meta {
                margin: 0;
                font-size: 14px;
                line-height: 1.6;
                color: #64748b;
                text-wrap: pretty;
            }

            .p-inline-auth-modal__close {
                width: 42px;
                height: 42px;
                border: 0;
                border-radius: 999px;
                background: #eef2ff;
                color: #1e3a8a;
                font-size: 20px;
                cursor: pointer;
                flex: 0 0 auto;
            }

            .p-inline-auth-modal__form {
                display: grid;
                gap: 14px;
            }

            .p-inline-auth-modal__field {
                display: grid;
                gap: 8px;
            }

            .p-inline-auth-modal__label {
                font-size: 13px;
                font-weight: 800;
                color: #334155;
            }

            .p-inline-auth-modal__input {
                width: 100%;
                min-height: 46px;
                padding: 0 16px;
                border-radius: 16px;
                border: 1px solid rgba(148, 163, 184, 0.24);
                background: #fff;
                color: #0f172a;
                font: inherit;
                font-size: 15px;
            }

            .p-inline-auth-modal__input:focus {
                outline: none;
                border-color: rgba(37, 99, 235, 0.46);
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
            }

            .p-inline-auth-modal__error {
                margin: 0;
                padding: 12px 14px;
                border-radius: 16px;
                background: rgba(254, 242, 242, 0.98);
                border: 1px solid rgba(248, 113, 113, 0.22);
                color: #b91c1c;
                font-size: 14px;
                line-height: 1.5;
                font-weight: 700;
            }

            .p-inline-auth-modal__actions {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 10px;
            }

            @media (max-width: 900px) {
                .p-inline-icon-modal__dialog {
                    width: min(100vw - 16px, 760px);
                    max-height: calc(100vh - 16px);
                    padding: 18px 18px 16px;
                }

                .p-inline-auth-modal__dialog {
                    width: min(100vw - 16px, 460px);
                    padding: 18px 18px 16px;
                }

                .p-inline-icon-modal__topbar {
                    grid-template-columns: 1fr;
                }
            }

            .p-inline-panel__icon-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                min-height: 78px;
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
                background: rgba(15, 23, 42, 0.26);
                border: 1px solid rgba(148, 163, 184, 0.16);
                font-size: 14px;
                line-height: 1.5;
                color: #e2e8f0;
            }

            .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__notice {
                display: none;
            }

            .p-inline-panel {
                position: fixed;
                top: 24px;
                right: 24px;
                bottom: var(--p-inline-dock-offset);
                width: min(456px, calc(100vw - 32px));
                max-height: none;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                overscroll-behavior: contain;
                scrollbar-gutter: stable;
                background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
                border-radius: 26px;
                border: 1px solid rgba(148, 163, 184, 0.24);
                box-shadow: 0 30px 70px rgba(15, 23, 42, 0.16);
                padding: 20px 20px 16px;
                z-index: 5001;
            }

            .p-inline-panel,
            .p-inline-panel *,
            .p-inline-overview,
            .p-inline-overview * {
                box-sizing: border-box;
            }

            .p-inline-panel__head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
                position: sticky;
                top: -20px;
                z-index: 2;
                margin: -20px -20px 14px;
                padding: 16px 20px 12px;
                border-radius: 26px 26px 18px 18px;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.998), rgba(246, 250, 255, 0.98));
                border-bottom: 1px solid rgba(148, 163, 184, 0.18);
                box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
                backdrop-filter: blur(12px);
            }

            .p-inline-panel__head > div:first-child {
                display: grid;
                gap: 3px;
                min-width: 0;
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

            .p-inline-panel__status {
                display: grid;
                grid-template-columns: auto minmax(0, 1fr);
                gap: 12px;
                margin-bottom: 14px;
                padding: 14px 16px;
                border-radius: 20px;
                border: 1px solid rgba(148, 163, 184, 0.18);
                background: linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(255, 255, 255, 0.98));
                box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
            }

            .p-inline-panel__status[hidden] {
                display: none !important;
            }

            .p-inline-panel__status-copy {
                display: grid;
                gap: 4px;
                min-width: 0;
            }

            .p-inline-panel__status-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 28px;
                padding: 0 12px;
                border-radius: 999px;
                background: rgba(148, 163, 184, 0.14);
                color: #475569;
                font-size: 12px;
                font-weight: 800;
                white-space: nowrap;
            }

            .p-inline-panel__status-title {
                font-size: 14px;
                font-weight: 800;
                color: #0f172a;
            }

            .p-inline-panel__status-meta {
                margin: 0;
                font-size: 13px;
                line-height: 1.5;
                color: #475569;
            }

            .p-inline-panel__status.is-ready {
                border-color: rgba(16, 185, 129, 0.2);
                background: linear-gradient(180deg, rgba(236, 253, 245, 0.96), rgba(255, 255, 255, 0.98));
            }

            .p-inline-panel__status.is-ready .p-inline-panel__status-badge {
                background: rgba(16, 185, 129, 0.12);
                color: #047857;
            }

            .p-inline-panel__status.is-draft {
                border-color: rgba(59, 130, 246, 0.24);
                background: linear-gradient(180deg, rgba(239, 246, 255, 0.96), rgba(255, 255, 255, 0.98));
            }

            .p-inline-panel__status.is-draft .p-inline-panel__status-badge {
                background: rgba(37, 99, 235, 0.12);
                color: #1d4ed8;
            }

            .p-inline-panel__status.is-pending {
                border-color: rgba(245, 158, 11, 0.24);
                background: linear-gradient(180deg, rgba(255, 251, 235, 0.96), rgba(255, 255, 255, 0.98));
            }

            .p-inline-panel__status.is-pending .p-inline-panel__status-badge {
                background: rgba(245, 158, 11, 0.14);
                color: #b45309;
            }

            .p-inline-panel__status.is-other {
                border-color: rgba(148, 163, 184, 0.2);
                background: linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(255, 255, 255, 0.98));
            }

            .p-inline-panel__status.is-other .p-inline-panel__status-badge {
                background: rgba(148, 163, 184, 0.14);
                color: #475569;
            }

            .p-inline-panel__section {
                display: grid;
                gap: 12px;
                min-width: 0;
                max-width: 100%;
                padding: 16px;
                border-radius: 20px;
                background: linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 0.96));
                border: 1px solid rgba(148, 163, 184, 0.16);
                box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
            }

            .p-inline-panel__section-head {
                display: grid;
                gap: 4px;
                padding: 0;
            }

            .p-inline-panel__group {
                display: grid;
                gap: 10px;
                min-width: 0;
                max-width: 100%;
                margin-bottom: 0;
                padding: 14px;
                border-radius: 18px;
                background: #ffffff;
                border: 1px solid rgba(148, 163, 184, 0.14);
            }

            .p-inline-panel__group--primary {
                gap: 12px;
                padding: 16px;
                border-color: rgba(96, 165, 250, 0.18);
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 8px 20px rgba(37, 99, 235, 0.04);
            }

            .p-inline-panel__section-title {
                margin: 0;
                font-size: 15px;
                font-weight: 800;
                color: #0f172a;
            }

            .p-inline-panel__section-meta {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
                color: #64748b;
            }

            .p-inline-panel__accordion {
                display: grid;
                gap: 0;
                border: 1px solid rgba(148, 163, 184, 0.18);
                border-radius: 20px;
                background: linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 0.98));
                box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
                overflow: hidden;
            }

            .p-inline-panel__accordion-summary {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 16px;
                list-style: none;
                cursor: pointer;
                user-select: none;
            }

            .p-inline-panel__accordion-summary::-webkit-details-marker {
                display: none;
            }

            .p-inline-panel__accordion-summary::after {
                content: '▾';
                color: #64748b;
                font-size: 14px;
                transition: transform 0.18s ease;
            }

            .p-inline-panel__accordion[open] .p-inline-panel__accordion-summary::after {
                transform: rotate(180deg);
            }

            .p-inline-panel__accordion-copy {
                display: grid;
                gap: 4px;
                min-width: 0;
            }

            .p-inline-panel__accordion-title {
                font-size: 15px;
                font-weight: 800;
                color: #0f172a;
            }

            .p-inline-panel__accordion-meta {
                font-size: 14px;
                line-height: 1.5;
                color: #64748b;
            }

            .p-inline-panel__accordion-body {
                display: grid;
                gap: 12px;
                min-width: 0;
                max-width: 100%;
                padding: 0 14px 14px;
            }

            .p-inline-panel__form {
                display: grid;
                gap: 16px;
                flex: 1 1 auto;
                min-height: 0;
                min-width: 0;
                overflow-x: hidden;
                overflow-y: auto;
                overscroll-behavior: contain;
                padding-right: 6px;
                padding-bottom: 10px;
            }

            .p-inline-panel__form > *,
            .p-inline-panel__section > *,
            .p-inline-panel__group > *,
            .p-inline-panel__accordion-body > * {
                min-width: 0;
                max-width: 100%;
            }

            .p-inline-panel__label {
                font-size: 15px;
                font-weight: 800;
                color: #1f2937;
            }

            .p-inline-panel__control,
            .p-inline-panel__textarea {
                width: 100%;
                max-width: 100%;
                border: 1px solid rgba(148, 163, 184, 0.28);
                border-radius: 16px;
                background: #ffffff;
                color: #0f172a;
                font: inherit;
                font-size: 16px;
                line-height: 1.55;
                padding: 14px 16px;
                box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
            }

            .p-inline-panel__control::placeholder,
            .p-inline-panel__textarea::placeholder {
                color: #94a3b8;
            }

            .p-inline-panel__control--primary,
            .p-inline-panel__textarea--primary {
                font-size: 17px;
                line-height: 1.6;
                color: #0f172a;
            }

            .p-inline-panel__textarea {
                min-height: 148px;
                resize: vertical;
            }

            .p-inline-panel__textarea--primary {
                min-height: 184px;
            }

            .p-inline-panel__control:focus,
            .p-inline-panel__textarea:focus {
                outline: none;
                border-color: rgba(59, 130, 246, 0.62);
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.14);
            }

            .p-inline-panel__textarea--autosize {
                resize: none;
                overflow-y: hidden;
            }

            .p-inline-panel__hint {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
                color: #64748b;
            }

            .p-inline-panel__char-counter {
                display: block;
                margin-top: 4px;
                font-size: 12px;
                color: #94a3b8;
                text-align: right;
                transition: color 0.2s ease;
            }

            .p-inline-panel__char-counter--warn {
                color: #d97706;
            }

            .p-inline-panel__char-counter--over {
                color: #dc2626;
                font-weight: 700;
            }

            .p-inline-panel__examples {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .p-inline-panel__example-chip {
                border: 0;
                display: inline-flex;
                align-items: center;
                min-height: 28px;
                padding: 0 10px;
                border-radius: 999px;
                background: rgba(15, 23, 42, 0.05);
                color: #475569;
                font: inherit;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
            }

            .p-inline-panel__example-chip:hover {
                background: rgba(37, 99, 235, 0.1);
                color: #1d4ed8;
                transform: translateY(-1px);
            }

            .p-inline-panel__example-chip.is-active {
                background: rgba(37, 99, 235, 0.14);
                color: #1d4ed8;
                box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.22);
            }

            .p-inline-panel__examples {
                display: grid;
                gap: 8px;
            }

            .p-inline-panel__examples-title {
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #64748b;
            }

            .p-inline-panel__link-builder {
                display: grid;
                gap: 10px;
            }

            .p-inline-panel__link-builder-head {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 8px;
            }

            .p-inline-panel__link-builder-label {
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #64748b;
            }

            .p-inline-panel__link-builder-badge {
                display: inline-flex;
                align-items: center;
                min-height: 28px;
                padding: 0 12px;
                border-radius: 999px;
                background: rgba(37, 99, 235, 0.08);
                color: #1d4ed8;
                font-size: 12px;
                font-weight: 800;
            }

            .p-inline-panel__link-summary {
                margin: 0;
                padding: 12px 14px;
                border-radius: 16px;
                background: linear-gradient(180deg, rgba(239, 246, 255, 0.95), rgba(248, 250, 252, 0.98));
                border: 1px solid rgba(147, 197, 253, 0.32);
                color: #1e3a8a;
                font-size: 14px;
                line-height: 1.5;
                font-weight: 700;
            }

            .p-inline-panel__link-summary.is-empty {
                color: #64748b;
                font-weight: 600;
            }

            .p-inline-panel__style-picker {
                display: grid;
                gap: 10px;
            }

            .p-inline-panel__style-options {
                display: grid;
                gap: 10px;
            }

            .p-inline-panel__style-option {
                display: grid;
                gap: 8px;
                width: 100%;
                padding: 14px;
                border-radius: 18px;
                border: 1px solid rgba(148, 163, 184, 0.24);
                background: #ffffff;
                text-align: left;
                cursor: pointer;
                transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease, background-color 0.18s ease;
            }

            .p-inline-panel__style-option:hover {
                border-color: rgba(59, 130, 246, 0.38);
                box-shadow: 0 10px 24px rgba(37, 99, 235, 0.08);
                transform: translateY(-1px);
            }

            .p-inline-panel__style-option.is-active {
                border-color: rgba(37, 99, 235, 0.56);
                background: linear-gradient(180deg, rgba(239, 246, 255, 0.94), rgba(255, 255, 255, 1));
                box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
            }

            .p-inline-panel__style-option-top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            .p-inline-panel__style-option-title {
                font-size: 15px;
                font-weight: 800;
                color: #0f172a;
            }

            .p-inline-panel__style-option-meta {
                margin: 0;
                font-size: 13px;
                line-height: 1.5;
                color: #64748b;
            }

            .p-inline-panel__style-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 34px;
                padding: 0 14px;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 800;
                white-space: nowrap;
            }

            .p-inline-panel__style-badge--primary,
            .p-inline-panel__action-preview-button--primary {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: #ffffff;
                box-shadow: 0 14px 28px rgba(37, 99, 235, 0.16);
            }

            .p-inline-panel__style-badge--secondary,
            .p-inline-panel__action-preview-button--secondary {
                background: linear-gradient(180deg, rgba(239, 246, 255, 0.96), rgba(219, 234, 254, 0.96));
                color: #1d4ed8;
                box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.32);
            }

            .p-inline-panel__style-badge--outline,
            .p-inline-panel__action-preview-button--outline {
                background: #ffffff;
                color: #1d4ed8;
                box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.34);
            }

            .p-inline-panel__collection {
                display: grid;
                gap: 12px;
                margin-bottom: 0;
                padding: 16px;
                border-radius: 18px;
                background: #ffffff;
                border: 1px solid rgba(148, 163, 184, 0.18);
                box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
            }

            .p-inline-panel__collection-title {
                margin: 0;
                font-size: 15px;
                font-weight: 800;
                color: #0f172a;
            }

            .p-inline-panel__collection-meta {
                margin: 0;
                font-size: 15px;
                line-height: 1.5;
                color: #475569;
            }

            .p-inline-panel__collection-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .p-inline-panel__collection-list {
                display: grid;
                gap: 10px;
            }

            .p-inline-panel__collection-item {
                display: grid;
                grid-template-columns: 78px minmax(0, 1fr);
                gap: 12px;
                padding: 12px;
                border-radius: 16px;
                border: 1px solid rgba(148, 163, 184, 0.18);
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
                cursor: pointer;
                transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease, background-color 0.18s ease;
            }

            .p-inline-panel__collection-item:hover {
                border-color: rgba(59, 130, 246, 0.36);
                box-shadow: 0 12px 26px rgba(37, 99, 235, 0.08);
                transform: translateY(-1px);
            }

            .p-inline-panel__collection-item.is-active {
                border-color: rgba(37, 99, 235, 0.56);
                background: linear-gradient(180deg, rgba(239, 246, 255, 0.94), rgba(255, 255, 255, 1));
                box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
            }

            .p-inline-panel__collection-item-media {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 72px;
                border-radius: 14px;
                background: #f8fafc;
                overflow: hidden;
                box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.16);
            }

            .p-inline-panel__collection-item-media img {
                width: 100%;
                height: 72px;
                object-fit: cover;
                display: block;
            }

            .p-inline-panel__collection-item-placeholder {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 999px;
                background: rgba(37, 99, 235, 0.1);
                color: #1d4ed8;
                font-size: 14px;
                font-weight: 800;
            }

            .p-inline-panel__collection-item-copy {
                display: grid;
                gap: 8px;
                min-width: 0;
            }

            .p-inline-panel__collection-item-top {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 6px;
            }

            .p-inline-panel__collection-item-title {
                min-width: 0;
                max-width: 100%;
                font-size: 14px;
                font-weight: 800;
                line-height: 1.35;
                color: #0f172a;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                word-break: break-word;
            }

            .p-inline-panel__collection-item-badge {
                display: inline-flex;
                align-items: center;
                min-height: 24px;
                padding: 0 8px;
                border-radius: 999px;
                background: rgba(37, 99, 235, 0.1);
                color: #1d4ed8;
                font-size: 11px;
                font-weight: 800;
                white-space: nowrap;
            }

            .p-inline-panel__collection-item-badge--muted {
                background: rgba(148, 163, 184, 0.14);
                color: #475569;
            }

            .p-inline-panel__collection-item-meta {
                margin: 0;
                font-size: 13px;
                line-height: 1.5;
                color: #64748b;
                overflow-wrap: anywhere;
            }

            .p-inline-panel__collection-item-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .p-inline-panel__preview {
                display: grid;
                gap: 12px;
                padding: 16px;
                border-radius: 18px;
                background: #ffffff;
                border: 1px solid rgba(148, 163, 184, 0.18);
                box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
            }

            .p-inline-panel__action-preview {
                display: grid;
                gap: 12px;
                padding: 16px;
                border-radius: 18px;
                background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
                border: 1px solid rgba(96, 165, 250, 0.18);
                box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
            }

            .p-inline-panel__action-preview-badge {
                display: inline-flex;
                align-items: center;
                width: fit-content;
                min-height: 26px;
                padding: 0 10px;
                border-radius: 999px;
                background: rgba(37, 99, 235, 0.1);
                color: #1d4ed8;
                font-size: 13px;
                font-weight: 800;
            }

            .p-inline-panel__action-preview-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                min-height: 46px;
                width: fit-content;
                max-width: 100%;
                padding: 0 18px;
                border-radius: 999px;
                font-size: 15px;
                font-weight: 800;
                line-height: 1.2;
            }

            .p-inline-panel__action-preview-button i {
                font-size: 15px;
            }

            .p-inline-panel__action-preview-link {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
                color: #475569;
                overflow-wrap: anywhere;
            }

            .p-inline-panel__object-preview {
                display: grid;
                gap: 12px;
                padding: 16px;
                border-radius: 18px;
                background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
                border: 1px solid rgba(96, 165, 250, 0.18);
                box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
            }

            .p-inline-panel__object-preview-card {
                display: grid;
                gap: 12px;
                padding: 16px;
                border-radius: 18px;
                background: #ffffff;
                border: 1px solid rgba(148, 163, 184, 0.16);
                transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
            }

            .p-inline-panel__object-preview-card--primary {
                background: linear-gradient(180deg, rgba(239, 246, 255, 0.96), rgba(255, 255, 255, 1));
                border-color: rgba(96, 165, 250, 0.26);
                box-shadow: 0 14px 28px rgba(37, 99, 235, 0.08);
            }

            .p-inline-panel__object-preview-card--secondary {
                background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(255, 255, 255, 1));
                border-color: rgba(148, 163, 184, 0.18);
            }

            .p-inline-panel__object-preview-card--outline {
                background: #ffffff;
                border-color: rgba(37, 99, 235, 0.24);
                box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.08);
            }

            .p-inline-panel__object-preview-top {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }

            .p-inline-panel__object-preview-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 46px;
                height: 46px;
                border-radius: 14px;
                background: rgba(37, 99, 235, 0.1);
                color: #1d4ed8;
                font-size: 18px;
                flex: 0 0 auto;
            }

            .p-inline-panel__object-preview-icon[hidden] {
                display: none !important;
            }

            .p-inline-panel__object-preview-copy {
                display: grid;
                gap: 6px;
                min-width: 0;
            }

            .p-inline-panel__object-preview-badge {
                display: inline-flex;
                align-items: center;
                width: fit-content;
                min-height: 24px;
                padding: 0 9px;
                border-radius: 999px;
                background: rgba(37, 99, 235, 0.1);
                color: #1d4ed8;
                font-size: 12px;
                font-weight: 800;
            }

            .p-inline-panel__object-preview-badge[hidden],
            .p-inline-panel__object-preview-text[hidden],
            .p-inline-panel__action-preview-button[hidden] {
                display: none !important;
            }

            .p-inline-panel__object-preview-title {
                margin: 0;
                font-size: 17px;
                line-height: 1.35;
                font-weight: 800;
                color: #0f172a;
                text-wrap: balance;
            }

            .p-inline-panel__object-preview-text {
                margin: 0;
                font-size: 14px;
                line-height: 1.6;
                color: #475569;
                text-wrap: pretty;
            }

            .p-inline-panel__quick-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .p-inline-panel__preview-frame {
                position: relative;
            }

            .p-inline-panel__preview img {
                width: 100%;
                max-height: 260px;
                object-fit: contain;
                border-radius: 14px;
                background: #f8fafc;
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
                padding: 16px;
                border: 1px dashed rgba(59, 130, 246, 0.34);
                border-radius: 16px;
                background: linear-gradient(180deg, rgba(239, 246, 255, 0.95), rgba(248, 250, 252, 0.98));
                transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
            }

            .p-inline-panel__upload-zone.is-dragover {
                border-color: rgba(37, 99, 235, 0.72);
                background: linear-gradient(180deg, rgba(219, 234, 254, 0.96), rgba(239, 246, 255, 0.98));
                box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
            }

            .p-inline-panel__upload-title {
                font-size: 15px;
                font-weight: 800;
                color: #1e3a8a;
            }

            .p-inline-panel__upload-meta {
                font-size: 14px;
                line-height: 1.5;
                color: #64748b;
            }

            .p-inline-panel__upload-actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 10px;
                margin-top: 4px;
            }

            .p-inline-panel__upload-pick {
                min-height: 40px;
                padding-inline: 16px;
            }

            .p-inline-panel__upload-input {
                display: none;
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
                font-size: 14px;
                font-weight: 800;
                overflow-wrap: anywhere;
            }

            .p-inline-panel__upload-file[hidden] {
                display: none !important;
            }

            .p-inline-overview {
                position: fixed;
                top: 24px;
                right: 24px;
                bottom: var(--p-inline-dock-offset);
                width: min(400px, calc(100vw - 32px));
                max-height: none;
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
                position: static;
                z-index: 2;
                margin-top: 18px;
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto;
                align-items: center;
                gap: 10px 12px;
                padding: 12px 14px;
                border: 1px solid rgba(148, 163, 184, 0.18);
                border-radius: 18px;
                background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(255, 255, 255, 1));
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
            }

            .p-inline-panel__actions-head {
                display: grid;
                gap: 3px;
                min-width: 0;
            }

            .p-inline-panel__actions-title {
                font-size: 14px;
                font-weight: 800;
                color: #0f172a;
            }

            .p-inline-panel__actions-meta {
                font-size: 13px;
                line-height: 1.35;
                color: #475569;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .p-inline-panel__actions-row {
                display: flex;
                flex-wrap: nowrap;
                align-items: stretch;
                justify-content: flex-end;
                gap: 8px;
            }

            .p-inline-panel__actions-row .p-inline-panel__btn {
                width: auto;
                min-width: 136px;
                min-height: 40px;
                padding: 10px 12px;
                white-space: normal;
                text-wrap: balance;
                font-size: 13px;
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
                display: none !important;
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
                    grid-template-columns: 1fr;
                    padding: 12px 14px;
                }

                .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__eyebrow {
                    display: block;
                }

                .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__top > div {
                    display: grid;
                    gap: 2px;
                }

                .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__title {
                    font-size: 17px;
                    white-space: normal;
                    overflow: visible;
                    text-overflow: clip;
                }

                .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__meta {
                    display: block;
                }

                .p-inline-toolbar.p-inline-toolbar--compact .p-inline-toolbar__actions {
                    margin-top: 6px;
                    margin-left: 0;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                }

                .p-inline-panel {
                    top: auto;
                    left: 12px;
                    right: 12px;
                    bottom: var(--p-inline-dock-offset);
                    width: auto;
                    max-height: none;
                }

                .p-inline-overview {
                    top: auto;
                    left: 12px;
                    right: 12px;
                    bottom: var(--p-inline-dock-offset);
                    width: auto;
                    max-height: none;
                }
            }

            @media (max-width: 640px) {
                .p-inline-toolbar {
                    border-radius: 18px;
                }

                .p-inline-toolbar__actions {
                    justify-content: flex-start;
                }

                .p-inline-toolbar__btn {
                    flex: 0 0 auto;
                }

                .p-inline-panel,
                .p-inline-overview {
                    left: 8px;
                    right: 8px;
                    bottom: var(--p-inline-dock-offset);
                    max-height: none;
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
                    grid-template-columns: 1fr;
                    margin-top: 16px;
                    padding: 14px;
                    border-radius: 16px;
                }

                .p-inline-panel__actions-row {
                    flex-wrap: wrap;
                    justify-content: stretch;
                }

                .p-inline-panel__actions-row .p-inline-panel__btn {
                    flex: 1 1 100%;
                    min-width: 0;
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
        authEnabled: Boolean(inlineSessionCache?.authEnabled),
        authenticated: Boolean(inlineSessionCache?.authenticated),
        username: inlineSessionCache?.username || '',
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
        activeHighlightElements: [],
        activeSuppressedElements: [],
        activeIconPicker: null,
        hoverHighlightElements: [],
        hoverSuppressedElement: null,
        panelFocusField: '',
        toastTimer: 0
    };

    const ui = {};

    function setInlineSessionCache(session) {
        inlineSessionCache = session && typeof session === 'object'
            ? {
                authEnabled: Boolean(session.authEnabled),
                authenticated: Boolean(session.authenticated),
                username: session.username || ''
            }
            : null;

        window.POKRASKA_INLINE_SESSION = inlineSessionCache;
    }

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
            const session = {
                authEnabled: Boolean(payload.authEnabled),
                authenticated: Boolean(payload.authenticated),
                username: payload.username || ''
            };
            setInlineSessionCache(session);
            return session;
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
                        <p class="p-inline-toolbar__meta">Нажмите на текст, фото или кнопку на странице.</p>
                    </div>
                </div>
                <div class="p-inline-toolbar__actions">
                    <button class="p-inline-toolbar__btn p-inline-toolbar__btn--primary" type="button" data-inline-action="save" hidden>Сохранить</button>
                    <button class="p-inline-toolbar__btn" type="button" data-inline-action="session" hidden>Войти</button>
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
                    <span class="p-inline-panel__kicker">Блок</span>
                    <h2 class="p-inline-panel__title">Правка блока</h2>
                    <p class="p-inline-panel__meta"></p>
                </div>
                <div class="p-inline-panel__head-actions">
                    <button class="p-inline-panel__close" type="button" aria-label="Закрыть">&times;</button>
                </div>
            </div>
            <div class="p-inline-panel__status" hidden>
                <span class="p-inline-panel__status-badge"></span>
                <div class="p-inline-panel__status-copy">
                    <strong class="p-inline-panel__status-title"></strong>
                    <p class="p-inline-panel__status-meta"></p>
                </div>
            </div>
            <form class="p-inline-panel__form"></form>
            <div class="p-inline-panel__actions">
                <div class="p-inline-panel__actions-row">
                    <button class="p-inline-panel__btn p-inline-panel__btn--primary" type="button" data-inline-panel-action="apply" hidden>Сохранить</button>
                    <button class="p-inline-panel__btn" type="button" data-inline-panel-action="revert" hidden>↩ Отменить правку</button>
                    <button class="p-inline-panel__btn p-inline-panel__btn--danger" type="button" data-inline-panel-action="remove" hidden>Убрать</button>
                </div>
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

        const iconModal = document.createElement('div');
        iconModal.className = 'p-inline-icon-modal';
        iconModal.hidden = true;
        iconModal.innerHTML = `
            <div class="p-inline-icon-modal__backdrop" data-inline-icon-modal-close></div>
            <div class="p-inline-icon-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="p-inline-icon-modal-title">
                <div class="p-inline-icon-modal__head">
                    <div class="p-inline-icon-modal__head-copy">
                        <span class="p-inline-panel__kicker">Иконки</span>
                        <h2 class="p-inline-icon-modal__title" id="p-inline-icon-modal-title">Выбор иконки</h2>
                        <p class="p-inline-icon-modal__meta">Выберите значок для кнопки или ссылки. Можно искать по словам: телефон, покраска, доставка, ворота.</p>
                    </div>
                    <button class="p-inline-icon-modal__close" type="button" aria-label="Закрыть">&times;</button>
                </div>
                <div class="p-inline-icon-modal__topbar">
                    <div class="p-inline-panel__icon-preview p-inline-icon-modal__selected" hidden>
                        <span class="p-inline-panel__icon-preview-badge" data-inline-icon-modal-badge>—</span>
                        <div class="p-inline-panel__icon-preview-text">
                            <span class="p-inline-panel__icon-preview-title">Выбрано сейчас</span>
                            <span class="p-inline-panel__icon-preview-value" data-inline-icon-modal-value>Без значка</span>
                        </div>
                    </div>
                    <button class="p-inline-panel__btn" type="button" data-inline-icon-clear>Без иконки</button>
                </div>
                <input class="p-inline-icon-modal__search" type="search" placeholder="Найти иконку: телефон, ворота, доставка...">
                <div class="p-inline-icon-modal__meta-row">
                    <span data-inline-icon-modal-count>Загрузка библиотеки…</span>
                </div>
                <div class="p-inline-icon-modal__scroll">
                    <div class="p-inline-panel__icon-groups" data-inline-icon-modal-groups></div>
                </div>
            </div>
        `;

        const authModal = document.createElement('div');
        authModal.className = 'p-inline-auth-modal';
        authModal.hidden = true;
        authModal.innerHTML = `
            <div class="p-inline-auth-modal__backdrop" data-inline-auth-close></div>
            <div class="p-inline-auth-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="p-inline-auth-title">
                <div class="p-inline-auth-modal__head">
                    <div class="p-inline-auth-modal__head-copy">
                        <span class="p-inline-panel__kicker">Вход</span>
                        <h2 class="p-inline-auth-modal__title" id="p-inline-auth-title">Войти для правки</h2>
                        <p class="p-inline-auth-modal__meta">Введите логин и пароль администратора. После входа правка откроется прямо на этой странице.</p>
                    </div>
                    <button class="p-inline-auth-modal__close" type="button" aria-label="Закрыть">&times;</button>
                </div>
                <form class="p-inline-auth-modal__form">
                    <label class="p-inline-auth-modal__field">
                        <span class="p-inline-auth-modal__label">Логин</span>
                        <input class="p-inline-auth-modal__input" name="username" type="text" autocomplete="username" required>
                    </label>
                    <label class="p-inline-auth-modal__field">
                        <span class="p-inline-auth-modal__label">Пароль</span>
                        <input class="p-inline-auth-modal__input" name="password" type="password" autocomplete="current-password" required>
                    </label>
                    <p class="p-inline-auth-modal__error" hidden></p>
                    <div class="p-inline-auth-modal__actions">
                        <button class="p-inline-panel__btn" type="button" data-inline-auth-close>Отмена</button>
                        <button class="p-inline-panel__btn p-inline-panel__btn--primary" type="submit" data-inline-auth-submit>Войти и редактировать</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(root);
        document.body.appendChild(panel);
        document.body.appendChild(overview);
        document.body.appendChild(toast);
        document.body.appendChild(hover);
        document.body.appendChild(iconModal);
        document.body.appendChild(authModal);

        ui.root = root;
        ui.launcher = root.querySelector('.p-inline-launcher');
        ui.launcherLabel = root.querySelector('.p-inline-launcher span');
        ui.toolbar = root.querySelector('.p-inline-toolbar');
        ui.toolbarTitle = root.querySelector('.p-inline-toolbar__title');
        ui.toolbarMeta = root.querySelector('.p-inline-toolbar__meta');
        ui.toolbarNotice = root.querySelector('.p-inline-toolbar__notice');
        ui.toolbarRevertBtn = root.querySelector('[data-inline-action="revert"]');
        ui.saveBtn = root.querySelector('[data-inline-action="save"]');
        ui.sessionBtn = root.querySelector('[data-inline-action="session"]');
        ui.adminBtn = root.querySelector('[data-inline-action="admin"]');
        ui.panel = panel;
        ui.panelKicker = panel.querySelector('.p-inline-panel__kicker');
        ui.panelTitle = panel.querySelector('.p-inline-panel__title');
        ui.panelMeta = panel.querySelector('.p-inline-panel__meta');
        ui.panelStatus = panel.querySelector('.p-inline-panel__status');
        ui.panelStatusBadge = panel.querySelector('.p-inline-panel__status-badge');
        ui.panelStatusTitle = panel.querySelector('.p-inline-panel__status-title');
        ui.panelStatusMeta = panel.querySelector('.p-inline-panel__status-meta');
        ui.panelForm = panel.querySelector('.p-inline-panel__form');
        ui.panelActions = panel.querySelector('.p-inline-panel__actions');
        ui.panelBackBtn = panel.querySelector('[data-inline-panel-action="back"]');
        ui.panelRevertBtn = panel.querySelector('[data-inline-panel-action="revert"]');
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
        ui.iconModal = iconModal;
        ui.iconModalSearch = iconModal.querySelector('.p-inline-icon-modal__search');
        ui.iconModalGroups = iconModal.querySelector('[data-inline-icon-modal-groups]');
        ui.iconModalCount = iconModal.querySelector('[data-inline-icon-modal-count]');
        ui.iconModalSelected = iconModal.querySelector('.p-inline-icon-modal__selected');
        ui.iconModalBadge = iconModal.querySelector('[data-inline-icon-modal-badge]');
        ui.iconModalValue = iconModal.querySelector('[data-inline-icon-modal-value]');
        ui.iconModalClear = iconModal.querySelector('[data-inline-icon-clear]');
        ui.authModal = authModal;
        ui.authForm = authModal.querySelector('.p-inline-auth-modal__form');
        ui.authUsername = authModal.querySelector('[name="username"]');
        ui.authPassword = authModal.querySelector('[name="password"]');
        ui.authError = authModal.querySelector('.p-inline-auth-modal__error');
        ui.authSubmitBtn = authModal.querySelector('[data-inline-auth-submit]');
    }

    function clearAuthError() {
        if (!ui.authError) return;
        ui.authError.hidden = true;
        ui.authError.textContent = '';
    }

    function showAuthError(message) {
        if (!ui.authError) return;
        ui.authError.hidden = !message;
        ui.authError.textContent = message || '';
    }

    function closeAuthModal() {
        if (!ui.authModal || ui.authModal.hidden) return;
        ui.authModal.hidden = true;
        clearAuthError();
        if (ui.authSubmitBtn) {
            ui.authSubmitBtn.disabled = false;
            ui.authSubmitBtn.textContent = 'Войти и редактировать';
        }
    }

    function openAuthModal(message = '') {
        if (!ui.authModal) return;

        const wasHidden = ui.authModal.hidden;
        ui.authModal.hidden = false;

        if (wasHidden) {
            ui.authForm?.reset();
        }

        if (ui.authSubmitBtn) {
            ui.authSubmitBtn.disabled = false;
            ui.authSubmitBtn.textContent = 'Войти и редактировать';
        }

        if (message) {
            showAuthError(message);
        } else {
            clearAuthError();
        }

        window.setTimeout(() => {
            ui.authUsername?.focus();
            ui.authUsername?.select?.();
        }, 0);
    }

    async function submitAuthForm(event) {
        event.preventDefault();
        if (!ui.authForm || !ui.authSubmitBtn) return;

        const shouldStartEditMode = !state.enabled;

        clearAuthError();

        const formData = new FormData(ui.authForm);
        const payload = {
            username: String(formData.get('username') || '').trim(),
            password: String(formData.get('password') || '')
        };

        ui.authSubmitBtn.disabled = true;
        ui.authSubmitBtn.textContent = 'Входим...';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.ok) {
                throw new Error(result.error || 'Не удалось войти');
            }

            setInlineSessionCache({
                authEnabled: Boolean(result.authEnabled),
                authenticated: Boolean(result.authenticated),
                username: result.username || payload.username
            });
            closeAuthModal();
            if (shouldStartEditMode) {
                await enterEditMode({ skipAuthCheck: true });
            } else {
                await refreshEnvironment();
                showToast('Вход выполнен');
            }
        } catch (error) {
            showAuthError(error.message || 'Не удалось войти');
            ui.authSubmitBtn.disabled = false;
            ui.authSubmitBtn.textContent = 'Войти и редактировать';
        }
    }

    async function logoutInline() {
        const hasUnsavedWork = hasDirtyFiles() || hasPendingPanelChanges();
        if (hasUnsavedWork && !window.confirm('Есть несохранённые правки. Выйти из режима правки и завершить сеанс?')) {
            return;
        }

        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            // ignore logout transport errors and still clear local session state
        }

        setInlineSessionCache({
            authEnabled: state.authEnabled,
            authenticated: false,
            username: ''
        });

        state.enabled = false;
        state.overviewOpen = false;
        state.overviewQuery = '';
        closeAuthModal();
        closeIconModal();
        closePanel({ skipConfirm: true });
        document.body.classList.remove(MODE_CLASS);
        await refreshEnvironment();
        showToast('Сеанс правки завершён');
    }

    function getBindingKindLabel(binding) {
        if (!binding) return 'Правка на странице';
        if (binding.editorKindLabel) return binding.editorKindLabel;
        if (binding.type === 'image') return 'Фото';
        if (binding.type === 'list') return 'Список';
        if (binding.type === 'object') {
            const fields = getBindingEditorFields(binding);
            if (fields.some(isLinkLikeField)) return 'Кнопка';
            if (binding.collectionPath) return 'Карточка';
            return 'Блок';
        }
        if (binding.type === 'html') return 'Текстовый блок';
        if (/заголов/i.test(binding.label || '')) return 'Заголовок';
        return 'Текст';
    }

    function getBindingWorkHint(binding) {
        if (!binding) return 'Нажмите на текст, фото или кнопку на странице.';
        if (binding.type === 'image') return 'Замените фото или поправьте подпись справа.';
        if (binding.type === 'object') {
            const fields = getBindingEditorFields(binding);
            if (fields.some(isLinkLikeField)) {
                const hasIcon = fields.some(isIconField);
                const hasStyle = fields.some(isStyleField);
                const hasPhoneLabel = fields.some((field) => String(field?.key || '').toLowerCase() === 'note');
                const hasPhoneValue = fields.some((field) => String(field?.key || '').toLowerCase() === 'label');

                if (hasPhoneLabel && hasPhoneValue && !hasIcon && !hasStyle) {
                    return 'Меняйте номер, ссылку и подпись справа.';
                }
                if (hasIcon && hasStyle) {
                    return 'Меняйте текст, переход, значок и вид кнопки справа.';
                }
                if (hasIcon) {
                    return 'Меняйте текст, переход и значок справа.';
                }
                return 'Меняйте текст и переход справа.';
            }
            return 'Меняйте текст и параметры этого блока справа.';
        }
        if (binding.type === 'list') return 'Меняйте пункты этого списка справа.';
        if (/заголов/i.test(binding.label || '')) return 'Меняйте заголовок справа.';
        return 'Меняйте текст этого блока справа.';
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
        if (!ui.overview || !OVERVIEW_ENABLED) {
            if (ui.overview) ui.overview.hidden = true;
            return;
        }

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
        if (!OVERVIEW_ENABLED) {
            state.overviewOpen = false;
            renderOverviewPanel();
            return;
        }

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

    function updateDockOffset() {
        const fallback = state.enabled ? 84 : 104;
        if (!ui.root || !document?.documentElement) {
            return;
        }

        const activeDock = state.enabled && ui.toolbar && !ui.toolbar.hidden
            ? ui.toolbar
            : ui.launcher;

        if (!activeDock || activeDock.hidden) {
            document.documentElement.style.setProperty('--p-inline-dock-offset', `${fallback}px`);
            return;
        }

        const rect = activeDock.getBoundingClientRect();
        const gap = state.enabled ? 12 : 20;
        const offset = Math.max(fallback, Math.ceil(rect.height + gap));
        document.documentElement.style.setProperty('--p-inline-dock-offset', `${offset}px`);
    }

    function updateLauncherState() {
        if (!ui.launcher || !ui.launcherLabel) return;

        if (state.authEnabled && !state.authenticated) {
            ui.launcherLabel.textContent = 'Войти для правки';
            ui.launcher.title = 'Войдите, чтобы редактировать страницу прямо на сайте';
            return;
        }

        ui.launcherLabel.textContent = 'Редактировать на странице';
        ui.launcher.title = 'Включить редактирование прямо на странице';
    }

    function renderToolbar() {
        if (!ui.launcher) return;

        const panelOpen = Boolean(ui.panel && !ui.panel.hidden);
        const dirtyFilesCount = Array.from(state.files.values()).filter((entry) => entry.dirty).length;
        const dirtyCount = getDirtyBindings().length;
        const pendingPanel = hasPendingPanelChanges();
        const canSave = canSaveInline();
        const hasIssue = !state.apiAvailable || (state.authEnabled && !state.authenticated);
        const activeBinding = state.bindingMap.get(state.activeBindingId) || null;
        const activeSummary = activeBinding
            ? `${getBindingKindLabel(activeBinding)}`
            : '';
        updateLauncherState();
        ui.launcher.hidden = state.enabled;
        ui.toolbar.hidden = !state.enabled;
        ui.toolbar.classList.toggle('p-inline-toolbar--compact', !hasIssue);
        if (ui.toolbarRevertBtn) {
            ui.toolbarRevertBtn.hidden = true;
            ui.toolbarRevertBtn.disabled = true;
            ui.toolbarRevertBtn.classList.remove('is-active');
        }
        if (ui.sessionBtn) {
            ui.sessionBtn.hidden = !state.enabled || !state.authEnabled;
            ui.sessionBtn.disabled = false;
            ui.sessionBtn.textContent = state.authenticated ? 'Выйти' : 'Войти';
        }
        ui.saveBtn.hidden = false;
        ui.saveBtn.disabled = !canSave || (!dirtyFilesCount && !pendingPanel);
        ui.saveBtn.classList.toggle('is-idle', !dirtyFilesCount && !pendingPanel);
        ui.saveBtn.textContent = dirtyCount
            ? `Сохранить ${formatCompactCount(dirtyCount)}`
            : ((dirtyFilesCount || pendingPanel || hasIssue) ? 'Сохранить' : 'Готово');
        if (ui.adminBtn) {
            ui.adminBtn.hidden = true;
        }

        if (!state.enabled) {
            updateDockOffset();
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
            ui.toolbarMeta.textContent = `${getCurrentPageLabel()} · войдите прямо на этой странице и продолжайте правку.`;
            ui.toolbarNotice.hidden = false;
            ui.toolbarNotice.textContent = 'Нажмите «Войти», введите логин и пароль, и режим правки снова станет доступен.';
            updateDockOffset();
            renderOverviewPanel();
            return;
        }

        ui.toolbarTitle.textContent = activeBinding
            ? truncateInlineLabel(activeBinding.label, 56)
            : (dirtyCount ? `Изменения: ${dirtyCount}` : 'Выберите блок');
        if (activeBinding) {
            const panelState = getPanelStatusState(activeBinding);
            if (panelState?.tone === 'is-other') {
                ui.toolbarMeta.textContent = `${activeSummary}. Этот блок уже без новых правок, но на странице остались другие изменения. Потом нажмите «Сохранить».`;
            } else if (panelState?.tone === 'is-draft') {
                ui.toolbarMeta.textContent = `${activeSummary}. Предпросмотр уже виден на странице. Если нравится результат, нажмите «Сохранить».`;
            } else if (panelState?.tone === 'is-pending') {
                ui.toolbarMeta.textContent = `${activeSummary}. Этот блок уже обновлён на странице, но ещё не сохранён окончательно.`;
            } else {
                ui.toolbarMeta.textContent = `${activeSummary}. Вы только выбрали блок — изменений ещё нет. ${getBindingWorkHint(activeBinding)}${dirtyCount ? ' Потом нажмите «Сохранить».' : ''}`;
            }
        } else {
            ui.toolbarMeta.textContent = dirtyCount
                ? 'На странице есть изменения. Сохраните их, когда закончите.'
                : 'Нажмите на текст, фото или кнопку на странице.';
        }
        ui.toolbarNotice.hidden = true;
        ui.toolbarNotice.textContent = '';
        updateDockOffset();
        renderOverviewPanel();
    }

    async function refreshEnvironment() {
        state.apiAvailable = await checkApiAvailability();
        const session = await checkAuthSession();
        setInlineSessionCache(session);
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
        restoreActiveBindingPreview();
        closeIconModal();
        ui.panel.hidden = true;
        state.activeBindingId = '';
        state.panelFocusField = '';
        state.panelReturnToOverview = false;
        clearActiveMarks();
        clearHoverMarks();
        renderToolbar();
        return true;
    }

    function clearActiveMarks() {
        state.bindings.forEach((binding) => {
            binding.elements.forEach((element) => element.classList.remove(ACTIVE_CLASS));
        });
        state.activeSuppressedElements.forEach((element) => {
            element?.classList?.remove(SUPPRESS_HOVER_CLASS);
        });
        state.activeSuppressedElements = [];
        state.activeHighlightElements.forEach((element) => {
            element?.classList?.remove(ACTIVE_TARGET_CLASS);
            element?.classList?.remove(REVEAL_CLASS);
        });
        state.activeHighlightElements = [];
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
        clearHoverMarks();
        closeAuthModal();
        closeIconModal();
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

    async function enterEditMode(options = {}) {
        await refreshEnvironment();

        if (!options.skipAuthCheck && state.authEnabled && !state.authenticated) {
            openAuthModal();
            return;
        }

        state.enabled = true;
        document.body.classList.add(MODE_CLASS);
        rememberEditingContext();
        state.restoredDrafts = await restoreDraftsForVisibleBindings();
        renderToolbar();

        if (!state.apiAvailable) {
            showToast('Сейчас открыт обычный сервер. Для сохранения нужен сервер сохранения.');
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

    function renderBindingPreviewValue(binding, nextValue) {
        if (!binding) return;

        if (typeof binding.render === 'function') {
            binding.render(cloneData(nextValue), binding);
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

    function getFieldPlaceholder(field, binding) {
        const key = String(field?.key || '').toLowerCase();
        const label = String(field?.label || '').toLowerCase();

        if (isLinkLikeField(field)) {
            if (key.includes('phone')) return 'Например: tel:+79376154629';
            if (key.includes('email')) return 'Например: mailto:mail@example.ru';
            if (key.includes('telegram')) return 'Например: https://t.me/username';
            if (key.includes('whatsapp')) return 'Например: https://wa.me/79376154629';
            return 'Например: /pages/services.html или #contacts';
        }

        if (binding?.type === 'image' && isImageDescriptionField(field)) {
            if (key === 'alt') return 'Кратко: что изображено (для поисковиков)';
            return 'Например: Откатные ворота';
        }

        if ((binding?.type === 'text' || binding?.type === 'html' || binding?.type === 'list') && /заголов|title/.test(`${key} ${label}`)) {
            return 'Например: Ворота и заборы под ключ';
        }

        if (binding?.type === 'object' && isPrimaryTextField(field)) {
            return 'Напишите текст так, как его увидит клиент';
        }

        if ((binding?.type === 'text' || binding?.type === 'html') && isPrimaryTextField(field)) {
            return 'Напишите текст так, как его увидит клиент';
        }

        return '';
    }

    function isStyleField(field) {
        const key = String(field?.key || '').toLowerCase();
        const label = String(field?.label || '').toLowerCase();
        return key === 'style'
            || key === 'variant'
            || /стиль/.test(label)
            || /primary\/secondary|primary\/outline|primary\/secondary\/outline/.test(label);
    }

    function getStyleOptionsForField(field, currentValue = '') {
        const source = `${field?.label || ''} ${field?.hint || ''}`.toLowerCase();
        const allowedValues = ['primary', 'secondary', 'outline'].filter((value) => source.includes(value));
        const values = allowedValues.length ? allowedValues : ['primary', 'secondary', 'outline'];
        if (currentValue && !values.includes(String(currentValue).trim())) {
            values.push(String(currentValue).trim());
        }
        return values
            .map((value) => INLINE_BUTTON_STYLE_LIBRARY[value] || {
                value,
                label: value,
                meta: 'Текущий вариант оформления кнопки.',
                previewClass: 'outline'
            });
    }

    function isInlineNestedPage() {
        return /\/pages\/[^/]+$/i.test(String(window.location.pathname || '').replace(/\\/g, '/'));
    }

    function normalizeSiteTargetValue(value) {
        return String(value || '').trim().replace(/^\/+/, '');
    }

    function toRelativeSiteHref(siteTarget) {
        const normalized = normalizeSiteTargetValue(siteTarget);
        if (!normalized) return '';
        const [pathPart, hashPart] = normalized.split('#');
        const hash = hashPart ? `#${hashPart}` : '';

        if (!pathPart || pathPart === 'index.html') {
            if (isInlineNestedPage()) {
                return `../index.html${hash}`;
            }
            return hash || 'index.html';
        }

        if (isInlineNestedPage() && pathPart.startsWith('pages/')) {
            return `${pathPart.slice(6)}${hash}`;
        }

        return `${pathPart}${hash}`;
    }

    function resolveSameOriginHref(rawHref) {
        const value = String(rawHref || '').trim();
        if (!value) return null;
        try {
            const nextUrl = new URL(value, window.location.href);
            if (nextUrl.origin !== window.location.origin) return null;
            return `${nextUrl.pathname.replace(/^\/+/, '')}${nextUrl.hash || ''}`;
        } catch (error) {
            return null;
        }
    }

    function prettifyInlineSectionId(id) {
        const value = String(id || '').replace(/^#/, '').trim();
        if (!value) return 'Блок страницы';
        const normalized = value
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    }

    function getCurrentPageSectionTargets() {
        const used = new Set();
        return Array.from(document.querySelectorAll('[id]'))
            .map((element) => {
                const id = String(element.id || '').trim();
                if (!id || id.startsWith('p-inline-')) return null;
                if (used.has(id)) return null;
                if (['script', 'style', 'link', 'meta'].includes(element.tagName.toLowerCase())) return null;

                let label = '';
                const ariaLabelledBy = element.getAttribute('aria-labelledby');
                if (ariaLabelledBy) {
                    const source = document.getElementById(ariaLabelledBy);
                    if (source?.textContent) {
                        label = source.textContent.trim();
                    }
                }

                if (!label && /^h[1-6]$/i.test(element.tagName)) {
                    label = element.textContent.trim();
                }

                if (!label) {
                    const heading = element.querySelector?.('h1, h2, h3, h4, h5, h6');
                    if (heading?.textContent) {
                        label = heading.textContent.trim();
                    }
                }

                if (!label) {
                    label = prettifyInlineSectionId(id);
                }

                used.add(id);
                return {
                    value: `#${id}`,
                    label
                };
            })
            .filter(Boolean)
            .slice(0, 40);
    }

    function getInlineLockedLinkType(field) {
        const key = String(field?.key || '').toLowerCase();
        if (key.includes('phone')) return 'phone';
        if (key.includes('email')) return 'email';
        if (key.includes('telegram')) return 'telegram';
        if (key.includes('whatsapp')) return 'whatsapp';
        return '';
    }

    function normalizePhoneForHref(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        let digits = raw.replace(/[^\d+]/g, '');
        if (digits.startsWith('8') && digits.length === 11) {
            digits = `+7${digits.slice(1)}`;
        }
        if (!digits.startsWith('+') && /^\d+$/.test(digits)) {
            digits = `+${digits}`;
        }
        return digits;
    }

    function formatPhoneForDisplay(value) {
        const phone = normalizePhoneForHref(value);
        if (!phone) return '';
        const digits = phone.replace(/[^\d]/g, '');
        if (digits.length === 11 && digits.startsWith('7')) {
            return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
        }
        return phone;
    }

    function normalizeTelegramValue(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        const cleaned = raw
            .replace(/^https?:\/\/t\.me\//i, '')
            .replace(/^@+/, '')
            .trim();
        return cleaned;
    }

    function normalizeWhatsAppValue(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        if (/^https?:\/\/wa\.me\//i.test(raw)) {
            return raw.replace(/^https?:\/\/wa\.me\//i, '').replace(/[^\d]/g, '');
        }
        return raw.replace(/[^\d]/g, '');
    }

    function parseInlineLinkState(field, rawHref) {
        const lockedType = getInlineLockedLinkType(field);
        const value = String(rawHref || '').trim();
        const sectionTargets = getCurrentPageSectionTargets();
        const matchedPage = resolveSameOriginHref(value)
            ? INLINE_SITE_PAGE_TARGETS.find((option) => option.value === resolveSameOriginHref(value))
            : null;
        const matchedSection = resolveSameOriginHref(value)
            ? sectionTargets.find((option) => {
                const resolvedOption = resolveSameOriginHref(option.value);
                return resolvedOption && resolvedOption === resolveSameOriginHref(value);
            })
            : null;

        if (lockedType === 'phone') {
            return { type: 'phone', text: value.replace(/^tel:/i, ''), page: '', section: '' };
        }
        if (lockedType === 'email') {
            return { type: 'email', text: value.replace(/^mailto:/i, ''), page: '', section: '' };
        }
        if (lockedType === 'telegram') {
            return { type: 'telegram', text: normalizeTelegramValue(value), page: '', section: '' };
        }
        if (lockedType === 'whatsapp') {
            return { type: 'whatsapp', text: normalizeWhatsAppValue(value), page: '', section: '' };
        }

        if (!value) {
            return {
                type: 'page',
                page: INLINE_SITE_PAGE_TARGETS[0]?.value || 'index.html',
                section: sectionTargets[0]?.value || '',
                text: ''
            };
        }

        if (/^tel:/i.test(value)) {
            return { type: 'phone', text: value.replace(/^tel:/i, ''), page: '', section: '' };
        }
        if (/^mailto:/i.test(value)) {
            return { type: 'email', text: value.replace(/^mailto:/i, ''), page: '', section: '' };
        }
        if (/t\.me\//i.test(value)) {
            return { type: 'telegram', text: normalizeTelegramValue(value), page: '', section: '' };
        }
        if (/wa\.me\//i.test(value) || /whatsapp/i.test(value)) {
            return { type: 'whatsapp', text: normalizeWhatsAppValue(value), page: '', section: '' };
        }
        if (matchedSection) {
            return { type: 'section', section: matchedSection.value, page: '', text: '' };
        }
        if (matchedPage) {
            return { type: 'page', page: matchedPage.value, section: '', text: '' };
        }
        if (/^https?:\/\//i.test(value)) {
            return { type: 'external', text: value, page: '', section: '' };
        }
        if (value.startsWith('#')) {
            return { type: 'section', section: value, page: '', text: '' };
        }
        return { type: 'custom', text: value, page: '', section: '' };
    }

    function composeInlineLinkHref(linkState) {
        if (!linkState) return '';
        switch (linkState.type) {
            case 'page':
                return toRelativeSiteHref(linkState.page);
            case 'section':
                return String(linkState.section || '').trim();
            case 'phone': {
                const phone = normalizePhoneForHref(linkState.text);
                return phone ? `tel:${phone}` : '';
            }
            case 'email': {
                const email = String(linkState.text || '').trim();
                return email ? `mailto:${email}` : '';
            }
            case 'telegram': {
                const username = normalizeTelegramValue(linkState.text);
                return username ? `https://t.me/${username}` : '';
            }
            case 'whatsapp': {
                const phone = normalizeWhatsAppValue(linkState.text);
                return phone ? `https://wa.me/${phone}` : '';
            }
            case 'external':
            case 'custom':
            default:
                return String(linkState.text || '').trim();
        }
    }

    function describeInlineHref(rawHref) {
        const value = String(rawHref || '').trim();
        if (!value) {
            return { text: 'Переход пока не указан', empty: true };
        }

        if (/^tel:/i.test(value)) {
            return { text: `Позвонит: ${formatPhoneForDisplay(value.replace(/^tel:/i, '')) || value.replace(/^tel:/i, '')}`, empty: false };
        }
        if (/^mailto:/i.test(value)) {
            return { text: `Откроет почту: ${value.replace(/^mailto:/i, '')}`, empty: false };
        }
        if (/t\.me\//i.test(value)) {
            return { text: `Откроет Telegram: @${normalizeTelegramValue(value)}`, empty: false };
        }
        if (/wa\.me\//i.test(value) || /whatsapp/i.test(value)) {
            const phone = normalizeWhatsAppValue(value);
            return { text: `Откроет WhatsApp: ${formatPhoneForDisplay(phone) || phone}`, empty: false };
        }

        const resolved = resolveSameOriginHref(value);
        if (resolved) {
            const matchedPage = INLINE_SITE_PAGE_TARGETS.find((option) => option.value === resolved);
            if (matchedPage) {
                return { text: `Откроется страница: ${matchedPage.label}`, empty: false };
            }
            if (resolved.includes('#')) {
                const sectionId = resolved.split('#')[1] || '';
                return { text: `Прокрутит к блоку: ${prettifyInlineSectionId(sectionId)}`, empty: false };
            }
            return { text: `Откроется адрес: /${resolved}`, empty: false };
        }

        if (/^https?:\/\//i.test(value)) {
            try {
                const nextUrl = new URL(value);
                return { text: `Откроется внешний сайт: ${nextUrl.hostname}`, empty: false };
            } catch (error) {
                return { text: `Откроется внешний адрес: ${value}`, empty: false };
            }
        }

        return { text: `Откроется: ${value}`, empty: false };
    }

    function createInlineLinkBuilder(field, control) {
        const wrapper = document.createElement('div');
        wrapper.className = 'p-inline-panel__link-builder';

        const lockedType = getInlineLockedLinkType(field);
        const state = parseInlineLinkState(field, control.value);

        const head = document.createElement('div');
        head.className = 'p-inline-panel__link-builder-head';
        wrapper.appendChild(head);

        if (lockedType) {
            const badge = document.createElement('div');
            badge.className = 'p-inline-panel__link-builder-badge';
            badge.textContent = INLINE_LINK_TYPE_OPTIONS.find((option) => option.value === lockedType)?.label || 'Ссылка';
            head.appendChild(badge);
        } else {
            const typeLabel = document.createElement('div');
            typeLabel.className = 'p-inline-panel__link-builder-label';
            typeLabel.textContent = 'Тип перехода';
            head.appendChild(typeLabel);
        }

        let typeControl = null;
        if (!lockedType) {
            typeControl = document.createElement('select');
            typeControl.className = 'p-inline-panel__control';
            INLINE_LINK_TYPE_OPTIONS.forEach((option) => {
                const optionNode = document.createElement('option');
                optionNode.value = option.value;
                optionNode.textContent = option.label;
                typeControl.appendChild(optionNode);
            });
            typeControl.value = state.type;
            wrapper.appendChild(typeControl);
        }

        const quickExampleGroup = createExampleChipGroup(
            'Быстрые переходы',
            getLinkExamples(field),
            (example) => {
                const nextState = parseInlineLinkState(field, example.value);
                state.type = lockedType || nextState.type || 'custom';
                state.page = nextState.page || '';
                state.section = nextState.section || '';
                state.text = nextState.text || '';
                if (typeControl) {
                    typeControl.value = state.type;
                }
                renderDestination();
                syncControl();
            }
        );
        if (quickExampleGroup) {
            wrapper.appendChild(quickExampleGroup);
        }

        const destination = document.createElement('div');
        destination.className = 'p-inline-panel__link-builder';
        wrapper.appendChild(destination);

        const summary = document.createElement('p');
        summary.className = 'p-inline-panel__link-summary';
        wrapper.appendChild(summary);

        const syncControl = () => {
            control.value = composeInlineLinkHref(state);
            control.dispatchEvent(new Event('input', { bubbles: true }));
            control.dispatchEvent(new Event('change', { bubbles: true }));
            const description = describeInlineHref(control.value);
            summary.textContent = description.text;
            summary.classList.toggle('is-empty', Boolean(description.empty));
        };

        const buildField = (placeholder, value, onInput) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'p-inline-panel__control';
            input.placeholder = placeholder;
            input.value = value || '';
            input.addEventListener('input', () => {
                onInput(input.value);
                syncControl();
            });
            return input;
        };

        const buildSelect = (options, currentValue, onChange, includeEmptyLabel = 'Выберите вариант') => {
            const select = document.createElement('select');
            select.className = 'p-inline-panel__control';

            const availableOptions = [...options];
            if (currentValue && !availableOptions.some((option) => option.value === currentValue)) {
                availableOptions.unshift({
                    value: currentValue,
                    label: `Текущий адрес: ${currentValue}`
                });
            }

            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = includeEmptyLabel;
            select.appendChild(emptyOption);

            availableOptions.forEach((option) => {
                const optionNode = document.createElement('option');
                optionNode.value = option.value;
                optionNode.textContent = option.label;
                select.appendChild(optionNode);
            });

            select.value = currentValue || '';
            select.addEventListener('change', () => {
                onChange(select.value);
                syncControl();
            });
            return select;
        };

        const renderDestination = () => {
            destination.innerHTML = '';
            const activeType = lockedType || state.type;

            switch (activeType) {
                case 'page':
                    destination.appendChild(buildSelect(
                        INLINE_SITE_PAGE_TARGETS,
                        state.page,
                        (nextValue) => { state.page = nextValue; }
                    ));
                    break;
                case 'section':
                    destination.appendChild(buildSelect(
                        getCurrentPageSectionTargets(),
                        state.section,
                        (nextValue) => { state.section = nextValue; },
                        'Выберите блок на этой странице'
                    ));
                    break;
                case 'phone':
                    destination.appendChild(buildField(
                        '+7 937 615-46-29',
                        formatPhoneForDisplay(state.text) || state.text,
                        (nextValue) => { state.text = nextValue; }
                    ));
                    break;
                case 'email':
                    destination.appendChild(buildField(
                        'mail@example.ru',
                        state.text,
                        (nextValue) => { state.text = nextValue; }
                    ));
                    break;
                case 'telegram':
                    destination.appendChild(buildField(
                        'username или ссылка',
                        state.text,
                        (nextValue) => { state.text = nextValue; }
                    ));
                    break;
                case 'whatsapp':
                    destination.appendChild(buildField(
                        '+7 937 615-46-29',
                        formatPhoneForDisplay(state.text) || state.text,
                        (nextValue) => { state.text = nextValue; }
                    ));
                    break;
                case 'external':
                    destination.appendChild(buildField(
                        'https://example.ru',
                        state.text,
                        (nextValue) => { state.text = nextValue; }
                    ));
                    break;
                case 'custom':
                default:
                    destination.appendChild(buildField(
                        '/pages/services.html или #request-form',
                        state.text,
                        (nextValue) => { state.text = nextValue; }
                    ));
                    break;
            }
        };

        if (typeControl) {
            typeControl.addEventListener('change', () => {
                state.type = typeControl.value || 'custom';
                renderDestination();
                syncControl();
            });
        }

        renderDestination();
        syncControl();
        return wrapper;
    }

    function createStylePicker(field, control) {
        const wrapper = document.createElement('div');
        wrapper.className = 'p-inline-panel__style-picker';

        const optionsWrap = document.createElement('div');
        optionsWrap.className = 'p-inline-panel__style-options';
        wrapper.appendChild(optionsWrap);

        const options = getStyleOptionsForField(field, control.value);
        const updateActiveState = () => {
            optionsWrap.querySelectorAll('.p-inline-panel__style-option').forEach((button) => {
                button.classList.toggle('is-active', button.dataset.styleValue === control.value);
            });
        };

        options.forEach((option) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'p-inline-panel__style-option';
            button.dataset.styleValue = option.value;
            button.innerHTML = `
                <div class="p-inline-panel__style-option-top">
                    <span class="p-inline-panel__style-option-title">${option.label}</span>
                    <span class="p-inline-panel__style-badge p-inline-panel__style-badge--${option.previewClass || 'outline'}">Пример</span>
                </div>
                <p class="p-inline-panel__style-option-meta">${option.meta || 'Выберите, как будет выглядеть кнопка.'}</p>
            `;
            button.addEventListener('click', () => {
                control.value = option.value;
                control.dispatchEvent(new Event('input', { bubbles: true }));
                control.dispatchEvent(new Event('change', { bubbles: true }));
                updateActiveState();
                flashActiveBindingPreview();
            });
            optionsWrap.appendChild(button);
        });

        control.addEventListener('input', updateActiveState);
        control.addEventListener('change', updateActiveState);
        updateActiveState();
        return wrapper;
    }

    function getDefaultInlineIconForBinding(binding, value = {}) {
        const text = String(
            binding?.label
            || value?.title
            || value?.label
            || value?.name
            || value?.text
            || ''
        ).toLowerCase();

        if (/телефон|звон|контакт/.test(text)) return 'fas fa-phone';
        if (/почт|mail/.test(text)) return 'fas fa-envelope';
        if (/telegram|телеграм/.test(text)) return 'fab fa-telegram-plane';
        if (/whatsapp|ватсап/.test(text)) return 'fab fa-whatsapp';
        if (/ворот/.test(text)) return 'fas fa-archway';
        if (/калит/.test(text)) return 'fas fa-door-open';
        if (/забор|секц|панел/.test(text)) return 'fas fa-border-all';
        if (/договор|документ/.test(text)) return 'fas fa-file-contract';
        if (/расчет|стоим|цен/.test(text)) return 'fas fa-calculator';
        if (/покраск/.test(text)) return 'fas fa-paint-roller';
        if (/достав|выезд/.test(text)) return 'fas fa-truck';
        return 'fas fa-check-circle';
    }

    function getLinkExamples(field) {
        const key = String(field?.key || '').toLowerCase();
        if (key.includes('phone')) {
            return [
                { label: 'Телефон', value: 'tel:+79376154629' }
            ];
        }
        if (key.includes('email')) {
            return [
                { label: 'Почта', value: 'mailto:mail@example.ru' }
            ];
        }
        if (key.includes('telegram')) {
            return [
                { label: 'Telegram', value: 'https://t.me/' }
            ];
        }
        if (key.includes('whatsapp')) {
            return [
                { label: 'WhatsApp', value: 'https://wa.me/7' }
            ];
        }
        return [
            { label: 'Страница', value: '/pages/services.html' },
            { label: 'Блок', value: '#contacts' },
            { label: 'Телефон', value: 'tel:+79376154629' },
            { label: 'Telegram', value: 'https://t.me/' }
        ];
    }

    function setControlValueAndDispatch(control, nextValue) {
        if (!control) return;
        control.value = nextValue;
        control.dispatchEvent(new Event('input', { bubbles: true }));
        control.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function createExampleChipGroup(title, items, onSelect) {
        if (!Array.isArray(items) || !items.length || typeof onSelect !== 'function') return null;

        const wrapper = document.createElement('div');
        wrapper.className = 'p-inline-panel__examples';

        const heading = document.createElement('div');
        heading.className = 'p-inline-panel__examples-title';
        heading.textContent = title;
        wrapper.appendChild(heading);

        const row = document.createElement('div');
        row.className = 'p-inline-panel__quick-actions';

        items.forEach((item) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'p-inline-panel__example-chip';
            button.textContent = item.label;
            button.addEventListener('click', () => onSelect(item));
            row.appendChild(button);
        });

        wrapper.appendChild(row);
        return wrapper;
    }

    function createFieldGroup(field, value, binding = null) {
        const wrapper = document.createElement('div');
        wrapper.className = 'p-inline-panel__group';
        const isPrimary = isPrimaryTextField(field) && !isLinkLikeField(field) && !isIconField(field) && !isStyleField(field);
        if (isPrimary) {
            wrapper.classList.add('p-inline-panel__group--primary');
        }

        const label = document.createElement('label');
        label.className = 'p-inline-panel__label';
        label.textContent = getFieldDisplayLabel(field, binding);
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
            control.type = (isLinkLikeField(field) || isStyleField(field))
                ? 'hidden'
                : (field.type === 'number' ? 'number' : 'text');
            control.value = value ?? '';
        }

        if (isPrimary) {
            control.classList.add(control.tagName === 'TEXTAREA'
                ? 'p-inline-panel__textarea--primary'
                : 'p-inline-panel__control--primary');
        }

        const placeholder = getFieldPlaceholder(field, binding);
        if (placeholder) {
            control.placeholder = placeholder;
        }

        control.name = field.key || 'value';
        wrapper.appendChild(control);

        // Character counter for visible single-line text inputs
        if (
            control.tagName === 'INPUT' &&
            control.type === 'text' &&
            !isLinkLikeField(field) && !isIconField(field) && !isStyleField(field)
        ) {
            const counter = document.createElement('span');
            counter.className = 'p-inline-panel__char-counter';
            const updateCounter = () => {
                const len = control.value.length;
                counter.textContent = `${len} симв.`;
                counter.classList.toggle('p-inline-panel__char-counter--warn', len > 80 && len <= 120);
                counter.classList.toggle('p-inline-panel__char-counter--over', len > 120);
            };
            control.addEventListener('input', updateCounter);
            updateCounter();
            wrapper.appendChild(counter);
        }

        if (isLinkLikeField(field)) {
            wrapper.appendChild(createInlineLinkBuilder(field, control));
        }

        if (isStyleField(field)) {
            wrapper.appendChild(createStylePicker(field, control));
        }

        if (isIconField(field)) {
            if (!isActionLikeObjectBinding(binding)) {
                wrapper.appendChild(createIconPreview(control));
            }
            wrapper.appendChild(createIconPicker(control));
        }

        if (field.hint) {
            const hint = document.createElement('p');
            hint.className = 'p-inline-panel__hint';
            hint.textContent = field.hint;
            wrapper.appendChild(hint);
        } else if (isStyleField(field)) {
            const hint = document.createElement('p');
            hint.className = 'p-inline-panel__hint';
            hint.textContent = 'Можно спокойно попробовать разные варианты: на странице сразу видно, какой стиль подходит лучше.';
            wrapper.appendChild(hint);
        } else if (isLinkLikeField(field)) {
            const hint = document.createElement('p');
            hint.className = 'p-inline-panel__hint';
            hint.textContent = 'Сначала выберите тип перехода, потом укажите страницу, блок или контакт.';
            wrapper.appendChild(hint);
        } else if (isIconField(field)) {
            const hint = document.createElement('p');
            hint.className = 'p-inline-panel__hint';
            hint.textContent = 'Откройте библиотеку иконок в отдельном окне или оставьте блок без значка.';
            wrapper.appendChild(hint);
        }

        return wrapper;
    }

    function getFieldDisplayLabel(field, binding = null) {
        const key = String(field?.key || '').toLowerCase();
        const label = String(field?.label || '').trim();
        if (isStyleField(field)) {
            return 'Вид кнопки';
        }
        if (isLinkLikeField(field)) {
            if (key.includes('phone')) return 'Номер для кнопки';
            if (key.includes('email')) return 'Почта для кнопки';
            return 'Куда вести после нажатия';
        }
        if (isIconField(field)) {
            return 'Значок рядом с текстом';
        }
        if (binding?.type === 'object' && isPrimaryTextField(field)) {
            return 'Текст кнопки';
        }
        if ((binding?.type === 'text' || binding?.type === 'html') && /заголов/i.test(binding.label || '')) {
            return 'Новый заголовок';
        }
        if (binding?.type === 'text' || binding?.type === 'html') {
            return 'Новый текст';
        }
        if (binding?.type === 'image' && isImageDescriptionField(field)) {
            if (key === 'alt') return 'Описание для поисковиков';
            if (key === 'caption') return 'Подпись под фото';
        }
        return label || field.key;
    }

    function isIconField(field) {
        const key = String(field?.key || '').toLowerCase();
        const label = String(field?.label || '').toLowerCase();
        return key === 'icon' || /иконк/.test(label);
    }

    function getInlineIconOptionLabel(iconValue) {
        return INLINE_ICON_OPTIONS.find((option) => option.value === iconValue)?.label || iconValue;
    }

    function getInlineIconSearchText(option) {
        return [
            option.label,
            option.value,
            INLINE_ICON_GROUP_LABELS[option.group] || '',
            ...(Array.isArray(option.keywords) ? option.keywords : [])
        ]
            .join(' ')
            .toLowerCase();
    }

    function filterInlineIconOptions(queryValue) {
        const queryText = String(queryValue || '').trim().toLowerCase();
        if (!queryText) {
            return INLINE_ICON_OPTIONS;
        }

        return INLINE_ICON_OPTIONS.filter((option) => getInlineIconSearchText(option).includes(queryText));
    }

    function createIconOptionButton(option, control, updateActiveState) {
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
        return button;
    }

    function closeIconModal() {
        if (!ui.iconModal || ui.iconModal.hidden) return;
        ui.iconModal.hidden = true;
        state.activeIconPicker = null;
        if (ui.iconModalSearch) {
            ui.iconModalSearch.value = '';
        }
    }

    function renderIconModalSelection(control) {
        if (!ui.iconModalBadge || !ui.iconModalValue) return;
        const nextValue = String(control?.value || '').trim();
        if (ui.iconModalSelected) {
            ui.iconModalSelected.hidden = !nextValue;
        }
        ui.iconModalBadge.innerHTML = '';
        if (nextValue) {
            const icon = document.createElement('i');
            icon.className = nextValue;
            icon.setAttribute('aria-hidden', 'true');
            ui.iconModalBadge.appendChild(icon);
            ui.iconModalValue.textContent = getInlineIconOptionLabel(nextValue);
        } else {
            ui.iconModalBadge.textContent = '—';
            ui.iconModalValue.textContent = 'Без значка';
        }
    }

    function applyIconChoice(control, updateActiveState, nextValue, options = {}) {
        control.value = nextValue;
        control.dispatchEvent(new Event('input', { bubbles: true }));
        control.dispatchEvent(new Event('change', { bubbles: true }));
        updateActiveState();
        renderIconModalSelection(control);
        if (options.closeModal !== false) {
            closeIconModal();
        }
    }

    function renderIconModalOptions() {
        const context = state.activeIconPicker;
        if (!context || !ui.iconModalGroups || !ui.iconModalCount) return;

        const filteredOptions = filterInlineIconOptions(ui.iconModalSearch?.value);
        const selectableOptions = filteredOptions.filter((option) => option.value);
        ui.iconModalCount.textContent = ui.iconModalSearch?.value?.trim()
            ? `Найдено: ${selectableOptions.length} вариантов`
            : `Всего доступно: ${INLINE_ICON_OPTIONS.filter((option) => option.value).length} иконок`;

        renderIconOptionGroups(
            ui.iconModalGroups,
            selectableOptions,
            context.control,
            context.updateActiveState,
            (value) => applyIconChoice(context.control, context.updateActiveState, value, { closeModal: true })
        );
        renderIconModalSelection(context.control);
    }

    function openIconModal(control, updateActiveState) {
        if (!ui.iconModal) return;
        state.activeIconPicker = { control, updateActiveState };
        ui.iconModal.hidden = false;
        renderIconModalOptions();
        window.setTimeout(() => {
            ui.iconModalSearch?.focus();
            ui.iconModalSearch?.select();
        }, 0);
    }

    function renderIconOptionGroups(container, options, control, updateActiveState, onSelect = null) {
        container.innerHTML = '';

        if (!options.length) {
            const empty = document.createElement('div');
            empty.className = 'p-inline-panel__icon-empty';
            empty.textContent = 'По этому запросу ничего не найдено. Попробуйте другое слово, например: телефон, ворота, покраска.';
            container.appendChild(empty);
            return;
        }

        const groups = new Map();
        options.forEach((option) => {
            const groupKey = option.group || 'common';
            if (!groups.has(groupKey)) {
                groups.set(groupKey, []);
            }
            groups.get(groupKey).push(option);
        });

        const orderedGroupKeys = Array.from(new Set([
            ...INLINE_ICON_GROUP_ORDER,
            ...groups.keys()
        ]));

        orderedGroupKeys.forEach((groupKey) => {
            const groupOptions = groups.get(groupKey);
            if (!groupOptions?.length) return;

            const group = document.createElement('div');
            group.className = 'p-inline-panel__icon-group';

            const title = document.createElement('div');
            title.className = 'p-inline-panel__icon-group-title';
            title.textContent = INLINE_ICON_GROUP_LABELS[groupKey] || 'Другие';
            group.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'p-inline-panel__icon-group-grid';
            groupOptions.forEach((option) => {
                const button = createIconOptionButton(option, control, updateActiveState);
                if (typeof onSelect === 'function') {
                    button.addEventListener('click', () => onSelect(option.value));
                }
                grid.appendChild(button);
            });
            group.appendChild(grid);
            container.appendChild(group);
        });
    }

    function createIconPreview(control) {
        const preview = document.createElement('div');
        preview.className = 'p-inline-panel__icon-preview';
        preview.hidden = true;

        const badge = document.createElement('span');
        badge.className = 'p-inline-panel__icon-preview-badge';
        preview.appendChild(badge);

        const text = document.createElement('div');
        text.className = 'p-inline-panel__icon-preview-text';
        text.innerHTML = `
            <span class="p-inline-panel__icon-preview-title">Как выглядит сейчас</span>
            <span class="p-inline-panel__icon-preview-value"></span>
        `;
        preview.appendChild(text);

        const valueNode = text.querySelector('.p-inline-panel__icon-preview-value');

        const render = () => {
            const nextValue = String(control.value || '').trim();
            const optionLabel = getInlineIconOptionLabel(nextValue);
            const hasIcon = Boolean(nextValue);
            preview.hidden = !hasIcon;
            badge.innerHTML = '';
            if (hasIcon) {
                const icon = document.createElement('i');
                icon.className = nextValue;
                icon.setAttribute('aria-hidden', 'true');
                badge.appendChild(icon);
                valueNode.textContent = optionLabel || 'Выбрана иконка';
            } else {
                valueNode.textContent = '';
            }
        };

        control.addEventListener('input', render);
        render();
        return preview;
    }

    function createIconPicker(control) {
        const wrapper = document.createElement('div');
        wrapper.className = 'p-inline-panel__icon-picker';

        const updateActiveState = () => {
            const currentValue = String(control.value || '').trim();
            wrapper.querySelectorAll('.p-inline-panel__icon-option').forEach((button) => {
                button.classList.toggle('is-active', button.dataset.iconValue === currentValue);
            });
        };

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'p-inline-panel__btn p-inline-panel__icon-picker-open';
        button.textContent = 'Выбрать иконку';
        button.addEventListener('click', () => openIconModal(control, updateActiveState));
        wrapper.appendChild(button);

        const note = document.createElement('p');
        note.className = 'p-inline-panel__icon-picker-note';
        note.textContent = 'Откроется отдельное окно со всеми доступными иконками и поиском по словам.';
        wrapper.appendChild(note);

        control.addEventListener('input', updateActiveState);
        updateActiveState();
        return wrapper;
    }

    function isLinkLikeField(field) {
        const key = String(field?.key || '').toLowerCase();
        const label = String(field?.label || '').toLowerCase();
        return ['href', 'url', 'link', 'phone', 'email', 'telegram', 'whatsapp'].some((item) => key.includes(item))
            || /ссылк|адрес|телефон|почт|telegram|whatsapp/.test(label);
    }

    function isPrimaryTextField(field) {
        if (!field || isIconField(field) || isLinkLikeField(field)) return false;
        const key = String(field.key || '').toLowerCase();
        const label = String(field.label || '').toLowerCase();
        return key === '__value'
            || ['label', 'text', 'title', 'name', 'actionlabel', 'buttontext'].includes(key)
            || /текст|заголов|название|кнопк|подпись/.test(label);
    }

    function isActionLikeObjectBinding(binding, editorFields = null) {
        if (!binding || binding.type !== 'object') return false;

        const fields = Array.isArray(editorFields) && editorFields.length
            ? editorFields
            : getBindingEditorFields(binding);
        const linkFields = fields.filter(isLinkLikeField);
        if (!linkFields.length) return false;

        const textFields = fields.filter(isPrimaryTextField);
        const hasExtendedCopy = fields.some((field) => {
            if (!field || isIconField(field) || isLinkLikeField(field) || isStyleField(field)) return false;
            const key = String(field.key || '').toLowerCase();
            const label = String(field.label || '').toLowerCase();
            return ['description', 'subtitle', 'answer', 'note', 'meta', 'badge'].includes(key)
                || /опис|подзаголов|ответ|примеч|бейдж|мета/.test(label);
        });

        return textFields.length <= 2 && !hasExtendedCopy;
    }

    function isImageDescriptionField(field) {
        const key = String(field?.key || '').toLowerCase();
        const label = String(field?.label || '').toLowerCase();
        return ['alt', 'title', 'caption', 'subtitle'].includes(key)
            || /alt|подпись|описан|заголов/.test(label);
    }

    function createPanelSection(title, meta = '') {
        const section = document.createElement('section');
        section.className = 'p-inline-panel__section';

        const head = document.createElement('div');
        head.className = 'p-inline-panel__section-head';

        const heading = document.createElement('h3');
        heading.className = 'p-inline-panel__section-title';
        heading.textContent = title;
        head.appendChild(heading);

        if (meta) {
            const hint = document.createElement('p');
            hint.className = 'p-inline-panel__section-meta';
            hint.textContent = meta;
            head.appendChild(hint);
        }

        section.appendChild(head);
        return section;
    }

    function createPanelAccordion(title, meta = '', options = {}) {
        const details = document.createElement('details');
        details.className = 'p-inline-panel__accordion';
        details.open = Boolean(options.open);

        const summary = document.createElement('summary');
        summary.className = 'p-inline-panel__accordion-summary';

        const copy = document.createElement('div');
        copy.className = 'p-inline-panel__accordion-copy';

        const heading = document.createElement('span');
        heading.className = 'p-inline-panel__accordion-title';
        heading.textContent = title;
        copy.appendChild(heading);

        if (meta) {
            const hint = document.createElement('span');
            hint.className = 'p-inline-panel__accordion-meta';
            hint.textContent = meta;
            copy.appendChild(hint);
        }

        summary.appendChild(copy);
        details.appendChild(summary);

        const body = document.createElement('div');
        body.className = 'p-inline-panel__accordion-body';
        details.appendChild(body);

        return { element: details, body };
    }

    function appendFieldSectionContent(mountNode, sectionConfig, value, binding) {
        const section = createPanelSection(sectionConfig.title, sectionConfig.meta);
        sectionConfig.fields.forEach((field) => {
            const fieldValue = field.key === '__value'
                ? value
                : getByPath(value, field.key);
            section.appendChild(createFieldGroup(field, fieldValue, binding));
        });
        mountNode.appendChild(section);
    }

    function getAdditionalSectionsSummary(binding) {
        if (binding.type === 'image') {
            return 'Описание для поисковиков и редкие параметры фото.';
        }
        if (binding.type === 'object') {
            return 'Иконка, вид кнопки и другие второстепенные настройки.';
        }
        return 'Редкие и технические параметры этого блока.';
    }

    function getSecondaryAccordionConfig(binding, secondarySections, fallbackTitle, fallbackMeta) {
        const sections = Array.isArray(secondarySections) ? secondarySections : [];
        const hasIconSettings = binding?.type === 'object' && sections.some((section) =>
            (section?.fields || []).some((field) => isIconField(field))
        );
        const hasStyleSettings = binding?.type === 'object' && sections.some((section) =>
            (section?.fields || []).some((field) => isStyleField(field))
        );

        if (hasIconSettings && hasStyleSettings) {
            return {
                title: 'Значок и вид кнопки',
                meta: 'Здесь можно выбрать значок и поменять оформление кнопки.',
                open: true
            };
        }

        if (hasIconSettings) {
            return {
                title: 'Значок',
                meta: 'Здесь можно выбрать или убрать значок у этого блока.',
                open: true
            };
        }

        if (hasStyleSettings) {
            return {
                title: 'Вид кнопки',
                meta: 'Здесь можно поменять оформление кнопки.',
                open: true
            };
        }

        return {
            title: fallbackTitle,
            meta: fallbackMeta,
            open: false
        };
    }

    function appendFieldSections(binding, value, sectionConfigs) {
        if (!Array.isArray(sectionConfigs) || !sectionConfigs.length) return;

        const primarySections = sectionConfigs.filter((section) => section.importance !== 'secondary');
        const secondarySections = sectionConfigs.filter((section) => section.importance === 'secondary');

        if (!primarySections.length && secondarySections.length) {
            primarySections.push(secondarySections.shift());
        }

        primarySections.forEach((section) => appendFieldSectionContent(ui.panelForm, section, value, binding));

        if (!secondarySections.length) {
            return;
        }

        const accordionConfig = getSecondaryAccordionConfig(
            binding,
            secondarySections,
            'Дополнительно',
            getAdditionalSectionsSummary(binding)
        );
        const accordion = createPanelAccordion(
            accordionConfig.title,
            accordionConfig.meta,
            { open: accordionConfig.open }
        );
        secondarySections.forEach((section) => appendFieldSectionContent(accordion.body, section, value, binding));
        ui.panelForm.appendChild(accordion.element);
    }

    function appendFocusedFieldSections(binding, value, sectionConfigs, focusFieldKey = '') {
        if (!Array.isArray(sectionConfigs) || !sectionConfigs.length || !focusFieldKey) {
            appendFieldSections(binding, value, sectionConfigs);
            return;
        }

        const primarySections = [];
        const secondarySections = [];

        sectionConfigs.forEach((sectionConfig) => {
            const fields = Array.isArray(sectionConfig.fields) ? sectionConfig.fields : [];
            const focusField = fields.find((field) => field.key === focusFieldKey);
            if (!focusField) {
                secondarySections.push(sectionConfig);
                return;
            }

            const compactActionGroup = fields.length <= 3
                && (fields.some(isLinkLikeField) || fields.some(isIconField));
            const primaryFields = compactActionGroup
                ? fields
                : [focusField];
            const secondaryFields = fields.filter((field) => !primaryFields.includes(field));

            primarySections.push({
                title: 'Быстрая правка',
                meta: compactActionGroup
                    ? 'Открыта нужная часть блока. Соседние поля для этого действия тоже показаны сразу.'
                    : `Открыта точечная правка поля «${focusField.label || focusField.key}».`,
                fields: primaryFields,
                importance: 'primary'
            });

            if (secondaryFields.length) {
                secondarySections.push({
                    ...sectionConfig,
                    fields: secondaryFields,
                    importance: 'secondary'
                });
            }
        });

        if (!primarySections.length) {
            appendFieldSections(binding, value, sectionConfigs);
            return;
        }

        primarySections.forEach((section) => appendFieldSectionContent(ui.panelForm, section, value, binding));

        if (!secondarySections.length) {
            return;
        }

        const accordionConfig = getSecondaryAccordionConfig(
            binding,
            secondarySections,
            'Остальное в блоке',
            'Раскройте, если нужно отредактировать соседние поля этого же блока.'
        );
        const accordion = createPanelAccordion(
            accordionConfig.title,
            accordionConfig.meta,
            { open: accordionConfig.open }
        );
        secondarySections.forEach((section) => appendFieldSectionContent(accordion.body, section, value, binding));
        ui.panelForm.appendChild(accordion.element);
    }

    function getFieldGroupsForBinding(binding, editorFields) {
        if (binding.type === 'image') {
            const descriptionFields = editorFields.filter(isImageDescriptionField);
            const primaryFields = descriptionFields.filter((field) => String(field?.key || '').toLowerCase() !== 'alt');
            const searchFields = descriptionFields.filter((field) => String(field?.key || '').toLowerCase() === 'alt');
            const extraFields = editorFields.filter((field) => !isImageDescriptionField(field));
            return [
                primaryFields.length ? {
                    title: 'Главное',
                    meta: 'Подпись и заголовок, которые увидит посетитель рядом с фото.',
                    fields: primaryFields,
                    importance: 'primary'
                } : null,
                searchFields.length ? {
                    title: 'Для поисковиков',
                    meta: 'Помогает поиску и доступности. Обычный посетитель это не видит.',
                    fields: searchFields,
                    importance: 'secondary'
                } : null,
                extraFields.length ? {
                    title: 'Редкие настройки',
                    meta: 'Нестандартные параметры фото. Обычно их трогать не нужно.',
                    fields: extraFields,
                    importance: 'secondary'
                } : null
            ].filter(Boolean);
        }

        if (binding.type === 'object') {
            const primaryFields = editorFields.filter(isPrimaryTextField);
            const linkFields = editorFields.filter(isLinkLikeField);
            const iconFields = editorFields.filter(isIconField);
            const styleFields = editorFields.filter(isStyleField);
            const extraFields = editorFields.filter((field) => (
                !isPrimaryTextField(field) && !isLinkLikeField(field) && !isIconField(field) && !isStyleField(field)
            ));
            const isActionLike = linkFields.length > 0;

            return [
                primaryFields.length ? {
                    title: isActionLike ? 'Главное на кнопке' : 'Главный текст',
                    meta: isActionLike
                        ? 'Именно это посетитель увидит на кнопке или ссылке.'
                        : 'Главный текст этого блока на странице.',
                    fields: primaryFields,
                    importance: 'primary'
                } : null,
                linkFields.length ? {
                    title: 'Куда вести',
                    meta: 'Укажите адрес перехода или выберите готовый вариант ниже.',
                    fields: linkFields,
                    importance: 'primary'
                } : null,
                iconFields.length ? {
                    title: 'Значок',
                    meta: 'Маленький значок рядом с текстом.',
                    fields: iconFields,
                    importance: 'secondary'
                } : null,
                styleFields.length ? {
                    title: 'Вид кнопки',
                    meta: 'Выберите, должна ли кнопка быть яркой, спокойной или контурной.',
                    fields: styleFields,
                    importance: 'secondary'
                } : null,
                extraFields.length ? {
                    title: 'Редкие настройки',
                    meta: 'Параметры, которые обычно менять не приходится.',
                    fields: extraFields,
                    importance: 'secondary'
                } : null
            ].filter(Boolean);
        }

        if (binding.type === 'list') {
            return [{
                title: 'Главное',
                meta: 'Каждая строка станет отдельным пунктом.',
                fields: editorFields,
                importance: 'primary'
            }];
        }

        const title = /заголов/i.test(binding.label || '')
            ? 'Главное'
            : 'Главное';
        return [{
            title,
            meta: /заголов/i.test(binding.label || '')
                ? 'Крупный текст, который первым видит посетитель.'
                : 'То, что увидит посетитель на странице.',
            fields: editorFields,
            importance: 'primary'
        }];
    }

    function getActionPreviewValues(binding, value) {
        const objectValue = value && typeof value === 'object' ? value : {};
        const rawText = objectValue.label
            || objectValue.text
            || objectValue.title
            || objectValue.name
            || objectValue.actionLabel
            || binding.label
            || 'Кнопка';
        const rawHref = objectValue.href
            || objectValue.url
            || objectValue.link
            || objectValue.phone
            || objectValue.email
            || '';
        const rawIcon = objectValue.icon || '';
        return {
            text: String(rawText || 'Кнопка').trim() || 'Кнопка',
            href: String(rawHref || '').trim(),
            icon: String(rawIcon || '').trim(),
            style: String(objectValue.style || objectValue.variant || 'primary').trim() || 'primary'
        };
    }

    function createActionPreview(binding, value) {
        const preview = document.createElement('div');
        preview.className = 'p-inline-panel__action-preview';
        preview.innerHTML = `
            <div class="p-inline-panel__action-preview-badge">Так увидит клиент</div>
            <div class="p-inline-panel__action-preview-button">
                <i aria-hidden="true" hidden></i>
                <span></span>
            </div>
            <p class="p-inline-panel__action-preview-link"></p>
        `;

        const iconNode = preview.querySelector('i');
        const textNode = preview.querySelector('span');
        const buttonNode = preview.querySelector('.p-inline-panel__action-preview-button');
        const linkNode = preview.querySelector('.p-inline-panel__action-preview-link');

        const render = (nextValue = value) => {
            const data = getActionPreviewValues(binding, nextValue);
            textNode.textContent = data.text;
            if (data.icon) {
                iconNode.hidden = false;
                iconNode.className = data.icon;
            } else {
                iconNode.hidden = true;
                iconNode.className = '';
            }
            buttonNode.classList.remove(
                'p-inline-panel__action-preview-button--primary',
                'p-inline-panel__action-preview-button--secondary',
                'p-inline-panel__action-preview-button--outline'
            );
            const previewStyle = INLINE_BUTTON_STYLE_LIBRARY[data.style]?.previewClass || 'primary';
            buttonNode.classList.add(`p-inline-panel__action-preview-button--${previewStyle}`);
            const description = describeInlineHref(data.href);
            linkNode.textContent = description.text;
        };

        preview.renderPreview = render;
        render(value);
        return preview;
    }

    function getObjectPreviewValues(binding, value) {
        const objectValue = value && typeof value === 'object' ? value : {};
        const title = String(
            objectValue.title
            || objectValue.label
            || objectValue.name
            || binding.label
            || 'Карточка'
        ).trim() || 'Карточка';
        const text = String(
            objectValue.description
            || objectValue.subtitle
            || objectValue.text
            || objectValue.answer
            || ''
        ).trim();
        const badge = String(objectValue.badge || objectValue.meta || '').trim();
        const icon = String(objectValue.icon || '').trim();
        const style = String(objectValue.style || objectValue.variant || 'secondary').trim() || 'secondary';
        const action = {
            label: String(objectValue.actionLabel || objectValue.cta?.label || '').trim(),
            href: String(objectValue.href || objectValue.url || objectValue.link || objectValue.cta?.href || '').trim(),
            icon: String(objectValue.cta?.icon || '').trim()
        };
        return { title, text, badge, icon, style, action };
    }

    function createObjectCardPreview(binding, value) {
        const preview = document.createElement('div');
        preview.className = 'p-inline-panel__object-preview';
        preview.dataset.inlineObjectPreview = 'card';
        preview.innerHTML = `
            <div class="p-inline-panel__action-preview-badge">Так увидит клиент</div>
            <div class="p-inline-panel__object-preview-card">
                <div class="p-inline-panel__object-preview-top">
                    <div class="p-inline-panel__object-preview-icon" hidden><i aria-hidden="true"></i></div>
                    <div class="p-inline-panel__object-preview-copy">
                        <span class="p-inline-panel__object-preview-badge" hidden></span>
                        <h4 class="p-inline-panel__object-preview-title"></h4>
                        <p class="p-inline-panel__object-preview-text" hidden></p>
                    </div>
                </div>
                <div class="p-inline-panel__action-preview-button" hidden>
                    <i aria-hidden="true" hidden></i>
                    <span></span>
                </div>
            </div>
        `;

        const cardNode = preview.querySelector('.p-inline-panel__object-preview-card');
        const iconWrap = preview.querySelector('.p-inline-panel__object-preview-icon');
        const iconNode = iconWrap.querySelector('i');
        const badgeNode = preview.querySelector('.p-inline-panel__object-preview-badge');
        const titleNode = preview.querySelector('.p-inline-panel__object-preview-title');
        const textNode = preview.querySelector('.p-inline-panel__object-preview-text');
        const actionNode = preview.querySelector('.p-inline-panel__action-preview-button');
        const actionIcon = actionNode.querySelector('i');
        const actionText = actionNode.querySelector('span');

        const render = (nextValue = value) => {
            const data = getObjectPreviewValues(binding, nextValue);
            const previewStyle = INLINE_BUTTON_STYLE_LIBRARY[data.style]?.previewClass || 'secondary';
            cardNode.classList.remove(
                'p-inline-panel__object-preview-card--primary',
                'p-inline-panel__object-preview-card--secondary',
                'p-inline-panel__object-preview-card--outline'
            );
            cardNode.classList.add(`p-inline-panel__object-preview-card--${previewStyle}`);

            titleNode.textContent = data.title;

            if (data.badge) {
                badgeNode.hidden = false;
                badgeNode.textContent = data.badge;
            } else {
                badgeNode.hidden = true;
                badgeNode.textContent = '';
            }

            if (data.text) {
                textNode.hidden = false;
                textNode.textContent = data.text;
            } else {
                textNode.hidden = true;
                textNode.textContent = '';
            }

            if (data.icon) {
                iconWrap.hidden = false;
                iconNode.className = data.icon;
            } else {
                iconWrap.hidden = true;
                iconNode.className = '';
            }

            if (data.action.label) {
                actionNode.hidden = false;
                actionNode.classList.remove(
                    'p-inline-panel__action-preview-button--primary',
                    'p-inline-panel__action-preview-button--secondary',
                    'p-inline-panel__action-preview-button--outline'
                );
                actionNode.classList.add(`p-inline-panel__action-preview-button--${previewStyle}`);
                actionText.textContent = data.action.label;
                if (data.action.icon) {
                    actionIcon.hidden = false;
                    actionIcon.className = data.action.icon;
                } else {
                    actionIcon.hidden = true;
                    actionIcon.className = '';
                }
            } else {
                actionNode.hidden = true;
                actionText.textContent = '';
                actionIcon.hidden = true;
                actionIcon.className = '';
            }
        };

        preview.renderPreview = render;
        render(value);
        return preview;
    }

    function updatePanelActionPreview() {
        const preview = ui.panelForm?.querySelector('.p-inline-panel__action-preview, [data-inline-object-preview="card"]');
        const binding = state.bindingMap.get(state.activeBindingId);
        if (!preview || !binding || binding.type !== 'object' || typeof preview.renderPreview !== 'function') {
            return;
        }

        const nextValue = {};
        getBindingEditorFields(binding).forEach((field) => {
            const control = ui.panelForm.querySelector(`[name="${field.key}"]`);
            if (!control) return;
            if (field.key === '__value') {
                nextValue.label = control.value ?? '';
                return;
            }
            setByPath(nextValue, field.key, control.value ?? '');
        });
        preview.renderPreview(nextValue);
    }

    function collectPanelPreviewValue(binding) {
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

        return nextValue;
    }

    function updateLiveBindingPreview(binding = state.bindingMap.get(state.activeBindingId)) {
        if (!binding) return;
        const fileState = state.files.get(binding.fileName);
        if (!fileState) return;

        if (!ui.panel?.hidden && state.activeBindingId === binding.id && hasPendingPanelChanges()) {
            renderBindingPreviewValue(binding, collectPanelPreviewValue(binding));
            return;
        }

        renderBinding(binding);
    }

    function restoreActiveBindingPreview() {
        const binding = state.bindingMap.get(state.activeBindingId);
        if (!binding) return;
        renderBinding(binding);
    }

    function flashActiveBindingPreview(binding = state.bindingMap.get(state.activeBindingId)) {
        if (!binding) return;
        pulseBindingElements(binding, binding.elements);
    }

    function appendObjectQuickActions(binding, value) {
        const editorFields = getBindingEditorFields(binding);
        const styleField = editorFields.find(isStyleField);
        const iconField = editorFields.find(isIconField);
        if (!styleField && !iconField) return;

        const section = createPanelSection(
            'Быстрые действия',
            'Нажмите на вариант ниже: он сразу изменит вид кнопки или значок.'
        );

        const actions = document.createElement('div');
        actions.className = 'p-inline-panel__quick-actions';

        const quickButtons = [];
        const registerQuickButton = (button, isActive) => {
            if (!(button instanceof HTMLElement) || typeof isActive !== 'function') return;
            quickButtons.push({ button, isActive });
        };
        const updateQuickActionsState = () => {
            quickButtons.forEach(({ button, isActive }) => {
                button.classList.toggle('is-active', Boolean(isActive()));
            });
        };

        if (styleField) {
            const styleControl = ui.panelForm.querySelector(`[name="${styleField.key}"]`);
            const styleOptions = getStyleOptionsForField(styleField, styleControl?.value || value?.style || value?.variant || '');
            const accentOption = styleOptions.find((option) => option.value === 'primary');
            const calmOption = styleOptions.find((option) => option.value === 'secondary') || styleOptions.find((option) => option.value === 'outline');

            if (accentOption && styleControl) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'p-inline-panel__example-chip';
                button.textContent = 'Акцентная';
                button.addEventListener('click', () => {
                    styleControl.value = accentOption.value;
                    styleControl.dispatchEvent(new Event('input', { bubbles: true }));
                    styleControl.dispatchEvent(new Event('change', { bubbles: true }));
                    updateQuickActionsState();
                    flashActiveBindingPreview(binding);
                    showToast('Кнопка стала акцентной');
                });
                registerQuickButton(button, () => styleControl.value === accentOption.value);
                actions.appendChild(button);
            }

            if (calmOption && styleControl) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'p-inline-panel__example-chip';
                button.textContent = calmOption.value === 'outline' ? 'Контурная' : 'Спокойная';
                button.addEventListener('click', () => {
                    styleControl.value = calmOption.value;
                    styleControl.dispatchEvent(new Event('input', { bubbles: true }));
                    styleControl.dispatchEvent(new Event('change', { bubbles: true }));
                    updateQuickActionsState();
                    flashActiveBindingPreview(binding);
                    showToast(calmOption.value === 'outline' ? 'Кнопка стала контурной' : 'Кнопка стала спокойной');
                });
                registerQuickButton(button, () => styleControl.value === calmOption.value);
                actions.appendChild(button);
            }

            styleControl?.addEventListener('input', updateQuickActionsState);
            styleControl?.addEventListener('change', updateQuickActionsState);
        }

        if (iconField) {
            const iconControl = ui.panelForm.querySelector(`[name="${iconField.key}"]`);
            if (iconControl) {
                const withIcon = document.createElement('button');
                withIcon.type = 'button';
                withIcon.className = 'p-inline-panel__example-chip';
                withIcon.textContent = 'С иконкой';
                withIcon.addEventListener('click', () => {
                    iconControl.value = iconControl.value || getDefaultInlineIconForBinding(binding, value);
                    iconControl.dispatchEvent(new Event('input', { bubbles: true }));
                    iconControl.dispatchEvent(new Event('change', { bubbles: true }));
                    updateQuickActionsState();
                    flashActiveBindingPreview(binding);
                    showToast('Значок добавлен');
                });
                registerQuickButton(withIcon, () => Boolean(String(iconControl.value || '').trim()));
                actions.appendChild(withIcon);

                const withoutIcon = document.createElement('button');
                withoutIcon.type = 'button';
                withoutIcon.className = 'p-inline-panel__example-chip';
                withoutIcon.textContent = 'Без иконки';
                withoutIcon.addEventListener('click', () => {
                    iconControl.value = '';
                    iconControl.dispatchEvent(new Event('input', { bubbles: true }));
                    iconControl.dispatchEvent(new Event('change', { bubbles: true }));
                    updateQuickActionsState();
                    flashActiveBindingPreview(binding);
                    showToast('Значок убран');
                });
                registerQuickButton(withoutIcon, () => !String(iconControl.value || '').trim());
                actions.appendChild(withoutIcon);

                iconControl.addEventListener('input', updateQuickActionsState);
                iconControl.addEventListener('change', updateQuickActionsState);
            }
        }

        if (!actions.children.length) return;
        section.appendChild(actions);
        ui.panelForm.appendChild(section);
        updateQuickActionsState();
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

    function normalizeInlineComparableText(value) {
        return String(value ?? '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    function getBindingFieldValueForMatching(field, value) {
        const rawValue = field?.key === '__value'
            ? value
            : getByPath(value, field?.key);

        if (rawValue == null) return '';
        if (Array.isArray(rawValue)) {
            return normalizeInlineComparableText(rawValue.join(' '));
        }
        if (typeof rawValue === 'object') {
            if (isIconField(field)) {
                return normalizeInlineComparableText(rawValue.icon || '');
            }
            if (isLinkLikeField(field)) {
                return normalizeInlineComparableText(
                    rawValue.href
                    || rawValue.url
                    || rawValue.phone
                    || rawValue.email
                    || rawValue.telegram
                    || rawValue.whatsapp
                    || rawValue.label
                    || ''
                );
            }
            return normalizeInlineComparableText(
                Object.values(rawValue)
                    .filter((item) => typeof item === 'string' || typeof item === 'number')
                    .join(' ')
            );
        }
        return normalizeInlineComparableText(rawValue);
    }

    function resolveInlineMiniBlockTarget(bindingRoot, rawTarget) {
        let current = rawTarget instanceof Element ? rawTarget : rawTarget?.parentElement;
        if (!(bindingRoot instanceof HTMLElement) || !(current instanceof Element)) {
            return bindingRoot;
        }

        while (current && current !== bindingRoot) {
            if (current.matches('i, svg, use, path')) {
                current = current.parentElement;
                continue;
            }

            if (current.matches('a, button, img, li, dt, dd, p, blockquote, h1, h2, h3, h4, h5, h6, figcaption, label, summary')) {
                return current;
            }

            const tagName = String(current.tagName || '').toLowerCase();
            const classText = normalizeInlineComparableText(
                typeof current.className === 'string' ? current.className : current.getAttribute('class') || ''
            );
            const textContent = normalizeInlineComparableText(current.textContent || '');

            if (
                ((tagName === 'strong' || tagName === 'span' || tagName === 'small' || tagName === 'em' || tagName === 'b') && textContent.length >= 2)
                || /title|subtitle|description|text|label|badge|meta|price|value|note|caption|question|answer|lead|intro|cta|action|btn|fact|point/.test(classText)
            ) {
                return current;
            }

            if (tagName === 'div' && current.childElementCount <= 3 && textContent && textContent.length <= 180) {
                return current;
            }

            current = current.parentElement;
        }

        return bindingRoot;
    }

    function inferFocusedFieldKey(binding, value, targetElement) {
        if (!binding || !targetElement) return '';

        const fields = getBindingEditorFields(binding);
        if (!fields.length) return '';
        if (fields.length === 1) return fields[0].key;

        const tagName = String(targetElement.tagName || '').toLowerCase();
        const classText = normalizeInlineComparableText(
            typeof targetElement.className === 'string'
                ? targetElement.className
                : targetElement.getAttribute?.('class') || ''
        );
        const targetText = normalizeInlineComparableText(targetElement.textContent || '');
        const linkTarget = targetElement.closest?.('a, button');
        const targetHref = normalizeInlineComparableText(
            resolveSameOriginHref(linkTarget?.getAttribute?.('href') || linkTarget?.href || '')
            || linkTarget?.getAttribute?.('href')
            || ''
        );
        const iconNode = targetElement.matches?.('i')
            ? targetElement
            : targetElement.querySelector?.('i');
        const iconClass = normalizeInlineComparableText(iconNode?.className || '');
        const isHeading = /^h[1-6]$/.test(tagName);
        const isParagraphLike = ['p', 'div', 'span', 'blockquote', 'figcaption'].includes(tagName);
        const isListItem = tagName === 'li' || Boolean(targetElement.closest?.('li'));

        let bestField = null;
        let bestScore = 0;

        fields.forEach((field) => {
            const fieldValue = getBindingFieldValueForMatching(field, value);
            const fieldKeywords = normalizeInlineComparableText(`${field.key || ''} ${field.label || ''}`);
            let score = 0;

            if (isIconField(field)) {
                if (iconClass) score += 70;
                if (fieldValue && iconClass && (fieldValue.includes(iconClass) || iconClass.includes(fieldValue))) score += 70;
            }

            if (field.type === 'list') {
                if (isListItem) score += 90;
                if (fieldValue && targetText && (fieldValue.includes(targetText) || targetText.includes(fieldValue))) score += 50;
            }

            if (isLinkLikeField(field)) {
                if (linkTarget) score += 30;
                if (targetHref) {
                    if (fieldValue && (fieldValue === targetHref || fieldValue.includes(targetHref) || targetHref.includes(fieldValue))) {
                        score += 95;
                    } else {
                        score += 15;
                    }
                }
            }

            if (isPrimaryTextField(field)) {
                if (isHeading && /title|name|label|heading|question|заголов|название/.test(fieldKeywords)) score += 60;
                if (linkTarget && /label|text|title|name|button|кноп/.test(fieldKeywords)) score += 50;
                if (targetText && fieldValue) {
                    if (targetText === fieldValue) score += 100;
                    else if (targetText.length > 3 && (fieldValue.includes(targetText) || targetText.includes(fieldValue))) score += 75;
                }
            }

            if (!isPrimaryTextField(field) && !isLinkLikeField(field) && !isIconField(field) && targetText && fieldValue) {
                if (targetText === fieldValue) score += 85;
                else if (targetText.length > 3 && (fieldValue.includes(targetText) || targetText.includes(fieldValue))) score += 60;
            }

            if (isParagraphLike && /description|text|lead|subtitle|intro|note|answer|опис|текст|подзаголов/.test(fieldKeywords)) {
                score += 45;
            }

            if (/badge|meta|price|value|count|number|бейдж|цена|стоим/.test(fieldKeywords)
                && (/badge|meta|price|value|count|number/.test(classText) || ['strong', 'span', 'div'].includes(tagName))) {
                score += 45;
            }

            if (score > bestScore) {
                bestScore = score;
                bestField = field;
            }
        });

        if (bestField && bestScore >= 50) {
            return bestField.key;
        }

        if (isListItem) {
            return fields.find((field) => field.type === 'list')?.key || '';
        }

        if (iconClass) {
            return fields.find((field) => isIconField(field))?.key || '';
        }

        if (linkTarget) {
            return fields.find((field) => isPrimaryTextField(field))?.key
                || fields.find((field) => isLinkLikeField(field))?.key
                || '';
        }

        if (isHeading) {
            return fields.find((field) => /title|name|label|question|заголов|название/.test(normalizeInlineComparableText(`${field.key} ${field.label}`)))?.key
                || fields.find((field) => isPrimaryTextField(field))?.key
                || '';
        }

        if (isParagraphLike) {
            return fields.find((field) => /description|text|lead|subtitle|intro|note|answer|опис|текст|подзаголов/.test(normalizeInlineComparableText(`${field.key} ${field.label}`)))?.key
                || fields.find((field) => isPrimaryTextField(field))?.key
                || '';
        }

        return fields.find((field) => isPrimaryTextField(field))?.key || '';
    }

    function resolveInlineInteractionContext(eventTarget) {
        const sourceElement = eventTarget instanceof Element ? eventTarget : eventTarget?.parentElement;
        if (!(sourceElement instanceof Element)) return null;

        const bindingTarget = sourceElement.closest?.('[data-inline-edit-id]');
        if (!(bindingTarget instanceof HTMLElement)) return null;

        const binding = state.bindingMap.get(bindingTarget.dataset.inlineEditId || '');
        if (!binding) return null;

        const focusElement = resolveInlineMiniBlockTarget(bindingTarget, sourceElement);
        return {
            binding,
            bindingTarget,
            focusElement,
            sourceElement
        };
    }

    function clearHoverMarks() {
        state.hoverHighlightElements.forEach((element) => {
            element?.classList?.remove(HOVER_TARGET_CLASS);
        });
        state.hoverHighlightElements = [];

        if (state.hoverSuppressedElement) {
            if (!state.activeSuppressedElements.includes(state.hoverSuppressedElement)) {
                state.hoverSuppressedElement.classList.remove(SUPPRESS_HOVER_CLASS);
            }
            state.hoverSuppressedElement = null;
        }

        hideHoverLabel();
    }

    function applyHoverMarks(context) {
        clearHoverMarks();
        if (!context?.focusElement || !context?.bindingTarget || context.focusElement === context.bindingTarget) {
            return;
        }

        context.focusElement.classList.add(HOVER_TARGET_CLASS);
        context.bindingTarget.classList.add(SUPPRESS_HOVER_CLASS);
        state.hoverHighlightElements = [context.focusElement];
        state.hoverSuppressedElement = context.bindingTarget;
    }

    function setActiveMarks(binding, elements = []) {
        clearActiveMarks();
        const bindingElements = Array.isArray(binding?.elements) ? binding.elements : [];
        const nextElements = (Array.isArray(elements) ? elements : [elements])
            .filter((element) => element instanceof HTMLElement && element.isConnected);

        if (!nextElements.length) {
            bindingElements.forEach((element) => element.classList.add(ACTIVE_CLASS));
            return bindingElements;
        }

        const customElements = [];
        nextElements.forEach((element) => {
            if (bindingElements.includes(element)) {
                element.classList.add(ACTIVE_CLASS);
                return;
            }

            element.classList.add(ACTIVE_TARGET_CLASS);
            customElements.push(element);
        });

        state.activeHighlightElements = customElements;
        if (customElements.length) {
            bindingElements.forEach((element) => element.classList.add(SUPPRESS_HOVER_CLASS));
            state.activeSuppressedElements = [...bindingElements];
        }
        return nextElements;
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

    function hasSavedDifferenceForBinding(binding, fileState = state.files.get(binding?.fileName)) {
        if (!binding || !fileState) return false;

        const collectionState = getBindingCollectionState(binding, fileState);
        if (collectionState) {
            const currentItems = getByPath(fileState.data, collectionState.collectionPath);
            const originalItems = getByPath(fileState.originalData, collectionState.collectionPath);
            return !isSameData(currentItems, originalItems);
        }

        const currentValue = resolveBindingValue(fileState, binding);
        const originalValue = getOriginalBindingValue(binding, fileState);
        const comparableOriginal = originalValue === undefined
            ? resolveBindingDefault(binding)
            : cloneData(originalValue);
        return !isSameData(currentValue, comparableOriginal);
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
                duplicate: 'Сделать копию',
                add: 'Добавить рядом',
                remove: 'Убрать фото',
                movePrev: 'Левее',
                moveNext: 'Правее',
                makeFirst: 'Сделать главным'
            };
        }

        if (binding?.type === 'object') {
            const label = (binding.editorKindLabel || '').toLowerCase();
            if (/ссылк|кнопк/.test(label)) {
                return {
                    singular: 'ссылка',
                    plural: 'ссылок',
                    duplicate: 'Сделать копию',
                    add: 'Добавить ниже',
                    remove: 'Убрать ссылку',
                    movePrev: 'Выше',
                    moveNext: 'Ниже',
                    makeFirst: 'В начало'
                };
            }

            return {
                singular: 'карточка',
                plural: 'карточек',
                duplicate: 'Сделать копию',
                add: 'Добавить ниже',
                remove: 'Убрать карточку',
                movePrev: 'Выше',
                moveNext: 'Ниже',
                makeFirst: 'В начало'
            };
        }

        const itemLabel = String(binding?.collectionItemLabel || '').trim().toLowerCase();
        const singular = itemLabel || 'пункт';
        const plural = binding?.collectionItemLabelPlural || 'пунктов';
        return {
            singular,
            plural,
            duplicate: 'Сделать копию',
            add: 'Добавить ниже',
            remove: `Убрать ${singular}`,
            movePrev: 'Выше',
            moveNext: 'Ниже',
            makeFirst: 'В начало'
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

    function getCollectionItemPreviewData(binding, item, index, total) {
        if (binding?.type === 'image') {
            const title = String(item?.caption || item?.title || item?.alt || `Фото ${index + 1}`).trim();
            const src = String(item?.previewSrc || item?.zoomSrc || item?.src || '').trim();
            return {
                title,
                meta: index === 0 ? 'Главное фото в галерее' : `Фото ${index + 1} из ${total}`,
                imageSrc: src,
                imageAlt: String(item?.alt || title || `Фото ${index + 1}`).trim() || `Фото ${index + 1}`
            };
        }

        if (typeof item === 'string') {
            const clean = item.trim();
            return {
                title: clean || `Элемент ${index + 1}`,
                meta: `${index + 1} из ${total}`
            };
        }

        if (Array.isArray(item)) {
            return {
                title: item[0] ? String(item[0]).trim() : `Элемент ${index + 1}`,
                meta: `${item.length} пунктов внутри`
            };
        }

        const title = String(
            item?.title
            || item?.label
            || item?.name
            || item?.text
            || item?.question
            || item?.heading
            || item?.caption
            || item?.alt
            || `Элемент ${index + 1}`
        ).trim();
        const meta = String(
            item?.subtitle
            || item?.description
            || item?.answer
            || item?.href
            || `${index + 1} из ${total}`
        ).trim();
        return {
            title: title || `Элемент ${index + 1}`,
            meta: meta || `${index + 1} из ${total}`
        };
    }

    async function openCollectionBindingAtIndex(binding, index) {
        const collectionState = getBindingCollectionState(binding);
        if (!collectionState) return;
        const targetBinding = findBinding(binding.fileName, `${collectionState.collectionPath}.${index}`);
        if (!targetBinding) return;
        await openBinding(targetBinding.id, { fromOverview: state.panelReturnToOverview });
    }

    async function moveBindingToCollectionIndex(bindingTarget, nextIndex) {
        try {
            const binding = typeof bindingTarget === 'string'
                ? state.bindingMap.get(bindingTarget)
                : bindingTarget;
            if (!binding) return false;
            const toastLabels = getCollectionToastLabels(binding);

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const collectionState = getBindingCollectionState(binding, fileState);
            if (!collectionState || collectionState.total < 2) {
                showToast(toastLabels.onlyOne);
                return false;
            }

            const targetIndex = Math.max(0, Math.min(collectionState.total - 1, Number(nextIndex)));
            if (targetIndex === collectionState.index) {
                return false;
            }

            const [movedItem] = collectionState.items.splice(collectionState.index, 1);
            collectionState.items.splice(targetIndex, 0, movedItem);

            fileState.dirty = true;
            markBindingsDirtyForCollection(binding.fileName, collectionState.collectionPath);
            refreshCollectionBindings(binding, fileState);
            persistDraftFiles();
            renderToolbar();

            const nextBinding = findBinding(binding.fileName, `${collectionState.collectionPath}.${targetIndex}`) || binding;
            state.activeBindingId = nextBinding.id;
            clearActiveMarks();
            nextBinding.elements.forEach((element) => element.classList.add(ACTIVE_CLASS));
            fillPanel(nextBinding, resolveBindingValue(fileState, nextBinding));

            showToast(targetIndex === 0 ? toastLabels.movedFirst : toastLabels.moved);
            return true;
        } catch (error) {
            const activeBinding = typeof bindingTarget === 'string'
                ? state.bindingMap.get(bindingTarget)
                : bindingTarget;
            showToast(error.message || getCollectionToastLabels(activeBinding).moveError);
            return false;
        }
    }

    function appendCollectionControls(binding, collectionState) {
        const nouns = getCollectionItemNouns(binding);
        const collectionBox = document.createElement('div');
        collectionBox.className = 'p-inline-panel__collection';

        const collectionTitle = document.createElement('h3');
        collectionTitle.className = 'p-inline-panel__collection-title';
        collectionTitle.textContent = binding.type === 'image'
            ? 'Порядок фото'
            : 'Порядок блока';
        collectionBox.appendChild(collectionTitle);

        const collectionMeta = document.createElement('p');
        collectionMeta.className = 'p-inline-panel__collection-meta';
        collectionMeta.textContent = binding.type === 'image'
            ? (collectionState.index === 0
                ? `Сейчас это главное фото. Всего: ${collectionState.total}.`
                : `Фото ${collectionState.index + 1} из ${collectionState.total}.`)
            : (collectionState.index === 0
                ? `Сейчас это первый ${nouns.singular}. Всего: ${collectionState.total}.`
                : `${nouns.singular.charAt(0).toUpperCase() + nouns.singular.slice(1)} ${collectionState.index + 1} из ${collectionState.total}.`);
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

        const collectionList = document.createElement('div');
        collectionList.className = 'p-inline-panel__collection-list';

        collectionState.items.forEach((item, index) => {
            const preview = getCollectionItemPreviewData(binding, item, index, collectionState.total);
            const card = document.createElement('div');
            card.className = 'p-inline-panel__collection-item';
            card.tabIndex = 0;
            if (index === collectionState.index) {
                card.classList.add('is-active');
            }

            const media = document.createElement('div');
            media.className = 'p-inline-panel__collection-item-media';
            if (preview.imageSrc) {
                const image = document.createElement('img');
                image.src = preview.imageSrc;
                image.alt = preview.imageAlt || preview.title;
                media.appendChild(image);
            } else {
                const placeholder = document.createElement('span');
                placeholder.className = 'p-inline-panel__collection-item-placeholder';
                placeholder.textContent = String(index + 1);
                media.appendChild(placeholder);
            }
            card.appendChild(media);

            const copy = document.createElement('div');
            copy.className = 'p-inline-panel__collection-item-copy';

            const top = document.createElement('div');
            top.className = 'p-inline-panel__collection-item-top';

            const title = document.createElement('div');
            title.className = 'p-inline-panel__collection-item-title';
            title.textContent = preview.title;
            top.appendChild(title);

            if (index === collectionState.index) {
                const currentBadge = document.createElement('span');
                currentBadge.className = 'p-inline-panel__collection-item-badge';
                currentBadge.textContent = 'Сейчас';
                top.appendChild(currentBadge);
            }

            if (index === 0) {
                const firstBadge = document.createElement('span');
                firstBadge.className = 'p-inline-panel__collection-item-badge p-inline-panel__collection-item-badge--muted';
                firstBadge.textContent = binding.type === 'image' ? 'Главное' : 'Первый';
                top.appendChild(firstBadge);
            }

            copy.appendChild(top);

            const meta = document.createElement('p');
            meta.className = 'p-inline-panel__collection-item-meta';
            meta.textContent = preview.meta;
            copy.appendChild(meta);

            const itemActions = document.createElement('div');
            itemActions.className = 'p-inline-panel__collection-item-actions';

            const openButton = document.createElement('button');
            openButton.type = 'button';
            openButton.className = 'p-inline-panel__example-chip';
            openButton.textContent = index === collectionState.index ? 'Открыто' : 'Открыть';
            openButton.disabled = index === collectionState.index;
            openButton.addEventListener('click', async (event) => {
                event.stopPropagation();
                if (index === collectionState.index) return;
                await openCollectionBindingAtIndex(binding, index);
            });
            itemActions.appendChild(openButton);

            if (index !== 0) {
                const firstButton = document.createElement('button');
                firstButton.type = 'button';
                firstButton.className = 'p-inline-panel__example-chip';
                firstButton.textContent = binding.type === 'image' ? 'Сделать главным' : 'В начало';
                firstButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    await moveBindingToCollectionIndex(index === collectionState.index ? binding : findBinding(binding.fileName, `${collectionState.collectionPath}.${index}`), 0);
                });
                itemActions.appendChild(firstButton);
            }

            copy.appendChild(itemActions);
            card.appendChild(copy);

            card.addEventListener('click', async () => {
                if (index === collectionState.index) return;
                await openCollectionBindingAtIndex(binding, index);
            });
            card.addEventListener('keydown', async (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                if (index === collectionState.index) return;
                await openCollectionBindingAtIndex(binding, index);
            });

            collectionList.appendChild(card);
        });

        collectionBox.appendChild(collectionList);
        ui.panelForm.appendChild(collectionBox);
    }

    function fillPanel(binding, value, options = {}) {
        state.panelFocusField = options.focusField || '';
        ui.panelKicker.textContent = getBindingKindLabel(binding);
        ui.panelTitle.textContent = binding.label;
        ui.panelForm.innerHTML = '';
        ui.panelForm.scrollTop = 0;
        ui.panelForm.scrollLeft = 0;
        if (ui.panel) {
            ui.panel.scrollTop = 0;
            ui.panel.scrollLeft = 0;
        }
        window.requestAnimationFrame(() => {
            if (ui.panelForm) {
                ui.panelForm.scrollLeft = 0;
            }
            if (ui.panel) {
                ui.panel.scrollLeft = 0;
            }
        });
        if (ui.panelActions) {
            ui.panelActions.hidden = false;
        }
        if (ui.panelApplyBtn) {
            ui.panelApplyBtn.hidden = true;
        }
        if (ui.panelBackBtn) {
            ui.panelBackBtn.hidden = !state.panelReturnToOverview;
        }

        const editorFields = getBindingEditorFields(binding);
        const fieldSections = getFieldGroupsForBinding(binding, editorFields);

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
            uploadTitle.textContent = 'Новое фото';
            uploadZone.appendChild(uploadTitle);

            const uploadMeta = document.createElement('div');
            uploadMeta.className = 'p-inline-panel__upload-meta';
            uploadMeta.textContent = 'Выберите файл, перетащите сюда или вставьте (Ctrl+V). Лучше брать JPG или PNG не менее 800×600 пкс и до 2 МБ.';
            uploadZone.appendChild(uploadMeta);

            const uploadFile = document.createElement('div');
            uploadFile.className = 'p-inline-panel__upload-file';
            uploadFile.hidden = true;
            uploadZone.appendChild(uploadFile);

            const fileInput = document.createElement('input');
            fileInput.className = 'p-inline-panel__upload-input';
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.name = '__imageUpload';

            fileInput.addEventListener('change', () => {
                const nextFile = fileInput.files?.[0];
                updateImagePreviewFromFile(nextFile, image, uploadFile);
            });

            const uploadActions = document.createElement('div');
            uploadActions.className = 'p-inline-panel__upload-actions';

            const uploadButton = document.createElement('button');
            uploadButton.type = 'button';
            uploadButton.className = 'p-inline-panel__btn p-inline-panel__upload-pick';
            uploadButton.textContent = 'Выбрать фото';
            uploadButton.addEventListener('click', () => fileInput.click());
            uploadActions.appendChild(uploadButton);
            uploadZone.appendChild(uploadActions);

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
                ? `Фото ${imageNavigation.index + 1} из ${imageNavigation.total} — стрелки ← → листают соседние. Ниже подпись и описание для поисковиков.`
                : 'Ниже можно добавить подпись (видна посетителям) и описание для поисковиков.';
            ui.panelForm.appendChild(imageHint);

        }

        if (binding.type === 'object') {
            const editorFields = getBindingEditorFields(binding);
            if (!isActionLikeObjectBinding(binding, editorFields)) {
                const preview = createObjectCardPreview(binding, value);
                ui.panelForm.appendChild(preview);
            }
        }

        appendFocusedFieldSections(binding, value, fieldSections, options.focusField || '');

        if (binding.type === 'object') {
            appendObjectQuickActions(binding, value);
        }

        const collectionState = getBindingCollectionState(binding);
        const shouldShowCollectionControls = collectionState
            && (binding.type === 'image' || binding.type === 'object' || binding.type === 'text')
            && !(binding.type === 'object' && isActionLikeObjectBinding(binding, editorFields));
        if (shouldShowCollectionControls) {
            appendCollectionControls(binding, collectionState);
        }

        if (binding.type !== 'image') {
            const firstControl = (options.focusField
                ? ui.panelForm.querySelector(`[name="${options.focusField}"]`)
                : null)
                || ui.panelForm.querySelector('textarea, select, input:not([type="file"]):not([type="hidden"])');
            if (firstControl) {
                window.setTimeout(() => {
                    firstControl.focus();
                    if (firstControl instanceof HTMLInputElement || firstControl instanceof HTMLTextAreaElement) {
                        firstControl.setSelectionRange?.(firstControl.value.length, firstControl.value.length);
                    }
                }, 0);
            }
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

    function pulseBindingElements(binding, elements = binding?.elements || []) {
        (Array.isArray(elements) ? elements : [elements]).forEach((element) => {
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
        if (!OVERVIEW_ENABLED || !state.panelReturnToOverview) return;
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
                showToast('Сначала откройте /admin/ и выполните вход.');
                return;
            }

            if (!ui.panel.hidden && state.activeBindingId && state.activeBindingId !== binding.id) {
                if (!confirmDiscardPanelChanges()) {
                    return;
                }
                restoreActiveBindingPreview();
            }

            const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
            const storedValue = getByPath(fileState.data, binding.path);
            const value = storedValue === undefined
                ? resolveBindingDefault(binding)
                : cloneData(storedValue);
            const focusTarget = options.targetElement instanceof HTMLElement
                ? options.targetElement
                : null;
            const shouldInferFocusField = Boolean(focusTarget && !binding.elements.includes(focusTarget));
            const focusField = options.focusField || (shouldInferFocusField
                ? inferFocusedFieldKey(binding, value, focusTarget)
                : '');
            const activeElements = focusTarget && focusTarget.isConnected
                ? [focusTarget]
                : binding.elements;

            const shouldReturnToOverview = OVERVIEW_ENABLED && (typeof options.fromOverview === 'boolean'
                ? options.fromOverview
                : (ui.panel.hidden ? state.overviewOpen : state.panelReturnToOverview));

            state.panelReturnToOverview = shouldReturnToOverview;
            state.overviewOpen = false;
            state.activeBindingId = binding.id;
            clearHoverMarks();
            const highlightedElements = setActiveMarks(binding, activeElements);
            revealBindingElement(highlightedElements[0] || binding.elements[0]);
            pulseBindingElements(binding, highlightedElements);

            fillPanel(binding, value, { focusField });
            ui.panel.hidden = false;
            rememberEditingContext(binding);
            renderToolbar();
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
        const objectUrl = URL.createObjectURL(file);
        if (previewImage) {
            previewImage.src = objectUrl;
            previewImage.onload = () => {
                const w = previewImage.naturalWidth;
                const h = previewImage.naturalHeight;
                if (w < 800 || h < 600) {
                    showToast(`Фото маловато (${w}×${h} пкс) — может выглядеть размыто. Лучше от 800×600.`);
                }
                URL.revokeObjectURL(objectUrl);
            };
        }
        if (fileBadge) {
            const sizeKb = Math.max(1, Math.round((file.size || 0) / 1024));
            const sizeMb = (file.size || 0) / (1024 * 1024);
            const sizeWarning = sizeMb > 2 ? ` ⚠ Файл крупный (${sizeMb.toFixed(1)} МБ)` : '';
            fileBadge.textContent = `${file.name} · ${sizeKb} КБ${sizeWarning}`;
            fileBadge.hidden = false;
        }
        if ((file.size || 0) > 3 * 1024 * 1024) {
            showToast(`Файл ${(file.size / 1024 / 1024).toFixed(1)} МБ — рекомендуем уменьшить до 2 МБ перед загрузкой.`);
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

    function getPanelStatusState(binding) {
        const hasPending = hasPendingPanelChanges();
        const hasSavedDifference = hasSavedDifferenceForBinding(binding);
        const hasUnsaved = hasPending || hasDirtyFiles();

        if (hasPending) {
            return {
                tone: 'is-draft',
                badge: 'Черновик',
                title: 'Предпросмотр уже виден на странице',
                meta: 'Изменения пока не сохранены. Если нравится результат, нажмите «Сохранить» в тёмной панели.'
            };
        }

        if (hasSavedDifference) {
            return {
                tone: 'is-pending',
                badge: 'Не сохранено',
                title: 'Этот блок уже обновлён на странице',
                meta: 'Новая версия уже в предпросмотре, но на сайте ещё не закреплена. Нажмите «Сохранить» в тёмной панели.'
            };
        }

        if (hasUnsaved) {
            return {
                tone: 'is-other',
                badge: 'Есть правки',
                title: 'В этом блоке сейчас без новых черновиков',
                meta: 'Но на странице есть другие несохранённые изменения. Когда закончите, нажмите «Сохранить» в тёмной панели.'
            };
        }

        return {
            tone: 'is-ready',
            badge: 'Готово',
            title: 'Можно спокойно редактировать этот блок',
            meta: 'Изменения сначала попадут в черновик. Потом нажмите «Сохранить» в тёмной панели.'
        };
    }

    function getCompactPanelStatusLabel(binding) {
        const status = getPanelStatusState(binding);
        if (!status || status.tone === 'is-ready') return '';
        return status.badge || '';
    }

    function updatePanelStatus(binding) {
        void binding;
        if (!ui.panelStatus) return;
        ui.panelStatus.hidden = true;
    }

    function updatePanelMeta(binding) {
        if (!ui.panelMeta || !binding) return;
        const hasPending = hasPendingPanelChanges();
        const hasSavedDifference = hasSavedDifferenceForBinding(binding);
        const sectionLabel = binding.sectionLabel || binding.fileName;
        const focusField = state.panelFocusField
            ? getBindingEditorFields(binding).find((field) => field.key === state.panelFocusField)
            : null;
        const metaParts = [];
        if (focusField) {
            metaParts.push(`Точечная правка: ${focusField.label || focusField.key}`);
        }
        metaParts.push(`Раздел: ${sectionLabel}`);

        const compactStatus = getCompactPanelStatusLabel(binding);
        if (compactStatus) {
            metaParts.push(compactStatus);
        }

        ui.panelMeta.textContent = metaParts.join(' · ');
        updatePanelStatus(binding);
        let hasVisibleAction = false;
        if (ui.panelRevertBtn) {
            const canRevert = canRevertBinding(binding);
            ui.panelRevertBtn.hidden = !canRevert;
            ui.panelRevertBtn.disabled = !(hasPending || hasSavedDifference);
            ui.panelRevertBtn.classList.toggle('is-active', hasPending || hasSavedDifference);
            ui.panelRevertBtn.classList.toggle('is-idle', !hasPending && !hasSavedDifference);
            hasVisibleAction = hasVisibleAction || canRevert;
        }
        if (ui.panelRemoveBtn) {
            const collectionState = getBindingCollectionState(binding);
            const nouns = getCollectionItemNouns(binding);
            const canRemove = Boolean(collectionState && collectionState.total > 1);
            ui.panelRemoveBtn.hidden = !canRemove;
            ui.panelRemoveBtn.disabled = !canRemove;
            ui.panelRemoveBtn.textContent = canRemove ? nouns.remove : 'Убрать';
            hasVisibleAction = hasVisibleAction || canRemove;
        }
        if (ui.panelApplyBtn) {
            const canApply = canSaveInline();
            if (!canApply) {
                ui.panelApplyBtn.hidden = true;
                ui.panelApplyBtn.disabled = true;
                ui.panelApplyBtn.classList.remove('is-active', 'is-idle');
            } else {
                const hasSomethingToSave = hasPending || hasDirtyFiles();
                ui.panelApplyBtn.hidden = true;
                ui.panelApplyBtn.disabled = !hasSomethingToSave;
                ui.panelApplyBtn.textContent = 'Сохранить';
                ui.panelApplyBtn.classList.remove('is-active', 'is-idle');
            }
        }
        if (ui.panelActions) {
            ui.panelActions.hidden = !hasVisibleAction;
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
        const binding = state.bindingMap.get(state.activeBindingId);
        if (!binding) return;
        const fileState = await ensureFileState(binding.fileName, binding.sectionLabel);
        const collectionState = getBindingCollectionState(binding, fileState);
        if (!collectionState || collectionState.total < 2) {
            showToast(getCollectionToastLabels(binding).onlyOne);
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

        await moveBindingToCollectionIndex(binding, nextIndex);
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
            const collectionState = getBindingCollectionState(binding, fileState);

            if (collectionState) {
                const originalItems = getByPath(fileState.originalData, collectionState.collectionPath);
                const restoredItems = originalItems === undefined ? [] : cloneData(originalItems);
                setByPath(fileState.data, collectionState.collectionPath, restoredItems);
                refreshCollectionBindings(binding, fileState);

                const collectionPattern = new RegExp(`^${escapeRegExp(collectionState.collectionPath)}\\.\\d+$`);
                state.bindings.forEach((item) => {
                    if (item.fileName === binding.fileName && collectionPattern.test(item.path)) {
                        item.elements.forEach((element) => element.classList.remove(DIRTY_CLASS));
                    }
                });

                fileState.dirty = !isSameData(fileState.data, fileState.originalData);
                if (!fileState.dirty) {
                    state.lastSavedAt = 0;
                }
                persistDraftFiles();

                const restoredIndex = Math.min(collectionState.index, Math.max(0, restoredItems.length - 1));
                const nextBinding = findBinding(binding.fileName, `${collectionState.collectionPath}.${restoredIndex}`) || binding;
                state.activeBindingId = nextBinding.id;
                clearActiveMarks();
                nextBinding.elements.forEach((element) => element.classList.add(ACTIVE_CLASS));
                if (!ui.panel.hidden) {
                    fillPanel(nextBinding, resolveBindingValue(fileState, nextBinding));
                }
                renderToolbar();
                renderOverviewPanel();
                showToast(`Возвращено: ${truncateInlineLabel(binding.label, 44)}`);
                return;
            }

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
        if (ui.panel?.contains(event.target) || ui.root?.contains(event.target) || ui.overview?.contains(event.target) || ui.iconModal?.contains(event.target)) return;

        const context = resolveInlineInteractionContext(event.target);
        if (!context) {
            if (state.overviewOpen) {
                toggleOverview(false);
            }
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        openBinding(context.binding.id, { targetElement: context.focusElement });
    }

    function showHoverLabel(target, binding = null) {
        if (!HOVER_LABEL_ENABLED || !ui.hover || !state.enabled || !target) return;
        const rect = target.getBoundingClientRect();
        const activeBinding = binding || state.bindingMap.get(
            target.dataset.inlineEditId
            || target.closest?.('[data-inline-edit-id]')?.dataset.inlineEditId
            || ''
        );
        const kind = getBindingKindLabel(activeBinding).replace(/ на странице$/i, '');
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
        if (!HOVER_LABEL_ENABLED || !ui.hover) return;
        ui.hover.hidden = true;
    }

    function handlePointerMove(event) {
        if (!state.enabled) {
            clearHoverMarks();
            return;
        }

        if (ui.panel?.contains(event.target) || ui.root?.contains(event.target) || ui.overview?.contains(event.target)) {
            clearHoverMarks();
            return;
        }

        const context = resolveInlineInteractionContext(event.target);
        if (!context) {
            clearHoverMarks();
            return;
        }

        applyHoverMarks(context);
        showHoverLabel(context.focusElement || context.bindingTarget, context.binding);
    }

    function handleKeydown(event) {
        if (event.key === 'Escape' && ui.authModal && !ui.authModal.hidden) {
            event.preventDefault();
            closeAuthModal();
            return;
        }

        if (!state.enabled) return;
        const target = event.target;
        const isTypingTarget = target instanceof HTMLInputElement
            || target instanceof HTMLTextAreaElement
            || target instanceof HTMLSelectElement
            || Boolean(target?.closest?.('[contenteditable="true"]'));

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            if (OVERVIEW_ENABLED) {
                event.preventDefault();
                if (!state.overviewOpen) {
                    state.overviewFocus = hasDirtyBindings() ? 'dirty' : 'all';
                }
                toggleOverview(true);
                return;
            }
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            saveDirtyFiles();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !ui.panel.hidden) {
            event.preventDefault();
            saveDirtyFiles();
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

        if (ui.iconModal && !ui.iconModal.hidden) {
            event.preventDefault();
            closeIconModal();
            return;
        }

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

        ui.sessionBtn?.addEventListener('click', async () => {
            if (state.authEnabled && state.authenticated) {
                await logoutInline();
                return;
            }
            openAuthModal();
        });

        ui.adminBtn?.addEventListener('click', () => {
            window.open(getLauncherHref(), '_blank', 'noopener');
        });

        ui.root.querySelector('[data-inline-action="overview"]')?.addEventListener('click', () => {
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
        ui.panelRevertBtn?.addEventListener('click', () => {
            revertActiveBindingToSaved();
        });
        ui.panelRemoveBtn?.addEventListener('click', () => {
            removeActiveBindingFromCollection();
        });
        ui.panelApplyBtn?.addEventListener('click', () => {
            saveDirtyFiles();
        });
        ui.panel.addEventListener('click', handlePanelClick);
        ui.panelForm.addEventListener('input', () => {
            const binding = state.bindingMap.get(state.activeBindingId);
            if (binding) {
                updateLiveBindingPreview(binding);
                updatePanelActionPreview();
                updatePanelMeta(binding);
                renderToolbar();
            }
        });
        ui.panelForm.addEventListener('change', () => {
            const binding = state.bindingMap.get(state.activeBindingId);
            if (binding) {
                updateLiveBindingPreview(binding);
                updatePanelActionPreview();
                updatePanelMeta(binding);
                renderToolbar();
            }
        });
        ui.iconModal?.addEventListener('click', (event) => {
            if (event.target?.matches?.('[data-inline-icon-modal-close]')) {
                closeIconModal();
            }
        });
        ui.iconModal?.querySelector('.p-inline-icon-modal__close')?.addEventListener('click', closeIconModal);
        ui.iconModalSearch?.addEventListener('input', renderIconModalOptions);
        ui.iconModalClear?.addEventListener('click', () => {
            const context = state.activeIconPicker;
            if (!context) return;
            applyIconChoice(context.control, context.updateActiveState, '', { closeModal: true });
        });
        ui.authModal?.addEventListener('click', (event) => {
            if (event.target?.matches?.('[data-inline-auth-close]')) {
                closeAuthModal();
            }
        });
        ui.authModal?.querySelector('.p-inline-auth-modal__close')?.addEventListener('click', closeAuthModal);
        ui.authForm?.addEventListener('submit', submitAuthForm);
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
        if (HOVER_LABEL_ENABLED) {
            document.addEventListener('pointermove', handlePointerMove, true);
            window.addEventListener('scroll', hideHoverLabel, true);
        }
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('paste', handlePaste, true);
        window.addEventListener('resize', () => {
            if (HOVER_LABEL_ENABLED) {
                hideHoverLabel();
            }
            updateDockOffset();
        });
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
