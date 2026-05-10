import React from 'react';
import Layout from '@/components/layout/layout';
import HomePage from '@/components/pages/home/HomePage';

export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}
