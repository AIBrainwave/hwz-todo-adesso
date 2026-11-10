import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTasks } from './useTasks'

describe('useTasks', () => {
  it('loads stored tasks on first render', () => {
    localStorage.setItem(
      'hwz-todo',
      JSON.stringify({
        version: 1,
        tasks: [{ id: 'a', title: 'Einkaufen', done: false, createdAt: 1 }],
      }),
    )
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Einkaufen')
  })

  it('adds a task and stores it', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.add('Einkaufen'))
    expect(result.current.tasks[0].title).toBe('Einkaufen')
    const stored = JSON.parse(localStorage.getItem('hwz-todo')!)
    expect(stored.tasks).toHaveLength(1)
  })

  it('toggles and removes tasks', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.add('Einkaufen'))
    const id = result.current.tasks[0].id
    act(() => result.current.toggle(id))
    expect(result.current.tasks[0].status).toBe('done')
    act(() => result.current.remove(id))
    expect(result.current.tasks).toHaveLength(0)
  })

  it('moves a task to another column and stores it', () => {
    localStorage.clear()
    const { result } = renderHook(() => useTasks())
    act(() => result.current.add('Einkaufen'))
    const id = result.current.tasks[0].id
    act(() => result.current.move(id, 'doing', 0))
    expect(result.current.tasks[0].status).toBe('doing')
    const stored = JSON.parse(localStorage.getItem('hwz-todo')!)
    expect(stored.tasks[0].status).toBe('doing')
  })

  it('keeps the sprint goal when saving tasks', () => {
    localStorage.setItem(
      'hwz-todo',
      JSON.stringify({ version: 3, tasks: [], sprint: { goal: 'Board zeigen', endDate: '2026-11-13' } }),
    )
    const { result } = renderHook(() => useTasks())
    act(() => result.current.add('Einkaufen'))
    const stored = JSON.parse(localStorage.getItem('hwz-todo')!)
    expect(stored.sprint).toEqual({ goal: 'Board zeigen', endDate: '2026-11-13' })
  })

  it('cycles the repeat of a task and stores it', () => {
    localStorage.clear()
    const { result } = renderHook(() => useTasks())
    act(() => result.current.add('Altpapier'))
    const id = result.current.tasks[0].id
    act(() => result.current.cycleRepeat(id))
    expect(JSON.parse(localStorage.getItem('hwz-todo')!).tasks[0].repeat).toBe('daily')
  })

  it('spawns due recurring tasks on start', () => {
    const yesterday = Date.now() - 24 * 60 * 60 * 1000
    localStorage.setItem(
      'hwz-todo',
      JSON.stringify({
        version: 4,
        dailyGoal: 3,
        sprint: null,
        tasks: [{ id: 'r', title: 'Altpapier', status: 'done', createdAt: 1, completedAt: yesterday, repeat: 'daily' }],
      }),
    )
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(2)
    expect(JSON.parse(localStorage.getItem('hwz-todo')!).tasks).toHaveLength(2)
  })
})
