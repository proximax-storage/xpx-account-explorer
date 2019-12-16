<template>
  <div class="superloader" v-if="getLoaderInfo.active">
    <div class="loader-cont">
      <img :src="require('@/assets/icons/icon-loading.svg')" alt="Loader" class="loader mb-10" width="100">
      <p>{{ (getLoaderInfo.text !== null) ? getLoaderInfo.text : 'Waiting' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSuperloader',

  computed: {
    getLoaderInfo () {
      return this.$store.state.superloader
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
