import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CaseStudiesPage from '@/components/pages/case-studies/CaseStudiesPage'

const chrome = {
  eyebrow: 'Naše práce',
  title: 'Projekty, kde jsme pomohli',
  subtitle: 'Konkrétní výsledky.',
  resultLabel: 'Výsledek',
  readMore: 'Přečíst case study',
  ctaTitle: 'Chcete podobné výsledky?',
  ctaDesc: 'Domluvte si call.',
  cta: 'Domluvit schůzku',
} as any

const cards = [
  {
    slug: 'av-media',
    client: 'AV MEDIA',
    desc: 'Popis case study.',
    serviceType: 'Research + Workshop',
    listResult: 'Klient získal konkrétní playbook.',
    logo: '/AV-MEDIA-SYSTEMS_horizontalni_1200_1200-970x970.png',
    logoAlt: 'AV Media Systems',
  },
] as any

describe('CaseStudiesPage', () => {
  it('renders chrome and case-study cards from props', () => {
    render(<CaseStudiesPage chrome={chrome} cards={cards} />)
    expect(screen.getByText('Projekty, kde jsme pomohli')).toBeInTheDocument()
    expect(screen.getByText('AV MEDIA')).toBeInTheDocument()
    expect(screen.getByText('Research + Workshop')).toBeInTheDocument()
    expect(screen.getByText('Klient získal konkrétní playbook.')).toBeInTheDocument()
    expect(screen.getByText('Chcete podobné výsledky?')).toBeInTheDocument()
  })
})
