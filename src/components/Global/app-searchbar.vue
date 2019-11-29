<template>
  <div class="app-searchbar">

    <form class="input-cont box-grey">

      <div class="selector">
        <div v-for="(item, index) in searchTypeList" :key="index"
        class="selector-item" :class="item.class" @click="changeSearchType(item.name)">
          {{ item.name }}
        </div>
      </div>

      <input type="text" :placeholder="placeholder" class="field" autocomplete="off" @keyup="isValid" @focusout="isValid" @change="isValid" v-model="valueSearch"/>

      <div class="search-error" v-if="errorActive">{{ errorMessage }}</div>

      <input type="submit" class="proximax-btn" @click.prevent="" value="Search">
    </form>
  </div>
</template>

<script>
export default {
  name: 'AppSearchbar',

  data () {
    return {
      typeSearch: 'Basic',
      valueSearch: '',
      placeholder: 'Public Key / Address',
      searchTypeList: [
        { name: 'Basic', class: 'selector-active' },
        { name: 'Hash', class: '' }
      ],
      errorActive: false,
      errorMessage: 'error',
      validSearch: false,
      pathSearch: ''
    }
  },

  methods: {
    changeSearchType (type) {
      this.typeSearch = type

      this.searchTypeList.forEach(el => {
        el.class = ''
        if (el.name === type) {
          el.class = 'selector-active'
        }
      })

      this.isValid()
    },

    isHex (value) {
      let regex = /^[0-9A-Fa-f]+$/
      return regex.test(value)
    },

    isOnlyNumber (value) {
      let regex = /^[0-9]+$/
      return regex.test(value)
    },

    isValid () {
      let valid = false
      let path = ''

      console.log('isHex', this.isHex(this.valueSearch))
      console.log('OnlyNumber', this.isOnlyNumber(this.valueSearch))
      console.log('Length', this.valueSearch.length)

      switch (this.typeSearch) {
        case 'Basic':
          if (this.valueSearch.length === 64 && this.isHex(this.valueSearch) === true) {
            console.log('PK')
            path = 'publicKey'
            valid = true
          } else if (this.valueSearch.length === 40 || this.valueSearch.length === 46) {
            console.log('ADD')
            path = 'address'
            valid = true
          } else if (this.isOnlyNumber(this.valueSearch) === true) {
            console.log('BLK')
            path = 'blockHeight'
            valid = true
          } else {
            valid = false
          }
          break

        case 'Hash':
          if (this.valueSearch.length === 64 && this.isHex(this.valueSearch) === true) {
            path = 'hash'
            valid = true
          } else {
            valid = false
          }
          break
      }

      console.log('Valid', valid)
      console.log('----------')
      if (valid === false) {
        if (this.valueSearch !== '') {
          this.errorActive = true
          this.errorMessage = 'Invalid search value'
        } else {
          this.errorActive = false
          this.errorMessage = ''
        }
      } else {
        this.errorActive = false
        this.errorMessage = ''
      }
      this.pathSearch = path
      this.validSearch = valid
    }
  },

  performSearch () {
    if (this.validSearch === true) {

    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
