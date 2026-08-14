import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/nav/footer'
import { LayoutProvider } from '@/components/layout/layout-context'

const globalSettings = {
  header: { name: 'GenZ Consulting' },
  footer: {
    phone: '+420 606 028 051',
    email: 'adam.dalecky@genzconsulting.cz',
    social: [],
    copy: {
      cs: {
        tagline: 'Systémy pro mladé by měli stavět mladí.',
        rights: 'Všechna práva vyhrazena.',
        navLabel: 'Navigace',
        contactLabel: 'Kontakt',
        followLabel: 'Sledujte nás',
        web: 'www.genzconsulting.cz',
        socialDomain: 'linkedin.com/company/gen-zconsulting',
        navServices: 'Služby',
        navCaseStudies: 'Case studies',
        navMedia: 'Média',
        navContact: 'Kontakt',
        navGuide: 'Průvodce',
        homeLogoAria: 'GenZ Consulting — domů',
      },
      en: {
        tagline: 'Systems for young people should be built by young people.',
        rights: 'All rights reserved.',
        navLabel: 'Navigation',
        contactLabel: 'Contact',
        followLabel: 'Follow us',
        web: 'www.genzconsulting.cz',
        socialDomain: 'linkedin.com/company/gen-zconsulting',
        navServices: 'Services',
        navCaseStudies: 'Case studies',
        navMedia: 'Media',
        navContact: 'Contact',
        navGuide: 'Guide',
        homeLogoAria: 'GenZ Consulting — home',
      },
    },
  },
} as any

describe('Footer', () => {
  it('renders footer copy from Tina global settings for the current locale', () => {
    render(
      <LayoutProvider globalSettings={globalSettings} pageData={{}}>
        <Footer />
      </LayoutProvider>
    )
    // vitest.setup.ts mocks next-intl's useLocale() to always return 'cs'
    expect(screen.getByText('Systémy pro mladé by měli stavět mladí.')).toBeInTheDocument()
    expect(screen.getByText('Služby')).toBeInTheDocument()
    expect(screen.getByText('Média')).toBeInTheDocument()
    expect(screen.getByText('Všechna práva vyhrazena.', { exact: false })).toBeInTheDocument()
  })
})
