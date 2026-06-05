<template>
  <PageContainer>
    <div class="tac-page">
      <!-- ===== 顶部：团队资产总览区 ===== -->
      <header class="tac-header">
        <div class="th-bg" />
        <div class="th-content">
          <div class="th-left">
            <div class="th-kicker"><span />TEAM ASSETS COCKPIT</div>
            <h1>团队资产库</h1>
            <p>沉淀项目资料、交接经验、团队规范与知识记忆，让新人快速接入，让经验持续复用。</p>
          </div>
          <div class="th-right">
            <div class="th-search-wrap">
              <el-input v-model="searchKeyword" :prefix-icon="Search" clearable placeholder="搜索项目、负责人、文档、知识点、标签..." class="th-search" @focus="showSuggestions = true" @blur="hideSuggestions" />
              <div v-if="showSuggestions" class="th-suggestions">
                <button v-for="s in searchSuggestions" :key="s" @click="applySuggestion(s)">{{ s }}</button>
              </div>
            </div>
            <el-button type="primary" :icon="Plus" @click="createDialogVisible = true">新增资产</el-button>
          </div>
        </div>
      </header>

      <!-- ===== 统计卡片 ===== -->
      <div class="tac-stats">
        <div class="ts-card" v-for="stat in statCards" :key="stat.label">
          <div class="tsc-icon" :style="{ background: stat.bg, color: stat.color }"><AppIcon :name="stat.icon" /></div>
          <div class="tsc-info">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
            <small>{{ stat.desc }}</small>
          </div>
        </div>
      </div>

      <!-- ===== 中部：资产星图区域 ===== -->
      <section class="tac-body">
        <div class="tb-main">
          <!-- 筛选标签 -->
          <div class="tb-filters">
            <button v-for="f in filterOptions" :key="f.key" class="tb-filter" :class="{ 'is-active': activeFilter === f.key }" @click="activeFilter = f.key">
              {{ f.label }}
            </button>
          </div>

          <!-- 项目卡片网格 -->
          <div class="tb-grid">
            <div v-for="project in filteredProjects" :key="project.id" class="project-card app-card" :class="{ 'is-selected': selectedProject?.id === project.id }" @click="selectProject(project)">
              <div class="pc-top">
                <el-tag :type="statusType(project.status)" size="small" effect="plain">{{ project.status }}</el-tag>
                <span class="pc-value" :class="'val-' + valueClass(project.valueLevel)">{{ project.valueLevel }}</span>
              </div>
              <h4 class="pc-title">{{ project.name }}</h4>
              <p class="pc-desc">{{ project.desc }}</p>
              <div class="pc-meta">
                <span><AppIcon name="User" />{{ project.owner }}</span>
                <span><AppIcon name="Clock" />{{ project.updatedAt.split(' ')[0] }}</span>
              </div>
              <div class="pc-completeness">
                <span class="pcl-label">资产完整度</span>
                <div class="pcl-bar"><div class="pcl-fill" :style="{ width: project.completeness + '%', background: completenessColor(project.completeness) }" /></div>
                <span class="pcl-val" :style="{ color: completenessColor(project.completeness) }">{{ project.completeness }}%</span>
              </div>
              <div class="pc-tags">
                <span v-for="tag in project.tags.slice(0, 4)" :key="tag" class="pc-tag">#{{ tag }}</span>
              </div>
              <div class="pc-actions">
                <el-button text size="small" type="primary" @click.stop="selectProject(project)">查看记忆</el-button>
                <el-button text size="small" @click.stop="handleOpenDoc(project)">打开文档</el-button>
                <el-button text size="small" type="primary" @click.stop="handleAiSummary(project)">AI 总结</el-button>
              </div>
            </div>
            <div v-if="filteredProjects.length === 0" class="tb-empty app-card">
              <AppIcon name="Briefcase" class="tbe-icon" />
              <h3>暂无团队资产</h3>
              <p>{{ emptyTips[0] }}</p>
              <el-button type="primary" @click="createDialogVisible = true">创建第一个资产</el-button>
            </div>
          </div>
        </div>

        <!-- ===== 右侧：项目记忆面板 ===== -->
        <aside class="memory-panel app-card" v-if="selectedProject">
          <div class="mp-header">
            <h3>项目记忆</h3>
            <el-button text :icon="Close" @click="selectedProject = null" />
          </div>
          <div class="mp-project-name">{{ selectedProject.name }}</div>

          <!-- AI 摘要 -->
          <div class="mp-section mp-ai-summary">
            <div class="mpas-badge"><AppIcon name="MagicStick" /><span>项目一句话总结</span></div>
            <p>{{ selectedProject.memory.summary }}</p>
          </div>

          <!-- 核心负责人 -->
          <div class="mp-section">
            <h4>核心负责人</h4>
            <div class="mp-members">
              <div v-for="m in selectedProject.memory.members" :key="m.name" class="mpm-item">
                <span class="mpm-avatar">{{ m.name.charAt(0) }}</span>
                <div class="mpm-info">
                  <strong>{{ m.name }}</strong>
                  <span>{{ m.role }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 关键资产 -->
          <div class="mp-section">
            <h4>关键资产</h4>
            <div class="mp-assets">
              <div v-for="a in selectedProject.memory.keyAssets" :key="a.name" class="mpa-item">
                <AppIcon :name="assetIcon(a.type)" />
                <span>{{ a.name }}</span>
                <el-tag size="small" effect="plain">{{ a.type }}</el-tag>
              </div>
            </div>
          </div>

          <!-- 最近变化 -->
          <div class="mp-section">
            <h4>最近变化</h4>
            <div class="mp-changes">
              <div v-for="c in selectedProject.memory.recentChanges" :key="c.time" class="mpc-item">
                <span class="mpc-time">{{ c.time }}</span>
                <span>{{ c.action }}</span>
              </div>
            </div>
          </div>

          <!-- 资产完整度详情 -->
          <div class="mp-section">
            <h4>资产完整度详情</h4>
            <div class="mp-complete">
              <div v-for="d in selectedProject.memory.completenessDetails" :key="d.label" class="mpcd-item">
                <span class="mpcd-label">{{ d.label }}</span>
                <div class="mpcd-bar"><div class="mpcd-fill" :style="{ width: d.score + '%', background: completenessColor(d.score) }" /></div>
                <span class="mpcd-status" :class="'st-' + d.status">{{ d.status }}</span>
              </div>
            </div>
          </div>

          <!-- AI 建议 -->
          <div class="mp-section mp-ai-advice">
            <div class="mpaa-badge"><AppIcon name="DataAnalysis" /><span>AI 建议</span></div>
            <p>{{ selectedProject.memory.aiSuggestion }}</p>
          </div>

          <!-- 缺失项提示 -->
          <div v-if="selectedProject.missingItems.length" class="mp-section mp-missing">
            <AppIcon name="WarningFilled" />
            <span>缺少：{{ selectedProject.missingItems.join('、') }}</span>
          </div>

          <!-- 操作按钮 -->
          <div class="mp-actions">
            <el-button type="primary" size="small" @click="handleGenerateHandover(selectedProject)">生成交接说明</el-button>
            <el-button size="small" @click="handleViewAll(selectedProject)">查看全部资料</el-button>
            <el-button size="small" @click="createDialogVisible = true">补充资产</el-button>
          </div>
        </aside>

        <!-- 右侧空态 -->
        <aside class="memory-panel app-card mp-empty" v-else>
          <AppIcon name="Briefcase" class="mpe-icon" />
          <p>选择项目卡片<br>查看项目记忆</p>
        </aside>
      </section>

      <!-- ===== 新增资产弹窗 ===== -->
      <el-dialog v-model="createDialogVisible" title="新增项目资产" width="520px" destroy-on-close>
        <el-form :model="createForm" label-width="90px">
          <el-form-item label="项目名称" required>
            <el-input v-model="createForm.name" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="项目描述">
            <el-input v-model="createForm.desc" type="textarea" :rows="2" placeholder="一句话描述项目" />
          </el-form-item>
          <el-form-item label="负责人" required>
            <el-input v-model="createForm.owner" placeholder="输入负责人" />
          </el-form-item>
          <el-form-item label="项目状态">
            <el-select v-model="createForm.status" style="width:100%">
              <el-option label="运行中" value="运行中" />
              <el-option label="交接中" value="交接中" />
              <el-option label="沉淀中" value="沉淀中" />
              <el-option label="待完善" value="待完善" />
            </el-select>
          </el-form-item>
          <el-form-item label="价值等级">
            <el-select v-model="createForm.valueLevel" style="width:100%">
              <el-option label="高价值" value="高价值" />
              <el-option label="中价值" value="中价值" />
              <el-option label="低价值" value="低价值" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="createForm.tags" multiple filterable allow-create placeholder="选择或输入标签" style="width:100%">
              <el-option v-for="t in tagOptions" :key="t" :label="t" :value="t" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreateSubmit">确认创建</el-button>
        </template>
      </el-dialog>

      <!-- ===== AI 总结弹窗 ===== -->
      <el-dialog v-model="aiSummaryVisible" :title="'AI 总结 - ' + (aiSummaryTarget?.name || '')" width="480px" destroy-on-close>
        <div v-if="aiSummaryTarget" class="ai-summary-content">
          <div class="asc-loading" v-if="aiSummaryLoading">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>AI 正在整理该项目的关键资料、风险点和交接建议...</span>
          </div>
          <div v-else>
            <p class="asc-text">{{ aiSummaryTarget.memory.summary }}</p>
            <div class="asc-section">
              <h4>关键资产</h4>
              <div class="asc-tags">
                <el-tag v-for="a in aiSummaryTarget.memory.keyAssets" :key="a.name" effect="plain">{{ a.name }}</el-tag>
              </div>
            </div>
            <div class="asc-section">
              <h4>完整度评估</h4>
              <div class="asc-complete">
                <span>资产完整度：<strong :style="{ color: completenessColor(aiSummaryTarget.completeness) }">{{ aiSummaryTarget.completeness }}%</strong></span>
              </div>
            </div>
            <div class="asc-section">
              <h4>AI 建议</h4>
              <p>{{ aiSummaryTarget.memory.aiSuggestion }}</p>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- ===== 生成交接说明弹窗 ===== -->
      <el-dialog v-model="handoverDialogVisible" title="生成交接说明" width="480px" destroy-on-close>
        <div v-if="handoverTarget" class="handover-content">
          <div class="hc-status" v-if="handoverGenerating">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>正在生成交接说明...</span>
          </div>
          <div v-else class="hc-result">
            <h4>{{ handoverTarget.name }} - 交接说明</h4>
            <p class="hc-summary">{{ handoverTarget.memory.summary }}</p>
            <div class="hc-section">
              <strong>核心负责人：</strong>
              <span>{{ handoverTarget.memory.members.map(m => m.name + '(' + m.role + ')').join('、') }}</span>
            </div>
            <div class="hc-section">
              <strong>关键资产：</strong>
              <span>{{ handoverTarget.memory.keyAssets.map(a => a.name).join('、') }}</span>
            </div>
            <div class="hc-section">
              <strong>最近变更：</strong>
              <ul>
                <li v-for="c in handoverTarget.memory.recentChanges.slice(0, 3)" :key="c.time">{{ c.time }} - {{ c.action }}</li>
              </ul>
            </div>
            <div class="hc-section" v-if="handoverTarget.missingItems.length">
              <strong>待补充：</strong>
              <span>{{ handoverTarget.missingItems.join('、') }}</span>
            </div>
          </div>
        </div>
        <template #footer>
          <el-button @click="handoverDialogVisible = false">关闭</el-button>
          <el-button v-if="!handoverGenerating" type="primary" @click="ElMessage.success('交接说明已保存')">保存交接文档</el-button>
        </template>
      </el-dialog>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, Close, Loading } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  getTeamProjectsMock, getTopStatsMock, filterOptions, searchSuggestions, emptyTips,
  type TeamProject
} from './mock'

