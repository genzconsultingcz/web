import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CaseStudyDetail from '@/components/pages/case-studies/CaseStudyDetail'

const chrome = {
  back: 'Zpět na case studies',
  caseLabel: 'Case study',
  clientLabel: 'Klient',
  sectionContext: 'Kontext & výzva',
  sectionApproach: 'Náš přístup',
  sectionFindings: 'Klíčová zjištění',
  sectionOutputs: 'Výstupy & dopad',
  sectionWhy: 'Proč GenZ Consulting',
  contactLabel: 'Kontakt',
  ctaTitle: 'Chcete podobné výsledky?',
  ctaDesc: 'Domluvte si call.',
  cta: 'Domluvit schůzku',
} as any

const cs = {
  client: 'AV MEDIA',
  logo: '/logo_dark_bg.webp',
  logoAlt: 'AV Media',
  year: '2026',
  hero: { headline: 'Testovací headline', intro: 'Testovací intro.' },
  scope: [{ label: 'Rozsah', value: 'Test' }],
  stats: [{ value: '10', label: 'test statistika' }],
  context: {
    headline: 'Context headline',
    intro: 'Context intro.',
    clientLabel: 'Kdo je klient',
    client: 'Popis klienta.',
    whyTitle: 'Proč to nebyl běžný projekt',
    whyPoints: [{ title: 'Bod jedna', body: 'Popis bodu.' }],
    briefLabel: 'Naše zadání',
    brief: 'Popis zadání.',
  },
  approach: {
    headline: 'Approach headline',
    intro: 'Approach intro.',
    steps: [{ num: '1', title: 'Krok jedna', body: 'Popis kroku.' }],
    assessedTitle: 'Co jsme posuzovali',
    assessedIntro: 'Intro.',
    assessed: [{ num: '01', title: 'Assessed jedna' }],
  },
  findings: {
    headline: 'Findings headline',
    intro: 'Findings intro.',
    column1: 'Sloupec 1',
    column2: 'Sloupec 2',
    column3: 'Sloupec 3',
    items: [{ category: 'Kategorie', title: 'Finding jedna', col1: 'C1', col2: 'C2', col3: 'C3' }],
  },
  outputs: {
    headline: 'Outputs headline',
    intro: 'Outputs intro.',
    items: [{ num: '01', title: 'Output jedna', body: 'Popis outputu.' }],
    quote: 'Testovací citace.',
    quoteAuthor: 'Tým',
  },
  whyUs: {
    headline: 'Why us headline',
    intro: 'Why us intro.',
    pillars: [{ num: '01', title: 'Pilíř jedna', body: 'Popis pilíře.' }],
  },
  contact: { name: 'Adam Dalecký', email: 'adam@example.com', web: 'www.example.com' },
} as any

describe('CaseStudyDetail', () => {
  it('renders case-study content and chrome from props', () => {
    render(<CaseStudyDetail cs={cs} chrome={chrome} />)
    expect(screen.getByText('Testovací headline')).toBeInTheDocument()
    expect(screen.getByText('Context headline')).toBeInTheDocument()
    expect(screen.getByText('C1')).toBeInTheDocument()
    expect(screen.getByText('Testovací citace.')).toBeInTheDocument()
    expect(screen.getAllByText('Zpět na case studies').length).toBeGreaterThan(0)
    expect(screen.getByText('Kontext & výzva')).toBeInTheDocument()
  })

  it('renders nothing when cs is missing', () => {
    const { container } = render(<CaseStudyDetail cs={null as any} chrome={chrome} />)
    expect(container).toBeEmptyDOMElement()
  })
})
