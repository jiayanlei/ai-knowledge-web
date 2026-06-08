<template>
  <PageContainer>
    <div class="dc-page">
      <!-- ===== 顶部：文档解析指挥台 ===== -->
      <header class="cmd-bar">
        <div class="cmd-bg" />
        <div class="cmd-content">
          <div class="cmd-left">
            <div class="cmd-kicker"><span />DOCUMENT HUB</div>
            <h1>企业文档解析中枢</h1>
            <p>上传、解析和治理企业内部文档，为 AI 问答提供可信知识来源</p>
            <div class="cmd-search">
              <el-input v-model="searchKeyword" placeholder="搜索文档名称、来源部门、标签、解析状态、上传人..." clearable size="large" class="search-input" :prefix-icon="Search" @keyup.enter="handleSearch" />
              <el-button type="primary" size="large" @click="handleSearch">搜索</el-button>
            </div>
          </div>
          <div class="cmd-actions">
            <el-button type="primary" :icon="Upload" @click="uploadDrawerVisible = true">上传文档</el-button>
            <el-button :icon="UploadFilled" @click="handleBatchUpload">批量上传</el-button>
            <el-button :icon="RefreshRight" @click="handleBatchParse">批量解析</el-button>
            <el-button :icon="Connection" @click="handleReindex">重新索引</el-button>
            <el-button :icon="Notebook" @click="logDialogVisible = true">解析日志</el-button>
          </div>
        </div>
      </header>

      <!-- ===== 统计卡片 ===== -->
      <div class="stat-row">
        <div class="stat-card app-card" v-for="s in statCards" :key="s.label" :class="{ 'is-active': activeStatCard === s.key }" @click="handleStatCardClick(s.key)" style="cursor: pointer;">
          <div class="sc-icon" :style="{ background: s.bg, color: s.color }"><AppIcon :name="s.icon" /></div>
          <div class="sc-info">
            <strong>{{ s.value }}</strong>
            <span>{{ s.label }}</span>
          </div>
          <svg class="sc-spark" viewBox="0 0 60 24"><polyline :points="s.spark" fill="none" :stroke="s.color" stroke-width="2" /></svg>
        </div>
      </div>

      <!-- ===== 统计联动面板 ===== -->
      <div v-if="activeStatCard" class="stat-detail-panel app-card">
        <div class="sdp-header">
          <h3>{{ statDetailTitle }}</h3>
          <div class="sdp-actions">
            <el-tag v-if="activeStatCard === 'pending'" v-for="filter in pendingFilters" :key="filter.value" :type="pendingStatusFilter === filter.value ? '' : 'info'" size="small" effect="plain" round @click="pendingStatusFilter = filter.value" style="cursor: pointer; margin-right: 4px;">{{ filter.label }}</el-tag>
            <el-button text size="small" @click="activeStatCard = ''">关闭面板</el-button>
          </div>
        </div>

        <!-- 待处理文档 -->
        <el-table v-if="activeStatCard === 'pending'" :data="pendingDocs" stripe size="default" :header-cell-style="{ background: '#f8faff', color: '#475569', fontWeight: 600, fontSize: '12px' }">
          <el-table-column prop="title" label="文档名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="uploader" label="上传人" width="90" />
          <el-table-column prop="uploadTime" label="上传时间" width="150" />
          <el-table-column prop="type" label="文档类型" width="90" />
          <el-table-column label="当前状态" width="100">
            <template #default="{ row }"><el-tag :type="statusTagType(row.status)" size="small" effect="plain">{{ statusLabel(row.status) }}</el-tag></template>
          </el-table-column>
          <el-table-column label="预计动作" width="120">
            <template #default="{ row }"><span class="pending-action">{{ getPendingAction(row) }}</span></template>
          </el-table-column>
        </el-table>

        <!-- 已解析文档 -->
        <el-table v-if="activeStatCard === 'parsed'" :data="parsedDocs" stripe size="default" :header-cell-style="{ background: '#f8faff', color: '#475569', fontWeight: 600, fontSize: '12px' }">
          <el-table-column prop="title" label="文档名称" min-width="200" show-overflow-tooltip />
          <el-table-column label="知识分类" width="120">
            <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.sourceName }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="uploadTime" label="解析时间" width="150" />
          <el-table-column prop="segments" label="切片数量" width="90" />
          <el-table-column label="质量评分" width="100">
            <template #default="{ row }"><span v-if="row.qualityScore" :style="{ color: qualityColor(row.qualityScore), fontWeight: 600 }">{{ row.qualityScore }}%</span><span v-else class="muted-text">—</span></template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default="{ row }"><el-button text size="small" type="primary" @click.stop="openParseResult(row)">查看详情</el-button></template>
          </el-table-column>
        </el-table>

        <!-- 解析失败文档 -->
        <el-table v-if="activeStatCard === 'failed'" :data="failedDocs" stripe size="default" :header-cell-style="{ background: '#f8faff', color: '#475569', fontWeight: 600, fontSize: '12px' }">
          <el-table-column prop="title" label="文档名称" min-width="200" show-overflow-tooltip />
          <el-table-column label="失败原因" min-width="200">
            <template #default="{ row }"><span class="fail-reason">{{ getFailReason(row) }}</span></template>
          </el-table-column>
          <el-table-column prop="uploader" label="上传人" width="90" />
          <el-table-column prop="uploadTime" label="失败时间" width="150" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }"><el-button text size="small" type="primary" @click.stop="handleReparse(row)">重新解析</el-button></template>
          </el-table-column>
        </el-table>

        <!-- 今日上传文档 -->
        <el-table v-if="activeStatCard === 'today'" :data="todayDocs" stripe size="default" :header-cell-style="{ background: '#f8faff', color: '#475569', fontWeight: 600, fontSize: '12px' }">
          <el-table-column prop="title" label="文档名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="uploadTime" label="上传时间" width="150" />
          <el-table-column prop="uploader" label="上传人" width="90" />
          <el-table-column label="解析状态" width="100">
            <template #default="{ row }"><el-tag :type="statusTagType(row.status)" size="small" effect="plain">{{ statusLabel(row.status) }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="dept" label="所属部门" width="120" />
          <el-table-column prop="sourceName" label="来源渠道" width="140" />
        </el-table>

        <!-- 空状态 -->
        <div v-if="statDetailDocs.length === 0" class="sdp-empty">
          <AppIcon name="Document" style="font-size: 36px; color: #d1d5db; margin-bottom: 8px;" />
          <p>暂无{{ statDetailTitle }}数据</p>
        </div>
      </div>

      <!-- ===== 过滤条 ===== -->
      <div class="filter-bar app-card">
        <el-input v-model="searchKeyword" placeholder="快速筛选..." clearable :prefix-icon="Search" class="fb-search" size="default" />
        <el-select v-model="filterStatus" placeholder="解析状态" clearable style="width:120px">
          <el-option v-for="s in docStatusOptions" :key="s.value" :label="s.label" :value="s.value" />
        </el-select>
        <el-select v-model="filterType" placeholder="文件类型" clearable style="width:110px">
          <el-option v-for="t in docTypeOptions" :key="t.value" :label="t.label" :value="t.value" />
        </el-select>
        <el-select v-model="filterTag" placeholder="标签" clearable filterable style="width:110px">
          <el-option v-for="t in docTagOptions" :key="t" :label="t" :value="t" />
        </el-select>
        <div class="view-toggle">
          <el-button-group>
            <el-button :type="viewMode === 'card' ? 'primary' : ''" :icon="Grid" @click="viewMode = 'card'" />
            <el-button :type="viewMode === 'table' ? 'primary' : ''" :icon="List" @click="viewMode = 'table'" />
            <el-button :type="viewMode === 'pipeline' ? 'primary' : ''" :icon="Opportunity" @click="viewMode = 'pipeline'" />
          </el-button-group>
        </div>
      </div>

      <!-- ===== 三栏主体 ===== -->
      <section class="dc-body">
        <!-- 左：文档来源空间 -->
        <aside class="src-panel app-card">
          <div class="sp-header">
            <h3>文档来源空间</h3>
            <el-button text type="primary" size="small" @click="activeSource = ''">全部</el-button>
          </div>
          <nav class="sp-list no-scrollbar">
            <button v-for="src in sources" :key="src.id" type="button" class="sp-item" :class="{ 'is-active': activeSource === src.id }" @click="activeSource = src.id">
              <div class="spi-icon" :style="{ background: src.color + '18', color: src.color }"><AppIcon :name="src.icon" /></div>
              <div class="spi-info">
                <span class="spi-name">{{ src.name }}</span>
                <span class="spi-meta">{{ src.count }}份 · 已解析{{ src.parsed }}<template v-if="src.failed"> · 失败{{ src.failed }}</template></span>
              </div>
              <div class="spi-dept">{{ src.dept }}</div>
            </button>
          </nav>
          <div class="sp-footer">
            <el-button text type="primary" size="small" :icon="Plus" @click="handleAddSource">新增来源空间</el-button>
          </div>
        </aside>

        <!-- 中：文档资产区 -->
        <div class="asset-area">
          <!-- 卡片视图 -->
          <div v-if="viewMode === 'card'" class="doc-grid">
            <div v-for="doc in filteredDocs" :key="doc.id" class="doc-card app-card" :class="{ 'is-selected': selectedDoc?.id === doc.id }" @click="selectDoc(doc)">
              <div class="dc-top">
                <el-tag :type="statusTagType(doc.status)" size="small" effect="plain">{{ statusLabel(doc.status) }}</el-tag>
                <div class="dc-badges">
                  <el-tag v-if="doc.indexed" size="small" type="success" effect="plain">已索引</el-tag>
                  <el-tag v-if="doc.aiRef === 'allowed'" size="small" color="#e0f2fe" style="color:#0369a1;border-color:#bae6fd" effect="plain">AI 可引用</el-tag>
                </div>
              </div>
              <h4 class="dc-title">{{ doc.title }}</h4>
              <div class="dc-type-row">
                <span class="dc-type" :style="{ background: fileTypeColor(doc.type) }">{{ doc.type }}</span>
                <span class="dc-size">{{ doc.fileSize }}</span>
                <span class="dc-source">{{ doc.sourceName }}</span>
              </div>
              <div class="dc-tags"><el-tag v-for="t in doc.tags.slice(0, 4)" :key="t" size="small" type="info" effect="plain" round>{{ t }}</el-tag></div>
              <div class="dc-data">
                <span>片段 {{ doc.segments }}</span>
                <span>上传 {{ doc.uploader }}</span>
              </div>
              <div v-if="doc.qualityScore > 0" class="dc-quality">
                <div class="dq-bar"><div class="dq-fill" :style="{ width: doc.qualityScore + '%', background: qualityColor(doc.qualityScore) }" /></div>
                <span :style="{ color: qualityColor(doc.qualityScore) }">{{ doc.qualityScore }}%</span>
              </div>
              <div v-if="doc.risk" class="dc-risk"><AppIcon name="WarningFilled" /> {{ doc.risk }}</div>
              <div class="dc-footer">
                <span class="dc-time">{{ doc.uploadTime }}</span>
                <div class="dc-ops">
                  <el-button text size="small" type="primary" @click.stop="openParseResult(doc)">解析结果</el-button>
                  <el-button text size="small" @click.stop="handleReparse(doc)">重新解析</el-button>
                </div>
              </div>
            </div>
            <div v-if="filteredDocs.length === 0" class="empty-tip">暂无匹配的文档</div>
          </div>

          <!-- 表格视图 -->
          <div v-if="viewMode === 'table'" class="doc-table-wrap">
            <div class="dtb-actions">
              <el-dropdown trigger="click" @command="handleBatchAction">
                <el-button size="small">批量操作 <AppIcon name="ArrowDown" /></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="parse">批量解析</el-dropdown-item>
                    <el-dropdown-item command="index">批量建立索引</el-dropdown-item>
                    <el-dropdown-item command="ai_on">批量开启 AI 引用</el-dropdown-item>
                    <el-dropdown-item command="ai_off">批量关闭 AI 引用</el-dropdown-item>
                    <el-dropdown-item command="archive">批量归档</el-dropdown-item>
                    <el-dropdown-item command="move">批量移动来源空间</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <el-table :data="filteredDocs" stripe style="width:100%" highlight-current-row @current-change="selectDoc" size="default">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="title" label="文档名称" min-width="200" show-overflow-tooltip />
              <el-table-column prop="type" label="类型" width="80">
                <template #default="{ row }"><span class="tbl-type" :style="{ background: fileTypeColor(row.type), color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }">{{ row.type }}</span></template>
              </el-table-column>
              <el-table-column prop="sourceName" label="来源空间" width="120" show-overflow-tooltip />
              <el-table-column prop="uploader" label="上传人" width="80" />
              <el-table-column prop="uploadTime" label="上传时间" width="130" />
              <el-table-column prop="fileSize" label="大小" width="80" />
              <el-table-column label="状态" width="90">
                <template #default="{ row }"><el-tag :type="statusTagType(row.status)" size="small" effect="plain">{{ statusLabel(row.status) }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="segments" label="片段" width="60" />
              <el-table-column label="索引" width="60">
                <template #default="{ row }"><AppIcon :name="row.indexed ? 'CircleCheckFilled' : 'Remove'" :style="{ color: row.indexed ? '#22c55e' : '#d1d5db' }" /></template>
              </el-table-column>
              <el-table-column label="AI引用" width="80">
                <template #default="{ row }"><el-tag :type="aiRefTagType(row.aiRef)" size="small" effect="plain">{{ aiRefLabel(row.aiRef) }}</el-tag></template>
              </el-table-column>
              <el-table-column label="质量" width="60">
                <template #default="{ row }"><span v-if="row.qualityScore" :style="{ color: qualityColor(row.qualityScore), fontWeight: 600 }">{{ row.qualityScore }}</span><span v-else class="muted-text">—</span></template>
              </el-table-column>
              <el-table-column label="操作" width="220" fixed="right">
                <template #default="{ row }">
                  <el-button text size="small" type="primary" @click.stop="openPreview(row)">预览</el-button>
                  <el-button text size="small" type="primary" @click.stop="openParseResult(row)">片段</el-button>
                  <el-button text size="small" @click.stop="handleReparse(row)">解析</el-button>
                  <el-button text size="small" @click.stop="handleBuildIndex(row)">索引</el-button>
                  <el-button text size="small" type="warning" @click.stop="handleArchive(row)">归档</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 解析流水线视图 -->
          <div v-if="viewMode === 'pipeline'" class="pipeline-view">
            <div v-for="pipe in pipelineData" :key="pipe.docId" class="pipe-item app-card">
              <div class="pi-header">
                <h4>{{ pipe.docTitle }}</h4>
                <el-tag :type="pipeStatusType(pipe)" size="small">{{ pipeStatusLabel(pipe) }}</el-tag>
              </div>
              <div class="pi-steps">
                <div v-for="step in pipe.steps" :key="step.key" class="pi-step" :class="'st-' + step.status">
                  <div class="pis-dot">
                    <AppIcon v-if="step.status === 'success'" name="CircleCheckFilled" />
                    <AppIcon v-else-if="step.status === 'failed'" name="CircleCloseFilled" />
                    <AppIcon v-else-if="step.status === 'processing'" name="Loading" />
                    <AppIcon v-else-if="step.status === 'skipped'" name="RemoveFilled" />
                    <span v-else class="pis-empty" />
                  </div>
                  <div class="pis-info">
                    <span class="pis-label">{{ step.label }}</span>
                    <span class="pis-detail">{{ step.detail || '等待中...' }}</span>
                  </div>
                  <span v-if="step.time" class="pis-time">{{ step.time }}</span>
                </div>
              </div>
              <div class="pi-line">
                <div v-for="(step, i) in pipe.steps" :key="step.key" class="pl-seg" :class="'st-' + step.status" :style="{ width: (100 / pipe.steps.length) + '%' }">
                  <div v-if="i < pipe.steps.length - 1" class="pl-connector" />
                </div>
              </div>
              <div v-if="pipe.steps.some(s => s.status === 'failed')" class="pi-fail-tip">
                <AppIcon name="WarningFilled" /> 解析失败：{{ pipe.steps.find(s => s.status === 'failed')?.detail }}
                <el-button size="small" type="primary" plain @click="handleReparsePipe(pipe.docId)">重新解析</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右：文档智能分析面板 -->
        <aside class="intel-panel app-card" v-if="selectedDoc">
          <div class="ip-header">
            <h3>{{ selectedDoc.title }}</h3>
            <el-button text :icon="Close" @click="selectedDoc = null" />
          </div>

          <!-- 生命周期 -->
          <div class="ip-section">
            <h4>文档生命周期</h4>
            <div class="lifecycle-flow">
              <div v-for="(step, i) in lifecycleSteps" :key="step.key" class="lf-step" :class="{ 'is-active': step.active, 'is-done': step.done }">
                <div class="lf-dot">{{ i + 1 }}</div>
                <span>{{ step.label }}</span>
              </div>
            </div>
          </div>

          <!-- 基础信息 -->
          <div class="ip-section">
            <h4>基础信息</h4>
            <el-descriptions :column="1" size="small" border>
              <el-descriptions-item label="类型"><span class="dc-type-sm" :style="{ background: fileTypeColor(selectedDoc.type) }">{{ selectedDoc.type }}</span></el-descriptions-item>
              <el-descriptions-item label="来源空间">{{ selectedDoc.sourceName }}</el-descriptions-item>
              <el-descriptions-item label="来源部门">{{ selectedDoc.dept }}</el-descriptions-item>
              <el-descriptions-item label="上传人">{{ selectedDoc.uploader }}</el-descriptions-item>
              <el-descriptions-item label="上传时间">{{ selectedDoc.uploadTime }}</el-descriptions-item>
              <el-descriptions-item label="文件大小">{{ selectedDoc.fileSize }}</el-descriptions-item>
              <el-descriptions-item label="解析状态"><el-tag :type="statusTagType(selectedDoc.status)" size="small">{{ statusLabel(selectedDoc.status) }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="知识片段">{{ selectedDoc.segments }} 条</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- AI 引用状态 -->
          <div class="ip-section">
            <h4>AI 引用控制</h4>
            <div class="ai-ref-control">
              <div class="arc-row">
                <span>引用状态</span>
                <el-tag :type="aiRefTagType(selectedDoc.aiRef)" size="small">{{ aiRefLabel(selectedDoc.aiRef) }}</el-tag>
              </div>
              <div class="arc-row">
                <span>向量索引</span>
                <el-tag :type="selectedDoc.indexed ? 'success' : 'info'" size="small">{{ selectedDoc.indexed ? '已建立' : '未建立' }}</el-tag>
              </div>
              <div class="arc-switches">
                <div class="asw-item">
                  <span>进入 AI 知识源</span>
                  <el-switch v-model="aiSwitches.knowledgeSource" size="small" @change="handleAiSwitch('knowledgeSource')" />
                </div>
                <div class="asw-item">
                  <span>进入知识库搜索</span>
                  <el-switch v-model="aiSwitches.kbSearch" size="small" @change="handleAiSwitch('kbSearch')" />
                </div>
                <div class="asw-item">
                  <span>允许生成摘要</span>
                  <el-switch v-model="aiSwitches.allowSummary" size="small" @change="handleAiSwitch('allowSummary')" />
                </div>
                <div class="asw-item">
                  <span>允许查看原文</span>
                  <el-switch v-model="aiSwitches.allowOriginal" size="small" @change="handleAiSwitch('allowOriginal')" />
                </div>
                <div class="asw-item">
                  <span>优先引用来源</span>
                  <el-switch v-model="aiSwitches.priority" size="small" @change="handleAiSwitch('priority')" />
                </div>
              </div>
            </div>
          </div>

          <!-- 文档摘要 -->
          <div class="ip-section" v-if="currentSummary">
            <h4>文档摘要</h4>
            <p class="ip-summary-text">{{ currentSummary }}</p>
          </div>

          <!-- 自动标签 -->
          <div class="ip-section">
            <h4>自动标签</h4>
            <div class="ip-tags"><el-tag v-for="t in selectedDoc.tags" :key="t" size="small" effect="plain" round>{{ t }}</el-tag></div>
          </div>

          <!-- 解析质量评分 -->
          <div class="ip-section" v-if="currentQuality">
            <h4>解析质量 <span class="iq-score" :style="{ color: qualityColor(currentQuality.overall) }">{{ currentQuality.overall }}%</span></h4>
            <div class="iq-bar"><div class="iq-fill" :style="{ width: currentQuality.overall + '%', background: qualityColor(currentQuality.overall) }" /></div>
            <div class="iq-dims">
              <div v-for="d in currentQuality.dimensions.slice(0, 4)" :key="d.name" class="iqd-item">
                <span class="iqd-name">{{ d.name }}</span>
                <div class="iqd-bar"><div class="iqd-fill" :style="{ width: d.score + '%', background: qualityColor(d.score) }" /></div>
                <span class="iqd-val">{{ d.score }}</span>
              </div>
            </div>
            <el-button text size="small" type="primary" @click="qualityDialogVisible = true">查看完整评分报告</el-button>
            <div v-if="currentQuality.overall < 60" class="iq-warn">该文档解析质量较低，不建议直接开放给 AI 问答引用。</div>
          </div>

          <!-- 风险提示 -->
          <div class="ip-section" v-if="docRisks.length">
            <h4>风险提示</h4>
            <div class="ip-risks">
              <div v-for="r in docRisks" :key="r.id" class="ir-item" :class="'lv-' + r.level">
                <AppIcon name="WarningFilled" />
                <span>{{ r.message }}</span>
              </div>
            </div>
          </div>

          <!-- 引用记录 -->
          <div class="ip-section" v-if="docCitations.length">
            <h4>引用记录</h4>
            <div class="ip-citations">
              <div v-for="ct in docCitations.slice(0, 4)" :key="ct.id" class="ict-item">
                <div class="ict-head">
                  <el-tag size="small" effect="plain">{{ ct.module }}</el-tag>
                  <span>{{ ct.user }}</span>
                </div>
                <p class="ict-q">Q: {{ ct.question }}</p>
                <span class="ict-seg">引用片段: {{ ct.segment }}</span>
              </div>
            </div>
          </div>

          <!-- AI 辅助按钮 -->
          <div class="ip-section">
            <h4>AI 辅助</h4>
            <div class="ip-ai-btns">
              <el-button size="small" @click="handleAiAction('summary')">AI 生成摘要</el-button>
              <el-button size="small" @click="handleAiAction('tags')">AI 生成标签</el-button>
              <el-button size="small" @click="handleAiAction('segment')">AI 智能分段</el-button>
              <el-button size="small" @click="handleAiAction('risk')">AI 检查风险</el-button>
              <el-button size="small" @click="handleAiAction('version')">AI 识别新版本</el-button>
              <el-button size="small" @click="handleAiAction('title')">AI 优化片段标题</el-button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="ip-actions">
            <el-button type="primary" size="small" @click="openParseResult(selectedDoc)">查看解析结果</el-button>
            <el-button size="small" @click="handleReparse(selectedDoc)">重新解析</el-button>
            <el-button v-if="!selectedDoc.indexed && selectedDoc.status === 'parsed'" size="small" type="success" @click="handleBuildIndex(selectedDoc)">建立索引</el-button>
            <el-button size="small" type="warning" @click="handleArchive(selectedDoc)">归档</el-button>
          </div>
        </aside>

        <aside class="intel-panel app-card ip-empty" v-else>
          <AppIcon name="Document" class="ipe-icon" />
          <p>选择一篇文档<br>查看智能分析详情</p>
        </aside>
      </section>

      <!-- ===== 上传文档抽屉 ===== -->
      <el-drawer v-model="uploadDrawerVisible" title="上传文档" size="560px" destroy-on-close>
        <div class="upload-drag-area">
          <div class="uda-zone">
            <AppIcon name="UploadFilled" class="uda-icon" />
            <p>拖拽企业文档到这里</p>
            <span>系统将自动解析并沉淀为 AI 可引用知识来源</span>
            <span class="uda-types">支持 PDF / Word / Excel / PPT / Markdown / TXT / CSV</span>
            <el-button type="primary" size="small" style="margin-top:8px">选择文件</el-button>
          </div>
        </div>
        <el-form :model="uploadForm" label-width="110px" class="upload-form">
          <div class="uf-group-title">基础信息</div>
          <el-form-item label="文档名称"><el-input v-model="uploadForm.title" placeholder="请输入文档名称" /></el-form-item>
          <el-form-item label="所属来源空间">
            <el-select v-model="uploadForm.sourceId" placeholder="选择来源空间" style="width:100%">
              <el-option v-for="s in sources" :key="s.id" :label="s.name" :value="s.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="来源部门"><el-input v-model="uploadForm.dept" placeholder="输入来源部门" /></el-form-item>
          <el-form-item label="上传人"><el-input v-model="uploadForm.uploader" placeholder="输入上传人" /></el-form-item>
          <el-form-item label="文档标签">
            <el-select v-model="uploadForm.tags" multiple filterable allow-create placeholder="选择或输入标签" style="width:100%">
              <el-option v-for="t in docTagOptions" :key="t" :label="t" :value="t" />
            </el-select>
          </el-form-item>
          <el-form-item label="文档说明"><el-input v-model="uploadForm.note" type="textarea" :rows="2" placeholder="简要描述文档内容" /></el-form-item>

          <div class="uf-group-title">解析配置</div>
          <el-form-item label="自动解析"><el-switch v-model="uploadForm.autoParse" /></el-form-item>
          <el-form-item label="自动生成摘要"><el-switch v-model="uploadForm.autoSummary" /></el-form-item>
          <el-form-item label="自动生成标签"><el-switch v-model="uploadForm.autoTags" /></el-form-item>
          <el-form-item label="自动分段"><el-switch v-model="uploadForm.autoSegment" /></el-form-item>
          <el-form-item label="建立向量索引"><el-switch v-model="uploadForm.autoIndex" /></el-form-item>
          <el-form-item label="允许 AI 引用"><el-switch v-model="uploadForm.allowAi" /></el-form-item>
          <el-form-item label="审核后引用"><el-switch v-model="uploadForm.needAudit" /></el-form-item>

          <div class="uf-group-title">权限配置</div>
          <el-form-item label="可见范围">
            <el-select v-model="uploadForm.visibleScope" style="width:100%">
              <el-option label="全体员工" value="all" />
              <el-option label="仅上传部门" value="dept" />
              <el-option label="仅管理员" value="admin" />
            </el-select>
          </el-form-item>
          <el-form-item label="敏感文档"><el-switch v-model="uploadForm.sensitive" /></el-form-item>
          <el-form-item label="允许查看原文"><el-switch v-model="uploadForm.allowOriginal" /></el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="uploadDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUploadSubmit">确认上传</el-button>
        </template>
      </el-drawer>

      <!-- ===== 解析结果抽屉 ===== -->
      <el-drawer v-model="parseResultVisible" :title="'解析结果 - ' + (parseResultDoc?.title || '')" size="640px" destroy-on-close>
        <div v-if="parseResultDoc" class="pr-content">
          <div class="pr-info">
            <el-descriptions :column="2" size="small" border>
              <el-descriptions-item label="文件名">{{ parseResultDoc.title }}</el-descriptions-item>
              <el-descriptions-item label="类型">{{ parseResultDoc.type }}</el-descriptions-item>
              <el-descriptions-item label="大小">{{ parseResultDoc.fileSize }}</el-descriptions-item>
              <el-descriptions-item label="解析状态"><el-tag :type="statusTagType(parseResultDoc.status)" size="small">{{ statusLabel(parseResultDoc.status) }}</el-tag></el-descriptions-item>
              <el-descriptions-item label="知识片段">{{ parseResultDoc.segments }} 条</el-descriptions-item>
              <el-descriptions-item label="向量索引"><el-tag :type="parseResultDoc.indexed ? 'success' : 'info'" size="small">{{ parseResultDoc.indexed ? '已建立' : '未建立' }}</el-tag></el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 提取文本 -->
          <div class="pr-section" v-if="currentSummary">
            <h4>自动摘要</h4>
            <p>{{ currentSummary }}</p>
          </div>

          <div class="pr-section" v-if="parseResultDoc.tags.length">
            <h4>自动标签</h4>
            <div class="pr-tags"><el-tag v-for="t in parseResultDoc.tags" :key="t" effect="plain" round>{{ t }}</el-tag></div>
          </div>

          <!-- 知识片段 -->
          <div class="pr-section">
            <h4>知识片段（{{ docSegments.length }}）</h4>
            <div class="pr-segments">
              <div v-for="(seg, i) in docSegments" :key="seg.id" class="prs-item">
                <div class="prs-head">
                  <span class="prs-idx">片段 {{ i + 1 }}</span>
                  <h5>{{ seg.title }}</h5>
                  <div class="prs-ops">
                    <el-button text size="small" type="primary">查看原文</el-button>
                    <el-button text size="small">编辑</el-button>
                    <el-button text size="small" type="warning">禁止引用</el-button>
                  </div>
                </div>
                <p class="prs-content">{{ seg.content }}</p>
                <div class="prs-meta">
                  <span>{{ seg.pageNum }}</span>
                  <span>{{ seg.charCount }} 字</span>
                  <el-tag v-for="t in seg.tags" :key="t" size="small" type="info" effect="plain" round>{{ t }}</el-tag>
                  <el-tag :type="seg.citeable ? 'success' : 'info'" size="small">{{ seg.citeable ? '可引用' : '不可引用' }}</el-tag>
                </div>
              </div>
              <div v-if="docSegments.length === 0" class="pr-empty">暂无知识片段</div>
            </div>
          </div>

          <!-- 解析日志 -->
          <div class="pr-section">
            <h4>解析日志</h4>
            <el-timeline>
              <el-timeline-item v-for="log in parseLogs" :key="log.id" :timestamp="log.time" :type="log.status === 'success' ? 'success' : log.status === 'failed' ? 'danger' : 'primary'" placement="top">
                <div class="prl-item"><strong>{{ log.step }}</strong> <span>{{ log.detail }}</span> <em>{{ log.duration }}</em></div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-drawer>

      <!-- ===== 文档预览抽屉 ===== -->
      <el-drawer v-model="previewVisible" :title="'预览 - ' + (previewDoc?.title || '')" size="600px" destroy-on-close>
        <div v-if="previewDoc" class="pv-content">
          <div class="pv-info">
            <el-descriptions :column="2" size="small" border>
              <el-descriptions-item label="文件名">{{ previewDoc.title }}</el-descriptions-item>
              <el-descriptions-item label="类型">{{ previewDoc.type }}</el-descriptions-item>
              <el-descriptions-item label="大小">{{ previewDoc.fileSize }}</el-descriptions-item>
              <el-descriptions-item label="页数">{{ previewDoc.segments * 2 }} 页（估算）</el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="pv-preview-area">
            <div class="pva-mock">
              <div class="pva-page">
                <div class="pva-header">第 1 页</div>
                <div class="pva-lines">
                  <div v-for="n in 12" :key="n" class="pva-line" :style="{ width: (60 + Math.random() * 35) + '%' }" />
                </div>
              </div>
            </div>
          </div>
          <div class="pv-segments">
            <h4>片段定位</h4>
            <div v-for="(seg, i) in docSegments.slice(0, 5)" :key="seg.id" class="pvs-item">
              <span class="pvs-idx">{{ i + 1 }}</span>
              <span class="pvs-title">{{ seg.title }}</span>
              <span class="pvs-page">{{ seg.pageNum }}</span>
            </div>
          </div>
          <div class="pv-actions">
            <el-button type="primary" size="small">下载原文</el-button>
          </div>
        </div>
      </el-drawer>

      <!-- ===== 解析日志弹窗 ===== -->
      <el-dialog v-model="logDialogVisible" title="解析日志" width="720px" destroy-on-close>
        <el-table :data="parseLogs" stripe>
          <el-table-column prop="time" label="时间" width="90" />
          <el-table-column prop="step" label="节点" width="100" />
          <el-table-column label="状态" width="80">
            <template #default="{ row }"><el-tag :type="row.status === 'success' ? 'success' : row.status === 'failed' ? 'danger' : 'primary'" size="small">{{ row.status === 'success' ? '成功' : row.status === 'failed' ? '失败' : '进行中' }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="duration" label="耗时" width="70" />
          <el-table-column prop="detail" label="说明" min-width="200" show-overflow-tooltip />
        </el-table>
      </el-dialog>

      <!-- ===== 质量评分弹窗 ===== -->
      <el-dialog v-model="qualityDialogVisible" title="解析质量评分报告" width="580px" destroy-on-close>
        <div v-if="currentQuality" class="qr-content">
          <div class="qr-overall">
            <svg viewBox="0 0 100 100" class="qr-ring">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5eaf3" stroke-width="8" />
              <circle cx="50" cy="50" r="42" fill="none" :stroke="qualityColor(currentQuality.overall)" stroke-width="8" stroke-linecap="round" :stroke-dasharray="264" :stroke-dashoffset="264 - (264 * currentQuality.overall / 100)" transform="rotate(-90 50 50)" />
              <text x="50" y="48" text-anchor="middle" class="qr-val" :fill="qualityColor(currentQuality.overall)">{{ currentQuality.overall }}</text>
              <text x="50" y="60" text-anchor="middle" font-size="8" fill="#667085">质量分</text>
            </svg>
          </div>
          <div class="qr-dims">
            <div v-for="d in currentQuality.dimensions" :key="d.name" class="qrd-item">
              <div class="qrd-head">
                <span class="qrd-name">{{ d.name }}</span>
                <span class="qrd-score" :style="{ color: qualityColor(d.score) }">{{ d.score }}</span>
              </div>
              <div class="qrd-bar"><div class="qrd-fill" :style="{ width: d.score + '%', background: qualityColor(d.score) }" /></div>
              <span class="qrd-comment">{{ d.comment }}</span>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- ===== 风险提示弹窗 ===== -->
      <el-dialog v-model="riskDialogVisible" title="文档风险提示" width="600px" destroy-on-close>
        <el-table :data="riskAlerts" stripe>
          <el-table-column label="风险等级" width="80">
            <template #default="{ row }"><el-tag :type="row.level === 'high' ? 'danger' : row.level === 'medium' ? 'warning' : 'info'" size="small">{{ row.level === 'high' ? '高' : row.level === 'medium' ? '中' : '低' }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="message" label="风险说明" min-width="250" show-overflow-tooltip />
          <el-table-column label="类型" width="100">
            <template #default="{ row }">{{ riskTypeLabel(row.type) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default><el-button text size="small" type="primary">处理</el-button></template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- ===== AI 辅助弹窗 ===== -->
      <el-dialog v-model="aiAssistVisible" :title="'AI 辅助 - ' + aiAssistType" width="480px" destroy-on-close>
        <div class="ai-assist-content">
          <template v-if="aiAssistType === 'summary'">
            <h4>AI 生成摘要结果</h4>
            <p>{{ currentSummary || '该文档主要涵盖相关领域的制度规定、操作流程和执行标准。' }}</p>
          </template>
          <template v-else-if="aiAssistType === 'tags'">
            <h4>AI 生成标签结果</h4>
            <div class="aat-tags"><el-tag v-for="t in (selectedDoc?.tags || [])" :key="t" size="default" effect="plain" round>{{ t }}</el-tag></div>
          </template>
          <template v-else-if="aiAssistType === 'segment'">
            <h4>AI 智能分段结果</h4>
            <p>共识别 {{ docSegments.length || 24 }} 个知识片段，平均长度 {{ docSegments.length ? Math.round(docSegments.reduce((s, seg) => s + seg.charCount, 0) / docSegments.length) : 72 }} 字。分段结构合理，主题划分清晰。</p>
          </template>
          <template v-else-if="aiAssistType === 'risk'">
            <h4>AI 风险检查结果</h4>
            <p v-if="docRisks.length">发现 {{ docRisks.length }} 条风险项，请查看详情面板。</p>
            <p v-else>未发现明显风险，文档内容合规。</p>
          </template>
          <template v-else-if="aiAssistType === 'version'">
            <h4>AI 版本识别结果</h4>
            <p>未检测到相似的历史版本。当前文档为独立版本。</p>
          </template>
          <template v-else>
            <h4>AI 优化片段标题结果</h4>
            <p>已优化 3 个片段的标题，使其更加语义化和可检索。</p>
          </template>
        </div>
      </el-dialog>

      <!-- ===== 版本识别弹窗 ===== -->
      <el-dialog v-model="versionDetectVisible" title="文档版本识别" width="480px" destroy-on-close>
        <div class="vd-content">
          <div class="vd-alert">
            <AppIcon name="InfoFilled" /> 检测到相似文档
          </div>
          <div class="vd-compare">
            <div class="vdc-item">
              <span class="vdc-label">已有文档</span>
              <p>员工请假管理制度 V1.2.pdf</p>
              <span>已解析 · 32 个片段 · 质量 88%</span>
            </div>
            <div class="vdc-arrow"><AppIcon name="Right" /></div>
            <div class="vdc-item vdc-new">
              <span class="vdc-label">当前上传</span>
              <p>员工请假管理制度 V1.3.pdf</p>
              <span>待解析</span>
            </div>
          </div>
          <p class="vd-suggest">建议：作为新版本上传，并归档旧版本。</p>
          <div class="vd-actions">
            <el-button @click="versionDetectVisible = false">取消上传</el-button>
            <el-button type="primary" @click="versionDetectVisible = false; ElMessage.success('已作为新版本上传')">作为新版本</el-button>
            <el-button type="warning" @click="versionDetectVisible = false; ElMessage.success('已替换旧文档')">替换旧文档</el-button>
            <el-button @click="versionDetectVisible = false; ElMessage.success('已作为新文档上传')">作为新文档</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Upload, UploadFilled, RefreshRight, Connection, Notebook, Grid, List, Opportunity, Close, Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import AppIcon from '@/components/AppIcon/index.vue'
import {
  getDocSourcesMock, getDocAssetsMock, getPipelineMock, getSegmentsMock,
  getParseLogsMock, getCitationsMock, getRiskAlertsMock, getDocTopStatsMock,
  getQualityReportsMock, docSummaries,
  docTagOptions, uploaderOptions, docTypeOptions, docStatusOptions,
  type DocumentAsset, type PipelineRecord, type AiRefStatus
} from './mock'

// ===== 基础数据 =====
const sources = ref(getDocSourcesMock())
const documents = ref(getDocAssetsMock())
const pipelineData = ref(getPipelineMock())
const segments = ref(getSegmentsMock())
const parseLogs = ref(getParseLogsMock())
const citations = ref(getCitationsMock())
const riskAlerts = ref(getRiskAlertsMock())
const topStats = ref(getDocTopStatsMock())
const qualityReports = ref(getQualityReportsMock())

// ===== 状态 =====
const searchKeyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const filterTag = ref('')
const viewMode = ref<'card' | 'table' | 'pipeline'>('card')
const activeSource = ref('')
const selectedDoc = ref<DocumentAsset | null>(null)
const activeStatCard = ref('today')
const pendingStatusFilter = ref('')

// ===== 弹窗/抽屉 =====
const uploadDrawerVisible = ref(false)
const parseResultVisible = ref(false)
const parseResultDoc = ref<DocumentAsset | null>(null)
const previewVisible = ref(false)
const previewDoc = ref<DocumentAsset | null>(null)
const logDialogVisible = ref(false)
const qualityDialogVisible = ref(false)
const riskDialogVisible = ref(false)
const aiAssistVisible = ref(false)
const aiAssistType = ref('')
const versionDetectVisible = ref(false)

// ===== 上传表单 =====
const uploadForm = ref({
  title: '', sourceId: '', dept: '', uploader: '', tags: [] as string[], note: '',
  autoParse: true, autoSummary: true, autoTags: true, autoSegment: true, autoIndex: true, allowAi: true, needAudit: false,
  visibleScope: 'all', sensitive: false, allowOriginal: true
})

// ===== AI 引用开关 =====
const aiSwitches = reactive({
  knowledgeSource: true, kbSearch: true, allowSummary: true, allowOriginal: true, priority: false
})

// ===== 统计卡片 =====
const statCards = computed(() => [
  { key: 'total', label: '文档总数', value: topStats.value.total, icon: 'Document', color: '#6366f1', bg: '#eef2ff', spark: '0,20 10,16 20,12 30,8 40,14 50,6 60,4' },
  { key: 'parsed', label: '已解析', value: topStats.value.parsed, icon: 'CircleCheck', color: '#22c55e', bg: '#f0fdf4', spark: '0,18 10,14 20,12 30,10 40,8 50,6 60,4' },
  { key: 'parsing', label: '解析中', value: topStats.value.parsing, icon: 'Loading', color: '#3b82f6', bg: '#eff6ff', spark: '0,12 10,14 20,10 30,16 40,8 50,12 60,6' },
  { key: 'failed', label: '解析失败', value: topStats.value.failed, icon: 'CircleClose', color: '#ef4444', bg: '#fef2f2', spark: '0,8 10,10 20,14 30,12 40,16 50,10 60,8' },
  { key: 'pending', label: '待处理', value: topStats.value.pendingCount, icon: 'Clock', color: '#f59e0b', bg: '#fffbeb', spark: '0,14 10,10 20,16 30,8 40,12 50,6 60,10' },
  { key: 'segments', label: '知识片段', value: topStats.value.segments, icon: 'Files', color: '#8b5cf6', bg: '#f5f3ff', spark: '0,20 10,16 20,12 30,8 40,14 50,6 60,4' },
  { key: 'vectors', label: '向量索引', value: topStats.value.vectors, icon: 'Connection', color: '#14b8a6', bg: '#f0fdfa', spark: '0,18 10,14 20,10 30,8 40,6 50,4 60,2' },
  { key: 'today', label: '今日上传', value: topStats.value.todayUpload, icon: 'Upload', color: '#ec4899', bg: '#fdf2f8', spark: '0,6 10,8 20,10 30,8 40,12 50,10 60,14' }
])

const statDetailTitle = computed(() => {
  const map: Record<string, string> = {
    total: '全部文档', parsed: '已解析文档', parsing: '解析中文档',
    failed: '解析失败文档', pending: '待处理文档', segments: '知识片段',
    vectors: '向量索引文档', today: '今日上传文档'
  }
  return map[activeStatCard.value] || '文档列表'
})

const pendingFilters = [
  { value: '', label: '全部' },
  { value: 'pending', label: '待解析' },
  { value: 'parsing', label: '排队中' },
]

const todayDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
})

