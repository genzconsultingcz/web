# Media coverage page (`/media`) — design

**Goal:** A dedicated bilingual (cs/en) press page listing articles, research reports and
institutional features written about GenZ Consulting, plus founder thought-leadership posts.

## Data (Tina CMS)

- New `press` collection — `content/press/*.json`, one document per mention.
  Each document has `cs` / `en` objects with: `outlet`, `author`, `title`, `date` (ISO,
  used for sorting + display formatting), `url`, `summary`.
- New global `pressChrome` collection — `content/press-chrome/index.json`, `cs` / `en`
  page copy: `eyebrow`, `title`, `subtitle`, `sectionLabel`, `readArticle`, `ctaTitle`,
  `ctaDesc`, `cta`. Registered in `tina/config.tsx`.

## Route & SEO

- `app/[locale]/media/page.tsx` — server component, `revalidate = 300`, fetches
  `pressChrome` + `pressConnection`, builds typed cards, passes to `MediaPage`.
- `SEO.media` (cs/en) added to `lib/seo.ts`; `/media` added to `app/sitemap.ts`
  (priority 0.6, monthly).

## UI — `components/pages/media/MediaPage.tsx`

- Hero (bg-gtc-primary) with eyebrow / title / subtitle, matching the case-studies hero.
- Timeline list on white: vertical rule with date badges; each row shows outlet + author,
  article title (external link, `target="_blank"`), and summary. Sorted newest first;
  entries without a date are listed last without a date badge. Dates formatted via
  date-fns with the active locale.
- CTA band (bg-gtc-deep) with ctaTitle / ctaDesc / ContactButton.

## Navigation

- `mediaLabel` field added to the global nav schema (cs: "Média", en: "Media") and to
  `content/global/index.json`; header link placed between Case Studies and Contact in
  both desktop and mobile nav (`components/layout/nav/header.tsx`).

## Content

13 entries from the media analysis (ThinkGPA, AV Media Blog, Živá univerzita/ČZU,
Nakopni Prahu, Nastartujte se, AVPO/UZS NEZISKOVKY 2026, 6× Seznam Médium by Adam
Dalecký, KONFERENCE PM workshop). Article titles stay in original Czech in both locales
(the linked articles are Czech); summaries are translated. Médium articles without a
direct URL link to Adam Dalecký's author profile.

## Out of scope

- No footer nav link (header only).
- No per-mention detail pages (all mentions link externally).
- No home page section.
