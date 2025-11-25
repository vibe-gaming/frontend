import React from 'react'

import type { Auth } from '@/entities/auth'
import { AXIOS_INSTANCE } from '@/shared/api'

const { VITE_API_URL, VITE_API_TIMEOUT } = import.meta.env

export const WithAxios = () => {
    React.useEffect(() => {
        /**
         * Устанавливаем базовый URL для axios перед тем, как приложение будет инициализировано
         */
        AXIOS_INSTANCE.defaults.baseURL = VITE_API_URL
        AXIOS_INSTANCE.defaults.timeout = VITE_API_TIMEOUT ? Number(VITE_API_TIMEOUT) : 10_000

        /**
         * Добавляем interceptor для автоматического добавления токена из localStorage
         */
        const requestInterceptor = AXIOS_INSTANCE.interceptors.request.use(
            (config) => {
                // Читаем токен из localStorage напрямую, чтобы избежать циклической зависимости с useAuth
                const authData = localStorage.getItem('@my-benefits/auth')
                if (authData) {
                    try {
                        const auth: Auth = JSON.parse(authData)
                        if (auth?.access_token) {
                            config.headers.Authorization = `Bearer ${auth.access_token}`
                        }
                    } catch (error) {
                        console.error('Error parsing auth data from localStorage:', error)
                    }
                }

                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        // Cleanup функция для удаления interceptor при размонтировании
        return () => {
            AXIOS_INSTANCE.interceptors.request.eject(requestInterceptor)
        }
    }, [])

    return null
}
