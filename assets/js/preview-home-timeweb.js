(function() {
    const revealNodes = Array.from(document.querySelectorAll('.preview-reveal'));
    if (!revealNodes.length) return;

    revealNodes.forEach((node) => {
        const delay = Number(node.dataset.revealDelay || 0);
        node.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    if (!('IntersectionObserver' in window)) {
        revealNodes.forEach((node) => node.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
    });

    revealNodes.forEach((node) => {
        if (node.classList.contains('is-visible')) return;
        observer.observe(node);
    });
})();
