'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import posthog from 'posthog-js';
import { useCookieConsent } from './CookieConsentContext';

export const CookieConsent = () => {
  const t = useTranslations('cookieConsent');
  const locale = useLocale();
  const { isOpen, openConsent, closeConsent } = useCookieConsent();

  useEffect(() => {
    try {
      if (posthog.get_explicit_consent_status() !== 'pending') return;
      const id = setTimeout(openConsent, 400);
      return () => clearTimeout(id);
    } catch {
      // PostHog is not configured — nothing to ask consent for.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accept = () => {
    try {
      posthog.opt_in_capturing({
        captureEventName: 'consent_action',
        captureProperties: { action: 'accepted' },
      });
    } catch {
      // ignore
    }
    closeConsent();
  };

  const reject = () => {
    try {
      posthog.opt_out_capturing();
    } catch {
      // ignore
    }
    closeConsent();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-label={t('title')}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-0 z-[100]"
        >
          <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
            <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-gtc-deep p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-white/80">
                {t('text')}{' '}
                <Link
                  href={`/${locale}/gdpr`}
                  className="font-semibold text-gtc-primary underline underline-offset-2 hover:text-white"
                >
                  {t('learnMore')}
                </Link>
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={reject}
                  className="rounded-md px-4 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:text-white"
                >
                  {t('reject')}
                </button>
                <button
                  type="button"
                  onClick={accept}
                  className="rounded-md bg-gtc-primary px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-gtc-primary/90"
                >
                  {t('accept')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
