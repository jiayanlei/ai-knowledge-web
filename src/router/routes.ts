import type { RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layout/BasicLayout.vue'
import { HOME_PATH, LOGIN_PATH, NOT_FOUND_ROUTE_PATH } from '@/constants/route'

export const routes: RouteRecordRaw[] = [
  {
    path: LOGIN_PATH,
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: BasicLayout,
    redirect: HOME_PATH,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页总览' }
      },
      {
        path: 'ai-chat',
        name: 'AiChat',
        component: () => import('@/views/ai-chat/index.vue'),
        meta: { title: '企业知识 AI 工作台' }
      },
      {
        path: 'knowledge',
        name: 'Knowledge',
        component: () => import('@/views/knowledge/index.vue'),
        meta: { title: '知识库' }
      },
      {
        path: 'knowledge-manage',
        name: 'KnowledgeManage',
        component: () => import('@/views/knowledge-manage/index.vue'),
        meta: { title: '知识中枢管理台' }
      },
      {
        path: 'project-assets',
        name: 'ProjectAssets',
        component: () => import('@/views/project-assets/index.vue'),
        meta: { title: '团队资产驾驶舱' }
      },
      {
        path: 'document',
        name: 'Document',
        component: () => import('@/views/document/index.vue'),
        meta: { title: '企业文档解析中枢' }
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/search/index.vue'),
        meta: { title: '企业智能检索引擎' }
      },
      {
        path: 'graph',
        name: 'KnowledgeGraph',
        component: () => import('@/views/graph/index.vue'),
        meta: { title: '知识图谱' }
      },
      {
        path: 'history',
        name: 'History',
        component: () => import('@/views/history/index.vue'),
        meta: { title: 'AI 问答洞察中心' }
      },
      {
        path: 'culture',
        name: 'Culture',
        component: () => import('@/views/culture/index.vue'),
        meta: { title: '企业文化星图' }
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/organization/index.vue'),
        meta: { title: '组织权限中枢' }
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/system/index.vue'),
        meta: { title: '系统设置' }
      },
      {
        path: '403',
        name: 'Forbidden',
        component: () => import('@/views/error/403.vue'),
        meta: { title: '403' }
      },
      {
        path: '404',
        name: 'NotFound',
        component: () => import('@/views/error/404.vue'),
        meta: { title: '404' }
      },
      {
        path: '500',
        name: 'ServerError',
        component: () => import('@/views/error/500.vue'),
        meta: { title: '500' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: NOT_FOUND_ROUTE_PATH
  }
]
