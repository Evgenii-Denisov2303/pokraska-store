---
name: "Frontend Surface Guidelines"
description: "Use when: editing komfortplus116.ru HTML, CSS, JS, responsive layouts, page structure, or client-side UI behavior in the static frontend."
applyTo:
  - "*.html"
  - "pages/**/*.html"
  - "admin/**/*.html"
  - "assets/css/**/*.css"
  - "assets/js/**/*.js"
---
# Frontend Surface Guidelines

- Keep changes minimal and local to the real source of truth: HTML markup, CSS rules, JS behavior, or a data-driven renderer.
- Preserve the site's existing visual language unless the task explicitly asks for a redesign.
- Check desktop and mobile impact when changing layouts, spacing, navigation, or interaction states.
- Do not patch repeated UI problems in multiple places if a shared style, shared script, or reusable markup pattern is the actual source.
- If a visible section is driven by `content/*.json`, keep the content source and renderer aligned.
- Avoid changing SEO metadata, sitemap, robots, or manifest files from frontend-only tasks unless the task explicitly includes them.
- Validate frontend changes through file inspection and targeted text-based checks; do not depend on screenshots or browser image capture.
