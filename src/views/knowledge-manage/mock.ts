// ===== 知识分类 =====

export interface KnowledgeCategory {
  id: string
  name: string
  icon: string
  count: number
  pendingReview: number
  needsUpdate: number
  lastUpdate: string
  owner: string
  color: string
}

export function getCategoriesMock(): KnowledgeCategory[] {
  return [
    { id: 'c1', name: '新人入职导航', icon: 'UserFilled', count: 24, pendingReview: 1, needsUpdate: 2, lastUpdate: '2026-06-04', owner: '人力资源部', color: '#10b981' },
    { id: 'c2', name: '公司制度中心', icon: 'Document', count: 36, pendingReview: 2, needsUpdate: 3, lastUpdate: '2026-06-05', owner: '人力资源部', color: '#6366f1' },
    { id: 'c3', name: '员工手册', icon: 'Notebook', count: 18, pendingReview: 0, needsUpdate: 1, lastUpdate: '2026-05-28', owner: '行政部', color: '#f59e0b' },
    { id: 'c4', name: '项目文档', icon: 'Folder', count: 52, pendingReview: 3, needsUpdate: 4, lastUpdate: '2026-06-05', owner: '技术管理部', color: '#3b82f6' },
    { id: 'c5', name: '项目资产库', icon: 'Briefcase', count: 128, pendingReview: 5, needsUpdate: 8, lastUpdate: '2026-06-05', owner: '技术管理部', color: '#8b5cf6' },
    { id: 'c6', name: '福利政策站', icon: 'Present', count: 18, pendingReview: 0, needsUpdate: 0, lastUpdate: '2026-05-28', owner: '人力资源部', color: '#ec4899' },
    { id: 'c7', name: '流程规范库', icon: 'SetUp', count: 42, pendingReview: 1, needsUpdate: 2, lastUpdate: '2026-06-02', owner: '运营部', color: '#14b8a6' },
    { id: 'c8', name: '企业文化', icon: 'Star', count: 16, pendingReview: 0, needsUpdate: 0, lastUpdate: '2026-06-05', owner: '企业文化小组', color: '#f97316' },
    { id: 'c9', name: '常见问题库', icon: 'QuestionFilled', count: 34, pendingReview: 0, needsUpdate: 1, lastUpdate: '2026-06-03', owner: 'IT 运维组', color: '#64748b' }
  ]
}

// ===== 知识资产 =====

export interface KnowledgeAsset {
  id: string
  title: string
  categoryId: string
  categoryName: string
  tags: string[]
  owner: string
  version: string
  status: 'draft' | 'pending' | 'published' | 'needs_update' | 'offline' | 'deprecated'
  scope: string
  updateTime: string
  createTime: string
  creator: string
  views: number
  favorites: number
  feedbackCount: number
  healthScore: number
  recommended: boolean
  sensitive: boolean
  visibleDepts: string[]
}

