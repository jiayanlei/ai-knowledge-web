<template>
  <PageContainer>
    <div class="control-center">

      <!-- ============================== -->
      <!-- Header                         -->
      <!-- ============================== -->
      <section class="cc-header app-card">
        <div class="header-inner">
          <div class="header-copy">
            <div class="header-kicker"><span />SYSTEM CONTROL CENTER</div>
            <h1>系统控制中心</h1>
            <p>全局状态监控、配置管理和系统健康检测一站式入口。</p>
          </div>
        </div>
      </section>

      <!-- ============================== -->
      <!-- Status Overview Cards           -->
      <!-- ============================== -->
      <section class="status-grid">
        <div v-for="item in statusCards" :key="item.key" class="status-card app-card">
          <div class="status-icon-wrap" :class="item.tone">
            <AppIcon :name="item.icon" />
          </div>
          <div class="status-body">
            <span class="status-label">{{ item.label }}</span>
            <strong class="status-value">{{ item.value }}</strong>
          </div>
          <span class="status-dot" :class="'dot--' + item.status">
            <i class="dot-pulse" />
          </span>
        </div>
      </section>

      <!-- ============================== -->
      <!-- Main Body: Left + Health Panel  -->
      <!-- ============================== -->
      <section class="cc-body">
        <div class="cc-main">

          <!-- Category Cards Grid -->
          <div class="category-grid">
            <button
              v-for="cat in categoryCards"
              :key="cat.key"
              type="button"
              class="cat-card app-card"
              :class="{ 'is-active': activeCategory === cat.key }"
              @click="activeCategory = activeCategory === cat.key ? null : cat.key"
            >
              <div class="cat-icon" :class="cat.tone">
                <AppIcon :name="cat.icon" />
              </div>
              <div class="cat-text">
                <strong>{{ cat.name }}</strong>
                <span>{{ cat.desc }}</span>
              </div>
              <span class="cat-arrow" :class="{ 'is-up': activeCategory === cat.key }">
                <AppIcon name="ArrowDown" />
              </span>
            </button>
          </div>

          <!-- Active Configuration Panel -->
          <Transition name="panel-slide">
            <div v-if="activeCategory" class="config-panel app-card">
              <div class="panel-head">
                <h2>{{ activeCategoryInfo?.name }}<small>{{ activeCategoryInfo?.desc }}</small></h2>
                <el-button text @click="activeCategory = null">
                  <AppIcon name="Close" /> 收起
                </el-button>
              </div>

              <div class="panel-scroll">
                <section class="panel-section">
                  <!-- ====== 基础配置 ====== -->
                  <div v-if="activeCategory === 'basic'" class="cfg-form">
                    <el-form :model="basicConfig" label-width="140px" class="settings-form">
                      <el-form-item label="系统名称">
                        <el-input v-model="basicConfig.systemName" placeholder="请输入系统名称" />
                      </el-form-item>
                      <el-form-item label="系统简称">
                        <el-input v-model="basicConfig.systemShortName" placeholder="请输入系统简称" />
                      </el-form-item>
                      <el-form-item label="系统 Logo">
                        <el-input v-model="basicConfig.systemLogo" placeholder="Logo 文件路径">
                          <template #append>
                            <el-button @click="ElMessage.info('文件选择功能待接入')">浏览</el-button>
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="系统描述">
                        <el-input v-model="basicConfig.systemDescription" type="textarea" :rows="3" placeholder="请输入系统描述" />
                      </el-form-item>
                      <el-form-item label="默认首页">
                        <el-input v-model="basicConfig.defaultHomePage" placeholder="例如 /dashboard" />
                      </el-form-item>
                      <el-form-item label="系统状态">
                        <el-select v-model="basicConfig.systemStatus" placeholder="请选择系统状态">
                          <el-option value="running" label="正常运行" />
                          <el-option value="maintenance" label="维护中" />
                          <el-option value="offline" label="已下线" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="维护公告">
                        <el-input v-model="basicConfig.maintenanceNotice" type="textarea" :rows="2" placeholder="维护公告内容（留空则不展示）" />
                      </el-form-item>
                      <el-form-item label="管理员联系方式">
                        <el-input v-model="basicConfig.adminContact" placeholder="邮箱或电话" />
                      </el-form-item>
                    </el-form>
                  </div>

                  <!-- ====== 模型配置 ====== -->
                  <div v-if="activeCategory === 'model'" class="cfg-form">
                    <el-form :model="modelConfig" label-width="160px" class="settings-form">
                      <el-form-item label="模型供应商">
                        <el-select v-model="modelConfig.provider" placeholder="请选择供应商">
                          <el-option v-for="opt in providerOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="模型名称">
                        <el-input v-model="modelConfig.modelName" placeholder="例如 GPT-4o" />
                      </el-form-item>
                      <el-form-item label="API 地址">
                        <el-input v-model="modelConfig.apiUrl" placeholder="https://api.example.com/v1" />
                      </el-form-item>
                      <el-form-item label="API Key">
                        <el-input v-model="modelConfig.apiKey" type="password" show-password placeholder="sk-****" />
                      </el-form-item>
                      <el-form-item label="最大上下文长度">
                        <el-slider v-model="modelConfig.maxContextLength" :min="1024" :max="32768" :step="1024" show-input />
                      </el-form-item>
                      <el-form-item label="回答温度">
                        <el-slider v-model="modelConfig.temperature" :min="0" :max="2" :step="0.1" show-input />
                      </el-form-item>
                      <el-form-item label="最大输出长度">
                        <el-slider v-model="modelConfig.maxOutputLength" :min="256" :max="8192" :step="256" show-input />
                      </el-form-item>
                      <el-form-item label="启用流式输出">
                        <el-switch v-model="modelConfig.enableStreaming" />
                      </el-form-item>
                      <el-form-item label="启用模型失败自动降级">
                        <el-switch v-model="modelConfig.enableFailover" />
                      </el-form-item>
                      <el-form-item v-if="modelConfig.enableFailover" label="备用模型">
                        <el-input v-model="modelConfig.fallbackModel" placeholder="例如 GPT-3.5-turbo" />
                      </el-form-item>
                      <el-form-item label=" ">
                        <el-button type="primary" @click="handleTestConnection">测试连接</el-button>
                      </el-form-item>
                    </el-form>
                  </div>

                  <!-- ====== 知识策略 ====== -->
                  <div v-if="activeCategory === 'knowledge'" class="cfg-form">
                    <el-form :model="knowledgeStrategy" label-width="160px" class="settings-form">
                      <el-form-item label="知识入库方式">
                        <el-select v-model="knowledgeStrategy.ingestMethod">
                          <el-option v-for="opt in ingestOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="支持文件类型">
                        <el-checkbox-group v-model="knowledgeStrategy.supportedFileTypes">
                          <el-checkbox v-for="t in fileTypeOptions" :key="t" :value="t" :label="t.toUpperCase()" />
                        </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="单文件最大上传大小">
                        <el-input-number v-model="knowledgeStrategy.maxFileSize" :min="1" :max="500" :step="10" />
                        <span class="form-suffix">MB</span>
                      </el-form-item>
                      <el-form-item label="知识切片大小">
                        <el-input-number v-model="knowledgeStrategy.chunkSize" :min="128" :max="4096" :step="128" />
                        <span class="form-suffix">tokens</span>
                      </el-form-item>
                      <el-form-item label="切片重叠长度">
                        <el-input-number v-model="knowledgeStrategy.chunkOverlap" :min="0" :max="512" :step="16" />
                        <span class="form-suffix">tokens</span>
                      </el-form-item>
                      <el-form-item label="开启自动摘要">
                        <el-switch v-model="knowledgeStrategy.enableAutoSummary" />
                      </el-form-item>
                      <el-form-item label="开启自动标签">
                        <el-switch v-model="knowledgeStrategy.enableAutoTag" />
                      </el-form-item>
                      <el-form-item label="开启重复内容检测">
                        <el-switch v-model="knowledgeStrategy.enableDuplicateDetection" />
                      </el-form-item>
                      <el-form-item label="知识审核方式">
                        <el-select v-model="knowledgeStrategy.reviewMethod">
                          <el-option v-for="opt in reviewOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="知识更新策略">
                        <el-select v-model="knowledgeStrategy.updateStrategy">
                          <el-option v-for="opt in updateStrategyOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="知识过期提醒">
                        <el-switch v-model="knowledgeStrategy.enableExpiryReminder" />
                      </el-form-item>
                      <el-form-item v-if="knowledgeStrategy.enableExpiryReminder" label="过期提醒周期">
                        <el-input-number v-model="knowledgeStrategy.expiryReminderDays" :min="7" :max="365" :step="7" />
                        <span class="form-suffix">天</span>
                      </el-form-item>
                    </el-form>
                  </div>

                  <!-- ====== 权限与安全 ====== -->
                  <div v-if="activeCategory === 'security'" class="cfg-form">
                    <el-form :model="securityConfig" label-width="160px" class="settings-form">
                      <el-form-item label="默认用户角色">
                        <el-select v-model="securityConfig.defaultRole">
                          <el-option v-for="opt in roleOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="开启菜单权限">
                        <el-switch v-model="securityConfig.enableMenuPermission" />
                      </el-form-item>
                      <el-form-item label="开启按钮权限">
                        <el-switch v-model="securityConfig.enableButtonPermission" />
                      </el-form-item>
                      <el-form-item label="开启数据权限">
                        <el-switch v-model="securityConfig.enableDataPermission" />
                      </el-form-item>
                      <el-form-item label="知识库访问范围">
                        <el-select v-model="securityConfig.knowledgeAccessScope">
                          <el-option v-for="opt in accessScopeOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="团队资产库访问范围">
                        <el-select v-model="securityConfig.teamAssetAccessScope">
                          <el-option v-for="opt in accessScopeOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="敏感词过滤">
                        <el-switch v-model="securityConfig.sensitiveWordFilter" />
                      </el-form-item>
                      <el-form-item label="敏感内容审核">
                        <el-switch v-model="securityConfig.sensitiveContentReview" />
                      </el-form-item>
                      <el-form-item label="登录过期时间">
                        <el-input-number v-model="securityConfig.loginExpireHours" :min="1" :max="720" :step="1" />
                        <span class="form-suffix">小时</span>
                      </el-form-item>
                      <el-form-item label="允许多端登录">
                        <el-switch v-model="securityConfig.allowMultiDevice" />
                      </el-form-item>
                      <el-form-item label="记录操作日志">
                        <el-switch v-model="securityConfig.recordOperationLog" />
                      </el-form-item>
                    </el-form>
                  </div>

                  <!-- ====== 系统偏好 ====== -->
                  <div v-if="activeCategory === 'preference'" class="cfg-form">
                    <el-form :model="systemPreference" label-width="160px" class="settings-form">
                      <el-form-item label="默认主题">
                        <el-select v-model="systemPreference.defaultTheme">
                          <el-option v-for="opt in themeOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="主题色">
                        <el-input v-model="systemPreference.themeColor" placeholder="#1677ff" />
                      </el-form-item>
                      <el-form-item label="默认布局">
                        <el-select v-model="systemPreference.defaultLayout">
                          <el-option v-for="opt in layoutOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="默认分页条数">
                        <el-input-number v-model="systemPreference.defaultPageSize" :min="10" :max="100" :step="10" />
                      </el-form-item>
                      <el-form-item label="默认语言">
                        <el-select v-model="systemPreference.defaultLanguage">
                          <el-option v-for="opt in languageOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="显示 Logo">
                        <el-switch v-model="systemPreference.showLogo" />
                      </el-form-item>
                      <el-form-item label="显示面包屑">
                        <el-switch v-model="systemPreference.showBreadcrumb" />
                      </el-form-item>
                      <el-form-item label="显示多标签页">
                        <el-switch v-model="systemPreference.showMultiTab" />
                      </el-form-item>
                      <el-form-item label="开启页面缓存">
                        <el-switch v-model="systemPreference.enablePageCache" />
                      </el-form-item>
                      <el-form-item label="开启全局加载">
                        <el-switch v-model="systemPreference.enableGlobalLoading" />
                      </el-form-item>
                      <el-form-item label="开启过渡动画">
                        <el-switch v-model="systemPreference.enableAnimation" />
                      </el-form-item>
                    </el-form>
                  </div>

                  <!-- ====== 系统维护 ====== -->
                  <div v-if="activeCategory === 'maintenance'" class="cfg-form">
                    <div class="maint-grid">
                      <button
                        v-for="act in maintenanceActions"
                        :key="act.key"
                        type="button"
                        class="maint-btn app-card"
                        @click="act.handler"
                      >
                        <AppIcon :name="act.icon" />
                        <strong>{{ act.name }}</strong>
                        <span>{{ act.desc }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Panel Actions -->
                  <div v-if="activeCategory !== 'maintenance'" class="panel-actions">
                    <el-button type="primary" @click="handleSave">保存配置</el-button>
                    <el-button @click="handleReset">重置</el-button>
                    <el-button @click="handleRestoreDefault">恢复默认</el-button>
                  </div>
                </section>

              </div>
            </div>
          </Transition>
        </div>

        <!-- ============================== -->
        <!-- Health Score Panel              -->
        <!-- ============================== -->
        <aside class="health-panel app-card">
          <div class="hp-header">
            <h3><AppIcon name="Monitor" /> 配置健康度</h3>
          </div>

          <!-- Score Ring -->
          <div class="hp-ring-wrap">
            <svg class="hp-ring" viewBox="0 0 140 140">
              <circle class="ring-track" cx="70" cy="70" r="54" fill="none" stroke-width="10" />
              <circle
                class="ring-fill"
                cx="70" cy="70" r="54" fill="none" stroke-width="10"
                stroke-linecap="round"
                :stroke="healthRingColor"
                :stroke-dasharray="339.292"
                :stroke-dashoffset="healthRingOffset"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div class="ring-label">
              <strong>{{ healthScore }}</strong>
              <span>综合评分</span>
            </div>
          </div>

          <!-- Summary Stats -->
          <div class="hp-stats">
            <div class="hp-stat">
              <span class="hp-stat-val text-warning">{{ healthSummary.risks }}</span>
              <span class="hp-stat-lbl">风险项</span>
            </div>
            <div class="hp-stat">
              <span class="hp-stat-val text-primary">{{ healthSummary.recommendations }}</span>
              <span class="hp-stat-lbl">推荐优化</span>
            </div>
            <div class="hp-stat">
              <span class="hp-stat-val text-danger">{{ healthSummary.anomalies }}</span>
              <span class="hp-stat-lbl">最近异常</span>
            </div>
          </div>

          <el-button class="hp-check-btn" @click="handleHealthCheck">
            <AppIcon name="Refresh" /> 一键检测
          </el-button>

          <!-- Health Items -->
          <div class="hp-list">
            <div v-for="hi in healthItems" :key="hi.label" class="hp-item">
              <span class="hp-item-dot" :class="'dot--' + hi.status" />
              <span class="hp-item-text">{{ hi.label }}</span>
              <el-tag :type="healthTagType(hi.status)" size="small" effect="plain">{{ hi.tag }}</el-tag>
            </div>
          </div>
        </aside>
      </section>

    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppIcon from '@/components/AppIcon/index.vue'
import PageContainer from '@/components/PageContainer/index.vue'
import {
  defaultBasicConfig,
  defaultModelConfig,
  defaultKnowledgeStrategy,
  defaultQaStrategy,
  defaultSecurityConfig,
  defaultSystemPreference,
  defaultLogData,
  providerOptions,
  roleOptions,
  themeOptions,
  layoutOptions,
  languageOptions,
  fileTypeOptions,
  answerModeOptions,
  noMatchOptions,
  ingestOptions,
  reviewOptions,
  updateStrategyOptions,
  accessScopeOptions,
  type BasicConfig,
  type ModelConfig,
  type KnowledgeStrategy,
  type QaStrategy,
  type SecurityConfig,
  type SystemPreference,
  type LogCategory
} from '@/views/system/mock'

// ===== Category Key =====

type CategoryKey = 'basic' | 'model' | 'knowledge' | 'security' | 'preference' | 'maintenance'

// ===== Status Cards =====

const statusCards = ref([
  { key: 'version', icon: 'InfoFilled', label: '系统版本', value: 'v2.6.0', status: 'running', tone: 'blue' },
  { key: 'model', icon: 'Cpu', label: '模型服务', value: 'GPT-4o 在线', status: 'running', tone: 'green' },
  { key: 'parser', icon: 'Document', label: '知识解析服务', value: '正常运行', status: 'running', tone: 'teal' },
  { key: 'vector', icon: 'Search', label: '向量检索', value: '正常运行', status: 'running', tone: 'purple' },
  { key: 'storage', icon: 'Coin', label: '存储空间', value: '68.5%', status: 'warning', tone: 'amber' },
  { key: 'update', icon: 'Clock', label: '最近配置更新', value: '2 小时前', status: 'info', tone: 'blue' }
])

// ===== Settings Category Cards =====

const categoryCards: { key: CategoryKey; name: string; desc: string; icon: string; tone: string }[] = [
  { key: 'basic', name: '基础配置', desc: '系统名称、Logo、主题、水印', icon: 'Setting', tone: 'blue' },
  { key: 'model', name: 'AI 模型配置', desc: '模型选择、温度、上下文、超时', icon: 'Cpu', tone: 'green' },
  { key: 'knowledge', name: '知识策略', desc: '解析策略、切片、阈值、过期提醒', icon: 'Collection', tone: 'teal' },
  { key: 'security', name: '权限策略', desc: '角色范围、数据权限、敏感内容', icon: 'Lock', tone: 'purple' },
  { key: 'preference', name: '系统偏好', desc: '主题、布局、缓存、页面体验', icon: 'Brush', tone: 'amber' },
  { key: 'maintenance', name: '系统维护', desc: '缓存清理、索引重建、日志导出', icon: 'Tools', tone: 'rose' }
]

const activeCategory = ref<CategoryKey | null>('basic')

const activeCategoryInfo = computed(() =>
  categoryCards.find((c) => c.key === activeCategory.value) ?? null
)

// ===== Form Data (preserved from original) =====

const basicConfig = ref<BasicConfig>({ ...defaultBasicConfig })
const modelConfig = ref<ModelConfig>({ ...defaultModelConfig })
const knowledgeStrategy = ref<KnowledgeStrategy>({
  ...defaultKnowledgeStrategy,
  supportedFileTypes: [...defaultKnowledgeStrategy.supportedFileTypes]
})
const qaStrategy = ref<QaStrategy>({ ...defaultQaStrategy })
const securityConfig = ref<SecurityConfig>({ ...defaultSecurityConfig })
const systemPreference = ref<SystemPreference>({ ...defaultSystemPreference })
const logData = ref<LogCategory[]>(defaultLogData.map((cat) => ({
  ...cat,
  records: cat.records.map((r) => ({ ...r }))
})))

// ===== Log (preserved from original) =====

const activeLogCategory = ref('login')

const currentLogCategory = computed(() => {
  return logData.value.find((cat) => cat.key === activeLogCategory.value) || logData.value[0]
})

function logStatusType(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    成功: 'success',
    失败: 'danger',
    超时: 'warning',
    已恢复: 'success',
    未处理: 'danger',
    已审核: 'success',
    待审核: 'warning'
  }
  return map[status] || 'info'
}

