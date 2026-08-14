// tina/collection/global.ts
import type { Collection } from 'tinacms';
import { iconSchema } from '../fields/icon';
import { imagePath } from '../fields/image-path';

const navContentFields = [
  { type: 'string', label: 'Home Label', name: 'homeLabel' } as const,
  { type: 'string', label: 'Case Studies Label', name: 'caseStudiesLabel' } as const,
  { type: 'string', label: 'Media Label', name: 'mediaLabel' } as const,
  { type: 'string', label: 'Contact Label', name: 'contactLabel' } as const,
  { type: 'string', label: 'Services Label', name: 'servicesLabel' } as const,
  { type: 'string', label: 'View All Services Label', name: 'viewServicesLabel' } as const,
  { type: 'string', label: 'Book Call Label', name: 'bookCallLabel' } as const,
  { type: 'string', label: 'Home Logo Aria Label', name: 'homeLogoAria' } as const,
  { type: 'string', label: 'Menu Open Aria Label', name: 'menuOpenAria' } as const,
  { type: 'string', label: 'Menu Close Aria Label', name: 'menuCloseAria' } as const,
  {
    type: 'object',
    label: 'Service Links',
    name: 'serviceLinks',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Slug', name: 'slug' },
      { type: 'string', label: 'Label', name: 'label' },
    ],
  } as const,
];

const footerCopyFields = [
  { type: 'string', label: 'Tagline', name: 'tagline' } as const,
  { type: 'string', label: 'Rights', name: 'rights' } as const,
  { type: 'string', label: 'Nav Label', name: 'navLabel' } as const,
  { type: 'string', label: 'Contact Label', name: 'contactLabel' } as const,
  { type: 'string', label: 'Follow Label', name: 'followLabel' } as const,
  { type: 'string', label: 'Website', name: 'web' } as const,
  { type: 'string', label: 'Social Domain', name: 'socialDomain' } as const,
  { type: 'string', label: 'Nav: Services', name: 'navServices' } as const,
  { type: 'string', label: 'Nav: Case Studies', name: 'navCaseStudies' } as const,
  { type: 'string', label: 'Nav: Media', name: 'navMedia' } as const,
  { type: 'string', label: 'Nav: Contact', name: 'navContact' } as const,
  { type: 'string', label: 'Nav: Guide', name: 'navGuide' } as const,
  { type: 'string', label: 'Home Logo Aria Label', name: 'homeLogoAria' } as const,
];

const Global: Collection = {
  label: 'Global',
  name: 'global',
  path: 'content/global',
  format: 'json',
  ui: { global: true },
  fields: [
    {
      type: 'object',
      label: 'Header',
      name: 'header',
      fields: [
        { type: 'string', label: 'Site Name', name: 'name' },
        { type: 'image', label: 'Logo', name: 'logo', ui: { ...imagePath } },
        {
          type: 'object',
          label: 'Nav',
          name: 'nav',
          fields: [
            { type: 'object', label: 'Czech', name: 'cs', fields: navContentFields as any },
            { type: 'object', label: 'English', name: 'en', fields: navContentFields as any },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Footer',
      name: 'footer',
      fields: [
        { type: 'string', label: 'Phone', name: 'phone' },
        { type: 'string', label: 'Email', name: 'email' },
        { type: 'image', label: 'WeBe Logo', name: 'webeLogo', ui: { ...imagePath } },
        {
          type: 'object',
          label: 'Social Links',
          name: 'social',
          list: true,
          ui: { itemProps: (item) => ({ label: item?.icon?.name || 'Link' }) },
          fields: [iconSchema as any, { type: 'string', label: 'URL', name: 'url' }],
        },
        {
          type: 'object',
          label: 'Copy',
          name: 'copy',
          fields: [
            { type: 'object', label: 'Czech', name: 'cs', fields: footerCopyFields as any },
            { type: 'object', label: 'English', name: 'en', fields: footerCopyFields as any },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Not Found Page',
      name: 'notFound',
      fields: [
        {
          type: 'object',
          label: 'Czech',
          name: 'cs',
          fields: [
            { type: 'string', label: 'Title', name: 'title' },
            { type: 'string', label: 'Message', name: 'message' },
            { type: 'string', label: 'Back Home Label', name: 'backHomeLabel' },
            { type: 'string', label: 'Contact Label', name: 'contactLabel' },
          ],
        },
        {
          type: 'object',
          label: 'English',
          name: 'en',
          fields: [
            { type: 'string', label: 'Title', name: 'title' },
            { type: 'string', label: 'Message', name: 'message' },
            { type: 'string', label: 'Back Home Label', name: 'backHomeLabel' },
            { type: 'string', label: 'Contact Label', name: 'contactLabel' },
          ],
        },
      ],
    },
  ],
};

export default Global;
