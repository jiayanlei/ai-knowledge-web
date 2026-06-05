<template>
  <PageContainer>
    <div class="sp-page">
      <!-- ===== 搜索指挥台 ===== -->
      <header class="search-hero">
        <div class="sh-bg" />
        <div class="sh-content">
          <div class="sh-kicker"><span />INTELLIGENT SEARCH</div>
          <h1>企业智能检索引擎</h1>
          <p>语义理解 · 智能推荐 · 权威标识 · 知识聚合</p>
          <div class="sh-search-box">
            <div class="search-glow" />
            <div class="search-inner">
              <AppIcon name="Search" class="si-icon" />
              <input v-model="searchKeyword" class="si-input" placeholder="请输入你想了解的制度、流程、项目、福利、规范..." @keyup.enter="doSearch" @focus="searchFocused = true" @blur="searchFocused = false" />
              <el-button type="primary" size="large" round @click="doSearch" class="si-btn">智能搜索</el-button>
            </div>
          </div>
          <div class="sh-hot">
            <span class="hot-label">热门检索：</span>
            <el-button v-for="kw in hotKeywords" :key="kw" size="small" round text @click="quickSearch(kw)">{{ kw }}</el-button>
          </div>
          <!-- 搜索状态动画 -->
          <div v-if="searching" class="sh-status">
            <div class="ss-dots"><span /><span /><span /></div>
            <span class="ss-text">{{ searchStatusText }}</span>
          </div>
        </div>
      </header>

      <!-- ===== 搜索结果区域 ===== -->
      <div v-if="hasSearched && !searching" class="results-area">
        <!-- AI 最佳答案卡 -->
        <div v-if="aiAnswer" class="ai-answer app-card">
          <div class="aa-header">
            <div class="aa-badge"><AppIcon name="MagicStick" /><span>AI 最佳答案</span></div>
            <div class="aa-confidence">置信度 <strong>{{ aiAnswer.confidence }}%</strong></div>
          </div>
          <p class="aa-text">{{ aiAnswer.answer }}</p>
          <div class="aa-sources">
            <span class="aa-label">引用来源：</span>
            <el-button v-for="s in aiAnswer.sources" :key="s.title" size="small" text type="primary" @click="openDetail(s.id)">{{ s.title }}</el-button>
          </div>
          <div class="aa-disclaimer">AI 生成，仅供参考，请以原文为准</div>
        </div>

        <!-- 知识来源分布 -->
        <div class="source-map app-card">
          <h3 class="sm-title">知识来源分布</h3>
          <div class="sm-grid">
            <button v-for="src in sources" :key="src.id" class="sm-item" :class="{ 'is-active': activeSourceFilter === src.id }" @click="toggleSourceFilter(src.id)">
              <div class="smi-icon" :style="{ background: src.color + '18', color: src.color }"><AppIcon :name="src.icon" /></div>
              <div class="smi-info">
                <span class="smi-name">{{ src.name }}</span>
                <strong>{{ src.count }}</strong>
              </div>
              <div class="smi-bar"><div class="smi-fill" :style="{ width: (src.count / maxSourceCount * 100) + '%', background: src.color }" /></div>
            </button>
          </div>
        </div>

        <!-- 知识包聚合 -->
        <div v-if="matchedPackages.length" class="knowledge-packages">
          <h3 class="section-header"><AppIcon name="Box" /><span>知识包聚合</span></h3>
          <div class="kp-grid">
            <div v-for="pkg in matchedPackages" :key="pkg.id" class="kp-card app-card">
              <div class="kpc-top" :style="{ borderLeftColor: pkg.color }">
                <div class="kpc-icon" :style="{ background: pkg.color + '18', color: pkg.color }"><AppIcon :name="pkg.icon" /></div>
                <div class="kpc-info">
                  <h4>{{ pkg.title }}</h4>
                  <p>{{ pkg.description }}</p>
                </div>
                <div class="kpc-coverage">
                  <svg viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#e5eaf3" stroke-width="3" />
                    <circle cx="20" cy="20" r="16" fill="none" :stroke="pkg.color" stroke-width="3" stroke-linecap="round" :stroke-dasharray="100" :stroke-dashoffset="100 - pkg.coverage" transform="rotate(-90 20 20)" />
                    <text x="20" y="23" text-anchor="middle" font-size="8" font-weight="700" :fill="pkg.color">{{ pkg.coverage }}%</text>
                  </svg>
                </div>
              </div>
              <div class="kpc-docs">
                <div v-for="d in pkg.docs" :key="d.title" class="kpd-item">
                  <el-tag size="small" effect="plain" :type="d.type === '制度' ? '' : d.type === 'FAQ' ? 'warning' : 'info'">{{ d.type }}</el-tag>
                  <span>{{ d.title }}</span>
                </div>
              </div>
              <div class="kpc-footer">
                <span>{{ pkg.docCount }} 篇文档 · 完整度 {{ pkg.coverage }}%</span>
                <el-button size="small" type="primary" plain>查看知识链</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 主体：筛选 + 结果 -->
        <div class="search-body">
          <!-- 左侧筛选雷达 -->
          <aside class="filter-radar app-card">
            <div class="fr-header">
              <h3>智能筛选</h3>
              <el-button text size="small" type="primary" @click="clearFilters">重置</el-button>
            </div>

            <!-- 知识分类 -->
            <div class="fr-section">
              <h4>知识分类</h4>
              <div class="fr-chips">
                <button v-for="c in categoryOptions" :key="c.value" class="fr-chip" :class="{ 'is-active': filterCategory.includes(c.value) }" @click="toggleFilter('category', c.value)">
                  {{ c.label }}
                </button>
              </div>
            </div>

            <!-- 文档来源 -->
            <div class="fr-section">
              <h4>文档来源</h4>
              <div class="fr-chips">
                <button v-for="s in sourceOptions" :key="s.value" class="fr-chip" :class="{ 'is-active': filterSource.includes(s.value) }" @click="toggleFilter('source', s.value)">
                  {{ s.label }}
                </button>
              </div>
            </div>

            <!-- 知识状态 -->
            <div class="fr-section">
              <h4>知识状态</h4>
              <div class="fr-chips">
                <button v-for="st in stateOptions" :key="st.value" class="fr-chip" :class="{ 'is-active': filterState.includes(st.value) }" @click="toggleFilter('state', st.value)">
                  {{ st.label }}
                </button>
              </div>
            </div>

            <!-- 智能标签 -->
            <div class="fr-section">
              <h4>智能标签</h4>
              <div class="fr-chips">
                <button v-for="t in smartTagOptions" :key="t.value" class="fr-chip fr-chip--tag" :class="{ 'is-active': filterSmartTag.includes(t.value) }" @click="toggleFilter('smartTag', t.value)">
                  {{ t.label }}
                </button>
              </div>
            </div>

            <!-- 筛选统计 -->
            <div class="fr-stats">
              <div class="frs-item"><span>匹配结果</span><strong>{{ filteredResults.length }}</strong></div>
              <div class="frs-item"><span>知识来源</span><strong>{{ sources.length }}</strong></div>
            </div>
          </aside>

          <!-- 右侧结果列表 -->
          <div class="result-list">
            <div v-for="r in filteredResults" :key="r.id" class="result-card app-card" @click="openDetail(r.id)">
              <div class="rc-top">
                <h4 class="rc-title">{{ r.title }}</h4>
                <div class="rc-badges">
                  <el-tag v-for="b in r.badges" :key="b" size="small" :type="badgeType(b)" effect="plain">{{ b }}</el-tag>
                </div>
              </div>
              <p class="rc-summary">{{ r.summary }}</p>
              <div class="rc-tags">
                <el-tag v-for="t in r.tags.slice(0, 5)" :key="t" size="small" type="info" effect="plain" round>{{ t }}</el-tag>
              </div>
              <div class="rc-meta">
                <div class="rcm-left">
                  <span class="rc-match"><strong :style="{ color: matchColor(r.matchScore) }">{{ r.matchScore }}%</strong> 匹配</span>
                  <span class="rc-authority" :class="'auth-' + r.authority">
                    <AppIcon :name="r.authority === 'official' ? 'Stamp' : r.authority === 'verified' ? 'Badge' : 'User'" />
                    {{ authorityLabel(r.authority) }}
                  </span>
                  <el-tag size="small" effect="plain">{{ r.categoryLabel }}</el-tag>
                  <span class="rc-state" :class="'st-' + r.state">{{ r.stateLabel }}</span>
                </div>
              </div>
              <div class="rc-footer">
                <div class="rcf-info">
                  <span>{{ r.sourceLabel }} · {{ r.dept }}</span>
                  <span>{{ r.version }} · {{ r.updateTime }}</span>
                  <span>阅读 {{ r.views }} · 引用 {{ r.citations }}</span>
                </div>
                <div class="rcf-actions">
                  <el-button text size="small" type="primary" @click.stop="openDetail(r.id)">查看详情</el-button>
                  <el-button text size="small" type="primary" @click.stop="openAiInterpret(r)">AI 解读</el-button>
                  <el-button text size="small" @click.stop="handleFavorite(r)">收藏</el-button>
                  <el-button text size="small" @click.stop="handleCopyCite(r)">引用</el-button>
                  <el-button text size="small" @click.stop="openVersionTimeline(r)">版本</el-button>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="filteredResults.length === 0" class="empty-state app-card">
              <AppIcon name="Search" class="es-icon" />
              <h3>未找到匹配的知识</h3>
              <p>换个关键词试试，或者浏览以下推荐</p>
              <div class="es-suggest">
                <el-button v-for="s in emptySuggestions" :key="s" size="small" round @click="quickSearch(s.replace(/[「」]/g, '').split('、')[0] || '')">{{ s }}</el-button>
              </div>
            </div>

            <!-- 你可能想问 -->
            <div v-if="filteredResults.length > 0" class="related-questions app-card">
              <h3><AppIcon name="ChatDotRound" /><span>你可能想问</span></h3>
              <div class="rq-grid">
                <button v-for="q in relatedQuestions" :key="q.id" class="rq-item" @click="quickSearch(q.question)">
                  <AppIcon name="QuestionFilled" class="rqi-icon" />
                  <span>{{ q.question }}</span>
                  <AppIcon name="Right" class="rqi-arrow" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 初始状态（未搜索时） ===== -->
      <div v-if="!hasSearched" class="initial-state">
        <div class="is-features">
          <div class="isf-item app-card">
            <div class="isf-icon" style="background:#eef2ff;color:#6366f1"><AppIcon name="MagicStick" /></div>
            <h4>语义理解</h4>
            <p>自然语言搜索，精准匹配企业知识</p>
          </div>
          <div class="isf-item app-card">
            <div class="isf-icon" style="background:#f0fdf4;color:#22c55e"><AppIcon name="TrendCharts" /></div>
            <h4>智能推荐</h4>
            <p>基于上下文推荐相关知识和问题</p>
          </div>
          <div class="isf-item app-card">
            <div class="isf-icon" style="background:#fef2f2;color:#ef4444"><AppIcon name="Stamp" /></div>
            <h4>权威标识</h4>
            <p>官方制度、验证文档、社区贡献一目了然</p>
          </div>
          <div class="isf-item app-card">
            <div class="isf-icon" style="background:#fffbeb;color:#f59e0b"><AppIcon name="Box" /></div>
            <h4>知识聚合</h4>
            <p>同主题文档打包，构建完整知识链</p>
          </div>
        </div>
      </div>

      <!-- ===== 详情抽屉 ===== -->
      <el-drawer v-model="detailVisible" :title="detailDoc?.title || ''" size="560px" destroy-on-close>
        <div v-if="detailDoc" class="detail-content">
          <div class="dc-badges"><el-tag v-for="b in detailDoc.badges" :key="b" :type="badgeType(b)" effect="plain">{{ b }}</el-tag></div>
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item label="分类">{{ detailDoc.categoryLabel }}</el-descriptions-item>
            <el-descriptions-item label="来源">{{ detailDoc.sourceLabel }}</el-descriptions-item>
            <el-descriptions-item label="部门">{{ detailDoc.dept }}</el-descriptions-item>
            <el-descriptions-item label="版本">{{ detailDoc.version }}</el-descriptions-item>
            <el-descriptions-item label="状态"><el-tag size="small" :type="detailDoc.state === 'latest' ? 'success' : detailDoc.state === 'expiring' ? 'warning' : 'info'" effect="plain">{{ detailDoc.stateLabel }}</el-tag></el-descriptions-item>
            <el-descriptions-item label="权威等级"><span class="auth-label" :class="'auth-' + detailDoc.authority">{{ authorityLabel(detailDoc.authority) }}</span></el-descriptions-item>
            <el-descriptions-item label="阅读">{{ detailDoc.views }}</el-descriptions-item>
            <el-descriptions-item label="引用">{{ detailDoc.citations }}</el-descriptions-item>
            <el-descriptions-item label="更新时间" :span="2">{{ detailDoc.updateTime }}</el-descriptions-item>
          </el-descriptions>
          <div class="dc-section">
            <h4>摘要</h4>
            <p>{{ detailDoc.summary }}</p>
          </div>
          <div class="dc-section">
            <h4>标签</h4>
            <div class="dc-tags"><el-tag v-for="t in detailDoc.tags" :key="t" effect="plain" round>{{ t }}</el-tag></div>
          </div>
          <div class="dc-section" v-if="detailVersions.length">
            <h4>版本时间线</h4>
            <el-timeline>
              <el-timeline-item v-for="v in detailVersions" :key="v.version" :timestamp="v.time" :type="v.isLatest ? 'primary' : 'info'" placement="top">
                <div class="dvl-item">
                  <el-tag :type="v.isLatest ? 'success' : 'info'" size="small">{{ v.version }}</el-tag>
                  <span>{{ v.note }}</span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div class="dc-actions">
            <el-button type="primary" @click="openAiInterpret(detailDoc)">AI 解读</el-button>
            <el-button @click="handleFavorite(detailDoc)">加入收藏</el-button>
            <el-button @click="handleCopyCite(detailDoc)">复制引用</el-button>
          </div>
        </div>
      </el-drawer>

      <!-- ===== AI 解读抽屉 ===== -->
      <el-drawer v-model="aiInterpretVisible" :title="'AI 解读 - ' + (interpretDoc?.title || '')" size="520px" destroy-on-close>
        <div v-if="interpretDoc" class="ai-interpret">
          <div class="ai-section">
            <h4>内容概述</h4>
            <p>{{ interpretDoc.summary }}</p>
          </div>
          <div class="ai-section">
            <h4>核心要点</h4>
            <ul>
              <li>该文档涵盖{{ interpretDoc.categoryLabel }}领域的关键内容</li>
              <li>当前版本 {{ interpretDoc.version }} 为{{ interpretDoc.stateLabel }}版本</li>
              <li>权威等级：{{ authorityLabel(interpretDoc.authority) }}，{{ interpretDoc.authority === 'official' ? '可作为正式参考依据' : '建议交叉验证' }}</li>
              <li>已被引用 {{ interpretDoc.citations }} 次，访问 {{ interpretDoc.views }} 次</li>
              <li v-if="interpretDoc.state === 'expiring'">注意：该文档即将过期，建议关注更新</li>
            </ul>
          </div>
          <div class="ai-section">
            <h4>关联知识</h4>
            <div class="ai-related">
              <el-button v-for="r in relatedDocs" :key="r.id" size="small" text type="primary" @click="openDetail(r.id)">{{ r.title }}</el-button>
            </div>
          </div>
          <div class="ai-section">
            <h4>建议操作</h4>
            <div class="ai-suggest-actions">
              <el-button size="small" type="primary" plain @click="handleFavorite(interpretDoc)">加入收藏</el-button>
              <el-button size="small" plain @click="handleCopyCite(interpretDoc)">复制引用</el-button>
              <el-button size="small" plain @click="openVersionTimeline(interpretDoc)">查看版本历史</el-button>
            </div>
          </div>
        </div>
      </el-drawer>

      <!-- ===== 版本时间线弹窗 ===== -->
      <el-dialog v-model="versionDialogVisible" :title="'版本历史 - ' + (versionDoc?.title || '')" width="540px" destroy-on-close>
        <div v-if="versionDoc" class="vd-timeline">
          <el-timeline>
            <el-timeline-item v-for="v in (versionTimelines[versionDoc.id] || [])" :key="v.version" :timestamp="v.time" :type="v.isLatest ? 'primary' : 'info'" placement="top">
              <div class="vdt-item">
                <el-tag :type="v.isLatest ? 'success' : 'info'" size="small">{{ v.version }}</el-tag>
                <span>{{ v.note }}</span>
                <el-tag v-if="v.isLatest" type="warning" size="small" effect="plain">最新版</el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
          <div v-if="!versionTimelines[versionDoc.id]" class="vd-empty">暂无版本记录</div>
        </div>
      </el-dialog>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  getSourcesMock, getSearchResultsMock, getKnowledgePackagesMock, getRelatedQuestionsMock,
  getAiAnswerMock, versionTimelines, hotKeywords, emptySuggestions,
  categoryOptions, sourceOptions, stateOptions, smartTagOptions,
  type SearchResult, type AiAnswer
} from './mock'

