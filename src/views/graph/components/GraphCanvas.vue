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

const CATEGORY_KEYS: NodeCategory[] = ['institution', 'process', 'project', 'role', 'risk', 'ai_rec']

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

/* ===== Build series data ===== */
function buildSeriesData(phase: number = 0) {
  const visNodes = getVisibleNodes()
  const visIds = new Set(visNodes.map(n => n.id))
  const visEdges = getVisibleEdges(visIds)

  const ecNodes = visNodes.map(n => ({
    id: n.id, name: n.name, value: n.id,
    symbolSize: n.symbolSize,
    category: CATEGORY_KEYS.indexOf(n.category),
    itemStyle: buildNodeStyle(n, phase),
    label: buildLabel(n),
    _raw: n
  }))

  const ecEdges = visEdges.map(e => {
    const rel = RELATION_CONFIG[e.relationType]
    const isConflict = e.relationType === 'conflict'
    const isRecommend = e.relationType === 'recommend'
    const isStrong = e.strength === 'strong'
    const isInfluence = e.relationType === 'influence'

    return {
      source: e.source, target: e.target,
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
      _raw: e
    }
  })

  return { nodes: ecNodes, edges: ecEdges }
}

/* ===== Layout ===== */
function getLayoutConfig(mode: ViewMode) {
  switch (mode) {
    case 'star':
      return { type: 'force' as const, force: { repulsion: 450, gravity: 0.08, edgeLength: [90, 200], friction: 0.65, layoutAnimation: true } }
    case 'brain':
      return { type: 'force' as const, force: { repulsion: 580, gravity: 0.12, edgeLength: [100, 160], friction: 0.6, layoutAnimation: true } }
    case 'chain':
      return { type: 'force' as const, force: { repulsion: 350, gravity: 0.04, edgeLength: [120, 220], friction: 0.7, layoutAnimation: true } }
    case 'impact':
      return { type: 'force' as const, force: { repulsion: 620, gravity: 0.06, edgeLength: [80, 180], friction: 0.55, layoutAnimation: true } }
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
      draggable: true,
      zoom: 0.9,
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

    const visNodes = getVisibleNodes()
    const visIds = new Set(visNodes.map(n => n.id))
    const visEdges = getVisibleEdges(visIds)

    // Only update itemStyle for breathing, not full option rebuild
    const updatedNodes = visNodes.map(n => ({
      id: n.id, name: n.name, value: n.id,
      symbolSize: n.symbolSize,
      category: CATEGORY_KEYS.indexOf(n.category),
      itemStyle: buildNodeStyle(n, breathPhase),
      label: buildLabel(n),
      _raw: n
    }))

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

/* ===== Watch ===== */
watch(
  () => [props.nodes, props.edges, props.viewMode, props.filterCategories, props.filterRelationTypes, props.filterStatuses],
  () => nextTick(updateChart),
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

defineExpose({ focusNode })

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
