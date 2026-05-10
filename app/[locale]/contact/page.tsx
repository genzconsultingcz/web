import React from 'react';
import Layout from '@/components/layout/layout';
import ContactPage from '@/components/pages/contact/ContactPage';

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <Layout>
      <ContactPage />
    </Layout>
  );
}
