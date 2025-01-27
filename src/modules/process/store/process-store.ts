
import { IS_CAN_EDIT, CURRENT_STEP, IS_READ_ONLY } from '~/modules/process/store/mutation-types'

export const processStore ={
  state: {
    iCanEdit:false,
    isReadOnly:false,
    currentStep:null,
  },
  mutations: {
    [IS_CAN_EDIT]: (state, value) => {
      state.iCanEdit = value
    },
    [IS_READ_ONLY]: (state, value) => {
      state.isReadOnly = value
    },
    [CURRENT_STEP]: (state, v) => {
      state.currentStep = v
    },
  }
}
export default processStore
