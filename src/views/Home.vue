<script setup>
import { ref } from 'vue'

const tools = ref([
  { name: 'JSON 格式化', path: '/tools/json-formatter', icon: '{ }', description: '格式化、压缩、校验 JSON 数据' },
])
</script>

<template>
  <div class="home">
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
