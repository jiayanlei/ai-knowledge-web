<template>
  <PageContainer>
    <div class="ws-page">
      <!-- =============== 左侧：知识星图导航 =============== -->
      <aside class="ws-left">
        <div class="wl-header">
          <div class="wlh-logo"><AppIcon name="Promotion" /></div>
          <div class="wlh-info">
            <strong>知识星图</strong>
            <span>Knowledge Navigator</span>
          </div>
        </div>

        <!-- 搜索目录 -->
        <div class="wl-search">
          <el-input v-model="navKeyword" clearable placeholder="搜索知识分类..." size="small">
            <template #prefix><Search /></template>
          </el-input>
        </div>

        <!-- 今日常问 -->
        <div class="wl-section">
          <div class="wls-title"><AppIcon name="TrendCharts" /><span>今日常问</span></div>
          <div class="wl-faq-list">
            <button v-for="faq in todayFAQs" :key="faq.id" class="wl-faq-item" @click="fillQuestion(faq.question)">
              <span class="faq-text">{{ faq.question }}</span>
              <span class="faq-meta">
                <span class="faq-count">{{ faq.count }}次</span>
                <span class="faq-trend" :class="faq.trend">
                  <template v-if="faq.trend === 'up'">↑</template>
                  <template v-else-if="faq.trend === 'down'">↓</template>
                  <template v-else>→</template>
                </span>
              </span>
            </button>
          </div>
        </div>

        <!-- 知识分类 -->
        <div class="wl-section wl-section--grow">
          <div class="wls-title"><AppIcon name="Grid" /><span>知识分类</span></div>
          <div class="wl-cat-list">
            <button
              v-for="cat in filteredCategories"
              :key="cat.id"
              class="wl-cat-item"
              :class="{ active: activeCatId === cat.id }"
              @click="activeCatId = cat.id"
            >
              <span class="cat-icon"><AppIcon :name="cat.icon" /></span>
              <span class="cat-info">
                <strong>{{ cat.name }}</strong>
                <span class="cat-count">{{ cat.count }} 条知识</span>
              </span>
              <span class="cat-status" :style="{ color: cat.statusColor, background: cat.statusColor + '18' }">{{ cat.status }}</span>
            </button>
          </div>
        </div>

        <!-- 我的知识路径 -->
        <div class="wl-section">
          <div class="wls-title"><AppIcon name="Compass" /><span>我的知识路径</span></div>
          <div class="wl-user-badge">
            <el-avatar :size="28" class="wl-avatar">{{ newUserGuide.name[0] }}</el-avatar>
            <div class="wl-user-info">
              <strong>{{ newUserGuide.name }}</strong>
              <span>{{ newUserGuide.department }}</span>
            </div>
          </div>
          <div class="wl-path-list">
            <div v-for="step in knowledgePathSteps" :key="step.id" class="wl-path-item" :class="{ done: step.done }" @click="fillQuestion(step.name)">
              <span class="path-dot">{{ step.done ? '✓' : step.id }}</span>
              <span>{{ step.name }}</span>
            </div>
          </div>
        </div>

        <!-- 知识胶囊 -->
        <div class="wl-capsules">
          <button
            v-for="cap in knowledgeCapsules"
            :key="cap.label"
            class="wl-capsule"
            :style="{ color: cap.color, background: cap.color + '14' }"
            @click="fillQuestion(cap.label)"
          >#{{ cap.label }}</button>
        </div>
      </aside>

      <!-- =============== 中间：AI 推理问答工作区 =============== -->
      <section class="ws-center">
        <!-- 顶部 AI 状态栏 -->
        <div class="wc-status-bar">
          <div class="wcs-left">
            <span class="wcs-dot" />
            <span>企业 AI 助手已接入 <strong>{{ statusBarData.totalDocs.toLocaleString() }}</strong> 篇文档</span>
            <span class="wcs-sep">·</span>
            <span>今日更新 <strong>{{ statusBarData.todayUpdated }}</strong> 条</span>
            <span class="wcs-sep">·</span>
            <span>知识可信度 <strong>{{ statusBarData.confidence }}%</strong></span>
          </div>
          <div class="wcs-right">
            <span class="wcs-badge"><AppIcon name="Lock" />安全可问答</span>
            <span class="wcs-badge"><AppIcon name="Connection" />引用可追溯</span>
            <span class="wcs-badge"><AppIcon name="CircleCheckFilled" />权限已校验</span>
          </div>
        </div>

        <!-- 消息流 -->
        <div ref="messageListRef" class="wc-messages">
          <!-- 新人引导卡 -->
          <div v-if="showNewUserGuide" class="wc-newbie">
            <div class="wcn-inner">
              <RobotAvatar size="medium" />
              <div class="wcn-text">
                <strong>你好，{{ newUserGuide.name }}，检测到你是新员工。</strong>
                <p>推荐先了解以下知识，帮助你快速融入团队：</p>
              </div>
              <div class="wcn-list">
                <button v-for="(rec, i) in newUserGuide.recommendations" :key="i" @click="fillQuestion(rec)">
                  <span class="wcn-num">{{ i + 1 }}</span>{{ rec }}
                </button>
              </div>
            </div>
          </div>

          <AiMessageBubble
            v-for="(card, index) in messages"
            :key="`msg-${index}`"
            :message="card"
            :user-name="userName"
            :is-streaming="streamingMessageId === card.id"
            @regenerate="handleRegenerate"
            @feedback="handleFeedback"
            @next-action="handleNextAction"
            @toggle-details="handleToggleDetails"
          />

          <!-- AI 思考状态 -->
          <Transition name="thinking-fade" :duration="360">
            <div v-if="chatStatus === 'thinking'" class="wc-thinking-minimal">
              <span class="wct-dot" />
              <span class="wct-text">正在理解问题，并检索企业知识库...</span>
            </div>
          </Transition>
        </div>

        <!-- 底部输入区 -->
        <div class="wc-input-area">
          <!-- 快捷场景 -->
          <div class="wia-scenes">
            <button v-for="scene in quickScenes" :key="scene" :disabled="isProcessing" @click="fillQuestion(scene)">{{ scene }}</button>
          </div>
          <AiChatInput
            v-model="inputText"
            :is-answering="isAnswering"
            :reasoning-mode="reasoningMode"
            :reasoning-label="reasoningLabel"
            @send="handleSend"
            @stop="handleStopGeneration"
            @mode-change="handleModeChange"
            @status-change="handleInputStatusChange"
          />
        </div>
      </section>

      <!-- =============== 右侧：证据与行动面板 =============== -->
      <aside class="ws-right">
        <!-- 知识雷达 -->
        <div class="wr-section wr-radar">
          <div class="wrs-title"><AppIcon name="Aim" /><span>知识雷达</span></div>
          <div class="radar-grid">
            <div v-for="stat in radarStats" :key="stat.label" class="radar-item">
              <span class="ri-icon" :style="{ color: stat.color, background: stat.color + '14' }">
                <AppIcon :name="stat.icon" />
              </span>
              <div class="ri-info">
                <strong>{{ stat.value }}</strong>
                <span>{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 引用证据链 -->
        <div
          class="wr-section wr-evidence"
          :class="{
            'wr-evidence--waiting': isAnswering && !evidenceSyncing,
            'wr-evidence--syncing': evidenceSyncing
          }"
        >
          <div class="wrs-title"><AppIcon name="Link" /><span>引用证据链</span></div>
          <div class="ev-list">
            <div v-for="ev in evidenceChain" :key="ev.id" class="ev-card">
              <div class="ev-top">
                <span class="ev-type" :class="ev.type.toLowerCase()">{{ ev.type }}</span>
                <strong>{{ ev.title }}</strong>
              </div>
              <p class="ev-section">命中段落：{{ ev.section }}</p>
              <div class="ev-bottom">
                <span class="ev-conf">
                  <span class="ev-bar"><span class="ev-fill" :style="{ width: ev.confidence + '%' }" /></span>
                  {{ ev.confidence }}%
                </span>
                <el-button link type="primary" size="small">查看原文</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- AI 快捷行动 -->
        <div class="wr-section wr-actions">
          <div class="wrs-title"><AppIcon name="MagicStick" /><span>AI 快捷行动</span></div>
          <div class="qa-grid">
            <button v-for="act in quickActions" :key="act.title" class="qa-btn" @click="handleQuickAction(act.title)">
              <span class="qa-icon"><AppIcon :name="act.icon" /></span>
              <strong>{{ act.title }}</strong>
              <span class="qa-desc">{{ act.desc }}</span>
            </button>
          </div>
        </div>

        <!-- 相关文档 -->
        <div class="wr-section wr-related">
          <div class="wrs-title"><AppIcon name="FolderOpened" /><span>相关文档</span></div>
          <div class="rd-list">
            <div v-for="doc in relatedDocs" :key="doc.id" class="rd-item">
              <span class="rd-type" :class="doc.type.toLowerCase()">{{ doc.type }}</span>
              <div class="rd-info">
                <strong>{{ doc.title }}</strong>
                <span>{{ doc.category }} · {{ doc.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import AppIcon from '@/components/AppIcon/index.vue'
import RobotAvatar from '@/components/RobotAvatar/index.vue'
import PageContainer from '@/components/PageContainer/index.vue'
import AiChatInput from './components/AiChatInput.vue'
import AiMessageBubble from './components/AiMessageBubble.vue'
import {
  chatHistory,
  evidenceChain,
  generateAIAnswer,
  knowledgeCapsules,
  knowledgeCategories,
  knowledgePathSteps,
  newUserGuide,
  quickActions,
  quickScenes,
  radarStats,
  relatedDocs,
  statusBarData,
  todayFAQs
} from './mock'
import type { ChatCard, ChatSendPayload, ChatStatus, ReasoningMode } from './mock'

// ---------- 状态 ----------
const userName = '张伟'
const navKeyword = ref('')
const inputText = ref('')
const reasoningMode = ref<ReasoningMode>('fast')
const reasoningLabel = ref('快速回答')
const activeCatId = ref(knowledgeCategories[0].id)
const messages = ref<ChatCard[]>([...chatHistory])
const messageListRef = ref<HTMLDivElement>()
const showNewUserGuide = ref(true)
const chatStatus = ref<ChatStatus>('idle')
const evidenceSyncing = ref(false)
const streamingMessageId = ref<number | null>(null)
let evidenceTimer: number | undefined
let thinkingTimer: number | undefined
let generatingTimer: number | undefined
let typeTimer: number | undefined

// ---------- 计算属性 ----------
const isAnswering = computed(() => chatStatus.value === 'thinking' || chatStatus.value === 'generating')
const isProcessing = computed(() => isAnswering.value || chatStatus.value === 'recording' || chatStatus.value === 'uploading')

const filteredCategories = computed(() => {
  const kw = navKeyword.value.trim()
  if (!kw) return knowledgeCategories
  return knowledgeCategories.filter((c) => c.name.includes(kw))
})

// ---------- 方法 ----------
function fillQuestion(q: string) {
  if (isProcessing.value) return
  inputText.value = q
  showNewUserGuide.value = false
}

function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

function getThinkingDelay() {
  return 1000 + Math.random() * 1500
}

function getTimeText() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function triggerEvidenceSync() {
  if (evidenceTimer) window.clearTimeout(evidenceTimer)
  evidenceSyncing.value = true
  evidenceTimer = window.setTimeout(() => {
    evidenceSyncing.value = false
  }, 900)
}

function clearAnswerTimers() {
  if (thinkingTimer) {
    window.clearTimeout(thinkingTimer)
    thinkingTimer = undefined
  }

  if (generatingTimer) {
    window.clearTimeout(generatingTimer)
    generatingTimer = undefined
  }

  if (typeTimer) {
    window.clearTimeout(typeTimer)
    typeTimer = undefined
  }
}

function handleInputStatusChange(status: ChatStatus) {
  if (isAnswering.value && status !== 'thinking' && status !== 'generating') return
  chatStatus.value = status
}

function handleModeChange(mode: ReasoningMode, label: string) {
  reasoningMode.value = mode
  reasoningLabel.value = label
}

function handleSend(payload: ChatSendPayload) {
  if (chatStatus.value === 'uploading') {
    ElMessage.warning('图片正在上传，请稍后再发送')
    return
  }

  if (chatStatus.value === 'error') {
    ElMessage.warning('图片上传失败，请重新上传')
    return
  }

  showNewUserGuide.value = false
  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: payload.content,
    images: payload.images,
    reasoningMode: payload.reasoningMode,
    time: getTimeText()
  })
  startStreamingAnswer(payload)
}

