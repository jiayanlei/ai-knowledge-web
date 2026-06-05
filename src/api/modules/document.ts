import request from '@/api/request'
import type { ApiResponse, PageResult } from '@/types/api'

export interface DocumentItem {
  id: number
  name: string
  type: string
  updatedAt: string
}

export function getDocumentList() {
  return request.get<ApiResponse<PageResult<DocumentItem>>>('/documents')
}
