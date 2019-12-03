<template>
  <div class="app-searchbar">
    <form class="input-cont">
      <div class="selector">
        <div v-for="(item, index) in searchTypeList" :key="index"
        class="selector-item" :class="item.class" @click="changeSearchType(item.name)">
          {{ item.name }}
        </div>
      </div>

      <div class="input-cont">
        <input type="text" :placeholder="placeholder" class="field" autocomplete="off" @keyup="isValid" @focusout="isValid" @change="isValid" v-model="valueSearch"/>
        <input type="submit" class="proximax-btn" @click.prevent="performSearch" value="Search">
      </div>
      <div class="search-error" v-if="errorActive">{{ errorMessage }}</div>
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
          this.placeholder = (el.name === 'Basic') ? 'Public Key / Address' : 'Hash / Tx ID'
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

      switch (this.typeSearch) {
        case 'Basic':
          if (this.valueSearch.length === 64 && this.isHex(this.valueSearch) === true) {
            path = 'publicKey'
            valid = true
          } else if (this.valueSearch.length === 40 || this.valueSearch.length === 46) {
            path = 'address'
            valid = true
          } else if (this.isOnlyNumber(this.valueSearch) === true) {
            path = 'block'
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
    },

    performSearch () {
      let lowerValue = this.valueSearch.toLowerCase()
      if (this.validSearch === true) {
        let routeData = this.$router.resolve({
          path: `/${this.pathSearch}/${lowerValue}`
        })
        console.log(this.pathSearch, routeData)
        window.open(routeData.href, '_blank')

        this.pathSearch = ''
        this.validSearch = false
        this.valueSearch = ''
      }
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
