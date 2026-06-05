<template>
  <section class="info-card app-card">
    <div class="section-title">
      <span>相关文档</span>
      <el-button link type="primary">查看更多</el-button>
    </div>

    <div class="document-list">
      <div v-for="document in documents" :key="document.id" class="document-item">
        <FileTypeIcon :type="document.type" />
        <span class="document-title">{{ document.title }}</span>
        <span class="document-category">{{ document.category }}</span>
        <span class="document-date">{{ document.date }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FileTypeIcon from '@/components/FileTypeIcon/index.vue'
import type { RelatedDocument } from '@/views/ai-chat/mock'

defineProps<{
  documents: RelatedDocument[]
}>()
</script>

<style scoped lang="scss">
.info-card {
  padding: 18px;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.document-item {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 9px;
  color: #344054;
  font-size: 13px;
}

.document-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-category,
.document-date {
  color: #667085;
  font-size: 12px;
  white-space: nowrap;
}
</style>
