import { useRef } from 'react'
import { motion } from 'motion/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { celebrate } from '@/lib/celebrate'
import { readConfettiColors } from '@/lib/theme'
import type { Task } from '../model'

type TaskCardProps = {
  task: Task
  onToggle: (id: string) => void
  onRemove: (task: Task) => void
  onRestore: (task: Task) => void
}

export default function TaskCard({ task, onToggle, onRemove, onRestore }: TaskCardProps) {
  const checkboxRef = useRef<HTMLButtonElement>(null)
  const look = document.documentElement.dataset.look
  const isNeon = look === 'neon'
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleToggle = () => {
    if (!task.done && !reduce && !isNeon) {
      const el = checkboxRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        celebrate(readConfettiColors(), {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        })
      }
    }
    onToggle(task.id)
  }

  const handleRemove = () => {
    onRemove(task)
    toast('Aufgabe gelöscht', {
      action: { label: 'Rückgängig', onClick: () => onRestore(task) },
      duration: 5000,
    })
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="group glass flex items-start gap-3 rounded-xl border p-4 shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop focus-within:glow"
    >
      <Checkbox
        ref={checkboxRef}
        checked={task.done}
        onCheckedChange={handleToggle}
        className="mt-0.5 size-6 rounded-md transition-look data-[state=checked]:animate-pop data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
        aria-label={`«${task.title}» erledigt`}
      />
      <span
        className={`relative flex-1 min-w-0 break-words [overflow-wrap:anywhere] text-base leading-relaxed ${
          task.done ? 'text-muted-foreground' : ''
        }`}
      >
        <motion.span
          aria-hidden
          className="absolute left-0 top-1/2 h-0.5 w-full origin-left bg-current"
          animate={{ scaleX: task.done ? 1 : 0 }}
          transition={{
            duration: isNeon ? 0.9 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
        {isNeon && task.done && !reduce && <span className="bullet-time" aria-hidden />}
        {task.title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        aria-label={`«${task.title}» löschen`}
        className="opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Trash2 className="size-4" />
      </Button>
    </motion.li>
  )
}
