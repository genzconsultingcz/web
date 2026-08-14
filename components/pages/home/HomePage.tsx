'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { ArrowRight, Quote, Linkedin, Download, Play } from 'lucide-react';
import { ContactButton } from '@/components/ui/ContactButton';
import { useVideoDialog } from '@/components/ui/VideoDialogContext';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import posthog from 'posthog-js';
import type { HomeQuery } from '../../../tina/__generated__/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

// Strips __typename at every depth: the `cs` and `en` branches (and each of
// their nested objects — hero, problem, services.items, testimonials.items,
// etc.) are structurally identical aside from that literal (e.g. 'HomeCsHero'
// vs 'HomeEnHero'), and page.tsx picks whichever branch matches the requested
// locale — so HomeContent must accept either without a cast at the call site.
type DeepOmitTypename<T> = T extends readonly (infer U)[]
  ? DeepOmitTypename<U>[]
  : T extends object
    ? { [K in keyof T as K extends '__typename' ? never : K]: DeepOmitTypename<T[K]> }
    : T;

export type HomeContent = DeepOmitTypename<NonNullable<NonNullable<HomeQuery['home']>['cs']>>;
export type HomeLogos = NonNullable<HomeQuery['home']>['logos'];

function TestimonialSlider({ content }: { content: HomeContent['testimonials'] }) {
  const testimonials = content?.items ?? [];
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  const syncActive = () => {
    const el = sliderRef.current;
    if (!el) return;
    const per = el.scrollWidth / testimonials.length || 1;
    setActive(Math.round(el.scrollLeft / per));
  };

  const goTo = (i: number) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollTo({ left: (el.scrollWidth / testimonials.length) * i, behavior: 'smooth' });
  };

  return (
    <>
      <div
        ref={sliderRef}
        onScroll={syncActive}
        className="flex snap-x snap-mandatory gap-12 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0"
      >
        {testimonials.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1 * (i + 1)}
            className="flex w-[82vw] shrink-0 snap-start flex-col lg:w-auto lg:shrink-none lg:snap-none"
          >
            <Quote className="mb-6 size-10 text-gtc-dark" fill="currentColor" />
            <blockquote className="flex-1 text-base font-medium leading-relaxed text-zinc-700 md:text-lg">
              {item?.quote}
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-8 bg-gtc-primary" />
              <div>
                <p className="text-sm font-bold text-black">{item?.author}</p>
                <p className="text-xs text-zinc-500">{item?.role}</p>
                <a
                  href={item?.linkedin ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-gtc-dark hover:underline"
                >
                  <Linkedin className="size-4" />
                  {content?.linkedInLabel}
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-1 lg:hidden">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={content?.navAria?.replace('{n}', String(i + 1))}
            onClick={() => goTo(i)}
            className="flex size-11 items-center justify-center"
          >
            <span
              className={`h-2 rounded-full transition-all duration-300 ${active === i ? 'w-6 bg-gtc-primary' : 'w-2 bg-zinc-400/50'}`}
            />
          </button>
        ))}
      </div>
    </>
  );
}

export type HomeCaseStudyTeaser = { slug: string; client: string; intro: string };

