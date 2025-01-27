import callForm from  './callForm.vue'
import coloredCell from  './coloredCell.vue'
import popup from  './popup.vue'
export const gridCustomElementList = [
  {
    element: 'coloredCell',
    component: import('./coloredCell.vue'),
  },
  {
    element: 'popup',
    component: import('./popup.vue'),
  },
  {
    element: 'callForm',
    component: import('./callForm.vue'),
  },
  {
    element: 'process_status',
    component: import('./process_status.vue'),
  },
]
