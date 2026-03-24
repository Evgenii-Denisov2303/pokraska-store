const crypto = require('crypto');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const AUTH_ENABLED = Boolean(ADMIN_USERNAME && ADMIN_PASSWORD);
const SESSION_COOKIE = 'pokraska_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const sessions = new Map();

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8'
};

function sendJson(response, statusCode, payload, headers = {}) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        ...headers
    });
    response.end(JSON.stringify(payload, null, 2));
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

function createSessionCookie(token, maxAgeSeconds) {
    return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

function createExpiredSessionCookie() {
    return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function getStaticFilePath(requestPath) {
    let pathname = decodeURIComponent(requestPath);

    if (pathname === '/') {
        pathname = '/index.html';
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

async function handleAuthApi(request, response, pathname) {
    if (pathname === '/api/auth/session') {
        const session = getSession(request);
        sendJson(response, 200, {
            ok: true,
            authEnabled: AUTH_ENABLED,
            authenticated: AUTH_ENABLED ? Boolean(session) : true,
            username: session?.username || null
        });
        return true;
    }

    if (pathname === '/api/auth/login') {
        if (request.method !== 'POST') {
            sendJson(response, 405, { error: 'Метод не поддерживается' });
            return true;
        }

        if (!AUTH_ENABLED) {
            sendJson(response, 200, {
                ok: true,
                authEnabled: false,
                authenticated: true,
                username: null
            });
            return true;
        }

        try {
            const body = await readRequestBody(request);
            const parsed = JSON.parse(body || '{}');
            const username = String(parsed.username || '').trim();
            const password = String(parsed.password || '');

            if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
                sendJson(response, 401, {
                    ok: false,
                    error: 'Неверный логин или пароль'
                });
                return true;
            }

            const session = createSession(username);
            sendJson(response, 200, {
                ok: true,
                authEnabled: true,
                authenticated: true,
                username
            }, {
                'Set-Cookie': createSessionCookie(session.token, Math.floor(SESSION_TTL_MS / 1000))
            });
        } catch (error) {
            sendJson(response, 400, {
                ok: false,
                error: 'Не удалось выполнить вход',
                details: error.message
            });
        }
        return true;
    }

    if (pathname === '/api/auth/logout') {
        if (request.method !== 'POST') {
            sendJson(response, 405, { error: 'Метод не поддерживается' });
            return true;
        }

        const session = getSession(request);
        if (session?.token) {
            sessions.delete(session.token);
        }

        sendJson(response, 200, {
            ok: true,
            authEnabled: AUTH_ENABLED,
            authenticated: false
        }, {
            'Set-Cookie': createExpiredSessionCookie()
        });
        return true;
    }

    return false;
}

async function handleContentApi(request, response, pathname) {
    const match = pathname.match(/^\/api\/content\/([a-z0-9-]+)$/i);
    if (!match) return false;

    const fileName = `${match[1]}.json`;
    const filePath = path.join(CONTENT_DIR, fileName);

    if (request.method === 'GET') {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            response.end(content);
        } catch (error) {
            sendJson(response, 404, { error: `Файл ${fileName} не найден` });
        }
        return true;
    }

    if (request.method === 'PUT') {
        if (AUTH_ENABLED && !getSession(request)) {
            sendJson(response, 401, {
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
            sendJson(response, 200, { ok: true, file: fileName });
        } catch (error) {
            sendJson(response, 400, {
                error: 'Не удалось сохранить JSON',
                details: error.message
            });
        }
        return true;
    }

    sendJson(response, 405, { error: 'Метод не поддерживается' });
    return true;
}

async function handleStaticFile(response, pathname) {
    const filePath = getStaticFilePath(pathname);
    if (!filePath) {
        sendJson(response, 403, { error: 'Недопустимый путь' });
        return;
    }

    try {
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            sendJson(response, 403, { error: 'Ожидался файл, а не директория' });
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const data = await fs.readFile(filePath);
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(data);
    } catch (error) {
        sendJson(response, 404, { error: 'Файл не найден' });
    }
}

const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const { pathname } = url;

    if (pathname === '/api/health') {
        sendJson(response, 200, {
            ok: true,
            authEnabled: AUTH_ENABLED,
            host: HOST,
            port: PORT
        });
        return;
    }

    if (await handleAuthApi(request, response, pathname)) {
        return;
    }

    if (await handleContentApi(request, response, pathname)) {
        return;
    }

    await handleStaticFile(response, pathname);
});

server.listen(PORT, HOST, () => {
    const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
    console.log(`POKRASKA.STORE admin server is running on http://${displayHost}:${PORT}`);
    console.log(`Open the admin panel at http://${displayHost}:${PORT}/admin/`);
    if (AUTH_ENABLED) {
        console.log('Protected mode: admin login is enabled.');
    } else {
        console.log('Local mode: admin login is disabled because ADMIN_USERNAME / ADMIN_PASSWORD are not set.');
    }
});