function startStreamingAnswer(payload: ChatSendPayload) {
  clearAnswerTimers()
  stopStreaming()
  chatStatus.value = 'thinking'
  scrollToBottom()

  thinkingTimer = window.setTimeout(() => {
    chatStatus.value = 'generating'

    const answer = generateAIAnswer(payload.content, {
      reasoningMode: payload.reasoningMode,
      images: payload.images
    })
    const fullText = answer.content
    answer.content = ''
    messages.value.push(answer)
    streamingMessageId.value = answer.id
    scrollToBottom()

    typeMessage(answer.id, fullText)
  }, 800 + Math.random() * 700)
}

function typeMessage(messageId: number, fullText: string) {
  let i = 0
  const msg = messages.value.find((m) => m.id === messageId)
  if (!msg) {
    streamingMessageId.value = null
    chatStatus.value = 'idle'
    return
  }

  function tick() {
    if (streamingMessageId.value !== messageId) return
    if (i >= fullText.length) {
      msg.content = fullText
      streamingMessageId.value = null
      chatStatus.value = 'idle'
      clearAnswerTimers()
      triggerEvidenceSync()
      scrollToBottom()
      return
    }

    const char = fullText[i]
    msg.content = fullText.slice(0, i + 1)
    i++

    let delay = 18 + Math.random() * 22

    if ('。！？；'.includes(char)) delay += 120 + Math.random() * 80
    else if (char === '\n') delay += 100 + Math.random() * 60
    else if (',，、：'.includes(char)) delay += 30 + Math.random() * 30

    typeTimer = window.setTimeout(tick, delay)
    if (i % 8 === 0) scrollToBottom()
  }

  tick()
}

