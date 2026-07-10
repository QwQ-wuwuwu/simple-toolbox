<script setup>
import { ref, watch } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

const input = ref(localStorage.getItem('encode-decode-input') || '')
const output = ref('')
const mode = ref('encode')
const method = ref('url')
const toast = ref('')

const methods = [
  { value: 'base64', label: 'Base64' },
  { value: 'url', label: 'URL' },
  { value: 'html', label: 'HTML Entity' },
  { value: 'unicode', label: 'Unicode' },
]

if (input.value) {
  execute()
}

watch([input, mode, method], () => {
  localStorage.setItem('encode-decode-input', input.value)
  if (!input.value.trim()) {
    output.value = ''
    return
  }
  execute()
})

function execute() {
  try {
    if (mode.value === 'encode') {
      output.value = encode(input.value, method.value)
    } else {
      output.value = decode(input.value, method.value)
    }
  } catch (e) {
    output.value = '处理失败: ' + e.message
  }
}

function encode(text, type) {
  switch (type) {
    case 'base64': return btoa(unescape(encodeURIComponent(text)))
    case 'url': return encodeURIComponent(text)
    case 'html': return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    case 'unicode': return Array.from(text).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('')
    default: return text
  }
}

function decode(text, type) {
  switch (type) {
    case 'base64': return decodeURIComponent(escape(atob(text)))
    case 'url': return decodeURIComponent(text)
    case 'html': {
      const el = document.createElement('div')
      el.innerHTML = text
      return el.textContent || ''
    }
    case 'unicode': return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    default: return text
  }
}

function clear() {
  input.value = ''
  output.value = ''
}

function copyOutput() {
  copyToClipboard(output.value).then(() => {
    toast.value = '复制成功'
    setTimeout(() => { toast.value = '' }, 1500)
  })
}
</script>

<template>
  <div class="encode-decode">
    <div v-if="toast" class="toast">{{ toast }}</div>
    <div class="toolbar">
      <h2>编码 / 解码</h2>
    </div>
    <div class="actions">
      <select v-model="method">
        <option v-for="m in methods" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
      <button :class="{ active: mode === 'encode' }" @click="mode = 'encode'">编码</button>
      <button :class="{ active: mode === 'decode' }" @click="mode = 'decode'">解码</button>
      <button class="btn-secondary" @click="clear">清空</button>
    </div>
    <div class="panels">
      <div class="panel">
        <div class="panel-header">
          <label>输入</label>
        </div>
        <textarea v-model="input" placeholder="在此输入文本..."></textarea>
      </div>
      <div class="panel">
        <div class="panel-header">
          <label>输出</label>
          <button v-if="output" class="btn-copy" @click="copyOutput">复制</button>
        </div>
        <textarea :value="output" readonly placeholder="结果将显示在这里"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./index.scss"></style>
