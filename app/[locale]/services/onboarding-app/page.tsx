import React from 'react';
import Layout from '@/components/layout/layout';
import OnboardingAppPage from '@/components/pages/services/OnboardingAppPage';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <OnboardingAppPage />
    </Layout>
  );
}