// ===== Maintenance Actions (new mock) =====

const maintenanceActions = [
  { key: 'clearCache', name: '清理缓存', desc: '清除系统缓存数据', icon: 'Delete', handler: handleClearCache },
  { key: 'rebuildIndex', name: '重建索引', desc: '重新构建向量索引', icon: 'Refresh', handler: handleRebuildIndex },
  { key: 'reparseFailed', name: '重新解析失败文档', desc: '重新处理解析失败的文档', icon: 'RefreshRight', handler: handleReparseFailed },
  { key: 'exportConfig', name: '导出系统配置', desc: '导出当前配置为 JSON', icon: 'Download', handler: handleExportConfig },
  { key: 'viewLogs', name: '查看运行日志', desc: '查看系统运行日志', icon: 'Document', handler: handleViewLogs }
]

// ===== Health Score =====

const healthScore = ref(92)

const healthSummary = ref({
  risks: 2,
  recommendations: 3,
  anomalies: 1
})

const healthItems = ref([
  { label: '模型响应延迟偏高', status: 'warning', tag: '风险' },
  { label: '存储空间即将不足', status: 'warning', tag: '风险' },
  { label: '建议开启知识过期提醒', status: 'info', tag: '建议' },
  { label: '向量索引完整度良好', status: 'success', tag: '正常' },
  { label: '系统缓存命中率高', status: 'success', tag: '正常' }
])

