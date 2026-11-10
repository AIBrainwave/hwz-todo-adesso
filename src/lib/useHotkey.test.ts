import { renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useHotkey } from './useHotkey'

describe('useHotkey', () => {
  it('fires the handler on keydown', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    renderHook(() => useHotkey(handler))
    await user.keyboard('n')
    expect(handler).toHaveBeenCalledWith('n')
  })

  it('does not fire when focus is in an input', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    renderHook(() => useHotkey(handler))
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    await user.keyboard('n')
    expect(handler).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })
})
