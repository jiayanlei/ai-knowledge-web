// ===== 知识分类（星系） =====

export interface KnowledgeGalaxy {
  id: string
  name: string
  shortName: string
  description: string
  icon: string
  count: number
  lastUpdate: string
  status: 'active' | 'stable' | 'updating'
  color: string
  softColor: string
}

export function getGalaxiesMock(): KnowledgeGalaxy[] {
  return [
    { id: 'g1', name: '新人入职星球', shortName: '新人入职', description: '入职流程、账号申请、办公工具、部门介绍、导师制度', icon: 'UserFilled', count: 24, lastUpdate: '2026-06-04', status: 'stable', color: '#10b981', softColor: '#ecfdf5' },
    { id: 'g2', name: '公司制度星球', shortName: '公司制度', description: '沉淀考勤、请假、报销、奖惩、保密等制度内容', icon: 'Document', count: 36, lastUpdate: '2026-06-01', status: 'stable', color: '#6366f1', softColor: '#eef2ff' },
    { id: 'g3', name: '员工手册星球', shortName: '员工手册', description: '员工行为规范、办公指南、沟通准则、安全须知', icon: 'Notebook', count: 18, lastUpdate: '2026-05-28', status: 'stable', color: '#f59e0b', softColor: '#fffbeb' },
    { id: 'g4', name: '项目文档星球', shortName: '项目文档', description: '项目需求、技术文档、架构设计、接口说明', icon: 'Folder', count: 52, lastUpdate: '2026-06-05', status: 'active', color: '#3b82f6', softColor: '#eff6ff' },
    { id: 'g5', name: '项目资产星球', shortName: '项目资产', description: '项目交接、接口文档、部署说明、业务规则和历史经验', icon: 'Briefcase', count: 128, lastUpdate: '2026-06-05', status: 'active', color: '#8b5cf6', softColor: '#f5f3ff' },
    { id: 'g6', name: '福利政策星球', shortName: '福利政策', description: '节假日福利、五险一金、补贴政策、团建活动、员工关怀', icon: 'Present', count: 18, lastUpdate: '2026-05-28', status: 'stable', color: '#ec4899', softColor: '#fdf2f8' },
    { id: 'g7', name: '流程规范星球', shortName: '流程规范', description: '上线流程、权限申请、采购流程、合同审批、运维处理', icon: 'SetUp', count: 42, lastUpdate: '2026-06-02', status: 'active', color: '#14b8a6', softColor: '#f0fdfa' },
    { id: 'g8', name: '企业文化星球', shortName: '企业文化', description: '公司使命愿景、核心价值观、行为准则、文化故事', icon: 'Star', count: 16, lastUpdate: '2026-06-05', status: 'active', color: '#f97316', softColor: '#fff7ed' },
    { id: 'g9', name: '常见问题星球', shortName: '常见问题', description: 'IT 支持、系统使用、行政服务、HR 常见问答', icon: 'QuestionFilled', count: 34, lastUpdate: '2026-06-03', status: 'stable', color: '#64748b', softColor: '#f8fafc' }
  ]
}

// ===== 知识卡片 =====

export interface KnowledgeCard {
  id: string
  title: string
  summary: string
  galaxyId: string
  galaxyName: string
  tags: string[]
  owner: string
  version: string
  updateTime: string
  views: number
  favorites: number
  status: 'valid' | 'needs_update' | 'deprecated'
  heat: number
  recommended: boolean
}

