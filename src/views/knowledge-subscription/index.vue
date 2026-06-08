<template>
  <PageContainer>
    <div class="subscription-page">
      <!-- ===== 顶部：知识雷达概览 ===== -->
      <header class="radar-header">
        <div class="header-copy">
          <div class="header-kicker"><span />KNOWLEDGE RADAR</div>
          <h1>我的知识雷达</h1>
          <p>自动追踪你关心的制度、流程、项目与技术规范变化</p>
        </div>
        <div
          class="weekly-summary-card"
          :class="{ 'is-expanded': summaryExpanded }"
          @click="summaryExpanded = !summaryExpanded"
        >
          <div class="ws-header">
            <AppIcon name="MagicStick" />
            <span>AI 每周摘要</span>
            <AppIcon name="ArrowDown" class="ws-arrow" />
          </div>
          <p class="ws-content">{{ weeklySummary.content }}</p>
          <transition name="ws-slide">
            <div v-if="summaryExpanded" class="ws-highlights">
              <div
                v-for="(hl, idx) in weeklySummary.highlights"
                :key="idx"
                class="ws-highlight"
              >
                <span class="impact-dot" :class="'impact-dot--' + hl.level" />
                {{ hl.text }}
              </div>
              <div class="ws-footer">
                <span>本周共 <strong>{{ weeklySummary.totalChanges }}</strong> 条知识变化</span>
                <span>涉及 <strong>{{ weeklySummary.relatedDepartmentCount }}</strong> 个部门</span>
              </div>
            </div>
          </transition>
        </div>
      </header>

      <!-- ===== 核心指标卡片 ===== -->
      <section class="metric-grid">
        <article class="stat-card stat-card--subscribed">
          <div class="stat-icon"><AppIcon name="Bell" /></div>
          <div class="stat-body">
            <span class="stat-label">已订阅主题</span>
            <strong>{{ stats.subscribedTopics }}<em>个</em></strong>
          </div>
          <div class="stat-glow" />
        </article>

        <article class="stat-card stat-card--updates">
          <div class="stat-icon"><AppIcon name="TrendCharts" /></div>
          <div class="stat-body">
            <span class="stat-label">本周知识更新</span>
            <strong>{{ stats.weeklyUpdates }}<em>条</em></strong>
          </div>
          <div class="stat-glow" />
        </article>

        <article class="stat-card stat-card--important">
          <div class="stat-icon"><AppIcon name="Warning" /></div>
          <div class="stat-body">
            <span class="stat-label">重要变更提醒</span>
            <strong>{{ stats.importantChanges }}<em>条</em></strong>
          </div>
          <div class="stat-glow" />
        </article>

        <article class="stat-card stat-card--pending">
          <div class="stat-icon"><AppIcon name="Clock" /></div>
          <div class="stat-body">
            <span class="stat-label">待确认知识</span>
            <strong>{{ stats.pendingConfirm }}<em>条</em></strong>
          </div>
          <div class="stat-glow" />
        </article>
      </section>

      <!-- ===== 中间：我的订阅 ===== -->
      <section class="subscription-section">
        <div class="section-header">
          <h2>我的订阅</h2>
          <span class="section-desc">追踪你关注的知识主题变化</span>
        </div>
        <div class="sub-card-grid">
          <div
            v-for="sub in subscriptions"
            :key="sub.id"
            class="sub-card app-card"
            :class="'sub-card--' + sub.impactLevel"
          >
            <div class="sub-card-top">
              <h3 class="sub-name">{{ sub.name }}</h3>
              <el-tag :type="sub.statusType" size="small" effect="light" class="sub-status">{{ sub.status }}</el-tag>
            </div>
            <span class="sub-type">{{ sub.type }}</span>
            <p class="sub-desc">{{ sub.description }}</p>
            <div class="sub-impact">
              <span class="impact-dot" :class="'impact-dot--' + sub.impactLevel" />
              <span class="impact-text">{{ sub.impact }}</span>
            </div>
            <div class="sub-heat">
              <span class="heat-label">更新热度</span>
              <div class="heat-bar">
                <div class="heat-bar-fill" :style="{ width: sub.heat + '%' }" :class="'heat-bar--' + sub.impactLevel" />
              </div>
              <span class="heat-value">{{ heatLabel(sub.heat) }}</span>
            </div>
            <div class="sub-footer">
              <el-button type="primary" size="small" plain @click="openDetail(sub)">
                {{ sub.status === '正常' ? '查看详情' : '查看变化' }}
              </el-button>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== 底部：变化流 + 推荐 ===== -->
      <section class="feed-section">
        <!-- 知识变化流 -->
        <div class="feed-main">
          <div class="section-header">
            <h2>知识变化流</h2>
            <span class="section-desc">按时间线展示你关注的知识更新</span>
          </div>
          <div class="timeline">
            <div
              v-for="feed in feeds"
              :key="feed.id"
              class="timeline-item"
              :class="{ 'is-read': feed.isRead }"
            >
              <div class="tl-marker">
                <span class="tl-dot" :class="'tl-dot--' + feed.impactLevel" />
                <span class="tl-line" />
              </div>
              <div class="tl-content app-card">
                <div class="tl-top">
                  <span class="tl-time">{{ feed.time }}</span>
                  <el-tag
                    size="small"
                    effect="light"
                    :class="'impact-tag--' + feed.impactLevel"
                  >{{ impactLabel(feed.impactLevel) }}</el-tag>
                  <el-tag type="info" size="small" effect="plain">{{ feed.type }}</el-tag>
                </div>
                <h3 class="tl-title">{{ feed.title }}</h3>
                <div class="tl-ai-insight">
                  <AppIcon name="MagicStick" />
                  <span>{{ feed.aiInsight }}</span>
                </div>
                <div class="tl-related">
                  <span class="related-label">关联知识：</span>
                  <el-tag v-for="rk in feed.relatedKnowledge" :key="rk" size="small" type="info" effect="plain" round>{{ rk }}</el-tag>
                </div>
                <div class="tl-actions">
                  <el-button type="primary" link size="small" @click="openFeedDetail(feed)">查看详情</el-button>
                  <el-button
                    v-if="feed.actions.includes('标记已读')"
                    link
                    size="small"
                    @click="markAsRead(feed)"
                  >{{ feed.isRead ? '已读' : '标记已读' }}</el-button>
                  <el-button
                    v-if="feed.actions.includes('加入收藏')"
                    link
                    size="small"
                    @click="handleAction('已加入收藏')"
                  >加入收藏</el-button>
                  <el-button
                    v-if="feed.actions.includes('通知团队')"
                    link
                    size="small"
                    @click="handleAction('已通知团队成员')"
                  >通知团队</el-button>
                  <el-button
                    v-if="feed.actions.includes('生成摘要')"
                    link
                    size="small"
                    @click="handleAction('AI 摘要生成中…')"
                  >生成摘要</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI 推荐订阅 -->
        <aside class="feed-sidebar">
          <div class="sidebar-card app-card">
            <div class="sc-header">
              <AppIcon name="Promotion" />
              <h3>AI 推荐订阅</h3>
            </div>
            <p class="sc-desc">根据你的角色和最近访问记录推荐</p>
            <div class="rec-list">
              <div v-for="rec in recommendations" :key="rec.id" class="rec-item">
                <div class="rec-info">
                  <span class="rec-name">{{ rec.name }}</span>
                  <span class="rec-reason">{{ rec.reason }}</span>
                </div>
                <el-button
                  v-if="!rec.subscribed"
                  type="primary"
                  size="small"
                  round
                  @click="handleSubscribe(rec)"
                >一键订阅</el-button>
                <el-button
                  v-else
                  size="small"
                  round
                  disabled
                >已订阅</el-button>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <!-- ===== 变更详情抽屉 ===== -->
      <el-drawer v-model="drawerVisible" title="知识变更详情" size="560px" direction="rtl" :destroy-on-close="true">
        <template v-if="currentDetail">
          <!-- 变更概览 -->
          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="Document" /> 变更概览</h3>
            <div class="detail-overview">
              <h2 class="detail-title">{{ currentDetail.title }}</h2>
              <div class="detail-meta">
                <el-tag size="small" effect="plain">{{ currentDetail.time }}</el-tag>
                <el-tag type="info" size="small" effect="plain">{{ currentDetail.type }}</el-tag>
                <el-tag
                  size="small"
                  effect="light"
                  :class="'impact-tag--' + currentDetail.impactLevel"
                >{{ impactLabel(currentDetail.impactLevel) }}</el-tag>
              </div>
            </div>
          </div>

          <!-- 变更前后 -->
          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="Switch" /> 变更对比</h3>
            <div class="diff-block">
              <div class="diff-card diff-card--before">
                <span class="diff-label">变更前</span>
                <p>{{ currentDetail.beforeContent }}</p>
              </div>
              <div class="diff-card diff-card--after">
                <span class="diff-label">变更后</span>
                <p>{{ currentDetail.afterContent }}</p>
              </div>
            </div>
          </div>

          <!-- AI 总结 -->
          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="MagicStick" /> AI 总结</h3>
            <div class="ai-summary-block">
              <p>{{ currentDetail.aiSummary }}</p>
            </div>
          </div>

          <!-- 影响范围 -->
          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="Aim" /> 影响范围</h3>
            <div class="impact-tags">
              <el-tag v-for="scope in currentDetail.impactScope" :key="scope" effect="light" round>{{ scope }}</el-tag>
            </div>
          </div>

          <!-- 关联文档 -->
          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="Link" /> 关联文档</h3>
            <div class="related-docs">
              <div v-for="doc in currentDetail.relatedDocs" :key="doc" class="doc-link">
                <AppIcon name="Document" />
                <span>{{ doc }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="drawer-actions">
            <el-button type="primary" @click="handleDrawerAction('我已了解')">我已了解</el-button>
            <el-button @click="handleDrawerAction('已收藏')">收藏</el-button>
            <el-button @click="handleDrawerAction('已设置稍后提醒')">提醒我稍后看</el-button>
          </div>
        </template>
      </el-drawer>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  getSubscriptionStatsMock,
  getMySubscriptionsMock,
  getChangeFeedsMock,
  getRecommendSubscriptionsMock,
  getWeeklySummaryMock,
  type FeedItem,
  type Subscription,
  type RecommendSubscription
} from './mock'

