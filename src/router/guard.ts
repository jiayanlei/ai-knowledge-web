import type { Router } from 'vue-router'
import { APP_TITLE } from '@/constants/app'
import { HOME_PATH, LOGIN_PATH } from '@/constants/route'
import { getToken } from '@/utils/auth'

export function setupRouterGuard(router: Router) {
  router.beforeEach((to) => {
    const token = getToken()

    if (to.path === LOGIN_PATH) {
      return token ? HOME_PATH : true
    }

    if (!token) {
      return {
        path: LOGIN_PATH,
        replace: true
      }
    }

    return true
  })

  router.afterEach((to) => {
    const pageTitle = to.meta.title ? `${to.meta.title} - ${APP_TITLE}` : APP_TITLE
    document.title = pageTitle
  })
}