const todayDocs = computed(() => documents.value.filter(d => d.uploadTime.startsWith(todayDate.value)))

const parsedDocs = computed(() => documents.value.filter(d => ['parsed', 'indexed'].includes(d.status)))

const failedDocs = computed(() => documents.value.filter(d => d.status === 'failed'))

const pendingDocs = computed(() => {
  let list = documents.value.filter(d => ['pending', 'parsing'].includes(d.status))
  if (pendingStatusFilter.value) list = list.filter(d => d.status === pendingStatusFilter.value)
  return list
})

const statDetailDocs = computed(() => {
  switch (activeStatCard.value) {
    case 'today': return todayDocs.value
    case 'parsed': return parsedDocs.value
    case 'failed': return failedDocs.value
    case 'pending': return pendingDocs.value
    default: return []
  }
})

// ===== 过滤 =====
const filteredDocs = computed(() => {
  return documents.value.filter(d => {
    if (activeSource.value && d.sourceId !== activeSource.value) return false
    if (filterStatus.value && d.status !== filterStatus.value) return false
    if (filterType.value && d.type !== filterType.value) return false
    if (filterTag.value && !d.tags.includes(filterTag.value)) return false
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      if (!(d.title.toLowerCase().includes(kw) || d.tags.some(t => t.toLowerCase().includes(kw)) || d.uploader.toLowerCase().includes(kw) || d.sourceName.toLowerCase().includes(kw) || d.dept.toLowerCase().includes(kw))) return false
    }
    return true
  })
})

