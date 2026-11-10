import { describe, expect, it } from 'vitest'
import { clampGoal, doneToday } from './model'
import type { Task } from '@/features/tasks/model'

const now = new Date(2026, 10, 10, 18, 0).getTime()
const today = new Date(2026, 10, 10, 8, 0).getTime()
const yesterday = new Date(2026, 10, 9, 23, 30).getTime()

const task = (status: Task['status'], completedAt?: number): Task => ({
  id: String(Math.random()),
  title: 'x',
  status,
  createdAt: 1,
  completedAt,
})

describe('doneToday', () => {
  it('counts only tasks completed today', () => {
    const tasks = [task('done', today), task('done', yesterday), task('todo'), task('done')]
    expect(doneToday(tasks, now)).toBe(1)
  })
})

describe('clampGoal', () => {
  it('keeps the goal between 1 and 20', () => {
    expect(clampGoal(0)).toBe(1)
    expect(clampGoal(5)).toBe(5)
    expect(clampGoal(21)).toBe(20)
  })
})
