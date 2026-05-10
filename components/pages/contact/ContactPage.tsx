'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Mail, Phone, Linkedin, ChevronDown } from 'lucide-react';
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

const FAQ_KEYS = [
  { q: 'faq1Q', a: 'faq1A' },
  { q: 'faq2Q', a: 'faq2A' },
  { q: 'faq3Q', a: 'faq3A' },
  { q: 'faq4Q', a: 'faq4A' },
] as const;

export default function ContactPage() {
  const t = useTranslations('contact');
  const { globalSettings } = useLayout();
  const calendlyUrl = (globalSettings?.header as any)?.calendlyUrl ?? '';

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

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
            {t('subtitle')}
          </motion.p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[18vw] font-black leading-none text-white/5"
        >
          GZ
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 md:grid-cols-2">

            {/* ── LEFT: Calendly + contact details ── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
                {t('calendlyTitle')}
              </p>
              {calendlyUrl && (
                <CalendlyButton
                  url={calendlyUrl}
                  label={t('calendlyTitle')}
                  size="lg"
                  className="w-full rounded-none bg-gtc-primary px-8 py-5 text-base font-bold text-black hover:bg-gtc-primary/90 transition-colors"
                />
              )}

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                  {t('orLabel')}
                </span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <ul className="space-y-5">
                <li>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                    {t('emailLabel')}
                  </p>
                  <a
                    href="mailto:adam.dalecky@genzconsulting.cz"
                    className="inline-flex items-center gap-2 text-base font-bold text-black hover:text-gtc-dark transition-colors duration-150"
                  >
                    <Mail className="size-4 text-gtc-dark shrink-0" />
                    adam.dalecky@genzconsulting.cz
                  </a>
                </li>
                <li>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                    {t('phoneLabel')}
                  </p>
                  <a
                    href="tel:+420606028051"
                    className="inline-flex items-center gap-2 text-base font-bold text-black hover:text-gtc-dark transition-colors duration-150"
                  >
                    <Phone className="size-4 text-gtc-dark shrink-0" />
                    +420 606 028 051
                  </a>
                </li>
                <li>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                    {t('linkedinLabel')}
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://cz.linkedin.com/company/gen-zconsulting"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-gtc-dark transition-colors duration-150"
                    >
                      <Linkedin className="size-4 text-gtc-dark shrink-0" />
                      GenZ Consulting
                    </a>
                    <a
                      href="https://www.linkedin.com/in/adam-dalecky/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-gtc-dark transition-colors duration-150"
                    >
                      <Linkedin className="size-4 text-gtc-dark shrink-0" />
                      Adam Dalecký
                    </a>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* ── RIGHT: FAQ accordion ── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
            >
              <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-gtc-dark">
                {t('faqTitle')}
              </p>
              <div className="divide-y divide-zinc-200 border-y border-zinc-200">
                {FAQ_KEYS.map(({ q, a }, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={q}>
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        className="flex w-full items-start justify-between gap-4 py-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm font-bold text-black leading-snug">
                          {t(q)}
                        </span>
                        <ChevronDown
                          className={`size-4 shrink-0 text-zinc-400 transition-transform duration-300 mt-0.5 ${
                            isOpen ? 'rotate-180 text-gtc-dark' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
                        }`}
                      >
                        <p className="text-sm leading-relaxed text-zinc-500">{t(a)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
