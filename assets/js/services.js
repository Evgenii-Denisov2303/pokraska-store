document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.service-nav-link');
    const sections = document.querySelectorAll('.service-detail-card');
    const header = document.querySelector('.header');

    if (!navLinks.length || !sections.length) {
        return;
    }

    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        if (scrollPosition < sections[0].offsetTop - 100) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 140;

                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });

                history.pushState(null, null, targetId);
            }
        });
    });

    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                const headerHeight = header ? header.offsetHeight : 140;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    const serviceCards = document.querySelectorAll('.service-detail-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(10px)';

        setTimeout(() => {
            link.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, index * 100 + 500);
    });
});
