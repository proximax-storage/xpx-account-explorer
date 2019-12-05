<template>
  <div class="Publickey">
    <module-header :name="moduleName"/>

    <app-searchbar/>

    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="animate fade">
      <node-info/>
    </div>

    <div class="separator"></div>

    <app-export-format :dataExport="transactions" :description="foldLabel"/>

    <div class="separator"></div>

    <div class="block-cont">
      <div class="txt-left">
        <span class="bold fs20">Block Height: </span>
        <span class="fs20">{{ this.$route.params.id }}</span>
      </div>
    </div>

    <div class="separator"></div>

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
        <tr v-for="(item, index) in transactions" :key="index">
          <td class="txt-left">{{ $utils.maskAddress(item.signer.address.pretty()) }}</td>
          <td class="txt-left">{{ (item.recipient) ? $utils.maskAddress(item.recipient.pretty()) : 'No Recipient' }}</td>
          <td class="txt-left">{{ $utils.getNameTypeTransaction(item.type) }}</td>
          <td class="txt-left">{{ item.block }}</td>
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
import { QueryParams } from 'tsjs-xpx-chain-sdk'
import AppExportFormat from '@/components/Global/app-export-format'

export default {
  name: 'Block',

  components: {
    ModuleHeader,
    AppSearchbar,
    AppFold,
    NodeInfo,
    AppExportFormat
  },

  data () {
    return {
      moduleName: 'Block',
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
      try {
        let blockTransactions = await this.$provider.blockHttp.getBlockTransactions(this.$route.params.id, new QueryParams(100)).toPromise()
        console.log(blockTransactions)
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