// ===== 数据 =====
const projects = ref(getTeamProjectsMock())
const topStats = ref(getTopStatsMock())

// ===== 状态 =====
const searchKeyword = ref('')
const activeFilter = ref('all')
const selectedProject = ref<TeamProject | null>(null)
const showSuggestions = ref(false)

// ===== 弹窗 =====
const createDialogVisible = ref(false)
const aiSummaryVisible = ref(false)
const aiSummaryTarget = ref<TeamProject | null>(null)
const aiSummaryLoading = ref(false)
const handoverDialogVisible = ref(false)
const handoverTarget = ref<TeamProject | null>(null)
const handoverGenerating = ref(false)

// ===== 创建表单 =====
const createForm = ref({ name: '', desc: '', owner: '', status: '运行中', valueLevel: '中价值', tags: [] as string[] })
const tagOptions = ['知识库', 'AI问答', '企业文档', '权限控制', '工单', '质检', '数据看板', '门户', 'WMS', '接口', '网关']

// ===== 统计卡片 =====
const statCards = computed(() => [
  { label: '项目资产', value: topStats.value.projectCount, icon: 'Briefcase', color: '#6366f1', bg: '#eef2ff', desc: '团队当前维护的核心项目' },
  { label: '交接文档', value: topStats.value.handoverCount, icon: 'Document', color: '#10b981', bg: '#f0fdf4', desc: '可直接复用的交接材料' },
  { label: '知识沉淀', value: topStats.value.knowledgeCount, icon: 'Notebook', color: '#f59e0b', bg: '#fffbeb', desc: '问题、经验、规范、FAQ' },
  { label: '活跃负责人', value: topStats.value.activeMembers, icon: 'User', color: '#3b82f6', bg: '#eff6ff', desc: '当前仍在维护资产的成员' }
])

