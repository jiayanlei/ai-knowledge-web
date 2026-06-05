// ===== 类型定义 =====

export interface QaReference {
  id: string
  docName: string
  category: string
  snippet: string
  similarity: number
}

export interface QaRecord {
  id: string
  question: string
  questioner: string
  employeeId: string
  department: string
  category: string
  hitKnowledge: boolean
  references: QaReference[]
  answer: string
  model: string
  responseTime: number
  tokens: number
  feedback: 'satisfied' | 'neutral' | 'unsatisfied' | 'none'
  feedbackContent: string
  feedbackTime: string
  qualityScore: number
  adminStatus: 'pending' | 'added_to_kb' | 'marked_invalid' | 'transferred' | 'ignored'
  adminNote: string
  askTime: string
}

// ===== 下拉选项 =====

export const departmentOptions = [
  '技术研发部', '产品设计部', '市场营销部', '人力资源部', '财务部', '运维部', '销售部', '行政部'
]

export const categoryOptions = [
  '产品使用', '技术规范', '流程制度', '故障排查', '业务知识', '培训学习', '其他'
]

export const modelOptions = [
  'GPT-4o', 'GPT-4o-mini', 'Claude-3.5-Sonnet', 'Qwen-Max', 'DeepSeek-V3'
]

export const feedbackStatusOptions = [
  { value: 'satisfied', label: '满意' },
  { value: 'neutral', label: '一般' },
  { value: 'unsatisfied', label: '不满意' },
  { value: 'none', label: '未反馈' }
]

export const hitStatusOptions = [
  { value: 'hit', label: '已命中' },
  { value: 'miss', label: '未命中' }
]

export const knowledgeCategoryOptions = [
  '产品手册', '技术规范', '操作指南', 'FAQ', '流程制度', '培训资料', '故障案例'
]

// ===== Mock 数据工厂 =====

