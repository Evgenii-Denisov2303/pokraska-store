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
                const extraOffset = Number(target.dataset.scrollOffset || 0);
                window.scrollTo({
                    top: target.offsetTop - headerHeight - extraOffset,
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

    // 4. Более живой, но спокойный автослайд направлений на главной
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsHover = window.matchMedia('(hover: hover)');
    const DIRECTION_SHOWCASE_INITIAL_DELAY = 5600;
    const DIRECTION_SHOWCASE_INTERVAL = 4800;
    const DIRECTION_SHOWCASE_RESUME_DELAY = 1200;

    document.querySelectorAll('[data-direction-showcase]').forEach((showcase) => {
        const slides = Array.from(showcase.querySelectorAll('[data-direction-showcase-slide]'));
        const dots = Array.from(showcase.querySelectorAll('[data-direction-showcase-dot]'));
        const viewport = showcase.querySelector('.direction-showcase__viewport');

        if (slides.length === 0 || dots.length === 0) return;

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
    });

    // 5. Палитра цветов (мини-превью + главный слайд + модальное увеличение)
    const paletteModal = document.querySelector('.palette-modal');
    const paletteModalImage = paletteModal ? paletteModal.querySelector('.palette-modal__image') : null;
    const paletteModalClose = paletteModal ? paletteModal.querySelector('.palette-modal__close') : null;
    let paletteLastFocus = null;

    function openPaletteModal(src, alt) {
        if (!paletteModal || !paletteModalImage || !src) return;
        paletteModalImage.src = src;
        paletteModalImage.alt = alt || '';
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
                        <img class="lightbox-modal__image" src="" alt="">
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
