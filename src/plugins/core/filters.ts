import { App } from "vue";
import {getNumber, getMoney} from '~/utils/number'
import {getDate} from '~/utils/date'

/**
 * Initialize Global Filters
 * @param app vue instance
 */
export function initFilters(app: App<Element>) {

  app.config.globalProperties.$filters = {
    currencyMNT(value) {
      return getMoney(value)
    },
    number(value) {
      return getNumber(value)
    },
    date(value) {
      return getDate(value)
    },
  }
}
