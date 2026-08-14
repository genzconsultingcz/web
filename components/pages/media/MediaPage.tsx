'use client';
import React from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { cs as csLocale, enUS as enLocale } from 'date-fns/locale';
import { ContactButton } from '@/components/ui/ContactButton';
import posthog from 'posthog-js';
import type { PressChromeQuery } from '../../../tina/__generated__/types';

// Strips __typename at every depth: the `cs` and `en` chrome branches are
// structurally identical aside from that literal, so this type accepts either
// without a cast at the call site — same pattern as CaseStudiesPage.
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

export type PressChrome = DeepOmitTypename<NonNullable<NonNullable<PressChromeQuery['pressChrome']>['cs']>>;

export type PressMention = {
  slug: string;
  outlet: string;
  author: string;
  title: string;
  date: string;
  url: string;
  summary: string;
};

export default function MediaPage({
  chrome,
  items,
}: {
  chrome: PressChrome | null | undefined;
  items: PressMention[];
}) {
  const locale = useLocale();

  if (!chrome) return null;

  const formatDate = (iso: string): string | null => {
    if (!iso) return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return locale === 'cs'
      ? format(date, 'd. M. yyyy', { locale: csLocale })
      : format(date, 'MMM d, yyyy', { locale: enLocale });
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative flex min-h-[55vh] flex-col justify-center overflow-hidden bg-gtc-primary">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-black/50"
          >
            {chrome.eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-5xl font-black leading-[1.05] tracking-tight text-black sm:text-6xl md:text-7xl"
          >
            {chrome.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl text-lg font-semibold text-black/60"
          >
            {chrome.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark"
          >
            {chrome.sectionLabel}
          </motion.p>

          <div className="relative">
            {/* vertical rule */}
            <div aria-hidden className="absolute bottom-2 left-0 top-2 w-px bg-zinc-200 sm:left-32" />
            <ol className="space-y-14">
              {items.map((item, i) => {
                const dateLabel = formatDate(item.date);
                return (
                  <li key={item.slug} className="relative grid gap-2 sm:grid-cols-[8rem_1fr] sm:gap-8">
                    {/* date */}
                    <motion.span
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i * 0.05}
                      className="pt-1 pl-8 text-xs font-bold uppercase tracking-wider text-zinc-400 sm:pl-3 sm:pt-1.5"
                    >
                      {dateLabel ?? ''}
                    </motion.span>

                    {/* dot on the rule */}
                    <span
                      aria-hidden
                      className="absolute -left-[3px] top-[0.3rem] size-2 rounded-full bg-gtc-primary sm:left-[7.75rem]"
                    />

                    <motion.div
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={0.05 + i * 0.05}
                      className="pl-8 sm:pl-0"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gtc-dark">
                        {item.outlet}
                      </p>
                      {item.author && (
                        <p className="mt-1 text-xs font-semibold text-zinc-400">{item.author}</p>
                      )}
                      <h3 className="mt-3 text-xl font-black leading-snug text-black">
                        {item.url ? (
                          <a
                            href={item.url}
                            onClick={() => posthog.capture('external_article_opened', { outlet: item.outlet })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-start gap-2 transition-colors duration-150 hover:text-gtc-dark"
                          >
                            <span className="underline decoration-zinc-300 decoration-2 underline-offset-4 transition-colors duration-150 group-hover:decoration-gtc-primary">
                              {item.title}
                            </span>
                            <ArrowUpRight className="mt-1 size-4 shrink-0 text-gtc-dark opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      {item.summary && (
                        <p className="mt-3 text-sm leading-relaxed text-zinc-500">{item.summary}</p>
                      )}
                      {item.url && (
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gtc-dark">
                          <ExternalLink className="size-3.5" />
                          {chrome.readArticle}
                        </span>
                      )}
                    </motion.div>
                  </li>
                );
              })}
            </ol>
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
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-4xl font-black text-white md:text-5xl">{chrome.ctaTitle}</h2>
            <p className="mt-4 text-base text-white/60">{chrome.ctaDesc}</p>
            <div className="mt-10">
              <ContactButton
                label={chrome.cta ?? ''}
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
