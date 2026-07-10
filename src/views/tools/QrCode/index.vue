<script setup>
import { ref, watch, computed } from 'vue'
import QRCode from 'qrcode'

const CACHE_KEY = 'qrcode-tool-cache'
const PATH_HISTORY_KEY = 'qrcode-path-history'

// 从缓存恢复
const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')

const input = ref(cache.input || '')
const miniPath = ref(cache.miniPath || '')
const miniParams = ref(cache.miniParams || '')
const qrDataUrl = ref('')
const toast = ref('')
const scene = ref(cache.scene || '')
const version = ref(cache.version || 'AukeaxXFpdt1qCe7lE35VCvH27x6ayWI')

// 路径历史记录
const pathHistory = ref(JSON.parse(localStorage.getItem(PATH_HISTORY_KEY) || '[]'))
const showPathHistory = ref(false)

function saveCache() {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    input: input.value,
    miniPath: miniPath.value,
    miniParams: miniParams.value,
    scene: scene.value,
    version: version.value,
  }))
}

function savePathHistory() {
  const path = miniPath.value.trim()
  if (!path) return
  const list = pathHistory.value.filter(p => p !== path)
  list.unshift(path)
  pathHistory.value = list.slice(0, 10)
  localStorage.setItem(PATH_HISTORY_KEY, JSON.stringify(pathHistory.value))
}

function selectPath(path) {
  miniPath.value = path
  showPathHistory.value = false
}

function clearAll() {
  input.value = ''
  miniPath.value = ''
  miniParams.value = ''
  version.value = 'AukeaxXFpdt1qCe7lE35VCvH27x6ayWI'
  scene.value = ''
  saveCache()
}

const showVersion = computed(() => scene.value !== '')

const sceneOptions = [
  { value: '', label: '无' },
  { value: 'baiduboxapp://swan/', label: '百度小程序' },
  { value: 'bdnetdisk://n/action.swan?swan_app_key=', label: '网盘小程序' },
]

const qrContent = computed(() => {
  if (scene.value === '') {
    const path = input.value.trim()
    return path || ''
  }
  const path = miniPath.value.trim()
  if (!path) return ''
  const params = miniParams.value.trim()
  const fullPath = params ? path + '?' + params : path
  return scene.value + version.value + fullPath
})

async function generate() {
  if (!qrContent.value) {
    qrDataUrl.value = ''
    return
  }
  try {
    qrDataUrl.value = await QRCode.toDataURL(qrContent.value, {
      width: 300,
      margin: 2,
    })
  } catch {
    qrDataUrl.value = ''
  }
}

watch(input, () => { saveCache(); generate() })
watch(miniPath, () => { saveCache(); generate() })
watch(miniParams, () => { saveCache(); generate() })
watch(scene, () => { saveCache(); generate() })
watch(version, () => { saveCache(); generate() })

// 路径失焦时保存历史
function onPathBlur() {
  savePathHistory()
  setTimeout(() => { showPathHistory.value = false }, 200)
}

// 初始化生成
generate()

function download() {
  if (!qrDataUrl.value) return
  const a = document.createElement('a')
  a.href = qrDataUrl.value
  a.download = 'qrcode.png'
  a.click()
  toast.value = '已下载'
  setTimeout(() => { toast.value = '' }, 1500)
}
</script>

<template>
  <div class="qrcode-tool">
    <div v-if="toast" class="toast">{{ toast }}</div>
    <div class="toolbar">
      <h2>文库二维码</h2>
      <button class="btn-clear" @click="clearAll">一键清空</button>
    </div>

    <div class="main-area">
      <div class="input-section">
        <label>应用场景</label>
        <select v-model="scene" class="scene-select">
          <option v-for="opt in sceneOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <template v-if="showVersion">
          <label>版本选择</label>
          <input v-model="version" class="url-input" />
          <label>路径</label>
          <div class="path-wrapper">
            <input v-model="miniPath" placeholder="输入小程序页面路径" class="url-input" @focus="showPathHistory = true" @blur="onPathBlur" />
            <ul v-if="showPathHistory && pathHistory.length" class="path-dropdown">
              <li v-for="(p, i) in pathHistory" :key="i" @mousedown.prevent="selectPath(p)">{{ p }}</li>
            </ul>
          </div>
          <label>参数</label>
          <textarea v-model="miniParams" placeholder="输入参数，如 key=value&key2=value2" class="url-input" rows="3"></textarea>
        </template>
        <template v-else>
          <label>输入路径或链接</label>
          <textarea
            v-model="input"
            placeholder="例如: https://wenku.baidu.com/xxx 或自定义路径"
            class="url-input"
            rows="3"
          ></textarea>
        </template>
      </div>

      <div class="output-section">
        <div v-if="qrDataUrl" class="qr-preview">
          <img :src="qrDataUrl" alt="QR Code" />
          <button class="btn-download" @click="download">下载二维码</button>
        </div>
        <div v-else class="qr-placeholder">
          <span class="placeholder-icon">⊞</span>
          <span>输入内容后自动生成二维码</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./index.scss"></style>
