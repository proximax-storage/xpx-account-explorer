<template>
  <div class="Nodes">
    <module-header :name="moduleName"/>
    <node-info/>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="fold">
      <div class="box-grey mb-10 node-card" v-for="(item, index) in allNodes" :key="index">
        <div>{{ item }}</div>
        <div v-if="!(item === currentNode)">
          <input type="button" class="proximax-btn" value="Select" @click="changeNode(item)">
        </div>
        <div v-if="item === currentNode">
          <input type="button" class="proximax-btn-disabled" value="Select">
        </div>
      </div>
    </div>

    <div class="fold">
      <h1 class="title txt-left">Add Node</h1>
      <div class="box-grey mb-10">
        <input type="text" class="field" :placeholder="addNodeLabel" v-model="addNodeValue">
        <div class="button-panel">
          <div>
            <input type="button" value="Add" class="proximax-btn" @click="addNode">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import NodeInfo from '@/components/Global/app-node-info'
import AppFold from '@/components/Global/app-fold'
import axios from 'axios'

export default {
  name: 'Nodes',

  components: {
    ModuleHeader,
    NodeInfo,
    AppFold
  },

  data () {
    return {
      moduleName: 'Nodes',
      foldLabel: 'Available Nodes',
      addNodeLabel: 'http://mynode.io:3000 or https://mynode.io',
      nodeInfoVisible: false,
      nodes: this.$config.nodes,
      currentNode: this.$localStorage.get('currentNode'),
      addNodeValue: ''
    }
  },

  methods: {
    toggleNodeInfo () {
      this.nodeInfoVisible = !this.nodeInfoVisible
    },

    changeNode (node) {
      this.$localStorage.set('currentNode', node)
      window.location.reload()
    },

    async addNode () {
      if (this.addNodeValue !== '') {
        try {
          let validNode = await axios.get(`${this.addNodeValue}/node/info`)
          validNode = validNode.data
          let customNodes = this.$localStorage.get('customNodes')
          let allNodes = this.nodes.concat(customNodes)
          let resultNode = ''

          if (validNode && validNode.networkIdentifier === this.$config.network.number) {
            if (this.addNodeValue.search('http://') > -1) {
              resultNode = this.addNodeValue.replace('http://', '')
              resultNode = resultNode.split(':')
              resultNode = resultNode[0]
            } else if (this.addNodeValue.search('https://') > -1) {
              resultNode = this.addNodeValue.replace('https://', '')
              resultNode = resultNode.split(':')
              resultNode = resultNode[0]
            }

            let successNotif = {
              type: 'success',
              active: true,
              title: 'Added node.',
              message: 'The node was added successfully.'
            }

            if (customNodes === null) {
              if (allNodes.includes(resultNode) === true) {
                throw String('Existing node')
              } else {
                let customNodeArray = JSON.stringify([resultNode])
                this.$localStorage.set('customNodes', customNodeArray)
                this.$store.dispatch('newNotification', successNotif)
              }
            } else if (customNodes !== null) {
              let customNodeArray = JSON.parse(customNodes)

              if (allNodes.includes(resultNode) === true) {
                throw String('Existing node')
              } else {
                customNodeArray.push(resultNode)
                this.$localStorage.set('customNodes', customNodeArray)
                this.$store.dispatch('newNotification', successNotif)
              }
            }
          } else {
            throw String('Invalid node network type')
          }
        } catch (error) {
          console.log(error)
          let tmpObj = {
            type: 'error',
            active: true,
            title: 'Node error.',
            message: 'The node is not valid.'
          }

          if (error === 'Invalid node network type') {
            tmpObj.message = 'Invalid node network type'
          } else if (error === 'Existing node') {
            console.warn(error)
            tmpObj.message = 'Existing node'
          }

          this.$store.dispatch('newNotification', tmpObj)
        }
      }
    }
  },

  computed: {
    allNodes (nv, ov) {
      let customNodes = JSON.parse(this.$localStorage.get('customNodes'))
      let totalNodes
      if (customNodes !== null) {
        totalNodes = this.nodes.concat(customNodes)
      } else {
        totalNodes = this.nodes
      }

      return totalNodes
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
