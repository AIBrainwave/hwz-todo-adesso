import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('shows a friendly message and a hint', () => {
    render(<EmptyState />)
    expect(screen.getByText('Alles erledigt. Zeit für Kaffee.')).toBeInTheDocument()
    expect(screen.getByText('Tippe oben eine neue Aufgabe ein oder drücke N.')).toBeInTheDocument()
  })

  it('shows a terminal window with the white rabbit line and a blinking cursor', () => {
    const { container } = render(<EmptyState />)
    expect(screen.getByText('Follow the white rabbit.')).toBeInTheDocument()
    expect(container.querySelector('.animate-blink')).not.toBeNull()
  })
})
