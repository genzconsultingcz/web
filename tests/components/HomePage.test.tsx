import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/components/pages/home/HomePage'

const content = {
  hero: {
    eyebrow: 'Specialisté na generaci Z',
    headline1: 'Generace Z není',
    headline2: 'komplikovaná',
    subline: 'Firmy ji jen neumí oslovit.',
    body: 'Pomáháme firmám přitáhnout, vybrat a udržet Gen Z talenty.',
    primaryCta: 'Domluvit schůzku',
    secondaryCta: 'Stáhnout průvodce zdarma',
    imageAlt: 'Tým GenZ Consulting',
  },
  logosEyebrow: 'Klienti a partneři',
  problem: { eyebrow: 'Proč to nefunguje', title: 'Problem title', villain: 'villain text', items: ['Item one'] },
  solution: { eyebrow: 'Jak přistupujeme jinak', title: 'Solution title', subtitle: 'sub', items: ['Solution item one'] },
  services: {
    eyebrow: 'Co umíme',
    title: 'Čtyři způsoby, jak pomáháme',
    viewAll: 'Zobrazit všechny služby →',
    learnMore: 'Zjistit více →',
    items: [{ num: '01', title: 'Trainee program', desc: 'desc', slug: 'trainee-program' }],
  },
  process: {
    eyebrow: 'Jak spolupráce vypadá',
    title: 'Tři kroky ke spolupráci',
    steps: [{ num: '01', title: 'Step one', desc: 'desc' }],
  },
  caseStudies: { eyebrow: 'Naše práce', title: 'Projekty, kde jsme pomohli', viewAll: 'view all', cardLabel: 'Case study', readMore: 'Read more' },
  pdf: {
    badge: 'badge', headline: 'PDF headline', body: 'body', cta: 'cta', secondaryCta: 'secondary',
    coverTitle: 'cover', coverMeta: 'meta', coverMetaTag: 'GZC · GUIDE 01',
  },
  stats: [{ num: '50+', label: 'spokojených firem' }],
  testimonials: {
    eyebrow: 'Co říkají klienti',
    linkedInLabel: 'LinkedIn',
    navAria: 'Přejít na referenci {n}',
    items: [{ quote: 'Skvělá spolupráce', author: 'Jozef Ryšavý', role: 'Marketing Director', linkedin: 'https://linkedin.com' }],
  },
  team: {
    eyebrow: 'Náš tým',
    title: 'Team title',
    viewAbout: 'more',
    members: [{ name: 'Adam Dalecký', role: 'Co-founder', bio: 'bio', photo: '/adam_cropped.jpeg', linkedin: 'https://linkedin.com' }],
  },
  cta: { title: 'Připraveni začít?', desc: 'desc', primary: 'primary', secondary: 'secondary' },
} as any

const logos = [{ name: 'Global Payments', src: '/globalpayments.jpeg' }] as any

const caseStudies = [
  { slug: 'av-media', client: 'AV MEDIA', intro: 'Testovací case study popis.' },
] as any

describe('HomePage', () => {
  it('renders copy from the content prop instead of translation keys', () => {
    render(<HomePage content={content} logos={logos} caseStudies={caseStudies} />)
    expect(screen.getByText('Generace Z není')).toBeInTheDocument()
    expect(screen.getByText('Trainee program')).toBeInTheDocument()
    expect(screen.getByText('spokojených firem')).toBeInTheDocument()
    expect(screen.getByText('Skvělá spolupráce')).toBeInTheDocument()
    expect(screen.getByText('Připraveni začít?')).toBeInTheDocument()
    expect(screen.getByText('AV MEDIA')).toBeInTheDocument()
  })

  it('does not render a trailing period in the highlighted English headline', () => {
    const englishContent = {
      ...content,
      hero: {
        ...content.hero,
        headline1: 'Gen Z is not',
        headline2: 'complicated.',
      },
    } as any

    render(<HomePage content={englishContent} logos={logos} caseStudies={caseStudies} />)

    expect(document.body.textContent).toContain('Gen Z is not complicated')
    expect(document.body.textContent).not.toContain('complicated.')
  })
})
