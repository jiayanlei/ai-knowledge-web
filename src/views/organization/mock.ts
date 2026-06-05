// ===== 数据概览 =====

export interface OverviewMetrics {
  departments: number
  members: number
  roles: number
  knowledgeAuth: number
  riskCount: number
}

export function getOverviewMetricsMock(): OverviewMetrics {
  return { departments: 12, members: 186, roles: 8, knowledgeAuth: 42, riskCount: 5 }
}

// ===== 组织架构树 =====

export interface DeptNode {
  id: string
  name: string
  count: number
  leader: string
  knowledgeCount: number
  risk?: boolean
  children?: DeptNode[]
}

export function getDeptTreeMock(): DeptNode[] {
  return [
    {
      id: 'd0', name: '公司总部', count: 186, leader: '总经理', knowledgeCount: 8, risk: false,
      children: [
        {
          id: 'd1', name: '研发中心', count: 68, leader: '张总监', knowledgeCount: 15, risk: false,
          children: [
            { id: 'd1-1', name: '前端组', count: 18, leader: '张三', knowledgeCount: 6, risk: false },
            { id: 'd1-2', name: '后端组', count: 22, leader: '吴大伟', knowledgeCount: 8, risk: false },
            { id: 'd1-3', name: 'AI 应用组', count: 16, leader: '赵鹏飞', knowledgeCount: 12, risk: false },
            { id: 'd1-4', name: '测试组', count: 12, leader: '周小丽', knowledgeCount: 4, risk: false }
          ]
        },
        {
          id: 'd2', name: '产品中心', count: 24, leader: '赵六', knowledgeCount: 8, risk: false,
          children: [
            { id: 'd2-1', name: '产品一组', count: 14, leader: '赵六', knowledgeCount: 5, risk: false },
            { id: 'd2-2', name: '用户体验组', count: 10, leader: '林小雅', knowledgeCount: 3, risk: false }
          ]
        },
        {
          id: 'd3', name: '客服中心', count: 42, leader: '李总监', knowledgeCount: 6, risk: false,
          children: [
            { id: 'd3-1', name: '客服一组', count: 16, leader: '李四', knowledgeCount: 3, risk: false },
            { id: 'd3-2', name: '客服二组', count: 14, leader: '孙小红', knowledgeCount: 3, risk: false },
            { id: 'd3-3', name: '质检组', count: 12, leader: '黄志刚', knowledgeCount: 2, risk: false }
          ]
        },
        {
          id: 'd4', name: '运营中心', count: 36, leader: '运营总监', knowledgeCount: 5, risk: false,
          children: [
            { id: 'd4-1', name: '内容运营', count: 20, leader: '马晓丽', knowledgeCount: 4, risk: false },
            { id: 'd4-2', name: '数据运营', count: 16, leader: '钱多多', knowledgeCount: 3, risk: false }
          ]
        },
        { id: 'd5', name: '外包支持组', count: 16, leader: '外包管理', knowledgeCount: 2, risk: true }
      ]
    }
  ]
}

// ===== 成员管理 =====

export interface MemberRecord {
  id: string
  name: string
  employeeId: string
  department: string
  deptId: string
  position: string
  role: string
  status: 'active' | 'disabled'
  knowledgeScope: string[]
  lastLogin: string
  riskStatus: 'normal' | 'review' | 'longtime'
}

export function getMembersMock(): MemberRecord[] {
  return [
    {
      id: 'm1', name: '张三', employeeId: '10086', department: '研发中心-前端组', deptId: 'd1-1',
      position: '前端工程师', role: '知识管理员', status: 'active',
      knowledgeScope: ['研发知识库', '团队资产库'], lastLogin: '2026-06-05 09:30', riskStatus: 'normal'
    },
    {
      id: 'm2', name: '李四', employeeId: '10087', department: '客服中心-客服一组', deptId: 'd3-1',
      position: '客服专员', role: '普通员工', status: 'active',
      knowledgeScope: ['客服知识库', '企业文化'], lastLogin: '2026-06-04 18:20', riskStatus: 'normal'
    },
    {
      id: 'm3', name: '王五', employeeId: '10088', department: '外包支持组', deptId: 'd5',
      position: '外包人员', role: '临时访客', status: 'active',
      knowledgeScope: ['仅项目交接资料'], lastLogin: '2026-05-28 10:12', riskStatus: 'review'
    },
    {
      id: 'm4', name: '赵六', employeeId: '10089', department: '产品中心-产品一组', deptId: 'd2-1',
      position: '产品经理', role: '团队负责人', status: 'active',
      knowledgeScope: ['产品知识库', '团队资产库'], lastLogin: '2026-06-05 08:50', riskStatus: 'normal'
    },
    {
      id: 'm5', name: '陈七', employeeId: '10090', department: '运营中心-内容运营', deptId: 'd4-1',
      position: '运营专员', role: '普通员工', status: 'disabled',
      knowledgeScope: ['企业文化', '运营知识库'], lastLogin: '2026-02-01 11:20', riskStatus: 'longtime'
    }
  ]
}