export function getAssetsMock(): KnowledgeAsset[] {
  return [
    { id: 'a1', title: '员工请假管理制度', categoryId: 'c2', categoryName: '公司制度中心', tags: ['考勤', '请假', '审批'], owner: '人力资源部', version: 'V1.3', status: 'published', scope: '全体员工', updateTime: '2026-06-05', createTime: '2025-06-01', creator: '张三', views: 1680, favorites: 86, feedbackCount: 12, healthScore: 92, recommended: true, sensitive: false, visibleDepts: ['全员'] },
    { id: 'a2', title: '差旅报销管理办法', categoryId: 'c2', categoryName: '公司制度中心', tags: ['报销', '差旅', '财务'], owner: '财务部', version: 'V2.1', status: 'published', scope: '全体员工', updateTime: '2026-06-03', createTime: '2025-03-01', creator: '李四', views: 1240, favorites: 64, feedbackCount: 8, healthScore: 88, recommended: true, sensitive: false, visibleDepts: ['全员'] },
    { id: 'a3', title: '新人入职工具账号申请说明', categoryId: 'c1', categoryName: '新人入职导航', tags: ['新人', '账号', '工具'], owner: 'IT 运维组', version: 'V1.0', status: 'published', scope: '新入职员工', updateTime: '2026-06-03', createTime: '2026-06-03', creator: '王五', views: 860, favorites: 42, feedbackCount: 3, healthScore: 85, recommended: true, sensitive: false, visibleDepts: ['全员'] },
    { id: 'a4', title: '项目上线发布规范', categoryId: 'c7', categoryName: '流程规范库', tags: ['上线', '发布', '运维'], owner: '技术研发部', version: 'V3.0', status: 'published', scope: '研发人员', updateTime: '2026-06-01', createTime: '2025-01-15', creator: '赵六', views: 920, favorites: 56, feedbackCount: 5, healthScore: 78, recommended: false, sensitive: false, visibleDepts: ['研发中心'] },
    { id: 'a5', title: 'K8s 集群运维手册', categoryId: 'c4', categoryName: '项目文档', tags: ['K8s', '运维', '容器'], owner: '运维团队', version: 'V2.5', status: 'needs_update', scope: '运维人员', updateTime: '2026-05-20', createTime: '2025-04-10', creator: '吴大伟', views: 680, favorites: 38, feedbackCount: 2, healthScore: 65, recommended: false, sensitive: false, visibleDepts: ['研发中心'] },
    { id: 'a6', title: '微服务链路追踪指南', categoryId: 'c4', categoryName: '项目文档', tags: ['微服务', 'SkyWalking'], owner: '架构组', version: 'V1.2', status: 'published', scope: '研发人员', updateTime: '2026-05-15', createTime: '2025-08-01', creator: '赵鹏飞', views: 540, favorites: 28, feedbackCount: 1, healthScore: 72, recommended: false, sensitive: false, visibleDepts: ['研发中心'] },
    { id: 'a7', title: '旧版权限申请说明', categoryId: 'c7', categoryName: '流程规范库', tags: ['权限', 'OA', '旧版'], owner: 'IT 运维组', version: 'V0.9', status: 'deprecated', scope: '全体员工', updateTime: '2026-01-10', createTime: '2024-06-01', creator: '周小丽', views: 320, favorites: 4, feedbackCount: 15, healthScore: 20, recommended: false, sensitive: false, visibleDepts: ['全员'] },
    { id: 'a8', title: '员工福利补贴政策', categoryId: 'c6', categoryName: '福利政策站', tags: ['福利', '补贴', '五险一金'], owner: '人力资源部', version: 'V2.0', status: 'published', scope: '全体员工', updateTime: '2026-05-28', createTime: '2025-05-01', creator: '孙小红', views: 980, favorites: 120, feedbackCount: 6, healthScore: 85, recommended: true, sensitive: false, visibleDepts: ['全员'] },
    { id: 'a9', title: '代码规范与审查流程', categoryId: 'c4', categoryName: '项目文档', tags: ['代码规范', 'Review'], owner: '技术研发部', version: 'V2.2', status: 'published', scope: '研发人员', updateTime: '2026-05-28', createTime: '2025-02-01', creator: '张三', views: 720, favorites: 48, feedbackCount: 4, healthScore: 80, recommended: false, sensitive: false, visibleDepts: ['研发中心'] },
    { id: 'a10', title: 'MySQL 慢查询优化指南', categoryId: 'c5', categoryName: '项目资产库', tags: ['MySQL', '性能优化'], owner: 'DBA 团队', version: 'V1.5', status: 'needs_update', scope: '研发人员', updateTime: '2026-04-10', createTime: '2025-06-15', creator: '刘浩然', views: 450, favorites: 22, feedbackCount: 7, healthScore: 55, recommended: false, sensitive: false, visibleDepts: ['研发中心'] },
    { id: 'a11', title: 'OKR 管理实施办法', categoryId: 'c8', categoryName: '企业文化', tags: ['OKR', '绩效'], owner: '人力资源部', version: 'V1.1', status: 'published', scope: '全体员工', updateTime: '2026-06-05', createTime: '2025-07-01', creator: '孙雅琪', views: 640, favorites: 36, feedbackCount: 2, healthScore: 90, recommended: true, sensitive: false, visibleDepts: ['全员'] },
    { id: 'a12', title: 'SSO 单点登录集成指南', categoryId: 'c4', categoryName: '项目文档', tags: ['SSO', 'OAuth'], owner: '安全团队', version: 'V2.0', status: 'pending', scope: '研发人员', updateTime: '2026-06-04', createTime: '2025-09-01', creator: '杨洁', views: 380, favorites: 18, feedbackCount: 0, healthScore: 82, recommended: false, sensitive: false, visibleDepts: ['研发中心'] },
    { id: 'a13', title: '薪酬福利管理办法', categoryId: 'c2', categoryName: '公司制度中心', tags: ['薪酬', '福利'], owner: '人力资源部', version: 'V1.8', status: 'pending', scope: '全体员工', updateTime: '2026-06-04', createTime: '2025-01-01', creator: '陈七', views: 520, favorites: 44, feedbackCount: 3, healthScore: 75, recommended: false, sensitive: true, visibleDepts: ['人力资源部', '财务部'] },
    { id: 'a14', title: '信息安全管理办法', categoryId: 'c2', categoryName: '公司制度中心', tags: ['安全', '保密'], owner: '安全团队', version: 'V3.0', status: 'published', scope: '全体员工', updateTime: '2026-05-25', createTime: '2024-12-01', creator: '黄志刚', views: 880, favorites: 52, feedbackCount: 4, healthScore: 82, recommended: false, sensitive: true, visibleDepts: ['全员'] },
    { id: 'a15', title: '项目交接文档模板', categoryId: 'c5', categoryName: '项目资产库', tags: ['交接', '模板'], owner: '技术管理部', version: 'V1.0', status: 'draft', scope: '项目经理', updateTime: '2026-06-05', createTime: '2026-06-05', creator: '马晓丽', views: 0, favorites: 0, feedbackCount: 0, healthScore: 60, recommended: false, sensitive: false, visibleDepts: ['研发中心'] },
    { id: 'a16', title: 'API 网关限流配置说明', categoryId: 'c5', categoryName: '项目资产库', tags: ['API', '网关', '限流'], owner: '架构组', version: 'V1.1', status: 'offline', scope: '研发人员', updateTime: '2026-03-15', createTime: '2025-10-01', creator: '周志强', views: 280, favorites: 14, feedbackCount: 9, healthScore: 45, recommended: false, sensitive: false, visibleDepts: ['研发中心'] }
  ]
}

