// app/[locale]/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SEO, OG_IMAGE } from '@/lib/seo';
import { LocaleLang } from '@/components/seo/locale-lang';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { CookieConsentProvider } from '@/components/ui/CookieConsentContext';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const seo = SEO.home[isEn ? 'en' : 'cs'];
  return {
    title: { absolute: seo.title },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: 'GenZ Consulting',
      locale: isEn ? 'en_US' : 'cs_CZ',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'GenZ Consulting' }],
    },
  };
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
      <CookieConsentProvider>
        <LocaleLang />
        {children}
        <CookieConsent />
      </CookieConsentProvider>
    </NextIntlClientProvider>
  );
}