function stopStreaming() {
  if (typeTimer) {
    window.clearTimeout(typeTimer)
    typeTimer = undefined
  }
  if (streamingMessageId.value !== null) {
    const msg = messages.value.find((m) => m.id === streamingMessageId.value)
    if (msg && msg.content) {
      // Keep the partial content as-is
    }
    streamingMessageId.value = null
  }
}

function handleStopGeneration() {
  if (!isAnswering.value) return
  clearAnswerTimers()
  stopStreaming()
  chatStatus.value = 'idle'
  ElMessage.info('已停止生成')
}

function handleRegenerate(messageId: number) {
  if (isProcessing.value) return

  const answerIndex = messages.value.findIndex((message) => message.id === messageId)
  if (answerIndex <= 0) return

  const lastUserMessage = [...messages.value.slice(0, answerIndex)].reverse().find((message) => message.role === 'user')
  if (!lastUserMessage) return

  messages.value.splice(answerIndex, 1)
  startStreamingAnswer({
    content: lastUserMessage.content,
    images: lastUserMessage.images || [],
    reasoningMode: lastUserMessage.reasoningMode || reasoningMode.value
  })
}

function handleFeedback(messageId: number, value: 'like' | 'dislike') {
  const message = messages.value.find((item) => item.id === messageId)
  if (!message) return
  message.feedback = message.feedback === value ? undefined : value
}

