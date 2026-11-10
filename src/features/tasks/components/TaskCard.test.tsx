import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TaskCard from './TaskCard'
import type { Task } from '../model'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))
vi.mock('@/lib/theme', () => ({ readConfettiColors: () => ['#00ff41'] }))
vi.mock('sonner', () => ({ toast: vi.fn() }))

import { celebrate } from '@/lib/celebrate'
import { toast } from 'sonner'

const task: Task = { id: '1', title: 'Einkaufen', status: 'todo', createdAt: 1 }

const noop = () => {}

afterEach(() => {
  delete document.documentElement.dataset.look
})

describe('TaskCard', () => {
  it('shows the title and the toggle checkbox', () => {
    render(<TaskCard task={task} onToggle={noop} onRemove={noop} onRestore={noop} />)
    expect(screen.getByText('Einkaufen')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: '«Einkaufen» erledigt' })).toBeInTheDocument()
  })

  it('calls onToggle and celebrate when an open task is checked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<TaskCard task={task} onToggle={onToggle} onRemove={noop} onRestore={noop} />)
    await user.click(screen.getByRole('checkbox', { name: '«Einkaufen» erledigt' }))
    expect(onToggle).toHaveBeenCalledWith('1')
    expect(celebrate).toHaveBeenCalled()
  })

  it('does not celebrate when unchecking', async () => {
    const user = userEvent.setup()
    vi.mocked(celebrate).mockClear()
    render(
      <TaskCard task={{ ...task, status: 'done' as const }} onToggle={noop} onRemove={noop} onRestore={noop} />,
    )
    await user.click(screen.getByRole('checkbox', { name: '«Einkaufen» erledigt' }))
    expect(celebrate).not.toHaveBeenCalled()
  })

  it('calls onRemove and restores via the undo toast', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    const onRestore = vi.fn()
    render(<TaskCard task={task} onToggle={noop} onRemove={onRemove} onRestore={onRestore} />)
    await user.click(screen.getByRole('button', { name: '«Einkaufen» löschen' }))
    expect(onRemove).toHaveBeenCalledWith(task)
    const action = vi.mocked(toast).mock.calls[0][1]?.action as
      | { label: string; onClick: () => void }
      | undefined
    expect(action?.label).toBe('Rückgängig')
    action?.onClick()
    expect(onRestore).toHaveBeenCalledWith(task)
  })

  it('does not celebrate on check in look neon', async () => {
    document.documentElement.dataset.look = 'neon'
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<TaskCard task={task} onToggle={onToggle} onRemove={noop} onRestore={noop} />)
    await user.click(screen.getByRole('checkbox', { name: '«Einkaufen» erledigt' }))
    expect(onToggle).toHaveBeenCalledWith('1')
    expect(celebrate).not.toHaveBeenCalled()
  })

  it('renders the bullet element in look neon when done', () => {
    document.documentElement.dataset.look = 'neon'
    render(<TaskCard task={{ ...task, status: 'done' as const }} onToggle={noop} onRemove={noop} onRestore={noop} />)
    expect(document.querySelector('.bullet-time')).not.toBeNull()
  })

  it('cycles the repeat with its button', async () => {
    const user = userEvent.setup()
    const onCycleRepeat = vi.fn()
    const noop = () => {}
    render(
      <TaskCard task={task} onToggle={noop} onRemove={noop} onRestore={noop} onCycleRepeat={onCycleRepeat} />,
    )
    await user.click(screen.getByRole('button', { name: '«Einkaufen» wiederholen: aus' }))
    expect(onCycleRepeat).toHaveBeenCalledWith('1')
  })

  it('shows a badge for a weekly task', () => {
    const noop = () => {}
    render(
      <TaskCard
        task={{ ...task, repeat: 'weekly' }}
        onToggle={noop}
        onRemove={noop}
        onRestore={noop}
        onCycleRepeat={noop}
      />,
    )
    expect(screen.getByText('wöchentlich')).toBeInTheDocument()
  })
})
