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

        <div class="box-grey txt-left mb-10" v-if="this.transaction.recipient">
          <p class="bold">Recipient: </p>
          <p>{{ this.transaction.recipient.pretty() }}</p>
        </div>

        <div class="box-grey txt-left mb-10">
          <p class="bold">Signature: </p>
          <p>{{ this.transaction.signature }}</p>
        </div>
      </div>

      <div>
        <div class="box-white txt-left">
          <p class="bold fs14">Timestamp: </p>
          <p class="fs14">{{ timestamp }}</p>
        </div>

        <div class="box-white txt-left" v-if="[16961, 16705].includes(transaction.type) === false">
          <span class="bold fs20">Amount: </span>
          <span class="fs20" v-html="$utils.fmtAmountValue(amount)"></span>
        </div>

        <div class="box-white txt-left">
          <span class="bold fs20">Fee: </span>
          <span class="fs20" v-html="$utils.fmtAmountValue(fee)"></span>
        </div>

        <div class="box-white txt-left" v-if="message !== null">
          <span class="bold">Message: </span>
          <span class="fs20">{{ this.message }}</span>
        </div>

        <div class="box-white txt-left" v-if="messageGift !== null">
          <span class="bold">Message: </span>
          <span class="fs14">Gift Card</span>
        </div>

        <div class="box-white txt-left" v-if="messageGift !== null">
          <p class="bold">Gift Card Message: </p>
          <p class="fs14 value">{{ `Card ID: ${code}` }}</p>
          <p class="fs14 value">{{ `Card Message (National ID): ${dni}` }}</p>
        </div>

        <div class="box-white txt-left" v-if="[null, undefined].includes(destination) === false">
          <p class="bold">Destination: </p>
          <p class="fs14 value">{{ destination }}</p>
        </div>

        <div class="box-white txt-left" v-if="[null, undefined].includes(distributor) === false">
          <p class="bold">Distribuitor: </p>
          <p class="fs14 value">{{ distributor }}</p>
        </div>

        <div class="box-white txt-left" v-if="[null, undefined].includes(default1) === false">
          <p class="bold">Recipient 1: </p>
          <p class="fs14 value">{{ default1 }}</p>
        </div>

        <div class="box-white txt-left" v-if="[null, undefined].includes(default2) === false">
          <p class="bold">Recipient 2: </p>
          <p class="fs14 value">{{ default2 }}</p>
        </div>

        <div class="box-white txt-left mb-10">
          <p class="bold fs14">Block Heigh: </p>
          <p class="fs14">{{ block }}</p>
        </div>

        <!-- <div class="box-white txt-left mb-10">
          <p class="bold fs14">Card Quantity (per card): </p>
          <p class="fs14" v-html="$utils.fmtAmountValue(cardAmount)"></p>
        </div> -->

        <div class="box-white txt-left mb-10">
          <p class="bold fs14">MosaicID: </p>
          <p class="fs14">{{ cardMosaicID }}</p>
        </div>

        <div class="box-white txt-left mb-10">
          <p class="bold fs14">Mosaic Amount (per card): </p>
          <p class="fs14" v-html="cardMosaicAmount"></p>
        </div>

        <div class="box-white txt-left mb-10">
          <p class="bold fs14">Total Cards: </p>
          <p class="fs14">{{ totalCards }}</p>
        </div>
      </div>
    </div>

    <div class="inner" v-if="innerTrans !== null && messageGift === null">
      <h1 class="title txt-left mb-10">{{ `Inner ${innName}` }}</h1>
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

    <inner-modal :params="innerParams" @closeTransaction="modalCom" :isGift="messageGift"/>

  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import AppSearchbar from '@/components/Global/app-searchbar'
