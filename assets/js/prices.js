document.addEventListener('DOMContentLoaded', function() {
    const factorCards = document.querySelectorAll('.factor-card');
    factorCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    document.querySelectorAll('.price-amount').forEach(priceElement => {
        const text = priceElement.textContent;
        const formatted = text.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        priceElement.textContent = formatted;
    });
});
