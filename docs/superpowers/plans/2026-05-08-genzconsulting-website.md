# GenZ Consulting Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full GenZ Consulting marketing website on top of the existing Next.js 15 + TinaCMS boilerplate, replacing all boilerplate content with GTC brand, adding bilingual routing (cs/en), and implementing conversion-focused blocks.

**Architecture:** Full TinaCMS-driven block system with next-intl for `/cs` and `/en` route-based i18n. Static UI strings live in `messages/*.json`; page content lives in `content/pages/{locale}/home.mdx`. New blocks (LogoSlider, ProblemStatement, Team) sit alongside extended existing blocks (Hero, CTA). A Next.js API route handles the Legit Check PDF email capture via Resend.

**Tech Stack:** Next.js 15, TinaCMS, Tailwind CSS v4, next-intl 3.x, Resend, Vitest + React Testing Library, Headless UI (already installed), Motion (already installed)

**Simplification vs spec:** Partners and team members are inline fields in their respective blocks (not separate TinaCMS collections). This satisfies the editable CMS requirement without added query complexity.

---

## Task 1: Install packages

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install runtime dependencies**

```bash
pnpm add next-intl resend
```

- [ ] **Step 2: Install dev/test dependencies**

```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Verify installs**

```bash
pnpm list next-intl resend vitest @testing-library/react
```

Expected: all four packages listed with versions.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add next-intl, resend, vitest, testing-library"
```

---

## Task 2: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Create vitest.config.ts**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 2: Create vitest.setup.ts**

```ts
// vitest.setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'cs',
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/cs',
  useParams: () => ({ locale: 'cs' }),
}))
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 4: Run tests (none yet, verify setup works)**

```bash
pnpm test:run
```

Expected: `No test files found` — no errors.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json
git commit -m "chore: configure vitest with jsdom and testing-library"
```

---

## Task 3: Brand foundation — Poppins font + GTC colors

**Files:**
- Modify: `app/layout.tsx`
- Modify: `styles.css`

- [ ] **Step 1: Replace fonts in app/layout.tsx**

Replace the entire file:

```tsx
// app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { VideoDialogProvider } from '@/components/ui/VideoDialogContext';
import VideoDialog from '@/components/ui/VideoDialog';
import '@/styles.css';
import { TailwindIndicator } from '@/components/ui/breakpoint-indicator';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'GenZ Consulting',
  description: 'Pomáháme firmám komunikovat s generací Z.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={poppins.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <VideoDialogProvider>
          {children}
          <VideoDialog />
        </VideoDialogProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Add GTC brand tokens to styles.css**

In `styles.css`, inside the `@theme inline { }` block, append after the last `--color-*` line:

```css
  --font-sans: var(--font-poppins);
  --color-gtc-primary: #5ce1e6;
  --color-gtc-dark: #007879;
  --color-gtc-mid: #00a8aa;
  --color-gtc-deep: #054247;
  --color-gtc-accent: #12b3c4;
```

Also update the `:root` block — change `--primary` to the GTC teal so buttons inherit the brand color:

```css
  --primary: oklch(0.85 0.12 197);
  --primary-foreground: oklch(0.145 0 0);
```

- [ ] **Step 3: Start dev server and confirm Poppins loads**

```bash
pnpm dev
```

Open http://localhost:3000 and inspect: body font-family should show Poppins. Buttons should now render in teal. Stop server.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx styles.css
git commit -m "feat: Poppins font + GTC brand colors"
```

---

## Task 4: next-intl routing setup

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create i18n/routing.ts**

```ts
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['cs', 'en'] as const,
  defaultLocale: 'cs',
});

export type Locale = (typeof routing.locales)[number];
```

- [ ] **Step 2: Create i18n/request.ts**

