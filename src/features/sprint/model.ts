export type Sprint = {
  goal: string
  endDate: string // YYYY-MM-DD
}

const DAY = 24 * 60 * 60 * 1000

export function daysLeftLabel(endDate: string, today: Date = new Date()): string {
  const [y, m, d] = endDate.split('-').map(Number)
  const end = Date.UTC(y, m - 1, d)
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const days = Math.round((end - start) / DAY)
  if (days < 0) return 'Sprint vorbei'
  if (days === 0) return 'endet heute'
  if (days === 1) return 'noch 1 Tag'
  return `noch ${days} Tage`
}