// ===== 数据初始化 =====
const stats = ref(getSubscriptionStatsMock())
const subscriptions = ref(getMySubscriptionsMock())
const feeds = ref(getChangeFeedsMock())
const recommendations = ref(getRecommendSubscriptionsMock())
const weeklySummary = ref(getWeeklySummaryMock())

// ===== 每周摘要展开 =====
const summaryExpanded = ref(false)

// ===== 抽屉 =====
const drawerVisible = ref(false)
const currentDetail = ref<FeedItem | null>(null)

function openDetail(sub: Subscription) {
  // 找到该订阅关联的最新 feed，若无则构造一个概览
  const relatedFeed = feeds.value.find(f =>
    f.relatedKnowledge.some(rk => rk.includes(sub.name) || sub.name.includes(rk))
  )
  if (relatedFeed) {
    currentDetail.value = { ...relatedFeed }
  } else {
    // 为无直接 feed 的订阅（如考勤规则）构造默认详情
    currentDetail.value = {
      id: sub.id,
      time: '暂无更新',
      timeLabel: '',
      type: sub.type,
      title: sub.name + ' - ' + sub.status,
      aiInsight: sub.description,
      relatedKnowledge: [sub.name],
      impactLevel: sub.impactLevel,
      isRead: true,
      actions: [],
      beforeContent: '暂无变更记录',
      afterContent: sub.description,
      aiSummary: sub.description + '，当前状态稳定，暂无需特别关注。',
      impactScope: ['全体员工'],
      relatedDocs: ['《' + sub.name + '》']
    }
  }
  drawerVisible.value = true
}

