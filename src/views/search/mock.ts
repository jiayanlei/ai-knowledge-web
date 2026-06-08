// ===== 知识来源分布 =====

export interface KnowledgeSource {
  id: string
  name: string
  icon: string
  count: number
  color: string
}

export function getSourcesMock(): KnowledgeSource[] {
  return [
    { id: 'src1', name: '公司制度', icon: 'Document', count: 12, color: '#6366f1' },
    { id: 'src2', name: '员工手册', icon: 'Notebook', count: 6, color: '#10b981' },
    { id: 'src3', name: '项目文档', icon: 'Folder', count: 8, color: '#3b82f6' },
    { id: 'src4', name: '福利政策', icon: 'Present', count: 4, color: '#ec4899' },
    { id: 'src5', name: '流程规范', icon: 'SetUp', count: 5, color: '#14b8a6' },
    { id: 'src6', name: '常见问题', icon: 'QuestionFilled', count: 7, color: '#f59e0b' }
  ]
}

// ===== 搜索结果 =====

export type DocCategory = 'company_policy' | 'handbook' | 'project' | 'benefit' | 'process' | 'faq'
export type DocSource2 = 'hr_center' | 'finance_center' | 'tech_center' | 'project_assets' | 'culture_lib'
export type DocState = 'latest' | 'expiring' | 'historical' | 'draft'
export type AuthorityLevel = 'official' | 'verified' | 'community'
export type SmartTag = 'newbie' | 'hot' | 'manager' | 'approval' | 'risk'

export interface SearchResult {
  id: string
  title: string
  summary: string
  matchScore: number
  category: DocCategory
  categoryLabel: string
  source: DocSource2
  sourceLabel: string
  dept: string
  tags: string[]
  updateTime: string
  state: DocState
  stateLabel: string
  authority: AuthorityLevel
  views: number
  citations: number
  smartTags: SmartTag[]
  version: string
  badges: string[]
}