// ===== 过滤 =====
const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    // 状态筛选
    if (activeFilter.value === 'running' && p.status !== '运行中') return false
    if (activeFilter.value === 'handover' && p.status !== '交接中' && p.status !== '已交接') return false
    if (activeFilter.value === 'accumulating' && p.status !== '沉淀中') return false
    if (activeFilter.value === 'high-value' && p.valueLevel !== '高价值') return false
    if (activeFilter.value === 'incomplete' && p.completeness >= 70) return false
    // 关键词搜索
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      if (!(p.name.toLowerCase().includes(kw) || p.owner.toLowerCase().includes(kw) || p.tags.some(t => t.toLowerCase().includes(kw)) || p.desc.toLowerCase().includes(kw))) return false
    }
    return true
  })
})

// ===== 工具函数 =====
function statusType(s: string) {
  const map: Record<string, string> = { '运行中': 'success', '交接中': 'warning', '沉淀中': 'info', '已交接': 'success', '待完善': 'danger' }
  return (map[s] || 'info') as any
}
function valueClass(v: string) { return v === '高价值' ? 'high' : v === '中价值' ? 'medium' : 'low' }
function completenessColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}
function assetIcon(type: string) {
  const map: Record<string, string> = { '代码': 'Monitor', '文档': 'Document', '配置': 'Setting', '接口': 'Connection', '数据': 'DataLine', '资源': 'Folder', 'FAQ': 'QuestionFilled' }
  return map[type] || 'Document'
}

