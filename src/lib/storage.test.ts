import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, loadState, saveState } from './storage'

const KEY = 'hwz-todo'

describe('storage', () => {
  it('returns an empty list when nothing is stored', () => {
    localStorage.clear()
    const state = loadState()
    expect(state.version).toBe(CURRENT_VERSION)
    expect(state.tasks).toEqual([])
  })

  it('returns an empty list for broken JSON without throwing', () => {
    localStorage.setItem(KEY, 'not json {')
    expect(() => loadState()).not.toThrow()
    expect(loadState().tasks).toEqual([])
  })

  it('saves and reloads the whole state', () => {
    const state = {
      version: 4,
      tasks: [{ id: 'a', title: 'Einkaufen', status: 'doing' as const, createdAt: 1 }],
      sprint: { goal: 'Board zeigen', endDate: '2026-11-13' },
      dailyGoal: 5,
    }
    saveState(state)
    expect(loadState()).toEqual(state)
  })

  it('migrates version 1 data (done) to version 2 (status) without losing tasks', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        tasks: [
          { id: 'a', title: 'Einkaufen', done: true, createdAt: 1 },
          { id: 'b', title: 'Kochen', done: false, createdAt: 2 },
        ],
      }),
    )
    const state = loadState()
    expect(state.version).toBe(CURRENT_VERSION)
    expect(state.tasks).toEqual([
      { id: 'a', title: 'Einkaufen', status: 'done', createdAt: 1 },
      { id: 'b', title: 'Kochen', status: 'todo', createdAt: 2 },
    ])
  })

  it('migrates version 2 data to version 3 with an empty sprint', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 2,
        tasks: [{ id: 'a', title: 'Einkaufen', status: 'doing', createdAt: 1 }],
      }),
    )
    const state = loadState()
    expect(state).toEqual({
      version: CURRENT_VERSION,
      tasks: [{ id: 'a', title: 'Einkaufen', status: 'doing', createdAt: 1 }],
      sprint: null,
      dailyGoal: 3,
    })
  })

  it('migrates version 3 data to version 4 with a daily goal of 3', () => {
    const tasks = [{ id: 'a', title: 'Einkaufen', status: 'done', createdAt: 1 }]
    const sprint = { goal: 'Board zeigen', endDate: '2026-11-13' }
    localStorage.setItem(KEY, JSON.stringify({ version: 3, tasks, sprint }))
    expect(CURRENT_VERSION).toBe(4)
    expect(loadState()).toEqual({ version: 4, tasks, sprint, dailyGoal: 3 })
  })
})
