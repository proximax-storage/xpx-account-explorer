<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <div>
        <h1>Version: {{ this.$config.version }}</h1>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { PublicAccount } from 'tsjs-xpx-chain-sdk'

export default {
  mounted () {
    this.runApp()
    this.example()
  },

  methods: {
    runApp () {
      console.log('Welcome to ExplorerRRHH')
      console.log('LocalStorage', this.$localStorage)
      console.log('SessionStorage', this.$sessionStorage)
      console.log('Config', this.$config)
      console.log('Provider', this.$provider)
    },

    async example () {
      let publicAccount = PublicAccount.createFromPublicKey('EC2633D9A9344E48D24776C532FC80A9D5E6347527290152AA6A95A4A32798DD', this.$config.network.number)
      console.log(publicAccount)
      try {
        let accountInfo = await this.$provider.accountHttp.getAccountInfo(publicAccount.address).toPromise()
        console.log(accountInfo)
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