// ===== 操作 =====
function selectProject(p: TeamProject) { selectedProject.value = p }
function applySuggestion(s: string) {
  searchKeyword.value = s.replace(/[的项目]/g, '').replace(/最近交接|缺少部署文档|负责的资产|高价值但资料不完整|本周更新过的知识点/g, '')
  showSuggestions.value = false
}
function hideSuggestions() { setTimeout(() => { showSuggestions.value = false }, 150) }
function handleOpenDoc(p: TeamProject) { ElMessage.info(`打开「${p.name}」文档`) }
function handleViewAll(p: TeamProject) { ElMessage.info(`查看「${p.name}」全部资料`) }

function handleAiSummary(p: TeamProject) {
  aiSummaryTarget.value = p
  aiSummaryLoading.value = true
  aiSummaryVisible.value = true
  setTimeout(() => { aiSummaryLoading.value = false }, 1500)
}

function handleGenerateHandover(p: TeamProject) {
  handoverTarget.value = p
  handoverGenerating.value = true
  handoverDialogVisible.value = true
  setTimeout(() => { handoverGenerating.value = false }, 2000)
}

function handleCreateSubmit() {
  if (!createForm.value.name) { ElMessage.warning('请输入项目名称'); return }
  const newProject: TeamProject = {
    id: Date.now(), name: createForm.value.name, desc: createForm.value.desc || '暂无描述',
    owner: createForm.value.owner || '未指定', status: createForm.value.status as any,
    valueLevel: createForm.value.valueLevel as any, completeness: 30,
    updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    tags: createForm.value.tags, missingItems: ['基础信息', '核心文档'],
    memory: {
      summary: createForm.value.desc || '这是一个新项目，资料正在沉淀中。',
      members: [{ name: createForm.value.owner || '未指定', role: '负责人' }],
      keyAssets: [], recentChanges: [{ time: new Date().toISOString().slice(0, 10), action: '创建项目' }],
      aiSuggestion: '新项目，建议尽快补充基础信息、核心文档和接口说明。',
      completenessDetails: [
        { label: '基础信息', score: 30, status: '不足' }, { label: '核心文档', score: 10, status: '不足' },
        { label: '接口说明', score: 0, status: '不足' }, { label: '部署说明', score: 0, status: '不足' },
        { label: '交接经验', score: 0, status: '不足' }, { label: '常见问题', score: 0, status: '不足' }
      ]
    }
  }
  projects.value.unshift(newProject)
  createDialogVisible.value = false
  createForm.value = { name: '', desc: '', owner: '', status: '运行中', valueLevel: '中价值', tags: [] }
  ElMessage.success('项目资产已创建')
}
</script>

