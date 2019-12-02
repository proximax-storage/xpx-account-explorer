<template>
  <div class="Home">
    <module-header :name="moduleName"/>

    <div class="separator"></div>

    <app-searchbar/>

    <div class="separator"></div>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="animate fade">
      <node-info/>
    </div>

    <div class="home-indicator">
      <div class="child-indicator">
        <div>Recent transaction</div>
      </div>

      <div>
        <div class="child-indicator">
          <div class="cont-button">
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

    <my-account-trans/>

  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import AppSearchbar from '@/components/Global/app-searchbar'
import MyAccountTrans from '@/components/Home/home-my-account-trans'
import AppFold from '@/components/Global/app-fold'

export default {
  name: 'Home',

  components: {
    ModuleHeader,
    AppSearchbar,
    MyAccountTrans,
    AppFold
  },

  data () {
    return {
      moduleName: 'Dashboard',
      foldLabel: 'More Info',
      nodeInfoVisible: false
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
