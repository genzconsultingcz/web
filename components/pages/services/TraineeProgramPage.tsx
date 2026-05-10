'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
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

interface DetailRowProps {
  label: string;
  text: string;
  index?: number;
  dark?: boolean;
}

function DetailRow({ label, text, index = 0, dark = false }: DetailRowProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index * 0.05}
      className={`border-b border-zinc-100 py-12 last:border-b-0 ${dark ? 'border-white/10' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <div>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? 'text-gtc-primary' : 'text-gtc-dark'}`}>
              {label}
            </p>
          </div>
          <div>
            <p className={`text-base leading-relaxed ${dark ? 'text-white/70' : 'text-zinc-600'}`}>{text}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TraineeProgramPage() {
  const t = useTranslations('traineeProgram');
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

        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[18vw] font-black leading-none text-black/5"
        >
          01
        </div>
      </section>

      {/* ── DETAIL SECTIONS ── */}
      <section className="bg-white">
        <DetailRow label={t('whatLabel')} text={t('whatText')} index={0} />
        <DetailRow label={t('gainLabel')} text={t('gainText')} index={1} />
        <DetailRow label={t('forLabel')} text={t('forText')} index={2} />
        <DetailRow label={t('differentiatorLabel')} text={t('differentiatorText')} index={3} />
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
                {t('timelineLabel')}
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
            >
              <p className="text-2xl font-black text-black">{t('timelineText')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-gtc-deep py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl font-black text-white md:text-5xl">{t('title')}</h2>
            <p className="mt-4 text-base text-white/60">{t('subtitle')}</p>
            <div className="mt-10">
              {calendlyUrl && (
                <CalendlyButton
                  url={calendlyUrl}
                  label={t('cta')}
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
