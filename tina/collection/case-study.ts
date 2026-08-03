// tina/collection/case-study.ts
import type { Collection } from 'tinacms';

const caseStudyLocaleFields = [
  { type: 'string', label: 'Client Name', name: 'client' } as const,
  { type: 'string', label: 'Service Type (list card label)', name: 'serviceType' } as const,
  { type: 'string', label: 'List Card Result Summary', name: 'listResult', ui: { component: 'textarea' } } as const,
  { type: 'string', label: 'Logo Image Path', name: 'logo' } as const,
  { type: 'string', label: 'Logo Alt Text', name: 'logoAlt' } as const,
  { type: 'string', label: 'Year', name: 'year' } as const,
  {
    type: 'object',
    label: 'Hero',
    name: 'hero',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Scope',
    name: 'scope',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Label', name: 'label' },
      { type: 'string', label: 'Value', name: 'value' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Stats',
    name: 'stats',
    list: true,
    ui: { itemProps: (item: any) => ({ label: item?.label }) },
    fields: [
      { type: 'string', label: 'Value', name: 'value' },
      { type: 'string', label: 'Label', name: 'label' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Context',
    name: 'context',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      { type: 'string', label: 'Client Label', name: 'clientLabel' },
      { type: 'string', label: 'Client Description', name: 'client', ui: { component: 'textarea' } },
      { type: 'string', label: 'Why Title', name: 'whyTitle' },
      { type: 'string', label: 'Why Intro (optional)', name: 'whyIntro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Why Points',
        name: 'whyPoints',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body', name: 'body', ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', label: 'Brief Label', name: 'briefLabel' },
      { type: 'string', label: 'Brief', name: 'brief', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Approach',
    name: 'approach',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Steps',
        name: 'steps',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body', name: 'body', ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', label: 'Assessed Title', name: 'assessedTitle' },
      { type: 'string', label: 'Assessed Intro', name: 'assessedIntro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Assessed Items',
        name: 'assessed',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body (optional)', name: 'body', ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', label: 'Assessed Note (optional)', name: 'assessedNote', ui: { component: 'textarea' } },
    ],
  } as const,
  {
    type: 'object',
    label: 'Findings',
    name: 'findings',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      { type: 'string', label: 'Column 1 Label', name: 'column1' },
      { type: 'string', label: 'Column 2 Label', name: 'column2' },
      { type: 'string', label: 'Column 3 Label', name: 'column3' },
      {
        type: 'object',
        label: 'Items',
        name: 'items',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Category', name: 'category' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Column 1 Content', name: 'col1', ui: { component: 'textarea' } },
          { type: 'string', label: 'Column 2 Content', name: 'col2', ui: { component: 'textarea' } },
          { type: 'string', label: 'Column 3 Content', name: 'col3', ui: { component: 'textarea' } },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Outputs',
    name: 'outputs',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Items',
        name: 'items',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body', name: 'body', ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', label: 'Quote', name: 'quote', ui: { component: 'textarea' } },
      { type: 'string', label: 'Quote Author', name: 'quoteAuthor' },
    ],
  } as const,
  {
    type: 'object',
    label: 'Why Us',
    name: 'whyUs',
    fields: [
      { type: 'string', label: 'Headline', name: 'headline' },
      { type: 'string', label: 'Intro', name: 'intro', ui: { component: 'textarea' } },
      {
        type: 'object',
        label: 'Pillars',
        name: 'pillars',
        list: true,
        ui: { itemProps: (item: any) => ({ label: item?.title }) },
        fields: [
          { type: 'string', label: 'Number', name: 'num' },
          { type: 'string', label: 'Title', name: 'title' },
          { type: 'string', label: 'Body', name: 'body', ui: { component: 'textarea' } },
        ],
      },
    ],
  } as const,
  {
    type: 'object',
    label: 'Contact',
    name: 'contact',
    fields: [
      { type: 'string', label: 'Name', name: 'name' },
      { type: 'string', label: 'Email', name: 'email' },
      { type: 'string', label: 'Website', name: 'web' },
    ],
  } as const,
];

const CaseStudy: Collection = {
  label: 'Case Studies',
  name: 'caseStudy',
  path: 'content/case-studies',
  format: 'json',
  ui: {
    router: ({ document }) => `/case-studies/${document._sys.filename}`,
  },
  fields: [
    { type: 'object', label: 'Czech', name: 'cs', fields: caseStudyLocaleFields as any },
    { type: 'object', label: 'English', name: 'en', fields: caseStudyLocaleFields as any },
  ],
};

export default CaseStudy;
