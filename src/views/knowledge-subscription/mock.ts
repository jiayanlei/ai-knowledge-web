// ============================================================
// 知识订阅 Mock 数据
// ============================================================

/* ---------- 类型定义 ---------- */

export interface SubscriptionStats {
  subscribedTopics: number
  weeklyUpdates: number
  importantChanges: number
  pendingConfirm: number
}

export interface Subscription {
  id: string
  name: string
  type: string
  status: string
  statusType: 'warning' | 'danger' | 'success' | 'info'
  description: string
  impact: string
  impactLevel: 'high' | 'medium' | 'low'
  heat: number
}

export interface FeedItem {
  id: string
  time: string
  timeLabel: string
  type: string
  title: string
  aiInsight: string
  relatedKnowledge: string[]
  impactLevel: 'high' | 'medium' | 'low'
  isRead: boolean
  actions: string[]
  beforeContent: string
  afterContent: string
  aiSummary: string
  impactScope: string[]
  relatedDocs: string[]
}

export interface RecommendSubscription {
  id: string
  name: string
  reason: string
  subscribed: boolean
}

export interface WeeklySummary {
  title: string
  content: string
  highlights: { text: string; level: 'high' | 'medium' | 'low' }[]
  totalChanges: number
  relatedDepartmentCount: number
}

/* ---------- Mock 数据 ---------- */

export function getSubscriptionStatsMock(): SubscriptionStats {
  return {
    subscribedTopics: 12,
    weeklyUpdates: 28,
    importantChanges: 5,
    pendingConfirm: 3
  }
}

export function getMySubscriptionsMock(): Subscription[] {
  return [
    {
      id: 'sub-001',
      name: '报销制度',
      type: '制度流程',
      status: '有更新',
      statusType: 'warning',
      description: '差旅报销附件要求已调整，新增电子发票与审批截图要求',
      impact: '与你的日常报销相关',
      impactLevel: 'high',
      heat: 85
    },
    {
      id: 'sub-002',
      name: '项目交接文档',
      type: '项目资产',
      status: '新增内容',
      statusType: 'success',
      description: '新增"上线前检查清单"，涵盖前后端、测试、运维检查项',
      impact: '影响项目交付流程',
      impactLevel: 'medium',
      heat: 60
    },
    {
      id: 'sub-003',
      name: '技术规范',
      type: '研发标准',
      status: '重要变更',
      statusType: 'danger',
      description: '接口命名规范和错误码规范已更新，统一新格式要求',
      impact: '影响前后端联调',
      impactLevel: 'high',
      heat: 90
    },
    {
      id: 'sub-004',
      name: '考勤规则',
      type: '员工制度',
      status: '正常',
      statusType: 'info',
      description: '暂无重要变化，当前规则保持稳定',
      impact: '低',
      impactLevel: 'low',
      heat: 15
    },
    {
      id: 'sub-005',
      name: '部门知识动态',
      type: '部门动态',
      status: '有更新',
      statusType: 'warning',
      description: '本周新增 4 篇部门经验沉淀，涵盖客服高频问题处理',
      impact: '建议浏览',
      impactLevel: 'medium',
      heat: 55
    }
  ]
}

