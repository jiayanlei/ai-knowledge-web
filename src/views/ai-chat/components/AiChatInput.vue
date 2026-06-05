<template>
  <div
    class="chat-input-shell"
    :class="{ 'is-dragging': isDragging, 'has-error': hasFailedImage }"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <div v-if="images.length" class="image-strip">
      <div v-for="image in images" :key="image.id" class="image-thumb" :class="image.status">
        <img :src="image.url" :alt="image.name" />
        <span v-if="image.status === 'uploading'" class="thumb-mask">上传中</span>
        <span v-else-if="image.status === 'error'" class="thumb-mask error">上传失败</span>
        <button type="button" title="删除图片" @click="removeImage(image.id)">
          <AppIcon name="Close" />
        </button>
      </div>
    </div>

    <div v-if="statusText" class="input-status" :class="{ error: hasFailedImage }">
      <span class="status-dot" />
      {{ statusText }}
    </div>

    <div class="input-pill">
      <el-dropdown trigger="click" placement="top-start" @command="handleActionCommand">
        <button class="icon-button add-button" type="button" :disabled="isLocked" title="添加">
          <AppIcon name="Plus" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="image">
              <AppIcon name="Picture" />
              上传图片
            </el-dropdown-item>
            <el-dropdown-item command="file">
              <AppIcon name="Paperclip" />
              上传文件
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <textarea
        ref="textareaRef"
        :value="modelValue"
        :disabled="isLocked"
        rows="1"
        placeholder="有问题，尽管问"
        @input="handleInput"
        @keydown.enter.exact.prevent="handleSubmit"
        @paste="handlePaste"
      />

      <el-dropdown trigger="click" placement="top-end" @command="handleModeSelect">
        <button class="thinking-button" type="button" :disabled="isLocked">
          <span>{{ displayModeLabel }}</span>
          <AppIcon name="ArrowDown" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="mode in reasoningModeOptions" :key="mode.value" :command="mode.value">
              {{ mode.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <button class="icon-button voice-button" :class="{ recording: isRecording }" type="button" :disabled="isLocked && !isRecording" title="语音输入" @click="toggleRecording">
        <AppIcon :name="isRecording ? 'VideoPause' : 'Microphone'" />
      </button>

      <span class="send-hit-area" @click="handleBlockedClick">
        <button class="send-button" :class="{ stop: isAnswering }" type="button" :disabled="sendButtonDisabled" :title="isAnswering ? '停止生成' : '发送'" @click.stop="handleSubmit">
          <AppIcon :name="isAnswering ? 'Close' : 'Top'" />
        </button>
      </span>
    </div>

    <input ref="fileInputRef" class="hidden-input" type="file" accept="image/*" multiple @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  mockSpeechToText,
  mockUploadImage,
  reasoningModeOptions,
  type ChatImage,
  type ChatSendPayload,
  type ChatStatus,
  type ReasoningMode
} from '../mock'

interface LocalImage extends ChatImage {
  status: 'uploading' | 'success' | 'error'
  error?: string
}

const props = defineProps<{
  modelValue: string
  isAnswering: boolean
  reasoningMode: ReasoningMode
  reasoningLabel: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: [payload: ChatSendPayload]
  stop: []
  'status-change': [status: ChatStatus]
  'mode-change': [mode: ReasoningMode, label: string]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const fileInputRef = ref<HTMLInputElement>()
const images = ref<LocalImage[]>([])
const isDragging = ref(false)
const isRecording = ref(false)
const isTranscribing = ref(false)
const recordingSeconds = ref(0)
let recordingTimer: number | undefined

const hasUploadingImage = computed(() => images.value.some((image) => image.status === 'uploading'))
const hasFailedImage = computed(() => images.value.some((image) => image.status === 'error'))
const successfulImages = computed<ChatImage[]>(() => images.value.filter((image) => image.status === 'success').map(({ id, name, url }) => ({ id, name, url })))
const hasContent = computed(() => Boolean(props.modelValue.trim()) || successfulImages.value.length > 0)
const isLocked = computed(() => props.isAnswering || isTranscribing.value)
const displayModeLabel = computed(() => props.reasoningLabel || 'Thinking')
const sendButtonDisabled = computed(() => {
  if (props.isAnswering) return false
  return !hasContent.value || hasUploadingImage.value || hasFailedImage.value || isRecording.value || isTranscribing.value
})

const statusText = computed(() => {
  if (hasFailedImage.value) return '图片上传失败，请重新上传'
  if (hasUploadingImage.value) return '图片正在上传，请稍后再发送'
  if (isRecording.value) return `录音中 ${formatSeconds(recordingSeconds.value)}`
  if (isTranscribing.value) return '正在转换语音为文字...'
  return ''
})

watch(
  () => props.modelValue,
  () => resizeTextarea(),
  { flush: 'post' }
)

onBeforeUnmount(() => {
  stopRecordingTimer()
})

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  resizeTextarea()
}

function resizeTextarea() {
  nextTick(() => {
    const textarea = textareaRef.value
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  })
}

function handleActionCommand(command: string | number | object) {
  if (command === 'image') {
    fileInputRef.value?.click()
    return
  }

  ElMessage.info('文件上传能力已预留，当前先支持图片问答')
}

function handleModeSelect(command: string | number | object) {
  const mode = reasoningModeOptions.find((item) => item.value === command)
  if (!mode) return
  emit('mode-change', mode.value, mode.label)
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  uploadFiles(Array.from(input.files || []))
  input.value = ''
}

function handlePaste(event: ClipboardEvent) {
  const files = Array.from(event.clipboardData?.files || []).filter((file) => file.type.startsWith('image/'))
  if (!files.length) return
  event.preventDefault()
  uploadFiles(files)
}

function handleDragEnter() {
  if (!isLocked.value) isDragging.value = true
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (isLocked.value) return
  const files = Array.from(event.dataTransfer?.files || []).filter((file) => file.type.startsWith('image/'))
  if (!files.length) return
  uploadFiles(files)
}

function uploadFiles(files: File[]) {
  if (!files.length) return
  emit('status-change', 'uploading')

  files.slice(0, 4).forEach((file) => {
    const previewUrl = URL.createObjectURL(file)
    const localImage: LocalImage = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: file.name || '粘贴图片',
      url: previewUrl,
      status: 'uploading'
    }
    images.value.push(localImage)

    mockUploadImage(file, previewUrl)
      .then((uploaded) => {
        Object.assign(localImage, uploaded, { status: 'success' as const })
      })
      .catch((error: Error) => {
        localImage.status = 'error'
        localImage.error = error.message
        emit('status-change', 'error')
        ElMessage.error('图片上传失败，请重新上传')
      })
      .finally(() => {
        if (!hasUploadingImage.value && !hasFailedImage.value) emit('status-change', 'idle')
      })
  })
}

