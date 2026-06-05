<template>
  <section class="reasoning-panel">
    <button class="reasoning-toggle" type="button" @click="expanded = !expanded">
      <span class="toggle-left">
        <span class="spark" />
        <strong>推理过程</strong>
        <span>{{ modeLabel }}</span>
      </span>
      <AppIcon class="toggle-icon" :class="{ expanded }" name="ArrowDown" />
    </button>

    <Transition name="reasoning">
      <div v-if="expanded" class="reasoning-body">
        <div v-for="(item, index) in items" :key="`${item}-${index}`" class="reasoning-step">
          <span class="step-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <p>{{ item }}</p>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon/index.vue'
import { reasoningModeOptions, type ReasoningMode } from '../mock'

const props = defineProps<{
  items: string[]
  mode: ReasoningMode
}>()

const expanded = ref(false)
const modeLabel = computed(() => reasoningModeOptions.find((item) => item.value === props.mode)?.label ?? 'Thinking')
</script>

<style scoped lang="scss">
.reasoning-panel {
  margin: 12px 0 14px;
  border: 1px solid #dbe7f8;
  border-radius: 12px;
  background: #f8fbff;
  overflow: hidden;
}

.reasoning-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 42px;
  padding: 0 14px;
  border: 0;
  color: #334155;
  background: transparent;
  cursor: pointer;
}

.toggle-left {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 8px;

  strong {
    color: #1e293b;
    font-size: 13px;
  }

  span:last-child {
    color: #64748b;
    font-size: 12px;
  }
}

.spark {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 14px rgba(56, 189, 248, 0.72);
}

.toggle-icon {
  width: 14px;
  color: #64748b;
  transition: transform 0.2s ease;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.reasoning-body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 14px 14px 30px;
}

.reasoning-body::before {
  content: "";
  position: absolute;
  left: 18px;
  top: 2px;
  bottom: 16px;
  width: 1px;
  background: linear-gradient(#93c5fd, #dbeafe);
}

.reasoning-step {
  position: relative;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 8px;
  align-items: flex-start;
}

.step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  border-radius: 999px;
  color: #2563eb;
  background: #eff6ff;
  font-size: 11px;
  font-weight: 800;
}

.reasoning-step p {
  margin: 1px 0 0;
  color: #475569;
  font-size: 12px;
  line-height: 1.65;
}

.reasoning-enter-active,
.reasoning-leave-active {
  transition: all 0.2s ease;
}

.reasoning-enter-from,
.reasoning-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
