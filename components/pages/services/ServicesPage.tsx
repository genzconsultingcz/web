'use client';
import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ContactButton } from '@/components/ui/ContactButton';
import type { ServicesChromeQuery } from '../../../tina/__generated__/types';

// Strips __typename at every depth: the `cs` and `en` chrome branches are
// structurally identical aside from that literal, so this type accepts either
// without a cast at the call site — same pattern as HomePage's HomeContent.
type DeepOmitTypename<T> = T extends readonly (infer U)[]
  ? DeepOmitTypename<U>[]
  : T extends object
    ? { [K in keyof T as K extends '__typename' ? never : K]: DeepOmitTypename<T[K]> }
    : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

export interface ServiceCard {
  slug: string;
  num: string;
  title: string;
  desc: string;
  featured: boolean;
}

export type ServicesPageChrome = DeepOmitTypename<
  NonNullable<NonNullable<ServicesChromeQuery['servicesChrome']>['cs']>
>;

export default function ServicesPage({
  chrome,
  cards,
}: {
  chrome: ServicesPageChrome | null | undefined;
  cards: ServiceCard[];
}) {
  const locale = useLocale();

  if (!chrome) return null;

  const standard = cards.filter((c) => !c.featured);
  const featured = cards.filter((c) => c.featured);

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
            {chrome.hero?.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-5xl font-black leading-[1.05] tracking-tight text-black sm:text-6xl md:text-7xl"
          >
            {chrome.hero?.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl text-base text-black/60 md:text-lg"
          >
            {chrome.hero?.subtitle}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-10"
          >
            <ContactButton
              label={chrome.hero?.cta ?? ''}
              size="lg"
              className="rounded-none bg-black px-8 py-4 text-sm font-bold text-white hover:bg-black/80 transition-colors"
            />
          </motion.div>
        </div>

      </section>

      {/* ── SERVICE CARDS ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-px bg-zinc-200 sm:grid-cols-2">
            {standard.map((c, i) => (
              <motion.div
                key={c.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="group relative bg-white p-10 hover:bg-zinc-50 transition-colors duration-200"
              >
                <span className="text-5xl font-black text-zinc-100 select-none leading-none">{c.num}</span>
                <h2 className="mt-4 text-xl font-black text-black">{c.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{c.desc}</p>
                <Link
                  href={`/${locale}/services/${c.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gtc-dark hover:text-black transition-colors duration-150"
                >
                  {chrome.learnMore}
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gtc-primary transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}

            {/* Custom solution card — spans full width on small, single col on large */}
            {featured.map((c) => (
              <motion.div
                key={c.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.4}
                className="group relative bg-zinc-50 p-10 hover:bg-zinc-100 transition-colors duration-200 sm:col-span-2"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <span className="text-5xl font-black text-zinc-200 select-none leading-none">{c.num}</span>
                    <h2 className="mt-4 text-xl font-black text-black">{c.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">{c.desc}</p>
                  </div>
                  <Link
                    href={`/${locale}/services/${c.slug}`}
                    className="shrink-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gtc-dark hover:text-black transition-colors duration-150"
                  >
                    {chrome.learnMore}
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gtc-primary transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
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
            <h2 className="text-4xl font-black text-white md:text-5xl">{chrome.notSure?.title}</h2>
            <p className="mt-4 text-base text-white/60">{chrome.notSure?.desc}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ContactButton
                label={chrome.notSure?.cta ?? ''}
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
