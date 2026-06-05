<template>
  <section class="info-card app-card">
    <div class="section-title">
      <span>最近更新</span>
      <el-button link type="primary">查看更多</el-button>
    </div>

    <div class="update-list">
      <div v-for="item in updates" :key="item.id" class="update-item">
        <FileTypeIcon :type="item.type" />
        <span class="update-title">{{ item.title }}</span>
        <span class="update-author">{{ item.author }}</span>
        <span class="update-time">{{ item.time }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FileTypeIcon from '@/components/FileTypeIcon/index.vue'
import type { RecentUpdate } from '@/views/ai-chat/mock'

defineProps<{
  updates: RecentUpdate[]
}>()
</script>

<style scoped lang="scss">
.info-card {
  padding: 18px;
}

.update-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.update-item {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 9px;
  color: #344054;
  font-size: 13px;
}

.update-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.update-author,
.update-time {
  color: #667085;
  font-size: 12px;
  white-space: nowrap;
}
</style>
