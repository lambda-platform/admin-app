import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import mn_MN from './locales/mn_MN.js'

const messages = {
    mn_MN,

}

export function setI18nLanguage (i18n, locale) {

    if (i18n.mode === 'legacy') {
        i18n.global.locale = locale
    } else {

        i18n.global.locale.value = locale
    }

}

export function setupI18n (locale) {
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: locale,
        messages
    })
    setI18nLanguage(i18n, locale)
    return i18n
}

//
export async function loadLocaleMessages (i18n, locale) {
    // load locale messages with dynamic import
    const messages = await import(`./locales/${locale}.js`)
    // set locale and locale message
    i18n.global.setLocaleMessage(locale, messages.default)

    return nextTick()
}