import AppFold from '@/components/Global/app-fold'
import NodeInfo from '@/components/Global/app-node-info'
import { Deadline, Id } from 'tsjs-xpx-chain-sdk'
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
      innName: 'Transactions',
      nodeInfoVisible: false,
      transaction: null,
      timestamp: null,
      block: null,
      amount: 0,
      fee: 0,
      innerTrans: null,
      innerParams: null,
      message: null,
      messageGift: null,
      code: null,
      dni: null,
      destination: null,
      distributor: null,
      default1: null,
      default2: null,
      mosaicId: null,
      cardAmount: null,
      cardMosaicID: null,
      cardMosaicAmount: null,
      totalCards: null
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

        this.getMessage(this.transaction)

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
    },

    getMessage (transaction) {
      console.log(transaction.message)
      if ([undefined, null].includes(transaction.message) === false) {
        if (transaction.message.type === 0) {
          this.message = transaction.message.payload
        } else {
          this.message = 'Encrypted'
        }
      } else {
        this.message = null
      }
    },

    async getMosaicDivisibility (mosaic) {
      console.log(mosaic)
      let id = Id.fromHex(mosaic.id)
      try {
        let mosaicInfo = await this.$provider.mosaicHttp.getMosaic(id).toPromise()
        console.log(mosaicInfo)
        this.cardMosaicAmount = (mosaicInfo.divisibility > 0) ? this.$utils.fmtDivisibility(mosaic.amount, mosaicInfo.divisibility) : mosaic.amount
      } catch (error) {
        console.log(error)
      }
    }
  },

  watch: {
    transaction (nv, ov) {
      let recipients = []
      let currentAccount = this.$store.getters.getMyAccounts

      if ([16961, 16705].includes(nv.type)) {
        nv.innerTransactions.forEach(elem => {
          try {
            const msgOne = JSON.parse(elem.message.payload)
            console.log('Message', msgOne)

            if (msgOne.type === 'gift') {
              const data = this.$utils.unSerialize(msgOne.msg)
              this.code = data.code
              this.dni = data.dni
              this.messageGift = true
              recipients.push(elem.recipient.address)
            }
          } catch (error) {
            console.log('Simple Msg')
          }
        })

        console.log(currentAccount)
        if (currentAccount != null) {
          currentAccount.forEach(elem => {
            console.log(elem)
            console.log(this.destination)
            console.log(this.distributor)

            if (recipients.includes(elem.address)) {
              this.destination = `${elem.address} (${elem.name})`
              let tmpIndex = recipients.indexOf(elem.address)
              recipients.splice(tmpIndex, 1)
              this.distributor = recipients[0]
            }
          })

          if (this.destination === null || this.distributor === null) {
            this.default1 = recipients[0]
            this.default2 = recipients[1]
          }
        } else {
          console.log('AQUI')
          console.log(recipients)
          this.default1 = recipients[0]
          this.default2 = recipients[1]
        }

        console.log(this.destination, this.distributor)
      }

      if ([16961, 16705].includes(nv.type)) {
        let mosaics = []
        this.totalCards = nv.innerTransactions.length - 1
        nv.innerTransactions.forEach((elem, index) => {
          if (elem.mosaics.length > 0) {
            console.log(elem.mosaics)
            let tmpObj1 = {
              id: elem.mosaics[0].id.toHex(),
              amount: elem.mosaics[0].amount.compact()
            }

            let tmpObj2 = {
              id: elem.mosaics[1].id.toHex(),
              amount: elem.mosaics[1].amount.compact()
            }

            mosaics.push(tmpObj1)
            mosaics.push(tmpObj2)
          }

          try {
            const msgOne = JSON.parse(elem.message.payload)
            console.log('Message', msgOne)

            if (msgOne.type === 'giftCard') {
              this.innName = 'Gift Cards'
              recipients.push(elem.recipient.address)
            }
          } catch (error) {
            console.log('Simple Msg')
          }
        })

        console.log(this.$config.coin.mosaic.id)

        let xpx = mosaics.find(elem => elem.id === this.$config.coin.mosaic.id)
        this.cardAmount = xpx.amount
        let other = mosaics.find(elem => elem.id !== this.$config.coin.mosaic.id)
        this.cardMosaicID = other.id
        this.getMosaicDivisibility(other)
      }
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
