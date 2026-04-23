(function() {
    (function injectInlineEditorAssets() {
        const query = new URLSearchParams(window.location.search);
        const wantsInlineEditor = Boolean(window.POKRASKA_INLINE_EDITOR_ENABLED)
            || query.get('edit') === '1'
            || ['localhost', '127.0.0.1'].includes(window.location.hostname)
            || window.location.port === '4173';

        if (!wantsInlineEditor || window.POKRASKA_INLINE_ASSETS_LOADING) {
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

    const HERO_MENU_BREAKPOINT = 1080;
    const searchParams = new URLSearchParams(window.location.search);
    const forceReveal = searchParams.get('reveal') === '1';
    const focusSection = searchParams.get('section');
    const heroHeader = document.querySelector('.hero-header');
    const heroMenuToggle = document.querySelector('.hero-menu-toggle');
    const heroNav = document.querySelector('.hero-scene__nav');
    const scenes = Array.from(document.querySelectorAll('.scene-reveal'));
    const panelGalleryState = new WeakMap();
    const prefetchedUrls = new Set();

    function setHeroHeaderHeight() {
        if (!heroHeader) return;
        document.documentElement.style.setProperty('--home-hero-header-height', `${Math.ceil(heroHeader.offsetHeight)}px`);
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

    if (heroHeader && heroMenuToggle && heroNav) {
        const closeHeroMenu = () => {
            heroHeader.classList.remove('is-menu-open');
            heroMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            heroMenuToggle.classList.remove('is-active');
            setHeroHeaderHeight();
        };

        const openHeroMenu = () => {
            heroHeader.classList.add('is-menu-open');
            heroMenuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            heroMenuToggle.classList.add('is-active');
            setHeroHeaderHeight();
        };

        setHeroHeaderHeight();

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
            if (window.innerWidth <= HERO_MENU_BREAKPOINT) {
                closeHeroMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (window.innerWidth > HERO_MENU_BREAKPOINT) return;
            if (!heroHeader.classList.contains('is-menu-open')) return;
            if (heroHeader.contains(event.target)) return;
            closeHeroMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            closeHeroMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > HERO_MENU_BREAKPOINT) {
                closeHeroMenu();
            }
            setHeroHeaderHeight();
        });

        window.addEventListener('load', setHeroHeaderHeight, { once: true });

        installNavPrefetch(Array.from(heroNav.querySelectorAll('a')));
    }

    if (scenes.length) {
        scenes.forEach((scene) => {
            const delay = Number(scene.dataset.sceneDelay || 0);
            scene.style.setProperty('--scene-delay', `${delay}ms`);
        });

        if (forceReveal || !('IntersectionObserver' in window)) {
            scenes.forEach((scene) => scene.classList.add('is-visible'));
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            }, {
                threshold: 0.14,
                rootMargin: '0px 0px -6% 0px'
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
        const abortController = new AbortController();
        const { signal } = abortController;

        const setActiveSlide = (index) => {
            activeIndex = index;

            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === index);
            });

            caption.textContent = slides[index].dataset.caption || '';
        };

        const startRotation = () => {
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
        startRotation();

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
