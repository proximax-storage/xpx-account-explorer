<template>
  <div class="Publickey">
    <module-header :name="moduleName"/>

    <div class="separator"></div>

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
          <div class="txt-center subtitleHigh">Balance XPX</div>
          <div class="txt-center valueHigh" v-if="balance == 0" v-html="this.$utils.fmtAmountValue(balance)"></div>
          <div class="txt-center valueHigh" v-if="balance !== 0" v-html="this.$utils.fmtAmountValue(balance)"></div>
        </div>
      </div>
    </div>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="animate fade">
      <node-info/>
    </div>

    <div class="separator"></div>

    <app-export-format :dataTx="trasform"/>

    <div class="separator"></div>

    <app-error v-if="errorActive === true" :title="errorTitle" :text="errorText"/>

    <app-filter @transactionType="getTransactionType"/>

    <div class="accountInfo" v-if="accountInfo !== null">
      <h1 class="title txt-left">Transactions</h1>
      <table class="table-setting">
        <tr>
          <th class="txt-left">Signer</th>
          <th class="txt-left">Recipient</th>
          <th class="txt-left">Transaction</th>
          <th class="txt-left">Timestamp</th>
          <th class="txt-left">Amount</th>
          <th class="txt-left">Info</th>
        </tr>
        <tr v-for="(item, index) in transactions" :key="index" v-show="showType.includes(item.type) === true">
          <td class="txt-left">{{ $utils.maskAddress(item.signer.address.pretty()) }}</td>
          <td class="txt-left">{{ (item.recipient) ? $utils.maskAddress(item.recipient.pretty()) : 'No Recipient' }}</td>
          <td class="txt-left">{{ $utils.getNameTypeTransaction(item.type) }}</td>
          <td class="txt-left">{{ item.block }}</td>
          <td class="txt-left" v-html="$utils.fmtAmountValue(item.totalAmount)"></td>
          <td class="txt-left" @click="goToHash(item.transactionInfo.hash)"><img class="icon20" :src="require('@/assets/icons/icon-info-on.svg')"></td>
        </tr>
      </table>
    </div>

    <div class="fold mb-10">
      <button class="proximax-btn pointer" @click="loadmore()">
        <span v-if="!loadActive">LOAD MORE</span>
        <div v-if="loadActive"><img :src="require('@/assets/icons/loading.svg')" class="loader"></div>
      </button>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import AppSearchbar from '@/components/Global/app-searchbar'
import AppFold from '@/components/Global/app-fold'
import NodeInfo from '@/components/Global/app-node-info'
import { Address, QueryParams } from 'tsjs-xpx-chain-sdk'
import AppExportFormat from '@/components/Global/app-export-format'
import AppError from '@/components/Global/app-error'
import AppFilter from '@/components/Global/app-filter'

export default {
  name: 'Address',

  components: {
    ModuleHeader,
    AppSearchbar,
    AppFold,
    NodeInfo,
    AppExportFormat,
    AppError,
    AppFilter
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
      transactions: [],
      trasform: [],
      errorMessage: Address,
      errorTitle: 'Address error.',
      errorText: 'The value provided is invalid or has not been found.',
      errorActive: false,
      loadActive: false,
      showType: [
        16724,
        16718,
        16974,
        17230,
        16717,
        16973,
        16725,
        16705,
        16961,
        16712,
        16722,
        16978,
        16720,
        16976,
        17232,
        16716,
        16701,
        16957,
        17213,
        16727,
        16728,
        16729
      ]
    }
  },

  mounted () {
    this.loadTransactions()
  },

  methods: {
    async loadTransactions (id = null) {
      const prohibitedPublicKey = '0000000000000000000000000000000000000000000000000000000000000000'
      let address = Address.createFromRawAddress(this.$route.params.id, this.$config.network.number)
      try {
        let accountInfo = await this.$provider.accountHttp.getAccountInfo(address).toPromise()
        console.log('ACCOUNTINFO')

        if (accountInfo.publicKey === prohibitedPublicKey) {
          throw String('Prohibited PublicKey')
        }

        this.accountInfo = accountInfo
        let mosaics = accountInfo.mosaics
        mosaics.forEach(el => {
          el.amount = el.amount.compact()
          el.id = el.id.toHex()
          if (el.id === this.mosaicXPX || el.id === this.namespaceXPX) {
            this.balance = el.amount
          }
        })
        const queryParams = 10
        const query = (id) ? new QueryParams(queryParams, id) : new QueryParams(queryParams)
        let transactions = await this.$provider.accountHttp.transactions(accountInfo.publicAccount, query).toPromise()
        const dataStructure = await this.$utils.getStructureDashboard(transactions, this.$config, this.$provider)
        this.transactions = this.$utils.orderArray(dataStructure.transactions)
        this.trasform = this.$utils.orderArray(dataStructure.structureCsv)
      } catch (error) {
        console.warn(error)
        this.errorActive = true
      }
    },

    goToHash (hash) {
      let routeData = this.$router.resolve({ path: `/hash/${hash}` })
      window.open(routeData.href, '_blank')
    },

    toggleNodeInfo () {
      this.nodeInfoVisible = !this.nodeInfoVisible
    },

    async loadmore () {
      this.loadActive = true
      this.transactions = this.$utils.orderArray(this.transactions)
      const lastTransactionId = (this.transactions[0].length !== 0) ? this.transactions[this.transactions.length - 1].transactionInfo.id : null
      try {
        const queryParams = 10
        const query = (lastTransactionId) ? new QueryParams(queryParams, lastTransactionId) : new QueryParams(queryParams)
        let transactions = await this.$provider.accountHttp.transactions(this.accountInfo.publicAccount, query).toPromise()
        const dataStructure = await this.$utils.getStructureDashboard(transactions, this.$config, this.$provider)
        setTimeout(() => {
          this.$utils.orderArray(dataStructure.transactions).forEach(el => {
            this.transactions.push(el)
          })
          this.$utils.orderArray(dataStructure.structureCsv).forEach(el => {
            this.trasform.push(el)
          })
          this.loadActive = false
        }, 2000)
      } catch (error) {
        console.warn(error)
        this.errorActive = true
      }
      // this.loadTransactions(lastTransactionId)
    },
    getTransactionType (data) {
      this.showType = data
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
