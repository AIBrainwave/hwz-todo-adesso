import type { Task } from '@/features/tasks/model'
import type { Sprint } from '@/features/sprint/model'

const KEY = 'hwz-todo'
export const CURRENT_VERSION = 3

export type TodoState = {
  version: number
  tasks: Task[]
  sprint: Sprint | null
}

type TaskV1 = Omit<Task, 'status'> & { done: boolean }

export function migrateV1toV2(tasks: TaskV1[]): Task[] {
  return tasks.map(({ done, ...rest }) => ({ ...rest, status: done ? 'done' : 'todo' }))
}

export function migrateV2toV3(tasks: Task[]): TodoState {
  return { version: 3, tasks, sprint: null }
}

const empty = (): TodoState => ({ version: CURRENT_VERSION, tasks: [], sprint: null })

export function loadState(): TodoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as { version?: number; tasks?: unknown; sprint?: Sprint | null }
    if (!Array.isArray(parsed.tasks)) return empty()
    const version = parsed.version ?? 1
    if (version < 2) return migrateV2toV3(migrateV1toV2(parsed.tasks as TaskV1[]))
    if (version < 3) return migrateV2toV3(parsed.tasks as Task[])
    return { version: CURRENT_VERSION, tasks: parsed.tasks as Task[], sprint: parsed.sprint ?? null }
  } catch {
    return empty()
  }
}

export function saveState(state: TodoState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}
