import { format, formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns'

// App language, set once at startup (and on the widget's language switch).
let appLocale = 'en-US'

export const setAppLocale = (locale) => {
  appLocale = locale || 'en-US'
}

export const getAppLocale = () => appLocale

const isEnglish = () => /^en(?:[-_]|$)/i.test(appLocale)

/**
 * BCP 47 tag for Intl formatters. Digits stay Latin: counts elsewhere in the
 * UI are plain numbers, so dates and durations use the same digits.
 */
export const toIntlLocale = (locale) => {
  const tag = String(locale || 'en-US').replace('_', '-')
  return tag.includes('-u-') ? tag : `${tag}-u-nu-latn`
}

export const intlLocale = () => toIntlLocale(appLocale)

/**
 * Formats a date in the app language. English keeps the original date-fns
 * pattern, so its output is unchanged; other languages get Intl with the
 * equivalent options (their own month and day names, AM/PM and ordering).
 */
export function formatDate (date, pattern, options) {
  const d = date instanceof Date ? date : new Date(date)
  if (isEnglish()) return format(d, pattern)
  try {
    return new Intl.DateTimeFormat(intlLocale(), options).format(d)
  } catch {
    return format(d, pattern)
  }
}

/** "3 days ago" in the app language. */
export function formatTimeAgo (date) {
  const d = date instanceof Date ? date : new Date(date)
  if (isEnglish()) return formatDistanceToNow(d, { addSuffix: true })
  const rtf = new Intl.RelativeTimeFormat(intlLocale(), { numeric: 'auto' })
  const secs = Math.round((d.getTime() - Date.now()) / 1000)
  const abs = Math.abs(secs)
  if (abs < 60) return rtf.format(0, 'second')
  if (abs < 3600) return rtf.format(Math.round(secs / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(secs / 3600), 'hour')
  if (abs < 2592000) return rtf.format(Math.round(secs / 86400), 'day')
  if (abs < 31536000) return rtf.format(Math.round(secs / 2592000), 'month')
  return rtf.format(Math.round(secs / 31536000), 'year')
}

/** Number in the app language, e.g. formatNumber(1234) or a compact count. */
export const formatNumber = (value, options) =>
  new Intl.NumberFormat(intlLocale(), options).format(Number(value ?? 0))

// "3 days" / "5 min" in the app language (non-English only).
const unit = (value, u) =>
  new Intl.NumberFormat(intlLocale(), { style: 'unit', unit: u, unitDisplay: 'short' }).format(value)

export function getRelativeTime (timestamp, now = new Date()) {
  try {
    const mins = differenceInMinutes(now, timestamp)
    const hours = differenceInHours(now, timestamp)
    const days = differenceInDays(now, timestamp)
    const months = differenceInMonths(now, timestamp)
    const years = differenceInYears(now, timestamp)

    if (!isEnglish()) {
      if (mins === 0) return new Intl.RelativeTimeFormat(intlLocale(), { numeric: 'auto' }).format(0, 'second')
      if (mins < 60) return unit(mins, 'minute')
      if (hours < 24) return unit(hours, 'hour')
      if (days < 31) return unit(days, 'day')
      if (months < 12) return unit(months, 'month')
      return unit(years, 'year')
    }

    if (mins === 0) return 'now'
    if (mins < 60) return `${mins}m`
    if (hours < 24) return `${hours}h`
    if (days < 31) return `${days}d`
    if (months < 12) return `${months}mo`
    return `${years}y`
  } catch (error) {
    console.error('Error parsing time', error, 'timestamp', timestamp)
    return ''
  }
}

export const formatDuration = (seconds, showSeconds = true) => {
  const totalSeconds = Math.floor(seconds)
  if (!isEnglish()) {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    if (totalSeconds < 60) return unit(totalSeconds, 'second')
    const parts = [h && unit(h, 'hour'), unit(m, 'minute'), (showSeconds || totalSeconds < 3600) && unit(s, 'second')]
    return parts.filter(Boolean).join(' ')
  }
  if (totalSeconds < 60) return `${totalSeconds}s`
  if (totalSeconds < 3600) return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`
  const hours = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  return `${hours}h ${mins}m ${showSeconds ? `${secs}s` : ''}`
}

export const formatMessageTimestamp = (time) =>
  formatDate(time, 'd MMM, hh:mm a', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

export const formatFullTimestamp = (time) =>
  formatDate(time, 'd MMM yyyy, hh:mm a', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
