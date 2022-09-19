import { message } from 'ant-design-vue'
import axios from 'axios'
import { base_url } from '../consts/const'

export const idGenerator = (type) => {
  let randomId = Math.random()
    .toString(36)
    .substr(3, 9)
  return `${type}-${randomId}`
}

export const evalstr = (str) => {
  if (typeof str == 'undefined' || str == null || str == '') {
    return true
  }
  return eval(str.toString())
}

export const isValid = (val) => {
  if (typeof val == 'undefined' || val == null || val == '') {
    return false
  }
  return true
}
export const ArcGISServer = 'https://dms.ulaanbaatar.mn/arcgis/rest/services/Manaikhoroo_II'

export const getToken = async () => {
  try {
    let response = await axios.get(base_url + '/arcgis/token')

    if (response.data.token) {
      return response.data.token.token
    } else {
      showArcGISerror()
    }
  } catch (err) {

    showArcGISerror()
  }
}

export const showArcGISerror = () => {
  message.error('ArcGIS server тэй холбогдож чадсангүй !!!')
}

export const getLayers = async  ()=> {
  let token = await getToken();
  let response = await axios.get(`${ArcGISServer}?f=json&token=${token}`, {
    transformRequest: (data, headers) => {

      delete headers.common['X-CSRF-TOKEN']
      delete headers['X-CSRF-TOKEN']
      delete headers['Authorization']
      delete headers.common['X-Requested-With']
      delete headers.common['Authorization']
    }
  })

  let folders = []

  if (response.data.folders.length >= 1) {
    response.data.folders.map(async (folder, index) => {

      let folderData = {
        value: `${ArcGISServer}${folder}`,
        label: folder,

      }
      let children = await readArcFolder(`${ArcGISServer}/${folder}`, token)

      if (children.length >= 1) {
        folderData['children'] = children
      }
      folders.push(folderData)
    })
  } else {

    let folderData = {
      value: `${ArcGISServer}`,
      label: 'root',
    }
    // let isLast = response.data.folders.length-1 == index ? true: false;
    let children = await readArcFolder(`${ArcGISServer}`, token)

    if (children.length >= 1) {
      folderData['children'] = children
    }

    folders.push(folderData)
  }

  return {
    layers:folders,
    token:token
  }
}
export const readArcFolder = async (url, token) =>{

  let response = await axios.get(`${url}?f=pjson&token=${token}`, {
    transformRequest: (data, headers) => {
      delete headers.common['X-CSRF-TOKEN']
      delete headers['X-CSRF-TOKEN']
      delete headers['Authorization']
      delete headers.common['X-Requested-With']
      delete headers.common['Authorization']

    }
  })

  let folders = []

  if (response.data.services) {
    for (const service of response.data.services) {
      const index_c = response.data.services.indexOf(service)

      let name = service.name.split('/')
      if (service.type === 'FeatureServer') {

        let children = await readArcFeature(`${url}/${name[1]}/${service.type}`, token)
        let folderData = {
          value: `${url}/${name[1]}/${service.type}`,
          label: `FeatureService - ${name[1]}`,

        }

        if (children.length >= 1) {
          folderData['children'] = children
        }
        folders.push(folderData)
      } else {
        folders.push({
          value: `${url}/${name[1]}/${service.type}`,
          label: `${service.type} - ${name[1]}`,
        })
      }
    }
  }

  return folders

}
export const readArcFeature = async (url, token)=> {

  let response = await axios.get(`${url}?f=pjson&token=${token}`, {
    transformRequest: (data, headers) => {

      delete headers.common['X-CSRF-TOKEN']
      delete headers['X-CSRF-TOKEN']
      delete headers['Authorization']
      delete headers.common['X-Requested-With']
      delete headers.common['Authorization']
    }
  })

  let features = []

  response.data.layers.map((layer, lindex) => {
    features.push({
      value: `${url}/${lindex}`,
      label: layer.name,
    })
  })

  return features
}

export const LayerData = async (url, token)=> {

  return await axios.get(`${url}?f=pjson&token=${token}`, {
    transformRequest: (data, headers) => {

      delete headers.common['X-CSRF-TOKEN']
      delete headers['X-CSRF-TOKEN']
      delete headers['Authorization']
      delete headers.common['X-Requested-With']
      delete headers.common['Authorization']
    }
  });
}
