<template>
  <div id="app">

    <!-- APP SIDEBAR -->
    <app-sidebar/>
    <!-- END APP SIDEBAR -->

    <!-- VIEW CONTAINER -->
    <div class="view-container">
      <router-view class="view"/>
    </div>
    <!-- VIEW CONTAINER -->

    <app-notification/>
  </div>
</template>

<script>
// Components
import AppSidebar from '@/components/Global/app-sidebar'
import AppNotification from '@/components/Global/app-notification'

export default {
  components: {
    AppSidebar,
    AppNotification
  },

  mounted () {
    this.runApp()
    this.runWS()
    // this.example()
  },

  methods: {
    runApp () {
      let tmpObj = {
        type: 'error',
        active: false,
        title: '',
        message: ''
      }
      this.$store.dispatch('newNotification', tmpObj)
    },

    runWS () {
      console.log(this.$ws.open())
    }
  }
}
</script>

<style lang="sass">
@import url('./style.css')
</style>
