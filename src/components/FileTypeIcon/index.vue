<template>
  <span class="file-type-icon" :class="typeClass">{{ normalizedType }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: string
}>()

const normalizedType = computed(() => props.type.replace('.', '').toUpperCase())
const typeClass = computed(() => `file-type-icon--${normalizedType.value.toLowerCase()}`)
</script>

<style scoped lang="scss">
.file-type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  color: #1677ff;
  font-size: 11px;
  font-weight: 800;
  background: #edf5ff;
}

.file-type-icon--pdf {
  color: #ef4444;
  background: #fff1f2;
}

.file-type-icon--xlsx {
  color: #16a34a;
  background: #ecfdf3;
}

.file-type-icon--vsdx {
  color: #7c3aed;
  background: #f4f0ff;
}
</style>
