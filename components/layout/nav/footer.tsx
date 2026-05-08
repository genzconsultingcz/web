'use client';
import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Mail } from 'lucide-react';
import { Icon } from '../../icon';
import { useLayout } from '../layout-context';

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { header, footer } = globalSettings!;
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="border-t bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="text-xl font-bold">
              {header?.name}
            </Link>
            <p className="mt-3 text-sm text-gtc-primary">
              Helping companies connect with Gen Z.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-gtc-primary">Kontakt</p>
            {(footer as any)?.phone && (
              <a href={`tel:${(footer as any).phone}`} className="flex items-center gap-2 text-sm hover:text-gtc-primary">
                <Phone className="size-4" /> {(footer as any).phone}
              </a>
            )}
            {(footer as any)?.email && (
              <a href={`mailto:${(footer as any).email}`} className="flex items-center gap-2 text-sm hover:text-gtc-primary">
                <Mail className="size-4" /> {(footer as any).email}
              </a>
            )}
          </div>

          {/* Social */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-gtc-primary">Sledujte nás</p>
            <div className="flex gap-4">
              {footer?.social?.map((link, index) => (
                <a
                  key={index}
                  href={link!.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-gtc-primary"
                >
                  <Icon data={{ ...link!.icon, size: 'medium' }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          © {new Date().getFullYear()} {header?.name}. {t('rights')}
        </div>
      </div>
    </footer>
  );
};
