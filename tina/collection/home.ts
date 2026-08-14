import type { Collection } from 'tinacms';

const homeLocaleFields = [
  {
    type: 'object',
    label: 'Hero',
    name: 'hero',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Headline (line 1)', name: 'headline1' },
      { type: 'string', label: 'Headline (highlighted line 2)', name: 'headline2' },
      { type: 'string', label: 'Subline', name: 'subline' },
      { type: 'string', label: 'Body', name: 'body' },
      { type: 'string', label: 'Primary CTA', name: 'primaryCta' },
      { type: 'string', label: 'Secondary CTA', name: 'secondaryCta' },
      { type: 'string', label: 'Team Photo Alt Text', name: 'imageAlt' },
    ],
  } as const,
  { type: 'string', label: 'Logos Eyebrow', name: 'logosEyebrow' } as const,
  {
    type: 'object',
    label: 'Services',
    name: 'services',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'View All Label', name: 'viewAll' },
      { type: 'string', label: 'Learn More Label', name: 'learnMore' },
      {
        type: 'object',
        label: 'Items',
        name: 'items',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Description', name: 'desc' },
          { type: 'string', label: 'Slug', name: 'slug' },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Process',
    name: 'process',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      {
        type: 'object',
        label: 'Steps',
        name: 'steps',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Description', name: 'desc' },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Case Studies Teaser',
    name: 'caseStudies',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'View All Label', name: 'viewAll' },
      { type: 'string', label: 'Card Label', name: 'cardLabel' },
      { type: 'string', label: 'Read More Label', name: 'readMore' },
    ],
  } as const,
  {
    type: 'object',
    label: 'PDF Guide',
    name: 'pdf',
    fields: [
      { type: 'string', label: 'Badge', name: 'badge' },
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Body', name: 'body' },
      { type: 'string', label: 'CTA', name: 'cta' },
      { type: 'string', label: 'Secondary CTA', name: 'secondaryCta' },
      { type: 'string', label: 'Cover Title', name: 'coverTitle' },
      { type: 'string', label: 'Cover Meta', name: 'coverMeta' },
      { type: 'string', label: 'Cover Meta Tag', name: 'coverMetaTag' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Story (podcast section)',
    name: 'story',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Body (paragraph 1)', name: 'body1', ui: { component: 'textarea' } },
      { type: 'string', label: 'Body (paragraph 2)', name: 'body2', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Stats',
    name: 'stats',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Number', name: 'num' },
      { type: 'string', label: 'Label', name: 'label' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Testimonials',
    name: 'testimonials',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'LinkedIn Button Label', name: 'linkedInLabel' },
      { type: 'string', label: 'Nav Aria Label (use {n} for the index)', name: 'navAria' },
      {
        type: 'object',
        label: 'Items',
        name: 'items',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.author }) },
        fields: [
          { type: 'string', label: 'Quote', name: 'quote', ui: { component: 'textarea' } },
          { type: 'string', label: 'Author', name: 'author' },
          { type: 'string', label: 'Role', name: 'role' },
          { type: 'string', label: 'LinkedIn URL', name: 'linkedin' },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Team',
    name: 'team',
    fields: [
      { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
      { type: 'string', label: 'Title', name: 'title' },
      {
        type: 'object',
        label: 'Members',
        name: 'members',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.name }) },
        fields: [
          { type: 'string', label: 'Name', name: 'name' },
          { type: 'string', label: 'Role', name: 'role' },
          { type: 'string', label: 'Bio', name: 'bio', ui: { component: 'textarea' } },
          { type: 'string', label: 'Photo', name: 'photo' },
          { type: 'string', label: 'LinkedIn URL', name: 'linkedin' },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'CTA',
    name: 'cta',
    fields: [
      { type: 'string', label: 'Title', name: 'title' },
      { type: 'string', label: 'Description', name: 'desc' },
      { type: 'string', label: 'Primary Button', name: 'primary' },
      { type: 'string', label: 'Secondary Button', name: 'secondary' },
    ],
  } as const,
];

const Home: Collection = {
  label: 'Home Page',
  name: 'home',
  path: 'content/home',
  format: 'json',
  ui: { global: true },
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: homeLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: homeLocaleFields as any },
    {
      type: 'object',
      label: 'Client Logos (shared across languages)',
      name: 'logos',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.name }) },
      fields: [
        { type: 'string', label: 'Name', name: 'name' },
        { type: 'string', label: 'Logo Image', name: 'src' },
      ],
    },
  ],
};

export default Home;
