<template>
  <div class="Invoice">
    <module-header :name="moduleName"/>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'

export default {
  name: 'Invoice',

  components: {
    ModuleHeader
  },

  data () {
    return {
      moduleName: 'Invoice'
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
