(() => {
    'use strict';

    // Only known services become public form text; never echo arbitrary query input.
    const services = {
        'powder-coating': 'Порошковая покраска',
        sandblasting: 'Пескоструйная обработка',
        'gates-sliding': 'Откатные ворота',
        'gates-swing': 'Распашные ворота',
        gates: 'Ворота и калитки',
        fences: 'Заборы',
        automation: 'Автоматика',
        garage: 'Гараж и защита'
    };
    const key = new URLSearchParams(window.location.search).get('service');
    if (!Object.prototype.hasOwnProperty.call(services, key)) return;

    const label = services[key];
    const message = `Нужен расчёт: ${label}.`;
    document.querySelectorAll('[data-request-context]').forEach(container => {
        const text = container.querySelector('[data-request-service]');
        if (text) text.textContent = label;
        container.hidden = false;
    });

    // Yandex Forms supports GET prefill. Run before embed-loader starts loading,
    // and only on initial navigation so an edited draft is never overwritten.
    document.querySelectorAll('iframe[data-request-embed]').forEach(frame => {
        const attribute = frame.hasAttribute('data-src') ? 'data-src' : 'src';
        const url = new URL(frame.getAttribute(attribute), window.location.href);
        const field = frame.dataset.requestField;
        if (url.hostname !== 'forms.yandex.ru' || !field) return;
        url.searchParams.set(field, message);
        frame.setAttribute(attribute, url.href);
        document.querySelectorAll('[data-request-form-link]').forEach(link => {
            link.href = url.href;
        });
    });

    document.querySelectorAll('a[data-request-whatsapp]').forEach(link => {
        const url = new URL(link.href);
        if (url.protocol !== 'https:' || url.hostname !== 'wa.me') return;
        url.searchParams.set('text', message);
        link.href = url.href;
    });
})();
