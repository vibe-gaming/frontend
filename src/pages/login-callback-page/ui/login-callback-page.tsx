import { useEffect, useRef } from 'react'
import { Center, Spinner, Text } from '@chakra-ui/react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAuth } from '@/entities/auth'
import { postUsersAuthToken } from '@/shared/api/generated'

const fetchTokens = async (code: string, state: string) => {
    const { access_token } = await postUsersAuthToken({
        code,
        state,
    })

    return { access_token }
}

export const LoginCallbackPage = () => {
    const { code, state } = useSearch({ from: '/_auth/login/callback' })
    const { setAuth, isAuthenticated, isUserRegistered, isLoading } = useAuth()
    const navigate = useNavigate()
    const tokenFetchedRef = useRef(false)

    useEffect(() => {
        // Если токен уже получен или пользователь уже авторизован, пропускаем
        if (isAuthenticated || tokenFetchedRef.current) {
            return
        }

        tokenFetchedRef.current = true

        fetchTokens(code, state)
            .then(({ access_token }) => {
                setAuth({ access_token: access_token ?? '' })
            })
            .catch((error) => {
                console.error('Ошибка при получении токена:', error)
                tokenFetchedRef.current = false // Сброс флага в случае ошибки
            })
    }, [code, state, isAuthenticated, setAuth])

    // Отдельный эффект для навигации после того, как профиль загружен
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            if (isUserRegistered) {
                toast.success('Вы успешно авторизованы')
                navigate({ to: '/benefits' })
            } else {
                navigate({ to: '/register/check-info' })
            }
        }
    }, [isAuthenticated, isUserRegistered, isLoading, navigate])

    return (
        <Center
            alignItems='center'
            bg='gray.50'
            flexDirection='column'
            gap='16px'
            minH='100dvh'
            px='16px'
        >
            <Spinner color='blue.500' size='xl' />
            <Text color='gray.600' fontSize='md' textAlign='center'>
                Выполняем вход через Госуслуги...
            </Text>
        </Center>
    )
}
