import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notification: {
      active: false
    },
    accounts: null,
    txStatusData: null,
    superloader: {
      active: false,
      text: null
    }
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
    },

    UPDATE_STATUS_TX (state, data) {
      state.txStatusData = data
      console.log('state', state.txStatusData)
      console.log('data', data)
      if (data !== null && data.length === 0) {
        data = null
      }
      state.txStatusData = data
    },

    CHANGE_LOADER_STATE (state, data) {
      state.superloader = data
    }
  },

  actions: {
    newNotification ({ commit }, data) {
      commit('NOTIFICATION', data)
    },

    updateAccounts ({ commit }, data) {
      commit('UPDATE_ACCOUNTS', data)
    },

    statusTx ({ commit }, data) {
      commit('UPDATE_STATUS_TX', data)
    },

    changeLoaderState ({ commit }, data) {
      commit('CHANGE_LOADER_STATE', data)
    }
  },

  getters: {
    getMyAccounts: state => {
      return state.accounts
    },
    getStatusTx: state => {
      return state.txStatusData
    }
  },

  modules: {
  }
})
