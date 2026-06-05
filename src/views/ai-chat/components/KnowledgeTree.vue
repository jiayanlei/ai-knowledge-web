<template>
  <section class="knowledge-tree app-card">
    <div class="tree-header">
      <span>知识库目录</span>
      <el-button link type="primary" :icon="ArrowLeftBold" />
    </div>

    <el-input v-model="keyword" clearable placeholder="搜索目录名称">
      <template #prefix>
        <Search />
      </template>
      <template #suffix>
        <Filter />
      </template>
    </el-input>

    <div class="catalog-list">
      <div v-for="item in filteredCatalogs" :key="item.id" class="catalog-group">
        <button
          class="catalog-item"
          :class="{ active: item.id === activeId }"
          type="button"
          @click="handleSelect(item)"
        >
          <ArrowRight
            v-if="item.children?.length"
            class="expand-icon"
            :class="{ expanded: expandedIds.includes(item.id) }"
          />
          <span v-else class="expand-placeholder"></span>
          <span class="catalog-icon">
            <AppIcon :name="item.icon || 'Folder'" />
          </span>
          <span class="catalog-name">{{ item.name }}</span>
          <span class="catalog-count">{{ item.count }}</span>
        </button>

        <div v-if="item.children?.length && expandedIds.includes(item.id)" class="child-list">
          <button
            v-for="child in item.children"
            :key="child.id"
            class="catalog-item catalog-item--child"
            :class="{ active: child.id === activeId }"
            type="button"
            @click="handleSelect(child)"
          >
            <span class="expand-placeholder"></span>
            <span class="catalog-icon">
              <AppIcon :name="child.icon || 'Folder'" />
            </span>
            <span class="catalog-name">{{ child.name }}</span>
            <span class="catalog-count">{{ child.count }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="tag-panel">
      <div class="tag-title">
        <span>自定义标签</span>
        <el-button link type="primary">管理</el-button>
      </div>
      <div class="tag-list">
        <span v-for="tag in tags" :key="tag" class="custom-tag">{{ tag }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeftBold, ArrowRight, Filter, Search } from '@element-plus/icons-vue'
import AppIcon from '@/components/AppIcon/index.vue'
import type { KnowledgeCatalogItem } from '@/types/knowledge'

const props = defineProps<{
  catalogs: KnowledgeCatalogItem[]
  tags: string[]
}>()

const keyword = ref('')
const activeId = ref(props.catalogs[0]?.id)
const expandedIds = ref<number[]>([props.catalogs[0]?.id].filter(Boolean) as number[])

const filteredCatalogs = computed(() => {
  const value = keyword.value.trim()

  if (!value) {
    return props.catalogs
  }

  return props.catalogs.filter((item) => item.name.includes(value))
})

function handleSelect(item: KnowledgeCatalogItem) {
  activeId.value = item.id

  if (!item.children?.length) {
    return
  }

  expandedIds.value = expandedIds.value.includes(item.id)
    ? expandedIds.value.filter((id) => id !== item.id)
    : [...expandedIds.value, item.id]
}
</script>

<style scoped lang="scss">
.knowledge-tree {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  padding: 16px;
}

.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  color: #101828;
  font-size: 17px;
  font-weight: 800;
}

.catalog-list {
  flex: 1;
  min-height: 0;
  margin-top: 18px;
  overflow-y: auto;
}

.catalog-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 38px;
  margin-bottom: 6px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 9px;
  color: #344054;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.catalog-item:hover,
.catalog-item.active {
  border-color: #c9defd;
  color: #1677ff;
  background: #eaf3ff;
}

.catalog-item--child {
  padding-left: 26px;
}

.expand-icon {
  flex: 0 0 auto;
  width: 13px;
  color: #98a2b3;
  transition: transform 0.2s ease;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.expand-placeholder {
  flex: 0 0 13px;
}

.catalog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 6px;
  background: #eaf3ff;
}

.catalog-name {
  flex: 1;
  min-width: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.catalog-count {
  flex: 0 0 auto;
  min-width: 34px;
  padding: 3px 7px;
  border-radius: 999px;
  color: #667085;
  font-size: 12px;
  text-align: center;
  background: #f2f4f7;
}

.tag-panel {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #e5eaf3;
  border-radius: 14px;
  background: #fbfdff;
}

.tag-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #1f2a44;
  font-size: 13px;
  font-weight: 700;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.custom-tag {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 7px;
  color: #1677ff;
  font-size: 12px;
  background: #eaf3ff;
}

.custom-tag:nth-child(2n) {
  color: #10a37f;
  background: #eafaf5;
}

.custom-tag:nth-child(3n) {
  color: #f59e0b;
  background: #fff7e8;
}
</style>
