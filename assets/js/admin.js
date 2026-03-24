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

    const state = {
        activeKey: 'site',
        data: {},
        dirty: {},
        apiAvailable: false,
        authRequired: false,
        authenticated: false,
        username: ''
    };

    const elements = {
        shell: document.querySelector('.admin-shell'),
        nav: document.getElementById('adminNav'),
        form: document.getElementById('adminForm'),
        title: document.getElementById('adminTitle'),
        description: document.getElementById('adminDescription'),
        alert: document.getElementById('adminAlert'),
        connection: document.getElementById('adminConnection'),
        reloadBtn: document.getElementById('adminReloadBtn'),
        downloadBtn: document.getElementById('adminDownloadBtn'),
        saveBtn: document.getElementById('adminSaveBtn'),
        logoutBtn: document.getElementById('adminLogoutBtn'),
        auth: document.getElementById('adminAuth'),
        loginForm: document.getElementById('adminLoginForm')
    };

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

    function updateConnectionState() {
        if (state.apiAvailable && state.authRequired && state.authenticated) {
            elements.connection.textContent = `Сервер подключен · вход выполнен${state.username ? `: ${state.username}` : ''}`;
            elements.connection.className = 'admin-connection is-live';
        } else if (state.apiAvailable && state.authRequired) {
            elements.connection.textContent = 'Сервер подключен · нужен вход';
            elements.connection.className = 'admin-connection is-live';
        } else if (state.apiAvailable) {
            elements.connection.textContent = 'Локальный сервер подключен';
            elements.connection.className = 'admin-connection is-live';
        } else {
            elements.connection.textContent = 'Режим чтения: сервер не найден';
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

        Object.entries(contentConfigs).forEach(([key, config]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `admin-nav__button${state.activeKey === key ? ' is-active' : ''}`;
            button.innerHTML = `
                <strong>${config.label}${state.dirty[key] ? ' *' : ''}</strong>
                <span>${config.description}</span>
            `;
            button.addEventListener('click', () => {
                state.activeKey = key;
                clearAlert();
                renderNav();
                renderActiveSection();
            });
            elements.nav.appendChild(button);
        });
    }

    function renderField(field, parentObject, contentKey) {
        const value = parentObject[field.key] ?? createDefaultValue(field);
        parentObject[field.key] = value;

        if (field.type === 'group') {
            const details = document.createElement('details');
            details.className = 'admin-section';
            details.open = !field.startCollapsed;

            const summary = document.createElement('summary');
            summary.textContent = field.label || field.key;
            details.appendChild(summary);

            const grid = document.createElement('div');
            grid.className = 'admin-grid admin-grid--two';
            details.appendChild(grid);

            field.fields.forEach((childField) => {
                grid.appendChild(renderField(childField, value, contentKey));
            });

            return details;
        }

        if (field.type === 'array') {
            return renderArrayField(field, parentObject, contentKey);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'admin-field';

        const label = document.createElement('label');
        label.textContent = field.label || field.key;
        wrapper.appendChild(label);

        const input = field.type === 'textarea'
            ? document.createElement('textarea')
            : document.createElement('input');

        input.className = field.type === 'textarea' ? 'admin-textarea' : 'admin-input';
        if (field.type !== 'textarea') {
            input.type = field.type === 'number' ? 'number' : 'text';
        }

        input.value = field.type === 'number' ? Number(value || 0) : value || '';
        input.addEventListener('input', () => {
            parentObject[field.key] = field.type === 'number' ? Number(input.value || 0) : input.value;
            state.dirty[contentKey] = true;
            renderNav();
            updateToolbarState();
        });
        wrapper.appendChild(input);

        return wrapper;
    }

    function renderArrayField(field, parentObject, contentKey) {
        const array = Array.isArray(parentObject[field.key]) ? parentObject[field.key] : [];
        parentObject[field.key] = array;

        const section = document.createElement('details');
        section.className = 'admin-section';
        section.open = !field.startCollapsed;

        const summary = document.createElement('summary');
        summary.textContent = field.label || field.key;
        section.appendChild(summary);

        const body = document.createElement('div');
        body.className = 'admin-array';
        section.appendChild(body);

        const toolbar = document.createElement('div');
        toolbar.className = 'admin-array__toolbar';
        toolbar.innerHTML = `
            <div class="admin-array__title">${field.label || field.key}</div>
            ${field.allowAddRemove === false ? '' : '<button type="button" class="admin-btn">Добавить</button>'}
        `;
        body.appendChild(toolbar);

        const addButton = toolbar.querySelector('button');
        const list = document.createElement('div');
        list.className = 'admin-array__list';
        body.appendChild(list);

        function markDirty() {
            state.dirty[contentKey] = true;
            renderNav();
            updateToolbarState();
        }

        function rerenderList() {
            list.innerHTML = '';

            array.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'admin-array-card';

                const header = document.createElement('div');
                header.className = 'admin-array-card__header';
                header.innerHTML = `
                    <div class="admin-array-card__title">${field.itemLabel || 'Элемент'} ${index + 1}</div>
                    <div class="admin-array-card__actions">
                        <button type="button" class="admin-icon-btn" aria-label="Поднять вверх"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
                        <button type="button" class="admin-icon-btn" aria-label="Опустить вниз"><i class="fas fa-arrow-down" aria-hidden="true"></i></button>
                        <button type="button" class="admin-icon-btn admin-icon-btn--danger" aria-label="Удалить"><i class="fas fa-trash" aria-hidden="true"></i></button>
                    </div>
                `;
                card.appendChild(header);

                const [upButton, downButton, removeButton] = header.querySelectorAll('button');
                if (field.allowReorder === false) {
                    upButton.hidden = true;
                    downButton.hidden = true;
                } else {
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
                    removeButton.hidden = true;
                } else {
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
                    const itemObject = item && typeof item === 'object' ? item : {};
                    array[index] = itemObject;
                    const grid = document.createElement('div');
                    grid.className = 'admin-grid admin-grid--two';
                    field.fields.forEach((childField) => {
                        grid.appendChild(renderField(childField, itemObject, contentKey));
                    });
                    card.appendChild(grid);
                }

                list.appendChild(card);
            });
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
        elements.title.textContent = config.label;
        elements.description.textContent = config.description;
        elements.form.innerHTML = '';

        config.schema.fields.forEach((field) => {
            elements.form.appendChild(renderField(field, state.data[key], key));
        });

        updateToolbarState();
    }

    function updateToolbarState() {
        const canSave = state.apiAvailable
            && state.dirty[state.activeKey]
            && (!state.authRequired || state.authenticated);

        elements.saveBtn.disabled = !canSave;
    }

    async function saveActiveSection() {
        const key = state.activeKey;
        const config = contentConfigs[key];

        if (!state.apiAvailable) {
            showAlert('Сервер не запущен. Можно только скачать JSON-файл вручную.', 'info');
            return;
        }

        try {
            const response = await fetch(`/api/content/${config.fileName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state.data[key], null, 2)
            });

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
                throw new Error(`Не удалось сохранить ${config.fileName}.json`);
            }

            state.dirty[key] = false;
            renderNav();
            updateToolbarState();
            showAlert(`Файл ${config.fileName}.json сохранен.`, 'success');
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
        showAlert(`Скачан файл ${config.fileName}.json`, 'success');
    }

    async function reloadActiveSection() {
        try {
            const key = state.activeKey;
            const data = await loadContent(key, { fresh: true });
            state.data[key] = deepClone(data);
            state.dirty[key] = false;
            clearAlert();
            renderNav();
            renderActiveSection();
            showAlert(`Данные ${contentConfigs[key].fileName}.json перечитаны с диска.`, 'success');
        } catch (error) {
            showAlert(error.message, 'error');
        }
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
        state.authRequired = authState.authEnabled;
        state.authenticated = authState.authEnabled ? authState.authenticated : true;
        state.username = authState.username || '';
        updateConnectionState();
        updateAuthUi();

        try {
            await loadAllContent();
            renderNav();
            renderActiveSection();
        } catch (error) {
            showAlert(`Не удалось загрузить контент: ${error.message}`, 'error');
        }

        elements.saveBtn.addEventListener('click', saveActiveSection);
        elements.downloadBtn.addEventListener('click', downloadActiveSection);
        elements.reloadBtn.addEventListener('click', reloadActiveSection);
        elements.loginForm?.addEventListener('submit', handleLoginSubmit);
        elements.logoutBtn?.addEventListener('click', handleLogout);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
