# TinaCMS content migration — Pass 1: Global + Home

## Goal

Every editable string on the site should be changeable by a content editor through TinaCMS, not by a developer editing `messages/*.json` or JSX. This pass builds the shared architecture and proves it on the two highest-traffic surfaces: the global header/footer chrome and the Home page (including its lead-magnet copy and case-study teaser cards).

Out of scope for this pass (separate follow-up sub-projects, same pattern applied):
- Case Studies (`case-study-data.ts`, 3 clients, 6 sections each) → its own Tina list collection.
- About, Services (5 sub-pages), Contact.

## i18n schema pattern

Every Tina document holding translatable copy stores both languages side by side in one file:

```json
{
  "cs": { "heroHeadline": "Gen Z není" },
  "en": { "heroHeadline": "Gen Z is not" }
}
```

This matches the existing convention in `case-study-data.ts` (`Record<'cs' | 'en', CaseStudy>`). Fields that don't actually vary by language (image paths, external URLs, a person's name) may be duplicated across both blocks rather than hoisted out, unless a field is naturally shared across an entire list (e.g. the client-logo list), in which case it lives outside the `cs`/`en` split entirely.

## Schema changes

### `Global` collection (`tina/collection/global.ts`, `content/global/index.json`)

Extend `header` and `footer` so every label has a `cs`/`en` pair:

```ts
header: {
  name: string,                 // shared, unchanged
  nav: {
    cs: {
      homeLabel, aboutLabel, caseStudiesLabel, contactLabel,
      servicesLabel, viewServicesLabel, bookCallLabel,
      homeLogoAria, menuOpenAria, menuCloseAria,
      serviceLinks: [{ slug, label }]   // 5 items: trainee-program, onboarding-app,
    },                                   // genz-workshop, career-pages, custom
    en: { /* same shape */ }
  }
},
footer: {
  phone, email, social: [...],  // shared, unchanged
  copy: {
    cs: {
      tagline, rights, navLabel, contactLabel, followLabel, web, socialDomain,
      navServices, navAbout, navCaseStudies, navContact, navGuide, homeLogoAria
    },
    en: { /* same shape */ }
  }
}
```

The existing `header.nav` list field is dead code today (defined in Tina, never read by `header.tsx`, which sources labels from `next-intl` instead) — it gets replaced by the shape above and actually wired up.

### New `Home` collection (singleton, `ui: { global: true }`, `content/home/index.json`)

Shape: `{ cs: {...}, en: {...} }`, mirroring today's `messages.home` + `messages.leadMagnet` trees, with today's flat-keyed repeats (`service1Title`, `service2Title`, `testimonial1Quote`, `testimonial2Quote`, …) converted into real Tina `list` fields:

- `services: [{ num, title, desc, slug }]`
- `testimonials: [{ quote, author, role, linkedin }]`
- `team: [{ name, role, bio, photo, linkedin }]`
- `logos: [{ name, src }]` — shared across locales (a logo doesn't translate), lives outside the `cs`/`en` split
- singular fields for hero, stats, process steps, CTA copy, PDF/lead-magnet copy, case-study teaser labels — plain `cs`/`en` strings.

## Data flow / component wiring

Today: page → client component (`'use client'`) → `useTranslations()` reads from the `next-intl` provider (populated from `messages/*.json`).

New pattern (mirrors the existing `Layout.tsx` → `client.queries.global()` → `LayoutProvider` flow):

1. `app/[locale]/page.tsx` (server component) calls `client.queries.home({ relativePath: 'index.json' })`.
2. It passes `data.home` (both locales) as a prop into `<HomePage content={data.home} />`.
3. `HomePage` (still `'use client'`) picks `content[locale]` via `useLocale()` and destructures fields directly — no more `useTranslations('home')` / `t('key')` calls for page copy.
4. Header/Footer: `Layout.tsx` already fetches `Global`; extend it to pass the new `nav`/`copy` shape through `LayoutProvider`, and update `header.tsx`/`footer.tsx` to read `globalSettings.header.nav[locale]` / `globalSettings.footer.copy[locale]` instead of `useTranslations('nav')` / `useTranslations('footer')`.
5. `useLocale()` and locale-prefixed routing (`/${locale}/...`) stay exactly as they are — that's routing, not content, and next-intl keeps owning it.

## Migration mechanics

Content already exists correctly in `messages/en.json` / `messages/cs.json` — this is a reshape, not a rewrite. Write a one-off Node script (deleted after use) that reads both message files and emits `content/global/index.json` (merged with the existing phone/email/social) and `content/home/index.json` in the new shape, so no copy is retyped by hand. Manually spot-check the emitted JSON against the source afterward.

## Cleanup

Once `header.tsx`, `footer.tsx`, and `HomePage.tsx` no longer call `useTranslations('nav' | 'footer' | 'home' | 'leadMagnet')`, remove those four keys from `messages/en.json` and `messages/cs.json` (other pages still need the rest of the file until their own migration passes land).

## Testing

- `npm run build` (or the project's type-check script) to catch prop/type mismatches from the new Tina-generated types.
- Manually verify in the browser: `/en` and `/cs` home pages render identical copy to before the migration; header/footer nav, aria-labels, and locale switch still work on both locales; TinaCMS admin (`/admin`) can open and edit the new Home and Global fields without schema errors.
- No existing automated test covers this content — none added, since there's no behavior change to assert beyond "renders the same," which manual comparison covers.
