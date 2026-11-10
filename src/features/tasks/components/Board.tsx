import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import { celebrate } from '@/lib/celebrate'
import { readConfettiColors } from '@/lib/theme'
import { cn } from '@/lib/utils'
import TaskCard from './TaskCard'
import type { Task, TaskStatus } from '../model'

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'Offen' },
  { status: 'doing', title: 'In Arbeit' },
  { status: 'done', title: 'Erledigt' },
]

type BoardProps = {
  tasks: Task[]
  onMove: (id: string, toStatus: TaskStatus, toIndex: number) => void
  onToggle: (id: string) => void
  onRemove: (task: Task) => void
  onRestore: (task: Task) => void
}

type CardHandlers = Pick<BoardProps, 'onToggle' | 'onRemove' | 'onRestore'>

function isColumn(id: UniqueIdentifier): id is TaskStatus {
  return COLUMNS.some((c) => c.status === id)
}

function SortableTask({ task, ...handlers }: { task: Task } & CardHandlers) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })
  return (
    <TaskCard
      task={task}
      {...handlers}
      sortable={{
        attachNode: setNodeRef,
        attachHandle: setActivatorNodeRef,
        style: { transform: CSS.Transform.toString(transform), transition },
        listeners,
        handleProps: attributes,
        isDragging,
      }}
    />
  )
}

function Column({
  status,
  title,
  tasks,
  highlight,
  ...handlers
}: { status: TaskStatus; title: string; tasks: Task[]; highlight: boolean } & CardHandlers) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const headingId = `column-${status}`
  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={cn(
        'glass flex min-h-64 w-[85vw] shrink-0 snap-center flex-col gap-3 rounded-2xl border p-3 transition-look md:w-auto',
        (highlight || isOver) && 'glow scale-[1.01]',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id={headingId} className="font-heading text-lg">
          {title}
        </h2>
        <Badge variant="secondary" className="font-mono">
          {tasks.length}
        </Badge>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} {...handlers} />
          ))}
        </ul>
      </SortableContext>
      {tasks.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-ring/60 p-6 text-center text-muted-foreground">
          Hierher ziehen
        </div>
      )}
    </section>
  )
}

export default function Board({ tasks, onMove, ...handlers }: BoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null)

  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status)
  const find = (id: UniqueIdentifier) => tasks.find((t) => t.id === id)
  const statusOf = (id: UniqueIdentifier): TaskStatus | undefined => (isColumn(id) ? id : find(id)?.status)
  const columnTitle = (id: UniqueIdentifier) => COLUMNS.find((c) => c.status === statusOf(id))?.title ?? ''
  const titleOf = (id: UniqueIdentifier) => find(id)?.title ?? ''
  const active = activeId ? find(activeId) : undefined

  const announcements: Announcements = {
    onDragStart: ({ active }) => `«${titleOf(active.id)}» aufgenommen.`,
    onDragOver: ({ active, over }) =>
      over
        ? `«${titleOf(active.id)}» ist über der Spalte ${columnTitle(over.id)}.`
        : `«${titleOf(active.id)}» ist über keiner Spalte.`,
    onDragEnd: ({ active, over }) =>
      over
        ? `«${titleOf(active.id)}» abgelegt in der Spalte ${columnTitle(over.id)}.`
        : `«${titleOf(active.id)}» abgelegt.`,
    onDragCancel: ({ active }) => `Ziehen abgebrochen. «${titleOf(active.id)}» bleibt an seinem Platz.`,
  }

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id))

  const handleDragOver = ({ over }: DragOverEvent) => setOverStatus(over ? (statusOf(over.id) ?? null) : null)

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    setOverStatus(null)
    const task = find(active.id)
    if (!over || !task) return
    const toStatus = statusOf(over.id)
    if (!toStatus) return
    const column = byStatus(toStatus)
    const toIndex = isColumn(over.id) ? column.length : column.findIndex((t) => t.id === over.id)
    if (task.status === toStatus && column.findIndex((t) => t.id === task.id) === toIndex) return
    onMove(task.id, toStatus, toIndex)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isNeon = document.documentElement.dataset.look === 'neon'
    if (toStatus === 'done' && task.status !== 'done' && !reduce && !isNeon) {
      const rect = over.rect
      celebrate(readConfettiColors(), {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable:
            'Leertaste greift die Karte. Pfeiltasten bewegen sie, Leertaste legt sie ab, Esc bricht ab.',
        },
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveId(null)
        setOverStatus(null)
      }}
    >
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible">
        {COLUMNS.map((c) => (
          <Column
            key={c.status}
            status={c.status}
            title={c.title}
            tasks={byStatus(c.status)}
            highlight={overStatus === c.status}
            {...handlers}
          />
        ))}
      </div>
      <DragOverlay>
        {active ? (
          <div>
            <div className="glass rotate-2 break-words [overflow-wrap:anywhere] rounded-xl border p-4 shadow-pop">
              {active.title}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
