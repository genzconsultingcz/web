import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/layout';
import CaseStudyDetail from '@/components/pages/case-studies/CaseStudyDetail';
import client from '@/tina/__generated__/client';
import { routing } from '@/i18n/routing';
import { getPageMetadata } from '@/lib/seo';

export const revalidate = 300;

export async function generateStaticParams() {
  // Tina's local dev server isn't running during `next build`, so degrade to
  // no static params (pages render on-demand with revalidate) rather than
  // failing the build — same resilience as generateMetadata below.
  try {
    const { data } = await client.queries.caseStudyConnection();
    const slugs = (data.caseStudyConnection.edges ?? [])
      .map((edge) => edge?.node?._sys.filename)
      .filter((slug): slug is string => Boolean(slug));

    return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const { data } = await client.queries.caseStudy({ relativePath: `${slug}.json` });
    const content = locale === 'en' ? data.caseStudy.en : data.caseStudy.cs;
    if (!content) return {};
    const isEn = locale === 'en';
    const title = isEn ? `${content.client} · Case study` : `${content.client} · Případová studie`;
    const description = content.hero?.intro ?? '';
    return getPageMetadata({ locale, path: `/case-studies/${slug}`, title, description });
  } catch {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Tina's generated client may either reject or resolve with `errors` populated
  // when `relativePath` doesn't match a document — handle both the same way,
  // matching the old `if (!getCaseStudy(slug, locale)) notFound();` check.
  const result = await client.queries.caseStudy({ relativePath: `${slug}.json` }).catch(() => ({ data: null, errors: [{ message: 'not found' }] }));

  if (result.errors?.length || !result.data?.caseStudy) notFound();

  const { data: chromeData } = await client.queries.caseStudiesChrome({ relativePath: 'index.json' });

  const cs = locale === 'en' ? result.data.caseStudy.en : result.data.caseStudy.cs;
  const chrome = locale === 'en' ? chromeData.caseStudiesChrome?.en?.detail : chromeData.caseStudiesChrome?.cs?.detail;

  if (!cs) notFound();

  return (
    <Layout>
      <CaseStudyDetail cs={cs} chrome={chrome} />
    </Layout>
  );
}
