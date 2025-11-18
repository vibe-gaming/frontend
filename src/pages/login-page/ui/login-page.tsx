import { useCallback } from 'react'
import { Box, Button, Heading, IconButton, Text } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { XIcon } from 'lucide-react'

import { AuthHeaderMobile } from '@/entities/auth'
import { useDeviceDetect } from '@/shared/hooks/use-device-detect'
import { AppHeader } from '@/shared/ui/app-header'

export const LoginPage = () => {
    const handleLoginClick = useCallback(async () => {
        let keycloakEndpoint = new URL(`${import.meta.env.VITE_API_URL}/users/auth/login`)

        window.open(keycloakEndpoint, '_self')
    }, [])

    const navigate = useNavigate()

    const { isDesktop } = useDeviceDetect()

    return (
        <Box gap={4} minH='100dvh' w='100dvw'>
            {isDesktop ? (
                <AppHeader />
            ) : (
                <AuthHeaderMobile
                    postfixElement={
                        <IconButton
                            aria-label='Закрыть'
                            background='transparent'
                            onClick={() => navigate({ to: '/' })}
                        >
                            <XIcon color='#27272A' />
                        </IconButton>
                    }
                />
            )}
            <Box
                display='flex'
                flexDirection='column'
                marginLeft={isDesktop ? '16' : '4'}
                marginRight={isDesktop ? 'auto' : '4'}
                maxWidth='500px'
                mt={isDesktop ? '0' : '60px'}
            >
                <Heading
                    as='h1'
                    color='#27272A'
                    fontSize={isDesktop ? '4xl' : '2xl'}
                    fontWeight={700}
                    lineHeight='32px'
                >
                    Вход
                </Heading>

                <Box mt='16px'>
                    <Text color='#27272A' fontSize='md' lineHeight='24px'>
                        Авторизуйтесь через Госуслуги, чтобы увидеть льготы, которые подходят именно
                        вам
                    </Text>
                </Box>

                <Box mt={isDesktop ? '40px' : '16px'}>
                    <Button
                        bg='#2563EB'
                        borderRadius='2xl'
                        fontSize='xl'
                        h='64px'
                        w={isDesktop ? 'auto' : '100%'}
                        onClick={handleLoginClick}
                    >
                        Авторизоваться
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
