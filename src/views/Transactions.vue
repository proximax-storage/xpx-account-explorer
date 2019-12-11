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
            <th v-for="keyx in parse_header" @click="sortBy(keyx)"  class="txt-left"  v-bind:key="keyx" >  {{ keyx | capitalize }} </th>
          </tr>
          <tr v-for="csv in parse_csv" v-bind:key="csv">
            <td v-for="keys in parse_header" v-bind:key="keys">
              <span v-if="keys === 'AMOUNT'" v-html="$utils.fmtAmountValue(csv[keys])" >
              </span>
              <span v-else >
                {{csv[keys]}}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <div v-if="fileExist === null">
        <h1 class="title txt-left">Example (CSV FILE)</h1>
        <table class="table-setting">
          <tr>
            <th class="txt-left">Recipient</th>
            <th class="txt-left">message</th>
            <th class="txt-left">amount</th>
          </tr>
          <tr>
            <td class="txt-left">VDG2GN-DH7AED-67HTHX-WBOCD6-ZIL3XT-XFTVYE-PL3X</td>
            <td class="txt-left">sample message</td>
            <td class="txt-left">20100000</td>
          </tr>
           <tr>
            <td class="txt-left">VDG2GN-DH7AED-67HTHX-WBOCD6-ZIL3XT-XFTVYE-Z6DV</td>
            <td class="txt-left">sample message</td>
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
      moduleName: 'Transactions (CSV file)',
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
      var vm = this
      var lines = csv.split('\n')
      var result = []
      var headers = lines[0].split(',')
      headers = headers.map(function (x) { return x.toUpperCase() })
      vm.parse_header = lines[0].split(',')
      vm.parse_header = vm.parse_header.map(function (x) { return x.toUpperCase() })
      lines[0].split(',').forEach(function (key) {
        vm.sortOrders[key] = 1
      })
      lines.map(function (line, indexLine) {
        if (indexLine < 1) return // Jump header line
        var obj = {}
        var currentline = line.split(',')
        headers.map(function (header, indexHeader) {
          obj[header] = currentline[indexHeader]
        })
        result.push(obj)
      })
      result.pop() // remove the last item because undefined values
      return result// JavaScript object
    },
    loadCSV (e) {
      var vm = this
      let tmpObj = {
        active: true,
        type: 'error',
        title: 'load failed',
        message: 'file not allowed'
      }
      if ([undefined, null].includes(e.target.files) === false) {
        vm.fileName = e.target.files[0].name
      }
      if (e.target.files[0].type !== 'text/csv') {
        vm.parse_csv = []
        return vm.$store.dispatch('newNotification', tmpObj)
      }
      if (window.FileReader) {
        var reader = new FileReader()
        reader.readAsText(e.target.files[0])
        // Handle errors load
        reader.onload = function (event) {
          var csv = event.target.result
          vm.parse_csv = vm.csvJSON(csv)
          var validateHeader = vm.$utils.validateHeaderCsv(vm.parse_header)
          if (!validateHeader) {
            tmpObj.message = 'Invalid CSV header, see example'
            vm.parse_csv = []
            return vm.$store.dispatch('newNotification', tmpObj)
          }
          var validateDataCsv = vm.$utils.validateDataCsv(vm.parse_csv, vm.$config)
          if (validateDataCsv) {
            console.log('normal')
          } else {
            console.log('no papa')
          }
          if (vm.parse_csv.length > 0) {
            vm.fileExist = 'true'
          } else {
            vm.fileExist = null
          }
        }
        reader.onerror = function (evt) {
          tmpObj.message = 'Cannot read file !'
          if (evt.target.error.name === 'NotReadableError') {
            vm.$store.dispatch('newNotification', tmpObj)
          }
        }
      } else {
        tmpObj.message = 'FileReader are not supported in this browser.'
        vm.$store.dispatch('newNotification', tmpObj)
      }
    },
    sendTx () {
      const signer = Account.createFromPrivateKey('60B9442B1145357CED1FA956ED5843BF3C042154685D1A4DDCC1BE107E372050', this.$config.network.number)
      if (this.parse_csv.length > 0) {
        this.buildTx(signer)
      }
    },
    buildTx (signer){
      let txs = []
      for (let element of this.parse_csv) {
        txs.push({ signer: signer, tx: this.$utils.createTxTransfer(element['RECEIPIENT'], element['AMOUNT'], element['MESSAGE'], this.$config) })
      }
      const generationHash = '56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9'
      console.log('generationHash:', generationHash)
    }
  }
}
</script>

<style scoped>
 @import url('../style.css');
</style>
