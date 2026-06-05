<template>
  <section class="quick-actions app-card">
    <div class="section-title">
      <span>快速操作</span>
    </div>

    <div class="action-list">
      <button v-for="action in actions" :key="action.title" class="action-item" type="button">
        <span>
          <AppIcon :name="action.icon" />
        </span>
        {{ action.title }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { QuickActionItem } from '@/views/ai-chat/mock'

defineProps<{
  actions: QuickActionItem[]
}>()
</script>

<style scoped lang="scss">
.quick-actions {
  padding: 16px;
  overflow: hidden;
}

.action-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  min-width: 0;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  height: 74px;
  padding: 0 4px;
  border: 1px solid #e5eaf3;
  border-radius: 12px;
  color: #344054;
  font-size: 13px;
  font-weight: 700;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
}

.action-item:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #f8fbff;
}

.action-item span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  color: #1677ff;
  background: #eaf3ff;
}
</style>
