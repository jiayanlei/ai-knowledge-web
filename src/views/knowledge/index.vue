<template>
  <PageContainer>
    <div class="kb-page">
      <!-- ===== 知识指挥舱 ===== -->
      <header class="cmd-center">
        <div class="cmd-left">
          <div class="cmd-kicker"><span />KNOWLEDGE MAP</div>
          <h1>企业知识星图</h1>
          <p>统一查看制度、手册、项目文档、福利政策和流程规范</p>
          <div class="cmd-search">
            <el-input v-model="searchKeyword" placeholder="搜索你想了解的制度、流程、项目文档或福利政策..." clearable size="large" class="search-input" :prefix-icon="Search" @keyup.enter="handleSearch" />
            <el-button type="primary" size="large" @click="handleSearch">搜索</el-button>
          </div>
          <div class="cmd-hot-tags">
            <span class="hot-label">热门：</span>
            <el-button v-for="tag in hotTags" :key="tag" size="small" round text @click="handleHotTag(tag)">{{ tag }}</el-button>
          </div>
        </div>
        <div class="cmd-stats">
          <div v-for="item in cmdStats" :key="item.label" class="cs-item" :class="item.className">
            <span class="cs-icon"><AppIcon :name="item.icon" /></span>
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </header>

      <!-- ===== 三栏主体 ===== -->
      <section class="kb-body">
        <!-- 左：知识星系导航 -->
        <aside class="galaxy-nav app-card">
          <div class="gn-title"><h2>知识星系</h2></div>
          <nav class="gn-list">
            <button v-for="g in galaxies" :key="g.id" type="button" class="gn-item" :class="{ 'is-active': activeGalaxy === g.id }" @click="selectGalaxy(g.id)">
              <div class="gn-icon" :style="{ background: g.softColor, color: g.color }"><AppIcon :name="g.icon" /></div>
              <div class="gn-info">
                <span class="gn-name">{{ g.shortName }}</span>
                <span class="gn-meta">{{ g.count }} 篇 · {{ g.status === 'active' ? '活跃' : '稳定' }}</span>
              </div>
            </button>
          </nav>
        </aside>

        <!-- 中：知识探索区 -->
        <div class="explore-area">
          <!-- 星图视图 -->
          <div v-if="!detailDoc" class="starmap-view">
            <!-- 场景入口 -->
            <div class="section-header"><h3>场景入口</h3></div>
            <div class="scene-grid">
              <div v-for="sc in scenes" :key="sc.id" class="scene-card app-card" @click="selectGalaxy(sc.galaxyId)">
                <div class="sc-top" :style="{ borderTopColor: sc.color }">
                  <h4>{{ sc.name }}</h4>
                  <p>{{ sc.description }}</p>
                </div>
                <div class="sc-bottom">
                  <span class="sc-data">{{ sc.knowledgeCount }} 篇知识 · {{ sc.extraInfo }}</span>
                  <el-button type="primary" size="small" plain>进入查看</el-button>
                </div>
              </div>
            </div>

            <!-- 热门知识 -->
            <div class="section-header"><h3>热门知识</h3><el-button text size="small" type="primary">查看全部</el-button></div>
            <div class="card-grid">
              <div v-for="card in hotCards" :key="card.id" class="kb-card app-card" @click="openDetail(card.id)">
                <div class="kc-top">
                  <el-tag :type="statusType(card.status)" size="small" effect="plain">{{ statusLabel(card.status) }}</el-tag>
                  <span v-if="card.recommended" class="kc-rec">推荐</span>
                </div>
                <h4 class="kc-title">{{ card.title }}</h4>
                <p class="kc-summary">{{ card.summary }}</p>
                <div class="kc-tags"><el-tag v-for="t in card.tags.slice(0, 3)" :key="t" size="small" type="info" effect="plain" round>{{ t }}</el-tag></div>
                <div class="kc-footer">
                  <span class="kc-galaxy">{{ card.galaxyName.replace('星球', '') }}</span>
                  <span class="kc-meta">阅读 {{ card.views }} · 收藏 {{ card.favorites }}</span>
                </div>
                <div class="kc-heat"><div class="heat-bar" :style="{ width: card.heat + '%' }" /></div>
              </div>
            </div>

            <!-- 最近更新 -->
            <div class="section-header"><h3>最近更新</h3></div>
            <div class="card-grid">
              <div v-for="card in recentCards" :key="card.id" class="kb-card app-card" @click="openDetail(card.id)">
                <div class="kc-top"><el-tag :type="statusType(card.status)" size="small" effect="plain">{{ statusLabel(card.status) }}</el-tag></div>
                <h4 class="kc-title">{{ card.title }}</h4>
                <p class="kc-summary">{{ card.summary }}</p>
                <div class="kc-footer"><span class="kc-owner">{{ card.owner }}</span><span class="kc-time">{{ card.updateTime }}</span></div>
                <div v-if="card.status === 'needs_update' || isExpired(card)" class="kc-expire-warn">该知识已超过 90 天未更新，请注意确认适用性。</div>
              </div>
            </div>

            <!-- 知识雷达 -->
            <div class="section-header"><h3>知识雷达</h3><span class="section-sub">实时知识感知中心</span></div>
            <div class="radar-zone">
              <div class="radar-scan-line" />
              <div class="radar-grid-bg" />
              <div class="radar-list">
                <div v-for="r in radarItems" :key="r.id" class="radar-item">
                  <div class="ri-icon" :class="'ri-icon--' + r.type"><AppIcon :name="r.icon" /></div>
                  <span class="ri-text">{{ r.text }}</span>
                  <span class="ri-pulse" />
                </div>
              </div>
            </div>
          </div>

          <!-- 文档详情视图 -->
          <div v-else class="detail-view">
            <div class="dv-back"><el-button text @click="detailDoc = null" :icon="ArrowLeft">返回知识星图</el-button></div>
            <div class="dv-header app-card">
              <div class="dv-title-row">
                <h1>{{ detailDoc.title }}</h1>
                <el-tag :type="statusType(detailDoc.status)" effect="light" size="large">{{ statusLabel(detailDoc.status) }}</el-tag>
              </div>
              <div class="dv-meta">
                <el-tag size="small" effect="plain">{{ detailDoc.galaxyName }}</el-tag>
                <el-tag v-for="t in detailDoc.tags" :key="t" size="small" type="info" effect="plain" round>{{ t }}</el-tag>
              </div>
              <div class="dv-info-grid">
                <span><strong>适用范围：</strong>{{ detailDoc.scope }}</span>
                <span><strong>负责人：</strong>{{ detailDoc.owner }}</span>
                <span><strong>版本：</strong>{{ detailDoc.version }}</span>
                <span><strong>更新：</strong>{{ detailDoc.updateTime }}</span>
                <span><strong>阅读：</strong>{{ detailDoc.views }}</span>
                <span><strong>收藏：</strong>{{ detailDoc.favorites }}</span>
              </div>
              <div v-if="detailDoc.status === 'needs_update' || isExpiredById(detailDoc.id)" class="dv-expire-alert">
                <AppIcon name="WarningFilled" /> 该知识已超过 90 天未更新，请注意确认适用性。
              </div>
            </div>

            <!-- 知识健康度 -->
            <div class="dv-health app-card">
              <div class="dh-left">
                <div class="dh-score-ring">
                  <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="none" stroke="#e8edf5" stroke-width="5" /><circle cx="30" cy="30" r="24" fill="none" stroke="#6366f1" stroke-width="5" stroke-linecap="round" :stroke-dasharray="`${detailDoc.healthScore * 1.508} 150.8`" transform="rotate(-90 30 30)" /></svg>
                  <span class="dh-score-val">{{ detailDoc.healthScore }}%</span>
                </div>
                <span class="dh-label">知识健康度</span>
              </div>
              <div class="dh-right">
                <div v-for="reason in detailDoc.healthReasons" :key="reason" class="dh-reason">
                  <el-icon color="#22c55e"><CircleCheckFilled /></el-icon>
                  <span>{{ reason }}</span>
                </div>
              </div>
            </div>

            <!-- 核心摘要 -->
            <div class="dv-section app-card">
              <h3><AppIcon name="Document" /> 核心摘要</h3>
              <p class="dv-abstract">{{ detailDoc.abstract }}</p>
            </div>

            <!-- 流程步骤 -->
            <div class="dv-section app-card">
              <h3><AppIcon name="SetUp" /> 流程步骤</h3>
              <div class="dv-steps">
                <div v-for="(step, i) in detailDoc.steps" :key="i" class="dv-step">
                  <span class="step-num">{{ i + 1 }}</span>
                  <span class="step-text">{{ step }}</span>
                </div>
              </div>
            </div>

            <!-- 注意事项 -->
            <div class="dv-section app-card">
              <h3><AppIcon name="Warning" /> 注意事项</h3>
              <ul class="dv-notes">
                <li v-for="(note, i) in detailDoc.notes" :key="i">{{ note }}</li>
              </ul>
            </div>

            <!-- 文档正文 -->
            <div class="dv-section app-card">
              <h3><AppIcon name="Notebook" /> 文档正文</h3>
              <pre class="dv-content">{{ detailDoc.content }}</pre>
            </div>

            <!-- 相关知识 -->
            <div class="dv-section app-card">
              <h3><AppIcon name="Link" /> 相关知识</h3>
              <div class="dv-related">
                <el-button v-for="rd in detailDoc.relatedDocs" :key="rd.id" size="small" plain @click="openDetail(rd.id)">{{ rd.title }}</el-button>
              </div>
            </div>

            <!-- 版本记录 -->
            <div class="dv-section app-card">
              <h3><AppIcon name="Clock" /> 版本记录</h3>
              <el-table :data="detailDoc.versions" stripe size="small" :header-cell-style="{ background: '#f8faff', color: '#475569', fontWeight: 600, fontSize: '12px' }">
                <el-table-column prop="version" label="版本" width="80" />
                <el-table-column prop="date" label="日期" width="120" />
                <el-table-column prop="author" label="作者" width="120" />
                <el-table-column prop="note" label="变更说明" min-width="200" />
              </el-table>
            </div>

            <!-- 知识反馈 -->
            <div class="dv-section app-card dv-feedback">
              <h3>这篇知识是否解决了你的问题？</h3>
              <div v-if="!feedbackSubmitted" class="fb-buttons">
                <el-button type="success" size="small" plain @click="submitFeedback('solved')">已解决</el-button>
                <el-button type="danger" size="small" plain @click="submitFeedback('unsolved')">没解决</el-button>
                <el-button type="warning" size="small" plain @click="submitFeedback('outdated')">内容过期</el-button>
                <el-button size="small" plain @click="submitFeedback('unclear')">描述不清楚</el-button>
                <el-button size="small" plain @click="submitFeedback('missing')">缺少附件</el-button>
              </div>
              <div v-else class="fb-thanks">
                <el-icon color="#22c55e"><CircleCheckFilled /></el-icon>
                感谢反馈，知识管理员会根据反馈优化内容。
              </div>
            </div>
          </div>
        </div>

        <!-- 右：知识辅助仪表盘 -->
        <aside class="kb-dashboard">
          <!-- 文档摘要（详情模式下） -->
          <div v-if="detailDoc" class="dash-card app-card">
            <div class="dc-header"><AppIcon name="ChatDotRound" /><h3>文档摘要</h3></div>
            <p class="dc-summary">{{ detailDoc.abstract }}</p>
            <div class="dc-ai-actions">
              <el-button size="small" type="primary" plain @click="handleAiAction('interpret', detailDoc.title)">AI 解读</el-button>
              <el-button size="small" plain @click="handleAiAction('summary', detailDoc.title)">智能摘要</el-button>
              <el-button size="small" plain @click="handleAiAction('process', detailDoc.title)">流程提炼</el-button>
              <el-button size="small" plain @click="handleFollowUp(detailDoc)">继续追问</el-button>
            </div>
          </div>

          <!-- 相关知识推荐 -->
          <div v-if="detailDoc" class="dash-card app-card">
            <div class="dc-header"><AppIcon name="Link" /><h3>相关推荐</h3></div>
            <div class="dc-rec-list">
              <div v-for="rd in detailDoc.relatedDocs" :key="rd.id" class="dc-rec-item" @click="openDetail(rd.id)">
                <span>{{ rd.title }}</span>
                <el-icon color="#94a3b8"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>

          <!-- 热门问题 -->
          <div class="dash-card app-card">
            <div class="dc-header"><AppIcon name="TrendCharts" /><h3>热门问题</h3></div>
            <div class="dc-hot-q">
              <div v-for="(q, i) in hotQuestions" :key="i" class="hq-item" @click="handleHotQuestion(q)">
                <span class="hq-num">{{ i + 1 }}</span>
                <span class="hq-text">{{ q }}</span>
              </div>
            </div>
          </div>

          <!-- 最近浏览 -->
          <div class="dash-card app-card">
            <div class="dc-header"><AppIcon name="Clock" /><h3>最近浏览</h3></div>
            <div class="dc-recent">
              <div v-for="rv in recentViews" :key="rv.id" class="rv-item" @click="openDetail(rv.id)">
                <span class="rv-title text-ellipsis">{{ rv.title }}</span>
                <span class="rv-time">{{ rv.viewTime }}</span>
              </div>
            </div>
          </div>

          <!-- 我的收藏 -->
          <div class="dash-card app-card">
            <div class="dc-header"><AppIcon name="StarFilled" /><h3>我的收藏</h3></div>
            <div class="dc-favs">
              <div v-for="fav in favorites" :key="fav.id" class="fav-item" @click="openDetail(fav.id)">
                <span class="fav-title text-ellipsis">{{ fav.title }}</span>
                <span class="fav-time">{{ fav.favoriteTime }}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <!-- AI 操作结果弹窗 -->
      <el-dialog v-model="aiDialogVisible" :title="aiDialogTitle" width="520px" destroy-on-close>
        <pre class="ai-result">{{ aiDialogContent }}</pre>
        <template #footer><el-button type="primary" @click="aiDialogVisible = false">关闭</el-button></template>
      </el-dialog>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ArrowLeft, ArrowRight, CircleCheckFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  getGalaxiesMock, getKnowledgeCardsMock, getHotTagsMock, getTopStatsMock,
  getSceneEntriesMock, getRadarItemsMock,
  getDocDetailsMock, getRecentViewsMock, getFavoritesMock, getHotQuestionsMock,
  getAiSummaryMock, getAiProcessMock, getAiInterpretMock,
  type KnowledgeCard, type DocDetail
} from './mock'

