// ===================== AI 工作台 Mock 数据 =====================

// ---------- 类型定义 ----------
export interface KnowledgeCategory {
  id: number
  name: string
  count: number
  status: '热门' | '最近更新' | '推荐' | '高价值' | '新人必看' | '核心'
  statusColor: string
  icon: string
}

export interface TodayFAQ {
  id: number
  question: string
  count: number
  trend: 'up' | 'down' | 'stable'
}

export interface KnowledgePathStep {
  id: number
  name: string
  done: boolean
}

export interface KnowledgeCapsule {
  label: string
  color: string
}

export interface ChatStep {
  label: string
  desc: string
}

export interface AnswerStep {
  num: string
  title: string
  desc: string
}

export interface NextAction {
  label: string
  icon: string
}

export type ChatStatus = 'idle' | 'recording' | 'uploading' | 'thinking' | 'generating' | 'error'

export type ReasoningMode = 'fast' | 'deep' | 'detailed' | 'chat'

export interface ChatImage {
  id: string
  name: string
  url: string
}

export interface ChatSendPayload {
  content: string
  images: ChatImage[]
  reasoningMode: ReasoningMode
}

export interface ChatSource {
  id: number
  title: string
  path: string
  type: 'DOCX' | 'PDF' | 'XLSX' | 'MD' | 'IMAGE'
  confidence: number
}

export interface ChatCard {
  id: number
  role: 'user' | 'assistant'
  content: string
  time: string
  images?: ChatImage[]
  reasoningMode?: ReasoningMode
  // assistant only
  conclusion?: string
  reasoning?: string[]
  reasoningTimeline?: string[]
  steps?: AnswerStep[]
  flowNodes?: string[]
  sourcePath?: string
  sources?: ChatSource[]
  confidence?: number
  nextActions?: NextAction[]
  docCount?: number
  permissionChecked?: boolean
  feedback?: 'like' | 'dislike'
}

export interface EvidenceItem {
  id: number
  type: 'DOCX' | 'PDF' | 'XLSX' | 'MD'
  title: string
  section: string
  confidence: number
}

export interface RelatedDoc {
  id: number
  title: string
  type: string
  category: string
  date: string
}

export interface QuickAction {
  title: string
  icon: string
  desc: string
}

export interface RadarStat {
  label: string
  value: string
  icon: string
  color: string
}

export interface DeepSearchStep {
  label: string
  status: 'done' | 'active' | 'pending'
}

// ---------- 左侧：知识星图导航 ----------

export const knowledgeCategories: KnowledgeCategory[] = [
  { id: 1, name: '今日常问', count: 86, status: '热门', statusColor: '#ef4444', icon: 'ChatLineRound' },
  { id: 2, name: '新人入职', count: 128, status: '新人必看', statusColor: '#f59e0b', icon: 'User' },
  { id: 3, name: '制度流程', count: 54, status: '最近更新', statusColor: '#2563eb', icon: 'Tickets' },
  { id: 4, name: '项目资产', count: 192, status: '推荐', statusColor: '#8b5cf6', icon: 'Briefcase' },
  { id: 5, name: '员工手册', count: 36, status: '核心', statusColor: '#0ea5e9', icon: 'Notebook' },
  { id: 6, name: '福利政策', count: 28, status: '高价值', statusColor: '#22c55e', icon: 'Present' },
  { id: 7, name: '技术文档', count: 342, status: '高价值', statusColor: '#22c55e', icon: 'Cpu' },
  { id: 8, name: '常见问题', count: 75, status: '热门', statusColor: '#ef4444', icon: 'QuestionFilled' }
]

export const todayFAQs: TodayFAQ[] = [
  { id: 1, question: '新员工入职流程是怎样的？', count: 32, trend: 'up' },
  { id: 2, question: '差旅报销标准和材料要求', count: 28, trend: 'up' },
  { id: 3, question: '如何申请年假？', count: 21, trend: 'stable' },
  { id: 4, question: '项目文档在哪里查找？', count: 18, trend: 'down' },
  { id: 5, question: '系统权限怎么申请？', count: 15, trend: 'up' }
]

export const knowledgePathSteps: KnowledgePathStep[] = [
  { id: 1, name: '新人入职流程', done: true },
  { id: 2, name: '行政报销制度', done: true },
  { id: 3, name: '固定资产申请', done: false },
  { id: 4, name: '请假审批规范', done: false }
]

