import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalendlyButton } from '@/components/ui/CalendlyButton'

describe('CalendlyButton', () => {
  it('renders with the provided label', () => {
    render(<CalendlyButton url="https://calendly.com/test" label="Book a call" />)
    expect(screen.getByRole('button', { name: 'Book a call' })).toBeInTheDocument()
  })

  it('loads Calendly script on first click', () => {
    const appendChildSpy = vi.spyOn(document.head, 'appendChild')
    render(<CalendlyButton url="https://calendly.com/test" label="Book a call" />)
    fireEvent.click(screen.getByRole('button'))
    expect(appendChildSpy).toHaveBeenCalled()
    appendChildSpy.mockRestore()
  })

  it('calls initPopupWidget when Calendly already loaded', () => {
    const mockInitPopup = vi.fn()
    ;(window as any).Calendly = { initPopupWidget: mockInitPopup }
    render(<CalendlyButton url="https://calendly.com/test" label="Book a call" />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockInitPopup).toHaveBeenCalledWith({ url: 'https://calendly.com/test' })
    delete (window as any).Calendly
  })
})
