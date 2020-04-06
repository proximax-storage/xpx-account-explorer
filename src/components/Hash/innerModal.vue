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
          <div class="box-grey txt-left mb-10" v-if="isGift === false">
            <p class="bold">Sender: </p>
            <p>{{ params.transaction.signer.address.pretty() }}</p>
          </div>

          <div class="box-grey txt-left mb-10" v-if="params.transaction.recipient">
            <p class="bold">Recipient: </p>
            <p>{{ params.transaction.recipient.pretty() }}</p>
          </div>

          <div class="box-grey txt-left mb-10" v-if="isGift === false">
            <p class="bold">Signature: </p>
            <p>{{ params.transaction.signature }}</p>
          </div>

          <div class="box-grey txt-left mb-10" v-if="isGift === false">
            <p class="bold">Aggregate Hash: </p>
            <p>{{ params.transaction.transactionInfo.aggregateHash }}</p>
          </div>
        </div>

        <div>
          <div class="box-white txt-left">
            <p class="bold fs14">Timestamp: </p>
            <p class="fs14">{{ timestamp }}</p>
          </div>

          <div class="box-white txt-left">
            <span class="bold fs20">Amount: </span>
            <span class="fs20" v-html="getAmount(params.transaction)"></span>
          </div>

          <div class="box-white txt-left" v-if="isGift === false">
            <span class="bold fs20">Fee: </span>
            <span class="fs20" v-html="$utils.fmtAmountValue(fee)"></span>
          </div>

          <div class="box-white txt-left" v-if="[undefined, null].includes(params.transaction.message) === false && isGift === false">
            <span class="bold">Message: </span>
            <span class="fs20">{{ (params.transaction.message.type === 0) ? params.transaction.message.payload : 'Encrypted' }}</span>
          </div>

          <div class="box-white txt-left" v-if="msgGiftActive">
            <p class="bold">Gift Card Message: </p>
            <p class="fs20">{{ `Gift Card Code: ${giftDataUnserialize.code}` }}</p>
            <p class="fs20">{{ `Gift Card DNI: ${giftDataUnserialize.dni}` }}</p>
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
import { Deadline, Convert, UInt64 } from 'tsjs-xpx-chain-sdk'

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
    },

    isGift: Boolean
  },

  data () {
    return {
      moduleName: 'Inner Transaction',
      fee: 0,
      timestamp: 0,
      block: 0,
      msgGiftActive: false,
      giftDataUnserialize: {}
    }
  },

  methods: {
    getAmount (item) {
      console.log('AQUI', item)
      let totalXPX = 0
      if (item.mosaics && item.mosaics.length !== 0) {
        item.mosaics.forEach(el => {
          console.log(el)
          if (el.id.toHex() === this.$config.coin.mosaic.id) {
            totalXPX = el.amount.compact()
          } else if (el.id.toHex() === this.$config.coin.namespace.id) {
            totalXPX = el.amount.compact()
          }
        })
      }
      this.calculateFee(item)
      return this.$utils.fmtAmountValue(totalXPX)
    },

    async calculateFee (item) {
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
    },

    unSerialize (hex) {
      const dataUin8 = Convert.hexToUint8(hex)

      const codeUin8 = new Uint8Array(8)
      const dniUin8 = new Uint8Array(8)

      codeUin8.set(new Uint8Array(dataUin8.subarray(0, 8)), 0)
      dniUin8.set(new Uint8Array(dataUin8.subarray(8, 16)), 0)

      const code = UInt64.fromHex(Convert.uint8ToHex(codeUin8))
      const dni = UInt64.fromHex(Convert.uint8ToHex(dniUin8))
      this.giftDataUnserialize.code = code.toHex()
      this.giftDataUnserialize.dni = dni.compact()
    }
  },

  watch: {
    params (nv, ov) {
      if (nv.transaction !== null) {
        try {
          const tmpMsj = JSON.parse(nv.transaction.message.payload)
          if (nv.transaction.message.type === 0 && tmpMsj.type === 'gift') {
            console.log('GIFT', tmpMsj)
            this.unSerialize(tmpMsj.msg)
            this.msgGiftActive = true
            nv.transaction.message.payload = 'Gift Card'
          }
        } catch (error) {
          console.log('Simple Msg')
        }
      }
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
