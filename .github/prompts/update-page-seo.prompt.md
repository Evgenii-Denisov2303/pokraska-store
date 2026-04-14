---
name: "Обновить SEO страницы"
description: "Use when: updating pokraska.store page title, meta description, canonical, Open Graph, Twitter tags, JSON-LD, sitemap, or robots rules."
argument-hint: "Опиши страницу и SEO-задачу"
agent: "pokraska-seo"
---
Обнови SEO-слой pokraska.store для страницы или технической задачи, которую я описал.

- Найди точный SEO source of truth: HTML head, `robots.txt`, `sitemap.xml`, `site.webmanifest`, или связанный business data source.
- Держи согласованными `title`, `meta description`, canonical, Open Graph, Twitter и `og:url`, если задача затрагивает страницу целиком.
- Если меняешь structured data, сверь его с видимыми контактами, названием компании и адресом.
- Не добавляй страницу в `sitemap.xml`, если такой страницы нет в проекте.

В ответе:
- Назови главный SEO-файл, который был изменен.
- Кратко перечисли связанные поля или файлы, которые были синхронизированы.
- Отметь возможные остаточные расхождения, если они не входили в задачу.
