'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ContactButton } from '@/components/ui/ContactButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay },
  }),
};

interface NotFoundPageProps {
  eyebrow: string;
  title: string;
  message: string;
  backHomeLabel: string;
  contactLabel: string;
  homeHref: string;
}

export default function NotFoundPage({
  eyebrow,
  title,
  message,
  backHomeLabel,
  contactLabel,
  homeHref,
}: NotFoundPageProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden bg-gtc-deep px-6 py-24">
      {/* ── GIANT 404 WATERMARK ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[32vw] font-black leading-none text-white/5"
      >
        404
      </div>

      {/* ── CONTENT ── */}
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-gtc-primary"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mt-6 max-w-xl text-lg font-semibold text-white/60"
        >
          {message}
        </motion.p>

        {/* ── ACTIONS ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gtc-primary px-8 py-4 text-sm font-bold text-black transition-colors hover:bg-gtc-primary/90"
          >
            <ArrowLeft className="size-4" />
            {backHomeLabel}
          </Link>
          <ContactButton
            label={contactLabel}
            size="lg"
            placement="not_found_page"
            variant="outline"
            className="rounded-full border-2 border-white/30 bg-transparent px-8 py-4 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-black"
          />
        </motion.div>
      </div>
    </section>
  );
}
