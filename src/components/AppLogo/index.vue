<template>
  <div class="app-logo" :class="[`app-logo--${mode}`, { compact }]">
    <img class="logo-icon" :src="logoIcon" alt="智能体系知识问答" />
    <span v-if="!compact" class="logo-text">智能体系知识问答</span>
  </div>
</template>

<script setup lang="ts">
import logoIcon from '@/assets/images/logo/logo-ai-core.png'

withDefaults(
  defineProps<{
    compact?: boolean
    mode?: 'header' | 'sidebar'
  }>(),
  {
    compact: false,
    mode: 'header'
  }
)
</script>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.logo-icon {
  flex: 0 0 auto;
  width: 55px;
  height: 55px;
  object-fit: contain;
}

.logo-text {
  color: #07163a;
  font-size: 20px;
  font-family: cursive;
  font-weight: 800;
  letter-spacing: 0;
  white-space: nowrap;
}

.app-logo--sidebar {
  .logo-icon {
    width: 55px;
    height: 55px;
  }

  .logo-text {
    font-size: 21px;
  }
}

:global(html.dark .app-header) .logo-text {
  color: #f8fafc;
}

@media (prefers-color-scheme: dark) {
  :global(.app-header) .logo-text {
    color: #f8fafc;
  }
}

@media (max-width: 760px) {
  .logo-icon {
    width: 34px;
    height: 34px;
  }

  .logo-text {
    max-width: 128px;
    overflow: hidden;
    font-size: 16px;
    text-overflow: ellipsis;
  }
}
</style>
