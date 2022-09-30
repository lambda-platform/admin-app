import { defineAsyncComponent } from 'vue'
export const customElementList = [

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
