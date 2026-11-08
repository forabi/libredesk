// CLDR plural categories, in the order translators list the forms.
const CATEGORY_ORDER = ['zero', 'one', 'two', 'few', 'many', 'other']

// vue-i18n's built-in choice: 2 forms = singular | plural, 3 = zero | one | many.
const defaultRule = (choice, choicesLength) => {
  if (choicesLength === 2) return choice ? (choice > 1 ? 1 : 0) : 1
  return choice ? Math.min(choice, 2) : 0
}

/**
 * A vue-i18n plural rule backed by CLDR (Intl.PluralRules).
 *
 * It applies only when a message lists exactly one form per CLDR category of
 * its language and the language has more than three of them, e.g. Arabic's
 * six (zero | one | two | few | many | other) or Russian's four. Every other
 * message keeps vue-i18n's built-in behaviour, so existing translations,
 * including the three-form "zero | one | many" ones, are unchanged.
 */
export function cldrPluralRule (locale) {
  let rules
  let categories
  try {
    rules = new Intl.PluralRules(locale)
    const supported = rules.resolvedOptions().pluralCategories
    categories = CATEGORY_ORDER.filter((c) => supported.includes(c))
  } catch {
    return null
  }
  return (choice, choicesLength) => {
    const n = Math.abs(choice)
    if (categories.length > 3 && choicesLength === categories.length) {
      return categories.indexOf(rules.select(n))
    }
    return defaultRule(n, choicesLength)
  }
}

/** Adds the CLDR rule for `locale` to a vue-i18n `pluralRules` object. */
export function addPluralRule (pluralRules, locale) {
  if (!pluralRules || !locale || pluralRules[locale]) return pluralRules
  const rule = cldrPluralRule(locale)
  if (rule) pluralRules[locale] = rule
  return pluralRules
}
