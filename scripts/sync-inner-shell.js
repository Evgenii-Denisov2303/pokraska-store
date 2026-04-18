const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pagesDir = path.join(repoRoot, 'pages');
const sitePath = path.join(repoRoot, 'content', 'site.json');

const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));

const pageFiles = fs.readdirSync(pagesDir)
    .filter((file) => file.endsWith('.html'))
    .sort();

function normalizeWhitespace(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function resolveRelativeHref(pageFile, href) {
    if (!href) return '#';
    if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
        return href;
    }

    if (href === '/index.html') {
        return '../index.html';
    }

    if (href === '/politika.html') {
        return '../politika.html';
    }

    if (href.startsWith('/pages/')) {
        return href.replace('/pages/', '');
    }

    return href.replace(/^\/+/, '');
}

function resolveActiveHref(pageFile) {
    if (pageFile === 'services.html' || pageFile.startsWith('automation-')) {
        return '/pages/services.html';
    }

    return `/pages/${pageFile}`;
}

function buildHeaderNav(pageFile) {
    const activeHref = resolveActiveHref(pageFile);

    return site.navigation.map((item) => {
        const href = resolveRelativeHref(pageFile, item.href);
        const isActive = item.href === activeHref;
        const activeAttr = isActive ? ' class="active" aria-current="page"' : '';
        const icon = item.icon ? `<i class="${escapeHtml(item.icon)}"></i> ` : '';

        return `                    <li><a href="${escapeHtml(href)}"${activeAttr}>${icon}${escapeHtml(item.label)}</a></li>`;
    }).join('\n');
}

function buildHeroNav(pageFile) {
    const activeHref = resolveActiveHref(pageFile);

    return site.navigation.map((item) => {
        const href = resolveRelativeHref(pageFile, item.href);
        const classes = ['hero-nav__link'];
        const attrs = [];

        if (item.href === activeHref) {
            classes.push('hero-nav__link--active');
            attrs.push('aria-current="page"');
        }

        return `                    <a class="${classes.join(' ')}" href="${escapeHtml(href)}"${attrs.length ? ` ${attrs.join(' ')}` : ''}>${escapeHtml(item.label)}</a>`;
    }).join('\n');
}

function buildHeaderTop(pageFile) {
    const homeHref = resolveRelativeHref(pageFile, '/index.html');
    const primary = site.contact.primaryPhone || {};
    const secondary = site.contact.secondaryPhone || {};

    return `            <div class="header-top header-top--compact">
                <div class="logo">
                    <a href="${escapeHtml(homeHref)}" class="logo-link" aria-label="Перейти на главную страницу">
                        <div class="logo-premium">
                            <div class="logo-main logo-main--image">
                                <img src="../assets/images/logo.png" width="700" height="700" alt="${escapeHtml(site.brand.logo.alt || site.brand.logoAlt || site.brand.name)}" class="logo-image">
                                <span class="logo-wave" aria-hidden="true"></span>
                            </div>
                            <div class="logo-tagline">
                                ${escapeHtml(site.brand.tagline)}
                            </div>
                        </div>
                    </a>
                </div>

                <div class="header-contact-stack">
                    <a href="${escapeHtml(primary.href || '#')}" class="contact-phone">
                        <i class="fas fa-phone"></i>
                        <div class="phone-info">
                            <span class="phone-number">${escapeHtml(primary.label || '')}</span>
                            <span class="phone-label">${escapeHtml(primary.note || '')}</span>
                        </div>
                    </a>
                    <a href="${escapeHtml(secondary.href || '#')}" class="contact-phone">
                        <i class="fas fa-phone"></i>
                        <div class="phone-info">
                            <span class="phone-number">${escapeHtml(secondary.label || '')}</span>
                        </div>
                    </a>
                    <div class="contact-address">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${escapeHtml(site.contact.address || '')}</span>
                    </div>
                </div>

                <nav class="nav" aria-label="Основная навигация">
                    <ul class="nav-list">
${buildHeaderNav(pageFile)}
                    </ul>
                </nav>
                <div class="header-actions">
                    <button class="mobile-menu-btn" aria-label="Открыть меню" aria-expanded="false">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function buildHeroHeader(pageFile) {
    const homeHref = resolveRelativeHref(pageFile, '/index.html');
    const primary = site.contact.primaryPhone || {};
    const secondary = site.contact.secondaryPhone || {};

    return `        <div class="hero-header desktop-hero-header internal-scene-header">
            <div class="hero-scene__topbar">
                <div class="hero-brand">
                    <a class="hero-brand__link" href="${escapeHtml(homeHref)}" aria-label="${escapeHtml(site.brand.name)}">
                        <div class="hero-brand__mark logo-main logo-main--image">
                            <img class="hero-brand__logo logo-image" src="../assets/images/logo.png" alt="${escapeHtml(site.brand.name)}">
                            <span class="logo-wave hero-brand__wave" aria-hidden="true"></span>
                        </div>
                        <div class="hero-brand__text">
                            <span class="hero-brand__eyebrow">${escapeHtml(site.brand.tagline)}</span>
                            <span class="hero-brand__name">${escapeHtml(site.brand.name)}</span>
                        </div>
                    </a>
                </div>
            </div>
            <div class="hero-header-row">
                <nav class="hero-scene__nav" aria-label="Основная навигация">
${buildHeroNav(pageFile)}
                </nav>
                <div class="hero-header-stack" aria-label="Контакты компании">
                    <a class="hero-header-link hero-header-link--primary" href="${escapeHtml(primary.href || '#')}">
                        <i class="fas fa-phone" aria-hidden="true"></i>
                        <span class="hero-header-text">
                            <strong class="hero-header-main">${escapeHtml(primary.label || '')}</strong>
                            <span class="hero-header-sub"${primary.note ? '' : ' hidden'}>${escapeHtml(primary.note || '')}</span>
                        </span>
                    </a>
                    <a class="hero-header-link hero-header-link--secondary" href="${escapeHtml(secondary.href || '#')}">
                        <i class="fas fa-phone" aria-hidden="true"></i>
                        <span class="hero-header-text">
                            <strong class="hero-header-main">${escapeHtml(secondary.label || '')}</strong>
                        </span>
                    </a>
                    <div class="hero-header-address">
                        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                        <span>${escapeHtml(site.contact.address || '')}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
}

