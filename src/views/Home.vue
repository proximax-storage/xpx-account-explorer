<template>
  <div class="Home">
    <module-header :name="moduleName"/>

    <div class="separator"></div>

    <app-searchbar/>

    <div class="separator"></div>

    <div class="home-indicator">
      <div class="child-indicator">
        <div>Recent transaction</div>
      </div>

      <div>
        <div class="child-indicator">
          <div class="cont-button" v-if="myAccounts !== null">
            <span>Export to:</span>
          </div>
          <div class="cont-button">
            <input type="button" value="PDF" class="proximax-btn">
          </div>
          <div class="cont-button">
            <input type="button" value="CSV" class="proximax-btn">
          </div>
        </div>
      </div>
    </div>
    <div class="separator"></div>

    <app-filter/>

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
import AppFilter from '@/components/Global/app-filter'

export default {
  name: 'Home',

  components: {
    ModuleHeader,
    AppSearchbar,
    MyAccountTrans,
    AppFold,
    NodeInfo,
    AppFilter
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
