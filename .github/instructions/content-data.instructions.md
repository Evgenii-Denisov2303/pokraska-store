---
name: "Content Data Guidelines"
description: "Use when: editing komfortplus116.ru content JSON, shared business data, navigation items, CTA lists, service copy, or content-driven page data."
applyTo: "content/*.json"
---
# Content Data Guidelines

- Treat `content/*.json` as the preferred source of truth for reusable copy and business data.
- Keep JSON shape stable unless the task explicitly requires a schema change.
- If a JSON shape changes, update the matching renderer in `assets/js/` in the same task.
- Use `content/site.json` for shared brand, contacts, navigation, and footer data unless the project already uses another content file for that section.
- Keep phones, emails, URLs, anchors, company details, and repeated CTA labels consistent with the rest of the site.
- Prefer minimal, targeted edits over rewriting whole sections of structured content.