<style scoped lang="scss">
.tac-page { display: flex; flex-direction: column; gap: var(--app-section-gap); height: 100%; overflow-y: auto; }

/* ===== 顶部指挥台 ===== */
.tac-header { position: relative; border-radius: var(--app-card-radius); overflow: hidden;
  .th-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%); }
  .th-bg::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 120px); }
  .th-content { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; color: #fff; }
  .th-kicker { display: flex; align-items: center; gap: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6; margin-bottom: 4px; span { width: 18px; height: 2px; background: #60a5fa; border-radius: 1px; } }
  h1 { font-size: 22px; font-weight: 700; margin: 0 0 4px; }
  & > .th-content > .th-left > p { font-size: 13px; opacity: 0.75; margin: 0; }
  .th-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .th-search-wrap { position: relative;
    .th-search { width: 320px; :deep(.el-input__wrapper) { border-radius: 8px; } }
  }
  .th-suggestions { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); padding: 8px; z-index: 10; margin-top: 4px;
    button { display: block; width: 100%; padding: 8px 12px; border: none; background: transparent; text-align: left; font-size: 13px; color: #1f2937; border-radius: 4px; cursor: pointer;
      &:hover { background: #f3f4f6; }
    }
  }
}

/* ===== 统计卡片 ===== */
.tac-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  .ts-card { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: var(--app-card-radius); background: #fff; border: 1px solid rgba(229,234,243,0.8); box-shadow: var(--app-card-shadow); transition: transform 0.2s, box-shadow 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(29,78,216,0.08); }
    .tsc-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
    .tsc-info { display: flex; flex-direction: column;
      strong { font-size: 24px; font-weight: 700; color: var(--text-color); line-height: 1.2; }
      span { font-size: 13px; color: var(--text-color); font-weight: 500; }
      small { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
    }
  }
}

/* ===== 主体 ===== */
.tac-body { display: grid; grid-template-columns: 1fr 380px; gap: var(--app-section-gap); flex: 1; min-height: 0; }
.tb-main { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }

/* ===== 筛选标签 ===== */
.tb-filters { display: flex; gap: 8px; flex-wrap: wrap;
  .tb-filter { padding: 6px 14px; border: 1px solid var(--border-color); border-radius: 20px; background: #fff; font-size: 13px; color: var(--text-color); cursor: pointer; transition: all 0.15s;
    &:hover { border-color: var(--primary-color); color: var(--primary-color); }
    &.is-active { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
  }
}

/* ===== 项目卡片网格 ===== */
.tb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
.project-card { padding: 16px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; border: 2px solid transparent;
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(29,78,216,0.1); }
  &.is-selected { border-color: var(--primary-color); }
  .pc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
    .pc-value { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px;
      &.val-high { background: #fef3c7; color: #b45309; }
      &.val-medium { background: #e0f2fe; color: #0369a1; }
      &.val-low { background: #f3f4f6; color: #6b7280; }
    }
  }
  .pc-title { font-size: 16px; font-weight: 600; color: var(--text-color); margin: 0 0 6px; }
  .pc-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .pc-meta { display: flex; gap: 14px; font-size: 12px; color: var(--text-secondary); margin-bottom: 10px;
    span { display: flex; align-items: center; gap: 4px; }
  }
  .pc-completeness { display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
    .pcl-label { font-size: 11px; color: var(--text-secondary); flex-shrink: 0; }
    .pcl-bar { flex: 1; height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden;
      .pcl-fill { height: 100%; border-radius: 3px; }
    }
    .pcl-val { font-size: 12px; font-weight: 600; flex-shrink: 0; }
  }
  .pc-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;
    .pc-tag { font-size: 11px; color: #6366f1; background: #eef2ff; padding: 2px 8px; border-radius: 10px; }
  }
  .pc-actions { display: flex; gap: 4px; padding-top: 10px; border-top: 1px solid #f0f0f0; }
}

/* ===== 空状态 ===== */
.tb-empty { grid-column: 1 / -1; padding: 40px; text-align: center;
  .tbe-icon { font-size: 48px; color: #d1d5db; margin-bottom: 12px; }
  h3 { font-size: 16px; font-weight: 600; margin: 0 0 8px; color: var(--text-color); }
  p { font-size: 13px; color: var(--text-secondary); margin: 0 0 16px; }
}

/* ===== 项目记忆面板 ===== */
.memory-panel { overflow-y: auto; padding: 0;
  .mp-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 8px; position: sticky; top: 0; background: #fff; z-index: 1;
    h3 { font-size: 15px; font-weight: 600; margin: 0; color: var(--text-color); }
  }
  .mp-project-name { padding: 0 16px 10px; font-size: 13px; font-weight: 600; color: var(--primary-color); border-bottom: 1px solid var(--border-color); }
  .mp-section { padding: 12px 16px; border-bottom: 1px solid var(--border-color);
    h4 { font-size: 13px; font-weight: 600; margin: 0 0 8px; color: var(--text-color); }
  }
}

/* AI 摘要 */
.mp-ai-summary { background: linear-gradient(135deg, #faf5ff 0%, #fff 100%);
  .mpas-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #7c3aed; margin-bottom: 6px; }
  p { font-size: 13px; color: var(--text-color); line-height: 1.6; margin: 0; }
}

/* 负责人 */
.mp-members { display: flex; flex-direction: column; gap: 8px;
  .mpm-item { display: flex; align-items: center; gap: 10px;
    .mpm-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--primary-light); color: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
    .mpm-info { display: flex; flex-direction: column;
      strong { font-size: 13px; font-weight: 600; color: var(--text-color); }
      span { font-size: 11px; color: var(--text-secondary); }
    }
  }
}

/* 关键资产 */
.mp-assets { display: flex; flex-direction: column; gap: 6px;
  .mpa-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: #f8fafc; border-radius: 6px; font-size: 12px;
    span { flex: 1; color: var(--text-color); }
  }
}

/* 最近变化 */
.mp-changes { display: flex; flex-direction: column; gap: 6px;
  .mpc-item { display: flex; gap: 10px; font-size: 12px;
    .mpc-time { color: var(--text-secondary); flex-shrink: 0; width: 80px; }
    span { color: var(--text-color); }
  }
}

/* 完整度详情 */
.mp-complete { display: flex; flex-direction: column; gap: 6px;
  .mpcd-item { display: flex; align-items: center; gap: 8px;
    .mpcd-label { font-size: 12px; color: var(--text-secondary); width: 70px; flex-shrink: 0; }
    .mpcd-bar { flex: 1; height: 5px; background: #f0f0f0; border-radius: 3px; overflow: hidden;
      .mpcd-fill { height: 100%; border-radius: 3px; }
    }
    .mpcd-status { font-size: 11px; font-weight: 500; width: 32px; text-align: right;
      &.st-完整 { color: #22c55e; } &.st-一般 { color: #f59e0b; } &.st-不足 { color: #ef4444; }
    }
  }
}

/* AI 建议 */
.mp-ai-advice { background: linear-gradient(135deg, #eff6ff 0%, #fff 100%);
  .mpaa-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #2563eb; margin-bottom: 6px; }
  p { font-size: 13px; color: var(--text-color); line-height: 1.6; margin: 0; }
}

/* 缺失项 */
.mp-missing { display: flex; align-items: flex-start; gap: 8px; background: #fef2f2;
  svg { color: #ef4444; flex-shrink: 0; margin-top: 2px; }
  span { font-size: 12px; color: #ef4444; line-height: 1.5; }
}

/* 操作按钮 */
.mp-actions { display: flex; gap: 8px; padding: 12px 16px; position: sticky; bottom: 0; background: #fff; border-top: 1px solid var(--border-color); }

/* 空态 */
.mp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center;
  .mpe-icon { font-size: 48px; color: #d1d5db; margin-bottom: 12px; }
  p { font-size: 13px; color: var(--text-secondary); text-align: center; line-height: 1.6; }
}

/* ===== AI 总结弹窗 ===== */
.ai-summary-content {
  .asc-loading { display: flex; align-items: center; gap: 10px; padding: 20px; font-size: 14px; color: var(--text-secondary); }
  .asc-text { font-size: 14px; color: var(--text-color); line-height: 1.7; margin: 0 0 16px; }
  .asc-section { margin-bottom: 14px;
    h4 { font-size: 14px; font-weight: 600; margin: 0 0 8px; color: var(--text-color); }
    p { font-size: 13px; color: var(--text-color); line-height: 1.6; margin: 0; }
  }
  .asc-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .asc-complete { font-size: 14px; strong { font-size: 18px; } }
}

/* ===== 交接说明弹窗 ===== */
.handover-content {
  .hc-status { display: flex; align-items: center; gap: 10px; padding: 20px; font-size: 14px; color: var(--text-secondary); }
  .hc-result {
    h4 { font-size: 16px; font-weight: 600; margin: 0 0 12px; color: var(--text-color); }
    .hc-summary { font-size: 14px; color: var(--text-color); line-height: 1.7; margin: 0 0 16px; padding: 12px; background: #f8fafc; border-radius: 8px; }
    .hc-section { margin-bottom: 12px;
      strong { font-size: 13px; font-weight: 600; color: var(--text-color); }
      span, ul { font-size: 13px; color: var(--text-color); }
      ul { padding-left: 18px; margin: 4px 0 0; }
    }
  }
}

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
  .tac-body { grid-template-columns: 1fr 340px; }
  .tac-stats { grid-template-columns: repeat(2, 1fr); }
  .tb-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
}
@media (max-width: 900px) {
  .tac-body { grid-template-columns: 1fr; }
  .memory-panel { display: none; }
  .th-content { flex-direction: column; gap: 12px; align-items: flex-start; }
  .th-search { width: 100% !important; }
}
@media (max-width: 600px) {
  .tac-stats { grid-template-columns: 1fr; }
  .tb-grid { grid-template-columns: 1fr; }
}
</style>
