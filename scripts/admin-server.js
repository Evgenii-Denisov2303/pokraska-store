const crypto = require('crypto');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function parseBoolean(value, fallback = false) {
    if (value == null || value === '') return fallback;
    return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function parseList(value) {
    return String(value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const IMAGE_ROOT_DIR = path.join(ROOT_DIR, 'assets', 'images');
const ADMIN_DATA_DIR = path.resolve(ROOT_DIR, '..', '.pokraska-store-admin');
const ADMIN_STATE_FILE = path.join(ADMIN_DATA_DIR, 'admin-state.json');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const AUTH_ENABLED = Boolean(ADMIN_USERNAME && ADMIN_PASSWORD);
const TRUST_PROXY = parseBoolean(process.env.TRUST_PROXY, false);
const FORCE_HTTPS = parseBoolean(process.env.FORCE_HTTPS, false);
const COOKIE_SECURE = (process.env.COOKIE_SECURE || 'auto').toLowerCase();
const SESSION_COOKIE = 'pokraska_admin_session';
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 1000 * 60 * 60 * 12);
const LOGIN_WINDOW_MS = Number(process.env.LOGIN_WINDOW_MS || 1000 * 60 * 15);
const LOGIN_MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS || 10);
const ADMIN_ALLOWED_IPS = parseList(process.env.ADMIN_ALLOWED_IPS);
const CONTENT_CORS_ORIGINS = parseList(process.env.CONTENT_CORS_ORIGINS);

const sessions = new Map();
const loginAttempts = new Map();

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.webp': 'image/webp',
    '.xml': 'application/xml; charset=utf-8'
};

function normalizeIp(ip) {
    return String(ip || '')
        .replace(/^::ffff:/, '')
        .trim();
}

function isAdminPath(pathname) {
    return pathname === '/admin'
        || pathname === '/admin/'
        || pathname.startsWith('/admin/')
        || pathname.startsWith('/api/auth/')
        || pathname === '/api/auth'
        || pathname === '/api/content'
        || pathname.startsWith('/api/content/')
        || pathname === '/api/admin/state'
        || pathname === '/api/admin/publish'
        || pathname === '/api/media/upload';
}

function getClientIp(request) {
    if (TRUST_PROXY) {
        const forwarded = request.headers['x-forwarded-for'];
        if (forwarded) {
            return normalizeIp(forwarded.split(',')[0]);
        }
    }

    return normalizeIp(request.socket.remoteAddress);
}

function isAllowedAdminIp(request) {
    if (!ADMIN_ALLOWED_IPS.length) return true;
    const ip = getClientIp(request);
    return ADMIN_ALLOWED_IPS.includes(ip);
}

function getRequestProtocol(request) {
    if (TRUST_PROXY) {
        const forwardedProto = String(request.headers['x-forwarded-proto'] || '').split(',')[0].trim();
        if (forwardedProto) return forwardedProto;
    }

    return request.socket.encrypted ? 'https' : 'http';
}

function isSecureRequest(request) {
    if (COOKIE_SECURE === 'always') return true;
    if (COOKIE_SECURE === 'never') return false;
    return getRequestProtocol(request) === 'https';
}

function getCookieAttributes(request, maxAgeSeconds) {
    const attributes = [
        'Path=/',
        'HttpOnly',
        'SameSite=Lax'
    ];

    if (maxAgeSeconds != null) {
        attributes.push(`Max-Age=${maxAgeSeconds}`);
    }

    if (isSecureRequest(request)) {
        attributes.push('Secure');
    }

    return attributes.join('; ');
}

function getSecurityHeaders(pathname) {
    const isAdmin = pathname === '/admin'
        || pathname === '/admin/'
        || pathname.startsWith('/admin/')
        || pathname.startsWith('/api/');

    return {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'X-Frame-Options': isAdmin ? 'DENY' : 'SAMEORIGIN',
        'X-Robots-Tag': isAdmin ? 'noindex, nofollow, noarchive' : 'all'
    };
}

function writeResponse(response, statusCode, headers, body) {
    response.writeHead(statusCode, headers);
    response.end(body);
}

