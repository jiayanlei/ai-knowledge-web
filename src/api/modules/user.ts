import request from '@/api/request'
import type { ApiResponse } from '@/types/api'
import type { UserInfo } from '@/types/user'

export function getUserInfo() {
  return request.get<ApiResponse<UserInfo>>('/user/info')
}
