import type { Task } from '@/features/tasks/model'

export const MIN_GOAL = 1
export const MAX_GOAL = 20

function sameDay(a: number, b: number) {
  const x = new Date(a)
  const y = new Date(b)
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate()
}

export function doneToday(tasks: Task[], now: number = Date.now()): number {
  return tasks.filter((t) => t.status === 'done' && t.completedAt !== undefined && sameDay(t.completedAt, now))
    .length
}

export function clampGoal(goal: number): number {
  return Math.min(MAX_GOAL, Math.max(MIN_GOAL, Math.round(goal)))
}
