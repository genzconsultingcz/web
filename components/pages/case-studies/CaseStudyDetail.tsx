'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowLeft, Mail, Quote } from 'lucide-react';
import { ContactButton } from '@/components/ui/ContactButton';
import type { CaseStudyQuery, CaseStudiesChromeQuery } from '../../../tina/__generated__/types';

// Strips __typename at every depth: the `cs` and `en` branches (and each of
// their nested objects) are structurally identical aside from that literal,
// so CaseStudyContent/CaseStudyDetailChrome accept either branch without a
// cast at the call site — same pattern as HomePage's HomeContent.
type DeepOmitTypename<T> = T extends readonly (infer U)[]
  ? DeepOmitTypename<U>[]
  : T extends object
    ? { [K in keyof T as K extends '__typename' ? never : K]: DeepOmitTypename<T[K]> }
    : T;

export type CaseStudyContent = DeepOmitTypename<
  NonNullable<NonNullable<CaseStudyQuery['caseStudy']>['cs']>
>;
export type CaseStudyDetailChrome = DeepOmitTypename<
  NonNullable<NonNullable<CaseStudiesChromeQuery['caseStudiesChrome']>['cs']>
>['detail'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

/* ── Animated count-up for a single numeric token ── */
function AnimatedNumber({ value, inView }: { value: number; inView: boolean }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return <>{n.toLocaleString('cs-CZ')}</>;
}

/* ── A stat whose digit groups count up when scrolled into view ── */
function AnimatedStat({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const tokens = value.match(/(\d+|\D+)/g) ?? [value];

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index * 0.1}
    >
      <div className="text-5xl font-black leading-none tracking-tight text-black sm:text-6xl">
        {tokens.map((tok, i) =>
          /^\d+$/.test(tok) ? (
            <AnimatedNumber key={i} value={parseInt(tok, 10)} inView={inView} />
          ) : (
            <span key={i}>{tok}</span>
          ),
        )}
      </div>
      <p className="mt-4 text-sm font-medium leading-relaxed text-black/70">{label}</p>
    </motion.div>
  );
}

function SectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <motion.p
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark"
    >
      <span className="text-gtc-primary">{num}</span>
      <span className="mx-2 text-zinc-300">·</span>
      {label}
    </motion.p>
  );
}

