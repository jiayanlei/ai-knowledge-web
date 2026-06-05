// ===== 数据概览 =====

export interface OverviewMetrics {
  cultureContent: number
  newHireReading: number
  cultureStories: number
  monthlyEvents: number
}

export function getOverviewMetricsMock(): OverviewMetrics {
  return {
    cultureContent: 86,
    newHireReading: 24,
    cultureStories: 18,
    monthlyEvents: 5
  }
}

// ===== 文化总览 =====

export interface CultureOverview {
  companyName: string
  theme: string
  mission: string
  vision: string
  values: string[]
  slogan: string
  owner: string
  lastUpdate: string
}

export function getCultureOverviewMock(): CultureOverview {
  return {
    companyName: '智联未来科技有限公司',
    theme: '让知识流动，让协作更简单',
    mission: '用 AI 提升企业知识传递效率',
    vision: '成为企业内部知识管理和员工成长的智能助手',
    values: ['客户第一', '长期主义', '主动协作', '持续学习', '结果导向'],
    slogan: '每一次沉淀，都是下一次高效协作的开始',
    owner: '企业文化小组',
    lastUpdate: '2026-06-05'
  }
}

// ===== 使命愿景 =====

export interface MissionVision {
  mission: string
  vision: string
  philosophy: string
  longTermGoal: string
}

export function getMissionVisionMock(): MissionVision {
  return {
    mission: '用 AI 帮助企业沉淀知识、传递经验、提升协作效率',
    vision: '让每一位员工都能快速找到答案、理解组织、融入团队',
    philosophy: '以客户问题为中心，以知识沉淀为基础，以持续优化为目标',
    longTermGoal: '建设可持续增长的企业知识资产体系'
  }
}

// ===== 核心价值观 =====

export interface CoreValue {
  id: string
  name: string
  description: string
  behaviors: string[]
  color: string
  softColor: string
  icon: string
}

export function getCoreValuesMock(): CoreValue[] {
  return [
    {
      id: 'v1',
      name: '客户第一',
      description: '主动理解客户问题，优先解决真实业务痛点',
      behaviors: ['关注用户反馈', '及时响应问题', '持续优化体验'],
      color: '#6366f1',
      softColor: '#eef2ff',
      icon: 'User'
    },
    {
      id: 'v2',
      name: '长期主义',
      description: '不只追求短期交付，更重视系统可维护性和知识沉淀',
      behaviors: ['补充文档', '复盘问题', '沉淀经验'],
      color: '#10b981',
      softColor: '#ecfdf5',
      icon: 'Timer'
    },
    {
      id: 'v3',
      name: '主动协作',
      description: '遇到问题主动沟通，减少信息差，提升团队效率',
      behaviors: ['同步风险', '及时沟通', '共享资料'],
      color: '#f59e0b',
      softColor: '#fffbeb',
      icon: 'Connection'
    },
    {
      id: 'v4',
      name: '持续学习',
      description: '鼓励复盘、总结、分享，把个人经验沉淀为团队资产',
      behaviors: ['输出知识点', '参加分享', '优化旧文档'],
      color: '#3b82f6',
      softColor: '#eff6ff',
      icon: 'Reading'
    },
    {
      id: 'v5',
      name: '结果导向',
      description: '关注最终结果，不只停留在过程和形式',
      behaviors: ['明确目标', '推动落地', '跟踪效果'],
      color: '#ef4444',
      softColor: '#fef2f2',
      icon: 'TrendCharts'
    }
  ]
}

// ===== 行为准则 =====

export interface Guideline {
  id: string
  category: string
  icon: string
  rules: string[]
}