function handleNextAction(label: string) {
  if (label === '查看原文') {
    ElMessage.info('引用来源已在回答下方展开查看')
    return
  }

  ElMessage.info(`正在执行：${label}`)
}

function handleToggleDetails(messageId: number) {
  // Details toggle is handled internally by AiMessageBubble
  // This emit is for potential parent-level tracking if needed
}

function handleQuickAction(title: string) {
  ElMessage.info(`正在执行快捷行动：${title}`)
}

watch(() => messages.value.length, scrollToBottom, { immediate: true })
</script>

<style scoped lang="scss">
// ============ 全局 ============
.ws-page {
  position: relative;
  display: grid;
  grid-template-columns: 20% minmax(0, 56fr) 24%;
  gap: 12px;
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: 1px;
  border-radius: 18px;
  background:
    linear-gradient(rgba(37, 99, 235, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.035) 1px, transparent 1px),
    linear-gradient(135deg, #f6f9ff 0%, #edf5ff 48%, #f8fbff 100%);
  background-size: 28px 28px, 28px 28px, auto;
  overflow: hidden;
}

// ============ 左侧：知识星图导航 ============
.ws-left {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.wl-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;

  .wlh-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    color: #fff;
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  }

  .wlh-info {
    display: flex;
    flex-direction: column;

    strong { color: #0f172a; font-size: 15px; font-weight: 800; }
    span { color: #94a3b8; font-size: 11px; margin-top: 1px; }
  }
}

.wl-search {
  margin-bottom: 12px;

  :deep(.el-input__wrapper) {
    border-radius: 10px;
    box-shadow: 0 0 0 1px #e2e8f0 inset;
  }
}

.wl-section {
  margin-bottom: 10px;
}

.wl-section--grow {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-bottom: 0;
}

.wls-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0;

  :deep(svg) { width: 14px; }
}

// 今日常问
.wl-faq-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wl-faq-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-radius: 8px;
  color: #334155;
  font-size: 13px;
  text-align: left;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { background: #f0f7ff; color: #2563eb; }
}

.faq-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.faq-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 0 0 auto;
}

