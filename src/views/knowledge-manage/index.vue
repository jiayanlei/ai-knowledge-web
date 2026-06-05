<template>
  <PageContainer>
    <div class="km-page">
      <!-- ===== 顶部指挥栏 ===== -->
      <header class="cmd-bar">
        <div class="cmd-left">
          <div class="cmd-kicker"><span />KNOWLEDGE HUB</div>
          <h1>知识中枢管理台</h1>
          <p>企业知识全生命周期治理：创建 → 审核 → 发布 → 更新 → 反馈 → 废弃</p>
        </div>
        <div class="cmd-actions">
          <el-button type="primary" :icon="Plus" @click="openCreateDrawer">新建知识</el-button>
          <el-button :icon="DocumentChecked" @click="auditDialogVisible = true">审核队列 <el-badge :value="stats.pendingReview" :max="99" class="badge-item" /></el-button>
          <el-button :icon="FirstAidKit" @click="healthDialogVisible = true">知识体检 <el-badge :value="healthIssues.length" :max="99" class="badge-item" /></el-button>
          <el-button :icon="Histogram" @click="versionDialogVisible = true">版本动态</el-button>
          <el-button :icon="ChatLineSquare" @click="feedbackDialogVisible = true">反馈中心 <el-badge :value="pendingFeedbacks.length" :max="99" class="badge-item" /></el-button>
        </div>
      </header>

      <!-- ===== 统计卡片 ===== -->
      <div class="stat-row">
        <div class="stat-card app-card" v-for="s in statCards" :key="s.label">
          <div class="sc-icon" :style="{ background: s.bg, color: s.color }"><AppIcon :name="s.icon" /></div>
          <div class="sc-info">
            <strong>{{ s.value }}</strong>
            <span>{{ s.label }}</span>
          </div>
          <svg class="sc-spark" viewBox="0 0 60 24"><polyline :points="s.spark" fill="none" :stroke="s.color" stroke-width="2" /></svg>
        </div>
      </div>

      <!-- ===== 搜索过滤条 ===== -->
      <div class="filter-bar app-card">
        <el-input v-model="searchKeyword" placeholder="搜索知识标题、标签、负责人..." clearable :prefix-icon="Search" class="fb-search" />
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width:120px">
          <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
        </el-select>
        <el-select v-model="filterOwner" placeholder="负责部门" clearable style="width:140px">
          <el-option v-for="o in ownerOptions" :key="o" :label="o" :value="o" />
        </el-select>
        <el-select v-model="filterTag" placeholder="标签" clearable filterable style="width:120px">
          <el-option v-for="t in tagOptions" :key="t" :label="t" :value="t" />
        </el-select>
        <el-button-group class="view-toggle">
          <el-button :type="viewMode === 'card' ? 'primary' : ''" :icon="Grid" @click="viewMode = 'card'" />
          <el-button :type="viewMode === 'table' ? 'primary' : ''" :icon="List" @click="viewMode = 'table'" />
        </el-button-group>
      </div>

      <!-- ===== 三栏主体 ===== -->
      <section class="km-body">
        <!-- 左：知识治理树 -->
        <aside class="gov-tree app-card">
          <div class="gt-header">
            <h3>知识分类</h3>
            <el-button text type="primary" size="small" @click="activeCategory = ''">全部</el-button>
          </div>
          <nav class="gt-list no-scrollbar">
            <button v-for="cat in categories" :key="cat.id" type="button" class="gt-item" :class="{ 'is-active': activeCategory === cat.id }" @click="activeCategory = cat.id">
              <div class="gt-icon" :style="{ background: cat.color + '18', color: cat.color }"><AppIcon :name="cat.icon" /></div>
              <div class="gt-info">
                <span class="gt-name">{{ cat.name }}</span>
                <span class="gt-meta">{{ cat.count }} 篇 · {{ cat.owner }}</span>
              </div>
              <div class="gt-badges">
                <el-badge v-if="cat.pendingReview" :value="cat.pendingReview" type="warning" class="gt-badge" />
                <el-badge v-if="cat.needsUpdate" :value="cat.needsUpdate" type="danger" class="gt-badge" />
              </div>
            </button>
          </nav>
          <div class="gt-footer">
            <div class="gt-summary">
              <span>{{ categories.length }} 个分类</span>
              <span>{{ totalAssetCount }} 篇知识</span>
            </div>
          </div>
        </aside>

        <!-- 中：资产管理区 -->
        <div class="asset-area">
          <el-tabs v-model="centerTab" class="area-tabs">
            <el-tab-pane label="知识资产" name="assets">
              <!-- 卡片视图 -->
              <div v-if="viewMode === 'card'" class="asset-grid">
                <div v-for="asset in filteredAssets" :key="asset.id" class="asset-card app-card" :class="{ 'is-selected': selectedAsset?.id === asset.id }" @click="selectAsset(asset)">
                  <div class="ac-top">
                    <el-tag :type="statusType(asset.status)" size="small" effect="plain">{{ statusLabel(asset.status) }}</el-tag>
                    <div class="ac-badges">
                      <el-tag v-if="asset.recommended" size="small" type="warning" effect="plain">推荐</el-tag>
                      <el-tag v-if="asset.sensitive" size="small" type="danger" effect="plain">敏感</el-tag>
                    </div>
                  </div>
                  <h4 class="ac-title">{{ asset.title }}</h4>
                  <div class="ac-tags"><el-tag v-for="t in asset.tags.slice(0, 3)" :key="t" size="small" type="info" effect="plain" round>{{ t }}</el-tag></div>
                  <div class="ac-meta">
                    <span>{{ asset.categoryName }}</span>
                    <span>{{ asset.owner }}</span>
                  </div>
                  <div class="ac-stats">
                    <span>阅读 {{ asset.views }}</span>
                    <span>收藏 {{ asset.favorites }}</span>
                    <span>反馈 {{ asset.feedbackCount }}</span>
                  </div>
                  <div class="ac-health">
                    <div class="ah-bar"><div class="ah-fill" :style="{ width: asset.healthScore + '%', background: healthColor(asset.healthScore) }" /></div>
                    <span class="ah-score" :style="{ color: healthColor(asset.healthScore) }">{{ asset.healthScore }}</span>
                  </div>
                  <div class="ac-footer">
                    <span class="ac-version">{{ asset.version }}</span>
                    <span class="ac-time">{{ asset.updateTime }}</span>
                  </div>
                </div>
                <div v-if="filteredAssets.length === 0" class="empty-tip">暂无匹配的知识资产</div>
              </div>
              <!-- 表格视图 -->
              <div v-else class="asset-table-wrap">
                <el-table :data="filteredAssets" stripe style="width:100%" highlight-current-row @current-change="selectAsset" size="default">
                  <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
                  <el-table-column prop="categoryName" label="分类" width="120" />
                  <el-table-column label="状态" width="90">
                    <template #default="{ row }"><el-tag :type="statusType(row.status)" size="small" effect="plain">{{ statusLabel(row.status) }}</el-tag></template>
                  </el-table-column>
                  <el-table-column prop="owner" label="负责部门" width="120" />
                  <el-table-column prop="version" label="版本" width="70" />
                  <el-table-column label="健康度" width="90">
                    <template #default="{ row }">
                      <span :style="{ color: healthColor(row.healthScore), fontWeight: 600 }">{{ row.healthScore }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="views" label="阅读" width="70" />
                  <el-table-column prop="updateTime" label="更新时间" width="110" />
                  <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                      <el-button text size="small" type="primary" @click.stop="openEditDrawer(row)">编辑</el-button>
                      <el-button v-if="row.status === 'draft'" text size="small" type="success" @click.stop="handleSubmitAudit(row)">提审</el-button>
                      <el-button v-if="row.status === 'published'" text size="small" type="warning" @click.stop="handleOffline(row)">下架</el-button>
                      <el-button text size="small" type="info" @click.stop="selectAsset(row)">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane name="audit">
              <template #label>审核队列 <el-badge :value="pendingAudits.length" type="warning" class="tab-badge" /></template>
              <div class="audit-list">
                <div v-for="item in auditQueue" :key="item.id" class="audit-item app-card">
                  <div class="ai-left">
                    <el-tag :type="auditStatusType(item.status)" size="small">{{ auditStatusLabel(item.status) }}</el-tag>
                    <div class="ai-info">
                      <h4>{{ item.title }}</h4>
                      <span class="ai-meta">{{ item.submitter }} · {{ item.categoryName }} · {{ item.version }}</span>
                    </div>
                  </div>
                  <div class="ai-center">
                    <p class="ai-note">{{ item.changeNote }}</p>
                    <span class="ai-time">{{ item.submitTime }}</span>
                  </div>
                  <div class="ai-actions">
                    <template v-if="item.status === 'pending'">
                      <el-button size="small" type="success" @click="handleAudit(item.id, 'approved')">通过</el-button>
                      <el-button size="small" type="danger" @click="handleAudit(item.id, 'rejected')">驳回</el-button>
                    </template>
                    <span v-else class="ai-done">{{ item.reviewer }} · {{ item.status === 'approved' ? '已通过' : '已驳回' }}</span>
                  </div>
                </div>
                <div v-if="auditQueue.length === 0" class="empty-tip">审核队列为空</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="版本动态" name="versions">
              <el-timeline class="version-timeline">
                <el-timeline-item v-for="v in versions" :key="v.id" :timestamp="v.time" :type="v.status === 'current' ? 'primary' : 'info'" placement="top">
                  <div class="vt-item">
                    <div class="vt-head">
                      <el-tag :type="v.status === 'current' ? 'success' : 'info'" size="small">{{ v.version }}</el-tag>
                      <span>{{ v.author }}</span>
                    </div>
                    <p>{{ v.note }}</p>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 右：治理详情面板 -->
        <aside class="gov-detail app-card" v-if="selectedAsset">
          <div class="gd-header">
            <h3>{{ selectedAsset.title }}</h3>
            <el-button text :icon="Close" @click="selectedAsset = null" />
          </div>

          <!-- 生命周期流程 -->
          <div class="gd-section">
            <h4>生命周期</h4>
            <div class="lifecycle-flow">
              <div v-for="(step, i) in lifecycleSteps" :key="step.key" class="lf-step" :class="{ 'is-active': step.active, 'is-done': step.done }">
                <div class="lf-dot">{{ i + 1 }}</div>
                <span>{{ step.label }}</span>
              </div>
              <svg class="lf-line" viewBox="0 0 100 4"><rect x="0" y="0" width="100" height="4" rx="2" fill="#e5eaf3" /><rect x="0" y="0" :width="lifecycleProgress" height="4" rx="2" fill="var(--primary-color)" /></svg>
            </div>
          </div>

          <!-- 健康评分 -->
          <div class="gd-section">
            <h4>知识健康度</h4>
            <div class="health-ring">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e5eaf3" stroke-width="6" />
                <circle cx="40" cy="40" r="34" fill="none" :stroke="healthColor(selectedAsset.healthScore)" stroke-width="6" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="circumference - (circumference * selectedAsset.healthScore / 100)" transform="rotate(-90 40 40)" />
                <text x="40" y="38" text-anchor="middle" class="hr-val" :fill="healthColor(selectedAsset.healthScore)">{{ selectedAsset.healthScore }}</text>
                <text x="40" y="50" text-anchor="middle" class="hr-label" fill="#667085">健康分</text>
              </svg>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="gd-section">
            <h4>基本信息</h4>
            <el-descriptions :column="1" size="small" border>
              <el-descriptions-item label="分类">{{ selectedAsset.categoryName }}</el-descriptions-item>
              <el-descriptions-item label="负责人">{{ selectedAsset.owner }}</el-descriptions-item>
              <el-descriptions-item label="版本">{{ selectedAsset.version }}</el-descriptions-item>
              <el-descriptions-item label="可见范围">{{ selectedAsset.scope }}</el-descriptions-item>
              <el-descriptions-item label="可见部门">
                <el-tag v-for="d in selectedAsset.visibleDepts" :key="d" size="small" type="info" effect="plain" round>{{ d }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建人">{{ selectedAsset.creator }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ selectedAsset.createTime }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ selectedAsset.updateTime }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 版本记录 -->
          <div class="gd-section">
            <h4>版本记录</h4>
            <div class="gd-version-list">
              <div v-for="v in assetVersions" :key="v.id" class="gvl-item">
                <el-tag :type="v.status === 'current' ? 'success' : 'info'" size="small">{{ v.version }}</el-tag>
                <span>{{ v.note }}</span>
                <span class="gvl-time">{{ v.time }}</span>
              </div>
              <div v-if="assetVersions.length === 0" class="gd-empty">暂无版本记录</div>
            </div>
          </div>

          <!-- 反馈摘要 -->
          <div class="gd-section">
            <h4>最新反馈</h4>
            <div class="gd-feedback-list">
              <div v-for="f in assetFeedbacks.slice(0, 3)" :key="f.id" class="gfl-item">
                <div class="gfl-head">
                  <el-tag :type="feedbackTypeTag(f.type)" size="small" effect="plain">{{ feedbackTypeLabel(f.type) }}</el-tag>
                  <span>{{ f.feedbackUser }}</span>
                </div>
                <p>{{ f.content }}</p>
              </div>
              <div v-if="assetFeedbacks.length === 0" class="gd-empty">暂无反馈</div>
            </div>
          </div>

          <!-- 操作记录 -->
          <div class="gd-section">
            <h4>操作日志</h4>
            <div class="gd-log-list">
              <div v-for="log in assetLogs" :key="log.id" class="gll-item">
                <span class="gll-time">{{ log.time }}</span>
                <span>{{ log.operator }} · {{ log.action }}</span>
              </div>
              <div v-if="assetLogs.length === 0" class="gd-empty">暂无操作记录</div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="gd-actions">
            <el-button type="primary" size="small" @click="openEditDrawer(selectedAsset)">编辑</el-button>
            <el-button v-if="selectedAsset.status === 'draft'" size="small" type="success" @click="handleSubmitAudit(selectedAsset)">提交审核</el-button>
            <el-button v-if="selectedAsset.status === 'published'" size="small" type="warning" @click="handleOffline(selectedAsset)">下架</el-button>
            <el-button v-if="selectedAsset.status === 'offline'" size="small" type="success" @click="handleRePublish(selectedAsset)">重新发布</el-button>
            <el-button v-if="selectedAsset.status !== 'deprecated'" size="small" type="danger" @click="handleDeprecate(selectedAsset)">废弃</el-button>
            <el-button size="small" @click="handleAIAssist(selectedAsset)">AI 辅助分析</el-button>
          </div>
        </aside>

        <!-- 右侧空态 -->
        <aside class="gov-detail app-card gov-empty-state" v-else>
          <AppIcon name="Document" class="ges-icon" />
          <p>选择一篇知识文档<br>查看治理详情</p>
        </aside>
      </section>

      <!-- ===== 新建/编辑抽屉 ===== -->
      <el-drawer v-model="editDrawerVisible" :title="editingAsset ? '编辑知识' : '新建知识'" size="520px" destroy-on-close>
        <el-form :model="editForm" label-width="90px" class="edit-form">
          <el-form-item label="标题" required>
            <el-input v-model="editForm.title" placeholder="请输入知识标题" />
          </el-form-item>
          <el-form-item label="分类" required>
            <el-select v-model="editForm.categoryId" placeholder="选择分类" style="width:100%">
              <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="editForm.tags" multiple filterable allow-create placeholder="选择或输入标签" style="width:100%">
              <el-option v-for="t in tagOptions" :key="t" :label="t" :value="t" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责部门" required>
            <el-select v-model="editForm.owner" placeholder="选择负责部门" style="width:100%">
              <el-option v-for="o in ownerOptions" :key="o" :label="o" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item label="可见范围">
            <el-select v-model="editForm.scope" placeholder="选择可见范围" style="width:100%">
              <el-option label="全体员工" value="全体员工" />
              <el-option label="研发人员" value="研发人员" />
              <el-option label="新入职员工" value="新入职员工" />
              <el-option label="项目经理" value="项目经理" />
              <el-option label="运维人员" value="运维人员" />
            </el-select>
          </el-form-item>
          <el-form-item label="可见部门">
            <el-select v-model="editForm.visibleDepts" multiple placeholder="选择可见部门" style="width:100%">
              <el-option v-for="d in deptOptions" :key="d" :label="d" :value="d" />
            </el-select>
          </el-form-item>
          <el-form-item label="版本号">
            <el-input v-model="editForm.version" placeholder="如 V1.0" />
          </el-form-item>
          <el-form-item label="敏感内容">
            <el-switch v-model="editForm.sensitive" />
          </el-form-item>
          <el-form-item label="推荐">
            <el-switch v-model="editForm.recommended" />
          </el-form-item>
          <el-form-item label="变更说明">
            <el-input v-model="editForm.changeNote" type="textarea" :rows="3" placeholder="描述本次变更的内容" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editDrawerVisible = false">取消</el-button>
          <el-button v-if="!editingAsset" type="primary" @click="handleCreateSave">保存为草稿</el-button>
          <el-button v-else type="primary" @click="handleEditSave">保存修改</el-button>
        </template>
      </el-drawer>

      <!-- ===== 审核队列弹窗 ===== -->
      <el-dialog v-model="auditDialogVisible" title="审核队列" width="720px" destroy-on-close>
        <el-table :data="auditQueue" stripe>
          <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
          <el-table-column prop="submitter" label="提交人" width="80" />
          <el-table-column prop="categoryName" label="分类" width="110" />
          <el-table-column prop="version" label="版本" width="70" />
          <el-table-column prop="changeNote" label="变更说明" min-width="140" show-overflow-tooltip />
          <el-table-column prop="submitTime" label="提交时间" width="140" />
          <el-table-column label="状态" width="80">
            <template #default="{ row }"><el-tag :type="auditStatusType(row.status)" size="small">{{ auditStatusLabel(row.status) }}</el-tag></template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <template v-if="row.status === 'pending'">
                <el-button text size="small" type="success" @click="handleAudit(row.id, 'approved')">通过</el-button>
                <el-button text size="small" type="danger" @click="handleAudit(row.id, 'rejected')">驳回</el-button>
              </template>
              <span v-else class="muted-text">{{ row.reviewer }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- ===== 版本管理弹窗 ===== -->
      <el-dialog v-model="versionDialogVisible" title="版本动态" width="600px" destroy-on-close>
        <el-timeline>
          <el-timeline-item v-for="v in versions" :key="v.id" :timestamp="v.time + ' · ' + v.author" :type="v.status === 'current' ? 'primary' : 'info'" placement="top">
            <div class="vt-dialog-item">
              <el-tag :type="v.status === 'current' ? 'success' : 'info'" size="small">{{ v.version }}</el-tag>
              <span>{{ v.note }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-dialog>

      <!-- ===== 知识体检弹窗 ===== -->
      <el-dialog v-model="healthDialogVisible" title="知识体检报告" width="680px" destroy-on-close>
        <div class="health-summary">
          <div class="hs-item" :class="{ 'has-issue': highIssues.length }">
            <strong>{{ highIssues.length }}</strong><span>高风险</span>
          </div>
          <div class="hs-item" :class="{ 'has-issue': mediumIssues.length }">
            <strong>{{ mediumIssues.length }}</strong><span>中风险</span>
          </div>
          <div class="hs-item">
            <strong>{{ lowIssues.length }}</strong><span>低风险</span>
          </div>
          <div class="hs-item">
            <strong>{{ healthIssues.filter(h => h.handled).length }}</strong><span>已处理</span>
          </div>
        </div>
        <el-table :data="healthIssues" stripe>
          <el-table-column prop="title" label="知识标题" min-width="160" show-overflow-tooltip />
          <el-table-column prop="issue" label="问题描述" min-width="200" show-overflow-tooltip />
          <el-table-column label="风险等级" width="90">
            <template #default="{ row }">
              <el-tag :type="row.level === 'high' ? 'danger' : row.level === 'medium' ? 'warning' : 'info'" size="small">{{ row.level === 'high' ? '高' : row.level === 'medium' ? '中' : '低' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.handled ? 'success' : 'warning'" size="small">{{ row.handled ? '已处理' : '待处理' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button v-if="!row.handled" text size="small" type="primary" @click="handleHealthFix(row.id)">处理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- ===== 反馈中心弹窗 ===== -->
      <el-dialog v-model="feedbackDialogVisible" title="反馈中心" width="780px" destroy-on-close>
        <el-tabs v-model="feedbackTab">
          <el-tab-pane label="待处理" name="pending">
            <el-table :data="feedbacks.filter(f => f.handleStatus === 'pending')" stripe>
              <el-table-column prop="feedbackUser" label="反馈人" width="90" />
              <el-table-column label="类型" width="80">
                <template #default="{ row }"><el-tag :type="feedbackTypeTag(row.type)" size="small" effect="plain">{{ feedbackTypeLabel(row.type) }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
              <el-table-column prop="time" label="时间" width="140" />
              <el-table-column label="操作" width="140">
                <template #default="{ row }">
                  <el-button text size="small" type="primary" @click="handleFeedbackProcess(row.id)">处理</el-button>
                  <el-button text size="small" type="info" @click="handleFeedbackIgnore(row.id)">忽略</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="处理中" name="processing">
            <el-table :data="feedbacks.filter(f => f.handleStatus === 'processing')" stripe>
              <el-table-column prop="feedbackUser" label="反馈人" width="90" />
              <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
              <el-table-column prop="handler" label="处理人" width="90" />
              <el-table-column prop="handleResult" label="处理结果" width="120" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已完成" name="handled">
            <el-table :data="feedbacks.filter(f => f.handleStatus === 'handled')" stripe>
              <el-table-column prop="feedbackUser" label="反馈人" width="90" />
              <el-table-column label="类型" width="80">
                <template #default="{ row }"><el-tag :type="feedbackTypeTag(row.type)" size="small" effect="plain">{{ feedbackTypeLabel(row.type) }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
              <el-table-column prop="handler" label="处理人" width="90" />
              <el-table-column prop="handleResult" label="处理结果" width="120" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>

      <!-- ===== AI 辅助分析弹窗 ===== -->
      <el-dialog v-model="aiAssistVisible" title="AI 辅助分析" width="520px" destroy-on-close>
        <div class="ai-assist-content" v-if="aiAssistTarget">
          <div class="aac-section">
            <h4>知识质量评估</h4>
            <p>当前健康分 <strong :style="{ color: healthColor(aiAssistTarget.healthScore) }">{{ aiAssistTarget.healthScore }}</strong> 分。{{ aiAssistTarget.healthScore >= 80 ? '内容质量良好，建议持续维护。' : aiAssistTarget.healthScore >= 60 ? '内容质量一般，建议补充完善。' : '内容质量较低，建议尽快修订。' }}</p>
          </div>
          <div class="aac-section">
            <h4>优化建议</h4>
            <ul>
              <li v-if="aiAssistTarget.healthScore < 80">建议更新内容以匹配最新业务流程</li>
              <li v-if="aiAssistTarget.feedbackCount > 5">员工反馈较多，建议逐一处理并优化文档</li>
              <li v-if="aiAssistTarget.tags.length < 3">标签较少，建议补充更多关键词以提升检索命中率</li>
              <li v-if="aiAssistTarget.views < 500">阅读量偏低，建议推广或关联到其他知识</li>
              <li>建议添加更多实际案例和操作截图</li>
            </ul>
          </div>
          <div class="aac-section">
            <h4>关联推荐</h4>
            <p>基于内容分析，建议关联以下知识：「{{ aiAssistTarget.categoryName }}」分类下的其他文档，以及标签相关的跨部门知识。</p>
          </div>
        </div>
      </el-dialog>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, Grid, List, Close, DocumentChecked, FirstAidKit, Histogram, ChatLineSquare } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  getCategoriesMock, getAssetsMock, getAuditQueueMock, getVersionsMock,
  getFeedbacksMock, getHealthCheckMock, getOperationLogsMock, getTopStatsMock,
  tagOptions, ownerOptions, deptOptions, statusOptions,
  type KnowledgeAsset, type AuditItem, type FeedbackItem, type HealthCheckItem
} from './mock'

// ===== 基础数据 =====
const categories = ref(getCategoriesMock())
const assets = ref(getAssetsMock())
const auditQueue = ref(getAuditQueueMock())
const versions = ref(getVersionsMock())
const feedbacks = ref(getFeedbacksMock())
const healthIssues = ref(getHealthCheckMock())
const operationLogs = ref(getOperationLogsMock())
const stats = ref(getTopStatsMock())

// ===== 状态 =====
const searchKeyword = ref('')
const filterStatus = ref('')
const filterOwner = ref('')
const filterTag = ref('')
const viewMode = ref<'card' | 'table'>('card')
const activeCategory = ref('')
const centerTab = ref('assets')
const selectedAsset = ref<KnowledgeAsset | null>(null)

// ===== 弹窗/抽屉 =====
const editDrawerVisible = ref(false)
const editingAsset = ref<KnowledgeAsset | null>(null)
const auditDialogVisible = ref(false)
const versionDialogVisible = ref(false)
const healthDialogVisible = ref(false)
const feedbackDialogVisible = ref(false)
const feedbackTab = ref('pending')
const aiAssistVisible = ref(false)
const aiAssistTarget = ref<KnowledgeAsset | null>(null)

// ===== 编辑表单 =====
const editForm = ref({
  title: '',
  categoryId: '',
  tags: [] as string[],
  owner: '',
  scope: '全体员工',
  visibleDepts: [] as string[],
  version: 'V1.0',
  sensitive: false,
  recommended: false,
  changeNote: ''
})

// ===== 统计卡片 =====
const statCards = computed(() => [
  { label: '知识总量', value: stats.value.total, icon: 'Collection', color: '#6366f1', bg: '#eef2ff', spark: '0,20 10,16 20,12 30,8 40,14 50,6 60,4' },
  { label: '待审核', value: stats.value.pendingReview, icon: 'DocumentChecked', color: '#f59e0b', bg: '#fffbeb', spark: '0,12 10,14 20,10 30,16 40,8 50,12 60,6' },
  { label: '待更新', value: stats.value.needsUpdate, icon: 'RefreshRight', color: '#ef4444', bg: '#fef2f2', spark: '0,8 10,10 20,14 30,12 40,16 50,10 60,8' },
  { label: '已发布', value: stats.value.published, icon: 'CircleCheck', color: '#22c55e', bg: '#f0fdf4', spark: '0,18 10,14 20,12 30,10 40,8 50,6 60,4' },
  { label: '已下架', value: stats.value.offline, icon: 'Download', color: '#64748b', bg: '#f8fafc', spark: '0,6 10,8 20,10 30,8 40,12 50,10 60,14' },
  { label: '今日反馈', value: stats.value.todayFeedback, icon: 'ChatLineSquare', color: '#3b82f6', bg: '#eff6ff', spark: '0,14 10,10 20,16 30,8 40,12 50,6 60,10' }
])

const totalAssetCount = computed(() => categories.value.reduce((s, c) => s + c.count, 0))

// ===== 过滤 =====
const filteredAssets = computed(() => {
  return assets.value.filter(a => {
    if (activeCategory.value && a.categoryId !== activeCategory.value) return false
    if (filterStatus.value && a.status !== filterStatus.value) return false
    if (filterOwner.value && a.owner !== filterOwner.value) return false
    if (filterTag.value && !a.tags.includes(filterTag.value)) return false
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      const match = a.title.toLowerCase().includes(kw) ||
        a.tags.some(t => t.toLowerCase().includes(kw)) ||
        a.owner.toLowerCase().includes(kw) ||
        a.categoryName.toLowerCase().includes(kw)
      if (!match) return false
    }
    return true
  })
})

const pendingAudits = computed(() => auditQueue.value.filter(a => a.status === 'pending'))
const pendingFeedbacks = computed(() => feedbacks.value.filter(f => f.handleStatus === 'pending'))
const highIssues = computed(() => healthIssues.value.filter(h => h.level === 'high'))
const mediumIssues = computed(() => healthIssues.value.filter(h => h.level === 'medium'))
const lowIssues = computed(() => healthIssues.value.filter(h => h.level === 'low'))

// ===== 右侧面板计算 =====
const assetVersions = computed(() => {
  if (!selectedAsset.value) return []
  return versions.value.filter(v => v.assetId === selectedAsset.value!.id)
})
const assetFeedbacks = computed(() => {
  if (!selectedAsset.value) return []
  return feedbacks.value.filter(f => f.assetId === selectedAsset.value!.id)
})
const assetLogs = computed(() => {
  if (!selectedAsset.value) return []
  const title = selectedAsset.value!.title
  return operationLogs.value.filter(l => l.target.includes(title))
})

const lifecycleSteps = computed(() => {
  const s = selectedAsset.value?.status || 'draft'
  const order = ['draft', 'pending', 'published', 'needs_update', 'offline', 'deprecated']
  const labels = ['草稿', '审核中', '已发布', '待更新', '已下架', '已废弃']
  const currentIdx = order.indexOf(s)
  return labels.map((label, i) => ({
    key: order[i],
    label,
    done: i < currentIdx,
    active: i === currentIdx
  }))
})

const lifecycleProgress = computed(() => {
  const steps = lifecycleSteps.value
  const activeIdx = steps.findIndex(s => s.active)
  if (activeIdx < 0) return 0
  return ((activeIdx + 1) / steps.length) * 100
})

const circumference = 2 * Math.PI * 34

// ===== 工具函数 =====
function statusType(s: string) {
  const map: Record<string, string> = { draft: 'info', pending: 'warning', published: 'success', needs_update: 'danger', offline: 'info', deprecated: 'danger' }
  return (map[s] || 'info') as any
}
function statusLabel(s: string) {
  const map: Record<string, string> = { draft: '草稿', pending: '待审核', published: '已发布', needs_update: '待更新', offline: '已下架', deprecated: '已废弃' }
  return map[s] || s
}
function auditStatusType(s: string) {
  const map: Record<string, string> = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return (map[s] || 'info') as any
}
function auditStatusLabel(s: string) {
  const map: Record<string, string> = { pending: '待审核', approved: '已通过', rejected: '已驳回' }
  return map[s] || s
}
function healthColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}
function feedbackTypeLabel(t: string) {
  const map: Record<string, string> = { solved: '已解决', unsolved: '未解决', outdated: '已过时', unclear: '不清晰', missing: '有缺失' }
  return map[t] || t
}
function feedbackTypeTag(t: string) {
  const map: Record<string, string> = { solved: 'success', unsolved: 'warning', outdated: 'danger', unclear: 'info', missing: 'warning' }
  return (map[t] || 'info') as any
}

// ===== 操作 =====
function selectAsset(asset: KnowledgeAsset) {
  selectedAsset.value = asset
}

function openCreateDrawer() {
  editingAsset.value = null
  editForm.value = { title: '', categoryId: '', tags: [], owner: '', scope: '全体员工', visibleDepts: [], version: 'V1.0', sensitive: false, recommended: false, changeNote: '' }
  editDrawerVisible.value = true
}

function openEditDrawer(asset: KnowledgeAsset) {
  editingAsset.value = asset
  editForm.value = {
    title: asset.title,
    categoryId: asset.categoryId,
    tags: [...asset.tags],
    owner: asset.owner,
    scope: asset.scope,
    visibleDepts: [...asset.visibleDepts],
    version: asset.version,
    sensitive: asset.sensitive,
    recommended: asset.recommended,
    changeNote: ''
  }
  editDrawerVisible.value = true
}

function handleCreateSave() {
  if (!editForm.value.title) { ElMessage.warning('请输入标题'); return }
  const cat = categories.value.find(c => c.id === editForm.value.categoryId)
  const newAsset: KnowledgeAsset = {
    id: 'a' + Date.now(),
    title: editForm.value.title,
    categoryId: editForm.value.categoryId || 'c1',
    categoryName: cat?.name || '未分类',
    tags: editForm.value.tags,
    owner: editForm.value.owner || '未指定',
    version: editForm.value.version || 'V1.0',
    status: 'draft',
    scope: editForm.value.scope,
    updateTime: new Date().toISOString().slice(0, 10),
    createTime: new Date().toISOString().slice(0, 10),
    creator: '当前用户',
    views: 0,
    favorites: 0,
    feedbackCount: 0,
    healthScore: 60,
    recommended: editForm.value.recommended,
    sensitive: editForm.value.sensitive,
    visibleDepts: editForm.value.visibleDepts
  }
  assets.value.unshift(newAsset)
  editDrawerVisible.value = false
  ElMessage.success('知识已创建为草稿')
}

function handleEditSave() {
  if (!editingAsset.value) return
  const idx = assets.value.findIndex(a => a.id === editingAsset.value!.id)
  if (idx < 0) return
  const cat = categories.value.find(c => c.id === editForm.value.categoryId)
  assets.value[idx] = {
    ...assets.value[idx],
    title: editForm.value.title,
    categoryId: editForm.value.categoryId,
    categoryName: cat?.name || assets.value[idx].categoryName,
    tags: editForm.value.tags,
    owner: editForm.value.owner,
    scope: editForm.value.scope,
    visibleDepts: editForm.value.visibleDepts,
    version: editForm.value.version,
    sensitive: editForm.value.sensitive,
    recommended: editForm.value.recommended,
    updateTime: new Date().toISOString().slice(0, 10)
  }
  if (selectedAsset.value?.id === editingAsset.value.id) {
    selectedAsset.value = assets.value[idx]
  }
  editDrawerVisible.value = false
  ElMessage.success('知识已更新')
}

function handleSubmitAudit(asset: KnowledgeAsset) {
  const idx = assets.value.findIndex(a => a.id === asset.id)
  if (idx >= 0) {
    assets.value[idx].status = 'pending'
    auditQueue.value.unshift({
      id: 'au' + Date.now(),
      assetId: asset.id,
      title: asset.title,
      submitter: asset.creator,
      categoryId: asset.categoryId,
      categoryName: asset.categoryName,
      submitTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      version: asset.version,
      changeNote: '提交审核',
      reviewer: '',
      status: 'pending'
    })
    if (selectedAsset.value?.id === asset.id) selectedAsset.value = assets.value[idx]
    ElMessage.success('已提交审核')
  }
}

function handleAudit(id: string, result: 'approved' | 'rejected') {
  const idx = auditQueue.value.findIndex(a => a.id === id)
  if (idx < 0) return
  auditQueue.value[idx].status = result
  auditQueue.value[idx].reviewer = '当前管理员'
  const assetIdx = assets.value.findIndex(a => a.id === auditQueue.value[idx].assetId)
  if (assetIdx >= 0) {
    assets.value[assetIdx].status = result === 'approved' ? 'published' : 'draft'
    if (selectedAsset.value?.id === auditQueue.value[idx].assetId) {
      selectedAsset.value = assets.value[assetIdx]
    }
  }
  ElMessage.success(result === 'approved' ? '审核通过' : '已驳回')
}

function handleOffline(asset: KnowledgeAsset) {
  const idx = assets.value.findIndex(a => a.id === asset.id)
  if (idx >= 0) {
    assets.value[idx].status = 'offline'
    if (selectedAsset.value?.id === asset.id) selectedAsset.value = assets.value[idx]
    ElMessage.success('已下架')
  }
}

function handleRePublish(asset: KnowledgeAsset) {
  const idx = assets.value.findIndex(a => a.id === asset.id)
  if (idx >= 0) {
    assets.value[idx].status = 'published'
    if (selectedAsset.value?.id === asset.id) selectedAsset.value = assets.value[idx]
    ElMessage.success('已重新发布')
  }
}

function handleDeprecate(asset: KnowledgeAsset) {
  const idx = assets.value.findIndex(a => a.id === asset.id)
  if (idx >= 0) {
    assets.value[idx].status = 'deprecated'
    if (selectedAsset.value?.id === asset.id) selectedAsset.value = assets.value[idx]
    ElMessage.success('已标记为废弃')
  }
}

function handleHealthFix(id: string) {
  const idx = healthIssues.value.findIndex(h => h.id === id)
  if (idx >= 0) {
    healthIssues.value[idx].handled = true
    ElMessage.success('已标记为处理完成')
  }
}

function handleFeedbackProcess(id: string) {
  const idx = feedbacks.value.findIndex(f => f.id === id)
  if (idx >= 0) {
    feedbacks.value[idx].handleStatus = 'processing'
    feedbacks.value[idx].handler = '当前管理员'
    feedbacks.value[idx].handleResult = '正在处理中'
    ElMessage.success('已开始处理')
  }
}

function handleFeedbackIgnore(id: string) {
  const idx = feedbacks.value.findIndex(f => f.id === id)
  if (idx >= 0) {
    feedbacks.value[idx].handleStatus = 'ignored'
    feedbacks.value[idx].handler = '当前管理员'
    feedbacks.value[idx].handleResult = '已忽略'
    ElMessage.info('已忽略该反馈')
  }
}

function handleAIAssist(asset: KnowledgeAsset) {
  aiAssistTarget.value = asset
  aiAssistVisible.value = true
}
</script>

<style scoped lang="scss">
.km-page {
  display: flex;
  flex-direction: column;
  gap: var(--app-section-gap);
  height: 100%;
}

/* ===== 指挥栏 ===== */
.cmd-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-radius: var(--app-card-radius);
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%);
  color: #fff;

  .cmd-kicker {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    opacity: 0.7;
    margin-bottom: 4px;
    span { width: 18px; height: 2px; background: currentColor; border-radius: 1px; }
  }
  h1 { font-size: 20px; font-weight: 700; margin: 0 0 2px; }
  p { font-size: 13px; opacity: 0.8; margin: 0; }
  .cmd-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .badge-item { margin-left: 4px; }
}

