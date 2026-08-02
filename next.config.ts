// next.config.ts
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

initOpenNextCloudflareForDev();

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.tina.io', port: '' },
      { protocol: 'https', hostname: 'res.cloudinary.com', port: '' },
    ],
  },
  async headers() {
    const headers = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
    ];
    return [{ source: '/(.*)', headers }];
  },
  async rewrites() {
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },
};

export default withNextIntl(nextConfig);
