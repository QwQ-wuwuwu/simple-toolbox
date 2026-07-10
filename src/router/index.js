import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../views/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'tools/json-formatter',
        name: 'JsonFormatter',
        component: () => import('../views/tools/JsonFormatter/index.vue'),
      },
      {
        path: 'tools/encode-decode',
        name: 'EncodeDecode',
        component: () => import('../views/tools/EncodeDecode/index.vue'),
      },
      {
        path: 'tools/quick-copy',
        name: 'QuickCopy',
        component: () => import('../views/tools/QuickCopy/index.vue'),
      },
      {
        path: 'tools/qrcode',
        name: 'QrCode',
        component: () => import('../views/tools/QrCode/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
