import { useRef, type CSSProperties, type HTMLAttributes } from 'react'
import { motion } from 'motion/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { GripVertical, Repeat, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { celebrate } from '@/lib/celebrate'
import { readConfettiColors } from '@/lib/theme'
import type { Task } from '../model'

export type SortableBinding = {
  attachNode: (el: HTMLElement | null) => void
  attachHandle: (el: HTMLElement | null) => void
  style: CSSProperties
  listeners: object | undefined
  handleProps: HTMLAttributes<HTMLElement>
  isDragging: boolean
}

type TaskCardProps = {
  task: Task
  onToggle: (id: string) => void
  onRemove: (task: Task) => void
  onRestore: (task: Task) => void
  sortable?: SortableBinding
  onCycleRepeat?: (id: string) => void
}

const REPEAT_LABEL = { daily: 'täglich', weekly: 'wöchentlich' } as const

export default function TaskCard({
  task,
  onToggle,
  onRemove,
  onRestore,
  sortable,
  onCycleRepeat,
}: TaskCardProps) {
  const checkboxRef = useRef<HTMLButtonElement>(null)
  const look = document.documentElement.dataset.look
  const isNeon = look === 'neon'
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const done = task.status === 'done'
  const isSortable = sortable !== undefined
  const attachNode = sortable?.attachNode
  const attachHandle = sortable?.attachHandle
  const dragStyle = sortable?.style
  const dragListeners = sortable?.listeners
  const handleProps = sortable?.handleProps
  const isDragging = sortable?.isDragging ?? false

  const handleToggle = () => {
    if (!done && !reduce && !isNeon) {
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
      ref={attachNode}
      {...(isSortable
        ? {
            style: dragStyle,
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            ...dragListeners,
          }
        : {
            layout: true,
            initial: { opacity: 0, y: -12, scale: 0.96 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } },
            transition: { type: 'spring', stiffness: 500, damping: 35 },
          })}
      className={cn(
        'group glass flex min-w-0 items-start gap-3 rounded-xl border p-4 shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop focus-within:glow',
        isDragging && 'opacity-50',
      )}
    >
      {isSortable && (
        <Button
          ref={attachHandle}
          variant="ghost"
          size="icon"
          {...handleProps}
          aria-label={`«${task.title}» verschieben`}
          className="-ml-2 cursor-grab touch-none opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
        >
          <GripVertical className="size-4" />
        </Button>
      )}
      <Checkbox
        ref={checkboxRef}
        checked={done}
        onCheckedChange={handleToggle}
        className="mt-0.5 size-6 rounded-md transition-look data-[state=checked]:animate-pop data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
        aria-label={`«${task.title}» erledigt`}
      />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <span
          className={`relative w-full min-w-0 break-words [overflow-wrap:anywhere] text-base leading-relaxed ${
            done ? 'text-muted-foreground' : ''
          }`}
        >
          <motion.span
            aria-hidden
            className="absolute left-0 top-1/2 h-0.5 w-full origin-left bg-current"
            animate={{ scaleX: done ? 1 : 0 }}
            transition={{
              duration: isNeon ? 0.9 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          {isNeon && done && !reduce && <span className="bullet-time" aria-hidden />}
          {task.title}
        </span>
        {task.repeat && (
          <Badge variant="secondary" className="font-mono">
            {REPEAT_LABEL[task.repeat]}
          </Badge>
        )}
      </div>
      <div className="flex shrink-0 flex-col">
        {onCycleRepeat && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCycleRepeat(task.id)}
            aria-label={`«${task.title}» wiederholen: ${task.repeat ? REPEAT_LABEL[task.repeat] : 'aus'}`}
            className={cn(
              'transition-look group-hover:opacity-100 focus-visible:opacity-100',
              task.repeat ? 'text-success' : 'opacity-60',
            )}
          >
            <Repeat className="size-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          aria-label={`«${task.title}» löschen`}
          className="opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </motion.li>
  )
}
