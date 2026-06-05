// ===== 类型定义 =====

export interface BasicConfig {
  systemName: string
  systemShortName: string
  systemLogo: string
  systemDescription: string
  defaultHomePage: string
  systemStatus: string
  maintenanceNotice: string
  adminContact: string
}

export interface ModelConfig {
  provider: string
  modelName: string
  apiUrl: string
  apiKey: string
  maxContextLength: number
  temperature: number
  maxOutputLength: number
  enableStreaming: boolean
  enableFailover: boolean
  fallbackModel: string
}

export interface KnowledgeStrategy {
  ingestMethod: string
  supportedFileTypes: string[]
  maxFileSize: number
  chunkSize: number
  chunkOverlap: number
  enableAutoSummary: boolean
  enableAutoTag: boolean
  enableDuplicateDetection: boolean
  reviewMethod: string
  updateStrategy: string
  enableExpiryReminder: boolean
  expiryReminderDays: number
}

export interface QaStrategy {
  answerMode: string
  requireSource: boolean
  noMatchAction: string
  confidenceThreshold: number
  maxReferences: number
  showSource: boolean
  showSimilarQuestions: boolean
  allowFollowUp: boolean
  recordHistory: boolean
  allowFeedback: boolean
}

export interface SecurityConfig {
  defaultRole: string
  enableMenuPermission: boolean
  enableButtonPermission: boolean
  enableDataPermission: boolean
  knowledgeAccessScope: string
  teamAssetAccessScope: string
  sensitiveWordFilter: boolean
  sensitiveContentReview: boolean
  loginExpireHours: number
  allowMultiDevice: boolean
  recordOperationLog: boolean
}

export interface SystemPreference {
  defaultTheme: string
  themeColor: string
  defaultLayout: string
  showLogo: boolean
  showBreadcrumb: boolean
  showMultiTab: boolean
  enablePageCache: boolean
  enableGlobalLoading: boolean
  enableAnimation: boolean
  defaultPageSize: number
  defaultLanguage: string
}

export interface LogRecord {
  id: number
  user: string
  action: string
  detail: string
  ip: string
  time: string
  status: string
}

export interface LogCategory {
  key: string
  label: string
  count: number
  records: LogRecord[]
}

// ===== Mock 数据 =====

export const defaultBasicConfig: BasicConfig = {
  systemName: '智能体系知识问答平台',
  systemShortName: 'AI知识库',
  systemLogo: '/logo.png',
  systemDescription: '面向企业内部制度、流程和项目资料的统一问答入口，支持文档检索、知识命中和对话记录追踪。',
  defaultHomePage: '/dashboard',
  systemStatus: 'running',
  maintenanceNotice: '',
  adminContact: 'admin@company.com'
}

export const defaultModelConfig: ModelConfig = {
  provider: 'openai',
  modelName: 'GPT-4o',
  apiUrl: 'https://api.openai.com/v1',
  apiKey: 'sk-****-****-****-abcdef',
  maxContextLength: 8192,
  temperature: 0.7,
  maxOutputLength: 2048,
  enableStreaming: true,
  enableFailover: true,
  fallbackModel: 'GPT-3.5-turbo'
}

export const defaultKnowledgeStrategy: KnowledgeStrategy = {
  ingestMethod: 'upload',
  supportedFileTypes: ['pdf', 'docx', 'xlsx', 'md', 'txt'],
  maxFileSize: 50,
  chunkSize: 512,
  chunkOverlap: 64,
  enableAutoSummary: true,
  enableAutoTag: true,
  enableDuplicateDetection: false,
  reviewMethod: 'auto',
  updateStrategy: 'version',
  enableExpiryReminder: true,
  expiryReminderDays: 90
}

export const defaultQaStrategy: QaStrategy = {
  answerMode: 'precise',
  requireSource: true,
  noMatchAction: 'suggest',
  confidenceThreshold: 0.75,
  maxReferences: 5,
  showSource: true,
  showSimilarQuestions: true,
  allowFollowUp: true,
  recordHistory: true,
  allowFeedback: true
}

