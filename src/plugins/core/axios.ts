import axios from 'axios'
import { base_url } from '~/consts/const'


export function initAxios() {


  axios.defaults.baseURL = base_url;
  axios.defaults.withCredentials = true;

  if(process.dev) {

    const token =  localStorage.getItem('token')
    if (token) {
      setToken(token)
    }
  }

}
export function setToken(token) {
  axios.defaults.headers.common['Authorization'] =  'Bearer ' + token;
  axios.defaults.headers.common['Content-Type'] =  'application/json';
  axios.defaults.withCredentials = true;
}
export default axios
