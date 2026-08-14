import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GenZ Consulting',
    short_name: 'GenZ Consulting',
    description:
      'Pomáháme středním a velkým firmám komunikovat, přitahovat a udržet generaci Z.',
    start_url: '/cs',
    lang: 'cs',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon.png', sizes: '128x128', type: 'image/png' },
    ],
  };
}
