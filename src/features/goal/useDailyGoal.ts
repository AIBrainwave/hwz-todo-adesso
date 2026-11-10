import { useCallback, useState } from 'react'
import { CURRENT_VERSION, loadState, saveState } from '@/lib/storage'
import { clampGoal } from './model'

export function useDailyGoal() {
  const [goal, setGoal] = useState(() => loadState().dailyGoal)

  const change = useCallback((delta: number) => {
    setGoal((prev) => {
      const next = clampGoal(prev + delta)
      saveState({ ...loadState(), version: CURRENT_VERSION, dailyGoal: next })
      return next
    })
  }, [])

  return { goal, change }
}
