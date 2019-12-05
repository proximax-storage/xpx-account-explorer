<template>
  <div class="app-footer">
    <!-- Footer -->
    <p>
      Copyright 2019. ProximaX. All rights reserved.
      <b class="highlighted">Sirius Explorer {{ softwareVersion }}</b>
    </p>
    <!-- End Footer -->

  </div>
</template>

<script>
export default {
  name: 'AppFooter',

  data () {
    return {
      softwareVersion: `v${this.$config.version}`
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