// ===== 待审核 =====

export interface AuditItem {
  id: string
  assetId: string
  title: string
  submitter: string
  categoryId: string
  categoryName: string
  submitTime: string
  version: string
  changeNote: string
  reviewer: string
  status: 'pending' | 'approved' | 'rejected'
}

export function getAuditQueueMock(): AuditItem[] {
  return [
    { id: 'au1', assetId: 'a12', title: 'SSO 单点登录集成指南', submitter: '杨洁', categoryId: 'c4', categoryName: '项目文档', submitTime: '2026-06-04 16:30', version: 'V2.0', changeNote: '新增 OIDC 协议支持', reviewer: '赵鹏飞', status: 'pending' },
    { id: 'au2', assetId: 'a13', title: '薪酬福利管理办法', submitter: '陈七', categoryId: 'c2', categoryName: '公司制度中心', submitTime: '2026-06-04 14:20', version: 'V1.8', changeNote: '调整年终奖计算规则', reviewer: '张总监', status: 'pending' },
    { id: 'au3', assetId: 'a1', title: '员工请假管理制度', submitter: '张三', categoryId: 'c2', categoryName: '公司制度中心', submitTime: '2026-06-03 10:15', version: 'V1.3', changeNote: '调整年假天数计算', reviewer: '李总监', status: 'approved' },
    { id: 'au4', assetId: 'a4', title: '项目上线发布规范', submitter: '赵六', categoryId: 'c7', categoryName: '流程规范库', submitTime: '2026-06-01 09:00', version: 'V3.0', changeNote: '新增灰度发布流程', reviewer: '张总监', status: 'approved' },
    { id: 'au5', assetId: 'a6', title: '微服务链路追踪指南', submitter: '赵鹏飞', categoryId: 'c4', categoryName: '项目文档', submitTime: '2026-05-28 15:40', version: 'V1.2', changeNote: '补充前端采集章节', reviewer: '吴大伟', status: 'rejected' },
    { id: 'au6', assetId: 'a9', title: '代码规范与审查流程', submitter: '张三', categoryId: 'c4', categoryName: '项目文档', submitTime: '2026-05-25 11:30', version: 'V2.2', changeNote: '更新 ESLint 规则版本', reviewer: '赵鹏飞', status: 'approved' }
  ]
}