export function getSearchResultsMock(): SearchResult[] {
  return [
    { id: 'r1', title: '差旅报销管理办法', summary: '规定了公司员工差旅期间的住宿标准、交通费用、餐饮补贴和报销审批流程。国内差旅住宿标准：一线城市 500 元/晚，二线城市 400 元/晚。报销需在出差结束后 5 个工作日内提交。', matchScore: 98, category: 'company_policy', categoryLabel: '公司制度', source: 'finance_center', sourceLabel: '财务中心', dept: '财务部', tags: ['报销', '差旅', '财务', '审批'], updateTime: '2026-06-03', state: 'latest', stateLabel: '最新有效', authority: 'official', views: 1240, citations: 36, smartTags: ['hot', 'approval'], version: 'V2.1', badges: ['官方制度', '最新版本', 'AI 推荐'] },
    { id: 'r2', title: '员工请假管理制度', summary: '涵盖年假、病假、婚假、产假等多种假期类型的详细规定。员工请假需提前在 OA 系统提交申请，1 天以内由直属上级审批，1-3 天需部门负责人审批，3 天以上需分管副总审批。', matchScore: 95, category: 'company_policy', categoryLabel: '公司制度', source: 'hr_center', sourceLabel: '人事中心', dept: '人力资源部', tags: ['考勤', '请假', '审批', 'HR'], updateTime: '2026-06-05', state: 'latest', stateLabel: '最新有效', authority: 'official', views: 1680, citations: 48, smartTags: ['hot', 'approval', 'newbie'], version: 'V1.3', badges: ['官方制度', '最新版本', '高频访问'] },
    { id: 'r3', title: '费用报销流程图', summary: '详细展示了从提交报销申请到财务打款的完整流程，包括部门审批、财务审核、发票核验、打款通知等环节的操作说明和注意事项。', matchScore: 92, category: 'process', categoryLabel: '流程规范', source: 'finance_center', sourceLabel: '财务中心', dept: '财务部', tags: ['报销', '流程', '审批'], updateTime: '2026-05-28', state: 'latest', stateLabel: '最新有效', authority: 'verified', views: 860, citations: 22, smartTags: ['hot', 'approval'], version: 'V1.5', badges: ['最新版本'] },
    { id: 'r4', title: '新人入职指南', summary: '为新入职员工提供全面指引，包括入职准备清单、账号开通流程、办公设备领取、新人培训安排、试用期考核标准和转正流程。', matchScore: 90, category: 'handbook', categoryLabel: '员工手册', source: 'hr_center', sourceLabel: '人事中心', dept: '人力资源部', tags: ['新人', '入职', '指南', '培训'], updateTime: '2026-06-04', state: 'latest', stateLabel: '最新有效', authority: 'official', views: 860, citations: 28, smartTags: ['newbie'], version: 'V3.0', badges: ['官方制度', '新人必看'] },
    { id: 'r5', title: '发票填写规范说明', summary: '详细说明了增值税发票、普通发票的填写要求，包括抬头、税号、金额大写、备注栏填写规范，以及电子发票的接收和存档方式。', matchScore: 88, category: 'process', categoryLabel: '流程规范', source: 'finance_center', sourceLabel: '财务中心', dept: '财务部', tags: ['发票', '规范', '财务'], updateTime: '2026-05-20', state: 'latest', stateLabel: '最新有效', authority: 'verified', views: 620, citations: 18, smartTags: ['approval'], version: 'V1.2', badges: ['最新版本'] },
    { id: 'r6', title: '项目上线发布规范', summary: '规范了项目上线发布的完整流程，包括代码审查、测试验证、灰度发布和回滚方案。所有变更必须先经过灰度发布，从 5% 逐步扩大到 100%。', matchScore: 85, category: 'project', categoryLabel: '项目文档', source: 'tech_center', sourceLabel: '技术中心', dept: '技术管理部', tags: ['上线', '发布', '运维', '灰度'], updateTime: '2026-06-01', state: 'latest', stateLabel: '最新有效', authority: 'verified', views: 920, citations: 24, smartTags: ['hot'], version: 'V3.0', badges: ['最新版本'] },
    { id: 'r7', title: '员工福利补贴政策', summary: '说明了公司为员工提供的各项福利补贴政策，包括五险一金（公积金 12%）、餐补 500 元/月、交通补贴 300 元/月、节日福利和年度体检。', matchScore: 82, category: 'benefit', categoryLabel: '福利政策', source: 'hr_center', sourceLabel: '人事中心', dept: '人力资源部', tags: ['福利', '补贴', '五险一金', '餐补'], updateTime: '2026-05-28', state: 'latest', stateLabel: '最新有效', authority: 'official', views: 980, citations: 30, smartTags: ['hot', 'newbie'], version: 'V2.0', badges: ['官方制度', '高频访问'] },
    { id: 'r8', title: '审批权限说明', summary: '列出了不同审批事项的权限矩阵，包括请假审批、报销审批、采购审批、合同审批等，明确了各级管理者的审批额度和范围。', matchScore: 80, category: 'process', categoryLabel: '流程规范', source: 'hr_center', sourceLabel: '人事中心', dept: '行政部', tags: ['审批', '权限', '矩阵'], updateTime: '2026-04-15', state: 'expiring', stateLabel: '即将过期', authority: 'verified', views: 540, citations: 16, smartTags: ['manager', 'approval'], version: 'V1.8', badges: ['管理者常用'] },
    { id: 'r9', title: 'K8s 集群运维手册', summary: '详细描述了 K8s 集群的日常运维操作，包括节点管理、Pod 调度、故障排查和性能监控。当前版本为 1.25，建议关注 1.28 升级指南。', matchScore: 78, category: 'project', categoryLabel: '项目文档', source: 'tech_center', sourceLabel: '技术中心', dept: '运维团队', tags: ['K8s', '运维', '容器', '集群'], updateTime: '2026-03-20', state: 'expiring', stateLabel: '即将过期', authority: 'verified', views: 680, citations: 14, smartTags: ['risk'], version: 'V2.5', badges: ['即将过期'] },
    { id: 'r10', title: '报销常见问题 FAQ', summary: '汇总了员工在报销过程中最常遇到的问题及解答，包括：报销需要什么发票？电子发票怎么提交？出差补助怎么算？报销多久能打款？', matchScore: 76, category: 'faq', categoryLabel: '常见问题', source: 'finance_center', sourceLabel: '财务中心', dept: '财务部', tags: ['报销', 'FAQ', '常见问题'], updateTime: '2026-06-02', state: 'latest', stateLabel: '最新有效', authority: 'community', views: 1100, citations: 42, smartTags: ['hot', 'newbie'], version: 'V4.0', badges: ['高频访问'] },
    { id: 'r11', title: '代码规范与审查流程', summary: '规定了代码编写和 Review 的标准流程，包括命名规范、注释要求、分支管理策略、PR 审查清单和合并标准。', matchScore: 72, category: 'project', categoryLabel: '项目文档', source: 'tech_center', sourceLabel: '技术中心', dept: '技术研发部', tags: ['代码规范', 'Review', 'Git'], updateTime: '2026-05-28', state: 'latest', stateLabel: '最新有效', authority: 'verified', views: 720, citations: 20, smartTags: [], version: 'V2.2', badges: ['最新版本'] },
    { id: 'r12', title: '旧版报销制度（已废止）', summary: '2025 年 12 月前的旧版报销制度，部分条款已被新版替代。主要差异：旧版住宿标准较低，未覆盖电子发票场景。', matchScore: 68, category: 'company_policy', categoryLabel: '公司制度', source: 'finance_center', sourceLabel: '财务中心', dept: '财务部', tags: ['报销', '旧版', '历史'], updateTime: '2025-12-01', state: 'historical', stateLabel: '历史版本', authority: 'community', views: 320, citations: 4, smartTags: ['risk'], version: 'V1.5', badges: ['历史版本'] },
    { id: 'r13', title: 'OKR 管理实施办法', summary: '规定了公司 OKR 的制定、跟踪和评估流程。每个季度初制定 OKR，月度 check-in，季度复盘。OKR 评分采用 0-1 分制。', matchScore: 65, category: 'company_policy', categoryLabel: '公司制度', source: 'hr_center', sourceLabel: '人事中心', dept: '人力资源部', tags: ['OKR', '绩效', '管理'], updateTime: '2026-06-05', state: 'latest', stateLabel: '最新有效', authority: 'official', views: 640, citations: 12, smartTags: ['manager'], version: 'V1.1', badges: ['官方制度', '管理者常用'] },
    { id: 'r14', title: '信息安全管理办法', summary: '规定了公司信息安全的整体策略，包括密码管理、数据分级、访问控制、安全事件响应和违规处理。涉及敏感数据的文档需要加密存储。', matchScore: 62, category: 'company_policy', categoryLabel: '公司制度', source: 'tech_center', sourceLabel: '技术中心', dept: '安全团队', tags: ['安全', '保密', '数据分级'], updateTime: '2026-05-25', state: 'latest', stateLabel: '最新有效', authority: 'official', views: 880, citations: 18, smartTags: ['risk'], version: 'V3.0', badges: ['官方制度', '风险提示'] },
    { id: 'r15', title: '微服务链路追踪指南', summary: '介绍了基于 SkyWalking 的微服务链路追踪方案，包括 Agent 部署、数据收集、链路分析和告警配置。', matchScore: 58, category: 'project', categoryLabel: '项目文档', source: 'tech_center', sourceLabel: '技术中心', dept: '架构组', tags: ['微服务', 'SkyWalking', '监控'], updateTime: '2026-05-15', state: 'latest', stateLabel: '最新有效', authority: 'verified', views: 540, citations: 10, smartTags: [], version: 'V1.2', badges: [] },
    { id: 'r16', title: '年假可以休几天？', summary: '入职满 1 年享有 5 天年假，满 5 年享有 10 天年假，满 10 年享有 15 天年假。年假可以拆分使用，最小单位为半天。', matchScore: 94, category: 'faq', categoryLabel: '常见问题', source: 'hr_center', sourceLabel: '人事中心', dept: '人力资源部', tags: ['年假', '请假', 'FAQ'], updateTime: '2026-06-04', state: 'latest', stateLabel: '最新有效', authority: 'verified', views: 960, citations: 32, smartTags: ['hot', 'newbie'], version: 'V2.0', badges: ['高频访问'] },
    { id: 'r17', title: '项目交接文档模板', summary: '提供了标准化的项目交接文档模板，包括项目概况、技术架构、部署说明、运维手册、联系人列表和待办事项等章节。', matchScore: 55, category: 'project', categoryLabel: '项目文档', source: 'project_assets', sourceLabel: '团队资产库', dept: '技术管理部', tags: ['交接', '模板', '项目'], updateTime: '2026-06-05', state: 'draft', stateLabel: '草稿文档', authority: 'community', views: 45, citations: 0, smartTags: [], version: 'V0.1', badges: ['草稿'] },
    { id: 'r18', title: '权限申请流程', summary: '说明了员工申请系统权限的标准流程，包括 OA 权限、Git 权限、服务器权限、数据库权限的申请方式、审批节点和有效期管理。', matchScore: 74, category: 'process', categoryLabel: '流程规范', source: 'tech_center', sourceLabel: '技术中心', dept: 'IT 运维组', tags: ['权限', '申请', 'OA'], updateTime: '2026-05-10', state: 'latest', stateLabel: '最新有效', authority: 'verified', views: 480, citations: 14, smartTags: ['newbie', 'approval'], version: 'V2.0', badges: ['最新版本'] }
  ]
}

