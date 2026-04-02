(function() {
    const scenes = Array.from(document.querySelectorAll('.scene-reveal'));
    if (!scenes.length) return;

    scenes.forEach((scene) => {
        const delay = Number(scene.dataset.sceneDelay || 0);
        scene.style.setProperty('--scene-delay', `${delay}ms`);
    });

    if (!('IntersectionObserver' in window)) {
        scenes.forEach((scene) => scene.classList.add('is-visible'));
        return;
    }

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
})();
