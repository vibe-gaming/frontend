import { useCallback } from 'react'
import { Box, Button, Center, Heading, Image } from '@chakra-ui/react'

import { HeaderMobile } from '@/shared/ui/header-mobile'

export const LoginPage = () => {
    const handleLoginClick = useCallback(async () => {
        let keycloakEndpoint = new URL(`${import.meta.env.VITE_API_URL}/users/auth/login`)

        window.open(keycloakEndpoint, '_self')
    }, [])

    return (
        <Box bg='gray.50' minH='100dvh' paddingTop='56px' w='100dvw'>
            <HeaderMobile title='' />
            <Center px='16px'>
                <Box display='flex' flexDirection='column' gap='24px' w='100%'>
                    <Heading
                        as='h1'
                        color='#27272A'
                        fontSize='24px'
                        fontWeight={700}
                        lineHeight='32px'
                        textAlign='center'
                    >
                        Войти через Госуслуги
                    </Heading>
                    <Button
                        // _active={{ bg: '#0043b0' }}
                        // _hover={{ bg: '#0050d1' }}
                        bg='#fff'
                        border='2px solid #005FF9'
                        borderRadius='18px'
                        // disabled={isPending}
                        h='56px'
                        size='lg'
                        w='100%'
                        onClick={handleLoginClick}
                    >
                        <Image
                            alt='Госуслуги'
                            h='24px'
                            objectFit='contain'
                            src='/assets/gosuslugi.svg'
                        />
                    </Button>
                </Box>
            </Center>
        </Box>
    )
}
