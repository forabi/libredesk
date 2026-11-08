import { describe, it, expect } from 'vitest'
import { statusLabel, priorityLabel, withStatusLabels, withPriorityLabels } from './defaultTerms.js'

const t = (key) => ({ 'globals.terms.open': 'مفتوحة', 'globals.terms.low': 'منخفضة' })[key] ?? key

describe('built-in status and priority names', () => {
  it('translates the seeded names and leaves custom ones alone', () => {
    expect(statusLabel(t, 'Open')).toBe('مفتوحة')
    expect(statusLabel(t, 'Waiting on lab')).toBe('Waiting on lab')
    expect(statusLabel(t, undefined)).toBe('')
    expect(priorityLabel(t, 'Low')).toBe('منخفضة')
  })

  it('keeps the original name and value on translated options', () => {
    expect(withStatusLabels(t, [{ label: 'Open', value: 1 }])).toEqual([{ label: 'مفتوحة', name: 'Open', value: 1 }])
    expect(withPriorityLabels(t, [{ label: 'Low', value: 3 }])).toEqual([{ label: 'منخفضة', name: 'Low', value: 3 }])
  })
})
