<template>
  <article class="metric-card" :style="cardStyle">
    <div class="metric-icon">
      <AppIcon :name="icon" />
    </div>
    <div class="metric-content">
      <span class="metric-title">{{ title }}</span>
      <strong>{{ value }}</strong>
      <p>
        <span>{{ trend }}</span>
        <em>{{ change }}</em>
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon/index.vue'

const props = defineProps<{
  title: string
  value: string
  trend: string
  change: string
  color: string
  softColor: string
  icon: string
}>()

const cardStyle = computed(() => ({
  '--metric-color': props.color,
  '--metric-soft-color': props.softColor
}))
</script>

<style scoped lang="scss">
.metric-card {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 110px;
  padding: 20px 22px;
  border: 1px solid #e6eef8;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(29, 78, 216, 0.06);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: rgba(37, 99, 235, 0.2);
    box-shadow: 0 12px 24px rgba(29, 78, 216, 0.09);
    transform: translateY(-2px);
  }
}

.metric-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 56px;
  width: 56px;
  height: 56px;
  margin-right: 18px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 14px;
  color: var(--metric-color);
  background: var(--metric-soft-color);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);

  :deep(.app-icon) {
    width: 29px;
    height: 29px;
  }
}

.metric-content {
  min-width: 0;

  .metric-title {
    display: block;
    color: #334155;
    font-size: 15px;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #0f1b45;
    font-size: 30px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0;
  }

  p {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0 0;
    color: #64748b;
    font-size: 12px;
    white-space: nowrap;
  }

  em {
    color: #10a66d;
    font-style: normal;
    font-weight: 700;
  }
}

@media (max-width: 1320px) {
  .metric-card {
    padding: 18px;
  }
}
</style>
