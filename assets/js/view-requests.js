function loadRequests() {
    const requests = JSON.parse(localStorage.getItem('pokraska_requests') || '[]');
    const list = document.getElementById('requestsList');
    list.innerHTML = '';

    if (requests.length === 0) {
        list.innerHTML = '<p>Нет сохраненных заявок</p>';
        return;
    }

    requests.forEach((req, index) => {
        const div = document.createElement('div');
        div.className = `request ${req.telegram_failed ? 'failed' : 'success'}`;
        div.innerHTML = `
            <h3>Заявка #${index + 1}</h3>
            <p><strong>Имя:</strong> ${req.name}</p>
            <p><strong>Телефон:</strong> ${req.phone}</p>
            <p><strong>Услуга:</strong> ${req.service || 'Не указана'}</p>
            <p><strong>Сообщение:</strong> ${req.message || 'Не указано'}</p>
            <p><strong>Время:</strong> ${new Date(req.timestamp).toLocaleString()}</p>
            <p><strong>Статус Telegram:</strong> ${req.telegram_sent ? '✅ Отправлен' : req.telegram_failed ? '❌ Не отправлен' : '❓ Неизвестно'}</p>
        `;
        list.appendChild(div);
    });
}

function clearRequests() {
    if (confirm('Очистить все сохраненные заявки?')) {
        localStorage.removeItem('pokraska_requests');
        loadRequests();
    }
}

function exportRequests() {
    const requests = JSON.parse(localStorage.getItem('pokraska_requests') || '[]');
    const dataStr = JSON.stringify(requests, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'pokraska-requests.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

loadRequests();