.faq-count {
  font-size: 11px;
  color: #94a3b8;
}

.faq-trend {
  font-size: 12px;
  font-weight: 700;

  &.up { color: #ef4444; }
  &.down { color: #22c55e; }
  &.stable { color: #94a3b8; }
}

// 知识分类
.wl-cat-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.wl-cat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  transition: all 0.18s;

  &:hover { background: #f0f7ff; border-color: #dbeafe; }
  &.active { background: #eff6ff; border-color: #93c5fd; }
}

.cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: #2563eb;
  background: #eff6ff;
  flex: 0 0 auto;

  :deep(svg) { width: 16px; }
}

.wl-cat-item.active .cat-icon {
  color: #fff;
  background: #2563eb;
}

.cat-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  strong {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    text-align: left;
  }

  .cat-count {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 1px;
  }
}

.cat-status {
  flex: 0 0 auto;
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
}

// 我的知识路径
.wl-user-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f8fafc;
}

.wl-avatar {
  flex: 0 0 auto;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  font-size: 13px;
}

.wl-user-info {
  display: flex;
  flex-direction: column;

  strong { font-size: 13px; color: #1e293b; }
  span { font-size: 11px; color: #94a3b8; }
}

.wl-path-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wl-path-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  color: #64748b;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { background: #f0f7ff; color: #2563eb; }

  &.done {
    color: #16a34a;
    background: #f0fdf4;

    .path-dot {
      color: #fff;
      background: #22c55e;
    }
  }
}

.path-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  background: #e2e8f0;
  flex: 0 0 auto;
}

// 知识胶囊
.wl-capsules {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.wl-capsule {
  padding: 4px 10px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { filter: brightness(0.92); }
}

// ============ 中间：AI 推理问答区 ============
.ws-center {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

// 状态栏
.wc-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  padding: 10px 18px;
  background: linear-gradient(90deg, #f0f7ff, #f8fafc);
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  color: #475569;
}

.wcs-left {
  display: flex;
  align-items: center;
  gap: 4px;

  strong { color: #2563eb; font-weight: 700; }
}

.wcs-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
  margin-right: 4px;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.wcs-sep {
  color: #cbd5e1;
  margin: 0 4px;
}

.wcs-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wcs-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;

  :deep(svg) { width: 12px; }
}

// 消息流
.wc-messages {
  flex: 1;
  min-height: 0;
  padding: 18px 20px;
  overflow-y: auto;
  background:
    radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(124, 58, 237, 0.02) 0%, transparent 50%),
    #fdfdff;
}

// 新人引导
.wc-newbie {
  margin-bottom: 20px;
}

.wcn-inner {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  column-gap: 12px;
  row-gap: 12px;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid #dbeafe;
  background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%);
}

.wcn-text {
  min-width: 0;

  strong {
    display: block;
    color: #1e293b;
    font-size: 14px;
  }

  p {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 13px;
  }
}

.wcn-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: 2;
}

