<template>
  <div class="customizing">
    <module-header :name="moduleName"/>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'

export default {
  name: 'Customizing',

  components: {
    ModuleHeader
  },

  data () {
    return {
      moduleName: 'Customizing'
    }
  }
}
</script>
