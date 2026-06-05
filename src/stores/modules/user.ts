import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: 1,
      name: '张伟',
      company: '智联科技有限公司',
      department: '行政部'
    } as UserInfo
  }),
  getters: {
    displayName: (state) => state.userInfo.name
  }
})
