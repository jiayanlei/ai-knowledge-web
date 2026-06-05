<template>
  <PageContainer>
    <div class="culture-page">
      <!-- ===== 页面头部 ===== -->
      <header class="culture-header">
        <div class="header-copy">
          <div class="header-kicker"><span />CULTURE MAP</div>
          <h1>企业文化星图</h1>
          <p>沉淀企业文化、价值观、行为准则、新人融入资料、文化故事、员工荣誉、团队活动和制度导航。</p>
        </div>
      </header>

      <!-- ===== 数据概览卡片 ===== -->
      <section class="metric-grid">
        <article class="stat-card stat-card--content">
          <div class="stat-icon"><AppIcon name="Collection" /></div>
          <div class="stat-body">
            <span class="stat-label">文化内容数</span>
            <strong>{{ metrics.cultureContent }}</strong>
          </div>
          <div class="stat-spark">
            <svg viewBox="0 0 64 24" fill="none"><polyline points="0,18 8,14 16,16 24,10 32,12 40,6 48,8 56,2 64,4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </article>
        <article class="stat-card stat-card--newhire">
          <div class="stat-icon"><AppIcon name="Reading" /></div>
          <div class="stat-body">
            <span class="stat-label">新人必读数</span>
            <strong>{{ metrics.newHireReading }}</strong>
          </div>
          <div class="stat-spark">
            <svg viewBox="0 0 64 24" fill="none"><polyline points="0,16 8,12 16,14 24,8 32,10 40,4 48,6 56,2 64,4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </article>
        <article class="stat-card stat-card--stories">
          <div class="stat-icon"><AppIcon name="Notebook" /></div>
          <div class="stat-body">
            <span class="stat-label">文化故事数</span>
            <strong>{{ metrics.cultureStories }}</strong>
          </div>
          <div class="stat-spark">
            <svg viewBox="0 0 64 24" fill="none"><polyline points="0,20 8,16 16,18 24,12 32,14 40,8 48,6 56,8 64,2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </article>
        <article class="stat-card stat-card--events">
          <div class="stat-icon"><AppIcon name="Calendar" /></div>
          <div class="stat-body">
            <span class="stat-label">本月活动数</span>
            <strong>{{ metrics.monthlyEvents }}</strong>
          </div>
          <div class="stat-spark">
            <svg viewBox="0 0 64 24" fill="none"><polyline points="0,14 8,18 16,10 24,12 32,6 40,8 48,4 56,6 64,2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </article>
      </section>

      <!-- ===== 三栏主体 ===== -->
      <section class="culture-body">
        <!-- 左侧：目录树 -->
        <aside class="culture-nav app-card">
          <div class="panel-title"><h2>文化目录</h2></div>
          <nav class="nav-list">
            <button
              v-for="item in navItems"
              :key="item.key"
              type="button"
              class="nav-item"
              :class="{ 'is-active': activeTab === item.key }"
              @click="activeTab = item.key"
            >
              <AppIcon :name="item.icon" />
              <span>{{ item.label }}</span>
            </button>
          </nav>
        </aside>

        <!-- 中间：内容区 -->
        <div class="culture-content app-card">
          <el-tabs v-model="activeTab" class="content-tabs">
            <!-- ====== 文化总览 ====== -->
            <el-tab-pane label="文化总览" name="overview">
              <div class="section-block overview-block">
                <div class="overview-hero">
                  <div class="overview-company">
                    <h2>{{ overview.companyName }}</h2>
                    <p class="overview-theme">{{ overview.theme }}</p>
                  </div>
                  <div class="overview-slogan">
                    <span class="slogan-icon">"</span>
                    {{ overview.slogan }}
                    <span class="slogan-icon">"</span>
                  </div>
                </div>
                <div class="overview-grid">
                  <div class="overview-item">
                    <span class="oi-label">使命</span>
                    <span class="oi-value">{{ overview.mission }}</span>
                  </div>
                  <div class="overview-item">
                    <span class="oi-label">愿景</span>
                    <span class="oi-value">{{ overview.vision }}</span>
                  </div>
                  <div class="overview-item">
                    <span class="oi-label">文化负责人</span>
                    <span class="oi-value">{{ overview.owner }}</span>
                  </div>
                  <div class="overview-item">
                    <span class="oi-label">最近更新</span>
                    <span class="oi-value">{{ overview.lastUpdate }}</span>
                  </div>
                </div>
                <div class="overview-values">
                  <span class="section-title">核心价值观</span>
                  <div class="value-tags">
                    <el-tag v-for="v in overview.values" :key="v" size="large" effect="light" round>{{ v }}</el-tag>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 使命愿景 ====== -->
            <el-tab-pane label="使命愿景" name="mission">
              <div class="section-block">
                <div class="mv-grid">
                  <div class="mv-card" style="--mv-color: #6366f1;">
                    <div class="mv-icon"><AppIcon name="Aim" /></div>
                    <h3>使命</h3>
                    <p>{{ missionVision.mission }}</p>
                  </div>
                  <div class="mv-card" style="--mv-color: #10b981;">
                    <div class="mv-icon"><AppIcon name="View" /></div>
                    <h3>愿景</h3>
                    <p>{{ missionVision.vision }}</p>
                  </div>
                  <div class="mv-card" style="--mv-color: #f59e0b;">
                    <div class="mv-icon"><AppIcon name="Opportunity" /></div>
                    <h3>经营理念</h3>
                    <p>{{ missionVision.philosophy }}</p>
                  </div>
                  <div class="mv-card" style="--mv-color: #3b82f6;">
                    <div class="mv-icon"><AppIcon name="TrendCharts" /></div>
                    <h3>长期目标</h3>
                    <p>{{ missionVision.longTermGoal }}</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 核心价值观 ====== -->
            <el-tab-pane label="核心价值观" name="values">
              <div class="section-block">
                <div class="values-grid">
                  <div v-for="val in coreValues" :key="val.id" class="value-card" :style="{ '--val-color': val.color, '--val-soft': val.softColor }">
                    <div class="value-header">
                      <div class="value-icon"><AppIcon :name="val.icon" /></div>
                      <h3>{{ val.name }}</h3>
                    </div>
                    <p class="value-desc">{{ val.description }}</p>
                    <div class="value-behaviors">
                      <span class="vb-label">行为示例：</span>
                      <el-tag v-for="b in val.behaviors" :key="b" size="small" effect="plain" round>{{ b }}</el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 行为准则 ====== -->
            <el-tab-pane label="行为准则" name="guidelines">
              <div class="section-block">
                <div class="guidelines-grid">
                  <div v-for="g in guidelines" :key="g.id" class="guideline-card app-card">
                    <div class="gl-header">
                      <AppIcon :name="g.icon" />
                      <h3>{{ g.category }}</h3>
                    </div>
                    <ul class="gl-rules">
                      <li v-for="(rule, idx) in g.rules" :key="idx">
                        <span class="rule-num">{{ idx + 1 }}</span>
                        {{ rule }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 新人融入 ====== -->
            <el-tab-pane label="新人融入" name="onboarding">
              <div class="section-block">
                <div class="onboarding-timeline">
                  <div v-for="day in onboarding" :key="day.day" class="timeline-day">
                    <div class="tl-marker">
                      <span class="tl-dot" />
                      <span v-if="day.day < onboarding.length" class="tl-line" />
                    </div>
                    <div class="tl-content">
                      <div class="tl-header">
                        <el-tag size="small" effect="dark" :type="day.day <= 2 ? 'success' : day.day <= 4 ? 'warning' : 'info'">第 {{ day.day }} 天</el-tag>
                        <h4>{{ day.title }}</h4>
                      </div>
                      <div class="tl-tasks">
                        <div v-for="(task, tIdx) in day.tasks" :key="tIdx" class="tl-task">
                          <el-icon :color="task.done ? '#22c55e' : '#d1d5db'"><component :is="task.done ? 'CircleCheckFilled' : 'CircleClose'" /></el-icon>
                          <span :class="{ 'task-done': task.done }">{{ task.title }}</span>
                          <el-tag v-if="task.done" type="success" size="small" effect="plain">已完成</el-tag>
                          <el-tag v-else type="info" size="small" effect="plain">待完成</el-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 文化故事 ====== -->
            <el-tab-pane label="文化故事" name="stories">
              <div class="section-block">
                <div class="stories-grid">
                  <div v-for="story in stories" :key="story.id" class="story-card app-card">
                    <div class="story-header">
                      <el-tag :type="storyTagType(story.type)" size="small" effect="light">{{ story.type }}</el-tag>
                      <span class="story-date">{{ story.date }}</span>
                    </div>
                    <h3 class="story-title">{{ story.title }}</h3>
                    <p class="story-summary">{{ story.summary }}</p>
                    <div class="story-footer">
                      <div class="story-keywords">
                        <el-tag v-for="kw in story.keywords" :key="kw" size="small" type="info" effect="plain" round>{{ kw }}</el-tag>
                      </div>
                      <span class="story-author">{{ story.author }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 员工荣誉 ====== -->
            <el-tab-pane label="员工荣誉" name="honor">
              <div class="section-block">
                <div class="section-title">本月荣誉榜</div>
                <div class="honor-grid">
                  <div v-for="h in honorRecords" :key="h.id" class="honor-card app-card">
                    <div class="honor-badge" :style="{ background: h.color + '18', color: h.color }">
                      <AppIcon :name="h.badge" />
                    </div>
                    <div class="honor-info">
                      <div class="honor-name">{{ h.name }}<el-tag size="small" :color="h.color + '20'" :style="{ color: h.color, border: 'none' }" effect="plain">{{ h.title }}</el-tag></div>
                      <span class="honor-dept">{{ h.department }}</span>
                      <p class="honor-desc">{{ h.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 团队活动 ====== -->
            <el-tab-pane label="团队活动" name="events">
              <div class="section-block">
                <div class="events-list">
                  <div v-for="ev in events" :key="ev.id" class="event-card app-card">
                    <div class="ev-time-block">
                      <span class="ev-day">{{ ev.time.split(' ')[0].split('-').slice(1).join('/') }}</span>
                      <span class="ev-hour">{{ ev.time.split(' ')[1] }}</span>
                    </div>
                    <div class="ev-info">
                      <div class="ev-header">
                        <h3>{{ ev.title }}</h3>
                        <el-tag :type="eventStatusType(ev.status)" size="small" effect="light">{{ eventStatusLabel(ev.status) }}</el-tag>
                      </div>
                      <p class="ev-desc">{{ ev.description }}</p>
                      <div class="ev-meta">
                        <span><AppIcon name="Location" /> {{ ev.location }}</span>
                        <el-tag type="info" size="small" effect="plain">{{ ev.type }}</el-tag>
                      </div>
                    </div>
                    <el-button v-if="ev.status === 'open'" type="primary" size="small" plain @click="handleSignUp(ev)">报名参加</el-button>
                    <el-button v-else-if="ev.status === 'upcoming'" size="small" disabled>即将开始</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 制度导航 ====== -->
            <el-tab-pane label="制度导航" name="policies">
              <div class="section-block">
                <div class="policies-list">
                  <div v-for="pc in policyCategories" :key="pc.id" class="policy-group">
                    <div class="pg-header">
                      <AppIcon :name="pc.icon" />
                      <h3>{{ pc.category }}</h3>
                      <el-tag size="small" type="info" effect="plain">{{ pc.policies.length }} 项制度</el-tag>
                    </div>
                    <div class="pg-table">
                      <el-table :data="pc.policies" stripe size="small" :header-cell-style="{ background: '#f8faff', color: '#475569', fontWeight: 600, fontSize: '12px' }">
                        <el-table-column prop="name" label="制度名称" min-width="180" />
                        <el-table-column prop="owner" label="负责人" width="110" />
                        <el-table-column prop="updateTime" label="更新时间" width="110" />
                        <el-table-column prop="scope" label="适用范围" width="100" />
                        <el-table-column label="操作" width="150" align="center">
                          <template #default>
                            <el-button type="primary" link size="small" @click="ElMessage.info('查看详情功能待接入')">查看详情</el-button>
                            <el-button type="warning" link size="small" @click="handleAiInterpret">AI 解读</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== AI 问答 ====== -->
            <el-tab-pane label="AI 问答" name="ai">
              <div class="section-block ai-section">
                <div class="ai-inline-chat">
                  <div class="ai-welcome">
                    <AppIcon name="ChatDotRound" />
                    <p>{{ aiWelcome }}</p>
                  </div>
                  <div class="ai-messages" ref="aiInlineMsgRef">
                    <div v-for="msg in aiInlineMessages" :key="msg.id" class="ai-msg" :class="'ai-msg--' + msg.role">
                      <div class="ai-msg-bubble">{{ msg.content }}</div>
                    </div>
                  </div>
                  <div class="ai-presets">
                    <span class="preset-label">试试问我：</span>
                    <el-button v-for="q in aiPresets" :key="q" size="small" round @click="handleInlineAsk(q)">{{ q }}</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 右侧：AI 助手 + 热词 + 活动 -->
        <aside class="culture-sidebar">
          <!-- AI 文化助手 -->
          <div class="sidebar-card app-card sidebar-ai">
            <div class="sc-header">
              <AppIcon name="ChatDotRound" />
              <h3>AI 文化助手</h3>
            </div>
            <div class="ai-chat-box" ref="aiSideMsgRef">
              <div class="ai-welcome-mini">{{ aiWelcome }}</div>
              <div v-for="msg in aiSideMessages" :key="msg.id" class="ai-msg" :class="'ai-msg--' + msg.role">
                <div class="ai-msg-bubble">{{ msg.content }}</div>
              </div>
            </div>
            <div class="ai-presets-mini">
              <el-button v-for="q in aiPresets.slice(0, 4)" :key="q" size="small" round @click="handleSideAsk(q)">{{ q }}</el-button>
            </div>
          </div>

          <!-- 文化热词 -->
          <div class="sidebar-card app-card">
            <div class="sc-header">
              <AppIcon name="TrendCharts" />
              <h3>文化热词</h3>
            </div>
            <div class="hot-words">
              <div v-for="hw in hotWords" :key="hw.word" class="hw-row">
                <span class="hw-word">{{ hw.word }}</span>
                <div class="hw-bar"><div class="hw-bar-fill" :style="{ width: (hw.count / maxHotWord) * 100 + '%' }" /></div>
                <span class="hw-count">{{ hw.count }}</span>
              </div>
            </div>
          </div>

          <!-- 本月活动推荐 -->
          <div class="sidebar-card app-card">
            <div class="sc-header">
              <AppIcon name="Calendar" />
              <h3>本月活动推荐</h3>
            </div>
            <div class="side-events">
              <div v-for="ev in events" :key="ev.id" class="side-event">
                <span class="se-date">{{ ev.time.split(' ')[0].split('-').slice(1).join('/') }}</span>
                <div class="se-info">
                  <span class="se-title">{{ ev.title }}</span>
                  <span class="se-loc">{{ ev.location }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  getOverviewMetricsMock,
  getCultureOverviewMock,
  getMissionVisionMock,
  getCoreValuesMock,
  getGuidelinesMock,
  getOnboardingMock,
  getCultureStoriesMock,
  getHonorRecordsMock,
  getTeamEventsMock,
  getPoliciesMock,
  getAiPresetQuestions,
  getAiWelcomeMessage,
  getAiAnswer,
  getHotWordsMock,
  type AiChatMessage,
  type TeamEvent
} from './mock'

// ===== 数据初始化 =====
const metrics = ref(getOverviewMetricsMock())
const overview = ref(getCultureOverviewMock())
const missionVision = ref(getMissionVisionMock())
const coreValues = ref(getCoreValuesMock())
const guidelines = ref(getGuidelinesMock())
const onboarding = ref(getOnboardingMock())
const stories = ref(getCultureStoriesMock())
const honorRecords = ref(getHonorRecordsMock())
const events = ref(getTeamEventsMock())
const policyCategories = ref(getPoliciesMock())
const aiPresets = ref(getAiPresetQuestions())
const aiWelcome = ref(getAiWelcomeMessage())
const hotWords = ref(getHotWordsMock())
const maxHotWord = computed(() => Math.max(...hotWords.value.map(h => h.count)))

// ===== 导航 =====
const navItems = [
  { key: 'overview', label: '公司介绍', icon: 'HomeFilled' },
  { key: 'mission', label: '使命愿景', icon: 'Aim' },
  { key: 'values', label: '核心价值观', icon: 'Star' },
  { key: 'guidelines', label: '行为准则', icon: 'Document' },
  { key: 'onboarding', label: '新人融入', icon: 'UserFilled' },
  { key: 'stories', label: '文化故事', icon: 'Notebook' },
  { key: 'honor', label: '员工荣誉', icon: 'Trophy' },
  { key: 'events', label: '团队活动', icon: 'Calendar' },
  { key: 'policies', label: '制度导航', icon: 'Tickets' },
  { key: 'ai', label: 'AI 文化助手', icon: 'ChatDotRound' }
]

const activeTab = ref('overview')

// ===== 文化故事标签颜色 =====
function storyTagType(type: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    '复盘成长': 'warning',
    '效率提升': 'success',
    '新人融入': '',
    '技术沉淀': 'info'
  }
  return map[type] || 'info'
}

// ===== 活动状态 =====
function eventStatusType(status: string): 'success' | 'warning' | 'info' | 'danger' {
  const map: Record<string, 'success' | 'warning' | 'info' | 'danger'> = { open: 'success', upcoming: 'warning', full: 'danger', ended: 'info' }
  return map[status] || 'info'
}

function eventStatusLabel(status: string): string {
  const map: Record<string, string> = { open: '可报名', upcoming: '未开始', full: '已满', ended: '已结束' }
  return map[status] || status
}

function handleSignUp(ev: TeamEvent) {
  ElMessage.success(`已成功报名「${ev.title}」，活动详情将发送到您的邮箱。`)
}

// ===== AI 解读 =====
function handleAiInterpret() {
  ElMessage.info('AI 正在解读该制度文档，预计 3-5 秒生成摘要…（模拟功能）')
  setTimeout(() => {
    ElMessage.success('AI 解读完成：该制度主要涵盖 3 个核心要点，建议重点关注第二章的安全责任条款。')
  }, 1500)
}

// ===== AI 文化助手（右侧面板） =====
let sideMsgId = 0
const aiSideMessages = ref<AiChatMessage[]>([])
const aiSideMsgRef = ref<HTMLElement | null>(null)

async function handleSideAsk(question: string) {
  aiSideMessages.value.push({ id: `side-u-${++sideMsgId}`, role: 'user', content: question })
  await nextTick()
  scrollBottom(aiSideMsgRef)
  setTimeout(() => {
    aiSideMessages.value.push({ id: `side-a-${sideMsgId}`, role: 'assistant', content: getAiAnswer(question) })
    nextTick(() => scrollBottom(aiSideMsgRef))
  }, 600)
}

// ===== AI 问答（中间 Tab） =====
let inlineMsgId = 0
const aiInlineMessages = ref<AiChatMessage[]>([])
const aiInlineMsgRef = ref<HTMLElement | null>(null)

async function handleInlineAsk(question: string) {
  aiInlineMessages.value.push({ id: `inline-u-${++inlineMsgId}`, role: 'user', content: question })
  await nextTick()
  scrollBottom(aiInlineMsgRef)
  setTimeout(() => {
    aiInlineMessages.value.push({ id: `inline-a-${inlineMsgId}`, role: 'assistant', content: getAiAnswer(question) })
    nextTick(() => scrollBottom(aiInlineMsgRef))
  }, 600)
}

function scrollBottom(elRef: { value: HTMLElement | null }) {
  if (elRef.value) {
    elRef.value.scrollTop = elRef.value.scrollHeight
  }
}
</script>

<style scoped lang="scss">
.culture-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding-bottom: 4px;
  color: #172554;
}

/* ===== 页面头部 ===== */
.culture-header {
  padding: 18px 22px;
  border-radius: var(--app-card-radius);
  background: linear-gradient(135deg, #1e3a5f 0%, #4338ca 50%, #a78bfa 100%);
  color: #fff;
  box-shadow: 0 6px 20px rgba(67, 56, 202, 0.25);

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

  h1 { margin: 0 0 4px; font-size: 22px; font-weight: 800; }
  p { margin: 0; font-size: 13px; opacity: 0.8; }
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
    :deep(.app-icon) { width: 24px; height: 24px; }
  }

  .stat-body {
    min-width: 0;
    .stat-label { display: block; font-size: 13px; color: #475569; font-weight: 600; }
    strong { display: block; margin-top: 4px; font-size: 28px; font-weight: 800; line-height: 1; }
  }

  .stat-spark {
    position: absolute;
    right: 12px;
    bottom: 10px;
    width: 56px;
    opacity: 0.18;
    svg { width: 100%; }
  }
}

.stat-card--content { .stat-icon { background: #eef2ff; color: #6366f1; } .stat-spark { color: #6366f1; } strong { color: #4338ca; } }
.stat-card--newhire { .stat-icon { background: #ecfdf5; color: #10b981; } .stat-spark { color: #10b981; } strong { color: #059669; } }
.stat-card--stories { .stat-icon { background: #fffbeb; color: #f59e0b; } .stat-spark { color: #f59e0b; } strong { color: #d97706; } }
.stat-card--events { .stat-icon { background: #eff6ff; color: #3b82f6; } .stat-spark { color: #3b82f6; } strong { color: #2563eb; } }

/* ===== 三栏主体 ===== */
.culture-body {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr) 280px;
  gap: 12px;
  min-width: 0;
}

/* ===== 左侧导航 ===== */
.culture-nav {
  padding: 14px 10px;
  height: fit-content;
  position: sticky;
  top: 0;

  .panel-title {
    padding: 0 6px 10px;
    border-bottom: 1px solid #f1f5f9;
    margin-bottom: 8px;
    h2 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #475569;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;

    :deep(.app-icon) { width: 16px; height: 16px; flex-shrink: 0; }

    &:hover { background: #f1f5f9; color: #1e40af; }

    &.is-active {
      background: linear-gradient(135deg, #eef2ff, #e0e7ff);
      color: #4338ca;
      font-weight: 700;
    }
  }
}

/* ===== 中间内容区 ===== */
.culture-content {
  padding: 16px 18px;
  min-width: 0;

  .content-tabs {
    :deep(.el-tabs__header) { margin-bottom: 14px; }
    :deep(.el-tabs__item) { font-size: 13px; font-weight: 600; }
  }
}

.section-block {
  min-width: 0;
}

/* -- 文化总览 -- */
.overview-hero {
  margin-bottom: 18px;
  padding: 18px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8edff 100%);
  border: 1px solid #dde4ff;

  .overview-company {
    margin-bottom: 12px;
    h2 { margin: 0 0 4px; font-size: 20px; font-weight: 800; color: #1e3a5f; }
    .overview-theme { margin: 0; font-size: 15px; color: #4338ca; font-weight: 600; }
  }

  .overview-slogan {
    padding: 10px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    color: #475569;
    font-style: italic;

    .slogan-icon { font-size: 20px; color: #a78bfa; font-weight: 800; }
  }
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 18px;

  .overview-item {
    padding: 12px 16px;
    border: 1px solid #e5eaf3;
    border-radius: 8px;
    background: #fafbff;

    .oi-label { display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px; font-weight: 600; }
    .oi-value { font-size: 14px; color: #1f2937; font-weight: 500; }
  }
}

.overview-values {
  .section-title { font-size: 14px; margin-bottom: 8px; }
  .value-tags { display: flex; flex-wrap: wrap; gap: 8px; }
}

/* -- 使命愿景 -- */
.mv-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.mv-card {
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e5eaf3;
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06); transform: translateY(-2px); }

  .mv-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin-bottom: 10px;
    background: color-mix(in srgb, var(--mv-color) 12%, white);
    color: var(--mv-color);
    :deep(.app-icon) { width: 22px; height: 22px; }
  }

  h3 { margin: 0 0 6px; font-size: 15px; font-weight: 700; color: #1f2937; }
  p { margin: 0; font-size: 13px; color: #475569; line-height: 1.6; }
}

/* -- 核心价值观 -- */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.value-card {
  padding: 18px;
  border-radius: 10px;
  border: 1px solid #e5eaf3;
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06); transform: translateY(-2px); }

  .value-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    .value-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--val-soft);
      color: var(--val-color);
      :deep(.app-icon) { width: 20px; height: 20px; }
    }

    h3 { margin: 0; font-size: 15px; font-weight: 700; color: #1f2937; }
  }

  .value-desc { margin: 0 0 10px; font-size: 13px; color: #475569; line-height: 1.5; }

  .value-behaviors {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    .vb-label { font-size: 12px; color: #94a3b8; }
  }
}

/* -- 行为准则 -- */
.guidelines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.guideline-card {
  padding: 16px;

  .gl-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    :deep(.app-icon) { width: 18px; height: 18px; color: #6366f1; }
    h3 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }

  .gl-rules {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
      color: #475569;
      line-height: 1.5;

      &:last-child { border-bottom: none; }

      .rule-num {
        flex: 0 0 20px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #eef2ff;
        color: #6366f1;
        font-size: 11px;
        font-weight: 700;
        margin-top: 1px;
      }
    }
  }
}

/* -- 新人融入时间线 -- */
.onboarding-timeline {
  padding-left: 4px;
}

.timeline-day {
  display: flex;
  gap: 16px;
  min-height: 80px;
}

.tl-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 20px;

  .tl-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: 2px solid #e0e7ff;
    flex-shrink: 0;
  }

  .tl-line {
    width: 2px;
    flex: 1;
    background: #e0e7ff;
    margin-top: 4px;
  }
}

.tl-content {
  flex: 1;
  padding-bottom: 18px;

  .tl-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    h4 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }

  .tl-tasks {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tl-task {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #475569;

    .task-done { text-decoration: line-through; color: #94a3b8; }
  }
}

/* -- 文化故事 -- */
.stories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.story-card {
  padding: 16px;

  .story-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    .story-date { font-size: 12px; color: #94a3b8; }
  }

  .story-title { margin: 0 0 8px; font-size: 15px; font-weight: 700; color: #1f2937; }

  .story-summary {
    margin: 0 0 12px;
    font-size: 13px;
    color: #475569;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .story-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .story-keywords { display: flex; flex-wrap: wrap; gap: 4px; }
    .story-author { font-size: 12px; color: #94a3b8; }
  }
}

/* -- 员工荣誉 -- */
.honor-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.honor-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;

  .honor-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 50px;
    width: 50px;
    height: 50px;
    border-radius: 12px;
    :deep(.app-icon) { width: 26px; height: 26px; }
  }

  .honor-info {
    flex: 1;
    min-width: 0;

    .honor-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .honor-dept { display: block; font-size: 12px; color: #94a3b8; margin-bottom: 6px; }
    .honor-desc { margin: 0; font-size: 13px; color: #475569; line-height: 1.5; }
  }
}

/* -- 团队活动 -- */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;

  .ev-time-block {
    flex: 0 0 60px;
    text-align: center;
    padding: 8px;
    border-radius: 8px;
    background: #eef2ff;

    .ev-day { display: block; font-size: 18px; font-weight: 800; color: #4338ca; }
    .ev-hour { display: block; font-size: 12px; color: #6366f1; margin-top: 2px; }
  }

  .ev-info {
    flex: 1;
    min-width: 0;

    .ev-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      h3 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
    }

    .ev-desc { margin: 0 0 6px; font-size: 13px; color: #475569; }

    .ev-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      color: #6b7280;

      :deep(.app-icon) { width: 14px; height: 14px; vertical-align: -2px; margin-right: 2px; }
    }
  }
}

/* -- 制度导航 -- */
.policies-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.policy-group {
  .pg-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    :deep(.app-icon) { width: 18px; height: 18px; color: #6366f1; }
    h3 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }

  .pg-table {
    border: 1px solid #e5eaf3;
    border-radius: 8px;
    overflow: hidden;
  }
}

/* -- AI 问答 (中间 Tab) -- */
.ai-section {
  min-height: 400px;
}

.ai-inline-chat {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ai-welcome {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f0f4ff, #e8edff);
  :deep(.app-icon) { width: 24px; height: 24px; color: #6366f1; flex-shrink: 0; }
  p { margin: 0; font-size: 13px; color: #475569; line-height: 1.5; }
}

.ai-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
}

.ai-msg {
  display: flex;

  &--user { justify-content: flex-end; }
  &--assistant { justify-content: flex-start; }

  .ai-msg-bubble {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &--user .ai-msg-bubble {
    background: #6366f1;
    color: #fff;
    border-bottom-right-radius: 3px;
  }

  &--assistant .ai-msg-bubble {
    background: #f1f5f9;
    color: #1f2937;
    border-bottom-left-radius: 3px;
  }
}

.ai-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  .preset-label { font-size: 13px; color: #94a3b8; font-weight: 500; }
}

/* ===== 右侧面板 ===== */
.culture-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.sidebar-card {
  padding: 14px 16px;

  .sc-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    :deep(.app-icon) { width: 18px; height: 18px; color: #6366f1; }
    h3 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }
}

/* AI 文化助手 (右侧) */
.sidebar-ai {
  border: 1px solid #dde4ff;
  background: linear-gradient(180deg, #fafbff 0%, #fff 100%);
}

.ai-chat-box {
  max-height: 260px;
  overflow-y: auto;
  margin-bottom: 10px;

  .ai-welcome-mini {
    padding: 10px 12px;
    border-radius: 8px;
    background: #f1f5f9;
    font-size: 12px;
    color: #475569;
    line-height: 1.5;
    margin-bottom: 8px;
  }

  .ai-msg-bubble { font-size: 12px; padding: 8px 10px; }
}

.ai-presets-mini {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* 文化热词 */
.hot-words {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hw-row {
  display: flex;
  align-items: center;
  gap: 8px;

  .hw-word { flex: 0 0 65px; font-size: 12px; color: #475569; font-weight: 500; }

  .hw-bar {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: #f1f5f9;
    overflow: hidden;

    .hw-bar-fill {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      transition: width 0.4s ease;
    }
  }

  .hw-count { flex: 0 0 24px; text-align: right; font-size: 12px; font-weight: 700; color: #6366f1; }
}

/* 本月活动推荐 */
.side-events {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.side-event {
  display: flex;
  align-items: center;
  gap: 10px;

  .se-date {
    flex: 0 0 42px;
    text-align: center;
    font-size: 14px;
    font-weight: 800;
    color: #6366f1;
    background: #eef2ff;
    padding: 4px 6px;
    border-radius: 6px;
  }

  .se-info {
    min-width: 0;
    flex: 1;

    .se-title { display: block; font-size: 13px; font-weight: 600; color: #1f2937; }
    .se-loc { display: block; font-size: 11px; color: #94a3b8; margin-top: 2px; }
  }
}
</style>