export function getGuidelinesMock(): Guideline[] {
  return [
    {
      id: 'g1',
      category: '沟通准则',
      icon: 'ChatDotRound',
      rules: [
        '重要信息优先使用邮件或企业 IM 书面传达，避免仅口头告知',
        '跨部门沟通时主动同步背景信息，减少信息不对称',
        '对收到的消息在 2 小时内做出响应，复杂问题先回复预计处理时间'
      ]
    },
    {
      id: 'g2',
      category: '会议准则',
      icon: 'VideoCamera',
      rules: [
        '会议前必须发出议程，参会者需提前阅读相关材料',
        '会议中指定记录员，会后 24 小时内发出会议纪要',
        '控制会议时长不超过 60 分钟，超过需分段进行'
      ]
    },
    {
      id: 'g3',
      category: '文档准则',
      icon: 'Document',
      rules: [
        '所有技术文档统一使用 Markdown 格式，存入知识库管理',
        '文档需标注作者、更新日期和适用范围，过期文档定期清理',
        '关键决策文档需经至少一位同事审核后方可归档'
      ]
    },
    {
      id: 'g4',
      category: '协作准则',
      icon: 'Connection',
      rules: [
        '任务交接必须提供完整的上下文文档，禁止无文档交接',
        '使用统一的项目管理工具跟踪任务状态，保持信息透明',
        '遇到问题先自行排查并记录，再向同事求助时附上分析过程'
      ]
    },
    {
      id: 'g5',
      category: '安全准则',
      icon: 'Lock',
      rules: [
        '禁止将内部文档、代码、密钥上传至未授权的外部平台',
        '生产环境操作必须通过堡垒机，所有操作留有审计日志',
        '发现安全漏洞立即上报安全团队，不得私自公开漏洞细节'
      ]
    }
  ]
}

// ===== 新人融入 =====

export interface OnboardingTask {
  title: string
  done: boolean
}

export interface OnboardingDay {
  day: number
  title: string
  tasks: OnboardingTask[]
}

export function getOnboardingMock(): OnboardingDay[] {
  return [
    {
      day: 1,
      title: '了解公司与团队',
      tasks: [
        { title: '阅读公司介绍和文化手册', done: true },
        { title: '认识直属上级和团队成员', done: true },
        { title: '了解部门职能和组织架构', done: true },
        { title: '配置企业邮箱和 IM 工具', done: true }
      ]
    },
    {
      day: 2,
      title: '了解制度与规范',
      tasks: [
        { title: '阅读员工手册和考勤制度', done: true },
        { title: '了解报销流程和审批链路', done: true },
        { title: '阅读信息安全和保密制度', done: true },
        { title: '熟悉办公环境和常用设施', done: true }
      ]
    },
    {
      day: 3,
      title: '了解团队项目',
      tasks: [
        { title: '阅读项目概览文档和架构图', done: true },
        { title: '了解当前迭代计划和目标', done: false },
        { title: '获取项目代码仓库和相关权限', done: true },
        { title: '参加项目组站会或周会', done: false }
      ]
    },
    {
      day: 4,
      title: '熟悉业务流程',
      tasks: [
        { title: '走通主要业务流程和操作路径', done: false },
        { title: '阅读业务需求文档和用户画像', done: false },
        { title: '体验公司产品核心功能', done: false },
        { title: '与产品经理进行 1v1 交流', done: false }
      ]
    },
    {
      day: 5,
      title: '参与小任务',
      tasks: [
        { title: '领取一个入门级任务（Bug 或小需求）', done: false },
        { title: '了解任务管理工具和工作流', done: false },
        { title: '完成代码提交或文档交付', done: false }
      ]
    },
    {
      day: 6,
      title: '复盘与反馈',
      tasks: [
        { title: '整理本周学习笔记和疑问清单', done: false },
        { title: '与导师进行 1v1 复盘交流', done: false },
        { title: '提交第一周融入反馈表', done: false },
        { title: '补充个人知识库学习笔记', done: false }
      ]
    },
    {
      day: 7,
      title: '正式融入团队',
      tasks: [
        { title: '参加团队周会并做简短自我介绍', done: false },
        { title: '确认第二周工作计划和目标', done: false },
        { title: '提交融入总结和后续学习计划', done: false }
      ]
    }
  ]
}

