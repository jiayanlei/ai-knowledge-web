<template>
  <div ref="chartRef" class="graph-canvas" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { KnowledgeNode, KnowledgeEdge, ViewMode, NodeCategory, RelationType } from '../types'
import { CATEGORY_CONFIG, RELATION_CONFIG } from '../mock'

const props = defineProps<{
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
  viewMode: ViewMode
  selectedId: string | null
  hoveredId: string | null
  filterCategories: NodeCategory[]
  filterRelationTypes: RelationType[]
  filterStatuses: string[]
}>()

const emit = defineEmits<{
  'node-click': [node: KnowledgeNode]
  'node-dblclick': [node: KnowledgeNode]
  'node-hover': [node: KnowledgeNode | null]
  'canvas-click': []
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let breathTimer: ReturnType<typeof setInterval> | null = null
let breathPhase = 0
let currentZoom = 0.9

const CATEGORY_KEYS: NodeCategory[] = ['institution', 'process', 'project', 'role', 'risk', 'ai_rec']
const MODE_BASE_ZOOM: Record<ViewMode, number> = {
  star: 0.9,
  brain: 0.95,
  chain: 0.9,
  impact: 0.92
}

function buildCategories() {
  return CATEGORY_KEYS.map(key => ({
    name: CATEGORY_CONFIG[key].name,
    itemStyle: { color: CATEGORY_CONFIG[key].color }
  }))
}

/* ===== Node gradient builder ===== */
function nodeColor(n: KnowledgeNode): any {
  const c = CATEGORY_CONFIG[n.category].color
  return new echarts.graphic.RadialGradient(0.4, 0.35, 0.8, [
    { offset: 0, color: lighten(c, 60) },
    { offset: 0.45, color: c },
    { offset: 1, color: darken(c, 30) }
  ])
}

/* ===== Build node item style ===== */
function buildNodeStyle(n: KnowledgeNode, phase: number) {
  const cfg = CATEGORY_CONFIG[n.category]
  const isSelected = props.selectedId === n.id
  const isRisk = n.category === 'risk'
  const isAI = n.category === 'ai_rec'
  const isCore = n.symbolSize >= 50

  // Breathing glow amplitude
  const breathAmp = isSelected ? 12 : isCore ? 7 : 4
  const baseBlur = isCore ? 22 : 14
  const dynamicBlur = baseBlur + Math.sin(phase + n.symbolSize * 0.1) * breathAmp

  // Risk pulse: stronger breathing
  const riskPulse = isRisk ? Math.abs(Math.sin(phase * 1.5)) * 10 : 0

  return {
    color: nodeColor(n),
    borderColor: isSelected ? 'rgba(255,255,255,0.9)'
      : isRisk ? `rgba(252,165,165,${0.5 + Math.sin(phase * 1.5) * 0.3})`
      : isAI ? 'rgba(168,85,247,0.4)'
      : 'rgba(255,255,255,0.12)',
    borderWidth: isSelected ? 3 : isRisk ? 2 : isAI ? 1.5 : 1,
    borderType: isAI ? 'dashed' as const : 'solid' as const,
    shadowColor: cfg.glowColor,
    shadowBlur: dynamicBlur + riskPulse,
    opacity: isAI ? 0.85 : 1
  }
}

/* ===== Build label style ===== */
function buildLabel(n: KnowledgeNode) {
  const isSelected = props.selectedId === n.id
  const name = n.name.length > 8 ? n.name.slice(0, 7) + '..' : n.name
  return {
    show: true,
    formatter: name,
    fontSize: n.symbolSize >= 50 ? 12 : 11,
    fontWeight: (n.symbolSize >= 50 || isSelected) ? 'bold' as const : 'normal' as const,
    color: isSelected ? '#fff' : '#c8d6e5',
    textBorderColor: 'rgba(10,15,30,0.7)',
    textBorderWidth: 2,
    textBorderType: 'solid' as const
  }
}

/* ===== Filter ===== */
function getVisibleNodes(): KnowledgeNode[] {
  let list = props.nodes
  if (props.filterCategories.length > 0) list = list.filter(n => props.filterCategories.includes(n.category))
  if (props.filterStatuses.length > 0) list = list.filter(n => props.filterStatuses.includes(n.status))
  return list
}

function getVisibleEdges(ids: Set<string>): KnowledgeEdge[] {
  let list = props.edges.filter(e => ids.has(e.source) && ids.has(e.target))
  if (props.filterRelationTypes.length > 0) list = list.filter(e => props.filterRelationTypes.includes(e.relationType))
  return list
}

function statusName(status: KnowledgeNode['status']) {
  const map: Record<KnowledgeNode['status'], string> = {
    normal: '正常',
    pending_update: '待更新',
    expired: '已过期',
    high_risk: '高风险',
    ai_suggested: 'AI 建议'
  }
  return map[status] || status
}

function makeSyntheticNode(partial: Partial<KnowledgeNode> & Pick<KnowledgeNode, 'id' | 'name' | 'category'>): KnowledgeNode {
  return {
    department: '企业知识库',
    updateTime: '2026-06-08',
    owner: 'AI 引擎',
    status: 'normal',
    referenceCount: 0,
    affectedProcessCount: 0,
    riskLevel: 'low',
    summary: 'AI 根据企业知识库关系生成的可视化节点。',
    symbolSize: 42,
    ...partial
  }
}

function makeSyntheticEdge(partial: Partial<KnowledgeEdge> & Pick<KnowledgeEdge, 'id' | 'source' | 'target'>): KnowledgeEdge {
  return {
    relationType: 'sequence',
    strength: 'normal',
    description: 'AI 生成的知识关系链路。',
    ...partial
  }
}

function toEcNode(n: KnowledgeNode, phase: number, extra: Record<string, any> = {}) {
  return {
    id: n.id,
    name: n.name,
    value: n.id,
    symbolSize: n.symbolSize,
    category: CATEGORY_KEYS.indexOf(n.category),
    itemStyle: buildNodeStyle(n, phase),
    label: buildLabel(n),
    _raw: n,
    ...extra
  }
}

function toEcEdge(e: KnowledgeEdge, extra: Record<string, any> = {}) {
  const rel = RELATION_CONFIG[e.relationType]
  const isConflict = e.relationType === 'conflict'
  const isRecommend = e.relationType === 'recommend'
  const isStrong = e.strength === 'strong'
  const isInfluence = e.relationType === 'influence'

  return {
    source: e.source,
    target: e.target,
    lineStyle: {
      color: rel.color,
      width: isStrong ? 2.2 : 1,
      type: (isConflict || isRecommend) ? [6, 4] as number[] : 'solid' as const,
      opacity: isRecommend ? 0.35 : isConflict ? 0.5 : isStrong ? 0.7 : 0.45,
      curveness: 0.12,
      shadowColor: isStrong ? rel.color : 'transparent',
      shadowBlur: isStrong ? 6 : 0
    },
    symbol: isInfluence || e.relationType === 'sequence' ? ['none', 'arrow'] as [string, string]
      : isRecommend ? ['none', 'arrow'] as [string, string]
      : ['none', 'arrow'] as [string, string],
    symbolSize: [0, isStrong ? 8 : 6],
    label: { show: false, formatter: rel.name, fontSize: 10, color: '#94a3b8' },
    _raw: e,
    ...extra
  }
}

/* ===== Build series data ===== */
function buildSeriesData(phase: number = 0) {
  if (props.viewMode === 'brain') return buildBrainSeriesData(phase)
  if (props.viewMode === 'chain') return buildChainSeriesData(phase)
  if (props.viewMode === 'impact') return buildImpactSeriesData(phase)

  const visNodes = getVisibleNodes()
  const visIds = new Set(visNodes.map(n => n.id))
  const visEdges = getVisibleEdges(visIds)

  const ecNodes = visNodes.map(n => toEcNode(n, phase))
  const ecEdges = visEdges.map(e => toEcEdge(e))

  return { nodes: ecNodes, edges: ecEdges }
}

function buildBrainSeriesData(phase: number = 0) {
  const visNodes = getVisibleNodes()
  const visIds = new Set(visNodes.map(n => n.id))
  const visEdges = getVisibleEdges(visIds)
  const centerNode = makeSyntheticNode({
    id: 'brain-core',
    name: '企业知识中枢',
    category: 'ai_rec',
    department: '企业知识库',
    owner: 'AI 知识中枢',
    summary: '汇聚制度、流程、项目文档和角色职责，形成企业知识结构树。',
    referenceCount: visNodes.length,
    affectedProcessCount: visEdges.length,
    symbolSize: 76
  })

  const orderedNodes = [...visNodes].sort((a, b) => b.symbolSize - a.symbolSize)
  const ecNodes = [
    toEcNode(centerNode, phase, {
      x: 0,
      y: 0,
      fixed: true,
      label: { ...buildLabel(centerNode), formatter: '企业知识\n中枢', fontSize: 13, color: '#fff' }
    }),
    ...orderedNodes.map((node, index) => {
      const ring = index < 10 ? 1 : 2
      const ringIndex = ring === 1 ? index : index - 10
      const ringTotal = ring === 1 ? Math.min(orderedNodes.length, 10) : Math.max(orderedNodes.length - 10, 1)
      const radius = ring === 1 ? 235 : 390
      const angle = (Math.PI * 2 * ringIndex) / ringTotal - Math.PI / 2 + (ring === 2 ? Math.PI / ringTotal : 0)
      const isSelected = props.selectedId === node.id
      return toEcNode(node, phase, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        fixed: true,
        symbolSize: node.symbolSize + (ring === 1 ? 4 : 0) + (isSelected ? 8 : 0),
        label: {
          ...buildLabel(node),
          formatter: `${node.name.length > 9 ? node.name.slice(0, 8) + '..' : node.name}\n${isSelected ? '已展开' : '点击展开'}`,
          fontSize: ring === 1 ? 12 : 11,
          color: ring === 1 ? '#e0f2fe' : '#cbd5e1'
        }
      })
    })
  ]

  const structureEdges = orderedNodes.map((node, index) => toEcEdge(makeSyntheticEdge({
    id: `brain-link-${node.id}`,
    source: 'brain-core',
    target: node.id,
    relationType: index < 10 ? 'belonging' : 'reference',
    strength: index < 10 ? 'strong' : 'normal',
    description: `企业知识中枢关联「${node.name}」`
  }), {
    lineStyle: {
      color: index < 10 ? 'rgba(56,189,248,0.72)' : 'rgba(129,140,248,0.42)',
      width: index < 10 ? 2 : 1.2,
      opacity: index < 10 ? 0.7 : 0.36,
      curveness: 0.16,
      shadowColor: 'rgba(56,189,248,0.5)',
      shadowBlur: index < 10 ? 10 : 4
    },
    symbol: ['none', 'arrow'],
    symbolSize: [0, index < 10 ? 8 : 5]
  }))

  const knowledgeEdges = visEdges.map(e => toEcEdge(e, {
    lineStyle: {
      ...toEcEdge(e).lineStyle,
      opacity: 0.24,
      curveness: 0.22,
      shadowColor: 'rgba(129,140,248,0.24)',
      shadowBlur: 5
    }
  }))

  return { nodes: ecNodes, edges: [...structureEdges, ...knowledgeEdges] }
}

