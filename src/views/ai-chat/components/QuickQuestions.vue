<template>
  <div class="quick-questions">
    <span class="quick-label">快捷问题</span>
    <button
      v-for="question in questions"
      :key="question"
      class="quick-question"
      type="button"
      @click="$emit('select', question)"
    >
      {{ question }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  questions: string[]
}>()

defineEmits<{
  select: [question: string]
}>()
</script>

<style scoped lang="scss">
.quick-questions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.quick-label {
  color: #64748b;
  font-size: 13px;
}

.quick-question {
  max-width: 220px;
  padding: 9px 14px;
  border: 1px solid #dbe7f5;
  border-radius: 12px;
  color: #1f2a44;
  background: #fff;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-question:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #f6fbff;
}
</style>
