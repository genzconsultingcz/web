import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/layout/layout';
import ContactPage from '@/components/pages/contact/ContactPage';
import { getPageMetadata, SEO } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO.contact[locale === 'en' ? 'en' : 'cs'];
  return getPageMetadata({ locale, path: '/contact', title: seo.title, description: seo.description });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <ContactPage />
    </Layout>
  );
}