const healthRingOffset = computed(() => {
  const circumference = 2 * Math.PI * 54 // ~339.292
  return circumference * (1 - healthScore.value / 100)
})

const healthRingColor = computed(() => {
  if (healthScore.value >= 80) return '#22c55e'
  if (healthScore.value >= 60) return '#f59e0b'
  return '#ef4444'
})

function healthTagType(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info'
  }
  return map[status] || 'info'
}

function healthIconType(status: string): string {
  const map: Record<string, string> = {
    success: 'CircleCheckFilled',
    warning: 'WarningFilled',
    danger: 'CircleCloseFilled',
    info: 'InfoFilled'
  }
  return map[status] || 'InfoFilled'
}

// ===== Preserved: Settings menu (kept for data compatibility) =====

type SectionKey = 'basic' | 'model' | 'knowledge' | 'qa' | 'security' | 'preference' | 'logs'

const settingsMenu: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'basic', label: '基础配置', icon: 'Setting' },
  { key: 'model', label: '模型配置', icon: 'Cpu' },
  { key: 'knowledge', label: '知识策略', icon: 'Collection' },
  { key: 'qa', label: '问答策略', icon: 'ChatDotRound' },
  { key: 'security', label: '权限与安全', icon: 'Lock' },
  { key: 'preference', label: '系统偏好', icon: 'Brush' },
  { key: 'logs', label: '日志与审计', icon: 'Document' }
]

