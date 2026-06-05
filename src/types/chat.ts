export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: number
  role: ChatRole
  content: string
  time: string
  sourcePath?: string
  confidence?: number
}

export interface SourceReference {
  id: number
  title: string
  type: string
  matchRate: number
  path?: string
}
