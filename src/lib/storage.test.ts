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
      version: 1,
      tasks: [{ id: 'a', title: 'Einkaufen', done: false, createdAt: 1 }],
    }
    saveState(state)
    expect(loadState()).toEqual(state)
  })
})
