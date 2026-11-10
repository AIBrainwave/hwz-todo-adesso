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
})
