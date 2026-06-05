<template>
  <section class="page-container">
    <slot />
  </section>
</template>

<style scoped lang="scss">
.page-container {
  height: 100%;
  min-width: 0;
  padding: var(--app-page-padding);
  overflow: auto;
}
</style>
