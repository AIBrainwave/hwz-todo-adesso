import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useHotkey } from '@/lib/useHotkey'

type TaskInputProps = {
  onAdd: (title: string) => void
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [shaking, setShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const title = value.trim()
    if (!title) {
      setShaking(true)
      return
    }
    onAdd(title)
    setValue('')
    inputRef.current?.focus()
  }

  useHotkey((key) => {
    if (key === 'n' || key === 'N') inputRef.current?.focus()
  })

  return (
    <form
      className={`glass flex items-center gap-2 rounded-2xl border p-2 shadow-card ${
        shaking ? 'animate-shake' : ''
      }`}
      onSubmit={handleSubmit}
      onAnimationEnd={() => setShaking(false)}
    >
      <span aria-hidden className="terminal-prompt hidden pl-3 font-mono text-lg font-bold">
        {'>'}
      </span>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setValue('')
            inputRef.current?.blur()
          }
        }}
        maxLength={200}
        placeholder="Was steht an?"
        aria-label="Neue Aufgabe"
        className="terminal-caret h-14 flex-1 border-0 bg-transparent px-4 text-lg shadow-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        size="icon"
        className="size-12 rounded-xl bg-primary text-primary-foreground transition-look hover:scale-105 active:scale-95"
        aria-label="Aufgabe hinzufügen"
      >
        <Plus className="size-6" />
      </Button>
    </form>
  )
}
