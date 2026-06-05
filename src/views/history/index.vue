<template>
  <PageContainer>
    <div class="insight-page">
      <!-- ===== 页面标题 ===== -->
      <header class="insight-header">
        <div class="header-copy">
          <div class="header-kicker"><span />QA INSIGHT</div>
          <h1>AI 问答洞察中心</h1>
          <p>沉淀员工问答记录、追踪知识引用来源、分析员工反馈、发现知识盲区，持续优化知识库质量。</p>
        </div>
      </header>

      <!-- ===== 顶部 4 卡片 ===== -->
      <section class="metric-grid">
        <article class="stat-card stat-card--questions">
          <div class="stat-icon"><AppIcon name="ChatLineRound" /></div>
          <div class="stat-body">
            <span class="stat-label">今日提问数</span>
            <strong>{{ metrics.todayQuestions }}</strong>
            <em class="stat-change stat-change--up">{{ metrics.todayChange }}</em>
          </div>
          <div class="stat-spark">
            <svg viewBox="0 0 64 24" fill="none"><polyline points="0,20 8,16 16,18 24,10 32,12 40,6 48,8 56,2 64,4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </article>

        <article class="stat-card stat-card--hit">
          <div class="stat-icon"><AppIcon name="Aim" /></div>
          <div class="stat-body">
            <span class="stat-label">知识命中率</span>
            <strong>{{ metrics.hitRate }}%</strong>
            <em class="stat-change stat-change--up">{{ metrics.hitRateChange }}</em>
          </div>
          <div class="stat-spark">
            <svg viewBox="0 0 64 24" fill="none"><polyline points="0,18 8,14 16,16 24,8 32,10 40,6 48,4 56,6 64,2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </article>

        <article class="stat-card stat-card--satisfaction">
          <div class="stat-icon"><AppIcon name="StarFilled" /></div>
          <div class="stat-body">
            <span class="stat-label">员工满意率</span>
            <strong>{{ metrics.satisfactionRate }}%</strong>
            <em class="stat-change stat-change--up">{{ metrics.satisfactionChange }}</em>
          </div>
          <div class="stat-spark">
            <svg viewBox="0 0 64 24" fill="none"><polyline points="0,16 8,18 16,12 24,14 32,8 40,10 48,4 56,6 64,2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </article>

        <article class="stat-card stat-card--optimize">
          <div class="stat-icon"><AppIcon name="Warning" /></div>
          <div class="stat-body">
            <span class="stat-label">待优化问题数</span>
            <strong>{{ metrics.pendingOptimize }}</strong>
            <em class="stat-change stat-change--down">{{ metrics.pendingChange }}</em>
          </div>
          <div class="stat-spark">
            <svg viewBox="0 0 64 24" fill="none"><polyline points="0,4 8,6 16,8 24,6 32,12 40,10 48,16 56,14 64,18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </article>
      </section>

      <!-- ===== 主体区域 ===== -->
      <section class="insight-body">
        <!-- 左 / 中：问答记录 -->
        <div class="record-section app-card">
          <!-- Tabs -->
          <el-tabs v-model="activeTab" class="record-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="全部记录" name="all" />
            <el-tab-pane label="知识命中" name="hit" />
            <el-tab-pane label="未命中问题" name="miss" />
            <el-tab-pane label="员工反馈" name="feedback" />
            <el-tab-pane label="知识盲区" name="blind" />
            <el-tab-pane label="热门问题" name="hot" />
          </el-tabs>

          <!-- 筛选栏 -->
          <div class="filter-bar">
            <el-input v-model="filters.keyword" placeholder="搜索问题内容…" clearable class="filter-input" :prefix-icon="Search" />
            <el-select v-model="filters.department" placeholder="部门" clearable class="filter-select">
              <el-option v-for="d in departmentOptions" :key="d" :label="d" :value="d" />
            </el-select>
            <el-select v-model="filters.category" placeholder="分类" clearable class="filter-select">
              <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
            </el-select>
            <el-select v-if="activeTab !== 'blind' && activeTab !== 'hot'" v-model="filters.hitStatus" placeholder="命中状态" clearable class="filter-select filter-select--sm">
              <el-option v-for="h in hitStatusOptions" :key="h.value" :label="h.label" :value="h.value" />
            </el-select>
            <el-select v-if="activeTab !== 'blind' && activeTab !== 'hot'" v-model="filters.feedback" placeholder="反馈状态" clearable class="filter-select filter-select--sm">
              <el-option v-for="f in feedbackStatusOptions" :key="f.value" :label="f.label" :value="f.value" />
            </el-select>
            <el-select v-if="activeTab !== 'blind' && activeTab !== 'hot'" v-model="filters.model" placeholder="模型" clearable class="filter-select filter-select--sm">
              <el-option v-for="m in modelOptions" :key="m" :label="m" :value="m" />
            </el-select>
            <el-date-picker v-if="activeTab !== 'blind' && activeTab !== 'hot'" v-model="filters.dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" class="filter-date" size="default" value-format="YYYY-MM-DD" />
            <el-button type="primary" :icon="SearchIcon" @click="handleSearch" plain>查询</el-button>
            <el-button :icon="RefreshRight" @click="handleReset" plain>重置</el-button>
          </div>

          <!-- 记录表格 -->
          <div class="record-table-wrap">
            <el-table :data="displayRecords" stripe class="record-table" :header-cell-style="{ background: '#f8faff', color: '#475569', fontWeight: 600, fontSize: '13px' }" empty-text="暂无问答记录">
              <el-table-column label="提问内容" min-width="240" show-overflow-tooltip>
                <template #default="{ row }">
                  <span class="question-text" @click="openDetail(row)">{{ row.title || row.question }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提问人" width="90" prop="questioner" />
              <el-table-column label="部门" width="110" prop="department" show-overflow-tooltip />
              <el-table-column label="分类" width="90" prop="category" show-overflow-tooltip />
              <el-table-column label="命中" width="80" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.hitKnowledge" type="success" size="small" effect="light">已命中</el-tag>
                  <el-tag v-else type="warning" size="small" effect="light">未命中</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="引用数" width="70" align="center">
                <template #default="{ row }">
                  <span :class="{ 'ref-zero': row.references.length === 0 }">{{ row.references.length }}</span>
                </template>
              </el-table-column>
              <el-table-column label="质量分" width="90" align="center">
                <template #default="{ row }">
                  <span class="quality-score" :class="qualityClass(row.qualityScore)">{{ row.qualityScore }}</span>
                  <el-tag v-if="row.qualityScore < 60" type="danger" size="small" class="optimize-tag">需优化</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="反馈" width="80" align="center">
                <template #default="{ row }">
                  <el-tag :type="feedbackTagType(row.feedback)" size="small" effect="plain">{{ feedbackLabel(row.feedback) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="模型" width="130" prop="model" show-overflow-tooltip />
              <el-table-column label="提问时间" width="160" prop="askTime" show-overflow-tooltip />
              <el-table-column label="操作" width="90" fixed="right" align="center">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openDetail(row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 知识盲区视图 -->
          <div v-if="activeTab === 'blind'" class="blind-spot-list">
            <div class="section-title">高频未命中问题</div>
            <div v-for="spot in blindSpots" :key="spot.id" class="blind-item">
              <div class="blind-info">
                <span class="blind-question">{{ spot.question }}</span>
                <div class="blind-meta">
                  <el-tag type="warning" size="small" effect="plain">提问 {{ spot.askCount }} 次</el-tag>
                  <span class="blind-time">最近: {{ spot.lastAskTime }}</span>
                </div>
              </div>
              <el-button type="primary" size="small" plain @click="handleGenerateKnowledge(spot)">生成知识条目</el-button>
            </div>
          </div>

          <!-- 热门问题视图 -->
          <div v-if="activeTab === 'hot'" class="hot-question-list">
            <div class="section-title">热门问题 TOP 5</div>
            <div v-for="(hq, idx) in hotQuestions" :key="hq.id" class="hot-item">
              <span class="hot-rank" :class="{ 'hot-rank--top': idx < 3 }">{{ idx + 1 }}</span>
              <div class="hot-info">
                <span class="hot-title">{{ hq.title }}</span>
                <div class="hot-meta">
                  <span>提问 {{ hq.askCount }} 次</span>
                  <el-tag type="success" size="small" effect="plain">满意率 {{ hq.satisfactionRate }}%</el-tag>
                  <el-tag type="primary" size="small" effect="plain">命中率 {{ hq.hitRate }}%</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右：洞察面板 -->
        <aside class="insight-panel">
          <!-- 知识盲区雷达 -->
          <div class="panel-card app-card">
            <div class="panel-card-header">
              <AppIcon name="View" />
              <h3>知识盲区雷达</h3>
            </div>
            <div class="blind-radar">
              <div v-for="spot in blindSpots.slice(0, 4)" :key="spot.id" class="radar-item">
                <span class="radar-question text-ellipsis">{{ spot.question }}</span>
                <div class="radar-meta">
                  <el-tag type="danger" size="small" effect="plain">{{ spot.askCount }} 次</el-tag>
                  <el-button type="primary" link size="small" @click="handleGenerateKnowledge(spot)">生成条目</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 热门问题 TOP 5 -->
          <div class="panel-card app-card">
            <div class="panel-card-header">
              <AppIcon name="TrendCharts" />
              <h3>热门问题 TOP 5</h3>
            </div>
            <div class="hot-mini-list">
              <div v-for="(hq, idx) in hotQuestions" :key="hq.id" class="hot-mini-item">
                <span class="hot-mini-rank">{{ idx + 1 }}</span>
                <div class="hot-mini-info">
                  <span class="text-ellipsis">{{ hq.title }}</span>
                  <small>{{ hq.askCount }} 次 · 满意 {{ hq.satisfactionRate }}%</small>
                </div>
              </div>
            </div>
          </div>

          <!-- 反馈驾驶舱 -->
          <div class="panel-card app-card">
            <div class="panel-card-header">
              <AppIcon name="DataAnalysis" />
              <h3>员工反馈驾驶舱</h3>
            </div>
            <div class="feedback-cockpit">
              <div class="feedback-bars">
                <div class="fb-row">
                  <span class="fb-label">满意</span>
                  <div class="fb-bar"><div class="fb-bar-fill fb-bar-fill--good" :style="{ width: feedbackStats.satisfiedRate + '%' }" /></div>
                  <span class="fb-pct">{{ feedbackStats.satisfiedRate }}%</span>
                </div>
                <div class="fb-row">
                  <span class="fb-label">一般</span>
                  <div class="fb-bar"><div class="fb-bar-fill fb-bar-fill--neutral" :style="{ width: feedbackStats.neutralRate + '%' }" /></div>
                  <span class="fb-pct">{{ feedbackStats.neutralRate }}%</span>
                </div>
                <div class="fb-row">
                  <span class="fb-label">不满意</span>
                  <div class="fb-bar"><div class="fb-bar-fill fb-bar-fill--bad" :style="{ width: feedbackStats.unsatisfiedRate + '%' }" /></div>
                  <span class="fb-pct">{{ feedbackStats.unsatisfiedRate }}%</span>
                </div>
              </div>
              <div class="feedback-reasons">
                <div class="section-title" style="font-size: 13px;">不满意原因</div>
                <div v-for="r in feedbackStats.topUnsatisfiedReasons" :key="r.reason" class="reason-row">
                  <span class="reason-text text-ellipsis">{{ r.reason }}</span>
                  <el-tag size="small" type="info" effect="plain">{{ r.count }} 次</el-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- AI 回答质量 -->
          <div class="panel-card app-card">
            <div class="panel-card-header">
              <AppIcon name="Medal" />
              <h3>AI 回答质量</h3>
            </div>
            <div class="quality-overview">
              <div class="quality-main">
                <div class="quality-ring">
                  <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#e8edf5" stroke-width="7" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="url(#qualityGrad)" stroke-width="7" stroke-linecap="round" :stroke-dasharray="`${qualityStats.avgScore * 2.136} 213.6`" transform="rotate(-90 40 40)" />
                    <defs><linearGradient id="qualityGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1" /><stop offset="100%" stop-color="#1677ff" /></linearGradient></defs>
                  </svg>
                  <span class="quality-ring-value">{{ qualityStats.avgScore }}</span>
                </div>
                <span class="quality-ring-label">平均质量分</span>
              </div>
              <div class="quality-stats">
                <div class="qs-item qs-item--good">
                  <strong>{{ qualityStats.excellentCount }}</strong>
                  <span>优质回答</span>
                </div>
                <div class="qs-item qs-item--bad">
                  <strong>{{ qualityStats.needsImproveCount }}</strong>
                  <span>待优化</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <!-- ===== 详情抽屉 ===== -->
      <el-drawer v-model="drawerVisible" title="问答详情" size="580px" direction="rtl" :destroy-on-close="true">
        <template v-if="currentRecord">
          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="User" /> 员工问题</h3>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="提问人">{{ currentRecord.questioner }}</el-descriptions-item>
              <el-descriptions-item label="工号">{{ currentRecord.employeeId }}</el-descriptions-item>
              <el-descriptions-item label="部门">{{ currentRecord.department }}</el-descriptions-item>
              <el-descriptions-item label="提问时间">{{ currentRecord.askTime }}</el-descriptions-item>
              <el-descriptions-item label="问题内容" :span="2">{{ currentRecord.question }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="ChatDotRound" /> AI 回答</h3>
            <div class="answer-block">
              <pre class="answer-text">{{ currentRecord.answer }}</pre>
              <div class="answer-meta">
                <el-tag size="small" effect="plain">{{ currentRecord.model }}</el-tag>
                <span>响应 {{ currentRecord.responseTime }}s</span>
                <span>{{ currentRecord.tokens }} tokens</span>
                <span class="quality-score-inline" :class="qualityClass(currentRecord.qualityScore)">质量分 {{ currentRecord.qualityScore }}</span>
              </div>
            </div>
          </div>

          <div v-if="currentRecord.references.length > 0" class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="Link" /> 引用来源（{{ currentRecord.references.length }}）</h3>
            <div class="ref-card-list">
              <div v-for="ref in currentRecord.references" :key="ref.id" class="ref-card app-card">
                <div class="ref-header">
                  <span class="ref-doc-name">{{ ref.docName }}</span>
                  <el-tag size="small" type="info" effect="plain">{{ ref.category }}</el-tag>
                </div>
                <p class="ref-snippet">{{ ref.snippet }}</p>
                <div class="ref-footer">
                  <span class="ref-similarity">相似度 <strong>{{ (ref.similarity * 100).toFixed(0) }}%</strong></span>
                  <el-button type="primary" link size="small" @click="ElMessage.info('查看原文功能待接入')">查看原文</el-button>
                </div>
              </div>
            </div>
          </div>

          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="ChatLineSquare" /> 员工反馈</h3>
            <div class="feedback-display">
              <el-tag :type="feedbackTagType(currentRecord.feedback)" effect="light" size="default">{{ feedbackLabel(currentRecord.feedback) }}</el-tag>
              <span v-if="currentRecord.feedbackContent" class="feedback-text">{{ currentRecord.feedbackContent }}</span>
              <span v-if="currentRecord.feedbackTime" class="feedback-time">{{ currentRecord.feedbackTime }}</span>
              <span v-if="currentRecord.feedback === 'none'" class="feedback-text muted-text">员工暂未提交反馈</span>
            </div>
          </div>

          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="Setting" /> 管理员处理</h3>
            <div class="admin-section">
              <div class="admin-status-row">
                <span>当前状态：</span>
                <el-tag :type="adminStatusType(currentRecord.adminStatus)" effect="light">{{ adminStatusLabel(currentRecord.adminStatus) }}</el-tag>
              </div>
              <el-input v-model="currentRecord.adminNote" type="textarea" :rows="2" placeholder="管理员备注…" class="admin-note" />
              <div class="admin-actions">
                <el-button type="primary" size="small" @click="handlePrecipitate(currentRecord)">
                  <AppIcon name="MagicStick" /> 一键沉淀为知识
                </el-button>
                <el-button size="small" @click="handleAdminAction('added_to_kb')">加入知识库</el-button>
                <el-button size="small" @click="handleAdminAction('marked_invalid')">标记为知识盲区</el-button>
                <el-button size="small" @click="handleAdminAction('transferred')">转人工处理</el-button>
                <el-button size="small" @click="handleAdminAction('ignored')">忽略</el-button>
              </div>
            </div>
          </div>
        </template>
      </el-drawer>

      <!-- ===== 知识沉淀弹窗 ===== -->
      <el-dialog v-model="precipitateVisible" title="沉淀为知识条目" width="560px" :close-on-click-modal="false" destroy-on-close>
        <el-form :model="precipitateForm" label-width="100px" class="precipitate-form">
          <el-form-item label="知识标题">
            <el-input v-model="precipitateForm.title" placeholder="自动生成" />
          </el-form-item>
          <el-form-item label="知识分类">
            <el-select v-model="precipitateForm.category" placeholder="请选择分类" class="full-width">
              <el-option v-for="c in knowledgeCategoryOptions" :key="c" :label="c" :value="c" />
            </el-select>
          </el-form-item>
          <el-form-item label="知识内容">
            <el-input v-model="precipitateForm.content" type="textarea" :rows="6" placeholder="从问答记录中自动提取" />
          </el-form-item>
          <el-form-item label="来源问答">
            <el-tag type="info" effect="plain">{{ precipitateForm.sourceId }}</el-tag>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-tag type="warning" effect="light">待审核</el-tag>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="precipitateVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePrecipitateSave">保存为知识草稿</el-button>
        </template>
      </el-dialog>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  getQaRecordsMock,
  getBlindSpotsMock,
  getHotQuestionsMock,
  getFeedbackStatsMock,
  getQualityStatsMock,
  getOverviewMetricsMock,
  departmentOptions,
  categoryOptions,
  modelOptions,
  hitStatusOptions,
  feedbackStatusOptions,
  knowledgeCategoryOptions,
  type QaRecord,
  type BlindSpot
} from './mock'

// ===== 数据初始化 =====
const allRecords = ref(getQaRecordsMock())
const blindSpots = ref(getBlindSpotsMock())
const hotQuestions = ref(getHotQuestionsMock())
const feedbackStats = ref(getFeedbackStatsMock())
const qualityStats = ref(getQualityStatsMock())
const metrics = ref(getOverviewMetricsMock())

// ===== 筛选与 Tab =====
const activeTab = ref('all')
const SearchIcon = Search

const filters = reactive({
  keyword: '',
  department: '',
  category: '',
  hitStatus: '',
  feedback: '',
  model: '',
  dateRange: null as string[] | null
})

const filteredRecords = computed(() => {
  let list = allRecords.value.slice()
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    list = list.filter(r => r.question.toLowerCase().includes(kw) || r.questioner.includes(kw) || r.employeeId.toLowerCase().includes(kw))
  }
  if (filters.department) list = list.filter(r => r.department === filters.department)
  if (filters.category) list = list.filter(r => r.category === filters.category)
  if (filters.hitStatus) list = list.filter(r => (filters.hitStatus === 'hit' ? r.hitKnowledge : !r.hitKnowledge))
  if (filters.feedback) list = list.filter(r => r.feedback === filters.feedback)
  if (filters.model) list = list.filter(r => r.model === filters.model)
  if (filters.dateRange && filters.dateRange.length === 2) {
    const [start, end] = filters.dateRange
    list = list.filter(r => r.askTime >= start && r.askTime <= end + ' 23:59:59')
  }
  return list
})

const displayRecords = computed(() => {
  if (activeTab.value === 'blind' || activeTab.value === 'hot') return []
  const base = filteredRecords.value
  switch (activeTab.value) {
    case 'hit': return base.filter(r => r.hitKnowledge)
    case 'miss': return base.filter(r => !r.hitKnowledge)
    case 'feedback': return base.filter(r => r.feedback !== 'none')
    default: return base
  }
})

function handleTabChange() {
  // 切换 tab 时不重置筛选
}

function handleSearch() {
  // 响应式已经自动过滤
}

function handleReset() {
  filters.keyword = ''
  filters.department = ''
  filters.category = ''
  filters.hitStatus = ''
  filters.feedback = ''
  filters.model = ''
  filters.dateRange = null
}

// ===== 标签辅助 =====
function feedbackLabel(fb: string): string {
  const map: Record<string, string> = { satisfied: '满意', neutral: '一般', unsatisfied: '不满意', none: '未反馈' }
  return map[fb] || fb
}

function feedbackTagType(fb: string): 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = { satisfied: 'success', neutral: 'warning', unsatisfied: 'danger', none: 'info' }
  return map[fb] || 'info'
}

function qualityClass(score: number): string {
  if (score >= 85) return 'quality--high'
  if (score >= 60) return 'quality--mid'
  return 'quality--low'
}

function adminStatusLabel(status: string): string {
  const map: Record<string, string> = { pending: '待处理', added_to_kb: '已加入知识库', marked_invalid: '已标记为无效问题', transferred: '已转人工处理', ignored: '已忽略' }
  return map[status] || status
}

function adminStatusType(status: string): 'warning' | 'success' | 'info' | 'danger' {
  const map: Record<string, 'warning' | 'success' | 'info' | 'danger'> = { pending: 'warning', added_to_kb: 'success', marked_invalid: 'info', transferred: 'danger', ignored: 'info' }
  return map[status] || 'info'
}

// ===== 详情抽屉 =====
const drawerVisible = ref(false)
const currentRecord = ref<QaRecord | null>(null)

function openDetail(row: QaRecord) {
  currentRecord.value = { ...row }
  drawerVisible.value = true
}

function handleAdminAction(action: string) {
  if (currentRecord.value) {
    currentRecord.value.adminStatus = action as any
    ElMessage.success(`已更新处理状态为：${adminStatusLabel(action)}`)
  }
}

// ===== 知识沉淀 =====
const precipitateVisible = ref(false)
const precipitateForm = reactive({
  title: '',
  category: '',
  content: '',
  sourceId: ''
})

function handlePrecipitate(record: QaRecord) {
  precipitateForm.title = record.question
  precipitateForm.category = record.category || ''
  precipitateForm.content = record.answer
  precipitateForm.sourceId = record.id
  precipitateVisible.value = true
}

function handleGenerateKnowledge(spot: BlindSpot) {
  precipitateForm.title = spot.question
  precipitateForm.category = ''
  precipitateForm.content = ''
  precipitateForm.sourceId = spot.id
  precipitateVisible.value = true
}

function handlePrecipitateSave() {
  precipitateVisible.value = false
  ElMessage.success('已保存为知识草稿，请前往知识库管理中审核。')
}
</script>

<style scoped lang="scss">
.insight-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding-bottom: 4px;
  color: #172554;
}

/* ===== 页面头部 ===== */
.insight-header {
  padding: 18px 22px;
  border-radius: var(--app-card-radius);
  background: linear-gradient(135deg, #1e3a5f 0%, #1a2980 50%, #26d0ce 100%);
  color: #fff;
  box-shadow: 0 6px 20px rgba(26, 41, 128, 0.25);

  .header-kicker {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.7;

    span {
      display: inline-block;
      width: 18px;
      height: 2px;
      border-radius: 1px;
      background: rgba(255, 255, 255, 0.5);
    }
  }

  h1 {
    margin: 0 0 4px;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }

  p {
    margin: 0;
    font-size: 13px;
    opacity: 0.8;
  }
}

/* ===== 顶部统计卡片 ===== */
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border: 1px solid #e6eef8;
  border-radius: var(--app-card-radius);
  background: #fff;
  box-shadow: 0 4px 14px rgba(29, 78, 216, 0.05);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover {
    border-color: rgba(37, 99, 235, 0.2);
    box-shadow: 0 10px 24px rgba(29, 78, 216, 0.08);
    transform: translateY(-2px);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 48px;
    width: 48px;
    height: 48px;
    border-radius: 12px;

    :deep(.app-icon) {
      width: 24px;
      height: 24px;
    }
  }

  .stat-body {
    min-width: 0;

    .stat-label {
      display: block;
      font-size: 13px;
      color: #475569;
      font-weight: 600;
    }

    strong {
      display: block;
      margin-top: 4px;
      font-size: 28px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.5px;
    }

    .stat-change {
      display: inline-block;
      margin-top: 6px;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
    }
  }

  .stat-spark {
    position: absolute;
    right: 12px;
    bottom: 10px;
    width: 56px;
    opacity: 0.18;

    svg {
      width: 100%;
    }
  }
}

.stat-card--questions {
  .stat-icon { background: #eef2ff; color: #6366f1; }
  .stat-spark { color: #6366f1; }
  strong { color: #4338ca; }
}

.stat-card--hit {
  .stat-icon { background: #ecfdf5; color: #10b981; }
  .stat-spark { color: #10b981; }
  strong { color: #059669; }
}

.stat-card--satisfaction {
  .stat-icon { background: #fffbeb; color: #f59e0b; }
  .stat-spark { color: #f59e0b; }
  strong { color: #d97706; }
}

.stat-card--optimize {
  .stat-icon { background: #fef2f2; color: #ef4444; }
  .stat-spark { color: #ef4444; }
  strong { color: #dc2626; }
}

.stat-change--up { color: #10b981; }
.stat-change--down { color: #ef4444; }

/* ===== 主体区域 ===== */
.insight-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 12px;
  min-width: 0;
}

/* ===== 记录区 ===== */
.record-section {
  padding: 16px 18px;
  min-width: 0;
  overflow: hidden;
}

.record-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 12px;
  }

  :deep(.el-tabs__item) {
    font-size: 13px;
    font-weight: 600;
  }
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
  align-items: center;
}

.filter-input {
  width: 220px;
}

.filter-select {
  width: 130px;

  &--sm {
    width: 115px;
  }
}

.filter-date {
  width: 260px;
}

/* 表格 */
.record-table-wrap {
  overflow-x: auto;
}

.record-table {
  width: 100%;
}

.question-text {
  color: #1e40af;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.ref-zero {
  color: #94a3b8;
}

.quality-score {
  font-weight: 700;
  font-size: 14px;
}

.quality--high { color: #059669; }
.quality--mid { color: #d97706; }
.quality--low { color: #dc2626; }

.optimize-tag {
  margin-left: 4px;
  transform: scale(0.9);
}

/* 知识盲区列表 */
.blind-spot-list {
  padding: 4px 0;
}

.blind-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  margin-bottom: 8px;
  border: 1px solid #fef3cd;
  border-radius: 10px;
  background: #fffdf5;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
  }

  .blind-question {
    font-weight: 600;
    color: #1f2937;
    font-size: 14px;
  }

  .blind-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
  }

  .blind-time {
    font-size: 12px;
    color: #94a3b8;
  }
}

/* 热门问题列表 */
.hot-question-list {
  padding: 4px 0;
}

.hot-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  margin-bottom: 8px;
  border: 1px solid #e0e7ff;
  border-radius: 10px;
  background: #fafbff;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
  }

  .hot-rank {
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-weight: 800;
    font-size: 14px;
    color: #94a3b8;
    background: #f1f5f9;

    &--top {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
    }
  }

  .hot-title {
    font-weight: 600;
    font-size: 14px;
    color: #1f2937;
  }

  .hot-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    font-size: 12px;
    color: #6b7280;
  }
}

/* ===== 洞察面板 ===== */
.insight-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.panel-card {
  padding: 14px 16px;

  .panel-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    :deep(.app-icon) {
      width: 18px;
      height: 18px;
      color: #6366f1;
    }

    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #1f2937;
    }
  }
}

/* 知识盲区雷达 */
.blind-radar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radar-item {
  .radar-question {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .radar-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

/* 热门问题迷你列表 */
.hot-mini-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hot-mini-item {
  display: flex;
  align-items: center;
  gap: 10px;

  .hot-mini-rank {
    flex: 0 0 22px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 800;
    color: #64748b;
    background: #f1f5f9;

    .hot-mini-item:first-child & { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; }
    .hot-mini-item:nth-child(2) & { background: #e0e7ff; color: #4f46e5; }
    .hot-mini-item:nth-child(3) & { background: #e0e7ff; color: #6366f1; }
  }

  .hot-mini-info {
    min-width: 0;
    flex: 1;

    span {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #1f2937;
    }

    small {
      font-size: 11px;
      color: #94a3b8;
    }
  }
}

/* 反馈驾驶舱 */
.feedback-cockpit {
  .feedback-bars {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 14px;
  }

  .fb-row {
    display: flex;
    align-items: center;
    gap: 8px;

    .fb-label {
      flex: 0 0 40px;
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }

    .fb-bar {
      flex: 1;
      height: 8px;
      border-radius: 4px;
      background: #f1f5f9;
      overflow: hidden;
    }

    .fb-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.4s ease;

      &--good { background: linear-gradient(90deg, #22c55e, #4ade80); }
      &--neutral { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
      &--bad { background: linear-gradient(90deg, #ef4444, #f87171); }
    }

    .fb-pct {
      flex: 0 0 40px;
      text-align: right;
      font-size: 12px;
      font-weight: 700;
      color: #1f2937;
    }
  }

  .feedback-reasons {
    .reason-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #f1f5f9;

      &:last-child { border-bottom: none; }
    }

    .reason-text {
      font-size: 12px;
      color: #475569;
      max-width: 180px;
    }
  }
}

/* AI 回答质量 */
.quality-overview {
  display: flex;
  align-items: center;
  gap: 20px;
}

.quality-main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quality-ring {
  position: relative;
  width: 80px;
  height: 80px;

  svg {
    width: 100%;
    height: 100%;
  }

  .quality-ring-value {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 800;
    color: #1e40af;
  }
}

.quality-ring-label {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.quality-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .qs-item {
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;

    strong {
      display: block;
      font-size: 22px;
      font-weight: 800;
      line-height: 1;
    }

    span {
      font-size: 12px;
      color: #6b7280;
    }

    &--good {
      background: #ecfdf5;
      strong { color: #059669; }
    }

    &--bad {
      background: #fef2f2;
      strong { color: #dc2626; }
    }
  }
}

/* ===== 详情抽屉 ===== */
.drawer-section {
  margin-bottom: 22px;

  .drawer-section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #1f2937;

    :deep(.app-icon) {
      width: 16px;
      height: 16px;
      color: #6366f1;
    }
  }
}

.answer-block {
  padding: 14px 16px;
  border: 1px solid #e5eaf3;
  border-radius: 10px;
  background: #f8faff;

  .answer-text {
    margin: 0 0 12px;
    font-family: inherit;
    font-size: 13px;
    line-height: 1.7;
    color: #1f2937;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .answer-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #6b7280;
  }
}

.quality-score-inline {
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.quality-score-inline.quality--high { background: #ecfdf5; color: #059669; }
.quality-score-inline.quality--mid { background: #fffbeb; color: #d97706; }
.quality-score-inline.quality--low { background: #fef2f2; color: #dc2626; }

/* 引用来源卡片 */
.ref-card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ref-card {
  padding: 12px 14px;

  .ref-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .ref-doc-name {
    font-weight: 600;
    font-size: 13px;
    color: #1f2937;
  }

  .ref-snippet {
    margin: 0 0 8px;
    font-size: 12px;
    line-height: 1.6;
    color: #475569;
    background: #f8faff;
    padding: 8px 10px;
    border-radius: 6px;
    border-left: 3px solid #6366f1;
  }

  .ref-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ref-similarity {
      font-size: 12px;
      color: #6b7280;

      strong {
        color: #059669;
        font-weight: 700;
      }
    }
  }
}

/* 反馈展示 */
.feedback-display {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;

  .feedback-text {
    font-size: 13px;
    color: #475569;
    flex-basis: 100%;
  }

  .feedback-time {
    font-size: 12px;
    color: #94a3b8;
  }
}

/* 管理员处理 */
.admin-section {
  .admin-status-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 13px;
    color: #475569;
  }

  .admin-note {
    margin-bottom: 12px;
  }

  .admin-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

/* 知识沉淀弹窗 */
.precipitate-form {
  .full-width {
    width: 100%;
  }
}
</style>
