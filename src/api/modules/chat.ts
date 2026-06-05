import request from '@/api/request'
import type { ApiResponse } from '@/types/api'
import type { ChatMessage } from '@/types/chat'

export interface AskQuestionParams {
  question: string
  knowledgeIds?: number[]
}

export function askQuestion(data: AskQuestionParams) {
  return request.post<ApiResponse<ChatMessage>>('/chat/ask', data)
}

export function getChatHistory() {
  return request.get<ApiResponse<ChatMessage[]>>('/chat/history')
}
