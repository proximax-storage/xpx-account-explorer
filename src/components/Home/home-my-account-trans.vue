<template>
  <div class="account-transactions">

    <div class="separator"></div>

    <app-export-format :dataTx="trasform"/>

    <div class="separator"></div>

    <app-filter @transactionType="getTransactionType"/>

    <div class="accountInfo" v-if="mainActive === true">
      <table class="table-setting">
        <tr>
          <th class="txt-left">Sender</th>
          <th class="txt-left">Recipient</th>
          <th class="txt-left">Transaction</th>
          <th class="txt-left">Deadline</th>
          <th class="txt-left">Amount</th>
          <th class="txt-left">Info</th>
        </tr>
        <tr v-for="(item, index) in transactions" :key="index" v-show="showType.includes(item.type) === true">
          <td class="txt-left">{{ $utils.maskAddress(item.signer.address.pretty()) }}</td>
          <td class="txt-left">{{ (item.recipient) ? $utils.maskAddress(item.recipient.pretty()) : 'No Recipient' }}</td>
          <td class="txt-left">{{ $utils.getNameTypeTransaction(item.type) }}</td>
          <td class="txt-left">{{ $utils.fmtTime(item.deadline.value) }}</td>
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

    <div class="fold" v-if="mainActive === false">
      <div class="box-grey">
        <span>You have not added a custom account yet!</span>
      </div>
    </div>

    <div class="fold" v-if="mainActive === null">
      <div class="box-grey">
        <span>Loading</span>
      </div>
    </div>
  </div>
</template>

<script>
import { PublicAccount, QueryParams } from 'tsjs-xpx-chain-sdk'
import AppFilter from '@/components/Global/app-filter'
import AppExportFormat from '@/components/Global/app-export-format'

export default {
  name: 'MyAccountTrans',

  components: {
    AppFilter,
    AppExportFormat
  },

  data () {
    return {
      mainActive: null,
      transactions: null,
      trasform: [{}],
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
    this.getAccounts()
  },

  methods: {
    async getAccounts (id = null) {
      let myAccounts = JSON.parse(this.$localStorage.get('myAccounts'))
      if (myAccounts !== null) {
        let publicAccount = PublicAccount.createFromPublicKey(myAccounts[0].publicAccount.publicKey, this.$config.network.number)
        try {
          let accountInfo = await this.$provider.accountHttp.getAccountInfo(publicAccount.address).toPromise()
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
          this.transactions = dataStructure.transactions
          this.trasform = dataStructure.structureCsv
          this.mainActive = true
        } catch (error) {
          console.warn(error)
          this.mainActive = false
        }
      } else {
        this.mainActive = false
      }
    },
    async loadmore () {
      this.loadActive = true
      const lastTransactionId = (this.transactions[0].length !== 0) ? this.transactions[this.transactions.length - 1].transactionInfo.id : null
      console.log('lastTransactionId', lastTransactionId)
      try {
        const queryParams = 10
        const query = (lastTransactionId) ? new QueryParams(queryParams, lastTransactionId) : new QueryParams(queryParams)
        let transactions = await this.$provider.accountHttp.transactions(this.accountInfo.publicAccount, query).toPromise()
        const dataStructure = await this.$utils.getStructureDashboard(transactions, this.$config, this.$provider)
        setTimeout(() => {
          console.log(dataStructure)
          dataStructure.transactions.forEach(el => {
            this.transactions.push(el)
          })
          dataStructure.structureCsv.forEach(el => {
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

    goToHash (hash) {
      let routeData = this.$router.resolve({ path: `/hash/${hash}` })
      window.open(routeData.href, '_blank')
    },

    getTransactionType (data) {
      this.showType = data
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
