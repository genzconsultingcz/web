# TinaCMS Content Migration (Pass 2: Case Studies) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the three case studies (AV Media, Global Payments, Generali) out of the hardcoded `components/pages/case-studies/case-study-data.ts` (1,338 lines) and the `messages.caseStudies`/`messages.caseStudyDetail` next-intl namespaces, into TinaCMS, so a content editor can add, edit, or reorder case studies without a developer touching code. This is Pass 2 of the multi-pass TinaCMS migration (Pass 1 covered Header/Footer + Home; see `docs/superpowers/specs/2026-08-02-tinacms-content-migration-design.md` for that pass's approved architecture, which this plan reuses).

**Architecture:** Add a new Tina **list collection** `caseStudy` (one JSON document per case study, filename = slug) shaped `{ cs: {...}, en: {...} }` — mirroring the existing `CaseStudy` TypeScript interface in `case-study-data.ts` almost field-for-field, since that interface is already close to Tina-ready. Add a second, small **singleton** collection `caseStudiesChrome` for the list-page and detail-page template copy (headings, section labels, CTA) that isn't specific to any one case study — the same role `Global` plays for Header/Footer. `CaseStudiesPage`, `CaseStudyDetail`, and `HomePage`'s case-study teaser section stop calling `useTranslations()` / `getCaseStudy()` and instead receive Tina-sourced props from their respective server-component `page.tsx` files, exactly like Pass 1's Header/Footer/HomePage pattern.

**Tech Stack:** Next.js (App Router), TinaCMS (`tinacms` CLI + generated GraphQL client), next-intl (routing only), Vitest + Testing Library, Node's built-in TypeScript stripping (via `npx tsx`) for a one-off migration script.

## Global Constraints

