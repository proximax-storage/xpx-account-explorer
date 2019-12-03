<template>
  <div class="Publickey">
    <module-header :name="moduleName"/>

    <app-searchbar/>

    <div class="separator"></div>

    <div class="accountInfo" v-if="accountInfo !== null">
      <h1 class="title txt-left">Account Info</h1>
      <div class="accountInfo-cont">
        <div class="box-grey">
          <div class="txt-left subtitle">Address</div>
          <div class="txt-left value">{{ accountInfo.publicAccount.address.pretty() }}</div>
        </div>
        <div class="box-grey">
          <div class="txt-left subtitle">Public Key</div>
          <div class="txt-left value">{{ accountInfo.publicAccount.publicKey }}</div>
        </div>
      </div>
    </div>

    <div class="accountInfo" v-if="accountInfo !== null">
      <div>
        <div class="box-grey">
          <div class="txt-center subtitleHigh">Balance</div>
          <div class="txt-center valueHigh" v-if="balance == 0" v-html="this.$utils.fmtAmountValue(balance)"></div>
          <div class="txt-center valueHigh" v-if="balance !== 0" v-html="this.$utils.fmtAmountValue(balance)"></div>
        </div>
      </div>
    </div>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="animate fade">
      <node-info/>
    </div>

    <div class="accountInfo" v-if="accountInfo !== null">
      <h1 class="title txt-left">Transactions</h1>
      <table class="table-setting">
        <tr>
          <th class="txt-left">Signer</th>
          <th class="txt-left">Recipient</th>
          <th class="txt-left">Transaction</th>
          <th class="txt-left">Deadline</th>
          <th class="txt-left">Amount</th>
          <th class="txt-left">Info</th>
        </tr>
        <tr v-for="(item, index) in transactions" :key="index">
          <td class="txt-left">{{ $utils.maskAddress(item.signer.address.pretty()) }}</td>
          <td class="txt-left">{{ (item.recipient) ? $utils.maskAddress(item.recipient.pretty()) : 'No Recipient' }}</td>
          <td class="txt-left">{{ $utils.getNameTypeTransaction(item.type) }}</td>
          <td class="txt-left">{{ $utils.fmtTime(item.deadline.value) }}</td>
          <td class="txt-left" v-html="$utils.fmtAmountValue(item.totalAmount)"></td>
          <td class="txt-left"><img class="icon20" :src="require('@/assets/icons/information.svg')"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import AppSearchbar from '@/components/Global/app-searchbar'
import AppFold from '@/components/Global/app-fold'
import NodeInfo from '@/components/Global/app-node-info'
import { PublicAccount, QueryParams } from 'tsjs-xpx-chain-sdk'

export default {
  name: 'Publickey',

  components: {
    ModuleHeader,
    AppSearchbar,
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
      otherMosaics: null,
      transactions: null
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

        let transactions = await this.$provider.accountHttp.transactions(publicAccount, new QueryParams(100)).toPromise()
        this.transactions = this.$utils.getStructureDashboard(transactions, this.$config)
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