// ===== 数据 =====
const sources = ref(getSourcesMock())
const allResults = ref(getSearchResultsMock())
const packages = ref(getKnowledgePackagesMock())
const relatedQuestions = ref(getRelatedQuestionsMock())

// ===== 搜索状态 =====
const searchKeyword = ref('')
const searchFocused = ref(false)
const searching = ref(false)
const hasSearched = ref(false)
const searchStatusText = ref('')

// ===== 筛选 =====
const filterCategory = ref<string[]>([])
const filterSource = ref<string[]>([])
const filterState = ref<string[]>([])
const filterSmartTag = ref<string[]>([])
const activeSourceFilter = ref('')

// ===== 弹窗/抽屉 =====
const detailVisible = ref(false)
const detailDoc = ref<SearchResult | null>(null)
const aiInterpretVisible = ref(false)
const interpretDoc = ref<SearchResult | null>(null)
const versionDialogVisible = ref(false)
const versionDoc = ref<SearchResult | null>(null)

// ===== AI 答案 =====
const aiAnswer = ref<AiAnswer | null>(null)

// ===== 计算 =====
const maxSourceCount = computed(() => Math.max(...sources.value.map(s => s.count)))

const filteredResults = computed(() => {
  return allResults.value.filter(r => {
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      const match = r.title.toLowerCase().includes(kw) || r.summary.toLowerCase().includes(kw) || r.tags.some(t => t.toLowerCase().includes(kw)) || r.categoryLabel.includes(kw) || r.dept.toLowerCase().includes(kw)
      if (!match) return false
    }
    if (activeSourceFilter.value) {
      const srcMap: Record<string, string> = { src1: 'finance_center', src2: 'hr_center', src3: 'tech_center', src4: 'hr_center', src5: 'hr_center', src6: 'finance_center' }
      // Simplified: match by category name
    }
    if (filterCategory.value.length && !filterCategory.value.includes(r.category)) return false
    if (filterSource.value.length && !filterSource.value.includes(r.source)) return false
    if (filterState.value.length && !filterState.value.includes(r.state)) return false
    if (filterSmartTag.value.length && !filterSmartTag.value.some(t => r.smartTags.includes(t as any))) return false
    return true
  }).sort((a, b) => b.matchScore - a.matchScore)
})