.wcn-list button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;

  &:hover {
    border-color: #93c5fd;
    color: #2563eb;
    background: #f0f7ff;
    transform: translateX(4px);
  }
}

.wcn-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  flex: 0 0 auto;
}

// 用户消息
.wc-msg { margin-bottom: 18px; }

.wc-msg--ai {
  animation: answer-card-enter 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.wc-msg--thinking {
  display: flex;
  align-items: flex-start;
}

.thinking-fade-enter-active,
.thinking-fade-leave-active {
  transition:
    opacity 0.36s ease,
    transform 0.36s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.36s ease;
}

.thinking-fade-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  filter: blur(4px);
}

.thinking-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.94);
  filter: blur(6px);
}

@keyframes answer-card-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
    filter: blur(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.wc-msg--user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .wc-user-row {
    flex-direction: row-reverse;
  }

  .wc-user-bubble {
    border-radius: 14px 4px 14px 14px;
  }
}

.wc-user-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 78%;
}

.wc-user-avatar {
  flex: 0 0 auto;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.2);
}

.wc-user-bubble {
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  border-radius: 4px 14px 14px 14px;
  color: #1e293b;
  background: linear-gradient(135deg, #dbeafe, #e0e7ff);
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);

  p {
    margin: 0;
    white-space: pre-line;
  }

  time {
    display: block;
    margin-top: 6px;
    font-size: 11px;
    color: #94a3b8;
    text-align: right;
  }
}

// AI 回答卡片
.wc-ai-card {
  max-width: 85%;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  .ai-label {
    font-size: 13px;
    font-weight: 700;
    color: #2563eb;
  }

  time {
    margin-left: auto;
    font-size: 11px;
    color: #94a3b8;
  }
}

.ai-intro {
  margin: 0 0 14px;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

// 结论
.ai-conclusion {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 10px;
  margin-bottom: 12px;
  padding: 12px 14px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff, #f8fbff);

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    border-radius: 7px;
    color: #fff;
    background: #2563eb;
    font-size: 12px;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: #1e293b;
    font-size: 13px;
    line-height: 1.6;
  }
}

// 推理依据
.ai-reasoning {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding: 9px 12px;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
}

.air-label {
  flex: 0 0 auto;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
}

.air-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;

  span {
    padding: 3px 8px;
    border-radius: 7px;
    color: #2563eb;
    background: #eff6ff;
    font-size: 11px;
    font-weight: 600;
  }
}

// 分步骤
.ai-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.ai-step {
  display: flex;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  transition: all 0.15s;

  &:hover { border-color: #dbeafe; background: #f0f7ff; }
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: #2563eb;
  background: #eff6ff;
  font-size: 12px;
  font-weight: 800;
  flex: 0 0 auto;
}

.step-body {
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    color: #1e293b;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 3px;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 12px;
    line-height: 1.55;
  }
}

