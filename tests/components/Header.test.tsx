import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/nav/header'
import { LayoutProvider } from '@/components/layout/layout-context'

const globalSettings = {
  header: {
    name: 'GenZ Consulting',
    nav: {
      cs: {
        homeLabel: 'Domů',
        caseStudiesLabel: 'Case studies',
        contactLabel: 'Kontakt',
        servicesLabel: 'Služby',
        viewServicesLabel: 'Všechny služby',
        bookCallLabel: 'Domluvit schůzku',
        homeLogoAria: 'GenZ Consulting, domů',
        menuOpenAria: 'Otevřít menu',
        menuCloseAria: 'Zavřít menu',
        serviceLinks: [{ slug: 'trainee-program', label: 'Trainee program' }],
      },
      en: {
        homeLabel: 'Home',
        caseStudiesLabel: 'Case studies',
        contactLabel: 'Contact',
        servicesLabel: 'Services',
        viewServicesLabel: 'All services',
        bookCallLabel: 'Book a call',
        homeLogoAria: 'GenZ Consulting, home',
        menuOpenAria: 'Open menu',
        menuCloseAria: 'Close menu',
        serviceLinks: [{ slug: 'trainee-program', label: 'Trainee program' }],
      },
    },
  },
  footer: { phone: '', email: '', social: [] },
} as any

describe('Header', () => {
  it('renders nav labels from Tina global settings for the current locale', () => {
    render(
      <LayoutProvider globalSettings={globalSettings} pageData={{}}>
        <Header />
      </LayoutProvider>
    )
    // vitest.setup.ts mocks next-intl's useLocale() to always return 'cs'
    expect(screen.getByText('Kontakt')).toBeInTheDocument()
    expect(screen.getByLabelText('GenZ Consulting, domů')).toBeInTheDocument()
  })
})
