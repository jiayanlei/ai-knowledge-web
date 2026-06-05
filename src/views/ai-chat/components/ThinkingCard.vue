<template>
  <div class="thinking-card">
    <div class="thinking-grid" />

    <div class="thinking-main">
      <div class="thinking-orbit" aria-hidden="true">
        <span class="orbit-ring orbit-ring--outer" />
        <span class="orbit-ring orbit-ring--inner" />
        <span
          v-for="node in knowledgeNodes"
          :key="node.label"
          class="knowledge-node"
          :style="{ '--angle': node.angle, '--delay': node.delay, '--node-color': node.color }"
        >
          {{ node.label }}
        </span>
        <span
          v-for="beam in knowledgeNodes"
          :key="beam.label + '-beam'"
          class="knowledge-beam"
          :style="{ '--angle': beam.angle, '--delay': beam.delay, '--beam-color': beam.color }"
        />
        <span v-for="particle in particles" :key="particle" class="particle" :class="`particle--${particle}`" />
        <div class="ai-core">
          <span>AI</span>
        </div>
      </div>

      <div class="thinking-copy">
        <div class="thinking-kicker">
          <span class="kicker-dot" />
          AI 正在调动企业知识网络
        </div>
        <div class="thinking-status">
          <span class="status-signal" />
          <strong>{{ currentStatus }}</strong>
        </div>
        <p>正在从 1,258 篇文档中寻找最可靠依据，并校验引用权限。</p>
        <div class="doc-flashes">
          <span v-for="tag in docTags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div class="knowledge-track">
      <span class="track-light" />
      <span class="track-node track-node--one" />
      <span class="track-node track-node--two" />
      <span class="track-node track-node--three" />
    </div>

    <div class="thinking-footer">
      <span class="trust-chip">可信推理链路已激活</span>
      <span class="scan-text">语义理解 · 知识检索 · 引用匹配</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const statusTexts = [
  '解析问题意图',
  '激活知识节点',
  '检索可信来源',
  '校验访问权限',
  '组织回答结构'
]

const knowledgeNodes = [
  { label: '制度', angle: '0deg', delay: '0s', color: '#2563eb' },
  { label: '流程', angle: '45deg', delay: '0.12s', color: '#0ea5e9' },
  { label: '项目', angle: '90deg', delay: '0.24s', color: '#8b5cf6' },
  { label: '手册', angle: '135deg', delay: '0.36s', color: '#22c55e' },
  { label: '福利', angle: '180deg', delay: '0.48s', color: '#f59e0b' },
  { label: '技术', angle: '225deg', delay: '0.6s', color: '#14b8a6' },
  { label: 'FAQ', angle: '270deg', delay: '0.72s', color: '#6366f1' },
  { label: '权限', angle: '315deg', delay: '0.84s', color: '#ef4444' }
]

const docTags = ['DOCX', 'PDF', '知识节点', '员工手册', '流程库']
const particles = [1, 2, 3, 4, 5, 6, 7, 8]
const statusIndex = ref(0)
let statusTimer: number | undefined

const currentStatus = computed(() => statusTexts[statusIndex.value])

onMounted(() => {
  statusTimer = window.setInterval(() => {
    statusIndex.value = (statusIndex.value + 1) % statusTexts.length
  }, 360)
})

onBeforeUnmount(() => {
  if (statusTimer) window.clearInterval(statusTimer)
})
</script>

<style scoped lang="scss">
.thinking-card {
  position: relative;
  width: min(680px, 92%);
  margin-bottom: 18px;
  padding: 18px;
  border-radius: 16px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(239, 246, 255, 0.88), rgba(255, 255, 255, 0.92)),
    radial-gradient(circle at 18% 20%, rgba(37, 99, 235, 0.18), transparent 34%),
    radial-gradient(circle at 78% 28%, rgba(139, 92, 246, 0.12), transparent 36%);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
  animation: thinking-card-in 0.32s ease-out both;
}