const matchedPackages = computed(() => {
  if (!searchKeyword.value) return packages.value
  const kw = searchKeyword.value.toLowerCase()
  return packages.value.filter(p => p.title.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw) || p.docs.some(d => d.title.toLowerCase().includes(kw)))
})

const detailVersions = computed(() => detailDoc.value ? (versionTimelines[detailDoc.value.id] || []) : [])

const relatedDocs = computed(() => {
  if (!interpretDoc.value) return []
  return allResults.value.filter(r => r.id !== interpretDoc.value!.id && r.tags.some(t => interpretDoc.value!.tags.includes(t))).slice(0, 5)
})

// ===== 工具函数 =====
function badgeType(b: string) {
  if (b.includes('官方')) return 'danger' as any
  if (b.includes('最新') || b.includes('高频')) return 'success' as any
  if (b.includes('AI')) return 'warning' as any
  if (b.includes('过期') || b.includes('历史')) return 'info' as any
  if (b.includes('草稿')) return 'warning' as any
  return 'info' as any
}
function matchColor(score: number) { return score >= 90 ? '#22c55e' : score >= 70 ? '#3b82f6' : '#f59e0b' }
function authorityLabel(a: string) { return a === 'official' ? '官方权威' : a === 'verified' ? '已验证' : '社区贡献' }
function toggleFilter(type: string, value: string) {
  const arr = type === 'category' ? filterCategory : type === 'source' ? filterSource : type === 'state' ? filterState : filterSmartTag
  const idx = arr.value.indexOf(value)
  if (idx >= 0) arr.value.splice(idx, 1); else arr.value.push(value)
}
function toggleSourceFilter(id: string) { activeSourceFilter.value = activeSourceFilter.value === id ? '' : id }
function clearFilters() { filterCategory.value = []; filterSource.value = []; filterState.value = []; filterSmartTag.value = []; activeSourceFilter.value = '' }

