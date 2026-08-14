import React from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Layout from '@/components/layout/layout';
import { CookieConsentProvider } from '@/components/ui/CookieConsentContext';
import NotFoundPage from '@/components/pages/not-found/NotFoundPage';
import { getNotFoundContent } from '@/components/pages/not-found/not-found-content';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Stránka nenalezena',
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const locale = await getLocale().catch(() => 'cs');
  const messages = await getMessages().catch(() => ({}));
  const content = await getNotFoundContent(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CookieConsentProvider>
        <Layout>
          <NotFoundPage {...content} />
        </Layout>
      </CookieConsentProvider>
    </NextIntlClientProvider>
  );
}
