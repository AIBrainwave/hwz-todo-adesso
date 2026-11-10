import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Flag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { daysLeftLabel } from '../model'
import { useSprint } from '../useSprint'

function isoInDays(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function SprintGoal() {
  const { sprint, save } = useSprint()
  const [editing, setEditing] = useState(false)
  const [goal, setGoal] = useState('')
  const [endDate, setEndDate] = useState('')

  const startEdit = () => {
    setGoal(sprint?.goal ?? '')
    setEndDate(sprint?.endDate ?? isoInDays(14))
    setEditing(true)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const text = goal.trim().slice(0, 200)
    if (!text || !endDate) return
    save({ goal: text, endDate })
    setEditing(false)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="glass flex flex-col gap-2 rounded-2xl border p-2 shadow-card sm:flex-row sm:items-center"
      >
        <Input
          autoFocus
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Worauf arbeitet der Sprint hin?"
          aria-label="Sprint-Ziel"
          maxLength={200}
          className="h-12 flex-1 border-0 bg-transparent px-4 text-base shadow-none focus-visible:ring-0"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          aria-label="Enddatum"
          className="h-12 border-0 bg-transparent px-4 font-mono shadow-none focus-visible:ring-0 sm:w-44"
        />
        <Button
          type="submit"
          className="h-12 rounded-xl bg-primary px-4 text-primary-foreground transition-look hover:scale-105 active:scale-95"
        >
          Speichern
        </Button>
      </form>
    )
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className="glass flex w-full min-w-0 items-center gap-3 rounded-2xl border p-4 text-left shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop"
    >
      <Flag aria-hidden className="size-5 shrink-0" />
      {sprint ? (
        <>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-muted-foreground">Sprint-Ziel</span>
            <span className="block break-words [overflow-wrap:anywhere] font-heading text-lg">{sprint.goal}</span>
          </span>
          <Badge variant="secondary" className="shrink-0 font-mono">
            {daysLeftLabel(sprint.endDate)}
          </Badge>
        </>
      ) : (
        <span className="flex-1 text-muted-foreground">Sprint-Ziel setzen</span>
      )}
    </button>
  )
}
