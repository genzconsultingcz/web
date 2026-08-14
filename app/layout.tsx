import React from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SITE_URL, OG_IMAGE } from '@/lib/seo';
import { VideoDialogProvider } from '@/components/ui/VideoDialogContext';
import VideoDialog from '@/components/ui/VideoDialog';
import '@/styles.css';
import { TailwindIndicator } from '@/components/ui/breakpoint-indicator';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GenZ Consulting | Specialisté na generaci Z',
    template: '%s | GenZ Consulting',
  },
  description:
    'Pomáháme středním a velkým firmám komunikovat, přitahovat a udržet generaci Z. Workshopy, training programy a onboardingová aplikace na míru.',
  keywords: [
    'generace Z',
    'Gen Z',
    'HR konzultace',
    'onboarding',
    'workshop',
    'mladé talenty',
    'trainee program',
    'GenZ Consulting',
  ],
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '128x128', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'GenZ Consulting | Specialisté na generaci Z',
    description:
      'Pomáháme středním a velkým firmám komunikovat, přitahovat a udržet generaci Z.',
    siteName: 'GenZ Consulting',
    locale: 'cs_CZ',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'GenZ Consulting' }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={poppins.variable}>
      <body className={cn('min-h-screen bg-background font-sans antialiased', poppins.variable)}>
        <VideoDialogProvider>
          {children}
          <VideoDialog />
        </VideoDialogProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
