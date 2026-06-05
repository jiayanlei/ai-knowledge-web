<template>
  <img class="robot-avatar" :class="`robot-avatar--${size}`" :src="robotAvatar" alt="AI 助手" />
</template>

<script setup lang="ts">
import robotAvatar from '@/assets/images/robot/robot-avatar.png'

withDefaults(
  defineProps<{
    size?: 'small' | 'medium' | 'large'
  }>(),
  {
    size: 'medium'
  }
)
</script>

<style scoped lang="scss">
.robot-avatar {
  display: block;
  border-radius: 50%;
  object-fit: cover;
  background: #edf5ff;
  box-shadow: 0 8px 18px rgba(22, 119, 255, 0.14);
}

.robot-avatar--small {
  width: 28px;
  height: 28px;
}

.robot-avatar--medium {
  width: 38px;
  height: 38px;
}

.robot-avatar--large {
  width: 56px;
  height: 56px;
}
</style>
