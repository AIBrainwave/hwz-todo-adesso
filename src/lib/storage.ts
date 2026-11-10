import type { Task } from '@/features/tasks/model'

const KEY = 'hwz-todo'
export const CURRENT_VERSION = 2

export type TodoState = {
  version: number
  tasks: Task[]
}

type TaskV1 = Omit<Task, 'status'> & { done: boolean }

export function migrateV1toV2(tasks: TaskV1[]): Task[] {
  return tasks.map(({ done, ...rest }) => ({ ...rest, status: done ? 'done' : 'todo' }))
}

const empty = (): TodoState => ({ version: CURRENT_VERSION, tasks: [] })

export function loadState(): TodoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as { version?: number; tasks?: unknown }
    if (!Array.isArray(parsed.tasks)) return empty()
    if ((parsed.version ?? 1) < 2) {
      return { version: CURRENT_VERSION, tasks: migrateV1toV2(parsed.tasks as TaskV1[]) }
    }
    return { version: CURRENT_VERSION, tasks: parsed.tasks as Task[] }
  } catch {
    return empty()
  }
}

export function saveState(state: TodoState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}
