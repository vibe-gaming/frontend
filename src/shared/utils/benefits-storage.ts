import type { V1BenefitResponse } from '@/shared/api/generated/entities/v1/BenefitResponse'

const STORAGE_KEY = '@my-benefits/offline-benefits'
const STORAGE_TIMESTAMP_KEY = '@my-benefits/offline-benefits-timestamp'

export interface StoredBenefits {
    benefits: V1BenefitResponse[]
    total: number
    timestamp: number
}

/**
 * Сохраняет льготы в localStorage для офлайн доступа
 */
export const saveBenefitsToStorage = (benefits: V1BenefitResponse[], total: number) => {
    try {
        const data: StoredBenefits = {
            benefits,
            total,
            timestamp: Date.now(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, String(Date.now()))
    } catch (error) {
        console.error('Failed to save benefits to localStorage:', error)
    }
}

/**
 * Получает сохраненные льготы из localStorage
 */
export const getBenefitsFromStorage = (): StoredBenefits | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return null

        const data: StoredBenefits = JSON.parse(stored)
        return data
    } catch (error) {
        console.error('Failed to get benefits from localStorage:', error)
        return null
    }
}

/**
 * Фильтрует сохраненные льготы по поисковому запросу (только по названию и описанию)
 */
export const filterStoredBenefits = (
    storedBenefits: V1BenefitResponse[],
    searchQuery: string
): V1BenefitResponse[] => {
    if (!searchQuery.trim()) {
        return storedBenefits
    }

    const query = searchQuery.toLowerCase().trim()
    return storedBenefits.filter((benefit) => {
        const titleMatch = benefit.title?.toLowerCase().includes(query)
        const descriptionMatch = benefit.description?.toLowerCase().includes(query)
        return titleMatch || descriptionMatch
    })
}