function buildFooterContactList() {
    const fullAddress = normalizeWhitespace(site.contact.address || '').toLowerCase().startsWith('казань')
        ? site.contact.address || ''
        : `Казань, ${site.contact.address || ''}`;

    return `                        <li><i class="fas fa-map-marker-alt"></i> ${escapeHtml(fullAddress)}</li>
                        <li><i class="fas fa-phone"></i> <a href="${escapeHtml(site.contact.secondaryPhone?.href || '#')}">${escapeHtml(site.contact.secondaryPhone?.label || '')}</a></li>
                        <li><i class="fas fa-phone"></i> <a href="${escapeHtml(site.contact.primaryPhone?.href || '#')}">${escapeHtml(site.contact.primaryPhone?.label || '')}</a></li>
                        <li><i class="fas fa-envelope"></i> <a href="mailto:${escapeHtml(site.contact.email || '')}">${escapeHtml(site.contact.email || '')}</a></li>
                        <li><i class="fas fa-clock"></i> ${escapeHtml(site.contact.hours || '')}</li>
                        <li><a href="${escapeHtml(site.contact.telegram?.href || '#')}" target="_blank" rel="noopener noreferrer"><i class="fab fa-telegram-plane" aria-hidden="true"></i> ${escapeHtml(site.contact.telegram?.label || 'Telegram')}</a></li>
                        <li><a href="${escapeHtml(site.contact.max?.href || '#')}" target="_blank" rel="noopener noreferrer"><i class="fas fa-comment-dots" aria-hidden="true"></i> ${escapeHtml(site.contact.max?.label || 'Max')}</a></li>`;
}

function buildFooterBottom() {
    const startYear = Number(site.brand.copyrightStartYear) || new Date().getFullYear();
    const yearRange = startYear === new Date().getFullYear()
        ? `${startYear}`
        : `${startYear}-<span id="currentYear"></span>`;

    return `            <div class="footer-bottom">
                <p>&copy; ${yearRange} ${escapeHtml(site.brand.footerCaption || '')}</p>
                <p><a href="../politika.html">${escapeHtml(site.footer.policyLabel || 'Политика конфиденциальности')}</a> | Домен: ${escapeHtml(site.brand.domain || '')}</p>
            </div>`;
}

function replaceOrThrow(content, pattern, replacement, label, pageFile) {
    if (!pattern.test(content)) {
        throw new Error(`Не найден блок "${label}" в ${pageFile}`);
    }

    return content.replace(pattern, replacement);
}

function syncPage(pageFile) {
    const filePath = path.join(pagesDir, pageFile);
    const original = fs.readFileSync(filePath, 'utf8');
    let next = original;

    next = replaceOrThrow(
        next,
        /[ \t]*<div class="header-top header-top--compact">[\s\S]*?<\/div>\s*<\/header>/,
        `${buildHeaderTop(pageFile)}</header>`,
        'header-top',
        pageFile
    );

    next = replaceOrThrow(
        next,
        /[ \t]*<div class="hero-header desktop-hero-header internal-scene-header">[\s\S]*?(?=<div class="hero-stage internal-hero-stage">)/,
        buildHeroHeader(pageFile),
        'hero-header',
        pageFile
    );

    next = replaceOrThrow(
        next,
        /([ \t]*<ul class="contact-list">)[\s\S]*?([ \t]*<\/ul>)/,
        `$1\n${buildFooterContactList()}\n$2`,
        'footer-contact-list',
        pageFile
    );

    next = replaceOrThrow(
        next,
        /[ \t]*<div class="footer-bottom">[\s\S]*?<\/div>/,
        buildFooterBottom(),
        'footer-bottom',
        pageFile
    );

    if (next !== original) {
        fs.writeFileSync(filePath, next, 'utf8');
        return true;
    }

    return false;
}

let updatedCount = 0;
for (const pageFile of pageFiles) {
    if (syncPage(pageFile)) {
        updatedCount += 1;
    }
}

console.log(`Synced inner shell on ${updatedCount} page(s).`);
