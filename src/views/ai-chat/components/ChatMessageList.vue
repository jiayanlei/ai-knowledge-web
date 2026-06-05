<template>
  <div ref="listRef" class="message-list no-scrollbar">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-row"
      :class="message.role"
    >
      <RobotAvatar v-if="message.role === 'assistant'" size="small" />
      <el-avatar v-else :size="30" class="user-avatar">张</el-avatar>
      <div class="message-content">
        <div class="message-meta">
          <span>{{ message.role === 'user' ? '我' : 'AI 助手' }}</span>
          <time>{{ message.time }}</time>
        </div>
        <div class="message-bubble">
          <p>{{ message.content }}</p>
          <div v-if="message.role === 'assistant' && message.sourcePath" class="message-source">
            <span>来源：{{ message.sourcePath }}</span>
            <strong v-if="message.confidence">置信度 {{ message.confidence }}%</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import RobotAvatar from '@/components/RobotAvatar/index.vue'
import type { ChatMessage } from '@/types/chat'

const props = defineProps<{
  messages: ChatMessage[]
}>()

const listRef = ref<HTMLDivElement>()

watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.message-list {
  flex: 1;
  min-height: 0;
  padding: 18px 4px 16px;
  overflow-y: auto;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.message-row.user {
  flex-direction: row-reverse;

  .message-content {
    align-items: flex-end;
  }

  .message-bubble {
    color: #1f2a44;
    background: #dcebff;
    box-shadow: none;
  }
}

.user-avatar {
  flex: 0 0 auto;
  color: #fff;
  background: #1677ff;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: min(760px, 78%);
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 12px;
}

.message-bubble {
  padding: 14px 16px;
  border-radius: 12px;
  color: #1f2a44;
  line-height: 1.72;
  background: #fff;
  box-shadow:
    0 10px 24px rgba(15, 23, 42, 0.05),
    inset 0 0 0 1px #e5eaf3;
}

.message-bubble p {
  margin: 0;
  white-space: pre-line;
}

.message-source {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eef2f7;
  color: #667085;
  font-size: 12px;
}

.message-source strong {
  flex: 0 0 auto;
  padding: 3px 8px;
  border-radius: 999px;
  color: #10a37f;
  background: #eafaf5;
}
</style>
