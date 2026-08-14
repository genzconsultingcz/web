import type { Metadata } from 'next';

export const SITE_URL = 'https://www.genzconsulting.cz';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const DEFAULT_LOCALE = 'cs';
export const LOCALES = ['cs', 'en'] as const;

export function localizedUrl(locale: string, path = '/') {
  const cleanPath = path === '/' ? '' : path;
  return `${SITE_URL}/${locale}${cleanPath}`;
}

export function getPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string | { absolute: string };
  description: string;
}): Metadata {
  const url = localizedUrl(locale, path);
  const defaultPath = path === '/' ? '' : path;
  const titleValue = typeof title === 'string' ? title : title.absolute;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        cs: `${SITE_URL}/cs${defaultPath}`,
        en: `${SITE_URL}/en${defaultPath}`,
        'x-default': `${SITE_URL}/cs${defaultPath}`,
      },
    },
    openGraph: {
      title: titleValue,
      description,
      url,
      siteName: 'GenZ Consulting',
      locale: locale === 'en' ? 'en_US' : 'cs_CZ',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'GenZ Consulting' }],
    },
  };
}

export const SEO = {
  home: {
    cs: {
      title: 'GenZ Consulting | Specialisté na generaci Z',
      description:
        'Pomáháme středním a velkým firmám komunikovat, přitahovat a udržet generaci Z. Workshopy, training programy a onboardingová aplikace na míru.',
    },
    en: {
      title: 'GenZ Consulting | Specialists on Generation Z',
      description:
        'We help mid-sized and large companies communicate with, attract and retain Generation Z. Workshops, training programs and a custom onboarding app.',
    },
  },
  about: {
    cs: {
      title: 'O nás',
      description:
        'Poznejte GenZ Consulting — tým konzultantů, kteří jsou generací Z zevnitř. Pomáháme firmám porozumět mladé generaci.',
    },
    en: {
      title: 'About us',
      description:
        'Meet GenZ Consulting — a team of consultants who are Generation Z from the inside. We help companies understand the young generation.',
    },
  },
  contact: {
    cs: {
      title: 'Kontakt',
      description: 'Domluvte si nezávazný call s GenZ Consulting. Zjistíme, co vás trápí, a odpovíme na všechny otázky.',
    },
    en: {
      title: 'Contact',
      description: 'Book a no-obligation call with GenZ Consulting. We will find out what is troubling you and answer all your questions.',
    },
  },
  services: {
    cs: {
      title: 'Služby',
      description:
        'Workshopy o generaci Z, trainee programy, onboardingové aplikace a kariérní stránky na míru pro vaši firmu.',
    },
    en: {
      title: 'Services',
      description:
        'Generation Z workshops, trainee programs, onboarding apps and career pages tailored to your company.',
    },
  },
  'trainee-program': {
    cs: {
      title: 'Trainee program',
      description: 'Kompletní trainee program na míru přitáhne správné talenty, efektivně je vyškolí a udrží ve firmě.',
    },
    en: {
      title: 'Trainee program',
      description: 'A fully custom trainee program — attracts the right talent, trains them effectively and keeps them at your company.',
    },
  },
  'onboarding-app': {
    cs: {
      title: 'Onboardingová aplikace',
      description: 'Digitální průvodce onboardingem v nástrojích, které firma již používá. HR vidí vše v reálném čase.',
    },
    en: {
      title: 'Onboarding app',
      description: 'A digital onboarding guide built in tools your company already uses. HR sees everything in real time.',
    },
  },
  'genz-workshop': {
    cs: {
      title: 'Workshop o generaci Z',
      description: 'Vzdělávací workshop pro HR týmy ve třech variantách — od obecného základu po výzkum na míru vaší firmě.',
    },
    en: {
      title: 'Gen Z Workshop',
      description: 'An educational workshop for HR teams in three variants — from a general foundation to custom research for your company.',
    },
  },
  'career-pages': {
    cs: {
      title: 'Kariérní stránky',
      description: 'Analýza vaší kariérní stránky z pohledu Gen Z s konkrétními doporučeními, co a jak změnit.',
    },
    en: {
      title: 'Career pages',
      description: "An analysis of your career page from Gen Z's perspective, with concrete recommendations on what and how to change.",
    },
  },
  custom: {
    cs: {
      title: 'Nevíte, kde začít?',
      description: 'Každá firma je jiná. Pokud si nejste jisti, co přesně potřebujete, začněme rozhovorem.',
    },
    en: {
      title: 'Not sure where to start?',
      description: "Every company is different. If you're not sure what you need, let's start with a conversation.",
    },
  },
  'case-studies': {
    cs: {
      title: 'Případové studie',
      description: 'Jak GenZ Consulting pomohl firmám jako AV Media, Global Payments nebo Generali přilákat generaci Z.',
    },
    en: {
      title: 'Case studies',
      description: 'How GenZ Consulting helped companies like AV Media, Global Payments or Generali attract Generation Z.',
    },
  },
  media: {
    cs: {
      title: 'Média o nás',
      description:
        'Psali o nás — přehled článků, výzkumů a vystoupení o GenZ Consulting v médiích, akademických portálech a ve veřejné správě.',
    },
    en: {
      title: 'Media coverage',
      description:
        'They wrote about us — an overview of articles, research and appearances about GenZ Consulting in media, academic portals and public administration.',
    },
  },
} satisfies Record<string, { cs: { title: string; description: string }; en: { title: string; description: string } }>;
