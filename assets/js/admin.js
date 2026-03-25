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
            label: 'FAQ',
            startCollapsed: true,
            fields: [
                { key: 'title', type: 'text', label: 'Заголовок FAQ' },
                { key: 'subtitle', type: 'textarea', label: 'Подзаголовок FAQ' },
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
                { key: 'cta', type: 'text', label: 'Текст CTA' }
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
                    label: 'Нижний CTA панели',
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
            description: 'Hero, основные направления, процесс, доверие и форма заявки.',
            fileName: 'home',
            schema: {
                fields: [
                    {
                        key: 'hero',
                        type: 'group',
                        label: 'Hero-блок',
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
                            { key: 'iframeSrc', type: 'text', label: 'Ссылка на iframe формы' }
                        ]
                    }
                ]
            }
        },
        catalog: {
            label: 'Каталог',
            description: 'Группы каталога, подписи разделов, бренды и нижний CTA страницы каталога.',
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
                        label: 'Нижний CTA',
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
            description: 'Полное содержимое внутренних карточек каталога: тексты, списки, FAQ, палитры и CTA.',
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
            description: 'Заголовки, навигация, карточки, FAQ и CTA для порошковой покраски и пескоструйной обработки.',
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
                                label: 'Нижний CTA',
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
                                label: 'FAQ',
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
                                label: 'Нижний CTA',
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
                                label: 'FAQ',
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
                                label: 'Hero',
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
                                label: 'Нижний CTA',
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
            description: 'Заголовок, фильтры, счетчик и CTA галереи.',
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
                        label: 'Кнопки CTA',
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
            description: 'Заголовок, факторы стоимости, калькулятор, гарантия и FAQ на странице цен.',
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
                        label: 'FAQ',
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
            description: 'Hero, карточки преимуществ, этапы и CTA страницы оплаты и документов.',
            fileName: 'payment-documents',
            schema: {
                fields: [
                    {
                        key: 'hero',
                        type: 'group',
                        label: 'Hero-блок',
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
                        label: 'CTA',
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
            description: 'Hero, контакты, форма связи, ориентиры и карта на странице контактов.',
            fileName: 'contacts',
            schema: {
                fields: [
                    {
                        key: 'hero',
                        type: 'group',
                        label: 'Hero-блок',
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
                            { key: 'iframeSrc', type: 'text', label: 'Ссылка на iframe формы' }
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
            key: 'foundation',
            label: 'Основа сайта',
            note: 'Шапка, контакты и главная страница. Это то, что клиент видит в первую очередь.',
            items: ['site', 'home']
        },
        {
            key: 'catalog',
            label: 'Каталог и выбор',
            note: 'Структура каталога, внутренние карточки, автоматика и галерея работ.',
            items: ['catalog', 'catalogPanels', 'automation', 'gallery']
        },
        {
            key: 'pages',
            label: 'Отдельные страницы',
            note: 'Покраска, пескоструй, цены, оплата и контакты.',
            items: ['servicePages', 'prices', 'paymentDocuments', 'contacts']
        }
    ];

    const sectionMeta = {
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
                'Главный экран и первый CTA.',
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
            navHint: 'Группы каталога, вступления разделов и нижний CTA.',
            summary: 'Раздел управляет верхней структурой каталога: группами слева, вводными текстами и нижним призывом к действию.',
            bullets: [
                'Названия групп “Ворота”, “Заборы”, “Гараж и защита”, “Автоматика”.',
                'Короткие описания и ссылки внутри каждой группы.',
                'Нижний CTA в конце страницы каталога.'
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
            navHint: 'Тексты, списки, палитры, FAQ и CTA внутри карточек каталога.',
            summary: 'Здесь лежит самое содержимое карточек каталога: описания, характеристики, FAQ, палитры, шаги выбора и CTA.',
            bullets: [
                'Тексты по воротам, заборам, каркасам и автоматике.',
                'Списки характеристик, преимуществ и блоков выбора.',
                'FAQ, палитры и нижние CTA у конкретных карточек.'
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
                'FAQ и нижние CTA обеих страниц.'
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
                'Hero и вводные блоки автоматики.',
                'Карточки комплектов и характеристики.',
                'Раздел комплектующих и страницы отдельных товаров.'
            ],
            tips: [
                'В автоматику лучше писать коротко и по делу: вес, размеры, что входит в комплект.',
                'Если меняешь CTA карточек, проверь, что ссылки ведут на нужные страницы.',
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
                'Кнопка “Показать ещё” и CTA.'
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
            summary: 'Здесь собраны тексты и карточки страницы “Цены”: факторы стоимости, калькулятор, гарантия и FAQ.',
            bullets: [
                'Вступление и заголовок страницы.',
                'Карточки факторов стоимости и блок калькулятора.',
                'Гарантия, FAQ и нижние кнопки.'
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
            navHint: 'Доверие, документы, этапы и CTA страницы оплаты.',
            summary: 'Раздел для страницы “Оплата и документы”: доверие, этапы работы и кнопки связи.',
            bullets: [
                'Hero и акцентные карточки.',
                'Преимущества и этапы работы.',
                'CTA и кнопки связи.'
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
                'Блок быстрой связи и iframe формы.',
                'Карта, ориентиры и бейджи внизу.'
            ],
            tips: [
                'Если меняешь карту, проверь, что iframe открывается без ошибок.',
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
        activeKey: 'site',
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
        livePreviewHref: '',
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
        description: document.getElementById('adminDescription'),
        alert: document.getElementById('adminAlert'),
        commandCenter: document.getElementById('adminCommandCenter'),
        connection: document.getElementById('adminConnection'),
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
        collapseBtn: document.getElementById('adminCollapseBtn'),
        expandBtn: document.getElementById('adminExpandBtn'),
        jumpbar: document.getElementById('adminJumpbar'),
        searchInput: document.getElementById('adminSectionSearch'),
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
        mediaSearch: document.getElementById('adminMediaSearch'),
        mediaDirectory: document.getElementById('adminMediaDirectory'),
        mediaUploadBtn: document.getElementById('adminMediaUploadBtn'),
        mediaUploadInput: document.getElementById('adminMediaUploadInput'),
        mediaList: document.getElementById('adminMediaList'),
        historyModal: document.getElementById('adminHistoryModal'),
        historyCloseBtn: document.getElementById('adminHistoryCloseBtn'),
        historyList: document.getElementById('adminHistoryList'),
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
            const data = await loadContent(key, options);
            state.data[key] = deepClone(data);
            state.dirty[key] = false;
        }

        await loadAdminState();
        rebuildMediaLibrary();
    }

    function showAlert(message, type = 'info') {
        elements.alert.hidden = false;
        elements.alert.className = `admin-alert is-${type}`;
        elements.alert.textContent = message;
    }

    function clearAlert() {
        elements.alert.hidden = true;
        elements.alert.textContent = '';
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
                elements.modeNoteText.textContent = 'Видны тексты, фото, ссылки и формы без глубокой техники. Если нужно редактировать всё подряд, переключись на “Все поля”.';
            } else if (state.editorRole === 'customer') {
                elements.modeNoteTitle.textContent = 'Режим заказчика включён';
                elements.modeNoteText.textContent = 'Показываются только основные поля: тексты, фото, кнопки и контакты. Ссылки, формы, служебные ID и технические параметры спрятаны.';
            } else if (state.editorRole === 'manager') {
                elements.modeNoteTitle.textContent = 'Режим менеджера включён';
                elements.modeNoteText.textContent = 'Показываются контент и рабочие поля вроде ссылок, карт и форм. Служебные ID, иконки и глубоко технические параметры всё ещё скрыты.';
            } else {
                elements.modeNoteTitle.textContent = 'Расширенный режим включён';
                elements.modeNoteText.textContent = 'Показываются все поля без упрощения: контент, ссылки, иконки, размеры изображений, служебные ID и другие технические параметры.';
            }
        }
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
                            ? 'Включен режим менеджера. Видны тексты, фото, ссылки и формы без лишней техники.'
                            : 'Включен расширенный режим. Показаны все технические параметры.',
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
            iframeSrc: 'Ссылка на встроенную форму или внешний виджет.',
            mapSrc: 'Ссылка на карту для встраивания на страницу.',
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
        elements.mediaTitle.textContent = state.mediaPickerContext?.title || 'Выбрать фото';

        if (!filteredItems.length) {
            elements.mediaList.innerHTML = '<div class="admin-media__empty">По этому запросу ничего не найдено. Попробуй другое имя файла или очисти поиск.</div>';
            return;
        }

        elements.mediaList.innerHTML = filteredItems.map((item) => {
            const previewUrl = getPreviewUrl(item);
            const fileName = getFileNameFromPath(item);

            return `
                <article class="admin-media-card">
                    <img src="${previewUrl}" alt="${fileName}" loading="lazy">
                    <div class="admin-media-card__body">
                        <div class="admin-media-card__title">${fileName}</div>
                        <div class="admin-media-card__path">${item}</div>
                        <button class="admin-btn admin-btn--primary" type="button" data-media-select="${item}">
                            <i class="fas fa-check" aria-hidden="true"></i> Выбрать
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
        showAlert(`Версия от ${formatDateTime(entry.savedAt)} восстановлена. Нажми “Сохранить изменения”, чтобы применить её на сайте.`, 'success');
    }

    function renderHistoryModal() {
        if (!elements.historyList) return;

        const entries = getHistoryEntriesForActiveSection();

        if (!entries.length) {
            elements.historyList.innerHTML = '<div class="admin-media__empty">История пока пустая. Первая версия появится после успешного сохранения этого раздела.</div>';
            return;
        }

        elements.historyList.innerHTML = entries.map((entry, index) => `
            <article class="admin-media-card">
                <div class="admin-media-card__body">
                    <div class="admin-media-card__title">${index === 0 ? 'Последнее действие' : `Версия ${index + 1}`}</div>
                    <div class="admin-media-card__path">${formatDateTime(entry.savedAt)}</div>
                    <div class="admin-history-card__meta">
                        <span>${entry.action === 'publish' ? 'Отметка публикации' : 'Сохранение'}</span>
                        <span>${entry.savedBy || 'local'}</span>
                        <span>${entry.label || contentConfigs[state.activeKey].label}</span>
                    </div>
                    ${entry.data ? `
                        <button class="admin-btn admin-btn--primary" type="button" data-history-restore="${entry.id}">
                            <i class="fas fa-rotate-left" aria-hidden="true"></i> Вернуть версию
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

        return helperMap[field.key] || '';
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

    function renderSidebarFooter() {
        if (!elements.sidebarFooter) return;

        const activeConfig = contentConfigs[state.activeKey];
        const status = getSectionStatus(state.activeKey);

        elements.sidebarFooter.innerHTML = `
            <div class="admin-sidebar-footer__card">
                <p class="admin-toolbar__eyebrow">Активный раздел</p>
                <strong>${activeConfig.label}</strong>
                <span class="admin-status-badge is-${status.tone}">${status.label}</span>
            </div>
            <div class="admin-sidebar-footer__links">
                <a href="../index.html" target="_blank" rel="noopener noreferrer">Открыть сайт</a>
                <a href="../admin/" target="_blank" rel="noopener noreferrer">Открыть админку в новой вкладке</a>
                <a href="../docs/admin-deploy.md" target="_blank" rel="noopener noreferrer">Инструкция по публикации</a>
            </div>
        `;
    }

    function renderCommandCenter(sectionKey) {
        if (!elements.commandCenter) return;

        const config = contentConfigs[sectionKey];
        const meta = sectionMeta[sectionKey] || {};
        const status = getSectionStatus(sectionKey);
        const workflow = getSectionWorkflowStatus(sectionKey);
        const previewLinks = Array.isArray(meta.previewLinks) ? meta.previewLinks : [];
        const stats = collectSectionStats(state.data[sectionKey]);
        const activeIcon = meta.icon || 'fa-pen';

        elements.commandCenter.innerHTML = `
            <div class="admin-command-center__hero">
                <div class="admin-command-center__hero-copy">
                    <span class="admin-command-center__icon"><i class="fas ${activeIcon}" aria-hidden="true"></i></span>
                    <div class="admin-command-center__eyebrow">Текущий рабочий сценарий</div>
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
        `;
    }

    function getSectionSpecificSearchExamples(sectionKey) {
        const examples = {
            site: 'логотип, меню, телефоны, футер',
            home: 'hero, направления, форма, факты',
            catalog: 'группы, бренды, CTA',
            catalogPanels: 'откатные, калитки, FAQ, палитра, товары',
            servicePages: 'быстрые ссылки, карточки услуг, FAQ',
            automation: 'товары, hero, комплект, CTA',
            prices: 'факторы, калькулятор, гарантия',
            paymentDocuments: 'этапы, документы, доверие',
            contacts: 'телефоны, карта, форма, ориентиры'
        };

        return examples[sectionKey] || 'заголовок, текст, фото, кнопки';
    }

    function focusField(matcher) {
        const fields = Array.from(elements.form?.querySelectorAll('.admin-field') || []);
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

        elements.quickActionsCard.innerHTML = `
            <div class="admin-preview-card__header">
                <div>
                    <p class="admin-toolbar__eyebrow">Частые действия</p>
                    <h2>Быстрые сценарии</h2>
                </div>
            </div>
            <div class="admin-quick-actions">
                <button class="admin-btn admin-btn--ghost" type="button" data-quick-action="image">
                    <i class="fas fa-image" aria-hidden="true"></i> Поменять фото
                </button>
                <button class="admin-btn admin-btn--ghost" type="button" data-quick-action="text">
                    <i class="fas fa-pen" aria-hidden="true"></i> Поменять текст блока
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
            </div>
        `;

        elements.quickActionsCard.querySelectorAll('[data-quick-action]').forEach((button) => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-quick-action');

                if (action === 'image') {
                    const firstImageAction = elements.form?.querySelector('.admin-field[data-field-key="src"] .admin-field__media-actions button');
                    if (firstImageAction instanceof HTMLButtonElement) {
                        firstImageAction.click();
                        return;
                    }
                }

                if (action === 'text') {
                    if (focusField((fieldNode) => /title|lead|subtitle|text|description/i.test(fieldNode.dataset.fieldKey || ''))) {
                        return;
                    }
                }

                if (action === 'contacts') {
                    if (focusField((fieldNode) => /address|email|hours|href|label|phone/i.test(fieldNode.dataset.fieldKey || ''))) {
                        return;
                    }
                }

                if (action === 'add') {
                    const addButton = elements.form?.querySelector('.admin-array__toolbar .admin-btn');
                    if (addButton instanceof HTMLButtonElement) {
                        addButton.click();
                        return;
                    }
                }

                showAlert('Для этого действия пока не найден подходящий блок в текущем разделе.', 'info');
            });
        });
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

        const renderGroup = (group) => {
            if (!Array.isArray(group.items) || !group.items.length) {
                return;
            }

            const groupWrapper = document.createElement('section');
            groupWrapper.className = 'admin-nav__group';

            const groupTitle = document.createElement('h2');
            groupTitle.className = 'admin-nav__group-title';
            groupTitle.textContent = group.label;
            groupWrapper.appendChild(groupTitle);

            if (group.note) {
                const groupNote = document.createElement('p');
                groupNote.className = 'admin-nav__group-note';
                groupNote.textContent = group.note;
                groupWrapper.appendChild(groupNote);
            }

            group.items.forEach((key) => {
                const config = contentConfigs[key];
                if (!config) return;

                const meta = sectionMeta[key] || {};
                const haystack = [
                    config.label,
                    config.description,
                    meta.navHint,
                    meta.summary
                ].filter(Boolean).join(' ').toLowerCase();

                if (navQuery && !haystack.includes(navQuery)) {
                    return;
                }

                const status = getSectionStatus(key);
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `admin-nav__button${state.activeKey === key ? ' is-active' : ''}`;

                button.innerHTML = `
                    <span class="admin-nav__button-icon"><i class="fas ${meta.icon || 'fa-pen'}" aria-hidden="true"></i></span>
                    <span class="admin-nav__button-copy">
                        <strong>${config.label}</strong>
                        <span>${meta.navHint || config.description}</span>
                        <span class="admin-nav__button-status is-${status.tone}">${status.label}</span>
                    </span>
                `;

                button.addEventListener('click', () => {
                    if (state.activeKey !== key && !confirmDiscardChanges()) {
                        return;
                    }

                    state.activeKey = key;
                    state.searchQuery = '';
                    clearAlert();
                    renderNav();
                    renderActiveSection();
                });

                groupWrapper.appendChild(button);
            });

            if (groupWrapper.querySelector('.admin-nav__button')) {
                elements.nav.appendChild(groupWrapper);
            }
        };

        if (state.quickMode) {
            renderGroup({
                label: 'Быстрые правки',
                note: 'Самые частые разделы для ежедневной работы без лишнего поиска.',
                items: ['home', 'catalogPanels', 'contacts', 'prices']
            });
        }

        navGroups.forEach((group) => {
            renderGroup({
                ...group,
                items: state.quickMode
                    ? group.items.filter((itemKey) => !['home', 'catalogPanels', 'contacts', 'prices'].includes(itemKey))
                    : group.items
            });
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
            const details = document.createElement('details');
            details.className = 'admin-section';
            details.open = !field.startCollapsed;
            details.id = `admin-top-${contentKey}-${slugifyLabel(field.key || field.label)}`;

            const { primaryFields, secondaryFields, advancedFields } = splitFieldsForMode(field.fields);
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
            return renderArrayField(field, parentObject, contentKey);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'admin-field';
        wrapper.dataset.fieldKey = field.key;
        wrapper.dataset.fieldLabel = getDisplayLabel(field);
        wrapper.dataset.contentKey = contentKey;

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

            if (field.key === 'src' || (typeof nextValue === 'string' && isImageLikeValue(nextValue))) {
                previewNode = createImagePreview(nextValue);
                if (previewNode) {
                    wrapper.appendChild(previewNode);
                }
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
            const actions = document.createElement('div');
            actions.className = 'admin-field__media-actions';
            actions.innerHTML = `
                <button class="admin-btn admin-btn--ghost" type="button">
                    <i class="fas fa-images" aria-hidden="true"></i> Выбрать из библиотеки
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

        const section = document.createElement('details');
        section.className = 'admin-section';
        section.open = !field.startCollapsed;

        const summary = document.createElement('summary');
        const arrayMeta = field.allowReorder === false
            ? `${array.length} элементов`
            : `${array.length} элементов · можно менять порядок`;
        summary.appendChild(createSectionSummary(field.label || field.key, arrayMeta, 'fa-list'));
        section.appendChild(summary);

        const body = document.createElement('div');
        body.className = 'admin-array';
        section.appendChild(body);

        const toolbar = document.createElement('div');
        toolbar.className = 'admin-array__toolbar';
        toolbar.innerHTML = `
            <div class="admin-array__title">${field.label || field.key}</div>
            ${field.allowAddRemove === false ? '' : `<button type="button" class="admin-btn">Добавить ${String(field.itemLabel || 'элемент').toLowerCase()}</button>`}
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

                    const details = document.createElement('details');
                    details.className = 'admin-array-card__details';
                    details.open = !state.simpleMode && index === 0;
                    card.appendChild(details);

                    const summary = document.createElement('summary');
                    summary.innerHTML = `
                        <div class="admin-array-card__header">
                            <div>
                                <div class="admin-array-card__title">${itemTitle}</div>
                                ${itemMeta ? `<div class="admin-array-card__meta">${itemMeta}</div>` : ''}
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
        elements.title.textContent = config.label;
        elements.description.textContent = meta.navHint || config.description;
        elements.form.innerHTML = '';
        state.lastFocusedField = null;
        renderCommandCenter(key);
        renderOverview(key);
        renderJumpbar(key);

        config.schema.fields.forEach((field, index) => {
            const fieldNode = renderField(field, state.data[key], key);

            if (
                state.simpleMode
                && fieldNode instanceof HTMLDetailsElement
                && !field.startCollapsed
            ) {
                fieldNode.open = index === 0;
            }

            elements.form.appendChild(fieldNode);
        });

        applySectionFilter();
        renderStatusCard(key);
        renderQuickActions(key);
        renderMiniPreview(key);
        refreshLivePreview();
        updateToolbarState();
        updateDirtyBar();
    }

    function updateToolbarState() {
        const hasChanges = Boolean(state.dirty[state.activeKey]);
        const canSave = state.apiAvailable
            && hasChanges
            && (!state.authRequired || state.authenticated);
        const canPublish = state.apiAvailable
            && !hasChanges
            && (!state.authRequired || state.authenticated)
            && Boolean(getSectionAdminState(state.activeKey)?.lastSavedAt);

        elements.saveBtn.disabled = !canSave;
        if (elements.publishBtn) {
            elements.publishBtn.disabled = !canPublish;
        }

        if (canSave) {
            elements.saveBtn.innerHTML = '<i class="fas fa-floppy-disk" aria-hidden="true"></i> Сохранить изменения';
            updateDirtyBar();
            return;
        }

        if (!hasChanges) {
            elements.saveBtn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Изменений пока нет';
            updateDirtyBar();
            return;
        }

        if (!state.apiAvailable) {
            elements.saveBtn.innerHTML = '<i class="fas fa-server" aria-hidden="true"></i> Нет сервера сохранения';
            updateDirtyBar();
            return;
        }

        if (state.authRequired && !state.authenticated) {
            elements.saveBtn.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i> Нужен вход';
            updateDirtyBar();
            return;
        }

        elements.saveBtn.innerHTML = '<i class="fas fa-floppy-disk" aria-hidden="true"></i> Сохранить изменения';
        updateDirtyBar();
    }

    async function saveActiveSection() {
        const key = state.activeKey;
        const config = contentConfigs[key];

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
            renderNav();
            renderStatusCard(key);
            renderMiniPreview(key);
            renderHistoryModal();
            refreshLivePreview();
            updateToolbarState();
            showAlert(`Раздел «${config.label}» сохранён в файлы проекта. Если сайт уже обновлён, можно отметить его как опубликованный.`, 'success');
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    async function publishActiveSection() {
        const key = state.activeKey;
        const config = contentConfigs[key];

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

            renderNav();
            renderStatusCard(key);
            renderHistoryModal();
            updateToolbarState();
            showAlert(`Раздел «${config.label}» отмечен как опубликованный.`, 'success');
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    function downloadActiveSection() {
        const key = state.activeKey;
        const config = contentConfigs[key];
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
            const data = await loadContent(key, { fresh: true });
            await loadAdminState();
            state.data[key] = deepClone(data);
            state.dirty[key] = false;
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
        elements.publishBtn?.addEventListener('click', publishActiveSection);
        elements.dirtySaveBtn?.addEventListener('click', saveActiveSection);
        elements.dirtyResetBtn?.addEventListener('click', resetActiveSection);
        elements.downloadBtn.addEventListener('click', downloadActiveSection);
        elements.reloadBtn.addEventListener('click', reloadActiveSection);
        elements.quickModeBtn?.addEventListener('click', () => setQuickMode(true));
        elements.fullModeBtn?.addEventListener('click', () => setQuickMode(false));
        elements.historyBtn?.addEventListener('click', openHistoryModal);
        elements.collapseBtn?.addEventListener('click', () => setAllSectionStates(false));
        elements.expandBtn?.addEventListener('click', () => setAllSectionStates(true));
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
        elements.customerModeBtn?.addEventListener('click', () => setEditorMode('customer'));
        elements.managerModeBtn?.addEventListener('click', () => setEditorMode('manager'));
        elements.advancedModeBtn?.addEventListener('click', () => setEditorMode('advanced'));
        elements.loginForm?.addEventListener('submit', handleLoginSubmit);
        elements.logoutBtn?.addEventListener('click', handleLogout);
        window.addEventListener('beforeunload', handleBeforeUnload);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
