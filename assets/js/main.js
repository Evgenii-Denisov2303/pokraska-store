// ========== MAIN JS ==========
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню - ИСПРАВЛЕННАЯ ВЕРСИЯ
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;
    let isMenuOpen = false;
    let isAnimating = false;

    // Функция для проверки мобильного режима
    function isMobile() {
        return window.innerWidth <= 768;
    }

    if (mobileMenuBtn && nav) {
        // Функция открытия/закрытия меню
        function toggleMobileMenu() {
            if (isAnimating) return; // Защита от быстрых повторных кликов

            isAnimating = true;

            if (!isMenuOpen) {
                // Открываем меню
                // НЕ используем style.display = 'flex' - CSS уже это делает через .nav.active
                requestAnimationFrame(() => {
                    nav.classList.add('active');
                });
                body.style.overflow = 'hidden'; // Блокируем скролл страницы
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                isMenuOpen = true;
            } else {
                // Закрываем меню
                nav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = ''; // Разблокируем скролл
                isMenuOpen = false;

                // УДАЛИЛ: setTimeout для скрытия меню - CSS сам управляет отображением
            }

            // Снимаем блокировку через 300мс (время анимации)
            setTimeout(() => {
                isAnimating = false;
            }, 300);
        }

        // Инициализация - НИЧЕГО НЕ ДЕЛАЕМ!
        // nav.style.display = ''; // УДАЛИТЬ ЭТУ СТРОКУ ПОЛНОСТЬЮ!
        // CSS сам управляет отображением через медиа-запросы

        // Если мы на десктопе, убедимся что меню видимо
        if (!isMobile()) {
            nav.classList.remove('active'); // Убираем класс active если он был
            // Не трогаем display - CSS сам всё настроит
        }

        // Один обработчик вместо нескольких
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие
            toggleMobileMenu();
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (nav && isMenuOpen) {
                    // Плавное закрытие меню
                    nav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                    isMenuOpen = false;
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
            }
        });
    }

    // Закрытие меню при ресайзе окна - УПРОЩЕННАЯ ВЕРСИЯ
    window.addEventListener('resize', () => {
        if (nav) {
            // Если перешли на десктоп, закрываем мобильное меню
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
                body.style.overflow = '';
                isMenuOpen = false;
            }
        }
    });

    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });

                // Обновляем URL без перезагрузки
                history.pushState(null, null, href);
            }
        });
    });

    // Активный пункт меню при прокрутке
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            const scrollPosition = window.scrollY + 100;

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

                // Проверяем, является ли ссылка якорем к текущей секции
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
                // Для главной страницы
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

    // Уведомления
    window.showNotification = function(message, type = 'success') {
        // Проверяем, не существует ли уже уведомление
        const existingNotifications = document.querySelectorAll('.notification');
        if (existingNotifications.length >= 3) {
            // Удаляем самое старое
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
}); 
