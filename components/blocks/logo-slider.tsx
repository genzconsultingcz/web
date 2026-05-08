'use client';
import React from 'react';
import Image from 'next/image';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { InfiniteSlider } from '../ui/infinite-slider';

export const LogoSlider = ({ data }: { data: any }) => {
  return (
    <Section background={data.background ?? ''}>
      {data.title && (
        <p
          className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground"
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title}
        </p>
      )}
      <InfiniteSlider gap={48} speed={60}>
        {data.logos?.map((logo: any, i: number) => (
          <div key={i} className="flex items-center justify-center px-4">
            {logo?.image ? (
              <Image
                src={logo.image}
                alt={logo.name ?? ''}
                width={120}
                height={48}
                className="h-10 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0"
                data-tina-field={tinaField(logo, 'image')}
              />
            ) : (
              <span className="text-sm font-medium text-muted-foreground">{logo?.name}</span>
            )}
          </div>
        ))}
      </InfiniteSlider>
    </Section>
  );
};

export const logoSliderBlockSchema: Template = {
  name: 'logoSlider',
  label: 'Logo Slider',
  ui: {
    previewSrc: '/blocks/logo-slider.png',
    defaultItem: {
      title: 'Spolupracovali jsme s',
      logos: [{ name: 'Partner' }],
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Background',
      name: 'background',
    },
    {
      type: 'string',
      label: 'Title',
      name: 'title',
    },
    {
      type: 'object',
      label: 'Logos',
      name: 'logos',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name || 'Logo' }),
        defaultItem: { name: 'Company Name' },
      },
      fields: [
        { type: 'string', label: 'Company Name', name: 'name' },
        { type: 'image', label: 'Logo Image', name: 'image' },
        { type: 'string', label: 'Website URL', name: 'url' },
      ],
    },
  ],
};
