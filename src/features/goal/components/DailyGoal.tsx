import { useEffect, useRef } from 'react'
import { Minus, Plus, Target } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { Task } from '@/features/tasks/model'
import { doneToday, MAX_GOAL, MIN_GOAL } from '../model'
import { useDailyGoal } from '../useDailyGoal'

export default function DailyGoal({ tasks }: { tasks: Task[] }) {
  const { goal, change } = useDailyGoal()
  const count = doneToday(tasks)
  const reached = count >= goal
  const wasReached = useRef(reached)

  useEffect(() => {
    if (reached && !wasReached.current) toast('Tagesziel erreicht!')
    wasReached.current = reached
  }, [reached])

  return (
    <section
      aria-label="Tagesziel"
      className={cn(
        'glass flex min-w-0 items-center gap-3 rounded-2xl border p-4 shadow-card transition-look',
        reached && 'glow',
      )}
    >
      <Target aria-hidden className="size-5 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-sm text-muted-foreground">
          {reached ? 'Tagesziel erreicht!' : 'Tagesziel'}
        </span>
        <span className="font-mono text-sm font-semibold">
          {count}/{goal} heute erledigt
        </span>
        <Progress value={Math.min(100, (count / goal) * 100)} aria-label="Fortschritt Tagesziel" />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label="Tagesziel verringern"
          disabled={goal <= MIN_GOAL}
          onClick={() => change(-1)}
        >
          <Minus className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label="Tagesziel erhöhen"
          disabled={goal >= MAX_GOAL}
          onClick={() => change(1)}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </section>
  )
}