export function getQaRecordsMock(): QaRecord[] {
  return [
    {
      id: 'QA-20260601-001',
      question: '如何配置 Kubernetes 集群的水平自动扩缩容（HPA）？',
      questioner: '张明辉',
      employeeId: 'EMP-1042',
      department: '技术研发部',
      category: '技术规范',
      hitKnowledge: true,
      references: [
        { id: 'R1', docName: 'K8s 运维手册 v3.2', category: '技术规范', snippet: 'HPA 通过监控指标服务器（metrics-server）提供的 CPU/内存指标，自动调整 Deployment 的副本数…', similarity: 0.94 },
        { id: 'R2', docName: '容器化部署最佳实践', category: '操作指南', snippet: '配置 HPA 时需确保 metrics-server 已正确安装，建议设置 minReplicas 不低于 2 以保证高可用…', similarity: 0.87 }
      ],
      answer: '配置 Kubernetes HPA 需要以下步骤：\n\n1. 确保 metrics-server 已安装并正常运行\n2. 为 Deployment 设置资源请求（requests）和限制（limits）\n3. 创建 HPA 资源对象，指定目标 CPU 利用率和副本数范围\n\n示例命令：\nkubectl autoscale deployment my-app --cpu-percent=70 --min=2 --max=10\n\n建议在生产环境中同时配置 PodDisruptionBudget 以确保高可用性。',
      model: 'GPT-4o',
      responseTime: 2.3,
      tokens: 1856,
      feedback: 'satisfied',
      feedbackContent: '回答非常详细，步骤清晰，直接解决了我的问题。',
      feedbackTime: '2026-06-01 15:30:00',
      qualityScore: 92,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-01 15:22:00'
    },
    {
      id: 'QA-20260601-002',
      question: '公司的差旅报销流程是什么？需要哪些审批环节？',
      questioner: '李晓婷',
      employeeId: 'EMP-2087',
      department: '市场营销部',
      category: '流程制度',
      hitKnowledge: true,
      references: [
        { id: 'R3', docName: '员工差旅管理制度（2026修订版）', category: '流程制度', snippet: '差旅报销需在出差结束后 5 个工作日内提交，经直属上级审批 → 部门经理审批 → 财务部复核 → 打款…', similarity: 0.96 }
      ],
      answer: '根据《员工差旅管理制度（2026修订版）》，差旅报销流程如下：\n\n1. 出差结束后 5 个工作日内在 OA 系统提交差旅报销单\n2. 附上发票、行程单、住宿凭证等原始单据\n3. 审批链路：直属上级 → 部门经理 → 财务部复核\n4. 审批通过后 3-5 个工作日内打款至工资卡\n\n注意：超标费用需额外提交说明并由分管副总审批。',
      model: 'GPT-4o',
      responseTime: 1.8,
      tokens: 1240,
      feedback: 'satisfied',
      feedbackContent: '很准确，和最新制度一致。',
      feedbackTime: '2026-06-01 10:45:00',
      qualityScore: 95,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-01 10:40:00'
    },
    {
      id: 'QA-20260601-003',
      question: '公司内部的 GPU 算力平台怎么申请使用？有哪些可用资源？',
      questioner: '王建国',
      employeeId: 'EMP-1058',
      department: '技术研发部',
      category: '业务知识',
      hitKnowledge: false,
      references: [],
      answer: '抱歉，我暂时无法找到关于内部 GPU 算力平台的详细信息。建议您联系 IT 运维部门或查阅内部 IT 资源申请文档获取最新信息。',
      model: 'GPT-4o-mini',
      responseTime: 1.2,
      tokens: 380,
      feedback: 'unsatisfied',
      feedbackContent: '回答太笼统了，没有具体操作步骤，知识库应该补充这部分内容。',
      feedbackTime: '2026-06-01 16:20:00',
      qualityScore: 38,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-01 16:15:00'
    },
    {
      id: 'QA-20260602-004',
      question: '微服务之间如何做链路追踪？推荐用什么工具？',
      questioner: '赵鹏飞',
      employeeId: 'EMP-1023',
      department: '技术研发部',
      category: '技术规范',
      hitKnowledge: true,
      references: [
        { id: 'R4', docName: '微服务架构设计规范 v2.1', category: '技术规范', snippet: '所有微服务必须接入统一链路追踪系统，推荐使用 SkyWalking 或 Jaeger，需在服务入口注入 Trace ID…', similarity: 0.91 },
        { id: 'R5', docName: '中间件接入指南', category: '操作指南', snippet: 'SkyWalking Agent 配置示例：在 JVM 启动参数中添加 -javaagent:/opt/skywalking/agent/skywalking-agent.jar…', similarity: 0.83 }
      ],
      answer: '根据《微服务架构设计规范 v2.1》，公司统一使用 SkyWalking 作为链路追踪方案：\n\n1. Java 服务通过 Agent 自动接入，在 JVM 启动参数中配置\n2. Go 服务使用 OTel SDK 手动埋点\n3. 前端通过 SkyWalking Client JS 采集页面性能数据\n4. 所有服务需在请求 Header 中传递 Trace ID\n\n运维侧已部署 SkyWalking OAP 集群，访问地址见内部运维文档。',
      model: 'GPT-4o',
      responseTime: 2.8,
      tokens: 2104,
      feedback: 'none',
      feedbackContent: '',
      feedbackTime: '',
      qualityScore: 88,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-02 09:30:00'
    },
    {
      id: 'QA-20260602-005',
      question: '新员工入职后如何申请开发环境的权限？包括 GitLab、Jenkins、SonarQube？',
      questioner: '陈思雨',
      employeeId: 'EMP-3015',
      department: '技术研发部',
      category: '流程制度',
      hitKnowledge: false,
      references: [],
      answer: '关于开发环境权限申请，我暂时无法找到完整的操作指南。建议您联系直属导师或 IT 支持团队获取帮助。',
      model: 'GPT-4o-mini',
      responseTime: 0.9,
      tokens: 290,
      feedback: 'unsatisfied',
      feedbackContent: '新员工经常问这个问题，知识库里应该有明确指引。',
      feedbackTime: '2026-06-02 14:10:00',
      qualityScore: 35,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-02 14:05:00'
    },
    {
      id: 'QA-20260602-006',
      question: 'MySQL 慢查询优化的常见策略有哪些？',
      questioner: '刘浩然',
      employeeId: 'EMP-1067',
      department: '技术研发部',
      category: '技术规范',
      hitKnowledge: true,
      references: [
        { id: 'R6', docName: '数据库性能优化指南', category: '技术规范', snippet: '慢查询优化核心策略：1）合理建立索引 2）避免全表扫描 3）使用 EXPLAIN 分析执行计划 4）避免在 WHERE 中对字段做函数运算…', similarity: 0.89 }
      ],
      answer: '根据《数据库性能优化指南》，MySQL 慢查询优化的核心策略包括：\n\n1. 使用 EXPLAIN 分析查询执行计划，重点关注 type、key、rows 字段\n2. 合理建立索引，遵循最左前缀原则\n3. 避免 SELECT *，只查询需要的字段\n4. 避免在 WHERE 条件中对字段使用函数或运算\n5. 大表分页查询使用延迟关联或游标分页\n6. 定期使用 pt-query-digest 分析慢查询日志\n\n对于单表超过 500 万行的场景，建议评估是否需要分库分表。',
      model: 'GPT-4o',
      responseTime: 2.1,
      tokens: 1680,
      feedback: 'neutral',
      feedbackContent: '回答比较通用，希望有更多结合公司实际业务的案例。',
      feedbackTime: '2026-06-02 17:50:00',
      qualityScore: 72,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-02 17:40:00'
    },
    {
      id: 'QA-20260603-007',
      question: '公司 OKR 的制定和评审流程是怎样的？季度评审时间点是什么？',
      questioner: '孙雅琪',
      employeeId: 'EMP-2034',
      department: '人力资源部',
      category: '流程制度',
      hitKnowledge: true,
      references: [
        { id: 'R7', docName: 'OKR 管理实施办法（2026版）', category: '流程制度', snippet: '每季度首月 1-5 日为 OKR 制定窗口，季度末月 20-25 日为自评窗口，25-30 日为上级评审窗口…', similarity: 0.93 }
      ],
      answer: '根据《OKR 管理实施办法（2026版）》：\n\n制定流程：\n1. 每季度首月 1-5 日，员工在 HR 系统提交个人 OKR\n2. 5-8 日，直属上级与员工一对一沟通并对齐\n3. 10 日前，部门负责人完成部门级 OKR 对齐\n\n评审流程：\n1. 季度末月 20-25 日，员工完成 OKR 自评\n2. 25-30 日，上级完成评审打分\n3. 次季度首月 3 日前，HR 汇总结果并归档\n\n评审结果分为：超额完成（1.0-1.2）、达标（0.7-1.0）、未达标（0-0.7）三档。',
      model: 'GPT-4o',
      responseTime: 1.9,
      tokens: 1520,
      feedback: 'satisfied',
      feedbackContent: '',
      feedbackTime: '2026-06-03 11:00:00',
      qualityScore: 90,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-03 10:50:00'
    },
    {
      id: 'QA-20260603-008',
      question: '如何将现有的 Jenkins Pipeline 迁移到 GitHub Actions？',
      questioner: '周志强',
      employeeId: 'EMP-1089',
      department: '运维部',
      category: '技术规范',
      hitKnowledge: false,
      references: [],
      answer: '抱歉，关于 Jenkins Pipeline 到 GitHub Actions 的迁移指南，目前知识库中暂无相关内容。建议参考 GitHub 官方迁移文档或联系架构组获取支持。',
      model: 'Claude-3.5-Sonnet',
      responseTime: 1.5,
      tokens: 420,
      feedback: 'neutral',
      feedbackContent: '虽然没找到内容，但回答还算诚实。希望能补充迁移指南。',
      feedbackTime: '2026-06-03 15:30:00',
      qualityScore: 55,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-03 15:20:00'
    },
    {
      id: 'QA-20260603-009',
      question: 'Prometheus 告警规则的最佳实践是什么？如何避免告警风暴？',
      questioner: '吴大伟',
      employeeId: 'EMP-1045',
      department: '运维部',
      category: '技术规范',
      hitKnowledge: true,
      references: [
        { id: 'R8', docName: '监控告警体系规范 v1.5', category: '技术规范', snippet: '告警规则应遵循分级原则：P0 级告警需在 5 分钟内响应，P1 级 15 分钟内响应，P2 级 1 小时内响应…', similarity: 0.90 },
        { id: 'R9', docName: 'Prometheus 运维手册', category: '操作指南', snippet: '避免告警风暴的方法：1）使用 group_wait 和 group_interval 合并同类告警 2）设置 inhibit_rules 抑制子告警…', similarity: 0.85 }
      ],
      answer: '根据《监控告警体系规范 v1.5》和《Prometheus 运维手册》，最佳实践如下：\n\n告警规则设计：\n1. 按严重程度分为 P0/P1/P2/P3 四个等级\n2. 使用 recording rules 预计算高频查询\n3. 告警阈值应基于 SLO 而非固定数值\n\n避免告警风暴：\n1. 配置 group_wait: 30s 和 group_interval: 5m 合并同类告警\n2. 使用 inhibit_rules 抑制依赖链路上的子告警\n3. 设置 repeat_interval: 4h 避免重复通知\n4. 使用 Alertmanager 的 silence 功能在维护期间静默告警',
      model: 'GPT-4o',
      responseTime: 3.1,
      tokens: 2340,
      feedback: 'satisfied',
      feedbackContent: '非常专业，引用了多个文档，建议沉淀为知识条目。',
      feedbackTime: '2026-06-03 18:10:00',
      qualityScore: 96,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-03 18:00:00'
    },
    {
      id: 'QA-20260604-010',
      question: '公司前端项目的技术栈和组件库有哪些？如何新建一个前端项目？',
      questioner: '马晓丽',
      employeeId: 'EMP-2056',
      department: '产品设计部',
      category: '技术规范',
      hitKnowledge: true,
      references: [
        { id: 'R10', docName: '前端工程化规范（2026版）', category: '技术规范', snippet: '公司前端统一技术栈：Vue 3 + TypeScript + Vite + Element Plus，组件库使用内部 @corp/ui-components…', similarity: 0.88 }
      ],
      answer: '根据《前端工程化规范（2026版）》，公司前端标准技术栈为：\n\n核心框架：Vue 3 + TypeScript + Vite\nUI 组件：Element Plus + @corp/ui-components（内部库）\n状态管理：Pinia\n网络请求：Axios + 统一拦截器\n代码规范：ESLint + Prettier + Husky\n\n新建项目：\n1. 使用内部脚手架：npx @corp/create-app my-project\n2. 选择模板（管理后台 / H5 / 微前端子应用）\n3. 按提示完成初始化配置',
      model: 'GPT-4o',
      responseTime: 2.0,
      tokens: 1440,
      feedback: 'none',
      feedbackContent: '',
      feedbackTime: '',
      qualityScore: 85,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-04 09:15:00'
    },
    {
      id: 'QA-20260604-011',
      question: '公司内部 API 网关的限流策略和熔断机制是怎样的？',
      questioner: '黄志刚',
      employeeId: 'EMP-1078',
      department: '技术研发部',
      category: '技术规范',
      hitKnowledge: false,
      references: [],
      answer: '关于 API 网关的限流和熔断策略，目前知识库中没有找到详细的配置文档。建议联系中间件团队获取最新技术文档。',
      model: 'Qwen-Max',
      responseTime: 1.1,
      tokens: 350,
      feedback: 'unsatisfied',
      feedbackContent: '这是架构层面的核心问题，知识库应该覆盖。',
      feedbackTime: '2026-06-04 11:20:00',
      qualityScore: 42,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-04 11:10:00'
    },
    {
      id: 'QA-20260604-012',
      question: '如何使用公司统一身份认证（SSO）对接第三方 SaaS 系统？',
      questioner: '杨洁',
      employeeId: 'EMP-2091',
      department: '产品设计部',
      category: '业务知识',
      hitKnowledge: true,
      references: [
        { id: 'R11', docName: 'SSO 集成开发指南 v2.0', category: '操作指南', snippet: '公司 SSO 基于 OAuth 2.0 + OIDC 协议，支持 Authorization Code 和 Client Credentials 两种授权模式…', similarity: 0.92 }
      ],
      answer: '根据《SSO 集成开发指南 v2.0》，对接第三方 SaaS 的步骤如下：\n\n1. 在 SSO 管理平台注册应用，获取 Client ID 和 Client Secret\n2. 选择授权模式：用户交互场景使用 Authorization Code，服务间调用使用 Client Credentials\n3. 配置回调地址和权限范围\n4. 第三方系统侧配置 OIDC Discovery Endpoint\n5. 联调测试后提交安全审计\n\n注意事项：所有回调地址必须使用 HTTPS，Token 有效期默认 2 小时。',
      model: 'GPT-4o',
      responseTime: 2.5,
      tokens: 1780,
      feedback: 'satisfied',
      feedbackContent: '非常清晰，直接照着操作就对接成功了。',
      feedbackTime: '2026-06-04 16:40:00',
      qualityScore: 94,
      adminStatus: 'pending',
      adminNote: '',
      askTime: '2026-06-04 16:30:00'
    }
  ]
}

