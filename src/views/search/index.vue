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
              <input v-model="searchKeyword" class="si-input" placeholder="请输入制度、流程、项目文档、员工手册等关键词..." @keyup.enter="doSearch" @focus="searchFocused = true" @blur="searchFocused = false" />
              <button type="button" class="si-btn" @click="doSearch">智能搜索</button>
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

      <!-- ===== 语义理解与质量指标 ===== -->
      <section class="search-overview">
        <div class="semantic-panel app-card">
          <div class="module-head">
            <div>
              <h3><AppIcon name="MagicStick" /> 语义理解</h3>
              <p>根据输入自动识别查询意图、命中范围和核心关键词。</p>
            </div>
            <span class="semantic-badge">实时解析</span>
          </div>
          <div class="semantic-content">
            <div class="semantic-row">
              <span>识别意图</span>
              <strong>{{ semanticUnderstanding.intent }}</strong>
            </div>
            <div class="semantic-row">
              <span>命中范围</span>
              <div class="semantic-tags">
                <el-tag v-for="scope in semanticUnderstanding.scopes" :key="scope" size="small" effect="plain">{{ scope }}</el-tag>
              </div>
            </div>
            <div class="semantic-row">
              <span>关键词提取</span>
              <div class="keyword-pills">
                <button v-for="kw in semanticUnderstanding.keywords" :key="kw" type="button" @click="quickSearch(kw)">{{ kw }}</button>
              </div>
            </div>
            <div class="confidence-line">
              <span>理解置信度</span>
              <el-progress :percentage="semanticUnderstanding.confidence" :stroke-width="8" :show-text="false" />
              <strong>{{ semanticUnderstanding.confidence }}%</strong>
            </div>
          </div>
        </div>

        <div class="quality-panel app-card">
          <div class="module-head">
            <div>
              <h3><AppIcon name="TrendCharts" /> 检索质量指标</h3>
              <p>跟踪搜索效果、无结果问题和员工反馈满意度。</p>
            </div>
          </div>
          <div class="quality-grid">
            <div v-for="m in qualityMetrics" :key="m.label" class="quality-card" :class="'tone-' + m.tone">
              <AppIcon :name="m.icon" />
              <span>{{ m.label }}</span>
              <strong>{{ m.value }}</strong>
              <small>{{ m.desc }}</small>
            </div>
          </div>
        </div>
      </section>

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
              <div class="rc-logic">
                <div>
                  <span>所属模块</span>
                  <strong>{{ r.sourceLabel }} · {{ r.categoryLabel }}</strong>
                </div>
                <div>
                  <span>匹配原因</span>
                  <strong>{{ resultReason(r) }}</strong>
                </div>
              </div>
              <p class="rc-summary">{{ r.summary }}</p>
              <p class="rc-snippet"><span>相关片段</span>{{ resultSnippet(r) }}</p>
              <div class="rc-tags">
                <el-tag v-for="t in r.tags.slice(0, 5)" :key="t" size="small" type="info" effect="plain" round>{{ t }}</el-tag>
              </div>
              <div class="rc-meta">
                <div class="rcm-left">
                  <span class="rc-match">相似度 <strong :style="{ color: matchColor(r.matchScore) }">{{ r.matchScore }}%</strong></span>
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
                  <span>{{ r.dept }} · {{ r.version }}</span>
                  <span>{{ r.updateTime }} 更新</span>
                  <span>阅读 {{ r.views }} · 引用 {{ r.citations }}</span>
                </div>
                <div class="rcf-actions">
                  <el-button text size="small" type="primary" @click.stop="openDetail(r.id)">查看详情</el-button>
                  <el-button text size="small" type="primary" @click.stop="handleLocateSource(r)">定位来源</el-button>
                  <el-button text size="small" @click.stop="handleSubscribe(r)">加入订阅</el-button>
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

        <div class="insight-grid">
          <section class="hot-knowledge app-card">
            <div class="module-head">
              <div>
                <h3><AppIcon name="QuestionFilled" /> 热门问题</h3>
                <p>员工近期高频检索的问题，可直接点击再次检索。</p>
              </div>
            </div>
            <div class="hot-question-list">
              <button v-for="q in hotQuestionList" :key="q" type="button" @click="quickSearch(q)">
                <span>{{ q }}</span>
                <AppIcon name="Right" />
              </button>
            </div>
          </section>

          <section class="retrieval-insight app-card">
            <div class="module-head">
              <div>
                <h3><AppIcon name="DataAnalysis" /> 检索洞察</h3>
                <p>从搜索日志中发现知识缺口、低命中主题和更新重点。</p>
              </div>
            </div>
            <div class="insight-list">
              <div v-for="item in retrievalInsights" :key="item.title" class="insight-item">
                <span class="insight-dot" :class="'dot-' + item.tone" />
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </section>
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

        <div class="insight-grid">
          <section class="hot-knowledge app-card">
            <div class="module-head">
              <div>
                <h3><AppIcon name="QuestionFilled" /> 热门问题 / 高频知识</h3>
                <p>覆盖报销、入职、权限、项目交接等常见企业知识场景。</p>
              </div>
            </div>
            <div class="hot-question-list">
              <button v-for="q in hotQuestionList" :key="q" type="button" @click="quickSearch(q)">
                <span>{{ q }}</span>
                <AppIcon name="Right" />
              </button>
            </div>
          </section>

          <section class="retrieval-insight app-card">
            <div class="module-head">
              <div>
                <h3><AppIcon name="DataAnalysis" /> 检索洞察</h3>
                <p>辅助管理员判断哪些知识需要补充、更新或调整排序。</p>
              </div>
            </div>
            <div class="insight-list">
              <div v-for="item in retrievalInsights" :key="item.title" class="insight-item">
                <span class="insight-dot" :class="'dot-' + item.tone" />
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </section>
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

