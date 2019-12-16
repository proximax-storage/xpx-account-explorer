<template>
  <div class="transactions">
    <module-header :name="moduleName"/>

    <div class="transaction-cont">
      <div class="box-grey mb-10">
        <h1 class="title txt-left">File selection</h1>
        <form action="">
          <input type="file" id="fileSelect" style="display: none" @change="loadCSV($event)">
          <label for="fileSelect" class="proximax-btn">Choose file</label>
          <div class="mt-10 fold" v-if="fileName !== null">{{ fileName }}</div>
        </form>
      </div>

      <div class="box-orange mb-10" v-if="myAccounts === null">
        <h1 class="title txt-left">Account selection</h1>
        <p>You need to register an account to make transactions.</p>
      </div>

      <div class="box-grey mb-10" v-if="myAccounts !== null">
        <h1 class="title txt-left">Account selection</h1>
        <select name="Select Account" id="chooseAcc" placeholder="Select Account" class="proximax-btn-white"  @change="searchSender" v-model="accountName">
          <option :value="null">
            Select Account
          </option>

          <option v-for="(item, index) in myAccounts" :key="index" :value="item.name">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="box-grey mb-10" v-if="accountMultisign !== null">
        <h1 class="title txt-left">Account selection (Multisign)</h1>
        <select name="Select Account" id="chooseAcc" placeholder="Select Account" class="proximax-btn-white"  @change="searchSenderMultisign" v-model="accountPkMultisign">
          <option :value="null">
            Select Account
          </option>

          <option v-for="(item, index) in accountMultisign" :key="index" :value="item.publicKey">
            {{ $utils.maskAddress(item.address.address) }}
          </option>
        </select>
      </div>

      <div v-if="fileExist !== null">
        <h1 class="title txt-left">File table</h1>
        <table class="table-setting">
          <tr>
            <th v-for="(keyx, index) in parse_header" @click="sortBy(keyx)" class="txt-left" :key="index">{{ keyx }}</th>
          </tr>

          <tr v-for="(csv, index) in parse_csv" :key="index">
            <td v-for="(keys, index) in parse_header" :key="index" class="txt-left">
              <span v-if="keys === 'AMOUNT'" v-html="$utils.fmtAmountValue(csv[keys])"></span>
              <span v-else>{{csv[keys]}}</span>
            </td>
          </tr>
        </table>
      </div>

      <div class="fold box-orange" v-if="fileExist === null">
        <div>
          <h1 class="title txt-left">Example (CSV FILE)</h1>
          <table class="table-setting">
            <tr>
              <th class="txt-left">Recipient</th>
              <th class="txt-left">Message</th>
              <th class="txt-left">Amount</th>
            </tr>

            <tr>
              <td class="txt-left">VDG2GN-DH7AED-67HTHX-WBOCD6-ZIL3XT-XFTVYE-PL3X</td>
              <td class="txt-left">Sample message</td>
              <td class="txt-left">20100000</td>
            </tr>

            <tr>
              <td class="txt-left">VDG2GN-DH7AED-67HTHX-WBOCD6-ZIL3XT-XFTVYE-Z6DV</td>
              <td class="txt-left">Sample message</td>
              <td class="txt-left">100000</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div class="mt-10 fold" v-if="selectedSender !== null">
      <div class="box-grey">
        <div class="mb-10">
          <input type="password" class="field" placeholder="Enter account password" v-model="accountPassword" @keyup="validatePassword" @unfocus="validatePassword" @change="validatePassword">
        </div>
        <div>
          <input v-if="buttonSendActive === true" type="button" class="proximax-btn" @click="sendTx" value="Send">
          <input v-if="buttonSendActive === false" type="button" class="proximax-btn-disabled" value="Send">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import { Account, TransactionType, PublicAccount } from 'tsjs-xpx-chain-sdk'