// ===== 知识包 =====

export interface KnowledgePackage {
  id: string
  title: string
  description: string
  docCount: number
  docs: { title: string; type: string }[]
  coverage: number
  icon: string
  color: string
}

export function getKnowledgePackagesMock(): KnowledgePackage[] {
  return [
    { id: 'kp1', title: '报销知识包', description: '涵盖报销制度、流程、发票规范和常见问题，一站式解决报销疑问', docCount: 5, docs: [
      { title: '差旅报销管理办法', type: '制度' },
      { title: '费用报销流程图', type: '流程' },
      { title: '发票填写规范说明', type: '规范' },
      { title: '审批权限说明', type: '说明' },
      { title: '报销常见问题 FAQ', type: 'FAQ' }
    ], coverage: 96, icon: 'Wallet', color: '#6366f1' },
    { id: 'kp2', title: '新人入职知识包', description: '新员工入职必读知识合集，从入职指南到制度了解，快速融入团队', docCount: 6, docs: [
      { title: '新人入职指南', type: '手册' },
      { title: '员工请假管理制度', type: '制度' },
      { title: '员工福利补贴政策', type: '政策' },
      { title: '权限申请流程', type: '流程' },
      { title: '年假可以休几天？', type: 'FAQ' },
      { title: 'OKR 管理实施办法', type: '制度' }
    ], coverage: 92, icon: 'UserFilled', color: '#10b981' },
    { id: 'kp3', title: '项目运维知识包', description: '项目研发和运维的核心文档合集，覆盖发布规范、代码审查和运维手册', docCount: 4, docs: [
      { title: '项目上线发布规范', type: '规范' },
      { title: '代码规范与审查流程', type: '规范' },
      { title: 'K8s 集群运维手册', type: '手册' },
      { title: '微服务链路追踪指南', type: '指南' }
    ], coverage: 88, icon: 'Monitor', color: '#3b82f6' }
  ]
}

