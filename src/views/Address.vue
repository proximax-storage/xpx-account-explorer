<template>
  <div class="Publickey">
    <module-header :name="moduleName"/>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="animate fade">
      <node-info/>
    </div>

    <div class="accountInfo" v-if="accountInfo !== null">
      <div>
        <div class="box-grey">
          <div>Address</div>
          <div>{{ accountInfo.publicAccount.address.pretty() }}</div>
        </div>
        <div class="box-grey">
          <div>Public Key</div>
          <div>{{ accountInfo.publicAccount.publicKey }}</div>
        </div>
      </div>
    </div>

    <div class="accountInfo" v-if="accountInfo !== null">
      <div>
        <div class="box-grey">
          <div>Balance</div>
          <div class="txt-left" v-if="balance == 0" v-html="this.$utils.fmtAmountValue(balance)"></div>
          <div class="txt-left" v-if="balance !== 0" v-html="this.$utils.fmtAmountValue(balance)"></div>
        </div>
      </div>
    </div>

    <div class="accountInfo" v-if="accountInfo !== null">
      <h1 class="title txt-left">Account Info</h1>
      <table class="table-setting">
        <tr>
          <th class="txt-left">Address</th>
          <th class="txt-left">Public Key</th>
          <th class="txt-left">Balance</th>
        </tr>
        <tr>
          <td class="txt-left">{{ accountInfo.publicAccount.address.pretty() }}</td>
          <td class="txt-left">{{ accountInfo.publicAccount.publicKey }}</td>
          <td class="txt-left" v-if="balance == 0" v-html="this.$utils.fmtAmountValue(balance)"></td>
          <td class="txt-left" v-if="balance !== 0" v-html="this.$utils.fmtAmountValue(balance)"></td>
        </tr>
      </table>
    </div>

    <div class="accountInfo" v-if="accountInfo !== null">
      <h1 class="title txt-left">Transactions</h1>
      <table class="table-setting">
        <tr>
          <th class="txt-left table-width-300">Signer</th>
          <th class="txt-left table-width-300">Recipient</th>
          <th class="txt-left">Deadline</th>
          <th class="txt-left">Amount</th>
        </tr>
        <tr v-for="(item, index) in transactions" :key="index">
          <th class="txt-left table-width-300">{{ item.signer.address.pretty() }}</th>
          <th class="txt-left table-width-300">{{ (item.recipient) ? item.recipient.pretty() : 'No Recipient' }}</th>
          <th class="txt-left">{{ $utils.fmtTime(item.deadline.value) }}</th>
          <th class="txt-left" v-html="$utils.fmtAmountValue(item.totalAmount)"></th>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import AppFold from '@/components/Global/app-fold'
import NodeInfo from '@/components/Global/app-node-info'
import { PublicAccount, QueryParams } from 'tsjs-xpx-chain-sdk'

export default {
  name: 'Address',

  components: {
    ModuleHeader,
    AppFold,
    NodeInfo
  },

  data () {
    return {
      moduleName: 'Address',
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
    // this.init()
  },

  methods: {
    async init () {
      let address = this.$route.params.id
      console.log(address)
      let publicAccount = PublicAccount.createFromPublicKey(address, this.$config.network.number)
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
        console.log(transactions)
        transactions = transactions.filter(el => el.type === 16724)
        transactions.forEach(el => {
          el.totalAmount = 0
          el.mosaics.forEach(mosaic => {
            mosaic.id = mosaic.id.toHex()
            mosaic.amount = mosaic.amount.compact()
            if (mosaic.id === this.$config.coin.mosaic.id) {
              el.totalAmount += mosaic.amount
            } else if (mosaic.id === this.$config.coin.namespace.id) {
              el.totalAmount += mosaic.amount
            }
          })
        })

        this.transactions = transactions

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