function sendJson(request, response, statusCode, payload, headers = {}) {
    writeResponse(response, statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        ...getSecurityHeaders(new URL(request.url, `http://${request.headers.host}`).pathname),
        ...headers
    }, JSON.stringify(payload, null, 2));
}

function parseCookies(request) {
    const cookieHeader = request.headers.cookie || '';
    return cookieHeader.split(';').reduce((accumulator, chunk) => {
        const [rawName, ...rest] = chunk.trim().split('=');
        if (!rawName) return accumulator;
        accumulator[rawName] = decodeURIComponent(rest.join('=') || '');
        return accumulator;
    }, {});
}

function cleanExpiredSessions() {
    const now = Date.now();
    for (const [token, session] of sessions.entries()) {
        if (session.expiresAt <= now) {
            sessions.delete(token);
        }
    }
}

function cleanExpiredLoginAttempts() {
    const now = Date.now();
    for (const [ip, info] of loginAttempts.entries()) {
        if (info.expiresAt <= now) {
            loginAttempts.delete(ip);
        }
    }
}

function getSession(request) {
    cleanExpiredSessions();
    const token = parseCookies(request)[SESSION_COOKIE];
    if (!token) return null;

    const session = sessions.get(token);
    if (!session) return null;

    if (session.expiresAt <= Date.now()) {
        sessions.delete(token);
        return null;
    }

    return { token, ...session };
}

function createSession(username) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + SESSION_TTL_MS;
    sessions.set(token, { username, expiresAt });
    return { token, expiresAt };
}

function createSessionCookie(request, token, maxAgeSeconds) {
    return `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${getCookieAttributes(request, maxAgeSeconds)}`;
}

function createExpiredSessionCookie(request) {
    return `${SESSION_COOKIE}=; ${getCookieAttributes(request, 0)}`;
}

function getLoginAttemptState(ip) {
    cleanExpiredLoginAttempts();
    const record = loginAttempts.get(ip);
    if (!record || record.expiresAt <= Date.now()) {
        loginAttempts.delete(ip);
        return { count: 0, expiresAt: Date.now() + LOGIN_WINDOW_MS };
    }

    return record;
}

function registerFailedLogin(ip) {
    const state = getLoginAttemptState(ip);
    const nextState = {
        count: state.count + 1,
        expiresAt: state.expiresAt
    };

    loginAttempts.set(ip, nextState);
    return nextState;
}

function clearFailedLogins(ip) {
    loginAttempts.delete(ip);
}

function isLoginBlocked(ip) {
    const state = getLoginAttemptState(ip);
    if (state.count < LOGIN_MAX_ATTEMPTS) {
        return { blocked: false, retryAfterSeconds: 0 };
    }

    return {
        blocked: true,
        retryAfterSeconds: Math.max(1, Math.ceil((state.expiresAt - Date.now()) / 1000))
    };
}

function getStaticFilePath(requestPath) {
    let pathname = decodeURIComponent(requestPath);

    if (pathname === '/') {
        pathname = '/index.html';
    } else if (pathname === '/admin') {
        pathname = '/admin/index.html';
    } else if (pathname.endsWith('/')) {
        pathname += 'index.html';
    }

    const fullPath = path.normalize(path.join(ROOT_DIR, pathname));
    if (!fullPath.startsWith(ROOT_DIR)) {
        return null;
    }

    return fullPath;
}

async function readRequestBody(request) {
    const chunks = [];
    for await (const chunk of request) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf-8');
}

async function readJsonFile(filePath, fallbackValue) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return fallbackValue;
        }

        throw error;
    }
}

async function writeJsonFile(filePath, payload) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');
}

function getActorName(request) {
    const session = getSession(request);
    if (session?.username) return session.username;

    const headerValue = String(request.headers['x-admin-actor'] || '').trim();
    return headerValue || 'local';
}

function createEmptyAdminState() {
    return {
        sections: {}
    };
}

async function readAdminState() {
    const state = await readJsonFile(ADMIN_STATE_FILE, createEmptyAdminState());
    if (!state.sections || typeof state.sections !== 'object') {
        state.sections = {};
    }
    return state;
}

