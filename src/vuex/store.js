
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import system from './modules/system'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    system
  },
  strict: debug
})