export const knowledgeCapsules: KnowledgeCapsule[] = [
  { label: '入职', color: '#2563eb' },
  { label: '报销', color: '#22c55e' },
  { label: '请假', color: '#f59e0b' },
  { label: '项目交接', color: '#8b5cf6' },
  { label: '权限申请', color: '#0ea5e9' },
  { label: '福利', color: '#ef4444' },
  { label: '流程', color: '#14b8a6' },
  { label: '考勤', color: '#f97316' }
]

// ---------- 中间：AI 问答区 ----------

export const statusBarData = {
  totalDocs: 1258,
  todayUpdated: 28,
  confidence: 96,
  permissionChecked: true
}

export const quickScenes = ['新员工入职指引', '报销制度', '项目交接', '请假流程', '福利政策']

export const chatHistory: ChatCard[] = [
  {
    id: 1,
    role: 'user',
    content: '新员工入职流程是怎样的？',
    time: '10:23'
  },
  {
    id: 2,
    role: 'assistant',
    content: '新员工入职流程主要分为 5 个阶段，以下是详细说明：',
    time: '10:23',
    conclusion: '入职办理应先完成材料准备和合同签署，再开通系统账号、参加培训，最后进入试用期评估。',
    reasoning: ['识别为 HR 制度查询', '匹配员工手册与 HR FAQ', '按流程顺序合并结论'],
    steps: [
      { num: '01', title: '录用通知', desc: 'HR 发送录用通知，确认入职时间和岗位信息。' },
      { num: '02', title: '入职准备', desc: '准备身份证、银行卡、学历证明等材料。' },
      { num: '03', title: '入职办理', desc: '签署劳动合同，开通系统账号，领取办公设备。' },
      { num: '04', title: '入职培训', desc: '参加公司制度、部门业务和安全培训。' },
      { num: '05', title: '试用评估', desc: '试用期结束前由直属负责人完成评估。' }
    ],
    flowNodes: ['录用通知', '入职准备', '入职办理', '入职培训', '试用评估'],
    sourcePath: '员工手册 > 入职管理 > 新员工入职流程',
    confidence: 98,
    docCount: 3,
    permissionChecked: true,
    nextActions: [
      { label: '查看原文', icon: 'View' },
      { label: '生成摘要', icon: 'Memo' },
      { label: '生成流程图', icon: 'Share' },
      { label: '创建待办', icon: 'Finished' },
      { label: '转成通知', icon: 'Bell' }
    ]
  },
  {
    id: 3,
    role: 'user',
    content: '差旅报销的标准是什么？需要哪些材料？',
    time: '10:27'
  },
  {
    id: 4,
    role: 'assistant',
    content: '差旅报销标准及材料要求如下：',
    time: '10:27',
    conclusion: '差旅报销需要同时满足费用标准、审批单据和真实发票三类要求，超标准费用应先完成事前审批。',
    reasoning: ['识别为财务制度查询', '优先引用最新报销管理规定', '按费用类型拆分材料要求'],
    steps: [
      { num: '01', title: '交通费标准', desc: '经济舱/高铁二等座，超标需提前审批。' },
      { num: '02', title: '住宿费标准', desc: '一线城市 ≤ 500 元/晚，其他城市 ≤ 350 元/晚。' },
      { num: '03', title: '餐补标准', desc: '每日 120 元，按实际出差天数计算。' },
      { num: '04', title: '所需材料', desc: '发票、行程单、住宿明细、费用报销单、审批单。' }
    ],
    flowNodes: ['填写报销单', '部门审批', '财务审核', '打款到账'],
    sourcePath: '财务制度 > 费用报销管理 > 差旅费报销规定',
    confidence: 96,
    docCount: 2,
    permissionChecked: true,
    nextActions: [
      { label: '查看原文', icon: 'View' },
      { label: '生成摘要', icon: 'Memo' },
      { label: '生成流程图', icon: 'Share' },
      { label: '创建待办', icon: 'Finished' }
    ]
  }
]

// ---------- 右侧：证据与行动面板 ----------

