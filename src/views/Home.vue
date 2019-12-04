<template>
  <div class="Home">
    <module-header :name="moduleName"/>

    <div class="separator"></div>

    <app-searchbar/>

    <div class="separator"></div>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible">
      <node-info/>
    </div>

    <my-account-trans/>

  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import AppSearchbar from '@/components/Global/app-searchbar'
import MyAccountTrans from '@/components/Home/home-my-account-trans'
import AppFold from '@/components/Global/app-fold'
import NodeInfo from '@/components/Global/app-node-info'

export default {
  name: 'Home',

  components: {
    ModuleHeader,
    AppSearchbar,
    MyAccountTrans,
    AppFold,
    NodeInfo
  },

  data () {
    return {
      moduleName: 'Dashboard',
      foldLabel: 'More Info',
      nodeInfoVisible: false,
      myAccounts: this.$localStorage.get('myAccounts')
    }
  },

  methods: {
    toggleNodeInfo () {
      this.nodeInfoVisible = !this.nodeInfoVisible
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
