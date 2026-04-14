# Project Guidelines

## Architecture
- This repository is a static site with HTML entry points in the repo root and additional pages in `pages/`.
- Shared copy and business data usually live in `content/*.json`.
- `content/site.json` is the main shared source for brand, contacts, navigation, and footer data.
- Shared styles live in `assets/css/`, including page-specific styles in `assets/css/pages/`.
- Client-side renderers and page bindings live in `assets/js/*.js`.
- Inline editing is implemented in `assets/js/inline-editor.js`.

## Source Of Truth
- Prefer editing `content/*.json` when a page already reads its copy or business data from JSON.
- Edit HTML only when the target text or metadata is hardcoded there.
- If a JSON shape changes, update the matching renderer in `assets/js/` in the same change.
- Keep URLs, anchors, phone numbers, email addresses, company details, and visible metadata consistent across the site.

## Task Routing
- Use the `pokraska-store` agent for copy, CTA, offer, navigation, and content-data edits.
- Use the `pokraska-seo` agent for `title`, `meta description`, canonical, Open Graph, Twitter cards, JSON-LD, `robots.txt`, `sitemap.xml`, and `site.webmanifest`.
- Use the `pokraska-frontend` agent for HTML, CSS, JS, layout, responsive behavior, interaction polish, and page-level visual fixes.
- If a task affects both visible business data and metadata, update both layers in one pass.

## Validation
- Use targeted validation after edits; this repo does not have a formal automated test suite.
- For local content verification, use `node scripts/admin-server.js`.
- For deployment details, see `docs/admin-deploy.md`.
