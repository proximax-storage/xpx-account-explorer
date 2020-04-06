<template>
  <div class="GiftCard">
    <module-header :name="moduleName"/>

    <div class="input-cont">
      <select class="field" @click="getAccountInfo">
        <option value="">Select an Account</option>
        <option v-for="(elem, index) in currentAccounts" :key="index" :value="elem.name">{{ elem.name }}</option>
      </select>
    </div>

    <generated-list v-if="giftListActive" :account="selectedValue"/>
  </div>
</template>

<script>
import ModuleHeader from '@/components/Global/module-header'
import GeneratedList from '@/components/GiftManager/GeneratedList'

export default {
  name: 'GiftGeneration',

  components: {
    ModuleHeader,
    GeneratedList
  },

  data () {
    return {
      moduleName: 'Cards Generated',
      selectValue: null,
      currentAccounts: null,
      giftListActive: false
    }
  },

  mounted () {
    this.currentAccounts = this.getAccounts()
  },

  methods: {
    getAccounts () {
      return this.$store.getters.getMyAccounts
    },

    async getAccountInfo (e) {
      const name = e.target.value
      this.giftListActive = false
      this.selectedValue = null
      console.log('Ejecutando')

      if ([undefined, null, ''].includes(name) === false) {
        setTimeout(() => {
          this.selectedValue = this.currentAccounts.find(elem => elem.name === name)
          this.giftListActive = true
          console.log('Aprobado')
        }, 500)
      }
    }
  }
}
</script>
