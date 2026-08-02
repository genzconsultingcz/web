'use client';
import React, { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { X, Download, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isValidEmail } from '@/lib/email';
import { useLayout } from '@/components/layout/layout-context';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function LeadMagnetModal({ isOpen, onClose }: LeadMagnetModalProps) {
  const t = useTranslations('leadMagnet');
  const { globalSettings } = useLayout();
  const contactEmail = (globalSettings?.footer as any)?.email ?? '';

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMsg(t('errorInvalidEmail'));
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/legit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDownloadUrl(data.downloadUrl);
      setStatus('success');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#0c0c0c] shadow-2xl">
          {/* Close */}
          <button
            onClick={onClose}
            aria-label={t('closeAria')}
            className="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="size-4" />
          </button>

          <div className="grid lg:grid-cols-[1fr_380px]">
            {/* ── LEFT: copy + form ── */}
            <div className="flex flex-col justify-center gap-8 px-8 py-12 lg:px-12">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-gtc-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  {t('badge')}
                </span>
              </div>

              {/* Headline */}
              <div>
                <h2 className="text-3xl font-black leading-[1.08] text-white md:text-4xl">
                  {t('title')}
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
                  {t('description')}
                </p>
              </div>

              {/* Form / Success */}
              {status === 'success' ? (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-white">{t('successTitle')}</p>
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center gap-2.5 rounded-full bg-gtc-primary px-7 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
                  >
                    <Download className="size-4" />
                    {t('downloadButton')}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  <div>
                    <input
                      id="lead-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder={t('emailPlaceholder')}
                      className="w-full rounded-full border border-white/15 bg-white/[0.08] px-5 py-3.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-gtc-primary focus:ring-1 focus:ring-gtc-primary"
                      required
                    />
                    {status === 'error' && (
                      <p role="alert" className="mt-1.5 pl-5 text-xs text-red-400">
                        {errorMsg}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gtc-primary px-7 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    <Download className="size-4" />
                    {status === 'submitting' ? t('submitting') : t('submit')}
                  </button>
                </form>
              )}

              {/* Secondary: contact directly */}
              {contactEmail && status !== 'success' && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/40 hover:bg-white/5"
                >
                  {t('secondaryCta')}
                  <ArrowRight className="size-4" />
                </a>
              )}
            </div>

            {/* ── RIGHT: PDF cover card ── */}
            <div className="hidden items-center justify-center bg-white/[0.03] p-10 lg:flex">
              <div
                className="relative flex w-full max-w-[260px] flex-col justify-between overflow-hidden rounded-[1.5rem] p-7 shadow-xl"
                style={{
                  background:
                    'linear-gradient(155deg, #d1fae5 0%, #ecfdf5 20%, #ffffff 48%, #fdf4ff 75%, #ede9fe 100%)',
                  aspectRatio: '3/4',
                }}
              >
                {/* Subtle ray overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'conic-gradient(from 230deg at 50% 115%, rgba(16,185,129,0.18) 0deg, transparent 22deg, rgba(240,171,252,0.12) 44deg, transparent 66deg, rgba(16,185,129,0.18) 88deg, transparent 110deg, rgba(240,171,252,0.12) 132deg, transparent 154deg, rgba(16,185,129,0.18) 176deg, transparent 198deg)',
                  }}
                />

                {/* Top meta */}
                <p
                  className="relative z-10 text-[10px] font-bold uppercase tracking-[0.25em] text-black/40"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {t('guideMetaTag')}
                </p>

                {/* Title block */}
                <div className="relative z-10 mt-auto">
                  <h3 className="text-xl font-black leading-tight text-black">
                    {t('coverTitle')}
                  </h3>

                  {/* Decorative lines */}
                  <div className="mt-5 space-y-1.5">
                    <div className="h-[3px] w-full rounded-full bg-black" />
                    <div className="h-[3px] w-3/4 rounded-full bg-gtc-primary" />
                    <div className="h-[2px] w-1/2 rounded-full bg-[#f0abfc]/60" />
                  </div>

                  {/* Footer */}
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                    {t('coverMeta')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