.thinking-card::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: conic-gradient(from var(--border-angle), rgba(37, 99, 235, 0.08), #60a5fa, #a78bfa, #22c55e, rgba(37, 99, 235, 0.08));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: border-flow 2.6s linear infinite;
  pointer-events: none;
}

.thinking-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 0%, rgba(96, 165, 250, 0.18) 42%, rgba(255, 255, 255, 0.55) 50%, rgba(96, 165, 250, 0.18) 58%, transparent 100%);
  transform: translateX(-120%);
  animation: panel-scan 1.45s ease-in-out infinite;
  pointer-events: none;
}

.thinking-grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(37, 99, 235, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.045) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.9));
  pointer-events: none;
}

.thinking-main {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
}

.thinking-orbit {
  position: relative;
  width: 178px;
  height: 178px;
  margin: 0 auto;
}

.orbit-ring {
  position: absolute;
  inset: 22px;
  border: 1px solid rgba(96, 165, 250, 0.38);
  border-radius: 50%;
  box-shadow:
    0 0 22px rgba(37, 99, 235, 0.12),
    inset 0 0 18px rgba(14, 165, 233, 0.12);
  animation: ring-pulse 1.8s ease-in-out infinite;
}

.orbit-ring--outer {
  inset: 10px;
  border-style: dashed;
  animation: ring-rotate 6s linear infinite;
}

.orbit-ring--inner {
  inset: 48px;
  border-color: rgba(167, 139, 250, 0.42);
  animation-delay: 0.2s;
}

.ai-core {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  color: #fff;
  font-size: 18px;
  font-weight: 900;
  background:
    radial-gradient(circle at 35% 25%, #dbeafe 0%, #60a5fa 28%, #2563eb 54%, #7c3aed 100%);
  box-shadow:
    0 0 18px rgba(37, 99, 235, 0.45),
    0 0 42px rgba(124, 58, 237, 0.28);
  transform: translate(-50%, -50%);
  animation: core-breathe 1.4s ease-in-out infinite;
}

.ai-core::before,
.ai-core::after {
  content: "";
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1px solid rgba(96, 165, 250, 0.42);
  animation: core-wave 1.8s ease-out infinite;
}

.ai-core::after {
  animation-delay: 0.55s;
}

.knowledge-node {
  --angle: 0deg;
  --delay: 0s;
  --node-color: #2563eb;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 24px;
  padding: 0 8px;
  border: 1px solid color-mix(in srgb, var(--node-color) 38%, #ffffff);
  border-radius: 999px;
  color: var(--node-color);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.08);
  font-size: 11px;
  font-weight: 800;
  transform: rotate(var(--angle)) translateX(68px) rotate(calc(-1 * var(--angle)));
  animation: node-flicker 1.2s ease-in-out infinite;
  animation-delay: var(--delay);
}

.knowledge-beam {
  --angle: 0deg;
  --delay: 0s;
  --beam-color: #2563eb;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 58px;
  height: 1px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--beam-color) 52%, transparent), transparent);
  transform: rotate(var(--angle)) translateX(18px);
  transform-origin: left center;
  opacity: 0.8;
}

.knowledge-beam::after {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  width: 16px;
  height: 3px;
  border-radius: 999px;
  background: var(--beam-color);
  filter: blur(1px);
  animation: beam-flow 1.1s ease-in-out infinite;
  animation-delay: var(--delay);
}

.particle {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #60a5fa;
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.7);
  animation: particle-float 1.8s ease-in-out infinite;
}

.particle--1 { left: 22px; top: 34px; animation-delay: 0s; }
.particle--2 { right: 24px; top: 28px; animation-delay: 0.18s; }
.particle--3 { left: 18px; bottom: 42px; animation-delay: 0.36s; }
.particle--4 { right: 20px; bottom: 34px; animation-delay: 0.54s; }
.particle--5 { left: 84px; top: 8px; animation-delay: 0.72s; }
.particle--6 { left: 88px; bottom: 10px; animation-delay: 0.9s; }
.particle--7 { left: 6px; top: 88px; animation-delay: 1.08s; }
.particle--8 { right: 6px; top: 90px; animation-delay: 1.26s; }

