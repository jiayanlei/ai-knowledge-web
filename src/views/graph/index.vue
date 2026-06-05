<template>
  <PageContainer>
    <div class="kg-page" :class="{ 'is-fullscreen': isFullscreen }">
      <!-- ===== 顶部：知识图谱控制台 ===== -->
      <header class="kg-console">
        <div class="console-bg" />
        <div class="console-content">
          <div class="console-left">
            <div class="console-kicker"><span />KNOWLEDGE GRAPH</div>
            <h1>企业知识图谱</h1>
            <p>洞察制度、流程、文档、项目之间的知识关系</p>
          </div>
          <div class="console-center">
            <div class="console-search">
              <el-input v-model="searchQuery" placeholder="搜索制度、流程、项目、岗位、关键词..." clearable size="large" :prefix-icon="Search" @keyup.enter="handleSearch" @clear="searchResultId = null" />
              <el-button type="primary" size="large" @click="handleSearch">搜索</el-button>
            </div>
            <div class="console-ai-search">
              <el-input v-model="aiQuestion" placeholder="AI 路径问答：如「报销制度会影响哪些流程？」" clearable size="default" :prefix-icon="MagicStick" @keyup.enter="handleAiQuestion" />
            </div>
          </div>
          <div class="console-right">
            <div class="view-modes">
              <button v-for="m in VIEW_MODES" :key="m.key" type="button" class="vm-btn" :class="{ active: viewMode === m.key }" @click="viewMode = m.key">
                <AppIcon :name="m.icon" />
                <span>{{ m.label }}</span>
              </button>
            </div>
            <div class="console-actions">
              <el-button size="small" :icon="MagicStick" @click="handleAiOrganize">AI 梳理关系</el-button>
              <el-button size="small" :icon="Refresh" @click="handleRecalculate">重新计算</el-button>
              <el-button size="small" :icon="Download" @click="handleExport">导出</el-button>
              <el-button size="small" :icon="isFullscreen ? CopyDocument : FullScreen" @click="isFullscreen = !isFullscreen">
                {{ isFullscreen ? '退出全屏' : '沉浸模式' }}
              </el-button>
            </div>
          </div>
        </div>
      </header>

      <!-- ===== 主体区域 ===== -->
      <section class="kg-body">
        <!-- 左侧：知识雷达筛选器 -->
        <aside v-if="!isFullscreen" class="kg-left app-card">
          <div class="left-header">
            <h2>知识雷达</h2>
            <el-button text size="small" @click="resetFilters">重置</el-button>
          </div>

          <!-- 知识分类筛选 -->
          <div class="filter-section">
            <div class="fs-title">知识分类</div>
            <div class="fs-list">
              <label v-for="(cfg, key) in CATEGORY_CONFIG" :key="key" class="fs-item" :class="{ active: filterCategories.includes(key as any) }">
                <input type="checkbox" :value="key" v-model="filterCategories" hidden />
                <span class="fs-dot" :style="{ background: cfg.color }" />
                <span class="fs-name">{{ cfg.name }}</span>
                <span class="fs-count">{{ getNodeCount(key as any) }}</span>
              </label>
            </div>
          </div>

          <!-- 关系类型筛选 -->
          <div class="filter-section">
            <div class="fs-title">关系类型</div>
            <div class="fs-list">
              <label v-for="(cfg, key) in RELATION_CONFIG" :key="key" class="fs-item" :class="{ active: filterRelationTypes.includes(key as any) }">
                <input type="checkbox" :value="key" v-model="filterRelationTypes" hidden />
                <span class="fs-dot" :style="{ background: cfg.color, opacity: cfg.dash ? 0.6 : 1 }" />
                <span class="fs-name">{{ cfg.name }}</span>
              </label>
            </div>
          </div>

          <!-- 状态筛选 -->
          <div class="filter-section">
            <div class="fs-title">状态筛选</div>
            <div class="fs-list">
              <label v-for="(cfg, key) in STATUS_CONFIG" :key="key" class="fs-item" :class="{ active: filterStatuses.includes(key) }">
                <input type="checkbox" :value="key" v-model="filterStatuses" hidden />
                <span class="fs-dot" :style="{ background: cfg.color }" />
                <span class="fs-name">{{ cfg.name }}</span>
              </label>
            </div>
          </div>

          <!-- 图谱层级 -->
          <div class="filter-section">
            <div class="fs-title">图谱层级</div>
            <div class="layer-btns">
              <button v-for="l in [1, 2, 3]" :key="l" type="button" class="layer-btn" :class="{ active: layerDepth === l }" @click="layerDepth = l">
                {{ l === 1 ? '一层关系' : l === 2 ? '二层扩展' : '三层影响' }}
              </button>
            </div>
          </div>

          <!-- 快捷入口 -->
          <div class="filter-section">
            <div class="fs-title">快捷入口</div>
            <div class="quick-entries">
              <button type="button" class="qe-btn" @click="quickFilter('hot')"><AppIcon name="TrendCharts" />高频知识</button>
              <button type="button" class="qe-btn" @click="quickFilter('recent')"><AppIcon name="Clock" />最近更新</button>
              <button type="button" class="qe-btn" @click="quickFilter('risk')"><AppIcon name="WarningFilled" />风险知识</button>
              <button type="button" class="qe-btn" @click="quickFilter('orphan')"><AppIcon name="Remove" />未关联文档</button>
              <button type="button" class="qe-btn" @click="quickFilter('ai')"><AppIcon name="MagicStick" />AI 新关系</button>
            </div>
          </div>
        </aside>

        <!-- 中间：图谱画布 -->
        <div class="kg-canvas-wrap">
          <div class="canvas-container">
            <ParticleBackground />
            <GraphCanvas
              ref="graphCanvasRef"
              :nodes="allNodes"
              :edges="allEdges"
              :view-mode="viewMode"
              :selected-id="selectedNode?.id || null"
              :hovered-id="hoveredNode?.id || null"
              :filter-categories="filterCategories"
              :filter-relation-types="filterRelationTypes"
              :filter-statuses="filterStatuses"
              @node-click="handleNodeClick"
              @node-dblclick="handleNodeDblclick"
              @node-hover="handleNodeHover"
              @canvas-click="handleCanvasClick"
            />

            <!-- 统计浮层 -->
            <div class="stats-overlay">
              <div class="stat-chip"><span class="sc-val">{{ stats.totalNodes }}</span><span class="sc-label">节点</span></div>
              <div class="stat-chip"><span class="sc-val">{{ stats.totalEdges }}</span><span class="sc-label">关系</span></div>
              <div class="stat-chip stat-chip--warn"><span class="sc-val">{{ stats.isolatedNodes }}</span><span class="sc-label">孤立</span></div>
              <div class="stat-chip stat-chip--danger"><span class="sc-val">{{ stats.highRiskEdges }}</span><span class="sc-label">高风险</span></div>
              <div class="stat-chip stat-chip--ai"><span class="sc-val">{{ stats.aiRecommendedEdges }}</span><span class="sc-label">AI 推荐</span></div>
              <div class="stat-chip"><span class="sc-val">{{ stats.recentlyUpdated }}</span><span class="sc-label">近期更新</span></div>
            </div>

            <!-- 视图模式指示器 -->
            <div class="view-indicator">
              <span class="vi-dot" />
              {{ VIEW_MODES.find(m => m.key === viewMode)?.label || '' }}
            </div>
          </div>
        </div>

        <!-- 右侧：节点详情 + AI 解读 -->
        <aside v-if="selectedNode && !isFullscreen" class="kg-right app-card">
          <div class="right-header">
            <div class="rh-type" :style="{ color: CATEGORY_CONFIG[selectedNode.category].color }">
              <span class="rh-dot" :style="{ background: CATEGORY_CONFIG[selectedNode.category].color }" />
              {{ CATEGORY_CONFIG[selectedNode.category].name }}
            </div>
            <el-button text size="small" @click="selectedNode = null">
              <AppIcon name="Close" />
            </el-button>
          </div>
          <h2 class="right-title">{{ selectedNode.name }}</h2>

          <div class="right-meta">
            <div class="rm-row"><span class="rm-label">所属部门</span><span class="rm-val">{{ selectedNode.department }}</span></div>
            <div class="rm-row"><span class="rm-label">更新时间</span><span class="rm-val">{{ selectedNode.updateTime }}</span></div>
            <div class="rm-row"><span class="rm-label">负责人</span><span class="rm-val">{{ selectedNode.owner }}</span></div>
            <div class="rm-row">
              <span class="rm-label">当前状态</span>
              <span class="rm-val rm-status" :style="{ color: STATUS_CONFIG[selectedNode.status]?.color }">{{ STATUS_CONFIG[selectedNode.status]?.name }}</span>
            </div>
            <div class="rm-row"><span class="rm-label">引用次数</span><span class="rm-val">{{ selectedNode.referenceCount }}</span></div>
            <div class="rm-row"><span class="rm-label">影响流程</span><span class="rm-val">{{ selectedNode.affectedProcessCount }}</span></div>
            <div class="rm-row">
              <span class="rm-label">风险等级</span>
              <span class="rm-val rm-risk" :class="'risk--' + selectedNode.riskLevel">{{ riskLabel(selectedNode.riskLevel) }}</span>
            </div>
          </div>

          <p class="right-summary">{{ selectedNode.summary }}</p>

          <!-- AI 关系解读 -->
          <div class="ai-section">
            <div class="ai-header"><AppIcon name="MagicStick" /><h3>AI 关系解读</h3></div>
            <div v-if="aiLoading" class="ai-loading">
              <div class="ai-loading-bar" />
              <span>AI 正在分析知识关系...</span>
            </div>
            <template v-else>
              <p class="ai-text">{{ currentInsight.summary }}</p>

              <div v-if="currentInsight.relatedDocs.length" class="ai-block">
                <span class="ab-title">直接关联</span>
                <div class="ab-tags">
                  <el-tag v-for="d in currentInsight.relatedDocs" :key="d" size="small" effect="plain" round>{{ d }}</el-tag>
                </div>
              </div>

              <div v-if="currentInsight.upstream.length" class="ai-block">
                <span class="ab-title">上游依赖</span>
                <div class="ab-tags">
                  <el-tag v-for="d in currentInsight.upstream" :key="d" size="small" type="warning" effect="plain" round>{{ d }}</el-tag>
                </div>
              </div>

              <div v-if="currentInsight.downstream.length" class="ai-block">
                <span class="ab-title">下游影响</span>
                <div class="ab-tags">
                  <el-tag v-for="d in currentInsight.downstream" :key="d" size="small" type="success" effect="plain" round>{{ d }}</el-tag>
                </div>
              </div>

              <div v-if="currentInsight.conflicts.length" class="ai-block">
                <span class="ab-title">可能冲突</span>
                <div class="ab-conflicts">
                  <div v-for="c in currentInsight.conflicts" :key="c" class="ab-conflict">
                    <AppIcon name="WarningFilled" />
                    <span>{{ c }}</span>
                  </div>
                </div>
              </div>

              <div v-if="currentInsight.suggestions.length" class="ai-block">
                <span class="ab-title">AI 建议</span>
                <div class="ab-suggestions">
                  <div v-for="s in currentInsight.suggestions" :key="s" class="ab-suggestion">
                    <AppIcon name="Promotion" />
                    <span>{{ s }}</span>
                  </div>
                </div>
              </div>

              <el-button type="primary" size="small" plain class="ai-chain-btn" @click="showPathTimeline = true">
                <AppIcon name="Connection" /> 查看完整链路
              </el-button>
            </template>
          </div>
        </aside>
      </section>

      <!-- ===== 底部：知识链路时间轴 ===== -->
      <div v-if="selectedNode && pathNodes.length > 0" class="kg-timeline" :class="{ expanded: showPathTimeline }">
        <button class="timeline-toggle" @click="showPathTimeline = !showPathTimeline">
          <AppIcon :name="showPathTimeline ? 'ArrowDown' : 'ArrowUp'" />
          <span>{{ showPathTimeline ? '收起链路' : '展开知识链路' }}</span>
        </button>
        <div v-if="showPathTimeline" class="timeline-track">
          <div v-for="(pn, i) in pathNodes" :key="pn.nodeId" class="tl-node" :class="{ current: pn.nodeId === selectedNode?.id, risk: pn.status === 'expired' || pn.status === 'high_risk' }" @click="handlePathNodeClick(pn.nodeId)">
            <div class="tl-card">
              <span class="tl-dot" :style="{ background: CATEGORY_CONFIG[pn.category]?.color }" />
              <span class="tl-name">{{ pn.name }}</span>
              <span class="tl-type">{{ CATEGORY_CONFIG[pn.category]?.name }}</span>
            </div>
            <span v-if="i < pathNodes.length - 1" class="tl-arrow">
              {{ pathNodes[i + 1]?.relationLabel || '' }}
              <AppIcon name="ArrowRight" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Refresh, Download, FullScreen, CopyDocument, MagicStick } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import GraphCanvas from './components/GraphCanvas.vue'
