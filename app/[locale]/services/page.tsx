import React from 'react';
import Layout from '@/components/layout/layout';
import ServicesPage, { type ServiceCard } from '@/components/pages/services/ServicesPage';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

const SERVICE_SLUGS = ['trainee-program', 'onboarding-app', 'genz-workshop', 'career-pages', 'custom'];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [{ data: chromeData }, { data: connectionData }] = await Promise.all([
    client.queries.servicesChrome({ relativePath: 'index.json' }, { fetchOptions: { next: { revalidate: 300 } } }),
    client.queries.serviceConnection(undefined, { fetchOptions: { next: { revalidate: 300 } } }),
  ]);

  const chrome = locale === 'en' ? chromeData.servicesChrome?.en : chromeData.servicesChrome?.cs;

  type ServiceEdgeNode = NonNullable<
    NonNullable<NonNullable<typeof connectionData.serviceConnection.edges>[number]>['node']
  >;

  const nodes = (connectionData.serviceConnection.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is ServiceEdgeNode => Boolean(node));
  const bySlug = new Map(nodes.map((node) => [node._sys.filename, node]));

  const cards: ServiceCard[] = SERVICE_SLUGS
    .map((slug) => {
      const node = bySlug.get(slug);
      if (!node) return null;
      const content = locale === 'en' ? node.en : node.cs;
      if (!content) return null;
      return {
        slug,
        num: node.num ?? '',
        title: content.card?.title ?? '',
        desc: content.card?.desc ?? '',
        featured: node.featured ?? false,
      };
    })
    .filter((card): card is ServiceCard => Boolean(card));

  return (
    <Layout>
      <ServicesPage chrome={chrome} cards={cards} />
    </Layout>
  );
}
