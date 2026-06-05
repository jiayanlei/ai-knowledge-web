<template>
  <section class="dashboard-card ops-card">
    <div class="card-header card-header--compact">
      <h2>知识运营工作台</h2>
      <span class="ops-date">今日更新 09:30</span>
    </div>

    <div class="ops-layout">
      <div class="ops-section ops-progress">
        <div class="ops-section-title">
          <AppIcon name="TrendCharts" />
          <span>知识建设进度</span>
        </div>

        <div class="progress-total">
          <strong>78%</strong>
          <span>本月目标完成度</span>
        </div>

        <div class="progress-line">
          <i />
        </div>

        <div class="progress-stats">
          <span>
            <em>36</em>
            新增文档
          </span>
          <span>
            <em>12</em>
            已审核
          </span>
          <span>
            <em>4</em>
            待补充
          </span>
        </div>
      </div>

      <div class="ops-section">
        <div class="ops-section-title">
          <AppIcon name="Memo" />
          <span>今日待办</span>
        </div>

        <ul class="todo-list">
          <li v-for="todo in todos" :key="todo.title">
            <span class="todo-dot" :class="`todo-dot--${todo.type}`" />
            <div>
              <strong>{{ todo.title }}</strong>
              <em>{{ todo.desc }}</em>
            </div>
            <b>{{ todo.count }}</b>
          </li>
        </ul>
      </div>

      <div class="ops-section service-section">
        <div class="ops-section-title">
          <AppIcon name="Connection" />
          <span>AI 服务状态</span>
        </div>

        <div class="service-grid">
          <div v-for="item in services" :key="item.label">
            <span :class="`service-dot service-dot--${item.type}`" />
            <strong>{{ item.value }}</strong>
            <em>{{ item.label }}</em>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'

const todos = [
  { title: '待审核文档', desc: '制度类文档需要人工确认', count: 6, type: 'warning' },
  { title: '低命中问题', desc: '补充相似问法和标准答案', count: 9, type: 'primary' },
  { title: '过期知识提醒', desc: '超过 180 天未维护', count: 3, type: 'danger' }
]

const services = [
  { label: '问答服务', value: '正常', type: 'success' },
  { label: '检索索引', value: '98%', type: 'primary' },
  { label: '解析队列', value: '4 个', type: 'warning' },
  { label: '平均响应', value: '1.2s', type: 'success' }
]
</script>

<style scoped lang="scss">
.ops-card {
  min-height: 178px;
}

.ops-date {
  color: #94a3b8;
  font-size: 12px;
}

.ops-layout {
  display: grid;
  grid-template-columns: 1.05fr 1.2fr 1fr;
  gap: 14px;
}

.ops-section {
  min-width: 0;
  padding: 16px;
  border: 1px solid #e6eef8;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
}

.ops-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #172554;
  font-size: 15px;
  font-weight: 800;

  :deep(.app-icon) {
    width: 18px;
    height: 18px;
    color: #2563eb;
  }
}

.progress-total {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-top: 18px;

  strong {
    color: #2563eb;
    font-size: 32px;
    line-height: 1;
  }

  span {
    color: #64748b;
    font-size: 13px;
  }
}

.progress-line {
  height: 10px;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 999px;
  background: #eaf3ff;

  i {
    display: block;
    width: 78%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #60a5fa, #2563eb);
  }
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;

  span {
    color: #64748b;
    font-size: 12px;
    text-align: center;
  }

  em {
    display: block;
    margin-bottom: 4px;
    color: #172554;
    font-size: 18px;
    font-style: normal;
    font-weight: 800;
  }
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: 10px minmax(0, 1fr) 38px;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  strong,
  em {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #1f2a44;
    font-size: 13px;
  }

  em {
    margin-top: 3px;
    color: #64748b;
    font-size: 12px;
    font-style: normal;
  }

  b {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    border-radius: 7px;
    color: #2563eb;
    background: #eaf3ff;
    font-size: 13px;
  }
}

.todo-dot,
.service-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.todo-dot--primary,
.service-dot--primary {
  background: #2563eb;
}

.todo-dot--warning,
.service-dot--warning {
  background: #f97316;
}

.todo-dot--danger {
  background: #ef4444;
}

.service-dot--success {
  background: #10b981;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;

  div {
    position: relative;
    min-width: 0;
    padding: 13px 12px 13px 28px;
    border-radius: 10px;
    background: #f6f9ff;
  }

  .service-dot {
    position: absolute;
    top: 18px;
    left: 12px;
  }

  strong,
  em {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #172554;
    font-size: 16px;
  }

  em {
    margin-top: 5px;
    color: #64748b;
    font-size: 12px;
    font-style: normal;
  }
}

@media (max-width: 1180px) {
  .ops-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .ops-section {
    padding: 14px;
  }

  .progress-stats,
  .service-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
