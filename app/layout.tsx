import React from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
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
  title: {
    default: 'GenZ Consulting — Specialisté na generaci Z',
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
  openGraph: {
    title: 'GenZ Consulting — Specialisté na generaci Z',
    description:
      'Pomáháme středním a velkým firmám komunikovat, přitahovat a udržet generaci Z.',
    siteName: 'GenZ Consulting',
    locale: 'cs_CZ',
    type: 'website',
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