// ===== 相关问题 =====

export interface RelatedQuestion {
  id: string
  question: string
  category: string
}

export function getRelatedQuestionsMock(): RelatedQuestion[] {
  return [
    { id: 'rq1', question: '年假可以一次休几天？', category: '请假' },
    { id: 'rq2', question: '年假没休完会清零吗？', category: '请假' },
    { id: 'rq3', question: '请年假需要提前几天申请？', category: '请假' },
    { id: 'rq4', question: '年假审批人是谁？', category: '请假' },
    { id: 'rq5', question: '出差住宿标准是多少？', category: '报销' },
    { id: 'rq6', question: '电子发票怎么提交报销？', category: '报销' },
    { id: 'rq7', question: '报销多久能打款？', category: '报销' },
    { id: 'rq8', question: '新人入职需要开通哪些系统账号？', category: '入职' }
  ]
}

// ===== 版本时间线 =====

export interface VersionItem {
  version: string
  time: string
  note: string
  isLatest: boolean
}

export const versionTimelines: Record<string, VersionItem[]> = {
  r1: [
    { version: 'V2.1', time: '2026-06', note: '更新住宿标准，新增电子发票要求', isLatest: true },
    { version: 'V2.0', time: '2026-01', note: '全面修订报销标准，调整审批流程', isLatest: false },
    { version: 'V1.5', time: '2025-12', note: '调整住宿标准（旧版已废止）', isLatest: false },
    { version: 'V1.0', time: '2025-06', note: '初始版本发布', isLatest: false }
  ],
  r2: [
    { version: 'V1.3', time: '2026-06', note: '调整年假天数计算规则', isLatest: true },
    { version: 'V1.2', time: '2026-03', note: '补充病假材料说明', isLatest: false },
    { version: 'V1.1', time: '2025-12', note: '新增婚假产假条款', isLatest: false },
    { version: 'V1.0', time: '2025-06', note: '初始版本发布', isLatest: false }
  ],
  r4: [
    { version: 'V3.0', time: '2026-06', note: '更新入职流程和培训安排', isLatest: true },
    { version: 'V2.5', time: '2026-01', note: '增加远程入职支持', isLatest: false },
    { version: 'V2.0', time: '2025-08', note: '全面修订入职指南', isLatest: false }
  ],
  r6: [
    { version: 'V3.0', time: '2026-06', note: '新增灰度发布流程', isLatest: true },
    { version: 'V2.0', time: '2025-10', note: '补充回滚方案', isLatest: false },
    { version: 'V1.0', time: '2025-03', note: '初始版本', isLatest: false }
  ]
}

// ===== AI 最佳答案 =====

export interface AiAnswer {
  answer: string
  sources: { title: string; id: string }[]
  confidence: number
}

