<template>
  <div class="basic-layout">
    <AppHeader />
    <div class="layout-body">
      <AppSidebar />
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/layout/components/AppHeader.vue'
import AppMain from '@/layout/components/AppMain.vue'
import AppSidebar from '@/layout/components/AppSidebar.vue'
</script>

<style scoped lang="scss">
.basic-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--app-bg-color);
}

.layout-body {
  display: flex;
  min-width: 0;
  height: calc(100vh - var(--app-header-height));
}
</style>
