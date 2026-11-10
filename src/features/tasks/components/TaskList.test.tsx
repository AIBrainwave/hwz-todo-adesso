import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TaskList from './TaskList'
import type { Task } from '../model'

const tasks: Task[] = [
  { id: '1', title: 'Offen', done: false, createdAt: 2 },
  { id: '2', title: 'Erledigt', done: true, createdAt: 1 },
]

describe('TaskList', () => {
  it('shows all tasks', () => {
    render(<TaskList tasks={tasks} onToggle={() => {}} onRemove={() => {}} onRestore={() => {}} />)
    expect(screen.getByText('Offen')).toBeInTheDocument()
    expect(screen.getByText('Erledigt')).toBeInTheDocument()
  })

  it('places done tasks after open ones', () => {
    const { container } = render(
      <TaskList tasks={tasks} onToggle={() => {}} onRemove={() => {}} onRestore={() => {}} />,
    )
    const items = container.querySelectorAll('li')
    expect(items[0]).toHaveTextContent('Offen')
    expect(items[1]).toHaveTextContent('Erledigt')
  })
})
