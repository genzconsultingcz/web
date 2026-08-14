import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/layout/layout';
import GdprPage from '@/components/pages/gdpr/GdprPage';
import { getPageMetadata, SEO } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO.gdpr[locale === 'en' ? 'en' : 'cs'];
  return getPageMetadata({ locale, path: '/gdpr', title: seo.title, description: seo.description });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <GdprPage />
    </Layout>
  );
}
