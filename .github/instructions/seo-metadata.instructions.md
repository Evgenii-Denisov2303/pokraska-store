---
name: "SEO Metadata Guidelines"
description: "Use when: editing pokraska.store SEO metadata, page titles, meta descriptions, canonical URLs, Open Graph tags, Twitter cards, JSON-LD, robots.txt, sitemap.xml, or site.webmanifest."
applyTo:
  - "*.html"
  - "pages/**/*.html"
  - "robots.txt"
  - "sitemap.xml"
  - "site.webmanifest"
---
# SEO Metadata Guidelines

- Treat each page HTML head as the primary source of truth for `title`, `meta description`, canonical, Open Graph, Twitter tags, and JSON-LD unless that page clearly uses another metadata source.
- Keep `title`, `meta description`, canonical, `og:url`, Open Graph text, and Twitter text aligned when the task affects a whole page.
- Keep business name, phone, address, email, and company details consistent with `content/site.json` and with the visible page content.
- Only add URLs to `sitemap.xml` if the target page already exists and should be indexable.
- Update `robots.txt` or `site.webmanifest` only when the request explicitly includes crawl or manifest behavior.
- Prefer file inspection and text-based validation; do not rely on screenshots or visual page checks for SEO work.