// ===== 角色权限 =====

export interface RoleRecord {
  id: string
  name: string
  description: string
  memberCount: number
  scope: string
  status: 'active' | 'frozen'
  color: string
  icon: string
}

export function getRolesMock(): RoleRecord[] {
  return [
    { id: 'r1', name: '超级管理员', description: '拥有系统全部权限，负责平台整体管理', memberCount: 2, scope: '全部权限', status: 'active', color: '#dc2626', icon: 'UserFilled' },
    { id: 'r2', name: '知识管理员', description: '负责知识库内容的维护、审核和发布管理', memberCount: 12, scope: '知识库 + 问答洞察', status: 'active', color: '#6366f1', icon: 'DocumentChecked' },
    { id: 'r3', name: '团队负责人', description: '管理本部门成员、知识资产和审批流程', memberCount: 18, scope: '本部门全部功能', status: 'active', color: '#10b981', icon: 'Avatar' },
    { id: 'r4', name: '普通员工', description: '可使用知识库查询和 AI 问答等基础功能', memberCount: 126, scope: '知识库 + AI 问答', status: 'active', color: '#3b82f6', icon: 'User' },
    { id: 'r5', name: '临时访客', description: '短期访问权限，仅可查看指定的公开知识', memberCount: 8, scope: '指定公开知识', status: 'active', color: '#f59e0b', icon: 'View' },
    { id: 'r6', name: '外包人员', description: '仅可访问项目交接相关文档，权限受限', memberCount: 14, scope: '项目交接资料', status: 'active', color: '#8b5cf6', icon: 'Connection' },
    { id: 'r7', name: '审计员', description: '可查看操作日志和审计记录，无编辑权限', memberCount: 3, scope: '日志与审计', status: 'active', color: '#64748b', icon: 'Notebook' },
    { id: 'r8', name: '模型管理员', description: '负责 AI 模型配置、策略调优和效果监控', memberCount: 3, scope: '模型配置 + 系统设置', status: 'active', color: '#ec4899', icon: 'Cpu' }
  ]
}

// ===== 权限树 =====

export interface PermNode {
  id: string
  label: string
  children?: PermNode[]
}

export function getPermTreeMock(): PermNode[] {
  return [
    { id: 'p-dash', label: '工作台' },
    {
      id: 'p-kb', label: '知识库',
      children: [
        { id: 'p-kb-view', label: '查看知识' },
        { id: 'p-kb-add', label: '新增知识' },
        { id: 'p-kb-edit', label: '编辑知识' },
        { id: 'p-kb-del', label: '删除知识' },
        { id: 'p-kb-review', label: '审核知识' },
        { id: 'p-kb-publish', label: '发布知识' }
      ]
    },
    {
      id: 'p-asset', label: '团队资产库',
      children: [
        { id: 'p-asset-view', label: '查看资产' },
        { id: 'p-asset-add', label: '新增资产' },
        { id: 'p-asset-edit', label: '编辑资产' },
        { id: 'p-asset-del', label: '删除资产' }
      ]
    },
    {
      id: 'p-ai', label: 'AI 问答',
      children: [
        { id: 'p-ai-ask', label: '发起提问' },
        { id: 'p-ai-history', label: '查看历史' },
        { id: 'p-ai-source', label: '查看引用来源' },
        { id: 'p-ai-feedback', label: '反馈评价' }
      ]
    },
    {
      id: 'p-insight', label: '问答洞察',
      children: [
        { id: 'p-ins-view', label: '查看记录' },
        { id: 'p-ins-feedback', label: '查看员工反馈' },
        { id: 'p-ins-blind', label: '标记知识盲区' },
        { id: 'p-ins-precip', label: '一键沉淀知识' }
      ]
    },
    {
      id: 'p-sys', label: '系统设置',
      children: [
        { id: 'p-sys-basic', label: '基础配置' },
        { id: 'p-sys-model', label: '模型配置' },
        { id: 'p-sys-knowledge', label: '知识策略' },
        { id: 'p-sys-qa', label: '问答策略' }
      ]
    },
    {
      id: 'p-org', label: '组织权限',
      children: [
        { id: 'p-org-dept', label: '部门管理' },
        { id: 'p-org-member', label: '成员管理' },
        { id: 'p-org-role', label: '角色管理' },
        { id: 'p-org-auth', label: '知识授权' }
      ]
    }
  ]
}