- Every string visible on the Case Studies list page, each case-study detail page, and the Home page's case-study teaser cards must render identically in `/cs` and `/en` after migration — this is a reshape of existing content, not a rewording.
- Locale content lives as `{ cs: {...}, en: {...} }` inside one Tina document per case study (not separate files per locale) — same pattern as Pass 1.
- Tina `image`-type fields must NOT be used for logo/photo paths (Pass 1's final review found `type: 'image'` risks Tina Cloud rewriting relative `/public` paths to a Cloud media URL in production). Use `type: 'string'` for all image-path fields in this pass.
- The `findings.columns` 3-tuple and each finding item's `cols` 3-tuple (from the TS interface) must be flattened into three named fields (`column1`/`column2`/`column3` and `col1`/`col2`/`col3`) — Tina/GraphQL has no fixed-length tuple type.
- Do not touch `messages.about`, `messages.services`, `messages.traineeProgram`, `messages.onboardingApp`, `messages.genzWorkshop`, `messages.careerPages`, `messages.customSolution`, `messages.contact`, `messages.contactDialog`, `messages.leadMagnet` — those pages/namespaces are out of scope for this pass.
- After each schema change to `tina/collection/*.ts`, regenerate the Tina client/types with `npm run build-local` before writing code that depends on the new generated types.
- Follow Pass 1's null-safety convention throughout: optional-chain into Tina data, then an early `if (!x) return null;` guard — no bare `!` non-null assertions.

---

### Task 1: Create the `CaseStudy` list collection and `CaseStudiesChrome` singleton schema

**Files:**
- Create: `tina/collection/case-study.ts`
- Create: `tina/collection/case-studies-chrome.ts`
- Modify: `tina/config.tsx`

**Interfaces:**
- Produces: `CaseStudyQuery['caseStudy']` and `CaseStudyConnectionQuery['caseStudyConnection']` shaped as `{ cs: CaseStudyLocaleContent, en: CaseStudyLocaleContent }` per document, where `CaseStudyLocaleContent` mirrors the `CaseStudy` interface in `components/pages/case-studies/case-study-data.ts:7-54`, with `findings.columns`/`cols` tuples flattened to named fields (see below).
- Produces: `CaseStudiesChromeQuery['caseStudiesChrome']` shaped as `{ cs: { list: {...}, detail: {...} }, en: { list: {...}, detail: {...} } }`.

- [x] **Step 1: Create `tina/collection/case-study.ts`**

```ts
// tina/collection/case-study.ts
import type { Collection } from 'tinacms';

const caseStudyLocaleFields = [
  { type: 'string', label: 'Client Name', name: 'client' } as const,
  { type: 'string', label: 'Service Type (list card label)', name: 'serviceType' } as const,
  { type: 'string', label: 'List Card Result Summary', name: 'listResult', ui: { component: 'textarea' } } as const,
  { type: 'string', label: 'Logo Image Path', name: 'logo' } as const,
  { type: 'string', label: 'Logo Alt Text', name: 'logoAlt' } as const,
  { type: 'string', label: 'Year', name: 'year' } as const,
  {
    type: 'object',
    label: 'Hero',
    name: 'hero',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Scope',
    name: 'scope',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Label', name: 'label' },
      { type: 'string', label: 'Value', name: 'value' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Stats',
    name: 'stats',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Value', name: 'value' },
      { type: 'string', label: 'Label', name: 'label' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Context',
    name: 'context',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      { type: 'string', label: 'Client Label', name: 'clientLabel' },
      { type: 'string', label: 'Client Description', name: 'client', ui: { component: 'textarea' } },
      { type: 'string', label: 'Why Title', name: 'whyTitle' },
      { type: 'string', label: 'Why Intro (optional)', name: 'whyIntro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Why Points',
        name: 'whyPoints',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body', name: 'body', ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', label: 'Brief Label', name: 'briefLabel' },
      { type: 'string', label: 'Brief', name: 'brief', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Approach',
    name: 'approach',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Steps',
        name: 'steps',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body', name: 'body', ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', label: 'Assessed Title', name: 'assessedTitle' },
      { type: 'string', label: 'Assessed Intro', name: 'assessedIntro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Assessed Items',
        name: 'assessed',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body (optional)', name: 'body', ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', label: 'Assessed Note (optional)', name: 'assessedNote', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Findings',
    name: 'findings',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      { type: 'string', label: 'Column 1 Label', name: 'column1' },
      { type: 'string', label: 'Column 2 Label', name: 'column2' },
      { type: 'string', label: 'Column 3 Label', name: 'column3' },
      {
        type: 'object',
        label: 'Items',
        name: 'items',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Category', name: 'category' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Column 1 Content', name: 'col1', ui: { component: 'textarea' } },
          { type: 'string', label: 'Column 2 Content', name: 'col2', ui: { component: 'textarea' } },
          { type: 'string', label: 'Column 3 Content', name: 'col3', ui: { component: 'textarea' } },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Outputs',
    name: 'outputs',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Items',
        name: 'items',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body', name: 'body', ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', label: 'Quote', name: 'quote', ui: { component: 'textarea' } },
      { type: 'string', label: 'Quote Author', name: 'quoteAuthor' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Why Us',
    name: 'whyUs',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Pillars',
        name: 'pillars',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body', name: 'body', ui: { component: 'textarea' } },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Contact',
    name: 'contact',
    fields: [
      { type: 'string', label: 'Name', name: 'name' },
      { type: 'string', label: 'Email', name: 'email' },
      { type: 'string', label: 'Website', name: 'web' },
    ],
  } as const,
];

const CaseStudy: Collection = {
  label: 'Case Studies',
  name: 'caseStudy',
  path: 'content/case-studies',
  format: 'json',
  ui: {
    router: ({ document }) => `/case-studies/${document._sys.filename}`,
  },
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: caseStudyLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: caseStudyLocaleFields as any },
  ],
};

export default CaseStudy;
```

- [x] **Step 2: Create `tina/collection/case-studies-chrome.ts`**

```ts
// tina/collection/case-studies-chrome.ts
import type { Collection } from 'tinacms';

const chromeLocaleFields = [
  {
    type: 'object',
    label: 'List Page',
    name: 'list',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Subtitle', name: 'subtitle' },
      { type: 'string', label: 'Result Label', name: 'resultLabel' },
      { type: 'string', label: 'Read More Label', name: 'readMore' },
      { type: 'string', label: 'CTA Title', name: 'ctaTitle' },
      { type: 'string', label: 'CTA Description', name: 'ctaDesc' },
      { type: 'string', label: 'CTA Button', name: 'cta' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Detail Page',
    name: 'detail',
    fields: [
      { type: 'string', label: 'Back Link', name: 'back' },
      { type: 'string', label: 'Case Label', name: 'caseLabel' },
      { type: 'string', label: 'Client Label', name: 'clientLabel' },
      { type: 'string', label: 'Section: Context', name: 'sectionContext' },
      { type: 'string', label: 'Section: Approach', name: 'sectionApproach' },
      { type: 'string', label: 'Section: Findings', name: 'sectionFindings' },
      { type: 'string', label: 'Section: Outputs', name: 'sectionOutputs' },
      { type: 'string', label: 'Section: Why Us', name: 'sectionWhy' },
      { type: 'string', label: 'Contact Label', name: 'contactLabel' },
      { type: 'string', label: 'CTA Title', name: 'ctaTitle' },
      { type: 'string', label: 'CTA Description', name: 'ctaDesc' },
      { type: 'string', label: 'CTA Button', name: 'cta' },
    ],
  } as const,
];

const CaseStudiesChrome: Collection = {
  label: 'Case Studies Chrome',
  name: 'caseStudiesChrome',
  path: 'content/case-studies-chrome',
  format: 'json',
  ui: { global: true },
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: chromeLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: chromeLocaleFields as any },
  ],
};

export default CaseStudiesChrome;
```

- [x] **Step 3: Register both collections**

Modify `tina/config.tsx`:

```ts
// tina/config.tsx
import { defineConfig } from 'tinacms';
import Global from './collection/global';
import Home from './collection/home';
import CaseStudy from './collection/case-study';
import CaseStudiesChrome from './collection/case-studies-chrome';

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! ||
    process.env.HEAD!,
  token: process.env.TINA_TOKEN!,
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'uploads',
    },
  },
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
    basePath: '',
  },
  schema: {
    collections: [Global, Home, CaseStudy, CaseStudiesChrome],
  },
});

export default config;
```

- [x] **Step 4: Regenerate the Tina client/types**

Run: `npm run build-local`
Expected: Completes without schema errors. `tina/__generated__/types.ts` now exports `CaseStudyQuery`, `CaseStudyConnectionQuery`, `CaseStudiesChromeQuery` (and their `*Variables`/`*Fragment` siblings), and `tina/__generated__/client.ts`'s generated client exposes `client.queries.caseStudy`, `client.queries.caseStudyConnection`, `client.queries.caseStudiesChrome`.

- [x] **Step 5: Commit**

```bash
git add tina/collection/case-study.ts tina/collection/case-studies-chrome.ts tina/config.tsx
git commit -m "$(cat <<'EOF'
Add CaseStudy list collection and CaseStudiesChrome singleton schema

Defines the cs/en content shape for individual case studies (mirroring
the existing CaseStudy TS interface, with findings' 3-tuples flattened
to named fields) and the shared list/detail page chrome copy.
EOF
)"
```

---

### Task 2: Migrate case-study content into Tina via a one-off script

**Files:**
- Create: `scripts/migrate-case-studies-to-tina.ts` (deleted at the end of this task)
- Create: `content/case-studies/av-media.json`
- Create: `content/case-studies/global-payments.json`
- Create: `content/case-studies/generali.json`

**Interfaces:**
- Consumes: `CASE_STUDIES` exported from `components/pages/case-studies/case-study-data.ts:?` (the `Record<string, Record<CaseStudyLocale, CaseStudy>>` keyed by slug).
- Produces: three JSON files matching Task 1's schema exactly (with `findings.columns`/`cols` tuples flattened).

The `serviceType` and `listResult` values below are migrated from `messages.caseStudies`' `cs{N}Service`/`cs{N}Result` keys (verified against the current `messages/en.json`/`messages/cs.json` — these are the only two fields from that namespace actually rendered per-card; `cs{N}Client` and `cs{N}Desc` are dead keys, already superseded by `case-study-data.ts`'s own `client`/`hero.intro` and correctly NOT migrated).

- [x] **Step 1: Create the migration script**

