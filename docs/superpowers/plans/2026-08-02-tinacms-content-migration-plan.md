# TinaCMS Content Migration (Pass 1: Global + Home) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move header/footer nav copy and all Home-page copy out of `messages/*.json` and hardcoded JSX into TinaCMS-managed content, so a content editor can change every string through Tina without a developer touching code.

**Architecture:** Extend the existing `Global` Tina collection (`content/global/index.json`) so every header/footer label has a `cs`/`en` pair, and add a new singleton `Home` collection (`content/home/index.json`) with the same `cs`/`en` pattern, converting today's flat, numbered translation keys (`service1Title`, `testimonial1Quote`, …) into real repeatable Tina list fields. `Layout.tsx` and `app/[locale]/page.tsx` (both server components) fetch the Tina documents and pass the resolved data down as props; `Header`, `Footer`, and `HomePage` (all `'use client'`) stop calling `useTranslations()` for this content and read the props/context instead. Routing (`useLocale()`, locale-prefixed links) is untouched — that stays on next-intl.

**Tech Stack:** Next.js (App Router), TinaCMS (`tinacms` CLI + generated GraphQL client), next-intl (routing only, post-migration), Vitest + Testing Library.

## Global Constraints

- Every string visible on Header, Footer, and Home must render identically in `/cs` and `/en` after migration — this is a reshape of existing content, not a rewording. Verify by comparing rendered pages before/after.
- Locale content lives as `{ cs: {...}, en: {...} }` inside one Tina document (not separate files per locale) — this was the explicitly approved schema pattern.
- Fields that repeat a fixed number of times in the old flat-key scheme (services, process steps, testimonials, team members, stats, problem/solution bullet items) become Tina `list` fields, not numbered singular fields.
- `logos` (client/partner logos) and each team member's `photo`/`linkedin` are NOT locale-split — they live as shared fields since the values don't differ by language.
- The `leadMagnet` message namespace and `components/ui/LeadMagnetModal.tsx` are dead code (not imported/rendered anywhere) — out of scope, leave untouched.
- Do not touch `messages.about`, `messages.services`, `messages.traineeProgram`, `messages.onboardingApp`, `messages.genzWorkshop`, `messages.careerPages`, `messages.customSolution`, `messages.caseStudies`, `messages.contactDialog`, `messages.contact`, `messages.caseStudyDetail` — those pages are out of scope for this pass.
- After each schema change to `tina/collection/*.ts`, regenerate the Tina client/types with `npm run build-local` before writing code that depends on the new generated types.

---

### Task 1: Extend the `Global` Tina schema (header nav + footer copy, cs/en)

**Files:**
- Modify: `tina/collection/global.ts`
- Modify: `content/global/index.json`

**Interfaces:**
- Produces: `GlobalQuery['global']['header']['nav']` shaped as `{ cs: NavContent, en: NavContent }` where `NavContent = { homeLabel, aboutLabel, caseStudiesLabel, contactLabel, servicesLabel, viewServicesLabel, bookCallLabel, homeLogoAria, menuOpenAria, menuCloseAria, serviceLinks: { slug, label }[] }`.
- Produces: `GlobalQuery['global']['footer']['copy']` shaped as `{ cs: FooterCopy, en: FooterCopy }` where `FooterCopy = { tagline, rights, navLabel, contactLabel, followLabel, web, socialDomain, navServices, navAbout, navCaseStudies, navContact, navGuide, homeLogoAria }`.
- `footer.phone`, `footer.email`, `footer.social` are unchanged (shared, not locale-split).

- [ ] **Step 1: Replace the schema file**

Replace the full contents of `tina/collection/global.ts` with:

```ts
// tina/collection/global.ts
import type { Collection } from 'tinacms';
import { iconSchema } from '../fields/icon';

const navContentFields = [
  { type: 'string', label: 'Home Label', name: 'homeLabel' } as const,
  { type: 'string', label: 'About Label', name: 'aboutLabel' } as const,
  { type: 'string', label: 'Case Studies Label', name: 'caseStudiesLabel' } as const,
  { type: 'string', label: 'Contact Label', name: 'contactLabel' } as const,
  { type: 'string', label: 'Services Label', name: 'servicesLabel' } as const,
  { type: 'string', label: 'View All Services Label', name: 'viewServicesLabel' } as const,
  { type: 'string', label: 'Book Call Label', name: 'bookCallLabel' } as const,
  { type: 'string', label: 'Home Logo Aria Label', name: 'homeLogoAria' } as const,
  { type: 'string', label: 'Menu Open Aria Label', name: 'menuOpenAria' } as const,
  { type: 'string', label: 'Menu Close Aria Label', name: 'menuCloseAria' } as const,
  {
    type: 'object',
    label: 'Service Links',
    name: 'serviceLinks',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Slug', name: 'slug' },
      { type: 'string', label: 'Label', name: 'label' },
    ],
  } as const,
];

const footerCopyFields = [
  { type: 'string', label: 'Tagline', name: 'tagline' } as const,
  { type: 'string', label: 'Rights', name: 'rights' } as const,
  { type: 'string', label: 'Nav Label', name: 'navLabel' } as const,
  { type: 'string', label: 'Contact Label', name: 'contactLabel' } as const,
  { type: 'string', label: 'Follow Label', name: 'followLabel' } as const,
  { type: 'string', label: 'Website', name: 'web' } as const,
  { type: 'string', label: 'Social Domain', name: 'socialDomain' } as const,
  { type: 'string', label: 'Nav: Services', name: 'navServices' } as const,
  { type: 'string', label: 'Nav: About', name: 'navAbout' } as const,
  { type: 'string', label: 'Nav: Case Studies', name: 'navCaseStudies' } as const,
  { type: 'string', label: 'Nav: Contact', name: 'navContact' } as const,
  { type: 'string', label: 'Nav: Guide', name: 'navGuide' } as const,
  { type: 'string', label: 'Home Logo Aria Label', name: 'homeLogoAria' } as const,
];

const Global: Collection = {
  label: 'Global',
  name: 'global',
  path: 'content/global',
  format: 'json',
  ui: { global: true },
  fields: [
    {
      type: 'object',
      label: 'Header',
      name: 'header',
      fields: [
        { type: 'string', label: 'Site Name', name: 'name' },
        {
          type: 'object',
          label: 'Nav',
          name: 'nav',
          fields: [
            { type: 'object', label: 'Czech', name: 'cs', fields: navContentFields as any },
            { type: 'object', label: 'English', name: 'en', fields: navContentFields as any },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Footer',
      name: 'footer',
      fields: [
        { type: 'string', label: 'Phone', name: 'phone' },
        { type: 'string', label: 'Email', name: 'email' },
        {
          type: 'object',
          label: 'Social Links',
          name: 'social',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.icon?.name || 'Link' }) },
          fields: [iconSchema as any, { type: 'string', label: 'URL', name: 'url' }],
        },
        {
          type: 'object',
          label: 'Copy',
          name: 'copy',
          fields: [
            { type: 'object', label: 'Czech', name: 'cs', fields: footerCopyFields as any },
            { type: 'object', label: 'English', name: 'en', fields: footerCopyFields as any },
          ],
        },
      ],
    },
  ],
};

export default Global;
```

- [ ] **Step 2: Replace `content/global/index.json`**