// ===== 右侧面板计算 =====
const currentSummary = computed(() => selectedDoc.value ? docSummaries[selectedDoc.value.id] || '' : '')
const currentQuality = computed(() => selectedDoc.value ? qualityReports.value.find(q => q.docId === selectedDoc.value!.id) || null : null)
const docRisks = computed(() => selectedDoc.value ? riskAlerts.value.filter(r => r.docId === selectedDoc.value!.id) : [])
const docCitations = computed(() => {
  if (!selectedDoc.value) return []
  const title = selectedDoc.value.title.replace(/\.\w+$/, '')
  return citations.value.filter(c => c.segment && segments.value.filter(s => s.docId === selectedDoc.value!.id).some(seg => seg.title === c.segment))
})
const docSegments = computed(() => selectedDoc.value ? segments.value.filter(s => s.docId === selectedDoc.value!.id) : [])

const lifecycleSteps = computed(() => {
  const s = selectedDoc.value?.status || 'pending'
  const order = ['pending', 'parsing', 'parsed', 'indexed', 'indexed', 'archived']
  const labels = ['上传', '待解析', '已解析', '已索引', '可引用', '已归档']
  const map: Record<string, number> = { pending: 0, parsing: 1, parsed: 2, failed: 2, indexed: 4, disabled: 5, archived: 5 }
  const currentIdx = map[s] ?? 0
  return labels.map((label, i) => ({ key: order[i], label, done: i < currentIdx, active: i === currentIdx }))
})