import type { KnowledgeNode, NodeCategory, RelationType, ViewMode, PathNode } from './types'
import {
  CATEGORY_CONFIG, RELATION_CONFIG, STATUS_CONFIG, VIEW_MODES,
  getMockNodes, getMockEdges, getGraphStats, getAIInsight, getPathForNode, AI_QUESTION_SUGGESTIONS
} from './mock'

/* ===== 数据 ===== */
const allNodes = ref(getMockNodes())
const allEdges = ref(getMockEdges())
const stats = ref(getGraphStats())

/* ===== 状态 ===== */
const searchQuery = ref('')
const aiQuestion = ref('')
const viewMode = ref<ViewMode>('star')
const isFullscreen = ref(false)
const selectedNode = ref<KnowledgeNode | null>(null)
const hoveredNode = ref<KnowledgeNode | null>(null)
const searchResultId = ref<string | null>(null)
const aiLoading = ref(false)
const showPathTimeline = ref(false)
const graphCanvasRef = ref<InstanceType<typeof GraphCanvas> | null>(null)

/* 筛选状态 */
const filterCategories = ref<NodeCategory[]>([])
const filterRelationTypes = ref<RelationType[]>([])
const filterStatuses = ref<string[]>([])
const layerDepth = ref(2)

/* ===== AI 解读 ===== */
const currentInsight = ref(getAIInsight('n01'))

