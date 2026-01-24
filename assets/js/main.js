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
        const heightTarget = isMobile ? (header || headerTop) : (headerTop || header);
        document.documentElement.style.setProperty('--header-height', `${heightTarget.offsetHeight}px`);
        if (headerTop) {
            document.documentElement.style.setProperty('--header-top-height', `${headerTop.offsetHeight}px`);
        }
    }

    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = isCompactViewport()
                    ? (header ? header.offsetHeight : (headerTop ? headerTop.offsetHeight : 100))
                    : (headerTop ? headerTop.offsetHeight : (header ? header.offsetHeight : 100));
                window.scrollTo({
                    top: target.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Год в футере
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 5. Палитра цветов (мини-превью + главный слайд + модальное увеличение)
    const paletteModal = document.querySelector('.palette-modal');
    const paletteModalImage = paletteModal ? paletteModal.querySelector('.palette-modal__image') : null;
    const paletteModalClose = paletteModal ? paletteModal.querySelector('.palette-modal__close') : null;

    function openPaletteModal(src, alt) {
        if (!paletteModal || !paletteModalImage || !src) return;
        paletteModalImage.src = src;
        paletteModalImage.alt = alt || '';
        paletteModal.classList.add('is-open');
        document.body.classList.add('modal-open');
    }

    function closePaletteModal() {
        if (!paletteModal) return;
        paletteModal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
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
        if (event.key === 'Escape' && paletteModal && paletteModal.classList.contains('is-open')) {
            closePaletteModal();
        }
    });

    document.querySelectorAll('[data-palette]').forEach((slider) => {
        const mainImg = slider.querySelector('.palette-main img');
        const zoomLink = slider.querySelector('.palette-zoom');
        const thumbs = slider.querySelectorAll('.palette-thumb');
        if (!mainImg || !thumbs.length) return;

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

        if (zoomLink) {
            zoomLink.addEventListener('click', (event) => {
                event.preventDefault();
                openPaletteModal(mainImg.src, mainImg.alt);
            });
        }
    });

    // 4. Обновление высоты шапки при загрузке изображений
    window.addEventListener('load', setHeaderHeight);
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    updateHeaderOnScroll();
});
