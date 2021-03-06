<template>
  <div class="customizing">
    <module-header :name="moduleName"/>
    <node-info/>

    <div class="fold">
      <div class="box-orange mb-10">
        <p>Add accounts here to monitor them and to enable transfer functionality.</p>
      </div>

      <form class="box-grey mb-10">
        <input type="text" class="field" placeholder="Account Name" v-model="accountName" @keyup="validate" @focusout="validate" @change="validate">
        <input type="text" class="field" placeholder="Enter Private Key" v-model="inputValue" @keyup="validate" @focusout="validate" @change="validate">
        <div class="search-error" v-if="errorPublicKey">{{ errorPublicKeyMessage }}</div>
        <input type="password" class="field" placeholder="Enter Password (8 - 15 characters)" v-model="passwordInput" @keyup="validate" @focusout="validate" @change="validate">
        <div class="search-error" v-if="errorActive">{{ errorMessage }}</div>
        <input type="submit" class="proximax-btn mt-10" v-if="valid === true" @click.prevent="addAccount" value="Add Account">
        <input type="button" class="proximax-btn-disabled mt-10" v-if="valid === false"  value="Add Account">
      </form>
    </div>

    <div class="fold" v-if="myCustomAccounts === null || myCustomAccounts.length === 0">
      <h1 class="title txt-left">Custom Accounts</h1>
      <div class="box-grey">
        <p>You have not added a custom account yet!</p>
      </div>
    </div>

    <div class="fold" v-if="myCustomAccounts !== null && myCustomAccounts.length > 0">
      <h1 class="title txt-left">Custom Accounts</h1>
      <div class="box-grey mb-10" v-for="(item, index) in myCustomAccounts" :key="index">
        <p class="txt-left bold">{{ item.name }}</p>
        <p class="txt-left">{{ item.publicKey }}</p>
        <div class="mt-10"><input type="button" value="Delete Account" class="proximax-btn-red" @click="deleteAccount(item.name)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import NodeInfo from '@/components/Global/app-node-info'
import { Account } from 'tsjs-xpx-chain-sdk'

export default {
  name: 'Customizing',

  components: {
    ModuleHeader,
    NodeInfo
  },

  data () {
    return {
      moduleName: 'Accounts',

      accountName: '',

      passwordInput: null,
      errorActive: false,
      errorMessage: '',

      inputValue: '',
      errorPublicKey: false,
      errorPublicKeyMessage: '',

      valid: false,
      myCustomAccounts: JSON.parse(this.$localStorage.get('myAccounts'))
    }
  },

  methods: {
    isHex (value) {
      let regex = /^[0-9A-Fa-f]+$/
      return regex.test(value)
    },

    validate () {
      let passwordValid = false
      let privateKeyValid = false
      let valid = false
      this.errorPublicKey = false
      this.errorActive = false

      if (this.inputValue === '') {
        privateKeyValid = false
      } else if (this.inputValue.length === 64 && this.isHex(this.inputValue) === true) {
        privateKeyValid = true
      } else {
        privateKeyValid = false
      }

      if (this.passwordInput && this.passwordInput.length >= 8 && this.passwordInput.length <= 15) {
        passwordValid = true
      } else {
        passwordValid = false
      }

      if (passwordValid === false && privateKeyValid === true) {
        this.errorActive = true
        this.errorMessage = 'Invalid Password'
      } else if (privateKeyValid === false && passwordValid === true) {
        this.errorPublicKey = true
        this.errorPublicKeyMessage = 'Invalid Private Key'
      } else if ((passwordValid && privateKeyValid) === false) {
        this.errorActive = true
        this.errorPublicKey = true
        this.errorMessage = 'Invalid Password'
        this.errorPublicKeyMessage = 'Invalid Private Key'
      } else {
        this.errorActive = false
        this.errorMessage = ''
      }

      valid = (passwordValid && privateKeyValid)
      this.valid = valid
    },

    async addAccount () {
      let numberAccount = (this.myCustomAccounts === null) ? '1' : `${this.myCustomAccounts.length + 1}`

      if (this.valid === true) {
        let privateKey = this.inputValue
        let account = Account.createFromPrivateKey(privateKey, this.$config.network.number)
        let encrypted = this.$utils.encrypt(privateKey, this.passwordInput)

        try {
          let multisigInfo
          // GET MULTISIG INFO
          try {
            multisigInfo = await this.$provider.accountHttp.getMultisigAccountInfo(account.publicAccount.address).toPromise()
          } catch (multisigError) {
            console.warn('No multisig information')
            if (multisigError && multisigError.statusCode === 404) {
              multisigInfo = null
            }
          }

          let newAccount = {
            name: (this.accountName === '') ? `Account${numberAccount}` : this.accountName,
            publicKey: account.publicAccount.publicKey,
            address: account.publicAccount.address.address,
            encrypted: encrypted,
            multisigInfo: multisigInfo
          }

          let tmpObj = {
            active: true,
            type: 'success',
            title: 'Account added',
            message: 'Your account has been successfully added'
          }

          if (this.myCustomAccounts === null) {
            this.myCustomAccounts = [newAccount]
            this.$localStorage.set('myAccounts', JSON.stringify(this.myCustomAccounts))
            this.$store.dispatch('updateAccounts', this.myCustomAccounts)
            this.$store.dispatch('newNotification', tmpObj)
          } else {
            let finding = this.myCustomAccounts.find(el => el.publicKey === newAccount.publicKey)

            if ([undefined, null].includes(finding) === false) {
              throw String('Existing account')
            } else {
              this.myCustomAccounts.push(newAccount)
              this.$localStorage.set('myAccounts', JSON.stringify(this.myCustomAccounts))
              this.$store.dispatch('updateAccounts', this.myCustomAccounts)
              this.$store.dispatch('newNotification', tmpObj)
            }
          }

          this.$ws.close()
          setTimeout(() => {
            this.$ws.reconnect()
          }, 1000)

          this.accountName = ''
          this.passwordInput = ''
          this.inputValue = ''
          this.valid = false

          // window.location.reload()
        } catch (error) {
          let tmpObj = {
            active: true,
            type: 'error',
            title: 'Account declined',
            message: 'Your account is invalid or no information has been found'
          }

          if (error === 'Existing account') {
            tmpObj.message = 'This account has already been added'
          }

          this.$store.dispatch('newNotification', tmpObj)
        }
      }
    },

    deleteAccount (name) {
      console.log(name)
      this.$utils.deleteAccountByName(name)
      let newAccounts = JSON.parse(this.$localStorage.get('myAccounts'))
      this.$store.dispatch('updateAccounts', newAccounts)
      this.myCustomAccounts = newAccounts

      this.$ws.close()
      setTimeout(() => {
        this.$ws.reconnect()
      }, 1000)
      // window.location.reload()
    }
  }
}
</script>
