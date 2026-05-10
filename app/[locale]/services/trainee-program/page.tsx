import React from 'react';
import Layout from '@/components/layout/layout';
import TraineeProgramPage from '@/components/pages/services/TraineeProgramPage';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <TraineeProgramPage />
    </Layout>
  );
}
