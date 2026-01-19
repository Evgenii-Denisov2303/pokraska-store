// ========== MAIN.JS ==========
document.addEventListener('DOMContentLoaded', function() {
    // 1. Простое мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;
    const header = document.querySelector('.header');
    const headerContactsRow = document.querySelector('.header-contacts-row');
    let lastScrollY = window.scrollY;
    let isHeaderCollapsed = false;

    function setHeaderHeight() {
        if (!header) return;
        document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    }

    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    window.addEventListener('resize', () => {
        updateHeaderOnScroll();
    });

    function updateHeaderOnScroll() {
        if (!header || !headerContactsRow) return;
        const isMobile = window.innerWidth <= 768;

        if (!isMobile) {
            if (isHeaderCollapsed) {
                header.classList.remove('is-collapsed');
                isHeaderCollapsed = false;
                setHeaderHeight();
            }
            lastScrollY = window.scrollY;
            return;
        }

        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY;
        const nearTop = currentScrollY < 20;

        if (body.classList.contains('menu-open')) {
            lastScrollY = currentScrollY;
            return;
        }

        if (scrollingDown && currentScrollY > 80) {
            if (!isHeaderCollapsed) {
                header.classList.add('is-collapsed');
                isHeaderCollapsed = true;
                setHeaderHeight();
            }
        } else if (!scrollingDown || nearTop) {
            if (isHeaderCollapsed) {
                header.classList.remove('is-collapsed');
                isHeaderCollapsed = false;
                setHeaderHeight();
            }
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
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
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
                const headerHeight = header ? header.offsetHeight : 100;
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

    // 4. Обновление высоты шапки при загрузке изображений
    window.addEventListener('load', setHeaderHeight);
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    updateHeaderOnScroll();
});
