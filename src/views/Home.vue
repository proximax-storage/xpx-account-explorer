<template>
  <div class="Home">
    <module-header :name="moduleName"/>

    <app-searchbar/>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="animate fade">
      <node-info/>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import NodeInfo from '@/components/Global/app-node-info'
import AppSearchbar from '@/components/Global/app-searchbar'
import AppFold from '@/components/Global/app-fold'

export default {
  name: 'Home',

  components: {
    ModuleHeader,
    NodeInfo,
    AppSearchbar,
    AppFold
  },

  data () {
    return {
      moduleName: 'Home',
      foldLabel: 'More Info',
      nodeInfoVisible: false
    }
  },

  methods: {
    toggleNodeInfo () {
      this.nodeInfoVisible = !this.nodeInfoVisible
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
