import type {
  KnowledgeNode, KnowledgeEdge, CategoryConfig, RelationConfig,
  PathNode, AIInsight, GraphStats, NodeCategory, RelationType, NodeStatus
} from './types'

/* ===== 节点分类配置 ===== */
export const CATEGORY_CONFIG: Record<NodeCategory, CategoryConfig> = {
  institution: { name: '制度规范', color: '#1677ff', glowColor: 'rgba(22,119,255,0.35)', icon: 'Notebook', softBg: '#eaf3ff' },
  process:     { name: '流程规范', color: '#06b6d4', glowColor: 'rgba(6,182,212,0.35)',  icon: 'SetUp', softBg: '#e6f7f9' },
  project:     { name: '项目文档', color: '#8b5cf6', glowColor: 'rgba(139,92,246,0.35)', icon: 'Briefcase', softBg: '#f3efff' },
  role:        { name: '角色岗位', color: '#f59e0b', glowColor: 'rgba(245,158,11,0.35)', icon: 'User', softBg: '#fef7e6' },
  risk:        { name: '风险警示', color: '#ef4444', glowColor: 'rgba(239,68,68,0.4)',   icon: 'WarningFilled', softBg: '#fef2f2' },
  ai_rec:      { name: 'AI 推荐', color: '#a855f7', glowColor: 'rgba(168,85,247,0.35)', icon: 'MagicStick', softBg: '#faf5ff' }
}

/* ===== 关系类型配置 ===== */
export const RELATION_CONFIG: Record<RelationType, RelationConfig> = {
  reference:  { name: '引用', color: '#94a3b8' },
  dependency: { name: '依赖', color: '#3b82f6' },
  belonging:  { name: '归属', color: '#64748b' },
  influence:  { name: '影响', color: '#f59e0b' },
  conflict:   { name: '冲突', color: '#ef4444', dash: true },
  recommend:  { name: 'AI 推荐', color: '#a855f7', dash: true },
  sequence:   { name: '时序', color: '#06b6d4' }
}

/* ===== 状态配置 ===== */
export const STATUS_CONFIG: Record<NodeStatus, { name: string; color: string }> = {
  normal:       { name: '正常', color: '#22c55e' },
  pending_update: { name: '待更新', color: '#f59e0b' },
  expired:      { name: '已过期', color: '#ef4444' },
  high_risk:    { name: '高风险', color: '#dc2626' },
  ai_suggested: { name: 'AI 建议', color: '#a855f7' }
}

