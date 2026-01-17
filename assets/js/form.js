// ========== FORM.JS ==========
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Получаем элементы формы
    const submitBtn = form.querySelector('button[type="submit"]');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Маска для телефона
    const phoneInput = form.querySelector('input[type="tel"], input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');

            // Ограничиваем длину
            if (value.length > 11) {
                value = value.substring(0, 11);
            }

            // Форматирование
            if (value.length >= 1) {
                let formatted = '';

                // Если начинается с 7, 8 или 9
                if (value.startsWith('7') || value.startsWith('8') || value.startsWith('9')) {
                    // Если начинается с 8, заменяем на 7
                    if (value.startsWith('8')) {
                        value = '7' + value.substring(1);
                    }

                    // Форматируем по частям
                    formatted = '+7 ';
                    if (value.length > 1) formatted += value.substring(1, 4);
                    if (value.length > 4) formatted += ' ' + value.substring(4, 7);
                    if (value.length > 7) formatted += '-' + value.substring(7, 9);
                    if (value.length > 9) formatted += '-' + value.substring(9, 11);
                } else {
                    // Если номер вводится без кода страны
                    formatted = value;
                }

                this.value = formatted.trim();
            }
        });

        // При фокусе - очищаем для удобного редактирования
        phoneInput.addEventListener('focus', function() {
            this.setSelectionRange(this.value.length, this.value.length);
        });
    }

    // Функции для работы с UI
    function hideMessages() {
        if (formSuccess) formSuccess.classList.remove('show');
        if (formError) formError.classList.remove('show');
    }

    function showLoading() {
        if (loadingOverlay) loadingOverlay.classList.add('show');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
        }
    }

    function hideLoading() {
        if (loadingOverlay) loadingOverlay.classList.remove('show');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
        }
    }

    // Валидация формы
    function validateForm() {
        const name = form.querySelector('[name="name"]')?.value.trim();
        const phone = form.querySelector('[name="phone"]')?.value.trim();
        const agree = form.querySelector('#agree')?.checked;

        // Валидация имени
        if (!name || name.length < 2) {
            showMessage('Пожалуйста, введите ваше имя (минимум 2 символа)', 'error');
            return false;
        }

        // Валидация телефона
        const cleanPhone = phone?.replace(/\D/g, '') || '';
        if (cleanPhone.length < 10) {
            showMessage('Пожалуйста, введите корректный номер телефона (10 цифр)', 'error');
            return false;
        }

        // Валидация чекбокса
        if (!agree) {
            showMessage('Пожалуйста, согласитесь на обработку персональных данных', 'error');
            return false;
        }

        return true;
    }

    // Показать сообщение
    function showMessage(text, type) {
        if (type === 'error') {
            alert(text); // Простое уведомление для ошибок
            return;
        }

        // Для успеха используем существующий блок
        if (type === 'success' && formSuccess) {
            formSuccess.querySelector('h4').nextElementSibling.textContent = text;
            formSuccess.classList.add('show');
        }
    }

    // Обработчик отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        hideMessages();

        if (!validateForm()) {
            return;
        }

        showLoading();

        try {
            // Подготавливаем данные для FormSubmit
            const formData = new FormData(form);

            // Добавляем дополнительные параметры для FormSubmit
            formData.append('_subject', '🎨 Заявка с сайта POKRASKA.STORE');
            formData.append('_captcha', 'false');
            formData.append('_template', 'table');
            formData.append('_next', 'https://pokraska.store/thanks.html');

            // Отправка через FormSubmit
            const response = await fetch('https://formsubmit.co/ajax/denisov.jeka@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                // Показываем успех
                if (formSuccess) {
                    formSuccess.classList.add('show');
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Сбрасываем форму
                form.reset();

                // Прячем сообщение через 10 секунд
                setTimeout(() => {
                    if (formSuccess) formSuccess.classList.remove('show');
                }, 10000);

            } else {
                throw new Error('FormSubmit вернул ошибку');
            }

        } catch (error) {
            console.error('Ошибка отправки формы:', error);

            // Показываем ошибку
            if (formError) {
                formError.classList.add('show');
                formError.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Прячем ошибку через 10 секунд
                setTimeout(() => {
                    if (formError) formError.classList.remove('show');
                }, 10000);
            }

            // Предлагаем альтернативу
            if (confirm('Не удалось отправить форму автоматически. Хотите отправить письмо вручную через почтовый клиент?')) {
                const name = form.querySelector('[name="name"]')?.value.trim() || '';
                const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
                const service = form.querySelector('[name="service"]')?.value.trim() || 'Не указано';
                const message = form.querySelector('[name="message"]')?.value.trim() || 'Не указано';

                const mailtoBody = `Имя: ${encodeURIComponent(name)}%0D%0A` +
                                 `Телефон: ${encodeURIComponent(phone)}%0D%0A` +
                                 `Услуга: ${encodeURIComponent(service)}%0D%0A` +
                                 `Сообщение: ${encodeURIComponent(message)}%0D%0A%0D%0A` +
                                 `Страница: ${encodeURIComponent(window.location.href)}`;

                window.location.href = `mailto:denisov.jeka@gmail.com?subject=${encodeURIComponent('Заявка с сайта POKRASKA.STORE')}&body=${mailtoBody}`;
            }
        } finally {
            hideLoading();
        }
    });

    // Автоматическое скрытие сообщений при клике
    [formSuccess, formError].forEach(element => {
        if (element) {
            element.addEventListener('click', () => {
                element.classList.remove('show');
            });
        }
    });
});