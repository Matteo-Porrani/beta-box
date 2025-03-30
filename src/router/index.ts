import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/AdminView.vue')
  },

  {
    path: '/tasks',
    name: 'tasks',
    component: () => import(/* webpackChunkName: "tasks" */ '../views/TasksView.vue')
  },

  {
    path: '/data-manager',
    name: 'data_manager',
    component: () => import(/* webpackChunkName: "data_manager" */ '../views/DataManagerView.vue')
  },

  {
    path: '/dev',
    name: 'dev',
    component: () => import(/* webpackChunkName: "dev" */ '../views/DevView.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
