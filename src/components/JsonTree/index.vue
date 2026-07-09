<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'JsonTree' })

const props = defineProps({
  data: { type: [Object, Array, String, Number, Boolean, null], default: null },
  label: { type: String, default: '' },
  root: { type: Boolean, default: false }
})

const collapsed = ref(false)

const isObject = computed(() => props.data !== null && typeof props.data === 'object')
const isArray = computed(() => Array.isArray(props.data))
const entries = computed(() => {
  if (!isObject.value) return []
  return Object.entries(props.data)
})
const bracketOpen = computed(() => isArray.value ? '[' : '{')
const bracketClose = computed(() => isArray.value ? ']' : '}')
const itemCount = computed(() => entries.value.length)

function toggle() {
  collapsed.value = !collapsed.value
}

function valueType(val) {
  if (val === null) return 'null'
  if (typeof val === 'string') return 'string'
  if (typeof val === 'number') return 'number'
  if (typeof val === 'boolean') return 'boolean'
  return 'object'
}

function formatValue(val) {
  if (val === null) return 'null'
  if (typeof val === 'string') return `"${val}"`
  return String(val)
}
</script>

<template>
  <div class="json-tree" :class="{ root }">
    <template v-if="isObject">
      <span class="toggle" @click="toggle">{{ collapsed ? '▶' : '▼' }}</span>
      <span v-if="label" class="key">"{{ label }}"</span>
      <span v-if="label" class="colon">: </span>
      <span class="bracket">{{ bracketOpen }}</span>
      <span v-if="collapsed" class="collapsed-hint" @click="toggle">
        {{ itemCount }} items
      </span>
      <span v-if="collapsed" class="bracket">{{ bracketClose }}</span>
      <div v-if="!collapsed" class="children">
        <div v-for="([key, val], i) in entries" :key="key" class="entry">
          <JsonTree :data="val" :label="isArray ? '' : key" />
        </div>
      </div>
      <span v-if="!collapsed" class="bracket close-bracket">{{ bracketClose }}</span>
    </template>
    <template v-else>
      <span v-if="label" class="key">"{{ label }}"</span>
      <span v-if="label" class="colon">: </span>
      <span :class="['value', 'type-' + valueType(data)]">{{ formatValue(data) }}</span>
    </template>
  </div>
</template>

<style scoped lang="scss" src="./index.scss"></style>
