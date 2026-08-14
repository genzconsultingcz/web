import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/layout';
import CareerPagesPage from '@/components/pages/services/CareerPagesPage';
import client from '@/tina/__generated__/client';
import { getPageMetadata, SEO } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO['career-pages'][locale === 'en' ? 'en' : 'cs'];
  return getPageMetadata({
    locale,
    path: '/services/career-pages',
    title: seo.title,
    description: seo.description,
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const result = await client.queries.service({ relativePath: 'career-pages.json' }).catch(() => ({ data: null, errors: [{ message: 'not found' }] }));
  if (result.errors?.length || !result.data?.service) notFound();

  const service = result.data.service;
  const content = locale === 'en' ? service.en : service.cs;
  if (!content) notFound();

  return (
    <Layout>
      <CareerPagesPage num={service.num ?? ''} slug="career-pages" content={content} />
    </Layout>
  );
}
