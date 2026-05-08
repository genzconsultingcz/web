'use client';
import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Mail } from 'lucide-react';
import { useLayout } from '../layout-context';
import { IconOptions } from '../../icon';

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { header, footer } = globalSettings!;
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="text-xl font-black tracking-tight text-white">
              {header?.name}
            </Link>
            <p className="mt-3 text-sm text-gtc-primary/80">
              Helping companies connect with Gen Z.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gtc-primary">Kontakt</p>
            {(footer as any)?.phone && (
              <a href={`tel:${(footer as any).phone}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <Phone className="size-4 shrink-0" /> {(footer as any).phone}
              </a>
            )}
            {(footer as any)?.email && (
              <a href={`mailto:${(footer as any).email}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <Mail className="size-4 shrink-0" /> {(footer as any).email}
              </a>
            )}
          </div>

          {/* Social */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gtc-primary">Sledujte nás</p>
            <div className="flex gap-3">
              {footer?.social?.map((link, index) => {
                const IconComp = (IconOptions as any)[link?.icon?.name ?? ''];
                if (!IconComp) return null;
                return (
                  <a
                    key={index}
                    href={link!.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-gtc-primary transition-colors"
                  >
                    <IconComp className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/30">
          © {new Date().getFullYear()} {header?.name}. {t('rights')}
        </div>
      </div>
    </footer>
  );
};
