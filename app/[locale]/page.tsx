import React from 'react';
import Layout from '@/components/layout/layout';
import HomePage from '@/components/pages/home/HomePage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { data } = await client.queries.home(
    { relativePath: 'index.json' },
    { fetchOptions: { next: { revalidate: 300 } } }
  );
  const content = locale === 'en' ? data.home.en : data.home.cs;

  return (
    <Layout>
      <HomePage content={content} logos={data.home.logos} />
    </Layout>
  );
}
