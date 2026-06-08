const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publicHtmlIgnore = new Set([
    'admin/index.html',
    'content/catalog-panels-fragment.html'
]);
const allowedHtmlOutsideSitemap = new Set([
    'politica.html'
]);
const ignoredDirs = new Set([
    '.git',
    '.github',
    'node_modules',
    'playwright-report',
    'test-results'
]);
const localAttrs = ['href', 'src', 'srcset', 'data-src', 'data-thumb-src'];
const deferredHtmlSourceAttrs = ['data-catalog-panels-source'];
const tempNamePattern = /^(tmp_|\.codex-temp$|\.codex-temp-|.*\.tmp$|.*\.bak$)/i;

const errors = [];
const warnings = [];

function toPosix(filePath) {
    return filePath.split(path.sep).join('/');
}

function fromRoot(filePath) {
    return toPosix(path.relative(rootDir, filePath));
}

function isInsideRoot(filePath) {
    const rel = path.relative(rootDir, filePath);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory() && ignoredDirs.has(entry.name)) {
            continue;
        }

        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath, files);
        } else {
            files.push(fullPath);
        }
    }

    return files;
}

function readText(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function stripQueryAndHash(value) {
    return value.split('#')[0].split('?')[0];
}

function isExternalOrPseudo(value) {
    return /^(https?:|mailto:|tel:|data:|javascript:)/i.test(value)
        || value.startsWith('#')
        || value.startsWith('//');
}

function resolveLocalUrl(baseDir, value) {
    const clean = stripQueryAndHash(value.trim());
    if (!clean || isExternalOrPseudo(clean)) {
        return null;
    }

    if (clean.startsWith('/')) {
        return path.join(rootDir, clean.replace(/^\/+/, ''));
    }

    return path.resolve(baseDir, clean);
}

function getAttrValues(html, attr) {
    const values = [];
    const re = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'gi');

    for (const match of html.matchAll(re)) {
        if (attr === 'srcset') {
            values.push(
                ...match[1]
                    .split(',')
                    .map((candidate) => candidate.trim().split(/\s+/)[0])
                    .filter(Boolean)
            );
        } else {
            values.push(match[1]);
        }
    }

    return values;
}

function getIds(html) {
    return new Set(
        [...html.matchAll(/\bid=["']([^"']+)["']/gi)]
            .map((match) => match[1])
    );
}

function parseSitemap() {
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
        errors.push('Missing sitemap.xml');
        return [];
    }

    const xml = readText(sitemapPath);
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((match) => match[1].trim())
        .filter(Boolean);
}

function urlToLocalHtml(url) {
    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        errors.push(`Invalid sitemap URL: ${url}`);
        return null;
    }

    if (parsed.protocol !== 'https:') {
        errors.push(`Sitemap URL must use https: ${url}`);
    }

    if (parsed.hostname !== 'komfortplus116.online') {
        errors.push(`Sitemap URL uses unexpected host: ${url}`);
    }

    const pathname = decodeURIComponent(parsed.pathname);
    return pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
}

function checkTempArtifacts(allFiles) {
    for (const filePath of allFiles) {
        const rel = fromRoot(filePath);
        const parts = rel.split('/');

        if (parts.some((part) => tempNamePattern.test(part))) {
            errors.push(`Temporary artifact found: ${rel}`);
        }
    }
}

function checkSitemap(allFiles) {
    const sitemapUrls = parseSitemap();
    const sitemapFiles = new Set();

    for (const url of sitemapUrls) {
        const localFile = urlToLocalHtml(url);
        if (!localFile) continue;

        sitemapFiles.add(localFile);
        if (!fs.existsSync(path.join(rootDir, localFile))) {
            errors.push(`Sitemap URL points to missing file: ${url} -> ${localFile}`);
        }
    }

    const publicHtmlFiles = allFiles
        .filter((filePath) => filePath.endsWith('.html'))
        .map(fromRoot)
        .filter((rel) => !publicHtmlIgnore.has(rel));

    for (const rel of publicHtmlFiles) {
        if (!sitemapFiles.has(rel) && !allowedHtmlOutsideSitemap.has(rel)) {
            errors.push(`Public HTML is missing from sitemap: ${rel}`);
        }
    }

    return publicHtmlFiles;
}

