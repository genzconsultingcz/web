'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

const SECTIONS = [
  { title: 'controllerTitle', body: 'controllerBody' },
  { title: 'analyticsTitle', body: 'analyticsBody' },
  { title: 'cookiesTitle', body: 'cookiesBody' },
  { title: 'legalBasisTitle', body: 'legalBasisBody' },
  { title: 'retentionTitle', body: 'retentionBody' },
] as const;

const RIGHTS = ['right1', 'right2', 'right3', 'right4', 'right5', 'right6', 'right7'] as const;

export default function GdprPage() {
  const t = useTranslations('gdpr');

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[50vh] bg-gtc-deep flex flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary"
          >
            {t('eyebrow')}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            {t('title')}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl text-lg font-semibold text-white/60"
          >
            {t('intro')}
          </motion.p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[18vw] font-black leading-none text-white/5"
        >
          GDPR
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-12 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            {t('updated')}
          </p>

          <div className="space-y-12">
            {SECTIONS.map(({ title, body }, index) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.05}
              >
                <h2 className="mb-3 text-xl font-bold text-black">{t(title)}</h2>
                <p className="text-base leading-relaxed text-zinc-500">{t(body)}</p>
              </motion.div>
            ))}

            {/* Rights */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="mb-3 text-xl font-bold text-black">{t('rightsTitle')}</h2>
              <p className="mb-4 text-base leading-relaxed text-zinc-500">{t('rightsIntro')}</p>
              <ul className="mb-4 list-disc space-y-1.5 pl-5 text-base leading-relaxed text-zinc-500">
                {RIGHTS.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
              <p className="text-base leading-relaxed text-zinc-500">{t('rightsContact')}</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="mb-3 text-xl font-bold text-black">{t('complaintTitle')}</h2>
              <p className="text-base leading-relaxed text-zinc-500">{t('complaintBody')}</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="mb-3 text-xl font-bold text-black">{t('contactTitle')}</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-zinc-500">
                {t('contactBody')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
