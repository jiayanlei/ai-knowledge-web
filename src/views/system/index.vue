<template>
  <PageContainer>
    <div class="system-settings-page">
      <section class="settings-header app-card">
        <div class="header-copy">
          <div class="header-kicker"><span />SYSTEM SETTINGS</div>
          <h1>系统设置</h1>
          <p>用于基础配置、模型配置、知识策略和系统偏好。</p>
        </div>
      </section>

      <section class="settings-body">
        <aside class="settings-nav app-card">
          <div class="panel-title"><h2>设置分类</h2></div>
          <nav class="nav-list">
            <button
              v-for="item in settingsMenu"
              :key="item.key"
              type="button"
              class="nav-item"
              :class="{ 'is-active': activeSection === item.key }"
              @click="activeSection = item.key"
            >
              <AppIcon :name="item.icon" />
              <span>{{ item.label }}</span>
            </button>
          </nav>
        </aside>

        <section class="settings-content app-card">
          <div class="content-scroll">
            <!-- ====== 基础配置 ====== -->
            <div v-if="activeSection === 'basic'" class="settings-section">
              <div class="section-header">
                <h2>基础配置</h2>
                <p>系统的基本信息和运行状态设置。</p>
              </div>
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
            <div v-if="activeSection === 'model'" class="settings-section">
              <div class="section-header">
                <h2>模型配置</h2>
                <p>AI 模型的接入参数和高级选项。</p>
              </div>
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
            <div v-if="activeSection === 'knowledge'" class="settings-section">
              <div class="section-header">
                <h2>知识策略</h2>
                <p>知识内容的入库、处理和审核策略。</p>
              </div>
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

            <!-- ====== 问答策略 ====== -->
            <div v-if="activeSection === 'qa'" class="settings-section">
              <div class="section-header">
                <h2>问答策略</h2>
                <p>AI 问答的回答模式和行为规则。</p>
              </div>
              <el-form :model="qaStrategy" label-width="160px" class="settings-form">
                <el-form-item label="回答模式">
                  <el-select v-model="qaStrategy.answerMode">
                    <el-option v-for="opt in answerModeOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                  </el-select>
                </el-form-item>
                <el-form-item label="必须引用知识来源">
                  <el-switch v-model="qaStrategy.requireSource" />
                </el-form-item>
                <el-form-item label="无匹配知识时处理">
                  <el-select v-model="qaStrategy.noMatchAction">
                    <el-option v-for="opt in noMatchOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                  </el-select>
                </el-form-item>
                <el-form-item label="回答可信度阈值">
                  <el-slider v-model="qaStrategy.confidenceThreshold" :min="0" :max="1" :step="0.05" show-input />
                </el-form-item>
                <el-form-item label="最多引用知识条数">
                  <el-input-number v-model="qaStrategy.maxReferences" :min="1" :max="20" />
                </el-form-item>
                <el-form-item label="显示知识来源">
                  <el-switch v-model="qaStrategy.showSource" />
                </el-form-item>
                <el-form-item label="显示相似问题">
                  <el-switch v-model="qaStrategy.showSimilarQuestions" />
                </el-form-item>
                <el-form-item label="允许连续追问">
                  <el-switch v-model="qaStrategy.allowFollowUp" />
                </el-form-item>
                <el-form-item label="记录问答历史">
                  <el-switch v-model="qaStrategy.recordHistory" />
                </el-form-item>
                <el-form-item label="允许用户反馈">
                  <el-switch v-model="qaStrategy.allowFeedback" />
                </el-form-item>
              </el-form>
            </div>

            <!-- ====== 权限与安全 ====== -->
            <div v-if="activeSection === 'security'" class="settings-section">
              <div class="section-header">
                <h2>权限与安全</h2>
                <p>系统访问控制、权限分配和安全策略。</p>
              </div>
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
            <div v-if="activeSection === 'preference'" class="settings-section">
              <div class="section-header">
                <h2>系统偏好</h2>
                <p>界面主题、布局和交互行为偏好。</p>
              </div>
              <el-form :model="systemPreference" label-width="160px" class="settings-form">
                <el-form-item label="默认主题">
                  <el-select v-model="systemPreference.defaultTheme">
                    <el-option v-for="opt in themeOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                  </el-select>
                </el-form-item>
                <el-form-item label="主题色">
                  <div class="theme-color-picker">
                    <el-color-picker v-model="systemPreference.themeColor" />
                    <span class="color-value">{{ systemPreference.themeColor }}</span>
                  </div>
                </el-form-item>
                <el-form-item label="默认布局">
                  <el-select v-model="systemPreference.defaultLayout">
                    <el-option v-for="opt in layoutOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
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
                <el-form-item label="开启全局 Loading">
                  <el-switch v-model="systemPreference.enableGlobalLoading" />
                </el-form-item>
                <el-form-item label="开启动画效果">
                  <el-switch v-model="systemPreference.enableAnimation" />
                </el-form-item>
                <el-form-item label="表格默认分页大小">
                  <el-input-number v-model="systemPreference.defaultPageSize" :min="10" :max="100" :step="10" />
                  <span class="form-suffix">条/页</span>
                </el-form-item>
                <el-form-item label="默认语言">
                  <el-select v-model="systemPreference.defaultLanguage">
                    <el-option v-for="opt in languageOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>

            <!-- ====== 日志与审计 ====== -->
            <div v-if="activeSection === 'logs'" class="settings-section">
              <div class="section-header">
                <h2>日志与审计</h2>
                <p>系统运行日志、操作审计和异常追踪。</p>
              </div>

              <div class="log-summary-grid">
                <div v-for="cat in logData" :key="cat.key" class="log-summary-card" :class="{ 'is-active': activeLogCategory === cat.key }" @click="activeLogCategory = cat.key">
                  <strong>{{ cat.count }}</strong>
                  <span>{{ cat.label }}</span>
                </div>
              </div>

              <div class="log-table-section">
                <div class="log-table-header">
                  <h3>{{ currentLogCategory.label }}</h3>
                  <el-button size="small" @click="ElMessage.info('日志导出功能待接入')">导出日志</el-button>
                </div>
                <el-table :data="currentLogCategory.records" border class="log-table">
                  <el-table-column prop="user" label="用户" width="100" />
                  <el-table-column prop="action" label="操作" width="140" />
                  <el-table-column prop="detail" label="详情" min-width="240" show-overflow-tooltip />
                  <el-table-column prop="ip" label="IP 地址" width="140" />
                  <el-table-column prop="time" label="时间" width="180" />
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                      <el-tag :type="logStatusType(row.status)" size="small">{{ row.status }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- ====== 底部操作栏 ====== -->
            <div class="settings-actions" v-if="activeSection !== 'logs'">
              <el-button type="primary" @click="handleSave">保存配置</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button @click="handleRestoreDefault">恢复默认</el-button>
            </div>
          </div>
        </section>
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

// ===== 菜单 =====

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

const activeSection = ref<SectionKey>('basic')

// ===== 表单数据 =====

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

// ===== 日志 =====

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

// ===== 操作 =====

function handleSave() {
  ElMessage.success('配置已保存（本地 mock 模拟）')
}

function handleReset() {
  if (activeSection.value === 'basic') basicConfig.value = { ...defaultBasicConfig }
  if (activeSection.value === 'model') modelConfig.value = { ...defaultModelConfig }
  if (activeSection.value === 'knowledge') {
    knowledgeStrategy.value = { ...defaultKnowledgeStrategy, supportedFileTypes: [...defaultKnowledgeStrategy.supportedFileTypes] }
  }
  if (activeSection.value === 'qa') qaStrategy.value = { ...defaultQaStrategy }
  if (activeSection.value === 'security') securityConfig.value = { ...defaultSecurityConfig }
  if (activeSection.value === 'preference') systemPreference.value = { ...defaultSystemPreference }
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
</script>

<style scoped lang="scss">
.system-settings-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  min-width: 0;
  color: #1f2a44;
}

/* ===== Header ===== */

.settings-header {
  padding: 16px 18px;
  border-color: rgba(186, 211, 248, 0.8);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(236, 246, 255, 0.88) 58%, rgba(248, 252, 255, 0.96)),
    linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
  background-size: auto, 34px 34px, 34px 34px;
}