```ts
// scripts/migrate-case-studies-to-tina.ts
import { writeFileSync, mkdirSync } from 'fs';
import { CASE_STUDIES } from '../components/pages/case-studies/case-study-data';
import type { CaseStudy, CaseStudyLocale } from '../components/pages/case-studies/case-study-data';

const SERVICE_TYPE: Record<string, Record<CaseStudyLocale, string>> = {
  'av-media': { cs: 'Research + Workshop', en: 'Research + Workshop' },
  'global-payments': { cs: 'Workshop', en: 'Workshop' },
  generali: { cs: 'Konzultace', en: 'Consultation' },
};

const LIST_RESULT: Record<string, Record<CaseStudyLocale, string>> = {
  'av-media': {
    cs: 'Klient získal konkrétní playbook s kroky, jak komunikovat s juniorními kolegy a přitahovat mladé talenty.',
    en: 'The client received a specific playbook with steps on how to communicate with junior colleagues and attract young talent.',
  },
  'global-payments': {
    cs: 'Tým odešel se čtyřmi konkrétními kroky pro optimalizaci komunikace a onboardingu.',
    en: 'The team left with four specific steps to optimize communication and onboarding.',
  },
  generali: {
    cs: 'Identifikovány klíčové bariéry v recruitmentu a navrženy konkrétní úpravy komunikace.',
    en: 'Key barriers in recruitment identified and specific communication adjustments proposed.',
  },
};

function transformLocale(cs: CaseStudy, slug: string, locale: CaseStudyLocale) {
  return {
    client: cs.client,
    serviceType: SERVICE_TYPE[slug][locale],
    listResult: LIST_RESULT[slug][locale],
    logo: cs.logo,
    logoAlt: cs.logoAlt,
    year: cs.year,
    hero: cs.hero,
    scope: cs.scope,
    stats: cs.stats,
    context: cs.context,
    approach: cs.approach,
    findings: {
      headline: cs.findings.headline,
      intro: cs.findings.intro,
      column1: cs.findings.columns[0],
      column2: cs.findings.columns[1],
      column3: cs.findings.columns[2],
      items: cs.findings.items.map((item) => ({
        category: item.category,
        title: item.title,
        col1: item.cols[0],
        col2: item.cols[1],
        col3: item.cols[2],
      })),
    },
    outputs: cs.outputs,
    whyUs: cs.whyUs,
    contact: cs.contact,
  };
}

mkdirSync('content/case-studies', { recursive: true });

for (const [slug, entry] of Object.entries(CASE_STUDIES)) {
  const doc = {
    cs: transformLocale(entry.cs, slug, 'cs'),
    en: transformLocale(entry.en, slug, 'en'),
  };
  writeFileSync(`content/case-studies/${slug}.json`, JSON.stringify(doc, null, 2) + '\n');
  console.log(`wrote content/case-studies/${slug}.json`);
}
```

- [x] **Step 2: Run the script**

Run: `npx tsx scripts/migrate-case-studies-to-tina.ts`
Expected: Prints three lines (`wrote content/case-studies/av-media.json`, `.../global-payments.json`, `.../generali.json`) and creates those three files. If `npx` prompts to install `tsx`, accept — it isn't a project dependency, just a one-off runner.

- [x] **Step 3: Verify the output against the source**

Run a diff check confirming no content was lost or altered — for each of the 3 slugs, confirm the JSON's `cs`/`en` field values match `case-study-data.ts`'s corresponding record exactly (spot-check `hero.headline`, `hero.intro`, at least one `whyPoints` entry, `findings.items[0].col1/col2/col3` against the source's `cols[0]/cols[1]/cols[2]`, and `outputs.quote`/`quoteAuthor`, for both locales, for all 3 slugs — that's 3 slugs × 2 locales × ~5 spot-checks = 30 comparisons; do this by eye reading both files side by side, or with a short Node one-liner that loads both and asserts equality on those paths).

Expected: Every spot-checked value matches verbatim (this is a mechanical transform, not a rewrite — any mismatch means a bug in the script, not an intentional change).

- [x] **Step 4: Regenerate the Tina client and confirm the new content validates against the Task 1 schema**

