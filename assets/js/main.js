// ========== MAIN JS ==========
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню - ОБНОВЛЕННАЯ ВЕРСИЯ ДЛЯ НОВОЙ СТРУКТУРЫ ХЕДЕРА
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    const body = document.body;
    let isMenuOpen = false;
    let isAnimating = false;

    // Функция для добавления контактов в мобильное меню
    function addContactsToMobileMenu() {
        // Проверяем, не добавлены ли уже контакты
        if (document.querySelector('.mobile-contacts')) return;

        // Получаем контакты из строки в хедере
        const contactsRow = document.querySelector('.header-contacts-row');
        if (!contactsRow) return;

        // Создаем контейнер для мобильных контактов
        const mobileContacts = document.createElement('div');
        mobileContacts.className = 'mobile-contacts';

        // Копируем телефон
        const phoneElement = contactsRow.querySelector('.contact-phone');
        if (phoneElement) {
            const phoneClone = phoneElement.cloneNode(true);
            // Обновляем стили для мобильного
            phoneClone.style.flexDirection = 'column';
            phoneClone.style.textAlign = 'center';
            phoneClone.style.padding = '15px';
            phoneClone.style.width = '100%';
            phoneClone.style.background = '#f8f9fa';
            mobileContacts.appendChild(phoneClone);
        }

        // Добавляем соцсети
        const socialContainer = document.createElement('div');
        socialContainer.className = 'mobile-social';
        socialContainer.style.display = 'flex';
        socialContainer.style.justifyContent = 'center';
        socialContainer.style.gap = '15px';
        socialContainer.style.marginTop = '15px';
        socialContainer.style.width = '100%';

        // Копируем соцсети
        const socialLinks = contactsRow.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const linkClone = link.cloneNode(true);
            linkClone.style.padding = '8px 15px';
            linkClone.style.fontSize = '0.9rem';
            socialContainer.appendChild(linkClone);
        });

        if (socialLinks.length > 0) {
            mobileContacts.appendChild(socialContainer);
        }

        // Добавляем в мобильное меню
        if (nav) {
            nav.appendChild(mobileContacts);
        }
    }

    // Функция для удаления контактов из мобильного меню
    function removeContactsFromMobileMenu() {
        const mobileContacts = document.querySelector('.mobile-contacts');
        if (mobileContacts && mobileContacts.parentNode) {
            mobileContacts.parentNode.removeChild(mobileContacts);
        }
    }

    if (mobileMenuBtn && nav) {
        // Функция открытия/закрытия меню
        function toggleMobileMenu() {
            if (isAnimating) return;

            isAnimating = true;

            if (!isMenuOpen) {
                // Открываем меню
                nav.style.display = 'flex';
                requestAnimationFrame(() => {
                    nav.classList.add('active');
                });
                body.style.overflow = 'hidden';
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                isMenuOpen = true;

                // Добавляем контакты в мобильное меню
                addContactsToMobileMenu();
            } else {
                // Закрываем меню
                nav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = '';
                isMenuOpen = false;

                // Удаляем контакты и скрываем меню
                removeContactsFromMobileMenu();
                setTimeout(() => {
                    if (!isMenuOpen) {
                        nav.style.display = 'none';
                    }
                }, 300);
            }

            setTimeout(() => {
                isAnimating = false;
            }, 300);
        }

        // Обработчик клика по кнопке меню
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Инициализация - скрываем меню на старте
        nav.style.display = 'none';
    }

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (nav && isMenuOpen) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                isMenuOpen = false;

                removeContactsFromMobileMenu();

                setTimeout(() => {
                    nav.style.display = 'none';
                }, 300);
            }
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (nav && isMenuOpen &&
            !nav.contains(e.target) &&
            e.target !== mobileMenuBtn &&
            !mobileMenuBtn.contains(e.target)) {

            nav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
            isMenuOpen = false;

            removeContactsFromMobileMenu();

            setTimeout(() => {
                nav.style.display = 'none';
            }, 300);
        }
    });

    // Закрытие меню при ресайзе окна
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && nav && isMenuOpen) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                nav.style.display = '';
                body.style.overflow = '';
                isMenuOpen = false;

                removeContactsFromMobileMenu();
            }
        }, 250);
    });

    // Плавная прокрутка для якорей с учетом новой высоты хедера
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();

                // Рассчитываем высоту хедера (две строки + отступы)
                const headerHeight = header ? header.offsetHeight : 140;

                // Для мобильных устройств корректируем
                const isMobile = window.innerWidth <= 768;
                const scrollOffset = isMobile ? headerHeight - 40 : headerHeight;

                window.scrollTo({
                    top: targetElement.offsetTop - scrollOffset,
                    behavior: 'smooth'
                });

                // Обновляем URL без перезагрузки
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // Активный пункт меню при прокрутке
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            const headerHeight = header ? header.offsetHeight : 140;
            const scrollPosition = window.scrollY + headerHeight;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');

                if (href === `#${current}`) {
                    link.classList.add('active');
                }
                else if (current === '' && (href === 'index.html' || href === '../index.html')) {
                    link.classList.add('active');
                }
            });
        });

        // Вызываем сразу для установки начального состояния
        window.dispatchEvent(new Event('scroll'));
    }

    // Проверка поддержки localStorage
    if (typeof(Storage) === "undefined") {
        console.warn('LocalStorage не поддерживается в этом браузере');
    }

    // Фикс для iOS - предотвращение зума при фокусе
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            e.target.style.fontSize = '16px';
        }
    });

    // Плавный скролл к элементам при загрузке страницы с якорем
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
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

    // Уведомления
    window.showNotification = function(message, type = 'success') {
        // Проверяем, не существует ли уже уведомление
        const existingNotifications = document.querySelectorAll('.notification');
        if (existingNotifications.length >= 3) {
            existingNotifications[0].remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" aria-hidden="true"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Показываем с анимацией
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    };

    // Добавляем CSS для уведомлений (один раз)
    if (!document.querySelector('#notification-styles')) {
        const notificationCSS = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 350px;
            pointer-events: none;
        }
        .notification.show {
            transform: translateX(0);
            pointer-events: auto;
        }
        .notification-success {
            border-left: 4px solid #27ae60;
            background: #d4edda;
            color: #155724;
        }
        .notification-error {
            border-left: 4px solid #e74c3c;
            background: #f8d7da;
            color: #721c24;
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification i {
            font-size: 1.2rem;
        }
        @media (max-width: 768px) {
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
                transform: translateY(-100%);
            }
            .notification.show {
                transform: translateY(0);
            }
        }
        `;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = notificationCSS;
        document.head.appendChild(style);
    }

    // Добавляем класс для мобильных устройств
    function detectMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            document.documentElement.classList.add('is-mobile');
        }
    }
    detectMobile();

    // Плавное появление элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами с классом .animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Инициализация tooltips для иконок
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', function(e) {
                const title = this.getAttribute('title');
                if (title) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'custom-tooltip';
                    tooltip.textContent = title;
                    tooltip.style.position = 'fixed';
                    tooltip.style.background = 'rgba(0,0,0,0.8)';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '5px 10px';
                    tooltip.style.borderRadius = '4px';
                    tooltip.style.fontSize = '12px';
                    tooltip.style.zIndex = '10000';
                    tooltip.style.pointerEvents = 'none';

                    document.body.appendChild(tooltip);

                    const rect = this.getBoundingClientRect();
                    tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2) + 'px';
                    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';

                    this.setAttribute('data-tooltip', title);
                    this.removeAttribute('title');

                    el.addEventListener('mouseleave', function() {
                        if (tooltip.parentNode) {
                            tooltip.parentNode.removeChild(tooltip);
                        }
                        this.setAttribute('title', this.getAttribute('data-tooltip'));
                        this.removeAttribute('data-tooltip');
                    }, { once: true });
                }
            });
        });
    }

    // Инициализируем tooltips
    initTooltips();
});

// Добавляем класс при скролле для хедера
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Обработка ошибок загрузки изображений
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.opacity = '0.5';
        e.target.style.filter = 'grayscale(100%)';
        console.warn('Изображение не загрузилось:', e.target.src);
    }
}, true);

// Отложенная загрузка для изображений вне области видимости
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Сохранение данных формы при закрытии вкладки (для возврата пользователя)
if (typeof(Storage) !== "undefined") {
    const form = document.getElementById('contactForm');
    if (form) {
        // Восстанавливаем данные при загрузке
        ['name', 'phone', 'message', 'service'].forEach(field => {
            const savedValue = localStorage.getItem(`form_${field}`);
            const input = document.getElementById(field);
            if (input && savedValue) {
                input.value = savedValue;
            }
        });

        // Сохраняем данные при изменении
        form.addEventListener('input', function(e) {
            if (e.target.name) {
                localStorage.setItem(`form_${e.target.name}`, e.target.value);
            }
        });

        // Очищаем при успешной отправке
        form.addEventListener('submit', function() {
            ['name', 'phone', 'message', 'service'].forEach(field => {
                localStorage.removeItem(`form_${field}`);
            });
        });
    }
}