(() => {
    'use strict';

    const scriptURL = document.currentScript.src;
    const configURL = new URL('../../content/site.json', scriptURL);
    const definitions = [
        { key: 'max', label: 'MAX', host: 'max.ru' },
        { key: 'telegram', label: 'Telegram', host: 't.me', icon: 'fab fa-telegram-plane' },
        { key: 'whatsapp', label: 'WhatsApp', host: 'wa.me', icon: 'fab fa-whatsapp' }
    ];
    const chatIcon = '<svg class="contact-widget__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/><path d="M8 10h8M8 14h5"/></svg>';
    const closeIcon = '<svg class="contact-widget__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="m7 7 10 10M17 7 7 17"/></svg>';
    // Monochrome silhouette from MAX's official https://max.ru/favicon.svg.
    const maxIcon = '<svg class="contact-widget__icon" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" focusable="false"><path d="M50.7571 0.261719C78.2929 0.261719 99.8857 22.5974 99.8857 50.1474C99.8857 77.6974 77.6071 99.4903 51.0214 99.4903C41.5857 99.4903 37.0143 98.1617 29.65 92.9474C29.1429 92.5903 28.45 92.6831 28.0214 93.1403C22.3571 99.1831 7.85 103.426 7.18571 95.176C7.18571 80.7903 0 71.4474 0 49.876C0 21.5546 23.2214 0.261719 50.7571 0.261719ZM51.5286 24.8117C38.4643 24.126 28.2643 33.1974 26.0143 47.3831C24.15 59.1332 27.45 73.4546 30.2786 74.176C31.4786 74.4832 34.3571 72.276 36.4571 70.2974C36.85 69.926 37.45 69.8617 37.9071 70.1474C41.1786 72.1474 44.8786 73.6474 48.9571 73.8617C62.3714 74.5617 74.2571 64.0617 74.9643 50.6474C75.6643 37.2331 64.9429 25.5046 51.5286 24.8046V24.8117Z"/></svg>';

    function validHref(value, definition) {
        try {
            const url = new URL(value);
            if (url.protocol !== 'https:' || url.hostname !== definition.host || url.port
                || url.username || url.password || url.pathname === '/') return null;
            if (definition.key === 'whatsapp' && !/^\/\d+$/.test(url.pathname)) return null;
            return url.href;
        } catch { return null; }
    }

    function mount(contact) {
        if (document.querySelector('.contact-widget')) return;
        const channels = definitions.flatMap(definition => {
            const href = validHref(contact?.[definition.key]?.href, definition);
            return href ? [{ ...definition, href }] : [];
        });
        if (!channels.length) return;

        const widget = document.createElement('div');
        widget.className = 'contact-widget';
        const toggle = document.createElement('button');
        toggle.className = 'contact-widget__toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Открыть мессенджеры');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'contact-widget-links');
        toggle.innerHTML = chatIcon;

        const list = document.createElement('ul');
        list.className = 'contact-widget__links';
        list.id = 'contact-widget-links';
        list.setAttribute('aria-label', 'Написать в мессенджер');
        list.hidden = true;
        channels.forEach(channel => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'contact-widget__link';
            link.dataset.messenger = channel.key;
            link.href = channel.href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', `Написать в ${channel.label} (откроется в новой вкладке)`);
            link.title = channel.label;
            if (channel.key === 'max') {
                link.innerHTML = maxIcon;
            } else {
                const icon = document.createElement('i');
                icon.className = channel.icon;
                icon.setAttribute('aria-hidden', 'true');
                link.append(icon);
            }
            item.append(link);
            list.append(item);
        });
        // DOM order keeps keyboard navigation: toggle -> messenger links.
        widget.append(toggle, list);
        document.body.append(widget);

        function setOpen(open) {
            list.hidden = !open;
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Закрыть мессенджеры' : 'Открыть мессенджеры');
            toggle.innerHTML = open ? closeIcon : chatIcon;
        }

        toggle.addEventListener('click', () => setOpen(list.hidden));
        document.addEventListener('click', event => {
            if (!widget.contains(event.target)) setOpen(false);
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && !list.hidden) {
                setOpen(false);
                toggle.focus({ preventScroll: true });
            }
        });
        widget.addEventListener('focusout', event => {
            // During blur, activeElement can briefly be body. relatedTarget keeps
            // Tab from hiding the very messenger link that is about to receive focus.
            if (event.relatedTarget) {
                if (!widget.contains(event.relatedTarget)) setOpen(false);
            } else {
                setTimeout(() => {
                    if (!widget.contains(document.activeElement)) setOpen(false);
                }, 0);
            }
        });

        const visibleForms = new Set();
        function updateAvailability() {
            const editing = document.activeElement?.matches('input, textarea, select, iframe, [contenteditable="true"]');
            const covered = document.body.matches('.menu-open, .modal-open');
            const hidden = Boolean(editing || covered || visibleForms.size);
            if (hidden) setOpen(false);
            widget.hidden = hidden;
            widget.inert = hidden;
        }
        // Don't float on top of navigation, photo viewers, keyboards or Yandex forms.
        new MutationObserver(updateAvailability).observe(document.body, {
            attributes: true, attributeFilter: ['class']
        });
        document.addEventListener('focusin', updateAvailability);
        document.addEventListener('focusout', () => queueMicrotask(updateAvailability));
        window.addEventListener('blur', () => setTimeout(updateAvailability, 0));
        window.addEventListener('focus', updateAvailability);
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) visibleForms.add(entry.target);
                    else visibleForms.delete(entry.target);
                });
                updateAvailability();
            });
            document.querySelectorAll('iframe[src*="forms.yandex.ru"], iframe[data-src*="forms.yandex.ru"]')
                .forEach(frame => observer.observe(frame));
        }
        updateAvailability();
    }

    async function initialize() {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        try {
            // The shared public config is the only source of messenger destinations.
            // Revalidate it so adding a contact doesn't require changing every HTML page.
            const response = await fetch(configURL, { cache: 'no-cache', signal: controller.signal });
            if (!response.ok) throw new Error('Contact configuration unavailable');
            const site = await response.json();
            mount(site.contact);
        } catch {
            // Offline/config failure: use only validated links already printed in the footer.
            const contact = {};
            document.querySelectorAll('footer a[href]').forEach(link => {
                definitions.forEach(definition => {
                    if (validHref(link.href, definition)) contact[definition.key] = { href: link.href };
                });
            });
            mount(contact);
        } finally { clearTimeout(timeout); }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else { initialize(); }
})();
