import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskInput from './TaskInput'

describe('TaskInput', () => {
  it('calls onAdd with the trimmed title on submit', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TaskInput onAdd={onAdd} />)
    await user.type(screen.getByLabelText('Neue Aufgabe'), '  Einkaufen  ')
    await user.keyboard('{Enter}')
    expect(onAdd).toHaveBeenCalledWith('Einkaufen')
  })

  it('does not call onAdd for an empty input', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TaskInput onAdd={onAdd} />)
    await user.keyboard('{Enter}')
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('clears the field after adding', async () => {
    const user = userEvent.setup()
    render(<TaskInput onAdd={() => {}} />)
    const input = screen.getByLabelText('Neue Aufgabe')
    await user.type(input, 'Einkaufen')
    await user.keyboard('{Enter}')
    expect(input).toHaveValue('')
  })

  it('focuses the field when N is pressed', async () => {
    const user = userEvent.setup()
    render(<TaskInput onAdd={() => {}} />)
    const input = screen.getByLabelText('Neue Aufgabe')
    await user.keyboard('n')
    expect(input).toHaveFocus()
  })

  it('clears and blurs the field on Escape', async () => {
    const user = userEvent.setup()
    render(<TaskInput onAdd={() => {}} />)
    const input = screen.getByLabelText('Neue Aufgabe')
    await user.type(input, 'Einkaufen')
    await user.keyboard('{Escape}')
    expect(input).toHaveValue('')
    expect(input).not.toHaveFocus()
  })

  it('shows a terminal prompt before the field', () => {
    render(<TaskInput onAdd={vi.fn()} />)
    expect(screen.getByText('>')).toHaveClass('terminal-prompt')
  })
})