const router = useRouter()

// ===== 数据 =====
const galaxies = ref(getGalaxiesMock())
const allCards = ref(getKnowledgeCardsMock())
const hotTags = ref(getHotTagsMock())
const topStats = ref(getTopStatsMock())
const scenes = ref(getSceneEntriesMock())
const radarItems = ref(getRadarItemsMock())
const docDetails = ref(getDocDetailsMock())
const recentViews = ref(getRecentViewsMock())
const favorites = ref(getFavoritesMock())
const hotQuestions = ref(getHotQuestionsMock())

// ===== 状态 =====
const searchKeyword = ref('')
const activeGalaxy = ref('')
const detailDoc = ref<DocDetail | null>(null)
const feedbackSubmitted = ref(false)

// ===== 计算属性 =====
const hotCards = computed(() => {
  let list = allCards.value.slice().sort((a, b) => b.heat - a.heat).slice(0, 4)
  if (activeGalaxy.value) list = list.filter(c => c.galaxyId === activeGalaxy.value)
  return list.length > 0 ? list : allCards.value.slice(0, 4)
})

const recentCards = computed(() => {
  let list = allCards.value.slice().sort((a, b) => b.updateTime.localeCompare(a.updateTime)).slice(0, 4)
  if (activeGalaxy.value) list = list.filter(c => c.galaxyId === activeGalaxy.value)
  return list.length > 0 ? list : allCards.value.slice(0, 4)
})

