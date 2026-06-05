// ===== 项目资产 =====

export type ProjectStatus = '运行中' | '交接中' | '沉淀中' | '已交接' | '待完善'
export type ValueLevel = '高价值' | '中价值' | '低价值'

export interface CompletenessDetail {
  label: string
  score: number
  status: '完整' | '一般' | '不足'
}

export interface TeamMember {
  name: string
  role: string
}

export interface KeyAsset {
  name: string
  type: string
}

export interface RecentChange {
  time: string
  action: string
}

export interface ProjectMemory {
  summary: string
  members: TeamMember[]
  keyAssets: KeyAsset[]
  recentChanges: RecentChange[]
  aiSuggestion: string
  completenessDetails: CompletenessDetail[]
}

export interface TeamProject {
  id: number
  name: string
  desc: string
  owner: string
  status: ProjectStatus
  valueLevel: ValueLevel
  completeness: number
  updatedAt: string
  tags: string[]
  missingItems: string[]
  memory: ProjectMemory
}

export function getTeamProjectsMock(): TeamProject[] {
  return [
    {
      id: 1, name: 'AI 知识库助手', desc: '用于企业制度、员工手册、流程规范和项目资料的智能检索与问答。',
      owner: '李明', status: '运行中', valueLevel: '高价值', completeness: 86, updatedAt: '2026-06-05 10:24',
      tags: ['知识库', 'AI问答', '企业文档', '权限控制'], missingItems: ['交接说明', '部署异常记录'],
      memory: {
        summary: '这是一个面向企业内部员工的智能知识查询系统，核心能力是文档沉淀、AI 检索、权限控制和问答追溯。',
        members: [{ name: '李明', role: '前端负责人' }, { name: '王强', role: '后端负责人' }, { name: '张琳', role: '产品经理' }],
        keyAssets: [{ name: '前端仓库', type: '代码' }, { name: '后端仓库', type: '代码' }, { name: '接口文档', type: '文档' }, { name: '部署说明', type: '文档' }, { name: '交接文档', type: '文档' }, { name: '常见问题', type: 'FAQ' }],
        recentChanges: [{ time: '2026-06-05', action: '更新知识库管理页面' }, { time: '2026-06-04', action: '调整团队资产库结构' }, { time: '2026-06-03', action: '新增企业文化模块' }, { time: '2026-06-01', action: '优化搜索性能' }],
        aiSuggestion: '当前项目资料比较完整，但交接说明和部署异常记录偏少，建议补充"常见部署问题"和"新人接手路径"。',
        completenessDetails: [
          { label: '基础信息', score: 95, status: '完整' }, { label: '核心文档', score: 90, status: '完整' },
          { label: '接口说明', score: 88, status: '完整' }, { label: '部署说明', score: 70, status: '一般' },
          { label: '交接经验', score: 60, status: '不足' }, { label: '常见问题', score: 55, status: '不足' }
        ]
      }
    },
    {
      id: 2, name: '客户诉求单系统', desc: '沉淀客户诉求流转、质检评价、接口联动和历史问题处理经验。',
      owner: '陈晨', status: '交接中', valueLevel: '高价值', completeness: 72, updatedAt: '2026-06-04 17:36',
      tags: ['工单', '质检', '流程流转', '客户服务'], missingItems: ['新人接手路径'],
      memory: {
        summary: '客户服务核心系统，覆盖诉求提交、智能分配、质检评分和多渠道联动，历史工单数据丰富。',
        members: [{ name: '陈晨', role: '项目负责人' }, { name: '刘洋', role: '后端开发' }, { name: '周芳', role: '测试' }],
        keyAssets: [{ name: '诉求流转引擎', type: '代码' }, { name: '质检规则库', type: '配置' }, { name: 'API 接口文档', type: '文档' }, { name: '历史工单分析', type: '数据' }],
        recentChanges: [{ time: '2026-06-04', action: '完成交接文档初稿' }, { time: '2026-06-02', action: '更新质检评分规则' }, { time: '2026-05-30', action: '修复工单超时问题' }],
        aiSuggestion: '项目正在交接阶段，建议尽快补充"新人接手路径"文档，并整理常见客户诉求处理模式。',
        completenessDetails: [
          { label: '基础信息', score: 85, status: '完整' }, { label: '核心文档', score: 75, status: '一般' },
          { label: '接口说明', score: 80, status: '完整' }, { label: '部署说明', score: 65, status: '一般' },
          { label: '交接经验', score: 50, status: '不足' }, { label: '常见问题', score: 60, status: '不足' }
        ]
      }
    },
    {
      id: 3, name: '经营数据驾驶舱', desc: '沉淀经营指标、数据口径、报表规则和可视化看板经验。',
      owner: '周鹏', status: '沉淀中', valueLevel: '中价值', completeness: 58, updatedAt: '2026-06-03 13:52',
      tags: ['数据看板', '统计口径', '经营分析'], missingItems: ['指标说明', '数据来源'],
      memory: {
        summary: '企业经营数据的统一展示平台，包含财务指标、销售漏斗、客户画像和运营效率等核心看板。',
        members: [{ name: '周鹏', role: '数据分析' }, { name: '吴静', role: '前端开发' }],
        keyAssets: [{ name: '指标口径文档', type: '文档' }, { name: '报表配置', type: '配置' }, { name: '数据源说明', type: '文档' }],
        recentChanges: [{ time: '2026-06-03', action: '新增客户画像看板' }, { time: '2026-05-28', action: '调整营收指标计算逻辑' }],
        aiSuggestion: '该项目资料沉淀尚不完整，指标说明和数据源文档缺失较多，建议优先补充这两项内容。',
        completenessDetails: [
          { label: '基础信息', score: 70, status: '一般' }, { label: '核心文档', score: 55, status: '不足' },
          { label: '接口说明', score: 60, status: '不足' }, { label: '部署说明', score: 50, status: '不足' },
          { label: '交接经验', score: 40, status: '不足' }, { label: '常见问题', score: 45, status: '不足' }
        ]
      }
    },
    {
      id: 4, name: '员工门户系统', desc: '沉淀门户菜单、通知公告、组织架构和权限配置经验。',
      owner: '王强', status: '运行中', valueLevel: '中价值', completeness: 76, updatedAt: '2026-06-02 09:30',
      tags: ['门户', '组织架构', '权限', '公告'], missingItems: ['历史问题记录'],
      memory: {
        summary: '企业内部统一入口平台，整合通知公告、组织架构查询、权限申请和常用工具快捷入口。',
        members: [{ name: '王强', role: '全栈开发' }, { name: '赵敏', role: 'UI 设计' }],
        keyAssets: [{ name: '门户前端代码', type: '代码' }, { name: '权限配置手册', type: '文档' }, { name: '组织架构 API', type: '接口' }, { name: '公告模板库', type: '资源' }],
        recentChanges: [{ time: '2026-06-02', action: '优化门户首页加载速度' }, { time: '2026-05-29', action: '新增部门快捷入口' }, { time: '2026-05-25', action: '修复权限申请流程' }],
        aiSuggestion: '项目运行稳定，但缺少历史问题记录。建议整理过去遇到的典型问题和解决方案。',
        completenessDetails: [
          { label: '基础信息', score: 90, status: '完整' }, { label: '核心文档', score: 80, status: '完整' },
          { label: '接口说明', score: 75, status: '一般' }, { label: '部署说明', score: 70, status: '一般' },
          { label: '交接经验', score: 60, status: '不足' }, { label: '常见问题', score: 55, status: '不足' }
        ]
      }
    },
    {
      id: 5, name: 'WMS 仓储管理系统', desc: '沉淀入库、出库、盘点、库存预警和仓储作业流程。',
      owner: '赵磊', status: '已交接', valueLevel: '高价值', completeness: 91, updatedAt: '2026-06-01 15:10',
      tags: ['WMS', '库存', '仓储', '流程规范'], missingItems: [],
      memory: {
        summary: '仓储物流核心系统，覆盖入库验收、出库拣货、库存盘点、预警规则等全链路业务流程。',
        members: [{ name: '赵磊', role: '项目经理' }, { name: '孙伟', role: '后端架构' }, { name: '李娜', role: '业务分析' }],
        keyAssets: [{ name: 'WMS 核心代码', type: '代码' }, { name: '业务流程图', type: '文档' }, { name: '接口协议', type: '文档' }, { name: '部署运维手册', type: '文档' }, { name: '完整交接文档', type: '文档' }, { name: '常见问题手册', type: 'FAQ' }],
        recentChanges: [{ time: '2026-06-01', action: '完成全面交接' }, { time: '2026-05-28', action: '更新库存预警规则' }, { time: '2026-05-20', action: '优化盘点流程' }],
        aiSuggestion: '该项目资料非常完整，是团队标准资产的典范。建议定期审查保持更新。',
        completenessDetails: [
          { label: '基础信息', score: 98, status: '完整' }, { label: '核心文档', score: 95, status: '完整' },
          { label: '接口说明', score: 92, status: '完整' }, { label: '部署说明', score: 88, status: '完整' },
          { label: '交接经验', score: 90, status: '完整' }, { label: '常见问题', score: 85, status: '完整' }
        ]
      }
    },
    {
      id: 6, name: '接口网关服务', desc: '沉淀统一鉴权、接口转发、异常处理和服务联调经验。',
      owner: '孙浩', status: '待完善', valueLevel: '中价值', completeness: 46, updatedAt: '2026-05-30 18:22',
      tags: ['接口', '网关', '鉴权', '服务治理'], missingItems: ['接口文档', '部署说明', '异常手册'],
      memory: {
        summary: '微服务架构的统一入口网关，负责请求鉴权、流量控制、服务路由和异常处理。',
        members: [{ name: '孙浩', role: '后端开发' }],
        keyAssets: [{ name: '网关核心代码', type: '代码' }, { name: '鉴权配置', type: '配置' }],
        recentChanges: [{ time: '2026-05-30', action: '修复 Token 刷新问题' }, { time: '2026-05-22', action: '新增限流策略' }],
        aiSuggestion: '该项目资料严重不足，缺少接口文档、部署说明和异常处理手册。作为基础设施项目，建议优先补充这些文档。',
        completenessDetails: [
          { label: '基础信息', score: 60, status: '不足' }, { label: '核心文档', score: 35, status: '不足' },
          { label: '接口说明', score: 30, status: '不足' }, { label: '部署说明', score: 25, status: '不足' },
          { label: '交接经验', score: 20, status: '不足' }, { label: '常见问题', score: 15, status: '不足' }
        ]
      }
    }
  ]
}

// ===== 顶部统计 =====

export interface TopStats {
  projectCount: number
  handoverCount: number
  knowledgeCount: number
  activeMembers: number
}

export function getTopStatsMock(): TopStats {
  return { projectCount: 12, handoverCount: 38, knowledgeCount: 126, activeMembers: 16 }
}

// ===== 筛选选项 =====

export const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'running', label: '进行中' },
  { key: 'handover', label: '交接中' },
  { key: 'accumulating', label: '沉淀中' },
  { key: 'high-value', label: '高价值' },
  { key: 'incomplete', label: '待完善' }
]

// ===== 智能搜索建议 =====

export const searchSuggestions = [
  '最近交接的项目',
  '缺少部署文档的项目',
  '李明负责的资产',
  '高价值但资料不完整的项目',
  '本周更新过的知识点'
]

// ===== 空状态 =====

export const emptyTips = [
  '可以先创建一个项目资产，把项目资料、交接文档、知识点和历史备注沉淀进来。',
  '每个项目都是团队的记忆，值得被记录和传承。'
]