/* ===== 统计卡片 ===== */
.stat-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;

  .stat-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 14px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s;
    &:hover { transform: translateY(-2px); }
    .sc-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .sc-info { display: flex; flex-direction: column; strong { font-size: 20px; font-weight: 700; color: var(--text-color); } span { font-size: 12px; color: var(--text-secondary); } }
    .sc-spark { position: absolute; right: 8px; bottom: 6px; width: 60px; height: 24px; opacity: 0.35; }
  }
}

/* ===== 过滤条 ===== */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  .fb-search { flex: 1; }
  .view-toggle { flex-shrink: 0; }
}

/* ===== 三栏主体 ===== */
.km-body {
  display: grid;
  grid-template-columns: 220px 1fr 300px;
  gap: var(--app-section-gap);
  flex: 1;
  min-height: 0;
}

/* ===== 治理树 ===== */
.gov-tree {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .gt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 14px 8px;
    h3 { font-size: 14px; font-weight: 600; margin: 0; color: var(--text-color); }
  }

  .gt-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 8px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .gt-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 8px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: background 0.15s;
    &:hover { background: #f0f4ff; }
    &.is-active { background: var(--primary-light); }

    .gt-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
    .gt-info { flex: 1; min-width: 0; display: flex; flex-direction: column;
      .gt-name { font-size: 13px; font-weight: 500; color: var(--text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .gt-meta { font-size: 11px; color: var(--text-secondary); }
    }
    .gt-badges { display: flex; gap: 4px; flex-shrink: 0; }
  }

  .gt-footer {
    padding: 10px 14px;
    border-top: 1px solid var(--border-color);
    .gt-summary { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); }
  }
}

