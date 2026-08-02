import React from 'react';
import Layout from '@/components/layout/layout';
import HomePage, { HomeContent } from '@/components/pages/home/HomePage';
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
  // `en` and `cs` are structurally identical (only the __typename literal differs),
  // so the resolved-locale branch is cast to the shared HomeContent shape.
  const content = (locale === 'en' ? data.home.en : data.home.cs) as HomeContent;

  return (
    <Layout>
      <HomePage content={content} logos={data.home.logos} />
    </Layout>
  );
}
