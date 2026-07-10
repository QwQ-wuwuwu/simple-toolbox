<script setup>
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'

const { eyeCare, toggleEyeCare } = inject('eyeCare')
const route = useRoute()

const sidebarCollapsed = ref(false)

const tools = ref([
  { name: 'JSON 格式化', path: '/tools/json-formatter', icon: '{ }' },
  { name: '编码 / 解码', path: '/tools/encode-decode', icon: 'A↔' },
  { name: '快速复制', path: '/tools/quick-copy', icon: '📋' },
  { name: '文库二维码', path: '/tools/qrcode', icon: '⊞' },
  { name: 'cURL 解析', path: '/tools/curl-parser', icon: '⇶' },
])
</script>

<template>
  <div class="main-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <aside class="sidebar">
      <div class="sidebar-header">
        <router-link to="/" class="logo">工具箱</router-link>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="tool in tools"
          :key="tool.path"
          :to="tool.path"
          class="nav-item"
          :class="{ active: route.path === tool.path }"
        >
          <span class="nav-icon">{{ tool.icon }}</span>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ tool.name }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="eye-care-btn" @click="toggleEyeCare">
          {{ eyeCare ? '关闭护眼' : '护眼模式' }}
        </button>
      </div>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss" src="./MainLayout.scss"></style>