function openFeedDetail(feed: FeedItem) {
  currentDetail.value = { ...feed }
  drawerVisible.value = true
}

// ===== 操作 =====
function markAsRead(feed: FeedItem) {
  feed.isRead = true
  ElMessage.success('已标记为已读')
}

function handleSubscribe(rec: RecommendSubscription) {
  rec.subscribed = true
  stats.value.subscribedTopics++
  ElMessage.success(`已订阅「${rec.name}」，后续变更将自动推送给你`)
}

function handleAction(msg: string) {
  ElMessage.success(msg)
}

function handleDrawerAction(msg: string) {
  ElMessage.success(msg)
  drawerVisible.value = false
}

// ===== 辅助函数 =====
function heatLabel(heat: number): string {
  if (heat >= 70) return '高'
  if (heat >= 40) return '中'
  return '低'
}

function impactLabel(level: string): string {
  const map: Record<string, string> = { high: '高影响', medium: '中影响', low: '低影响' }
  return map[level] || level
}
</script>

<style scoped lang="scss">
.subscription-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding-bottom: 4px;
  color: #172554;
}

/* ===== 页面头部 ===== */
.radar-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-radius: var(--app-card-radius);
  background: linear-gradient(135deg, #1e3a5f 0%, #312e81 50%, #6366f1 100%);
  color: #fff;
  box-shadow: 0 6px 20px rgba(49, 46, 129, 0.25);

  .header-copy {
    flex: 1;
    min-width: 0;

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
}

/* AI 每周摘要卡片 */
.weekly-summary-card {
  flex: 0 0 340px;
  max-width: 340px;
  padding: 14px 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    transform: translateY(-1px);
  }

  .ws-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;

    :deep(.app-icon) {
      width: 16px;
      height: 16px;
    }

    .ws-arrow {
      margin-left: auto;
      transition: transform 0.25s;
      width: 14px;
      height: 14px;
    }
  }

  &.is-expanded .ws-arrow {
    transform: rotate(180deg);
  }

  .ws-content {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    opacity: 0.88;
  }

  .ws-highlights {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  .ws-highlight {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 6px;
    opacity: 0.9;
  }

  .ws-footer {
    display: flex;
    gap: 14px;
    margin-top: 10px;
    font-size: 11px;
    opacity: 0.7;

    strong {
      font-weight: 700;
      color: #a5b4fc;
    }
  }
}