.header-copy {
  h1 {
    margin: 6px 0 0;
    color: #0f2c69;
    font-size: 22px;
    font-weight: 900;
    line-height: 1.3;
  }

  p {
    margin: 6px 0 0;
    color: #5c6f91;
    font-size: 13px;
    line-height: 1.6;
  }
}

.header-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;

  span {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #2dd4bf;
    box-shadow: 0 0 14px rgba(45, 212, 191, 0.58);
  }
}

/* ===== Body ===== */

.settings-body {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 12px;
  flex: 1;
  min-height: 0;
}

/* ===== Left Nav ===== */

.settings-nav {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 12px;
}

.panel-title {
  flex: 0 0 auto;
  margin-bottom: 8px;

  h2 {
    margin: 0;
    color: #172554;
    font-size: 14px;
    font-weight: 800;
  }
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #475569;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;

  .app-icon {
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    color: #7b8aa5;
    transition: color 0.2s ease;
  }

  &:hover {
    color: #1e40af;
    background: #f0f5ff;

    .app-icon { color: #3b82f6; }
  }

  &.is-active {
    color: #1e40af;
    background: linear-gradient(135deg, #e8f0fe, #f5f9ff);
    border-color: rgba(37, 99, 235, 0.25);
    font-weight: 800;
    box-shadow: inset 3px 0 0 #2563eb;

    .app-icon { color: #2563eb; }
  }
}

/* ===== Right Content ===== */

.settings-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}

.content-scroll {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 16px 20px;
}

/* ===== Section ===== */

.settings-section {
  flex: 1;
  min-width: 0;
}

.section-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf2f7;

  h2 {
    margin: 0;
    color: #172554;
    font-size: 17px;
    font-weight: 900;
  }

  p {
    margin: 6px 0 0;
    color: #64748b;
    font-size: 13px;
    line-height: 1.5;
  }
}

/* ===== Form ===== */

.settings-form {
  max-width: 640px;

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    color: #334155;
    font-weight: 700;
    font-size: 13px;
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

.theme-color-picker {
  display: flex;
  align-items: center;
  gap: 10px;

  .color-value {
    color: #64748b;
    font-size: 13px;
    font-family: monospace;
  }
}

/* ===== Actions ===== */

.settings-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #edf2f7;

  :deep(.el-button) {
    border-radius: 8px;
    font-weight: 700;
  }
}

/* ===== Log Summary ===== */

.log-summary-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.log-summary-card {
  padding: 12px;
  border: 1px solid #e6eef8;
  border-radius: 10px;
  background: #fbfdff;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  strong {
    display: block;
    color: #0f2c69;
    font-size: 20px;
    font-weight: 900;
    line-height: 1.2;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #64748b;
    font-size: 12px;
  }

  &:hover {
    border-color: rgba(37, 99, 235, 0.3);
    background: #f5f9ff;
  }

  &.is-active {
    border-color: #2563eb;
    background: linear-gradient(135deg, #eaf3ff, #f5f9ff);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
  }
}

.log-table-section {
  .log-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    h3 {
      margin: 0;
      color: #172554;
      font-size: 14px;
      font-weight: 800;
    }
  }
}

.log-table {
  width: 100%;

  :deep(.el-table__header th) {
    color: #42526e;
    background: #f5f9ff;
    font-size: 12px;
  }

  :deep(.el-table__body td) {
    font-size: 13px;
  }
}

/* ===== Responsive ===== */

@media (max-width: 1080px) {
  .settings-body {
    grid-template-columns: 160px minmax(0, 1fr);
  }

  .log-summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .system-settings-page {
    height: auto;
    min-height: 100%;
  }

  .settings-body {
    grid-template-columns: minmax(0, 1fr);
  }

  .settings-nav {
    min-height: auto;
  }

  .nav-list {
    flex-direction: row;
    flex-wrap: wrap;
    overflow-x: auto;
  }

  .nav-item {
    flex: 0 0 auto;
    width: auto;
  }

  .log-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .settings-form {
    max-width: 100%;
  }
}
</style>
