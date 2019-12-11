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

      <div v-if="fileExist === null">
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
    <div class="mt-10 fold">
      <input type="button" @click="sendTx" value="Send">
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import { Account } from 'tsjs-xpx-chain-sdk'
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
      parse_header: []
    }
  },
  filters: {
    capitalize: function (str) {
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

          let validateDataCsv = this.$utils.validateDataCsv(this.parse_csv, this.$config)

          if (validateDataCsv) {
            console.log('normal')
          } else {
            console.log('no papa')
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
      const signer = Account.createFromPrivateKey('60B9442B1145357CED1FA956ED5843BF3C042154685D1A4DDCC1BE107E372050', this.$config.network.number)
      if (this.parse_csv.length > 0) {
        let txs = []
        for (let element of this.parse_csv) {
          txs.push({ signer: signer, tx: this.$utils.createTxTransfer(element['RECEIPIENT'], element['AMOUNT'], element['MESSAGE'], this.$config) })
        }
        console.log('txstxs:', txs)
      }
    }
  }
}
</script>

<style scoped>
 @import url('../style.css');
</style>
