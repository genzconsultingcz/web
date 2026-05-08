// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['cs', 'en'] as const,
  defaultLocale: 'cs',
});

export type Locale = (typeof routing.locales)[number];
