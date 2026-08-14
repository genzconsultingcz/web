// tina/collection/service.ts
import type { Collection } from 'tinacms';
import { imagePath } from '../fields/image-path';

const serviceLocaleFields = [
  {
    type: 'object',
    label: 'Index Card',
    name: 'card',
    fields: [
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Hero',
    name: 'hero',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title', ui: { component: 'textarea' } },
      { type: 'string', label: 'Subtitle', name: 'subtitle', ui: { component: 'textarea' } },
      { type: 'string', label: 'CTA', name: 'cta' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Sections',
    name: 'sections',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Label', name: 'label' },
      { type: 'string', label: 'Text', name: 'text', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Timeline (optional)',
    name: 'timeline',
    fields: [
      { type: 'string', label: 'Label', name: 'label' },
      { type: 'string', label: 'Text', name: 'text' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Image (optional)',
    name: 'image',
    fields: [
      { type: 'image', label: 'Source Image', name: 'src', ui: { ...imagePath } },
      { type: 'string', label: 'Alt Text', name: 'alt' },
    ],
  } as const,
  { type: 'string', label: 'Variants Eyebrow (workshop only)', name: 'variantsLabel' } as const,
  { type: 'string', label: 'Variants Title (workshop only)', name: 'variantsTitle' } as const,
  {
    type: 'object',
    label: 'Variants (optional)',
    name: 'variants',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.title }) },
    fields: [
      { type: 'string', label: 'Number', name: 'num' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Steps (optional)',
    name: 'steps',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.title }) },
    fields: [
      { type: 'string', label: 'Number', name: 'num' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Final CTA (optional; falls back to hero title/subtitle)',
    name: 'finalCta',
    fields: [
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
    ],
  } as const,
];

const Service: Collection = {
  label: 'Services',
  name: 'service',
  path: 'content/services',
  format: 'json',
  ui: {
    router: ({ document }) => `/services/${document._sys.filename}`,
  },
  fields: [
    { type: 'string', label: 'Number (index card + hero decoration)', name: 'num' },
    { type: 'boolean', label: 'Featured (full-width card on index)', name: 'featured' },
    { type: 'object', label: 'Czech', name: 'cs', fields: serviceLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: serviceLocaleFields as any },
  ],
};

export default Service;