async function writeAdminState(payload) {
    await writeJsonFile(ADMIN_STATE_FILE, payload);
}

function getSectionStateEntry(adminState, sectionKey, fileName, label) {
    if (!adminState.sections[sectionKey]) {
        adminState.sections[sectionKey] = {
            sectionKey,
            fileName,
            label,
            history: []
        };
    }

    const entry = adminState.sections[sectionKey];
    entry.sectionKey = sectionKey;
    entry.fileName = fileName;
    entry.label = label || entry.label || sectionKey;
    if (!Array.isArray(entry.history)) {
        entry.history = [];
    }
    return entry;
}

function trimSectionHistory(entry) {
    entry.history = entry.history.slice(0, 6);
}

function pushSectionHistoryEntry(entry, nextItem) {
    entry.history.unshift(nextItem);
    trimSectionHistory(entry);
}

function createClientAdminState(adminState) {
    return {
        sections: Object.fromEntries(
            Object.entries(adminState.sections || {}).map(([sectionKey, entry]) => [
                sectionKey,
                {
                    sectionKey,
                    fileName: entry.fileName || '',
                    label: entry.label || sectionKey,
                    lastSavedAt: entry.lastSavedAt || null,
                    lastSavedBy: entry.lastSavedBy || null,
                    lastPublishedAt: entry.lastPublishedAt || null,
                    lastPublishedBy: entry.lastPublishedBy || null,
                    history: Array.isArray(entry.history)
                        ? entry.history.map((item) => ({
                            id: item.id,
                            action: item.action,
                            savedAt: item.savedAt || null,
                            savedBy: item.savedBy || null,
                            label: item.label || entry.label || sectionKey,
                            sectionKey,
                            data: item.data || null
                        }))
                        : []
                }
            ])
        )
    };
}

function sanitizeFileName(fileName) {
    const originalName = String(fileName || 'image').trim();
    const parsed = path.parse(originalName);
    const baseName = (parsed.name || 'image')
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60) || 'image';

    return {
        baseName,
        ext: parsed.ext.toLowerCase()
    };
}

function inferImageExtension(fileName, mimeType) {
    const { ext } = sanitizeFileName(fileName);
    if (ext && ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        return ext;
    }

    const mimeMap = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg'
    };

    return mimeMap[String(mimeType || '').toLowerCase()] || '.png';
}

function resolveUploadDirectory(directory) {
    let relativeDirectory = String(directory || 'assets/images/catalog').replace(/\\/g, '/').replace(/^\/+/, '');
    if (!relativeDirectory.startsWith('assets/images/')) {
        relativeDirectory = 'assets/images/catalog';
    }

    const fullDirectory = path.normalize(path.join(ROOT_DIR, relativeDirectory));
    if (!fullDirectory.startsWith(IMAGE_ROOT_DIR)) {
        throw new Error('Недопустимая папка для загрузки');
    }

    return {
        relativeDirectory,
        fullDirectory
    };
}

function decodeDataUrlImage(dataUrl) {
    const match = String(dataUrl || '').match(/^data:(image\/[a-z0-9.+-]+);base64,([\s\S]+)$/i);
    if (!match) {
        throw new Error('Ожидалось изображение в формате data URL');
    }

    return {
        mimeType: match[1].toLowerCase(),
        buffer: Buffer.from(match[2], 'base64')
    };
}

function shouldAllowContentCors(origin) {
    if (!origin || !CONTENT_CORS_ORIGINS.length) return false;
    return CONTENT_CORS_ORIGINS.includes('*') || CONTENT_CORS_ORIGINS.includes(origin);
}

function maybeApplyContentCors(request, response, headers = {}) {
    const origin = request.headers.origin;
    if (!shouldAllowContentCors(origin)) {
        return headers;
    }

    return {
        ...headers,
        'Access-Control-Allow-Origin': CONTENT_CORS_ORIGINS.includes('*') ? '*' : origin,
        'Vary': 'Origin'
    };
}