// 流程图预览
.ai-flow {
  margin: 0 0 14px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e0f2fe;
  background: linear-gradient(135deg, #f0f9ff, #f8fafc);
}

.aif-title {
  display: block;
  margin-bottom: 10px;
  color: #0369a1;
  font-size: 12px;
  font-weight: 800;
}

.aif-track {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.aif-node {
  padding: 5px 9px;
  border-radius: 8px;
  color: #0f172a;
  background: #fff;
  border: 1px solid #bae6fd;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.08);
}

.aif-arrow {
  color: #38bdf8;
  font-size: 13px;
  font-weight: 800;
}

// 来源 & 可信度
.ai-footer {
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  margin-bottom: 12px;
}

.ai-source {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
  margin-bottom: 8px;

  :deep(svg) { width: 14px; color: #94a3b8; }
}

.ai-meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.ai-confidence {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;

  :deep(svg) { width: 13px; }
}

.ai-doc-count {
  font-size: 12px;
  color: #64748b;
}

.ai-perm {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #0ea5e9;

  :deep(svg) { width: 12px; }
}

// 下一步建议
.ai-next {
  padding-top: 12px;
  border-top: 1px dashed #e2e8f0;
}

.ain-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 600;
}

.ain-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ain-btns button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  cursor: pointer;
  transition: all 0.15s;
  opacity: 0;
  animation: next-action-pop 0.34s cubic-bezier(0.22, 1, 0.36, 1) forwards;

  :deep(svg) { width: 14px; }

  &:hover {
    background: #2563eb;
    color: #fff;
    border-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
  }
}

@keyframes next-action-pop {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 深度检索动画
.wc-deep-search {
  margin-bottom: 18px;
}

.ds-card {
  padding: 16px 20px;
  border-radius: 14px;
  border: 1px solid #c4b5fd;
  background: linear-gradient(135deg, #f5f3ff, #ede9fe);
}

.ds-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #7c3aed;
}

.ds-spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid #e9d5ff;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ds-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ds-step {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #94a3b8;
  transition: all 0.3s;

  &.done { color: #16a34a; }
  &.active { color: #7c3aed; font-weight: 600; }
}

.ds-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  flex: 0 0 auto;
  background: #e2e8f0;
  color: #94a3b8;

  .ds-step.done & {
    background: #22c55e;
    color: #fff;
  }

  .ds-step.active & {
    background: #7c3aed;
  }
}

.ds-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  animation: ds-bounce 1s infinite;
}

@keyframes ds-bounce {
  0%, 100% { transform: scale(0.6); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}

// 输入区
.wc-input-area {
  flex: 0 0 auto;
  padding: 12px 18px 16px;
  border-top: 1px solid #f1f5f9;
  background: #fff;
}

.wia-scenes {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  overflow-x: auto;
  padding-bottom: 2px;

  button {
    flex: 0 0 auto;
    padding: 5px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 12px;
    color: #475569;
    background: #f8fafc;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;

    &:hover {
      border-color: #93c5fd;
      color: #2563eb;
      background: #eff6ff;
    }

    &:disabled {
      color: #94a3b8;
      background: #f8fafc;
      cursor: not-allowed;
      opacity: 0.68;
    }
  }
}

.wia-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wia-input-wrap :deep(.el-textarea__inner) {
  min-height: 44px !important;
  border-radius: 12px;
  box-shadow: 0 0 0 1.5px #e2e8f0 inset;
  padding: 10px 14px;
  font-size: 14px;

  &:focus {
    box-shadow: 0 0 0 2px #93c5fd inset;
  }
}

.wia-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wia-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.deep-active {
  border-color: #7c3aed !important;
  color: #7c3aed !important;
  background: #f5f3ff !important;
}

// ============ 右侧：证据与行动面板 ============
.ws-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  padding-right: 2px;

  .wr-section {
    padding: 16px;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    backdrop-filter: blur(10px);
  }
}

.wrs-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;

  :deep(svg) { width: 16px; color: #2563eb; }
}

// 知识雷达
.radar-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.radar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
}