const cmdStats = computed(() => [
  { label: '知识节点总数', value: topStats.value.total, icon: 'DataLine', className: '' },
  { label: '今日知识更新', value: topStats.value.monthUpdate, icon: 'Refresh', className: '' },
  { label: '高价值知识数', value: topStats.value.hotViews, icon: 'TrendCharts', className: '' },
  { label: '待完善知识点', value: topStats.value.needsUpdate, icon: 'WarningFilled', className: 'cs-item--warn' },
  { label: '跨部门关联数', value: 42, icon: 'Connection', className: 'cs-item--link' },
  { label: 'AI 推荐关注', value: 18, icon: 'MagicStick', className: 'cs-item--ai' }
])

// ===== 星系导航 =====
function selectGalaxy(id: string) {
  activeGalaxy.value = activeGalaxy.value === id ? '' : id
  detailDoc.value = null
}

// ===== 搜索 =====
function handleSearch() {
  if (searchKeyword.value) ElMessage.info(`搜索"${searchKeyword.value}"共找到 ${Math.floor(Math.random() * 20 + 5)} 条结果（模拟）`)
}

function handleHotTag(tag: string) {
  searchKeyword.value = tag
  handleSearch()
}

function handleHotQuestion(q: string) {
  ElMessage.info(`搜索"${q}"（模拟）`)
}

