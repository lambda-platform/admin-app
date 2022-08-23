import numeral from 'numeral'

export function getNumber (value) {
  const value2 = numeral(value)
  return value2.format('0,0')
}

export function getMoney (value) {
  const value2 = numeral(value)
  return value2.format('0,0')+" ₮"
}