export function getKnowledgeCardsMock(): KnowledgeCard[] {
  return [
    { id: 'k1', title: '员工请假管理制度', summary: '说明员工请假的类型、申请方式、审批流程、材料要求和 HR 备案规则。', galaxyId: 'g2', galaxyName: '公司制度星球', tags: ['考勤', '请假', '审批', 'HR'], owner: '人力资源部', version: 'V1.3', updateTime: '2026-06-05', views: 1680, favorites: 234, status: 'valid', heat: 95, recommended: true },
    { id: 'k2', title: '差旅报销管理办法', summary: '涵盖出差申请、交通住宿标准、报销流程和审批链路等完整报销指南。', galaxyId: 'g2', galaxyName: '公司制度星球', tags: ['报销', '差旅', '财务'], owner: '财务部', version: 'V2.1', updateTime: '2026-06-03', views: 1240, favorites: 186, status: 'valid', heat: 88, recommended: true },
    { id: 'k3', title: '新人入职工具账号申请说明', summary: '详细说明新员工入职后如何申请 GitLab、Jenkins、企业邮箱等开发工具和账号。', galaxyId: 'g1', galaxyName: '新人入职星球', tags: ['新人', '账号', '工具'], owner: 'IT 运维组', version: 'V1.0', updateTime: '2026-06-03', views: 860, favorites: 142, status: 'valid', heat: 82, recommended: true },
    { id: 'k4', title: '项目上线发布规范', summary: '规定项目上线前的检查清单、发布流程、回滚策略和上线后监控要求。', galaxyId: 'g7', galaxyName: '流程规范星球', tags: ['上线', '发布', '运维'], owner: '技术研发部', version: 'V3.0', updateTime: '2026-06-01', views: 920, favorites: 156, status: 'valid', heat: 78, recommended: false },
    { id: 'k5', title: 'K8s 集群运维手册', summary: 'Kubernetes 集群日常运维操作指南，包含扩缩容、故障排查和监控配置。', galaxyId: 'g4', galaxyName: '项目文档星球', tags: ['K8s', '运维', '容器'], owner: '运维团队', version: 'V2.5', updateTime: '2026-05-20', views: 680, favorites: 98, status: 'valid', heat: 72, recommended: false },
    { id: 'k6', title: '微服务链路追踪指南', summary: 'SkyWalking 接入配置、Trace ID 传递规范和链路分析方法说明。', galaxyId: 'g4', galaxyName: '项目文档星球', tags: ['微服务', '链路追踪', 'SkyWalking'], owner: '架构组', version: 'V1.2', updateTime: '2026-05-15', views: 540, favorites: 76, status: 'valid', heat: 65, recommended: false },
    { id: 'k7', title: '旧版权限申请说明', summary: '旧版 OA 系统的权限申请流程说明，已被新版流程替代。', galaxyId: 'g7', galaxyName: '流程规范星球', tags: ['权限', 'OA', '旧版'], owner: 'IT 运维组', version: 'V0.9', updateTime: '2026-01-10', views: 320, favorites: 12, status: 'deprecated', heat: 15, recommended: false },
    { id: 'k8', title: '员工福利补贴政策', summary: '涵盖交通补贴、餐补、通讯补贴、节日礼金和年度体检等福利政策。', galaxyId: 'g6', galaxyName: '福利政策星球', tags: ['福利', '补贴', '五险一金'], owner: '人力资源部', version: 'V2.0', updateTime: '2026-05-28', views: 980, favorites: 210, status: 'valid', heat: 85, recommended: true },
    { id: 'k9', title: '代码规范与审查流程', summary: '统一代码风格、命名规范、Code Review 流程和常见代码质量问题说明。', galaxyId: 'g4', galaxyName: '项目文档星球', tags: ['代码规范', 'Review', '质量'], owner: '技术研发部', version: 'V2.2', updateTime: '2026-05-28', views: 720, favorites: 108, status: 'valid', heat: 70, recommended: false },
    { id: 'k10', title: 'MySQL 慢查询优化指南', summary: '慢查询分析工具、索引优化策略、EXPLAIN 分析和常见优化模式。', galaxyId: 'g5', galaxyName: '项目资产星球', tags: ['MySQL', '性能优化', '数据库'], owner: 'DBA 团队', version: 'V1.5', updateTime: '2026-04-10', views: 450, favorites: 64, status: 'needs_update', heat: 55, recommended: false },
    { id: 'k11', title: 'OKR 管理实施办法', summary: 'OKR 制定流程、季度评审时间点、评分标准和结果归档规则。', galaxyId: 'g8', galaxyName: '企业文化星球', tags: ['OKR', '绩效', '文化'], owner: '人力资源部', version: 'V1.1', updateTime: '2026-06-05', views: 640, favorites: 88, status: 'valid', heat: 75, recommended: true },
    { id: 'k12', title: 'SSO 单点登录集成指南', summary: 'OAuth 2.0 + OIDC 协议对接流程，支持 Authorization Code 和 Client Credentials 模式。', galaxyId: 'g4', galaxyName: '项目文档星球', tags: ['SSO', 'OAuth', '集成'], owner: '安全团队', version: 'V2.0', updateTime: '2026-06-04', views: 380, favorites: 52, status: 'valid', heat: 60, recommended: false }
  ]
}

// ===== 热门标签 =====

export function getHotTagsMock(): string[] {
  return ['请假流程', '报销制度', '新人入职', '项目交接', '权限申请', '上线流程', '五险一金', '员工手册']
}

// ===== 顶部统计 =====

export interface TopStats {
  total: number
  monthUpdate: number
  hotViews: number
  needsUpdate: number
}

