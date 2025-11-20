import { useEffect } from 'react'
import { useMediaQuery } from '@chakra-ui/react'

import { useGetBenefits } from '@/shared/api/generated/hooks/useGetBenefits'
import type { V1BenefitsListResponse } from '@/shared/api/generated'
import { useOnlineStatus } from '@/shared/hooks/use-online-status'
import { saveBenefitsToStorage } from '@/shared/utils/benefits-storage'

/**
 * Компонент для предзагрузки всех льгот в фоне для офлайн доступа
 * Работает только на мобильных устройствах
 */
export const OfflineBenefitsPreloader = () => {
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"])
    const isMobile = !isDesktop
    const isOnline = useOnlineStatus()

    // Загрузка всех льгот в фоне для офлайн доступа (только на мобильных, только когда есть интернет)
    const { data: allBenefitsData } = useGetBenefits<V1BenefitsListResponse>(
        { limit: 100 }, // Загружаем все льготы
        {
            query: {
                enabled: isOnline && isMobile, // Только на мобильных, только когда есть интернет
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                staleTime: Infinity, // Не считаем данные устаревшими
            },
        }
    )

    // Сохраняем все льготы в localStorage когда они загружены
    useEffect(() => {
        if (isOnline && isMobile && allBenefitsData?.benefits) {
            console.log('Предзагрузка офлайн данных: сохранение', allBenefitsData.benefits.length, 'льгот')
            saveBenefitsToStorage(allBenefitsData.benefits, allBenefitsData.total || allBenefitsData.benefits.length)
        }
    }, [isOnline, isMobile, allBenefitsData])

    // Компонент не рендерит ничего визуального
    return null
}

