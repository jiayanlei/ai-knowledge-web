<template>
  <aside class="app-sidebar">
    <el-menu :default-active="activePath" router class="sidebar-menu">
      <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
        <AppIcon :name="item.icon" />
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>

    <div class="assistant-card">
      <span class="assistant-avatar-wrap">
        <RobotAvatar size="small" />
      </span>
      <div>
        <strong>AI助手小智</strong>
        <span>智能问答 · 快速准确</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/AppIcon/index.vue'
import RobotAvatar from '@/components/RobotAvatar/index.vue'
import { menuRoutes } from '@/config/route'

const route = useRoute()
const menus = menuRoutes
const activePath = computed(() => route.path)
</script>

<style scoped lang="scss">
.app-sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 var(--app-sidebar-width);
  width: var(--app-sidebar-width);
  height: 100%;
  padding: 12px 10px;
  border-right: 1px solid var(--app-border-color);
  background: #fff;
}

.sidebar-menu {
  flex: 1;
  min-height: 0;
  border-right: 0;
  overflow-y: auto;

  :deep(.el-menu-item) {
    height: 42px;
    margin-bottom: 3px;
    padding: 0 12px !important;
    border-radius: 8px;
    color: #344054;
    font-size: 14px;
    font-weight: 600;
    gap: 10px;
  }

  :deep(.app-icon) {
    width: 18px;
    height: 18px;
  }

  :deep(.el-menu-item.is-active) {
    color: #1677ff;
    background: linear-gradient(90deg, #eaf3ff, #f6faff);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.07);
  }
}

.assistant-card {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #e5eaf3;
  border-radius: 10px;
  background: linear-gradient(135deg, #f8fbff 0%, #ffffff 100%);
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.04);

  strong {
    display: block;
    color: #1f2a44;
    font-size: 12px;
    line-height: 1.3;
  }

  span {
    display: block;
    margin-top: 2px;
    color: #667085;
    font-size: 11px;
  }
}

.assistant-avatar-wrap {
  position: relative;
  flex: 0 0 auto;

  &::after {
    position: absolute;
    right: -1px;
    bottom: 2px;
    width: 8px;
    height: 8px;
    border: 2px solid #fff;
    border-radius: 50%;
    background: #22c55e;
    content: "";
  }
}

@media (max-width: 760px) {
  .app-sidebar {
    display: none;
  }
}
</style>
