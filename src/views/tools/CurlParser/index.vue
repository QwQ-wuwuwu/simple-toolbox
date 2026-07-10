<script setup>
import { ref, watch } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

const input = ref(localStorage.getItem('curl-parser-input') || '')
const cookies = ref([])
const params = ref([])
const error = ref('')
const toast = ref('')

if (input.value) {
  parse()
}

watch(input, () => {
  localStorage.setItem('curl-parser-input', input.value)
  if (!input.value.trim()) {
    cookies.value = []
    params.value = []
    error.value = ''
    return
  }
  parse()
})

function parse() {
  try {
    error.value = ''
    cookies.value = []
    params.value = []

    const curlStr = input.value.trim()
    parseCookies(curlStr)
    parseParams(curlStr)
  } catch (e) {
    error.value = '解析失败: ' + e.message
  }
}

function parseCookies(curlStr) {
  // Match -H 'Cookie: ...' or -H "Cookie: ..." or --cookie "..."
  const cookieHeaders = []

  // Match -H "Cookie: ..." or -H 'Cookie: ...'
  const headerRegex = /-H\s+['"]Cookie:\s*([^'"]+)['"]/gi
  let match
  while ((match = headerRegex.exec(curlStr)) !== null) {
    cookieHeaders.push(match[1])
  }

  // Match --cookie "..." or -b "..."
  const cookieArgRegex = /(?:--cookie|-b)\s+['"]([^'"]+)['"]/gi
  while ((match = cookieArgRegex.exec(curlStr)) !== null) {
    cookieHeaders.push(match[1])
  }

  for (const cookieStr of cookieHeaders) {
    const pairs = cookieStr.split(';')
    for (const pair of pairs) {
      const trimmed = pair.trim()
      if (!trimmed) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) {
        cookies.value.push({ key: trimmed, value: '' })
      } else {
        cookies.value.push({
          key: trimmed.substring(0, eqIdx).trim(),
          value: trimmed.substring(eqIdx + 1).trim(),
        })
      }
    }
  }
}

function parseParams(curlStr) {
  // Extract URL from curl command
  const urlMatch = curlStr.match(/curl\s+(?:.*?\s+)?['"]?(https?:\/\/[^\s'"]+)['"]?/) ||
    curlStr.match(/['"]?(https?:\/\/[^\s'"]+)['"]?/)

  if (urlMatch) {
    const url = urlMatch[1]
    const qIdx = url.indexOf('?')
    if (qIdx !== -1) {
      const queryStr = url.substring(qIdx + 1)
      const pairs = queryStr.split('&')
      for (const pair of pairs) {
        const eqIdx = pair.indexOf('=')
        if (eqIdx === -1) {
          params.value.push({ key: decodeURIComponent(pair), value: '' })
        } else {
          params.value.push({
            key: decodeURIComponent(pair.substring(0, eqIdx)),
            value: decodeURIComponent(pair.substring(eqIdx + 1)),
          })
        }
      }
    }
  }

  // Also parse -d / --data / --data-raw / --data-urlencode body params
  // Support: quoted with ' or ", $'...', or unquoted values
  const dataRegex = /(?:--data-raw|--data-urlencode|--data|-d)\s+\$?'((?:[^'\\]|\\.)*)'|(?:--data-raw|--data-urlencode|--data|-d)\s+"((?:[^"\\]|\\.)*)"|(?:--data-raw|--data-urlencode|--data|-d)\s+([^\s'"\\]+)/gi
  let match
  while ((match = dataRegex.exec(curlStr)) !== null) {
    const body = (match[1] || match[2] || match[3] || '')
      .replace(/\\r\\n/g, '\r\n')
      .replace(/\\n/g, '\n')
      .replace(/\\(['"\\])/g, '$1')

    if (body.includes('------') && body.includes('Content-Disposition: form-data')) {
      // Parse multipart/form-data
      parseMultipart(body)
    } else if (body.includes('=') && !body.startsWith('{')) {
      // Parse as form-urlencoded
      const pairs = body.split('&')
      for (const pair of pairs) {
        const eqIdx = pair.indexOf('=')
        if (eqIdx === -1) {
          params.value.push({ key: decodeURIComponent(pair), value: '', source: 'body' })
        } else {
          params.value.push({
            key: decodeURIComponent(pair.substring(0, eqIdx)),
            value: decodeURIComponent(pair.substring(eqIdx + 1)),
            source: 'body',
          })
        }
      }
    }
  }
}

function parseMultipart(body) {
  // Split by boundary lines (------WebKitFormBoundary...)
  const parts = body.split(/------[^\r\n]+/)
  for (const part of parts) {
    const nameMatch = part.match(/Content-Disposition:\s*form-data;\s*name="([^"]+)"/)
    if (!nameMatch) continue
    const name = nameMatch[1]
    // Value is after the double line break following headers
    const headerEnd = part.indexOf('\r\n\r\n') !== -1
      ? part.indexOf('\r\n\r\n') + 4
      : part.indexOf('\n\n') !== -1
        ? part.indexOf('\n\n') + 2
        : -1
    if (headerEnd === -1) continue
    const value = part.substring(headerEnd).replace(/[\r\n]+$/, '')
    params.value.push({ key: name, value, source: 'body' })
  }
}

function clear() {
  input.value = ''
  cookies.value = []
  params.value = []
  error.value = ''
}

function copyTable(items) {
  const text = items.map(item => `${item.key}=${item.value}`).join('\n')
  copyToClipboard(text).then(() => {
    toast.value = '复制成功'
    setTimeout(() => { toast.value = '' }, 1500)
  })
}

function copyValue(value) {
  copyToClipboard(value).then(() => {
    toast.value = '复制成功'
    setTimeout(() => { toast.value = '' }, 1500)
  })
}
</script>

<template>
  <div class="curl-parser">
    <div v-if="toast" class="toast">{{ toast }}</div>
    <div class="toolbar">
      <h2>cURL 解析</h2>
    </div>
    <div class="actions">
      <button class="btn-secondary" @click="clear">清空</button>
    </div>
    <div class="input-section">
      <div class="panel-header">
        <label>输入 cURL 命令</label>
      </div>
      <textarea v-model="input" placeholder="粘贴 curl 命令..."></textarea>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="results">
      <div v-if="cookies.length" class="result-section">
        <div class="section-header">
          <h3>Cookies ({{ cookies.length }})</h3>
          <button class="btn-copy" @click="copyTable(cookies)">复制全部</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th class="th-action">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in cookies" :key="idx">
              <td class="key-cell">{{ item.key }}</td>
              <td class="value-cell">{{ item.value }}</td>
              <td class="action-cell"><button class="btn-copy-row" @click="copyValue(item.value)">复制</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="params.length" class="result-section">
        <div class="section-header">
          <h3>参数 ({{ params.length }})</h3>
          <button class="btn-copy" @click="copyTable(params)">复制全部</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th v-if="params.some(p => p.source)">来源</th>
              <th class="th-action">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in params" :key="idx">
              <td class="key-cell">{{ item.key }}</td>
              <td class="value-cell">{{ item.value }}</td>
              <td v-if="params.some(p => p.source)">{{ item.source === 'body' ? 'Body' : 'Query' }}</td>
              <td class="action-cell"><button class="btn-copy-row" @click="copyValue(item.value)">复制</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!cookies.length && !params.length && input.trim() && !error" class="empty">
        未解析到 Cookie 或参数
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./index.scss"></style>
