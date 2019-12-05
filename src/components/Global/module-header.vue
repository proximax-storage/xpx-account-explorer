<template>
  <div class="module-header">
    <div class="header-title">{{ this.name }}</div>
  </div>
</template>

<script>
export default {
  name: 'ModuleHeader',

  props: {
    name: String
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
