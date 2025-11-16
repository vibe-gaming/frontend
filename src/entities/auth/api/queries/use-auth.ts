import { AxiosError } from 'axios'
import { atom } from 'jotai'
import { useAtom, useAtomValue } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

import { useGetUsersProfile } from '@/shared/api/generated'

export interface Auth {
    access_token: string
}

const persistentStorage = createJSONStorage<Auth | undefined>(() => localStorage)

// Атом для хранения токена аутентификации в localStorage
export const authAtom = atomWithStorage<Auth | undefined>(
    '@my-benefits/auth',
    undefined,
    persistentStorage,
    {
        getOnInit: true,
    }
)

// Производный атом для проверки аутентификации (стабильное значение)
const isAuthenticatedAtom = atom((get) => {
    const auth = get(authAtom)
    return Boolean(auth?.access_token)
})

/**
 * Хук для работы с аутентификацией (полная версия с запросом профиля)
 * Используйте только там, где действительно нужны данные профиля
 */
export const useAuth = () => {
    const [auth, setAuth] = useAtom(authAtom)

    const {
        data: profile,
        isLoading,
        isFetching,
        status,
    } = useGetUsersProfile({
        query: {
            // Запрашиваем профиль только если есть токен
            enabled: Boolean(auth?.access_token),
            // Не перезапрашивать при фокусе окна
            refetchOnWindowFocus: false,
            // Не перезапрашивать при переподключении
            refetchOnReconnect: false,
            // Не перезапрашивать при монтировании, если данные уже есть
            refetchOnMount: false,
            // Данные считаются актуальными 5 минут
            staleTime: 5 * 60 * 1000, // 5 минут
            // Храним данные в кеше 10 минут после последнего использования
            gcTime: 10 * 60 * 1000, // 10 минут
            retry(failureCount, error) {
                if (error instanceof AxiosError && error.response?.status === 401) {
                    return false
                }

                return failureCount < 3
            },
        },
    })

    const isAuthenticated = Boolean(auth?.access_token)

    const isUserRegistered: boolean = Boolean(profile?.registered_at)

    /**
     * Handle logout
     */
    // const onLogout = useCallback(async () => {
    //     const toastId = toast.loading('Выполняем выход...')

    //     try {
    //         /**
    //          * Clear refresh_token cookie
    //          */
    //         await getUsersLogout()

    //         /**
    //          * Clear the global auth state
    //          */
    //         setAuth(undefined)

    //         /**
    //          * Clear the axios instance headers
    //          */
    //         AXIOS_INSTANCE.defaults.headers.Authorization = ''

    //         /**
    //          * Clear of registered user
    //          */
    //         setRegisterUser(undefined)

    //         /**
    //          * Clear the tanstack-query cache
    //          */
    //         setTimeout(() => {
    //             queryClient.clear()
    //         }, 400)

    //         toast.success('Вы успешно вышли из аккаунта')
    //     } catch (error) {
    //         Sentry.captureException(error)
    //         toast.error('Ошибка при выполнении выхода')
    //     } finally {
    //         toast.dismiss(toastId)
    //     }
    // }, [queryClient, setAuth, setRegisterUser])

    return {
        auth,
        setAuth,
        profile,
        isAuthenticated,
        isUserRegistered,
        isLoading,
    }
}

/**
 * Облегчённый хук для проверки аутентификации без запроса профиля
 * Используйте для оптимизации производительности, когда данные профиля не нужны
 */
export const useAuthState = () => {
    const auth = useAtomValue(authAtom)
    const isAuthenticated = useAtomValue(isAuthenticatedAtom)

    return {
        auth,
        isAuthenticated,
    }
}