/* ===== 资产区域 ===== */
.asset-area {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.area-tabs) {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-tabs__header { margin-bottom: 0; padding: 0 4px; }
    .el-tabs__content { flex: 1; overflow-y: auto; padding: 10px 4px; }
    .el-tab-pane { height: 100%; }
  }

  .tab-badge { margin-left: 4px; }
}

/* 卡片视图 */
.asset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}

.asset-card {
  padding: 14px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(29, 78, 216, 0.1); }
  &.is-selected { border-color: var(--primary-color); }

  .ac-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
    .ac-badges { display: flex; gap: 4px; }
  }
  .ac-title { font-size: 14px; font-weight: 600; color: var(--text-color); margin: 0 0 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ac-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
  .ac-meta { display: flex; gap: 12px; font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; }
  .ac-stats { display: flex; gap: 12px; font-size: 11px; color: var(--text-secondary); margin-bottom: 8px; }
  .ac-health {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    .ah-bar { flex: 1; height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden;
      .ah-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }
    }
    .ah-score { font-size: 12px; font-weight: 600; }
  }
  .ac-footer { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-secondary);
    .ac-version { font-weight: 500; }
  }
}

/* 表格视图 */
.asset-table-wrap { overflow-x: auto; }

/* 审核列表 */
.audit-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.audit-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 14px;

  .ai-left { display: flex; align-items: center; gap: 10px; min-width: 200px;
    .ai-info { h4 { font-size: 13px; font-weight: 600; margin: 0 0 2px; color: var(--text-color); }
      .ai-meta { font-size: 11px; color: var(--text-secondary); }
    }
  }
  .ai-center { flex: 1; min-width: 0;
    .ai-note { font-size: 12px; color: var(--text-color); margin: 0 0 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ai-time { font-size: 11px; color: var(--text-secondary); }
  }
  .ai-actions { display: flex; gap: 6px; flex-shrink: 0;
    .ai-done { font-size: 11px; color: var(--text-secondary); }
  }
}