/* ===== Mock 节点 ===== */
export function getMockNodes(): KnowledgeNode[] {
  return [
    // —— 制度节点 ——
    { id: 'n01', name: '员工手册', category: 'institution', department: '人力资源部', updateTime: '2025-12-15', owner: '王芳', status: 'normal', referenceCount: 8, affectedProcessCount: 5, riskLevel: 'low', summary: '公司基本管理制度汇编，涵盖行为规范、权利义务、福利待遇等核心内容。', symbolSize: 62, tags: ['基础制度', '全员适用'] },
    { id: 'n02', name: '考勤管理制度', category: 'institution', department: '人力资源部', updateTime: '2025-11-20', owner: '王芳', status: 'normal', referenceCount: 5, affectedProcessCount: 3, riskLevel: 'low', summary: '规定公司考勤时间、打卡规则、加班认定及异常处理标准。', symbolSize: 52, tags: ['考勤', '打卡'] },
    { id: 'n04', name: '报销管理制度', category: 'institution', department: '财务部', updateTime: '2025-06-10', owner: '张明', status: 'pending_update', referenceCount: 4, affectedProcessCount: 3, riskLevel: 'medium', summary: '规范各类费用报销标准、审批权限和报销流程。最近一次修改较早，可能需更新。', symbolSize: 50, tags: ['报销', '费用'] },
    { id: 'n08', name: '数据安全规范', category: 'institution', department: '信息安全部', updateTime: '2026-03-01', owner: '陈刚', status: 'normal', referenceCount: 6, affectedProcessCount: 4, riskLevel: 'low', summary: '公司信息资产分级、访问控制、加密传输和安全审计规范。', symbolSize: 58, tags: ['安全', '数据保护'] },
    { id: 'n09', name: '客户信息保护制度', category: 'institution', department: '合规法务部', updateTime: '2026-01-18', owner: '刘莉', status: 'normal', referenceCount: 3, affectedProcessCount: 2, riskLevel: 'low', summary: '客户个人信息采集、存储、使用和销毁的全生命周期管理规范。', symbolSize: 46, tags: ['隐私', '合规'] },
    { id: 'n10', name: 'AI 知识库使用规范', category: 'institution', department: '技术研发部', updateTime: '2026-05-20', owner: '赵磊', status: 'normal', referenceCount: 3, affectedProcessCount: 2, riskLevel: 'low', summary: 'AI 知识库的录入标准、审核流程、使用权限和更新机制。', symbolSize: 44, tags: ['AI', '知识库'] },
    { id: 'n11', name: '团队资产沉淀规范', category: 'institution', department: '项目管理部', updateTime: '2026-04-12', owner: '孙悦', status: 'normal', referenceCount: 2, affectedProcessCount: 2, riskLevel: 'low', summary: '项目交付物、技术文档、经验教训的归档和复用管理规范。', symbolSize: 40, tags: ['资产', '沉淀'] },

    // —— 流程节点 ——
    { id: 'n03', name: '请假审批流程', category: 'process', department: '人力资源部', updateTime: '2026-02-28', owner: '王芳', status: 'normal', referenceCount: 2, affectedProcessCount: 1, riskLevel: 'low', summary: '员工请假申请、多级审批、假期余额扣减及归档的标准流程。', symbolSize: 46, tags: ['请假', '审批'] },
    { id: 'n05', name: '差旅申请流程', category: 'process', department: '行政部', updateTime: '2026-01-15', owner: '李娜', status: 'normal', referenceCount: 2, affectedProcessCount: 2, riskLevel: 'low', summary: '出差申请、预算审批、行程安排和差旅报销的完整流程。', symbolSize: 44, tags: ['差旅', '审批'] },
    { id: 'n06', name: '项目交接规范', category: 'process', department: '项目管理部', updateTime: '2026-03-20', owner: '孙悦', status: 'normal', referenceCount: 3, affectedProcessCount: 2, riskLevel: 'low', summary: '项目人员变动时的文档交接、权限移交和知识传递标准流程。', symbolSize: 42, tags: ['交接', '项目管理'] },
    { id: 'n07', name: '新员工入职流程', category: 'process', department: '人力资源部', updateTime: '2026-04-05', owner: '王芳', status: 'normal', referenceCount: 5, affectedProcessCount: 3, riskLevel: 'low', summary: '从 Offer 发放到试用期结束的完整入职流程，含培训安排和系统开通。', symbolSize: 54, tags: ['入职', '人事'] },
    { id: 'n12', name: '权限申请流程', category: 'process', department: '信息安全部', updateTime: '2026-02-10', owner: '陈刚', status: 'normal', referenceCount: 2, affectedProcessCount: 1, riskLevel: 'low', summary: '系统权限申请、审批、开通和定期复核的标准流程。', symbolSize: 38, tags: ['权限', '安全'] },
    { id: 'n13', name: '研发上线流程', category: 'process', department: '技术研发部', updateTime: '2026-05-15', owner: '赵磊', status: 'normal', referenceCount: 3, affectedProcessCount: 2, riskLevel: 'low', summary: '代码评审、测试验证、灰度发布和正式上线的标准化流程。', symbolSize: 48, tags: ['研发', '上线'] },
    { id: 'n14', name: '生产事故处理流程', category: 'process', department: '技术研发部', updateTime: '2025-08-20', owner: '赵磊', status: 'pending_update', referenceCount: 2, affectedProcessCount: 1, riskLevel: 'medium', summary: '生产环境事故的发现、定级、应急响应、修复和复盘流程。', symbolSize: 44, tags: ['事故', '应急'] },

    // —— 项目节点 ——
    { id: 'n15', name: '项目复盘模板', category: 'project', department: '项目管理部', updateTime: '2026-04-28', owner: '孙悦', status: 'normal', referenceCount: 1, affectedProcessCount: 1, riskLevel: 'low', summary: '标准化的项目复盘文档模板，含目标回顾、成果分析、改进计划等章节。', symbolSize: 36, tags: ['模板', '复盘'] },
    { id: 'n16', name: 'Q2 产品迭代方案', category: 'project', department: '产品部', updateTime: '2026-05-30', owner: '周杰', status: 'normal', referenceCount: 2, affectedProcessCount: 1, riskLevel: 'low', summary: '2026 年 Q2 产品路线图和迭代计划，含需求优先级和资源分配。', symbolSize: 42, tags: ['产品', 'Q2'] },
    { id: 'n17', name: '客户管理系统接口文档', category: 'project', department: '技术研发部', updateTime: '2026-03-15', owner: '赵磊', status: 'normal', referenceCount: 3, affectedProcessCount: 1, riskLevel: 'low', summary: 'CRM 系统对外 API 接口说明文档，包含认证方式和数据格式规范。', symbolSize: 40, tags: ['API', 'CRM'] },
    { id: 'n18', name: '年度安全审计报告', category: 'project', department: '信息安全部', updateTime: '2026-01-30', owner: '陈刚', status: 'normal', referenceCount: 2, affectedProcessCount: 1, riskLevel: 'low', summary: '2025 年度信息安全审计结果汇总，含漏洞清单和整改建议。', symbolSize: 38, tags: ['审计', '安全'] },

    // —— 角色节点 ——
    { id: 'n19', name: 'HR 经理', category: 'role', department: '人力资源部', updateTime: '2026-06-01', owner: '系统', status: 'normal', referenceCount: 4, affectedProcessCount: 3, riskLevel: 'low', summary: '人力资源经理角色，负责考勤、入职、离职等人事审批节点。', symbolSize: 36, tags: ['审批人'] },
    { id: 'n20', name: '财务主管', category: 'role', department: '财务部', updateTime: '2026-06-01', owner: '系统', status: 'normal', referenceCount: 3, affectedProcessCount: 2, riskLevel: 'low', summary: '财务主管角色，负责费用报销和预算审批节点。', symbolSize: 34, tags: ['审批人'] },
    { id: 'n21', name: '技术负责人', category: 'role', department: '技术研发部', updateTime: '2026-06-01', owner: '系统', status: 'normal', referenceCount: 4, affectedProcessCount: 3, riskLevel: 'low', summary: '技术研发负责人角色，负责代码评审、上线审批和事故处理。', symbolSize: 38, tags: ['审批人'] },

    // —— 风险节点 ——
    { id: 'n22', name: '报销流程版本冲突', category: 'risk', department: '财务部', updateTime: '2026-05-28', owner: '张明', status: 'high_risk', referenceCount: 0, affectedProcessCount: 2, riskLevel: 'high', summary: '报销管理制度与差旅申请流程中的报销标准存在不一致，可能导致审批混乱。', symbolSize: 34, tags: ['冲突', '高优先级'] },
    { id: 'n23', name: '考勤规则过期提醒', category: 'risk', department: '人力资源部', updateTime: '2025-05-15', owner: '王芳', status: 'expired', referenceCount: 0, affectedProcessCount: 1, riskLevel: 'high', summary: '考勤管理制度已超过 180 天未更新，部分规则可能与最新劳动法不符。', symbolSize: 32, tags: ['过期', '合规风险'] },
    { id: 'n24', name: '事故处理文档孤立', category: 'risk', department: '技术研发部', updateTime: '2025-09-10', owner: '赵磊', status: 'high_risk', referenceCount: 0, affectedProcessCount: 0, riskLevel: 'high', summary: '生产事故处理流程缺少与研发上线流程的衔接关系，形成孤立文档。', symbolSize: 30, tags: ['孤立', '缺失关联'] },

    // —— AI 推荐节点 ——
    { id: 'n25', name: '建议：离职交接流程', category: 'ai_rec', department: '人力资源部', updateTime: '2026-06-04', owner: 'AI 引擎', status: 'ai_suggested', referenceCount: 0, affectedProcessCount: 0, riskLevel: 'medium', summary: 'AI 检测到项目交接规范较完善，但缺少离职交接流程，建议补充。', symbolSize: 32, tags: ['AI 发现', '流程缺口'] },
    { id: 'n26', name: '建议：数据安全培训制度', category: 'ai_rec', department: '信息安全部', updateTime: '2026-06-04', owner: 'AI 引擎', status: 'ai_suggested', referenceCount: 0, affectedProcessCount: 0, riskLevel: 'low', summary: 'AI 发现数据安全规范已更新但缺少配套培训制度，建议创建培训相关文档。', symbolSize: 30, tags: ['AI 发现', '制度缺口'] },
    { id: 'n27', name: '建议：预算审批关联', category: 'ai_rec', department: '财务部', updateTime: '2026-06-04', owner: 'AI 引擎', status: 'ai_suggested', referenceCount: 0, affectedProcessCount: 0, riskLevel: 'low', summary: 'AI 发现差旅申请流程和报销管理制度中的预算审批环节高度相似，建议建立显式关联。', symbolSize: 28, tags: ['AI 发现', '潜在关联'] }
  ]
}

