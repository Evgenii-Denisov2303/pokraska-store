// ========== FORM HANDLER FOR SIMPLE FORMSUBMIT ==========
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Маска для телефона
    const phoneInput = form.querySelector('input[name="Телефон"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (!value.startsWith('7') && !value.startsWith('8')) {
                    value = '7' + value;
                }
                if (value.length > 1) {
                    value = '+7 (' + value.substring(1, 4) + ') ' +
                            value.substring(4, 7) + '-' +
                            value.substring(7, 9) + '-' +
                            value.substring(9, 11);
                }
            }
            e.target.value = value;
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
        if (cleanPhone.length < 10) {
            e.preventDefault();
            showMessage('Введите корректный номер телефона', 'error');
            return;
        }

        // Показываем сообщение об отправке
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';

            // Форма отправится стандартным способом через Formsubmit
            // Через 3 секунды восстановим кнопку
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 3000);
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

    // Сохраняем данные в localStorage для истории
    function saveToLocalStorage(data) {
        try {
            let requests = JSON.parse(localStorage.getItem('pokraska_requests') || '[]');
            requests.push(data);

            if (requests.length > 50) {
                requests = requests.slice(-50);
            }

            localStorage.setItem('pokraska_requests', JSON.stringify(requests));
            console.log('✅ Заявка сохранена локально');

        } catch(e) {
            console.log('⚠️ Не удалось сохранить в localStorage');
        }
    }
});