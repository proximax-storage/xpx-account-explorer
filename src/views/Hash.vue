<template>
  <div class="Hash">
    <module-header :name="moduleName"/>

    <div class="separator"></div>

    <app-searchbar/>

    <div class="separator"></div>

  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import AppSearchbar from '@/components/Global/app-searchbar'

export default {
  name: 'HashTransaction',

  components: {
    ModuleHeader,
    AppSearchbar
  },

  data () {
    return {
      moduleName: 'Transaction hash'
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      let hash = this.$route.params.id
      let transactionInfo = await this.$provider.transactionHttp.getTransaction(hash).toPromise()
      console.log(transactionInfo)
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
