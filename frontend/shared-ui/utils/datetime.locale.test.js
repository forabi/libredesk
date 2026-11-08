import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  setAppLocale,
  formatDate,
  formatFullTimestamp,
  getRelativeTime,
  formatDuration,
  formatTimeAgo,
  formatNumber,
  toIntlLocale
} from './datetime.js'

const d = new Date(2026, 10, 8, 14, 5)

afterEach(() => {
  setAppLocale('en-US')
  vi.useRealTimers()
})

describe('date formatting follows the app language', () => {
  it('keeps the English output unchanged', () => {
    expect(formatFullTimestamp(d)).toBe('8 Nov 2026, 02:05 PM')
    expect(getRelativeTime(new Date(2026, 10, 5, 14, 5), d)).toBe('3d')
    expect(formatDuration(3725)).toBe('1h 2m 5s')
  })

  it('uses Arabic (Syria) month names with Latin digits', () => {
    setAppLocale('ar-SY')
    expect(formatDate(d, 'PPP', { dateStyle: 'long' })).toBe('8 تشرين الثاني 2026')
    expect(formatFullTimestamp(d)).toContain('تشرين الثاني')
    expect(formatFullTimestamp(d)).toMatch(/2:05/)
  })

  it('localises relative times, durations and numbers', () => {
    setAppLocale('ar-SY')
    expect(getRelativeTime(new Date(2026, 10, 5, 14, 5), d)).toBe('3 أيام')
    expect(getRelativeTime(d, d)).toBe('الآن')
    expect(formatDuration(42)).toBe('42 ث')
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('formats "time ago" in the app language', () => {
    vi.useFakeTimers()
    vi.setSystemTime(d)
    setAppLocale('ar-SY')
    expect(formatTimeAgo(new Date(2026, 10, 8, 11, 5))).toBe('قبل 3 ساعات')
    setAppLocale('fr-FR')
    expect(formatTimeAgo(new Date(2026, 10, 8, 11, 5))).toBe('il y a 3 heures')
  })

  it('keeps an explicit numbering system', () => {
    expect(toIntlLocale('ar-SY')).toBe('ar-SY-u-nu-latn')
    expect(toIntlLocale('ar-SY-u-nu-arab')).toBe('ar-SY-u-nu-arab')
  })
})
