<template>
  <section class="chat-welcome" :style="{ backgroundImage: welcomeBackground }">
    <img class="welcome-robot" :src="robotWelcome" alt="企业 AI 助手" />
    <div class="welcome-content">
      <h1>你好，我是企业 AI 助手</h1>
      <p>我可以帮你查询公司知识、解答疑问、提供专业建议</p>
      <div class="ability-list">
        <span><Lock />基于企业知识库</span>
        <span><CircleCheck />安全可靠</span>
        <span><Medal />专业准确</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CircleCheck, Lock, Medal } from '@element-plus/icons-vue'
import robotWelcome from '@/assets/images/robot/robot-welcome.png'
import welcomeBg from '@/assets/images/banner/ai-welcome-bg.png'

const welcomeBackground = `linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.44)), url(${welcomeBg})`
</script>

<style scoped lang="scss">
.chat-welcome {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 148px;
  padding: 22px 28px;
  border: 1px solid #d7e7ff;
  border-radius: 16px;
  overflow: hidden;
  background-color: #f5f9ff;
  background-position: center;
  background-size: cover;
  box-shadow: 0 14px 36px rgba(22, 119, 255, 0.1);
}

.welcome-robot {
  flex: 0 0 auto;
  width: 92px;
  height: 92px;
  object-fit: contain;
  filter: drop-shadow(0 12px 18px rgba(22, 119, 255, 0.18));
}

.welcome-content {
  position: relative;
  z-index: 1;
  min-width: 0;
}

h1 {
  margin: 0;
  color: #07163a;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.35;
}

p {
  max-width: 640px;
  margin: 8px 0 14px;
  color: #344054;
  line-height: 1.6;
}

.ability-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.ability-list span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #456179;
  font-size: 13px;
  font-weight: 600;
}

.ability-list :deep(svg) {
  width: 14px;
  color: #1677ff;
}
</style>