// ===== 版本记录 =====

export interface VersionRecord {
  id: string
  assetId: string
  version: string
  author: string
  time: string
  note: string
  status: 'current' | 'history'
}

export function getVersionsMock(): VersionRecord[] {
  return [
    { id: 'v1', assetId: 'a1', version: 'V1.3', author: '张三', time: '2026-06-05', note: '调整请假审批节点', status: 'current' },
    { id: 'v2', assetId: 'a1', version: 'V1.2', author: '李四', time: '2026-03-15', note: '补充病假材料说明', status: 'history' },
    { id: 'v3', assetId: 'a1', version: 'V1.1', author: '张三', time: '2025-12-01', note: '新增婚假产假条款', status: 'history' },
    { id: 'v4', assetId: 'a1', version: 'V1.0', author: '人力资源部', time: '2025-06-01', note: '初始版本发布', status: 'history' },
    { id: 'v5', assetId: 'a2', version: 'V2.1', author: '财务部', time: '2026-06-03', note: '更新住宿标准', status: 'current' },
    { id: 'v6', assetId: 'a2', version: 'V2.0', author: '财务部', time: '2026-01-15', note: '全面修订报销标准', status: 'history' }
  ]
}

// ===== 员工反馈 =====

export interface FeedbackItem {
  id: string
  assetId: string
  feedbackUser: string
  type: 'solved' | 'unsolved' | 'outdated' | 'unclear' | 'missing'
  content: string
  time: string
  handleStatus: 'pending' | 'processing' | 'handled' | 'ignored'
  handler: string
  handleResult: string
}

export function getFeedbacksMock(): FeedbackItem[] {
  return [
    { id: 'f1', assetId: 'a1', feedbackUser: '李晓婷', type: 'solved', content: '请假流程很清楚，顺利完成了申请。', time: '2026-06-04 10:30', handleStatus: 'handled', handler: '张三', handleResult: '已确认' },
    { id: 'f2', assetId: 'a1', feedbackUser: '王建国', type: 'unclear', content: '婚假天数说明不够明确，晚婚标准是什么？', time: '2026-06-03 16:20', handleStatus: 'pending', handler: '', handleResult: '' },
    { id: 'f3', assetId: 'a5', feedbackUser: '赵鹏飞', type: 'outdated', content: 'K8s 版本已更新到 1.28，文档还是 1.25 的配置。', time: '2026-06-02 14:10', handleStatus: 'processing', handler: '吴大伟', handleResult: '正在更新中' },
    { id: 'f4', assetId: 'a7', feedbackUser: '陈思雨', type: 'outdated', content: '这是旧版 OA 的流程，已经不适用了。', time: '2026-06-01 09:40', handleStatus: 'handled', handler: '周小丽', handleResult: '已标记废弃' },
    { id: 'f5', assetId: 'a10', feedbackUser: '刘浩然', type: 'missing', content: '缺少 pt-query-digest 的使用示例。', time: '2026-05-30 11:20', handleStatus: 'pending', handler: '', handleResult: '' },
    { id: 'f6', assetId: 'a2', feedbackUser: '孙雅琪', type: 'solved', content: '报销流程说明很详细，已顺利提交。', time: '2026-05-28 15:30', handleStatus: 'handled', handler: '李四', handleResult: '已确认' },
    { id: 'f7', assetId: 'a16', feedbackUser: '周志强', type: 'unsolved', content: '限流配置示例无法生效，可能有版本兼容问题。', time: '2026-05-25 10:00', handleStatus: 'pending', handler: '', handleResult: '' },
    { id: 'f8', assetId: 'a8', feedbackUser: '马晓丽', type: 'solved', content: '福利政策很清晰，感谢整理。', time: '2026-05-22 14:00', handleStatus: 'handled', handler: '孙小红', handleResult: '已确认' }
  ]
}