// ===== Handlers (preserved + new) =====

function handleSave() {
  ElMessage.success('配置已保存（本地 mock 模拟）')
}

function handleReset() {
  if (activeCategory.value === 'basic') basicConfig.value = { ...defaultBasicConfig }
  if (activeCategory.value === 'model') modelConfig.value = { ...defaultModelConfig }
  if (activeCategory.value === 'knowledge') {
    knowledgeStrategy.value = { ...defaultKnowledgeStrategy, supportedFileTypes: [...defaultKnowledgeStrategy.supportedFileTypes] }
  }
  if (activeCategory.value === 'security') securityConfig.value = { ...defaultSecurityConfig }
  if (activeCategory.value === 'preference') systemPreference.value = { ...defaultSystemPreference }
  ElMessage.info('已重置为上次保存的值')
}

function handleRestoreDefault() {
  handleReset()
  ElMessage.success('已恢复为系统默认配置')
}

function handleTestConnection() {
  ElMessage.info(`正在测试 ${modelConfig.value.provider} / ${modelConfig.value.modelName} 的连接...`)
  setTimeout(() => {
    ElMessage.success(`连接成功！${modelConfig.value.modelName} 响应正常，延迟 128ms。`)
  }, 1200)
}

function handleClearCache() {
  ElMessage.success('缓存清理完成，共释放 128MB 空间')
}

