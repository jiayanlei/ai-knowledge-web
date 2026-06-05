<template>
  <section class="overview-card app-card">
    <div class="section-title">
      <span>知识概览</span>
    </div>

    <div class="stats">
      <div v-for="item in overview" :key="item.label" class="stat-item">
        <span class="stat-icon">
          <AppIcon :name="item.icon || 'DataAnalysis'" />
        </span>
        <div class="stat-main">
          <span class="stat-label">{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <span v-if="item.trend" class="stat-trend">{{ item.trend }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { KnowledgeOverviewItem } from '@/types/knowledge'

defineProps<{
  overview: KnowledgeOverviewItem[]
}>()
</script>

<style scoped lang="scss">
.overview-card {
  padding: 16px;
  overflow: hidden;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  min-width: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 12px 8px;
  border-radius: 12px;
  text-align: center;
  background: #f8fbff;
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 34px;
  height: 34px;
  border-radius: 10px;
  color: #1677ff;
  background: #eaf3ff;
}

.stat-main {
  width: 100%;
  min-width: 0;
}

.stat-label {
  display: block;
  color: #64748b;
  font-size: 12px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

strong {
  display: block;
  margin-top: 6px;
  color: #0f172a;
  font-size: 21px;
  line-height: 1.1;
  white-space: nowrap;
}

.stat-trend {
  display: block;
  margin-top: 6px;
  color: #16a34a;
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
}
</style>
