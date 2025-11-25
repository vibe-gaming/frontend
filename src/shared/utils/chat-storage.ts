import type { V1BenefitResponse } from '@/shared/api/generated'

const CHAT_STORAGE_KEY = 'chat_messages'

export interface ChatMessage {
    id: string
    text: string
    isBot: boolean
    timestamp: number
    benefits?: V1BenefitResponse[]
}

export const chatStorage = {
    getMessages: (): ChatMessage[] => {
        try {
            const stored = localStorage.getItem(CHAT_STORAGE_KEY)
            if (!stored) return []
            return JSON.parse(stored) as ChatMessage[]
        } catch {
            return []
        }
    },

    saveMessage: (message: ChatMessage): void => {
        try {
            const messages = chatStorage.getMessages()
            messages.push(message)
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
        } catch (error) {
            console.error('Failed to save message to localStorage:', error)
        }
    },

    clearMessages: (): void => {
        try {
            localStorage.removeItem(CHAT_STORAGE_KEY)
        } catch (error) {
            console.error('Failed to clear messages from localStorage:', error)
        }
    },

    saveMessages: (messages: ChatMessage[]): void => {
        try {
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
        } catch (error) {
            console.error('Failed to save messages to localStorage:', error)
        }
    },
}
