import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ServicesPage from '@/components/pages/services/ServicesPage'

const chrome = {
  hero: { eyebrow: 'Naše služby', title: 'Jak pomáháme firmám pracovat s Gen Z', subtitle: 'Pět konkrétních způsobů.', cta: 'Domluvit schůzku' },
  learnMore: 'Zjistit více',
  notSure: { title: 'Nevíte, kde začít?', desc: 'Každá firma je jiná.', cta: 'Domluvit nezávaznou schůzku' },
} as any

const cards = [
  { slug: 'trainee-program', num: '01', title: 'Trainee program', desc: 'Popis trainee programu.', featured: false },
  { slug: 'custom', num: '05', title: 'Individuální řešení', desc: 'Každá firma je jiná.', featured: true },
] as any

describe('ServicesPage', () => {
  it('renders chrome, cards and custom featured card from props', () => {
    render(<ServicesPage chrome={chrome} cards={cards} />)
    expect(screen.getByText('Jak pomáháme firmám pracovat s Gen Z')).toBeInTheDocument()
    expect(screen.getByText('Trainee program')).toBeInTheDocument()
    expect(screen.getByText('Popis trainee programu.')).toBeInTheDocument()
    expect(screen.getAllByText('Zjistit více').length).toBeGreaterThan(0)
    expect(screen.getByText('Nevíte, kde začít?')).toBeInTheDocument()
  })
})