watch(selectedNode, (node) => {
  if (node) {
    aiLoading.value = true
    showPathTimeline.value = false
    setTimeout(() => {
      currentInsight.value = getAIInsight(node.id)
      aiLoading.value = false
    }, 600)
  }
}, { immediate: true })

/* ===== 路径节点 ===== */
const pathNodes = computed<PathNode[]>(() => {
  if (!selectedNode.value) return []
  return getPathForNode(selectedNode.value.id)
})

/* ===== 工具函数 ===== */
function getNodeCount(category: NodeCategory): number {
  return allNodes.value.filter(n => n.category === category).length
}

function riskLabel(level: string): string {
  return level === 'high' ? '高风险' : level === 'medium' ? '中等' : '低风险'
}

/* ===== 事件处理 ===== */
function handleNodeClick(node: KnowledgeNode) {
  selectedNode.value = selectedNode.value?.id === node.id ? null : node
}

function handleNodeDblclick(node: KnowledgeNode) {
  ElMessage.info(`打开文档详情：${node.name}（模拟）`)
}

function handleNodeHover(node: KnowledgeNode | null) {
  hoveredNode.value = node
}

function handleCanvasClick() {
  // selectedNode.value = null
}

function handleSearch() {
  if (!searchQuery.value.trim()) return
  const found = allNodes.value.find(n => n.name.includes(searchQuery.value.trim()))
  if (found) {
    selectedNode.value = found
    searchResultId.value = found.id
    graphCanvasRef.value?.focusNode(found.id)
    ElMessage.success(`已定位到「${found.name}」`)
  } else {
    ElMessage.warning('未找到匹配的知识节点')
  }
}

