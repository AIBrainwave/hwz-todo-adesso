export type TaskStatus = 'todo' | 'doing' | 'done'

export type Task = {
  id: string
  title: string
  status: TaskStatus
  createdAt: number
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
  return tasks.map((t) => (t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t))
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id)
}

export function moveTask(tasks: Task[], id: string, toStatus: TaskStatus, toIndex: number): Task[] {
  const task = tasks.find((t) => t.id === id)
  if (!task) return tasks
  const rest = tasks.filter((t) => t.id !== id)
  const moved = { ...task, status: toStatus }
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
