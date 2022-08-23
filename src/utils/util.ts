import ls from '~/utils/Storage'
import { ACCESS_TOKEN, PERMISSIONS, USER_INFO, MENU_NAV, MENU, KRUDS, MENU_LIST } from '~/store/mutation-types'

export function clearUserInfo() {
  ls.remove(ACCESS_TOKEN)
  ls.remove(PERMISSIONS)
  ls.remove(MENU)
  ls.remove(KRUDS)
  ls.remove(USER_INFO)
  ls.remove(MENU_NAV)
  ls.remove(MENU_LIST)
}

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour
}

// aes encryption key
export const encryptKeys = {

  key: '1111',
  iv: '1',
};

export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}

export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}

export function scorePassword(pass) {
  let score = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters = {}
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
    variationCount += (variations[check] === true) ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return parseInt(score.toString())
}

export const firstLetterIsUpperCase = function (str) {
  var reg = /^[A-Z][A-z0-9]*$/;
  return reg.test(str);
};

export const separator = ';'

export const divisionStringToArray = (string, customSeparator) => {
  return string ? string.split(customSeparator || separator) : []
}

export const getWeek = (week: number, useZhou) => {
  let txt = ''
  switch (week) {
    case 1:
      txt = 'ДА'
      break
    case 2:
      txt = 'МЯ'
      break
    case 3:
      txt = 'ЛХ'
      break
    case 4:
      txt = 'ПҮ'
      break
    case 5:
      txt = 'БА'
      break
    case 6:
      txt = 'БЯ'
      break
    case 0:
      txt = 'НЯ'
      break
    default:
      return 'getWeekError'
  }
  return  txt
}

const sitUrl = 'xxxxx'
export const isDev = import.meta.env.DEV

