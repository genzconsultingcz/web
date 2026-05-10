'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Download, ExternalLink } from 'lucide-react';
import { CalendlyButton } from '@/components/ui/CalendlyButton';
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

const CASE_STUDIES = [
  {
    clientKey: 'cs1Client' as const,
    serviceKey: 'cs1Service' as const,
    descKey: 'cs1Desc' as const,
    resultKey: 'cs1Result' as const,
    logo: '/AV-MEDIA-SYSTEMS_horizontalni_1200_1200-970x970.png',
    logoAlt: 'AV Media Systems',
    pdf: '/AV Media x GenZ Consulting - Case study.pdf',
    pdfName: 'AV-Media-x-GenZ-Consulting-Case-study.pdf',
  },
  {
    clientKey: 'cs2Client' as const,
    serviceKey: 'cs2Service' as const,
    descKey: 'cs2Desc' as const,
    resultKey: 'cs2Result' as const,
    logo: '/globalpayments.jpeg',
    logoAlt: 'Global Payments',
    pdf: '/Global payments x GenZ Consulting - Case study.pdf',
    pdfName: 'Global-Payments-x-GenZ-Consulting-Case-study.pdf',
  },
  {
    clientKey: 'cs3Client' as const,
    serviceKey: 'cs3Service' as const,
    descKey: 'cs3Desc' as const,
    resultKey: 'cs3Result' as const,
    logo: '/logo-orizzontale.2020-07-16-17-41-47.jpeg',
    logoAlt: 'Generali',
    pdf: '/Generali x GenZ Consulting - Case study.pdf',
    pdfName: 'Generali-x-GenZ-Consulting-Case-study.pdf',
  },
];

export default function CaseStudiesPage() {
  const t = useTranslations('caseStudies');
  const { globalSettings } = useLayout();
  const calendlyUrl = (globalSettings?.header as any)?.calendlyUrl ?? '';

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] bg-gtc-primary flex flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-black/50"
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
            className="mt-6 max-w-xl text-lg font-semibold text-black/60"
          >
            {t('subtitle')}
          </motion.p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[18vw] font-black leading-none text-black/5"
        >
          CS
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {CASE_STUDIES.map(({ clientKey, serviceKey, descKey, resultKey, logo, logoAlt, pdf, pdfName }, i) => (
              <motion.article
                key={clientKey}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="group flex flex-col border border-zinc-200 hover:border-gtc-primary transition-colors duration-200"
              >
                {/* Card top */}
                <div className="flex flex-col gap-3 p-7 pb-6">
                  {logo && logoAlt ? (
                    <div className="mb-1 h-8 flex items-center">
                      <Image
                        src={logo}
                        alt={logoAlt}
                        width={120}
                        height={32}
                        className="h-8 w-auto object-contain grayscale opacity-60 group-hover:opacity-90 group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  ) : null}
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-gtc-dark">
                    {t(serviceKey)}
                  </span>
                  <h2 className="text-xl font-black text-black leading-tight">{t(clientKey)}</h2>
                  <p className="text-sm leading-relaxed text-zinc-500">{t(descKey)}</p>
                </div>

                {/* Result box */}
                <div className="border-t border-l-4 border-t-zinc-100 border-l-gtc-primary bg-zinc-50 px-6 py-5">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-gtc-dark">
                    {t('resultLabel')}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-700 font-medium">
                    {t(resultKey)}
                  </p>
                </div>

                {/* PDF actions */}
                <div className="mt-auto flex gap-0 border-t border-zinc-100">
                  <a
                    href={pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors duration-150"
                  >
                    <ExternalLink className="size-3.5" />
                    {t('viewPdf')}
                  </a>
                  <div className="w-px bg-zinc-100" />
                  <a
                    href={pdf}
                    download={pdfName}
                    className="flex flex-1 items-center justify-center gap-1.5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors duration-150"
                  >
                    <Download className="size-3.5" />
                    {t('downloadPdf')}
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gtc-deep py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl font-black text-white md:text-5xl">{t('ctaTitle')}</h2>
            <p className="mt-4 text-base text-white/60">{t('ctaDesc')}</p>
            {calendlyUrl && (
              <div className="mt-10">
                <CalendlyButton
                  url={calendlyUrl}
                  label={t('cta')}
                  size="lg"
                  className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
