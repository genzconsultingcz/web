'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useLayout } from '../layout-context';
import { CalendlyButton } from '../../ui/CalendlyButton';

export const Header = () => {
  const { globalSettings } = useLayout();
  const header = globalSettings!.header!;
  const [menuState, setMenuState] = React.useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(cs|en)/, '') || '/';
    return `/${newLocale}${pathWithoutLocale}`;
  };

  const otherLocale = locale === 'cs' ? 'en' : 'cs';
  const calendlyUrl = (header as any).calendlyUrl ?? '';

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-6">
              {/* Logo */}
              <Link href={`/${locale}`} aria-label="home" className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight">{header.name}</span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              {/* Desktop nav */}
              <div className="hidden items-center gap-8 lg:flex">
                <ul className="flex gap-8 text-sm">
                  {header.nav?.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item!.href!.startsWith('#') ? item!.href! : `/${locale}${item!.href}`}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                      >
                        {item!.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Language switcher */}
                <Link
                  href={switchLocale(otherLocale)}
                  className="text-sm font-medium uppercase text-muted-foreground hover:text-foreground"
                >
                  {otherLocale}
                </Link>

                {/* Book call CTA */}
                {calendlyUrl && (
                  <CalendlyButton url={calendlyUrl} label={t('bookCall')} size="default" />
                )}
              </div>
            </div>

            {/* Mobile menu */}
            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden w-full">
                <ul className="space-y-6 text-base">
                  {header.nav?.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item!.href!.startsWith('#') ? item!.href! : `/${locale}${item!.href}`}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                        onClick={() => setMenuState(false)}
                      >
                        {item!.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-4">
                  <Link href={switchLocale(otherLocale)} className="text-sm font-medium uppercase text-muted-foreground">
                    {otherLocale}
                  </Link>
                  {calendlyUrl && (
                    <CalendlyButton url={calendlyUrl} label={t('bookCall')} size="default" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
