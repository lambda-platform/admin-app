import baseService from '~/utils/http/axios'
import { base_url } from '~/consts/const'

export const userLogin = data => {
  const api = base_url + `/auth/login`
  return baseService.post(api, data)
}

export const userLogout = () => {
  const api = base_url + `/auth/logout`
  return baseService.post(api, {})
}

export const getRoleData = () => {
  const api = base_url + `/admin/role/data`
  return baseService.get(api, {})
}

export const getLambdaConfig = () => {
  const api = base_url + `/lambda-config`
  return baseService.get(api, {})
}
