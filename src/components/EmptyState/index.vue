<template>
  <div class="empty-state">
    <el-empty :description="description" :image="image" :image-size="imageSize">
      <template v-if="$slots.default" #default>
        <slot />
      </template>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import emptyKnowledge from '@/assets/images/empty/empty-knowledge.png'

withDefaults(
  defineProps<{
    description?: string
    image?: string
    imageSize?: number
  }>(),
  {
    description: '暂无数据',
    image: emptyKnowledge,
    imageSize: 120
  }
)
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