/* 版本时间线 */
.version-timeline { padding: 10px 0; }
.vt-item {
  .vt-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; span { font-size: 12px; color: var(--text-secondary); } }
  p { font-size: 13px; color: var(--text-color); margin: 0; }
}
.vt-dialog-item { display: flex; align-items: center; gap: 8px; span { font-size: 13px; } }

/* ===== 治理详情面板 ===== */
.gov-detail {
  overflow-y: auto;
  padding: 0;

  .gd-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 14px 8px;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
    h3 { font-size: 14px; font-weight: 600; margin: 0; color: var(--text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }

  .gd-section {
    padding: 10px 14px;
    border-top: 1px solid var(--border-color);
    h4 { font-size: 13px; font-weight: 600; color: var(--text-color); margin: 0 0 10px; }
  }

  .gd-empty { font-size: 12px; color: var(--text-secondary); text-align: center; padding: 12px 0; }

  .gd-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 12px 14px;
    border-top: 1px solid var(--border-color);
    position: sticky;
    bottom: 0;
    background: #fff;
  }
}

/* 空态 */
.gov-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .ges-icon { font-size: 48px; color: #d1d5db; margin-bottom: 12px; }
  p { font-size: 13px; color: var(--text-secondary); text-align: center; line-height: 1.6; }
}

