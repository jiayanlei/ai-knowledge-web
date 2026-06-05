<template>
  <div class="mb-wrapper" :class="`mb-wrapper--${message.role}`">
    <!-- ============ 用户消息 ============ -->
    <template v-if="message.role === 'user'">
      <div class="mb-user-row">
        <el-avatar :size="34" class="mb-user-avatar">{{ userName.charAt(0) }}</el-avatar>
        <div class="mb-user-bubble">
          <div v-if="message.images?.length" class="mb-user-images">
            <img
              v-for="img in message.images"
              :key="img.id"
              :src="img.url"
              :alt="img.name"
              @click="previewImage(img.url)"
            />
          </div>
          <p>{{ message.content }}</p>
          <time>{{ message.time }}</time>
        </div>
      </div>
    </template>

    <!-- ============ AI 消息 ============ -->
    <template v-else>
      <article
        class="mb-ai-card"
        :class="{
          'is-streaming': isStreaming,
          'is-done': isDone
        }"
      >
        <!-- 顶部身份栏 -->
        <header class="mb-header">
          <div class="mb-header-left">
            <RobotAvatar size="small" />
            <strong>AI 知识助手</strong>
            <span v-if="isStreaming" class="mb-status streaming">
              <span class="status-dot" />正在生成
            </span>
            <span v-else-if="isDone" class="mb-status done">
              <span class="status-dot" />引用可信
            </span>
          </div>
          <time>{{ message.time }}</time>
        </header>

        <!-- 正文 -->
        <div class="mb-body">
          <div class="mb-markdown" v-html="displayHtml" />
          <span v-if="isStreaming" class="mb-cursor" />
        </div>

        <!-- 引用条 -->
        <Transition name="fade-up">
          <div v-if="isDone && citationVisible" class="mb-citation-bar">
            <button class="mb-citation-trigger" @click="sourceExpanded = !sourceExpanded">
              引用 {{ message.sources?.length || message.docCount || 0 }} 份文档
            </button>
            <span class="mb-citation-sep">·</span>
            <span v-if="message.confidence">可信度 {{ message.confidence }}%</span>
            <span v-if="message.permissionChecked" class="mb-citation-sep">·</span>
            <span v-if="message.permissionChecked">权限已校验</span>
          </div>
        </Transition>

        <!-- 展开引用来源 -->
        <Transition name="source">
          <div v-if="isDone && sourceExpanded && message.sources?.length" class="mb-source-list">
            <div v-for="src in message.sources" :key="src.id" class="mb-source-item">
              <span class="mb-src-type" :class="src.type.toLowerCase()">{{ src.type }}</span>
              <div class="mb-src-info">
                <strong>{{ src.title }}</strong>
                <span>{{ src.path }}</span>
              </div>
              <em>{{ src.confidence }}%</em>
            </div>
          </div>
        </Transition>

        <!-- 展开详情 -->
        <Transition name="source">
          <div v-if="isDone && detailsExpanded && hasDetails" class="mb-details">
            <div v-if="message.conclusion" class="mb-d-section">
              <strong class="mb-d-label">结论</strong>
              <p>{{ message.conclusion }}</p>
            </div>

            <div v-if="message.reasoning?.length" class="mb-d-section">
              <strong class="mb-d-label">推理依据</strong>
              <div class="mb-d-tags">
                <span v-for="(tag, i) in message.reasoning" :key="i">{{ tag }}</span>
              </div>
            </div>

            <div v-if="message.reasoningTimeline?.length" class="mb-d-section">
              <strong class="mb-d-label">推理过程</strong>
              <AiReasoningPanel
                :items="message.reasoningTimeline"
                :mode="message.reasoningMode || 'chat'"
              />
            </div>

            <div v-if="message.steps?.length" class="mb-d-section">
              <strong class="mb-d-label">详细步骤</strong>
              <div v-for="step in message.steps" :key="step.num" class="mb-d-step">
                <span class="mb-d-step-num">{{ step.num }}</span>
                <div>
                  <strong>{{ step.title }}</strong>
                  <p>{{ step.desc }}</p>
                </div>
              </div>
            </div>

            <div v-if="message.flowNodes?.length" class="mb-d-section">
              <strong class="mb-d-label">流程预览</strong>
              <div class="mb-d-flow">
                <template v-for="(node, i) in message.flowNodes" :key="i">
                  <span>{{ node }}</span>
                  <i v-if="i < message.flowNodes!.length - 1" />
                </template>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 展开详情按钮 -->
        <Transition name="fade-up">
          <button
            v-if="isDone && hasDetails"
            class="mb-toggle-details"
            @click="$emit('toggleDetails', message.id)"
          >
            {{ detailsExpanded ? '收起详情' : '展开详情' }}
            <AppIcon name="ArrowDown" :class="{ rotated: detailsExpanded }" />
          </button>
        </Transition>

        <!-- 快捷操作 -->
        <Transition name="fade-up">
          <div v-if="isDone" class="mb-actions">
            <button v-for="act in primaryActions" :key="act.label" class="mb-action-btn" @click="$emit('nextAction', act.label)">
              <AppIcon :name="act.icon" />{{ act.label }}
            </button>
            <el-dropdown v-if="moreActions.length" trigger="click" placement="top-end" @command="handleMoreAction">
              <button class="mb-action-btn">
                <AppIcon name="MoreFilled" />更多
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="act in moreActions" :key="act.label" :command="act.label">
                    <AppIcon :name="act.icon" />{{ act.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span class="mb-actions-sep" />
            <button class="mb-tool-btn" title="复制" :class="{ active: copied }" @click="handleCopy">
              <AppIcon :name="copied ? 'Select' : 'CopyDocument'" />
            </button>
            <button class="mb-tool-btn" title="重新生成" @click="$emit('regenerate', message.id)">
              <AppIcon name="RefreshRight" />
            </button>
            <button class="mb-tool-btn" title="有帮助" :class="{ active: message.feedback === 'like' }" @click="$emit('feedback', message.id, 'like')">
              <AppIcon name="Top" />
            </button>
            <button class="mb-tool-btn" title="无帮助" :class="{ active: message.feedback === 'dislike' }" @click="$emit('feedback', message.id, 'dislike')">
              <AppIcon name="Bottom" />
            </button>
          </div>
        </Transition>
      </article>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppIcon from '@/components/AppIcon/index.vue'
import RobotAvatar from '@/components/RobotAvatar/index.vue'
import AiReasoningPanel from './AiReasoningPanel.vue'
import { renderMarkdown } from '@/utils/markdown'
import type { ChatCard, NextAction } from '../mock'

const props = defineProps<{
  message: ChatCard
  userName: string
  isStreaming: boolean
}>()

const emit = defineEmits<{
  regenerate: [messageId: number]
  feedback: [messageId: number, value: 'like' | 'dislike']
  nextAction: [label: string]
  toggleDetails: [messageId: number]
}>()

const copied = ref(false)
const sourceExpanded = ref(false)
const detailsExpanded = ref(false)

const isDone = computed(() => !props.isStreaming && props.message.role === 'assistant' && !!props.message.content)

const citationVisible = computed(() => {
  return Boolean(props.message.sources?.length || props.message.confidence)
})

const hasDetails = computed(() => {
  const m = props.message
  return Boolean(
    m.conclusion
    || m.reasoning?.length
    || m.reasoningTimeline?.length
    || m.steps?.length
    || m.flowNodes?.length
  )
})

const primaryActions = computed<NextAction[]>(() => {
  const actions = props.message.nextActions || []
  return actions.slice(0, 3)
})

const moreActions = computed<NextAction[]>(() => {
  const actions = props.message.nextActions || []
  return actions.slice(3)
})

const displayHtml = computed(() => {
  const text = props.message.content || ''
  if (!text) return ''
  return renderMarkdown(text)
})

function handleCopy() {
  navigator.clipboard?.writeText(props.message.content || '').then(() => {
    copied.value = true
    ElMessage.success('已复制到剪贴板')
    window.setTimeout(() => { copied.value = false }, 2000)
  })
}

function handleMoreAction(label: string | number | object) {
  emit('nextAction', String(label))
}

function previewImage(url: string) {
  window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.mb-wrapper {
  margin-bottom: 18px;
}

// ============ 用户消息 ============
.mb-wrapper--user {
  display: flex;
  justify-content: flex-end;
}

.mb-user-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 78%;
  flex-direction: row-reverse;
}

.mb-user-avatar {
  flex: 0 0 auto;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.2);
}

.mb-user-bubble {
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  border-radius: 14px 4px 14px 14px;
  color: #1e293b;
  background: linear-gradient(135deg, #dbeafe, #e0e7ff);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);

  p { margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-line; }

  time {
    display: block;
    margin-top: 6px;
    font-size: 11px;
    color: #94a3b8;
    text-align: right;
  }
}

.mb-user-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;

  img {
    width: 120px;
    height: 90px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #bfdbfe;
    cursor: pointer;
    transition: transform 0.18s;

    &:hover { transform: scale(1.04); }
  }
}

// ============ AI 卡片 ============
.mb-ai-card {
  max-width: min(780px, 88%);
  padding: 20px 22px;
  border-radius: 16px;
  border: 1px solid #dce8ff;
  background: linear-gradient(135deg, #fff 0%, #f8fbff 100%);
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.06);
  transition: box-shadow 0.4s ease, border-color 0.4s ease;
}

.mb-ai-card.is-streaming {
  border-color: #bfdbfe;
  box-shadow:
    0 4px 20px rgba(37, 99, 235, 0.08),
    0 0 20px rgba(37, 99, 235, 0.04);
  animation: card-breathe 2.5s ease-in-out infinite;
}

@keyframes card-breathe {
  0%, 100% { box-shadow: 0 4px 20px rgba(37, 99, 235, 0.08), 0 0 16px rgba(37, 99, 235, 0.03); }
  50% { box-shadow: 0 4px 24px rgba(37, 99, 235, 0.12), 0 0 28px rgba(37, 99, 235, 0.06); }
}

// 顶部身份栏
.mb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.mb-header-left {
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
  }
}

