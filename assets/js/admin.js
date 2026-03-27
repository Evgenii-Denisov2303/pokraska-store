(function() {
    function createDirectionSchema(key, label) {
        return {
            key,
            type: 'group',
            label,
            fields: [
                { key: 'mediaTags', type: 'array', label: 'Теги над фото', itemLabel: 'Тег', itemType: 'text' },
                { key: 'eyebrow', type: 'text', label: 'Надзаголовок' },
                { key: 'title', type: 'text', label: 'Заголовок' },
                { key: 'lead', type: 'textarea', label: 'Основной текст' },
                {
                    key: 'facts',
                    type: 'array',
                    label: 'Акцентные факты',
                    itemLabel: 'Факт',
                    itemType: 'object',
                    fields: [
                        { key: 'value', type: 'text', label: 'Акцент' },
                        { key: 'text', type: 'text', label: 'Пояснение' }
                    ]
                },
                {
                    key: 'items',
                    type: 'array',
                    label: 'Карточки внутри блока',
                    itemLabel: 'Карточка',
                    itemType: 'object',
                    fields: [
                        { key: 'title', type: 'text', label: 'Заголовок' },
                        { key: 'text', type: 'textarea', label: 'Описание' },
                        { key: 'href', type: 'text', label: 'Ссылка' },
                        { key: 'arrowLabel', type: 'text', label: 'Подпись ссылки' }
                    ]
                },
                { key: 'trust', type: 'textarea', label: 'Нижняя доверительная строка' },
                createActionArraySchema('actions', 'Кнопки'),
                {
                    key: 'slides',
                    type: 'array',
                    label: 'Слайды',
                    itemLabel: 'Слайд',
                    itemType: 'object',
                    fields: [
                        { key: 'src', type: 'text', label: 'Путь к фото' },
                        { key: 'alt', type: 'text', label: 'Alt' },
                        { key: 'caption', type: 'text', label: 'Подпись' },
                        { key: 'width', type: 'number', label: 'Ширина' },
                        { key: 'height', type: 'number', label: 'Высота' }
                    ]
                }
            ]
        };
    }

    function createActionArraySchema(key, label) {
        return {
            key,
            type: 'array',
            label,
            itemLabel: 'Кнопка',
            itemType: 'object',
            fields: [
                { key: 'label', type: 'text', label: 'Текст' },
                { key: 'href', type: 'text', label: 'Ссылка' },
                { key: 'icon', type: 'text', label: 'Иконка' },
                { key: 'style', type: 'text', label: 'Стиль (primary/secondary)' }
            ]
        };
    }

    function createButtonGroupSchema(key, label) {
        return {
            key,
            type: 'group',
            label,
            fields: [
                { key: 'label', type: 'text', label: 'Текст' },
                { key: 'href', type: 'text', label: 'Ссылка' },
                { key: 'icon', type: 'text', label: 'Иконка' }
            ]
        };
    }

    function createCatalogInfoCardsField(key = 'cards', label = 'Информационные карточки') {
        return {
            key,
            type: 'array',
            label,
            itemLabel: 'Карточка',
            itemType: 'object',
            fields: [
                { key: 'title', type: 'text', label: 'Заголовок карточки' },
                {
                    key: 'items',
                    type: 'array',
                    label: 'Пункты списка',
                    itemLabel: 'Пункт',
                    itemType: 'text'
                }
            ]
        };
    }

    function createCatalogFaqField() {
        return {
            key: 'faq',
            type: 'group',
            label: 'Вопросы и ответы',
            startCollapsed: true,
            fields: [
                { key: 'title', type: 'text', label: 'Заголовок блока вопросов' },
                { key: 'subtitle', type: 'textarea', label: 'Пояснение над вопросами' },
                {
                    key: 'items',
                    type: 'array',
                    label: 'Вопросы',
                    itemLabel: 'Вопрос',
                    itemType: 'object',
                    fields: [
                        { key: 'question', type: 'text', label: 'Вопрос' },
                        { key: 'answer', type: 'textarea', label: 'Ответ' }
                    ]
                }
            ]
        };
    }

    function createCatalogPaletteField() {
        return {
            key: 'palette',
            type: 'group',
            label: 'Блок палитры / цвета',
            startCollapsed: true,
            fields: [
                { key: 'title', type: 'text', label: 'Заголовок' },
                { key: 'text', type: 'textarea', label: 'Описание' },
                {
                    key: 'items',
                    type: 'array',
                    label: 'Пункты',
                    itemLabel: 'Пункт',
                    itemType: 'text'
                },
                { key: 'actionLabel', type: 'text', label: 'Текст кнопки' },
                { key: 'actionHref', type: 'text', label: 'Ссылка кнопки' },
                { key: 'note', type: 'textarea', label: 'Нижнее примечание' }
            ]
        };
    }

    function createCatalogStepsField() {
        return {
            key: 'steps',
            type: 'array',
            label: 'Шаги выбора',
            itemLabel: 'Шаг',
            itemType: 'object',
            fields: [
                { key: 'number', type: 'text', label: 'Номер' },
                { key: 'title', type: 'text', label: 'Заголовок' },
                { key: 'text', type: 'textarea', label: 'Описание' }
            ]
        };
    }

    function createCatalogProductsField() {
        return {
            key: 'products',
            type: 'array',
            label: 'Карточки товаров / комплектов',
            itemLabel: 'Карточка',
            itemType: 'object',
            allowAddRemove: false,
            allowReorder: false,
            startCollapsed: true,
            fields: [
                { key: 'meta', type: 'text', label: 'Мета-подпись' },
                { key: 'title', type: 'text', label: 'Заголовок' },
                { key: 'description', type: 'textarea', label: 'Описание' },
                {
                    key: 'specs',
                    type: 'array',
                    label: 'Характеристики',
                    itemLabel: 'Характеристика',
                    itemType: 'text'
                },
                { key: 'href', type: 'text', label: 'Ссылка карточки' },
                { key: 'cta', type: 'text', label: 'Текст кнопки' }
            ]
        };
    }

    function createCatalogSpecGroupsField() {
        return {
            key: 'specGroups',
            type: 'array',
            label: 'Блоки характеристик со схемами',
            itemLabel: 'Блок',
            itemType: 'object',
            allowAddRemove: false,
            allowReorder: false,
            startCollapsed: true,
            fields: [
                { key: 'title', type: 'text', label: 'Заголовок блока' },
                createCatalogInfoCardsField('cards', 'Карточки внутри блока')
            ]
        };
    }

    function createCatalogPanelSchema(key, label) {
        return {
            key,
            type: 'group',
            label,
            startCollapsed: true,
            fields: [
                { key: 'breadcrumb', type: 'text', label: 'Хлебные крошки' },
                { key: 'title', type: 'text', label: 'Заголовок панели' },
                { key: 'introTitle', type: 'text', label: 'Внутренний подзаголовок' },
                {
                    key: 'paragraphs',
                    type: 'array',
                    label: 'Абзацы до бейджей',
                    itemLabel: 'Абзац',
                    itemType: 'text'
                },
                {
                    key: 'badges',
                    type: 'array',
                    label: 'Бейджи',
                    itemLabel: 'Бейдж',
                    itemType: 'text'
                },
                {
                    key: 'tailParagraphs',
                    type: 'array',
                    label: 'Абзацы после бейджей',
                    itemLabel: 'Абзац',
                    itemType: 'text',
                    startCollapsed: true
                },
                createCatalogInfoCardsField(),
                createCatalogSpecGroupsField(),
                createCatalogFaqField(),
                createCatalogPaletteField(),
                createCatalogStepsField(),
                {
                    key: 'sectionHeading',
                    type: 'group',
                    label: 'Заголовок секции',
                    startCollapsed: true,
                    fields: [
                        { key: 'title', type: 'text', label: 'Заголовок' },
                        { key: 'text', type: 'textarea', label: 'Описание' }
                    ]
                },
                createCatalogProductsField(),
                {
                    key: 'cta',
                    type: 'group',
                    label: 'Нижний блок связи панели',
                    startCollapsed: true,
                    fields: [
                        { key: 'title', type: 'text', label: 'Заголовок' },
                        { key: 'text', type: 'textarea', label: 'Описание' }
                    ]
                }
            ]
        };
    }

    const contentConfigs = {
        dashboard: {
            label: 'С чего начать',
            description: 'Главный экран админки с готовыми действиями: что именно хотите поменять на сайте.',
            virtual: true,
            schema: {
                fields: []
            }
        },
        site: {
            label: 'Общие настройки',
            description: 'Шапка, контакты, навигация и футер на всех страницах сайта.',
            fileName: 'site',
            schema: {
                fields: [
                    {
                        key: 'brand',
                        type: 'group',
                        label: 'Бренд и подписи',
                        fields: [
                            { key: 'name', type: 'text', label: 'Название бренда' },
                            { key: 'tagline', type: 'text', label: 'Подпись в шапке' },
                            { key: 'logoAlt', type: 'text', label: 'Alt логотипа' },
                            { key: 'footerCaption', type: 'text', label: 'Подпись в футере' },
                            { key: 'copyrightStartYear', type: 'number', label: 'Год начала' },
                            { key: 'domain', type: 'text', label: 'Домен' }
                        ]
                    },
                    {
                        key: 'contact',
                        type: 'group',
                        label: 'Контакты',
                        fields: [
                            {
                                key: 'primaryPhone',
                                type: 'group',
                                label: 'Основной телефон',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Номер' },
                                    { key: 'href', type: 'text', label: 'Ссылка tel:' },
                                    { key: 'note', type: 'text', label: 'Подпись' }
                                ]
                            },
                            {
                                key: 'secondaryPhone',
                                type: 'group',
                                label: 'Второй телефон',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Номер' },
                                    { key: 'href', type: 'text', label: 'Ссылка tel:' },
                                    { key: 'note', type: 'text', label: 'Подпись' }
                                ]
                            },
                            { key: 'address', type: 'textarea', label: 'Адрес' },
                            { key: 'email', type: 'text', label: 'Email' },
                            { key: 'hours', type: 'text', label: 'Режим работы' },
                            {
                                key: 'telegram',
                                type: 'group',
                                label: 'Telegram',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Подпись' },
                                    { key: 'href', type: 'text', label: 'Ссылка' }
                                ]
                            },
                            {
                                key: 'max',
                                type: 'group',
                                label: 'Max',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Подпись' },
                                    { key: 'href', type: 'text', label: 'Ссылка' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'navigation',
                        type: 'array',
                        label: 'Пункты меню',
                        itemLabel: 'Пункт меню',
                        itemType: 'object',
                        fields: [
                            { key: 'label', type: 'text', label: 'Название' },
                            { key: 'href', type: 'text', label: 'Ссылка' },
                            { key: 'icon', type: 'text', label: 'Класс иконки' }
                        ]
                    },
                    {
                        key: 'footer',
                        type: 'group',
                        label: 'Футер',
                        fields: [
                            { key: 'companyTitle', type: 'text', label: 'Заголовок компании' },
                            { key: 'companyParagraphs', type: 'array', label: 'Абзацы о компании', itemLabel: 'Абзац', itemType: 'text' },
                            { key: 'usefulTitle', type: 'text', label: 'Заголовок полезных ссылок' },
                            {
                                key: 'usefulLinks',
                                type: 'array',
                                label: 'Полезные ссылки',
                                itemLabel: 'Ссылка',
                                itemType: 'object',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Подпись' },
                                    { key: 'href', type: 'text', label: 'Ссылка' }
                                ]
                            },
                            { key: 'policyLabel', type: 'text', label: 'Подпись политики' },
                            { key: 'policyHref', type: 'text', label: 'Ссылка на политику' }
                        ]
                    }
                ]
            }
        },
        home: {
            label: 'Главная страница',
            description: 'Первый экран, основные направления, процесс, доверие и форма заявки.',
            fileName: 'home',
            schema: {
                fields: [
                    {
                        key: 'hero',
                        type: 'group',
                        label: 'Первый экран',
                        fields: [
                            { key: 'titleMain', type: 'text', label: 'Главный заголовок' },
                            { key: 'titleSub', type: 'text', label: 'Подзаголовок' },
                            { key: 'subtitleStrong', type: 'text', label: 'Сильная подпись' },
                            { key: 'bulletPoints', type: 'array', label: 'Короткий список услуг', itemLabel: 'Пункт', itemType: 'text' },
                            {
                                key: 'features',
                                type: 'array',
                                label: 'Преимущества',
                                itemLabel: 'Преимущество',
                                itemType: 'object',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'text', type: 'text', label: 'Текст' }
                                ]
                            },
                            {
                                key: 'primaryAction',
                                type: 'group',
                                label: 'Главная кнопка',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Текст кнопки' },
                                    { key: 'href', type: 'text', label: 'Ссылка' },
                                    { key: 'icon', type: 'text', label: 'Иконка' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'directions',
                        type: 'group',
                        label: 'Основные направления',
                        fields: [
                            { key: 'sectionTitle', type: 'text', label: 'Заголовок секции' },
                            { key: 'sectionSubtitle', type: 'textarea', label: 'Подзаголовок секции' },
                            createDirectionSchema('gates', 'Каталог ворот и заборов'),
                            createDirectionSchema('coating', 'Порошковая покраска')
                        ]
                    },
                    {
                        key: 'process',
                        type: 'group',
                        label: 'Как мы работаем',
                        fields: [
                            { key: 'eyebrow', type: 'text', label: 'Надзаголовок' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' },
                            {
                                key: 'facts',
                                type: 'array',
                                label: 'Факты',
                                itemLabel: 'Факт',
                                itemType: 'object',
                                fields: [
                                    { key: 'value', type: 'text', label: 'Акцент' },
                                    { key: 'text', type: 'text', label: 'Пояснение' }
                                ]
                            },
                            {
                                key: 'steps',
                                type: 'array',
                                label: 'Шаги',
                                itemLabel: 'Шаг',
                                itemType: 'object',
                                fields: [
                                    { key: 'number', type: 'text', label: 'Номер' },
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' }
                                ]
                            },
                            createActionArraySchema('actions', 'Кнопки')
                        ]
                    },
                    {
                        key: 'trust',
                        type: 'group',
                        label: 'Почему выбирают нас',
                        fields: [
                            { key: 'eyebrow', type: 'text', label: 'Надзаголовок' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' },
                            {
                                key: 'highlights',
                                type: 'array',
                                label: 'Акцентные факты',
                                itemLabel: 'Факт',
                                itemType: 'object',
                                fields: [
                                    { key: 'value', type: 'text', label: 'Акцент' },
                                    { key: 'text', type: 'text', label: 'Пояснение' }
                                ]
                            },
                            {
                                key: 'cards',
                                type: 'array',
                                label: 'Карточки преимуществ',
                                itemLabel: 'Карточка',
                                itemType: 'object',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'request',
                        type: 'group',
                        label: 'Форма заявки',
                        fields: [
                            { key: 'eyebrow', type: 'text', label: 'Надзаголовок' },
                            { key: 'titleHtml', type: 'textarea', label: 'Заголовок HTML' },
                            { key: 'lead', type: 'textarea', label: 'Подзаголовок' },
                            {
                                key: 'facts',
                                type: 'array',
                                label: 'Факты',
                                itemLabel: 'Факт',
                                itemType: 'object',
                                fields: [
                                    { key: 'value', type: 'text', label: 'Акцент' },
                                    { key: 'text', type: 'text', label: 'Пояснение' }
                                ]
                            },
                            { key: 'advantages', type: 'array', label: 'Чек-лист услуг', itemLabel: 'Пункт', itemType: 'text' },
                            { key: 'contactTitle', type: 'text', label: 'Заголовок контактов' },
                            { key: 'contactIntro', type: 'textarea', label: 'Вводный текст контактов' },
                            {
                                key: 'contactLines',
                                type: 'array',
                                label: 'Строки контактов',
                                itemLabel: 'Контакт',
                                itemType: 'object',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'label', type: 'text', label: 'Текст' },
                                    { key: 'href', type: 'text', label: 'Ссылка' },
                                    { key: 'note', type: 'text', label: 'Примечание' }
                                ]
                            },
                            { key: 'formEyebrow', type: 'text', label: 'Надзаголовок формы' },
                            { key: 'formTitle', type: 'text', label: 'Заголовок формы' },
                            { key: 'formNotice', type: 'textarea', label: 'Описание формы' },
                            {
                                key: 'quickActions',
                                type: 'array',
                                label: 'Быстрые кнопки',
                                itemLabel: 'Кнопка',
                                itemType: 'object',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Подпись' },
                                    { key: 'href', type: 'text', label: 'Ссылка' },
                                    { key: 'icon', type: 'text', label: 'Иконка' }
                                ]
                            },
                            { key: 'iframeSrc', type: 'text', label: 'Ссылка на встроенную форму' }
                        ]
                    }
                ]
            }
        },
        catalog: {
            label: 'Каталог',
            description: 'Группы каталога, подписи разделов, бренды и нижний блок связи страницы каталога.',
            fileName: 'catalog',
            schema: {
                fields: [
                    { key: 'pageTitle', type: 'text', label: 'Скрытый заголовок страницы' },
                    {
                        key: 'groups',
                        type: 'array',
                        label: 'Группы каталога',
                        itemLabel: 'Группа',
                        itemType: 'object',
                        fields: [
                            { key: 'key', type: 'text', label: 'Ключ группы' },
                            { key: 'icon', type: 'text', label: 'Иконка' },
                            { key: 'eyebrow', type: 'text', label: 'Надпись' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'text', type: 'textarea', label: 'Описание' },
                            {
                                key: 'links',
                                type: 'array',
                                label: 'Ссылки в группе',
                                itemLabel: 'Ссылка',
                                itemType: 'object',
                                fields: [
                                    { key: 'panelId', type: 'text', label: 'ID вкладки' },
                                    { key: 'label', type: 'text', label: 'Подпись' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'partners',
                        type: 'group',
                        label: 'Бренды',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' }
                        ]
                    },
                    {
                        key: 'cta',
                        type: 'group',
                        label: 'Нижний блок связи',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'text', type: 'textarea', label: 'Описание' },
                            {
                                key: 'contacts',
                                type: 'array',
                                label: 'Контакты',
                                itemLabel: 'Контакт',
                                itemType: 'object',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'label', type: 'text', label: 'Подпись' },
                                    { key: 'href', type: 'text', label: 'Ссылка' }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        catalogPanels: {
            label: 'Каталог: карточки',
            description: 'Тексты и блоки внутренних карточек каталога: описания, списки, цвета, вопросы и нижние призывы.',
            fileName: 'catalog-panels',
            schema: {
                fields: [
                    createCatalogPanelSchema('sliding', 'Откатные ворота'),
                    createCatalogPanelSchema('slidingFrame', 'Каркас откатных ворот'),
                    createCatalogPanelSchema('swing', 'Распашные ворота'),
                    createCatalogPanelSchema('swingFrame', 'Каркас распашных ворот'),
                    createCatalogPanelSchema('wicket', 'Калитки'),
                    createCatalogPanelSchema('fenceProfnastil', 'Заборы из профнастила'),
                    createCatalogPanelSchema('fenceSiding', 'Заборы из металлосайдинга'),
                    createCatalogPanelSchema('fencePicket', 'Заборы из металлоштакетника'),
                    createCatalogPanelSchema('fenceLouver', 'Заборы жалюзи'),
                    createCatalogPanelSchema('sectional', 'Секционные гаражные ворота'),
                    createCatalogPanelSchema('roller', 'Рольворота'),
                    createCatalogPanelSchema('shutters', 'Рольставни'),
                    createCatalogPanelSchema('automationSliding', 'Автоматика для откатных ворот'),
                    createCatalogPanelSchema('automationSwing', 'Автоматика для распашных ворот'),
                    createCatalogPanelSchema('automationComponents', 'Аксессуары и комплектующие'),
                    createCatalogPanelSchema('grilles', 'Металлические раздвижные решетки')
                ]
            }
        },
        servicePages: {
            label: 'Услуги покраски и пескоструя',
            description: 'Заголовки, навигация, карточки, вопросы и ответы и нижние блоки связи для порошковой покраски и пескоструйной обработки.',
            fileName: 'service-pages',
            schema: {
                fields: [
                    {
                        key: 'powderCoating',
                        type: 'group',
                        label: 'Порошковая покраска',
                        fields: [
                            {
                                key: 'header',
                                type: 'group',
                                label: 'Шапка страницы',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' }
                                ]
                            },
                            {
                                key: 'quickNav',
                                type: 'array',
                                label: 'Быстрые ссылки',
                                itemLabel: 'Ссылка',
                                itemType: 'object',
                                fields: [
                                    { key: 'id', type: 'text', label: 'ID секции' },
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'label', type: 'text', label: 'Подпись' }
                                ]
                            },
                            {
                                key: 'sections',
                                type: 'array',
                                label: 'Карточки услуг',
                                itemLabel: 'Услуга',
                                itemType: 'object',
                                fields: [
                                    { key: 'id', type: 'text', label: 'ID секции' },
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'badge', type: 'text', label: 'Плашка' },
                                    { key: 'description', type: 'textarea', label: 'Описание' },
                                    { key: 'advantagesTitle', type: 'text', label: 'Заголовок преимуществ' },
                                    { key: 'advantagesIcon', type: 'text', label: 'Иконка преимуществ' },
                                    {
                                        key: 'advantages',
                                        type: 'array',
                                        label: 'Преимущества',
                                        itemLabel: 'Преимущество',
                                        itemType: 'object',
                                        fields: [
                                            { key: 'icon', type: 'text', label: 'Иконка' },
                                            { key: 'text', type: 'textarea', label: 'Текст' }
                                        ]
                                    },
                                    {
                                        key: 'processSteps',
                                        type: 'array',
                                        label: 'Шаги процесса',
                                        itemLabel: 'Шаг',
                                        itemType: 'object',
                                        fields: [
                                            { key: 'title', type: 'text', label: 'Заголовок' },
                                            { key: 'text', type: 'textarea', label: 'Описание' }
                                        ]
                                    },
                                    {
                                        key: 'paletteCard',
                                        type: 'group',
                                        label: 'Карточка палитры',
                                        fields: [
                                            { key: 'title', type: 'text', label: 'Заголовок' },
                                            { key: 'icon', type: 'text', label: 'Иконка' },
                                            { key: 'text', type: 'textarea', label: 'Описание' },
                                            { key: 'points', type: 'array', label: 'Пункты', itemLabel: 'Пункт', itemType: 'text' },
                                            createButtonGroupSchema('action', 'Кнопка')
                                        ]
                                    }
                                ]
                            },
                            {
                                key: 'cta',
                                type: 'group',
                                label: 'Нижний блок связи',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' },
                                    createButtonGroupSchema('action', 'Главная кнопка'),
                                    {
                                        key: 'phones',
                                        type: 'array',
                                        label: 'Телефоны',
                                        itemLabel: 'Телефон',
                                        itemType: 'object',
                                        fields: [
                                            { key: 'label', type: 'text', label: 'Номер' },
                                            { key: 'href', type: 'text', label: 'Ссылка' }
                                        ]
                                    }
                                ]
                            },
                            {
                                key: 'faq',
                                type: 'group',
                                label: 'Вопросы и ответы',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' },
                                    {
                                        key: 'items',
                                        type: 'array',
                                        label: 'Вопросы',
                                        itemLabel: 'Вопрос',
                                        itemType: 'object',
                                        fields: [
                                            { key: 'question', type: 'text', label: 'Вопрос' },
                                            { key: 'answer', type: 'textarea', label: 'Ответ' }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'sandblasting',
                        type: 'group',
                        label: 'Пескоструйная обработка',
                        fields: [
                            {
                                key: 'header',
                                type: 'group',
                                label: 'Шапка страницы',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' }
                                ]
                            },
                            {
                                key: 'quickNav',
                                type: 'array',
                                label: 'Быстрые ссылки',
                                itemLabel: 'Ссылка',
                                itemType: 'object',
                                fields: [
                                    { key: 'id', type: 'text', label: 'ID секции' },
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'label', type: 'text', label: 'Подпись' }
                                ]
                            },
                            {
                                key: 'beforeAfter',
                                type: 'group',
                                label: 'Блок до / после',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' },
                                    { key: 'note', type: 'text', label: 'Подпись' }
                                ]
                            },
                            {
                                key: 'sections',
                                type: 'array',
                                label: 'Карточки услуг',
                                itemLabel: 'Услуга',
                                itemType: 'object',
                                fields: [
                                    { key: 'id', type: 'text', label: 'ID секции' },
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'badge', type: 'text', label: 'Плашка' },
                                    { key: 'description', type: 'textarea', label: 'Описание' },
                                    { key: 'advantagesTitle', type: 'text', label: 'Заголовок преимуществ' },
                                    { key: 'advantagesIcon', type: 'text', label: 'Иконка преимуществ' },
                                    {
                                        key: 'advantages',
                                        type: 'array',
                                        label: 'Преимущества',
                                        itemLabel: 'Преимущество',
                                        itemType: 'object',
                                        fields: [
                                            { key: 'icon', type: 'text', label: 'Иконка' },
                                            { key: 'text', type: 'textarea', label: 'Текст' }
                                        ]
                                    }
                                ]
                            },
                            {
                                key: 'cta',
                                type: 'group',
                                label: 'Нижний блок связи',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' },
                                    createButtonGroupSchema('action', 'Главная кнопка'),
                                    {
                                        key: 'phones',
                                        type: 'array',
                                        label: 'Телефоны',
                                        itemLabel: 'Телефон',
                                        itemType: 'object',
                                        fields: [
                                            { key: 'label', type: 'text', label: 'Номер' },
                                            { key: 'href', type: 'text', label: 'Ссылка' }
                                        ]
                                    }
                                ]
                            },
                            {
                                key: 'faq',
                                type: 'group',
                                label: 'Вопросы и ответы',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' },
                                    {
                                        key: 'items',
                                        type: 'array',
                                        label: 'Вопросы',
                                        itemLabel: 'Вопрос',
                                        itemType: 'object',
                                        fields: [
                                            { key: 'question', type: 'text', label: 'Вопрос' },
                                            { key: 'answer', type: 'textarea', label: 'Ответ' }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'sharedCta',
                        type: 'group',
                        label: 'Общие кнопки карточек',
                        fields: [
                            createButtonGroupSchema('primary', 'Главная кнопка'),
                            createButtonGroupSchema('secondary', 'Вторичная кнопка')
                        ]
                    }
                ]
            }
        },
        automation: {
            label: 'Автоматика',
            description: 'Страница автоматики для распашных ворот, комплектующие и карточки отдельных товаров.',
            fileName: 'automation',
            schema: {
                fields: [
                    {
                        key: 'swingLanding',
                        type: 'group',
                        label: 'Автоматика для распашных ворот',
                        fields: [
                            {
                                key: 'hero',
                                type: 'group',
                                label: 'Первый экран',
                                fields: [
                                    { key: 'breadcrumbs', type: 'text', label: 'Хлебные крошки' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'subtitle', type: 'textarea', label: 'Описание' }
                                ]
                            },
                            {
                                key: 'listingHeader',
                                type: 'group',
                                label: 'Заголовок карточек',
                                fields: [
                                    { key: 'breadcrumbs', type: 'text', label: 'Хлебные крошки' },
                                    { key: 'title', type: 'text', label: 'Заголовок' }
                                ]
                            },
                            {
                                key: 'products',
                                type: 'array',
                                label: 'Карточки комплектов',
                                itemLabel: 'Комплект',
                                itemType: 'object',
                                fields: [
                                    { key: 'meta', type: 'text', label: 'Подпись' },
                                    { key: 'title', type: 'text', label: 'Название' },
                                    { key: 'description', type: 'textarea', label: 'Описание' },
                                    { key: 'specs', type: 'array', label: 'Характеристики', itemLabel: 'Пункт', itemType: 'text' },
                                    createButtonGroupSchema('cta', 'Кнопка карточки')
                                ]
                            },
                            {
                                key: 'guide',
                                type: 'group',
                                label: 'Блок подбора',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'intro', type: 'textarea', label: 'Вводный текст' },
                                    { key: 'list', type: 'array', label: 'Список', itemLabel: 'Пункт', itemType: 'text' },
                                    { key: 'subheading', type: 'text', label: 'Подзаголовок' },
                                    { key: 'paragraphs', type: 'array', label: 'Абзацы', itemLabel: 'Абзац', itemType: 'text' }
                                ]
                            },
                            {
                                key: 'cta',
                                type: 'group',
                                label: 'Нижний блок связи',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' },
                                    {
                                        key: 'contacts',
                                        type: 'array',
                                        label: 'Контакты',
                                        itemLabel: 'Контакт',
                                        itemType: 'object',
                                        fields: [
                                            { key: 'icon', type: 'text', label: 'Иконка' },
                                            { key: 'label', type: 'text', label: 'Подпись' },
                                            { key: 'href', type: 'text', label: 'Ссылка' }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'slidingComponentsPage',
                        type: 'group',
                        label: 'Комплектующие для откатных ворот',
                        fields: [
                            { key: 'backHref', type: 'text', label: 'Ссылка назад' },
                            { key: 'backLabel', type: 'text', label: 'Подпись назад' },
                            { key: 'meta', type: 'text', label: 'Подпись' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'description', type: 'textarea', label: 'Описание' },
                            {
                                key: 'sections',
                                type: 'array',
                                label: 'Блоки характеристик',
                                itemLabel: 'Блок',
                                itemType: 'object',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'items', type: 'array', label: 'Пункты', itemLabel: 'Пункт', itemType: 'text' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'productPages',
                        type: 'array',
                        label: 'Страницы товаров',
                        itemLabel: 'Страница',
                        itemType: 'object',
                        fields: [
                            { key: 'pageKey', type: 'text', label: 'Ключ страницы' },
                            { key: 'backHref', type: 'text', label: 'Ссылка назад' },
                            { key: 'backLabel', type: 'text', label: 'Подпись назад' },
                            { key: 'meta', type: 'text', label: 'Подпись' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'description', type: 'textarea', label: 'Описание' },
                            { key: 'specs', type: 'array', label: 'Характеристики', itemLabel: 'Пункт', itemType: 'text' }
                        ]
                    },
                    {
                        key: 'sharedActions',
                        type: 'group',
                        label: 'Общие кнопки страниц товаров',
                        fields: [
                            createButtonGroupSchema('primary', 'Главная кнопка'),
                            createButtonGroupSchema('secondary', 'Вторичная кнопка')
                        ]
                    }
                ]
            }
        },
        gallery: {
            label: 'Галерея работ',
            description: 'Заголовок, фильтры, счетчик и нижний блок связи галереи.',
            fileName: 'gallery',
            schema: {
                fields: [
                    {
                        key: 'header',
                        type: 'group',
                        label: 'Шапка страницы',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' }
                        ]
                    },
                    {
                        key: 'filters',
                        type: 'array',
                        label: 'Фильтры',
                        itemLabel: 'Фильтр',
                        itemType: 'object',
                        fields: [
                            { key: 'value', type: 'text', label: 'Значение' },
                            { key: 'label', type: 'text', label: 'Подпись' },
                            { key: 'icon', type: 'text', label: 'Иконка' }
                        ]
                    },
                    { key: 'showMoreLabel', type: 'text', label: 'Подпись кнопки “Показать еще”' },
                    {
                        key: 'counter',
                        type: 'group',
                        label: 'Счетчик',
                        fields: [
                            { key: 'value', type: 'text', label: 'Число' },
                            { key: 'text', type: 'textarea', label: 'Описание' }
                        ]
                    },
                    {
                        key: 'cta',
                        type: 'group',
                        label: 'Кнопки нижнего блока',
                        fields: [
                            createButtonGroupSchema('primary', 'Главная кнопка'),
                            createButtonGroupSchema('secondary', 'Вторичная кнопка')
                        ]
                    }
                ]
            }
        },
        prices: {
            label: 'Страница цен',
            description: 'Заголовок, факторы стоимости, калькулятор, гарантия и вопросы с ответами на странице цен.',
            fileName: 'prices',
            schema: {
                fields: [
                    {
                        key: 'header',
                        type: 'group',
                        label: 'Шапка страницы',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' }
                        ]
                    },
                    {
                        key: 'factors',
                        type: 'group',
                        label: 'Факторы стоимости',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок блока' },
                            {
                                key: 'items',
                                type: 'array',
                                label: 'Карточки факторов',
                                itemLabel: 'Фактор',
                                itemType: 'object',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'calculator',
                        type: 'group',
                        label: 'Калькулятор и звонок',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'text', type: 'textarea', label: 'Описание' },
                            {
                                key: 'action',
                                type: 'group',
                                label: 'Кнопка',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Текст' },
                                    { key: 'href', type: 'text', label: 'Ссылка' },
                                    { key: 'icon', type: 'text', label: 'Иконка' }
                                ]
                            },
                            { key: 'contactLabel', type: 'text', label: 'Подпись перед телефонами' },
                            {
                                key: 'phones',
                                type: 'array',
                                label: 'Телефоны',
                                itemLabel: 'Телефон',
                                itemType: 'object',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Номер' },
                                    { key: 'href', type: 'text', label: 'Ссылка' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'guarantee',
                        type: 'group',
                        label: 'Гарантия',
                        fields: [
                            { key: 'badge', type: 'text', label: 'Плашка' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'text', type: 'textarea', label: 'Описание' }
                        ]
                    },
                    {
                        key: 'cta',
                        type: 'group',
                        label: 'Нижние кнопки',
                        fields: [
                            {
                                key: 'primary',
                                type: 'group',
                                label: 'Главная кнопка',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Текст' },
                                    { key: 'href', type: 'text', label: 'Ссылка' },
                                    { key: 'icon', type: 'text', label: 'Иконка' }
                                ]
                            },
                            {
                                key: 'secondary',
                                type: 'group',
                                label: 'Вторичная кнопка',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Текст' },
                                    { key: 'href', type: 'text', label: 'Ссылка' },
                                    { key: 'icon', type: 'text', label: 'Иконка' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'faq',
                        type: 'group',
                        label: 'Вопросы и ответы',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' },
                            {
                                key: 'items',
                                type: 'array',
                                label: 'Вопросы',
                                itemLabel: 'Вопрос',
                                itemType: 'object',
                                fields: [
                                    { key: 'question', type: 'text', label: 'Вопрос' },
                                    { key: 'answer', type: 'textarea', label: 'Ответ' }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        paymentDocuments: {
            label: 'Оплата и документы',
            description: 'Первый экран, карточки преимуществ, этапы и нижний блок связи страницы оплаты и документов.',
            fileName: 'payment-documents',
            schema: {
                fields: [
                    {
                        key: 'hero',
                        type: 'group',
                        label: 'Первый экран',
                        fields: [
                            { key: 'eyebrow', type: 'text', label: 'Надзаголовок' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'lead', type: 'textarea', label: 'Короткий лид' },
                            { key: 'text', type: 'textarea', label: 'Описание' },
                            { key: 'chips', type: 'array', label: 'Чипы', itemLabel: 'Чип', itemType: 'text' },
                            {
                                key: 'accentCard',
                                type: 'group',
                                label: 'Акцентная карточка',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' }
                                ]
                            },
                            {
                                key: 'sideCard',
                                type: 'group',
                                label: 'Правая карточка',
                                fields: [
                                    { key: 'meta', type: 'text', label: 'Подпись' },
                                    { key: 'items', type: 'array', label: 'Пункты', itemLabel: 'Пункт', itemType: 'text' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'benefits',
                        type: 'group',
                        label: 'Преимущества',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' },
                            {
                                key: 'items',
                                type: 'array',
                                label: 'Карточки',
                                itemLabel: 'Карточка',
                                itemType: 'object',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'workflow',
                        type: 'group',
                        label: 'Этапы',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' },
                            {
                                key: 'steps',
                                type: 'array',
                                label: 'Шаги',
                                itemLabel: 'Шаг',
                                itemType: 'object',
                                fields: [
                                    { key: 'number', type: 'text', label: 'Номер' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'cta',
                        type: 'group',
                        label: 'Нижний блок связи',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'text', type: 'textarea', label: 'Описание' },
                            {
                                key: 'primary',
                                type: 'group',
                                label: 'Главная кнопка',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Текст' },
                                    { key: 'href', type: 'text', label: 'Ссылка' },
                                    { key: 'icon', type: 'text', label: 'Иконка' }
                                ]
                            },
                            {
                                key: 'secondary',
                                type: 'group',
                                label: 'Вторичная кнопка',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Текст' },
                                    { key: 'href', type: 'text', label: 'Ссылка' },
                                    { key: 'icon', type: 'text', label: 'Иконка' }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        contacts: {
            label: 'Контакты',
            description: 'Первый экран, контакты, форма связи, ориентиры и карта на странице контактов.',
            fileName: 'contacts',
            schema: {
                fields: [
                    {
                        key: 'hero',
                        type: 'group',
                        label: 'Первый экран',
                        fields: [
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'subtitle', type: 'textarea', label: 'Подзаголовок' },
                            { key: 'eyebrow', type: 'text', label: 'Надзаголовок' },
                            {
                                key: 'facts',
                                type: 'array',
                                label: 'Факты',
                                itemLabel: 'Факт',
                                itemType: 'object',
                                fields: [
                                    { key: 'label', type: 'text', label: 'Метка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'overview',
                        type: 'group',
                        label: 'Основные контакты',
                        fields: [
                            { key: 'kicker', type: 'text', label: 'Надпись' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'text', type: 'textarea', label: 'Описание' },
                            {
                                key: 'items',
                                type: 'array',
                                label: 'Блоки контактов',
                                itemLabel: 'Блок',
                                itemType: 'object',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'valueHtml', type: 'textarea', label: 'HTML значения' },
                                    { key: 'noteIcon', type: 'text', label: 'Иконка примечания' },
                                    { key: 'note', type: 'textarea', label: 'Примечание' }
                                ]
                            },
                            {
                                key: 'manager',
                                type: 'group',
                                label: 'Менеджер',
                                fields: [
                                    { key: 'kicker', type: 'text', label: 'Надпись' },
                                    { key: 'title', type: 'text', label: 'Имя' },
                                    { key: 'text', type: 'textarea', label: 'Описание' }
                                ]
                            },
                            {
                                key: 'hours',
                                type: 'group',
                                label: 'Режим работы',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    {
                                        key: 'items',
                                        type: 'array',
                                        label: 'Строки режима',
                                        itemLabel: 'Строка',
                                        itemType: 'object',
                                        fields: [
                                            { key: 'day', type: 'text', label: 'День/подпись' },
                                            { key: 'time', type: 'text', label: 'Время' },
                                            { key: 'icon', type: 'text', label: 'Иконка (опционально)' }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        key: 'connect',
                        type: 'group',
                        label: 'Быстрая связь',
                        fields: [
                            { key: 'kicker', type: 'text', label: 'Надпись' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'notice', type: 'textarea', label: 'Описание' },
                            createActionArraySchema('actions', 'Кнопки'),
                            {
                                key: 'trustItems',
                                type: 'array',
                                label: 'Факты доверия',
                                itemLabel: 'Факт',
                                itemType: 'object',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'text', type: 'textarea', label: 'Текст' }
                                ]
                            },
                            { key: 'iframeSrc', type: 'text', label: 'Ссылка на встроенную форму' }
                        ]
                    },
                    {
                        key: 'location',
                        type: 'group',
                        label: 'Схема проезда',
                        fields: [
                            { key: 'kicker', type: 'text', label: 'Надпись' },
                            { key: 'title', type: 'text', label: 'Заголовок' },
                            { key: 'text', type: 'textarea', label: 'Описание' },
                            {
                                key: 'badges',
                                type: 'array',
                                label: 'Бейджи',
                                itemLabel: 'Бейдж',
                                itemType: 'object',
                                fields: [
                                    { key: 'icon', type: 'text', label: 'Иконка' },
                                    { key: 'text', type: 'text', label: 'Текст' }
                                ]
                            },
                            {
                                key: 'points',
                                type: 'array',
                                label: 'Ориентиры',
                                itemLabel: 'Пункт',
                                itemType: 'object',
                                fields: [
                                    { key: 'title', type: 'text', label: 'Заголовок' },
                                    { key: 'text', type: 'textarea', label: 'Описание' }
                                ]
                            },
                            createActionArraySchema('actions', 'Кнопки'),
                            { key: 'mapSrc', type: 'text', label: 'Ссылка на карту' }
                        ]
                    }
                ]
            }
        }
    };

    const navGroups = [
        {
            key: 'start',
            label: 'С чего обычно начинают',
            shortLabel: 'Старт',
            note: 'Самые частые входы: быстрый старт, главная, каталог карточек и контакты.',
            items: ['dashboard', 'home', 'catalogPanels', 'contacts']
        },
        {
            key: 'sales',
            label: 'Фото, каталог и продажи',
            shortLabel: 'Продажи',
            note: 'Галерея, каталог, автоматика и страница цен. Всё, что чаще влияет на заявки.',
            items: ['catalog', 'gallery', 'automation', 'prices']
        },
        {
            key: 'support',
            label: 'Общие настройки и служебные страницы',
            shortLabel: 'Настройки',
            note: 'Шапка сайта, страницы услуг и блок оплаты с документами.',
            items: ['site', 'servicePages', 'paymentDocuments']
        }
    ];

    const sectionMeta = {
        dashboard: {
            icon: 'fa-compass-drafting',
            navHint: 'Крупные действия: что именно хотите поменять на сайте прямо сейчас.',
            summary: 'Это домашний экран админки. Здесь можно выбрать готовое действие и сразу перейти в нужный раздел, не вспоминая структуру сайта.',
            bullets: [
                'Поменять тексты на главной.',
                'Обновить фото в каталоге или на главной.',
                'Изменить контакты, карту, цены или документы.'
            ],
            tips: [
                'Сначала выбери задачу, а не раздел сайта.',
                'Если задача узкая, используй “Простые экраны” внутри разделов.',
                'После правок всегда открывай страницу в предпросмотре.'
            ],
            previewLinks: [
                { label: 'Открыть главную', href: '../index.html' },
                { label: 'Открыть каталог', href: '../pages/services.html' },
                { label: 'Открыть контакты', href: '../pages/contacts.html' }
            ]
        },
        site: {
            icon: 'fa-globe',
            navHint: 'Шапка, телефоны, меню и футер на всём сайте.',
            summary: 'Раздел для общих настроек сайта. Всё, что меняется здесь, почти сразу отражается на всех страницах.',
            bullets: [
                'Название бренда и подпись в шапке.',
                'Телефоны, адрес, мессенджеры и режим работы.',
                'Пункты верхнего меню и текст в футере.'
            ],
            tips: [
                'Меняй контакты здесь, если они должны обновиться сразу на всём сайте.',
                'Иконки в меню лучше не трогать без необходимости.',
                'После сохранения проверь шапку и футер на главной и в каталоге.'
            ],
            previewLinks: [
                { label: 'Главная', href: '../index.html' },
                { label: 'Каталог', href: '../pages/services.html' },
                { label: 'Контакты', href: '../pages/contacts.html' }
            ]
        },
        home: {
            icon: 'fa-house',
            navHint: 'Главный экран, новые блоки, доверие и заявка.',
            summary: 'Здесь редактируется вся главная страница: первый экран, направления, процесс работы, доверие и блок заявки.',
            bullets: [
                'Главный экран и первая кнопка.',
                'Блоки “Основные направления”, “Как мы работаем” и “Почему выбирают нас”.',
                'Тексты и быстрые контакты в заявке.'
            ],
            tips: [
                'Если меняешь слайды, сначала проверь подписи и порядок кадров.',
                'Короткие абзацы на главной обычно смотрятся лучше длинных.',
                'После сохранения открой главную и прокрути все блоки до формы.'
            ],
            previewLinks: [
                { label: 'Открыть главную', href: '../index.html' }
            ]
        },
        catalog: {
            icon: 'fa-list',
            navHint: 'Группы каталога, вступления разделов и нижний блок связи.',
            summary: 'Раздел управляет верхней структурой каталога: группами слева, вводными текстами и нижним призывом к действию.',
            bullets: [
                'Названия групп “Ворота”, “Заборы”, “Гараж и защита”, “Автоматика”.',
                'Короткие описания и ссылки внутри каждой группы.',
                'Нижний блок связи в конце страницы каталога.'
            ],
            tips: [
                'Если меняется только конкретная карточка товара, смотри раздел “Каталог: карточки”.',
                'Ключи групп и ID вкладок лучше не переписывать вручную.',
                'После сохранения переключи все группы в каталоге и проверь порядок.'
            ],
            previewLinks: [
                { label: 'Открыть каталог', href: '../pages/services.html' }
            ]
        },
        catalogPanels: {
            icon: 'fa-folder-open',
            navHint: 'Тексты, списки, палитры, вопросы и нижние блоки связи внутри карточек каталога.',
            summary: 'Здесь лежит основное содержимое карточек каталога: описания, характеристики, вопросы и ответы, палитры, шаги выбора и нижние блоки связи.',
            bullets: [
                'Тексты по воротам, заборам, каркасам и автоматике.',
                'Списки характеристик, преимуществ и блоков выбора.',
                'Вопросы и ответы, палитры и нижние блоки связи у конкретных карточек.'
            ],
            tips: [
                'Если нужно поправить текст в одной карточке, почти всегда раздел нужен именно этот.',
                'Длинные блоки лучше менять по одному и сразу проверять на странице.',
                'Не меняй служебные ID без причины: они связаны с вкладками каталога.'
            ],
            previewLinks: [
                { label: 'Открыть каталог', href: '../pages/services.html' }
            ]
        },
        servicePages: {
            icon: 'fa-briefcase',
            navHint: 'Порошковая покраска и пескоструйная обработка.',
            summary: 'Здесь редактируются обе сервисные страницы: порошковая покраска и пескоструйная обработка.',
            bullets: [
                'Верхние блоки и быстрые ссылки.',
                'Карточки услуг, преимущества и этапы.',
                'Вопросы и ответы и нижние блоки связи обеих страниц.'
            ],
            tips: [
                'Следи, чтобы тексты покраски и пескоструя не дублировали друг друга.',
                'Если меняешь быстрые ссылки, проверь, что они ведут к нужным секциям.',
                'После сохранения открой обе страницы и проверь порядок карточек.'
            ],
            previewLinks: [
                { label: 'Порошковая покраска', href: '../pages/powder-coating.html' },
                { label: 'Пескоструйная обработка', href: '../pages/sandblasting.html' }
            ]
        },
        automation: {
            icon: 'fa-gear',
            navHint: 'Карточки автоматики, комплекты и комплектующие.',
            summary: 'Раздел управляет отдельной страницей автоматики и карточками с комплектами для откатных и распашных ворот.',
            bullets: [
                'Первый экран и вводные блоки автоматики.',
                'Карточки комплектов и характеристики.',
                'Раздел комплектующих и страницы отдельных товаров.'
            ],
            tips: [
                'В автоматику лучше писать коротко и по делу: вес, размеры, что входит в комплект.',
                'Если меняешь кнопки карточек, проверь, что ссылки ведут на нужные страницы.',
                'После сохранения открой автоматику и одну карточку товара.'
            ],
            previewLinks: [
                { label: 'Каталог → Автоматика', href: '../pages/services.html' },
                { label: 'Страница автоматики', href: '../pages/automation-swing.html' }
            ]
        },
        gallery: {
            icon: 'fa-images',
            navHint: 'Шапка галереи, фильтры и нижние действия.',
            summary: 'Раздел для управления страницей работ: заголовок, фильтры, счётчик и кнопки внизу.',
            bullets: [
                'Заголовок и описание страницы работ.',
                'Названия фильтров и их порядок.',
                'Кнопка “Показать ещё” и нижний блок связи.'
            ],
            tips: [
                'Сами фотографии лежат в проекте отдельно, а здесь настраивается подача страницы.',
                'Фильтры лучше делать короткими и понятными.',
                'После сохранения проверь, что кнопки и фильтры не ломают сетку.'
            ],
            previewLinks: [
                { label: 'Открыть галерею', href: '../pages/gallery.html' }
            ]
        },
        prices: {
            icon: 'fa-tag',
            navHint: 'Шапка страницы цен, факторы стоимости и калькулятор.',
            summary: 'Здесь собраны тексты и карточки страницы “Цены”: факторы стоимости, калькулятор, гарантия и вопросы с ответами.',
            bullets: [
                'Вступление и заголовок страницы.',
                'Карточки факторов стоимости и блок калькулятора.',
                'Гарантия, вопросы с ответами и нижние кнопки.'
            ],
            tips: [
                'Лучше писать простыми словами, от чего зависит цена.',
                'Если меняешь кнопки, проверь номера телефонов и ссылки.',
                'После сохранения открой страницу цен и прокрути её полностью.'
            ],
            previewLinks: [
                { label: 'Открыть цены', href: '../pages/prices.html' }
            ]
        },
        paymentDocuments: {
            icon: 'fa-receipt',
            navHint: 'Доверие, документы, этапы и нижний блок связи страницы оплаты.',
            summary: 'Раздел для страницы “Оплата и документы”: доверие, этапы работы и кнопки связи.',
            bullets: [
                'Первый экран и акцентные карточки.',
                'Преимущества и этапы работы.',
                'Нижний блок связи и кнопки связи.'
            ],
            tips: [
                'Здесь лучше делать акцент на прозрачности и официальном оформлении.',
                'Тексты стоит держать спокойными и уверенными.',
                'После сохранения проверь страницу вместе с ценами и контактами.'
            ],
            previewLinks: [
                { label: 'Открыть оплату', href: '../pages/payment-documents.html' }
            ]
        },
        contacts: {
            icon: 'fa-phone',
            navHint: 'Контактные блоки, форма связи, карта и ориентиры.',
            summary: 'Раздел редактирует страницу контактов: верхний блок, телефоны, форму связи, карту и подсказки как добраться.',
            bullets: [
                'Основные контакты и менеджер.',
                'Блок быстрой связи и встроенная форма.',
                'Карта, ориентиры и бейджи внизу.'
            ],
            tips: [
                'Если меняешь карту, проверь, что встроенная карта открывается без ошибок.',
                'Телефоны и мессенджеры должны совпадать с общими настройками сайта.',
                'После сохранения посмотри страницу на десктопе и на мобильной ширине.'
            ],
            previewLinks: [
                { label: 'Открыть контакты', href: '../pages/contacts.html' }
            ]
        }
    };

    const managerFieldKeys = new Set([
        'href',
        'actionHref',
        'policyHref',
        'backHref',
        'iframeSrc',
        'mapSrc',
        'alt',
        'logoAlt',
        'domain'
    ]);

    const advancedFieldKeys = new Set([
        'icon',
        'style',
        'width',
        'height',
        'id',
        'panelId',
        'pageKey'
    ]);

    const state = {
        activeKey: 'dashboard',
        data: {},
        dirty: {},
        adminState: { sections: {} },
        apiAvailable: false,
        authRequired: false,
        authenticated: false,
        username: '',
        editorRole: getInitialEditorRole(),
        quickMode: getInitialQuickMode(),
        simpleMode: true,
        searchQuery: '',
        navQuery: '',
        mediaLibrary: [],
        mediaPickerContext: null,
        mediaSearchQuery: '',
        historyOpen: false,
        activeGuide: null,
        activeSimpleScreen: null,
        activeFieldTabs: {},
        activeGroupScreens: {},
        livePreviewHref: '',
        previewPanelOpen: getInitialPreviewPanelOpen(),
        activePreviewCard: getInitialActivePreviewCard(),
        lastFocusedField: null
    };

    const elements = {
        shell: document.querySelector('.admin-shell'),
        main: document.querySelector('.admin-main'),
        nav: document.getElementById('adminNav'),
        navSearch: document.getElementById('adminNavSearch'),
        navSearchClearBtn: document.getElementById('adminNavSearchClearBtn'),
        sidebarFooter: document.getElementById('adminSidebarFooter'),
        form: document.getElementById('adminForm'),
        title: document.getElementById('adminTitle'),
        toolbarPath: document.getElementById('adminToolbarPath'),
        description: document.getElementById('adminDescription'),
        sectionBadge: document.getElementById('adminSectionBadge'),
        alert: document.getElementById('adminAlert'),
        commandCenter: document.getElementById('adminCommandCenter'),
        screenCard: document.getElementById('adminScreenCard'),
        sectionTabs: document.getElementById('adminSectionTabs'),
        assistPanel: document.getElementById('adminAssistPanel'),
        connection: document.getElementById('adminConnection'),
        previewToggleBtn: document.getElementById('adminPreviewToggleBtn'),
        previewSwitcher: document.getElementById('adminPreviewSwitcher'),
        toolbarMore: document.querySelector('.admin-toolbar__more'),
        reloadBtn: document.getElementById('adminReloadBtn'),
        historyBtn: document.getElementById('adminHistoryBtn'),
        downloadBtn: document.getElementById('adminDownloadBtn'),
        saveBtn: document.getElementById('adminSaveBtn'),
        publishBtn: document.getElementById('adminPublishBtn'),
        quickModeBtn: document.getElementById('adminQuickModeBtn'),
        fullModeBtn: document.getElementById('adminFullModeBtn'),
        customerModeBtn: document.getElementById('adminCustomerModeBtn'),
        managerModeBtn: document.getElementById('adminManagerModeBtn'),
        advancedModeBtn: document.getElementById('adminAdvancedModeBtn'),
        modeNote: document.getElementById('adminModeNote'),
        modeNoteTitle: document.getElementById('adminModeNoteTitle'),
        modeNoteText: document.getElementById('adminModeNoteText'),
        pageLinks: document.getElementById('adminPageLinks'),
        collapseBtn: document.getElementById('adminCollapseBtn'),
        expandBtn: document.getElementById('adminExpandBtn'),
        jumpbar: document.getElementById('adminJumpbar'),
        searchInput: document.getElementById('adminSectionSearch'),
        searchCard: document.getElementById('adminSearchCard'),
        searchClearBtn: document.getElementById('adminSearchClearBtn'),
        searchStatus: document.getElementById('adminSearchStatus'),
        dirtyBar: document.getElementById('adminDirtyBar'),
        dirtyBarTitle: document.getElementById('adminDirtyBarTitle'),
        dirtyBarText: document.getElementById('adminDirtyBarText'),
        dirtySaveBtn: document.getElementById('adminDirtySaveBtn'),
        dirtyResetBtn: document.getElementById('adminDirtyResetBtn'),
        scrollTopBtn: document.getElementById('adminScrollTopBtn'),
        mediaPicker: document.getElementById('adminMediaPicker'),
        mediaCloseBtn: document.getElementById('adminMediaCloseBtn'),
        mediaTitle: document.getElementById('adminMediaTitle'),
        mediaMeta: document.getElementById('adminMediaMeta'),
        mediaSearch: document.getElementById('adminMediaSearch'),
        mediaDirectory: document.getElementById('adminMediaDirectory'),
        mediaUploadBtn: document.getElementById('adminMediaUploadBtn'),
        mediaUploadInput: document.getElementById('adminMediaUploadInput'),
        mediaList: document.getElementById('adminMediaList'),
        historyModal: document.getElementById('adminHistoryModal'),
        historyCloseBtn: document.getElementById('adminHistoryCloseBtn'),
        historyMeta: document.getElementById('adminHistoryMeta'),
        historyList: document.getElementById('adminHistoryList'),
        guideModal: document.getElementById('adminGuideModal'),
        guideTitle: document.getElementById('adminGuideTitle'),
        guideLead: document.getElementById('adminGuideLead'),
        guideContent: document.getElementById('adminGuideContent'),
        guideCloseBtn: document.getElementById('adminGuideCloseBtn'),
        logoutBtn: document.getElementById('adminLogoutBtn'),
        overview: document.getElementById('adminOverview'),
        statusCard: document.getElementById('adminStatusCard'),
        quickActionsCard: document.getElementById('adminQuickActionsCard'),
        miniPreviewCard: document.getElementById('adminMiniPreviewCard'),
        livePreviewFrame: document.getElementById('adminLivePreviewFrame'),
        livePreviewOpenBtn: document.getElementById('adminLivePreviewOpenBtn'),
        livePreviewRefreshBtn: document.getElementById('adminLivePreviewRefreshBtn'),
        auth: document.getElementById('adminAuth'),
        loginForm: document.getElementById('adminLoginForm')
    };

    function getInitialQuickMode() {
        try {
            return window.localStorage.getItem('admin-quick-mode') !== '0';
        } catch (error) {
            return true;
        }
    }

    function getInitialEditorRole() {
        try {
            const storedValue = window.localStorage.getItem('admin-editor-role');
            return storedValue === 'advanced' || storedValue === 'manager' || storedValue === 'customer'
                ? storedValue
                : 'customer';
        } catch (error) {
            return 'customer';
        }
    }

    function getInitialPreviewPanelOpen() {
        try {
            const storedValue = window.localStorage.getItem('admin-preview-open');
            if (storedValue === '1') return true;
            if (storedValue === '0') return false;
        } catch (error) {
            // Ignore storage failures and keep fallback below.
        }

        return false;
    }

    function getInitialActivePreviewCard() {
        try {
            const storedValue = window.localStorage.getItem('admin-preview-card');
            if (['actions', 'status', 'summary', 'live'].includes(storedValue)) {
                return storedValue;
            }
        } catch (error) {
            // Ignore storage failures and keep fallback below.
        }

        return 'actions';
    }

    function hasLocalAuthBypass() {
        const hostname = window.location.hostname;
        const isLocalHost = hostname === '127.0.0.1' || hostname === 'localhost';
        if (!isLocalHost) return false;

        const params = new URLSearchParams(window.location.search);
        return params.get('local') === '1' || params.get('bypassAuth') === '1';
    }

    function deepClone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function createDefaultValue(field) {
        if (field.type === 'group') {
            return field.fields.reduce((accumulator, childField) => {
                accumulator[childField.key] = createDefaultValue(childField);
                return accumulator;
            }, {});
        }

        if (field.type === 'array') return [];
        if (field.type === 'number') return 0;
        return '';
    }

    function getFieldVisibilityLevel(field) {
        if (!field || typeof field !== 'object') return 'customer';
        if (field.advanced === true) return 'advanced';
        if (advancedFieldKeys.has(field.key)) return 'advanced';
        if (managerFieldKeys.has(field.key)) return 'manager';
        if (field.label && /(служебн|иконк|id|ширин|высот)/i.test(field.label)) return 'advanced';
        if (field.label && /(ссылка|карта|iframe|alt|логотип|домен)/i.test(field.label)) return 'manager';
        return 'customer';
    }

    function isQuickField(field) {
        if (!field || typeof field !== 'object') return false;

        const quickFieldKeys = new Set([
            'eyebrow',
            'title',
            'titleHtml',
            'subtitle',
            'lead',
            'text',
            'description',
            'label',
            'note',
            'badge',
            'value',
            'question',
            'answer',
            'address',
            'email',
            'hours',
            'phone',
            'phones',
            'contactLines',
            'contacts',
            'actions',
            'action',
            'actionLabel',
            'cta',
            'src',
            'alt',
            'items',
            'slides',
            'advantages',
            'facts'
        ]);

        if (quickFieldKeys.has(field.key)) {
            return true;
        }

        if (field.label && /(заголов|текст|описан|фото|кнопк|контакт|телефон|почт|адрес|плашк|вопрос|ответ|слайд|карточк|факт)/i.test(field.label)) {
            return true;
        }

        if (field.type === 'group' && Array.isArray(field.fields)) {
            return field.fields.some((childField) => isQuickField(childField));
        }

        if (field.type === 'array') {
            if (field.itemType === 'text') {
                return /пункт|кнопк|контакт|телефон|фото|слайд|факт/i.test(field.label || '');
            }

            if (Array.isArray(field.fields)) {
                return field.fields.some((childField) => isQuickField(childField));
            }
        }

        return false;
    }

    function splitFieldsForMode(fields) {
        const scopedFields = state.quickMode
            ? fields.filter((field) => isQuickField(field))
            : fields;

        if (state.editorRole === 'advanced') {
            return {
                primaryFields: scopedFields,
                secondaryFields: [],
                advancedFields: []
            };
        }

        return scopedFields.reduce((accumulator, field) => {
            const level = getFieldVisibilityLevel(field);

            if (level === 'advanced') {
                accumulator.advancedFields.push(field);
            } else if (level === 'manager' && state.editorRole === 'customer') {
                accumulator.secondaryFields.push(field);
            } else {
                accumulator.primaryFields.push(field);
            }

            return accumulator;
        }, { primaryFields: [], secondaryFields: [], advancedFields: [] });
    }

    async function loadAdminState() {
        if (!state.apiAvailable) {
            state.adminState = { sections: {} };
            return state.adminState;
        }

        try {
            const response = await fetch('/api/admin/state', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Не удалось загрузить состояние админки');
            }

            const payload = await response.json();
            state.adminState = payload.state || { sections: {} };
            return state.adminState;
        } catch (error) {
            state.adminState = { sections: {} };
            return state.adminState;
        }
    }

    async function checkApiAvailability() {
        try {
            const response = await fetch('/api/health', { cache: 'no-store' });
            if (!response.ok) return false;
            const data = await response.json();
            return Boolean(data.ok);
        } catch (error) {
            return false;
        }
    }

    async function checkAuthSession() {
        if (!state.apiAvailable) {
            return {
                authEnabled: false,
                authenticated: false,
                username: ''
            };
        }

        try {
            const response = await fetch('/api/auth/session', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Не удалось проверить вход в админку');
            }

            const data = await response.json();
            return {
                authEnabled: Boolean(data.authEnabled),
                authenticated: Boolean(data.authenticated),
                username: data.username || ''
            };
        } catch (error) {
            return {
                authEnabled: false,
                authenticated: true,
                username: ''
            };
        }
    }

    async function loadContent(key, options = {}) {
        const config = contentConfigs[key];
        const suffix = options.fresh ? `?t=${Date.now()}` : '';
        const endpoint = state.apiAvailable
            ? `/api/content/${config.fileName}${suffix}`
            : `/content/${config.fileName}.json${suffix}`;
        const response = await fetch(endpoint, {
            cache: options.fresh ? 'no-store' : 'default'
        });

        if (!response.ok) {
            throw new Error(`Не удалось загрузить ${config.fileName}.json`);
        }

        return response.json();
    }

    async function loadAllContent(options = {}) {
        for (const key of Object.keys(contentConfigs)) {
            const config = contentConfigs[key];
            if (config.virtual) {
                state.data[key] = {};
                state.dirty[key] = false;
                continue;
            }

            const data = await loadContent(key, options);
            state.data[key] = deepClone(data);
            state.dirty[key] = false;
        }

        await loadAdminState();
        rebuildMediaLibrary();
    }

    function showAlert(message, type = 'info', options = {}) {
        elements.alert.hidden = false;
        elements.alert.className = `admin-alert is-${type}`;
        elements.alert.innerHTML = '';

        const body = document.createElement('div');
        body.className = 'admin-alert__body';

        const messageNode = document.createElement('div');
        messageNode.className = 'admin-alert__message';
        messageNode.textContent = message;
        body.appendChild(messageNode);

        const actions = Array.isArray(options.actions) ? options.actions.filter(Boolean) : [];
        if (actions.length) {
            const actionsNode = document.createElement('div');
            actionsNode.className = 'admin-alert__actions';

            actions.forEach((action) => {
                const buttonClass = action.style === 'primary' ? 'admin-btn admin-btn--primary' : 'admin-btn admin-btn--ghost';
                if (action.href) {
                    const link = document.createElement('a');
                    link.className = buttonClass;
                    link.href = action.href;
                    link.target = action.target || '_blank';
                    link.rel = action.rel || 'noopener noreferrer';
                    link.textContent = action.label || 'Открыть';
                    actionsNode.appendChild(link);
                    return;
                }

                const button = document.createElement('button');
                button.type = 'button';
                button.className = buttonClass;
                button.textContent = action.label || 'Продолжить';
                if (typeof action.onClick === 'function') {
                    button.addEventListener('click', action.onClick);
                }
                actionsNode.appendChild(button);
            });

            body.appendChild(actionsNode);
        }

        elements.alert.appendChild(body);
    }

    function clearAlert() {
        elements.alert.hidden = true;
        elements.alert.innerHTML = '';
        elements.alert.className = 'admin-alert';
    }

    function updateModeUi() {
        state.simpleMode = state.editorRole !== 'advanced';

        elements.quickModeBtn?.classList.toggle('is-active', state.quickMode);
        elements.fullModeBtn?.classList.toggle('is-active', !state.quickMode);
        elements.customerModeBtn?.classList.toggle('is-active', state.editorRole === 'customer');
        elements.managerModeBtn?.classList.toggle('is-active', state.editorRole === 'manager');
        elements.advancedModeBtn?.classList.toggle('is-active', state.editorRole === 'advanced');

        if (elements.modeNote && elements.modeNoteTitle && elements.modeNoteText) {
            elements.modeNote.hidden = false;

            if (state.quickMode && state.editorRole === 'customer') {
                elements.modeNoteTitle.textContent = 'Быстрые правки для заказчика включены';
                elements.modeNoteText.textContent = 'Показываются только самые нужные поля: заголовки, тексты, фото, кнопки и контакты. Это самый спокойный режим для обычной работы.';
            } else if (state.quickMode && state.editorRole === 'manager') {
                elements.modeNoteTitle.textContent = 'Быстрые правки для менеджера включены';
                elements.modeNoteText.textContent = 'Видны тексты, фото, ссылки и формы без лишней глубины. Если нужно открыть всё, переключитесь на “Все поля”.';
            } else if (state.editorRole === 'customer') {
                elements.modeNoteTitle.textContent = 'Режим заказчика включён';
                elements.modeNoteText.textContent = 'Показываются только основные поля: тексты, фото, кнопки и контакты. Всё лишнее для обычной работы скрыто.';
            } else if (state.editorRole === 'manager') {
                elements.modeNoteTitle.textContent = 'Режим менеджера включён';
                elements.modeNoteText.textContent = 'Показываются контент и рабочие поля: ссылки, карты и формы. Служебные ID, иконки и глубоко технические настройки всё ещё скрыты.';
            } else {
                elements.modeNoteTitle.textContent = 'Расширенный режим включён';
                elements.modeNoteText.textContent = 'Показываются все поля без упрощения: контент, ссылки, иконки, размеры изображений, служебные ID и другие настройки.';
            }
        }

        updateToolbarChrome();
    }

    function updateSearchUi() {
        if (!elements.searchInput || !elements.searchStatus) return;

        elements.searchInput.value = state.searchQuery;
        elements.searchInput.placeholder = `Найти блок в этом разделе, например: ${getSectionSpecificSearchExamples(state.activeKey)}`;

        if (!state.searchQuery.trim()) {
            elements.searchStatus.textContent = 'Показываются все блоки раздела.';
            return;
        }

        const visibleCount = Array.from(elements.form?.querySelectorAll(':scope > details:not(.is-filtered-out)') || []).length;
        elements.searchStatus.textContent = visibleCount
            ? `Найдено блоков: ${visibleCount}.`
            : 'Ничего не найдено. Попробуй другое слово или сбрось поиск.';
    }

    function applySectionFilter() {
        if (!elements.form) return;

        const query = state.searchQuery.trim().toLowerCase();
        const sections = Array.from(elements.form.querySelectorAll(':scope > details'));

        sections.forEach((section) => {
            if (!query) {
                section.classList.remove('is-filtered-out');
                return;
            }

            const text = section.querySelector('summary')?.textContent?.toLowerCase() || '';
            section.classList.toggle('is-filtered-out', !text.includes(query));
        });

        updateSearchUi();
    }

    function updateDirtyBar() {
        if (!elements.dirtyBar || !elements.dirtyBarTitle || !elements.dirtyBarText) return;
        if (contentConfigs[state.activeKey]?.virtual) {
            elements.dirtyBar.hidden = true;
            return;
        }

        const activeConfig = contentConfigs[state.activeKey];
        const hasChanges = Boolean(state.dirty[state.activeKey]);
        const canSave = state.apiAvailable && (!state.authRequired || state.authenticated);

        elements.dirtyBar.hidden = !hasChanges;
        if (!hasChanges) return;

        elements.dirtyBarTitle.textContent = `Есть несохранённые изменения в разделе «${activeConfig.label}»`;

        if (!state.apiAvailable) {
            elements.dirtyBarText.textContent = 'Сервер сохранения сейчас не найден. Можно сделать резервную копию или запустить сервер заново.';
        } else if (state.authRequired && !state.authenticated) {
            elements.dirtyBarText.textContent = 'Чтобы сохранить эти правки, сначала нужно войти в админку.';
        } else {
            elements.dirtyBarText.textContent = 'Проверь правки и нажми “Сохранить сейчас”, чтобы изменения попали на сайт.';
        }

        if (elements.dirtySaveBtn) {
            elements.dirtySaveBtn.disabled = !canSave;
        }
    }

    function setEditorMode(role, options = {}) {
        const nextValue = role || 'customer';
        const changed = state.editorRole !== nextValue;
        state.editorRole = nextValue;
        state.simpleMode = nextValue !== 'advanced';

        try {
            window.localStorage.setItem('admin-editor-role', nextValue);
        } catch (error) {
            // Ignore storage failures and keep in-memory mode.
        }

        updateModeUi();

        if (changed) {
            renderActiveSection();

            if (!options.silent) {
                showAlert(
                    nextValue === 'customer'
                        ? 'Включен режим заказчика. Показываются только основные поля контента.'
                        : nextValue === 'manager'
                            ? 'Включен режим менеджера. Видны тексты, фото, ссылки и формы без лишней глубины.'
                            : 'Включен расширенный режим. Показаны все доступные настройки.',
                    'info'
                );
            }
        }
    }

    const fieldUiCopy = {
        global: {
            labels: {
                titleMain: 'Первая строка заголовка',
                titleSub: 'Вторая строка заголовка',
                subtitleStrong: 'Акцентная подпись',
                footerCaption: 'Подпись внизу сайта',
                copyrightStartYear: 'Год начала работы',
                companyParagraphs: 'Абзацы о компании',
                bulletPoints: 'Короткий список под заголовком',
                sectionTitle: 'Заголовок секции',
                sectionSubtitle: 'Описание секции',
                mediaTags: 'Подписи над фото',
                titleHtml: 'Главный заголовок',
                subtitle: 'Поясняющий текст',
                lead: 'Основной текст',
                trust: 'Нижняя доверительная строка',
                value: 'Крупный факт',
                arrowLabel: 'Текст ссылки',
                formEyebrow: 'Подпись над формой',
                formTitle: 'Заголовок формы',
                formNotice: 'Текст над формой',
                contactTitle: 'Заголовок контактов',
                contactIntro: 'Текст рядом с контактами',
                contactLines: 'Контакты рядом с формой',
                quickActions: 'Быстрые кнопки',
                quickNav: 'Быстрые ссылки по странице',
                pageTitle: 'Скрытый заголовок страницы',
                introTitle: 'Подзаголовок внутри карточки',
                paragraphs: 'Основные абзацы',
                tailParagraphs: 'Дополнительный текст',
                badges: 'Короткие акценты',
                sectionHeading: 'Заголовок блока с товарами',
                products: 'Карточки товаров',
                productCards: 'Карточки товаров',
                specGroups: 'Блоки характеристик',
                specs: 'Список характеристик',
                processSteps: 'Шаги процесса',
                paletteCard: 'Карточка палитры',
                beforeAfter: 'Блок до / после',
                listingHeader: 'Заголовок списка товаров',
                sharedCta: 'Общие кнопки карточек',
                iframeSrc: 'Ссылка на форму',
                mapSrc: 'Ссылка на карту',
                href: 'Куда ведёт ссылка',
                actionHref: 'Куда ведёт кнопка',
                src: 'Фото',
                alt: 'Описание фото',
                meta: 'Короткая подпись',
                cta: 'Текст кнопки',
                chips: 'Короткие акценты',
                bullets: 'Короткие пункты',
                facts: 'Факты и акценты',
                cards: 'Карточки',
                items: 'Элементы списка'
            },
            hints: {
                titleMain: 'Эта строка стоит первой в крупном заголовке.',
                titleSub: 'Эта строка идёт сразу после первой и завершает главный заголовок.',
                subtitleStrong: 'Небольшой акцентный текст рядом с главным блоком.',
                titleHtml: 'Можно использовать переносы строк или простую HTML-разметку, если она уже применяется на странице.',
                breadcrumb: 'Текст над карточкой или страницей, который показывает путь пользователя.',
                paragraphs: 'Основной текст карточки. Можно менять порядок абзацев.',
                tailParagraphs: 'Дополнительный текст, который идёт после коротких акцентов.',
                badges: 'Короткие подписи или бейджи рядом с основным текстом.',
                introTitle: 'Этот подзаголовок идёт внутри карточки перед основным описанием.',
                products: 'Список карточек, которые видит клиент внутри этого раздела.',
                specs: 'Сюда лучше вносить короткие характеристики без длинных предложений.',
                quickActions: 'Кнопки быстрой связи или быстрых действий рядом с формой.',
                quickNav: 'Быстрые ссылки по странице. Лучше держать формулировки короткими.',
                contactLines: 'Телефоны и мессенджеры рядом с формой или блоком контактов.'
            },
            placeholders: {
                titleMain: 'Например: Ворота, заборы',
                titleSub: 'Например: и порошковая покраска',
                subtitleStrong: 'Например: Работаем под ключ',
                footerCaption: 'Короткая подпись в самом низу сайта',
                bulletPoints: 'Например: Откатные ворота',
                sectionTitle: 'Например: Основные направления',
                sectionSubtitle: 'Коротко объясни, что человек найдёт в этом блоке',
                titleHtml: 'Можно вставить заголовок с переносами строк',
                introTitle: 'Например: Почему выбирают этот вариант',
                paragraphs: 'Основной текст карточки',
                tailParagraphs: 'Дополнительный текст после коротких акцентов',
                badges: 'Например: Монтаж под ключ',
                value: 'Например: 10+ лет',
                formEyebrow: 'Например: Быстрый расчёт',
                formTitle: 'Например: Оставить заявку',
                formNotice: 'Короткий текст над формой',
                contactTitle: 'Например: Быстрый контакт',
                contactIntro: 'Коротко объясни, как с вами связаться',
                pageTitle: 'Скрытый заголовок для страницы',
                breadcrumb: 'Например: Каталог / Ворота',
                specs: 'Например: Ширина 4000 мм',
                cta: 'Например: Открыть комплект'
            }
        },
        site: {
            labels: {
                tagline: 'Подпись рядом с логотипом',
                logoAlt: 'Описание логотипа',
                primaryPhone: 'Основной номер',
                secondaryPhone: 'Второй номер',
                navigation: 'Пункты верхнего меню',
                usefulLinks: 'Полезные ссылки в футере'
            }
        },
        home: {
            labels: {
                directions: 'Новые большие блоки на главной',
                process: 'Как мы работаем',
                trust: 'Почему выбирают нас',
                request: 'Блок заявки и контактов',
                facts: 'Карточки фактов',
                advantages: 'Список услуг рядом с формой'
            },
            hints: {
                directions: 'Здесь меняются два главных больших блока на главной странице.',
                request: 'Это один из самых заметных блоков на главной, лучше держать тексты короткими и уверенными.'
            }
        },
        catalogPanels: {
            labels: {
                breadcrumb: 'Путь сверху',
                title: 'Заголовок карточки',
                introTitle: 'Подзаголовок внутри карточки',
                badges: 'Короткие акценты',
                palette: 'Блок цвета и фактуры',
                products: 'Карточки товаров внизу',
                specGroups: 'Блоки характеристик',
                faq: 'Вопросы и ответы',
                cta: 'Нижний призыв к действию'
            },
            hints: {
                breadcrumb: 'Этот текст виден вверху карточки как путь к разделу.',
                products: 'Ниже именно эти карточки видит посетитель как товары или комплекты.',
                palette: 'Здесь можно описать цвет, покрытие, палитру или фактуру.'
            }
        },
        contacts: {
            labels: {
                manager: 'Контакт менеджера',
                managerTitle: 'Подпись менеджера',
                quickActions: 'Кнопки быстрой связи',
                routeBadges: 'Короткие ориентиры',
                findUs: 'Как нас найти'
            }
        },
        prices: {
            labels: {
                factors: 'От чего зависит цена',
                calculator: 'Калькулятор и пояснение',
                guarantee: 'Гарантия и доверие'
            }
        },
        servicePages: {
            labels: {
                sections: 'Карточки услуг',
                header: 'Верхняя часть страницы',
                cta: 'Нижний блок связи',
                faq: 'Вопросы и ответы'
            }
        }
    };

    function getFieldUiValue(type, field) {
        const sectionKey = state.activeKey;
        const sectionMap = fieldUiCopy[sectionKey]?.[type] || {};
        const globalMap = fieldUiCopy.global[type] || {};
        return sectionMap[field.key] || globalMap[field.key] || '';
    }

    function setQuickMode(enabled, options = {}) {
        const nextValue = Boolean(enabled);
        const changed = state.quickMode !== nextValue;
        state.quickMode = nextValue;

        try {
            window.localStorage.setItem('admin-quick-mode', nextValue ? '1' : '0');
        } catch (error) {
            // Ignore storage write issues.
        }

        updateModeUi();

        if (changed) {
            renderActiveSection();

            if (!options.silent) {
                showAlert(
                    nextValue
                        ? 'Включен режим быстрых правок. Показываются только самые нужные поля.'
                        : 'Показаны все доступные поля текущего режима.',
                    'info'
                );
            }
        }
    }

    function getFieldHint(field) {
        const sectionHint = getFieldUiValue('hints', field);
        if (sectionHint) {
            return sectionHint;
        }

        const fieldHints = {
            href: 'Ссылка на страницу, якорь или телефон. Если всё работает, это поле лучше менять осторожно.',
            icon: 'Поле для иконки. Если не уверены, лучше оставьте как есть.',
            src: 'Можно выбрать фото из библиотеки или загрузить новое прямо в файлы проекта.',
            alt: 'Короткое описание изображения для сайта и поисковиков.',
            width: 'Лучше указывать реальную ширину файла.',
            height: 'Лучше указывать реальную высоту файла.',
            iframeSrc: 'Ссылка на встроенную форму или подключаемый виджет.',
            mapSrc: 'Ссылка на встроенную карту для страницы.',
            panelId: 'Служебный ID вкладки. Менять только если точно понимаете, зачем.',
            id: 'Служебный идентификатор. Обычно его лучше не менять.',
            pageKey: 'Служебный ключ страницы. Лучше оставить без изменений.'
        };

        return fieldHints[field.key] || '';
    }

    function getFieldPlaceholder(field) {
        const sectionPlaceholder = getFieldUiValue('placeholders', field);
        if (sectionPlaceholder) {
            return sectionPlaceholder;
        }

        const placeholders = {
            label: 'Например: Получить расчёт',
            title: 'Введите заголовок',
            text: 'Введите текст',
            lead: 'Короткий поясняющий текст',
            subtitle: 'Пояснение под заголовком',
            href: '/pages/services.html или #request-form',
            actionHref: '/pages/contacts.html',
            src: 'Можно выбрать готовое фото или загрузить новое',
            alt: 'Короткое описание изображения',
            address: 'Казань, Старое Победилово, ул. Садовая, 72',
            email: 'example@mail.ru',
            hours: 'Пн–Сб, 09:00–18:00',
            iframeSrc: 'https://forms.yandex.ru/...',
            mapSrc: 'https://yandex.ru/map-widget/...',
            note: 'Короткое примечание',
            question: 'Введите вопрос',
            answer: 'Введите ответ',
            pageTitle: 'Скрытый заголовок страницы'
        };

        return placeholders[field.key] || '';
    }

    function getDisplayLabel(field) {
        const defaultLabel = field.label || field.key;
        const sectionLabel = getFieldUiValue('labels', field);
        if (sectionLabel) return sectionLabel;
        if (!state.simpleMode) return defaultLabel;

        if (field.key === 'hero' && field.type === 'group') return 'Первый экран';
        if (field.key === 'cta' && field.type === 'group') return 'Нижний блок связи';
        if (field.key === 'faq' && field.type === 'group') return 'Вопросы и ответы';
        if (field.key === 'request' && field.type === 'group') return 'Заявка и контакты';
        if (field.key === 'trust' && field.type === 'group') return 'Доверие и преимущества';
        if (field.key === 'process' && field.type === 'group') return 'Как мы работаем';
        if (field.key === 'directions' && field.type === 'group') return 'Главные направления';
        if (field.key === 'overview' && field.type === 'group') return 'Основные контакты';
        if (field.key === 'connect' && field.type === 'group') return 'Быстрая связь';
        if (field.key === 'location' && field.type === 'group') return 'Карта и ориентиры';
        if (field.key === 'workflow' && field.type === 'group') return 'Этапы работы';
        if (field.key === 'benefits' && field.type === 'group') return 'Преимущества';
        if (field.key === 'guide' && field.type === 'group') return 'Подсказки по выбору';
        if (field.key === 'groups' && field.type === 'group') return 'Группы каталога';
        if (field.key === 'partners' && field.type === 'group') return 'Партнеры и бренды';
        if (field.key === 'factors' && field.type === 'group') return 'Факторы цены';
        if (field.key === 'calculator' && field.type === 'group') return 'Калькулятор и контакты';
        if (field.key === 'guarantee' && field.type === 'group') return 'Гарантия и ответы';

        const labelMap = {
            src: 'Фото',
            alt: 'Описание фото',
            href: 'Ссылка',
            actionHref: 'Ссылка кнопки',
            iframeSrc: 'Форма',
            mapSrc: 'Карта',
            icon: 'Иконка',
            style: 'Вид кнопки',
            width: 'Ширина фото',
            height: 'Высота фото',
            eyebrow: 'Подпись над заголовком',
            meta: 'Короткая подпись',
            badge: 'Плашка',
            note: 'Примечание',
            lead: 'Основной текст',
            subtitle: 'Подзаголовок',
            titleHtml: 'Заголовок',
            valueHtml: 'Текст блока',
            chips: 'Короткие акценты',
            bullets: 'Короткие пункты',
            cta: 'Текст кнопки',
            specs: 'Характеристики',
            quickActions: 'Быстрые кнопки',
            quickNav: 'Быстрые ссылки',
            paragraphs: 'Абзацы',
            tailParagraphs: 'Дополнительные абзацы',
            contactLines: 'Контакты',
            action: 'Кнопка',
            actions: 'Кнопки',
            cards: 'Карточки',
            items: 'Элементы',
            facts: 'Факты'
        };

        return labelMap[field.key] || defaultLabel;
    }

    function autosizeTextarea(textarea) {
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.max(textarea.scrollHeight, 110)}px`;
    }

    function hasDirtyChanges() {
        return Object.values(state.dirty).some(Boolean);
    }

    function confirmDiscardChanges(message) {
        if (!state.dirty[state.activeKey]) return true;
        return window.confirm(message || `В разделе «${contentConfigs[state.activeKey].label}» есть несохранённые изменения. Продолжить без сохранения?`);
    }

    function isImageLikeValue(value) {
        return typeof value === 'string'
            && /\.(png|jpe?g|webp|gif|svg|avif)(\?.*)?$/i.test(value.trim());
    }

    function getPreviewUrl(value) {
        if (typeof value !== 'string') return '';

        const trimmedValue = value.trim();
        if (!trimmedValue) return '';
        if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue;
        if (trimmedValue.startsWith('/')) return trimmedValue;
        if (trimmedValue.startsWith('../') || trimmedValue.startsWith('./')) return trimmedValue;

        return `../${trimmedValue.replace(/^\/+/, '')}`;
    }

    function getFileNameFromPath(value) {
        if (typeof value !== 'string') return '';
        const trimmedValue = value.trim();
        if (!trimmedValue) return '';
        const normalizedValue = trimmedValue.split('?')[0].replace(/\\/g, '/');
        return normalizedValue.split('/').pop() || trimmedValue;
    }

    function createImagePreview(value) {
        if (!isImageLikeValue(value)) return null;

        const previewUrl = getPreviewUrl(value);
        if (!previewUrl) return null;

        const preview = document.createElement('div');
        preview.className = 'admin-field__preview';
        preview.innerHTML = `
            <img src="${previewUrl}" alt="Предпросмотр изображения" loading="lazy">
            <div class="admin-field__preview-bar">
                <span>${getFileNameFromPath(value)}</span>
                <a href="${previewUrl}" target="_blank" rel="noopener noreferrer">Открыть фото</a>
            </div>
        `;

        return preview;
    }

    function createMediaPlaceholder(label) {
        const preview = document.createElement('div');
        preview.className = 'admin-field__preview is-empty';
        preview.innerHTML = `
            <div class="admin-field__preview-empty">
                <span class="admin-field__preview-empty-icon"><i class="fas fa-image" aria-hidden="true"></i></span>
                <strong>${label || 'Фото пока не выбрано'}</strong>
                <span>Выберите изображение из библиотеки или вставьте путь к файлу ниже.</span>
            </div>
        `;

        return preview;
    }

    function collectImagePaths(value, results = new Set()) {
        if (typeof value === 'string') {
            if (isImageLikeValue(value)) {
                results.add(value.trim());
            }
            return results;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => collectImagePaths(item, results));
            return results;
        }

        if (value && typeof value === 'object') {
            Object.values(value).forEach((childValue) => collectImagePaths(childValue, results));
        }

        return results;
    }

    function rebuildMediaLibrary() {
        const results = new Set();
        Object.values(state.data).forEach((contentValue) => {
            collectImagePaths(contentValue, results);
        });

        state.mediaLibrary = Array.from(results).sort((firstValue, secondValue) => firstValue.localeCompare(secondValue, 'ru'));
    }

    function getMediaDefaultDirectory(sectionKey) {
        const directoryMap = {
            site: 'assets/images/hero',
            home: 'assets/images/hero',
            catalog: 'assets/images/catalog',
            catalogPanels: 'assets/images/catalog',
            automation: 'assets/images/catalog/automation',
            gallery: 'assets/images/gallery',
            prices: 'assets/images/palette',
            paymentDocuments: 'assets/images/palette',
            contacts: 'assets/images/hero',
            servicePages: 'assets/images/works'
        };

        return directoryMap[sectionKey] || 'assets/images/catalog';
    }

    function getHistoryStorageKey(fileName) {
        return `admin-history-${fileName}`;
    }

    function loadSectionHistory(fileName) {
        try {
            const rawValue = window.localStorage.getItem(getHistoryStorageKey(fileName));
            if (!rawValue) return [];
            const parsedValue = JSON.parse(rawValue);
            return Array.isArray(parsedValue) ? parsedValue : [];
        } catch (error) {
            return [];
        }
    }

    function saveSectionHistory(fileName, entries) {
        try {
            window.localStorage.setItem(getHistoryStorageKey(fileName), JSON.stringify(entries.slice(0, 10)));
        } catch (error) {
            // Ignore storage write issues.
        }
    }

    function pushSectionHistory(fileName, data) {
        const entries = loadSectionHistory(fileName);
        entries.unshift({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            savedAt: new Date().toISOString(),
            savedBy: state.username || 'local',
            action: 'save',
            data: deepClone(data)
        });
        saveSectionHistory(fileName, entries);
    }

    function getHistoryEntriesForActiveSection() {
        const config = contentConfigs[state.activeKey];
        const serverEntries = getSectionAdminState(state.activeKey)?.history;
        if (Array.isArray(serverEntries) && serverEntries.length) {
            return serverEntries;
        }

        return loadSectionHistory(config.fileName);
    }

    function closeMediaPicker() {
        if (!elements.mediaPicker) return;
        elements.mediaPicker.hidden = true;
        document.body.classList.remove('admin-media-open');
        state.mediaPickerContext = null;
        state.mediaSearchQuery = '';
    }

    function renderMediaPicker() {
        if (!elements.mediaList || !elements.mediaTitle) return;

        const query = state.mediaSearchQuery.trim().toLowerCase();
        const filteredItems = state.mediaLibrary.filter((item) => item.toLowerCase().includes(query));
        const currentValue = typeof state.mediaPickerContext?.currentValue === 'string'
            ? state.mediaPickerContext.currentValue.trim()
            : '';
        const currentFileName = currentValue ? getFileNameFromPath(currentValue) : '';
        const directoryLabel = elements.mediaDirectory instanceof HTMLSelectElement
            ? (elements.mediaDirectory.selectedOptions[0]?.textContent || elements.mediaDirectory.value)
            : (state.mediaPickerContext?.directory || getMediaDefaultDirectory(state.activeKey));
        elements.mediaTitle.textContent = state.mediaPickerContext?.title || 'Выбрать фото';
        if (elements.mediaMeta) {
            elements.mediaMeta.innerHTML = `
                <span><i class="fas fa-folder-open" aria-hidden="true"></i> ${directoryLabel}</span>
                <span><i class="fas fa-image" aria-hidden="true"></i> Найдено: ${filteredItems.length}</span>
                <span><i class="fas fa-check-circle" aria-hidden="true"></i> ${currentFileName ? `Сейчас выбрано: ${currentFileName}` : 'Фото пока не выбрано'}</span>
            `;
        }

        if (!filteredItems.length) {
            elements.mediaList.innerHTML = '<div class="admin-media__empty">По этому запросу ничего не найдено. Попробуй другое имя файла или очисти поиск.</div>';
            return;
        }

        elements.mediaList.innerHTML = filteredItems.map((item) => {
            const previewUrl = getPreviewUrl(item);
            const fileName = getFileNameFromPath(item);
            const isCurrent = Boolean(currentValue && item === currentValue);

            return `
                <article class="admin-media-card${isCurrent ? ' is-current' : ''}">
                    <img src="${previewUrl}" alt="${fileName}" loading="lazy">
                    <div class="admin-media-card__body">
                        <div class="admin-media-card__title">${fileName}</div>
                        <div class="admin-media-card__path">${item}</div>
                        <button class="admin-btn admin-btn--primary" type="button" data-media-select="${item}">
                            <i class="fas fa-check" aria-hidden="true"></i> ${isCurrent ? 'Оставить это фото' : 'Выбрать'}
                        </button>
                    </div>
                </article>
            `;
        }).join('');

        elements.mediaList.querySelectorAll('[data-media-select]').forEach((button) => {
            button.addEventListener('click', () => {
                const selectedValue = button.getAttribute('data-media-select') || '';
                state.mediaPickerContext?.apply?.(selectedValue);
                closeMediaPicker();
            });
        });
    }

    function openMediaPicker(context) {
        if (!elements.mediaPicker) return;

        state.mediaPickerContext = context;
        state.mediaSearchQuery = '';
        if (elements.mediaSearch) {
            elements.mediaSearch.value = '';
        }
        if (elements.mediaDirectory) {
            elements.mediaDirectory.value = context?.directory || getMediaDefaultDirectory(state.activeKey);
        }

        renderMediaPicker();
        elements.mediaPicker.hidden = false;
        document.body.classList.add('admin-media-open');
        window.setTimeout(() => {
            elements.mediaSearch?.focus();
        }, 0);
    }

    async function handleMediaUpload(file) {
        if (!file || !state.mediaPickerContext) return;

        if (!/^image\//i.test(file.type)) {
            showAlert('Можно загрузить только изображение.', 'error');
            return;
        }

        if (file.size > 12 * 1024 * 1024) {
            showAlert('Файл слишком большой. Лучше подготовить изображение до 12 МБ.', 'error');
            return;
        }

        if (!state.apiAvailable) {
            showAlert('Для загрузки новых фото нужен локальный сервер админки.', 'info');
            return;
        }

        if (state.authRequired && !state.authenticated) {
            showAlert('Чтобы загружать новые фото, сначала нужно войти в админку.', 'info');
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const result = typeof reader.result === 'string' ? reader.result : '';
            if (!result) {
                showAlert('Не удалось прочитать выбранное изображение.', 'error');
                return;
            }

            try {
                const directory = elements.mediaDirectory?.value || getMediaDefaultDirectory(state.activeKey);
                const response = await fetch('/api/media/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Admin-Actor': state.username || 'local'
                    },
                    body: JSON.stringify({
                        fileName: file.name,
                        dataUrl: result,
                        directory
                    })
                });

                const payload = await response.json();
                if (!response.ok || !payload.ok) {
                    throw new Error(payload.error || 'Не удалось загрузить изображение');
                }

                state.mediaPickerContext?.apply?.(payload.path);
                rebuildMediaLibrary();
                closeMediaPicker();
                showAlert(`Фото «${file.name}» загружено в ${payload.directory} и подставлено в поле.`, 'success');
            } catch (error) {
                showAlert(error.message, 'error');
            }
        };
        reader.onerror = () => {
            showAlert('Не удалось загрузить изображение с компьютера.', 'error');
        };
        reader.readAsDataURL(file);
    }

    function isValidLinkValue(value) {
        const trimmedValue = String(value || '').trim();
        if (!trimmedValue) return true;
        return /^(\/|#|https?:\/\/|tel:|mailto:|\.\.?\/)/i.test(trimmedValue);
    }

    function collectValidationWarnings(value, path = 'Раздел', results = []) {
        if (Array.isArray(value)) {
            value.forEach((item, index) => collectValidationWarnings(item, `${path} → ${index + 1}`, results));
            return results;
        }

        if (value && typeof value === 'object') {
            if (typeof value.href === 'string' && value.href.trim() && !isValidLinkValue(value.href)) {
                results.push(`${path}: ссылка выглядит необычно`);
            }

            if (typeof value.src === 'string' && value.src.trim()) {
                const srcValue = value.src.trim();
                if (!isImageLikeValue(srcValue) && !srcValue.startsWith('data:image/')) {
                    results.push(`${path}: поле фото не похоже на корректный путь к изображению`);
                }

                if (srcValue.startsWith('data:image/') && srcValue.length > 1_500_000) {
                    results.push(`${path}: встроенное фото очень большое и может замедлить сайт`);
                }

                if (Object.prototype.hasOwnProperty.call(value, 'alt') && typeof value.alt === 'string' && !value.alt.trim()) {
                    results.push(`${path}: у фото нет описания (alt)`);
                }
            }

            Object.entries(value).forEach(([key, childValue]) => {
                if (typeof childValue === 'string') {
                    const trimmedValue = childValue.trim();
                    if ((key === 'title' || key === 'label' || key === 'question') && !trimmedValue) {
                        results.push(`${path}: пустое обязательное текстовое поле`);
                    }

                    if ((key === 'text' || key === 'lead' || key === 'subtitle' || key === 'description') && trimmedValue.length > 1200) {
                        results.push(`${path}: один из текстов получился слишком длинным`);
                    }
                } else {
                    collectValidationWarnings(childValue, `${path} → ${key}`, results);
                }
            });
        }

        return results;
    }

    function closeHistoryModal() {
        if (!elements.historyModal) return;
        elements.historyModal.hidden = true;
        state.historyOpen = false;
        document.body.classList.remove('admin-media-open');
    }

    function restoreHistoryEntry(entryId) {
        const entries = getHistoryEntriesForActiveSection();
        const entry = entries.find((item) => item.id === entryId);
        if (!entry || !entry.data) {
            showAlert('Для этой записи нет снимка данных, поэтому вернуть её нельзя.', 'info');
            return;
        }

        state.data[state.activeKey] = deepClone(entry.data);
        state.dirty[state.activeKey] = true;
        closeHistoryModal();
        renderNav();
        renderActiveSection();
        showAlert(`Версия от ${formatDateTime(entry.savedAt)} восстановлена. Теперь сохраните раздел, чтобы вернуть её на сайт.`, 'success', {
            actions: [
                { label: 'Сохранить сейчас', style: 'primary', onClick: () => saveActiveSection() },
                { label: 'Продолжить', onClick: () => clearAlert() }
            ]
        });
    }

    function renderHistoryModal() {
        if (!elements.historyList) return;

        const entries = getHistoryEntriesForActiveSection();
        if (elements.historyMeta) {
            const latestEntry = entries[0];
            const publishCount = entries.filter((entry) => entry.action === 'publish').length;
            elements.historyMeta.innerHTML = entries.length
                ? `
                    <span><i class="fas fa-clock-rotate-left" aria-hidden="true"></i> Версий: ${entries.length}</span>
                    <span><i class="fas fa-calendar-check" aria-hidden="true"></i> Последняя: ${formatDateTime(latestEntry?.savedAt)}</span>
                    <span><i class="fas fa-cloud-arrow-up" aria-hidden="true"></i> Публикаций: ${publishCount}</span>
                `
                : `
                    <span><i class="fas fa-clock-rotate-left" aria-hidden="true"></i> История появится после первого сохранения</span>
                `;
        }

        if (!entries.length) {
            elements.historyList.innerHTML = '<div class="admin-media__empty">История пока пустая. Первая версия появится после успешного сохранения этого раздела.</div>';
            return;
        }

        elements.historyList.innerHTML = entries.map((entry, index) => `
            <article class="admin-media-card${index === 0 ? ' is-current' : ''}">
                <div class="admin-media-card__body">
                    <div class="admin-media-card__title">${index === 0 ? 'Последняя версия' : `Версия ${index + 1}`}</div>
                    <div class="admin-media-card__path">${formatDateTime(entry.savedAt)}</div>
                    <div class="admin-history-card__meta">
                        <span>${entry.action === 'publish' ? 'Отметка публикации' : 'Сохранение'}</span>
                        <span>${entry.savedBy === 'local' ? 'Этот компьютер' : (entry.savedBy || '—')}</span>
                        <span>${entry.label || contentConfigs[state.activeKey].label}</span>
                    </div>
                    ${entry.data ? `
                        <button class="admin-btn admin-btn--primary" type="button" data-history-restore="${entry.id}">
                            <i class="fas fa-rotate-left" aria-hidden="true"></i> Вернуть эту версию
                        </button>
                    ` : `
                        <span class="admin-history-card__note">Это запись без снимка данных.</span>
                    `}
                </div>
            </article>
        `).join('');

        elements.historyList.querySelectorAll('[data-history-restore]').forEach((button) => {
            button.addEventListener('click', () => {
                restoreHistoryEntry(button.getAttribute('data-history-restore') || '');
            });
        });
    }

    function openHistoryModal() {
        if (!elements.historyModal) return;

        renderHistoryModal();
        elements.historyModal.hidden = false;
        state.historyOpen = true;
        document.body.classList.add('admin-media-open');
    }

    function createSectionSummary(title, metaText, iconClass = 'fa-chevron-down') {
        const wrapper = document.createElement('span');
        wrapper.className = 'admin-section__summary';

        const copy = document.createElement('span');
        copy.className = 'admin-section__summary-copy';

        const titleNode = document.createElement('span');
        titleNode.className = 'admin-section__summary-title';
        titleNode.textContent = title;
        copy.appendChild(titleNode);

        if (metaText) {
            const metaNode = document.createElement('span');
            metaNode.className = 'admin-section__summary-meta';
            metaNode.textContent = metaText;
            copy.appendChild(metaNode);
        }

        const icon = document.createElement('span');
        icon.className = 'admin-section__summary-icon';
        icon.innerHTML = `<i class="fas ${iconClass}" aria-hidden="true"></i>`;

        wrapper.append(copy, icon);
        return wrapper;
    }

    function createAdvancedDetails(fields, parentObject, contentKey, description) {
        if (!fields.length) return null;

        const details = document.createElement('details');
        details.className = 'admin-advanced';

        const summary = document.createElement('summary');
        summary.textContent = `Расширенные настройки (${fields.length})`;
        details.appendChild(summary);

        const text = document.createElement('p');
        text.className = 'admin-advanced__text';
        text.textContent = description || 'Здесь скрыты ссылки, иконки, идентификаторы, параметры фото и другие технические поля.';
        details.appendChild(text);

        const grid = document.createElement('div');
        grid.className = 'admin-advanced__grid';
        details.appendChild(grid);

        fields.forEach((field) => {
            const fieldNode = renderField(field, parentObject, contentKey);
            if (fieldNode) {
                grid.appendChild(fieldNode);
            }
        });

        return details;
    }

    function createSecondaryDetails(fields, parentObject, contentKey, description) {
        if (!fields.length) return null;

        const details = document.createElement('details');
        details.className = 'admin-advanced';

        const summary = document.createElement('summary');
        summary.textContent = `Рабочие настройки (${fields.length})`;
        details.appendChild(summary);

        const text = document.createElement('p');
        text.className = 'admin-advanced__text';
        text.textContent = description || 'Здесь находятся ссылки, формы, карты и другие рабочие поля, которые обычно нужны менеджеру, но не обязательны для заказчика.';
        details.appendChild(text);

        const grid = document.createElement('div');
        grid.className = 'admin-advanced__grid';
        details.appendChild(grid);

        fields.forEach((field) => {
            const fieldNode = renderField(field, parentObject, contentKey);
            if (fieldNode) {
                grid.appendChild(fieldNode);
            }
        });

        return details;
    }

    function renderFieldsIntoContainer(container, fields, parentObject, contentKey) {
        fields.forEach((field) => {
            const fieldNode = renderField(field, parentObject, contentKey);
            if (fieldNode) {
                container.appendChild(fieldNode);
            }
        });
    }

    function getArrayItemTitle(field, item, index) {
        if (field.itemType === 'text') {
            const rawValue = String(item || '').trim();
            return rawValue ? rawValue.slice(0, 72) : `${field.itemLabel || 'Элемент'} ${index + 1}`;
        }

        const objectItem = item && typeof item === 'object' ? item : {};
        const candidates = [
            objectItem.title,
            objectItem.label,
            objectItem.question,
            objectItem.meta,
            objectItem.caption,
            objectItem.alt,
            objectItem.eyebrow,
            objectItem.name,
            objectItem.day,
            objectItem.value,
            objectItem.pageKey,
            objectItem.id,
            getFileNameFromPath(objectItem.src)
        ];

        const matchedValue = candidates.find((value) => typeof value === 'string' && value.trim());
        return matchedValue || `${field.itemLabel || 'Элемент'} ${index + 1}`;
    }

    function getArrayItemMeta(field, item) {
        if (field.itemType === 'text') return '';

        const objectItem = item && typeof item === 'object' ? item : {};
        const metaParts = [];

        if (typeof objectItem.text === 'string' && objectItem.text.trim()) {
            metaParts.push(objectItem.text.trim().replace(/\s+/g, ' ').slice(0, 110));
        } else if (typeof objectItem.description === 'string' && objectItem.description.trim()) {
            metaParts.push(objectItem.description.trim().replace(/\s+/g, ' ').slice(0, 110));
        }

        if (typeof objectItem.href === 'string' && objectItem.href.trim()) {
            metaParts.push('Есть ссылка');
        }

        if (typeof objectItem.src === 'string' && objectItem.src.trim()) {
            metaParts.push(`Фото: ${getFileNameFromPath(objectItem.src)}`);
        }

        if (Array.isArray(objectItem.items) && objectItem.items.length) {
            metaParts.push(`Пунктов: ${objectItem.items.length}`);
        }

        if (Array.isArray(objectItem.specs) && objectItem.specs.length) {
            metaParts.push(`Характеристик: ${objectItem.specs.length}`);
        }

        return metaParts.join(' · ');
    }

    function getArrayHelperText(field) {
        const helperMap = {
            slides: 'Слайды можно переставлять мышкой, чтобы поменять порядок показа на сайте.',
            products: 'Карточки можно быстро просмотреть и переставить. Так меняется порядок показа на странице.',
            quickNav: 'Держи подписи короткими, чтобы ссылки легко читались в верхнем меню страницы.',
            quickActions: 'Это быстрые кнопки связи. Обычно здесь лучше держать 2-3 понятных действия.',
            contactLines: 'Телефоны и мессенджеры лучше подписывать так, как их видит клиент.',
            items: 'Элементы списка можно переставлять и дублировать, если нужен похожий блок.',
            facts: 'Факты лучше делать короткими: одна сильная цифра и короткое пояснение.',
            cards: 'Карточки можно переставлять и дублировать, чтобы быстрее собирать похожие блоки.',
            specs: 'Характеристики лучше писать короткими пунктами без длинных абзацев.',
            faq: 'Вопросы и ответы будут показаны как раскрывающийся блок на сайте.'
        };

        if (helperMap[field.key]) {
            return helperMap[field.key];
        }

        if (isMediaArrayField(field)) {
            return 'Фото здесь удобно менять карточками: можно быстро выбрать другое изображение, открыть файл и переставить порядок показа.';
        }

        return '';
    }

    function isMediaArrayField(field) {
        return field?.itemType === 'object'
            && Array.isArray(field.fields)
            && field.fields.some((childField) => childField.key === 'src');
    }

    function slugifyLabel(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/[^a-zа-я0-9]+/gi, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80);
    }

    function renderJumpbar(key) {
        if (!elements.jumpbar) return;

        const config = contentConfigs[key];
        const jumpItems = config.schema.fields
            .map((field) => ({
                id: `admin-top-${key}-${slugifyLabel(field.key || field.label)}`,
                label: field.label || field.key,
                icon: field.type === 'array' ? 'fa-list-ul' : 'fa-layer-group'
            }))
            .filter((item) => item.label);

        if (!jumpItems.length) {
            elements.jumpbar.hidden = true;
            elements.jumpbar.innerHTML = '';
            return;
        }

        elements.jumpbar.hidden = false;
        elements.jumpbar.innerHTML = `
            <h2>Быстрые переходы по разделу</h2>
            <p class="admin-jumpbar__lead">Нажми на нужный блок, чтобы сразу перейти к нему, а не прокручивать всю форму вручную.</p>
            <div class="admin-jumpbar__list">
                ${jumpItems.map((item) => `
                    <a class="admin-jumpbar__link" href="#${item.id}">
                        <i class="fas ${item.icon}" aria-hidden="true"></i>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </div>
        `;
    }

    function setAllSectionStates(open) {
        if (!elements.form) return;

        Array.from(elements.form.querySelectorAll(':scope > details')).forEach((details) => {
            details.open = open;
        });
    }

    function handleBeforeUnload(event) {
        if (!hasDirtyChanges()) return;
        event.preventDefault();
        event.returnValue = '';
    }

    function handleGlobalKeydown(event) {
        if (event.key !== 'Escape') return;

        if (elements.guideModal && !elements.guideModal.hidden) {
            closeGuideModal();
            return;
        }

        if (elements.historyModal && !elements.historyModal.hidden) {
            closeHistoryModal();
            return;
        }

        if (elements.mediaPicker && !elements.mediaPicker.hidden) {
            closeMediaPicker();
        }
    }

    function stripHtmlTags(value) {
        return String(value || '')
            .replace(/<br\s*\/?>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function formatDateTime(value) {
        if (!value) return 'пока нет';
        try {
            return new Date(value).toLocaleString('ru-RU');
        } catch (error) {
            return value;
        }
    }

    function getSectionAdminState(sectionKey) {
        return state.adminState?.sections?.[sectionKey] || null;
    }

    function getSectionStatus(sectionKey) {
        const sectionState = getSectionAdminState(sectionKey);
        const dirty = Boolean(state.dirty[sectionKey]);
        const lastSavedAt = sectionState?.lastSavedAt || null;
        const lastPublishedAt = sectionState?.lastPublishedAt || null;
        const lastSavedTime = lastSavedAt ? new Date(lastSavedAt).getTime() : 0;
        const lastPublishedTime = lastPublishedAt ? new Date(lastPublishedAt).getTime() : 0;

        if (dirty) {
            return {
                tone: 'draft',
                label: 'Черновик',
                description: 'Есть несохранённые правки в этом разделе.'
            };
        }

        if (lastPublishedAt && lastPublishedTime >= lastSavedTime) {
            return {
                tone: 'published',
                label: 'Опубликовано',
                description: 'Последняя сохранённая версия уже отмечена как опубликованная.'
            };
        }

        if (lastSavedAt) {
            return {
                tone: 'saved',
                label: 'Сохранено локально',
                description: 'Изменения уже записаны в файлы проекта, но публикация ещё не подтверждена.'
            };
        }

        return {
            tone: 'idle',
            label: 'Без изменений',
            description: 'Этот раздел пока не редактировали через админку.'
        };
    }

    function collectPreviewSummary(value, result = {
        eyebrows: [],
        titles: [],
        texts: [],
        buttons: [],
        images: []
    }) {
        if (Array.isArray(value)) {
            value.forEach((item) => collectPreviewSummary(item, result));
            return result;
        }

        if (!value || typeof value !== 'object') {
            return result;
        }

        if (typeof value.src === 'string' && isImageLikeValue(value.src)) {
            result.images.push(value.src);
        }

        if (typeof value.eyebrow === 'string' && value.eyebrow.trim()) {
            result.eyebrows.push(stripHtmlTags(value.eyebrow));
        }

        if (typeof value.title === 'string' && value.title.trim()) {
            result.titles.push(stripHtmlTags(value.title));
        }

        if (typeof value.titleHtml === 'string' && value.titleHtml.trim()) {
            result.titles.push(stripHtmlTags(value.titleHtml));
        }

        ['lead', 'subtitle', 'text', 'description', 'valueHtml', 'note'].forEach((key) => {
            if (typeof value[key] === 'string' && value[key].trim()) {
                result.texts.push(stripHtmlTags(value[key]));
            }
        });

        if (typeof value.label === 'string' && value.label.trim() && typeof value.href === 'string' && value.href.trim()) {
            result.buttons.push(stripHtmlTags(value.label));
        }

        if (typeof value.cta === 'string' && value.cta.trim()) {
            result.buttons.push(stripHtmlTags(value.cta));
        }

        if (typeof value.actionLabel === 'string' && value.actionLabel.trim()) {
            result.buttons.push(stripHtmlTags(value.actionLabel));
        }

        Object.values(value).forEach((childValue) => {
            if (childValue && typeof childValue === 'object') {
                collectPreviewSummary(childValue, result);
            }
        });

        return result;
    }

    function getPrimaryPreviewLink(sectionKey) {
        const meta = sectionMeta[sectionKey] || {};
        const previewLinks = Array.isArray(meta.previewLinks) ? meta.previewLinks : [];
        return previewLinks[0] || null;
    }

    function collectSectionStats(value, stats = {
        textCount: 0,
        imageCount: 0,
        linkCount: 0,
        arrayCount: 0,
        fieldCount: 0
    }) {
        if (Array.isArray(value)) {
            stats.arrayCount += 1;
            value.forEach((item) => collectSectionStats(item, stats));
            return stats;
        }

        if (!value || typeof value !== 'object') {
            return stats;
        }

        Object.entries(value).forEach(([key, childValue]) => {
            if (typeof childValue === 'string') {
                const trimmedValue = childValue.trim();
                if (!trimmedValue) return;

                stats.fieldCount += 1;
                if (['title', 'titleHtml', 'lead', 'subtitle', 'text', 'description', 'question', 'answer', 'note', 'valueHtml'].includes(key)) {
                    stats.textCount += 1;
                }
                if (key === 'src' && isImageLikeValue(trimmedValue)) {
                    stats.imageCount += 1;
                }
                if (key === 'href' || key === 'actionHref' || key === 'iframeSrc' || key === 'mapSrc') {
                    stats.linkCount += 1;
                }
            } else if (Array.isArray(childValue) || (childValue && typeof childValue === 'object')) {
                collectSectionStats(childValue, stats);
            }
        });

        return stats;
    }

    function getSectionWorkflowStatus(sectionKey) {
        const status = getSectionStatus(sectionKey);

        if (status.tone === 'draft') {
            return {
                title: 'Шаг 2 из 3: проверь и сохрани',
                text: 'В разделе есть черновые правки. Сначала сохрани их в файлы проекта, потом отметь раздел как опубликованный.'
            };
        }

        if (status.tone === 'saved') {
            return {
                title: 'Шаг 3 из 3: отметь публикацию',
                text: 'Контент уже сохранён в проект. Если всё проверено, можно отметить раздел как опубликованный.'
            };
        }

        if (status.tone === 'published') {
            return {
                title: 'Раздел в порядке',
                text: 'Последняя версия раздела сохранена и уже отмечена как опубликованная.'
            };
        }

        return {
            title: 'Шаг 1 из 3: начни редактирование',
            text: 'Выбери нужный блок, внеси правки и сохрани раздел. Если правок пока нет, этот статус будет оставаться нейтральным.'
        };
    }

    function shouldUseSectionTabs(sectionKey = state.activeKey) {
        const config = contentConfigs[sectionKey];
        return Boolean(config && !config.virtual && state.editorRole === 'customer');
    }

    function getSectionTabFields(sectionKey = state.activeKey) {
        return contentConfigs[sectionKey]?.schema?.fields || [];
    }

    function getSectionTabMeta(field) {
        if (field?.type === 'group') {
            return {
                icon: 'fa-layer-group',
                text: `${Array.isArray(field.fields) ? field.fields.length : 0} подпунктов`
            };
        }

        if (field?.type === 'array') {
            return {
                icon: 'fa-table-cells-large',
                text: field.itemLabel ? `Список: ${field.itemLabel.toLowerCase()}` : 'Список карточек и пунктов'
            };
        }

        return {
            icon: 'fa-heading',
            text: 'Текстовые и служебные поля'
        };
    }

    function getActiveSectionTab(sectionKey = state.activeKey) {
        const fields = getSectionTabFields(sectionKey);
        if (!fields.length) return '';

        const storedValue = state.activeFieldTabs[sectionKey];
        if (storedValue && fields.some((field) => field.key === storedValue)) {
            return storedValue;
        }

        const fallbackValue = fields[0].key;
        state.activeFieldTabs[sectionKey] = fallbackValue;
        return fallbackValue;
    }

    function setActiveSectionTab(sectionKey, fieldKey, options = {}) {
        const fields = getSectionTabFields(sectionKey);
        if (!fields.some((field) => field.key === fieldKey)) return;

        state.activeFieldTabs[sectionKey] = fieldKey;
        state.activeSimpleScreen = null;
        state.searchQuery = '';
        renderActiveSection();

        if (!options.silent) {
            showAlert(`Открыт блок «${getTopLevelFieldLabel(sectionKey, fieldKey)}».`, 'info');
        }
    }

    function getGroupEditorScreenStateKey(contentKey, field) {
        return `${contentKey}:${field.key}`;
    }

    function getGroupEditorScreens(contentKey, field) {
        if (!shouldUseSectionTabs(contentKey) || contentKey !== 'catalogPanels' || field?.type !== 'group' || !Array.isArray(field.fields)) {
            return [];
        }

        const availableKeys = new Set(field.fields.map((childField) => childField.key));
        const screenTemplates = [
            {
                key: 'text',
                icon: 'fa-heading',
                title: 'Текст и заголовки',
                text: 'Хлебные крошки, заголовки, абзацы и бейджи.',
                fieldKeys: ['breadcrumb', 'title', 'introTitle', 'paragraphs', 'badges', 'tailParagraphs', 'sectionHeading']
            },
            {
                key: 'cards',
                icon: 'fa-table-cells-large',
                title: 'Карточки и списки',
                text: 'Информационные карточки и блоки характеристик.',
                fieldKeys: ['cards', 'specGroups']
            },
            {
                key: 'faq-palette',
                icon: 'fa-swatchbook',
                title: 'Вопросы и цвета',
                text: 'FAQ, палитры и цветовые блоки.',
                fieldKeys: ['faq', 'palette']
            },
            {
                key: 'products',
                icon: 'fa-box-open',
                title: 'Товары и шаги',
                text: 'Шаги выбора и карточки товаров или комплектов.',
                fieldKeys: ['steps', 'products']
            },
            {
                key: 'cta',
                icon: 'fa-bullhorn',
                title: 'Нижний блок связи',
                text: 'Финальный призыв и нижний CTA.',
                fieldKeys: ['cta']
            }
        ];

        return screenTemplates
            .map((screen) => ({
                ...screen,
                fieldKeys: screen.fieldKeys.filter((fieldKey) => availableKeys.has(fieldKey))
            }))
            .filter((screen) => screen.fieldKeys.length);
    }

    function getActiveGroupEditorScreen(contentKey, field) {
        const screens = getGroupEditorScreens(contentKey, field);
        if (!screens.length) return null;

        const stateKey = getGroupEditorScreenStateKey(contentKey, field);
        const storedValue = state.activeGroupScreens[stateKey];
        const matchedScreen = screens.find((screen) => screen.key === storedValue);
        if (matchedScreen) {
            return matchedScreen;
        }

        state.activeGroupScreens[stateKey] = screens[0].key;
        return screens[0];
    }

    function setActiveGroupEditorScreen(contentKey, field, screenKey, options = {}) {
        const screens = getGroupEditorScreens(contentKey, field);
        if (!screens.some((screen) => screen.key === screenKey)) return;

        state.activeGroupScreens[getGroupEditorScreenStateKey(contentKey, field)] = screenKey;
        renderActiveSection();

        if (!options.silent) {
            const activeScreen = screens.find((screen) => screen.key === screenKey);
            showAlert(`Открыт экран «${activeScreen?.title || 'Блок'}» в карточке «${getDisplayLabel(field)}».`, 'info');
        }
    }

    function shouldUseCompactContactEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'site'
            && field?.type === 'group'
            && field?.key === 'contact';
    }

    function shouldUseCompactRequestEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'home'
            && field?.type === 'group'
            && field?.key === 'request';
    }

    function shouldUseCompactCatalogCtaEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'catalog'
            && field?.type === 'group'
            && field?.key === 'cta';
    }

    function shouldUseCompactHomeHeroEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'home'
            && field?.type === 'group'
            && field?.key === 'hero';
    }

    function shouldUseCompactCatalogGroupsEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'catalog'
            && field?.type === 'array'
            && field?.key === 'groups'
            && field?.itemType === 'object';
    }

    function shouldUseCompactAutomationPanelEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'catalogPanels'
            && field?.type === 'group'
            && ['automationSliding', 'automationSwing', 'automationComponents'].includes(field?.key);
    }

    function shouldUseCompactGarageProtectionPanelEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'catalogPanels'
            && field?.type === 'group'
            && ['sectional', 'roller', 'shutters', 'grilles'].includes(field?.key);
    }

    function shouldUseCompactLocationEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'contacts'
            && field?.type === 'group'
            && field?.key === 'location';
    }

    function shouldUseCompactServicePageEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'servicePages'
            && field?.type === 'group'
            && ['powderCoating', 'sandblasting'].includes(field?.key);
    }

    function shouldUseCompactGalleryEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'gallery'
            && (
                (field?.type === 'group' && ['header', 'counter', 'cta'].includes(field?.key))
                || (field?.type === 'array' && field?.key === 'filters')
            );
    }

    function shouldUseCompactPricesEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'prices'
            && field?.type === 'group'
            && ['header', 'factors', 'calculator', 'guarantee', 'cta', 'faq'].includes(field?.key);
    }

    function shouldUseCompactPaymentDocumentsEditor(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'paymentDocuments'
            && field?.type === 'group'
            && ['hero', 'benefits', 'workflow', 'cta'].includes(field?.key);
    }

    function shouldHideStandaloneCompactField(contentKey, field) {
        return shouldUseSectionTabs(contentKey)
            && contentKey === 'gallery'
            && field?.key === 'showMoreLabel';
    }

    function createCompactContactCard(childField, targetObject, contentKey, options = {}) {
        if (!childField) return null;

        const card = document.createElement('section');
        card.className = `admin-contact-quick__card${options.wide ? ' is-wide' : ''}`;
        card.innerHTML = `
            <div class="admin-contact-quick__card-head">
                <div class="admin-contact-quick__card-icon"><i class="fas ${options.icon || 'fa-rectangle-list'}" aria-hidden="true"></i></div>
                <div>
                    <h3>${options.title || getDisplayLabel(childField)}</h3>
                    ${options.text ? `<p>${options.text}</p>` : ''}
                </div>
            </div>
        `;

        const body = document.createElement('div');
        body.className = 'admin-contact-quick__card-body';

        if (childField.type === 'group') {
            const targetValue = targetObject[childField.key] ?? createDefaultValue(childField);
            targetObject[childField.key] = targetValue;
            const grid = document.createElement('div');
            grid.className = 'admin-grid admin-grid--two';
            renderFieldsIntoContainer(grid, childField.fields, targetValue, contentKey);
            body.appendChild(grid);
        } else {
            const grid = document.createElement('div');
            grid.className = options.singleColumn ? 'admin-grid' : 'admin-grid admin-grid--two';
            renderFieldsIntoContainer(grid, [childField], targetObject, contentKey);
            body.appendChild(grid);
        }

        card.appendChild(body);
        return card;
    }

    function renderCompactContactEditor(field, value, contentKey) {
        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-contact';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, 'Телефоны, мессенджеры и адрес сайта', 'fa-phone'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-contact-quick';
        panel.innerHTML = `
            <div class="admin-contact-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">Удобный режим контактов</p>
                    <h2>Телефоны и контакты сайта</h2>
                    <p>Здесь удобно менять основные номера, мессенджеры, адрес, почту и режим работы без лишнего поиска по сайту.</p>
                </div>
                <span class="admin-status-badge is-idle">Удобный режим</span>
            </div>
        `;

        const fieldMap = new Map(field.fields.map((childField) => [childField.key, childField]));
        const cards = [
            createCompactContactCard(fieldMap.get('primaryPhone'), value, contentKey, {
                icon: 'fa-phone',
                title: 'Основной телефон',
                text: 'Главный номер в шапке и основных блоках связи.'
            }),
            createCompactContactCard(fieldMap.get('secondaryPhone'), value, contentKey, {
                icon: 'fa-mobile-screen-button',
                title: 'Второй телефон',
                text: 'Дополнительный номер для каталога и контактов.'
            }),
            createCompactContactCard(fieldMap.get('telegram'), value, contentKey, {
                icon: 'fa-paper-plane',
                title: 'Telegram',
                text: 'Подпись и ссылка на быстрый переход в мессенджер.'
            }),
            createCompactContactCard(fieldMap.get('max'), value, contentKey, {
                icon: 'fa-comments',
                title: 'Max',
                text: 'Дополнительный канал связи, если вы его используете.'
            })
        ].filter(Boolean);

        const cardGrid = document.createElement('div');
        cardGrid.className = 'admin-contact-quick__grid';
        cards.forEach((card) => cardGrid.appendChild(card));
        panel.appendChild(cardGrid);

        const detailsCard = document.createElement('div');
        detailsCard.className = 'admin-contact-quick__details';
        const secondaryCards = [
            createCompactContactCard(fieldMap.get('address'), value, contentKey, {
                icon: 'fa-location-dot',
                title: 'Адрес',
                text: 'Показывается в контактах и в общих блоках сайта.',
                wide: true,
                singleColumn: true
            }),
            createCompactContactCard(fieldMap.get('email'), value, contentKey, {
                icon: 'fa-envelope',
                title: 'Почта',
                text: 'Рабочий email для связи и заявок.'
            }),
            createCompactContactCard(fieldMap.get('hours'), value, contentKey, {
                icon: 'fa-clock',
                title: 'Режим работы',
                text: 'Часы работы, которые видит клиент.'
            })
        ].filter(Boolean);
        secondaryCards.forEach((card) => detailsCard.appendChild(card));
        panel.appendChild(detailsCard);

        details.appendChild(panel);
        return details;
    }

    function renderCompactRequestEditor(field, value, contentKey) {
        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-request';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, 'Заявка, контакты и быстрые кнопки на главной', 'fa-paper-plane'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-request-quick';
        panel.innerHTML = `
            <div class="admin-request-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">Удобный режим заявки</p>
                    <h2>Форма и быстрый контакт на главной</h2>
                    <p>Здесь удобно менять тексты блока заявки, быстрый контакт, кнопки и встроенную форму без всей главной страницы.</p>
                </div>
                <span class="admin-status-badge is-idle">Удобный режим</span>
            </div>
        `;

        const fieldMap = new Map(field.fields.map((childField) => [childField.key, childField]));

        const topGrid = document.createElement('div');
        topGrid.className = 'admin-request-quick__grid';

        const heroCard = document.createElement('section');
        heroCard.className = 'admin-request-quick__card';
        heroCard.innerHTML = `
            <div class="admin-request-quick__card-head">
                <div class="admin-request-quick__card-icon"><i class="fas fa-heading" aria-hidden="true"></i></div>
                <div>
                    <h3>Тексты блока</h3>
                    <p>Верхние подписи, заголовок и короткие акценты рядом с формой.</p>
                </div>
            </div>
        `;
        const heroGrid = document.createElement('div');
        heroGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            heroGrid,
            ['eyebrow', 'titleHtml', 'lead', 'facts', 'advantages']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        heroCard.appendChild(heroGrid);
        topGrid.appendChild(heroCard);

        const contactCard = document.createElement('section');
        contactCard.className = 'admin-request-quick__card';
        contactCard.innerHTML = `
            <div class="admin-request-quick__card-head">
                <div class="admin-request-quick__card-icon"><i class="fas fa-phone" aria-hidden="true"></i></div>
                <div>
                    <h3>Быстрый контакт</h3>
                    <p>Заголовок контактов и список телефонов и мессенджеров рядом.</p>
                </div>
            </div>
        `;
        const contactGrid = document.createElement('div');
        contactGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            contactGrid,
            ['contactTitle', 'contactIntro', 'contactLines']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        contactCard.appendChild(contactGrid);
        topGrid.appendChild(contactCard);

        panel.appendChild(topGrid);

        const bottomGrid = document.createElement('div');
        bottomGrid.className = 'admin-request-quick__grid admin-request-quick__grid--bottom';

        const formCard = document.createElement('section');
        formCard.className = 'admin-request-quick__card';
        formCard.innerHTML = `
            <div class="admin-request-quick__card-head">
                <div class="admin-request-quick__card-icon"><i class="fas fa-rectangle-list" aria-hidden="true"></i></div>
                <div>
                    <h3>Форма заявки</h3>
                    <p>Заголовок формы, пояснение и ссылка на встроенную форму.</p>
                </div>
            </div>
        `;
        const formGrid = document.createElement('div');
        formGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            formGrid,
            ['formEyebrow', 'formTitle', 'formNotice', 'iframeSrc']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        formCard.appendChild(formGrid);
        bottomGrid.appendChild(formCard);

        const actionCard = document.createElement('section');
        actionCard.className = 'admin-request-quick__card';
        actionCard.innerHTML = `
            <div class="admin-request-quick__card-head">
                <div class="admin-request-quick__card-icon"><i class="fas fa-bolt" aria-hidden="true"></i></div>
                <div>
                    <h3>Быстрые кнопки</h3>
                    <p>Кнопки «Позвонить», «Max», «Telegram» и другие быстрые действия.</p>
                </div>
            </div>
        `;
        const actionGrid = document.createElement('div');
        actionGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            actionGrid,
            ['quickActions']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        actionCard.appendChild(actionGrid);
        bottomGrid.appendChild(actionCard);

        panel.appendChild(bottomGrid);

        details.appendChild(panel);
        return details;
    }

    function renderCompactCatalogCtaEditor(field, value, contentKey) {
        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-catalog-cta';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, 'Нижний призыв и контакты в каталоге', 'fa-bullhorn'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-catalog-cta-quick';
        panel.innerHTML = `
            <div class="admin-catalog-cta-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">Удобный режим каталога</p>
                    <h2>Нижний блок связи каталога</h2>
                    <p>Здесь удобно менять завершающий призыв и контакты внизу каталога без всей страницы каталога.</p>
                </div>
                <span class="admin-status-badge is-idle">Удобный режим</span>
            </div>
        `;

        const fieldMap = new Map(field.fields.map((childField) => [childField.key, childField]));

        const grid = document.createElement('div');
        grid.className = 'admin-catalog-cta-quick__grid';

        const textCard = document.createElement('section');
        textCard.className = 'admin-catalog-cta-quick__card';
        textCard.innerHTML = `
            <div class="admin-catalog-cta-quick__card-head">
                <div class="admin-catalog-cta-quick__card-icon"><i class="fas fa-heading" aria-hidden="true"></i></div>
                <div>
                    <h3>Текст нижнего блока</h3>
                    <p>Заголовок и пояснение, которые видит человек перед контактами.</p>
                </div>
            </div>
        `;
        const textGrid = document.createElement('div');
        textGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            textGrid,
            ['title', 'text']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        textCard.appendChild(textGrid);
        grid.appendChild(textCard);

        const contactsCard = document.createElement('section');
        contactsCard.className = 'admin-catalog-cta-quick__card';
        contactsCard.innerHTML = `
            <div class="admin-catalog-cta-quick__card-head">
                <div class="admin-catalog-cta-quick__card-icon"><i class="fas fa-address-book" aria-hidden="true"></i></div>
                <div>
                    <h3>Контакты снизу каталога</h3>
                    <p>Телефоны и почта, которые выводятся в завершающем блоке.</p>
                </div>
            </div>
        `;
        const contactsGrid = document.createElement('div');
        contactsGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            contactsGrid,
            ['contacts']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        contactsCard.appendChild(contactsGrid);
        grid.appendChild(contactsCard);

        panel.appendChild(grid);
        details.appendChild(panel);
        return details;
    }

    function renderCompactHomeHeroEditor(field, value, contentKey) {
        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-home-hero';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, 'Главный экран, преимущества и главная кнопка', 'fa-house'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-home-hero-quick';
        panel.innerHTML = `
            <div class="admin-home-hero-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">Удобный режим первого экрана</p>
                    <h2>Главный блок на главной странице</h2>
                    <p>Здесь удобно менять главный заголовок, подзаголовок, короткий список, преимущества и основную кнопку без всей главной страницы.</p>
                </div>
                <span class="admin-status-badge is-idle">Удобный режим</span>
            </div>
        `;

        const fieldMap = new Map(field.fields.map((childField) => [childField.key, childField]));

        const grid = document.createElement('div');
        grid.className = 'admin-home-hero-quick__grid';

        const textCard = document.createElement('section');
        textCard.className = 'admin-home-hero-quick__card';
        textCard.innerHTML = `
            <div class="admin-home-hero-quick__card-head">
                <div class="admin-home-hero-quick__card-icon"><i class="fas fa-heading" aria-hidden="true"></i></div>
                <div>
                    <h3>Главный текст</h3>
                    <p>Основной заголовок, подзаголовок и сильная подпись.</p>
                </div>
            </div>
        `;
        const textGrid = document.createElement('div');
        textGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            textGrid,
            ['titleMain', 'titleSub', 'subtitleStrong']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        textCard.appendChild(textGrid);
        grid.appendChild(textCard);

        const listCard = document.createElement('section');
        listCard.className = 'admin-home-hero-quick__card';
        listCard.innerHTML = `
            <div class="admin-home-hero-quick__card-head">
                <div class="admin-home-hero-quick__card-icon"><i class="fas fa-list-check" aria-hidden="true"></i></div>
                <div>
                    <h3>Пункты и преимущества</h3>
                    <p>Короткий список услуг и три преимущества рядом с первым экраном.</p>
                </div>
            </div>
        `;
        const listGrid = document.createElement('div');
        listGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            listGrid,
            ['bulletPoints', 'features']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        listCard.appendChild(listGrid);
        grid.appendChild(listCard);

        const actionCard = document.createElement('section');
        actionCard.className = 'admin-home-hero-quick__card is-wide';
        actionCard.innerHTML = `
            <div class="admin-home-hero-quick__card-head">
                <div class="admin-home-hero-quick__card-icon"><i class="fas fa-bolt" aria-hidden="true"></i></div>
                <div>
                    <h3>Главная кнопка</h3>
                    <p>Главное действие в первом экране: подпись, ссылка и иконка.</p>
                </div>
            </div>
        `;
        const actionGrid = document.createElement('div');
        actionGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            actionGrid,
            ['primaryAction']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        actionCard.appendChild(actionGrid);
        grid.appendChild(actionCard);

        panel.appendChild(grid);
        details.appendChild(panel);
        return details;
    }

    function renderCompactCatalogGroupsEditor(field, parentObject, contentKey) {
        const array = Array.isArray(parentObject[field.key]) ? parentObject[field.key] : [];
        parentObject[field.key] = array;

        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-catalog-groups';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, 'Основные группы каталога и ссылки внутри них', 'fa-folder-tree'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-catalog-groups-quick';
        panel.innerHTML = `
            <div class="admin-catalog-groups-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">Удобный режим групп каталога</p>
                    <h2>Группы на странице каталога</h2>
                    <p>Здесь удобно менять названия групп, короткие описания и список ссылок внутри каждой группы без длинной формы каталога.</p>
                </div>
                <span class="admin-status-badge is-idle">${array.length} группы</span>
            </div>
        `;

        const list = document.createElement('div');
        list.className = 'admin-catalog-groups-quick__list';

        const visibleFields = ['eyebrow', 'title', 'text', 'links'];

        array.forEach((item, index) => {
            const itemObject = item && typeof item === 'object' ? item : {};
            array[index] = itemObject;

            const card = document.createElement('section');
            card.className = 'admin-catalog-groups-quick__card';
            card.innerHTML = `
                <div class="admin-catalog-groups-quick__card-head">
                    <div class="admin-catalog-groups-quick__card-icon"><i class="fas fa-layer-group" aria-hidden="true"></i></div>
                    <div>
                        <h3>${itemObject.title || `${field.itemLabel || 'Группа'} ${index + 1}`}</h3>
                        <p>${itemObject.key ? `Ключ группы: ${itemObject.key}` : 'Название, короткое описание и ссылки внутри группы.'}</p>
                    </div>
                </div>
            `;

            const grid = document.createElement('div');
            grid.className = 'admin-grid';
            renderFieldsIntoContainer(
                grid,
                field.fields.filter((childField) => visibleFields.includes(childField.key)),
                itemObject,
                contentKey
            );
            card.appendChild(grid);
            list.appendChild(card);
        });

        panel.appendChild(list);
        details.appendChild(panel);
        return details;
    }

    function renderCompactAutomationPanelEditor(field, value, contentKey) {
        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-automation';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, 'Тексты, комплекты и нижний блок автоматики', 'fa-robot'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-automation-quick';
        panel.innerHTML = `
            <div class="admin-automation-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">Удобный режим автоматики</p>
                    <h2>${getDisplayLabel(field)}</h2>
                    <p>Здесь удобно менять вводный блок, шаги выбора или пояснения, карточки комплектов и нижний призыв без длинной формы карточки каталога.</p>
                </div>
                <span class="admin-status-badge is-idle">Удобный режим</span>
            </div>
        `;

        const fieldMap = new Map(field.fields.map((childField) => [childField.key, childField]));
        const hasSteps = fieldMap.has('steps');
        const hasCards = fieldMap.has('cards');
        const hasSpecGroups = fieldMap.has('specGroups');

        const topGrid = document.createElement('div');
        topGrid.className = 'admin-automation-quick__grid';

        const heroCard = document.createElement('section');
        heroCard.className = 'admin-automation-quick__card';
        heroCard.innerHTML = `
            <div class="admin-automation-quick__card-head">
                <div class="admin-automation-quick__card-icon"><i class="fas fa-heading" aria-hidden="true"></i></div>
                <div>
                    <h3>Вводный блок</h3>
                    <p>Хлебные крошки, заголовок, вводный текст и бейджи сверху.</p>
                </div>
            </div>
        `;
        const heroGrid = document.createElement('div');
        heroGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            heroGrid,
            ['breadcrumb', 'title', 'introTitle', 'paragraphs', 'badges', 'tailParagraphs']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        heroCard.appendChild(heroGrid);
        topGrid.appendChild(heroCard);

        const logicCard = document.createElement('section');
        logicCard.className = 'admin-automation-quick__card';
        logicCard.innerHTML = `
            <div class="admin-automation-quick__card-head">
                <div class="admin-automation-quick__card-icon"><i class="fas fa-list-check" aria-hidden="true"></i></div>
                <div>
                    <h3>${hasSteps ? 'Шаги выбора' : 'Пояснения и блоки'}</h3>
                    <p>${hasSteps ? 'Шаги, по которым клиент выбирает автоматику.' : 'Вспомогательные карточки и пояснения внутри блока автоматики.'}</p>
                </div>
            </div>
        `;
        const logicGrid = document.createElement('div');
        logicGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            logicGrid,
            ['sectionHeading', 'steps', 'cards', 'specGroups']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        logicCard.appendChild(logicGrid);
        topGrid.appendChild(logicCard);

        panel.appendChild(topGrid);

        const bottomGrid = document.createElement('div');
        bottomGrid.className = 'admin-automation-quick__grid admin-automation-quick__grid--bottom';

        const productsCard = document.createElement('section');
        productsCard.className = 'admin-automation-quick__card';
        productsCard.innerHTML = `
            <div class="admin-automation-quick__card-head">
                <div class="admin-automation-quick__card-icon"><i class="fas fa-box-open" aria-hidden="true"></i></div>
                <div>
                    <h3>${field.key === 'automationComponents' ? 'Комплектующие и аксессуары' : 'Готовые комплекты'}</h3>
                    <p>${field.key === 'automationComponents' ? 'Карточки аксессуаров и комплектующих с ссылками на подробные страницы.' : 'Карточки комплектов, которые открывает посетитель в каталоге.'}</p>
                </div>
            </div>
        `;
        const productsGrid = document.createElement('div');
        productsGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            productsGrid,
            ['products']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        productsCard.appendChild(productsGrid);
        bottomGrid.appendChild(productsCard);

        const ctaCard = document.createElement('section');
        ctaCard.className = 'admin-automation-quick__card';
        ctaCard.innerHTML = `
            <div class="admin-automation-quick__card-head">
                <div class="admin-automation-quick__card-icon"><i class="fas fa-bullhorn" aria-hidden="true"></i></div>
                <div>
                    <h3>Нижний блок связи</h3>
                    <p>Финальный призыв и короткое пояснение под карточкой автоматики.</p>
                </div>
            </div>
        `;
        const ctaGrid = document.createElement('div');
        ctaGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            ctaGrid,
            ['cta']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        ctaCard.appendChild(ctaGrid);
        bottomGrid.appendChild(ctaCard);

        panel.appendChild(bottomGrid);
        details.appendChild(panel);
        return details;
    }

    function renderCompactGarageProtectionPanelEditor(field, value, contentKey) {
        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-garage';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, 'Тексты, характеристики, цвета и нижний блок раздела', 'fa-shield-halved'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-garage-quick';
        panel.innerHTML = `
            <div class="admin-garage-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">Удобный режим гаража и защиты</p>
                    <h2>${getDisplayLabel(field)}</h2>
                    <p>Здесь удобно менять вводный текст, характеристики, цвета и нижний призыв без длинной карточки каталога.</p>
                </div>
                <span class="admin-status-badge is-idle">Удобный режим</span>
            </div>
        `;

        const fieldMap = new Map(field.fields.map((childField) => [childField.key, childField]));
        const extraFields = ['sectionHeading', 'specGroups', 'palette', 'faq']
            .map((key) => fieldMap.get(key))
            .filter(Boolean);

        const topGrid = document.createElement('div');
        topGrid.className = 'admin-garage-quick__grid';

        const heroCard = document.createElement('section');
        heroCard.className = 'admin-garage-quick__card';
        heroCard.innerHTML = `
            <div class="admin-garage-quick__card-head">
                <div class="admin-garage-quick__card-icon"><i class="fas fa-heading" aria-hidden="true"></i></div>
                <div>
                    <h3>Вводный блок</h3>
                    <p>Хлебные крошки, заголовок, описание, бейджи и дополнительные абзацы сверху.</p>
                </div>
            </div>
        `;
        const heroGrid = document.createElement('div');
        heroGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            heroGrid,
            ['breadcrumb', 'title', 'introTitle', 'paragraphs', 'badges', 'tailParagraphs']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        heroCard.appendChild(heroGrid);
        topGrid.appendChild(heroCard);

        const cardsCard = document.createElement('section');
        cardsCard.className = 'admin-garage-quick__card';
        cardsCard.innerHTML = `
            <div class="admin-garage-quick__card-head">
                <div class="admin-garage-quick__card-icon"><i class="fas fa-table-list" aria-hidden="true"></i></div>
                <div>
                    <h3>Характеристики и карточки</h3>
                    <p>Основные смысловые карточки раздела: характеристики, применение, варианты панелей и другие ключевые блоки.</p>
                </div>
            </div>
        `;
        const cardsGrid = document.createElement('div');
        cardsGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            cardsGrid,
            ['cards']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        cardsCard.appendChild(cardsGrid);
        topGrid.appendChild(cardsCard);

        panel.appendChild(topGrid);

        const bottomGrid = document.createElement('div');
        bottomGrid.className = 'admin-garage-quick__grid admin-garage-quick__grid--bottom';

        if (extraFields.length) {
            const extraCard = document.createElement('section');
            extraCard.className = 'admin-garage-quick__card';
            extraCard.innerHTML = `
                <div class="admin-garage-quick__card-head">
                    <div class="admin-garage-quick__card-icon"><i class="fas fa-layer-group" aria-hidden="true"></i></div>
                    <div>
                        <h3>Дополнительные блоки</h3>
                        <p>Палитра, схемы, вопросы и другие дополняющие элементы этого раздела.</p>
                    </div>
                </div>
            `;
            const extraGrid = document.createElement('div');
            extraGrid.className = 'admin-grid';
            renderFieldsIntoContainer(extraGrid, extraFields, value, contentKey);
            extraCard.appendChild(extraGrid);
            bottomGrid.appendChild(extraCard);
        }

        const ctaCard = document.createElement('section');
        ctaCard.className = `admin-garage-quick__card${extraFields.length ? '' : ' is-wide'}`;
        ctaCard.innerHTML = `
            <div class="admin-garage-quick__card-head">
                <div class="admin-garage-quick__card-icon"><i class="fas fa-bullhorn" aria-hidden="true"></i></div>
                <div>
                    <h3>Нижний блок связи</h3>
                    <p>Финальный призыв и короткий текст, который завершает карточку каталога.</p>
                </div>
            </div>
        `;
        const ctaGrid = document.createElement('div');
        ctaGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            ctaGrid,
            ['cta']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        ctaCard.appendChild(ctaGrid);
        bottomGrid.appendChild(ctaCard);

        panel.appendChild(bottomGrid);
        details.appendChild(panel);
        return details;
    }

    function renderCompactLocationEditor(field, value, contentKey) {
        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-location';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, 'Карта, ориентиры и действия на странице контактов', 'fa-map-location-dot'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-location-quick';
        panel.innerHTML = `
            <div class="admin-location-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">Удобный режим контактов</p>
                    <h2>Карта и ориентиры</h2>
                    <p>Здесь удобно править нижний блок страницы контактов: заголовок, краткое описание, ориентиры, кнопки маршрута и саму карту.</p>
                </div>
                <span class="admin-status-badge is-idle">Удобный режим</span>
            </div>
        `;

        const fieldMap = new Map(field.fields.map((childField) => [childField.key, childField]));
        const grid = document.createElement('div');
        grid.className = 'admin-location-quick__grid';

        const textCard = document.createElement('section');
        textCard.className = 'admin-location-quick__card';
        textCard.innerHTML = `
            <div class="admin-location-quick__card-head">
                <div class="admin-location-quick__card-icon"><i class="fas fa-heading" aria-hidden="true"></i></div>
                <div>
                    <h3>Заголовок и описание</h3>
                    <p>Надпись, заголовок и поясняющий текст над картой.</p>
                </div>
            </div>
        `;
        const textGrid = document.createElement('div');
        textGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            textGrid,
            ['kicker', 'title', 'text']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        textCard.appendChild(textGrid);
        grid.appendChild(textCard);

        const mapCard = document.createElement('section');
        mapCard.className = 'admin-location-quick__card';
        mapCard.innerHTML = `
            <div class="admin-location-quick__card-head">
                <div class="admin-location-quick__card-icon"><i class="fas fa-map" aria-hidden="true"></i></div>
                <div>
                    <h3>Карта и быстрые действия</h3>
                    <p>Ссылка на карту и кнопки вроде «Открыть маршрут» и «Позвонить перед визитом».</p>
                </div>
            </div>
        `;
        const mapGrid = document.createElement('div');
        mapGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            mapGrid,
            ['mapSrc', 'actions']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        mapCard.appendChild(mapGrid);
        grid.appendChild(mapCard);

        const listsCard = document.createElement('section');
        listsCard.className = 'admin-location-quick__card is-wide';
        listsCard.innerHTML = `
            <div class="admin-location-quick__card-head">
                <div class="admin-location-quick__card-icon"><i class="fas fa-list-ul" aria-hidden="true"></i></div>
                <div>
                    <h3>Бейджи и ориентиры</h3>
                    <p>Короткие бейджи и список ориентиров, которые помогают найти производство.</p>
                </div>
            </div>
        `;
        const listsGrid = document.createElement('div');
        listsGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            listsGrid,
            ['badges', 'points']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        listsCard.appendChild(listsGrid);
        grid.appendChild(listsCard);

        panel.appendChild(grid);
        details.appendChild(panel);
        return details;
    }

    function renderCompactServicePageEditor(field, value, contentKey) {
        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-service-page';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, 'Шапка, услуги, CTA и FAQ сервисной страницы', 'fa-spray-can-sparkles'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-service-page-quick';
        panel.innerHTML = `
            <div class="admin-service-page-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">Удобный режим страницы услуги</p>
                    <h2>${getDisplayLabel(field)}</h2>
                    <p>Здесь удобно править шапку страницы, навигацию, карточки услуг, нижний блок связи и FAQ без всей структуры страницы.</p>
                </div>
                <span class="admin-status-badge is-idle">Удобный режим</span>
            </div>
        `;

        const fieldMap = new Map(field.fields.map((childField) => [childField.key, childField]));

        const topGrid = document.createElement('div');
        topGrid.className = 'admin-service-page-quick__grid';

        const headerCard = document.createElement('section');
        headerCard.className = 'admin-service-page-quick__card';
        headerCard.innerHTML = `
            <div class="admin-service-page-quick__card-head">
                <div class="admin-service-page-quick__card-icon"><i class="fas fa-heading" aria-hidden="true"></i></div>
                <div>
                    <h3>Шапка и навигация</h3>
                    <p>Заголовок страницы, подзаголовок и быстрые ссылки по разделам.</p>
                </div>
            </div>
        `;
        const headerGrid = document.createElement('div');
        headerGrid.className = 'admin-grid admin-grid--two';
        renderFieldsIntoContainer(
            headerGrid,
            ['header', 'quickNav', 'beforeAfter']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        headerCard.appendChild(headerGrid);
        topGrid.appendChild(headerCard);

        const sectionsCard = document.createElement('section');
        sectionsCard.className = 'admin-service-page-quick__card';
        sectionsCard.innerHTML = `
            <div class="admin-service-page-quick__card-head">
                <div class="admin-service-page-quick__card-icon"><i class="fas fa-layer-group" aria-hidden="true"></i></div>
                <div>
                    <h3>Карточки услуг</h3>
                    <p>Основные разделы страницы: услуги, преимущества, этапы и дополнительные блоки внутри карточек.</p>
                </div>
            </div>
        `;
        const sectionsGrid = document.createElement('div');
        sectionsGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            sectionsGrid,
            ['sections']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        sectionsCard.appendChild(sectionsGrid);
        topGrid.appendChild(sectionsCard);

        panel.appendChild(topGrid);

        const bottomGrid = document.createElement('div');
        bottomGrid.className = 'admin-service-page-quick__grid admin-service-page-quick__grid--bottom';

        const ctaCard = document.createElement('section');
        ctaCard.className = 'admin-service-page-quick__card';
        ctaCard.innerHTML = `
            <div class="admin-service-page-quick__card-head">
                <div class="admin-service-page-quick__card-icon"><i class="fas fa-bullhorn" aria-hidden="true"></i></div>
                <div>
                    <h3>Нижний блок связи</h3>
                    <p>Заголовок, описание, кнопка и телефоны в конце страницы.</p>
                </div>
            </div>
        `;
        const ctaGrid = document.createElement('div');
        ctaGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            ctaGrid,
            ['cta']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        ctaCard.appendChild(ctaGrid);
        bottomGrid.appendChild(ctaCard);

        const faqCard = document.createElement('section');
        faqCard.className = 'admin-service-page-quick__card';
        faqCard.innerHTML = `
            <div class="admin-service-page-quick__card-head">
                <div class="admin-service-page-quick__card-icon"><i class="fas fa-circle-question" aria-hidden="true"></i></div>
                <div>
                    <h3>Вопросы и ответы</h3>
                    <p>Частые вопросы, которые закрывают возражения на странице.</p>
                </div>
            </div>
        `;
        const faqGrid = document.createElement('div');
        faqGrid.className = 'admin-grid';
        renderFieldsIntoContainer(
            faqGrid,
            ['faq']
                .map((key) => fieldMap.get(key))
                .filter(Boolean),
            value,
            contentKey
        );
        faqCard.appendChild(faqGrid);
        bottomGrid.appendChild(faqCard);

        panel.appendChild(bottomGrid);
        details.appendChild(panel);
        return details;
    }

    function createCompactQuickShell(field, contentKey, options = {}) {
        const details = document.createElement('details');
        details.className = 'admin-section admin-section--compact-service-page';
        details.open = true;
        details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
        details.dataset.fieldKey = field.key;
        details.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        summary.appendChild(createSectionSummary(field.label || field.key, options.summary || '', options.summaryIcon || 'fa-rectangle-list'));
        details.appendChild(summary);

        const panel = document.createElement('div');
        panel.className = 'admin-service-page-quick';
        panel.innerHTML = `
            <div class="admin-service-page-quick__intro">
                <div>
                    <p class="admin-toolbar__eyebrow">${options.eyebrow || 'Удобный режим'}</p>
                    <h2>${options.title || getDisplayLabel(field)}</h2>
                    <p>${options.text || 'Здесь удобно менять основные тексты и блоки без длинной формы.'}</p>
                </div>
                <span class="admin-status-badge is-idle">${options.badge || 'Удобный режим'}</span>
            </div>
        `;

        return { details, panel };
    }

    function createCompactQuickCard(options = {}) {
        const card = document.createElement('section');
        card.className = `admin-service-page-quick__card${options.wide ? ' is-wide' : ''}`;
        card.innerHTML = `
            <div class="admin-service-page-quick__card-head">
                <div class="admin-service-page-quick__card-icon"><i class="fas ${options.icon || 'fa-rectangle-list'}" aria-hidden="true"></i></div>
                <div>
                    <h3>${options.title || 'Блок'}</h3>
                    ${options.text ? `<p>${options.text}</p>` : ''}
                </div>
            </div>
        `;
        return card;
    }

    function renderConfiguredCompactGroupEditor(field, value, contentKey, config) {
        const { details, panel } = createCompactQuickShell(field, contentKey, config);
        const fieldMap = new Map(field.fields.map((childField) => [childField.key, childField]));
        const rows = config.rows || [config.cards || []];

        rows.forEach((row, rowIndex) => {
            const resolvedCards = row
                .map((cardConfig) => {
                    const fields = (cardConfig.fieldKeys || [])
                        .map((fieldKey) => fieldMap.get(fieldKey))
                        .filter(Boolean);

                    if (!fields.length) return null;

                    return { cardConfig, fields };
                })
                .filter(Boolean);

            if (!resolvedCards.length) return;

            const rowNode = document.createElement('div');
            rowNode.className = rowIndex === 0
                ? 'admin-service-page-quick__grid'
                : 'admin-service-page-quick__grid admin-service-page-quick__grid--bottom';

            resolvedCards.forEach(({ cardConfig, fields }) => {
                const card = createCompactQuickCard(cardConfig);
                const grid = document.createElement('div');
                grid.className = cardConfig.gridClass || 'admin-grid admin-grid--two';
                renderFieldsIntoContainer(grid, fields, value, contentKey);
                card.appendChild(grid);
                rowNode.appendChild(card);
            });

            panel.appendChild(rowNode);
        });

        details.appendChild(panel);
        return details;
    }

    function renderCompactGalleryEditor(field, parentObject, contentKey) {
        if (field.type === 'array' && field.key === 'filters') {
            const showMoreField = contentConfigs[contentKey]?.schema?.fields?.find((schemaField) => schemaField.key === 'showMoreLabel');
            const { details, panel } = createCompactQuickShell(field, contentKey, {
                summary: 'Фильтры галереи и кнопка показа работ',
                summaryIcon: 'fa-filter',
                eyebrow: 'Удобный режим галереи',
                title: 'Фильтры и кнопка “Показать еще”',
                text: 'Здесь удобно менять подписи фильтров, их иконки и текст кнопки показа дополнительных работ.'
            });

            const topGrid = document.createElement('div');
            topGrid.className = 'admin-service-page-quick__grid';

            const filtersCard = createCompactQuickCard({
                icon: 'fa-filter',
                title: 'Фильтры',
                text: 'Названия фильтров, значения и иконки, которые помогают быстро переключаться между типами работ.',
                wide: true
            });
            filtersCard.appendChild(renderArrayField(field, parentObject, contentKey));
            topGrid.appendChild(filtersCard);
            panel.appendChild(topGrid);

            if (showMoreField) {
                const bottomGrid = document.createElement('div');
                bottomGrid.className = 'admin-service-page-quick__grid admin-service-page-quick__grid--bottom';
                const buttonCard = createCompactQuickCard({
                    icon: 'fa-arrow-down-short-wide',
                    title: 'Кнопка показа работ',
                    text: 'Короткая подпись для кнопки, которая открывает дополнительные работы внизу галереи.'
                });
                const buttonGrid = document.createElement('div');
                buttonGrid.className = 'admin-grid';
                const previousBypassCompactHide = state.bypassCompactFieldHide;
                state.bypassCompactFieldHide = true;
                renderFieldsIntoContainer(buttonGrid, [showMoreField], parentObject, contentKey);
                state.bypassCompactFieldHide = previousBypassCompactHide;
                buttonCard.appendChild(buttonGrid);
                bottomGrid.appendChild(buttonCard);
                panel.appendChild(bottomGrid);
            }

            details.appendChild(panel);
            return details;
        }

        const configMap = {
            header: {
                summary: 'Заголовок и подзаголовок страницы работ',
                summaryIcon: 'fa-heading',
                eyebrow: 'Удобный режим галереи',
                title: 'Шапка галереи',
                text: 'Здесь удобно менять главный заголовок страницы работ и короткое пояснение под ним.',
                rows: [[{
                    icon: 'fa-heading',
                    title: 'Заголовок и подзаголовок',
                    text: 'То, что человек видит первым на странице галереи.',
                    fieldKeys: ['title', 'subtitle'],
                    wide: true
                }]]
            },
            counter: {
                summary: 'Счётчик выполненных работ',
                summaryIcon: 'fa-chart-line',
                eyebrow: 'Удобный режим галереи',
                title: 'Счётчик и подпись',
                text: 'Здесь удобно менять число выполненных работ и поясняющий текст рядом с ним.',
                rows: [[{
                    icon: 'fa-chart-line',
                    title: 'Число и пояснение',
                    text: 'Короткий блок доверия рядом со счётчиком.',
                    fieldKeys: ['value', 'text'],
                    wide: true
                }]]
            },
            cta: {
                summary: 'Нижние кнопки страницы работ',
                summaryIcon: 'fa-bullhorn',
                eyebrow: 'Удобный режим галереи',
                title: 'Нижний блок действий',
                text: 'Здесь удобно менять две кнопки внизу галереи без всей страницы.',
                rows: [[
                    {
                        icon: 'fa-calculator',
                        title: 'Главная кнопка',
                        text: 'Основное действие для расчёта или заявки.',
                        fieldKeys: ['primary']
                    },
                    {
                        icon: 'fa-phone',
                        title: 'Вторичная кнопка',
                        text: 'Дополнительный переход для связи или консультации.',
                        fieldKeys: ['secondary']
                    }
                ]]
            }
        };

        const config = configMap[field.key];
        return config ? renderConfiguredCompactGroupEditor(field, parentObject[field.key], contentKey, config) : null;
    }

    function renderCompactPricesEditor(field, value, contentKey) {
        const configMap = {
            header: {
                summary: 'Заголовок и подзаголовок страницы цен',
                summaryIcon: 'fa-heading',
                eyebrow: 'Удобный режим страницы цен',
                title: 'Шапка страницы цен',
                text: 'Здесь удобно менять верхний заголовок страницы и пояснение про расчёт стоимости.',
                rows: [[{
                    icon: 'fa-heading',
                    title: 'Основной текст',
                    text: 'Первый экран страницы цен и короткое объяснение, как формируется стоимость.',
                    fieldKeys: ['title', 'subtitle'],
                    wide: true
                }]]
            },
            factors: {
                summary: 'Факторы, которые влияют на стоимость',
                summaryIcon: 'fa-tags',
                eyebrow: 'Удобный режим страницы цен',
                title: 'Факторы стоимости',
                text: 'Здесь удобно обновлять заголовок блока и карточки с тем, из чего складывается цена.',
                rows: [[{
                    icon: 'fa-layer-group',
                    title: 'Заголовок и карточки факторов',
                    text: 'Список факторов, который помогает человеку понять, почему цена считается индивидуально.',
                    fieldKeys: ['title', 'items'],
                    wide: true,
                    gridClass: 'admin-grid'
                }]]
            },
            calculator: {
                summary: 'Калькулятор, кнопка и телефоны для расчёта',
                summaryIcon: 'fa-calculator',
                eyebrow: 'Удобный режим страницы цен',
                title: 'Калькулятор и звонок',
                text: 'Здесь удобно менять приглашение к расчёту, кнопку и телефоны рядом.',
                rows: [
                    [
                        {
                            icon: 'fa-file-invoice',
                            title: 'Заголовок и описание',
                            text: 'Основной призыв отправить заявку на расчёт.',
                            fieldKeys: ['title', 'text']
                        },
                        {
                            icon: 'fa-bolt',
                            title: 'Кнопка и подпись',
                            text: 'Кнопка для расчёта и подпись перед телефонами.',
                            fieldKeys: ['action', 'contactLabel'],
                            gridClass: 'admin-grid'
                        }
                    ],
                    [{
                        icon: 'fa-phone',
                        title: 'Телефоны',
                        text: 'Номера, на которые можно позвонить для быстрого расчёта.',
                        fieldKeys: ['phones'],
                        wide: true,
                        gridClass: 'admin-grid'
                    }]
                ]
            },
            guarantee: {
                summary: 'Гарантия на изготовление и монтаж',
                summaryIcon: 'fa-shield-heart',
                eyebrow: 'Удобный режим страницы цен',
                title: 'Блок гарантии',
                text: 'Здесь удобно менять плашку гарантии и короткое обещание качества.',
                rows: [[{
                    icon: 'fa-shield-heart',
                    title: 'Плашка и текст гарантии',
                    text: 'Небольшой доверительный блок перед вопросами и кнопками.',
                    fieldKeys: ['badge', 'title', 'text'],
                    wide: true
                }]]
            },
            cta: {
                summary: 'Нижние кнопки страницы цен',
                summaryIcon: 'fa-bullhorn',
                eyebrow: 'Удобный режим страницы цен',
                title: 'Нижние кнопки',
                text: 'Здесь удобно менять основные действия внизу страницы цен.',
                rows: [[
                    {
                        icon: 'fa-calculator',
                        title: 'Главная кнопка',
                        text: 'Основной переход для заявки или расчёта.',
                        fieldKeys: ['primary']
                    },
                    {
                        icon: 'fa-phone',
                        title: 'Вторичная кнопка',
                        text: 'Дополнительная кнопка для консультации и связи.',
                        fieldKeys: ['secondary']
                    }
                ]]
            },
            faq: {
                summary: 'Частые вопросы о стоимости',
                summaryIcon: 'fa-circle-question',
                eyebrow: 'Удобный режим страницы цен',
                title: 'Вопросы и ответы',
                text: 'Здесь удобно обновлять популярные вопросы про цену и объяснения к ним.',
                rows: [[{
                    icon: 'fa-circle-question',
                    title: 'Заголовок и список вопросов',
                    text: 'Блок помогает снять частые возражения про стоимость и расчёт.',
                    fieldKeys: ['title', 'subtitle', 'items'],
                    wide: true,
                    gridClass: 'admin-grid'
                }]]
            }
        };

        const config = configMap[field.key];
        return config ? renderConfiguredCompactGroupEditor(field, value, contentKey, config) : null;
    }

    function renderCompactPaymentDocumentsEditor(field, value, contentKey) {
        const configMap = {
            hero: {
                summary: 'Первый экран про оплату и документы',
                summaryIcon: 'fa-file-signature',
                eyebrow: 'Удобный режим страницы оплаты',
                title: 'Первый экран оплаты и документов',
                text: 'Здесь удобно менять основной текст доверия, чипы и две карточки рядом с первым экраном.',
                rows: [[
                    {
                        icon: 'fa-heading',
                        title: 'Тексты первого экрана',
                        text: 'Заголовок, короткий лид, описание и чипы над первым блоком.',
                        fieldKeys: ['eyebrow', 'title', 'lead', 'text', 'chips']
                    },
                    {
                        icon: 'fa-id-card',
                        title: 'Карточки справа',
                        text: 'Акцентная карточка и список с правой стороны первого экрана.',
                        fieldKeys: ['accentCard', 'sideCard'],
                        gridClass: 'admin-grid'
                    }
                ]]
            },
            benefits: {
                summary: 'Преимущества и официальное оформление',
                summaryIcon: 'fa-shield-heart',
                eyebrow: 'Удобный режим страницы оплаты',
                title: 'Преимущества',
                text: 'Здесь удобно менять заголовок блока и карточки про договор, оплату и документы.',
                rows: [[{
                    icon: 'fa-shield-heart',
                    title: 'Заголовок и карточки преимуществ',
                    text: 'Блок помогает спокойно объяснить, как оформляется заказ.',
                    fieldKeys: ['title', 'subtitle', 'items'],
                    wide: true,
                    gridClass: 'admin-grid'
                }]]
            },
            workflow: {
                summary: 'Этапы оформления и сопровождения заказа',
                summaryIcon: 'fa-list-check',
                eyebrow: 'Удобный режим страницы оплаты',
                title: 'Этапы работы',
                text: 'Здесь удобно менять шаги оформления, оплаты и передачи документов.',
                rows: [[{
                    icon: 'fa-list-check',
                    title: 'Заголовок и шаги',
                    text: 'Пошаговый блок, который объясняет, что происходит от согласования до закрывающих документов.',
                    fieldKeys: ['title', 'subtitle', 'steps'],
                    wide: true,
                    gridClass: 'admin-grid'
                }]]
            },
            cta: {
                summary: 'Нижний блок связи страницы оплаты',
                summaryIcon: 'fa-phone-volume',
                eyebrow: 'Удобный режим страницы оплаты',
                title: 'Нижний блок связи',
                text: 'Здесь удобно менять финальный призыв и кнопки для связи по оплате и документам.',
                rows: [[
                    {
                        icon: 'fa-bullhorn',
                        title: 'Заголовок и описание',
                        text: 'Финальный текстовый блок перед кнопками связи.',
                        fieldKeys: ['title', 'text']
                    },
                    {
                        icon: 'fa-phone-volume',
                        title: 'Кнопки связи',
                        text: 'Основная и вторичная кнопка для связи и заявки.',
                        fieldKeys: ['primary', 'secondary'],
                        gridClass: 'admin-grid'
                    }
                ]]
            }
        };

        const config = configMap[field.key];
        return config ? renderConfiguredCompactGroupEditor(field, value, contentKey, config) : null;
    }

    function syncGroupEditorScreenForTarget(contentKey, fieldKey, focusKeys = []) {
        if (!Array.isArray(focusKeys) || !focusKeys.length) return;

        const field = contentConfigs[contentKey]?.schema?.fields?.find((item) => item.key === fieldKey);
        if (!field) return;

        const screens = getGroupEditorScreens(contentKey, field);
        if (!screens.length) return;

        const matchedScreen = screens.find((screen) => focusKeys.some((focusKey) => screen.fieldKeys.includes(focusKey)));
        if (!matchedScreen) return;

        state.activeGroupScreens[getGroupEditorScreenStateKey(contentKey, field)] = matchedScreen.key;
    }

    function openEditorSection(contentKey, fieldKey) {
        if (shouldUseSectionTabs(contentKey)) {
            const activeTab = getActiveSectionTab(contentKey);
            if (fieldKey && activeTab !== fieldKey) {
                state.activeFieldTabs[contentKey] = fieldKey;
                renderActiveSection();
            }
        }

        const details = document.getElementById(getTopLevelSectionId(contentKey, fieldKey));
        if (!(details instanceof HTMLDetailsElement)) return null;

        details.open = true;
        details.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return details;
    }

    function updatePreviewPanelUi() {
        const previewVisible = Boolean(state.previewPanelOpen && !contentConfigs[state.activeKey]?.virtual);

        document.body.classList.toggle('admin-preview-open', previewVisible);
        document.body.classList.toggle('admin-preview-closed', !previewVisible);

        if (elements.previewPanel) {
            elements.previewPanel.hidden = !previewVisible;
        }

        if (elements.previewToggleBtn) {
            elements.previewToggleBtn.hidden = Boolean(contentConfigs[state.activeKey]?.virtual);
            elements.previewToggleBtn.classList.toggle('admin-btn--primary', previewVisible);
            elements.previewToggleBtn.classList.toggle('admin-btn--ghost', !previewVisible);
            elements.previewToggleBtn.innerHTML = previewVisible
                ? '<i class="fas fa-eye-slash" aria-hidden="true"></i> Скрыть предпросмотр'
                : '<i class="fas fa-eye" aria-hidden="true"></i> Показать предпросмотр';
        }

        updatePreviewCardsUi();
    }

    function updateAssistPanelUi(options = {}) {
        if (!elements.assistPanel) return;

        const hasVisibleContent = Boolean(
            (elements.pageLinks && !elements.pageLinks.hidden && elements.pageLinks.querySelector('a'))
            || (elements.overview && !elements.overview.hidden && elements.overview.innerHTML.trim())
            || (elements.jumpbar && !elements.jumpbar.hidden && elements.jumpbar.innerHTML.trim())
            || (elements.searchCard && !elements.searchCard.hidden)
        );

        elements.assistPanel.hidden = !hasVisibleContent;

        if (!hasVisibleContent) {
            elements.assistPanel.open = false;
            return;
        }

        if (typeof options.open === 'boolean') {
            elements.assistPanel.open = options.open;
        }
    }

    function updatePreviewCardsUi() {
        const previewVisible = Boolean(state.previewPanelOpen && !contentConfigs[state.activeKey]?.virtual);
        const activeCard = ['actions', 'status', 'summary', 'live'].includes(state.activePreviewCard)
            ? state.activePreviewCard
            : 'actions';

        state.activePreviewCard = activeCard;

        if (elements.previewSwitcher) {
            elements.previewSwitcher.hidden = !previewVisible;
            elements.previewSwitcher.querySelectorAll('[data-preview-card]').forEach((button) => {
                const isActive = button.getAttribute('data-preview-card') === activeCard;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        }

        document.querySelectorAll('[data-preview-panel]').forEach((panel) => {
            panel.hidden = !previewVisible || panel.getAttribute('data-preview-panel') !== activeCard;
        });
    }

    function setActivePreviewCard(nextCard) {
        if (!['actions', 'status', 'summary', 'live'].includes(nextCard)) return;

        state.activePreviewCard = nextCard;

        try {
            window.localStorage.setItem('admin-preview-card', nextCard);
        } catch (error) {
            // Ignore storage failures and keep in-memory state.
        }

        updatePreviewCardsUi();

        if (nextCard === 'live' && state.previewPanelOpen && !contentConfigs[state.activeKey]?.virtual) {
            refreshLivePreview();
        }
    }

    function closeToolbarMore() {
        if (elements.toolbarMore instanceof HTMLDetailsElement) {
            elements.toolbarMore.open = false;
        }
    }

    function getEditorRoleLabel() {
        if (state.editorRole === 'advanced') return 'Расширенный';
        if (state.editorRole === 'manager') return 'Менеджер';
        return 'Заказчик';
    }

    function getEditingDepthLabel() {
        return state.quickMode ? 'Быстрые правки' : 'Все поля';
    }

    function getNavGroupMeta(sectionKey = state.activeKey) {
        return navGroups.find((group) => group.items.includes(sectionKey)) || null;
    }

    function getCurrentWorkspaceContext(sectionKey = state.activeKey) {
        const config = contentConfigs[sectionKey];
        const group = getNavGroupMeta(sectionKey);
        const activeSimpleScreen = getActiveSimpleScreen(sectionKey);
        const activeGuide = state.activeGuide?.sectionKey === sectionKey ? getActiveGuide() : null;
        const parts = [];

        if (group) {
            parts.push(group.shortLabel || group.label);
        }

        if (config?.label) {
            parts.push(config.label);
        }

        if (activeGuide) {
            parts.push(activeGuide.title);
        } else if (activeSimpleScreen) {
            parts.push(activeSimpleScreen.title);
        } else if (shouldUseSectionTabs(sectionKey) && !config?.virtual) {
            const activeTabKey = getActiveSectionTab(sectionKey);
            if (activeTabKey) {
                parts.push(getTopLevelFieldLabel(sectionKey, activeTabKey));
            }
        }

        let helperText = 'Сейчас открыт весь раздел целиком.';

        if (config?.virtual) {
            helperText = 'Стартовый экран с готовыми быстрыми действиями.';
        } else if (activeGuide) {
            helperText = 'Сейчас открыт пошаговый маршрут по разделу.';
        } else if (activeSimpleScreen) {
            helperText = 'Сейчас открыт простой экран без лишних блоков.';
        } else if (shouldUseSectionTabs(sectionKey)) {
            helperText = 'Сейчас открыт один крупный блок внутри раздела.';
        }

        return {
            parts,
            helperText,
            modeText: `${getEditingDepthLabel()} · ${getEditorRoleLabel()}`
        };
    }

    function renderToolbarPath(sectionKey = state.activeKey) {
        if (!elements.toolbarPath) return;

        const context = getCurrentWorkspaceContext(sectionKey);
        const parts = context.parts.filter(Boolean);

        if (!parts.length) {
            elements.toolbarPath.hidden = true;
            elements.toolbarPath.innerHTML = '';
            return;
        }

        elements.toolbarPath.hidden = false;
        elements.toolbarPath.innerHTML = `
            <span class="admin-toolbar__path-label">Где вы сейчас</span>
            <div class="admin-toolbar__path-list" aria-label="Текущий путь в админке">
                ${parts.map((part, index) => `
                    ${index ? '<span class="admin-toolbar__path-separator"><i class="fas fa-chevron-right" aria-hidden="true"></i></span>' : ''}
                    <span class="admin-toolbar__path-item${index === parts.length - 1 ? ' is-current' : ''}">${part}</span>
                `).join('')}
            </div>
            <div class="admin-toolbar__path-meta">
                <span>${context.helperText}</span>
                <span class="admin-toolbar__path-mode">${context.modeText}</span>
            </div>
        `;
    }

    function updateToolbarChrome() {
        document.body.classList.toggle('admin-customer-layout', state.editorRole === 'customer');
        document.body.classList.toggle('admin-manager-layout', state.editorRole === 'manager');
        document.body.classList.toggle('admin-advanced-layout', state.editorRole === 'advanced');

        if (elements.sectionBadge) {
            const activeConfig = contentConfigs[state.activeKey];
            if (activeConfig?.virtual) {
                elements.sectionBadge.className = 'admin-status-badge is-idle';
                elements.sectionBadge.textContent = 'Стартовый экран';
            } else {
                const status = getSectionStatus(state.activeKey);
                elements.sectionBadge.className = `admin-status-badge is-${status.tone}`;
                elements.sectionBadge.textContent = status.label;
            }
        }

        renderToolbarPath(state.activeKey);
        updateStickyOffsets();
        updatePreviewPanelUi();
    }

    function updateStickyOffsets() {
        if (!elements.toolbar) return;
        const isDesktopLayout = window.innerWidth > 1180;
        const toolbarHeight = Math.ceil(elements.toolbar.getBoundingClientRect().height || 0);
        const previewTop = isDesktopLayout ? Math.max(toolbarHeight + 18, 124) : 0;
        const tabsTop = isDesktopLayout ? Math.max(toolbarHeight + 8, 108) : 0;

        document.documentElement.style.setProperty('--admin-sticky-preview-top', `${previewTop}px`);
        document.documentElement.style.setProperty('--admin-sticky-tabs-top', `${tabsTop}px`);
    }

    function setPreviewPanelOpen(open, options = {}) {
        state.previewPanelOpen = Boolean(open);

        try {
            window.localStorage.setItem('admin-preview-open', state.previewPanelOpen ? '1' : '0');
        } catch (error) {
            // Ignore storage failures and keep in-memory state.
        }

        updateToolbarChrome();

        if (state.previewPanelOpen && !options.keepActiveCard) {
            setActivePreviewCard('live');
        }

        if (state.previewPanelOpen) {
            refreshLivePreview();
        }

        if (!options.silent && !contentConfigs[state.activeKey]?.virtual) {
            showAlert(
                state.previewPanelOpen
                    ? 'Предпросмотр открыт под формой.'
                    : 'Предпросмотр скрыт, чтобы осталось больше места для редактирования.',
                'info'
            );
        }
    }

    function renderSectionTabs(sectionKey) {
        if (!elements.sectionTabs) return;

        if (!shouldUseSectionTabs(sectionKey)) {
            elements.sectionTabs.hidden = true;
            elements.sectionTabs.innerHTML = '';
            return;
        }

        const fields = getSectionTabFields(sectionKey);
        const activeFieldKey = getActiveSectionTab(sectionKey);

        elements.sectionTabs.hidden = false;
        elements.sectionTabs.innerHTML = `
            <div class="admin-section-tabs__head">
                <div>
                    <p class="admin-toolbar__eyebrow">Работаем по крупным блокам</p>
                    <h2>Что именно хотите поменять в этом разделе?</h2>
                    <p>Заказчику не нужно листать всю форму. Выберите нужный блок, внесите правки и сохраните раздел.</p>
                </div>
                <span class="admin-status-badge is-idle">${fields.length} блоков</span>
            </div>
            <div class="admin-section-tabs__list">
                ${fields.map((field) => {
                    const meta = getSectionTabMeta(field);
                    return `
                        <button class="admin-section-tabs__button ${field.key === activeFieldKey ? 'is-active' : ''}" type="button" data-section-tab="${field.key}">
                            <span class="admin-section-tabs__button-icon"><i class="fas ${meta.icon}" aria-hidden="true"></i></span>
                            <span class="admin-section-tabs__button-copy">
                                <strong>${getTopLevelFieldLabel(sectionKey, field.key)}</strong>
                                <span>${meta.text}</span>
                            </span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;

        elements.sectionTabs.querySelectorAll('[data-section-tab]').forEach((button) => {
            button.addEventListener('click', () => {
                setActiveSectionTab(sectionKey, button.getAttribute('data-section-tab') || '', { silent: true });
            });
        });
    }

    function renderSidebarFooter() {
        if (!elements.sidebarFooter) return;

        const activeConfig = contentConfigs[state.activeKey];
        const status = getSectionStatus(state.activeKey);
        const context = getCurrentWorkspaceContext(state.activeKey);

        elements.sidebarFooter.innerHTML = `
            <div class="admin-sidebar-footer__card">
                <p class="admin-toolbar__eyebrow">Где вы сейчас</p>
                <strong>${context.parts[context.parts.length - 1] || activeConfig.label}</strong>
                <div class="admin-sidebar-footer__crumbs">
                    ${context.parts.map((part) => `<span>${part}</span>`).join('')}
                </div>
                <div class="admin-sidebar-footer__meta">
                    <span class="admin-status-badge is-${status.tone}">${status.label}</span>
                    <span class="admin-sidebar-footer__mode">${context.modeText}</span>
                </div>
            </div>
            <div class="admin-sidebar-footer__links">
                <a href="../index.html" target="_blank" rel="noopener noreferrer">Открыть сайт</a>
                <a href="../admin/" target="_blank" rel="noopener noreferrer">Открыть админку в новой вкладке</a>
                <a href="../docs/admin-deploy.md" target="_blank" rel="noopener noreferrer">Инструкция по публикации</a>
            </div>
        `;
    }

    function switchAdminSection(nextKey) {
        if (!contentConfigs[nextKey]) return false;
        if (state.activeKey !== nextKey && state.activeKey !== 'dashboard' && !confirmDiscardChanges()) {
            return false;
        }

        if (state.activeKey !== nextKey) {
            state.activeSimpleScreen = null;
            if (state.activeGuide && state.activeGuide.sectionKey !== nextKey) {
                state.activeGuide = null;
            }
        }

        state.activeKey = nextKey;
        state.searchQuery = '';
        clearAlert();
        renderNav();
        renderActiveSection();
        return true;
    }

    function renderCommandCenter(sectionKey) {
        if (!elements.commandCenter) return;
        elements.commandCenter.classList.remove('is-compact');

        const config = contentConfigs[sectionKey];
        const meta = sectionMeta[sectionKey] || {};
        const status = getSectionStatus(sectionKey);
        const workflow = getSectionWorkflowStatus(sectionKey);
        const previewLinks = Array.isArray(meta.previewLinks) ? meta.previewLinks : [];
        const stats = collectSectionStats(state.data[sectionKey]);
        const activeIcon = meta.icon || 'fa-rectangle-list';
        const tasks = getSectionQuickTasks(sectionKey);
        const simpleScreens = getSectionSimpleScreens(sectionKey);
        const activeSimpleScreen = getActiveSimpleScreen(sectionKey);
        const scenarios = getSectionScenarios(sectionKey);
        const guides = getSectionGuides(sectionKey);
        const focusCards = [
            ...tasks.map((task, index) => ({
                type: 'task',
                index,
                icon: task.icon,
                title: task.title,
                text: task.text,
                meta: 'Открыть нужный блок',
                active: false
            })),
            ...simpleScreens.map((screen, index) => ({
                type: 'screen',
                index,
                icon: screen.icon,
                title: screen.title,
                text: screen.text,
                meta: `${screen.fieldKeys.length} ${screen.fieldKeys.length === 1 ? 'блок' : screen.fieldKeys.length < 5 ? 'блока' : 'блоков'}`,
                active: Boolean(activeSimpleScreen && state.activeSimpleScreen?.screenIndex === index)
            }))
        ];
        const routeCards = [
            ...scenarios.map((scenario, index) => ({
                type: 'scenario',
                index,
                icon: scenario.icon,
                title: scenario.title,
                text: scenario.text,
                meta: 'Быстрый переход'
            })),
            ...guides.map((guide, index) => ({
                type: 'guide',
                index,
                icon: guide.icon,
                title: guide.title,
                text: guide.summary,
                meta: `${guide.steps.length} ${guide.steps.length === 1 ? 'шаг' : guide.steps.length < 5 ? 'шага' : 'шагов'}`
            }))
        ];

        if (config.virtual) {
            const dashboardActions = getDashboardHomeActions();
            elements.commandCenter.innerHTML = `
                <div class="admin-command-center__hero">
                    <div class="admin-command-center__hero-copy">
                    <span class="admin-command-center__icon"><i class="fas ${activeIcon}" aria-hidden="true"></i></span>
                    <div class="admin-command-center__eyebrow">Быстрый старт</div>
                    <h2>${config.label}</h2>
                    <p>${meta.summary || config.description}</p>
                    <div class="admin-command-center__flow">
                        <strong>Выбери задачу и сразу перейди к правке</strong>
                        <span>Этот экран нужен, чтобы не вспоминать структуру сайта. Просто нажмите нужное действие, и админка сама откроет нужный блок.</span>
                    </div>
                        <div class="admin-command-center__actions">
                            ${(meta.previewLinks || []).map((link) => `
                                <a class="admin-btn admin-btn--ghost" href="${link.href}" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> ${link.label}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                    <div class="admin-command-center__hero-side">
                        <span class="admin-status-badge is-idle">Стартовый экран</span>
                    <div class="admin-command-center__hero-note">Здесь нет длинной формы и лишних полей, только готовые действия для быстрого старта.</div>
                </div>
            </div>
                <div class="admin-command-center__stats">
                    <article class="admin-command-stat">
                        <strong>${dashboardActions.length}</strong>
                        <span>Готовых действий</span>
                    </article>
                    <article class="admin-command-stat">
                        <strong>${Object.keys(contentConfigs).length - 1}</strong>
                        <span>Рабочих разделов</span>
                    </article>
                    <article class="admin-command-stat">
                        <strong>1 клик</strong>
                        <span>До нужного блока</span>
                    </article>
                    <article class="admin-command-stat">
                        <strong>0</strong>
                        <span>Лишних полей на старте</span>
                    </article>
                </div>
                <div class="admin-command-center__routes admin-command-center__routes--dashboard">
                    <div class="admin-command-center__section-head">
                        <div>
                            <p class="admin-toolbar__eyebrow">С чего начать</p>
                            <h3>Самые частые действия</h3>
                        </div>
                        <span>Если нужно быстро сменить телефоны, фото или текст на главной, начните отсюда.</span>
                    </div>
                    <div class="admin-route-list">
                        ${dashboardActions.slice(0, 6).map((action, index) => `
                            <button class="admin-route-chip admin-route-chip--feature" type="button" data-dashboard-route-index="${index}">
                                <span class="admin-route-chip__icon"><i class="fas ${action.icon}" aria-hidden="true"></i></span>
                                <span class="admin-route-chip__copy">
                                    <strong>${action.title}</strong>
                                    <span>${action.text}</span>
                                </span>
                                <span class="admin-route-chip__meta">Открыть</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            elements.commandCenter.querySelectorAll('[data-dashboard-route-index]').forEach((button) => {
                button.addEventListener('click', () => {
                    const index = Number(button.getAttribute('data-dashboard-route-index'));
                    runDashboardAction(dashboardActions[index]);
                });
            });
            return;
        }

        elements.commandCenter.innerHTML = `
            <div class="admin-command-center__hero">
                <div class="admin-command-center__hero-copy">
                    <span class="admin-command-center__icon"><i class="fas ${activeIcon}" aria-hidden="true"></i></span>
                    <div class="admin-command-center__eyebrow">Текущий раздел</div>
                    <h2>${config.label}</h2>
                    <p>${meta.summary || config.description}</p>
                    <div class="admin-command-center__flow">
                        <strong>${workflow.title}</strong>
                        <span>${workflow.text}</span>
                    </div>
                    <div class="admin-command-center__actions">
                        ${previewLinks.map((link) => `
                            <a class="admin-btn admin-btn--ghost" href="${link.href}" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> ${link.label}
                            </a>
                        `).join('')}
                    </div>
                </div>
                <div class="admin-command-center__hero-side">
                    <span class="admin-status-badge is-${status.tone}">${status.label}</span>
                    <div class="admin-command-center__hero-note">${status.description}</div>
                </div>
            </div>
            <div class="admin-command-center__stats">
                <article class="admin-command-stat">
                    <strong>${stats.textCount}</strong>
                    <span>Текстовых блоков</span>
                </article>
                <article class="admin-command-stat">
                    <strong>${stats.imageCount}</strong>
                    <span>Изображений</span>
                </article>
                <article class="admin-command-stat">
                    <strong>${stats.linkCount}</strong>
                    <span>Ссылок и форм</span>
                </article>
                    <article class="admin-command-stat">
                        <strong>${stats.arrayCount}</strong>
                        <span>Списков и карточек</span>
                    </article>
                </div>
            ${focusCards.length ? `
                <div class="admin-command-center__focus">
                    <div class="admin-command-center__section-head">
                        <div>
                            <p class="admin-toolbar__eyebrow">С чего удобнее начать</p>
                            <h3>Главные действия</h3>
                        </div>
                        <span>Открой действие или спокойный экран, и админка сфокусируется только на нужной части раздела.</span>
                    </div>
                    <div class="admin-focus-grid">
                        ${focusCards.map((item) => `
                            <button class="admin-focus-tile${item.type === 'screen' ? ' is-screen' : ''}${item.active ? ' is-active' : ''}" type="button" data-focus-type="${item.type}" data-focus-index="${item.index}">
                                <span class="admin-focus-tile__badge">${item.type === 'screen' ? 'Простой экран' : 'Действие'}</span>
                                <span class="admin-focus-tile__icon"><i class="fas ${item.icon}" aria-hidden="true"></i></span>
                                <strong>${item.title}</strong>
                                <p>${item.text}</p>
                                <span class="admin-focus-tile__meta">${item.meta}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${routeCards.length ? `
                <div class="admin-command-center__routes">
                    <div class="admin-command-center__section-head">
                        <div>
                            <p class="admin-toolbar__eyebrow">Быстрые маршруты</p>
                            <h3>Куда перейти одним нажатием</h3>
                        </div>
                        <span>Здесь собраны частые переходы и пошаговые подсказки без лишних промежуточных блоков.</span>
                    </div>
                    <div class="admin-route-list">
                        ${routeCards.map((item) => `
                            <button class="admin-route-chip${item.type === 'guide' ? ' is-guide' : ''}" type="button" data-route-type="${item.type}" data-route-index="${item.index}">
                                <span class="admin-route-chip__icon"><i class="fas ${item.icon}" aria-hidden="true"></i></span>
                                <span class="admin-route-chip__copy">
                                    <strong>${item.title}</strong>
                                    <span>${item.text}</span>
                                </span>
                                <span class="admin-route-chip__meta">${item.meta}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        elements.commandCenter.querySelectorAll('[data-focus-type]').forEach((button) => {
            button.addEventListener('click', () => {
                const type = button.getAttribute('data-focus-type');
                const index = Number(button.getAttribute('data-focus-index'));
                if (type === 'screen') {
                    openSimpleScreen(sectionKey, index);
                    return;
                }
                runQuickTask(tasks[index]);
            });
        });

        elements.commandCenter.querySelectorAll('[data-route-type]').forEach((button) => {
            button.addEventListener('click', () => {
                const type = button.getAttribute('data-route-type');
                const index = Number(button.getAttribute('data-route-index'));
                if (type === 'guide') {
                    openGuideModal(sectionKey, index);
                    return;
                }
                runSectionScenario(scenarios[index]);
            });
        });
    }

    function getSectionSpecificSearchExamples(sectionKey) {
        const examples = {
            site: 'логотип, меню, телефоны, футер',
            home: 'первый экран, направления, форма, факты',
            catalog: 'группы, бренды, нижний блок связи',
            catalogPanels: 'откатные, калитки, вопросы, палитра, товары',
            servicePages: 'быстрые ссылки, карточки услуг, вопросы',
            automation: 'товары, первый экран, комплект, кнопки',
            gallery: 'заголовок, фильтры, показать еще, счетчик',
            prices: 'факторы, калькулятор, гарантия',
            paymentDocuments: 'этапы, документы, доверие',
            contacts: 'телефоны, карта, форма, ориентиры'
        };

        return examples[sectionKey] || 'заголовок, текст, фото, кнопки';
    }

    function getSectionQuickTasks(sectionKey) {
        const taskMap = {
            site: [
                {
                    icon: 'fa-phone',
                    title: 'Изменить телефоны и адрес',
                    text: 'Открывает блок контактов и приводит к номерам, адресу и режиму работы.',
                    kind: 'focus',
                    target: { sectionKey: 'contact', focusKeys: ['primaryPhone', 'secondaryPhone', 'address', 'hours'] }
                },
                {
                    icon: 'fa-signature',
                    title: 'Поменять подпись рядом с логотипом',
                    text: 'Быстрый переход к названию бренда и подписи в шапке.',
                    kind: 'focus',
                    target: { sectionKey: 'brand', focusKeys: ['name', 'tagline'] }
                },
                {
                    icon: 'fa-bars',
                    title: 'Обновить верхнее меню',
                    text: 'Сразу открывает список пунктов меню и их ссылок.',
                    kind: 'focus',
                    target: { sectionKey: 'navigation', focusKeys: ['label', 'href'] }
                }
            ],
        home: [
                {
                    icon: 'fa-heading',
                    title: 'Поменять заголовок на главной',
                    text: 'Сразу переводит к первому экрану и его заголовку.',
                    kind: 'focus',
                    target: { sectionKey: 'hero', focusKeys: ['titleMain', 'titleSub', 'subtitleStrong'] }
                },
                {
                    icon: 'fa-image',
                    title: 'Заменить фото в слайде направлений',
                    text: 'Откроет нужный блок и сразу вызовет выбор изображения.',
                    kind: 'media',
                    target: { sectionKey: 'directions', focusKeys: ['gates', 'slides', 'src'] }
                },
                {
                    icon: 'fa-paper-plane',
                    title: 'Поправить форму заявки',
                    text: 'Открывает блок заявки с кнопками связи и встроенной формой.',
                    kind: 'focus',
                    target: { sectionKey: 'request', focusKeys: ['formTitle', 'quickActions', 'iframeSrc'] }
                }
            ],
            catalog: [
                {
                    icon: 'fa-folder-tree',
                    title: 'Поменять группы каталога',
                    text: 'Быстрый переход к основным группам и их описаниям.',
                    kind: 'focus',
                    target: { sectionKey: 'groups', focusKeys: ['title', 'text'] }
                },
                {
                    icon: 'fa-bullhorn',
                    title: 'Поправить нижний призыв',
                    text: 'Открывает нижний блок связи каталога и его кнопки.',
                    kind: 'focus',
                    target: { sectionKey: 'cta', focusKeys: ['title', 'text', 'actions'] }
                },
                {
                    icon: 'fa-map-signs',
                    title: 'Открыть шаги по каталогу',
                    text: 'Пошаговый маршрут по основным правкам этой страницы.',
                    kind: 'guide',
                    guideIndex: 0
                }
            ],
            catalogPanels: [
                {
                    icon: 'fa-truck-ramp-box',
                    title: 'Поправить откатные ворота',
                    text: 'Быстрый переход к тексту, характеристикам и карточкам откатных ворот.',
                    kind: 'focus',
                    target: { sectionKey: 'sliding', focusKeys: ['title', 'paragraphs', 'cards', 'cta'] }
                },
                {
                    icon: 'fa-image',
                    title: 'Поменять фото в калитках',
                    text: 'Открывает карточку калиток и сразу запускает выбор изображения.',
                    kind: 'media',
                    target: { sectionKey: 'wicket', focusKeys: ['src', 'title'] }
                },
                {
                    icon: 'fa-border-all',
                    title: 'Поправить заборы',
                    text: 'Открывает заборы и позволяет пройти их уже по шагам.',
                    kind: 'guide',
                    guideIndex: 1
                },
                {
                    icon: 'fa-robot',
                    title: 'Открыть автоматику',
                    text: 'Пошаговый маршрут по автоматике и комплектующим.',
                    kind: 'guide',
                    guideIndex: 2
                }
            ],
            servicePages: [
                {
                    icon: 'fa-spray-can-sparkles',
                    title: 'Поменять блоки покраски',
                    text: 'Открывает страницу порошковой покраски и её карточки услуг.',
                    kind: 'guide',
                    guideIndex: 0
                },
                {
                    icon: 'fa-wind',
                    title: 'Поправить пескоструй',
                    text: 'Пошаговый маршрут по пескоструйной странице.',
                    kind: 'guide',
                    guideIndex: 1
                },
                {
                    icon: 'fa-link',
                    title: 'Обновить общие кнопки',
                    text: 'Сразу открывает общие кнопки карточек услуг.',
                    kind: 'focus',
                    target: { sectionKey: 'sharedCta', focusKeys: ['primary', 'secondary', 'label'] }
                }
            ],
            automation: [
                {
                    icon: 'fa-bolt',
                    title: 'Поправить общую страницу автоматики',
                    text: 'Открывает первый экран, карточки комплектов и блок подсказок по выбору.',
                    kind: 'focus',
                    target: { sectionKey: 'swingLanding', focusKeys: ['hero', 'products', 'guide', 'cta'] }
                },
                {
                    icon: 'fa-gears',
                    title: 'Обновить комплектующие',
                    text: 'Переходит к странице комплектующих и её спискам.',
                    kind: 'focus',
                    target: { sectionKey: 'slidingComponentsPage', focusKeys: ['title', 'sections'] }
                },
                {
                    icon: 'fa-map-signs',
                    title: 'Открыть шаги по автоматике',
                    text: 'Пошагово ведёт по всей странице и товарным карточкам.',
                    kind: 'guide',
                    guideIndex: 0
                }
            ],
            gallery: [
                {
                    icon: 'fa-heading',
                    title: 'Поменять шапку галереи',
                    text: 'Открывает заголовок и подзаголовок страницы работ.',
                    kind: 'focus',
                    target: { sectionKey: 'header', focusKeys: ['title', 'subtitle'] }
                },
                {
                    icon: 'fa-filter',
                    title: 'Поправить фильтры',
                    text: 'Переходит к фильтрам и подписи кнопки “Показать еще”.',
                    kind: 'focus',
                    target: { sectionKey: 'filters', focusKeys: ['label', 'icon', 'value'] }
                },
                {
                    icon: 'fa-map-signs',
                    title: 'Открыть шаги по галерее',
                    text: 'Пошагово проводит по шапке, фильтрам, счётчику и кнопкам.',
                    kind: 'guide',
                    guideIndex: 0
                }
            ],
            paymentDocuments: [
                {
                    icon: 'fa-file-signature',
                    title: 'Поправить блок доверия',
                    text: 'Открывает верхний блок про договор и документы.',
                    kind: 'focus',
                    target: { sectionKey: 'hero', focusKeys: ['title', 'lead', 'text', 'chips'] }
                },
                {
                    icon: 'fa-shield-heart',
                    title: 'Обновить преимущества',
                    text: 'Переходит к карточкам преимуществ и официального оформления.',
                    kind: 'focus',
                    target: { sectionKey: 'benefits', focusKeys: ['title', 'items'] }
                },
                {
                    icon: 'fa-list-check',
                    title: 'Обновить этапы оформления',
                    text: 'Сразу переводит к шагам процесса.',
                    kind: 'focus',
                    target: { sectionKey: 'workflow', focusKeys: ['title', 'steps'] }
                },
                {
                    icon: 'fa-map-signs',
                    title: 'Открыть шаги страницы',
                    text: 'Пошагово пройти страницу оплаты и документов.',
                    kind: 'guide',
                    guideIndex: 0
                }
            ],
            contacts: [
                {
                    icon: 'fa-phone',
                    title: 'Изменить телефоны и менеджера',
                    text: 'Открывает основной блок контактов и данные менеджера.',
                    kind: 'focus',
                    target: { sectionKey: 'overview', focusKeys: ['items', 'manager', 'hours'] }
                },
                {
                    icon: 'fa-paper-plane',
                    title: 'Поправить кнопки связи',
                    text: 'Переходит к блоку быстрой связи и встроенной форме.',
                    kind: 'focus',
                    target: { sectionKey: 'connect', focusKeys: ['actions', 'iframeSrc', 'notice'] }
                },
                {
                    icon: 'fa-map-location-dot',
                    title: 'Обновить карту и ориентиры',
                    text: 'Открывает нижний блок с картой и ориентирами.',
                    kind: 'focus',
                    target: { sectionKey: 'location', focusKeys: ['mapSrc', 'badges', 'points'] }
                }
            ],
            prices: [
                {
                    icon: 'fa-tags',
                    title: 'Поменять факторы цены',
                    text: 'Открывает карточки с факторами стоимости.',
                    kind: 'focus',
                    target: { sectionKey: 'factors', focusKeys: ['title', 'items'] }
                },
                {
                    icon: 'fa-calculator',
                    title: 'Поправить калькулятор',
                    text: 'Переходит к блоку калькулятора и телефонам рядом.',
                    kind: 'focus',
                    target: { sectionKey: 'calculator', focusKeys: ['title', 'action', 'phones'] }
                },
                {
                    icon: 'fa-circle-question',
                    title: 'Проверить гарантию и вопросы',
                    text: 'Открывает гарантию и ответы на частые вопросы.',
                    kind: 'guide',
                    guideIndex: 1
                }
            ]
        };

        return taskMap[sectionKey] || [];
    }

    function getSectionSimpleScreens(sectionKey) {
        const screenMap = {
            site: [
                { icon: 'fa-signature', title: 'Только логотип и подпись', text: 'Показывает только блок бренда и подписи.', fieldKeys: ['brand'] },
                { icon: 'fa-phone', title: 'Только контакты', text: 'Показывает только телефоны, адрес, почту и режим работы.', fieldKeys: ['contact'] },
                { icon: 'fa-bars', title: 'Только меню', text: 'Оставляет на экране только верхнее меню.', fieldKeys: ['navigation'] },
                { icon: 'fa-building', title: 'Только футер', text: 'Показывает только нижний блок компании и полезные ссылки.', fieldKeys: ['footer'] }
            ],
            home: [
                { icon: 'fa-house', title: 'Только первый экран', text: 'Первый экран без остальных блоков страницы.', fieldKeys: ['hero'] },
                { icon: 'fa-layer-group', title: 'Только направления', text: 'Только два больших блока на главной.', fieldKeys: ['directions'] },
                { icon: 'fa-shield-heart', title: 'Только доверие', text: 'Только блок с преимуществами и фактами.', fieldKeys: ['trust'] },
                { icon: 'fa-paper-plane', title: 'Только форма заявки', text: 'Только заявка, контакты и быстрые кнопки.', fieldKeys: ['request'] }
            ],
            catalog: [
                { icon: 'fa-folder-tree', title: 'Только группы каталога', text: 'Только верхние группы каталога.', fieldKeys: ['groups'] },
                { icon: 'fa-users', title: 'Только партнёры', text: 'Только блок брендов и партнёров.', fieldKeys: ['partners'] },
                { icon: 'fa-bullhorn', title: 'Только нижний блок связи', text: 'Только призыв и кнопки внизу каталога.', fieldKeys: ['cta'] }
            ],
            catalogPanels: [
                { icon: 'fa-warehouse', title: 'Только ворота и каркасы', text: 'Оставляет только откатные, распашные и их каркасы.', fieldKeys: ['sliding', 'slidingFrame', 'swing', 'swingFrame'] },
                { icon: 'fa-border-all', title: 'Только калитки и заборы', text: 'Показывает только калитки и все заборы.', fieldKeys: ['wicket', 'fenceProfnastil', 'fenceSiding', 'fencePicket', 'fenceLouver'] },
                { icon: 'fa-robot', title: 'Только автоматика', text: 'Только автоматика и комплектующие.', fieldKeys: ['automationSliding', 'automationSwing', 'automationComponents'] },
                { icon: 'fa-shield-halved', title: 'Только гараж и защита', text: 'Только секционные, рольворота, рольставни и решётки.', fieldKeys: ['sectional', 'roller', 'shutters', 'grilles'] }
            ],
            servicePages: [
                { icon: 'fa-spray-can-sparkles', title: 'Только порошковая покраска', text: 'Показывает только раздел порошковой покраски.', fieldKeys: ['powderCoating'] },
                { icon: 'fa-wind', title: 'Только пескоструй', text: 'Показывает только страницу пескоструйной обработки.', fieldKeys: ['sandblasting'] },
                { icon: 'fa-link', title: 'Только общие кнопки', text: 'Оставляет только общий блок кнопок для карточек услуг.', fieldKeys: ['sharedCta'] }
            ],
            automation: [
                { icon: 'fa-bolt', title: 'Только основной экран автоматики', text: 'Только основная страница автоматики и комплектов.', fieldKeys: ['swingLanding'] },
                { icon: 'fa-gears', title: 'Только комплектующие', text: 'Только страница комплектующих.', fieldKeys: ['slidingComponentsPage'] },
                { icon: 'fa-box-open', title: 'Только товары', text: 'Только страницы отдельных товаров и общие кнопки.', fieldKeys: ['productPages', 'sharedActions'] }
            ],
            gallery: [
                { icon: 'fa-heading', title: 'Только шапка и счётчик', text: 'Показывает заголовок галереи и счётчик выполненных работ.', fieldKeys: ['header', 'counter'] },
                { icon: 'fa-filter', title: 'Только фильтры', text: 'Оставляет на экране только фильтры и подпись “Показать еще”.', fieldKeys: ['filters', 'showMoreLabel'] },
                { icon: 'fa-bullhorn', title: 'Только нижние кнопки', text: 'Показывает только финальные кнопки внизу страницы работ.', fieldKeys: ['cta'] }
            ],
            paymentDocuments: [
                { icon: 'fa-file-signature', title: 'Только верхний блок доверия', text: 'Только главный блок про договор и документы.', fieldKeys: ['hero'] },
                { icon: 'fa-shield-heart', title: 'Только преимущества', text: 'Только карточки преимуществ и официального оформления.', fieldKeys: ['benefits'] },
                { icon: 'fa-list-check', title: 'Только этапы работы', text: 'Только пошаговое описание процесса.', fieldKeys: ['workflow'] },
                { icon: 'fa-phone-volume', title: 'Только нижний блок связи', text: 'Только завершающий призыв и кнопки связи.', fieldKeys: ['cta'] }
            ],
            contacts: [
                { icon: 'fa-address-book', title: 'Только основные контакты', text: 'Только первый экран и основной блок контактов.', fieldKeys: ['hero', 'overview'] },
                { icon: 'fa-paper-plane', title: 'Только быстрая связь', text: 'Только встроенная форма и быстрые кнопки.', fieldKeys: ['connect'] },
                { icon: 'fa-map-location-dot', title: 'Только карта и ориентиры', text: 'Только нижний блок с картой и маршрутом.', fieldKeys: ['location'] }
            ],
            prices: [
                { icon: 'fa-heading', title: 'Только шапка страницы', text: 'Показывает только заголовок и подзаголовок страницы цен.', fieldKeys: ['header'] },
                { icon: 'fa-tags', title: 'Только факторы цены', text: 'Показывает только карточки факторов стоимости.', fieldKeys: ['factors'] },
                { icon: 'fa-calculator', title: 'Только калькулятор', text: 'Оставляет только калькулятор и телефоны рядом.', fieldKeys: ['calculator'] },
                { icon: 'fa-circle-question', title: 'Только гарантия и вопросы', text: 'Показывает гарантию, вопросы с ответами и нижние кнопки.', fieldKeys: ['guarantee', 'cta', 'faq'] }
            ]
        };

        return screenMap[sectionKey] || [];
    }

    function getDashboardHomeActions() {
        return [
            {
                icon: 'fa-heading',
                title: 'Поменять заголовок на главной',
                text: 'Сразу переведёт в первый экран и покажет только его.',
                sectionKey: 'home',
                kind: 'screen',
                screenIndex: 0,
                previewHref: '../index.html'
            },
            {
                icon: 'fa-image',
                title: 'Заменить фото на главной',
                text: 'Откроет блок направлений и сразу предложит выбрать новое фото.',
                sectionKey: 'home',
                kind: 'task',
                taskIndex: 1,
                previewHref: '../index.html'
            },
            {
                icon: 'fa-phone',
                title: 'Изменить телефоны и адрес',
                text: 'Быстро откроет общие контакты сайта без остальной формы.',
                sectionKey: 'site',
                kind: 'screen',
                screenIndex: 1,
                previewHref: '../pages/contacts.html'
            },
            {
                icon: 'fa-truck-ramp-box',
                title: 'Поправить откатные ворота',
                text: 'Сразу переведёт в карточку откатных ворот внутри каталога.',
                sectionKey: 'catalogPanels',
                kind: 'task',
                taskIndex: 0,
                previewHref: '../pages/services.html'
            },
            {
                icon: 'fa-border-all',
                title: 'Поменять калитки и заборы',
                text: 'Откроет простой экран только с калитками и заборами.',
                sectionKey: 'catalogPanels',
                kind: 'screen',
                screenIndex: 1,
                previewHref: '../pages/services.html'
            },
            {
                icon: 'fa-images',
                title: 'Поправить галерею работ',
                text: 'Откроет галерею и покажет только шапку, фильтры и счётчик.',
                sectionKey: 'gallery',
                kind: 'screen',
                screenIndex: 0,
                previewHref: '../pages/gallery.html'
            },
            {
                icon: 'fa-map-location-dot',
                title: 'Обновить контакты и карту',
                text: 'Откроет страницу контактов сразу на форме и карте.',
                sectionKey: 'contacts',
                kind: 'guide',
                guideIndex: 1,
                previewHref: '../pages/contacts.html'
            },
            {
                icon: 'fa-calculator',
                title: 'Поправить цены и калькулятор',
                text: 'Переведёт в страницу цен и покажет только калькулятор и факторы.',
                sectionKey: 'prices',
                kind: 'screen',
                screenIndex: 1,
                previewHref: '../pages/prices.html'
            },
            {
                icon: 'fa-file-signature',
                title: 'Обновить оплату и документы',
                text: 'Сразу откроет страницу доверия и её пошаговую подсказку.',
                sectionKey: 'paymentDocuments',
                kind: 'guide',
                guideIndex: 0,
                previewHref: '../pages/payment-documents.html'
            }
        ];
    }

    function getActiveSimpleScreen(sectionKey = state.activeKey) {
        if (!state.activeSimpleScreen || state.activeSimpleScreen.sectionKey !== sectionKey) {
            return null;
        }

        const screens = getSectionSimpleScreens(sectionKey);
        return screens[state.activeSimpleScreen.screenIndex] || null;
    }

    function openSimpleScreen(sectionKey, screenIndex) {
        const screens = getSectionSimpleScreens(sectionKey);
        if (!screens.length || !screens[screenIndex]) return;

        state.activeSimpleScreen = {
            sectionKey,
            screenIndex
        };
        state.searchQuery = '';
        renderActiveSection();
        showAlert(`Включён простой экран: ${screens[screenIndex].title}.`, 'info');
    }

    function closeSimpleScreen(options = {}) {
        if (!state.activeSimpleScreen) return;
        state.activeSimpleScreen = null;
        state.searchQuery = '';
        renderActiveSection();
        if (!options.silent) {
            showAlert('Показан полный раздел целиком.', 'info');
        }
    }

    function runDashboardAction(action) {
        if (!action?.sectionKey) return;
        if (!switchAdminSection(action.sectionKey)) return;

        window.setTimeout(() => {
            if (action.kind === 'task') {
                const tasks = getSectionQuickTasks(action.sectionKey);
                runQuickTask(tasks[action.taskIndex]);
                return;
            }

            if (action.kind === 'screen') {
                openSimpleScreen(action.sectionKey, action.screenIndex || 0);
                return;
            }

            if (action.kind === 'guide') {
                openGuideModal(action.sectionKey, action.guideIndex || 0);
                return;
            }

            if (action.kind === 'focus') {
                revealSectionTarget(action.target);
            }
        }, 120);
    }

    function getSectionScenarios(sectionKey) {
        const scenarioMap = {
            site: [
                { icon: 'fa-signature', title: 'Обновить логотип и подпись', text: 'Поменять название, подпись рядом с логотипом и подписи внизу сайта.', sectionKey: 'brand', focusKeys: ['name', 'tagline'] },
                { icon: 'fa-phone', title: 'Поправить телефоны и адрес', text: 'Быстро обновить номера, адрес, email и режим работы.', sectionKey: 'contact', focusKeys: ['address', 'primaryPhone', 'secondaryPhone'] },
                { icon: 'fa-bars', title: 'Подправить меню', text: 'Изменить пункты верхней навигации и ссылки в футере.', sectionKey: 'navigation', focusKeys: ['label', 'href'] },
                { icon: 'fa-building', title: 'Обновить футер', text: 'Переписать блок о компании и полезные ссылки.', sectionKey: 'footer', focusKeys: ['companyTitle', 'usefulTitle'] }
            ],
            home: [
                { icon: 'fa-bolt', title: 'Поменять главный экран', text: 'Обновить заголовок, подзаголовок и сильную подпись в первом экране.', sectionKey: 'hero', focusKeys: ['titleMain', 'titleSub', 'subtitleStrong'] },
                { icon: 'fa-layer-group', title: 'Обновить большие блоки', text: 'Поменять тексты и фото в двух главных направлениях на главной.', sectionKey: 'directions', focusKeys: ['sectionTitle', 'sectionSubtitle', 'title'] },
                { icon: 'fa-shield-heart', title: 'Подправить доверие', text: 'Изменить факты, преимущества и причины выбора компании.', sectionKey: 'trust', focusKeys: ['eyebrow', 'title', 'cards'] },
                { icon: 'fa-paper-plane', title: 'Обновить форму заявки', text: 'Поменять подписи, контакты и быстрые кнопки рядом с формой.', sectionKey: 'request', focusKeys: ['formTitle', 'contactTitle', 'quickActions'] }
            ],
            catalog: [
                { icon: 'fa-folder-tree', title: 'Изменить группы каталога', text: 'Поменять названия и описания основных групп страницы каталога.', sectionKey: 'groups', focusKeys: ['title', 'text'] },
                { icon: 'fa-users', title: 'Обновить бренды', text: 'Подправить блок партнёров и подписи брендов.', sectionKey: 'partners', focusKeys: ['title'] },
                { icon: 'fa-bullhorn', title: 'Поменять нижний блок связи', text: 'Скорректировать призыв и контакты внизу страницы каталога.', sectionKey: 'cta', focusKeys: ['title', 'text'] }
            ],
            catalogPanels: [
                { icon: 'fa-truck-ramp-box', title: 'Откатные ворота', text: 'Быстро открыть и править тексты, характеристики и кнопки этого блока.', sectionKey: 'sliding', focusKeys: ['title', 'paragraphs', 'products'] },
                { icon: 'fa-door-open', title: 'Распашные ворота', text: 'Перейти сразу к карточке распашных ворот и её описанию.', sectionKey: 'swing', focusKeys: ['title', 'paragraphs', 'cards'] },
                { icon: 'fa-person-shelter', title: 'Калитки и заборы', text: 'Поменять фото и тексты в карточках калиток и заборов.', sectionKey: 'wicket', focusKeys: ['title', 'src', 'paragraphs'] },
                { icon: 'fa-robot', title: 'Автоматика и комплектующие', text: 'Сразу перейти к техничным карточкам автоматики.', sectionKey: 'automationSliding', focusKeys: ['title', 'products', 'specs'] }
            ],
            servicePages: [
                { icon: 'fa-spray-can-sparkles', title: 'Порошковая покраска', text: 'Поменять шапку, карточки услуг и нижний блок связи на странице покраски.', sectionKey: 'powderCoating', focusKeys: ['title', 'sections', 'cta'] },
                { icon: 'fa-wind', title: 'Пескоструй', text: 'Открыть страницу пескоструйной обработки и её ключевые блоки.', sectionKey: 'sandblasting', focusKeys: ['title', 'sections', 'beforeAfter'] },
                { icon: 'fa-link', title: 'Общие кнопки карточек', text: 'Поменять общие подписи и ссылки на кнопках услуг.', sectionKey: 'sharedCta', focusKeys: ['label', 'href'] }
            ],
            gallery: [
                { icon: 'fa-heading', title: 'Заголовок и вводный текст', text: 'Быстро обновить шапку страницы работ.', sectionKey: 'header', focusKeys: ['title', 'subtitle'] },
                { icon: 'fa-filter', title: 'Фильтры и показ карточек', text: 'Поменять фильтры и подпись кнопки “Показать еще”.', sectionKey: 'filters', focusKeys: ['label', 'icon', 'value'] },
                { icon: 'fa-chart-simple', title: 'Счётчик и нижние кнопки', text: 'Открыть число объектов и финальные кнопки действия.', sectionKey: 'counter', focusKeys: ['value', 'text'] }
            ],
            prices: [
                { icon: 'fa-calculator', title: 'Факторы цены', text: 'Подправить карточки с тем, от чего зависит стоимость.', sectionKey: 'factors', focusKeys: ['title', 'text'] },
                { icon: 'fa-file-invoice', title: 'Калькулятор и пояснение', text: 'Изменить верхнюю часть калькулятора и тексты рядом с ним.', sectionKey: 'calculator', focusKeys: ['title', 'text'] },
                { icon: 'fa-circle-question', title: 'Вопросы и гарантия', text: 'Быстро перейти к вопросам с ответами и гарантийным блокам.', sectionKey: 'guarantee', focusKeys: ['title', 'text', 'badge'] }
            ],
            paymentDocuments: [
                { icon: 'fa-file-signature', title: 'Официальное оформление', text: 'Поменять вводный блок про договор, оплату и документы.', sectionKey: 'hero', focusKeys: ['title', 'lead', 'text', 'chips'] },
                { icon: 'fa-list-check', title: 'Этапы работы', text: 'Изменить понятные шаги по оформлению и сопровождению.', sectionKey: 'workflow', focusKeys: ['title', 'subtitle', 'steps'] },
                { icon: 'fa-phone-volume', title: 'Связь и нижний блок', text: 'Подправить кнопки и призыв внизу страницы.', sectionKey: 'cta', focusKeys: ['title', 'text', 'actions'] }
            ],
            contacts: [
                { icon: 'fa-mobile-screen-button', title: 'Телефоны и менеджер', text: 'Поменять верхний контактный блок и данные менеджера.', sectionKey: 'overview', focusKeys: ['title', 'items', 'manager'] },
                { icon: 'fa-paper-plane', title: 'Быстрая связь', text: 'Подправить кнопки связи и тексты рядом со встроенной формой.', sectionKey: 'connect', focusKeys: ['title', 'actions', 'iframeSrc'] },
                { icon: 'fa-map-location-dot', title: 'Карта и ориентиры', text: 'Обновить карту, ориентиры и блок как нас найти.', sectionKey: 'location', focusKeys: ['title', 'mapSrc', 'badges'] }
            ]
        };

        return scenarioMap[sectionKey] || [];
    }

    function getSectionGuides(sectionKey) {
        switch (sectionKey) {
        case 'site':
            return [
                {
                    icon: 'fa-compass-drafting',
                    title: 'Шапка, телефоны и футер',
                    summary: 'Помогает быстро обновить логотип, контакты и нижнюю часть сайта без ручного поиска по всей форме.',
                    result: 'После этих шагов на сайте обновятся логотип, телефоны, адрес и подписи в футере.',
                    tips: [
                        'Сначала проверь подпись рядом с логотипом и основной номер телефона.',
                        'После правок открой главную и контакты в предпросмотре, чтобы убедиться, что всё выглядит одинаково.',
                        'Если меняются номера, лучше пройти шапку и футер за один заход.'
                    ],
                    steps: [
                        { title: 'Обновить бренд и подпись', text: 'Проверь название компании, подпись рядом с логотипом и подписи внизу сайта.', sectionKey: 'brand', focusKeys: ['name', 'tagline', 'footerCaption'], focusLabel: 'Название, подпись рядом с логотипом, подпись в футере' },
                        { title: 'Поменять телефоны и адрес', text: 'Обнови основной и второй номер, адрес, email и режим работы.', sectionKey: 'contact', focusKeys: ['primaryPhone', 'secondaryPhone', 'address', 'email', 'hours'], focusLabel: 'Телефоны, адрес, email, режим работы' },
                        { title: 'Проверить меню и футер', text: 'Если что-то переименовали, сразу доведи до конца пункты меню и полезные ссылки.', sectionKey: 'navigation', focusKeys: ['label', 'href'], focusLabel: 'Пункты меню и их ссылки' },
                        { title: 'Финально просмотреть футер', text: 'Зайди в нижний блок о компании и убедись, что подписи и ссылки звучат в одном стиле.', sectionKey: 'footer', focusKeys: ['companyTitle', 'usefulTitle'], focusLabel: 'Блок о компании и полезные ссылки' }
                    ]
                },
                {
                    icon: 'fa-bars-progress',
                    title: 'Меню и навигация сайта',
                    summary: 'Нужен, когда меняются разделы сайта, порядок меню или подписи ссылок в футере.',
                    result: 'Навигация будет выглядеть цельно и не потеряется между шапкой и футером.',
                    tips: [
                        'Верхнее меню лучше держать коротким и понятным.',
                        'После правок проверь, чтобы все ссылки вели туда, куда ожидает посетитель.'
                    ],
                    steps: [
                        { title: 'Проверить верхнее меню', text: 'Обнови названия разделов и их ссылки в верхней навигации.', sectionKey: 'navigation', focusKeys: ['label', 'href'], focusLabel: 'Названия пунктов меню и ссылки' },
                        { title: 'Сверить контакты рядом с меню', text: 'Если поменялся маршрут связи, проверь основной номер и подпись в шапке.', sectionKey: 'contact', focusKeys: ['primaryPhone', 'secondaryPhone'], focusLabel: 'Телефоны рядом с шапкой' },
                        { title: 'Довести изменения в футере', text: 'В конце выровняй полезные ссылки и блок компании в футере.', sectionKey: 'footer', focusKeys: ['usefulLinks', 'companyParagraphs'], focusLabel: 'Ссылки и текст в футере' }
                    ]
                }
            ];
        case 'home':
            return [
                {
                    icon: 'fa-house-chimney-window',
                    title: 'Главная: первый экран и направления',
                    summary: 'Помогает быстро обновить первый экран и два больших направления на главной странице.',
                    result: 'Пользователь сразу увидит новый заголовок, понятный акцент и свежие карточки направлений.',
                    tips: [
                        'Сначала правь первый экран, а затем большие карточки направлений.',
                        'Если меняешь фото, открой предпросмотр страницы и проверь, как они смотрятся в слайде.',
                        'Лучше держать главный заголовок коротким, а смысл уводить в подзаголовок.'
                    ],
                    steps: [
                        { title: 'Поменять главный экран', text: 'Обнови главный заголовок, подзаголовок и сильную подпись в первом экране.', sectionKey: 'hero', focusKeys: ['titleMain', 'titleSub', 'subtitleStrong'], focusLabel: 'Главный заголовок и сильная подпись' },
                        { title: 'Проверить преимущества рядом', text: 'Если нужно, быстро подправь короткий список услуг и преимущества под заголовком.', sectionKey: 'hero', focusKeys: ['bulletPoints', 'features'], focusLabel: 'Короткий список услуг и преимущества' },
                        { title: 'Обновить блоки направлений', text: 'Перейди к двум большим карточкам и поправь тексты, факты, кнопки и фото.', sectionKey: 'directions', focusKeys: ['sectionTitle', 'sectionSubtitle', 'slides', 'items', 'actions'], focusLabel: 'Карточки направлений, слайды и кнопки' }
                    ]
                },
                {
                    icon: 'fa-handshake-angle',
                    title: 'Главная: доверие и заявка',
                    summary: 'Подойдёт для быстрого обновления блока доверия, формы заявки и контактов рядом с ней.',
                    result: 'На главной будут звучать новые преимущества, а форма и быстрые кнопки останутся цельными и понятными.',
                    tips: [
                        'В блоке доверия лучше держать короткие сильные факты вместо длинных абзацев.',
                        'После правок формы проверь телефоны и быстрые кнопки на главной и в контактах.'
                    ],
                    steps: [
                        { title: 'Обновить блок доверия', text: 'Поменяй заголовок, акцентные факты и карточки преимуществ.', sectionKey: 'trust', focusKeys: ['eyebrow', 'title', 'highlights', 'cards'], focusLabel: 'Заголовок, факты и карточки преимуществ' },
                        { title: 'Подправить форму заявки', text: 'Проверь заголовок формы, вводный текст и быструю подсказку над ней.', sectionKey: 'request', focusKeys: ['formEyebrow', 'formTitle', 'formNotice'], focusLabel: 'Подписи формы и вводный текст' },
                        { title: 'Сверить контакты рядом с формой', text: 'В конце выровняй быстрые кнопки, контакты и встроенную форму.', sectionKey: 'request', focusKeys: ['contactTitle', 'contactLines', 'quickActions', 'iframeSrc'], focusLabel: 'Контакты, кнопки связи и встроенная форма' }
                    ]
                }
            ];
        case 'catalog':
            return [
                {
                    icon: 'fa-folder-tree',
                    title: 'Структура каталога',
                    summary: 'Подходит, если нужно обновить группы каталога, их подписи и общий нижний блок связи внизу страницы.',
                    result: 'Каталог сохранит понятную структуру, а посетитель быстрее найдёт нужную группу.',
                    tips: [
                        'Группы лучше называть коротко и так же, как их видят люди в меню.',
                        'После правок открой каталог и проверь, не выбиваются ли подписи по длине.'
                    ],
                    steps: [
                        { title: 'Проверить группы каталога', text: 'Обнови названия основных групп и короткие описания в верхней части каталога.', sectionKey: 'groups', focusKeys: ['title', 'text'], focusLabel: 'Названия групп и короткие описания' },
                        { title: 'Подправить блок партнёров', text: 'Если меняются бренды или подача автоматики, доведи это в партнерском блоке.', sectionKey: 'partners', focusKeys: ['title', 'items'], focusLabel: 'Заголовок и карточки партнёров' },
                        { title: 'Финальный блок связи каталога', text: 'Проверь нижний призыв, чтобы после правок каталог заканчивался понятным действием.', sectionKey: 'cta', focusKeys: ['title', 'text', 'actions'], focusLabel: 'Нижний призыв и кнопки' }
                    ]
                }
            ];
        case 'gallery':
            return [
                {
                    icon: 'fa-images',
                    title: 'Галерея: шапка, фильтры и действия',
                    summary: 'Подходит, когда нужно быстро обновить страницу работ без поиска по всей форме.',
                    result: 'Заголовок, фильтры, кнопка показа и нижние действия будут собраны в одном спокойном маршруте.',
                    tips: [
                        'Фильтры лучше держать короткими и одинаковыми по стилю.',
                        'После правок проверь, чтобы подписи фильтров не ломали строку на странице.',
                        'Счётчик и нижние кнопки лучше менять вместе, чтобы финальный блок выглядел цельно.'
                    ],
                    steps: [
                        { title: 'Шапка страницы работ', text: 'Обнови главный заголовок и поясняющий текст страницы галереи.', sectionKey: 'header', focusKeys: ['title', 'subtitle'], focusLabel: 'Заголовок и подзаголовок' },
                        { title: 'Фильтры галереи', text: 'Проверь порядок фильтров, подписи и иконки, чтобы ими было удобно пользоваться.', sectionKey: 'filters', focusKeys: ['label', 'icon', 'value'], focusLabel: 'Фильтры, подписи и иконки' },
                        { title: 'Счётчик выполненных работ', text: 'Проверь число объектов и пояснение рядом со счётчиком, а кнопку “Показать еще” потом удобно сверить в простом экране фильтров.', sectionKey: 'counter', focusKeys: ['value', 'text'], focusLabel: 'Счётчик и пояснение' },
                        { title: 'Нижние кнопки связи', text: 'В конце выровняй две кнопки внизу страницы работ.', sectionKey: 'cta', focusKeys: ['label', 'href'], focusLabel: 'Главная и вторичная кнопки' }
                    ]
                }
            ];
        case 'catalogPanels':
            return [
                {
                    icon: 'fa-warehouse',
                    title: 'Ворота и каркасы',
                    summary: 'Пошагово проводит по карточкам откатных, распашных ворот и их каркасов.',
                    result: 'Тексты, характеристики и кнопки в воротах и каркасах будут выровнены без блуждания по длинной форме.',
                    tips: [
                        'Сначала правь готовые ворота, потом каркасы — так проще держать структуру в голове.',
                        'Если меняешь фото, проверь стартовый кадр и порядок слайдов.',
                        'Короткие характеристики лучше не превращать в длинные абзацы.'
                    ],
                    steps: [
                        { title: 'Откатные ворота', text: 'Зайди в карточку откатных ворот и обнови заголовок, описание и ключевые карточки.', sectionKey: 'sliding', focusKeys: ['title', 'paragraphs', 'cards', 'cta'], focusLabel: 'Заголовок, описание, карточки и кнопки' },
                        { title: 'Каркас откатных ворот', text: 'Проверь описание каркаса, характеристики и ссылку на комплектующие.', sectionKey: 'slidingFrame', focusKeys: ['title', 'paragraphs', 'specGroups', 'cta'], focusLabel: 'Описание, характеристики и кнопки' },
                        { title: 'Распашные ворота', text: 'Перейди к распашным воротам и выровняй текст, характеристики и нижний призыв.', sectionKey: 'swing', focusKeys: ['title', 'paragraphs', 'cards', 'cta'], focusLabel: 'Текст, характеристики и призыв' },
                        { title: 'Каркас распашных ворот', text: 'В конце проверь каркас распашных ворот, чтобы он был согласован по подаче с основным разделом.', sectionKey: 'swingFrame', focusKeys: ['title', 'paragraphs', 'specGroups', 'cta'], focusLabel: 'Описание, характеристики и кнопки' }
                    ]
                },
                {
                    icon: 'fa-border-all',
                    title: 'Калитки и заборы',
                    summary: 'Отдельная пошаговая подсказка для калиток и всех видов заборов: профнастил, сайдинг, штакетник и жалюзи.',
                    result: 'Все карточки ограждений можно пройти одним маршрутом и быстро сверить структуру текстов.',
                    tips: [
                        'Открывай карточки по очереди, а потом сравни стиль и длину текстов.',
                        'Если меняешь палитры и фактуры, проверь, чтобы карточки не были перегружены картинками.'
                    ],
                    steps: [
                        { title: 'Калитки', text: 'Поменяй стартовое фото, краткое описание и преимущества калиток.', sectionKey: 'wicket', focusKeys: ['title', 'paragraphs', 'cards', 'src'], focusLabel: 'Фото, описание и карточки преимуществ' },
                        { title: 'Профнастил и металлосайдинг', text: 'Пройди карточки профнастила и сайдинга, выровняй описание, характеристики и блоки цвета.', sectionKey: 'fenceProfnastil', focusKeys: ['title', 'paragraphs', 'palette', 'cards'], focusLabel: 'Описание, характеристики и блок цвета' },
                        { title: 'Штакетник и жалюзи', text: 'Потом открой штакетник и жалюзи, чтобы довести варианты заполнения и стоимость.', sectionKey: 'fencePicket', focusKeys: ['title', 'paragraphs', 'cards', 'faq'], focusLabel: 'Варианты заполнения, стоимость и вопросы с ответами' },
                        { title: 'Финальная проверка жалюзи', text: 'В завершение отдельно просмотри карточку жалюзи и её нижний блок связи.', sectionKey: 'fenceLouver', focusKeys: ['title', 'paragraphs', 'cards', 'cta'], focusLabel: 'Основной текст и кнопки' }
                    ]
                },
                {
                    icon: 'fa-robot',
                    title: 'Автоматика и комплектующие',
                    summary: 'Сценарий для техничных карточек автоматики: комплекты, шаги выбора и аксессуары.',
                    result: 'Карточки автоматики и комплектующих можно поправить без ощущения лабиринта.',
                    tips: [
                        'Сначала выровняй блоки выбора, потом карточки комплектов.',
                        'Комплектующие лучше держать короче и по делу, без перегруза списками.'
                    ],
                    steps: [
                        { title: 'Автоматика для откатных ворот', text: 'Открой карточку откатной автоматики и проверь шаги выбора, товары и кнопки.', sectionKey: 'automationSliding', focusKeys: ['title', 'steps', 'products', 'cta'], focusLabel: 'Шаги выбора, товары и кнопки' },
                        { title: 'Автоматика для распашных ворот', text: 'Потом пройди раздел распашной автоматики и выровняй карточки комплектов.', sectionKey: 'automationSwing', focusKeys: ['title', 'steps', 'products', 'cta'], focusLabel: 'Товары, описание и кнопки' },
                        { title: 'Комплектующие', text: 'В завершение обнови комплектующие и их техничные блоки.', sectionKey: 'automationComponents', focusKeys: ['title', 'paragraphs', 'cards', 'cta'], focusLabel: 'Описание, характеристики и кнопки' }
                    ]
                },
                {
                    icon: 'fa-shield-halved',
                    title: 'Гараж и защита',
                    summary: 'Собирает в одном месте секционные ворота, рольворота, рольставни и раздвижные решётки.',
                    result: 'Можно быстро пройти весь блок гаража и защиты без промотки всей формы.',
                    tips: [
                        'Держи формулировки короткими и одинаково спокойными по тону.',
                        'После правок проверь, чтобы стартовые фото не спорили между собой.'
                    ],
                    steps: [
                        { title: 'Секционные ворота', text: 'Проверь тексты, характеристики и кнопки у секционных ворот.', sectionKey: 'sectional', focusKeys: ['title', 'paragraphs', 'cards', 'cta'], focusLabel: 'Описание, характеристики и кнопки' },
                        { title: 'Рольворота и рольставни', text: 'Обнови карточки рольворот и рольставней, чтобы они шли в едином стиле.', sectionKey: 'roller', focusKeys: ['title', 'paragraphs', 'cards', 'cta'], focusLabel: 'Текст, характеристики и кнопки' },
                        { title: 'Раздвижные решётки', text: 'Финально открой металлические раздвижные решётки и проверь главный кадр, текст и блок преимуществ.', sectionKey: 'grilles', focusKeys: ['title', 'paragraphs', 'cards', 'cta'], focusLabel: 'Главный кадр, текст и кнопки' }
                    ]
                }
            ];
        case 'servicePages':
            return [
                {
                    icon: 'fa-spray-can-sparkles',
                    title: 'Порошковая покраска',
                    summary: 'Быстрая пошаговая подсказка по шапке страницы, карточкам услуг, вопросам и нижнему блоку связи покраски.',
                    result: 'Страница покраски обновится как цельный маршрут, а не набор разрозненных блоков.',
                    tips: [
                        'В шапке держи обещание коротким, а детали уводи в карточки услуг.',
                        'После правок нижнего блока связи проверь телефоны и кнопки.'
                    ],
                    steps: [
                        { title: 'Шапка и быстрые ссылки', text: 'Обнови заголовок страницы и верхние быстрые ссылки.', sectionKey: 'powderCoating', focusKeys: ['header', 'quickNav'], focusLabel: 'Шапка страницы и быстрые ссылки' },
                        { title: 'Карточки услуг', text: 'Пройди карточки услуг, преимущества и шаги процесса.', sectionKey: 'powderCoating', focusKeys: ['sections', 'advantages', 'processSteps'], focusLabel: 'Карточки услуг, преимущества и шаги' },
                        { title: 'Вопросы и нижний блок', text: 'Финально обнови вопросы и ответы и нижний блок связи.', sectionKey: 'powderCoating', focusKeys: ['faq', 'cta'], focusLabel: 'Вопросы и ответы и нижний блок связи' }
                    ]
                },
                {
                    icon: 'fa-wind',
                    title: 'Пескоструйная обработка',
                    summary: 'Отдельная пошаговая подсказка по странице пескоструя: шапка, услуги, блок до/после и завершение страницы.',
                    result: 'Страница пескоструя будет читаться цельно и без разрозненных правок.',
                    tips: [
                        'После правок блока до/после проверь, что подписи к нему остаются понятными.',
                        'Секции услуги лучше выравнивать по структуре с порошковой покраской.'
                    ],
                    steps: [
                        { title: 'Шапка и быстрые ссылки', text: 'Открой верх страницы и поправь заголовок, подзаголовок и навигацию.', sectionKey: 'sandblasting', focusKeys: ['header', 'quickNav'], focusLabel: 'Шапка страницы и быстрые ссылки' },
                        { title: 'Карточки услуг и до/после', text: 'Потом пройди карточки услуг и блок сравнения.', sectionKey: 'sandblasting', focusKeys: ['sections', 'beforeAfter'], focusLabel: 'Карточки услуг и блок до/после' },
                        { title: 'Вопросы и нижний блок', text: 'В конце проверь вопросы и ответы и блок связи.', sectionKey: 'sandblasting', focusKeys: ['faq', 'cta'], focusLabel: 'Вопросы и ответы и нижний блок связи' }
                    ]
                }
            ];
        case 'automation':
            return [
                {
                    icon: 'fa-bolt',
                    title: 'Страница автоматики',
                    summary: 'Мастер по общей странице автоматики, комплектующим и карточкам отдельных товаров.',
                    result: 'Автоматика будет редактироваться понятными кусками: первый экран, комплектующие, товары.',
                    tips: [
                        'Сначала лучше править первый экран, карточки комплектов, блок подсказок и кнопки.',
                        'Товарные страницы удобнее проходить уже после общей страницы.'
                    ],
                    steps: [
                        { title: 'Основной экран автоматики', text: 'Обнови первый экран, карточки комплектов и блок подсказок на основной странице автоматики.', sectionKey: 'swingLanding', focusKeys: ['hero', 'products', 'guide', 'cta'], focusLabel: 'Первый экран, карточки комплектов, подсказки и кнопки' },
                        { title: 'Комплектующие для откатных ворот', text: 'Перейди к отдельной странице комплектующих и обнови её описание и блоки характеристик.', sectionKey: 'slidingComponentsPage', focusKeys: ['title', 'description', 'sections'], focusLabel: 'Описание и блоки характеристик' },
                        { title: 'Страницы отдельных товаров', text: 'Финально пройди карточки отдельных товаров и общие кнопки.', sectionKey: 'productPages', focusKeys: ['title', 'description', 'specs'], focusLabel: 'Название, описание и характеристики товаров' }
                    ]
                }
            ];
        case 'paymentDocuments':
            return [
                {
                    icon: 'fa-file-signature',
                    title: 'Оплата и документы',
                    summary: 'Пошаговая подсказка по странице доверия: официальное оформление, этапы и нижний блок связи.',
                    result: 'Страница будет спокойно вести человека по понятному пути: как оформляется заказ и какие документы получает клиент.',
                    tips: [
                        'Лучше не перегружать эту страницу техническими формулировками.',
                        'Держи акцент на доверии, понятности оплаты и комплекте документов.'
                    ],
                    steps: [
                        { title: 'Главный блок доверия', text: 'Проверь заголовок, короткий лид, поясняющий текст и чипы про договор, оплату и отчётность.', sectionKey: 'hero', focusKeys: ['title', 'lead', 'text', 'chips'], focusLabel: 'Заголовок, лид, описание и чипы' },
                        { title: 'Этапы оформления', text: 'Потом выровняй шаги процесса и их формулировки.', sectionKey: 'workflow', focusKeys: ['title', 'subtitle', 'steps'], focusLabel: 'Шаги оформления и пояснения' },
                        { title: 'Нижний блок и связь', text: 'В конце проверь завершающий призыв и кнопки связи.', sectionKey: 'cta', focusKeys: ['title', 'text', 'actions'], focusLabel: 'Нижний блок связи и кнопки' }
                    ]
                }
            ];
        case 'contacts':
            return [
                {
                    icon: 'fa-address-book',
                    title: 'Контакты: верх и основные данные',
                    summary: 'Подойдёт, когда нужно быстро обновить первый экран страницы контактов и основной блок с менеджером и телефонами.',
                    result: 'Контактная страница будет сразу выглядеть аккуратно и не потеряет главные номера и адрес.',
                    tips: [
                        'На этой странице лучше сначала обновлять первый экран, потом основной контактный блок.',
                        'Если меняется один номер, проверь, не остался ли старый в форме или кнопках.'
                    ],
                    steps: [
                        { title: 'Первый экран контактов', text: 'Поменяй верхний заголовок, подзаголовок и факты в первом экране.', sectionKey: 'hero', focusKeys: ['title', 'subtitle', 'facts'], focusLabel: 'Верхний заголовок, подзаголовок и факты' },
                        { title: 'Основные контакты и менеджер', text: 'Обнови телефоны, адрес, карточки контактов и данные менеджера.', sectionKey: 'overview', focusKeys: ['items', 'manager', 'hours'], focusLabel: 'Карточки контактов, менеджер и режим работы' },
                        { title: 'Финальная сверка', text: 'После правок открой страницу и проверь, что номера и адрес везде совпадают.', sectionKey: 'overview', focusKeys: ['title', 'text'], focusLabel: 'Заголовок и основной текст блока' }
                    ]
                },
                {
                    icon: 'fa-route',
                    title: 'Контакты: связь и карта',
                    summary: 'Отдельная пошаговая подсказка для формы связи, кнопок, карты и ориентиров.',
                    result: 'Блок быстрой связи и нижний маршрут будут собраны и не станут спорить между собой.',
                    tips: [
                        'Форму и быстрые кнопки лучше менять вместе, чтобы они оставались одним цельным блоком.',
                        'После правок карты проверь, что встроенная карта открывается и ориентиры звучат понятно.'
                    ],
                    steps: [
                        { title: 'Быстрая связь и форма', text: 'Проверь заголовок, заметку, кнопки и встроенную форму.', sectionKey: 'connect', focusKeys: ['title', 'notice', 'actions', 'iframeSrc'], focusLabel: 'Заголовок, кнопки и встроенная форма' },
                        { title: 'Карта и бейджи', text: 'Открой нижний блок и проверь карту, короткие бейджи и ориентиры.', sectionKey: 'location', focusKeys: ['title', 'mapSrc', 'badges', 'points'], focusLabel: 'Карта, бейджи и ориентиры' },
                        { title: 'Завершающий маршрут', text: 'В конце ещё раз открой страницу и проверь, что маршрут читается легко и без перегруза.', sectionKey: 'location', focusKeys: ['text'], focusLabel: 'Описание нижнего блока' }
                    ]
                }
            ];
        case 'prices':
            return [
                {
                    icon: 'fa-tags',
                    title: 'Цены: верх и факторы стоимости',
                    summary: 'Позволяет быстро обновить заголовок страницы и карточки факторов цены.',
                    result: 'Страница цен сразу объяснит, от чего зависит стоимость и куда человеку идти дальше.',
                    tips: [
                        'Факторы цены лучше держать короткими карточками без длинных абзацев.',
                        'Если меняешь акценты, проверь длину заголовков, чтобы карточки оставались ровными.'
                    ],
                    steps: [
                        { title: 'Шапка страницы', text: 'Проверь главный заголовок и подзаголовок на странице цен.', sectionKey: 'header', focusKeys: ['title', 'subtitle'], focusLabel: 'Главный заголовок и подзаголовок' },
                        { title: 'Факторы стоимости', text: 'Потом пройди карточки факторов, их заголовки и описания.', sectionKey: 'factors', focusKeys: ['title', 'items'], focusLabel: 'Заголовок блока и карточки факторов' },
                        { title: 'Быстрая сверка кнопок', text: 'После правок открой низ страницы и проверь, что кнопки остаются логичным продолжением страницы.', sectionKey: 'cta', focusKeys: ['primary', 'secondary'], focusLabel: 'Главная и вторичная кнопки' }
                    ]
                },
                {
                    icon: 'fa-calculator',
                    title: 'Цены: калькулятор и доверие',
                    summary: 'Сценарий для правки калькулятора, блока гарантии и нижних ответов на вопросы.',
                    result: 'Калькулятор и гарантия будут работать как единый блок доверия, а не как отдельные куски.',
                    tips: [
                        'Сначала поправь калькулятор и телефоны, потом переходи к гарантии.',
                        'Вопросы и ответы лучше держать короткими и без дублей из верхних блоков.'
                    ],
                    steps: [
                        { title: 'Калькулятор и звонок', text: 'Обнови заголовок, описание, кнопку и телефоны рядом с калькулятором.', sectionKey: 'calculator', focusKeys: ['title', 'text', 'action', 'phones'], focusLabel: 'Калькулятор, кнопка и телефоны' },
                        { title: 'Гарантия', text: 'Проверь плашку, заголовок и пояснение в блоке гарантии.', sectionKey: 'guarantee', focusKeys: ['badge', 'title', 'text'], focusLabel: 'Плашка, заголовок и текст гарантии' },
                        { title: 'Вопросы и ответы страницы', text: 'В конце пройди вопросы и ответы, чтобы закрыть частые возражения клиента.', sectionKey: 'faq', focusKeys: ['title', 'items'], focusLabel: 'Вопросы и ответы и список вопросов' }
                    ]
                }
            ];
        default:
            return [];
        }
    }

    function getTopLevelFieldLabel(contentKey, fieldKey) {
        const config = contentConfigs[contentKey];
        const field = config?.schema?.fields?.find((item) => item.key === fieldKey);
        return field?.label || fieldKey;
    }

    function clearSectionSearch() {
        state.searchQuery = '';
        if (elements.searchInput) {
            elements.searchInput.value = '';
        }
        applySectionFilter();
    }

    function findScopedContainer(target) {
        if (!target?.sectionKey) return elements.form;
        syncGroupEditorScreenForTarget(state.activeKey, target.sectionKey, target.focusKeys);
        return openEditorSection(state.activeKey, target.sectionKey) || elements.form;
    }

    function openMediaPickerForTarget(target) {
        const scopedContainer = findScopedContainer(target);
        if (!scopedContainer) return false;

        const mediaButton = scopedContainer.querySelector('.admin-field[data-field-key="src"] .admin-field__media-actions button');
        if (mediaButton instanceof HTMLButtonElement) {
            mediaButton.click();
            return true;
        }

        return false;
    }

    function revealSectionTarget(target) {
        if (!target) return false;

        const activeScreen = getActiveSimpleScreen();
        if (
            activeScreen
            && target.sectionKey
            && !activeScreen.fieldKeys.includes(target.sectionKey)
        ) {
            state.activeSimpleScreen = null;
            renderActiveSection();
        }

        clearSectionSearch();

        let scopedContainer = null;
        if (target.sectionKey) {
            syncGroupEditorScreenForTarget(state.activeKey, target.sectionKey, target.focusKeys);
            scopedContainer = openEditorSection(state.activeKey, target.sectionKey);
        }

        if (Array.isArray(target.focusKeys) && target.focusKeys.length) {
            window.setTimeout(() => {
                focusField((fieldNode) => {
                    if (scopedContainer && !scopedContainer.contains(fieldNode)) {
                        return false;
                    }

                    const fieldKey = fieldNode.dataset.fieldKey || '';
                    return target.focusKeys.some((candidate) => fieldKey === candidate || fieldKey.includes(candidate));
                });
            }, 120);
        }

        return Boolean(scopedContainer);
    }

    function runQuickTask(task) {
        if (!task) return;

        if (task.kind === 'guide') {
            openGuideModal(state.activeKey, task.guideIndex || 0);
            showAlert(`Открыта задача: ${task.title}.`, 'info');
            return;
        }

        if (task.kind === 'media') {
            revealSectionTarget(task.target);
            window.setTimeout(() => {
                if (openMediaPickerForTarget(task.target)) {
                    showAlert(`Открыта задача: ${task.title}.`, 'info');
                    return;
                }

                showAlert('Не удалось автоматически открыть выбор фото. Нужный блок уже раскрыт, фото можно выбрать вручную.', 'info');
            }, 180);
            return;
        }

        if (task.kind === 'focus') {
            revealSectionTarget(task.target);
            showAlert(`Открыта задача: ${task.title}.`, 'info');
            return;
        }

        if (task.kind === 'preview') {
            const previewLink = getPrimaryPreviewLink(state.activeKey);
            if (previewLink) {
                window.open(previewLink.href, '_blank', 'noopener');
            }
            return;
        }
    }

    function getActiveGuide() {
        if (!state.activeGuide) return null;
        const guides = getSectionGuides(state.activeGuide.sectionKey);
        return guides[state.activeGuide.guideIndex] || null;
    }

    function closeGuideModal(options = {}) {
        if (!elements.guideModal) return;
        elements.guideModal.hidden = true;
        document.body.classList.remove('admin-guide-open');
        if (!options.keepState) {
            state.activeGuide = null;
        }
        renderToolbarPath(state.activeKey);
        renderSidebarFooter();
    }

    function renderGuideModal() {
        const guide = getActiveGuide();
        if (!guide || !elements.guideContent || !elements.guideTitle || !elements.guideLead) {
            closeGuideModal();
            return;
        }

        const currentStepIndex = Math.min(state.activeGuide?.stepIndex || 0, Math.max(guide.steps.length - 1, 0));
        const previewLink = getPrimaryPreviewLink(state.activeGuide.sectionKey);

        elements.guideTitle.textContent = guide.title;
        elements.guideLead.textContent = guide.summary;
        elements.guideContent.innerHTML = `
            <aside class="admin-guide__aside">
                <section class="admin-guide__intro-card">
                    <span class="admin-guide__icon"><i class="fas ${guide.icon}" aria-hidden="true"></i></span>
                    <div class="admin-guide__eyebrow">Что получится после правок</div>
                    <h3>${guide.title}</h3>
                    <p>${guide.result}</p>
                    <div class="admin-guide__meta">
                        <span><i class="fas fa-list-ol" aria-hidden="true"></i> ${guide.steps.length} шага</span>
                        <span><i class="fas fa-folder-open" aria-hidden="true"></i> ${contentConfigs[state.activeGuide.sectionKey].label}</span>
                    </div>
                </section>
                <section class="admin-guide__tips-card">
                    <div class="admin-guide__aside-head">
                        <p class="admin-toolbar__eyebrow">Перед началом</p>
                        <h3>На что обратить внимание</h3>
                    </div>
                    <ul class="admin-guide__tips">
                        ${guide.tips.map((tip) => `<li>${tip}</li>`).join('')}
                    </ul>
                    <div class="admin-guide__aside-actions">
                        ${previewLink ? `
                            <a class="admin-btn admin-btn--ghost" href="${previewLink.href}" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> Открыть страницу
                            </a>
                        ` : ''}
                        <button class="admin-btn admin-btn--primary" type="button" data-guide-run-current>
                            <i class="fas fa-location-arrow" aria-hidden="true"></i> Перейти к текущему шагу
                        </button>
                    </div>
                </section>
            </aside>
            <section class="admin-guide__steps-wrap">
                <div class="admin-guide__steps-head">
                    <div>
                        <p class="admin-toolbar__eyebrow">Шаги подсказки</p>
                        <h3>Иди сверху вниз и сохраняй раздел в конце</h3>
                    </div>
                    <span>Можно открыть любой шаг сразу: нужный блок формы раскроется автоматически.</span>
                </div>
                <div class="admin-guide__steps">
                    ${guide.steps.map((step, index) => `
                        <article class="admin-guide-step ${index === currentStepIndex ? 'is-current' : ''}">
                            <div class="admin-guide-step__number">${index + 1}</div>
                            <div class="admin-guide-step__content">
                                <div class="admin-guide-step__header">
                                    <div>
                                        <strong>${step.title}</strong>
                                        <p>${step.text}</p>
                                    </div>
                                    <span class="admin-status-badge is-${index === currentStepIndex ? 'saved' : 'idle'}">${index === currentStepIndex ? 'Текущий шаг' : 'Следующий шаг'}</span>
                                </div>
                                <div class="admin-guide-step__meta">
                                    <span><i class="fas fa-layer-group" aria-hidden="true"></i> ${getTopLevelFieldLabel(state.activeGuide.sectionKey, step.sectionKey)}</span>
                                    ${step.focusLabel ? `<span><i class="fas fa-heading" aria-hidden="true"></i> ${step.focusLabel}</span>` : ''}
                                </div>
                                <div class="admin-guide-step__actions">
                                    <button class="admin-btn admin-btn--primary" type="button" data-guide-step-index="${index}">
                                        <i class="fas fa-arrow-right" aria-hidden="true"></i> Перейти к шагу
                                    </button>
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        `;

        elements.guideContent.querySelector('[data-guide-run-current]')?.addEventListener('click', () => {
            runGuideStep(currentStepIndex);
        });

        elements.guideContent.querySelectorAll('[data-guide-step-index]').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.getAttribute('data-guide-step-index'));
                runGuideStep(index);
            });
        });
    }

    function openGuideModal(sectionKey, guideIndex = 0, options = {}) {
        if (!elements.guideModal) return;

        const guides = getSectionGuides(sectionKey);
        if (!guides.length || !guides[guideIndex]) return;

        state.activeGuide = {
            sectionKey,
            guideIndex,
            stepIndex: options.stepIndex || 0
        };

        renderGuideModal();
        elements.guideModal.hidden = false;
        document.body.classList.add('admin-guide-open');
        renderToolbarPath(state.activeKey);
        renderSidebarFooter();
    }

    function runGuideStep(stepIndex) {
        const guide = getActiveGuide();
        if (!guide || !guide.steps[stepIndex]) return;

        state.activeGuide.stepIndex = stepIndex;
        renderGuideModal();

        const step = guide.steps[stepIndex];
        revealSectionTarget(step);
        showAlert(`Открыт шаг ${stepIndex + 1}: ${step.title}.`, 'info');
    }

    function focusField(matcher) {
        const fields = Array.from(elements.form?.querySelectorAll('.admin-field, details.admin-section') || []);
        const targetField = fields.find((fieldNode) => !fieldNode.closest('[hidden]') && matcher(fieldNode));
        if (!targetField) return false;

        let parentDetails = targetField.closest('details');
        while (parentDetails) {
            parentDetails.open = true;
            parentDetails = parentDetails.parentElement?.closest('details') || null;
        }

        const input = targetField.querySelector('input, textarea');
        targetField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (input) {
            input.focus({ preventScroll: true });
        }
        targetField.classList.add('is-focused-shot');
        window.setTimeout(() => targetField.classList.remove('is-focused-shot'), 1200);
        return true;
    }

    function getTopLevelSectionId(contentKey, fieldKey) {
        const config = contentConfigs[contentKey];
        const topField = config?.schema?.fields?.find((field) => field.key === fieldKey);
        if (!topField) return '';
        return `admin-top-${contentKey}-${slugifyLabel(topField.key || topField.label)}`;
    }

    function openTopLevelSection(contentKey, fieldKey) {
        const targetId = getTopLevelSectionId(contentKey, fieldKey);
        if (!targetId) return null;

        const details = document.getElementById(targetId);
        if (!(details instanceof HTMLDetailsElement)) return null;

        details.open = true;
        details.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return details;
    }

    function runSectionScenario(scenario) {
        if (!scenario) return;
        revealSectionTarget(scenario);
        showAlert(`Открыт путь: ${scenario.title}.`, 'info');
    }

    function renderStatusCard(sectionKey) {
        if (!elements.statusCard) return;

        const config = contentConfigs[sectionKey];
        const sectionState = getSectionAdminState(sectionKey);
        const status = getSectionStatus(sectionKey);

        elements.statusCard.innerHTML = `
            <div class="admin-preview-card__header">
                <div>
                    <p class="admin-toolbar__eyebrow">Статус раздела</p>
                    <h2>${config.label}</h2>
                </div>
                <span class="admin-status-badge is-${status.tone}">${status.label}</span>
            </div>
            <p class="admin-preview-card__lead">${status.description}</p>
            <div class="admin-status-list">
                <div><strong>Сохранено:</strong> ${formatDateTime(sectionState?.lastSavedAt)}</div>
                <div><strong>Кто сохранял:</strong> ${sectionState?.lastSavedBy || '—'}</div>
                <div><strong>Опубликовано:</strong> ${formatDateTime(sectionState?.lastPublishedAt)}</div>
                <div><strong>Кто публиковал:</strong> ${sectionState?.lastPublishedBy || '—'}</div>
            </div>
        `;
    }

    function renderQuickActions(sectionKey) {
        if (!elements.quickActionsCard) return;

        const previewLink = getPrimaryPreviewLink(sectionKey);
        const tasks = getSectionQuickTasks(sectionKey).slice(0, 3);
        const simpleScreens = getSectionSimpleScreens(sectionKey).slice(0, 2);
        const scenarios = getSectionScenarios(sectionKey).slice(0, 3);
        const guides = getSectionGuides(sectionKey).slice(0, 2);

        elements.quickActionsCard.innerHTML = `
            <div class="admin-preview-card__header">
                <div>
                    <p class="admin-toolbar__eyebrow">Частые действия</p>
                    <h2>Быстрые действия</h2>
                </div>
            </div>
            <div class="admin-quick-actions">
                <button class="admin-btn admin-btn--ghost" type="button" data-quick-action="image">
                    <i class="fas fa-image" aria-hidden="true"></i> Поменять фото
                </button>
                <button class="admin-btn admin-btn--ghost" type="button" data-quick-action="text">
                    <i class="fas fa-heading" aria-hidden="true"></i> Поменять текст блока
                </button>
                <button class="admin-btn admin-btn--ghost" type="button" data-quick-action="contacts">
                    <i class="fas fa-phone" aria-hidden="true"></i> Изменить контакты
                </button>
                <button class="admin-btn admin-btn--ghost" type="button" data-quick-action="add">
                    <i class="fas fa-plus" aria-hidden="true"></i> Добавить карточку
                </button>
                ${previewLink ? `
                    <a class="admin-btn admin-btn--primary" href="${previewLink.href}" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> Открыть страницу
                    </a>
                ` : ''}
                ${guides.length ? `
                    <button class="admin-btn admin-btn--primary" type="button" data-open-guide="0">
                        <i class="fas fa-map-signs" aria-hidden="true"></i> Открыть подсказку
                    </button>
                ` : ''}
            </div>
            ${scenarios.length ? `
                <div class="admin-quick-actions__scenarios">
                    ${scenarios.map((scenario, index) => `
                        <button class="admin-quick-actions__scenario" type="button" data-quick-scenario-index="${index}">
                            <i class="fas ${scenario.icon}" aria-hidden="true"></i>
                            <span>${scenario.title}</span>
                        </button>
                    `).join('')}
                </div>
            ` : ''}
            ${guides.length ? `
                <div class="admin-quick-actions__guides">
                    ${guides.map((guide, index) => `
                        <button class="admin-quick-actions__guide" type="button" data-open-guide="${index}">
                            <i class="fas ${guide.icon}" aria-hidden="true"></i>
                            <span>${guide.title}</span>
                        </button>
                    `).join('')}
                </div>
            ` : ''}
            ${tasks.length ? `
                <div class="admin-quick-actions__tasks">
                    ${tasks.map((task, index) => `
                        <button class="admin-quick-actions__task" type="button" data-quick-task-index="${index}">
                            <i class="fas ${task.icon}" aria-hidden="true"></i>
                            <span>${task.title}</span>
                        </button>
                    `).join('')}
                </div>
            ` : ''}
            ${simpleScreens.length ? `
                <div class="admin-quick-actions__screens">
                    ${simpleScreens.map((screen, index) => `
                        <button class="admin-quick-actions__screen" type="button" data-quick-screen-index="${index}">
                            <i class="fas ${screen.icon}" aria-hidden="true"></i>
                            <span>${screen.title}</span>
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;

        elements.quickActionsCard.querySelectorAll('[data-quick-action]').forEach((button) => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-quick-action');

                if (action === 'image') {
                    const firstImageAction = elements.form?.querySelector('.admin-field[data-field-key="src"] .admin-field__media-actions button');
                    if (firstImageAction instanceof HTMLButtonElement) {
                        setActivePreviewCard('summary');
                        firstImageAction.click();
                        return;
                    }
                }

                if (action === 'text') {
                    if (focusField((fieldNode) => /title|lead|subtitle|text|description/i.test(fieldNode.dataset.fieldKey || ''))) {
                        setActivePreviewCard('summary');
                        return;
                    }
                }

                if (action === 'contacts') {
                    if (focusField((fieldNode) => /address|email|hours|href|label|phone/i.test(fieldNode.dataset.fieldKey || ''))) {
                        setActivePreviewCard('summary');
                        return;
                    }
                }

                if (action === 'add') {
                    const addButton = elements.form?.querySelector('.admin-array__toolbar .admin-btn');
                    if (addButton instanceof HTMLButtonElement) {
                        setActivePreviewCard('actions');
                        addButton.click();
                        return;
                    }
                }

                showAlert('Для этого действия пока не найден подходящий блок в текущем разделе.', 'info');
            });
        });

        elements.quickActionsCard.querySelectorAll('[data-quick-scenario-index]').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.getAttribute('data-quick-scenario-index'));
                runSectionScenario(scenarios[index]);
            });
        });

        elements.quickActionsCard.querySelectorAll('[data-open-guide]').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.getAttribute('data-open-guide'));
                openGuideModal(sectionKey, index);
            });
        });

        elements.quickActionsCard.querySelectorAll('[data-quick-task-index]').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.getAttribute('data-quick-task-index'));
                runQuickTask(tasks[index]);
            });
        });

        elements.quickActionsCard.querySelectorAll('[data-quick-screen-index]').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.getAttribute('data-quick-screen-index'));
                openSimpleScreen(sectionKey, index);
            });
        });
    }

    function renderScreenCard(sectionKey) {
        if (!elements.screenCard) return;

        const activeScreen = getActiveSimpleScreen(sectionKey);
        if (!activeScreen) {
            elements.screenCard.hidden = true;
            elements.screenCard.innerHTML = '';
            return;
        }

        const labels = activeScreen.fieldKeys.map((fieldKey) => getTopLevelFieldLabel(sectionKey, fieldKey));
        elements.screenCard.hidden = false;
        elements.screenCard.innerHTML = `
            <div class="admin-screen-card__head">
                <div>
                    <p class="admin-toolbar__eyebrow">Сейчас включён простой экран</p>
                    <h2>${activeScreen.title}</h2>
                    <p>${activeScreen.text}</p>
                </div>
                <div class="admin-screen-card__actions">
                    <button class="admin-btn admin-btn--ghost" type="button" id="adminScreenBackBtn">
                        <i class="fas fa-arrow-left" aria-hidden="true"></i> Показать весь раздел
                    </button>
                </div>
            </div>
            <div class="admin-screen-card__chips">
                ${labels.map((label) => `<span><i class="fas fa-layer-group" aria-hidden="true"></i> ${label}</span>`).join('')}
            </div>
        `;

        elements.screenCard.querySelector('#adminScreenBackBtn')?.addEventListener('click', () => {
            closeSimpleScreen();
        });
    }

    function renderDashboardHome() {
        const actions = getDashboardHomeActions();
        if (elements.form) {
            elements.form.innerHTML = `
                <section class="admin-dashboard-home">
                    <div class="admin-dashboard-home__hero">
                        <div>
                            <p class="admin-toolbar__eyebrow">Домашний экран админки</p>
                            <h2>Что хотите изменить на сайте?</h2>
                            <p>Выберите готовое действие, и админка сама откроет нужный раздел, подсказку или простой экран без поиска по всей форме.</p>
                        </div>
                        <div class="admin-dashboard-home__hero-note">
                            <strong>Понятный путь</strong>
                            <span>Нажали действие → открылся нужный блок → сохранили изменения → проверили страницу.</span>
                        </div>
                    </div>
                    <div class="admin-dashboard-home__grid">
                        ${actions.map((action, index) => `
                            <button class="admin-dashboard-action" type="button" data-dashboard-action-index="${index}">
                                <span class="admin-dashboard-action__icon"><i class="fas ${action.icon}" aria-hidden="true"></i></span>
                                <strong>${action.title}</strong>
                                <p>${action.text}</p>
                                <div class="admin-dashboard-action__footer">
                                    <span><i class="fas fa-layer-group" aria-hidden="true"></i> ${contentConfigs[action.sectionKey].label}</span>
                                    <span><i class="fas fa-arrow-right" aria-hidden="true"></i> Открыть</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                    <div class="admin-dashboard-home__links">
                        ${actions.map((action) => `
                            <a href="${action.previewHref}" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                                <span>${action.title}</span>
                            </a>
                        `).join('')}
                    </div>
                </section>
            `;

            elements.form.querySelectorAll('[data-dashboard-action-index]').forEach((button) => {
                button.addEventListener('click', () => {
                    const index = Number(button.getAttribute('data-dashboard-action-index'));
                    runDashboardAction(actions[index]);
                });
            });
        }

        if (elements.previewPanel) {
            elements.previewPanel.hidden = true;
        }
        if (elements.sectionTabs) {
            elements.sectionTabs.hidden = true;
            elements.sectionTabs.innerHTML = '';
        }
        if (elements.overview) {
            elements.overview.hidden = true;
            elements.overview.innerHTML = '';
        }
        if (elements.jumpbar) {
            elements.jumpbar.hidden = true;
            elements.jumpbar.innerHTML = '';
        }
        if (elements.searchCard) {
            elements.searchCard.hidden = true;
        }
        if (elements.screenCard) {
            elements.screenCard.hidden = true;
            elements.screenCard.innerHTML = '';
        }
        if (elements.modeNote) {
            elements.modeNote.hidden = true;
        }
        if (elements.pageLinks) {
            elements.pageLinks.hidden = true;
        }
        updateAssistPanelUi({ open: false });

        updateToolbarChrome();
    }

    function renderMiniPreview(sectionKey) {
        if (!elements.miniPreviewCard) return;

        const summary = collectPreviewSummary(state.data[sectionKey]);
        const eyebrow = summary.eyebrows[0] || 'Так сейчас будет выглядеть блок';
        const title = summary.titles[0] || contentConfigs[sectionKey].label;
        const lead = summary.texts[0] || 'После изменения текста, фото и кнопок эта карточка поможет быстро проверить, не потерялся ли смысл.';
        const image = summary.images[0] || '';
        const buttons = summary.buttons.slice(0, 3);

        elements.miniPreviewCard.innerHTML = `
            <div class="admin-preview-card__header">
                <div>
                    <p class="admin-toolbar__eyebrow">Мини-превью результата</p>
                    <h2>Как это выглядит</h2>
                </div>
            </div>
            <div class="admin-mini-preview">
                ${image ? `<img class="admin-mini-preview__image" src="${getPreviewUrl(image)}" alt="Мини-превью блока" loading="lazy">` : ''}
                <div class="admin-mini-preview__copy">
                    <span class="admin-mini-preview__eyebrow">${eyebrow}</span>
                    <strong class="admin-mini-preview__title">${title}</strong>
                    <p class="admin-mini-preview__text">${lead}</p>
                    ${buttons.length ? `<div class="admin-mini-preview__actions">${buttons.map((item) => `<span>${item}</span>`).join('')}</div>` : ''}
                    ${state.lastFocusedField?.label ? `<div class="admin-mini-preview__focus">Сейчас редактируешь: ${state.lastFocusedField.label}</div>` : ''}
                </div>
            </div>
        `;
    }

    function refreshLivePreview() {
        const previewLink = getPrimaryPreviewLink(state.activeKey);
        if (!elements.livePreviewFrame || !elements.livePreviewOpenBtn) return;

        if (!previewLink) {
            elements.livePreviewFrame.removeAttribute('src');
            elements.livePreviewFrame.hidden = true;
            elements.livePreviewOpenBtn.href = '../index.html';
            elements.livePreviewOpenBtn.textContent = 'Нет ссылки предпросмотра';
            elements.livePreviewOpenBtn.setAttribute('aria-disabled', 'true');
            return;
        }

        const href = previewLink.href;
        const separator = href.includes('?') ? '&' : '?';
        state.livePreviewHref = href;
        elements.livePreviewOpenBtn.href = href;
        elements.livePreviewOpenBtn.innerHTML = '<i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> Открыть страницу';
        elements.livePreviewOpenBtn.removeAttribute('aria-disabled');
        elements.livePreviewFrame.hidden = false;
        elements.livePreviewFrame.src = `${href}${separator}adminPreview=${Date.now()}`;
    }

    function renderOverview(key) {
        if (!elements.overview) return;

        const config = contentConfigs[key];
        const meta = sectionMeta[key] || {};
        const previewLinks = Array.isArray(meta.previewLinks) ? meta.previewLinks : [];
        const bullets = Array.isArray(meta.bullets) ? meta.bullets : [];
        const tips = Array.isArray(meta.tips) ? meta.tips : [];

        const bulletsHtml = bullets.length
            ? `<ul class="admin-overview__list">${bullets.map((item) => `<li>${item}</li>`).join('')}</ul>`
            : '<p>В этом разделе можно менять тексты и структуру выбранной страницы.</p>';

        const tipsHtml = tips.length
            ? `<ul class="admin-overview__list">${tips.map((item) => `<li>${item}</li>`).join('')}</ul>`
            : '<p>Измени нужные поля, сохрани раздел и проверь страницу в браузере.</p>';

        const previewHtml = previewLinks.length
            ? `<div class="admin-overview__links">${previewLinks.map((link) => `
                <a href="${link.href}" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                    <span>${link.label}</span>
                </a>
            `).join('')}</div>`
            : '<p>Для этого раздела пока нет отдельной ссылки предпросмотра.</p>';

        elements.overview.innerHTML = `
            <div class="admin-overview__header">
                <p class="admin-overview__eyebrow">Что меняется в этом разделе</p>
                <h2>${config.label}</h2>
                <p>${meta.summary || config.description}</p>
            </div>
            <div class="admin-overview__grid">
                <article class="admin-overview__card">
                    <h3>Что можно менять</h3>
                    ${bulletsHtml}
                </article>
                <article class="admin-overview__card">
                    <h3>Где смотреть результат</h3>
                    ${previewHtml}
                </article>
                <article class="admin-overview__card">
                    <h3>На что обратить внимание</h3>
                    ${tipsHtml}
                </article>
            </div>
        `;
    }

    function updateConnectionState() {
        if (state.apiAvailable && state.authRequired && state.authenticated) {
            elements.connection.textContent = `Редактирование доступно · вход выполнен${state.username ? `: ${state.username}` : ''}`;
            elements.connection.className = 'admin-connection is-live';
        } else if (state.apiAvailable && state.authRequired) {
            elements.connection.textContent = 'Редактирование доступно · нужен вход';
            elements.connection.className = 'admin-connection is-live';
        } else if (state.apiAvailable) {
            elements.connection.textContent = 'Локальный режим редактирования';
            elements.connection.className = 'admin-connection is-live';
        } else {
            elements.connection.textContent = 'Только просмотр: сервер сохранения не найден';
            elements.connection.className = 'admin-connection is-readonly';
        }

        updateToolbarChrome();
    }

    function updateAuthUi() {
        const authOpen = state.apiAvailable && state.authRequired && !state.authenticated;

        if (elements.auth) {
            elements.auth.hidden = !authOpen;
        }

        if (elements.logoutBtn) {
            elements.logoutBtn.hidden = !(state.apiAvailable && state.authRequired && state.authenticated);
        }

        if (elements.shell) {
            elements.shell.classList.toggle('is-auth-locked', authOpen);
        }

        document.body.classList.toggle('admin-auth-open', authOpen);
    }

    function renderNav() {
        elements.nav.innerHTML = '';
        const navQuery = state.navQuery.trim().toLowerCase();
        if (elements.navSearch) {
            elements.navSearch.value = state.navQuery;
        }

        const buildGroupHead = (label, count) => {
            const groupHead = document.createElement('div');
            groupHead.className = 'admin-nav__group-head';

            const groupTitle = document.createElement('h2');
            groupTitle.className = 'admin-nav__group-title';
            groupTitle.textContent = label;

            const groupCount = document.createElement('span');
            groupCount.className = 'admin-nav__group-count';
            groupCount.textContent = `${count} ${count === 1 ? 'раздел' : count < 5 ? 'раздела' : 'разделов'}`;

            groupHead.append(groupTitle, groupCount);
            return groupHead;
        };

        const dashboardConfig = contentConfigs.dashboard;
        const dashboardMeta = sectionMeta.dashboard || {};
        const dashboardHaystack = [
            dashboardConfig.label,
            dashboardConfig.description,
            dashboardMeta.navHint,
            dashboardMeta.summary
        ].filter(Boolean).join(' ').toLowerCase();

        if (!navQuery || dashboardHaystack.includes(navQuery)) {
            const dashboardButton = document.createElement('button');
            dashboardButton.type = 'button';
            dashboardButton.className = `admin-nav__button${state.activeKey === 'dashboard' ? ' is-active' : ''}`;
            dashboardButton.innerHTML = `
                <span class="admin-nav__button-icon"><i class="fas ${dashboardMeta.icon || 'fa-compass-drafting'}" aria-hidden="true"></i></span>
                <span class="admin-nav__button-copy">
                    <strong>${dashboardConfig.label}</strong>
                    <span>${dashboardMeta.navHint || dashboardConfig.description}</span>
                    <span class="admin-nav__button-status is-idle">Стартовый экран</span>
                </span>
                <span class="admin-nav__button-arrow" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
            `;

            dashboardButton.addEventListener('click', () => {
                switchAdminSection('dashboard');
            });

            const dashboardWrapper = document.createElement('section');
            dashboardWrapper.className = `admin-nav__group${state.activeKey === 'dashboard' ? ' is-active-group' : ''}`;
            dashboardWrapper.appendChild(buildGroupHead('Старт', 1));

            const groupNote = document.createElement('p');
            groupNote.className = 'admin-nav__group-note';
            groupNote.textContent = 'Домашний экран с готовыми действиями без поиска по разделам.';
            dashboardWrapper.appendChild(groupNote);

            dashboardWrapper.appendChild(dashboardButton);
            elements.nav.appendChild(dashboardWrapper);
        }

        const renderGroup = (group) => {
            if (!Array.isArray(group.items) || !group.items.length) {
                return;
            }

            const visibleItems = group.items.filter((key) => {
                const config = contentConfigs[key];
                if (!config) return false;

                const meta = sectionMeta[key] || {};
                const haystack = [
                    config.label,
                    config.description,
                    meta.navHint,
                    meta.summary
                ].filter(Boolean).join(' ').toLowerCase();

                return !(navQuery && !haystack.includes(navQuery));
            });

            if (!visibleItems.length) {
                return;
            }

            const groupWrapper = document.createElement('section');
            groupWrapper.className = `admin-nav__group${visibleItems.includes(state.activeKey) ? ' is-active-group' : ''}`;
            groupWrapper.appendChild(buildGroupHead(group.label, visibleItems.length));

            if (group.note) {
                const groupNote = document.createElement('p');
                groupNote.className = 'admin-nav__group-note';
                groupNote.textContent = group.note;
                groupWrapper.appendChild(groupNote);
            }

            visibleItems.forEach((key) => {
                const config = contentConfigs[key];
                if (!config) return;

                const meta = sectionMeta[key] || {};
                const status = getSectionStatus(key);
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `admin-nav__button${state.activeKey === key ? ' is-active' : ''}`;

                button.innerHTML = `
                    <span class="admin-nav__button-icon"><i class="fas ${meta.icon || 'fa-rectangle-list'}" aria-hidden="true"></i></span>
                    <span class="admin-nav__button-copy">
                        <strong>${config.label}</strong>
                        <span>${meta.navHint || config.description}</span>
                        <span class="admin-nav__button-status is-${status.tone}">${status.label}</span>
                    </span>
                    <span class="admin-nav__button-arrow" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
                `;

                button.addEventListener('click', () => {
                    switchAdminSection(key);
                });

                groupWrapper.appendChild(button);
            });

            elements.nav.appendChild(groupWrapper);
        };

        navGroups.forEach((group) => {
            renderGroup(group);
        });

        if (!elements.nav.children.length) {
            elements.nav.innerHTML = '<div class="admin-empty">По этому запросу разделы не найдены. Попробуй другое слово.</div>';
        }

        renderSidebarFooter();
    }

    function renderField(field, parentObject, contentKey) {
        const value = parentObject[field.key] ?? createDefaultValue(field);
        parentObject[field.key] = value;

        if (field.type === 'group') {
            if (shouldUseCompactContactEditor(contentKey, field)) {
                return renderCompactContactEditor(field, value, contentKey);
            }

            if (shouldUseCompactGalleryEditor(contentKey, field)) {
                return renderCompactGalleryEditor(field, parentObject, contentKey);
            }

            if (shouldUseCompactLocationEditor(contentKey, field)) {
                return renderCompactLocationEditor(field, value, contentKey);
            }

            if (shouldUseCompactPricesEditor(contentKey, field)) {
                return renderCompactPricesEditor(field, value, contentKey);
            }

            if (shouldUseCompactPaymentDocumentsEditor(contentKey, field)) {
                return renderCompactPaymentDocumentsEditor(field, value, contentKey);
            }

            if (shouldUseCompactServicePageEditor(contentKey, field)) {
                return renderCompactServicePageEditor(field, value, contentKey);
            }

            if (shouldUseCompactAutomationPanelEditor(contentKey, field)) {
                return renderCompactAutomationPanelEditor(field, value, contentKey);
            }

            if (shouldUseCompactGarageProtectionPanelEditor(contentKey, field)) {
                return renderCompactGarageProtectionPanelEditor(field, value, contentKey);
            }

            if (shouldUseCompactHomeHeroEditor(contentKey, field)) {
                return renderCompactHomeHeroEditor(field, value, contentKey);
            }

            if (shouldUseCompactRequestEditor(contentKey, field)) {
                return renderCompactRequestEditor(field, value, contentKey);
            }

            if (shouldUseCompactCatalogCtaEditor(contentKey, field)) {
                return renderCompactCatalogCtaEditor(field, value, contentKey);
            }

            const details = document.createElement('details');
            details.className = 'admin-section';
            details.open = !field.startCollapsed;
            details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;
            details.dataset.fieldKey = field.key;
            details.dataset.fieldLabel = getDisplayLabel(field);

            const groupEditorScreens = getGroupEditorScreens(contentKey, field);
            const activeGroupScreen = groupEditorScreens.length ? getActiveGroupEditorScreen(contentKey, field) : null;
            const groupFields = activeGroupScreen
                ? field.fields.filter((childField) => activeGroupScreen.fieldKeys.includes(childField.key))
                : field.fields;

            const { primaryFields, secondaryFields, advancedFields } = splitFieldsForMode(groupFields);
            const visibleFieldCount = primaryFields.length + secondaryFields.length + advancedFields.length;

            const summary = document.createElement('summary');
            const summaryNode = createSectionSummary(field.label || field.key, `${visibleFieldCount} полей в блоке`);
            if (state.simpleMode && (secondaryFields.length || advancedFields.length)) {
                const badge = document.createElement('span');
                badge.className = 'admin-section__summary-badge is-advanced';
                badge.textContent = state.editorRole === 'customer'
                    ? `Скрыто полей: ${secondaryFields.length + advancedFields.length}`
                    : `Скрыто технических полей: ${advancedFields.length}`;
                summaryNode.querySelector('.admin-section__summary-copy')?.appendChild(badge);
            }
            summary.appendChild(summaryNode);
            details.appendChild(summary);

            if (activeGroupScreen) {
                const groupScreenCard = document.createElement('div');
                groupScreenCard.className = 'admin-group-screens';
                groupScreenCard.innerHTML = `
                    <div class="admin-group-screens__head">
                        <div>
                            <p class="admin-toolbar__eyebrow">Редактирование карточки каталога</p>
                            <h3>${getDisplayLabel(field)}</h3>
                            <p>${activeGroupScreen.text}</p>
                        </div>
                        <span class="admin-status-badge is-idle">${groupEditorScreens.length} экранов</span>
                    </div>
                    <div class="admin-group-screens__list">
                        ${groupEditorScreens.map((screen) => `
                            <button class="admin-group-screens__button ${screen.key === activeGroupScreen.key ? 'is-active' : ''}" type="button" data-group-screen="${screen.key}">
                                <span class="admin-group-screens__button-icon"><i class="fas ${screen.icon}" aria-hidden="true"></i></span>
                                <span class="admin-group-screens__button-copy">
                                    <strong>${screen.title}</strong>
                                    <span>${screen.text}</span>
                                </span>
                            </button>
                        `).join('')}
                    </div>
                `;
                details.appendChild(groupScreenCard);

                groupScreenCard.querySelectorAll('[data-group-screen]').forEach((button) => {
                    button.addEventListener('click', () => {
                        setActiveGroupEditorScreen(contentKey, field, button.getAttribute('data-group-screen') || '', { silent: true });
                    });
                });
            }

            const grid = document.createElement('div');
            grid.className = 'admin-grid admin-grid--two';
            details.appendChild(grid);

            renderFieldsIntoContainer(grid, primaryFields, value, contentKey);

            if (!primaryFields.length) {
                const emptyState = document.createElement('div');
                emptyState.className = 'admin-empty';
                emptyState.textContent = 'В этом блоке остались только технические параметры. Открой “Расширенные настройки”, если нужно их изменить.';
                details.appendChild(emptyState);
            }

            const secondaryDetails = createSecondaryDetails(secondaryFields, value, contentKey);
            if (secondaryDetails) {
                details.appendChild(secondaryDetails);
            }

            const advancedDetails = createAdvancedDetails(advancedFields, value, contentKey);
            if (advancedDetails) {
                details.appendChild(advancedDetails);
            }

            return details;
        }

        if (field.type === 'array') {
            if (shouldUseCompactGalleryEditor(contentKey, field)) {
                return renderCompactGalleryEditor(field, parentObject, contentKey);
            }
            if (shouldUseCompactCatalogGroupsEditor(contentKey, field)) {
                return renderCompactCatalogGroupsEditor(field, parentObject, contentKey);
            }
            return renderArrayField(field, parentObject, contentKey);
        }

        if (shouldHideStandaloneCompactField(contentKey, field)) {
            if (!state.bypassCompactFieldHide) {
                return null;
            }

            state.bypassCompactFieldHide = false;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'admin-field';
        wrapper.dataset.fieldKey = field.key;
        wrapper.dataset.fieldLabel = getDisplayLabel(field);
        wrapper.dataset.contentKey = contentKey;
        if (field.key === 'src') {
            wrapper.classList.add('admin-field--media');
        }

        const label = document.createElement('label');
        label.textContent = getDisplayLabel(field);
        wrapper.appendChild(label);

        const hint = getFieldHint(field);
        if (hint) {
            const hintNode = document.createElement('div');
            hintNode.className = 'admin-field__hint';
            hintNode.textContent = hint;
            wrapper.appendChild(hintNode);
        }

        const input = field.type === 'textarea'
            ? document.createElement('textarea')
            : document.createElement('input');

        input.className = field.type === 'textarea' ? 'admin-textarea' : 'admin-input';
        if (field.type !== 'textarea') {
            input.type = field.type === 'number' ? 'number' : 'text';
        }
        const placeholder = getFieldPlaceholder(field);
        if (placeholder && field.type !== 'number') {
            input.placeholder = placeholder;
        }

        let previewNode = null;
        const applyFieldValue = (nextValue) => {
            const normalizedValue = field.type === 'number' ? Number(nextValue || 0) : nextValue;
            input.value = normalizedValue ?? '';
            parentObject[field.key] = normalizedValue;
            state.dirty[contentKey] = true;
            state.lastFocusedField = {
                key: field.key,
                label: getDisplayLabel(field),
                value: normalizedValue
            };
            wrapper.classList.add('is-dirty');
            wrapper.closest('.admin-section')?.classList.add('is-dirty');
            renderNav();
            updateToolbarState();
            renderStatusCard(contentKey);
            renderMiniPreview(contentKey);
            syncPreview(normalizedValue);

            if (field.type === 'textarea') {
                autosizeTextarea(input);
            }
        };

        function syncPreview(nextValue) {
            if (!wrapper) return;

            if (previewNode) {
                previewNode.remove();
                previewNode = null;
            }

            if (field.key === 'src') {
                previewNode = createImagePreview(nextValue) || createMediaPlaceholder(getDisplayLabel(field));
            } else if (typeof nextValue === 'string' && isImageLikeValue(nextValue)) {
                previewNode = createImagePreview(nextValue);
            }

            if (previewNode) {
                wrapper.appendChild(previewNode);
            }
        }

        input.value = field.type === 'number' ? Number(value || 0) : value || '';
        input.dataset.fieldKey = field.key;
        input.addEventListener('focus', () => {
            state.lastFocusedField = {
                key: field.key,
                label: getDisplayLabel(field),
                value: input.value
            };
            renderMiniPreview(contentKey);
        });
        input.addEventListener('input', () => {
            const nextValue = field.type === 'number' ? Number(input.value || 0) : input.value;
            applyFieldValue(nextValue);
        });
        wrapper.appendChild(input);
        syncPreview(input.value);

        if (field.type === 'textarea') {
            autosizeTextarea(input);
        }

        if (field.key === 'src') {
            const mediaNote = document.createElement('div');
            mediaNote.className = 'admin-field__media-note';
            mediaNote.innerHTML = '<i class="fas fa-images" aria-hidden="true"></i><span>Фото удобнее менять через библиотеку: так не нужно вручную вводить путь.</span>';
            wrapper.appendChild(mediaNote);

            const actions = document.createElement('div');
            actions.className = 'admin-field__media-actions';
            actions.innerHTML = `
                <button class="admin-btn admin-btn--primary" type="button">
                    <i class="fas fa-images" aria-hidden="true"></i> Выбрать фото
                </button>
                <button class="admin-btn admin-btn--ghost" type="button">
                    <i class="fas fa-eraser" aria-hidden="true"></i> Очистить поле
                </button>
            `;

            const [libraryButton, clearButton] = actions.querySelectorAll('button');
            libraryButton.addEventListener('click', () => {
                openMediaPicker({
                    title: getDisplayLabel(field),
                    directory: getMediaDefaultDirectory(contentKey),
                    currentValue: input.value,
                    apply: (selectedValue) => applyFieldValue(selectedValue)
                });
            });
            clearButton.addEventListener('click', () => applyFieldValue(''));

            wrapper.appendChild(actions);
        }

        return wrapper;
    }

    function renderArrayField(field, parentObject, contentKey) {
        const array = Array.isArray(parentObject[field.key]) ? parentObject[field.key] : [];
        parentObject[field.key] = array;
        const isMediaArray = isMediaArrayField(field);

        const section = document.createElement('details');
        section.className = 'admin-section';
        if (isMediaArray) {
            section.classList.add('admin-section--media-array');
        }
        section.open = !field.startCollapsed;
        section.dataset.fieldKey = field.key;
        section.dataset.fieldLabel = getDisplayLabel(field);

        const summary = document.createElement('summary');
        const arrayMeta = field.allowReorder === false
            ? `${array.length} элементов`
            : `${array.length} элементов · можно менять порядок`;
        summary.appendChild(createSectionSummary(field.label || field.key, arrayMeta, 'fa-list'));
        section.appendChild(summary);

        const body = document.createElement('div');
        body.className = 'admin-array';
        if (isMediaArray) {
            body.classList.add('admin-array--media');
        }
        section.appendChild(body);

        const toolbar = document.createElement('div');
        toolbar.className = 'admin-array__toolbar';
        toolbar.innerHTML = `
            <div class="admin-array__title">${field.label || field.key}</div>
            ${field.allowAddRemove === false ? '' : `<button type="button" class="admin-btn ${isMediaArray ? 'admin-btn--primary' : ''}">${isMediaArray ? 'Добавить фото' : `Добавить ${String(field.itemLabel || 'элемент').toLowerCase()}`}</button>`}
        `;
        body.appendChild(toolbar);

        const helperText = getArrayHelperText(field);
        if (helperText) {
            const helperNode = document.createElement('p');
            helperNode.className = 'admin-array__hint';
            helperNode.textContent = helperText;
            body.appendChild(helperNode);
        }

        const addButton = toolbar.querySelector('button');
        const list = document.createElement('div');
        list.className = 'admin-array__list';
        if (isMediaArray) {
            list.classList.add('admin-array__list--media');
        }
        body.appendChild(list);

        function markDirty() {
            state.dirty[contentKey] = true;
            section.classList.add('is-dirty');
            renderNav();
            updateToolbarState();
            renderStatusCard(contentKey);
            renderMiniPreview(contentKey);
        }

        function rerenderList() {
            list.innerHTML = '';

            array.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'admin-array-card';
                if (isMediaArray) {
                    card.classList.add('admin-array-card--media');
                }
                card.dataset.index = String(index);

                const header = document.createElement('div');
                header.className = 'admin-array-card__header';
                header.innerHTML = `
                    <div class="admin-array-card__title">${getArrayItemTitle(field, item, index)}</div>
                    <div class="admin-array-card__actions">
                        <button type="button" class="admin-icon-btn" aria-label="Поднять вверх"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
                        <button type="button" class="admin-icon-btn" aria-label="Опустить вниз"><i class="fas fa-arrow-down" aria-hidden="true"></i></button>
                        <button type="button" class="admin-icon-btn" aria-label="Дублировать"><i class="fas fa-copy" aria-hidden="true"></i></button>
                        <button type="button" class="admin-icon-btn admin-icon-btn--danger" aria-label="Удалить"><i class="fas fa-trash" aria-hidden="true"></i></button>
                    </div>
                `;
                card.appendChild(header);

                const [upButton, downButton, duplicateButton, removeButton] = header.querySelectorAll('button');
                if (field.allowReorder === false) {
                    upButton.hidden = true;
                    downButton.hidden = true;
                } else {
                    card.draggable = true;
                    upButton.disabled = index === 0;
                    downButton.disabled = index === array.length - 1;

                    upButton.addEventListener('click', () => {
                        if (index === 0) return;
                        [array[index - 1], array[index]] = [array[index], array[index - 1]];
                        markDirty();
                        rerenderList();
                    });

                    downButton.addEventListener('click', () => {
                        if (index >= array.length - 1) return;
                        [array[index], array[index + 1]] = [array[index + 1], array[index]];
                        markDirty();
                        rerenderList();
                    });
                }

                if (field.allowAddRemove === false) {
                    duplicateButton.hidden = true;
                    removeButton.hidden = true;
                } else {
                    duplicateButton.addEventListener('click', () => {
                        const clonedItem = field.itemType === 'text' ? (item || '') : deepClone(item);
                        array.splice(index + 1, 0, clonedItem);
                        markDirty();
                        rerenderList();
                    });

                    removeButton.addEventListener('click', () => {
                        array.splice(index, 1);
                        markDirty();
                        rerenderList();
                    });
                }

                if (field.itemType === 'text') {
                    const input = document.createElement('textarea');
                    input.className = 'admin-textarea';
                    input.value = item || '';
                    input.addEventListener('input', () => {
                        array[index] = input.value;
                        markDirty();
                    });
                    card.appendChild(input);
                } else {
                    card.classList.add('admin-array-card--collapsible');
                    header.remove();

                    const itemObject = item && typeof item === 'object' ? item : {};
                    array[index] = itemObject;

                    const { primaryFields, secondaryFields, advancedFields } = splitFieldsForMode(field.fields);
                    const itemTitle = getArrayItemTitle(field, itemObject, index);
                    const itemMeta = getArrayItemMeta(field, itemObject);
                    const imageField = isMediaArray
                        ? field.fields.find((childField) => childField.key === 'src')
                        : null;
                    const imageValue = imageField && typeof itemObject.src === 'string'
                        ? itemObject.src.trim()
                        : '';
                    const hasImagePreview = isImageLikeValue(imageValue);

                    const details = document.createElement('details');
                    details.className = 'admin-array-card__details';
                    if (hasImagePreview) {
                        details.classList.add('admin-array-card__details--media');
                    }
                    details.open = isMediaArray ? false : (!state.simpleMode && index === 0);
                    card.appendChild(details);

                    const summary = document.createElement('summary');
                    const thumbMarkup = hasImagePreview
                        ? `<div class="admin-array-card__thumb"><img src="${getPreviewUrl(imageValue)}" alt="Миниатюра" loading="lazy"></div>`
                        : '';
                    summary.innerHTML = `
                        <div class="admin-array-card__header">
                            <div class="admin-array-card__summary-main">
                                ${thumbMarkup}
                                <div class="admin-array-card__summary-copy">
                                    <div class="admin-array-card__title">${itemTitle}</div>
                                    ${itemMeta ? `<div class="admin-array-card__meta">${itemMeta}</div>` : ''}
                                </div>
                            </div>
                            <div class="admin-array-card__actions">
                                <button type="button" class="admin-icon-btn" aria-label="Поднять вверх"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
                                <button type="button" class="admin-icon-btn" aria-label="Опустить вниз"><i class="fas fa-arrow-down" aria-hidden="true"></i></button>
                                <button type="button" class="admin-icon-btn" aria-label="Дублировать"><i class="fas fa-copy" aria-hidden="true"></i></button>
                                <button type="button" class="admin-icon-btn admin-icon-btn--danger" aria-label="Удалить"><i class="fas fa-trash" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    `;
                    details.appendChild(summary);

                    const [cardUpButton, cardDownButton, cardDuplicateButton, cardRemoveButton] = summary.querySelectorAll('button');
                    [cardUpButton, cardDownButton, cardDuplicateButton, cardRemoveButton].forEach((button) => {
                        button.addEventListener('click', (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        });
                    });

                    if (field.allowReorder === false) {
                        cardUpButton.hidden = true;
                        cardDownButton.hidden = true;
                    } else {
                        card.draggable = true;
                        cardUpButton.disabled = index === 0;
                        cardDownButton.disabled = index === array.length - 1;

                        cardUpButton.addEventListener('click', () => {
                            if (index === 0) return;
                            [array[index - 1], array[index]] = [array[index], array[index - 1]];
                            markDirty();
                            rerenderList();
                        });

                        cardDownButton.addEventListener('click', () => {
                            if (index >= array.length - 1) return;
                            [array[index], array[index + 1]] = [array[index + 1], array[index]];
                            markDirty();
                            rerenderList();
                        });
                    }

                    if (field.allowAddRemove === false) {
                        cardDuplicateButton.hidden = true;
                        cardRemoveButton.hidden = true;
                    } else {
                        cardDuplicateButton.addEventListener('click', () => {
                            array.splice(index + 1, 0, deepClone(itemObject));
                            markDirty();
                            rerenderList();
                        });

                        cardRemoveButton.addEventListener('click', () => {
                            array.splice(index, 1);
                            markDirty();
                            rerenderList();
                        });
                    }

                    const body = document.createElement('div');
                    body.className = 'admin-array-card__body';
                    details.appendChild(body);

                    if (imageField) {
                        const mediaQuickBar = document.createElement('div');
                        mediaQuickBar.className = 'admin-array-card__quick';

                        const pickButton = document.createElement('button');
                        pickButton.type = 'button';
                        pickButton.className = 'admin-btn admin-btn--primary';
                        pickButton.innerHTML = '<i class="fas fa-images" aria-hidden="true"></i> Выбрать фото';
                        pickButton.addEventListener('click', () => {
                            openMediaPicker({
                                title: itemTitle ? `Выбрать фото для «${itemTitle}»` : 'Выбрать фото',
                                directory: getMediaDefaultDirectory(contentKey),
                                currentValue: itemObject.src,
                                apply: (selectedValue) => {
                                    itemObject.src = selectedValue;
                                    markDirty();
                                    rerenderList();
                                }
                            });
                        });
                        mediaQuickBar.appendChild(pickButton);

                        if (hasImagePreview) {
                            const openButton = document.createElement('a');
                            openButton.className = 'admin-btn admin-btn--ghost';
                            openButton.href = getPreviewUrl(imageValue);
                            openButton.target = '_blank';
                            openButton.rel = 'noopener noreferrer';
                            openButton.innerHTML = '<i class="fas fa-up-right-from-square" aria-hidden="true"></i> Открыть';
                            mediaQuickBar.appendChild(openButton);
                        }

                        if (field.allowReorder !== false && index > 0) {
                            const pinButton = document.createElement('button');
                            pinButton.type = 'button';
                            pinButton.className = 'admin-btn admin-btn--ghost';
                            pinButton.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i> Сделать первым';
                            pinButton.addEventListener('click', () => {
                                const [movedItem] = array.splice(index, 1);
                                array.unshift(movedItem);
                                markDirty();
                                rerenderList();
                            });
                            mediaQuickBar.appendChild(pinButton);
                        }

                        if (imageValue) {
                            const clearButton = document.createElement('button');
                            clearButton.type = 'button';
                            clearButton.className = 'admin-btn admin-btn--ghost';
                            clearButton.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i> Убрать фото';
                            clearButton.addEventListener('click', () => {
                                itemObject.src = '';
                                markDirty();
                                rerenderList();
                            });
                            mediaQuickBar.appendChild(clearButton);
                        }

                        body.appendChild(mediaQuickBar);
                    }

                    const grid = document.createElement('div');
                    grid.className = 'admin-grid admin-grid--two';
                    renderFieldsIntoContainer(grid, primaryFields, itemObject, contentKey);
                    body.appendChild(grid);

                    if (!primaryFields.length) {
                        const emptyState = document.createElement('div');
                        emptyState.className = 'admin-empty';
                        emptyState.textContent = 'У этой карточки сейчас видны только основные данные. Технические поля спрятаны ниже.';
                        body.appendChild(emptyState);
                    }

                    const secondaryDetails = createSecondaryDetails(
                        secondaryFields,
                        itemObject,
                        contentKey,
                        'Здесь находятся ссылки, формы, карты и другие рабочие поля этой карточки. Обычно они нужны менеджеру, а не заказчику.'
                    );

                    if (secondaryDetails) {
                        body.appendChild(secondaryDetails);
                    }

                    const advancedDetails = createAdvancedDetails(
                        advancedFields,
                        itemObject,
                        contentKey,
                        'Здесь скрыты служебные ссылки, иконки, размеры изображений и другие параметры именно этой карточки.'
                    );

                    if (advancedDetails) {
                        body.appendChild(advancedDetails);
                    }
                }

                list.appendChild(card);
            });

            if (field.allowReorder !== false) {
                let dragIndex = null;

                Array.from(list.children).forEach((cardNode, index) => {
                    if (!(cardNode instanceof HTMLElement)) return;

                    cardNode.addEventListener('dragstart', () => {
                        dragIndex = index;
                        cardNode.classList.add('is-dragging');
                    });

                    cardNode.addEventListener('dragend', () => {
                        dragIndex = null;
                        cardNode.classList.remove('is-dragging');
                    });

                    cardNode.addEventListener('dragover', (event) => {
                        event.preventDefault();
                        cardNode.classList.add('is-drag-target');
                    });

                    cardNode.addEventListener('dragleave', () => {
                        cardNode.classList.remove('is-drag-target');
                    });

                    cardNode.addEventListener('drop', (event) => {
                        event.preventDefault();
                        cardNode.classList.remove('is-drag-target');
                        if (dragIndex == null || dragIndex === index) return;

                        const [movedItem] = array.splice(dragIndex, 1);
                        array.splice(index, 0, movedItem);
                        markDirty();
                        rerenderList();
                    });
                });
            }
        }

        if (addButton) {
            addButton.addEventListener('click', () => {
                if (field.itemType === 'text') {
                    array.push('');
                    markDirty();
                    rerenderList();
                    return;
                }

                if (isMediaArray) {
                    openMediaPicker({
                        title: field.label ? `Добавить фото в «${field.label}»` : 'Добавить фото',
                        directory: getMediaDefaultDirectory(contentKey),
                        apply: (selectedValue) => {
                            const itemObject = {};
                            field.fields.forEach((childField) => {
                                itemObject[childField.key] = createDefaultValue(childField);
                            });
                            itemObject.src = selectedValue;
                            array.push(itemObject);
                            markDirty();
                            rerenderList();
                        }
                    });
                    return;
                } else {
                    const itemObject = {};
                    field.fields.forEach((childField) => {
                        itemObject[childField.key] = createDefaultValue(childField);
                    });
                    array.push(itemObject);
                }

                markDirty();
                rerenderList();
            });
        }

        rerenderList();
        return section;
    }

    function renderActiveSection() {
        const key = state.activeKey;
        const config = contentConfigs[key];
        const meta = sectionMeta[key] || {};
        if (config.virtual) {
            elements.title.textContent = config.label;
            elements.description.textContent = meta.navHint || config.description;
            elements.form.innerHTML = '';
            state.lastFocusedField = null;
            renderCommandCenter(key);
            renderDashboardHome();
            updateToolbarState();
            updateDirtyBar();
            return;
        }

        const activeSimpleScreen = getActiveSimpleScreen(key);
        const useSectionTabs = shouldUseSectionTabs(key) && !activeSimpleScreen;
        const activeTabKey = useSectionTabs ? getActiveSectionTab(key) : '';
        const visibleFields = activeSimpleScreen
            ? config.schema.fields.filter((field) => activeSimpleScreen.fieldKeys.includes(field.key))
            : useSectionTabs
                ? config.schema.fields.filter((field) => field.key === activeTabKey)
                : config.schema.fields;

        if (state.activeGuide && state.activeGuide.sectionKey !== key) {
            closeGuideModal();
        } else if (state.activeGuide && state.activeGuide.sectionKey === key && !elements.guideModal?.hidden) {
            renderGuideModal();
        }

        elements.title.textContent = config.label;
        elements.description.textContent = meta.navHint || config.description;
        elements.form.innerHTML = '';
        state.lastFocusedField = null;
        renderCommandCenter(key);
        renderScreenCard(key);
        renderSectionTabs(key);

        if (elements.commandCenter) {
            const compactContext = useSectionTabs || Boolean(activeSimpleScreen);
            elements.commandCenter.hidden = false;
            elements.commandCenter.classList.toggle('is-compact', compactContext);
        }

        if (elements.overview) {
            elements.overview.hidden = Boolean(activeSimpleScreen || useSectionTabs);
        }
        if (elements.jumpbar) {
            elements.jumpbar.hidden = Boolean(activeSimpleScreen || useSectionTabs);
        }
        if (elements.searchCard) {
            elements.searchCard.hidden = Boolean(activeSimpleScreen || useSectionTabs);
        }
        if (elements.modeNote) {
            elements.modeNote.hidden = Boolean(activeSimpleScreen);
        }
        if (elements.pageLinks) {
            elements.pageLinks.hidden = useSectionTabs || Boolean(activeSimpleScreen);
        }

        if (!activeSimpleScreen && !useSectionTabs) {
            renderOverview(key);
            renderJumpbar(key);
        }

        updateAssistPanelUi({ open: state.editorRole === 'advanced' && !activeSimpleScreen });

        visibleFields.forEach((field, index) => {
            const fieldNode = renderField(field, state.data[key], key);

            if (
                (state.simpleMode || activeSimpleScreen)
                && fieldNode instanceof HTMLDetailsElement
                && (!field.startCollapsed || activeSimpleScreen)
            ) {
                fieldNode.open = activeSimpleScreen ? true : index === 0;
            }

            elements.form.appendChild(fieldNode);
        });

        applySectionFilter();
        renderStatusCard(key);
        renderQuickActions(key);
        renderMiniPreview(key);
        if (state.previewPanelOpen) {
            refreshLivePreview();
        }
        updateToolbarState();
        updateDirtyBar();
    }

    function updateToolbarState() {
        const activeConfig = contentConfigs[state.activeKey];
        let saveButtonHtml = '<i class="fas fa-floppy-disk" aria-hidden="true"></i> Сохранить изменения';

        if (activeConfig?.virtual) {
            elements.saveBtn.disabled = true;
            elements.publishBtn.disabled = true;
            elements.downloadBtn.disabled = true;
            elements.reloadBtn.disabled = false;
            elements.historyBtn.disabled = true;
            saveButtonHtml = '<i class="fas fa-compass-drafting" aria-hidden="true"></i> Выберите действие';
            elements.saveBtn.innerHTML = saveButtonHtml;
            updateDirtyBar();
            updateToolbarChrome();
            return;
        }

        const hasChanges = Boolean(state.dirty[state.activeKey]);
        const canSave = state.apiAvailable
            && hasChanges
            && (!state.authRequired || state.authenticated);
        const canPublish = state.apiAvailable
            && !hasChanges
            && (!state.authRequired || state.authenticated)
            && Boolean(getSectionAdminState(state.activeKey)?.lastSavedAt);

        elements.saveBtn.disabled = !canSave;
        elements.downloadBtn.disabled = false;
        elements.reloadBtn.disabled = false;
        elements.historyBtn.disabled = false;
        if (elements.publishBtn) {
            elements.publishBtn.disabled = !canPublish;
        }

        if (canSave) {
            saveButtonHtml = '<i class="fas fa-floppy-disk" aria-hidden="true"></i> Сохранить изменения';
            updateDirtyBar();
        } else if (!hasChanges) {
            saveButtonHtml = '<i class="fas fa-check" aria-hidden="true"></i> Сохранено';
            updateDirtyBar();
        } else if (!state.apiAvailable) {
            saveButtonHtml = '<i class="fas fa-server" aria-hidden="true"></i> Нет сервера сохранения';
            updateDirtyBar();
        } else if (state.authRequired && !state.authenticated) {
            saveButtonHtml = '<i class="fas fa-lock" aria-hidden="true"></i> Нужен вход';
            updateDirtyBar();
        } else {
            updateDirtyBar();
        }

        elements.saveBtn.innerHTML = saveButtonHtml;
        updateToolbarChrome();
    }

    async function saveActiveSection() {
        const key = state.activeKey;
        const config = contentConfigs[key];
        if (config?.virtual) return;

        if (!state.apiAvailable) {
            showAlert('Сервер сохранения не запущен. Изменения записать нельзя, но можно сделать резервную копию.', 'info');
            return;
        }

        const validationWarnings = collectValidationWarnings(state.data[key], config.label);
        if (validationWarnings.length) {
            const previewWarnings = validationWarnings.slice(0, 6).map((item) => `• ${item}`).join('\n');
            const proceed = window.confirm(
                `Перед сохранением найдены замечания:\n\n${previewWarnings}${validationWarnings.length > 6 ? `\n...и ещё ${validationWarnings.length - 6}` : ''}\n\nСохранить раздел всё равно?`
            );

            if (!proceed) {
                showAlert('Сохранение отменено. Сначала проверь замечания по контенту.', 'info');
                return;
            }
        }

        try {
            const response = await fetch(`/api/content/${config.fileName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Section-Key': key,
                    'X-Admin-Section-Label': config.label,
                    'X-Admin-Actor': state.username || 'local'
                },
                body: JSON.stringify(state.data[key], null, 2)
            });

            const payload = await response.json();

            if (response.status === 401) {
                state.authRequired = true;
                state.authenticated = false;
                state.username = '';
                updateConnectionState();
                updateAuthUi();
                updateToolbarState();
                throw new Error('Нужен вход в админку, чтобы сохранять изменения.');
            }

            if (!response.ok) {
                throw new Error(payload.error || `Не удалось сохранить раздел «${config.label}».`);
            }

            if (payload.state) {
                state.adminState = payload.state;
            }
            pushSectionHistory(config.fileName, state.data[key]);
            state.dirty[key] = false;
            setActivePreviewCard('status');
            renderNav();
            renderStatusCard(key);
            renderMiniPreview(key);
            renderHistoryModal();
            refreshLivePreview();
            updateToolbarState();
            const previewLink = getPrimaryPreviewLink(key);
            showAlert(
                `Раздел «${config.label}» сохранён. Если всё выглядит правильно, можно отметить его как опубликованный.`,
                'success',
                {
                    actions: [
                        previewLink ? { label: 'Открыть страницу', href: previewLink.href, style: 'primary' } : null,
                        { label: 'Открыть историю', onClick: () => openHistoryModal() },
                        { label: 'Продолжить редактирование', onClick: () => clearAlert() }
                    ]
                }
            );
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    async function publishActiveSection() {
        const key = state.activeKey;
        const config = contentConfigs[key];
        if (config?.virtual) return;

        if (!state.apiAvailable) {
            showAlert('Сервер сохранения не найден. Отметить публикацию нельзя.', 'info');
            return;
        }

        if (state.dirty[key]) {
            showAlert('Сначала сохрани текущие правки, а потом отмечай раздел как опубликованный.', 'info');
            return;
        }

        try {
            const response = await fetch('/api/admin/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Actor': state.username || 'local'
                },
                body: JSON.stringify({
                    sectionKey: key,
                    fileName: config.fileName,
                    label: config.label
                })
            });
            const payload = await response.json();

            if (response.status === 401) {
                state.authRequired = true;
                state.authenticated = false;
                state.username = '';
                updateConnectionState();
                updateAuthUi();
                updateToolbarState();
                throw new Error('Нужен вход в админку, чтобы отметить публикацию.');
            }

            if (!response.ok || !payload.ok) {
                throw new Error(payload.error || 'Не удалось обновить статус публикации');
            }

            if (payload.state) {
                state.adminState = payload.state;
            }

            setActivePreviewCard('status');
            renderNav();
            renderStatusCard(key);
            renderHistoryModal();
            updateToolbarState();
            const previewLink = getPrimaryPreviewLink(key);
            showAlert(
                `Раздел «${config.label}» отмечен как опубликованный.`,
                'success',
                {
                    actions: [
                        previewLink ? { label: 'Открыть страницу', href: previewLink.href, style: 'primary' } : null,
                        { label: 'Открыть историю', onClick: () => openHistoryModal() },
                        { label: 'Продолжить редактирование', onClick: () => clearAlert() }
                    ]
                }
            );
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    function downloadActiveSection() {
        const key = state.activeKey;
        const config = contentConfigs[key];
        if (config?.virtual) return;
        const blob = new Blob([JSON.stringify(state.data[key], null, 2)], {
            type: 'application/json;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${config.fileName}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        showAlert(`Резервная копия раздела «${config.label}» скачана.`, 'success');
    }

    async function reloadActiveSection() {
        try {
            const key = state.activeKey;
            const config = contentConfigs[key];
            if (config?.virtual) {
                renderActiveSection();
                clearAlert();
                showAlert('Домашний экран обновлён.', 'success');
                return;
            }
            const data = await loadContent(key, { fresh: true });
            await loadAdminState();
            state.data[key] = deepClone(data);
            state.dirty[key] = false;
            setActivePreviewCard('status');
            clearAlert();
            renderNav();
            renderActiveSection();
            showAlert(`Раздел «${contentConfigs[key].label}» перечитан из файлов проекта.`, 'success');
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    async function resetActiveSection() {
        const key = state.activeKey;
        if (!state.dirty[key]) return;

        const confirmed = window.confirm(`Отменить все несохранённые изменения в разделе «${contentConfigs[key].label}»?`);
        if (!confirmed) return;

        await reloadActiveSection();
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        if (!state.apiAvailable || !elements.loginForm) return;

        const formData = new FormData(elements.loginForm);
        const username = String(formData.get('username') || '').trim();
        const password = String(formData.get('password') || '');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (!response.ok || !data.authenticated) {
                throw new Error(data.error || 'Не удалось выполнить вход');
            }

            state.authRequired = Boolean(data.authEnabled);
            state.authenticated = Boolean(data.authenticated);
            state.username = data.username || '';
            elements.loginForm.reset();
            updateConnectionState();
            updateAuthUi();
            updateToolbarState();
            showAlert('Вход выполнен. Теперь можно сохранять изменения.', 'success');
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    async function handleLogout() {
        if (!state.apiAvailable) return;

        try {
            await fetch('/api/auth/logout', {
                method: 'POST'
            });
        } catch (error) {
            // Keep local UI state consistent even if the request fails.
        }

        state.authenticated = false;
        state.username = '';
        updateConnectionState();
        updateAuthUi();
        updateToolbarState();
        showAlert('Вы вышли из админки.', 'info');
    }

    async function init() {
        state.apiAvailable = await checkApiAvailability();
        const authState = await checkAuthSession();
        const localAuthBypass = hasLocalAuthBypass();
        state.authRequired = localAuthBypass ? false : authState.authEnabled;
        state.authenticated = localAuthBypass ? true : (authState.authEnabled ? authState.authenticated : true);
        state.username = localAuthBypass ? '' : (authState.username || '');
        updateConnectionState();
        updateAuthUi();
        updateModeUi();

        if (localAuthBypass) {
            showAlert('Локальный режим без входа включен по параметру ?local=1.', 'info');
        }

        try {
            await loadAllContent();
            renderNav();
            renderActiveSection();
        } catch (error) {
            showAlert(`Не удалось загрузить контент: ${error.message}`, 'error');
        }

        elements.saveBtn.addEventListener('click', saveActiveSection);
        elements.previewToggleBtn?.addEventListener('click', () => {
            setPreviewPanelOpen(!state.previewPanelOpen, { silent: false });
        });
        elements.previewSwitcher?.querySelectorAll('[data-preview-card]').forEach((button) => {
            button.addEventListener('click', () => {
                setActivePreviewCard(button.getAttribute('data-preview-card') || 'actions');
            });
        });
        elements.publishBtn?.addEventListener('click', () => {
            closeToolbarMore();
            publishActiveSection();
        });
        elements.dirtySaveBtn?.addEventListener('click', saveActiveSection);
        elements.dirtyResetBtn?.addEventListener('click', resetActiveSection);
        elements.downloadBtn.addEventListener('click', () => {
            closeToolbarMore();
            downloadActiveSection();
        });
        elements.reloadBtn.addEventListener('click', () => {
            closeToolbarMore();
            reloadActiveSection();
        });
        elements.quickModeBtn?.addEventListener('click', () => {
            closeToolbarMore();
            setQuickMode(true);
        });
        elements.fullModeBtn?.addEventListener('click', () => {
            closeToolbarMore();
            setQuickMode(false);
        });
        elements.historyBtn?.addEventListener('click', () => {
            closeToolbarMore();
            openHistoryModal();
        });
        elements.collapseBtn?.addEventListener('click', () => {
            closeToolbarMore();
            setAllSectionStates(false);
        });
        elements.expandBtn?.addEventListener('click', () => {
            closeToolbarMore();
            setAllSectionStates(true);
        });
        elements.searchInput?.addEventListener('input', () => {
            state.searchQuery = elements.searchInput.value;
            applySectionFilter();
        });
        elements.navSearch?.addEventListener('input', () => {
            state.navQuery = elements.navSearch.value;
            renderNav();
        });
        elements.navSearchClearBtn?.addEventListener('click', () => {
            state.navQuery = '';
            if (elements.navSearch) {
                elements.navSearch.value = '';
                elements.navSearch.focus();
            }
            renderNav();
        });
        elements.searchClearBtn?.addEventListener('click', () => {
            state.searchQuery = '';
            if (elements.searchInput) {
                elements.searchInput.value = '';
                elements.searchInput.focus();
            }
            applySectionFilter();
        });
        elements.scrollTopBtn?.addEventListener('click', () => {
            elements.main?.scrollTo({ top: 0, behavior: 'smooth' });
        });
        elements.livePreviewRefreshBtn?.addEventListener('click', refreshLivePreview);
        elements.mediaSearch?.addEventListener('input', () => {
            state.mediaSearchQuery = elements.mediaSearch.value;
            renderMediaPicker();
        });
        elements.mediaCloseBtn?.addEventListener('click', closeMediaPicker);
        elements.mediaPicker?.addEventListener('click', (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.dataset.mediaClose === 'true') {
                closeMediaPicker();
            }
        });
        elements.mediaUploadBtn?.addEventListener('click', () => {
            elements.mediaUploadInput?.click();
        });
        elements.mediaUploadInput?.addEventListener('change', () => {
            const file = elements.mediaUploadInput?.files?.[0];
            if (file) {
                handleMediaUpload(file);
            }
            if (elements.mediaUploadInput) {
                elements.mediaUploadInput.value = '';
            }
        });
        elements.historyCloseBtn?.addEventListener('click', closeHistoryModal);
        elements.historyModal?.addEventListener('click', (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.dataset.historyClose === 'true') {
                closeHistoryModal();
            }
        });
        elements.guideCloseBtn?.addEventListener('click', () => closeGuideModal());
        elements.guideModal?.addEventListener('click', (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.dataset.guideClose === 'true') {
                closeGuideModal();
            }
        });
        elements.customerModeBtn?.addEventListener('click', () => {
            closeToolbarMore();
            setEditorMode('customer');
        });
        elements.managerModeBtn?.addEventListener('click', () => {
            closeToolbarMore();
            setEditorMode('manager');
        });
        elements.advancedModeBtn?.addEventListener('click', () => {
            closeToolbarMore();
            setEditorMode('advanced');
        });
        elements.loginForm?.addEventListener('submit', handleLoginSubmit);
        elements.logoutBtn?.addEventListener('click', () => {
            closeToolbarMore();
            handleLogout();
        });
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('keydown', handleGlobalKeydown);
        window.addEventListener('resize', updateStickyOffsets);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
