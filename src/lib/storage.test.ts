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
      version: 2,
      tasks: [{ id: 'a', title: 'Einkaufen', status: 'doing' as const, createdAt: 1 }],
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
    expect(CURRENT_VERSION).toBe(2)
    expect(state.version).toBe(2)
    expect(state.tasks).toEqual([
      { id: 'a', title: 'Einkaufen', status: 'done', createdAt: 1 },
      { id: 'b', title: 'Kochen', status: 'todo', createdAt: 2 },
    ])
  })
})
