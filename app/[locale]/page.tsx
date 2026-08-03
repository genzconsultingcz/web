import React from 'react';
import Layout from '@/components/layout/layout';
import HomePage, { type HomeCaseStudyTeaser } from '@/components/pages/home/HomePage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

const TEASER_SLUGS = ['av-media', 'global-payments', 'generali'];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [{ data }, { data: connectionData }] = await Promise.all([
    client.queries.home({ relativePath: 'index.json' }, { fetchOptions: { next: { revalidate: 300 } } }),
    client.queries.caseStudyConnection(undefined, {
      fetchOptions: { next: { revalidate: 300 } },
    }),
  ]);
  const content = locale === 'en' ? data.home.en : data.home.cs;

  const caseStudies: HomeCaseStudyTeaser[] = (connectionData.caseStudyConnection.edges ?? [])
    .map((edge) => {
      const node = edge?.node;
      if (!node) return null;
      const slug = node._sys.filename;
      if (!TEASER_SLUGS.includes(slug)) return null;
      const csContent = locale === 'en' ? node.en : node.cs;
      if (!csContent) return null;
      return { slug, client: csContent.client ?? '', intro: csContent.hero?.intro ?? '' };
    })
    .filter((cs): cs is HomeCaseStudyTeaser => Boolean(cs))
    .sort((a, b) => TEASER_SLUGS.indexOf(a.slug) - TEASER_SLUGS.indexOf(b.slug));

  return (
    <Layout>
      <HomePage content={content} logos={data.home.logos} caseStudies={caseStudies} />
    </Layout>
  );
}