export function getTopStatsMock(): TopStats {
  return { total: 248, monthUpdate: 36, hotViews: 1280, needsUpdate: 12 }
}

// ===== 场景入口 =====

export interface SceneEntry {
  id: string
  name: string
  description: string
  knowledgeCount: number
  extraInfo: string
  galaxyId: string
  color: string
}

export function getSceneEntriesMock(): SceneEntry[] {
  return [
    { id: 's1', name: '新人入职舱', description: '入职流程、账号申请、办公工具、部门介绍、导师制度', knowledgeCount: 24, extraInfo: '8 个流程 · 12 个常见问题', galaxyId: 'g1', color: '#10b981' },
    { id: 's2', name: '制度查询舱', description: '考勤制度、请假制度、报销制度、奖惩规范、保密规范', knowledgeCount: 36, extraInfo: '最近更新 2026-06-03', galaxyId: 'g2', color: '#6366f1' },
    { id: 's3', name: '项目资料舱', description: '项目交接、接口文档、部署说明、需求说明、业务流程', knowledgeCount: 128, extraInfo: '最近更新 2026-06-05', galaxyId: 'g5', color: '#8b5cf6' },
    { id: 's4', name: '福利政策舱', description: '节假日福利、五险一金、补贴政策、团建活动、员工关怀', knowledgeCount: 18, extraInfo: '最近更新 2026-05-28', galaxyId: 'g6', color: '#ec4899' },
    { id: 's5', name: '流程规范舱', description: '上线流程、权限申请、采购流程、合同审批、运维处理', knowledgeCount: 42, extraInfo: '最近更新 2026-06-02', galaxyId: 'g7', color: '#14b8a6' }
  ]
}

// ===== 知识雷达 =====

export interface RadarItem {
  id: string
  icon: string
  text: string
  type: 'hot' | 'search' | 'update' | 'expire' | 'collect'
}

export function getRadarItemsMock(): RadarItem[] {
  return [
    { id: 'r1', icon: 'TrendCharts', text: '《员工请假管理制度》今日被访问 168 次', type: 'hot' },
    { id: 'r2', icon: 'Search', text: '"报销流程" 本周被搜索 92 次', type: 'search' },
    { id: 'r3', icon: 'Edit', text: '《项目上线发布规范》今日更新至 V3.0', type: 'update' },
    { id: 'r4', icon: 'Warning', text: '《旧版权限申请说明》已超过 90 天未更新', type: 'expire' },
    { id: 'r5', icon: 'Star', text: '《新人入职工具账号申请说明》收藏量持续上升', type: 'collect' },
    { id: 'r6', icon: 'TrendCharts', text: '《员工福利补贴政策》本周阅读量突破 200', type: 'hot' }
  ]
}

// ===== 知识时间线 =====

export interface TimelineItem {
  id: string
  date: string
  event: string
  docId: string
  docTitle: string
}

export function getTimelineMock(): TimelineItem[] {
  return [
    { id: 't1', date: '2026-06-05', event: '报销流程更新了审批节点', docId: 'k2', docTitle: '差旅报销管理办法' },
    { id: 't2', date: '2026-06-03', event: '新增《新人入职工具账号申请说明》', docId: 'k3', docTitle: '新人入职工具账号申请说明' },
    { id: 't3', date: '2026-06-01', event: '更新《项目上线发布规范》至 V3.0', docId: 'k4', docTitle: '项目上线发布规范' },
    { id: 't4', date: '2026-05-28', event: '新增《员工福利补贴政策》', docId: 'k8', docTitle: '员工福利补贴政策' },
    { id: 't5', date: '2026-05-25', event: 'OKR 管理实施办法季度修订', docId: 'k11', docTitle: 'OKR 管理实施办法' },
    { id: 't6', date: '2026-05-20', event: 'K8s 运维手册补充故障排查章节', docId: 'k5', docTitle: 'K8s 集群运维手册' }
  ]
}

// ===== 文档详情 =====

export interface DocDetail {
  id: string
  title: string
  galaxyName: string
  tags: string[]
  scope: string
  owner: string
  version: string
  updateTime: string
  status: 'valid' | 'needs_update' | 'deprecated'
  views: number
  favorites: number
  healthScore: number
  healthReasons: string[]
  abstract: string
  steps: string[]
  notes: string[]
  relatedDocs: { id: string; title: string }[]
  versions: { version: string; date: string; author: string; note: string }[]
  content: string
}

