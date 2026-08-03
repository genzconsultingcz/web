import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TraineeProgramPage from '@/components/pages/services/TraineeProgramPage'

const content = {
  hero: { eyebrow: 'Služba 01', title: 'Trainee program', subtitle: 'Postavíme vám trainee program.', cta: 'Domluvit schůzku' },
  sections: [
    { label: 'Co to je', text: 'Kompletně postavený trainee program.' },
    { label: 'Pro koho', text: 'Firmy, které chtějí Gen Z přitáhnout.' },
  ],
  timeline: { label: 'Časový rámec', text: '1 až 6 měsíců.' },
  finalCta: { title: 'Chcete trainee program?', desc: 'Domluvte si call.' },
} as any

describe('TraineeProgramPage', () => {
  it('renders hero, sections, timeline and CTA from props', () => {
    render(<TraineeProgramPage num="01" content={content} />)
    expect(screen.getByText('Trainee program')).toBeInTheDocument()
    expect(screen.getByText('Co to je')).toBeInTheDocument()
    expect(screen.getByText('Kompletně postavený trainee program.')).toBeInTheDocument()
    expect(screen.getByText('Časový rámec')).toBeInTheDocument()
    expect(screen.getByText('1 až 6 měsíců.')).toBeInTheDocument()
  })
})