function buildChainSeriesData(phase: number = 0) {
  const steps = [
    { id: 'chain-apply', name: '发起申请', owner: '申请人', doc: '费用报销填报指引', status: 'normal' as const, risk: 'low' as const, x: -480, y: 0 },
    { id: 'chain-dept', name: '部门审批', owner: '部门负责人', doc: '审批权限矩阵', status: 'normal' as const, risk: 'low' as const, x: -240, y: -56 },
    { id: 'chain-finance', name: '财务复核', owner: '财务主管', doc: '报销管理制度', status: 'pending_update' as const, risk: 'medium' as const, x: 0, y: 0 },
    { id: 'chain-leader', name: '主管确认', owner: '分管主管', doc: '预算审批规范', status: 'high_risk' as const, risk: 'high' as const, x: 240, y: -56 },
    { id: 'chain-archive', name: '归档完成', owner: '档案管理员', doc: '电子发票归档规范', status: 'normal' as const, risk: 'low' as const, x: 480, y: 0 }
  ]

  const nodes = steps.map((step, index) => {
    const node = makeSyntheticNode({
      id: step.id,
      name: step.name,
      category: step.status === 'high_risk' ? 'risk' : 'process',
      owner: step.owner,
      status: step.status,
      riskLevel: step.risk,
      department: index < 2 ? '业务部门' : index < 4 ? '财务部' : '文档中心',
      summary: `${step.name}由${step.owner}处理，依据《${step.doc}》完成流程校验。`,
      symbolSize: step.status === 'high_risk' ? 62 : step.status === 'pending_update' ? 58 : 52,
      tags: [step.doc, statusName(step.status)]
    })

    return toEcNode(node, phase, {
      x: step.x,
      y: step.y,
      fixed: true,
      label: {
        show: true,
        formatter: `${step.name}\n${step.owner}\n${step.doc}\n${statusName(step.status)}`,
        fontSize: 11,
        lineHeight: 16,
        color: step.status === 'high_risk' ? '#fee2e2' : '#e0f2fe',
        textBorderColor: 'rgba(6,10,20,0.84)',
        textBorderWidth: 3
      }
    })
  })

  const edges = steps.slice(0, -1).map((step, index) => toEcEdge(makeSyntheticEdge({
    id: `chain-edge-${index}`,
    source: step.id,
    target: steps[index + 1].id,
    relationType: 'sequence',
    strength: index === 2 ? 'strong' : 'normal',
    description: `${step.name}流转到${steps[index + 1].name}`
  }), {
    lineStyle: {
      color: index === 2 ? 'rgba(248,113,113,0.78)' : 'rgba(34,211,238,0.76)',
      width: index === 2 ? 3 : 2.2,
      opacity: 0.82,
      curveness: 0.18,
      shadowColor: index === 2 ? 'rgba(248,113,113,0.42)' : 'rgba(34,211,238,0.48)',
      shadowBlur: 12
    },
    symbol: ['none', 'arrow'],
    symbolSize: [0, 12]
  }))

  return { nodes, edges }
}

