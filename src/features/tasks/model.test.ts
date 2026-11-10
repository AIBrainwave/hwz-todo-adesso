import { describe, expect, it } from 'vitest'
import { addTask, cycleRepeat, moveTask, spawnRecurring, toggleTask, removeTask, type Task } from './model'

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

describe('completedAt', () => {
  it('is set when a task is checked and removed when it is reopened', () => {
    const [task] = addTask([], 'Einkaufen')
    const done = toggleTask([task], task.id)
    expect(typeof done[0].completedAt).toBe('number')
    const reopened = toggleTask(done, task.id)
    expect(reopened[0].completedAt).toBeUndefined()
  })

  it('is set when a task is moved to done and removed when it leaves done', () => {
    const [task] = addTask([], 'Einkaufen')
    const done = moveTask([task], task.id, 'done', 0)
    expect(typeof done[0].completedAt).toBe('number')
    const doing = moveTask(done, task.id, 'doing', 0)
    expect(doing[0].completedAt).toBeUndefined()
  })
})

describe('cycleRepeat', () => {
  it('cycles off, daily, weekly, off', () => {
    const [task] = addTask([], 'Altpapier')
    const daily = cycleRepeat([task], task.id)
    expect(daily[0].repeat).toBe('daily')
    const weekly = cycleRepeat(daily, task.id)
    expect(weekly[0].repeat).toBe('weekly')
    const off = cycleRepeat(weekly, task.id)
    expect(off[0].repeat).toBeUndefined()
  })
})

describe('spawnRecurring', () => {
  const now = new Date(2026, 10, 10, 9, 0).getTime()
  const daysAgo = (n: number) => new Date(2026, 10, 10 - n, 20, 0).getTime()
  const doneTask = (repeat: Task['repeat'], completedAt: number): Task => ({
    id: 'r',
    title: 'Altpapier',
    status: 'done',
    createdAt: 1,
    completedAt,
    repeat,
  })

  it('creates an open copy of a daily task done yesterday, exactly once', () => {
    const first = spawnRecurring([doneTask('daily', daysAgo(1))], now)
    expect(first).toHaveLength(2)
    const copy = first.find((t) => t.status === 'todo')!
    expect(copy.title).toBe('Altpapier')
    expect(copy.repeat).toBe('daily')
    expect(first.find((t) => t.id === 'r')!.repeat).toBeUndefined()
    expect(spawnRecurring(first, now)).toHaveLength(2)
  })

  it('does not copy a daily task done today', () => {
    const tasks = [doneTask('daily', new Date(2026, 10, 10, 8, 0).getTime())]
    expect(spawnRecurring(tasks, now)).toBe(tasks)
  })

  it('waits 7 days for a weekly task', () => {
    const early = [doneTask('weekly', daysAgo(3))]
    expect(spawnRecurring(early, now)).toBe(early)
    expect(spawnRecurring([doneTask('weekly', daysAgo(7))], now)).toHaveLength(2)
  })
})
