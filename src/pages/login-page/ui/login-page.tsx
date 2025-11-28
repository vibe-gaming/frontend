import { useCallback } from 'react'
import { Box, IconButton, Show, Text, useMediaQuery } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { XIcon } from 'lucide-react'

import {
    AuthButton,
    AuthButtonBox,
    AuthContent,
    AuthContentBox,
    AuthHeaderMobile,
    AuthHeading,
    AuthPageBox,
} from '@/entities/auth'

export const LoginPage = () => {
    const handleLoginClick = useCallback(async () => {
        let keycloakEndpoint = new URL(`${import.meta.env.VITE_API_URL}/users/auth/login`)

        window.open(keycloakEndpoint, '_self')
    }, [])
    const navigate = useNavigate()
    const [isMobile] = useMediaQuery(['(max-width: 767px)'])

    return (
        <AuthPageBox minH={{ base: 'calc(100dvh - 56px)', md: 'calc(100dvh - 144px)' }}>
            <Show when={isMobile}>
                <AuthHeaderMobile
                    postfixElement={
                        <IconButton
                            aria-label='Закрыть'
                            background='transparent'
                            size='2xl'
                            onClick={() => navigate({ to: '/' })}
                        >
                            <XIcon color='#27272A' size={24} />
                        </IconButton>
                    }
                />
            </Show>
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
