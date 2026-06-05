<template>
  <Transition name="global-loading-fade">
    <div
      v-if="globalLoadingState.visible"
      class="global-loading"
      role="status"
      aria-live="polite"
      :aria-label="globalLoadingState.text"
    >
      <div class="loading-panel">
        <div class="energy-field" aria-hidden="true">
          <span class="energy-ring energy-ring--outer" />
          <span class="energy-ring energy-ring--middle" />
          <span class="energy-ring energy-ring--inner" />

          <span v-for="item in particles" :key="item" class="particle" :class="`particle--${item}`" />

          <div class="energy-core">
            <span class="core-grid" />
            <span class="core-pulse" />
            <span class="core-dot" />
          </div>
        </div>

        <div class="loading-copy">
          <p>{{ globalLoadingState.text }}</p>
          <span class="typing-cursor" />
        </div>

        <div class="scan-track" aria-hidden="true">
          <span class="scan-line" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { globalLoadingState } from '@/utils/globalLoading'

const particles = [1, 2, 3, 4, 5, 6, 7, 8, 9]
</script>

<style scoped lang="scss">
.global-loading {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 42%, rgba(76, 117, 255, 0.16), transparent 36%),
    linear-gradient(135deg, rgba(234, 245, 255, 0.78), rgba(240, 237, 255, 0.68));
  backdrop-filter: blur(14px) saturate(130%);
  pointer-events: auto;
}

.global-loading::before,
.global-loading::after {
  position: absolute;
  content: "";
  pointer-events: none;
}