export function getDocDetailsMock(): Record<string, DocDetail> {
  return {
    'k1': {
      id: 'k1', title: '员工请假管理制度', galaxyName: '公司制度星球',
      tags: ['考勤', '请假', '审批', 'HR'], scope: '全体员工', owner: '人力资源部',
      version: 'V1.3', updateTime: '2026-06-05', status: 'valid', views: 1680, favorites: 234,
      healthScore: 92,
      healthReasons: ['最近更新较新', '负责人明确', '版本状态有效', '员工反馈良好'],
      abstract: '这篇制度主要说明员工请假的类型、申请方式、审批流程、材料要求和 HR 备案规则。涵盖年假、病假、事假、婚假、产假等多种假期类型的申请标准和审批权限。',
      steps: ['提交请假申请（OA 系统）', '直属领导审批（1 个工作日）', 'HR 备案审核', '请假生效，考勤自动更新'],
      notes: ['病假需要提供医院证明或诊断书', '年假需提前 3 个工作日申请', '特殊情况可事后补充说明，但需在 2 个工作日内完成', '请假审批通过后才算正式生效，未审批缺勤按旷工处理'],
      relatedDocs: [
        { id: 'k2', title: '差旅报销管理办法' },
        { id: 'k8', title: '员工福利补贴政策' },
        { id: 'k11', title: 'OKR 管理实施办法' }
      ],
      versions: [
        { version: 'V1.3', date: '2026-06-05', author: '人力资源部', note: '调整年假天数计算规则' },
        { version: 'V1.2', date: '2026-03-15', author: '人力资源部', note: '新增远程办公请假说明' },
        { version: 'V1.1', date: '2025-12-01', author: '人力资源部', note: '补充婚假和产假条款' },
        { version: 'V1.0', date: '2025-06-01', author: '人力资源部', note: '初始版本发布' }
      ],
      content: '一、请假类型\n\n1. 年假：根据工龄享有 5-15 天年假，按自然年度计算\n2. 病假：需提供医院证明，每年累计不超过 30 天\n3. 事假：每年累计不超过 15 天，需提前申请\n4. 婚假：法定 3 天，晚婚可增加至 15 天\n5. 产假：女员工 98 天，男员工陪产假 15 天\n\n二、申请方式\n\n所有请假需通过 OA 系统提交申请，填写请假类型、起止日期和事由。3 天以内的请假由直属上级审批，3 天以上需部门经理加签。\n\n三、审批流程\n\n提交申请 → 直属上级审批 → HR 备案 → 请假生效\n\n四、材料要求\n\n病假需提供医院诊断证明；婚假需提供结婚证复印件；产假需提供预产期证明。\n\n五、HR 备案规则\n\n所有请假记录由 HR 部门统一归档，作为年度考勤统计和绩效考核的依据。'
    },
    'k2': {
      id: 'k2', title: '差旅报销管理办法', galaxyName: '公司制度星球',
      tags: ['报销', '差旅', '财务'], scope: '全体员工', owner: '财务部',
      version: 'V2.1', updateTime: '2026-06-03', status: 'valid', views: 1240, favorites: 186,
      healthScore: 88,
      healthReasons: ['最近更新较新', '负责人明确', '流程完整'],
      abstract: '涵盖出差申请、交通住宿标准、报销流程和审批链路等完整报销指南，适用于所有需要出差办公的员工。',
      steps: ['出差前提交出差申请单', '出差期间保留所有发票和凭证', '出差结束 5 个工作日内提交报销', '审批链路：直属上级 → 部门经理 → 财务部', '审批通过后 3-5 个工作日打款'],
      notes: ['超标费用需额外提交说明并由分管副总审批', '住宿费标准：一线城市 500 元/晚，其他城市 350 元/晚', '交通费优先选择经济舱/二等座', '餐费补贴：每天 100 元，无需发票'],
      relatedDocs: [{ id: 'k1', title: '员工请假管理制度' }, { id: 'k8', title: '员工福利补贴政策' }],
      versions: [
        { version: 'V2.1', date: '2026-06-03', author: '财务部', note: '更新审批节点和住宿标准' },
        { version: 'V2.0', date: '2026-01-15', author: '财务部', note: '全面修订报销标准' },
        { version: 'V1.1', date: '2025-08-01', author: '财务部', note: '新增电子发票说明' },
        { version: 'V1.0', date: '2025-03-01', author: '财务部', note: '初始版本发布' }
      ],
      content: '差旅报销管理办法详细内容...'
    },
    'k3': {
      id: 'k3', title: '新人入职工具账号申请说明', galaxyName: '新人入职星球',
      tags: ['新人', '账号', '工具'], scope: '新入职员工', owner: 'IT 运维组',
      version: 'V1.0', updateTime: '2026-06-03', status: 'valid', views: 860, favorites: 142,
      healthScore: 85,
      healthReasons: ['新发布文档', '负责人明确', '内容完整'],
      abstract: '详细说明新员工入职后如何申请 GitLab、Jenkins、企业邮箱、VPN 等开发工具和系统账号，帮助新人快速搭建开发环境。',
      steps: ['入职当天由 HR 发送欢迎邮件，含账号申请链接', '填写个人信息和所需工具清单', 'IT 运维组在 1 个工作日内完成账号开通', '直属导师协助配置开发环境', '确认所有工具可正常使用'],
      notes: ['所有账号使用公司邮箱注册，禁止使用个人邮箱', 'VPN 客户端需从内部下载页面获取', '如遇到问题请联系 IT 支持（企业微信：IT-Support）', '账号密码需符合公司安全策略要求'],
      relatedDocs: [{ id: 'k9', title: '代码规范与审查流程' }, { id: 'k4', title: '项目上线发布规范' }],
      versions: [
        { version: 'V1.0', date: '2026-06-03', author: 'IT 运维组', note: '初始版本发布' }
      ],
      content: '新人入职工具账号申请说明详细内容...'
    }
  }
}

