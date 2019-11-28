<template>
  <div class="app-header">

    <!-- Upper section -->
    <div class="up">
      <figure class="header-img-cont">
        <img :src="require('@/assets/images/logo-proximax-sirius-explorer.svg')" alt="Proximax Logo" class="logo">
        <p class="version">{{ softwareVersion }}</p>
      </figure>

      <div class="header-date">
        <div class="day">
          <div>{{ date.month }}</div>
          <div>{{ date.day }},</div>
          <div>{{ date.year }}</div>
        </div>
        <div class="hours">
          <div>{{ date.dayName }}</div>
          <div>|</div>
          <div>{{ date.militarHour }}</div>
        </div>
      </div>
    </div>
    <!-- End Upper section -->

    <!-- Lower section -->
    <div class="down">
      <div class="nav-item" :class="item.class"
      v-for="(item, index) in navList" :key="index"
      :route="item.route"
      @click="buttonAction">
        {{ item.name }}
      </div>
    </div>
    <!-- End Lower section -->

  </div>
</template>

<script>
export default {
  name: 'AppHeader',

  data () {
    return {
      date: {
        dayName: 'Mon.',
        day: '01',
        month: 'Jan',
        year: 2019,
        militarHour: '12:00'
      },
      softwareVersion: `v${this.$config.version}`,
      navList: [
        { name: 'Home', class: 'nav-item-active', route: '' },
        { name: 'Example', class: '', route: 'about' }
      ]
    }
  },

  mounted () {
    this.defineDate()
    this.verifyRoute()
  },

  methods: {
    buttonAction (e) {
      let objectRoute = e.target.getAttribute('route')

      this.navList.forEach(el => {
        el.class = ''
        if (el.route === objectRoute) {
          el.class = 'nav-item-active'
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

    defineDate () {
      let time = new Date()
      let allMonths = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
      let allDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.']
      this.date.day = time.getDate()
      this.date.month = allMonths[time.getMonth()]
      let year = time.getFullYear()
      this.date.year = year
      this.date.militarHour = `${time.getHours()}:${(time.getMinutes() < 10) ? `0${time.getMinutes()}` : time.getMinutes()}`
      this.date.dayName = allDays[time.getDay()]
    },

    redirectAction (itemRoute) {
      this.$router.push(itemRoute)
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
