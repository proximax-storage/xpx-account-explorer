<template>
  <div class="Invoice">
    <invoice-logo v-if="bannerOutApp === true"/>

    <module-header :name="moduleName"/>

    <div class="invoice-container">
      <div class="box-orange mb-10">
        Generate your invoice!, complete the form and download the file.
      </div>

      <h1 class="header-title txt-center">Invoice Form</h1>

      <div class="mb-10">
        <form action="">
          <div class="box-grey mb-10">
            <p class="title txt-left">First Name</p>
            <input type="text" class="field mb-10" placeholder="First name" v-model="first">
            <div class="search-error" v-if="firstError">Invalid First Name (2-10 characters / No spaces)</div>
          </div>

          <div class="box-grey mb-10">
            <p class="title txt-left">Last Name</p>
            <input type="text" class="field mb-10" placeholder="Last name" v-model="last">
            <div class="search-error" v-if="lastError">Invalid Last Name (2-10 characters / No spaces)</div>
          </div>

          <div class="box-grey mb-10">
            <p class="title txt-left">Public Key</p>
            <input type="text" class="field mb-10" placeholder="Public Key" v-model="publicKey">
            <div class="search-error" v-if="publicKeyError">Invalid Public Key (64 characters / Hexadecimal)</div>
          </div>

          <!-- <div class="box-grey mb-10">
            <p class="title txt-left">Description</p>
            <input class="field mb-10" placeholder="Invoice Message" maxlength="1024" v-model="message">
          </div> -->

          <div class="box-grey mb-10">
            <p class="title txt-left">Amount XPX</p>
            <input type="text" class="field mb-10 txt-right" placeholder="Amount XPX" maxlength="20" @keyup="formatAmount()" v-model="amount">
          </div>

          <div class="mb-10 mt-10 box-grey">
            <p class="value mb-10">Amount XPX</p>
            <h1 class="m-0">{{ (formatedAmount !== '0') ? formatedAmount : '0.000000' }}</h1>
            <div class="fold">
              <input type="button" value="Generate" v-if="activeButton" class="proximax-btn" @click="generateInvoice">
              <input type="button" value="Generate" v-if="!activeButton" class="proximax-btn-disabled">
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import InvoiceLogo from '@/components/Invoice/invoice-logo'
import ModuleHeader from '@/components/Global/module-header'
import { Address } from 'tsjs-xpx-chain-sdk'
import axios from 'axios'
import JsPdf from 'jspdf'
import JsZip from 'jszip'
import { saveAs } from 'file-saver'
export default {
  name: 'Invoice',

  components: {
    InvoiceLogo,
    ModuleHeader
  },

  data () {
    return {
      bannerOutApp: false,
      moduleName: 'Invoice',
      amount: null,
      formatedAmount: null,

      first: '',
      firstError: false,
      firstValid: false,

      last: '',
      lastError: false,
      lastValid: false,

      publicKey: '',
      publicKeyError: false,
      publicKeyValid: false,

      message: '',
      amountValid: false,
      imgInvoice: null,
      dateForm: null,
      randomNro: null,
      realAmount: null,
      zip: new JsZip()
    }
  },

  mounted () {
    this.analyzeRoute()
  },

  methods: {
    analyzeRoute () {
      let params = this.$route.params

      if (params.view === 'inapp') {
      } else if (params.view === 'outapp') {
        this.bannerOutApp = true
        let viewContainer = document.querySelector('.view-container')
        let sidebar = document.querySelector('.app-sidebar')
        viewContainer.style = `padding-left: 0px`
        sidebar.style = `display: none`
      }
    },

    formatAmount () {
      if ([undefined, null, '0', 0, ''].includes(this.amount) === true) {
        this.amount = null
        this.formatedAmount = null
      }

      if (this.amount !== null && this.amount.search(/[^0-9]/g) > -1) {
        let result = this.amount.replace(/[^0-9]/g, '')
        this.amount = result
      }

      let newAmount = (this.amount / 1000000).toFixed(6)
      let parts = newAmount.split('.')
      let part1 = parts[0]
      let part2 = parts[1]

      if (part1.length > 3) {
        part1 = part1.split('').reverse()
        let result = []

        part1.forEach((el, index) => {
          if ([3, 6, 9].includes(index) === true) {
            result.push(',')
          }

          result.push(el)
        })

        part1 = result.reverse().join('')
      }

      this.formatedAmount = `${part1}.${part2}`
      this.amount = `${part1}.${part2}`
      this.realAmount = this.extractRealAmount(this.amount)
      console.log(this.realAmount)
    },

    isHex (value) {
      let regex = /^[0-9A-Fa-f]+$/
      return regex.test(value)
    },

    extractRealAmount (amount) {
      let result = null
      if (amount.search(',') > -1) {
        result = amount.split(',').join('')
      }

      if (result !== null && result.search('.') > -1) {
        result = result.split('.').join('')
      } else if (amount.search('.') > -1) {
        result = amount.split('.').join('')
      }

      return result
    },

    async buildPdf () {
      const date = new Date()
      this.dateForm = `${date.getFullYear()}-${('00' + (date.getMonth() + 1)).slice(-2)}-${('00' + (date.getDate())).slice(-2)}`
      this.randomNro = this.$utils.getRandom(7)
      const data = await axios.get('../../img/imgBase64.json')
      this.imgInvoice = data.data
      const doc = new JsPdf()
      doc.addImage(this.imgInvoice.imgInvoice, 'JPEG', 0, 0, 210, 160)
      // left, top
      doc.setFontSize(20)
      doc.text(161, 19, `PRX-${this.randomNro}`)
      doc.setFontSize(10)
      doc.text(6, 49, 'Recipient')
      doc.text(6, 77, 'Description')
      doc.text(98, 51, 'Amount')
      doc.text(98, 77, 'Wallet Address')
      doc.setFontSize(22)
      doc.text(6, 58, `${this.first} ${this.last}`)
      doc.setFontSize(20)
      doc.text(98, 63, `XPX ${this.formatedAmount}`)
      // splice
      const address = Address.createFromPublicKey(this.publicKey, this.$config.network.number).pretty()
      const address1 = address.slice(0, 25)
      const address2 = address.slice(25, 46)
      doc.setFontSize(18)
      doc.text(98, 90, address1)
      doc.text(98, 96, address2)
      doc.setFontSize(11)
      doc.text(6, 82, '')
      doc.setFontSize(12)
      doc.text(45, 147, 'This certificate is only a confirmations of your payment request.')
      doc.text(30, 152, 'It does not generate any obligation of its execution until verifying its  authenticity')
      doc.text(25, 159, 'ProximaX LTD (117029). Suite 7, Hadfield House, Library Street, Gibraltar, GX11 1AA.')
      const filePdfname = `Invoice -- Nro ${this.randomNro} -- Date ${this.dateForm.toString()}.pdf`
      this.zip.file(filePdfname, doc.output('blob'))
      // doc.save('sample.pdf')
    },

    builSCV () {
      const rows = [
        ['RECIPIENT', 'MESSAGE', 'AMOUNT'],
        [Address.createFromPublicKey(this.publicKey, this.$config.network.number).pretty(), '', this.realAmount]
      ]
      const data = this.exportToCsv('file.csv', rows)
      const filePdfname = `Invoice -- Nro ${this.randomNro} -- Date ${this.dateForm.toString()}.csv`
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8' })
      this.zip.file(filePdfname, blob)
    },

    generateInvoice () {
      let tmpObj = {
        active: true,
        text: 'Downloading file'
      }
      this.$store.dispatch('changeLoaderState', tmpObj)
      this.buildPdf()
      this.builSCV()
      setTimeout(() => {
        let tmpObj = {
          active: false,
          text: ''
        }
        if (Object.keys(this.zip.files).length > 1) {
          this.zip.generateAsync({
            type: 'blob'
          }).then((content) => {
            this.$store.dispatch('changeLoaderState', tmpObj)
            saveAs(content, `Invoice -- Nro ${this.randomNro} -- Do not Edit -- ${this.dateForm}.zip`)
            this.clearForm()
          })
        }
      }, 1000)
    },

    exportToCsv (filename, rows) {
      let csvFile = ''
      for (let i = 0; i < rows.length; i++) {
        csvFile += this.processRow(rows[i])
      }
      return csvFile
    },

    processRow (row) {
      let finalVal = ''
      for (let j = 0; j < row.length; j++) {
        let innerValue = row[j] === null ? '' : row[j].toString()
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString()
        }
        let result = innerValue.replace(/"/g, '""')
        if (result.search(/("|,|\n)/g) >= 0) {
          result = '"' + result + '"'
        }
        if (j > 0) {
          finalVal += ','
        }
        finalVal += result
      }
      return finalVal + '\n'
    },

    clearForm () {
      this.first = ''
      this.firstError = false
      this.firstValid = false
      this.last = ''
      this.lastError = false
      this.lastValid = false
      this.publicKey = ''
      this.publicKeyError = false
      this.publicKeyValid = false
      this.activeButton = false
      this.amountValid = false
      this.amount = ''
      this.formatedAmount = null
    }
  },

  watch: {
    first (nv, ov) {
      if (nv.length >= 2 && nv.length <= 11) {
        this.firstError = false
        this.first = nv.trim()
        this.firstValid = true
      } else {
        this.firstError = true
        this.first = nv.trim()
        this.firstValid = false
      }

      if (nv === '') {
        this.firstError = false
        this.firstValid = false
      }
    },

    last (nv, ov) {
      if (nv.length >= 2 && nv.length <= 11) {
        this.lastError = false
        this.last = nv.trim()
        this.lastValid = true
      } else {
        this.lastError = true
        this.last = nv.trim()
        this.lastValid = false
      }

      if (nv === '') {
        this.lastError = false
        this.lastValid = false
      }
    },

    publicKey (nv, ol) {
      if (nv.length === 64 && this.isHex(nv) === true) {
        this.publicKeyError = false
        this.publicKeyValid = true
      } else {
        this.publicKeyError = true
        this.publicKeyValid = false
      }

      if (nv === '') {
        this.publicKeyError = false
        this.publicKeyValid = false
      }
    },

    amount (nv, ol) {
      if (Number(this.extractRealAmount(nv)) > 0) {
        this.amountValid = true
      } else {
        this.amountValid = false
      }
    },

    message (nv, ol) {
      console.log(nv)
    }
  },

  computed: {
    activeButton () {
      let isActive = false

      if (this.firstValid === true && this.lastValid === true && this.publicKeyValid === true && this.amountValid === true) {
        isActive = true
      }

      return isActive
    }
  }
}
</script>

<style scoped>
  @import url('../style.css');
</style>
