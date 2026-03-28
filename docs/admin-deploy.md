# Визуальное редактирование POKRASKA.STORE

Ниже 2 рабочих режима:

1. `Локальный` — для тебя на компьютере.
2. `Прод-режим` — для заказчика через интернет.

## 1. Локальный запуск

В корне проекта:

```powershell
node scripts/admin-server.js
```

Открыть:

```text
http://127.0.0.1:4173/admin/
```

По умолчанию сервер работает без логина и пароля.

## 2. Быстрый защищенный запуск без Docker

Если сервер будет стоять на VPS и запускаться напрямую через Node:

```powershell
$env:HOST = "0.0.0.0"
$env:PORT = "4173"
$env:ADMIN_USERNAME = "admin"
$env:ADMIN_PASSWORD = "StrongPasswordHere"
$env:TRUST_PROXY = "true"
$env:FORCE_HTTPS = "true"
node scripts/admin-server.js
```

Что уже поддерживает сервер:

- логин/пароль для панели входа
- secure-cookie при HTTPS
- rate limit на вход
- ограничение доступа к панели входа по IP
- работа за reverse proxy

## 3. Рекомендуемый прод-вариант

Самый спокойный и понятный путь:

- VPS
- Docker Compose
- Caddy как reverse proxy и HTTPS

Готовые файлы:

- [Dockerfile](c:/Users/Evgeny/VSCode/pokraska-store/Dockerfile)
- [docker-compose.example.yml](c:/Users/Evgeny/VSCode/pokraska-store/deploy/docker-compose.example.yml)
- [Caddyfile.example](c:/Users/Evgeny/VSCode/pokraska-store/deploy/Caddyfile.example)
- [.env.example](c:/Users/Evgeny/VSCode/pokraska-store/deploy/.env.example)

### Шаги на сервере

1. Клонировать репозиторий на VPS.
2. Перейти в папку `deploy`.
3. Скопировать `.env.example` в `.env`.
4. Задать логин и сложный пароль.
5. Скопировать `docker-compose.example.yml` в `docker-compose.yml`.
6. Скопировать `Caddyfile.example` в `Caddyfile`.
7. Запустить:

```bash
docker compose up -d --build
```

После этого сайт и панель запуска visual-режима будут работать через HTTPS на том же домене:

- сайт: `https://pokraska.store/`
- вход/запуск: `https://pokraska.store/admin/`

## 4. Что важно для заказчика

Сейчас лучший путь для реальной работы заказчика такой:

- публичный сайт и visual-режим работают на одном сервере
- заказчик заходит в `/admin/`, а дальше открывает нужную страницу в режиме правки
- изменения JSON сразу отражаются на сайте

Это проще и надежнее, чем держать сайт отдельно, а контент отдельно.

## 5. Дополнительная защита

Поддерживаются такие переменные окружения:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `TRUST_PROXY=true`
- `FORCE_HTTPS=true`
- `COOKIE_SECURE=auto|always|never`
- `LOGIN_MAX_ATTEMPTS`
- `LOGIN_WINDOW_MS`
- `SESSION_TTL_MS`
- `ADMIN_ALLOWED_IPS`
- `CONTENT_CORS_ORIGINS`

Пример IP-ограничения:

```text
ADMIN_ALLOWED_IPS=1.2.3.4,5.6.7.8
```

Тогда публичный сайт будет открыт всем, а панель входа и запись контента — только с этих IP.

## 6. Если не переносить весь сайт на VPS

Я уже подготовил задел под отдельный content-origin:

- [runtime-config.js](c:/Users/Evgeny/VSCode/pokraska-store/assets/js/runtime-config.js)
- [content-api.js](c:/Users/Evgeny/VSCode/pokraska-store/assets/js/content-api.js)

То есть при желании можно оставить публичный сайт на одной площадке, а JSON и админку вынести на другую.

Но это не основной рекомендованный путь.

Для вашего проекта проще и надежнее:

`один VPS -> один домен -> сайт + /admin/`

## 7. Ограничение текущей версии

JSON-контент по пути `/content/*.json` остается публичным, потому что сайт читает его на клиенте.

Если понадобится полностью закрытый контент и “настоящая CMS без публичных JSON”, это уже следующий этап:

- серверный рендеринг
- или публикация HTML из админки
- или отдельный backend + сборка сайта
