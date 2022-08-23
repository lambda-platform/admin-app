import app from './modules/app'
import lambda from './modules/lambda'
import { createStore } from 'vuex';

const store = createStore({
  mutations: {},
  actions: {},
  modules: {
    app,
    lambda
  },
});

export default store
