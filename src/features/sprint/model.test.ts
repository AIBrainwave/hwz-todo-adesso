import { describe, expect, it } from 'vitest'
import { daysLeftLabel } from './model'

const today = new Date(2026, 10, 10, 15, 30)

describe('daysLeftLabel', () => {
  it('counts the days until the end date', () => {
    expect(daysLeftLabel('2026-11-13', today)).toBe('noch 3 Tage')
  })

  it('uses the singular for one day', () => {
    expect(daysLeftLabel('2026-11-11', today)).toBe('noch 1 Tag')
  })

  it('says the sprint ends today', () => {
    expect(daysLeftLabel('2026-11-10', today)).toBe('endet heute')
  })

  it('says the sprint is over for a past date', () => {
    expect(daysLeftLabel('2026-11-01', today)).toBe('Sprint vorbei')
  })
})