// ===== 工具函数 =====
function statusTagType(s: string) {
  const m: Record<string, string> = { pending: 'info', parsing: '', parsed: 'success', failed: 'danger', indexed: 'success', disabled: 'warning', archived: 'info' }
  return (m[s] || 'info') as any
}
function statusLabel(s: string) {
  const m: Record<string, string> = { pending: '待解析', parsing: '解析中', parsed: '已解析', failed: '解析失败', indexed: '已索引', disabled: '已停用', archived: '已归档' }
  return m[s] || s
}
function aiRefTagType(r: AiRefStatus) {
  const m: Record<string, string> = { allowed: 'success', forbidden: 'danger', need_audit: 'warning', dept_only: 'info' }
  return (m[r] || 'info') as any
}
function aiRefLabel(r: AiRefStatus) {
  const m: Record<string, string> = { allowed: '允许引用', forbidden: '禁止引用', need_audit: '审核后引用', dept_only: '部门引用' }
  return m[r] || r
}
function fileTypeColor(t: string) {
  const m: Record<string, string> = { PDF: '#ef4444', Word: '#3b82f6', Excel: '#22c55e', PPT: '#f59e0b', Markdown: '#8b5cf6', TXT: '#64748b', CSV: '#14b8a6' }
  return m[t] || '#6b7280'
}
function qualityColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}
function riskTypeLabel(t: string) {
  const m: Record<string, string> = { duplicate: '文档重复', expired: '文档过期', parse_fail: '解析失败', sensitive: '敏感内容', no_owner: '缺少负责人', no_index: '未建索引', no_access: '长期无访问', unreviewed: '未审核' }
  return m[t] || t
}
function pipeStatusType(p: PipelineRecord) {
  const hasFail = p.steps.some(s => s.status === 'failed')
  const processing = p.steps.some(s => s.status === 'processing')
  const allDone = p.steps.every(s => s.status === 'success')
  if (hasFail) return 'danger'
  if (processing) return ''
  if (allDone) return 'success'
  return 'info'
}
function pipeStatusLabel(p: PipelineRecord) {
  const hasFail = p.steps.some(s => s.status === 'failed')
  const processing = p.steps.some(s => s.status === 'processing')
  const allDone = p.steps.every(s => s.status === 'success')
  if (hasFail) return '解析失败'
  if (processing) return '解析中'
  if (allDone) return '已完成'
  return '待处理'
}

