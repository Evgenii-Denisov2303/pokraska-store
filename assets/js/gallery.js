document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');

    if (filterButtons.length && galleryItems.length) {
        const urlParams = new URLSearchParams(window.location.search);
        const filterFromUrl = urlParams.get('filter');

        function filterGallery(filterValue) {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === filterValue) {
                    btn.classList.add('active');
                }
            });

            galleryItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                filterGallery(filterValue);

                const newUrl = filterValue === 'all'
                    ? 'gallery.html'
                    : `gallery.html?filter=${filterValue}`;
                history.pushState(null, '', newUrl);
            });
        });

        document.querySelectorAll('a[data-filter]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const filterValue = this.getAttribute('data-filter');

                const filterBtn = document.querySelector(`.filter-btn[data-filter="${filterValue}"]`);
                if (filterBtn) {
                    filterBtn.click();
                    const filters = document.querySelector('.gallery-filters');
                    if (filters) {
                        filters.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            });
        });

        if (filterFromUrl) {
            filterGallery(filterFromUrl);
        } else {
            galleryItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            });
        }
    }

    document.querySelectorAll('.zoom-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!modal || !modalImg) return;
            const imgSrc = this.getAttribute('href');
            modalImg.src = imgSrc;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeModal();
        }
    });

    const counterElement = document.querySelector('.counter-number');
    if (counterElement) {
        const finalNumber = 5000;
        let currentNumber = 0;
        const increment = finalNumber / 100;
        const duration = 2000;
        const interval = duration / 100;

        const counterInterval = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(counterInterval);
            }
            counterElement.textContent = Math.floor(currentNumber) + '+';
        }, interval);
    }
});
