<template>
  <div class="Publickey">
    <module-header :name="moduleName"/>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="animate fade">
      <node-info/>
    </div>

    <div class="accountInfo" v-if="accountInfo !== null">
      <h1 class="title txt-left">Account Info</h1>
      <table class="table-setting">
        <tr>
          <th class="subtitle">Address</th>
          <th class="subtitle">Public Key</th>
          <th class="subtitle">Balance</th>
        </tr>
        <tr>
          <td class="value">{{ accountInfo.publicAccount.address.pretty() }}</td>
          <td class="value">{{ accountInfo.publicAccount.publicKey }}</td>
          <td class="value" v-if="balance == 0" v-html="this.$utils.fmtAmountValue(balance)"></td>
          <td class="value" v-if="balance !== 0" v-html="this.$utils.fmtAmountValue(balance)"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import AppFold from '@/components/Global/app-fold'
import NodeInfo from '@/components/Global/app-node-info'
import { PublicAccount } from 'tsjs-xpx-chain-sdk'

export default {
  name: 'Publickey',

  components: {
    ModuleHeader,
    AppFold,
    NodeInfo
  },

  data () {
    return {
      moduleName: 'Public Key',
      accountInfo: null,
      foldLabel: 'More Info',
      nodeInfoVisible: false,
      mosaicXPX: this.$config.coin.mosaic.id,
      namespaceXPX: this.$config.coin.namespace.id,
      balance: 0,
      otherMosaics: null
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      let publickey = this.$route.params.id
      let publicAccount = PublicAccount.createFromPublicKey(publickey, this.$config.network.number)
      console.log(publicAccount)
      try {
        let accountInfo = await this.$provider.accountHttp.getAccountInfo(publicAccount.address).toPromise()
        console.log(accountInfo)
        this.accountInfo = accountInfo
        let mosaics = accountInfo.mosaics
        mosaics.forEach(el => {
          el.amount = el.amount.compact()
          el.id = el.id.toHex()

          if (el.id === this.mosaicXPX || el.id === this.namespaceXPX) {
            this.balance = el.amount
          }
        })

        console.log(mosaics)
      } catch (error) {
        console.warn(error)
      }
    },

    toggleNodeInfo () {
      this.nodeInfoVisible = !this.nodeInfoVisible
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
