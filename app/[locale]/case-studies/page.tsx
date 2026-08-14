import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/layout/layout';
import CaseStudiesPage, { type CaseStudyCard } from '@/components/pages/case-studies/CaseStudiesPage';
import client from '@/tina/__generated__/client';
import { getPageMetadata, SEO } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO['case-studies'][locale === 'en' ? 'en' : 'cs'];
  return getPageMetadata({ locale, path: '/case-studies', title: seo.title, description: seo.description });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [{ data: chromeData }, { data: connectionData }] = await Promise.all([
    client.queries.caseStudiesChrome({ relativePath: 'index.json' }, { fetchOptions: { next: { revalidate: 300 } } }),
    client.queries.caseStudyConnection(undefined, {
      fetchOptions: { next: { revalidate: 300 } },
    }),
  ]);

  const chrome = locale === 'en' ? chromeData.caseStudiesChrome?.en?.list : chromeData.caseStudiesChrome?.cs?.list;

  const cards: CaseStudyCard[] = (connectionData.caseStudyConnection.edges ?? [])
    .map((edge) => {
      const node = edge?.node;
      if (!node) return null;
      const content = locale === 'en' ? node.en : node.cs;
      if (!content) return null;
      return {
        slug: node._sys.filename,
        client: content.client ?? '',
        desc: content.hero?.intro ?? '',
        serviceType: content.serviceType ?? '',
        listResult: content.listResult ?? '',
        logo: content.logo ?? '',
        logoAlt: content.logoAlt ?? '',
      };
    })
    .filter((card): card is CaseStudyCard => Boolean(card));

  return (
    <Layout>
      <CaseStudiesPage chrome={chrome} cards={cards} />
    </Layout>
  );
}