// ===== 搜索 =====
const statusTexts = ['正在扫描企业知识库...', '正在匹配制度文档...', '正在分析语义关联...', '正在生成最佳答案...']
function doSearch() {
  if (!searchKeyword.value.trim()) { hasSearched.value = true; aiAnswer.value = null; return }
  searching.value = true; hasSearched.value = false
  let i = 0
  const iv = setInterval(() => {
    searchStatusText.value = statusTexts[i] || ''
    i++
    if (i >= statusTexts.length) {
      clearInterval(iv); searching.value = false; hasSearched.value = true
      aiAnswer.value = getAiAnswerMock(searchKeyword.value)
    }
  }, 600)
}
function quickSearch(kw: string) { searchKeyword.value = kw; doSearch() }

// ===== 操作 =====
function openDetail(id: string) {
  if (!id) return
  detailDoc.value = allResults.value.find(r => r.id === id) || null
  detailVisible.value = true
}
function openAiInterpret(r: SearchResult) { interpretDoc.value = r; aiInterpretVisible.value = true }
function openVersionTimeline(r: SearchResult) { versionDoc.value = r; versionDialogVisible.value = true }
function handleFavorite(r: SearchResult) { ElMessage.success(`已收藏「${r.title}」`) }
function handleCopyCite(r: SearchResult) { ElMessage.success('引用信息已复制到剪贴板') }
</script>

