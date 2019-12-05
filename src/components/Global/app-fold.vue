<template>
  <div class="fold">
    <div class="cont" @click="initRun">
      <div>{{ description }}</div>
      <img v-if="active" :src="require('@/assets/icons/uparrow.svg')" class="icon20">
      <img v-if="!active" :src="require('@/assets/icons/downarrow.svg')" class="icon20">
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppFold',

  props: {
    description: String,
    run: {
      type: Function,
      default: null
    }
  },

  data () {
    return {
      active: false
    }
  },

  methods: {
    initRun () {
      this.active = !this.active
      if (this.run !== null) {
        this.run()
      }
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
