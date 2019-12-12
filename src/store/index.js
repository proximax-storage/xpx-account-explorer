import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notification: {
      active: false
    },
    accounts: null
  },

  mutations: {
    NOTIFICATION (state, data) {
      state.notification = data
      setTimeout(() => {
        let tmpObj = { type: '', active: false, title: '', message: '' }
        state.notification = tmpObj
      }, 2000)
    },

    UPDATE_ACCOUNTS (state, data) {
      state.accounts = null

      if (data !== null && data.length === 0) {
        data = null
      }

      state.accounts = data
      console.log(state.accounts)
    }
  },

  actions: {
    newNotification ({ commit }, data) {
      commit('NOTIFICATION', data)
    },

    updateAccounts ({ commit }, data) {
      commit('UPDATE_ACCOUNTS', data)
    }
  },

  getters: {
    getMyAccounts: state => {
      return state.accounts
    }
  },

  modules: {
  }
})
