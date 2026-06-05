<template>
  <section class="source-card app-card">
    <div class="section-title">
      <span>引用来源</span>
      <el-button link type="primary">查看全部</el-button>
    </div>

    <div class="source-list">
      <div v-for="source in sources" :key="source.id" class="source-item">
        <FileTypeIcon :type="source.type" />
        <div class="source-info">
          <span class="source-title">{{ source.title }}</span>
          <span class="source-path">{{ source.path }}</span>
        </div>
        <div class="source-action">
          <span class="match-rate">置信度 {{ source.matchRate }}%</span>
          <el-button link type="primary">查看原文</el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FileTypeIcon from '@/components/FileTypeIcon/index.vue'
import type { SourceReference } from '@/types/chat'

defineProps<{
  sources: SourceReference[]
}>()
</script>

<style scoped lang="scss">
.source-card {
  padding: 18px;
}

.source-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.source-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  background: #fff;
}

.source-info {
  flex: 1;
  min-width: 0;
}

.source-title {
  display: block;
  margin-bottom: 4px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.source-path {
  display: block;
  color: #667085;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.source-action {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  flex: 0 0 auto;
  gap: 5px;
}

.match-rate {
  color: #10a37f;
  font-size: 12px;
  font-weight: 700;
}
</style>
