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
// В development используем прокси через Vite (/api), в production - полный URL
const getApiBaseURL = () => {
    // В Vite переменные окружения доступны через import.meta.env
    const apiUrl = import.meta.env.VITE_API_URL
    
    if (apiUrl) {
        // Убираем trailing slash если есть
        return apiUrl.replace(/\/$/, '')
    }
    
    // В development режиме используем прокси через Vite
    if (import.meta.env.DEV) {
        return '/api/v1'
    }
    
    // В production используем полный URL
    return 'https://backend-production-10ec.up.railway.app/api/v1'
}

export const AXIOS_INSTANCE = axios.create({
    baseURL: getApiBaseURL(),
    withCredentials: true,
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
