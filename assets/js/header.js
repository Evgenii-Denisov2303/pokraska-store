// ========== HEADER.JS ==========
(function injectInlineEditorAssets() {
    const query = new URLSearchParams(window.location.search);
    const skipInlineEditor = query.get('noedit') === '1' || query.get('perf') === '1';
    const inlineEditorMinWidth = 641;
    const inlineEditorMinHeight = 560;
    const supportsInlineEditorViewport = window.innerWidth >= inlineEditorMinWidth
        && window.innerHeight >= inlineEditorMinHeight;
    const wantsInlineEditor = Boolean(window.POKRASKA_INLINE_EDITOR_ENABLED)
        || query.get('edit') === '1';

    if (skipInlineEditor || !wantsInlineEditor || !supportsInlineEditorViewport || window.POKRASKA_INLINE_ASSETS_LOADING) {
        return;
    }

    window.POKRASKA_INLINE_ASSETS_LOADING = true;

    const assetVersion = '20260620-inline-title-cleanup-1';
    const assets = [
        `/assets/js/inline-editor.js?v=${assetVersion}`,
        `/assets/js/inline-editor-bootstrap.js?v=${assetVersion}`
    ];

    const loadScript = (src) => new Promise((resolve, reject) => {
        if (document.querySelector(`script[data-inline-asset="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.defer = true;
        script.dataset.inlineAsset = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Не удалось загрузить ${src}`));
        document.head.appendChild(script);
    });

    window.POKRASKA_INLINE_ASSETS_READY = assets
        .reduce((chain, src) => chain.then(() => loadScript(src)), Promise.resolve())
        .catch((error) => {
            console.warn('[inline-editor]', error.message);
        });
})();

