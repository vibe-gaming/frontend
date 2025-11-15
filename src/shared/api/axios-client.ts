import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
// eslint-disable-next-line no-duplicate-imports
import axios from 'axios'

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
    baseURL?: string
    url?: string
    method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTIONS'
    params?: unknown
    data?: TData | FormData
    responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
    signal?: AbortSignal
    headers?: AxiosRequestConfig['headers']
}
/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
    data: TData
    status: number
    statusText: string
    headers: AxiosResponse['headers']
}

export type ErrorStruct = {
    /**
     * @type integer | undefined
     */
    error_code?: number
    /**
     * @type string | undefined
     */
    error_message?: string
}

export interface ErrorStructWithValidationErrors extends ErrorStruct {
    validation_errors?: {
        error_message: string
        field_key: string
    }[]
}

export type ResponseErrorConfig<TError = ErrorStructWithValidationErrors> = TError

// Получаем URL API из переменной окружения
// В development и production используем прокси (/api) для обхода CORS
const getApiBaseURL = () => {
    // В Vite переменные окружения доступны через import.meta.env
    const apiUrl = import.meta.env.VITE_API_URL
    
    // Если VITE_API_URL установлен, используем его (для кастомных конфигураций)
    if (apiUrl) {
        // Убираем trailing slash если есть
        return apiUrl.replace(/\/$/, '')
    }
    
    // Используем прокси через Vite (dev) или Netlify (production)
    // - В development: Vite прокси настроен в vite.config.ts
    // - В production: Netlify прокси настроен в netlify.toml
    // Это обходит CORS проблемы, так как запросы идут через тот же домен
    return '/api/v1'
}

export const AXIOS_INSTANCE = axios.create({
    baseURL: getApiBaseURL(),
    // withCredentials: false - используется JWT аутентификация (токены в заголовках, не cookies)
    // Если в будущем понадобятся cookies, установить true и настроить CORS на бэкенде
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})

const UNKNOWN_ERROR = {
    error_code: 7_355_608,
    error_message: 'Server unknown error',
}

export const axiosClient = async <TData, TError = unknown, TVariables = unknown>(
    config: RequestConfig<TVariables>
): Promise<ResponseConfig<TData>> => {
    const promise = AXIOS_INSTANCE.request<TData, ResponseConfig<TData>>(config).catch(
        (error: AxiosError<TError>) => {
            throw error.response?.data ?? UNKNOWN_ERROR
        }
    )

    return promise
}

export default axiosClient
