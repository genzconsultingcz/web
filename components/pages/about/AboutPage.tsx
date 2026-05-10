'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
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

const values = [
  { num: '01', titleKey: 'value1Title', descKey: 'value1Desc' },
  { num: '02', titleKey: 'value2Title', descKey: 'value2Desc' },
  { num: '03', titleKey: 'value3Title', descKey: 'value3Desc' },
] as const;

export default function AboutPage() {
  const t = useTranslations('about');
  const { globalSettings } = useLayout();
  const calendlyUrl = (globalSettings?.header as any)?.calendlyUrl ?? '';

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] bg-gtc-primary flex flex-col justify-center overflow-hidden">
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
          GZ
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
                {t('storyLabel')}
              </p>
              <p className="text-lg leading-relaxed text-zinc-700">{t('storyText')}</p>
              <p className="text-lg leading-relaxed text-zinc-700">{t('storyText2')}</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="relative aspect-[4/3] overflow-hidden"
            >
              <Image
                src="/adam_speaking.jpeg"
                alt="Adam Dalecký speaking at an event"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gtc-deep/10 mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark text-center">
              {t('missionLabel')}
            </p>
            <blockquote className="border-l-4 border-gtc-primary pl-8">
              <p className="text-2xl font-black leading-snug text-black md:text-3xl">
                {t('missionText')}
              </p>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ── */}
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
              {t('valuesLabel')}
            </p>
          </motion.div>
          <div className="grid gap-px bg-zinc-200 sm:grid-cols-3">
            {values.map(({ num, titleKey, descKey }, i) => (
              <motion.div
                key={num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="group relative bg-white p-8 hover:bg-zinc-50 transition-colors duration-200"
              >
                <span className="text-5xl font-black text-zinc-100 select-none leading-none">
                  {num}
                </span>
                <h3 className="mt-4 text-lg font-black text-black">{t(titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{t(descKey)}</p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gtc-primary transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-gtc-deep py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary"
          >
            {t('teamLabel')}
          </motion.p>

          {/* Group photo */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative mb-14 aspect-video overflow-hidden"
          >
            <Image
              src="/team.jpeg"
              alt="GenZ Consulting team"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gtc-deep/20" />
          </motion.div>

          {/* Individual members */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Adam */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex gap-5"
            >
              <div className="relative h-28 w-20 shrink-0 overflow-hidden">
                <Image
                  src="/adam.jpeg"
                  alt="Adam Dalecký"
                  fill
                  className="object-cover object-center"
                  sizes="80px"
                />
              </div>
              <div>
                <p className="text-lg font-black text-white">{t('member1Name')}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gtc-primary">{t('member1Role')}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{t('member1Bio')}</p>
                <a
                  href="https://www.linkedin.com/in/adam-dalecky/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gtc-primary hover:text-white transition-colors duration-150"
                >
                  <Linkedin className="size-3.5" />
                  LinkedIn
                </a>
              </div>
            </motion.div>

            {/* Jonathan */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
              className="flex gap-5"
            >
              <div className="relative h-28 w-20 shrink-0 overflow-hidden">
                <Image
                  src="/jonathan.jpeg"
                  alt="Jonatan Petr"
                  fill
                  className="object-cover object-center"
                  sizes="80px"
                />
              </div>
              <div>
                <p className="text-lg font-black text-white">Jonatan Petr</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gtc-primary">Co-founder</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Součást GenZ Consulting od začátku. Pohled zevnitř generace, která ví jak firmy fungují.
                </p>
                <a
                  href="https://www.linkedin.com/in/jonatan-petr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gtc-primary hover:text-white transition-colors duration-150"
                >
                  <Linkedin className="size-3.5" />
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WORKSHOP PHOTO ── */}
      <section className="relative h-64 overflow-hidden bg-black sm:h-80">
        <Image
          src="/genzone_workshop.jpeg"
          alt="GenZ Consulting na Career Expo"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-center text-xl font-black uppercase tracking-widest text-white sm:text-2xl">
            Tým, který Gen Z žije zevnitř.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-black py-24">
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
