import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import SprintGoal from './SprintGoal'

function inDays(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

describe('SprintGoal', () => {
  beforeEach(() => localStorage.clear())

  it('sets a goal with an end date on Enter and stores it', async () => {
    const user = userEvent.setup()
    render(<SprintGoal />)
    await user.click(screen.getByRole('button', { name: /Sprint-Ziel setzen/ }))
    const goal = screen.getByRole('textbox', { name: 'Sprint-Ziel' })
    await user.type(goal, 'Board zeigen')
    fireEvent.change(screen.getByLabelText('Enddatum'), { target: { value: inDays(5) } })
    await user.type(goal, '{Enter}')
    expect(screen.getByText('Board zeigen')).toBeInTheDocument()
    expect(screen.getByText('noch 5 Tage')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem('hwz-todo')!)
    expect(stored.sprint).toEqual({ goal: 'Board zeigen', endDate: inDays(5) })
  })

  it('discards changes on Esc', async () => {
    localStorage.setItem(
      'hwz-todo',
      JSON.stringify({ version: 3, tasks: [], sprint: { goal: 'Board zeigen', endDate: inDays(2) } }),
    )
    const user = userEvent.setup()
    render(<SprintGoal />)
    await user.click(screen.getByRole('button', { name: /Board zeigen/ }))
    const goal = screen.getByRole('textbox', { name: 'Sprint-Ziel' })
    await user.clear(goal)
    await user.type(goal, 'Neu{Escape}')
    expect(screen.getByText('Board zeigen')).toBeInTheDocument()
    expect(screen.queryByText('Neu')).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('hwz-todo')!).sprint.goal).toBe('Board zeigen')
  })
})
