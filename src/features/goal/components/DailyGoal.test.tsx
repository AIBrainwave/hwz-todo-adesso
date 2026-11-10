import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DailyGoal from './DailyGoal'
import type { Task } from '@/features/tasks/model'

vi.mock('sonner', () => ({ toast: vi.fn() }))
import { toast } from 'sonner'

const done = (id: string): Task => ({ id, title: id, status: 'done', createdAt: 1, completedAt: Date.now() })

describe('DailyGoal', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(toast).mockClear()
  })

  it('shows how many tasks are done today', () => {
    render(<DailyGoal tasks={[done('a')]} />)
    expect(screen.getByText('1/3 heute erledigt')).toBeInTheDocument()
  })

  it('raises the goal with + and stores it', async () => {
    const user = userEvent.setup()
    render(<DailyGoal tasks={[]} />)
    await user.click(screen.getByRole('button', { name: 'Tagesziel erhöhen' }))
    expect(screen.getByText('0/4 heute erledigt')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('hwz-todo')!).dailyGoal).toBe(4)
  })

  it('celebrates when the goal is reached', () => {
    const { rerender } = render(<DailyGoal tasks={[done('a'), done('b')]} />)
    expect(toast).not.toHaveBeenCalled()
    rerender(<DailyGoal tasks={[done('a'), done('b'), done('c')]} />)
    expect(screen.getByText('Tagesziel erreicht!')).toBeInTheDocument()
    expect(toast).toHaveBeenCalledWith('Tagesziel erreicht!')
  })
})
