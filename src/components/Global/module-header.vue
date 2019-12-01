<template>
  <div class="module-header">
    <div class="header-title">{{ this.name }}</div>
    <div class="header-title-module">Accounting - Human Resourse</div>
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