/* ===== Mock 关系 ===== */
export function getMockEdges(): KnowledgeEdge[] {
  return [
    // 引用关系
    { id: 'e01', source: 'n01', target: 'n02', relationType: 'reference', strength: 'strong', description: '员工手册引用考勤管理制度中的考勤规则' },
    { id: 'e02', source: 'n01', target: 'n04', relationType: 'reference', strength: 'normal', description: '员工手册引用报销管理制度中的福利标准' },
    { id: 'e03', source: 'n08', target: 'n09', relationType: 'reference', strength: 'strong', description: '数据安全规范约束客户信息保护制度的实施标准' },
    { id: 'e04', source: 'n10', target: 'n11', relationType: 'reference', strength: 'normal', description: 'AI 知识库使用规范关联团队资产沉淀规范的归档标准' },
    { id: 'e05', source: 'n01', target: 'n07', relationType: 'reference', strength: 'strong', description: '新员工入职流程需要参考员工手册中的基本制度' },

    // 依赖关系
    { id: 'e06', source: 'n03', target: 'n02', relationType: 'dependency', strength: 'strong', description: '请假审批流程依赖考勤管理制度中的假期规则' },
    { id: 'e07', source: 'n05', target: 'n04', relationType: 'dependency', strength: 'strong', description: '差旅申请流程依赖报销管理制度中的差旅费用标准' },
    { id: 'e08', source: 'n13', target: 'n14', relationType: 'dependency', strength: 'strong', description: '研发上线流程依赖生产事故处理流程的回滚预案' },
    { id: 'e09', source: 'n12', target: 'n08', relationType: 'dependency', strength: 'normal', description: '权限申请流程依赖数据安全规范的权限分级标准' },
    { id: 'e10', source: 'n06', target: 'n15', relationType: 'dependency', strength: 'normal', description: '项目交接规范依赖项目复盘模板作为交接清单基础' },

    // 影响关系
    { id: 'e11', source: 'n04', target: 'n05', relationType: 'influence', strength: 'strong', description: '报销管理制度变更将直接影响差旅申请流程的费用标准' },
    { id: 'e12', source: 'n02', target: 'n03', relationType: 'influence', strength: 'normal', description: '考勤规则调整会影响请假审批流程的审批逻辑' },
    { id: 'e13', source: 'n08', target: 'n12', relationType: 'influence', strength: 'normal', description: '数据安全规范更新会触发权限申请流程的安全审核' },
    { id: 'e14', source: 'n08', target: 'n13', relationType: 'influence', strength: 'normal', description: '数据安全规范影响研发上线流程中的安全检查环节' },
    { id: 'e15', source: 'n14', target: 'n13', relationType: 'influence', strength: 'strong', description: '生产事故处理结果会触发研发上线流程的改进要求' },

    // 归属关系
    { id: 'e16', source: 'n15', target: 'n06', relationType: 'belonging', strength: 'normal', description: '项目复盘模板归属于项目管理流程体系' },
    { id: 'e17', source: 'n16', target: 'n13', relationType: 'belonging', strength: 'normal', description: 'Q2 产品迭代方案需要通过研发上线流程发布' },
    { id: 'e18', source: 'n17', target: 'n09', relationType: 'belonging', strength: 'normal', description: 'CRM 接口文档需要遵循客户信息保护制度' },
    { id: 'e19', source: 'n18', target: 'n08', relationType: 'belonging', strength: 'normal', description: '年度安全审计报告归属信息安全管理体系' },

    // 冲突关系
    { id: 'e20', source: 'n22', target: 'n04', relationType: 'conflict', strength: 'strong', description: '报销流程中的费用标准与报销管理制度中的标准不一致' },
    { id: 'e21', source: 'n22', target: 'n05', relationType: 'conflict', strength: 'strong', description: '差旅申请流程中的报销额度与报销管理制度存在冲突' },
    { id: 'e22', source: 'n23', target: 'n02', relationType: 'conflict', strength: 'normal', description: '考勤规则可能已过时，与现行劳动法存在潜在冲突' },

    // 时序关系
    { id: 'e23', source: 'n07', target: 'n01', relationType: 'sequence', strength: 'normal', description: '新员工入职后需阅读员工手册' },
    { id: 'e24', source: 'n07', target: 'n12', relationType: 'sequence', strength: 'normal', description: '新员工入职后需要申请系统权限' },
    { id: 'e25', source: 'n13', target: 'n14', relationType: 'sequence', strength: 'strong', description: '研发上线后需要关注生产事故处理' },

    // AI 推荐关系
    { id: 'e26', source: 'n25', target: 'n06', relationType: 'recommend', strength: 'weak', description: 'AI 建议：项目交接规范可延伸出离职交接流程' },
    { id: 'e27', source: 'n25', target: 'n07', relationType: 'recommend', strength: 'weak', description: 'AI 建议：离职交接流程与入职流程形成人事闭环' },
    { id: 'e28', source: 'n26', target: 'n08', relationType: 'recommend', strength: 'weak', description: 'AI 建议：数据安全规范应配套培训制度' },
    { id: 'e29', source: 'n27', target: 'n04', relationType: 'recommend', strength: 'weak', description: 'AI 建议：预算审批环节可建立显式关联' },
    { id: 'e30', source: 'n27', target: 'n05', relationType: 'recommend', strength: 'weak', description: 'AI 建议：差旅与报销的预算审批可统一' },

    // 角色关联
    { id: 'e31', source: 'n19', target: 'n03', relationType: 'belonging', strength: 'normal', description: 'HR 经理负责请假审批流程的审核' },
    { id: 'e32', source: 'n19', target: 'n07', relationType: 'belonging', strength: 'normal', description: 'HR 经理负责新员工入职流程的执行' },
    { id: 'e33', source: 'n20', target: 'n04', relationType: 'belonging', strength: 'normal', description: '财务主管负责报销管理制度的审批' },
    { id: 'e34', source: 'n21', target: 'n13', relationType: 'belonging', strength: 'normal', description: '技术负责人负责研发上线流程的审批' },
    { id: 'e35', source: 'n21', target: 'n14', relationType: 'belonging', strength: 'normal', description: '技术负责人负责生产事故处理流程的指挥' }
  ]
}