export function getChangeFeedsMock(): FeedItem[] {
  return [
    {
      id: 'feed-001',
      time: '今天 09:30',
      timeLabel: '今天',
      type: '重要制度变更',
      title: '报销制度更新了附件上传要求',
      aiInsight: '这次变更会影响差旅报销和费用报销流程，提交报销前需要补充电子发票和审批截图。建议尽快了解新的附件规范，避免报销被退回。',
      relatedKnowledge: ['财务制度', '报销流程', '差旅规范'],
      impactLevel: 'high',
      isRead: false,
      actions: ['查看详情', '标记已读'],
      beforeContent: '差旅报销仅需上传纸质发票照片作为附件，审批截图为可选项。',
      afterContent: '差旅报销需同时上传电子发票（PDF 格式）和审批流程截图，纸质发票照片不再作为唯一凭证。',
      aiSummary: '此次变更的核心目的是规范报销材料、减少财务审核争议。电子发票和审批截图成为必填项，纸质发票照片仅作为补充材料。',
      impactScope: ['全体员工', '财务部', '经常出差人员'],
      relatedDocs: ['《差旅报销管理办法 v3.2》', '《费用报销操作指南》', '《电子发票使用规范》']
    },
    {
      id: 'feed-002',
      time: '今天 11:10',
      timeLabel: '今天',
      type: '项目文档新增',
      title: '项目交接文档新增上线前检查清单',
      aiInsight: '该内容适合项目负责人、前端、后端、测试人员查看，可减少上线遗漏。建议项目相关人员收藏备用。',
      relatedKnowledge: ['项目资产', '交接文档', '上线流程'],
      impactLevel: 'medium',
      isRead: false,
      actions: ['查看详情', '加入收藏'],
      beforeContent: '项目交接文档仅包含项目概述、技术架构说明和人员分工。',
      afterContent: '新增"上线前检查清单"模块，涵盖前端构建检查、后端接口验证、数据库迁移确认、监控告警配置等 16 项检查内容。',
      aiSummary: '新增的检查清单基于历史上线事故总结，覆盖了最常见的遗漏点。该清单可作为项目上线的标准流程参考。',
      impactScope: ['项目负责人', '前端开发', '后端开发', '测试人员'],
      relatedDocs: ['《项目交接文档模板 v2.0》', '《上线流程规范》', '《项目复盘案例集》']
    },
    {
      id: 'feed-003',
      time: '昨天 16:20',
      timeLabel: '昨天',
      type: '技术规范调整',
      title: '接口错误码规范已更新',
      aiInsight: '后续接口联调建议统一使用新的错误码结构，避免前端异常提示不一致。已有项目建议逐步迁移。',
      relatedKnowledge: ['技术规范', '接口规范', '前后端联调'],
      impactLevel: 'high',
      isRead: false,
      actions: ['查看详情', '通知团队'],
      beforeContent: '错误码采用 4 位数字格式（如 1001、2003），按模块分段分配，前端需自行映射错误提示文案。',
      afterContent: '错误码升级为"模块前缀 + 类型标识 + 序号"结构（如 USR_AUTH_001），每条错误码自带标准提示文案和多语言 key，前端统一使用 i18n 映射。',
      aiSummary: '新规范解决了旧错误码命名混乱、提示文案不统一的问题。前后端需协同升级，建议新项目直接使用新规范，老项目逐步迁移。',
      impactScope: ['前端开发', '后端开发', '技术负责人'],
      relatedDocs: ['《接口设计规范 v4.0》', '《错误码对照表》', '《前后端联调指南》']
    },
    {
      id: 'feed-004',
      time: '本周一 10:00',
      timeLabel: '本周一',
      type: '部门动态',
      title: '客服部门新增 4 条高频问题处理经验',
      aiInsight: '这些内容适合新人学习，也可以补充到 AI 问答知识源中。建议浏览后决定是否纳入培训材料。',
      relatedKnowledge: ['部门经验', '客服知识', '新人培训'],
      impactLevel: 'low',
      isRead: true,
      actions: ['查看详情', '生成摘要'],
      beforeContent: '客服知识库中包含基础FAQ 32条，缺少复杂场景的处理经验。',
      afterContent: '新增 4 条高频问题处理经验：1）客户投诉升级处理流程；2）退款争议协商技巧；3）系统故障时的应急话术；4）跨部门协作催单方法。',
      aiSummary: '这些经验来自客服团队的月度复盘，内容实用性强。建议新人入职时重点学习，也可作为 AI 知识库的补充材料。',
      impactScope: ['客服部门', '新人员工', '培训负责人'],
      relatedDocs: ['《客服知识库 v5.1》', '《新人培训手册》', '《客服月度复盘报告》']
    }
  ]
}

export function getRecommendSubscriptionsMock(): RecommendSubscription[] {
  return [
    { id: 'rec-001', name: '接口规范', reason: '你近期频繁查阅接口相关文档', subscribed: false },
    { id: 'rec-002', name: '上线流程', reason: '你参与了 2 个即将上线的项目', subscribed: false },
    { id: 'rec-003', name: '项目复盘', reason: '你的团队近期完成了 3 个项目交付', subscribed: false },
    { id: 'rec-004', name: '部门知识动态', reason: '你所在部门本周有较多知识更新', subscribed: false }
  ]
}

export function getWeeklySummaryMock(): WeeklySummary {
  return {
    title: 'AI 每周摘要',
    content: 'AI 已为你整理本周知识变化：报销制度更新 2 处，项目交接规范新增 1 条，技术规范调整 3 项。其中 2 条与你所在部门强相关，建议优先查看。',
    highlights: [
      { text: '报销制度附件要求升级，电子发票成为必填项', level: 'high' },
      { text: '接口错误码规范全面升级，前后端需协同迁移', level: 'high' },
      { text: '项目交接文档新增上线检查清单（16 项）', level: 'medium' },
      { text: '客服部门沉淀 4 条高频问题处理经验', level: 'low' }
    ],
    totalChanges: 28,
    relatedDepartmentCount: 4
  }
}
