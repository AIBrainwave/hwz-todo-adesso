export type TaskStatus = 'todo' | 'doing' | 'done'

export type Task = {
  id: string
  title: string
  status: TaskStatus
  createdAt: number
  completedAt?: number
  repeat?: 'daily' | 'weekly'
}

function withStatus(task: Task, status: TaskStatus): Task {
  if (status === task.status) return task
  if (status === 'done') return { ...task, status, completedAt: Date.now() }
  const { completedAt: _completedAt, ...rest } = task
  void _completedAt
  return { ...rest, status }
}

const MAX_TITLE = 200

export function addTask(tasks: Task[], rawTitle: string): Task[] {
  const title = rawTitle.trim()
  if (!title) return tasks
  return [
    {
      id: crypto.randomUUID(),
      title: title.slice(0, MAX_TITLE),
      status: 'todo',
      createdAt: Date.now(),
    },
    ...tasks,
  ]
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) => (t.id === id ? withStatus(t, t.status === 'done' ? 'todo' : 'done') : t))
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id)
}

export function moveTask(tasks: Task[], id: string, toStatus: TaskStatus, toIndex: number): Task[] {
  const task = tasks.find((t) => t.id === id)
  if (!task) return tasks
  const rest = tasks.filter((t) => t.id !== id)
  const moved = withStatus(task, toStatus)
  const column = rest.filter((t) => t.status === toStatus)
  const anchor = column[Math.max(0, toIndex)]
  if (anchor) {
    const at = rest.indexOf(anchor)
    return [...rest.slice(0, at), moved, ...rest.slice(at)]
  }
  const last = column[column.length - 1]
  const at = last ? rest.indexOf(last) + 1 : rest.length
  return [...rest.slice(0, at), moved, ...rest.slice(at)]
}

const NEXT_REPEAT: Record<string, Task['repeat']> = { off: 'daily', daily: 'weekly', weekly: undefined }

export function cycleRepeat(tasks: Task[], id: string): Task[] {
  return tasks.map((t) => {
    if (t.id !== id) return t
    const next = NEXT_REPEAT[t.repeat ?? 'off']
    if (next) return { ...t, repeat: next }
    const { repeat: _repeat, ...rest } = t
    void _repeat
    return rest
  })
}

function startOfDay(time: number, plusDays = 0): number {
  const d = new Date(time)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + plusDays).getTime()
}

export function spawnRecurring(tasks: Task[], now: number = Date.now()): Task[] {
  const copies: Task[] = []
  const updated = tasks.map((t) => {
    if (t.status !== 'done' || !t.repeat || t.completedAt === undefined) return t
    const due = startOfDay(t.completedAt, t.repeat === 'daily' ? 1 : 7)
    if (startOfDay(now) < due) return t
    copies.push({ id: crypto.randomUUID(), title: t.title, status: 'todo', createdAt: now, repeat: t.repeat })
    const { repeat: _repeat, ...rest } = t
    void _repeat
    return rest
  })
  return copies.length ? [...copies, ...updated] : tasks
}
