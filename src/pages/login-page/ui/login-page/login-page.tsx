import { Box, Button, Center, Heading, Image } from '@chakra-ui/react'

import { HeaderMobile } from '@/shared/ui/header-mobile'

export const LoginPage = () => {
    return (
        <Box minH={'100dvh'} paddingTop='56px' w={'100dvw'}>
            <HeaderMobile title={''} />
            <Heading
                as='h1'
                color={'#27272A'}
                fontSize='24px'
                fontWeight={700}
                lineHeight='32px'
                textAlign='center'
            >
                Войти через Госуслуги
            </Heading>
            <Center paddingTop='16px'>
                <Button size={'2xl'}>
                    <Image alt='Госуслуги' src={'../../assets/gosuslugi-logo.png'} />
                </Button>
            </Center>
        </Box>
    )
}
