import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/layout/layout';
import AboutPage from '@/components/pages/about/AboutPage';
import { getPageMetadata, SEO } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO.about[locale === 'en' ? 'en' : 'cs'];
  return getPageMetadata({ locale, path: '/about', title: seo.title, description: seo.description });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <AboutPage />
    </Layout>
  );
}
