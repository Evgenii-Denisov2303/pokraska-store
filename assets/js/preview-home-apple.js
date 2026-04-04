(function() {
    const scenes = Array.from(document.querySelectorAll('.scene-reveal'));
    if (scenes.length) {
        scenes.forEach((scene) => {
            const delay = Number(scene.dataset.sceneDelay || 0);
            scene.style.setProperty('--scene-delay', `${delay}ms`);
        });

        if (!('IntersectionObserver' in window)) {
            scenes.forEach((scene) => scene.classList.add('is-visible'));
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -10% 0px'
            });

            scenes.forEach((scene) => {
                if (scene.classList.contains('is-visible')) return;
                observer.observe(scene);
            });
        }
    }

    const routeItems = Array.from(document.querySelectorAll('.hero-copy__route'));
    const kineticSteps = Array.from(document.querySelectorAll('.hero-kinetic__step'));
    const scalePhases = Array.from(document.querySelectorAll('.scale-growth__phase'));
    const scaleTabs = Array.from(document.querySelectorAll('.scale-growth__tab'));
    const groupedItems = [routeItems, kineticSteps, scaleTabs].filter((group) => group.length > 1);

    if (!groupedItems.length) return;

    let activeIndex = 0;

    const setActiveIndex = (index) => {
        groupedItems.forEach((group) => {
            group.forEach((item, itemIndex) => {
                item.classList.toggle('is-active', itemIndex === index);
            });
        });

        scalePhases.forEach((phase, phaseIndex) => {
            phase.classList.toggle('is-active', phaseIndex === index);
        });
    };

    scaleTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            activeIndex = index;
            setActiveIndex(activeIndex);
        });
    });

    setInterval(() => {
        activeIndex = (activeIndex + 1) % Math.max(...groupedItems.map((group) => group.length));
        setActiveIndex(activeIndex);
    }, 2400);
})();
