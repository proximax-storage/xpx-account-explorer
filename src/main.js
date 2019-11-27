import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { Persistence } from './services/persistence'
import Utils from './services/utils'
import axios from 'axios'
import { Config } from './services/config.js'
import ProximaxProvider from './services/proximaxProvider'

let currentNode = localStorage.getItem('currentNode')

Vue.config.productionTip = false
Vue.prototype.$localStorage = new Persistence(localStorage)
Vue.prototype.$sessionStorage = new Persistence(sessionStorage)
Vue.prototype.$utils = Utils

const configIntegration = async (currentNodeExist = false) => {
  try {
    let configInfo = await axios.get('../config/config.json')
    Vue.prototype.$config = new Config(configInfo.data)
    if (currentNodeExist === false) {
      localStorage.setItem('currentNode', configInfo.data.Nodes[0])
      Vue.prototype.$proxProvider = new ProximaxProvider(configInfo.data.Nodes[0])
    } else {
      Vue.prototype.$proxProvider = new ProximaxProvider(currentNode)
    }
  } catch (e) {
    console.error(e)
  }

  new Vue({
    router,
    store,
    render: function (h) { return h(App) }
  }).$mount('#app')
}

if (currentNode === null) {
  console.log('No Current Node')
  configIntegration(false)
} else {
  console.log('Current Node is', currentNode)
  configIntegration(true)
}
