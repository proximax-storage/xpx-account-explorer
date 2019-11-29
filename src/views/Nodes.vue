<template>
  <div class="Nodes">
    <module-header :name="moduleName"/>
    <node-info/>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import NodeInfo from '@/components/Global/app-node-info'

export default {
  name: 'Nodes',

  components: {
    ModuleHeader,
    NodeInfo
  },

  data () {
    return {
      moduleName: 'Nodes'
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