```json
{
  "header": {
    "name": "GenZ Consulting",
    "nav": {
      "cs": {
        "homeLabel": "Domů",
        "aboutLabel": "O nás",
        "caseStudiesLabel": "Case studies",
        "contactLabel": "Kontakt",
        "servicesLabel": "Služby",
        "viewServicesLabel": "Všechny služby →",
        "bookCallLabel": "Domluvit schůzku",
        "homeLogoAria": "GenZ Consulting — domů",
        "menuOpenAria": "Otevřít menu",
        "menuCloseAria": "Zavřít menu",
        "serviceLinks": [
          { "slug": "trainee-program", "label": "Trainee program" },
          { "slug": "onboarding-app", "label": "Onboardingová aplikace" },
          { "slug": "genz-workshop", "label": "Workshop o Gen Z" },
          { "slug": "career-pages", "label": "Kariérní stránky" },
          { "slug": "custom", "label": "Individuální řešení" }
        ]
      },
      "en": {
        "homeLabel": "Home",
        "aboutLabel": "About",
        "caseStudiesLabel": "Case studies",
        "contactLabel": "Contact",
        "servicesLabel": "Services",
        "viewServicesLabel": "All services →",
        "bookCallLabel": "Book a call",
        "homeLogoAria": "GenZ Consulting — home",
        "menuOpenAria": "Open menu",
        "menuCloseAria": "Close menu",
        "serviceLinks": [
          { "slug": "trainee-program", "label": "Trainee program" },
          { "slug": "onboarding-app", "label": "Onboarding app" },
          { "slug": "genz-workshop", "label": "Gen Z Workshop" },
          { "slug": "career-pages", "label": "Career pages" },
          { "slug": "custom", "label": "Custom solution" }
        ]
      }
    }
  },
  "footer": {
    "phone": "+420 606 028 051",
    "email": "adam.dalecky@genzconsulting.cz",
    "social": [
      {
        "icon": { "name": "FaLinkedin" },
        "url": "https://cz.linkedin.com/company/gen-zconsulting"
      },
      {
        "icon": { "name": "FaLinkedin" },
        "url": "https://www.linkedin.com/in/adam-dalecky/"
      },
      {
        "icon": { "name": "FaLinkedin" },
        "url": "https://www.linkedin.com/in/jonatan-petr/"
      }
    ],
    "copy": {
      "cs": {
        "tagline": "Systémy pro mladé by měli stavět mladí.",
        "rights": "Všechna práva vyhrazena.",
        "navLabel": "Navigace",
        "contactLabel": "Kontakt",
        "followLabel": "Sledujte nás",
        "web": "www.genzconsulting.cz",
        "socialDomain": "linkedin.com/company/gen-zconsulting",
        "navServices": "Služby",
        "navAbout": "O nás",
        "navCaseStudies": "Case studies",
        "navContact": "Kontakt",
        "navGuide": "Průvodce",
        "homeLogoAria": "GenZ Consulting — domů"
      },
      "en": {
        "tagline": "Systems for young people should be built by young people.",
        "rights": "All rights reserved.",
        "navLabel": "Navigation",
        "contactLabel": "Contact",
        "followLabel": "Follow us",
        "web": "www.genzconsulting.cz",
        "socialDomain": "linkedin.com/company/gen-zconsulting",
        "navServices": "Services",
        "navAbout": "About",
        "navCaseStudies": "Case studies",
        "navContact": "Contact",
        "navGuide": "Guide",
        "homeLogoAria": "GenZ Consulting — home"
      }
    }
  }
}
```

Note: the pre-existing `label` field on each `footer.social` item (`"GenZ Consulting LinkedIn"` etc.) is dropped — grep confirms `footer.tsx` never reads `link.label`, it derives the display name from the URL via `socialLinkName()`, so this was already-unused data. If your grep turns up a reader of `.label` you missed, keep the field instead of deleting it.

- [ ] **Step 3: Regenerate the Tina client/types**

Run: `npm run build-local`
Expected: Completes without schema errors; `tina/__generated__/types.ts` now contains `nav`/`copy` fields with `cs`/`en` sub-objects on the `Global` type, and `tina/__generated__/client.ts` is regenerated (its content may not change, but confirm the build succeeded).

- [ ] **Step 4: Commit**

```bash
git add tina/collection/global.ts content/global/index.json tina/__generated__
git commit -m "$(cat <<'EOF'
Restructure Global Tina schema with cs/en nav and footer copy

Replaces the unused header.nav list field and prepares header/footer
labels to be edited through TinaCMS instead of next-intl messages.
EOF
)"
```

---

### Task 2: Migrate `Footer` to read copy from Tina (TDD)

**Files:**
- Modify: `components/layout/nav/footer.tsx`
- Test: `tests/components/Footer.test.tsx` (create)

**Interfaces:**
- Consumes: `useLayout()` from `components/layout/layout-context.tsx` (already exists, unchanged) — `globalSettings.footer.copy.cs` / `.en`, `globalSettings.footer.phone`, `.email`, `.social`.
- Produces: `Footer` component with no `useTranslations` dependency.

- [ ] **Step 1: Write the failing test**

Create `tests/components/Footer.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/nav/footer'
import { LayoutProvider } from '@/components/layout/layout-context'

const globalSettings = {
  header: { name: 'GenZ Consulting' },
  footer: {
    phone: '+420 606 028 051',
    email: 'adam.dalecky@genzconsulting.cz',
    social: [],
    copy: {
      cs: {
        tagline: 'Systémy pro mladé by měli stavět mladí.',
        rights: 'Všechna práva vyhrazena.',
        navLabel: 'Navigace',
        contactLabel: 'Kontakt',
        followLabel: 'Sledujte nás',
        web: 'www.genzconsulting.cz',
        socialDomain: 'linkedin.com/company/gen-zconsulting',
        navServices: 'Služby',
        navAbout: 'O nás',
        navCaseStudies: 'Case studies',
        navContact: 'Kontakt',
        navGuide: 'Průvodce',
        homeLogoAria: 'GenZ Consulting — domů',
      },
      en: {
        tagline: 'Systems for young people should be built by young people.',
        rights: 'All rights reserved.',
        navLabel: 'Navigation',
        contactLabel: 'Contact',
        followLabel: 'Follow us',
        web: 'www.genzconsulting.cz',
        socialDomain: 'linkedin.com/company/gen-zconsulting',
        navServices: 'Services',
        navAbout: 'About',
        navCaseStudies: 'Case studies',
        navContact: 'Contact',
        navGuide: 'Guide',
        homeLogoAria: 'GenZ Consulting — home',
      },
    },
  },
} as any

describe('Footer', () => {
  it('renders footer copy from Tina global settings for the current locale', () => {
    render(
      <LayoutProvider globalSettings={globalSettings} pageData={{}}>
        <Footer />
      </LayoutProvider>
    )
    // vitest.setup.ts mocks next-intl's useLocale() to always return 'cs'
    expect(screen.getByText('Systémy pro mladé by měli stavět mladí.')).toBeInTheDocument()
    expect(screen.getByText('Služby')).toBeInTheDocument()
    expect(screen.getByText('Všechna práva vyhrazena.', { exact: false })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/components/Footer.test.tsx`
Expected: FAIL — `Footer` currently renders via `useTranslations('footer')`, which the global mock in `vitest.setup.ts` turns into the literal key names (e.g. `"tagline"`), not `"Systémy pro mladé by měli stavět mladí."`.

- [ ] **Step 3: Replace `components/layout/nav/footer.tsx`**

```tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Phone, Mail, Linkedin } from 'lucide-react';
import { useLayout } from '../layout-context';

// Derive a readable display name from a LinkedIn URL (the Tina query doesn't expose a label).
const SOCIAL_NAME_OVERRIDES: Record<string, string> = {
  'gen-zconsulting': 'GenZ Consulting',
  'adam-dalecky': 'Adam Dalecký',
  'jonatan-petr': 'Jonatan Petr',
};

function socialLinkName(url: string): string {
  const slug = url.match(/\/(?:company|in)\/([^/?#]+)/i)?.[1]?.toLowerCase();
  if (!slug) return 'LinkedIn';
  if (SOCIAL_NAME_OVERRIDES[slug]) return SOCIAL_NAME_OVERRIDES[slug];
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { header, footer } = globalSettings!;
  const locale = useLocale();
  const copy = locale === 'en' ? footer?.copy?.en : footer?.copy?.cs;

  if (!copy) return null;

  const navLinks = [
    { href: `/${locale}/services`, label: copy.navServices },
    { href: `/${locale}/about`, label: copy.navAbout },
    { href: `/${locale}/case-studies`, label: copy.navCaseStudies },
    { href: `/${locale}/contact`, label: copy.navContact },
    { href: `/${locale}#pdf-guide`, label: copy.navGuide },
  ];

  return (
    <footer className="bg-gtc-deep text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3 justify-items-center text-center">
          {/* Brand */}
          <div className="max-w-[260px]">
            <Link href={`/${locale}`} aria-label={copy.homeLogoAria}>
              <Image
                src="/logo_dark_bg_v3.png"
                alt="GenZ Consulting"
                width={140}
                height={48}
                className="h-16 w-auto mx-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              {copy.tagline}
            </p>
            <p className="mt-2 text-xs text-white/30">{copy.web}</p>
          </div>

          {/* Nav */}
          <div className="max-w-[220px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gtc-primary">
              {copy.navLabel}
            </p>
            <ul className="space-y-2 text-center">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="max-w-[260px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gtc-primary">
              {copy.contactLabel}
            </p>
            <div className="space-y-3">
              {footer?.email && (
                <a
                  href={`mailto:${footer.email}`}
                  className="flex items-center justify-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150"
                >
                  <Mail className="size-4 shrink-0" />
                  {footer.email}
                </a>
              )}
              {footer?.phone && (
                <a
                  href={`tel:${footer.phone}`}
                  className="flex items-center justify-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150"
                >
                  <Phone className="size-4 shrink-0" />
                  {footer.phone}
                </a>
              )}
              <div className="flex flex-col items-center gap-2 pt-1">
                {footer?.social?.map((link, i) => {
                  const url = link!.url ?? '';
                  const name = socialLinkName(url);
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${name} LinkedIn`}
                      className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-gtc-primary transition-colors duration-150"
                    >
                      <Linkedin className="size-4 shrink-0" />
                      {name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-2 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {header?.name}. {copy.rights}
          </p>
          <p className="text-xs text-white/20">{copy.socialDomain}</p>
        </div>
      </div>
    </footer>
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/components/Footer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/nav/footer.tsx tests/components/Footer.test.tsx
git commit -m "$(cat <<'EOF'
Wire Footer to Tina global footer.copy instead of next-intl

Footer labels are now editable in TinaCMS; useTranslations('footer')
is no longer needed here.
EOF
)"
```

---

### Task 3: Migrate `Header` to read nav from Tina (TDD)

**Files:**
- Modify: `components/layout/nav/header.tsx`
- Test: `tests/components/Header.test.tsx` (create)

**Interfaces:**
- Consumes: `useLayout()` — `globalSettings.header.nav.cs` / `.en` (shape from Task 1).
- Produces: `Header` component with no `useTranslations` dependency; the local `SERVICES` constant is removed in favor of `nav.serviceLinks`.

- [ ] **Step 1: Write the failing test**

Create `tests/components/Header.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/nav/header'
import { LayoutProvider } from '@/components/layout/layout-context'

const globalSettings = {
  header: {
    name: 'GenZ Consulting',
    nav: {
      cs: {
        homeLabel: 'Domů',
        aboutLabel: 'O nás',
        caseStudiesLabel: 'Case studies',
        contactLabel: 'Kontakt',
        servicesLabel: 'Služby',
        viewServicesLabel: 'Všechny služby →',
        bookCallLabel: 'Domluvit schůzku',
        homeLogoAria: 'GenZ Consulting — domů',
        menuOpenAria: 'Otevřít menu',
        menuCloseAria: 'Zavřít menu',
        serviceLinks: [{ slug: 'trainee-program', label: 'Trainee program' }],
      },
      en: {
        homeLabel: 'Home',
        aboutLabel: 'About',
        caseStudiesLabel: 'Case studies',
        contactLabel: 'Contact',
        servicesLabel: 'Services',
        viewServicesLabel: 'All services →',
        bookCallLabel: 'Book a call',
        homeLogoAria: 'GenZ Consulting — home',
        menuOpenAria: 'Open menu',
        menuCloseAria: 'Close menu',
        serviceLinks: [{ slug: 'trainee-program', label: 'Trainee program' }],
      },
    },
  },
  footer: { phone: '', email: '', social: [] },
} as any

describe('Header', () => {
  it('renders nav labels from Tina global settings for the current locale', () => {
    render(
      <LayoutProvider globalSettings={globalSettings} pageData={{}}>
        <Header />
      </LayoutProvider>
    )
    // vitest.setup.ts mocks next-intl's useLocale() to always return 'cs'
    expect(screen.getByText('O nás')).toBeInTheDocument()
    expect(screen.getByText('Kontakt')).toBeInTheDocument()
    expect(screen.getByLabelText('GenZ Consulting — domů')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/components/Header.test.tsx`
Expected: FAIL — `Header` currently sources labels from `useTranslations('nav')`, mocked to identity, so it renders literal keys instead of `"O nás"` / `"Kontakt"`.

- [ ] **Step 3: Replace `components/layout/nav/header.tsx`**

```tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ContactButton } from '../../ui/ContactButton';
import { useLayout } from '../layout-context';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { globalSettings } = useLayout();
  const locale = useLocale();
  const pathname = usePathname();

  const nav = locale === 'en' ? globalSettings?.header?.nav?.en : globalSettings?.header?.nav?.cs;

  const switchLocale = (newLocale: string) => {
    const withoutLocale = pathname.replace(/^\/(cs|en)/, '') || '/';
    return `/${newLocale}${withoutLocale}`;
  };
  const otherLocale = locale === 'cs' ? 'en' : 'cs';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  if (!nav) return null;

  const homeLink = { href: `/${locale}`, label: nav.homeLabel };
  const navLinks = [
    { href: `/${locale}/about`, label: nav.aboutLabel },
    { href: `/${locale}/case-studies`, label: nav.caseStudiesLabel },
    { href: `/${locale}/contact`, label: nav.contactLabel },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} aria-label={nav.homeLogoAria}>
            <Image
              src="/logo_dark_bg_v3.png"
              alt="GenZ Consulting"
              width={120}
              height={40}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href={homeLink.href}
              className={cn(
                'text-sm font-medium transition-colors duration-150',
                pathname === homeLink.href ? 'text-gtc-primary' : 'text-white/70 hover:text-white'
              )}
            >
              {homeLink.label}
            </Link>

            {/* Services dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setServicesOpen((v) => !v)}
                onMouseEnter={() => setServicesOpen(true)}
                className={cn(
                  'flex items-center gap-1 text-sm font-medium transition-colors duration-150',
                  servicesOpen ? 'text-gtc-primary' : 'text-white/70 hover:text-white'
                )}
              >
                {nav.servicesLabel}
                <ChevronDown
                  className={cn('size-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')}
                />
              </button>

              {servicesOpen && (
                <div
                  onMouseLeave={() => setServicesOpen(false)}
                  className="absolute left-0 top-full mt-2 w-56 border border-white/10 bg-black py-2 shadow-xl"
                >
                  {nav.serviceLinks?.map((service) => (
                    <Link
                      key={service?.slug}
                      href={`/${locale}/services/${service?.slug}`}
                      className="block px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors duration-100"
                    >
                      {service?.label}
                    </Link>
                  ))}
                  <div className="mx-4 my-2 border-t border-white/10" />
                  <Link
                    href={`/${locale}/services`}
                    className="block px-4 py-2.5 text-sm font-semibold text-gtc-primary hover:bg-white/5 transition-colors duration-100"
                  >
                    {nav.viewServicesLabel}
                  </Link>
                </div>
              )}
            </div>

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors duration-150',
                  pathname === href ? 'text-gtc-primary' : 'text-white/70 hover:text-white'
                )}
              >
                {label}
              </Link>
            ))}

            <Link
              href={switchLocale(otherLocale)}
              className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors duration-150"
            >
              {otherLocale}
            </Link>

            <ContactButton
                label={nav.bookCallLabel}
                size="default"
                className="rounded-none bg-gtc-primary px-5 py-2 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
              />
            </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-white"
            aria-label={menuOpen ? nav.menuCloseAria : nav.menuOpenAria}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — full-page overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-black lg:hidden">
          {/* Top bar mirrors the header */}
          <div className="flex h-20 items-center justify-between px-6">
            <Link href={`/${locale}`} aria-label={nav.homeLogoAria} onClick={() => setMenuOpen(false)}>
              <Image src="/logo_dark_bg_v3.png" alt="GenZ Consulting" width={120} height={40} className="h-16 w-auto" priority />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-white"
              aria-label={nav.menuCloseAria}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-1 flex-col overflow-y-auto px-6 pb-10 pt-4">
            <Link
              href={homeLink.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-white/10 py-5 text-lg font-bold text-white hover:text-gtc-primary transition-colors"
            >
              {homeLink.label}
            </Link>
            {/* Services accordion */}
            <button
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex w-full items-center justify-between border-b border-white/10 py-5 text-lg font-bold text-white"
            >
              {nav.servicesLabel}
              <ChevronDown
                className={cn('size-5 transition-transform duration-200', mobileServicesOpen && 'rotate-180')}
              />
            </button>
            {mobileServicesOpen && (
              <div className="border-b border-white/10 py-2 pl-4 space-y-0.5">
                {nav.serviceLinks?.map((service) => (
                  <Link
                    key={service?.slug}
                    href={`/${locale}/services/${service?.slug}`}
                    className="block py-3 text-base text-white/60 hover:text-white transition-colors"
                  >
                    {service?.label}
                  </Link>
                ))}
                <Link
                  href={`/${locale}/services`}
                  className="block py-3 text-base font-semibold text-gtc-primary"
                >
                  {nav.viewServicesLabel}
                </Link>
              </div>
            )}

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block border-b border-white/10 py-5 text-lg font-bold text-white hover:text-gtc-primary transition-colors"
              >
                {label}
              </Link>
            ))}

            {/* Bottom actions */}
            <div className="mt-auto pt-8 space-y-4">
              <ContactButton
                  label={nav.bookCallLabel}
                  size="lg"
                  className="h-auto w-full rounded-none bg-gtc-primary px-6 py-4 text-base font-bold text-black hover:bg-gtc-primary/90 transition-colors"
                />
              <Link
                href={switchLocale(otherLocale)}
                className="block text-center text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
              >
                {otherLocale === 'en' ? 'English' : 'Česky'}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/components/Header.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/nav/header.tsx tests/components/Header.test.tsx
git commit -m "$(cat <<'EOF'
Wire Header to Tina global header.nav instead of next-intl

Nav labels and service links are now editable in TinaCMS; the local
SERVICES constant and useTranslations('nav') are no longer needed.
EOF
)"
```

---

### Task 4: Create the `Home` Tina collection schema

**Files:**
- Create: `tina/collection/home.ts`
- Modify: `tina/config.tsx`

**Interfaces:**
- Produces: `HomeQuery['home']` shaped as `{ cs: HomeLocaleContent, en: HomeLocaleContent, logos: { name, src }[] }`, where `HomeLocaleContent` has: `hero`, `logosEyebrow`, `problem`, `solution`, `services`, `process`, `caseStudies`, `pdf`, `stats`, `testimonials`, `team`, `cta` (full shape below).

- [ ] **Step 1: Create `tina/collection/home.ts`**

```ts
// tina/collection/home.ts
import type { Collection } from 'tinacms';

const homeLocaleFields = [
  {
    type: 'object',
    label: 'Hero',
    name: 'hero',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Headline (line 1)', name: 'headline1' },
      { type: 'string', label: 'Headline (highlighted line 2)', name: 'headline2' },
      { type: 'string', label: 'Subline', name: 'subline' },
      { type: 'string', label: 'Body', name: 'body' },
      { type: 'string', label: 'Primary CTA', name: 'primaryCta' },
      { type: 'string', label: 'Secondary CTA', name: 'secondaryCta' },
      { type: 'string', label: 'Team Photo Alt Text', name: 'imageAlt' },
    ],
  } as const,
  { type: 'string', label: 'Logos Eyebrow', name: 'logosEyebrow' } as const,
  {
    type: 'object',
    label: 'Problem',
    name: 'problem',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Villain Statement', name: 'villain' },
      { type: 'string', label: 'Items', name: 'items', list: true },
    ],
  } as const,
  {
    type: 'object',
    label: 'Solution',
    name: 'solution',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Subtitle', name: 'subtitle' },
      { type: 'string', label: 'Items', name: 'items', list: true },
    ],
  } as const,
  {
    type: 'object',
    label: 'Services',
    name: 'services',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'View All Label', name: 'viewAll' },
      { type: 'string', label: 'Learn More Label', name: 'learnMore' },
      {
        type: 'object',
        label: 'Items',
        name: 'items',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Description', name: 'desc' },
          { type: 'string', label: 'Slug', name: 'slug' },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Process',
    name: 'process',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      {
        type: 'object',
        label: 'Steps',
        name: 'steps',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Description', name: 'desc' },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Case Studies Teaser',
    name: 'caseStudies',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'View All Label', name: 'viewAll' },
      { type: 'string', label: 'Card Label', name: 'cardLabel' },
      { type: 'string', label: 'Read More Label', name: 'readMore' },
    ],
  } as const,
  {
    type: 'object',
    label: 'PDF Guide',
    name: 'pdf',
    fields: [
      { type: 'string', label: 'Badge', name: 'badge' },
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Body', name: 'body' },
      { type: 'string', label: 'CTA', name: 'cta' },
      { type: 'string', label: 'Secondary CTA', name: 'secondaryCta' },
      { type: 'string', label: 'Cover Title', name: 'coverTitle' },
      { type: 'string', label: 'Cover Meta', name: 'coverMeta' },
      { type: 'string', label: 'Cover Meta Tag', name: 'coverMetaTag' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Stats',
    name: 'stats',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Number', name: 'num' },
      { type: 'string', label: 'Label', name: 'label' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Testimonials',
    name: 'testimonials',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'LinkedIn Button Label', name: 'linkedInLabel' },
      { type: 'string', label: 'Nav Aria Label (use {n} for the index)', name: 'navAria' },
      {
        type: 'object',
        label: 'Items',
        name: 'items',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.author }) },
        fields: [
          { type: 'string', label: 'Quote', name: 'quote', ui: { component: 'textarea' } },
          { type: 'string', label: 'Author', name: 'author' },
          { type: 'string', label: 'Role', name: 'role' },
          { type: 'string', label: 'LinkedIn URL', name: 'linkedin' },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Team',
    name: 'team',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'View About Label', name: 'viewAbout' },
      {
        type: 'object',
        label: 'Members',
        name: 'members',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.name }) },
        fields: [
          { type: 'string', label: 'Name', name: 'name' },
          { type: 'string', label: 'Role', name: 'role' },
          { type: 'string', label: 'Bio', name: 'bio', ui: { component: 'textarea' } },
          { type: 'image', label: 'Photo', name: 'photo' },
          { type: 'string', label: 'LinkedIn URL', name: 'linkedin' },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'CTA',
    name: 'cta',
    fields: [
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc' },
      { type: 'string', label: 'Primary Button', name: 'primary' },
      { type: 'string', label: 'Secondary Button', name: 'secondary' },
    ],
  } as const,
];

const Home: Collection = {
  label: 'Home Page',
  name: 'home',
  path: 'content/home',
  format: 'json',
  ui: { global: true },
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: homeLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: homeLocaleFields as any },
    {
      type: 'object',
      label: 'Client Logos (shared across languages)',
      name: 'logos',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.name }) },
      fields: [
        { type: 'string', label: 'Name', name: 'name' },
        { type: 'image', label: 'Logo Image', name: 'src' },
      ],
    },
  ],
};

export default Home;
```

- [ ] **Step 2: Register the collection**

Modify `tina/config.tsx`:

```ts
// tina/config.tsx
import { defineConfig } from 'tinacms';
import Global from './collection/global';
import Home from './collection/home';

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
    collections: [Global, Home],
  },
});

export default config;
```

- [ ] **Step 3: Regenerate the Tina client/types**

Run: `npm run build-local`
Expected: Completes without schema errors; `tina/__generated__/types.ts` now exports `HomeQuery`/`HomeQueryVariables`, and `client.queries.home` exists on the generated client.

- [ ] **Step 4: Commit**

```bash
git add tina/collection/home.ts tina/config.tsx tina/__generated__
git commit -m "$(cat <<'EOF'
Add Home Tina collection schema

Defines the cs/en content shape for the Home page (hero, problem/
solution, services, process, case-study teaser, PDF guide, stats,
testimonials, team, CTA) plus a shared client-logo list.
EOF
)"
```

---

### Task 5: Write `content/home/index.json`

**Files:**
- Create: `content/home/index.json`

- [ ] **Step 1: Create the file**

```json
{
  "cs": {
    "hero": {
      "eyebrow": "Specialisté na generaci Z",
      "headline1": "Generace Z není",
      "headline2": "komplikovaná",
      "subline": "Firmy ji jen neumí oslovit.",
      "body": "Pomáháme firmám přitáhnout, vybrat a udržet Gen Z talenty. A protože sami Gen Z jsme, rozumíme jim opravdu.",
      "primaryCta": "Domluvit schůzku",
      "secondaryCta": "Stáhnout průvodce zdarma",
      "imageAlt": "Tým GenZ Consulting"
    },
    "logosEyebrow": "Klienti a partneři",
    "problem": {
      "eyebrow": "Proč to nefunguje",
      "title": "Firmy nepřicházejí o Gen Z kvůli tomu, že je tato generace složitá.",
      "villain": "Přicházejí o ně, protože systémy pro mladé staví lidé, kteří jejich potřeby nikdy nežili.",
      "items": [
        "Kandidáti se nehlásí nebo po nástupu rychle odcházejí.",
        "Onboarding a HR komunikace z minulých let Gen Z prostě neosloví.",
        "Nábor je drahý a výsledky často neodpovídají očekávání."
      ]
    },
    "solution": {
      "eyebrow": "Jak přistupujeme jinak",
      "title": "Nejsme konzultanti, kteří o Gen Z jen čtou.",
      "subtitle": "Jsme Gen Z a rozumíme i tomu, jak funguje firma.",
      "items": [
        "Přímá zkušenost z vlastní generace, ne jen teorie.",
        "Pracujeme s firmami jako Global Payments, Generali nebo AV Media.",
        "Dáváme řešení, která mají jasný dopad."
      ]
    },
    "services": {
      "eyebrow": "Co umíme",
      "title": "Čtyři způsoby, jak pomáháme",
      "viewAll": "Zobrazit všechny služby →",
      "learnMore": "Zjistit více →",
      "items": [
        { "num": "01", "title": "Trainee program", "desc": "Kompletní trainee program na míru přitáhne správné talenty, efektivně je vyškolí a udrží ve firmě.", "slug": "trainee-program" },
        { "num": "02", "title": "Onboardingová aplikace", "desc": "Digitální průvodce onboardingem v nástrojích, které firma již používá. HR vidí vše v reálném čase.", "slug": "onboarding-app" },
        { "num": "03", "title": "Workshop o Gen Z", "desc": "Vzdělávací workshop pro HR týmy ve třech variantách, od obecného základu po výzkum na míru vaší firmě.", "slug": "genz-workshop" },
        { "num": "04", "title": "Kariérní stránky", "desc": "Analýza vaší kariérní stránky z pohledu Gen Z s konkrétními doporučeními, co a jak změnit.", "slug": "career-pages" }
      ]
    },
    "process": {
      "eyebrow": "Jak spolupráce vypadá",
      "title": "Tři kroky ke spolupráci",
      "steps": [
        { "num": "01", "title": "Zjistíme, co vás trápí", "desc": "Setkáme se a zjistíme, zda má smysl to řešit společně. Bez závazků." },
        { "num": "02", "title": "Poznáme vaši firmu", "desc": "Pochopíme, jak to u vás chodí, a jaký je celý kontext problému." },
        { "num": "03", "title": "Postavíme řešení na míru", "desc": "Navrhneme řešení přesně pro vás: jednoduché na nasazení a s měřitelným dopadem." }
      ]
    },
    "caseStudies": {
      "eyebrow": "Naše práce",
      "title": "Projekty, kde jsme pomohli",
      "viewAll": "Zobrazit všechny case studies →",
      "cardLabel": "Case study",
      "readMore": "Číst case study"
    },
    "pdf": {
      "badge": "Zdarma · Bez emailu · Bez triků",
      "headline": "PDF: Kariérní stránky pro Gen Z.",
      "body": "32 stran. Checklist a reálné příklady toho, co Gen Z na kariérních stránkách hledá a kde české firmy padají. Stáhněte, pošlete šéfovi nebo použijte na schůzce.",
      "cta": "Stáhnout PDF (3,4 MB)",
      "secondaryCta": "Domluvit nezávazný call",
      "coverTitle": "Kariérní stránky pro Gen Z.",
      "coverMeta": "32 stran · 2026",
      "coverMetaTag": "GZC · GUIDE 01"
    },
    "stats": [
      { "num": "50+", "label": "spokojených firem" },
      { "num": "3", "label": "oblasti expertízy" },
      { "num": "100%", "label": "Gen Z tým" }
    ],
    "testimonials": {
      "eyebrow": "Co říkají klienti",
      "linkedInLabel": "LinkedIn",
      "navAria": "Přejít na referenci {n}",
      "items": [
        {
          "quote": "Tým GenZ Consulting si prošel celou cestu našeho zákazníka očima mladého podnikatele, od prvního hledání na Googlu až po terminál v ruce. Ukázali nám painpointy, které jsme my často jako painpointy ani nevnímali. Rovnou k nim navrhli i řešení, z nichž některá jsme později implementováli a využili na našem webu. Tím, že jsou to lidé z nové rády Gen Z, které opravdu rozumějí, ale i jejich  doporučení nebyla jen jejich zkušenost, ověřena a otestována.",
          "author": "Jozef Ryšavý",
          "role": "Marketingový ředitel, Global Payments",
          "linkedin": "https://www.linkedin.com/in/jozef-rysavy-0868055/"
        },
        {
          "quote": "GenZ Consulting pro nás realizovali rozsáhlý výzkum mladé generace – přes 300 dotazníků a víc než 20 hloubkových rozhovorů. Data nejen posbírali, ale také je interpretovalí a porovnávali mezi sebou, což pro nás bylo velice užitečné. Nejvíce nás zaujala forma výstupu – interaktivní web, ze kterého se k výsledkům snadno vracíme. Oceňujeme také jejich přístup a rychlost, s jakou celý projekt zvládli.",
          "author": "Jiří Plátek",
          "role": "Marketingový ředitel, AV Media",
          "linkedin": "https://www.linkedin.com/in/jiriplatek/"
        }
      ]
    },
    "team": {
      "eyebrow": "Náš tým",
      "title": "Sami jsme Gen Z. Rozumíme té generaci zevnitř.",
      "viewAbout": "Více o nás →",
      "members": [
        {
          "name": "Adam Dalecký",
          "role": "Co-founder & Lead Consultant",
          "bio": "Adam pomáhá firmám lépe pracovat s Gen Z v náboru a onboardingových procesech. Prošel desítkami rozhovorů a dobře rozumí této generaci.",
          "photo": "/adam_cropped.jpeg",
          "linkedin": "https://www.linkedin.com/in/adam-dalecky/"
        },
        {
          "name": "Jonatan Petr",
          "role": "Co-founder & AI Project Lead",
          "bio": "Jonatan je součástí GenZ Consulting od začátku. Rozumí Gen Z i tomu, jak firmy skutečně fungují, a do práce přináší zároveň pohled z generace i praktický přístup z byznysu.",
          "photo": "/jonathan_cropped.jpeg",
          "linkedin": "https://www.linkedin.com/in/jonatan-petr/"
        }
      ]
    },
    "cta": {
      "title": "Připraveni začít?",
      "desc": "Rezervujte si nezávazný call nebo si stáhněte náš průvodce zdarma.",
      "primary": "Domluvit schůzku",
      "secondary": "Stáhnout průvodce zdarma"
    }
  },
  "en": {
    "hero": {
      "eyebrow": "Gen Z specialists",
      "headline1": "Gen Z is not",
      "headline2": "complicated.",
      "subline": "Companies just don't know how to reach them.",
      "body": "We help companies attract, select and retain Gen Z talent. And because we are Gen Z ourselves, we truly understand them.",
      "primaryCta": "Book a call",
      "secondaryCta": "Download free guide",
      "imageAlt": "GenZ Consulting team"
    },
    "logosEyebrow": "Clients & partners",
    "problem": {
      "eyebrow": "Why it's not working",
      "title": "Companies do not lose Gen Z because this generation is complicated.",
      "villain": "They lose them because systems for young people are built by people who never lived those needs.",
      "items": [
        "Candidates do not apply or leave soon after joining.",
        "Onboarding and HR communication from the past decade simply do not reach Gen Z.",
        "Recruitment is expensive and the results often fall short of expectations."
      ]
    },
    "solution": {
      "eyebrow": "How we do it differently",
      "title": "We are not consultants who only read about Gen Z.",
      "subtitle": "We are Gen Z and we understand how businesses work.",
      "items": [
        "Direct experience from our own generation, not just theory.",
        "We work with companies such as Global Payments, Generali and AV Media.",
        "We create solutions that have a clear impact."
      ]
    },
    "services": {
      "eyebrow": "What we do",
      "title": "Four ways we help",
      "viewAll": "View all services →",
      "learnMore": "Learn more →",
      "items": [
        { "num": "01", "title": "Trainee program", "desc": "A fully custom trainee program — attracts the right talent, trains them effectively and keeps them at your company.", "slug": "trainee-program" },
        { "num": "02", "title": "Onboarding app", "desc": "A digital onboarding guide built in tools your company already uses. HR sees everything in real time.", "slug": "onboarding-app" },
        { "num": "03", "title": "Gen Z Workshop", "desc": "An educational workshop for HR teams in three variants — from a general foundation to custom research for your company.", "slug": "genz-workshop" },
        { "num": "04", "title": "Career pages", "desc": "An analysis of your career page from Gen Z's perspective — concrete recommendations on what and how to change.", "slug": "career-pages" }
      ]
    },
    "process": {
      "eyebrow": "How it works",
      "title": "Three steps to collaboration",
      "steps": [
        { "num": "01", "title": "We find out what's wrong", "desc": "We meet and find out whether it makes sense to solve it together. No commitment." },
        { "num": "02", "title": "We get to know your company", "desc": "We understand how things work at your company and what the full context of the problem is." },
        { "num": "03", "title": "We build a tailored solution", "desc": "We design a solution precisely for you — easy to implement, with measurable impact." }
      ]
    },
    "caseStudies": {
      "eyebrow": "Our work",
      "title": "Projects where we helped",
      "viewAll": "View all case studies →",
      "cardLabel": "Case study",
      "readMore": "Read case study"
    },
    "pdf": {
      "badge": "Free · No email · No tricks",
      "headline": "PDF: Career pages for Gen Z.",
      "body": "32 pages. Checklist + real examples of what Gen Z looks for on career pages and where companies fall short. Download, share with your manager, use in your next meeting.",
      "cta": "Download PDF (3.4 MB)",
      "secondaryCta": "Or book a call instead",
      "coverTitle": "Career pages for Gen Z.",
      "coverMeta": "32 pages · 2026",
      "coverMetaTag": "GZC · GUIDE 01"
    },
    "stats": [
      { "num": "50+", "label": "satisfied companies" },
      { "num": "3", "label": "areas of expertise" },
      { "num": "100%", "label": "Gen Z team" }
    ],
    "testimonials": {
      "eyebrow": "What clients say",
      "linkedInLabel": "LinkedIn",
      "navAria": "Go to testimonial {n}",
      "items": [
        {
          "quote": "The GenZ Consulting team walked our customer's entire journey through the eyes of a young entrepreneur, from the very first Google search all the way to a terminal in hand. They pointed out pain points that we often didn't even perceive as pain points. They immediately proposed solutions, some of which we later implemented and used on our website. Because they are Gen Z, they truly understand the generation, but I liked that they didn't rely only on their personal experience - they backed it up with research and testing. Their recommendations also respected the reality of our business, our constraints and regulations, so we could apply them right away.",
          "author": "Jozef Ryšavý",
          "role": "Marketing Director, Global Payments",
          "linkedin": "https://www.linkedin.com/in/jozef-rysavy-0868055/"
        },
        {
          "quote": "GenZ Consulting ran an extensive study of the young generation for us - over 300 questionnaires and 20 in-depth interviews. They didn't just collect the data, they also linked and compared it against each other, which proved very useful for us. We were particularly pleased with the form of the output. We received an interactive website from which we can easily look things back up. We also appreciated their approach and the speed with which they handled the whole project. We were very happy with the cooperation.",
          "author": "Jiří Plátek",
          "role": "Marketing Director, AV Media",
          "linkedin": "https://www.linkedin.com/in/jiriplatek/"
        }
      ]
    },
    "team": {
      "eyebrow": "Our team",
      "title": "We are Gen Z ourselves. We understand this generation from the inside.",
      "viewAbout": "More about us →",
      "members": [
        {
          "name": "Adam Dalecký",
          "role": "Co-founder & Lead Consultant",
          "bio": "Adam helps companies work better with Gen Z in hiring and onboarding. He has gone through dozens of interviews and understands this generation well.",
          "photo": "/adam_cropped.jpeg",
          "linkedin": "https://www.linkedin.com/in/adam-dalecky/"
        },
        {
          "name": "Jonatan Petr",
          "role": "Co-founder & AI Project Lead",
          "bio": "Jonatan has been part of GenZ Consulting from the start. He understands Gen Z and how companies really work, and brings both a generational perspective and a practical business approach to the work.",
          "photo": "/jonathan_cropped.jpeg",
          "linkedin": "https://www.linkedin.com/in/jonatan-petr/"
        }
      ]
    },
    "cta": {
      "title": "Ready to start?",
      "desc": "Book a no-obligation call or download our free guide.",
      "primary": "Book a call",
      "secondary": "Download free guide"
    }
  },
  "logos": [
    { "name": "Global Payments", "src": "/globalpayments.jpeg" },
    { "name": "Generali", "src": "/logo-orizzontale.2020-07-16-17-41-47.jpeg" },
    { "name": "AV Media", "src": "/AV-MEDIA-SYSTEMS_horizontalni_1200_1200-970x970.png" },
    { "name": "Raynet", "src": "/LOGO_Raynet_big.png" },
    { "name": "ČZU", "src": "/CZU_logotyp_V_zelena.png" },
    { "name": "CITA", "src": "/CITALogo.png" },
    { "name": "TAP", "src": "/tap_logo.png" }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add content/home/index.json
git commit -m "$(cat <<'EOF'
Add Home page content to Tina, reshaped from messages/*.json

Transcribes messages.home (cs/en) into the new Home collection shape;
no wording changes.
EOF
)"
```

---

### Task 6: Migrate `HomePage` + `app/[locale]/page.tsx` to Tina content (TDD)

**Files:**
- Modify: `components/pages/home/HomePage.tsx`
- Modify: `app/[locale]/page.tsx`
- Test: `tests/components/HomePage.test.tsx` (create)

**Interfaces:**
- Consumes: `HomeQuery['home']` (from Task 4) via a `content: HomeQuery['home']['cs']` prop and a `logos: HomeQuery['home']['logos']` prop.
- Produces: `HomePage` component with no `useTranslations` dependency (still uses `useLocale()` for route building).

- [ ] **Step 1: Write the failing test**

Create `tests/components/HomePage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/components/pages/home/HomePage'

const content = {
  hero: {
    eyebrow: 'Specialisté na generaci Z',
    headline1: 'Generace Z není',
    headline2: 'komplikovaná',
    subline: 'Firmy ji jen neumí oslovit.',
    body: 'Pomáháme firmám přitáhnout, vybrat a udržet Gen Z talenty.',
    primaryCta: 'Domluvit schůzku',
    secondaryCta: 'Stáhnout průvodce zdarma',
    imageAlt: 'Tým GenZ Consulting',
  },
  logosEyebrow: 'Klienti a partneři',
  problem: { eyebrow: 'Proč to nefunguje', title: 'Problem title', villain: 'villain text', items: ['Item one'] },
  solution: { eyebrow: 'Jak přistupujeme jinak', title: 'Solution title', subtitle: 'sub', items: ['Solution item one'] },
  services: {
    eyebrow: 'Co umíme',
    title: 'Čtyři způsoby, jak pomáháme',
    viewAll: 'Zobrazit všechny služby →',
    learnMore: 'Zjistit více →',
    items: [{ num: '01', title: 'Trainee program', desc: 'desc', slug: 'trainee-program' }],
  },
  process: {
    eyebrow: 'Jak spolupráce vypadá',
    title: 'Tři kroky ke spolupráci',
    steps: [{ num: '01', title: 'Step one', desc: 'desc' }],
  },
  caseStudies: { eyebrow: 'Naše práce', title: 'Projekty, kde jsme pomohli', viewAll: 'view all', cardLabel: 'Case study', readMore: 'Read more' },
  pdf: {
    badge: 'badge', headline: 'PDF headline', body: 'body', cta: 'cta', secondaryCta: 'secondary',
    coverTitle: 'cover', coverMeta: 'meta', coverMetaTag: 'GZC · GUIDE 01',
  },
  stats: [{ num: '50+', label: 'spokojených firem' }],
  testimonials: {
    eyebrow: 'Co říkají klienti',
    linkedInLabel: 'LinkedIn',
    navAria: 'Přejít na referenci {n}',
    items: [{ quote: 'Skvělá spolupráce', author: 'Jozef Ryšavý', role: 'Marketing Director', linkedin: 'https://linkedin.com' }],
  },
  team: {
    eyebrow: 'Náš tým',
    title: 'Team title',
    viewAbout: 'more',
    members: [{ name: 'Adam Dalecký', role: 'Co-founder', bio: 'bio', photo: '/adam_cropped.jpeg', linkedin: 'https://linkedin.com' }],
  },
  cta: { title: 'Připraveni začít?', desc: 'desc', primary: 'primary', secondary: 'secondary' },
} as any

const logos = [{ name: 'Global Payments', src: '/globalpayments.jpeg' }] as any

describe('HomePage', () => {
  it('renders copy from the content prop instead of translation keys', () => {
    render(<HomePage content={content} logos={logos} />)
    expect(screen.getByText('Generace Z není')).toBeInTheDocument()
    expect(screen.getByText('Trainee program')).toBeInTheDocument()
    expect(screen.getByText('spokojených firem')).toBeInTheDocument()
    expect(screen.getByText('Skvělá spolupráce')).toBeInTheDocument()
    expect(screen.getByText('Připraveni začít?')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/components/HomePage.test.tsx`
Expected: FAIL — `HomePage` currently takes no props and sources everything from `useTranslations('home')` (mocked to identity), so none of the mock content strings appear.

- [ ] **Step 3: Replace `components/pages/home/HomePage.tsx`**

```tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, ArrowDown, Check, Quote, Linkedin, Download } from 'lucide-react';
import { ContactButton } from '@/components/ui/ContactButton';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { getCaseStudy } from '@/components/pages/case-studies/case-study-data';
import type { HomeQuery } from '../../../tina/__generated__/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

export type HomeContent = NonNullable<HomeQuery['home']>['cs'];
export type HomeLogos = NonNullable<HomeQuery['home']>['logos'];

function TestimonialSlider({ content }: { content: HomeContent['testimonials'] }) {
  const testimonials = content?.items ?? [];
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  const syncActive = () => {
    const el = sliderRef.current;
    if (!el) return;
    const per = el.scrollWidth / testimonials.length || 1;
    setActive(Math.round(el.scrollLeft / per));
  };

  const goTo = (i: number) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollTo({ left: (el.scrollWidth / testimonials.length) * i, behavior: 'smooth' });
  };

  return (
    <>
      <div
        ref={sliderRef}
        onScroll={syncActive}
        className="flex snap-x snap-mandatory gap-12 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0"
      >
        {testimonials.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1 * (i + 1)}
            className="flex w-[82vw] shrink-0 snap-start flex-col lg:w-auto lg:shrink-none lg:snap-none"
          >
            <Quote className="mb-6 size-10 text-gtc-primary" fill="currentColor" />
            <blockquote className="flex-1 text-base font-medium leading-relaxed text-white/90 md:text-lg">
              {item?.quote}
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-8 bg-gtc-primary" />
              <div>
                <p className="text-sm font-bold text-white">{item?.author}</p>
                <p className="text-xs text-white/40">{item?.role}</p>
                <a
                  href={item?.linkedin ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-gtc-primary hover:underline"
                >
                  <Linkedin className="size-4" />
                  {content?.linkedInLabel}
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-2 lg:hidden">
        {testimonials.map((_, i) => (
          <button
            key={i}
            aria-label={content?.navAria?.replace('{n}', String(i + 1))}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${active === i ? 'w-6 bg-gtc-primary' : 'w-2 bg-white/25'}`}
          />
        ))}
      </div>
    </>
  );
}