// ===== 文化故事 =====

export interface CultureStory {
  id: string
  title: string
  type: string
  keywords: string[]
  summary: string
  author: string
  date: string
}

export function getCultureStoriesMock(): CultureStory[] {
  return [
    {
      id: 'cs1',
      title: '一次故障复盘带来的知识库升级',
      type: '复盘成长',
      keywords: ['复盘', '沉淀', '协作', '长期主义'],
      summary: '去年一次线上数据库故障暴露了运维文档缺失的问题。团队在复盘后决定将所有故障处理流程沉淀到知识库，并建立了「故障复盘 → 知识补充 → 流程优化」的闭环机制。此后类似问题的平均处理时间下降了 60%。',
      author: '王建国',
      date: '2026-05-20'
    },
    {
      id: 'cs2',
      title: '从重复答疑到 AI 知识助手',
      type: '效率提升',
      keywords: ['效率', '知识沉淀', 'AI 助手'],
      summary: '技术负责人每天要回答大量重复性问题，占用了大量工作时间。团队将常见问题整理成知识库后接入 AI 助手，80% 的常规问题可以自动回答。技术负责人每周节省了约 5 小时的重复答疑时间，可以更专注于架构设计和技术决策。',
      author: '赵鹏飞',
      date: '2026-05-12'
    },
    {
      id: 'cs3',
      title: '一次新人交接文档的价值',
      type: '新人融入',
      keywords: ['交接', '团队资产', '新人融入'],
      summary: '新同事入职时，前一位同事已离职。幸运的是该同事留下了一份详尽的交接文档，包含项目背景、技术方案、踩坑记录和待办事项。新同事仅用一周就顺利接手了项目，避免了通常需要的 2-3 周磨合期。',
      author: '陈思雨',
      date: '2026-04-28'
    },
    {
      id: 'cs4',
      title: '把踩坑经验变成团队财富',
      type: '技术沉淀',
      keywords: ['复盘', '知识点', '经验复用'],
      summary: '一位资深工程师在项目中遇到了复杂的分布式事务问题，花了三天时间排查和解决。他将整个排查过程、根因分析和解决方案写成了详细的技术文档，沉淀到知识库后，其他团队在遇到类似问题时可以直接参考，避免了重复踩坑。',
      author: '刘浩然',
      date: '2026-04-15'
    }
  ]
}

// ===== 员工荣誉 =====

export interface HonorRecord {
  id: string
  name: string
  department: string
  title: string
  description: string
  badge: string
  color: string
}

export function getHonorRecordsMock(): HonorRecord[] {
  return [
    {
      id: 'h1',
      name: '张三',
      department: '技术研发部',
      title: '知识贡献之星',
      description: '本月贡献知识条目 42 篇，覆盖 K8s 运维、微服务架构等多个领域，知识库引用率最高。',
      badge: 'StarFilled',
      color: '#f59e0b'
    },
    {
      id: 'h2',
      name: '李四',
      department: '产品设计部',
      title: '最佳协作伙伴',
      description: '跨部门协作 12 次，主动同步项目进度和风险，获得 3 个部门的协作好评。',
      badge: 'Connection',
      color: '#6366f1'
    },
    {
      id: 'h3',
      name: '王五',
      department: '运维部',
      title: '问题终结者',
      description: '本月解决 P0 级线上问题 5 次，平均响应时间 8 分钟，全部完成复盘并沉淀为知识。',
      badge: 'CircleCheckFilled',
      color: '#10b981'
    },
    {
      id: 'h4',
      name: '赵六',
      department: '技术研发部',
      title: '新人导师之星',
      description: '本季度辅导 3 位新人顺利融入团队，编写新人指引文档 8 篇，新人满意度评分 4.9。',
      badge: 'UserFilled',
      color: '#3b82f6'
    },
    {
      id: 'h5',
      name: '陈七',
      department: '人力资源部',
      title: '文档守护者',
      description: '负责维护和更新 200+ 篇制度文档，确保文档准确率达到 98%，过期文档清理及时。',
      badge: 'DocumentChecked',
      color: '#8b5cf6'
    }
  ]
}

