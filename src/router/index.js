import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/tools/json-formatter',
    name: 'JsonFormatter',
    component: () => import('../views/tools/JsonFormatter.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