.thinking-copy {
  min-width: 0;
}

.thinking-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  color: #2563eb;
  background: rgba(239, 246, 255, 0.92);
  font-size: 12px;
  font-weight: 800;
}

.kicker-dot,
.status-signal {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.72);
  animation: signal-jump 0.88s ease-in-out infinite;
}

.thinking-status {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  font-size: 18px;
  font-weight: 900;
}

.thinking-copy p {
  margin: 9px 0 14px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.65;
}

.doc-flashes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.doc-flashes span {
  padding: 5px 9px;
  border: 1px solid rgba(191, 219, 254, 0.9);
  border-radius: 8px;
  color: #2563eb;
  background: rgba(255, 255, 255, 0.78);
  font-size: 11px;
  font-weight: 800;
  animation: doc-flash 1.4s ease-in-out infinite;
}

.doc-flashes span:nth-child(2) { animation-delay: 0.12s; color: #dc2626; }
.doc-flashes span:nth-child(3) { animation-delay: 0.24s; color: #16a34a; }
.doc-flashes span:nth-child(4) { animation-delay: 0.36s; color: #7c3aed; }
.doc-flashes span:nth-child(5) { animation-delay: 0.48s; color: #0ea5e9; }

.knowledge-track {
  position: relative;
  z-index: 1;
  height: 8px;
  margin-top: 16px;
  border-radius: 999px;
  background: rgba(226, 232, 240, 0.82);
  overflow: hidden;
}

.track-light {
  position: absolute;
  inset: 0 auto 0 0;
  width: 44%;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent, #60a5fa, #a78bfa, transparent);
  filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.62));
  animation: track-scan 1.2s ease-in-out infinite;
}

.track-node {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.8);
  transform: translateY(-50%);
}

.track-node--one { left: 22%; }
.track-node--two { left: 55%; }
.track-node--three { left: 82%; }

.thinking-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  color: #64748b;
  font-size: 12px;
}

.trust-chip {
  color: #16a34a;
  font-weight: 800;
}

@property --border-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@keyframes border-flow {
  to { --border-angle: 360deg; }
}

@keyframes panel-scan {
  0% { transform: translateX(-120%); opacity: 0; }
  35%, 70% { opacity: 1; }
  100% { transform: translateX(120%); opacity: 0; }
}

@keyframes thinking-card-in {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes ring-rotate {
  to { transform: rotate(360deg); }
}

@keyframes ring-pulse {
  0%, 100% { opacity: 0.65; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.04); }
}

@keyframes core-breathe {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.08); }
}

@keyframes core-wave {
  from { opacity: 0.7; transform: scale(0.86); }
  to { opacity: 0; transform: scale(1.35); }
}

@keyframes node-flicker {
  0%, 100% { opacity: 0.72; filter: saturate(0.9); }
  50% { opacity: 1; filter: saturate(1.3); }
}

@keyframes beam-flow {
  from { transform: translateX(48px); opacity: 0; }
  45% { opacity: 1; }
  to { transform: translateX(0); opacity: 0; }
}

@keyframes particle-float {
  0%, 100% { opacity: 0.32; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-7px); }
}

@keyframes signal-jump {
  0%, 100% { transform: translateY(0) scale(0.85); }
  50% { transform: translateY(-2px) scale(1.18); }
}

@keyframes doc-flash {
  0%, 100% { opacity: 0.55; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-2px); }
}

@keyframes track-scan {
  from { transform: translateX(-70%); }
  to { transform: translateX(240%); }
}

@media (max-width: 720px) {
  .thinking-card {
    width: 100%;
  }

  .thinking-main {
    grid-template-columns: 1fr;
  }

  .thinking-footer {
    flex-direction: column;
  }
}
</style>