// ===== 页面补充数据 =====
const qualityMetrics = [
  { label: '今日检索次数', value: '1,286', desc: '较昨日 +12%', icon: 'Search', tone: 'blue' },
  { label: '平均命中率', value: '93.8%', desc: '核心制度命中稳定', icon: 'Aim', tone: 'green' },
  { label: '无结果问题数', value: '18', desc: '需补充知识 6 条', icon: 'WarningFilled', tone: 'amber' },
  { label: '热门搜索词', value: '报销制度', desc: '出现 146 次', icon: 'TrendCharts', tone: 'purple' },
  { label: '反馈满意度', value: '96%', desc: '近 7 日员工评价', icon: 'StarFilled', tone: 'rose' }
]

const hotQuestionList = [
  '差旅报销需要哪些材料？',
  '新员工入职流程是什么？',
  '项目交接文档在哪里？',
  'VPN 权限怎么申请？',
  '绩效考核规则在哪里看？'
]

const retrievalInsights = [
  { title: '报销与发票问题搜索频率最高', desc: '财务制度相关查询占今日检索 31%，费用、审批、发票是主要关键词。', tone: 'blue' },
  { title: '项目交接类知识命中率偏低', desc: '交接模板能命中，但具体项目运维记录不足，建议团队资产库补齐交接说明。', tone: 'amber' },
  { title: '权限申请流程需要补充场景说明', desc: 'VPN、Git、数据库权限被频繁追问，可增加按系统分类的申请入口说明。', tone: 'purple' },
  { title: '技术管理部文档更新最频繁', desc: '发布规范、代码审查、运维手册本周合计更新 9 次，检索热度持续上升。', tone: 'green' }
]

