import type { Task } from '@/features/tasks/model'

const KEY = 'hwz-todo'
export const CURRENT_VERSION = 1

export type TodoState = {
  version: number
  tasks: Task[]
}

export function loadState(): TodoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { version: CURRENT_VERSION, tasks: [] }
    const parsed = JSON.parse(raw) as TodoState
    if (!Array.isArray(parsed.tasks)) return { version: CURRENT_VERSION, tasks: [] }
    return parsed
  } catch {
    return { version: CURRENT_VERSION, tasks: [] }
  }
}

export function saveState(state: TodoState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}
