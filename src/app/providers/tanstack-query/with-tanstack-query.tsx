import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Не перезапрашивать автоматически при фокусе окна
            refetchOnWindowFocus: false,
            // Не перезапрашивать автоматически при переподключении
            refetchOnReconnect: false,
            // Не перезапрашивать автоматически при монтировании, если данные свежие
            refetchOnMount: false,
            // Данные считаются свежими 1 минуту по умолчанию
            staleTime: 60 * 1000, // 1 минута
            // Храним неиспользуемые данные в кеше 5 минут
            gcTime: 5 * 60 * 1000, // 5 минут
            // Повторные попытки только для сетевых ошибок
            retry: 1,
        },
    },
})

export function getContext() {
    return {
        queryClient,
    }
}

export const WithTanstackQuery: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
