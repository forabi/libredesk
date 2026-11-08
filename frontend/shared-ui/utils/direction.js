// Right-to-left base languages. Mirrors rtlLanguages in cmd/helpcenter.go.
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi', 'dv', 'ckb']

/** Text direction ('rtl' | 'ltr') for a locale tag such as "ar", "ar-SA" or "fa_IR". */
export function localeDir (locale) {
  const base = String(locale || '').trim().toLowerCase().split(/[-_]/)[0]
  return RTL_LANGUAGES.includes(base) ? 'rtl' : 'ltr'
}

/**
 * Sets lang and dir on <html>. Everything that portals to document.body
 * (menus, dialogs, toasts) inherits the direction from there.
 */
export function applyDocumentLocale (locale) {
  const el = document.documentElement
  const dir = localeDir(locale)
  if (locale) el.lang = locale
  el.dir = dir
  return dir
}
