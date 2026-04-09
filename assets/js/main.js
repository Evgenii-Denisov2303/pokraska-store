// ========== MAIN.JS ==========
document.addEventListener('DOMContentLoaded', function() {
    // 1. Простое мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;
    const header = document.querySelector('.header');
    const headerTop = document.querySelector('.header-top');
    let lastScrollY = window.scrollY;
    let isHeaderCollapsed = false;

    function isCompactViewport() {
        return window.innerWidth <= 768 || window.innerHeight <= 520;
    }

    function setHeaderHeight() {
        if (!headerTop && !header) return;
        const isMobile = isCompactViewport();
        const desktopHeroHeader = header ? header.querySelector('.desktop-hero-header') : null;
        const desktopHeaderTarget = desktopHeroHeader && header?.classList.contains('header--desktop-hero')
            ? desktopHeroHeader
            : (headerTop || header);
        const heightTarget = isMobile ? (header || headerTop) : desktopHeaderTarget;
        document.documentElement.style.setProperty('--header-height', `${heightTarget.offsetHeight}px`);
        if (headerTop) {
            document.documentElement.style.setProperty('--header-top-height', `${heightTarget.offsetHeight}px`);
        }
    }

    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

    if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(setHeaderHeight);
            });
        }).catch(() => {});
    }

    window.addEventListener('load', () => {
        requestAnimationFrame(setHeaderHeight);
    }, { once: true });

    function updateHeaderOnScroll() {
        if (!header || !headerTop) return;
        const isMobile = isCompactViewport();

        if (!isMobile) {
            if (isHeaderCollapsed) {
                isHeaderCollapsed = false;
                setHeaderHeight();
            }
            header.classList.remove('is-hidden');
            body.classList.remove('header-hidden');
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY;
            const nearTop = currentScrollY < 20;

            if (scrollingDown && currentScrollY > 120) {
                header.classList.add('is-hidden');
                body.classList.add('header-hidden');
            } else if (!scrollingDown || nearTop) {
                header.classList.remove('is-hidden');
                body.classList.remove('header-hidden');
            }

            lastScrollY = currentScrollY;
            return;
        }

        if (body.classList.contains('menu-open')) {
            header.classList.remove('is-hidden');
            body.classList.remove('header-hidden');
            lastScrollY = window.scrollY;
            return;
        }

        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY;
        const nearTop = currentScrollY < 20;

        if (scrollingDown && currentScrollY > 0) {
            if (!isHeaderCollapsed) {
                isHeaderCollapsed = true;
                setHeaderHeight();
            }
            header.classList.add('is-hidden');
            body.classList.add('header-hidden');
        } else if (!scrollingDown || nearTop) {
            if (isHeaderCollapsed) {
                isHeaderCollapsed = false;
                setHeaderHeight();
            }
            header.classList.remove('is-hidden');
            body.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    }

    if (mobileMenuBtn && nav) {
        const icon = mobileMenuBtn.querySelector('i');

        function toggleMenu(forceState) {
            const isOpen = typeof forceState === 'boolean' ? forceState : !nav.classList.contains('active');
            nav.classList.toggle('active', isOpen);
            body.classList.toggle('menu-open', isOpen);

            if (icon) {
                icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }
            mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

            // Обновляем высоту шапки после открытия/закрытия меню
            requestAnimationFrame(() => {
                setHeaderHeight();
            });
        }

        mobileMenuBtn.addEventListener('click', function() {
            setHeaderHeight();
            toggleMenu();
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') &&
                !nav.contains(e.target) &&
                e.target !== mobileMenuBtn &&
                !mobileMenuBtn.contains(e.target)) {

                toggleMenu(false);
            }
        });

        // Закрытие меню при ресайзе
        window.addEventListener('resize', () => {
            if (!isCompactViewport() && nav.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggleMenu(false);
                mobileMenuBtn.focus();
            }
        });
    }

    // 2. Плавная прокрутка
    document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href === '#!') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        const headerHeight = isCompactViewport()
            ? (header ? header.offsetHeight : (headerTop ? headerTop.offsetHeight : 100))
            : (headerTop ? headerTop.offsetHeight : (header ? header.offsetHeight : 100));
        const extraOffset = Number(target.dataset.scrollOffset || 0);
        window.scrollTo({
            top: target.offsetTop - headerHeight - extraOffset,
            behavior: 'smooth'
        });
    });

    // 3. Год в футере
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 3.1. Умный премиальный футер для внутренних страниц
    function renderPremiumFooter() {
        const footer = document.querySelector('footer.footer');
        if (!footer || footer.classList.contains('footer--premium')) return;

        const pathname = (window.location.pathname || '').toLowerCase();
        const fileName = pathname.split('/').pop() || 'index.html';
        if (fileName === 'index.html') return;

        const isInnerPage = pathname.includes('/pages/');
        const homeHref = isInnerPage ? '../index.html' : 'index.html';
        const policyHref = isInnerPage ? '../politika.html' : 'politika.html';
        const assetsPrefix = isInnerPage ? '../assets/' : 'assets/';
        const pageHref = (page) => (isInnerPage ? page : `pages/${page}`);

        function getFooterContext() {
            const defaultContext = {
                label: 'Полезное',
                items: [
                    { href: pageHref('services.html'), label: 'Каталог ворот и заборов' },
                    { href: pageHref('powder-coating.html'), label: 'Порошковая покраска' },
                    { href: pageHref('sandblasting.html'), label: 'Пескоструйная обработка' },
                    { href: pageHref('prices.html'), label: 'Цены и расчёт' },
                    { href: pageHref('contacts.html'), label: 'Контакты' }
                ]
            };

            if (fileName === 'services.html') {
                return {
                    label: 'Каталог и услуги',
                    items: [
                        { href: '#catalog-panel-sliding', label: 'Откатные ворота' },
                        { href: '#catalog-panel-swing', label: 'Распашные ворота' },
                        { href: '#catalog-panel-fence-profnastil', label: 'Заборы' },
                        { href: '#catalog-panel-automation-sliding', label: 'Автоматика' },
                        { href: homeHref + '#request-form', label: 'Оставить заявку' }
                    ]
                };
            }

            if (fileName === 'powder-coating.html') {
                return {
                    label: 'Разделы покраски',
                    items: [
                        { href: '#wheels', label: 'Штампованные диски' },
                        { href: '#metal', label: 'Металлоконструкции' },
                        { href: '#equipment', label: 'Крупногабаритные изделия' },
                        { href: '#interior', label: 'Интерьер и декор' },
                        { href: homeHref + '#request-form', label: 'Получить расчёт' }
                    ]
                };
            }

            if (fileName === 'sandblasting.html') {
                return {
                    label: 'Разделы пескоструя',
                    items: [
                        { href: '#metal', label: 'Металлоконструкции' },
                        { href: '#rust', label: 'Удаление ржавчины' },
                        { href: '#prep', label: 'Подготовка под покраску' },
                        { href: '#decor', label: 'Матирование стекла' },
                        { href: homeHref + '#request-form', label: 'Оставить заявку' }
                    ]
                };
            }

            if (fileName === 'prices.html') {
                return {
                    label: 'Расчёт и стоимость',
                    items: [
                        { href: '#prices-faq-title', label: 'Частые вопросы о цене' },
                        { href: homeHref + '#request-form', label: 'Получить расчёт' },
                        { href: pageHref('services.html'), label: 'Каталог ворот и заборов' },
                        { href: pageHref('payment-documents.html'), label: 'Оплата и документы' },
                        { href: pageHref('contacts.html'), label: 'Консультация' }
                    ]
                };
            }

            if (fileName === 'gallery.html') {
                return {
                    label: 'Что посмотреть',
                    items: [
                        { href: pageHref('services.html'), label: 'Каталог ворот и заборов' },
                        { href: pageHref('powder-coating.html'), label: 'Порошковая покраска' },
                        { href: pageHref('sandblasting.html'), label: 'Пескоструйная обработка' },
                        { href: pageHref('prices.html'), label: 'Цены и расчёт' },
                        { href: homeHref + '#request-form', label: 'Оставить заявку' }
                    ]
                };
            }

            if (fileName === 'contacts.html') {
                return {
                    label: 'Быстрые действия',
                    items: [
                        { href: 'tel:+79376154629', label: 'Позвонить менеджеру' },
                        { href: 'https://t.me/+79625542260', label: 'Написать в Telegram', external: true },
                        { href: '#contact-location-title', label: 'Как нас найти' },
                        { href: '#contact-form', label: 'Оставить заявку' },
                        { href: pageHref('services.html'), label: 'Каталог ворот и заборов' }
                    ]
                };
            }

            if (fileName === 'payment-documents.html') {
                return {
                    label: 'Документы и оплата',
                    items: [
                        { href: '#payment-benefits-title', label: 'Как оформляем заказ' },
                        { href: '#payment-flow-title', label: 'Этапы и закрывающие документы' },
                        { href: policyHref, label: 'Политика конфиденциальности' },
                        { href: pageHref('prices.html'), label: 'Цены и расчёт' },
                        { href: pageHref('contacts.html'), label: 'Контакты' }
                    ]
                };
            }

            if (fileName === 'politika.html') {
                return {
                    label: 'Полезное',
                    items: [
                        { href: pageHref('payment-documents.html'), label: 'Оплата и документы' },
                        { href: pageHref('contacts.html'), label: 'Контакты' },
                        { href: pageHref('services.html'), label: 'Каталог ворот и заборов' },
                        { href: homeHref + '#request-form', label: 'Оставить заявку' },
                        { href: homeHref, label: 'На главную' }
                    ]
                };
            }

            if (fileName.startsWith('automation-')) {
                return {
                    label: 'Автоматика',
                    items: [
                        { href: pageHref('automation-swing.html'), label: 'Приводы и комплекты' },
                        { href: pageHref('automation-sliding-components.html'), label: 'Комплектующие' },
                        { href: pageHref('services.html'), label: 'Каталог ворот и заборов' },
                        { href: pageHref('prices.html'), label: 'Цены и расчёт' },
                        { href: homeHref + '#request-form', label: 'Получить расчёт' }
                    ]
                };
            }

            return defaultContext;
        }

        const context = getFooterContext();
        const contextItems = context.items.map((item) => {
            const target = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<li><a href="${item.href}"${target}>${item.label}</a></li>`;
        }).join('');

        const currentYear = new Date().getFullYear();
        footer.classList.add('footer--premium');
        footer.innerHTML = `
            <div class="container">
                <div class="footer-premium__layout">
                    <div class="footer-premium__primary">
                        <a class="footer-premium__brand" href="#top" aria-label="Наверх">
                            <span class="footer-premium__mark logo-main logo-main--image" aria-hidden="true">
                                <img class="footer-premium__logo logo-image" src="${assetsPrefix}images/logo.png" alt="">
                                <span class="logo-wave footer-premium__wave" aria-hidden="true"></span>
                            </span>
                        </a>

                        <div class="footer-premium__socials" aria-label="Быстрые контакты">
                            <a class="footer-premium__social" href="https://t.me/+79625542260" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                <i class="fas fa-paper-plane" aria-hidden="true"></i>
                            </a>
                            <a class="footer-premium__social" href="https://max.ru" target="_blank" rel="noopener noreferrer" aria-label="Max">
                                <i class="fas fa-comment-dots" aria-hidden="true"></i>
                            </a>
                            <a class="footer-premium__social" href="${pageHref('contacts.html')}" aria-label="Контакты и адрес">
                                <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>

                    <div class="footer-premium__column footer-premium__column--company">
                        <span class="footer-premium__label">Компания</span>
                        <p class="footer-premium__company">ООО «Комфорт Плюс»</p>
                        <p class="footer-premium__legal-text">Производство металлоконструкций, изготовление ворот, каркасов и установка автоматики.</p>
                        <p class="footer-premium__legal-text">Более 10 лет опыта в изготовлении и монтаже конструкций для частных и коммерческих объектов.</p>
                    </div>

                    <div class="footer-premium__column footer-premium__column--context">
                        <span class="footer-premium__label">${context.label}</span>
                        <ul class="footer-premium__list">
                            ${contextItems}
                        </ul>
                    </div>

                    <div class="footer-premium__column footer-premium__column--contacts">
                        <span class="footer-premium__label">Контакты</span>
                        <ul class="footer-premium__list footer-premium__list--contacts">
                            <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i><span>Казань, Старое Победилово, ул. Садовая, 72</span></li>
                            <li><i class="fas fa-phone" aria-hidden="true"></i><a href="tel:+79625542260">+7 (962) 554-22-60</a></li>
                            <li><i class="fas fa-phone" aria-hidden="true"></i><a href="tel:+79376154629">+7 (937) 615-46-29</a></li>
                            <li><i class="fas fa-envelope" aria-hidden="true"></i><a href="mailto:vorota404@mail.ru">vorota404@mail.ru</a></li>
                            <li><i class="fas fa-clock" aria-hidden="true"></i><span>Пн-Пт: 8:00-18:00, Сб: 9:00-14:00</span></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-premium__bottom">
                    <p>&copy; 2014-${currentYear} KOMFORTPLUS116.RU — Ворота, заборы и порошковая покраска в Казани</p>
                    <p><a href="${policyHref}">Политика конфиденциальности</a> | Домен: pokraska.store</p>
                </div>
            </div>
        `;
    }

    renderPremiumFooter();

    // 3.2. Десктопная шапка внутренних страниц теперь статична и не подменяется после загрузки.

    // 4. Более живой, но спокойный автослайд направлений на главной
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsHover = window.matchMedia('(hover: hover)');
    const DIRECTION_SHOWCASE_INITIAL_DELAY = 5600;
    const DIRECTION_SHOWCASE_INTERVAL = 4800;
    const DIRECTION_SHOWCASE_RESUME_DELAY = 1200;

    function initDirectionShowcase(showcase) {
        if (!showcase || showcase.dataset.directionShowcaseBound === 'true') return;

        const slides = Array.from(showcase.querySelectorAll('[data-direction-showcase-slide]'));
        const dots = Array.from(showcase.querySelectorAll('[data-direction-showcase-dot]'));
        const viewport = showcase.querySelector('.direction-showcase__viewport');

        if (slides.length === 0 || dots.length === 0) return;

        showcase.dataset.directionShowcaseBound = 'true';

        let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
        let autoplayTimer = null;
        let isInViewport = true;

        function setCycleDuration(delay) {
            showcase.style.setProperty('--direction-showcase-duration', `${delay}ms`);
        }

        function hasInteractivePause() {
            return showcase.matches(':hover') || showcase.contains(document.activeElement);
        }

        function canAutoplay() {
            return !prefersReducedMotion.matches
                && slides.length >= 2
                && isInViewport
                && !document.hidden
                && !hasInteractivePause();
        }

        function clearAutoplayTimer() {
            if (autoplayTimer) {
                window.clearTimeout(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function applySlide(index, animationDuration = DIRECTION_SHOWCASE_INTERVAL) {
            const safeIndex = (index + dots.length) % dots.length;
            setCycleDuration(animationDuration);

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === safeIndex;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === safeIndex;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            activeIndex = safeIndex;
        }

        function stopAutoplay() {
            showcase.classList.add('is-paused');
            clearAutoplayTimer();
        }

        function scheduleAutoplay(delay = DIRECTION_SHOWCASE_INTERVAL) {
            clearAutoplayTimer();

            if (!canAutoplay()) {
                showcase.classList.add('is-paused');
                return;
            }

            showcase.classList.remove('is-paused');
            setCycleDuration(delay);

            autoplayTimer = window.setTimeout(() => {
                if (!canAutoplay()) {
                    stopAutoplay();
                    return;
                }

                applySlide(activeIndex + 1, DIRECTION_SHOWCASE_INTERVAL);
                scheduleAutoplay(DIRECTION_SHOWCASE_INTERVAL);
            }, delay);
        }

        function startAutoplay(delay = DIRECTION_SHOWCASE_INTERVAL) {
            stopAutoplay();
            scheduleAutoplay(delay);
        }

        function restartAutoplay(delay = DIRECTION_SHOWCASE_INTERVAL) {
            startAutoplay(delay);
        }

        function syncAutoplay(delay = DIRECTION_SHOWCASE_INTERVAL) {
            if (canAutoplay()) {
                restartAutoplay(delay);
            } else {
                stopAutoplay();
            }
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                applySlide(index, DIRECTION_SHOWCASE_INTERVAL);
                syncAutoplay(DIRECTION_SHOWCASE_RESUME_DELAY);
            });

            dot.addEventListener('focus', () => {
                applySlide(index, DIRECTION_SHOWCASE_INTERVAL);
            });

            if (supportsHover.matches) {
                dot.addEventListener('mouseenter', () => {
                    if (index !== activeIndex) {
                        applySlide(index, DIRECTION_SHOWCASE_INTERVAL);
                    }
                });
            }
        });

        if (viewport && slides.length > 1) {
            viewport.addEventListener('click', () => {
                applySlide(activeIndex + 1, DIRECTION_SHOWCASE_INTERVAL);
                syncAutoplay(DIRECTION_SHOWCASE_RESUME_DELAY);
            });
        }

        if (supportsHover.matches) {
            showcase.addEventListener('mouseenter', stopAutoplay);
            showcase.addEventListener('mouseleave', () => startAutoplay(DIRECTION_SHOWCASE_RESUME_DELAY));
        } else {
            showcase.addEventListener('pointerdown', stopAutoplay);
            showcase.addEventListener('pointerup', () => syncAutoplay(DIRECTION_SHOWCASE_RESUME_DELAY));
            showcase.addEventListener('pointercancel', () => syncAutoplay(DIRECTION_SHOWCASE_RESUME_DELAY));
            showcase.addEventListener('pointerleave', () => syncAutoplay(DIRECTION_SHOWCASE_RESUME_DELAY));
        }

        showcase.addEventListener('focusin', stopAutoplay);
        showcase.addEventListener('focusout', () => {
            window.setTimeout(() => {
                if (!showcase.contains(document.activeElement)) {
                    startAutoplay(DIRECTION_SHOWCASE_RESUME_DELAY);
                }
            }, 0);
        });

        if ('IntersectionObserver' in window) {
            const showcaseObserver = new IntersectionObserver((entries) => {
                const [entry] = entries;
                isInViewport = entry.isIntersecting && entry.intersectionRatio >= 0.35;
                syncAutoplay(DIRECTION_SHOWCASE_RESUME_DELAY);
            }, {
                threshold: [0, 0.35, 0.6]
            });

            showcaseObserver.observe(showcase);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay(DIRECTION_SHOWCASE_RESUME_DELAY);
            }
        });

        applySlide(activeIndex, DIRECTION_SHOWCASE_INITIAL_DELAY);
        startAutoplay(DIRECTION_SHOWCASE_INITIAL_DELAY);
    }

    function initDirectionShowcases(root = document) {
        root.querySelectorAll('[data-direction-showcase]').forEach((showcase) => {
            initDirectionShowcase(showcase);
        });
    }

    initDirectionShowcases();

    document.addEventListener('pokraska:direction-showcases-updated', (event) => {
        const root = event.detail?.root || document;
        root.querySelectorAll('[data-direction-showcase]').forEach((showcase) => {
            delete showcase.dataset.directionShowcaseBound;
        });
        initDirectionShowcases(root);
    });

    // 5. Палитра цветов (мини-превью + главный слайд + модальное увеличение)
    const paletteModal = document.querySelector('.palette-modal');
    const paletteModalImage = paletteModal ? paletteModal.querySelector('.palette-modal__image') : null;
    const paletteModalClose = paletteModal ? paletteModal.querySelector('.palette-modal__close') : null;
    let paletteLastFocus = null;

    function openPaletteModal(src, alt) {
        if (!paletteModal || !paletteModalImage || !src) return;
        paletteModalImage.hidden = false;
        paletteModalImage.src = src;
        paletteModalImage.alt = alt || 'Просмотр палитры';
        paletteLastFocus = document.activeElement;
        paletteModal.setAttribute('aria-hidden', 'false');
        paletteModal.classList.add('is-open');
        document.body.classList.add('modal-open');
        if (paletteModalClose) {
            paletteModalClose.focus();
        }
    }

    function closePaletteModal() {
        if (!paletteModal) return;
        paletteModal.classList.remove('is-open');
        paletteModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (paletteModalImage) {
            paletteModalImage.hidden = true;
            paletteModalImage.removeAttribute('src');
            paletteModalImage.alt = '';
        }
        if (paletteLastFocus && typeof paletteLastFocus.focus === 'function') {
            paletteLastFocus.focus();
        }
        paletteLastFocus = null;
    }

    if (paletteModal) {
        paletteModal.addEventListener('click', (event) => {
            if (event.target === paletteModal) {
                closePaletteModal();
            }
        });
    }

    if (paletteModalClose) {
        paletteModalClose.addEventListener('click', closePaletteModal);
    }

    document.addEventListener('keydown', (event) => {
        if (!paletteModal || !paletteModal.classList.contains('is-open')) return;
        if (event.key === 'Escape') {
            closePaletteModal();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            if (paletteModalClose) {
                paletteModalClose.focus();
            }
        }
    });

    document.querySelectorAll('[data-palette]').forEach((slider) => {
        const mainImg = slider.querySelector('.palette-main img');
        const zoomLink = slider.querySelector('.palette-zoom');
        const thumbs = slider.querySelectorAll('.palette-thumb');
        if (!mainImg) return;

        if (thumbs.length) {
            thumbs.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const src = btn.getAttribute('data-src');
                    const alt = btn.getAttribute('data-alt') || '';
                    if (!src) return;
                    mainImg.src = src;
                    if (alt) mainImg.alt = alt;
                    if (zoomLink) zoomLink.href = src;
                    thumbs.forEach((b) => b.classList.remove('is-active'));
                    btn.classList.add('is-active');
                });
            });
        }

        if (zoomLink) {
            zoomLink.addEventListener('click', (event) => {
                event.preventDefault();
                openPaletteModal(mainImg.src, mainImg.alt);
            });
        }
    });

    // 6. Лайтбокс для работ и галереи
    const lightboxLinks = Array.from(document.querySelectorAll('a[data-lightbox]'));
    if (lightboxLinks.length) {
        let lightboxModal = document.querySelector('.lightbox-modal');
        if (!lightboxModal) {
            lightboxModal = document.createElement('div');
            lightboxModal.className = 'lightbox-modal';
            lightboxModal.setAttribute('role', 'dialog');
            lightboxModal.setAttribute('aria-modal', 'true');
            lightboxModal.setAttribute('aria-label', 'Просмотр изображения');
            lightboxModal.setAttribute('aria-hidden', 'true');
            lightboxModal.innerHTML = `
                <div class="lightbox-modal__content">
                    <button class="lightbox-modal__close" type="button" aria-label="Закрыть просмотр">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                    <button class="lightbox-modal__nav lightbox-modal__nav--prev" type="button" aria-label="Предыдущее изображение">
                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <button class="lightbox-modal__nav lightbox-modal__nav--next" type="button" aria-label="Следующее изображение">
                        <i class="fas fa-chevron-right" aria-hidden="true"></i>
                    </button>
                    <figure class="lightbox-modal__figure">
                        <img class="lightbox-modal__image" alt="Просмотр изображения" hidden>
                        <figcaption class="lightbox-modal__caption"></figcaption>
                    </figure>
                </div>
            `;
            document.body.appendChild(lightboxModal);
        }

        const lightboxImage = lightboxModal.querySelector('.lightbox-modal__image');
        const lightboxCaption = lightboxModal.querySelector('.lightbox-modal__caption');
        const lightboxClose = lightboxModal.querySelector('.lightbox-modal__close');
        const lightboxPrev = lightboxModal.querySelector('.lightbox-modal__nav--prev');
        const lightboxNext = lightboxModal.querySelector('.lightbox-modal__nav--next');

        let lightboxGroup = [];
        let lightboxIndex = 0;
        let lightboxLastFocus = null;

        const getLinkedImageAlt = (link) => {
            const img = link.closest('.work-image-container, .gallery-image, .work-item, .gallery-item')?.querySelector('img');
            return img ? img.alt : '';
        };

        const getLinkCaption = (link) => {
            return link.getAttribute('title') || link.getAttribute('aria-label') || getLinkedImageAlt(link) || '';
        };

        const updateLightbox = (index) => {
            const link = lightboxGroup[index];
            if (!link || !lightboxImage) return;
            const href = link.getAttribute('href');
            if (!href) return;
            const caption = getLinkCaption(link);
            const altText = getLinkedImageAlt(link) || caption || 'Изображение';
            lightboxImage.hidden = false;
            lightboxImage.src = href;
            lightboxImage.alt = altText;
            if (lightboxCaption) {
                lightboxCaption.textContent = caption;
                lightboxCaption.style.display = caption ? 'block' : 'none';
            }

            const isMulti = lightboxGroup.length > 1;
            if (lightboxPrev && lightboxNext) {
                lightboxPrev.style.display = isMulti ? 'inline-flex' : 'none';
                lightboxNext.style.display = isMulti ? 'inline-flex' : 'none';
                lightboxPrev.disabled = !isMulti;
                lightboxNext.disabled = !isMulti;
            }
        };

        const openLightbox = (link) => {
            const groupName = link.getAttribute('data-lightbox') || '';
            lightboxGroup = lightboxLinks.filter((item) => (item.getAttribute('data-lightbox') || '') === groupName);
            if (!lightboxGroup.length) {
                lightboxGroup = [link];
            }
            lightboxIndex = Math.max(0, lightboxGroup.indexOf(link));
            lightboxLastFocus = document.activeElement;
            updateLightbox(lightboxIndex);
            lightboxModal.classList.add('is-open');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            if (lightboxClose) {
                lightboxClose.focus();
            }
        };

        const closeLightbox = () => {
            lightboxModal.classList.remove('is-open');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            if (lightboxImage) {
                lightboxImage.hidden = true;
                lightboxImage.removeAttribute('src');
                lightboxImage.alt = '';
            }
            if (lightboxLastFocus && typeof lightboxLastFocus.focus === 'function') {
                lightboxLastFocus.focus();
            }
            lightboxLastFocus = null;
        };

        const navigateLightbox = (step) => {
            if (lightboxGroup.length <= 1) return;
            lightboxIndex = (lightboxIndex + step + lightboxGroup.length) % lightboxGroup.length;
            updateLightbox(lightboxIndex);
        };

        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[data-lightbox]');
            if (!link) return;
            event.preventDefault();
            openLightbox(link);
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxModal) {
            lightboxModal.addEventListener('click', (event) => {
                if (event.target === lightboxModal) {
                    closeLightbox();
                }
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => navigateLightbox(1));
        }

        document.addEventListener('keydown', (event) => {
            if (!lightboxModal.classList.contains('is-open')) return;
            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (event.key === 'ArrowRight') {
                navigateLightbox(1);
            } else if (event.key === 'Tab') {
                const focusable = [lightboxClose, lightboxPrev, lightboxNext].filter(
                    (el) => el && !el.disabled
                );
                if (!focusable.length) return;
                const currentIndex = focusable.indexOf(document.activeElement);
                const direction = event.shiftKey ? -1 : 1;
                const nextIndex = currentIndex === -1
                    ? 0
                    : (currentIndex + direction + focusable.length) % focusable.length;
                event.preventDefault();
                focusable[nextIndex].focus();
            }
        });
    }

    // 7. Слайдер фото в карточках услуг
    document.querySelectorAll('[data-image-slider]').forEach((slider) => {
        const slides = Array.from(slider.querySelectorAll('.equipment-slider__slide'));
        const prevBtn = slider.querySelector('.equipment-slider__btn--prev');
        const nextBtn = slider.querySelector('.equipment-slider__btn--next');
        if (!slides.length) return;

        let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
        if (activeIndex < 0) {
            activeIndex = 0;
            slides[0].classList.add('is-active');
        }

        if (slides.length === 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        const showSlide = (nextIndex) => {
            slides[activeIndex].classList.remove('is-active');
            activeIndex = (nextIndex + slides.length) % slides.length;
            slides[activeIndex].classList.add('is-active');
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => showSlide(activeIndex - 1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => showSlide(activeIndex + 1));
        }
    });

    // 8. До/После слайдер
    document.querySelectorAll('[data-before-after]').forEach((block) => {
        const ranges = Array.from(block.querySelectorAll('.before-after__range'));
        if (!ranges.length) return;

        if (ranges.length === 1) {
            const range = ranges[0];
            const update = () => {
                const value = Number(range.value);
                const beforeWidth = block.classList.contains('before-after--before-left')
                    ? value
                    : 100 - value;
                block.style.setProperty('--before-width', `${beforeWidth}%`);
            };

            range.addEventListener('input', update);
            update();
            return;
        }

        const rangeFirst = block.querySelector('.before-after__range--first') || ranges[0];
        const rangeSecond = block.querySelector('.before-after__range--second') || ranges[1];
        const minGap = 12;

        const update = (activeRange) => {
            let firstValue = Number(rangeFirst.value);
            let secondValue = Number(rangeSecond.value);

            if (secondValue - firstValue < minGap) {
                if (activeRange === rangeFirst) {
                    firstValue = Math.max(0, secondValue - minGap);
                    rangeFirst.value = firstValue;
                } else {
                    secondValue = Math.min(100, firstValue + minGap);
                    rangeSecond.value = secondValue;
                }
            }

            firstValue = Math.max(0, Math.min(100 - minGap, firstValue));
            secondValue = Math.max(minGap, Math.min(100, secondValue));

            block.style.setProperty('--before-width', `${firstValue}%`);
            block.style.setProperty('--middle-width', `${secondValue}%`);
        };

        const handleInput = (event) => update(event.target);

        rangeFirst.addEventListener('input', handleInput);
        rangeSecond.addEventListener('input', handleInput);
        update();
    });

    // 4. Обновление высоты шапки при загрузке изображений
    window.addEventListener('load', setHeaderHeight);
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    updateHeaderOnScroll();
});
