import { useCallback } from 'react'
import { Box, IconButton, Text } from '@chakra-ui/react'
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
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'
import { AppHeader } from '@/shared/ui/app-header'

export const LoginPage = () => {
    const handleLoginClick = useCallback(async () => {
        let keycloakEndpoint = new URL(
            `https://backend-production-10ec.up.railway.app/api/v1/users/auth/login`
        )

        // let keycloakEndpoint = new URL(
        //     `http://localhost:8080/api/v1/users/auth/login`
        // )

        window.open(keycloakEndpoint, '_self')
    }, [])

    const navigate = useNavigate()

    const { isDesktop } = useDeviceDetect()

    return (
        <AuthPageBox>
            {isDesktop ? (
                <AppHeader />
            ) : (
                <AuthHeaderMobile
                    postfixElement={
                        <IconButton
                            _active={{ bg: 'gray.100' }}
                            aria-label='Закрыть'
                            background='transparent'
                            colorPalette='gray'
                            size='2xl'
                            transition='all 0.2s'
                            variant='ghost'
                            onClick={() => navigate({ to: '/' })}
                        >
                            <XIcon color='#27272A' size={24} />
                        </IconButton>
                    }
                />
            )}

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
