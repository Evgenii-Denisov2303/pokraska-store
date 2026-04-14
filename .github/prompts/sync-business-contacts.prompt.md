---
name: "Синхронизировать контакты по сайту"
description: "Use when: changing pokraska.store phone numbers, email, address, company info, or other business contacts across the whole site."
argument-hint: "Укажи новые контакты или реквизиты, которые нужно проставить"
agent: "agent"
tools: [read, edit, search]
---
Синхронизируй контактные данные и сведения о компании по всему pokraska.store.

- Найди основной source of truth для контактов, обычно это `content/site.json`.
- Обнови все зеркальные места: видимые контактные блоки, `tel:` и `mailto:` ссылки, JSON-LD, hardcoded business details и другие найденные дубли.
- Не меняй URL-структуру, брендинг или текстовые офферы без прямого указания.
- Если найдешь расхождения между основными данными и hardcoded-копиями, приведи их к одному состоянию в рамках задачи.

В ответе:
- Назови основной source-of-truth файл.
- Перечисли остальные обновленные файлы.
- Отдельно отметь, остались ли на сайте неохваченные дубли или спорные значения.
