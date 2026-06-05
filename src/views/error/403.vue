<template>
  <PageContainer>
    <div class="error-page app-card">
      <h1>403</h1>
      <p>当前账号暂无访问权限。</p>
      <el-button type="primary" @click="$router.push('/ai-chat')">返回 AI问答</el-button>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/PageContainer/index.vue'
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  padding: 48px;

  h1 {
    margin: 0;
    color: #1677ff;
    font-size: 68px;
  }

  p {
    margin: 8px 0 24px;
    color: #6b7280;
  }
}
</style>