export default function HomePage({
  content,
  logos,
  caseStudies,
}: {
  content: HomeContent | null | undefined;
  logos: HomeLogos;
  caseStudies: HomeCaseStudyTeaser[];
}) {
  const locale = useLocale();
  const { openVideo } = useVideoDialog();

  if (!content) return null;

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:min-h-[90vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-24">
          {/* ── LEFT: text ── */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-8 flex items-center justify-center gap-3 lg:justify-start"
            >
              <span aria-hidden className="h-px w-10 bg-black/40" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-black/50">
                {content.hero?.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-[2.25rem] font-black leading-[1.04] tracking-tight text-black text-balance break-words sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {content.hero?.headline1}{' '}
              {(() => {
                const h2 = content.hero?.headline2 ?? '';
                const word = h2.replace(/[.!?]+$/g, '');
                return (
                  <>
                    <span className="relative inline-block">
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
              {content.hero?.subline}
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="mt-5 mx-auto max-w-xl text-base text-black/60 md:text-lg lg:mx-0"
            >
              {content.hero?.body}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <ContactButton
                label={content.hero?.primaryCta ?? ''}
                size="lg"
                className="w-full justify-center rounded-full bg-black px-8 py-4 text-sm font-bold text-white hover:bg-black/80 transition-colors sm:w-auto"
              />
              <a
                href="#pdf-guide"
                onClick={() => posthog.capture('guide_cta_clicked', { placement: 'hero' })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-black bg-transparent px-8 py-4 text-sm font-bold text-black hover:bg-black hover:text-white transition-colors sm:w-auto"
              >
                <Download className="size-4" />
                {content.hero?.secondaryCta}
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: team photo in a Gen-Z sticker frame (bottom intentionally cropped) ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.25}
            className="relative order-1 mx-auto w-full max-w-[16rem] sm:max-w-xs lg:order-2 lg:max-w-md"
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
                src="/team_no_bg.webp"
                alt={content.hero?.imageAlt ?? ''}
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
            {content.logosEyebrow}
          </motion.p>
        </div>
        <div className="overflow-hidden w-full px-6">
          <InfiniteSlider gap={64} speed={40} speedOnHover={20} className="w-full">
            {(logos ?? []).map((logo) => (
              <div key={logo?.name} className="flex h-16 w-40 items-center justify-center">
                {logo?.src ? (
                  <Image
                    src={logo.src}
                    alt={logo.name ?? ''}
                    width={0}
                    height={0}
                    sizes="160px"
                    style={{ maxHeight: '3rem', maxWidth: '9rem', width: 'auto', height: 'auto', objectFit: 'contain' }}
                    className="grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="text-sm font-bold uppercase tracking-widest text-zinc-300">{logo?.name}</span>
                )}
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gtc-primary py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            {(content.stats ?? []).map((stat, i) => (
              <motion.div
                key={stat?.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="text-center"
              >
                <div className="text-6xl font-black text-black md:text-7xl">{stat?.num}</div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-black/60">{stat?.label}</div>
              </motion.div>
            ))}
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
                {content.services?.eyebrow}
              </p>
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight text-black md:text-5xl">
              {content.services?.title}
            </h2>
          </motion.div>

          <div className="grid gap-px bg-zinc-200 sm:grid-cols-2">
            {(content.services?.items ?? []).map((service, i) => (
              <motion.div
                key={service?.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="group relative bg-white p-8 hover:bg-zinc-50 transition-colors duration-200"
              >
                <span className="text-4xl font-black text-gtc-dark select-none">{service?.num}</span>
                <h3 className="mt-3 text-lg font-black text-black">{service?.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{service?.desc}</p>
                <Link
                  href={`/${locale}/services/${service?.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gtc-dark hover:text-black transition-colors duration-150"
                >
                  {content.services?.learnMore}
                  <ArrowRight className="size-3.5" />
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
              className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-400 hover:text-black transition-colors duration-150"
            >
              {content.services?.viewAll}
              <ArrowRight className="size-3.5" />
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
              {content.process?.eyebrow}
            </p>
            <h2 className="text-3xl font-black text-black md:text-4xl">{content.process?.title}</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {(content.process?.steps ?? []).map((step, i, arr) => (
              <motion.div
                key={step?.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="relative"
              >
                <div className="text-6xl font-black leading-none text-gtc-dark">{step?.num}</div>
                <h3 className="mt-4 text-lg font-black text-black">{step?.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step?.desc}</p>
                {i < arr.length - 1 && (
                  <div className="absolute -right-4 top-8 hidden text-zinc-300 md:block">
                    <ArrowRight className="size-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY / PODCAST ── */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: story text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary">
                {content.story?.eyebrow}
              </p>
              <h2 className="text-3xl font-black leading-tight text-white md:text-4xl">
                {content.story?.title}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
                {content.story?.body1}
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
                {content.story?.body2}
              </p>
            </motion.div>

            {/* Right: podcast player */}
            <motion.button
              type="button"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              aria-label={`${locale === 'cs' ? 'Přehrát video' : 'Play video'} — ${content.story?.title ?? ''}`}
              className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => {
                posthog.capture('video_opened', { placement: 'homepage_story' });
                openVideo('https://www.youtube.com/embed/uKZZ0pGV8Gg?si=DGtU4qkpWg_-8OEO');
              }}
            >
              <img
                src="https://img.youtube.com/vi/uKZZ0pGV8Gg/maxresdefault.jpg"
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span aria-hidden className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/40" />
              <span aria-hidden className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-20 items-center justify-center rounded-full bg-gtc-primary text-black shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play className="size-8 fill-current ml-1" />
                </span>
              </span>
            </motion.button>
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
              {content.caseStudies?.eyebrow}
            </p>
            <h2 className="text-3xl font-black text-black md:text-4xl">{content.caseStudies?.title}</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {caseStudies.map(({ client, intro, slug }, i) => (
              <Link
                key={slug}
                href={`/${locale}/case-studies/${slug}`}
                className="group relative flex flex-col border border-zinc-200 bg-white p-7 transition-colors duration-200 hover:border-gtc-primary"
              >
                <motion.span
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="flex flex-1 flex-col"
                >
                  <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gtc-dark">
                    {content.caseStudies?.cardLabel}
                    <ArrowRight className="size-3.5" />
                  </span>
                  <h3 className="text-lg font-black text-black">{client}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{intro}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gtc-dark group-hover:text-black transition-colors duration-150">
                    {content.caseStudies?.readMore}
                    <ArrowRight className="size-3.5" />
                  </span>
                </motion.span>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gtc-primary transition-all duration-300 group-hover:w-full" />
              </Link>
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
              className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-400 hover:text-black transition-colors duration-150"
            >
              {content.caseStudies?.viewAll}
              <ArrowRight className="size-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── PDF GUIDE ── */}
      <section id="pdf-guide" className="scroll-mt-20 bg-black py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            {/* Left */}
            <div>
              <div className="mb-6 flex items-center gap-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-gtc-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">
                  {content.pdf?.badge}
                </span>
              </div>
              <h2 className="text-4xl font-black leading-[1.05] text-white md:text-5xl">
                {content.pdf?.headline}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/50">
                {content.pdf?.body}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/downloads/GZC_Karierka_pro_Gen_Z.pdf"
                  download
                  onClick={() => posthog.capture('guide_downloaded', { placement: 'guide_section' })}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gtc-primary px-7 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
                >
                  <Download className="size-4" />
                  {content.pdf?.cta}
                </a>
                <ContactButton
                  label={content.pdf?.secondaryCta ?? ''}
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/25 bg-transparent px-7 py-3.5 text-sm font-bold text-white hover:border-white/50 hover:bg-white/5"
                />
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
                  {content.pdf?.coverMetaTag}
                </p>
                <div>
                  <h3 className="text-2xl font-black leading-tight text-black">
                    {content.pdf?.coverTitle}
                  </h3>
                  <div className="mt-6 space-y-2">
                    <div className="h-[3px] w-full rounded-full bg-black" />
                    <div className="h-[3px] w-2/3 rounded-full bg-gtc-primary" />
                    <div className="h-[2px] w-2/5 rounded-full bg-black/15" />
                  </div>
                  <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                    {content.pdf?.coverMeta}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark"
          >
            {content.testimonials?.eyebrow}
          </motion.p>
          <TestimonialSlider content={content.testimonials} />
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
              {content.team?.eyebrow}
            </p>
            <h2 className="text-3xl font-black leading-tight text-black md:text-4xl">
              {content.team?.title}
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {(content.team?.members ?? []).map((member, i) => (
              <motion.div
                key={member?.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="group flex gap-6 p-6 transition-colors duration-200"
              >
                <div className="relative h-40 w-28 shrink-0 overflow-hidden">
                  <Image
                    src={member?.photo ?? ''}
                    alt={`${member?.name} — GenZ Consulting`}
                    fill
                    className="object-cover object-[center_0%]"
                    sizes="112px"
                  />
                  <div className="absolute inset-0 bg-gtc-primary/10 mix-blend-multiply" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-black text-black">{member?.name}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gtc-dark">{member?.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{member?.bio}</p>
                  <a
                    href={member?.linkedin ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-zinc-400 transition-colors duration-150 hover:text-gtc-dark"
                  >
                    <Linkedin className="size-3.5" />
                    {content.testimonials?.linkedInLabel}
                  </a>
                </div>
              </motion.div>
            ))}
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
            <h2 className="text-4xl font-black text-white md:text-5xl">{content.cta?.title}</h2>
            <p className="mt-4 text-base text-white/60">{content.cta?.desc}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ContactButton
                label={content.cta?.primary ?? ''}
                size="lg"
                className="rounded-none bg-gtc-primary px-8 py-4 text-sm font-bold text-black hover:bg-gtc-primary/90 transition-colors"
              />
              <a
                href="/downloads/GZC_Karierka_pro_Gen_Z.pdf"
                download
                onClick={() => posthog.capture('guide_downloaded', { placement: 'footer_cta' })}
                className="inline-flex items-center gap-2.5 rounded-none border-2 border-white/30 bg-transparent px-8 py-4 text-sm font-bold text-white hover:border-white hover:bg-white/5 transition-colors"
              >
                <Download className="size-4" />
                {content.cta?.secondary}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
}
