import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/layout';
import TraineeProgramPage from '@/components/pages/services/TraineeProgramPage';
import client from '@/tina/__generated__/client';
import { getPageMetadata, SEO } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO['trainee-program'][locale === 'en' ? 'en' : 'cs'];
  return getPageMetadata({
    locale,
    path: '/services/trainee-program',
    title: seo.title,
    description: seo.description,
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const result = await client.queries.service({ relativePath: 'trainee-program.json' }).catch(() => ({ data: null, errors: [{ message: 'not found' }] }));
  if (result.errors?.length || !result.data?.service) notFound();

  const service = result.data.service;
  const content = locale === 'en' ? service.en : service.cs;
  if (!content) notFound();

  return (
    <Layout>
      <TraineeProgramPage num={service.num ?? ''} slug="trainee-program" content={content} />
    </Layout>
  );
}
