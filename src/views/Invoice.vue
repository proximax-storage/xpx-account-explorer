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

          <div class="box-grey mb-10">
            <p class="title txt-left">Amount XPX</p>
            <input type="text" class="field mb-10 txt-right" placeholder="Amount XPX" maxlength="20" @keyup="formatAmount()" v-model="amount">
          </div>

          <div class="mb-10 mt-10 box-grey">
            <p class="value mb-10">Amount XPX</p>
            <h1 class="m-0">{{ (formatedAmount !== '0') ? formatedAmount : '0.000000' }}</h1>
            <div class="fold">
              <input type="button" value="Generate" v-if="activeButton" class="proximax-btn">
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
      publicKeyValid: false
    }
  },

  mounted () {
    this.analyzeRoute()
  },

  methods: {
    analyzeRoute () {
      let params = this.$route.params

      if (params.view === 'inapp') {
        console.log('Invoice In App')
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

      let realAmount = this.extractRealAmount(this.amount)
      console.log('Result', realAmount)
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
    }
  },

  computed: {
    activeButton () {
      let isActive = false

      if (this.firstValid === true && this.lastValid === true && this.publicKeyValid === true) {
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