.ri-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex: 0 0 auto;

  :deep(svg) { width: 16px; }
}

.ri-info {
  display: flex;
  flex-direction: column;

  strong {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
  }

  span {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 1px;
  }
}

// 引用证据链
.wr-evidence {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.wr-evidence--waiting {
  opacity: 0.44;
  transform: translateY(4px);
  filter: saturate(0.86);
}

.wr-evidence--syncing {
  position: relative;
  border-color: #93c5fd !important;
  box-shadow:
    0 10px 26px rgba(37, 99, 235, 0.12),
    0 0 0 1px rgba(96, 165, 250, 0.18) !important;
  animation: evidence-panel-pulse 0.9s ease both;
}

.wr-evidence--syncing::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(105deg, transparent 0%, rgba(96, 165, 250, 0.18) 42%, rgba(255, 255, 255, 0.72) 50%, rgba(96, 165, 250, 0.16) 58%, transparent 100%);
  transform: translateX(-120%);
  animation: evidence-scan 0.84s ease-in-out both;
  pointer-events: none;
}

.ev-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ev-card {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  background: #f8fafc;
  transition: all 0.15s;

  &:hover {
    border-color: #dbeafe;
    background: #f0f7ff;
  }
}

.wr-evidence--syncing .ev-card {
  animation: evidence-card-in 0.42s ease both;
}

.wr-evidence--syncing .ev-card:nth-child(2) { animation-delay: 0.08s; }
.wr-evidence--syncing .ev-card:nth-child(3) { animation-delay: 0.16s; }
.wr-evidence--syncing .ev-card:nth-child(4) { animation-delay: 0.24s; }

@keyframes evidence-panel-pulse {
  0% {
    opacity: 0.58;
    transform: translateY(6px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes evidence-scan {
  from { transform: translateX(-120%); opacity: 0; }
  35%, 70% { opacity: 1; }
  to { transform: translateX(120%); opacity: 0; }
}

@keyframes evidence-card-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ev-top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;

  strong {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.4;
  }
}

.ev-type {
  flex: 0 0 auto;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0;

  &.docx { color: #2563eb; background: #eff6ff; }
  &.pdf { color: #dc2626; background: #fef2f2; }
  &.xlsx { color: #16a34a; background: #f0fdf4; }
  &.md { color: #64748b; background: #f1f5f9; }
}

.ev-section {
  margin: 0 0 8px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

.ev-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ev-conf {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #16a34a;
}

.ev-bar {
  display: inline-block;
  width: 48px;
  height: 5px;
  border-radius: 3px;
  background: #e2e8f0;
  overflow: hidden;
}

.ev-fill {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  transition: width 0.3s;
}

// AI 快捷行动
.qa-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  // 最后一个按钮如果是奇数个，跨两列
  .qa-btn:last-child:nth-child(odd) {
    grid-column: span 2;
  }
}

.qa-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: #93c5fd;
    background: #eff6ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
  }
}

.qa-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #2563eb;
  background: #eff6ff;

  :deep(svg) { width: 16px; }
}

.qa-btn strong {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

.qa-desc {
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
}

// 相关文档
.rd-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rd-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  background: #f8fafc;
  transition: all 0.15s;

  &:hover {
    border-color: #dbeafe;
    background: #f0f7ff;
  }
}

.rd-type {
  flex: 0 0 auto;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0;
  margin-top: 2px;

  &.pdf { color: #dc2626; background: #fef2f2; }
  &.docx { color: #2563eb; background: #eff6ff; }
  &.vsdx { color: #f59e0b; background: #fffbeb; }
}

.rd-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  strong {
    font-size: 12px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
  }
}

// ============ 响应式 ============
@media (max-width: 1280px) {
  .ws-page {
    grid-template-columns: 220px minmax(0, 1fr) 260px;
  }

  .wcs-right { display: none; }
}

@media (max-width: 900px) {
  .ws-page {
    grid-template-columns: minmax(0, 1fr);
  }

  .ws-left { display: none; }
}
</style>
