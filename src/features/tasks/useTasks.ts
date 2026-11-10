import { useCallback, useState } from 'react'
import { addTask, moveTask, removeTask, toggleTask, type Task, type TaskStatus } from './model'
import { CURRENT_VERSION, loadState, saveState, type TodoState } from '@/lib/storage'

function persist(tasks: Task[]) {
  const state: TodoState = { version: CURRENT_VERSION, tasks }
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

  const move = useCallback((id: string, toStatus: TaskStatus, toIndex: number) => {
    setTasks((prev) => {
      const next = moveTask(prev, id, toStatus, toIndex)
      persist(next)
      return next
    })
  }, [])

  return { tasks, add, toggle, remove, restore, move }
}
