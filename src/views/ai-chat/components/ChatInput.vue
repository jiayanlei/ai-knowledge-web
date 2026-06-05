<template>
  <div class="chat-input app-card">
    <el-input
      :model-value="modelValue"
      type="textarea"
      resize="none"
      :autosize="{ minRows: 2, maxRows: 4 }"
      placeholder="请输入问题，例如：新员工入职流程是什么？"
      @update:model-value="handleInput"
      @keydown.enter.exact.prevent="handleSend"
    />
    <div class="input-actions">
      <div class="left-actions">
        <el-button :icon="Upload" plain>上传文档</el-button>
        <el-button :icon="Search" plain>深度搜索</el-button>
      </div>
      <el-button type="primary" :icon="Promotion" @click="handleSend">发送</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Promotion, Search, Upload } from '@element-plus/icons-vue'
import { isNotEmpty } from '@/utils/validate'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: [question: string]
}>()

function handleInput(value: string | number) {
  emit('update:modelValue', String(value))
}

function handleSend() {
  if (!isNotEmpty(props.modelValue)) {
    ElMessage.warning('请输入问题')
    return
  }

  emit('send', props.modelValue.trim())
  emit('update:modelValue', '')
}
</script>

<style scoped lang="scss">
.chat-input {
  flex: 0 0 auto;
  padding: 12px 14px;
  border-radius: 14px;
  box-shadow: 0 -6px 26px rgba(15, 23, 42, 0.04);

  :deep(.el-textarea__inner) {
    min-height: 52px !important;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #dce5f2 inset;
  }
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 760px) {
  .input-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .left-actions {
    flex-wrap: wrap;
  }
}
</style>
