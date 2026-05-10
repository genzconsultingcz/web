import React from 'react';
import Layout from '@/components/layout/layout';
import CareerPagesPage from '@/components/pages/services/CareerPagesPage';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <CareerPagesPage />
    </Layout>
  );
}