// ===== 知识体检 =====

export interface HealthCheckItem {
  id: string
  assetId: string
  title: string
  issue: string
  level: 'high' | 'medium' | 'low'
  handled: boolean
}

export function getHealthCheckMock(): HealthCheckItem[] {
  return [
    { id: 'hc1', assetId: 'a7', title: '旧版权限申请说明', issue: '已超过 120 天未更新', level: 'high', handled: false },
    { id: 'hc2', assetId: 'a16', title: 'API 网关限流配置说明', issue: '已下架但仍被访问 280 次', level: 'high', handled: false },
    { id: 'hc3', assetId: 'a10', title: 'MySQL 慢查询优化指南', issue: '员工反馈较多（7 条未处理）', level: 'medium', handled: false },
    { id: 'hc4', assetId: 'a15', title: '项目交接文档模板', issue: '缺少负责人', level: 'medium', handled: false },
    { id: 'hc5', assetId: 'a5', title: 'K8s 集群运维手册', issue: '超过 90 天未更新', level: 'medium', handled: false },
    { id: 'hc6', assetId: 'a13', title: '薪酬福利管理办法', issue: '待审核超过 3 天', level: 'high', handled: false },
    { id: 'hc7', assetId: 'a6', title: '微服务链路追踪指南', issue: '缺少关联文档', level: 'low', handled: false },
    { id: 'hc8', assetId: 'a11', title: 'OKR 管理实施办法', issue: '已发布但缺少摘要', level: 'low', handled: false }
  ]
}

// ===== 操作记录 =====

export interface OperationLog {
  id: string
  time: string
  operator: string
  action: string
  target: string
}

export function getOperationLogsMock(): OperationLog[] {
  return [
    { id: 'ol1', time: '2026-06-05 09:32', operator: '张三', action: '编辑知识', target: '员工请假管理制度' },
    { id: 'ol2', time: '2026-06-05 08:50', operator: '马晓丽', action: '新建知识', target: '项目交接文档模板' },
    { id: 'ol3', time: '2026-06-04 16:30', operator: '杨洁', action: '提交审核', target: 'SSO 单点登录集成指南' },
    { id: 'ol4', time: '2026-06-04 14:20', operator: '陈七', action: '提交审核', target: '薪酬福利管理办法' },
    { id: 'ol5', time: '2026-06-03 10:15', operator: '张三', action: '发布知识', target: '员工请假管理制度 V1.3' },
    { id: 'ol6', time: '2026-06-02 16:00', operator: '周小丽', action: '标记废弃', target: '旧版权限申请说明' },
    { id: 'ol7', time: '2026-06-01 09:00', operator: '赵六', action: '发布知识', target: '项目上线发布规范 V3.0' },
    { id: 'ol8', time: '2026-05-30 14:40', operator: '吴大伟', action: '下架知识', target: 'API 网关限流配置说明' }
  ]
}

// ===== 顶部统计 =====

export interface TopStats {
  total: number
  pendingReview: number
  needsUpdate: number
  published: number
  offline: number
  todayFeedback: number
}

export function getTopStatsMock(): TopStats {
  return { total: 248, pendingReview: 12, needsUpdate: 18, published: 196, offline: 22, todayFeedback: 8 }
}

// ===== 辅助数据 =====

export const tagOptions = ['考勤', '请假', '审批', '报销', '差旅', '新人', '账号', '上线', '发布', 'K8s', 'MySQL', 'SSO', 'OKR', '安全', '福利', '代码规范']

export const ownerOptions = ['人力资源部', '财务部', 'IT 运维组', '技术研发部', '运维团队', '架构组', '安全团队', '技术管理部']

export const deptOptions = ['全员', '研发中心', '产品中心', '客服中心', '运营中心', '外包支持组']

export const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'pending', label: '待审核' },
  { value: 'published', label: '已发布' },
  { value: 'needs_update', label: '待更新' },
  { value: 'offline', label: '已下架' },
  { value: 'deprecated', label: '已废弃' }
]
