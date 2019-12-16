<template>
  <div class="superloader" v-if="getLoaderInfo.active">
    <div class="loader-cont">
      <img :src="require('@/assets/icons/loading.svg')" alt="Loader" class="loader mb-10" width="100">
      <p>{{ (getLoaderInfo.text !== null) ? getLoaderInfo.text : 'Loading' }}</p>
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