Run: `npm run build-local`
Expected: Completes without schema errors (confirms all 3 JSON files' field names match `tina/collection/case-study.ts` exactly).

- [x] **Step 5: Delete the one-off script and commit the content**

```bash
rm scripts/migrate-case-studies-to-tina.ts
git add content/case-studies/av-media.json content/case-studies/global-payments.json content/case-studies/generali.json
git commit -m "$(cat <<'EOF'
Add case-study content to Tina, reshaped from case-study-data.ts

Transcribes all 3 case studies (av-media, global-payments, generali,
cs/en) into the new CaseStudy collection shape via a one-off script
(deleted after use); findings' 3-tuples flattened to column1-3/col1-3.
serviceType/listResult per card migrated from messages.caseStudies.
EOF
)"
```

---

### Task 3: Write `content/case-studies-chrome/index.json`

**Files:**
- Create: `content/case-studies-chrome/index.json`

- [x] **Step 1: Create the file**

```json
{
  "cs": {
    "list": {
      "eyebrow": "Naše práce",
      "title": "Projekty, kde jsme pomohli",
      "subtitle": "Konkrétní výsledky z reálné spolupráce se středními a velkými firmami.",
      "resultLabel": "Výsledek",
      "readMore": "Přečíst case study",
      "ctaTitle": "Chcete podobné výsledky?",
      "ctaDesc": "Domluvte si nezávazný call a zjistíme, jak můžeme pomoci vaší firmě.",
      "cta": "Domluvit schůzku"
    },
    "detail": {
      "back": "Zpět na case studies",
      "caseLabel": "Case study",
      "clientLabel": "Klient",
      "sectionContext": "Kontext & výzva",
      "sectionApproach": "Náš přístup",
      "sectionFindings": "Klíčová zjištění",
      "sectionOutputs": "Výstupy & dopad",
      "sectionWhy": "Proč GenZ Consulting",
      "contactLabel": "Kontakt",
      "ctaTitle": "Chcete podobné výsledky?",
      "ctaDesc": "Domluvte si nezávazný call a zjistíme, jak můžeme pomoci vaší firmě.",
      "cta": "Domluvit schůzku"
    }
  },
  "en": {
    "list": {
      "eyebrow": "Our work",
      "title": "Projects where we helped",
      "subtitle": "Concrete results from real collaboration with mid-size and large companies.",
      "resultLabel": "Result",
      "readMore": "Read case study",
      "ctaTitle": "Want similar results?",
      "ctaDesc": "Book a no-obligation call and we'll find out how we can help your company.",
      "cta": "Book a call"
    },
    "detail": {
      "back": "Back to case studies",
      "caseLabel": "Case study",
      "clientLabel": "Client",
      "sectionContext": "Context & challenge",
      "sectionApproach": "Our approach",
      "sectionFindings": "Key findings",
      "sectionOutputs": "Outputs & impact",
      "sectionWhy": "Why GenZ Consulting",
      "contactLabel": "Contact",
      "ctaTitle": "Want similar results?",
      "ctaDesc": "Book a no-obligation call and we'll find out how we can help your company.",
      "cta": "Book a call"
    }
  }
}
```

- [x] **Step 2: Commit**

```bash
git add content/case-studies-chrome/index.json
git commit -m "$(cat <<'EOF'
Add case-studies list/detail page chrome content to Tina

Reshaped verbatim from messages.caseStudies and messages.caseStudyDetail.
EOF
)"
```

---

### Task 4: Migrate `CaseStudiesPage` + the list route to Tina (TDD)

**Files:**
- Modify: `components/pages/case-studies/CaseStudiesPage.tsx`
- Modify: `app/[locale]/case-studies/page.tsx`
- Test: `tests/components/CaseStudiesPage.test.tsx` (create)

**Interfaces:**
- Consumes: `CaseStudiesChromeQuery`, `CaseStudyConnectionQuery` (from Task 1).
- Produces: `CaseStudiesPage` component taking `{ chrome, cards }` props; no `useTranslations` or `getCaseStudy` dependency.

- [x] **Step 1: Write the failing test**

Create `tests/components/CaseStudiesPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CaseStudiesPage from '@/components/pages/case-studies/CaseStudiesPage'

const chrome = {
  eyebrow: 'Naše práce',
  title: 'Projekty, kde jsme pomohli',
  subtitle: 'Konkrétní výsledky.',
  resultLabel: 'Výsledek',
  readMore: 'Přečíst case study',
  ctaTitle: 'Chcete podobné výsledky?',
  ctaDesc: 'Domluvte si call.',
  cta: 'Domluvit schůzku',
} as any

const cards = [
  {
    slug: 'av-media',
    client: 'AV MEDIA',
    desc: 'Popis case study.',
    serviceType: 'Research + Workshop',
    listResult: 'Klient získal konkrétní playbook.',
    logo: '/AV-MEDIA-SYSTEMS_horizontalni_1200_1200-970x970.png',
    logoAlt: 'AV Media Systems',
  },
] as any

describe('CaseStudiesPage', () => {
  it('renders chrome and case-study cards from props', () => {
    render(<CaseStudiesPage chrome={chrome} cards={cards} />)
    expect(screen.getByText('Projekty, kde jsme pomohli')).toBeInTheDocument()
    expect(screen.getByText('AV MEDIA')).toBeInTheDocument()
    expect(screen.getByText('Research + Workshop')).toBeInTheDocument()
    expect(screen.getByText('Klient získal konkrétní playbook.')).toBeInTheDocument()
    expect(screen.getByText('Chcete podobné výsledky?')).toBeInTheDocument()
  })
})
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/components/CaseStudiesPage.test.tsx`
Expected: FAIL — `CaseStudiesPage` currently takes no props and sources everything from `useTranslations('caseStudies')` (mocked to identity in `vitest.setup.ts`) plus its own hardcoded `CASE_STUDIES` array, so none of the mock content appears.

- [x] **Step 3: Replace `components/pages/case-studies/CaseStudiesPage.tsx`**

```tsx
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ContactButton } from '@/components/ui/ContactButton';
import type { CaseStudiesChromeQuery } from '../../../tina/__generated__/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

export type CaseStudiesListChrome = NonNullable<
  NonNullable<CaseStudiesChromeQuery['caseStudiesChrome']>['cs']
>['list'];

export type CaseStudyCard = {
  slug: string;
  client: string;
  desc: string;
  serviceType: string;
  listResult: string;
  logo: string;
  logoAlt: string;
};

export default function CaseStudiesPage({
  chrome,
  cards,
}: {
  chrome: CaseStudiesListChrome;
  cards: CaseStudyCard[];
}) {
  const locale = useLocale();

  if (!chrome) return null;

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] bg-gtc-primary flex flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-black/50"
          >
            {chrome.eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-5xl font-black leading-[1.05] tracking-tight text-black sm:text-6xl md:text-7xl"
          >
            {chrome.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl text-lg font-semibold text-black/60"
          >
            {chrome.subtitle}
          </motion.p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[18vw] font-black leading-none text-black/5"
        >
          GZC
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {cards.map(({ slug, client, desc, serviceType, listResult, logo, logoAlt }, i) => (
              <motion.article
                key={slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="group flex flex-col border border-zinc-200 hover:border-gtc-primary transition-colors duration-200"
              >
                {/* Card top */}
                <div className="flex flex-col gap-3 p-7 pb-6">
                  {logo && logoAlt ? (
                    <div className="mb-3">
                      <Image
                        src={logo}
                        alt={logoAlt}
                        width={90}
                        height={24}
                        className="h-6 w-auto object-contain grayscale opacity-70"
                      />
                    </div>
                  ) : null}
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-gtc-dark">
                    {serviceType}
                  </span>
                  <h2 className="text-xl font-black text-black leading-tight">{client}</h2>
                  <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
                </div>

                {/* Result box */}
                <div className="border-t border-l-4 border-t-zinc-100 border-l-gtc-primary bg-zinc-50 px-6 py-5">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-gtc-dark">
                    {chrome.resultLabel}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-700 font-medium">
                    {listResult}
                  </p>
                </div>

                {/* Read case study */}
                <Link
                  href={`/${locale}/case-studies/${slug}`}
                  className="mt-auto flex items-center justify-center gap-1.5 border-t border-zinc-100 py-4 text-xs font-bold uppercase tracking-[0.1em] text-zinc-600 transition-colors duration-150 group-hover:bg-gtc-primary group-hover:text-black hover:bg-gtc-primary hover:text-black"
                >
                  {chrome.readMore}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gtc-deep py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl font-black text-white md:text-5xl">{chrome.ctaTitle}</h2>
            <p className="mt-4 text-base text-white/60">{chrome.ctaDesc}</p>
            <div className="mt-10">
                <ContactButton
                  label={chrome.cta ?? ''}
                  size="lg"
                  className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
                />
              </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
```

- [x] **Step 4: Replace `app/[locale]/case-studies/page.tsx`**

```tsx
import React from 'react';
import Layout from '@/components/layout/layout';
import CaseStudiesPage, { type CaseStudyCard } from '@/components/pages/case-studies/CaseStudiesPage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [{ data: chromeData }, { data: connectionData }] = await Promise.all([
    client.queries.caseStudiesChrome(
      { relativePath: 'index.json' },
      { fetchOptions: { next: { revalidate: 300 } } }
    ),
    client.queries.caseStudyConnection(undefined, {
      fetchOptions: { next: { revalidate: 300 } },
    }),
  ]);

  const chrome = locale === 'en' ? chromeData.caseStudiesChrome?.en : chromeData.caseStudiesChrome?.cs;

  const cards: CaseStudyCard[] = (connectionData.caseStudyConnection.edges ?? [])
    .map((edge) => {
      const node = edge?.node;
      if (!node) return null;
      const content = locale === 'en' ? node.en : node.cs;
      if (!content) return null;
      return {
        slug: node._sys.filename,
        client: content.client ?? '',
        desc: content.hero?.intro ?? '',
        serviceType: content.serviceType ?? '',
        listResult: content.listResult ?? '',
        logo: content.logo ?? '',
        logoAlt: content.logoAlt ?? '',
      };
    })
    .filter((card): card is CaseStudyCard => Boolean(card));

  return (
    <Layout>
      <CaseStudiesPage chrome={chrome} cards={cards} />
    </Layout>
  );
}
```

- [x] **Step 5: Run the test to verify it passes**

Run: `npx vitest run tests/components/CaseStudiesPage.test.tsx`
Expected: PASS

- [x] **Step 6: Commit**

```bash
git add components/pages/case-studies/CaseStudiesPage.tsx "app/[locale]/case-studies/page.tsx" tests/components/CaseStudiesPage.test.tsx
git commit -m "$(cat <<'EOF'
Wire CaseStudiesPage to Tina content instead of next-intl/case-study-data

app/[locale]/case-studies/page.tsx fetches the chrome singleton and all
case-study documents via a Tina connection query, resolves the requested
locale, and passes both down as props.
EOF
)"
```

---

### Task 5: Migrate `CaseStudyDetail` + the detail route to Tina (TDD)

**Files:**
- Modify: `components/pages/case-studies/CaseStudyDetail.tsx`
- Modify: `app/[locale]/case-studies/[slug]/page.tsx`
- Test: `tests/components/CaseStudyDetail.test.tsx` (create)

**Interfaces:**
- Consumes: `CaseStudyQuery`, `CaseStudyConnectionQuery`, `CaseStudiesChromeQuery` (from Task 1).
- Produces: `CaseStudyDetail` component taking `{ cs, chrome }` props; no `useTranslations` or `getCaseStudy` dependency.

- [x] **Step 1: Write the failing test**

Create `tests/components/CaseStudyDetail.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CaseStudyDetail from '@/components/pages/case-studies/CaseStudyDetail'

const chrome = {
  back: 'Zpět na case studies',
  caseLabel: 'Case study',
  clientLabel: 'Klient',
  sectionContext: 'Kontext & výzva',
  sectionApproach: 'Náš přístup',
  sectionFindings: 'Klíčová zjištění',
  sectionOutputs: 'Výstupy & dopad',
  sectionWhy: 'Proč GenZ Consulting',
  contactLabel: 'Kontakt',
  ctaTitle: 'Chcete podobné výsledky?',
  ctaDesc: 'Domluvte si call.',
  cta: 'Domluvit schůzku',
} as any

const cs = {
  client: 'AV MEDIA',
  logo: '/logo.png',
  logoAlt: 'AV Media',
  year: '2026',
  hero: { headline: 'Testovací headline', intro: 'Testovací intro.' },
  scope: [{ label: 'Rozsah', value: 'Test' }],
  stats: [{ value: '10', label: 'test statistika' }],
  context: {
    headline: 'Context headline',
    intro: 'Context intro.',
    clientLabel: 'Kdo je klient',
    client: 'Popis klienta.',
    whyTitle: 'Proč to nebyl běžný projekt',
    whyPoints: [{ title: 'Bod jedna', body: 'Popis bodu.' }],
    briefLabel: 'Naše zadání',
    brief: 'Popis zadání.',
  },
  approach: {
    headline: 'Approach headline',
    intro: 'Approach intro.',
    steps: [{ num: '1', title: 'Krok jedna', body: 'Popis kroku.' }],
    assessedTitle: 'Co jsme posuzovali',
    assessedIntro: 'Intro.',
    assessed: [{ num: '01', title: 'Assessed jedna' }],
  },
  findings: {
    headline: 'Findings headline',
    intro: 'Findings intro.',
    column1: 'Sloupec 1',
    column2: 'Sloupec 2',
    column3: 'Sloupec 3',
    items: [{ category: 'Kategorie', title: 'Finding jedna', col1: 'C1', col2: 'C2', col3: 'C3' }],
  },
  outputs: {
    headline: 'Outputs headline',
    intro: 'Outputs intro.',
    items: [{ num: '01', title: 'Output jedna', body: 'Popis outputu.' }],
    quote: 'Testovací citace.',
    quoteAuthor: '— tým',
  },
  whyUs: {
    headline: 'Why us headline',
    intro: 'Why us intro.',
    pillars: [{ num: '01', title: 'Pilíř jedna', body: 'Popis pilíře.' }],
  },
  contact: { name: 'Adam Dalecký', email: 'adam@example.com', web: 'www.example.com' },
} as any

describe('CaseStudyDetail', () => {
  it('renders case-study content and chrome from props', () => {
    render(<CaseStudyDetail cs={cs} chrome={chrome} />)
    expect(screen.getByText('Testovací headline')).toBeInTheDocument()
    expect(screen.getByText('Context headline')).toBeInTheDocument()
    expect(screen.getByText('C1')).toBeInTheDocument()
    expect(screen.getByText('Testovací citace.')).toBeInTheDocument()
    expect(screen.getByText('Zpět na case studies')).toBeInTheDocument()
    expect(screen.getByText('Kontext & výzva')).toBeInTheDocument()
  })

  it('renders nothing when cs is missing', () => {
    const { container } = render(<CaseStudyDetail cs={null as any} chrome={chrome} />)
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/components/CaseStudyDetail.test.tsx`
Expected: FAIL — `CaseStudyDetail` currently takes a `{ slug }` prop and calls `getCaseStudy(slug, locale)` internally plus `useTranslations('caseStudyDetail')`, so it won't recognize a `cs`/`chrome` prop pair and the mock content won't render.

- [x] **Step 3: Edit `components/pages/case-studies/CaseStudyDetail.tsx`**

This file's JSX body is unchanged except for the pieces below — apply each edit exactly as shown (old → new), leaving everything else (the `AnimatedNumber`/`AnimatedStat`/`SectionEyebrow` helper components, and all JSX not mentioned here) untouched.

**Edit 1 — imports and type import:**

```tsx
// OLD:
'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Mail, Quote } from 'lucide-react';
import { ContactButton } from '@/components/ui/ContactButton';
import { getCaseStudy } from './case-study-data';

// NEW:
'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Mail, Quote } from 'lucide-react';
import { ContactButton } from '@/components/ui/ContactButton';
import type { CaseStudyQuery, CaseStudiesChromeQuery } from '../../../tina/__generated__/types';

export type CaseStudyContent = NonNullable<NonNullable<CaseStudyQuery['caseStudy']>['cs']>;
export type CaseStudyDetailChrome = NonNullable<
  NonNullable<CaseStudiesChromeQuery['caseStudiesChrome']>['cs']
>['detail'];
```

**Edit 2 — function signature and data source:**

```tsx
// OLD:
export default function CaseStudyDetail({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations('caseStudyDetail');

  const cs = getCaseStudy(slug, locale);
  if (!cs) return null;

// NEW:
export default function CaseStudyDetail({ cs, chrome }: { cs: CaseStudyContent; chrome: CaseStudyDetailChrome }) {
  const locale = useLocale();

  if (!cs || !chrome) return null;
```

**Edit 3 — back link (top of hero):**

```tsx
// OLD:
              <ArrowLeft className="size-3.5" />
              {t('back')}
            </Link>

// NEW:
              <ArrowLeft className="size-3.5" />
              {chrome.back}
            </Link>
```

**Edit 4 — client label chip:**

```tsx
// OLD:
              {t('clientLabel')}
            </span>

// NEW:
              {chrome.clientLabel}
            </span>
```

**Edit 5 — case label + year:**

```tsx
// OLD:
            {t('caseLabel')} · {cs.year}
          </motion.p>

// NEW:
            {chrome.caseLabel} · {cs.year}
          </motion.p>
```

**Edit 6 — section eyebrows (4 occurrences, each with a distinct label — edit each individually):**

```tsx
// OLD:
          <SectionEyebrow num="01" label={t('sectionContext')} />
// NEW:
          <SectionEyebrow num="01" label={chrome.sectionContext} />
```

```tsx
// OLD:
          <SectionEyebrow num="02" label={t('sectionApproach')} />
// NEW:
          <SectionEyebrow num="02" label={chrome.sectionApproach} />
```

```tsx
// OLD:
          <SectionEyebrow num="03" label={t('sectionFindings')} />
// NEW:
          <SectionEyebrow num="03" label={chrome.sectionFindings} />
```

```tsx
// OLD:
            {t('sectionOutputs')}
          </motion.p>
// NEW:
            {chrome.sectionOutputs}
          </motion.p>
```

```tsx
// OLD:
          <SectionEyebrow num="05" label={t('sectionWhy')} />
// NEW:
          <SectionEyebrow num="05" label={chrome.sectionWhy} />
```

**Edit 7 — findings column labels (tuple → named fields):**

```tsx
// OLD:
          <div className="mt-12 flex flex-col gap-6">
            {cs.findings.items.map((item, i) => (
              <motion.article
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="border border-zinc-200 transition-colors hover:border-gtc-primary"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-zinc-100 bg-zinc-50 px-7 py-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gtc-dark">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-black text-black">{item.title}</h3>
                </div>
                <div className="grid gap-px bg-zinc-100 md:grid-cols-3">
                  {item.cols.map((col, c) => (
                    <div key={c} className="bg-white p-7">
                      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                        {cs.findings.columns[c]}
                      </p>
                      <p className="text-sm leading-relaxed text-zinc-700">{col}</p>
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>

// NEW:
          <div className="mt-12 flex flex-col gap-6">
            {cs.findings.items.map((item, i) => {
              const columns = [cs.findings.column1, cs.findings.column2, cs.findings.column3];
              const cols = [item?.col1, item?.col2, item?.col3];
              return (
                <motion.article
                  key={item?.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.08}
                  className="border border-zinc-200 transition-colors hover:border-gtc-primary"
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-zinc-100 bg-zinc-50 px-7 py-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gtc-dark">
                      {item?.category}
                    </span>
                    <h3 className="text-lg font-black text-black">{item?.title}</h3>
                  </div>
                  <div className="grid gap-px bg-zinc-100 md:grid-cols-3">
                    {cols.map((col, c) => (
                      <div key={c} className="bg-white p-7">
                        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                          {columns[c]}
                        </p>
                        <p className="text-sm leading-relaxed text-zinc-700">{col}</p>
                      </div>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
```

**Edit 8 — contact label:**

```tsx
// OLD:
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {t('contactLabel')}
            </p>

// NEW:
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {chrome.contactLabel}
            </p>
```

**Edit 9 — bottom CTA:**

```tsx
// OLD:
            <h2 className="text-4xl font-black text-white md:text-5xl">{t('ctaTitle')}</h2>
            <p className="mt-4 text-base text-white/60">{t('ctaDesc')}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ContactButton
                  label={t('cta')}
                  size="lg"
                  className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black transition-colors hover:bg-gtc-primary/90"
                />
              <Link
                href={`/${locale}/case-studies`}
                className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.1em] text-white/60 transition-colors hover:text-gtc-primary"
              >
                {t('back')}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

// NEW:
            <h2 className="text-4xl font-black text-white md:text-5xl">{chrome.ctaTitle}</h2>
            <p className="mt-4 text-base text-white/60">{chrome.ctaDesc}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ContactButton
                  label={chrome.cta ?? ''}
                  size="lg"
                  className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black transition-colors hover:bg-gtc-primary/90"
                />
              <Link
                href={`/${locale}/case-studies`}
                className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.1em] text-white/60 transition-colors hover:text-gtc-primary"
              >
                {chrome.back}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
```

- [x] **Step 4: Replace `app/[locale]/case-studies/[slug]/page.tsx`**

```tsx
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/layout';
import CaseStudyDetail from '@/components/pages/case-studies/CaseStudyDetail';
import client from '@/tina/__generated__/client';
import { routing } from '@/i18n/routing';

export const revalidate = 300;

export async function generateStaticParams() {
  const { data } = await client.queries.caseStudyConnection();
  const slugs = (data.caseStudyConnection.edges ?? [])
    .map((edge) => edge?.node?._sys.filename)
    .filter((slug): slug is string => Boolean(slug));

  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const { data } = await client.queries.caseStudy({ relativePath: `${slug}.json` });
    const content = locale === 'en' ? data.caseStudy.en : data.caseStudy.cs;
    if (!content) return {};
    const title = `${content.client} — Case study | GenZ Consulting`;
    return {
      title,
      description: content.hero?.intro ?? '',
      openGraph: { title, description: content.hero?.intro ?? '' },
    };
  } catch {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Tina's generated client may either reject or resolve with `errors` populated
  // when `relativePath` doesn't match a document — handle both the same way,
  // matching the old `if (!getCaseStudy(slug, locale)) notFound();` check.
  const result = await client.queries
    .caseStudy({ relativePath: `${slug}.json` })
    .catch(() => ({ data: null, errors: [{ message: 'not found' }] }));

  if (result.errors?.length || !result.data?.caseStudy) notFound();

  const { data: chromeData } = await client.queries.caseStudiesChrome({ relativePath: 'index.json' });

  const cs = locale === 'en' ? result.data.caseStudy.en : result.data.caseStudy.cs;
  const chrome = locale === 'en' ? chromeData.caseStudiesChrome?.en?.detail : chromeData.caseStudiesChrome?.cs?.detail;

  if (!cs) notFound();

  return (
    <Layout>
      <CaseStudyDetail cs={cs} chrome={chrome} />
    </Layout>
  );
}
```

- [x] **Step 5: Run the test to verify it passes**

Run: `npx vitest run tests/components/CaseStudyDetail.test.tsx`
Expected: PASS (2/2)

- [x] **Step 6: Commit**

```bash
git add components/pages/case-studies/CaseStudyDetail.tsx "app/[locale]/case-studies/[slug]/page.tsx" tests/components/CaseStudyDetail.test.tsx
git commit -m "$(cat <<'EOF'
Wire CaseStudyDetail to Tina content instead of next-intl/case-study-data

[slug]/page.tsx fetches the case-study document and chrome singleton,
resolves the requested locale, and passes both down as props.
generateStaticParams now enumerates Tina case-study documents instead
of the retired caseStudySlugs constant.
EOF
)"
```

---

### Task 6: Update HomePage's case-study teaser section to read from Tina

**Files:**
- Modify: `components/pages/home/HomePage.tsx`
- Modify: `app/[locale]/page.tsx`
- Modify: `tests/components/HomePage.test.tsx`

**Interfaces:**
- Consumes: `CaseStudyConnectionQuery` (from Task 1).
- Produces: `HomePage` takes an additional `caseStudies: { slug: string; client: string; intro: string }[]` prop; no `case-study-data.ts` dependency remains anywhere in `components/pages/home/`.

- [x] **Step 1: Update the failing/passing test to supply the new prop**

Modify `tests/components/HomePage.test.tsx`: add a `caseStudies` array to the render call and assert one of its values renders.

```tsx
// Add near the top, alongside the existing `content`/`logos` fixtures:
const caseStudies = [
  { slug: 'av-media', client: 'AV MEDIA', intro: 'Testovací case study popis.' },
] as any

// Change the render call from:
render(<HomePage content={content} logos={logos} />)
// to:
render(<HomePage content={content} logos={logos} caseStudies={caseStudies} />)

// Add one more assertion in the existing test body:
expect(screen.getByText('AV MEDIA')).toBeInTheDocument()
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/components/HomePage.test.tsx`
Expected: FAIL — `HomePage` doesn't accept a `caseStudies` prop yet (TypeScript would also flag the extra prop; at minimum the new assertion fails since `HomePage` still computes its own case studies internally via the now-removed-in-spirit `getCaseStudy` import, unrelated to this test's mock data).

