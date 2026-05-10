'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, Check, Quote } from 'lucide-react';
import { CalendlyButton } from '@/components/ui/CalendlyButton';
import { LeadMagnetModal } from '@/components/ui/LeadMagnetModal';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
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

const LOGOS = [
  { name: 'Global Payments', src: '/globalpayments.jpeg' },
  { name: 'Generali', src: '/logo-orizzontale.2020-07-16-17-41-47.jpeg' },
  { name: 'AV Media', src: '/AV-MEDIA-SYSTEMS_horizontalni_1200_1200-970x970.png' },
  { name: 'Raynet', src: '/LOGO_Raynet_big.png' },
  { name: 'ČZU', src: '/CZU_logotyp_V_zelena.png' },
  { name: 'CITA', src: '/CITALogo.png' },
  { name: 'TAP', src: '/tap_logo.png' },
];

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const { globalSettings } = useLayout();
  const calendlyUrl = (globalSettings?.header as any)?.calendlyUrl ?? '';
  const [leadOpen, setLeadOpen] = useState(false);

  const services = [
    { num: t('service1Number'), title: t('service1Title'), desc: t('service1Desc'), slug: t('service1Slug') },
    { num: t('service2Number'), title: t('service2Title'), desc: t('service2Desc'), slug: t('service2Slug') },
    { num: t('service3Number'), title: t('service3Title'), desc: t('service3Desc'), slug: t('service3Slug') },
    { num: t('service4Number'), title: t('service4Title'), desc: t('service4Desc'), slug: t('service4Slug') },
  ];

  const steps = [
    { num: t('step1Number'), title: t('step1Title'), desc: t('step1Desc') },
    { num: t('step2Number'), title: t('step2Title'), desc: t('step2Desc') },
    { num: t('step3Number'), title: t('step3Title'), desc: t('step3Desc') },
  ];

  const caseStudies = [
    { client: t('cs1Client'), service: t('cs1Service'), result: t('cs1Result') },
    { client: t('cs2Client'), service: t('cs2Service'), result: t('cs2Result') },
    { client: t('cs3Client'), service: t('cs3Service'), result: t('cs3Result') },
  ];

  const stats = [
    { num: t('stat1Number'), label: t('stat1Label') },
    { num: t('stat2Number'), label: t('stat2Label') },
    { num: t('stat3Number'), label: t('stat3Label') },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] bg-gtc-primary flex flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-black/50"
          >
            {t('heroEyebrow')}
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-5xl font-black leading-[1.05] tracking-tight text-black sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {t('heroHeadline1')}
              <br />
              {t('heroHeadline2')}
            </motion.h1>
          </div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 text-2xl font-bold text-black/70 md:text-3xl"
          >
            {t('heroSubline')}
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-5 max-w-xl text-base text-black/60 md:text-lg"
          >
            {t('heroBody')}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-10 flex flex-wrap gap-3"
          >
            {calendlyUrl && (
              <CalendlyButton
                url={calendlyUrl}
                label={t('heroPrimaryCta')}
                size="lg"
                className="rounded-none bg-black px-8 py-4 text-sm font-bold text-white hover:bg-black/80 transition-colors"
              />
            )}
            <button
              onClick={() => setLeadOpen(true)}
              className="rounded-none border-2 border-black bg-transparent px-8 py-4 text-sm font-bold text-black hover:bg-black/10 transition-colors"
            >
              {t('heroSecondaryCta')}
            </button>
          </motion.div>
        </div>

        {/* decorative large text */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[20vw] font-black leading-none text-black/5"
        >
          GZ
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="overflow-hidden bg-black py-3.5">
        <InfiniteSlider gap={48} speed={60}>
          {['WORKSHOP', 'ONBOARDING', 'GEN Z FIRST', '50+ FIREM', 'REAL TALK', 'TRAINEE PROGRAM', 'EMPLOYER BRANDING'].map((item) => (
            <span key={item} className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
              {item}&nbsp;&nbsp;·
            </span>
          ))}
        </InfiniteSlider>
      </div>

      {/* ── LOGOS ── */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-400"
          >
            {t('logosEyebrow')}
          </motion.p>
          <div className="overflow-hidden">
            <InfiniteSlider gap={64} speed={40} speedOnHover={20}>
              {LOGOS.map(({ name, src }) => (
                <div key={name} className="flex h-10 items-center">
                  {src ? (
                    <Image
                      src={src}
                      alt={name}
                      width={120}
                      height={40}
                      className="h-8 w-auto object-contain grayscale opacity-50 hover:opacity-80 hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-sm font-bold uppercase tracking-widest text-zinc-300">{name}</span>
                  )}
                </div>
              ))}
            </InfiniteSlider>
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="bg-gtc-deep py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 md:grid-cols-2">
            {/* Problem */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary">
                {t('problemEyebrow')}
              </p>
              <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
                {t('problemTitle')}
              </h2>
              <p className="mt-4 text-base font-semibold text-white/60 italic">
                {t('problemVillain')}
              </p>
              <ul className="mt-6 space-y-3">
                {[t('problemItem1'), t('problemItem2'), t('problemItem3')].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gtc-primary" />
                    <span className="text-sm leading-relaxed text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solution */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary">
                {t('solutionEyebrow')}
              </p>
              <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
                {t('solutionTitle')}
              </h2>
              <p className="mt-2 text-xl font-black text-gtc-primary md:text-2xl">
                {t('solutionSubtitle')}
              </p>
              <ul className="mt-6 space-y-3">
                {[t('solutionItem1'), t('solutionItem2'), t('solutionItem3')].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-gtc-primary" />
                    <span className="text-sm leading-relaxed text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {t('servicesEyebrow')}
            </p>
            <h2 className="text-3xl font-black text-black md:text-4xl">{t('servicesTitle')}</h2>
          </motion.div>

          <div className="grid gap-px bg-zinc-200 sm:grid-cols-2">
            {services.map(({ num, title, desc, slug }, i) => (
              <motion.div
                key={slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="group relative bg-white p-8 hover:bg-zinc-50 transition-colors duration-200"
              >
                <span className="text-4xl font-black text-zinc-100 select-none">{num}</span>
                <h3 className="mt-3 text-lg font-black text-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{desc}</p>
                <Link
                  href={`/${locale}/services/${slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gtc-dark hover:text-black transition-colors duration-150"
                >
                  {t('servicesLearnMore')}
                  <ArrowRight className="size-3" />
                </Link>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gtc-primary transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 text-right"
          >
            <Link
              href={`/${locale}/services`}
              className="text-sm font-bold text-zinc-400 hover:text-black transition-colors duration-150"
            >
              {t('servicesViewAll')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {t('processEyebrow')}
            </p>
            <h2 className="text-3xl font-black text-black md:text-4xl">{t('processTitle')}</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="relative"
              >
                <div className="text-6xl font-black leading-none text-gtc-primary">{num}</div>
                <h3 className="mt-4 text-lg font-black text-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{desc}</p>
                {i < steps.length - 1 && (
                  <div className="absolute -right-4 top-8 hidden text-zinc-300 md:block">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {t('csEyebrow')}
            </p>
            <h2 className="text-3xl font-black text-black md:text-4xl">{t('csTitle')}</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {caseStudies.map(({ client, service, result }, i) => (
              <motion.div
                key={client}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="border border-zinc-200 p-7 hover:border-gtc-primary transition-colors duration-200"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-gtc-dark">{service}</span>
                <h3 className="mt-2 text-lg font-black text-black">{client}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{result}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 text-right"
          >
            <Link
              href={`/${locale}/case-studies`}
              className="text-sm font-bold text-zinc-400 hover:text-black transition-colors duration-150"
            >
              {t('csViewAll')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gtc-primary py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map(({ num, label }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="text-center"
              >
                <div className="text-6xl font-black text-black md:text-7xl">{num}</div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-black/60">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary"
          >
            {t('testimonialsEyebrow')}
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
          >
            <Quote className="mb-6 size-10 text-gtc-primary" fill="currentColor" />
            <blockquote className="text-2xl font-black leading-snug text-white md:text-3xl lg:text-4xl lg:max-w-3xl">
              {t('testimonial1Quote')}
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-8 bg-gtc-primary" />
              <div>
                <p className="text-sm font-bold text-white">{t('testimonial1Author')}</p>
                <p className="text-xs text-white/40">{t('testimonial1Role')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
                {t('teamEyebrow')}
              </p>
              <h2 className="text-3xl font-black leading-tight text-black md:text-4xl">
                {t('teamTitle')}
              </h2>
              <div className="mt-8 border-l-2 border-gtc-primary pl-6">
                <p className="text-xl font-black text-black">{t('member1Name')}</p>
                <p className="mt-0.5 text-sm font-semibold text-gtc-dark">{t('member1Role')}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{t('member1Bio')}</p>
              </div>
              <Link
                href={`/${locale}/about`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-zinc-400 hover:text-black transition-colors duration-150"
              >
                {t('teamViewAbout')}
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
              className="relative aspect-[4/5] overflow-hidden bg-zinc-100"
            >
              <Image
                src="/adam.jpeg"
                alt="Adam Dalecký — GenZ Consulting"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gtc-primary/10 mix-blend-multiply" />
            </motion.div>
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
            <div className="mt-10 flex flex-wrap gap-3">
              {calendlyUrl && (
                <CalendlyButton
                  url={calendlyUrl}
                  label={t('ctaPrimary')}
                  size="lg"
                  className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
                />
              )}
              <button
                onClick={() => setLeadOpen(true)}
                className="rounded-none border-2 border-white/30 px-8 py-4 text-sm font-bold text-white hover:border-white hover:bg-white/5 transition-colors"
              >
                {t('ctaSecondary')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <LeadMagnetModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} />
    </>
  );
}
