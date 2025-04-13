import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/dev',
    name: 'dev',
    component: () => import(/* webpackChunkName: "dev" */ '../views/DevView.vue')
  },

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