async function handleAuthApi(request, response, pathname) {
    if (pathname === '/api/auth/session') {
        const session = getSession(request);
        sendJson(request, response, 200, {
            ok: true,
            authEnabled: AUTH_ENABLED,
            authenticated: AUTH_ENABLED ? Boolean(session) : true,
            username: session?.username || null
        });
        return true;
    }

    if (pathname === '/api/auth/login') {
        if (request.method !== 'POST') {
            sendJson(request, response, 405, { error: 'Метод не поддерживается' });
            return true;
        }

        if (!AUTH_ENABLED) {
            sendJson(request, response, 200, {
                ok: true,
                authEnabled: false,
                authenticated: true,
                username: null
            });
            return true;
        }

        const ip = getClientIp(request);
        const blockState = isLoginBlocked(ip);
        if (blockState.blocked) {
            sendJson(request, response, 429, {
                ok: false,
                error: 'Слишком много попыток входа. Попробуйте позже.',
                retryAfterSeconds: blockState.retryAfterSeconds
            }, {
                'Retry-After': String(blockState.retryAfterSeconds)
            });
            return true;
        }

        try {
            const body = await readRequestBody(request);
            const parsed = JSON.parse(body || '{}');
            const username = String(parsed.username || '').trim();
            const password = String(parsed.password || '');

            if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
                const failedState = registerFailedLogin(ip);
                sendJson(request, response, 401, {
                    ok: false,
                    error: 'Неверный логин или пароль',
                    remainingAttempts: Math.max(0, LOGIN_MAX_ATTEMPTS - failedState.count)
                });
                return true;
            }

            clearFailedLogins(ip);
            const session = createSession(username);
            sendJson(request, response, 200, {
                ok: true,
                authEnabled: true,
                authenticated: true,
                username
            }, {
                'Set-Cookie': createSessionCookie(request, session.token, Math.floor(SESSION_TTL_MS / 1000))
            });
        } catch (error) {
            sendJson(request, response, 400, {
                ok: false,
                error: 'Не удалось выполнить вход',
                details: error.message
            });
        }
        return true;
    }

    if (pathname === '/api/auth/logout') {
        if (request.method !== 'POST') {
            sendJson(request, response, 405, { error: 'Метод не поддерживается' });
            return true;
        }

        const session = getSession(request);
        if (session?.token) {
            sessions.delete(session.token);
        }

        sendJson(request, response, 200, {
            ok: true,
            authEnabled: AUTH_ENABLED,
            authenticated: false
        }, {
            'Set-Cookie': createExpiredSessionCookie(request)
        });
        return true;
    }

    return false;
}

async function handleAdminStateApi(request, response, pathname) {
    if (pathname === '/api/admin/state') {
        if (AUTH_ENABLED && !getSession(request)) {
            sendJson(request, response, 401, {
                ok: false,
                error: 'Нужен вход в админку'
            });
            return true;
        }

        if (request.method !== 'GET') {
            sendJson(request, response, 405, { error: 'Метод не поддерживается' });
            return true;
        }

        const adminState = await readAdminState();
        sendJson(request, response, 200, {
            ok: true,
            state: createClientAdminState(adminState)
        });
        return true;
    }

    if (pathname === '/api/admin/publish') {
        if (request.method !== 'POST') {
            sendJson(request, response, 405, { error: 'Метод не поддерживается' });
            return true;
        }

        if (AUTH_ENABLED && !getSession(request)) {
            sendJson(request, response, 401, {
                ok: false,
                error: 'Нужен вход в админку'
            });
            return true;
        }

        try {
            const body = await readRequestBody(request);
            const parsed = JSON.parse(body || '{}');
            const sectionKey = String(parsed.sectionKey || '').trim();
            const fileName = String(parsed.fileName || '').trim();
            const label = String(parsed.label || '').trim();

            if (!sectionKey || !fileName) {
                throw new Error('Не указан раздел для публикации');
            }

            const adminState = await readAdminState();
            const entry = getSectionStateEntry(adminState, sectionKey, fileName, label || sectionKey);
            const actor = getActorName(request);
            const savedAt = new Date().toISOString();

            entry.lastPublishedAt = savedAt;
            entry.lastPublishedBy = actor;
            pushSectionHistoryEntry(entry, {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                action: 'publish',
                savedAt,
                savedBy: actor,
                label: label || entry.label
            });

            await writeAdminState(adminState);

            sendJson(request, response, 200, {
                ok: true,
                state: createClientAdminState(adminState),
                section: createClientAdminState({ sections: { [sectionKey]: entry } }).sections[sectionKey]
            });
        } catch (error) {
            sendJson(request, response, 400, {
                ok: false,
                error: 'Не удалось обновить статус публикации',
                details: error.message
            });
        }
        return true;
    }

    return false;
}

