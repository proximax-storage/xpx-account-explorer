<template>
  <div class="Hash">
    <module-header :name="moduleName"/>

    <div class="separator"></div>

    <app-searchbar/>

    <div class="separator"></div>
    <app-fold :description="foldLabel" :run="toggleNodeInfo"/>
    <div v-if="nodeInfoVisible" class="animate fade">
      <node-info/>
    </div>

    <div class="separator"></div>

    <div class="hash-info" v-if="transaction !== null">
      <div class="item-left">
        <div>
          <span class="txt-left bold value">Transaction type</span>:
          <span class="txt-left value">{{ $utils.getNameTypeTransaction(transaction.type) }}</span>
        </div>
        <div>
          <span class="txt-left bold value">Hash</span>:
          <span class="txt-left value">{{ $route.params.id }}</span>
        </div>
      </div>
      <div class="item-rigth">
        <span>Export to: &nbsp; &nbsp;</span><button style="cursor: pointer;"  class='proximax-btn' v-on:click="createPDF()"> PDF </button>
      </div>
    </div>

    <div class="separator"></div>

    <div class="transaction-info" v-if="transaction !== null">
      <div>
        <div class="box-grey txt-left mb-10">
          <p class="bold">Sender: </p>
          <p>{{ this.transaction.signer.address.pretty() }}</p>
        </div>

        <div class="box-grey txt-left mb-10">
          <p class="bold">Signature: </p>
          <p>{{ this.transaction.signature }}</p>
        </div>

        <div class="box-grey txt-left mb-10" v-if="this.transaction.recipient">
          <p class="bold">Recipient: </p>
          <p>{{ this.transaction.recipient.pretty() }}</p>
        </div>
      </div>

      <div>
        <div class="box-white txt-left">
          <span class="bold fs20">Amount: </span>
          <span class="fs20" v-html="$utils.fmtAmountValue(amount)"></span>
        </div>

        <div class="box-white txt-left">
          <span class="bold fs20">Fee: </span>
          <span class="fs20" v-html="$utils.fmtAmountValue(fee)"></span>
        </div>

        <div class="box-white txt-left">
          <p class="bold fs14">Timestamp: </p>
          <p class="fs14">{{ timestamp }}</p>
        </div>

        <div class="box-white txt-left mb-10">
          <p class="bold fs14">Block Heigh: </p>
          <p class="fs14">{{ block }}</p>
        </div>
      </div>
    </div>

    <div class="inner" v-if="innerTrans !== null">
      <h1 class="title txt-left mb-10">Inner Transactions</h1>
      <div class="box-grey mb-10 innerCard" v-for="(item, index) in innerTrans" :key="index" @click="activeModal(index)">
        <div>
          <div class="title">#</div>
          <div class="value">{{ index }}</div>
        </div>
        <div>
          <div class="title">Type</div>
          <div class="value">{{ $utils.getNameTypeTransaction(item.type) }}</div>
        </div>
        <div>
          <div class="title">Height</div>
          <div class="value">{{ item.transactionInfo.height.compact() }}</div>
        </div>
        <div>
          <div class="title">Version</div>
          <div class="value">{{ item.version }}</div>
        </div>
      </div>
    </div>

    <inner-modal :params="innerParams" @closeTransaction="modalCom"/>

  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import AppSearchbar from '@/components/Global/app-searchbar'
import AppFold from '@/components/Global/app-fold'
import NodeInfo from '@/components/Global/app-node-info'
import { Deadline } from 'tsjs-xpx-chain-sdk'
import InnerModal from '@/components/Hash/innerModal'

export default {
  name: 'HashTransaction',

  components: {
    ModuleHeader,
    AppSearchbar,
    AppFold,
    NodeInfo,
    InnerModal
  },

  data () {
    return {
      moduleName: 'Transaction hash',
      foldLabel: 'More Info',
      nodeInfoVisible: false,
      transaction: null,
      timestamp: null,
      block: null,
      amount: 0,
      fee: 0,
      innerTrans: null,
      innerParams: null
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      let hash = this.$route.params.id
      try {
        let transactionInfo = await this.$provider.transactionHttp.getTransaction(hash).toPromise()
        console.log(transactionInfo)
        this.transaction = transactionInfo

        if ([undefined, null].includes(transactionInfo.mosaics) === false) {
          transactionInfo.mosaics.forEach(mosaic => {
            mosaic.id = mosaic.id.toHex()
            mosaic.amount = mosaic.amount.compact()
            console.log(mosaic)
            if (mosaic.id === this.$config.coin.mosaic.id) {
              this.amount += mosaic.amount
            } else if (mosaic.id === this.$config.coin.namespace.id) {
              this.amount += mosaic.amount
            }
          })
        }

        this.block = transactionInfo.transactionInfo.height.compact()
        let block = await this.$provider.blockHttp.getBlockByHeight(
          transactionInfo.transactionInfo.height.compact()
        ).toPromise()

        this.timestamp = this.$utils.fmtTime(
          block.timestamp.compact() + (Deadline.timestampNemesisBlock * 1000)
        )

        this.fee = block.feeMultiplier * transactionInfo.size
        console.log(transactionInfo.innerTransactions)
        this.innerTrans = ([null, undefined].includes(transactionInfo.innerTransactions) === false) ? transactionInfo.innerTransactions : null
      } catch (error) {
        console.warn(error)
      }
    },

    toggleNodeInfo () {
      this.nodeInfoVisible = !this.nodeInfoVisible
    },
    createPDF () {
      window.print()
    },

    activeModal (index) {
      console.log(index, this.innerTrans[index])

      let tmpObj = {
        active: true,
        transaction: this.innerTrans[index]
      }

      this.innerParams = tmpObj
    },

    modalCom (data) {
      console.log(data)
      this.innerParams = data
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
