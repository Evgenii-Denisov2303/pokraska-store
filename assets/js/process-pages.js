document.addEventListener('DOMContentLoaded', () => {
    const navLinks = Array.from(document.querySelectorAll('.service-quick-nav .service-nav-link'))
        .filter((link) => {
            const hash = link.getAttribute('href');
            return hash && hash.startsWith('#') && document.querySelector(hash);
        });

    if (!navLinks.length) {
        return;
    }

    const header = document.querySelector('.internal-scene-header') || document.querySelector('.header');
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function getOffset() {
        const headerHeight = header ? header.offsetHeight : 120;
        return headerHeight + 22;
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
            if (threshold >= section.offsetTop) {
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

            const targetTop = target.getBoundingClientRect().top + window.scrollY - getOffset();
            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior: 'smooth'
            });

            history.replaceState(null, '', hash);
            setActiveLink(target.id);
        });
    });

    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            window.setTimeout(() => {
                const targetTop = target.getBoundingClientRect().top + window.scrollY - getOffset();
                window.scrollTo({
                    top: Math.max(targetTop, 0),
                    behavior: 'smooth'
                });
                setActiveLink(target.id);
            }, 120);
        }
    } else {
        updateActiveLink();
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', updateActiveLink);
});
