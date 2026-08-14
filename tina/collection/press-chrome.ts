// tina/collection/press-chrome.ts
import type { Collection } from 'tinacms';

const chromeLocaleFields = [
  { type: 'string', label: 'Eyebrow', name: 'eyebrow' } as const,
  { type: 'string', label: 'Title', name: 'title' } as const,
  { type: 'string', label: 'Subtitle', name: 'subtitle', ui: { component: 'textarea' } } as const,
  { type: 'string', label: 'Timeline Section Label', name: 'sectionLabel' } as const,
  { type: 'string', label: 'Read Article Label', name: 'readArticle' } as const,
  { type: 'string', label: 'CTA Title', name: 'ctaTitle' } as const,
  { type: 'string', label: 'CTA Description', name: 'ctaDesc' } as const,
  { type: 'string', label: 'CTA Button', name: 'cta' } as const,
] as const;

const PressChrome: Collection = {
  label: 'Press Page Chrome',
  name: 'pressChrome',
  path: 'content/press-chrome',
  format: 'json',
  ui: { global: true },
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: chromeLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: chromeLocaleFields as any },
  ],
};

export default PressChrome;
