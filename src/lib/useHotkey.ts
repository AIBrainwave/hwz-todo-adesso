import { useEffect } from 'react'

/**
 * Ruft handler bei Tastendruck auf, ausser der Fokus liegt schon in einem
 * Eingabefeld (input, textarea, contenteditable) – so stört «N» das Tippen nicht.
 */
export function useHotkey(handler: (key: string) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      handler(e.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handler])
}