/* ===== 图谱统计 ===== */
export function getGraphStats(): GraphStats {
  return {
    totalNodes: 27,
    totalEdges: 35,
    isolatedNodes: 3,
    highRiskEdges: 4,
    aiRecommendedEdges: 5,
    recentlyUpdated: 6
  }
}

/* ===== AI 解读 (按节点 ID) ===== */
const AI_INSIGHTS: Record<string, AIInsight> = {
  n04: {
    summary: '当前知识点是《报销管理制度》，它被 4 个审批流程引用，并影响 2 个项目预算流程。最近一次修改时间为 2025 年 6 月，已超过 180 天，建议检查是否与最新财务规范保持一致。同时，差旅申请流程中的报销标准与此制度存在冲突，需要尽快核实并统一。',
    relatedDocs: ['差旅申请流程', '员工手册', '项目交接规范'],
    upstream: ['财务部年度预算方案', '国家税务法规更新'],
    downstream: ['差旅申请流程', 'Q2 产品迭代方案预算'],
    conflicts: ['报销流程版本冲突：差旅申请中的餐饮报销上限与报销管理制度不一致'],
    suggestions: ['建议在 30 天内完成制度更新审核', '建议与差旅流程负责人协同核实冲突项', '建议补充电子发票归档规范']
  },
  n01: {
    summary: '《员工手册》是企业最基础的制度文档，被 8 个流程和规范引用。作为全员必读文档，其更新频率应保持至少每季度一次。当前关联网络健康，但新员工入职流程中的阅读确认环节可以加强。',
    relatedDocs: ['考勤管理制度', '报销管理制度', '新员工入职流程'],
    upstream: ['劳动法规更新', '公司战略调整'],
    downstream: ['考勤管理制度', '报销管理制度', '请假审批流程'],
    conflicts: [],
    suggestions: ['建议增加版本变更通知机制', '建议在新员工入职流程中增加阅读确认签字环节']
  },
  n08: {
    summary: '《数据安全规范》是信息安全体系的核心文档，影响 4 个关键流程。最近一次更新为 2026 年 3 月，状态良好。但 AI 检测到缺少配套的数据安全培训制度，建议补充以确保全员安全意识。',
    relatedDocs: ['客户信息保护制度', '权限申请流程', '年度安全审计报告'],
    upstream: ['等保 2.0 合规要求', '行业安全标准'],
    downstream: ['权限申请流程', '研发上线流程', '客户信息保护制度'],
    conflicts: [],
    suggestions: ['建议创建数据安全培训制度文档', '建议在研发上线流程中增加安全检查清单', '建议每季度进行一次权限审计']
  },
  n14: {
    summary: '《生产事故处理流程》已超过 270 天未更新，AI 标记为高风险。当前流程缺少与研发上线流程的明确衔接关系，且事故定级标准可能需要与最新 SLA 承诺对齐。建议立即进行更新审核。',
    relatedDocs: ['研发上线流程', '技术负责人'],
    upstream: ['研发上线流程'],
    downstream: ['研发上线流程改进'],
    conflicts: ['事故处理文档与研发上线流程的衔接关系不明确'],
    suggestions: ['建议立即更新事故定级标准', '建议补充与研发上线流程的回滚衔接', '建议增加事故复盘模板']
  }
}