// ===== 文档详情 =====
function openDetail(id: string) {
  const detail = docDetails.value[id]
  if (detail) {
    detailDoc.value = detail
    feedbackSubmitted.value = false
  } else {
    const card = allCards.value.find(c => c.id === id)
    if (card) ElMessage.info(`文档「${card.title}」详情加载中（模拟）`)
  }
}

// ===== 状态辅助 =====
function statusType(s: string): 'success' | 'warning' | 'info' {
  return s === 'valid' ? 'success' : s === 'needs_update' ? 'warning' : 'info'
}
function statusLabel(s: string): string {
  return s === 'valid' ? '有效' : s === 'needs_update' ? '待更新' : '已废弃'
}

function isExpired(card: KnowledgeCard): boolean {
  const diff = (Date.now() - new Date(card.updateTime).getTime()) / 86400000
  return diff > 90
}
function isExpiredById(id: string): boolean {
  const card = allCards.value.find(c => c.id === id)
  return card ? isExpired(card) : false
}

// ===== 反馈 =====
function submitFeedback(type: string) {
  feedbackSubmitted.value = true
  ElMessage.success('感谢您的反馈！')
}

// ===== AI 操作 =====
const aiDialogVisible = ref(false)
const aiDialogTitle = ref('')
const aiDialogContent = ref('')

