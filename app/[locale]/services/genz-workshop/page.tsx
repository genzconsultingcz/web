import React from 'react';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/layout';
import WorkshopPage from '@/components/pages/services/WorkshopPage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const result = await client.queries.service({ relativePath: 'genz-workshop.json' }).catch(() => ({ data: null, errors: [{ message: 'not found' }] }));
  if (result.errors?.length || !result.data?.service) notFound();

  const service = result.data.service;
  const content = locale === 'en' ? service.en : service.cs;
  if (!content) notFound();

  return (
    <Layout>
      <WorkshopPage num={service.num ?? ''} content={content} />
    </Layout>
  );
}
