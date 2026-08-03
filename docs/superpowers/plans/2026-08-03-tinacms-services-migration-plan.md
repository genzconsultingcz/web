# TinaCMS Content Migration (Pass 3: Services) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all six services pages (index `/services` + the five detail pages `trainee-program`, `onboarding-app`, `genz-workshop`, `career-pages`, `custom`) out of the next-intl `messages.services`/`messages.traineeProgram`/`messages.onboardingApp`/`messages.genzWorkshop`/`messages.careerPages`/`messages.customSolution` namespaces and into TinaCMS, so a content editor can edit all service copy without a developer touching code. Also moves the two remaining hardcoded texts outside the service pages — the 404 page's "Stránka nenalezena." (via the existing `Global` collection) and the hardcoded English CTA/step strings on `CustomPage` (the `customSolution` namespace already holds those, they just need wiring). This is Pass 3 of the multi-pass TinaCMS migration (Pass 1 = Header/Footer + Home, Pass 2 = Case Studies; architecture mirrors both).

**Architecture:** Add two new Tina collections mirroring the case-studies pattern from Pass 2:
- a **list collection** `service` (`content/services/*.json`, one doc per service, filename = slug) whose documents are shaped `{ num, featured, cs: {...}, en: {...} }` — locale-neutral fields (`num` shown on the index card and the detail hero's decorative big number, `featured` toggling the full-width index card layout for `custom`) at the document root, and locale content under `cs`/`en` covering the index card (`card`), the detail hero, a reusable `sections` list (the label/text rows: what/gain/for/differentiator), plus optional `timeline`, `image`, `variants`, `steps`, and `finalCta` blocks.
- a **singleton collection** `servicesChrome` (`content/services-chrome/index.json`) for index-page template copy (`hero`, `learnMore`, `notSure`) — the same role `caseStudiesChrome` plays for the case-study list page.
- The `Global` collection gains a per-locale `notFound { title, message }` block, and `app/[locale]/not-found.tsx` becomes a Tina-backed server component.
- All six service components stop calling `useTranslations()` and receive Tina-sourced props from their server-component `page.tsx` files (same pattern as Pass 1/Pass 2). The `/services` index derives its cards from the `service` connection ordered by an explicit slug list, resolving the pre-existing duplication noted in `ServicesPage.tsx:19` (index card data was copied from `content/home/index.json`'s `services.items`).

**Tech Stack:** Next.js (App Router), TinaCMS (`tinacms` CLI + generated GraphQL client), next-intl (routing only), Vitest + Testing Library.

## Global Constraints

- Every string visible on the services index and each detail page must render identically in `/cs` and `/en` after migration — this is a reshape of existing content, not a rewording. When unsure, copy the exact string from `messages/{cs,en}.json` (Task 2 content files are transcribed verbatim from those namespaces).
- Locale content lives as `{ cs: {...}, en: {...} }` inside one Tina document per service (not separate files per locale) — same pattern as Pass 1/Pass 2.
- Tina `image`-type fields must NOT be used for the workshop photo path — use `type: 'string'` for all image-path fields (Pass 1's final review found `type: 'image'` risks Tina Cloud rewriting relative `/public` paths). The workshop photo lives at `public/genzone_workshop.jpeg`.
- The final-CTA section on `TraineeProgramPage`/`OnboardingAppPage`/`CareerPagesPage` reuses the hero title/subtitle; `CustomPage` has its own `finalCta` title/desc. Model `finalCta` as an **optional** block per locale; components fall back to `hero.title`/`hero.subtitle` when it is absent.
- Do not touch `messages.about`, `messages.contact`, `messages.contactDialog`, `messages.leadMagnet`, or the `Global`/`Home`/`caseStudy`/`caseStudiesChrome` collections/contents (out of scope; only the two hardcoded strings named above get fixed).
- After each schema change to `tina/collection/*.ts`, regenerate the Tina client/types with `npm run build-local` before writing code that depends on the new generated types. (`build-local` = `tinacms build --local --skip-indexing --skip-cloud-checks && next build` — it regenerates `tina/__generated__` and builds the Next app.)
- Follow the established null-safety convention throughout: optional-chain into Tina data, then an early `if (!x) return null;` guard in components and `if (!x) notFound();` in pages — no bare `!` non-null assertions.
- `tsc --noEmit` must stay at 0 errors and `npm run lint` clean after every task. The only failing tests are the 4 pre-existing `LeadMagnetModal` failures — never "fix" them.
- One commit per task, English imperative subject lines matching the repo's style (e.g. "Wire HomePage's case-study teaser cards to Tina").

---

### Task 1: Create the `service` list collection and `servicesChrome` singleton schema; extend `Global` with `notFound`

**Files:**
- Create: `tina/collection/service.ts`
- Create: `tina/collection/services-chrome.ts`
- Modify: `tina/collection/global.ts`
- Modify: `tina/config.tsx`

**Interfaces:**
- Produces: `ServiceQuery['service']` shaped `{ num: string, featured: boolean, cs: ServiceLocaleContent, en: ServiceLocaleContent, _sys: {...} }` per document, where `ServiceLocaleContent` = `{ card: {title, desc}, hero: {eyebrow, title, subtitle, cta}, sections: {label, text}[], timeline?: {label, text}, image?: {src, alt}, variants?: {num, title, desc}[], steps?: {num, title, desc}[], finalCta?: {title, desc} }`.
- Produces: `ServiceConnectionQuery['serviceConnection']` (edges → node) for the index page card derivation.
- Produces: `ServicesChromeQuery['servicesChrome']` shaped `{ cs: { hero: {...}, learnMore, notSure: {title, desc, cta} }, en: {...} }`.
- Produces: `GlobalQuery['global']` gaining `notFound: { cs: {title, message}, en: {title, message} }`.

- [ ] **Step 1: Create `tina/collection/service.ts`**

```ts
// tina/collection/service.ts
import type { Collection } from 'tinacms';

const serviceLocaleFields = [
  {
    type: 'object',
    label: 'Index Card',
    name: 'card',
    fields: [
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Hero',
    name: 'hero',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title', ui: { component: 'textarea' } },
      { type: 'string', label: 'Subtitle', name: 'subtitle', ui: { component: 'textarea' } },
      { type: 'string', label: 'CTA', name: 'cta' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Sections',
    name: 'sections',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Label', name: 'label' },
      { type: 'string', label: 'Text', name: 'text', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Timeline (optional)',
    name: 'timeline',
    fields: [
      { type: 'string', label: 'Label', name: 'label' },
      { type: 'string', label: 'Text', name: 'text' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Image (optional)',
    name: 'image',
    fields: [
      { type: 'string', label: 'Source Path', name: 'src' },
      { type: 'string', label: 'Alt Text', name: 'alt' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Variants (optional)',
    name: 'variants',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.title }) },
    fields: [
      { type: 'string', label: 'Number', name: 'num' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Steps (optional)',
    name: 'steps',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.title }) },
    fields: [
      { type: 'string', label: 'Number', name: 'num' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Final CTA (optional; falls back to hero title/subtitle)',
    name: 'finalCta',
    fields: [
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
    ],
  } as const,
];

const Service: Collection = {
  label: 'Services',
  name: 'service',
  path: 'content/services',
  format: 'json',
  ui: {
    router: ({ document }) => `/services/${document._sys.filename}`,
  },
  fields: [
    { type: 'string', label: 'Number (index card + hero decoration)', name: 'num' },
    { type: 'boolean', label: 'Featured (full-width card on index)', name: 'featured' },
    { type: 'object', label: 'Czech', name: 'cs', fields: serviceLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: serviceLocaleFields as any },
  ],
};

export default Service;
```

- [ ] **Step 2: Create `tina/collection/services-chrome.ts`**

```ts
// tina/collection/services-chrome.ts
import type { Collection } from 'tinacms';

const chromeLocaleFields = [
  {
    type: 'object',
    label: 'Hero',
    name: 'hero',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Subtitle', name: 'subtitle', ui: { component: 'textarea' } },
      { type: 'string', label: 'CTA', name: 'cta' },
    ],
  } as const,
  { type: 'string', label: 'Learn More Label (index cards)', name: 'learnMore' } as const,
  {
    type: 'object',
    label: 'Not Sure CTA',
    name: 'notSure',
    fields: [
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
      { type: 'string', label: 'CTA', name: 'cta' },
    ],
  } as const,
];

const ServicesChrome: Collection = {
  label: 'Services Chrome',
  name: 'servicesChrome',
  path: 'content/services-chrome',
  format: 'json',
  ui: { global: true },
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: chromeLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: chromeLocaleFields as any },
  ],
};

export default ServicesChrome;
```

- [ ] **Step 3: Add `notFound` block to `tina/collection/global.ts`**

Insert a new field into the `Global` collection's `fields` array (after the `footer` object):

```ts
    {
      type: 'object',
      label: 'Not Found Page',
      name: 'notFound',
      fields: [
        {
          type: 'object',
          label: 'Czech',
          name: 'cs',
          fields: [
            { type: 'string', label: 'Title', name: 'title' },
            { type: 'string', label: 'Message', name: 'message' },
          ],
        },
        {
          type: 'object',
          label: 'English',
          name: 'en',
          fields: [
            { type: 'string', label: 'Title', name: 'title' },
            { type: 'string', label: 'Message', name: 'message' },
          ],
        },
      ],
    },
```

- [ ] **Step 4: Register the new collections in `tina/config.tsx`**

Add imports for `Service` and `ServicesChrome` (matching the existing `CaseStudy`/`CaseStudiesChrome` imports) and include them in the `collections` array.

- [ ] **Step 5: Regenerate the Tina client/types**

Run: `npm run build-local`
Expected: `tinacms build` completes, `next build` succeeds, `tina/__generated__/types.ts` now contains `ServiceQuery`, `ServiceConnectionQuery`, `ServicesChromeQuery`, and `GlobalQuery['global']` includes `notFound`.

- [ ] **Step 6: Commit**

```bash
git add tina/
git commit -m "Add service and services-chrome Tina schemas, notFound to Global"
```

---

### Task 2: Create the service + chrome content files (verbatim from messages)

**Files:**
- Create: `content/services/trainee-program.json`
- Create: `content/services/onboarding-app.json`
- Create: `content/services/genz-workshop.json`
- Create: `content/services/career-pages.json`
- Create: `content/services/custom.json`
- Create: `content/services-chrome/index.json`
- Modify: `content/global/index.json` (add `notFound`)

Transcribe all strings **verbatim** from `messages/cs.json` + `messages/en.json` (already dumped in this plan's source context — do not paraphrase; keep em-dashes, `\n` line breaks in titles like `Onboarding\naplikace`, and the `&` characters exactly as they appear). `num`/`featured` at the document root; `card` values come from the `services` namespace (`service1Title`/`service1Desc` etc. for the four product services); the `custom` service's `card` comes from `customSolution.title`/`customSolution.subtitle` (that is what the index's full-width custom card currently shows via `tCustom`).

Content mapping per service doc (locale branch keyed `cs`/`en`):

| Doc (slug) | num | featured | card | hero | sections | extra |
|---|---|---|---|---|---|---|
| trainee-program | 01 | false | services.service1* | traineeProgram.hero (eyebrow/title/subtitle/cta) | what/gain/for/differentiator | timeline {label, text} |
| onboarding-app | 02 | false | services.service2* | onboardingApp | what/gain/for/differentiator | none |
| genz-workshop | 03 | false | services.service3* | genzWorkshop | what/gain/for | image {src:"/genzone_workshop.jpeg", alt: heroImageAlt}, variants (3) |
| career-pages | 04 | false | services.service4* | careerPages | what/gain/for/differentiator | timeline {label, text} |
| custom | 05 | true | customSolution.title/subtitle | customSolution | what/for | steps (3), finalCta {title: ctaTitle, desc: ctaDesc} |

Hero objects: eyebrow/title/subtitle/cta. Section labels/texts: `whatLabel`/`whatText`, `gainLabel`/`gainText`, `forLabel`/`forText`, `differentiatorLabel`/`differentiatorText`.

`content/services-chrome/index.json`:

```json
{
  "cs": {
    "hero": { "eyebrow": "Naše služby", "title": "Jak pomáháme firmám pracovat s Gen Z", "subtitle": "Pět konkrétních způsobů, jak zlepšit nábor, onboarding a retenci mladých talentů.", "cta": "Domluvit schůzku" },
    "learnMore": "Zjistit více",
    "notSure": { "title": "Nevíte, kde začít?", "desc": "Každá firma je jiná. Pokud si nejste jistí co přesně potřebujete, začněme rozhovorem.", "cta": "Domluvit nezávaznou schůzku" }
  },
  "en": {
    "hero": { "eyebrow": "Our services", "title": "How we help companies work with Gen Z", "subtitle": "Five concrete ways to improve recruitment, onboarding and retention of young talent.", "cta": "Book a call" },
    "learnMore": "Learn more",
    "notSure": { "title": "Not sure where to start?", "desc": "Every company is different. If you're not sure what you need, let's start with a conversation.", "cta": "Book a no-obligation call" }
  }
}
```

Add to `content/global/index.json` (top level, sibling of `header`/`footer`):

```json
  "notFound": {
    "cs": { "title": "404", "message": "Stránka nenalezena." },
    "en": { "title": "404", "message": "Page not found." }
  }
```

- [ ] **Step 1: Write all five `content/services/*.json` files** (transcribe verbatim per the mapping table; verify against `messages/*.json` with a JSON diff after writing).
- [ ] **Step 2: Write `content/services-chrome/index.json`** (exact JSON above).
- [ ] **Step 3: Add `notFound` to `content/global/index.json`** (exact JSON above; keep valid JSON — watch trailing commas).
- [ ] **Step 4: Commit**

```bash
git add content/
git commit -m "Add Tina content for services, services chrome, and 404 copy"
```

---

### Task 3: Convert `ServicesPage` (index) to Tina props + wire `/services` route

**Files:**
- Modify: `components/pages/services/ServicesPage.tsx`
- Modify: `app/[locale]/services/page.tsx`
- Create: `tests/components/ServicesPage.test.tsx`

**Step 1: Write the failing test**

`tests/components/ServicesPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ServicesPage from '@/components/pages/services/ServicesPage'

const chrome = {
  hero: { eyebrow: 'Naše služby', title: 'Jak pomáháme firmám pracovat s Gen Z', subtitle: 'Pět konkrétních způsobů.', cta: 'Domluvit schůzku' },
  learnMore: 'Zjistit více',
  notSure: { title: 'Nevíte, kde začít?', desc: 'Každá firma je jiná.', cta: 'Domluvit nezávaznou schůzku' },
} as any

const cards = [
  { slug: 'trainee-program', num: '01', title: 'Trainee program', desc: 'Popis trainee programu.', featured: false },
  { slug: 'custom', num: '05', title: 'Individuální řešení', desc: 'Každá firma je jiná.', featured: true },
] as any

describe('ServicesPage', () => {
  it('renders chrome, cards and custom featured card from props', () => {
    render(<ServicesPage chrome={chrome} cards={cards} />)
    expect(screen.getByText('Jak pomáháme firmám pracovat s Gen Z')).toBeInTheDocument()
    expect(screen.getByText('Trainee program')).toBeInTheDocument()
    expect(screen.getByText('Popis trainee programu.')).toBeInTheDocument()
    expect(screen.getByText('Zjistit více').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Zjistit více').length).toBeGreaterThan(0)
    expect(screen.getByText('Nevíte, kde začít?')).toBeInTheDocument()
  })
})
```

Run: `npm run test:run -- tests/components/ServicesPage.test.tsx`
Expected: FAIL — component still reads `useTranslations` and takes no props.

**Step 2: Convert `ServicesPage.tsx`**

Replace the `SERVICES`/`CUSTOM` constants and `useTranslations`/`useLocale` usage with a props-driven component. Keep the exact JSX markup/layout/classNames/animations from the current file; only swap the data sources:

- Props: `{ chrome: ServicesPageChrome; cards: ServiceCard[] }` where
  ```ts
  export interface ServiceCard { slug: string; num: string; title: string; desc: string; featured: boolean }
  export type ServicesPageChrome = DeepOmitTypename<NonNullable<NonNullable<ServicesChromeQuery['servicesChrome']>['cs']>>;
  ```
  (copy the `DeepOmitTypename` helper and `import type { ServicesChromeQuery } from '../../../tina/__generated__/types';` from `components/pages/case-studies/CaseStudyDetail.tsx`).
- Guard: `if (!chrome) return null;`
- Hero: `chrome.hero?.eyebrow / .title / .subtitle`, CTA button label `chrome.hero?.cta ?? ''`.
- Split `cards` into `standard = cards.filter(c => !c.featured)` and `featured = cards.filter(c => c.featured)`. Render `standard` with the current compact card JSX (uses `c.num`, `c.title`, `c.desc`, link `/${locale}/services/${c.slug}`, `chrome.learnMore` instead of the hardcoded `Learn more`). Render `featured` with the current full-width custom-card JSX (`sm:col-span-2`). Both link labels use `chrome.learnMore`.
- Keep `useLocale()` from next-intl for building the link hrefs (routing only — vitest mocks it to `'cs'`).
- Remove the `SERVICES`/`CUSTOM` module constants and the `// reconcile` comment; remove `useTranslations` import and the `ArrowRight` import only if unused (it is still used by the links — keep it).

**Step 3: Wire `app/[locale]/services/page.tsx`**

```tsx
import React from 'react';
import Layout from '@/components/layout/layout';
import ServicesPage, { type ServiceCard, type ServicesPageChrome } from '@/components/pages/services/ServicesPage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

const SERVICE_SLUGS = ['trainee-program', 'onboarding-app', 'genz-workshop', 'career-pages', 'custom'];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [{ data: chromeData }, { data: connectionData }] = await Promise.all([
    client.queries.servicesChrome({ relativePath: 'index.json' }, { fetchOptions: { next: { revalidate: 300 } } }),
    client.queries.serviceConnection(undefined, { fetchOptions: { next: { revalidate: 300 } } }),
  ]);

  const chrome = locale === 'en' ? chromeData.servicesChrome?.en : chromeData.servicesChrome?.cs;

  const nodes = (connectionData.serviceConnection.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof edgeNode> => Boolean(node));
  const bySlug = new Map(nodes.map((node) => [node._sys.filename, node]));

  const cards: ServiceCard[] = SERVICE_SLUGS
    .map((slug) => {
      const node = bySlug.get(slug);
      if (!node) return null;
      const content = locale === 'en' ? node.en : node.cs;
      if (!content) return null;
      return {
        slug,
        num: node.num ?? '',
        title: content.card?.title ?? '',
        desc: content.card?.desc ?? '',
        featured: node.featured ?? false,
      };
    })
    .filter((card): card is ServiceCard => Boolean(card));

  return (
    <Layout>
      <ServicesPage chrome={chrome as ServicesPageChrome} cards={cards} />
    </Layout>
  );
}
```

(`edgeNode` above is a shorthand for the node union — type it precisely as the `serviceConnection.edges[number]['node']` non-null type; optional-chain every access, no bare `!`.)

**Step 4: Run the test**

Run: `npm run test:run -- tests/components/ServicesPage.test.tsx`
Expected: PASS.

**Step 5: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: 0 errors, clean.

**Step 6: Commit**

```bash
git add components/pages/services/ServicesPage.tsx app/\[locale\]/services/page.tsx tests/components/ServicesPage.test.tsx
git commit -m "Wire services index page to Tina"
```

---

### Task 4: Convert `TraineeProgramPage` to Tina props + wire route

**Files:**
- Modify: `components/pages/services/TraineeProgramPage.tsx`
- Modify: `app/[locale]/services/trainee-program/page.tsx`
- Create: `tests/components/TraineeProgramPage.test.tsx`

**Step 1: Write the failing test**

`tests/components/TraineeProgramPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TraineeProgramPage from '@/components/pages/services/TraineeProgramPage'

const content = {
  hero: { eyebrow: 'Služba 01', title: 'Trainee program', subtitle: 'Postavíme vám trainee program.', cta: 'Domluvit schůzku' },
  sections: [
    { label: 'Co to je', text: 'Kompletně postavený trainee program.' },
    { label: 'Pro koho', text: 'Firmy, které chtějí Gen Z přitáhnout.' },
  ],
  timeline: { label: 'Časový rámec', text: '1 až 6 měsíců.' },
} as any

describe('TraineeProgramPage', () => {
  it('renders hero, sections, timeline and CTA from props', () => {
    render(<TraineeProgramPage num="01" content={content} />)
    expect(screen.getByText('Trainee program')).toBeInTheDocument()
    expect(screen.getByText('Co to je')).toBeInTheDocument()
    expect(screen.getByText('Kompletně postavený trainee program.')).toBeInTheDocument()
    expect(screen.getByText('Časový rámec')).toBeInTheDocument()
    expect(screen.getByText('1 až 6 měsíců.')).toBeInTheDocument()
  })
})
```

Run: `npm run test:run -- tests/components/TraineeProgramPage.test.tsx`
Expected: FAIL.

**Step 2: Convert `TraineeProgramPage.tsx`**

- Props: `{ num: string; content: ServiceContent }` where
  ```ts
  export type ServiceContent = DeepOmitTypename<NonNullable<NonNullable<ServiceQuery['service']>['cs']>>;
  ```
  (`DeepOmitTypename` + `import type { ServiceQuery } from '../../../tina/__generated__/types';` copied from `CaseStudyDetail.tsx`.)
- Guard: `if (!content) return null;`
- Hero decorative big number `{num}` (was hardcoded `01`); hero eyebrow/title/subtitle/cta from `content.hero?.…`.
- Detail rows: `(content.sections ?? []).map((s, i) => <DetailRow key={i} label={s?.label ?? ''} text={s?.text ?? ''} index={i} />)`.
- Timeline section: `content.timeline?.label` / `content.timeline?.text`.
- Final CTA: title `content.finalCta?.title ?? content.hero?.title ?? ''`, desc `content.finalCta?.desc ?? content.hero?.subtitle ?? ''`, button label `content.hero?.cta ?? ''`.
- Remove `useTranslations`.

**Step 3: Wire `app/[locale]/services/trainee-program/page.tsx`**

Follow the `[slug]` case-study page's resilient fetch pattern (no `generateStaticParams` needed — these are static routes):

```tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/layout';
import TraineeProgramPage from '@/components/pages/services/TraineeProgramPage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const result = await client.queries.service({ relativePath: 'trainee-program.json' }).catch(() => ({ data: null, errors: [{ message: 'not found' }] }));
  if (result.errors?.length || !result.data?.service) notFound();

  const service = result.data.service;
  const content = locale === 'en' ? service.en : service.cs;
  if (!content) notFound();

  return (
    <Layout>
      <TraineeProgramPage num={service.num ?? ''} content={content} />
    </Layout>
  );
}
```

**Step 4: Run the test** — `npm run test:run -- tests/components/TraineeProgramPage.test.tsx` → PASS.

**Step 5: Typecheck + lint** — `npx tsc --noEmit && npm run lint` → clean.

**Step 6: Commit**

```bash
git add components/pages/services/TraineeProgramPage.tsx app/\[locale\]/services/trainee-program/page.tsx tests/components/TraineeProgramPage.test.tsx
git commit -m "Wire trainee-program service page to Tina"
```

---

### Task 5: Convert `OnboardingAppPage` to Tina props + wire route

**Files:**
- Modify: `components/pages/services/OnboardingAppPage.tsx`
- Modify: `app/[locale]/services/onboarding-app/page.tsx`
- Create: `tests/components/OnboardingAppPage.test.tsx`

Same shape as Task 4 but **no timeline** (the component has no timeline section) and hero title renders with `whitespace-pre-line` (keep that class). Content: hero + 4 sections (what/gain/for/differentiator) + final CTA falling back to hero title/subtitle.

**Step 1: Write the failing test**

`tests/components/OnboardingAppPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OnboardingAppPage from '@/components/pages/services/OnboardingAppPage'

const content = {
  hero: { eyebrow: 'Služba 02', title: 'Onboardingová\naplikace', subtitle: 'Onboarding, který nováčka provede začátkem.', cta: 'Domluvit schůzku' },
  sections: [
    { label: 'Co to je', text: 'Přehledný digitální průvodce onboardingem.' },
    { label: 'Co tím firma získá', text: 'Nováčci se zorientují rychleji.' },
  ],
} as any

describe('OnboardingAppPage', () => {
  it('renders hero, sections and CTA from props', () => {
    render(<OnboardingAppPage num="02" content={content} />)
    expect(screen.getByText('Onboardingová\naplikace')).toBeInTheDocument()
    expect(screen.getByText('Co to je')).toBeInTheDocument()
    expect(screen.getByText('Přehledný digitální průvodce onboardingem.')).toBeInTheDocument()
  })
})
```

Run → FAIL.

**Step 2: Convert `OnboardingAppPage.tsx`** — same pattern as Task 4 Step 2, minus timeline, plus final CTA title/desc fallback to hero, decorative `{num}`.

**Step 3: Wire `app/[locale]/services/onboarding-app/page.tsx`** — identical to Task 4 Step 3 with `relativePath: 'onboarding-app.json'` and importing `OnboardingAppPage`.

**Step 4–6:** Run test (PASS), `npx tsc --noEmit && npm run lint` (clean), commit:

```bash
git add components/pages/services/OnboardingAppPage.tsx app/\[locale\]/services/onboarding-app/page.tsx tests/components/OnboardingAppPage.test.tsx
git commit -m "Wire onboarding-app service page to Tina"
```

---

### Task 6: Convert `WorkshopPage` to Tina props + wire route

**Files:**
- Modify: `components/pages/services/WorkshopPage.tsx`
- Modify: `app/[locale]/services/genz-workshop/page.tsx`
- Create: `tests/components/WorkshopPage.test.tsx`

The workshop page has: hero, a full-width photo (`/genzone_workshop.jpeg`, alt from content), 3 sections (what/gain/for), and a dark variants section (variantsLabel/variantsTitle + 3 variant cards + a ContactButton with the hero CTA). No timeline, no separate final-CTA section.

**Step 1: Write the failing test**

`tests/components/WorkshopPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WorkshopPage from '@/components/pages/services/WorkshopPage'

const content = {
  hero: { eyebrow: 'Služba 03', title: 'Workshop o Gen Z', subtitle: 'Workshop, který váš HR tým naučí rozumět Gen Z.', cta: 'Domluvit schůzku' },
  image: { src: '/genzone_workshop.jpeg', alt: 'GenZ Consulting workshop na Career Expo' },
  sections: [
    { label: 'Co to je', text: 'Vzdělávací workshop pro HR týmy.' },
    { label: 'Pro koho', text: 'HR týmy ve středních a velkých firmách.' },
  ],
  variants: [
    { num: '01', title: 'Obecný workshop', desc: 'Pevný program, rychlý nástup.' },
  ],
} as any

describe('WorkshopPage', () => {
  it('renders hero, image, sections and variants from props', () => {
    render(<WorkshopPage num="03" content={content} />)
    expect(screen.getByText('Workshop o Gen Z')).toBeInTheDocument()
    expect(screen.getByText('Co to je')).toBeInTheDocument()
    expect(screen.getByText('Vzdělávací workshop pro HR týmy.')).toBeInTheDocument()
    expect(screen.getByText('Obecný workshop')).toBeInTheDocument()
    expect(screen.getByAltText('GenZ Consulting workshop na Career Expo')).toBeInTheDocument()
  })
})
```

Run → FAIL.

**Step 2: Convert `WorkshopPage.tsx`**

- Props: `{ num: string; content: ServiceContent }`, guard `if (!content) return null;`.
- Hero: eyebrow/title/subtitle/cta from `content.hero?.…`, decorative `{num}`.
- Photo: `<Image src={content.image?.src ?? ''} alt={content.image?.alt ?? ''} fill className="object-cover opacity-70" sizes="100vw" />` (keep wrapper markup).
- Sections: `(content.sections ?? []).map(...)`.
- Variants: `(content.variants ?? []).map((v, i) => ...)` using `v.num`/`v.title`/`v.desc`.
- Variants label/title: these come from `genzWorkshop.variantsLabel`/`variantsTitle` — **these are chrome, not per-service content.** Simplest correct home: add them to the doc's locale content as part of the variants block is NOT clean (they're shared labels). Instead, since the variants section only exists on this page, add two fields to `genzWorkshop` doc content: put `variantsLabel`/`variantsTitle` inside the `variants` object as a wrapper? — No. Keep the schema simple: the test/plan expects these strings. Decision: store them as two top-level locale fields on the service doc by adding `variantsLabel` and `variantsTitle` to the `serviceLocaleFields` array in `tina/collection/service.ts` (they only populate on the genz-workshop doc).

  **Add to `tina/collection/service.ts` locale fields** (edit the schema file, then re-run `npm run build-local` before this task's Step 4 test run):

  ```ts
  { type: 'string', label: 'Variants Eyebrow (workshop only)', name: 'variantsLabel' } as const,
  { type: 'string', label: 'Variants Title (workshop only)', name: 'variantsTitle' } as const,
  ```

  Render `content.variantsLabel` / `content.variantsTitle` in the variants section header.
- Final button: `label={content.hero?.cta ?? ''}`.
- Remove `useTranslations`; keep `Image` import.

**Step 3: Wire `app/[locale]/services/genz-workshop/page.tsx`** — Task 4 Step 3 pattern with `relativePath: 'genz-workshop.json'` and `WorkshopPage`.

**Step 4:** Run `npm run build-local` FIRST (schema changed), then the test → PASS.

**Step 5:** `npx tsc --noEmit && npm run lint` → clean.

**Step 6: Commit**

```bash
git add tina/collection/service.ts components/pages/services/WorkshopPage.tsx app/\[locale\]/services/genz-workshop/page.tsx tests/components/WorkshopPage.test.tsx
git commit -m "Wire genz-workshop service page to Tina"
```

---

### Task 7: Convert `CareerPagesPage` to Tina props + wire route

**Files:**
- Modify: `components/pages/services/CareerPagesPage.tsx`
- Modify: `app/[locale]/services/career-pages/page.tsx`
- Create: `tests/components/CareerPagesPage.test.tsx`

Identical structure to TraineeProgramPage (hero + 4 sections + timeline + final CTA fallback) with hero title `whitespace-pre-line`.

**Step 1: Write the failing test**

`tests/components/CareerPagesPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CareerPagesPage from '@/components/pages/services/CareerPagesPage'

const content = {
  hero: { eyebrow: 'Služba 04', title: 'Kariérní stránky\npro Gen Z', subtitle: 'Zjistěte přesně, proč Gen Z nepřijde.', cta: 'Domluvit schůzku' },
  sections: [
    { label: 'Co to je', text: 'Odborná analýza kariérní stránky.' },
    { label: 'Co děláme jinak', text: 'Hodnotíme z perspektivy Gen Z.' },
  ],
  timeline: { label: 'Časový rámec', text: '2 až 6 týdnů.' },
} as any

describe('CareerPagesPage', () => {
  it('renders hero, sections, timeline and CTA from props', () => {
    render(<CareerPagesPage num="04" content={content} />)
    expect(screen.getByText('Kariérní stránky\npro Gen Z')).toBeInTheDocument()
    expect(screen.getByText('Co to je')).toBeInTheDocument()
    expect(screen.getByText('Odborná analýza kariérní stránky.')).toBeInTheDocument()
    expect(screen.getByText('Časový rámec')).toBeInTheDocument()
  })
})
```

Run → FAIL.

**Step 2: Convert `CareerPagesPage.tsx`** — Task 4 pattern with timeline, decorative `{num}`.

**Step 3: Wire `app/[locale]/services/career-pages/page.tsx`** — Task 4 pattern with `relativePath: 'career-pages.json'` and `CareerPagesPage`.

**Step 4–6:** Run test (PASS), typecheck/lint (clean), commit:

```bash
git add components/pages/services/CareerPagesPage.tsx app/\[locale\]/services/career-pages/page.tsx tests/components/CareerPagesPage.test.tsx
git commit -m "Wire career-pages service page to Tina"
```

---

### Task 8: Convert `CustomPage` to Tina props + wire route

**Files:**
- Modify: `components/pages/services/CustomPage.tsx`
- Modify: `app/[locale]/services/custom/page.tsx`
- Create: `tests/components/CustomPage.test.tsx`

CustomPage is the one with **hardcoded strings**: the process-teaser section currently hardcodes Czech step titles/descs (`CustomPage.tsx:123-126`) and the final CTA section hardcodes English text (`CustomPage.tsx:157-166`). These strings already exist as `customSolution.step1Title/step1Desc/.../step3Desc` and `customSolution.ctaTitle/ctaDesc` — wiring them to props fixes the hardcoding. The component has hero + 2 sections (what/for) + steps + final CTA (its own title/desc).

**Step 1: Write the failing test**

`tests/components/CustomPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CustomPage from '@/components/pages/services/CustomPage'

const content = {
  hero: { eyebrow: 'Individuální řešení', title: 'Nevíte, kde začít?', subtitle: 'Každá firma je jiná.', cta: 'Domluvit nezávaznou schůzku' },
  sections: [
    { label: 'Co to je', text: 'Společně diagnostikujeme.' },
    { label: 'Pro koho', text: 'Pro firmy, které vědí, že mají problém.' },
  ],
  steps: [
    { num: '01', title: 'Zjistíme, co je špatně', desc: 'Krátký, bez závazků call.' },
  ],
  finalCta: { title: 'Pojďme začít rozhovorem.', desc: 'Bez závazků.' },
} as any

describe('CustomPage', () => {
  it('renders hero, steps and final CTA from props', () => {
    render(<CustomPage num="05" content={content} />)
    expect(screen.getByText('Nevíte, kde začít?')).toBeInTheDocument()
    expect(screen.getByText('Zjistíme, co je špatně')).toBeInTheDocument()
    expect(screen.getByText('Krátký, bez závazků call.')).toBeInTheDocument()
    expect(screen.getByText('Pojďme začít rozhovorem.')).toBeInTheDocument()
  })
})
```

Run → FAIL.

**Step 2: Convert `CustomPage.tsx`**

- Props: `{ num: string; content: ServiceContent }`, guard `if (!content) return null;`.
- Hero: eyebrow/title/subtitle/cta from `content.hero?.…`, decorative `{num}`.
- What/for sections: `(content.sections ?? []).map(...)` (keep the two bordered-row layout — index 0 bordered, index 1 not; preserve `border-b` logic by row index).
- Steps section: `(content.steps ?? []).map((s, i) => ...)` using `s.num`/`s.title`/`s.desc` — **this removes the hardcoded Czech strings.**
- Final CTA section: title `content.finalCta?.title ?? ''`, desc `content.finalCta?.desc ?? ''`, button `content.hero?.cta ?? ''` — **this removes the hardcoded English strings.**
- Remove `useTranslations`.

**Step 3: Wire `app/[locale]/services/custom/page.tsx`** — Task 4 pattern with `relativePath: 'custom.json'` and `CustomPage`.

**Step 4–6:** Run test (PASS), typecheck/lint (clean), commit:

```bash
git add components/pages/services/CustomPage.tsx app/\[locale\]/services/custom/page.tsx tests/components/CustomPage.test.tsx
git commit -m "Wire custom service page to Tina, remove hardcoded copy"
```

---

### Task 9: Back the 404 page with `Global.notFound`

**Files:**
- Modify: `app/[locale]/not-found.tsx`

The 404 page currently hardcodes Czech text with no English branch. Make it a Tina-backed server component reading the locale-aware message from the `Global` collection.

**Step 1: Rewrite `app/[locale]/not-found.tsx`**

```tsx
import React from 'react';
import { notFound as nextNotFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import { getLocale } from 'next-intl/server';

export const revalidate = 300;

export default async function NotFound() {
  const locale = await getLocale();

  const result = await client.queries.global({ relativePath: 'index.json' }).catch(() => ({ data: null, errors: [{ message: 'not found' }] }));

  if (result.errors?.length || !result.data?.global) nextNotFound();

  const nf = locale === 'en' ? result.data.global.notFound?.en : result.data.global.notFound?.cs;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{nf?.title ?? '404'}</h1>
      <p className="mt-4 text-muted-foreground">{nf?.message ?? 'Stránka nenalezena.'}</p>
    </div>
  );
}
```

(Use `getLocale` from `next-intl/server`, which resolves the active locale inside the `[locale]` layout's request scope. Optional-chain `notFound`; keep the string fallbacks as a resilience net.)

**Step 2: Verify**

Run: `npm run dev` and visit a non-existent route under `/cs/` and `/en/` (e.g. `/cs/neexistuje`) → the page shows `404` + the localized message. Stop the dev server. Also run `npm run dev:build` to confirm `next build` succeeds with the async server component.

**Step 3: Typecheck + lint** — `npx tsc --noEmit && npm run lint` → clean.

**Step 4: Commit**

```bash
git add app/\[locale\]/not-found.tsx
git commit -m "Back 404 page with Global notFound copy"
```

---

### Task 10: Remove the six services namespaces from messages

**Files:**
- Modify: `messages/cs.json`
- Modify: `messages/en.json`

Remove the top-level keys `services`, `traineeProgram`, `onboardingApp`, `genzWorkshop`, `careerPages`, `customSolution` from both files. Keep `leadMagnet`, `about`, `contact`, `contactDialog`.

**Step 1: Edit both files**

Use a JSON-aware edit (e.g. `python3 -c "import json; ..."` with `del d[k]` then `json.dump(..., ensure_ascii=False, indent=2)`), or edit each file removing the six keys and their trailing commas. Verify with `python3 -c "import json; json.load(open('messages/cs.json')); json.load(open('messages/en.json')); print('ok')"`.

**Step 2: Verify no remaining references**

Run: `rg -n "traineeProgram|onboardingApp|genzWorkshop|careerPages|customSolution|useTranslations\('services'" components/ app/ --glob "!components/pages/services/*.tsx"`
Expected: no matches.

**Step 3: Full test suite + typecheck + lint**

Run: `npm run test:run` → 11 passed / 4 failed (the known `LeadMagnetModal` failures only).
Run: `npx tsc --noEmit && npm run lint` → clean.

**Step 4: Commit**

```bash
git add messages/
git commit -m "Remove migrated service namespaces from messages"
```

---

### Task 11: Full verification (build + dev smoke test + hardcoded-text re-audit)

**Files:**
- Modify: none (verification only; fix anything that fails)

**Step 1: Production build**

Run: `npm run build-local`
Expected: build succeeds; all static pages (including all five service detail pages and the services index) are rendered.

**Step 2: Dev smoke test**

Run: `npm run dev`, then verify against both locales (routes are `/{locale}/services` and `/{locale}/services/{slug}`, matching the header/footer nav links and the `app/[locale]/services/*` folders):
- `/cs/services` and `/en/services` render hero, 4 product cards + full-width custom card, and the "not sure" CTA with correct localized labels (`Zjistit více` / `Learn more`).
- Each of the five detail routes (`/cs/services/trainee-program`, `/cs/services/onboarding-app`, `/cs/services/genz-workshop`, `/cs/services/career-pages`, `/cs/services/custom`, and their `/en/…` equivalents) renders hero (incl. decorative big number), section rows, and timeline/variants/steps as applicable, with the CTA button.
- The custom page shows the three steps and the final CTA (no hardcoded English).
- A bad slug 404s; `/cs/neexistuje` shows the localized 404 copy.
- Stop the dev server when done.

**Step 3: Hardcoded-text re-audit**

Re-run the audit commands from the previous session to confirm no user-facing hardcoded text remains in the services area:
- `rg -n ">[[:space:]]*[A-Za-zÁ-žÉéÍíÓóÚú][^<{]*<" components/ app/ -g "*.tsx"` → only `app/[locale]/not-found.tsx` should now resolve via Tina (fallback strings are fine); `components/ui/breakpoint-indicator.tsx` (dev tool) remains.
- Confirm `components/pages/services/*.tsx` contain no `useTranslations` and no literal visible strings (only classNames/animation props/`num`).

**Step 4: Final suite**

Run: `npm run test:run` (11 pass / 4 known fails), `npx tsc --noEmit` (0 errors), `npm run lint` (clean).

**Step 5: Commit**

```bash
git add -A
git commit -m "Verify services migration end-to-end"
```

(If nothing changed, this step is skipped.)