function handleAiAction(type: string, title: string) {
  aiDialogTitle.value = type === 'interpret' ? 'AI 解读' : type === 'summary' ? '智能摘要' : '流程提炼'
  aiDialogContent.value = type === 'interpret' ? getAiInterpretMock(title) : type === 'summary' ? getAiSummaryMock(title) : getAiProcessMock(title)
  aiDialogVisible.value = true
}

function handleFollowUp(doc: DocDetail) {
  router.push(`/ai-chat?source=knowledge&docId=${doc.id}&title=${encodeURIComponent(doc.title)}`)
}
</script>

<style scoped lang="scss">
.kb-page { display: flex; flex-direction: column; gap: 12px; min-width: 0; padding-bottom: 4px; color: #172554; }

/* ===== 知识指挥舱 ===== */
.cmd-center {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 20px;
  padding: 20px 24px; border-radius: var(--app-card-radius);
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #3b82f6 100%);
  color: #fff; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.3); position: relative; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, rgba(99,102,241,0.15) 0%, transparent 60%); pointer-events: none; }

  .cmd-kicker { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; opacity: 0.6;
    span { display: inline-block; width: 18px; height: 2px; border-radius: 1px; background: rgba(255,255,255,0.4); }
  }
  h1 { margin: 0 0 4px; font-size: 22px; font-weight: 800; }
  p { margin: 0 0 12px; font-size: 13px; opacity: 0.75; }
}

.cmd-left {
  flex: 1;
  min-width: 420px;
}

.cmd-search { display: flex; gap: 8px; margin-bottom: 10px;
  .search-input { flex: 1; }
  :deep(.el-input__wrapper) { border-radius: 8px; }
}

.cmd-hot-tags { display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
  .hot-label { font-size: 12px; opacity: 0.6; }
  :deep(.el-button) { color: rgba(255,255,255,0.8); font-size: 12px; &:hover { color: #fff; } }
}

.cmd-stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(104px, 1fr));
  gap: 10px;
  width: min(420px, 40%);
  flex-shrink: 0;
  padding: 10px;
  border: 1px solid rgba(191, 219, 254, 0.18);
  border-radius: 14px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.28), rgba(59, 130, 246, 0.14)),
    rgba(255, 255, 255, 0.06);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 28px rgba(96, 165, 250, 0.12);
  backdrop-filter: blur(12px);

  .cs-item {
    position: relative;
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 2px 8px;
    align-items: center;
    min-height: 70px;
    padding: 10px;
    border: 1px solid rgba(226, 232, 240, 0.12);
    border-radius: 11px;
    background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05));
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset: auto 10px 8px 48px;
      height: 2px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(125, 211, 252, 0.72), transparent);
      opacity: 0.55;
    }

    .cs-icon {
      grid-row: span 2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 9px;
      color: #bfdbfe;
      background: rgba(15, 23, 42, 0.3);
      box-shadow: 0 0 16px rgba(96, 165, 250, 0.16);

      :deep(.app-icon) {
        width: 16px;
        height: 16px;
      }
    }

    strong {
      display: block;
      color: #f8fafc;
      font-size: 25px;
      font-weight: 900;
      line-height: 1;
      text-shadow: 0 0 14px rgba(125, 211, 252, 0.18);
    }

    span:last-child {
      color: rgba(226, 232, 240, 0.72);
      font-size: 11px;
      white-space: nowrap;
    }

    &--warn strong,
    &--warn .cs-icon {
      color: #fbbf24;
    }

    &--link strong,
    &--link .cs-icon {
      color: #67e8f9;
    }

    &--ai strong,
    &--ai .cs-icon {
      color: #d8b4fe;
    }
  }
}

