import { App } from "vue";
import {getNumber, getMoney} from '~/utils/number'
import {getDate} from '~/utils/date'

/**
 * Initialize Global Filters
 * @param app vue instance
 */
export function initFilters(app: App<Element>) {

  app.config.globalProperties.$date = (value)=> {
    return getDate(value)
  }
  app.config.globalProperties.$currencyMNT = (value)=> {
    return getMoney(value)
  }
  app.config.globalProperties.$number = (value)=> {
    return getNumber(value)
  }


}