function handleAiQuestion() {
  if (!aiQuestion.value.trim()) return
  ElMessage.info(`AI 正在分析：「${aiQuestion.value}」（模拟）`)
  setTimeout(() => {
    ElMessage.success(`AI 已在图谱中高亮相关路径（模拟）`)
  }, 1200)
}

function handleAiOrganize() {
  ElMessage.info('AI 正在自动梳理知识关系...')
  setTimeout(() => ElMessage.success('AI 已完成关系梳理，发现 3 条新关联（模拟）'), 1500)
}

function handleRecalculate() {
  ElMessage.info('正在重新计算知识图谱...')
  setTimeout(() => ElMessage.success('图谱计算完成（模拟）'), 1200)
}

function handleExport() {
  ElMessage.success('图谱导出成功（模拟）')
}

function handlePathNodeClick(nodeId: string) {
  const node = allNodes.value.find(n => n.id === nodeId)
  if (node) {
    selectedNode.value = node
    graphCanvasRef.value?.focusNode(nodeId)
  }
}

/* ===== 筛选快捷入口 ===== */
function quickFilter(type: string) {
  filterCategories.value = []
  filterRelationTypes.value = []
  filterStatuses.value = []
  switch (type) {
    case 'hot':
      // 显示核心节点（symbolSize 较大的）
      break
    case 'recent':
      filterStatuses.value = ['normal']
      break
    case 'risk':
      filterStatuses.value = ['high_risk', 'expired']
      break
    case 'orphan':
      filterCategories.value = ['risk']
      break
    case 'ai':
      filterCategories.value = ['ai_rec']
      filterRelationTypes.value = ['recommend']
      break
  }
  ElMessage.info(`已切换到「${type === 'hot' ? '高频知识' : type === 'recent' ? '最近更新' : type === 'risk' ? '风险知识' : type === 'orphan' ? '未关联文档' : 'AI 新关系'}」视图`)
}