function removeImage(id: string) {
  const image = images.value.find((item) => item.id === id)
  if (image) URL.revokeObjectURL(image.url)
  images.value = images.value.filter((item) => item.id !== id)
  if (!hasUploadingImage.value && !hasFailedImage.value) emit('status-change', 'idle')
}

function toggleRecording() {
  if (props.isAnswering) return
  if (isRecording.value) {
    finishRecording()
    return
  }

  isRecording.value = true
  recordingSeconds.value = 0
  emit('status-change', 'recording')
  recordingTimer = window.setInterval(() => {
    recordingSeconds.value += 1
  }, 1000)
}

async function finishRecording() {
  stopRecordingTimer()
  isRecording.value = false
  isTranscribing.value = true

  try {
    const text = await mockSpeechToText(recordingSeconds.value)
    const nextValue = [props.modelValue.trim(), text].filter(Boolean).join('\n')
    emit('update:modelValue', nextValue)
    ElMessage.success('语音已转换为文字')
  } catch {
    emit('status-change', 'error')
    ElMessage.error('语音识别失败，请重试')
  } finally {
    isTranscribing.value = false
    emit('status-change', 'idle')
    resizeTextarea()
  }
}

function stopRecordingTimer() {
  if (recordingTimer) {
    window.clearInterval(recordingTimer)
    recordingTimer = undefined
  }
}

