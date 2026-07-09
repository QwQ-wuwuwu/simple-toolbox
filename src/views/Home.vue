<script setup>
import { ref, inject } from 'vue'

const { eyeCare, toggleEyeCare } = inject('eyeCare')

const tools = ref([
  { name: 'JSON 格式化', path: '/tools/json-formatter', icon: '{ }', description: '格式化、压缩、校验 JSON 数据' },
  { name: '编码 / 解码', path: '/tools/encode-decode', icon: 'A↔', description: 'Base64、URL、HTML、Unicode 编解码' },
  { name: '快速复制', path: '/tools/quick-copy', icon: '📋', description: '存储常用文本片段，一键复制到剪贴板' },
  { name: '文库二维码', path: '/tools/qrcode', icon: '⊞', description: '快速生成对应路径的二维码' },
])
</script>

<template>
  <div class="home">
    <button class="eye-care-btn" @click="toggleEyeCare">
      {{ eyeCare ? '关闭护眼' : '护眼模式' }}
    </button>
    <header class="hero">
      <h1>工具箱</h1>
      <p>一组简单实用的在线小工具</p>
    </header>
    <section class="tool-grid">
      <router-link
        v-for="tool in tools"
        :key="tool.path"
        :to="tool.path"
        class="tool-card"
      >
        <span class="tool-icon">{{ tool.icon }}</span>
        <h3>{{ tool.name }}</h3>
        <p>{{ tool.description }}</p>
      </router-link>
    </section>
  </div>
</template>

<style scoped lang="scss" src="./Home.scss"></style>
