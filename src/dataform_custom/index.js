import { defineAsyncComponent } from 'vue'
export const customElementList = [
  {
    element: 'datetimeAutoFill',
    component: defineAsyncComponent(() => import('./datetimeAutoFill.vue')),
  },
  {
    element: 'inputWithIcon',
    component: defineAsyncComponent(() => import('./inputWithIcon.vue')),
  },
]
