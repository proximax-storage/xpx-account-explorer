<template>
  <div class="customizing">
    <module-header :name="moduleName"/>
    <node-info/>

    <div class="fold">
      <div class="box-orange mb-10">
        Add Accounts here to monitor them
      </div>

      <form class="box-grey mb-10">
        <input type="text" class="field" placeholder="Account Name" v-model="accountName">
        <input type="text" class="field" placeholder="Enter Public Key" v-model="inputValue" @keyup="validate" @focusout="validate" @change="validate">
        <div class="search-error" v-if="errorActive">{{ errorMessage }}</div>
        <input type="submit" class="proximax-btn" v-if="valid === true" @click.prevent="addAccount" value="Add Account">
        <input type="submit" class="proximax-btn-disabled" v-if="valid === false" @click.prevent="performSearch" value="Add Account">
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
        <p class="txt-left">{{ item.publicAccount.publicKey }}</p>
      </div>
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
      moduleName: 'Customize',
      errorActive: false,
      errorMessage: '',
      inputValue: '',
      valid: false,
      myCustomAccounts: JSON.parse(this.$localStorage.get('myAccounts')),
      accountName: ''
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

    async addAccount () {
      if (this.valid === true) {
        let publicAccount = PublicAccount.createFromPublicKey(this.inputValue, this.$config.network.number)

        try {
          let accountInfo = await this.$provider.accountHttp.getAccountInfo(publicAccount.address).toPromise()

          let numberAccount = (this.myCustomAccounts === null) ? '1' : `${this.myCustomAccounts.length + 1}`

          let newAccount = {
            publicAccount: accountInfo.publicAccount,
            name: (this.accountName === '') ? `Account${numberAccount}` : this.accountName
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
            let finding = this.myCustomAccounts.find(el => el.publicAccount.publicKey === newAccount.publicAccount.publicKey)

            if ([undefined, null].includes(finding) === false) {
              throw String('Existing account')
            } else {
              this.myCustomAccounts.push(newAccount)
              this.$localStorage.set('myAccounts', JSON.stringify(this.myCustomAccounts))
              this.$store.dispatch('newNotification', tmpObj)
            }
          }

          this.inputValue = ''
          this.valid = false

          window.location.reload()
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
