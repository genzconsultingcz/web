import React from 'react';
import Layout from '@/components/layout/layout';
import CustomPage from '@/components/pages/services/CustomPage';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <CustomPage />
    </Layout>
  );
}
