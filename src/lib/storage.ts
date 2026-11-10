import type { Task } from '@/features/tasks/model'
import type { Sprint } from '@/features/sprint/model'

const KEY = 'hwz-todo'
export const CURRENT_VERSION = 4
export const DEFAULT_DAILY_GOAL = 3

export type TodoState = {
  version: number
  tasks: Task[]
  sprint: Sprint | null
  dailyGoal: number
}

type TaskV1 = Omit<Task, 'status'> & { done: boolean }

export function migrateV1toV2(tasks: TaskV1[]): Task[] {
  return tasks.map(({ done, ...rest }) => ({ ...rest, status: done ? 'done' : 'todo' }))
}

export function migrateV2toV3(tasks: Task[]): Omit<TodoState, 'dailyGoal'> {
  return { version: 3, tasks, sprint: null }
}

export function migrateV3toV4(state: Omit<TodoState, 'dailyGoal'>): TodoState {
  return { ...state, version: 4, dailyGoal: DEFAULT_DAILY_GOAL }
}

const empty = (): TodoState => ({
  version: CURRENT_VERSION,
  tasks: [],
  sprint: null,
  dailyGoal: DEFAULT_DAILY_GOAL,
})

export function loadState(): TodoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as {
      version?: number
      tasks?: unknown
      sprint?: Sprint | null
      dailyGoal?: number
    }
    if (!Array.isArray(parsed.tasks)) return empty()
    const version = parsed.version ?? 1
    if (version < 2) return migrateV3toV4(migrateV2toV3(migrateV1toV2(parsed.tasks as TaskV1[])))
    if (version < 3) return migrateV3toV4(migrateV2toV3(parsed.tasks as Task[]))
    const v3 = { version: 3, tasks: parsed.tasks as Task[], sprint: parsed.sprint ?? null }
    if (version < 4) return migrateV3toV4(v3)
    return { ...v3, version: CURRENT_VERSION, dailyGoal: parsed.dailyGoal ?? DEFAULT_DAILY_GOAL }
  } catch {
    return empty()
  }
}

export function saveState(state: TodoState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}