// ===== 角色权限映射（用于权限树默认选中） =====

export function getRolePermMapMock(): Record<string, string[]> {
  return {
    'r1': ['p-dash', 'p-kb', 'p-kb-view', 'p-kb-add', 'p-kb-edit', 'p-kb-del', 'p-kb-review', 'p-kb-publish', 'p-asset', 'p-asset-view', 'p-asset-add', 'p-asset-edit', 'p-asset-del', 'p-ai', 'p-ai-ask', 'p-ai-history', 'p-ai-source', 'p-ai-feedback', 'p-insight', 'p-ins-view', 'p-ins-feedback', 'p-ins-blind', 'p-ins-precip', 'p-sys', 'p-sys-basic', 'p-sys-model', 'p-sys-knowledge', 'p-sys-qa', 'p-org', 'p-org-dept', 'p-org-member', 'p-org-role', 'p-org-auth'],
    'r2': ['p-dash', 'p-kb', 'p-kb-view', 'p-kb-add', 'p-kb-edit', 'p-kb-review', 'p-kb-publish', 'p-asset-view', 'p-ai', 'p-ai-ask', 'p-ai-history', 'p-ai-source', 'p-ai-feedback', 'p-insight', 'p-ins-view', 'p-ins-feedback', 'p-ins-blind', 'p-ins-precip'],
    'r3': ['p-dash', 'p-kb-view', 'p-kb-add', 'p-kb-edit', 'p-asset', 'p-asset-view', 'p-asset-add', 'p-asset-edit', 'p-ai', 'p-ai-ask', 'p-ai-history', 'p-ai-source', 'p-ai-feedback', 'p-ins-view'],
    'r4': ['p-dash', 'p-kb-view', 'p-ai', 'p-ai-ask', 'p-ai-history', 'p-ai-source', 'p-ai-feedback'],
    'r5': ['p-dash', 'p-kb-view'],
    'r6': ['p-dash'],
    'r7': ['p-dash', 'p-ins-view', 'p-ins-feedback'],
    'r8': ['p-dash', 'p-sys-model', 'p-sys-knowledge', 'p-sys-qa', 'p-ins-view']
  }
}

// ===== 知识授权 =====

export interface KnowledgeAuth {
  id: string
  name: string
  level: 'public' | 'department' | 'internal' | 'sensitive'
  scope: string
  viewRoles: string
  editRoles: string
  allowAiRef: boolean
  allowExport: boolean
}

export function getKnowledgeAuthsMock(): KnowledgeAuth[] {
  return [
    { id: 'ka1', name: '研发知识库', level: 'department', scope: '研发中心可见', viewRoles: '研发中心全员', editRoles: '知识管理员', allowAiRef: true, allowExport: false },
    { id: 'ka2', name: '客服知识库', level: 'internal', scope: '客服中心可见', viewRoles: '客服中心全员', editRoles: '知识管理员', allowAiRef: true, allowExport: true },
    { id: 'ka3', name: '企业文化库', level: 'public', scope: '全员可见', viewRoles: '全员', editRoles: '知识管理员、团队负责人', allowAiRef: true, allowExport: true },
    { id: 'ka4', name: '敏感制度库', level: 'sensitive', scope: '管理员可见', viewRoles: '超级管理员', editRoles: '超级管理员', allowAiRef: false, allowExport: false },
    { id: 'ka5', name: '团队资产库', level: 'department', scope: '按团队授权', viewRoles: '团队负责人、知识管理员', editRoles: '知识管理员', allowAiRef: true, allowExport: false }
  ]
}

// ===== 知识访问范围地图 =====

export interface AccessMap {
  accessible: string[]
  blocked: string[]
  accessibleRoles: string[]
  rules: string[]
}

export function getAccessMapMock(): AccessMap {
  return {
    accessible: ['研发中心', '产品中心', '客服中心', '运营中心'],
    blocked: ['外包支持组'],
    accessibleRoles: ['超级管理员', '知识管理员', '团队负责人', '普通员工'],
    rules: ['外包人员不可访问', '临时访客仅可查看公开知识', '敏感制度库需单独申请']
  }
}

// ===== 权限矩阵 =====