function buildImpactSeriesData(phase: number = 0) {
  const fallbackNode = props.nodes.find(n => n.id === 'n04') || props.nodes[0]
  const center = props.nodes.find(n => n.id === props.selectedId) || fallbackNode
  if (!center) return { nodes: [], edges: [] }

  const centerNode = {
    ...center,
    symbolSize: Math.max(center.symbolSize, 72)
  }
  const impactItems = [
    { id: 'impact-policy', name: '受影响制度', label: '差旅费用细则', category: 'institution' as const, risk: 'high' as const, status: 'pending_update' as const, angle: -90 },
    { id: 'impact-flow', name: '关联流程', label: '差旅申请流程', category: 'process' as const, risk: 'high' as const, status: 'high_risk' as const, angle: -25 },
    { id: 'impact-project', name: '项目文档', label: 'Q2 项目预算模板', category: 'project' as const, risk: 'medium' as const, status: 'normal' as const, angle: 40 },
    { id: 'impact-dept', name: '涉及部门', label: '财务部 / 行政部', category: 'role' as const, risk: 'medium' as const, status: 'normal' as const, angle: 105 },
    { id: 'impact-role', name: '人员角色', label: '财务主管 / 部门负责人', category: 'role' as const, risk: 'medium' as const, status: 'normal' as const, angle: 175 },
    { id: 'impact-ai', name: '待补充知识', label: '电子发票归档规范', category: 'ai_rec' as const, risk: 'low' as const, status: 'ai_suggested' as const, angle: 245 }
  ]

  const nodes = [
    toEcNode(centerNode, phase, {
      x: 0,
      y: 0,
      fixed: true,
      label: { ...buildLabel(centerNode), formatter: `${centerNode.name}\n变更中心`, fontSize: 13, color: '#fff' }
    }),
    ...impactItems.map((item) => {
      const radians = (item.angle * Math.PI) / 180
      const radius = item.risk === 'high' ? 300 : item.risk === 'medium' ? 360 : 410
      const node = makeSyntheticNode({
        id: item.id,
        name: item.name,
        category: item.category,
        owner: 'AI 影响分析',
        status: item.status,
        riskLevel: item.risk,
        department: item.label,
        summary: `${center.name}变更后，可能影响${item.name}：${item.label}。`,
        symbolSize: item.risk === 'high' ? 58 : item.risk === 'medium' ? 50 : 44,
        tags: [item.label, item.risk === 'high' ? '高影响' : item.risk === 'medium' ? '中影响' : '低影响']
      })

      return toEcNode(node, phase, {
        x: Math.cos(radians) * radius,
        y: Math.sin(radians) * radius,
        fixed: true,
        label: {
          ...buildLabel(node),
          formatter: `${item.name}\n${item.label}\n${item.risk === 'high' ? '高影响' : item.risk === 'medium' ? '中影响' : '低影响'}`,
          lineHeight: 16,
          color: item.risk === 'high' ? '#fee2e2' : '#dbeafe'
        }
      })
    })
  ]

  const edges = impactItems.map((item) => toEcEdge(makeSyntheticEdge({
    id: `impact-edge-${item.id}`,
    source: center.id,
    target: item.id,
    relationType: 'influence',
    strength: item.risk === 'high' ? 'strong' : 'normal',
    description: `${center.name}对${item.label}产生${item.risk === 'high' ? '高' : item.risk === 'medium' ? '中' : '低'}影响。`
  }), {
    lineStyle: {
      color: item.risk === 'high' ? 'rgba(248,113,113,0.82)' : item.risk === 'medium' ? 'rgba(251,191,36,0.68)' : 'rgba(34,211,238,0.56)',
      width: item.risk === 'high' ? 3 : 2,
      opacity: item.risk === 'high' ? 0.78 : 0.58,
      curveness: 0.22,
      shadowColor: item.risk === 'high' ? 'rgba(248,113,113,0.42)' : 'rgba(34,211,238,0.36)',
      shadowBlur: item.risk === 'high' ? 16 : 10
    },
    symbol: ['none', 'arrow'],
    symbolSize: [0, item.risk === 'high' ? 12 : 9]
  }))

  return { nodes, edges }
}

