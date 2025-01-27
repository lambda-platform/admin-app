import {createI18n} from "vue-i18n";

import mn_MN from '@lambda-platform/lambda-vue/src/locale/locales/mn_MN.js'

import en_US from '@lambda-platform/lambda-vue/src/locale/locales/en_US.js'
import en from '~/modules/process/locales/en_US.js'
import mn from '~/modules/process/locales/mn_MN.js'

export const locale = localStorage.getItem("lang") || 'mn_MN';



const messages = {
  mn_MN:{...mn_MN, ...mn},
  en_US:{...en_US, ...en},
}
export function setI18nLanguage (i18n, locale) {

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {

    i18n.global.locale.value = locale
  }

}

export function setupI18n (locale) {

  if(!messages.hasOwnProperty(locale)){
    locale = "mn_MN"
  }
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: locale,
    messages
  })
  setI18nLanguage(i18n, locale)
  return i18n
}

export const i18n = setupI18n(locale)