.global-loading::before {
  inset: 0;
  opacity: 0.55;
  background-image:
    linear-gradient(rgba(80, 144, 255, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(80, 144, 255, 0.12) 1px, transparent 1px);
  background-size: 46px 46px;
  -webkit-mask-image: radial-gradient(circle at center, #000 0 36%, transparent 72%);
  mask-image: radial-gradient(circle at center, #000 0 36%, transparent 72%);
}

.global-loading::after {
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(38, 198, 255, 0.2), transparent 66%);
  animation: backdrop-breathe 4.8s ease-in-out infinite;
}

.loading-panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(440px, 100%);
  padding: 34px 28px 32px;
  border: 1px solid rgba(201, 218, 247, 0.62);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.66), rgba(255, 255, 255, 0.32)),
    rgba(238, 246, 255, 0.42);
  box-shadow:
    0 26px 80px rgba(59, 103, 180, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.energy-field {
  position: relative;
  width: 240px;
  height: 240px;
}

.energy-ring,
.energy-core,
.particle {
  position: absolute;
  left: 50%;
  top: 50%;
}

.energy-ring {
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.energy-ring--outer {
  width: 216px;
  height: 216px;
  border: 1px solid rgba(92, 128, 255, 0.22);
  background:
    conic-gradient(from 90deg, transparent 0 18%, rgba(44, 214, 255, 0.72), transparent 34% 58%, rgba(139, 111, 255, 0.58), transparent 76% 100%);
  -webkit-mask: radial-gradient(circle, transparent 62%, #000 63% 70%, transparent 71%);
  mask: radial-gradient(circle, transparent 62%, #000 63% 70%, transparent 71%);
  animation: ring-spin 8s linear infinite;
}

.energy-ring--middle {
  width: 174px;
  height: 174px;
  border: 1px dashed rgba(61, 128, 255, 0.32);
  box-shadow: 0 0 36px rgba(45, 168, 255, 0.18);
  animation: ring-spin-reverse 10s linear infinite;
}

.energy-ring--inner {
  width: 138px;
  height: 138px;
  border: 1px solid rgba(90, 221, 255, 0.38);
  background: radial-gradient(circle, rgba(60, 214, 255, 0.1), transparent 68%);
  animation: ring-breathe 3.8s ease-in-out infinite;
}

.energy-core {
  width: 108px;
  height: 108px;
  overflow: hidden;
  border: 1px solid rgba(172, 229, 255, 0.86);
  border-radius: 32px;
  background:
    radial-gradient(circle at 42% 34%, rgba(117, 242, 255, 0.86), transparent 18%),
    radial-gradient(circle at 68% 70%, rgba(118, 102, 255, 0.52), transparent 24%),
    linear-gradient(135deg, #0c3c94 0%, #123ad7 52%, #37d7ff 100%);
  box-shadow:
    0 0 34px rgba(45, 193, 255, 0.58),
    0 0 72px rgba(91, 101, 255, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.48);
  transform: translate(-50%, -50%);
  animation: core-breathe 2.8s ease-in-out infinite;
}

.core-grid,
.core-pulse,
.core-dot {
  position: absolute;
  inset: 0;
}

.core-grid {
  opacity: 0.55;
  background-image:
    linear-gradient(rgba(220, 252, 255, 0.26) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220, 252, 255, 0.26) 1px, transparent 1px),
    linear-gradient(135deg, transparent 0 44%, rgba(220, 252, 255, 0.42) 45% 47%, transparent 48% 100%);
  background-size: 18px 18px, 18px 18px, 100% 100%;
}

.core-pulse {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.48), transparent);
  transform: translateX(-100%);
  animation: core-scan 2.4s ease-in-out infinite;
}

.core-dot {
  inset: 50% auto auto 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #dffcff;
  box-shadow:
    -28px -18px 0 rgba(215, 251, 255, 0.86),
    26px -20px 0 rgba(189, 226, 255, 0.78),
    30px 24px 0 rgba(226, 218, 255, 0.72),
    -26px 24px 0 rgba(178, 241, 255, 0.72);
  transform: translate(-50%, -50%);
  animation: dot-pulse 2.2s ease-in-out infinite;
}

.particle {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #81f4ff;
  box-shadow: 0 0 16px rgba(91, 217, 255, 0.85);
  animation: particle-float 4.5s ease-in-out infinite;
}

.particle::after {
  position: absolute;
  left: 5px;
  top: 4px;
  width: 46px;
  height: 1px;
  content: "";
  background: linear-gradient(90deg, rgba(94, 229, 255, 0.48), transparent);
  transform-origin: left center;
}

.particle--1 {
  transform: translate(-112px, -72px);
}

.particle--1::after {
  transform: rotate(24deg);
}

.particle--2 {
  background: #9b8dff;
  transform: translate(92px, -86px);
  animation-delay: -0.7s;
}

.particle--2::after {
  width: 38px;
  transform: rotate(138deg);
}

.particle--3 {
  transform: translate(112px, 8px);
  animation-delay: -1.2s;
}

.particle--3::after {
  width: 42px;
  transform: rotate(174deg);
}

.particle--4 {
  background: #6ba2ff;
  transform: translate(72px, 86px);
  animation-delay: -1.8s;
}

.particle--4::after {
  width: 34px;
  transform: rotate(-142deg);
}

.particle--5 {
  transform: translate(-94px, 72px);
  animation-delay: -2.4s;
}

.particle--5::after {
  width: 42px;
  transform: rotate(-32deg);
}

.particle--6 {
  width: 7px;
  height: 7px;
  background: #b6a5ff;
  transform: translate(-126px, 10px);
  animation-delay: -3s;
}

.particle--6::after {
  width: 32px;
  transform: rotate(-8deg);
}

.particle--7 {
  width: 7px;
  height: 7px;
  transform: translate(-40px, -116px);
  animation-delay: -2s;
}

.particle--7::after {
  width: 30px;
  transform: rotate(78deg);
}

.particle--8 {
  width: 7px;
  height: 7px;
  background: #77d8ff;
  transform: translate(24px, 118px);
  animation-delay: -3.5s;
}

.particle--8::after {
  width: 28px;
  transform: rotate(-84deg);
}

.particle--9 {
  width: 6px;
  height: 6px;
  background: #d9f8ff;
  transform: translate(128px, -36px);
  animation-delay: -2.8s;
}

.particle--9::after {
  width: 24px;
  transform: rotate(156deg);
}

.loading-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  margin-top: 10px;
  color: #102a69;

  p {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: 0;
    text-shadow: 0 0 18px rgba(55, 135, 255, 0.18);
    animation: text-breathe 2.6s ease-in-out infinite;
  }
}

.typing-cursor {
  width: 2px;
  height: 18px;
  margin-left: 8px;
  border-radius: 2px;
  background: #28d7ff;
  box-shadow: 0 0 12px rgba(40, 215, 255, 0.8);
  animation: cursor-blink 1s steps(2, end) infinite;
}

.scan-track {
  position: relative;
  width: min(280px, 82vw);
  height: 6px;
  margin-top: 18px;
  overflow: hidden;
  border: 1px solid rgba(105, 162, 255, 0.34);
  border-radius: 999px;
  background:
    linear-gradient(90deg, rgba(68, 112, 255, 0.12), rgba(46, 216, 255, 0.18), rgba(139, 111, 255, 0.12)),
    rgba(255, 255, 255, 0.34);
}

.scan-line {
  position: absolute;
  inset: -1px auto -1px 0;
  width: 42%;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent, #4deaff, #5c70ff, transparent);
  box-shadow: 0 0 22px rgba(71, 219, 255, 0.8);
  animation: scan-move 1.8s ease-in-out infinite;
}

.global-loading-fade-enter-active,
.global-loading-fade-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.global-loading-fade-enter-from,
.global-loading-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

@keyframes backdrop-breathe {
  0%,
  100% {
    opacity: 0.78;
    transform: scale(0.92);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
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

@keyframes ring-breathe {
  0%,
  100% {
    opacity: 0.72;
    transform: translate(-50%, -50%) scale(0.94);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes core-breathe {
  0%,
  100% {
    box-shadow:
      0 0 30px rgba(45, 193, 255, 0.5),
      0 0 72px rgba(91, 101, 255, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.48);
    transform: translate(-50%, -50%) scale(0.96);
  }

  50% {
    box-shadow:
      0 0 48px rgba(45, 230, 255, 0.72),
      0 0 92px rgba(111, 89, 255, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.62);
    transform: translate(-50%, -50%) scale(1.04);
  }
}

@keyframes core-scan {
  0% {
    transform: translateX(-120%);
  }

  54%,
  100% {
    transform: translateX(120%);
  }
}

@keyframes dot-pulse {
  50% {
    opacity: 0.62;
    transform: translate(-50%, -50%) scale(1.18);
  }
}

@keyframes particle-float {
  0%,
  100% {
    opacity: 0.62;
    filter: blur(0);
  }

  50% {
    opacity: 1;
    filter: blur(0.2px);
    margin-top: -10px;
  }
}

@keyframes text-breathe {
  50% {
    color: #1b5ff0;
  }
}

@keyframes cursor-blink {
  50% {
    opacity: 0;
  }
}

@keyframes scan-move {
  0% {
    transform: translateX(-105%);
  }

  100% {
    transform: translateX(250%);
  }
}

@media (max-width: 640px) {
  .global-loading {
    padding: 18px;
  }

  .loading-panel {
    padding: 28px 18px 26px;
    border-radius: 24px;
  }

  .energy-field {
    width: 210px;
    height: 210px;
    transform: scale(0.9);
  }

  .loading-copy p {
    font-size: 15px;
  }
}
</style>
