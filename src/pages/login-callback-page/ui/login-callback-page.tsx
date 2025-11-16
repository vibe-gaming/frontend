import { useEffect } from 'react'
import { Center, Spinner, Text } from '@chakra-ui/react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { useAuth } from '@/entities/auth'
import { AXIOS_INSTANCE } from '@/shared/api'
import { postUsersAuthToken } from '@/shared/api/generated'

const fetchTokens = async (code: string, state: string) => {
    const { access_token } = await postUsersAuthToken({
        code,
        state,
    })

    AXIOS_INSTANCE.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    return { access_token }
}

export const LoginCallbackPage = () => {
    const { code, state } = useSearch({ from: '/_auth/login/callback' })
    const { setAuth, isAuthenticated, isUserRegistered } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            return
        }

        fetchTokens(code, state)
            .then(({ access_token }) => {
                setAuth({ access_token: access_token ?? '' })
                if (isUserRegistered) {
                    navigate({ to: '/benefits' })
                } else {
                    navigate({ to: '/register/check-info' })
                }
            })
            .catch(console.error)
    }, [code, state, isAuthenticated, setAuth, navigate, isUserRegistered])

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