function resetFilters() {
  filterCategories.value = []
  filterRelationTypes.value = []
  filterStatuses.value = []
  layerDepth.value = 2
}
</script>

<style scoped lang="scss">
/* ===== 页面根 ===== */
.kg-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  height: 100%;
  padding-bottom: 4px;
  color: #172554;

  &.is-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 1000;
    padding: 0;
    gap: 0;
    background: #0a0f1e;

    .kg-console { display: none; }
    .kg-body { height: 100vh; }
    .kg-left, .kg-right { display: none; }
    .kg-timeline { display: none; }
  }
}

/* ===== 控制台 ===== */
.kg-console {
  position: relative;
  border-radius: var(--app-card-radius);
  overflow: hidden;
  flex-shrink: 0;
}

.console-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #312e81 100%);
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 600px 200px at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 400px 160px at 80% 30%, rgba(6,182,212,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    animation: console-flow 20s linear infinite;
  }
}

@keyframes console-flow {
  0% { background-position: 0 0; }
  100% { background-position: 32px 32px; }
}

.console-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 18px 24px;
  color: #fff;
}

.console-left {
  flex-shrink: 0;
  min-width: 200px;

  .console-kicker {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.5;

    span { display: inline-block; width: 16px; height: 2px; border-radius: 1px; background: rgba(255,255,255,0.3); }
  }

  h1 { margin: 0 0 3px; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
  p { margin: 0; font-size: 12px; opacity: 0.6; }
}

.console-center {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .console-search {
    display: flex;
    gap: 8px;
    :deep(.el-input__wrapper) { border-radius: 8px; background: rgba(255,255,255,0.1); box-shadow: none; border: 1px solid rgba(255,255,255,0.15); }
    :deep(.el-input__inner) { color: #fff; &::placeholder { color: rgba(255,255,255,0.4); } }
    :deep(.el-input__prefix .el-icon) { color: rgba(255,255,255,0.5); }
  }

  .console-ai-search {
    :deep(.el-input__wrapper) { border-radius: 8px; background: rgba(168,85,247,0.08); box-shadow: none; border: 1px solid rgba(168,85,247,0.2); }
    :deep(.el-input__inner) { color: #fff; font-size: 12px; &::placeholder { color: rgba(168,85,247,0.5); } }
    :deep(.el-input__prefix .el-icon) { color: rgba(168,85,247,0.6); }
  }
}

.console-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.view-modes {
  display: flex;
  gap: 4px;
  padding: 3px;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);

  .vm-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: rgba(255,255,255,0.55);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    :deep(.app-icon) { width: 14px; height: 14px; }

    &:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.06); }
    &.active {
      color: #fff;
      background: linear-gradient(135deg, rgba(99,102,241,0.45), rgba(139,92,246,0.35));
      box-shadow: 0 2px 8px rgba(99,102,241,0.25);
    }
  }
}

.console-actions {
  display: flex;
  gap: 6px;

  :deep(.el-button) {
    border-color: rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.75);
    font-size: 11px;

    &:hover {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }
  }
}

/* ===== 主体区域 ===== */
.kg-body {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 12px;
  min-height: 0;
  flex: 1;

  &:has(.kg-right) {
    grid-template-columns: 210px minmax(0, 1fr) 300px;
  }
}

/* ===== 左侧面板 ===== */
.kg-left {
  padding: 14px 12px;
  overflow-y: auto;
  height: fit-content;
  max-height: calc(100vh - 200px);
  position: sticky;
  top: 0;

  .left-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f1f5f9;

    h2 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }
}