function checkLocalAssets(publicHtmlFiles) {
    for (const rel of publicHtmlFiles) {
        const htmlPath = path.join(rootDir, rel);
        const html = readText(htmlPath);
        const baseDir = path.dirname(htmlPath);

        for (const attr of [...localAttrs, ...deferredHtmlSourceAttrs]) {
            for (const value of getAttrValues(html, attr)) {
                if (!value || value.includes('${')) continue;

                const target = resolveLocalUrl(baseDir, value);
                if (!target) continue;

                if (!isInsideRoot(target)) {
                    errors.push(`${rel}: ${attr} escapes project root: ${value}`);
                    continue;
                }

                if (!fs.existsSync(target)) {
                    errors.push(`${rel}: missing ${attr} target: ${value}`);
                }
            }
        }
    }
}

function checkAnchorWarnings(publicHtmlFiles) {
    const idCache = new Map();

    function idsFor(filePath) {
        if (!idCache.has(filePath)) {
            const html = readText(filePath);
            const ids = getIds(html);
            const baseDir = path.dirname(filePath);

            for (const attr of deferredHtmlSourceAttrs) {
                for (const value of getAttrValues(html, attr)) {
                    const fragmentPath = resolveLocalUrl(baseDir, value);
                    if (!fragmentPath || !isInsideRoot(fragmentPath) || !fs.existsSync(fragmentPath)) {
                        continue;
                    }

                    for (const id of getIds(readText(fragmentPath))) {
                        ids.add(id);
                    }
                }
            }

            idCache.set(filePath, ids);
        }

        return idCache.get(filePath);
    }

    for (const rel of publicHtmlFiles) {
        const htmlPath = path.join(rootDir, rel);
        const html = readText(htmlPath);
        const baseDir = path.dirname(htmlPath);

        for (const value of getAttrValues(html, 'href')) {
            if (!value || !value.includes('#') || isExternalOrPseudo(value)) continue;

            const [rawPath, rawHash] = value.split('#');
            if (!rawHash) continue;

            const targetPath = rawPath
                ? resolveLocalUrl(baseDir, rawPath)
                : htmlPath;

            if (!targetPath || !targetPath.endsWith('.html') || !fs.existsSync(targetPath)) {
                continue;
            }

            const hash = decodeURIComponent(rawHash);
            if (!idsFor(targetPath).has(hash)) {
                warnings.push(`${rel}: anchor target not found in static HTML: ${value}`);
            }
        }
    }
}

function checkMetadata(publicHtmlFiles) {
    for (const rel of publicHtmlFiles) {
        if (allowedHtmlOutsideSitemap.has(rel)) continue;

        const html = readText(path.join(rootDir, rel));
        const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '')
            .replace(/\s+/g, ' ')
            .trim();
        const description = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] || '')
            .trim();
        const canonical = (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || '')
            .trim();
        const h1Count = [...html.matchAll(/<h1\b[^>]*>/gi)].length;

        if (!title) errors.push(`${rel}: missing <title>`);
        if (!description) errors.push(`${rel}: missing meta description`);
        if (!canonical) errors.push(`${rel}: missing canonical link`);
        if (h1Count !== 1) errors.push(`${rel}: expected exactly one h1, found ${h1Count}`);
    }
}

function checkAdminLocalOnlyGuard() {
    const adminPath = path.join(rootDir, 'admin', 'index.html');
    if (!fs.existsSync(adminPath)) {
        return;
    }

    const html = readText(adminPath);
    const requiredMarkers = [
        'data-local-admin-only',
        'is-local-admin-host',
        'is-public-admin-host',
        "window.location.port === '4173'",
        'Админка доступна только локально'
    ];

    for (const marker of requiredMarkers) {
        if (!html.includes(marker)) {
            errors.push(`admin/index.html: missing local-only guard marker: ${marker}`);
        }
    }
}

function main() {
    const allFiles = walk(rootDir);
    checkTempArtifacts(allFiles);
    const publicHtmlFiles = checkSitemap(allFiles);
    checkLocalAssets(publicHtmlFiles);
    checkAnchorWarnings(publicHtmlFiles);
    checkMetadata(publicHtmlFiles);
    checkAdminLocalOnlyGuard();

    for (const warning of warnings) {
        console.warn(`WARN: ${warning}`);
    }

    if (errors.length) {
        for (const error of errors) {
            console.error(`ERROR: ${error}`);
        }

        console.error(`\nSite integrity check failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
        process.exit(1);
    }

    console.log(`Site integrity check passed: ${publicHtmlFiles.length} public HTML files, ${warnings.length} warning(s).`);
}

main();
