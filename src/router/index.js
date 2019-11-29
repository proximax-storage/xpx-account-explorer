import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const load = view => {
  return () => import(`@/views/${view}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: load('Home')
  },
  {
    path: '/nodes',
    name: 'Nodes',
    component: load('Nodes')
  }
]

const router = new VueRouter({
  routes
})

export default router