async function handleMediaApi(request, response, pathname) {
    if (pathname !== '/api/media/upload') {
        return false;
    }

    if (request.method !== 'POST') {
        sendJson(request, response, 405, { error: 'Метод не поддерживается' });
        return true;
    }

    if (AUTH_ENABLED && !getSession(request)) {
        sendJson(request, response, 401, {
            ok: false,
            error: 'Нужен вход в админку'
        });
        return true;
    }

    try {
        const body = await readRequestBody(request);
        const parsed = JSON.parse(body || '{}');
        const fileName = String(parsed.fileName || parsed.name || '').trim();
        const directory = String(parsed.directory || 'assets/images/catalog');
        const imageData = String(parsed.dataUrl || parsed.data || '').trim();

        if (!fileName || !imageData) {
            throw new Error('Нужно передать имя файла и само изображение');
        }

        const { relativeDirectory, fullDirectory } = resolveUploadDirectory(directory);
        const { mimeType, buffer } = decodeDataUrlImage(imageData);
        const { baseName } = sanitizeFileName(fileName);
        const extension = inferImageExtension(fileName, mimeType);
        const nextFileName = `${baseName}-${Date.now()}${extension}`;
        const outputPath = path.join(fullDirectory, nextFileName);

        await fs.mkdir(fullDirectory, { recursive: true });
        await fs.writeFile(outputPath, buffer);

        sendJson(request, response, 200, {
            ok: true,
            path: `${relativeDirectory}/${nextFileName}`.replace(/\\/g, '/'),
            fileName: nextFileName,
            directory: relativeDirectory
        });
    } catch (error) {
        sendJson(request, response, 400, {
            ok: false,
            error: 'Не удалось загрузить изображение',
            details: error.message
        });
    }

    return true;
}

async function handleContentApi(request, response, pathname) {
    const match = pathname.match(/^\/api\/content\/([a-z0-9-]+)$/i);
    if (!match) return false;

    const fileName = `${match[1]}.json`;
    const filePath = path.join(CONTENT_DIR, fileName);

    if (request.method === 'GET') {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            writeResponse(response, 200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store',
                ...getSecurityHeaders(pathname)
            }, content);
        } catch (error) {
            sendJson(request, response, 404, { error: `Файл ${fileName} не найден` });
        }
        return true;
    }

    if (request.method === 'PUT') {
        if (AUTH_ENABLED && !getSession(request)) {
            sendJson(request, response, 401, {
                ok: false,
                error: 'Нужен вход в админку'
            });
            return true;
        }

        try {
            const body = await readRequestBody(request);
            const parsed = JSON.parse(body);
            await fs.mkdir(CONTENT_DIR, { recursive: true });
            await fs.writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf-8');
            const sectionKey = String(request.headers['x-admin-section-key'] || '').trim() || match[1];
            const sectionLabel = String(request.headers['x-admin-section-label'] || '').trim() || sectionKey;
            const actor = getActorName(request);
            const savedAt = new Date().toISOString();
            const adminState = await readAdminState();
            const entry = getSectionStateEntry(adminState, sectionKey, match[1], sectionLabel);

            entry.lastSavedAt = savedAt;
            entry.lastSavedBy = actor;
            pushSectionHistoryEntry(entry, {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                action: 'save',
                savedAt,
                savedBy: actor,
                label: sectionLabel,
                data: parsed
            });

            await writeAdminState(adminState);

            sendJson(request, response, 200, {
                ok: true,
                file: fileName,
                state: createClientAdminState(adminState),
                section: createClientAdminState({ sections: { [sectionKey]: entry } }).sections[sectionKey]
            });
        } catch (error) {
            sendJson(request, response, 400, {
                error: 'Не удалось сохранить JSON',
                details: error.message
            });
        }
        return true;
    }

    sendJson(request, response, 405, { error: 'Метод не поддерживается' });
    return true;
}

