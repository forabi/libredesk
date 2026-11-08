// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { localeDir, applyDocumentLocale } from './direction.js'

describe('localeDir', () => {
  it.each(['ar', 'ar-SA', 'AR_eg', 'fa-IR', 'he', 'ur-PK', 'ckb'])('%s is rtl', (l) => {
    expect(localeDir(l)).toBe('rtl')
  })
  it.each(['en-US', 'fr-FR', 'arn', 'zh-CN', '', undefined, null])('%s is ltr', (l) => {
    expect(localeDir(l)).toBe('ltr')
  })
})

describe('applyDocumentLocale', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('dir')
    document.documentElement.removeAttribute('lang')
  })
  it('sets lang and dir on <html>', () => {
    expect(applyDocumentLocale('ar-SA')).toBe('rtl')
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar-SA')
    applyDocumentLocale('en-US')
    expect(document.documentElement.dir).toBe('ltr')
  })
})
