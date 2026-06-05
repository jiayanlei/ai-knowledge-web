<template>
  <div class="thinking-loader">
    <div class="loader-visual" aria-hidden="true">
      <span class="ring ring--outer" />
      <span class="ring ring--middle" />
      <span class="scan-line" />
      <span v-for="item in particles" :key="item" class="particle" :class="`particle--${item}`" />
      <div class="core">
        <span>AI</span>
      </div>
    </div>

    <div class="loader-copy">
      <span class="eyebrow">Enterprise Knowledge Engine</span>
      <strong>{{ activeText }}</strong>
      <p>正在匹配可信来源、校验权限，并组织回答结构。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const thinkingTexts = [
  'AI 正在理解问题…',
  '正在检索企业知识…',
  '正在组织回答逻辑…'
]

const particles = [1, 2, 3, 4, 5, 6]
const textIndex = ref(Math.floor(Math.random() * thinkingTexts.length))
let timer: number | undefined

const activeText = computed(() => thinkingTexts[textIndex.value])

onMounted(() => {
  timer = window.setInterval(() => {
    textIndex.value = (textIndex.value + 1) % thinkingTexts.length
  }, 760)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped lang="scss">
.thinking-loader {
  position: relative;
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  width: min(620px, 92%);
  padding: 16px 18px;
  border: 1px solid rgba(147, 197, 253, 0.55);
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(248, 251, 255, 0.96), rgba(239, 246, 255, 0.92)),
    radial-gradient(circle at 16% 22%, rgba(59, 130, 246, 0.16), transparent 36%);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.thinking-loader::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 0%, rgba(96, 165, 250, 0.16) 44%, rgba(255, 255, 255, 0.68) 50%, rgba(96, 165, 250, 0.14) 56%, transparent 100%);
  transform: translateX(-120%);
  animation: panel-scan 1.7s ease-in-out infinite;
  pointer-events: none;
}

.loader-visual {
  position: relative;
  width: 86px;
  height: 86px;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(37, 99, 235, 0.34);
  box-shadow: inset 0 0 18px rgba(14, 165, 233, 0.12);
}

.ring--outer {
  inset: 0;
  border-style: dashed;
  animation: spin 7s linear infinite;
}

.ring--middle {
  inset: 16px;
  border-color: rgba(124, 58, 237, 0.35);
  animation: breathe 1.8s ease-in-out infinite;
}

.scan-line {
  position: absolute;
  left: 8px;
  right: 8px;
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #38bdf8, transparent);
  animation: scan 1.6s ease-in-out infinite;
}

.core {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  background:
    radial-gradient(circle at 35% 25%, #dbeafe 0%, #60a5fa 30%, #2563eb 58%, #7c3aed 100%);
  box-shadow:
    0 0 20px rgba(37, 99, 235, 0.44),
    0 0 38px rgba(124, 58, 237, 0.24);
  transform: translate(-50%, -50%);
  animation: core-pulse 1.35s ease-in-out infinite;

  span {
    font-size: 13px;
    font-weight: 900;
  }
}

.particle {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);
  animation: particle-flow 1.8s ease-in-out infinite;
}

.particle--1 { left: 10px; top: 18px; animation-delay: 0s; }
.particle--2 { right: 8px; top: 20px; animation-delay: 0.18s; }
.particle--3 { left: 18px; bottom: 10px; animation-delay: 0.36s; }
.particle--4 { right: 18px; bottom: 12px; animation-delay: 0.54s; }
.particle--5 { left: 50%; top: 0; animation-delay: 0.72s; }
.particle--6 { left: 50%; bottom: 0; animation-delay: 0.9s; }

.loader-copy {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.eyebrow {
  display: block;
  margin-bottom: 4px;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0;
}

.loader-copy strong {
  display: block;
  color: #1e293b;
  font-size: 15px;
  font-weight: 800;
}

.loader-copy p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

@keyframes panel-scan {
  to { transform: translateX(120%); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes breathe {
  50% { transform: scale(1.08); opacity: 0.58; }
}

@keyframes scan {
  0%, 100% { transform: translateY(-22px); opacity: 0.4; }
  50% { transform: translateY(22px); opacity: 1; }
}

@keyframes core-pulse {
  50% { transform: translate(-50%, -50%) scale(1.08); }
}

@keyframes particle-flow {
  50% {
    transform: translate(10px, -8px) scale(1.4);
    opacity: 0.36;
  }
}

@media (max-width: 640px) {
  .thinking-loader {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 12px;
  }

  .loader-visual {
    width: 68px;
    height: 68px;
  }
}
</style>
