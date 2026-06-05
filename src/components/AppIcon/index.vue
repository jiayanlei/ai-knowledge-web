<template>
  <component :is="iconComponent" v-if="iconComponent" class="app-icon" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as Icons from '@element-plus/icons-vue'

const props = defineProps<{
  name: string
}>()

const iconComponent = computed(() => {
  return Icons[props.name as keyof typeof Icons]
})
</script>

<style scoped lang="scss">
.app-icon {
  width: 1em;
  height: 1em;
}
</style>
