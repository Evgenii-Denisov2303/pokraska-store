// ========== SLIDERS.JS ==========
document.addEventListener('DOMContentLoaded', function () {
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
});
