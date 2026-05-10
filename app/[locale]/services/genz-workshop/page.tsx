import React from 'react';
import Layout from '@/components/layout/layout';
import WorkshopPage from '@/components/pages/services/WorkshopPage';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <WorkshopPage />
    </Layout>
  );
}
