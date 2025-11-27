import { useCallback } from 'react'
import { Box, Text } from '@chakra-ui/react'

import {
    AuthButton,
    AuthButtonBox,
    AuthContent,
    AuthContentBox,
    AuthHeading,
    AuthPageBox,
} from '@/entities/auth'

export const LoginPage = () => {
    const handleLoginClick = useCallback(async () => {
        let keycloakEndpoint = new URL(`${import.meta.env.VITE_API_URL}/users/auth/login`)

        window.open(keycloakEndpoint, '_self')
    }, [])

    return (
        <AuthPageBox>
            <AuthContentBox pt='36px'>
                <AuthHeading>Вход</AuthHeading>

                <AuthContent>
                    <Box maxW='500px' w='100%'>
                        <Text color='gray.800' fontSize={'lg'} lineHeight={'28px'}>
                            Авторизуйтесь через Госуслуги, чтобы увидеть льготы, которые подходят
                            именно вам
                        </Text>
                    </Box>

                    <AuthButtonBox>
                        <AuthButton onClick={handleLoginClick}>Авторизоваться</AuthButton>
                    </AuthButtonBox>
                </AuthContent>
            </AuthContentBox>
        </AuthPageBox>
    )
}