async function handlePublicContent(request, response, pathname) {
    const match = pathname.match(/^\/content\/([a-z0-9-]+)\.json$/i);
    if (!match) return false;

    if (request.method === 'OPTIONS') {
        writeResponse(response, 204, maybeApplyContentCors(request, response, {
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
            ...getSecurityHeaders(pathname)
        }), '');
        return true;
    }

    if (request.method !== 'GET') return false;

    const fileName = `${match[1]}.json`;
    const filePath = path.join(CONTENT_DIR, fileName);

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        writeResponse(response, 200, maybeApplyContentCors(request, response, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-cache',
            ...getSecurityHeaders(pathname)
        }), content);
    } catch (error) {
        sendJson(request, response, 404, { error: `Файл ${fileName} не найден` });
    }
    return true;
}

async function handleStaticFile(request, response, pathname) {
    const filePath = getStaticFilePath(pathname);
    if (!filePath) {
        sendJson(request, response, 403, { error: 'Недопустимый путь' });
        return;
    }

    try {
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            sendJson(request, response, 403, { error: 'Ожидался файл, а не директория' });
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const data = await fs.readFile(filePath);
        const isHtml = ext === '.html';
        const isAdmin = pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin/');

        writeResponse(response, 200, {
            'Content-Type': contentType,
            'Cache-Control': isHtml || isAdmin ? 'no-cache' : 'public, max-age=3600',
            ...getSecurityHeaders(pathname)
        }, data);
    } catch (error) {
        sendJson(request, response, 404, { error: 'Файл не найден' });
    }
}

const server = http.createServer(async (request, response) => {
    try {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const { pathname } = url;

        if (FORCE_HTTPS && getRequestProtocol(request) !== 'https') {
            const host = request.headers.host || `${HOST}:${PORT}`;
            writeResponse(response, 301, {
                Location: `https://${host}${pathname}${url.search}`,
                ...getSecurityHeaders(pathname)
            }, '');
            return;
        }

        if (isAdminPath(pathname) && !isAllowedAdminIp(request)) {
            sendJson(request, response, 403, {
                ok: false,
                error: 'Доступ к админке с этого IP запрещен'
            });
            return;
        }

        if (pathname === '/api/health') {
            sendJson(request, response, 200, {
                ok: true,
                authEnabled: AUTH_ENABLED,
                host: HOST,
                port: PORT,
                trustProxy: TRUST_PROXY,
                forceHttps: FORCE_HTTPS
            });
            return;
        }

        if (await handleAuthApi(request, response, pathname)) {
            return;
        }

        if (await handleAdminStateApi(request, response, pathname)) {
            return;
        }

        if (await handleMediaApi(request, response, pathname)) {
            return;
        }

        if (await handleContentApi(request, response, pathname)) {
            return;
        }

        if (await handlePublicContent(request, response, pathname)) {
            return;
        }

        await handleStaticFile(request, response, pathname);
    } catch (error) {
        sendJson(request, response, 500, {
            ok: false,
            error: 'Внутренняя ошибка сервера',
            details: error.message
        });
    }
});

server.listen(PORT, HOST, () => {
    const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
    console.log(`POKRASKA.STORE admin server is running on http://${displayHost}:${PORT}`);
    console.log(`Open the admin panel at http://${displayHost}:${PORT}/admin/`);
    console.log(`Auth mode: ${AUTH_ENABLED ? 'enabled' : 'disabled'}`);
    console.log(`Trust proxy: ${TRUST_PROXY ? 'enabled' : 'disabled'}`);
    console.log(`Force HTTPS: ${FORCE_HTTPS ? 'enabled' : 'disabled'}`);
});
