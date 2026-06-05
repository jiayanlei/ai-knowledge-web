<template>
  <section class="home-banner" aria-label="AI 知识中枢总览">
    <div class="banner-ambient" aria-hidden="true">
      <span class="ambient-line ambient-line--one" />
      <span class="ambient-line ambient-line--two" />
      <span class="ambient-dot ambient-dot--one" />
      <span class="ambient-dot ambient-dot--two" />
      <span class="ambient-dot ambient-dot--three" />
    </div>

    <div class="banner-copy">
      <div class="banner-kicker">
        <span />
        AI KNOWLEDGE COMMAND
      </div>

      <h1>智能知识中枢</h1>
      <p>把散落的制度、文档、问答和经验连接成一张可检索、可协作、可追溯的企业知识网络。</p>

      <div class="banner-footer">
        <div class="banner-actions">
          <button type="button" class="banner-button banner-button--primary" @click="goPage('/ai-chat')">
            <AppIcon name="ChatDotRound" />
            进入 AI 问答
          </button>
          <button type="button" class="banner-button" @click="goPage('/knowledge-manage')">
            <AppIcon name="FolderOpened" />
            管理知识库
          </button>
        </div>

        <div class="banner-metrics">
          <span v-for="item in metrics" :key="item.label">
            <strong>{{ item.value }}</strong>
            <em>{{ item.label }}</em>
          </span>
        </div>
      </div>
    </div>

    <div class="banner-visual" aria-hidden="true">
      <div class="knowledge-core">
        <span class="core-ring core-ring--outer" />
        <span class="core-ring core-ring--middle" />
        <span class="core-ring core-ring--inner" />

        <span class="data-node data-node--one" />
        <span class="data-node data-node--two" />
        <span class="data-node data-node--three" />
        <span class="data-node data-node--four" />

        <div class="core-chip">
          <span class="chip-grid" />
          <strong>AI</strong>
        </div>
      </div>

      <div class="floating-card floating-card--left">
        <AppIcon name="Document" />
        <span>文档索引</span>
      </div>
      <div class="floating-card floating-card--right">
        <AppIcon name="CircleCheckFilled" />
        <span>命中率 96%</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon/index.vue'

const router = useRouter()

const metrics = [
  { value: '1,258', label: '知识文档' },
  { value: '128', label: '今日问答' },
  { value: '96%', label: '命中率' }
]

function goPage(path: string) {
  router.push(path)
}
</script>

<style scoped lang="scss">
.home-banner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  min-height: 236px;
  overflow: hidden;
  padding: 28px 32px;
  border: 1px solid rgba(186, 211, 248, 0.74);
  border-radius: 18px;
  color: #10204f;
  background:
    radial-gradient(circle at 20% 26%, rgba(54, 211, 255, 0.22), transparent 28%),
    radial-gradient(circle at 78% 20%, rgba(130, 97, 255, 0.2), transparent 30%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(236, 246, 255, 0.74) 54%, rgba(244, 241, 255, 0.86));
  box-shadow:
    0 20px 48px rgba(46, 82, 152, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.84);
}

.home-banner,
.home-banner * {
  box-sizing: border-box;
}

.banner-ambient,
.banner-ambient::before,
.ambient-line,
.ambient-dot {
  position: absolute;
  pointer-events: none;
}

.banner-ambient {
  inset: 0;
  overflow: hidden;
}

.banner-ambient::before {
  inset: -30%;
  content: "";
  opacity: 0.5;
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
  background-size: 44px 44px;
  transform: rotate(-8deg);
}

.ambient-line {
  width: 520px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(54, 211, 255, 0.42), transparent);
}

.ambient-line--one {
  left: 34%;
  top: 38%;
  transform: rotate(-16deg);
}

.ambient-line--two {
  right: -10%;
  bottom: 28%;
  transform: rotate(18deg);
}

.ambient-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #39dfff;
  box-shadow: 0 0 22px rgba(57, 223, 255, 0.8);
  animation: dot-float 4.8s ease-in-out infinite;
}

.ambient-dot--one {
  left: 42%;
  top: 28%;
}

.ambient-dot--two {
  right: 27%;
  top: 18%;
  background: #8c7bff;
  animation-delay: -1.6s;
}

.ambient-dot--three {
  right: 16%;
  bottom: 20%;
  animation-delay: -2.7s;
}

.banner-copy,
.banner-visual,
.banner-metrics {
  position: relative;
  z-index: 1;
}

.banner-copy {
  align-self: center;
  min-width: 0;
  max-width: 660px;
}

.banner-kicker {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 28px;
  padding: 0 12px;
  border: 1px solid rgba(91, 150, 255, 0.22);
  border-radius: 999px;
  color: #315fc8;
  background: rgba(255, 255, 255, 0.54);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2ddfff;
    box-shadow: 0 0 14px rgba(45, 223, 255, 0.82);
  }
}

.banner-copy h1 {
  margin: 16px 0 0;
  color: #071d58;
  font-size: clamp(30px, 3.1vw, 44px);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: 0;
}

.banner-copy p {
  max-width: 580px;
  margin: 12px 0 0;
  color: #50617f;
  font-size: 15px;
  line-height: 1.75;
}

.banner-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 10px 14px;
}

.banner-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.banner-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 15px;
  border: 1px solid rgba(90, 133, 255, 0.34);
  border-radius: 12px;
  color: #245fd6;
  background: rgba(255, 255, 255, 0.58);
  box-shadow: 0 10px 24px rgba(46, 82, 152, 0.08);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  .app-icon {
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: rgba(46, 115, 255, 0.62);
    box-shadow: 0 14px 28px rgba(46, 82, 152, 0.12);
    transform: translateY(-1px);
  }
}

