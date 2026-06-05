import { defineStore } from 'pinia'
import { menuRoutes } from '@/config/route'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    menus: menuRoutes
  })
})
