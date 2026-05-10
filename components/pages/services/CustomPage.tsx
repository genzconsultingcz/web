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

export default function CustomPage() {
  const t = useTranslations('customSolution');
  const { globalSettings } = useLayout();
  const calendlyUrl = (globalSettings?.header as any)?.calendlyUrl ?? '';
  const [leadOpen, setLeadOpen] = useState(false);

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
            className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-black/50"
          >
            {t('eyebrow')}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-5xl font-black leading-[1.05] tracking-tight text-black sm:text-6xl md:text-7xl max-w-3xl"
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
          05
        </div>
      </section>

      {/* ── WHAT IT IS ── */}
      <section className="bg-white py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-b border-zinc-100 py-12"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">{t('whatLabel')}</p>
              </div>
              <div>
                <p className="text-base leading-relaxed text-zinc-600">{t('whatText')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.05}
          className="py-12"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">{t('forLabel')}</p>
              </div>
              <div>
                <p className="text-base leading-relaxed text-zinc-600">{t('forText')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── PROCESS TEASER ── */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { num: '01', title: 'We find out what\'s wrong', desc: 'A quick, no-obligation call to understand your situation and whether we can help.' },
              { num: '02', title: 'We get to know your company', desc: 'Deep dive into your context, goals, and the problem from every angle.' },
              { num: '03', title: 'We build a tailored solution', desc: 'A solution designed precisely for you — whether a known product or something built from scratch.' },
            ].map(({ num, title, desc }, i) => (
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
                {i < 2 && (
                  <div className="absolute -right-4 top-8 hidden text-zinc-300 md:block">→</div>
                )}
              </motion.div>
            ))}
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
            <h2 className="text-4xl font-black text-white md:text-5xl">
              Let's start with a conversation.
            </h2>
            <p className="mt-4 text-base text-white/60">
              No commitment. We'll find out together what your company needs.
            </p>
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
