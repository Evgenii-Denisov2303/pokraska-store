document.addEventListener('DOMContentLoaded', () => {
    const quickNav = document.querySelector('.service-quick-nav');
    const navLinks = Array.from(document.querySelectorAll('.service-quick-nav .service-nav-link'))
        .filter((link) => {
            const hash = link.getAttribute('href');
            return hash && hash.startsWith('#') && document.querySelector(hash);
        });

    if (!navLinks.length) {
        return;
    }

    const sceneHeader = document.querySelector('.internal-scene-header');
    const compactHeader = document.querySelector('.header');
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (quickNav) {
        if (motionPreference.matches || !('IntersectionObserver' in window)) {
            window.setTimeout(() => quickNav.classList.add('is-revealed'), 60);
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        quickNav.classList.add('is-revealed');
                        observer.disconnect();
                    }
                });
            }, {
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.35
            });

            observer.observe(quickNav);
        }
    }

    function getStickyTop(headerHidden = null) {
        if (!quickNav) {
            return 0;
        }

        if (headerHidden !== null && window.innerWidth <= 1101.98) {
            if (headerHidden) {
                return 8;
            }

            const headerTopHeight = Number.parseFloat(
                window.getComputedStyle(document.documentElement).getPropertyValue('--header-top-height')
            );

            return (Number.isFinite(headerTopHeight) ? headerTopHeight : 72) + 8;
        }

        const stickyTop = Number.parseFloat(window.getComputedStyle(quickNav).top);
        return Number.isFinite(stickyTop) ? Math.max(stickyTop, 0) : 0;
    }

    function getOffset(headerHidden = null) {
        if (quickNav) {
            const quickNavStyle = window.getComputedStyle(quickNav);

            if (quickNavStyle.position === 'sticky') {
                return getStickyTop(headerHidden) + quickNav.offsetHeight + 14;
            }
        }

        const visibleHeader = [sceneHeader, compactHeader].find((candidate) => {
            if (!candidate || candidate.offsetHeight === 0) {
                return false;
            }

            return window.getComputedStyle(candidate).display !== 'none';
        });

        return (visibleHeader ? visibleHeader.offsetHeight : 0) + 22;
    }

    function prepareAnchorLayout() {
        // Offscreen service cards use estimated heights until content-visibility
        // reveals them. Resolve all preceding cards before measuring an anchor:
        // otherwise a newly rendered slider/thumbnail row moves the destination
        // after scrollTo has already captured its position. Keep the real layout
        // for subsequent clicks and ordinary scrolling; never pin the active link.
        sections.forEach((section) => {
            if (window.getComputedStyle(section).contentVisibility === 'auto') {
                section.style.contentVisibility = 'visible';
                section.style.containIntrinsicSize = 'auto';
            }
        });
    }

    function getTargetScrollTop(target) {
        prepareAnchorLayout();
        const bodyStyle = window.getComputedStyle(document.body);
        const currentBodyPadding = Number.parseFloat(bodyStyle.paddingTop) || 0;
        const targetDocumentTop = target.getBoundingClientRect().top + window.scrollY;

        if (window.innerWidth > 1101.98) {
            return targetDocumentTop - getOffset();
        }

        const targetIsBelow = target.getBoundingClientRect().top > getOffset();
        const finalHeaderHidden = targetIsBelow;
        const bodyUsesHeaderPadding = window.matchMedia(
            '(max-width: 768px), (max-height: 520px) and (max-width: 1024px)'
        ).matches;
        const headerHeight = Number.parseFloat(
            window.getComputedStyle(document.documentElement).getPropertyValue('--header-height')
        );
        const finalBodyPadding = !finalHeaderHidden && bodyUsesHeaderPadding && Number.isFinite(headerHeight)
            ? headerHeight
            : 0;
        const finalTargetDocumentTop = targetDocumentTop + finalBodyPadding - currentBodyPadding;

        return finalTargetDocumentTop - getOffset(finalHeaderHidden);
    }

    function setActiveLink(id) {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function updateActiveLink() {
        const threshold = window.scrollY + getOffset() + 8;
        let currentId = sections[0]?.id || '';

        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;

            if (threshold >= sectionTop) {
                currentId = section.id;
            }
        });

        if (currentId) {
            setActiveLink(currentId);
        }
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const hash = link.getAttribute('href');
            const target = hash ? document.querySelector(hash) : null;
            if (!target) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const targetTop = getTargetScrollTop(target);
            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior: motionPreference.matches ? 'instant' : 'smooth'
            });

            history.replaceState(null, '', hash);
            setActiveLink(target.id);
        });
    });

    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            window.setTimeout(() => {
                const targetTop = getTargetScrollTop(target);
                window.scrollTo({
                    top: Math.max(targetTop, 0),
                    behavior: motionPreference.matches ? 'instant' : 'smooth'
                });
                setActiveLink(target.id);
            }, 120);
        }
    } else {
        updateActiveLink();
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', updateActiveLink);
    quickNav?.addEventListener('transitionend', (event) => {
        // Revealing the compact header animates the sticky nav's top offset.
        // Its final position can change after the last scroll event, especially
        // when selecting the current section again or navigating upward.
        if (event.target === quickNav && event.propertyName === 'top') {
            updateActiveLink();
        }
    });
});
