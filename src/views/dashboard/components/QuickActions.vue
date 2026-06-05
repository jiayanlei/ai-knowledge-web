<template>
  <section class="dashboard-card quick-actions-card">
    <div class="card-header card-header--compact">
      <h2>快捷操作</h2>
    </div>

    <div class="quick-actions">
      <button
        v-for="action in actions"
        :key="action.title"
        type="button"
        class="quick-action"
        @click="goAction(action.path)"
      >
        <span class="quick-action-icon">
          <AppIcon :name="action.icon" />
        </span>
        <span class="quick-action-text">
          <strong>{{ action.title }}</strong>
          <em>{{ action.desc }}</em>
        </span>
        <AppIcon class="quick-action-arrow" name="ArrowRight" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon/index.vue'

const router = useRouter()
const actions = [
  { title: '上传文档', desc: '支持多种格式批量上传', icon: 'UploadFilled', path: '/document' },
  { title: '创建知识库', desc: '新建或导入知识库', icon: 'FolderAdd', path: '/knowledge-manage' },
  { title: '进入 AI 问答', desc: '向知识库提问获取答案', icon: 'Message', path: '/ai-chat' },
  { title: '高级检索', desc: '多条件组合检索文档', icon: 'Search', path: '/search' }
]

function goAction(path: string) {
  router.push(path)
}
</script>

<style scoped lang="scss">
.quick-actions-card {
  min-height: 120px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.quick-action {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 16px;
  min-width: 0;
  height: 76px;
  padding: 0 18px;
  border: 1px solid #e6eef8;
  border-radius: 12px;
  color: #172554;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: rgba(37, 99, 235, 0.22);
    box-shadow: 0 12px 24px rgba(29, 78, 216, 0.08);
    transform: translateY(-2px);

    .quick-action-arrow {
      transform: translateX(4px);
    }
  }
}

.quick-action-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  color: #1677ff;
  background: #eef6ff;

  :deep(.app-icon) {
    width: 29px;
    height: 29px;
  }
}

.quick-action-text {
  min-width: 0;

  strong,
  em {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #172554;
    font-size: 15px;
    font-weight: 800;
  }

  em {
    margin-top: 6px;
    color: #64748b;
    font-size: 12px;
    font-style: normal;
  }
}

.quick-action-arrow {
  width: 18px;
  height: 18px;
  color: #334155;
  transition: transform 0.2s ease;
}

@media (max-width: 1180px) {
  .quick-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .quick-actions {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