export interface MatrixCell {
  label: string
  level: 'full' | 'partial' | 'none'
}

export interface MatrixRow {
  permission: string
  cells: MatrixCell[]
}

export function getPermMatrixMock(): MatrixRow[] {
  return [
    { permission: '知识查看', cells: [{ label: '全部', level: 'full' }, { label: '全部', level: 'full' }, { label: '本部门', level: 'partial' }, { label: '公开', level: 'partial' }, { label: '指定', level: 'partial' }] },
    { permission: '知识新增', cells: [{ label: '全部', level: 'full' }, { label: '全部', level: 'full' }, { label: '本部门', level: 'partial' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }] },
    { permission: '知识审核', cells: [{ label: '全部', level: 'full' }, { label: '全部', level: 'full' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }] },
    { permission: '知识发布', cells: [{ label: '全部', level: 'full' }, { label: '全部', level: 'full' }, { label: '本部门', level: 'partial' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }] },
    { permission: '团队资产管理', cells: [{ label: '全部', level: 'full' }, { label: '查看', level: 'partial' }, { label: '本部门', level: 'partial' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }] },
    { permission: '问答洞察查看', cells: [{ label: '全部', level: 'full' }, { label: '全部', level: 'full' }, { label: '本部门', level: 'partial' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }] },
    { permission: '模型配置', cells: [{ label: '全部', level: 'full' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }] },
    { permission: '系统设置', cells: [{ label: '全部', level: 'full' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }] },
    { permission: '组织权限管理', cells: [{ label: '全部', level: 'full' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }, { label: '无', level: 'none' }] }
  ]
}

export const matrixColumns = ['超级管理员', '知识管理员', '团队负责人', '普通员工', '临时访客']

// ===== 审批规则 =====

export interface ApprovalFlow {
  id: string
  name: string
  description: string
  steps: string[]
  enabled: boolean
}

export function getApprovalFlowsMock(): ApprovalFlow[] {
  return [
    {
      id: 'af1', name: '知识发布审批', description: '新增或修改的知识条目需经审批后方可发布上线',
      steps: ['员工提交', '知识管理员审核', '系统自动发布'],
      enabled: true
    },
    {
      id: 'af2', name: '权限申请审批', description: '员工申请额外知识库或系统权限时需走审批流程',
      steps: ['员工申请', '团队负责人审批', '系统管理员复核', '授权生效'],
      enabled: true
    },
    {
      id: 'af3', name: '敏感知识访问审批', description: '访问敏感级别知识库需经过更高级别的审批',
      steps: ['员工申请', '部门经理审批', '安全管理员复核', '限时授权生效'],
      enabled: true
    },
    {
      id: 'af4', name: '外包人员访问规则', description: '外包人员仅可访问指定交接资料，权限自动过期',
      steps: ['项目经理申请', 'IT 管理员配置', '自动设置过期时间'],
      enabled: true
    }
  ]
}

// ===== 安全策略 =====

export interface SecurityPolicy {
  key: string
  label: string
  value: string | boolean | number
  type: 'text' | 'switch' | 'number'
}

export function getSecurityPoliciesMock(): SecurityPolicy[] {
  return [
    { key: 'loginExpire', label: '登录过期时间', value: '24 小时', type: 'text' },
    { key: 'autoDisable', label: '长期未登录自动禁用', value: '90 天', type: 'text' },
    { key: 'multiDevice', label: '是否允许多端登录', value: true, type: 'switch' },
    { key: 'sensitiveLog', label: '敏感知识访问留痕', value: true, type: 'switch' },
    { key: 'exportApproval', label: '导出资料需审批', value: true, type: 'switch' },
    { key: 'externalRestrict', label: '外部账号限制访问', value: true, type: 'switch' },
    { key: 'tempExpire', label: '临时授权自动过期', value: true, type: 'switch' },
    { key: 'sensitiveAiRef', label: '敏感知识是否允许 AI 引用', value: false, type: 'switch' },
    { key: 'aiRequireSource', label: 'AI 回答是否必须带来源', value: true, type: 'switch' },
    { key: 'unauthNoContext', label: '未授权知识不可进入上下文', value: true, type: 'switch' },
    { key: 'questionDesensitize', label: '员工提问日志脱敏', value: true, type: 'switch' },
    { key: 'logRetain', label: '操作日志保留周期', value: '180 天', type: 'text' }
  ]
}

// ===== 权限风险洞察 =====

export interface RiskItem {
  id: string
  target: string
  type: string
  description: string
  suggestion: string
  level: 'high' | 'medium' | 'low'
}

