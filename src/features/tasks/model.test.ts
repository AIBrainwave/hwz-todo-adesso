import { describe, expect, it } from 'vitest'
import { addTask, toggleTask, removeTask } from './model'

describe('addTask', () => {
  it('adds a task with a trimmed title', () => {
    const tasks = addTask([], '   Einkaufen  ')
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Einkaufen')
    expect(tasks[0].done).toBe(false)
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
  it('flips the done state both ways', () => {
    const [task] = addTask([], 'Einkaufen')
    const toggled = toggleTask([task], task.id)
    expect(toggled[0].done).toBe(true)
    const undone = toggleTask(toggled, task.id)
    expect(undone[0].done).toBe(false)
  })
})

describe('removeTask', () => {
  it('removes the task with the given id', () => {
    const [task] = addTask([], 'Einkaufen')
    const rest = removeTask([task], task.id)
    expect(rest).toHaveLength(0)
  })
})
