<template>
  <div class="customizing">
    <module-header :name="moduleName"/>
    <node-info/>

    <div class="fold">
      <div class="box-orange mb-10">
        In this area you can add accounts to monitor,
      </div>

      <form class="box-grey">
        <input type="text" class="field" placeholder="Enter PublicKey" v-model="inputValue" @keyup="validate" @focusout="validate" @change="validate">
        <div class="search-error" v-if="errorActive">{{ errorMessage }}</div>
        <input type="submit" class="proximax-btn" v-if="valid === true" @click.prevent="addAccount" value="Add Account">
        <input type="submit" class="proximax-btn-disabled" v-if="valid === false" @click.prevent="performSearch" value="Add Account">
      </form>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import NodeInfo from '@/components/Global/app-node-info'
import { PublicAccount } from 'tsjs-xpx-chain-sdk'

export default {
  name: 'Customizing',

  components: {
    ModuleHeader,
    NodeInfo
  },

  data () {
    return {
      moduleName: 'Customizing',
      errorActive: false,
      errorMessage: '',
      inputValue: '',
      valid: false
    }
  },

  methods: {
    isHex (value) {
      let regex = /^[0-9A-Fa-f]+$/
      return regex.test(value)
    },

    validate () {
      let valid = false
      if (this.inputValue === '') {
        this.errorActive = false
        this.errorMessage = 'Invalid PublicKey'
        valid = false
      } else if (this.inputValue.length === 64 && this.isHex(this.inputValue) === true) {
        this.errorActive = false
        this.errorMessage = ''
        valid = true
      } else {
        this.errorActive = true
        this.errorMessage = 'Invalid PublicKey'
        valid = false
      }

      this.valid = valid
    },

    addAccount () {
      let myAccounts = this.$localStorage.get('myAccounts')
      if (this.valid === true) {
        let publicAccount = PublicAccount.createFromPublicKey(this.inputValue, this.$config.network.number)
        let newAccount = {
          publicKey: publicAccount.publicKey,
          address: publicAccount.address.address,
          prettyAddress: publicAccount.address.pretty(),
          networktype: publicAccount.address.networkType
        }

        let tmpObj = {
          active: true,
          type: 'success',
          title: 'Account added',
          message: 'Your account has been successfully added'
        }

        if (myAccounts === null) {
          this.$localStorage.set('myAccounts', [newAccount])
          this.$store.dispatch('newNotification', tmpObj)
        } else {
          myAccounts = JSON.parse(myAccounts)
          myAccounts.push(newAccount)
          this.$localStorage.set('myAccounts', myAccounts)
          this.$store.dispatch('newNotification', tmpObj)
        }

        this.inputValue = ''
        this.valid = false
      }
    }
  }
}
</script>