```ts
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create middleware.ts**

```ts
// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|_vercel|admin|api|.*\\..*).*)'],
};
```

- [ ] **Step 4: Wrap next.config.ts with next-intl plugin**

Replace the entire `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.tina.io', port: '' },
      { protocol: 'https', hostname: 'res.cloudinary.com', port: '' },
    ],
  },
  async headers() {
    const headers = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
    ];
    return [{ source: '/(.*)', headers }];
  },
  async rewrites() {
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 5: Commit**

```bash
git add i18n/routing.ts i18n/request.ts middleware.ts next.config.ts
git commit -m "feat: next-intl routing setup (cs/en)"
```

---

## Task 5: Restructure app/ for [locale] routing

**Files:**
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`
- Create: `app/[locale]/not-found.tsx`
- Create: `app/[locale]/[...urlSegments]/page.tsx`
- Create: `app/[locale]/[...urlSegments]/client-page.tsx`
- Delete: `app/page.tsx`, `app/not-found.tsx`, `app/[...urlSegments]/page.tsx`, `app/[...urlSegments]/client-page.tsx`, `app/posts/` (entire directory)

- [ ] **Step 1: Create app/[locale]/layout.tsx**

```tsx
// app/[locale]/layout.tsx
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 2: Create app/[locale]/page.tsx**

```tsx
// app/[locale]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import ClientPage from '@/app/[locale]/[...urlSegments]/client-page';

export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let data;
  try {
    data = await client.queries.page({ relativePath: `${locale}/home.mdx` });
  } catch {
    notFound();
  }
  return (
    <Layout rawPageData={data}>
      <ClientPage {...data} />
    </Layout>
  );
}
```

- [ ] **Step 3: Copy and adapt client-page.tsx**

Copy `app/[...urlSegments]/client-page.tsx` to `app/[locale]/[...urlSegments]/client-page.tsx` — no changes needed (it's a pure TinaCMS client component).

```bash
cp app/\[...urlSegments\]/client-page.tsx app/\[locale\]/\[...urlSegments\]/client-page.tsx
```

- [ ] **Step 4: Create app/[locale]/[...urlSegments]/page.tsx**

```tsx
// app/[locale]/[...urlSegments]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import { Section } from '@/components/layout/section';
import ClientPage from './client-page';

export const revalidate = 300;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; urlSegments: string[] }>;
}) {
  const { locale, urlSegments } = await params;
  const filepath = urlSegments.join('/');
  let data;
  try {
    data = await client.queries.page({ relativePath: `${locale}/${filepath}.mdx` });
  } catch {
    notFound();
  }
  return (
    <Layout rawPageData={data}>
      <Section>
        <ClientPage {...data} />
      </Section>
    </Layout>
  );
}

export async function generateStaticParams() {
  let pages = await client.queries.pageConnection();
  const allPages = pages;

  if (!allPages.data.pageConnection.edges) return [];

  while (pages.data.pageConnection.pageInfo.hasNextPage) {
    pages = await client.queries.pageConnection({
      after: pages.data.pageConnection.pageInfo.endCursor,
    });
    if (!pages.data.pageConnection.edges) break;
    allPages.data.pageConnection.edges.push(...pages.data.pageConnection.edges);
  }

  return (allPages.data?.pageConnection.edges ?? [])
    .map((edge) => {
      const [locale, ...rest] = edge?.node?._sys.breadcrumbs ?? [];
      return { locale, urlSegments: rest };
    })
    .filter(({ urlSegments }) => urlSegments.length >= 1)
    .filter(({ urlSegments }) => !urlSegments.every((s) => s === 'home'));
}
```

- [ ] **Step 5: Create app/[locale]/not-found.tsx**

```tsx
// app/[locale]/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-muted-foreground">Stránka nenalezena.</p>
    </div>
  );
}
```

- [ ] **Step 6: Remove old boilerplate routes**

```bash
rm app/page.tsx app/not-found.tsx
rm -rf app/\[...urlSegments\]
rm -rf app/posts
```

- [ ] **Step 7: Start dev server and verify routing**

```bash
pnpm dev
```

- Visit http://localhost:3000 — should redirect to http://localhost:3000/cs
- Visit http://localhost:3000/en — should load English route (will 404 until content files exist — that's fine)
- Stop server.

- [ ] **Step 8: Commit**

```bash
git add app/
git commit -m "feat: restructure app/ for next-intl [locale] routing"
```

---

## Task 6: Update TinaCMS — remove boilerplate, update Page collection

**Files:**
- Modify: `tina/config.tsx`
- Modify: `tina/collection/page.ts`
- Delete: `tina/collection/post.tsx`, `tina/collection/author.ts`, `tina/collection/tag.ts`
- Delete: `content/posts/` (directory), `content/authors/` (directory), `content/tags/` (directory)

- [ ] **Step 1: Update tina/collection/page.ts for locale routing**

Replace the `ui.router` in `tina/collection/page.ts`:

```ts
import type { Collection } from 'tinacms';
import { heroBlockSchema } from '@/components/blocks/hero';
import { contentBlockSchema } from '@/components/blocks/content';
import { testimonialBlockSchema } from '@/components/blocks/testimonial';
import { featureBlockSchema } from '@/components/blocks/features';
import { statsBlockSchema } from '@/components/blocks/stats';
import { ctaBlockSchema } from '@/components/blocks/call-to-action';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const [locale, ...rest] = document._sys.breadcrumbs;
      const filepath = rest.join('/');
      if (filepath === 'home') {
        return `/${locale}`;
      }
      return `/${locale}/${filepath}`;
    },
  },
  fields: [
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Sections',
      ui: { visualSelector: true },
      templates: [
        heroBlockSchema,
        featureBlockSchema,
        statsBlockSchema,
        ctaBlockSchema,
        contentBlockSchema,
        testimonialBlockSchema,
      ],
    },
  ],
};

export default Page;
```

Note: `videoBlockSchema` and `calloutBlockSchema` removed (boilerplate-only). New block schemas will be added in Task 18.

- [ ] **Step 2: Update tina/config.tsx — remove boilerplate collections**

```tsx
// tina/config.tsx
import { defineConfig } from 'tinacms';
import nextConfig from '../next.config';
import Global from './collection/global';
import Page from './collection/page';

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
    basePath: nextConfig.basePath?.replace(/^\//, '') || '',
  },
  schema: {
    collections: [Page, Global],
  },
});

export default config;
```

- [ ] **Step 3: Remove boilerplate collection files**

```bash
rm tina/collection/post.tsx tina/collection/author.ts tina/collection/tag.ts
rm -rf content/posts content/authors content/tags
```

- [ ] **Step 4: Create content/pages/cs/ and content/pages/en/ directories**

```bash
mkdir -p content/pages/cs content/pages/en
```

- [ ] **Step 5: Move existing home.mdx and about.mdx to cs/**

```bash
mv content/pages/home.mdx content/pages/cs/home.mdx
mv content/pages/about.mdx content/pages/cs/about.mdx 2>/dev/null || true
```

- [ ] **Step 6: Commit**

```bash
git add tina/ content/
git commit -m "feat: update TinaCMS schema — locale routing, remove boilerplate collections"
```

---

## Task 7: Update Global TinaCMS collection + content/global/index.json

**Files:**
- Modify: `tina/collection/global.ts`
- Modify: `content/global/index.json`

- [ ] **Step 1: Update global.ts — add footer contact fields, remove font/theme picker**

Replace `tina/collection/global.ts`:

```ts
// tina/collection/global.ts
import type { Collection } from 'tinacms';
import { iconSchema } from '../fields/icon';

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
        {
          type: 'string',
          label: 'Site Name',
          name: 'name',
        },
        {
          type: 'string',
          label: 'Calendly URL',
          name: 'calendlyUrl',
          description: 'Full Calendly booking URL, e.g. https://calendly.com/adam-dalecky/30min',
        },
        {
          type: 'object',
          label: 'Nav Links',
          name: 'nav',
          list: true,
          ui: {
            itemProps: (item) => ({ label: item?.label }),
            defaultItem: { href: '#services', label: 'Služby' },
          },
          fields: [
            { type: 'string', label: 'Link', name: 'href' },
            { type: 'string', label: 'Label', name: 'label' },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Footer',
      name: 'footer',
      fields: [
        {
          type: 'string',
          label: 'Phone',
          name: 'phone',
        },
        {
          type: 'string',
          label: 'Email',
          name: 'email',
        },
        {
          type: 'object',
          label: 'Social Links',
          name: 'social',
          list: true,
          ui: {
            itemProps: (item) => ({ label: item?.icon?.name || 'Link' }),
          },
          fields: [
            iconSchema as any,
            { type: 'string', label: 'URL', name: 'url' },
          ],
        },
      ],
    },
  ],
};

export default Global;
```

- [ ] **Step 2: Update content/global/index.json**

Replace with GTC data:

```json
{
  "header": {
    "name": "GenZ Consulting",
    "calendlyUrl": "https://calendly.com/adam-dalecky",
    "nav": [
      { "href": "#services", "label": "Služby" },
      { "href": "#team", "label": "Tým" },
      { "href": "#contact", "label": "Kontakt" }
    ]
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
      }
    ]
  }
}
```

- [ ] **Step 3: Update layout-context.tsx to remove theme/font logic**

Read `components/layout/layout-context.tsx` first. Remove any font-switching or dark-mode-switching logic that reads from `globalSettings.theme`. The font is now fixed (Poppins) and dark mode is not used.

- [ ] **Step 4: Commit**

```bash
git add tina/collection/global.ts content/global/index.json components/layout/layout-context.tsx
git commit -m "feat: update Global TinaCMS collection with GTC contact data"
```

---

## Task 8: Static UI strings

**Files:**
- Create: `messages/cs.json`
- Create: `messages/en.json`

- [ ] **Step 1: Create messages/cs.json**

```json
{
  "nav": {
    "bookCall": "Booknout call",
    "services": "Služby",
    "team": "Tým",
    "contact": "Kontakt"
  },
  "hero": {
    "primaryCta": "Booknout konzultaci",
    "secondaryCta": "Stáhnout Legit Check"
  },
  "leadMagnet": {
    "title": "Získejte Legit Check zdarma",
    "description": "Zadejte svůj e-mail a my vám pošleme průvodce, jak vypadá skutečně funkční employer brand pro Gen Z.",
    "emailPlaceholder": "vas@email.cz",
    "submit": "Chci průvodce",
    "submitting": "Posíláme...",
    "successTitle": "Hotovo! Průvodce je na cestě.",
    "successDescription": "Zkontrolujte svůj e-mail.",
    "downloadButton": "Stáhnout PDF",
    "errorGeneric": "Něco se pokazilo. Zkuste to prosím znovu.",
    "errorInvalidEmail": "Zadejte platnou e-mailovou adresu."
  },
  "footer": {
    "rights": "Všechna práva vyhrazena."
  }
}
```

- [ ] **Step 2: Create messages/en.json**

```json
{
  "nav": {
    "bookCall": "Book a call",
    "services": "Services",
    "team": "Team",
    "contact": "Contact"
  },
  "hero": {
    "primaryCta": "Book a consultation",
    "secondaryCta": "Download Legit Check"
  },
  "leadMagnet": {
    "title": "Get the Legit Check for free",
    "description": "Enter your email and we'll send you a guide on what a truly effective employer brand for Gen Z looks like.",
    "emailPlaceholder": "you@company.com",
    "submit": "Send me the guide",
    "submitting": "Sending...",
    "successTitle": "Done! The guide is on its way.",
    "successDescription": "Check your inbox.",
    "downloadButton": "Download PDF",
    "errorGeneric": "Something went wrong. Please try again.",
    "errorInvalidEmail": "Please enter a valid email address."
  },
  "footer": {
    "rights": "All rights reserved."
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add messages/
git commit -m "feat: add cs/en UI string messages"
```

---

## Task 9: API route — /api/legit-check

**Files:**
- Create: `lib/email.ts` (validation utility)
- Create: `app/api/legit-check/route.ts`
- Create: `tests/api/legit-check.test.ts`
- Add: `public/downloads/` directory (for PDF placeholder)

- [ ] **Step 1: Write failing tests**

Create `tests/api/legit-check.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
    },
  })),
}))

// Import AFTER mock
const importRoute = () => import('@/app/api/legit-check/route')

describe('POST /api/legit-check', () => {
  it('returns 400 for missing email', async () => {
    const { POST } = await importRoute()
    const req = new Request('http://localhost/api/legit-check', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it('returns 400 for invalid email format', async () => {
    const { POST } = await importRoute()
    const req = new Request('http://localhost/api/legit-check', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 with downloadUrl for valid email', async () => {
    const { POST } = await importRoute()
    const req = new Request('http://localhost/api/legit-check', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.downloadUrl).toBe('/downloads/legit-check.pdf')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run tests/api/legit-check.test.ts
```

Expected: FAIL — `Cannot find module '@/app/api/legit-check/route'`

- [ ] **Step 3: Create lib/email.ts**

```ts
// lib/email.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

- [ ] **Step 4: Create app/api/legit-check/route.ts**

```ts
// app/api/legit-check/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isValidEmail } from '@/lib/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email } = body;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  await resend.emails.send({
    from: 'GenZ Consulting <noreply@genzconsulting.cz>',
    to: 'adam.dalecky@genzconsulting.cz',
    subject: `Nový lead: Legit Check — ${email}`,
    text: `Někdo stáhl Legit Check:\n\nE-mail: ${email}\nDatum: ${new Date().toISOString()}`,
  });

  return NextResponse.json({ downloadUrl: '/downloads/legit-check.pdf' });
}
```

- [ ] **Step 5: Create PDF placeholder**

```bash
mkdir -p public/downloads
echo "PDF placeholder — replace with actual legit-check.pdf" > public/downloads/legit-check.pdf
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
pnpm test:run tests/api/legit-check.test.ts
```

Expected: all 3 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/email.ts app/api/ tests/api/ public/downloads/
git commit -m "feat: /api/legit-check route with email capture and Resend notification"
```

---

## Task 10: CalendlyButton component

**Files:**
- Create: `components/ui/CalendlyButton.tsx`
- Create: `types/calendly.d.ts`
- Create: `tests/components/CalendlyButton.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/CalendlyButton.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalendlyButton } from '@/components/ui/CalendlyButton'

describe('CalendlyButton', () => {
  it('renders with the provided label', () => {
    render(<CalendlyButton url="https://calendly.com/test" label="Book a call" />)
    expect(screen.getByRole('button', { name: 'Book a call' })).toBeInTheDocument()
  })

  it('loads Calendly script on first click', () => {
    const appendChildSpy = vi.spyOn(document.head, 'appendChild')
    render(<CalendlyButton url="https://calendly.com/test" label="Book a call" />)
    fireEvent.click(screen.getByRole('button'))
    expect(appendChildSpy).toHaveBeenCalled()
    appendChildSpy.mockRestore()
  })

  it('calls initPopupWidget when Calendly already loaded', () => {
    const mockInitPopup = vi.fn()
    ;(window as any).Calendly = { initPopupWidget: mockInitPopup }
    render(<CalendlyButton url="https://calendly.com/test" label="Book a call" />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockInitPopup).toHaveBeenCalledWith({ url: 'https://calendly.com/test' })
    delete (window as any).Calendly
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run tests/components/CalendlyButton.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create types/calendly.d.ts**

```ts
// types/calendly.d.ts
interface CalendlyWidget {
  initPopupWidget: (options: { url: string }) => void;
}

interface Window {
  Calendly?: CalendlyWidget;
}
```

- [ ] **Step 4: Create CalendlyButton.tsx**

```tsx
// components/ui/CalendlyButton.tsx
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

interface CalendlyButtonProps {
  url: string;
  label: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

function loadCalendlyScript(url: string) {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url });
    return;
  }
  const link = document.createElement('link');
  link.href = 'https://assets.calendly.com/assets/external/widget.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.onload = () => window.Calendly?.initPopupWidget({ url });
  document.head.appendChild(script);
}

export function CalendlyButton({
  url,
  label,
  variant = 'default',
  size = 'lg',
  className,
}: CalendlyButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => loadCalendlyScript(url)}
    >
      {label}
    </Button>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pnpm test:run tests/components/CalendlyButton.test.tsx
```

Expected: all 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add components/ui/CalendlyButton.tsx types/calendly.d.ts tests/components/CalendlyButton.test.tsx
git commit -m "feat: CalendlyButton component with lazy script loading"
```

---

## Task 11: LeadMagnetModal component

**Files:**
- Create: `components/ui/LeadMagnetModal.tsx`
- Create: `tests/components/LeadMagnetModal.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/LeadMagnetModal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeadMagnetModal } from '@/components/ui/LeadMagnetModal'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('LeadMagnetModal', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('shows email input when open', () => {
    render(<LeadMagnetModal isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    render(<LeadMagnetModal isOpen={true} onClose={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'bad-email')
    fireEvent.click(screen.getByRole('button', { name: /chci|send/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('shows download link on successful submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ downloadUrl: '/downloads/legit-check.pdf' }),
    })
    render(<LeadMagnetModal isOpen={true} onClose={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com')
    fireEvent.click(screen.getByRole('button', { name: /chci|send/i }))
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /stáhnout|download/i })).toBeInTheDocument()
    })
  })

  it('shows error message when API fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) })
    render(<LeadMagnetModal isOpen={true} onClose={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com')
    fireEvent.click(screen.getByRole('button', { name: /chci|send/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run tests/components/LeadMagnetModal.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create LeadMagnetModal.tsx**

```tsx
// components/ui/LeadMagnetModal.tsx
'use client';
import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { isValidEmail } from '@/lib/email';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function LeadMagnetModal({ isOpen, onClose }: LeadMagnetModalProps) {
  const t = useTranslations('leadMagnet');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMsg(t('errorInvalidEmail'));
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/legit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDownloadUrl(data.downloadUrl);
      setStatus('success');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          role="dialog"
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        >
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold">{t('title')}</DialogTitle>
            <button onClick={onClose} aria-label="Close" className="ml-4 text-muted-foreground">
              <X className="size-5" />
            </button>
          </div>
          <Description className="mt-2 text-sm text-muted-foreground">
            {t('description')}
          </Description>

          {status === 'success' ? (
            <div className="mt-6 text-center">
              <p className="font-semibold">{t('successTitle')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('successDescription')}</p>
              <a
                href={downloadUrl}
                download
                className="mt-4 inline-block rounded-xl bg-gtc-primary px-6 py-3 font-semibold text-black"
              >
                {t('downloadButton')}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="lead-email" className="sr-only">
                  Email
                </label>
                <input
                  id="lead-email"
                  type="email"
                  aria-label="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder={t('emailPlaceholder')}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gtc-primary"
                  required
                />
                {status === 'error' && (
                  <p role="alert" className="mt-1 text-sm text-destructive">
                    {errorMsg}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? t('submitting') : t('submit')}
              </Button>
            </form>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test:run tests/components/LeadMagnetModal.test.tsx
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/LeadMagnetModal.tsx tests/components/LeadMagnetModal.test.tsx
git commit -m "feat: LeadMagnetModal with email capture and PDF download"
```

---

## Task 12: LogoSlider block

**Files:**
- Create: `components/blocks/logo-slider.tsx`

- [ ] **Step 1: Create logo-slider.tsx**

```tsx
// components/blocks/logo-slider.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import type { PageBlocksLogoSlider } from '@/tina/__generated__/types';
import { Section } from '../layout/section';
import { InfiniteSlider } from '../ui/infinite-slider';

export const LogoSlider = ({ data }: { data: PageBlocksLogoSlider }) => {
  return (
    <Section background={data.background ?? ''}>
      {data.title && (
        <p
          className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground"
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title}
        </p>
      )}
      <InfiniteSlider gap={48} duration={30}>
        {data.logos?.map((logo, i) => (
          <div key={i} className="flex items-center justify-center px-4">
            {logo?.image ? (
              <Image
                src={logo.image}
                alt={logo.name ?? ''}
                width={120}
                height={48}
                className="h-10 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0"
                data-tina-field={tinaField(logo, 'image')}
              />
            ) : (
              <span className="text-sm font-medium text-muted-foreground">{logo?.name}</span>
            )}
          </div>
        ))}
      </InfiniteSlider>
    </Section>
  );
};

export const logoSliderBlockSchema: Template = {
  name: 'logoSlider',
  label: 'Logo Slider',
  ui: {
    previewSrc: '/blocks/logo-slider.png',
    defaultItem: {
      title: 'Spolupracovali jsme s',
      logos: [{ name: 'Partner' }],
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Background',
      name: 'background',
    },
    {
      type: 'string',
      label: 'Title',
      name: 'title',
    },
    {
      type: 'object',
      label: 'Logos',
      name: 'logos',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name || 'Logo' }),
        defaultItem: { name: 'Company Name' },
      },
      fields: [
        { type: 'string', label: 'Company Name', name: 'name' },
        { type: 'image', label: 'Logo Image', name: 'image' },
        { type: 'string', label: 'Website URL', name: 'url' },
      ],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/logo-slider.tsx
git commit -m "feat: LogoSlider block with InfiniteSlider and grayscale logos"
```

---

## Task 13: ProblemStatement block

**Files:**
- Create: `components/blocks/problem-statement.tsx`

- [ ] **Step 1: Create problem-statement.tsx**

```tsx
// components/blocks/problem-statement.tsx
'use client';
import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import type { PageBlocksProblemStatement } from '@/tina/__generated__/types';
import { Section } from '../layout/section';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

export const ProblemStatement = ({ data }: { data: PageBlocksProblemStatement }) => {
  return (
    <Section background={data.background ?? 'bg-gtc-deep'}>
      <div className="mx-auto max-w-6xl">
        {data.eyebrow && (
          <p
            className="mb-6 text-sm font-semibold uppercase tracking-widest text-gtc-primary"
            data-tina-field={tinaField(data, 'eyebrow')}
          >
            {data.eyebrow}
          </p>
        )}

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            className="prose prose-invert max-w-none"
            data-tina-field={tinaField(data, 'problem')}
          >
            {data.problem && <TinaMarkdown content={data.problem} />}
          </div>
          <div
            className="prose prose-invert max-w-none"
            data-tina-field={tinaField(data, 'solution')}
          >
            {data.solution && <TinaMarkdown content={data.solution} />}
          </div>
        </div>

        {data.quote && (
          <blockquote
            className="mt-16 border-l-4 border-gtc-primary pl-6 text-2xl font-semibold italic text-white"
            data-tina-field={tinaField(data, 'quote')}
          >
            {data.quote}
          </blockquote>
        )}
      </div>
    </Section>
  );
};

export const problemStatementBlockSchema: Template = {
  name: 'problemStatement',
  label: 'Problem Statement',
  ui: {
    defaultItem: {
      eyebrow: 'Proč to nefunguje',
      background: 'bg-gtc-deep',
    },
  },
  fields: [
    { type: 'string', label: 'Background', name: 'background' },
    { type: 'string', label: 'Eyebrow Label', name: 'eyebrow' },
    {
      type: 'rich-text',
      label: 'Problem (left column)',
      name: 'problem',
    },
    {
      type: 'rich-text',
      label: 'Solution (right column)',
      name: 'solution',
    },
    {
      type: 'string',
      label: 'Pull Quote',
      name: 'quote',
      ui: { component: 'textarea' },
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/problem-statement.tsx
git commit -m "feat: ProblemStatement block with two-column layout"
```

---

## Task 14: Team block

**Files:**
- Create: `components/blocks/team.tsx`

- [ ] **Step 1: Create team.tsx**

```tsx
// components/blocks/team.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import type { PageBlocksTeam } from '@/tina/__generated__/types';
import { Section } from '../layout/section';
import { FaLinkedin } from 'react-icons/fa6';

export const Team = ({ data }: { data: PageBlocksTeam }) => {
  const core = data.members?.filter((m) => !m?.isMentor) ?? [];
  const mentors = data.members?.filter((m) => m?.isMentor) ?? [];

  return (
    <Section id="team" background={data.background ?? ''}>
      <div className="mx-auto max-w-6xl">
        {data.title && (
          <h2
            className="mb-4 text-balance text-4xl font-bold lg:text-5xl"
            data-tina-field={tinaField(data, 'title')}
          >
            {data.title}
          </h2>
        )}
        {data.description && (
          <p
            className="mb-12 max-w-2xl text-muted-foreground"
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description}
          </p>
        )}

        {/* Core team */}
        <div className="grid gap-8 sm:grid-cols-2">
          {core.map((member, i) => (
            <div
              key={i}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
              data-tina-field={tinaField(member)}
            >
              {member?.photo && (
                <Image
                  src={member.photo}
                  alt={member.name ?? ''}
                  width={120}
                  height={120}
                  className="h-28 w-28 rounded-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                />
              )}
              <div>
                <p className="text-lg font-semibold">{member?.name}</p>
                <p className="text-sm text-muted-foreground">{member?.role}</p>
                {member?.bio && <p className="mt-2 text-sm">{member.bio}</p>}
                {member?.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gtc-dark hover:text-gtc-primary"
                  >
                    <FaLinkedin className="size-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mentors */}
        {mentors.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-8 text-xl font-semibold text-muted-foreground">Mentoři a partneři</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {mentors.map((mentor, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center"
                  data-tina-field={tinaField(mentor)}
                >
                  {mentor?.photo && (
                    <Image
                      src={mentor.photo}
                      alt={mentor.name ?? ''}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover grayscale"
                    />
                  )}
                  <p className="text-sm font-semibold">{mentor?.name}</p>
                  <p className="text-xs text-muted-foreground">{mentor?.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export const teamBlockSchema: Template = {
  name: 'team',
  label: 'Team',
  ui: {
    defaultItem: {
      title: 'Náš tým',
      description: 'Lidé za GenZ Consulting.',
    },
  },
  fields: [
    { type: 'string', label: 'Background', name: 'background' },
    { type: 'string', label: 'Title', name: 'title' },
    {
      type: 'string',
      label: 'Description',
      name: 'description',
      ui: { component: 'textarea' },
    },
    {
      type: 'object',
      label: 'Members',
      name: 'members',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name || 'Member' }),
        defaultItem: { name: 'Jméno', role: 'Role', isMentor: false },
      },
      fields: [
        { type: 'string', label: 'Name', name: 'name' },
        { type: 'string', label: 'Role', name: 'role' },
        { type: 'string', label: 'Bio', name: 'bio', ui: { component: 'textarea' } },
        { type: 'image', label: 'Photo', name: 'photo' },
        { type: 'string', label: 'LinkedIn URL', name: 'linkedin' },
        { type: 'boolean', label: 'Is Mentor', name: 'isMentor' },
      ],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/team.tsx
git commit -m "feat: Team block with core team and mentor grid"
```

---

## Task 15: Extend Hero block with Calendly + PDF CTAs

**Files:**
- Modify: `components/blocks/hero.tsx`

The Hero block needs two new action types: `calendly` (opens Calendly popup) and `leadMagnet` (opens PDF modal). The existing `actions` field will be extended with a new `type` option. The `Hero` component becomes a client component to manage modal state.

- [ ] **Step 1: Update hero.tsx**

Replace `components/blocks/hero.tsx` with:

```tsx
// components/blocks/hero.tsx
'use client';
import { iconSchema } from '@/tina/fields/icon';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import type { PageBlocksHero, PageBlocksHeroImage } from '../../tina/__generated__/types';
import { Icon } from '../icon';
import { Section, sectionBlockSchemaField } from '../layout/section';
import { AnimatedGroup } from '../motion-primitives/animated-group';
import { TextEffect } from '../motion-primitives/text-effect';
import { Button } from '../ui/button';
import { CalendlyButton } from '../ui/CalendlyButton';
import { LeadMagnetModal } from '../ui/LeadMagnetModal';
import HeroVideoDialog from '../ui/hero-video-dialog';
import type { Transition } from 'motion/react';
import { useLayout } from '../layout/layout-context';

const transitionVariants = {
  container: {
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } },
  },
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 1.5 } as Transition,
    },
  },
};

export const Hero = ({ data }: { data: PageBlocksHero }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { globalSettings } = useLayout();
  const calendlyUrl = globalSettings?.header?.calendlyUrl ?? '';

  return (
    <Section background={data.background!}>
      <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
        {data.headline && (
          <div data-tina-field={tinaField(data, 'headline')}>
            <TextEffect preset="fade-in-blur" speedSegment={0.3} as="h1" className="mt-8 text-balance text-6xl md:text-7xl xl:text-[5.25rem]">
              {data.headline!}
            </TextEffect>
          </div>
        )}
        {data.tagline && (
          <div data-tina-field={tinaField(data, 'tagline')}>
            <TextEffect per="line" preset="fade-in-blur" speedSegment={0.3} delay={0.5} as="p" className="mx-auto mt-8 max-w-2xl text-balance text-lg">
              {data.tagline!}
            </TextEffect>
          </div>
        )}

        <AnimatedGroup variants={transitionVariants} className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
          {data.actions?.map((action) => {
            if (action!.type === 'calendly') {
              return (
                <div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                  <CalendlyButton url={calendlyUrl} label={action!.label!} />
                </div>
              );
            }
            if (action!.type === 'leadMagnet') {
              return (
                <div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                  <Button size="lg" variant="ghost" className="rounded-xl px-5 text-base" onClick={() => setModalOpen(true)}>
                    {action!.label}
                  </Button>
                </div>
              );
            }
            return (
              <div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                <Button asChild size="lg" variant={action!.type === 'link' ? 'ghost' : 'default'} className="rounded-xl px-5 text-base">
                  <Link href={action!.link!}>
                    {action?.icon && <Icon data={action?.icon} />}
                    <span className="text-nowrap">{action!.label}</span>
                  </Link>
                </Button>
              </div>
            );
          })}
        </AnimatedGroup>
      </div>

      {data.image && (
        <AnimatedGroup variants={transitionVariants}>
          <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20 max-w-full" data-tina-field={tinaField(data, 'image')}>
            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
              <ImageBlock image={data.image} />
            </div>
          </div>
        </AnimatedGroup>
      )}

      <LeadMagnetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Section>
  );
};

const ImageBlock = ({ image }: { image: PageBlocksHeroImage }) => {
  if (image.videoUrl) {
    const embedPrefix = '/embed/';
    const idx = image.videoUrl.indexOf(embedPrefix);
    const videoId = idx !== -1 ? image.videoUrl.substring(idx + embedPrefix.length).split('?')[0] : '';
    const thumbnailSrc = image.src ?? (videoId ? `https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg` : '');
    return <HeroVideoDialog videoSrc={image.videoUrl} thumbnailSrc={thumbnailSrc} thumbnailAlt="Hero Video" />;
  }
  if (image.src) {
    return (
      <Image
        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border max-w-full h-auto"
        alt={image.alt || ''}
        src={image.src}
        height={4000}
        width={3000}
      />
    );
  }
  return null;
};

export const heroBlockSchema: Template = {
  name: 'hero',
  label: 'Hero',
  ui: {
    previewSrc: '/blocks/hero.png',
    defaultItem: {
      headline: 'Generace Z není komplikovaná.',
      tagline: 'Pomáháme firmám komunikovat s generací, která vyrostla online.',
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    { type: 'string', label: 'Headline', name: 'headline' },
    { type: 'string', label: 'Tagline', name: 'tagline' },
    {
      label: 'Actions',
      name: 'actions',
      type: 'object',
      list: true,
      ui: {
        defaultItem: { label: 'Booknout call', type: 'calendly' },
        itemProps: (item) => ({ label: item.label }),
      },
      fields: [
        { label: 'Label', name: 'label', type: 'string' },
        {
          label: 'Type',
          name: 'type',
          type: 'string',
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Link', value: 'link' },
            { label: 'Calendly Popup', value: 'calendly' },
            { label: 'Lead Magnet (PDF)', value: 'leadMagnet' },
          ],
        },
        iconSchema as any,
        { label: 'Link', name: 'link', type: 'string' },
      ],
    },
    {
      type: 'object',
      label: 'Image',
      name: 'image',
      fields: [
        { name: 'src', label: 'Image Source', type: 'image' },
        { name: 'alt', label: 'Alt Text', type: 'string' },
        { name: 'videoUrl', label: 'Video URL', type: 'string' },
      ],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/hero.tsx
git commit -m "feat: extend Hero block with Calendly and LeadMagnet action types"
```

---

## Task 16: Extend CTA block with Calendly + PDF CTAs

**Files:**
- Modify: `components/blocks/call-to-action.tsx`

- [ ] **Step 1: Update call-to-action.tsx**

Replace the render function to support `calendly` and `leadMagnet` action types (same pattern as Hero):

```tsx
// components/blocks/call-to-action.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { iconSchema } from '@/tina/fields/icon';
import { Button } from '@/components/ui/button';
import type { PageBlocksCta } from '@/tina/__generated__/types';
import { Icon } from '../icon';
import { Section } from '../layout/section';
import { CalendlyButton } from '../ui/CalendlyButton';
import { LeadMagnetModal } from '../ui/LeadMagnetModal';
import { useLayout } from '../layout/layout-context';

export const CallToAction = ({ data }: { data: PageBlocksCta }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { globalSettings } = useLayout();
  const calendlyUrl = globalSettings?.header?.calendlyUrl ?? '';

  return (
    <Section id="contact" background={data.background ?? 'bg-gtc-deep'}>
      <div className="text-center">
        <h2 className="text-balance text-4xl font-semibold text-white lg:text-5xl" data-tina-field={tinaField(data, 'title')}>
          {data.title}
        </h2>
        <p className="mt-4 text-gtc-primary" data-tina-field={tinaField(data, 'description')}>
          {data.description}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {data.actions?.map((action) => {
            if (action!.type === 'calendly') {
              return (
                <div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                  <CalendlyButton url={calendlyUrl} label={action!.label!} />
                </div>
              );
            }
            if (action!.type === 'leadMagnet') {
              return (
                <div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                  <Button size="lg" variant="ghost" className="rounded-xl px-5 text-base text-white" onClick={() => setModalOpen(true)}>
                    {action!.label}
                  </Button>
                </div>
              );
            }
            return (
              <div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                <Button asChild size="lg" variant={action!.type === 'link' ? 'ghost' : 'default'} className="rounded-xl px-5 text-base">
                  <Link href={action!.link!}>
                    {action?.icon && <Icon data={action?.icon} />}
                    <span className="text-nowrap">{action!.label}</span>
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <LeadMagnetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Section>
  );
};

export const ctaBlockSchema: Template = {
  name: 'cta',
  label: 'CTA',
  ui: {
    previewSrc: '/blocks/cta.png',
    defaultItem: {
      title: 'Připraveni začít?',
      description: 'Rezervujte si nezávazný call nebo stáhněte náš Legit Check zdarma.',
      background: 'bg-gtc-deep',
      actions: [
        { label: 'Booknout call', type: 'calendly' },
        { label: 'Stáhnout Legit Check', type: 'leadMagnet' },
      ],
    },
  },
  fields: [
    { type: 'string', label: 'Background', name: 'background' },
    { type: 'string', label: 'Title', name: 'title' },
    { type: 'string', label: 'Description', name: 'description', ui: { component: 'textarea' } },
    {
      label: 'Actions',
      name: 'actions',
      type: 'object',
      list: true,
      ui: {
        defaultItem: { label: 'Action', type: 'calendly' },
        itemProps: (item) => ({ label: item.label }),
      },
      fields: [
        { label: 'Label', name: 'label', type: 'string' },
        {
          label: 'Type',
          name: 'type',
          type: 'string',
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Link', value: 'link' },
            { label: 'Calendly Popup', value: 'calendly' },
            { label: 'Lead Magnet (PDF)', value: 'leadMagnet' },
          ],
        },
        iconSchema as any,
        { label: 'Link', name: 'link', type: 'string' },
      ],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/call-to-action.tsx
git commit -m "feat: extend CTA block with Calendly and LeadMagnet action types"
```

---

## Task 17: Register all new blocks in TinaCMS Page collection

**Files:**
- Modify: `tina/collection/page.ts`

- [ ] **Step 1: Update page.ts to include all new block schemas**

```ts
// tina/collection/page.ts
import type { Collection } from 'tinacms';
import { heroBlockSchema } from '@/components/blocks/hero';
import { contentBlockSchema } from '@/components/blocks/content';
import { testimonialBlockSchema } from '@/components/blocks/testimonial';
import { featureBlockSchema } from '@/components/blocks/features';
import { statsBlockSchema } from '@/components/blocks/stats';
import { ctaBlockSchema } from '@/components/blocks/call-to-action';
import { logoSliderBlockSchema } from '@/components/blocks/logo-slider';
import { problemStatementBlockSchema } from '@/components/blocks/problem-statement';
import { teamBlockSchema } from '@/components/blocks/team';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const [locale, ...rest] = document._sys.breadcrumbs;
      const filepath = rest.join('/');
      if (filepath === 'home') {
        return `/${locale}`;
      }
      return `/${locale}/${filepath}`;
    },
  },
  fields: [
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Sections',
      ui: { visualSelector: true },
      templates: [
        heroBlockSchema,
        logoSliderBlockSchema,
        problemStatementBlockSchema,
        featureBlockSchema,
        statsBlockSchema,
        testimonialBlockSchema,
        teamBlockSchema,
        ctaBlockSchema,
        contentBlockSchema,
      ],
    },
  ],
};

export default Page;
```

- [ ] **Step 2: Register new block renderers in blocks/index.tsx**

Open `components/blocks/index.tsx` and add the new blocks to the renderer map:

```tsx
// Add these imports at the top:
import { LogoSlider } from './logo-slider';
import { ProblemStatement } from './problem-statement';
import { Team } from './team';

// Add to the switch/map that renders blocks by _template:
case 'logoSlider': return <LogoSlider data={block} key={i} />;
case 'problemStatement': return <ProblemStatement data={block} key={i} />;
case 'team': return <Team data={block} key={i} />;
```

Read the current `components/blocks/index.tsx` first to understand the exact render pattern, then add accordingly.

- [ ] **Step 3: Regenerate TinaCMS types**

```bash
pnpm dev &
sleep 10 && kill %1
```

This triggers TinaCMS type generation. The `tina/__generated__/types.ts` will update with new block types (`PageBlocksLogoSlider`, `PageBlocksProblemStatement`, `PageBlocksTeam`).

- [ ] **Step 4: Commit**

```bash
git add tina/collection/page.ts components/blocks/index.tsx tina/__generated__/
git commit -m "feat: register new TinaCMS blocks — LogoSlider, ProblemStatement, Team"
```

---

## Task 18: Update Header — language switcher + Calendly CTA

**Files:**
- Modify: `components/layout/nav/header.tsx`
- Modify: `components/layout/layout-context.tsx` (add calendlyUrl to globalSettings type)

- [ ] **Step 1: Update header.tsx**

Replace `components/layout/nav/header.tsx`:

```tsx
// components/layout/nav/header.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useLayout } from '../layout-context';
import { CalendlyButton } from '../../ui/CalendlyButton';
import { Button } from '../../ui/button';

export const Header = () => {
  const { globalSettings } = useLayout();
  const header = globalSettings!.header!;
  const [menuState, setMenuState] = React.useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace the locale prefix in the current path
    const pathWithoutLocale = pathname.replace(/^\/(cs|en)/, '') || '/';
    return `/${newLocale}${pathWithoutLocale}`;
  };

  const otherLocale = locale === 'cs' ? 'en' : 'cs';
  const calendlyUrl = header.calendlyUrl ?? '';

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-6">
              {/* Logo */}
              <Link href={`/${locale}`} aria-label="home" className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight">{header.name}</span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              {/* Desktop nav */}
              <div className="hidden items-center gap-8 lg:flex">
                <ul className="flex gap-8 text-sm">
                  {header.nav?.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item!.href!.startsWith('#') ? item!.href! : `/${locale}${item!.href}`}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                      >
                        {item!.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Language switcher */}
                <Link
                  href={switchLocale(otherLocale)}
                  className="text-sm font-medium uppercase text-muted-foreground hover:text-foreground"
                >
                  {otherLocale}
                </Link>

                {/* Book call CTA */}
                {calendlyUrl && (
                  <CalendlyButton url={calendlyUrl} label={t('bookCall')} size="default" />
                )}
              </div>
            </div>

            {/* Mobile menu */}
            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden w-full">
                <ul className="space-y-6 text-base">
                  {header.nav?.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item!.href!.startsWith('#') ? item!.href! : `/${locale}${item!.href}`}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                        onClick={() => setMenuState(false)}
                      >
                        {item!.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-4">
                  <Link href={switchLocale(otherLocale)} className="text-sm font-medium uppercase text-muted-foreground">
                    {otherLocale}
                  </Link>
                  {calendlyUrl && (
                    <CalendlyButton url={calendlyUrl} label={t('bookCall')} size="default" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/nav/header.tsx
git commit -m "feat: update Header with language switcher and Calendly CTA button"
```

---

## Task 19: Update Footer — GTC contact info

**Files:**
- Modify: `components/layout/nav/footer.tsx`

- [ ] **Step 1: Replace footer.tsx**

```tsx
// components/layout/nav/footer.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Mail } from 'lucide-react';
import { Icon } from '../../icon';
import { useLayout } from '../layout-context';

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { header, footer } = globalSettings!;
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="border-t bg-gtc-deep text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="text-xl font-bold">
              {header?.name}
            </Link>
            <p className="mt-3 text-sm text-gtc-primary">
              Helping companies connect with Gen Z.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-gtc-primary">Kontakt</p>
            {footer?.phone && (
              <a href={`tel:${footer.phone}`} className="flex items-center gap-2 text-sm hover:text-gtc-primary">
                <Phone className="size-4" /> {footer.phone}
              </a>
            )}
            {footer?.email && (
              <a href={`mailto:${footer.email}`} className="flex items-center gap-2 text-sm hover:text-gtc-primary">
                <Mail className="size-4" /> {footer.email}
              </a>
            )}
          </div>

          {/* Social */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-gtc-primary">Sledujte nás</p>
            <div className="flex gap-4">
              {footer?.social?.map((link, index) => (
                <a
                  key={index}
                  href={link!.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-gtc-primary"
                >
                  <Icon data={{ ...link!.icon, size: 'medium' }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          © {new Date().getFullYear()} {header?.name}. {t('rights')}
        </div>
      </div>
    </footer>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/nav/footer.tsx
git commit -m "feat: update Footer with GTC contact info and dark teal background"
```

---

## Task 20: Homepage content — cs/home.mdx + en/home.mdx

**Files:**
- Modify: `content/pages/cs/home.mdx` (replace existing boilerplate content)
- Create: `content/pages/en/home.mdx`

- [ ] **Step 1: Replace content/pages/cs/home.mdx**

```mdx
---
title: GenZ Consulting — Domů
blocks:
  - background: "bg-gtc-deep"
    headline: "Generace Z není komplikovaná."
    tagline: "Firmy jen pořád komunikují postaru. Pomáháme to změnit."
    actions:
      - label: "Booknout konzultaci"
        type: "calendly"
      - label: "Stáhnout Legit Check"
        type: "leadMagnet"
    _template: hero
  - background: ""
    title: "Spolupracovali jsme s"
    logos:
      - name: "Global Payments"
      - name: "Generali"
      - name: "AV Media"
      - name: "Raynet"
      - name: "ČZU"
      - name: "CITA"
      - name: "TAP"
    _template: logoSlider
  - background: "bg-gtc-deep"
    eyebrow: "Proč to nefunguje"
    problem: >
      ## Firmy nepřichází o Gen Z proto, že by tato generace byla složitá.

      Přichází o ně proto, že systémy pro mladé nastavují lidé, kteří jejich potřeby sami nikdy nežili.

      Tradiční hiring procesy, šablonový onboarding a HR komunikace z minulého desetiletí — tohle Gen Z prostě ignoruje.
    solution: >
      ## V GenZ Consulting k tomu přistupujeme jinak.

      Sami jsme součástí Gen Z a zároveň dobře rozumíme tomu, jak firmy fungují.

      Naše řešení nevycházejí z teorie — vycházejí z reálné zkušenosti a první ruky.
    _template: problemStatement
  - title: "Co umíme"
    description: "Tři konkrétní oblasti, kde pomáháme středním a velkým firmám."
    items:
      - icon:
          name: BiChalkboard
          color: ""
          style: float
        title: "Workshopy"
        text: "Interaktivní workshopy pro HR týmy — jak Gen Z opravdu funguje, ne jen teoreticky, ale z reálné zkušenosti."
      - icon:
          name: BiBookOpen
          color: ""
          style: float
        title: "Training Programy"
        text: "Komplexní vzdělávací cykly pro střední a velké firmy. Trainee programy, které přitahují relevantní mladé talenty."
      - icon:
          name: BiMobile
          color: ""
          style: float
        title: "Onboardingová Aplikace"
        text: "Technologický pilíř naší nabídky. Moderní onboarding, který provede nováčky začátkem srozumitelně a bez chaosu."
    _template: features
  - background: "bg-zinc-50"
    title: "GTC v číslech"
    description: ""
    stats:
      - stat: "50+"
        type: "spokojených firem"
      - stat: "3"
        type: "oblasti expertízy"
      - stat: "100%"
        type: "Gen Z tým"
    _template: stats
  - title: "Co říkají naši klienti"
    description: ""
    testimonials:
      - quote: "Díky GTC jsme konečně pochopili, co naši juniorní kolegové skutečně potřebují. Onboarding teď funguje."
        author: "HR Director"
        role: "Středně velká technologická firma"
    _template: testimonial
  - title: "Náš tým"
    description: "Sami jsme Gen Z. Rozumíme té generaci zevnitř."
    members:
      - name: "Adam Dalecký"
        role: "Co-founder & Lead Consultant"
        bio: "Adam se věnuje práci s firmami na jejich hiring a onboarding procesech pro Gen Z. Osobně prošel desítkami pohovorů a zná tuto generaci zevnitř."
        linkedin: "https://www.linkedin.com/in/adam-dalecky/"
        isMentor: false
    _template: team
  - background: "bg-gtc-deep"
    title: "Připraveni začít?"
    description: "Rezervujte si nezávazný call nebo si stáhněte náš Legit Check zdarma."
    actions:
      - label: "Booknout konzultaci"
        type: "calendly"
      - label: "Stáhnout Legit Check"
        type: "leadMagnet"
    _template: cta
---
```

- [ ] **Step 2: Create content/pages/en/home.mdx**

```mdx
---
title: GenZ Consulting — Home
blocks:
  - background: "bg-gtc-deep"
    headline: "Gen Z isn't complicated."
    tagline: "Companies just keep communicating the old way. We help them change that."
    actions:
      - label: "Book a consultation"
        type: "calendly"
      - label: "Download Legit Check"
        type: "leadMagnet"
    _template: hero
  - background: ""
    title: "Companies we've worked with"
    logos:
      - name: "Global Payments"
      - name: "Generali"
      - name: "AV Media"
      - name: "Raynet"
      - name: "ČZU"
      - name: "CITA"
      - name: "TAP"
    _template: logoSlider
  - background: "bg-gtc-deep"
    eyebrow: "Why it's not working"
    problem: >
      ## Companies don't lose Gen Z employees because the generation is difficult.

      They lose them because the systems for young employees are designed by people who never lived through their experience.

      Traditional hiring processes, templated onboarding, and HR communication from the last decade — Gen Z simply ignores all of it.
    solution: >
      ## At GenZ Consulting, we approach it differently.

      We are Gen Z ourselves, and we deeply understand how companies work.

      Our solutions don't come from theory — they come from real, firsthand experience.
    _template: problemStatement
  - title: "What we do"
    description: "Three concrete areas where we help mid-size and large companies."
    items:
      - icon:
          name: BiChalkboard
          color: ""
          style: float
        title: "Workshops"
        text: "Interactive workshops for HR teams — how Gen Z actually works, not just in theory, but from real experience."
      - icon:
          name: BiBookOpen
          color: ""
          style: float
        title: "Training Programs"
        text: "Comprehensive educational cycles for mid-size and large companies. Trainee programs that attract relevant young talent."
      - icon:
          name: BiMobile
          color: ""
          style: float
        title: "Onboarding App"
        text: "The tech pillar of our offer. Modern onboarding that guides new hires through their first days clearly and without chaos."
    _template: features
  - background: "bg-zinc-50"
    title: "GTC by the numbers"
    description: ""
    stats:
      - stat: "50+"
        type: "satisfied companies"
      - stat: "3"
        type: "areas of expertise"
      - stat: "100%"
        type: "Gen Z team"
    _template: stats
  - title: "What our clients say"
    description: ""
    testimonials:
      - quote: "Thanks to GTC we finally understood what our junior colleagues actually need. Onboarding works now."
        author: "HR Director"
        role: "Mid-size tech company"
    _template: testimonial
  - title: "Our team"
    description: "We are Gen Z. We understand this generation from the inside."
    members:
      - name: "Adam Dalecký"
        role: "Co-founder & Lead Consultant"
        bio: "Adam works with companies on their hiring and onboarding processes for Gen Z. He's been through dozens of interviews himself and knows this generation from within."
        linkedin: "https://www.linkedin.com/in/adam-dalecky/"
        isMentor: false
    _template: team
  - background: "bg-gtc-deep"
    title: "Ready to start?"
    description: "Book a no-obligation call or download our Legit Check for free."
    actions:
      - label: "Book a consultation"
        type: "calendly"
      - label: "Download Legit Check"
        type: "leadMagnet"
    _template: cta
---
```

- [ ] **Step 3: Commit**

```bash
git add content/pages/
git commit -m "feat: homepage content for cs and en"
```

---

## Task 21: GA4 analytics + environment setup

**Files:**
- Modify: `app/[locale]/layout.tsx`
- Modify: `.env.example`
- Create: `.env.local` (not committed)

- [ ] **Step 1: Add GA4 to locale layout**

Add Google Analytics to `app/[locale]/layout.tsx` using `@next/third-parties`:

```tsx
// app/[locale]/layout.tsx
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 2: Update .env.example**

Replace `.env.example` with:

```bash
# TinaCMS Cloud
NEXT_PUBLIC_TINA_CLIENT_ID=
TINA_TOKEN=
NEXT_PUBLIC_TINA_BRANCH=

# Resend (email for Legit Check notifications)
RESEND_API_KEY=

# Google Analytics 4
NEXT_PUBLIC_GA_ID=
```

- [ ] **Step 3: Create .env.local for local dev**

```bash
cp .env.example .env.local
```

Fill in values as needed locally (TinaCMS local dev works without cloud keys when running `pnpm dev`).

- [ ] **Step 4: Run full test suite**

```bash
pnpm test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Start dev server and do final smoke test**

```bash
pnpm dev
```

Check:
- http://localhost:3000 → redirects to /cs ✓
- http://localhost:3000/cs → homepage loads with GTC hero ✓
- http://localhost:3000/en → English homepage loads ✓
- Language switcher in header changes locale ✓
- "Booknout konzultaci" button triggers Calendly script load ✓
- "Stáhnout Legit Check" button opens modal ✓
- Footer shows GTC contact info ✓

Stop server.

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/layout.tsx .env.example
git commit -m "feat: GA4 analytics integration and env setup"
```

---

## Self-Review Checklist (run before handoff)

- [x] **Spec §1 — i18n routing**: Tasks 4 + 5 implement /cs and /en with next-intl middleware.
- [x] **Spec §2 — Fonts**: Task 3 replaces all fonts with Poppins.
- [x] **Spec §2 — Brand colors**: Task 3 adds `--color-gtc-*` tokens to styles.css.
- [x] **Spec §3 — LogoSlider block**: Task 12, inline logos (not separate collection — YAGNI simplification).
- [x] **Spec §3 — ProblemStatement block**: Task 13.
- [x] **Spec §3 — Team block**: Task 14, inline members (not separate collection — YAGNI simplification).
- [x] **Spec §3 — Hero with Calendly + PDF CTAs**: Task 15.
- [x] **Spec §3 — CTA with Calendly + PDF CTAs**: Task 16.
- [x] **Spec §3 — Navigation with language switcher + Calendly CTA**: Task 18.
- [x] **Spec §3 — Footer with contact info**: Task 19.
- [x] **Spec §4 — CalendlyButton (lazy script load)**: Task 10.
- [x] **Spec §4 — LeadMagnetModal (email capture)**: Task 11.
- [x] **Spec §4 — /api/legit-check (Resend notification + PDF URL)**: Task 9.
- [x] **Spec §5 — Content files cs/home.mdx + en/home.mdx**: Task 20.
- [x] **Spec §6 — Environment variables**: Task 21.
- [x] **Spec §7 — Remove boilerplate (posts, authors, tags)**: Task 6.
- [x] **Spec Analytics — GA4**: Task 21.
- [x] **Type consistency**: `CalendlyButton` props (`url`, `label`) used consistently in Hero (Task 15), CTA (Task 16), Header (Task 18). `LeadMagnetModal` props (`isOpen`, `onClose`) consistent in Hero, CTA. `isValidEmail` from `lib/email.ts` used in both API route and modal.
