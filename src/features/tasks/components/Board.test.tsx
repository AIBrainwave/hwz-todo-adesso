import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Board from './Board'
import type { Task } from '../model'

const tasks: Task[] = [
  { id: '1', title: 'Einkaufen', status: 'todo', createdAt: 1 },
  { id: '2', title: 'Kochen', status: 'doing', createdAt: 2 },
  { id: '3', title: 'Abwaschen', status: 'done', createdAt: 3 },
  { id: '4', title: 'Putzen', status: 'todo', createdAt: 4 },
]

const renderBoard = () =>
  render(
    <Board tasks={tasks} onMove={vi.fn()} onToggle={vi.fn()} onRemove={vi.fn()} onRestore={vi.fn()} onCycleRepeat={vi.fn()} />,
  )

describe('Board', () => {
  it('shows three columns with heading and count', () => {
    renderBoard()
    const todo = screen.getByRole('region', { name: 'Offen' })
    const doing = screen.getByRole('region', { name: 'In Arbeit' })
    const done = screen.getByRole('region', { name: 'Erledigt' })
    expect(within(todo).getByText('2')).toBeInTheDocument()
    expect(within(doing).getByText('1')).toBeInTheDocument()
    expect(within(done).getByText('1')).toBeInTheDocument()
  })

  it('places every card in the column of its status', () => {
    renderBoard()
    expect(within(screen.getByRole('region', { name: 'Offen' })).getByText('Einkaufen')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'In Arbeit' })).getByText('Kochen')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Erledigt' })).getByText('Abwaschen')).toBeInTheDocument()
  })

  it('gives every card a drag handle', () => {
    renderBoard()
    expect(screen.getByRole('button', { name: '«Kochen» verschieben' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /verschieben$/ })).toHaveLength(4)
  })

  it('shows a drop area in an empty column', () => {
    render(
      <Board tasks={[tasks[0]]} onMove={vi.fn()} onToggle={vi.fn()} onRemove={vi.fn()} onRestore={vi.fn()} onCycleRepeat={vi.fn()} />,
    )
    expect(within(screen.getByRole('region', { name: 'Erledigt' })).getByText('Hierher ziehen')).toBeInTheDocument()
  })
})
