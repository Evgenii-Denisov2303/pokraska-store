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
        const nameInput = form.querySelector('input[name="name"], input#name');
        const phoneInputField = form.querySelector('input[name="phone"], input#phone');
        const agree = form.querySelector('#agree')?.checked;
        const name = nameInput ? nameInput.value.trim().replace(/\s+/g, ' ') : '';
        const phone = phoneInputField ? phoneInputField.value.trim() : '';

        if (nameInput) {
            nameInput.value = name;
        }

        // Валидация имени
        if (!name || name.length < 2) {
            showMessage('Пожалуйста, введите ваше имя (минимум 2 символа)', 'error');
            return false;
        }

        // Валидация телефона
        const cleanPhone = phone.replace(/\D/g, '');
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

        const subject = form.dataset.subject || '🎨 Заявка с сайта POKRASKA.STORE';
        const nextUrl = form.dataset.next || 'https://pokraska.store/thanks.html';

        function ensureHidden(name, value) {
            let input = form.querySelector(`input[name="${name}"]`);
            if (!input) {
                input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                form.appendChild(input);
            }
            input.value = value;
        }

        ensureHidden('_subject', subject);
        ensureHidden('_captcha', 'false');
        ensureHidden('_template', 'table');
        ensureHidden('_next', nextUrl);

        const formData = new FormData(form);

        function showSuccess(message) {
            if (formSuccess) {
                if (message) {
                    const textNode = formSuccess.querySelector('p');
                    if (textNode) textNode.textContent = message;
                }
                formSuccess.classList.add('show');
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function redirectAfterSuccess() {
            if (!nextUrl) return;
            window.location.href = nextUrl;
        }

        function showError() {
            if (formError) {
                formError.classList.add('show');
                formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function submitViaIframe(data) {
            return new Promise((resolve) => {
                const iframe = document.createElement('iframe');
                iframe.name = `formsubmit-iframe-${Date.now()}`;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                const hiddenForm = document.createElement('form');
                hiddenForm.method = 'POST';
                hiddenForm.action = 'https://formsubmit.co/denisov.jeka@gmail.com';
                hiddenForm.target = iframe.name;
                hiddenForm.style.display = 'none';

                data.forEach((value, key) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    hiddenForm.appendChild(input);
                });

                document.body.appendChild(hiddenForm);
                hiddenForm.submit();

                setTimeout(() => {
                    hiddenForm.remove();
                    iframe.remove();
                    resolve();
                }, 3000);
            });
        }

        try {
            if (!window.fetch) {
                await submitViaIframe(formData);
                showSuccess('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                form.reset();
                redirectAfterSuccess();
                return;
            }

            const response = await fetch('https://formsubmit.co/ajax/denisov.jeka@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const contentType = response.headers.get('content-type') || '';
            if (!response.ok || !contentType.includes('application/json')) {
                throw new Error('FormSubmit вернул неожиданный ответ');
            }

            const result = await response.json();
            if (!result.success && result.success !== 'true') {
                throw new Error('FormSubmit вернул ошибку');
            }

            showSuccess('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            form.reset();
            redirectAfterSuccess();
        } catch (error) {
            console.error('Ошибка отправки формы:', error);

            try {
                await submitViaIframe(formData);
                showSuccess('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                form.reset();
                redirectAfterSuccess();
            } catch (iframeError) {
                console.error('Ошибка отправки через iframe:', iframeError);
                showError();

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
            }
        } finally {
            hideLoading();

            setTimeout(() => {
                if (formSuccess) formSuccess.classList.remove('show');
                if (formError) formError.classList.remove('show');
            }, 10000);
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

    if (!window.fetch) {
        const formNote = form.querySelector('.form-note');
        if (formNote) {
            formNote.innerHTML += '<br><small style="color:#666;">Для отправки формы используйте современный браузер</small>';
        }
    }
});