- [x] **Step 3: Edit `components/pages/home/HomePage.tsx`**

**Edit 1 — remove the `case-study-data.ts` import:**

```tsx
// OLD:
import { getCaseStudy } from '@/components/pages/case-studies/case-study-data';
import type { HomeQuery } from '../../../tina/__generated__/types';

// NEW:
import type { HomeQuery } from '../../../tina/__generated__/types';
```

**Edit 2 — accept `caseStudies` as a prop instead of computing it internally:**

```tsx
// OLD:
export default function HomePage({ content, logos }: { content: HomeContent; logos: HomeLogos }) {
  const locale = useLocale();

  const caseStudies = ['av-media', 'global-payments', 'generali']
    .map((slug) => {
      const cs = getCaseStudy(slug, locale);
      return cs ? { slug, client: cs.client, intro: cs.hero.intro } : null;
    })
    .filter((cs): cs is { slug: string; client: string; intro: string } => Boolean(cs));

// NEW:
export type HomeCaseStudyTeaser = { slug: string; client: string; intro: string };

export default function HomePage({
  content,
  logos,
  caseStudies,
}: {
  content: HomeContent;
  logos: HomeLogos;
  caseStudies: HomeCaseStudyTeaser[];
}) {
  const locale = useLocale();
```

(The rest of the function — including the `caseStudies.map(({ client, intro, slug }, i) => ...)` render block later in the file — is unchanged; it already consumes the `caseStudies` array by the same shape.)

