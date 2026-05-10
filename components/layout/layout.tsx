import React, { PropsWithChildren } from 'react';
import { LayoutProvider } from './layout-context';
import client from '../../tina/__generated__/client';
import { Header } from './nav/header';
import { Footer } from './nav/footer';

export default async function Layout({ children }: PropsWithChildren) {
  const { data: globalData } = await client.queries.global(
    { relativePath: 'index.json' },
    { fetchOptions: { next: { revalidate: 60 } } }
  );

  return (
    <LayoutProvider globalSettings={globalData.global} pageData={{}}>
      <Header />
      <main className="overflow-x-hidden pt-[72px]">{children}</main>
      <Footer />
    </LayoutProvider>
  );
}
