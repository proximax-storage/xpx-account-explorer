<template>
  <div class="app-sidebar">

    <!-- LOGO -->
    <figure class="main-logo">
      <img :src="require('@/assets/images/logo-proximax-sirius-explorer.svg')" alt="Proximax Logo" class="logo">
    </figure>
    <!-- END LOGO -->

    <div class="project-name">
      <div>Account Explorer</div>
      <div>Administartion System</div>
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

    <div class="accounts-list" v-if="customAccounts.length > 0">
      <div class="nav-item" v-for="(item, index) in customAccounts" :key="index"
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
        { name: 'Dashboard', class: '', route: '', icon: 'icon-dashboard-off' },
        { name: 'Nodes', class: '', route: 'nodes', icon: 'icon-nodes-off' },
        { name: 'Customize', class: '', route: 'customizing', icon: 'icon-accounts-off' }
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
      for (let i = 0; i < this.navList.length; i++) {
        this.navList[i].class = ''
        if (this.navList[i].route === route) {
          this.navList[i].class = 'nav-item-active'
        }
      }
    },

    redirectAction (itemRoute) {
      if (itemRoute !== this.$route.path) {
        this.$router.push(itemRoute)
      }
    },

    verifyRoute () {
      let currentPath = window.location.hash
      currentPath = currentPath.slice(2)
      this.redirectAction(currentPath)
      this.changeClass(currentPath)
    },

    loadCustomAccounts () {
      let myAccounts = JSON.parse(this.$localStorage.get('myAccounts'))
      console.log(myAccounts)

      if (myAccounts !== null) {
        myAccounts.forEach(el => {
          let tmpObj = {
            name: el.name,
            publicKey: el.publicAccount.publicKey,
            class: '',
            icon: 'icon-accounts-off'
          }
          this.customAccounts.push(tmpObj)
        })
      }
    },

    goToPublicKey (pk) {
      console.log(pk)
      let routeData = this.$router.resolve({ path: `/publicKey/${pk}` })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
