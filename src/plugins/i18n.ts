import { createI18n } from 'vue-i18n'
import ko from '@/locales/ko'
import en from '@/locales/en'

const LOCALE_STORAGE_KEY = 'locale'

// Get saved locale or default to 'ko'
const getSavedLocale = (): string => {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY) || 'ko'
  } catch {
    return 'ko'
  }
}

// Save locale to localStorage
export const saveLocale = (locale: string) => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch (error) {
    console.error('Failed to save locale:', error)
  }
}

const i18n = createI18n({
  legacy: false, // Composition API mode
  locale: getSavedLocale(),
  fallbackLocale: 'ko',
  messages: {
    ko,
    en,
  },
  globalInjection: true,
})

export default i18n