.ws-slide-enter-active,
.ws-slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.ws-slide-enter-from,
.ws-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.ws-slide-enter-to,
.ws-slide-leave-from {
  opacity: 1;
  max-height: 300px;
}

/* ===== 核心指标卡片 ===== */
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
  border: 1px solid transparent;
  border-radius: var(--app-card-radius);
  background: #fff;
  box-shadow: 0 4px 14px rgba(29, 78, 216, 0.05);
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(99, 102, 241, 0.15);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1);
    transform: translateY(-2px);

    .stat-glow {
      opacity: 1;
    }
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

      em {
        font-style: normal;
        font-size: 14px;
        font-weight: 600;
        margin-left: 2px;
        color: #94a3b8;
      }
    }
  }

  .stat-glow {
    position: absolute;
    right: -20px;
    top: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }
}

.stat-card--subscribed {
  .stat-icon { background: #eef2ff; color: #6366f1; }
  strong { color: #4338ca; }
  .stat-glow { background: radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent); }
}

.stat-card--updates {
  .stat-icon { background: #ecfdf5; color: #10b981; }
  strong { color: #059669; }
  .stat-glow { background: radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent); }
}

.stat-card--important {
  .stat-icon { background: #fff7ed; color: #f59e0b; }
  strong { color: #d97706; }
  .stat-glow { background: radial-gradient(circle, rgba(245, 158, 11, 0.1), transparent); }
}

.stat-card--pending {
  .stat-icon { background: #eff6ff; color: #3b82f6; }
  strong { color: #2563eb; }
  .stat-glow { background: radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent); }
}

/* ===== 我的订阅 ===== */
.subscription-section {
  .section-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 14px;

    h2 {
      margin: 0;
      font-size: 17px;
      font-weight: 800;
      color: #1f2937;
    }

    .section-desc {
      font-size: 13px;
      color: #94a3b8;
    }
  }
}

.sub-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.sub-card {
  position: relative;
  padding: 18px 20px;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(139, 92, 246, 0.02), transparent);
  }

  &:hover {
    border-color: rgba(99, 102, 241, 0.2);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.08);
    transform: translateY(-3px);

    &::after {
      opacity: 1;
    }
  }

  .sub-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .sub-name {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1f2937;
  }

  .sub-status {
    flex-shrink: 0;
  }

  .sub-type {
    display: inline-block;
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .sub-desc {
    margin: 0 0 12px;
    font-size: 13px;
    color: #475569;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sub-impact {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;

    .impact-text {
      font-size: 12px;
      color: #6b7280;
    }
  }

  .sub-heat {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;

    .heat-label {
      font-size: 11px;
      color: #94a3b8;
      flex-shrink: 0;
    }

    .heat-bar {
      flex: 1;
      height: 5px;
      border-radius: 3px;
      background: #f1f5f9;
      overflow: hidden;

      .heat-bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.6s ease;
      }

      .heat-bar--high { background: linear-gradient(90deg, #f97316, #ef4444); }
      .heat-bar--medium { background: linear-gradient(90deg, #6366f1, #8b5cf6); }
      .heat-bar--low { background: linear-gradient(90deg, #94a3b8, #cbd5e1); }
    }

    .heat-value {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      flex-shrink: 0;
      width: 16px;
      text-align: center;
    }
  }

  .sub-footer {
    display: flex;
    justify-content: flex-end;
  }
}

/* ===== 底部区域 ===== */
.feed-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
  min-width: 0;
}

/* 知识变化流 */
.feed-main {
  min-width: 0;

  .section-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 14px;

    h2 {
      margin: 0;
      font-size: 17px;
      font-weight: 800;
      color: #1f2937;
    }

    .section-desc {
      font-size: 13px;
      color: #94a3b8;
    }
  }
}

.timeline {
  position: relative;
  padding-left: 4px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  min-height: 100px;
  transition: opacity 0.3s;

  &.is-read {
    opacity: 0.55;

    .tl-content {
      background: #f8fafc;
    }
  }

  & + .timeline-item {
    margin-top: 4px;
  }
}

.tl-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 18px;
  padding-top: 18px;

  .tl-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    border: 2px solid #e0e7ff;

    &--high { background: linear-gradient(135deg, #f97316, #ef4444); border-color: #fed7aa; }
    &--medium { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-color: #c7d2fe; }
    &--low { background: #94a3b8; border-color: #e2e8f0; }
  }

  .tl-line {
    width: 2px;
    flex: 1;
    background: #e5e7eb;
    margin-top: 6px;
  }
}

.tl-content {
  flex: 1;
  padding: 16px 18px;
  min-width: 0;
  transition: background 0.2s;

  .tl-top {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 8px;

    .tl-time {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }
  }

  .tl-title {
    margin: 0 0 10px;
    font-size: 15px;
    font-weight: 700;
    color: #1f2937;
  }

  .tl-ai-insight {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f0f4ff, #f8faff);
    border-left: 3px solid #6366f1;
    margin-bottom: 12px;

    :deep(.app-icon) {
      width: 16px;
      height: 16px;
      color: #6366f1;
      flex-shrink: 0;
      margin-top: 2px;
    }

    span {
      font-size: 13px;
      color: #475569;
      line-height: 1.6;
    }
  }

  .tl-related {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 10px;

    .related-label {
      font-size: 12px;
      color: #94a3b8;
    }
  }

  .tl-actions {
    display: flex;
    gap: 4px;
  }
}

/* 影响等级标签 */
.impact-tag--high {
  background: linear-gradient(135deg, #fff7ed, #ffedd5) !important;
  color: #ea580c !important;
  border-color: #fed7aa !important;
  font-weight: 600;
}

.impact-tag--medium {
  background: linear-gradient(135deg, #eef2ff, #e0e7ff) !important;
  color: #4f46e5 !important;
  border-color: #c7d2fe !important;
  font-weight: 600;
}

.impact-tag--low {
  background: #f1f5f9 !important;
  color: #64748b !important;
  border-color: #e2e8f0 !important;
}

/* 影响等级点 */
.impact-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;

  &--high { background: linear-gradient(135deg, #f97316, #ef4444); }
  &--medium { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
  &--low { background: #94a3b8; }
}

/* ===== 右侧推荐 ===== */
.feed-sidebar {
  min-width: 0;
}

.sidebar-card {
  padding: 16px 18px;
  position: sticky;
  top: 16px;

  .sc-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;

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

  .sc-desc {
    margin: 0 0 14px;
    font-size: 12px;
    color: #94a3b8;
  }
}

.rec-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rec-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f8faff;
  border: 1px solid #eef2ff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #c7d2fe;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.06);
  }

  .rec-info {
    min-width: 0;
    flex: 1;

    .rec-name {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #1f2937;
    }

    .rec-reason {
      display: block;
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }
  }
}

/* ===== 抽屉内容 ===== */
.drawer-section {
  margin-bottom: 22px;

  .drawer-section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
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

.detail-overview {
  .detail-title {
    margin: 0 0 8px;
    font-size: 17px;
    font-weight: 700;
    color: #1f2937;
  }

  .detail-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
}

.diff-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.diff-card {
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #e5eaf3;

  .diff-label {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #475569;
    line-height: 1.7;
  }

  &--before {
    background: #fef2f2;
    border-color: #fecaca;

    .diff-label {
      background: #fee2e2;
      color: #dc2626;
    }
  }

  &--after {
    background: #ecfdf5;
    border-color: #a7f3d0;

    .diff-label {
      background: #d1fae5;
      color: #059669;
    }
  }
}

.ai-summary-block {
  padding: 14px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f0f4ff, #f8faff);
  border-left: 3px solid #6366f1;

  p {
    margin: 0;
    font-size: 13px;
    color: #475569;
    line-height: 1.7;
  }
}

.impact-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.related-docs {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .doc-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    background: #f8faff;
    border: 1px solid #eef2ff;
    font-size: 13px;
    color: #4338ca;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #eef2ff;
    }

    :deep(.app-icon) {
      width: 16px;
      height: 16px;
      color: #6366f1;
    }
  }
}

.drawer-actions {
  display: flex;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

/* ===== 响应式 ===== */
@media (max-width: 1100px) {
  .radar-header {
    flex-direction: column;

    .weekly-summary-card {
      flex: none;
      max-width: 100%;
    }
  }

  .feed-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .metric-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .sub-card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
