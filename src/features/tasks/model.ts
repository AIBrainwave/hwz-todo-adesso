export type Task = {
  id: string
  title: string
  done: boolean
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
      done: false,
      createdAt: Date.now(),
    },
    ...tasks,
  ]
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id)
}