/* ===== 三栏主体 ===== */
.kb-body { display: grid; grid-template-columns: 200px minmax(0, 1fr) 260px; gap: 12px; min-width: 0; }

/* ===== 星系导航 ===== */
.galaxy-nav { padding: 14px 10px; height: fit-content; position: sticky; top: 0;
  .gn-title { padding: 0 6px 10px; border-bottom: 1px solid #f1f5f9; margin-bottom: 8px;
    h2 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }
  .gn-list { display: flex; flex-direction: column; gap: 3px; }
  .gn-item {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px;
    border: none; border-radius: 8px; background: transparent; cursor: pointer; transition: all 0.15s; text-align: left;
    &:hover { background: #f1f5f9; }
    &.is-active { background: linear-gradient(135deg, #eef2ff, #e0e7ff); }
    .gn-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
      :deep(.app-icon) { width: 16px; height: 16px; }
    }
    .gn-info { min-width: 0; }
    .gn-name { display: block; font-size: 13px; font-weight: 600; color: #1f2937; }
    .gn-meta { display: block; font-size: 11px; color: #94a3b8; margin-top: 1px; }
  }
}

/* ===== 探索区 ===== */
.explore-area { min-width: 0; }

.section-header { display: flex; align-items: center; justify-content: space-between; margin: 16px 0 10px;
  h3 { margin: 0; font-size: 15px; font-weight: 700; color: #1f2937; }
  .section-sub { font-size: 12px; color: #94a3b8; }
  &:first-child { margin-top: 0; }
}

/* 场景入口 */
.scene-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
.scene-card {
  padding: 0; overflow: hidden; cursor: pointer; transition: all 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(29,78,216,0.1); }
  .sc-top { padding: 14px 16px; border-top: 3px solid #6366f1;
    h4 { margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #1f2937; }
    p { margin: 0; font-size: 12px; color: #6b7280; line-height: 1.5; }
  }
  .sc-bottom { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-top: 1px solid #f1f5f9;
    .sc-data { font-size: 11px; color: #94a3b8; }
  }
}

/* 知识卡片 */
.card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.kb-card {
  padding: 14px; cursor: pointer; transition: all 0.2s; position: relative;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(29,78,216,0.1); border-color: rgba(99,102,241,0.2); }
  .kc-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
    .kc-rec { font-size: 11px; color: #6366f1; font-weight: 600; background: #eef2ff; padding: 1px 8px; border-radius: 4px; }
  }
  .kc-title { margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #1f2937; }
  .kc-summary { margin: 0 0 8px; font-size: 12px; color: #6b7280; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .kc-tags { display: flex; gap: 4px; margin-bottom: 8px; }
  .kc-footer { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8;
    .kc-galaxy { color: #6366f1; font-weight: 500; }
  }
  .kc-heat { margin-top: 6px; height: 3px; border-radius: 2px; background: #f1f5f9;
    .heat-bar { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #6366f1, #8b5cf6); transition: width 0.3s; }
  }
  .kc-expire-warn { margin-top: 6px; padding: 6px 10px; border-radius: 6px; background: #fffbeb; color: #d97706; font-size: 11px; }
}

/* 知识雷达 - 增强版 */
.radar-zone {
  position: relative;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 58, 95, 0.88) 40%, rgba(67, 56, 202, 0.75) 100%);
  overflow: hidden;
  border: 1px solid rgba(99, 102, 241, 0.25);
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.3), inset 0 1px 0 rgba(255,255,255,0.05);
}

.radar-grid-bg {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(99,102,241,0.06) 24px, rgba(99,102,241,0.06) 25px),
    repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(99,102,241,0.06) 24px, rgba(99,102,241,0.06) 25px);
  pointer-events: none;
}

.radar-scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.6) 50%, transparent 100%);
  animation: radarScan 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes radarScan {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.radar-zone .radar-list {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radar-zone .radar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(99, 102, 241, 0.35);
    box-shadow: 0 0 16px rgba(99, 102, 241, 0.15);
    transform: translateX(4px);
  }

  .ri-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    flex-shrink: 0;
    :deep(.app-icon) { width: 15px; height: 15px; }
    &--hot { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    &--search { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
    &--update { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
    &--expire { background: rgba(245, 158, 11, 0.2); color: #fcd34d; }
    &--collect { background: rgba(236, 72, 153, 0.2); color: #f9a8d4; }
  }

  .ri-text {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.85);
    flex: 1;
  }

  .ri-pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.6);
    flex-shrink: 0;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

/* ===== 文档详情 ===== */
.detail-view { display: flex; flex-direction: column; gap: 12px; }
.dv-back { margin-bottom: -4px; }

.dv-header { padding: 20px;
  .dv-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
    h1 { margin: 0; font-size: 20px; font-weight: 800; color: #1f2937; }
  }
  .dv-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .dv-info-grid { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; color: #475569;
    strong { color: #1f2937; }
  }
  .dv-expire-alert { margin-top: 12px; padding: 10px 14px; border-radius: 8px; background: #fffbeb; color: #d97706; font-size: 13px; display: flex; align-items: center; gap: 6px; }
}

/* 健康度 */
.dv-health { display: flex; align-items: center; gap: 24px; padding: 16px 20px;
  .dh-left { display: flex; flex-direction: column; align-items: center; }
  .dh-score-ring { position: relative; width: 60px; height: 60px;
    svg { width: 100%; height: 100%; }
    .dh-score-val { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: #4338ca; }
  }
  .dh-label { margin-top: 4px; font-size: 12px; color: #6b7280; }
  .dh-right { flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;
    .dh-reason { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #475569; }
  }
}

.dv-section { padding: 16px 20px;
  h3 { display: flex; align-items: center; gap: 6px; margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #1f2937;
    :deep(.app-icon) { width: 16px; height: 16px; color: #6366f1; }
  }
  .dv-abstract { margin: 0; font-size: 14px; color: #475569; line-height: 1.7; }
}

/* 流程步骤 */
.dv-steps { display: flex; flex-wrap: wrap; gap: 10px;
  .dv-step { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 8px; background: #f8faff; border: 1px solid #e5eaf3;
    .step-num { width: 22px; height: 22px; border-radius: 50%; background: #6366f1; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .step-text { font-size: 13px; color: #1f2937; }
  }
}

.dv-notes { margin: 0; padding-left: 18px;
  li { font-size: 13px; color: #475569; line-height: 1.8; }
}

.dv-content { margin: 0; font-family: inherit; font-size: 14px; color: #1f2937; line-height: 1.8; white-space: pre-wrap; word-break: break-word; }

.dv-related { display: flex; flex-wrap: wrap; gap: 8px; }

/* 反馈 */
.dv-feedback {
  h3 { font-size: 14px; color: #1f2937; margin-bottom: 10px; }
  .fb-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
  .fb-thanks { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #059669; }
}

/* ===== 右侧仪表盘 ===== */
.kb-dashboard { display: flex; flex-direction: column; gap: 12px; height: fit-content; position: sticky; top: 0; }
.dash-card { padding: 14px 16px;
  .dc-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
    :deep(.app-icon) { width: 16px; height: 16px; color: #6366f1; }
    h3 { margin: 0; font-size: 13px; font-weight: 700; color: #1f2937; }
  }
  .dc-summary { margin: 0 0 10px; font-size: 12px; color: #475569; line-height: 1.6; }
  .dc-ai-actions { display: flex; flex-wrap: wrap; gap: 6px; }
}

.dc-rec-list { display: flex; flex-direction: column; gap: 6px;
  .dc-rec-item { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; color: #1f2937; cursor: pointer;
    &:last-child { border-bottom: none; }
    &:hover { color: #6366f1; }
  }
}

.dc-hot-q { display: flex; flex-direction: column; gap: 6px;
  .hq-item { display: flex; align-items: center; gap: 8px; padding: 5px 0; cursor: pointer; border-bottom: 1px solid #f8fafc;
    &:hover .hq-text { color: #6366f1; }
    .hq-num { width: 18px; height: 18px; border-radius: 4px; background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .hq-text { font-size: 12px; color: #475569; }
  }
}

.dc-recent, .dc-favs { display: flex; flex-direction: column; gap: 6px;
  .rv-item, .fav-item { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; cursor: pointer; border-bottom: 1px solid #f8fafc;
    &:hover .rv-title, &:hover .fav-title { color: #6366f1; }
    &:last-child { border-bottom: none; }
    .rv-title, .fav-title { font-size: 12px; color: #1f2937; max-width: 160px; }
    .rv-time, .fav-time { font-size: 11px; color: #94a3b8; flex-shrink: 0; }
  }
}

/* AI 弹窗 */
.ai-result { margin: 0; font-family: inherit; font-size: 14px; color: #1f2937; line-height: 1.8; white-space: pre-wrap; }

/* 响应式 */
@media (max-width: 1200px) {
  .kb-body { grid-template-columns: 180px minmax(0, 1fr) 240px; }
  .card-grid { grid-template-columns: 1fr; }
}
@media (max-width: 960px) {
  .kb-body { grid-template-columns: minmax(0, 1fr) 220px; }
  .galaxy-nav { display: none; }
  .cmd-center { flex-direction: column; }
  .cmd-left { min-width: 0; width: 100%; }
  .cmd-stats { width: 100%; grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