- [x] **Step 4: Update `app/[locale]/page.tsx` to fetch and pass the teaser case studies**

```tsx
// OLD:
import React from 'react';
import Layout from '@/components/layout/layout';
import HomePage from '@/components/pages/home/HomePage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { data } = await client.queries.home(
    { relativePath: 'index.json' },
    { fetchOptions: { next: { revalidate: 300 } } }
  );
  const content = locale === 'en' ? data.home.en : data.home.cs;

  return (
    <Layout>
      <HomePage content={content} logos={data.home.logos} />
    </Layout>
  );
}

// NEW:
import React from 'react';
import Layout from '@/components/layout/layout';
import HomePage, { type HomeCaseStudyTeaser } from '@/components/pages/home/HomePage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

const TEASER_SLUGS = ['av-media', 'global-payments', 'generali'];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [{ data }, { data: connectionData }] = await Promise.all([
    client.queries.home(
      { relativePath: 'index.json' },
      { fetchOptions: { next: { revalidate: 300 } } }
    ),
    client.queries.caseStudyConnection(undefined, {
      fetchOptions: { next: { revalidate: 300 } },
    }),
  ]);
  const content = locale === 'en' ? data.home.en : data.home.cs;

  const caseStudies: HomeCaseStudyTeaser[] = (connectionData.caseStudyConnection.edges ?? [])
    .map((edge) => {
      const node = edge?.node;
      if (!node) return null;
      const slug = node._sys.filename;
      if (!TEASER_SLUGS.includes(slug)) return null;
      const csContent = locale === 'en' ? node.en : node.cs;
      if (!csContent) return null;
      return { slug, client: csContent.client ?? '', intro: csContent.hero?.intro ?? '' };
    })
    .filter((cs): cs is HomeCaseStudyTeaser => Boolean(cs))
    .sort((a, b) => TEASER_SLUGS.indexOf(a.slug) - TEASER_SLUGS.indexOf(b.slug));

  return (
    <Layout>
      <HomePage content={content} logos={data.home.logos} caseStudies={caseStudies} />
    </Layout>
  );
}
```