// ===== 知识盲区（高频未命中） =====

export interface BlindSpot {
  id: string
  question: string
  askCount: number
  lastAskTime: string
}

export function getBlindSpotsMock(): BlindSpot[] {
  return [
    { id: 'BS-001', question: 'GPU 算力平台申请和使用指南', askCount: 23, lastAskTime: '2026-06-04 16:15:00' },
    { id: 'BS-002', question: '新员工开发环境权限申请流程（GitLab/Jenkins/SonarQube）', askCount: 19, lastAskTime: '2026-06-04 14:05:00' },
    { id: 'BS-003', question: 'Jenkins Pipeline 迁移 GitHub Actions 指南', askCount: 14, lastAskTime: '2026-06-03 15:20:00' },
    { id: 'BS-004', question: 'API 网关限流策略和熔断机制配置', askCount: 11, lastAskTime: '2026-06-04 11:10:00' },
    { id: 'BS-005', question: '内部消息队列（Kafka/RabbitMQ）使用规范', askCount: 9, lastAskTime: '2026-06-02 10:30:00' },
    { id: 'BS-006', question: '多租户隔离方案和数据安全策略', askCount: 7, lastAskTime: '2026-06-01 09:00:00' }
  ]
}

// ===== 热门问题 =====

export interface HotQuestion {
  id: string
  title: string
  askCount: number
  satisfactionRate: number
  hitRate: number
}

