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

<style scoped lang="scss" src="./JsonFormatter.scss"></style>
