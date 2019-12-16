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
import { PublicAccount } from 'tsjs-xpx-chain-sdk'

export default {
  components: {
    AppSidebar,
    AppNotification
  },

  mounted () {
    this.runApp()
    // this.runWS()
    this.updateAccountsInfo()
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

    updateAccountsInfo () {
      let myAccounts = JSON.parse(this.$localStorage.get('myAccounts'))
      let updateInfo = []

      myAccounts.forEach(async (account, index) => {
        let publicAccount = PublicAccount.createFromPublicKey(account.publicKey, this.$config.network.number)
        let multisigInfo = null

        try {
          multisigInfo = await this.$provider.accountHttp.getMultisigAccountInfo(publicAccount.address).toPromise()
          account.multisigInfo = multisigInfo
          updateInfo.push(account)
        } catch (e) {
          console.warn('No Multisig Info')
          account.multisigInfo = multisigInfo
          updateInfo.push(account)
        }

        if (index + 1 === myAccounts.length) {
          console.log('TERMINADO', updateInfo)
          this.$localStorage.set('myAccounts', JSON.stringify(updateInfo))
          this.$ws.connectnWs('')
        }
      })
    }
  }
}
</script>

<style lang="sass">
@import url('./style.css')
</style>
