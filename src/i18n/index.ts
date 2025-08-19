import {createI18n} from 'vue-i18n'
// carica i messaggi
import en from '@/i18n/locales/en.json'
import it from '@/i18n/locales/it.json'

// lingue supportate
export const SUPPORT_LOCALES = ['en', 'it'] as const
export type Locale = typeof SUPPORT_LOCALES[number]

// lingua di default
const DEFAULT_LOCALE: Locale = 'it'

const messages = { en, it }

export const i18n = createI18n({
    legacy: false,
    locale: DEFAULT_LOCALE,
    fallbackLocale: 'en',
    messages,
    warnHtmlMessage: false
})