- [x] **Step 5: Run the test to verify it passes**

Run: `npx vitest run tests/components/HomePage.test.tsx`
Expected: PASS

- [x] **Step 6: Run the full test suite and a type-check**

Run: `npm run test:run && npx tsc --noEmit`
Expected: Same pre-existing 4 `LeadMagnetModal.test.tsx` failures (unrelated, confirmed identical on `main` before any Tina migration work), no new failures; `tsc` clean.

- [x] **Step 7: Commit**

```bash
git add components/pages/home/HomePage.tsx "app/[locale]/page.tsx" tests/components/HomePage.test.tsx
git commit -m "$(cat <<'EOF'
Wire HomePage's case-study teaser cards to Tina instead of case-study-data.ts

app/[locale]/page.tsx now fetches all case-study documents via a Tina
connection query and passes the 3 teaser cards down as a prop, so
HomePage no longer imports from the file this migration is retiring.
EOF
)"
```

---

### Task 7: Retire `case-study-data.ts` and the old message namespaces

**Files:**
- Delete: `components/pages/case-studies/case-study-data.ts`
- Modify: `messages/en.json`
- Modify: `messages/cs.json`

**Interfaces:**
- Consumes: nothing new.
- Produces: no file in the repo imports from `case-study-data.ts`; `messages/*.json` no longer has `caseStudies`/`caseStudyDetail` keys; every other namespace untouched.

