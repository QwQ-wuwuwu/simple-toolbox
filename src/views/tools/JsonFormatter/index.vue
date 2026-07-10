<script setup>
import { ref, watch, computed } from 'vue'
import JsonTree from '@/components/JsonTree/index.vue'
import { copyToClipboard } from '@/utils/clipboard'

const input = ref(localStorage.getItem('json-formatter-input') || '')
const output = ref('')
const error = ref('')
const copied = ref(false)
const parsedData = ref(null)
const toast = ref('')

const hasParsed = computed(() => parsedData.value !== null && !error.value)

// 初始化时如果有缓存内容，执行一次格式化
if (input.value) {
  format()
}

watch(input, (val) => {
  localStorage.setItem('json-formatter-input', val)
  if (!val.trim()) {
    output.value = ''
    error.value = ''
    parsedData.value = null
    return
  }
  format()
})

function format() {
  try {
    error.value = ''
    const parsed = JSON.parse(input.value)
    parsedData.value = parsed
    output.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    error.value = 'JSON 解析失败: ' + e.message
    output.value = error.value
    parsedData.value = null
  }
}

function compress() {
  try {
    error.value = ''
    const parsed = JSON.parse(input.value)
    parsedData.value = parsed
    output.value = JSON.stringify(parsed)
  } catch (e) {
    error.value = 'JSON 解析失败: ' + e.message
    output.value = error.value
    parsedData.value = null
  }
}

function clear() {
  input.value = ''
  output.value = ''
  error.value = ''
  parsedData.value = null
}

function copyOutput() {
  copyToClipboard(output.value).then(() => {
    copied.value = true
    toast.value = '复制成功'
    setTimeout(() => {
      copied.value = false
      toast.value = ''
    }, 1500)
  })
}
</script>

<template>
  <div class="json-formatter">
    <div v-if="toast" class="toast">{{ toast }}</div>
    <div class="toolbar">
      <h2>JSON 格式化</h2>
    </div>
    <div class="actions">
      <button @click="format">格式化</button>
      <button @click="compress">压缩</button>
      <button @click="clear" class="btn-secondary">清空</button>
    </div>
    <div class="panels">
      <div class="panel">
        <label>输入</label>
        <textarea v-model="input" placeholder="在此粘贴 JSON..."></textarea>
      </div>
      <div class="panel">
        <div class="panel-header">
          <label>输出</label>
          <button v-if="output" class="btn-copy" @click="copyOutput">
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
        <div v-if="hasParsed" class="output-tree">
          <JsonTree :data="parsedData" :root="true" />
        </div>
        <textarea v-else :value="output" :class="{ 'has-error': error }" readonly placeholder="结果将显示在这里"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./index.scss"></style>
