// tina/collection/press.ts
import type { Collection } from 'tinacms';

const pressLocaleFields = [
  { type: 'string', label: 'Outlet (publishing platform)', name: 'outlet' } as const,
  { type: 'string', label: 'Author', name: 'author' } as const,
  {
    type: 'string',
    label: 'Article Title (keep original language)',
    name: 'title',
    ui: { component: 'textarea' },
  } as const,
  {
    type: 'string',
    label: 'Date (ISO format, e.g. 2026-05-14, used for sorting and display)',
    name: 'date',
  } as const,
  { type: 'string', label: 'Article URL', name: 'url' } as const,
  { type: 'string', label: 'Summary', name: 'summary', ui: { component: 'textarea' } } as const,
] as const;

const Press: Collection = {
  label: 'Press Mentions',
  name: 'press',
  path: 'content/press',
  format: 'json',
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: pressLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: pressLocaleFields as any },
  ],
};

export default Press;
