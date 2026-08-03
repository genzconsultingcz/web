import React from 'react';
import { notFound as nextNotFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import client from '@/tina/__generated__/client';

export const revalidate = 300;

export default async function NotFound() {
  const locale = await getLocale();

  const result = await client.queries.global({ relativePath: 'index.json' }).catch(() => ({ data: null, errors: [{ message: 'not found' }] }));

  if (result.errors?.length || !result.data?.global) nextNotFound();

  const nf = locale === 'en' ? result.data.global.notFound?.en : result.data.global.notFound?.cs;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{nf?.title ?? '404'}</h1>
      <p className="mt-4 text-muted-foreground">{nf?.message ?? 'Stránka nenalezena.'}</p>
    </div>
  );
}
