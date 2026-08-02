import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactButton } from '@/components/ui/ContactButton'

describe('ContactButton', () => {
  it('renders with the provided label', () => {
    render(<ContactButton label="Book a call" />)
    expect(screen.getByRole('button', { name: 'Book a call' })).toBeInTheDocument()
  })

  it('opens the contact dialog on click', () => {
    render(<ContactButton label="Book a call" />)
    fireEvent.click(screen.getByRole('button', { name: 'Book a call' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})