- [x] **Step 1: Confirm nothing still imports the retired file**

Run: `grep -rln "case-study-data" --include="*.tsx" --include="*.ts" components app tests`
Expected: No matches (Tasks 4-6 removed the only three importers: `CaseStudiesPage.tsx`, `CaseStudyDetail.tsx`, `HomePage.tsx`).

- [x] **Step 2: Delete the file**

```bash
git rm components/pages/case-studies/case-study-data.ts
```

- [x] **Step 3: Remove the `caseStudies` and `caseStudyDetail` keys from `messages/en.json` and `messages/cs.json`**

Delete both top-level objects from each file, leaving every other namespace (`leadMagnet`, `services`, `traineeProgram`, `onboardingApp`, `genzWorkshop`, `careerPages`, `customSolution`, `about`, `contactDialog`, `contact`) exactly as-is.

- [x] **Step 4: Verify nothing still references the removed keys**

Run: `grep -rn "useTranslations('caseStudies')\|useTranslations(\"caseStudies\")\|useTranslations('caseStudyDetail')\|useTranslations(\"caseStudyDetail\")" --include="*.tsx" components app`
Expected: No matches.

- [x] **Step 5: Run the full test suite and a type-check**

Run: `npm run test:run && npx tsc --noEmit`
Expected: Same pre-existing 4 `LeadMagnetModal.test.tsx` failures, no new failures; `tsc` clean (this also confirms no other file still references any type/export from the deleted `case-study-data.ts`).

- [x] **Step 6: Commit**

```bash
git add -u messages/en.json messages/cs.json
git commit -m "$(cat <<'EOF'
Retire case-study-data.ts and the caseStudies/caseStudyDetail message namespaces

All case-study content and page chrome now live in Tina
(content/case-studies/*.json, content/case-studies-chrome/index.json).
EOF
)"
```

---

### Task 8: Manual verification

**Files:** none (verification only)

- [x] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Starts without errors.

- [x] **Step 2: Compare rendered pages against pre-migration behavior**

Open (or `curl`) each of these on both `/cs` and `/en`, comparing content to what existed before this pass:
- `/case-studies` — hero eyebrow/title/subtitle, all 3 cards (logo, service type, client name, description, result box, "read more" link), bottom CTA.
- `/case-studies/av-media`, `/case-studies/global-payments`, `/case-studies/generali` — hero, scope chips, stat band (including the count-up animation still working), all 5 sections (context, approach, findings — including the 3 columns render correctly per item, outputs, why-us), contact block, bottom CTA and back link.
- `/` (home) — the case-study teaser section still shows all 3 cards with correct client names and intros, linking to the correct detail pages.

- [x] **Step 3: Verify a bad slug still 404s**

Visit `/en/case-studies/does-not-exist` (or `curl -o /dev/null -w '%{http_code}'`) and confirm it returns a 404, matching pre-migration behavior.

- [x] **Step 4: Verify TinaCMS admin can edit the new content**

Open the Tina admin, confirm "Case Studies" (list collection, 3 documents) and "Case Studies Chrome" (global) both load without schema errors, and that editing a field (e.g. one case study's `hero.headline`) and saving updates the corresponding JSON file.

- [x] **Step 5: Report results**

Summarize what was checked and any discrepancies found. If a discrepancy is found, stop and fix it as a follow-up step before considering this pass complete.
