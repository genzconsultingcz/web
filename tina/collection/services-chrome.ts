// tina/collection/services-chrome.ts
import type { Collection } from 'tinacms';

const chromeLocaleFields = [
  {
    type: 'object',
    label: 'Hero',
    name: 'hero',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Subtitle', name: 'subtitle', ui: { component: 'textarea' } },
      { type: 'string', label: 'CTA', name: 'cta' },
    ],
  } as const,
  { type: 'string', label: 'Learn More Label (index cards)', name: 'learnMore' } as const,
  {
    type: 'object',
    label: 'Not Sure CTA',
    name: 'notSure',
    fields: [
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
      { type: 'string', label: 'CTA', name: 'cta' },
    ],
  } as const,
];

const ServicesChrome: Collection = {
  label: 'Services Chrome',
  name: 'servicesChrome',
  path: 'content/services-chrome',
  format: 'json',
  ui: { global: true },
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: chromeLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: chromeLocaleFields as any },
  ],
};

export default ServicesChrome;
