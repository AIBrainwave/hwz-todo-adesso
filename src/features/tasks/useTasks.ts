import { useCallback, useState } from 'react'
import { addTask, removeTask, toggleTask, type Task } from './model'
import { loadState, saveState, type TodoState } from '@/lib/storage'

function persist(tasks: Task[]) {
  const state: TodoState = { version: 1, tasks }
  saveState(state)
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadState().tasks)

  const add = useCallback((title: string) => {
    setTasks((prev) => {
      const next = addTask(prev, title)
      persist(next)
      return next
    })
  }, [])

  const toggle = useCallback((id: string) => {
    setTasks((prev) => {
      const next = toggleTask(prev, id)
      persist(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setTasks((prev) => {
      const next = removeTask(prev, id)
      persist(next)
      return next
    })
  }, [])

  const restore = useCallback((task: Task) => {
    setTasks((prev) => {
      const next = [...prev, task].sort((a, b) => a.createdAt - b.createdAt)
      persist(next)
      return next
    })
  }, [])

  return { tasks, add, toggle, remove, restore }
}