const semanticUnderstanding = computed(() => {
  const keyword = searchKeyword.value.trim()
  const normalized = keyword.toLowerCase()
  if (!keyword) {
    return {
      intent: '制度查询 / 流程查询 / 项目资料',
      scopes: ['知识库', '文档中心', '团队资产库', '企业文化'],
      keywords: ['费用', '审批', '负责人', '流程节点'],
      confidence: 88
    }
  }

  if (keyword.includes('报销') || keyword.includes('发票') || keyword.includes('差旅') || keyword.includes('费用')) {
    return { intent: '制度查询 / 财务流程', scopes: ['知识库', '文档中心', '财务中心'], keywords: ['费用', '审批', '发票', '流程节点'], confidence: 96 }
  }
  if (keyword.includes('入职') || keyword.includes('新人') || keyword.includes('员工手册')) {
    return { intent: '流程查询 / 员工手册', scopes: ['员工手册', '企业文化', '知识库'], keywords: ['新人', '账号开通', '培训', '转正'], confidence: 92 }
  }
  if (keyword.includes('项目') || keyword.includes('交接') || normalized.includes('k8s') || keyword.includes('技术规范')) {
    return { intent: '项目资料 / 技术规范', scopes: ['团队资产库', '文档中心', '知识库'], keywords: ['负责人', '部署', '交接', '运维'], confidence: 89 }
  }
  if (keyword.includes('权限') || normalized.includes('vpn')) {
    return { intent: '权限规范 / 流程查询', scopes: ['文档中心', '技术中心', '知识库'], keywords: ['权限', '审批', '有效期', '负责人'], confidence: 91 }
  }
  return { intent: '综合知识搜索', scopes: ['知识库', '文档中心', '团队资产库'], keywords: [keyword, '负责人', '流程', '更新时间'], confidence: 78 }
})

// ===== 计算 =====
const maxSourceCount = computed(() => Math.max(...sources.value.map(s => s.count)))