/* 生命周期 */
.lifecycle-flow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  padding: 0 4px;

  .lf-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    z-index: 1;
    .lf-dot {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      background: #f0f0f0;
      color: #999;
      transition: all 0.3s;
    }
    span { font-size: 10px; color: #999; white-space: nowrap; }

    &.is-done {
      .lf-dot { background: var(--primary-color); color: #fff; }
      span { color: var(--primary-color); }
    }
    &.is-active {
      .lf-dot { background: #fff; border: 2px solid var(--primary-color); color: var(--primary-color); }
      span { color: var(--primary-color); font-weight: 600; }
    }
  }

  .lf-line {
    position: absolute;
    top: 11px;
    left: 15px;
    right: 15px;
    width: calc(100% - 30px);
    height: 4px;
  }
}

/* 健康环 */
.health-ring {
  display: flex;
  justify-content: center;
  svg { width: 80px; height: 80px; }
  .hr-val { font-size: 18px; font-weight: 700; }
  .hr-label { font-size: 9px; }
}

/* 版本列表 */
.gd-version-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  .gvl-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-color);
    .gvl-time { margin-left: auto; font-size: 11px; color: var(--text-secondary); }
  }
}

/* 反馈列表 */
.gd-feedback-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  .gfl-item {
    padding: 8px;
    background: #fafbfc;
    border-radius: 6px;
    .gfl-head { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; span { font-size: 11px; color: var(--text-secondary); } }
    p { font-size: 12px; color: var(--text-color); margin: 0; line-height: 1.5; }
  }
}

