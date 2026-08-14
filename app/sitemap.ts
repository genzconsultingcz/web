import type { MetadataRoute } from 'next';
import { SITE_URL, LOCALES } from '@/lib/seo';
import client from '@/tina/__generated__/client';

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/case-studies', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/trainee-program', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/services/onboarding-app', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/services/genz-workshop', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/services/career-pages', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/services/custom', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
] as const;

function entryFor(locale: string, path: string, priority: number, changeFrequency: string): MetadataRoute.Sitemap[number] {
  const defaultPath = path === '/' ? '' : path;
  return {
    url: `${SITE_URL}/${locale}${defaultPath}`,
    lastModified: new Date(),
    changeFrequency: changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority,
    alternates: {
      languages: {
        cs: `${SITE_URL}/cs${defaultPath}`,
        en: `${SITE_URL}/en${defaultPath}`,
        'x-default': `${SITE_URL}/cs${defaultPath}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = STATIC_ROUTES.flatMap((route) =>
    LOCALES.map((locale) =>
      entryFor(locale, route.path, route.priority, route.changeFrequency),
    ),
  );

  try {
    const { data } = await client.queries.caseStudyConnection();
    const slugs = (data.caseStudyConnection.edges ?? [])
      .map((edge) => edge?.node?._sys.filename)
      .filter((slug): slug is string => Boolean(slug));
    const caseStudyEntries = slugs.flatMap((slug) =>
      LOCALES.map((locale) => entryFor(locale, `/case-studies/${slug}`, 0.8, 'monthly')),
    );
    return [...entries, ...caseStudyEntries];
  } catch {
    return entries;
  }
}
