// ========== HEADER.JS ==========
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;
    const header = document.querySelector('.header');
    const headerTop = document.querySelector('.header-top');
    let lastScrollY = window.scrollY;
    let isHeaderCollapsed = false;
    const prefetchedUrls = new Set();

    function canPrefetch() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!connection) return true;
        if (connection.saveData) return false;
        return !/^(slow-2g|2g)$/i.test(connection.effectiveType || '');
    }

    function normalizePrefetchUrl(link) {
        const href = link?.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
            return null;
        }

        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return null;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return null;
        return url;
    }

    function prefetchDocument(url) {
        if (!url || prefetchedUrls.has(url.href) || !canPrefetch()) return;
        prefetchedUrls.add(url.href);

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'document';
        link.href = url.href;
        document.head.appendChild(link);

        window.setTimeout(() => {
            fetch(url.href, {
                credentials: 'same-origin'
            }).catch(() => {});
        }, 0);
    }

    function collectPrefetchQueues(rootLinks) {
        const entries = rootLinks
            .map((link) => ({ link, url: normalizePrefetchUrl(link) }))
            .filter((entry) => entry.url);

        const priority = [];
        const deferred = [];
        const seen = new Set();
        const activeIndex = entries.findIndex(({ link }) => (
            link.matches('.active, [aria-current="page"], [aria-current="true"], .hero-nav__link--active')
        ));

        const addUnique = (bucket, url) => {
            if (!url || seen.has(url.href)) return;
            seen.add(url.href);
            bucket.push(url);
        };

        if (activeIndex >= 0) {
            [activeIndex - 1, activeIndex + 1, activeIndex - 2, activeIndex + 2].forEach((index) => {
                if (index < 0 || index >= entries.length) return;
                addUnique(priority, entries[index].url);
            });
        }

        entries.forEach(({ url }, index) => {
            if (index <= 1) {
                addUnique(priority, url);
            }
        });

        entries.forEach(({ url }) => {
            addUnique(deferred, url);
        });

        return { priority, deferred };
    }

    function installNavPrefetch(rootLinks) {
        if (!rootLinks.length || !canPrefetch()) return;

        const { priority, deferred } = collectPrefetchQueues(rootLinks);

        rootLinks.forEach((link) => {
            const triggerPrefetch = () => {
                prefetchDocument(normalizePrefetchUrl(link));
            };

            link.addEventListener('pointerenter', triggerPrefetch, { passive: true, once: true });
            link.addEventListener('focus', triggerPrefetch, { passive: true, once: true });
            link.addEventListener('touchstart', triggerPrefetch, { passive: true, once: true });
        });

        window.setTimeout(() => {
            priority.forEach(prefetchDocument);
        }, 140);

        const idlePrefetch = () => {
            deferred.forEach(prefetchDocument);
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(idlePrefetch, { timeout: 2200 });
        } else {
            window.setTimeout(idlePrefetch, 1800);
        }
    }

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

    installNavPrefetch(Array.from(document.querySelectorAll('.nav-list a, .hero-scene__nav a')));

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

            requestAnimationFrame(() => {
                setHeaderHeight();
            });
        }

        mobileMenuBtn.addEventListener('click', function () {
            setHeaderHeight();
            toggleMenu();
        });

        document.querySelectorAll('.nav-list a').forEach((link) => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        document.addEventListener('click', (event) => {
            if (nav.classList.contains('active')
                && !nav.contains(event.target)
                && event.target !== mobileMenuBtn
                && !mobileMenuBtn.contains(event.target)) {
                toggleMenu(false);
            }
        });

        window.addEventListener('resize', () => {
            if (!isCompactViewport() && nav.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && nav.classList.contains('active')) {
                toggleMenu(false);
                mobileMenuBtn.focus();
            }
        });
    }

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

    window.addEventListener('load', setHeaderHeight);
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    updateHeaderOnScroll();
});
