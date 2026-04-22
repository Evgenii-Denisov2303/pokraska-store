document.addEventListener('DOMContentLoaded', async function() {
    const navLinks = document.querySelectorAll('.service-nav-link');
    const sections = document.querySelectorAll('.service-detail-card');
    const header = document.querySelector('.header');
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const shouldResetCatalogScroll =
        !window.location.hash &&
        navigationEntry &&
        navigationEntry.type === 'navigate';
    const hasNav = navLinks.length && sections.length;

    function updateActiveLink() {
        if (!hasNav) {
            return;
        }

        let current = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        if (scrollPosition < sections[0].offsetTop - 100) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }

    if (hasNav) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 140;

                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });

                    history.pushState(null, null, targetId);
                }
            });
        });

        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                setTimeout(() => {
                    const headerHeight = header ? header.offsetHeight : 140;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();

        const serviceCards = document.querySelectorAll('.service-detail-card');
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });

        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(10px)';

            setTimeout(() => {
                link.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 100 + 500);
        });
    }

    const catalogLayout = document.querySelector('[data-catalog-layout]');
    const catalogContent = document.querySelector('.catalog-content[data-catalog-panels-source]');
    const catalogNavIntroTitle = document.querySelector('[data-catalog-nav-intro-title]');
    const catalogNavIntroCopy = document.querySelector('[data-catalog-nav-intro-copy]');
    const catalogFaqTitle = document.querySelector('[data-catalog-faq-title]');
    const catalogFaqCopy = document.querySelector('[data-catalog-faq-copy]');
    const catalogFaqList = document.querySelector('[data-catalog-faq-list]');
    const catalogFaqSchema = document.getElementById('catalog-faq-schema');
    const catalogAssistant = document.querySelector('[data-catalog-assistant]');
    const catalogAssistantEyebrow = document.querySelector('[data-catalog-assistant-eyebrow]');
    const catalogAssistantTitle = document.querySelector('[data-catalog-assistant-title]');
    const catalogAssistantCopy = document.querySelector('[data-catalog-assistant-copy]');
    const catalogAssistantPoints = document.querySelector('[data-catalog-assistant-points]');
    const catalogAssistantPrimary = document.querySelector('[data-catalog-assistant-primary]');
    const catalogAssistantSecondary = document.querySelector('[data-catalog-assistant-secondary]');

    const catalogFaqContent = {
        default: {
            title: 'Вопросы по откатным воротам',
            copy: 'Проем, фундамент, автоматика и комплектация под въезд.',
            items: [
                {
                    question: 'От чего зависит стоимость откатных ворот?',
                    answer: 'Стоимость рассчитываем по размерам проема, заполнению, каркасу, автоматике, фундаменту и монтажу. Итог зависит от комплектации и условий объекта.'
                },
                {
                    question: 'Нужен ли фундамент под откатные ворота?',
                    answer: 'Обычно да. Тип основания зависит от проема, грунта, веса конструкции и схемы монтажа, поэтому решение уточняем после замера.'
                },
                {
                    question: 'Можно сразу подобрать автоматику?',
                    answer: 'Да. Подбираем привод по весу створки, интенсивности использования и условиям работы на объекте.'
                },
                {
                    question: 'Какие сроки изготовления и монтажа?',
                    answer: 'Сроки называем после замера и согласования комплектации. Отдельно учитываем подготовку основания, покраску и монтаж на объекте.'
                }
            ]
        },
        'catalog-panel-sliding': {
            title: 'Вопросы по откатным воротам',
            copy: 'Проем, фундамент, автоматика и комплектация под въезд.',
            items: [
                {
                    question: 'От чего зависит стоимость откатных ворот?',
                    answer: 'Стоимость рассчитываем по размерам проема, заполнению, каркасу, автоматике, фундаменту и монтажу. Итог зависит от комплектации и условий объекта.'
                },
                {
                    question: 'Нужен ли фундамент под откатные ворота?',
                    answer: 'Обычно да. Тип основания зависит от проема, грунта, веса конструкции и схемы монтажа, поэтому решение уточняем после замера.'
                },
                {
                    question: 'Можно сразу подобрать автоматику?',
                    answer: 'Да. Подбираем привод по весу створки, интенсивности использования и условиям работы на объекте.'
                },
                {
                    question: 'Какие сроки изготовления и монтажа?',
                    answer: 'Сроки называем после замера и согласования комплектации. Отдельно учитываем подготовку основания, покраску и монтаж на объекте.'
                }
            ]
        },
        'catalog-panel-sliding-frame': {
            title: 'Вопросы по каркасу откатных ворот',
            copy: 'Что входит в каркас и как подготовить его под обшивку и монтаж.',
            items: [
                {
                    question: 'Что входит в каркас откатных ворот?',
                    answer: 'Состав согласуем под задачу: силовая рама, точки под направляющую, фурнитуру и последующую обшивку. Комплектация зависит от того, нужен только каркас или решение ближе к готовому изделию.'
                },
                {
                    question: 'Каркас можно заказать без заполнения?',
                    answer: 'Да. Его часто берут как базу под профнастил, штакетник, жалюзи или другое заполнение, которое выбирают позже.'
                },
                {
                    question: 'Подойдет ли каркас под автоматику?',
                    answer: 'Да, если заранее учитывать вес створки, место под рейку и точки крепления автоматики. Эти моменты лучше заложить сразу.'
                },
                {
                    question: 'Нужны ли отдельные столбы и фундамент?',
                    answer: 'Зависит от проема и существующих опор. После замера подскажем, что можно оставить, а что правильнее сделать заново.'
                }
            ]
        },
        'catalog-panel-swing': {
            title: 'Вопросы по распашным воротам',
            copy: 'Открывание, автоматика, проем и заполнение под ваш въезд.',
            items: [
                {
                    question: 'Куда могут открываться створки?',
                    answer: 'Внутрь или наружу — смотрим по месту, с учетом уклона, парковки, ширины заезда и повседневного сценария использования.'
                },
                {
                    question: 'Можно ли поставить автоматику позже?',
                    answer: 'Да, если сразу заложить правильную геометрию створок, опоры и запас по весу. Тогда дооснастить ворота будет проще.'
                },
                {
                    question: 'Как подбирают размер и конфигурацию?',
                    answer: 'Ориентируемся на ширину проема, сценарий въезда, вес заполнения и то, сколько места есть для открывания створок.'
                },
                {
                    question: 'Можно сделать в одном стиле с калиткой и забором?',
                    answer: 'Да. Подбираем одинаковое заполнение, цвет, фурнитуру и общий ритм по фасаду участка.'
                }
            ]
        },
        'catalog-panel-swing-frame': {
            title: 'Вопросы по каркасу распашных ворот',
            copy: 'Каркас, заполнение, столбы и подготовка под автоматику.',
            items: [
                {
                    question: 'Каркас идет без обшивки?',
                    answer: 'Да, это базовая металлическая конструкция под дальнейшее заполнение. Такой вариант удобен, если материал и отделку вы хотите выбрать отдельно.'
                },
                {
                    question: 'Какое заполнение можно поставить?',
                    answer: 'Профнастил, штакетник, жалюзи, металлосайдинг и другие варианты согласуем по задаче, весу и внешнему виду.'
                },
                {
                    question: 'Можно подготовить каркас под автоматику?',
                    answer: 'Да, если заранее учесть вес створок, петли, ограничители и точки крепления приводов. Лучше закладывать это сразу.'
                },
                {
                    question: 'Нужны ли новые столбы?',
                    answer: 'Смотрим на состояние существующих опор. Иногда хватает усиления, а иногда правильнее делать новые столбы под массу створок.'
                }
            ]
        },
        'catalog-panel-wicket': {
            title: 'Вопросы по калиткам',
            copy: 'Размер, замок, открывание и внешний вид под общий стиль участка.',
            items: [
                {
                    question: 'Калитку лучше делать отдельно или вместе с воротами?',
                    answer: 'Оба варианта возможны. Часто удобнее сразу собирать в одном стиле, чтобы совпали высота, заполнение, цвет и посадка по линии ограждения.'
                },
                {
                    question: 'Можно выбрать сторону открывания и замок?',
                    answer: 'Да. Согласовываем сторону открывания, тип замка, ручки и удобство прохода еще до изготовления.'
                },
                {
                    question: 'Калитка будет в одном стиле с воротами?',
                    answer: 'Да, можем повторить материал, цвет, рисунок заполнения и общую геометрию, чтобы вход выглядел цельно.'
                },
                {
                    question: 'Нужны ли отдельные столбы?',
                    answer: 'Зависит от места установки и существующей конструкции. Иногда калитку встраиваем в готовую линию, а иногда ставим на свои опоры.'
                }
            ]
        },
        'catalog-panel-fence-profnastil': {
            title: 'Вопросы по забору из профнастила',
            copy: 'Высота, цвет, каркас и комплектация участка под ключ.',
            items: [
                {
                    question: 'Какую высоту и длину можно сделать?',
                    answer: 'Подбираем под участок, задачи по приватности и общую длину линии ограждения. Размеры рассчитываем по месту.'
                },
                {
                    question: 'Можно выбрать цвет и покрытие?',
                    answer: 'Да. Подбираем оттенок и тип листа под дом, ворота и общий вид фасада участка.'
                },
                {
                    question: 'Что входит в конструкцию забора?',
                    answer: 'Обычно считаем столбы, лаги, профлист, крепеж и доборные элементы. Монтаж и основание уточняем отдельно по задаче.'
                },
                {
                    question: 'Можно сразу заказать ворота и калитку?',
                    answer: 'Да, чаще всего так и делаем, чтобы все совпало по стилю, высоте и ритму фасада.'
                }
            ]
        },
        'catalog-panel-fence-siding': {
            title: 'Вопросы по забору из металлосайдинга',
            copy: 'Внешний вид, покрытие и комплектация под фасад участка.',
            items: [
                {
                    question: 'Чем металлосайдинг отличается от профнастила?',
                    answer: 'Он выглядит более фасадно и декоративно. Такой забор чаще выбирают, когда важен не только периметр, но и внешний образ участка.'
                },
                {
                    question: 'Можно подобрать цвет или фактуру под фасад?',
                    answer: 'Да. Подбираем оттенок и визуальное решение под дом, ворота и другие элементы на участке.'
                },
                {
                    question: 'Такой забор делают с воротами и калиткой?',
                    answer: 'Да, можно сразу собрать весь фасадный комплект в едином стиле: забор, ворота, калитку и отделку столбов.'
                },
                {
                    question: 'От чего зависит стоимость?',
                    answer: 'На цену влияют длина, высота, тип каркаса, выбранное заполнение, покрытие и монтаж на объекте.'
                }
            ]
        },
        'catalog-panel-fence-picket': {
            title: 'Вопросы по забору из металлоштакетника',
            copy: 'Приватность, шаг планок и исполнение в один или два ряда.',
            items: [
                {
                    question: 'Можно настроить просвет между планками?',
                    answer: 'Да. Подбираем шаг планок под нужную приватность, продуваемость и общий рисунок забора.'
                },
                {
                    question: 'Что приватнее: один ряд или шахматка?',
                    answer: 'Шахматное исполнение и двустороннее заполнение дают более закрытый силуэт и лучше перекрывают обзор.'
                },
                {
                    question: 'Можно сделать вертикальное или горизонтальное исполнение?',
                    answer: 'Да, формат подбираем под стиль дома, длину пролетов и визуальное ощущение от ограждения.'
                },
                {
                    question: 'Подходит ли такой забор к воротам и калитке?',
                    answer: 'Да. Его удобно собирать в единый комплект с воротами и калиткой в том же материале и цвете.'
                }
            ]
        },
        'catalog-panel-fence-louver': {
            title: 'Вопросы по забору-жалюзи',
            copy: 'Приватность, вентиляция и современный внешний вид участка.',
            items: [
                {
                    question: 'Виден ли участок через жалюзи?',
                    answer: 'Прямой обзор уменьшается за счет угла ламелей, но степень приватности зависит от профиля и выбранного шага.'
                },
                {
                    question: 'Почему выбирают жалюзи вместо сплошного забора?',
                    answer: 'Такой вариант дает вентиляцию, спокойнее работает на ветру и выглядит легче, чем полностью глухое ограждение.'
                },
                {
                    question: 'Можно подобрать цвет и рамку под объект?',
                    answer: 'Да. Согласовываем оттенок, форму рамки и посадку секций под архитектуру участка.'
                },
                {
                    question: 'Можно сделать ворота и калитку в том же стиле?',
                    answer: 'Да, этот тип хорошо собирается в единый фасадный комплект с воротами и отдельным входом.'
                }
            ]
        },
        'catalog-panel-sectional': {
            title: 'Вопросы по секционным воротам',
            copy: 'Размер проема, утепление, автоматика и подготовка гаража.',
            items: [
                {
                    question: 'Подойдут ли секционные ворота для отапливаемого гаража?',
                    answer: 'Да. Комплектацию, панель и уплотнения подбираем по режиму использования и требованиям к теплу.'
                },
                {
                    question: 'Сколько места нужно под потолком?',
                    answer: 'Зависит от высоты перемычки, геометрии проема и схемы направляющих. Эти размеры обязательно проверяем на замере.'
                },
                {
                    question: 'Можно сразу поставить автоматику?',
                    answer: 'Да. Чаще всего секционные ворота сразу комплектуем приводом, пультами и базовыми элементами безопасности.'
                },
                {
                    question: 'Можно выбрать рисунок, цвет и остекление?',
                    answer: 'Да. Подбираем внешний рисунок панелей, оттенок, окна и дополнительные опции под фасад и формат гаража.'
                }
            ]
        },
        'catalog-panel-roller': {
            title: 'Вопросы по рольворотам',
            copy: 'Короб, проем, управление и где этот тип работает лучше всего.',
            items: [
                {
                    question: 'Где рольворота уместнее всего?',
                    answer: 'Для гаражей, хозяйственных и технических проемов, где нужен компактный подъем полотна в короб.'
                },
                {
                    question: 'Нужно ли место под короб?',
                    answer: 'Да. Размер короба и направляющих заранее учитываем по проему, поэтому точные размеры смотрим на замере.'
                },
                {
                    question: 'Есть ручное и автоматическое управление?',
                    answer: 'Да, конфигурацию выбираем под частоту использования, бюджет и удобство управления.'
                },
                {
                    question: 'Чем рольворота отличаются от секционных?',
                    answer: 'Рольворота компактнее по механике, а секционные обычно сильнее по теплоизоляции. Выбор зависит от задачи и самого проема.'
                }
            ]
        },
        'catalog-panel-shutters': {
            title: 'Вопросы по рольставням',
            copy: 'Защита проема, управление и подбор под размеры и назначение.',
            items: [
                {
                    question: 'На какие проемы ставят рольставни?',
                    answer: 'На окна, двери, витрины и технические проемы. Подбираем решение по месту и нужному уровню защиты.'
                },
                {
                    question: 'Можно выбрать ручное или автоматическое управление?',
                    answer: 'Да. В зависимости от размера проема и сценария использования ставим ручной вариант или привод.'
                },
                {
                    question: 'Как подбирают профиль и цвет?',
                    answer: 'Ориентируемся на размеры проема, задачу по защите и внешний вид фасада. После этого согласовываем нужный профиль и оттенок.'
                },
                {
                    question: 'Можно поставить на уже готовый проем?',
                    answer: 'Чаще всего да. Выбираем способ монтажа — в проем или внаклад — и под него считаем конструкцию.'
                }
            ]
        },
        'catalog-panel-grilles': {
            title: 'Вопросы по раздвижным решеткам',
            copy: 'Где ставят, как складываются и что по замкам и покрытию.',
            items: [
                {
                    question: 'Где чаще ставят раздвижные решетки?',
                    answer: 'На дверные и оконные проемы магазинов, офисов, складов и внутренних зон, где важны обзор и защита.'
                },
                {
                    question: 'Они занимают много места в открытом состоянии?',
                    answer: 'Нет. Конструкция складывается по принципу гармошки и в открытом положении занимает минимум места сбоку.'
                },
                {
                    question: 'Как решетки закрываются и запираются?',
                    answer: 'Используем встроенный замок, а при необходимости дополнительно предусматриваем проушины под навесной замок.'
                },
                {
                    question: 'Можно выбрать цвет и способ монтажа?',
                    answer: 'Да. Согласовываем цвет, порошковую покраску и вариант установки — в проем или внаклад.'
                }
            ]
        },
        'catalog-panel-automation-sliding': {
            title: 'Вопросы по автоматике для откатных ворот',
            copy: 'Подбор привода по весу, режиму работы и комплектации ворот.',
            items: [
                {
                    question: 'Как подобрать привод для откатных ворот?',
                    answer: 'Ориентируемся на вес и длину створки, интенсивность использования, климат и запас по нагрузке.'
                },
                {
                    question: 'Можно поставить автоматику на уже готовые ворота?',
                    answer: 'Да, если механика ворот в порядке и конструкция подходит по геометрии под привод и зубчатую рейку.'
                },
                {
                    question: 'Что обычно входит в комплект автоматики?',
                    answer: 'Зависит от серии. В набор могут входить привод, блок управления, пульты, монтажные элементы и базовые аксессуары.'
                },
                {
                    question: 'Что будет при отключении электричества?',
                    answer: 'У привода есть режим ручной разблокировки, поэтому ворота можно открыть и без питания.'
                }
            ]
        },
        'catalog-panel-automation-swing': {
            title: 'Вопросы по автоматике для распашных ворот',
            copy: 'Подбор под длину створки, столбы и сценарий открывания.',
            items: [
                {
                    question: 'Можно автоматизировать уже готовые распашные ворота?',
                    answer: 'Да, если петли, столбы и геометрия створок позволяют поставить привод без перегрузки конструкции.'
                },
                {
                    question: 'От чего зависит выбор привода?',
                    answer: 'Смотрим на длину и вес створки, угол открывания, расположение столбов и частоту использования.'
                },
                {
                    question: 'Нужны ли дополнительные аксессуары?',
                    answer: 'По задаче можем добавить пульты, сигнальную лампу, фотоэлементы, GSM-управление и другие полезные опции.'
                },
                {
                    question: 'Как открывать ворота при отключении света?',
                    answer: 'Как и у других приводов, здесь предусмотрена ручная разблокировка для аварийного открывания.'
                }
            ]
        },
        'catalog-panel-automation-components': {
            title: 'Вопросы по комплектующим и аксессуарам',
            copy: 'Совместимость, наличие и подбор под уже установленную автоматику.',
            items: [
                {
                    question: 'Как понять, что аксессуар подойдет к моей автоматике?',
                    answer: 'Ориентируемся на бренд, модель, питание, тип приемника и сценарий использования. По этим данным подскажем совместимую позицию.'
                },
                {
                    question: 'Можно купить комплектующие отдельно от привода?',
                    answer: 'Да. Пульты, лампы, фотоэлементы и механические наборы можно подбирать как отдельные позиции.'
                },
                {
                    question: 'Что есть в наличии, а что идет под заказ?',
                    answer: 'По конкретной позиции уточняем отдельно: часть аксессуаров держим в наличии, остальное быстро довозим под задачу.'
                },
                {
                    question: 'Поможете подобрать комплектующие под уже установленную автоматику?',
                    answer: 'Да, подскажем по бренду, модели и задаче, чтобы комплектующие подошли без лишних покупок и переделок.'
                }
            ]
        }
    };
    const catalogAssistantContent = {
        default: {
            eyebrow: 'Откатные ворота',
            title: 'Подберем откатные ворота под ваш проем',
            copy: 'Подскажем по фундаменту, автоматике и комплектации. Если есть размеры или фото, расчет пойдет быстрее.',
            points: ['Проем и размеры', 'Фундамент', 'Автоматика']
        },
        'catalog-panel-sliding': {
            eyebrow: 'Откатные ворота',
            title: 'Подберем откатные ворота под ваш проем',
            copy: 'Подскажем по фундаменту, автоматике и комплектации. Если есть размеры или фото, расчет пойдет быстрее.',
            points: ['Проем и размеры', 'Фундамент', 'Автоматика']
        },
        'catalog-panel-sliding-frame': {
            eyebrow: 'Каркас откатных',
            title: 'Подскажем, как собрать каркас без лишних переделок',
            copy: 'Разберем силовую базу, подготовку под обшивку, фурнитуру и будущую автоматику.',
            points: ['Основа каркаса', 'Обшивка', 'Фурнитура']
        },
        'catalog-panel-swing': {
            eyebrow: 'Распашные ворота',
            title: 'Подберем распашные ворота под ваш въезд',
            copy: 'Учтем угол открывания, вес створок и подготовку под автоматику, чтобы ворота работали без перегруза.',
            points: ['Открывание', 'Столбы и петли', 'Автоматика']
        },
        'catalog-panel-swing-frame': {
            eyebrow: 'Каркас распашных',
            title: 'Подскажем, как подготовить каркас под заполнение',
            copy: 'Согласуем геометрию створок, опоры и запас под приводы еще до изготовления.',
            points: ['Каркас', 'Столбы', 'Заполнение']
        },
        'catalog-panel-wicket': {
            eyebrow: 'Калитки',
            title: 'Соберем калитку в одном стиле с фасадом',
            copy: 'Подскажем по размеру прохода, замку и посадке в линию забора или ворот.',
            points: ['Проход', 'Замок', 'Цвет']
        },
        'catalog-panel-fence-profnastil': {
            eyebrow: 'Профнастил',
            title: 'Подберем забор под длину и высоту участка',
            copy: 'Сразу подскажем по каркасу, цвету и тому, как собрать забор с воротами и калиткой в один комплект.',
            points: ['Высота', 'Каркас', 'Цвет']
        },
        'catalog-panel-fence-siding': {
            eyebrow: 'Металлосайдинг',
            title: 'Поможем собрать фасадный забор без лишней тяжести',
            copy: 'Разберем внешний вид, цвет и связку с воротами, чтобы фасад участка смотрелся цельно.',
            points: ['Фактура', 'Цвет', 'Ворота в тон']
        },
        'catalog-panel-fence-picket': {
            eyebrow: 'Штакетник',
            title: 'Подберем штакетник по приватности и ритму фасада',
            copy: 'Подскажем по шагу планок, шахматке и высоте, чтобы забор выглядел аккуратно и работал на задачу.',
            points: ['Шаг планок', 'Шахматка', 'Высота']
        },
        'catalog-panel-fence-louver': {
            eyebrow: 'Жалюзи',
            title: 'Соберем жалюзи под обзор, вентиляцию и приватность',
            copy: 'Покажем, как подобрать угол ламелей и силуэт секций под архитектуру участка.',
            points: ['Угол ламелей', 'Приватность', 'Фасад']
        },
        'catalog-panel-sectional': {
            eyebrow: 'Секционные',
            title: 'Подберем секционные ворота под ваш гараж',
            copy: 'Проверим проем, теплоизоляцию и удобство автоматики, чтобы система встала без переделок.',
            points: ['Проем', 'Тепло', 'Привод']
        },
        'catalog-panel-roller': {
            eyebrow: 'Рольворота',
            title: 'Подскажем, когда рольворота действительно лучше',
            copy: 'Разберем место под короб, формат управления и ограничения проема до расчета.',
            points: ['Короб', 'Управление', 'Проем']
        },
        'catalog-panel-shutters': {
            eyebrow: 'Рольставни',
            title: 'Подберем рольставни под размер и уровень защиты',
            copy: 'Подскажем по профилю, типу управления и установке на уже готовый проем.',
            points: ['Проем', 'Профиль', 'Управление']
        },
        'catalog-panel-grilles': {
            eyebrow: 'Раздвижные решетки',
            title: 'Подскажем по защите проема без лишнего утяжеления',
            copy: 'Согласуем монтаж, запирание и покрытие, чтобы решетка была удобной и надежной.',
            points: ['Монтаж', 'Замок', 'Покраска']
        },
        'catalog-panel-automation-sliding': {
            eyebrow: 'Автоматика для откатных',
            title: 'Подберем привод для откатных ворот без перегруза',
            copy: 'Смотрим на вес створки, интенсивность работы и комплект безопасности, чтобы автоматика не была впритык.',
            points: ['Вес створки', 'Интенсивность', 'Комплект']
        },
        'catalog-panel-automation-swing': {
            eyebrow: 'Автоматика для распашных',
            title: 'Подберем автоматику под ваши распашные створки',
            copy: 'Учитываем длину створки, геометрию столбов и сценарий открывания до выбора привода.',
            points: ['Длина створки', 'Столбы', 'Приводы']
        },
        'catalog-panel-automation-components': {
            eyebrow: 'Комплектующие',
            title: 'Поможем подобрать совместимые комплектующие',
            copy: 'Подскажем по наличию, совместимости и подбору под уже установленную автоматику без лишних покупок.',
            points: ['Совместимость', 'Наличие', 'Подбор']
        }
    };

    let deferredCatalogPanelsPromise = null;

    const setCatalogLoadingState = (isLoading) => {
        if (catalogLayout) {
            catalogLayout.dataset.catalogLoading = String(isLoading);
        }

        if (catalogContent) {
            if (isLoading) {
                catalogContent.setAttribute('aria-busy', 'true');
            } else {
                catalogContent.removeAttribute('aria-busy');
            }
        }
    };

    async function loadDeferredCatalogPanels() {
        if (!catalogContent || catalogContent.dataset.catalogPanelsLoaded === 'true') {
            return true;
        }

        const source = catalogContent.getAttribute('data-catalog-panels-source');
        if (!source) {
            catalogContent.dataset.catalogPanelsLoaded = 'true';
            return true;
        }

        delete catalogContent.dataset.catalogPanelsLoadError;
        setCatalogLoadingState(true);

        try {
            const response = await fetch(source, { cache: 'default' });
            if (!response.ok) {
                throw new Error(`Failed to load catalog panels: ${response.status}`);
            }

            const markup = await response.text();
            if (markup.trim()) {
                catalogContent.insertAdjacentHTML('beforeend', markup);
            }

            catalogContent.dataset.catalogPanelsLoaded = 'true';
            return true;
        } catch (error) {
            console.error(error);
            catalogContent.dataset.catalogPanelsLoadError = 'true';
            return false;
        } finally {
            setCatalogLoadingState(false);
        }
    }

    const initializeCatalogGalleries = (root = document) => {
        root.querySelectorAll('[data-catalog-gallery]').forEach((gallery) => {
            if (gallery.dataset.catalogGalleryReady === 'true') {
                return;
            }

            const mainFrame = gallery.querySelector('.catalog-panel__media-frame');
            const mainLink = gallery.querySelector('[data-gallery-main-link]');
            const mainImage = gallery.querySelector('[data-gallery-main-image]');
            const prevBtn = gallery.querySelector('.catalog-panel__media-nav--prev');
            const nextBtn = gallery.querySelector('.catalog-panel__media-nav--next');
            const thumbsWrap = gallery.querySelector('.catalog-panel__media-thumbs');
            const defaultFitMode = gallery.dataset.galleryFitDefault?.trim() || 'cover';
            const defaultObjectPosition = gallery.dataset.galleryPosition?.trim() || 'center center';

            const getThumbs = () => Array.from(gallery.querySelectorAll('.catalog-panel__media-thumb')).filter((thumb) => !thumb.hidden);

            if (!mainLink || !mainImage || !getThumbs().length) {
                return;
            }

            const preloadImage = (src) => {
                if (!src) {
                    return Promise.resolve(null);
                }

                return new Promise((resolve) => {
                    const image = new Image();
                    image.decoding = 'async';
                    image.src = src;

                    const finish = () => resolve(image);

                    if (typeof image.decode === 'function') {
                        image.decode().then(finish).catch(finish);
                        return;
                    }

                    image.onload = finish;
                    image.onerror = finish;
                });
            };

            const sameImageSource = (candidate, current) => {
                if (!candidate || !current) {
                    return false;
                }

                try {
                    return new URL(candidate, window.location.href).href === new URL(current, window.location.href).href;
                } catch (error) {
                    return candidate === current;
                }
            };

            const resolveGalleryFit = (thumb) => {
                const explicitFit = thumb?.dataset.galleryFit?.trim() || gallery.dataset.galleryFit?.trim() || '';
                if (explicitFit === 'contain' || explicitFit === 'cover' || explicitFit === 'scheme') {
                    return explicitFit;
                }

                return defaultFitMode;
            };

            const resolveGalleryPosition = (thumb) => {
                return thumb?.dataset.galleryPosition?.trim() || gallery.dataset.galleryPosition?.trim() || defaultObjectPosition;
            };

            let activeIndex = getThumbs().findIndex((thumb) => thumb.classList.contains('is-active'));
            if (activeIndex < 0) {
                activeIndex = 0;
                getThumbs()[0]?.classList.add('is-active');
            }

            const hasSingleThumb = getThumbs().length === 1;
            gallery.classList.toggle('catalog-panel__media-gallery--single', hasSingleThumb);

            if (hasSingleThumb) {
                if (prevBtn) {
                    prevBtn.style.display = 'none';
                }

                if (nextBtn) {
                    nextBtn.style.display = 'none';
                }
            }

            const syncGallery = async (index) => {
                const thumbs = getThumbs();
                const thumb = thumbs[index];
                if (!thumb) {
                    return;
                }

                const src = thumb.dataset.gallerySrc;
                const alt = thumb.dataset.galleryAlt || '';
                const title = thumb.dataset.galleryTitle || alt || '';

                if (!src) {
                    return;
                }

                const width = Number(thumb.dataset.galleryWidth || thumb.querySelector('img')?.getAttribute('width') || mainImage.width || 0);
                const height = Number(thumb.dataset.galleryHeight || thumb.querySelector('img')?.getAttribute('height') || mainImage.height || 0);
                const fitMode = resolveGalleryFit(thumb);
                const objectPosition = resolveGalleryPosition(thumb);

                activeIndex = index;

                if (!sameImageSource(src, mainImage.currentSrc || mainImage.getAttribute('src'))) {
                    await preloadImage(src);
                }

                activeIndex = index;
                mainLink.href = src;
                mainLink.title = title;
                mainLink.classList.toggle('catalog-panel__media--contain', fitMode === 'contain' || fitMode === 'scheme');
                mainLink.classList.toggle('catalog-panel__media--scheme', fitMode === 'scheme');
                if (mainFrame) {
                    mainFrame.classList.toggle('catalog-panel__media-frame--contain', fitMode === 'contain' || fitMode === 'scheme');
                    mainFrame.classList.toggle('catalog-panel__media-frame--scheme', fitMode === 'scheme');
                    mainFrame.style.setProperty('--catalog-media-frame-image', `url(${JSON.stringify(src)})`);
                }
                mainImage.src = src;
                mainImage.alt = alt;
                mainImage.style.objectPosition = objectPosition;

                if (width && height) {
                    mainImage.width = width;
                    mainImage.height = height;
                }

                thumbs.forEach((item, itemIndex) => {
                    item.classList.toggle('is-active', itemIndex === activeIndex);
                });

                thumb.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            };

            gallery.addEventListener('click', (event) => {
                const thumb = event.target.closest('.catalog-panel__media-thumb');
                if (!thumb || !gallery.contains(thumb) || thumb.hidden) {
                    return;
                }

                const thumbs = getThumbs();
                void syncGallery(thumbs.indexOf(thumb));
            });

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    const thumbs = getThumbs();
                    const nextIndex = (activeIndex - 1 + thumbs.length) % thumbs.length;
                    void syncGallery(nextIndex);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const thumbs = getThumbs();
                    const nextIndex = (activeIndex + 1) % thumbs.length;
                    void syncGallery(nextIndex);
                });
            }

            mainLink.addEventListener('click', (event) => {
                const lightboxApi = window.PokraskaLightbox;
                const thumbs = getThumbs();
                if (!lightboxApi || typeof lightboxApi.openGroup !== 'function' || !thumbs.length) {
                    return;
                }

                event.preventDefault();

                lightboxApi.openGroup(
                    thumbs.map((thumb) => ({
                        href: thumb.dataset.gallerySrc,
                        alt: thumb.dataset.galleryAlt || '',
                        title: thumb.dataset.galleryTitle || thumb.dataset.galleryAlt || ''
                    })).filter((item) => item.href),
                    activeIndex,
                    mainLink
                );
            });

            syncGallery(activeIndex);
            gallery.dataset.catalogGalleryReady = 'true';
        });
    };

    const createCatalogBreadcrumbs = (breadcrumbsText) => {
        const segments = breadcrumbsText
            .split('/')
            .map((segment) => segment.trim())
            .filter(Boolean);

        if (!segments.length) {
            return null;
        }

        const inlineBreadcrumbs = document.createElement('div');
        inlineBreadcrumbs.className = 'catalog-panel__inline-breadcrumbs';
        inlineBreadcrumbs.setAttribute('aria-label', breadcrumbsText);
        inlineBreadcrumbs.dataset.sourceText = breadcrumbsText;

        if (segments.length > 3) {
            inlineBreadcrumbs.dataset.breadcrumbCompact = 'true';
        }

        segments.forEach((segment, index) => {
            const segmentNode = document.createElement('span');
            segmentNode.className = 'catalog-panel__inline-breadcrumb-segment';

            if (index === 0) {
                segmentNode.classList.add('is-root');
            }

            if (index === segments.length - 2) {
                segmentNode.classList.add('is-parent');
            }

            if (index === segments.length - 1) {
                segmentNode.classList.add('is-leaf');
            }

            segmentNode.textContent = segment;
            inlineBreadcrumbs.appendChild(segmentNode);

            if (index < segments.length - 1) {
                const separatorNode = document.createElement('span');
                separatorNode.className = 'catalog-panel__inline-breadcrumb-separator';

                if (index === 0) {
                    separatorNode.classList.add('is-root-separator');
                }

                separatorNode.textContent = '/';
                inlineBreadcrumbs.appendChild(separatorNode);
            }
        });

        return inlineBreadcrumbs;
    };

    const decorateCatalogPanels = (root = document) => {
        root.querySelectorAll('[data-catalog-panel]').forEach((panel) => {
            const panelGrid = panel.querySelector(':scope > .catalog-panel__grid');
            if (panelGrid) {
                panelGrid.classList.remove('catalog-panel__grid--single-visual', 'catalog-panel__grid--gallery-rich');

                const gallery = panelGrid.querySelector(':scope > .catalog-panel__media-gallery');
                const thumbsCount = gallery ? gallery.querySelectorAll('.catalog-panel__media-thumb').length : 0;

                if (thumbsCount <= 1) {
                    panelGrid.classList.add('catalog-panel__grid--single-visual');
                }

                if (thumbsCount >= 3) {
                    panelGrid.classList.add('catalog-panel__grid--gallery-rich');
                }
            }

            panel.querySelectorAll(':scope > .catalog-info-grid').forEach((infoGrid) => {
                const cards = Array.from(infoGrid.children).filter((child) => child.classList.contains('catalog-info-card'));

                infoGrid.classList.remove(
                    'catalog-info-grid--single',
                    'catalog-info-grid--duo',
                    'catalog-info-grid--trio',
                    'catalog-info-grid--quad',
                    'catalog-info-grid--split'
                );

                cards.forEach((card) => {
                    card.classList.remove('catalog-info-card--emphasis');
                });

                if (cards.length === 1) {
                    infoGrid.classList.add('catalog-info-grid--single');
                } else if (cards.length === 2) {
                    infoGrid.classList.add('catalog-info-grid--duo');
                } else if (cards.length === 4) {
                    infoGrid.classList.add('catalog-info-grid--quad');
                } else if (cards.length >= 3) {
                    infoGrid.classList.add('catalog-info-grid--trio');
                }

                if (cards.length === 3) {
                    const cardWeights = cards.map((card) => {
                        const listWeight = card.querySelectorAll('li').length * 2;
                        const paragraphWeight = Array.from(card.querySelectorAll('p')).reduce((total, paragraph) => {
                            const textLength = paragraph.textContent.trim().length;
                            return total + Math.max(1, Math.round(textLength / 110));
                        }, 0);
                        const headingWeight = Array.from(card.querySelectorAll('h3, h4')).reduce((total, heading) => {
                            return total + (heading.textContent.trim().length > 28 ? 1 : 0);
                        }, 0);

                        return listWeight + paragraphWeight + headingWeight;
                    });

                    const maxWeight = Math.max(...cardWeights);
                    const minWeight = Math.min(...cardWeights);

                    if (maxWeight - minWeight >= 3) {
                        infoGrid.classList.add('catalog-info-grid--split');
                        cards[cardWeights.indexOf(maxWeight)]?.classList.add('catalog-info-card--emphasis');
                    }
                }
            });
        });
    };

    const getRovingTabTarget = (tabs, currentTab, key) => {
        if (!tabs.length) {
            return null;
        }

        const currentIndex = Math.max(0, tabs.indexOf(currentTab));

        if (key === 'Home') {
            return tabs[0];
        }

        if (key === 'End') {
            return tabs[tabs.length - 1];
        }

        if (key === 'ArrowRight' || key === 'ArrowDown') {
            return tabs[(currentIndex + 1) % tabs.length];
        }

        if (key === 'ArrowLeft' || key === 'ArrowUp') {
            return tabs[(currentIndex - 1 + tabs.length) % tabs.length];
        }

        return null;
    };

    initializeCatalogGalleries(document);
    decorateCatalogPanels(document);

    const catalogTabs = () => Array.from(document.querySelectorAll('[data-catalog-tab]'));
    const catalogPanels = () => Array.from(document.querySelectorAll('[data-catalog-panel]'));
    const catalogGroupTabs = Array.from(document.querySelectorAll('[data-catalog-group]'));
    const catalogGroupPanels = Array.from(document.querySelectorAll('[data-catalog-group-panel]'));

    if (catalogTabs().length && catalogPanels().length) {
        const lastActiveTabByGroup = new Map();
        let catalogBreadcrumbSyncFrame = null;
        let catalogGroupPanelsHeightFrame = null;

        const getCatalogBreadcrumbText = (panel) => {
            if (!panel) {
                return '';
            }

            const fullBreadcrumbs = panel.dataset.catalogBreadcrumb?.trim() || '';
            const shortBreadcrumbs = panel.dataset.catalogBreadcrumbShort?.trim() || '';

            if (window.innerWidth <= 640 && shortBreadcrumbs) {
                return shortBreadcrumbs;
            }

            return fullBreadcrumbs;
        };

        const getCatalogTitleText = (panel, fallbackTitle = '') => {
            if (!panel) {
                return fallbackTitle;
            }

            const shortTitle = panel.dataset.catalogTitleShort?.trim() || '';
            if (window.innerWidth <= 640 && shortTitle) {
                return shortTitle;
            }

            return fallbackTitle || panel.dataset.catalogTitle?.trim() || '';
        };

        const getCatalogTabLabelText = (tab, fallbackLabel = '') => {
            if (!tab) {
                return fallbackLabel;
            }

            const shortLabel = tab.dataset.catalogTabShort?.trim() || '';
            if (window.innerWidth <= 640 && shortLabel) {
                return shortLabel;
            }

            return fallbackLabel;
        };

        const getCatalogGroupDescription = (groupId) => {
            const groupTab = getCatalogGroupTab(groupId);
            return groupTab?.dataset.catalogGroupDescription?.trim() || '';
        };

        const getCatalogGroupIntroTitle = (groupId) => {
            const groupTab = getCatalogGroupTab(groupId);
            return groupTab?.dataset.catalogGroupIntroTitle?.trim() || getCatalogGroupTitle(groupId);
        };

        const getCatalogGroupIntroCopy = (groupId) => {
            const groupTab = getCatalogGroupTab(groupId);
            return groupTab?.dataset.catalogGroupIntroCopy?.trim() || getCatalogGroupDescription(groupId);
        };

        const getCatalogTabDescription = (tab) => {
            if (!tab) {
                return '';
            }

            return tab.dataset.catalogTabDescription?.trim() || '';
        };

        const syncCatalogFaqSchema = (faqContent) => {
            if (!catalogFaqSchema || !faqContent?.items?.length) {
                return;
            }

            const schema = {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqContent.items.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.answer
                    }
                }))
            };

            catalogFaqSchema.textContent = JSON.stringify(schema, null, 4);
        };

        const syncCatalogFaq = (panelId) => {
            if (!catalogFaqTitle || !catalogFaqCopy || !catalogFaqList) {
                return;
            }

            const faqContent = catalogFaqContent[panelId] || catalogFaqContent.default;
            catalogFaqTitle.textContent = faqContent.title;
            catalogFaqCopy.textContent = faqContent.copy;

            const fragment = document.createDocumentFragment();
            faqContent.items.forEach((item) => {
                const details = document.createElement('details');
                details.className = 'faq-item';

                const summary = document.createElement('summary');
                summary.className = 'faq-question';
                summary.textContent = item.question;

                const answerWrap = document.createElement('div');
                answerWrap.className = 'faq-answer';

                const answerText = document.createElement('p');
                answerText.textContent = item.answer;

                answerWrap.appendChild(answerText);
                details.appendChild(summary);
                details.appendChild(answerWrap);
                fragment.appendChild(details);
            });

            catalogFaqList.replaceChildren(fragment);
            syncCatalogFaqSchema(faqContent);
        };
        let catalogAssistantRefreshTimeout = null;

        const animateCatalogAssistant = () => {
            if (!catalogAssistant) {
                return;
            }

            catalogAssistant.classList.remove('is-refreshing');
            void catalogAssistant.offsetWidth;
            catalogAssistant.classList.add('is-refreshing');

            window.clearTimeout(catalogAssistantRefreshTimeout);
            catalogAssistantRefreshTimeout = window.setTimeout(() => {
                catalogAssistant.classList.remove('is-refreshing');
            }, 440);
        };

        const syncCatalogAssistant = (panelId, shouldAnimate = true) => {
            if (!catalogAssistant || !catalogAssistantEyebrow || !catalogAssistantTitle || !catalogAssistantCopy || !catalogAssistantPoints) {
                return;
            }

            const assistantContent = catalogAssistantContent[panelId] || catalogAssistantContent.default;
            catalogAssistantEyebrow.textContent = assistantContent.eyebrow;
            catalogAssistantTitle.textContent = assistantContent.title;
            catalogAssistantCopy.textContent = assistantContent.copy;

            const fragment = document.createDocumentFragment();
            assistantContent.points.forEach((point) => {
                const item = document.createElement('span');
                item.textContent = point;
                fragment.appendChild(item);
            });

            catalogAssistantPoints.replaceChildren(fragment);

            if (catalogAssistantPrimary) {
                const targetPanel = panelId ? document.getElementById(panelId) : null;
                catalogAssistantPrimary.setAttribute('href', targetPanel ? `#${panelId}` : '#catalog-categories');
            }

            if (catalogAssistantSecondary) {
                const activeGroupTab = catalogGroupTabs.find((tab) => tab.classList.contains('is-active')) || catalogGroupTabs[0];
                const groupTargetId = activeGroupTab?.id || 'catalog-categories';
                catalogAssistantSecondary.setAttribute('href', `#${groupTargetId}`);
            }

            if (shouldAnimate) {
                animateCatalogAssistant();
            }
        };

        const syncCatalogNavIntro = () => {
            if (!catalogNavIntroTitle || !catalogNavIntroCopy) {
                return;
            }

            const activeGroupTab = catalogGroupTabs.find((tab) => tab.classList.contains('is-active')) || catalogGroupTabs[0];
            const activeGroupId = activeGroupTab?.dataset.catalogGroup || '';

            catalogNavIntroTitle.textContent = getCatalogGroupIntroTitle(activeGroupId);
            catalogNavIntroCopy.textContent = getCatalogGroupIntroCopy(activeGroupId);
        };

        const embedCatalogPanelHeaders = () => {
            catalogPanels().forEach((panel) => {
                if (panel.dataset.inlineHeaderReady === 'true') {
                    return;
                }

                const panelGrid = panel.querySelector(':scope > .catalog-panel__grid');
                const firstTextBlock = panelGrid?.querySelector('.catalog-panel__text');
                const introSectionHeading = panel.querySelector(':scope > .catalog-panel__section-heading');
                let breadcrumbsText = getCatalogBreadcrumbText(panel);
                let titleText = getCatalogTitleText(panel);

                if (!breadcrumbsText || !titleText) {
                    const panelHeader = panel.querySelector(':scope > .catalog-panel__header');
                    breadcrumbsText ||= panelHeader?.querySelector('.catalog-breadcrumbs')?.textContent?.trim() || '';
                    titleText ||= panelHeader?.querySelector('h2')?.textContent?.trim() || '';
                }

                if ((!firstTextBlock && !introSectionHeading) || (!breadcrumbsText && !titleText)) {
                    return;
                }

                if (firstTextBlock) {
                    const inlineHeader = document.createElement('div');
                    inlineHeader.className = 'catalog-panel__inline-header';

                    if (breadcrumbsText) {
                        const inlineBreadcrumbs = createCatalogBreadcrumbs(breadcrumbsText);
                        if (inlineBreadcrumbs) {
                            inlineHeader.appendChild(inlineBreadcrumbs);
                        }
                    }

                    if (titleText) {
                        const inlineTitle = document.createElement('h2');
                        inlineTitle.className = 'catalog-panel__inline-title';
                        inlineTitle.textContent = titleText;
                        inlineHeader.appendChild(inlineTitle);
                    }

                    if (inlineHeader.childNodes.length) {
                        firstTextBlock.prepend(inlineHeader);
                    }
                } else if (introSectionHeading) {
                    introSectionHeading.classList.add('catalog-panel__section-heading--intro');

                    const sectionTitle = introSectionHeading.querySelector('h3, h2');
                    if (sectionTitle) {
                        if (!sectionTitle.dataset.defaultTitle) {
                            sectionTitle.dataset.defaultTitle = sectionTitle.textContent.trim();
                        }

                        const resolvedTitle = getCatalogTitleText(panel, sectionTitle.dataset.defaultTitle);
                        if (resolvedTitle) {
                            sectionTitle.textContent = resolvedTitle;
                        }
                    }

                    if (breadcrumbsText && !introSectionHeading.querySelector('.catalog-panel__inline-breadcrumbs')) {
                        const inlineBreadcrumbs = createCatalogBreadcrumbs(breadcrumbsText);
                        if (inlineBreadcrumbs) {
                            introSectionHeading.prepend(inlineBreadcrumbs);
                        }
                    }
                }

                panel.dataset.inlineHeaderReady = 'true';
            });
        };

        const syncCatalogPanelBreadcrumbs = () => {
            catalogPanels().forEach((panel) => {
                const breadcrumbsText = getCatalogBreadcrumbText(panel);
                const currentBreadcrumbs = panel.querySelector(':scope .catalog-panel__inline-breadcrumbs');
                if (breadcrumbsText && currentBreadcrumbs && currentBreadcrumbs.dataset.sourceText !== breadcrumbsText) {
                    const replacementBreadcrumbs = createCatalogBreadcrumbs(breadcrumbsText);
                    if (replacementBreadcrumbs) {
                        currentBreadcrumbs.replaceWith(replacementBreadcrumbs);
                    }
                }

                const inlineTitle = panel.querySelector(':scope .catalog-panel__inline-title');
                if (inlineTitle) {
                    if (!inlineTitle.dataset.defaultTitle) {
                        inlineTitle.dataset.defaultTitle = inlineTitle.textContent.trim();
                    }

                    const resolvedTitle = getCatalogTitleText(panel, inlineTitle.dataset.defaultTitle);
                    if (resolvedTitle) {
                        inlineTitle.textContent = resolvedTitle;
                    }
                }

                const sectionTitle = panel.querySelector(':scope > .catalog-panel__section-heading h3, :scope > .catalog-panel__section-heading h2');
                if (sectionTitle) {
                    if (!sectionTitle.dataset.defaultTitle) {
                        sectionTitle.dataset.defaultTitle = sectionTitle.textContent.trim();
                    }

                    const resolvedTitle = getCatalogTitleText(panel, sectionTitle.dataset.defaultTitle);
                    if (resolvedTitle) {
                        sectionTitle.textContent = resolvedTitle;
                    }
                }
            });
        };

        const syncCatalogTabLabels = () => {
            catalogTabs().forEach((tab) => {
                const titleNode = tab.querySelector('.catalog-link__title');
                if (!tab.dataset.defaultLabel) {
                    tab.dataset.defaultLabel = (titleNode ? titleNode.textContent : tab.textContent).trim();
                }

                const resolvedLabel = getCatalogTabLabelText(tab, tab.dataset.defaultLabel);
                if (resolvedLabel) {
                    if (titleNode) {
                        titleNode.textContent = resolvedLabel;
                    } else {
                        tab.textContent = resolvedLabel;
                    }
                }
            });
        };

        const syncCatalogGroupPanelsHeight = () => {
            const groupPanelsWrap = document.querySelector('.catalog-group-panels');
            if (!groupPanelsWrap || !catalogGroupPanels.length) {
                return;
            }

            let maxHeight = 0;

            catalogGroupPanels.forEach((groupPanel) => {
                const linksWrap = groupPanel.querySelector(':scope > .catalog-group-panel__links');
                if (!linksWrap) {
                    return;
                }

                const wasHidden = groupPanel.hidden;
                const previousStyle = {
                    position: groupPanel.style.position,
                    visibility: groupPanel.style.visibility,
                    pointerEvents: groupPanel.style.pointerEvents,
                    inset: groupPanel.style.inset,
                    display: groupPanel.style.display
                };

                if (wasHidden) {
                    groupPanel.hidden = false;
                    groupPanel.style.position = 'absolute';
                    groupPanel.style.visibility = 'hidden';
                    groupPanel.style.pointerEvents = 'none';
                    groupPanel.style.inset = '0';
                    groupPanel.style.display = 'block';
                }

                maxHeight = Math.max(maxHeight, Math.ceil(linksWrap.getBoundingClientRect().height));

                if (wasHidden) {
                    groupPanel.hidden = true;
                    groupPanel.style.position = previousStyle.position;
                    groupPanel.style.visibility = previousStyle.visibility;
                    groupPanel.style.pointerEvents = previousStyle.pointerEvents;
                    groupPanel.style.inset = previousStyle.inset;
                    groupPanel.style.display = previousStyle.display;
                }
            });

            groupPanelsWrap.style.minHeight = maxHeight ? `${maxHeight}px` : '';
        };

        const applyCatalogTabSemantics = () => {
            catalogGroupTabs.forEach((groupTab) => {
                const groupId = groupTab.dataset.catalogGroup;
                const groupPanel = getCatalogGroupPanel(groupId);

                if (!groupTab.id) {
                    groupTab.id = `catalog-group-tab-${groupId}`;
                }

                groupTab.setAttribute('role', 'tab');
                groupTab.setAttribute('aria-haspopup', 'true');

                if (groupTab.dataset.catalogKeyboardReady !== 'true') {
                    groupTab.addEventListener('keydown', (event) => {
                        const nextTab = getRovingTabTarget(catalogGroupTabs, groupTab, event.key);
                        if (!nextTab || nextTab === groupTab) {
                            return;
                        }

                        event.preventDefault();
                        nextTab.focus();
                        nextTab.click();
                    });

                    groupTab.dataset.catalogKeyboardReady = 'true';
                }

                if (groupPanel) {
                    if (!groupPanel.id) {
                        groupPanel.id = `catalog-group-panel-${groupId}`;
                    }

                    groupTab.setAttribute('aria-controls', groupPanel.id);
                    groupPanel.setAttribute('role', 'tabpanel');
                    groupPanel.setAttribute('aria-labelledby', groupTab.id);

                    const linksWrap = groupPanel.querySelector(':scope > .catalog-group-panel__links');
                    if (linksWrap) {
                        linksWrap.setAttribute('role', 'tablist');
                        linksWrap.setAttribute('aria-label', `Разделы группы ${getCatalogGroupTitle(groupId)}`);
                    }
                }
            });

            catalogTabs().forEach((tab) => {
                const panelId = tab.dataset.catalogTab;
                const tabList = tab.closest('.catalog-group-panel__links');
                const panel = panelId ? document.getElementById(panelId) : null;

                if (!tab.id && panelId) {
                    tab.id = `catalog-tab-${panelId.replace(/^catalog-panel-/, '')}`;
                }

                tab.setAttribute('role', 'tab');
                if (panelId) {
                    tab.setAttribute('aria-controls', panelId);
                }

                if (tab.dataset.catalogKeyboardReady !== 'true') {
                    tab.addEventListener('keydown', (event) => {
                        const siblingTabs = tabList
                            ? Array.from(tabList.querySelectorAll('[data-catalog-tab]'))
                            : catalogTabs();
                        const nextTab = getRovingTabTarget(siblingTabs, tab, event.key);
                        if (!nextTab || nextTab === tab) {
                            return;
                        }

                        event.preventDefault();
                        nextTab.focus();
                        nextTab.click();
                    });

                    tab.dataset.catalogKeyboardReady = 'true';
                }

                if (panel && tab.id) {
                    panel.setAttribute('role', 'tabpanel');
                    panel.setAttribute('aria-labelledby', tab.id);
                }
            });
        };

        const ensureDeferredCatalogPanels = async () => {
            if (!catalogContent || catalogContent.dataset.catalogPanelsLoaded === 'true') {
                return true;
            }

            if (!deferredCatalogPanelsPromise) {
                deferredCatalogPanelsPromise = loadDeferredCatalogPanels().then((result) => {
                    if (result) {
                        embedCatalogPanelHeaders();
                        initializeCatalogGalleries(catalogContent);
                        decorateCatalogPanels(catalogContent);
                        applyCatalogTabSemantics();
                    }

                    return result;
                }).finally(() => {
                    deferredCatalogPanelsPromise = null;
                });
            }

            return deferredCatalogPanelsPromise;
        };

        const getCatalogGroupTab = (groupId) => Array.from(catalogGroupTabs).find((tab) => tab.dataset.catalogGroup === groupId);
        const getCatalogGroupPanel = (groupId) => Array.from(catalogGroupPanels).find((panel) => panel.dataset.catalogGroupPanel === groupId);

        const getCatalogGroupTitle = (groupId) => {
            const groupTab = getCatalogGroupTab(groupId);
            if (!groupTab) {
                return '';
            }

            const titleElement = groupTab.querySelector('.catalog-group-tab__title');
            return (titleElement ? titleElement.textContent : groupTab.textContent).trim();
        };

        const getCatalogHashState = (hashValue = window.location.hash) => {
            const hashId = hashValue ? hashValue.replace('#', '') : '';
            if (!hashId) {
                return null;
            }

            const targetElement = document.getElementById(hashId);
            if (!targetElement) {
                return null;
            }

            const directTab = catalogTabs().find((tab) => tab.dataset.catalogTab === hashId);
            if (directTab) {
                return { panelId: hashId, targetElement };
            }

            const parentPanel = targetElement.closest('[data-catalog-panel]');
            if (parentPanel) {
                return { panelId: parentPanel.id, targetElement };
            }

            return null;
        };

        const getCatalogScrollOffset = () => {
            const headerHeight = header ? header.offsetHeight : 140;
            const extraClearance = window.innerWidth <= 640 ? 34 : 22;
            return headerHeight + extraClearance;
        };

        const scrollCatalogTarget = (targetElement, smooth = true) => {
            if (!targetElement) {
                return;
            }

            window.scrollTo({
                top: targetElement.getBoundingClientRect().top + window.scrollY - getCatalogScrollOffset(),
                behavior: smooth ? 'smooth' : 'auto'
            });
        };

        const catalogTargetNeedsScroll = (targetElement, mode = 'both') => {
            if (!targetElement) {
                return false;
            }

            const rect = targetElement.getBoundingClientRect();
            const topBoundary = getCatalogScrollOffset() + 8;
            if (mode === 'up') {
                return rect.top < topBoundary;
            }

            const bottomBoundary = window.innerHeight - (window.innerWidth <= 640 ? 88 : 120);
            return rect.top < topBoundary || rect.top > bottomBoundary;
        };

        const activateCatalogGroup = (groupId) => {
            if (!catalogGroupTabs.length || !catalogGroupPanels.length) {
                return;
            }

            if (catalogLayout) {
                catalogLayout.dataset.activeGroup = groupId;
            }

            catalogGroupTabs.forEach((groupTab) => {
                const isActive = groupTab.dataset.catalogGroup === groupId;
                groupTab.classList.toggle('is-active', isActive);
                groupTab.setAttribute('aria-expanded', String(isActive));
                groupTab.setAttribute('aria-selected', String(isActive));
                groupTab.tabIndex = isActive ? 0 : -1;
            });

            catalogGroupPanels.forEach((groupPanel) => {
                const isActive = groupPanel.dataset.catalogGroupPanel === groupId;
                groupPanel.classList.toggle('is-active', isActive);
                groupPanel.hidden = !isActive;
                groupPanel.setAttribute('aria-hidden', String(!isActive));
                groupPanel.style.removeProperty('display');
            });

            syncCatalogGroupPanelsHeight();
            syncCatalogNavIntro();
        };

        const activateCatalogTab = (panelId, options = {}) => {
            const { animateAssistant = true } = options;

            catalogTabs().forEach((tab) => {
                const isActive = tab.dataset.catalogTab === panelId;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', String(isActive));
                tab.tabIndex = isActive ? 0 : -1;
            });

            catalogPanels().forEach((panel) => {
                const isActive = panel.id === panelId;
                panel.classList.toggle('is-active', isActive);
                panel.hidden = !isActive;
                panel.setAttribute('aria-hidden', String(!isActive));
            });

            const activeTab = catalogTabs().find((tab) => tab.dataset.catalogTab === panelId);
            const groupPanel = activeTab ? activeTab.closest('[data-catalog-group-panel]') : null;
            if (groupPanel) {
                lastActiveTabByGroup.set(groupPanel.dataset.catalogGroupPanel, panelId);
                activateCatalogGroup(groupPanel.dataset.catalogGroupPanel);
            }

            syncCatalogFaq(panelId);
            syncCatalogAssistant(panelId, animateAssistant);
        };

        catalogGroupTabs.forEach((groupTab) => {
            groupTab.addEventListener('click', async () => {
                const groupId = groupTab.dataset.catalogGroup;
                const groupPanel = getCatalogGroupPanel(groupId);
                const groupTabsList = groupPanel ? Array.from(groupPanel.querySelectorAll('[data-catalog-tab]')) : [];
                const rememberedPanelId = lastActiveTabByGroup.get(groupId);
                const targetTab =
                    groupTabsList.find((tab) => tab.dataset.catalogTab === rememberedPanelId) ||
                    groupTabsList[0];

                if (targetTab) {
                    if (!document.getElementById(targetTab.dataset.catalogTab)) {
                        const loaded = await ensureDeferredCatalogPanels();
                        if (!loaded) {
                            return;
                        }
                    }

                    activateCatalogTab(targetTab.dataset.catalogTab);
                    history.replaceState(null, '', `#${targetTab.dataset.catalogTab}`);
                    requestAnimationFrame(() => {
                        const targetPanel = document.getElementById(targetTab.dataset.catalogTab);
                        if (targetPanel && catalogTargetNeedsScroll(targetPanel, 'up')) {
                            scrollCatalogTarget(targetPanel, true);
                        }
                    });
                } else {
                    activateCatalogGroup(groupId);
                }
            });
        });

        catalogTabs().forEach((tab) => {
            tab.addEventListener('click', async () => {
                if (!document.getElementById(tab.dataset.catalogTab)) {
                    const loaded = await ensureDeferredCatalogPanels();
                    if (!loaded) {
                        return;
                    }
                }

                activateCatalogTab(tab.dataset.catalogTab);
                const panelId = tab.dataset.catalogTab;
                if (panelId) {
                    history.replaceState(null, '', `#${panelId}`);
                    requestAnimationFrame(() => {
                        const targetPanel = document.getElementById(panelId);
                        if (targetPanel) {
                            if (catalogTargetNeedsScroll(targetPanel, 'up')) {
                                scrollCatalogTarget(targetPanel, true);
                            }
                        }
                    });
                }
            });
        });

        const initialHashId = window.location.hash ? window.location.hash.replace('#', '') : '';
        const initialHashNeedsDeferredLoad =
            initialHashId &&
            !document.getElementById(initialHashId) &&
            catalogTabs().some((tab) => tab.dataset.catalogTab === initialHashId);

        if (initialHashNeedsDeferredLoad) {
            await ensureDeferredCatalogPanels();
        }

        embedCatalogPanelHeaders();
        applyCatalogTabSemantics();
        initializeCatalogGalleries(document);
        decorateCatalogPanels(document);
        syncCatalogTabLabels();
        syncCatalogGroupPanelsHeight();

        const hashState = getCatalogHashState();
        let initialTab = document.querySelector('.catalog-link.is-active') || catalogTabs()[0];
        if (hashState) {
            const hashTab = catalogTabs().find((tab) => tab.dataset.catalogTab === hashState.panelId);
            if (hashTab) {
                initialTab = hashTab;
            }
        }

        if (initialTab) {
            activateCatalogTab(initialTab.dataset.catalogTab, { animateAssistant: false });
        } else if (catalogGroupTabs.length) {
            activateCatalogGroup(catalogGroupTabs[0].dataset.catalogGroup);
        }

        if (hashState) {
            setTimeout(() => {
                scrollCatalogTarget(hashState.targetElement, false);
            }, 60);
        } else if (shouldResetCatalogScroll) {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'auto'
                });
            });
        }

        window.addEventListener('hashchange', async () => {
            const hashId = window.location.hash ? window.location.hash.replace('#', '') : '';
            if (hashId && !document.getElementById(hashId) && catalogTabs().some((tab) => tab.dataset.catalogTab === hashId)) {
                const loaded = await ensureDeferredCatalogPanels();
                if (!loaded) {
                    return;
                }
            }

            const currentHashState = getCatalogHashState();
            if (!currentHashState) {
                return;
            }

            activateCatalogTab(currentHashState.panelId);

            setTimeout(() => {
                if (catalogTargetNeedsScroll(currentHashState.targetElement)) {
                    scrollCatalogTarget(currentHashState.targetElement, true);
                }
            }, 60);
        });

        window.addEventListener('resize', () => {
            if (catalogBreadcrumbSyncFrame) {
                cancelAnimationFrame(catalogBreadcrumbSyncFrame);
            }

            if (catalogGroupPanelsHeightFrame) {
                cancelAnimationFrame(catalogGroupPanelsHeightFrame);
            }

            catalogBreadcrumbSyncFrame = requestAnimationFrame(() => {
                syncCatalogPanelBreadcrumbs();
                syncCatalogTabLabels();
                syncCatalogNavIntro();
                catalogBreadcrumbSyncFrame = null;
            });

            catalogGroupPanelsHeightFrame = requestAnimationFrame(() => {
                syncCatalogGroupPanelsHeight();
                catalogGroupPanelsHeightFrame = null;
            });
        });

        void ensureDeferredCatalogPanels();
    }

});
