import client from '@/tina/__generated__/client';

export const NOT_FOUND_FALLBACK = {
  cs: {
    eyebrow: 'Chyba 404',
    title: 'Tahle stránka neexistuje.',
    message: 'Možná byla přesunuta nebo smazána. Vraťte se na hlavní stránku, nebo nám rovnou napište.',
    backHomeLabel: 'Zpět na hlavní stránku',
    contactLabel: 'Napište nám',
  },
  en: {
    eyebrow: 'Error 404',
    title: "This page doesn't exist.",
    message: 'It may have been moved or deleted. Head back home or get in touch with us.',
    backHomeLabel: 'Back to home',
    contactLabel: 'Contact us',
  },
} as const;

export async function getNotFoundContent(locale: string) {
  const isEn = locale === 'en';
  const result = await client.queries
    .global({ relativePath: 'index.json' })
    .catch(() => ({ data: null, errors: [{ message: 'fetch failed' }] }));

  const nf = isEn ? result.data?.global?.notFound?.en : result.data?.global?.notFound?.cs;
  const fallback = isEn ? NOT_FOUND_FALLBACK.en : NOT_FOUND_FALLBACK.cs;

  return {
    eyebrow: fallback.eyebrow,
    title: nf?.title ?? fallback.title,
    message: nf?.message ?? fallback.message,
    backHomeLabel: nf?.backHomeLabel ?? fallback.backHomeLabel,
    contactLabel: nf?.contactLabel ?? fallback.contactLabel,
    homeHref: `/${locale}`,
  };
}