function handleRebuildIndex() {
  ElMessage.info('索引重建任务已提交，预计 3-5 分钟完成')
}

function handleReparseFailed() {
  ElMessage.info('已重新提交 3 个失败文档的解析任务')
}

function handleExportConfig() {
  ElMessage.success('系统配置已导出为 JSON 文件')
}

function handleViewLogs() {
  ElMessage.info('日志查看功能待接入')
}

function handleHealthCheck() {
  ElMessage.info('正在进行系统健康检测...')
  setTimeout(() => {
    ElMessage.success('检测完成，系统健康评分 92 分，整体状态良好')
  }, 1500)
}
</script>

<style scoped lang="scss">
/* ================================================
   System Control Center
   ================================================ */

.control-center {
  --cc-gap-sm: 12px;
  --cc-gap-md: 16px;
  --cc-gap-lg: 24px;
  --cc-border: #e5eaf3;
  --cc-soft-border: #edf2f7;
  --cc-card-shadow: 0 6px 18px rgba(29, 78, 216, 0.06);

  display: flex;
  flex-direction: column;
  gap: var(--cc-gap-md);
  width: 100%;
  min-height: 100%;
  min-width: 0;
  color: #1f2a44;
}

/* ===== Header ===== */

.cc-header {
  padding: 18px 24px;
  border-color: rgba(186, 211, 248, 0.8);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(236, 246, 255, 0.88) 58%, rgba(248, 252, 255, 0.96)),
    linear-gradient(rgba(37, 99, 235, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.06) 1px, transparent 1px);
  background-size: auto, 34px 34px, 34px 34px;
}