<style scoped lang="scss">
.sp-page { display: flex; flex-direction: column; gap: var(--app-section-gap); height: 100%; overflow-y: auto; }

/* ===== 搜索指挥台 ===== */
.search-hero {
  position: relative; border-radius: var(--app-card-radius); overflow: hidden;
  .sh-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0e7490 80%, #06b6d4 100%); }
  .sh-bg::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.15) 0%, transparent 70%); }
  .sh-bg::after { content: ''; position: absolute; top: 50%; left: 50%; width: 300px; height: 300px; border: 1px solid rgba(6,182,212,0.08); border-radius: 50%; transform: translate(-50%, -50%); animation: radar-pulse 4s ease-out infinite; }
  @keyframes radar-pulse { 0% { width: 100px; height: 100px; opacity: 1; } 100% { width: 500px; height: 500px; opacity: 0; } }
  .sh-content { position: relative; padding: 24px 28px; color: #fff; }
  .sh-kicker { display: flex; align-items: center; gap: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.5; margin-bottom: 4px; span { width: 18px; height: 2px; background: #06b6d4; border-radius: 1px; } }
  h1 { font-size: 22px; font-weight: 700; margin: 0 0 2px; }
  & > .sh-content > p { font-size: 13px; opacity: 0.6; margin: 0 0 16px; letter-spacing: 2px; }
  .sh-search-box { position: relative; margin-bottom: 12px;
    .search-glow { position: absolute; inset: -2px; border-radius: 16px; background: linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4); background-size: 200% 100%; animation: glow-move 3s ease infinite; opacity: 0.6; }
    @keyframes glow-move { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    .search-inner { position: relative; display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.12); backdrop-filter: blur(12px); border-radius: 14px; padding: 6px 8px 6px 16px; border: 1px solid rgba(255,255,255,0.15); }
    .si-icon { font-size: 20px; color: rgba(255,255,255,0.6); flex-shrink: 0; }
    .si-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 15px; &::placeholder { color: rgba(255,255,255,0.4); } }
    .si-btn { flex-shrink: 0; }
  }
  .sh-hot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    .hot-label { font-size: 12px; opacity: 0.5; }
    :deep(.el-button) { color: rgba(255,255,255,0.7); &:hover { color: #fff; } }
  }
  .sh-status { display: flex; align-items: center; gap: 10px; margin-top: 12px;
    .ss-dots { display: flex; gap: 4px; span { width: 6px; height: 6px; border-radius: 50%; background: #06b6d4; animation: dot-bounce 1.4s ease infinite; &:nth-child(2) { animation-delay: 0.2s; } &:nth-child(3) { animation-delay: 0.4s; } } }
    @keyframes dot-bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
    .ss-text { font-size: 13px; color: #06b6d4; animation: fade-text 2s ease infinite; }
    @keyframes fade-text { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
  }
}

/* ===== 初始状态 ===== */
.initial-state { padding: 12px 0; }
.is-features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  .isf-item { padding: 24px 16px; text-align: center; transition: transform 0.2s;
    &:hover { transform: translateY(-3px); }
    .isf-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 12px; }
    h4 { font-size: 14px; font-weight: 600; margin: 0 0 6px; color: var(--text-color); }
    p { font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.5; }
  }
}

/* ===== AI 最佳答案 ===== */
.ai-answer { padding: 18px; border-left: 4px solid #8b5cf6; background: linear-gradient(135deg, #faf5ff 0%, #fff 100%);
  .aa-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
    .aa-badge { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #7c3aed; }
    .aa-confidence { font-size: 12px; color: var(--text-secondary); strong { color: #22c55e; font-size: 14px; } }
  }
  .aa-text { font-size: 14px; color: var(--text-color); line-height: 1.8; margin: 0 0 10px; }
  .aa-sources { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;
    .aa-label { font-size: 12px; color: var(--text-secondary); }
  }
  .aa-disclaimer { font-size: 11px; color: #9ca3af; font-style: italic; }
}

/* ===== 知识来源分布 ===== */
.source-map { padding: 16px;
  .sm-title { font-size: 14px; font-weight: 600; margin: 0 0 12px; color: var(--text-color); }
  .sm-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
  .sm-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 8px; border: 1px solid transparent; border-radius: 10px; background: transparent; cursor: pointer; transition: all 0.2s; text-align: center; width: 100%;
    &:hover { background: #f8fafc; }
    &.is-active { border-color: var(--primary-color); background: var(--primary-light); }
    .smi-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
    .smi-info { display: flex; flex-direction: column; .smi-name { font-size: 12px; color: var(--text-secondary); } strong { font-size: 18px; font-weight: 700; color: var(--text-color); } }
    .smi-bar { width: 100%; height: 3px; background: #f0f0f0; border-radius: 2px; overflow: hidden; .smi-fill { height: 100%; border-radius: 2px; } }
  }
}

/* ===== 知识包 ===== */
.knowledge-packages { padding: 0; }
.section-header { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; margin-bottom: 10px; color: var(--text-color); }
.kp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px;
  .kp-card { overflow: hidden;
    .kpc-top { display: flex; align-items: flex-start; gap: 12px; padding: 16px; border-left: 4px solid;
      .kpc-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
      .kpc-info { flex: 1; h4 { font-size: 14px; font-weight: 600; margin: 0 0 4px; } p { font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.5; } }
      .kpc-coverage { flex-shrink: 0; svg { width: 40px; height: 40px; } }
    }
    .kpc-docs { padding: 0 16px 12px;
      .kpd-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 12px; color: var(--text-color); }
    }
    .kpc-footer { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-top: 1px solid var(--border-color); font-size: 12px; color: var(--text-secondary); }
  }
}

/* ===== 主体 ===== */
.search-body { display: grid; grid-template-columns: 220px 1fr; gap: var(--app-section-gap); }

/* ===== 筛选雷达 ===== */
.filter-radar { padding: 0; overflow: hidden;
  .fr-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 14px 8px; h3 { font-size: 14px; font-weight: 600; margin: 0; } }
  .fr-section { padding: 8px 14px; border-top: 1px solid var(--border-color);
    h4 { font-size: 12px; font-weight: 600; color: var(--text-secondary); margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px; }
  }
  .fr-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .fr-chip { padding: 4px 10px; border: 1px solid var(--border-color); border-radius: 6px; background: transparent; font-size: 12px; color: var(--text-color); cursor: pointer; transition: all 0.15s;
    &:hover { border-color: var(--primary-color); color: var(--primary-color); }
    &.is-active { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
    &.fr-chip--tag.is-active { background: #f59e0b; border-color: #f59e0b; }
  }
  .fr-stats { padding: 12px 14px; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 6px;
    .frs-item { display: flex; justify-content: space-between; font-size: 12px; span { color: var(--text-secondary); } strong { color: var(--text-color); } }
  }
}

/* ===== 结果卡片 ===== */
.result-list { display: flex; flex-direction: column; gap: 10px; }
.result-card { padding: 16px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(29,78,216,0.1); }
  .rc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 8px;
    .rc-title { font-size: 15px; font-weight: 600; color: var(--text-color); margin: 0; flex: 1; }
    .rc-badges { display: flex; gap: 4px; flex-wrap: wrap; flex-shrink: 0; }
  }
  .rc-summary { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .rc-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
  .rc-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;
    .rcm-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .rc-match { font-size: 12px; color: var(--text-secondary); strong { font-size: 16px; font-weight: 700; } }
    .rc-authority { font-size: 12px; display: flex; align-items: center; gap: 3px;
      &.auth-official { color: #dc2626; } &.auth-verified { color: #2563eb; } &.auth-community { color: #6b7280; }
    }
    .rc-state { font-size: 11px; padding: 1px 6px; border-radius: 4px;
      &.st-latest { background: #f0fdf4; color: #16a34a; } &.st-expiring { background: #fffbeb; color: #d97706; } &.st-historical { background: #f8fafc; color: #94a3b8; } &.st-draft { background: #fef3c7; color: #b45309; }
    }
  }
  .rc-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #f0f0f0; flex-wrap: wrap; gap: 8px;
    .rcf-info { display: flex; gap: 12px; font-size: 11px; color: var(--text-secondary); flex-wrap: wrap; }
    .rcf-actions { display: flex; gap: 2px; flex-shrink: 0; }
  }
}

/* ===== 空状态 ===== */
.empty-state { padding: 40px; text-align: center;
  .es-icon { font-size: 48px; color: #d1d5db; margin-bottom: 12px; }
  h3 { font-size: 16px; font-weight: 600; margin: 0 0 6px; color: var(--text-color); }
  p { font-size: 13px; color: var(--text-secondary); margin: 0 0 16px; }
  .es-suggest { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
}

/* ===== 相关问题 ===== */
.related-questions { padding: 16px;
  h3 { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; margin: 0 0 12px; }
  .rq-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .rq-item { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; cursor: pointer; text-align: left; font-size: 13px; color: var(--text-color); transition: all 0.15s; width: 100%;
    &:hover { border-color: var(--primary-color); background: var(--primary-light); }
    .rqi-icon { font-size: 14px; color: #f59e0b; flex-shrink: 0; }
    span { flex: 1; }
    .rqi-arrow { font-size: 12px; color: #d1d5db; flex-shrink: 0; }
  }
}

/* ===== 详情抽屉 ===== */
.detail-content { padding: 0 4px;
  .dc-badges { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
  .dc-section { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border-color);
    h4 { font-size: 14px; font-weight: 600; margin: 0 0 8px; color: var(--text-color); }
    p { font-size: 13px; color: var(--text-color); line-height: 1.7; margin: 0; }
  }
  .dc-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .dc-actions { display: flex; gap: 8px; margin-top: 20px; padding-top: 12px; border-top: 1px solid var(--border-color); }
}
.dvl-item { display: flex; align-items: center; gap: 8px; span { font-size: 13px; } }
.auth-label { font-weight: 600;
  &.auth-official { color: #dc2626; } &.auth-verified { color: #2563eb; } &.auth-community { color: #6b7280; }
}

/* ===== AI 解读 ===== */
.ai-interpret { padding: 0 4px;
  .ai-section { margin-bottom: 16px;
    h4 { font-size: 14px; font-weight: 600; margin: 0 0 8px; color: var(--text-color); }
    p { font-size: 13px; color: var(--text-color); line-height: 1.7; margin: 0; }
    ul { padding-left: 18px; margin: 0; li { font-size: 13px; color: var(--text-color); line-height: 1.8; } }
  }
  .ai-related { display: flex; flex-direction: column; gap: 4px; }
  .ai-suggest-actions { display: flex; gap: 8px; flex-wrap: wrap; }
}

/* ===== 版本弹窗 ===== */
.vd-timeline { padding: 4px;
  .vdt-item { display: flex; align-items: center; gap: 8px; span { font-size: 13px; } }
  .vd-empty { text-align: center; padding: 20px; font-size: 13px; color: var(--text-secondary); }
}

/* ===== 响应式 ===== */
@media (max-width: 1200px) { .search-body { grid-template-columns: 200px 1fr; } .source-map .sm-grid { grid-template-columns: repeat(3, 1fr); } .is-features { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 900px) { .search-body { grid-template-columns: 1fr; } .filter-radar { display: none; } .source-map .sm-grid { grid-template-columns: repeat(3, 1fr); } .rq-grid { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .source-map .sm-grid { grid-template-columns: repeat(2, 1fr); } .is-features { grid-template-columns: 1fr; } .kp-grid { grid-template-columns: 1fr; } }
</style>