const filteredResults = computed(() => {
  return allResults.value.filter(r => {
    const terms = getSearchTerms(searchKeyword.value)
    if (terms.length) {
      const match = terms.some(kw => r.title.toLowerCase().includes(kw) || r.summary.toLowerCase().includes(kw) || r.tags.some(t => t.toLowerCase().includes(kw)) || r.categoryLabel.toLowerCase().includes(kw) || r.dept.toLowerCase().includes(kw))
      if (!match) return false
    }
    if (activeSourceFilter.value) {
      const categoryMap: Record<string, string> = { src1: 'company_policy', src2: 'handbook', src3: 'project', src4: 'benefit', src5: 'process', src6: 'faq' }
      if (r.category !== categoryMap[activeSourceFilter.value]) return false
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
  const terms = getSearchTerms(searchKeyword.value)
  return packages.value.filter(p => terms.some(kw => p.title.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw) || p.docs.some(d => d.title.toLowerCase().includes(kw))))
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
function getSearchTerms(keyword: string) {
  const kw = keyword.trim().toLowerCase()
  if (!kw) return []
  const terms = [kw]
  const maps = [
    { keys: ['差旅', '报销', '费用', '发票', '材料'], terms: ['报销', '差旅', '发票', '审批'] },
    { keys: ['入职', '新人', '员工手册'], terms: ['入职', '新人', '培训', '账号'] },
    { keys: ['项目', '交接', '文档在哪里'], terms: ['项目', '交接', '模板'] },
    { keys: ['vpn', '权限', '申请'], terms: ['权限', '申请', '审批'] },
    { keys: ['绩效', '考核', 'okr'], terms: ['绩效', '考核', 'okr'] },
    { keys: ['福利', '补贴'], terms: ['福利', '补贴'] },
    { keys: ['技术规范', '代码规范'], terms: ['技术规范', '代码规范', 'review'] }
  ]
  maps.forEach(item => {
    if (item.keys.some(k => kw.includes(k))) terms.push(...item.terms)
  })
  return [...new Set(terms)]
}
function resultReason(r: SearchResult) {
  const kw = searchKeyword.value.trim()
  if (!kw) return `${r.categoryLabel}高相关，按相似度与权威等级排序`
  const hitTags = r.tags.filter(t => kw.includes(t) || t.includes(kw)).slice(0, 2)
  if (hitTags.length) return `命中标签：${hitTags.join('、')}`
  if (r.title.includes(kw)) return '标题与检索词直接匹配'
  return `${r.categoryLabel}语义相近，来源可信度较高`
}
function resultSnippet(r: SearchResult) {
  return r.summary.length > 86 ? `${r.summary.slice(0, 86)}...` : r.summary
}
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
function handleLocateSource(r: SearchResult) { ElMessage.info(`已定位到「${r.sourceLabel} / ${r.dept}」`) }
function handleSubscribe(r: SearchResult) { ElMessage.success(`已订阅「${r.title}」的更新`) }
</script>

<style scoped lang="scss">
.sp-page { display: flex; flex-direction: column; gap: var(--app-section-gap); height: 100%; overflow-y: auto; }

/* ===== 搜索指挥台 ===== */
.search-hero {
  position: relative; min-height: 220px; border-radius: var(--app-card-radius); overflow: hidden;
  .sh-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0e7490 80%, #06b6d4 100%); }
  .sh-bg::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.15) 0%, transparent 70%); }
  .sh-bg::after { content: ''; position: absolute; top: 50%; left: 50%; width: 300px; height: 300px; border: 1px solid rgba(6,182,212,0.08); border-radius: 50%; transform: translate(-50%, -50%); animation: radar-pulse 4s ease-out infinite; }
  @keyframes radar-pulse { 0% { width: 100px; height: 100px; opacity: 1; } 100% { width: 500px; height: 500px; opacity: 0; } }
  .sh-content { position: relative; z-index: 1; min-height: 220px; padding: 24px 28px; color: #fff; }
  .sh-kicker { display: flex; align-items: center; gap: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.5; margin-bottom: 4px; span { width: 18px; height: 2px; background: #06b6d4; border-radius: 1px; } }
  h1 { font-size: 22px; font-weight: 700; margin: 0 0 2px; }
  & > .sh-content > p { font-size: 13px; opacity: 0.6; margin: 0 0 16px; letter-spacing: 2px; }
  .sh-search-box { position: relative; margin-bottom: 12px;
    .search-glow { position: absolute; inset: -2px; border-radius: 16px; background: linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4); background-size: 200% 100%; animation: glow-move 3s ease infinite; opacity: 0.6; }
    @keyframes glow-move { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    .search-inner { position: relative; display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.12); backdrop-filter: blur(12px); border-radius: 14px; padding: 6px 8px 6px 16px; border: 1px solid rgba(255,255,255,0.15); }
    .si-icon { font-size: 20px; color: rgba(255,255,255,0.6); flex-shrink: 0; }
    .si-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 15px; &::placeholder { color: rgba(255,255,255,0.4); } }
    .si-btn {
      flex-shrink: 0;
      height: 40px;
      padding: 0 20px;
      border: 0;
      border-radius: 999px;
      color: #fff;
      background: linear-gradient(135deg, #1677ff, #06b6d4);
      box-shadow: 0 8px 18px rgba(22,119,255,0.22);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.18s, box-shadow 0.18s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 22px rgba(22,119,255,0.28);
      }

      &:active {
        transform: translateY(0);
      }
    }
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

/* ===== 语义理解与指标 ===== */
.search-overview {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: var(--app-section-gap);
}

.module-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;

  h3 {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0;
    color: #172554;
    font-size: 14px;
    font-weight: 700;

    .app-icon {
      color: #1677ff;
      font-size: 16px;
    }
  }

  p {
    margin: 4px 0 0;
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 1.5;
  }
}

.semantic-panel,
.quality-panel {
  padding: 16px;
  min-width: 0;
}

.semantic-badge {
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 999px;
  color: #0e7490;
  background: #ecfeff;
  border: 1px solid #cffafe;
  font-size: 11px;
  font-weight: 700;
}

.semantic-content {
  display: grid;
  gap: 10px;
}

.semantic-row {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  min-width: 0;

  > span {
    color: #64748b;
    font-size: 12px;
  }

  > strong {
    color: #172554;
    font-size: 13px;
  }
}

.semantic-tags,
.keyword-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.keyword-pills button {
  border: 1px solid #dbeafe;
  border-radius: 999px;
  background: #f8fbff;
  color: #2563eb;
  font-size: 12px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #93c5fd;
    background: #eff6ff;
  }
}

.confidence-line {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr) 38px;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 12px;

  strong {
    color: #22c55e;
    font-size: 13px;
  }
}

.quality-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.quality-card {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  min-height: 104px;
  padding: 12px;
  border: 1px solid #e6eef8;
  border-radius: 10px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);

  .app-icon {
    margin-bottom: 4px;
    font-size: 18px;
  }

  span {
    color: #64748b;
    font-size: 11px;
  }

  strong {
    color: #172554;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.2;
  }

  small {
    color: #94a3b8;
    font-size: 10px;
    line-height: 1.4;
  }

  &.tone-blue .app-icon { color: #2563eb; }
  &.tone-green .app-icon { color: #16a34a; }
  &.tone-amber .app-icon { color: #d97706; }
  &.tone-purple .app-icon { color: #7c3aed; }
  &.tone-rose .app-icon { color: #e11d48; }
}

/* ===== 初始状态 ===== */
.initial-state { display: flex; flex-direction: column; gap: var(--app-section-gap); padding: 0 0 12px; }
.is-features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  .isf-item { padding: 18px 16px; text-align: center; transition: transform 0.2s;
    &:hover { transform: translateY(-3px); }
    .isf-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 12px; }
    h4 { font-size: 14px; font-weight: 600; margin: 0 0 6px; color: var(--text-color); }
    p { font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.5; }
  }
}

.insight-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: var(--app-section-gap);
}

.hot-knowledge,
.retrieval-insight {
  padding: 16px;
}

.hot-question-list {
  display: grid;
  gap: 8px;
}

.hot-question-list button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e6eef8;
  border-radius: 8px;
  background: #fbfdff;
  color: #1f2a44;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;

  .app-icon {
    color: #cbd5e1;
    font-size: 13px;
    flex-shrink: 0;
  }

  &:hover {
    border-color: #bfdbfe;
    background: #f5f9ff;
    color: #1677ff;
  }
}

.insight-list {
  display: grid;
  gap: 10px;
}

.insight-item {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f8fbff;
  border: 1px solid #e6eef8;

  strong {
    color: #172554;
    font-size: 13px;
    font-weight: 700;
  }

  p {
    margin: 3px 0 0;
    color: #64748b;
    font-size: 12px;
    line-height: 1.5;
  }
}

.insight-dot {
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 50%;
  flex-shrink: 0;

  &.dot-blue { background: #2563eb; box-shadow: 0 0 10px rgba(37,99,235,0.28); }
  &.dot-amber { background: #f59e0b; box-shadow: 0 0 10px rgba(245,158,11,0.28); }
  &.dot-purple { background: #8b5cf6; box-shadow: 0 0 10px rgba(139,92,246,0.28); }
  &.dot-green { background: #22c55e; box-shadow: 0 0 10px rgba(34,197,94,0.28); }
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
  .rc-logic { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 8px;
    div { min-width: 0; padding: 8px 10px; border-radius: 8px; background: #f8fbff; border: 1px solid #edf2f7; }
    span { display: block; color: #94a3b8; font-size: 11px; margin-bottom: 3px; }
    strong { display: block; color: #334155; font-size: 12px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }
  .rc-summary { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .rc-snippet { display: flex; gap: 8px; margin: 0 0 8px; padding: 8px 10px; border-left: 3px solid #93c5fd; border-radius: 6px; background: #f8fbff; color: #475569; font-size: 12px; line-height: 1.5;
    span { flex-shrink: 0; color: #2563eb; font-weight: 700; }
  }
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
@media (max-width: 1200px) {
  .search-body { grid-template-columns: 200px 1fr; }
  .source-map .sm-grid { grid-template-columns: repeat(3, 1fr); }
  .is-features { grid-template-columns: repeat(2, 1fr); }
  .quality-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
  .search-overview,
  .insight-grid,
  .search-body { grid-template-columns: 1fr; }
  .filter-radar { display: none; }
  .source-map .sm-grid { grid-template-columns: repeat(3, 1fr); }
  .rq-grid { grid-template-columns: 1fr; }
  .quality-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  .source-map .sm-grid { grid-template-columns: repeat(2, 1fr); }
  .is-features,
  .kp-grid,
  .quality-grid,
  .rc-logic { grid-template-columns: 1fr; }
  .semantic-row,
  .confidence-line { grid-template-columns: 1fr; }
}
</style>
