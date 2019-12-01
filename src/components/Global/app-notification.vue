<template>
  <div class="Error">
    <div class="error-cont" v-if="getNotification.active && getNotification.type == 'error'">
      <div class="title white-color">{{ getNotification.title }}</div>
      <div class="value white-color">{{ getNotification.message }}</div>
    </div>

    <div class="error-cont" v-if="getNotification.active && getNotification.type == 'success'">
      <div class="title white-color">{{ getNotification.title }}</div>
      <div class="value white-color">{{ getNotification.message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppNotification',

  computed: {
    getNotification () {
      let obj = this.$store.state.notification
      return obj
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