export function getAiAnswerMock(keyword: string): AiAnswer | null {
  const kw = keyword.toLowerCase()
  if (kw.includes('报销') || kw.includes('差旅')) {
    return {
      answer: '根据《差旅报销管理办法 V2.1》，员工出差报销需要：1. 在出差结束后 5 个工作日内提交报销申请；2. 提供合规发票（支持电子发票）；3. 经部门负责人审批后由财务部审核打款。住宿标准：一线城市 500 元/晚，二线城市 400 元/晚，其他城市 300 元/晚。',
      sources: [
        { title: '差旅报销管理办法', id: 'r1' },
        { title: '费用报销流程图', id: 'r3' },
        { title: '发票填写规范说明', id: 'r5' }
      ],
      confidence: 96
    }
  }
  if (kw.includes('请假') || kw.includes('年假')) {
    return {
      answer: '根据《员工请假管理制度 V1.3》，请假需要：1. 提前在 OA 系统提交申请；2. 1 天以内由直属上级审批，1-3 天需部门负责人审批，3 天以上需分管副总审批。年假标准：入职满 1 年 5 天，满 5 年 10 天，满 10 年 15 天。病假需上传医院证明。',
      sources: [
        { title: '员工请假管理制度', id: 'r2' },
        { title: '年假可以休几天？', id: 'r16' },
        { title: '审批权限说明', id: 'r8' }
      ],
      confidence: 94
    }
  }
  if (kw.includes('入职') || kw.includes('新人')) {
    return {
      answer: '新员工入职第一天需要完成：1. 领取办公设备；2. 开通企业邮箱和 OA 账号；3. 参加新人培训；4. 了解部门 OKR 和试用期考核标准。试用期为 3 个月，考核通过后可申请转正。',
      sources: [
        { title: '新人入职指南', id: 'r4' },
        { title: '员工福利补贴政策', id: 'r7' },
        { title: '权限申请流程', id: 'r18' }
      ],
      confidence: 90
    }
  }
  if (kw.includes('福利') || kw.includes('补贴')) {
    return {
      answer: '公司为员工提供全面的福利保障：1. 五险一金（公积金比例 12%）；2. 餐补 500 元/月；3. 交通补贴 300 元/月；4. 节日福利和年度体检。具体标准详见《员工福利补贴政策 V2.0》。',
      sources: [
        { title: '员工福利补贴政策', id: 'r7' }
      ],
      confidence: 92
    }
  }
  if (kw.includes('权限')) {
    return {
      answer: '权限申请流程：1. 在 OA 系统提交权限申请；2. 经直属上级和部门负责人审批；3. IT 运维组配置权限。不同系统权限（OA、Git、服务器、数据库）有不同的审批节点和有效期管理。',
      sources: [
        { title: '权限申请流程', id: 'r18' },
        { title: '审批权限说明', id: 'r8' }
      ],
      confidence: 85
    }
  }
  if (kw.length > 0) {
    return {
      answer: `根据企业知识库检索，与「${keyword}」相关的内容涉及多个领域。建议查看下方搜索结果获取详细信息，或使用知识包获取完整知识链。`,
      sources: [{ title: '相关搜索结果', id: '' }],
      confidence: 70
    }
  }
  return null
}

// ===== 热门检索词 =====
export const hotKeywords = ['报销流程', '请假制度', '入职流程', '项目交接', '权限申请', '福利政策']

// ===== 分类选项 =====
export const categoryOptions = [
  { value: 'company_policy', label: '公司制度' },
  { value: 'handbook', label: '员工手册' },
  { value: 'project', label: '项目文档' },
  { value: 'benefit', label: '福利政策' },
  { value: 'process', label: '流程规范' },
  { value: 'faq', label: '常见问题' }
]

export const sourceOptions = [
  { value: 'hr_center', label: '人事中心' },
  { value: 'finance_center', label: '财务中心' },
  { value: 'tech_center', label: '技术中心' },
  { value: 'project_assets', label: '团队资产库' },
  { value: 'culture_lib', label: '企业文化库' }
]

export const stateOptions = [
  { value: 'latest', label: '最新有效' },
  { value: 'expiring', label: '即将过期' },
  { value: 'historical', label: '历史版本' },
  { value: 'draft', label: '草稿文档' }
]

export const smartTagOptions = [
  { value: 'newbie', label: '新人必看' },
  { value: 'hot', label: '高频访问' },
  { value: 'manager', label: '管理者常用' },
  { value: 'approval', label: '审批相关' },
  { value: 'risk', label: '风险提示' }
]

// ===== 空状态推荐 =====
export const emptySuggestions = ['试试搜索「报销」「请假」「入职」「权限」「福利」', '浏览知识包获取完整知识链', '查看热门检索词获取灵感']
