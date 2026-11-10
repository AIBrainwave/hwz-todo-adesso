import { useEffect, useRef } from 'react'

/**
 * Canvas mit Zeichenregen für den Look Neon (Matrix).
 * Der CSS-Selektor in src/index.css ([data-look='neon'] .matrix-rain)
 * zeigt es nur in diesem Look. Farben kommen aus den CSS-Variablen
 * --rain (Spur) und --rain-head (Kopf). Bei reduces Bewegung steht er still.
 */
export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let running = true
    const STEP_MS = 50
    let lastStep = 0

    const style = getComputedStyle(document.documentElement)
    const head = style.getPropertyValue('--rain-head').trim() || '#ccffd5'

    const fontSize = 16
    let columns = 0
    const drops: number[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      columns = Math.ceil(canvas.width / fontSize)
      drops.length = 0
      for (let i = 0; i < columns; i++) drops.push(Math.floor((Math.random() * canvas.height) / fontSize))
    }
    resize()
    window.addEventListener('resize', resize)

    if (reduce) {
      // Ohne Bewegung: ein ruhiges, statisches Feld ohne im Zeitverlauf animierte Zeichen.
      running = false
    }

    const draw = (time: number) => {
      if (!running) return
      if (time - lastStep >= STEP_MS) {
        lastStep = time
        ctx.fillStyle = 'rgba(2, 10, 4, 0.06)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = `${fontSize}px monospace`
        for (let i = 0; i < columns; i++) {
          const char = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
          const y = drops[i] * fontSize
          ctx.fillStyle = head
          ctx.fillText(char, i * fontSize, y)
          if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
          drops[i]++
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw(lastStep)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={ref} className="matrix-rain" aria-hidden="true" />
}
