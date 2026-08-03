// tina/collection/case-studies-chrome.ts
import type { Collection } from 'tinacms';

const chromeLocaleFields = [
  {
    type: 'object',
    label: 'List Page',
    name: 'list',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Subtitle', name: 'subtitle' },
      { type: 'string', label: 'Result Label', name: 'resultLabel' },
      { type: 'string', label: 'Read More Label', name: 'readMore' },
      { type: 'string', label: 'CTA Title', name: 'ctaTitle' },
      { type: 'string', label: 'CTA Description', name: 'ctaDesc' },
      { type: 'string', label: 'CTA Button', name: 'cta' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Detail Page',
    name: 'detail',
    fields: [
      { type: 'string', label: 'Back Link', name: 'back' },
      { type: 'string', label: 'Case Label', name: 'caseLabel' },
      { type: 'string', label: 'Client Label', name: 'clientLabel' },
      { type: 'string', label: 'Section: Context', name: 'sectionContext' },
      { type: 'string', label: 'Section: Approach', name: 'sectionApproach' },
      { type: 'string', label: 'Section: Findings', name: 'sectionFindings' },
      { type: 'string', label: 'Section: Outputs', name: 'sectionOutputs' },
      { type: 'string', label: 'Section: Why Us', name: 'sectionWhy' },
      { type: 'string', label: 'Contact Label', name: 'contactLabel' },
      { type: 'string', label: 'CTA Title', name: 'ctaTitle' },
      { type: 'string', label: 'CTA Description', name: 'ctaDesc' },
      { type: 'string', label: 'CTA Button', name: 'cta' },
    ],
  } as const,
];

const CaseStudiesChrome: Collection = {
  label: 'Case Studies Chrome',
  name: 'caseStudiesChrome',
  path: 'content/case-studies-chrome',
  format: 'json',
  ui: { global: true },
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: chromeLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: chromeLocaleFields as any },
  ],
};

export default CaseStudiesChrome;
