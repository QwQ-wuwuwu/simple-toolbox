<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const error = ref('')

function format() {
  try {
    error.value = ''
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    error.value = 'JSON 解析失败: ' + e.message
    output.value = ''
  }
}

function compress() {
  try {
    error.value = ''
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
  } catch (e) {
    error.value = 'JSON 解析失败: ' + e.message
    output.value = ''
  }
}

function clear() {
  input.value = ''
  output.value = ''
  error.value = ''
}
</script>

<template>
  <div class="json-formatter">
    <div class="toolbar">
      <router-link to="/" class="back">&larr; 返回首页</router-link>
      <h2>JSON 格式化</h2>
    </div>
    <div class="actions">
      <button @click="format">格式化</button>
      <button @click="compress">压缩</button>
      <button @click="clear" class="btn-secondary">清空</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="panels">
      <div class="panel">
        <label>输入</label>
        <textarea v-model="input" placeholder="在此粘贴 JSON..."></textarea>
      </div>
      <div class="panel">
        <label>输出</label>
        <textarea :value="output" readonly placeholder="结果将显示在这里"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.json-formatter {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.toolbar h2 {
  margin: 0;
}

.back {
  color: #666;
  text-decoration: none;
}

.back:hover {
  color: #333;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #4f46e5;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

button:hover {
  background: #4338ca;
}

.btn-secondary {
  background: #e5e7eb;
  color: #333;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.error {
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.panel {
  display: flex;
  flex-direction: column;
}

.panel label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

textarea {
  width: 100%;
  min-height: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem;
  font-family: monospace;
  font-size: 0.85rem;
  resize: vertical;
}

@media (max-width: 640px) {
  .panels {
    grid-template-columns: 1fr;
  }
}
</style>
