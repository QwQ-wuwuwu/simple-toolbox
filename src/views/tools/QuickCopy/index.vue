<script setup>
import { ref } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

function isUrl(text) {
  return /^https?:\/\/\S+$/i.test(text.trim())
}

const STORAGE_KEY = 'quick-copy-items'

const items = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const newName = ref('')
const newContent = ref('')
const toast = ref('')
const showDialog = ref(false)
const editingIndex = ref(-1)

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
}

function openDialog() {
  newName.value = ''
  newContent.value = ''
  editingIndex.value = -1
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  editingIndex.value = -1
}

function editItem(index) {
  newName.value = items.value[index].name
  newContent.value = items.value[index].content
  editingIndex.value = index
  showDialog.value = true
}

function addItem() {
  if (!newName.value.trim() || !newContent.value.trim()) return
  if (editingIndex.value >= 0) {
    items.value[editingIndex.value] = { name: newName.value.trim(), content: newContent.value.trim() }
  } else {
    items.value.push({ name: newName.value.trim(), content: newContent.value.trim() })
  }
  save()
  closeDialog()
}

function removeItem(index) {
  items.value.splice(index, 1)
  save()
}

function copyItem(content) {
  copyToClipboard(content).then(() => {
    toast.value = '复制成功'
    setTimeout(() => { toast.value = '' }, 1500)
  })
}

// 拖拽排序
const dragIndex = ref(-1)

function onDragStart(index) {
  dragIndex.value = index
}

function onDragOver(e, index) {
  e.preventDefault()
  if (dragIndex.value === index) return
  const dragged = items.value.splice(dragIndex.value, 1)[0]
  items.value.splice(index, 0, dragged)
  dragIndex.value = index
}

function onDragEnd() {
  dragIndex.value = -1
  save()
}
</script>

<template>
  <div class="quick-copy">
    <div v-if="toast" class="toast">{{ toast }}</div>
    <div class="toolbar">
      <h2>快速复制</h2>
      <button class="btn-add" @click="openDialog">+ 添加</button>
    </div>

    <div class="card-grid">
      <div
        v-for="(item, index) in items"
        :key="item.name + index"
        class="card"
        :class="{ dragging: dragIndex === index }"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover="onDragOver($event, index)"
        @dragend="onDragEnd"
      >
        <div class="card-header">
          <span class="card-name">{{ item.name }}</span>
          <button class="btn-delete" @click="removeItem(index)">&times;</button>
        </div>
        <div class="card-body">
          <a v-if="isUrl(item.content)" :href="item.content" target="_blank" rel="noopener" class="card-content card-link">{{ item.content }}</a>
          <pre v-else class="card-content">{{ item.content }}</pre>
        </div>
        <div class="card-footer">
          <button class="btn-edit" @click="editItem(index)">✎ 编辑</button>
          <button class="btn-copy" @click="copyItem(item.content)">复制</button>
        </div>
      </div>
      <div v-if="!items.length" class="empty">暂无复制项，点击右上角添加</div>
    </div>

    <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
      <div class="dialog">
        <h3>{{ editingIndex >= 0 ? '编辑复制项' : '添加复制项' }}</h3>
        <label>名称</label>
        <input v-model="newName" placeholder="输入名称" />
        <label>内容</label>
        <textarea v-model="newContent" placeholder="输入复制内容（支持多行）" rows="5"></textarea>
        <div class="dialog-actions">
          <button class="btn-secondary" @click="closeDialog">取消</button>
          <button @click="addItem">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./index.scss"></style>
