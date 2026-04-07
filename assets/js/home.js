(function() {
    const REVEAL_FALLBACK_DELAY_MS = 300;
    const searchParams = new URLSearchParams(window.location.search);
    const forceReveal = searchParams.get('reveal') === '1';
    const focusSection = searchParams.get('section');
    const scenes = Array.from(document.querySelectorAll('.scene-reveal'));
    if (scenes.length) {
        const revealScene = (scene) => {
            scene.classList.add('is-visible');
        };

        scenes.forEach((scene) => {
            const delay = Number(scene.dataset.sceneDelay || 0);
            scene.style.setProperty('--scene-delay', `${delay}ms`);
        });

        if (forceReveal || !('IntersectionObserver' in window)) {
            scenes.forEach(revealScene);
        } else {
            const hiddenScenes = new Set();
            let revealFallbackTimerId = null;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    revealScene(entry.target);
                    hiddenScenes.delete(entry.target);
                    observer.unobserve(entry.target);
                    if (!hiddenScenes.size && revealFallbackTimerId) {
                        window.clearTimeout(revealFallbackTimerId);
                        revealFallbackTimerId = null;
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -10% 0px'
            });

            scenes.forEach((scene) => {
                if (scene.classList.contains('is-visible')) return;
                hiddenScenes.add(scene);
                observer.observe(scene);
            });

            const revealRemainingScenes = () => {
                if (revealFallbackTimerId) {
                    window.clearTimeout(revealFallbackTimerId);
                    revealFallbackTimerId = null;
                }
                hiddenScenes.forEach((scene) => {
                    revealScene(scene);
                    observer.unobserve(scene);
                });
                hiddenScenes.clear();
            };

            const scheduleRevealFallback = () => {
                revealFallbackTimerId = window.setTimeout(revealRemainingScenes, REVEAL_FALLBACK_DELAY_MS);
            };

            if (document.readyState === 'complete') {
                scheduleRevealFallback();
            } else {
                window.addEventListener('load', scheduleRevealFallback, { once: true });
            }
        }
    }

    const panelGalleries = Array.from(document.querySelectorAll('[data-panel-gallery]'));

    panelGalleries.forEach((card) => {
        const slides = Array.from(card.querySelectorAll('.panel-scene__image'));
        const dots = Array.from(card.querySelectorAll('.panel-scene__dot'));
        const caption = card.querySelector('[data-panel-caption]');
        const media = card.querySelector('.panel-scene__media');
        const overlay = card.querySelector('.panel-scene__overlay');

        if (slides.length < 2 || !caption) return;

        let activeIndex = 0;
        let timerId = null;

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
            });
        });

        [media, overlay].forEach((clickTarget) => {
            if (!clickTarget) return;
            clickTarget.addEventListener('click', handleDirectionalClick);
        });

        setActiveSlide(0);
        startRotation();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopRotation();
                return;
            }

            startRotation();
        });
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
