<template>
  <section class="dashboard-card table-card">
    <div class="card-header card-header--compact">
      <h2>最近更新文档</h2>
      <a href="javascript:void(0)">查看全部 <AppIcon name="ArrowRight" /></a>
    </div>

    <table class="dashboard-table docs-table">
      <thead>
        <tr>
          <th>文档名称</th>
          <th>更新人</th>
          <th>更新时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in docs" :key="doc.name">
          <td>
            <span class="file-icon" :class="`file-icon--${doc.type}`">{{ doc.typeLabel }}</span>
            <span class="doc-name">{{ doc.name }}</span>
          </td>
          <td>{{ doc.owner }}</td>
          <td>{{ doc.updatedAt }}</td>
          <td>
            <span class="status-tag" :class="`status-tag--${doc.statusType}`">{{ doc.status }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'

const docs = [
  {
    name: '新员工入职指引手册.docx',
    owner: '张伟',
    updatedAt: '今天 09:15',
    status: '已同步',
    statusType: 'success',
    type: 'word',
    typeLabel: 'W'
  },
  {
    name: '差旅报销管理规范.pdf',
    owner: '李娜',
    updatedAt: '昨天 16:40',
    status: '待审核',
    statusType: 'warning',
    type: 'pdf',
    typeLabel: 'PDF'
  },
  {
    name: '员工试用期管理办法.docx',
    owner: '王强',
    updatedAt: '2024-05-10 10:30',
    status: '已同步',
    statusType: 'success',
    type: 'word',
    typeLabel: 'W'
  },
  {
    name: '项目交付标准与验收清单.xlsx',
    owner: '赵敏',
    updatedAt: '2024-05-09 15:22',
    status: '解析中',
    statusType: 'info',
    type: 'excel',
    typeLabel: 'X'
  },
  {
    name: '公司组织架构图.vsdx',
    owner: '陈磊',
    updatedAt: '2024-05-08 11:05',
    status: '已同步',
    statusType: 'success',
    type: 'ppt',
    typeLabel: 'PPT'
  }
]
</script>

<style scoped lang="scss">
.docs-table {
  th:nth-child(2),
  td:nth-child(2) {
    width: 92px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 150px;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 86px;
    text-align: center;
  }

  td:first-child {
    display: flex;
    align-items: center;
    min-width: 0;
  }
}

.file-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 23px;
  width: 23px;
  height: 23px;
  margin-right: 10px;
  border-radius: 5px;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0;
}

.file-icon--word {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
}

.file-icon--pdf {
  background: linear-gradient(135deg, #ef4444, #fb7185);
}

.file-icon--excel {
  background: linear-gradient(135deg, #16a34a, #4ade80);
}

.file-icon--ppt {
  background: linear-gradient(135deg, #f97316, #fb4e4e);
}

.doc-name {
  min-width: 0;
  overflow: hidden;
  color: #334155;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 9px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-tag--success {
  color: #0faa69;
  background: #e7f8f0;
}

.status-tag--warning {
  color: #f97316;
  background: #fff3e8;
}

.status-tag--info {
  color: #1677ff;
  background: #eaf3ff;
}
</style>
