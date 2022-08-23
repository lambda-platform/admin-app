import ls from '~/utils/Storage'
import { setupI18n } from '@lambda-platform/lambda-vue/src/locale'

export const locale = ls.get('lang') || 'mn_MN';

export const i18n = setupI18n(locale)