// ===== 最近浏览 =====

export interface RecentView {
  id: string
  title: string
  galaxyName: string
  viewTime: string
}

export function getRecentViewsMock(): RecentView[] {
  return [
    { id: 'k1', title: '员工请假管理制度', galaxyName: '公司制度星球', viewTime: '10 分钟前' },
    { id: 'k3', title: '新人入职工具账号申请说明', galaxyName: '新人入职星球', viewTime: '1 小时前' },
    { id: 'k4', title: '项目上线发布规范', galaxyName: '流程规范星球', viewTime: '2 小时前' },
    { id: 'k8', title: '员工福利补贴政策', galaxyName: '福利政策星球', viewTime: '昨天' },
    { id: 'k5', title: 'K8s 集群运维手册', galaxyName: '项目文档星球', viewTime: '昨天' }
  ]
}

// ===== 我的收藏 =====

export interface FavoriteItem {
  id: string
  title: string
  galaxyName: string
  favoriteTime: string
}

export function getFavoritesMock(): FavoriteItem[] {
  return [
    { id: 'k1', title: '员工请假管理制度', galaxyName: '公司制度星球', favoriteTime: '2026-06-01' },
    { id: 'k2', title: '差旅报销管理办法', galaxyName: '公司制度星球', favoriteTime: '2026-05-28' },
    { id: 'k8', title: '员工福利补贴政策', galaxyName: '福利政策星球', favoriteTime: '2026-05-25' },
    { id: 'k3', title: '新人入职工具账号申请说明', galaxyName: '新人入职星球', favoriteTime: '2026-05-20' },
    { id: 'k11', title: 'OKR 管理实施办法', galaxyName: '企业文化星球', favoriteTime: '2026-05-18' }
  ]
}

// ===== 热门问题 =====

export function getHotQuestionsMock(): string[] {
  return ['请假流程怎么走？', '报销需要哪些材料？', '新人入职第一天做什么？', '项目上线需要哪些审批？', '五险一金怎么缴纳？', 'VPN 如何连接？']
}

// ===== AI 辅助 mock =====

export function getAiSummaryMock(title: string): string {
  return `《${title}》核心要点：\n\n1. 明确了适用范围和基本定义\n2. 规定了标准操作流程和审批链路\n3. 列出了注意事项和材料要求\n4. 提供了常见问题解答和联系方式\n5. 附带了版本记录和变更说明`
}

export function getAiProcessMock(title: string): string {
  return `《${title}》流程提炼：\n\n第一步：提交申请（OA 系统）\n第二步：直属上级审批\n第三步：相关部门复核\n第四步：审批生效\n第五步：系统自动同步\n\n预计全流程耗时：1-3 个工作日`
}

export function getAiInterpretMock(title: string): string {
  return `AI 解读《${title}》：\n\n该文档属于企业管理制度类内容，主要面向全体员工。文档结构清晰，包含制度说明、操作流程、注意事项和版本记录。\n\n关键信息：\n- 适用对象：全体员工\n- 核心流程：申请 → 审批 → 生效\n- 特别注意：材料要求和审批时效\n- 最新变更：优化了审批节点`
}
