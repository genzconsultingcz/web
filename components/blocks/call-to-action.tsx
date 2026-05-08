// components/blocks/call-to-action.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { iconSchema } from '@/tina/fields/icon';
import { Button } from '@/components/ui/button';
import type { PageBlocksCta } from '@/tina/__generated__/types';
import { Icon } from '../icon';
import { Section } from '../layout/section';
import { CalendlyButton } from '../ui/CalendlyButton';
import { LeadMagnetModal } from '../ui/LeadMagnetModal';
import { useLayout } from '../layout/layout-context';

export const CallToAction = ({ data }: { data: PageBlocksCta }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { globalSettings } = useLayout();
  const calendlyUrl = (globalSettings?.header as any)?.calendlyUrl ?? '';

  return (
    <Section id="contact" background={data.background ?? 'bg-gtc-deep'}>
      <div className="text-center">
        <h2 className="text-balance text-4xl font-black tracking-tight text-black lg:text-5xl" data-tina-field={tinaField(data, 'title')}>
          {data.title}
        </h2>
        <p className="mt-4 text-black/70" data-tina-field={tinaField(data, 'description')}>
          {data.description}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {data.actions?.map((action) => {
            if (action!.type === 'calendly') {
              return (
                <div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                  <CalendlyButton url={calendlyUrl} label={action!.label!} />
                </div>
              );
            }
            if (action!.type === 'leadMagnet') {
              return (
                <div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                  <Button size="lg" variant="ghost" className="rounded-xl px-5 text-base text-black" onClick={() => setModalOpen(true)}>
                    {action!.label}
                  </Button>
                </div>
              );
            }
            return (
              <div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                <Button asChild size="lg" variant={action!.type === 'link' ? 'ghost' : 'default'} className="rounded-xl px-5 text-base">
                  <Link href={action!.link!}>
                    {action?.icon && <Icon data={action?.icon} />}
                    <span className="text-nowrap">{action!.label}</span>
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <LeadMagnetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Section>
  );
};

export const ctaBlockSchema: Template = {
  name: 'cta',
  label: 'CTA',
  ui: {
    previewSrc: '/blocks/cta.png',
    defaultItem: {
      title: 'Připraveni začít?',
      description: 'Rezervujte si nezávazný call nebo stáhněte náš Legit Check zdarma.',
      background: 'bg-gtc-deep',
      actions: [
        { label: 'Booknout call', type: 'calendly' },
        { label: 'Stáhnout Legit Check', type: 'leadMagnet' },
      ],
    },
  },
  fields: [
    { type: 'string', label: 'Background', name: 'background' },
    { type: 'string', label: 'Title', name: 'title' },
    { type: 'string', label: 'Description', name: 'description', ui: { component: 'textarea' } },
    {
      label: 'Actions',
      name: 'actions',
      type: 'object',
      list: true,
      ui: {
        defaultItem: { label: 'Action', type: 'calendly' },
        itemProps: (item) => ({ label: item.label }),
      },
      fields: [
        { label: 'Label', name: 'label', type: 'string' },
        {
          label: 'Type',
          name: 'type',
          type: 'string',
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Link', value: 'link' },
            { label: 'Calendly Popup', value: 'calendly' },
            { label: 'Lead Magnet (PDF)', value: 'leadMagnet' },
          ],
        },
        iconSchema as any,
        { label: 'Link', name: 'link', type: 'string' },
      ],
    },
  ],
};
