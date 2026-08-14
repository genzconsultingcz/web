'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Mail, Linkedin } from 'lucide-react';
import { useLayout } from '../layout-context';
import { useCookieConsent } from '@/components/ui/CookieConsentContext';

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
  const { header, footer } = globalSettings ?? {};
  const locale = useLocale();
  const t = useTranslations('cookieConsent');
  const { openConsent } = useCookieConsent();
  const copy = locale === 'en' ? footer?.copy?.en : footer?.copy?.cs;

  if (!copy) return null;

  const navLinks = [
    { href: `/${locale}/services`, label: copy.navServices },
    { href: `/${locale}/case-studies`, label: copy.navCaseStudies },
    { href: `/${locale}/media`, label: copy.navMedia },
    { href: `/${locale}/contact`, label: copy.navContact },
  ];

  return (
    <footer className="bg-gtc-deep text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3 justify-items-center text-center">
          {/* Brand */}
          <div className="max-w-[260px]">
            <Link href={`/${locale}`} aria-label={copy.homeLogoAria || undefined}>
              <Image
                src="/logo_dark_bg_v3.png"
                alt="GenZ Consulting"
                width={140}
                height={48}
                className="h-16 w-auto mx-auto"
              />
            </Link>
            <p className="mt-4 block text-sm leading-relaxed text-white/50">
              {copy.tagline}
            </p>
            <p className="mt-2 text-xs text-white/30">{copy.web}</p>
          </div>

          {/* Nav */}
          <div className="max-w-[220px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gtc-primary">
              {copy.navLabel}
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
              {copy.contactLabel}
            </p>
            <div className="space-y-3">
              {footer?.email && (
                <a
                  href={`mailto:${footer.email}`}
                  className="flex items-center justify-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150"
                >
                  <Mail className="size-4 shrink-0" />
                  {footer.email}
                </a>
              )}
              {footer?.phone && (
                <a
                  href={`tel:${footer.phone}`}
                  className="flex items-center justify-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150"
                >
                  <Phone className="size-4 shrink-0" />
                  {footer.phone}
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

        <div className="mt-12 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {header?.name}. {copy.rights}
          </p>
          <Link
            href={`/${locale}/gdpr`}
            className="text-xs text-white/40 hover:text-white transition-colors duration-150"
          >
            {t('gdprLink')}
          </Link>
          <button
            type="button"
            onClick={openConsent}
            className="text-xs text-white/40 hover:text-white transition-colors duration-150"
          >
            {t('change')}
          </button>
          <a
            href="https://webe.tuuli.cz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WeBe"
            className="group inline-flex select-none items-center justify-center gap-2.5 text-white/40 transition-colors duration-200 hover:text-white/70"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
              {copy.socialDomain}
            </span>
            <Image
              src="/webe.png"
              alt="WeBe"
              width={530}
              height={193}
              className="h-4 w-auto opacity-60 transition-opacity duration-200 group-hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};
