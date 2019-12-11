<template>
  <div class="customizing">
    <module-header :name="moduleName"/>
    <node-info/>

    <div class="fold">
      <div class="box-orange mb-10">
        Add Accounts here to monitor them
      </div>

      <form class="box-grey mb-10">
        <input type="text" class="field" placeholder="Account Name" v-model="accountName" @keyup="validate" @focusout="validate" @change="validate">
        <input type="text" class="field" placeholder="Enter Private Key" v-model="inputValue" @keyup="validate" @focusout="validate" @change="validate">
        <input type="password" class="field" placeholder="Enter Password" v-model="passwordInput" @keyup="validate" @focusout="validate" @change="validate">
        <div class="search-error" v-if="errorActive">{{ errorMessage }}</div>
        <input type="submit" class="proximax-btn" v-if="valid === true" @click.prevent="addAccount" value="Add Account">
        <input type="button" class="proximax-btn-disabled" v-if="valid === false"  value="Add Account">
      </form>
    </div>

    <div class="fold" v-if="myCustomAccounts === null">
      <h1 class="title txt-left">Custom Accounts</h1>
      <div class="box-grey">
        <span>You have not added a custom account yet!</span>
      </div>
    </div>

    <div class="fold" v-if="myCustomAccounts !== null">
      <h1 class="title txt-left">Custom Accounts</h1>
      <div class="box-grey mb-10" v-for="(item, index) in myCustomAccounts" :key="index">
        <p class="txt-left bold">{{ item.name }}</p>
        <p class="txt-left">{{ item.publicKey }}</p>
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
      errorActive: false,
      errorMessage: '',
      inputValue: '',
      valid: false,
      myCustomAccounts: JSON.parse(this.$localStorage.get('myAccounts')),
      accountName: '',
      passwordInput: null
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

      if (this.inputValue === '') {
        privateKeyValid = false
      } else if (this.inputValue.length === 64 && this.isHex(this.inputValue) === true) {
        privateKeyValid = true
      } else {
        privateKeyValid = false
      }

      if (this.passwordInput && this.passwordInput.length >= 8 && this.passwordInput.length < 15) {
        passwordValid = true
      } else {
        passwordValid = false
      }

      if (passwordValid === false) {
        this.errorActive = true
        this.errorMessage = 'Invalid Password'
      } else if (privateKeyValid === false) {
        this.errorActive = true
        this.errorMessage = 'Invalid Private Key'
      } else if ((passwordValid && privateKeyValid) === false) {
        this.errorActive = true
        this.errorMessage = 'Invalid Password or Private Key'
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
          } else {
            let finding = this.myCustomAccounts.find(el => el.publicKey === newAccount.publicKey)

            if ([undefined, null].includes(finding) === false) {
              throw String('Existing account')
            } else {
              this.myCustomAccounts.push(newAccount)
              this.$localStorage.set('myAccounts', JSON.stringify(this.myCustomAccounts))
              this.$store.dispatch('newNotification', tmpObj)
            }
          }

          this.accountName = ''
          this.passwordInput = ''
          this.inputValue = ''
          this.valid = false

          // window.location.reload(
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
    }
  }
}
</script>
