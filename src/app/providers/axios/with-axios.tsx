import React from 'react'

import { useAuth } from '@/entities/auth'
import { AXIOS_INSTANCE } from '@/shared/api'

const { VITE_API_URL, VITE_API_TIMEOUT } = import.meta.env

export const WithAxios = () => {
    const { auth } = useAuth()

    React.useEffect(() => {
        /**
         * Устанавливаем базовый URL для axios перед тем, как приложение будет инициализировано
         */
        AXIOS_INSTANCE.defaults.baseURL = VITE_API_URL
        AXIOS_INSTANCE.defaults.timeout = VITE_API_TIMEOUT ? Number(VITE_API_TIMEOUT) : 10_000
    }, [])

    React.useEffect(() => {
        if (auth?.access_token) {
            AXIOS_INSTANCE.defaults.headers.Authorization = `Bearer ${auth?.access_token}`
        }
    }, [auth])

    return null
}
