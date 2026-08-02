'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ContactButton } from '../../ui/ContactButton';
import { useLayout } from '../layout-context';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { globalSettings } = useLayout();
  const locale = useLocale();
  const pathname = usePathname();

  const nav = locale === 'en' ? globalSettings?.header?.nav?.en : globalSettings?.header?.nav?.cs;

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

  if (!nav) return null;

  const homeLink = { href: `/${locale}`, label: nav.homeLabel };
  const navLinks = [
    { href: `/${locale}/about`, label: nav.aboutLabel },
    { href: `/${locale}/case-studies`, label: nav.caseStudiesLabel },
    { href: `/${locale}/contact`, label: nav.contactLabel },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} aria-label={nav.homeLogoAria}>
            <Image
              src="/logo_dark_bg_v3.png"
              alt="GenZ Consulting"
              width={120}
              height={40}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href={homeLink.href}
              className={cn(
                'text-sm font-medium transition-colors duration-150',
                pathname === homeLink.href ? 'text-gtc-primary' : 'text-white/70 hover:text-white'
              )}
            >
              {homeLink.label}
            </Link>

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
                {nav.servicesLabel}
                <ChevronDown
                  className={cn('size-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')}
                />
              </button>

              {servicesOpen && (
                <div
                  onMouseLeave={() => setServicesOpen(false)}
                  className="absolute left-0 top-full mt-2 w-56 border border-white/10 bg-black py-2 shadow-xl"
                >
                  {nav.serviceLinks?.map((service) => (
                    <Link
                      key={service?.slug}
                      href={`/${locale}/services/${service?.slug}`}
                      className="block px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors duration-100"
                    >
                      {service?.label}
                    </Link>
                  ))}
                  <div className="mx-4 my-2 border-t border-white/10" />
                  <Link
                    href={`/${locale}/services`}
                    className="block px-4 py-2.5 text-sm font-semibold text-gtc-primary hover:bg-white/5 transition-colors duration-100"
                  >
                    {nav.viewServicesLabel}
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

            <ContactButton
                label={nav.bookCallLabel}
                size="default"
                className="rounded-none bg-gtc-primary px-5 py-2 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
              />
            </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-white"
            aria-label={menuOpen ? nav.menuCloseAria : nav.menuOpenAria}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — full-page overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-black lg:hidden">
          {/* Top bar mirrors the header */}
          <div className="flex h-20 items-center justify-between px-6">
            <Link href={`/${locale}`} aria-label={nav.homeLogoAria} onClick={() => setMenuOpen(false)}>
              <Image src="/logo_dark_bg_v3.png" alt="GenZ Consulting" width={120} height={40} className="h-16 w-auto" priority />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-white"
              aria-label={nav.menuCloseAria}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-1 flex-col overflow-y-auto px-6 pb-10 pt-4">
            <Link
              href={homeLink.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-white/10 py-5 text-lg font-bold text-white hover:text-gtc-primary transition-colors"
            >
              {homeLink.label}
            </Link>
            {/* Services accordion */}
            <button
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex w-full items-center justify-between border-b border-white/10 py-5 text-lg font-bold text-white"
            >
              {nav.servicesLabel}
              <ChevronDown
                className={cn('size-5 transition-transform duration-200', mobileServicesOpen && 'rotate-180')}
              />
            </button>
            {mobileServicesOpen && (
              <div className="border-b border-white/10 py-2 pl-4 space-y-0.5">
                {nav.serviceLinks?.map((service) => (
                  <Link
                    key={service?.slug}
                    href={`/${locale}/services/${service?.slug}`}
                    className="block py-3 text-base text-white/60 hover:text-white transition-colors"
                  >
                    {service?.label}
                  </Link>
                ))}
                <Link
                  href={`/${locale}/services`}
                  className="block py-3 text-base font-semibold text-gtc-primary"
                >
                  {nav.viewServicesLabel}
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
              <ContactButton
                  label={nav.bookCallLabel}
                  size="lg"
                  className="h-auto w-full rounded-none bg-gtc-primary px-6 py-4 text-base font-bold text-black hover:bg-gtc-primary/90 transition-colors"
                />
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