.mb-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &.streaming {
    color: #2563eb;
    background: #eff6ff;

    .status-dot {
      background: #2563eb;
      animation: breathe-dot 1.2s ease-in-out infinite;
    }
  }

  &.done {
    color: #16a34a;
    background: #f0fdf4;

    .status-dot {
      background: #16a34a;
    }
  }
}

@keyframes breathe-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

.mb-header time {
  font-size: 11px;
  color: #94a3b8;
}

// 正文
.mb-body {
  position: relative;
  color: #334155;
  font-size: 14.5px;
  line-height: 1.8;
  word-break: break-word;
}

.mb-markdown {
  :deep(p) {
    margin: 0 0 10px;
    &:last-child { margin-bottom: 0; }
  }

  :deep(strong) { color: #0f172a; font-weight: 700; }
  :deep(em) { color: #475569; }

  :deep(a) {
    color: #2563eb;
    text-decoration: underline;
    text-underline-offset: 2px;
    &:hover { color: #1d4ed8; }
  }

  :deep(h2), :deep(h3), :deep(h4) {
    margin: 16px 0 8px;
    color: #0f172a;
    font-weight: 700;
  }

  :deep(h2) { font-size: 17px; }
  :deep(h3) { font-size: 15px; }
  :deep(h4) { font-size: 14px; }

  :deep(blockquote) {
    margin: 10px 0;
    padding: 10px 14px;
    border-left: 3px solid #93c5fd;
    border-radius: 0 8px 8px 0;
    background: #f0f7ff;
    color: #334155;
    font-size: 13.5px;
  }

  :deep(ul), :deep(ol) {
    margin: 8px 0;
    padding-left: 22px;

    li {
      margin-bottom: 4px;
      font-size: 14px;
      line-height: 1.7;
      color: #334155;
    }
  }

  :deep(table) {
    width: 100%;
    margin: 12px 0;
    border-collapse: collapse;
    font-size: 13px;

    th {
      padding: 8px 12px;
      text-align: left;
      color: #1e293b;
      background: #f0f7ff;
      font-weight: 700;
      border-bottom: 1px solid #dbeafe;
    }

    td {
      padding: 8px 12px;
      color: #475569;
      border-bottom: 1px solid #f1f5f9;
    }

    tr:last-child td { border-bottom: 0; }
    tr:hover td { background: #fafbff; }
  }

  :deep(pre) {
    margin: 12px 0;
    padding: 14px 16px;
    border-radius: 10px;
    background: #1e293b;
    color: #e2e8f0;
    font-size: 12px;
    line-height: 1.65;
    overflow-x: auto;
    font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
  }

  :deep(code) {
    padding: 2px 6px;
    border-radius: 5px;
    color: #e11d48;
    background: #fff1f2;
    font-size: 12px;
    font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
  }

  :deep(pre code) {
    padding: 0;
    color: inherit;
    background: transparent;
  }
}

// 闪烁光标
.mb-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: #2563eb;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink-cursor 0.75s step-end infinite;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

// 引用条
.mb-citation-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  font-size: 12px;
  color: #64748b;
}

.mb-citation-trigger {
  padding: 0;
  border: 0;
  color: #2563eb;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover { text-decoration: underline; }
}

.mb-citation-sep {
  color: #cbd5e1;
}

// 引用来源列表
.mb-source-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.mb-source-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}

.mb-src-type {
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 800;

  &.docx { color: #2563eb; background: #eff6ff; }
  &.pdf { color: #dc2626; background: #fef2f2; }
  &.xlsx { color: #16a34a; background: #f0fdf4; }
  &.md { color: #64748b; background: #f1f5f9; }
  &.image { color: #f59e0b; background: #fffbeb; }
}

.mb-src-info {
  min-width: 0;
  display: flex;
  flex-direction: column;

  strong { font-size: 12px; font-weight: 600; color: #1e293b; }
  span { font-size: 11px; color: #94a3b8; margin-top: 2px; }
}

.mb-source-item em {
  color: #16a34a;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
}

// 展开详情
.mb-toggle-details {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  padding: 4px 0;
  border: 0;
  color: #94a3b8;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.15s;

  :deep(svg) {
    width: 12px;
    transition: transform 0.2s;
  }

  .rotated { transform: rotate(180deg); }

  &:hover { color: #64748b; }
}

.mb-details {
  margin-top: 12px;
  padding: 14px;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  background: #f8fafc;
}

.mb-d-section {
  margin-bottom: 14px;

  &:last-child { margin-bottom: 0; }
}

.mb-d-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.mb-d-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  span {
    padding: 3px 8px;
    border-radius: 7px;
    color: #2563eb;
    background: #eff6ff;
    font-size: 11px;
    font-weight: 600;
  }
}

.mb-d-step {
  display: flex;
  gap: 10px;
  padding: 8px 0;

  &:not(:last-child) { border-bottom: 1px solid #f1f5f9; }
}

.mb-d-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  color: #2563eb;
  background: #eff6ff;
  font-size: 11px;
  font-weight: 800;
  flex: 0 0 auto;
}

.mb-d-step strong {
  display: block;
  color: #1e293b;
  font-size: 13px;
  margin-bottom: 2px;
}

.mb-d-step p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.55;
}

.mb-d-flow {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;

  span {
    padding: 4px 8px;
    border-radius: 7px;
    color: #0f172a;
    background: #fff;
    border: 1px solid #bae6fd;
    font-size: 12px;
    font-weight: 700;
  }

  i {
    width: 16px;
    height: 1px;
    background: #38bdf8;
  }
}

// 快捷操作
.mb-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
}

.mb-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  cursor: pointer;
  transition: all 0.15s;

  :deep(svg) { width: 13px; }

  &:hover {
    background: #2563eb;
    color: #fff;
    border-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(37, 99, 235, 0.18);
  }
}

.mb-actions-sep {
  flex: 1;
  min-width: 8px;
}

.mb-tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  color: #94a3b8;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;

  :deep(svg) { width: 14px; }

  &:hover, &.active {
    color: #2563eb;
    border-color: #bfdbfe;
    background: #eff6ff;
  }
}

// 过渡动画
.fade-up-enter-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.fade-up-leave-active {
  transition: all 0.2s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.source-enter-active,
.source-leave-active {
  transition: all 0.25s ease;
}

.source-enter-from,
.source-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 640px) {
  .mb-ai-card {
    max-width: 94%;
    padding: 16px;
  }

  .mb-user-bubble { max-width: 88%; }
}
</style>
