'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { CalendlyButton } from '@/components/ui/CalendlyButton';
import { LeadMagnetModal } from '@/components/ui/LeadMagnetModal';
import { useLayout } from '@/components/layout/layout-context';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

const SERVICES = [
  {
    num: '01',
    slug: 'trainee-program',
    titleKey: 'service1Title' as const,
    descKey: 'service1Desc' as const,
  },
  {
    num: '02',
    slug: 'onboarding-app',
    titleKey: 'service2Title' as const,
    descKey: 'service2Desc' as const,
  },
  {
    num: '03',
    slug: 'genz-workshop',
    titleKey: 'service3Title' as const,
    descKey: 'service3Desc' as const,
  },
  {
    num: '04',
    slug: 'career-pages',
    titleKey: 'service4Title' as const,
    descKey: 'service4Desc' as const,
  },
];

const CUSTOM = {
  num: '05',
  slug: 'custom',
};

export default function ServicesPage() {
  const t = useTranslations('services');
  const tHome = useTranslations('home');
  const tCustom = useTranslations('customSolution');
  const locale = useLocale();
  const { globalSettings } = useLayout();
  const calendlyUrl = (globalSettings?.header as any)?.calendlyUrl ?? '';
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[56vh] bg-gtc-primary flex flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-black/50"
          >
            {t('eyebrow')}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-5xl font-black leading-[1.05] tracking-tight text-black sm:text-6xl md:text-7xl"
          >
            {t('title')}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl text-base text-black/60 md:text-lg"
          >
            {t('subtitle')}
          </motion.p>

          {calendlyUrl && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="mt-10"
            >
              <CalendlyButton
                url={calendlyUrl}
                label={t('cta')}
                size="lg"
                className="rounded-none bg-black px-8 py-4 text-sm font-bold text-white hover:bg-black/80 transition-colors"
              />
            </motion.div>
          )}
        </div>

        {/* decorative large text */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[20vw] font-black leading-none text-black/5"
        >
          SVC
        </div>
      </section>

      {/* ── SERVICE CARDS ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-px bg-zinc-200 sm:grid-cols-2">
            {SERVICES.map(({ num, slug, titleKey, descKey }, i) => (
              <motion.div
                key={slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="group relative bg-white p-10 hover:bg-zinc-50 transition-colors duration-200"
              >
                <span className="text-5xl font-black text-zinc-100 select-none leading-none">{num}</span>
                <h2 className="mt-4 text-xl font-black text-black">{tHome(titleKey)}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{tHome(descKey)}</p>
                <Link
                  href={`/${locale}/services/${slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gtc-dark hover:text-black transition-colors duration-150"
                >
                  Learn more
                  <ArrowRight className="size-3" />
                </Link>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gtc-primary transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}

            {/* Custom solution card — spans full width on small, single col on large */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.4}
              className="group relative bg-zinc-50 p-10 hover:bg-zinc-100 transition-colors duration-200 sm:col-span-2"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <span className="text-5xl font-black text-zinc-200 select-none leading-none">{CUSTOM.num}</span>
                  <h2 className="mt-4 text-xl font-black text-black">{tCustom('title')}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">{tCustom('subtitle')}</p>
                </div>
                <Link
                  href={`/${locale}/services/${CUSTOM.slug}`}
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gtc-dark hover:text-black transition-colors duration-150"
                >
                  Learn more
                  <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gtc-primary transition-all duration-300 group-hover:w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── NOT SURE CTA ── */}
      <section className="bg-gtc-deep py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl font-black text-white md:text-5xl">{t('notSure')}</h2>
            <p className="mt-4 text-base text-white/60">{t('notSureDesc')}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              {calendlyUrl && (
                <CalendlyButton
                  url={calendlyUrl}
                  label={t('notSureCta')}
                  size="lg"
                  className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
                />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <LeadMagnetModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} />
    </>
  );
}