// ===== 操作 =====
function handleStatCardClick(key: string) {
  activeStatCard.value = activeStatCard.value === key ? '' : key
}

function getPendingAction(row: DocumentAsset): string {
  if (row.status === 'pending') return '等待自动解析'
  if (row.status === 'parsing') return '正在解析中...'
  return '排队等待处理'
}

function getFailReason(row: DocumentAsset): string {
  if (row.risk) return row.risk
  const reasons = ['文件格式异常，无法提取文本', '内容为空或损坏', '权限不足，无法读取', '解析超时，服务繁忙', 'OCR 识别失败']
  const idx = parseInt(row.id.replace('d', '')) % reasons.length
  return reasons[idx]
}

function handleSearch() { /* search already reactive */ }
function selectDoc(doc: DocumentAsset) {
  selectedDoc.value = doc
  if (doc) {
    aiSwitches.knowledgeSource = doc.aiRef === 'allowed'
    aiSwitches.kbSearch = doc.aiRef === 'allowed'
    aiSwitches.allowSummary = doc.aiRef === 'allowed'
    aiSwitches.allowOriginal = doc.aiRef !== 'forbidden'
    aiSwitches.priority = doc.qualityScore >= 85
  }
}
function openParseResult(doc: DocumentAsset) { parseResultDoc.value = doc; parseResultVisible.value = true }
function openPreview(doc: DocumentAsset) { previewDoc.value = doc; previewVisible.value = true }

