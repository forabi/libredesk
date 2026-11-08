import { describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import { addPluralRule } from './plural.js'

const i18nFor = (locale, messages) =>
  createI18n({ legacy: false, locale, messages: { [locale]: messages }, pluralRules: addPluralRule({}, locale) }).global

describe('CLDR plural rules', () => {
  const ar = i18nFor('ar-SY', {
    articles: 'لا توجد مقالات | مقالة واحدة | مقالتان | {count} مقالات | {count} مقالة | {count} مقالة',
    label: 'مقالة | مقالات',
    selected: 'لا شيء | واحد | {count}'
  })

  it('picks every Arabic form', () => {
    expect([0, 1, 2, 3, 10, 11, 99, 100, 102].map((n) => ar.t('articles', n))).toEqual([
      'لا توجد مقالات', 'مقالة واحدة', 'مقالتان', '3 مقالات', '10 مقالات', '11 مقالة', '99 مقالة', '100 مقالة', '102 مقالة'
    ])
  })

  it('keeps two-form labels and three-form zero|one|many messages as before', () => {
    expect(ar.t('label', 1)).toBe('مقالة')
    expect(ar.t('label', 2)).toBe('مقالات')
    expect(ar.t('selected', 0)).toBe('لا شيء')
    expect(ar.t('selected', 5)).toBe('5')
  })

  it('leaves English and French unchanged', () => {
    const en = i18nFor('en-US', { a: '{count} article | {count} articles', s: 'None | one | {count}' })
    expect([0, 1, 2].map((n) => en.t('a', n))).toEqual(['0 articles', '1 article', '2 articles'])
    expect([0, 1, 7].map((n) => en.t('s', n))).toEqual(['None', 'one', '7'])
    const fr = i18nFor('fr-FR', { s: 'Aucun | un | {count}' })
    expect([0, 1, 7].map((n) => fr.t('s', n))).toEqual(['Aucun', 'un', '7'])
  })
})
