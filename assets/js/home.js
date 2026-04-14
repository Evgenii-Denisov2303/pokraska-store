(function() {
    const HERO_MENU_BREAKPOINT = 1080;
    const searchParams = new URLSearchParams(window.location.search);
    const forceReveal = searchParams.get('reveal') === '1';
    const focusSection = searchParams.get('section');
    const heroHeader = document.querySelector('.hero-header');
    const heroMenuToggle = document.querySelector('.hero-menu-toggle');
    const heroNav = document.querySelector('.hero-scene__nav');
    const scenes = Array.from(document.querySelectorAll('.scene-reveal'));
    const panelGalleryState = new WeakMap();

    if (heroHeader && heroMenuToggle && heroNav) {
        const closeHeroMenu = () => {
            heroHeader.classList.remove('is-menu-open');
            heroMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            heroMenuToggle.classList.remove('is-active');
        };

        const openHeroMenu = () => {
            heroHeader.classList.add('is-menu-open');
            heroMenuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            heroMenuToggle.classList.add('is-active');
        };

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
        });
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
