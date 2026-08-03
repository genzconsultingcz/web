import React from 'react';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/layout';
import OnboardingAppPage from '@/components/pages/services/OnboardingAppPage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const result = await client.queries.service({ relativePath: 'onboarding-app.json' }).catch(() => ({ data: null, errors: [{ message: 'not found' }] }));
  if (result.errors?.length || !result.data?.service) notFound();

  const service = result.data.service;
  const content = locale === 'en' ? service.en : service.cs;
  if (!content) notFound();

  return (
    <Layout>
      <OnboardingAppPage num={service.num ?? ''} content={content} />
    </Layout>
  );
}
