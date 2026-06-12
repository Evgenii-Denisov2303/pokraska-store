---
name: "Начать задачу по сайту"
description: "Use when: you are new to komfortplus116.ru, are not sure which agent to use, or have a mixed task across content, UI, and SEO."
argument-hint: "Опиши задачу по сайту своими словами"
agent: "pokraska-main"
---
Разбери и выполни задачу по komfortplus116.ru по моему описанию.

- Сначала определи основной source of truth: `content/*.json`, hardcoded HTML, CSS, JS, page metadata, `robots.txt`, `sitemap.xml` или `site.webmanifest`.
- Если задача смешанная, синхронизируй контент, интерфейс и SEO в правильной последовательности, не перекладывая выбор агента на меня.
- Делай минимальные изменения в реальном источнике истины, а не в случайных дублях.
- Не используй screenshots, image inspection или визуальные проверки страницы; работай по файлам и текстовой валидации.

В ответе:
- Назови главный source-of-truth файл или главный рабочий слой.
- Кратко перечисли, какие еще слои сайта были затронуты.
- Отметь, остались ли дубли или ручные follow-up points.
