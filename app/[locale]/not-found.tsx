import React from 'react';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import Layout from '@/components/layout/layout';
import NotFoundPage from '@/components/pages/not-found/NotFoundPage';
import { getNotFoundContent } from '@/components/pages/not-found/not-found-content';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Stránka nenalezena',
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const locale = await getLocale();
  const content = await getNotFoundContent(locale);

  return (
    <Layout>
      <NotFoundPage {...content} />
    </Layout>
  );
}
