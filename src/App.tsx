import { MotionConfig } from 'motion/react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import MatrixRain from '@/components/MatrixRain'
import ProgressRing from '@/components/ProgressRing'
import { useTasks } from '@/features/tasks/useTasks'
import TaskInput from '@/features/tasks/components/TaskInput'
import Board from '@/features/tasks/components/Board'
import SprintGoal from '@/features/sprint/components/SprintGoal'
import EmptyState from '@/features/tasks/components/EmptyState'

export default function App() {
  const { tasks, add, toggle, remove, restore, move } = useTasks()
  const doneCount = tasks.filter((t) => t.status === 'done').length
  const date = new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <MatrixRain />
        <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
          <header className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-gradient font-heading text-4xl font-bold tracking-tight sm:text-6xl">
                Meine Aufgaben
              </h1>
              <p className="mt-2 text-muted-foreground">{date}</p>
            </div>
            <ProgressRing done={doneCount} total={tasks.length} />
          </header>
          <SprintGoal />
          <TaskInput onAdd={add} />
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <Board
              tasks={tasks}
              onMove={move}
              onToggle={toggle}
              onRemove={(t) => remove(t.id)}
              onRestore={restore}
            />
          )}
        </main>
        <Toaster position="bottom-center" richColors closeButton />
      </TooltipProvider>
    </MotionConfig>
  )
}
