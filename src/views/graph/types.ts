/** 知识图谱 - 节点分类 */
export type NodeCategory =
  | 'institution'   // 制度节点
  | 'process'       // 流程节点
  | 'project'       // 项目节点
  | 'role'          // 角色节点
  | 'risk'          // 风险节点
  | 'ai_rec'        // AI 推荐节点

/** 知识图谱 - 关系类型 */
export type RelationType =
  | 'reference'   // 引用
  | 'dependency'  // 依赖
  | 'belonging'   // 归属
  | 'influence'   // 影响
  | 'conflict'    // 冲突
  | 'recommend'   // AI 推荐
  | 'sequence'    // 时序

/** 节点状态 */
export type NodeStatus = 'normal' | 'pending_update' | 'expired' | 'high_risk' | 'ai_suggested'

/** 关系强度 */
export type EdgeStrength = 'weak' | 'normal' | 'strong'

/** 知识节点 */
export interface KnowledgeNode {
  id: string
  name: string
  category: NodeCategory
  department: string
  updateTime: string
  owner: string
  status: NodeStatus
  referenceCount: number
  affectedProcessCount: number
  riskLevel: 'low' | 'medium' | 'high'
  summary: string
  symbolSize: number
  tags?: string[]
}

/** 知识关系 */
export interface KnowledgeEdge {
  id: string
  source: string
  target: string
  relationType: RelationType
  strength: EdgeStrength
  description: string
}

/** 路径节点 (底部时间轴) */
export interface PathNode {
  nodeId: string
  name: string
  category: NodeCategory
  status: NodeStatus
  relationLabel: string
}

/** AI 解读 */
export interface AIInsight {
  summary: string
  relatedDocs: string[]
  upstream: string[]
  downstream: string[]
  conflicts: string[]
  suggestions: string[]
}

/** 视图模式 */
export type ViewMode = 'star' | 'brain' | 'chain' | 'impact'

/** 图谱统计 */
export interface GraphStats {
  totalNodes: number
  totalEdges: number
  isolatedNodes: number
  highRiskEdges: number
  aiRecommendedEdges: number
  recentlyUpdated: number
}

/** 节点分类配置 */
export interface CategoryConfig {
  name: string
  color: string
  glowColor: string
  icon: string
  softBg: string
}

/** 关系类型配置 */
export interface RelationConfig {
  name: string
  color: string
  dash?: boolean
}

/** 筛选状态 */
export interface FilterState {
  categories: NodeCategory[]
  relationTypes: RelationType[]
  statuses: NodeStatus[]
  layerDepth: number
}
