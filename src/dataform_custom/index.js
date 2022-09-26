import { defineAsyncComponent } from 'vue'
export const elementList = [
  {
    element: 'arcGISLayer',
    component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-text" */'./arcGISLayer.vue')),
  },
  {
    element: 'arcGISLayerAttributeConnector',
    component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Select" */'./arcGISLayerAttributeConnector.vue')),
  },
  {
    element: 'arcGISLayerAttributeConnectorLayer',
    component: defineAsyncComponent(() => import(/* webpackChunkName: "form-field-Select" */'./arcGISLayerAttributeConnectorLayer.vue')),
  }
]
export const renderCustom = (type, notFoundElement)=>{
  if (type !== null && typeof type !== 'undefined') {
    const elIndex = elementList.findIndex(el => el.element === type)

    if (elIndex >= 0) {
      return elementList[elIndex].component
    }
  } else {
    return notFoundElement
  }
}
