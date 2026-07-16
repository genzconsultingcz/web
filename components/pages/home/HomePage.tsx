'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, ArrowDown, Check, Quote, Linkedin, Download } from 'lucide-react';
import { CalendlyButton } from '@/components/ui/CalendlyButton';
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
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:min-h-[90vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-24">
          {/* ── LEFT: text ── */}
          <div className="order-2 lg:order-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-8 flex items-center gap-3"
            >
              <span aria-hidden className="h-px w-10 bg-black/40" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-black/50">
                {t('heroEyebrow')}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-5xl font-black leading-[1.04] tracking-tight text-black sm:text-6xl md:text-7xl"
            >
              {t('heroHeadline1')}{' '}
              {(() => {
                const h2 = t('heroHeadline2');
                const m = h2.match(/^(.*?)([.!?]*)$/);
                const word = m?.[1] ?? h2;
                const trail = m?.[2] ?? '';
                return (
                  <>
                    <span className="relative inline-block whitespace-nowrap">
                      <span
                        aria-hidden
                        className="absolute -inset-x-3 -inset-y-1 -z-0 rounded-[0.55em] bg-gtc-primary"
                      />
                      <span
                        aria-hidden
                        className="absolute -bottom-2 left-7 -z-0 h-5 w-5 rotate-45 bg-gtc-primary"
                      />
                      <span className="relative z-10">{word}</span>
                    </span>
                    {trail}
                  </>
                );
              })()}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="mt-8 text-2xl font-bold text-black/70 md:text-3xl"
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
                  className="rounded-full bg-black px-8 py-4 text-sm font-bold text-white hover:bg-black/80 transition-colors"
                />
              )}
              <a
                href="#pdf-guide"
                className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-transparent px-8 py-4 text-sm font-bold text-black hover:bg-black hover:text-white transition-colors"
              >
                {t('heroSecondaryCta')}
                <ArrowDown className="size-4" />
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: team photo in a Gen-Z sticker frame (bottom intentionally cropped) ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.25}
            className="relative order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-md"
          >
            {/* offset teal sticker panel behind */}
            <div
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.75rem] bg-gtc-primary"
            />

            {/* soft glow/bubble effect extending into white background */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.18),transparent_45%)] blur-3xl opacity-80"
            />

            {/* framed photo — object-top + square ratio crops the lower legs cleanly */}
            <div className="relative aspect-square overflow-hidden rounded-[2.75rem] border-[3px] border-black bg-gradient-to-b from-gtc-primary/20 via-gtc-primary/10 to-white shadow-[0_0_0_1px_rgba(16,185,129,0.12)]">
              <Image
                src="/team_no_bg.png"
                alt="Tým GenZ Consulting"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </motion.div>
        </div>
      </section>

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
        </div>
        <div className="overflow-hidden w-full px-6">
          <InfiniteSlider gap={64} speed={40} speedOnHover={20} className="w-full">
            {LOGOS.map(({ name, src }) => (
              <div key={name} className="flex items-center justify-center">
                {src ? (
                  <Image
                    src={src}
                    alt={name}
                    width={0}
                    height={0}
                    sizes="200px"
                    style={{ height: '2.5rem', width: 'auto' }}
                    className="grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="text-sm font-bold uppercase tracking-widest text-zinc-300">{name}</span>
                )}
              </div>
            ))}
          </InfiniteSlider>
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
            className="mb-14 border-b border-zinc-200 pb-10"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-gtc-primary" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
                {t('servicesEyebrow')}
              </p>
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-black md:text-5xl">
              {t('servicesTitle')}
            </h2>
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
                <span className="text-4xl font-black text-gtc-primary select-none">{num}</span>
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

      {/* ── PDF GUIDE ── */}
      <section id="pdf-guide" className="bg-[#0c0c0c] py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            {/* Left */}
            <div>
              <div className="mb-6 flex items-center gap-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-gtc-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">
                  {t('pdfBadge')}
                </span>
              </div>
              <h2 className="text-4xl font-black leading-[1.05] text-white md:text-5xl">
                {t('pdfHeadline')}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/50">
                {t('pdfBody')}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/downloads/legit-check.pdf"
                  download
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gtc-primary px-7 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
                >
                  <Download className="size-4" />
                  {t('pdfCta')}
                </a>
                {calendlyUrl && (
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/50 hover:bg-white/5"
                  >
                    {t('pdfSecondaryCta')}
                    <ArrowRight className="size-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Right: PDF cover card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="hidden lg:block"
            >
              <div
                className="relative flex w-[260px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-white p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
                style={{ aspectRatio: '3/4', transform: 'rotate(3deg)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/35">
                  GZC · GUIDE 01
                </p>
                <div>
                  <h3 className="text-2xl font-black leading-tight text-black">
                    {t('pdfCoverTitle')}
                  </h3>
                  <div className="mt-6 space-y-2">
                    <div className="h-[3px] w-full rounded-full bg-black" />
                    <div className="h-[3px] w-2/3 rounded-full bg-gtc-primary" />
                    <div className="h-[2px] w-2/5 rounded-full bg-black/15" />
                  </div>
                  <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                    {t('pdfCoverMeta')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
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
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {t('teamEyebrow')}
            </p>
            <h2 className="text-3xl font-black leading-tight text-black md:text-4xl">
              {t('teamTitle')}
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {[
              {
                name: t('member1Name'),
                role: t('member1Role'),
                bio: t('member1Bio'),
                img: '/adam_cropped.jpeg',
                linkedin: 'https://www.linkedin.com/in/adam-dalecky/',
              },
              {
                name: t('member2Name'),
                role: t('member2Role'),
                bio: t('member2Bio'),
                img: '/jonathan_cropped.jpeg',
                linkedin: 'https://www.linkedin.com/in/jonatan-petr/',
              },
            ].map((m, i) => (
              <motion.div
                key={m.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="group flex gap-6 p-6 transition-colors duration-200"
              >
                <div className="relative h-40 w-28 shrink-0 overflow-hidden">
                  <Image
                    src={m.img}
                    alt={`${m.name} — GenZ Consulting`}
                    fill
                    className="object-cover object-[center_0%]"
                    sizes="112px"
                  />
                  <div className="absolute inset-0 bg-gtc-primary/10 mix-blend-multiply" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-black text-black">{m.name}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gtc-dark">{m.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{m.bio}</p>
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-zinc-400 transition-colors duration-150 hover:text-gtc-dark"
                  >
                    <Linkedin className="size-3.5" />
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <Link
            href={`/${locale}/about`}
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-zinc-400 hover:text-black transition-colors duration-150"
          >
            {t('teamViewAbout')}
          </Link>
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
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-4xl font-black text-white md:text-5xl">{t('ctaTitle')}</h2>
            <p className="mt-4 text-base text-white/60">{t('ctaDesc')}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {calendlyUrl && (
                <CalendlyButton
                  url={calendlyUrl}
                  label={t('ctaPrimary')}
                  size="lg"
                  className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
                />
              )}
              <a
                href="#pdf-guide"
                className="rounded-none border-2 border-white/30 px-8 py-4 text-sm font-bold text-white hover:border-white hover:bg-white/5 transition-colors"
              >
                {t('ctaSecondary')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
}