function handleReparse(doc: DocumentAsset) {
  const idx = documents.value.findIndex(d => d.id === doc.id)
  if (idx >= 0) { documents.value[idx].status = 'parsing'; if (selectedDoc.value?.id === doc.id) selectedDoc.value = documents.value[idx] }
  ElMessage.success('已提交重新解析')
}
function handleReparsePipe(docId: string) {
  const idx = documents.value.findIndex(d => d.id === docId)
  if (idx >= 0) documents.value[idx].status = 'parsing'
  ElMessage.success('已提交重新解析')
}
function handleBuildIndex(doc: DocumentAsset) {
  const idx = documents.value.findIndex(d => d.id === doc.id)
  if (idx >= 0) { documents.value[idx].indexed = true; documents.value[idx].status = 'indexed'; if (selectedDoc.value?.id === doc.id) selectedDoc.value = documents.value[idx] }
  ElMessage.success('向量索引已建立')
}
function handleArchive(doc: DocumentAsset) {
  const idx = documents.value.findIndex(d => d.id === doc.id)
  if (idx >= 0) { documents.value[idx].status = 'archived'; if (selectedDoc.value?.id === doc.id) selectedDoc.value = documents.value[idx] }
  ElMessage.success('文档已归档')
}
function handleBatchUpload() { versionDetectVisible.value = true }
function handleBatchParse() { ElMessage.success('已提交批量解析任务') }
function handleReindex() { ElMessage.success('已提交重新索引任务') }
function handleAddSource() { ElMessage.info('新增来源空间功能（mock）') }
function handleAiSwitch(key: string) { ElMessage.success(`已更新 ${key} 设置`) }
function handleAiAction(type: string) { aiAssistType.value = type; aiAssistVisible.value = true }
function handleUploadSubmit() {
  if (!uploadForm.value.title) { ElMessage.warning('请输入文档名称'); return }
  const src = sources.value.find(s => s.id === uploadForm.value.sourceId)
  const newDoc: DocumentAsset = {
    id: 'd' + Date.now(), title: uploadForm.value.title, type: 'PDF',
    sourceId: uploadForm.value.sourceId || 's1', sourceName: src?.name || '未分类',
    uploader: uploadForm.value.uploader || '当前用户', uploadTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    fileSize: '1.0 MB', status: uploadForm.value.autoParse ? 'parsing' : 'pending',
    segments: 0, indexed: false, aiRef: uploadForm.value.allowAi ? (uploadForm.value.needAudit ? 'need_audit' : 'allowed') : 'forbidden',
    tags: uploadForm.value.tags, risk: uploadForm.value.sensitive ? '标记为敏感文档' : '', qualityScore: 0,
    dept: uploadForm.value.dept || '未指定'
  }
  documents.value.unshift(newDoc)
  uploadDrawerVisible.value = false
  ElMessage.success('文档已上传' + (uploadForm.value.autoParse ? '，正在解析中...' : ''))
}
function handleBatchAction(cmd: string) {
  const msgs: Record<string, string> = { parse: '批量解析已提交', index: '批量建立索引已提交', ai_on: '批量开启 AI 引用', ai_off: '批量关闭 AI 引用', archive: '批量归档已提交', move: '请选择目标来源空间' }
  ElMessage.success(msgs[cmd] || '操作已执行')
}
</script>

