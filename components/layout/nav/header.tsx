'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLayout } from '../layout-context';
import { CalendlyButton } from '../../ui/CalendlyButton';
import { cn } from '@/lib/utils';

const SERVICES = [
  { key: 'traineeProgram', slug: 'trainee-program' },
  { key: 'onboardingApp', slug: 'onboarding-app' },
  { key: 'genzWorkshop', slug: 'genz-workshop' },
  { key: 'careerPages', slug: 'career-pages' },
  { key: 'customSolution', slug: 'custom' },
] as const;

export const Header = () => {
  const { globalSettings } = useLayout();
  const header = globalSettings!.header!;
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const calendlyUrl = (header as any).calendlyUrl ?? '';

  const switchLocale = (newLocale: string) => {
    const withoutLocale = pathname.replace(/^\/(cs|en)/, '') || '/';
    return `/${newLocale}${withoutLocale}`;
  };
  const otherLocale = locale === 'cs' ? 'en' : 'cs';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/case-studies`, label: t('caseStudies') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} aria-label="GenZ Consulting — domů">
            <Image
              src="/logo.png"
              alt="GenZ Consulting"
              width={120}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {/* Services dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setServicesOpen((v) => !v)}
                onMouseEnter={() => setServicesOpen(true)}
                className={cn(
                  'flex items-center gap-1 text-sm font-medium transition-colors duration-150',
                  servicesOpen ? 'text-gtc-primary' : 'text-white/70 hover:text-white'
                )}
              >
                {t('services')}
                <ChevronDown
                  className={cn('size-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')}
                />
              </button>

              {servicesOpen && (
                <div
                  onMouseLeave={() => setServicesOpen(false)}
                  className="absolute left-0 top-full mt-2 w-56 border border-white/10 bg-black py-2 shadow-xl"
                >
                  {SERVICES.map(({ key, slug }) => (
                    <Link
                      key={slug}
                      href={`/${locale}/services/${slug}`}
                      className="block px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors duration-100"
                    >
                      {t(key)}
                    </Link>
                  ))}
                  <div className="mx-4 my-2 border-t border-white/10" />
                  <Link
                    href={`/${locale}/services`}
                    className="block px-4 py-2.5 text-sm font-semibold text-gtc-primary hover:bg-white/5 transition-colors duration-100"
                  >
                    Všechny služby →
                  </Link>
                </div>
              )}
            </div>

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors duration-150',
                  pathname === href ? 'text-gtc-primary' : 'text-white/70 hover:text-white'
                )}
              >
                {label}
              </Link>
            ))}

            <Link
              href={switchLocale(otherLocale)}
              className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors duration-150"
            >
              {otherLocale}
            </Link>

            {calendlyUrl && (
              <CalendlyButton
                url={calendlyUrl}
                label={t('bookCall')}
                size="default"
                className="rounded-none bg-gtc-primary px-5 py-2 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
              />
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-white"
            aria-label={menuOpen ? 'Zavřít menu' : 'Otevřít menu'}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — full-page overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-black lg:hidden">
          {/* Top bar mirrors the header */}
          <div className="flex h-[72px] items-center justify-between px-6">
            <Link href={`/${locale}`} aria-label="GenZ Consulting — domů" onClick={() => setMenuOpen(false)}>
              <Image src="/logo.png" alt="GenZ Consulting" width={120} height={40} className="h-9 w-auto" priority />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-white"
              aria-label="Zavřít menu"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-1 flex-col overflow-y-auto px-6 pb-10 pt-4">
            {/* Services accordion */}
            <button
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex w-full items-center justify-between border-b border-white/10 py-5 text-lg font-bold text-white"
            >
              {t('services')}
              <ChevronDown
                className={cn('size-5 transition-transform duration-200', mobileServicesOpen && 'rotate-180')}
              />
            </button>
            {mobileServicesOpen && (
              <div className="border-b border-white/10 py-2 pl-4 space-y-0.5">
                {SERVICES.map(({ key, slug }) => (
                  <Link
                    key={slug}
                    href={`/${locale}/services/${slug}`}
                    className="block py-3 text-base text-white/60 hover:text-white transition-colors"
                  >
                    {t(key)}
                  </Link>
                ))}
                <Link
                  href={`/${locale}/services`}
                  className="block py-3 text-base font-semibold text-gtc-primary"
                >
                  Všechny služby →
                </Link>
              </div>
            )}

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block border-b border-white/10 py-5 text-lg font-bold text-white hover:text-gtc-primary transition-colors"
              >
                {label}
              </Link>
            ))}

            {/* Bottom actions */}
            <div className="mt-auto pt-8 space-y-4">
              {calendlyUrl && (
                <CalendlyButton
                  url={calendlyUrl}
                  label={t('bookCall')}
                  size="lg"
                  className="h-auto w-full rounded-none bg-gtc-primary px-6 py-4 text-base font-bold text-black hover:bg-gtc-primary/90 transition-colors"
                />
              )}
              <Link
                href={switchLocale(otherLocale)}
                className="block text-center text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
              >
                {otherLocale === 'en' ? 'English' : 'Česky'}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