export function getRiskItemsMock(): RiskItem[] {
  return [
    { id: 'risk1', target: '王五', type: '外包人员', description: '拥有团队资产编辑权限', suggestion: '建议复核，降为只读权限', level: 'high' },
    { id: 'risk2', target: '赵六', type: '普通员工', description: '可访问敏感知识库', suggestion: '建议降权，限制为部门知识', level: 'high' },
    { id: 'risk3', target: '陈七', type: '长期未登录', description: '已 120 天未登录系统', suggestion: '建议禁用账号或发送激活提醒', level: 'medium' },
    { id: 'risk4', target: '研发知识库', type: '授权过宽', description: '开放给全员访问', suggestion: '建议改为仅研发中心可见', level: 'medium' }
  ]
}

export interface RiskSummary {
  highRisk: number
  noRole: number
  longTimeLogin: number
  tempExpiring: number
  sensitiveBroad: number
}

export function getRiskSummaryMock(): RiskSummary {
  return { highRisk: 2, noRole: 3, longTimeLogin: 8, tempExpiring: 4, sensitiveBroad: 1 }
}

// ===== 权限模拟器 =====

export interface SimResult {
  user: string
  dept: string
  role: string
  accessible: string[]
  blocked: string[]
}

export function getSimResultMock(): SimResult {
  return {
    user: '李四',
    dept: '客服一组',
    role: '普通员工',
    accessible: ['企业文化', '客服知识库', '客服常见问题', '客服团队资产'],
    blocked: ['研发知识库', '系统设置', '组织权限', '模型配置', '敏感知识库']
  }
}

// ===== 成员权限画像 =====

export interface MemberProfile {
  name: string
  employeeId: string
  department: string
  role: string
  status: string
  summary: {
    accessibleKb: number
    manageableKb: number
    accessibleAssets: number
    canApprove: boolean
    canExport: boolean
    canConfigModel: boolean
  }
  radar: { dimension: string; score: number }[]
  recentOps: { time: string; action: string; target: string }[]
  timeline: { time: string; event: string }[]
}

export function getMemberProfileMock(name: string): MemberProfile {
  const profiles: Record<string, MemberProfile> = {
    '张三': {
      name: '张三', employeeId: '10086', department: '研发中心-前端组', role: '知识管理员', status: '启用',
      summary: { accessibleKb: 5, manageableKb: 3, accessibleAssets: 4, canApprove: true, canExport: false, canConfigModel: false },
      radar: [
        { dimension: '知识查看', score: 95 }, { dimension: '知识管理', score: 80 },
        { dimension: '资产管理', score: 60 }, { dimension: '系统配置', score: 20 },
        { dimension: '问答洞察', score: 70 }, { dimension: '组织权限', score: 10 }
      ],
      recentOps: [
        { time: '2026-06-05 09:32', action: '编辑知识', target: 'Vue3 组件设计规范' },
        { time: '2026-06-04 16:45', action: '审核知识', target: '前端打包优化指南' },
        { time: '2026-06-04 14:20', action: '新增知识', target: 'Pinia 状态管理最佳实践' },
        { time: '2026-06-03 10:15', action: '查看洞察', target: '问答洞察中心' }
      ],
      timeline: [
        { time: '2026-06-01', event: '角色变更为知识管理员' },
        { time: '2026-05-15', event: '新增研发知识库管理权限' },
        { time: '2026-04-01', event: '加入前端组' }
      ]
    },
    '李四': {
      name: '李四', employeeId: '10087', department: '客服中心-客服一组', role: '普通员工', status: '启用',
      summary: { accessibleKb: 2, manageableKb: 0, accessibleAssets: 1, canApprove: false, canExport: false, canConfigModel: false },
      radar: [
        { dimension: '知识查看', score: 50 }, { dimension: '知识管理', score: 0 },
        { dimension: '资产管理', score: 10 }, { dimension: '系统配置', score: 0 },
        { dimension: '问答洞察', score: 0 }, { dimension: '组织权限', score: 0 }
      ],
      recentOps: [
        { time: '2026-06-04 18:20', action: '发起提问', target: '请假流程在哪里？' },
        { time: '2026-06-04 14:10', action: '查看知识', target: '客服话术规范 v2.1' },
        { time: '2026-06-03 16:30', action: '反馈评价', target: '差旅报销流程回答' }
      ],
      timeline: [
        { time: '2026-03-15', event: '分配角色：普通员工' },
        { time: '2026-03-01', event: '加入客服一组' }
      ]
    }
  }
  return profiles[name] || profiles['张三']
}
