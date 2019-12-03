import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { Persistence } from './services/persistence'
import Utils from './services/utils'
import axios from 'axios'
import { Config } from './services/config'
import { ConnectionData, Connections } from './services/connection'
import JsonCSV from 'vue-json-csv'
let currentNode = localStorage.getItem('currentNode')

Vue.config.productionTip = false
Vue.prototype.$localStorage = new Persistence(localStorage)
Vue.prototype.$sessionStorage = new Persistence(sessionStorage)
Vue.prototype.$utils = Utils
Vue.component('downloadCsv', JsonCSV)
const configIntegration = async (currentNodeExist = false) => {
  try {
    let configInfo = await axios.get('../config/config.json')
    Vue.prototype.$config = new Config(configInfo.data)
    let protocol = window.location.protocol.replace(':', '')
    if (currentNodeExist === false) {
      localStorage.setItem('currentNode', configInfo.data.Nodes[0])
      let nodeUrl = ConnectionData.getBuildUrl(configInfo.data.Nodes[0], protocol)
      localStorage.setItem('currentBuildNode', nodeUrl)
      Vue.prototype.$provider = new Connections(nodeUrl)
      console.log(new Connections(nodeUrl))
    } else {
      let nodeUrl = ConnectionData.getBuildUrl(currentNode, protocol)
      localStorage.setItem('currentBuildNode', nodeUrl)
      Vue.prototype.$provider = new Connections(nodeUrl)
      console.log(new Connections(nodeUrl))
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
