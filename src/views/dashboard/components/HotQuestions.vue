<template>
  <section class="dashboard-card table-card">
    <div class="card-header card-header--compact">
      <h2>热门问题</h2>
      <a href="javascript:void(0)">查看全部 <AppIcon name="ArrowRight" /></a>
    </div>

    <table class="dashboard-table question-table">
      <thead>
        <tr>
          <th>问题</th>
          <th>提问次数</th>
          <th>命中率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in questions" :key="item.question">
          <td>
            <span class="row-index">{{ index + 1 }}</span>
            <span class="question-text">{{ item.question }}</span>
          </td>
          <td>
            <span class="count-tag">{{ item.count }}</span>
          </td>
          <td>
            <strong>{{ item.hitRate }}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'

const questions = [
  { question: '新员工入职流程是怎样的？', count: 128, hitRate: '98%' },
  { question: '请问年假如何申请？需要哪些审批？', count: 96, hitRate: '97%' },
  { question: '差旅报销需要提供哪些材料？', count: 84, hitRate: '96%' },
  { question: '公司加班政策是怎样规定的？', count: 76, hitRate: '94%' },
  { question: '如何申请调岗或部门内部调动？', count: 65, hitRate: '93%' }
]
</script>

<style scoped lang="scss">
.question-table {
  th:nth-child(2),
  td:nth-child(2),
  th:nth-child(3),
  td:nth-child(3) {
    width: 116px;
    text-align: center;
  }

  td:first-child {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  strong {
    color: #0faa69;
    font-weight: 800;
  }
}

.row-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 22px;
  width: 22px;
  height: 22px;
  margin-right: 12px;
  border-radius: 6px;
  color: #2563eb;
  background: #eaf3ff;
  font-size: 12px;
  font-weight: 800;
}

.question-text {
  min-width: 0;
  overflow: hidden;
  color: #334155;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 22px;
  border-radius: 6px;
  color: #2563eb;
  background: #eaf3ff;
  font-weight: 800;
}
</style>
