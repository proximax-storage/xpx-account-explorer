import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const load = view => {
  return () => import(`@/views/${view}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: load('Home')
  },
  {
    path: '/about',
    name: 'about',
    component: load('About')
  }
]

const router = new VueRouter({
  routes
})

export default router
