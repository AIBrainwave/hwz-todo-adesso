import confetti from 'canvas-confetti'

export function celebrate(colors: string[], origin: { x: number; y: number }) {
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    scalar: 0.8,
    ticks: 120,
    colors,
    origin,
  })
}