export const radarStats: RadarStat[] = [
  { label: '知识命中率', value: '96%', icon: 'Aim', color: '#2563eb' },
  { label: '引用文档', value: '3 份', icon: 'Document', color: '#8b5cf6' },
  { label: '相关知识', value: '12 条', icon: 'Connection', color: '#22c55e' },
  { label: '权限校验', value: '已通过', icon: 'CircleCheckFilled', color: '#0ea5e9' }
]

export const evidenceChain: EvidenceItem[] = [
  { id: 1, type: 'DOCX', title: '新员工入职管理制度', section: '员工手册 > 入职管理 > 第3章', confidence: 98 },
  { id: 2, type: 'PDF', title: '项目文档管理规范', section: '项目管理 > 文档归档 > 第2.1条', confidence: 95 },
  { id: 3, type: 'DOCX', title: '差旅费报销管理规定', section: '财务制度 > 费用报销 > 第4条', confidence: 96 },
  { id: 4, type: 'MD', title: 'HR 常见问题手册', section: '入职相关 > 第12条', confidence: 90 }
]

export const quickActions: QuickAction[] = [
  { title: '上传文档', icon: 'UploadFilled', desc: '补充新的知识来源' },
  { title: '加入知识库', icon: 'Collection', desc: '沉淀当前回答' },
  { title: '生成摘要', icon: 'Memo', desc: '提炼问答要点' },
  { title: '创建文档', icon: 'DocumentAdd', desc: '转成规范文档' },
  { title: '创建待办', icon: 'Finished', desc: '同步办理事项' }
]

export const relatedDocs: RelatedDoc[] = [
  { id: 1, title: '新员工入职指引手册.pdf', type: 'PDF', category: '员工手册', date: '2024-05-10' },
  { id: 2, title: '员工试用期管理办法.docx', type: 'DOCX', category: '人事制度', date: '2024-04-28' },
  { id: 3, title: '差旅费报销标准.docx', type: 'DOCX', category: '财务制度', date: '2024-05-08' },
  { id: 4, title: '公司组织架构图.vsdx', type: 'VSDX', category: '行政制度', date: '2024-04-20' }
]

// ---------- 深度检索步骤 ----------

export const deepSearchSteps: DeepSearchStep[] = [
  { label: '正在检索制度文档...', status: 'done' },
  { label: '正在匹配项目文档...', status: 'active' },
  { label: '正在分析引用可信度...', status: 'pending' },
  { label: '正在生成答案...', status: 'pending' }
]

export const reasoningModeOptions: Array<{ label: string; value: ReasoningMode }> = [
  { label: '快速回答', value: 'fast' },
  { label: '深度思考', value: 'deep' },
  { label: '详细推理', value: 'detailed' },
  { label: '聊天推理', value: 'chat' }
]

// ---------- 新人引导 ----------

export const newUserGuide = {
  name: '张伟',
  department: '行政部',
  isNewEmployee: true,
  recommendations: [
    '公司制度总览',
    '新人入职流程',
    '报销规范',
    '考勤制度',
    '部门知识库'
  ]
}

// ---------- 模拟 AI 回答生成 ----------

function createSources(hasImage: boolean): ChatSource[] {
  const sources: ChatSource[] = [
    {
      id: 1,
      title: '员工手册与制度问答库',
      path: '企业知识库 > 员工手册 > 最新版本',
      type: 'DOCX',
      confidence: 96
    },
    {
      id: 2,
      title: '流程规范索引',
      path: '企业知识库 > 制度流程 > 流程总览',
      type: 'PDF',
      confidence: 92
    }
  ]

  if (hasImage) {
    sources.unshift({
      id: 99,
      title: '上传图片视觉识别结果',
      path: '本轮会话 > 图片内容解析',
      type: 'IMAGE',
      confidence: 89
    })
  }

  return sources
}

function createReasoningTimeline(question: string, mode: ReasoningMode, hasImage: boolean) {
  const modeLabel = reasoningModeOptions.find((item) => item.value === mode)?.label ?? '聊天推理'
  return [
    `使用「${modeLabel}」理解问题意图：${question || '图片内容问答'}`,
    hasImage ? '先识别上传图片中的文字、布局和关键对象，再合并文本问题。' : '抽取制度、流程、人员、时间等关键实体。',
    '在企业知识库中检索相似制度条款、流程说明和历史问答。',
    '对候选来源做权限校验和可信度排序，过滤低相关内容。',
    '把结论、步骤和引用来源拆开呈现，避免推理内容盖过正式答案。'
  ]
}

