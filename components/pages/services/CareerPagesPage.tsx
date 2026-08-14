'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ContactButton } from '@/components/ui/ContactButton';
import type { ServiceQuery } from '../../../tina/__generated__/types';

type DeepOmitTypename<T> = T extends readonly (infer U)[]
  ? DeepOmitTypename<U>[]
  : T extends object
    ? { [K in keyof T as K extends '__typename' ? never : K]: DeepOmitTypename<T[K]> }
    : T;

export type ServiceContent = DeepOmitTypename<
  NonNullable<NonNullable<ServiceQuery['service']>['cs']>
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

function DetailRow({
  label,
  text,
  index = 0,
}: {
  label: string;
  text: string;
  index?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index * 0.05}
      className="border-b border-zinc-100 py-12 last:border-b-0"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">{label}</p>
          </div>
          <div>
            <p className="text-base leading-relaxed text-zinc-600">{text}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CareerPagesPage({
  num,
  content,
}: {
  num: string;
  content: ServiceContent | null | undefined;
}) {
  if (!content) return null;

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
            {content.hero?.eyebrow ?? ''}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-5xl font-black leading-[1.05] tracking-tight text-black whitespace-pre-line sm:text-6xl md:text-7xl"
          >
            {content.hero?.title ?? ''}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl text-base text-black/60 md:text-lg"
          >
            {content.hero?.subtitle ?? ''}
          </motion.p>

          <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="mt-10"
            >
              <ContactButton
                label={content.hero?.cta ?? ''}
                size="lg"
                className="rounded-none bg-black px-8 py-4 text-sm font-bold text-white hover:bg-black/80 transition-colors"
              />
            </motion.div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 select-none text-[18vw] font-black leading-none text-black/5"
        >
          {num}
        </div>
      </section>

      {/* ── DETAIL SECTIONS ── */}
      <section className="bg-white">
        {(content.sections ?? []).map((s, i) => (
          <DetailRow key={i} label={s?.label ?? ''} text={s?.text ?? ''} index={i} />
        ))}
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
                {content.timeline?.label ?? ''}
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
            >
              <p className="text-base leading-relaxed text-zinc-600">{content.timeline?.text ?? ''}</p>
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
            <h2 className="text-4xl font-black text-white md:text-5xl">
              {content.finalCta?.title ?? content.hero?.title ?? ''}
            </h2>
            <p className="mt-4 text-base text-white/60">
              {content.finalCta?.desc ?? content.hero?.subtitle ?? ''}
            </p>
            <div className="mt-10">
              <ContactButton
                label={content.hero?.cta ?? ''}
                size="lg"
                className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
}