/* ===== Layout ===== */
function getLayoutConfig(mode: ViewMode) {
  switch (mode) {
    case 'star':
      return { type: 'force' as const, force: { repulsion: 450, gravity: 0.08, edgeLength: [90, 200], friction: 0.65, layoutAnimation: true } }
    case 'brain':
      return { type: 'none' as const, force: undefined }
    case 'chain':
      return { type: 'none' as const, force: undefined }
    case 'impact':
      return { type: 'none' as const, force: undefined }
    default:
      return { type: 'force' as const, force: { repulsion: 450, gravity: 0.08, edgeLength: [90, 200] } }
  }
}

/* ===== Full option ===== */
function buildOption(phase: number = 0): echarts.EChartsOption {
  const { nodes, edges } = buildSeriesData(phase)
  const layout = getLayoutConfig(props.viewMode)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      backgroundColor: 'rgba(10,15,30,0.94)',
      borderColor: 'rgba(99,102,241,0.25)',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      padding: [12, 16],
      extraCssText: 'backdrop-filter:blur(8px);border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.4);',
      formatter(params: any) {
        if (params.dataType === 'node') {
          const r = params.data._raw as KnowledgeNode
          const catCfg = CATEGORY_CONFIG[r.category]
          const statusMap: Record<string, string> = { normal: '正常', pending_update: '待更新', expired: '已过期', high_risk: '高风险', ai_suggested: 'AI 建议' }
          return `<div style="font-weight:700;font-size:14px;margin-bottom:8px;color:#fff">${r.name}</div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${catCfg.color};box-shadow:0 0 6px ${catCfg.glowColor}"></span>
              <span style="color:#94a3b8;font-size:11px">${catCfg.name}</span>
              <span style="color:#64748b;font-size:11px">·</span>
              <span style="color:#94a3b8;font-size:11px">${r.department}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px 12px;font-size:11px;color:#64748b;margin-bottom:6px">
              <span>负责人：<b style="color:#94a3b8">${r.owner}</b></span>
              <span>引用：<b style="color:#94a3b8">${r.referenceCount}</b></span>
              <span>状态：<b style="color:#94a3b8">${statusMap[r.status] || r.status}</b></span>
              <span>影响流程：<b style="color:#94a3b8">${r.affectedProcessCount}</b></span>
            </div>
            <div style="color:#475569;font-size:11px;max-width:260px;line-height:1.6;border-top:1px solid rgba(255,255,255,0.06);padding-top:6px">${r.summary}</div>`
        }
        if (params.dataType === 'edge') {
          const r = params.data._raw as KnowledgeEdge
          const s = props.nodes.find(n => n.id === r.source)
          const t = props.nodes.find(n => n.id === r.target)
          return `<div style="font-weight:600;margin-bottom:4px;color:#fff">${RELATION_CONFIG[r.relationType].name}关系</div>
            <div style="color:#94a3b8;font-size:11px;margin-bottom:4px">${s?.name || ''} → ${t?.name || ''}</div>
            <div style="color:#475569;font-size:11px;max-width:240px">${r.description}</div>`
        }
        return ''
      }
    },
    legend: { show: false },
    animationDuration: 1000,
    animationEasingUpdate: 'cubicInOut',
    animationDurationUpdate: 600,
    series: [{
      type: 'graph',
      layout: layout.type,
      force: layout.force,
      roam: true,
      draggable: props.viewMode === 'star',
      zoom: currentZoom,
      scaleLimit: { min: 0.3, max: 2.5 },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [0, 7],
      emphasis: {
        focus: 'adjacency',
        lineStyle: { width: 3, opacity: 1, shadowColor: 'rgba(99,102,241,0.5)', shadowBlur: 10 },
        itemStyle: { shadowBlur: 35, borderWidth: 3, borderColor: 'rgba(255,255,255,0.8)' },
        label: { fontSize: 13, fontWeight: 'bold', color: '#fff' }
      },
      blur: {
        itemStyle: { opacity: 0.1 },
        lineStyle: { opacity: 0.04 },
        label: { opacity: 0.15 }
      },
      categories: buildCategories(),
      data: nodes,
      links: edges,
      label: { position: 'bottom', distance: 8 },
      lineStyle: {},
      zlevel: 1
    }]
  }
}