/* 操作日志 */
.gd-log-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  .gll-item {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: var(--text-color);
    .gll-time { color: var(--text-secondary); flex-shrink: 0; }
  }
}

/* ===== 编辑表单 ===== */
.edit-form { padding: 0 4px; }

/* ===== 体检弹窗 ===== */
.health-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;

  .hs-item {
    text-align: center;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
    strong { display: block; font-size: 24px; font-weight: 700; color: var(--text-secondary); }
    span { font-size: 12px; color: var(--text-secondary); }
    &.has-issue strong { color: var(--danger-color); }
  }
}

/* ===== AI 辅助 ===== */
.ai-assist-content {
  .aac-section {
    margin-bottom: 16px;
    h4 { font-size: 14px; font-weight: 600; margin: 0 0 8px; color: var(--text-color); }
    p { font-size: 13px; color: var(--text-color); line-height: 1.6; margin: 0; }
    ul { padding-left: 18px; margin: 0; li { font-size: 13px; color: var(--text-color); line-height: 1.8; } }
  }
}

/* ===== 空提示 ===== */
.empty-tip {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  font-size: 13px;
  color: var(--text-secondary);
}

/* ===== 响应式 ===== */
@media (max-width: 1400px) {
  .km-body { grid-template-columns: 200px 1fr 280px; }
  .stat-row { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 1100px) {
  .km-body { grid-template-columns: 180px 1fr; }
  .gov-detail { display: none; }
  .stat-row { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 800px) {
  .km-body { grid-template-columns: 1fr; }
  .gov-tree { display: none; }
  .stat-row { grid-template-columns: repeat(2, 1fr); }
  .cmd-bar { flex-direction: column; gap: 12px; align-items: flex-start; }
  .filter-bar { flex-wrap: wrap; }
}
</style>