.banner-button--primary {
  border-color: transparent;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.24), transparent 38%),
    linear-gradient(135deg, #2fdfff, #2f77ff 52%, #7a5cff);
  box-shadow: 0 14px 30px rgba(47, 119, 255, 0.25);
}

.banner-visual {
  align-self: center;
  justify-self: end;
  width: 330px;
  height: 190px;
}

.knowledge-core {
  position: absolute;
  right: 38px;
  top: 50%;
  width: 180px;
  height: 180px;
  transform: translateY(-50%);
}

.core-ring,
.data-node,
.core-chip {
  position: absolute;
  left: 50%;
  top: 50%;
}

.core-ring {
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.core-ring--outer {
  width: 176px;
  height: 176px;
  background: conic-gradient(from 30deg, transparent 0 18%, rgba(47, 223, 255, 0.62), transparent 34% 62%, rgba(126, 92, 255, 0.58), transparent 82% 100%);
  -webkit-mask: radial-gradient(circle, transparent 62%, #000 63% 68%, transparent 69%);
  mask: radial-gradient(circle, transparent 62%, #000 63% 68%, transparent 69%);
  animation: ring-spin 12s linear infinite;
}

.core-ring--middle {
  width: 132px;
  height: 132px;
  border: 1px dashed rgba(47, 119, 255, 0.3);
  animation: ring-spin-reverse 14s linear infinite;
}

.core-ring--inner {
  width: 92px;
  height: 92px;
  border: 1px solid rgba(69, 219, 255, 0.34);
  background: radial-gradient(circle, rgba(69, 219, 255, 0.1), transparent 68%);
  animation: ring-pulse 3.8s ease-in-out infinite;
}

.core-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  overflow: hidden;
  border: 1px solid rgba(201, 242, 255, 0.88);
  border-radius: 22px;
  background:
    radial-gradient(circle at 35% 28%, rgba(125, 247, 255, 0.88), transparent 20%),
    linear-gradient(135deg, #1346ad, #1f72ff 54%, #37dcff);
  box-shadow:
    0 0 34px rgba(55, 205, 255, 0.42),
    0 18px 44px rgba(47, 102, 210, 0.22);
  transform: translate(-50%, -50%);

  strong {
    position: relative;
    z-index: 1;
    color: #fff;
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 0;
  }
}

.chip-grid {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image:
    linear-gradient(rgba(236, 253, 255, 0.26) 1px, transparent 1px),
    linear-gradient(90deg, rgba(236, 253, 255, 0.26) 1px, transparent 1px);
  background-size: 14px 14px;
}

.data-node {
  width: 11px;
  height: 11px;
  border: 2px solid rgba(255, 255, 255, 0.88);
  border-radius: 50%;
  background: #3bdfff;
  box-shadow: 0 0 18px rgba(59, 223, 255, 0.8);
}

.data-node--one {
  transform: translate(-82px, -40px);
}

.data-node--two {
  background: #806cff;
  transform: translate(56px, -78px);
}

.data-node--three {
  transform: translate(82px, 36px);
}

.data-node--four {
  background: #4d75ff;
  transform: translate(-48px, 82px);
}

.floating-card {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid rgba(196, 216, 246, 0.74);
  border-radius: 13px;
  color: #17376e;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 12px 30px rgba(42, 86, 166, 0.12);
  font-size: 13px;
  font-weight: 800;
  backdrop-filter: blur(16px);

  .app-icon {
    width: 16px;
    height: 16px;
    color: #2f77ff;
  }
}

.floating-card--left {
  left: 4px;
  top: 36px;
}

.floating-card--right {
  right: 4px;
  bottom: 30px;
}

.banner-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  pointer-events: none;
}

.banner-metrics span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  height: 30px;
  padding: 0 10px;
  border: 1px solid rgba(196, 216, 246, 0.58);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.48);

  strong {
    color: #164fc4;
    font-size: 13px;
    font-weight: 900;
  }

  em {
    color: #61718d;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
  }
}

@keyframes dot-float {
  50% {
    opacity: 0.55;
    transform: translateY(-10px) scale(0.86);
  }
}

@keyframes ring-spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes ring-spin-reverse {
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes ring-pulse {
  50% {
    opacity: 0.68;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@media (max-width: 1180px) {
  .home-banner {
    grid-template-columns: minmax(0, 1fr) 280px;
    min-height: 230px;
    padding: 26px;
  }

  .banner-visual {
    width: 280px;
  }

  .knowledge-core {
    right: 18px;
  }
}

@media (max-width: 860px) {
  .home-banner {
    grid-template-columns: minmax(0, 1fr);
    min-height: auto;
    padding: 24px 22px;
  }

  .banner-visual {
    display: none;
  }

  .banner-copy {
    max-width: none;
  }

  .banner-copy p {
    max-width: none;
  }

  .banner-metrics {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .home-banner {
    padding: 20px 18px;
  }

  .banner-kicker {
    max-width: 100%;
    font-size: 11px;
  }

  .banner-actions {
    gap: 9px;
  }

  .banner-button {
    flex: 1 1 150px;
  }

  .banner-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .banner-metrics span {
    justify-content: center;
    height: auto;
    min-height: 42px;
    padding: 6px 8px;
    flex-direction: column;
    gap: 2px;
  }
}
</style>