export const defaultSecurityConfig: SecurityConfig = {
  defaultRole: 'viewer',
  enableMenuPermission: true,
  enableButtonPermission: true,
  enableDataPermission: false,
  knowledgeAccessScope: 'department',
  teamAssetAccessScope: 'team',
  sensitiveWordFilter: true,
  sensitiveContentReview: false,
  loginExpireHours: 24,
  allowMultiDevice: false,
  recordOperationLog: true
}

export const defaultSystemPreference: SystemPreference = {
  defaultTheme: 'light',
  themeColor: '#1677ff',
  defaultLayout: 'sidebar',
  showLogo: true,
  showBreadcrumb: true,
  showMultiTab: false,
  enablePageCache: true,
  enableGlobalLoading: true,
  enableAnimation: true,
  defaultPageSize: 20,
  defaultLanguage: 'zh-CN'
}

export const defaultLogData: LogCategory[] = [
  {
    key: 'login',
    label: '登录日志',
    count: 128,
    records: [
      { id: 1001, user: '李明', action: '登录成功', detail: 'Web 端登录', ip: '192.168.1.105', time: '2026-06-05 10:24:18', status: '成功' },
      { id: 1002, user: '张倩', action: '登录成功', detail: 'Web 端登录', ip: '192.168.1.203', time: '2026-06-05 09:45:02', status: '成功' },
      { id: 1003, user: '王凯', action: '登录失败', detail: '密码错误', ip: '192.168.1.178', time: '2026-06-05 09:32:41', status: '失败' },
      { id: 1004, user: '陈晨', action: '登录成功', detail: 'SSO 单点登录', ip: '10.0.2.56', time: '2026-06-05 09:10:33', status: '成功' },
      { id: 1005, user: '周雅', action: '登录成功', detail: 'Web 端登录', ip: '192.168.1.89', time: '2026-06-04 18:22:07', status: '成功' }
    ]
  },
  {
    key: 'operation',
    label: '操作日志',
    count: 342,
    records: [
      { id: 2001, user: '李明', action: '修改系统配置', detail: '更新了模型配置参数', ip: '192.168.1.105', time: '2026-06-05 10:18:30', status: '成功' },
      { id: 2002, user: '张倩', action: '新增知识文档', detail: '上传《2026Q2排期计划.xlsx》', ip: '192.168.1.203', time: '2026-06-05 09:52:14', status: '成功' },
      { id: 2003, user: '王凯', action: '删除知识文档', detail: '删除过期文档《旧版接口说明》', ip: '192.168.1.178', time: '2026-06-04 17:40:22', status: '成功' },
      { id: 2004, user: '陈晨', action: '修改用户角色', detail: '将赵磊角色从 viewer 改为 editor', ip: '10.0.2.56', time: '2026-06-04 16:15:08', status: '成功' },
      { id: 2005, user: '周雅', action: '导出报表', detail: '导出 6 月份知识库使用统计', ip: '192.168.1.89', time: '2026-06-04 15:30:55', status: '成功' }
    ]
  },
  {
    key: 'ai-call',
    label: 'AI 调用日志',
    count: 1536,
    records: [
      { id: 3001, user: '李明', action: '知识问答', detail: '模型 GPT-4o，耗时 1.2s，Token 消耗 856', ip: '-', time: '2026-06-05 10:22:45', status: '成功' },
      { id: 3002, user: '张倩', action: '文档解析', detail: '解析 PDF 文档，切片 42 段', ip: '-', time: '2026-06-05 09:58:30', status: '成功' },
      { id: 3003, user: '王凯', action: '知识问答', detail: '模型 GPT-4o，超时 30s', ip: '-', time: '2026-06-05 09:40:12', status: '超时' },
      { id: 3004, user: '陈晨', action: '自动摘要', detail: '生成文档摘要，Token 消耗 1240', ip: '-', time: '2026-06-04 18:05:33', status: '成功' },
      { id: 3005, user: '周雅', action: '知识问答', detail: '模型 GPT-4o，耗时 0.8s，Token 消耗 623', ip: '-', time: '2026-06-04 17:28:19', status: '成功' }
    ]
  },
  {
    key: 'knowledge-change',
    label: '知识库变更日志',
    count: 87,
    records: [
      { id: 4001, user: '张倩', action: '新增文档', detail: '《2026Q2排期计划》入库，分类：项目管理', ip: '192.168.1.203', time: '2026-06-05 09:52:14', status: '已审核' },
      { id: 4002, user: '王凯', action: '更新文档', detail: '《接口字段说明》版本 v2 → v3', ip: '192.168.1.178', time: '2026-06-04 17:40:22', status: '已审核' },
      { id: 4003, user: '李明', action: '删除文档', detail: '删除《旧版API文档》，原因：已过期', ip: '192.168.1.105', time: '2026-06-04 14:22:08', status: '已审核' },
      { id: 4004, user: '陈晨', action: '新增文档', detail: '《工单状态流转图》入库，分类：业务流程', ip: '10.0.2.56', time: '2026-06-03 16:55:30', status: '待审核' },
      { id: 4005, user: '周雅', action: '更新分类', detail: '将《指标口径草案》从"技术"移至"数据"', ip: '192.168.1.89', time: '2026-06-03 13:48:12', status: '已审核' }
    ]
  },
  {
    key: 'system-error',
    label: '系统异常日志',
    count: 23,
    records: [
      { id: 5001, user: '系统', action: '模型调用异常', detail: 'OpenAI API 返回 429 Too Many Requests', ip: '-', time: '2026-06-05 09:40:12', status: '已恢复' },
      { id: 5002, user: '系统', action: '文件解析失败', detail: 'PDF 文件损坏，无法提取文本', ip: '-', time: '2026-06-04 15:22:30', status: '未处理' },
      { id: 5003, user: '系统', action: '数据库连接超时', detail: 'MySQL 连接池耗尽，自动扩容后恢复', ip: '-', time: '2026-06-03 22:10:45', status: '已恢复' },
      { id: 5004, user: '系统', action: 'Redis 缓存失效', detail: 'Redis 节点重启导致缓存丢失，已自动重建', ip: '-', time: '2026-06-02 08:30:18', status: '已恢复' },
      { id: 5005, user: '系统', action: 'Nginx 502 错误', detail: '后端服务重启期间出现短暂 502', ip: '-', time: '2026-06-01 03:15:22', status: '已恢复' }
    ]
  }
]

