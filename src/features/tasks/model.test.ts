import { describe, expect, it } from 'vitest'
import { addTask, moveTask, toggleTask, removeTask, type Task } from './model'

describe('addTask', () => {
  it('adds a task with a trimmed title', () => {
    const tasks = addTask([], '   Einkaufen  ')
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Einkaufen')
    expect(tasks[0].status).toBe('todo')
  })

  it('ignores empty and whitespace-only titles', () => {
    expect(addTask([], '')).toHaveLength(0)
    expect(addTask([], '   ')).toHaveLength(0)
  })

  it('truncates titles longer than 200 characters', () => {
    const tasks = addTask([], 'x'.repeat(250))
    expect(tasks[0].title).toHaveLength(200)
  })
})

describe('toggleTask', () => {
  it('switches between todo and done both ways', () => {
    const [task] = addTask([], 'Einkaufen')
    const toggled = toggleTask([task], task.id)
    expect(toggled[0].status).toBe('done')
    const undone = toggleTask(toggled, task.id)
    expect(undone[0].status).toBe('todo')
  })

  it('marks a task in progress as done', () => {
    const [task] = addTask([], 'Einkaufen')
    const toggled = toggleTask([{ ...task, status: 'doing' }], task.id)
    expect(toggled[0].status).toBe('done')
  })
})

describe('removeTask', () => {
  it('removes the task with the given id', () => {
    const [task] = addTask([], 'Einkaufen')
    const rest = removeTask([task], task.id)
    expect(rest).toHaveLength(0)
  })
})

describe('moveTask', () => {
  const make = (id: string, status: Task['status']): Task => ({ id, title: id, status, createdAt: 1 })
  const tasks = [make('a', 'todo'), make('b', 'todo'), make('c', 'doing'), make('d', 'done')]
  const column = (list: Task[], status: Task['status']) =>
    list.filter((t) => t.status === status).map((t) => t.id)

  it('moves a task into another column at the given index', () => {
    const next = moveTask(tasks, 'a', 'doing', 0)
    expect(next.find((t) => t.id === 'a')?.status).toBe('doing')
    expect(column(next, 'doing')).toEqual(['a', 'c'])
    expect(column(next, 'todo')).toEqual(['b'])
  })

  it('appends to the end of a column for a large index', () => {
    const next = moveTask(tasks, 'a', 'doing', 99)
    expect(column(next, 'doing')).toEqual(['c', 'a'])
  })

  it('reorders inside the same column', () => {
    const next = moveTask(tasks, 'a', 'todo', 1)
    expect(column(next, 'todo')).toEqual(['b', 'a'])
    expect(next).toHaveLength(4)
  })

  it('returns the list unchanged for an unknown id', () => {
    expect(moveTask(tasks, 'x', 'done', 0)).toBe(tasks)
  })
})