export default function CaseStudyDetail({
  cs,
  chrome,
}: {
  cs: CaseStudyContent | null | undefined;
  chrome: CaseStudyDetailChrome | null | undefined;
}) {
  const locale = useLocale();

  if (!cs || !chrome) return null;

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gtc-deep">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 select-none text-[16vw] font-black leading-none text-white/[0.04]"
        >
          {cs.year}
        </div>
        <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <Link
              href={`/${locale}/case-studies`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-gtc-primary"
            >
              <ArrowLeft className="size-3.5" />
              {chrome.back}
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="mt-12 flex items-center gap-4"
          >
            <span className="rounded-none bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
              {chrome.clientLabel}
            </span>
            {cs.logo && (
              <div className="flex items-center rounded-sm bg-white px-3 py-1.5">
                <Image
                  src={cs.logo}
                  alt={cs.logoAlt ?? ''}
                  width={130}
                  height={32}
                  className="h-7 w-auto object-contain grayscale"
                />
              </div>
            )}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.16}
            className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-gtc-primary"
          >
            {chrome.caseLabel} · {cs.year}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.22}
            className="mt-5 max-w-4xl text-4xl font-black leading-[1.07] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            {cs.hero?.headline}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70"
          >
            {cs.hero?.intro}
          </motion.p>

          {/* scope chips */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.38}
            className="mt-12 grid gap-px overflow-hidden border border-white/15 sm:grid-cols-3"
          >
            {(cs.scope ?? []).map((s) => (
              <div key={s?.label} className="bg-white/[0.03] px-6 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gtc-primary">
                  {s?.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-white/90">{s?.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STAT BAND ── */}
      <section className="bg-gtc-primary py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {(cs.stats ?? []).map((s, i) => (
              <AnimatedStat
                key={s?.label}
                value={s?.value ?? ''}
                label={s?.label ?? ''}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 01 · CONTEXT ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionEyebrow num="01" label={chrome.sectionContext ?? ''} />
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl"
          >
            {cs.context?.headline}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.08}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600"
          >
            {cs.context?.intro}
          </motion.p>

          {/* who is the client */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-8 border-t border-zinc-200 pt-10 md:grid-cols-[240px_1fr]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {cs.context?.clientLabel}
            </p>
            <p className="text-base leading-relaxed text-zinc-600">{cs.context?.client}</p>
          </motion.div>

          {/* why not routine */}
          <div className="mt-14 border-t border-zinc-200 pt-10">
            <motion.h3
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-xl font-black text-black"
            >
              {cs.context?.whyTitle}
            </motion.h3>
            {cs.context?.whyIntro && (
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.05}
                className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600"
              >
                {cs.context?.whyIntro}
              </motion.p>
            )}
            <div className="mt-8 grid gap-px overflow-hidden border border-zinc-200 sm:grid-cols-2">
              {(cs.context?.whyPoints ?? []).map((p, i) => (
                <motion.div
                  key={p?.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.06}
                  className="bg-zinc-50 p-7"
                >
                  <h4 className="text-base font-black text-black">{p?.title}</h4>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">{p?.body}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* our brief */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 border-l-4 border-l-gtc-primary bg-zinc-50 px-7 py-7"
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {cs.context?.briefLabel}
            </p>
            <p className="max-w-3xl text-base font-medium leading-relaxed text-zinc-700">
              {cs.context?.brief}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 02 · APPROACH ── */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionEyebrow num="02" label={chrome.sectionApproach ?? ''} />
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl"
          >
            {cs.approach?.headline}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.08}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600"
          >
            {cs.approach?.intro}
          </motion.p>

          {/* 3 steps */}
          <div className="mt-12 grid gap-px overflow-hidden border border-zinc-200 md:grid-cols-3">
            {(cs.approach?.steps ?? []).map((step, i) => (
              <motion.div
                key={step?.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="group bg-white p-8"
              >
                <span className="flex size-11 items-center justify-center bg-black text-lg font-black text-gtc-primary transition-colors group-hover:bg-gtc-dark">
                  {step?.num}
                </span>
                <h3 className="mt-6 text-base font-black uppercase tracking-wide text-black">
                  {step?.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{step?.body}</p>
              </motion.div>
            ))}
          </div>

          {/* what we assessed */}
          <div className="mt-16 border-t border-zinc-200 pt-10">
            <motion.h3
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-xl font-black text-black"
            >
              {cs.approach?.assessedTitle}
            </motion.h3>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
              className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600"
            >
              {cs.approach?.assessedIntro}
            </motion.p>
            <div className="mt-8 grid gap-px overflow-hidden border border-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {(cs.approach?.assessed ?? []).map((a, i) => (
                <motion.div
                  key={`${a?.num}${a?.title}`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={Math.min(i, 6) * 0.04}
                  className="flex gap-4 bg-white p-6"
                >
                  <span className="text-sm font-black text-gtc-primary">{a?.num}</span>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wide text-black">{a?.title}</h4>
                    {a?.body && <p className="mt-2 text-sm leading-relaxed text-zinc-600">{a?.body}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
            {cs.approach?.assessedNote && (
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-6 max-w-3xl text-sm italic leading-relaxed text-zinc-500"
              >
                {cs.approach?.assessedNote}
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* ── 03 · FINDINGS ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionEyebrow num="03" label={chrome.sectionFindings ?? ''} />
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl"
          >
            {cs.findings?.headline}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.08}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600"
          >
            {cs.findings?.intro}
          </motion.p>

          <div className="mt-12 flex flex-col gap-6">
            {(cs.findings?.items ?? []).map((item, i) => {
              const columns = [cs.findings?.column1, cs.findings?.column2, cs.findings?.column3];
              const cols = [item?.col1, item?.col2, item?.col3];
              return (
                <motion.article
                  key={item?.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.08}
                  className="border border-zinc-200 transition-colors hover:border-gtc-primary"
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-zinc-100 bg-zinc-50 px-7 py-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gtc-dark">
                      {item?.category}
                    </span>
                    <h3 className="text-lg font-black text-black">{item?.title}</h3>
                  </div>
                  <div className="grid gap-px bg-zinc-100 md:grid-cols-3">
                    {cols.map((col, c) => (
                      <div key={c} className="bg-white p-7">
                        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                          {columns[c]}
                        </p>
                        <p className="text-sm leading-relaxed text-zinc-700">{col}</p>
                      </div>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 04 · OUTPUTS ── */}
      <section className="bg-gtc-deep py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary"
          >
            <span className="text-gtc-primary">04</span>
            <span className="mx-2 text-white/30">·</span>
            {chrome.sectionOutputs}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl"
          >
            {cs.outputs?.headline}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.08}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70"
          >
            {cs.outputs?.intro}
          </motion.p>

          <div className="mt-12 grid gap-px overflow-hidden border border-white/15 md:grid-cols-2">
            {(cs.outputs?.items ?? []).map((o, i) => (
              <motion.div
                key={o?.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.07}
                className="flex gap-5 bg-white/[0.03] p-7"
              >
                <span className="text-lg font-black text-gtc-primary">{o?.num}</span>
                <div>
                  <h3 className="text-base font-black uppercase tracking-wide text-white">{o?.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/60">{o?.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* quote */}
          <motion.blockquote
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 border-l-4 border-l-gtc-primary py-2 pl-7"
          >
            <Quote className="size-7 text-gtc-primary" />
            <p className="mt-4 max-w-3xl text-xl font-medium leading-relaxed text-white sm:text-2xl">
              {cs.outputs?.quote}
            </p>
            <footer className="mt-5 text-sm font-bold uppercase tracking-[0.15em] text-white/50">
              {cs.outputs?.quoteAuthor}
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* ── 05 · WHY US ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionEyebrow num="05" label={chrome.sectionWhy ?? ''} />
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl"
          >
            {cs.whyUs?.headline}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.08}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600"
          >
            {cs.whyUs?.intro}
          </motion.p>

          <div className="mt-12 grid gap-px overflow-hidden border border-zinc-200 md:grid-cols-3">
            {(cs.whyUs?.pillars ?? []).map((p, i) => (
              <motion.div
                key={p?.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="bg-zinc-50 p-8"
              >
                <span className="text-sm font-black text-gtc-primary">{p?.num}</span>
                <h3 className="mt-4 text-base font-black uppercase tracking-wide text-black">{p?.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{p?.body}</p>
              </motion.div>
            ))}
          </div>

          {/* contact */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-zinc-200 pt-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
              {chrome.contactLabel}
            </p>
            <span className="text-sm font-semibold text-black">{cs.contact?.name}</span>
            <a
              href={`mailto:${cs.contact?.email}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-gtc-dark"
            >
              <Mail className="size-3.5" />
              {cs.contact?.email}
            </a>
          </motion.div>
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
            <h2 className="text-4xl font-black text-white md:text-5xl">{chrome.ctaTitle}</h2>
            <p className="mt-4 text-base text-white/60">{chrome.ctaDesc}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ContactButton
                  label={chrome.cta ?? ''}
                  size="lg"
                  className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black transition-colors hover:bg-gtc-primary/90"
                />
              <Link
                href={`/${locale}/case-studies`}
                className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.1em] text-white/60 transition-colors hover:text-gtc-primary"
              >
                {chrome.back}
                <ArrowLeft className="size-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
