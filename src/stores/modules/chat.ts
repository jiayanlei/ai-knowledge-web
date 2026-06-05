import { defineStore } from 'pinia'
import type { ChatMessage } from '@/types/chat'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[]
  }),
  actions: {
    setMessages(messages: ChatMessage[]) {
      this.messages = messages
    },
    addMessage(message: ChatMessage) {
      this.messages.push(message)
    }
  }
})
