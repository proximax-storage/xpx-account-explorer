<template>
  <div class="inner-modal" v-if="params && params.active === true">
    <module-header :name="moduleName"/>

    <div class="separator"></div>

    <div class="fold">
      <div class="box-grey">
        <span class="bold value">Inner Transaction:</span>
        <span class="bold title"> {{ $utils.getNameTypeTransaction(params.transaction.type) }}</span>
      </div>
    </div>

    <div class="inner-position">

      <div class="transaction-info" v-if="params.transaction !== null">
        <div>
          <div class="box-grey txt-left mb-10">
            <p class="bold">Sender: </p>
            <p>{{ params.transaction.signer.address.pretty() }}</p>
          </div>

          <div class="box-grey txt-left mb-10">
            <p class="bold">Signature: </p>
            <p>{{ params.transaction.signature }}</p>
          </div>

          <div class="box-grey txt-left mb-10" v-if="params.transaction.recipient">
            <p class="bold">Recipient: </p>
            <p>{{ params.transaction.recipient.pretty() }}</p>
          </div>
        </div>

        <div>
          <div class="box-white txt-left">
            <span class="bold fs20">Amount: </span>
            <span class="fs20" v-html="getAmount(params.transaction)"></span>
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
    </div>

    <div class="fold">
      <input type="button" value="Close" class="proximax-btn-red" @click="closeModal">
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import { Deadline } from 'tsjs-xpx-chain-sdk'

export default {
  name: 'InnerModal',

  components: {
    ModuleHeader
  },

  props: {
    params: {
      type: Object,
      default: function () {
        return {
          active: false,
          transaction: null
        }
      }
    }
  },

  data () {
    return {
      moduleName: 'Inner Transaction',
      fee: 0,
      timestamp: 0,
      block: 0
    }
  },

  methods: {
    getAmount (item) {
      console.log(item)
      let totalXPX = 0
      if (item.mosaics !== 0) {
        item.mosaics.forEach(el => {
          console.log(el)
          if (el.id.toHex() === this.$config.coin.mosaic.id) {
            totalXPX = el.amount
          } else if (el.id.toHex() === this.$config.coin.namespace.id) {
            totalXPX = el.amount.compact()
          }
        })
      }

      this.calculateFee(item)
      return this.$utils.fmtAmountValue(totalXPX)
    },

    async calculateFee (item) {
      console.log('LLEGA')
      try {
        this.block = item.transactionInfo.height.compact()
        let blockInfo = await this.$provider.blockHttp.getBlockByHeight(this.block).toPromise()
        this.timestamp = this.$utils.fmtTime(
          blockInfo.timestamp.compact() + (Deadline.timestampNemesisBlock * 1000)
        )
        this.fee = blockInfo.feeMultiplier * item.size
        console.log(item.size)
      } catch (error) {
        console.warn(error)
      }
    },

    closeModal () {
      this.$emit('closeTransaction', {
        active: false,
        transaction: null
      })
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
