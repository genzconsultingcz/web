import React from 'react';
import Layout from '@/components/layout/layout';
import CaseStudiesPage from '@/components/pages/case-studies/CaseStudiesPage';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <CaseStudiesPage />
    </Layout>
  );
}
