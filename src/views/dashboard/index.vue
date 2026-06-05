<template>
  <PageContainer>
    <div class="dashboard-page">
      <HomeBanner />

      <section class="metric-grid">
        <MetricCard
          v-for="metric in metrics"
          :key="metric.title"
          v-bind="metric"
        />
      </section>

      <section class="dashboard-grid dashboard-grid--tables">
        <HotQuestions />
        <RecentDocs />
      </section>

      <QuickActions />
      <KnowledgeOpsPanel />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer/index.vue'
import HomeBanner from '@/views/dashboard/components/HomeBanner.vue'
import HotQuestions from '@/views/dashboard/components/HotQuestions.vue'
import KnowledgeOpsPanel from '@/views/dashboard/components/KnowledgeOpsPanel.vue'
import MetricCard from '@/views/dashboard/components/MetricCard.vue'
import QuickActions from '@/views/dashboard/components/QuickActions.vue'
import RecentDocs from '@/views/dashboard/components/RecentDocs.vue'

const metrics = [
  {
    title: '知识库文档',
    value: '1,258',
    change: '↑ 28 (2.28%)',
    trend: '较昨日',
    color: '#7c3aed',
    softColor: '#f1eaff',
    icon: 'Document'
  },
  {
    title: '今日问答',
    value: '128',
    change: '↑ 12 (10.34%)',
    trend: '较昨日',
    color: '#10b981',
    softColor: '#e7f8f0',
    icon: 'ChatDotRound'
  },
  {
    title: '知识命中率',
    value: '96%',
    change: '↑ 5%',
    trend: '较昨日',
    color: '#1677ff',
    softColor: '#e8f2ff',
    icon: 'CircleCheckFilled'
  },
  {
    title: '待处理文档',
    value: '18',
    change: '↓ 3 (14.29%)',
    trend: '较昨日',
    color: '#f97316',
    softColor: '#fff0e5',
    icon: 'Tickets'
  }
]
</script>

<style scoped lang="scss">
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding-bottom: 4px;
  color: #172554;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  min-width: 0;
}

@media (max-width: 1180px) {
  .dashboard-page {
    gap: 10px;
  }

  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .dashboard-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .metric-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

<style lang="scss">
.dashboard-card {
  min-width: 0;
  padding: 14px;
  border: 1px solid #e6eef8;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(29, 78, 216, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
  margin-bottom: 8px;

  h2 {
    margin: 0;
    color: #172554;
    font-size: 16px;
    font-weight: 800;
    line-height: 1.4;
  }

  button,
  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex: 0 0 auto;
    border: 0;
    color: #2563eb;
    background: transparent;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  button {
    color: #64748b;
  }

  .app-icon {
    width: 14px;
    height: 14px;
  }
}

.card-header--compact {
  margin-bottom: 8px;
}

.table-card {
  min-height: 194px;
  padding: 12px 14px 10px;
}

.dashboard-table {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;
  color: #475569;
  font-size: 13px;

  thead {
    border-bottom: 1px solid #e6eef8;
  }

  th {
    height: 28px;
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
    text-align: left;
  }

  td {
    height: 32px;
    border-bottom: 1px solid rgba(230, 238, 248, 0.72);
    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.2s ease;

    &:hover {
      background: #f5f9ff;
    }

    &:last-child td {
      border-bottom: 0;
    }
  }
}

@media (max-width: 640px) {
  .dashboard-card {
    padding: 14px;
  }
}
</style>
