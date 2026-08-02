'use client';
import React from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { X, Phone, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLayout } from '@/components/layout/layout-context';

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactDialog({ isOpen, onClose }: ContactDialogProps) {
  const t = useTranslations('contactDialog');
  const { globalSettings } = useLayout();
  const footer = globalSettings?.footer as any;
  const email: string = footer?.email ?? '';
  const phone: string = footer?.phone ?? '';

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0c0c0c] p-8 shadow-2xl">
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="size-4" />
          </button>

          <h2 className="mt-4 text-2xl font-black leading-tight text-white md:text-3xl">
            {t('title')}
          </h2>

          <div className="mt-8 space-y-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2.5 w-full rounded-full bg-gtc-primary px-6 py-4 text-sm font-bold text-black transition-opacity hover:opacity-90"
              >
                <Phone className="size-4" />
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center gap-2.5 w-full rounded-full border border-white/20 px-6 py-4 text-sm font-bold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                <Mail className="size-4" />
                {email}
              </a>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}