/* ===== Init ===== */
function initChart() {
  if (!chartRef.value || chart) return
  chart = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  chart.setOption(buildOption())

  chart.on('click', (p: any) => {
    if (p.dataType === 'node') emit('node-click', p.data._raw as KnowledgeNode)
    else emit('canvas-click')
  })
  chart.on('dblclick', (p: any) => {
    if (p.dataType === 'node') emit('node-dblclick', p.data._raw as KnowledgeNode)
  })
  chart.on('mouseover', (p: any) => {
    if (p.dataType === 'node') emit('node-hover', p.data._raw as KnowledgeNode)
  })
  chart.on('mouseout', () => emit('node-hover', null))
  chart.getZr().on('click', (e: any) => { if (!e.target) emit('canvas-click') })

  // Breathing animation timer
  startBreathing()
}

/* ===== Breathing glow ===== */
function startBreathing() {
  stopBreathing()
  breathTimer = setInterval(() => {
    breathPhase += 0.18
    if (!chart) return

    // Only update node data for breathing, not the full option.
    const updatedNodes = buildSeriesData(breathPhase).nodes

    chart!.setOption({
      series: [{ data: updatedNodes }]
    }, { notMerge: false, lazyUpdate: true })
  }, 120)
}

function stopBreathing() {
  if (breathTimer) { clearInterval(breathTimer); breathTimer = null }
}

