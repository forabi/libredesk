/**
 * The built-in conversation statuses and priorities are seeded by name
 * (schema.sql) and cannot be renamed, so their names are shown translated.
 * Custom statuses are shown as entered. Only display goes through these
 * helpers: the API still takes and returns the names themselves.
 */
const STATUS_KEYS = {
  Open: 'globals.terms.open',
  Snoozed: 'globals.terms.snoozed',
  Resolved: 'globals.terms.resolved',
  Closed: 'globals.terms.closed'
}

const PRIORITY_KEYS = {
  Low: 'globals.terms.low',
  Medium: 'globals.terms.medium',
  High: 'globals.terms.high'
}

export const statusLabel = (t, name) => (STATUS_KEYS[name] ? t(STATUS_KEYS[name]) : (name ?? ''))

export const priorityLabel = (t, name) => (PRIORITY_KEYS[name] ? t(PRIORITY_KEYS[name]) : (name ?? ''))

/**
 * Options ({ label: name, value }) with translated labels, for menus and
 * filters. `name` keeps the original for anything keyed on it (priority icons).
 */
export const withStatusLabels = (t, options) =>
  options.map((o) => ({ ...o, name: o.name ?? o.label, label: statusLabel(t, o.label) }))

export const withPriorityLabels = (t, options) =>
  options.map((o) => ({ ...o, name: o.name ?? o.label, label: priorityLabel(t, o.label) }))
