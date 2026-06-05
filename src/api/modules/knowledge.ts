import request from '@/api/request'
import type { ApiResponse } from '@/types/api'
import type { KnowledgeCatalogItem } from '@/types/knowledge'

export function getKnowledgeCatalog() {
  return request.get<ApiResponse<KnowledgeCatalogItem[]>>('/knowledge/catalog')
}