/* ===== Update ===== */
function updateChart() {
  if (!chart) return
  chart.setOption(buildOption(breathPhase), { notMerge: false, lazyUpdate: true })
}

/* ===== Highlight ===== */
function highlightNode(nodeId: string) {
  if (!chart) return
  chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: -1 })
  const { nodes } = buildSeriesData()
  const idx = nodes.findIndex(n => n.id === nodeId)
  if (idx >= 0) chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: idx })
}

function focusNode(nodeId: string) {
  if (!chart) return
  highlightNode(nodeId)
}

function applyZoom() {
  if (!chart) return
  chart.setOption({ series: [{ zoom: currentZoom }] }, { notMerge: false, lazyUpdate: true })
}

function zoomIn() {
  currentZoom = Math.min(2.5, Number((currentZoom + 0.16).toFixed(2)))
  applyZoom()
}

function zoomOut() {
  currentZoom = Math.max(0.3, Number((currentZoom - 0.16).toFixed(2)))
  applyZoom()
}

function resetView() {
  currentZoom = MODE_BASE_ZOOM[props.viewMode]
  if (!chart) return
  chart.setOption(buildOption(breathPhase), { notMerge: true, lazyUpdate: false })
}

function resize() {
  chart?.resize()
}

/* ===== Watch ===== */
watch(
  () => [props.nodes, props.edges, props.viewMode, props.filterCategories, props.filterRelationTypes, props.filterStatuses],
  (_value, oldValue) => {
    if (oldValue && props.viewMode !== oldValue[2]) currentZoom = MODE_BASE_ZOOM[props.viewMode]
    nextTick(updateChart)
  },
  { deep: true }
)
watch(() => props.selectedId, (id) => {
  if (id) highlightNode(id)
  else updateChart()
})

/* ===== Lifecycle ===== */
onMounted(() => {
  nextTick(initChart)
  const ro = new ResizeObserver(() => chart?.resize())
  if (chartRef.value) ro.observe(chartRef.value)
  ;(chartRef.value as any).__ro = ro
})

onUnmounted(() => {
  stopBreathing()
  const ro = (chartRef.value as any)?.__ro as ResizeObserver | undefined
  ro?.disconnect()
  chart?.dispose()
  chart = null
})

defineExpose({ focusNode, zoomIn, zoomOut, resetView, resize })

/* ===== Color helpers ===== */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function lighten(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex)
  const f = pct / 100
  return `rgb(${Math.min(255, r + (255 - r) * f)},${Math.min(255, g + (255 - g) * f)},${Math.min(255, b + (255 - b) * f)})`
}

function darken(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex)
  const f = 1 - pct / 100
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`
}
</script>

<style scoped>
.graph-canvas {
  position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1;
}
</style>
