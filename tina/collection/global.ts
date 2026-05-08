// tina/collection/global.ts
import type { Collection } from 'tinacms';
import { iconSchema } from '../fields/icon';

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
        {
          type: 'string',
          label: 'Site Name',
          name: 'name',
        },
        {
          type: 'string',
          label: 'Calendly URL',
          name: 'calendlyUrl',
          description: 'Full Calendly booking URL, e.g. https://calendly.com/adam-dalecky/30min',
        },
        {
          type: 'object',
          label: 'Nav Links',
          name: 'nav',
          list: true,
          ui: {
            itemProps: (item) => ({ label: item?.label }),
            defaultItem: { href: '#services', label: 'Služby' },
          },
          fields: [
            { type: 'string', label: 'Link', name: 'href' },
            { type: 'string', label: 'Label', name: 'label' },
          ],
        },
      ],
    },
    {
      type: 'object',
      label: 'Footer',
      name: 'footer',
      fields: [
        {
          type: 'string',
          label: 'Phone',
          name: 'phone',
        },
        {
          type: 'string',
          label: 'Email',
          name: 'email',
        },
        {
          type: 'object',
          label: 'Social Links',
          name: 'social',
          list: true,
          ui: {
            itemProps: (item) => ({ label: item?.icon?.name || 'Link' }),
          },
          fields: [
            iconSchema as any,
            { type: 'string', label: 'URL', name: 'url' },
          ],
        },
      ],
    },
  ],
};

export default Global;