document.addEventListener('DOMContentLoaded', function () {
    const COMPACT_HEADER_BREAKPOINT = 1100;
    const HEADER_SCROLL_BREAKPOINT = 768;
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;
    const header = document.querySelector('.header');
    const headerTop = document.querySelector('.header-top');
    let lastScrollY = window.scrollY;
    let isHeaderCollapsed = false;
    const prefetchedUrls = new Set();
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    function makeLogoOnlyClickable(root) {
        root.querySelectorAll('.hero-brand__link').forEach((link) => {
            if (link.dataset.logoClickBound === 'true') return;
            link.dataset.logoClickBound = 'true';

            link.addEventListener('click', (event) => {
                if (event.target.closest('.hero-brand__text')) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });

            link.addEventListener('pointerdown', (event) => {
                if (event.target.closest('.hero-brand__text')) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        });
    }

    function ensureSceneCurtain(scene) {
        if (window.innerWidth > COMPACT_HEADER_BREAKPOINT) return;
        if (scene.querySelector(':scope > .scene-reveal__curtain')) return;
        const curtain = document.createElement('span');
        curtain.className = 'scene-reveal__curtain';
        curtain.setAttribute('aria-hidden', 'true');
        scene.appendChild(curtain);
    }

    function initializeSceneReveal() {
        const revealTargets = [];
        const internalHeroScene = document.querySelector('.internal-hero-scene');

        if (internalHeroScene) {
            internalHeroScene.classList.add('scene-reveal');
            revealTargets.push(internalHeroScene);
        }

        if (!revealTargets.length) return;

        revealTargets.forEach((scene) => ensureSceneCurtain(scene));

        if (reducedMotion || !('IntersectionObserver' in window)) {
            revealTargets.forEach((scene) => scene.classList.add('is-visible'));
            return;
        }

        const immediateScenes = revealTargets.filter((scene) => scene.getBoundingClientRect().top < window.innerHeight * 0.92);
        immediateScenes.forEach((scene) => scene.classList.add('is-visible'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        });

        revealTargets.forEach((scene) => {
            if (scene.classList.contains('is-visible')) return;
            observer.observe(scene);
        });
    }

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
    }

    function installNavPrefetch(rootLinks) {
        if (!rootLinks.length || !canPrefetch()) return;

        rootLinks.forEach((link) => {
            const triggerPrefetch = () => {
                prefetchDocument(normalizePrefetchUrl(link));
            };

            link.addEventListener('pointerenter', triggerPrefetch, { passive: true, once: true });
            link.addEventListener('focus', triggerPrefetch, { passive: true, once: true });
        });
    }

    function isCompactHeaderViewport() {
        const phoneDesktopPortrait = window.matchMedia?.('(min-width: 900px) and (max-width: 1600px) and (max-aspect-ratio: 2 / 3)').matches;
        const nearSquareDesktop = isNearSquareDesktopHeaderViewport();
        const wideTouchTablet = window.matchMedia?.('(min-width: 1101px) and (max-width: 1600px) and (pointer: coarse)').matches;
        const phoneDesktopLandscape = window.matchMedia?.('(min-width: 900px) and (max-width: 1600px) and (max-height: 900px) and (orientation: landscape) and (pointer: coarse)').matches;
        return window.innerWidth <= COMPACT_HEADER_BREAKPOINT
            || Boolean(phoneDesktopPortrait)
            || Boolean(nearSquareDesktop)
            || Boolean(wideTouchTablet)
            || Boolean(phoneDesktopLandscape)
            || isLargeSquareHeaderViewport();
    }

    function isNearSquareDesktopHeaderViewport() {
        return Boolean(window.matchMedia?.('(min-width: 1101px) and (max-width: 1600px) and (min-height: 1100px) and (min-aspect-ratio: 5 / 6) and (max-aspect-ratio: 6 / 5)').matches);
    }

    function isPersistentCompactHeaderViewport() {
        return isLargeSquareHeaderViewport() || isNearSquareDesktopHeaderViewport();
    }

    function isLargeSquareHeaderViewport() {
        return Boolean(window.matchMedia?.('(min-width: 2200px) and (min-height: 2200px) and (min-aspect-ratio: 9 / 10) and (max-aspect-ratio: 10 / 9)').matches);
    }

    function isScrollHideViewport() {
        return (isCompactHeaderViewport() && !isLargeSquareHeaderViewport()) || window.innerHeight <= 520;
    }

    function setHeaderHeight() {
        if (!headerTop && !header) return;
        const isCompact = isCompactHeaderViewport();
        const desktopHeroHeader = header ? header.querySelector('.desktop-hero-header') : null;
        const desktopHeaderTarget = desktopHeroHeader && header?.classList.contains('header--desktop-hero')
            ? desktopHeroHeader
            : (headerTop || header);
        const compactHeaderTarget = headerTop || header;
        const heightTarget = isCompact ? compactHeaderTarget : desktopHeaderTarget;
        document.documentElement.style.setProperty('--header-height', `${heightTarget.offsetHeight}px`);
        if (headerTop) {
            document.documentElement.style.setProperty('--header-top-height', `${heightTarget.offsetHeight}px`);
        }
    }

    makeLogoOnlyClickable(document);
    initializeSceneReveal();

    function updateHeaderOnScroll() {
        if (!header || !headerTop) return;

        if (isPersistentCompactHeaderViewport()) {
            header.classList.remove('is-hidden');
            body.classList.remove('header-hidden');
            lastScrollY = window.scrollY;
            return;
        }

        const isCompactScroll = isScrollHideViewport();

        if (!isCompactScroll) {
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
        nav.setAttribute('aria-hidden', 'true');

        function toggleMenu(forceState) {
            const isOpen = typeof forceState === 'boolean' ? forceState : !nav.classList.contains('active');
            nav.classList.toggle('active', isOpen);
            body.classList.toggle('menu-open', isOpen);
            header?.classList.toggle('is-menu-open', isOpen);
            headerTop?.classList.toggle('is-menu-open', isOpen);
            mobileMenuBtn.classList.toggle('active', isOpen);
            mobileMenuBtn.classList.toggle('is-active', isOpen);
            nav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

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
            if (!isCompactHeaderViewport() && nav.classList.contains('active')) {
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
        const headerHeight = isCompactHeaderViewport()
            ? (headerTop ? headerTop.offsetHeight : (header ? header.offsetHeight : 100))
            : (headerTop ? headerTop.offsetHeight : (header ? header.offsetHeight : 100));
        const extraOffset = Number(target.dataset.scrollOffset || 0);
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: Math.max(0, targetTop - headerHeight - extraOffset),
            behavior: 'smooth'
        });
    });

    window.addEventListener('load', setHeaderHeight);
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    updateHeaderOnScroll();
});
