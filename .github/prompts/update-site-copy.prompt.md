---
name: "Обновить тексты сайта"
description: "Use when: updating pokraska.store copy, CTA text, offer blocks, service descriptions, or content/*.json."
argument-hint: "Опиши страницу, блок и что должно измениться"
agent: "pokraska-store"
---
Обнови тексты на pokraska.store по моему описанию.

- Сначала найди реальный source of truth: `content/*.json`, hardcoded HTML, или page-specific script.
- Вноси минимальное изменение в источник истины, а не в дубли.
- Проверь соседние повторяющиеся блоки: CTA, навигацию, футер, контактные фрагменты.
- Если потребуется менять структуру данных, обнови связанный renderer в `assets/js/` в той же задаче.

В ответе:
- Назови главный source-of-truth файл, который был изменен.
- Кратко перечисли зеркальные места, которые тоже пришлось обновить.
- Отдельно отметь дубли, которые сознательно остались без изменений.
