'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Mail, Linkedin } from 'lucide-react';
import { useLayout } from '../layout-context';

// Derive a readable display name from a LinkedIn URL (the Tina query doesn't expose a label).
const SOCIAL_NAME_OVERRIDES: Record<string, string> = {
  'gen-zconsulting': 'GenZ Consulting',
  'adam-dalecky': 'Adam Dalecký',
  'jonatan-petr': 'Jonatan Petr',
};

function socialLinkName(url: string): string {
  const slug = url.match(/\/(?:company|in)\/([^/?#]+)/i)?.[1]?.toLowerCase();
  if (!slug) return 'LinkedIn';
  if (SOCIAL_NAME_OVERRIDES[slug]) return SOCIAL_NAME_OVERRIDES[slug];
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { header, footer } = globalSettings!;
  const t = useTranslations('footer');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}/services`, label: 'Služby' },
    { href: `/${locale}/about`, label: 'O nás' },
    { href: `/${locale}/case-studies`, label: 'Case studies' },
    { href: `/${locale}/contact`, label: 'Kontakt' },
    { href: `/${locale}#pdf-guide`, label: 'Průvodce' },
  ];

  return (
    <footer className="bg-gtc-deep text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3 justify-items-center text-center">
          {/* Brand */}
          <div className="max-w-[260px]">
            <Link href={`/${locale}`} aria-label="GenZ Consulting — domů">
              <Image
                src="/logo_dark_bg_v3.png"
                alt="GenZ Consulting"
                width={140}
                height={48}
                className="h-16 w-auto mx-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              {t('tagline')}
            </p>
            <p className="mt-2 text-xs text-white/30">www.genzconsulting.cz</p>
          </div>

          {/* Nav */}
          <div className="max-w-[220px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gtc-primary">
              {t('navLabel')}
            </p>
            <ul className="space-y-2 text-center">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="max-w-[260px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gtc-primary">
              {t('contactLabel')}
            </p>
            <div className="space-y-3">
              {(footer as any)?.email && (
                <a
                  href={`mailto:${(footer as any).email}`}
                  className="flex items-center justify-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150"
                >
                  <Mail className="size-4 shrink-0" />
                  {(footer as any).email}
                </a>
              )}
              {(footer as any)?.phone && (
                <a
                  href={`tel:${(footer as any).phone}`}
                  className="flex items-center justify-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150"
                >
                  <Phone className="size-4 shrink-0" />
                  {(footer as any).phone}
                </a>
              )}
              <div className="flex flex-col items-center gap-2 pt-1">
                {footer?.social?.map((link, i) => {
                  const url = link!.url ?? '';
                  const name = socialLinkName(url);
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${name} LinkedIn`}
                      className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-gtc-primary transition-colors duration-150"
                    >
                      <Linkedin className="size-4 shrink-0" />
                      {name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-2 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {header?.name}. {t('rights')}
          </p>
          <p className="text-xs text-white/20">linkedin.com/company/gen-zconsulting</p>
        </div>
      </div>
    </footer>
  );
};
