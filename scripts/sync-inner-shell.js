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

    if (href.startsWith('/#')) {
        return `../index.html${href.slice(1)}`;
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

function buildMenuDataAttrs(item) {
    const attrs = [];
    if (item.group) attrs.push(`data-menu-group="${escapeHtml(item.group)}"`);
    if (item.note) attrs.push(`data-menu-note="${escapeHtml(item.note)}"`);
    return attrs.length ? ` ${attrs.join(' ')}` : '';
}

function buildHeaderNav(pageFile) {
    const activeHref = resolveActiveHref(pageFile);

    return site.navigation.map((item) => {
        const href = resolveRelativeHref(pageFile, item.href);
        const isActive = item.href === activeHref;
        const activeAttr = isActive ? ' class="active" aria-current="page"' : '';
        const icon = item.icon ? `<i class="${escapeHtml(item.icon)}" aria-hidden="true"></i> ` : '';

        return `                        <li><a href="${escapeHtml(href)}"${activeAttr}${buildMenuDataAttrs(item)}>${icon}<span class="nav-link__text">${escapeHtml(item.label)}</span></a></li>`;
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

        return `                    <a class="${classes.join(' ')}" href="${escapeHtml(href)}"${attrs.length ? ` ${attrs.join(' ')}` : ''}${buildMenuDataAttrs(item)}>${escapeHtml(item.label)}</a>`;
    }).join('\n');
}

function buildHeaderTop(pageFile) {
    const homeHref = resolveRelativeHref(pageFile, '/index.html');
    const primary = site.contact.primaryPhone || {};
    const secondary = site.contact.secondaryPhone || {};

    return `            <div class="header-top header-top--compact">
                <div class="logo hero-brand">
                    <a href="${escapeHtml(homeHref)}" class="logo-link hero-brand__link" aria-label="Перейти на главную страницу">
                        <div class="hero-brand__mark logo-main logo-main--image">
                            <img class="hero-brand__logo logo-image" src="../assets/images/logo.png" width="700" height="700" alt="${escapeHtml(site.brand.logo.alt || site.brand.logoAlt || site.brand.name)}" loading="lazy" decoding="async">
                            <span class="logo-wave hero-brand__wave" aria-hidden="true"></span>
                        </div>
                        <div class="hero-brand__text">
                            <span class="hero-brand__eyebrow">${escapeHtml(site.brand.tagline)}</span>
                            <span class="hero-brand__name">${escapeHtml(site.brand.name)}</span>
                        </div>
                    </a>
                </div>

                <div class="header-contact-stack">
                    <a href="${escapeHtml(primary.href || '#')}" class="contact-phone">
                        <i class="fas fa-phone" aria-hidden="true"></i>
                        <div class="phone-info">
                            <span class="phone-number">${escapeHtml(primary.label || '')}</span>
                            <span class="phone-label">${escapeHtml(primary.note || '')}</span>
                        </div>
                    </a>
                    <a href="${escapeHtml(secondary.href || '#')}" class="contact-phone">
                        <i class="fas fa-phone" aria-hidden="true"></i>
                        <div class="phone-info">
                            <span class="phone-number">${escapeHtml(secondary.label || '')}</span>
                        </div>
                    </a>
                    <div class="contact-address">
                        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                        <span>${escapeHtml(site.contact.address || '')}</span>
                    </div>
                </div>

                <nav class="nav" id="site-mobile-nav" aria-label="Основная навигация">
                    <ul class="nav-list">
${buildHeaderNav(pageFile)}
                    </ul>
                </nav>
                <div class="header-actions">
                    <button class="hero-menu-toggle mobile-menu-btn" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="site-mobile-nav">
                        <span class="hero-menu-toggle__bars" aria-hidden="true">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                        <span class="hero-menu-toggle__label">Меню</span>
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

function buildPreviewFooterContactList() {
    const fullAddress = normalizeWhitespace(site.contact.address || '').toLowerCase().startsWith('казань')
        ? site.contact.address || ''
        : `Казань, ${site.contact.address || ''}`;

    return `                        <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${escapeHtml(fullAddress)}</li>
                        <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="${escapeHtml(site.contact.secondaryPhone?.href || '#')}">${escapeHtml(site.contact.secondaryPhone?.label || '')}</a></li>
                        <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="${escapeHtml(site.contact.primaryPhone?.href || '#')}">${escapeHtml(site.contact.primaryPhone?.label || '')}</a></li>
                        <li><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:${escapeHtml(site.contact.email || '')}">${escapeHtml(site.contact.email || '')}</a></li>
                        <li><i class="fas fa-clock" aria-hidden="true"></i> ${escapeHtml(site.contact.hours || '')}</li>
                        <li><i class="fab fa-telegram-plane" aria-hidden="true"></i> <a href="${escapeHtml(site.contact.telegram?.href || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contact.telegram?.label || 'Telegram')}</a></li>
                        <li><i class="fas fa-comment-dots" aria-hidden="true"></i> <a href="${escapeHtml(site.contact.max?.href || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contact.max?.label || 'Max')}</a></li>`;
}

function buildPreviewFooterUsefulList(pageFile) {
    return (site.footer?.usefulLinks || []).map((item) => {
        const href = resolveRelativeHref(pageFile, item.href);
        return `                        <li><a href="${escapeHtml(href)}">${escapeHtml(item.label || '')}</a></li>`;
    }).join('\n');
}

function buildPreviewFooterBottom(pageFile) {
    const currentYear = new Date().getFullYear();
    const startYear = Number(site.brand?.copyrightStartYear) || currentYear;
    const yearRange = startYear >= currentYear ? `${currentYear}` : `${startYear}-${currentYear}`;
    const policyHref = resolveRelativeHref(pageFile, site.footer?.policyHref || '/politika.html');

    return `            <div class="preview-footer__bottom">
                <p>&copy; ${escapeHtml(yearRange)} ${escapeHtml(site.brand?.footerCaption || '')}</p>
                <p><a href="${escapeHtml(policyHref)}">${escapeHtml(site.footer?.policyLabel || 'Политика конфиденциальности')}</a> | Домен: ${escapeHtml(site.brand?.domain || '')}</p>
            </div>`;
}

function buildPreviewFooter(pageFile) {
    const homeHref = resolveRelativeHref(pageFile, '/index.html');
    const companyParagraphs = (site.footer?.companyParagraphs || [])
        .map((text) => `                <p class="preview-footer__legal-text">${escapeHtml(text)}</p>`)
        .join('\n');
    const usefulLinks = buildPreviewFooterUsefulList(pageFile);

    return `    <footer id="page-footer" class="preview-footer" aria-label="Футер сайта">
        <div class="preview-footer__layout">
            <div class="preview-footer__column preview-footer__column--company">
                <a class="preview-footer__brand" href="${escapeHtml(homeHref)}#top" aria-label="Наверх">
                    <span class="preview-footer__mark logo-main logo-main--image" aria-hidden="true">
                        <img class="preview-footer__logo logo-image" src="../assets/images/logo.png" alt="">
                        <span class="logo-wave preview-footer__wave" aria-hidden="true"></span>
                    </span>
                    <span class="preview-footer__brand-copy">
                        <span class="preview-footer__label">Компания</span>
                        <span class="preview-footer__company">${escapeHtml(site.footer?.companyTitle || 'ООО «Комфорт Плюс»')}</span>
                    </span>
                </a>
${companyParagraphs}
            </div>

            <div class="preview-footer__column preview-footer__column--contacts">
                <span class="preview-footer__label">Контакты</span>
                <ul class="preview-footer__list preview-footer__list--contacts">
${buildPreviewFooterContactList()}
                </ul>
            </div>

            <div class="preview-footer__column preview-footer__column--useful">
                <span class="preview-footer__label">${escapeHtml(site.footer?.usefulTitle || 'Полезное')}</span>
                <ul class="preview-footer__list">
${usefulLinks}
                </ul>
            </div>
        </div>

${buildPreviewFooterBottom(pageFile)}
    </footer>`;
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
        /[ \t]*<footer\b[^>]*class="(?:footer|preview-footer[^"]*)"[^>]*>[\s\S]*?<\/footer>/,
        buildPreviewFooter(pageFile),
        'footer-preview-replacement',
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