.header-inner,
.header-copy {
  min-width: 0;
}

.header-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.1em;

  span {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #2dd4bf;
    box-shadow: 0 0 14px rgba(45, 212, 191, 0.58);
  }
}

.header-copy h1 {
  margin: 6px 0 0;
  color: #0f2c69;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.3;
}

.header-copy p {
  margin: 4px 0 0;
  color: #5c6f91;
  font-size: 13px;
  line-height: 1.6;
}

/* ===== Status Overview Grid ===== */

.status-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--cc-gap-sm);
  min-width: 0;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 68px;
  min-width: 0;
  padding: 12px 14px;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(29, 78, 216, 0.08);
    transform: translateY(-1px);
  }
}

.status-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  flex-shrink: 0;
  font-size: 16px;

  &.blue { background: #eff6ff; color: #3b82f6; }
  &.green { background: #f0fdf4; color: #22c55e; }
  &.teal { background: #f0fdfa; color: #14b8a6; }
  &.purple { background: #faf5ff; color: #a855f7; }
  &.amber { background: #fffbeb; color: #f59e0b; }
  &.rose { background: #fff1f2; color: #f43f5e; }
}

.status-body {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.status-label {
  display: block;
  color: #64748b;
  font-size: 11px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-value {
  display: block;
  color: #0f2c69;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Status Dots */

.status-dot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  flex-shrink: 0;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  &.dot--running::before { background: #22c55e; }
  &.dot--warning::before { background: #f59e0b; }
  &.dot--info::before { background: #3b82f6; }
  &.dot--error::before { background: #ef4444; }
}

.dot-pulse {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  pointer-events: none;
}

.dot--running .dot-pulse {
  animation: dot-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background: rgba(34, 197, 94, 0.3);
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(2.2); opacity: 0; }
}

/* ===== Main Body ===== */

.cc-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: start;
  gap: var(--cc-gap-md);
  min-height: 0;
  min-width: 0;
}

.cc-main {
  display: flex;
  flex-direction: column;
  gap: var(--cc-gap-md);
  min-width: 0;
}

/* ===== Category Cards Grid ===== */

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--cc-gap-sm);
  min-width: 0;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 82px;
  min-width: 0;
  padding: 16px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: #fff;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.25s ease, transform 0.2s ease;

  &:hover {
    border-color: rgba(37, 99, 235, 0.25);
    background: #fafcff;
    box-shadow: 0 6px 20px rgba(29, 78, 216, 0.06);
    transform: translateY(-2px);
  }

  &.is-active {
    border-color: rgba(37, 99, 235, 0.35);
    background: linear-gradient(135deg, #eef4ff 0%, #f8faff 100%);
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
    transform: translateY(0);
  }
}

.cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  font-size: 18px;

  &.blue { background: #eff6ff; color: #3b82f6; }
  &.green { background: #f0fdf4; color: #22c55e; }
  &.teal { background: #f0fdfa; color: #14b8a6; }
  &.purple { background: #faf5ff; color: #a855f7; }
  &.amber { background: #fffbeb; color: #f59e0b; }
  &.rose { background: #fff1f2; color: #f43f5e; }
}

.cat-text {
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    color: #172554;
    font-size: 13px;
    font-weight: 800;
  }

  span {
    display: block;
    margin-top: 3px;
    color: #64748b;
    font-size: 11px;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.cat-arrow {
  flex-shrink: 0;
  color: #94a3b8;
  font-size: 13px;
  transition: transform 0.3s ease, color 0.2s ease;

  &.is-up {
    transform: rotate(180deg);
    color: #2563eb;
  }
}

/* ===== Config Panel ===== */

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.panel-slide-enter-to,
.panel-slide-leave-from {
  opacity: 1;
  max-height: 1800px;
  transform: translateY(0);
}

.config-panel {
  min-width: 0;
  overflow: hidden;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--cc-gap-sm);
  padding: 14px 20px;
  border-bottom: 1px solid var(--cc-soft-border);

  h2 {
    margin: 0;
    color: #172554;
    font-size: 16px;
    font-weight: 900;
    display: flex;
    align-items: baseline;
    gap: 10px;
    min-width: 0;

    small {
      color: #64748b;
      font-size: 12px;
      font-weight: 500;
    }
  }

  :deep(.el-button) {
    color: #64748b;
    font-size: 12px;
    gap: 4px;

    &:hover {
      color: #2563eb;
    }

    .app-icon {
      font-size: 14px;
    }
  }
}

.panel-scroll {
  display: flex;
  flex-direction: column;
  gap: var(--cc-gap-lg);
  padding: 20px;
  min-width: 0;
}

.panel-section {
  min-width: 0;
}

.cfg-form {
  min-width: 0;
}

/* ===== Form Styles ===== */

.settings-form {
  width: min(100%, 920px);
  max-width: 100%;
  min-width: 0;

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__content) {
    min-width: 0;
  }

  :deep(.el-form-item__label) {
    color: #334155;
    font-weight: 700;
    font-size: 13px;
  }

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-slider),
  :deep(.el-textarea) {
    max-width: 100%;
  }

  :deep(.el-checkbox-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
  }

  :deep(.el-checkbox) {
    margin-right: 0;
  }

  :deep(.el-input-number) {
    max-width: 100%;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    border-radius: 8px;
  }

  :deep(.el-textarea__inner) {
    border-radius: 8px;
  }

  :deep(.el-slider) {
    margin-right: 16px;
  }
}

.form-suffix {
  margin-left: 8px;
  color: #64748b;
  font-size: 13px;
}

.form-hint {
  margin-left: 10px;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
}

.panel-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
  padding-top: 16px;
  border-top: 1px solid var(--cc-soft-border);

  :deep(.el-button) {
    min-height: 32px;
    border-radius: 8px;
    font-weight: 700;
  }
}

/* ===== Maintenance Grid ===== */

.maint-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  min-width: 0;
}

.maint-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 132px;
  min-width: 0;
  padding: 20px 16px;
  border: 1px solid #e6eef8;
  background: #fbfdff;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.25s ease, transform 0.2s ease;

  .app-icon {
    font-size: 24px;
    color: #3b82f6;
  }

  strong {
    color: #172554;
    font-size: 13px;
    font-weight: 800;
  }

  span {
    color: #64748b;
    font-size: 11px;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  &:hover {
    border-color: rgba(37, 99, 235, 0.3);
    background: #f5f9ff;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.06);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

/* ===== Health Panel ===== */

.health-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  min-width: 0;
  padding: 18px;
  align-self: start;
  position: sticky;
  top: 16px;
  overflow: hidden;
}

.hp-header {
  margin-bottom: 16px;

  h3 {
    margin: 0;
    color: #172554;
    font-size: 14px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 6px;

    .app-icon {
      color: #3b82f6;
      font-size: 16px;
    }
  }
}

/* Score Ring */

.hp-ring-wrap {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 18px;
}

.hp-ring {
  width: 100%;
  height: 100%;

  .ring-track {
    stroke: #e8f0fe;
  }

  .ring-fill {
    transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  strong {
    color: #0f2c69;
    font-size: 36px;
    font-weight: 900;
    line-height: 1;
  }

  span {
    color: #64748b;
    font-size: 11px;
    margin-top: 4px;
    font-weight: 600;
  }
}

/* Stats */

.hp-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  text-align: center;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--cc-soft-border);
}

.hp-stat-val {
  display: block;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.2;
}

.hp-stat-lbl {
  display: block;
  color: #94a3b8;
  font-size: 10px;
  margin-top: 2px;
}

.text-warning { color: #f59e0b; }
.text-primary { color: #3b82f6; }
.text-danger { color: #ef4444; }
.text-success { color: #22c55e; }

.hp-check-btn {
  width: 100%;
  min-height: 34px;
  border-radius: 8px;
  font-weight: 700;
  margin-bottom: 14px;
  gap: 6px;

  .app-icon {
    font-size: 14px;
  }
}

/* Health Items List */

.hp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hp-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 7px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
}

.hp-item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;

  &.dot--success { background: #22c55e; }
  &.dot--warning { background: #f59e0b; }
  &.dot--danger { background: #ef4444; }
  &.dot--info { background: #3b82f6; }
}

.hp-item-text {
  flex: 1;
  color: #334155;
  font-size: 12px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== Responsive ===== */

@media (max-width: 1400px) {
  .status-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1200px) {
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .cc-body {
    grid-template-columns: minmax(0, 1fr);
  }

  .health-panel {
    position: static;
    width: 100%;
  }

  .hp-ring-wrap {
    width: 110px;
    height: 110px;
  }

  .ring-label strong {
    font-size: 28px;
  }

  .hp-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px 16px;
  }

  .panel-head {
    align-items: flex-start;

    h2 {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
}

@media (max-width: 860px) {
  .control-center {
    height: auto;
    min-height: 100%;
  }

  .status-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .settings-form {
    max-width: 100%;
  }

  .maint-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hp-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .control-center {
    gap: var(--cc-gap-sm);
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .cc-header {
    padding: 14px 16px;
  }

  .header-copy h1 {
    font-size: 18px;
  }

  .panel-scroll {
    padding: 14px;
    gap: var(--cc-gap-md);
  }

  .settings-form {
    :deep(.el-form-item) {
      display: block;
    }

    :deep(.el-form-item__label) {
      justify-content: flex-start;
      width: 100% !important;
      margin-bottom: 6px;
      line-height: 1.4;
      text-align: left;
    }

    :deep(.el-form-item__content) {
      margin-left: 0 !important;
    }

    :deep(.el-slider) {
      margin-right: 0;
    }
  }

  .cat-card {
    min-height: 76px;
    padding: 14px;
  }

  .maint-grid {
    grid-template-columns: 1fr;
  }

  .form-hint {
    display: block;
    width: 100%;
    margin: 6px 0 0;
  }

  .panel-actions {
    align-items: stretch;

    :deep(.el-button) {
      flex: 1 1 120px;
      margin-left: 0;
    }
  }
}
</style>
