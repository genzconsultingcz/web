import React from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/layout/layout';
import MediaPage, { type PressChrome, type PressMention } from '@/components/pages/media/MediaPage';
import client from '@/tina/__generated__/client';
import { getPageMetadata, SEO } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO.media[locale === 'en' ? 'en' : 'cs'];
  return getPageMetadata({ locale, path: '/media', title: seo.title, description: seo.description });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [{ data: chromeData }, { data: connectionData }] = await Promise.all([
    client.queries.pressChrome({ relativePath: 'index.json' }, { fetchOptions: { next: { revalidate: 300 } } }),
    client.queries.pressConnection(undefined, {
      fetchOptions: { next: { revalidate: 300 } },
    }),
  ]);

  const chrome: PressChrome | null | undefined =
    locale === 'en' ? chromeData.pressChrome?.en : chromeData.pressChrome?.cs;

  const mentions: PressMention[] = (connectionData.pressConnection.edges ?? [])
    .map((edge) => {
      const node = edge?.node;
      if (!node) return null;
      const content = locale === 'en' ? node.en : node.cs;
      if (!content) return null;
      return {
        slug: node._sys.filename,
        outlet: content.outlet ?? '',
        author: content.author ?? '',
        title: content.title ?? '',
        date: content.date ?? '',
        url: content.url ?? '',
        summary: content.summary ?? '',
      };
    })
    .filter((mention): mention is PressMention => Boolean(mention))
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

  return (
    <Layout>
      <MediaPage chrome={chrome} items={mentions} />
    </Layout>
  );
}
