<template>
  <div class="Nodes">
    <module-header :name="moduleName"/>
    <node-info/>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="fold">
      <div class="box-grey mb-10 node-card" v-for="(item, index) in nodes" :key="index">
        <div>{{ item }}</div>
        <div v-if="!(item === currentNode)">
          <input type="button" class="proximax-btn" value="Select" @click="changeNode(item)">
        </div>
        <div v-if="item === currentNode">
          <input type="button" class="proximax-btn-disabled" value="Select" disabled>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import NodeInfo from '@/components/Global/app-node-info'
import AppFold from '@/components/Global/app-fold'

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
      nodeInfoVisible: false,
      nodes: this.$config.nodes,
      currentNode: this.$localStorage.get('currentNode')
    }
  },

  methods: {
    toggleNodeInfo () {
      this.nodeInfoVisible = !this.nodeInfoVisible
    },

    changeNode (node) {
      this.$localStorage.set('currentNode', node)
      window.location.reload()
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