<style scoped lang="scss">
.dc-page { display: flex; flex-direction: column; gap: var(--app-section-gap); height: 100%; }

/* ===== 指挥台 ===== */
.cmd-bar {
  position: relative; border-radius: var(--app-card-radius); overflow: hidden;
  .cmd-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #06b6d4 100%); }
  .cmd-bg::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px); animation: scanline 8s linear infinite; }
  @keyframes scanline { 0% { transform: translateX(0); } 100% { transform: translateX(80px); } }
  .cmd-content { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; color: #fff; }
  .cmd-kicker { display: flex; align-items: center; gap: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.7; margin-bottom: 4px; span { width: 18px; height: 2px; background: currentColor; border-radius: 1px; } }
  h1 { font-size: 20px; font-weight: 700; margin: 0 0 2px; }
  p { font-size: 13px; opacity: 0.8; margin: 0; }
  .cmd-search { display: flex; gap: 8px; margin-top: 10px; .search-input { width: 420px; } }
  .cmd-actions { display: flex; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }
}

/* ===== 统计卡片 ===== */
.stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  .stat-card { display: flex; align-items: center; gap: 10px; padding: 14px; position: relative; overflow: hidden; transition: transform 0.2s; border: 2px solid transparent;
    &:hover { transform: translateY(-2px); }
    .sc-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
    .sc-info { display: flex; flex-direction: column; strong { font-size: 19px; font-weight: 700; color: var(--text-color); } span { font-size: 12px; color: var(--text-secondary); } }
    .sc-spark { position: absolute; right: 8px; bottom: 6px; width: 60px; height: 24px; opacity: 0.3; }
  }
}

/* ===== 过滤条 ===== */
.filter-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; .fb-search { flex: 1; } .view-toggle { flex-shrink: 0; } }

/* ===== 三栏主体 ===== */
.dc-body { display: grid; grid-template-columns: 230px 1fr 310px; gap: var(--app-section-gap); flex: 1; min-height: 0; }

