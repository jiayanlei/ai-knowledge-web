import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuard } from '@/router/guard'
import { routes } from '@/router/routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

setupRouterGuard(router)

export default router
