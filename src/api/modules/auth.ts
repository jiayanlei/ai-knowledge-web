import request from '@/api/request'
import type { ApiResponse } from '@/types/api'
import type { UserInfo } from '@/types/user'

export interface LoginParams {
  username: string
  password: string
}

export const MOCK_ACCOUNT = {
  username: 'admin',
  password: 'Aa123456'
}

export function login(data: LoginParams) {
  return request.post<ApiResponse<{ token: string; user: UserInfo }>>('/auth/login', data)
}

export function mockLogin(data: LoginParams) {
  if (data.username !== MOCK_ACCOUNT.username || data.password !== MOCK_ACCOUNT.password) {
    return Promise.reject(new Error('工号或密码错误'))
  }

  return Promise.resolve({
    token: `mock-token-${Date.now()}`,
    userInfo: {
      username: data.username,
      nickname: '模拟用户'
    }
  })
}

export function logout() {
  return request.post<ApiResponse<boolean>>('/auth/logout')
}
