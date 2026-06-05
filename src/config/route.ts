import type { RouteRecordRaw } from 'vue-router'

export interface MenuRoute {
  path: string
  title: string
  icon: string
}

export const menuRoutes: MenuRoute[] = [
  { path: '/dashboard', title: '首页总览', icon: 'House' },
  { path: '/ai-chat', title: '企业知识 AI 工作台', icon: 'ChatDotRound' },
  { path: '/knowledge', title: '知识库', icon: 'Collection' },
  { path: '/knowledge-manage', title: '知识库管理', icon: 'Folder' },
  { path: '/project-assets', title: '团队资产驾驶舱', icon: 'Briefcase' },
  { path: '/document', title: '文档中心', icon: 'Document' },
  { path: '/search', title: '智能检索', icon: 'Search' },
  { path: '/graph', title: '知识图谱', icon: 'Share' },
  { path: '/history', title: '问答洞察', icon: 'DataAnalysis' },
  { path: '/culture', title: '企业文化', icon: 'StarFilled' },
  { path: '/organization', title: '组织权限', icon: 'Lock' },
  { path: '/system', title: '系统设置', icon: 'Setting' }
]

export const emptyChildRouteMeta: RouteRecordRaw['meta'] = {
  hidden: true
}
