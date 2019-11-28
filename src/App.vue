<template>
  <div id="app">

    <app-header/>

    <div class="view-container">
      <router-view class="view"/>
    </div>

    <app-footer/>

  </div>
</template>

<script>
// Components
import AppHeader from './components/Global/app-header'
import AppFooter from './components/Global/app-footer'

// Libraries
import { PublicAccount } from 'tsjs-xpx-chain-sdk'

export default {
  components: {
    AppHeader,
    AppFooter
  },

  mounted () {
    this.runApp()
    this.example()
  },

  methods: {
    runApp () {
      console.log('Welcome to ExplorerRRHH')
      console.log('LocalStorage', this.$localStorage)
      console.log('SessionStorage', this.$sessionStorage)
      console.log('Config', this.$config)
      console.log('Provider', this.$provider)
    },

    async example () {
      let publicAccount = PublicAccount.createFromPublicKey('EC2633D9A9344E48D24776C532FC80A9D5E6347527290152AA6A95A4A32798DD', this.$config.network.number)
      console.log(publicAccount)
      try {
        let accountInfo = await this.$provider.accountHttp.getAccountInfo(publicAccount.address).toPromise()
        console.log(accountInfo)
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>

<style lang="sass">
@import url('./style.css')
</style>
