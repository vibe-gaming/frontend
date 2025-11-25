import { useEffect, useState } from 'react'

/**
 * Хук для определения онлайн/офлайн статуса
 */
export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(() => {
        if (globalThis.window === undefined) return true

        return navigator.onLine
    })

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        globalThis.addEventListener('online', handleOnline)
        globalThis.addEventListener('offline', handleOffline)

        return () => {
            globalThis.removeEventListener('online', handleOnline)
            globalThis.removeEventListener('offline', handleOffline)
        }
    }, [])

    return isOnline
}
