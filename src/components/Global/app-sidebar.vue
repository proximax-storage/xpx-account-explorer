<template>
  <div class="app-sidebar">

    <!-- LOGO -->
    <figure class="main-logo">
      <img :src="require('@/assets/images/logo-proximax-sirius-explorer.svg')" alt="Proximax Logo" class="logo">
    </figure>
    <!-- END LOGO -->

    <div class="project-name">
      <div>County Government of</div>
      <div>LAIKIPIA</div>
      <div class="separator"></div>
    </div>

    <!-- ITEM LIST -->
    <div class="links-list">
      <div class="nav-item" v-for="(item, index) in navList" :key="index"
      :class="item.class" :route="item.route" @click="buttonAction(item.route)">
        <img :src="require(`@/assets/icons/${item.icon}.svg`)" class="icon">
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
    <!-- END ITEM LIST -->

    <div class="project-name">
      <div class="separator"></div>
    </div>

    <div class="accounts-list" v-if="getMyAccounts.length > 0 || getMyAccounts !== null">
      <div class="nav-item" v-for="(item, index) in getMyAccounts" :key="index"
      :class="item.class" :route="item.route" @click="goToPublicKey(item.publicKey)">
        <img :src="require(`@/assets/icons/${item.icon}.svg`)" class="icon">
        <div class="name">{{ item.name }}</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AppSidebar',

  data () {
    return {
      softwareVersion: `v${this.$config.version}`,
      navList: [
        { name: 'Dashboard', class: '', route: '', icon: 'icon-dash-off' },
        { name: 'Card Generated', class: '', route: 'generation', icon: 'icon-gen-off' },
        { name: 'Delivered Carepacks', class: '', route: 'delivered', icon: 'icon-card-off' },
        // { name: 'Transactions', class: '', route: 'transactions', icon: 'icon-trans-off' },
        { name: 'Accounts', class: '', route: 'customizing', icon: 'icon-accounts-off' },
        { name: 'Nodes', class: '', route: 'nodes', icon: 'icon-nodes-off' }
        // { name: 'Invoice', class: '', route: 'invoice/inapp', icon: 'icon-invoice-off' },
        // { name: 'Load Invoice', class: '', route: 'loadInvoice', icon: 'icon-nodes-off' },
      ],
      customAccounts: []
    }
  },

  mounted () {
    this.verifyRoute()
    this.loadCustomAccounts()
  },

  methods: {
    buttonAction (route) {
      let objectRoute = route

      this.navList.forEach(el => {
        el.class = ''
        el.icon = el.icon.replace('-on', '-off')
        if (el.route === objectRoute) {
          el.class = 'nav-item-active'
          el.icon = el.icon.replace('-off', '-on')
        }
      })

      this.redirectAction(`/${objectRoute}`)
      // this.cleanError()
    },

    changeClass (route) {
      this.navList.forEach(el => {
        el.class = ''
        el.icon = el.icon.replace('-on', '-off')

        if (el.route === route) {
          el.class = 'nav-item-active'
          el.icon = el.icon.replace('-off', '-on')
        }
      })
    },

    redirectAction (itemRoute) {
      if (itemRoute !== this.$route.path) {
        this.$router.push(itemRoute)
      }
    },

    verifyRoute () {
      let currentPath = window.location.hash
      currentPath = currentPath.slice(2)
      this.redirectAction(`/${currentPath}`)
      this.changeClass(currentPath)
    },

    loadCustomAccounts () {
      let myAccounts = JSON.parse(this.$localStorage.get('myAccounts'))

      // if (myAccounts !== null) {
      //   myAccounts.forEach(el => {
      //     console.log(el)
      //     el.class = ''
      //     el.icon = 'icon-accounts-off'
      //     this.customAccounts.push(el)
      //   })
      // }

      this.$store.dispatch('updateAccounts', myAccounts)
    },

    goToPublicKey (pk) {
      let routeData = this.$router.resolve({ path: `/publicKey/${pk}` })
      window.open(routeData.href, '_blank')
    }
  },

  computed: {
    getMyAccounts () {
      let myAccounts = this.$store.state.accounts
      let buildAccounts = []

      if (myAccounts !== null) {
        myAccounts.forEach(el => {
          console.log(el)
          el.class = ''
          el.icon = 'icon-accounts-off'
          buildAccounts.push(el)
        })
      }

      return buildAccounts
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