.filter-section {
  margin-bottom: 14px;

  .fs-title {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .fs-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .fs-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 12px;
    color: #475569;

    &:hover { background: #f8fafc; }
    &.active { background: #f1f5f9; color: #1e293b; font-weight: 600; }

    .fs-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .fs-name { flex: 1; }
    .fs-count { font-size: 11px; color: #94a3b8; font-weight: 500; }
  }
}

.layer-btns {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .layer-btn {
    padding: 6px 10px;
    border: 1px solid #e5eaf3;
    border-radius: 6px;
    background: #fafbff;
    color: #475569;
    font-size: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;

    &:hover { border-color: #c7d2fe; background: #f5f3ff; }
    &.active { border-color: #818cf8; background: #eef2ff; color: #4338ca; font-weight: 600; }
  }
}

.quick-entries {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .qe-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #475569;
    font-size: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;

    :deep(.app-icon) { width: 14px; height: 14px; color: #6366f1; }

    &:hover { background: #f1f5f9; color: #1e293b; }
  }
}

/* ===== 图谱画布容器 ===== */
.kg-canvas-wrap {
  min-width: 0;
  min-height: 0;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 220px);
  min-height: 480px;
  border-radius: var(--app-card-radius);
  overflow: hidden;
  background:
    radial-gradient(ellipse 80% 60% at 50% 45%, rgba(30,58,95,0.25) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 25% 30%, rgba(99,102,241,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 45% 35% at 75% 70%, rgba(139,92,246,0.05) 0%, transparent 60%),
    linear-gradient(180deg, #060a14 0%, #0a0f1e 30%, #0f172a 60%, #111827 100%);
  border: 1px solid rgba(99,102,241,0.1);
  box-shadow:
    inset 0 0 80px rgba(6,10,20,0.6),
    inset 0 1px 0 rgba(99,102,241,0.08),
    0 4px 24px rgba(0,0,0,0.2);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 120px rgba(6,10,20,0.5);
    pointer-events: none;
    z-index: 2;
  }
}

/* ===== 统计浮层 ===== */
.stats-overlay {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  max-width: 340px;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  background: rgba(10,15,30,0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99,102,241,0.12);
  box-shadow: 0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04);
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: rgba(99,102,241,0.25);
    box-shadow: 0 2px 16px rgba(99,102,241,0.12);
  }

  .sc-val {
    font-size: 15px;
    font-weight: 800;
    color: #e2e8f0;
    text-shadow: 0 0 8px rgba(99,102,241,0.2);
  }
  .sc-label {
    font-size: 10px;
    color: #64748b;
    letter-spacing: 0.3px;
  }

  &--warn {
    border-color: rgba(251,191,36,0.15);
    .sc-val { color: #fbbf24; text-shadow: 0 0 8px rgba(251,191,36,0.2); }
  }
  &--danger {
    border-color: rgba(248,113,113,0.15);
    .sc-val { color: #f87171; text-shadow: 0 0 8px rgba(248,113,113,0.2); }
  }
  &--ai {
    border-color: rgba(192,132,252,0.15);
    .sc-val { color: #c084fc; text-shadow: 0 0 8px rgba(192,132,252,0.2); }
  }
}

/* ===== 视图指示器 ===== */
.view-indicator {
  position: absolute;
  bottom: 14px;
  left: 14px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(10,15,30,0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99,102,241,0.12);
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.5px;

  .vi-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #6366f1;
    box-shadow: 0 0 8px rgba(99,102,241,0.5);
    animation: vi-pulse 2s ease-in-out infinite;
  }
}

@keyframes vi-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); box-shadow: 0 0 6px rgba(99,102,241,0.3); }
  50% { opacity: 1; transform: scale(1.4); box-shadow: 0 0 12px rgba(99,102,241,0.6); }
}

/* ===== 右侧面板 ===== */
.kg-right {
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  height: fit-content;
  position: sticky;
  top: 0;

  .right-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .rh-type {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;

    .rh-dot { width: 8px; height: 8px; border-radius: 50%; }
  }

  .right-title {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 800;
    color: #1f2937;
    line-height: 1.3;
  }

  .right-meta {
    margin-bottom: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: #f8faff;
    border: 1px solid #e6eef8;

    .rm-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 12px;
      border-bottom: 1px solid #f1f5f9;

      &:last-child { border-bottom: none; }
      .rm-label { color: #94a3b8; }
      .rm-val { color: #1f2937; font-weight: 500; }
      .rm-status { font-weight: 700; }
    }

    .rm-risk {
      font-weight: 700;
      &.risk--high { color: #ef4444; }
      &.risk--medium { color: #f59e0b; }
      &.risk--low { color: #22c55e; }
    }
  }

  .right-summary {
    margin: 0 0 14px;
    font-size: 13px;
    color: #475569;
    line-height: 1.7;
  }
}

/* ===== AI 解读区 ===== */
.ai-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 14px;

  .ai-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;

    :deep(.app-icon) { width: 16px; height: 16px; color: #8b5cf6; }

    h3 {
      margin: 0;
      font-size: 13px;
      font-weight: 700;
      color: #4338ca;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.ai-loading {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 16px 0;

  .ai-loading-bar {
    width: 100%;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
    background-size: 200% 100%;
    animation: loading-flow 1.5s ease-in-out infinite;
  }

  span { font-size: 12px; color: #94a3b8; }
}

@keyframes loading-flow {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.ai-text {
  margin: 0 0 12px;
  font-size: 13px;
  color: #475569;
  line-height: 1.7;
  padding: 10px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%);
  border: 1px solid rgba(139,92,246,0.1);
}

.ai-block {
  margin-bottom: 10px;

  .ab-title {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .ab-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}

.ab-conflicts, .ab-suggestions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ab-conflict, .ab-suggestion {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;

  :deep(.app-icon) { width: 14px; height: 14px; flex-shrink: 0; margin-top: 2px; }
}

.ab-conflict {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;

  :deep(.app-icon) { color: #ef4444; }
}

.ab-suggestion {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;

  :deep(.app-icon) { color: #0ea5e9; }
}

.ai-chain-btn {
  width: 100%;
  margin-top: 12px;

  :deep(.app-icon) { width: 14px; height: 14px; }
}

/* ===== 底部时间轴 ===== */
.kg-timeline {
  flex-shrink: 0;
  border-radius: var(--app-card-radius);
  background: #fff;
  border: 1px solid #e6eef8;
  box-shadow: var(--app-card-shadow);
  overflow: hidden;

  .timeline-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 8px;
    border: none;
    background: transparent;
    color: #6366f1;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    :deep(.app-icon) { width: 14px; height: 14px; }
    &:hover { background: #f8faff; }
  }
}

.timeline-track {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 12px 20px 16px;
  overflow-x: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-track { background: #f1f5f9; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
}

.tl-node {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}

.tl-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #e5eaf3;
  background: #fafbff;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  text-align: center;

  &:hover { border-color: #c7d2fe; background: #eef2ff; transform: translateY(-2px); }

  .tl-dot { width: 8px; height: 8px; border-radius: 50%; }
  .tl-name { font-size: 12px; font-weight: 600; color: #1f2937; white-space: nowrap; }
  .tl-type { font-size: 10px; color: #94a3b8; }
}

.tl-node.current .tl-card {
  border-color: #6366f1;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  box-shadow: 0 4px 12px rgba(99,102,241,0.15);

  .tl-name { color: #4338ca; }
}

.tl-node.risk .tl-card {
  border-color: #fca5a5;
  background: #fff5f5;

  .tl-name { color: #dc2626; }
}

.tl-arrow {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  font-size: 10px;
  color: #94a3b8;
  white-space: nowrap;

  :deep(.app-icon) { width: 14px; height: 14px; color: #cbd5e1; }
}

/* ===== 响应式 ===== */
@media (max-width: 1400px) {
  .console-content { flex-wrap: wrap; }
  .console-left { min-width: 160px; }
  .view-modes .vm-btn span { display: none; }
}

@media (max-width: 1200px) {
  .kg-body { grid-template-columns: 190px minmax(0, 1fr); }
  .kg-body:has(.kg-right) { grid-template-columns: 190px minmax(0, 1fr) 280px; }
}

@media (max-width: 960px) {
  .kg-body { grid-template-columns: minmax(0, 1fr); }
  .kg-body:has(.kg-right) { grid-template-columns: minmax(0, 1fr); }
  .kg-left { display: none; }
  .kg-right { max-height: 400px; }
  .console-content { flex-direction: column; }
  .console-right { align-items: stretch; }
  .view-modes { justify-content: center; }
  .console-actions { justify-content: center; flex-wrap: wrap; }
}
</style>