// ===== 团队活动 =====

export interface TeamEvent {
  id: string
  title: string
  type: string
  time: string
  location: string
  status: 'open' | 'upcoming' | 'full' | 'ended'
  description: string
}

export function getTeamEventsMock(): TeamEvent[] {
  return [
    {
      id: 'e1',
      title: '知识分享会',
      type: '学习成长',
      time: '2026-06-12 15:00',
      location: '三楼会议室 / 线上会议',
      status: 'open',
      description: '本月主题：微服务链路追踪最佳实践分享，由运维团队主讲。'
    },
    {
      id: 'e2',
      title: '新人欢迎会',
      type: '新人融入',
      time: '2026-06-18 16:00',
      location: '多功能会议室',
      status: 'upcoming',
      description: '欢迎 6 月入职新同事，包含团队介绍、破冰游戏和自由交流环节。'
    },
    {
      id: 'e3',
      title: '月度复盘会',
      type: '复盘改进',
      time: '2026-06-28 10:00',
      location: '研发会议室',
      status: 'open',
      description: '回顾本月项目交付情况，分析问题并制定下月改进计划。'
    }
  ]
}

// ===== 制度导航 =====

export interface Policy {
  id: string
  name: string
  owner: string
  updateTime: string
  scope: string
}

export interface PolicyCategory {
  id: string
  category: string
  icon: string
  policies: Policy[]
}

export function getPoliciesMock(): PolicyCategory[] {
  return [
    {
      id: 'pc1',
      category: '人事制度',
      icon: 'User',
      policies: [
        { id: 'p1', name: '员工考勤管理制度', owner: '人力资源部', updateTime: '2026-05-15', scope: '全员' },
        { id: 'p2', name: '薪酬福利管理办法', owner: '人力资源部', updateTime: '2026-04-20', scope: '全员' },
        { id: 'p3', name: '绩效考核实施细则', owner: '人力资源部', updateTime: '2026-05-01', scope: '全员' }
      ]
    },
    {
      id: 'pc2',
      category: '办公制度',
      icon: 'OfficeBuilding',
      policies: [
        { id: 'p4', name: '办公环境使用规范', owner: '行政部', updateTime: '2026-03-10', scope: '全员' },
        { id: 'p5', name: '会议室预订管理', owner: '行政部', updateTime: '2026-04-05', scope: '全员' },
        { id: 'p6', name: '差旅与报销制度', owner: '财务部', updateTime: '2026-05-20', scope: '全员' }
      ]
    },
    {
      id: 'pc3',
      category: '研发制度',
      icon: 'Monitor',
      policies: [
        { id: 'p7', name: '代码规范与审查流程', owner: '技术研发部', updateTime: '2026-05-28', scope: '研发人员' },
        { id: 'p8', name: '版本发布管理流程', owner: '技术研发部', updateTime: '2026-04-15', scope: '研发人员' },
        { id: 'p9', name: '技术文档编写规范', owner: '技术研发部', updateTime: '2026-05-10', scope: '研发人员' }
      ]
    },
    {
      id: 'pc4',
      category: '安全制度',
      icon: 'Lock',
      policies: [
        { id: 'p10', name: '信息安全管理办法', owner: '安全团队', updateTime: '2026-05-25', scope: '全员' },
        { id: 'p11', name: '数据分类与保护策略', owner: '安全团队', updateTime: '2026-04-30', scope: '全员' },
        { id: 'p12', name: '应急响应预案', owner: '安全团队', updateTime: '2026-05-18', scope: '运维/研发' }
      ]
    }
  ]
}

// ===== AI 文化助手 =====

export interface AiChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function getAiPresetQuestions(): string[] {
  return [
    '新人入职第一周应该做什么？',
    '公司价值观有哪些？',
    '请假流程在哪里？',
    '团队代码规范是什么？',
    '最近有哪些文化活动？',
    '我想了解公司安全制度'
  ]
}

