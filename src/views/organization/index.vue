<template>
  <PageContainer>
    <div class="org-page">
      <!-- ===== 页面头部 ===== -->
      <header class="org-header">
        <div class="header-copy">
          <div class="header-kicker"><span />PERMISSION HUB</div>
          <h1>组织权限中枢</h1>
          <p>用于维护部门、成员、角色权限和知识库访问范围，保障企业知识安全可控。</p>
        </div>
      </header>

      <!-- ===== 数据概览卡片 ===== -->
      <section class="metric-grid">
        <article class="stat-card" v-for="m in metricItems" :key="m.label" :class="m.cls">
          <div class="stat-icon"><AppIcon :name="m.icon" /></div>
          <div class="stat-body">
            <span class="stat-label">{{ m.label }}</span>
            <strong>{{ m.value }}</strong>
          </div>
          <div class="stat-spark"><svg viewBox="0 0 64 24" fill="none"><polyline :points="m.spark" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        </article>
      </section>

      <!-- ===== 三栏主体 ===== -->
      <section class="org-body">
        <!-- 左侧：组织架构树 -->
        <aside class="org-tree-panel app-card">
          <div class="panel-title"><h2>组织架构</h2></div>
          <el-tree :data="deptTree" :props="treeProps" node-key="id" highlight-current default-expand-all @node-click="handleDeptClick" class="dept-tree">
            <template #default="{ data }">
              <div class="tree-node">
                <span class="tn-name">{{ data.name }}</span>
                <span class="tn-count">{{ data.count }}人</span>
                <el-tag v-if="data.risk" type="danger" size="small" effect="plain" class="tn-risk">风险</el-tag>
              </div>
            </template>
          </el-tree>
          <div v-if="selectedDept" class="selected-dept-info">
            <div class="sdi-row"><span class="sdi-label">负责人</span><span>{{ selectedDept.leader }}</span></div>
            <div class="sdi-row"><span class="sdi-label">知识库</span><span>{{ selectedDept.knowledgeCount }} 个</span></div>
            <div class="sdi-row"><span class="sdi-label">人数</span><span>{{ selectedDept.count }} 人</span></div>
          </div>
        </aside>

        <!-- 中间：权限配置主区域 -->
        <div class="org-content app-card">
          <el-tabs v-model="activeTab" class="content-tabs">
            <!-- ====== 成员管理 ====== -->
            <el-tab-pane label="成员管理" name="members">
              <div class="section-block">
                <div class="toolbar">
                  <el-input v-model="memberSearch" placeholder="搜索姓名 / 工号…" clearable class="toolbar-input" :prefix-icon="Search" />
                  <el-select v-model="memberRoleFilter" placeholder="角色筛选" clearable class="toolbar-select">
                    <el-option v-for="r in roles" :key="r.id" :label="r.name" :value="r.name" />
                  </el-select>
                  <el-button type="primary" plain size="small">添加成员</el-button>
                </div>
                <el-table :data="filteredMembers" stripe size="small" :header-cell-style="tableHeaderStyle" empty-text="暂无成员数据">
                  <el-table-column prop="name" label="姓名" width="80" />
                  <el-table-column prop="employeeId" label="工号" width="75" />
                  <el-table-column prop="department" label="部门" width="150" show-overflow-tooltip />
                  <el-table-column prop="position" label="岗位" width="110" show-overflow-tooltip />
                  <el-table-column prop="role" label="角色" width="110">
                    <template #default="{ row }"><el-tag size="small" effect="light">{{ row.role }}</el-tag></template>
                  </el-table-column>
                  <el-table-column label="状态" width="75" align="center">
                    <template #default="{ row }">
                      <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small" effect="plain">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="知识范围" min-width="160" show-overflow-tooltip>
                    <template #default="{ row }"><span class="scope-text">{{ row.knowledgeScope.join('、') }}</span></template>
                  </el-table-column>
                  <el-table-column prop="lastLogin" label="最近登录" width="140" show-overflow-tooltip />
                  <el-table-column label="风险" width="85" align="center">
                    <template #default="{ row }">
                      <el-tag v-if="row.riskStatus === 'normal'" type="success" size="small" effect="plain">正常</el-tag>
                      <el-tag v-else-if="row.riskStatus === 'review'" type="warning" size="small" effect="plain">需复核</el-tag>
                      <el-tag v-else type="danger" size="small" effect="plain">长期未登录</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                      <el-button type="primary" link size="small" @click="openProfile(row)">权限画像</el-button>
                      <el-button type="primary" link size="small" @click="ElMessage.info(`调整 ${row.name} 的角色（模拟）`)">调整角色</el-button>
                      <el-button type="danger" link size="small" @click="ElMessage.warning(`确认禁用 ${row.name} 的账号？（模拟）`)">禁用</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>

            <!-- ====== 角色权限 ====== -->
            <el-tab-pane label="角色权限" name="roles">
              <div class="section-block">
                <div class="role-cards">
                  <div v-for="role in roles" :key="role.id" class="role-card app-card" :class="{ 'is-selected': selectedRole?.id === role.id }" @click="selectedRole = role">
                    <div class="rc-header">
                      <div class="rc-icon" :style="{ background: role.color + '15', color: role.color }"><AppIcon :name="role.icon" /></div>
                      <div>
                        <h4>{{ role.name }}</h4>
                        <span class="rc-count">{{ role.memberCount }} 人</span>
                      </div>
                    </div>
                    <p class="rc-desc">{{ role.description }}</p>
                    <div class="rc-footer">
                      <el-tag size="small" :color="role.color + '18'" :style="{ color: role.color, border: 'none' }" effect="plain">{{ role.scope }}</el-tag>
                      <el-tag :type="role.status === 'active' ? 'success' : 'info'" size="small" effect="plain">{{ role.status === 'active' ? '启用' : '冻结' }}</el-tag>
                    </div>
                  </div>
                </div>

                <div v-if="selectedRole" class="perm-tree-section">
                  <div class="section-title">
                    <span>{{ selectedRole.name }} — 权限配置</span>
                    <el-button type="primary" size="small" plain @click="ElMessage.success(`已保存 ${selectedRole.name} 的权限配置（模拟）`)">保存配置</el-button>
                  </div>
                  <el-tree :data="permTree" :props="treeProps" show-checkbox node-key="id" :default-checked-keys="rolePermMap[selectedRole.id] || []" ref="permTreeRef" class="perm-tree" />
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 知识授权 ====== -->
            <el-tab-pane label="知识授权" name="knowledge">
              <div class="section-block">
                <div class="section-title">知识库访问授权配置</div>
                <el-table :data="knowledgeAuths" stripe size="small" :header-cell-style="tableHeaderStyle">
                  <el-table-column prop="name" label="知识库名称" min-width="130" />
                  <el-table-column label="敏感级别" width="100" align="center">
                    <template #default="{ row }">
                      <el-tag :type="levelType(row.level)" size="small" effect="light">{{ levelLabel(row.level) }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="scope" label="访问范围" width="130" show-overflow-tooltip />
                  <el-table-column prop="viewRoles" label="可查看角色" width="150" show-overflow-tooltip />
                  <el-table-column prop="editRoles" label="可编辑角色" width="150" show-overflow-tooltip />
                  <el-table-column label="AI 引用" width="80" align="center">
                    <template #default="{ row }">
                      <el-tag :type="row.allowAiRef ? 'success' : 'danger'" size="small" effect="plain">{{ row.allowAiRef ? '允许' : '限制' }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="导出" width="80" align="center">
                    <template #default="{ row }">
                      <el-tag :type="row.allowExport ? 'success' : 'info'" size="small" effect="plain">{{ row.allowExport ? '允许' : '禁止' }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100" align="center">
                    <template #default><el-button type="primary" link size="small" @click="ElMessage.info('编辑授权配置（模拟）')">编辑</el-button></template>
                  </el-table-column>
                </el-table>

                <div class="access-map-section">
                  <div class="section-title">知识访问范围地图</div>
                  <div class="access-map-grid">
                    <div class="am-card">
                      <h4 class="am-title am-title--ok">可访问部门</h4>
                      <div class="am-tags">
                        <el-tag v-for="d in accessMap.accessible" :key="d" type="success" effect="light" size="small">{{ d }}</el-tag>
                      </div>
                    </div>
                    <div class="am-card">
                      <h4 class="am-title am-title--block">不可访问部门</h4>
                      <div class="am-tags">
                        <el-tag v-for="d in accessMap.blocked" :key="d" type="danger" effect="light" size="small">{{ d }}</el-tag>
                      </div>
                    </div>
                    <div class="am-card">
                      <h4 class="am-title am-title--role">可访问角色</h4>
                      <div class="am-tags">
                        <el-tag v-for="r in accessMap.accessibleRoles" :key="r" type="primary" effect="light" size="small">{{ r }}</el-tag>
                      </div>
                    </div>
                    <div class="am-card">
                      <h4 class="am-title am-title--rule">限制规则</h4>
                      <div class="am-rules">
                        <div v-for="(rule, i) in accessMap.rules" :key="i" class="am-rule">
                          <el-icon color="#f59e0b"><Warning /></el-icon>
                          <span>{{ rule }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 权限矩阵 ====== -->
            <el-tab-pane label="权限矩阵" name="matrix">
              <div class="section-block">
                <div class="section-title">角色权限对照矩阵</div>
                <div class="matrix-wrap">
                  <el-table :data="permMatrix" stripe size="small" :header-cell-style="tableHeaderStyle" border>
                    <el-table-column prop="permission" label="权限项" width="160" fixed />
                    <el-table-column v-for="(col, ci) in matrixColumns" :key="col" :label="col" min-width="130" align="center">
                      <template #default="{ row }">
                        <span class="matrix-cell" :class="'mc--' + row.cells[ci].level">{{ row.cells[ci].label }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="matrix-legend">
                  <span class="ml-item"><span class="ml-dot ml-dot--full" />全部权限</span>
                  <span class="ml-item"><span class="ml-dot ml-dot--partial" />部分权限</span>
                  <span class="ml-item"><span class="ml-dot ml-dot--none" />无权限</span>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 审批规则 ====== -->
            <el-tab-pane label="审批规则" name="approval">
              <div class="section-block">
                <div class="approval-list">
                  <div v-for="af in approvalFlows" :key="af.id" class="approval-card app-card">
                    <div class="af-header">
                      <h3>{{ af.name }}</h3>
                      <el-switch v-model="af.enabled" active-text="启用" inactive-text="停用" size="small" />
                    </div>
                    <p class="af-desc">{{ af.description }}</p>
                    <div class="af-flow">
                      <template v-for="(step, si) in af.steps" :key="si">
                        <span class="af-step">{{ step }}</span>
                        <span v-if="si < af.steps.length - 1" class="af-arrow">→</span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ====== 安全策略 ====== -->
            <el-tab-pane label="安全策略" name="security">
              <div class="section-block">
                <div class="section-title">安全配置项</div>
                <div class="security-grid">
                  <div v-for="sp in securityPolicies" :key="sp.key" class="security-item">
                    <span class="sp-label">{{ sp.label }}</span>
                    <span v-if="sp.type === 'switch'" class="sp-value">
                      <el-switch v-model="sp.value" size="small" />
                    </span>
                    <span v-else class="sp-value sp-value--text">{{ sp.value }}</span>
                  </div>
                </div>
                <div class="security-actions">
                  <el-button type="primary" @click="ElMessage.success('安全策略已保存（模拟）')">保存配置</el-button>
                  <el-button @click="ElMessage.info('已恢复默认安全策略（模拟）')">恢复默认</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 右侧：风险洞察 + 权限模拟器 -->
        <aside class="org-sidebar">
          <!-- 风险概览 -->
          <div class="sidebar-card app-card">
            <div class="sc-header"><AppIcon name="WarningFilled" /><h3>风险概览</h3></div>
            <div class="risk-summary-grid">
              <div class="rs-item rs-item--high"><strong>{{ riskSummary.highRisk }}</strong><span>高风险账号</span></div>
              <div class="rs-item rs-item--warn"><strong>{{ riskSummary.noRole }}</strong><span>无角色成员</span></div>
              <div class="rs-item rs-item--warn"><strong>{{ riskSummary.longTimeLogin }}</strong><span>长期未登录</span></div>
              <div class="rs-item rs-item--info"><strong>{{ riskSummary.tempExpiring }}</strong><span>临时授权即将过期</span></div>
              <div class="rs-item rs-item--danger"><strong>{{ riskSummary.sensitiveBroad }}</strong><span>敏感知识开放过宽</span></div>
            </div>
          </div>

          <!-- 风险列表 -->
          <div class="sidebar-card app-card">
            <div class="sc-header"><AppIcon name="CircleCloseFilled" /><h3>风险项</h3></div>
            <div class="risk-list">
              <div v-for="risk in riskItems" :key="risk.id" class="risk-item">
                <div class="ri-header">
                  <el-tag :type="risk.level === 'high' ? 'danger' : 'warning'" size="small" effect="plain">{{ risk.type }}</el-tag>
                  <span class="ri-target">{{ risk.target }}</span>
                </div>
                <p class="ri-desc">{{ risk.description }}</p>
                <p class="ri-suggestion">{{ risk.suggestion }}</p>
                <div class="ri-actions">
                  <el-button type="primary" link size="small" @click="ElMessage.success(`已处理：${risk.target}（模拟）`)">立即处理</el-button>
                  <el-button type="info" link size="small" @click="ElMessage.info(`已忽略：${risk.target}`)">忽略</el-button>
                  <el-button type="primary" link size="small" @click="ElMessage.info(`查看详情：${risk.description}`)">详情</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 权限模拟器 -->
          <div class="sidebar-card app-card sidebar-sim">
            <div class="sc-header"><AppIcon name="Monitor" /><h3>权限模拟器</h3></div>
            <div class="sim-user">
              <span class="sim-label">模拟用户：</span>
              <el-tag effect="plain">{{ simResult.user }} / {{ simResult.dept }} / {{ simResult.role }}</el-tag>
            </div>
            <div v-if="simDone" class="sim-results">
              <div class="sim-section">
                <h4 class="sim-title sim-title--ok">可访问</h4>
                <div class="sim-tags"><el-tag v-for="a in simResult.accessible" :key="a" type="success" size="small" effect="light">{{ a }}</el-tag></div>
              </div>
              <div class="sim-section">
                <h4 class="sim-title sim-title--block">不可访问</h4>
                <div class="sim-tags"><el-tag v-for="b in simResult.blocked" :key="b" type="danger" size="small" effect="light">{{ b }}</el-tag></div>
              </div>
            </div>
            <div class="sim-actions">
              <el-button type="primary" size="small" @click="handleSimulate">开始模拟</el-button>
              <el-button size="small" plain @click="ElMessage.success('权限报告已生成（模拟）')">生成权限报告</el-button>
            </div>
          </div>
        </aside>
      </section>

      <!-- ===== 成员权限画像抽屉 ===== -->
      <el-drawer v-model="profileVisible" title="成员权限画像" size="520px" direction="rtl" :destroy-on-close="true">
        <template v-if="profile">
          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="User" /> 基础信息</h3>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="姓名">{{ profile.name }}</el-descriptions-item>
              <el-descriptions-item label="工号">{{ profile.employeeId }}</el-descriptions-item>
              <el-descriptions-item label="部门">{{ profile.department }}</el-descriptions-item>
              <el-descriptions-item label="角色"><el-tag size="small" effect="light">{{ profile.role }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="状态"><el-tag :type="profile.status === '启用' ? 'success' : 'danger'" size="small" effect="plain">{{ profile.status }}</el-tag></el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="Key" /> 权限摘要</h3>
            <div class="profile-summary-grid">
              <div class="ps-item"><strong>{{ profile.summary.accessibleKb }}</strong><span>可访问知识库</span></div>
              <div class="ps-item"><strong>{{ profile.summary.manageableKb }}</strong><span>可管理知识库</span></div>
              <div class="ps-item"><strong>{{ profile.summary.accessibleAssets }}</strong><span>可访问团队资产</span></div>
              <div class="ps-item"><strong>{{ profile.summary.canApprove ? '是' : '否' }}</strong><span>可审批知识</span></div>
              <div class="ps-item"><strong>{{ profile.summary.canExport ? '是' : '否' }}</strong><span>可导出资料</span></div>
              <div class="ps-item"><strong>{{ profile.summary.canConfigModel ? '是' : '否' }}</strong><span>可配置模型</span></div>
            </div>
          </div>

          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="DataAnalysis" /> 权限雷达</h3>
            <div class="radar-chart">
              <svg viewBox="0 0 200 200" class="radar-svg">
                <g v-for="i in 5" :key="'ring-' + i">
                  <polygon :points="radarRingPoints(i * 20)" fill="none" stroke="#e5eaf3" stroke-width="0.5" />
                </g>
                <g v-for="(d, i) in profile.radar" :key="'axis-' + i">
                  <line :x1="100" :y1="100" :x2="radarPoint(i, 100).x" :y2="radarPoint(i, 100).y" stroke="#e5eaf3" stroke-width="0.5" />
                  <text :x="radarPoint(i, 115).x" :y="radarPoint(i, 115).y" text-anchor="middle" fill="#64748b" font-size="9">{{ d.dimension }}</text>
                </g>
                <polygon :points="radarDataPoints" fill="rgba(99,102,241,0.15)" stroke="#6366f1" stroke-width="1.5" />
                <circle v-for="(d, i) in profile.radar" :key="'dot-' + i" :cx="radarPoint(i, d.score).x" :cy="radarPoint(i, d.score).y" r="3" fill="#6366f1" />
              </svg>
            </div>
          </div>

          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="Clock" /> 最近操作</h3>
            <div class="recent-ops">
              <div v-for="(op, i) in profile.recentOps" :key="i" class="rop-item">
                <span class="rop-time">{{ op.time }}</span>
                <el-tag size="small" effect="plain">{{ op.action }}</el-tag>
                <span class="rop-target">{{ op.target }}</span>
              </div>
            </div>
          </div>

          <div class="drawer-section">
            <h3 class="drawer-section-title"><AppIcon name="List" /> 权限变更时间线</h3>
            <div class="profile-timeline">
              <div v-for="(ev, i) in profile.timeline" :key="i" class="ptl-item">
                <span class="ptl-dot" />
                <span class="ptl-time">{{ ev.time }}</span>
                <span class="ptl-event">{{ ev.event }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-drawer>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  getOverviewMetricsMock,
  getDeptTreeMock,
  getMembersMock,
  getRolesMock,
  getPermTreeMock,
  getRolePermMapMock,
  getKnowledgeAuthsMock,
  getAccessMapMock,
  getPermMatrixMock,
  matrixColumns,
  getApprovalFlowsMock,
  getSecurityPoliciesMock,
  getRiskItemsMock,
  getRiskSummaryMock,
  getSimResultMock,
  getMemberProfileMock,
  type DeptNode,
  type MemberRecord,
  type RoleRecord,
  type MemberProfile
} from './mock'

// ===== 数据初始化 =====
const metrics = ref(getOverviewMetricsMock())
const deptTree = ref(getDeptTreeMock())
const members = ref(getMembersMock())
const roles = ref(getRolesMock())
const permTree = ref(getPermTreeMock())
const rolePermMap = ref(getRolePermMapMock())
const knowledgeAuths = ref(getKnowledgeAuthsMock())
const accessMap = ref(getAccessMapMock())
const permMatrix = ref(getPermMatrixMock())
const approvalFlows = ref(getApprovalFlowsMock())
const securityPolicies = ref(getSecurityPoliciesMock())
const riskItems = ref(getRiskItemsMock())
const riskSummary = ref(getRiskSummaryMock())
const simResult = ref(getSimResultMock())

const treeProps = { children: 'children', label: 'name' }
const tableHeaderStyle = { background: '#f8faff', color: '#475569', fontWeight: 600, fontSize: '12px' }

// ===== 顶部指标卡片 =====
const metricItems = computed(() => [
  { label: '部门数量', value: metrics.value.departments, icon: 'OfficeBuilding', cls: 'stat-card--dept', spark: '0,18 8,14 16,16 24,10 32,12 40,6 48,8 56,4 64,6' },
  { label: '成员数量', value: metrics.value.members, icon: 'User', cls: 'stat-card--member', spark: '0,16 8,12 16,14 24,8 32,10 40,6 48,8 56,2 64,4' },
  { label: '角色数量', value: metrics.value.roles, icon: 'Key', cls: 'stat-card--role', spark: '0,20 8,16 16,18 24,12 32,14 40,10 48,8 56,6 64,8' },
  { label: '知识库授权', value: metrics.value.knowledgeAuth, icon: 'DocumentChecked', cls: 'stat-card--kb', spark: '0,18 8,14 16,12 24,10 32,8 40,6 48,8 56,4 64,2' },
  { label: '权限风险', value: metrics.value.riskCount, icon: 'WarningFilled', cls: 'stat-card--risk', spark: '0,6 8,8 16,4 24,10 32,8 40,12 48,10 56,14 64,12' }
])

// ===== Tab 状态 =====
const activeTab = ref('members')

// ===== 组织树 =====
const selectedDept = ref<DeptNode | null>(null)

function handleDeptClick(data: DeptNode) {
  selectedDept.value = data
}

// ===== 成员管理 =====
const memberSearch = ref('')
const memberRoleFilter = ref('')

const filteredMembers = computed(() => {
  let list = members.value.slice()
  if (memberSearch.value) {
    const kw = memberSearch.value.toLowerCase()
    list = list.filter(m => m.name.includes(kw) || m.employeeId.includes(kw))
  }
  if (memberRoleFilter.value) list = list.filter(m => m.role === memberRoleFilter.value)
  if (selectedDept.value) {
    const deptId = selectedDept.value.id
    list = list.filter(m => m.deptId.startsWith(deptId))
  }
  return list
})

// ===== 角色权限 =====
const selectedRole = ref<RoleRecord | null>(null)
const permTreeRef = ref()

// ===== 知识授权辅助 =====
function levelType(level: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = { public: 'success', department: '', internal: 'warning', sensitive: 'danger' }
  return map[level] || 'info'
}

function levelLabel(level: string): string {
  const map: Record<string, string> = { public: '公开知识', department: '部门知识', internal: '内部知识', sensitive: '敏感知识' }
  return map[level] || level
}

// ===== 权限模拟器 =====
const simDone = ref(false)

function handleSimulate() {
  simDone.value = true
  ElMessage.success(`权限模拟完成：已模拟 ${simResult.value.user} 的访问视角。`)
}

// ===== 成员权限画像 =====
const profileVisible = ref(false)
const profile = ref<MemberProfile | null>(null)

function openProfile(row: MemberRecord) {
  profile.value = getMemberProfileMock(row.name)
  profileVisible.value = true
}

// ===== 雷达图辅助函数 =====
function radarPoint(index: number, score: number): { x: number; y: number } {
  const total = 6
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const r = (score / 100) * 75
  return { x: 100 + r * Math.cos(angle), y: 100 + r * Math.sin(angle) }
}

function radarRingPoints(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
    return `${100 + (r / 100) * 75 * Math.cos(angle)},${100 + (r / 100) * 75 * Math.sin(angle)}`
  }).join(' ')
}

const radarDataPoints = computed(() => {
  if (!profile.value) return ''
  return profile.value.radar.map((d, i) => {
    const p = radarPoint(i, d.score)
    return `${p.x},${p.y}`
  }).join(' ')
})
</script>

<style scoped lang="scss">
.org-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding-bottom: 4px;
  color: #172554;
}

/* ===== 页面头部 ===== */
.org-header {
  padding: 18px 22px;
  border-radius: var(--app-card-radius);
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #3b82f6 100%);
  color: #fff;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.3);

  .header-kicker {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 6px; font-size: 11px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;
    span { display: inline-block; width: 18px; height: 2px; border-radius: 1px; background: rgba(255,255,255,0.5); }
  }
  h1 { margin: 0 0 4px; font-size: 22px; font-weight: 800; }
  p { margin: 0; font-size: 13px; opacity: 0.8; }
}

/* ===== 统计卡片 ===== */
.metric-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  position: relative; display: flex; align-items: center; gap: 12px;
  padding: 16px 18px; border: 1px solid #e6eef8; border-radius: var(--app-card-radius);
  background: #fff; box-shadow: 0 4px 14px rgba(29,78,216,0.05); overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  &:hover { border-color: rgba(37,99,235,0.2); box-shadow: 0 10px 24px rgba(29,78,216,0.08); transform: translateY(-2px); }
  .stat-icon { display: flex; align-items: center; justify-content: center; flex: 0 0 44px; width: 44px; height: 44px; border-radius: 10px;
    :deep(.app-icon) { width: 22px; height: 22px; } }
  .stat-body { min-width: 0;
    .stat-label { display: block; font-size: 12px; color: #475569; font-weight: 600; }
    strong { display: block; margin-top: 2px; font-size: 26px; font-weight: 800; line-height: 1; }
  }
  .stat-spark { position: absolute; right: 10px; bottom: 8px; width: 50px; opacity: 0.15; svg { width: 100%; } }
}

.stat-card--dept { .stat-icon { background: #eef2ff; color: #6366f1; } .stat-spark { color: #6366f1; } strong { color: #4338ca; } }
.stat-card--member { .stat-icon { background: #ecfdf5; color: #10b981; } .stat-spark { color: #10b981; } strong { color: #059669; } }
.stat-card--role { .stat-icon { background: #fffbeb; color: #f59e0b; } .stat-spark { color: #f59e0b; } strong { color: #d97706; } }
.stat-card--kb { .stat-icon { background: #eff6ff; color: #3b82f6; } .stat-spark { color: #3b82f6; } strong { color: #2563eb; } }
.stat-card--risk { .stat-icon { background: #fef2f2; color: #ef4444; } .stat-spark { color: #ef4444; } strong { color: #dc2626; } }

/* ===== 三栏主体 ===== */
.org-body {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 280px;
  gap: 12px;
  min-width: 0;
}

/* ===== 左侧组织树 ===== */
.org-tree-panel {
  padding: 14px 10px;
  height: fit-content;
  position: sticky;
  top: 0;

  .panel-title {
    padding: 0 6px 10px; border-bottom: 1px solid #f1f5f9; margin-bottom: 8px;
    h2 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }
}

.dept-tree {
  :deep(.el-tree-node__content) { height: 34px; padding-left: 6px !important; }
  :deep(.el-tree-node__content:hover) { background: #f1f5f9; }
}

.tree-node {
  display: flex; align-items: center; gap: 6px; font-size: 13px;
  .tn-name { color: #1f2937; font-weight: 500; }
  .tn-count { color: #94a3b8; font-size: 11px; }
  .tn-risk { transform: scale(0.85); }
}

.selected-dept-info {
  margin-top: 12px; padding: 10px 12px; border-radius: 8px; background: #f8faff; border: 1px solid #e5eaf3;
  .sdi-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #475569;
    .sdi-label { color: #94a3b8; font-weight: 600; }
  }
}

/* ===== 中间内容区 ===== */
.org-content {
  padding: 16px 18px; min-width: 0;
  .content-tabs { :deep(.el-tabs__header) { margin-bottom: 14px; } :deep(.el-tabs__item) { font-size: 13px; font-weight: 600; } }
}

.section-block { min-width: 0; }

/* 工具栏 */
.toolbar {
  display: flex; gap: 8px; margin-bottom: 12px; align-items: center;
  .toolbar-input { width: 200px; }
  .toolbar-select { width: 140px; }
}

.scope-text { font-size: 12px; color: #475569; }

/* ===== 角色卡片 ===== */
.role-cards {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px;
}

.role-card {
  padding: 14px; cursor: pointer; transition: all 0.15s;
  &:hover, &.is-selected { border-color: #6366f1; box-shadow: 0 4px 14px rgba(99,102,241,0.12); }

  .rc-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
    .rc-icon { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px;
      :deep(.app-icon) { width: 20px; height: 20px; } }
    h4 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
    .rc-count { font-size: 11px; color: #94a3b8; }
  }
  .rc-desc { margin: 0 0 8px; font-size: 12px; color: #6b7280; line-height: 1.4; }
  .rc-footer { display: flex; flex-wrap: wrap; gap: 4px; }
}

.perm-tree-section {
  padding: 14px; border: 1px solid #e5eaf3; border-radius: 10px; background: #fafbff;
  .section-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-size: 14px; font-weight: 700; color: #1f2937; }
}

.perm-tree {
  :deep(.el-tree-node__content) { height: 32px; }
}

/* ===== 知识授权 ===== */
.access-map-section { margin-top: 18px; }

.access-map-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
}

.am-card {
  padding: 12px 14px; border: 1px solid #e5eaf3; border-radius: 8px; background: #fafbff;
  .am-title { margin: 0 0 8px; font-size: 13px; font-weight: 700;
    &--ok { color: #059669; } &--block { color: #dc2626; } &--role { color: #2563eb; } &--rule { color: #d97706; }
  }
  .am-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .am-rules { display: flex; flex-direction: column; gap: 4px; }
  .am-rule { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; }
}

/* ===== 权限矩阵 ===== */
.matrix-wrap { overflow-x: auto; }

.matrix-cell {
  display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;
}

.mc--full { background: #ecfdf5; color: #059669; }
.mc--partial { background: #fffbeb; color: #d97706; }
.mc--none { background: #f1f5f9; color: #94a3b8; }

.matrix-legend {
  display: flex; gap: 16px; margin-top: 10px; font-size: 12px; color: #6b7280;
  .ml-item { display: flex; align-items: center; gap: 4px; }
  .ml-dot { display: inline-block; width: 12px; height: 12px; border-radius: 3px;
    &--full { background: #ecfdf5; border: 1px solid #86efac; }
    &--partial { background: #fffbeb; border: 1px solid #fcd34d; }
    &--none { background: #f1f5f9; border: 1px solid #cbd5e1; }
  }
}

/* ===== 审批规则 ===== */
.approval-list { display: flex; flex-direction: column; gap: 12px; }

.approval-card {
  padding: 16px;
  .af-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;
    h3 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }
  .af-desc { margin: 0 0 10px; font-size: 13px; color: #6b7280; }
  .af-flow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    .af-step { padding: 4px 12px; border-radius: 6px; background: #eef2ff; color: #4338ca; font-size: 12px; font-weight: 600; }
    .af-arrow { color: #94a3b8; font-size: 14px; }
  }
}

/* ===== 安全策略 ===== */
.security-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px;
}

.security-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; border: 1px solid #e5eaf3; border-radius: 8px; background: #fafbff;
  .sp-label { font-size: 13px; color: #475569; font-weight: 500; }
  .sp-value--text { font-size: 13px; color: #1f2937; font-weight: 600; }
}

.security-actions { display: flex; gap: 8px; }

/* ===== 右侧面板 ===== */
.org-sidebar { display: flex; flex-direction: column; gap: 12px; min-width: 0; }

.sidebar-card {
  padding: 14px 16px;
  .sc-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
    :deep(.app-icon) { width: 18px; height: 18px; color: #ef4444; }
    h3 { margin: 0; font-size: 14px; font-weight: 700; color: #1f2937; }
  }
}

/* 风险概览 */
.risk-summary-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;
  .rs-item { padding: 8px 10px; border-radius: 8px; text-align: center;
    strong { display: block; font-size: 20px; font-weight: 800; line-height: 1.1; }
    span { font-size: 11px; }
    &--high { background: #fef2f2; strong { color: #dc2626; } span { color: #f87171; } }
    &--warn { background: #fffbeb; strong { color: #d97706; } span { color: #fbbf24; } }
    &--info { background: #eff6ff; strong { color: #2563eb; } span { color: #60a5fa; } }
    &--danger { background: #fef2f2; strong { color: #dc2626; } span { color: #f87171; } }
  }
}

/* 风险列表 */
.risk-list { display: flex; flex-direction: column; gap: 10px; }

.risk-item {
  padding-bottom: 10px; border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; padding-bottom: 0; }
  .ri-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px;
    .ri-target { font-size: 13px; font-weight: 600; color: #1f2937; }
  }
  .ri-desc { margin: 0 0 2px; font-size: 12px; color: #475569; }
  .ri-suggestion { margin: 0 0 6px; font-size: 12px; color: #6366f1; font-weight: 500; }
  .ri-actions { display: flex; gap: 6px; }
}

/* 权限模拟器 */
.sidebar-sim { border: 1px solid #dde4ff; background: linear-gradient(180deg, #fafbff 0%, #fff 100%); }

.sim-user { margin-bottom: 10px;
  .sim-label { font-size: 12px; color: #6b7280; }
}

.sim-results { margin-bottom: 10px;
  .sim-section { margin-bottom: 8px; }
  .sim-title { margin: 0 0 4px; font-size: 12px; font-weight: 700;
    &--ok { color: #059669; } &--block { color: #dc2626; }
  }
  .sim-tags { display: flex; flex-wrap: wrap; gap: 4px; }
}

.sim-actions { display: flex; gap: 6px; }

/* ===== 权限画像抽屉 ===== */
.drawer-section {
  margin-bottom: 20px;
  .drawer-section-title { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; font-size: 14px; font-weight: 700; color: #1f2937;
    :deep(.app-icon) { width: 16px; height: 16px; color: #6366f1; }
  }
}

.profile-summary-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
  .ps-item { padding: 10px; border-radius: 8px; background: #f8faff; text-align: center; border: 1px solid #e5eaf3;
    strong { display: block; font-size: 20px; font-weight: 800; color: #4338ca; line-height: 1.2; }
    span { font-size: 12px; color: #6b7280; }
  }
}

/* 雷达图 */
.radar-chart {
  display: flex; justify-content: center;
  .radar-svg { width: 200px; height: 200px; }
}

/* 最近操作 */
.recent-ops {
  display: flex; flex-direction: column; gap: 6px;
  .rop-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px;
    &:last-child { border-bottom: none; }
    .rop-time { color: #94a3b8; flex: 0 0 120px; }
    .rop-target { color: #475569; }
  }
}

/* 权限变更时间线 */
.profile-timeline {
  display: flex; flex-direction: column; gap: 8px;
  .ptl-item { display: flex; align-items: center; gap: 10px; padding: 6px 0;
    .ptl-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; flex-shrink: 0; }
    .ptl-time { font-size: 12px; color: #94a3b8; flex: 0 0 80px; }
    .ptl-event { font-size: 13px; color: #1f2937; }
  }
}
</style>