function withCommonAnswer(card: ChatCard, question: string, reasoningMode: ReasoningMode, hasImage: boolean): ChatCard {
  return {
    ...card,
    reasoningMode,
    reasoningTimeline: createReasoningTimeline(question, reasoningMode, hasImage),
    sources: createSources(hasImage),
    content: hasImage
      ? `${card.content}\n\n> 已结合上传图片进行识别，图片内容会作为本轮问题的补充上下文。\n\n${card.conclusion ? `**核心结论：** ${card.conclusion}` : ''}`
      : card.content
  }
}

export function generateAIAnswer(
  question: string,
  options: { reasoningMode?: ReasoningMode; images?: ChatImage[] } = {}
): ChatCard {
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const q = question.toLowerCase()
  const reasoningMode = options.reasoningMode ?? 'chat'
  const hasImage = Boolean(options.images?.length)

  if (q.includes('请假') || q.includes('年假')) {
    return withCommonAnswer({
      id: Date.now(),
      role: 'assistant',
      content: '关于请假制度，以下是关键要点：\n\n- 年假、病假、事假适用不同审批规则\n- 长假需要更早提交并补齐证明材料\n- 请假记录会同步到考勤系统',
      time,
      conclusion: '请假应通过 OA 系统提前提交，年假、病假和长假分别适用不同材料与审批时限。',
      reasoning: ['识别为考勤制度查询', '匹配请假制度与审批规范', '按假期类型抽取关键差异'],
      steps: [
        { num: '01', title: '年假天数', desc: '工龄 1-10 年享 5 天，10-20 年享 10 天，20 年以上享 15 天。' },
        { num: '02', title: '申请方式', desc: '通过 OA 系统提交请假申请，直属领导审批。' },
        { num: '03', title: '提前天数', desc: '1 天以内提前 1 天申请，3 天以上提前 1 周申请。' },
        { num: '04', title: '病假说明', desc: '需提供医院证明，病假工资按基本工资 80% 发放。' }
      ],
      flowNodes: ['提交申请', '直属审批', 'HR 备案', '假期生效'],
      sourcePath: '员工手册 > 考勤管理 > 请假制度',
      confidence: 95,
      docCount: 2,
      permissionChecked: true,
      nextActions: [
        { label: '查看原文', icon: 'View' },
        { label: '生成摘要', icon: 'Memo' },
        { label: '生成流程图', icon: 'Share' },
        { label: '创建待办', icon: 'Finished' }
      ]
    }, question, reasoningMode, hasImage)
  }

  if (q.includes('报销') || q.includes('差旅')) {
    return withCommonAnswer({
      id: Date.now(),
      role: 'assistant',
      content: '关于报销流程，以下是详细说明：\n\n| 事项 | 要求 |\n| --- | --- |\n| 交通 | 经济舱 / 高铁二等座，超标需事前审批 |\n| 住宿 | 按城市等级执行上限 |\n| 材料 | 发票、行程单、费用报销单、审批记录 |\n\n```text\n报销单 -> 部门审批 -> 财务审核 -> 打款到账\n```',
      time,
      conclusion: '报销流程以 OA 报销单为主线，材料完整、标准合规后进入财务审核和打款。',
      reasoning: ['识别为财务流程查询', '匹配报销制度和费用标准', '提取办理顺序与材料要求'],
      steps: [
        { num: '01', title: '填写报销单', desc: '在 OA 系统填写电子报销单，上传发票和相关材料。' },
        { num: '02', title: '部门审批', desc: '直属领导审核报销内容的合理性和金额。' },
        { num: '03', title: '财务审核', desc: '财务部核对发票真伪和报销标准。' },
        { num: '04', title: '打款到账', desc: '审核通过后 5-7 个工作日打款至工资卡。' }
      ],
      flowNodes: ['填写报销单', '部门审批', '财务审核', '打款到账'],
      sourcePath: '财务制度 > 费用报销管理 > 报销流程',
      confidence: 97,
      docCount: 3,
      permissionChecked: true,
      nextActions: [
        { label: '查看原文', icon: 'View' },
        { label: '生成摘要', icon: 'Memo' },
        { label: '生成流程图', icon: 'Share' },
        { label: '创建待办', icon: 'Finished' }
      ]
    }, question, reasoningMode, hasImage)
  }

  if (q.includes('权限') || q.includes('系统')) {
    return withCommonAnswer({
      id: Date.now(),
      role: 'assistant',
      content: '系统权限申请流程如下：\n\n1. 在 IT 服务台提交权限申请。\n2. 写清楚业务用途、系统名称和有效期。\n3. 直属领导审批后由 IT 开通。\n4. 权限开通后会进入定期复核。',
      time,
      conclusion: '权限申请需要说明业务用途，经直属领导审批后由 IT 在 1-2 个工作日内开通。',
      reasoning: ['识别为 IT 服务流程', '校验权限申请规范', '按责任角色整理步骤'],
      steps: [
        { num: '01', title: '提交申请', desc: '在 IT 服务台提交权限申请工单，说明申请原因。' },
        { num: '02', title: '领导审批', desc: '直属领导审批申请合理性。' },
        { num: '03', title: 'IT 开通', desc: 'IT 部门在 1-2 个工作日内开通权限。' }
      ],
      flowNodes: ['提交申请', '领导审批', 'IT 开通', '权限复核'],
      sourcePath: '行政制度 > IT 管理 > 权限申请流程',
      confidence: 93,
      docCount: 1,
      permissionChecked: true,
      nextActions: [
        { label: '查看原文', icon: 'View' },
        { label: '生成摘要', icon: 'Memo' },
        { label: '创建待办', icon: 'Finished' }
      ]
    }, question, reasoningMode, hasImage)
  }

  // 默认通用回答
  return withCommonAnswer({
    id: Date.now(),
    role: 'assistant',
    content: hasImage
      ? '我已读取你上传的图片，并结合企业知识库整理出以下可追溯回答：\n\n- 先识别图片中的文字、对象和版式线索。\n- 再把图片信息与你的问题合并检索。\n- 最后输出结论、依据和可继续追问的方向。'
      : '根据知识库为你整理了以下信息：\n\n> 以下回答来自企业知识库模拟检索结果，正式接入接口后会替换为真实知识召回。\n\n- 已定位相关制度内容\n- 已完成引用权限校验\n- 已按办公场景整理为可执行建议',
    time,
    conclusion: '已从企业知识库中定位到相关内容，并按检索、匹配、结论生成三个阶段整理为可追溯回答。',
    reasoning: ['抽取问题关键词', '匹配知识片段', '校验引用权限'],
    steps: [
      { num: '01', title: '信息检索', desc: '已从 1,258 篇企业文档中检索到相关内容。' },
      { num: '02', title: '内容匹配', desc: '根据你的问题匹配到最相关的知识条目。' },
      { num: '03', title: '结论生成', desc: '基于匹配文档生成结构化回答，包含引用来源。' }
    ],
    flowNodes: ['检索文档', '匹配片段', '引用校验', '生成结论'],
    sourcePath: '企业知识库 > 综合检索',
    confidence: 90,
    docCount: 2,
    permissionChecked: true,
    nextActions: [
      { label: '查看原文', icon: 'View' },
      { label: '生成摘要', icon: 'Memo' },
      { label: '生成流程图', icon: 'Share' },
      { label: '继续追问', icon: 'ChatDotRound' }
    ]
  }, question, reasoningMode, hasImage)
}

// 后续接真实接口时，优先替换以下三个 mock 方法。
export function mockSpeechToText(duration: number): Promise<string> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(duration > 3 ? '请帮我根据这张图片分析相关制度要求' : '帮我查询一下企业知识库里的相关流程')
    }, 720)
  })
}

export function mockUploadImage(file: File, previewUrl?: string): Promise<ChatImage> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('仅支持上传图片'))
        return
      }

      if (file.size > 8 * 1024 * 1024) {
        reject(new Error('图片不能超过 8MB'))
        return
      }

      resolve({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name || '粘贴图片',
        url: previewUrl || URL.createObjectURL(file)
      })
    }, 900 + Math.random() * 700)
  })
}

// ---------- 向后兼容旧子组件导出 ----------
export type QuickActionItem = QuickAction
export type RelatedDocument = RelatedDoc

export interface RecentUpdate {
  id: number
  title: string
  type: string
  author: string
  time: string
}
