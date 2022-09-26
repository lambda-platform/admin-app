import axios, { AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import { ACCESS_TOKEN, USER_INFO } from '~/store/mutation-types'

import ls from '~/utils/Storage'
import { useRouter } from 'vue-router'
import { globalLoading } from '~/store/reactiveState'

const ContentType = {
  urlencoded: 'application/x-www-form-urlencoded;charset=UTF-8',
  json: 'application/json',
  formData: 'multipart/form-data'
}


const baseService = axios.create({
  // baseURL,
  timeout: 60000,
  responseType: 'json',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// request interceptor
baseService.interceptors.request.use(
  config => {
    globalLoading.value = true
    const token = ls.get(ACCESS_TOKEN)

    if (token) {
      config.headers['Authorization'] = "Bearer "+token
    }

    config.headers['Content-Type'] = ContentType[config.data instanceof FormData ? 'formData' : 'json']
    return config
  },
  error => {
    globalLoading.value = false
    return Promise.reject(error)
  }
)

baseService.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    globalLoading.value = false
    if (res.status === 200) {
      return res.data
    } else if (res.status === 401 || res.status === 403) {
      message.error('!')
      return false
    } else if (res.status === 500) {
      message.error('!')
      return false
    } else if (res.status === 406) {
      message.error('!')
      const router = useRouter()
      router.push({ name: 'login' })
      return false
    } else {
      if (window.localStorage.getItem('lang') === 'en') {
        message.error(res.data.enMsg)
      } else {
        message.error(res.data.zhMsg)
      }
      return false
    }
    // return res
  },
  error => {
    console.log(error)
    globalLoading.value = false
    const msg = error.message
    const result = error.response
    if (result) {
      const { data } = result
      message.error(data.msg || data.enMsg || data.message)
    } else if (msg) {
      if (msg === 'Network Error') {
        message.error('')
      } else {
        message.error(msg)
      }
    } else if (error.__CANCEL__) {
      // ignore message error
    } else {
      message.error('')
    }
    return false
  }
)

export default baseService
