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

  </div>
</template>

<script>
export default {
  name: 'AppSidebar',

  data () {
    return {
      softwareVersion: `v${this.$config.version}`,
      navList: [
        { name: 'Dashboard', class: 'nav-item-active', route: '', icon: 'icon-dashboard-on' },
        { name: 'Nodes', class: '', route: 'nodes', icon: 'icon-nodes-off' },
        { name: 'Customizing', class: '', route: 'customizing', icon: 'icon-accounts-off' }
      ]
    }
  },

  mounted () {
    this.verifyRoute()
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
      console.log('Rute', currentPath)
      this.redirectAction(currentPath)
      this.changeClass(currentPath)
    }
  }
}
</script>

<style scoped>
  @import url('../../style.css');
</style>