export function getAIInsight(nodeId: string): AIInsight {
  if (AI_INSIGHTS[nodeId]) return AI_INSIGHTS[nodeId]
  const node = getMockNodes().find(n => n.id === nodeId)
  if (!node) return { summary: '', relatedDocs: [], upstream: [], downstream: [], conflicts: [], suggestions: [] }
  return {
    summary: `《${node.name}》是${node.department}的核心知识文档，当前状态为「${STATUS_CONFIG[node.status].name}」，被 ${node.referenceCount} 个文档引用，影响 ${node.affectedProcessCount} 个流程。建议定期审核内容的准确性和时效性。`,
    relatedDocs: ['相关文档 A', '相关文档 B'],
    upstream: ['上游依赖文档'],
    downstream: ['下游影响文档'],
    conflicts: [],
    suggestions: [`建议检查 ${node.name} 的内容时效性`, '建议补充关联文档的交叉引用']
  }
}

/* ===== 路径数据 (底部时间轴) ===== */
export function getPathForNode(nodeId: string): PathNode[] {
  const PATHS: Record<string, PathNode[]> = {
    n03: [
      { nodeId: 'n01', name: '员工手册', category: 'institution', status: 'normal', relationLabel: '引用' },
      { nodeId: 'n02', name: '考勤管理制度', category: 'institution', status: 'normal', relationLabel: '依赖' },
      { nodeId: 'n03', name: '请假审批流程', category: 'process', status: 'normal', relationLabel: '执行' },
      { nodeId: 'n19', name: 'HR 经理', category: 'role', status: 'normal', relationLabel: '审批' }
    ],
    n05: [
      { nodeId: 'n01', name: '员工手册', category: 'institution', status: 'normal', relationLabel: '引用' },
      { nodeId: 'n04', name: '报销管理制度', category: 'institution', status: 'pending_update', relationLabel: '依赖' },
      { nodeId: 'n05', name: '差旅申请流程', category: 'process', status: 'normal', relationLabel: '执行' },
      { nodeId: 'n20', name: '财务主管', category: 'role', status: 'normal', relationLabel: '审批' }
    ],
    n13: [
      { nodeId: 'n08', name: '数据安全规范', category: 'institution', status: 'normal', relationLabel: '约束' },
      { nodeId: 'n16', name: 'Q2 产品迭代方案', category: 'project', status: 'normal', relationLabel: '归属' },
      { nodeId: 'n13', name: '研发上线流程', category: 'process', status: 'normal', relationLabel: '执行' },
      { nodeId: 'n21', name: '技术负责人', category: 'role', status: 'normal', relationLabel: '审批' },
      { nodeId: 'n14', name: '生产事故处理流程', category: 'process', status: 'pending_update', relationLabel: '后续' }
    ]
  }
  return PATHS[nodeId] || []
}

/* ===== 视图模式配置 ===== */
export const VIEW_MODES = [
  { key: 'star', label: '星图模式', icon: 'Promotion' },
  { key: 'brain', label: '脑图模式', icon: 'Cpu' },
  { key: 'chain', label: '流程链路', icon: 'Connection' },
  { key: 'impact', label: '影响分析', icon: 'DataAnalysis' }
] as const

/* ===== AI 问答示例 ===== */
export const AI_QUESTION_SUGGESTIONS = [
  '报销制度会影响哪些流程？',
  '新人入职需要了解哪些知识？',
  '数据安全规范约束了哪些系统？',
  '哪些文档存在冲突风险？',
  '项目交接文档依赖哪些规范？'
]