export function getAiWelcomeMessage(): string {
  return '你好！我是 AI 文化助手，可以帮你了解企业文化、价值观、制度规范和团队活动。有什么问题尽管问我~'
}

const aiAnswerMap: Record<string, string> = {
  '新人入职第一周应该做什么？': '新人入职第一周建议按照「7 天融入路线」进行：\n\n第 1 天：了解公司与团队，配置邮箱和 IM 工具\n第 2 天：阅读员工手册和各项制度\n第 3 天：了解团队项目，获取代码仓库权限\n第 4 天：走通主要业务流程\n第 5 天：领取入门任务并完成交付\n第 6 天：复盘本周学习，与导师交流\n第 7 天：参加团队周会，正式融入\n\n详细的每日任务清单可以在「新人融入」板块查看。',
  '公司价值观有哪些？': '公司五大核心价值观：\n\n1. 客户第一 — 主动理解客户问题，优先解决真实业务痛点\n2. 长期主义 — 不只追求短期交付，更重视系统可维护性和知识沉淀\n3. 主动协作 — 遇到问题主动沟通，减少信息差，提升团队效率\n4. 持续学习 — 鼓励复盘、总结、分享，把个人经验沉淀为团队资产\n5. 结果导向 — 关注最终结果，不只停留在过程和形式',
  '请假流程在哪里？': '请假流程如下：\n\n1. 在 OA 系统提交请假申请，选择请假类型和日期\n2. 3 天以内由直属上级审批，3 天以上需部门经理加签\n3. 审批通过后自动同步考勤系统\n4. 病假需提供医院证明，事假需提前 1 天申请\n\n详细制度可在「制度导航 → 人事制度 → 员工考勤管理制度」中查看。',
  '团队代码规范是什么？': '公司代码规范要点：\n\n1. 统一使用 ESLint + Prettier 进行代码格式化\n2. 提交代码必须通过 Code Review，至少一位同事审核\n3. 函数和变量命名遵循语义化原则，禁止单字母变量\n4. 所有公共函数必须编写 JSDoc 注释\n5. 单元测试覆盖率不低于 80%\n\n完整规范见「制度导航 → 研发制度 → 代码规范与审查流程」。',
  '最近有哪些文化活动？': '近期文化活动安排：\n\n1. 知识分享会 — 6 月 12 日 15:00，三楼会议室，主题：微服务链路追踪最佳实践（可报名）\n2. 新人欢迎会 — 6 月 18 日 16:00，多功能会议室（未开始）\n3. 月度复盘会 — 6 月 28 日 10:00，研发会议室（可报名）\n\n可以在「团队活动」板块查看详细信息和报名。',
  '我想了解公司安全制度': '公司安全制度核心要点：\n\n1. 禁止将内部文档、代码、密钥上传至未授权的外部平台\n2. 生产环境操作必须通过堡垒机，所有操作留有审计日志\n3. 发现安全漏洞立即上报安全团队，不得私自公开漏洞细节\n4. 数据按敏感度分为公开、内部、机密、绝密四级，各级有不同的存储和传输要求\n\n完整制度可在「制度导航 → 安全制度」中查看。'
}

export function getAiAnswer(question: string): string {
  return aiAnswerMap[question] || `关于「${question}」，正在从知识库中检索相关内容。你可以尝试换个关键词，或联系企业文化小组获取更详细的信息。`
}

// ===== 文化热词 =====

export interface HotWord {
  word: string
  count: number
}

export function getHotWordsMock(): HotWord[] {
  return [
    { word: '知识沉淀', count: 36 },
    { word: '主动协作', count: 28 },
    { word: '复盘改进', count: 21 },
    { word: '新人融入', count: 18 },
    { word: 'AI 提效', count: 16 },
    { word: '文档规范', count: 12 }
  ]
}
