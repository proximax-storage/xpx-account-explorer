<template>
  <div class="account-transactions">
    <div class="fold" v-if="mainActive === true">
      <table class="table-setting">
        <tr>
          <th class="txt-left">Sender</th>
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

    <div class="fold" v-if="mainActive === false">
      <div class="box-grey">
        <span>You have not added a custom account yet</span>
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

export default {
  name: 'MyAccountTrans',

  data () {
    return {
      mainActive: null,
      transactions: []
    }
  },

  mounted () {
    this.getAccounts()
  },

  methods: {
    async getAccounts () {
      let myAccounts = JSON.parse(this.$localStorage.get('myAccounts'))
      if (myAccounts !== null) {
        let publicAccount = PublicAccount.createFromPublicKey(myAccounts[0].publicKey, this.$config.network.number)
        try {
          let result = await this.$provider.accountHttp.transactions(publicAccount, new QueryParams(100)).toPromise()
          // let filteredTransactions = result.filter(el => el.type === 16724 || el.type === 16961)

          result.forEach(el => {
            el.totalAmount = 0
            if (el.type === 16724) {
              console.log(el)
              el.mosaics.forEach(mosaic => {
                mosaic.id = mosaic.id.toHex()
                mosaic.amount = mosaic.amount.compact()
                if (mosaic.id === this.$config.coin.mosaic.id) {
                  el.totalAmount += mosaic.amount
                } else if (mosaic.id === this.$config.coin.namespace.id) {
                  el.totalAmount += mosaic.amount
                }
              })
            }
          })

          this.transactions = result

          this.mainActive = true
        } catch (error) {
          console.log(error)
        }
      } else {
        this.mainActive = false
      }
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>