// ===== 选项常量 =====

export const providerOptions = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'azure', label: 'Azure OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'zhipu', label: '智谱 AI' },
  { value: 'baidu', label: '百度文心' },
  { value: 'custom', label: '自定义' }
]

export const roleOptions = [
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑者' },
  { value: 'viewer', label: '查看者' }
]

export const themeOptions = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'auto', label: '跟随系统' }
]

export const layoutOptions = [
  { value: 'sidebar', label: '侧边栏布局' },
  { value: 'topbar', label: '顶部导航布局' },
  { value: 'hybrid', label: '混合布局' }
]

export const languageOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' }
]

export const fileTypeOptions = ['pdf', 'docx', 'xlsx', 'md', 'txt', 'pptx', 'csv']

export const answerModeOptions = [
  { value: 'precise', label: '精准模式（仅基于知识回答）' },
  { value: 'creative', label: '创意模式（结合模型能力扩展）' },
  { value: 'balanced', label: '平衡模式（知识优先 + 适度扩展）' }
]

export const noMatchOptions = [
  { value: 'refuse', label: '拒绝回答' },
  { value: 'suggest', label: '推荐相似问题' },
  { value: 'fallback', label: '使用模型通用能力回答' }
]

export const ingestOptions = [
  { value: 'upload', label: '手动上传' },
  { value: 'crawl', label: '网页爬取' },
  { value: 'api', label: 'API 推送' },
  { value: 'sync', label: '定时同步' }
]

export const reviewOptions = [
  { value: 'auto', label: '自动审核' },
  { value: 'manual', label: '人工审核' },
  { value: 'hybrid', label: '自动 + 人工复核' }
]

export const updateStrategyOptions = [
  { value: 'version', label: '版本管理（保留历史版本）' },
  { value: 'overwrite', label: '直接覆盖' },
  { value: 'merge', label: '智能合并' }
]

export const accessScopeOptions = [
  { value: 'all', label: '全部可见' },
  { value: 'department', label: '按部门' },
  { value: 'team', label: '按团队' },
  { value: 'role', label: '按角色' },
  { value: 'custom', label: '自定义规则' }
]