export default {
  name: 'Transactions',

  components: {
    ModuleHeader
  },

  data () {
    return {
      moduleName: 'Transactions',
      fileName: null,
      fileExist: null,
      sortOrders: {},
      parse_csv: [],
      parse_header: [],
      myAccounts: JSON.parse(this.$localStorage.get('myAccounts')),
      accountMultisign: null,
      selectedSender: null,
      accountName: null,
      accountPkMultisign: null,
      buttonSendActive: false,
      accountPassword: '',
      typeTx: null,
      hashLockSigned: null,
      signedTransaction: null
    }
  },

  filters: {
    capitalize: (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },

  methods: {
    readFile (event) {
      if ([undefined, null].includes(event.target.files) === false) {
        this.fileName = event.target.files[0].name
      }
    },

    csvJSON (csv) {
      let lines = csv.split('\n')
      let result = []
      let headers = lines[0].split(',')
      headers = headers.map((x) => x.toUpperCase())
      this.parse_header = lines[0].split(',')
      this.parse_header = this.parse_header.map((x) => x.toUpperCase())

      lines[0].split(',').forEach((key) => {
        this.sortOrders[key] = 1
      })

      lines.map((line, indexLine) => {
        if (indexLine < 1) return // Jump header line
        let obj = {}
        let currentline = line.split(',')
        headers.map((header, indexHeader) => {
          obj[header] = currentline[indexHeader]
        })
        result.push(obj)
      })
      result.pop() // remove the last item because undefined values
      return result// JavaScript object
    },

    loadCSV (e) {
      let tmpObj = {
        active: true,
        type: 'error',
        title: 'load failed',
        message: 'file not allowed'
      }

      if ([undefined, null].includes(e.target.files) === false) {
        this.fileName = e.target.files[0].name
      }

      if (e.target.files[0].type !== 'text/csv') {
        this.parse_csv = []
        return this.$store.dispatch('newNotification', tmpObj)
      }

      if (window.FileReader) {
        let reader = new FileReader()
        reader.readAsText(e.target.files[0])
        // Handle errors load
        reader.onload = (event) => {
          let csv = event.target.result
          this.parse_csv = this.csvJSON(csv)
          let validateHeader = this.$utils.validateHeaderCsv(this.parse_header)
          if (!validateHeader) {
            tmpObj.message = 'Invalid CSV header, see example'
            this.parse_csv = []
            return this.$store.dispatch('newNotification', tmpObj)
          }
          console.log(this.parse_csv)
          let validateDataCsv = this.$utils.validateDataCsv(this.parse_csv, this.$config)

          if (validateDataCsv) {
            console.log('normal')
          } else {
            tmpObj.message = 'File invalid'
            this.$store.dispatch('newNotification', tmpObj)
            this.parse_csv = []
          }

          if (this.parse_csv.length > 0) {
            this.fileExist = 'true'
          } else {
            this.fileExist = null
          }
        }

        reader.onerror = function (evt) {
          tmpObj.message = 'Cannot read file !'
          if (evt.target.error.name === 'NotReadableError') {
            this.$store.dispatch('newNotification', tmpObj)
          }
        }
      } else {
        tmpObj.message = 'FileReader are not supported in this browser.'
        this.$store.dispatch('newNotification', tmpObj)
      }
    },

    sendTx () {
      let tmpObj = {
        active: true,
        type: 'error',
        title: 'Invalid file',
        message: 'upload a file'
      }
      try {
        let decryptAccount = this.$utils.decrypt(this.selectedSender.encrypted, this.accountPassword)
        const signer = Account.createFromPrivateKey(decryptAccount, this.$config.network.number)
        console.log(signer)
        if (this.parse_csv.length > 0) {
          this.buildTx(signer)
        } else {
          this.$store.dispatch('newNotification', tmpObj)
        }
        this.accountPassword = ''
        this.buttonSendActive = false
      } catch (error) {
        this.accountPassword = ''
        this.buttonSendActive = false
        console.warn(error)
        let tmpObj = {
          active: true,
          type: 'error',
          title: 'Invalid Password',
          message: 'Your password is wrong, please check and try again'
        }
        this.$store.dispatch('newNotification', tmpObj)
      }
    },

    buildTx (signer) {
      let txs = []
      let signerAccount = signer
      let publicAccountToAggregate = null
      for (let element of this.parse_csv) {
        txs.push({ signer: signerAccount, tx: this.$utils.createTxTransfer(element['RECEIPIENT'], element['AMOUNT'], element['MESSAGE'], this.$config) })
      }
      if (this.typeTx === TransactionType.AGGREGATE_COMPLETE) {
        publicAccountToAggregate = signerAccount.publicAccount
      }
      if (this.typeTx === TransactionType.AGGREGATE_BONDED) {
        publicAccountToAggregate = PublicAccount.createFromPublicKey(this.accountPkMultisign, this.$config.network.number)
      }
      const generationHash = '56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9'
      this.signedTransaction = this.$utils.buildTx(signerAccount, publicAccountToAggregate, txs, this.typeTx, generationHash, [], this.$config)
      if (this.typeTx === TransactionType.AGGREGATE_COMPLETE) {
        this.announceTx(this.signedTransaction.sign)
      }
      if (this.typeTx === TransactionType.AGGREGATE_BONDED) {
        console.log('buildHashLockTransaction')
        this.hashLockSigned = this.$utils.buildHashLockTransaction(this.signedTransaction.sign, signerAccount, generationHash, this.$config)
        console.log('oooo', this.hashLockSigned)
        this.announceTx(this.hashLockSigned)
      }
    },
    announceTx (signedTransaction) {
      this.$provider.transactionHttp.announce(signedTransaction).subscribe(x => {
        setTimeout(() => {
          console.log('announceTx', x)
        }, 1000)
      }, err => {
        console.log(err)
      })
    },
    announceAggregateBonded (signedTransaction) {
      this.$provider.transactionHttp.announceAggregateBonded(signedTransaction).subscribe(x => {
        setTimeout(() => {
          console.log('announceAggregateBonded', x)
        }, 1000)
      }, err => {
        console.log(err)
      })
    },
    searchSender () {
      if (this.accountName !== null) {
        this.selectedSender = this.$utils.getAccountByName(this.accountName)
        console.log(this.selectedSender)
        // console.log('this.selectedSender', this.$utils.validateAccountTypeTx(this.selectedSender))
        const type = this.$utils.validateAccountTypeTx(this.selectedSender)
        console.log('type', type)
        if (!type.typeTx) {
          this.accountMultisign = null
          return console.log('isMuntisig')
        }
        if (type.typeAccount === 1) {
          this.accountMultisign = this.selectedSender.multisigInfo.multisigAccounts
        }
        this.typeTx = type.typeTx
      } else {
        this.accountMultisign = null
        this.selectedSender = null
        this.accountPkMultisign = null
      }
    },
    searchSenderMultisign () {
      console.log(this.accountPkMultisign)
    },
    validatePassword () {
      if (this.accountPassword.length >= 8 && this.accountPassword.length <= 15) {
        this.buttonSendActive = true
      } else {
        this.buttonSendActive = false
      }
    }
  },
  computed: {
    getStatusTx () {
      return this.$store.state.txStatusData
    }
  },
  watch: {
    getStatusTx (newStatusTransaction, oldStatusTransaction) {
      if (newStatusTransaction !== null && newStatusTransaction !== undefined && this.hashLockSigned !== null) {
        const match = newStatusTransaction['hash'] === this.hashLockSigned.hash
        if (newStatusTransaction['type'] === 'confirmed' && match) {
          this.hashLockSigned = null
          setTimeout(() => {
            console.log('announceAggregateBonded')
            this.announceAggregateBonded(this.signedTransaction.sign)
          }, 20000)
          console.log('confirmado papa')
        } else if (newStatusTransaction['type'] === 'status' && match) {
          this.hashLockSigned = null
        }
      }
    }
  }
}
</script>

<style scoped>
 @import url('../style.css');
</style>