export function getHotQuestionsMock(): HotQuestion[] {
  return [
    { id: 'HQ-001', title: 'K8s HPA 水平自动扩缩容配置', askCount: 42, satisfactionRate: 91, hitRate: 95 },
    { id: 'HQ-002', title: '差旅报销流程和审批环节', askCount: 38, satisfactionRate: 88, hitRate: 98 },
    { id: 'HQ-003', title: '微服务链路追踪工具和方法', askCount: 31, satisfactionRate: 85, hitRate: 92 },
    { id: 'HQ-004', title: 'OKR 制定和季度评审流程', askCount: 28, satisfactionRate: 90, hitRate: 96 },
    { id: 'HQ-005', title: 'SSO 单点登录对接第三方系统', askCount: 24, satisfactionRate: 93, hitRate: 94 }
  ]
}

// ===== 反馈统计 =====

export interface FeedbackStats {
  satisfiedRate: number
  neutralRate: number
  unsatisfiedRate: number
  topUnsatisfiedReasons: { reason: string; count: number }[]
}

export function getFeedbackStatsMock(): FeedbackStats {
  return {
    satisfiedRate: 62.5,
    neutralRate: 20.8,
    unsatisfiedRate: 16.7,
    topUnsatisfiedReasons: [
      { reason: '知识库缺少相关内容', count: 18 },
      { reason: '回答过于笼统，缺少实操细节', count: 12 },
      { reason: '引用来源不准确', count: 6 },
      { reason: '回答内容过时', count: 4 }
    ]
  }
}

// ===== AI 回答质量统计 =====

export interface QualityStats {
  avgScore: number
  excellentCount: number
  needsImproveCount: number
}

export function getQualityStatsMock(): QualityStats {
  return {
    avgScore: 75.2,
    excellentCount: 6,
    needsImproveCount: 3
  }
}

// ===== 顶部概览卡片 =====

export interface OverviewMetrics {
  todayQuestions: number
  todayChange: string
  hitRate: number
  hitRateChange: string
  satisfactionRate: number
  satisfactionChange: string
  pendingOptimize: number
  pendingChange: string
}

export function getOverviewMetricsMock(): OverviewMetrics {
  return {
    todayQuestions: 128,
    todayChange: '+12',
    hitRate: 87.3,
    hitRateChange: '+2.1%',
    satisfactionRate: 83.5,
    satisfactionChange: '+1.8%',
    pendingOptimize: 14,
    pendingChange: '-3'
  }
}