function handleBlockedClick() {
  if (props.isAnswering) return
  if (hasUploadingImage.value) {
    ElMessage.warning('图片正在上传，请稍后再发送')
    return
  }
  if (hasFailedImage.value) {
    ElMessage.warning('图片上传失败，请重新上传')
    return
  }
  if (isRecording.value) {
    ElMessage.warning('请先结束录音')
  }
}

function handleSubmit() {
  if (props.isAnswering) {
    emit('stop')
    return
  }

  if (hasUploadingImage.value) {
    ElMessage.warning('图片正在上传，请稍后再发送')
    return
  }

  if (hasFailedImage.value) {
    ElMessage.warning('图片上传失败，请重新上传')
    return
  }

  if (isRecording.value) {
    ElMessage.warning('请先结束录音')
    return
  }

  if (!hasContent.value) return

  emit('send', {
    content: props.modelValue.trim(),
    images: successfulImages.value,
    reasoningMode: props.reasoningMode
  })
  emit('update:modelValue', '')
  images.value = []
  resizeTextarea()
}

function formatSeconds(seconds: number) {
  const minute = Math.floor(seconds / 60)
  const second = seconds % 60
  return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.chat-input-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.chat-input-shell.is-dragging::before {
  content: "释放图片开始上传";
  position: absolute;
  inset: -8px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #60a5fa;
  border-radius: 20px;
  color: #2563eb;
  background: rgba(239, 246, 255, 0.86);
  font-size: 13px;
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.image-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 4px;
}

.image-thumb {
  position: relative;
  width: 86px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #dbeafe;
  background: #f8fafc;
}

.image-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(15, 23, 42, 0.46);
  font-size: 12px;
  font-weight: 700;
}

.thumb-mask.error {
  background: rgba(220, 38, 38, 0.72);
}

.image-thumb button {
  position: absolute;
  right: 4px;
  top: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  color: #fff;
  background: rgba(15, 23, 42, 0.62);
  cursor: pointer;
}

.input-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-left: 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
}

.input-status.error {
  color: #dc2626;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 10px currentColor;
  animation: status-breathe 1.2s ease-in-out infinite;
}

.input-pill {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto 36px 40px;
  align-items: end;
  gap: 8px;
  min-height: 52px;
  padding: 8px;
  border: 1px solid #dbe7f8;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow:
    0 14px 32px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.7) inset;
}

.chat-input-shell.has-error .input-pill {
  border-color: #fecaca;
}

textarea {
  width: 100%;
  min-height: 36px;
  max-height: 160px;
  padding: 8px 2px;
  border: 0;
  outline: none;
  resize: none;
  overflow-y: auto;
  color: #1e293b;
  background: transparent;
  font-size: 14px;
  line-height: 20px;
  font-family: inherit;
}

textarea::placeholder {
  color: #94a3b8;
}

.icon-button,
.send-button,
.thinking-button {
  border: 0;
  cursor: pointer;
  transition: all 0.16s ease;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #475569;
  background: #f8fafc;
}

.icon-button:hover,
.thinking-button:hover {
  color: #2563eb;
  background: #eff6ff;
}

.voice-button.recording {
  color: #dc2626;
  background: #fef2f2;
  box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.16);
}

.thinking-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  color: #334155;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.thinking-button :deep(svg) {
  width: 12px;
}

.send-hit-area {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.send-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  background: #0f172a;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
}

.send-button.stop {
  background: #2563eb;
}

.send-button:disabled {
  color: #94a3b8;
  background: #e2e8f0;
  box-shadow: none;
  cursor: not-allowed;
  pointer-events: none;
}

.hidden-input {
  display: none;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 7px;
}

@keyframes status-breathe {
  50% {
    opacity: 0.42;
    transform: scale(1.25);
  }
}

@media (max-width: 640px) {
  .input-pill {
    grid-template-columns: 36px minmax(0, 1fr) 36px 40px;
  }

  .thinking-button {
    grid-column: 2 / 5;
    justify-self: start;
  }
}
</style>
