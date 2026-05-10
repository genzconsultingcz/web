import React from 'react';
import Layout from '@/components/layout/layout';
import AboutPage from '@/components/pages/about/AboutPage';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <AboutPage />
    </Layout>
  );
}
