export interface KnowledgeCatalogItem {
  id: number
  name: string
  count: number
  icon?: string
  children?: KnowledgeCatalogItem[]
}

export interface KnowledgeOverviewItem {
  label: string
  value: string
  trend?: string
  icon?: string
}
