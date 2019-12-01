import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notification: {
      active: false
    }
  },
  mutations: {
    NOTIFICATION (state, data) {
      state.notification = data
      setTimeout(() => {
        let tmpObj = { type: '', active: false, title: '', message: '' }
        state.notification = tmpObj
      }, 2000)
    }
  },
  actions: {
    newNotification ({ commit }, data) {
      commit('NOTIFICATION', data)
    }
  },
  modules: {
  }
})
