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

<style scoped>
.home {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.hero p {
  color: #666;
  font-size: 1.1rem;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, transform 0.2s;
}

.tool-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.tool-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.tool-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.tool-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
</style>
