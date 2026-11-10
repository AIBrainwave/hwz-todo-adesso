import { useMemo } from 'react'
import { AnimatePresence } from 'motion/react'
import TaskCard from './TaskCard'
import type { Task } from '../model'

type TaskListProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onRemove: (task: Task) => void
  onRestore: (task: Task) => void
}

export default function TaskList({ tasks, onToggle, onRemove, onRestore }: TaskListProps) {
  const sorted = useMemo(() => [...tasks].sort((a, b) => Number(a.status === 'done') - Number(b.status === 'done')), [tasks])

  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false} mode="popLayout">
        {sorted.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onRemove={onRemove}
            onRestore={onRestore}
          />
        ))}
      </AnimatePresence>
    </ul>
  )
}
