// ========== FORM HANDLER FOR SIMPLE FORMSUBMIT ==========
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // УПРОЩЕННАЯ маска для телефона
    const phoneInput = form.querySelector('input[name="Телефон"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            // Ограничиваем длину
            if (value.length > 11) {
                value = value.substring(0, 11);
            }

            // Простое форматирование при достаточной длине
            if (value.length >= 10) {
                // Формат: +7 (XXX) XXX-XX-XX
                let formatted = '+7 (' + value.substring(1, 4) + ') ' +
                               value.substring(4, 7) + '-' +
                               value.substring(7, 9) + '-' +
                               value.substring(9, 11);

                // Обрезаем лишние символы
                formatted = formatted.replace(/-+$/, '');
                formatted = formatted.replace(/\)\s+$/, ')');

                e.target.value = formatted;
            } else if (value.length > 0) {
                // Просто показываем цифры без форматирования
                e.target.value = value;
            }
        });

        // При фокусе очищаем от форматирования для удобного редактирования
        phoneInput.addEventListener('focus', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('7') && value.length > 1) {
                this.value = value.substring(1); // Убираем ведущую 7
            }
        });

        // При потере фокуса - форматируем
        phoneInput.addEventListener('blur', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 10) {
                // Добавляем 7 если её нет
                if (!value.startsWith('7') && value.length === 10) {
                    value = '7' + value;
                }

                // Форматируем
                this.value = '+7 (' + value.substring(1, 4) + ') ' +
                            value.substring(4, 7) + '-' +
                            value.substring(7, 9) + '-' +
                            value.substring(9, 11);
            }
        });
    }

    // Валидация перед отправкой
    form.addEventListener('submit', function(e) {
        const name = form.querySelector('[name="Имя"]').value.trim();
        const phone = form.querySelector('[name="Телефон"]').value.trim();
        const messageDiv = document.getElementById('formMessage');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Очищаем предыдущие сообщения
        if (messageDiv) {
            messageDiv.innerHTML = '';
            messageDiv.style.display = 'none';
        }

        // Простая валидация
        if (!name || !phone) {
            e.preventDefault();
            showMessage('Заполните имя и телефон', 'error');
            return;
        }

        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 11) {  // ← Изменил с 10 на 11 (7 + 10 цифр)
            e.preventDefault();
            showMessage('Введите корректный номер телефона (10 цифр)', 'error');
            return;
        }

        // Показываем сообщение об отправке
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';

            // Через 5 секунд восстановим кнопку (на случай ошибки)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 5000);
        }
    });

    // Функция показа сообщений
    function showMessage(text, type) {
        const messageDiv = document.getElementById('formMessage');
        if (!messageDiv) return;

        messageDiv.innerHTML = text;
        messageDiv.className = 'form-message ' + type;
        messageDiv.style.display = 'block';

        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        }

        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
                messageDiv.innerHTML = '';
            }, 5000);
        }
    }
});