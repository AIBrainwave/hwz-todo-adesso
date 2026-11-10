import { useCallback, useState } from 'react'
import { CURRENT_VERSION, loadState, saveState } from '@/lib/storage'
import type { Sprint } from './model'

export function useSprint() {
  const [sprint, setSprint] = useState<Sprint | null>(() => loadState().sprint)

  const save = useCallback((next: Sprint) => {
    saveState({ ...loadState(), version: CURRENT_VERSION, sprint: next })
    setSprint(next)
  }, [])

  return { sprint, save }
}