export default function HomePage({ content, logos }: { content: HomeContent; logos: HomeLogos }) {
  const locale = useLocale();

  const caseStudies = ['av-media', 'global-payments', 'generali']
    .map((slug) => {
      const cs = getCaseStudy(slug, locale);
      return cs ? { slug, client: cs.client, intro: cs.hero.intro } : null;
    })
    .filter((cs): cs is { slug: string; client: string; intro: string } => Boolean(cs));

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:min-h-[90vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-24">
          {/* ── LEFT: text ── */}
          <div className="order-2 lg:order-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-8 flex items-center gap-3"
            >
              <span aria-hidden className="h-px w-10 bg-black/40" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-black/50">
                {content.hero?.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-[2.25rem] font-black leading-[1.04] tracking-tight text-black text-balance break-words sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {content.hero?.headline1}{' '}
              {(() => {
                const h2 = content.hero?.headline2 ?? '';
                const m = h2.match(/^(.*?)([.!?]*)$/);
                const word = m?.[1] ?? h2;
                const trail = m?.[2] ?? '';
                return (
                  <>
                    <span className="relative inline-block">
                      <span
                        aria-hidden
                        className="absolute -inset-x-3 -inset-y-1 -z-0 rounded-[0.55em] bg-gtc-primary"
                      />
                      <span
                        aria-hidden
                        className="absolute -bottom-2 left-7 -z-0 h-5 w-5 rotate-45 bg-gtc-primary"
                      />
                      <span className="relative z-10">{word}</span>
                    </span>
                    {trail}
                  </>
                );
              })()}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="mt-8 text-2xl font-bold text-black/70 md:text-3xl"
            >
              {content.hero?.subline}
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="mt-5 max-w-xl text-base text-black/60 md:text-lg"
            >
              {content.hero?.body}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="mt-10 flex flex-wrap gap-3"
            >
              <ContactButton
                label={content.hero?.primaryCta ?? ''}
                size="lg"
                className="rounded-full bg-black px-8 py-4 text-sm font-bold text-white hover:bg-black/80 transition-colors"
              />
              <a
                href="#pdf-guide"
                className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-transparent px-8 py-4 text-sm font-bold text-black hover:bg-black hover:text-white transition-colors"
              >
                {content.hero?.secondaryCta}
                <ArrowDown className="size-4" />
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: team photo in a Gen-Z sticker frame (bottom intentionally cropped) ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.25}
            className="relative order-1 mx-auto w-full max-w-[16rem] sm:max-w-xs lg:order-2 lg:max-w-md"
          >
            {/* offset teal sticker panel behind */}
            <div
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.75rem] bg-gtc-primary"
            />

            {/* soft glow/bubble effect extending into white background */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.18),transparent_45%)] blur-3xl opacity-80"
            />

            {/* framed photo — object-top + square ratio crops the lower legs cleanly */}
            <div className="relative aspect-square overflow-hidden rounded-[2.75rem] border-[3px] border-black bg-gradient-to-b from-gtc-primary/20 via-gtc-primary/10 to-white shadow-[0_0_0_1px_rgba(16,185,129,0.12)]">
              <Image
                src="/team_no_bg.png"
                alt={content.hero?.imageAlt ?? ''}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LOGOS ── */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-400"
          >
            {content.logosEyebrow}
          </motion.p>
        </div>
        <div className="overflow-hidden w-full px-6">
          <InfiniteSlider gap={64} speed={40} speedOnHover={20} className="w-full">
            {(logos ?? []).map((logo) => (
              <div key={logo?.name} className="flex items-center justify-center">
                {logo?.src ? (
                  <Image
                    src={logo.src}
                    alt={logo.name ?? ''}
                    width={0}
                    height={0}
                    sizes="200px"
                    style={{ height: '2.5rem', width: 'auto' }}
                    className="grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="text-sm font-bold uppercase tracking-widest text-zinc-300">{logo?.name}</span>
                )}
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="bg-gtc-deep py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 md:grid-cols-2">
            {/* Problem */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary">
                {content.problem?.eyebrow}
              </p>
              <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
                {content.problem?.title}
              </h2>
              <p className="mt-4 text-base font-semibold text-white/60 italic">
                {content.problem?.villain}
              </p>
              <ul className="mt-6 space-y-3">
                {(content.problem?.items ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gtc-primary" />
                    <span className="text-sm leading-relaxed text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solution */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary">
                {content.solution?.eyebrow}
              </p>
              <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
                {content.solution?.title}
              </h2>
              <p className="mt-2 text-xl font-black text-gtc-primary md:text-2xl">
                {content.solution?.subtitle}
              </p>
              <ul className="mt-6 space-y-3">
                {(content.solution?.items ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-gtc-primary" />
                    <span className="text-sm leading-relaxed text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14 border-b border-zinc-200 pb-10"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-gtc-primary" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
                {content.services?.eyebrow}
              </p>
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-black md:text-5xl">
              {content.services?.title}
            </h2>
          </motion.div>

          <div className="grid gap-px bg-zinc-200 sm:grid-cols-2">
            {(content.services?.items ?? []).map((service, i) => (
              <motion.div
                key={service?.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="group relative bg-white p-8 hover:bg-zinc-50 transition-colors duration-200"
              >
                <span className="text-4xl font-black text-gtc-primary select-none">{service?.num}</span>
                <h3 className="mt-3 text-lg font-black text-black">{service?.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{service?.desc}</p>
                <Link
                  href={`/${locale}/services/${service?.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gtc-dark hover:text-black transition-colors duration-150"
                >
                  {content.services?.learnMore}
                  <ArrowRight className="size-3" />
                </Link>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gtc-primary transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 text-right"
          >
            <Link
              href={`/${locale}/services`}
              className="text-sm font-bold text-zinc-400 hover:text-black transition-colors duration-150"
            >
              {content.services?.viewAll}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {content.process?.eyebrow}
            </p>
            <h2 className="text-3xl font-black text-black md:text-4xl">{content.process?.title}</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {(content.process?.steps ?? []).map((step, i, arr) => (
              <motion.div
                key={step?.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="relative"
              >
                <div className="text-6xl font-black leading-none text-gtc-primary">{step?.num}</div>
                <h3 className="mt-4 text-lg font-black text-black">{step?.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step?.desc}</p>
                {i < arr.length - 1 && (
                  <div className="absolute -right-4 top-8 hidden text-zinc-300 md:block">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {content.caseStudies?.eyebrow}
            </p>
            <h2 className="text-3xl font-black text-black md:text-4xl">{content.caseStudies?.title}</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {caseStudies.map(({ client, intro, slug }, i) => (
              <Link
                key={slug}
                href={`/${locale}/case-studies/${slug}`}
                className="group relative flex flex-col border border-zinc-200 bg-white p-7 transition-colors duration-200 hover:border-gtc-primary"
              >
                <motion.span
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="flex flex-1 flex-col"
                >
                  <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gtc-dark">
                    {content.caseStudies?.cardLabel}
                    <ArrowUpRight className="size-3.5" />
                  </span>
                  <h3 className="text-lg font-black text-black">{client}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{intro}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gtc-dark group-hover:text-black transition-colors duration-150">
                    {content.caseStudies?.readMore}
                    <ArrowRight className="size-3" />
                  </span>
                </motion.span>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gtc-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 text-right"
          >
            <Link
              href={`/${locale}/case-studies`}
              className="text-sm font-bold text-zinc-400 hover:text-black transition-colors duration-150"
            >
              {content.caseStudies?.viewAll}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── PDF GUIDE ── */}
      <section id="pdf-guide" className="bg-[#0c0c0c] py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            {/* Left */}
            <div>
              <div className="mb-6 flex items-center gap-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-gtc-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">
                  {content.pdf?.badge}
                </span>
              </div>
              <h2 className="text-4xl font-black leading-[1.05] text-white md:text-5xl">
                {content.pdf?.headline}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/50">
                {content.pdf?.body}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/downloads/legit-check.pdf"
                  download
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gtc-primary px-7 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
                >
                  <Download className="size-4" />
                  {content.pdf?.cta}
                </a>
                <ContactButton
                  label={content.pdf?.secondaryCta ?? ''}
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/25 bg-transparent px-7 py-3.5 text-sm font-bold text-white hover:border-white/50 hover:bg-white/5"
                />
              </div>
            </div>

            {/* Right: PDF cover card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="hidden lg:block"
            >
              <div
                className="relative flex w-[260px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-white p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
                style={{ aspectRatio: '3/4', transform: 'rotate(3deg)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/35">
                  {content.pdf?.coverMetaTag}
                </p>
                <div>
                  <h3 className="text-2xl font-black leading-tight text-black">
                    {content.pdf?.coverTitle}
                  </h3>
                  <div className="mt-6 space-y-2">
                    <div className="h-[3px] w-full rounded-full bg-black" />
                    <div className="h-[3px] w-2/3 rounded-full bg-gtc-primary" />
                    <div className="h-[2px] w-2/5 rounded-full bg-black/15" />
                  </div>
                  <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                    {content.pdf?.coverMeta}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gtc-primary py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            {(content.stats ?? []).map((stat, i) => (
              <motion.div
                key={stat?.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="text-center"
              >
                <div className="text-6xl font-black text-black md:text-7xl">{stat?.num}</div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-black/60">{stat?.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary"
          >
            {content.testimonials?.eyebrow}
          </motion.p>
          <TestimonialSlider content={content.testimonials} />
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {content.team?.eyebrow}
            </p>
            <h2 className="text-3xl font-black leading-tight text-black md:text-4xl">
              {content.team?.title}
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {(content.team?.members ?? []).map((member, i) => (
              <motion.div
                key={member?.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="group flex gap-6 p-6 transition-colors duration-200"
              >
                <div className="relative h-40 w-28 shrink-0 overflow-hidden">
                  <Image
                    src={member?.photo ?? ''}
                    alt={`${member?.name} — GenZ Consulting`}
                    fill
                    className="object-cover object-[center_0%]"
                    sizes="112px"
                  />
                  <div className="absolute inset-0 bg-gtc-primary/10 mix-blend-multiply" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-black text-black">{member?.name}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gtc-dark">{member?.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{member?.bio}</p>
                  <a
                    href={member?.linkedin ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-zinc-400 transition-colors duration-150 hover:text-gtc-dark"
                  >
                    <Linkedin className="size-3.5" />
                    {content.testimonials?.linkedInLabel}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <Link
            href={`/${locale}/about`}
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-zinc-400 hover:text-black transition-colors duration-150"
          >
            {content.team?.viewAbout}
          </Link>
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
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-4xl font-black text-white md:text-5xl">{content.cta?.title}</h2>
            <p className="mt-4 text-base text-white/60">{content.cta?.desc}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ContactButton
                label={content.cta?.primary ?? ''}
                size="lg"
                className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
              />
              <a
                href="#pdf-guide"
                className="rounded-none border-2 border-white/30 px-8 py-4 text-sm font-bold text-white hover:border-white hover:bg-white/5 transition-colors"
              >
                {content.cta?.secondary}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
}
```

- [ ] **Step 4: Update `app/[locale]/page.tsx` to fetch and pass Tina content**

```tsx
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
      <HomePage content={content!} logos={data.home.logos} />
    </Layout>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run tests/components/HomePage.test.tsx`
Expected: PASS

- [ ] **Step 6: Run the full test suite**

Run: `npm run test:run`
Expected: All tests pass (Header, Footer, HomePage, ContactButton, LeadMagnetModal, and any API tests).

- [ ] **Step 7: Commit**

```bash
git add components/pages/home/HomePage.tsx "app/[locale]/page.tsx" tests/components/HomePage.test.tsx
git commit -m "$(cat <<'EOF'
Wire HomePage to Tina Home content instead of next-intl

app/[locale]/page.tsx fetches the Home Tina document server-side and
resolves the requested locale before handing it to HomePage as a
content prop; useTranslations('home') is no longer needed here.
EOF
)"
```

---

### Task 7: Remove migrated keys from `messages/*.json`

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/cs.json`

**Interfaces:**
- Consumes: nothing new.
- Produces: `messages/*.json` with the `nav`, `footer`, and `home` top-level keys removed; every other namespace (`leadMagnet`, `services`, `traineeProgram`, `onboardingApp`, `genzWorkshop`, `careerPages`, `customSolution`, `about`, `caseStudies`, `contactDialog`, `contact`, `caseStudyDetail`) untouched.

- [ ] **Step 1: Remove the `nav`, `footer`, and `home` keys from `messages/en.json`**

Delete lines 2–158 of the current file (the `"nav"`, `"footer"`, `"leadMagnet"` block stays — only `"nav"`, `"footer"`, and `"home"` are removed; `"leadMagnet"` is untouched since it's dead code, not migrated). The resulting file starts:

```json
{
  "leadMagnet": {
    "badge": "Free · For HR & EB · Instant download",
    "title": "7 things that decide whether Gen Z stays at your company",
    "description": "A practical guide for HR, Talent Acquisition and Employer Branding — enter your email to download.",
    "emailPlaceholder": "your@email.com",
    "submit": "Download the guide",
    "submitting": "Sending...",
    "successTitle": "Done! The guide is on its way.",
    "successDescription": "Check your email.",
    "downloadButton": "Download PDF",
    "secondaryCta": "Or book a call instead",
    "coverTitle": "7 things that decide about Gen Z.",
    "coverMeta": "32 pages · 2026",
    "errorGeneric": "Something went wrong. Please try again.",
    "errorInvalidEmail": "Please enter a valid email address.",
    "closeAria": "Close",
    "guideMetaTag": "GZC · GUIDE 01"
  },
  "services": {
```
… and continues unchanged through the end of the original file (`"services"` through `"caseStudyDetail"`, i.e. what were lines 159–344).

- [ ] **Step 2: Remove the `nav`, `footer`, and `home` keys from `messages/cs.json`**

Same edit, mirrored: delete the `"nav"` and `"footer"` blocks and the `"home"` block, keep `"leadMagnet"` onward unchanged.

- [ ] **Step 3: Verify nothing else references the removed keys**

Run: `grep -rn "useTranslations('nav')\|useTranslations(\"nav\")\|useTranslations('footer')\|useTranslations(\"footer\")\|useTranslations('home')\|useTranslations(\"home\")" --include="*.tsx" components app`
Expected: No matches (Header, Footer, and HomePage were the only consumers of those namespaces).

- [ ] **Step 4: Run the full test suite and type-check**

Run: `npm run test:run && npx tsc --noEmit`
Expected: All tests pass; no type errors.

- [ ] **Step 5: Commit**

```bash
git add messages/en.json messages/cs.json
git commit -m "$(cat <<'EOF'
Remove nav/footer/home keys from messages/*.json

These now live in Tina (content/global/index.json, content/home/index.json).
Other namespaces are untouched pending their own migration passes.
EOF
)"
```

---

### Task 8: Manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Starts without errors (this uses `tinacms dev -c "next dev --turbopack"`, which also serves the local Tina GraphQL API and admin UI).

- [ ] **Step 2: Compare rendered pages against the pre-migration commit**

Open `http://localhost:3000/en` and `http://localhost:3000/cs` and manually confirm: hero copy, logos, problem/solution lists, services grid, process steps, case-study teaser cards, PDF guide section, stats, testimonials (including the mobile dot navigation aria-labels via browser devtools), team bios, and the CTA section all read exactly as they did before this migration (compare against `git show HEAD~<N>:components/pages/home/HomePage.tsx` rendered output, or a browser tab on the pre-migration branch if available).

Also confirm: header nav labels, the services dropdown (desktop + mobile), the mobile menu open/close aria-labels, and footer nav/tagline/rights/social links all render correctly on both locales, and the locale-switch link still toggles between `/en` and `/cs` correctly.

- [ ] **Step 3: Verify TinaCMS admin can edit the new content**

Open `http://localhost:3000/admin` (or wherever the Tina admin build serves from), open the "Global" and "Home Page" entries, and confirm every new `cs`/`en` field renders in the form without schema errors, and that editing a field (e.g. `hero.eyebrow`) and saving updates the corresponding JSON file.

- [ ] **Step 4: Report results**

Summarize what was checked and any discrepancies found. If a discrepancy is found, stop and fix it as a follow-up step before considering this pass complete — do not proceed to a Case Studies / About / Services / Contact migration pass until Global + Home is confirmed correct.
