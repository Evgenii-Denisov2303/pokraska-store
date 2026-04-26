(function() {
    (function injectInlineEditorAssets() {
        const query = new URLSearchParams(window.location.search);
        const skipInlineEditor = query.get('noedit') === '1' || query.get('perf') === '1';
        const wantsInlineEditor = Boolean(window.POKRASKA_INLINE_EDITOR_ENABLED)
            || query.get('edit') === '1'
            || ['localhost', '127.0.0.1'].includes(window.location.hostname)
            || window.location.port === '4173';

        if (skipInlineEditor || !wantsInlineEditor || window.POKRASKA_INLINE_ASSETS_LOADING) {
            return;
        }

        window.POKRASKA_INLINE_ASSETS_LOADING = true;

        const assetVersion = '20260423-inline-admin-10';
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

    const COMPACT_HEADER_BREAKPOINT = 1100;
    const HEADER_SCROLL_BREAKPOINT = 768;
    const searchParams = new URLSearchParams(window.location.search);
    const forceReveal = searchParams.get('reveal') === '1';
    const focusSection = searchParams.get('section');
    const heroHeader = document.querySelector('.hero-header');
    const body = document.body;
    const heroMenuToggle = heroHeader ? heroHeader.querySelector('.hero-menu-toggle') : null;
    const heroNav = heroHeader ? heroHeader.querySelector('.hero-scene__nav') : null;
    const heroTopbar = heroHeader ? heroHeader.querySelector('.hero-scene__topbar') : null;
    const scenes = Array.from(document.querySelectorAll('.scene-reveal'));
    const panelGalleryState = new WeakMap();
    const prefetchedUrls = new Set();
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    function isCompactHeroViewport() {
        return window.innerWidth <= COMPACT_HEADER_BREAKPOINT;
    }

    function isScrollHideViewport() {
        return window.innerWidth <= HEADER_SCROLL_BREAKPOINT || window.innerHeight <= 520;
    }

    function setHeroHeaderHeight() {
        if (!heroHeader) return;
        const desktopHeaderTarget = (heroTopbar && heroTopbar.offsetHeight > 0) ? heroTopbar : heroHeader;
        const heightTarget = isCompactHeroViewport() ? heroHeader : desktopHeaderTarget;
        const headerHeight = `${Math.ceil(heightTarget.offsetHeight || heroHeader.offsetHeight)}px`;
        document.documentElement.style.setProperty('--home-hero-header-height', headerHeight);
        document.documentElement.style.setProperty('--header-top-height', headerHeight);
    }

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
        if (window.innerWidth > 1100) return;
        if (scene.querySelector(':scope > .scene-reveal__curtain')) return;
        const curtain = document.createElement('span');
        curtain.className = 'scene-reveal__curtain';
        curtain.setAttribute('aria-hidden', 'true');
        scene.appendChild(curtain);
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
            link.addEventListener('touchstart', triggerPrefetch, { passive: true, once: true });
        });
    }

    if (heroHeader && heroMenuToggle && heroNav) {
        makeLogoOnlyClickable(heroHeader);

        let lastHeroScrollY = window.scrollY;
        let isHeroHeaderHidden = false;
        let isHeroHeaderCollapsed = false;

        const syncHeroHeaderShellState = () => {
            if (!isCompactHeroViewport()) {
                heroHeader.classList.remove('is-scrolled');
                return;
            }

            const shouldShowShell = window.scrollY > 18;
            heroHeader.classList.toggle('is-scrolled', shouldShowShell);
        };

        const updateHeroHeaderVisibility = () => {
            if (!isScrollHideViewport()) {
                if (isHeroHeaderCollapsed) {
                    isHeroHeaderCollapsed = false;
                    setHeroHeaderHeight();
                }

                heroHeader.classList.remove('is-hidden');
                isHeroHeaderHidden = false;

                const currentScrollY = window.scrollY;
                const scrollingDown = currentScrollY > lastHeroScrollY;
                const nearTop = currentScrollY < 20;

                if (scrollingDown && currentScrollY > 120) {
                    heroHeader.classList.add('is-hidden');
                    isHeroHeaderHidden = true;
                } else if (!scrollingDown || nearTop) {
                    heroHeader.classList.remove('is-hidden');
                    isHeroHeaderHidden = false;
                }

                syncHeroHeaderShellState();
                lastHeroScrollY = currentScrollY;
                return;
            }

            if (heroHeader.classList.contains('is-menu-open')) {
                isHeroHeaderHidden = false;
                heroHeader.classList.remove('is-hidden');
                syncHeroHeaderShellState();
                lastHeroScrollY = window.scrollY;
                return;
            }

            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastHeroScrollY + 4;
            const nearTop = currentScrollY < 20;

            if (scrollingDown && currentScrollY > 12) {
                if (!isHeroHeaderCollapsed) {
                    isHeroHeaderCollapsed = true;
                    setHeroHeaderHeight();
                }
                if (!isHeroHeaderHidden) {
                    heroHeader.classList.add('is-hidden');
                    isHeroHeaderHidden = true;
                }
            } else if (!scrollingDown || nearTop) {
                if (isHeroHeaderCollapsed) {
                    isHeroHeaderCollapsed = false;
                    setHeroHeaderHeight();
                }
                if (isHeroHeaderHidden) {
                    heroHeader.classList.remove('is-hidden');
                    isHeroHeaderHidden = false;
                } else {
                    heroHeader.classList.remove('is-hidden');
                }
            }

            syncHeroHeaderShellState();
            lastHeroScrollY = currentScrollY;
        };

        const closeHeroMenu = () => {
            heroHeader.classList.remove('is-menu-open');
            heroNav.classList.remove('active');
            body.classList.remove('menu-open');
            heroMenuToggle.setAttribute('aria-expanded', 'false');
            heroMenuToggle.classList.remove('is-active');
            heroNav.setAttribute('aria-hidden', 'true');
            heroHeader.classList.remove('is-hidden');
            isHeroHeaderHidden = false;
            syncHeroHeaderShellState();
            setHeroHeaderHeight();
        };

        const openHeroMenu = () => {
            heroHeader.classList.add('is-menu-open');
            heroNav.classList.add('active');
            body.classList.add('menu-open');
            heroMenuToggle.setAttribute('aria-expanded', 'true');
            heroMenuToggle.classList.add('is-active');
            heroNav.setAttribute('aria-hidden', 'false');
            heroHeader.classList.remove('is-hidden');
            isHeroHeaderHidden = false;
            lastHeroScrollY = window.scrollY;
            syncHeroHeaderShellState();
            setHeroHeaderHeight();
        };

        const syncHeroMenuOnScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastHeroScrollY + 4;

            if (
                isScrollHideViewport()
                && heroHeader.classList.contains('is-menu-open')
                && scrollingDown
            ) {
                closeHeroMenu();
            }

            updateHeroHeaderVisibility();
        };

        setHeroHeaderHeight();
        updateHeroHeaderVisibility();
        syncHeroHeaderShellState();
        heroNav.setAttribute('aria-hidden', 'true');

        heroMenuToggle.addEventListener('click', () => {
            if (heroHeader.classList.contains('is-menu-open')) {
                closeHeroMenu();
                return;
            }

            openHeroMenu();
        });

        heroNav.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link || !heroNav.contains(link)) return;
            if (window.innerWidth <= COMPACT_HEADER_BREAKPOINT) {
                closeHeroMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (window.innerWidth > COMPACT_HEADER_BREAKPOINT) return;
            if (!heroHeader.classList.contains('is-menu-open')) return;
            if (heroHeader.contains(event.target)) return;
            closeHeroMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            closeHeroMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > COMPACT_HEADER_BREAKPOINT) {
                closeHeroMenu();
            }
            lastHeroScrollY = window.scrollY;
            setHeroHeaderHeight();
            updateHeroHeaderVisibility();
            syncHeroHeaderShellState();
        });

        window.addEventListener('load', () => {
            setHeroHeaderHeight();
        }, { once: true });
        window.addEventListener('scroll', syncHeroMenuOnScroll, { passive: true });

        installNavPrefetch(Array.from(heroNav.querySelectorAll('a')));
    }

    if (scenes.length) {
        scenes.forEach((scene) => {
            const delay = Number(scene.dataset.sceneDelay || 0);
            scene.style.setProperty('--scene-delay', `${delay}ms`);
            ensureSceneCurtain(scene);
        });

        if (forceReveal || reducedMotion || !('IntersectionObserver' in window)) {
            scenes.forEach((scene) => scene.classList.add('is-visible'));
        } else {
            const immediateScenes = scenes.filter((scene) => scene.getBoundingClientRect().top < window.innerHeight * 0.92);
            immediateScenes.forEach((scene) => scene.classList.add('is-visible'));

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            }, {
                threshold: 0.02,
                rootMargin: '0px 0px 18% 0px'
            });

            scenes.forEach((scene) => {
                if (scene.classList.contains('is-visible')) return;
                observer.observe(scene);
            });
        }
    }

    function initializePanelGallery(card) {
        const existingState = panelGalleryState.get(card);
        if (existingState) {
            existingState.abortController.abort();
            if (existingState.timerId) {
                window.clearInterval(existingState.timerId);
            }
        }

        const slides = Array.from(card.querySelectorAll('.panel-scene__image'));
        const dots = Array.from(card.querySelectorAll('.panel-scene__dot'));
        const caption = card.querySelector('[data-panel-caption]');
        const media = card.querySelector('.panel-scene__media');
        const overlay = card.querySelector('.panel-scene__overlay');

        if (slides.length < 2 || !caption) {
            panelGalleryState.delete(card);
            return;
        }

        let activeIndex = 0;
        let timerId = null;
        let isGalleryVisible = !('IntersectionObserver' in window);
        const abortController = new AbortController();
        const { signal } = abortController;

        const loadSlideImage = (slide) => {
            if (!slide || slide.getAttribute('src')) return;
            const deferredSrc = slide.dataset.src;
            if (deferredSrc) {
                slide.src = deferredSrc;
            }
        };

        const setActiveSlide = (index) => {
            activeIndex = index;
            loadSlideImage(slides[index]);

            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === index);
            });

            caption.textContent = slides[index].dataset.caption || '';
        };

        const startRotation = () => {
            if (!isGalleryVisible) return;
            if (timerId) window.clearInterval(timerId);
            timerId = window.setInterval(() => {
                setActiveSlide((activeIndex + 1) % slides.length);
            }, 3200);
        };

        const stopRotation = () => {
            if (!timerId) return;
            window.clearInterval(timerId);
            timerId = null;
        };

        const advanceSlide = () => {
            setActiveSlide((activeIndex + 1) % slides.length);
            startRotation();
        };

        const rewindSlide = () => {
            setActiveSlide((activeIndex - 1 + slides.length) % slides.length);
            startRotation();
        };

        const handleDirectionalClick = (event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const clickX = event.clientX - bounds.left;

            if (clickX < bounds.width / 2) {
                rewindSlide();
                return;
            }

            advanceSlide();
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                setActiveSlide(index);
                startRotation();
            }, { signal });
        });

        [media, overlay].forEach((clickTarget) => {
            if (!clickTarget) return;
            clickTarget.addEventListener('click', handleDirectionalClick, { signal });
        });

        setActiveSlide(0);

        if ('IntersectionObserver' in window) {
            const visibilityObserver = new IntersectionObserver((entries) => {
                const entry = entries[0];
                isGalleryVisible = Boolean(entry?.isIntersecting);

                if (isGalleryVisible) {
                    startRotation();
                    return;
                }

                stopRotation();
            }, {
                threshold: 0.08,
                rootMargin: '80px 0px'
            });

            visibilityObserver.observe(card);
            signal.addEventListener('abort', () => visibilityObserver.disconnect(), { once: true });
        } else {
            startRotation();
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopRotation();
                return;
            }

            startRotation();
        }, { signal });

        panelGalleryState.set(card, {
            abortController,
            get timerId() {
                return timerId;
            }
        });
    }

    function initializePanelGalleries(root = document) {
        const scope = root instanceof Element || root instanceof Document ? root : document;
        scope.querySelectorAll('[data-panel-gallery]').forEach((card) => {
            initializePanelGallery(card);
        });
    }

    initializePanelGalleries();

    document.addEventListener('pokraska:panel-galleries-updated', (event) => {
        initializePanelGalleries(event.detail?.root || document);
    });

    if (focusSection) {
        const focusMap = {
            panels: '.panel-scene',
            request: '#request-form',
            footer: '#page-footer'
        };

        const target = document.querySelector(focusMap[focusSection] || focusSection);
        if (target) {
            window.requestAnimationFrame(() => {
                window.scrollTo({
                    top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 28),
                    behavior: 'instant'
                });
            });
        }
    }
})();
