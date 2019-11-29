<template>
  <div class="module-header">
    <div class="header-title">Accounting - Human Resourse</div>
    <div class="header-title-module">{{ this.name }}</div>
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
