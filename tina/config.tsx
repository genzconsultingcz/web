// tina/config.tsx
import { defineConfig } from 'tinacms';
import Global from './collection/global';
import Home from './collection/home';
import CaseStudy from './collection/case-study';
import CaseStudiesChrome from './collection/case-studies-chrome';
import Press from './collection/press';
import PressChrome from './collection/press-chrome';
import Service from './collection/service';
import ServicesChrome from './collection/services-chrome';

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! ||
    process.env.HEAD!,
  token: process.env.TINA_TOKEN!,
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'uploads',
    },
  },
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
    basePath: '',
  },
  schema: {
    collections: [Global, Home, CaseStudy, CaseStudiesChrome, Press, PressChrome, Service, ServicesChrome],
  },
});

export default config;
