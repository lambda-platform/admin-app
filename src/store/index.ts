import app from './modules/app'
import lambda from './modules/lambda'
import organization from './modules/organization'
import processStore from '~/modules/process/store/process-store'
import { createStore } from 'vuex';

const store = createStore({
  mutations: {},
  actions: {},
  modules: {
    app,
    lambda,
    processStore,
    organization
  },
});

export default store