/* ===== 来源空间 ===== */
.src-panel { display: flex; flex-direction: column; overflow: hidden;
  .sp-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 14px 8px; h3 { font-size: 14px; font-weight: 600; margin: 0; } }
  .sp-list { flex: 1; overflow-y: auto; padding: 0 8px 8px; display: flex; flex-direction: column; gap: 2px; }
  .sp-item { display: flex; align-items: center; gap: 8px; padding: 8px; border: none; background: transparent; border-radius: 8px; cursor: pointer; text-align: left; width: 100%; transition: background 0.15s;
    &:hover { background: #f0f4ff; } &.is-active { background: var(--primary-light); }
    .spi-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
    .spi-info { flex: 1; min-width: 0; display: flex; flex-direction: column; .spi-name { font-size: 13px; font-weight: 500; color: var(--text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .spi-meta { font-size: 11px; color: var(--text-secondary); } }
    .spi-dept { font-size: 10px; color: var(--text-secondary); flex-shrink: 0; }
  }
  .sp-footer { padding: 10px 14px; border-top: 1px solid var(--border-color); }
}

/* ===== 文档卡片区 ===== */
.asset-area { overflow: hidden; overflow-y: auto; }
.doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 10px; }
.doc-card { padding: 14px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border: 2px solid transparent;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(29,78,216,0.1); }
  &.is-selected { border-color: var(--primary-color); }
  .dc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; .dc-badges { display: flex; gap: 4px; } }
  .dc-title { font-size: 14px; font-weight: 600; color: var(--text-color); margin: 0 0 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dc-type-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 12px; color: var(--text-secondary);
    .dc-type { color: #fff; padding: 1px 6px; border-radius: 4px; font-size: 11px; font-weight: 500; }
  }
  .dc-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
  .dc-data { display: flex; gap: 12px; font-size: 11px; color: var(--text-secondary); margin-bottom: 6px; }
  .dc-quality { display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
    .dq-bar { flex: 1; height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden; .dq-fill { height: 100%; border-radius: 2px; } }
    span { font-size: 12px; font-weight: 600; }
  }
  .dc-risk { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--danger-color); padding: 4px 8px; background: #fef2f2; border-radius: 4px; margin-bottom: 6px; }
  .dc-footer { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-secondary);
    .dc-ops { display: flex; gap: 2px; }
  }
}
.dc-type-sm { color: #fff; padding: 1px 6px; border-radius: 4px; font-size: 11px; font-weight: 500; }

/* ===== 表格视图 ===== */
.doc-table-wrap { overflow-x: auto;
  .dtb-actions { margin-bottom: 10px; }
}

/* ===== 流水线视图 ===== */
.pipeline-view { display: flex; flex-direction: column; gap: 12px; }
.pipe-item { padding: 16px; position: relative;
  .pi-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; h4 { font-size: 14px; font-weight: 600; margin: 0; } }
  .pi-steps { display: flex; flex-direction: column; gap: 4px; }
  .pi-step { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 6px;
    .pis-dot { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
      .pis-empty { width: 8px; height: 8px; border-radius: 50%; background: #d1d5db; }
    }
    .pis-info { flex: 1; display: flex; align-items: center; gap: 8px;
      .pis-label { font-size: 13px; font-weight: 500; color: var(--text-color); }
      .pis-detail { font-size: 12px; color: var(--text-secondary); }
    }
    .pis-time { font-size: 11px; color: var(--text-secondary); flex-shrink: 0; }
    &.st-success { .pis-dot { color: #22c55e; } }
    &.st-failed { .pis-dot { color: #ef4444; } background: #fef2f2; }
    &.st-processing { .pis-dot { color: #3b82f6; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } }
    &.st-skipped { .pis-dot { color: #d1d5db; } .pis-label { color: #9ca3af; } }
    &.st-pending { .pis-dot { color: #d1d5db; } }
  }
  .pi-line { display: flex; margin-top: 8px; gap: 2px;
    .pl-seg { height: 4px; border-radius: 2px; background: #e5eaf3; position: relative;
      &.st-success { background: #22c55e; } &.st-failed { background: #ef4444; } &.st-processing { background: #3b82f6; }
    }
  }
  .pi-fail-tip { display: flex; align-items: center; gap: 8px; margin-top: 10px; padding: 8px 12px; background: #fef2f2; border-radius: 6px; font-size: 12px; color: #ef4444; }
}

/* ===== 智能分析面板 ===== */
.intel-panel { overflow-y: auto; padding: 0;
  .ip-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 14px 8px; position: sticky; top: 0; background: #fff; z-index: 1;
    h3 { font-size: 14px; font-weight: 600; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }
  .ip-section { padding: 10px 14px; border-top: 1px solid var(--border-color);
    h4 { font-size: 13px; font-weight: 600; margin: 0 0 8px; display: flex; align-items: center; gap: 8px;
      .iq-score { font-size: 16px; font-weight: 700; }
    }
  }
  .ip-summary-text { font-size: 13px; color: var(--text-color); line-height: 1.6; margin: 0; }
  .ip-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .ip-actions { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 14px; border-top: 1px solid var(--border-color); position: sticky; bottom: 0; background: #fff; }
}
.ip-empty { display: flex; flex-direction: column; align-items: center; justify-content: center;
  .ipe-icon { font-size: 48px; color: #d1d5db; margin-bottom: 12px; }
  p { font-size: 13px; color: var(--text-secondary); text-align: center; line-height: 1.6; }
}

/* 生命周期 */
.lifecycle-flow { display: flex; align-items: flex-start; justify-content: space-between; padding: 0 4px;
  .lf-step { display: flex; flex-direction: column; align-items: center; gap: 4px;
    .lf-dot { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; background: #f0f0f0; color: #999; transition: all 0.3s; }
    span { font-size: 10px; color: #999; white-space: nowrap; }
    &.is-done { .lf-dot { background: var(--primary-color); color: #fff; } span { color: var(--primary-color); } }
    &.is-active { .lf-dot { background: #fff; border: 2px solid var(--primary-color); color: var(--primary-color); } span { color: var(--primary-color); font-weight: 600; } }
  }
}

/* AI 引用控制 */
.ai-ref-control {
  .arc-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; span { font-size: 12px; color: var(--text-secondary); } }
  .arc-switches { display: flex; flex-direction: column; gap: 6px; margin-top: 8px;
    .asw-item { display: flex; align-items: center; justify-content: space-between; span { font-size: 12px; color: var(--text-color); } }
  }
}

/* 质量评分 */
.iq-bar { height: 6px; background: #f0f0f0; border-radius: 3px; margin-bottom: 10px; overflow: hidden; .iq-fill { height: 100%; border-radius: 3px; } }
.iq-dims { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px;
  .iqd-item { display: flex; align-items: center; gap: 6px;
    .iqd-name { font-size: 11px; color: var(--text-secondary); width: 80px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .iqd-bar { flex: 1; height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden; .iqd-fill { height: 100%; border-radius: 2px; } }
    .iqd-val { font-size: 11px; font-weight: 600; width: 24px; text-align: right; }
  }
}
.iq-warn { margin-top: 8px; padding: 6px 10px; background: #fef2f2; border-radius: 4px; font-size: 12px; color: #ef4444; }

/* 风险 */
.ip-risks { display: flex; flex-direction: column; gap: 6px;
  .ir-item { display: flex; align-items: flex-start; gap: 6px; font-size: 12px; padding: 6px 8px; border-radius: 6px;
    &.lv-high { background: #fef2f2; color: #ef4444; }
    &.lv-medium { background: #fffbeb; color: #d97706; }
    &.lv-low { background: #f8fafc; color: #64748b; }
  }
}

/* 引用 */
.ip-citations { display: flex; flex-direction: column; gap: 8px;
  .ict-item { padding: 8px; background: #fafbfc; border-radius: 6px;
    .ict-head { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; span { font-size: 11px; color: var(--text-secondary); } }
    .ict-q { font-size: 12px; color: var(--text-color); margin: 0 0 4px; font-weight: 500; }
    .ict-seg { font-size: 11px; color: var(--text-secondary); }
  }
}

/* AI 按钮 */
.ip-ai-btns { display: flex; flex-wrap: wrap; gap: 6px; }

/* ===== 上传抽屉 ===== */
.upload-drag-area { padding: 0 4px 12px; }
.uda-zone { border: 2px dashed #d1d5db; border-radius: 12px; padding: 30px; text-align: center; transition: border-color 0.2s;
  &:hover { border-color: var(--primary-color); }
  .uda-icon { font-size: 40px; color: #d1d5db; margin-bottom: 8px; }
  p { font-size: 14px; font-weight: 500; margin: 0 0 4px; color: var(--text-color); }
  span { font-size: 12px; color: var(--text-secondary); display: block; }
  .uda-types { margin-top: 4px; font-size: 11px; color: #9ca3af; }
}
.upload-form { padding: 0 4px; }
.uf-group-title { font-size: 13px; font-weight: 600; color: var(--text-color); padding: 10px 0 4px 110px; border-top: 1px solid var(--border-color); margin-top: 4px; }

/* ===== 解析结果 ===== */
.pr-content { padding: 0 4px; }
.pr-info { margin-bottom: 16px; }
.pr-section { margin-bottom: 16px;
  h4 { font-size: 14px; font-weight: 600; margin: 0 0 10px; color: var(--text-color); }
  p { font-size: 13px; color: var(--text-color); line-height: 1.6; }
}
.pr-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.pr-segments { display: flex; flex-direction: column; gap: 10px; }
.prs-item { padding: 12px; background: #fafbfc; border-radius: 8px;
  .prs-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
    .prs-idx { font-size: 11px; color: var(--primary-color); font-weight: 600; }
    h5 { font-size: 13px; font-weight: 600; margin: 0; flex: 1; }
    .prs-ops { display: flex; gap: 2px; }
  }
  .prs-content { font-size: 13px; color: var(--text-color); line-height: 1.6; margin: 0 0 6px; }
  .prs-meta { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text-secondary); flex-wrap: wrap; }
}
.pr-empty { text-align: center; padding: 20px; font-size: 13px; color: var(--text-secondary); }
.prl-item { font-size: 13px; strong { margin-right: 8px; } em { font-style: normal; color: var(--text-secondary); margin-left: 8px; } }

/* ===== 预览抽屉 ===== */
.pv-content { padding: 0 4px; }
.pv-info { margin-bottom: 12px; }
.pv-preview-area { margin-bottom: 16px; }
.pva-mock { border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.pva-page { padding: 20px;
  .pva-header { text-align: center; font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-color); }
  .pva-lines { display: flex; flex-direction: column; gap: 8px;
    .pva-line { height: 8px; background: #f0f0f0; border-radius: 4px; }
  }
}
.pv-segments { margin-bottom: 16px;
  h4 { font-size: 14px; font-weight: 600; margin: 0 0 8px; }
  .pvs-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 12px;
    .pvs-idx { width: 20px; height: 20px; border-radius: 50%; background: var(--primary-light); color: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; flex-shrink: 0; }
    .pvs-title { flex: 1; color: var(--text-color); }
    .pvs-page { color: var(--text-secondary); }
  }
}
.pv-actions { padding-top: 12px; border-top: 1px solid var(--border-color); }

/* ===== 质量评分弹窗 ===== */
.qr-content {
  .qr-overall { display: flex; justify-content: center; margin-bottom: 16px; .qr-ring { width: 120px; height: 120px; } .qr-val { font-size: 24px; font-weight: 700; } }
  .qr-dims { display: flex; flex-direction: column; gap: 12px;
    .qrd-item {
      .qrd-head { display: flex; justify-content: space-between; margin-bottom: 4px; .qrd-name { font-size: 13px; font-weight: 500; } .qrd-score { font-size: 14px; font-weight: 700; } }
      .qrd-bar { height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; margin-bottom: 4px; .qrd-fill { height: 100%; border-radius: 3px; } }
      .qrd-comment { font-size: 12px; color: var(--text-secondary); }
    }
  }
}

/* ===== AI 辅助弹窗 ===== */
.ai-assist-content { h4 { font-size: 15px; font-weight: 600; margin: 0 0 12px; } p { font-size: 13px; line-height: 1.6; color: var(--text-color); }
  .aat-tags { display: flex; gap: 6px; flex-wrap: wrap; }
}

/* ===== 版本识别弹窗 ===== */
.vd-content {
  .vd-alert { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #eff6ff; border-radius: 8px; font-size: 13px; color: #3b82f6; margin-bottom: 16px; }
  .vd-compare { display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
    .vdc-item { flex: 1; padding: 12px; background: #f9fafb; border-radius: 8px;
      .vdc-label { font-size: 11px; color: var(--text-secondary); } p { font-size: 13px; font-weight: 600; margin: 4px 0; } span { font-size: 11px; color: var(--text-secondary); }
      &.vdc-new { background: #eff6ff; }
    }
    .vdc-arrow { font-size: 18px; color: #d1d5db; }
  }
  .vd-suggest { font-size: 13px; color: var(--text-color); margin-bottom: 16px; }
  .vd-actions { display: flex; gap: 8px; justify-content: flex-end; }
}

/* ===== 通用 ===== */
.empty-tip { grid-column: 1 / -1; text-align: center; padding: 40px 0; font-size: 13px; color: var(--text-secondary); }

/* ===== 统计联动面板 ===== */
.stat-detail-panel {
  padding: 16px 18px;
  animation: slideDown 0.25s ease;

  .sdp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    h3 { margin: 0; font-size: 15px; font-weight: 700; color: var(--text-color); }
    .sdp-actions { display: flex; align-items: center; gap: 6px; }
  }

  .sdp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    p { font-size: 13px; color: var(--text-secondary); margin: 0; }
  }

  .fail-reason { color: #ef4444; font-size: 12px; }
  .pending-action { color: #f59e0b; font-size: 12px; font-weight: 500; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Stat card active state */
.stat-card.is-active {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15), 0 8px 20px rgba(29, 78, 216, 0.1) !important;
}

/* ===== 响应式 ===== */
@media (max-width: 1400px) { .dc-body { grid-template-columns: 210px 1fr 290px; } .stat-row { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 1100px) { .dc-body { grid-template-columns: 190px 1fr; } .intel-panel { display: none; } .stat-row { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 800px) { .dc-body { grid-template-columns: 1fr; } .src-panel { display: none; } .stat-row { grid-template-columns: repeat(2, 1fr); } .cmd-bar .cmd-content { flex-direction: column; gap: 12px; align-items: flex-start; } .cmd-search .search-input { width: 100% !important; } .filter-bar { flex-wrap: wrap; } }
</style>
